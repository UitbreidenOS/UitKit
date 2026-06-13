---
name: react
description: "React patterns: hooks, context, performance optimisation, component composition, state management, common anti-patterns"
---

> 🇪🇸 Versión en español. [Versión en inglés](../react.md).

# Habilidad React

## Cuándo activar
- Diseñar la arquitectura de componentes para una nueva funcionalidad
- Depurar problemas de rendimiento (re-renders innecesarios)
- Elegir entre estado local, context y gestión de estado externa
- Escribir custom hooks para compartir lógica entre componentes
- Implementar compound components, render props u otros patrones de composición
- Migrar class components a function components

## Cuándo NO usar
- Funcionalidades de Next.js App Router (Server Components, Server Actions) — usar la habilidad Next.js
- React Native — restricciones de plataforma diferentes
- UI estática simple sin estado — escribir HTML directamente

## Instrucciones

### Estado — dónde colocarlo

| Tipo de estado | Dónde colocarlo |
|---|---|
| Estado UI (abierto/cerrado, pestaña seleccionada) | `useState` local en el componente |
| Datos derivados (lista filtrada, total calculado) | `useMemo` — sin estado, derivar de props/state |
| Compartido entre componentes hermanos | Elevar al padre común |
| Compartido en un subárbol (tema, auth, locale) | Context |
| Estado del servidor (datos API) | React Query / SWR |
| Estado cliente complejo con muchas interacciones | Zustand / Jotai |

**Por defecto: estado local.** Solo elevar cuando múltiples componentes lo necesiten.

### Custom hooks — la abstracción correcta

Extraer la lógica en un custom hook cuando la misma lógica con estado aparece en 2+ componentes:

```typescript
// hooks/useDebounce.ts
function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])
  return debounced
}

// hooks/useLocalStorage.ts
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch { return initialValue }
  })

  const setStoredValue = (newValue: T) => {
    setValue(newValue)
    window.localStorage.setItem(key, JSON.stringify(newValue))
  }

  return [value, setStoredValue] as const
}

// hooks/useAsync.ts
function useAsync<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [state, setState] = useState<{
    data: T | null; error: Error | null; loading: boolean
  }>({ data: null, error: null, loading: true })

  useEffect(() => {
    setState(s => ({ ...s, loading: true }))
    fn()
      .then(data => setState({ data, error: null, loading: false }))
      .catch(error => setState({ data: null, error, loading: false }))
  }, deps)

  return state
}
```

### Context — solo para datos verdaderamente globales

```typescript
// contexts/AuthContext.tsx
type AuthContextValue = {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const signIn = async (email: string, password: string) => {
    const user = await api.signIn(email, password)
    setUser(user)
  }

  const signOut = async () => {
    await api.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// Siempre protegerse contra un provider ausente
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
```

**Antipatrones de Context a evitar:**
- No meter todo en un único context gigante — dividir por responsabilidad
- No poner valores que cambian rápido (posición del ratón, scroll) en context — causa re-renders en todos los consumidores
- No usar context como sustituto de una gestión de estado correcta a escala

### Rendimiento — corregir re-renders innecesarios

```typescript
// 1. memo — omitir re-render si las props no han cambiado
const UserCard = memo(({ user }: { user: User }) => {
  return <div>{user.name}</div>
})

// 2. useMemo — memoizar cálculos costosos
const sortedItems = useMemo(
  () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
  [items] // solo recalcular cuando items cambie
)

// 3. useCallback — referencia de función estable para props de hijo
const handleSubmit = useCallback(async (data: FormData) => {
  await api.submit(data)
  refetch()
}, [refetch]) // estable si refetch es estable

// 4. Carga perezosa
const HeavyChart = lazy(() => import('./HeavyChart'))

function Dashboard() {
  return (
    <Suspense fallback={<Skeleton />}>
      <HeavyChart />
    </Suspense>
  )
}
```

**Cómo encontrar qué está re-renderizando:**
- React DevTools Profiler → grabar → hacer clic → ver qué componentes renderizan y por qué
- Agregar `console.log('render', componentName)` temporalmente
- Biblioteca `why-did-you-render` para razones detalladas de re-render

**Cuándo NO memoizar:** la memoización tiene un coste. Solo agregar `memo`/`useMemo`/`useCallback` cuando se haya confirmado que un componente re-renderiza demasiado y esto causa lentitud real.

### Patrones de composición de componentes

**Compound components (componentes relacionados que comparten estado):**
```typescript
// En lugar de: <Select value={val} options={opts} onChange={fn} />
// Usar compound components para UIs complejas:

const SelectContext = createContext<SelectContextValue | null>(null)

function Select({ children, value, onChange }: SelectProps) {
  return (
    <SelectContext.Provider value={{ value, onChange }}>
      <div className="select">{children}</div>
    </SelectContext.Provider>
  )
}

Select.Option = function Option({ value, children }: OptionProps) {
  const ctx = useContext(SelectContext)!
  return (
    <div
      className={ctx.value === value ? 'selected' : ''}
      onClick={() => ctx.onChange(value)}
    >
      {children}
    </div>
  )
}

// Uso:
<Select value={selected} onChange={setSelected}>
  <Select.Option value="a">Option A</Select.Option>
  <Select.Option value="b">Option B</Select.Option>
</Select>
```

**Render props / children como función:**
```typescript
function DataFetcher<T>({ url, children }: {
  url: string
  children: (data: T | null, loading: boolean, error: Error | null) => ReactNode
}) {
  const { data, loading, error } = useAsync(() => fetch(url).then(r => r.json()), [url])
  return <>{children(data, loading, error)}</>
}

// Uso:
<DataFetcher url="/api/users">
  {(users, loading, error) => {
    if (loading) return <Spinner />
    if (error) return <ErrorMessage error={error} />
    return <UserList users={users} />
  }}
</DataFetcher>
```

### Antipatrones comunes

**Estado derivado como estado (el error más común):**
```typescript
// Malo — fullName es derivado, no necesita estado
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const [fullName, setFullName] = useState('')  // ❌

// Bueno — derivarlo
const fullName = `${firstName} ${lastName}`  // ✅ solo una variable
```

**useEffect para datos que se pueden calcular síncronamente:**
```typescript
// Malo — useEffect es asíncrono por naturaleza
useEffect(() => {
  setFilteredItems(items.filter(i => i.active))
}, [items])

// Bueno — useMemo es síncrono, ocurre durante el renderizado
const filteredItems = useMemo(
  () => items.filter(i => i.active),
  [items]
)
```

**Closures obsoletas en useEffect:**
```typescript
// Malo — count se captura en el momento en que el efecto se ejecuta
useEffect(() => {
  const interval = setInterval(() => {
    console.log(count) // ¡siempre registra el valor inicial!
  }, 1000)
  return () => clearInterval(interval)
}, []) // ❌ count falta en las dependencias

// Bueno — usar una ref para valores que cambian pero no necesitan disparar re-renders
const countRef = useRef(count)
countRef.current = count  // siempre actualizado

useEffect(() => {
  const interval = setInterval(() => {
    console.log(countRef.current) // siempre actualizado
  }, 1000)
  return () => clearInterval(interval)
}, []) // ✅ el intervalo solo se crea una vez
```

### Gestión de estado con Zustand

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CartStore = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  total: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set(state => ({ items: [...state.items, item] })),
      removeItem: (id) => set(state => ({
        items: state.items.filter(i => i.id !== id)
      })),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    { name: 'cart' } // persiste en localStorage
  )
)
```

## Ejemplo

**Usuario:** Un componente de filtro de productos re-renderiza demasiado y ralentiza una lista de 500 elementos.

**Análisis y corrección esperados:**
- Envolver el componente de elemento en `memo` — los elementos solo re-renderizan cuando sus propias props cambian
- Elevar el estado del filtro y envolver la función de filtro en `useCallback`
- Usar `useMemo` para el cálculo de la lista filtrada + ordenada
- Virtualizar la lista con `@tanstack/virtual` si sigue lenta después de la memoización

---
