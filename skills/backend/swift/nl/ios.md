# Swift + SwiftUI iOS Development

## Wanneer activeren
- Bouwen van iOS, iPadOS, of macOS apps met SwiftUI
- Implementeren van async/await networking met URLSession
- Instellen van Core Data voor local persistence
- Wiring Combine publishers en subscribers
- Preparing voor App Store submission en review
- Debugging property wrapper selection (`@State`, `@Binding`, `@ObservedObject`, etc.)

## Wanneer NIET gebruiken
- UIKit-only projecten waarbij SwiftUI expliciet excluded
- tvOS of watchOS targets met significant ander lifecycle
- Server-side Swift (Vapor, Hummingbird) zonder UI layer

## Instructies

### Property Wrappers — When Each

| Wrapper | Owner | Use case |
|---|---|---|
| `@State` | The view itself | Local, value-type UI state (toggle, text field input, counter) |
| `@Binding` | Parent passes it down | Two-way connection naar parent `@State` |
| `@StateObject` | The view itself | View creates en owns reference-type `ObservableObject` |
| `@ObservedObject` | Parent passes it in | View observes reference-type object owned elsewhere |
| `@EnvironmentObject` | Injected via `.environmentObject()` | Shared observable object propagated through view hierarchy |
| `@Environment` | SwiftUI environment | System values: `colorScheme`, `dismiss`, `openURL` |

```swift
// @State — local value owned by this view
struct ToggleRow: View {
    @State private var isOn = false

    var body: some View {
        Toggle("Notifications", isOn: $isOn)   // $ produces a Binding
    }
}

// @StateObject — view owns and creates the object
struct ProfileView: View {
    @StateObject private var viewModel = ProfileViewModel()

    var body: some View {
        Text(viewModel.name)
    }
}

// @EnvironmentObject — injected at a high level, accessed anywhere below
struct UserBadge: View {
    @EnvironmentObject var session: UserSession

    var body: some View {
        Text(session.displayName)
    }
}

// Inject at root
ContentView().environmentObject(UserSession())
```

Rule: gebruik `@StateObject` wanneer view object creëert. Gebruik `@ObservedObject` wanneer object geïnjecteerd. Nooit creëer `ObservableObject` direct in `body` property — het wordt opnieuw gecreëerd op elke render.

### Async/Await with URLSession

```swift
// Network layer
struct APIClient {
    let baseURL = URL(string: "https://api.example.com")!
    let decoder = JSONDecoder()

    func fetchUser(id: Int) async throws -> User {
        let url = baseURL.appendingPathComponent("users/\(id)")
        var request = URLRequest(url: url)
        request.setValue("Bearer \(TokenStore.current)", forHTTPHeaderField: "Authorization")

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let http = response as? HTTPURLResponse else {
            throw URLError(.badServerResponse)
        }
        guard (200..<300).contains(http.statusCode) else {
            throw APIError.httpError(http.statusCode)
        }

        return try decoder.decode(User.self, from: data)
    }
}

// In a ViewModel
@MainActor
class UserViewModel: ObservableObject {
    @Published var user: User?
    @Published var error: Error?
    @Published var isLoading = false

    let client = APIClient()

    func load(id: Int) async {
        isLoading = true
        defer { isLoading = false }

        do {
            user = try await client.fetchUser(id: id)
        } catch {
            self.error = error
        }
    }
}

// In a SwiftUI view
struct UserView: View {
    @StateObject private var vm = UserViewModel()
    let userId: Int

    var body: some View {
        Group {
            if vm.isLoading {
                ProgressView()
            } else if let user = vm.user {
                Text(user.name)
            } else if let error = vm.error {
                Text("Error: \(error.localizedDescription)")
            }
        }
        .task { await vm.load(id: userId) }   // cancels automatically when view disappears
    }
}
```

Altijd mark ViewModels `@MainActor` om `@Published` mutations op main thread te garanderen.

### Core Data — NSPersistentContainer Setup

```swift
// Persistence.swift
import CoreData

struct PersistenceController {
    static let shared = PersistenceController()

    let container: NSPersistentContainer

    init(inMemory: Bool = false) {
        container = NSPersistentContainer(name: "MyApp")

        if inMemory {
            container.persistentStoreDescriptions.first?.url = URL(fileURLWithPath: "/dev/null")
        }

        container.loadPersistentStores { _, error in
            if let error { fatalError("Core Data failed: \(error)") }
        }
        container.viewContext.automaticallyMergesChangesFromParent = true
    }
}

// Inject at app entry point
@main
struct MyApp: App {
    let persistence = PersistenceController.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistence.container.viewContext)
        }
    }
}

// In a view
struct ItemList: View {
    @Environment(\.managedObjectContext) private var ctx

    @FetchRequest(
        sortDescriptors: [SortDescriptor(\.timestamp, order: .reverse)],
        animation: .default
    )
    private var items: FetchedResults<Item>

    func addItem() {
        let item = Item(context: ctx)
        item.timestamp = Date()
        try? ctx.save()
    }
}
```

### App Store Submission Checklist

Voordat je naar App Store Connect submitteert:

**Technical requirements:**
- Build met latest stable Xcode en latest iOS SDK
- Minimum deployment target correct ingesteld
- Geen use van private APIs
- NSAppTransportSecurity exceptions gedocumenteerd
- Alle vereiste permission strings in `Info.plist`
- Icons voor alle vereiste sizes present in asset catalog
- Launch screen of `LaunchScreen.storyboard` configured

**Privacy:**
- Privacy manifest (`PrivacyInfo.xcprivacy`) vereist voor apps specifieke APIs gebruiken
- Third-party SDKs moeten privacy manifests ook hebben
- Declareer data collection in App Store Connect

---
