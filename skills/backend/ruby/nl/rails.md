# Ruby on Rails 7+

## Wanneer activeren
- Bouwen of beheren van Rails 7+ applicatie
- Implementeren van ActiveRecord models, associations, of query optimization
- Toevoegen van Hotwire (Turbo + Stimulus) voor reactive UI zonder heavy JavaScript
- Instellen van Sidekiq background jobs
- Configureren van Devise voor authentication
- Schrijven van RSpec request specs met FactoryBot
- Deployen met Kamal

## Wanneer NIET gebruiken
- Pure Ruby scripting zonder Rails involvement
- API-only builds waarbij Turbo/Stimulus expliciet excluded zijn
- Rails 6 of oudere codebases met significant ander conventions (controleer Rails version eerst)

## Instructies

### N+1 Query Detection and Fix

Voeg `bullet` gem toe aan development:

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

Fix gedetecteerde N+1s met `includes` (of `preload`/`eager_load` wanneer je moet filteren op association):

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

### Turbo Frames vs Turbo Streams

**Turbo Frames** vervangen bounded region van page met server response. Één frame per request.

```erb
<%# app/views/posts/index.html.erb %>
<%= turbo_frame_tag "posts_list" do %>
  <%= render @posts %>
<% end %>

<%# Clicking this link replaces the frame content, not the whole page %>
<%= link_to "Load more", posts_path(page: 2), data: { turbo_frame: "posts_list" } %>
```

**Turbo Streams** pushen multiple fine-grained DOM mutations van één response (of van ActionCable). Gebruik wanneer single action meerdere parts van page moet updaten tegelijk.

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

Decision rule: gebruik Frames voor eenvoudige navigation replacements; gebruik Streams wanneer één action meerdere DOM targets muteert of wanneer broadcasting updates over ActionCable.

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

### RSpec Request Specs

Request specs testen full HTTP stack zonder mounting full Rack server. Prefer ze over controller specs.

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

---
