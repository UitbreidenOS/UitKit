# Swift + Desarrollo iOS con SwiftUI

## Cuándo activar
- Construcción de aplicaciones iOS, iPadOS, o macOS con SwiftUI
- Implementación de networking async/await con URLSession
- Configuración de Core Data para persistencia local
- Cableado de publishers Combine y suscriptores
- Preparación para envío y revisión en App Store
- Depuración de selección de property wrapper

## Cuándo NO usar
- Proyectos solo UIKit donde SwiftUI se excluye explícitamente
- Objetivos tvOS o watchOS con ciclo de vida significativamente diferente
- Swift del lado del servidor sin capa UI

## Instrucciones

### Property Wrappers — Cuándo Usar Cada Uno

| Wrapper | Propietario | Caso de uso |
|---|---|---|
| `@State` | La vista misma | Estado UI local de tipo valor (toggle, entrada de campo de texto, contador) |
| `@Binding` | Padre lo pasa | Conexión bidireccional al `@State` del padre |
| `@StateObject` | La vista misma | La vista crea y posee un `ObservableObject` de tipo referencia |
| `@ObservedObject` | Padre lo pasa | La vista observa un objeto de tipo referencia poseído en otro lugar |
| `@EnvironmentObject` | Inyectado vía `.environmentObject()` | Objeto observable compartido propagado a través de jerarquía de vistas |
| `@Environment` | Ambiente SwiftUI | Valores del sistema: `colorScheme`, `dismiss`, `openURL`, custom environment keys |

### Async/Await con URLSession

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
        .task { await vm.load(id: userId) }
    }
}
```

Siempre marcar ViewModels `@MainActor` para asegurar que mutaciones `@Published` ocurren en el thread principal.

### Core Data — Configuración de NSPersistentContainer

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

Para operaciones de fondo, usar `container.newBackgroundContext()` o `container.performBackgroundTask { ctx in }`.

### Combine — sink y assign

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
            .assign(to: &$results)
    }
}
```

Usar `.sink` para efectos secundarios. Usar `.assign(to:)` para conducir una propiedad `@Published`. Siempre almacenar suscripciones en `Set<AnyCancellable>`.

### Lista de Verificación de Envío en App Store

Antes de enviar a App Store Connect:

**Requisitos técnicos:**
- Construir con Xcode estable más reciente y SDK iOS más reciente
- No usar APIs privadas
- Todos los strings de permisos requeridos en `Info.plist`
- Iconos para todos los tamaños requeridos presentes en catálogo de activos
- Pantalla de lanzamiento o `LaunchScreen.storyboard` configurado

**Privacidad:**
- Manifiesto de privacidad (`PrivacyInfo.xcprivacy`) requerido
- Declinar recopilación de datos en App Store Connect

**Pruebas antes del envío:**
- Probado en TestFlight en dispositivo físico
- Deep links y Universal Links probados
- Notificaciones push probadas end-to-end
- Auditoría de accesibilidad (VoiceOver, Dynamic Type)

## Ejemplo

Una pantalla de configuración demostrando múltiples property wrappers juntos:

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
