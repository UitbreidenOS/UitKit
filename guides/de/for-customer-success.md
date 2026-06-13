# Claude für Customer Success Manager

Alles, was ein Customer Success Manager für KI-gestütztes Health-Monitoring, QBRs, Churn-Prevention und Expansionsgespräche benötigt — ohne stundenlange Vorbereitung und Reporting.

---

## Für wen dieser Leitfaden ist

Du bist CSM und verantwortlich für ein Portfolio an Accounts — diese zu halten, zu erweitern und erfolgreich zu machen. Du wirst an Net Revenue Retention und Erneuerungsraten gemessen. Du verlierst zu viel Zeit mit QBR-Vorbereitung, Health-Score-Reviews und dem Schreiben von Follow-up-E-Mails, statt tatsächlich Kundenbeziehungen aufzubauen.

**Vor Claude Code:** 4–6 Stunden für die Vorbereitung eines QBR. 2 Stunden pro Woche für manuelle Account-Health-Reviews. 30 Minuten für eine Follow-up-E-Mail nach jedem Call. Kein konsistentes Expansions-Playbook.

**Danach:** QBR vollständig vorbereitet in 45 Minuten. Health-Review in 15 Minuten mit strukturierten Empfehlungen. Follow-up-E-Mails in 5 Minuten. Expansionschancen proaktiv identifiziert, nicht reaktiv.

---

## 30-Sekunden-Installation

```bash
# Den vollständigen CS-Stack installieren
npx claudient add skill gtm/customer-success
npx claudient add skill gtm/qbr-builder
npx claudient add skill gtm/health-score-analyzer
npx claudient add skill gtm/expansion-playbook
npx claudient add skill marketing/churn-prevention
npx claudient add skill small-business/customer-feedback-synthesizer
npx claudient add skill gtm/revenue-operations
npx claudient add agent advisors/cco-advisor
```

---

## Dein Claude Code CS-Stack

### Skills (Slash-Befehle)

| Skill | Was er tut | Wann verwenden |
|---|---|---|
| `/health-score-analyzer` | Accounts nach Nutzung, Beziehung und kommerziellen Signalen bewerten; Churn-Risiko-Rating | Montags Portfolio-Review |
| `/qbr-builder` | Vollständige QBR-Vorbereitung: Agenda, Gesprächspunkte, ROI-Quantifizierung, Expansionsdiskussion | 2 Wochen vor jedem QBR |
| `/expansion-playbook` | Expansionssignale identifizieren, Upsell-Narrativ erstellen, Preisverhandlungen führen | Wenn ein Account bereit ist zu wachsen |
| `/customer-success` | Health-Score-Modell-Design, Churn-Signale, Onboarding-Pläne | CS-Prozesse aufbauen |
| `/churn-prevention` | At-risk-Kundenanalyse und Save-Playbooks | RED-Accounts, die Intervention benötigen |
| `/customer-feedback-synthesizer` | Feedback aus Umfragen, Calls und Tickets in Themen zusammenfassen | Quartalsweise Voice-of-Customer |
| `/revenue-operations` | NRR-Berechnung, Erneuerungs-Pipeline, CS-Metriken und Forecasting | CS-Operations und Reporting |

### Agenten

| Agent | Modell | Wann einsetzen |
|---|---|---|
| `cco-advisor` | Opus | Strategische CS-Entscheidungen: Coverage-Modelle, Tier-Strategie, Org-Design |

---

## Täglicher Workflow

### Morgen (20–30 Minuten)

**1. Portfolio-Health-Review — jeden Montag ausführen**
```
/health-score-analyzer

Portfolio-Health-Review für die Woche vom [DATUM] ausführen.

Meine Accounts:
| Account | ARR | Erneuerung | Letzter Login | Aktive Seats | Letzter Kontakt | Probleme |
|---|---|---|---|---|---|---|
| [Unternehmen A] | $48K | 3 Monate | vor 5 Tagen | 12/15 | vor 7 Tagen | Keine |
| [Unternehmen B] | $120K | 6 Wochen | vor 22 Tagen | 4/20 | vor 14 Tagen | Support-Ticket offen |
| [Unternehmen C] | $24K | 8 Monate | vor 2 Tagen | 8/8 | vor 3 Tagen | Frage nach Export |

Ausgeben:
1. Health-Score und Risiko-Tier für jeden Account
2. Interventions-Prioritätsliste für diese Woche
3. Accounts mit Churn-Signalen, die eskaliert werden sollten
4. Erneuerungen in den nächsten 90 Tagen und deren Bereitschaftsstatus
```

**2. Täglicher At-Risk-Check — dauert 5 Minuten**
```
/health-score-analyzer

Schnellcheck: Sind in den letzten 24–48 Stunden neue Risikosignale in meinem Portfolio aufgetreten?

Aktuelle Signale:
- [Unternehmen X] hat sich [X Tage] nicht eingeloggt
- [Unternehmen Y] hat ein Support-Ticket zu [Thema] eröffnet
- [Unternehmen Z] — Champion [Name] hat gerade den Job bei LinkedIn gewechselt

Risiko einschätzen und Maßnahme für jeden nennen.
```

---

### QBR-Vorbereitung (2 Wochen vorher)

**3. Vollständiger QBR-Builder**
```
/qbr-builder

QBR für [Kundenname] erstellen.

Kunde: [Unternehmen]
ARR: $[X]
Erneuerung: [Datum]
Teilnehmer: [deren Titel, deren Titel] + [mein Titel, AE-Name]
Dauer: [60 Minuten]
Ziel: [halten und Expansion vorbereiten / Beziehung wiederherstellen]

Ihr Kontext:
- Erfolgskriterien aus dem Kickoff: [X, Y, Z]
- Primärer Anwendungsfall: [beschreiben]
- Business-Änderungen dieses Quartals: [Änderungen in Team, Budget, Strategie]
- Nutzungsdaten: [zusammenfassen — Logins, aktive Seats, genutzte Kernfunktionen]
- Offene Probleme: [ungelöste Support-Tickets oder Beschwerden]

Kommerziell:
- Gesundheit: [GREEN / YELLOW / RED]
- Expansionschance: [Seats / Tier / Add-on] — $[X] Potenzial
- Wettbewerbsbedrohung: [ja/nein — beschreiben falls ja]

Erstellen: vollständige Agenda, Gesprächspunkte pro Abschnitt, ROI-Folie-Inhalt,
Expansionsgesprächsrahmen und 3 Einwand-Antworten.
```

---

### Expansionsgespräche

**4. Expansionssignal-Identifikation und Narrativ**
```
/expansion-playbook

Expansionschance für [Unternehmen] identifizieren.

Aktueller Vertrag: $[X] ARR, [N] Seats, [Plan/Tier]
Nutzungssignale:
- Seat-Auslastung: [X von N Seats aktiv]
- Neuer Anwendungsfall beobachtet: [beschreiben]
- Wachstumssignale: [Headcount um X % gestiegen, neues Team erwähnt, etc.]

Expansionschance: [zusätzliche Seats / Tier-Upgrade / Add-on]
Potenzielles zusätzliches ARR: $[X]
Gesundheit: [GREEN — erforderlich]

Erstellen:
1. Welche Signale Bereitschaft anzeigen (und welche noch zu schwach sind, um zu handeln)
2. Das Expansionsnarrativ für meinen nächsten Call
3. Preisgesprächsrahmen und 3 Einwandskripte
4. Ob CS das handhabt oder AE einbezogen werden sollte
```

---

### Kundeneskalationen

**5. Churn-Prevention — RED-Accounts**
```
/churn-prevention

Dieser Kunde hat ein ernstes Churn-Risiko. Erstelle mir einen Save-Plan.

Kunde: [Unternehmen]
ARR: $[X]
Erneuerung: [X Wochen/Monate entfernt]
Risikosignale: [alle beschreiben — Nutzung, Beziehung, kommerziell]
Grundursachen-Hypothese: [was glaubst du, ist wirklich falsch?]
Was versucht wurde: [frühere Outreach-Versuche und Ergebnisse]

Produzieren:
- Recovery-QBR-Struktur (wen mitnehmen, wie eröffnen)
- Spezifische Angebote oder Maßnahmen
- Eskalationspfad, wenn Standard-Save nicht funktioniert
- Go/No-Go beim Save: Ist dieser Account zu retten, oder ist Churn wahrscheinlich trotzdem?
```

---

### Kundenfeedback-Synthese (quartalsweise)

**6. Voice of Customer**
```
/customer-feedback-synthesizer

Kundenfeedback des letzten Quartals synthethisieren.

Quellen:
- NPS-Umfragen: [Ergebnisse einfügen oder Themen zusammenfassen]
- Support-Ticket-Kategorien: [häufigste Ticket-Typen und Volumen beschreiben]
- QBR-Notizen: [wichtige Themen aus Kundengesprächen einfügen]
- Churn-Gründe: [warum haben abgewanderte Kunden verlassen?]

Benötigter Output:
- Top-3-Pain-Points der Kunden
- Top-3-Dinge, die Kunden lieben
- Am häufigsten genannte Produkt-Lücken
- Umsetzbare Empfehlungen für: Produktteam, CS-Team, Führung
- NPS-Trend und was Promotoren vs. Detraktoren antreibt
```

---

## 30-Tage-Einarbeitungsplan (neue CSMs)

### Woche 1 — Portfolio kennenlernen
- Alle CS-Skills installieren
- `/health-score-analyzer` für jeden Account ausführen — Basis-Portfolio-Health-Map erstellen
- Jedes offene Support-Ticket im Portfolio lesen — wissen, was brennt, bevor du Kunden triffst
- Einführungsgespräche mit jedem Account in den ersten 30 Tagen planen (auch gesunde)

### Woche 2 — Erste Kundengespräche
- `/qbr-builder` auch für informelle Check-in-Calls verwenden — Fragen sind dieselben
- Nach jedem Call: Follow-up-E-Mail und CRM-Notiz mit Claude in unter 10 Minuten erstellen
- `/expansion-playbook` verwenden, um Accounts mit Expansionspotenzial zu kartieren — auch wenn noch nicht gehandelt wird
- Top-3-Hochrisiko-Accounts bis Ende Woche 2 identifizieren

### Woche 3 — Health Score und Prozess
- `/health-score-analyzer` verwenden, um jeden Account formal zu bewerten — im CRM dokumentieren
- Wöchentlichen Health-Review-Rhythmus etablieren
- Health-Score-Modell mit dem CS-Manager besprechen — Tiers und Bewertungsgewichtungen abstimmen
- Ersten At-Risk-Account durch `/churn-prevention` führen — auch als Übung

### Woche 4 — QBR und Expansion
- Ersten QBR mit `/qbr-builder` durchführen — einen Senior-CSM zur Vorbereitung hinzuziehen oder sie prüfen lassen
- 2–3 Accounts für ein Expansionsgespräch identifizieren — Plan zuerst dem Manager präsentieren
- CRM-Hygiene prüfen: Sind alle Accounts mit Health-Scores, letzten Kontaktdaten und Erneuerungsdaten aktualisiert?
- Dem Manager berichten: Portfolio-Gesundheit, ARR-Risiko, Top-Chancen

---

## Tool-Integrationen

### HubSpot CRM (empfohlen)

```json
// Zu ~/.claude/settings.json hinzufügen
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}
```

Mit HubSpot verbunden kann Claude:
- Account-Health-Felder, letzte Kontaktdaten und Erneuerungsdaten direkt lesen
- Account-Health-Scores nach Portfolio-Review aktualisieren
- Follow-up-Aufgaben aus QBR-Action-Items erstellen
- Erneuerungs-Pipeline-Berichte abrufen

### Gainsight / ChurnZero / Totango

Falls dein Team eine dedizierte CS-Plattform verwendet, Account-Health-Daten als CSV exportieren → in `/health-score-analyzer` einfügen für Analyse und Empfehlungen. Claude arbeitet mit dem Output jeder CS-Plattform.

### Gong / Chorus (Call-Aufzeichnung)

Call-Transkript erhalten → Claude bitten, zu extrahieren:
- Hauptthemen aus dem Kundengespräch
- Action Items mit Verantwortlichen
- Health-Signale (positive und negative Erwähnungen)
- CRM-Notiz und Follow-up-E-Mail-Entwurf

```
Hier ist das Transkript meines Calls mit [Kunde] heute:
[Transkript einfügen]

Extrahieren:
1. CRM-Update-Notiz (2–3 Sätze: was besprochen wurde, Health-Signale, nächste Schritte)
2. Follow-up-E-Mail für heute
3. Action Items: Verantwortlicher + Fälligkeitsdatum für jeden
4. Churn-Signale oder Expansionssignale, die ich markieren sollte
```

### Notion / Confluence (QBR-Vorlagen)

QBR-Deck-Outline mit `/qbr-builder` erstellen → Folien in Google Slides oder Notion aufbauen → Claude während der Vorbereitung für das Narrativ nutzen.

---

## Zu verfolgende Metriken

| Metrik | Definition | Grün | Gelb | Rot |
|---|---|---|---|---|
| Net Revenue Retention | (MRR + Expansion - Churn) / Anfangs-MRR | > 110 % | 95–110 % | < 95 % |
| Gross Revenue Retention | Erneuerungsrate ohne Expansion | > 90 % | 80–90 % | < 80 % |
| Durchschnittlicher Health-Score | Portfolio-weiter Durchschnitt | > 70/100 | 55–70 | < 55 |
| ARR at Risk | % des Portfolios in RED-Gesundheit | < 10 % | 10–20 % | > 20 % |
| QBR-Abschlussrate | % berechtigter Accounts mit abgeschlossenem QBR im Quartal | 100 % | 75–99 % | < 75 % |
| Tage seit letztem Kontakt | Portfolio-Durchschnitt | < 30 Tage | 30–60 Tage | > 60 Tage |
| Expansions-ARR von CS | Upsell und Expansion ohne AE-Beteiligung | Quartalsweise tracken und steigern |

---

## Häufige CS-Fehler (und wie Claude Code hilft, sie zu vermeiden)

**Fehler 1: Kein proaktives Health-Monitoring**
`/health-score-analyzer` jeden Montag erzwingt ein strukturiertes Portfolio-Review. Probleme werden gefunden, bevor Kunden sie melden — nicht nachdem sie die Entscheidung getroffen haben zu gehen.

**Fehler 2: QBRs, die Produkt-Demos sind**
`/qbr-builder` öffnet jeden QBR mit deren Business-Prioritäten, nicht mit einem Produkt-Walkthrough. Kunden erneuern nicht wegen einer guten Demo — sie erneuern, weil du ihnen geholfen hast, etwas zu erreichen.

**Fehler 3: Expansionsgespräche, die mit dem Preis beginnen**
`/expansion-playbook` erstellt das Wertenarrativ, bevor eine kommerzielle Diskussion stattfindet. Preise pitchen, bevor der Bedarf etabliert ist, ist der schnellste Weg zu einem Nein.

**Fehler 4: Reaktives Churn-Management**
Die Health-Score- und Signal-Erkennung in `/health-score-analyzer` identifiziert At-Risk-Accounts 60–90 Tage vor der Erneuerung — wenn noch Zeit für eine Intervention ist. Darauf zu warten, dass der Kunde sagt, er geht, ist zu spät.

**Fehler 5: ROI nicht quantifizieren**
Jeder QBR braucht eine ROI-Folie. `/qbr-builder` zwingt dich, zu quantifizieren, was der Kunde erreicht hat — nicht in Produkt-Features, sondern in Business-Ergebnissen. "Du hast 12 Stunden pro Woche und Teammitglied gespart" ist ein Erneuerungsargument. "Wir haben 4 neue Features geliefert" ist es nicht.

---

## Ressourcen

- [Erste Schritte mit Claude Code](./getting-started.md)
- [QBR-Builder-Skill](../skills/gtm/qbr-builder.md)
- [Health-Score-Analyzer-Skill](../skills/gtm/health-score-analyzer.md)
- [Expansion-Playbook-Skill](../skills/gtm/expansion-playbook.md)
- [CS-QBR-Prep-Workflow](../workflows/cs-qbr-prep.md)
- [Churn-Prevention-Skill](../skills/marketing/churn-prevention.md)

---
