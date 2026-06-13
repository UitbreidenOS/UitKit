# Befehl vs. Agent vs. Fertigkeit — Wann jeder zu verwenden ist

Claude Code hat drei Primitiven, um sein Verhalten zu erweitern: Fertigkeiten, Agenten und Schrägstrich-Befehle. Sie überlappen in der Oberfläche, daher ist dies die häufigste Verwirrungsquelle beim Aufbau eines Claude Code-Wissenssystems. Dieser Leitfaden beseitigt die Mehrdeutigkeit mit einem präzisen Entscheidungsrahmen.

---

## Die drei Primitiven

### Fertigkeit (Auto-invoked)

- Lebt in `.claude/skills/` als `.md`-Datei mit YAML-Frontmatter
- Claude lädt sie automatisch, wenn die aktuelle Aufgabe semantisch zur Fertigkeit-Beschreibung passt — keine Benutzereingabe erforderlich
- Läuft inline in der aktuellen Konversation — kein separates Kontextfenster wird erstellt
- Die leichtgewichtigste Primitive: teilt den vollständigen Konversationsverlauf, sofortigen Kontext und alle offenen Dateien
- Beste für: Fachkompetenz, wiederkehrende Muster, Codierungskonventionen, Stilanleitungen, API-Redewendungen, projektspezifisches Wissen
- Vermeiden für: Aufgaben, die Isolation benötigen, lange mehrstufige Prozesse, alles, das bewusst ausgelöst werden sollte

Eine Fertigkeit ist im Grunde Sachkompetenz, die in Claudes Denken zum Zeitpunkt der Notwendigkeit eingespritzt wird. Wenn Claude sieht, dass Sie an einer FastAPI-Route arbeiten, wird die `fastapi-crud`-Fertigkeit automatisch geladen und formt die Ausgabe. Keine Invocation erforderlich.

### Agent (Subagent erzeugt)

- Lebt in `agents/` als `.md`-Datei mit YAML-Frontmatter
- Explizit von der übergeordneten Claude-Sitzung via `Agent(subagent_type="name", prompt="...")` erzeugt
- Läuft in einem separaten Kontextfenster — vollständig isoliert von der übergeordneten Konversation
- Kann parallel laufen — mehrere Agenten werden gleichzeitig ausgeführt, während der Parent wartet oder fortsetzt
- Hat seine eigenen Tool-Einschränkungen, Modellauswahl und Aufwandsstufe
- Beste für: Spezialistentätigung, die Isolation benötigt, parallele Ausführung, Aufgaben, wo Zwischenlärm den Hauptkontext nicht verschmutzen sollte, langandauernde Analysen
- Vermeiden für: Aufgaben, die den vollständigen Konversationsverlauf des Parent benötigen (Agenten erhalten nur den Prompt, den Sie ihnen übergeben)

Ein Agent ist ein Auftragnehmer: Sie übergeben ihnen einen Brief und sie arbeiten unabhängig. Sie können Ihren Konversationsverlauf nicht lesen, es sei denn, Sie fügen ihn ausdrücklich in den Prompt ein.

### Schrägstrich-Befehl (Explizit invoked)

- Lebt in `.claude/commands/` als `.md`-Datei
- Benutzer gibt `/command-name` ein, um sie aufzurufen — nie auto-invoked
- Läuft inline in der aktuellen Konversation, wie eine Fertigkeit, benötigt aber expliziten Trigger
- Kann komplexe mehrstufige Workflows als strukturierte Prompts codieren
- Beste für: definierte Workflows, die Benutzer bewusst auslösen — `/code-review`, `/deploy`, `/db-migrate`, `/release-notes`
- Vermeiden für: Fähigkeiten, die automatisch aktiviert werden sollten; alles, das Benutzer vergessen werden zu invoken

Ein Schrägstrich-Befehl ist ein Makro: einen vordefinierten Workflow, den Sie bei Bedarf aufrufen können. Der Benutzer hat immer Kontrolle.

---

## Entscheidungsbaum

Arbeiten Sie diese Fragen in der Reihenfolge durch. Stoppen Sie bei der ersten Übereinstimmung.

```
1. Sollte es automatisch aktiviert werden, ohne dass der Benutzer etwas eingibt?
   JA → Fertigkeit

2. Benötigt es Isolation vom übergeordneten Kontext, oder sollte es parallel
   mit anderen Arbeiten ausgeführt werden?
   JA → Agent

3. Benötigt es ein anderes Modell (Haiku für Kosten, Opus für Reasoning-Tiefe)
   oder eingeschränkten Werkzeugzugriff?
   JA → Agent

4. Ist es ein definierter Workflow, den der Benutzer bewusst nach Name auslöst?
   JA → Schrägstrich-Befehl

5. Ist es reine Fachkompetenz oder ein Muster (keine Ausführung, keine Isolation erforderlich)?
   JA → Fertigkeit (inline)

IMMER UNSICHER → Standard auf Fertigkeit, Eskalation zu Schrägstrich-Befehl, Eskalation zu Agent
               nur wenn Isolation wirklich erforderlich ist
```

---

## Auto-Invocation-Regeln

### Wie Fertigkeiten aktiviert werden

Claude liest das Frontmatter der Fertigkeit beim Session-Start. Das `description` Feld (bis zu ~1.536 Zeichen) ist immer im Speicher. Wenn eine Aufgabe semantisch passt, lädt Claude den vollständigen Fertigkeitskörper.

```yaml
---
description: "Use for FastAPI route handlers, dependency injection, and Pydantic model definitions. Activates when writing Python web API code."
paths:
  - "**/*.py"
when_to_use: "Python web API development with FastAPI"
---
```

- `description` — primäres Matching-Signal; halten Sie es spezifisch, nicht allgemein
- `paths` — Datei-Glob-Filter; Fertigkeit aktiviert sich nur bei Matching-Dateien im Kontext
- `when_to_use` — sekundärer Matching-Hinweis für den Router

Fertigkeiten mit generischen Beschreibungen (`"Use this for Python"`) passen zu breit und werden unnötig geladen. Seien Sie präzise.

### Wie Agenten aufgerufen werden

Agenten werden immer explizit erzeugt. Die übergeordnete Sitzung ruft sie auf.

```python
# Basis-Invocation
Agent(
  subagent_type="security-auditor",
  description="Audit the authentication module for OWASP Top 10 issues",
  prompt="Review /src/auth/ for injection risks, session fixation, and token exposure. Report findings."
)

# Mit Modellüberschreibung
Agent(
  subagent_type="doc-formatter",
  model="haiku",
  prompt="Reformat all docstrings in /src/utils/ to Google style."
)
```

Übergeben Sie `background: true` im Frontmatter (oder setzen Sie es zur Call-Zeit), um den Agenten ohne Blockierung der Parent-Sitzung auszuführen.

---

## Kontext-Isolationsregeln

| Primitive | Sieht Übergeordnete Konversation? | Eigenes Kontextfenster? | Kann parallel ausgeführt werden? |
|-----------|--------------------------|------------------------|---------------------|
| Fertigkeit | Ja — vollständiger Verlauf | Nein | Nein |
| Agent | Nein — nur Prompt | Ja | Ja |
| Schrägstrich-Befehl | Ja — vollständiger Verlauf | Nein | Nein |

Die Isolationsspalte ist der kritische Differentiator. Wenn Ihre Aufgabe Zugriff auf den vollständigen Konversationsverlauf benötigt, verwenden Sie eine Fertigkeit oder einen Schrägstrich-Befehl. Wenn sie nicht durch den übergeordneten Kontext verschmutzt werden sollte (oder neben anderen Aufgaben laufen sollte), verwenden Sie einen Agent.

---

## Leichtgewichtigste Auflösungsreihenfolge

Wenn Sie unsicher sind, verwenden Sie die leichteste Option:

**Fertigkeit → Schrägstrich-Befehl → Agent**

Beginnen Sie mit einer Fertigkeit. Wenn die Fähigkeit nicht zuverlässig auto-invoken werden kann (zu kontextabhängig, zu explizit), wechseln Sie zu einem Schrägstrich-Befehl. Eskalieren Sie nur zu einem Agenten, wenn Isolation oder Parallelismus wirklich zählt. Agenten kosten ein zusätzliches Kontextfenster und erfordern explizites Übergeben von Kontext — sie sind teurer in Tokens und Komplexität.

---

## Praktische Beispiele

### Beispiel 1: REST-API-Namenskonventionen

> "Ich möchte, dass Claude beim Schreiben von Routes immer unsere internen REST-Endpunkt-Namenskonventionen einhält."

**Antwort: Fertigkeit**

Das ist reine Fachkompetenz. Sie sollte automatisch aktiviert werden, wann immer Claude Route-Handler schreibt. Kein Benutzer-Trigger erforderlich, keine Isolation erforderlich. Erstellen Sie `.claude/skills/rest-conventions.md` mit Ihren Namensregeln und Datei-Glob `paths: ["**/*.py", "**/*.ts"]`.

### Beispiel 2: Paralleles Sicherheits-Audit während Entwicklung

> "Ich möchte ein vollständiges Sicherheits-Audit des Auth-Moduls durchführen, während ich weiterhin am Feature arbeite."

**Antwort: Agent**

Das Audit ist eine Spezialist-Langzeitaufgabe. Sie sollte keinen Lärm in der Hauptkonversation erzeugen. Sie kann parallel laufen, während der Entwickler weiterarbeitet. Setzen Sie `background: true` und `model: opus` im Agent-Frontmatter. Übergeben Sie den Audit-Umfang im Prompt.

### Beispiel 3: Bereitstellungs-Workflow

> "Ich möchte einen Befehl, der Tests ausführt, das Docker-Abbild erstellt und in die Registry pusht."

**Antwort: Schrägstrich-Befehl**

Das ist ein vorsätzlich, bewusst ausgelöster Workflow. Der Entwickler möchte `/deploy` eingeben, wenn bereit — nicht auto-trigger. Erstellen Sie `.claude/commands/deploy.md` mit dem vollständigen mehrstufigen Workflow, der als strukturierte Anweisungen codiert ist.

---

## Token-Kosten-Vergleich

Das Verständnis der Startup-Kosten hilft zu entscheiden, ob eine Fertigkeit aggressiv oder sparsam verwendet wird.

| Primitive | Startup-Kosten | Matching-Kosten | Anmerkungen |
|-----------|-------------|---------------|-------|
| Fertigkeit-Beschreibung | ~50–100 Tokens | Immer im Kontext | Halten Sie Beschreibungen kurz und spezifisch |
| Fertigkeit Volltext | ~200–2.000 Tokens | Geladen bei Semantik-Matching | Lädt nur bei Bedarf |
| Agent | 0 beim Start | Bezahlt bei Erzeugung | Separates Kontextfenster |
| Schrägstrich-Befehl | 0 beim Start | Bezahlt bei Invocation | Geladen bei `/command` |

Fertigkeiten verursachen kleine, aber konstante Startup-Kosten für jede Sitzung. Wenn Sie 40 Fertigkeiten mit 100-Token-Beschreibungen haben, das sind 4.000 Token Overhead vor der ersten Benutzer-Nachricht. Auditieren Sie die Fertigkeits-Beschreibungen und halten Sie sie eng. Agenten und Schrägstrich-Befehle kosten nichts bis zur expliziten Verwendung.

---
