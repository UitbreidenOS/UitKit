---
name: typescript-advanced
description: "Advanced TypeScript: generics, conditional types, mapped types, template literals, utility types, type guards, discriminated unions at scale"
---

> 🇪🇸 Versión en español. [Versión en inglés](../typescript-advanced.md).

# Habilidad TypeScript Avanzado

## Cuándo activar
- Diseñar una API o SDK con seguridad de tipos donde los generics son esenciales
- Escribir utility types para eliminar duplicación de tipos
- Restringir tipos con discriminated unions y type guards
- Hacer que TypeScript infiera tipos en lugar de anotarlos manualmente
- Depurar errores de tipos complejos en código genérico
- Construir un sistema de eventos con seguridad de tipos, máquina de estados o arquitectura de plugins

## Cuándo NO usar
- TypeScript básico con tipos simples — para eso existe la habilidad TypeScript rules
- Cuando `any` es genuinamente la respuesta correcta (raro, pero ocurre en los límites de APIs externas)
- Sobreingeniería de tipos para código interno simple — la legibilidad supera a la astucia de tipos

## Instrucciones

### Generics — hacer que los tipos trabajen para ti

```typescript
// Función genérica — tipo inferido desde el argumento
function first<T>(arr: T[]): T | undefined {
  return arr[0]
}
const n = first([1, 2, 3])    // n: number | undefined ✅
const s = first(['a', 'b'])   // s: string | undefined ✅

// Generics con restricciones
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}
const user = { id: 1, name: 'Alice' }
const name = getProperty(user, 'name')  // name: string ✅
// getProperty(user, 'missing')          // ❌ error de compilación

// Parámetro de tipo por defecto
type ApiResponse<T = unknown> = {
  data: T
  status: number
  message: string
}
```

### Discriminated unions — la base del estado seguro

```typescript
// Cada variante tiene un campo literal 'type' único
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
      const _exhaustive: never = state  // error de compilación si falta un caso
      throw new Error(`Unhandled: ${_exhaustive}`)
    }
  }
}
```

### Type guards — restricción en tiempo de ejecución con seguridad de tipos

```typescript
// Type guard definido por el usuario
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value &&
    typeof (value as User).email === 'string'
  )
}

// Función de aserción (lanza si no es el tipo esperado)
function assertUser(value: unknown): asserts value is User {
  if (!isUser(value)) throw new TypeError(`Expected User, got ${typeof value}`)
}

// Uso
const data = await fetchUser()
if (isUser(data)) {
  console.log(data.email)  // data: User ✅
}

assertUser(data)
console.log(data.email)    // data: User ✅ (lanza antes de esta línea si no es un User)
```

### Utility types — evitar repetirse

```typescript
type User = {
  id: number
  email: string
  name: string
  passwordHash: string
  createdAt: Date
}

// Omitir campos sensibles
type PublicUser = Omit<User, 'passwordHash'>

// Todos los campos opcionales (para endpoints PATCH)
type UpdateUserRequest = Partial<Pick<User, 'email' | 'name'>>

// Subconjunto requerido
type CreateUserRequest = Required<Pick<User, 'email' | 'name'>>

// Solo lectura
type ReadonlyUser = Readonly<User>

// Desde el tipo de retorno de una función
async function fetchUser(id: number) {
  return db.user.findUnique({ where: { id } })
}
type FetchedUser = Awaited<ReturnType<typeof fetchUser>>

// Desde los parámetros de una función
type FetchUserParams = Parameters<typeof fetchUser>[0]  // number
```

### Tipos condicionales

```typescript
// IsArray<T> — verdadero si T es un array
type IsArray<T> = T extends unknown[] ? true : false
type A = IsArray<string[]>  // true
type B = IsArray<string>    // false

// Extraer el tipo de elemento de un array
type ElementType<T> = T extends (infer E)[] ? E : T
type C = ElementType<string[]>  // string
type D = ElementType<string>    // string (no es un array, devuelve T)

// Equivalente NonNullable (nativo, mostrado para aprendizaje)
type StrictNonNullable<T> = T extends null | undefined ? never : T
type E = StrictNonNullable<string | null | undefined>  // string

// Condicional sobre la estructura del objeto
type HasId<T> = T extends { id: unknown } ? true : false
```

### Mapped types — transformar formas de objetos

```typescript
// Hacer todos los valores nullable
type Nullable<T> = { [K in keyof T]: T[K] | null }

// Hacer todos los valores asíncronos
type Asyncify<T> = { [K in keyof T]: T[K] extends (...args: infer A) => infer R
  ? (...args: A) => Promise<R>
  : T[K]
}

// Filtrar claves por tipo de valor
type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K]
}
type OnlyStrings = PickByValue<{ a: string; b: number; c: string }, string>
// { a: string; c: string }

// Crear un Record desde una union
type Status = 'pending' | 'active' | 'inactive'
type StatusConfig = Record<Status, { label: string; color: string }>
```

### Tipos literales de plantilla

```typescript
// Generar todas las variantes de tamaño estilo CSS
type Size = 'sm' | 'md' | 'lg'
type Color = 'primary' | 'secondary'
type ButtonVariant = `${Color}-${Size}`
// 'primary-sm' | 'primary-md' | 'primary-lg' | 'secondary-sm' | ...

// Extraer parámetros de ruta
type ExtractRouteParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractRouteParams<`/${Rest}`>
    : T extends `${string}:${infer Param}`
    ? Param
    : never

type Params = ExtractRouteParams<'/users/:userId/posts/:postId'>
// 'userId' | 'postId'

// Sistema de eventos con seguridad de tipos
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
emit('user:created', { userId: '1' })                     // ❌ falta email
```

### Infer — extraer tipos desde otros tipos

```typescript
// Extraer el tipo resuelto de una Promise
type Awaited<T> = T extends Promise<infer U> ? U : T

// Extraer el tipo de retorno de una función
type ReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : never

// Extraer parámetros del constructor
type ConstructorParams<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: infer P) => any ? P : never

// Extraer el tipo de elemento de un array
type ArrayElement<T extends readonly unknown[]> =
  T extends readonly (infer E)[] ? E : never

type Nums = ArrayElement<number[]>  // number
```

### Operador `satisfies` (TS 4.9+)

```typescript
type Config = {
  port: number
  host: string
  features: Record<string, boolean>
}

// satisfies verifica el tipo pero preserva el tipo literal
const config = {
  port: 3000,
  host: 'localhost',
  features: { dark_mode: true, beta: false },
} satisfies Config

// port sigue siendo 3000 (no ampliado a number)
config.port.toFixed(0)             // ✅ sigue siendo un método number
config.features.dark_mode          // ✅ TypeScript sabe que esta clave existe
config.features.nonexistent        // ❌ error de compilación
```

## Ejemplo

**Usuario:** Construir un cliente API con seguridad de tipos donde los tipos de solicitud y respuesta se infieren desde un objeto de definición de rutas, sin anotaciones de tipo manuales en los puntos de llamada.

**Salida esperada:**
```typescript
type Routes = {
  'GET /users': { response: User[] }
  'GET /users/:id': { params: { id: string }; response: User }
  'POST /users': { body: CreateUserRequest; response: User }
}

// Llamar apiClient.get('/users') → infiere response: User[]
// Llamar apiClient.get('/users/:id', { params: { id: '1' } }) → infiere User
// apiClient.get('/unknown') → error de compilación
```

---
