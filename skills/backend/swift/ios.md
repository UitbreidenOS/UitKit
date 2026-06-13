---
name: ios
updated: 2026-06-13
---

# Swift + SwiftUI iOS Development

## When to activate
- Building iOS, iPadOS, or macOS apps with SwiftUI
- Implementing async/await networking with URLSession
- Setting up Core Data for local persistence
- Wiring Combine publishers and subscribers
- Preparing for App Store submission and review
- Debugging property wrapper selection (`@State`, `@Binding`, `@ObservedObject`, etc.)

## When NOT to use
- UIKit-only projects where SwiftUI is explicitly excluded
- tvOS or watchOS targets with significantly different lifecycle
- Server-side Swift (Vapor, Hummingbird) without any UI layer

## Instructions

### Property Wrappers — When Each

| Wrapper | Owner | Use case |
|---|---|---|
| `@State` | The view itself | Local, value-type UI state (toggle, text field input, counter) |
| `@Binding` | Parent passes it down | Two-way connection to a parent's `@State` |
| `@StateObject` | The view itself | View creates and owns a reference-type `ObservableObject` |
| `@ObservedObject` | Parent passes it in | View observes a reference-type object owned elsewhere |
| `@EnvironmentObject` | Injected via `.environmentObject()` | Shared observable object propagated through the view hierarchy |
| `@Environment` | SwiftUI environment | System values: `colorScheme`, `dismiss`, `openURL`, custom environment keys |

```swift
// @State — local value owned by this view
struct ToggleRow: View {
    @State private var isOn = false

    var body: some View {
        Toggle("Notifications", isOn: $isOn)   // $ produces a Binding
    }
}

// @Binding — parent controls truth
struct ToggleRow: View {
    @Binding var isOn: Bool   // parent passes $parentState.isOn

    var body: some View {
        Toggle("Notifications", isOn: $isOn)
    }
}

// @StateObject — view owns and creates the object
struct ProfileView: View {
    @StateObject private var viewModel = ProfileViewModel()

    var body: some View {
        Text(viewModel.name)
    }
}

// @ObservedObject — object is passed in, owned elsewhere
struct ProfileView: View {
    @ObservedObject var viewModel: ProfileViewModel

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

Rule: use `@StateObject` when the view creates the object. Use `@ObservedObject` when the object is injected. Never create an `ObservableObject` directly in the `body` property — it will be recreated on every render.

### Async/Await with URLSession

```swift
// Models
struct User: Decodable {
    let id: Int
    let name: String
    let email: String
}

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

Always mark ViewModels `@MainActor` to ensure `@Published` mutations happen on the main thread.

### Core Data — NSPersistentContainer Setup

```swift
// Persistence.swift
import CoreData

struct PersistenceController {
    static let shared = PersistenceController()

    static var preview: PersistenceController = {
        let controller = PersistenceController(inMemory: true)
        let ctx = controller.container.viewContext
        // Insert sample data for previews
        let item = Item(context: ctx)
        item.timestamp = Date()
        try? ctx.save()
        return controller
    }()

    let container: NSPersistentContainer

    init(inMemory: Bool = false) {
        container = NSPersistentContainer(name: "MyApp")   // matches .xcdatamodeld filename

        if inMemory {
            container.persistentStoreDescriptions.first?.url = URL(fileURLWithPath: "/dev/null")
        }

        container.loadPersistentStores { _, error in
            if let error { fatalError("Core Data failed: \(error)") }
        }
        container.viewContext.automaticallyMergesChangesFromParent = true
        container.viewContext.mergePolicy = NSMergeByPropertyObjectTrumpMergePolicy
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

For background operations, use `container.newBackgroundContext()` or `container.performBackgroundTask { ctx in }`.

### Combine — sink and assign

```swift
import Combine

class SearchViewModel: ObservableObject {
    @Published var query = ""
    @Published var results: [Product] = []
    @Published var isLoading = false

    private var cancellables = Set<AnyCancellable>()
    private let api = APIClient()

    init() {
        $query
            .debounce(for: .milliseconds(300), scheduler: RunLoop.main)
            .removeDuplicates()
            .filter { $0.count >= 2 }
            .handleEvents(receiveOutput: { [weak self] _ in self?.isLoading = true })
            .flatMap { [weak self] q -> AnyPublisher<[Product], Never> in
                guard let self else { return Empty().eraseToAnyPublisher() }
                return self.api.search(query: q)
                    .catch { _ in Just([]) }
                    .eraseToAnyPublisher()
            }
            .receive(on: DispatchQueue.main)
            .handleEvents(receiveOutput: { [weak self] _ in self?.isLoading = false })
            .assign(to: &$results)           // assign(to:) with & ties lifetime to self, no cancellable needed
    }
}
```

Use `.sink` when you need side effects. Use `.assign(to:)` to drive a `@Published` property. Always store subscriptions in `Set<AnyCancellable>` or use the `&$published` form to avoid premature cancellation.

### App Store Submission Checklist

Before submitting to App Store Connect:

**Technical requirements:**
- Build with the latest stable Xcode and latest iOS SDK
- Minimum deployment target set correctly in project settings
- No use of private APIs (App Store review scans for these)
- NSAppTransportSecurity exceptions documented and justified
- All required permission strings in `Info.plist` (camera, location, microphone, contacts, etc.)
- Icons for all required sizes present in asset catalog (Xcode generates from a 1024x1024 source)
- Launch screen or `LaunchScreen.storyboard` configured

**Privacy:**
- Privacy manifest (`PrivacyInfo.xcprivacy`) required for apps using specific APIs (file timestamp APIs, system boot time, disk space, active keyboard, user defaults)
- Third-party SDKs must also include privacy manifests
- Declare data collection in App Store Connect (Data Types used, linked to user, tracking)

**App Store Connect:**
- Version and build number incremented from last submission
- Screenshots for all required device sizes (6.9", 6.5", 5.5" iPhone; 13" and 12.9" iPad if iPad supported)
- App Preview video optional but improves conversion
- Keywords field: comma-separated, 100 character limit
- Age rating questionnaire completed
- Export Compliance: declare if using encryption (HTTPS qualifies; standard exemption usually applies)

**Testing before submission:**
- TestFlight beta tested on physical device, not only simulator
- Deep links and Universal Links tested
- Push notifications tested end-to-end
- In-app purchase sandbox flow verified
- Accessibility audit (VoiceOver, Dynamic Type)

## Example

A settings screen demonstrating multiple property wrappers together:

```swift
@MainActor
class SettingsViewModel: ObservableObject {
    @Published var notificationsEnabled = false
    @Published var theme: AppTheme = .system

    func save() async {
        try? await UserPreferencesAPI.save(
            notifications: notificationsEnabled,
            theme: theme
        )
    }
}

struct SettingsView: View {
    @StateObject private var vm = SettingsViewModel()
    @EnvironmentObject var session: UserSession
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        Form {
            Section("Account") {
                Text(session.email).foregroundStyle(.secondary)
            }
            Section("Preferences") {
                Toggle("Notifications", isOn: $vm.notificationsEnabled)
                Picker("Theme", selection: $vm.theme) {
                    ForEach(AppTheme.allCases) { Text($0.label).tag($0) }
                }
            }
        }
        .navigationTitle("Settings")
        .toolbar {
            ToolbarItem(placement: .confirmationAction) {
                Button("Done") {
                    Task {
                        await vm.save()
                        dismiss()
                    }
                }
            }
        }
    }
}
```

---
