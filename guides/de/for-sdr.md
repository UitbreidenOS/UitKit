# Claude für SDRs

Alles, was ein Sales Development Representative benötigt, um KI-gestützte Akquise, Outreach, Antwortbearbeitung und Pipeline-Management in Claude Code zu betreiben.

---

## Für wen ist das gedacht

Sie sind SDR, BDR oder Sales-Mitarbeiter, dessen Aufgabe es ist, qualifizierte Pipeline zu generieren — die richtigen Accounts finden, kontaktieren, Meetings buchen und an AEs übergeben. Sie verbringen zu viel Zeit mit Recherche, E-Mail-Schreiben und Posteingangs-Triage. Claude Code reduziert das um den Faktor 30–40.

**Vor Claude Code:** 20 Minuten pro recherchiertem Account. 15 Minuten pro personalisierter E-Mail. 2–4 Stunden täglich im Posteingang. Manuelle CRM-Aktualisierungen nach jedem Gespräch.

**Danach:** Vollständiges Account-Briefing in 30 Sekunden. Personalisierte E-Mail in 30 Sekunden. Posteingang triagiert und Antworten entworfen in 8 Minuten. CRM automatisch aus Gesprächsprotokollen aktualisiert.

---

## Installation in 30 Sekunden

```bash
# Alle SDR-Skills, Agenten und Workflows installieren
npx claudient add skills gtm
npx claudient add agents roles/sdr-agent

# Oder gezielt auswählen, was Sie benötigen:
npx claudient add skill gtm/sdr-research-brief
npx claudient add skill gtm/sdr-reply-classifier
npx claudient add skill gtm/sdr-call-prep
npx claudient add skill gtm/sdr-call-analysis
npx claudient add skill gtm/sdr-objection-handler
npx claudient add skill gtm/sdr-territory-mapper
npx claudient add skill gtm/sdr-lead-scorer
npx claudient add skill gtm/sdr-agent
npx claudient add skill gtm/email-automation
npx claudient add skill gtm/lead-enrichment
npx claudient add skill gtm/crm-hygiene
npx claudient add skill gtm/hubspot
```

---

## Ihr Claude Code SDR-Stack

### Skills (Slash-Befehle)

| Skill | Was er tut | Wann anwenden |
|---|---|---|
| `/sdr-research-brief` | 30-Sekunden-Account-Dossier mit Triggern, ICP-Score, Stakeholder-Map | Vor jedem Outreach |
| `/sdr-agent` | End-to-End-SDR-Workflow — Recherche → Entwurf → Genehmigung → Versand → Protokollierung | Vollständige Pipeline-Sitzungen |
| `/sdr-reply-classifier` | Posteingang triagieren: Absicht klassifizieren, Antwort entwerfen, CRM aktualisieren | Zweimal täglich Posteingang prüfen |
| `/sdr-call-prep` | Gesprächsleitfäden, Einwandskripte, Discovery-Fragen für jeden Anruf | 30 Minuten vor dem Anruf |
| `/sdr-call-analysis` | Post-Call-Transkript → CRM-Notiz + Coaching-Feedback + Follow-up | Nach jedem Anruf |
| `/sdr-objection-handler` | Dynamische Einwandbehandlung für Preis, Wettbewerber, Timing, Vertrauen | Bei Bedarf, jeder Kanal |
| `/sdr-territory-mapper` | Whitespace-Analyse, Prioritäts-Accounts, Territory-Plan | Wöchentliche/quartalsweise Planung |
| `/sdr-lead-scorer` | ICP-Fit-Scoring 0–100 mit Tier und empfohlener Maßnahme | Priorisierung von Lead-Listen |
| `/email-automation` | Mehrstufiges Sequenzdesign, Zustellbarkeit, Antwort-Routing | Neue Sequenzen erstellen |
| `/lead-enrichment` | Apollo/Clearbit/Firecrawl-Pipeline zum Anreichern und Bewerten von Leads | Massen-Anreicherung |
| `/crm-hygiene` | HubSpot/Salesforce-Bereinigung, Deduplizierung, veraltete Kontakte, Eigentümerschaft | Monatliche CRM-Gesundheit |
| `/hubspot` | Nativer HubSpot-CRM-Zugriff — Kontakte, Deals, Notizen lesen/schreiben | Direkte CRM-Arbeit |

### Agenten

| Agent | Modell | Wann aktivieren |
|---|---|---|
| `sdr-agent` | Opus (Recherche) / Sonnet (Entwürfe) | Vollständige Recherche-zu-Outreach-Sitzungen |
| `market-researcher` | Sonnet | Tiefe Account- oder Marktrecherche |
| `competitive-analyst` | Sonnet | Wettbewerber-Intelligence für Einwandvorbereitung |

---

## Täglicher Arbeitsablauf

### Morgens (30–60 Minuten)

**1. Territory-Briefing — worauf heute fokussieren**
```
/sdr-territory-mapper

Zeigen Sie mir die heutigen Prioritäts-Accounts:
- Welche A-Tier-Accounts wurden noch nicht kontaktiert?
- Gibt es neue Triggersignale bei Accounts in meiner Pipeline?
- Welche Sequenzen befinden sich an Tag 3 oder Tag 7 (brauchen heute Follow-up)?
```

**2. Lead-Scoring — neue Leads aus der Nacht**
```
/sdr-lead-scorer

[Neue Inbound-Leads, Event-Anmeldungen oder Apollo-Exporte einfügen]

Score gegen ICP und geben Sie mir die A-Tier-Liste für den heutigen Anruf.
```

**3. Outreach-Batch — Recherche + Entwurf für heutige Ziele**
```
/sdr-agent

Recherchieren und entwerfen Sie personalisierten Outreach für:
1. [Unternehmen 1] — Kontakt: [Name, Titel]
2. [Unternehmen 2] — Kontakt: [Name, Titel]
3. [Unternehmen 3] — Kontakt: [Name, Titel]

Mein Produkt: [eine Zeile]
Mein ICP: [Definition]
Alle Entwürfe zur Überprüfung anzeigen, bevor sie geplant werden.
```

---

### Mittags (15–20 Minuten)

**4. Posteingangs-Triage — Antwortklassifizierung**
```
/sdr-reply-classifier

Hier sind meine Antworten von heute Morgen:

Antwort 1 (von: name@company.com):
[Antwort einfügen]

Antwort 2 (von: name@company.com):
[Antwort einfügen]

Jede klassifizieren, Antworten für interessierte/Einwand-Antworten entwerfen,
CRM aktualisieren, mich über heiße Leads informieren.
```

---

### Vor dem Anruf (2–5 Minuten)

**5. Anrufvorbereitung — für jeden Anruf in der nächsten Stunde**
```
/sdr-call-prep

Name: [Name des Interessenten]
Titel: [Titel]
Unternehmen: [Unternehmen]
Anruftyp: [Kaltakquise / Follow-up / Discovery]
Ziel: [20-minütiges Discovery-Meeting buchen]
Mein Produkt: [eine Zeile]
Aktueller Trigger: [was Sie über sie wissen]

Geben Sie mir: Eröffnungsskript, Gesprächsleitfaden, Top 3 Einwände + Antworten, Mailbox-Nachricht.
```

---

### Nach dem Anruf (2–5 Minuten)

**6. Anrufanalyse — protokollieren und lernen**
```
/sdr-call-analysis

[Anruftranskript oder Notizen einfügen]

Interessent: [Name, Titel, Unternehmen]
Anruftyp: Kaltakquise
Ziel: Discovery-Meeting buchen
Ergebnis: [was passiert ist]

Extrahieren Sie: CRM-Notiz, nächster Schritt, geäußerte Einwände, Coaching-Feedback, Follow-up-E-Mail-Entwurf.
```

---

### Wöchentlich (Freitag — 30 Minuten)

**7. Territory-Review und Pipeline-Bericht**
```
/sdr-territory-mapper

Wöchentlicher Review:
- Diese Woche gebuchte Meetings: [N]
- Gestartete Sequenzen: [N]
- Erhaltene Antworten: [N]
- Verbleibendes Whitespace: [N]

Zeigen Sie mir: welche Accounts nächste Woche priorisiert werden sollen, verpasste Trigger,
und ob ich auf Kurs für meine monatliche Meeting-Quote bin.
```

---

## 30-Tage-Einarbeitungsplan (neue SDRs)

### Woche 1 — Einrichtung und Recherche-Meisterschaft
- Alle SDR-Skills installieren via `npx claudient add skills gtm`
- HubSpot MCP konfigurieren (siehe `/hubspot`-Skill für Setup)
- `/sdr-territory-mapper` auf Ihrer initialen Account-Liste ausführen
- 50+ Accounts mit `/sdr-lead-scorer` bewerten — mit Ihrem ICP vertraut werden
- Lesen: vollständige `/sdr-objection-handler`-Bibliothek vor Ihrem ersten Anruf

### Woche 2 — Outreach-Launch
- `/sdr-research-brief` für jeden Account vor dem ersten Kontakt verwenden
- Erste 20 E-Mails mit `/sdr-agent` entwerfen — jeden sorgfältig überprüfen
- Tracking beginnen: Zeit pro E-Mail (Ziel: unter 5 Minuten mit Claude)
- `/sdr-call-prep` für jeden Kaltanruf verwenden — kein Improvisieren

### Woche 3 — Antwortbearbeitung und Anrufanalyse
- `/sdr-reply-classifier` auf jede Antwort anwenden — nicht manuell sortieren
- Jeden Anruf aufzeichnen, `/sdr-call-analysis` auf dem Transkript ausführen
- Ihre Einwandbehandlung mit dem Playbook vergleichen — den einen Einwand identifizieren, bei dem Sie immer verlieren
- `/sdr-objection-handler` verwenden, um Ihre schwächsten Einwände zu üben

### Woche 4 — Optimierung
- Erste Territory-Planungssitzung mit `/sdr-territory-mapper` durchführen
- Alle Anrufanalysen überprüfen — welche Muster entstehen?
- Beste E-Mail-Hooks identifizieren (höchste Antwortrate) und Varianten erstellen
- Dem Manager mit Daten aus Ihrem CRM berichten

---

## Tool-Integrationen

### HubSpot (empfohlenes CRM)

```json
// In ~/.claude/settings.json hinzufügen
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

Mit dieser Verbindung kann Claude:
- Kontakte, Unternehmen, Deals und Notizen lesen und schreiben
- Lifecycle-Phasen und Eigentümer-Zuweisungen aktualisieren
- Follow-up-Aufgaben aus der Anrufanalyse erstellen
- CRM-Hygiene in Ihrem Territory durchführen

### Gmail / Outlook
Claude Code verwenden, um E-Mails zu entwerfen → in Ihren E-Mail-Client einfügen → senden.
Für automatisierten Versand über n8n oder Make mit dem Gmail-Node integrieren.

### Apollo.io / Seamless.ai
Leads als CSV exportieren → in `/sdr-lead-scorer` einfügen → priorisierte Liste erhalten.
Für Echtzeit-Anreicherung den `/lead-enrichment`-Skill mit der Apollo-API verwenden.

### Gong / Aircall / Fireflies
Anruftranskript erhalten → in `/sdr-call-analysis` einfügen → CRM-Notiz, Coaching, Follow-up extrahieren.
Für automatisierte Post-Call-Analyse einen Webhook einrichten, der `/sdr-call-analysis` auslöst, wenn eine Aufnahme bereit ist.

### n8n (Automatisierungsorchestrierung)
```
Den vollständigen Loop automatisieren:
- Neuer Inbound-Lead → /sdr-lead-scorer → an SDR oder Nurture weiterleiten
- Neue Antwort erhalten → /sdr-reply-classifier → Entwurf + Slack-Benachrichtigung
- Anruf abgeschlossen → Transkript → /sdr-call-analysis → HubSpot-Update
```

---

## Zu verfolgende Metriken

Claude Code verwenden, um diese wöchentlich aus HubSpot abzurufen:

| Metrik | Ziel (frühe Phase) | Ziel (eingearbeiteter SDR) |
|---|---|---|
| Recherchierte Accounts/Tag | 10 | 20 |
| Versendete Outreach-E-Mails/Woche | 50 | 150 |
| Antwortrate | >5 % | >8 % |
| Positive Antwortrate | >1,5 % | >3 % |
| Gebuchte Meetings/Woche | 3–5 | 8–12 |
| Anruf-zu-Meeting-Rate | 5 % | 10 % |
| Zeit pro Account (Recherche + Entwurf) | <10 Min. | <5 Min. |
| CRM-Aktualisierungsrate | 90 % | 100 % |

---

## Häufige Fehler (und wie Claude Code hilft, sie zu vermeiden)

**Fehler 1: Generischen Outreach versenden**
Claude Code zwingt Sie dazu, einen Trigger zu recherchieren, bevor ein Entwurf erstellt wird. Kein Trigger = keine E-Mail.

**Fehler 2: Anrufe nicht im CRM protokollieren**
`/sdr-call-analysis` generiert die CRM-Notiz für Sie — einfügen und fertig.

**Fehler 3: Schlechte Einwandbehandlung**
`/sdr-objection-handler` enthält 20+ Skripte. Vor jedem Anruf ausführen. Die verpassten üben.

**Fehler 4: Opt-out-Interessenten kontaktieren**
`/crm-hygiene` hält Ihr CRM sauber. Immer prüfen, bevor Sie jemanden zu einer Sequenz hinzufügen.

**Fehler 5: Auf die falschen Accounts fokussieren**
`/sdr-territory-mapper` und `/sdr-lead-scorer` priorisieren für Sie. Zuerst den A-Tier bearbeiten.

---

## Ressourcen

- [Erste Schritte mit Claude Code](../getting-started.md)
- [HubSpot-MCP-Einrichtung](../mcp/hubspot.md)
- [SDR-Tagesworkflow](../workflows/sdr-daily.md)
- [E-Mail-Sequenzen-Leitfaden](../skills/gtm/email-automation.md)
- [Vollständige Einwandbehandlungs-Bibliothek](../skills/gtm/sdr-objection-handler.md)

---
