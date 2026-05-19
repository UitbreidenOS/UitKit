---
name: email-automation
description: "Multi-step outreach email sequences: personalised touchpoints, reply detection routing, follow-up cadence, meeting booking integration, deliverability patterns"
---

> 🇩🇪 Deutsche Version. [Englische Version](../email-automation.md).

# Skill: E-Mail-Automatisierung

## Wann aktivieren
- Entwurf einer Cold-Outreach-Sequenz (3-5 Kontaktpunkte)
- Verfassen von Follow-up-E-Mails, die persönlich wirken, nicht automatisiert
- Einrichten von Antwort-Erkennungslogik (interessiert / nicht jetzt / Abmeldung)
- Integration von E-Mail-Sequenzen mit Kalender-Buchung (Calendly, Cal.com)
- Überprüfung von Zustellbarkeitsmustern (Spam-Vermeidung, Domain-Warmup)

## Wann NICHT verwenden
- Massen-Newsletter-Versand — Mailchimp/Klaviyo direkt verwenden
- Transaktionale E-Mails (Quittungen, Bestätigungen) — von Ihrer Plattform gehandhabt
- Bestehende Kunden, die nicht in Outreach eingewilligt haben — DSGVO/CAN-SPAM-Risiko

## Anweisungen

### Eine 4-stufige Outreach-Sequenz entwerfen

```typescript
// Sequenzdesign:
// Tag 0: Erstkontakt (persönlich, spezifisch)
// Tag 3: Follow-up 1 (Mehrwert bieten — Ressource, Einblick, Daten)
// Tag 7: Follow-up 2 (anderer Winkel oder Kanal)
// Tag 14: Abschluss-E-Mail (respektvoller Abschluss, Tür offen lassen)

const sequence: EmailStep[] = [
  { day: 0,  subject: '{{personalised_hook}}',    type: 'initial' },
  { day: 3,  subject: 'Re: {{original_subject}}', type: 'followup_value' },
  { day: 7,  subject: 'Re: {{original_subject}}', type: 'followup_angle' },
  { day: 14, subject: 'Closing the loop',          type: 'breakup' },
]
```

### Jeden E-Mail-Typ verfassen

**Erstkontakt (Tag 0) — spezifisch, kurz, menschlich:**
```
Verfassen Sie die Tag-0-E-Mail für eine Cold-Outreach-Sequenz.
Absender: [Name, Unternehmen, was wir tun]
Interessent: [Name, Titel, Unternehmen, eine spezifische Information über ihn]
Ziel: 15-minütigen Anruf buchen
Maximale Länge: 5-6 Sätze
Regeln: Etwas Spezifisches referenzieren (aktuelle Neuigkeiten, Beitrag, Rollenwechsel),
        Mehrwert in einem Satz formulieren, sanfter CTA ("offen für einen kurzen Anruf?")
```

**Follow-up 1 (Tag 3) — echten Mehrwert bieten:**
```
Verfassen Sie das Follow-up für Tag 3.
Mehrwert bieten mit: [einer relevanten Fallstudie / Statistik / Ressource / Erkenntnis]
Referenz: die ursprüngliche E-Mail (kurz halten)
CTA: wie Tag 0, neu formuliert
Länge: 4-5 Sätze
```

**Abschluss-E-Mail (Tag 14) — elegant abschließen:**
```
Verfassen Sie die Abschluss-E-Mail für Tag 14.
Ton: verständnisvoll, nicht passiv-aggressiv
Tür offen lassen: "falls sich das Timing ändert / später relevant ist"
Kein Schuldgefühl, kein "Ich habe versucht, Sie X-mal zu erreichen"
Länge: maximal 3 Sätze
```

### Antwort-Verarbeitungslogik

```typescript
async function handleReply(reply: EmailReply) {
  const intent = await classifyIntent(reply.body)
  // intent: 'interested' | 'not_now' | 'not_interested' | 'question' | 'referral'
  
  switch (intent) {
    case 'interested':
      return bookMeeting(reply.from, reply.threadId)
    case 'not_now':
      return scheduleFutureTouch(reply.from, daysFromNow: 90)
    case 'not_interested':
      return markOptedOut(reply.from)
    case 'referral':
      const referred = extractReferredContact(reply.body)
      return addToSequence(referred)
  }
}
```

### Meeting-Buchungs-Integration

```typescript
// An jede CTA-E-Mail anhängen — immer einen direkten Buchungslink verwenden
const BOOKING_FOOTER = `
If a call sounds useful, here's my calendar: {{calendly_link}}
Or just reply and I'll send over a time that works.
`

// Cal.com API — Verfügbarkeit prüfen vor dem Versand
const slots = await cal.availability.get({
  username: 'your-username',
  dateFrom: addDays(new Date(), 1),
  dateTo: addDays(new Date(), 7),
})
```

### Zustellbarkeitsregeln

```typescript
const SENDING_RULES = {
  maxPerDay: 50,              // pro Versanddomain
  minDelayBetweenEmails: 90,  // Sekunden — Massenmuster vermeiden
  warmUpNewDomain: true,      // bei 10/Tag beginnen, täglich 10% steigern
  spfDkimRequired: true,      // vor dem ersten Versand prüfen
  unsubscribeLink: true,      // für CAN-SPAM/DSGVO erforderlich
  plainTextVersion: true,     // verbessert die Zustellbarkeit
  avoidSpamTriggers: [        // niemals in Betreffzeilen verwenden
    'free', 'guarantee', 'no risk', 'click here',
    'make money', 'earn cash', '!!!',
  ],
}
```

### Personalisierungsmuster, die Antwortquoten verdreifachen

```
// Vor dem Schreiben recherchieren — EINE spezifische Sache finden:
// - Aktuelle Unternehmensneuigkeiten (Finanzierung, Produktlaunch, Einstellungen)
// - Aktueller LinkedIn-Beitrag oder Kommentar
// - Gemeinsame Verbindung oder geteilter Hintergrund
// - Rollenwechsel in den letzten 6 Monaten
// - Wettbewerber, den sie gerade ersetzt haben, oder ein Tool, das sie erwähnt haben

// Schlecht (Template-Austausch): "Ich habe bemerkt, dass Sie [Titel] bei [Unternehmen] sind"
// Gut (authentisch): "Sah Ihren Beitrag über den Wechsel von Postgres zu Neon —
//                    die Branching-Funktion, die Sie erwähnt haben, ist genau der Grund,
//                    warum wir [X] gebaut haben"
```

## Beispiel

**Kontext:** B2B-SaaS verkauft ein Projektmanagement-Tool. Der Interessent ist ein VP Engineering, der kürzlich über Schwierigkeiten mit der teamübergreifenden Sichtbarkeit gepostet hat.

**Tag 0:**
> Betreff: Teamübergreifende Sichtbarkeit bei großen Projekten
>
> Sah Ihren LinkedIn-Beitrag über das Sichtbarkeitsproblem zwischen den Squads — wir hören das oft von VPs in Ihrer Größenordnung.
>
> Wir haben [Produkt] genau dafür gebaut: eine Ansicht des Fortschritts jedes Teams ohne den Overhead der Status-Meetings. [Unternehmen X] hat seine wöchentlichen Syncs nach dem Wechsel von 4 auf 1 reduziert.
>
> Sind 15 Minuten drin, um Ihnen zu zeigen, wie es funktioniert?

**Tag 3:**
> Betreff: Re: Teamübergreifende Sichtbarkeit bei großen Projekten
>
> Ich hänge eine 2-minütige Aufschlüsselung an, wie [Unternehmen X] (ähnliche Größe wie Ihres) ihre Sichtbarkeitsschicht umstrukturiert hat — könnte angesichts dessen, was Sie beschrieben haben, relevant sein.
>
> Zeige es Ihnen gerne live, wenn gewünscht — gleicher Link: [Kalender]

---

> **Arbeiten Sie mit uns:** Claudient wird unterstützt von [Uitbreiden](https://uitbreiden.com/) — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwicklergemeinschaften.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
