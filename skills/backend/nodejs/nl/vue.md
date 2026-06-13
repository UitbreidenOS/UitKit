---
name: vue
description: "Vue 3 patterns: Composition API, composables, Pinia state, Vue Router, async components, performance, TypeScript with Vue"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../vue.md).

# Vue Skill

## Wanneer activeren
- Vue 3 componenten bouwen met de Composition API
- composables schrijven om reactieve logica te delen
- Pinia instellen voor statusbeheer
- Vue Router configureren met navigation guards
- De `<script setup>`-syntaxis gebruiken
- Vue-componentprestaties optimaliseren
- TypeScript gebruiken met Vue 3

## Wanneer NIET gebruiken
- Vue 2 / Options API projecten — sommige patronen verschillen aanzienlijk
- React projecten — gebruik de React skill
- Nuxt.js-specifieke patronen (SSR, bestandsgebaseerde routing) — noteer de verschillen waar van toepassing

## Instructies

### Composition API met `<script setup>`

```vue
<!-- UserProfile.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

// Props met TypeScript
const props = defineProps<{
  userId: string
  showActions?: boolean
}>()

// Emits
const emit = defineEmits<{
  (e: 'updated', user: User): void
  (e: 'deleted', userId: string): void
}>()

// Reactieve toestand
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

// Levenscyclus
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

### Composables — herbruikbare reactieve logica

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

// Gebruik
const { data: users, loading, execute: fetchUsers } = useAsync(() => api.getUsers())
onMounted(fetchUsers)
```

### Pinia — statusbeheer

```typescript
// stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Setup store (Composition API stijl — aanbevolen)
export const useUserStore = defineStore('user', () => {
  // Toestand
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)

  // Getters (computed)
  const isAuthenticated = computed(() => currentUser.value !== null)
  const displayName = computed(() =>
    currentUser.value?.name ?? currentUser.value?.email ?? 'Guest'
  )

  // Acties
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
  persist: true,  // pinia-plugin-persistedstate: opslaan in localStorage
})

// Gebruik in een component
const userStore = useUserStore()
const { isAuthenticated, displayName } = storeToRefs(userStore)  // reactieve refs
await userStore.login(email, password)
```

### Vue Router — navigatie en guards

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/HomeView.vue'),  // lazy laden
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

// Globale navigation guard
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

### Asynchrone componenten en Suspense

```vue
<!-- Zware componenten lazy laden -->
<script setup>
import { defineAsyncComponent } from 'vue'

const HeavyChart = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  loadingComponent: ChartSkeleton,
  errorComponent: ErrorDisplay,
  delay: 200,      // laden alleen tonen als het > 200ms duurt
  timeout: 10000,  // fout als het > 10s duurt
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

### Prestatiepatronen

```vue
<script setup>
import { shallowRef, markRaw } from 'vue'

// shallowRef — grote objecten niet diep volgen
const bigDataset = shallowRef<Row[]>([])

// markRaw — reactiviteit uitschakelen voor niet-reactieve objecten (klasse-instanties, etc.)
const chartInstance = markRaw(new ChartLibrary())

// v-memo — herrendering overslaan als de waarde niet is veranderd
// Nuttig in lange lijsten waar sommige items niet veranderen
</script>

<template>
  <!-- v-once: één keer renderen, nooit bijwerken -->
  <StaticHeader v-once />

  <!-- v-memo: alleen opnieuw renderen als de selectie verandert -->
  <div v-for="item in list" :key="item.id" v-memo="[item.selected]">
    {{ item.name }} {{ item.selected ? '✓' : '' }}
  </div>
</template>
```

### TypeScript-integratie

```typescript
// types/index.ts — component prop-types globaal declareren
export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
}

// Component met generieke props
// UserList.vue
<script setup lang="ts" generic="T extends { id: string }">
const props = defineProps<{
  items: T[]
  selected?: T
}>()
const emit = defineEmits<{ select: [item: T] }>()
</script>

// Provide/Inject met types
// Ouder
const key = Symbol() as InjectionKey<UserService>
provide(key, userService)

// Kind
const userService = inject(key)  // getypeerd als UserService | undefined
```

### Veelgebruikte template-patronen

```vue
<template>
  <!-- v-model verkorting -->
  <input v-model="searchQuery" />
  <!-- equivalent aan: :value="searchQuery" @input="searchQuery = $event.target.value" -->

  <!-- v-model modifiers -->
  <input v-model.trim="name" />       <!-- witruimte automatisch verwijderen -->
  <input v-model.number="age" />      <!-- automatisch converteren naar getal -->
  <input v-model.lazy="email" />      <!-- bijwerken bij blur, niet bij elke toetsaanslag -->

  <!-- Dynamisch component -->
  <component :is="currentView" v-bind="viewProps" />

  <!-- Slots met scoped data -->
  <DataTable :rows="users">
    <template #cell-name="{ row }">
      <a :href="`/users/${row.id}`">{{ row.name }}</a>
    </template>
  </DataTable>
</template>
```

## Voorbeeld

**Gebruiker:** Een gepagineerde productlijstpagina bouwen met zoeken, categoriefilter en een winkelwagen opgeslagen in Pinia — geselecteerde producten overleven een paginaverversing.

**Verwachte uitvoer:**
- `stores/cart.ts` — Pinia setup store met `persist: true`, `addItem`, `removeItem`, `total`-getter
- `composables/useProducts.ts` — `useAsync` + `usePagination` composable
- `views/ProductsView.vue` — `<script setup>`, zoek-/filterstatus, productraster, meer laden
- `components/ProductCard.vue` — emittert `add-to-cart`, ontvangt product-prop met type
- Vue Router route met `meta: { title: 'Products' }` en een navigation guard die `document.title` instelt

---
