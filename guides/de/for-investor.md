# Claude für Investoren und VC-Analysten

Alles, was ein VC-Analyst, Associate oder Partner braucht, um KI-gestütztes Deal-Screening, Due Diligence, Finanzmodellierung, Portfolio-Monitoring und IC-Vorbereitung in Claude Code durchzuführen.

---

## Für wen das gedacht ist

Du bist Venture-Capital-Analyst, Associate, Partner oder unabhängiger Angel-Investor. Deine Aufgabe ist es, jeden relevanten Deal zu sehen, schnell zu screenen, die besten zu prüfen und gute Investitionsentscheidungen zu treffen. Du wirst von Inbound überwältigt, verbringst 40% deiner Zeit damit, Memos und Berichte zu schreiben, und hast nie genug Stunden, um jedes Unternehmen, das es verdient, tiefgehend zu recherchieren. Claude Code verändert dieses Verhältnis.

**Vor Claude Code:** 6 Stunden, um ein First-Pass-Deal-Memo zu schreiben. Ein halber Tag, um sich auf ein Board-Meeting vorzubereiten. 3 Stunden, um einen vierteljährlichen LP-Bericht über 15 Unternehmen zusammenzustellen.

**Danach:** First-Pass-Deal-Memo in 45 Minuten. Board-Meeting-Vorbereitung in 20 Minuten. LP-Bericht-Portfolio-Abschnitt in 30 Minuten.

---

## 30-Sekunden-Installation

```bash
# Installiere alle Investor-Skills
npx claudient add skill finance/deal-screening
npx claudient add skill finance/deal-memo
npx claudient add skill finance/ic-memo
npx claudient add skill finance/dcf-model
npx claudient add skill finance/diligence-review
npx claudient add skill finance/comps-analysis
npx claudient add skill finance/portfolio-monitor
npx claudient add skill finance/earnings-analysis

# Installiere relevante Agents
npx claudient add agent advisors/cfo-advisor
npx claudient add agent roles/quant-analyst
npx claudient add agent roles/scientific-researcher
```

---

## Dein Claude Code Investor-Stack

### Skills (Slash-Befehle)

| Skill | Was er tut | Wann verwenden |
|---|---|---|
| `/deal-screening` | First-Pass-Screen: Markt, Moat, Management, Finanzen, Fit — Pass/Proceed-Urteil | Erste Betrachtung eines neuen Deals |
| `/deal-memo` | Vollständiges Deal-Memo: These, Team, Markt, Finanzen, Risiken, Diligence-Liste, Empfehlung | Nach dem Founder-Meeting |
| `/ic-memo` | Investment-Committee-Memo (9-Abschnitte PE/Growth-Format) | Vor der IC-Präsentation |
| `/dcf-model` | DCF-Finanzmodell: Annahmen, Projektionen, Terminalwert, Sensitivität — in Python oder Excel-Format | Jede Bewertungsarbeit |
| `/diligence-review` | Strukturiere und führe Due Diligence durch: Kundengespräche, technische Prüfung, Referenzgespräche, Finanzprüfungs-Checkliste | Due Diligence nach dem Term Sheet |
| `/comps-analysis` | Vergleichbare Unternehmens- und Transaktionsanalyse: EV/Umsatz, EV/EBITDA, wachstumsbereinigte Multiples | Bewertungs-Benchmarking |
| `/portfolio-monitor` | Board-Update-Synthese, KPI-Tracking, Follow-on-Trigger, Red Flags, LP-Bericht-Abschnitte | Monatlicher/vierteljährlicher Portfolio-Review |
| `/earnings-analysis` | Analyse von Earnings Calls börsennotierter Unternehmen — Read-across für Private-Market-Comps | Wettbewerbsforschung |

### Agents

| Agent | Modell | Wann einsetzen |
|---|---|---|
| `cfo-advisor` | Opus | Finanzmodell-Review, Unit-Economics-Challenge |
| `quant-analyst` | Opus | Quantitative Marktgrößenbestimmung, datengetriebene These |
| `scientific-researcher` | Opus | Tiefe Sektorforschung, akademische Literatur für Deep Tech |

---

## Täglicher Workflow

### Morgen (30–45 Minuten)

**1. Deal-Flow-Review — übernächtigen Inbound screenen**
```
/deal-screening

Screene diese eingehenden Deals schnell. Gib mir für jeden ein Pass/Proceed-Urteil.

[Deal 1 — Unternehmensname, Sektor, Stage, ARR/Umsatz, Wachstum, Bewertungsanfrage, kurze Beschreibung]
[Deal 2]
[Deal 3]

Meine Fonds-These: [beschreibe dein Mandat — Stage, Sektor, Checkgröße]
Überspringe offensichtliche Fehlanpassungen. Markiere den, der einen tieferen Blick verdient.
```

**2. Portfolio-Check — erhaltene Board-Updates**
```
/portfolio-monitor

Ich habe ein monatliches Update von [Unternehmen] erhalten. Fasse es zusammen und markiere alles, was diese Woche meine Aufmerksamkeit erfordert.

[Board-Update oder wichtige Kennzahlen einfügen]
```

---

### Nach dem Founder-Meeting (45–90 Minuten)

**3. Deal-Memo — ersten Eindruck zu Papier bringen**
```
/deal-memo

Unternehmen: [Name]
Was ich im Meeting gelernt habe: [deine Notizen — einfügen oder zusammenfassen]
Mein Bauchgefühl: [vorläufige Einschätzung]

Fülle die Deal-Memo-Struktur aus. Markiere alles, was ich nicht gelernt habe, als [MUSS VERIFIZIERT WERDEN].
```

---

### Diligence-Phase (laufend)

**4. Vorbereitung auf Kunden-Referenzgespräch**
```
/diligence-review

Ich rufe morgen den Referenzkunden [Name, Titel, Unternehmen] von [Unternehmen] an.

Investment-These: [was wir über das Unternehmen glauben]
Zu validierende Hauptrisiken: [was falsch sein könnte]

Erstelle 12 Referenzgespräch-Fragen, die Folgendes prüfen:
- Wie sie das Produkt nutzen und wie eingebettet es ist
- Was sie dazu bringen würde, zu kündigen
- Wie das Produkt im Vergleich zu Alternativen abschneidet, die sie geprüft haben
- Eventuelle Bedenken gegenüber dem Unternehmen oder dem Team
```

**5. Comps-Analyse**
```
/comps-analysis

Führe eine vergleichbare Unternehmensanalyse für [Unternehmen] im Bereich [Sektor] durch.

Unsere Unternehmenskennzahlen: ARR $[X]M, [X]% Wachstum, [X]% Bruttomarge, [X]x NRR
Runde: $[X]M bei $[X]M Pre-Money

Finde öffentliche Comps und aktuelle private Transaktions-Comps. Welches Multiple zahlen wir im Vergleich zum Markt?
```

---

### IC-Vorbereitung

**6. IC-Memo — vollständige Investment-Committee-Präsentation**
```
/ic-memo

Wandle mein Deal-Memo in ein vollständiges IC-Memo für [Unternehmen] um.

Deal-Memo (einfügen oder zusammenfassen): [...]
Diligence-Erkenntnisse: [was wir verifiziert haben, was wir nicht konnten]
Aktualisierte Empfehlung: [investieren / ablehnen / bedingt]

Erstelle alle 9 Abschnitte mit [VERIFIZIEREN]-Markierungen bei unbestätigten Daten.
```

---

### Portfolio-Support (Board-Meeting-Tage)

**7. Board-Meeting-Vorbereitung**
```
/portfolio-monitor

Das Board-Meeting mit [Unternehmen] ist morgen. Bereite mich vor.

Letztes Board-Meeting: [Zusammenfassung]
Aktuelles Board-Package: [einfügen]
Meine Bedenken: [Liste]
Was ich vorantreiben möchte: [Themen]

Gib mir: Pre-Read-Synthese, harte Fragen, meine Agenda, potenzielle Anfragen des Teams.
```

---

### Wöchentlich (Freitag — 30 Minuten)

**8. Wöchentliche Deal-Flow-Zusammenfassung**
```
/deal-screening

Fasse den Deal-Flow dieser Woche zusammen:
- Gescreente Deals: [N]
- Abgelehnt: [N] — [kurzer Grund für jeden größeren Ablehnungsfall]
- In der Pipeline: [N] — [Status jedes Deals]
- Zu IC weitergehend: [N]

Was sollte ich nächste Woche priorisieren?
```

---

## 30-Tage-Einarbeitungsplan (neuer VC-Analyst)

### Woche 1 — Deal-Screening-Beherrschung
- Installiere alle Investor-Skills: `npx claudient add skill finance/[name]`
- Führe `/deal-screening` bei 20 aktuellen Deals aus dem Archiv deines Fonds durch — vergleiche deine Ausgabe mit den Entscheidungen der Partner
- Verstehe das ICP deines Fonds: Stage, Sektor, Checkgröße, Follow-on-Strategie
- Lies den `/comps-analysis`-Skill — verstehe, wie Multiples in deinen Sektoren funktionieren

### Woche 2 — Deal-Memo-Praxis
- Begleite 3 Partner-Meetings → schreibe Deal-Memos eigenständig → vergleiche mit der Version des Senior-Analysten
- Führe `/dcf-model` für ein Portfolio-Unternehmen durch — verstehe Annahmen und Sensitivitäten
- Beginne mit dem Aufbau deiner Sektor-Comps-Datenbank — `/comps-analysis` hilft bei der Strukturierung

### Woche 3 — Due Diligence und Portfolio
- Führe `/diligence-review` bei einem aktiven Deal durch — übernimm den Kunden-Referenzgespräch-Prozess
- Nutze `/portfolio-monitor`, um Q1-Updates für 5 Portfolio-Unternehmen zu synthetisieren
- Bereite ein Board-Meeting mit dem Board-Prep-Modus von `/portfolio-monitor` vor

### Woche 4 — IC-Präsentation
- Schreibe mit `/ic-memo` ein vollständiges IC-Memo für einen Deal, an dem du gearbeitet hast
- Präsentiere den Partnern — nutze Claudes Ausgabe als Struktur, nicht als Skript
- Tracke: Wie viele deiner Fragen vor dem Meeting tauchten im IC auf? (Benchmark: >60% zeigt gute Fragequalität)

---

## Tool-Integrationen

### Notion (Deal-Tracking)
```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notion/mcp-server"],
      "env": {
        "NOTION_TOKEN": "your-token-here"
      }
    }
  }
}
```

Mit verbundenem Notion: Claude kann deine Deal-Pipeline-Datenbank lesen, Unternehmensnotizen abrufen und Deal-Memo-Entwürfe direkt in deine Deal-Seiten schreiben.

### Airtable / Deal-Pipeline
Exportiere die Deal-Pipeline als CSV → füge sie in `/deal-screening` ein → erhalte priorisierte Pass/Proceed-Urteile. Für Live-Integration nutze Airtable MCP.

### Finanzmodelle
Claude generiert Python- oder strukturierte Excel-fähige Tabellen für DCF- und Comps-Arbeit. Für komplexe Modelle: generiere die Struktur und Annahmen in Claude → baue in Excel/Google Sheets → füge Ergebnisse für das Narrativ zurück ein.

### Gong / Gesprächsaufzeichnung
Füge das Founder-Call-Transkript in `/deal-memo` ein → Claude extrahiert wichtige Behauptungen, markiert unverifizierte Aussagen und strukturiert in das Deal-Memo-Format.

---

## Kennzahlen zum Verfolgen

| Aktivität | Manuell | Mit Claude |
|---|---|---|
| First-Pass-Screen pro Deal | 45 Min. | 8 Min. |
| Deal-Memo-Entwurf | 6 Stunden | 45 Min. |
| IC-Memo | 8 Stunden | 2 Stunden |
| Board-Meeting-Vorbereitung | 2 Stunden | 20 Min. |
| LP-Quartalsbericht (Portfolio-Abschnitt) | 4 Stunden | 45 Min. |
| Referenzgespräch-Vorbereitung | 30 Min. | 10 Min. |
| Comps-Analyse | 3 Stunden | 30 Min. |

Ziel: 3x mehr Deals überprüft bei gleicher Analysten-Besetzung. Die Qualitätsgrenze steigt, weil Claude dein Denken strukturiert, nicht nur Zeit spart.

---

## Häufige Fehler (und wie Claude Code sie verhindert)

**Fehler 1: Auf das Narrativ des Founders fixieren**
`/deal-memo` fordert dich auf, jede vom Founder gelieferte Behauptung als `[UNVERIFIZIERT]` zu markieren. Erzwingt intellektuelle Ehrlichkeit, bevor du dich in eine Geschichte verliebst.

**Fehler 2: Red Flags in Board-Updates übersehen**
`/portfolio-monitor` führt eine strukturierte Red-Flag-Checkliste bei jedem Board-Update durch. Du wirst "Burn stieg um 40%, während der Umsatz stagnierte" auf Folie 12 nicht übersehen.

**Fehler 3: Memos schreiben, die befürworten statt analysieren**
Claudes Risikoabschnitt ist darauf ausgelegt, ausgewogene Analyse zu erzwingen. IC-Mitglieder, die advocacy-lastige Memos erhalten, werten diese ab.

**Fehler 4: Referenzgespräche überspringen**
`/diligence-review` generiert Referenzgespräch-Fragen, die über die einfachen Fragen hinausgehen, auf die Founders ihre Kunden vorbereiten.

**Fehler 5: Die falsche Bewertung zahlen**
`/comps-analysis` verankert jeden Deal an Markt-Comps, bevor du dich für das Unternehmen begeisterst.

---

## Ressourcen

- [Erste Schritte mit Claude Code](getting-started.md)
- [Deal-Screening-Skill](../skills/finance/deal-screening.md)
- [Deal-Memo-Skill](../skills/finance/deal-memo.md)
- [IC-Memo-Skill](../skills/finance/ic-memo.md)
- [Portfolio-Monitor-Skill](../skills/finance/portfolio-monitor.md)
- [Deal-Screening-Workflow](../workflows/deal-screening.md)

---
