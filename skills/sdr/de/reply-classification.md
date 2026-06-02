# Antwort-Klassifizierung

## Wann aktivieren

Sie erhalten eine Antwort eines Interessenten auf eine ausgehende E-Mail, Nachricht oder einen Anrufversuch. Sie müssen die Antwort klassifizieren, eine sofortige Antwort vorbereiten und sie an die richtige Aktion in Ihrem Vertriebsprozess weiterleiten. Dies gilt für SDR-Workflows, Gründer-Outreach und jedes B2B-Engagement, bei dem der Antworttyp das Follow-up-Tempo und die Taktik bestimmt.

## Wann NICHT verwenden

- Verwenden Sie dies nicht für Inbound-Leads mit vorgegründetem Interesse — diese gehen direkt zur Sales-Call-Weiterleitung.
- Nicht verwenden für Warm Intros, bei denen der Einleiter bereits qualifiziert hat — direkt zu WARM oder HOT weiterleiten.
- Nicht verwenden für automatische Antworten, Abwesenheitsmitteilungen oder Bounce-Backs — diese als Systemrauschen kennzeichnen.
- Nicht verwenden für Antworten, die älter als 10 Minuten sind, ohne den aktuellen Kontext erneut zu lesen — die Absicht des Interessenten kann sich ändern.

## Anleitung

### Sechs-Kategorien-Klassifizierungssystem

#### Kategorie 1: HOT
**Definition:** Explizites Interesse + Anfrage nach Treffen, Anruf, Preisgestaltung oder Demo. Keine Mehrdeutigkeit.

**Indikatoren:**
- "Wann können wir anrufen?"
- "Send mir einen Demo-Link."
- "Wie ist eure Preisgestaltung?"
- "Ich bin interessiert; lass uns etwas einrichten."
- "Können wir Montag sprechen?"

**Response SLA:** < 1 Stunde (idealerweise innerhalb von 15 Minuten).

**CRM-Tags:** `hot`, `demo_requested`, `meeting_booked` (oder `calendar_pending`).

**Aktions-Template:**
```
[Eröffnung] Danke — freue mich auf das Gespräch.

[Nächster Schritt] Ich habe [spezifische Zeit, z. B. "Dienstag 14 Uhr MEZ"] blockiert — passt das?
Alternativ biete ich [2-3 weitere Optionen, alle innerhalb von 48 Stunden].

[Glaubwürdigkeit] In der Zwischenzeit [1 relevante Fallstudie oder Metrik einfügen].

[Signatur] Freue mich auf das Gespräch.
```

**Beispiel-Antwort auf HOT:**
```
Interessent: "Das sieht interessant aus. Können wir diese Woche ein Gespräch vereinbaren?"

Ihre Antwort:
Hallo [Name],

Ausgezeichnet. Ich habe Dienstag 10 Uhr und Donnerstag 14 Uhr MEZ frei — welcher Termin passt besser?

In der Zwischenzeit habe ich eine kurze Fallstudie von [ähnliches Unternehmen in ihrer Branche] beigefügt,
das eine 40%-ige Verbesserung bei [ihre Kernmetrik] innerhalb der ersten 90 Tage erreichte.

Freue mich auf das Gespräch.

[Link zu Kalender mit 3 Slots + einseitigen Überblick beilegen]
```

---

#### Kategorie 2: WARM
**Definition:** Interessiert, aber mit einer Einschränkung — Zeitrahmen, Budget-Zyklus, konkurrierende Priorität oder Scope-Frage.

**Indikatoren:**
- "Das könnte für uns nächstes Quartal funktionieren."
- "Wir erkunden das, aber unser Budget ist bis Q3 eingefroren."
- "Interessant, aber wir priorisieren derzeit X."
- "Ich mag es — muss zuerst mit meinem Team besprechen."
- "Das sieht gut aus. Kannst du mich in einem Monat folgen lassen?"

**Response SLA:** Am gleichen Tag (innerhalb von 4-6 Stunden).

**CRM-Tags:** `warm`, `follow_up_scheduled`, `constraint_identified` (Tag die spezifische Einschränkung: `budget_cycle`, `timing`, `alignment_needed`, `stakeholder_involved`).

**Aktions-Template:**
```
[Bestätigung] Ich verstehe dich — [wiederholt die Einschränkung ehrlich].

[Umrahmen] Dieser Zeitrahmen funktioniert tatsächlich zu unserem Vorteil, weil [erkläre, warum die Einschränkung lösbar oder vorübergehend ist].

[Spezifische Zusage] Lassen Sie uns [spezifisches Datum — z. B. "15. August"] festlegen, damit dies auf Ihrem Radar bleibt.
In der Zwischenzeit sende ich dir [spezifischer Wert: 1 relevanter Leitfaden, Benchmark oder Checkliste].

[Taktisch] Frage: Wenn du das in [ihr Zeitrahmen] überprüfst, was wird die oberste Priorität zu validieren sein?
[Diese Antwort hilft dir, deine Nachricht vorzupositionieren.]

[CRM-Aufgabe] Ich habe dies in unserem System vermerkt — du wirst am [Datum] von mir hören.
```

**Beispiel-Antwort auf WARM:**
```
Interessent: "Das ist interessant, aber wir sind bis Q3 auf andere Prioritäten konzentriert. 
Vielleicht überprüfst du es dann?"

Ihre Antwort:
Hallo [Name],

Verstanden — Q3 ist perfekt. Q2 ist tatsächlich die Zeit, in der die meisten Teams Tools für 
Q3/Q4-Implementierung evaluieren, also sind wir in einer guten Position, um uns vorzubereiten.

Lassen Sie uns 15. August für ein Gespräch festlegen. In der Zwischenzeit sende ich Ihnen unsere 
"[Branche]-Readiness-Checkliste" — 3 Fragen zur Überprüfung, ob [Ihre Lösung] 
die richtige Passform für Ihren Stack ist.

Schnelle Frage: Wenn Sie das im August überprüfen, werden Sie 
[Kernfall] oder [alternativen Fall] evaluieren? Hilft mir, anzupassen, was wir besprechen.

Ich habe eine Erinnerung für 10. August gesetzt. Bis bald.

[Checklisten-PDF]
```

---

#### Kategorie 3: NEUTRAL
**Definition:** Höflich, aber nicht bindend. Keine Einschränkung, keine Einwände — nur lauwarmes Interesse.

**Indikatoren:**
- "Interessant, ich behalte es im Auge."
- "Danke für deine Kontaktaufnahme — sieht nützlich aus."
- "Jetzt keine Priorität, aber danke."
- "Ich werde mir das anschauen."
- [Keine Antwort nach 3 Tagen der ursprünglichen Kontaktaufnahme — bei zweitem Kontakt als NEUTRAL behandeln.]

**Response SLA:** 24–48 Stunden.

**CRM-Tags:** `neutral`, `one_follow_up_sent`, `interest_level_low`, `deprioritise_after_followup`.

**Aktions-Strategie:**
- Senden Sie genau EIN Follow-up mit einer hochspezifischen Frage, um versteckte Einwände oder verborgene Bedürfnisse aufzudecken.
- Wenn die Frage eine Ablehnung oder Stille erhält, sofort deprioritisieren.
- Schleifen Sie NEUTRAL-Interessenten nicht mehr als einmal — es verschwendet Pipline-Geschwindigkeit.

**Aktions-Template:**
```
[Personalisierung] Mir ist aufgefallen, dass du [spezifische Aktion — z. B. "unsere Preisseite besucht hast" / "meine letzte E-Mail geöffnet hast"].

[Spezifische Frage] Schnelle Frage: Wenn du an [ihr Kernproblem] denkst, 
ist [spezifischer Reibungspunkt] etwas, das dein Team heute bewältigt?

[Low-Pressure-Abschluss] Wenn es nicht oben auf der Liste steht, kein Problem — ich bin hier, wenn sich das ändert.
Antworte mit einem einzelnen Wort, wenn du verbunden bleiben möchtest.
```

**Beispiel-Antwort auf NEUTRAL:**
```
Interessent (ursprüngliche Antwort): "Danke für deine Kontaktaufnahme. Sieht interessant aus — ich werde mir das anschauen."

Ihr Follow-up (1 Tag später):
Hallo [Name],

Schnelle Frage: Mir ist aufgefallen, dass du in [Abteilung] arbeitest. Wenn dein Team [Kernprozess] verwaltet, 
wie geht ihr derzeit mit [spezifischem Engpass, den du kennst, mit dem sie konfrontiert sind] um?

Neugierig, ob das ein Reibungspunkt für dich ist. Wenn nicht, völlig verständlich — ich werde in 6 Monaten nachschauen, wenn sich die Dinge ändern.

[Nur eine Frage — kein Pitch]
```

---

#### Kategorie 4: EINWAND
**Definition:** Spezifisches, angegebenes Gegengespräch — Preis zu hoch, Konkurrenzpräferenz, Zeitrahmen misaligned oder festgestellte Lückenfunktionalität.

**Indikatoren:**
- "Wir nutzen bereits [Konkurrenz]."
- "Eure Preisgestaltung ist zu hoch für unser Budget."
- "Wir sind dafür noch nicht bereit."
- "Warum würden wir das brauchen, wenn wir [interne Lösung] haben?"
- "Ich glaube nicht, dass das [spezifisches Problem, das wir haben] löst."

**Response SLA:** Am gleichen Tag (innerhalb von 2 Stunden ist ideal — zeigt, dass du Einwände ernst nimmst).

**CRM-Tags:** `objection`, `objection_type:[price|timing|competitor|feature_gap|internal_solution]`.

**Kernprinzip:** NIEMALS argumentieren oder verteidigen. Anerkennen, mit Beweis oder Logik umrahmen, mit einer Frage umleiten, die zu Einsicht führt.

**Aktions-Template:**
```
[Anerkennung — spiegele ihre genaue Besorgnis wider]
"Ich verstehe dich — [Einwand in ihren Worten wiederholen]. Das macht Sinn."

[Umrahmen — biete einen neuen Blickwinkel oder Datenpunkt, KEINE Gegenargument]
"Hier ist, was ich gefunden habe: [ähnliche Unternehmen / Datenpunkt / Kundeneinblick, der ihre Besorgnis adressiert]."

[Frage — leite auf einen neuen Winkel oder Tiefe um]
"Frage: [frage etwas, das offenbart, ob der Einwand real oder eine Verzögerungstaktik ist]?"

[Nächster Schritt — bedingt, basierend auf dem, was sie brauchen, um voranzukommen]
"Wenn wir [ihren Einwand beheben] könnten, würde das die Dinge ändern?"
```

**Objekt-spezifische Prompts:**

**Preis-Einwand:**
```
Das verstehe ich — das Budget ist eng. Hier ist, was ich mit [ähnlich großem Unternehmen] gesehen habe:
sie fingen mit [1 spezifischem Anwendungsfall] für [X Kosten] statt vollständigem Rollout an.
Sahen [spezifische ROI] in 60 Tagen, dann erweiterte sich.

Würde ein phasengestaffelter Ansatz für dich Sinn machen?
```

**Konkurrenz-Einwand:**
```
[Konkurrenz] ist solide — wir sehen sie in [X% ähnlicher Unternehmen].
Hier ist, wo wir uns unterscheiden: [einen spezifischen, nachweisbaren Unterschied — nicht Funktionen, sondern Ergebnisse].

Hast du [spezifische Sache, die der Konkurrenz nicht adressiert]?
```

**Zeitrahmen-Einwand:**
```
Zeitrahmen ist wichtig. Die meisten Teams, die 6+ Monate verzögern, brauchen das schneller als erwartet.
Frage: Was müsste in den nächsten 30 Tagen passieren, damit dies auf deine Liste springt?
```

**Feature-Gap-Einwand:**
```
Das ist ein guter Punkt — [Gap anerkennen]. Hier ist, was wir von ähnlichen Teams hören:
[erklären, wie das Ergebnis trotz der Lücke erreicht wird, ODER erkläre die Roadmap].

Ist diese spezifische Lücke ein Blocker, oder gibt es einen Workaround, der zu deinem Workflow passt?
```

**Beispiel-Antwort auf EINWAND:**
```
Interessent: "Eure Preisgestaltung ist viel höher als [Konkurrenz]. Das können wir gerade nicht rechtfertigen."

Ihre Antwort:
Hallo [Name],

Ich verstehe dich — Preisgestaltung ist eine echte Einschränkung. Ich werde direkt sein: wir sind nicht die billigsten. 
Hier ist, warum Teams uns trotzdem wählen: [durchschnittlicher Kunde] hat ihre jährlichen Kosten 
durch Implementierungseinsparungen innerhalb von 90 Tagen amortisiert.

Ich weiß, [Konkurrenz] kostet weniger im Voraus. Sie sind gut. Anderer Trade-off jedoch — 
sie benötigen 2-3x mehr manuelle Konfiguration und laufende Abstimmung.

Schnelle Frage: Wie viel Zeit wendet dein Team derzeit auf [manueller Prozess auf, den unser Produkt automatisiert] auf? 
Wenn wir auch nur einen Teil dieser Zeit zurückgewinnen könnten, würde die ROI-Mathematik funktionieren?

Gerne weitere Optionen erkunden, wenn du dich eingraben möchtest.
```

---

#### Kategorie 5: ABLEHNUNG
**Definition:** Harte Nein, explizite Desinteresse oder angegebene Irrelevanz für ihr Geschäft.

**Indikatoren:**
- "Nicht interessiert."
- "Wir brauchen das nicht."
- "Bitte entferne mich von deiner Liste."
- "Falsche Zeitrahmen — nie für uns."
- "Das trifft nicht auf unser Geschäft zu."

**Response SLA:** Innerhalb von 1 Stunde (respektiere ihre Zeit und Grenzen).

**CRM-Tags:** `rejected`, `retirement_date:[6 Monate ab heute]`, `do_not_contact_until:[Datum]`.

**Kernprinzip:** Danke, respektiere die Grenze, VERSUCHE NICHT, sie zu überzeugen. Lege ein automatisches Ruhestandsdatum im CRM fest (6 Monate). Archiviere den Thread.

**Aktions-Template:**
```
[Respekt] Kein Problem — ich weiß es zu schätzen, dass du mir Bescheid gibst.

[Abschluss] Wenn sich die Dinge in Zukunft ändern, weißt du, wie du mich findest.

[Abmeldung] Viel Erfolg mit [ihr Kerngeschäft].
```

**Beispiel-Antwort auf ABLEHNUNG:**
```
Interessent: "Nicht interessiert. Bitte höre auf, mich zu kontaktieren."

Ihre Antwort:
Hallo [Name],

Vollständig verstanden. Ich werde dich aus meiner Liste entfernen — keine weiteren E-Mails von mir.

Wenn sich deine Situation in der Zukunft ändert, kontaktiere mich gerne jederzeit.

Viel Erfolg mit [ihrem angegebenen Fokusbereich].
```

**CRM-Aktion:** Aufgabe setzen: `Reaktiviere [Name] am [Datum 6 Monate ab heute]` mit Notiz: "Überprüfe, ob sich das Unternehmen vergrößert hat oder Prioritäten verschoben haben."

---

#### Kategorie 6: NICHT ICP
**Definition:** Falsche Person, falsches Unternehmens-Stadium, falsche Branche oder explizit "nicht relevant für uns."

**Indikatoren:**
- "Ich bin nicht die richtige Person — sprich mit [Name in anderer Abteilung]."
- "Wir sind ein [Stadium]-Unternehmen — das ist für [anderes Stadium]."
- "Unsere Branche benutzt wirklich nicht [dieser Lösungstyp]."
- "Wir lagern diese Funktion aus — sprich mit unserem [Anbieter/Partner]."

**Response SLA:** Innerhalb von 4 Stunden (nutze ihren Referral-Schwung).

**CRM-Tags:** `not_icp`, `referred_to:[neuer Kontaktname + Titel]`, `referral_source:[ursprünglicher Interessent]`.

**Kernprinzip:** Behandle die Referral als Geschenk. Frag um Erlaubnis, hole die richtige E-Mail, personalisiere die Kontaktaufnahme mit dem Referral-Kontext.

**Aktions-Template:**
```
[Dankbarkeit] Danke dir vielmals, dass du mich auf [richtige Person] hingewiesen hast.

[Erlaubnis] Kann ich erwähnen, dass du sie vorgeschlagen hast, oder würdest du das lieber nicht?

[Verbindungsanfrage] Würde es seltsam wirken, wenn ich sie direkt kontaktiere, oder würdest du lieber einführen?

[Fallback] Wenn direkt besser ist, könntest du mir ihre E-Mail schicken?
```

**Beispiel-Antwort auf NICHT ICP:**
```
Interessent: "Ich kümmere mich um das Budget, aber das ist wirklich eine Betriebsfrage. Sprich mit Sarah Chen — sie ist unsere VP Ops."

Ihre Antwort:
Hallo [Name],

Danke dafür — Sarah ist genau die Person, mit der ich sprechen muss.

Kann ich erwähnen, dass du sie vorgeschlagen hast, oder würdest du das lieber nicht erwähnen?

Wenn du offen dafür bist, könnte ich eine Nachricht schreiben und du könntest sie weiterleiten — 
oder ich kann sie kalt kontaktieren und deinen Namen erwähnen. Beides funktioniert für mich.

Danke für die Anleitung.
```

**Sofortige CRM-Aktion:**
```
1. Neuen Interessent-Datensatz erstellen: Sarah Chen, VP Ops, [Unternehmen], mit Notiz "Von [ursprünglichem Interessent] verwiesen"
2. Original-Interessent taggen: `referral_sent_to:[neuer Interessent], date:[heute]`
3. Erste Kontaktaufnahme personalisieren: "Hallo Sarah, [Original Interessent] hat vorgeschlagen, dass ich dich über [Thema] kontaktiere..."
```

---

### Klassifizierungs-Prompt (zur Verwendung mit Claude)

```
Du bist ein B2B-Verkaufs-Antwort-Klassifizierer. Ein Interessent hat auf eine ausgehende Nachricht geantwortet. 
Klassifiziere seine Antwort in genau eine dieser sechs Kategorien, entwerfe eine Antwort und 
identifiziere CRM-Aktionen.

Interessent-Antwort:
---
[INTERESSENT-ANTWORT HIER EINFÜGEN]
---

Klassifizierungs-Aufgabe:
1. Bestimme die beste Kategorie: HOT, WARM, NEUTRAL, EINWAND, ABLEHNUNG, NICHT ICP
2. Listet 2–3 spezifische Indikatoren auf, die diese Klassifizierung unterstützen
3. Identifiziere die Response SLA (Reaktionszeit)
4. Entwerfe eine Antwort anhand des genehmigten Templates für diese Kategorie
5. Spezifiziere CRM-Tags und alle geplanten Follow-up-Aufgaben

Ausgabeformat:
**Klassifizierung:** [KATEGORIE]
**Indikatoren:** [Liste 2-3 spezifische Ausdrücke/Signale aus ihrer Antwort]
**SLA:** [Zeitfenster]
**CRM-Tags:** [anzuwendende Tags]
**Antwort-Entwurf:**
[Vollständige entworfen Antwort, versand bereit — keine Änderungen erforderlich]
**CRM-Aktionen:**
- [Aktion 1]
- [Aktion 2]

Denk daran: Argumentiere nie mit Einwänden. Stelle immer eine Klarstellungsfrage für NEUTRAL-Antworten. 
Frage immer nach Referral-Informationen für NICHT ICP. Respektiere immer die ABLEHNUNG-Grenzen.
```

---

### Entscheidungsbaum (Schnell-Referenz)

```
Interessent hat geantwortet. Frag der Reihe nach:

1. Fragen sie nach einem Treffen, Anruf, Demo oder Preisgestaltung?
   → JA: HOT (< 1 Stunde Antwort)
   → NEIN: Nächste Frage

2. Drücken sie Interesse aus, erwähnen aber eine Zeit-, Budget- oder Prioritäts-Einschränkung?
   → JA: WARM (gleichtägige Antwort, lockere spezifisches Datum)
   → NEIN: Nächste Frage

3. Ist ihre Antwort höflich, aber nicht bindend, ohne angegebene Einschränkung oder Einwand?
   → JA: NEUTRAL (ein Follow-up mit spezifischer Frage nur)
   → NEIN: Nächste Frage

4. Geben sie einen spezifischen Einwand an (Preis, Konkurrenz, Bedarf, Zeit)?
   → JA: EINWAND (anerkennen, umrahmen, mit Frage umleiten)
   → NEIN: Nächste Frage

5. Sagen sie explizit "nein", "nicht interessiert" oder "entferne mich"?
   → JA: ABLEHNUNG (danke, respektiere Grenze, stelle 6 Monate in den Ruhestand)
   → NEIN: Finale Frage

6. Sind sie der falsche Kontakt, falsches Unternehmens-Stadium oder explizit außerhalb des Geltungsbereichs?
   → JA: NICHT ICP (frag nach Referral, danke, eskaliere via Referrer)
   → NEIN: Lese die ursprüngliche Antwort erneut — du könntest dich möglicherweise misklassifiziert haben.
```

---

### SLA und CRM-Workflow-Zusammenfassung

| Kategorie | Response SLA | CRM-Tag | Nächste CRM-Aktion | Follow-up-Trigger |
|----------|--------------|---------|-----------------|------------------|
| **HOT** | < 1 Stunde | `hot` | Erstelle Kalender-Link + sende Bestätigung | Kalender-Bestätigung oder Stornierung |
| **WARM** | Gleichtägig (4–6 Std.) | `warm` + Einschränkungstyp | Aufgabe setzen: Follow-up am spezifischen Datum | Ziel-Follow-up-Datum oder Stille nach 3 Tagen |
| **NEUTRAL** | 24–48 Stunden | `neutral`, `one_follow_up_sent` | EIN Follow-up nur; wenn keine Antwort, deprioritisieren | 7 Tage Stille = Schließe Schleife, markiere `deprioritisiert` |
| **EINWAND** | Gleichtägig (< 2 Std.) | `objection` + Typ | Aufgabe setzen: Follow-up nach Antwort | Interessent antwortet erneut oder 5 Tage Stille = NEUTRAL |
| **ABLEHNUNG** | Innerhalb 1 Stunde | `rejected`, `retire_date:[6mo]` | Erinnerung setzen, um in 6 Monaten zu reaktivieren | Nur Reaktivierungsdatum |
| **NICHT ICP** | Innerhalb 4 Stunden | `not_icp`, `referred_to:[Name]` | Kontaktiere Interessent; tagge Quelle | Referral-Kontaktaufnahme gesendet |

---

### Pitfall-Warnungen

**Klassifiziere WARM als HOT:**
Interessent sagt: "Sieht gut aus — lass uns nächstes Quartal sprechen."
Falsch: Behandle als HOT, weil sie "lass uns sprechen" sagten.
Richtig: Das ist WARM. Sie haben eine Zeitrahmen-Einschränkung. Lockere das spezifische Datum (Q3), sende Wert-Inhalte in der Zwischenzeit.

**Mit EINWAND argumentieren:**
Falsch: "Eigentlich ist unsere Preisgestaltung fair, weil..."
Richtig: "Ich verstehe dich — Preis ist eine Einschränkung. Hier ist, was andere Teams gefunden haben..."

**NEUTRAL endlos schleifen:**
Falsch: Sende 3–4 Follow-ups an einen "Ich behalte es im Auge" Interessent.
Richtig: Ein Follow-up mit einer Sondierungsfrage. Stille danach = Schließe, weiter gehen.

**Vergesse, um Referral in NICHT ICP zu bitten:**
Falsch: "Danke für den Kontext — viel Erfolg."
Richtig: "Kannst du mich auf [Person, die sie erwähnt] einführen? Wie sollte ich sie kontaktieren?"

**Respektiere ABLEHNUNG, aber überprüfe nach 2 Wochen:**
Falsch: Du stellst einen 6-Monats-Ruhestand ein, aber nach 2 Wochen schickst du: "Nur einchecken..."
Richtig: Stelle sie wirklich in den Ruhestand. Setze Kalender-Erinnerung für 6 Monate. Besuche nicht erneut.

---

## Beispiel

### Szenario 1: HOT-Klassifizierung

**Interessent-Antwort:**
```
Hey [Dein Name],

Das ist genau das, was wir brauchen. Unser Team sucht schon seit Monaten nach einer Lösung wie dieser. 
Wann können wir eine Demo vereinbaren? Wir sind diese Woche am Donnerstag oder Freitag frei.

Danke,
[Interessent-Name]
```

**Klassifizierungs-Ausgabe:**

**Klassifizierung:** HOT

**Indikatoren:**
- "genau das, was wir brauchen" (explizite Validierung)
- "sucht schon seit Monaten nach einer Lösung wie dieser" (angegebener Schmerz + Validierung)
- "Wann können wir eine Demo vereinbaren?" (explizite Anfrage nach Treffen)

**SLA:** < 1 Stunde (aim für 15 Minuten)

**CRM-Tags:** `hot`, `demo_requested`, `meeting_pending`

**Antwort-Entwurf:**
```
Hallo [Interessent-Name],

Ausgezeichnet — ich freue mich auch auf diese Passform.

Ich habe Donnerstag 14 Uhr MEZ und Freitag 10 Uhr MEZ blockiert. Welcher Termin passt besser?

Ich sende dir vorher einen kurzen Überblick über deinen Anwendungsfall. Auch eine Fallstudie von [ähnliches Unternehmen in ihrer Branche] — 
sie implementierten in Q1 und reduziert ihre [Kernmetrik, um die sie sich kümmern] um 30% im ersten Quartal.

Freue mich auf das Gespräch.

[Link zum 15-Min Kalender-Picker mit beiden Zeitslots]
[Einseitige Produktübersicht + 1 relevante Fallstudie-PDF]
```

**CRM-Aktionen:**
- Erstelle Kalender-Block für Donnerstag 14 Uhr und Freitag 10 Uhr
- Tagge Interessent: `hot`, `demo_requested`
- Falls bestätigt: erstelle Aufgabe "Sende Pre-Call-Brief + Fallstudie" mit 2-Stunden-Deadline
- Eskaliere zu Vertriebsleiter für Sichtbarkeit (wenn dies dein Prozess ist)

---

### Szenario 2: WARM-Klassifizierung

**Interessent-Antwort:**
```
Danke für deine Kontaktaufnahme. Das ist definitiv auf unserer Roadmap, aber wir bekommen das Budget 
erst in Q3 genehmigt. Die Zeitrahmen sind gerade nicht gut, aber mir gefällt, was ihr macht.

Lass mich wissen, wie ich die Schleife nicht verpasse.

[Interessent-Name]
```

**Klassifizierungs-Ausgabe:**

**Klassifizierung:** WARM

**Indikatoren:**
- "definitiv auf unserer Roadmap" (validiertes Bedarf)
- "wir bekommen das Budget erst in Q3 genehmigt" (spezifische Einschränkung + zukünftige Absicht)
- "mir gefällt, was ihr macht" (echtes Interesse, keine höfliche Ablehnung)

**SLA:** Gleichtägig (innerhalb 6 Stunden)

**CRM-Tags:** `warm`, `follow_up_scheduled`, `constraint_identified:budget_cycle`, `budget_approval_Q3`

**Antwort-Entwurf:**
```
Hallo [Interessent-Name],

Perfekt — Q3 ist tatsächlich idealer Zeitrahmen. Die meisten Teams evaluieren Anbieter in Q2 für Q3-Implementierung, 
also bist du der Kurve voraus.

Ich habe 15. August in meinem Kalender festgelegt, um dich kontaktieren. In der Zwischenzeit sende ich dir unsere 
"Anbieter-Evaluierungs-Checkliste" — drei Fragen zur Überprüfung der Passform, bevor deine Budget-Überprüfung anläuft.

Schnelle Frage: Wenn du das in Q3 überprüfst, wirst du versuchen, [Kernfall] oder [alternativen Fall] zu lösen? 
Hilft mir sicherzustellen, dass wir auf das konzentrieren, das dir am meisten bedeutet.

Freue mich auf die Verbindung in Q3.

[Checklisten-PDF]
```

**CRM-Aktionen:**
- Erstelle Aufgabe: "Follow-up mit [Interessent-Name] am 15. August"
- Tagge: `warm`, `follow_up_scheduled`, `budget_cycle_Q3`
- Setze Erinnerung: "Sende Wert-Inhalte (Checkliste, Leitfaden, Benchmark) innerhalb 24 Stunden"
- Notiz im Thread: "Einschränkung: Budget wird bis Q3 nicht genehmigt. Kein Einwand gegen Produkt."

---

### Szenario 3: EINWAND-Klassifizierung

**Interessent-Antwort:**
```
Danke für deine Kontaktaufnahme. Wir verwenden bereits [Konkurrenz-Name] und die Wechselkosten 
wären gerade zu hoch. Es ist ein gutes Produkt, aber ich sehe keinen Grund zu wechseln.

[Interessent-Name]
```

**Klassifizierungs-Ausgabe:**

**Klassifizierung:** EINWAND

**Indikatoren:**
- "verwenden bereits [Konkurrenz] in Kraft" (angegebene Konkurrenz-Alternative)
- "Wechselkosten wären gerade zu hoch" (spezifische, quantifizierte Besorgnis)
- "sehe keinen Grund zu wechseln" (Validierung von Bedarf, nicht Ablehnung)

**SLA:** Gleichtägig (< 2 Stunden)

**CRM-Tags:** `objection`, `objection_type:competitor`, `incumbent:[Konkurrenz-Name]`

**Antwort-Entwurf:**
```
Hallo [Interessent-Name],

[Konkurrenz] ist solide — wir sehen sie in etwa 40% der Unternehmen, mit denen wir sprechen. 
Keine Gegenargument dazu.

Hier ist, wo wir uns unterscheiden: Wir sind für [spezifisches Ergebnis, das Konkurrenz nicht priorisiert] gebaut, 
was normalerweise bedeutet [konkreter Vorteil]. Die meisten Teams, mit denen wir gearbeitet haben, hatten [Konkurrenz] 
zunächst parallel laufen, dann schrittweise Workflows rüberziehen.

Frage: Verwaltet dein Team derzeit [spezifischer Prozess, der mit Konkurrenz schmerzhaft ist]? 
Wenn es kein Schmerzpunkt ist, bleibe bei dem, das du hast. Aber wenn es einer ist, 
haben wir eine 30-Tage-Testversion, die völlig risikofrei ist.

Lohnt sich ein kurzes Gespräch? Oder sollte ich in 6 Monaten nachschauen?
```

**CRM-Aktionen:**
- Tagge: `objection`, `objection_type:competitor`, `incumbent:[Konkurrenz-Name]`
- Aufgabe setzen: "Follow-up, falls sie nicht innerhalb 5 Tagen antworten" (sie könnten überdenken)
- Notiz: "Wechselkosten-Besorgnis ist real — Migration Support in nächster Nachricht führen, falls sie ansprechen"

---

### Szenario 4: NEUTRAL-Klassifizierung

**Interessent-Antwort:**
```
Danke für deine Kontaktaufnahme. Sieht interessant aus. Ich schau mir das an und melde mich, 
wenn ich denke, dass es eine Passform ist.

[Interessent-Name]
```

**Klassifizierungs-Ausgabe:**

**Klassifizierung:** NEUTRAL

**Indikatoren:**
- "Sieht interessant aus" (höflich, nicht bindend)
- "Ich schau mir das an" (keine Zeitachse, keine Dringlichkeit)
- Keine angegebene Einschränkung, kein Einwand, kein Anfrage

**SLA:** 24–48 Stunden

**CRM-Tags:** `neutral`, `one_follow_up_scheduled`

**Antwort-Entwurf (sende 1 Tag später):**
```
Hallo [Interessent-Name],

Schnelle Frage: Wenn dein Team [ihren Kernprozess] verwaltet, ist [spezifischer Reibungspunkt relevant zu deiner Lösung] 
etwas, das dir verlangsamt?

Neugierig, ob das auf deinem Radar ist. Wenn nicht, kein Problem — ich werde in 6 Monaten nachschauen, 
wenn sich die Dinge ändern.

Ein Wort zurück und ich bleibe verbunden.
```

**CRM-Aktionen:**
- Tagge: `neutral`
- Setze ein Follow-up nur (geplant 1 Tag von jetzt an)
- Falls keine Antwort 7 Tage nach Follow-up: tagge `deprioritisiert`, Schließe Schleife
- NICHT mehr als einmal loopen

---

Dieses Fähigkeits-System stellt sicher, dass jede Antwort mit Präzision behandelt wird, dass jeder Interessent weiß, was sie erwarten können, und dass keine Energie auf Antworten verschwendet wird, die nicht konvertieren. Verwende den Entscheidungsbaum oben als deine Schnell-Referenz in echtem Outreach.
