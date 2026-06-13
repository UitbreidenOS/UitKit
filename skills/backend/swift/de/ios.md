# Swift + SwiftUI iOS Development

## Wann aktivieren
- Aufbau von iOS, iPadOS oder macOS Apps mit SwiftUI
- Implementierung von Async/Await Networking mit URLSession
- Setup von Core Data für lokale Persistenz
- Verdrahten von Combine Publishers und Subscribers
- Vorbereitung für App Store Submission und Review
- Debugging von Property Wrapper Selection (`@State`, `@Binding`, `@ObservedObject`, etc.)

## Wann NICHT verwenden
- UIKit-Only Projekte, wo SwiftUI explizit ausgeschlossen ist
- tvOS oder watchOS Targets mit erheblich unterschiedlichem Lifecycle
- Server-Side Swift (Vapor, Hummingbird) ohne UI Layer

## Anweisungen

### Property Wrappers — Wenn Jede

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

Rule: Verwenden Sie `@StateObject`, wenn die View das Objekt erstellt. Verwenden Sie `@ObservedObject`, wenn das Objekt injiziert wird. Erstellen Sie ein `ObservableObject` niemals direkt in der `body` Eigenschaft — es wird bei jedem Render neu erstellt.

### Async/Await mit URLSession

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

Markieren Sie ViewModels immer `@MainActor`, um sicherzustellen, dass `@Published` Mutationen auf dem Main Thread passieren.

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

Für Background Operationen verwenden Sie `container.newBackgroundContext()` oder `container.performBackgroundTask { ctx in }`.

### Combine — sink und assign

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

Verwenden Sie `.sink`, wenn Sie Side Effects benötigen. Verwenden Sie `.assign(to:)`, um eine `@Published` Eigenschaft zu fahren. Speichern Sie immer Subscriptions in `Set<AnyCancellable>` oder verwenden Sie die `&$published` Form, um vorzeitige Cancellation zu vermeiden.

### App Store Submission Checklist

Vor dem Einreichen an App Store Connect:

**Technical Requirements:**
- Build mit dem letzten stabilen Xcode und letztem iOS SDK
- Minimum Deployment Target richtig in Projekt-Einstellungen gesetzt
- Keine Verwendung von Private APIs (App Store Review scannt dafür)
- NSAppTransportSecurity Ausnahmen dokumentiert und begründet
- Alle erforderlichen Permission Strings in `Info.plist` (Camera, Location, Microphone, Contacts, etc.)
- Icons für alle erforderlichen Größen im Asset Catalog vorhanden (Xcode generiert aus einer 1024x1024 Quelle)
- Launch Screen oder `LaunchScreen.storyboard` konfiguriert

**Privacy:**
- Privacy Manifest (`PrivacyInfo.xcprivacy`) erforderlich für Apps, die spezifische APIs verwenden (File Timestamp APIs, System Boot Time, Disk Space, Active Keyboard, User Defaults)
- Drittanbieter SDKs müssen auch Privacy Manifests einschließen
- Daten Collection in App Store Connect deklarieren (Data Types verwendet, mit User verlinkt, Tracking)

**App Store Connect:**
- Version und Build Number inkrementiert von letztem Submission
- Screenshots für alle erforderlichen Device Größen (6.9", 6.5", 5.5" iPhone; 13" und 12.9" iPad wenn iPad unterstützt)
- App Preview Video optional aber verbessert Conversion
- Keywords Feld: Komma-getrennt, 100 Zeichen Limit
- Age Rating Fragebogen abgeschlossen
- Export Compliance: Deklarieren, wenn Encryption verwendet wird (HTTPS qualifiziert; Standard Exemption normalerweise anwendbar)

**Testing vor Submission:**
- TestFlight Beta auf physischem Device getestet, nicht nur Simulator
- Deep Links und Universal Links getestet
- Push Notifications End-to-End getestet
- In-App Purchase Sandbox Flow verifiziert
- Accessibility Audit (VoiceOver, Dynamic Type)

## Beispiel

Ein Settings Screen mit mehreren Property Wrappers zusammen:

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
