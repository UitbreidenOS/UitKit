---
name: test-factories
description: "Test factories and fixtures: factory_boy (Python), Fishery/faker-js (TypeScript), seeding test databases, avoiding test data duplication"
---

> 🇩🇪 Deutsche Version. [Englische Version](../test-factories.md).

# Test Factories Skill

## Wann aktivieren
- Tests sind langsam oder fragil, weil jeder Test manuell Datenbankeinträge erstellt
- Modell-Erstellungscode zwischen Tests kopieren und einfügen
- Aufbau komplexer Objektgraphen für einen Test (user → team → project → tasks)
- Eine Datenbank für Entwicklung oder Staging befüllen
- Faker-basierte Zufallsdaten hinzufügen, um Grenzfälle zu testen

## Wann NICHT verwenden
- Unit-Tests für reine Funktionen ohne DB — Daten einfach direkt übergeben
- Sehr einfache Tests, bei denen ein `db.create()`-Aufruf klar und ausreichend ist
- Wenn die Testdaten sehr spezifisch und explizit sein müssen (Literalwerte verwenden, keine Factories)

## Anweisungen

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
# Verwendung in Tests
def test_active_tasks():
    # Eine Aufgabe mit Standardwerten erstellen
    task = TaskFactory(status="in_progress")

    # Bestimmte Felder überschreiben
    admin = UserFactory(role="admin", email="admin@example.com")

    # Viele auf einmal erstellen
    tasks = TaskFactory.create_batch(10, project=project)

    # Build (kein DB-Insert — für Unit-Tests)
    user = UserFactory.build()

    # Traits — benannte Variationen
    class UserFactory(factory.alchemy.SQLAlchemyModelFactory):
        class Meta:
            model = User

        class Params:
            admin = factory.Trait(role="admin", is_staff=True)
            inactive = factory.Trait(is_active=False)

    # Verwendung
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

// Factory mit TypeScript-Typen
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
// Verwendung in Tests
import { userFactory, projectFactory } from './factories'

describe('ProjectService', () => {
  it('listet nur aktive Projekte auf', () => {
    const activeProject = projectFactory.build()
    const archivedProject = projectFactory.build({ archived: true })

    // Mehrere erstellen
    const projects = projectFactory.buildList(5)

    // Parameter zusammenführen
    const adminUser = userFactory.build({ role: 'admin', email: 'admin@test.com' })
  })
})

// Mit Datenbank (Prisma-Beispiel)
const taskFactory = Factory.define<Task, { db: PrismaClient }>(
  ({ transientParams }) => ({
    id:      faker.string.uuid(),
    title:   faker.lorem.sentence(),
    status:  'todo',
    userId:  faker.string.uuid(),
  })
).withDecorator(async (task, { transientParams: { db } }) => {
  // Tatsächlich in DB einfügen
  return db.task.create({ data: task })
})

// In DB einfügen
const task = await taskFactory.create({ db: prisma })
```

### Pytest-Fixtures mit Factories

```python
# conftest.py
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from tests.factories import UserFactory, ProjectFactory, TaskFactory

@pytest.fixture
def db_session(engine):
    # Session für alle Factories setzen
    UserFactory._meta.sqlalchemy_session = session
    ProjectFactory._meta.sqlalchemy_session = session
    yield session
    session.rollback()

# Wiederverwendbare Fixtures, die Factories verwenden
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

# Verwendung
def test_can_archive_project(project_with_tasks, admin):
    result = archive_project(project_with_tasks.id, by=admin)
    assert result.archived is True
```

### Jest/Vitest-Fixtures-Muster

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

// Fixture für Testisolierung
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

### Datenbank-Seeding

```python
# scripts/seed.py — Dev/Staging mit realistischen Daten befüllen
import asyncio
from tests.factories import UserFactory, TeamFactory, ProjectFactory, TaskFactory

async def seed():
    # 10 Benutzer erstellen
    users = UserFactory.create_batch(10)

    # Admin erstellen
    admin = UserFactory(role="admin", email="admin@example.com", name="Admin User")

    # Teams mit Projekten und Aufgaben erstellen
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
    // Benutzer erstellen
    const users = await Promise.all(
      userFactory.buildList(10).map(u => tx.user.create({ data: u }))
    )

    // Projekte für jeden Benutzer erstellen
    for (const user of users) {
      const projects = await Promise.all(
        projectFactory.buildList(3, { userId: user.id })
          .map(p => tx.project.create({ data: p }))
      )

      // Aufgaben für jedes Projekt erstellen
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
# Seed ausführen
npx prisma db seed
# oder
python scripts/seed.py
```

### Regeln für gute Factories

1. **Vernünftige Standardwerte** — jedes Feld sollte ohne Überschreibung einen sinnvollen Wert haben
2. **Eindeutig wo erforderlich** — `factory.Sequence` oder `faker` für eindeutige Felder verwenden
3. **Keine hartcodierten IDs** — generierte UUIDs verwenden
4. **Standardmäßig ohne DB erstellen** — `.build()` für Unit-Tests, `.create()` nur für Integrationstests
5. **Traits für benannte Variationen** — `UserFactory(admin=True)` statt `AdminUserFactory()`
6. **Keine Geschäftslogik einbetten** — Factories sind für Daten, nicht für Verhalten

## Beispiel

**Nutzer:** Ein Test für einen Bestellservice benötigt: 1 Benutzer, 1 Warenkorb mit 3 Artikeln, einen Rabattcode und eine gespeicherte Zahlungsmethode — alle korrekt verknüpft.

**Erwartetes Setup mit Factories:**
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
