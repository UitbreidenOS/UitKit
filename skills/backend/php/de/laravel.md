# Laravel 11

## Wann aktivieren
- Aufbau oder Wartung einer Laravel 11 Anwendung
- Design von Eloquent Models, Beziehungen und Query Scopes
- Implementierung von Queued Jobs mit Laravel Horizon
- Aufbau von reaktivem UI mit Livewire 3
- Setup von Sanctum für API Token oder SPA Authentication
- Schreiben von Pest Tests
- Tuning von Leistung mit Laravel Octane

## Wann NICHT verwenden
- Laravel Versionen vor 10, wo APIs sich erheblich unterscheiden (überprüfen Sie `composer show laravel/framework`)
- Standalone PHP Scripts ohne Laravel Framework Beteiligung
- Lumen oder Symfony Projekte

## Anweisungen

### Eloquent Relationships und Query Scopes

Definieren Sie Beziehungen direkt im Model:

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

Eager Load Assoziationen immer in List Queries. Verwenden Sie `withCount` für Aggregat Counts ohne vollständige Collection Load:

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
        // Notify Slack, Sentry, etc.
    }
}

// Dispatch
SendInvoiceEmail::dispatch($invoice);
SendInvoiceEmail::dispatch($invoice)->delay(now()->addMinutes(5));
SendInvoiceEmail::dispatch($invoice)->onQueue('mailers');
```

Konfigurieren Sie Horizon Queues in `config/horizon.php`:

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
        $this->dispatch('post-saved');   // Livewire 3 event dispatch
    }

    public function render(): View
    {
        return view('livewire.post-form');
    }
}
```

```html
<!-- resources/views/livewire/post-form.blade.php -->
<form wire:submit="save">
    <input wire:model.live="title" type="text" />
    @error('title') <span>{{ $message }}</span> @enderror

    <textarea wire:model="body"></textarea>
    @error('body') <span>{{ $message }}</span> @enderror

    <button type="submit" wire:loading.attr="disabled">Save</button>
</form>
```

Livewire 3 Lifecycle-Reihenfolge: `boot` → `mount` → `hydrate` → `updated*` → `render` → `dehydrate`.

### Sanctum Token Guards

API Token Authentication:

```php
// config/auth.php — add sanctum guard
'guards' => [
    'api' => [
        'driver'   => 'sanctum',
        'provider' => 'users',
    ],
],
```

Issue Tokens:

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

public function logout(Request $request): JsonResponse
{
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message' => 'Logged out']);
}
```

Protect Routes:

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [UserController::class, 'show']);
    Route::apiResource('posts', PostController::class);
});
```

Für SPA Authentication verwenden Sie Cookie-basierte Sessions über `Sanctum::actingAs()` in Tests und die `EnsureFrontendRequestsAreStateful` Middleware.

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
    Post::factory()->draft()->create();   // should not appear

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

it('rejects unauthenticated access', function () {
    getJson('/api/posts')->assertUnauthorized();
});
```

Ausführen: `php artisan test --parallel`

### Octane Warm-Up Überlegungen

Octane hält die Anwendung im Memory zwischen Anfragen. Code, der in traditionellem PHP sicher ist, kann unter Octane brechen:

```php
// UNSAFE — static state persists across requests
class RequestContext
{
    private static ?User $currentUser = null;   // leaks between requests

    public static function setUser(User $u): void { static::$currentUser = $u; }
}

// SAFE — use request-scoped bindings
app()->scoped(RequestContext::class, fn () => new RequestContext());
```

Warm-Up Callbacks preloaden teure Bootstrapping:

```php
// config/octane.php
'warm' => [
    ...Octane::defaultServicesToWarm(),
    App\Services\CurrencyRateCache::class,
],
```

Verwenden Sie `octane:start` und `octane:reload` (nicht restart), um Code Änderungen ohne Ausfallzeiten anzuwenden:

```bash
php artisan octane:start --server=frankenphp --workers=8
php artisan octane:reload    # hot reload after deploy
```

## Beispiel

Ein komplettes Livewire 3 Comment Form mit Optimistic UI und Pest Tests:

```php
// app/Livewire/CommentBox.php
class CommentBox extends Component
{
    public int $postId;

    #[Validate('required|min:5|max:1000')]
    public string $body = '';

    public function addComment(): void
    {
        $this->validate();

        Comment::create([
            'body'    => $this->body,
            'post_id' => $this->postId,
            'user_id' => auth()->id(),
        ]);

        $this->reset('body');
        $this->dispatch('comment-added');
    }

    public function render(): View
    {
        return view('livewire.comment-box');
    }
}

// tests/Feature/CommentBoxTest.php
use Livewire\Livewire;

it('adds a comment', function () {
    $post = Post::factory()->create();
    $user = User::factory()->create();

    Livewire::actingAs($user)
        ->test(CommentBox::class, ['postId' => $post->id])
        ->set('body', 'Great article!')
        ->call('addComment')
        ->assertDispatched('comment-added')
        ->assertSet('body', '');

    expect(Comment::count())->toBe(1);
});
```

---
