---
name: test-factories
description: "Test factories and fixtures: factory_boy (Python), Fishery/faker-js (TypeScript), seeding test databases, avoiding test data duplication"
---

> 🇪🇸 Versión en español. [Versión en inglés](../test-factories.md).

# Skill Test Factories

## Cuándo activar
- Los tests son lentos o frágiles porque cada test crea manualmente registros de base de datos
- Copiar y pegar código de creación de modelos entre tests
- Configurar grafos de objetos complejos para un test (user → team → project → tasks)
- Sembrar una base de datos para desarrollo o staging
- Agregar datos aleatorios basados en faker para probar casos extremos

## Cuándo NO usar
- Tests unitarios de funciones puras sin DB — simplemente pasa los datos directamente
- Tests muy simples donde una llamada `db.create()` es clara y suficiente
- Cuando los datos de test deben ser muy específicos y explícitos (usa valores literales, no factories)

## Instrucciones

### Python — factory_boy

```bash
pip install factory-boy faker
```

```python
# tests/factories.py
import factory
from factory.django import DjangoModelFactory  # or SQLAlchemyModelFactory
from faker import Faker

fake = Faker()

class UserFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = User
        sqlalchemy_session_persistence = "commit"

    email    = factory.LazyFunction(fake.email)
    name     = factory.LazyFunction(fake.name)
    role     = "user"
    is_active = True

class TeamFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = Team

    name  = factory.LazyFunction(lambda: fake.company())
    owner = factory.SubFactory(UserFactory)  # auto-creates an owner

class ProjectFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = Project

    name = factory.Sequence(lambda n: f"Project {n}")  # unique: Project 0, Project 1...
    team = factory.SubFactory(TeamFactory)

class TaskFactory(factory.alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = Task

    title    = factory.LazyFunction(fake.sentence)
    status   = factory.Iterator(["todo", "in_progress", "done"])
    assignee = factory.SubFactory(UserFactory)
    project  = factory.SubFactory(ProjectFactory)
```

```python
# Uso en tests
def test_active_tasks():
    # Crear una tarea con valores por defecto
    task = TaskFactory(status="in_progress")

    # Sobrescribir campos específicos
    admin = UserFactory(role="admin", email="admin@example.com")

    # Crear muchos a la vez
    tasks = TaskFactory.create_batch(10, project=project)

    # Build (sin inserción en DB — para tests unitarios)
    user = UserFactory.build()

    # Traits — variaciones nombradas
    class UserFactory(factory.alchemy.SQLAlchemyModelFactory):
        class Meta:
            model = User

        class Params:
            admin = factory.Trait(role="admin", is_staff=True)
            inactive = factory.Trait(is_active=False)

    # Uso
    admin = UserFactory(admin=True)
    suspended = UserFactory(inactive=True)
```

### TypeScript — Fishery + faker

```bash
npm install --save-dev fishery @faker-js/faker
```

```typescript
// tests/factories.ts
import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'

// Factory con tipos TypeScript
const userFactory = Factory.define<User>(() => ({
  id:        faker.string.uuid(),
  email:     faker.internet.email(),
  name:      faker.person.fullName(),
  role:      'user' as const,
  createdAt: faker.date.past(),
  isActive:  true,
}))

const teamFactory = Factory.define<Team>(({ associations }) => ({
  id:      faker.string.uuid(),
  name:    faker.company.name(),
  ownerId: associations.owner?.id ?? faker.string.uuid(),
}))

const projectFactory = Factory.define<Project>(({ sequence }) => ({
  id:     faker.string.uuid(),
  name:   `Project ${sequence}`,  // unique sequence number
  teamId: faker.string.uuid(),
}))

export { userFactory, teamFactory, projectFactory }
```

```typescript
// Uso en tests
import { userFactory, projectFactory } from './factories'

describe('ProjectService', () => {
  it('lista solo proyectos activos', () => {
    const activeProject = projectFactory.build()
    const archivedProject = projectFactory.build({ archived: true })

    // Construir múltiples
    const projects = projectFactory.buildList(5)

    // Fusionar parámetros
    const adminUser = userFactory.build({ role: 'admin', email: 'admin@test.com' })
  })
})

// Con base de datos (ejemplo Prisma)
const taskFactory = Factory.define<Task, { db: PrismaClient }>(
  ({ transientParams }) => ({
    id:      faker.string.uuid(),
    title:   faker.lorem.sentence(),
    status:  'todo',
    userId:  faker.string.uuid(),
  })
).withDecorator(async (task, { transientParams: { db } }) => {
  // Insertar realmente en DB
  return db.task.create({ data: task })
})

// Insertar en DB
const task = await taskFactory.create({ db: prisma })
```

### Fixtures de Pytest con factories

```python
# conftest.py
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from tests.factories import UserFactory, ProjectFactory, TaskFactory

@pytest.fixture
def db_session(engine):
    # Establecer sesión para todas las factories
    UserFactory._meta.sqlalchemy_session = session
    ProjectFactory._meta.sqlalchemy_session = session
    yield session
    session.rollback()

# Fixtures reutilizables que usan factories
@pytest.fixture
def user(db_session):
    return UserFactory()

@pytest.fixture
def admin(db_session):
    return UserFactory(role="admin")

@pytest.fixture
def project_with_tasks(db_session, user):
    project = ProjectFactory(owner=user)
    TaskFactory.create_batch(5, project=project, assignee=user)
    return project

# Uso
def test_can_archive_project(project_with_tasks, admin):
    result = archive_project(project_with_tasks.id, by=admin)
    assert result.archived is True
```

### Patrón de fixtures Jest/Vitest

```typescript
// tests/fixtures.ts
import { PrismaClient } from '@prisma/client'
import { userFactory, projectFactory } from './factories'

export async function createUserWithProjects(
  db: PrismaClient,
  projectCount = 3
) {
  const user = await db.user.create({
    data: {
      ...userFactory.build(),
      projects: {
        create: projectFactory.buildList(projectCount),
      },
    },
    include: { projects: true },
  })
  return user
}

// Fixture para aislamiento de tests
export async function withTestUser(
  db: PrismaClient,
  fn: (user: User) => Promise<void>
) {
  const user = await db.user.create({ data: userFactory.build() })
  try {
    await fn(user)
  } finally {
    await db.user.delete({ where: { id: user.id } })
  }
}
```

### Sembrado de base de datos

```python
# scripts/seed.py — poblar dev/staging con datos realistas
import asyncio
from tests.factories import UserFactory, TeamFactory, ProjectFactory, TaskFactory

async def seed():
    # Crear 10 usuarios
    users = UserFactory.create_batch(10)

    # Crear admin
    admin = UserFactory(role="admin", email="admin@example.com", name="Admin User")

    # Crear equipos con proyectos y tareas
    for i in range(3):
        team = TeamFactory(owner=users[i])
        for j in range(5):
            project = ProjectFactory(team=team)
            TaskFactory.create_batch(10, project=project)

    print(f"Seeded: {len(users) + 1} users, 3 teams, 15 projects, 150 tasks")

asyncio.run(seed())
```

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { userFactory, projectFactory, taskFactory } from '../tests/factories'

const prisma = new PrismaClient()

async function seed() {
  await prisma.$transaction(async (tx) => {
    // Crear usuarios
    const users = await Promise.all(
      userFactory.buildList(10).map(u => tx.user.create({ data: u }))
    )

    // Crear proyectos para cada usuario
    for (const user of users) {
      const projects = await Promise.all(
        projectFactory.buildList(3, { userId: user.id })
          .map(p => tx.project.create({ data: p }))
      )

      // Crear tareas para cada proyecto
      for (const project of projects) {
        await tx.task.createMany({
          data: taskFactory.buildList(5, { projectId: project.id }),
        })
      }
    }
  })

  console.log('Database seeded')
}

seed().finally(() => prisma.$disconnect())
```

```bash
# Ejecutar seed
npx prisma db seed
# o
python scripts/seed.py
```

### Reglas para buenas factories

1. **Valores por defecto razonables** — cada campo debe tener un valor sensato sin ninguna sobrescritura
2. **Únicos donde se requiere** — usar `factory.Sequence` o `faker` para campos únicos
3. **Sin IDs hardcodeados** — usar UUIDs generados
4. **Construir sin DB por defecto** — usar `.build()` para tests unitarios, `.create()` solo para tests de integración
5. **Traits para variaciones nombradas** — `UserFactory(admin=True)` no `AdminUserFactory()`
6. **No incrustar lógica de negocio** — las factories son para datos, no comportamiento

## Ejemplo

**Usuario:** Un test para un servicio de pedidos necesita: 1 usuario, 1 carrito con 3 artículos, un código de descuento y un método de pago guardado — todos correctamente vinculados.

**Configuración esperada usando factories:**
```python
def test_checkout_applies_discount(db_session):
    user         = UserFactory()
    payment      = PaymentMethodFactory(user=user, type="card")
    coupon       = CouponFactory(code="SAVE20", discount_pct=20, active=True)
    cart         = CartFactory(user=user)
    items        = CartItemFactory.create_batch(3, cart=cart)

    result = checkout(
        user_id=user.id,
        coupon_code="SAVE20",
        payment_method_id=payment.id,
    )

    expected_total = sum(i.price * i.qty for i in items) * 0.8
    assert result.total == pytest.approx(expected_total)
```

---
