---
name: ux-researcher
description: "UX-Forschung: Benutzerpersona-Generierung, Journey Mapping, Usability-Test-Planung, Forschungssynthese — Benutzerdaten in umsetzbare Design- und Produktentscheidungen übersetzen"
---

# UX-Forscher-Fähigkeit

## Wann zu aktivieren
- Erstellung datengestützter Benutzerpersonas aus Forschung oder Analyse
- Erstellung einer Customer Journey Map zur Identifizierung von Erfahrungslücken
- Planung eines Usability-Tests (Script, Aufgaben, Metriken, Stichprobengröße)
- Synthese von Erkenntnissen aus Benutzerinterviews oder Umfragen in Themen
- Generieren einer Empathie-Karte oder eines Benutzerbedarfs-Frameworks

## Wann NICHT verwenden
- Produktroadmap-Entscheidungen — verwenden Sie die Fähigkeit product-discovery
- A/B-Test-Design — verwenden Sie die Fähigkeit experiment-designer
- Quantitative Analytik (Trichteranalyse, Bindung) — verwenden Sie die Fähigkeit product-analytics
- Marketing-Persona zum Targeting — anderes Ziel als UX-Persona

## Anleitung

### Benutzerpersona-Generierung

```
Generieren Sie eine Benutzerpersona aus [Datenquelle].

Datenquelle: [Benutzerinterviews / Umfrageergebnisse / Analysen / Support-Tickets / alle]
Produkt: [beschreiben]
Zu modellendes Segment: [beschreiben Sie den Benutzertyp — z. B. „Poweruser, die Kernfunktion täglich nutzen"]

Persona-Struktur:

PERSONA-NAME: [Archetyp-Name — beschreibend, kein echter Name]
Tagline: [ein Satz, der ihre Kernfrustation oder Ziel erfasst]

DEMOGRAFIE (breit bleiben, Stereotypisierung vermeiden):
Rolle: [Berufsbezeichnung / Funktion]
Unternehmensgröße: [KMU / Mittelmarkt / Unternehmen]
Technische Kenntnisse: [niedrig / mittel / hoch] in [relevanter Bereich]

ZIELE (was sie zu erreichen versuchen):
Primäres Ziel: [die Hauptaufgabe, die sie versuchen zu erledigen]
Sekundäres Ziel: [unterstützendes Ziel]
Erfolg sieht aus wie: [beobachtbares Ergebnis, das ihnen wichtig ist]

FRUSTRATIONEN (aktuelle Probleme mit bestehenden Lösungen):
1. [Spezifische Frustration mit Beweis — Zitat aus Interview oder Statistik aus Daten]
2. [Spezifische Frustration]
3. [Spezifische Frustration]

VERHALTENSMUSTER:
Wie sie Tools entdecken: [Mundpropaganda / Suche / Manager-Mandat / etc.]
Wie sie bewerten: [Versuch zuerst / Peer-Review / Demo / Beschaffungsprozess]
Wie sie das Produkt nutzen: [täglich / wöchentlich / episodisch / in einem Team / allein]

ZITAT (repräsentative Stimme):
„[Wörtliches oder paraphrasiertes Zitat, das ihre Weltanschauung erfasst]"

WAS SIE VON UNS BRAUCHEN:
- [Spezifisches Bedürfnis 1]
- [Spezifisches Bedürfnis 2]
- [Spezifisches Bedürfnis 3]

NICHT einschließen: Bestandsfoto-Beschreibung, fiktive Hintergrundgeschichte, irrelevante Demografie (liebster Kaffee)
EINSCHLIESSEN: nur das, was Produktentscheidungen treibt

Generieren Sie die Persona für [Segment] aus den von Ihnen bereitgestellten Daten.
```

### Journey Map

```
Erstellen Sie eine Customer Journey Map für [Erlebnis].

Erlebnis: [beschreiben Sie das End-to-End-Erlebnis — z. B. „erste Einrichtung bis zum ersten Wertmoment"]
Benutzerpersona: [welche Persona diese Karte darstellt]
Zu berücksichtigende Touchpoints: [Kanäle — E-Mail, Produkt, Support, Website]

Journey Map Format:

PHASEN: [listen Sie die übergeordneten Phasen auf — z. B. Bewusstsein → Überlegung → Onboarding → Aktivierung → Gewohnheitsmäßige Nutzung]

Für jede Phase:

PHASENNAME: [Etikett]
Eintrittsauslöser: [was bringt den Benutzer in diese Phase?]
Dauer: [typische Zeit in dieser Phase]

Benutzeraktionen:
- [Was sie tun]
- [Was sie tun]

Touchpoints:
- [Wo interagieren sie mit Ihrem Produkt/Ihrer Marke]

Gedanken (worüber sie denken):
- „[Innerer Monolog in diesem Moment]"

Gefühle: [Frustriert / Neugierig / Selbstbewusst / Ängstlich / Erfreut] — mit Stimmungsgewichtung 1-5

Schmerzpunkte:
- 🔴 [Kritischer Schmerz — blockiert Fortschritt]
- 🟡 [Merkliche Reibung — verlangsamt]

Gelegenheiten:
- [Design- oder Produktverbesserung, die den Schmerz behebt]

GESAMTE ERFAHRUNGSKURVE:
Stimmung aufzeichnen (1 = sehr negativ, 5 = sehr positiv) für jede Phase:
[Phase 1]: X/5 → [Phase 2]: X/5 → [Phase 3]: X/5 → ...

Der niedrigste Punkt in der Reise = höchste Designchance.

Generieren Sie die Journey Map für mein Erlebnis und meine Persona.
```

### Usability-Test-Plan

```
Planen Sie einen Usability-Test für [Produkt/Funktion].

Zu testen: [spezifischer Flow, Funktion oder Design]
Benutzertyp: [wen recruten]
Test-Format: [moderiert ferngesteuert / moderiert vor Ort / unmoderiert]
Anzahl der Teilnehmer: [typischerweise 5-8 für qualitativ; 20+ für quantitativ]
Schlüsselfragen: [was möchten Sie lernen?]

Test-Plan:

ZIEL:
[Welche spezifische Frage beantwortet dieser Test?]
Erfolgskriterien: [wie werden Sie wissen, dass der Test nützlich war?]

TEILNEHMERKRITERIEN:
Screener-Fragen: [3-5 Fragen zum Qualifizieren von Teilnehmern]
Muss haben: [Anforderung 1] + [Anforderung 2]
Muss nicht haben: [Ausschlusskriterien]
Anreiz: [$X Geschenkkarte / kostenloses Produktguthaben / anderes]

AUFGABENDESIGN (5-7 Aufgaben pro Session):
Aufgaben sollten sein:
- Szenariobasiert („Sie möchten X tun...") nicht instruktiv („Klicken Sie auf Y")
- Observable — können Sie sagen, ob sie erfolgreich waren?
- Repräsentativ für echte Benutzerziele

Aufgabe 1: [Szenario]
Erfolgskriterien: [wie sieht Erfolg aus?]
Zeitlimit: [X Minuten]

Aufgabe 2: [Szenario]
Erfolgskriterien: [...]

METRIKEN:
Quantitativ:
- Task Completion Rate: % die jede Aufgabe ohne Hilfe abschließen
- Zeit pro Aufgabe: Mediansekunden pro Aufgabe
- Fehlerrate: Fehler pro Aufgabe
- SUS-Score (System Usability Scale): 0-100 zusammengesetzt

Qualitativ:
- Think-Aloud Beobachtungen: Was sagen Benutzer, während sie navigieren?
- Verwirrungspunkte: wo zögern sie, gehen zurück oder stellen Fragen?
- Emotionale Signale: wo zeigen sie Frustration oder Freude?

SITZUNGSFÜHRER:
Einführung (5 Min): Erklären Sie lautes Denken, es gibt keine richtigen oder falschen Antworten
Aufgaben (30-40 Min): präsentieren Sie jede Aufgabe, beobachten und notieren Sie
Debriefing (10 Min): offene Fragen zum Gesamterlebnis

ANALYSISFRAMEWORK:
Nach [N] Sitzungen:
- Affinitätskarte: Gruppieren Sie Beobachtungen nach Thema
- Schweregrad-Bewertung: Kritisch (blockiert Abschluss) / Größer (frustriert) / Geringer (kosmetisch)
- Häufigkeit: wie viele Teilnehmer sind auf dieses Problem gestoßen?
- Prioritätsscore: Schweregrad × Häufigkeit

Generieren Sie den Testplan für meinen spezifischen Funktionen- und Benutzertyp.
```

### Forschungssynthese

```
Synthetisieren Sie Benutzerstudienerkenntnisse aus [Quelle].

Forschungstyp: [Benutzerinterviews / Usability-Test / Umfrage / Support-Tickets / alle]
Anzahl der Sitzungen/Antworten: [X]
Rohe Ergebnisse: [fügen Sie Schlüsselbeobachtungen, Zitate oder Themen ein]

Synthese-Framework:

Schritt 1 — Beobachtungs-Clustering (Affinitätszuordnung):
Gruppieren Sie einzelne Beobachtungen in Themen.
Gruppieren Sie nicht nach Forschungsfrage — Gruppierung nach dem, was Benutzer tatsächlich gesagt und getan haben.
Gutes Thema: „Benutzer konnten die Filterfunktion nicht finden" (spezifisch, beobachtbar)
Schlechtes Thema: „Navigationsprobleme" (zu vague)

Schritt 2 — Themenprioritisierung:
Für jedes Thema:
| Thema | Häufigkeit (X von N Teilnehmern) | Schweregrad | Beweis |
|---|---|---|---|
| [Thema 1] | [X/N] | Kritisch / Größer / Geringer | [Zitat oder Beobachtung] |

Schritt 3 — Insight-Generierung:
Insight = Thema + Auswirkung (nicht nur „Benutzer taten X", sondern „Benutzer taten X, was bedeutet, dass wir Y tun müssen")

Format: „Wenn [Kontext], Benutzer [Verhalten]. Dies schlägt [Produkt-/Design-Auswirkung] vor."

Beispiel: „Wenn Benutzer das Dashboard zum ersten Mal erreichen, suchen sie nach einer Suchleiste, bevor sie das Filterfeld in der Seitenleiste bemerken. Dies schlägt vor, dass der primäre Erkennungsmechanismus an einen prominenteren Ort verschoben werden sollte oder dass die Suche als primärer Navigationsmodus hinzugefügt werden sollte."

Schritt 4 — Empfehlungen (nach Auswirkung geordnet):
🔴 P1 — Kritisch (vor Start beheben): [spezifische Empfehlung + Beweis]
🟡 P2 — Wichtig (bald beheben): [spezifische Empfehlung + Beweis]
🟢 P3 — Schön zu haben: [spezifische Empfehlung]

Schritt 5 — Was wir noch nicht wissen:
[Fragen, die diese Forschung nicht beantworten konnte — nächste Forschung so gestalten, dass diese Fragen beantwortet werden]

Synthetisieren Sie meine Forschungsergebnisse in priorisierte Erkenntnisse und Empfehlungen.
```

## Beispiel

**Benutzer:** Wir haben 6 Benutzerinterviews über unser Projektmanagementsystem durchgeführt. Hauptergebnisse: Benutzer lieben die Zeitachsenansicht, können aber nicht herausfinden, wie sie Abhängigkeiten zwischen Aufgaben hinzufügen. Drei Benutzer gaben auf und sagten „Ich werde einfach Notion verwenden". Wie mache ich das in Aktion um?

**Synthese von Claude:**

**Schlüssel-Insight:**
„Wenn Benutzer verwandte Aufgaben verbinden möchten, können sie die Abhängigkeitserstellungs-UI ohne Hilfe nicht finden. Dies ist keine Funktionslücke — die Funktion existiert — es ist ein Erkennbarkeits- und Interaktionsdesign-Problem."

Beweis: 3/6 Benutzer gaben auf; alle 6 erwähnten die Zeitachse als den stärksten Teil des Tools. Niemand schlug vor, dass sie eine andere Funktion brauchten — sie brauchten, dass die bestehende Funktion auffindbar war.

**Implikationen:**

🔴 P1 — Abhängigkeitserstellungs-UX ist defekt (vor Wachstum beheben):
Der Einstiegspunkt zum Hinzufügen von Abhängigkeiten ist unsichtbar. Benutzer suchen nach einer Drag-Connect-Interaktion (wie Miro/Linear) oder einem Rechtsklick-Kontextmenü. Wenn Ihr aktueller Fluss ein Einstellungsfenster oder eine separate Klick-Add-Link-Taste erfordert, ist das der Mismatch.

Empfehlung: In der Zeitachsenansicht ein visuelles Affordance hinzufügen, wenn Sie über eine Aufgabe fahren (ein Connector-Handle oder eine „Abhängigkeit hinzufügen"-Taste beim Hover). Erwägen Sie ein Rechtsklick-Kontextmenü mit „Abhängigkeit zu hinzufügen..."

🟡 P2 — Leerer Status / Onboarding für Abhängigkeiten:
Wenn Benutzer die Zeitachse ohne gesetzte Abhängigkeiten erreichen, gibt es keinen Hinweis, dass die Funktion existiert. Fügen Sie einen Tooltip oder Leerstatussignal hinzu: „Verbinden Sie Aufgaben, indem Sie von einer zur anderen ziehen" mit einer 3-Sekunden-Demo-Animation.

🟢 P3 — Hilfedokumentation:
„Aufgaben-Abhängigkeiten" sind in docs vergraben. Verschieben Sie sie in einen „Erste Schritte mit Zeitachsen"-Leitfaden, der kontextabhängig angezeigt wird, wenn ein Benutzer die Zeitachse zum ersten Mal öffnet.

**Diese Forschung hat nicht beantwortet:**
- Möchten Benutzer, dass Abhängigkeiten automatisch kaskadenförmig ausgeführt werden (wenn A verzögert wird, verschiebt sich B)?
- Gibt es Poweruser, die Abhängigkeiten heute gefunden und benutzt haben? Was machte sie für sie auffindbar?

Führen Sie eine 15-Minuten-Nachfolgetermin mit 3 Benutzern durch: zeigen Sie ihnen, wo die Abhängigkeitsfunktion ist, fragen Sie sie, sie zu benutzen, beobachten Sie — ist die Interaktion selbst klar, wenn gefunden?

---
