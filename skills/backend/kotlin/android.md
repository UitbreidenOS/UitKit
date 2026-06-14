---
name: android
description: Build Android applications with Kotlin, Jetpack Compose, and modern Android architecture
updated: 2026-06-13
---

# Kotlin + Android

## When to activate
- Building Android apps with Jetpack Compose
- Setting up ViewModel with StateFlow or SharedFlow
- Configuring Room database (entity, DAO, database class)
- Integrating Retrofit for HTTP and Moshi/Gson for JSON
- Wiring dependency injection with Hilt
- Preparing a release for Google Play Store submission

## When NOT to use
- Cross-platform Flutter or React Native projects
- Android apps still using Views/XML layouts with no Compose involvement
- Kotlin Multiplatform (KMP) projects where Android is just one target

## Instructions

### Compose Recomposition Optimization

Recomposition reruns composable functions when their inputs change. Avoid unnecessary work:

**Use `remember` to cache computed values and objects across recompositions:**

```kotlin
@Composable
fun ExpensiveList(items: List<Item>) {
    // Without remember — sorted on every recomposition
    val sorted = items.sortedBy { it.name }

    // With remember — re-sorts only when items reference changes
    val sorted = remember(items) { items.sortedBy { it.name } }

    LazyColumn {
        items(sorted, key = { it.id }) { item ->
            ItemRow(item)
        }
    }
}
```

**Use `derivedStateOf` for values derived from observable state to reduce recomposition frequency:**

```kotlin
@Composable
fun ScrollToTopButton(listState: LazyListState) {
    // Without derivedStateOf — recomposes on every scroll pixel
    val showButton = listState.firstVisibleItemIndex > 0

    // With derivedStateOf — recomposes only when the boolean flips
    val showButton by remember {
        derivedStateOf { listState.firstVisibleItemIndex > 0 }
    }

    AnimatedVisibility(visible = showButton) {
        FloatingActionButton(onClick = { /* scroll to top */ }) {
            Icon(Icons.Default.KeyboardArrowUp, contentDescription = "Scroll to top")
        }
    }
}
```

**Stability:** Compose skips recomposition of composables whose parameters have not changed — but only if all parameters are considered "stable" (primitives, `@Stable`/`@Immutable` annotated classes, or classes Compose infers as stable). Data classes with only stable fields are inferred as stable automatically.

```kotlin
// Unstable — List is not stable in Compose
@Composable
fun ItemList(items: List<Item>) { ... }

// Stable alternative — wrap in a stable holder
@Immutable
data class ItemsState(val items: ImmutableList<Item>)

@Composable
fun ItemList(state: ItemsState) { ... }
```

Use `kotlinx.collections.immutable` (`ImmutableList`, `PersistentList`) for stable collections in Compose.

### ViewModel with StateFlow and SharedFlow

```kotlin
data class ProductUiState(
    val products: List<Product> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
)

sealed interface ProductEvent {
    data object NavigateToCart : ProductEvent
    data class ShowSnackbar(val message: String) : ProductEvent
}

@HiltViewModel
class ProductViewModel @Inject constructor(
    private val repo: ProductRepository,
) : ViewModel() {

    // StateFlow for UI state — replayed on collection, represents current state
    private val _uiState = MutableStateFlow(ProductUiState())
    val uiState: StateFlow<ProductUiState> = _uiState.asStateFlow()

    // SharedFlow for one-time events — not replayed, no initial value
    private val _events = MutableSharedFlow<ProductEvent>()
    val events: SharedFlow<ProductEvent> = _events.asSharedFlow()

    init {
        loadProducts()
    }

    fun loadProducts() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            repo.getProducts()
                .onSuccess { products ->
                    _uiState.update { it.copy(products = products, isLoading = false) }
                }
                .onFailure { e ->
                    _uiState.update { it.copy(isLoading = false, error = e.message) }
                }
        }
    }

    fun onAddToCartClick(product: Product) {
        viewModelScope.launch {
            repo.addToCart(product)
            _events.emit(ProductEvent.ShowSnackbar("${product.name} added to cart"))
        }
    }
}

// In a Composable
@Composable
fun ProductScreen(vm: ProductViewModel = hiltViewModel()) {
    val uiState by vm.uiState.collectAsStateWithLifecycle()
    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(Unit) {
        vm.events.collect { event ->
            when (event) {
                is ProductEvent.ShowSnackbar -> snackbarHostState.showSnackbar(event.message)
                ProductEvent.NavigateToCart  -> { /* navigate */ }
            }
        }
    }

    Scaffold(snackbarHost = { SnackbarHost(snackbarHostState) }) { padding ->
        // render uiState
    }
}
```

### Room — Entity, DAO, Database Setup

```kotlin
// Entity
@Entity(tableName = "products")
data class ProductEntity(
    @PrimaryKey val id: Int,
    @ColumnInfo(name = "name") val name: String,
    @ColumnInfo(name = "price_cents") val priceCents: Int,
    @ColumnInfo(name = "created_at") val createdAt: Long = System.currentTimeMillis(),
)

// DAO
@Dao
interface ProductDao {
    @Query("SELECT * FROM products ORDER BY name ASC")
    fun observeAll(): Flow<List<ProductEntity>>

    @Query("SELECT * FROM products WHERE id = :id")
    suspend fun findById(id: Int): ProductEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertAll(products: List<ProductEntity>)

    @Delete
    suspend fun delete(product: ProductEntity)

    @Query("DELETE FROM products")
    suspend fun deleteAll()
}

// Database
@Database(
    entities = [ProductEntity::class],
    version = 2,
    exportSchema = true,
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun productDao(): ProductDao

    companion object {
        @Volatile private var INSTANCE: AppDatabase? = null

        fun getInstance(context: Context): AppDatabase =
            INSTANCE ?: synchronized(this) {
                Room.databaseBuilder(context, AppDatabase::class.java, "app.db")
                    .addMigrations(MIGRATION_1_2)
                    .build()
                    .also { INSTANCE = it }
            }
    }
}

val MIGRATION_1_2 = object : Migration(1, 2) {
    override fun migrate(db: SupportSQLiteDatabase) {
        db.execSQL("ALTER TABLE products ADD COLUMN created_at INTEGER NOT NULL DEFAULT 0")
    }
}
```

Provide via Hilt (see module section below). Always use `Flow<T>` in DAOs for reactive data; use `suspend` for one-shot queries.

### Retrofit + Moshi

```kotlin
// API model
data class ProductResponse(
    @Json(name = "id")    val id: Int,
    @Json(name = "name")  val name: String,
    @Json(name = "price") val price: Double,
)

// Retrofit service interface
interface ProductService {
    @GET("products")
    suspend fun getProducts(
        @Query("category") category: String? = null,
        @Query("page") page: Int = 1,
    ): List<ProductResponse>

    @GET("products/{id}")
    suspend fun getProduct(@Path("id") id: Int): ProductResponse

    @POST("products")
    suspend fun createProduct(@Body body: CreateProductRequest): ProductResponse
}

// Build Retrofit instance
val retrofit = Retrofit.Builder()
    .baseUrl("https://api.example.com/v1/")
    .addConverterFactory(
        MoshiConverterFactory.create(
            Moshi.Builder().add(KotlinJsonAdapterFactory()).build()
        )
    )
    .client(
        OkHttpClient.Builder()
            .addInterceptor(HttpLoggingInterceptor().apply {
                level = if (BuildConfig.DEBUG) HttpLoggingInterceptor.Level.BODY
                        else HttpLoggingInterceptor.Level.NONE
            })
            .addInterceptor { chain ->
                val request = chain.request().newBuilder()
                    .addHeader("Authorization", "Bearer ${TokenStore.get()}")
                    .build()
                chain.proceed(request)
            }
            .build()
    )
    .build()
```

### Hilt Module Setup

```kotlin
// di/NetworkModule.kt
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides @Singleton
    fun provideOkHttpClient(): OkHttpClient = OkHttpClient.Builder()
        .addInterceptor(AuthInterceptor())
        .build()

    @Provides @Singleton
    fun provideMoshi(): Moshi = Moshi.Builder()
        .add(KotlinJsonAdapterFactory())
        .build()

    @Provides @Singleton
    fun provideRetrofit(client: OkHttpClient, moshi: Moshi): Retrofit =
        Retrofit.Builder()
            .baseUrl("https://api.example.com/v1/")
            .client(client)
            .addConverterFactory(MoshiConverterFactory.create(moshi))
            .build()

    @Provides @Singleton
    fun provideProductService(retrofit: Retrofit): ProductService =
        retrofit.create(ProductService::class.java)
}

// di/DatabaseModule.kt
@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides @Singleton
    fun provideDatabase(@ApplicationContext ctx: Context): AppDatabase =
        AppDatabase.getInstance(ctx)

    @Provides
    fun provideProductDao(db: AppDatabase): ProductDao = db.productDao()
}

// Application class
@HiltAndroidApp
class MyApp : Application()
```

Annotate `Activity`, `Fragment`, `ViewModel`, `Service` with `@AndroidEntryPoint` to enable field injection. Use `@HiltViewModel` on ViewModels.

### Play Store Listing Requirements

Before submitting a release:

**Technical:**
- `targetSdkVersion` at least the current requirement (Google updates this annually)
- 64-bit support: build with ABI splits or universal APK including arm64-v8a
- App signing: enroll in Play App Signing; upload key stays with you, Google manages delivery key
- App Bundle (`.aab`) required for new apps — not APK
- Permissions declared in `AndroidManifest.xml` must be justified in the data safety form

**Store listing assets:**
- Feature graphic: 1024x500px
- Icon: 512x512px (separate from app icon; used in Play Store)
- Screenshots: at least 2 per declared device type (phone, tablet, Chromebook, TV)
- Short description: 80 characters
- Full description: up to 4000 characters

**Data safety section:**
- Declare all data types collected, transmitted, or shared
- Indicate whether data is linked to user identity
- Declare whether data is used for tracking
- Third-party SDKs (ads, analytics) often collect data — disclose their collection too

**Pre-launch report:**
- Run automated tests via Firebase Test Lab through Play Console
- Review crash reports and ANRs before promoting to production

## Example

A product list screen backed by Room + Retrofit with offline-first caching:

```kotlin
// Repository
class ProductRepository @Inject constructor(
    private val service: ProductService,
    private val dao: ProductDao,
) {
    fun observeProducts(): Flow<List<Product>> =
        dao.observeAll().map { entities -> entities.map { it.toProduct() } }

    suspend fun syncProducts() {
        val remote = service.getProducts()
        dao.deleteAll()
        dao.upsertAll(remote.map { it.toEntity() })
    }
}

// Screen
@Composable
fun ProductListScreen(vm: ProductViewModel = hiltViewModel()) {
    val state by vm.uiState.collectAsStateWithLifecycle()

    LaunchedEffect(Unit) { vm.sync() }

    LazyColumn {
        items(state.products, key = { it.id }) { product ->
            ProductCard(
                product = product,
                onAddToCart = { vm.onAddToCartClick(product) },
            )
        }
    }
}
```

---
