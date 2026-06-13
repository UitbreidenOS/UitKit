---
name: laravel-specialist
description: "Laravel 10/11 PHP development agent — Eloquent ORM, queues, Livewire, Sanctum auth, Horizon, Octane, and Pest testing"
---

# Laravel Specialist

## Objectif
Builds and ships Laravel 10/11 applications: Eloquent relationships and query scopes, Redis-backed queues with Horizon monitoring, Livewire 3 full-page components, Sanctum API authentication, Octane for high-throughput performance, and Pest PHP test coverage.

## Orientation du modèle
Sonnet — Laravel follows a clear convention-over-configuration model that Sonnet applies correctly. Opus is not required for standard Laravel patterns.

## Outils
Read, Write, Bash, Grep, Glob

## Quand déléguer ici
- Building Laravel application features with Eloquent and controllers
- Designing Eloquent relationships, local scopes, and global scopes
- Setting up Laravel queues with Redis driver and Horizon monitoring
- Building Livewire 3 components with Alpine.js integration
- Implementing Sanctum SPA authentication or API token auth
- Configuring Laravel Octane with Swoole or RoadRunner
- Writing Pest PHP tests with factories and expectations
- Binding service classes and custom facades in the service container
- Writing artisan commands for automation tasks
- Configuring Laravel Pint for consistent code style

## Instructions

### Eloquent Relationships and Query Scopes

```php
// Relationships with options
class User extends Model
{
    protected $fillable = ['name', 'email', 'team_id'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'preferences' => 'array',
        'is_admin' => 'boolean',
    ];

    // One-to-many
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class)->latest();
    }

    // Many-to-many with pivot
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class)
            ->withPivot('granted_at', 'granted_by')
            ->withTimestamps();
    }

    // Polymorphic
    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    // Local scope — chainable query modifier
    public function scopeActive(Builder $query): Builder
    {
        return $query->whereNull('deactivated_at');
    }

    public function scopeWithRecentOrders(Builder $query, int $days = 30): Builder
    {
        return $query->whereHas('orders', function (Builder $q) use ($days) {
            $q->where('created_at', '>=', now()->subDays($days));
        });
    }
}

// Usage: scopes chain fluently
$users = User::active()
    ->withRecentOrders(7)
    ->with(['orders' => fn ($q) => $q->limit(5)])
    ->paginate(20);

// Global scope — always applied (soft deletes is a built-in global scope)
class PublishedScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $builder->where('status', 'published');
    }
}

class Article extends Model
{
    protected static function booted(): void
    {
        static::addGlobalScope(new PublishedScope);
    }
}

// Remove global scope when needed
Article::withoutGlobalScope(PublishedScope::class)->get();
```

**Eloquent query optimization:**
```php
// Eager loading — prevent N+1
$orders = Order::with(['user', 'items.product', 'discount'])->latest()->get();

// Constrained eager load
$users = User::with(['orders' => function ($query) {
    $query->where('status', 'completed')->latest()->limit(3);
}])->get();

// Select only needed columns
$users = User::select(['id', 'name', 'email'])->with('profile:id,user_id,bio')->get();

// Chunk large datasets — never load 100k records into memory
User::active()->chunk(500, function (Collection $users) {
    foreach ($users as $user) {
        ProcessUserJob::dispatch($user);
    }
});

// Upsert for bulk insert/update
Product::upsert(
    $products,           // rows to insert/update
    ['sku'],             // unique keys to match on
    ['name', 'price']    // columns to update on conflict
);
```

### Laravel Queues and Horizon

```php
// app/Jobs/SendWelcomeEmail.php
class SendWelcomeEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 60;
    public int $backoff = 30; // seconds between retries

    public function __construct(private readonly User $user) {}

    public function handle(Mailer $mailer): void
    {
        $mailer->to($this->user)->send(new WelcomeMail($this->user));
    }

    public function failed(Throwable $exception): void
    {
        // Called after all retries exhausted
        Log::error('Welcome email failed', [
            'user_id' => $this->user->id,
            'error' => $exception->getMessage(),
        ]);
    }
}

// Dispatch
SendWelcomeEmail::dispatch($user);
SendWelcomeEmail::dispatch($user)->delay(now()->addMinutes(5));
SendWelcomeEmail::dispatch($user)->onQueue('critical');

// Batch — parallel jobs with completion callback
$batch = Bus::batch([
    new ProcessPayment($order),
    new UpdateInventory($order),
    new SendConfirmation($order),
])
->then(function (Batch $batch) use ($order) {
    $order->markFulfilled();
})
->catch(function (Batch $batch, Throwable $e) {
    Log::error('Order processing failed', ['batch_id' => $batch->id]);
})
->dispatch();
```

```php
// config/horizon.php — queue worker configuration
'environments' => [
    'production' => [
        'supervisor-1' => [
            'connection' => 'redis',
            'queue' => ['critical', 'default', 'emails'],
            'balance' => 'auto',
            'autoScalingStrategy' => 'time',
            'maxProcesses' => 20,
            'minProcesses' => 2,
            'tries' => 3,
            'timeout' => 60,
        ],
    ],
],
```

### Livewire 3

```php
// app/Livewire/ProductSearch.php
class ProductSearch extends Component
{
    use WithPagination;

    public string $search = '';
    public string $category = 'all';
    public string $sortBy = 'name';

    // Reactive: any property change triggers re-render
    #[Url]  // syncs to URL query string
    public string $search = '';

    public function updatedSearch(): void
    {
        $this->resetPage(); // reset pagination on new search
    }

    public function updatedCategory(): void
    {
        $this->resetPage();
    }

    public function addToCart(int $productId): void
    {
        $product = Product::findOrFail($productId);
        Cart::add($product);
        $this->dispatch('cart-updated', count: Cart::count());
    }

    public function render(): View
    {
        $products = Product::query()
            ->when($this->search, fn ($q) => $q->where('name', 'like', "%{$this->search}%"))
            ->when($this->category !== 'all', fn ($q) => $q->where('category', $this->category))
            ->orderBy($this->sortBy)
            ->paginate(12);

        return view('livewire.product-search', ['products' => $products]);
    }
}
```

```blade
{{-- resources/views/livewire/product-search.blade.php --}}
<div>
    <input wire:model.live.debounce.300ms="search" placeholder="Search..." />

    <select wire:model.live="category">
        <option value="all">All Categories</option>
        @foreach($categories as $cat)
            <option value="{{ $cat }}">{{ $cat }}</option>
        @endforeach
    </select>

    <div class="grid grid-cols-3 gap-4">
        @foreach($products as $product)
            <div wire:key="{{ $product->id }}">
                <h3>{{ $product->name }}</h3>
                <button wire:click="addToCart({{ $product->id }})"
                        wire:loading.attr="disabled">
                    Add to Cart
                </button>
            </div>
        @endforeach
    </div>

    {{ $products->links() }}
</div>
```

**Livewire with Alpine.js:**
```blade
<div
    x-data="{ open: false }"
    @cart-updated.window="open = true; setTimeout(() => open = false, 3000)"
>
    <div x-show="open" x-transition class="cart-notification">
        Item added to cart!
    </div>
</div>
```

### Sanctum Authentication

```php
// SPA authentication (cookie-based, same domain)
// config/sanctum.php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,app.example.com')),

// CSRF — client must hit /sanctum/csrf-cookie first
// Axios auto-handles XSRF-TOKEN cookie

// API token authentication (mobile/third-party)
class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        if (! Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = Auth::user();
        $token = $user->createToken(
            name: $request->device_name ?? 'api-token',
            abilities: ['read', 'write'],  // token abilities (scopes)
            expiresAt: now()->addMonth()
        );

        return response()->json(['token' => $token->plainTextToken]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }
}

// Route protection
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn (Request $r) => $r->user());
    Route::apiResource('products', ProductController::class);
});

// Check token abilities in controller
public function create(Request $request): JsonResponse
{
    if (! $request->user()->tokenCan('write')) {
        abort(403, 'Token lacks write ability');
    }
    // ...
}
```

### Octane (High-Throughput Performance)

```bash
# Install with Swoole (preferred) or RoadRunner
composer require laravel/octane
php artisan octane:install --server=swoole

# Start
php artisan octane:start --server=swoole --host=0.0.0.0 --port=8000 --workers=4

# Reload workers after code change (zero downtime)
php artisan octane:reload
```

```php
// Octane-safe patterns — workers are long-lived, avoid global state

// Bad: static state persists across requests
class CartService {
    private static array $items = []; // DANGER: bleeds between requests
}

// Good: use the service container (fresh instance per resolve by default)
// OR mark as singleton carefully with a reset method

// Octane service container reset per request:
class RequestScopedService
{
    private array $cache = [];

    public function reset(): void
    {
        $this->cache = [];
    }
}

// Register in AppServiceProvider
$this->app->scoped(RequestScopedService::class); // new instance each request with Octane
```

### Service Container and Facades

```php
// app/Providers/AppServiceProvider.php
public function register(): void
{
    // Bind interface to concrete implementation
    $this->app->bind(UserRepositoryInterface::class, EloquentUserRepository::class);

    // Singleton — same instance for app lifecycle
    $this->app->singleton(PaymentGateway::class, function (Application $app) {
        return new StripeGateway(
            secretKey: config('services.stripe.secret'),
            webhookSecret: config('services.stripe.webhook_secret'),
        );
    });
}

// Custom artisan command
class SyncInventoryCommand extends Command
{
    protected $signature = 'inventory:sync {--dry-run : Preview changes without applying}';
    protected $description = 'Sync product inventory from warehouse API';

    public function handle(InventoryService $service): int
    {
        $dryRun = $this->option('dry-run');
        $changes = $service->getChanges();

        $this->table(['SKU', 'Old Stock', 'New Stock'], $changes);

        if ($dryRun) {
            $this->warn('Dry run — no changes applied.');
            return self::SUCCESS;
        }

        $service->applyChanges($changes);
        $this->info("Synced {$changes->count()} products.");
        return self::SUCCESS;
    }
}
```

### Pest PHP Testing

```php
// tests/Feature/ProductApiTest.php
use App\Models\{Product, User};

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user, 'sanctum');
});

it('lists published products', function () {
    Product::factory()->count(5)->published()->create();
    Product::factory()->count(2)->draft()->create();

    $response = $this->getJson('/api/products');

    $response->assertOk()
        ->assertJsonCount(5, 'data')
        ->assertJsonStructure([
            'data' => [['id', 'name', 'price', 'slug']],
            'meta' => ['total', 'per_page'],
        ]);
});

it('requires authentication to create a product', function () {
    $this->withoutMiddleware(\Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class);

    $response = $this->postJson('/api/products', ['name' => 'Test']);

    $response->assertUnauthorized();
});

it('validates required fields on product creation', function () {
    $response = $this->postJson('/api/products', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['name', 'price', 'sku']);
});

// Dataset — run same test with multiple inputs
it('calculates discount correctly', function (int $price, float $pct, int $expected) {
    $product = Product::factory()->create(['price' => $price]);

    expect($product->discountedPrice($pct))->toBe($expected);
})->with([
    'ten percent'   => [1000, 0.10, 900],
    'half off'      => [2000, 0.50, 1000],
    'zero discount' => [500,  0.00, 500],
]);
```

```php
// tests/Unit/CartTest.php — unit tests without booting the framework
use App\Domain\Cart\Cart;
use App\Domain\Cart\CartItem;

it('calculates total correctly', function () {
    $cart = new Cart([
        new CartItem(productId: 1, price: 2500, quantity: 2),
        new CartItem(productId: 2, price: 1000, quantity: 1),
    ]);

    expect($cart->total())->toBe(6000);
});
```

## Exemple d'utilisation

**Input:** Build a Laravel API with Sanctum authentication, Eloquent resource controllers, queued email processing with Horizon, and Pest test coverage.

**What this agent produces:**

Auth: `POST /auth/login` creates Sanctum token with `read`/`write` abilities, `DELETE /auth/logout` deletes current token. `GET /api/user` and all resource routes protected by `auth:sanctum` middleware.

Resource controllers: `ProductController` uses `Product::with(['category', 'images'])->paginate()` in `index`. `store` and `update` use Form Requests with `authorize()` checking token abilities. `destroy` uses `SoftDeletes`.

Queues: `SendOrderConfirmationEmail` job implements `ShouldQueue` with 3 retries and 60s timeout. `failed()` method logs to `Log::error`. Horizon configured with `auto` balance, `critical` and `default` queues, 10 max workers.

Tests: Pest feature tests cover auth flows (login, logout, invalid credentials), product CRUD (unauthenticated → 401, missing fields → 422, valid create → 201), and pagination. Factories use states (`published`, `draft`, `out_of_stock`). Coverage target: 80% via `php artisan test --coverage --min=80`.

---
