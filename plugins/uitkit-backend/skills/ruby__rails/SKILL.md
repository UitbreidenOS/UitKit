---
name: "rails"
description: "- Building or maintaining a Rails 7+ application"
---

# Ruby on Rails 7+

## When to activate
- Building or maintaining a Rails 7+ application
- Implementing ActiveRecord models, associations, or query optimization
- Adding Hotwire (Turbo + Stimulus) for reactive UI without heavy JavaScript
- Setting up Sidekiq background jobs
- Configuring Devise for authentication
- Writing RSpec request specs with FactoryBot
- Deploying with Kamal

## When NOT to use
- Pure Ruby scripting with no Rails involvement
- API-only builds where Turbo/Stimulus are explicitly excluded
- Rails 6 or older codebases with significantly different conventions (check Rails version first)

## Instructions

### N+1 Query Detection and Fix

Add the `bullet` gem to development:

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

Fix detected N+1s with `includes` (or `preload`/`eager_load` when you need to filter on the association):

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

Add query count assertions to request specs to catch regressions:

```ruby
expect { get "/posts" }.to make_database_queries(count: 2)
```

### Turbo Frames vs Turbo Streams

**Turbo Frames** replace a bounded region of the page with the server response. One frame per request.

```erb
<%# app/views/posts/index.html.erb %>
<%= turbo_frame_tag "posts_list" do %>
  <%= render @posts %>
<% end %>

<%# Clicking this link replaces the frame content, not the whole page %>
<%= link_to "Load more", posts_path(page: 2), data: { turbo_frame: "posts_list" } %>
```

**Turbo Streams** push multiple fine-grained DOM mutations from one response (or from ActionCable). Use when a single action must update several parts of the page simultaneously.

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

Decision rule: use Frames for simple navigation replacements; use Streams when one action mutates multiple DOM targets or when broadcasting updates over ActionCable.

### Stimulus Controller Lifecycle

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

Wire up in HTML:

```erb
<div data-controller="toggle">
  <button data-action="click->toggle#toggle">Menu</button>
  <nav data-toggle-target="menu" hidden>...</nav>
</div>
```

Keep controllers small and composable. One controller per behavior unit, not per page.

### Sidekiq Job Structure and Retry Config

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

Configure retry back-off in `config/initializers/sidekiq.rb`:

```ruby
Sidekiq.configure_server do |config|
  config.redis = { url: ENV.fetch("REDIS_URL") }
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV.fetch("REDIS_URL") }
end
```

Sidekiq Pro/Enterprise is needed for true unique jobs — for open-source, use `sidekiq-unique-jobs`.

### Credentials Management

Rails 7 uses per-environment credentials. Edit with:

```bash
EDITOR=vim rails credentials:edit --environment production
```

Access in code:

```ruby
Rails.application.credentials.dig(:stripe, :secret_key)
Rails.application.credentials.sendgrid_api_key!  # raises if missing
```

Never commit `config/master.key` or `config/credentials/production.key`. Add them to `.gitignore` and supply via environment variable (`RAILS_MASTER_KEY`) in CI and deployment.

### RSpec Request Specs

Request specs test the full HTTP stack without mounting the full Rack server. Prefer them over controller specs.

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

FactoryBot conventions:
- One factory per model in `spec/factories/`
- Use `create` for DB-persisted records, `build` for in-memory
- Use `create_list` for collections
- Use `attributes_for` to get a plain hash for params

### Kamal deploy.yml Structure

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

Deploy:

```bash
kamal setup          # first deploy — provisions and starts everything
kamal deploy         # subsequent deploys
kamal rollback       # roll back to previous image
kamal app logs -f    # tail logs
```

## Example

Adding a `CommentJob` that posts a Slack notification after a comment is created, tested end-to-end:

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
