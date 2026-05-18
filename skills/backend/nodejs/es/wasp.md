---
name: wasp
description: "Wasp framework: declarative full-stack config (React + Node.js + Prisma in one .wasp file), Open SaaS boilerplate, AI-legible architecture"
---

> 🇪🇸 Versión en español. [Versión en inglés](../wasp.md).

# Skill Wasp

## Cuándo activar
- Iniciar un SaaS full-stack con mínima sobrecarga de configuración
- Usar el boilerplate Open SaaS (Stripe, auth, dashboard incluidos)
- Trabajar en un proyecto Wasp — entender la estructura del archivo .wasp, rutas, actions, queries
- Explicar por qué Wasp es especialmente adecuado para bases de código generadas por IA

## Cuándo NO usar
- Proyectos establecidos con Next.js u otros frameworks — Wasp requiere empezar desde cero
- Cuando se necesita control de infraestructura personalizado no disponible en Wasp
- Proyectos no-JavaScript

## Por qué Wasp para la generación con IA

La investigación identifica a Wasp con una ventaja arquitectónica única: **toda la aplicación — frontend React, backend Node.js, esquema de base de datos Prisma, auth, enrutamiento** — se declara en un único archivo `main.wasp`. Claude puede ingerir el estado arquitectónico completo de una aplicación en **una sola operación de lectura**, eliminando los errores de indirección que afectan a las configuraciones de múltiples archivos. Por eso Wasp reduce drásticamente las alucinaciones durante la generación.

## Instrucciones

### Instalación

```bash
curl -sSL https://get.wasp-lang.dev/installer.sh | sh
wasp new my-saas
cd my-saas
wasp start
```

### El archivo main.wasp — la única fuente de verdad

```wasp
// main.wasp — toda la arquitectura de la app declarada aquí

app MyApp {
  wasp: { version: "^0.15.0" },
  title: "My SaaS",
  head: [
    "<meta name='description' content='My SaaS app' />"
  ],

  // Configuración de autenticación
  auth: {
    userEntity: User,
    methods: {
      email: {
        fromField: { name: "My SaaS", email: "hello@myapp.com" },
        emailVerification: { clientRoute: EmailVerificationRoute },
        passwordReset: { clientRoute: PasswordResetRoute },
      },
      google: {},
      github: {},
    },
    onAuthFailedRedirectTo: "/login",
    onAuthSucceededRedirectTo: "/dashboard",
  },

  // Envío de correo electrónico
  emailSender: {
    provider: SendGrid,
    defaultFrom: { name: "My SaaS", email: "noreply@myapp.com" },
  },

  // Pago con Stripe
  server: {
    setupFn: import { serverSetup } from "@src/serverSetup",
  },
}

// Entidades de base de datos
entity User {=psl
  id          String   @id @default(cuid())
  email       String   @unique
  username    String?
  createdAt   DateTime @default(now())
  subscriptionStatus String @default("free")
  tasks       Task[]
psl=}

entity Task {=psl
  id          String  @id @default(cuid())
  description String
  isDone      Boolean @default(false)
  user        User    @relation(fields: [userId], references: [id])
  userId      String
psl=}

// Rutas (páginas React)
route LoginRoute { path: "/login", to: LoginPage }
route DashboardRoute { path: "/dashboard", to: DashboardPage }
route TasksRoute { path: "/tasks", to: TasksPage }

// Páginas (componentes React)
page LoginPage {
  component: import { LoginPage } from "@src/client/pages/Login"
}

page DashboardPage {
  authRequired: true,
  component: import { DashboardPage } from "@src/client/pages/Dashboard"
}

page TasksPage {
  authRequired: true,
  component: import { TasksPage } from "@src/client/pages/Tasks"
}

// Actions del servidor (mutaciones)
action createTask {
  fn: import { createTask } from "@src/server/actions/tasks",
  entities: [Task],
}

action deleteTask {
  fn: import { deleteTask } from "@src/server/actions/tasks",
  entities: [Task],
}

// Queries del servidor (lecturas)
query getTasks {
  fn: import { getTasks } from "@src/server/queries/tasks",
  entities: [Task],
}

// Tareas en segundo plano
job sendWeeklyReport {
  executor: PgBoss,
  schedule: { cron: "0 9 * * 1" },  // todos los lunes a las 9am
  fn: import { sendWeeklyReport } from "@src/server/jobs/reports",
  entities: [User, Task],
}
```

### Actions del servidor

```typescript
// src/server/actions/tasks.ts
import type { CreateTask, DeleteTask } from 'wasp/server/operations'
import type { Task } from 'wasp/entities'
import { HttpError } from 'wasp/server'

type CreateTaskInput = { description: string }

export const createTask: CreateTask<CreateTaskInput, Task> = async (args, context) => {
  if (!context.user) throw new HttpError(401)

  return context.entities.Task.create({
    data: {
      description: args.description,
      user: { connect: { id: context.user.id } },
    },
  })
}

export const deleteTask: DeleteTask<{ id: string }, Task> = async (args, context) => {
  if (!context.user) throw new HttpError(401)

  const task = await context.entities.Task.findUnique({ where: { id: args.id } })
  if (!task || task.userId !== context.user.id) throw new HttpError(403)

  return context.entities.Task.delete({ where: { id: args.id } })
}
```

### Queries del servidor

```typescript
// src/server/queries/tasks.ts
import type { GetTasks } from 'wasp/server/operations'
import type { Task } from 'wasp/entities'

export const getTasks: GetTasks<void, Task[]> = async (_args, context) => {
  if (!context.user) throw new HttpError(401, 'Unauthorized')

  return context.entities.Task.findMany({
    where: { userId: context.user.id },
    orderBy: { createdAt: 'desc' },
  })
}
```

### Páginas del cliente (React)

```tsx
// src/client/pages/Tasks.tsx
import { useQuery, useAction } from 'wasp/client/operations'
import { getTasks, createTask, deleteTask } from 'wasp/client/operations'
import { useAuth } from 'wasp/client/auth'

export function TasksPage() {
  const { data: user } = useAuth()
  const { data: tasks, isLoading } = useQuery(getTasks)
  const createTaskFn = useAction(createTask)
  const deleteTaskFn = useAction(deleteTask)

  const handleCreate = async (description: string) => {
    await createTaskFn({ description })
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h1>Tasks for {user?.email}</h1>
      <ul>
        {tasks?.map(task => (
          <li key={task.id}>
            {task.description}
            <button onClick={() => deleteTaskFn({ id: task.id })}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

### Boilerplate Open SaaS

Open SaaS (opensaas.sh) es el starter SaaS oficial de Wasp — preconfigurado con:
- Suscripciones Stripe + manejo de webhooks
- Auth por correo electrónico + Google OAuth
- Panel de administración
- Blog (Astro)
- Página de inicio

```bash
# Empezar desde Open SaaS
git clone https://github.com/wasp-lang/open-saas.git my-saas
cd my-saas
wasp db migrate-dev
wasp start
```

**Variables de entorno de Open SaaS:**
```bash
# .env.server
DATABASE_URL=postgresql://...
STRIPE_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SENDGRID_API_KEY=SG....
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# .env.client
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Comandos de la CLI de Wasp

```bash
wasp start              # iniciar servidor de desarrollo (frontend + backend + DB)
wasp db migrate-dev     # ejecutar migraciones de Prisma
wasp db studio          # abrir Prisma Studio
wasp build              # build de producción
wasp deploy fly launch  # desplegar en Fly.io
wasp deploy fly deploy  # volver a desplegar en Fly.io
```

### Despliegue (Fly.io — soporte integrado)

```bash
# Configuración única
wasp deploy fly setup my-app --org personal --region lhr

# Desplegar
wasp deploy fly deploy

# Wasp gestiona: generación de Dockerfile, configuración de Fly, migración de DB al desplegar
```

## Ejemplo

**Usuario:** Añadir un sistema de niveles de suscripción a una app Wasp — los usuarios gratuitos obtienen 10 tareas, los usuarios pro obtienen tareas ilimitadas — con checkout de Stripe y manejo de webhooks.

**Salida esperada:**
- Adiciones a `main.wasp`: entidad `SubscriptionTier`, action `createCheckoutSession`, query `getSubscriptionStatus`
- `src/server/actions/stripe.ts` — `createCheckoutSession` usando el SDK de Stripe
- `src/server/api/stripeWebhook.ts` — manejador de webhook para `checkout.session.completed`
- `src/client/pages/Billing.tsx` — botón de actualización que llama a `createCheckoutSession`
- Action de creación de tarea que comprueba `user.subscriptionStatus` antes de permitir más de 10 tareas

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
