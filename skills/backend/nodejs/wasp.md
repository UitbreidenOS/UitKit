---
name: wasp
description: "Wasp framework: declarative full-stack config (React + Node.js + Prisma in one .wasp file), Open SaaS boilerplate, AI-legible architecture"
updated: 2026-06-13
---

# Wasp Skill

## When to activate
- Bootstrapping a full-stack SaaS with minimal configuration overhead
- Using the Open SaaS boilerplate (Stripe, auth, dashboard included)
- Working in a Wasp project — understanding .wasp file structure, routes, actions, queries
- Explaining why Wasp is uniquely suited for AI-generated codebases

## When NOT to use
- Established Next.js or other framework projects — Wasp requires starting fresh
- When you need custom infrastructure control unavailable in Wasp
- Non-JavaScript projects

## Why Wasp for AI generation

The research identifies Wasp as having a unique architectural advantage: the **entire application — React frontend, Node.js backend, Prisma DB schema, auth, routing** — is declared in a single `main.wasp` file. Claude can ingest the entire architectural state of an application in **one read operation**, eliminating the indirection errors that plague multi-file configurations. This is why Wasp dramatically reduces hallucination during generation.

## Instructions

### Installation

```bash
curl -sSL https://get.wasp-lang.dev/installer.sh | sh
wasp new my-saas
cd my-saas
wasp start
```

### The main.wasp file — the single source of truth

```wasp
// main.wasp — entire app architecture declared here

app MyApp {
  wasp: { version: "^0.15.0" },
  title: "My SaaS",
  head: [
    "<meta name='description' content='My SaaS app' />"
  ],

  // Auth configuration
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

  // Email sending
  emailSender: {
    provider: SendGrid,
    defaultFrom: { name: "My SaaS", email: "noreply@myapp.com" },
  },

  // Payment with Stripe
  server: {
    setupFn: import { serverSetup } from "@src/serverSetup",
  },
}

// Database entities
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

// Routes (React pages)
route LoginRoute { path: "/login", to: LoginPage }
route DashboardRoute { path: "/dashboard", to: DashboardPage }
route TasksRoute { path: "/tasks", to: TasksPage }

// Pages (React components)
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

// Server actions (mutations)
action createTask {
  fn: import { createTask } from "@src/server/actions/tasks",
  entities: [Task],
}

action deleteTask {
  fn: import { deleteTask } from "@src/server/actions/tasks",
  entities: [Task],
}

// Server queries (reads)
query getTasks {
  fn: import { getTasks } from "@src/server/queries/tasks",
  entities: [Task],
}

// Background jobs
job sendWeeklyReport {
  executor: PgBoss,
  schedule: { cron: "0 9 * * 1" },  // every Monday 9am
  fn: import { sendWeeklyReport } from "@src/server/jobs/reports",
  entities: [User, Task],
}
```

### Server actions

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

### Server queries

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

### Client pages (React)

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

### Open SaaS boilerplate

Open SaaS (opensaas.sh) is the official Wasp SaaS starter — pre-configured with:
- Stripe subscriptions + webhook handling
- Email auth + Google OAuth
- Admin dashboard
- Blog (Astro)
- Landing page

```bash
# Start from Open SaaS
git clone https://github.com/wasp-lang/open-saas.git my-saas
cd my-saas
wasp db migrate-dev
wasp start
```

**Open SaaS environment variables:**
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

### Wasp CLI commands

```bash
wasp start              # start dev server (frontend + backend + DB)
wasp db migrate-dev     # run Prisma migrations
wasp db studio          # open Prisma Studio
wasp build              # production build
wasp deploy fly launch  # deploy to Fly.io
wasp deploy fly deploy  # re-deploy to Fly.io
```

### Deployment (Fly.io — built-in support)

```bash
# One-time setup
wasp deploy fly setup my-app --org personal --region lhr

# Deploy
wasp deploy fly deploy

# Wasp handles: Dockerfile generation, Fly config, DB migration on deploy
```

## Example

**User:** Add a subscription tier system to a Wasp app — free users get 10 tasks, pro users get unlimited — with Stripe checkout and webhook handling.

**Expected output:**
- `main.wasp` additions: `SubscriptionTier` entity, `createCheckoutSession` action, `getSubscriptionStatus` query
- `src/server/actions/stripe.ts` — `createCheckoutSession` using Stripe SDK
- `src/server/api/stripeWebhook.ts` — webhook handler for `checkout.session.completed`
- `src/client/pages/Billing.tsx` — upgrade button calling `createCheckoutSession`
- Task creation action that checks `user.subscriptionStatus` before allowing > 10 tasks

---
