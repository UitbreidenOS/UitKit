# Laravel 11

## Wanneer activeren
- Bouwen of beheren van Laravel 11 applicatie
- Ontwerpen van Eloquent models, relationships, en query scopes
- Implementeren van queued jobs met Laravel Horizon
- Bouwen van reactive UI met Livewire 3
- Instellen van Sanctum voor API token of SPA authentication
- Schrijven van Pest tests
- Tunen van performance met Laravel Octane

## Wanneer NIET gebruiken
- Laravel versies voor 10 waarbij APIs significant verschillen (controleer `composer show laravel/framework`)
- Standalone PHP scripts zonder Laravel framework involvement
- Lumen of Symfony projecten

## Instructies

### Eloquent Relationships and Query Scopes

Definieer relationships rechtstreeks op model:

```php
// app/Models/Post.php
class Post extends Model
{
    protected $fillable = ['title', 'body', 'published_at', 'user_id'];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    // Relationships
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class)->withTimestamps();
    }

    // Local query scope
    public function scopePublished(Builder $query): void
    {
        $query->whereNotNull('published_at')
              ->where('published_at', '<=', now());
    }

    public function scopeByAuthor(Builder $query, int $userId): void
    {
        $query->where('user_id', $userId);
    }
}

// Usage
Post::published()->byAuthor($userId)->with('author', 'tags')->paginate(20);
```

Altijd eager load associations in list queries. Gebruik `withCount` voor aggregate counts zonder full collection load:

```php
Post::published()->withCount('comments')->get();
// Adds comments_count attribute to each Post
```

### Queue Job Class Structure

```php
// app/Jobs/SendInvoiceEmail.php
class SendInvoiceEmail implements ShouldQueue
{
    use Queueable, Dispatchable, InteractsWithQueue, SerializesModels;

    public int $tries = 5;
    public int $timeout = 30;
    public int $backoff = 60;   // seconds between retries

    public function __construct(
        private readonly Invoice $invoice,
    ) {}

    public function handle(InvoiceMailer $mailer): void
    {
        $mailer->send($this->invoice);
    }

    public function failed(Throwable $exception): void
    {
        Log::error('Invoice email failed', [
            'invoice_id' => $this->invoice->id,
            'error' => $exception->getMessage(),
        ]);
    }
}

// Dispatch
SendInvoiceEmail::dispatch($invoice);
SendInvoiceEmail::dispatch($invoice)->delay(now()->addMinutes(5));
SendInvoiceEmail::dispatch($invoice)->onQueue('mailers');
```

Configureer Horizon queues in `config/horizon.php`:

```php
'environments' => [
    'production' => [
        'supervisor-1' => [
            'connection' => 'redis',
            'queue'      => ['default', 'mailers', 'critical'],
            'processes'  => 10,
            'tries'      => 3,
            'timeout'    => 60,
        ],
    ],
],
```

### Livewire 3 Component Lifecycle

```php
// app/Livewire/PostForm.php
class PostForm extends Component
{
    #[Validate('required|min:3')]
    public string $title = '';

    #[Validate('required|min:10')]
    public string $body = '';

    // Lifecycle hooks
    public function mount(Post $post = null): void
    {
        if ($post) {
            $this->title = $post->title;
            $this->body  = $post->body;
        }
    }

    // Runs on every Livewire request
    public function updated(string $property): void
    {
        $this->validateOnly($property);
    }

    public function save(): void
    {
        $this->validate();

        Post::create([
            'title'   => $this->title,
            'body'    => $this->body,
            'user_id' => auth()->id(),
        ]);

        $this->reset();
        $this->dispatch('post-saved');
    }

    public function render(): View
    {
        return view('livewire.post-form');
    }
}
```

Livewire 3 lifecycle order: `boot` → `mount` → `hydrate` → `updated*` → `render` → `dehydrate`.

### Sanctum Token Guards

API token authentication:

```php
// config/auth.php — add sanctum guard
'guards' => [
    'api' => [
        'driver'   => 'sanctum',
        'provider' => 'users',
    ],
],
```

Issue tokens:

```php
// app/Http/Controllers/AuthController.php
public function login(LoginRequest $request): JsonResponse
{
    if (! Auth::attempt($request->only('email', 'password'))) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $token = $request->user()->createToken(
        name: 'api-token',
        abilities: ['read', 'write'],
        expiresAt: now()->addDays(30),
    );

    return response()->json(['token' => $token->plainTextToken]);
}
```

Protect routes:

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [UserController::class, 'show']);
    Route::apiResource('posts', PostController::class);
});
```

### Pest Test Structure

```php
// tests/Feature/PostControllerTest.php
use App\Models\{Post, User};
use function Pest\Laravel\{actingAs, getJson, postJson};

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('lists published posts', function () {
    Post::factory()->count(3)->published()->create();
    Post::factory()->draft()->create();

    actingAs($this->user)
        ->getJson('/api/posts')
        ->assertOk()
        ->assertJsonCount(3, 'data');
});

it('creates a post', function () {
    $data = Post::factory()->make()->only(['title', 'body']);

    actingAs($this->user)
        ->postJson('/api/posts', $data)
        ->assertCreated()
        ->assertJsonPath('data.title', $data['title']);

    expect(Post::count())->toBe(1);
});
```

Run: `php artisan test --parallel`

---
