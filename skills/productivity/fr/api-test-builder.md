---
name: api-test-builder
description: "Generate comprehensive API test suites from route definitions: auth coverage, input validation, error codes, pagination, and rate limiting — for Next.js, Express, FastAPI, and Django"
---

# Compétence Générateur de Tests API

## Quand l'activer
- Ajouter des tests à une API qui n'en a pas (génération de couverture de base)
- Écrire des tests pour un nouveau point de terminaison API avant ou après l'implémentation (TDD ou rétrofit)
- Génération de tests d'entrée adversarial pour une revue de sécurité
- S'assurer que chaque route a une couverture d'authentification, de validation et de code d'erreur
- Vérification de régression pré-lancement sur tous les itinéraires API

## Quand NE PAS l'utiliser
- Tests d'interface utilisateur E2E — utilisez la compétence playwright-pro
- Tests unitaires pour la logique métier — utilisez la compétence test-generator
- Tests de performance/charge — utilisez la compétence performance-profiler
- Test de contrat entre microservices (Pact) — modèle différent

## Instructions

### Découverte d'itinéraire

```
Discover and list all API routes in [project].

Framework: [Next.js App Router / Express / FastAPI / Django REST / Hono / Fastify]
Project root: [path]

Next.js App Router:
find ./app/api -name "route.ts" -o -name "route.js" | sort
# Then for each file, extract HTTP methods:
grep -n "export.*function\|export const" app/api/**/route.ts | grep -E "(GET|POST|PUT|PATCH|DELETE)"

Express:
grep -rn "router\.\(get\|post\|put\|patch\|delete\)" src/routes/ | grep -v "test"

FastAPI:
grep -rn "@app\.\|@router\." app/ | grep -E "(get|post|put|patch|delete)\("

Django:
grep -rn "path\|re_path\|url" */urls.py

Output the route inventory table:
| Method | Path | Auth required | Description |
|---|---|---|---|
| GET | /api/users | Yes | List users |
| POST | /api/users | Yes (admin) | Create user |
| GET | /api/users/:id | Yes | Get user |
| PUT | /api/users/:id | Yes (owner or admin) | Update user |
| DELETE | /api/users/:id | Yes (admin) | Delete user |

Generate the route inventory for my project.
```

### Génération de suite de tests

```
Generate a test suite for [endpoint or route group].

Endpoint: [METHOD /path — e.g. POST /api/orders]
Framework: [Node.js/Vitest+Supertest / Python/pytest+httpx]
Auth mechanism: [JWT Bearer / API Key / Session cookie]
Request schema: [describe fields and types]
Response schema: [describe success response shape]

Test categories to generate:

1. HAPPY PATH:
   - Valid request with all required fields → 200/201
   - Valid request with all optional fields
   - Valid request minimum required only

2. AUTHENTICATION:
   - No auth header → 401
   - Invalid/expired token → 401
   - Valid token, wrong role/permission → 403

3. INPUT VALIDATION:
   - Missing required field → 400/422
   - Wrong type (string where number expected) → 400/422
   - Below minimum value/length → 400/422
   - Above maximum value/length → 400/422
   - Special characters in text fields (XSS attempt) → should sanitise or reject
   - SQL injection attempt in string fields → should be safe (parameterised)
   - Empty string where non-empty required → 400/422
   - Null where non-null required → 400/422

4. BUSINESS LOGIC:
   - Duplicate creation (same unique identifier) → 409
   - Reference to non-existent resource → 404
   - State machine violation (e.g. cancel an already-cancelled order) → 409/422

5. PAGINATION (for list endpoints):
   - First page (page=1, limit=20)
   - Last page (empty results)
   - Oversized page (limit=10000) → should cap at max
   - Invalid page number (page=-1, page=abc) → 400

Node.js test template (Vitest + Supertest):
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

describe('POST /api/orders', () => {
  const validToken = 'Bearer test-jwt-token'; // use test fixture

  describe('Authentication', () => {
    it('returns 401 when no auth header', async () => {
      const res = await request(app).post('/api/orders').send({ productId: '123' });
      expect(res.status).toBe(401);
    });

    it('returns 401 when token is expired', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', 'Bearer expired.token.here')
        .send({ productId: '123' });
      expect(res.status).toBe(401);
    });
  });

  describe('Input validation', () => {
    it('returns 422 when productId is missing', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', validToken)
        .send({});
      expect(res.status).toBe(422);
      expect(res.body).toMatchObject({ error: expect.stringContaining('productId') });
    });

    it('returns 422 when quantity is negative', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', validToken)
        .send({ productId: '123', quantity: -1 });
      expect(res.status).toBe(422);
    });
  });

  describe('Happy path', () => {
    it('creates an order and returns 201 with order ID', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', validToken)
        .send({ productId: 'product-123', quantity: 2 });
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        orderId: expect.stringMatching(/^ord_/),
        status: 'pending',
      });
    });
  });

  describe('Business logic', () => {
    it('returns 404 when product does not exist', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', validToken)
        .send({ productId: 'nonexistent', quantity: 1 });
      expect(res.status).toBe(404);
    });
  });
});

Generate the test suite for my endpoint.
```

### Cas de test axés sur la sécurité

```
Generate adversarial input tests for [API].

Endpoints to test: [list or describe]
Framework: [Node.js / Python]
Known sensitive fields: [fields that handle user-controlled input]

Security test patterns:

SQL INJECTION attempts (all should return 400/422, never a 500 or data):
inputs = [
    "'; DROP TABLE users; --",
    "' OR '1'='1",
    "1; SELECT * FROM pg_catalog.pg_tables",
    "' UNION SELECT NULL, NULL, NULL--",
]

XSS attempts (should be sanitised or rejected):
inputs = [
    "<script>alert('xss')</script>",
    "javascript:alert(1)",
    "<img src=x onerror=alert(1)>",
    "';alert('xss')//",
]

Path traversal (for file-handling endpoints):
inputs = [
    "../../../etc/passwd",
    "..\\..\\windows\\system32\\config\\sam",
    "%2e%2e%2f%2e%2e%2fetc%2fpasswd",
]

Oversized inputs (test for DoS / buffer overflow):
inputs = [
    "A" * 100_000,   # 100KB string
    {"key": "A" * 1_000_000},  # 1MB JSON
]

Expected: all adversarial inputs return 400/422/413 without:
- Returning a 500 error (which reveals internal state)
- Including the malicious input in the error message (reflected XSS)
- Actually executing the SQL or shell command
- Creating a large computation or memory spike

Generate security tests for my API endpoints.
```

### Modèle de rapport de couverture

```
Generate an API test coverage report for [project].

Total endpoints: [X]
Tested endpoints: [X]
Coverage by category:

| Endpoint | Auth test | Validation test | Happy path | Error paths | Score |
|---|---|---|---|---|---|
| GET /users | ✅ | N/A | ✅ | ✅ 404 | 3/3 |
| POST /users | ✅ | ✅ | ✅ | ✅ 409 | 4/4 |
| DELETE /users/:id | ✅ | N/A | ✅ | ❌ missing 404 | 2/3 |

Coverage gaps (ordered by risk):
🔴 HIGH: [endpoint] — no auth test (any caller can hit this)
🔴 HIGH: [endpoint] — no validation test (injection risk)
🟡 MEDIUM: [endpoint] — no 404 test (may reveal existence of resources)
🟢 LOW: [endpoint] — no pagination test

Identify the coverage gaps in my test suite and prioritise what to add.
```

## Exemple

**Utilisateur:** Nouvelle API Express.js avec 12 points de terminaison. Zéro tests. Nous déployons en production en 2 semaines. Quel est le chemin le plus rapide pour une couverture significative?

**Plan de triage de Claude:**

Ne essayez pas d'écrire des tests pour les 12 points de terminaison en 2 semaines si vous devez aussi livrer le produit. Sélectionnez les 4 à plus haut risque, obtenez une couverture complète.

**Ordre de priorité (risque le plus élevé d'abord):**

1. **Points de terminaison d'authentification** (`POST /auth/login`, `POST /auth/refresh`) — si ceux-ci sont cassés, rien ne fonctionne ou tout est accessible. Test: identifiants invalides → 401, token expiré → 401, connexion valide → 200 avec token.

2. **Tout point de terminaison qui écrit dans la base de données** — testez spécifiquement: champs requis manquants → 422, types invalides → 422, création en double → 409. Un point de terminaison d'écriture mal validé = risque de corruption de données.

3. **Tout point de terminaison gérant l'argent ou les données personnelles** — vérifiez à nouveau l'authentification + validation des données. Ce sont les points de terminaison que les attaquants ciblent en premier.

4. **Votre point de terminaison le plus complexe** (celui avec le plus de logique métier) — c'est où les bugs se cachent.

**Configuration de test la plus rapide pour Express:**
```bash
npm install -D vitest supertest @types/supertest
```

```typescript
// vitest.config.ts
export default { test: { environment: 'node' } }

// test/auth.test.ts — 30 minutes to write, covers 80% of auth risk
```

Écrivez des tests d'authentification aujourd'hui. Écrivez des tests de validation de point de terminaison d'écriture demain. Les 8 autres points de terminaison peuvent attendre après le lancement — mais ces 4 ne peuvent pas.

---
