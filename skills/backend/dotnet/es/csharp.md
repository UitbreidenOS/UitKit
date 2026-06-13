> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../csharp.md).

# Skill de C#/.NET

## Cuándo activar
- Construir una Web API en .NET (minimal API o basada en controladores)
- Configurar Entity Framework Core con migraciones
- Configurar el contenedor de inyección de dependencias de .NET
- Escribir servicios en segundo plano con `IHostedService` o `BackgroundService`
- Implementar componentes del pipeline de middleware
- Escribir consultas LINQ y entender la ejecución diferida
- Configurar async/await correctamente en ASP.NET Core

## Cuándo NO usar
- Servicios en Node.js o Python
- Codebases legacy de .NET Framework (pre-.NET 5) — los patrones difieren
- Blazor o MAUI frontend — preocupaciones diferentes
- Desarrollo de juegos con Unity — runtime diferente

## Instrucciones

### Estructura del proyecto
```
MyApi/
├── MyApi.sln
├── src/
│   └── MyApi/
│       ├── Program.cs              # Punto de entrada + contenedor DI
│       ├── appsettings.json
│       ├── appsettings.Development.json
│       ├── Controllers/            # API basada en controladores
│       ├── Endpoints/              # Extensiones de minimal API
│       ├── Models/                 # Entidades de EF Core
│       ├── DTOs/                   # Formas de solicitud/respuesta
│       ├── Services/               # Interfaces + implementaciones de lógica de negocio
│       ├── Data/
│       │   └── AppDbContext.cs
│       └── Middleware/
└── tests/
    └── MyApi.Tests/
```

### Program.cs — configuración de minimal API
```csharp
// Program.cs — sentencias de nivel superior de .NET 6+ + minimal API
var builder = WebApplication.CreateBuilder(args);

// Registrar servicios
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

// Endpoints de minimal API
app.MapGroup("/api/v1").MapUserEndpoints();

app.Run();
```

### Entidad EF Core + DbContext
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

### Inyección de dependencias — servicios
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

### API basada en controladores
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

### Endpoints de minimal API (patrón de método de extensión)
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

// Registrar en Program.cs antes de otro middleware:
app.UseMiddleware<RequestLoggingMiddleware>();
```

### Servicios en segundo plano
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
        // Usar un nuevo scope para cada iteración — BackgroundService es singleton
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var cutoff = DateTimeOffset.UtcNow.AddDays(-30);
        await db.Sessions.Where(s => s.ExpiresAt < cutoff).ExecuteDeleteAsync(ct);
    }
}

// Registrar: builder.Services.AddHostedService<CleanupService>();
```

### Mejores prácticas de LINQ
```csharp
// Siempre usar AsNoTracking() para consultas de solo lectura
var users = await db.Users.AsNoTracking().Where(u => u.IsActive).ToListAsync(ct);

// Seleccionar solo las columnas necesarias — evitar cargar entidades completas para proyecciones
var emails = await db.Users
    .Where(u => u.IsActive)
    .Select(u => u.Email)
    .ToListAsync(ct);

// Usar ExecuteUpdateAsync/ExecuteDeleteAsync para operaciones masivas — evita cargar entidades
await db.Users
    .Where(u => !u.IsActive && u.CreatedAt < cutoff)
    .ExecuteDeleteAsync(ct);

// Evitar N+1: usar Include() para datos relacionados
var posts = await db.Posts
    .Include(p => p.Author)
    .Include(p => p.Tags)
    .Where(p => p.Published)
    .AsNoTracking()
    .ToListAsync(ct);
```

### DTOs y records
```csharp
// Usar records para DTOs inmutables
public record UserDto(Guid Id, string Email, DateTimeOffset CreatedAt);
public record CreateUserRequest(
    [property: Required, EmailAddress] string Email,
    [property: Required, MinLength(8)] string Password
);

// Tipos de respuesta con problem details (integrado en .NET)
// Devolver Results.Problem() o lanzar excepciones capturadas por el middleware
```

## Ejemplo

**Usuario:** Agregar un recurso `BlogPost` a una Web API de .NET: endpoints CRUD, entidad EF Core, migraciones y un trabajo en segundo plano que publica posts programados.

**Salida esperada:**
- `Models/BlogPost.cs` — entidad con `Id`, `Title`, `Body`, `AuthorId` (FK a User), `PublishedAt` (nullable), `ScheduledFor` (nullable)
- `DTOs/BlogPostDtos.cs` — record `BlogPostDto`, record `CreateBlogPostRequest` con validación `[Required]`
- `Services/IBlogPostService.cs` + `BlogPostService.cs` — métodos CRUD, `GetPendingScheduledAsync` para el trabajo en segundo plano
- `Controllers/BlogPostsController.cs` — todo CRUD con códigos de estado apropiados
- `Services/PostPublisherService.cs` — `BackgroundService` que verifica cada minuto y publica los posts pendientes
- Migración EF Core: `dotnet ef migrations add AddBlogPosts`

---
