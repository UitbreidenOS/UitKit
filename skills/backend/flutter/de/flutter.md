# Flutter 3+

## Wann aktivieren
- Aufbau von Flutter-Anwendungen für iOS, Android, Web oder Desktop
- Architekturierung von State Management mit Riverpod 2
- Konfigurieren der Navigation mit go_router
- Implementierung von Platform Channels für Native-Code-Integration
- Optimierung der Widget-Rebuild-Leistung
- Ausführung von `flutter build` für Production-Artefakte

## Wann NICHT verwenden
- React Native, Expo oder andere Nicht-Flutter-Mobile-Frameworks
- Dart-only CLI-Tools oder Server-side Dart ohne Flutter-Widgets
- Wenn die Frage Xcode/Android Studio-Konfiguration betrifft, die nicht mit Flutter-Build-Tooling zusammenhängt

## Anweisungen

### Widget Rebuild Optimization

Jedes `setState`, Provider-Change oder Inherited-Widget-Benachrichtigung erstellt den Widget-Subtree neu. Minimieren Sie die Blast-Radius:

**Lift state down.** Halten Sie zustandsbehaftete Widgets so nah wie möglich an der UI, die davon abhängt. Ein einzelnes Top-Level-`StatefulWidget` erstellt den gesamten Tree neu.

**Verwenden Sie `const` Konstruktoren.** Widgets, die mit `const` konstruiert werden, werden während des Rebuilds übersprungen, wenn sich ihre Konfiguration nicht geändert hat.

```dart
// Good — these don't rebuild when parent rebuilds
const Text('Static label'),
const SizedBox(height: 16),
const Icon(Icons.star),
```

**Extract heavy subtrees.** Ziehen Sie stabile Subtrees in ihre eigene Widget-Klasse. Flutter überspringt unveränderte Widgets, wenn `==` true zurückgibt (automatisch für `const`-Instanzen).

**Verwenden Sie `RepaintBoundary` für Animationen.** Wickeln Sie animierte Subtrees ein, um ihre GPU-Schicht vom Rest des Trees zu isolieren.

```dart
RepaintBoundary(
  child: AnimatedContainer(
    duration: const Duration(milliseconds: 300),
    width: _expanded ? 200 : 100,
    color: Colors.blue,
  ),
)
```

**Vermeiden Sie, Widgets in `build`-Methoden zu bauen.** Funktionen, die Widgets zurückgeben, verhindern, dass Flutter unveränderte Subtrees identifiziert. Verwenden Sie stattdessen ordentliche `Widget`-Klassen oder `Builder`-Pattern.

### Riverpod 2 Provider-Typen

| Provider | Use case |
|---|---|
| `Provider<T>` | Synchroner, schreibgeschützter berechneter Wert oder Service |
| `FutureProvider<T>` | One-Shot-Async-Wert (geladen einmal, keine Mutation) |
| `StreamProvider<T>` | Kontinuierlicher Stream von Werten (WebSocket, Firestore) |
| `NotifierProvider<N, T>` | Synchroner veränderbarer Status mit Logik-Methoden |
| `AsyncNotifierProvider<N, T>` | Async veränderbarer Status mit Loading/Error/Data |
| `StateProvider<T>` | Einfacher veränderbarer Wert ohne Logik (schneller UI-Status) |

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

In Widgets verwenden Sie `ref.watch`, um beim Change zu rebuilden, `ref.read` für One-Off-Zugriff in Callbacks, `ref.listen` für Side Effects.

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

Verwenden Sie `EventChannel` für kontinuierliche Streams (Sensordaten, Standort). Verwenden Sie `BasicMessageCodec` für Binärdaten. Verwenden Sie Method Channels nur für Request/Response-Pattern.

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

Verwenden Sie `--dart-define`, um Compile-Time-Umgebungsvariablen zu injizieren. Speichern Sie niemals Secrets in `--dart-define` für Client-Apps — sie sind aus der Binärdatei extrahierbar.

## Beispiel

Ein Produktlisten-Screen mit `AsyncNotifierProvider` und go_router-Navigation:

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

Build for production:
```bash
flutter build appbundle --release --obfuscate --split-debug-info=./debug/
```

---
