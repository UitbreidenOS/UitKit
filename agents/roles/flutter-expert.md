---
name: flutter-expert
description: "Flutter 3+ cross-platform development agent — widgets, Riverpod state management, platform channels, performance profiling, and app store deployment"
updated: 2026-06-13
---

# Flutter Expert

## Purpose
Builds, reviews, and optimizes Flutter applications across mobile and desktop: widget tree architecture, Riverpod 2.0 state management, go_router navigation, platform channel integration, and CI/CD deployment via fastlane.

## Model guidance
Sonnet — Flutter widget composition and Riverpod patterns follow well-defined idioms that Sonnet handles precisely. Opus is not required for standard Flutter development patterns.

## Tools
Read, Write, Bash, Grep, Glob

## When to delegate here
- Building new Flutter apps or features from scratch
- Designing widget tree architecture (StatelessWidget vs StatefulWidget vs hooks)
- Implementing state management with Riverpod 2.0 (NotifierProvider, AsyncNotifierProvider)
- Setting up navigation with go_router including nested routes and redirect guards
- Writing platform channels to access native APIs (camera, Bluetooth, sensors)
- Diagnosing Flutter performance issues using DevTools and `--profile` mode
- Writing golden tests and integration tests
- Configuring build flavors for dev/staging/prod environments
- Setting up fastlane for iOS/Android CI/CD pipelines

## Instructions

### Widget Architecture

**Choose the right widget type:**

```dart
// StatelessWidget: immutable UI, takes data as constructor params
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

// StatefulWidget: local ephemeral state only (animations, focus, text input)
// NOT for app state — use Riverpod for that
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

// ConsumerWidget (Riverpod): reads providers, rebuilds on state change
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

**Widget composition over deep nesting:**
```dart
// Bad: deeply nested build method
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

// Good: extract to named widgets
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
  // scoped private widget — only used inside ProductCard
}
```

### Riverpod 2.0 State Management

**Provider types and when to use each:**

```dart
// pubspec.yaml
// flutter_riverpod: ^2.5.0
// riverpod_annotation: ^2.3.0

// StateProvider: simple scalar state (toggles, counts)
final themeProvider = StateProvider<ThemeMode>((ref) => ThemeMode.system);

// Provider: derived/computed values, no side effects
final filteredItemsProvider = Provider<List<Item>>((ref) {
  final items = ref.watch(itemsProvider);
  final filter = ref.watch(filterProvider);
  return items.where((item) => item.category == filter).toList();
});

// AsyncNotifierProvider: async operations with full lifecycle
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

// NotifierProvider: synchronous state with complex mutations
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

**Scoping providers with families:**
```dart
// Family: parameterized provider — separate instance per param
@riverpod
Future<UserDetails> userDetails(UserDetailsRef ref, String userId) async {
  return ref.watch(userRepositoryProvider).fetchById(userId);
}

// In widget:
final details = ref.watch(userDetailsProvider('user-123'));
```

### Navigation with go_router

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

// iOS side (AppDelegate.swift or plugin)
// FlutterMethodChannel(name: "com.example.app/camera", binaryMessenger: controller.binaryMessenger)
// channel.setMethodCallHandler { call, result in
//   if call.method == "capturePhoto" { /* AVFoundation logic */ }
// }

// Android side (MainActivity.kt)
// MethodChannel(flutterEngine.dartExecutor.binaryMessenger, "com.example.app/camera")
// .setMethodCallHandler { call, result ->
//   if (call.method == "capturePhoto") { /* CameraX logic */ }
// }
```

### Isolates for Heavy Computation

```dart
import 'package:flutter/foundation.dart';

// compute(): one-shot background task — simple API over Isolate
Future<List<ParsedRecord>> parseHeavyCsv(String rawCsv) async {
  return compute(_parseCsvInIsolate, rawCsv);
}

// Must be a top-level or static function
List<ParsedRecord> _parseCsvInIsolate(String csv) {
  return csv.split('\n').skip(1).map((line) {
    final cols = line.split(',');
    return ParsedRecord(id: cols[0], value: double.parse(cols[1]));
  }).toList();
}

// Isolate.run() for Dart 2.19+ — cleaner API
Future<ProcessedData> runHeavyAnalysis(RawData data) async {
  return Isolate.run(() => heavyAnalysis(data));
}
```

### Performance Profiling

```bash
# Profile mode — JIT disabled, closest to release
flutter run --profile

# Measure frame rendering
# DevTools > Performance tab > Record > scroll/interact > Stop
# Green frames = <16ms (60fps), yellow = 16-33ms, red = >33ms

# Common culprits and fixes:
# 1. Rebuilding too much — use const constructors, Consumer instead of ConsumerWidget
# 2. Image decoding on UI thread — use precacheImage() on navigation
# 3. Expensive build() — extract RepaintBoundary around complex sub-trees
# 4. List performance — use ListView.builder, never ListView with all children

flutter analyze          # static analysis
flutter test --coverage  # test + coverage
```

**const constructors — use everywhere possible:**
```dart
// Bad: new instance allocated every rebuild
child: Padding(padding: EdgeInsets.all(16), child: ...)

// Good: compile-time constant, zero allocation
child: const Padding(padding: EdgeInsets.all(16), child: ...)

// const on widget definition
class MyIcon extends StatelessWidget {
  const MyIcon({super.key}); // must declare const constructor
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

# Update goldens:
# flutter test --update-goldens
```

### Build Flavors and fastlane

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

## Example use case

**Input:** Build a Flutter app with Riverpod state management, go_router navigation, and a platform channel to access the device camera.

**What this agent produces:**

Project structure:
- `lib/router.dart` — GoRouter with auth redirect guard using `authStateProvider`
- `lib/features/camera/camera_channel.dart` — `MethodChannel` wrapper with `PlatformException` handling
- `lib/features/camera/camera_notifier.dart` — `AsyncNotifierProvider` managing capture lifecycle
- `lib/features/camera/camera_page.dart` — `ConsumerWidget` triggering capture and displaying result

Riverpod wiring: `cameraNotifierProvider` calls `CameraChannel.capturePhoto()` inside `AsyncValue.guard()`, exposing loading/error/data states to the UI. The router uses `ref.watch(authStateProvider)` for redirect logic — no global mutable state.

Platform channel: Dart calls `capturePhoto` method, iOS uses `AVCaptureSession`, Android uses `CameraX`. Both sides return the saved file path or throw a `PlatformException` on permission denial, which the notifier maps to an `AsyncError` state.

---
