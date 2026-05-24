# Claude Mythos Vorschau

Ein Leitfaden für Anthropics Claude Mythos-Initiative — ein Forschungs-Vorschau-Programm, das Fähigkeiten jenseits von Standard-Claude-Bereitstellungen erforscht. Geschrieben für fortgeschrittene Claude Code-Benutzer, KI-Forscher und Entwickler, die an der Grenze dessen arbeiten, was agentenbasierte Systeme können.

---

## Was ist Claude Mythos

Claude Mythos ist ein Forschungs-Vorschau-Programm von Anthropic Labs, das Anfang 2026 angekündigt wurde und sich auf die Erkundung von Claudes Fähigkeiten außerhalb der Grenzen des Standard-Produkts konzentriert, das allgemein verfügbar ist. Es ist keine Produktversion — es ist ein strukturiertes Zugriffsprogramm zum Testen und Validieren von Fähigkeiten, die noch nicht für allgemeine Verfügbarkeit bereit sind.

Die Initiative zielt auf drei Kapazitäts-Cluster ab:

**Erweiterte Reasoning-Ketten.** Standard-Claude-Modelle arbeiten innerhalb eines festen Thinking-Budgets. Mythos-Varianten können Reasoning-Ketten deutlich länger aufrechterhalten als die Standard-Token-Grenze, was eine tiefere Zerlegung von Problemen ermöglicht, die viele Reasoning-Schritte erfordern, bevor man zu einer umsetzbaren Schlussfolgerung gelangt. Dies ist nicht einfach ein größeres Kontextfenster — die Reasoning-Architektur selbst ist so konfiguriert, dass mehr iterative Verfeinerung vor dem Commit zu einer Ausgabe ermöglicht wird.

**Langfristige Multi-Turn-Tool-Nutzung.** Standard-Claude Code-Sitzungen können komplexe Multi-Step-Aufgaben abschließen, aber Kontextdruck und Tool-Call-Tiefe-Limits setzen praktische Obergrenzen. Mythos ist so konzipiert, dass es kohärenten Aufgabenzustand über 100+ Tool-Aufrufe hinweg aufrechterhält, wobei die Zielkonformität über eine lange Aktionsfolge gewahrt bleibt, ohne die typische Verschlechterung in erweiterten Agenten-Sitzungen.

**Neuartige Fähigkeitstests vor allgemeiner Freigabe.** Mythos dient als kontrollierte Oberfläche für Anthropic, um Fähigkeiten zu bewerten — einschließlich Multi-Modal-Reasoning, neuartiger Tool-Interaktionsmuster und Agent-Koordinations-Primitiven — bevor diese Fähigkeiten zu Production-Modellen befördert werden. Verhaltensweisen, die in Mythos beobachtet werden, können sich ändern, entfernt werden oder in einer anderen Form in späteren GA-Releases erscheinen.

Der Zugang ist selektiv. Pro-, Max-, Team- und Enterprise-Abonnenten können über das Anthropic Labs-Programm einen Early-Access anfordern. Der Zugang wird auf fortlaufender Grundlage gewährt, mit Priorität für Forscher, Power-User mit hoher Nutzung und Use-Cases, die nützliches Signal für Anthropics Evaluierungsarbeit generieren.

---

## Wie es sich von Standard-Claude unterscheidet

| Funktion | Claude (Standard) | Claude Mythos |
|---|---|---|
| Thinking-Budget | Bis zu ~32K Tokens | Erweitert — Research-Limit, nicht veröffentlicht |
| Maximale Sitzungslänge | Standard-Kontextfenster | Erweitertes Kontextfenster |
| Tool-Call-Tiefe | Standard-Limits | Tiefere rekursive Tool-Nutzung unterstützt |
| Verfügbarkeit | Allgemein verfügbar | Labs-Vorschau — selektiver Zugang |
| Modell-Identifikator | claude-sonnet-4-6, claude-opus-4-6 | Research-Variante — siehe Labs-Dashboard |
| SLA | Ja (für API- und Enterprise-Tiers) | Keine — Preview-Modelle haben keine SLA |
| Latenz | Standard | Höher aufgrund erweiterter Reasoning-Durchläufe |
| Produktionsreife | Ja | Nein — nicht für Production-Workloads geeignet |

Der Modell-Identifikator für Mythos-Varianten wird nicht in der Standard-API-Dokumentation veröffentlicht. Wenn Sie Zugang haben, erscheint die korrekte Modell-ID im Anthropic Labs-Dashboard. Codieren Sie keine angenommene Modell-Zeichenkette hart ein — rufen Sie sie vom Dashboard ab und behandeln Sie sie als zwischen Preview-Updates änderbar.

---

## Auf Mythos zugreifen

Der Zugang ist nicht automatisch, auch nicht für zahlende Abonnenten. Der Prozess:

1. Navigieren Sie zu `claude.ai/labs` und bewerben Sie sich für die Mythos-Vorschau.
2. Ein aktives Pro-, Max- (5x oder 20x), Team- oder Enterprise-Abonnement ist erforderlich. Free-Tier-Konten sind nicht berechtigt.
3. Anwendungen werden auf fortlaufender Grundlage überprüft. Es gibt keine veröffentlichte SLA dafür, wann der Zugang gewährt wird. Priorität wird Use-Cases mit klarem Research-Wert gegeben.
4. Sobald genehmigt, wird API-Zugang durch eine separate Preview-Modell-ID bereitgestellt, die im Labs-Dashboard sichtbar ist. Diese Modell-ID unterscheidet sich von jeder Production-Modell-ID und ändert sich bei jedem Preview-Update.
5. Interaktiver Claude.ai-Zugang (falls gewährt) erscheint als separater Mode-Selektor — er ist nicht standardmäßig in der Hauptoberfläche aktiviert.

Wenn Sie einen Team- oder Enterprise-Plan haben, kann die Zugriffsverwaltung erfordern, dass ein Administrator Mythos für bestimmte Sitze aktiviert. Überprüfen Sie mit dem Anthropic-Account-Kontakt Ihrer Organisation.

Es gibt keinen Self-Service-Upgrade-Pfad zu Mythos. Es ist ein Anwendungs-gesteuertes Programm.

---

## Was Sie mit Mythos in Claude Code tun können

Die folgenden Use-Cases profitieren materiell von Mythos-Fähigkeiten gegenüber Standard-Claude Code:

**Langfristige Codebase-Refaktorisierungen.** Aufgaben wie die Migration einer gesamten Codebase von einem Framework zu einem anderen oder die Durchsetzung eines neuen Architektur-Musters über Hunderte von Dateien erfordern, einen konsistenten Modell des Zielzustands zu halten, während Dutzende von Datei-Edits ausgeführt werden. Mythos' erweitertes Kontext- und Tool-Call-Tiefe-Support macht diese Aufgaben zuverlässiger — weniger Mid-Session-Kontext-Zusammenbrüche, bessere Zielbeibehaltung über viele Sub-Schritte.

**Komplexe Multi-Step-Research-Aufgaben.** Wenn eine Aufgabe das Lesen vieler Dokumente, das Synthetisieren von Informationen über Quellen, das Bilden von Hypothesen, das Testen gegen zusätzliche Quellen und das Revidieren erfordert, ermöglicht das erweiterte Reasoning-Budget gründlichere Reasoning-Spuren vor dem Commit zu Schlussfolgerungen. Dies unterscheidet sich vom bloßen Haben von mehr Kontext — es ändert die Qualität von zwischenliegenden Reasoning-Schritten.

**Erweiterte autonome Sitzungen.** Standard-Agenten-Sitzungen in Claude Code sind praktisch für Aufgaben, die in Dutzenden von Schritten abgeschlossen werden. Mythos ist so konzipiert, dass es Sitzungen unterstützt, die deutlich länger laufen, ohne die typische Verschlechterung der Aufgaben-Kohärenz. Dies ist relevant für vollständig autonome Agenten, die lange Build-Test-Fix-Zyklen oder Multi-Phase-Workflows ausführen.

**Neuartige Agent-Koordinationsmuster.** Mythos ist die angemessene Oberfläche zum Testen von Orchestrierungs-Mustern, die einen Koordinator erfordern, der Zustand über viele gespawnte Sub-Agent-Aufrufe hinweg hält. Wenn Sie ein Multi-Agent-System entwickeln, das Standard-Koordinations-Limits sprengt, bietet Mythos einen Kontext, in dem diese Limits ausreichend gelockert sind, um neue Muster zu erkunden — mit dem Verständnis, dass, was in Preview funktioniert, möglicherweise Anpassung erfordert, wenn das Muster zu Production-Modellen wechselt.

---

## Erweiterter Reasoning-Modus

Wenn Sie Mythos-Zugang haben, ist erweitertes Thinking auf API-Ebene konfiguriert, wenn Aufrufe zum Preview-Modell gemacht werden.

**Aktivieren des erweiterten Thinking-Budgets in API-Aufrufen.** Im Anthropic SDK akzeptiert der Parameter `thinking` einen `budget_tokens`-Wert. Für Standard-Modelle gilt das dokumentierte Limit. Für Mythos-Preview-Modelle ist das effektive Limit höher — das genaue Limit ist im Labs-Dashboard für Ihre Zugriffs-Tier dokumentiert und unterliegt Änderungen zwischen Preview-Updates.

```python
response = client.messages.create(
    model="<mythos-model-id-from-labs-dashboard>",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 80000  # example — verify your tier's limit in the dashboard
    },
    messages=[{"role": "user", "content": your_prompt}]
)
```

Nehmen Sie kein spezifisches `budget_tokens`-Limit an. Holen Sie sich das Limit vom Labs-Dashboard. Das Überschreiten des unterstützten Limits führt zu einem API-Fehler, nicht zu stiller Kürzung.

**Die Thinking-Spur lesen.** Das Response-Objekt enthält einen `thinking`-Content-Block neben dem `text`-Block. Die Thinking-Spur ist die interne Reasoning des Modells — sie spiegelt die Schritte wider, die vor der Erzeugung der endgültigen Antwort unternommen wurden. Im erweiterten Reasoning-Modus kann diese Spur wesentlich länger sein als im Standard-Modus. Behandeln Sie sie als diagnostische Ausgabe statt benutzer-seitiger Inhalte. Sie ist nützlich, um zu verstehen, warum das Modell zu einer bestimmten Schlussfolgerung gelangte, um zu identifizieren, wo das Reasoning in einer fehlgeschlagenen Aufgabe fehlging, und um zu kalibrieren, ob erweitertes Reasoning Wert für eine gegebene Aufgabenklasse bietet.

**Wenn erweitertes Reasoning hilft.** Erweitertes Reasoning ist am wertvollsten für Aufgaben, bei denen die richtige Antwort nicht unmittelbar ableitbar ist — Probleme, die mehrere Ansätze erfordern, Aufgaben mit vielen interdependenten Constraints, die gleichzeitig erfüllt werden müssen, und Research-Aufgaben, bei denen die Frage selbst Verfeinerung benötigt, bevor eine Antwort Sinn macht. In diesen Fällen ermöglicht das erweiterte Budget dem Modell, mehr des Problemraums zu erschöpfen, bevor es sich einigt.

**Wenn erweitertes Reasoning zu viel ist.** Einfache, gut spezifizierte Aufgaben profitieren nicht von erweiterten Thinking-Budgets. Eine Anforderung, eine Datei zu formatieren, einen Unit-Test für eine klar definierte Funktion zu schreiben oder einen Wert in einem Dokument nachzuschlagen, verbessert sich nicht mit mehr Reasoning-Tokens — es kostet nur mehr und dauert länger. Verwenden Sie erweitertes Thinking nur für Aufgaben, bei denen die Reasoning-Komplexität die Kosten und Latenz rechtfertigt.

**Kosten.** Erweitertes Thinking Tokens werden zum Thinking-Token-Rate berechnet, die sich vom Standard-Input/Output-Token-Rate unterscheidet. Thinking Tokens sammeln sich schnell im erweiterten Reasoning-Modus. Für Kostendetails siehe [guides/billing-and-pricing.md](billing-and-pricing.md). Überwachen Sie Ihre Nutzung während Mythos-Sitzungen — die Preview-Modelle können sehr lange Thinking-Spuren auf komplexen Aufgaben generieren.

---

## Einschränkungen und Vorbehalte

Mythos ist ein Preview-Programm. Diese Bezeichnung hat spezifische, nicht verhandelbare Implikationen:

**Verhaltensänderungen zwischen Updates.** Anthropic aktualisiert Preview-Modelle häufiger als Production-Modelle und ohne die Stabilitätsgarantien, die für GA-Releases gelten. Ein Verhalten, auf das Sie heute zählen, kann sich im nächsten Preview-Update ändern. Bauen Sie keine Production-Systeme auf Mythos-Modell-Identifikatoren oder Verhaltensweisen.

**Nicht alle Claude Code-Funktionen werden mit Mythos-Varianten validiert.** Funktionen wie Hooks, bestimmte MCP-Server-Integrationen und spezifische Tool-Call-Muster werden gegen Production-Modelle getestet. Kompatibilität mit Mythos-Varianten ist nicht garantiert, und aufgetretene Probleme werden möglicherweise nicht priorisiert für Fixes angesichts des Preview-Status.

**Höhere Latenz.** Erweiterte Reasoning-Durchläufe kosten Zeit. Aufgaben, die auf Standard-Modellen in Sekunden abgeschlossen werden, können auf Mythos Minuten dauern, wenn das volle Reasoning-Budget eingebunden ist. Dies ist erwartetes Verhalten, kein Bug, aber es disqualifiziert Mythos für jeden Latenz-empfindlichen Use-Case.

**Nicht für Production-Workloads geeignet.** Das Fehlen eines SLA ist das explizite Signal hier. Wenn eine Workload Zuverlässigkeitsgarantien erfordert, verwenden Sie GA-Modelle. Mythos existiert für Research und Exploration, nicht zum Bedienen von End-Usern.

**Zugang kann widerrufen werden.** Als Preview-Programm behält sich Anthropic das Recht vor, den Zugang anzupassen, Bedingungen zu ändern oder die Preview ohne vorherige Ankündigung einzustellen. Planen Sie entsprechend — bauen Sie keine kritische Infrastruktur auf Preview-Zugang.

**Begrenzte Dokumentation.** Mythos-Fähigkeiten sind absichtlich unterdokumentiert in öffentlichen Kanälen. Das Labs-Dashboard ist die autorisierte Quelle für Ihr Zugriffs-Tier-Limits, Modell-IDs und unterstützte Funktionen. Verlassen Sie sich nicht auf Third-Party-Dokumentation als primäre Referenz.

---

## Aktuell bleiben

Mythos entwickelt sich schneller als das Standard-Produkt. Die folgenden Quellen sind autorisierte Referenzen:

- `anthropic.com/research` — Anthropics primärer Kanal zur Ankündigung von Research-Richtungen, neuen Fähigkeiten und Programmaktualisierungen. Hier werden Mythos-Level-Entwicklungen zuerst öffentlich diskutiert.
- `claude.ai/labs` — Das Zugangsportal und Dashboard für Labs-Programme einschließlich Mythos. Modell-IDs, Tier-Limits und Feature-Verfügbarkeit sind hier für eingeschriebene Benutzer dokumentiert.
- `anthropic.com/claude/changelog` — Das öffentliche Changelog für Claude-Modell- und Produktänderungen. Preview-Modell-Updates können hier mit weniger Detail als Production-Modell-Änderungen erscheinen, aber signifikante Updates sind vermerkt.

Es gibt keine dedizierte Mailing-Liste oder RSS-Feed für Mythos-spezifische Updates ab Mai 2026. Überwachen Sie die obigen Kanäle und achten Sie auf das Labs-Dashboard — Updates zu Ihrer verfügbaren Modell-ID oder Budget-Limits werden dort erscheinen, bevor sie anderswo erscheinen.

---

## Verwandte Guides

- [guides/billing-and-pricing.md](billing-and-pricing.md) — Token-Raten für Thinking-Tokens, Plan-Limits und die Billing-Änderung vom 15. Juni, die beeinflusst, wie erweiterte Reasoning-Kosten unter Pro- und Max-Abonnements abgerechnet werden.
- [guides/context-management.md](context-management.md) — Strategien zur Verwaltung erweiterter Kontextfenster, relevant für Mythos-Sitzungen, in denen die Kontextnutzung wesentlich höher ist als in Standard-Sitzungen.
