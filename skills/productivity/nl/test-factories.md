---
name: test-factories
description: "Test factories and fixtures: factory_boy (Python), Fishery/faker-js (TypeScript), seeding test databases, avoiding test data duplication"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../test-factories.md).

# Test Factories Skill

## Wanneer activeren
- Tests zijn traag of fragiel omdat elke test handmatig databaserecords aanmaakt
- Modelaanmaakcode kopiëren en plakken tussen tests
- Complexe objectgrafen opzetten voor een test (user → team → project → tasks)
- Een database seeden voor ontwikkeling of staging
- Faker-gebaseerde willekeurige data toevoegen om randgevallen te testen

## Wanneer NIET gebruiken
- Unit-tests voor pure functies zonder DB — geef de data gewoon direct door
- Zeer eenvoudige tests waarbij één `db.create()`-aanroep duidelijk en voldoende is
- Wanneer de testdata zeer specifiek en expliciet moet zijn (gebruik letterlijke waarden, geen factories)

## Instructies

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
# Gebruik in tests
def test_active_tasks():
    # Eén taak aanmaken met standaardwaarden
    task = TaskFactory(status="in_progress")

    # Specifieke velden overschrijven
    admin = UserFactory(role="admin", email="admin@example.com")

    # Meerdere tegelijk aanmaken
    tasks = TaskFactory.create_batch(10, project=project)

    # Build (geen DB-insert — voor unit-tests)
    user = UserFactory.build()

    # Traits — benoemde variaties
    class UserFactory(factory.alchemy.SQLAlchemyModelFactory):
        class Meta:
            model = User

        class Params:
            admin = factory.Trait(role="admin", is_staff=True)
            inactive = factory.Trait(is_active=False)

    # Gebruik
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

// Factory met TypeScript-typen
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
// Gebruik in tests
import { userFactory, projectFactory } from './factories'

describe('ProjectService', () => {
  it('geeft alleen actieve projecten weer', () => {
    const activeProject = projectFactory.build()
    const archivedProject = projectFactory.build({ archived: true })

    // Meerdere bouwen
    const projects = projectFactory.buildList(5)

    // Parameters samenvoegen
    const adminUser = userFactory.build({ role: 'admin', email: 'admin@test.com' })
  })
})

// Met database (Prisma-voorbeeld)
const taskFactory = Factory.define<Task, { db: PrismaClient }>(
  ({ transientParams }) => ({
    id:      faker.string.uuid(),
    title:   faker.lorem.sentence(),
    status:  'todo',
    userId:  faker.string.uuid(),
  })
).withDecorator(async (task, { transientParams: { db } }) => {
  // Daadwerkelijk in DB invoegen
  return db.task.create({ data: task })
})

// In DB invoegen
const task = await taskFactory.create({ db: prisma })
```

### Pytest fixtures met factories

```python
# conftest.py
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from tests.factories import UserFactory, ProjectFactory, TaskFactory

@pytest.fixture
def db_session(engine):
    # Sessie instellen voor alle factories
    UserFactory._meta.sqlalchemy_session = session
    ProjectFactory._meta.sqlalchemy_session = session
    yield session
    session.rollback()

# Herbruikbare fixtures die factories gebruiken
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

# Gebruik
def test_can_archive_project(project_with_tasks, admin):
    result = archive_project(project_with_tasks.id, by=admin)
    assert result.archived is True
```

### Jest/Vitest fixtures-patroon

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

// Fixture voor testisolatie
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

### Database seeding

```python
# scripts/seed.py — dev/staging vullen met realistische data
import asyncio
from tests.factories import UserFactory, TeamFactory, ProjectFactory, TaskFactory

async def seed():
    # 10 gebruikers aanmaken
    users = UserFactory.create_batch(10)

    # Admin aanmaken
    admin = UserFactory(role="admin", email="admin@example.com", name="Admin User")

    # Teams aanmaken met projecten en taken
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
    // Gebruikers aanmaken
    const users = await Promise.all(
      userFactory.buildList(10).map(u => tx.user.create({ data: u }))
    )

    // Projecten aanmaken voor elke gebruiker
    for (const user of users) {
      const projects = await Promise.all(
        projectFactory.buildList(3, { userId: user.id })
          .map(p => tx.project.create({ data: p }))
      )

      // Taken aanmaken voor elk project
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
# Seed uitvoeren
npx prisma db seed
# of
python scripts/seed.py
```

### Regels voor goede factories

1. **Verstandige standaardwaarden** — elk veld moet een redelijke waarde hebben zonder overschrijving
2. **Uniek waar vereist** — gebruik `factory.Sequence` of `faker` voor unieke velden
3. **Geen hardgecodeerde IDs** — gebruik gegenereerde UUIDs
4. **Standaard bouwen zonder DB** — gebruik `.build()` voor unit-tests, `.create()` alleen voor integratietests
5. **Traits voor benoemde variaties** — `UserFactory(admin=True)` niet `AdminUserFactory()`
6. **Geen bedrijfslogica inbedden** — factories zijn voor data, niet gedrag

## Voorbeeld

**Gebruiker:** Een test voor een bestellingsservice heeft nodig: 1 gebruiker, 1 winkelwagen met 3 items, een kortingscode en een opgeslagen betaalmethode — allemaal correct gekoppeld.

**Verwachte setup met factories:**
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
