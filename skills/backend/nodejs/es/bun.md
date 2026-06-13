---
name: bun
description: "Runtime Bun: construir APIs rápidas compatibles con Node.js con el servidor integrado de Bun, empaquetador, ejecutor de pruebas y administrador de paquetes — framework Elysia, SQLite y patrones optimizados para edge"
---

# Skill Bun

## Cuándo activar
- Construir una nueva API o servicio con Bun como runtime
- Usar framework Elysia (el equivalente Hono/Express para Bun)
- Migrar una aplicación Node.js a Bun para ganancias de desempeño
- Usar SQLite integrado de Bun para bases de datos edge o integradas
- Configurar el ejecutor de pruebas integrado de Bun (sin Jest necesario)

## Cuándo NO usar
- Cloudflare Workers — usar la habilidad hono (Bun se ejecuta en servidores, no en edge de Cloudflare)
- Proyectos Next.js — Next.js usa Node.js; la compatibilidad de Bun está mejorando pero no está completa
- Proyectos con addons nativos de Node.js que aún no soportan Bun

## Instrucciones

### Configuración de proyecto

```bash
# Instalar Bun
curl -fsSL https://bun.sh/install | bash

# Crear un nuevo proyecto
mkdir my-api && cd my-api
bun init               # crea package.json, index.ts, tsconfig.json

# O andamiar con Elysia
bun create elysia my-api
cd my-api && bun install

# Ejecutar
bun run index.ts       # o: bun index.ts
bun --watch index.ts   # recarga en caliente

# Gestión de paquetes (reemplazo npm drop-in, 10-100x más rápido)
bun install            # instalar desde package.json
bun add express        # agregar un paquete
bun remove express     # eliminar un paquete
bun update             # actualizar todos
```

### Servidor HTTP nativo de Bun

```typescript
Construir un servidor HTTP de Bun para [caso de uso].

// index.ts — servidor integrado de Bun (sin framework necesario para APIs simples)
const server = Bun.serve({
  port: 3000,
  hostname: '0.0.0.0',

  async fetch(req) {
    const url = new URL(req.url)

    // Manejo de rutas
    if (url.pathname === '/health') {
      return Response.json({ status: 'ok', uptime: process.uptime() })
    }

    if (url.pathname === '/api/users' && req.method === 'GET') {
      const users = await getUsers()
      return Response.json(users)
    }

    if (url.pathname === '/api/users' && req.method === 'POST') {
      const body = await req.json()
      const user = await createUser(body)
      return Response.json(user, { status: 201 })
    }

    return new Response('No encontrado', { status: 404 })
  },

  error(error) {
    console.error(error)
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 })
  },
})

console.log(`Escuchando en http://localhost:${server.port}`)
```

### Framework Elysia

```typescript
Construir una API de Elysia para [servicio].

Elysia es el framework web idiomático de Bun — type-safe, rápido, minimalista.

npm install elysia @elysiajs/swagger

// app.ts
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

const app = new Elysia()
  .use(swagger())           // auto-genera Swagger UI en /swagger
  
  // Definir rutas con seguridad de tipo completa
  .get('/health', () => ({ status: 'ok' }))
  
  // Ruta con parámetro de ruta
  .get('/users/:id', ({ params: { id } }) => {
    return getUserById(id)
  }, {
    params: t.Object({ id: t.String() }),
    response: t.Object({
      id: t.String(),
      name: t.String(),
      email: t.String(),
    })
  })
  
  // Ruta con validación de cuerpo
  .post('/users', async ({ body }) => {
    return createUser(body)
  }, {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      email: t.String({ format: 'email' }),
    })
  })
  
  // Middleware (aplicar a todas las rutas)
  .onBeforeHandle(({ request, set }) => {
    const auth = request.headers.get('Authorization')
    if (!auth?.startsWith('Bearer ')) {
      set.status = 401
      return { error: 'No autorizado' }
    }
  })
  
  .listen(3000)

console.log(`Ejecutándose en ${app.server?.hostname}:${app.server?.port}`)

Generar la aplicación Elysia para mi servicio.
```

### SQLite integrado

```typescript
Usar SQLite integrado de Bun para [caso de uso].

// No se necesita instalación — SQLite está integrado en Bun
import { Database } from 'bun:sqlite'

const db = new Database('myapp.db', { create: true })

// Crear tablas
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// Sentencias preparadas (más rápido, previene inyección SQL)
const insertUser = db.prepare(
  'INSERT INTO users (email, name) VALUES (?, ?) RETURNING *'
)

const getUser = db.prepare(
  'SELECT * FROM users WHERE id = ?'
)

const listUsers = db.prepare(
  'SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?'
)

// Ejecutar
const newUser = insertUser.get('alice@example.com', 'Alice')
const user = getUser.get(1)
const users = listUsers.all(20, 0)

// Transacciones (operaciones atómicas)
const transferPoints = db.transaction((fromId: number, toId: number, points: number) => {
  db.run('UPDATE users SET points = points - ? WHERE id = ?', [points, fromId])
  db.run('UPDATE users SET points = points + ? WHERE id = ?', [points, toId])
})

transferPoints(1, 2, 100)  // atómica — ambas o ninguna

// Cerrar cuando se termine
db.close()
```

### Ejecutor de pruebas de Bun

```typescript
Escribir pruebas para [módulo] usando el ejecutor de pruebas integrado de Bun.

// Sin Jest, Vitest o Mocha necesarios — Bun tiene un ejecutor integrado
// Ejecutar: bun test

import { describe, it, expect, beforeAll, afterAll, mock } from 'bun:test'
import { createUser, getUser } from './users'

describe('Servicio de usuario', () => {
  describe('createUser', () => {
    it('crea un usuario y devuelve un ID', async () => {
      const user = await createUser({ name: 'Alice', email: 'alice@example.com' })
      expect(user.id).toBeString()
      expect(user.name).toBe('Alice')
    })

    it('lanza en correo electrónico duplicado', async () => {
      await createUser({ name: 'Bob', email: 'bob@example.com' })
      expect(
        createUser({ name: 'Bob 2', email: 'bob@example.com' })
      ).rejects.toThrow()
    })
  })
})

// Módulos simulados
const mockEmailService = mock(() => Promise.resolve({ id: 'email-123' }))

// Modo de vigilancia
// bun test --watch

// Cobertura
// bun test --coverage

// Filtrar pruebas
// bun test --testNamePattern "createUser"
```

### Comparativas de desempeño

```bash
# Comparación Bun vs Node.js para tareas comunes:
# Instalación de paquete: bun install es ~10-30x más rápido que npm install
# Ejecución de TypeScript: bun ejecuta .ts directamente, sin paso de compilación
# Tiempo de inicio: ~3-5ms vs ~30-50ms para Node.js
# Rendimiento HTTP: típicamente 2-3x más req/s que Express en Node.js

# Comparar tu servidor Bun:
bun run bench.ts

// bench.ts
const results = await fetch('http://localhost:3000/api/users')
console.time('100 requests')
for (let i = 0; i < 100; i++) {
  await fetch('http://localhost:3000/api/users')
}
console.timeEnd('100 requests')
```

## Ejemplo

**Usuario:** Quiero construir una API REST rápida para un proyecto de fin de semana. ¿Debería usar Bun + Elysia o Node.js + Hono?

**Comparación de Claude:**

Para un proyecto de fin de semana donde quieres velocidad de desarrollo Y desempeño en tiempo de ejecución:

**Usa Bun + Elysia si:**
- Quieres un runtime para todo (administrador de paquetes, empaquetador, ejecutor de pruebas, TypeScript — sin configuración)
- Estás en Mac o Linux (Bun es totalmente soportado; soporte de Windows está mejorando)
- Quieres el startup más rápido y rendimiento posible
- Te gusta la seguridad de tipo de extremo a extremo (la inferencia de tipo de Elysia es excelente)

**Usa Hono + Cloudflare Workers si:**
- Quieres despliegue global en edge (Bun se ejecuta en VPS, no en Cloudflare)
- Necesitas KV, D1 o R2 de Cloudflare
- Ya estás familiarizado con la API de Hono

**Para un proyecto de fin de semana: Bun + Elysia gana** — `bun create elysia my-api` te tiene ejecutándose en 30 segundos con recarga en caliente, Swagger integrado y rutas type-safe. Sin ajustes de tsconfig, sin configuración de jest, sin nodemon.

```bash
bun create elysia my-api && cd my-api && bun dev
# Ejecutándose en http://localhost:3000 — eso es todo
```

---
