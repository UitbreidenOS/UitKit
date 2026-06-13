---
name: rbac
description: "Patrones RBAC multi-tenant: tablas de roles, verificaciones de permiso, scoping a nivel de fila, aislamiento de organización, guardias de middleware para Next.js y Express/FastAPI"
---

# Skill RBAC Multi-Tenant

## Cuándo activar
- Construir un SaaS multi-tenant donde usuarios pertenecen a organizaciones
- Implementar control de acceso basado en roles (admin, editor, viewer, etc.)
- Scoping de consultas de base de datos para que usuarios solo vean datos de su organización
- Agregar middleware de permiso a rutas de API
- Diseñar el esquema de base de datos para roles y permisos

## Cuándo NO usar
- Aplicaciones single-tenant donde todos los usuarios autenticados tienen el mismo acceso
- Verificaciones simples de booleano `isAdmin` — solo vale la complejidad con 3+ roles
- Cuando el plugin de organización integrado de Better Auth cubre tus necesidades (verifica eso primero)

## Instrucciones

### Esquema de base de datos

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

// Muchos-a-muchos: usuarios ↔ organizaciones con un rol
export const memberships = pgTable('memberships', {
  id:             uuid('id').primaryKey().defaultRandom(),
  userId:         uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  role:           roleEnum('role').notNull().default('viewer'),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  uniqueMember: unique().on(t.userId, t.organizationId),  // un rol por usuario por org
}))

// Todos los datos pertenecen a una organización
export const projects = pgTable('projects', {
  id:             uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  name:           text('name').notNull(),
  createdById:    uuid('created_by_id').references(() => users.id),
})

// Relaciones
export const membershipsRelations = relations(memberships, ({ one }) => ({
  user:         one(users, { fields: [memberships.userId], references: [users.id] }),
  organization: one(organizations, { fields: [memberships.organizationId], references: [organizations.id] }),
}))
```

### Ayudante de permiso

```typescript
// lib/permissions.ts
export type Role = 'owner' | 'admin' | 'editor' | 'viewer'

const ROLE_HIERARCHY: Record<Role, number> = {
  owner:  40,
  admin:  30,
  editor: 20,
  viewer: 10,
}

// Verificar si rol tiene nivel de privilegio suficiente
export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

// Matriz de permiso — qué puede hacer cada rol
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

### Obtener el rol actual del usuario en una organización

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
    throw new ForbiddenError(`Requiere rol ${minRole}`)
  }
  return role
}
```

### Next.js — Server Action con RBAC

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
  if (!session) throw new Error('No autorizado')

  // Verificar permiso
  await requireRole(session.user.id, orgId, 'editor')

  return db.insert(projects).values({
    organizationId: orgId,
    name,
    createdById: session.user.id,
  }).returning()
}

export async function deleteProject(projectId: string, orgId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('No autorizado')

  const role = await requireRole(session.user.id, orgId, 'admin')

  // Verificación extra para permiso específico
  if (!can(role, 'projects:delete')) throw new ForbiddenError('No se pueden eliminar proyectos')

  await db.delete(projects).where(eq(projects.id, projectId))
}
```

### Scoping a nivel de fila — cada consulta filtra por org

```typescript
// lib/queries/projects.ts
import { db } from '@/db'
import { projects } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

// Siempre scoping de consultas a la organización actual
export async function getProjects(orgId: string) {
  return db.select().from(projects)
    .where(eq(projects.organizationId, orgId))   // ← crítico: siempre filtrar por org
    .orderBy(projects.createdAt)
}

export async function getProject(projectId: string, orgId: string) {
  // Incluir orgId en WHERE — previene escalada de privilegios horizontal
  return db.query.projects.findFirst({
    where: and(
      eq(projects.id, projectId),
      eq(projects.organizationId, orgId)         // ← valida propiedad
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
      return res.status(401).json({ error: 'No autorizado' })
    }

    const role = await getUserRole(userId, orgId)
    if (!role || !hasRole(role, minRole)) {
      return res.status(403).json({ error: `Requiere rol ${minRole}` })
    }

    req.userRole = role  // adjuntar para uso descendente
    next()
  }
}

// Uso
router.delete('/orgs/:orgId/projects/:id',
  requireOrgRole('admin'),
  deleteProjectHandler
)

router.post('/orgs/:orgId/members/invite',
  requireOrgRole('admin'),
  inviteMemberHandler
)
```

### FastAPI dependency (Python)

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
            raise HTTPException(status_code=403, detail=f"Requiere rol {min_role}")
        return membership.role

    return dependency

# Uso
@router.delete("/orgs/{org_id}/projects/{project_id}")
async def delete_project(
    project_id: str,
    role = Depends(require_org_role("admin")),
):
    ...
```

### Invitando y administrando miembros

```typescript
// lib/actions/members.ts
export async function inviteMember(orgId: string, email: string, role: Role) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('No autorizado')

  await requireRole(session.user.id, orgId, 'admin')

  // Verificar que el invitador puede otorgar este rol (no puede otorgar más alto que el propio)
  const inviterRole = await getUserRole(session.user.id, orgId)
  if (!inviterRole || ROLE_HIERARCHY[role] > ROLE_HIERARCHY[inviterRole]) {
    throw new ForbiddenError("No se puede otorgar un rol más alto que el propio")
  }

  // Enviar invitación...
  await sendInviteEmail({ email, orgId, role, invitedBy: session.user.id })
}

export async function updateMemberRole(orgId: string, memberId: string, newRole: Role) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('No autorizado')

  const actorRole = await requireRole(session.user.id, orgId, 'admin')

  // Prevenir escalada de privilegios
  if (ROLE_HIERARCHY[newRole] >= ROLE_HIERARCHY[actorRole] && actorRole !== 'owner') {
    throw new ForbiddenError('No se puede asignar rol igual o más alto que el propio')
  }

  await db.update(memberships)
    .set({ role: newRole })
    .where(and(eq(memberships.id, memberId), eq(memberships.organizationId, orgId)))
}
```

## Ejemplo

**Usuario:** Una herramienta SaaS de gestión de proyectos — los propietarios pueden administrar facturación y eliminar la org, los administradores pueden invitar miembros y eliminar proyectos, los editores pueden crear proyectos, los visores solo pueden leer. Implementar el esquema, ayudante de permiso y middleware para Next.js Server Actions.

**Salida esperada:**
- `db/schema.ts` — tablas de organizaciones, usuarios, memberships (con enum de rol), proyectos
- `lib/permissions.ts` — matriz `PERMISSIONS`, `can()`, `hasRole()`, `ROLE_HIERARCHY`
- `lib/auth-helpers.ts` — `getUserRole()`, `requireRole()`
- `lib/actions/projects.ts` — `createProject` (editor+), `deleteProject` (admin+)
- Todas las consultas de datos incluyen filtro `organizationId` para prevenir fugas de datos entre orgs

---
