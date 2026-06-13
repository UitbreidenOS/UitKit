---
name: react
description: "React patterns: hooks, context, performance optimisation, component composition, state management, common anti-patterns"
---

> 🇩🇪 Deutsche Version. [Englische Version](../react.md).

# React Skill

## Wann aktivieren
- Komponentenarchitektur für ein neues Feature entwerfen
- Performance-Probleme debuggen (unnötige Re-Renders)
- Zwischen lokalem State, Context und externem State Management wählen
- Custom Hooks schreiben, um Logik zwischen Komponenten zu teilen
- Compound Components, Render Props oder andere Kompositionsmuster implementieren
- Class Components zu Function Components migrieren

## Wann NICHT verwenden
- Next.js App Router Features (Server Components, Server Actions) — Next.js Skill verwenden
- React Native — andere Plattform-Constraints
- Einfache statische UI ohne State — einfach HTML schreiben

## Anweisungen

### State — wo er hingehört

| State-Typ | Wo er hingehört |
|---|---|
| UI-State (offen/geschlossen, ausgewählter Tab) | Lokales `useState` in der Komponente |
| Abgeleitete Daten (gefilterte Liste, berechnete Summe) | `useMemo` — kein State, aus Props/State ableiten |
| Zwischen Geschwister-Komponenten geteilt | Zum gemeinsamen Elternteil hochheben |
| Im Teilbaum geteilt (Theme, Auth, Locale) | Context |
| Server-State (API-Daten) | React Query / SWR |
| Komplexer Client-State mit vielen Interaktionen | Zustand / Jotai |

**Standard: lokaler State.** Nur hochheben wenn mehrere Komponenten ihn brauchen.

### Custom Hooks — die richtige Abstraktion

Logik in einen Custom Hook extrahieren, wenn dieselbe stateful Logik in 2+ Komponenten vorkommt:

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

### Context — nur für wirklich globale Daten

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

// Immer gegen fehlenden Provider absichern
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
```

**Context-Anti-Patterns vermeiden:**
- Nicht alles in einen einzigen riesigen Context packen — nach Zuständigkeiten aufteilen
- Keine schnell wechselnden Werte (Mausposition, Scroll) in Context — verursacht Re-Renders bei allen Konsumenten
- Context nicht als Ersatz für echtes State Management im großen Maßstab verwenden

### Performance — unnötige Re-Renders beheben

```typescript
// 1. memo — Re-Render überspringen wenn Props sich nicht geändert haben
const UserCard = memo(({ user }: { user: User }) => {
  return <div>{user.name}</div>
})

// 2. useMemo — teure Berechnungen memoïsieren
const sortedItems = useMemo(
  () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
  [items] // nur neu berechnen wenn items sich ändert
)

// 3. useCallback — stabile Funktionsreferenz für Kind-Props
const handleSubmit = useCallback(async (data: FormData) => {
  await api.submit(data)
  refetch()
}, [refetch]) // stabil wenn refetch stabil ist

// 4. Lazy Loading
const HeavyChart = lazy(() => import('./HeavyChart'))

function Dashboard() {
  return (
    <Suspense fallback={<Skeleton />}>
      <HeavyChart />
    </Suspense>
  )
}
```

**Wie man findet, was re-rendert:**
- React DevTools Profiler → aufzeichnen → klicken → sehen welche Komponenten rendern und warum
- Temporär `console.log('render', componentName)` hinzufügen
- `why-did-you-render` Bibliothek für detaillierte Re-Render-Gründe

**Wann NICHT memoïsieren:** Memoïsierung hat Overhead. Nur `memo`/`useMemo`/`useCallback` hinzufügen, wenn bestätigt wurde, dass eine Komponente zu oft re-rendert und das tatsächliche Langsamkeit verursacht.

### Kompositionsmuster für Komponenten

**Compound Components (verwandte Komponenten die State teilen):**
```typescript
// Statt: <Select value={val} options={opts} onChange={fn} />
// Compound Components für komplexe UIs verwenden:

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

// Verwendung:
<Select value={selected} onChange={setSelected}>
  <Select.Option value="a">Option A</Select.Option>
  <Select.Option value="b">Option B</Select.Option>
</Select>
```

**Render Props / Children als Funktion:**
```typescript
function DataFetcher<T>({ url, children }: {
  url: string
  children: (data: T | null, loading: boolean, error: Error | null) => ReactNode
}) {
  const { data, loading, error } = useAsync(() => fetch(url).then(r => r.json()), [url])
  return <>{children(data, loading, error)}</>
}

// Verwendung:
<DataFetcher url="/api/users">
  {(users, loading, error) => {
    if (loading) return <Spinner />
    if (error) return <ErrorMessage error={error} />
    return <UserList users={users} />
  }}
</DataFetcher>
```

### Häufige Anti-Patterns

**Abgeleiteter State als State (häufigster Fehler):**
```typescript
// Schlecht — fullName ist abgeleitet, braucht keinen State
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const [fullName, setFullName] = useState('')  // ❌

// Gut — ableiten
const fullName = `${firstName} ${lastName}`  // ✅ einfach eine Variable
```

**useEffect für Daten die synchron berechnet werden können:**
```typescript
// Schlecht — useEffect ist von Natur aus asynchron
useEffect(() => {
  setFilteredItems(items.filter(i => i.active))
}, [items])

// Gut — useMemo ist synchron, passiert während des Renderns
const filteredItems = useMemo(
  () => items.filter(i => i.active),
  [items]
)
```

**Veraltete Closures in useEffect:**
```typescript
// Schlecht — count wird zum Zeitpunkt der Effektausführung erfasst
useEffect(() => {
  const interval = setInterval(() => {
    console.log(count) // loggt immer den Anfangswert!
  }, 1000)
  return () => clearInterval(interval)
}, []) // ❌ count fehlt in den Abhängigkeiten

// Gut — Ref für Werte verwenden die sich ändern aber kein Re-Render auslösen sollen
const countRef = useRef(count)
countRef.current = count  // immer aktuell

useEffect(() => {
  const interval = setInterval(() => {
    console.log(countRef.current) // immer aktuell
  }, 1000)
  return () => clearInterval(interval)
}, []) // ✅ Intervall wird nur einmal erstellt
```

### State Management mit Zustand

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
    { name: 'cart' } // wird in localStorage persistiert
  )
)
```

## Beispiel

**Benutzer:** Eine Produktfilter-Komponente rendert zu oft und verlangsamt eine Liste mit 500 Einträgen.

**Erwartete Analyse und Lösung:**
- Die Element-Komponente in `memo` einwickeln — Elemente rendern nur wenn ihre eigenen Props sich ändern
- Filter-State hochheben und die Filter-Funktion in `useCallback` einwickeln
- `useMemo` für die gefilterte + sortierte Listenberechnung verwenden
- Liste mit `@tanstack/virtual` virtualisieren wenn nach der Memoïsierung noch langsam

---
