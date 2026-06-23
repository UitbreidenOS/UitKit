---
name: model-router
updated: 2026-06-23
---

# Model Router — Mixture of Experts Routing

## When to activate

- Benutzer fragt, welches Claude-Modell für eine Aufgabe verwendet werden soll ("Sollte ich Opus oder Haiku verwenden?")
- Kostenoptimierung durch Routing zum günstigsten fähigen Modell-Tier
- Aufbau eines Multi-Agent-Workflows und Zuweisung von Modell-Tiers zu Teilaufgaben
- Benutzer erwähnt "MoE", "Model Routing", "Tier-Auswahl", "Kostenoptimierung", "intelligente Modellauswahl"
- Debugging eines Workflows, bei dem das falsche Modell für eine Aufgabe ausgewählt wurde
- Verständnis der Fähigkeitsgrenzen von Haiku/Sonnet/Opus und wann zwischen ihnen gewechselt werden soll
- Sitzung hat Token-Budget-Beschränkungen und benötigt dynamisches Routing

## When NOT to use

- Modell ist bereits explizit vom Benutzer angegeben (kein Routing erforderlich)
- Einzelnes kurzes interaktives Gespräch, bei dem Overhead den Nutzen übersteigt
- Aufgabe ist eindeutig nur Opus (Security-Architektur-Review, Threat-Modeling) — Routing überspringen
- Qualität ist das einzige Anliegen und Kosten sind unbegrenzt — standardmäßig Opus verwenden
- Benutzer stellt allgemeine Fragen zu Claudes Fähigkeiten (nicht aufgabenspezifisches Routing)

## Instructions

### Routing Mode 1: Tier Router (Task Classification)

Analysiert Aufgabentext auf Komplexitätssignale — Stichwörter, Wortanzahl, Domain-Hinweise.

**Tier-Zuweisungslogik:**
- **Opus Tier** aktiviert durch Stichwörter: architect, architecture, security, threat, exploit, vulnerability, design system, reasoning, planning, explore, critique, ambiguous, tradeoff, evaluate options, decide, strategy, complex decision, deep dive, analysis
- **Haiku Tier** aktiviert durch Stichwörter: format, lint, rename, translate, classify, extract, boilerplate, generate stub, template, sort, list, summarize short, count, convert, reformat, cleanup, validation, parsing, simple task
- **Sonnet Tier** ist der Standard-Fallback für allgemeine Arbeit (Codierung, Refaktorierung, Schreiben, Orchestrierung)

**Konfidenz-Scoring**: Höhere Konfidenz (0.7+) bei mehreren Stichwort-Übereinstimmungen. Niedrigere Konfidenz (0.4) bei vager oder sehr kurzer Aufgabenbeschreibung.

**Wann zu verwenden**: Schnelle, automatische Tier-Auswahl, wenn Sie sofort ohne komplexes Denken routen müssen.

### Routing Mode 2: Cascade Escalator (Progressive Refinement)

Beginnt mit dem günstigsten fähigen Modell, eskaliert zu höheren Tiers nur wenn Konfidenz unzureichend ist.

**Ablauf:**
1. Anfängliche Klassifizierung ergibt einen Tier + Konfidenz-Score
2. Wenn Konfidenz < Schwelle (Standard 0.65), eskaliere einen Tier höher (Haiku → Sonnet → Opus)
3. Halt bei Opus oder wenn Konfidenz-Schwelle erreicht ist
4. Maximale Eskalationen Standard auf 2 (verhindert unkontrollierte Eskalation)

**Wann zu verwenden**: Unsichere Aufgabengrenzen, bei denen Sie lieber billig beginnen und nach Bedarf eskalieren möchten. Bildet Kosten mit Sicherheit ab.

**Konfiguration:**
- `--confidence-threshold`: Bei Unterschreitung in höherem Tier neu klassifizieren (Standard 0.65)
- Maximale Eskalationen auf 2 begrenzt

### Routing Mode 3: Parallel Expert Panel (Multi-Model Voting)

Führt dieselbe Task-Aufforderung gleichzeitig gegen alle 3 Modell-Tiers aus, aggregiert Ergebnisse per Abstimmung.

**Abstimmungsstrategien:**
- **Majority**: Tier gewählt von den meisten Experten gewinnt (z.B. 2/3 stimmen für Sonnet)
- **Confidence-weighted**: Score jeden Tier durch durchschnittliche Konfidenz; Tier mit höchster Konfidenz gewinnt
- **Synthesis**: Alle 3 Ergebnisse zurück an externes Judge-Modell (Sonnet) zur Konsensfindung

**Wann zu verwenden**: Kritische Entscheidungen (Security-Designs, Architecture-Wahl), bei denen Sie Konsens aus vielfältigen Modell-Stärken möchten. Kostet 3x mehr Tokens voraus, reduziert aber Eskalations-/Wiederholungsrisiko.

### Routing Mode 4: Domain Expert Router (Path-Based Routing)

Routed basierend auf Dateipfaden und Task-Domain, ohne Task-Text tiefgreifend zu inspizieren.

**Domain-Regeln** (in Prioritätsreihenfolge geprüft):
| Path Pattern | Domain | Tier | Begründung |
|---|---|---|---|
| `security/`, `auth`, `credentials`, `secrets`, `cors` | Security | **Opus** | Hohe Stakes, exploit-relevant |
| `architecture/`, `.yaml`, `.yml`, `.tf` | Infra/Architecture | **Opus** | Systemdesign-Entscheidungen |
| `data/`, `ml/`, `.py` | Data/ML | **Sonnet** | Komplex aber nicht architektonisch |
| `.ts`, `.tsx`, `.js`, `.jsx` | Source Code | **Sonnet** | Coding-Arbeit, ausgewogenes Denken |
| `.md`, `.txt` | Documentation | **Haiku** | Nur Text-Formatierung |
| (keine Pfade angegeben) | Task classification | Per Tier Router | Fällt auf Stichwort-Analyse zurück |

**Wann zu verwenden**: Codebases mit klarer Domain-Struktur. Automatisches Routing mit null Inspektions-Overhead. Ideal für High-Volume-Pipelines.

### Routing Mode 5: Budget Governor (Token Ratio Thresholds)

Routed dynamisch basierend auf verbleibendem Token-Budget als Prozentsatz des Gesamt-Session-Budgets.

**Schwellen:**
- Wenn `remaining / total < 15%`: Force Haiku (Sparmodus; Tokens für kritische Aufgaben bewahren)
- Wenn `remaining / total >= 50%` UND Task klassifiziert als Opus: Verwende Opus (Budget-zulässig)
- Ansonsten: Tier Router-Klassifizierung verwenden

**Budget-Verhältnis-Schwellen:**
- Unter 15%: "Budget kritisch" → Nur Haiku
- 15–50%: "Moderates Budget" → Sonnet oder Haiku
- 50%+: "Budget gesund" → Jeder Tier erlaubt

**Wann zu verwenden**: Langfristige Sessions mit festen Token-Kaps. Gewährleistet, dass Sie nicht mid-session Token-Mangel bekommen durch Auto-Downgrade der Komplexität unter Budget-Druck.

**Konfiguration:**
- `totalBudget`: Session Token-Budget (Standard 100000)
- `opusThreshold`: Verwende Opus nur wenn >= 50% übrig (Standard 0.5)
- `haikuThreshold`: Force Haiku wenn < 15% übrig (Standard 0.15)

### Using the CLI

**Task klassifizieren:**
```bash
claudient moe classify "Format the JSON output"
# → Tier: HAIKU, Confidence: 85%, Reasoning: 2 haiku keywords detected
```

**Eskalationspfad anzeigen:**
```bash
claudient moe cascade "Design a distributed system" --confidence-threshold=0.7
# → Original Tier: SONNET, Escalations: 1, Final Tier: OPUS
```

**Expert Panel Abstimmung abrufen:**
```bash
claudient moe panel "Review this code" --strategy=majority
# Zeigt Haiku, Sonnet, Opus Meinungen + Voting-Konsens
```

**Per File-Domain routen:**
```bash
claudient moe domain "src/security/auth.ts,src/security/jwt.ts" "security audit"
# → Domain: security, Routed Tier: OPUS
```

**Budget-bewusstes Routing:**
```bash
claudient moe budget "write unit tests" --remaining 25000 --total 100000
# → Budget Ratio: 25%, Routed Tier: SONNET
```

**Systemstatus:**
```bash
claudient moe status
# Druckt aktive Routing-Modi, Schwellen, Tier-Kosten
```

### Programmatic Usage

```javascript
import MoeRouter, { classifyTask, routeByDomain, budgetGovernedRouter } from './lib/moe-router.js';

// Tier Router
const result = classifyTask('Design a microservices architecture');
console.log(result.tier, result.confidence);  // claude-opus-4-7, 0.85

// Domain Router
const domainRoute = routeByDomain(['src/security/auth.ts'], 'refactor');
console.log(domainRoute.tier);  // claude-opus-4-7

// Budget Governor
const governor = budgetGovernedRouter({ totalBudget: 50000 });
const budgetRoute = governor.route('write tests', 7500);  // 15% remaining
console.log(budgetRoute.tier);  // claude-haiku-4-5 (forced)
```

## Example

**Szenario**: Aufgabe ist "Refactor the authentication module in `src/security/auth.ts`". Session hat 60.000 Tokens verbleibend von 100.000 Gesamt.

**Tier Router analysiert:** Stichwort "refactor" deutet auf Sonnet hin → Konfidenz 0.62

**Domain Router prüft:** Dateipfad enthält "security/" → Opus-Kandidat → Konfidenz hoch

**Budget Governor sieht:** 60% Budget übrig >= 50% Schwelle → Opus erlaubt

**Entscheidung:** Domain-Signal überschreibt Tier-Signal. Security-Dateien routen immer zu Opus für maximale Überprüfung.

**Endgültige Auswahl:** `claude-opus-4-7`

**CLI-Befehl:**
```bash
claudient moe domain "src/security/auth.ts" "Refactor the authentication module"
# → Detected Domain: security
# → Routed Tier: OPUS
# → Reasoning: security-sensitive file detected
```

**Budget-Auswirkung:** Bei 60% Budget übrig ist diese Opus-Task akzeptabel. Hätte Budget 12% übrig gehabt, würde Budget Governor Haiku erzwingen trotz Security-Domain (Sparmodus).

---

## Tier Reference

| Model | Cost | Speed | Reasoning | Wann zu verwenden |
|---|---|---|---|---|
| **Haiku** | 1x | Schnellste | Limitiertes Denken | Formatierung, Klassifizierung, Templating, Boilerplate, einfache Extraktion |
| **Sonnet** | 12x | Schnell | Gutes Denken | Allgemeine Codierung, Refaktorierung, Dokumentation, Orchestrierung, Reviews |
| **Opus** | 300x | Moderat | Tiefes Denken | Architektur, Security, mehrdeutige Entscheidungen, Threat-Modeling, komplexe Planung |

**Kosten-Anmerkung**: Haiku statt Opus wählen spart ~300x Tokens für einfache Aufgaben. Cascade Escalator verhindert Überzahlung für einfache Arbeit und schützt vor Unterspezifikation für schwierige Probleme.
