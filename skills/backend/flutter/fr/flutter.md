# Flutter 3+

## Quand activer
- Construction d'applications Flutter pour iOS, Android, web, ou desktop
- Architecture de la gestion d'état avec Riverpod 2
- Configuration de la navigation avec go_router
- Implémentation de canaux de plateforme pour l'intégration de code natif
- Optimisation de la performance de reconstruction des widgets
- Exécution de `flutter build` pour les artefacts de production

## Quand ne PAS utiliser
- React Native, Expo, ou autres frameworks mobiles non-Flutter
- Outils CLI Dart uniquement ou Dart côté serveur sans widgets Flutter
- Quand la question concerne la configuration Xcode/Android Studio sans rapport avec les outils de construction Flutter

## Instructions

### Optimisation de la reconstruction des widgets

Chaque `setState`, changement de provider, ou notification de widget hérité reconstruit le sous-arbre du widget. Minimiser le rayon d'effet :

**Abaisser l'état.** Conserver les widgets stateful aussi près que possible de l'interface utilisateur qui en dépend. Un seul `StatefulWidget` de haut niveau reconstruit l'arbre entier.

**Utiliser les constructeurs `const`.** Les widgets construits avec `const` sont ignorés pendant la reconstruction si leur configuration n'a pas changé.

```dart
// Good — these don't rebuild when parent rebuilds
const Text('Static label'),
const SizedBox(height: 16),
const Icon(Icons.star),
```

**Extraire les sous-arbres lourds.** Extraire les sous-arbres stables en leur propre classe de widget. Flutter ignore les widgets inchangés quand leur `==` retourne true (automatique pour les instances `const`).

**Utiliser `RepaintBoundary` pour les animations.** Envelopper les sous-arbres animés pour isoler leur couche GPU du reste de l'arbre.

```dart
RepaintBoundary(
  child: AnimatedContainer(
    duration: const Duration(milliseconds: 300),
    width: _expanded ? 200 : 100,
    color: Colors.blue,
  ),
)
```

**Éviter de construire des widgets à l'intérieur des méthodes `build`.** Les fonctions qui retournent des widgets empêchent Flutter d'identifier les sous-arbres inchangés. Utiliser les classes `Widget` appropriées ou le modèle `Builder` à la place.

### Types de providers Riverpod 2

| Provider | Cas d'utilisation |
|---|---|
| `Provider<T>` | Valeur calculée synchrone en lecture seule ou service |
| `FutureProvider<T>` | Valeur asynchrone ponctuelle (chargée une fois, pas de mutation) |
| `StreamProvider<T>` | Flux continu de valeurs (WebSocket, Firestore) |
| `NotifierProvider<N, T>` | État mutable synchrone avec méthodes logiques |
| `AsyncNotifierProvider<N, T>` | État mutable asynchrone avec chargement/erreur/données |
| `StateProvider<T>` | Valeur mutable simple sans logique (état rapide d'interface utilisateur) |

```dart
// Provider — read-only service
final httpClientProvider = Provider<Dio>((ref) => Dio());

// FutureProvider — async fetch, no mutation
final userProvider = FutureProvider.family<User, int>((ref, id) async {
  final dio = ref.watch(httpClientProvider);
  final resp = await dio.get('/users/$id');
  return User.fromJson(resp.data);
});

// NotifierProvider — mutable state with methods
class CartNotifier extends Notifier<List<CartItem>> {
  @override
  List<CartItem> build() => [];

  void add(CartItem item) => state = [...state, item];
  void remove(String id) => state = state.where((i) => i.id != id).toList();
  void clear() => state = [];
}

final cartProvider = NotifierProvider<CartNotifier, List<CartItem>>(CartNotifier.new);

// AsyncNotifierProvider — async state with loading/error
class OrdersNotifier extends AsyncNotifier<List<Order>> {
  @override
  Future<List<Order>> build() => ref.read(orderRepoProvider).fetchAll();

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => ref.read(orderRepoProvider).fetchAll());
  }
}

final ordersProvider = AsyncNotifierProvider<OrdersNotifier, List<Order>>(OrdersNotifier.new);
```

Dans les widgets, utiliser `ref.watch` pour reconstruire sur changement, `ref.read` pour l'accès ponctuel dans les callbacks, `ref.listen` pour les effets secondaires.

### Définition de route go_router

```dart
// lib/router.dart
final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateProvider);

  return GoRouter(
    initialLocation: '/home',
    debugLogDiagnostics: true,
    redirect: (context, state) {
      final isLoggedIn = authState.valueOrNull != null;
      final isAuthRoute = state.matchedLocation.startsWith('/auth');

      if (!isLoggedIn && !isAuthRoute) return '/auth/login';
      if (isLoggedIn && isAuthRoute) return '/home';
      return null;
    },
    routes: [
      GoRoute(
        path: '/auth/login',
        builder: (ctx, state) => const LoginScreen(),
      ),
      ShellRoute(
        builder: (ctx, state, child) => AppShell(child: child),
        routes: [
          GoRoute(
            path: '/home',
            builder: (ctx, state) => const HomeScreen(),
          ),
          GoRoute(
            path: '/orders',
            builder: (ctx, state) => const OrdersScreen(),
            routes: [
              GoRoute(
                path: ':id',
                builder: (ctx, state) {
                  final id = state.pathParameters['id']!;
                  return OrderDetailScreen(orderId: id);
                },
              ),
            ],
          ),
        ],
      ),
    ],
  );
});
```

Naviguer :
```dart
context.go('/orders');           // replace history
context.push('/orders/42');      // push onto stack
context.pop();                   // go back
context.goNamed('order-detail', pathParameters: {'id': '42'});
```

### Canal de plateforme — Modèle MethodChannel

```dart
// lib/services/battery_service.dart
import 'package:flutter/services.dart';

class BatteryService {
  static const _channel = MethodChannel('com.example.app/battery');

  Future<int> getBatteryLevel() async {
    try {
      final level = await _channel.invokeMethod<int>('getBatteryLevel');
      return level ?? -1;
    } on PlatformException catch (e) {
      throw Exception('Failed to get battery level: ${e.message}');
    }
  }
}
```

```kotlin
// android/app/src/main/kotlin/com/example/app/MainActivity.kt
class MainActivity : FlutterActivity() {
    private val channel = "com.example.app/battery"

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, channel)
            .setMethodCallHandler { call, result ->
                if (call.method == "getBatteryLevel") {
                    val level = getBatteryLevel()
                    if (level != -1) result.success(level)
                    else result.error("UNAVAILABLE", "Battery not available", null)
                } else {
                    result.notImplemented()
                }
            }
    }

    private fun getBatteryLevel(): Int {
        val manager = getSystemService(BATTERY_SERVICE) as BatteryManager
        return manager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
    }
}
```

Utiliser `EventChannel` pour les flux continus (données des capteurs, localisation). Utiliser `BasicMessageCodec` pour les données binaires. Utiliser les canaux de méthode seulement pour les modèles requête/réponse.

### Drapeaux flutter build

```bash
# iOS — requires Xcode and valid provisioning profile
flutter build ios --release
flutter build ipa --release                           # .ipa for App Store / TestFlight
flutter build ipa --release --export-method app-store

# Android APK (direct install)
flutter build apk --release
flutter build apk --release --split-per-abi          # one APK per CPU architecture

# Android App Bundle (Play Store)
flutter build appbundle --release
flutter build appbundle --release --obfuscate --split-debug-info=./debug_info/

# Web
flutter build web --release --base-href /app/

# Common flags
flutter build appbundle \
  --release \
  --dart-define=ENVIRONMENT=production \
  --dart-define=API_URL=https://api.example.com \
  --obfuscate \
  --split-debug-info=./debug_symbols/
```

Utiliser `--dart-define` pour injecter des variables d'environnement compile-time. Ne jamais stocker les secrets dans `--dart-define` pour les applications client — ils sont extractibles du binaire.

## Exemple

Un écran de liste de produits utilisant `AsyncNotifierProvider` et la navigation go_router :

```dart
// Notifier
class ProductsNotifier extends AsyncNotifier<List<Product>> {
  @override
  Future<List<Product>> build() {
    return ref.read(productRepoProvider).fetchAll();
  }
}

final productsProvider =
    AsyncNotifierProvider<ProductsNotifier, List<Product>>(ProductsNotifier.new);

// Widget
class ProductsScreen extends ConsumerWidget {
  const ProductsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final products = ref.watch(productsProvider);

    return Scaffold(
      appBar: const AppBar(title: Text('Products')),
      body: switch (products) {
        AsyncData(:final value) => ListView.builder(
            itemCount: value.length,
            itemBuilder: (ctx, i) => ListTile(
              title: Text(value[i].name),
              onTap: () => context.push('/products/${value[i].id}'),
            ),
          ),
        AsyncError(:final error) => Center(child: Text('Error: $error')),
        _ => const Center(child: CircularProgressIndicator()),
      },
    );
  }
}
```

Construire pour la production :
```bash
flutter build appbundle --release --obfuscate --split-debug-info=./debug/
```

---
