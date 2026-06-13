# Erweitertes Denken / Reasoning-Modus

Wie man die internen Chain-of-Thought-Fähigkeiten von Claude nutzt — wann man es aktiviert, wie man das Token-Budget kontrolliert und wie man vermeidet, für Denkzeit zu zahlen, die man nicht braucht.

---

## Was erweitertes Denken ist

Erweitertes Denken gibt Claude einen Notizblock, den es vor der Antwort nutzt. Der Denkinhalt ist eine Chain-of-Thought — Claude arbeitet Schritt für Schritt durch das Problem, bevor es sich zu einer Antwort verpflichtet. Der Denkoutput ist in der Antwort sichtbar (als `thinking` Block), und die endgültige Antwort spiegelt diese Überlegung wider.

Dies unterscheidet sich strukturell von der normalen Generierung. Im Standardmodus erzeugt Claude Token von links nach rechts, und jedes Token wird verpflichtet, sobald es generiert wird. Im Thinking-Modus weist Claude zuerst ein Budget von internen Tokens zu, um das Problem durchzudenken, dann synthetisiert es eine endgültige Antwort aus dieser Überlegung. Die endgültige Antwort ist tendenziell genauer, vollständiger und weniger wahrscheinlich, dass sie einen offensichtlich falschen frühen Schritt macht und sich dann festfährt.

Die Schlüssel-Trade-offs:

| Eigenschaft | Standardmodus | Erweitertes Denken |
|---|---|---|
| Latenz | Niedrig (erstes Token schnell) | Höher (Denken läuft zuerst) |
| Kosten | Nur Output-Tokens | Thinking-Tokens + Output-Tokens |
| Genauigkeit bei komplexen Aufgaben | Grundlinie | Deutlich besser |
| Genauigkeit bei einfachen Aufgaben | Grundlinie | Marginal besser, selten wert |
| Antwort-Kohärenz | Gut | Besser bei Multi-Step-Aufgaben |
| Streaming | Unmittelbar | Thinking-Blöcke streamen separat |

Erweitertes Denken ist keine magische Verbesserung — es handelt sich um einen Austausch von Kosten und Latenz für Genauigkeit bei Aufgaben, die absichtliche Überlegung erfordern. Nutze es, wenn die Überlegungskomplexität den Trade-off rechtfertigt.

---

## Modell-Unterstützung

Erweitertes Denken ist verfügbar auf:

| Modell | Thinking-Unterstützung | Notizen |
|---|---|---|
| Claude Opus 4.7 | Vollständige Unterstützung | Höchste Qualität des Reasonings; höchste Kosten |
| Claude Sonnet 4.6 | Vollständige Unterstützung | Bestes Kosten-/Leistungs-Verhältnis für die meisten Aufgaben |
| Claude Haiku 3.5 | Nicht unterstützt | Nutzen für schnelle, kostengünstige Aufgaben ohne Thinking |
| Frühere Modelle | Nicht unterstützt | Opus 4 und früher unterstützen `thinking` nicht |

Für die meisten Production-Use-Cases überbietet Sonnet 4.6 mit aktiviertem Thinking Opus 4 bei niedrigeren Kosten. Reserviere Opus 4.7 mit maximalem Thinking-Budget für die schwierigsten Aufgaben — Architektur-Design unter komplexen Constraints, Proof-Verifikation, Algorithmus-Korrektheit über Edge-Cases.

---

## Erweitertes Denken aktivieren

### Claude Code: `/effort` Befehl

In einer Claude Code-Sitzung steuert der `/effort` Parameter den Thinking-Modus:

```
/effort low       # Standardmodus — kein erweitertes Denken
/effort medium    # Leichtes Denken; geeignet für mäßig komplexe Aufgaben
/effort high      # Vollständiges Denken aktiviert; ~16K Thinking-Token-Budget
/effort max       # Maximales Thinking-Budget; nutzen für die schwierigsten Probleme
```

`/effort` ist sitzungsscoped. Eine Einstellung gilt für alle nachfolgenden Züge, bis du sie änderst oder eine neue Sitzung startest.

**Verhalten auf jedem Level:**

| Level | Thinking aktiviert | Ungefähres Token-Budget | Anwendungsfall |
|---|---|---|---|
| `low` | Nein | 0 | Boilerplate, einfache Edits, Lookups |
| `medium` | Manchmal | ~4,000 | Code-Review, mäßige Refactors |
| `high` | Ja | ~16,000 | Komplexe Logik, architektonische Entscheidungen |
| `max` | Ja | ~32,000+ | Research-Grade-Probleme, Proofs, tiefes Design |

In der Praxis deckt `high` die Mehrheit der Aufgaben ab, wo Thinking Wert hinzufügt. `max` ist für Probleme, wo Claude wirklich mehrere Lösungsstrategien erkunden muss, bevor es sich verpflichtet.

**Aktuelles Effort-Level prüfen:**

```bash
# Das aktuelle /effort-Level wird in der Sitzungs-Statusleiste angezeigt.
# Um auf Standard (Standardmodus) zurückzusetzen:
/effort low
```

### API: `thinking` Parameter

Beim direkten API-Aufruf übergebe einen `thinking` Block in der Anfrage:

```json
{
  "model": "claude-sonnet-4-6",
  "max_tokens": 16000,
  "thinking": {
    "type": "thinking",
    "budget_tokens": 10000
  },
  "messages": [
    {
      "role": "user",
      "content": "Design einen verteilten Rate-Limiter, der 1M RPS mit Sub-Millisekunden p99-Latenz handhabt. Erwäge Redis, Token-Buckets, Sliding Windows und Gossip-Protokolle. Rechtfertige jeden Trade-off."
    }
  ]
}
```

**Regeln für `budget_tokens`:**

- Minimum: `1024` — alles darunter wird abgelehnt
- Typischer Bereich: `8,000–16,000` für die meisten komplexen Aufgaben
- High-Complexity-Bereich: `16,000–32,000`
- Hard Cap: modellabhängig; Opus 4.7 unterstützt bis `32,000+`; siehe Modelldocs für aktuelle Limits
- `budget_tokens` muss weniger als `max_tokens` sein

Claude nutzt möglicherweise weniger Tokens als das Budget. Das Budget ist eine Obergrenze, keine Garantie.

---

## Die API-Response: Thinking-Blöcke

Wenn Thinking aktiviert ist, enthält die Response einen `thinking` Block vor dem Text-Block:

```json
{
  "id": "msg_01XFDUDYJgAACTu2zCjM9e64",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "thinking",
      "thinking": "Lass mich das Rate-Limiter-Design systematisch durchgehen. Die Kernzwangsbedingung ist 1M RPS bei Sub-Millisekunden p99...\n\nOption 1: Redis mit Token-Bucket...\nVorteile: Einfach, weit verbreitet\nNachteile: Redis wird zu einem Engpass bei 1M RPS — Single-threaded Command Execution, Network RTT erhöht Latenz...\n\nOption 2: In-Process Sliding Window mit Gossip-Sync...\n[Claude setzt die Überlegung über Optionen fort, dann synthetisiert]\n\nSchlussfolgerung: Hybrid-Ansatz — In-Process-Zähler mit Async Gossip für Cross-Node-Koordination..."
    },
    {
      "type": "text",
      "text": "## Distributed Rate Limiter Design\n\nFür 1M RPS bei Sub-Millisekunden p99 ist Redis allein als primärer Counter-Store unzureichend..."
    }
  ],
  "usage": {
    "input_tokens": 147,
    "output_tokens": 2341,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 0
  }
}
```

Das `thinking` Feld ist der Rohtext des Notizblocks. Es ist lesbar, aber nicht die polierte Antwort — erwarte explorative Sprache, tote Enden, die Claude aufgibt, und vorläufige Schlussfolgerungen, die mid-thought revidiert werden. Der endgültige `text` Block ist die eigentliche Response.

---

## Kostenmodell

Thinking-Tokens werden zum gleichen Satz wie Output-Tokens berechnet. Sie werden nicht diskontiert.

```
Gesamtkosten = (input_tokens × input_rate) + (thinking_tokens × output_rate) + (output_tokens × output_rate)
```

**Beispiel bei Sonnet 4.6 Pricing (illustrativ, aktuelle Raten auf anthropic.com überprüfen):**

| Komponente | Tokens | Rate (pro 1M) | Kosten |
|---|---|---|---|
| Input | 500 | $3.00 | $0.0015 |
| Thinking | 8,000 | $15.00 | $0.12 |
| Output | 800 | $15.00 | $0.012 |
| **Gesamt** | | | **$0.1335** |

Ohne Thinking:

| Komponente | Tokens | Rate (pro 1M) | Kosten |
|---|---|---|---|
| Input | 500 | $3.00 | $0.0015 |
| Output | 800 | $15.00 | $0.012 |
| **Gesamt** | | | **$0.0135** |

Erweitertes Denken ist bei dieser Beispielaufgabe ungefähr 10× teurer. Dieser Multiplikator ist die richtige Größenordnung für typische Nutzung. Wenn du ein hartes Problem einmal löst, sind diese Kosten trivial. Wenn du es in einer Schleife über Tausende von Inputs aufrufst, die kein Reasoning erfordern, ist es eine signifikante Regression.

**Thinking-Tokens profitieren nicht von Prompt-Caching.** Input-Tokens vor dem Thinking-Block können gecacht werden, aber der Thinking-Output selbst nicht. Strukturiere Requests so, dass stabile System-Prompts und Kontext vor dem `thinking` Block positioniert sind, um von Caching zu profitieren.

---

## Streaming mit Thinking

Wenn ein Thinking-aktiviertes Response gestreamt wird, streamen `thinking` Blöcke und `text` Blöcke separat. Der Thinking-Block vervollständigt sich vor dem Text-Block in den meisten Clients.

```python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=16000,
    thinking={
        "type": "thinking",
        "budget_tokens": 8000
    },
    messages=[{"role": "user", "content": "..."}]
) as stream:
    for event in stream:
        if event.type == "content_block_start":
            if event.content_block.type == "thinking":
                print("[Thinking started]")
            elif event.content_block.type == "text":
                print("[Response started]")
        elif event.type == "content_block_delta":
            if event.delta.type == "thinking_delta":
                # Rohes Thinking-Streaming
                pass  # Unterdrücke, wenn du es nicht anzeigen möchtest
            elif event.delta.type == "text_delta":
                print(event.delta.text, end="", flush=True)
```

In nutzerorientierten Produkten kannst du den Thinking-Block vollständig ausblenden und nur den `text` Block streamen. Die Latenz zum ersten Text-Token ist höher bei aktiviertem Thinking — kalibriere deine UX-Ladezustände entsprechend.

---

## Standardmodus vs. Thinking-Modus: gleicher Prompt, unterschiedliche Outputs

**Prompt:** "Eine Funktion läuft im O(n log n) Average Case. Du musst 10M Elemente in unter 2 Sekunden auf einer Maschine mit 8 Cores verarbeiten. Ist das durchführbar? Was sind die Fehlermodi?"

**Standardmodus-Response (gekürzt):**

> O(n log n) bei 10M Elementen ist ungefähr 10M × 23 ≈ 230M Operationen. Bei 1 Milliarde Operationen/Sekunde pro Core sind das 0.23 Sekunden Single-threaded. Mit 8 Cores bist du gut unter 2 Sekunden. Hauptfehlermodi: Memory-Bandbreite, Cache-Misses und Thread-Synchronisations-Overhead.

Oberflächlich korrekt. Verpasst mehrere bedeutsame Fehlermodi.

**Thinking-Modus-Response (gekürzt, aus echtem Thinking-Block):**

*Thinking:* "Lass mich vorsichtig sein. O(n log n) Average Case — was ist der Worst Case? Nicht angegeben. Was ist der konstante Faktor? Nicht angegeben. Memory-Access-Pattern? Nicht angegeben. 'Funktion' — ist das Comparison-basiertes Sorting? Graph-Algorithmus? Die Formulierung ist mehrdeutig..."

*Response:*

> Die Durchführbarkeit hängt von Faktoren ab, die die Frage offen lässt. Hier ist, was du vor der Verpflichtung zu diesem Design klären musst:
>
> **Die Mathematik auf den ersten Blick:** 10M × log₂(10M) ≈ 230M Operationen. Bei realistischem IPC auf moderner Hardware (~2–4 effektive Ops/Cycle bei 3GHz) hast du ungefähr 6–12 Milliarden "Operation Slots" pro Sekunde pro Core. Single-threaded ist das trivial schnell. Aber diese Berechnung verbirgt die echten Risiken.
>
> **Fehlermodi, die dich wirklich treffen:**
>
> 1. **Konstanter Faktor:** O(n log n) mit großem konstanten Faktor (z.B. Cache-unfriendlicher Memory-Zugriff) kann 10–100× langsamer sein als die theoretische Untergrenze. Ein Sort mit guter Cache-Lokalität schlägt einen theoretisch äquivalenten Algorithmus mit Pointer-Chasing jedes Mal.
>
> 2. **Worst-Case-Entartung:** Wenn der Average Case O(n log n) ist, aber Worst Case O(n²) (z.B. naiver Quicksort auf adversarieller Eingabe), werden Produktionsdaten es irgendwann treffen.
>
> 3. **Parallelisierungs-Overhead:** Das Aufteilen von 10M Elementen über 8 Cores führt zu Synchronisation an Merge-Punkten. Für Algorithmen, wo der Merge-Schritt O(n) ist, kannst du den meisten Parallelisierungs-Gewinn verlieren.
>
> 4. **Memory-Bandbreiten-Deckel:** Bei 10M Elementen × 8 Bytes = 80MB. Das passt in L3 auf den meisten Server-Chips, aber nur knapp. Wenn der Working Set nicht passt, wird Memory-Bandbreite (nicht Compute) zum Engpass, und Core-Count hilft nicht mehr.
>
> 5. **Das 2-Sekunden-Budget ist die falsche Metrik:** p99 oder p999 Latenz ist, wofür du paged wirst. Wenn der Average 1.8 Sekunden ist, aber p99 4.1 Sekunden, bist du über Budget, wenn es zählt.

Die Thinking-Modus-Response zeigt, was die Frage wirklich fragte — nicht nur eine Berechnung, sondern eine vollständige Machbarkeitsanalyse. Das ist das Muster, wo erweitertes Thinking sich auszahlt: Probleme, wo eine flache Antwort technisch korrekt, aber operativ nutzlos ist.

---

## Wann man erweitertes Thinking nutzt

Nutze erweitertes Denken, wenn die Aufgabe eines oder mehrere dieser Eigenschaften hat:

**Multi-Step-Abhängigkeitsketten.** Die Korrektheit jedes Schrittes hängt von einem vorherigen Schritt ab. Ein Fehler in Schritt 2 breitet sich aus und beschädigt Schritte 3–10. Lineare Generierung ist hier fragil; Thinking-Modus erlaubt Claude, Zwischenschritte zu überprüfen, bevor es sich verpflichtet.

**Mehrdeutige oder unterspecifizierte Anforderungen.** Wenn die Frage verborgene Annahmen oder mehrere gültige Interpretationen enthält, erlaubt Thinking-Modus Claude, Interpretationen zu enumerieren und bewusst zu wählen, statt sich zur ersten plausibler Lesart zu verpflichten.

**Mathematische oder logische Korrektheit.** Proof-Verifikation, Algorithmus-Korrektheit-Analyse, Komplexitäts-Grenzen. Diese erfordern die Überprüfung mehrerer Fälle und das Verfolgen von Constraints — lineare Generierung neigt dazu, Edge-Cases zu überspringen.

**Architektonische Entscheidungen mit nicht-offensichtlichen Trade-offs.** System-Design, Data-Model-Auswahl, API-Contract-Design. Die richtige Antwort hängt von Constraints ab, die auf nicht-offensichtliche Weise interagieren. Thinking-Modus macht die Constraint-Analyse explizit.

**Debugging komplexer System-Interaktionen.** Wenn die Root-Cause eines Bugs mehrere Systeme umfasst und Reasoning über Timing, State und Side-Effects gleichzeitig erfordert.

**Sicherheitssensible Logik.** Auth-Flows, Permission-Modelle, kryptographische Protokoll-Implementierung. Die Kosten eines Fehlers sind hoch; die zusätzliche Latenz und Kosten des Thinkings sind billig im Vergleich.

---

## Wann man erweitertes Thinking NICHT nutzt

Erweitertes Thinking verschwendet Geld und fügt Latenz ohne Qualitäts-Gewinn auf hinzu:

**Einfache CRUD und Boilerplate.** Das Generieren eines REST-Endpoints, das Schreiben einer Model-Klasse, das Scaffolding einer Komponente. Diese Aufgaben haben eine einzelne offensichtliche Struktur. Thinking verbessert sie nicht.

**Übersetzung und Lokalisierung.** Das Konvertieren von Inhalten in eine andere Sprache. Die Aufgabe ist Token-für-Token-Mapping, nicht Reasoning. Thinking-Modus bei Übersetzung verbrennt Output-Token-Budget ohne Gewinn.

**Lookups und Zusammenfassungen.** "Was macht diese Funktion?" oder "Fasse diese Datei zusammen." Die Antwort ist in der Eingabe. Kein Reasoning erforderlich.

**High-Volume-Schleifen.** Wenn du die API in einer Batch über Tausende ähnlicher Inputs aufrufst, multipliziert Thinking-Modus deine Kosten um 5–15×. Reserviere Thinking für die Planungsphase; nutze Standardmodus für Ausführung.

**Zeitsensitive interaktive Flows.** Autocomplete, Inline-Vorschläge, Chat-Antworten, bei denen der Nutzer eine Sub-Sekunden-Antwort erwartet. Die Thinking-Latenz wird sich broken anfühlen.

**Iteratives Drafting.** First-Draft-Generierung, Brainstorming, spekulative Erkundung. Du möchtest Volumen und Vielfalt, nicht Strenge. Nutze Standardmodus und iteriere.

---

## Claude Code-Integration: `/effort` in der Praxis

Wenn du `/effort high` oder `/effort max` in einer Claude Code-Sitzung setzt, ändern sich mehrere Verhaltensweisen:

- **Tool-Call-Planung verbessert sich.** Bevor Claude eine Sequenz von Reads, Edits und Bash-Calls ausgibt, denkt Claude intern die volle Planung durch, anstatt sich zur ersten plausibler Aktion zu verpflichten. Dies reduziert Mid-Sequence-Backtracking.

- **Multi-File-Operationen sind kohärenter.** Wenn eine Aufgabe Änderungen über mehrere Dateien erfordert, die konsistent bleiben müssen, hilft Thinking-Modus Claude, alle Constraints gleichzeitig in Scope zu halten.

- **Mehrdeutige Task-Dekomposition verbessert sich.** Wenn deine Task-Beschreibung unterspecifiziert ist, ist Claude wahrscheinlicher, die Mehrdeutigkeit zu zeigen und zu fragen, statt falsch zu raten und weiterzumachen.

- **Fehler-Recovery ist besser.** Wenn ein Tool-Call ein unerwartetes Ergebnis zurückgibt, ist Thinking-Modus wahrscheinlicher zu machen, dass Claude durchdenkt, was schiefgelaufen ist, statt die gleiche Aktion zu wiederholen.

**Empfohlenes Session-Muster:**

```
# Start komplexer Aufgabe
/effort high

# ... arbeite durch das komplexe Design/Architektur ...

# Wechsel zurück beim Übergang zu Implementierung
/effort low

# ... generiere das Boilerplate, schreibe die Tests, etc. ...

# Wechsel zurück für jeden schwierigen Debug oder Cross-Cutting-Concerns
/effort high
```

Lasse `/effort high` nicht über eine ganze lange Session aktiv. Du zahlst Thinking-Token-Raten auf jedem Zug, einschließlich trivialer wie "ok, lies diese Datei" und "führe jetzt die Tests aus", die von Reasoning nicht profitieren.

---

## Real-World-Anwendungsfälle

### 1. Database-Schema-Migration unter Constraints

**Prompt:**
```
Wir migrieren von einem Single-Tenant-Postgres-Schema (eine DB pro Kunde)
zu einem Multi-Tenant-Schema (Row-Level-Isolation via tenant_id). Wir haben 47 Tabellen,
mehrere mit Cross-Table Foreign Keys. Wir können Downtime nicht erlauben. Wir verarbeiten
8,000 Write-Transaktionen/Minute bei Peak. Entwirf die Migrations-Strategie.
```

**Warum Thinking hilft:** Die Migration muss Foreign-Key-Constraints, Backfill-Ordering, Index-Änderungen und Zero-Downtime-Cutover gleichzeitig handhabt. Diese Constraints interagieren — ein Ordering, das Foreign-Keys erfüllt, kann mit Backfill-Performance konfligieren. Lineare Generierung wählt einen Constraint zur Lösung zuerst, retrofit dann die anderen, oft ein stilles Fehlermodi-Produkt. Thinking-Modus lässt Claude Constraint-Interaktionen enumerieren, bevor es sich zu einem Plan verpflichtet.

---

### 2. Compiler-Bug Root-Cause-Analyse

**Prompt:**
```
Unser Rust-Binary kompiliert sauber, aber segfault zur Runtime nur wenn kompiliert
mit --release und nur auf ARM64. Der Crash ist in einer heißen Schleife, die Byte-Arrays verarbeitet. Kein Unsafe-Code in unserem Codebase. Hier ist der relevante Assembly-Diff
zwischen Debug und Release: [...]
```

**Warum Thinking hilft:** Die Root-Cause umfasst die Interaktion von LLVM-Optimierungs-Passes, Alignment-Annahmen und Undefined-Behavior in sauber aussehendem Rust-Code. Das Diagnostizieren erfordert, mehrere Hypothesen gleichzeitig zu halten und zu reasonen, welche Assembly-Patterns welchen Source-Level-Konstrukten entsprechen. Dies ist eine klassische Thinking-Mode-Aufgabe.

---

### 3. API-Contract-Design für Backward-Kompatibilität

**Prompt:**
```
Wir müssen Pagination zu einem API-Endpoint hinzufügen, der derzeit alle Ergebnisse zurückgibt.
Unser API hat 200+ externe Consumer. Wir können bestehende Integrationen nicht brechen.
Das aktuelle Response-Schema ist: { "results": [...] }. Entwirf das Versioning
und den Migrations-Pfad.
```

**Warum Thinking hilft:** Das Design muss neue Consumer (die Pagination brauchen), alte Consumer (die das Flat-Array erwarten) und die Übergangsperiode (wo beides existiert) erfüllen. Diese Constraints deuten auf unterschiedliche Ansätze hin, die ohne sorgfältiges Design gegenseitig ausschließlich sind. Thinking-Modus kartographiert den Constraint-Space, bevor er eine Struktur vorschlägt.

---

### 4. Distributed-Systems-Korrektheit-Verifikation

**Prompt:**
```
Dies ist unser Leader-Election-Algorithmus. Identifiziere alle Bedingungen, unter denen
zwei Knoten gleichzeitig glauben können, dass sie der Leader sind.
[Algorithmus-Pseudocode folgt]
```

**Warum Thinking hilft:** Safety-Property-Verletzungen in verteilten Algorithmen erfordern, exhaustiv alle Interleavings von concurrent Events zu überprüfen. Lineare Generierung überprüft die offensichtlichen Fälle und stoppt. Thinking-Modus ist wahrscheinlicher, die systematische Case-Analyse zu konstruieren, die subtile Races findet.

---

### 5. Security-Modell-Review

**Prompt:**
```
Hier ist unser Permission-Modell für ein Multi-Tenant-SaaS. Nutzer gehören zu Organisationen.
Organisationen haben Roles. Ressourcen gehören zu Organisationen.
Nutzer können Ressourcen Cross-Organisation mit expliziten Grants teilen.
Identifiziere Privilege-Escalation-Pfade. [Schema und Permission-Check-Code folgt]
```

**Warum Thinking hilft:** Privilege-Escalation-Sicherheitslücken leben an der Intersection mehrerer Permission-Regeln. Sie zu finden erfordert, das vollständige Permission-Modell im Geist zu halten, während man über Sequenzen gültiger Operationen reasonet, die in einen ungültigen State komposieren. Dies ist genau die Art von Multi-Constraint-Reasoning, wo Thinking-Modus Genauigkeit verbessert.

---

## Token-Budget-Sizing-Guide

Die Wahl des richtigen `budget_tokens`-Wertes geht nicht um Maximierung — es geht um Matching zur Task-Komplexität.

| Task-Komplexität | Empfohlenes Budget | Beispiele |
|---|---|---|
| Moderat | 4,000–6,000 | Code-Review, Single-Function-Debugging, Data-Model-Fragen |
| Hoch | 8,000–12,000 | Architektonische Entscheidungen, Multi-File-Refactors, Algorithmus-Design |
| Sehr hoch | 16,000–24,000 | System-Design unter Hard Constraints, Security-Reviews |
| Maximum | 32,000+ | Compiler-Korrektheit, formale Verifikation, Proof-Analyse |

Starte bei 8,000 und erhöhe nur, wenn du abgeschnittenes Reasoning beobachtest. Zeichen, dass das Budget zu klein ist:

- Der Thinking-Block endet abrupt Mid-Analyse
- Die endgültige Response verpasst Constraints, die im Prompt sichtbar waren
- Die Response hedgt stark, wo eine entscheidende Antwort möglich war

Zeichen, dass das Budget zu groß ist:

- Der Thinking-Block ist repetitiv — Claude erkundet den gleichen Branch mehrmals
- Die endgültige Response verbessert sich nicht sinnvoll über das, was ein 4,000-Token-Budget produziert hätte
- Latenz ist hoch, aber die Antwort ist eine einfache Empfehlung

---

## Erweitertes-Thinking-Checkliste

Nutze dies, bevor du Thinking-Modus aktivierst. Wenn weniger als 3 Elemente zutreffen, nutze Standardmodus.

- [ ] Die Aufgabe hat mehr als 2 sequenzielle Abhängigkeiten (Schritt A muss korrekt sein, bevor Schritt B fortfahren kann)
- [ ] Die Aufgabe enthält explizite oder versteckte Constraint-Konflikte, die Auflösung brauchen
- [ ] Eine falsche Antwort würde teuer sein zu finden und zu reparieren (Production-Bug, Security-Issue, Irreversible-Migration)
- [ ] Die Aufgabe umfasst eine Korrektheit-Eigenschaft, nicht nur einen Style- oder Structure-Preference
- [ ] Du wurdest durch eine Standardmodus-Antwort auf einer ähnlichen Aufgabe enttäuscht
- [ ] Der Prompt ist auf eine Weise mehrdeutig, die Interpretation vor Beantwortung erfordert
- [ ] Die Aufgabe erfordert die Enumerierung von Fällen (alle Fehlerbedingungen, alle Interleavings, alle Edge-Cases)
- [ ] Die Aufgabe umfasst mehrere Systeme oder Dateien, die gegenseitig konsistent bleiben müssen
- [ ] Die Aufgabe ist eine One-Off-Entscheidung (nicht eine High-Volume-Batch-Operation)
- [ ] Du hast Zeit für die Latenz — dies ist kein Nutzer-gerichteter synchroner Call

---

## Häufige Fehler

**`/effort max` für eine ganze Sitzung setzen.** Der Kostenvervielfacher gilt für jeden Zug, einschließlich trivialer. Nutze gezieltes Effort-Elevation für die schwierigen Teile, drop auf `low` für Ausführung zurück.

**Thinking-Modus auf kreative Aufgaben nutzen.** Erweitertes Thinking verbessert Prosa, Design-Brainstorming oder Content-Generierung nicht. Die Qualitäts-Verbesserung ist spezifisch für Aufgaben, die logische Korrektheit erfordern.

**Den Thinking-Block beim Debugging ignorieren.** Wenn Thinking-Modus eine falsche Antwort produziert, lies den Thinking-Block zuerst. Er zeigt normalerweise genau, wo das Reasoning schiefgelaufen ist, das ist der direkteste Pfad zur Reparatur deines Prompts.

**`budget_tokens` als Quality-Dial behandeln.** Das Verdoppeln des Budgets verdoppelt die Qualität nicht zuverlässig. Jenseits einer Task-angemessenen Decke produziert zusätzliches Budget Repetitives Reasoning ohne bessere Schlussfolgerungen. Starte bei 8,000 und validiere vor dem Erhöhen.

**Thinking auf Streaming-Endpoints mit Tight Latency-Budgets aktivieren.** Thinking-Modus verzögert das erste Text-Token um die volle Dauer der Thinking-Phase. Wenn deine UI eine Typing-Anzeige zeigt und Nutzer innerhalb von 1–2 Sekunden eine Antwort erwarten, wird dies sich broken anfühlen. Entweder verstecke die Thinking-Phase hinter einem absichtlichen Laden-State oder deaktiviere Thinking auf dem Endpoint.

---
