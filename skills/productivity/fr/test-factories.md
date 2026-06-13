---
name: test-factories
description: "Test factories and fixtures: factory_boy (Python), Fishery/faker-js (TypeScript), seeding test databases, avoiding test data duplication"
---

> 🇫🇷 Version française. [English version](../test-factories.md).

# Compétence Test Factories

## Quand activer
- Les tests sont lents ou fragiles parce que chaque test crée manuellement des enregistrements de base de données
- Copier-coller du code de création de modèle entre les tests
- Mise en place de graphes d'objets complexes pour un test (user → team → project → tasks)
- Seeder une base de données pour le développement ou la staging
- Ajouter des données aléatoires basées sur faker pour tester les cas limites

## Quand NE PAS utiliser
- Tests unitaires de fonctions pures sans DB — passez simplement les données directement
- Tests très simples où un appel `db.create()` est clair et suffisant
- Quand les données de test doivent être très spécifiques et explicites (utilisez des valeurs littérales, pas des factories)

## Instructions

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
# Utilisation dans les tests
def test_active_tasks():
    # Créer une tâche avec les valeurs par défaut
    task = TaskFactory(status="in_progress")

    # Surcharger des champs spécifiques
    admin = UserFactory(role="admin", email="admin@example.com")

    # Créer plusieurs en une fois
    tasks = TaskFactory.create_batch(10, project=project)

    # Build (pas d'insertion en DB — pour les tests unitaires)
    user = UserFactory.build()

    # Traits — variations nommées
    class UserFactory(factory.alchemy.SQLAlchemyModelFactory):
        class Meta:
            model = User

        class Params:
            admin = factory.Trait(role="admin", is_staff=True)
            inactive = factory.Trait(is_active=False)

    # Utilisation
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

// Factory avec types TypeScript
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
// Utilisation dans les tests
import { userFactory, projectFactory } from './factories'

describe('ProjectService', () => {
  it('liste uniquement les projets actifs', () => {
    const activeProject = projectFactory.build()
    const archivedProject = projectFactory.build({ archived: true })

    // Construire plusieurs
    const projects = projectFactory.buildList(5)

    // Fusionner les paramètres
    const adminUser = userFactory.build({ role: 'admin', email: 'admin@test.com' })
  })
})

// Avec base de données (exemple Prisma)
const taskFactory = Factory.define<Task, { db: PrismaClient }>(
  ({ transientParams }) => ({
    id:      faker.string.uuid(),
    title:   faker.lorem.sentence(),
    status:  'todo',
    userId:  faker.string.uuid(),
  })
).withDecorator(async (task, { transientParams: { db } }) => {
  // Insérer réellement en DB
  return db.task.create({ data: task })
})

// Insérer en DB
const task = await taskFactory.create({ db: prisma })
```

### Fixtures Pytest avec factories

```python
# conftest.py
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from tests.factories import UserFactory, ProjectFactory, TaskFactory

@pytest.fixture
def db_session(engine):
    # Définir la session pour toutes les factories
    UserFactory._meta.sqlalchemy_session = session
    ProjectFactory._meta.sqlalchemy_session = session
    yield session
    session.rollback()

# Fixtures réutilisables qui utilisent des factories
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

# Utilisation
def test_can_archive_project(project_with_tasks, admin):
    result = archive_project(project_with_tasks.id, by=admin)
    assert result.archived is True
```

### Pattern de fixtures Jest/Vitest

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

// Fixture pour l'isolation des tests
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

### Seeding de base de données

```python
# scripts/seed.py — peupler dev/staging avec des données réalistes
import asyncio
from tests.factories import UserFactory, TeamFactory, ProjectFactory, TaskFactory

async def seed():
    # Créer 10 utilisateurs
    users = UserFactory.create_batch(10)

    # Créer l'admin
    admin = UserFactory(role="admin", email="admin@example.com", name="Admin User")

    # Créer des équipes avec des projets et des tâches
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
    // Créer des utilisateurs
    const users = await Promise.all(
      userFactory.buildList(10).map(u => tx.user.create({ data: u }))
    )

    // Créer des projets pour chaque utilisateur
    for (const user of users) {
      const projects = await Promise.all(
        projectFactory.buildList(3, { userId: user.id })
          .map(p => tx.project.create({ data: p }))
      )

      // Créer des tâches pour chaque projet
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
# Lancer le seed
npx prisma db seed
# ou
python scripts/seed.py
```

### Règles pour de bonnes factories

1. **Valeurs par défaut saines** — chaque champ doit avoir une valeur raisonnable sans surcharge
2. **Unique où nécessaire** — utilisez `factory.Sequence` ou `faker` pour les champs uniques
3. **Pas d'IDs codés en dur** — utilisez des UUIDs générés
4. **Build sans DB par défaut** — utilisez `.build()` pour les tests unitaires, `.create()` uniquement pour les tests d'intégration
5. **Traits pour les variations nommées** — `UserFactory(admin=True)` et non `AdminUserFactory()`
6. **Ne pas embarquer la logique métier** — les factories sont pour les données, pas le comportement

## Exemple

**Utilisateur :** Un test pour un service de commande nécessite : 1 utilisateur, 1 panier avec 3 articles, un code de réduction et un moyen de paiement enregistré — tous liés correctement.

**Configuration attendue avec les factories :**
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
