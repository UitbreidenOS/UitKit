---
name: vue
description: "Vue 3 patterns: Composition API, composables, Pinia state, Vue Router, async components, performance, TypeScript with Vue"
---

> 🇫🇷 Version française. [English version](../vue.md).

# Compétence Vue

## Quand activer
- Construire des composants Vue 3 avec la Composition API
- Écrire des composables pour partager de la logique réactive
- Configurer Pinia pour la gestion d'état
- Configurer Vue Router avec des navigation guards
- Utiliser la syntaxe `<script setup>`
- Optimiser les performances des composants Vue
- Utiliser TypeScript avec Vue 3

## Quand NE PAS utiliser
- Projets Vue 2 / Options API — certains modèles diffèrent significativement
- Projets React — utiliser la compétence React
- Modèles spécifiques à Nuxt.js (SSR, routage basé sur les fichiers) — noter les différences le cas échéant

## Instructions

### Composition API avec `<script setup>`

```vue
<!-- UserProfile.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

// Props avec TypeScript
const props = defineProps<{
  userId: string
  showActions?: boolean
}>()

// Emits
const emit = defineEmits<{
  (e: 'updated', user: User): void
  (e: 'deleted', userId: string): void
}>()

// État réactif
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

// Cycle de vie
onMounted(() => {
  document.title = `User: ${props.userId}`
})

// Méthodes
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

### Composables — logique réactive réutilisable

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

// Utilisation
const { data: users, loading, execute: fetchUsers } = useAsync(() => api.getUsers())
onMounted(fetchUsers)
```

### Pinia — gestion d'état

```typescript
// stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Setup store (style Composition API — recommandé)
export const useUserStore = defineStore('user', () => {
  // État
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)

  // Getters (computed)
  const isAuthenticated = computed(() => currentUser.value !== null)
  const displayName = computed(() =>
    currentUser.value?.name ?? currentUser.value?.email ?? 'Guest'
  )

  // Actions
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
  persist: true,  // pinia-plugin-persistedstate : persister dans localStorage
})

// Utilisation dans un composant
const userStore = useUserStore()
const { isAuthenticated, displayName } = storeToRefs(userStore)  // refs réactives
await userStore.login(email, password)
```

### Vue Router — navigation et guards

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/HomeView.vue'),  // chargement différé
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

// Navigation guard globale
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

### Composants asynchrones et Suspense

```vue
<!-- Charger des composants lourds de façon différée -->
<script setup>
import { defineAsyncComponent } from 'vue'

const HeavyChart = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  loadingComponent: ChartSkeleton,
  errorComponent: ErrorDisplay,
  delay: 200,      // afficher le chargement uniquement si cela prend > 200ms
  timeout: 10000,  // erreur si cela prend > 10s
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

### Modèles de performance

```vue
<script setup>
import { shallowRef, markRaw } from 'vue'

// shallowRef — ne pas suivre profondément les grands objets
const bigDataset = shallowRef<Row[]>([])

// markRaw — désactiver la réactivité pour les objets non-réactifs (instances de classes, etc.)
const chartInstance = markRaw(new ChartLibrary())

// v-memo — ignorer le re-rendu si la valeur n'a pas changé
// Utile dans les longues listes où certains éléments ne changent pas
</script>

<template>
  <!-- v-once : rendre une seule fois, ne jamais mettre à jour -->
  <StaticHeader v-once />

  <!-- v-memo : re-rendre uniquement quand la sélection change -->
  <div v-for="item in list" :key="item.id" v-memo="[item.selected]">
    {{ item.name }} {{ item.selected ? '✓' : '' }}
  </div>
</template>
```

### Intégration TypeScript

```typescript
// types/index.ts — déclarer les types de props de composant globalement
export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
}

// Composant avec props génériques
// UserList.vue
<script setup lang="ts" generic="T extends { id: string }">
const props = defineProps<{
  items: T[]
  selected?: T
}>()
const emit = defineEmits<{ select: [item: T] }>()
</script>

// Provide/Inject avec types
// Parent
const key = Symbol() as InjectionKey<UserService>
provide(key, userService)

// Enfant
const userService = inject(key)  // typé comme UserService | undefined
```

### Modèles de template courants

```vue
<template>
  <!-- raccourci v-model -->
  <input v-model="searchQuery" />
  <!-- équivalent à : :value="searchQuery" @input="searchQuery = $event.target.value" -->

  <!-- modificateurs v-model -->
  <input v-model.trim="name" />       <!-- supprimer automatiquement les espaces -->
  <input v-model.number="age" />      <!-- convertir automatiquement en nombre -->
  <input v-model.lazy="email" />      <!-- mettre à jour au blur, pas à chaque frappe -->

  <!-- Composant dynamique -->
  <component :is="currentView" v-bind="viewProps" />

  <!-- Slots avec données scopées -->
  <DataTable :rows="users">
    <template #cell-name="{ row }">
      <a :href="`/users/${row.id}`">{{ row.name }}</a>
    </template>
  </DataTable>
</template>
```

## Exemple

**Utilisateur :** Construire une page de liste de produits paginée avec recherche, filtre par catégorie, et un panier stocké dans Pinia — les produits sélectionnés survivent à un rechargement de page.

**Résultat attendu :**
- `stores/cart.ts` — Pinia setup store avec `persist: true`, `addItem`, `removeItem`, getter `total`
- `composables/useProducts.ts` — composable `useAsync` + `usePagination`
- `views/ProductsView.vue` — `<script setup>`, état de recherche/filtre, grille de produits, charger plus
- `components/ProductCard.vue` — émet `add-to-cart`, reçoit une prop produit typée
- Route Vue Router avec `meta: { title: 'Products' }` et une navigation guard définissant `document.title`

---
