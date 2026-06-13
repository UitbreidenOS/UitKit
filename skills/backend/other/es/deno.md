---
name: deno
description: "Tiempo de ejecución Deno 2: TypeScript incorporado, modelo de permisos, configuración deno.json, compatibilidad npm, biblioteca estándar, Deno KV, tiempo de ejecución de borde Deno Deploy, framework Fresh con arquitectura de islas, y pruebas con Deno.test"
---

# Habilidad de Deno 2

## Cuándo activar
- Iniciando un nuevo proyecto TypeScript y evaluando tiempos de ejecución
- Construyendo un servicio sensible a la seguridad donde los permisos granulares importan
- Desplegando a Deno Deploy (borde, distribución global)
- Usando el framework Fresh (framework web de Deno)
- Trabajando con Deno KV (almacén clave-valor incorporado, sin dependencia externa)
- Migrando un pequeño script Node.js a Deno
- El proyecto usa `deno.json` o `import_map.json` en lugar de `package.json`
- El usuario menciona `deno run`, `deno task`, `deno deploy` o importaciones `@std/`

## Cuándo NO usar
- Proyectos ya construidos en Node.js con dependencias de complementos nativos profundos — el costo de migración es alto
- Proyectos Bun — tiempo de ejecución diferente, usa la habilidad bun
- Cloudflare Workers — usa la habilidad hono (Workers tiene su propio tiempo de ejecución)
- Proyectos que requieren paquetes npm con vinculaciones nativas aún no portadas a Deno
- Cuando el equipo no tiene familiaridad con Deno y una fecha límite es ajustada — el ecosistema Node.js es más grande

## Instrucciones

### Configuración del proyecto

```bash
# Instala Deno
curl -fsSL https://deno.land/install.sh | sh    # macOS/Linux
# o: brew install deno

# Verifica
deno --version

# Crea un proyecto
mkdir my-api && cd my-api

# deno.json reemplaza package.json
# Crea manualmente o deja que la primera tarea de deno la cree
```

```jsonc
// deno.json — configuración central, reemplaza package.json + tsconfig.json
{
  "tasks": {
    "dev": "deno run --watch --allow-net --allow-env --allow-read src/main.ts",
    "start": "deno run --allow-net --allow-env --allow-read src/main.ts",
    "test": "deno test --allow-net --allow-env",
    "check": "deno check src/main.ts"
  },
  "imports": {
    // Mapa de importación — alias para importaciones más limpias
    "@std/http": "jsr:@std/http@^1.0.0",
    "@std/path": "jsr:@std/path@^1.0.0",
    "@std/testing": "jsr:@std/testing@^1.0.0",
    "hono": "jsr:@hono/hono@^4.0.0",
    "zod": "npm:zod@^3.22.0"
  },
  "compilerOptions": {
    // TypeScript está incorporado — no se requiere tsconfig.json separado
    "strict": true,
    "lib": ["deno.window"]
  }
}
```

Sin `node_modules`. Sin `tsconfig.json`. Sin `babel.config.js`. TypeScript se ejecuta directamente.

### Modelo de permisos

Deno es denegar-por-defecto. Cada capacidad debe estar explícitamente otorgada al inicio.

```bash
# Banderas de permisos comunes
deno run --allow-net src/main.ts          # todo acceso de red
deno run --allow-net=api.example.com src/main.ts  # solo host específico
deno run --allow-read src/main.ts         # todo acceso de lectura
deno run --allow-read=/tmp src/main.ts    # solo ruta específica
deno run --allow-write=/tmp src/main.ts
deno run --allow-env src/main.ts          # todas variables env
deno run --allow-env=PORT,DATABASE_URL src/main.ts  # solo vars específicas
deno run --allow-run=git src/main.ts      # genera subprocesos
deno run -A src/main.ts                   # todos los permisos (solo dev)

# Los permisos en tareas deno.json se declaran explícitamente
# Nunca uses -A en producción — sé específico sobre qué necesita el programa
```

También puedes declarar permisos en el script mismo (Deno 2):

```typescript
// src/main.ts — permisos declarativos (Deno 2.x)
// Deno pregunta al usuario una vez si los permisos no están ya otorgados
const { granted } = await Deno.permissions.request({ name: 'env', variable: 'DATABASE_URL' })
if (!granted) throw new Error('DATABASE_URL env permission denied')
```

### Compatibilidad npm

Deno 2 soporta paquetes npm directamente — sin paso de instalación.

```typescript
// Usa prefijo npm — Deno descarga y cachea automáticamente
import { z } from 'npm:zod'
import express from 'npm:express@4'
import { PrismaClient } from 'npm:@prisma/client'

// O declara en mapa de importaciones deno.json (preferido):
// "zod": "npm:zod@^3.22.0"
import { z } from 'zod'  // resuelto a través de mapa de importación

// JSR (Registro de JavaScript) — registro moderno nativo de Deno
import { Hono } from 'jsr:@hono/hono'
import { assertEquals } from 'jsr:@std/assert'
```

```bash
# Cachea dependencias sin ejecutar (como npm install para CI)
deno cache src/main.ts

# Verifica dependencias desactualizadas
deno outdated
```

### Biblioteca estándar (@std/)

```typescript
// Servidor HTTP — @std/http
import { serve } from '@std/http'

await serve((req) => {
  const url = new URL(req.url)
  if (url.pathname === '/health') {
    return Response.json({ status: 'ok' })
  }
  return new Response('Not found', { status: 404 })
}, { port: 8000 })

// Utilidades de ruta — @std/path
import { join, dirname, basename, extname } from '@std/path'
const configPath = join(Deno.cwd(), 'config', 'settings.json')

// E/S de archivo (requiere --allow-read / --allow-write)
const text = await Deno.readTextFile(configPath)
const config = JSON.parse(text)
await Deno.writeTextFile('/tmp/output.json', JSON.stringify(config, null, 2))

// Variables de entorno
const port = parseInt(Deno.env.get('PORT') ?? '8000')
const dbUrl = Deno.env.get('DATABASE_URL')
if (!dbUrl) throw new Error('DATABASE_URL is required')
```

### Deno KV

Almacén de clave-valor incorporado. Sin configuración. Funciona localmente y en Deno Deploy.

```typescript
// Sin instalar, sin cadena de conexión necesaria — incorporado en el tiempo de ejecución
const kv = await Deno.openKv()   // SQLite local en dev, gestionado en Deno Deploy

// Las claves son matrices de partes — permite espacios de nombres jerárquicos
await kv.set(['users', 'alice@example.com'], {
  id: 'u_01',
  name: 'Alice',
  email: 'alice@example.com',
  createdAt: new Date().toISOString(),
})

// Obtén
const result = await kv.get<{ name: string }>(['users', 'alice@example.com'])
console.log(result.value?.name)     // 'Alice'
console.log(result.versionstamp)    // para concurrencia optimista

// Enumera con prefijo — escaneo de rango eficiente
const iter = kv.list<User>({ prefix: ['users'] })
const users: User[] = []
for await (const entry of iter) {
  users.push(entry.value)
}

// Transacciones atómicas
const res = await kv.atomic()
  .check({ key: ['sessions', token], versionstamp: null })  // no debe existir
  .set(['sessions', token], { userId: 'u_01', expiresAt: Date.now() + 86400_000 })
  .commit()

if (!res.ok) throw new Error('Session token collision — try again')

// Elimina
await kv.delete(['sessions', token])

// Observa cambios (tiempo real, funciona en Deno Deploy)
const watcher = kv.watch([['users', 'alice@example.com']])
for await (const [entry] of watcher) {
  console.log('User updated:', entry.value)
}
```

### Pruebas

```typescript
// Sin instalación de marco de prueba necesaria — Deno.test está incorporado
// Ejecuta: deno test

import { assertEquals, assertRejects, assertExists } from '@std/assert'

// Prueba básica
Deno.test('adds two numbers', () => {
  assertEquals(1 + 2, 3)
})

// Prueba asíncrona
Deno.test('fetches user from KV', async () => {
  const kv = await Deno.openKv(':memory:')   // en memoria para pruebas
  await kv.set(['users', '1'], { name: 'Alice' })

  const result = await kv.get(['users', '1'])
  assertExists(result.value)
  assertEquals((result.value as { name: string }).name, 'Alice')

  kv.close()
})

// Estilo BDD con @std/testing
import { describe, it, beforeAll, afterAll } from '@std/testing/bdd'
import { assertThrows } from '@std/assert'

describe('UserService', () => {
  let kv: Deno.Kv

  beforeAll(async () => { kv = await Deno.openKv(':memory:') })
  afterAll(() => kv.close())

  it('throws when user not found', async () => {
    await assertRejects(
      () => getUser(kv, 'nonexistent'),
      Error,
      'User not found',
    )
  })
})

// Subconjuntos de prueba y permisos
Deno.test({
  name: 'calls external API',
  permissions: { net: ['api.example.com'] },   // permisos limitados a prueba
  async fn() {
    const res = await fetch('https://api.example.com/ping')
    assertEquals(res.status, 200)
  },
})
```

```bash
deno test                          # ejecuta todas las pruebas
deno test --watch                  # modo de observación
deno test --filter "UserService"   # ejecuta pruebas coincidentes
deno test --coverage=./cov         # genera datos de cobertura
deno coverage ./cov                # mostrar informe de cobertura
deno test --allow-net src/user.test.ts  # archivo específico
```

### Framework Fresh (arquitectura de islas)

```bash
deno run -A -r jsr:@fresh/init my-app
cd my-app && deno task start
```

```
my-app/
├── routes/
│   ├── index.tsx          # página renderizada por servidor en /
│   ├── blog/
│   │   └── [slug].tsx     # ruta dinámica
│   └── api/
│       └── users.ts       # manejador de API (sin JSX)
├── islands/
│   └── Counter.tsx        # componente interactivo del cliente
├── components/
│   └── Button.tsx         # componente solo del servidor (no JS enviado)
├── deno.json
└── main.ts                # punto de entrada
```

```tsx
// routes/index.tsx — renderizado por servidor por defecto (cero JS de cliente)
import type { PageProps } from '$fresh/server.ts'
import Counter from '../islands/Counter.tsx'   // solo esto se convierte en paquete JS

export default function Home({ data }: PageProps) {
  return (
    <main>
      <h1>Hello from Fresh</h1>
      {/* Counter es una "isla" — solo este componente envía JS al navegador */}
      <Counter initialCount={0} />
    </main>
  )
}
```

```tsx
// islands/Counter.tsx — isla interactiva (envía JS al navegador)
import { useSignal } from '@preact/signals'

export default function Counter({ initialCount }: { initialCount: number }) {
  const count = useSignal(initialCount)
  return (
    <button onClick={() => count.value++}>
      Count: {count}
    </button>
  )
}
```

```typescript
// routes/api/users.ts — ruta de API (sin JSX)
import { Handlers } from '$fresh/server.ts'

export const handler: Handlers = {
  async GET(req, ctx) {
    const users = await getUsersFromKv()
    return Response.json({ users })
  },
  async POST(req, ctx) {
    const body = await req.json()
    const user = await createUserInKv(body)
    return Response.json(user, { status: 201 })
  },
}
```

### Deno Deploy

```bash
# Instala deployctl
deno install -A jsr:@deno/deployctl

# Despliegue desde local
deployctl deploy --project=my-api src/main.ts

# O vincula a GitHub — Deno Deploy se implementa automáticamente en push
# Sin Docker, sin contenedores — solo TypeScript
```

```typescript
// main.ts — funciona idéntico localmente y en Deno Deploy
// Deno KV, fetch y Deno.env todos funcionan en Deploy sin cambios
const kv = await Deno.openKv()    // KV gestionado en Deploy, SQLite localmente

Deno.serve({ port: 8000 }, async (req) => {
  const url = new URL(req.url)

  if (url.pathname === '/') {
    const visits = await kv.get<number>(['visits'])
    const count = (visits.value ?? 0) + 1
    await kv.set(['visits'], count)
    return Response.json({ visits: count })
  }

  return new Response('Not found', { status: 404 })
})
```

### Deno vs Node.js — cuándo elegir Deno

Elige Deno cuando:
- **Proyecto TypeScript greenfield** — sin tsconfig, sin paso de construcción, TypeScript funciona de inmediato
- **La seguridad importa** — los permisos explícitos hacen la superficie de ataque auditable; `--allow-net=payments.stripe.com` se auto-documenta
- **Despliegue en borde** — Deno Deploy está propósito-construido; ~300 PoPs, inicio frío en microsegundos
- **Scripts simples** — `deno run https://example.com/script.ts` funciona sin instalar nada
- **Deno KV** — necesita una tienda persistente sin configurar Redis o Postgres para un servicio pequeño

Mantente con Node.js cuando:
- Base de código existente grande con complementos nativos
- Equipo profundo en herramientas del ecosistema Node.js (Jest, Webpack, etc.)
- Los paquetes usados no tienen construcciones compatibles con Deno/npm
- Herramientas de monorepo (Turborepo, Nx) que asumen Node.js

## Ejemplo

**Usuario:** Construye una API REST con Hono en Deno que almacena elementos en Deno KV. Necesita puntos finales CRUD y una prueba.

**Salida esperada:**

```typescript
// deno.json
{
  "tasks": {
    "dev": "deno run --watch --allow-net --allow-env src/main.ts",
    "test": "deno test --allow-env"
  },
  "imports": {
    "hono": "jsr:@hono/hono@^4.0.0",
    "zod": "npm:zod@^3.22.0",
    "@std/assert": "jsr:@std/assert@^1.0.0"
  }
}
```

```typescript
// src/main.ts
import { Hono } from 'hono'
import { z } from 'zod'

const kv = await Deno.openKv()

const app = new Hono()

const ItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().int().positive(),
})

// Enumera todos los elementos
app.get('/items', async (c) => {
  const items: unknown[] = []
  const iter = kv.list({ prefix: ['items'] })
  for await (const entry of iter) {
    items.push(entry.value)
  }
  return c.json({ items })
})

// Obtén un elemento
app.get('/items/:id', async (c) => {
  const result = await kv.get(['items', c.req.param('id')])
  if (!result.value) return c.json({ error: 'Not found' }, 404)
  return c.json(result.value)
})

// Crea elemento
app.post('/items', async (c) => {
  const body = await c.req.json()
  const parsed = ItemSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ errors: parsed.error.flatten().fieldErrors }, 422)
  }
  const id = crypto.randomUUID()
  const item = { id, ...parsed.data }
  await kv.set(['items', id], item)
  return c.json(item, 201)
})

// Elimina elemento
app.delete('/items/:id', async (c) => {
  await kv.delete(['items', c.req.param('id')])
  return new Response(null, { status: 204 })
})

Deno.serve({ port: 8000 }, app.fetch)
```

```typescript
// src/main.test.ts
import { assertEquals } from '@std/assert'
import app from './main.ts'

Deno.test('POST /items creates and GET retrieves', async () => {
  const createRes = await app.fetch(
    new Request('http://localhost/items', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Apples', quantity: 10 }),
    })
  )
  assertEquals(createRes.status, 201)
  const item = await createRes.json()
  assertEquals(item.name, 'Apples')

  const getRes = await app.fetch(new Request(`http://localhost/items/${item.id}`))
  assertEquals(getRes.status, 200)
  const fetched = await getRes.json()
  assertEquals(fetched.quantity, 10)
})
```

Despliegue: `deployctl deploy --project=my-inventory src/main.ts` — distribuido globalmente en segundos, KV replicado automáticamente.

---
