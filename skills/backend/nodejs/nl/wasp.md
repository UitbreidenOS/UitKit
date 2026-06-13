---
name: wasp
description: "Wasp framework: declarative full-stack config (React + Node.js + Prisma in one .wasp file), Open SaaS boilerplate, AI-legible architecture"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../wasp.md).

# Wasp Skill

## Wanneer activeren
- Een full-stack SaaS bootstrappen met minimale configuratie-overhead
- Het Open SaaS-boilerplate gebruiken (Stripe, auth, dashboard inbegrepen)
- Werken in een Wasp-project — begrijpen van .wasp-bestandsstructuur, routes, actions, queries
- Uitleggen waarom Wasp uniek geschikt is voor AI-gegenereerde codebases

## Wanneer NIET gebruiken
- Bestaande Next.js- of andere framework-projecten — Wasp vereist een nieuwe start
- Wanneer aangepaste infrastructuurcontrole nodig is die niet beschikbaar is in Wasp
- Niet-JavaScript-projecten

## Waarom Wasp voor AI-generatie

Het onderzoek identificeert Wasp als een uniek architectuurvoordeel: de **volledige applicatie — React-frontend, Node.js-backend, Prisma DB-schema, auth, routing** — wordt gedeclareerd in één enkel `main.wasp`-bestand. Claude kan de volledige architectuurstatus van een applicatie in **één leesbewerking** verwerken, waardoor omwegfouten bij multi-bestandsconfiguraties worden geëlimineerd. Dit is waarom Wasp hallucinaties tijdens generatie drastisch vermindert.

## Instructies

### Installatie

```bash
curl -sSL https://get.wasp-lang.dev/installer.sh | sh
wasp new my-saas
cd my-saas
wasp start
```

### Het main.wasp-bestand — de enige bron van waarheid

```wasp
// main.wasp — volledige app-architectuur hier gedeclareerd

app MyApp {
  wasp: { version: "^0.15.0" },
  title: "My SaaS",
  head: [
    "<meta name='description' content='My SaaS app' />"
  ],

  // Auth-configuratie
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

  // E-mail verzenden
  emailSender: {
    provider: SendGrid,
    defaultFrom: { name: "My SaaS", email: "noreply@myapp.com" },
  },

  // Betaling met Stripe
  server: {
    setupFn: import { serverSetup } from "@src/serverSetup",
  },
}

// Database-entiteiten
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

// Routes (React-pagina's)
route LoginRoute { path: "/login", to: LoginPage }
route DashboardRoute { path: "/dashboard", to: DashboardPage }
route TasksRoute { path: "/tasks", to: TasksPage }

// Pagina's (React-componenten)
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

// Server-actions (mutaties)
action createTask {
  fn: import { createTask } from "@src/server/actions/tasks",
  entities: [Task],
}

action deleteTask {
  fn: import { deleteTask } from "@src/server/actions/tasks",
  entities: [Task],
}

// Server-queries (leesbewerkingen)
query getTasks {
  fn: import { getTasks } from "@src/server/queries/tasks",
  entities: [Task],
}

// Achtergrondtaken
job sendWeeklyReport {
  executor: PgBoss,
  schedule: { cron: "0 9 * * 1" },  // elke maandag om 9 uur
  fn: import { sendWeeklyReport } from "@src/server/jobs/reports",
  entities: [User, Task],
}
```

### Server-actions

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

### Server-queries

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

### Client-pagina's (React)

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

### Open SaaS-boilerplate

Open SaaS (opensaas.sh) is de officiële Wasp SaaS-starter — vooraf geconfigureerd met:
- Stripe-abonnementen + webhook-afhandeling
- E-mail-auth + Google OAuth
- Beheerderspaneel
- Blog (Astro)
- Landingspagina

```bash
# Starten vanuit Open SaaS
git clone https://github.com/wasp-lang/open-saas.git my-saas
cd my-saas
wasp db migrate-dev
wasp start
```

**Open SaaS-omgevingsvariabelen:**
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

### Wasp CLI-opdrachten

```bash
wasp start              # ontwikkelingsserver starten (frontend + backend + DB)
wasp db migrate-dev     # Prisma-migraties uitvoeren
wasp db studio          # Prisma Studio openen
wasp build              # productiebuild
wasp deploy fly launch  # deployen naar Fly.io
wasp deploy fly deploy  # opnieuw deployen naar Fly.io
```

### Deployment (Fly.io — ingebouwde ondersteuning)

```bash
# Eenmalige setup
wasp deploy fly setup my-app --org personal --region lhr

# Deployen
wasp deploy fly deploy

# Wasp regelt: Dockerfile-generatie, Fly-configuratie, DB-migratie bij deployment
```

## Voorbeeld

**Gebruiker:** Een abonnementniveau-systeem toevoegen aan een Wasp-app — gratis gebruikers krijgen 10 taken, pro-gebruikers krijgen onbeperkte taken — met Stripe-checkout en webhook-afhandeling.

**Verwachte uitvoer:**
- `main.wasp`-toevoegingen: `SubscriptionTier`-entiteit, `createCheckoutSession`-action, `getSubscriptionStatus`-query
- `src/server/actions/stripe.ts` — `createCheckoutSession` met Stripe SDK
- `src/server/api/stripeWebhook.ts` — webhook-handler voor `checkout.session.completed`
- `src/client/pages/Billing.tsx` — upgrade-knop die `createCheckoutSession` aanroept
- Taak-aanmaak-action die `user.subscriptionStatus` controleert voordat meer dan 10 taken worden toegestaan

---
