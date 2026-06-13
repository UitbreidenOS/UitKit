# Flutter 3+

## Cuándo activar
- Construcción de aplicaciones Flutter para iOS, Android, web, o desktop
- Arquitectura de gestión de estado con Riverpod 2
- Configuración de navegación con go_router
- Implementación de canales de plataforma para integración de código nativo
- Optimización del rendimiento de re-compilación de widgets
- Ejecución de `flutter build` para artefactos de producción

## Cuándo NO usar
- React Native, Expo u otros frameworks móviles que no sean Flutter
- Herramientas CLI solo Dart o Dart del lado del servidor sin widgets de Flutter
- Cuando la pregunta es sobre configuración de Xcode/Android Studio no relacionada con herramientas de construcción de Flutter

## Instrucciones

### Optimización de Recompilación de Widgets

Cada `setState`, cambio de proveedor o notificación de widget heredado recompila el subárbol del widget. Minimizar el radio de impacto:

**Bajar el estado.** Mantener widgets con estado lo más cerca posible de la UI que depende de ellos. Un único `StatefulWidget` de nivel superior recompila todo el árbol.

**Usar constructores `const`.** Widgets construidos con `const` se saltan durante recompilación si su configuración no ha cambiado.

```dart
// Good — these don't rebuild when parent rebuilds
const Text('Static label'),
const SizedBox(height: 16),
const Icon(Icons.star),
```

**Extraer subárboles pesados.** Extraer subárboles estables en su propia clase de widget. Flutter salta widgets sin cambios cuando su `==` retorna true (automático para instancias `const`).

**Usar `RepaintBoundary` para animaciones.** Envolver subárboles animados para aislar su capa GPU del resto del árbol.

```dart
RepaintBoundary(
  child: AnimatedContainer(
    duration: const Duration(milliseconds: 300),
    width: _expanded ? 200 : 100,
    color: Colors.blue,
  ),
)
```

**Evitar construir widgets dentro de métodos `build`.** Funciones que retornan widgets previenen que Flutter identifique subárboles sin cambios. Usar clases `Widget` propias o patrón `Builder` en su lugar.

### Tipos de Proveedor de Riverpod 2

| Provider | Caso de uso |
|---|---|
| `Provider<T>` | Valor sincrónico, de solo lectura o servicio |
| `FutureProvider<T>` | Valor async de una sola vez (cargado una vez, sin mutación) |
| `StreamProvider<T>` | Secuencia continua de valores (WebSocket, Firestore) |
| `NotifierProvider<N, T>` | Estado mutable sincrónico con métodos lógicos |
| `AsyncNotifierProvider<N, T>` | Estado mutable async con carga/error/datos |
| `StateProvider<T>` | Valor mutable simple sin lógica (estado rápido de UI) |

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

En widgets, usar `ref.watch` para recompilación en cambio, `ref.read` para acceso único en callbacks, `ref.listen` para efectos secundarios.

### Definición de Ruta go_router

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

Navegar:
```dart
context.go('/orders');           // replace history
context.push('/orders/42');      // push onto stack
context.pop();                   // go back
context.goNamed('order-detail', pathParameters: {'id': '42'});
```

### Patrón de Canal de Plataforma — MethodChannel

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

Usar `EventChannel` para secuencias continuas (datos de sensores, ubicación). Usar `BasicMessageCodec` para datos binarios. Usar canales de métodos solo para patrones de solicitud/respuesta.

### Banderas de flutter build

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

Usar `--dart-define` para inyectar variables de entorno en tiempo de compilación. Nunca almacenar secretos en `--dart-define` para aplicaciones cliente — son extraíbles del binario.

## Ejemplo

Una pantalla de listado de productos usando `AsyncNotifierProvider` y navegación go_router:

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

Construir para producción:
```bash
flutter build appbundle --release --obfuscate --split-debug-info=./debug/
```

---
