# Kotlin + Android

## Cuándo activar
- Construcción de aplicaciones Android con Jetpack Compose
- Configuración de ViewModel con StateFlow o SharedFlow
- Configuración de base de datos Room (entity, DAO, database class)
- Integración de Retrofit para HTTP y Moshi/Gson para JSON
- Cableado de inyección de dependencia con Hilt
- Preparación de una versión para envío de Google Play Store

## Cuándo NO usar
- Proyectos multiplataforma Flutter o React Native
- Aplicaciones Android aún usando Views/layouts XML sin participación de Compose
- Proyectos Kotlin Multiplatform (KMP) donde Android es solo un objetivo

## Instrucciones

### Optimización de Recomposición de Compose

La recomposición ejecuta nuevamente las funciones componibles cuando sus entradas cambian. Evitar trabajo innecesario:

**Usar `remember` para cachear valores calculados y objetos en recomposiciones:**

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

**Usar `derivedStateOf` para valores derivados del estado observable para reducir frecuencia de recomposición:**

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

**Estabilidad:** Compose salta recomposición de componibles cuya parameterización no ha cambiado — pero solo si todos los parámetros se consideran "estables" (primitivos, clases anotadas con `@Stable`/`@Immutable`, o clases que Compose deduce como estables). Data classes con solo campos estables se deducen como estables automáticamente.

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

Usar `kotlinx.collections.immutable` (`ImmutableList`, `PersistentList`) para colecciones estables en Compose.

### ViewModel con StateFlow y SharedFlow

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

Proveer vía Hilt. Siempre usar `Flow<T>` en DAOs para datos reactivos; usar `suspend` para consultas de una sola vez.

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

### Configuración de Módulo Hilt

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

Anotar `Activity`, `Fragment`, `ViewModel`, `Service` con `@AndroidEntryPoint` para habilitar inyección de campo. Usar `@HiltViewModel` en ViewModels.

### Requisitos de Envío en Play Store

Antes de enviar una versión:

**Técnico:**
- `targetSdkVersion` al menos el requisito actual (Google actualiza esto anualmente)
- Soporte de 64-bit: construir con ABI splits o APK universal incluyendo arm64-v8a
- Firma de aplicación: inscribirse en Play App Signing; tu clave se queda contigo, Google maneja la clave de entrega
- App Bundle (`.aab`) requerido para nuevas aplicaciones — no APK
- Permisos declarados en `AndroidManifest.xml` deben justificarse en el formulario de seguridad de datos

**Activos de listado de tienda:**
- Gráfico destacado: 1024x500px
- Ícono: 512x512px (separado del ícono de la aplicación; usado en Play Store)
- Capturas de pantalla: al menos 2 por tipo de dispositivo declarado (teléfono, tableta, Chromebook, TV)
- Descripción corta: 80 caracteres
- Descripción completa: hasta 4000 caracteres

**Sección de seguridad de datos:**
- Declarar todos los tipos de datos recopilados, transmitidos o compartidos
- Indicar si los datos están vinculados a la identidad del usuario
- Declarar si los datos se usan para seguimiento
- SDK de terceros (publicidades, análisis) a menudo recopilan datos — divulgar su recopilación también

**Informe de prelanzamiento:**
- Ejecutar pruebas automatizadas vía Firebase Test Lab a través de Play Console
- Revisar informes de bloqueos y ANRs antes de promover a producción

## Ejemplo

Una pantalla de listado de productos respaldada por Room + Retrofit con almacenamiento en caché offline-first:

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
