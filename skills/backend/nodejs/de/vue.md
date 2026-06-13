---
name: vue
description: "Vue 3 patterns: Composition API, composables, Pinia state, Vue Router, async components, performance, TypeScript with Vue"
---

> 🇩🇪 Deutsche Version. [Englische Version](../vue.md).

# Vue Skill

## Wann aktivieren
- Aufbau von Vue 3 Komponenten mit der Composition API
- Schreiben von composables zum Teilen reaktiver Logik
- Einrichten von Pinia für die Zustandsverwaltung
- Konfigurieren von Vue Router mit Navigation Guards
- Verwendung der `<script setup>`-Syntax
- Optimierung der Vue-Komponentenperformance
- Verwendung von TypeScript mit Vue 3

## Wann NICHT verwenden
- Vue 2 / Options API Projekte — einige Muster unterscheiden sich erheblich
- React-Projekte — den React Skill verwenden
- Nuxt.js-spezifische Muster (SSR, dateibasiertes Routing) — Unterschiede dort vermerken, wo sie gelten

## Anweisungen

### Composition API mit `<script setup>`

```vue
<!-- UserProfile.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

// Props mit TypeScript
const props = defineProps<{
  userId: string
  showActions?: boolean
}>()

// Emits
const emit = defineEmits<{
  (e: 'updated', user: User): void
  (e: 'deleted', userId: string): void
}>()

// Reaktiver Zustand
const loading = ref(false)
const user = ref<User | null>(null)
const errorMessage = ref('')

// Computed
const fullName = computed(() =>
  user.value ? `${user.value.firstName} ${user.value.lastName}` : ''
)

// Watchers
watch(() => props.userId, async (newId) => {
  await loadUser(newId)
}, { immediate: true })

// Lifecycle
onMounted(() => {
  document.title = `User: ${props.userId}`
})

// Methoden
async function loadUser(id: string) {
  loading.value = true
  try {
    user.value = await api.getUser(id)
  } catch (err) {
    errorMessage.value = 'Failed to load user'
  } finally {
    loading.value = false
  }
}

async function handleUpdate(data: Partial<User>) {
  const updated = await api.updateUser(props.userId, data)
  user.value = updated
  emit('updated', updated)
}
</script>

<template>
  <div v-if="loading" class="skeleton" />
  <div v-else-if="errorMessage" class="error">{{ errorMessage }}</div>
  <div v-else-if="user" class="profile">
    <h1>{{ fullName }}</h1>
    <button v-if="showActions" @click="handleUpdate({ active: !user.active })">
      {{ user.active ? 'Deactivate' : 'Activate' }}
    </button>
  </div>
</template>
```

### Composables — wiederverwendbare reaktive Logik

```typescript
// composables/useAsync.ts
import { ref, type Ref } from 'vue'

export function useAsync<T>(fn: () => Promise<T>) {
  const data: Ref<T | null> = ref(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)

  async function execute() {
    loading.value = true
    error.value = null
    try {
      data.value = await fn()
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
    } finally {
      loading.value = false
    }
  }

  return { data, error, loading, execute }
}

// composables/usePagination.ts
export function usePagination(fetchFn: (page: number) => Promise<PaginatedResult>) {
  const items = ref([])
  const page = ref(1)
  const hasMore = ref(true)
  const loading = ref(false)

  async function loadMore() {
    if (!hasMore.value || loading.value) return
    loading.value = true
    const result = await fetchFn(page.value)
    items.value.push(...result.data)
    hasMore.value = result.hasMore
    page.value++
    loading.value = false
  }

  return { items, hasMore, loading, loadMore }
}

// Verwendung
const { data: users, loading, execute: fetchUsers } = useAsync(() => api.getUsers())
onMounted(fetchUsers)
```

### Pinia — Zustandsverwaltung

```typescript
// stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Setup Store (Composition API Stil — empfohlen)
export const useUserStore = defineStore('user', () => {
  // Zustand
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)

  // Getter (computed)
  const isAuthenticated = computed(() => currentUser.value !== null)
  const displayName = computed(() =>
    currentUser.value?.name ?? currentUser.value?.email ?? 'Guest'
  )

  // Aktionen
  async function login(email: string, password: string) {
    isLoading.value = true
    try {
      currentUser.value = await api.login(email, password)
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    await api.logout()
    currentUser.value = null
  }

  return { currentUser, isLoading, isAuthenticated, displayName, login, logout }
}, {
  persist: true,  // pinia-plugin-persistedstate: in localStorage persistieren
})

// Verwendung in einer Komponente
const userStore = useUserStore()
const { isAuthenticated, displayName } = storeToRefs(userStore)  // reaktive refs
await userStore.login(email, password)
```

### Vue Router — Navigation und Guards

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/HomeView.vue'),  // lazy load
    },
    {
      path: '/dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      component: () => import('@/views/AdminView.vue'),
      meta: { requiresAuth: true, roles: ['admin'] },
    },
  ],
})

// Globaler Navigation Guard
router.beforeEach((to, from) => {
  const store = useUserStore()

  if (to.meta.requiresAuth && !store.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.roles && !to.meta.roles.includes(store.currentUser?.role)) {
    return { name: 'forbidden' }
  }
})

export default router
```

### Asynchrone Komponenten und Suspense

```vue
<!-- Schwere Komponenten lazy laden -->
<script setup>
import { defineAsyncComponent } from 'vue'

const HeavyChart = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  loadingComponent: ChartSkeleton,
  errorComponent: ErrorDisplay,
  delay: 200,      // Laden nur anzeigen, wenn es > 200ms dauert
  timeout: 10000,  // Fehler wenn es > 10s dauert
})
</script>

<template>
  <Suspense>
    <template #default>
      <HeavyChart :data="chartData" />
    </template>
    <template #fallback>
      <div class="skeleton" />
    </template>
  </Suspense>
</template>
```

### Performance-Muster

```vue
<script setup>
import { shallowRef, markRaw } from 'vue'

// shallowRef — große Objekte nicht tief verfolgen
const bigDataset = shallowRef<Row[]>([])

// markRaw — Reaktivität für nicht-reaktive Objekte deaktivieren (Klasseninstanzen, etc.)
const chartInstance = markRaw(new ChartLibrary())

// v-memo — Neu-Rendern überspringen, wenn der Wert sich nicht geändert hat
// Nützlich in langen Listen, bei denen manche Elemente sich nicht ändern
</script>

<template>
  <!-- v-once: einmal rendern, nie aktualisieren -->
  <StaticHeader v-once />

  <!-- v-memo: nur neu rendern, wenn die Auswahl sich ändert -->
  <div v-for="item in list" :key="item.id" v-memo="[item.selected]">
    {{ item.name }} {{ item.selected ? '✓' : '' }}
  </div>
</template>
```

### TypeScript-Integration

```typescript
// types/index.ts — Komponenten-Prop-Typen global deklarieren
export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
}

// Komponente mit generischen Props
// UserList.vue
<script setup lang="ts" generic="T extends { id: string }">
const props = defineProps<{
  items: T[]
  selected?: T
}>()
const emit = defineEmits<{ select: [item: T] }>()
</script>

// Provide/Inject mit Typen
// Elternteil
const key = Symbol() as InjectionKey<UserService>
provide(key, userService)

// Kind
const userService = inject(key)  // typisiert als UserService | undefined
```

### Häufige Template-Muster

```vue
<template>
  <!-- v-model Kurzschreibweise -->
  <input v-model="searchQuery" />
  <!-- äquivalent zu: :value="searchQuery" @input="searchQuery = $event.target.value" -->

  <!-- v-model Modifikatoren -->
  <input v-model.trim="name" />       <!-- Leerzeichen automatisch entfernen -->
  <input v-model.number="age" />      <!-- automatisch in Zahl konvertieren -->
  <input v-model.lazy="email" />      <!-- bei Blur aktualisieren, nicht bei jedem Tastenanschlag -->

  <!-- Dynamische Komponente -->
  <component :is="currentView" v-bind="viewProps" />

  <!-- Slots mit Scope-Daten -->
  <DataTable :rows="users">
    <template #cell-name="{ row }">
      <a :href="`/users/${row.id}`">{{ row.name }}</a>
    </template>
  </DataTable>
</template>
```

## Beispiel

**Benutzer:** Eine paginierte Produktlistenseite mit Suche, Kategoriefilter und einem in Pinia gespeicherten Warenkorb bauen — ausgewählte Produkte überleben einen Seitenneuladen.

**Erwartete Ausgabe:**
- `stores/cart.ts` — Pinia Setup Store mit `persist: true`, `addItem`, `removeItem`, `total`-Getter
- `composables/useProducts.ts` — `useAsync` + `usePagination` composable
- `views/ProductsView.vue` — `<script setup>`, Such-/Filterzustand, Produktraster, mehr laden
- `components/ProductCard.vue` — emittiert `add-to-cart`, erhält Produkt-Prop mit Typ
- Vue Router Route mit `meta: { title: 'Products' }` und einem Navigation Guard, der `document.title` setzt

---
