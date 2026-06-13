# Claude für lokale Services

Claude für Geschäfte mit lokalen Services ist für den Besitzer gebaut, der einen Service-Betrieb in einem geographischen Gebiet betreibt — Klempner, Elektriker, HVAC, Landschaftsgestalter, Reinigung, Malerei, Zahnarztpraxen, Salons, Fitness-Studios, Fotografen, Autowerkstätten und die lange Reihe von Fachbetrieben. Dieser Leitfaden zeigt, wie Claude (die KI von Anthropic) Dispatch, Nachverfolgung, Bewertungsverwaltung und Verwaltungsarbeit verwaltet, die Besitzer von Lastwagen oder Stuhl abhält.

Wenn Ihr Geschäft eine Route läuft, Terminvergaben füllt oder pro Job fakturiert, ist dieser Leitfaden für Sie.

---

## Warum lokale Services unterschiedlich sind

Lokale Service-Unternehmen teilen drei operative Fakten, die ändern, wie Claude genutzt wird:

1. **Bargeld und Kapazität sind sichtbar wöchentlich, nicht monatlich.** Ein Klempner weiß bis Mittwoch, ob die Woche Umsatz erreicht. Ein E-Commerce-Operateur sieht es am Ende des Monats. Workflows müssen auf wöchentlichem Rhythmus laufen.
2. **Bewertungen sind existenziell.** Ein Salon-Besitzer, dessen Google-Rating von 4,7 auf 4,4 fällt, verliert 20% neue Kundenbuchungen. Review-Antwort ist nicht marketing nice-to-have — es ist Kernbetrieb.
3. **Die meisten Besitzer sind Feld-Operatoren zuerst.** Der Besitzer ist auf Baustelle, im Stuhl, hinter Theke. Sie öffnen ihr Telefon, nicht einen Laptop. Workflows müssen in 5 Minuten vom Telefon ausführbar sein.

Claudients Small-Business-Skill-Set ist um diese drei Fakten gebaut.

---

## Der lokale Service Skill-Stack

### Dispatch und Planung

- [Contractor Trades](../skills/small-business/contractor-trades.md) — Angebots-Drafts, Job-Planung, Kunden-Komms für Klempnerei, HVAC, Elektrik
- [Customer Inquiry](../skills/small-business/customer-inquiry.md) — Erste-Antwort-Drafts für Buchungsanfragen nach Geschäftsschluss
- [Meeting to Action](../skills/small-business/meeting-to-action.md) — wandel einen Telefon-Beratung in strukturiertes Angebot und Nachverfolgung um

### Spezifische Vertikale

- [Restaurant Operations](../skills/small-business/restaurant-ops.md) — Full-Service- und QSR-spezifische Workflows
- [Real Estate Listing](../skills/small-business/real-estate-listing.md) — Listing-Kopie, Comp-Recherche, Käufer-Nachverfolgung
- [Salon and Spa Operations](../skills/small-business/salon-spa-ops.md) — No-Show Wiederherstellung, Retentions-Sequenzen, Service-Beschreibungen
- [Dental Practice](../skills/small-business/dental-practice.md) — Recall-Planung, Versicherungs-Überprüfung, Behandlungs-Plan-Nachverfolgung
- [Fitness Gym Operations](../skills/small-business/fitness-gym-ops.md) — Klassenfüllungsquoten, Retention, Trial-to-Member Konvertierung
- [Photography Studio](../skills/small-business/photography-studio.md) — Anfrage-zu-Buchung, Vertrag, Galerie-Zustellung
- [Bookkeeper Practice](../skills/small-business/bookkeeper-practice.md) — für den Buchhalter oder Steuerberater, der seine eigene Firma leitet

### Bewertungen und Ruf

- [Review Response](../skills/small-business/review-response.md) — Google und Yelp Antwort-Drafts, die Ihre Stimme entsprechen
- [Customer Feedback Synthesizer](../skills/small-business/customer-feedback-synthesizer.md) — Pattern-Erkennung über hunderte Bewertungen

### Finanzen und Administration

- [Invoice Chaser](../skills/small-business/invoice-chaser.md) — AR-Nachverfolgung nach Altersgruppe
- [QuickBooks Workflow](../skills/small-business/quickbooks-workflow.md) — Monatsabschluss
- [Cash Flow Forecast](../skills/small-business/cash-flow-forecast.md) — besonders wichtig für Service-Unternehmen mit ungleichbleibender Zahlungszeitpunkt
- [Margin Analyzer](../skills/small-business/margin-analyzer.md) — welche Job-Typen und welche Techniker die beste Marge produzieren
- [Payroll Planner](../skills/small-business/payroll-planner.md) — Cash Runway gegen Lohn für Unternehmen mit W-2-Personal

### Einstellung und Team

- [Job Description](../skills/small-business/job-description.md) — genaue Job-Beschreibungen für Techniker, Assistenten und Lehrlinge
- [Hiring Pipeline](../skills/small-business/hiring-pipeline.md) — strukturiertes Screening für eine hochanwendungs-, niedrigauftritt-Industrie
- [SOP Writer](../skills/small-business/sop-writer.md) — codifizieren Sie, was der Gründer tut in ein Manual, das das Team ausführen kann

---

## Wie ein lokaler Service-Besitzer es einrichtet

Das Setup-Zeit-Budget ist 90 Minuten insgesamt. Lokale Service-Besitzer haben keinen freien Abend — richten sich über drei Mittags-Pausen auf, wenn nötig.

### Mittag 1 — Fundament (30 Minuten)

1. **Claude Pro mit $20/Monat** für Solo-Besitzer-Operatoren. **Claude Team mit $30/Seat** wenn Sie einen Dispatcher, Office-Manager oder Assistentin haben.
2. **Öffnen Sie Claude Cowork** von Ihrem Claude-Dashboard.
3. **Schreiben Sie Geschäfts-Kontext.** Für ein Service-Unternehmen, einschließen: Gewerk oder Spezialität, Service-Gebiet (Stadt/Region), Service-Mix und durchschnittliches Ticket, Team-Größe und Struktur, Markstimme (warm-und-vertrauenswürdig vs straight-shooter), und Ihre drei größten Konkurrenten.

### Mittag 2 — Verbinden (30 Minuten)

1. **Verbinden Sie QuickBooks Online.** Entsperrt Finanz-Workflows.
2. **Verbinden Sie Ihr CRM oder Service-Software**, wenn es MCP/API-Integrationen hat. ServiceTitan, Housecall Pro, Jobber, Mindbody, Acuity und Square Appointments haben alle unterschiedliche Kompatibilität. Wenn Ihres noch nicht, laufen Workflows noch auf Kopier-Einfügen-Daten.
3. **Verbinden Sie Google Workspace.** Notwendig für Kalender-Lesevorgänge und E-Mail-Entwürfe.

### Mittag 3 — Erster Workflow (30 Minuten)

1. **Führen Sie Review Response auf den letzten 10 Bewertungen auf Ihrem Google Business Profile aus.** Lesen Sie Claudes Drafts, posten Sie die, die wie Sie klingen. Dies ist der unmittelbar befriedigendste Workflow für jeden lokalen Service-Besitzer — es löscht einen Backlog, der seit Wochen sitzt.
2. **Richten Sie das wöchentliche Monday Brief ein.** Sogar für Service-Unternehmen, wo jeder Tag operativ gleich aussieht, die Einnahmen der Vorwoche zu kennen, AR-Altern und Pipeline vor 9am Montag ändern, wie Sie Montag führen.

---

## Lokale Services 30/60/90

### Tage 1-30: Bewertungen und AR

Zwei Workflows laufen wöchentlich: Review Response auf neue Bewertungen, Invoice Chaser auf überfällige Rechnungen. Zusammen gewinnen sie 60% der Betreiberstunden zurück, die normalerweise in "Admin" verloren gehen. Besitzer berichten, dass allein AR-Nachverfolgung $2-5K von zuvor fest sitzenden Geld in den ersten 30 Tagen eintreibt.

### Tage 31-60: Dispatch und Kunde

Customer Inquiry verwaltet Buchungsanfragen nach Geschäftsschluss, die die einzelne größte Quelle verlorener Geschäfte für die meisten lokalen Service-Operateure sind (der Lead, der Dienstag 19 Uhr anrief und mittwoch morgen mit der nächsten Firma ging, die sie anrief). Der Vertikal-spezifische Skill (Contractor Trades für Betriebe, Salon-Spa für Personal-Services, Dental für Gesundheit) schichtet das industrie-spezifische Arbeit.

Zeitsparnis: 8-12 Stunden pro Woche.

### Tage 61-90: Einstellung und Skalierung

Job Description und Hiring Pipeline aktivieren, wenn Sie einstellen entschließen. SOP Writer erfasst des Gründers Prozess schriftlich — die Gating-Etappe zum Übergeben echter Arbeit an neue Einstellungen. Margin Analyzer zeigt auf, welche Services tatsächlich profitabel sind (und welche sind Verlust-Leader verkleidet als Umsatz).

Zeitsparnis: 10-15 Stunden pro Woche, und das Geschäft wird bedienbar ohne den Besitzer auf jedem Anruf.

---

## Lokale Services spezifische Erfolgsmuster

**Review Response läuft jeden Montagmorgen ohne Ausnahme.** Der 4,7-zu-4,4 Abstieg passiert stillschweigend. Wöchentliche Reaktion hält Ihre Reaktivität sichtbar für zukünftige Sucher — Google berücksichtigt Reaktions-Kadenz als Ranking-Signal für lokale Pack-Ergebnisse.

**Führen Sie Customer Feedback Synthesizer quartalsweise aus.** Das Pattern, das von 200 Bewertungen aufkommt, ist selten, was einzelne Bewertungen sagen. Gemeinsame Oberflächlich: Techs sind toll, aber das Büro ist langsam anzurufen; Preis ist ok, aber das Anfangsangebot passt nicht zur Endrechnung; Aufräumen nach dem Job sind inkonsistent. Diese sind behoben. Einzelne Bewertungen machen sie nicht laut genug zu beheben.

**Invoice Chaser spart am meisten Geld in Betrieben und Unternehmertum.** Fachbetriebe haben die höchsten AR-Alterung aller Small-Business-Kategorien — 30-Tage Durchschnitt ist häufig, 60+ Tage ist nicht ungewöhnlich. Wöchentliche Verfolgung gewinnt ein sinnvolles Chunk des Betriebskapitals zurück und ändert, welche Jobs das Geschäft nächsten Monat annehmen kann.

**Cash Flow Forecast verhindert den schlechten Monat.** Für Service-Unternehmen mit Lohn zwei Wochen im Voraus wissen, dass Barmittel eng wird, ist der Unterschied zwischen Umbuchen einer Urlaubs- und Missfall der Lohnabrechnung. Führen Sie wöchentlich aus.

**Lassen Sie Claude keine Angebote schreiben, die Sie nicht überprüft haben.** Der Contractor Trades Skill entwirft Angebote von Ihren Scope-Notizen. Sie sehen richtig aus. Aber Preis-Nuanzen — der Kunde, der immer nach Discount fragt, der gerade Materialzuschlag, der Gewerkschaftstarif vs. Nicht-Gewerkschaft — leben in Ihrem Kopf. Claude entwirft, Sie unterzeichnen.

---

## Was Claude NICHT ist für lokale Services

**Dispatch-Entscheidungen.** Routing-Optimierung (welcher Tech zu welchem Job) gehört zu ServiceTitan, Housecall Pro, Jobber oder Ihrer Dispatch-Software. Claude liest das Ergebnis, nicht den Route Planner.

**Preis-Strategie ohne Ihre Inputs.** Pricing Optimizer ist ein strukturiertes Framework zum Testen von Preisen, die Sie in Betracht ziehen. Es sagt Ihnen nicht, was Sie basierend auf Ihrem lokalen Markt berechnen sollen — das ist Ihre Lektüre.

**Versicherungs- und Garantie-Interpretation.** Workflows berühren Versicherungs-Überprüfung und Garantie-Nachverfolgung, aber ersetzen nicht Ihr Urteil über Deckungsentscheidungen. Besonders in Dental, Auto und HVAC — das Garantie Kleingedruckte zählt.

**Die beziehungs-basierten Teile des Geschäfts ersetzen.** Lokale Services funktionieren auf Vertrauen. Ein HVAC-Kundenerstkontakt wird Kundenlebenszyklus, weil wie Sie seinen ersten Notfall um 23 Uhr handhaben. Dieser Anruf ist Ihrer.

---

## FAQ

### Ist Claude gut für lokale Service-Unternehmen?

Ja. Die Kombination aus wöchentlichen Kadenz-Workflows (Invoice Chaser, Cash Flow, Review Response) und Vertikal-spezifischen Skills (Contractor Trades, Salon-Spa, Dental, Fitness) deckt die operative Arbeit, die die meiste Woche eines lokalen Service-Besitzers verbraucht.

### Funktioniert Claude mit ServiceTitan, Housecall Pro oder Jobber?

Integrations-Tiefe variiert je nach Platform. Die nativen Claude for Small Business Integrationen decken QuickBooks, HubSpot, PayPal, Google Workspace und eine wachsende Liste vertikaler Platforms. Service-Software-spezifische Integrationen werden über MCP-Server besser — überprüfen Sie das [MCP-Verzeichnis](../mcp/) für die aktuelle Liste. Workflows laufen noch auf Kopier-Einfügen-Daten, wenn direkte Integration nicht verfügbar ist.

### Wie hilft Claude mit Google-Bewertungen?

Review Response entwirft Antworten auf Google Business Profile Bewertungen in Ihrer Markstimme. Sie genehmigen und buchen. Das Skill flaggt auch Bewertungen, die operationelle Beschwerden enthalten, die es wert sind, dass Sie sich vertiefen (spezifischer Tech genannt, wiederkehrend Frage, Ort/Planung Beschwerde).

### Kann Claude mir helfen, Techniker, Friseure oder Assistenten einzustellen?

Job Description schreibt den Post. Hiring Pipeline strukturiert Screening-Anrufe und bewertet Kandidaten gegen Ihre Kriterien. Die Skills führen keine Interviews, führen keine Handwerkstests durch oder überprüfen Referenzen — das sind die Einstellungsteile, die menschlich bleiben müssen.

### Wie viel kostet Claude für ein lokales Service-Unternehmen?

$20/Monat für Solo-Besitzer-Operatoren auf Claude Pro. $30/Seat/Monat für Claude Team wenn Sie einen Office-Manager, Dispatcher oder Geschäftspartner nutzen die Workflows. Plus Ihre bestehenden QuickBooks, CRM und Google Workspace Abos.

### Funktioniert Claude für Betriebe wie Klempnerei, HVAC, Elektrik?

Ja. Contractor Trades ist der dedizierte Skill für Betriebsbetreiber. Es deckt Angebot-Entwurf, Planungs-Comms, Nachverfolgung und Post-Job-Danke-Sequenzen. Kombiniert mit Invoice Chaser und Cash Flow Forecast verwaltet es das operative Rückgrat eines Betrieb-Geschäfts.

### Kann Claude Versicherungs-Überprüfung oder Anspruch verwalten?

Claude entwirft Versicherungs-Überprüfungsanfragen und liest Rückmeldungen auf Vollständigkeit, aber die endgültige Lektüre zum Versicherungsschutz ist Ihre. Für Zahnarzt, enthält der Dental Practice Skill einen strukturierten Versicherungs-Überprüfungs-Unterablauf. Für Betriebe und Auto, ist Versicherungsarbeit variabler und Claude hilft eher, als dass er es besitzt.

### Ist Claude besser als ChatGPT für lokale Services?

Für Workflow-Automatisierung an Ihre echten Business-Daten gebunden, ja — erheblich. ChatGPT schreibt eine generische Rechnungserinnerung. Claude liest Ihren QuickBooks AR-Altern-Bericht und entwirft personalisierte Erinnerungen nach Rechnung. Für One-Off-Fragen und Brainstorming, beide arbeiten gut.

### Was ist, wenn ich überhaupt nicht technisch bin?

Die Claude for Small Business Workflows sind Point-and-Click. Die Claudient Skills in diesem Repo werden aktiviert, indem Sie Claude einfache englische Anweisungen eingeben. Der schwierigste technische Schritt ist die Verbindung QuickBooks über OAuth, die ein 3-Klick-Prozess ist.

---

## Verwandte Leitfäden

- [Claude for Small Business — Product Guide](claude-for-small-business.md)
- [Claude for Solopreneurs](claude-for-solopreneurs.md) — wenn Sie das Geschäft allein führen
- [Claude for Ecommerce](claude-for-ecommerce.md) — wenn Sie auch online verkaufen
- [Claude for Coaches and Consultants](claude-for-coaches-consultants.md)
- [SEO Strategy for Small Business Content](claude-small-business-seo-strategy.md)

---
