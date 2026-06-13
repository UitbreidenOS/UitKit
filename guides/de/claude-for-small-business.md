# Claude for Small Business — Produktleitfaden

Claude for Small Business ist eine spezifische Produktschicht in Claude Cowork, die am 13. Mai 2026 gestartet wurde. Es ist nicht der generalisierte Claude.ai-Chatbot und auch nicht Claude Code. Es ist eine Sammlung von 15 vorgefertigten, einfach aktivierbaren Workflows, die für Geschäftsinhaber entwickelt wurden, die möchten, dass KI innerhalb der Tools funktioniert, die sie bereits verwenden — QuickBooks, HubSpot, PayPal, Google Workspace und mehr — ohne Prompts zu schreiben, Server zu konfigurieren oder einen Entwickler einzustellen.

Dieser Leitfaden behandelt, was das Produkt ist, was jeder Workflow macht, wie man es einrichtet, was es von jedem verbundenen Tool erfordert und was man in den ersten 90 Tagen erwarten kann.

---

## Was es ist und was nicht

**Was es ist:** Eine strukturierte Schicht innerhalb von Claude Cowork (die GUI-basierte, terminalfreie Version von Claudes agentic Fähigkeiten), die mit 15 maßgeschneiderten Workflows für die Verwaltung von Kleinunternehmen ausgeliefert wird. Jeder Workflow stellt eine Verbindung zu einem oder mehreren Geschäftstools her, die Sie bereits nutzen, liest Daten, erstellt Entwürfe und präsentiert alles zur Überprüfung, bevor etwas versendet oder geändert wird.

**Was es nicht ist:**

- Es ist nicht der Claude.ai-Chatbot. Sie können Claude.ai in einer Konversation alles fragen, aber es hat keine Verbindung zu Ihrem QuickBooks, keinen Zugriff auf Ihre HubSpot-Pipeline und produziert generische Outputs ohne Geschäftskontext. Claude for Small Business ist spezialisiert und integriert.
- Es ist nicht Claude Code. Claude Code ist ein terminalbasiertes Entwicklertool. Claude for Small Business ist ein Point-and-Click-Produkt für Inhaber und Betreiber, die keinen Terminal öffnen sollten, um Wert aus KI zu erhalten.
- Es ist kein Ersatz für Ihre bestehende Software. QuickBooks führt immer noch Ihre Buchhaltung. HubSpot speichert immer noch Ihr CRM. Claude liest, was diese Tools wissen, fügt Überlegungen und Drafts hinzu und gibt Ihnen die Kontrolle zurück.
- Es ist nicht autonom. Nichts versendet, postet, zahlt, löscht oder veröffentlicht ohne Ihre explizite Genehmigung für jede einzelne Aktion.

**Für wen es ist:** Kleinunternehmer — Einzelbetreiber, Partnerschaften, Unternehmen mit 2-50 Mitarbeitern — die 8-15 Stunden pro Woche für überwiegend mechanische Aufgaben aufwenden: Verfassen von Follow-up-E-Mails, Vorbereitung von Kassenberichten, Bewertung von Prioritäten für Leads, Abstimmung von Bankdaten. Die Zusage des Produkts ist, diese mechanische Zeit auf 1-2 Stunden pro Woche zu reduzieren, ohne dass Sie KI-Nutzung erlernen müssen.

---

## Preisgestaltung und Zugang

Claude for Small Business erfordert ein Claude Pro-Abonnement für $20/Monat oder einen Claude Team-Plan für $30/Nutzer/Monat. Beide Pläne beinhalten Zugriff auf Claude Cowork und alle 15 Workflows. Es gibt keine zusätzlichen pro-Workflow-Gebühren.

Für Teams mit höherer Nutzung — Ausführung von 8 oder mehr Workflows täglich oder Arbeit mit großen Finanzdatensätzen — sind Claude Max-Pläne für $100/Monat (5x Nutzungslimit) oder $200/Monat (20x Nutzungslimit) verfügbar.

Das Produkt wird in Claude Cowork ausgeliefert. Sie laden keine separate Anwendung herunter.

---

## Designprinzipien

Das Verständnis des Designs verhindert, dass Sie die falschen Erwartungen haben.

**Inhaber-initiiert, genehmigungsbasiert.** Jeder Workflow läuft, wenn Sie ihn ausführen. Nichts kontrolliert Ihre Konten im Hintergrund und handelt in Ihrem Namen. Wenn ein Workflow abgeschlossen ist, präsentiert er einen strukturierten Output — Draft-E-Mails, Scoring-Zusammenfassungen, Abstimmungs-Flags — und wartet auf Ihre Genehmigung für jede Aktion einzeln.

**Datenzugriff entspricht Ihrer Rolle.** Jede Integration stellt sich über OAuth mit Ihren Anmeldedaten her. Claude kann genau das lesen und schreiben, das Sie können — nicht mehr. Eine QuickBooks-Integration mit Ihren Inhaberanmeldedaten gibt Claude denselben Zugriff wie Sie. Sie erstellt keinen separaten, erhöhten Service-Account.

**Outputs sind Entwürfe, keine Entscheidungen.** Lead-Scores sind Empfehlungen, nicht Regeln. Rechnungs-E-Mails sind Entwürfe, keine versendeten Nachrichten. Vertragsflags sind Anmerkungen, nicht rechtliche Meinungen. Die Workflows sollen die Zeit komprimieren, die Sie für Informationssammlung und First-Draft-Schreiben aufwenden, während Sie bei der Entscheidungsfindung das Sagen haben.

**Der Kontext ist Ihrs.** Anthropic nutzt Ihre verbundenen Geschäftsdaten nicht zum Trainieren von Claude. Die Daten, die Ihre Integrationen verfügbar machen — Kundendatensätze, Rechnungsbeträge, Pipeline-Stadien — werden zur Abfragezeit verarbeitet und nicht für das Modelltraining gespeichert.

---

## Die 15 Workflows

Die Workflows sind hier nach typischen wöchentlichen Zeiteinsparungen organisiert, von höchster zu niedrigster. Ihre spezifischen Einsparungen hängen von Ihrer Unternehmensgröße, wie konsistent Sie die Workflows ausführen und wie gut Sie Ihren Geschäftskontext in Claude konfiguriert haben.

---

### Stufe 1 — Hohe Frequenz, hohe Einsparungen (5-10+ Stunden/Woche)

**Invoice Chasing**

Verbindet sich mit QuickBooks. Liest den Alterungsbericht für Debitorenkonto, identifiziert Rechnungen, die 7, 14, 30 und 60+ Tage überfällig sind, und erstellt eine personalisierte Follow-up-E-Mail für jeden Kunden. Die Entwürfe beziehen sich auf die spezifische Rechnungsnummer, den geschuldeten Betrag, das ursprüngliche Fälligkeitsdatum und einen Zahlungslink, wenn PayPal auch verbunden ist. Der Ton wird an das Alter angepasst — eine 7 Tage fällige Nachricht unterscheidet sich von einer 60 Tage fälligen.

Sie überprüfen den Draft-Stapel, bearbeiten einzelne E-Mails nach Bedarf und versenden diejenigen, die Sie genehmigen. Der Workflow verfolgtkeine Rechnungen und signalisiert, wenn Zahlungen eingehen, damit Sie niemanden eine Erinnerung senden, der gestern gezahlt hat.

Zeiteinsparungen: 4-6 Stunden pro Woche für Unternehmen mit 10+ aktiven Debitorenkonten. Die Einsparungen stammen aus der Beseitigung des manuellen Pull-and-Draft-Zyklus, nicht aus der Automatisierung der Sendungen.

Integrationanforderungen: QuickBooks Online (jeder Abonnementtarif). PayPal Business (optional — ermöglicht die Einbindung von Zahlungslinks in E-Mails).

**Lead Triager**

Verbindet sich mit HubSpot. Liest neue und kürzlich aktualisierte Kontakte, bewertet sie gegen Ihre Ideal Customer Profile (ICP)-Kriterien, erweitert Datensätze wo öffentliche Daten verfügbar sind und kennzeichnet die Leads mit höchster Priorität für sofortige Verfolgung. Bewertungskriterien werden von Ihnen in natürlicher Sprache festgelegt: „wir arbeiten am besten mit SaaS-Unternehmen in Nordamerika mit 10-200 Mitarbeitern, wo der Kontakt ein Gründer oder VP of Operations ist."

Das Output ist eine priorisierte Liste mit einer Begründungslinie pro Lead, sortiert nach Fitness-Score. Kontakte, die Sie heute anrufen sollten, erscheinen zuerst. Kontakte, die nicht in Ihr ICP passen, werden gekennzeichnet und in eine niedrigere Warteschlange verschoben statt zu verwerfen.

Sie überprüfen die rankierte Liste, bestätigen oder negieren das Scoring bei jedem Lead, dem Sie widersprechen, und Claude aktualisiert die HubSpot-Datensätze, um die Entscheidungen widerzuspiegeln.

Zeiteinsparungen: 3-5 Stunden pro Woche für Unternehmen mit 20+ neuen Leads pro Woche. Die Einsparungen stammen aus der Beseitigung manueller Kontaktüberprüfung und der mentalen Belastung, wer als nächstes anzurufen ist.

Integrationanforderungen: HubSpot (kostenlos ist ausreichend für Lead-Lesen und Datensatz-Updates).

**Business Pulse**

Verbindet sich mit QuickBooks, PayPal, HubSpot und Google Workspace oder Microsoft 365. Läuft als Montagmorgen-Briefing — eine strukturierte Übersicht der Geschäftsgesundheit über alle verbundenen Systeme.

Das Output deckt ab: Kassenlage und Debitoren-Zusammenfassung von QuickBooks; Abrechnungs- und Rückerstattungssummen von PayPal für die vorherige Woche; Pipeline-Bewegungen von HubSpot (Deals die vorangekommen sind, Deals die kalt geworden sind, neue Deals hinzugefügt); und Kalendertermine für die kommende Woche von Google Calendar oder Outlook.

Dies ist dazu bestimmt, die 45-90 Minuten zu ersetzen, die die meisten Inhaber Montagmorgens damit verbringen, vier Tabs zu durchsuchen, um ein Bild ihres Zustands zu bekommen. Business Pulse komprimiert das in einen einzelnen strukturierten Bericht, den Sie in 5 Minuten lesen können.

Keine Genehmigung ist erforderlich, da keine Aktion durchgeführt wird — der Workflow liest und berichtet nur.

Zeiteinsparungen: 3-5 Stunden pro Woche, wenn verwendet als wahren Montagmorgen-Ritual, das manuelle Dashboard-Überprüfung ersetzt. Weniger wenn Sie es nur gelegentlich verwenden.

Integrationanforderungen: Mindestens eine finanzielle Integration (QuickBooks oder PayPal). Zusätzliche Integrationen (HubSpot, Google Workspace oder Microsoft 365) erweitern die Abdeckung, sind aber nicht erforderlich.

---

### Stufe 2 — Mittlere Frequenz, hohe Einsparungen (3-5 Stunden/Woche)

**Month-End Close**

Verbindet sich mit QuickBooks und PayPal. Vergleicht QuickBooks-Einnahmendaten mit PayPal-Abrechnungsberichten für den Kalendermonat, identifiziert Transaktionen, die in einem System aber nicht im anderen erscheinen, kennzeichnet Betragsabweichungen, wo dieselbe Transaktion unterschiedlich erfasst wird, und erstellt eine Abstimmungszusammenfassung.

Das Output ist eine strukturierte Tabelle: abgeglichene Transaktionen, nicht abgeglichene Transaktionen, Betragsabweichungen und ein P&L-Entwurf in natürlicher Sprache, den Ihr Buchhalter oder Steuerberater als Ausgangspunkt verwenden kann.

Dies ersetzt Ihren Steuerberater nicht. Es reduziert die Zeit, die Ihr Steuerberater verbringt (und Ihnen berechnet), um rohe Transaktionsdaten zu extrahieren und offensichtliche Abweichungen zu identifizieren, weil diese Arbeit vororganisiert ankommt.

Zeiteinsparungen: 3-4 Stunden pro Monat, komprimiert in eine 30-45-minütige Überprüfungssitzung statt eines halbtägigen Abstimmungsprozesses.

Integrationanforderungen: QuickBooks Online, PayPal Business. Beide sind für vollständige Abstimmung erforderlich — nur mit QuickBooks erstellt der Workflow immer noch eine Transaktionszusammenfassung, kann aber keine systemübergreifende Abstimmung durchführen.

**Payroll Planning**

Verbindet sich mit QuickBooks. Erstellt eine 30-Tage-Kassenprognose, berechnet die Gehaltslaufzeit basierend auf aktuellen Forderungen und erwarteten Abrechnungen, ordnet überfällige Rechnungen nach Größe und Alter (damit Sie wissen, welche Sie vor der Gehaltsabrechnung am meisten jagen sollten) und erstellt eine Checkliste zur Gehaltsbereitschaft.

Dies ist kein Gehaltsprozessor. Es führt keine Gehaltsabrechnung durch, berührt keine Mitarbeiterkonten und ist nicht mit Gusto, ADP oder ähnlichen Plattformen integriert. Es gibt Ihnen die Kassenklarheit, die Sie benötigen, um zu entscheiden, ob Sie die Gehaltsabrechnung wie geplant durchführen, ob Sie die Beitreibung beschleunigen müssen oder ob Sie ein Kreditliniengespräch mit Ihrer Bank führen müssen.

Zeiteinsparungen: 2-3 Stunden pro Zahlungszyklus. Die meisten Inhaber verbringen diese Zeit damit, das gleiche Kassenbild manuell in einer Tabelle zu erstellen.

Integrationanforderungen: QuickBooks Online.

**Campaign Manager**

Verbindet sich mit HubSpot und Canva. Liest Kampagnen-Performance-Daten von HubSpot — E-Mail-Öffnungsraten, Click-Through-Raten, Formularübermittlungen, Deal-Attribution — analysiert was funktioniert hat und was nicht, erstellt eine Promotionsstrategie für die nächste Kampagnenperiode und generiert Markencreatives in Canva basierend auf Ihren bestehenden Markenvorlagen.

Das Output umfasst ein geschriebenes Kampagnen-Brief, Empfehlungen zur Audienz-Segmentierung und einen Satz von Canva-Designs (soziale Grafiken, E-Mail-Header oder Werbecreatives je nach Ihrer Spezifikation) in Größen für die Kanäle, die Sie identifizieren.

Sie überprüfen die Strategie und die kreativen Assets, fordern Revisionen für spezifische Elemente an und exportieren die genehmigten Designs zur Verwendung in Ihren Kampagnen-Plattformen.

Zeiteinsparungen: 3-5 Stunden pro Kampagnenzyklus. Die Einsparungen sind höchsten auf der Design-Seite für Teams ohne dedizierten Grafikdesigner.

Integrationanforderungen: HubSpot (jeder bezahlte Tarif für Analytics — der kostenlose Tarif enthält nicht die für die Analyse erforderlichen Kampagnen-Performance-Daten). Canva (kostenlos oder Pro — Pro wird für Marken-Kit-Zugriff benötigt, was die Output-Qualität erheblich verbessert).

---

### Stufe 3 — Periodische Nutzung, wesentliche Einsparungen (2-4 Stunden/Woche)

**Cash-Flow Forecasting**

Verbindet sich mit QuickBooks und PayPal. Erstellt eine rollende 13-Wochen-Kassenprognose unter Verwendung echter Forderungen, historischer Zahlungszeitpunkte nach Kunde, geplanter zukünftiger Ausgaben und kürzlicher PayPal-Abrechnungsmuster.

Das Output ist eine Woche-für-Woche-Tabelle mit projizierter Kassenlage, gekennzeichneten Mangelrisiko-Wochen (wo projizierte Kasse unter einen von Ihnen festgelegten Schwellenwert fällt) und den kritischsten Forderungen zum Einziehen vor jeder Risikowoche.

Führen Sie dies wöchentlich oder zweiwöchentlich durch, um Kassenüberraschungen zu vermeiden. Der erste Durchlauf dauert 10-15 Minuten zur Überprüfung. Nachfolgende Durchläufe dauern 3-5 Minuten, weil Sie das Format bereits verstehen.

Zeiteinsparungen: 2-3 Stunden pro Woche im Vergleich zum Erhalt einer manuellen Kassenfluss-Tabelle.

Integrationanforderungen: QuickBooks Online. PayPal Business (optional — verbessert die Genauigkeit der Abrechnungszeitpunkte).

**Content Strategist**

Verbindet sich mit HubSpot und Canva, mit optionalem Google Drive-Zugriff für bestehende Content-Assets. Zieht Kampagnen-Performance-Daten, überprüft bestehende Inhalte in Drive wenn verbunden, identifiziert Content-Lücken gegen Ihre Ziel-Audienz und erstellt einen Content-Kalender für die nächsten 4-8 Wochen.

Der Kalender-Output umfasst Themen, empfohlene Formate, vorgeschlagene Veröffentlichungshäufigkeit nach Kanal und Draft-Texte für 2-3 Stücke als Beispiele. Canva-Assets werden für das erste Batch von Posts generiert.

Dies ist am nützlichsten für Unternehmen, die Content als Teil ihrer Kundenakquisitionsstrategie haben — Service-Unternehmen mit Blog, E-Commerce-Marken mit sozialen Kanälen, Berater mit Newsletter.

Zeiteinsparungen: 2-4 Stunden pro Planungszyklus für Unternehmen, die derzeit Content-Kalender manuell erstellen.

Integrationanforderungen: HubSpot (Kampagnen-Performance-Daten), Canva (Asset-Generierung). Google Drive (optional, für Content-Bestand).

**Tax Organizer**

Verbindet sich mit QuickBooks und Google Drive. Erfasst alle steuerbezogenen Transaktionen für den Zeitraum — kategorisierte Ausgaben, Einnahmesummen, Auftragnehmer-Zahlungen, Ausrüstungskäufe — ruft Belege und unterstützende Dokumentation von Google Drive ab, wo Dateinamen und Daten passen und erstellt ein CPA-Paket.

Das CPA-Paket ist ein strukturiertes Dokument: Einnahmen nach Kategorie, abzugsfähige Ausgaben nach Kategorie, Belege angehängt und indexiert, 1099-Kandidaten des Auftragnehmers und eine Liste von Elementen, wo die Dokumentation fehlt oder unsicher ist.

Dies bereitet nicht Ihre Steuererklärung vor. Es bereitet den organisierten Input vor, den Ihr Steuerberater benötigt, und reduziert die Abrechnungsstunden, die Sie in Steuervorbesprechungen und Folgeanfragen verbringen.

Zeiteinsparungen: 6-8 Stunden pro Steuerjahr in Steuervorbesprechungszeit (verteilt über zwei oder drei Sitzungen), plus eine aussagekräftige Reduzierung der CPA-Rechnung, wenn Ihre Firma nach Stunde abrechnet.

Integrationanforderungen: QuickBooks Online, Google Drive (für Belegabruf).

---

### Stufe 4 — Situative Nutzung (1-2 Stunden pro Nutzung)

**Margin Analysis**

Verbindet sich mit QuickBooks. Schlüsselt die Bruttomarge nach Produktlinie, Kundensegment und Vertriebskanal basierend auf Einnahmen- und Kostendaten in QuickBooks auf. Kennzeichnet, welche Produkte, Kunden oder Kanäle die Marge verwässern versus erhöhen.

Führen Sie dies aus, wenn Sie Preisfestsetzungsentscheidungen treffen, das Fallenlassen einer Produktlinie erwägen oder evaluieren, ob ein großer Kunde tatsächlich profitabel ist, nachdem Servicekosten berücksichtigt wurden.

Integrationanforderungen: QuickBooks Online. Erfordert, dass Ihr QuickBooks-Kontenplan die Einnahmen und COGS nach Produktlinie unterscheidet — wenn Sie alle Einnahmen als einzelnen Posten erfassen, wird das Output begrenzt sein.

**Contract Reviewer**

Verbindet sich mit Google Drive oder Microsoft 365 (SharePoint/OneDrive). Liest eingehende Verträge, vergleicht sie mit einem Satz von Standardbedingungen, die Sie definieren (Zahlungsbedingungen, Haftungsgrenzen, IP-Eigentum, Kündigungsfrist-Anforderungen), hebt Abweichungen hervor und erstellt eine redaktionelle Zusammenfassung, die zeigt, was von Ihrem Standard abweicht.

Dies ist keine rechtliche Beratung. Es ist ein Überblicks-Review, das Ihnen sagt, welche Klauseln von Ihrem Standard abweichen und um wie viel — damit Sie wissen, auf welche Probleme sich Ihr Anwalt konzentrieren muss, statt diese selbst zu finden.

Integrationanforderungen: Google Drive oder Microsoft 365 (für Dokumentzugriff). Sie müssen Ihre Standard-Vertragsbedingungen in natürlicher Sprache während der Anfangseinrichtung definieren — typischerweise ein einmaliger 30-Minuten-Prozess.

**Business Monitoring**

Verbindet sich mit allen aktiven Integrationen. Läuft nach einem von Ihnen definierten Zeitplan und kennzeichnet Anomalien: ein Kunde, der normalerweise in 20 Tagen zahlt und jetzt bei 35 Tagen ist; ein Deal-Stadium, das seit 21 Tagen nicht mehr vorangekommen ist; eine wöchentliche Einnahmensumme mehr als 25% unter dem 4-Wochen-Durchschnitt; ein PayPal-Streit, der geöffnet wurde und nicht behoben wurde.

Monitoring ist passiv — es liest über Ihre Systeme und hebt die Abweichungen hervor, die Ihre Aufmerksamkeit verdienen, ohne Maßnahmen zu ergreifen. Sie erhalten eine strukturierte Alert-Liste und entscheiden, was zu untersuchen ist.

Integrationanforderungen: Mindestens zwei aktive Integrationen. Monitoring ist am nützlichsten, je mehr Integrationen Sie verbunden haben, weil der Wert im systemübergreifenden Bild liegt.

**Cold Outreach**

Verbindet sich mit HubSpot. Gegeben ein Zielunternehmen oder Kontakt, erstellt eine personalisierte First-Touch-E-Mail basierend auf der Industrie des Prospects, Rolle und beliebige öffentliche Signale, die Sie angeben. Nach einem Treffen oder Anruf erstellt einen strukturierten Call Summary und erstellt eine Follow-up-E-Mail. Für Prospects in einer Multi-Touch-Sequenz generiert den nächsten Follow-up basierend darauf, wo sie in der Sequenz sind und wie sie sich engagiert haben.

Zeiteinsparungen: 20-30 Minuten pro Prospect versus manuelles Verfassen, was sich über eine vollständige Outreach-Liste signifikant summiert.

Integrationanforderungen: HubSpot (für Kontaktdatensätze und Sequenz-Tracking).

**Meeting to Action**

Akzeptiert ein Meetings-Transkript (eingefügt oder hochgeladen von Google Drive). Erstellt eine strukturierte Meetings-Zusammenfassung mit getroffenen Entscheidungen, offenen Fragen und Aktionselementen mit Eigentümern. Erstellt Follow-up-E-Mails für jeden Teilnehmer. Protokolliert wichtige CRM-Notizen zu relevanten HubSpot-Kontakten oder Deals.

Führen Sie dies unmittelbar nach jedem Treffen aus, bei dem Follow-up wichtig ist: Verkaufsgespräche, Kundenbewertungen, Lieferantenverhandlungen, Team-Standups.

Integrationanforderungen: Google Drive (optional, für Transkript-Upload). HubSpot (optional, für CRM-Notiz-Protokollierung).

**Email Campaign**

Verbindet sich mit HubSpot. Segmentiert Ihre Kontaktliste basierend auf Kriterien, die Sie angeben, generiert 2-3 Betreffzeilen-Varianten pro E-Mail, schreibt Body-Texte für jede Variante und richtet A/B-Test-Parameter in HubSpot ein. Alle Texte sind in Ihrer Marken-Stimme verfasst und wurden überprüft, bevor irgendeine Kampagne aktiviert wird.

Integrationanforderungen: HubSpot (Marketing Hub Starter oder höher — der kostenlose Tarif hat keine A/B-Test- oder Kampagnen-Versand-Funktionalität).

---

## Wie man es einrichtet

Die Einrichtung dauert insgesamt 2-3 Stunden. Verteilen Sie sie auf zwei Sitzungen, statt sie in eine zu hetzen.

**Schritt 1: Abonnement für Claude Pro oder Team**

Claude Pro kostet $20/Monat und ist ausreichend für einen Inhaber, der die meisten Workflows ausführt. Wenn mehrere Teamkollegen das System gleichzeitig nutzen, ist Claude Team zu $30/Nutzer/Monat der richtige Plan. Beide Pläne beinhalten alle 15 Workflows — es gibt kein separates Small Business-Abonnement.

**Schritt 2: Zugriff auf Claude Cowork**

Claude for Small Business lebt in Claude Cowork — der GUI-Schnittstelle zu Claudes agentic Fähigkeiten. Öffnen Sie Claude Cowork vom Claude-Dashboard. Sie werden ein Workflows-Panel in der linken Seitenleiste sehen.

**Schritt 3: Schreiben Sie Ihren Geschäftskontext**

Bevor Sie etwas verbinden, erstellen Sie ein Business Context-Dokument in Claude. Das sind 200-400 Wörter, die beschreiben: was Ihr Unternehmen macht, wer Ihr idealer Kunde ist (Branche, Unternehmensgröße, Rolle, Geographie), Ihren Kommunikationston (formal, freundlich, direkt), alle spezifischen Begriffe oder Ausdrücke, die Sie in Ihrer Branche verwenden und wie typische Deals oder Transaktionen aussehen.

Dieser Schritt hat die höchste Hebelwirkung bei der Einrichtung. Jeder Workflow liest Ihren Geschäftskontext und nutzt ihn, um Outputs zu personalisieren. Ihn zu überspringen bedeutet, dass Claude technisch korrekte aber generische Outputs erstellt — die gleiche Rechnungs-Follow-up-E-Mail, die er für jedes Unternehmen schreiben würde, nicht eine, die aussieht, als würde Ihr Team sie schreiben.

**Schritt 4: Verbinden Sie Ihre Integrationen**

Vom Cowork-Einstellungs-Panel aus verbinden Sie jedes Tool über OAuth. Die Verbindungen sind einmalige Autorisierungen — Sie müssen nicht bei jeder Nutzung erneut autorisieren.

Verbinden Sie in dieser Reihenfolge basierend auf den Workflows, die Sie zuerst nutzen möchten:
- QuickBooks Online: erforderlich für Invoice Chasing, Month-End Close, Cash-Flow Forecasting, Payroll Planning, Margin Analysis, Tax Organizer
- HubSpot: erforderlich für Lead Triager, Campaign Manager, Content Strategist, Cold Outreach, Email Campaign
- PayPal Business: erforderlich für Business Pulse (finanzielle Ansicht), Month-End Close (Abstimmung), Cash-Flow Forecasting (Abrechnungs-Genauigkeit)
- Google Workspace oder Microsoft 365: erforderlich für Business Pulse (Kalender), Tax Organizer (Belege), Contract Reviewer, Meeting to Action
- Canva: erforderlich für Campaign Manager, Content Strategist
- DocuSign: nutzt Contract Reviewer (für Routing nach Überprüfung), Tax Organizer (für CPA-Paket-Versand)
- Slack: nutzt Business Monitoring (Alert-Versand)

Verbinden Sie nicht alles am ersten Tag, wenn Sie nicht entschieden haben, welche Workflows zuerst aktiviert werden. Verbinden Sie nur, was Sie für Ihren ersten Workflow benötigen, überprüfen Sie, dass es funktioniert, dann fügen Sie den nächsten hinzu.

**Schritt 5: Aktivieren Sie Ihren ersten Workflow**

Beginnen Sie mit einem Workflow. Die starke Empfehlung ist Invoice Chasing — es hat den deutlichsten ROI (Sie wissen genau, wie viel Geld ausstehend ist), das niedrigste Risiko (Sie überprüfen jede E-Mail, bevor sie versendet wird) und erstellt ein konkretes Liefergut innerhalb der ersten Sitzung.

Aktivieren Sie den Workflow vom Workflows-Panel. Führen Sie ihn einmal manuell aus. Lesen Sie das Output sorgfältig durch. Notieren Sie, was Claude richtig verstanden hat und was es falsch verstanden hätte, wenn Sie es nicht überprüft hätten. Dieser erste Durchlauf ist die schnellste Art zu lernen, wie Sie Ihren Geschäftskontext anpassen, um zukünftige Outputs zu verbessern.

**Schritt 6: Erweitern Sie absichtlich**

Fügen Sie einen Workflow pro Woche für den ersten Monat hinzu. Die Einschränkung ist nicht technisch — sie ist Ihre Kapazität, Outputs nachdenklich zu überprüfen. Die Aktivierung aller 15 Workflows in der ersten Woche erstellt 15 Sätze von Outputs, von denen nur wenige richtig überprüft werden, und die Workflows, die nicht überprüft werden, sind diejenigen, die Fehler erstellen, die Sie nicht erfassen.

---

## Detaillierte Integrationanforderungen

Jede Integration hat ihre eigenen Anforderungen. Was Sie benötigen, variiert je nach Workflow.

**QuickBooks Online**

Jedes aktive QuickBooks Online-Abonnement funktioniert. QuickBooks Desktop verbindet sich nicht — die OAuth-Integration ist nur QuickBooks Online. Simple Start, Essentials, Plus und Advanced werden alle unterstützt.

Die Workflows Invoice Chasing, Month-End Close und Payroll Planning sind sehr nützlich mit QuickBooks Plus oder höher, weil diese Pläne Klassen- und Standortverfolgung beinhalten, was dem Workflow Margin Analysis ermöglicht, die Rentabilität nach Produktlinie oder Standort zu unterteilen. Auf Simple Start ist Margin Analysis auf Gesamtunternehmenssummen beschränkt.

**PayPal Business**

Erfordert ein PayPal Business-Konto (nicht Persönlich). Die Business-Konto-API-Verbindung gibt Claude Zugriff auf Transaktionshistorie, Abrechnungsberichte, Streitstatus und Auszahlungsdaten. Claude hat keinen Zugriff, um Transfers zu initiieren, Transaktionen umzukehren oder Kontoeinstellungen zu ändern.

Wenn Ihr Unternehmen Zahlungen über Stripe, Square oder einen anderen Prozessor statt PayPal abwickelt, werden diese Integrationen nicht nativ im Workflow-Set unterstützt. Die finanziellen Workflows können immer noch mit nur QuickBooks-Daten laufen, mit reduzierter Genauigkeit bei den Abrechnungszeitpunkten.

**HubSpot**

Der kostenlose Tarif von HubSpot unterstützt Lead Triager, Cold Outreach, Meeting to Action und das Basis-Kontakt-Management. Campaign Manager und Email Campaign erfordern Marketing Hub Starter ($45/Monat oder höher) für Kampagnen-Analytics und A/B-Versand-Funktionalität. Content Strategist nutzt HubSpot-Kampagnendaten wenn verfügbar, kann aber auf dem kostenlosen Tarif mit reduzierter analytischer Tiefe laufen.

Wenn Sie Salesforce, Pipedrive oder ein anderes CRM nutzen, verbinden diese nicht mit den nativen Small Business-Workflows zum Mai 2026 Launch.

**Canva**

Der kostenlose Tarif verbindet sich und unterstützt Asset-Generierung. Canva Pro ($15/Monat oder in einigen Team-Plänen enthalten) wird dringend für Campaign Manager und Content Strategist empfohlen, weil Pro-Konten Marken-Kits beinhalten — Ihre genauen Schriften, Farben und Logo — die Claude nutzt, um On-Brand-Assets zu generieren. Ohne Marken-Kit generiert Claude visuell saubere Assets, die möglicherweise nicht Ihrer Markenidentität entsprechen.

**DocuSign**

Erfordert DocuSign Business Pro oder höher. Der Standard Personal-Plan beinhaltet keinen API-Zugriff. DocuSign wird von Contract Reviewer (zum Routing genehmigter Verträge zur Unterzeichnung) und optional von Tax Organizer (zum Versand des CPA-Pakets zur Bestätigung) genutzt. Die DocuSign-Verbindung ist optional — beide Workflows erstellen ihre Outputs ohne sie; die Integration fügt einfach einen Send-to-Signature-Schritt am Ende der Überprüfung hinzu.

**Google Workspace**

Jeder Google Workspace-Plan (Business Starter, Standard, Plus oder Enterprise) funktioniert. Die Verbindung erfordert eine OAuth-Genehmigung von einem Admin-Konto, wenn Ihr Workspace Admin-beschränkte OAuth-Richtlinien hat. Für Solo-Unternehmer mit einem persönlichen Google-Konto ist die Verbindung unkompliziert.

Gmail, Google Drive, Google Calendar und Google Sheets sind alle unter der einzelnen Google Workspace-Verbindung abgedeckt. Sie autorisieren nicht jeden Service getrennt.

**Microsoft 365**

Business Basic ($6/Nutzer/Monat) oder höher unterstützt die Verbindung. Persönliche Microsoft-Konten funktionieren für Solo-Betreiber. Die Verbindung deckt Outlook (E-Mail und Kalender), OneDrive und SharePoint ab. Die gleiche Gmail-oder-Outlook-Wahl gilt überall — Business Pulse liest Ihren Google Calendar oder Ihren Outlook-Kalender, nicht beide gleichzeitig.

**Slack**

Jeder Slack-Plan (Free, Pro, Business+, Enterprise) unterstützt die Slack-Integration. Business Monitoring nutzt Slack, um Alert-Nachrichten an einen von Ihnen benannten Kanal zu versenden. Die Integration liest keine Kanal-Historie und postet keine unaufgeforderten Nachrichten — sie postet nur die Alerts, die Sie konfiguriert haben.

---

## Datenberechtigung-Modell

Das Verständnis des Datenmodells verhindert sowohl Über-Vertrauen als auch unnötige Angst.

**Was Claude zugreift:** Nur das, was Sie explizit über OAuth autorisieren und nur wenn ein Workflow aktiv läuft. Es gibt keine Hintergrund-Datenerfassung, kein persistentes Konto-Polling und keine Daten, die zwischen Sitzungen gespeichert werden.

**Schreibzugriff:** Schreibzugriff wird pro Integration gewährt, aber durch Workflow-Design begrenzt. Claude erstellt oder modifiziert keine QuickBooks-Einträge ohne Ihre Genehmigung. Claude versendet keine E-Mails ohne Ihre Genehmigung. Claude aktualisiert keine HubSpot-Datensätze ohne Ihre Bestätigung. Die OAuth-Berechtigungen könnten technisch Schreibzugriff erlauben (weil diese Integrationen es für die genehmigungsgestützten Aktionen erfordern), aber die Workflows sind gebaut, um das Output zur Überprüfung zu präsentieren, bevor etwas geschrieben wird.

**Datenschulung:** Anthropic nutzt über verbundene Integrationen zugegrenzte Geschäftsdaten nicht zum Trainieren von Claude. Ihre Kundennamen, Rechnungsbeträge, E-Mail-Inhalte und CRM-Datensätze werden nicht für die Modellverbesserung behalten.

**Enterprise-Optionen:** Claude Team und Claude Enterprise-Pläne beinhalten zusätzliche Datenkontrollen: Datenresidenz-Optionen (EU-Residenz für Unternehmen mit GDPR-Verpflichtungen), Audit-Logs, die zeigen, welche Workflows auf welche Integrationen zugegriffen haben und wann und Admin-Level-Kontrolle darüber, welche Workflows Teamkollegen aktivieren können.

---

## Human-in-the-Loop-Design

Das genehmigungsgestützte Design ist keine Begrenzung — es ist die richtige Architektur für bedeutsame Geschäftsoperationen.

Jeder Output, den Claude erstellt, ist eine Draft-Empfehlung. Die Kategorien sind: E-Mails verfasst aber nicht versendet, Dokumente gekennzeichnet aber nicht geändert, Leads bewertet aber nicht handeln, Kassenprognosen berechnet aber nicht veröffentlicht, Verträge redaktionell überarbeitet aber nicht zurückgegeben. Nichts bewegt sich vom Claude-Output zu Ihren externen Systemen ohne eine absichtliche menschliche Aktion.

Dies ist wichtig aus drei Gründen:

**Fehler.** Claude macht Fehler. Er missliest ein Rechnungsdatum, missidentifiziert ein Kundenzahlungsmuster oder schreibt eine Follow-up-E-Mail mit dem falschen Dringlichkeitsniveau. Diese Fehler werden erfasst, wenn Sie das Output überprüfen. Sie werden Probleme nur, wenn Sie die Überprüfung umgehen.

**Kontext, den Claude nicht hat.** Sie wissen, dass der Kunde, der für aggressive Beitreibung gekennzeichnet ist, eine schwierige Situation durchmacht und Sie ihn persönlich handhaben möchten. Sie wissen, dass der Deal in HubSpot gelähmt ist, weil Sie auf einen Reference-Anruf warten, nicht weil der Prospect kalt geworden ist. Claude kann nicht wissen, was Sie ihm nicht gesagt haben. Die Überprüfungs-Schritt ist, wo Ihr Urteilsvermögen das ausfüllt, das die Daten nicht zeigen können.

**Rechtliche und finanzielle Exposition.** Eine fehlerhaft an einen Kunden versendete E-Mail kann nicht un-versendet werden. Eine falsch erfasste Rechnung erstellt ein Abstimmungsproblem. Eine Vertragsklausel, die Sie übersehen, weil Sie die Überprüfung zu schnell vertraut haben, wird eine Haftung. Die Überprüfungs-Schritt ist Ihr letztes Kontrolltor und 2 Minuten zu sparen ist kein Handel, der sich lohnt.

---

## Was Sie in den ersten 90 Tagen erwarten können

**Tage 1-7: Einrichtung und erster Durchlauf**

Planen Sie 2-3 Stunden für die Einrichtung über zwei Sitzungen. Die erste Sitzung deckt Abonnement, Geschäftskontext und erste Integration. Die zweite Sitzung deckt den ersten Workflow-Durchlauf und die Output-Überprüfung. Bis Ende der Woche eins sollten Sie Invoice Chasing oder Business Pulse mindestens einmal ausgeführt haben und verstehen, wie das Output aussieht.

**Tage 8-21: Gewohnheit aufbauen**

Führen Sie Ihren ersten Workflow bei seiner natürlichen Cadence aus. Invoice Chasing läuft wöchentlich oder wenn Sie einen Stapel überfälliger Rechnungen haben. Business Pulse läuft jeden Montag. Fügen Sie keinen zweiten Workflow hinzu, bis der erste Teil Ihrer Routine ist. Die Disziplin, Claudes Output sorgfältig zu überprüfen — jeden E-Mail-Draft zu lesen, bevor Sie genehmigen, nicht den Stapel zu tampon-versiegeln — ist eine Gewohnheit, die 2-3 Wochen zu etablieren braucht.

**Tage 22-30: Zweiten Workflow hinzufügen**

Nach 3 Wochen fügen Sie einen weiteren Workflow hinzu. Der empfohlene zweite Workflow hängt von Ihrem Unternehmenstyp ab: Lead Triager für Service-Unternehmen und B2B-Betreiber; Month-End Close für jedes Unternehmen mit einem QuickBooks-Abstimmungsproblem; Campaign Manager für Einzelhandel und E-Commerce.

**Tage 31-60: Drei bis vier aktive Workflows**

Bis Ende des zweiten Monats führen die meisten Benutzer 3-4 Workflows regelmäßig aus. Die eingesparte Zeit ist typischerweise 6-10 Stunden pro Woche zu diesem Punkt. Die Qualität der Outputs hat sich verbessert, weil Sie Ihr Geschäftskontext-Dokument basierend auf dem, was Claude ständig im ersten Monat falsch verstanden hat, verfeinert haben.

**Tage 61-90: Etablieren Sie den vollständigen Rhythmus**

Bei 90 Tagen führen Benutzer, die den Ausbreitungs-Ansatz folgen, 6-8 Workflows aus, was 8-12 Stunden pro Woche auf der mechanischen Arbeit spart, die diese Workflows abdecken. Einige Inhaber in diesem Stadium erweitern das System mit Claude Projects — erstellen benutzerdefinierte Prompts für Workflows, die die 15 vorgefertigten Optionen nicht abdecken — aber das ist optional und erfordert mehr Engagement mit Claudes zugrundeliegenden Fähigkeiten.

---

## Erfolgsmuster von frühen Anwendern

Die folgenden Muster entstanden aus Unternehmen, die Claude for Small Business im ersten Quartal nach dem Mai 2026 Launch annahmen.

**Beginnen Sie mit Invoice Chasing.** Über Unternehmenstypen war dies der höchste-ROI-Startpunkt. Der Grund ist Spezifität: Der Workflow liest tatsächliche Rechnungsdaten und erstellt spezifische, personalisierte Drafts. Der Output-Qualität-Unterschied zwischen Claude mit QuickBooks-Zugriff und Claude ohne ist unmittelbar sichtbar. First-Time-Benutzer verstehen die Produktwert-These innerhalb der ersten Sitzung.

**Bauen Sie Business Pulse in den Montagmorgen ein.** Inhaber, die Business Pulse in den ersten vier Wochen jeden Montag ausführten, bewerteten es konstant als ihren höchsten-Wert-Workflow nach der anfänglichen Periode — obwohl es weniger Zeit pro Durchlauf spart als Invoice Chasing. Der Wert ist der wöchentliche Rhythmus und die Frühwarn-Funktion. Inhaber, die Montags übersprangen und ihn gelegentlich ausführten, bekamen weniger davon.

**Finanzielle Workflows nach 30 Tagen hinzufügen.** Month-End Close und Payroll Planning erstellen Outputs, die höher-Einsatz-Ansicht fühlen als Rechnungs-Follow-ups. Inhaber, die diesen Workflows vom ersten Tag vertrauten, erfassten gelegentlich Fehler, die sie nicht erfasst hätten, wenn sie weniger sorgfältig gewesen wären. Zu warten, bis Sie vertrauensvoll in Claudes Output-Format sind — und in Ihre eigene Fähigkeit, einen Fehler zu erkennen — reduziert das Risiko, auf eine falsch gelesene Abstimmung zu handeln.

**Industrie-spezifische Hinzufügungen:** Service-Unternehmen (Berater, Agenturen, Auftragnehmer) bewerteten Lead Triager konstant am höchsten nach Invoice Chasing. Einzelhandels- und E-Commerce-Unternehmen bekamen die höchste Rückkehr von Campaign Manager und Content Strategist. Professional Services-Firmen (Recht, Rechnungswesen, Architektur) fanden Contract Reviewer am meisten unterschieden, weil es sinnvolle Anwaltsüberprüfungszeit auf eingegangenen Lieferantenvereinbarungen sparte.

---

## Häufige Fehler-Muster

**Aktivieren Sie alle 15 Workflows in Woche eins.** Die Outputs sammeln sich schneller an, als Sie sie überprüfen können. Ungeprüfte Outputs bleiben untätig. Workflows, die handhabbare Outputs erstellen, die Sie niemals handeln, werden Gewohnheitsformung in die falsche Richtung — Sie beginnen, sie als Rauschen statt Signal zu behandeln. Beginnen Sie mit einem.

**Überspringen Sie die Überprüfungs-Schritt.** Claudes erste-Entwurf-Rechnungs-E-Mails sind gut aber nicht perfekt. Beim ersten Durchlauf werden Sie 2-3 finden, die Bearbeitung brauchen. Beim zehnten Durchlauf werden es 0-1 sein. Der Bearbeitungs-Prozess ist, wie Sie Claudes Verständnis Ihrer Stimme verfeinern. Ihn zu umgehen, um kurzfristig Zeit zu sparen, bedeutet, dass sich die Outputs nie verbessern und der erste Fehler, den Sie übersehen und der tatsächlich einen Kunden erreicht, kostet mehr als die Zeit, die Sie sparten.

**Nutzen Sie vage Inputs.** Claudes Output-Qualität ist direkt proportional zur Spezifität des Kontexts, den Sie vorbringen. Ein Geschäftskontext-Dokument, das sagt „wir sind eine Marketing-Agentur, die kleinen Unternehmen hilft" erstellt generische Outputs. Einer, der sagt „wir sind eine 4-köpfige Performance-Marketing-Agentur in Austin, die E-Commerce-Marken mit $1-10M Umsatz bedient, konzentriert auf Meta und Google Ads, mit einem direkten und ergebnis-orientierten Kommunikationsstil" erstellt Outputs, die aussehen, als hätte Ihr Team sie geschrieben.

**Nicht den Geschäftskontext aktualisieren.** Wenn sich Ihr ICP ändert, Ihre Preisgestaltung ändert oder Ihr Geschäftsmodell sich verschiebat, aktualisieren Sie Ihren Geschäftskontext-Dokument. Claude nutzt den Kontext von Ihrer neuesten Aktualisierung. Veralteter Kontext erstellt Outputs, die auf wo Ihr Unternehmen vor sechs Monaten war, kalibriert sind.

**Behandeln Sie Lead Triager als Ersatz für Verkaufs-Urteilsvermögen.** Lead-Scores sind Inputs zu Ihrem Sales-Prozess, keine Entscheidungen. Ein Lead mit 85/100 Punkten von Claude ist ein High-Fit-Lead basierend auf den Daten in HubSpot. Es ist nicht sicher, dass Sie alles fallen lassen sollten, um sie anzurufen. Und ein Lead mit 40/100 Punkten von Claude könnte Ihr nächster bester Kunde sein, wenn Sie etwas über sie wissen, das HubSpot nicht erfasst.

**Erwarten Sie, dass Contract Reviewer rechtliche Beratung bietet.** Der Workflow liest Verträge und kennzeichnet Abweichungen von Ihren Standardbedingungen. Er kann nicht mehrdeutige Klauseln interpretieren, Risiken im Kontext bewerten oder beraten, ob zu unterzeichnen. Er ist ein Vor-Überprüfungs-Tool, das Ihre Anwaltszeit auf Wert reduziert, kein Ersatz für den Anwalt.

---

## Nicht dafür

**Komplexe finanzielle Entscheidungen, die Steuerberater-Urteilsvermögen erfordern.** Month-End Close erstellt eine strukturierte Abstimmung. Tax Organizer erstellt ein organisiertes CPA-Paket. Keiner erstellt Steuer-Strategie, Entity-Strukturierungs-Beratung oder Anleitung zu Grauzone-Abzügen. Diese erfordern professionelles Urteilsvermögen, das kein KI-Workflow ersetzen sollte.

**Rechtliche Interpretation.** Contract Reviewer kennzeichnet Abweichungen von Ihrem Standard. Er kann nicht sagen, ob eine nicht-standard-Klausel akzeptabel angesichts Ihrer Verhandlungs-Position, Ihrer Beziehung zur Gegenpartei oder der das Vertrag regelnden Gerichtsbarkeit ist.

**Vollständig autonome Operationen.** Wenn Sie möchten, dass KI ohne Ihre Beteiligung läuft — scanning, entscheidend, versendend, postend, zahlend — ist Claude for Small Business das falsche Tool. Das genehmigungsgestützte Design ist absichtlich und nicht negotiierbar. Jede bedeutsame Aktion erfordert Ihre explizite Bestätigung.

**Ersetzen Sie Ihre Geschäftssoftware.** QuickBooks, HubSpot, Canva und die anderen integrierten Tools bleiben die Datensatz-Systeme. Claude liest von ihnen und assistiert mit der Begründungs- und Schreib-Schicht oben. Ihr QuickBooks-Abonnement zu beenden und zu erwarten, dass Claude Ihre Buchhaltung handhaben kann, ist kein unterstützter Use-Case und würde Sie ohne ein finanzielles Datensatz-System verlassen.

**Unternehmen ohne die unterstützten Integrationen.** Wenn Ihr Unternehmen auf Salesforce, Xero, FreshBooks, Stripe, Square oder anderen Plattformen nicht in der aktuellen Integrations-Liste läuft, verbinden sich die vorgefertigten Workflows nicht. Die allgemeine Claude Cowork-Plattform kann immer noch mit Dokument- und E-Mail-Arbeit assistieren, aber die integrierten Workflow-Automationen erfordern die spezifischen Tool-Verbindungen, die oben aufgelistet sind.

---

## Über die 15 Workflows hinausgehen

Nach 60-90 Tagen regelmäßiger Nutzung finden einige Inhaber, dass die vorgefertigten Workflows bestimmte, für ihr Unternehmen spezifische, wiederkehrende Aufgaben nicht abdecken. An diesem Punkt wird Claude Projects zur natürlichen Erweiterung.

Ein Claude Project ist eine persistente Kontext-Umgebung, wo Sie benutzerdefinierte Workflows mit Prompts in natürlicher Sprache definieren können, die von den gleichen Integrations-Verbindungen unterstützt werden, die Sie bereits autorisiert haben. Ein benutzerdefinierten Workflow bauen, erfordert mehr Claude-Fluss als einen vorgefertigten einzuschalten, aber Inhaber, die das System 90 Tage nutzen, haben generell diese Fluss.

Benutzerdefinierte Erweiterungen, die frühe Anwender in den ersten 90 Tagen bauten, beinhalten: benutzerdefinierte wöchentliche Berichtings-Templates spezifisch zu ihrer Industrie, Lieferanten-Onboarding-Kommunikations-Sequenzen, Kundensgebruachs-Check-Listen auto-vollständig von HubSpot und Preis-Vorschlags-Generatoren, die von einer Google Sheet von Service-Paketen und -Raten ziehen.

Die vorgefertigten 15 Workflows sind die On-Ramp. Claude Projects sind die Autobahn.

---
