# Ruby on Rails 7+

## Quand activer
- Construction ou maintenance d'une application Rails 7+
- Implémentation des modèles ActiveRecord, associations, ou optimisation de requête
- Ajout de Hotwire (Turbo + Stimulus) pour l'interface utilisateur réactive sans JavaScript lourd
- Configuration des jobs Sidekiq en arrière-plan
- Configuration de Devise pour l'authentification
- Rédaction de specs de demande RSpec avec FactoryBot
- Déploiement avec Kamal

## Quand ne PAS utiliser
- Scripting Ruby pur sans implication de Rails
- Les constructions API uniquement où Turbo/Stimulus sont explicitement exclus
- Les bases de code Rails 6 ou plus anciennes avec des conventions significativement différentes (vérifier d'abord la version de Rails)

## Instructions

### Détection et correction des requêtes N+1

Ajouter la gem `bullet` au développement :

```ruby
# Gemfile
gem "bullet", group: :development
```

```ruby
# config/environments/development.rb
config.after_initialize do
  Bullet.enable        = true
  Bullet.alert         = true
  Bullet.rails_logger  = true
  Bullet.add_footer    = true
end
```

Corriger les N+1 détectés avec `includes` (ou `preload`/`eager_load` quand vous devez filtrer sur l'association) :

```ruby
# N+1: each post fires a query for its author
Post.all.each { |p| p.author.name }

# Fixed
Post.includes(:author).each { |p| p.author.name }

# When filtering on the association use eager_load (LEFT OUTER JOIN)
Post.eager_load(:author).where(authors: { active: true })

# Use select to limit columns fetched
Post.includes(:author).select("posts.id, posts.title, authors.name")
```

Ajouter des assertions de comptage de requêtes aux specs de demande pour détecter les régressions :

```ruby
expect { get "/posts" }.to make_database_queries(count: 2)
```

### Cadres Turbo vs flux Turbo

**Cadres Turbo** remplacent une région délimitée de la page par la réponse du serveur. Un cadre par demande.

```erb
<%# app/views/posts/index.html.erb %>
<%= turbo_frame_tag "posts_list" do %>
  <%= render @posts %>
<% end %>

<%# Clicking this link replaces the frame content, not the whole page %>
<%= link_to "Load more", posts_path(page: 2), data: { turbo_frame: "posts_list" } %>
```

**Flux Turbo** poussent plusieurs mutations DOM à grain fin à partir d'une réponse (ou à partir d'ActionCable). À utiliser quand une seule action doit mettre à jour plusieurs parties de la page simultanément.

```ruby
# app/controllers/posts_controller.rb
def create
  @post = Post.create!(post_params)
  respond_to do |format|
    format.turbo_stream  # renders create.turbo_stream.erb
    format.html { redirect_to posts_path }
  end
end
```

```erb
<%# app/views/posts/create.turbo_stream.erb %>
<%= turbo_stream.prepend "posts_list", partial: "posts/post", locals: { post: @post } %>
<%= turbo_stream.replace "post_count", partial: "posts/count" %>
<%= turbo_stream.update "flash", partial: "shared/flash" %>
```

Règle de décision : utiliser les cadres pour les remplacements de navigation simples ; utiliser les flux quand une seule action mutate plusieurs cibles DOM ou lors de la diffusion des mises à jour sur ActionCable.

### Cycle de vie du contrôleur Stimulus

```javascript
// app/javascript/controllers/toggle_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["menu"]
  static values  = { open: Boolean }

  // Lifecycle callbacks
  connect()    { /* DOM is ready, controller connected */ }
  disconnect() { /* controller removed from DOM */ }

  // Action handler
  toggle() {
    this.openValue = !this.openValue
  }

  // Value change callback (fires on connect and on every mutation)
  openValueChanged(value) {
    this.menuTarget.hidden = !value
  }
}
```

Câbler dans HTML :

```erb
<div data-controller="toggle">
  <button data-action="click->toggle#toggle">Menu</button>
  <nav data-toggle-target="menu" hidden>...</nav>
</div>
```

Garder les contrôleurs petits et composables. Un contrôleur par unité de comportement, pas par page.

### Structure de job Sidekiq et configuration de nouvelles tentatives

```ruby
# app/jobs/invoice_mailer_job.rb
class InvoiceMailerJob
  include Sidekiq::Job

  sidekiq_options queue: :mailers, retry: 5, backtrace: true

  sidekiq_retries_exhausted do |msg, ex|
    Sentry.capture_exception(ex, extra: { job: msg })
    # notify or dead-letter here
  end

  def perform(invoice_id)
    invoice = Invoice.find(invoice_id)
    InvoiceMailer.with(invoice:).receipt.deliver_now
  end
end

# Enqueue
InvoiceMailerJob.perform_async(invoice.id)
InvoiceMailerJob.perform_in(5.minutes, invoice.id)
InvoiceMailerJob.set(queue: :critical).perform_async(invoice.id)
```

Configurer le backoff de nouvelle tentative dans `config/initializers/sidekiq.rb` :

```ruby
Sidekiq.configure_server do |config|
  config.redis = { url: ENV.fetch("REDIS_URL") }
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV.fetch("REDIS_URL") }
end
```

Sidekiq Pro/Enterprise est nécessaire pour les vrais jobs uniques — pour l'open-source, utiliser `sidekiq-unique-jobs`.

### Gestion des credentials

Rails 7 utilise des credentials par environnement. Éditer avec :

```bash
EDITOR=vim rails credentials:edit --environment production
```

Accès dans le code :

```ruby
Rails.application.credentials.dig(:stripe, :secret_key)
Rails.application.credentials.sendgrid_api_key!  # raises if missing
```

Ne jamais valider `config/master.key` ou `config/credentials/production.key`. Les ajouter à `.gitignore` et fournir via variable d'environnement (`RAILS_MASTER_KEY`) dans CI et déploiement.

### Specs de demande RSpec

Les specs de demande testent la pile HTTP complète sans monter le serveur Rack complet. Les préférer aux specs de contrôleur.

```ruby
# spec/requests/posts_spec.rb
require "rails_helper"

RSpec.describe "Posts", type: :request do
  let(:user) { create(:user) }

  before { sign_in user }   # Devise test helper

  describe "GET /posts" do
    let!(:posts) { create_list(:post, 3, author: user) }

    it "returns published posts" do
      get posts_path
      expect(response).to have_http_status(:ok)
      expect(response.body).to include(posts.first.title)
    end
  end

  describe "POST /posts" do
    context "with valid params" do
      it "creates a post and redirects" do
        expect {
          post posts_path, params: { post: attributes_for(:post) }
        }.to change(Post, :count).by(1)
        expect(response).to redirect_to(Post.last)
      end
    end

    context "with invalid params" do
      it "renders unprocessable entity" do
        post posts_path, params: { post: { title: "" } }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
```

Conventions FactoryBot :
- Une usine par modèle dans `spec/factories/`
- Utiliser `create` pour les enregistrements persistés DB, `build` pour en mémoire
- Utiliser `create_list` pour les collections
- Utiliser `attributes_for` pour obtenir un hash simple pour les params

### Structure Kamal deploy.yml

```yaml
# config/deploy.yml
service: myapp
image: registry.example.com/myapp

servers:
  web:
    hosts:
      - 203.0.113.10
    labels:
      traefik.http.routers.myapp.rule: Host(`myapp.example.com`)
  worker:
    hosts:
      - 203.0.113.11
    cmd: bundle exec sidekiq

registry:
  server: registry.example.com
  username:
    - KAMAL_REGISTRY_USERNAME
  password:
    - KAMAL_REGISTRY_PASSWORD

env:
  clear:
    RAILS_ENV: production
    WEB_CONCURRENCY: "2"
  secret:
    - RAILS_MASTER_KEY
    - DATABASE_URL
    - REDIS_URL

accessories:
  db:
    image: postgres:16
    host: 203.0.113.10
    port: 5432
    env:
      secret:
        - POSTGRES_PASSWORD

traefik:
  options:
    publish:
      - "443:443"
    volume:
      - "/letsencrypt/acme.json:/letsencrypt/acme.json"
```

Déployer :

```bash
kamal setup          # first deploy — provisions and starts everything
kamal deploy         # subsequent deploys
kamal rollback       # roll back to previous image
kamal app logs -f    # tail logs
```

## Exemple

Ajout d'un `CommentJob` qui envoie une notification Slack après la création d'un commentaire, testée de bout en bout :

```ruby
# app/jobs/comment_notify_job.rb
class CommentNotifyJob
  include Sidekiq::Job
  sidekiq_options queue: :default, retry: 3

  def perform(comment_id)
    comment = Comment.includes(:post, :author).find(comment_id)
    SlackNotifier.post(
      channel: "#activity",
      text: "#{comment.author.name} commented on #{comment.post.title}"
    )
  end
end

# app/models/comment.rb
after_create_commit -> { CommentNotifyJob.perform_async(id) }

# spec/jobs/comment_notify_job_spec.rb
RSpec.describe CommentNotifyJob, type: :job do
  it "posts to Slack" do
    comment = create(:comment)
    allow(SlackNotifier).to receive(:post)
    described_class.new.perform(comment.id)
    expect(SlackNotifier).to have_received(:post).with(
      hash_including(channel: "#activity")
    )
  end
end
```

---
