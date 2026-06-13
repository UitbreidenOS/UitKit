# Swift + SwiftUI Développement iOS

## Quand activer
- Construction d'applications iOS, iPadOS, ou macOS avec SwiftUI
- Implémentation de réseau async/await avec URLSession
- Configuration de Core Data pour la persistance locale
- Câblage de publishers Combine et subscribers
- Préparation pour la soumission à l'App Store et examen
- Débogage de la sélection de property wrapper (`@State`, `@Binding`, `@ObservedObject`, etc.)

## Quand ne PAS utiliser
- Projets UIKit uniquement où SwiftUI est explicitement exclus
- Cibles tvOS ou watchOS avec cycle de vie significativement différent
- Swift côté serveur (Vapor, Hummingbird) sans couche UI

## Instructions

### Property Wrappers — Quand chacun

| Wrapper | Propriétaire | Cas d'utilisation |
|---|---|---|
| `@State` | La vue elle-même | État UI local et value-type |
| `@Binding` | Parent le transmet | Connexion bidirectionnelle à `@State` du parent |
| `@StateObject` | La vue elle-même | La vue crée et possède un `ObservableObject` |
| `@ObservedObject` | Parent le transmet | La vue observe un objet possédé ailleurs |
| `@EnvironmentObject` | Injecté via `.environmentObject()` | Objet observable partagé propagé dans la hiérarchie |
| `@Environment` | Environnement SwiftUI | Valeurs système : `colorScheme`, `dismiss`, `openURL` |

```swift
// @State — local value owned by this view
struct ToggleRow: View {
    @State private var isOn = false
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

// @EnvironmentObject — injected at a high level
struct UserBadge: View {
    @EnvironmentObject var session: UserSession
    var body: some View {
        Text(session.displayName)
    }
}

// Inject at root
ContentView().environmentObject(UserSession())
```

Règle : utiliser `@StateObject` quand la vue crée l'objet. Utiliser `@ObservedObject` quand l'objet est injecté. Ne jamais créer un `ObservableObject` directement dans la propriété `body` — il sera recréé à chaque render.

### Async/Await avec URLSession

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

        guard let http = response as? HTTPURLResponse, (200..<300).contains(http.statusCode) else {
            throw URLError(.badServerResponse)
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
        .task { await vm.load(id: userId) }
    }
}
```

Toujours marquer ViewModels `@MainActor` pour s'assurer que les mutations `@Published` se font sur le thread principal.

### Core Data — Configuration NSPersistentContainer

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
```

### Combine — sink et assign

```swift
import Combine

class SearchViewModel: ObservableObject {
    @Published var query = ""
    @Published var results: [Product] = []

    private var cancellables = Set<AnyCancellable>()
    private let api = APIClient()

    init() {
        $query
            .debounce(for: .milliseconds(300), scheduler: RunLoop.main)
            .removeDuplicates()
            .filter { $0.count >= 2 }
            .flatMap { [weak self] q -> AnyPublisher<[Product], Never> in
                guard let self else { return Empty().eraseToAnyPublisher() }
                return self.api.search(query: q)
                    .catch { _ in Just([]) }
                    .eraseToAnyPublisher()
            }
            .assign(to: &$results)
    }
}
```

Utiliser `.sink` quand vous avez besoin d'effets secondaires. Utiliser `.assign(to:)` pour piloter une propriété `@Published`. Toujours stocker les abonnements dans `Set<AnyCancellable>`.

### Checklist de soumission App Store

Avant de soumettre à App Store Connect :

**Technique :**
- Construire avec la dernière Xcode stable
- Ensemble de permissions requises dans `Info.plist`
- Manifeste de confidentialité (`PrivacyInfo.xcprivacy`) requis
- Icônes pour toutes les tailles requises dans le catalogue d'actifs

**App Store Connect :**
- Version et numéro de build incrémentés
- Screenshots pour tous les appareils requis
- Questionnaire d'évaluation d'âge complété
- Déclaration de conformité à l'exportation

**Test :**
- Testé sur appareil physique, pas seulement simulateur
- Deep links et Universal Links testés
- Notifications push testées end-to-end
- Audit d'accessibilité (VoiceOver, Dynamic Type)

## Exemple

Un écran de paramètres démontrant les property wrappers :

```swift
@MainActor
class SettingsViewModel: ObservableObject {
    @Published var notificationsEnabled = false
    @Published var theme: AppTheme = .system
}

struct SettingsView: View {
    @StateObject private var vm = SettingsViewModel()
    @EnvironmentObject var session: UserSession
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        Form {
            Section("Account") {
                Text(session.email)
            }
            Section("Preferences") {
                Toggle("Notifications", isOn: $vm.notificationsEnabled)
            }
        }
        .navigationTitle("Settings")
        .toolbar {
            ToolbarItem(placement: .confirmationAction) {
                Button("Done") { dismiss() }
            }
        }
    }
}
```

---
