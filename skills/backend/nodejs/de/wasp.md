---
name: wasp
description: "Wasp framework: declarative full-stack config (React + Node.js + Prisma in one .wasp file), Open SaaS boilerplate, AI-legible architecture"
---

> 🇩🇪 Deutsche Version. [Englische Version](../wasp.md).

# Wasp Skill

## Wann aktivieren
- Bootstrapping eines Full-Stack-SaaS mit minimalem Konfigurationsaufwand
- Verwendung des Open SaaS-Boilerplates (Stripe, Auth, Dashboard inklusive)
- Arbeit in einem Wasp-Projekt — Verständnis der .wasp-Dateistruktur, Routen, Actions, Queries
- Erklärung, warum Wasp für KI-generierte Codebasen besonders geeignet ist

## Wann NICHT verwenden
- Etablierte Next.js- oder andere Framework-Projekte — Wasp erfordert einen Neustart
- Wenn benutzerdefinierte Infrastrukturkontrolle benötigt wird, die in Wasp nicht verfügbar ist
- Nicht-JavaScript-Projekte

## Warum Wasp für die KI-Generierung

Die Forschung identifiziert Wasp als einzigartigen Architekturvorteil: die **gesamte Anwendung — React-Frontend, Node.js-Backend, Prisma-DB-Schema, Auth, Routing** — wird in einer einzigen `main.wasp`-Datei deklariert. Claude kann den gesamten Architekturzustand einer Anwendung in **einem einzigen Lesevorgang** erfassen, wodurch Umleitungsfehler bei Multi-Datei-Konfigurationen eliminiert werden. Deshalb reduziert Wasp Halluzinationen bei der Generierung erheblich.

## Anweisungen

### Installation

```bash
curl -sSL https://get.wasp-lang.dev/installer.sh | sh
wasp new my-saas
cd my-saas
wasp start
```

### Die main.wasp-Datei — die einzige Quelle der Wahrheit

```wasp
// main.wasp — gesamte App-Architektur hier deklariert

app MyApp {
  wasp: { version: "^0.15.0" },
  title: "My SaaS",
  head: [
    "<meta name='description' content='My SaaS app' />"
  ],

  // Auth-Konfiguration
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

  // E-Mail-Versand
  emailSender: {
    provider: SendGrid,
    defaultFrom: { name: "My SaaS", email: "noreply@myapp.com" },
  },

  // Zahlung mit Stripe
  server: {
    setupFn: import { serverSetup } from "@src/serverSetup",
  },
}

// Datenbankentitäten
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

// Routen (React-Seiten)
route LoginRoute { path: "/login", to: LoginPage }
route DashboardRoute { path: "/dashboard", to: DashboardPage }
route TasksRoute { path: "/tasks", to: TasksPage }

// Seiten (React-Komponenten)
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

// Server-Actions (Mutationen)
action createTask {
  fn: import { createTask } from "@src/server/actions/tasks",
  entities: [Task],
}

action deleteTask {
  fn: import { deleteTask } from "@src/server/actions/tasks",
  entities: [Task],
}

// Server-Queries (Lesevorgänge)
query getTasks {
  fn: import { getTasks } from "@src/server/queries/tasks",
  entities: [Task],
}

// Hintergrundaufgaben
job sendWeeklyReport {
  executor: PgBoss,
  schedule: { cron: "0 9 * * 1" },  // jeden Montag um 9 Uhr
  fn: import { sendWeeklyReport } from "@src/server/jobs/reports",
  entities: [User, Task],
}
```

### Server-Actions

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

### Server-Queries

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

### Client-Seiten (React)

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

### Open SaaS-Boilerplate

Open SaaS (opensaas.sh) ist der offizielle Wasp-SaaS-Starter — vorkonfiguriert mit:
- Stripe-Abonnements + Webhook-Handling
- E-Mail-Auth + Google OAuth
- Admin-Dashboard
- Blog (Astro)
- Landing Page

```bash
# Von Open SaaS starten
git clone https://github.com/wasp-lang/open-saas.git my-saas
cd my-saas
wasp db migrate-dev
wasp start
```

**Open SaaS-Umgebungsvariablen:**
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

### Wasp-CLI-Befehle

```bash
wasp start              # Entwicklungsserver starten (Frontend + Backend + DB)
wasp db migrate-dev     # Prisma-Migrationen ausführen
wasp db studio          # Prisma Studio öffnen
wasp build              # Produktions-Build
wasp deploy fly launch  # auf Fly.io deployen
wasp deploy fly deploy  # erneut auf Fly.io deployen
```

### Deployment (Fly.io — integrierte Unterstützung)

```bash
# Einmaliges Setup
wasp deploy fly setup my-app --org personal --region lhr

# Deployen
wasp deploy fly deploy

# Wasp übernimmt: Dockerfile-Generierung, Fly-Konfiguration, DB-Migration beim Deployment
```

## Beispiel

**Benutzer:** Ein Abonnement-Tier-System zu einer Wasp-App hinzufügen — kostenlose Benutzer erhalten 10 Aufgaben, Pro-Benutzer erhalten unbegrenzte Aufgaben — mit Stripe-Checkout und Webhook-Handling.

**Erwartete Ausgabe:**
- `main.wasp`-Ergänzungen: `SubscriptionTier`-Entität, `createCheckoutSession`-Action, `getSubscriptionStatus`-Query
- `src/server/actions/stripe.ts` — `createCheckoutSession` mit Stripe SDK
- `src/server/api/stripeWebhook.ts` — Webhook-Handler für `checkout.session.completed`
- `src/client/pages/Billing.tsx` — Upgrade-Button, der `createCheckoutSession` aufruft
- Task-Erstellungs-Action, die `user.subscriptionStatus` prüft, bevor mehr als 10 Tasks erlaubt werden

---

> **Arbeiten Sie mit uns:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
