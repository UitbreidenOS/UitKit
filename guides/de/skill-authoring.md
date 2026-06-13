# Leitfaden zur Skill-Erstellung

Wie man eine Claude Code-Skill schreibt, die tatsächlich funktioniert — präzise Trigger, echte Muster, kein Füllmaterial.

---

## Was eine Skill ist

Eine Skill ist eine Markdown-Datei, die in `.claude/skills/` abgelegt wird und zu einem Slash-Befehl in Claude Code wird. Wenn Sie `/skill-name` eingeben, liest Claude die Datei und verwendet deren Inhalt, um die Sitzung zu leiten.

Eine Skill ist **kein** Prompt-Template. Es ist ein strukturierter Satz von Anweisungen, der:
- Claude mitteilt, wann er aktiv werden und wann er sich zurückhalten soll
- Domänenspezifische Muster bereitstellt, die Claude standardmäßig nicht anwenden würde
- Einschränkungen und Anti-Muster für einen bestimmten Aufgabentyp festlegt

---

## Dateiort und Benennung

| Geltungsbereich | Pfad |
|---|---|
| Projektebene | `.claude/skills/<skill-name>.md` |
| Persönlich (alle Projekte) | `~/.claude/skills/<skill-name>.md` |

Benennungsregeln:
- Nur `kebab-case.md`
- Der Name sollte dem gewünschten Slash-Befehl entsprechen: `fastapi-crud.md` → `/fastapi-crud`
- Seien Sie spezifisch: `django-migrations.md` ist besser als `django.md`

---

## Die erforderliche Struktur

Jede Skill muss diese vier Abschnitte in dieser Reihenfolge haben:

```markdown
# Skill-Name

## When to activate
[Spezifische Auslösebedingungen]

## When NOT to use
[Anti-Muster — wenn diese Skill das falsche Werkzeug ist]

## Instructions
[Der Skill-Inhalt]

## Example
[Mindestens ein konkretes Beispiel]
```

Fügen Sie keine weiteren Abschnitte ohne triftigen Grund hinzu. Kürze ist eine Funktion.

---

## "When to activate" schreiben

Dies ist der wichtigste Abschnitt. Er bestimmt, ob Claude die Skill korrekt anwendet oder ignoriert.

**Schlecht — zu vage:**
```markdown
## When to activate
When working with Python APIs.
```

**Gut — spezifisch und umsetzbar:**
```markdown
## When to activate
- Building a new FastAPI endpoint (GET, POST, PUT, DELETE)
- Adding request validation with Pydantic models
- Implementing dependency injection in FastAPI routes
- Writing async route handlers with background tasks
```

Regeln:
- Verwenden Sie Aufzählungspunkte, einen Trigger pro Zeile
- Seien Sie konkret bezüglich der Aufgabe, nicht der Technologie
- Wenn es nur für neuen Code im Vergleich zu bestehendem Code gilt, sagen Sie es explizit

---

## "When NOT to use" schreiben

Dieser Abschnitt verhindert, dass Claude die Skill im falschen Kontext anwendet. Lassen Sie ihn weg und die Skill wird zum Rauschen.

**Beispiel für eine FastAPI-Skill:**
```markdown
## When NOT to use
- Existing Flask or Django projects — use the appropriate skill instead
- Simple scripts that don't need an API layer
- When the user has already defined their own router structure — follow it rather than imposing this pattern
- gRPC or GraphQL APIs — different paradigms, different skills
```

---

## Die Anweisungen schreiben

Hier liegt der Wert der Skill. Schreiben Sie sie als direkte Anweisungen an Claude, nicht als Dokumentation.

**Prinzipien:**

1. **Seien Sie direktiv, nicht beschreibend.** Sagen Sie Claude, was er *tun* soll, nicht was die Technologie *ist*.

   Schlecht: "FastAPI uses Pydantic for validation."
   Gut: "Always define a Pydantic model for request bodies. Never accept raw dicts."

2. **Kodieren Sie Entscheidungen.** Eine Skill sollte Mehrdeutigkeit auflösen, nicht erzeugen.

   Schlecht: "Use appropriate error handling."
   Gut: "Raise `HTTPException` with status 422 for validation errors, 404 for not-found, 500 only for unexpected failures. Never let exceptions propagate to the response."

3. **Schließen Sie das Nicht-Offensichtliche ein.** Wenn ein Muster offensichtlich ist, weiß Claude es bereits. Skills gewinnen ihren Wert, indem sie kodieren, was leicht falsch gemacht wird.

4. **Referenzieren Sie echte Claude Code-Fähigkeiten.** Eine Skill kann Claude anweisen, spezifische Tools zu verwenden, Unter-Agenten zu starten oder Hooks auszulösen — nutzen Sie das.

5. **Halten Sie es scanbar.** Verwenden Sie Überschriften, Aufzählungspunkte und Code-Blöcke. Claude liest die gesamte Datei, wendet sie aber besser an, wenn die Struktur klar ist.

---

## Das Beispiel schreiben

Das Beispiel ist nicht optional. Es verankert die Skill in der Realität und zeigt Claude die erwartete Ausgabequalität.

Ein gutes Beispiel enthält:
- Den Benutzer-Prompt, der die Skill auslösen würde
- Die erwartete Ausgabestruktur (nicht notwendigerweise vollständiger Code — Struktur ist wichtiger)
- Alle Einschränkungen, die das Beispiel demonstriert

---

## Skill-Länge

| Skill-Typ | Ziellänge |
|---|---|
| Fokussierte Aufgaben-Skill | 50–150 Zeilen |
| Domänen-Skill (breit) | 150–300 Zeilen |
| Workflow-Skill | 300–500 Zeilen |

Wenn Ihre Skill 500 Zeilen überschreitet, teilen Sie sie in zwei fokussierte Skills auf. Lange Skills verdünnen Claudes Aufmerksamkeit.

---

## Ihre Skill testen

Bevor Sie an Claudient einreichen:

1. Kopieren Sie die Skill in das `.claude/skills/` eines echten Projekts
2. Öffnen Sie Claude Code und lösen Sie sie mit dem Slash-Befehl aus
3. Geben Sie Claude eine Aufgabe, die Ihren "When to activate"-Bedingungen entspricht
4. Überprüfen Sie, ob Claude die Muster aus Ihrem Abschnitt Instructions anwendet
5. Geben Sie Claude eine Aufgabe, die Ihren "When NOT to use"-Bedingungen entspricht
6. Überprüfen Sie, ob Claude die Muster der Skill NICHT anwendet

Eine Skill, die Schritt 5 besteht aber bei Schritt 6 scheitert, benötigt einen spezifischeren Trigger.

---

## Häufige Fehler

**Die Technologie beschreiben statt das Verhalten zu leiten**
Skills, die wie Dokumentation klingen, helfen Claude nicht. Claude weiß bereits, was FastAPI ist. Sagen Sie ihm, wie *Sie* es verwenden möchten.

**Zu breite Trigger**
`## When to activate: When writing Python` wird bei allem auslösen. Grenzen Sie es ein.

**Fehlende Anti-Muster**
Ohne "When NOT to use" kann Claude Ihre Skill in Kontexten anwenden, wo sie Schaden anrichtet.

**Kein Beispiel**
Beispiele sind der schnellste Weg für Claude, sich auf Ihre erwartete Ausgabequalität zu kalibrieren.

**Allgemeine Best Practices importieren**
Eine Skill voller allgemeiner Coding-Ratschläge (Typ-Annotationen verwenden, Tests schreiben, Fehler behandeln) fügt Rauschen hinzu. Diese gehören in `rules/`, nicht in Skills.

---

## Arbeiten Sie mit uns





---

## Skill-Vorlage

```markdown
# [Skill-Name]

## When to activate
- [Spezifischer Trigger 1]
- [Spezifischer Trigger 2]
- [Spezifischer Trigger 3]

## When NOT to use
- [Anti-Muster 1]
- [Anti-Muster 2]

## Instructions

### [Unterthema 1]
[Direktive Anweisungen]

### [Unterthema 2]
[Direktive Anweisungen]

## Example

**User:** [Beispiel-Prompt]

**Expected output:**
[Erwartete Struktur oder Code]
```
