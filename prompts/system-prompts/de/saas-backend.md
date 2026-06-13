> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../saas-backend.md).

# CLAUDE.md Starter — SaaS Backend

Dies in die `CLAUDE.md` des Projekts einfügen und die Abschnitte in eckigen Klammern ausfüllen.

---

```markdown
# [Projektname] — Claude Code Anweisungen

## Was das ist
[Ein Absatz: was das Produkt tut, wer es verwendet, welches Problem es löst]

## Stack
- Sprache: [TypeScript / Python / Go]
- Framework: [Express / FastAPI / Gin / NestJS]
- Datenbank: [PostgreSQL via Prisma / raw pg / SQLAlchemy]
- Auth: [JWT mit 15-min Access Tokens + 7-Tage Refresh Tokens / Clerk / Auth0]
- Cache: [Redis]
- Queue: [BullMQ / SQS / Celery]
- Deployment: [AWS ECS / Fly.io / Railway]

## Projektstruktur
src/
├── api/          ← Route-Handler — dünn, delegieren an Services
├── services/     ← Business-Logik — keine HTTP-Belange
├── db/           ← Datenbankabfragen — keine Business-Logik
├── middleware/   ← Auth, Rate Limiting, Fehlerbehandlung
├── models/       ← Typdefinitionen und Schemas
└── utils/        ← Reine Funktionen, keine Nebeneffekte

## Konventionen
- Route-Handler sind dünn: Eingabe validieren, Service aufrufen, Antwort zurückgeben
- Services enthalten alle Business-Logik: sie kennen kein HTTP
- DB-Layer enthält nur Abfragen: keine Business-Logik, keine HTTP-Belange
- Alle Datenbankzugriffe gehen durch den db/-Layer — niemals ORM direkt aus Services aufrufen
- Fehler propagieren nach oben mit Kontext — niemals stillschweigend schlucken
- Alle API-Routes zurückgeben: 200 (Erfolg), 201 (erstellt), 204 (kein Inhalt), 400 (schlechte Eingabe), 401 (unauth), 403 (verboten), 404 (nicht gefunden), 409 (Konflikt), 422 (Validierung), 500 (unerwartet)

## Entscheidungen (nicht neu diskutieren)
- [Auth-Mechanismus entschieden: JWT, keine Sessions]
- [ORM-Wahl: Prisma — kein rohes SQL außer für komplexe Analytics-Abfragen]
- [Fehlerformat: { error: string, code: string } — Form niemals ändern]
- [Keine Barrel-Dateien — direkt aus der Quelle importieren]

## Tests
- Integrationstests treffen eine echte Test-Datenbank — keine DB-Mocks
- Unit-Tests für reine Business-Logik in services/
- Testdatei: [dateiname].test.ts neben der Quelldatei
- Ausführen: npm test

## Befehle
- npm run dev — Entwicklungsserver mit Hot Reload starten
- npm test — alle Tests ausführen
- npm run build — Produktions-Build
- npm run lint — ESLint + Prettier-Prüfung
- npm run db:migrate — ausstehende Migrationen ausführen
- npm run db:seed — Entwicklungsdaten seeden

## Niemals tun
- Niemals Business-Logik in Route-Handlern
- Niemals die Datenbank direkt aus Route-Handlern aufrufen
- Niemals rohe Datenbankfehler an Clients zurückgeben
- Niemals .env-Dateien committen
- Niemals `any`-Typ in TypeScript verwenden
```

---
