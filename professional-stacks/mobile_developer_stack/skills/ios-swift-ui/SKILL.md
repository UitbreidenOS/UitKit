---
name: ios-swift-ui
description: Build iOS apps with SwiftUI — declarative views, async/await, SwiftData, and Apple platform integration
allowed-tools: [Read, Write, Bash, Grep]
effort: high
---

## When to activate

- Building iOS apps with SwiftUI
- Implementing async data loading with Swift Concurrency
- Persisting data with SwiftData or Core Data
- Integrating Apple frameworks (HealthKit, MapKit, WidgetKit)
- Preparing apps for App Store submission

## When NOT to use

- For cross-platform apps (use react-native-expo or flutter-widgets)
- For Android-only development
- For macOS-only apps (different framework)

## Instructions

1. **Project structure.** MVVM: Views (SwiftUI) → ViewModels (@Observable) → Services (async/await) → Models (SwiftData).
2. **SwiftUI views.** Keep views small and composable. Use `@State` for local, `@Bindable` for shared, `@Environment` for injected.
3. **Async data.** `async let` for parallel, `Task` for background work, `.task` modifier for view lifecycle. Handle loading/error states explicitly.
4. **SwiftData.** `@Model` for entities, `@Query` for fetching, `ModelContainer` for setup. Migrate from Core Data only if benefits outweigh effort.
5. **Navigation.** `NavigationStack` with type-safe `NavigationPath`. Define routes as enums. Support deep linking via `onOpenURL`.
6. **Accessibility.** `.accessibilityLabel`, `.accessibilityHint`, Dynamic Type support with `@ScaledMetric`, VoiceOver testing.
7. **Testing.** XCTest for unit, XCUITest for UI, Snapshot tests for visual regression.

## Example

```swift
@Observable
class ProductListViewModel {
    var products: [Product] = []
    var isLoading = false
    var error: Error?

    func loadProducts() async {
        isLoading = true
        defer { isLoading = false }
        do {
            products = try await api.fetchProducts()
        } catch {
            self.error = error
        }
    }
}

struct ProductListView: View {
    @State private var viewModel = ProductListViewModel()

    var body: some View {
        NavigationStack {
            List(viewModel.products) { product in
                NavigationLink(value: product) {
                    ProductRow(product: product)
                }
            }
            .task { await viewModel.loadProducts() }
        }
    }
}
```
