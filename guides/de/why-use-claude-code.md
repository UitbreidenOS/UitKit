# Warum Claude Code — Harnisch vs Prompt

Ein häufiges Missverständnis: « Mit verbesserung der Modelle werden Funktionen zu Prompts — also ein gut geschriebener Prompt ist gleich einem vollständig konfigurierten Harnisch. » Das ist falsch. Zu verstehen, warum dies wichtig ist, um das Beste aus Claude Code herauszuholen und zu entscheiden, was in einen Prompt gehört versus was in die Konfiguration gehört.

---

## Die 10 Dinge, die ein Harnisch tut, die Prompts nicht können

| # | Fähigkeit | Harnisch | Prompt |
|---|---|---|---|
| 1 | **Kontext-Isolation** | Sub-Agenten laufen in separaten Kontextfenstern | Prompts teilen einen Kontext — alles leckt zusammen |
| 2 | **Tool-Einschränkungen** | Harnisch erzwingt, welche Tools ein Agent aufrufen kann — auf Laufzeit-Ebene blockiert | Prompts können nur anfragen; das Modell kann sich einhalten oder nicht |
| 3 | **Lazy Loading** | Kompetenzen laden nur bei semantischer Übereinstimmung — Startup-Kontext bleibt klein | Prompts müssen alle Anweisungen vorab laden — großer Kontext vom Start |
| 4 | **Hooks** | Shell-Befehle aktivieren sich bei Ereignissen (PreToolUse, Stop, PostCompact) unabhängig von der Modell-Ausgabe | Prompts instruieren; das Modell entscheidet zu folgen |
| 5 | **Modell-Routing** | Verschiedene Aufgaben leiten zu Haiku, Sonnet oder Opus basierend auf Agent-Definition | Ein Prompt läuft auf einem Modell — kein Routing |
| 6 | **Parallelität** | Mehrere Agenten laufen gleichzeitig in separaten Prozessen | Sequenzielle Prompts können nicht parallelisieren — ein Zug gleichzeitig |
| 7 | **Sitzungsübergreifende Persistenz** | CLAUDE.md, Regeln und Memory persistieren automatisch über jede Sitzung | Prompts zurückgesetzt bei Sitzungsende — Kontext muss jedes Mal erneut eingespritzt werden |
| 8 | **Modularer Systemprompt** | Hunderte bedingter Fragmente aktivieren basierend auf Projektkonfiguration | Ein flacher Prompt — alles ist immer vorhanden oder nie |
| 9 | **Automatische Kompetenzen-Aktivierung** | Domain-Expertise aktiviert sich bei Datei-Match oder semantischem Trigger | Kompetenzen müssen manuell aufgerufen werden — nichts ist automatisch |
| 10 | **Berechtigungsgates** | Harnisch erzwingt `allow`/`deny` Regeln für destruktive Operationen auf Laufzeit-Ebene | Prompts können nur höflich anfragen — keine Durchsetzung |

---

## Die Token-Asymmetrie

Ihr Prompt ist typischerweise 6–60 Tokens. Der Harnisch verwaltet 5.000–50.000+ Tokens der Modell-Eingabe durch Lazy Loading, bedingte Aktivierung und Prompt-Caching.

Ein « starker Prompt » funktioniert auf der Benutzer-Eingabe-Ebene — ein Bruchteil dessen, was das Modell tatsächlich sieht. Er kann nicht erreichen:

- Die Systemprompt-Fragmente, die vor Ihrer Nachricht eingespritzt werden
- Die Werkzeug-Beschreibungen, die vom Harnisch geladen werden
- Der Kompetentz-Inhalt, der durch Datei-Kontext aktiviert wird
- Die Regel-Dateien, die zum aktuellen Arbeits-Pfad passen
- Der gecachte CLAUDE.md-Inhalt aus vorherigen Sitzungen

Einen langen, detaillierten Benutzer-Prompt zu schreiben, um fehlende Konfiguration zu kompensieren, ist wie die Signalstärke zu erhöhen, indem man schreit, während man den Rausch-Boden ignoriert.

---

## Praktische Konsequenzen

**Reproduzieren Sie nicht das Harnisch-Verhalten in Prompts.**

Prompts, die Werkzeug-Einschränkungen durchzusetzen versuchen (« verwende Bash nicht ») oder persistent Voreinstellungen zu setzen (« verwende immer TypeScript für neue Dateien ») sind nicht zuverlässig. Das Modell kann ihnen meistens folgen, aber es gibt keine Garantie. Harnisch erzwingt; Prompts fragen.

| Was Sie wollen | Falsche Approach | Richtige Approach |
|---|---|---|
| Persistente Coding-Standards | In jedem Prompt wiederholen | `CLAUDE.md` |
| Agent auf read-only beschränken | « Bitte keine Dateien schreiben » | Agent `tools:` Whitelist |
| Linter nach jeder Änderung ausführen | « Bitte linter nach Edits ausführen » | `PostToolUse` Hook |
| Domain-Expertise für eine Aufgabe | Dokumente in Prompt einfügen | Kompetentz-Datei |
| Garantierte Nebenwirkungen | « Nach dem Abschluss benachrichtige mich » | `Stop` Hook |
| Sicherheitsgrenze | « Nicht die Prod-Credentials berühren » | `deny` Berechtigung Regel |

---

## Wenn Prompts das Richtige Werkzeug sind

Prompts sind das richtige Werkzeug für:

- **Einmalige Task-Anweisungen** — spezifisches, einmaliges Guidance, das sich nicht verallgemeinert
- **Dynamischer Kontext** — Information, die nur zur Laufzeit bekannt ist (eine URL, ein vom Benutzer bereitgestellter Dateipfad, eine spezifische Versionsnummer)
- **Gesprächs-Lenkung** — Umleitung mid-Sitzung basierend auf dem, was Sie gerade sehen
- **Mehrdeutigkeit klären** — erklären, wie « richtiges Verhalten » für diesen speziellen Fall aussieht

Alles andere — Standardwerte, Standards, Muster, Einschränkungen, Automatisierung, Persistenz — gehört zur Harnisch-Ebene.

---

## Der Zins-Effekt

Harnisch-Konfiguration setzt sich zusammen. Ein Projekt mit gut strukturiertem CLAUDE.md, drei fokussierten Kompetenzen, zwei Hook-Automatisierungen und ordnungsgemäß eingeschränkten Agenten funktioniert am Tag 100 besser als am Tag 1, da jede Sitzung von der angesammelten Konfiguration ohne zusätzliche Prompt-Entwicklung profitiert.

Ein Projekt, das sich auf Prompts verlässt, verschlechtert sich mit der Zeit. Während die Codebasis wächst, werden Prompts länger, der Kontext wird lauter, und der Overhead beim Wiederherstellen des Kontexts am Anfang jeder Sitzung steigt.

Die Investition in Harnisch-Konfiguration zahlt sich auf jeder zukünftigen Sitzung aus. Die Investition in einen langen Systemprompt zahlt sich nur auf dem aktuellen aus.

---
