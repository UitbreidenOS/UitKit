---
name: rbac
description: "Modèles RBAC multi-tenant : tables de rôles, vérifications de permissions, scoping au niveau des lignes, isolement d'organisation, middleware pour Next.js et Express/FastAPI"
---

# RBAC Multi-Tenant Skill

## Quand activer
- Construire un SaaS multi-tenant où les utilisateurs appartiennent à des organisations
- Implémenter le contrôle d'accès basé sur les rôles (admin, editor, viewer, etc.)
- Scoper les requêtes de base de données pour que les utilisateurs ne voient que les données de leur organisation
- Ajouter un middleware de permissions aux routes API
- Concevoir le schéma de base de données pour les rôles et permissions

## Quand ne PAS utiliser
- Les apps single-tenant où tous les utilisateurs authentifiés ont le même accès
- Les vérifications simples de booléen `isAdmin` — cela n'en vaut la peine qu'avec 3+ rôles
- Quand le plugin d'organisation intégré de Better Auth couvre vos besoins (vérifier d'abord)

## Instructions

### Schéma de base de données

```typescript
// db/schema.ts — Drizzle
import { pgTable, text, uuid, timestamp, pgEnum, unique } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const roleEnum = pgEnum('role', ['owner', 'admin', 'editor', 'viewer'])

export const organizations = pgTable('organizations', {
  id:        uuid('id').primaryKey().defaultRandom(),
  name:      text('name').notNull(),
  slug:      text('slug').notNull().unique(),
  plan:      text('plan', { enum: ['free', 'pro', 'enterprise'] }).default('free').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const users = pgTable('users', {
  id:    uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name:  text('name'),
})

// Many-to-many: users ↔ organizations avec un rôle
export const memberships = pgTable('memberships', {
  id:             uuid('id').primaryKey().defaultRandom(),
  userId:         uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  role:           roleEnum('role').notNull().default('viewer'),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  uniqueMember: unique().on(t.userId, t.organizationId),  // un rôle par utilisateur par org
}))

// Toutes les données appartiennent à une organisation
export const projects = pgTable('projects', {
  id:             uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  name:           text('name').notNull(),
  createdById:    uuid('created_by_id').references(() => users.id),
})

// Relations
export const membershipsRelations = relations(memberships, ({ one }) => ({
  user:         one(users, { fields: [memberships.userId], references: [users.id] }),
  organization: one(organizations, { fields: [memberships.organizationId], references: [organizations.id] }),
}))
```

### Helper de permissions

```typescript
// lib/permissions.ts
export type Role = 'owner' | 'admin' | 'editor' | 'viewer'

const ROLE_HIERARCHY: Record<Role, number> = {
  owner:  40,
  admin:  30,
  editor: 20,
  viewer: 10,
}

// Vérifier si le rôle a un niveau de privilège suffisant
export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

// Matrice de permissions — ce que chaque rôle peut faire
export const PERMISSIONS = {
  'projects:create': ['owner', 'admin', 'editor'] as Role[],
  'projects:delete': ['owner', 'admin'] as Role[],
  'members:invite':  ['owner', 'admin'] as Role[],
  'members:remove':  ['owner', 'admin'] as Role[],
  'billing:manage':  ['owner'] as Role[],
  'org:delete':      ['owner'] as Role[],
} as const

export type Permission = keyof typeof PERMISSIONS

export function can(role: Role, permission: Permission): boolean {
  return PERMISSIONS[permission].includes(role)
}
```

### Obtenir le rôle de l'utilisateur actuel dans une organisation

```typescript
// lib/auth-helpers.ts
import { db } from '@/db'
import { memberships } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import type { Role } from './permissions'

export async function getUserRole(
  userId: string,
  orgId: string
): Promise<Role | null> {
  const membership = await db.query.memberships.findFirst({
    where: and(
      eq(memberships.userId, userId),
      eq(memberships.organizationId, orgId)
    ),
    columns: { role: true },
  })
  return membership?.role ?? null
}

export async function requireRole(
  userId: string,
  orgId: string,
  minRole: Role
): Promise<Role> {
  const role = await getUserRole(userId, orgId)
  if (!role || !hasRole(role, minRole)) {
    throw new ForbiddenError(`Requires ${minRole} role`)
  }
  return role
}
```

### Next.js — Server Action avec RBAC

```typescript
// lib/actions/projects.ts
'use server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { requireRole, can } from '@/lib/permissions'
import { db } from '@/db'
import { projects } from '@/db/schema'

export async function createProject(orgId: string, name: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Unauthorized')

  // Vérifier la permission
  await requireRole(session.user.id, orgId, 'editor')

  return db.insert(projects).values({
    organizationId: orgId,
    name,
    createdById: session.user.id,
  }).returning()
}

export async function deleteProject(projectId: string, orgId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Unauthorized')

  const role = await requireRole(session.user.id, orgId, 'admin')

  // Vérification supplémentaire pour une permission spécifique
  if (!can(role, 'projects:delete')) throw new ForbiddenError('Cannot delete projects')

  await db.delete(projects).where(eq(projects.id, projectId))
}
```

### Scoping au niveau des lignes — chaque requête filtre par org

```typescript
// lib/queries/projects.ts
import { db } from '@/db'
import { projects } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

// Toujours scoper les requêtes à l'organisation actuelle
export async function getProjects(orgId: string) {
  return db.select().from(projects)
    .where(eq(projects.organizationId, orgId))   // ← critique: toujours filtrer par org
    .orderBy(projects.createdAt)
}

export async function getProject(projectId: string, orgId: string) {
  // Inclure orgId dans WHERE — prévient l'escalade de privilège horizontal
  return db.query.projects.findFirst({
    where: and(
      eq(projects.id, projectId),
      eq(projects.organizationId, orgId)         // ← valide la propriété
    ),
  })
}
```

### Middleware Express/Fastify

```typescript
// middleware/rbac.ts
import { getUserRole, hasRole } from '@/lib/permissions'
import type { Role } from '@/lib/permissions'

export function requireOrgRole(minRole: Role) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id
    const orgId = req.params.orgId ?? req.body.orgId

    if (!userId || !orgId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const role = await getUserRole(userId, orgId)
    if (!role || !hasRole(role, minRole)) {
      return res.status(403).json({ error: `Requires ${minRole} role` })
    }

    req.userRole = role  // attacher pour usage en aval
    next()
  }
}

// Usage
router.delete('/orgs/:orgId/projects/:id',
  requireOrgRole('admin'),
  deleteProjectHandler
)

router.post('/orgs/:orgId/members/invite',
  requireOrgRole('admin'),
  inviteMemberHandler
)
```

### Dépendance FastAPI (Python)

```python
# dependencies/rbac.py
from fastapi import Depends, HTTPException
from .auth import get_current_user
from .db import get_db

ROLE_HIERARCHY = {"owner": 40, "admin": 30, "editor": 20, "viewer": 10}

def has_role(user_role: str, required_role: str) -> bool:
    return ROLE_HIERARCHY.get(user_role, 0) >= ROLE_HIERARCHY.get(required_role, 0)

def require_org_role(min_role: str):
    async def dependency(
        org_id: str,
        current_user = Depends(get_current_user),
        db = Depends(get_db),
    ):
        membership = await db.memberships.find_one(
            user_id=current_user.id, organization_id=org_id
        )
        if not membership or not has_role(membership.role, min_role):
            raise HTTPException(status_code=403, detail=f"Requires {min_role} role")
        return membership.role

    return dependency

# Usage
@router.delete("/orgs/{org_id}/projects/{project_id}")
async def delete_project(
    project_id: str,
    role = Depends(require_org_role("admin")),
):
    ...
```

### Inviter et gérer les membres

```typescript
// lib/actions/members.ts
export async function inviteMember(orgId: string, email: string, role: Role) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Unauthorized')

  await requireRole(session.user.id, orgId, 'admin')

  // Vérifier que l'inviteur peut accorder ce rôle (ne peut pas accorder plus haut que le sien)
  const inviterRole = await getUserRole(session.user.id, orgId)
  if (!inviterRole || ROLE_HIERARCHY[role] > ROLE_HIERARCHY[inviterRole]) {
    throw new ForbiddenError("Cannot grant a role higher than your own")
  }

  // Envoyer l'invitation...
  await sendInviteEmail({ email, orgId, role, invitedBy: session.user.id })
}

export async function updateMemberRole(orgId: string, memberId: string, newRole: Role) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Unauthorized')

  const actorRole = await requireRole(session.user.id, orgId, 'admin')

  // Prévenir l'escalade de privilège
  if (ROLE_HIERARCHY[newRole] >= ROLE_HIERARCHY[actorRole] && actorRole !== 'owner') {
    throw new ForbiddenError('Cannot assign role equal or higher than your own')
  }

  await db.update(memberships)
    .set({ role: newRole })
    .where(and(eq(memberships.id, memberId), eq(memberships.organizationId, orgId)))
}
```

## Exemple

**User:** Un outil SaaS de gestion de projets — les propriétaires peuvent gérer la facturation et supprimer l'org, les admins peuvent inviter des membres et supprimer des projets, les éditeurs peuvent créer des projets, les viewers peuvent seulement lire. Implémenter le schéma, helper de permissions et middleware pour les Server Actions Next.js.

**Expected output:**
- `db/schema.ts` — organisations, utilisateurs, memberships (avec enum de rôle), tables de projets
- `lib/permissions.ts` — matrice `PERMISSIONS`, `can()`, `hasRole()`, `ROLE_HIERARCHY`
- `lib/auth-helpers.ts` — `getUserRole()`, `requireRole()`
- `lib/actions/projects.ts` — `createProject` (editor+), `deleteProject` (admin+)
- Toutes les requêtes de données incluent le filtre `organizationId` pour prévenir les fuites de données entre orgs

---
