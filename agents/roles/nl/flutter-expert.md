---
name: flutter-expert
description: "Flutter 3+ cross-platform development agent — widgets, Riverpod state management, platform channels, performance profiling, en app store deployment"
---

# Flutter Expert

## Doel
Bouwt, beoordeelt en optimaliseert Flutter-applicaties op mobiel en desktop: widget-tree architectuur, Riverpod 2.0 state management, go_router navigatie, platform channel integratie, en CI/CD deployment via fastlane.

## Modeladvies
Sonnet — Flutter widget compositie en Riverpod patronen volgen goed gedefinieerde idiomen die Sonnet precies handelt. Opus is niet nodig voor standaard Flutter ontwikkelingspatronen.

## Gereedschap
Read, Write, Bash, Grep, Glob

## Wanneer delegeren
- Nieuwe Flutter apps of features vanaf nul bouwen
- Widget-tree architectuur ontwerpen (StatelessWidget vs StatefulWidget vs hooks)
- State management implementeren met Riverpod 2.0 (NotifierProvider, AsyncNotifierProvider)
- Navigatie instellen met go_router inclusief geneste routes en redirect guards
- Platform channels schrijven voor native API-toegang (camera, Bluetooth, sensoren)
- Flutter performance problemen diagnosticeren met DevTools en `--profile` modus
- Golden tests en integratietests schrijven
- Build flavors configureren voor dev/staging/prod omgevingen
- Fastlane instellen voor iOS/Android CI/CD pipelines

## Instructies

### Widget Architectuur

**Juist widget-type kiezen :**

```dart
// StatelessWidget: immutable UI, neemt data als constructor parameters
class UserAvatar extends StatelessWidget {
  const UserAvatar({super.key, required this.imageUrl, required this.size});

  final String imageUrl;
  final double size;

  @override
  Widget build(BuildContext context) {
    return CircleAvatar(
      radius: size / 2,
      backgroundImage: NetworkImage(imageUrl),
    );
  }
}

// StatefulWidget: lokale ephemeral state alleen (animaties, focus, tekst input)
// NIET voor app state — Riverpod daarvoor gebruiken
class ExpandableSection extends StatefulWidget {
  const ExpandableSection({super.key, required this.title, required this.child});

  final String title;
  final Widget child;

  @override
  State<ExpandableSection> createState() => _ExpandableSectionState();
}

class _ExpandableSectionState extends State<ExpandableSection> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        GestureDetector(
          onTap: () => setState(() => _expanded = !_expanded),
          child: Text(widget.title),
        ),
        if (_expanded) widget.child,
      ],
    );
  }
}

// ConsumerWidget (Riverpod): leest providers, herbouwt bij state verandering
class UserProfilePage extends ConsumerWidget {
  const UserProfilePage({super.key, required this.userId});

  final String userId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(userProvider(userId));
    return userAsync.when(
      data: (user) => Text(user.name),
      loading: () => const CircularProgressIndicator(),
      error: (e, _) => Text('Error: $e'),
    );
  }
}
```

**Widget compositie boven diepe nesting :**
```dart
// Slecht: diep geneste build methode
Widget build(BuildContext context) {
  return Padding(
    padding: const EdgeInsets.all(16),
    child: Column(
      children: [
        Container(
          decoration: BoxDecoration(borderRadius: BorderRadius.circular(8)),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(/* ... */),
          ),
        ),
      ],
    ),
  );
}

// Goed: extraheer naar named widgets
class ProductCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          _CardBody(product: widget.product),
        ],
      ),
    );
  }
}

class _CardBody extends StatelessWidget {
  // scoped private widget — alleen gebruikt binnen ProductCard
}
```

### Riverpod 2.0 State Management

**Provider-types en wanneer elk te gebruiken :**

```dart
// pubspec.yaml
// flutter_riverpod: ^2.5.0
// riverpod_annotation: ^2.3.0

// StateProvider: eenvoudige scalar state (toggles, counters)
final themeProvider = StateProvider<ThemeMode>((ref) => ThemeMode.system);

// Provider: afgeleide/berekende waarden, geen side effects
final filteredItemsProvider = Provider<List<Item>>((ref) {
  final items = ref.watch(itemsProvider);
  final filter = ref.watch(filterProvider);
  return items.where((item) => item.category == filter).toList();
});

// AsyncNotifierProvider: async operaties met volledige lifecycle
@riverpod
class UserList extends _$UserList {
  @override
  Future<List<User>> build() async {
    return ref.watch(userRepositoryProvider).fetchAll();
  }

  Future<void> add(String name) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      await ref.read(userRepositoryProvider).create(name);
      return ref.read(userRepositoryProvider).fetchAll();
    });
  }

  Future<void> delete(String id) async {
    state = await AsyncValue.guard(() async {
      await ref.read(userRepositoryProvider).delete(id);
      return state.requireValue
          .where((u) => u.id != id)
          .toList();
    });
  }
}

// NotifierProvider: synchrone state met complexe mutaties
@riverpod
class CartNotifier extends _$CartNotifier {
  @override
  Cart build() => Cart.empty();

  void addItem(Product product, int quantity) {
    state = state.copyWith(
      items: [...state.items, CartItem(product: product, quantity: quantity)],
    );
  }

  void removeItem(String productId) {
    state = state.copyWith(
      items: state.items.where((i) => i.product.id != productId).toList(),
    );
  }
}
```

**Providers scopen met families :**
```dart
// Family: geparameteriseerde provider — aparte instantie per parameter
@riverpod
Future<UserDetails> userDetails(UserDetailsRef ref, String userId) async {
  return ref.watch(userRepositoryProvider).fetchById(userId);
}

// In widget:
final details = ref.watch(userDetailsProvider('user-123'));
```

### Navigatie met go_router

```dart
// router.dart
final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateProvider);

  return GoRouter(
    initialLocation: '/home',
    redirect: (context, state) {
      final isLoggedIn = authState.valueOrNull != null;
      final isLoginRoute = state.matchedLocation == '/login';

      if (!isLoggedIn && !isLoginRoute) return '/login';
      if (isLoggedIn && isLoginRoute) return '/home';
      return null;
    },
    routes: [
      GoRoute(path: '/login', builder: (_, __) => const LoginPage()),
      ShellRoute(
        builder: (context, state, child) => AppShell(child: child),
        routes: [
          GoRoute(
            path: '/home',
            builder: (_, __) => const HomePage(),
          ),
          GoRoute(
            path: '/products/:id',
            builder: (_, state) => ProductPage(id: state.pathParameters['id']!),
          ),
        ],
      ),
    ],
  );
});
```

### Platform Channels

```dart
// Native API bridge (Dart side)
class CameraChannel {
  static const _channel = MethodChannel('com.example.app/camera');

  static Future<String?> capturePhoto() async {
    try {
      final path = await _channel.invokeMethod<String>('capturePhoto');
      return path;
    } on PlatformException catch (e) {
      debugPrint('Camera error: ${e.code} — ${e.message}');
      return null;
    }
  }
}

// iOS side (AppDelegate.swift of plugin)
// FlutterMethodChannel(name: "com.example.app/camera", binaryMessenger: controller.binaryMessenger)
// channel.setMethodCallHandler { call, result in
//   if call.method == "capturePhoto" { /* AVFoundation logica */ }
// }

// Android side (MainActivity.kt)
// MethodChannel(flutterEngine.dartExecutor.binaryMessenger, "com.example.app/camera")
// .setMethodCallHandler { call, result ->
//   if (call.method == "capturePhoto") { /* CameraX logica */ }
// }
```

### Isolates voor zware berekeningen

```dart
import 'package:flutter/foundation.dart';

// compute(): eenmalige background taak — eenvoudige API over Isolate
Future<List<ParsedRecord>> parseHeavyCsv(String rawCsv) async {
  return compute(_parseCsvInIsolate, rawCsv);
}

// Moet top-level of static functie zijn
List<ParsedRecord> _parseCsvInIsolate(String csv) {
  return csv.split('\n').skip(1).map((line) {
    final cols = line.split(',');
    return ParsedRecord(id: cols[0], value: double.parse(cols[1]));
  }).toList();
}

// Isolate.run() voor Dart 2.19+ — schonere API
Future<ProcessedData> runHeavyAnalysis(RawData data) async {
  return Isolate.run(() => heavyAnalysis(data));
}
```

### Performance Profiling

```bash
# Profile mode — JIT disabled, dichtst bij release
flutter run --profile

# Frame rendering meten
# DevTools > Performance tab > Record > scroll/interact > Stop
# Groene frames = <16ms (60fps), geel = 16-33ms, rood = >33ms

# Veelvoorkomende schuldigen en fixes:
# 1. Te veel herbuilding — const constructors gebruiken, Consumer in plaats van ConsumerWidget
# 2. Image decoding op UI thread — precacheImage() gebruiken bij navigatie
# 3. Dure build() — RepaintBoundary om complexe sub-trees extraheren
# 4. List performance — ListView.builder gebruiken, nooit ListView met alle children

flutter analyze          # statische analyse
flutter test --coverage  # test + coverage
```

**const constructors — overal gebruiken waar mogelijk :**
```dart
// Slecht: nieuwe instantie gealloceerd bij elke rebuild
child: Padding(padding: EdgeInsets.all(16), child: ...)

// Goed: compile-time constant, nul allocation
child: const Padding(padding: EdgeInsets.all(16), child: ...)

// const op widget definitie
class MyIcon extends StatelessWidget {
  const MyIcon({super.key}); // moet const constructor declareren
}
```

### Golden Tests

```dart
// test/golden/user_card_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:golden_toolkit/golden_toolkit.dart';

void main() {
  group('UserCard golden tests', () {
    testGoldens('renders correctly on multiple devices', (tester) async {
      await loadAppFonts();
      final builder = DeviceBuilder()
        ..overrideDevicesForAllScenarios(devices: [
          Device.phone,
          Device.iphone11,
          Device.tabletPortrait,
        ])
        ..addScenario(
          widget: const UserCard(
            name: 'Alex Chen',
            role: 'Engineer',
            avatarUrl: 'https://example.com/avatar.jpg',
          ),
          name: 'default',
        );

      await tester.pumpDeviceBuilder(builder);
      await screenMatchesGolden(tester, 'user_card');
    });
  });
}

# Goldens updaten:
# flutter test --update-goldens
```

### Build Flavors en fastlane

```dart
// lib/config/app_config.dart
enum Flavor { dev, staging, prod }

class AppConfig {
  static late final Flavor flavor;
  static late final String apiBaseUrl;

  static void init(Flavor f) {
    flavor = f;
    apiBaseUrl = switch (f) {
      Flavor.dev => 'https://api-dev.example.com',
      Flavor.staging => 'https://api-staging.example.com',
      Flavor.prod => 'https://api.example.com',
    };
  }
}

// lib/main_dev.dart
void main() {
  AppConfig.init(Flavor.dev);
  runApp(const ProviderScope(child: MyApp()));
}
```

```ruby
# fastlane/Fastfile
lane :beta do
  build_flutter(flavor: "staging", target: "lib/main_staging.dart")
  upload_to_testflight
end

lane :release do
  build_flutter(flavor: "prod", target: "lib/main_prod.dart")
  upload_to_app_store(submit_for_review: true)
end

def build_flutter(flavor:, target:)
  sh("flutter build ipa --flavor #{flavor} --target #{target}")
end
```

## Gebruiksvoorbeeld

**Invoer :** Bouw een Flutter app met Riverpod state management, go_router navigatie, en platform channel voor apparaatcamera-toegang.

**Wat deze agent produceert :**

Projectstructuur:
- `lib/router.dart` — GoRouter met auth redirect guard met `authStateProvider`
- `lib/features/camera/camera_channel.dart` — `MethodChannel` wrapper met `PlatformException` handling
- `lib/features/camera/camera_notifier.dart` — `AsyncNotifierProvider` beheerd capture lifecycle
- `lib/features/camera/camera_page.dart` — `ConsumerWidget` activeert capture en toont resultaat

Riverpod wiring: `cameraNotifierProvider` roept `CameraChannel.capturePhoto()` aan binnen `AsyncValue.guard()`, exposing loading/error/data states aan UI. Router gebruikt `ref.watch(authStateProvider)` voor redirect logica — geen globale mutable state.

Platform channel: Dart roept `capturePhoto` methode aan, iOS gebruikt `AVCaptureSession`, Android gebruikt `CameraX`. Beide zijden geven opgeslagen bestandspad terug of gooien `PlatformException` op permission denial, wat notifier mapt naar `AsyncError` state.

---
