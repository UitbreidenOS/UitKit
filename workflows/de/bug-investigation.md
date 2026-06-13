# Workflow zur Fehlerermittlung

Paralleles Multi-Hypothesen-Debugging — wenn die Grundursache eines Fehlers unklar ist, führen Sie mehrere Agenten gleichzeitig durch, die verschiedene Theorien untersuchen. Erheblich schneller als sequentielles Debugging.

## Wann verwendet

Verwenden Sie diesen Workflow wenn:
- Ein Fehler mehrere wahrscheinliche Ursachen hat und Sie wissen nicht, welche
- Ein Produktionsproblem erfordert schnelle Grundursachenidentifikation
- Sie debuggen den gleichen Fehler seit mehr als 30 Minuten
- Der Fehler ist intermittierend und schwer deterministisch zu reproduzieren

## Phase 1: Hypothesengenerierung (5 Minuten)

Bevor Sie Agenten ausführen, definieren Sie 3-5 sich gegenseitig ausschließende Hypothesen:

```
Fehler: [beschreiben Sie das Symptom — exakter Fehler oder Verhalten]
Kontext: [was hat sich kürzlich geändert, welche Umgebung, welche Bedingungen lösen es aus]

Generieren Sie 3-5 unterschiedliche Grundursachen-Hypothesen, geordnet nach Wahrscheinlichkeit.
Jede Hypothese sollte sein:
- Spezifisch (nennt eine konkrete Ursache, nicht "etwas stimmt nicht mit auth")
- Testbar (kann durch das Lesen von spezifischem Code bestätigt oder ausgeschlossen werden)
- Sich gegenseitig ausschließend (nicht "vielleicht der Cache oder vielleicht die Datenbank")

Format:
H1 (am wahrscheinlichsten): [Hypothese] — Beweis: [warum Sie das denken]
H2: [Hypothese] — Beweis: [...]
H3: [Hypothese] — Beweis: [...]
```

**Beispielhypothesen für "Zahlung schlägt intermittierend fehl":**
```
H1: Racebedingung — zwei gleichzeitige Anfragen erstellen doppelte Bestellungen
    Beweis: Fehler passiert nur bei hoher Concurrency, Logs zeigen doppelte Bestellungs-IDs
H2: Stripe-Ratelimit — Erreichen des 100 req/s-Limits bei Spitzenverkehr
    Beweis: Fehler Spitzen genau bei Verkehrsspitzen, 429 in einigen Fehlerprotokollen
H3: DB-Verbindungserschöpfung — Pool läuft bei hoher Last ab
    Beweis: Fehlermeldung "connection timeout" erscheint in einigen Fällen
H4: Webhook-Wiederholungskollision — Stripe wiederholt einen zuvor fehlgeschlagenen Webhook
    Beweis: Einige doppelte Gebühren stammen von der gleichen Webhook-Event-ID
```

## Phase 2: Parallele Ermittlung

Erstellen Sie einen Agent pro Hypothese. Jeder Agent erhält genau eine Theorie zum Untersuchen und nichts anderes:

```
[Führen Sie diese Agenten parallel aus, nicht sequenziell]

Agent 1 (H1 — Racebedingung):
"Untersuchen Sie, ob eine Racebedingung doppelte Bestellungen verursacht.
Schauen Sie sich an: src/api/orders/create.ts, DB-Transaktions-Isolationsstufe,
einen Mutex oder Sperrenmechanismus.
Ziel: Bestätigen oder widerlegen Sie diese Hypothese mit spezifischen Code-Beweisen."

Agent 2 (H2 — Stripe-Ratelimit):
"Untersuchen Sie, ob wir die Stripe-API-Ratelimits überschreiten.
Schauen Sie sich an: src/services/stripe.ts, Request-Logging, Stripe-Dashboard wenn zugänglich,
jegliche Wiederholungslogik oder Queue für Stripe-Anrufe.
Ziel: Bestätigen oder widerlegen mit Beweisen."

Agent 3 (H3 — DB-Verbindungspool):
"Untersuchen Sie, ob die Erschöpfung des DB-Verbindungspools Zahlungsfehlschläge verursacht.
Schauen Sie sich an: DB-Verbindungskonfiguration, Pool-Größe vs. gleichzeitige Anfragen,
alle Verbindungsfehler-Protokolle.
Ziel: Bestätigen oder widerlegen mit Beweisen."

Agent 4 (H4 — Webhook-Wiedergabe):
"Untersuchen Sie, ob Stripe-Webhook-Wiederholungen doppeltes Processing verursachen.
Schauen Sie sich an: src/webhooks/stripe.ts, Idempotency-Key-Implementierung,
Webhook-Event-ID-Deduplizierung.
Ziel: Bestätigen oder widerlegen mit Beweisen."
```

## Phase 3: Synthese (nachdem alle Agenten berichten)

```
Angesichts dieser Ermittlungsergebnisse: [fügen Sie alle Agenten-Ausgaben ein]

1. Welche Hypothese wurde bestätigt und warum?
2. Welche Beweise widerlegen die anderen Hypothesen?
3. Wie ist die spezifische Reparatur?
4. Welche Tests würden diese Regression verhindern?
```

## Phase 4: Reparatur und Verifikation

Implementieren Sie den Fix nur für die bestätigte Hypothese.

Führen Sie den spezifischen Testfall aus, der diesen Fehler hätte abfangen sollen:
```bash
# Zunächst einen Regressions-Test hinzufügen
# Dann die Reparatur implementieren
# Dann bestätigen, dass der Test besteht
```

## Alternative: Schnelle Triage (< 15 min Fehler)

Für einfachere Fehler mit einem offensichtlichen Schuldigen überspringen Sie parallele Agenten und verwenden diese schnelle Checkliste:

```
1. Was hat sich bei der letzten Bereitstellung geändert? (git log --since="2 hours ago")
2. Ist der Fehler isoliert reproduzierbar? (minimale Reproduktion)
3. Was sagt die Stack-Trace? (lesen Sie die tatsächliche Zeile, nicht raten)
4. Gibt es einen Test, der dies hätte abfangen sollen? (wenn nicht, schreiben Sie ihn vor der Reparatur)
5. Reparatur → Test verifizieren → bereitstellen
```

## Verwandte Inhalte

- `/agents/roles/incident-commander` — für Produktionsvorfälle, die Kommunikation erfordern
- `/skills/productivity/debug` — Debugging-Skill für Single-Agent-Ermittlung
- `/skills/productivity/self-eval` — Bewerten Sie die Qualität Ihres Debugging-Prozesses

---
