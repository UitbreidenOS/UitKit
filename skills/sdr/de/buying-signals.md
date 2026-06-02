# Kaufsignale

## Wann aktivieren

Beim Prospecting von B2B-SaaS entscheiden Sie, ob und wann Sie ein Zielunternehmen kontaktieren. Aktivieren Sie diese Fähigkeit, wenn Sie folgende Bedingungen erfüllen:
- Ein Unternehmen als Fit identifiziert haben (Unternehmensgröße, Branche, Tech-Stack passen)
- Zugang zu Signal-Erkennungstools haben (LinkedIn, Crunchbase, Job-Boards, BuiltWith, G2, News-APIs)
- Die Absicht haben, die Reply-Rate beim ersten Kontakt und die Konversionswahrscheinlichkeit zu maximieren
- Eine mehrsignalgestützte Überwachungskadenz durchführen (tägliche oder wöchentliche Überprüfungen warmer Konten)

Diese Fähigkeit ist für SaaS, PaaS, B2B Fintech und Enterprise Software optimiert. Funktioniert am besten bei Unternehmen mit 50+ Mitarbeitern (genug Signale zum Erkennen, genug Budget zum Abschluss).

## Wann NICHT verwenden

- Nicht auf B2C oder Einzelgründer-Unternehmen anwenden – Signale sind zu spärlich und Kaufkomitees existieren nicht
- Nicht verwenden, wenn Sie keine zuverlässigen Erkennungstools haben (LinkedIn Premium, BuiltWith, Job-Board-Zugang)
- Nicht auf Inbound-Sales-Outreach anwenden, wo Sie bereits eine warme Einführung oder direkten Kontakt haben – nutzen Sie stattdessen "Beziehung zuerst, Signal zweiter"
- Nicht als deterministisch behandeln – Signale sind probabilistisch, keine Gewissheiten; immer mit Recherche validieren
- Signal-Verfall nicht ignorieren; eine Finanzierungsrunde von vor 8 Monaten hat null Vorhersagekraft
- Nicht auf einzelne Signale allein auslösen, es sei denn, die Signal-Rangfolge ist 1 oder 2; warten Sie auf Stacking (2+ Signale) bei Cold Outreach für die Ränge 3–6

## Anweisungen

### Die 6 Kaufsignale, nach Kaufkorrelation geordnet

**Signal 1: Ehemaliger Kunde jointet neues Unternehmen**
- **Rangfolge:** 1 (höchste Korrelation, ~35% Reply-Rate vs. 3,4% Baseline)
- **Warum es wichtig ist:** Sie verfügen über nachgewiesenes Produktwissen, verstehen den ROI und haben oft Budgetautorität beim neuen Unternehmen
- **Erkennungsmethode:**
  - LinkedIn "People Also Viewed" bei Ihren Kundenkontakten
  - LinkedIn Sales Navigator: Job-Wechsel-Warnmeldungen bei früheren Käufer-Profilen
  - Company Exit Tracking über Crunchbase (wenn Mitarbeiter massenweise wechseln)
  - Manuelle Überprüfung: Scannen Sie monatlich die LinkedIn-Profile von Kunden nach "neues Unternehmen"-Aktivität
- **Verfallsfenster:** 90 Tage maximal. Nach 90 Tagen verblasst ihre ursprüngliche Autorität und Mandatierung; neu priorisieren nach Rollenänderung
- **Ideales First-Touch-Timing:** Innerhalb von 14 Tagen nach ihrem Jobwechsel (bevor sie bereits Alternativen gekauft haben)
- **Verifizierung:** Bestätigen Sie, dass sie bei der alten Firma Kaufeinfluss hatten (Jobtitel, Salesforce-Rolle, Budgetverantwortlicher-Flag)
- **Trigger-Nachricht-Formel:**
  ```
  [Signal explizit nennen] "Ich sehe, dass Sie gerade zu [Unternehmen] als [Rolle] gewechselt haben"
  [Warum es wichtig ist] "Wenn Leute zu einer neuen Org wechseln, beheben sie zuallererst [häufiges Abteilungsproblem]"
  [Eine offene Frage] "Suchen Sie nach [Tool-Kategorie], um [spezifische Schmerzen] zu lösen, oder ist das noch keine Priorität?"
  ```
- **Reply-Rate-Anstieg:** +35% vs. 3,4% Baseline
- **Beispiel-Trigger:** "Ich sehe, dass Sie gerade zu Acme als VP für Betrieb gewechselt haben. Wenn Ops-Manager das Unternehmen wechseln, wollen sie normalerweise ihren Analytics-Stack aufräumen. Überlegen Sie, [aktuelles Tool] zu ersetzen, oder steht das auf der Roadmap?"

---

**Signal 2: Neue C-Suite oder VP-Führung eingestellt in den letzten 90 Tagen**
- **Rangfolge:** 2 (zweithöchste Korrelation, ~28% Reply-Rate)
- **Warum es wichtig ist:** Neue Führungskräfte müssen sich schnell beweisen (100-Tage-Mandat); sie sind offen für Vendor-Gespräche und haben Budget für schnelle Erfolge
- **Erkennungsmethode:**
  - LinkedIn-Unternehmensseite: Überprüfen Sie den Abschnitt "Aktuelle Einstellungen" auf C-Level oder VP-Level Rollen
  - Crunchbase: Verfolgung von Führungswechseln über den "People"-Tab
  - Unternehmens-Pressemitteilungen (News-API oder manuelle Überprüfung)
  - Job-Board-API: Filtern Sie nach C-Level/VP-Postings auf Zielkonten
  - LinkedIn Sales Navigator: Richten Sie eine Benachrichtigung ein auf "[Unternehmen] hat neuen [C-Suite/VP] eingestellt"
- **Verfallsfenster:** 90 Tage. Nach Tag 90 wird der Mandatsdruck schwächer; sie befinden sich im stabilen Zustand
- **Ideales First-Touch-Timing:** Innerhalb von 30 Tagen nach der Einstellungsankündigung (Tag 1–30 = höchste Dringlichkeit)
- **Verifizierung:** Bestätigen Sie Rolle und Berichtslinie (muss direkte P&L-Besitzer oder funktionaler VP sein, nicht Stabsstelle)
- **Trigger-Nachricht-Formel:**
  ```
  [Signal explizit nennen] "Herzlichen Glückwunsch zu [Neuer VP/CRO], der [Unternehmen] beitritt"
  [Warum es wichtig ist] "[Rolle]-Führungskräfte verbringen ihre ersten 90 Tage normalerweise mit [häufige Initiative]; das erfordert normalerweise [Lösungskategorie]"
  [Eine offene Frage] "Baut [Unternehmen] dieses Quartal [relevante Fähigkeit] auf, oder liegt das weiter unten auf der Roadmap?"
  ```
- **Reply-Rate-Anstieg:** +28% vs. Baseline
- **Beispiel-Trigger:** "Herzlichen Glückwunsch zum neuen VP für Vertrieb. Die meisten VPs für Vertrieb bewegen sich schnell in ihren ersten 90 Tagen – üblicherweise Umstrukturierung der Vergütung und Sales-Tools. Steht das auf Ihrer Agenda, oder ist Ihr Playbook bereits festgelegt?"

---

**Signal 3: Hohe Intent-Website-Aktivität (Preisseite, Demo-Seite, 3+ Besuche in 7 Tagen)**
- **Rangfolge:** 3 (aktive Evaluierung läuft, ~18% Reply-Rate)
- **Warum es wichtig ist:** Sie vergleichen aktiv Lösungen; Sie befinden sich gerade jetzt in ihrem Bewertungsfenster
- **Erkennungsmethode:**
  - Website-Analytik: HubSpot, Segment oder benutzerdefiniertes UTM-Tracking
  - Intent-Dataplattform: 6sense, ZoomInfo, Demandbase (zuverlässigste für B2B SaaS)
  - Drift/Intercom on-site Tracking: Konten kennzeichnen, die Preisseite oder Demo-Seite besuchen
  - LinkedIn-Kommentar-Aktivität zu Ihren Produktbeiträgen (starkes Intent-Signal)
  - G2-Rezensionsleser (falls Sie Pixel-basiertes Tracking haben; die meisten tun das nicht)
- **Verfallsfenster:** 7 Tage maximal. Nach 7 Tagen ohne Follow-up-Aktivität, nehmen Sie an, sie sind in der Pipeline eines anderen Vendors
- **Ideales First-Touch-Timing:** Innerhalb von 24 Stunden nach dem dritten Besuch oder Demo-Seitenaufruf (Same-Day Outreach verdoppelt die Reply-Rate)
- **Verifizierung:** Bestätigen Sie Kontogröße und Rolle des Besuchers (falls über Intent-Tool verfügbar); verwerfen Sie, wenn Besucher Freelancer oder außerhalb des Kaufkomitees ist
- **Trigger-Nachricht-Formel:**
  ```
  [Signal explizit nennen] "Ich habe bemerkt, dass Sie diese Woche auf unserer [Preis/Demo]-Seite waren"
  [Warum es wichtig ist] "Das bedeutet normalerweise, dass Sie in aktiver Evaluierung sind. Die meisten Teams in Ihrer Größe verbringen [X Wochen] mit Vergleichen – ich kann Ihnen helfen, diesen Zeitrahmen zu komprimieren"
  [Eine offene Frage] "Vergleichen Sie uns mit [bekanntem Wettbewerber], oder schauen Sie sich ein paar Optionen in [Kategorie] an?"
  ```
- **Reply-Rate-Anstieg:** +18% vs. Baseline
- **Beispiel-Trigger:** "Ich habe gesehen, dass Sie diese Woche dreimal auf unserer Preisseite waren. Das bedeutet normalerweise, dass Sie aktiv evaluieren – ich möchte sicherstellen, dass Sie nicht etwas vermissen. Vergleichen Sie uns mit Konkurrenz X, oder erkunden Sie noch immer, was es sonst gibt?"

---

**Signal 4: Tech-Stack-Änderung erkannt (Wettbewerber entfernt oder komplementäres Tool hinzugefügt)**
- **Rangfolge:** 4 (Übernahmemomentum, ~16% Reply-Rate)
- **Warum es wichtig ist:** Sie formen aktiv ihren Tech-Stack um; Ihr Produkt löst angrenzende Schmerzen; Timing ist wichtig
- **Erkennungsmethode:**
  - BuiltWith: Überwachen Sie Zielkonten auf entfernte Wettbewerber, neue Tool-Adoption
  - Datanyze: Verfolgung von Stack-Änderungen mit API oder wöchentliche manuelle Audits
  - G2-Rezensionsleser und Kaufsignale (neue Vendors, die Rezensionen hinzufügen = neue Adoption)
  - LinkedIn Job-Postings erwähnen neue Tool-Anforderungen
  - ZoomInfo Tech-Stack-Modul
- **Verfallsfenster:** 14 Tage. Stack-Änderungen benötigen 1–2 Wochen zum Stabilisieren; nach 14 Tagen haben sie sich weiterbewegt
- **Ideales First-Touch-Timing:** Innerhalb von 7 Tagen nach Stack-Änderungserkennung (fangen Sie sie mitten in der Evaluierung)
- **Verifizierung:** Bestätigen Sie, dass Änderung aktuell ist (innerhalb von 30 Tagen) und absichtliche Adoption darstellt, nicht versehentliche Entfernung
- **Trigger-Nachricht-Formel:**
  ```
  [Signal explizit nennen] "Ich sehe, dass [Unternehmen] diesen Monat [neues Tool] zu Ihrem Stack hinzugefügt hat"
  [Warum es wichtig ist] "[Neues Tool] macht typischerweise Probleme mit [verwandter Prozess] sichtbar. Teams finden normalerweise, dass sie [Ihre Lösung] innerhalb von Wochen brauchen"
  [Eine offene Frage] "Planen Sie, das mit [bestehendem Tool] zu integrieren, oder fahren Sie diesen Workflow komplett um?"
  ```
- **Reply-Rate-Anstieg:** +16% vs. Baseline
- **Beispiel-Trigger:** "Ich habe bemerkt, dass Sie gerade Segment zu Ihrem Stack hinzugefügt haben. Die meisten Unternehmen, die zu Segment migrieren, entdecken auch, dass sie bessere Downstream-Datengovernance brauchen – das ist es, was wir tun. Denken Sie über diesen Teil nach, oder ist das Phase zwei?"

---

**Signal 5: Finanzierung, Übernahme, neuer Markteintritt oder Headcount-Anstieg von 20%+**
- **Rangfolge:** 5 (Budgetverfügbarkeit, ~12% Reply-Rate)
- **Warum es wichtig ist:** Sie haben Kapital, Wachstumsmandativ und wahrscheinlich neues Budget, um es für Tools auszugeben, um Expansion zu unterstützen
- **Erkennungsmethode:**
  - Crunchbase: Finanzierungsankündigungen und Übernahmeverfolgung
  - LinkedIn-Unternehmensseite: Headcount-Änderung über 90-Tage-Fenster (vergleichen Sie mit vorherigem Quartal)
  - LinkedIn Job-Board-API: Anstieg bei Job-Postings (Proxy für Headcount-Wachstum)
  - News-APIs: M&A, neue Marktstarts, IPO-Unterlagen
  - 6sense oder ZoomInfo: "High Growth"-Kontoflaggen
- **Verfallsfenster:** 120 Tage. Nach 4 Monaten wird das Wachstumskapital vergeben; Budgets sind gesperrt
- **Ideales First-Touch-Timing:** Innerhalb von 30 Tagen nach der Ankündigung (Tage 1–30: Kapital ist ungenutzt; Tage 31–90: Budgets werden vergeben)
- **Verifizierung:** Bestätigen Sie, dass Wachstum real ist (nicht Bilanzumklassifizierung oder einmalige Veranstaltung); Cross-Check Crunchbase, LinkedIn und News-Quellen
- **Trigger-Nachricht-Formel:**
  ```
  [Signal explizit nennen] "Herzlichen Glückwunsch zu Serie [X] / [X Headcount-Wachstum] / Übernahme von [Unternehmen]"
  [Warum es wichtig ist] "Das Wachstum löst normalerweise [häufiger operativer Engpass] aus. Die meisten Teams in Ihrer Größe lösen das durch [Lösungskategorie]"
  [Eine offene Frage] "Plant Ihr [relevantes Team], die Kopfzahl dieses Quartal zu erweitern, oder konzentrieren Sie sich zunächst auf Effizienz?"
  ```
- **Reply-Rate-Anstieg:** +12% vs. Baseline
- **Beispiel-Trigger:** "Herzlichen Glückwunsch zur Serie C. Normalerweise bedeutet dieses Wachstum, dass Sie Ihr Engineering-Team skalieren. Die meisten Unternehmen, die eng in Ihrer Geschwindigkeit skalieren, haben innerhalb von 6 Monaten CI/CD-Engpässe – sehen Sie das bereits, oder ist die Infrastruktur immer noch stabil?"

---

**Signal 6: Strategische Einstellungsmuster (5+ Job-Postings in Zielabteilung innerhalb von 30 Tagen)**
- **Rangfolge:** 6 (Budget genehmigt und läuft, ~10% Reply-Rate)
- **Warum es wichtig ist:** Mehrere offene Stellen = genehmigtes Budget + aktive Einstellung = Tool-Ausgaben stehen unmittelbar bevor für diese Abteilung
- **Erkennungsmethode:**
  - LinkedIn Job-Board-API: Filtern Sie nach Unternehmen + Abteilung + Veröffentlichungsdatum (letzte 30 Tage)
  - Indeed, Greenhouse, ATS-Board-API: Zählen Sie offene Stellen nach Abteilung
  - Unternehmens-Karriereseite: manuelle Prüfung offener Stellen
  - ZoomInfo Einstellungs-Tracker
  - Persado: Einstellungs-Intent-Signale
- **Verfallsfenster:** 45 Tage. Nach 6 Wochen sind Rollen besetzt oder Einstellungsmomentum stagniert; Budgetfenster schließt
- **Ideales First-Touch-Timing:** Innerhalb von 14 Tagen nach dem 5. Rollen-Posting (wenn es klar ist, dass dies ein echtes Einstellungs-Push ist, nicht Rauschen)
- **Verifizierung:** Bestätigen Sie, dass 5+ Rollen in der gleichen Abteilung sind (nicht über Unternehmen verteilt); überprüfen Sie Job-Beschreibungen auf Hierarchie-Mix (zeigt echte Investition)
- **Trigger-Nachricht-Formel:**
  ```
  [Signal explizit nennen] "Ich sehe, dass [Unternehmen] diesen Monat 5+ offene Stellen in [Abteilung] hat"
  [Warum es wichtig ist] "Wenn Teams so aggressiv einstellen, brauchen sie normalerweise [Tool-Kategorie], um neue Einstellungen schnell einzuarbeiten und zu unterstützen"
  [Eine offene Frage] "Wird dieses Einstellungs-Sprint von [bekannte Initiative] angetrieben, oder erweitern Sie den Geltungsbereich dieses Teams?"
  ```
- **Reply-Rate-Anstieg:** +10% vs. Baseline
- **Beispiel-Trigger:** "Ich sehe, dass Sie diesen Monat 6 offene Stellen in Engineering haben. Normalerweise wenn Teams so aggressiv einstellen, stehen sie innerhalb der ersten 30 Tage vor Geschwindigkeitsproblemen – sie brauchen bessere Code-Review oder CI-Tools. Denkt Ihr Lead-Eng darüber nach?"

---

### Signal-Stacking-Logik

**Starten Sie keine Cold-Outreach mit einem einzelnen Signal (Ränge 3–6) allein.** Warten Sie auf Signal-Stacking.

**Signal-Stacking-Regeln:**
- **2+ Signale erkannt (beliebiger Rang) = Prioritäts-Outreach innerhalb von 24 Stunden**
  - Beispiel: Signal 3 (Website-Besuch) + Signal 5 (Finanzierung) = hochdringende Multi-Touch
  - Beispiel: Signal 4 (Tech-Änderung) + Signal 6 (Einstellung) = Multi-Touch planen
- **Signale 1 oder 2 allein = sofortige Outreach (innerhalb von 1 Tag)** – nicht auf Stacking warten
- **Einzelne Signale 3–6 = zu Nurture-Cadence hinzufügen, nicht Prioritäts-Outreach** – wöchentlich prüfen, bis Signal stacking oder verfällt
- **3+ Signale = Kernwaffe** – Executive Outreach, personalisiertes Demo-Angebot, 2-Stunden-Response-SLA

**Stacking-Beispiel:**
```
Montag: Signal 3 erkannt (Website-Besuch)
  → Zu Nurture-Liste hinzufügen, 1x/Woche Check-in
Mittwoch: Signal 6 erkannt (4 neue Job-Postings im Vertrieb)
  → JETZT: 2+ Signale. Trigger Prioritäts-Outreach innerhalb von 24h
  → Nachricht: "Ich habe bemerkt, dass Sie den Vertrieb erweitern UND diese Woche unsere Plattform erkunden"
Freitag: Signal 5 erkannt (Crunchbase zeigt Serie B)
  → 3 Signale. Eskalieren: Anruf vom Gründer oder Sales-Head
```

---

### Signal-Überwachungs-Stack

**Tägliche Überprüfungen (Konten in aktiver Evaluierung):**
- LinkedIn Sales Navigator: Job-Wechsel-Warnmeldungen bei Ziel-Personas und warmen Leads
- Intent-Daten-Dashboard (6sense, Demandbase): Website-Aktivität, Score-Schwelle >60%
- Drift/Intercom: Echtzeit-Benachrichtigungen zu Preisseiten- oder Demo-Seiten-Aufrufen

**Wöchentliche Überprüfungen (Konten in Pipeline oder auf Watchlist):**
- BuiltWith-API: Tech-Stack-Änderungen (Signal 4)
- Unternehmens-News-Warnmeldungen (Crunchbase, Google News-API): Finanzierung, M&A, Executive-Einstellungen (Signale 2, 5)
- LinkedIn-Unternehmensseite: Job-Postings-Zahl in Ziel-Abteilungen (Signal 6)
- Job-Board-Scraping: Indeed, Lever, Greenhouse für Unternehmens-Einstellungen (Signal 6)
- G2-Unternehmens-Profil: Rezensions-Aktivitäts-Anstieg = Interest-Signal (Proxy für Signal 3)

**Monatliche Audits (Rückblick und Verfall):**
- Tabelle oder CRM: Signal-Datum, Verfalls-Deadline, Outreach-Status markieren
- Verfallene Signale löschen (älter als 90 Tage für Signale 1–2, älter als 14 Tage für Signal 3, älter als 14 Tage für Signal 4, älter als 120 Tage für Signal 5, älter als 45 Tage für Signal 6)
- Konten nach Signalzahl und Dringlichkeitsstufe bewerten

---

### 14-Tage-Verfallsregel (Universal)

Alle Signale verfallen. Der Industriestandard ist:
- **Signal 1 & 2:** Nützlich für 90 Tage, Priorität fällt nach Tag 30
- **Signal 3:** Nützlich für 7 Tage (Website-Aktivität ist zeitgebunden), Cold Touch nach Tag 7 ist 60% weniger wirksam
- **Signal 4:** Nützlich für 14 Tage, danach veraltet
- **Signal 5:** Nützlich für 120 Tage, Priorität fällt nach Tag 30
- **Signal 6:** Nützlich für 45 Tage, Momentum stagniert nach Tag 45

**Implementierung:**
1. Kennzeichnen Sie jedes Signal mit Erkennungsdatum in CRM oder Tabelle
2. Berechnen Sie Verfalls-Deadline (siehe Fenster oben)
3. Automatisieren Sie mit Zapier, Make oder eigenem Script: if (today > signal_date + decay_window), entfernen Sie aus Prioritätsliste, verschieben Sie zu Nurture
4. Starten Sie nie Cold-Outreach bei verfalltem Signal; überprüfen Sie erneut, wenn ein neues Signal erscheint

---

### First-Touch-Nachricht-Formel (Operationalisiert)

Jeder First-Touch sollte dieser 3-teiligen Struktur folgen (max. 3 Sätze):

**[Teil 1: Signal explizit nennen]**
- Macht das Outreach glaubwürdig und spezifisch (nicht Spray-and-Pray)
- Beispiel: "Ich sehe, dass Sie gerade zu Acme als VP von Betrieb gewechselt haben" ODER "Ich habe bemerkt, dass Sie diese Woche dreimal auf unserer Demo-Seite waren"

**[Teil 2: Warum es für sie wichtig ist (nicht für Sie)]**
- Artikulieren Sie das Geschäftsproblem, dem sie wahrscheinlich aufgrund dieses Signals gegenüberstehen
- Beispiel: "Wenn Ops-Manager zu einem neuen Unternehmen wechseln, ist das erste, das sie normalerweise angehen, die Lieferkettensichtbarkeit" (Signal 1)
- Beispiel: "Wenn Sie ein Datenlager hinzufügen, entdecken Sie normalerweise Datenqualitätsprobleme nachgelagert" (Signal 4)

**[Teil 3: Eine offene Frage (kein Pitch)]**
- Zeigt, dass Sie neugierig sind, nicht verkaufen
- Macht die Antwort einfacher (binär/spezifisch, nicht offen)
- Beispiel: "Suchen Sie nach [Kategorie], um das zu lösen, oder ist Sichtbarkeit noch kein Problem für Sie?"
- Beispiel: "Denkt Ihr Team bereits über Datengovernance nach, oder ist das Phase zwei?"

**Vorlage:**
```
[Signal] "Ich habe bemerkt [spezifisches Signal]"
[Problem] "[Rolle/Situation] bedeutet normalerweise [geschäftliche Auswirkung]"
[Frage] "Denken Sie über [relevanten Lösungsbereich] nach, oder steht das nicht auf der Roadmap?"
```

---

### Reply-Rate-Benchmarks (Baseline vs. Signal)

| Signal | Baseline | Mit Signal | Anstieg |
|--------|----------|------------|--------|
| Kein Signal (kalte E-Mail) | 3,4% | — | — |
| Signal 1 (ehemaliger Kunde) | 3,4% | 35% | +10,3x |
| Signal 2 (neue C-Suite/VP) | 3,4% | 28% | +8,2x |
| Signal 3 (Website-Aktivität) | 3,4% | 18% | +5,3x |
| Signal 4 (Tech-Änderung) | 3,4% | 16% | +4,7x |
| Signal 5 (Finanzierung/Wachstum) | 3,4% | 12% | +3,5x |
| Signal 6 (Einstellung) | 3,4% | 10% | +2,9x |
| 2+ Signale (gestapelt) | 3,4% | 42–58% | +12–17x |

*Quelle: ColdIQ-Forschung (2024). Benchmarks setzen B2B SaaS, 50–1000 Mitarbeiter-Konten, Senior/Mid-Market-Personas voraus. YMMV.*

---

## Beispiel

**Szenario: VP Vertrieb bei Acme Corp**

**Tag 1 — Montag 9 Uhr**
- LinkedIn-Warnmeldung: Sarah Chen joinet Acme Corp als VP Vertrieb (Signal 2)
- Verifizierung: Überprüfen Sie LinkedIn, bestätigen Sie Rolle ist VP-Level, meldet sich an CRO, Unternehmensgröße = 350 Mitarbeiter, SaaS-nah
- Entscheidung: Signal 2 allein = sofortige Outreach (Rang 2, kein Stacking erforderlich)
- Verfallsfenster: 90 Tage, Prioritäts-Outreach Tag 1–30

**First-Touch-E-Mail (gesendet 9:15 Uhr gleicher Tag):**
```
Betreff: Herzlichen Glückwunsch zur VP-Rolle bei Acme

Sarah,

Herzlichen Glückwunsch zu Ihrem Start bei Acme als VP Vertrieb – ich freue mich auf die neue Führung dort.

Die meisten VPs Vertrieb verbringen ihre ersten 90 Tage mit zwei Dingen: Kompensations-Umstrukturierung und Tools-Modernisierung.
Normalerweise im Monat 2 evaluieren sie CRM-Workflows oder Sales-Engagement-Stacks, um ihre Ramp-Ziele schneller zu erreichen.

Ist Ihr Playbook dort bereits fest, oder denken Sie noch über diesen Teil nach?

Beste Grüße,
[Name]
```

**Verfalls-Verfolgung:**
- E-Mail gesendet: Tag 0 (Montag)
- Follow-up 1: Tag 3 (Donnerstag) bei keiner Antwort
- Follow-up 2: Tag 7 (nächster Montag) bei keiner Antwort
- Follow-up 3: Tag 14 bei keiner Antwort
- Signal deprecieren: Tag 90 (wenn bis dahin keine Antwort, aus aktiver Pipeline entfernen)

---

**Tag 3 — Mittwoch 10 Uhr**
- Intent-Daten-Warnmeldung: Acme.com besuchte Ihre Demo-Seite (Signal 3)
- Manuelle Verifizierung: Drift zeigt Besuch von [sarah.chen@acme.com](mailto:sarah.chen@acme.com) – gleiche Person
- Entscheidung: 2+ Signale jetzt (Signal 2 + Signal 3) = Eskalieren zu Prioritäts-Outreach innerhalb von 24h
- Sofortige Aktion:

**Second-Touch (Prioritäts-Anruf-Angebot, gesendet 10:30 Uhr gleicher Tag):**
```
Betreff: Re: Herzlichen Glückwunsch zur VP-Rolle bei Acme – schnelle Frage

Sarah,

Sah, dass Sie heute Morgen unsere Demo-Seite angeschaut haben. Angesichts Ihres Timing bei Acme vermute ich, dass Sie in der Evaluierungsphase bei Sales-Tools sind.

Anstelle einer weiteren E-Mail – würden 15 Minuten Ihrer Zeit besser sein? Ich zeige Ihnen gerne, wie wir typischerweise die spezifischen Workflows lösen, denen Acme wahrscheinlich gegenübersteht.

Lassen Sie mich wissen, wann Sie diese oder nächste Woche Zeit haben?

Beste Grüße,
[Name]
```

**Ergebnis:** Wenn Sarah auf eine der E-Mails antwortet, verschieben Sie sie zur Demo/Gesprächs-Spur. Wenn keine Antwort bis Tag 14, neu evaluieren: Ist Signal 3 (Website-Aktivität) verfallen? (Ja, 7 Tage max – Signal 3 ist veraltet.) Überprüfen Sie auf neue Signale. Wenn keine neuen Signale erscheinen, fahren Sie mit Nurture-Cadence fort, 1x/Woche, bis Tag 90.

---

**Real-World-Verfalls-Beispiel (was NICHT zu tun ist):**
- Tag 1: Signal 5 erkannt – Acme sammelt Serie B (Finanzierung)
- Tag 60: Sie senden kalte E-Mail über die Finanzierung
  - ❌ Falsch: 60 Tage ist nach dem Prioritätsfenster (Tag 1–30); Budget ist bereits vergeben
  - ✓ Richtig: Verwenden Sie es als weicher Kontext ("Ich sah, dass Acme Serie B früher diesen Frühling sammelte"), führe aber mit einem neuen, aktuellen Signal auf

---
