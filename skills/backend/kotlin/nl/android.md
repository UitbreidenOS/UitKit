# Kotlin + Android

## Wanneer activeren
- Bouwen van Android apps met Jetpack Compose
- Instellen van ViewModel met StateFlow of SharedFlow
- Configureren van Room database (entity, DAO, database class)
- Integrating Retrofit voor HTTP en Moshi/Gson voor JSON
- Wiring dependency injection met Hilt
- Preparing release voor Google Play Store submission

## Wanneer NIET gebruiken
- Cross-platform Flutter of React Native projecten
- Android apps nog steeds met Views/XML layouts zonder Compose involvement
- Kotlin Multiplatform (KMP) projecten waarbij Android slechts één target is

## Instructies

### Compose Recomposition Optimization

Recomposition voert composable functies opnieuw uit wanneer hun inputs veranderen. Vermijd onnodig werk:

**Gebruik `remember` om computed values en objects over recompositions in cache op te slaan:**

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

**Gebruik `derivedStateOf` voor values afgeleid van observable state om recomposition frequency te reduceren:**

```kotlin
@Composable
fun ScrollToTopButton(listState: LazyListState) {
    // Without derivedStateOf — recomposes on every scroll pixel
    val showButton = listState.firstVisibleItemIndex > 0

    // With derivedStateOf — recomposes only when the boolean flips
    val showButton by remember {
        derivedStateOf { listState.firstVisibleItemIndex > 0 }
    }

    AnimatedVisibility(visible: showButton) {
        FloatingActionButton(onClick: { /* scroll to top */ }) {
            Icon(Icons.Default.KeyboardArrowUp, contentDescription: "Scroll to top")
        }
    }
}
```

**Stability:** Compose slaat recomposition van composables over waarvan parameters niet veranderd — maar alleen als alle parameters "stable" beschouwd (primitives, `@Stable`/`@Immutable` geannoteerde classes, of classes Compose inferred als stable). Data classes met alleen stable fields zijn automatisch inferred als stable.

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

Gebruik `kotlinx.collections.immutable` (`ImmutableList`, `PersistentList`) voor stabiele collections in Compose.

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

Provide via Hilt. Altijd gebruiken `Flow<T>` in DAOs voor reactive data; use `suspend` voor one-shot queries.

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

Annotate `Activity`, `Fragment`, `ViewModel`, `Service` met `@AndroidEntryPoint` om field injection in te schakelen. Gebruik `@HiltViewModel` op ViewModels.

### Play Store Listing Requirements

Voordat je release submitteert:

**Technical:**
- `targetSdkVersion` minstens huidige vereiste (Google update dit jaarlijks)
- 64-bit ondersteuning: build met ABI splits of universal APK inclusief arm64-v8a
- App signing: enroll in Play App Signing; upload key blijft met je, Google beheert delivery key
- App Bundle (`.aab`) vereist voor nieuwe apps — niet APK
- Permissions gedeclareerd in `AndroidManifest.xml` moeten gerechtvaardigd in data safety form

**Store listing assets:**
- Feature graphic: 1024x500px
- Icon: 512x512px (apart van app icon; gebruikt in Play Store)
- Screenshots: minstens 2 per declared device type (phone, tablet, Chromebook, TV)
- Short description: 80 characters
- Full description: tot 4000 characters

**Data safety section:**
- Declareer alle data types verzameld, verzonden, of gedeeld
- Indiceer of data gelinkt is aan user identity
- Declareer of data gebruikt wordt voor tracking
- Third-party SDKs (ads, analytics) verzamelen vaak data — disclose hun collection ook

**Pre-launch report:**
- Run geautomatiseerde tests via Firebase Test Lab door Play Console
- Review crash reports en ANRs voordat promoting naar production

## Voorbeeld

Product list screen backed door Room + Retrofit met offline-first caching:

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
