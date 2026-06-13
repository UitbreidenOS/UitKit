---
name: typescript-advanced
description: "Advanced TypeScript: generics, conditional types, mapped types, template literals, utility types, type guards, discriminated unions at scale"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../typescript-advanced.md).

# TypeScript Advanced Skill

## Wanneer activeren
- Een typeveilige API of SDK ontwerpen waarbij generics essentieel zijn
- Utility types schrijven om typeduplicatie te elimineren
- Types beperken met discriminated unions en type guards
- TypeScript types laten infereren in plaats van ze handmatig te annoteren
- Complexe typefouten in generieke code debuggen
- Een typeveilig eventsysteem, state machine of plugin-architectuur bouwen

## Wanneer NIET gebruiken
- Basis-TypeScript met eenvoudige types — daarvoor dient de TypeScript rules skill
- Wanneer `any` echt het juiste antwoord is (zeldzaam, maar komt voor bij externe API-grenzen)
- Over-engineering van types voor eenvoudige interne code — leesbaarheid > type-cleverness

## Instructies

### Generics — types voor je laten werken

```typescript
// Generieke functie — type wordt geïnfereerd vanuit het argument
function first<T>(arr: T[]): T | undefined {
  return arr[0]
}
const n = first([1, 2, 3])    // n: number | undefined ✅
const s = first(['a', 'b'])   // s: string | undefined ✅

// Beperkte generics
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
const user = { id: 1, name: 'Alice' }
const name = getProperty(user, 'name')  // name: string ✅
// getProperty(user, 'missing')          // ❌ compilatiefout

// Standaard typeparameter
type ApiResponse<T = unknown> = {
  data: T
  status: number
  message: string
}
```

### Discriminated unions — de basis van veilige toestand

```typescript
// Elke variant heeft een uniek literal 'type'-veld
type LoadingState = { status: 'loading' }
type SuccessState<T> = { status: 'success'; data: T }
type ErrorState = { status: 'error'; error: Error; retryable: boolean }

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState

function renderState<T>(state: AsyncState<T>) {
  switch (state.status) {
    case 'loading': return <Spinner />
    case 'success': return <Data data={state.data} />  // state.data beschikbaar ✅
    case 'error':   return <Error error={state.error} retryable={state.retryable} />
    default: {
      const _exhaustive: never = state  // compilatiefout als een geval ontbreekt
      throw new Error(`Unhandled: ${_exhaustive}`)
    }
  }
}
```

### Type guards — runtime-beperking met typeveiligheid

```typescript
// Door gebruiker gedefinieerde type guard
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value &&
    typeof (value as User).email === 'string'
  )
}

// Assertiefunctie (gooit als het niet het verwachte type is)
function assertUser(value: unknown): asserts value is User {
  if (!isUser(value)) throw new TypeError(`Expected User, got ${typeof value}`)
}

// Gebruik
const data = await fetchUser()
if (isUser(data)) {
  console.log(data.email)  // data: User ✅
}

assertUser(data)
console.log(data.email)    // data: User ✅ (gooit vóór deze regel als het geen User is)
```

### Utility types — herhaling vermijden

```typescript
type User = {
  id: number
  email: string
  name: string
  passwordHash: string
  createdAt: Date
}

// Gevoelige velden weglaten
type PublicUser = Omit<User, 'passwordHash'>

// Alle velden optioneel (voor PATCH-endpoints)
type UpdateUserRequest = Partial<Pick<User, 'email' | 'name'>>

// Verplichte subset
type CreateUserRequest = Required<Pick<User, 'email' | 'name'>>

// Alleen-lezen
type ReadonlyUser = Readonly<User>

// Vanuit het returntype van een functie
async function fetchUser(id: number) {
  return db.user.findUnique({ where: { id } })
}
type FetchedUser = Awaited<ReturnType<typeof fetchUser>>

// Vanuit de parameters van een functie
type FetchUserParams = Parameters<typeof fetchUser>[0]  // number
```

### Conditionele types

```typescript
// IsArray<T> — waar als T een array is
type IsArray<T> = T extends unknown[] ? true : false
type A = IsArray<string[]>  // true
type B = IsArray<string>    // false

// Array-elementtype extraheren
type ElementType<T> = T extends (infer E)[] ? E : T
type C = ElementType<string[]>  // string
type D = ElementType<string>    // string (geen array, geeft T terug)

// NonNullable-equivalent (ingebouwd, getoond ter lering)
type StrictNonNullable<T> = T extends null | undefined ? never : T
type E = StrictNonNullable<string | null | undefined>  // string

// Conditioneel op objectstructuur
type HasId<T> = T extends { id: unknown } ? true : false
```

### Mapped types — objectvormen transformeren

```typescript
// Alle waarden nullable maken
type Nullable<T> = { [K in keyof T]: T[K] | null }

// Alle waarden asynchroon maken
type Asyncify<T> = { [K in keyof T]: T[K] extends (...args: infer A) => infer R
  ? (...args: A) => Promise<R>
  : T[K]
}

// Sleutels filteren op waardetype
type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K]
}
type OnlyStrings = PickByValue<{ a: string; b: number; c: string }, string>
// { a: string; c: string }

// Een Record maken van een union
type Status = 'pending' | 'active' | 'inactive'
type StatusConfig = Record<Status, { label: string; color: string }>
```

### Template literal types

```typescript
// Alle CSS-achtige grootttevarianten genereren
type Size = 'sm' | 'md' | 'lg'
type Color = 'primary' | 'secondary'
type ButtonVariant = `${Color}-${Size}`
// 'primary-sm' | 'primary-md' | 'primary-lg' | 'secondary-sm' | ...

// Routeparameters extraheren
type ExtractRouteParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractRouteParams<`/${Rest}`>
    : T extends `${string}:${infer Param}`
    ? Param
    : never

type Params = ExtractRouteParams<'/users/:userId/posts/:postId'>
// 'userId' | 'postId'

// Typeveilig eventsysteem
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
emit('user:created', { userId: '1' })                     // ❌ email ontbreekt
```

### Infer — types uit andere types extraheren

```typescript
// Het opgeloste type van een Promise extraheren
type Awaited<T> = T extends Promise<infer U> ? U : T

// Returntype van een functie extraheren
type ReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : never

// Constructorparameters extraheren
type ConstructorParams<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: infer P) => any ? P : never

// Array-elementtype extraheren
type ArrayElement<T extends readonly unknown[]> =
  T extends readonly (infer E)[] ? E : never

type Nums = ArrayElement<number[]>  // number
```

### `satisfies`-operator (TS 4.9+)

```typescript
type Config = {
  port: number
  host: string
  features: Record<string, boolean>
}

// satisfies controleert het type maar behoudt het literal type
const config = {
  port: 3000,
  host: 'localhost',
  features: { dark_mode: true, beta: false },
} satisfies Config

// port is nog steeds 3000 (niet verbreed naar number)
config.port.toFixed(0)             // ✅ nog steeds een number-methode
config.features.dark_mode          // ✅ TypeScript weet dat deze sleutel bestaat
config.features.nonexistent        // ❌ compilatiefout
```

## Voorbeeld

**Gebruiker:** Een typeveilige API-client bouwen waarbij request- en response-types worden geïnfereerd vanuit een routedefinitie-object, zonder handmatige typeannotaties op de aanroeplocaties.

**Verwachte uitvoer:**
```typescript
type Routes = {
  'GET /users': { response: User[] }
  'GET /users/:id': { params: { id: string }; response: User }
  'POST /users': { body: CreateUserRequest; response: User }
}

// apiClient.get('/users') aanroepen → inferreert response: User[]
// apiClient.get('/users/:id', { params: { id: '1' } }) aanroepen → inferreert User
// apiClient.get('/unknown') → compilatiefout
```

---
