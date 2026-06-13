---
name: vue
description: "Vue 3 patterns: Composition API, composables, Pinia state, Vue Router, async components, performance, TypeScript with Vue"
---

> 🇪🇸 Versión en español. [Versión en inglés](../vue.md).

# Skill Vue

## Cuándo activar
- Construir componentes Vue 3 con la Composition API
- Escribir composables para compartir lógica reactiva
- Configurar Pinia para la gestión de estado
- Configurar Vue Router con navigation guards
- Usar la sintaxis `<script setup>`
- Optimizar el rendimiento de componentes Vue
- Usar TypeScript con Vue 3

## Cuándo NO usar
- Proyectos Vue 2 / Options API — algunos patrones difieren significativamente
- Proyectos React — usar el skill de React
- Patrones específicos de Nuxt.js (SSR, enrutamiento basado en archivos) — anotar las diferencias donde apliquen

## Instrucciones

### Composition API con `<script setup>`

```vue
<!-- UserProfile.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

// Props con TypeScript
const props = defineProps<{
  userId: string
  showActions?: boolean
}>()

// Emits
const emit = defineEmits<{
  (e: 'updated', user: User): void
  (e: 'deleted', userId: string): void
}>()

// Estado reactivo
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

// Ciclo de vida
onMounted(() => {
  document.title = `User: ${props.userId}`
})

// Métodos
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

### Composables — lógica reactiva reutilizable

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

// Uso
const { data: users, loading, execute: fetchUsers } = useAsync(() => api.getUsers())
onMounted(fetchUsers)
```

### Pinia — gestión de estado

```typescript
// stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Setup store (estilo Composition API — recomendado)
export const useUserStore = defineStore('user', () => {
  // Estado
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)

  // Getters (computed)
  const isAuthenticated = computed(() => currentUser.value !== null)
  const displayName = computed(() =>
    currentUser.value?.name ?? currentUser.value?.email ?? 'Guest'
  )

  // Acciones
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
  persist: true,  // pinia-plugin-persistedstate: persistir en localStorage
})

// Uso en un componente
const userStore = useUserStore()
const { isAuthenticated, displayName } = storeToRefs(userStore)  // refs reactivas
await userStore.login(email, password)
```

### Vue Router — navegación y guards

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/HomeView.vue'),  // carga diferida
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

// Navigation guard global
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

### Componentes asíncronos y Suspense

```vue
<!-- Cargar componentes pesados de forma diferida -->
<script setup>
import { defineAsyncComponent } from 'vue'

const HeavyChart = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  loadingComponent: ChartSkeleton,
  errorComponent: ErrorDisplay,
  delay: 200,      // mostrar carga solo si tarda > 200ms
  timeout: 10000,  // error si tarda > 10s
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

### Patrones de rendimiento

```vue
<script setup>
import { shallowRef, markRaw } from 'vue'

// shallowRef — no rastrear profundamente objetos grandes
const bigDataset = shallowRef<Row[]>([])

// markRaw — desactivar la reactividad para objetos no reactivos (instancias de clases, etc.)
const chartInstance = markRaw(new ChartLibrary())

// v-memo — omitir el re-renderizado si el valor no ha cambiado
// Útil en listas largas donde algunos elementos no cambian
</script>

<template>
  <!-- v-once: renderizar una vez, nunca actualizar -->
  <StaticHeader v-once />

  <!-- v-memo: re-renderizar solo cuando la selección cambia -->
  <div v-for="item in list" :key="item.id" v-memo="[item.selected]">
    {{ item.name }} {{ item.selected ? '✓' : '' }}
  </div>
</template>
```

### Integración con TypeScript

```typescript
// types/index.ts — declarar tipos de props de componente globalmente
export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
}

// Componente con props genéricas
// UserList.vue
<script setup lang="ts" generic="T extends { id: string }">
const props = defineProps<{
  items: T[]
  selected?: T
}>()
const emit = defineEmits<{ select: [item: T] }>()
</script>

// Provide/Inject con tipos
// Padre
const key = Symbol() as InjectionKey<UserService>
provide(key, userService)

// Hijo
const userService = inject(key)  // tipado como UserService | undefined
```

### Patrones de template comunes

```vue
<template>
  <!-- abreviatura v-model -->
  <input v-model="searchQuery" />
  <!-- equivalente a: :value="searchQuery" @input="searchQuery = $event.target.value" -->

  <!-- modificadores v-model -->
  <input v-model.trim="name" />       <!-- eliminar espacios en blanco automáticamente -->
  <input v-model.number="age" />      <!-- convertir automáticamente a número -->
  <input v-model.lazy="email" />      <!-- actualizar al perder el foco, no en cada pulsación -->

  <!-- Componente dinámico -->
  <component :is="currentView" v-bind="viewProps" />

  <!-- Slots con datos con scope -->
  <DataTable :rows="users">
    <template #cell-name="{ row }">
      <a :href="`/users/${row.id}`">{{ row.name }}</a>
    </template>
  </DataTable>
</template>
```

## Ejemplo

**Usuario:** Construir una página de lista de productos paginada con búsqueda, filtro por categoría y un carrito almacenado en Pinia — los productos seleccionados sobreviven a una recarga de página.

**Resultado esperado:**
- `stores/cart.ts` — Pinia setup store con `persist: true`, `addItem`, `removeItem`, getter `total`
- `composables/useProducts.ts` — composable `useAsync` + `usePagination`
- `views/ProductsView.vue` — `<script setup>`, estado de búsqueda/filtro, cuadrícula de productos, cargar más
- `components/ProductCard.vue` — emite `add-to-cart`, recibe prop de producto con tipo
- Ruta Vue Router con `meta: { title: 'Products' }` y un navigation guard que establece `document.title`

---
