---
name: typescript-advanced
description: "Advanced TypeScript: generics, conditional types, mapped types, template literals, utility types, type guards, discriminated unions at scale"
---

> 🇩🇪 Deutsche Version. [Englische Version](../typescript-advanced.md).

# TypeScript Advanced Skill

## Wann aktivieren
- Entwerfen einer typsicheren API oder eines SDKs, bei dem generics unverzichtbar sind
- Schreiben von utility types zur Vermeidung von Typ-Duplizierung
- Typen mit discriminated unions und type guards einschränken
- TypeScript Typen inferieren lassen, anstatt sie manuell zu annotieren
- Debuggen komplexer Typfehler in generischem Code
- Aufbau eines typsicheren Event-Systems, einer State Machine oder Plugin-Architektur

## Wann NICHT verwenden
- Grundlegendes TypeScript mit einfachen Typen — dafür gibt es den TypeScript rules Skill
- Wenn `any` tatsächlich die richtige Antwort ist (selten, aber an externen API-Grenzen möglich)
- Überengineering von Typen für einfachen internen Code — Lesbarkeit > Typ-Cleverness

## Anweisungen

### Generics — Typen für sich arbeiten lassen

```typescript
// Generische Funktion — Typ wird vom Argument inferiert
function first<T>(arr: T[]): T | undefined {
  return arr[0]
}
const n = first([1, 2, 3])    // n: number | undefined ✅
const s = first(['a', 'b'])   // s: string | undefined ✅

// Eingeschränkte generics
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
const user = { id: 1, name: 'Alice' }
const name = getProperty(user, 'name')  // name: string ✅
// getProperty(user, 'missing')          // ❌ Kompilierfehler

// Standard-Typparameter
type ApiResponse<T = unknown> = {
  data: T
  status: number
  message: string
}
```

### Discriminated unions — die Grundlage für sicheren Zustand

```typescript
// Jede Variante hat ein eindeutiges Literal-Feld 'type'
type LoadingState = { status: 'loading' }
type SuccessState<T> = { status: 'success'; data: T }
type ErrorState = { status: 'error'; error: Error; retryable: boolean }

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState

function renderState<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'loading': return <Spinner />
    case 'success': return <Data data={state.data} />  // state.data verfügbar ✅
    case 'error':   return <Error error={state.error} retryable={state.retryable} />
    default: {
      const _exhaustive: never = state  // Kompilierfehler wenn ein Fall fehlt
      throw new Error(`Unhandled: ${_exhaustive}`)
    }
  }
}
```

### Type guards — Runtime-Einschränkung mit Typsicherheit

```typescript
// Benutzerdefinierter type guard
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value &&
    typeof (value as User).email === 'string'
  )
}

// Assertionsfunktion (wirft, wenn nicht der erwartete Typ)
function assertUser(value: unknown): asserts value is User {
  if (!isUser(value)) throw new TypeError(`Expected User, got ${typeof value}`)
}

// Verwendung
const data = await fetchUser()
if (isUser(data)) {
  console.log(data.email)  // data: User ✅
}

assertUser(data)
console.log(data.email)    // data: User ✅ (wirft vor dieser Zeile wenn kein User)
```

### Utility types — Wiederholungen vermeiden

```typescript
type User = {
  id: number
  email: string
  name: string
  passwordHash: string
  createdAt: Date
}

// Sensible Felder weglassen
type PublicUser = Omit<User, 'passwordHash'>

// Alle Felder optional (für PATCH-Endpunkte)
type UpdateUserRequest = Partial<Pick<User, 'email' | 'name'>>

// Erforderliche Teilmenge
type CreateUserRequest = Required<Pick<User, 'email' | 'name'>>

// Nur-Lesen
type ReadonlyUser = Readonly<User>

// Aus dem Rückgabetyp einer Funktion
async function fetchUser(id: number) {
  return db.user.findUnique({ where: { id } })
}
type FetchedUser = Awaited<ReturnType<typeof fetchUser>>

// Aus den Parametern einer Funktion
type FetchUserParams = Parameters<typeof fetchUser>[0]  // number
```

### Bedingte Typen

```typescript
// IsArray<T> — wahr wenn T ein Array ist
type IsArray<T> = T extends unknown[] ? true : false
type A = IsArray<string[]>  // true
type B = IsArray<string>    // false

// Array-Elementtyp extrahieren
type ElementType<T> = T extends (infer E)[] ? E : T
type C = ElementType<string[]>  // string
type D = ElementType<string>    // string (kein Array, gibt T zurück)

// NonNullable-Äquivalent (eingebaut, zu Lernzwecken gezeigt)
type StrictNonNullable<T> = T extends null | undefined ? never : T
type E = StrictNonNullable<string | null | undefined>  // string

// Bedingt auf Objektstruktur
type HasId<T> = T extends { id: unknown } ? true : false
```

### Mapped types — Objektformen transformieren

```typescript
// Alle Werte nullable machen
type Nullable<T> = { [K in keyof T]: T[K] | null }

// Alle Werte asynchron machen
type Asyncify<T> = { [K in keyof T]: T[K] extends (...args: infer A) => infer R
  ? (...args: A) => Promise<R>
  : T[K]
}

// Schlüssel nach Werttyp filtern
type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K]
}
type OnlyStrings = PickByValue<{ a: string; b: number; c: string }, string>
// { a: string; c: string }

// Einen Record aus einer Union erstellen
type Status = 'pending' | 'active' | 'inactive'
type StatusConfig = Record<Status, { label: string; color: string }>
```

### Template-Literal-Typen

```typescript
// Alle CSS-ähnlichen Größenvarianten generieren
type Size = 'sm' | 'md' | 'lg'
type Color = 'primary' | 'secondary'
type ButtonVariant = `${Color}-${Size}`
// 'primary-sm' | 'primary-md' | 'primary-lg' | 'secondary-sm' | ...

// Routenparameter extrahieren
type ExtractRouteParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractRouteParams<`/${Rest}`>
    : T extends `${string}:${infer Param}`
    ? Param
    : never

type Params = ExtractRouteParams<'/users/:userId/posts/:postId'>
// 'userId' | 'postId'

// Typsicheres Event-System
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
emit('user:created', { userId: '1' })                     // ❌ email fehlt
```

### Infer — Typen aus anderen Typen extrahieren

```typescript
// Den aufgelösten Typ einer Promise extrahieren
type Awaited<T> = T extends Promise<infer U> ? U : T

// Funktions-Rückgabetyp extrahieren
type ReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : never

// Konstruktor-Parameter extrahieren
type ConstructorParams<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: infer P) => any ? P : never

// Array-Elementtyp extrahieren
type ArrayElement<T extends readonly unknown[]> =
  T extends readonly (infer E)[] ? E : never

type Nums = ArrayElement<number[]>  // number
```

### `satisfies`-Operator (TS 4.9+)

```typescript
type Config = {
  port: number
  host: string
  features: Record<string, boolean>
}

// satisfies prüft den Typ, erhält aber den Literal-Typ
const config = {
  port: 3000,
  host: 'localhost',
  features: { dark_mode: true, beta: false },
} satisfies Config

// port ist immer noch 3000 (nicht auf number erweitert)
config.port.toFixed(0)             // ✅ immer noch eine number-Methode
config.features.dark_mode          // ✅ TypeScript weiß, dass dieser Schlüssel existiert
config.features.nonexistent        // ❌ Kompilierfehler
```

## Beispiel

**Benutzer:** Einen typsicheren API-Client bauen, bei dem Request- und Response-Typen aus einem Routendefinitionsobjekt inferiert werden, ohne manuelle Typannotationen an den Aufrufstellen.

**Erwartete Ausgabe:**
```typescript
type Routes = {
  'GET /users': { response: User[] }
  'GET /users/:id': { params: { id: string }; response: User }
  'POST /users': { body: CreateUserRequest; response: User }
}

// apiClient.get('/users') aufrufen → inferiert response: User[]
// apiClient.get('/users/:id', { params: { id: '1' } }) aufrufen → inferiert User
// apiClient.get('/unknown') → Kompilierfehler
```

---
