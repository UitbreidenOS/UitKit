> 🇳🇱 Nederlandse versie. [Engelse versie](../spring-boot.md).

# Spring Boot Skill

## Wanneer te activeren
- Een Spring Boot REST API of microservice bouwen
- Spring Data JPA instellen met Hibernate en PostgreSQL/MySQL
- Spring Security configureren (JWT, OAuth2, sessie-gebaseerde authenticatie)
- Spring Boot tests schrijven (unit-tests met Mockito, integratietests met TestRestTemplate of MockMvc)
- Spring Cloud instellen (service discovery, config server, API gateway)
- Asynchrone verwerking implementeren met `@Async` of Spring Events
- Profielen, properties en externe configuratie instellen
- Aangepaste Spring Boot starters of auto-configuraties schrijven

## Wanneer NIET te gebruiken
- Quarkus- of Micronaut-projecten — andere DI- en configuratiemodellen
- Gewoon Java zonder Spring — de overhead is niet gerechtvaardigd voor eenvoudige scripts
- Android-projecten — volledig ander ecosysteem
- Jakarta EE/WildFly — ander applicatieservermodel

## Instructies

### Projectstructuur
```
src/
├── main/
│   ├── java/com/example/app/
│   │   ├── AppApplication.java         # @SpringBootApplication entry point
│   │   ├── config/                     # @Configuration beans
│   │   ├── controller/                 # @RestController — alleen HTTP-laag
│   │   ├── service/                    # Bedrijfslogica — @Service
│   │   ├── repository/                 # @Repository — gegevenstoegang
│   │   ├── domain/                     # @Entity modellen
│   │   ├── dto/                        # Request/response-vormen (records)
│   │   ├── exception/                  # @ControllerAdvice foutafhandeling
│   │   └── security/                   # Security-configuratie en filters
│   └── resources/
│       ├── application.yml             # Basisconfiguratie
│       ├── application-dev.yml         # Ontwikkelomgeving-overschrijvingen
│       └── application-prod.yml        # Productieomgeving-overschrijvingen
└── test/
    └── java/com/example/app/
        ├── controller/                 # MockMvc / @WebMvcTest
        ├── service/                    # Unit-tests met Mockito
        └── integration/               # @SpringBootTest volledige context
```

### Applicatie-ingangspunt
```java
@SpringBootApplication
public class AppApplication {
    public static void main(String[] args) {
        SpringApplication.run(AppApplication.class, args);
    }
}
```

### application.yml structuur
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
      ddl-auto: validate         # Nooit 'create' of 'update' in productie
    show-sql: false
    properties:
      hibernate:
        format_sql: true

server:
  port: ${PORT:8080}

# Aangepaste properties — gebruik altijd @ConfigurationProperties, nooit @Value voor groepen
app:
  jwt:
    secret: ${JWT_SECRET}
    expiration-ms: 86400000
```

### Entity en Repository
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

### Service-laag
```java
@Service
@Transactional(readOnly = true)   // Standaard alleen-lezen; overschrijf voor schrijfoperaties
public class UserService {
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional   // Overschrijving: deze methode schrijft
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

### Controller-laag
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

### DTO's met records
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

### Globale uitzonderingsafhandeling
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

### Testen
```java
// @WebMvcTest — controller slice test (geen volledige context)
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

// @SpringBootTest — volledige integratietest
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

### Spring Cloud patronen
```yaml
# Service discovery met Eureka
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
// Feign client voor aanroepen tussen services
@FeignClient(name = "order-service")
public interface OrderClient {
    @GetMapping("/api/v1/orders/user/{userId}")
    List<OrderDto> getOrdersByUser(@PathVariable Long userId);
}
```

## Voorbeeld

**Gebruiker:** Bouw een Spring Boot REST API voor een productcatalogus met CRUD-endpoints, PostgreSQL via JPA, bean-validatie, globale foutafhandeling en een `@WebMvcTest` voor het GET-endpoint.

**Verwachte uitvoer:**
- `Product` entity — `id`, `name`, `price` (BigDecimal), `stock`, `createdAt`
- `ProductDto` record + `CreateProductRequest` record met `@NotBlank` / `@Positive` validatie
- `ProductRepository extends JpaRepository<Product, Long>`
- `ProductService` — `@Transactional(readOnly = true)` op klasseniveau, `@Transactional` op schrijfoperaties
- `ProductController` — CRUD op `/api/v1/products`, `Pageable` op GET-lijst
- `GlobalExceptionHandler` — `NotFoundException` → 404, `MethodArgumentNotValidException` → 400 met veldfouten
- `ProductControllerTest` met `@WebMvcTest` + `@MockitoBean ProductService`

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — wij bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen. [uitbreiden.com](https://uitbreiden.com/)
