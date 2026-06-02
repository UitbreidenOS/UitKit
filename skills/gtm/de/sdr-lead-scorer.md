---
name: sdr-lead-scorer
description: "ICP-Passung + Absichtssignal-Lead-Scoring für SDRs: Interessenten 0-100 gegenüber Ihrem idealen Kundenprofil bewerten, Listen nach Priorität ordnen und die Begründung hinter jedem Score erklären"
---

# SDR-Lead-Scorer-Skill

## Wann aktivieren
- Du hast eine rohe Lead-Liste (Apollo-Export, LinkedIn Sales Nav, Veranstaltungsteilnehmerliste, Inbound-Formular) und musst sie priorisieren
- Aufbau eines automatisierten Lead-Routing-Systems, das eingehende Leads vor der Zuweisung bewertet
- Quartalsweise ICP-Überarbeitung — Datenbank nach aktualisierten Kriterien neu bewerten
- Du möchtest deinem Manager erklären, warum du bestimmte Accounts priorisierst
- Aufbau eines Lead-Scoring-Modells für ein neues Produkt oder Marktsegment

## Wann NICHT verwenden
- Tiefe Recherche zu einzelnen Accounts — nutze dafür `/sdr-research-brief` (mehr Detail)
- Bewertung von bestehender Pipeline für Prognosezwecke — nutze `/commercial-forecaster`
- Kundenzustandsbewertung — nutze den `/customer-success`-Skill
- Wenn du <10 Leads hast — einfach manuell bewerten, kein System nötig

## Anweisungen

### Lead-Scoring-Eingabeaufforderung (Batch)

```
Bewerte diese Leads gegenüber meinem ICP.

Mein Produkt: [was du in einer Zeile verkaufst]
Mein ICP:
  - Unternehmensgröße: [X-Y Mitarbeiter]
  - Branchen: [Liste]
  - Tech-Stack-Signale: [Tools, die Passung anzeigen]
  - Zielrollen: [spezifische Titel]
  - Geografien: [Länder/Regionen]
  - Negativsignale (KEINE Passung wenn): [Liste — z.B. B2C, <10 Mitarbeiter, Mitarbeiter eines Wettbewerbers]

Lead-Liste:
[LISTE EINFÜGEN — Name, Titel, Unternehmen, Unternehmensgröße, Branche, Tech-Stack falls bekannt]

Für jeden Lead ausgeben:
| Lead | Unternehmen | ICP-Score (0-100) | Tier | Hauptgrund für Score | Hauptdisqualifizierer (falls vorhanden) |
|---|---|---|---|---|---|

Tier-Definitionen:
- A (80-100): Sofort ansprechen — perfekte Passung
- B (60-79): Gute Passung — diese Woche in Sequenz aufnehmen
- C (40-59): Grenzwertig — Low-Touch-Sequenz oder Nurture
- D (<40): Keine Passung — ausschließen oder archivieren

Nach der Tabelle:
- Gesamte A-Tier-Leads: [N]
- Größter Disqualifizierer in dieser Liste: [häufigster Grund für niedrige Scores]
- Datenlücke: [welche Information die Scoring-Genauigkeit verbessern würde]
```

### ICP-Scoring-Framework-Builder

```
Baue ein Lead-Scoring-Framework für [PRODUKTNAME].

Zielmarkt: [Beschreibung]
Vertriebsbewegung: [PLG / Innendienst / Außendienst / Partner-geführt]

Scoring-Modell definieren:

FIRMOGRAFISCHE PASSUNG (50 Punkte gesamt):
- Unternehmensgröße: [Bereiche und Punktwerte definieren]
  z.B. 50-200 Mitarbeiter: 20 Pkt | 200-500: 15 Pkt | 500-2000: 10 Pkt | sonst: 0 Pkt
- Branche: [Zielbranchen und Gewichtungen auflisten]
  z.B. SaaS: 15 Pkt | FinTech: 12 Pkt | eCommerce: 10 Pkt | sonst: 0 Pkt
- Geografie: [Regionen und Gewichtungen]
  z.B. US/UK/CA/AU: 10 Pkt | EU: 7 Pkt | Rest: 3 Pkt
- Tech-Stack-Überschneidung: [Tools, die Passung anzeigen]
  z.B. Nutzt Salesforce: +5 | Nutzt HubSpot: +5 | Nutzt Segment: +5 (max 15 Pkt)

ABSICHTSSIGNALE (30 Punkte gesamt):
- Aktive Stellenanzeigen für Rollen, bei denen dein Produkt hilft: [Gewichtung]
- Aktuelle Finanzierungsrunde (<90 Tage): [Gewichtung]
- Neue Führungskraft in relevanter Abteilung eingestellt: [Gewichtung]
- Produkteinführungsankündigung: [Gewichtung]
- Technologiewechsel-Signale (von X zu Y gewechselt): [Gewichtung]
- G2/Capterra-Bewertungsaktivität: [Gewichtung]

KONTAKTPASSUNG (20 Punkte gesamt):
- Titelübereinstimmung mit Entscheider: [Gewichtungen nach Titel]
  z.B. VP Sales / CRO: 15 Pkt | Director Sales: 12 Pkt | Sales Manager: 8 Pkt
- Seniorität: [Gewichtungen]
- LinkedIn-Verbindungsgrad: 2. Grad: +5 | 3. Grad: +2 | Keine: 0

NEGATIVSIGNALE (Abzüge):
- Mitarbeiter eines Wettbewerbers: -50
- B2C-Unternehmen: -30
- <10 Mitarbeiter: -20
- Zuvor abgemeldet: -100 (niemals kontaktieren)
- Kürzlich verlorener Abschluss (< 60 Tage): -20
```

### Automatisiertes Lead-Scoring (Code-Muster)

```typescript
import { generateObject } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'

const LeadScore = z.object({
  score: z.number().min(0).max(100),
  tier: z.enum(['A', 'B', 'C', 'D']),
  topReasons: z.array(z.string()).max(3),     // why this score
  disqualifiers: z.array(z.string()).max(3),  // red flags
  recommendedAction: z.enum([
    'outreach_immediately',
    'add_to_sequence_this_week',
    'add_to_nurture',
    'disqualify',
    'needs_more_data',
  ]),
  missingData: z.array(z.string()),           // what data would improve accuracy
  confidenceLevel: z.enum(['high', 'medium', 'low']),
})

async function scoreLead(lead: RawLead, icp: ICPDefinition): Promise<ScoredLead> {
  // First: rule-based hard filters (instant disqualification)
  if (icp.negativeSignals.competitorDomains.includes(getDomain(lead.email))) {
    return { ...lead, score: 0, tier: 'D', topReasons: ['Competitor employee'], recommendedAction: 'disqualify' }
  }

  if (lead.optedOut) {
    return { ...lead, score: 0, tier: 'D', topReasons: ['Opted out'], recommendedAction: 'disqualify' }
  }

  // Then: Claude-based scoring for nuanced fit
  const { object } = await generateObject({
    model: anthropic('claude-haiku-4-5-20251001'), // Haiku — fast and cheap for bulk scoring
    schema: LeadScore,
    system: `You are a B2B sales qualification expert. Score leads 0-100 against the ICP.
Be precise. Reference specific firmographic and intent data.
A score should reflect BOTH fit (will they buy?) AND timing (will they buy NOW?).`,
    prompt: `Score this lead against our ICP.

ICP: ${JSON.stringify(icp, null, 2)}

Lead:
- Name: ${lead.name}
- Title: ${lead.title}
- Company: ${lead.company}
- Employees: ${lead.employees}
- Industry: ${lead.industry}
- Tech stack: ${lead.techStack?.join(', ') ?? 'unknown'}
- Geography: ${lead.country}
- LinkedIn: ${lead.linkedInUrl ?? 'unknown'}
- Recent signals: ${lead.signals?.map(s => s.description).join('; ') ?? 'none identified'}
- Last contacted: ${lead.lastContactedDaysAgo ? `${lead.lastContactedDaysAgo} days ago` : 'never'}`,
  })

  return { ...lead, ...object }
}

// Batch scoring — process 100 leads concurrently (with rate limiting)
async function scoreLeadList(leads: RawLead[], icp: ICPDefinition): Promise<ScoredLead[]> {
  const BATCH_SIZE = 10
  const results: ScoredLead[] = []

  for (let i = 0; i < leads.length; i += BATCH_SIZE) {
    const batch = leads.slice(i, i + BATCH_SIZE)
    const scored = await Promise.all(batch.map(lead => scoreLead(lead, icp)))
    results.push(...scored)
    console.log(`Scored ${Math.min(i + BATCH_SIZE, leads.length)}/${leads.length}`)
    await new Promise(r => setTimeout(r, 500)) // rate limit
  }

  return results.sort((a, b) => b.score - a.score)
}
```

### Eingehende Lead-Weiterleitung (Echtzeit-Scoring)

```typescript
// Webhook: wird ausgelöst, wenn ein neuer Lead ein Formular ausfüllt
app.post('/webhooks/new-lead', async (req, res) => {
  const formData = req.body // email, company, name, form fields

  // 1. Lead anreichern
  const enriched = await enrichLead(formData.email) // Apollo/Clearbit

  // 2. Gegenüber ICP bewerten
  const scored = await scoreLead(enriched, ICP_CONFIG)

  // 3. Basierend auf Tier weiterleiten
  switch (scored.tier) {
    case 'A':
      // Sofort: Senior SDR zuweisen, Slack-Alert auslösen
      await assignToSDR(scored, 'senior', priority: 'immediate')
      await postSlackAlert('#sdr-hot-inbound', scored)
      break

    case 'B':
      // Heute: SDR-Warteschlange hinzufügen, automatisch in Sequenz einschreiben
      await assignToSDR(scored, 'standard', priority: 'today')
      await enrolInSequence(scored.email, 'inbound-b-tier')
      break

    case 'C':
      // Nurture: Marketing-Automatisierung übernimmt
      await enrolInSequence(scored.email, 'nurture-long')
      break

    case 'D':
      // Disqualifizieren: Grund protokollieren, keine Ansprache
      await markDisqualified(scored.email, scored.topReasons)
      break
  }

  // 4. CRM aktualisieren
  await upsertHubSpotContact(scored.email, {
    icp_score: scored.score,
    icp_tier: scored.tier,
    qualification_reason: scored.topReasons.join('; '),
    lead_source: 'inbound_form',
  })

  res.json({ ok: true, tier: scored.tier, score: scored.score })
})
```

### ICP-Score-Interpretation

```
SCORE 90-100 — Alles stehen und liegen lassen. Diesen Account heute recherchieren.
Diese Accounts haben nahezu perfekte Passung UND aktive Auslöser.
Regel: Ansprache innerhalb von 24 Stunden. Diese Fenster schließen sich.

SCORE 75-89 — Stark. Diese Woche in Sequenz aufnehmen.
Gute Passung, etwas Timing-Unsicherheit. 10 Minuten recherchieren.
Regel: Innerhalb von 3 Werktagen in Sequenz.

SCORE 60-74 — Solide. Lohnt sich, nicht dringend.
Vernünftige Passung, braucht einen Auslöser zum Aufsteigen.
Regel: Zur automatisierten Sequenz hinzufügen, priorisieren wenn Auslöser erscheinen.

SCORE 40-59 — Grenzwertig. Nur Low-Touch.
Einige ICP-Signale, aber wichtige Kriterien fehlen.
Regel: Nur automatisierte Sequenz. Keine manuelle Recherche.

SCORE <40 — Keine Passung. Nicht kontaktieren.
Zu viele ICP-Kriterien fehlen. Ansprache würde Zeit aller verschwenden.
Regel: Archivieren, nicht in Sequenz aufnehmen, nicht anrufen.
```

### Datenqualitätsprüfung (vor dem Scoring)

```
Vor dem Bewerten dieser Lead-Liste die Datenqualität einschätzen.

[LEAD-LISTE EINFÜGEN]

Ausgabe:
- Gesamte Leads: [N]
- Leads mit E-Mail: [N] ([%])
- Leads mit Unternehmensgröße: [N] ([%])
- Leads mit Branche: [N] ([%])
- Leads mit Tech-Stack: [N] ([%])
- Leads mit Titel: [N] ([%])

Datenlücken, die die Scoring-Genauigkeit am meisten beeinflussen:
1. [Häufigst fehlendes Feld + wie es den Score beeinflusst]
2. [Zweithäufigstes]

Empfehlung:
- [X] Leads über [Apollo / Clearbit / manuell] anreichern vor dem Scoring
- Sofort mit verfügbaren Daten bewerten: [Y Leads]
- Kann nicht zuverlässig bewertet werden: [Z Leads — Grund]
```

## Beispiel

**Benutzer:** Ich habe 47 eingehende Leads von einem Webinar. Bewerte sie und sage mir, welche ich heute anrufen soll.

**Eingabe (Beispiel):**
```
Jane Smith, VP Operations, Acme Corp, 450 Mitarbeiter, B2B SaaS, nutzt Salesforce + Slack
Bob Lee, IT Manager, Local Bakery, 12 Mitarbeiter, Lebensmittel & Getränke, unbekannter Stack
Carol Wu, Head of Sales Ops, TechCo, 800 Mitarbeiter, FinTech, nutzt HubSpot + Intercom
```

**Ausgabe:**
| Lead | Unternehmen | Score | Tier | Grund | Aktion |
|---|---|---|---|---|---|
| Carol Wu | TechCo | 88 | A | FinTech + 800 Mitarbeiter + HubSpot-Nutzer + Head of Sales Ops = perfekter ICP | Heute anrufen |
| Jane Smith | Acme Corp | 74 | B | Gute Größe und SaaS-Vertical, Salesforce-Nutzer, aber Operations-Rolle = nicht primärer Käufer | Diese Woche in Sequenz |
| Bob Lee | Local Bakery | 12 | D | <50 Mitarbeiter, falsche Branche, falsche Rolle | Disqualifizieren |

**Heutige Anrufliste (A-Tier):** 8 Leads → vor 11 Uhr anrufen. Carol Wu ist #1.
**Sequenzen dieser Woche (B-Tier):** 23 Leads → bis Freitag einschreiben.
**Disqualifiziert (D-Tier):** 11 Leads → archiviert.

---

> **Arbeite mit uns:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir bauen KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
