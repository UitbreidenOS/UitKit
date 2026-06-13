> 🇫🇷 This is the French translation. [English version](../csharp.md).

# Compétence C#/.NET

## Quand activer
- Construire une Web API .NET (minimal API ou basée sur des controllers)
- Configurer Entity Framework Core avec des migrations
- Configurer le conteneur d'injection de dépendances .NET
- Rédiger des services en arrière-plan avec `IHostedService` ou `BackgroundService`
- Implémenter des composants de pipeline middleware
- Rédiger des requêtes LINQ et comprendre l'exécution différée
- Configurer async/await correctement dans ASP.NET Core

## Quand NE PAS utiliser
- Services Node.js ou Python
- Bases de code legacy .NET Framework (antérieures à .NET 5) — les patterns diffèrent
- Frontend Blazor ou MAUI — préoccupations différentes
- Développement de jeux Unity — runtime différent

## Instructions

### Structure du projet
```
MyApi/
├── MyApi.sln
├── src/
│   └── MyApi/
│       ├── Program.cs              # Point d'entrée + conteneur DI
│       ├── appsettings.json
│       ├── appsettings.Development.json
│       ├── Controllers/            # API basée sur des controllers
│       ├── Endpoints/              # Extensions minimal API
│       ├── Models/                 # Entités EF Core
│       ├── DTOs/                   # Formes de requête/réponse
│       ├── Services/               # Interfaces + implémentations de logique métier
│       ├── Data/
│       │   └── AppDbContext.cs
│       └── Middleware/
└── tests/
    └── MyApi.Tests/
```

### Program.cs — configuration minimal API
```csharp
// Program.cs — .NET 6+ instructions de niveau supérieur + minimal API
var builder = WebApplication.CreateBuilder(args);

// Enregistrer les services
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

// Endpoints minimal API
app.MapGroup("/api/v1").MapUserEndpoints();

app.Run();
```

### Entité EF Core + DbContext
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

### Injection de dépendances — services
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

### API basée sur des controllers
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

### Endpoints minimal API (pattern de méthode d'extension)
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

// Enregistrer dans Program.cs avant les autres middlewares :
app.UseMiddleware<RequestLoggingMiddleware>();
```

### Services en arrière-plan
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
        // Utiliser un nouveau scope pour chaque itération — BackgroundService est singleton
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var cutoff = DateTimeOffset.UtcNow.AddDays(-30);
        await db.Sessions.Where(s => s.ExpiresAt < cutoff).ExecuteDeleteAsync(ct);
    }
}

// Enregistrer : builder.Services.AddHostedService<CleanupService>();
```

### Bonnes pratiques LINQ
```csharp
// Toujours utiliser AsNoTracking() pour les requêtes en lecture seule
var users = await db.Users.AsNoTracking().Where(u => u.IsActive).ToListAsync(ct);

// Sélectionner uniquement les colonnes nécessaires — éviter de charger des entités complètes pour les projections
var emails = await db.Users
    .Where(u => u.IsActive)
    .Select(u => u.Email)
    .ToListAsync(ct);

// Utiliser ExecuteUpdateAsync/ExecuteDeleteAsync pour les opérations en masse — évite de charger des entités
await db.Users
    .Where(u => !u.IsActive && u.CreatedAt < cutoff)
    .ExecuteDeleteAsync(ct);

// Éviter N+1 : utiliser Include() pour les données liées
var posts = await db.Posts
    .Include(p => p.Author)
    .Include(p => p.Tags)
    .Where(p => p.Published)
    .AsNoTracking()
    .ToListAsync(ct);
```

### DTOs et records
```csharp
// Utiliser des records pour les DTOs immuables
public record UserDto(Guid Id, string Email, DateTimeOffset CreatedAt);
public record CreateUserRequest(
    [property: Required, EmailAddress] string Email,
    [property: Required, MinLength(8)] string Password
);

// Types de réponse avec problem details (intégré dans .NET)
// Retourner Results.Problem() ou lever des exceptions catchées par le middleware
```

## Exemple

**Utilisateur :** Ajouter une ressource `BlogPost` à une Web API .NET : endpoints CRUD, entité EF Core, migrations et un job en arrière-plan qui publie les articles planifiés.

**Sortie attendue :**
- `Models/BlogPost.cs` — entité avec `Id`, `Title`, `Body`, `AuthorId` (FK vers User), `PublishedAt` (nullable), `ScheduledFor` (nullable)
- `DTOs/BlogPostDtos.cs` — record `BlogPostDto`, record `CreateBlogPostRequest` avec validation `[Required]`
- `Services/IBlogPostService.cs` + `BlogPostService.cs` — méthodes CRUD, `GetPendingScheduledAsync` pour le job en arrière-plan
- `Controllers/BlogPostsController.cs` — tous les CRUD avec codes de statut appropriés
- `Services/PostPublisherService.cs` — `BackgroundService` qui vérifie toutes les minutes et publie les articles dus
- Migration EF Core : `dotnet ef migrations add AddBlogPosts`

---
