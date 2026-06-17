---
name: flutter-widgets
description: Build Flutter apps with widget composition, Riverpod state management, and platform channel integration
allowed-tools: [Read, Write, Bash, Grep]
effort: high
---

## When to activate

- Building Flutter applications with Dart
- Composing complex widget trees with reusable components
- Implementing state management with Riverpod, Bloc, or Provider
- Creating platform channels for native iOS/Android integration
- Optimizing Flutter app performance and build size

## When NOT to use

- For React Native apps (use react-native-expo)
- For pure native development
- For backend/Dart server development

## Instructions

1. **Project structure.** Feature-first: `lib/features/auth/`, `lib/features/feed/`, `lib/core/`, `lib/shared/`.
2. **Widget composition.** Build small, focused widgets. Use `const` constructors. Prefer composition over inheritance.
3. **State management.** Riverpod for compile-safe state: `StateNotifier` for complex state, `AsyncNotifier` for async operations.
4. **Platform channels.** MethodChannel for one-off calls, EventChannel for streams. Handle platform-specific UI with `Platform.isIOS`.
5. **Navigation.** GoRouter for declarative routing with deep link support. Define routes as constants.
6. **Performance.** Use `RepaintBoundary` for expensive widgets, `ListView.builder` for long lists, avoid `setState` on parent widgets.
7. **Testing.** Widget tests for UI, integration tests with `patrol` or `integration_test`, unit tests for business logic.

## Example

```dart
// Riverpod state management
final cartProvider = StateNotifierProvider<CartNotifier, CartState>((ref) {
  return CartNotifier(ref.read(apiProvider));
});

class CartNotifier extends StateNotifier<CartState> {
  CartNotifier(this._api) : super(CartState.initial());
  final ApiClient _api;

  Future<void> addItem(Product product) async {
    state = state.copyWith(isLoading: true);
    final updated = await _api.addToCart(product.id);
    state = CartState(items: updated, isLoading: false);
  }
}
```
