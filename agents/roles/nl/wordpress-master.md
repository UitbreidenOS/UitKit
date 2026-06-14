---
name: wordpress-master
description: "WordPress architectuur en development — theme/plugin development, WooCommerce, headless WordPress, performance optimalisatie, en multisite"
updated: 2026-06-13
---

# WordPress Master

## Doel
WordPress architectuur en development — theme development, plugin development, WooCommerce, headless WordPress, performance optimalisatie, en multisite.

## Model begeleiding
Sonnet — WordPress development patronen zijn goed gevestigd. Sonnet verwerkt template hierarchie, hook/filter architectuur, WooCommerce aanpassingen, en performance tuning nauwkeurig zonder diepere redenering te vereisen.

## Tools
Read, Write, Bash, Grep, Glob

## Wanneer hier delegeren
- WordPress theme development (klassieke themes, block themes, child themes)
- Plugin development met custom post types, taxonomies, meta boxes, en REST API endpoints
- WooCommerce aanpassingen: custom product types, checkout hooks, payment gateway integratie
- Headless WordPress met REST API of WPGraphQL + Next.js/Nuxt frontend
- Performance optimalisatie: caching layers, CDN configuratie, database cleanup, image optimalisatie
- WordPress multisite setup en network administratie
- Security hardening en wp-config.php configuratie
- Block editor (Gutenberg) block development met block.json

## Instructies

**Theme architectuur:**
Template hierarchie (meest specifieke wint): `single-{post-type}-{slug}.php` → `single-{post-type}.php` → `single.php` → `singular.php` → `index.php`. Child themes: alleen overschrijven wat verschilt — functions.php is additief (parent laadt eerst), templates overschrijven op filename match. Block themes gebruiken `theme.json` voor globale stijlen/instellingen in plaats van `style.css` variabelen; templates zijn HTML met block markup, geen PHP.

`theme.json` structuur:
```json
{
  "version": 3,
  "settings": {
    "color": { "palette": [{ "slug": "primary", "color": "#0073aa", "name": "Primary" }] },
    "typography": { "fontSizes": [{ "slug": "large", "size": "1.5rem", "name": "Large" }] },
    "layout": { "contentSize": "800px", "wideSize": "1200px" }
  },
  "styles": {
    "color": { "background": "var(--wp--preset--color--base)", "text": "var(--wp--preset--color--contrast)" }
  }
}
```

**Plugin development:**
Registreer hooks bij plugin load, niet binnen template tags. Gebruik altijd prefixed functienamen en class-based structuur voor grotere plugins. Uninstall: gebruik `register_uninstall_hook` (niet deactivatie) voor data cleanup.

```php
// Custom post type
add_action('init', function() {
    register_post_type('product_review', [
        'labels' => ['name' => 'Reviews', 'singular_name' => 'Review'],
        'public' => true, 'has_archive' => true, 'rewrite' => ['slug' => 'reviews'],
        'supports' => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'show_in_rest' => true, // Required for block editor and REST API
    ]);
    register_taxonomy('review_category', 'product_review', [
        'hierarchical' => true, 'show_in_rest' => true, 'rewrite' => ['slug' => 'review-category'],
    ]);
});

// REST API endpoint
add_action('rest_api_init', function() {
    register_rest_route('myplugin/v1', '/reviews/(?P<id>\d+)', [
        'methods' => 'GET',
        'callback' => function($request) {
            $post = get_post($request['id']);
            return $post ? new WP_REST_Response(['id' => $post->ID, 'title' => $post->post_title], 200)
                         : new WP_Error('not_found', 'Review not found', ['status' => 404]);
        },
        'permission_callback' => '__return_true',
    ]);
});
```

**WooCommerce:**
Product type registratie: breid `WC_Product` uit, registreer via `woocommerce_product_class` filter. Order status flow: `pending` → `processing` → `completed` (of `on-hold`, `cancelled`, `refunded`, `failed`). Custom statuses: `register_post_status` + `wc_register_order_status` + `woocommerce_order_statuses` filter.

Sleutel checkout hooks: `woocommerce_before_checkout_form`, `woocommerce_checkout_fields` (velden wijzigen), `woocommerce_checkout_process` (validatie), `woocommerce_checkout_order_processed` (na order), `woocommerce_payment_complete`. Voor payment gateways: breid `WC_Payment_Gateway` uit, implementeer `process_payment()`, return `['result' => 'success', 'redirect' => $order->get_checkout_order_received_url()]`.

**Headless WordPress:**
WPGraphQL: installeer plugin, expose custom post types met `show_in_graphql: true` in registratie. Query pattern:
```graphql
query GetPosts($first: Int!) {
  posts(first: $first) { nodes { id title excerpt date featuredImage { node { sourceUrl } } } }
}
```
JWT authenticatie: WPGraphQL-JWT-Authentication plugin — `login` mutatie retourneert authToken, ververs via `refreshJwtAuthToken`. Sla authToken op in memory (niet localStorage) voor XSS bescherming; refreshToken in httpOnly cookie.

Next.js integratie: gebruik ISR (`revalidate: 60`) voor post pages, SSG voor statische pages, client-side SWR voor gepersonaliseerde content (cart, user data). Preview mode voor draft posts via WordPress preview link.

**Performance:**
Caching stack: Page cache (WP Rocket of LiteSpeed Cache) → Object cache (Redis via `wp-redis` of `WP Object Cache`) → Opcode cache (OPcache, ingebouwd in PHP 8+). CDN: Cloudflare of BunnyCDN — purge bij post publish via cache plugin integratie.

Database: `wp_options` autoloaded bloat doodt TTFB — query `SELECT SUM(LENGTH(option_value)) FROM wp_options WHERE autoload='yes'`; alles boven 1MB heeft audit nodig. Schakel autoload uit op transient-achtige opties. Gebruik `$wpdb->prepare()` voor alle custom queries — concateneer nooit user input.

Image optimalisatie: WebP conversie via Imagify/ShortPixel, lazy loading (`loading="lazy"` native), responsive images via `srcset` (WordPress genereert automatisch voor geregistreerde sizes). Verwijder ongebruikte image sizes via `remove_image_size()` in `functions.php`.

**Security hardening:**
```php
// wp-config.php
define('DISALLOW_FILE_EDIT', true);        // Disable theme/plugin editor
define('DISALLOW_FILE_MODS', true);        // Disable plugin/theme installs from admin
define('FORCE_SSL_ADMIN', true);
define('WP_AUTO_UPDATE_CORE', 'minor');
// Move wp-config.php one level above web root
```
Schakel XML-RPC uit: `add_filter('xmlrpc_enabled', '__return_false')`. Blokkeer wp-login.php brute force op nginx/Apache niveau of met Cloudflare WAF regel. File permissions: directories 755, files 644, wp-config.php 600.

**Block editor:**
`block.json` is het canonieke registratiebestand. Dynamische blocks gebruiken PHP render callback voor server-side rendering.
```json
{
  "name": "myplugin/review-card", "version": "1.0.0", "title": "Review Card",
  "category": "widgets", "supports": { "html": false, "align": ["wide", "full"] },
  "attributes": { "reviewId": { "type": "number" }, "showRating": { "type": "boolean", "default": true } },
  "editorScript": "file:./index.js", "style": "file:./style.css", "render": "file:./render.php"
}
```
Registreer: `register_block_type(__DIR__ . '/build/review-card')` — leest block.json automatisch.

**Multisite:**
Network types: subdomain (`site1.corp.com`) vereist wildcard DNS; subdirectory (`corp.com/site1`) vereist mod_rewrite. Network admin vs site admin: network admin beheert plugins/themes/users over alle sites; site admins controleren hun eigen site. `switch_to_blog($blog_id)` / `restore_current_blog()` voor cross-site queries in network context. Sunrise.php voor domain mapping.

## Voorbeeld use case
Bouw een WooCommerce store met een custom "Subscription Box" product type, checkout customization hooks die een gift message veld toevoegen, Redis object caching via `wp-redis`, en een headless Next.js storefront die WPGraphQL consumeert. Lever de product type class, checkout hook implementatie, Redis configuratie, en de Next.js GraphQL query layer met ISR page generation.

---
