---
name: typescript-advanced
description: "Advanced TypeScript: generics, conditional types, mapped types, template literals, utility types, type guards, discriminated unions at scale"
---

> 🇫🇷 Version française. [English version](../typescript-advanced.md).

# Compétence TypeScript Avancé

## Quand l'activer
- Concevoir une API ou un SDK type-safe où les generics sont essentiels
- Écrire des utility types pour éliminer la duplication de types
- Restreindre les types avec des discriminated unions et des type guards
- Faire inférer les types par TypeScript plutôt que de les annoter manuellement
- Déboguer des erreurs de types complexes dans du code générique
- Construire un système d'événements type-safe, une machine d'état ou une architecture de plugins

## Quand NE PAS utiliser
- TypeScript basique avec des types simples — la compétence TypeScript rules couvre ça
- Quand `any` est vraiment la bonne réponse (rare, mais ça arrive aux frontières d'API externes)
- Sur-ingénierie des types pour du code interne simple — la lisibilité prime sur l'astuce de types

## Instructions

### Generics — faire travailler les types pour vous

```typescript
// Fonction générique — type inféré depuis l'argument
function first<T>(arr: T[]): T | undefined {
  return arr[0]
}
const n = first([1, 2, 3])    // n: number | undefined ✅
const s = first(['a', 'b'])   // s: string | undefined ✅

// Generics contraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
const user = { id: 1, name: 'Alice' }
const name = getProperty(user, 'name')  // name: string ✅
// getProperty(user, 'missing')          // ❌ erreur de compilation

// Paramètre de type par défaut
type ApiResponse<T = unknown> = {
  data: T
  status: number
  message: string
}
```

### Discriminated unions — la base d'un état sûr

```typescript
// Chaque variante a un champ littéral 'type' unique
type LoadingState = { status: 'loading' }
type SuccessState<T> = { status: 'success'; data: T }
type ErrorState = { status: 'error'; error: Error; retryable: boolean }

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState

function renderState<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'loading': return <Spinner />
    case 'success': return <Data data={state.data} />  // state.data disponible ✅
    case 'error':   return <Error error={state.error} retryable={state.retryable} />
    default: {
      const _exhaustive: never = state  // erreur de compilation si un cas manque
      throw new Error(`Unhandled: ${_exhaustive}`)
    }
  }
}
```

### Type guards — restriction au runtime avec sécurité de type

```typescript
// Type guard défini par l'utilisateur
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value &&
    typeof (value as User).email === 'string'
  )
}

// Fonction d'assertion (lève une exception si le type n'est pas celui attendu)
function assertUser(value: unknown): asserts value is User {
  if (!isUser(value)) throw new TypeError(`Expected User, got ${typeof value}`)
}

// Utilisation
const data = await fetchUser()
if (isUser(data)) {
  console.log(data.email)  // data: User ✅
}

assertUser(data)
console.log(data.email)    // data: User ✅ (lève une exception avant cette ligne si ce n'est pas un User)
```

### Utility types — éviter de se répéter

```typescript
type User = {
  id: number
  email: string
  name: string
  passwordHash: string
  createdAt: Date
}

// Omettre les champs sensibles
type PublicUser = Omit<User, 'passwordHash'>

// Tous les champs optionnels (pour les endpoints PATCH)
type UpdateUserRequest = Partial<Pick<User, 'email' | 'name'>>

// Sous-ensemble requis
type CreateUserRequest = Required<Pick<User, 'email' | 'name'>>

// Lecture seule
type ReadonlyUser = Readonly<User>

// Depuis le type de retour d'une fonction
async function fetchUser(id: number) {
  return db.user.findUnique({ where: { id } })
}
type FetchedUser = Awaited<ReturnType<typeof fetchUser>>

// Depuis les paramètres d'une fonction
type FetchUserParams = Parameters<typeof fetchUser>[0]  // number
```

### Types conditionnels

```typescript
// IsArray<T> — vrai si T est un tableau
type IsArray<T> = T extends unknown[] ? true : false
type A = IsArray<string[]>  // true
type B = IsArray<string>    // false

// Extraire le type d'élément d'un tableau
type ElementType<T> = T extends (infer E)[] ? E : T
type C = ElementType<string[]>  // string
type D = ElementType<string>    // string (pas un tableau, retourne T)

// Équivalent NonNullable (natif, montré à titre pédagogique)
type StrictNonNullable<T> = T extends null | undefined ? never : T
type E = StrictNonNullable<string | null | undefined>  // string

// Conditionnel sur la structure d'objet
type HasId<T> = T extends { id: unknown } ? true : false
```

### Mapped types — transformer les formes d'objets

```typescript
// Rendre toutes les valeurs nullables
type Nullable<T> = { [K in keyof T]: T[K] | null }

// Rendre toutes les valeurs asynchrones
type Asyncify<T> = { [K in keyof T]: T[K] extends (...args: infer A) => infer R
  ? (...args: A) => Promise<R>
  : T[K]
}

// Filtrer les clés par type de valeur
type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K]
}
type OnlyStrings = PickByValue<{ a: string; b: number; c: string }, string>
// { a: string; c: string }

// Créer un Record depuis une union
type Status = 'pending' | 'active' | 'inactive'
type StatusConfig = Record<Status, { label: string; color: string }>
```

### Types littéraux de template

```typescript
// Générer toutes les variantes de taille style CSS
type Size = 'sm' | 'md' | 'lg'
type Color = 'primary' | 'secondary'
type ButtonVariant = `${Color}-${Size}`
// 'primary-sm' | 'primary-md' | 'primary-lg' | 'secondary-sm' | ...

// Extraire les paramètres de route
type ExtractRouteParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractRouteParams<`/${Rest}`>
    : T extends `${string}:${infer Param}`
    ? Param
    : never

type Params = ExtractRouteParams<'/users/:userId/posts/:postId'>
// 'userId' | 'postId'

// Système d'événements type-safe
type EventMap = {
  'user:created': { userId: string; email: string }
  'user:deleted': { userId: string }
  'order:placed': { orderId: string; total: number }
}

type EventName = keyof EventMap

function emit<E extends EventName>(event: E, payload: EventMap[E]): void {
  // ...
}

emit('user:created', { userId: '1', email: 'a@b.com' })  // ✅
emit('user:created', { userId: '1' })                     // ❌ email manquant
```

### Infer — extraire des types depuis d'autres types

```typescript
// Extraire le type résolu d'une Promise
type Awaited<T> = T extends Promise<infer U> ? U : T

// Extraire le type de retour d'une fonction
type ReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : never

// Extraire les paramètres d'un constructeur
type ConstructorParams<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: infer P) => any ? P : never

// Extraire le type d'élément d'un tableau
type ArrayElement<T extends readonly unknown[]> =
  T extends readonly (infer E)[] ? E : never

type Nums = ArrayElement<number[]>  // number
```

### Opérateur `satisfies` (TS 4.9+)

```typescript
type Config = {
  port: number
  host: string
  features: Record<string, boolean>
}

// satisfies vérifie le type mais préserve le type littéral
const config = {
  port: 3000,
  host: 'localhost',
  features: { dark_mode: true, beta: false },
} satisfies Config

// port est toujours 3000 (pas élargi à number)
config.port.toFixed(0)             // ✅ toujours une méthode number
config.features.dark_mode          // ✅ TypeScript sait que cette clé existe
config.features.nonexistent        // ❌ erreur de compilation
```

## Exemple

**Utilisateur :** Construire un client API type-safe où les types de requête et de réponse sont inférés depuis un objet de définition de routes, sans annotations de type manuelles aux sites d'appel.

**Sortie attendue :**
```typescript
type Routes = {
  'GET /users': { response: User[] }
  'GET /users/:id': { params: { id: string }; response: User }
  'POST /users': { body: CreateUserRequest; response: User }
}

// Appeler apiClient.get('/users') → infère response: User[]
// Appeler apiClient.get('/users/:id', { params: { id: '1' } }) → infère User
// apiClient.get('/unknown') → erreur de compilation
```

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
