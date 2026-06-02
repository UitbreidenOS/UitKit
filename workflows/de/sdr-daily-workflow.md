# SDR täglicher Arbeitsablauf

## Wann ausführen
Täglich an Werktagen um 8:00 Uhr. Konzipiert für einen 4,5-stündigen strukturierten Arbeitstag (8:00–12:15 Uhr, kurze Wiederaufnahme um 16:45–17:00 Uhr). Manuell oder über geplanten Hook für tägliche Automatisierung starten.

## Erforderliche Eingaben
- **Tier-1- und Tier-2-Kontolisten**: CRM-Export oder Tabellenkalkulation mit Kontonamen und wichtigen Kontakten
- **Status der Vortagessequenz**: aktive Konten, Stufe und Antwortverlauf
- **Signalquellen**: aktuelle LinkedIn-Updates, Finanzierungsankündigungen, Stellenausschreibungen, Nachrichtenfeeds für Zielkonten
- **E-Mail-Vorlagen und -Rahmen**: Short-Trigger-Vorlage, Multi-Touch-Sequenzvorlagen
- **CRM-Verbindung**: Zugriff auf Kontaktdatensätze aktualisieren und Folgaufgaben erstellen
- **Anrufnotizen** (falls zutreffend): alle Antworten über Nacht oder Sprachnachrichten, die klassifiziert werden müssen

## Schritte

### Schritt 1: Morgenliche Signalübersicht (30 min, 8:00–8:30 Uhr)

**Claude-Aufgabe:**
„Überprüfen Sie meine Tier-1- und Tier-2-Kontolisten auf neue Signale. Prüfen Sie auf: neue Führungshirektoren-Einstellungen, Finanzierungsankündigungen, Tech-Stack-Änderungen, LinkedIn-Aktivität von Zielkontakten, Stellenausschreibungen in Zielabteilungen. Markieren Sie hochpriorisierte Signale und empfehlen Sie Maßnahmen pro Konto."

**Eingabe:** Kontoliste (Unternehmensnamen, Zielkontakte), Signalquellen (LinkedIn, Crunchbase, interne Nachrichten)

**Entscheidungspunkte:**
- Signalstärke: Ist dies ein starker Auslöser für Outreach? (Ja = Tier-1-Priorität, Vielleicht = Tier-2, Nein = überspringen)
- Kontaktverfügbarkeit: Ist der Zielentscheidungsträger noch die richtige Person? Aktualisieren, wenn es einen neuen Mitarbeiter gibt.

**Ausgabe:** Priorisierte Signalliste (5–15 Konten) mit:
- Kontoname
- Signaltyp (z. B. „Neuer VP of Sales eingestellt", „Series-B-Finanzierung angekündigt")
- Name des Zielkontakts + aktuelle Rolle
- Empfohlener Hook (z. B. „Glückwunsch zur Einstellung + Erwähnung relevanter Fähigkeit")
- Prioritätsstufe (Hoch/Mittel)

**Erfolgskriterien:** Liste enthält nur Konten mit umsetzbaren Signalen; keine veralteten Leads.

---

### Schritt 2: Kontosuchsprint (60 min, 8:30–9:30 Uhr)

**Claude-Aufgabe:**
„Recherchieren Sie für jedes hochgradig signalisierte Konto aus Schritt 1 und erstellen Sie ein Dossier. Format: Unternehmensübersicht, Entscheidungsträger-Karte (Fokus auf Organigramm), die 3 wichtigsten Schmerzpunkte-Signale, empfohlener Personalisierungs-Hook. Verwenden Sie LinkedIn, Website des Unternehmens, aktuelle Nachrichten und Stellenausschreibungen."

**Eingabe:** Priorisierte Signalliste aus Schritt 1, Unternehmensforschungstools (LinkedIn, Crunchbase, G2, Unternehmenswebsites)

**Entscheidungspunkte:**
- Ist das Unternehmen eine gute Anpassung für unsere Lösung? (Ja = fortfahren, Nein = Depriorität)
- Können Sie 2+ Entscheidungsträger identifizieren oder nur das Anfangsziel? (Mehrere = höheres Vertrauen)
- Was ist das stärkste Schmerzpunkte-Signal für dieses Unternehmen? (Tech-Schulden, Skalierung, Wettbewerbsdruck, usw.)

**Ausgabe:** Unternehmens-Dossier pro Konto (1–2 Seiten jeweils):
```
[Unternehmensname]

**Übersicht**
- Branche, Größe, Finanzierungsstufe, Wachstumsrate
- Derzeitiger Produkt-/Dienstleistungsfokus
- Aktuelle Ankündigungen oder Nachrichten

**Entscheidungsträger-Karte**
- CEO / Gründer: [Name, LinkedIn]
- VP of [Relevante Funktion]: [Name, LinkedIn]
- [Andere Influencer]: [Namen, Rollen]

**Die 3 wichtigsten Schmerzpunkte-Signale**
1. [Schmerzpunkt-Signal + Beweise aus Stellenausschreibung / LinkedIn / Nachrichten]
2. [Schmerzpunkt-Signal + Beweise]
3. [Schmerzpunkt-Signal + Beweise]

**Empfohlener Personalisierungs-Hook**
[Spezifischer, konkreter Grund zum Kontaktieren, verbunden mit Signal + unserer Lösung]
```

**Erfolgskriterien:** Jedes Dossier ist zu 80 % vollständig; Sie haben klare nächste Schritte für Outreach.

---

### Schritt 3: Outreach-Batch (90 min, 9:30–11:00 Uhr)

**Claude-Aufgabe:**
„Schreiben Sie E-Mail 1 (Betreffzeile + Text) für jeden Zielprospekt unter Verwendung des Short-Trigger-Rahmens. Halten Sie den Text unter 50 Wörtern. Schreiben Sie dann Sequenzschritte 2–4 für Konten, die sich bereits in aktiven Sequenzen befinden (bei 3-, 7-, 12-Tage-Kadenz)."

**Eingabe:** Unternehmens-Dossiers aus Schritt 2, E-Mail-Vorlagen, Short-Trigger-Rahmen, aktive Sequenzliste aus CRM

**Entscheidungspunkte:**
- Ist dies ein neues Outreach (E-Mail 1) oder eine Folgemaßnahme in einer aktiven Sequenz? (Pfade unterscheiden sich)
- Hat dieser Prospect bereits geantwortet? (Ja = Sequenzierung überspringen, zu Schritt 4 wechseln)
- Sollten wir einen Anruf, Video oder E-Mail als Schritt 2 verwenden? (Hängt von Engagement-Signalen ab)

**Ausgabe:**
1. **E-Mail 1 (Neues Outreach)** für jeden Zielkontakt:
   - Betreffzeile (unter 10 Wörter, Referenz zum Signal)
   - Text (unter 50 Wörter, Short-Trigger-Rahmen: Kontext + Problem + Call-to-Action)
   - Anlagen-/Asset-Empfehlung (falls zutreffend)

2. **Sequenzschritte 2–4** für aktive Sequenzen:
   - Folgemaßnahme Tag 3: [E-Mail oder Aufgabentyp]
   - Folgemaßnahme Tag 7: [E-Mail, Sprachanruf oder LinkedIn-Engagement]
   - Folgemaßnahme Tag 12: [E-Mail oder abschließender Kontakt, möglicherweise Pivot zum neuen Signal]

**Erfolgskriterien:** E-Mails sind personalisiert, unter 50 Wörter und referenzieren das Signal. Sequenzen folgen Kadenz und Eskalationslogik.

---

### Schritt 4: Folgemaßnahmen-Block (45 min, 11:00–11:45 Uhr)

**Claude-Aufgabe:**
„Klassifizieren Sie alle nächtlichen Antworten und Sprachnachrichten. Sortieren Sie sie: (1) Positives Engagement, (2) Klärungsbedarf, (3) Nicht interessiert, (4) Spam. Verfassen Sie Antworten auf hochpriorisierte Antworten. Treffen Sie für jeden warmen Lead eine Entscheidung: E-Mail, Anruf heute oder Sequenz fortsetzen?"

**Eingabe:** Nächtliche E-Mail-/Slack-Antworten, Sprachnotiz-Transkripte, aktive Prospect-Liste aus CRM

**Entscheidungspunkte:**
- Antworttonalität: Positiv (heute antworten), neutral (klären + Sequenz), negativ (protokollieren + weitergehen)
- Anrufbereitschaft: Ist dieser Prospect bereit für einen Anruf? (Starke Signale = ja)
- Sequenzfortsetzung: Sollten wir die Sequenz fortsetzen oder zu einem anderen Hook pivotieren?

**Ausgabe:**
1. **Klassifizierungstabelle für Antworten:**
   - Prospect-Name | Unternehmen | Antwortinhalt | Kategorie | Empfohlene Aktion | Dringlichkeit
2. **Entworfene Antworten** für Kategorien 1 & 2 (bereit zum Senden oder Anpassen)
3. **Anrufliste** für heute mit Gesprächspunkten

**Erfolgskriterien:** Alle Antworten klassifiziert; warme Leads erhalten am selben Tag Aufmerksamkeit; keine Leads fallen durchs Raster.

---

### Schritt 5: CRM-Aktualisierung (11:45 Uhr–12:15 Uhr)

**Claude-Aufgabe:**
„Konvertieren Sie Anrufnotizen, E-Mail-Versand und Antworten in strukturierte CRM-Aktualisierungen. Für jeden Kontakt: Datum der letzten Aktivität aktualisieren, Anrufergebnis hinzufügen (falls zutreffend), Folgaufgaben mit Fälligkeitsdaten erstellen, Opportunity-Stufe aktualisieren, Signale protokollieren."

**Eingabe:** Anrufnotizen aus Schritt 4, E-Mail-Versandlog aus Schritt 3, Antwortklassifizierung aus Schritt 4, aktuelle CRM-Einträge

**Entscheidungspunkte:**
- Sollte dieser Lead in eine neue Opportunity-Stufe wechseln? (Qualifiziert → Im Gespräch, usw.)
- Was ist die nächste Aufgabe und wann ist sie fällig? (Heute, morgen, in 3 Tagen?)
- Sollten wir einen neuen Kontakt oder ein neues Unternehmen zur Datenbank hinzufügen?

**Ausgabe:**
1. **CRM-Massenaktualisierungsanweisungen** (bereit zum Einfügen in Ihr CRM):
   - Kontaktname | Aktivitätstyp | Aktivitätsdatum | Ergebnisnotizen | Nächste Aufgabe | Fälligkeitsdatum | Opportunity-Stufe
2. **Neue Kontakt-/Unternehmenshingzufügungen** (falls zutreffend)
3. **Zusammenfassung der Folgaufgaben** (Anzahl der pro Person erstellten Aufgaben)

**Erfolgskriterien:** Alle Aktivitäten protokolliert; kein doppeltes Arbeiten; Folgaufgaben sind spezifisch und mit Fälligkeitsdatum versehen.

---

### Schritt 6: Überprüfung am Ende des Tages (15 min, 16:45–17:00 Uhr)

**Claude-Aufgabe:**
„Fassen Sie die heutigen Metriken und die Prioritäten von morgen zusammen. Wie viele neue Konten habe ich hinzugefügt? Wie viele Sequenzen sind aktiv? Welche Signale muss ich morgen überprüfen? Muss ich meine Zielkontoliste anpassen?"

**Eingabe:** CRM-Dashboard-Snapshot, Signalquellen, aktive Sequenzzahl, heutige Workflow-Ergebnisse

**Entscheidungspunkte:**
- Sind wir auf Kurs für Wochen-/Monatsziele? (Ja = beibehalten, Nein = eskalieren)
- Sollten wir Konten aus unseren Tier-1/2-Listen hinzufügen oder entfernen? (Kalte Leistungsdaten)
- Haben wir genug hochgradig signalisierte Konten für morgen oder müssen wir neue Konten suchen?

**Ausgabe:**
1. **Tägliche Metriken:**
   - Neue Konten hinzugefügt
   - Neue Sequenzen gestartet
   - Erhaltene Antworten + Antwortquote %
   - Gebuchte Anrufe / geplante Besprechungen
   - Aktive Sequenzen (laufender Gesamtwert)

2. **Prioritäten für morgen:**
   - Zu recherchierende Konten
   - Folgemaßnahmen bei bestehenden Sequenzen
   - Zu überwachende Signale
   - Alle dringenden Anrufe oder Folgemaßnahmen

3. **Wochentrend** (falls es Freitag ist):
   - Insgesamt berührte Konten
   - Konversionsrate (Sequenz → Besprechung)
   - Best-performing-Signale
   - Empfehlungen für nächste Woche

**Erfolgskriterien:** Metriken sind genau; Prioritäten sind klar; Sie können morgen mit null Anlaufzeit starten.

---

## Ausgabe

Eine vollständige SDR-Tagesausführung, die Folgendes produziert:

1. **Morgenliche Signalliste** (Schritt 1): 5–15 priorisierte Konten, bereit zur Recherche
2. **Unternehmens-Dossiers** (Schritt 2): Vollständige Recherche + Entscheidungsträger-Karte + Schmerzpunkte-Signale für jedes Konto
3. **Outreach-E-Mails** (Schritt 3): E-Mail 1 + Sequenzschritte 2–4, bereit zum Einreihen
4. **Antwortklassifizierung** (Schritt 4): Alle nächtlichen Antworten sortiert + warme Leads mit entworfenen Antworten
5. **CRM-Aktualisierungen** (Schritt 5): Massenaktivitätsprotokoll + Folgaufgaben, bereit zum Hochladen
6. **Täglicher Snapshot** (Schritt 6): Metriken + Agenda für morgen

**Zeitzuweisung:**
- Block 1 (Signalübersicht): 30 min
- Block 2 (Recherche): 60 min
- Block 3 (Outreach-Batch): 90 min
- Block 4 (Folgemaßnahmen): 45 min
- Block 5 (CRM-Aktualisierung): 30 min
- Block 6 (Ende des Tages): 15 min
- **Gesamt: 4,5 Stunden** (8:00 Uhr–12:15 Uhr, + 15 min um 16:45–17:00 Uhr)

---

## Beispiel

**Tag: Montag, 2. Juni 2026**

### Schritt 1: Morgenliche Signalübersicht (8:00–8:30 Uhr)

Benutzer liefert:
- Tier-1-Kontoliste: Acme Corp, BuildCo, DataDrive Inc, TechScale Ltd
- Signalquellen: LinkedIn-Feed, Crunchbase-E-Mail, Stellenmarkt

**Claude identifiziert:**
1. **Acme Corp** — Neuer VP of Sales eingestellt (LinkedIn-Post, vor 2 Tagen) → **HOCH**
2. **BuildCo** — Series-B-Finanzierung $15M angekündigt → **HOCH**
3. **DataDrive Inc** — Einstellung von 3 Datentechnikern (Stellenausschreibungen auf LinkedIn) → **MITTEL**
4. **TechScale Ltd** — Neue Produkteinführung auf ihrem Blog angekündigt → **MITTEL**

**Ausgabe:**
```
SIGNALPRIORISIERUNGSLISTE — Montag, 2. Juni

🔴 HOCHPRIORISIERT
1. Acme Corp | Signal: Neuer VP of Sales (vor 2 Tagen) | Kontakt: TBD (Recherche) | Hook: Glückwunsch zur Einstellung + unsere Sales-Effizienzplattform
2. BuildCo | Signal: Series B $15M | Kontakt: Vorhandener CEO-Kontakt | Hook: Hilf ihnen, Sales Ops nach der Finanzierung zu skalieren

🟡 MITTELPRIORISIERT
3. DataDrive Inc | Signal: Einstellung von 3 Datentechnikern | Kontakt: Einstellungsmanager TBD | Hook: Datateam-Skalierung = Infrastruktur-Herausforderungen
4. TechScale Ltd | Signal: Neue Produkteinführung | Kontakt: Vorhandener Produktleiter | Hook: Marktreaktion analysieren + Verkaufsstrategie
```

---

### Schritt 2: Kontosuchsprint (8:30–9:30 Uhr)

Benutzer liefert: LinkedIn-Profile, Unternehmenswebsites, Crunchbase-Links

**Claude erstellt Dossiers:**

```
ACME CORP

**Übersicht**
- Branche: B2B-SaaS (Sales-Enablement)
- Größe: 150 Mitarbeiter
- Finanzierung: Series A ($8M, 2023)
- Aktuell: Neuer VP of Sales eingestellt (30. Mai 2026)

**Entscheidungsträger-Karte**
- CEO: Jane Smith (LinkedIn: /in/janesmith) — gründete Unternehmen
- VP of Sales: Michael Johnson (LinkedIn: /in/mjohnson) — NEUE EINSTELLUNG
- CRO-Rolle: TBD (erstellt wahrscheinlich VP-Sales-Rolle für Wachstum)

**Die 3 wichtigsten Schmerzpunkte-Signale**
1. Neue Sales-Führung → Vertriebsteam expandiert, benötigt Infrastruktur/Tools
2. Series-A vor 2+ Jahren finanziert → plant wahrscheinlich Series B, muss Umsatz skalieren
3. 150 Menschen → bewegt sich in Scale-up-Phase, Sales Ops wird kritisch

**Empfohlener Hook**
„Hallo Michael, sah, dass du als VP of Sales bei Acme eingestiegen bist — Glückwunsch! Sales Ops ist brutal während der Einarbeitung. Wir helfen Teams wie dir, Onboarding von 60 auf 30 Tage zu komprimieren. Kurzer Anruf diese Woche?"
```

```
BUILDCO

**Übersicht**
- Branche: DevOps-Infrastruktur
- Größe: 45 Mitarbeiter
- Finanzierung: Series B ($15M, 1. Juni 2026) — GERADE ANGEKÜNDIGT
- Wachstumsrate: 3x YoY (pro Crunchbase)

**Entscheidungsträger-Karte**
- CEO: Alex Chen (vorhandener Kontakt, engagiert)
- VP of Product: Sarah Lee (LinkedIn: /in/sarahlee)
- VP of Sales: [Noch nicht eingestellt — Wachstumsgelegenheit]

**Die 3 wichtigsten Schmerzpunkte-Signale**
1. Series-B-Finanzierung → 3x Headcount-Wachstum erwartet, Verkauf wird explodieren
2. 45 → ~150 Menschen in 12 Monaten → massive Skalierungs-Herausforderung
3. Product-Led-Growth wahrscheinlich → benötigt Sales-Infrastruktur, um Inbound zu konvertieren

**Empfohlener Hook**
„Alex, Glückwunsch zur Series-B-Schließung von BuildCo! Mit 3x Wachstum vor dir wird dein Sales Ops zum Engpass. Lass uns einen Kaffee trinken und darüber sprechen, wie man häufige Skalierungsfehler vermeidet."
```

---

### Schritt 3: Outreach-Batch (9:30–11:00 Uhr)

Benutzer reiht E-Mails zum Versand ein

**Claude erstellt:**

```
E-MAIL 1 — Acme Corp / Michael Johnson (NEUES OUTREACH)

Betreff: Sales Ops für Acmes nächste Phase

Text:
Hallo Michael,

Glückwunsch zur VP-Rolle. Sales-Teams skalieren am schnellsten, wenn Ops Schritt hält.

Wir komprimieren Onboarding von 60 auf 30 Tage. Ein kurzer Anruf wert?

Beste Grüße,
[Name]
[Dein Unternehmen]

---

E-MAIL 1 — BuildCo / Alex Chen (NEUES OUTREACH)

Betreff: BuildCos Post-Series-B-Operationen

Text:
Alex,

Sah die Series-B-Schließung. Glückwunsch. 3x Wachstum bedeutet, dass Sales Ops dein Engpass ist.

15 min diese Woche?

Beste Grüße,
[Name]
[Dein Unternehmen]

---

SEQUENZSCHRITTE 2–4 (Beispiel: DataDrive Inc Prospect bereits in Sequenz, Tag 1 versendet)

Tag-3-Folgemaßnahme: E-Mail
Betreff: Kurzer Gedanke zu Einstellungen

Text: „Hallo [Name], Folge auf meine E-Mail von Dienstag auf. Während du dein Datateam skalierst, wird Verkauf kritisch. Die meisten Teams scheitern hier. Lass uns sicherstellen, dass du das nicht tust. Kurzer Anruf?"

Tag-7-Folgemaßnahme: LinkedIn-Engagement
Aktion: Kommentiere ihren aktuellen Einstellungs-Post + sende Nachricht: „Sah deine Teamwachstumspläne. Lass uns über die Operationalisierung von Verkauf für Datateams synchronisieren."

Tag-12-Folgemaßnahme: E-Mail (abschließender Kontakt)
Betreff: Letzter Gedanke

Text: „Hallo [Name], Ich bleibe nach dieser Nachricht aus deinem Posteingang weg. Aber wenn du jemals über die Skalierung von Verkauf ohne Chaos sprechen möchtest, weißt du, wo du mich findest."
```

---

### Schritt 4: Folgemaßnahmen-Block (11:00–11:45 Uhr)

Benutzer liefert nächtliche Antworten (Beispiel):

**Claude klassifiziert:**

```
KLASSIFIZIERUNG NÄCHTLICHER ANTWORTEN

Prospect: John Doe (BuildCo)
Antwort: „Hey, das sieht interessant aus. Kannst du einen Demo-Link senden?"
Kategorie: 1 — Positives Engagement
Aktion: Demo-Link senden + heute anrufen
Dringlichkeit: HOCH

Prospect: Sarah Chen (Acme Corp)
Antwort: „Schätze den Hinweis. Wir suchen gerade nicht, Tools zu wechseln."
Kategorie: 3 — Nicht interessiert
Aktion: Protokollieren, nicht folgen; in 90 Tagen erneut besuchen
Dringlichkeit: NIEDRIG

Prospect: Mike Peters (DataDrive Inc)
Antwort: „Was ist eure Preisgestaltung?"
Kategorie: 2 — Klärungsbedarf
Aktion: Preisgestaltung + Wertversprechen in E-Mail klären + Anruf anbieten
Dringlichkeit: MITTEL

---

ENTWORFENE ANTWORT FÜR HOCHPRIORISIERTE ANTWORTEN

An: John Doe (BuildCo)
Betreff: Re: Demo-Link

Hallo John,

Hier ist die Demo: [Link]. Es ist eine 15-Minuten-Anleitung; die meisten Leute schauen mit 2x Geschwindigkeit.

Kostenloser 30-Min-Anruf diese Mittwoch oder Donnerstag?

Beste Grüße,
[Name]

---

ANRUFLISTE FÜR HEUTE
1. John Doe (BuildCo) — Demo versendet, heißer Lead
   Gesprächspunkte: Seine Rolle, Zeitrahmen für Sales-Skalierung, aktuelle Tool-Schmerzpunkte
```

---

### Schritt 5: CRM-Aktualisierung (11:45 Uhr–12:15 Uhr)

**Claude erstellt Massen-CRM-Aktualisierung:**

```
CRM-MASSENAKTUALISIERUNG — Montag, 2. Juni

Kontaktname | Aktivitätstyp | Datum | Notizen | Nächste Aufgabe | Fälligkeitsdatum | Opportunity-Stufe
John Doe | E-Mail versendet | 2.6. | Demo-Link versendet | Anruf | 2.6. | Im Gespräch
Michael Johnson | E-Mail versendet | 2.6. | VP-Neulingsoutreach | Folgemaßnahme | 5.6. | Prospect
Alex Chen | E-Mail versendet | 2.6. | Series-B-Glückwünsche | Anruf | 3.6. | Prospect
Sarah Chen | E-Mail erhalten | 2.6. | Jetzt nicht interessiert | Erneut besuchen | in 90 Tagen | Nicht qualifiziert
Mike Peters | E-Mail erhalten | 2.6. | Preisgestaltungsfrage | In E-Mail klären | 2.6. | Im Gespräch

---

NEUE FOLGAUFGABEN ERSTELLT
- John Doe: Anruf (heute, 14:00 Uhr) — BuildCo-Demo-Folgemaßnahme
- Mike Peters: Preisgestaltungs-E-Mail senden (heute, 13:00 Uhr) — auf Anfrage antworten
- Alex Chen: Anruf (Mittwoch, 9:00 Uhr) — Series-B-Debriefing
- Michael Johnson: E-Mail-Folgemaßnahme (Donnerstag, 8:00 Uhr) — Interessensniveau überprüfen
```

---

### Schritt 6: Überprüfung am Ende des Tages (16:45–17:00 Uhr)

**Claude erstellt:**

```
TÄGLICHE METRIKEN — Montag, 2. Juni

✅ Berührte Konten: 4
✅ Gestartete neue Sequenzen: 2 (Acme Corp, BuildCo)
✅ Erhaltene Antworten: 3 (Antwortquote: TBD, kleine Stichprobe)
✅ Gebuchte Anrufe: 1 (John Doe, heute 14:00 Uhr)
✅ Laufende aktive Sequenzen: 7

---

PRIORITÄTEN FÜR MORGEN (Dienstag, 3. Juni)

🔴 HEUTIGE DRINGENDE AUFGABEN
- Ruf John Doe heute um 14:00 Uhr an (Demo-Folgemaßnahme)
- E-Mail an Mike Peters vor Tagesende (Preisgestaltungsklärung)

🟡 DIENSTAG-AGENDA
- 3 neue hochgradig signalisierte Konten recherchieren (Signalübersicht erneut ausführen)
- Tag-7-Folgemaßnahmen bei 2 bestehenden Sequenzen durchführen
- Alex Chen anrufen (Series-B-Debriefing) — 9:00 Uhr
- Antworten überwachen, am selben Tag antworten

🟢 WOCHENAUSBLICK
- 15–20 neue Konten zu recherchieren
- 3–4 Anrufe gebucht ideal
- 2–3 Besprechungen bis Freitag geplant
- Fortlaufend täglich um 8:00 Uhr starten, um Konsistenz zu wahren
```

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**

📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
