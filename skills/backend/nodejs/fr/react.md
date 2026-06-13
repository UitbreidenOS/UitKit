---
name: react
description: "React patterns: hooks, context, performance optimisation, component composition, state management, common anti-patterns"
---

> 🇫🇷 Version française. [English version](../react.md).

# Compétence React

## Quand l'activer
- Concevoir l'architecture de composants pour une nouvelle fonctionnalité
- Déboguer des problèmes de performance (re-rendus inutiles)
- Choisir entre état local, context et gestion d'état externe
- Écrire des custom hooks pour partager de la logique entre composants
- Implémenter des compound components, render props ou d'autres patterns de composition
- Migrer des class components vers des function components

## Quand NE PAS utiliser
- Fonctionnalités Next.js App Router (Server Components, Server Actions) — utiliser la compétence Next.js
- React Native — contraintes de plateforme différentes
- Interface statique simple sans état — écrire du HTML directement

## Instructions

### État — où le placer

| Type d'état | Où le placer |
|---|---|
| État UI (ouvert/fermé, onglet sélectionné) | `useState` local dans le composant |
| Données dérivées (liste filtrée, total calculé) | `useMemo` — pas d'état, dériver depuis les props/state |
| Partagé entre composants frères | Remonter vers le parent commun |
| Partagé dans un sous-arbre (thème, auth, locale) | Context |
| État serveur (données API) | React Query / SWR |
| État client complexe avec de nombreuses interactions | Zustand / Jotai |

**Préférer l'état local.** Ne remonter que quand plusieurs composants en ont besoin.

### Custom hooks — la bonne abstraction

Extraire la logique dans un custom hook quand la même logique avec état apparaît dans 2+ composants :

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

### Context — uniquement pour les données vraiment globales

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

// Toujours se protéger contre un provider manquant
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
```

**Anti-patterns Context à éviter :**
- Ne pas tout mettre dans un seul grand context — diviser par domaine
- Ne pas y mettre des valeurs qui changent rapidement (position de la souris, scroll) — cause des re-rendus pour tous les consommateurs
- Ne pas utiliser le context comme substitut à une vraie gestion d'état à grande échelle

### Performance — corriger les re-rendus inutiles

```typescript
// 1. memo — ignorer le re-rendu si les props n'ont pas changé
const UserCard = memo(({ user }: { user: User }) => {
  return <div>{user.name}</div>
})

// 2. useMemo — mémoïser des calculs coûteux
const sortedItems = useMemo(
  () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
  [items] // recalculer uniquement quand items change
)

// 3. useCallback — référence de fonction stable pour les props enfant
const handleSubmit = useCallback(async (data: FormData) => {
  await api.submit(data)
  refetch()
}, [refetch]) // stable si refetch est stable

// 4. Chargement paresseux
const HeavyChart = lazy(() => import('./HeavyChart'))

function Dashboard() {
  return (
    <Suspense fallback={<Skeleton />}>
      <HeavyChart />
    </Suspense>
  )
}
```

**Comment détecter ce qui re-rend :**
- React DevTools Profiler → enregistrer → interagir → voir quels composants s'affichent et pourquoi
- Ajouter `console.log('render', componentName)` temporairement
- Bibliothèque `why-did-you-render` pour les raisons détaillées de re-rendu

**Quand NE PAS mémoïser :** la mémoïsation a un coût. N'ajouter `memo`/`useMemo`/`useCallback` que lorsque vous avez confirmé qu'un composant se re-rend trop souvent et que cela cause une vraie lenteur.

### Patterns de composition de composants

**Compound components (composants liés qui partagent un état) :**
```typescript
// Au lieu de : <Select value={val} options={opts} onChange={fn} />
// Utiliser des compound components pour les UI complexes :

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

// Utilisation :
<Select value={selected} onChange={setSelected}>
  <Select.Option value="a">Option A</Select.Option>
  <Select.Option value="b">Option B</Select.Option>
</Select>
```

**Render props / children comme fonction :**
```typescript
function DataFetcher<T>({ url, children }: {
  url: string
  children: (data: T | null, loading: boolean, error: Error | null) => ReactNode
}) {
  const { data, loading, error } = useAsync(() => fetch(url).then(r => r.json()), [url])
  return <>{children(data, loading, error)}</>
}

// Utilisation :
<DataFetcher url="/api/users">
  {(users, loading, error) => {
    if (loading) return <Spinner />
    if (error) return <ErrorMessage error={error} />
    return <UserList users={users} />
  }}
</DataFetcher>
```

### Anti-patterns courants

**État dérivé stocké dans un état (l'erreur la plus courante) :**
```typescript
// Mauvais — fullName est dérivé, n'a pas besoin d'être dans un état
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const [fullName, setFullName] = useState('')  // ❌

// Bien — le dériver
const fullName = `${firstName} ${lastName}`  // ✅ juste une variable
```

**useEffect pour des données calculables de façon synchrone :**
```typescript
// Mauvais — useEffect est asynchrone par nature
useEffect(() => {
  setFilteredItems(items.filter(i => i.active))
}, [items])

// Bien — useMemo est synchrone, s'exécute pendant le rendu
const filteredItems = useMemo(
  () => items.filter(i => i.active),
  [items]
)
```

**Closures périmées dans useEffect :**
```typescript
// Mauvais — count est capturé au moment où l'effet s'exécute
useEffect(() => {
  const interval = setInterval(() => {
    console.log(count) // affiche toujours la valeur initiale !
  }, 1000)
  return () => clearInterval(interval)
}, []) // ❌ count manque dans les dépendances

// Bien — utiliser une ref pour des valeurs qui changent sans déclencher de re-rendu
const countRef = useRef(count)
countRef.current = count  // toujours à jour

useEffect(() => {
  const interval = setInterval(() => {
    console.log(countRef.current) // toujours à jour
  }, 1000)
  return () => clearInterval(interval)
}, []) // ✅ l'intervalle est créé une seule fois
```

### Gestion d'état avec Zustand

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
    { name: 'cart' } // persiste dans localStorage
  )
)
```

## Exemple

**Utilisateur :** Un composant de filtre produit se re-rend trop souvent et ralentit une liste de 500 éléments.

**Analyse et correction attendues :**
- Envelopper le composant d'élément dans `memo` — les éléments se re-rendent uniquement quand leurs propres props changent
- Remonter l'état du filtre et envelopper la fonction de filtre dans `useCallback`
- Utiliser `useMemo` pour le calcul de la liste filtrée + triée
- Virtualiser la liste avec `@tanstack/virtual` si encore lente après la mémoïsation

---
