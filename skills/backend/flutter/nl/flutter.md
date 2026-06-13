# Flutter 3+

## Wanneer activeren
- Bouwen van Flutter applicaties voor iOS, Android, web, of desktop
- Architecting state management met Riverpod 2
- Configureren van navigation met go_router
- Implementeren van platform channels voor native code integratie
- Optimaliseren van widget rebuild performance
- Running `flutter build` voor production artifacts

## Wanneer NIET gebruiken
- React Native, Expo, of andere non-Flutter mobile frameworks
- Dart-only CLI tools of server-side Dart zonder Flutter widgets
- Wanneer vraag over Xcode/Android Studio configuratie onrelated is aan Flutter build tooling

## Instructies

### Widget Rebuild Optimization

Elk `setState`, provider change, of inherited widget notification herbouwt widget subtree. Minimaliseer blast radius:

**Lift state down.** Houd stateful widgets zo dicht mogelijk bij UI die ervan afhangt. Single top-level `StatefulWidget` herbouwt hele tree.

**Gebruik `const` constructors.** Widgets geconstrueerd met `const` worden overgeslagen tijdens rebuild als configuratie niet veranderd.

```dart
// Good — these don't rebuild when parent rebuilds
const Text('Static label'),
const SizedBox(height: 16),
const Icon(Icons.star),
```

**Extract heavy subtrees.** Pull stabiele subtrees in hun eigen widget class. Flutter slaat onveranderde widgets over wanneer hun `==` true retourneert (automatisch voor `const` instances).

**Gebruik `RepaintBoundary` voor animations.** Wrap geanimeerde subtrees om hun GPU layer van rest tree te isoleren.

```dart
RepaintBoundary(
  child: AnimatedContainer(
    duration: const Duration(milliseconds: 300),
    width: _expanded ? 200 : 100,
    color: Colors.blue,
  ),
)
```

**Vermijd widgets bouwen in `build` methods.** Functies die widgets retourneren voorkomen Flutter van onveranderde subtrees identificeren. Gebruik proper `Widget` classes of `Builder` patroon in plaats.

### Riverpod 2 Provider Types

| Provider | Use case |
|---|---|
| `Provider<T>` | Synchronous, read-only computed value of service |
| `FutureProvider<T>` | One-shot async value (loaded once, no mutation) |
| `StreamProvider<T>` | Continuous stream of values (WebSocket, Firestore) |
| `NotifierProvider<N, T>` | Synchronous mutable state with logic methods |
| `AsyncNotifierProvider<N, T>` | Async mutable state with loading/error/data |
| `StateProvider<T>` | Simple mutable value with no logic (quick UI state) |

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
```

In widgets, gebruik `ref.watch` om op verandering opnieuw in te bouwen, `ref.read` voor one-off access in callbacks, `ref.listen` voor side effects.

### go_router Route Definition

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

Navigate:
```dart
context.go('/orders');           // replace history
context.push('/orders/42');      // push onto stack
context.pop();                   // go back
context.goNamed('order-detail', pathParameters: {'id': '42'});
```

### Platform Channel — MethodChannel Pattern

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

Gebruik `EventChannel` voor continuous streams (sensor data, location). Gebruik `BasicMessageCodec` voor binary data. Gebruik method channels alleen voor request/response patronen.

### flutter build Flags

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

Gebruik `--dart-define` om compile-time environment variabelen in te spuiten. Sla nooit secrets op in `--dart-define` voor client apps — ze zijn extractable van binary.

## Voorbeeld

Product listing screen met `AsyncNotifierProvider` en go_router navigation:

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

Build voor production:
```bash
flutter build appbundle --release --obfuscate --split-debug-info=./debug/
```

---
