# RIPER — Strukturiertes agentisches Coding-Framework

RIPER ist ein 5-Phasen-Framework für komplexe Feature-Entwicklung: Research, Innovate, Plan, Execute, Review. Jede Phase hat einen strengen Modus, definierte Ein- und Ausgaben und eine explizite Grenze, die nicht überschritten werden kann, bis die Phase abgeschlossen ist.

---

## Warum RIPER

Scope Creep ist der primäre Fehlermodus für agentisches Coding. Ohne explizite Phase-Grenzen springt Claude von der Datei-Lektüre zu einem vollständigen Refactoring zu dem Starten einer Implementierung — alles in einer Nachricht. Das Ergebnis sieht wie Fortschritt aus, erzeugt aber Code, der nicht den Anforderungen entspricht, enthält ungereviewte Architektur-Entscheidungen und ist schwer zu korrigieren, weil das Denken implizit stattgefunden hat.

RIPER erzwingt explizite Phase-Deklarationen. Jede Phase hat genau eine Aufgabe. Eine Phase-Grenze zu verletzen ist ein Protokoll-Fehler — nicht nur eine Style-Preference.

---

## Mode Declaration

Jede Phase beginnt mit einer expliziten Mode-Deklaration:

```
I am now in RESEARCH mode.
```

Diese Deklaration ist nicht zeremoniel. Es ist eine Verpflichtung: In diesem Mode führe ich genau das aus, was diese Phase verlangt und nichts anderes. Mode-Deklarationen machen Phase-Übergänge im Gespräch sichtbar und zwingen die Frage "bin ich wirklich mit der vorherigen Phase fertig?"

---

## Phase 1: Research

**Eine Aufgabe:** Kontext sammeln. Keine Lösungen, keine Vorschläge, keine Meinungen.

### Was sammeln

- Codebase-Struktur: relevante Dateien, vorhandene Patterns, Einstiegspunkte
- Einschränkungen: vorhandene Interfaces, die beibehalten werden müssen, Performance-Anforderungen, Sicherheits-Grenzen
- Abhängigkeiten: worauf dieses Feature angewiesen ist; was von ihm abhängt
- Prior art: ähnliche Features, die bereits gebaut wurden; verwendete Patterns an anderer Stelle der Codebase

### Ausgabe

Ein **Kontext-Zusammenfassungs-Dokument** enthaltend:
- Liste relevanter Dateien mit Einzeiler-Beschreibungen
- Wichtige Patterns im Einsatz (Naming-Konventionen, Error-Handling, Daten-Flow)
- Identifizierte Einschränkungen
- Offene Fragen (Dinge, die nicht allein aus der Codebase beantwortet werden können)

### Anti-pattern

Lösungen während Research vorzuschlagen. In dem Moment, in dem ein Gedanke mit "wir könnten..." oder "der beste Ansatz wäre..." beginnt, wurde Research-Mode gebrochen. Protokollieren Sie den Gedanken als offene Frage und machen Sie weiter mit dem Sammeln.

**Falsch:**
```
Ich sehe, dass das Payment-Modul Stripe nutzt. Wir könnten einen Webhook-Handler bei /api/webhooks/stripe 
hinzufügen, der die Signatur validiert und Events zu den entsprechenden Handlern leitet.
```

**Richtig:**
```
Payment-Modul-Ort: src/payments/
Stripe SDK vorhanden: ja (package.json Zeile 23)
Vorhandene Webhook-Infrastruktur: keine gefunden
Offene Frage: Wo registriert die Codebase API-Routes?
```

---

## Phase 2: Innovate

**Eine Aufgabe:** Optionen generieren. Keine Implementierung, keine tiefe Verpflichtung zu einem Ansatz.

### Format

Eine nummerierte Liste von Ansätzen, jede mit:
- Einsatz-Beschreibung
- Wichtige Trade-Offs (2–3 Bullet Points)
- Ungefähre Komplexitäts-Schätzung

```markdown
## Optionen

**1. Webhook-Handler als dedizierte Route**
Einzelnes Endpoint, das Stripe-Events empfängt, validiert die Signatur und leitet zu Handlern weiter.
- Pro: einfach zu implementieren, folgt vorhandenen Route-Patterns
- Con: alle Event-Typen teilen sich ein Endpoint — wächst im Laufe der Zeit komplex
- Komplexität: niedrig

**2. Event-Bus mit typisierten Handlern**
Webhook-Endpoint publiziert zu einem internen Bus; jeder Event-Typ hat einen registrierten Handler.
- Pro: Separation of Concerns, einfach neue Event-Typen hinzuzufügen
- Con: über-engineered für <5 Event-Typen
- Komplexität: mittel

**3. Queue-basierte Verarbeitung**
Webhook-Endpoint enqueued Rohereignis; Worker verarbeitet asynchron.
- Pro: entkoppelt, übersteht downstream-Fehler
- Con: fügt Operationalkomplexität hinzu (Queue-Infrastruktur erforderlich)
- Komplexität: hoch
```

### Ausgabe

Ein **Optionen-Dokument** mit allen praktikablen Ansätzen aufgelistet.

### Anti-pattern

Einen Ansatz während Innovate zu tief zu gehen. Wenn ein Ansatz eine vollständige Implementierungs-Skizze erhält, ist Innovate-Mode vorzeitig in Plan-Mode gebrochen. Listieren Sie die Option auf Trade-Off-Level auf und weitermachen.

---

## Phase 3: Plan

**Eine Aufgabe:** Eine Option auswählen und eine nummerierte Checkliste von Aktionen produzieren.

### Ausgabe

Ein **nummerierter Plan**, bei dem jedes Item eine Aktion ist, keine Beschreibung. Jeder Schritt sollte isoliert ausführbar sein.

```markdown
## Plan: Webhook-Handler als dedizierte Route

**Ausgewählt von:** Innovate Optionen, Option 1
**Begründung:** Entspricht vorhandenen Route-Patterns; Event-Volumen rechtfertigt keinen Bus.

1. Fügen Sie `StripeWebhookPayload`-Typ zu `src/types/payments.ts` hinzu
2. Erstellen Sie `src/payments/webhook-handler.ts` — validiert Stripe-Signatur, analysiert Event-Typ
3. Fügen Sie Route `POST /api/webhooks/stripe` in `src/api/routes/payments.ts` hinzu
4. Registrieren Sie Route in `src/api/router.ts`
5. Fügen Sie `STRIPE_WEBHOOK_SECRET` zu env-Schema in `src/config/env.ts` hinzu
6. Schreiben Sie Unit-Tests für Signatur-Validierung in `tests/payments/webhook-handler.test.ts`
7. Schreiben Sie Integrations-Test für Route-Registrierung in `tests/api/routes/payments.test.ts`
```

Jeder Schritt ist spezifisch genug, dass ein anderer Engineer ihn ohne Fragen ausführen könnte.

### Gate

Der Plan muss vor Execute reviewed werden. Dies ist der letzte Punkt, um Scope-Probleme, fehlende Schritte oder Architektur-Probleme ohne Implementierungs-Kosten zu fangen. Claude reviewed ihn; ein Mensch reviewed ihn für kritische Änderungen.

### Anti-pattern

Plan-Schritte als Beschreibungen statt Aktionen zu schreiben.

**Falsch (Beschreibung):** "Der Webhook-Handler sollte die Stripe-Signatur validieren"  
**Richtig (Aktion):** "Erstellen Sie `src/payments/webhook-handler.ts` mit einer `validateSignature(payload, secret)`-Funktion unter Verwendung von Stripes `constructEvent`-Methode"

---

## Phase 4: Execute

**Eine Aufgabe:** Den Plan genau wie geschrieben implementieren. Kreuzen Sie jeden Schritt ab.

### Das Blocker-Protokoll

Die wichtigste Regel in Execute: Wenn Sie etwas Unerwartetes treffen, das der Plan nicht berücksichtigt, **stoppen Sie sofort**.

Improvisieren Sie nicht. Treffen Sie keine Architektur-Entscheidungen im Flug. Fügen Sie nicht "nur noch eine Sache" hinzu.

Das Blocker-Protokoll:
1. Stoppen Sie mit Execute
2. Notieren Sie den Blocker: was wurde gefunden, warum blockiert es den aktuellen Schritt
3. Zurück zu Plan-Mode
4. Aktualisieren Sie den Plan, um den Blocker zu berücksichtigen
5. Setzen Sie Execute vom letzten abgeschlossenen Schritt fort

```
[BLOCKER — returning to PLAN mode]
Found: `src/api/router.ts` uses a different route registration pattern than documented.
Routes are registered via a decorator, not a direct call.
Plan step 4 needs to be revised to match the decorator pattern.
```

### Step-Tracking

Markieren Sie jeden Schritt, während er abgeschlossen wird:

```markdown
1. [x] Fügen Sie `StripeWebhookPayload`-Typ zu `src/types/payments.ts` hinzu
2. [x] Erstellen Sie `src/payments/webhook-handler.ts`
3. [x] Fügen Sie Route `POST /api/webhooks/stripe` hinzu
4. [ ] Registrieren Sie Route in `src/api/router.ts`   ← current step
```

### Anti-pattern

Während Execute zu improvisieren. Jede Änderung nicht im Plan — auch eine "kleine Verbesserung" — ist ein Scope-Wechsel. Protokollieren Sie es als zukünftige Aufgabe und machen Sie weiter mit der Ausführung des Plans wie geschrieben. Abweichung vom Plan bricht die Garantie, dass Execute genau das erzeugt, das Plan entwarf.

---

## Phase 5: Review

**Eine Aufgabe:** Die Implementierung gegen den Plan und ursprüngliche Anforderungen vergleichen. Einen Abweichungs-Bericht produzieren.

### Was prüfen

- Jeder Plan-Schritt: implementiert wie spezifiziert? (jeden `[x]` prüfen)
- Jedes Acceptance-Kriterium aus Research: erfüllt die Implementierung es?
- Nicht-funktionale Anforderungen: Performance, Security, Error-Handling — sind sie vorhanden?
- Tests: testen Tests wirklich das in Anforderungen beschriebene Verhalten?

### Ausgabe

Ein **Abweichungs-Bericht + Anforderungen pass/fail**:

```markdown
## Review-Bericht

### Plan-Abschluss
- Schritte 1–6: komplett wie spezifiziert
- Schritt 7 (Integrations-Test): FEHLEND — nicht implementiert

### Anforderungen pass/fail
- [x] Webhook empfängt und analysiert Stripe-Events
- [x] Ungültige Signaturen return 400
- [ ] FAIL: Webhook behandelt nicht `payment_intent.payment_failed`-Event — nicht im Plan aber vorhanden in Anforderungen

### Abweichungen vom Plan
- Schritt 3: Route registriert bei `/api/webhooks/stripe-v2` nicht `/api/webhooks/stripe` — Naming-Inkonsistenz

### Empfohlene Aktionen
1. Integrations-Test hinzufügen (Schritt 7)
2. Handler für `payment_intent.payment_failed` hinzufügen — Zurück zu Plan
3. Route-Pfad mit Plan abstimmen oder Plan aktualisieren, um tatsächlichen Pfad zu reflektieren
```

### Was zu tun ist, wenn Abweichungen gefunden werden

Kleine Abweichungen (Tippfehler, Naming): direkt beheben, im Abweichungs-Bericht notieren.  
Fehlende Schritte: Zurück zu Execute für das spezifische fehlende Item.  
Anforderungs-Fehler: Zurück zu Plan — das ist ein Scope-Problem, das einen Plan-Update vor Wiederausführung benötigt.  
Architektur-Abweichungen: eskalieren. Das ist ein Signal, dass Execute improviert hat — bestimmen Sie, was sich geändert hat und ob es akzeptabel ist.

---

## Anti-Patterns Tabelle

| Phase | Anti-pattern | Konsequenz |
|-------|-------------|-------------|
| Research | Lösungen vorschlagen | Überspringt Optionen-Bewertung; verankert auf erste Idee |
| Research | Unvollständige Kontext-Sammlung | Plan ist auf falschen Annahmen gebaut |
| Innovate | Zu früh zu eine Option committen | Misses bessere Ansätze |
| Innovate | Trade-Off-Analyse überspringen | Optionen sehen gleichwertig aus; Wahl ist willkürlich |
| Plan | Deskriptive statt Aktions-Schritte | Execute wird mehrdeutig; Blocker-Rate steigt |
| Plan | Gate-Review überspringen | Architektur-Probleme während Execute entdeckt |
| Execute | Improvisieren | Plan stimmt nicht mehr mit Implementierung überein; Review hat nichts zu vergleichen |
| Execute | Über einen Blocker hinwegfahren | Plan wird ungültig; downstream-Schritte können falsch sein |
| Review | Überspringen | Abweichungen werden nicht erkannt; Anforderungs-Fehler shippen |
| Review | Findings untertreiben | "Kleine" Abweichungen sammeln sich über Features |

---

## Wann RIPER vs just coding verwenden

**RIPER verwenden für:**
- Features, die mehr als 3 Tage dauern
- Kritische Änderungen (Auth, Zahlungen, Daten-Migrationen, Public APIs)
- Unbekannte Codebases, wo architektonische Annahmen ungepryft sind
- Arbeit, bei der falsche Implementierung teuer zu reparieren ist

**RIPER überspringen für:**
- Hotfixes und Incident Response (direkt zu Fix + Review)
- Aufgaben unter 2 Stunden mit klarem Implementierungs-Pfad
- Additive Änderungen ohne architektonische Entscheidungen (Konfigurationsschalter hinzufügen, Abhängigkeit aktualisieren)
- Arbeit, wo alle fünf Phasen länger dauern würden als es einfach zu coden

RIPER hat Overhead. Der Overhead zahlt sich selbst bei komplexer Arbeit aus; er zahlt sich nicht bei kleiner Arbeit aus. Die Faustregel: Wenn Sie die vollständige Implementierung in Ihrem Kopf halten können, ohne sie aufzuschreiben, ist RIPER Overkill.

---
