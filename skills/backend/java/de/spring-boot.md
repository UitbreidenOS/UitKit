> 🇩🇪 Deutsche Version. [Englische Version](../spring-boot.md).

# Spring Boot Skill

## Wann aktivieren
- Aufbau einer Spring Boot REST API oder eines Microservices
- Einrichtung von Spring Data JPA mit Hibernate und PostgreSQL/MySQL
- Konfiguration von Spring Security (JWT, OAuth2, sitzungsbasierte Authentifizierung)
- Schreiben von Spring Boot Tests (Unit-Tests mit Mockito, Integrationstests mit TestRestTemplate oder MockMvc)
- Einrichtung von Spring Cloud (Service Discovery, Config Server, API Gateway)
- Implementierung asynchroner Verarbeitung mit `@Async` oder Spring Events
- Konfiguration von Profilen, Properties und externalisierter Konfiguration
- Schreiben benutzerdefinierter Spring Boot Starters oder Auto-Konfigurationen

## Wann NICHT verwenden
- Quarkus- oder Micronaut-Projekte — unterschiedliche Dependency-Injection- und Konfigurationsmodelle
- Reines Java ohne Spring — der Overhead ist für einfache Skripte nicht gerechtfertigt
- Android-Projekte — vollständig anderes Ökosystem
- Jakarta EE/WildFly — anderes Application-Server-Modell

## Anweisungen

### Projektstruktur
```
src/
├── main/
│   ├── java/com/example/app/
│   │   ├── AppApplication.java         # @SpringBootApplication entry point
│   │   ├── config/                     # @Configuration beans
│   │   ├── controller/                 # @RestController — HTTP layer only
│   │   ├── service/                    # Business logic — @Service
│   │   ├── repository/                 # @Repository — data access
│   │   ├── domain/                     # @Entity models
│   │   ├── dto/                        # Request/response shapes (records)
│   │   ├── exception/                  # @ControllerAdvice error handling
│   │   └── security/                   # Security config and filters
│   └── resources/
│       ├── application.yml             # Base config
│       ├── application-dev.yml         # Dev overrides
│       └── application-prod.yml        # Prod overrides
└── test/
    └── java/com/example/app/
        ├── controller/                 # MockMvc / @WebMvcTest
        ├── service/                    # Unit tests with Mockito
        └── integration/               # @SpringBootTest full context
```

### Anwendungs-Einstiegspunkt
```java
@SpringBootApplication
public class AppApplication {
    public static void main(String[] args) {
        SpringApplication.run(AppApplication.class, args);
    }
}
```

### application.yml Struktur
```yaml
spring:
  application:
    name: my-service
  datasource:
    url: ${DATABASE_URL}
    username: ${DB_USER}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate         # Never 'create' or 'update' in production
    show-sql: false
    properties:
      hibernate:
        format_sql: true

server:
  port: ${PORT:8080}

# Custom properties — always use @ConfigurationProperties, never @Value for groups
app:
  jwt:
    secret: ${JWT_SECRET}
    expiration-ms: 86400000
```

### Entity und Repository
```java
// domain/User.java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 320)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

    // No-arg constructor required by JPA
    protected User() {}

    public User(String email, String passwordHash) {
        this.email = email;
        this.passwordHash = passwordHash;
    }
    // getters only — no setters on entities
}

// repository/UserRepository.java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    // JPQL for complex queries
    @Query("SELECT u FROM User u WHERE u.createdAt > :since")
    List<User> findRecentUsers(@Param("since") Instant since);
}
```

### Service-Schicht
```java
@Service
@Transactional(readOnly = true)   // Default read-only; override for writes
public class UserService {
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional   // Override: this method writes
    public UserDto createUser(CreateUserRequest request) {
        if (userRepo.existsByEmail(request.email())) {
            throw new ConflictException("Email already in use");
        }
        User user = new User(request.email(), passwordEncoder.encode(request.password()));
        return UserDto.from(userRepo.save(user));
    }

    public UserDto getById(Long id) {
        return userRepo.findById(id)
            .map(UserDto::from)
            .orElseThrow(() -> new NotFoundException("User " + id + " not found"));
    }
}
```

### Controller-Schicht
```java
@RestController
@RequestMapping("/api/v1/users")
@Validated
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserDto createUser(@RequestBody @Valid CreateUserRequest request) {
        return userService.createUser(request);
    }

    @GetMapping("/{id}")
    public UserDto getUser(@PathVariable Long id) {
        return userService.getById(id);
    }

    @GetMapping
    public Page<UserDto> listUsers(Pageable pageable) {
        return userService.findAll(pageable);
    }
}
```

### DTOs mit Records
```java
// dto/CreateUserRequest.java
public record CreateUserRequest(
    @NotBlank @Email String email,
    @NotBlank @Size(min = 8) String password
) {}

// dto/UserDto.java
public record UserDto(Long id, String email, Instant createdAt) {
    public static UserDto from(User user) {
        return new UserDto(user.getId(), user.getEmail(), user.getCreatedAt());
    }
}
```

### Globaler Exception-Handler
```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ProblemDetail handleNotFound(NotFoundException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(ConflictException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ProblemDetail handleConflict(ConflictException ex) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        var detail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Validation failed");
        detail.setProperty("errors", ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .toList());
        return detail;
    }
}
```

### Spring Security — JWT
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthFilter jwtFilter) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**", "/actuator/health").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### Tests
```java
// @WebMvcTest — Controller-Slice-Test (kein vollständiger Kontext)
@WebMvcTest(UserController.class)
class UserControllerTest {
    @Autowired MockMvc mockMvc;
    @MockitoBean UserService userService;     // Spring Boot 3.4+: @MockitoBean

    @Test
    void createUser_returnsCreated() throws Exception {
        given(userService.createUser(any())).willReturn(new UserDto(1L, "a@b.com", Instant.now()));

        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"email":"a@b.com","password":"password123"}"""))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.email").value("a@b.com"));
    }
}

// @SpringBootTest — vollständiger Integrationstest
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Transactional
class UserServiceIntegrationTest {
    @Autowired UserService userService;

    @Test
    void createUser_persistsToDatabase() {
        var user = userService.createUser(new CreateUserRequest("a@b.com", "password123"));
        assertThat(user.email()).isEqualTo("a@b.com");
        assertThat(user.id()).isNotNull();
    }
}
```

### Spring Cloud Muster
```yaml
# Service discovery with Eureka
spring:
  application:
    name: user-service
eureka:
  client:
    service-url:
      defaultZone: http://eureka-server:8761/eureka/

# Config server client
spring:
  config:
    import: configserver:http://config-server:8888
```

```java
// Feign client for inter-service calls
@FeignClient(name = "order-service")
public interface OrderClient {
    @GetMapping("/api/v1/orders/user/{userId}")
    List<OrderDto> getOrdersByUser(@PathVariable Long userId);
}
```

## Beispiel

**Nutzer:** Erstelle eine Spring Boot REST API für einen Produktkatalog mit CRUD-Endpunkten, PostgreSQL über JPA, Bean-Validierung, globalem Fehler-Handling und einem `@WebMvcTest` für den GET-Endpunkt.

**Erwartete Ausgabe:**
- `Product` Entity — `id`, `name`, `price` (BigDecimal), `stock`, `createdAt`
- `ProductDto` Record + `CreateProductRequest` Record mit `@NotBlank` / `@Positive` Validierung
- `ProductRepository extends JpaRepository<Product, Long>`
- `ProductService` — `@Transactional(readOnly = true)` auf Klassenebene, `@Transactional` für Schreiboperationen
- `ProductController` — CRUD unter `/api/v1/products`, `Pageable` auf GET-Liste
- `GlobalExceptionHandler` — `NotFoundException` → 404, `MethodArgumentNotValidException` → 400 mit Feldfehlern
- `ProductControllerTest` mit `@WebMvcTest` + `@MockitoBean ProductService`

---

> **Arbeite mit uns:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities. [uitbreiden.com](https://uitbreiden.com/)
