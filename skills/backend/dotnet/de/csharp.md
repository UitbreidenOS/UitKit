> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../csharp.md).

# C#/.NET Skill

## Wann aktivieren
- Eine .NET Web API bauen (minimale API oder controller-basiert)
- Entity Framework Core mit Migrationen einrichten
- Den .NET Dependency Injection-Container konfigurieren
- Hintergrunddienste mit `IHostedService` oder `BackgroundService` schreiben
- Middleware-Pipeline-Komponenten implementieren
- LINQ-Abfragen schreiben und deferred Execution verstehen
- async/await in ASP.NET Core korrekt einrichten

## Wann NICHT verwenden
- Node.js- oder Python-Dienste
- .NET Framework (vor .NET 5) Legacy-Codebasen — Muster unterscheiden sich
- Blazor oder MAUI-Frontend — andere Belange
- Unity-Spielentwicklung — andere Laufzeitumgebung

## Anweisungen

### Projektstruktur
```
MyApi/
├── MyApi.sln
├── src/
│   └── MyApi/
│       ├── Program.cs              # Einstiegspunkt + DI-Container
│       ├── appsettings.json
│       ├── appsettings.Development.json
│       ├── Controllers/            # Controller-basierte API
│       ├── Endpoints/              # Minimale API-Erweiterungen
│       ├── Models/                 # EF Core-Entitäten
│       ├── DTOs/                   # Anfrage-/Antwortformen
│       ├── Services/               # Business-Logik-Interfaces + Implementierungen
│       ├── Data/
│       │   └── AppDbContext.cs
│       └── Middleware/
└── tests/
    └── MyApi.Tests/
```

### Program.cs — minimales API-Setup
```csharp
// Program.cs — .NET 6+ Top-Level-Statements + minimale API
var builder = WebApplication.CreateBuilder(args);

// Services registrieren
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Minimale API-Endpunkte
app.MapGroup("/api/v1").MapUserEndpoints();

app.Run();
```

### EF Core-Entity + DbContext
```csharp
// Models/User.cs
public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ICollection<Post> Posts { get; set; } = [];
}

// Data/AppDbContext.cs
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Post> Posts => Set<Post>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Email).HasMaxLength(320);
        });
    }
}
```

### Dependency Injection — Services
```csharp
// Services/IUserService.cs
public interface IUserService
{
    Task<UserDto> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<UserDto> CreateAsync(CreateUserRequest request, CancellationToken ct = default);
}

// Services/UserService.cs
public class UserService(AppDbContext db) : IUserService
{
    public async Task<UserDto> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var user = await db.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == id, ct)
            ?? throw new NotFoundException($"User {id} not found");

        return new UserDto(user.Id, user.Email, user.CreatedAt);
    }

    public async Task<UserDto> CreateAsync(CreateUserRequest request, CancellationToken ct = default)
    {
        if (await db.Users.AnyAsync(u => u.Email == request.Email, ct))
            throw new ConflictException("Email already in use");

        var user = new User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };
        db.Users.Add(user);
        await db.SaveChangesAsync(ct);
        return new UserDto(user.Id, user.Email, user.CreatedAt);
    }
}
```

### Controller-basierte API
```csharp
[ApiController]
[Route("api/v1/[controller]")]
public class UsersController(IUserService userService) : ControllerBase
{
    [HttpGet("{id:guid}")]
    [ProducesResponseType<UserDto>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetUser(Guid id, CancellationToken ct)
    {
        var user = await userService.GetByIdAsync(id, ct);
        return Ok(user);
    }

    [HttpPost]
    [ProducesResponseType<UserDto>(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> CreateUser(
        [FromBody] CreateUserRequest request,
        CancellationToken ct)
    {
        var user = await userService.CreateAsync(request, ct);
        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
    }
}
```

### Minimale API-Endpunkte (Erweiterungsmethoden-Muster)
```csharp
// Endpoints/UserEndpoints.cs
public static class UserEndpoints
{
    public static RouteGroupBuilder MapUserEndpoints(this RouteGroupBuilder group)
    {
        var users = group.MapGroup("/users").WithTags("Users");

        users.MapGet("/{id:guid}", async (Guid id, IUserService svc, CancellationToken ct) =>
        {
            var user = await svc.GetByIdAsync(id, ct);
            return Results.Ok(user);
        })
        .WithName("GetUser")
        .Produces<UserDto>();

        return group;
    }
}
```

### Middleware
```csharp
// Middleware/RequestLoggingMiddleware.cs
public class RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var sw = Stopwatch.StartNew();
        try
        {
            await next(context);
        }
        finally
        {
            sw.Stop();
            logger.LogInformation(
                "{Method} {Path} {StatusCode} in {Elapsed}ms",
                context.Request.Method,
                context.Request.Path,
                context.Response.StatusCode,
                sw.ElapsedMilliseconds);
        }
    }
}

// In Program.cs vor anderer Middleware registrieren:
app.UseMiddleware<RequestLoggingMiddleware>();
```

### Hintergrunddienste
```csharp
// Services/CleanupService.cs
public class CleanupService(IServiceProvider services, ILogger<CleanupService> logger)
    : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await DoCleanupAsync(stoppingToken);
            await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
        }
    }

    private async Task DoCleanupAsync(CancellationToken ct)
    {
        // Neuen Scope für jede Iteration verwenden — BackgroundService ist Singleton
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var cutoff = DateTimeOffset.UtcNow.AddDays(-30);
        await db.Sessions.Where(s => s.ExpiresAt < cutoff).ExecuteDeleteAsync(ct);
    }
}

// Registrieren: builder.Services.AddHostedService<CleanupService>();
```

### LINQ-Best-Practices
```csharp
// AsNoTracking() immer für schreibgeschützte Abfragen verwenden
var users = await db.Users.AsNoTracking().Where(u => u.IsActive).ToListAsync(ct);

// Nur benötigte Spalten auswählen — vollständige Entitäten für Projektionen vermeiden
var emails = await db.Users
    .Where(u => u.IsActive)
    .Select(u => u.Email)
    .ToListAsync(ct);

// ExecuteUpdateAsync/ExecuteDeleteAsync für Bulk-Ops verwenden — überspringt das Laden von Entitäten
await db.Users
    .Where(u => !u.IsActive && u.CreatedAt < cutoff)
    .ExecuteDeleteAsync(ct);

// N+1 vermeiden: Include() für verknüpfte Daten verwenden
var posts = await db.Posts
    .Include(p => p.Author)
    .Include(p => p.Tags)
    .Where(p => p.Published)
    .AsNoTracking()
    .ToListAsync(ct);
```

### DTOs und Records
```csharp
// Records für unveränderliche DTOs verwenden
public record UserDto(Guid Id, string Email, DateTimeOffset CreatedAt);
public record CreateUserRequest(
    [property: Required, EmailAddress] string Email,
    [property: Required, MinLength(8)] string Password
);

// Antworttypen mit Problem Details (eingebaut in .NET)
// Results.Problem() zurückgeben oder Ausnahmen werfen, die von Middleware abgefangen werden
```

## Beispiel

**Benutzer:** Eine `BlogPost`-Ressource zu einer .NET Web API hinzufügen: CRUD-Endpunkte, EF Core-Entity, Migrationen und ein Hintergrundjob, der geplante Posts veröffentlicht.

**Erwartete Ausgabe:**
- `Models/BlogPost.cs` — Entity mit `Id`, `Title`, `Body`, `AuthorId` (FK zu User), `PublishedAt` (nullable), `ScheduledFor` (nullable)
- `DTOs/BlogPostDtos.cs` — `BlogPostDto`-Record, `CreateBlogPostRequest`-Record mit `[Required]`-Validierung
- `Services/IBlogPostService.cs` + `BlogPostService.cs` — CRUD-Methoden, `GetPendingScheduledAsync` für Hintergrundjob
- `Controllers/BlogPostsController.cs` — alle CRUD mit korrekten Statuscodes
- `Services/PostPublisherService.cs` — `BackgroundService`, der jede Minute prüft und fällige Posts veröffentlicht
- EF Core-Migration: `dotnet ef migrations add AddBlogPosts`

---
