# Long-Context-Optimierung

Strategien, um effektiv mit Claudes 200K–1M Token Context Windows zu arbeiten — wie man Context-Rot vermeidet, Qualität bei Scale bewahrt, und weiß, wann man Compact vs. Weiterführung nutzt.

Dieser Guide ergänzt [context-budget.md](context-budget.md), das allgemeine Token-Buchführung und Compaction-Mechaniken deckt. Dieser Guide fokussiert spezifisch auf der 200K+-Skala: was Fenster-Größe praktisch bedeutet, warum Qualität long vor dem Limit degradiert, und wie man deine Sessions und Tooling strukturiert, um in der Quality-Zone über lange Workloads zu bleiben.

---

## Context-Window-Größen in der Praxis

| Modell | Context Window | Ungefähre Wort-Count | Ungefähre Seiten-Count |
|---|---|---|---|
| Claude Haiku 4.5 | 200K Tokens | ~150,000 Worte | ~500 Seiten |
| Claude Sonnet 4.6 | 200K Tokens (Standard) | ~150,000 Worte | ~500 Seiten |
| Claude Sonnet 4.6 | 1M Tokens (Extended) | ~750,000 Worte | ~2,500 Seiten |
| Claude Opus 4.7 | 200K Tokens | ~150,000 Worte | ~500 Seiten |

**200K Tokens in konkreten Begriffen:**

- Ein 200K Context Window passt ungefähr die vollständigen Werke von Shakespeare — zweimal über
- Ein großes Monorepo mit 300 TypeScript-Dateien à 200 Zeilen ist ~60K Tokens
- Eine einzelne große Log-Datei mit 10,000 Zeilen ist ungefähr 80–100K Tokens
- Eine vollständige Claude Code-Sitzung mit 50 Zügen moderater Ausführlichkeit durchschnitt 40–80K Tokens

Die Zahlen schlagen vor, dass du ample Room hast. Die Realität ist unterschiedlich. Das 200K-Limit ist nicht deine Operating-Ceiling — es ist der Cliff. Deine effektive Ceiling ist ungefähr 60–70% dieser Figur, und für komplexe Aufgaben näher bei 40–50%.

---

## Das 1M Context Window (Sonnet 4.6 Extended)

Sonnet 4.6 kann mit einem erweiterten 1M-Token Context Window zugegriffen werden. Das ist nicht der Standard.

**Wann man es nutzt:**
- Repository-Wide-Analysis-Aufgaben, wo du mehrere große Dateien gleichzeitig halten musst
- Long-Running-Autonomous-Loops, wo Compaction kritischen Intermediate-State würde verwerfen
- Cross-File-Refactors, wo 30+ Dateien gleichzeitig im Context für Korrektheit sein müssen
- Dokument-Analysis-Aufgaben (Legal, Research, Codebase-Archäologie), wo das Corpus wirklich das Window braucht

**Wann man es nicht nutzt:**
- Allgemeine Development-Arbeit — das Standard-200K-Modell handhabt die meisten Sessions ohne Issue
- Cost-Sensitive-Workflows — das 1M-Window trägt Premium-Pricing pro Token
- Aufgaben, wo extra Kapazität mit Noise anstelle von Signal füllt

**Kosten- und Latenz-Implikationen:**

Das 1M-Window beeinflusst Pricing und Response-Zeit. Bei vollem Context erhöht First-Token-Latenz merklich. Cache-Writes — incurred auf dem ersten Turn einer Sitzung — skalieren linear mit Context-Größe. Eine 200K-Token-Sitzung incurriert 200K Cache-Write-Tokens auf Turn eins. Eine 1M-Sitzung incurriert 1M. Wenn du 50 Sitzungen täglich runst und das 1M-Window unnötig nutzt, compoundiert dieser Overhead schnell zu Cache-Write-Kosten.

Faustregel: Nutze das Standard-200K-Modell, wenn du einen spezifischen, konkreten Grund hast, dass die Aufgabe mehr braucht. Die meisten Aufgaben, die 1M zu brauchen scheinen, können zu 200K mit richtiger Context-Hygiene umstrukturiert werden.

---

## Context-Rot: Warum Qualität degradiert, bevor das Limit

Context-Rot beschreibt die Qualitäts-Degradation, die auftritt, wenn ein Context Window füllt — well bevor das Hard-Limit erreicht ist. Der Mechanismus ist Attention-Dilution.

Claude verarbeitet Context via Attention — ein Mechanismus, der die Relevanz jedes Tokens zur aktuellen Generation wiegt. Als das Window wächst, fällt das Signal-to-Noise-Verhältnis des Context. Wichtige Constraints, die früh in der Sitzung setzen, konkurrieren mit Hundert-Tausenden Tokens von Tool-Outputs, Intermediate-Reasoning und Datei-Inhalten. Das Modell's Attention verteilt über alle.

**Die empirisch beobachtete Degradation-Kurve:**

| Context-Füll-Level | Quality-Signatur |
|---|---|
| 0–40% | Volle Qualität; Constraints und Instruktionen zuverlässig befolgt |
| 40–60% | Minor-Drift; Early-Instruktionen manchmal vermisst; leichte Wiederholung |
| 60–70% | Bemerkenswerte Degradation; Schlüssel-Fakten begraben und inconsistent retrieved |
| 70–85% | Signifikanter Rot; Entscheidungen widersprechen Earlier-Session-Constraints |
| 85%+ | Unreliable; effectiv operating auf Recent-Context nur |

Diese sind empirische Beobachtungen, keine Hard-Thresholds. Die aktuelle Degradation-Kurve variiert je nach Task-Typ, Context-Struktur und wie Front-Loaded vs. Evenly-Distributed das Signal ist.

---

## Warnzeichen von Context-Rot

Überwach diese Patterns. Jedes einzelne isoliert kann Noise sein; zwei oder mehr zusammen deuten darauf hin, dass Rot gesetzt hat.

**Wiederholung:** Claude erklärt etwas, das es bereits zwei Seiten zurück erklärte, Verbatim oder Near-Verbatim. Das ist das allererste Early-Signal — das Modell generiert von Recent-Context ohne die Earlier-Ableitung zu erinnern.

**Constraint-Forgetting:** Du hast Early in der Sitzung hergestellt, dass das Projekt ESLint mit Strict-Settings nutzt, oder dass eine bestimmte API veraltet ist, oder dass Tests nicht `describe.only` nutzen dürfen. Claude startet, diese Constraints zu verletzen. Die Instruktion ist noch im Context, aber ist nicht mehr reliably attended.

**Inconsistent-Decisions:** Du hast einen architektonischen Ansatz hergestellt — sagen, alle Datenbank-Zugriffe durch eine Repository-Schicht. Claude startet, direkte Datenbank-Calls in einem Service zu schreiben. Gefragt, zu erklären, produziert es Reasoning, das Earlier-Decisions widerspricht, ohne die Widerspruch zu erkennen.

**Re-Asking für Information:** Claude fragt, um Information, die es Earlier in der Sitzung retrieved oder du provided hast. Der Fakt ist im Context; das Modell ist nicht retrieving es.

**Vague-Responses auf Spezifische Themen:** Early in der Sitzung produzierte Claude präzise, spezifische Antworten. Later in der gleichen Sitzung, auf ähnliche Fragen, werden Responses hedged, generisch oder referenzieren den falschen Teil des Codebase. Das reflektiert flattened Attention über großem Context anstelle focused Retrieval.

**Die Fix ist nicht immer korrekt:** Das Korrekt nach Rot-Setting fügt mehr Tokens hinzu und compoundiert das Problem. Die rechte Response ist zu Compact oder eine Fresh-Sitzung zu starten.

---

## 7 Optimierung-Strategien

### 1. Front-Loading: Primacy und Recency

Attention ist nicht Uniform über den Context Window. Claude attends zu der Beginning und End des Context stärker als die Middle — dies ist der Primacy- und Recency-Effekt. Strukturiere deinen Context, um das zu exploitieren.

**Front-Load kritische Constraints:**

```
# Gute Session-Opening — Constraints angegeben bevor jeglicher Tool-Use
Du arbeitest am Payments Service in diesem Monorepo.
Schlüssel-Constraints für diese Sitzung:
- Alle Datenbank-Calls gehen durch src/db/repositories/ — niemals direkt zu Prisma
- Die PaymentService Klasse muss Stateless bleiben — keine Instance-Variablen, die State halten
- Error-Handling muss die AppError Klasse von src/errors/ nutzen
- Niemals die Migrations-Directory modifizieren — Schema-Änderungen sind out-of-Scope

Nun lass uns mit der Überprüfung der aktuellen PaymentService-Implementierung starten.
```

Wenn du eine Sitzung mit Tool-Use sofort öffnest — Datei-Reads, Bash-Commands — werden diese Constraints Downward gepusht. Wenn Context füllt, sind sie Buried in der Mitte des Windows.

**Wiederhole Kritische Constraints am Ende von Long-Inputs:**

Für sehr lange User-Nachrichten oder strukturierte Prompts, restate den einzelnen wichtigsten Constraint am Ende:

```
[... 500 Tokens von Context ...]

Erinnere dich: Alle Datenbank-Zugriffe müssen durch die Repository-Schicht gehen.
```

Das Recency-Signal stellt sicher, dass der Constraint in Claudes sofortiger Attention ist, wenn es anfängt zu generieren.

**Front-Load nicht den Noise:** Wende die gleiche Logik invers an. Verbose Background-Information, die nicht Decision-Relevant ist, sollte den Primacy-Slot nicht ocupieren. Lead mit Constraints und Objectives, nicht Project-Geschichte.

---

### 2. Strukturierte Zusammenfassungen: Compact-Timing

Der `/compact` Command ist in Detail in [context-budget.md](context-budget.md) abgedeckt. Die Timing-Frage ist spezifisch zu Long-Context-Sitzungen.

**Compact bei 40–50% Fill, nicht 80%.**

Bei 50% Fill hat der Compaction-Summarizer High-Quality-Signal zum Arbeiten. Die Konversation ist lange genug, um sinnvolle Entscheidungen und Outcomes produziert zu haben, aber kurz genug, dass der Summarizer noch Signal von Noise unterscheiden kann. Die Resultierende Zusammenfassung ist genau und vollständig.

Bei 80% Fill arbeitet der Summarizer mit einem Context, das bereits teilweise degradiert ist. Die Zusammenfassung, die es produziert, reflektiert den degradierten State — Important-Early-Decisions können unterrepräsentiert oder fehlend sein.

**Nutze Directed-Compaction:**

```
/compact fokus auf den Auth-Refactor — bewahre die Entscheidung, RS256 zu nutzen und die JWT-Shape, lösche den Debugging-Context für das Expired-Token-Issue
```

Ohne eine Directive macht der Summarizer autonome Wahlmöglichkeiten über was Matters. Eine spezifische Directive ankert es zu deinem aktuellen Working-Thread.

**Compact zwischen Major-Phases, nicht Mid-Task:**

Compact nach dem Completion einer bounded Sub-Task, bevor du nächste startest. Compacting Mid-Task riskiert, den Intermediate-State zu verlieren, den du brauchst, um fortzufahren. Das Pattern:

```
Phase 1: Exploration und Analyse → complete → /compact "bewahre Befunde auf Payment-Module-Architektur"
Phase 2: Implementierung → ... → complete → /compact "bewahre alle Änderungen, Datei-Pfade, Design-Entscheidungen"
Phase 3: Testing → ...
```

---

### 3. Targeted-Reads: Offset und Limit

Jeder Datei-Read enters Context in voller, wenn du ihn nicht constrainst. Für Long-Context-Sitzungen ist das die primäre Quelle von avoidable Bloat.

**Nutze `offset` und `limit` auf dem Read-Tool:**

```
# 2,000-Line-Datei: ~20K Tokens — liest ganze Datei
Read /path/to/service.ts

# Targeted-Read von Zeilen 400–450: ~500 Tokens
Read /path/to/service.ts, offset: 400, limit: 50
```

**Grep bevor du Read.** Nutze Grep, um die relevante Sektion zu finden, dann lese nur diese Sektion:

```bash
# Schritt 1: Finde die relevante Funktion
grep -n "processPayment" /path/to/payments.service.ts

# Output: Zeile 847
# Schritt 2: Lese nur diese Sektion
Read /path/to/payments.service.ts, offset: 840, limit: 60
```

Dieses Pattern — Grep zuerst, Targeted-Read zweite — reduziert Context-Konsumption um 80–95% für Navigation-Aufgaben zuverlässig.

**Zusammenfasse bevor Große-Dateien Read:**

Für sehr große Dateien, wo du ein High-Level-Verständnis brauchst, bevor du entscheidest, was zu read:

```bash
wc -l /path/to/large-file.ts && grep -n "^export\|^class\|^function\|^const.*=.*function" /path/to/large-file.ts | head -40
```

Das gibt dir die File's Exports und Struktur in ~40 Zeilen (~400 Tokens), anstelle ganze 2,000+ Zeilen zu lesen, um es zu verstehen.

---

### 4. Bash-Output-Trimming

Unkontrollierter Bash-Output ist die häufigste Ursache von sudden Context-Fill in Long-Sessions. Ein einzelner `npm install`, `docker build` oder `pytest -v` kann 5–20K Tokens in einem Tool-Call hinzufügen.

**Nutze diese Patterns systematisch:**

```bash
# Limit Log-Volume
docker logs my-container --tail 50
npm test 2>&1 | tail -30
./run-suite.sh | grep -E "PASS|FAIL|ERROR|WARN" | head -50

# Suppress Noise bei Source
curl -s https://api.example.com/v1/status         # -s unterdrückt Progress
rsync -a --quiet src/ dst/
npm install --silent

# Redirect stderr wenn nicht Relevant
make build 2>/dev/null
python setup.py install 2>/dev/null

# Extract Signal bevor es Context enters
git log --oneline -20
git diff --stat HEAD~5 HEAD
find . -name "*.ts" -newer src/auth.ts | head -20
```

**Nutze Pipe-und-Filter als Default-Discipline:**

```bash
# Statt: node scripts/analyze.js
# Nutze: node scripts/analyze.js | grep -v "^DEBUG:" | head -100
```

Die exakte Zeilenzahl Matters weniger als die Habit. Jeder Bash-Command mit potentiell Unbounded-Output sollte eine Truncation-Pipe davor haben, bevor es Context enters.

---

### 5. Subagent-Isolation für Large-Read-Tasks

Wenn eine Aufgabe viele Dateien Reading erfordert — ein Codebase-Survey, eine Dependency-Analyse, ein Security-Scan über 50 Module — es in Main-Context zu tun, füllt das Window mit Intermediate-Daten, das nur nützlich ist, um eine Conclusion zu produzieren.

**Das Subagent-Pattern:**

```
# Was NICHT zu tun ist (Main-Context liest 40 Dateien):
"Lese alle Dateien in src/auth/ und sage mir, was sie tun"
[Claude liest 40 Dateien in Main-Context — ~80K Tokens]
"Nun zusammenfasse die Architektur"

# Was zu tun ist (Subagent liest, gibt Zusammenfassung):
Spawn einen Subagenten mit:
  Task: Überblick alle Dateien in src/auth/.
  Gebe zurück: Eine strukturierte Zusammenfassung abdeckend (1) was jede Datei exports,
  (2) der Dependency-Graph zwischen ihnen, (3) jede Datei, die Sicherheits-Sensible-Logik enthält wie Token-Validierung oder Permission-Checks.
  Gib nicht Datei-Inhalte zurück — gib nur eine Strukturierte-Analyse.

[Subagent liest 40 Dateien in seinem eigenen Context — Main-Context empfängt ~1K Tokens strukturierter Befunde]
```

Der Main-Context empfängt Schlussfolgerungen, nicht die Raw Intermediate-Daten. Der Subagent's Context wird nach der Aufgabe verworfen.

**Wann man Subagent-Isolation nutzt:**
- Die Aufgabe umfasst Lesen von mehr als 10 Dateien für Discovery-Zwecke
- Die Intermediate-Read-Outputs (Datei-Inhalte) werden nach der Conclusion nicht wieder braucht
- Die Aufgabe ist Bounded und hat ein klares Deliverable-Format

**Wann man es nicht nutzt:**
- Du wirst direkt die Dateien, die surveyed werden, edieren müssen — der Parent-Context braucht, sie zu sehen
- Die Aufgabe ist einfach genug, dass der Overhead des Spawning nicht wert ist

---

### 6. CLAUDE.md-Scoping

`CLAUDE.md` lädt bei jedem Session-Start und occupiert Primacy — sie ist der erste Inhalt im Context. Jeder Token darin ist eine Fixed-Kosten, die bei jeder Sitzung bezahlt wird.

**Regeln für Long-Context-Sitzungen:**

Halte Projekt `CLAUDE.md` unter 2,000 Tokens. Das ist keine ästhetische Preference — das ist eine Budget-Entscheidung. Ein 3,000-Token `CLAUDE.md` kostet ein zusätzliche 1,000 Tokens von Primacy-Position Context bei jeder einzelnen Sitzung, die du runst. Über 50 Sitzungen pro Tag, das ist 50,000 zusätzliche Tokens täglich, compounding in Cache-Write-Kosten.

**Was in CLAUDE.md gehört (bleibt für immer):**
- Project-Beschreibung: 3–5 Sätze
- Schlüssel-Directories und deren Purpose
- Non-Obvious Conventions, die Claude befolgen muss
- Build-, Test-, Lint-Commands
- Dinge nicht zu modifizieren, ohne explizite Instruktion

**Was nicht darin gehört (Load auf Demand):**
- API-Reference-Dokumentation — Load via Targeted-Read wenn du in dem Area arbeitest
- Historische Entscheidungen — bewahre ein separates `decisions.md`, load es nur wenn du in der relevanten Domain arbeitest
- Lange Beispiele — Reference über Datei-Pfad, read auf Demand
- Regeln für Subsysteme, die du nicht aktuell arbeitest

**Domain-Scoped CLAUDE.md-Dateien:**

Für große Monorepos, nutze Directory-Level `CLAUDE.md`-Dateien:

```
/repo/
  CLAUDE.md                    # Global Conventions — unter 1,000 Tokens
  src/
    payments/
      CLAUDE.md                # Payments-Specific Rules — geladen nur wenn Claude in diesem Directory ist
    auth/
      CLAUDE.md                # Auth-Specific Rules
```

Claude liest die Directory-Level `CLAUDE.md`, wenn sie in dieses Directory navigiert. Das bedeutet, Context lädt inkrementell als Arbeit über Domains bewegt, anstelle alle Subsystem-Regeln bei Session-Start zu laden.

---

### 7. llms.txt: Externe Dokumentation ohne Pasting

Wenn eine Aufgabe externe Dokumentation erfordert — eine Library's API, ein Framework's Configuration-Referenz, eines Service's Integration Guide — der Default-Instinct ist, die relevante Sections in die Konversation zu pasten. Für Long-Context-Sitzungen ist das teuer und oft unnötig.

**Überprüfe llms.txt zuerst:**

```bash
curl -s https://docs.anthropic.com/llms.txt | head -50
curl -s https://docs.example.com/llms.txt | head -50
```

`llms.txt` ist ein Komprimiertes Dokumentations-Format, entworfen für LLM-Konsum. Libraries und Frameworks, die es publizieren, bieten 5–10x kleinere Darstellungen ihrer Dokumentation vs. Äquivalent Docs-Site-Inhalte. Wenn es existiert, nutze es als Primary-Referenz.

**Fetch nur die Spezifische Seite, die du brauchst:**

```bash
# Statt: Paste die ganze React Hooks-Dokumentation
# Nutze: Fetch die spezifische Hook's Seite
curl -s "https://react.dev/reference/react/useCallback" | ...
```

Oder Fetch via WebFetch-Tool mit Targeted-URL, anstelle von Scraping mehrerer Linked-Seiten.

**Referenz, nicht Paste:**

Für Well-Known-APIs, die Claude bereits kennt (Standard-Library-Funktionen, Major-Framework-APIs), Reference das Konzept und lass Claude aus Training reasonen, anstelle Dokumentation zu pasten. Nur Paste-Dokumentation, wenn du ein Spezifisches, Ungewöhnliches Konfiguration hast oder ein bekanntes Knowledge-Cutoff-Thema.

---

## Die PreCompact Hook

Wenn `/compact` fires — entweder manuell oder automatisch — generiert Claude eine Zusammenfassung der Konversation von seinem aktuellen Context. Die `PreCompact` Hook fires bevor diese Zusammenfassung generiert ist, da du ein Fenster hast, um strukturieren State zu injizieren, das der Summarizer incorporieren wird.

Das ist das korrekte Pattern für Long-Context-Sitzungen, wo das Verlust operationalen Kontexts nach Compaction Wiederherstellungs-Arbeit erzwingen würde.

**settings.json:**

```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/pre-compact.sh",
            "timeout": 15
          }
        ]
      }
    ]
  }
}
```

**`.claude/hooks/pre-compact.sh`:**

```bash
#!/usr/bin/env bash
# Fires bevor /compact. Injiziert Strukturiert Session-State in Compaction-Context.

set -euo pipefail

branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
recent_commits=$(git log -5 --oneline 2>/dev/null || echo "unavailable")
staged=$(git diff --cached --name-only 2>/dev/null | head -20 || echo "none")
unstaged=$(git diff --name-only 2>/dev/null | head -20 || echo "none")
open_files=$(git status --short 2>/dev/null | head -20 || echo "none")

# Lese die Offene Task-Liste, wenn du eine maintainst
tasks_file="${CLAUDE_PROJECT_DIR}/.claude/tasks.md"
tasks=""
if [ -f "$tasks_file" ]; then
  tasks=$(tail -30 "$tasks_file")
fi

cat <<EOF
=== PRE-COMPACT STATE INJECTION ===
Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
Branch: ${branch}

Recent Commits:
${recent_commits}

Staged Files:
${staged}

Unstaged Files:
${unstaged}

Working Tree Status:
${open_files}
EOF

if [ -n "$tasks" ]; then
cat <<EOF

Open Tasks (von .claude/tasks.md):
${tasks}
EOF
fi

echo "=== END STATE INJECTION ==="
```

Der Injizierte Inhalt ist in Context präsent, wenn die Compaction-Zusammenfassung generiert wird. Die Zusammenfassung, die Claude schreibt, wird den Branch, Commit-History und Datei-State incorporieren — so Post-Compaction, diese Information ist verfügbar, ohne dass du sie wiederherstellst.

**Erweitere dieses Pattern:**

Füge strukturiert State hinzu, das teuer ist nach Compaction wiederzuleiten:
- Architektonische Entscheidungen, die während der Sitzung gemacht wurden (Lese von Decision-Log)
- Der Output einer Major-Analysephase (Schreibe zu einer Datei Mid-Session, Injiziere sie bei Compact-Zeit)
- Die aktuelle Task-Queue, wenn du eine maintainst

---

## Nutze `/usage`, um Context-Nutzung zu Tracken

Der `/usage` Command zeigt eine Per-Category Token-Breakdown für die aktuelle Sitzung.

**Laufe es bei Session-Start:**

```
/usage
```

Das Session-Start-Baseline zeigt deinen Fixed-Overhead, bevor jegliche Arbeit: System-Prompt, CLAUDE.md, MCP Tool-Definitionen. Wenn diese Nummer 30–40K Tokens übersteigt, hast du ein Konfiguration-Problem — zu viele MCP-Server, ein Overgrown CLAUDE.md oder beides. Repariere es, bevor die Sitzung wächst.

**Kategorien, die angezeigt werden:**

| Kategorie | Was es reflektiert | Aktion, wenn Hoch |
|---|---|---|
| System Prompt | Claude Code Built-Ins + CLAUDE.md | Trim CLAUDE.md; Disable Unused MCP Server |
| MCP Tool-Definitionen | Ein Entry pro Tool über alle Enabled Server | Disable Server, die du diese Sitzung nicht nutzt |
| Conversation History | Akkumulierte Turns — beide User und Assistant | Compact, wenn 40% näher |
| Tool Results | Datei-Reads, Bash-Outputs, MCP-Responses | Review Recent Tool-Calls für Verbose-Outputs |
| Agent Sub-Calls | Jeder Spawned Subagent's Context-Contribution | Stelle sicher, dass Subagents Zusammenfassungen, nicht Raw-Tool-History zurückgeben |

**Nutze es, um Phasen zu Benchmark:**

Laufe `/usage` beim Start jeder Major-Phase — nach Exploration, nach Planung, nach Implementierung-Start. Das gibt dir eine Konsumptions-Map: wie viel Token jede Phase kostet. Bei einem Zweiten oder Dritten ähnlichen Projekt, kannst du vorhersagen, wo du das 40%-Threshold hit und Compaction proaktiv planen.

---

## Autonomous Loop Patterns

Long-Running Autonomous Sitzungen akkumulieren Context anders als Interaktive Sitzungen. Jede Loop-Iteration fügt zum gleichen Window, wenn die Sitzung nicht strukturiert ist, um das zu verhindern.

**Schreibe State zu Disk zwischen Iterationen:**

```bash
# Am Ende jeder Loop-Iteration, Schreibe strukturiert State
cat > "${CLAUDE_PROJECT_DIR}/.claude/loop-state.json" <<'EOF_TEMPLATE'
{
  "iteration": ${ITERATION},
  "completed": ${COMPLETED_JSON},
  "current_task": "${CURRENT_TASK}",
  "blockers": ${BLOCKERS_JSON},
  "next": "${NEXT_TASK}",
  "decisions": ${DECISIONS_JSON}
}
EOF_TEMPLATE
```

**Lese State beim Start jeder Iteration:**

```bash
# Start nächster Iteration — Lese die State-Datei, anstelle Context zu tragen
state=$(cat "${CLAUDE_PROJECT_DIR}/.claude/loop-state.json")
echo "Resuming von State: $state"
```

Die Sitzung trägt nur die State-Datei's Inhalte als Starting-Context für die Neue Iteration. Alle Intermediate Tool-History von Previous Iterations ist absent.

**Nutze ScheduleWakeup für Hard Context-Resets:**

Wenn eine Loop-Iteration signifikante Wall-Zeit nimmt, nutze `ScheduleWakeup`, um das aktuelle Context-Window zu beenden und in einem Fresh bei dem Nächsten Tick zu resumieren. Der Trade-off ist ein Cache-Miss (Delays von ein Paar Minuten oder mehr für Context-Initialisierung), das ist akzeptabel, wenn jede Iteration mehr als ein Paar Minuten nimmt und der Akkumulierte Context-Overhead nicht wert ist zu tragen.

**Nutze SessionStart + Stop Hooks für Persistent State:**

Für Multi-Session Autonomous Work, paare eine `Stop` Hook (Schreibe Session-Zusammenfassung zu Disk) mit einer `SessionStart` Hook (Injiziere Previous-Session's Zusammenfassung). Sehe [context-budget.md](context-budget.md) für die Volle Implementierung. Das gibt jedem Neuen Context-Window strukturiert Orientierung, ohne dass explorativ Reads erforderlich sind.

---

## Wann man Compact vs. Fresh-Session startet

Die Wahl zwischen `/compact` und einer Fresh-Sitzung hängt davon ab, was du forwärt tragen musst.

**Compact wenn:**
- Du brauchst, die aktuelle Aufgabe fortzuführen — Compaction bewahrt den Working-Thread
- Datei-Edits wurden gemacht, und du brauchst Claude, um davon Bewusst zu bleiben
- Du bist Mid-Implementierung, und Sitzung zu abandonieren würde Re-Establishing-Context über Änderungen erfordern, die bereits geschrieben wurden
- Die Sitzung ist bei 40–60% Füllung und die Aufgabe hat sinnvolle Arbeit, die verbleibt

**Starte eine Fresh-Sitzung wenn:**
- Die aktuelle Aufgabe komplett ist — es gibt nichts zu tragen
- Die Sitzung hat signifikant degradiert und Compaction-Qualität würde poor sein
- Du startst eine vollständig unverbundene Aufgabe im gleichen Codebase
- Die Sitzung ist Past 70% Füllung und du hast nicht Compacted — der akkumuliert Rot macht die Compaction-Zusammenfassung unreliable

**Die Kosten des Wartens:**

Bei 80% zu Compacten kostet mehr als bei 50% zu Compacten auf zwei Wegen. Zuerst, die 80%-Sitzung hat bereits degradiert — Claude hat auf Lower-Quality für 30% des Context-Window operiert, das es nicht brauchte. Zweite, die Compaction-Zusammenfassung, die von degradiertem 80%-Context generiert wird, ist weniger genau als eine, die von klarem 50%-Context generiert wird. Du zahlst die Degradation-Penalty und erhältst eine schlechtere Zusammenfassung.

**Directed Compact zum Bewahren des Kritischen Thread:**

```
/compact fokus auf den Payment-Integration Refactor — spezifisch bewahre:
- Die Entscheidung, Idempotency-Keys auf allen Write-Operationen zu nutzen
- Die Änderung zu PaymentService.processCharge() auf Zeile 847
- Das Offene Issue mit der Webhook-Retry-Logik noch nicht gelöst
```

Ohne diese Richtung, könnte der Summarizer nicht wissen, welcher der Session's vielen Threads derjenige ist, auf dem du fortführst.

---

## Cost-Implikationen von Großen Context-Sitzungen

Context-Größe beeinflusst Kosten auf mehrere Wegen, die nicht immer sofort offensichtlich sind.

**Cache-Write-Tokens auf First Turn:**

Wenn eine Sitzung startet, wird das ganze Context zum Prompt-Cache geschrieben. Ein 200K-Token-Sitzung incurriert 200K Cache-Write-Tokens auf Turn eins. Diese sind am Cache-Write-Rate berechnet, das ist Niedriger als Input-Token-Rate, aber nicht Null. Tägliche Sitzungen bei High-Context-Füllung Running compoundiert diese Kosten.

**Input-Tokens bei Cache-Miss:**

Wenn eine Sitzung nicht den Cache hit — First-Sitzung, Cold-Start, Sitzung älter als Cache-TTL — alle Context-Tokens werden als Input-Tokens bei der Vollen Input-Rate berechnet. Für einen 200K-Context, das ist ein signifikanter Unterschied Cost-Weise vs. ein Cache-Hit.

**Das 1M-Window Premium:**

Das Extended 1M Context-Window auf Sonnet 4.6 trägt ein Premium in beiden Preis und Latenz. Eine Volle 1M-Context-Sitzung mit 200K Actual-Useful-Content und 800K Noise zu laufen wastet beides. Nutze das Extended-Window nur wenn die Aufgabe wirklich die Kapazität braucht.

**Praktische Cost-Verwaltung für Long-Context-Sitzungen:**

- Halte Sitzungen zu einzelnen Aufgaben fokussiert — Idle-Context sparet nicht Geld
- Compact bevor Start von teuren Multi-File-Aufgaben, um die Baseline niedrig zu halten
- Disable MCP-Server nicht für die aktuelle Sitzung (MCP Tool-Definitionen laden bei Session-Start und können nicht Mid-Session entfernt werden)
- Nutze das Standard-200K-Window für alle Aufgaben, die nicht demonstrierbar mehr brauchen

---

## Pre-Session Checkliste für Long-Context-Arbeit

Bevor du eine Sitzung startest, die du über 50–100 Turns läuft oder signifikante Datei-Reads beinhaltet, verifiziere diese 12 Items.

- [ ] **Model-Auswahl bestätigt** — nutze 1M Context nur wenn die Aufgabe wirklich es braucht
- [ ] **Nur Notwendige MCP-Server aktiviert** — Disable Server, die nicht in dieser Sitzung genutzt werden
- [ ] **CLAUDE.md ist unter 2,000 Tokens** — Audit es, wenn es organisch gewachsen ist
- [ ] **Kritische Constraints geschrieben** — werden Front-Geladen in der Opening-Nachricht sein
- [ ] **Datei-Read-Strategie geplant** — Grep-dann-Targeted-Read, nicht volle Datei-Reads
- [ ] **Bash-Output-Pipes in Place** — alle Commands mit Unbounded-Output haben `| head -N` oder `| grep pattern`
- [ ] **PostToolUse Kompression Hook installiert** — sehe [context-budget.md](context-budget.md) für Implementierung
- [ ] **PreCompact Hook installiert** — wird Git-State und Task-Liste bei Compaction-Zeit injizieren
- [ ] **Compact-Threshold entschieden** — Plan zu Compact bei 40–50% Füllung, nicht 80%+
- [ ] **Subagent-Plan ready** — Aufgaben mit 10+ Datei-Reads werden zu Subagenten delegiert
- [ ] **State-zu-Disk-Pattern gesetzt** — für Autonomous Loops, State-Datei-Pfade definiert
- [ ] **`/usage` wird bei Session-Start überprüft** — Baseline-Overhead bestätigt, bevor erste Aufgabe

Diese Items sind Checkboxes, nicht Aspirational Goals. Vermisse PostToolUse Hook kostet echtes Geld über jeden Verbose Bash-Command in der Sitzung. Vermisse Compact-Threshold-Entscheidung bedeutet, du compactest reaktiv bei 80% anstelle proaktiv bei 50%. Jedes Item hat messbare Auswirkung auf Session-Qualität und Kosten.

---

## Häufige Fehler-Patterns und ihre Fixes

**Fehler: Session degradiert bei Turn 30, trotz unter 50% Füllung**

Ursache: ein Verbose Tool-Output Early in der Sitzung (z.B. eine 5,000-Zeilen-Log-Vollständig Read) occupiert 40% des Windows, bleibt 10% für aktuellen Arbeit-Context.

Fix: Identifiziere den großen Block via `/usage`, note, dass Tool-Ergebnisse Kategorie high ist relativ zu Conversation-History. Gehen-forward, Ausgabe-Trimming zu dem offending Command.

**Fehler: Post-Compaction Claude fragt über Dinge, das es wissen sollte**

Ursache: die Compaction-Zusammenfassung verlorene Schlüssel-Entscheidungen, weil sie nicht Front-Geladen oder Reinforced waren. Der Summarizer deprioritisiert sie.

Fix: Nutze Directed Compact mit expliziten Retention-Instruktionen. Installiere PreCompact Hook. Nach Compaction, öffne mit Brief-Wiederholung des kritischsten Constraints, bevor du Arbeit fortfährst.

**Fehler: 1M Context-Sitzung ist langsam und teuer, aber produziert nicht bessere Ergebnisse**

Ursache: die Aufgabe braucht nicht 1M Tokens. Die Extra-Kapazität ist mit Noise gefüllt — Verbose Bash-Outputs, Volle Datei-Reads, Wiederholter Context.

Fix: Wechsel zu Standard-200K. Nutze Context-Hygiene-Strategien, um die Sitzung in das kleinere Window zu fit. Wenn die Aufgabe wirklich nicht in 200K mit richtiger Hygiene fit, revisit das 1M-Window.

**Fehler: Autonomous Loop degradiert über 20 Iterationen ohne Compaction**

Ursache: jede Iteration hinzugefügt 10K Tokens von Tool-History zum gleichen Context ohne Reset-Mechanismus.

Fix: Implementiere den Schreib-State-zu-Disk Pattern. Considere ScheduleWakeup für Hard-Reset zwischen Langen Iterationen.

---
