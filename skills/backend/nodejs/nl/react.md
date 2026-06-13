---
name: react
description: "React patterns: hooks, context, performance optimisation, component composition, state management, common anti-patterns"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../react.md).

# React Skill

## Wanneer activeren
- Componentarchitectuur ontwerpen voor een nieuwe functie
- Prestatieproblemen debuggen (onnodige re-renders)
- Kiezen tussen lokale state, context en externe state management
- Custom hooks schrijven om logica tussen componenten te delen
- Compound components, render props of andere compositiepatronen implementeren
- Class components migreren naar function components

## Wanneer NIET gebruiken
- Next.js App Router-functies (Server Components, Server Actions) — gebruik de Next.js skill
- React Native — andere platformbeperkingen
- Eenvoudige statische UI zonder state — schrijf gewoon HTML

## Instructies

### State — waar het hoort

| Type state | Waar het hoort |
|---|---|
| UI-state (open/gesloten, geselecteerd tabblad) | Lokale `useState` in de component |
| Afgeleide gegevens (gefilterde lijst, berekend totaal) | `useMemo` — geen state, afleiden van props/state |
| Gedeeld tussen zustercomponenten | Optillen naar de gemeenschappelijke ouder |
| Gedeeld in een deelboom (thema, auth, locale) | Context |
| Serverstatus (API-gegevens) | React Query / SWR |
| Complexe clientstate met veel interacties | Zustand / Jotai |

**Standaard: lokale state.** Alleen optillen wanneer meerdere componenten het nodig hebben.

### Custom hooks — de juiste abstractie

Logica in een custom hook extraheren wanneer dezelfde stateful logica in 2+ componenten voorkomt:

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

### Context — alleen voor echt globale gegevens

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

// Altijd beschermen tegen ontbrekende provider
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
```

**Context-antipatronen vermijden:**
- Niet alles in één grote context stoppen — opsplitsen per verantwoordelijkheid
- Geen snel veranderende waarden (muispositie, scroll) in context — veroorzaakt re-renders bij alle consumers
- Context niet gebruiken als vervanging voor echte state management op grote schaal

### Prestaties — onnodige re-renders verhelpen

```typescript
// 1. memo — re-render overslaan als props niet zijn veranderd
const UserCard = memo(({ user }: { user: User }) => {
  return <div>{user.name}</div>
})

// 2. useMemo — dure berekeningen memoïseren
const sortedItems = useMemo(
  () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
  [items] // alleen herberekenen als items verandert
)

// 3. useCallback — stabiele functiereferentie voor kind-props
const handleSubmit = useCallback(async (data: FormData) => {
  await api.submit(data)
  refetch()
}, [refetch]) // stabiel als refetch stabiel is

// 4. Lazy loading
const HeavyChart = lazy(() => import('./HeavyChart'))

function Dashboard() {
  return (
    <Suspense fallback={<Skeleton />}>
      <HeavyChart />
    </Suspense>
  )
}
```

**Hoe vind je wat re-rendert:**
- React DevTools Profiler → opnemen → klikken → zien welke componenten renderen en waarom
- Tijdelijk `console.log('render', componentName)` toevoegen
- `why-did-you-render` bibliotheek voor gedetailleerde re-render-redenen

**Wanneer NIET memoïseren:** memoïseren heeft overhead. Voeg `memo`/`useMemo`/`useCallback` alleen toe wanneer je hebt bevestigd dat een component te vaak re-rendert en dat echte traagheid veroorzaakt.

### Componentcompositiepatronen

**Compound components (gerelateerde componenten die state delen):**
```typescript
// In plaats van: <Select value={val} options={opts} onChange={fn} />
// Gebruik compound components voor complexe UI's:

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

// Gebruik:
<Select value={selected} onChange={setSelected}>
  <Select.Option value="a">Option A</Select.Option>
  <Select.Option value="b">Option B</Select.Option>
</Select>
```

**Render props / children als functie:**
```typescript
function DataFetcher<T>({ url, children }: {
  url: string
  children: (data: T | null, loading: boolean, error: Error | null) => ReactNode
}) {
  const { data, loading, error } = useAsync(() => fetch(url).then(r => r.json()), [url])
  return <>{children(data, loading, error)}</>
}

// Gebruik:
<DataFetcher url="/api/users">
  {(users, loading, error) => {
    if (loading) return <Spinner />
    if (error) return <ErrorMessage error={error} />
    return <UserList users={users} />
  }}
</DataFetcher>
```

### Veelvoorkomende antipatronen

**Afgeleide state als state (de meest gemaakte fout):**
```typescript
// Slecht — fullName is afgeleid, heeft geen state nodig
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const [fullName, setFullName] = useState('')  // ❌

// Goed — afleiden
const fullName = `${firstName} ${lastName}`  // ✅ gewoon een variabele
```

**useEffect voor gegevens die synchroon berekend kunnen worden:**
```typescript
// Slecht — useEffect is van nature asynchroon
useEffect(() => {
  setFilteredItems(items.filter(i => i.active))
}, [items])

// Goed — useMemo is synchroon, vindt plaats tijdens het renderen
const filteredItems = useMemo(
  () => items.filter(i => i.active),
  [items]
)
```

**Verouderde closures in useEffect:**
```typescript
// Slecht — count wordt vastgelegd op het moment dat het effect loopt
useEffect(() => {
  const interval = setInterval(() => {
    console.log(count) // logt altijd de beginwaarde!
  }, 1000)
  return () => clearInterval(interval)
}, []) // ❌ count ontbreekt in de afhankelijkheden

// Goed — gebruik een ref voor waarden die veranderen maar geen re-render nodig hebben
const countRef = useRef(count)
countRef.current = count  // altijd actueel

useEffect(() => {
  const interval = setInterval(() => {
    console.log(countRef.current) // altijd actueel
  }, 1000)
  return () => clearInterval(interval)
}, []) // ✅ interval wordt slechts eenmaal aangemaakt
```

### State management met Zustand

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
    { name: 'cart' } // wordt opgeslagen in localStorage
  )
)
```

## Voorbeeld

**Gebruiker:** Een productfiltercomponent rendert te vaak en vertraagt een lijst van 500 items.

**Verwachte analyse en oplossing:**
- De itemcomponent in `memo` wikkelen — items renderen alleen als hun eigen props veranderen
- Filterstate optillen en de filterfunctie in `useCallback` wikkelen
- `useMemo` gebruiken voor de berekening van de gefilterde + gesorteerde lijst
- De lijst virtualiseren met `@tanstack/virtual` als het na memoïsering nog traag is

---
