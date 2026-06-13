---
name: csharp
description: "C#/.NET minimal API, Entity Framework Core, dependency injection, background services, middleware, LINQ"
updated: 2026-06-13
---

# C#/.NET Skill

## When to activate
- Building a .NET Web API (minimal API or controller-based)
- Setting up Entity Framework Core with migrations
- Configuring the .NET dependency injection container
- Writing background services with `IHostedService` or `BackgroundService`
- Implementing middleware pipeline components
- Writing LINQ queries and understanding deferred execution
- Setting up async/await correctly in ASP.NET Core

## When NOT to use
- Node.js or Python services
- .NET Framework (pre-.NET 5) legacy codebases — patterns differ
- Blazor or MAUI frontend — different concerns
- Unity game development — different runtime

## Instructions

### Project structure
```
MyApi/
├── MyApi.sln
├── src/
│   └── MyApi/
│       ├── Program.cs              # Entry point + DI container
│       ├── appsettings.json
│       ├── appsettings.Development.json
│       ├── Controllers/            # Controller-based API
│       ├── Endpoints/              # Minimal API extensions
│       ├── Models/                 # EF Core entities
│       ├── DTOs/                   # Request/response shapes
│       ├── Services/               # Business logic interfaces + implementations
│       ├── Data/
│       │   └── AppDbContext.cs
│       └── Middleware/
└── tests/
    └── MyApi.Tests/
```

### Program.cs — minimal API setup
```csharp
// Program.cs — .NET 6+ top-level statements + minimal API
var builder = WebApplication.CreateBuilder(args);

// Register services
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

// Minimal API endpoints
app.MapGroup("/api/v1").MapUserEndpoints();

app.Run();
```

### EF Core entity + DbContext
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

### Dependency injection — services
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

### Controller-based API
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

### Minimal API endpoints (extension method pattern)
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

// Register in Program.cs before other middleware:
app.UseMiddleware<RequestLoggingMiddleware>();
```

### Background services
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
        // Use a new scope for each iteration — BackgroundService is singleton
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var cutoff = DateTimeOffset.UtcNow.AddDays(-30);
        await db.Sessions.Where(s => s.ExpiresAt < cutoff).ExecuteDeleteAsync(ct);
    }
}

// Register: builder.Services.AddHostedService<CleanupService>();
```

### LINQ best practices
```csharp
// Always use AsNoTracking() for read-only queries
var users = await db.Users.AsNoTracking().Where(u => u.IsActive).ToListAsync(ct);

// Select only needed columns — avoid loading full entities for projections
var emails = await db.Users
    .Where(u => u.IsActive)
    .Select(u => u.Email)
    .ToListAsync(ct);

// Use ExecuteUpdateAsync/ExecuteDeleteAsync for bulk ops — skips loading entities
await db.Users
    .Where(u => !u.IsActive && u.CreatedAt < cutoff)
    .ExecuteDeleteAsync(ct);

// Avoid N+1: use Include() for related data
var posts = await db.Posts
    .Include(p => p.Author)
    .Include(p => p.Tags)
    .Where(p => p.Published)
    .AsNoTracking()
    .ToListAsync(ct);
```

### DTOs and records
```csharp
// Use records for immutable DTOs
public record UserDto(Guid Id, string Email, DateTimeOffset CreatedAt);
public record CreateUserRequest(
    [property: Required, EmailAddress] string Email,
    [property: Required, MinLength(8)] string Password
);

// Response types with problem details (built-in .NET)
// Return Results.Problem() or throw exceptions caught by middleware
```

## Example

**User:** Add a `BlogPost` resource to a .NET Web API: CRUD endpoints, EF Core entity, migrations, and a background job that publishes scheduled posts.

**Expected output:**
- `Models/BlogPost.cs` — entity with `Id`, `Title`, `Body`, `AuthorId` (FK to User), `PublishedAt` (nullable), `ScheduledFor` (nullable)
- `DTOs/BlogPostDtos.cs` — `BlogPostDto` record, `CreateBlogPostRequest` record with `[Required]` validation
- `Services/IBlogPostService.cs` + `BlogPostService.cs` — CRUD methods, `GetPendingScheduledAsync` for background job
- `Controllers/BlogPostsController.cs` — all CRUD with proper status codes
- `Services/PostPublisherService.cs` — `BackgroundService` that checks every minute and publishes due posts
- EF Core migration: `dotnet ef migrations add AddBlogPosts`

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities. [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
