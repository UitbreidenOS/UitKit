> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../saas-backend.md).

# CLAUDE.md Starter — SaaS Backend

Zet dit in de `CLAUDE.md` van je project en vul de secties tussen haakjes in.

---

```markdown
# [Projectnaam] — Claude Code Instructies

## Wat dit is
[Eén alinea: wat het product doet, wie het gebruikt, welk probleem het oplost]

## Stack
- Taal: [TypeScript / Python / Go]
- Framework: [Express / FastAPI / Gin / NestJS]
- Database: [PostgreSQL via Prisma / raw pg / SQLAlchemy]
- Auth: [JWT met 15-min access tokens + 7-dag refresh tokens / Clerk / Auth0]
- Cache: [Redis]
- Queue: [BullMQ / SQS / Celery]
- Deployment: [AWS ECS / Fly.io / Railway]

## Projectstructuur
src/
├── api/          ← Route-handlers — slank, delegeer aan services
├── services/     ← Bedrijfslogica — geen HTTP-concerns
├── db/           ← Databasequeries — geen bedrijfslogica
├── middleware/   ← Auth, rate limiting, foutafhandeling
├── models/       ← Typedefinities en schema's
└── utils/        ← Pure functies, geen bijeffecten

## Conventies
- Route-handlers zijn slank: invoer valideren, service aanroepen, antwoord retourneren
- Services bevatten alle bedrijfslogica: ze weten niet van HTTP
- DB-laag bevat alleen queries: geen bedrijfslogica, geen HTTP-concerns
- Alle databasetoegang gaat via de db/-laag — roep ORM nooit direct aan vanuit services
- Fouten propageren naar boven met context — slik nooit stilletjes in
- Alle API-routes retourneren: 200 (succes), 201 (aangemaakt), 204 (geen inhoud), 400 (slechte invoer), 401 (niet auth), 403 (verboden), 404 (niet gevonden), 409 (conflict), 422 (validatie), 500 (onverwacht)

## Beslissingen (niet opnieuw bespreken)
- [Auth-mechanisme besloten: JWT, geen sessies]
- [ORM-keuze: Prisma — geen ruwe SQL behalve voor complexe analysequeries]
- [Foutformaat: { error: string, code: string } — wijzig de shape nooit]
- [Geen barrel-bestanden — importeer direct vanuit bron]

## Testen
- Integratietests raken een echte testdatabase — geen DB-mocks
- Unittests voor pure bedrijfslogica in services/
- Testbestand: [bestandsnaam].test.ts naast het bronbestand
- Uitvoeren: npm test

## Commando's
- npm run dev — start ontwikkelingsserver met hot reload
- npm test — alle tests uitvoeren
- npm run build — productiebuild
- npm run lint — ESLint + Prettier controle
- npm run db:migrate — uitstaande migraties uitvoeren
- npm run db:seed — ontwikkelingsdata seeden

## Nooit doen
- Nooit bedrijfslogica in route-handlers plaatsen
- Nooit de database direct aanroepen vanuit route-handlers
- Nooit ruwe databasefouten retourneren aan clients
- Nooit .env-bestanden committen
- Nooit `any`-type gebruiken in TypeScript
```

---
