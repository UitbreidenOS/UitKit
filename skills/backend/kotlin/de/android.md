# Kotlin + Android

## Wann aktivieren
- Aufbau von Android-Apps mit Jetpack Compose
- Setup von ViewModel mit StateFlow oder SharedFlow
- Konfigurieren von Room Database (Entity, DAO, Database Class)
- Integration von Retrofit für HTTP und Moshi/Gson für JSON
- Verdrahten von Dependency Injection mit Hilt
- Vorbereitung eines Release für Google Play Store Submission

## Wann NICHT verwenden
- Cross-Platform Flutter- oder React Native-Projekte
- Android-Apps, die immer noch Views/XML Layouts ohne Compose-Beteiligung verwenden
- Kotlin Multiplatform (KMP) Projekte, bei denen Android nur ein Target ist

## Anweisungen

### Compose Recomposition Optimization

Recomposition führt Composable-Funktionen erneut aus, wenn sich ihre Eingaben ändern. Vermeiden Sie unnötige Arbeit:

**Verwenden Sie `remember`, um berechnete Werte und Objekte über Recompositions hinweg zu zwischenspeichern:**

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

**Verwenden Sie `derivedStateOf` für von Observable-State abgeleitete Werte, um die Recomposition-Häufigkeit zu reduzieren:**

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

**Stability:** Compose überspringt die Recomposition von Composables, deren Parameter sich nicht geändert haben — aber nur wenn alle Parameter als "stabil" betrachtet werden (Primitives, `@Stable`/`@Immutable`-Annotierte Klassen oder Klassen, die Compose als stabil herleitet). Data Classes mit nur stabilen Feldern werden automatisch als stabil hergeleitet.

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

Verwenden Sie `kotlinx.collections.immutable` (`ImmutableList`, `PersistentList`) für stabile Collections in Compose.

### ViewModel mit StateFlow und SharedFlow

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

Stellen Sie via Hilt bereit (siehe Modul-Abschnitt unten). Verwenden Sie immer `Flow<T>` in DAOs für reaktive Daten; verwenden Sie `suspend` für One-Shot-Queries.

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

Annotieren Sie `Activity`, `Fragment`, `ViewModel`, `Service` mit `@AndroidEntryPoint`, um Field Injection zu aktivieren. Verwenden Sie `@HiltViewModel` auf ViewModels.

### Play Store Listing Requirements

Vor dem Einreichen eines Release:

**Technical:**
- `targetSdkVersion` mindestens die aktuelle Anforderung (Google aktualisiert dies jährlich)
- 64-Bit-Unterstützung: Build mit ABI Splits oder universelle APK inkl. arm64-v8a
- App Signing: Registrieren Sie sich in Play App Signing; Upload-Key bleibt bei Ihnen, Google verwaltet Delivery-Key
- App Bundle (`.aab`) erforderlich für neue Apps — nicht APK
- In `AndroidManifest.xml` deklarierte Berechtigungen müssen im Daten-Sicherheitsformular begründet sein

**Store listing assets:**
- Feature graphic: 1024x500px
- Icon: 512x512px (getrennt von App-Icon; in Play Store verwendet)
- Screenshots: mindestens 2 pro deklariertem Device-Type (Phone, Tablet, Chromebook, TV)
- Short description: 80 Zeichen
- Full description: bis zu 4000 Zeichen

**Data safety section:**
- Alle erfassten, übertragenen oder gemeinsam genutzten Datentypen deklarieren
- Angeben, ob Daten mit Benutzeridentität verknüpft sind
- Deklarieren, ob Daten zum Tracking verwendet werden
- Drittanbieter-SDKs (Ads, Analytics) erfassen oft Daten — offenbaren Sie deren Erfassung auch

**Pre-launch report:**
- Führen Sie automatisierte Tests via Firebase Test Lab durch Play Console aus
- Überprüfen Sie Crash-Reports und ANRs vor der Promotion zu Production

## Beispiel

Ein Product-List-Screen mit Room + Retrofit mit Offline-First Caching:

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
