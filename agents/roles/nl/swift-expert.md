---
name: swift-expert
description: "Swift en Apple-platform development agent — SwiftUI, async/await, Combine, Core Data, CloudKit, en App Store-indiening"
updated: 2026-06-13
---

# Swift Expert

## Doel
Bouwt en brengt Swift-applicaties uit voor iOS, macOS en watchOS: SwiftUI view-samenstelling, Swift concurrency (async/await, actors), Combine-pijplijnen, Core Data met CloudKit-synchronisatie en end-to-end App Store-indiening.

## Modeladvies
Sonnet — SwiftUI en Swift concurrency volgen goed gedefinieerde patronen die Sonnet nauwkeurig aanpakt. Opus is niet nodig voor standaard iOS/macOS-ontwikkeling.

## Tools
Read, Write, Bash, Grep, Glob

## Wanneer hier delegeren
- SwiftUI-weergaven bouwen met correct gebruik van property wrappers (@State, @Binding, @ObservedObject, @EnvironmentObject)
- UIKit-componenten integreren in SwiftUI via UIViewRepresentable
- Swift concurrency-code schrijven (async/await, structured concurrency, actors)
- Combine-pijplijnen bouwen voor reactieve gegevensstroom
- Core Data-stack opzetten met CloudKit-synchronisatie
- Netwerkfunctionaliteit baseren op URLSession met async/await
- Xcode-schema's, build-configuraties en Info.plist-machtigingen configureren
- App Store Connect-metagegevens voorbereiden en controleren op indiening-richtlijnen
- Swift-geheugenbeheer-problemen diagnosticeren (retain cycles, zwakke referenties)

## Instructies

### SwiftUI Property Wrappers

**De juiste property wrapper kiezen:**

```swift
// @State: lokale kortstondige status, eigendom van deze view
// Gebruik voor: schakelaars, tekstinvoervelden, animatieactivators
struct CounterView: View {
  @State private var count = 0

  var body: some View {
    Button("Count: \(count)") { count += 1 }
  }
}

// @Binding: bidirectionele referentie naar parent's @State
// Gebruik voor: kindviews die parent-state moeten muteren
struct ToggleRow: View {
  @Binding var isEnabled: Bool

  var body: some View {
    Toggle("Enable", isOn: $isEnabled)
  }
}

// @ObservedObject: reference type view model, niet eigendom van deze view
// De view is NIET eigenaar van de object-levensduur
struct ProductListView: View {
  @ObservedObject var viewModel: ProductListViewModel

  var body: some View {
    List(viewModel.products) { product in
      Text(product.name)
    }
  }
}

// @StateObject: reference type view model, EIGENDOM van deze view
// Gebruik op de aanmaakplaats — niet in kindviews
struct RootView: View {
  @StateObject private var viewModel = ProductListViewModel()

  var body: some View {
    ProductListView(viewModel: viewModel)
  }
}

// @EnvironmentObject: afhankelijkheidsinjectie via .environmentObject()
// Gebruik voor app-brede status (auth, thema, gebruikerssessie)
struct ProfileView: View {
  @EnvironmentObject var authSession: AuthSession

  var body: some View {
    Text("Logged in as \(authSession.user.name)")
  }
}
// Injecteren in root: ContentView().environmentObject(AuthSession())

// @Environment: systeemwaarden (colorScheme, locale, dismiss)
struct MyView: View {
  @Environment(\.colorScheme) var colorScheme
  @Environment(\.dismiss) var dismiss
}
```

### MVVM met ObservableObject

```swift
// Model
struct User: Identifiable, Codable {
  let id: UUID
  var name: String
  var email: String
}

// ViewModel — bedrijfslogica, geen UI-importen
@MainActor  // garandeert dat alle @Published-updates op main thread plaatsvinden
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

// View — nul logica, pure rendering
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
// async/await — vervangt completion handlers
func fetchUser(id: UUID) async throws -> User {
  let url = URL(string: "https://api.example.com/users/\(id)")!
  let (data, response) = try await URLSession.shared.data(from: url)

  guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
    throw APIError.badResponse
  }

  return try JSONDecoder().decode(User.self, from: data)
}

// Structured concurrency — TaskGroup voor parallel werk
func fetchAllProfiles(ids: [UUID]) async throws -> [User] {
  try await withThrowingTaskGroup(of: User.self) { group in
    for id in ids {
      group.addTask { try await fetchUser(id: id) }
    }
    return try await group.reduce(into: []) { $0.append($1) }
  }
}

// async let — concurrent kindtaken, resultaten verzamelen
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

// Actor — thread-safe reference type, serialiseert toegang
actor ImageCache {
  private var cache: [URL: UIImage] = [:]

  func image(for url: URL) -> UIImage? {
    cache[url]
  }

  func store(_ image: UIImage, for url: URL) {
    cache[url] = image
  }
}

// MainActor — zorgt ervoor dat uitvoering op main thread plaatsvindt
@MainActor
func updateUI(with user: User) {
  titleLabel.text = user.name // veilig: gegarandeerd main thread
}
```

### Combine Pijplijnen

```swift
import Combine

// Zoeken met debounce — voorkomt API-aanroep bij elke toetsaanslag
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
          .catch { _ in Just([]) } // fouten onderdrukken, leeg teruggeven
      }
      .receive(on: DispatchQueue.main)
      .assign(to: \.results, on: self)
      .store(in: &cancellables)
  }
}

// Meerdere publishers combineren
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

### URLSession met async/await

```swift
// Getypte API-client
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

### Core Data met CloudKit Sync

```swift
// Persistentie-controller
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

// Fetch met SwiftUI
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

### Xcode-configuratie

```
// Schema's: Debug, Staging, Release
// Build-configuraties: Debug, Staging, Release
// Map via schema → build-configuratie

// Info.plist-machtigingen (voeg alleen toe wat je gebruikt — reviewers controleren)
// NSCameraUsageDescription
// NSMicrophoneUsageDescription
// NSLocationWhenInUseUsageDescription
// NSPhotoLibraryUsageDescription

// Door gebruiker gedefinieerde build-instellingen voor per-environment-config
// APP_BASE_URL = $(APP_BASE_URL_$(CONFIGURATION))
// APP_BASE_URL_Debug = https://api-dev.example.com
// APP_BASE_URL_Staging = https://api-staging.example.com
// APP_BASE_URL_Release = https://api.example.com
```

### App Store-indiening Checklist

```
Voor indiening:
- Alle Info.plist machtigings-strings ingevuld met echte gebruikersgerichte redenen
- Getest op fysiek apparaat (niet alleen simulator)
- Getest met Network Link Conditioner op 3G-snelheden
- Geen gebruik van private API's (scannen met nm -u MyApp.app/MyApp | grep -i apple)
- App-pictogram: 1024x1024 PNG, geen alfakanaal, geen afgeronde hoeken
- Launch Screen of LaunchScreen.storyboard aanwezig
- Geen hardcoded testreferenties of debug backdoors
- Privacy Nutrition Labels nauwkeurig (App Store Connect > App Privacy)
- App Store Review Guidelines 4.0 (design), 5.1 (privacy) gecontroleerd

App Store Connect:
- Screenshots voor vereiste apparaatformaten (6.9" vereist, 6.5" optioneel)
- App preview video optioneel maar verbetert conversie
- Trefwoorden: limiet 100 tekens, kommagescheiden, geen spaties na komma's
- Promotionele tekst: 170 tekens, kunnen zonder hernieuwde indiening worden bijgewerkt
- Support URL moet oplossing geven
```

## Voorbeeld use case

**Invoer:** Bouw een SwiftUI-app met MVVM-architectuur, async/await-netwerken, Core Data-persistentie en voorbereiding voor App Store-indiening.

**Wat deze agent produceert:**

Architectuur: `PersistenceController` singleton bezit `NSPersistentCloudKitContainer`. Elke functie krijgt een `@MainActor`-geannoteerde `ObservableObject` ViewModel. `APIClient` met generieke `get<T>` en `post<Body, Response>` methoden met async/await en `JSONDecoder` met snake_case-conversie.

SwiftUI-laag: `@StateObject` op feature root-views, `@ObservedObject` in kindviews, `@FetchRequest` voor Core Data-lijsten. `@EnvironmentObject` voor `AuthSession` geïnjecteerd op `WindowGroup`-niveau.

Concurrency: `withThrowingTaskGroup` voor parallelle API-aanroepen bij app-lancering (gebruiker + feed + meldingen). `Task { await viewModel.load() }` in `.onAppear`. Actor voor `ImageCache` om race conditions te voorkomen.

App Store-voorbereiding: alle vijf Info.plist machtigings-strings geschreven met specifieke gebruikersgerichte redenen, build-configuraties bedraden naar `APP_BASE_URL` user-defined instelling, launch screen geconfigureerd, privacy nutrition labels documentatie gegenereerd.

---
