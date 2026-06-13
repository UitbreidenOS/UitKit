---
name: adr-writer
description: "Architekturentscheidungsdatensätze im Nygard-Format schreiben. Auslöser bei architektonischen Entscheidungen, Ansatzvergleichen oder nicht dokumentierten vergangenen Entscheidungen."
---

# ADR Writer

## Wann aktivieren

- Entscheidung zwischen zwei oder mehr technischen Ansätzen treffen (z. B. ORM wählen, Cache-Strategie wählen, Warteschlangensystem wählen)
- Nachdem eine Entscheidung mündlich in einem Meeting oder Chat getroffen wurde und formale Dokumentation benötigt
- Wenn die Codebasis ein ungewöhnliches Muster zeigt und es keine Erklärung für die Wahl gibt
- Vor dem Festlegen auf eine schwer rückgängig zu machende architektonische Änderung (Datenbankschema, Authentifizierungsmodell, API-Versionierung)
- Wenn eine Entscheidung mehrere Teams oder Services betrifft und einen klaren Audit-Trail benötigt

## Wann nicht verwenden

- Implementierungsdetails, die leicht ohne Auswirkungen änderbar sind (Variablenbenennung, Ordnerstruktur innerhalb eines Moduls)
- Rein stilistische Entscheidungen ohne Kompromisse
- Abhängigkeitsversionsaktualisierungen von Drittanbietern, es sei denn, sie führen zu brechenden Verhaltensweisen
- Entscheidungen, die in weniger als einer Stunde ohne nachgelagerte Auswirkungen vollständig rückgängig gemacht werden können

## Anweisungen

### Was qualifiziert sich als ADR

Eine Entscheidung benötigt einen ADR, wenn alle drei Punkte wahr sind:
1. Sie ist **schwer rückgängig zu machen** — das Rückgängigmachen erfordert erheblichen Aufwand oder hat Auswirkungen
2. Sie wäre **überraschend ohne Kontext** — ein neuer Entwickler, der den Code liest, würde sich fragen, warum
3. Ein **echter Kompromiss existierte** — mindestens eine plausible Alternative wurde in Betracht gezogen und verworfen

Im Zweifelsfall ADR schreiben. Die Kosten für die Dokumentation eines Nicht-Ereignisses sind gering; die Kosten für die fehlende Dokumentation einer wichtigen Entscheidung sind hoch.

### ADR-Format (Nygard)

```markdown
# ADR-[NNNN]: [Kurztitel in Nominalform]

**Datum:** [YYYY-MM-DD]
**Status:** [Akzeptiert | Ersetzt durch ADR-NNNN | Veraltet]
**Ersetzt:** [ADR-NNNN falls anwendbar, ansonsten auslassen]

## Kontext

[2–4 Sätze: Welche Situation oder welches Problem hat diese Entscheidung erzwungen?
Relevante Einschränkungen einbeziehen: Teamgröße, Zeitrahmen, vorhandener Stack, externe Anforderungen.]

## Entscheidung

[Ein Satz, aktive Stimme, Präsens.
"Wir werden X für Y verwenden, weil Z." Nicht "Es wurde entschieden, dass..."]

## Begründung

[Warum diese Option gegenüber den Alternativen?
Konzentrieren Sie sich auf die spezifischen Faktoren, die diese Wahl für diesen Kontext richtig machten.
Generisches Lob vermeiden — "es ist beliebt" ist keine Begründung.]

## Berücksichtigte Alternativen

| Option | Grund für Ablehnung |
|---|---|
| [Alternative A] | [Spezifischer Grund für Ablehnung] |
| [Alternative B] | [Spezifischer Grund für Ablehnung] |

## Konsequenzen

**Positiv:**
- [Was dies leichter oder besser macht]

**Negativ:**
- [Was dies schwieriger macht oder neue Komplexität einführt]

**Neutral:**
- [Änderungen, die weder gut noch schlecht sind, nur unterschiedlich]

## Überprüfungsdatum

[Datum 6–12 Monate ab jetzt, oder das Ereignis, das eine Überprüfung auslösen sollte: "Überprüfen wenn Team 10 Ingenieure übersteigt" oder "Überprüfen nach dem ersten Produktionsincident mit X"]
```

### Speicherung und Nummerierung

- In `docs/decisions/` oder `docs/adr/` speichern — eine wählen und nie mischen
- Dateiname: `ADR-0001-kebab-case-titel.md`, `ADR-0002-...`
- Nummerierung ist sequenziell und wird nie wiederverwendet — selbst wenn ein ADR veraltet ist
- Beim Ersetzen eines ADR: Status des alten ADR auf `Ersetzt durch ADR-NNNN` aktualisieren, neuen ADR auf den alten verlinken

### Ersetzte ADRs verlinken

Wenn sich eine Entscheidung ändert:
```markdown
# ADR-0007: Von REST zu GraphQL für Client-API wechseln

**Status:** Akzeptiert
**Ersetzt:** ADR-0003 (REST-first API-Design)
```

Und den alten ADR aktualisieren:
```markdown
**Status:** Ersetzt durch ADR-0007
```

### Was man NICHT einbeziehen sollte

- Implementierungsdetails (Bibliotheksversion, genaue Konfigurationswerte) — diese gehören zum README oder zu Inline-Kommentaren
- Namen von Teamkollegen — Rollen verwenden ("Backend-Team", "CTO"), wenn eine Zuordnung erforderlich ist
- Vorhersagen über die Zukunft — sich an bekannte Informationen halten
- Kopierter Text von einer Vendor-Website

## Beispiel

**Szenario:** Das Team wählte Drizzle ORM statt Prisma für ein neues TypeScript-Projekt.

**Generierter ADR:**

```markdown
# ADR-0004: Drizzle ORM statt Prisma für Datenzugriffsschicht

**Datum:** 2026-05-23
**Status:** Akzeptiert

## Kontext

Auswahl eines ORM für eine neue TypeScript-API, die mit PostgreSQL interagiert.
Das Projekt hat ein kleines Team (2 Ingenieure), strenge Leistungsanforderungen bei Massen-Insert-Operationen und ein bereits als SQL-Migrationen definiertes Schema.
Das Team hat vorherige Erfahrung mit beiden Optionen.

## Entscheidung

Wir werden Drizzle ORM für alle Datenbankzugriffe verwenden, da es uns typsichere Abfragen ohne Codegenerierungsschritt gibt und Raw-SQL nicht abstrahiert, wenn wir es benötigen.

## Begründung

Drizzle behandelt SQL als die Wahrheitsquelle, was zu unseren bestehenden, handgeschriebenen Migrationsdateien passt. Prismas Schema-first-Modell würde die Verdopplung von Tabledefinitionen erfordern. Bei Massen-Insert-Benchmarks mit unserer Zieldataset-Größe (500k Zeilen/Batch) war Drizzle in unserem Prototyp 2,3× schneller.
Der generierte Prisma-Client fügt ~100ms kalten Start hinzu, was in unserem Serverless-Bereitstellungskontext wichtig ist.

## Berücksichtigte Alternativen

| Option | Grund für Ablehnung |
|---|---|
| Prisma 5 | Codegenerierungsschritt fügt CI-Komplexität hinzu; schema-first widerspricht unseren bestehenden SQL-Migrationen; langsamerer kalter Start |
| Raw pg-Client | Zu viel Boilerplate für Abfrageerstellung; keine Typinferenz auf Abfrageergebnisse |
| Kysely | Starker Kandidat — nur abgelehnt, weil Team keine vorherige Kysely-Erfahrung hat und Drizzles API vertrauter ist |

## Konsequenzen

**Positiv:**
- Abfrageergebnisse sind ohne Build-Schritt typsicher
- Direkte SQL-Flucht verfügbar, ohne den ORM zu verlassen
- Kleinere Bundle-Größe als Prisma

**Negativ:**
- Drizzles Ökosystem ist kleiner als Prismas — weniger Community-Plugins
- Migrations-Tools (drizzle-kit) sind weniger reif als Prisma Migrate

**Neutral:**
- Team muss Drizzles Query-Builder-Syntax erlernen

## Überprüfungsdatum

2027-05-23, oder wenn eine Prisma-6-Version das Problem des kalten Starts erheblich adressiert.
```

---
