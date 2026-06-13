> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../csharp.md).

# C#/.NET Skill

## Wanneer te activeren
- Een .NET Web API bouwen (minimale API of op controllers gebaseerd)
- Entity Framework Core instellen met migraties
- De .NET dependency injection-container configureren
- Achtergrondservices schrijven met `IHostedService` of `BackgroundService`
- Middleware-pipeline-componenten implementeren
- LINQ-queries schrijven en uitgestelde uitvoering begrijpen
- async/await correct instellen in ASP.NET Core

## Wanneer NIET te gebruiken
- Node.js of Python-services
- .NET Framework (pre-.NET 5) legacy-codebases — patronen verschillen
- Blazor of MAUI frontend — andere concerns
- Unity-spelontwikkeling — andere runtime

## Instructies

### Projectstructuur
```
MyApi/
├── MyApi.sln
├── src/
│   └── MyApi/
│       ├── Program.cs              # Ingangspunt + DI-container
│       ├── appsettings.json
│       ├── appsettings.Development.json
│       ├── Controllers/            # Op controllers gebaseerde API
│       ├── Endpoints/              # Minimale API-extensies
│       ├── Models/                 # EF Core-entiteiten
│       ├── DTOs/                   # Aanvraag/respons-vormen
│       ├── Services/               # Bedrijfslogica-interfaces + -implementaties
│       ├── Data/
│       │   └── AppDbContext.cs
│       └── Middleware/
└── tests/
    └── MyApi.Tests/
```

### Program.cs — minimale API-instelling
```csharp
// Program.cs — .NET 6+ top-level statements + minimale API
var builder = WebApplication.CreateBuilder(args);

// Services registreren
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

// Minimale API-endpoints
app.MapGroup("/api/v1").MapUserEndpoints();

app.Run();
```

### EF Core-entiteit + DbContext
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

### Op controllers gebaseerde API
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

### Minimale API-endpoints (extensiemethodepatroon)
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

// Registreer in Program.cs vóór andere middleware:
app.UseMiddleware<RequestLoggingMiddleware>();
```

### Achtergrondservices
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
        // Gebruik een nieuwe scope voor elke iteratie — BackgroundService is singleton
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var cutoff = DateTimeOffset.UtcNow.AddDays(-30);
        await db.Sessions.Where(s => s.ExpiresAt < cutoff).ExecuteDeleteAsync(ct);
    }
}

// Registreer: builder.Services.AddHostedService<CleanupService>();
```

### LINQ-beste praktijken
```csharp
// Gebruik altijd AsNoTracking() voor alleen-lezen queries
var users = await db.Users.AsNoTracking().Where(u => u.IsActive).ToListAsync(ct);

// Selecteer alleen benodigde kolommen — vermijd laden van volledige entiteiten voor projecties
var emails = await db.Users
    .Where(u => u.IsActive)
    .Select(u => u.Email)
    .ToListAsync(ct);

// Gebruik ExecuteUpdateAsync/ExecuteDeleteAsync voor bulk-operaties — slaat laden van entiteiten over
await db.Users
    .Where(u => !u.IsActive && u.CreatedAt < cutoff)
    .ExecuteDeleteAsync(ct);

// Vermijd N+1: gebruik Include() voor gerelateerde data
var posts = await db.Posts
    .Include(p => p.Author)
    .Include(p => p.Tags)
    .Where(p => p.Published)
    .AsNoTracking()
    .ToListAsync(ct);
```

### DTO's en records
```csharp
// Gebruik records voor onveranderlijke DTO's
public record UserDto(Guid Id, string Email, DateTimeOffset CreatedAt);
public record CreateUserRequest(
    [property: Required, EmailAddress] string Email,
    [property: Required, MinLength(8)] string Password
);

// Antwoordtypen met problem details (ingebouwd .NET)
// Retourneer Results.Problem() of gooi uitzonderingen gevangen door middleware
```

## Voorbeeld

**Gebruiker:** Voeg een `BlogPost`-resource toe aan een .NET Web API: CRUD-endpoints, EF Core-entiteit, migraties en een achtergrondtaak die geplande berichten publiceert.

**Verwachte output:**
- `Models/BlogPost.cs` — entiteit met `Id`, `Title`, `Body`, `AuthorId` (FK naar User), `PublishedAt` (nullable), `ScheduledFor` (nullable)
- `DTOs/BlogPostDtos.cs` — `BlogPostDto`-record, `CreateBlogPostRequest`-record met `[Required]`-validatie
- `Services/IBlogPostService.cs` + `BlogPostService.cs` — CRUD-methoden, `GetPendingScheduledAsync` voor achtergrondtaak
- `Controllers/BlogPostsController.cs` — alle CRUD met juiste statuscodes
- `Services/PostPublisherService.cs` — `BackgroundService` die elke minuut controleert en vervallen berichten publiceert
- EF Core-migratie: `dotnet ef migrations add AddBlogPosts`

---
