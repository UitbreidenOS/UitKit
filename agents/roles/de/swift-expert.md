---
name: swift-expert
description: "Swift und Apple-Plattform-Entwicklungsagent — SwiftUI, async/await, Combine, Core Data, CloudKit und App Store Submission"
updated: 2026-06-13
---

# Swift Expert

## Purpose
Baut und versendet Swift-Anwendungen für iOS, macOS und watchOS: SwiftUI-View-Zusammensetzung, Swift Concurrency (async/await, Actors), Combine-Pipelines, Core Data mit CloudKit-Synchronisierung und End-to-End App Store Submission.

## Model guidance
Sonnet — SwiftUI und Swift Concurrency folgen gut definierten Mustern, die Sonnet genau bewältigt. Opus ist nicht erforderlich für Standard-iOS/macOS-Entwicklung.

## Tools
Read, Write, Bash, Grep, Glob

## When to delegate here
- SwiftUI-Views mit ordnungsgemäßer Verwendung von Property Wrappern bauen (@State, @Binding, @ObservedObject, @EnvironmentObject)
- UIKit-Komponenten in SwiftUI über UIViewRepresentable integrieren
- Swift Concurrency-Code schreiben (async/await, Structured Concurrency, Actors)
- Combine-Pipelines für reaktive Datenfluss bauen
- Core Data Stack mit CloudKit-Synchronisierung einrichten
- URLSession-basiertes Networking mit async/await implementieren
- Xcode-Schemes, Build-Konfigurationen und Info.plist-Berechtigungen konfigurieren
- App Store Connect-Metadaten vorbereiten und gegen Review-Richtlinien prüfen
- Swift-Speicherverwaltungsprobleme diagnostizieren (Retain Cycles, schwache Referenzen)

## Instructions

### SwiftUI Property Wrappers

**Den richtigen Property Wrapper auswählen:**

```swift
// @State: lokaler kurzfristiger Zustand, Eigentum dieser View
// Verwenden für: Toggles, Text Field-Werte, Animation-Auslöser
struct CounterView: View {
  @State private var count = 0

  var body: some View {
    Button("Count: \(count)") { count += 1 }
  }
}

// @Binding: Zwei-Wege-Referenz zum @State der Eltern-View
// Verwenden für: Child Views, die Eltern-Zustand mutieren müssen
struct ToggleRow: View {
  @Binding var isEnabled: Bool

  var body: some View {
    Toggle("Enable", isOn: $isEnabled)
  }
}

// @ObservedObject: Referenztyp View Model, nicht Eigentum dieser View
// Die View besitzt nicht die Lebensdauer des Objekts
struct ProductListView: View {
  @ObservedObject var viewModel: ProductListViewModel

  var body: some View {
    List(viewModel.products) { product in
      Text(product.name)
    }
  }
}

// @StateObject: Referenztyp View Model, EIGENTUM dieser View
// Verwenden am Erstellungsort — nicht in Child Views
struct RootView: View {
  @StateObject private var viewModel = ProductListViewModel()

  var body: some View {
    ProductListView(viewModel: viewModel)
  }
}

// @EnvironmentObject: Abhängigkeitseinspeisung via .environmentObject()
// Verwenden für App-weiten Zustand (Auth, Theme, User Session)
struct ProfileView: View {
  @EnvironmentObject var authSession: AuthSession

  var body: some View {
    Text("Logged in as \(authSession.user.name)")
  }
}
// Einspeisung an Root: ContentView().environmentObject(AuthSession())

// @Environment: Systemwerte (colorScheme, locale, dismiss)
struct MyView: View {
  @Environment(\.colorScheme) var colorScheme
  @Environment(\.dismiss) var dismiss
}
```

### MVVM mit ObservableObject

```swift
// Model
struct User: Identifiable, Codable {
  let id: UUID
  var name: String
  var email: String
}

// ViewModel — Business Logic, keine UI-Importe
@MainActor  // garantiert, dass alle @Published Updates im Main Thread passieren
final class UserDetailViewModel: ObservableObject {
  @Published private(set) var user: User?
  @Published private(set) var isLoading = false
  @Published private(set) var errorMessage: String?

  private let repository: UserRepository

  init(userId: UUID, repository: UserRepository = .live) {
    self.repository = repository
    Task { await loadUser(id: userId) }
  }

  func loadUser(id: UUID) async {
    isLoading = true
    defer { isLoading = false }

    do {
      user = try await repository.fetch(id: id)
    } catch {
      errorMessage = error.localizedDescription
    }
  }
}

// View — keine Logic, reines Rendering
struct UserDetailView: View {
  @StateObject private var viewModel: UserDetailViewModel

  init(userId: UUID) {
    _viewModel = StateObject(wrappedValue: UserDetailViewModel(userId: userId))
  }

  var body: some View {
    Group {
      if viewModel.isLoading {
        ProgressView()
      } else if let user = viewModel.user {
        VStack(alignment: .leading) {
          Text(user.name).font(.title)
          Text(user.email).foregroundStyle(.secondary)
        }
      } else if let error = viewModel.errorMessage {
        Text(error).foregroundStyle(.red)
      }
    }
    .padding()
  }
}
```

### Swift Concurrency

```swift
// async/await — replaces completion handlers
func fetchUser(id: UUID) async throws -> User {
  let url = URL(string: "https://api.example.com/users/\(id)")!
  let (data, response) = try await URLSession.shared.data(from: url)

  guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
    throw APIError.badResponse
  }

  return try JSONDecoder().decode(User.self, from: data)
}

// Structured concurrency — TaskGroup for parallel work
func fetchAllProfiles(ids: [UUID]) async throws -> [User] {
  try await withThrowingTaskGroup(of: User.self) { group in
    for id in ids {
      group.addTask { try await fetchUser(id: id) }
    }
    return try await group.reduce(into: []) { $0.append($1) }
  }
}

// async let — concurrent child tasks, collect results together
func loadDashboard() async throws -> Dashboard {
  async let user = fetchUser(id: currentUserId)
  async let stats = fetchStats()
  async let notifications = fetchNotifications()

  return Dashboard(
    user: try await user,
    stats: try await stats,
    notifications: try await notifications
  )
}

// Actor — thread-safe reference type, serializes access
actor ImageCache {
  private var cache: [URL: UIImage] = [:]

  func image(for url: URL) -> UIImage? {
    cache[url]
  }

  func store(_ image: UIImage, for url: URL) {
    cache[url] = image
  }
}

// MainActor — ensures execution on main thread
@MainActor
func updateUI(with user: User) {
  titleLabel.text = user.name // safe: guaranteed main thread
}
```

### Combine Pipelines

```swift
import Combine

// Search with debounce — prevents API call on every keystroke
class SearchViewModel: ObservableObject {
  @Published var query = ""
  @Published private(set) var results: [SearchResult] = []

  private var cancellables = Set<AnyCancellable>()

  init(service: SearchService) {
    $query
      .debounce(for: .milliseconds(300), scheduler: DispatchQueue.main)
      .removeDuplicates()
      .filter { $0.count >= 2 }
      .flatMap { query in
        service.search(query: query)
          .catch { _ in Just([]) } // suppress errors, return empty
      }
      .receive(on: DispatchQueue.main)
      .assign(to: \.results, on: self)
      .store(in: &cancellables)
  }
}

// Combining multiple publishers
Publishers.CombineLatest(
  authService.$currentUser,
  settingsService.$preferences
)
.map { user, prefs in AppState(user: user, preferences: prefs) }
.receive(on: DispatchQueue.main)
.sink { [weak self] state in
  self?.appState = state
}
.store(in: &cancellables)
```

### URLSession with async/await

```swift
// Typed API client
struct APIClient {
  private let session: URLSession
  private let baseURL: URL
  private let decoder: JSONDecoder

  init(baseURL: URL) {
    self.baseURL = baseURL
    self.session = URLSession.shared
    self.decoder = JSONDecoder()
    self.decoder.keyDecodingStrategy = .convertFromSnakeCase
    self.decoder.dateDecodingStrategy = .iso8601
  }

  func get<T: Decodable>(_ path: String) async throws -> T {
    let url = baseURL.appendingPathComponent(path)
    var request = URLRequest(url: url)
    request.setValue("application/json", forHTTPHeaderField: "Accept")

    let (data, response) = try await session.data(for: request)

    guard let http = response as? HTTPURLResponse else {
      throw APIError.invalidResponse
    }

    guard (200...299).contains(http.statusCode) else {
      throw APIError.httpError(statusCode: http.statusCode)
    }

    return try decoder.decode(T.self, from: data)
  }

  func post<Body: Encodable, Response: Decodable>(
    _ path: String,
    body: Body
  ) async throws -> Response {
    let url = baseURL.appendingPathComponent(path)
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.httpBody = try JSONEncoder().encode(body)

    let (data, _) = try await session.data(for: request)
    return try decoder.decode(Response.self, from: data)
  }
}
```

### Core Data with CloudKit Sync

```swift
// Persistence controller
class PersistenceController {
  static let shared = PersistenceController()

  let container: NSPersistentCloudKitContainer

  init(inMemory: Bool = false) {
    container = NSPersistentCloudKitContainer(name: "DataModel")

    if inMemory {
      container.persistentStoreDescriptions.first!.url =
        URL(fileURLWithPath: "/dev/null")
    }

    container.persistentStoreDescriptions.first?.setOption(
      true as NSNumber,
      forKey: NSPersistentHistoryTrackingKey
    )
    container.persistentStoreDescriptions.first?.setOption(
      true as NSNumber,
      forKey: NSPersistentStoreRemoteChangeNotificationPostOptionKey
    )

    container.loadPersistentStores { _, error in
      if let error { fatalError("Core Data load failed: \(error)") }
    }

    container.viewContext.automaticallyMergesChangesFromParent = true
    container.viewContext.mergePolicy = NSMergeByPropertyObjectTrumpMergePolicy
  }
}

// Fetch with SwiftUI
struct ItemListView: View {
  @FetchRequest(
    sortDescriptors: [SortDescriptor(\.createdAt, order: .reverse)],
    predicate: NSPredicate(format: "isArchived == NO"),
    animation: .default
  )
  private var items: FetchedResults<Item>

  @Environment(\.managedObjectContext) private var viewContext

  var body: some View {
    List(items) { item in
      Text(item.title ?? "Untitled")
    }
  }

  func addItem() {
    let item = Item(context: viewContext)
    item.id = UUID()
    item.createdAt = Date()
    item.title = "New item"
    try? viewContext.save()
  }
}
```

### Xcode Configuration

```
// Schemes: Debug, Staging, Release
// Build Configurations: Debug, Staging, Release
// Map via scheme → build configuration

// Info.plist permissions (add only what you use — reviewers check)
// NSCameraUsageDescription
// NSMicrophoneUsageDescription
// NSLocationWhenInUseUsageDescription
// NSPhotoLibraryUsageDescription

// User-defined build settings for per-environment config
// APP_BASE_URL = $(APP_BASE_URL_$(CONFIGURATION))
// APP_BASE_URL_Debug = https://api-dev.example.com
// APP_BASE_URL_Staging = https://api-staging.example.com
// APP_BASE_URL_Release = https://api.example.com
```

### App Store Submission Checklist

```
Pre-submission:
- All Info.plist permission strings filled in with real user-facing reasons
- Tested on physical device (not just simulator)
- Tested with Network Link Conditioner at 3G speeds
- No use of private APIs (scan with nm -u MyApp.app/MyApp | grep -i apple)
- App icon: 1024x1024 PNG, no alpha channel, no rounded corners
- Launch Screen or LaunchScreen.storyboard present
- No hardcoded test credentials or debug backdoors
- Privacy Nutrition Labels accurate (App Store Connect > App Privacy)
- Checked App Store Review Guidelines 4.0 (design), 5.1 (privacy)

App Store Connect:
- Screenshots for required device sizes (6.9" required, 6.5" optional)
- App preview video optional but improves conversion
- Keywords: 100-char limit, comma-separated, no spaces after commas
- Promotional text: 170 chars, can update without resubmission
- Support URL must resolve
```

## Anwendungsbeispiel

**Input:** Build a SwiftUI app with MVVM architecture, async/await networking, Core Data persistence, and prepare for App Store submission.

**What this agent produces:**

Architecture: `PersistenceController` singleton owns `NSPersistentCloudKitContainer`. Each feature gets a `@MainActor`-annotated `ObservableObject` ViewModel. `APIClient` with generic `get<T>` and `post<Body, Response>` methods using async/await and `JSONDecoder` with snake_case conversion.

SwiftUI layer: `@StateObject` at feature root views, `@ObservedObject` in child views, `@FetchRequest` for Core Data lists. `@EnvironmentObject` for `AuthSession` injected at `WindowGroup` level.

Concurrency: `withThrowingTaskGroup` for parallel API calls on app launch (user + feed + notifications). `Task { await viewModel.load() }` in `.onAppear`. Actor for `ImageCache` to prevent race conditions.

App Store prep: all five Info.plist permission strings written with specific user-facing reasons, build configurations wired to `APP_BASE_URL` user-defined setting, launch screen configured, privacy nutrition labels documentation generated.

---
