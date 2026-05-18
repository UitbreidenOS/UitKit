---
name: wasp
description: "Wasp framework: declarative full-stack config (React + Node.js + Prisma in one .wasp file), Open SaaS boilerplate, AI-legible architecture"
---

> 🇫🇷 Version française. [English version](../wasp.md).

# Compétence Wasp

## Quand activer
- Démarrer un SaaS full-stack avec un minimum de configuration
- Utiliser le boilerplate Open SaaS (Stripe, authentification, tableau de bord inclus)
- Travailler dans un projet Wasp — comprendre la structure du fichier .wasp, les routes, les actions, les requêtes
- Expliquer pourquoi Wasp est particulièrement adapté aux bases de code générées par IA

## Quand NE PAS utiliser
- Projets Next.js établis ou autres frameworks — Wasp exige de partir de zéro
- Quand vous avez besoin d'un contrôle d'infrastructure personnalisé non disponible dans Wasp
- Projets non-JavaScript

## Pourquoi Wasp pour la génération IA

La recherche identifie Wasp comme ayant un avantage architectural unique : **l'intégralité de l'application — frontend React, backend Node.js, schéma de base de données Prisma, authentification, routage** — est déclarée dans un seul fichier `main.wasp`. Claude peut ingérer l'état architectural complet d'une application en **une seule opération de lecture**, éliminant les erreurs d'indirection qui affectent les configurations multi-fichiers. C'est pourquoi Wasp réduit considérablement les hallucinations lors de la génération.

## Instructions

### Installation

```bash
curl -sSL https://get.wasp-lang.dev/installer.sh | sh
wasp new my-saas
cd my-saas
wasp start
```

### Le fichier main.wasp — la source unique de vérité

```wasp
// main.wasp — toute l'architecture de l'application déclarée ici

app MyApp {
  wasp: { version: "^0.15.0" },
  title: "My SaaS",
  head: [
    "<meta name='description' content='My SaaS app' />"
  ],

  // Configuration de l'authentification
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

  // Envoi d'e-mails
  emailSender: {
    provider: SendGrid,
    defaultFrom: { name: "My SaaS", email: "noreply@myapp.com" },
  },

  // Paiement avec Stripe
  server: {
    setupFn: import { serverSetup } from "@src/serverSetup",
  },
}

// Entités de base de données
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

// Routes (pages React)
route LoginRoute { path: "/login", to: LoginPage }
route DashboardRoute { path: "/dashboard", to: DashboardPage }
route TasksRoute { path: "/tasks", to: TasksPage }

// Pages (composants React)
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

// Actions serveur (mutations)
action createTask {
  fn: import { createTask } from "@src/server/actions/tasks",
  entities: [Task],
}

action deleteTask {
  fn: import { deleteTask } from "@src/server/actions/tasks",
  entities: [Task],
}

// Requêtes serveur (lectures)
query getTasks {
  fn: import { getTasks } from "@src/server/queries/tasks",
  entities: [Task],
}

// Tâches en arrière-plan
job sendWeeklyReport {
  executor: PgBoss,
  schedule: { cron: "0 9 * * 1" },  // tous les lundis à 9h
  fn: import { sendWeeklyReport } from "@src/server/jobs/reports",
  entities: [User, Task],
}
```

### Actions serveur

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

### Requêtes serveur

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

### Pages client (React)

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

Open SaaS (opensaas.sh) est le starter SaaS officiel de Wasp — préconfiguré avec :
- Abonnements Stripe + gestion des webhooks
- Authentification par e-mail + OAuth Google
- Tableau de bord administrateur
- Blog (Astro)
- Page d'accueil

```bash
# Démarrer depuis Open SaaS
git clone https://github.com/wasp-lang/open-saas.git my-saas
cd my-saas
wasp db migrate-dev
wasp start
```

**Variables d'environnement Open SaaS :**
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

### Commandes CLI Wasp

```bash
wasp start              # démarrer le serveur de développement (frontend + backend + DB)
wasp db migrate-dev     # exécuter les migrations Prisma
wasp db studio          # ouvrir Prisma Studio
wasp build              # build de production
wasp deploy fly launch  # déployer sur Fly.io
wasp deploy fly deploy  # redéployer sur Fly.io
```

### Déploiement (Fly.io — support intégré)

```bash
# Configuration unique
wasp deploy fly setup my-app --org personal --region lhr

# Déployer
wasp deploy fly deploy

# Wasp gère : génération du Dockerfile, configuration Fly, migration DB au déploiement
```

## Exemple

**Utilisateur :** Ajouter un système de niveaux d'abonnement à une application Wasp — les utilisateurs gratuits obtiennent 10 tâches, les utilisateurs pro en obtiennent un nombre illimité — avec le paiement Stripe et la gestion des webhooks.

**Résultat attendu :**
- Ajouts à `main.wasp` : entité `SubscriptionTier`, action `createCheckoutSession`, requête `getSubscriptionStatus`
- `src/server/actions/stripe.ts` — `createCheckoutSession` utilisant le SDK Stripe
- `src/server/api/stripeWebhook.ts` — gestionnaire de webhook pour `checkout.session.completed`
- `src/client/pages/Billing.tsx` — bouton de mise à niveau appelant `createCheckoutSession`
- Action de création de tâche qui vérifie `user.subscriptionStatus` avant d'autoriser plus de 10 tâches

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
