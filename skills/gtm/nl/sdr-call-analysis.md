---
name: sdr-call-analysis
description: "Post-gespreksanalyse van transcripten voor SDR's: resultaat, vervolgstappen, bezwaren, coachingfeedback, en automatisch opgestelde CRM-notities + opvolgingsmail op basis van een gespreksopname of transcript"
---

# SDR Gespreksanalyse Skill

## Wanneer activeren
- Je hebt net een koud gesprek of ontdekkingsgesprek afgerond en moet het snel vastleggen
- Je hebt een gespreksttranscript of -opname en wilt coachingfeedback
- Jouw team neemt gesprekken op (Gong, Aircall, Fireflies, Otter) en je wilt AI-analyse
- Je wilt automatisch CRM-notities, bezwaren en vervolgstappen uit een gesprek halen
- SDR-manager die gesprekskkwaliteit binnen het team beoordeelt

## Wanneer NIET gebruiken
- Voorbereiding voor een gesprek — gebruik `/sdr-call-prep` daarvoor
- Customer success-gesprekken of QBR's — andere structuur en doelen
- Interne teamvergaderingen — niet relevant
- Gesprekken zonder transcript — je hebt tekstinvoer nodig (gebruik eerst een transcriptietool)

## Instructies

### Volledige gespreksanalyse prompt

```
Analyseer dit verkoopgesprekstranscript en extraheer gestructureerde uitvoer.

[PLAK TRANSCRIPT]

Context:
- Rep: [naam]
- Prospect: [naam, titel, bedrijf]
- Gesprekstype: [koud gesprek / ontdekking / opvolging / demo / afsluiting]
- Gespreksdoel: [wat de rep probeerde te bereiken]

Extraheer:

## 1. Gespreksresultaat
- Resultaat: [meeting_booked | positive_followup | objection_unresolved | not_interested | voicemail | gatekeeper | no_answer]
- Resultaatbetrouwbaarheid: [0-100]
- Afgesproken volgende stap: [precies wat er is afgesproken — datum, tijd, formaat]

## 2. CRM-notitie (klaar om te plakken)
Datum: [datum]
Duur: [minuten]
Resultaat: [resultaat]
Samenvatting: [2-3 zinnen over wat is besproken en afgesproken]
Volgende stap: [exacte volgende actie + eigenaar + datum]
Raised bezwaren: [lijst]
Prospectsentiment: [positief / neutraal / negatief]

## 3. Bezwaren en hoe ze zijn behandeld
Voor elk bezwaar:
- Bezwaar: [woordelijk of samengevat]
- Hoe de rep ermee omging: [wat ze zeiden]
- Effectiviteit: [goed / kan beter / gemiste kans]
- Aanbevolen aanpak: [alternatieve aanpak indien verbetering nodig]

## 4. Kwaliteitsscore ontdekking (0-100)
- Begreep de rep de pijn van de prospect? [ja/gedeeltelijk/nee]
- Identificeerde de rep de beslisser? [ja/nee]
- Begreep de rep de tijdlijn? [ja/nee]
- Begreep de rep de budgetsituatie? [ja/nee]
- Verhouding gestelde vragen vs. gemaakte uitspraken: [X:Y — moet >2:1 zijn]
- Score: [0-100]

## 5. Opvolgingsmail (klaar om te verzenden)
Onderwerp: [gepersonaliseerd — niet "Opvolging van ons gesprek"]
Inhoud: [4-6 zinnen opvolging met verwijzing naar specifieke besproken zaken]

## 6. Coachingfeedback (3 punten)
- Wat goed ging: [1 punt]
- Wat te verbeteren: [1-2 punten met specifieke alternatieve bewoordingen]
- Aanbevolen oefening: [specifieke trainingsoefening]
```

### Snelle CRM-notitie extractie (< 1 minuut)

```
Extraheer een CRM-notitie uit dit gespreksttranscript.

[PLAK TRANSCRIPT]

Uitvoerformaat:
Datum: [vandaag]
Resultaat: [1 woord — geboekt/nee/voicemail/bezwaar/positief]
Kerncitaat van prospect: "[woordelijk — meest onthullende uitspraak]"
Volgende stap: [precies wat er daarna gebeurt — wie doet wat wanneer]
Samenvatting: [2 zinnen]
Tags: [objection_price | objection_competitor | champion | not_icp | hot | nurture]
```

### Bezwaarextractie en coaching

```
Extraheer elk bezwaar uit dit gespreksttranscript en beoordeel hoe goed de rep elk bezwaar heeft afgehandeld.

[PLAK TRANSCRIPT]

Voor elk bezwaar:
1. Bezwaar (woordelijk of samengevat)
2. Reactie van de rep (woordelijk)
3. Score: [A/B/C/D]
   - A: Erkend, geherformuleerd, doorgegaan naar volgende stap
   - B: Erkend maar niet verder gevorderd
   - C: Defensief of overmatig uitgelegd
   - D: Genegeerd of mislukt
4. Betere reactie: [alternatieve bewoordingen bij B/C/D]

Samenvatting:
- Totaal bezwaren: [X]
- Gemiddelde score: [X]
- Grootste hiaat: [welk type bezwaar het meeste werk vereist]
- Aanbevolen oefening: [specifieke trainingsoefening]
```

### Gong / Aircall integratie patroon

```typescript
// Webhook ontvanger — wordt geactiveerd wanneer een gespreksopname klaar is
app.post('/webhooks/call-completed', async (req, res) => {
  const { callId, recordingUrl, repEmail, prospectEmail, durationSeconds } = req.body

  // 1. Haal transcript op van je transcriptieprovider
  const transcript = await getTranscript(callId) // Gong, Fireflies, Otter API

  // 2. Haal prospectcontext op uit CRM
  const prospect = await hubspot.findContactByEmail(prospectEmail)

  // 3. Voer Claude-analyse uit
  const analysis = await analyseCall({
    transcript,
    rep: await getRepByEmail(repEmail),
    prospect,
    callType: inferCallType(durationSeconds, prospect.lifecyclestage),
  })

  // 4. Werk CRM bij
  await hubspot.crm.contacts.basicApi.update(prospect.id, {
    properties: {
      last_call_outcome: analysis.outcome,
      last_call_date: new Date().toISOString(),
      last_call_summary: analysis.crmNote,
      last_call_next_step: analysis.nextStep,
    },
  })

  // 5. Maak notitie aan in CRM
  await hubspot.crm.notes.basicApi.create({
    properties: {
      hs_note_body: analysis.crmNote,
      hs_timestamp: Date.now(),
    },
    associations: [{ to: { id: prospect.id }, types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }] }],
  })

  // 6. Stuur coachingfeedback naar Slack als score < 70
  if (analysis.discoveryScore < 70) {
    await postSlackCoachingAlert({
      channel: `#coaching-${repEmail.split('@')[0]}`,
      rep: repEmail,
      callId,
      score: analysis.discoveryScore,
      feedback: analysis.coachingFeedback,
    })
  }

  // 7. Als meeting is geboekt — informeer AE voor warme overdracht
  if (analysis.outcome === 'meeting_booked') {
    await notifyAE(analysis.nextStep)
  }

  res.json({ ok: true, analysisId: analysis.id })
})

async function analyseCall(params: CallAnalysisParams) {
  const { object } = await generateObject({
    model: anthropic('claude-sonnet-4-6'),
    schema: CallAnalysisSchema,
    system: `You are a sales coach analysing a B2B cold outreach call.
Be specific and actionable. Reference exact quotes from the transcript.
Score based on: did the rep understand pain, identify stakeholders, agree on next steps?`,
    prompt: `Analyse this call:

REP: ${params.rep.name}
PROSPECT: ${params.prospect.name}, ${params.prospect.title} at ${params.prospect.company}
TRANSCRIPT:
${params.transcript}`,
  })
  return object
}
```

### Batch gespreksreview (managerperspectief)

```
Je bent een salesmanager die gesprekken van je SDR-team deze week beoordeelt.

Hier zijn [N] gespreksttranscripten. Voor elk:
1. Beoordeel het gesprek (0-100)
2. Identificeer de grootste coachingkans (1 zin)
3. Markeer als het gesprek een ICP-mismatch onthult
4. Markeer alle hete prospects die onmiddellijke AE-aandacht nodig hebben

Geef me daarna:
- Teamgemiddelde score
- Meest voorkomend bezwaar deze week
- Rep die de meeste coaching nodig heeft (en waarom)
- Beste performer en wat ze anders doen

[PLAK TRANSCRIPTEN]
```

### Opvolgingsmail sjablonen per resultaat

```
RESULTAAT: Meeting geboekt
Onderwerp: "[BESPROKEN ONDERWERP] — bevestigd voor [DAG TIJD]"
Inhoud:
"[NAAM], fijn om met je te spreken. Kijk uit naar [DAG] om [TIJD].

Ik kom voorbereid met [wat je hebt besproken voor te bereiden].

Korte agenda:
- [10 min] Jouw huidige setup met [X]
- [10 min] Hoe wij [hun probleem] aanpakken
- [10 min] Q&A + geschiktheidsbeoordeling

Agenda-uitnodiging volgt via [Calendly/Google Calendar].

[Handtekening]"

---

RESULTAAT: Positief maar nog geen meeting geboekt
Onderwerp: "[Iets wat je hebt besproken]"
Inhoud:
"[NAAM], bedankt voor de tijd vandaag.

Zoals ik vermeldde, [korte samenvatting van hun pijnpunt in hun woorden].

Ik stuur [wat je beloofde — case study, data, democlip].

[Bijgevoegde bron / link]

De moeite waard voor een echte 20 minuten om te zien hoe dit van toepassing is op [hun bedrijf]?
Ik heb [DAG] om [TIJD] of [DAG] om [TIJD] — werkt een van beide?

[Handtekening]"

---

RESULTAAT: Voicemail achtergelaten / geen antwoord
Onderwerp: "Opvolging — [specifieke aanleiding of reden]"
Inhoud:
"[NAAM], heb je eerder geprobeerd te bereiken — hoop dat de timing gewoon niet klopte.

Ik neem contact op omdat [aanleiding van één zin — waarom nu].

[Wat we doen in één zin + relevant resultaat].

Graag 15 minuten — [Calendly-link] als dat makkelijker is dan telefoon.

[Handtekening]"
```

## Voorbeeld

**Gebruiker:** Analyseer dit 4 minuten durende gesprek. Marcus zei "niet het juiste moment" maar leek geïnteresseerd. Wat moet ik nu doen?

**Transcript fragment:**
> Rep: "...op basis van jullie hiring lijkt het erop dat je het salesteam uitbreidt."
> Marcus: "Ja, dat klopt, maar eerlijk gezegd is het nu niet het juiste moment — we zitten midden in een reorganisatie."
> Rep: "Volledig begrijpelijk. Wanneer denk je dat het beter zou zijn?"
> Marcus: "Waarschijnlijk Q4 — augustus/september misschien."
> Rep: "Perfect — dan neem ik dan contact op."

**Analyse-uitvoer:**

```
Resultaat: not_now (positief — toekomstige interesse uitgesproken)
Volgende stap: Opvolging half augustus (plan voor 12 aug)

CRM-notitie:
Gesprek met Marcus Chen, 4 min, 2 jun. Momenteel in reorganisatie — "niet het juiste moment."
Openheid uitgesproken om Q4 te herbekijken (aug/sep). Hoge ICP-fit bevestigd (salesteam uitbreiden).
Plan: opvolgingsgesprek 12 aug.

Bezwaar: "Niet het juiste moment — we zitten in een reorganisatie"
Aanpak rep: B — erkend, tijdlijn gekregen, maar gemiste kans om
warm te blijven in de tussentijd.
Betere reactie: "Begrijpelijk — reorganisaties zijn hectisch. Zou het nuttig zijn als ik je
één ding stuur in de tussentijd, zodat je al bekend bent als Q4 aankomt?
Duurt 2 minuten om te lezen."
→ Zo blijf je top of mind zonder te pushen.

Ontdekkingsscore: 52/100
- Tijdlijn gekregen? Ja (Q4)
- Pijn begrepen? Gedeeltelijk (uitbreiden, maar niet onderzocht wat vastloopt)
- Beslisser geïdentificeerd? Nee — niet bevestigd of Marcus de koper is
- Ontbrekend: "Wie zou er nog meer betrokken zijn bij zo'n beslissing?"

Opvolgingsmail opgesteld ✓
Coachingnotitie verzonden naar Slack ✓
CRM bijgewerkt: lifecycle = nurture, opvolgtaak = 12 aug ✓
```

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
