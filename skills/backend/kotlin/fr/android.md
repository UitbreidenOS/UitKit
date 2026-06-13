# Kotlin + Android

## Quand activer
- Construction d'applications Android avec Jetpack Compose
- Configuration de ViewModel avec StateFlow ou SharedFlow
- Configuration de la base de données Room (entité, DAO, classe de base de données)
- Intégration de Retrofit pour HTTP et Moshi/Gson pour JSON
- Câblage de l'injection de dépendances avec Hilt
- Préparation d'une release pour la soumission au Google Play Store

## Quand ne PAS utiliser
- Projets multi-plateforme Flutter ou React Native
- Applications Android utilisant toujours Views/mises en page XML sans implication de Compose
- Projets Kotlin Multiplatform (KMP) où Android n'est qu'une cible

## Instructions

### Optimisation de la recomposition Compose

La recomposition réexécute les fonctions composables quand leurs entrées changent. Éviter le travail inutile :

**Utiliser `remember` pour mettre en cache les valeurs calculées et les objets au-delà des recompositions :**

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

**Utiliser `derivedStateOf` pour les valeurs dérivées de l'état observable pour réduire la fréquence de recomposition :**

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

**Stabilité :** Compose ignore la recomposition des composables dont les paramètres n'ont pas changé — mais seulement si tous les paramètres sont considérés comme « stables » (primitives, classes annotées `@Stable`/`@Immutable`, ou classes que Compose déduit comme stables). Les data classes avec seulement des champs stables sont déduites comme stables automatiquement.

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

Utiliser `kotlinx.collections.immutable` (`ImmutableList`, `PersistentList`) pour les collections stables dans Compose.

### ViewModel avec StateFlow et SharedFlow

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

### Room — Configuration d'entité, DAO, base de données

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

Fournir via Hilt (voir section module ci-dessous). Toujours utiliser `Flow<T>` dans les DAO pour les données réactives ; utiliser `suspend` pour les requêtes ponctuelles.

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

### Configuration du module Hilt

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

Annoter `Activity`, `Fragment`, `ViewModel`, `Service` avec `@AndroidEntryPoint` pour activer l'injection de champ. Utiliser `@HiltViewModel` sur les ViewModels.

### Exigences de liste Play Store

Avant de soumettre une release :

**Technique :**
- `targetSdkVersion` au moins l'exigence actuelle (Google met cela à jour annuellement)
- Support 64 bits : construire avec des fractionnements ABI ou APK universel incluant arm64-v8a
- Signature d'application : s'inscrire à la signature d'application Play ; la clé de téléchargement vous reste, Google gère la clé de livraison
- App Bundle (`.aab`) requis pour les nouvelles applications — pas APK
- Les permissions déclarées dans `AndroidManifest.xml` doivent être justifiées dans le formulaire de sécurité des données

**Actifs de liste de magasin :**
- Graphique de caractéristique : 1024x500px
- Icône : 512x512px (séparé de l'icône d'application ; utilisé dans Play Store)
- Captures d'écran : au moins 2 par type d'appareil déclaré (téléphone, tablette, Chromebook, TV)
- Description brève : 80 caractères
- Description complète : jusqu'à 4000 caractères

**Section sécurité des données :**
- Déclarer tous les types de données collectés, transmis ou partagés
- Indiquer si les données sont liées à l'identité de l'utilisateur
- Déclarer si les données sont utilisées pour le suivi
- Les SDK tiers (publicités, analyse) collectent souvent des données — divulguer leur collection également

**Rapport de pré-lancement :**
- Exécuter des tests automatisés via Firebase Test Lab via Play Console
- Examiner les rapports de crash et ANR avant la promotion en production

## Exemple

Un écran de liste de produits soutenu par Room + Retrofit avec mise en cache offline-first :

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
