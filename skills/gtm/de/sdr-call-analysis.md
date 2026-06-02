---
name: sdr-call-analysis
description: "Nachgesprächs-Transkriptanalyse für SDRs: Ergebnis, nächste Schritte, geäußerte Einwände, Coaching-Feedback extrahieren und CRM-Notizen + Follow-up-E-Mail aus einer Gesprächsaufzeichnung oder einem Transkript automatisch erstellen"
---

# SDR-Gesprächsanalyse-Skill

## Wann aktivieren
- Du hast gerade einen Kaltakquise- oder Discovery-Anruf beendet und musst ihn schnell protokollieren
- Du hast ein Gesprächstranskript oder eine Aufzeichnung und möchtest Coaching-Feedback erhalten
- Dein Team zeichnet Gespräche auf (Gong, Aircall, Fireflies, Otter) und du möchtest eine KI-Analyse
- Du möchtest CRM-Notizen, Einwände und nächste Schritte automatisch aus einem Gespräch extrahieren
- SDR-Manager, der die Gesprächsqualität im Team bewertet

## Wann NICHT verwenden
- Vorbereitung vor dem Gespräch — nutze dafür `/sdr-call-prep`
- Customer-Success-Gespräche oder QBRs — andere Struktur und Ziele
- Interne Teammeetings — nicht relevant
- Gespräche ohne Transkript — du benötigst Texteingabe (verwende zuerst ein Transkriptions-Tool)

## Anweisungen

### Vollständige Gesprächsanalyse-Eingabeaufforderung

```
Analysiere dieses Vertriebsgesprächs-Transkript und extrahiere strukturierte Ergebnisse.

[TRANSKRIPT EINFÜGEN]

Kontext:
- Vertriebsmitarbeiter: [Name]
- Interessent: [Name, Titel, Unternehmen]
- Gesprächstyp: [Kaltakquise / Discovery / Follow-up / Demo / Abschluss]
- Gesprächsziel: [Was der Mitarbeiter erreichen wollte]

Extrahiere:

## 1. Gesprächsergebnis
- Ergebnis: [meeting_booked | positive_followup | objection_unresolved | not_interested | voicemail | gatekeeper | no_answer]
- Ergebniszuverlässigkeit: [0-100]
- Vereinbarter nächster Schritt: [genau, was vereinbart wurde — Datum, Uhrzeit, Format]

## 2. CRM-Notiz (zum direkten Einfügen)
Datum: [Datum]
Dauer: [Minuten]
Ergebnis: [Ergebnis]
Zusammenfassung: [2-3 Sätze zu den besprochenen und vereinbarten Punkten]
Nächster Schritt: [genaue nächste Aktion + Verantwortlicher + Datum]
Geäußerte Einwände: [Liste]
Stimmung des Interessenten: [positiv / neutral / negativ]

## 3. Geäußerte Einwände + Umgang damit
Für jeden Einwand:
- Einwand: [wortwörtlich oder paraphrasiert]
- Reaktion des Mitarbeiters: [was er gesagt hat]
- Wirksamkeit: [gut / verbesserungswürdig / verpasste Gelegenheit]
- Empfohlener Umgang: [alternativer Ansatz, falls Verbesserung nötig]

## 4. Discovery-Qualitätsbewertung (0-100)
- Hat der Mitarbeiter den Schmerz des Interessenten verstanden? [ja/teilweise/nein]
- Hat der Mitarbeiter den Entscheider identifiziert? [ja/nein]
- Hat der Mitarbeiter den Zeitrahmen verstanden? [ja/nein]
- Hat der Mitarbeiter die Budgetsituation verstanden? [ja/nein]
- Verhältnis gestellte Fragen zu Aussagen: [X:Y — sollte >2:1 sein]
- Bewertung: [0-100]

## 5. Follow-up-E-Mail (versandfertig)
Betreff: [personalisiert — nicht "Nachfassen zu unserem Gespräch"]
Text: [4-6 Sätze, die auf konkrete besprochene Punkte eingehen]

## 6. Coaching-Feedback (3 Punkte)
- Was gut funktioniert hat: [1 Punkt]
- Was zu verbessern ist: [1-2 Punkte mit konkreten alternativen Formulierungen]
- Empfohlene Übung: [spezifische Trainingsaufgabe]
```

### Schnelle CRM-Notiz-Extraktion (< 1 Minute)

```
Extrahiere eine CRM-Notiz aus diesem Gesprächstranskript.

[TRANSKRIPT EINFÜGEN]

Ausgabeformat:
Datum: [heute]
Ergebnis: [1 Wort — gebucht/nein/voicemail/einwand/positiv]
Schlüsselzitat des Interessenten: "[wortwörtlich — aussagekräftigste Aussage]"
Nächster Schritt: [genau, was als nächstes passiert — wer macht was bis wann]
Zusammenfassung: [2 Sätze]
Tags: [objection_price | objection_competitor | champion | not_icp | hot | nurture]
```

### Einwandsextraktion und Coaching

```
Extrahiere jeden Einwand aus diesem Gesprächstranskript und bewerte, wie gut der Mitarbeiter jeden einzelnen behandelt hat.

[TRANSKRIPT EINFÜGEN]

Für jeden Einwand:
1. Einwand (wortwörtlich oder paraphrasiert)
2. Antwort des Mitarbeiters (wortwörtlich)
3. Bewertung: [A/B/C/D]
   - A: Anerkannt, neu gerahmt, nächsten Schritt erreicht
   - B: Anerkannt, aber nicht vorangebracht
   - C: Defensiv reagiert oder übermäßig erklärt
   - D: Ignoriert oder vermasselt
4. Bessere Antwort: [alternative Formulierung bei B/C/D]

Zusammenfassung:
- Gesamtanzahl Einwände: [X]
- Durchschnittliche Bewertung: [X]
- Größtes Defizit: [welcher Einwandstyp am meisten Übung braucht]
- Übungsempfehlung: [spezifische Trainingsaufgabe]
```

### Gong / Aircall-Integrationsmuster

```typescript
// Webhook-Empfänger — wird ausgelöst, wenn eine Gesprächsaufzeichnung bereit ist
app.post('/webhooks/call-completed', async (req, res) => {
  const { callId, recordingUrl, repEmail, prospectEmail, durationSeconds } = req.body

  // 1. Transkript vom Transkriptions-Anbieter abrufen
  const transcript = await getTranscript(callId) // Gong, Fireflies, Otter API

  // 2. Interessentenkontext aus dem CRM abrufen
  const prospect = await hubspot.findContactByEmail(prospectEmail)

  // 3. Claude-Analyse durchführen
  const analysis = await analyseCall({
    transcript,
    rep: await getRepByEmail(repEmail),
    prospect,
    callType: inferCallType(durationSeconds, prospect.lifecyclestage),
  })

  // 4. CRM aktualisieren
  await hubspot.crm.contacts.basicApi.update(prospect.id, {
    properties: {
      last_call_outcome: analysis.outcome,
      last_call_date: new Date().toISOString(),
      last_call_summary: analysis.crmNote,
      last_call_next_step: analysis.nextStep,
    },
  })

  // 5. Notiz im CRM erstellen
  await hubspot.crm.notes.basicApi.create({
    properties: {
      hs_note_body: analysis.crmNote,
      hs_timestamp: Date.now(),
    },
    associations: [{ to: { id: prospect.id }, types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }] }],
  })

  // 6. Coaching-Feedback an Slack senden, wenn Bewertung < 70
  if (analysis.discoveryScore < 70) {
    await postSlackCoachingAlert({
      channel: `#coaching-${repEmail.split('@')[0]}`,
      rep: repEmail,
      callId,
      score: analysis.discoveryScore,
      feedback: analysis.coachingFeedback,
    })
  }

  // 7. Wenn Meeting gebucht — AE für warme Übergabe benachrichtigen
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

### Massen-Gesprächsbewertung (Manager-Ansicht)

```
Du bist ein Vertriebsleiter, der diese Woche Gespräche deines SDR-Teams bewertet.

Hier sind [N] Gesprächstranskripte. Für jedes:
1. Gespräch bewerten (0-100)
2. Die größte Coaching-Chance identifizieren (1 Satz)
3. Markieren, ob das Gespräch eine ICP-Unstimmigkeit aufzeigt
4. Heiße Interessenten markieren, die sofortige AE-Aufmerksamkeit benötigen

Dann gib mir:
- Teamdurchschnittsbewertung
- Häufigster Einwand diese Woche
- Mitarbeiter, der am meisten Coaching braucht (und warum)
- Bester Performer und was er anders macht

[TRANSKRIPTE EINFÜGEN]
```

### Follow-up-E-Mail-Vorlagen nach Ergebnis

```
ERGEBNIS: Meeting gebucht
Betreff: "[BESPROCHENES THEMA] — bestätigt für [TAG UHRZEIT]"
Text:
"[NAME], schön, mit Ihnen gesprochen zu haben. Ich freue mich auf [TAG] um [UHRZEIT].

Ich werde vorbereitet kommen mit [was du besprochen hast vorzubereiten].

Kurze Agenda:
- [10 Min] Ihr aktuelles Setup mit [X]
- [10 Min] Wie wir [ihr Problem] angehen
- [10 Min] Fragen & Antworten + Passungsbeurteilung

Kalendereinladung kommt von [Calendly/Google Calendar].

[Signatur]"

---

ERGEBNIS: Positiv, aber noch kein Meeting gebucht
Betreff: "[Ein besprochener Punkt]"
Text:
"[NAME], danke für Ihre Zeit heute.

Wie erwähnt, [kurze Zusammenfassung ihres Schmerzpunkts in ihren Worten].

Ich sende Ihnen [was du versprochen hast — Fallstudie, Daten, Demo-Clip].

[Beigefügte Ressource / Link]

Lohnen sich 20 Minuten, um durchzugehen, wie das auf [ihr Unternehmen] zutrifft?
Ich hätte [TAG] um [UHRZEIT] oder [TAG] um [UHRZEIT] — passt einer davon?

[Signatur]"

---

ERGEBNIS: Voicemail hinterlassen / keine Antwort
Betreff: "Nachfassen — [spezifischer Auslöser oder Grund]"
Text:
"[NAME], ich habe es vorhin versucht — hoffe, der Zeitpunkt war einfach ungünstig.

Ich melde mich, weil [ein-Satz-Auslöser — warum jetzt].

[Ein-Satz-Beschreibung, was wir tun + relevantes Ergebnis].

Gerne nur 15 Minuten — [Calendly-Link] falls einfacher als Telefon.

[Signatur]"
```

## Beispiel

**Benutzer:** Analysiere dieses 4-minütige Gespräch. Marcus sagte "der richtige Zeitpunkt ist noch nicht da", schien aber interessiert. Was sollte ich als nächstes tun?

**Transkriptauszug:**
> Mitarbeiter: "...angesichts Ihrer Einstellungen scheint es, als würden Sie das Vertriebsteam skalieren."
> Marcus: "Ja, das stimmt, aber ehrlich gesagt ist jetzt nicht der richtige Zeitpunkt — wir sind mitten in einer Reorganisation."
> Mitarbeiter: "Völlig verständlich. Wann denken Sie, wäre es besser?"
> Marcus: "Wahrscheinlich Q4 — August/September vielleicht."
> Mitarbeiter: "Perfekt — ich melde mich dann."

**Analyseausgabe:**

```
Ergebnis: not_now (positiv — zukünftiges Interesse geäußert)
Nächster Schritt: Mitte August nachfassen (Termin für 12. Aug einplanen)

CRM-Notiz:
Gespräch mit Marcus Chen, 4 Min, 2. Jun. Derzeit in Reorganisation — "jetzt nicht der richtige Zeitpunkt."
Offenheit für Q4 (Aug/Sep) geäußert. Hohe ICP-Passung bestätigt (Vertriebsteam wird skaliert).
Termin: Follow-up-Gespräch 12. Aug.

Einwand: "Jetzt nicht der richtige Zeitpunkt — wir sind in einer Reorg"
Umgang des Mitarbeiters: B — anerkannt, Zeitrahmen erhalten, aber verpasste Gelegenheit, 
in der Zwischenzeit in Kontakt zu bleiben.
Bessere Antwort: "Das macht Sinn — Reorganisationen sind hektisch. Wäre es hilfreich, 
wenn ich Ihnen in der Zwischenzeit eine Sache schicke, damit Sie zu Q4 bereits vertraut sind?
Braucht 2 Minuten zum Lesen."
→ So bleibt man präsent, ohne Druck auszuüben.

Discovery-Bewertung: 52/100
- Zeitrahmen ermittelt? Ja (Q4)
- Schmerz verstanden? Teilweise (Skalierung, aber nicht untersucht, was nicht funktioniert)
- Entscheider identifiziert? Nein — nicht bestätigt, ob Marcus der Käufer ist
- Fehlend: "Wer wäre sonst noch in eine solche Entscheidung eingebunden?"

Follow-up-E-Mail verfasst ✓
Coaching-Notiz an Slack gesendet ✓
CRM aktualisiert: lifecycle = nurture, Follow-up-Aufgabe = 12. Aug ✓
```

---

> **Arbeite mit uns:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir bauen KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
