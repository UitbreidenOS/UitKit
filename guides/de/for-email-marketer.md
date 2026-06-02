# Claude für E-Mail-Marketer

Alles, was ein E-Mail-Marketer benötigt, um KI-gestützte Kampagnen durchzuführen — Listenpflege, Zustellbarkeit, A/B-Tests, Automatisierungsflows, Texter und Leistungsberichte.

---

## Für wen dieser Leitfaden gedacht ist

Sie sind E-Mail-Marketer, CRM-Manager oder Lifecycle-Marketer, dessen Aufgabe es ist, Kunden durch E-Mail zu gewinnen, zu binden und zu halten. Sie schreiben Kampagnen, verwalten Automatisierungsflows, pflegen die Listengesundheit, führen Split-Tests durch und berichten über die Programmleistung.

**Vor Claude Code:** Von der Kampagnenplanung bis zum Launch: 2–3 Tage. A/B-Test-Analyse: 45 Minuten Tabellenarbeit. Zustellbarkeits-Audit: ein Ticket an den Support Ihres ESP. Monatlicher Bericht: 3 Stunden.

**Danach:** Kampagnenentwurf in 25 Minuten. A/B-Test interpretiert in 5 Minuten. Zustellbarkeits-Audit von Ihnen selbst durchgeführt (kein Ticket nötig). Monatlicher Bericht in 30 Minuten.

---

## Installation in 30 Sekunden

```bash
# Den vollständigen E-Mail-Marketing-Stack installieren
npx claudient add skills marketing/email-sequence
npx claudient add skills small-business/email-campaign
npx claudient add skills marketing/onboarding-cro
npx claudient add skills marketing/analytics-tracking
npx claudient add skills marketing/email-deliverability
npx claudient add skills marketing/email-ab-tester
npx claudient add agents advisors/cmo-advisor
```

---

## Ihr Claude Code E-Mail-Marketing-Stack

### Skills (Slash-Befehle)

| Skill | Was er tut | Wann verwenden |
|---|---|---|
| `/email-deliverability` | Zustellbarkeits-Audit: SPF/DKIM/DMARC, Spam-Auslöser, Listenpflege, Aufwärmplan | Bei sinkenden Öffnungsraten, beim Einrichten einer neuen Domain, vierteljährliches Audit |
| `/email-ab-tester` | A/B-Test-Design, Stichprobengrößenberechnung, Ergebnisinterpretation | Bei jeder Kampagne, bei der Sie Split-Test-Möglichkeiten haben |
| `/email-sequence` | Automatisierte Sequenzen: Willkommen, Nurture, Re-Engagement, Post-Purchase | Beim Aufbau oder der Optimierung automatisierter Flows |
| `/email-campaign` | Einmalige Kampagnentexte, Betreffzeilen, Vorschautexte, CTA | Kampagnenerstellung |
| `/onboarding-cro` | Onboarding-E-Mail-Optimierung — Aktivierungsereignisse, Reibungspunkte | Onboarding-Flows für neue Nutzer/Kunden |
| `/analytics-tracking` | E-Mail-Leistungsanalyse, Attribution, Kohortenanalyse | Wöchentliche und monatliche Berichte |

### Agenten

| Agent | Modell | Wann einsetzen |
|---|---|---|
| `cmo-advisor` | Sonnet | Programmstrategie — Channel-Mix, Segmentierungsstrategie, Budgetallokation |

---

## Täglicher Workflow

### Morgendlicher Kampagnen-Performance-Check (15 Minuten)

Starten Sie jeden Tag mit dem Wissen, was funktioniert:

```
/analytics-tracking

Morgendlicher E-Mail-Programm-Check — [DATUM]:

Gestrige Kennzahlen:
- Versendete Kampagnen: [Liste + jeweiliges Sendevolumen]
- Öffnungsraten: [X%] vs. [X% 30-Tage-Durchschnitt]
- Klickraten: [X%] vs. [X% 30-Tage-Durchschnitt]
- Zugerechneter Umsatz: [$X]
- Abmeldungen: [X] (markieren, wenn > 0,5 % pro Kampagne)
- Spam-Beschwerden: [X] (markieren, wenn > 0,1 %)
- Hard Bounces: [X] (markieren, wenn > 0,5 %)

Automatisierte Flows (24-Stunden-Fenster):
- Willkommens-Sequenz: [versendete E-Mails, durchschnittliche Öffnungsrate]
- Verlassener Warenkorb: [versendete E-Mails, Wiederherstellungsrate]
- Post-Purchase: [versendete E-Mails, durchschnittliche Klickrate]

Markieren Sie alles, was heute Aufmerksamkeit erfordert.
```

---

### Listenverwaltung (10–15 Minuten pro Woche)

**Wöchentlicher Hygiene-Check:**

```
/email-deliverability

Listenhygiene-Check für die Woche [Datum]:

Aktuelle Listenkennzahlen:
- Gesamte aktive Abonnenten: [X]
- Neue Abonnenten diese Woche: [X]
- Abmeldungen diese Woche: [X]
- Hard Bounces diese Woche: [X]
- Soft Bounces (3+): [X]
- Inaktiv > 90 Tage (kein Öffnen): [X]
- Inaktiv > 180 Tage (kein Öffnen): [X]

Import aus neuer Quelle diese Woche: [ja/nein — wenn ja, Quelle und Volumen beschreiben]

Erforderliche Maßnahmen:
- Was sofort unterdrückt werden soll
- Was in Re-Engagement aufgenommen werden soll
- Ob ein aktueller Import verifiziert werden muss
```

---

### E-Mail-Verfassen

**Kampagnen-E-Mail:**

```
/email-campaign

Kampagne: [Name und Ziel]
Zielgruppensegment: [wer, wie viele]
Ziel: [die spezifische Aktion, die sie durchführen sollen]
Angebot oder Schlüsselbotschaft: [was Sie senden — Promotion / Inhalt / Ankündigung]
Markentonalität: [formell / gesprächig / direkt]

Erstellen Sie:
- Betreffzeile (+ A/B-Variante)
- Vorschautext (50 Zeichen)
- E-Mail-Entwurf (mit Kopfzeile, Textkörper, CTA)
- Versandzeitempfehlung für dieses Segment und dieses Ziel
- Mobile-Vorschaunotizen (wie es bei 375px Breite aussieht)
```

**Automatisierte Sequenz-E-Mail:**

```
/email-sequence

Sequenz: [Name — z. B. Willkommens-Sequenz, Post-Purchase, Re-Engagement]
E-Mail-Position: [Tag X, E-Mail N von N]
Was vorher kam: [Zusammenfassung der vorherigen E-Mail]
Ziel dieser E-Mail: [welche Phase der Journey sie bedient]
Segment: [wer sie erhält]

Schreiben Sie diese E-Mail im Kontext der vollständigen Sequenz — beziehen Sie sich auf das, was wir etabliert haben, bauen Sie darauf auf, führen Sie sie zur nächsten Phase.
```

---

### A/B-Test-Arbeit

**Einen neuen Test entwerfen:**

```
/email-ab-tester

Kampagne: [beschreiben]
Was ich testen möchte: [Betreffzeile / CTA / Versandzeit / E-Mail-Länge / Angebotsformulierung]
Verfügbare Listengröße: [X Abonnenten]
Basismetrik, die ich verbessern möchte: [Öffnungsrate X% / Klickrate X% / Conversion X%]
Meine Hypothese: [Format: Wenn/Dann/Weil]

Entwirf den Test: Variable isolieren, Stichprobengröße berechnen, Erfolgskriterien definieren, Entscheidungsregel festlegen.
```

**Ergebnisse interpretieren:**

```
/email-ab-tester

Interpretiere diese Ergebnisse:
Test: [was getestet wurde]
Variante A: [Beschreibung] — [X% Kennzahl] — [N Versendungen]
Variante B: [Beschreibung] — [X% Kennzahl] — [N Versendungen]

Ist dies signifikant? Was soll ich mit diesem Ergebnis machen? Welches Prinzip lehrt es mich?
```

---

## Wöchentlicher Rhythmus

### Montag — Kampagnenplanung

```
/email-campaign

Plane die E-Mails dieser Woche:

Geschäftlicher Kontext: [Gibt es diese Woche Promotionen, Produkt-Launches oder saisonale Ereignisse?]
Zu targetierende Segmente: [Liste der Segmente und ihr letztes Versanddatum]
Ziel für E-Mail-Frequenz: [X E-Mails diese Woche an die Hauptliste, X an Segmente]
Aktive A/B-Tests diese Woche: [Liste — nicht an Testpublikum senden, bis der Test abgeschlossen ist]

Erstellen Sie: Kampagnenkalender für die Woche mit Versanddaten, Segmenten, Zielen und Betreffzeilen-Optionen.
```

### Mittwoch — Automatisierungs-Audit

Wählen Sie jede Woche einen Automatisierungsflow zur Überprüfung aus:

```
/email-sequence

Audit-Modus — [FLOW-NAME]:

Aktuelle Flow-Statistiken:
- E-Mail 1: [Betreffzeile, Öffnungsrate, Klickrate, Abmelderate]
- E-Mail 2: [Betreffzeile, Öffnungsrate, Klickrate]
- [usw.]

Conversion von E-Mail 1 bis zum Zielabschluss: [X%]

Was ist das schwächste Glied in dieser Sequenz? Wo steigen die Leute aus? Was sollte ich testen oder umschreiben?
```

### Freitag — Wöchentlicher Leistungsbericht

```
/analytics-tracking

Wöchentlicher E-Mail-Programmbericht für [Woche]:

Kampagnenkennzahlen:
[Jede Kampagne auflisten: Name, Segment, Öffnungen, Klicks, Umsatz, Abmeldungen]

Automatisierungsflow-Leistung:
[Wichtige Flows auflisten: versendete E-Mails, Öffnungsrate, Conversion-Rate im Vergleich zur Vorwoche]

Listengesundheit:
- Nettoneuabonnenten: [X] (Bruttoneu minus Abmeldungen)
- Listenwachstumsrate: [X%]
- Aktive Engagement-Rate (in den letzten 90 Tagen geöffnet / gesamt): [X%]

Zustellbarkeit:
- Bounce-Rate: [X%]
- Spam-Beschwerderate: [X%]
- Posteingangsplatzierung (falls verfolgt): [X%]

Diese Woche abgeschlossene A/B-Tests: [Ergebnisse und Erkenntnisse]

Erstellen Sie: wöchentliche Zusammenfassung (3 Stichpunkte für die Führungsebene) + detaillierter Abschnitt für meine Unterlagen.
Was muss ich nächste Woche priorisieren?
```

---

## 30-Tage-Einstiegsplan

### Woche 1 — Zustellbarkeits-Grundlagen

- Alle E-Mail-Marketing-Skills installieren
- Ein vollständiges Zustellbarkeits-Audit mit `/email-deliverability` durchführen — Authentifizierung, Listenhygiene, Spam-Werte
- SPF/DKIM/DMARC-Einträge prüfen und eventuelle Lücken sofort schließen
- Ihre Listensegmentierung einrichten: aktiv (< 90 Tage) / leicht aktiv (90–180 Tage) / inaktiv (180+ Tage)
- Nie inaktive mit aktiven Abonnenten mischen, bis Sie eine Re-Engagement-Kampagne durchgeführt haben

### Woche 2 — Automatisierungsüberprüfung

- Ihre Willkommens-Sequenz mit `/email-sequence` prüfen — das ist Ihr Flow mit dem höchsten ROI
- Den einen Automatisierungsflow mit der schlechtesten Abbruchrate identifizieren — ihn neu schreiben
- Ihre Re-Engagement-Sequenz überprüfen (oder eine erstellen, falls keine vorhanden ist)
- Ihr wöchentliches Listenhygiene-Ritual einrichten

### Woche 3 — Test-Programm

- Ihr erstes 90-Tage-A/B-Test-Backlog mit `/email-ab-tester` aufbauen
- Ihren ersten richtig gestalteten A/B-Test starten (Betreffzeile — am einfachsten für den Anfang)
- Ihre statistische Signifikanz-Entscheidungsregel festlegen, bevor Sie sich die Ergebnisse ansehen
- Ihre erste "E-Mail-Erkenntnisse"-Notiz dokumentieren (Prinzipien, gegen die Sie testen werden)

### Woche 4 — Berichterstattung und Optimierung

- Ihre wöchentliche Leistungsberichtsvorlage einrichten
- Die letzten 3 Monate der Kampagnen überprüfen: Welche Segmente, Betreffzeilen und Versandzeiten funktionieren am besten?
- Ihren ersten Programmgesundheitsbericht Ihrem Manager präsentieren
- Den einen Automatisierungsflow identifizieren, der bei einer Verbesserung um 20 % den größten Umsatzeffekt hätte

---

## Tool-Integrationen

### Klaviyo (Lifecycle-E-Mail)

```json
{
  "mcpServers": {
    "klaviyo": {
      "command": "npx",
      "args": ["-y", "@klaviyo/mcp-server"],
      "env": {
        "KLAVIYO_API_KEY": "your-private-api-key"
      }
    }
  }
}
```

Mit verbundenem Klaviyo: Segmentdaten, Flow-Analytics und Listengesundheit direkt in Claude Code.

### HubSpot (B2B-E-Mail)

```json
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "your-token"
      }
    }
  }
}
```

### Mailchimp / Brevo / Postmark

Kampagnenberichte als CSV exportieren → in `/analytics-tracking` für Trendanalyse und Benchmarking einfügen.

### Google Postmaster Tools

Kostenloses Tool von Google — verbinden Sie Ihre Versanddomain und überwachen Sie Domain-Reputation, Spam-Raten und Posteingangsplatzierung für Gmail-Empfänger. Wöchentlich als Teil Ihrer Zustellbarkeits-Überprüfung prüfen.

### Litmus / Email on Acid

Darstellungs-Vorschau über verschiedene Clients → Probleme in `/email-campaign` für schnelle HTML-Korrekturen einfügen.

---

## Kennzahlen zum Verfolgen

| Kennzahl | Ziel | Warnsignal |
|---|---|---|
| Öffnungsrate | > 25 % (je nach Branche variabel) | < 15 % |
| Klickrate | > 2 % | < 1 % |
| Click-to-Open-Rate (CTOR) | > 10 % | < 6 % |
| Abmelderate (pro Kampagne) | < 0,2 % | > 0,5 % |
| Spam-Beschwerderate | < 0,05 % | > 0,1 % (Google sperrt bei 0,1 %) |
| Hard-Bounce-Rate | < 0,5 % | > 1 % |
| Listenwachstumsrate | Positiv Monat für Monat | 2+ Monate rückläufig |
| Aktive Engagement-Rate | > 40 % der Liste | < 25 % |
| Willkommens-E-Mail-Öffnungsrate | > 50 % | < 35 % |
| Automatisierungsflow-Conversion | Abhängig vom Flow — Ziel pro Flow festlegen | Unter dem gesetzten Ziel für 60+ Tage |

Hinweis: Apple Mail Privacy Protection bläht Öffnungsraten für iOS-Nutzer auf (als "geöffnet" markiert, wenn vorgeladen). Behandeln Sie Klickrate und CTOR als Ihre primären Engagement-Kennzahlen für iOS-lastige Listen.

---

## Häufige Fehler und wie Claude Code hilft, sie zu vermeiden

**Fehler 1: E-Mails an inaktive Abonnenten senden ohne vorherige Re-Engagement-Kampagne**
Dies ist der schnellste Weg, die Zustellbarkeit zu ruinieren. Inaktive Abonnenten, die sich nicht engagieren, signalisieren Anbietern, dass Sie Spam versenden — sie bestrafen Ihre gesamte Domain. Führen Sie zuerst eine Sunset-Kampagne durch.

**Fehler 2: A/B-Test-Gewinner auf Basis von 6 Stunden Daten erklären**
`/email-ab-tester` berechnet, ob Ihr Ergebnis statistisch signifikant ist. Wenn nicht, ist es Rauschen — kein Gewinner.

**Fehler 3: Kein DMARC-Eintrag für Ihre Versanddomain**
`/email-deliverability` erkennt dies beim ersten Audit. Ohne DMARC ist Ihre Domain anfällig für Spoofing und Anbieter vertrauen ihr weniger.

**Fehler 4: Willkommens-E-Mails als einmalige Versendung schreiben**
`/email-sequence` entwirft Willkommens-Serien mit 3–5 E-Mails. Eine einzelne Willkommens-E-Mail ist eine verpasste Aktivierungsmöglichkeit.

**Fehler 5: Betreffzeilen testen ohne Hypothese**
`/email-ab-tester` erfordert eine Hypothese, bevor der Test entworfen wird. "Verschiedene Betreffzeilen testen" ist keine Hypothese — es ist zufällige Variation, die Ihnen nichts beibringt, selbst wenn Sie gewinnen.

---

## Ressourcen

- [Erste Schritte mit Claude Code](./getting-started.md)
- [E-Mail-Zustellbarkeits-Skill](../skills/marketing/email-deliverability.md)
- [E-Mail-A/B-Tester-Skill](../skills/marketing/email-ab-tester.md)
- [E-Mail-Sequenz-Skill](../skills/marketing/email-sequence.md)
- [E-Mail-Kampagnen-Workflow](../workflows/email-campaign.md)
- [CMO-Berater-Agent](../agents/advisors/cmo-advisor.md)

---

> **Arbeiten Sie mit uns:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
