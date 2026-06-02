# CRM-Hygiene

## Wann aktivieren

Aktivieren Sie diese Fähigkeit, wenn:
- Ein SDR jeden ausgehenden/eingehenden Kontakt abgeschlossen hat (Anruf, E-Mail, LinkedIn-Nachricht, Voicemail)
- Bevor ein AE an einem Treffen mit einem Interessenten teilnimmt
- Bei der Pipeline-Überprüfung, um die Datenintegrität vor dem Deal-Fortschritt sicherzustellen
- Wenn CRM-Datensätze unvollständige oder veraltete Aktivitätsprotokolle aufweisen (>2 Stunden seit letztem Kontakt)
- Beim Planen einer Übergabe zwischen SDR und Verkaufsteam
- Wenn ein Deal zwischen Pipeline-Stufen verschoben wird (erfordert Feldvervollständigungs-Gate)

## Wann nicht verwenden

Rufen Sie diese Fähigkeit nicht auf für:
- Aktivitäten nach dem Verkauf in der Kundenunterstützung (verwenden Sie stattdessen Customer-Success-CRM-Vorlagen)
- Nur interne Teamtreffen oder Admin-Aktivitäten
- Rückwirkende Bereinigung alter Datensätze (>90 Tage) ohne expliziten Audit-Trigger
- Aktivitäten ohne Kundenkontakt (z. B. Recherche, Team-Admin)
- Konten als DEAD gekennzeichnet, die seit 6+ Monaten keine neuen Signale haben (stattdessen archivieren)

---

## Anweisungen

### I. Post-Call-Notiz-Vorlage

Jeder Anruf – eingehend oder ausgehend, erfolgreich oder fehlgeschlagen – muss innerhalb von 2 Stunden mit diesen Feldern protokolliert werden:

#### Erforderliche Felder

**Was ist passiert**
Disposition in genau einem Satz. Verwenden Sie standardisierte Codes:
- `Connected` – echte Person hat beantwortet, Gespräch hat stattgefunden
- `Left VM` – Voicemail hinterlassen, Art des gehörten Grußes angeben (allgemein/personalisiert)
- `No Answer` – Anruf durchgestellt, keine Antwort
- `Bad Number` – Nummer ungültig, unterbrochen oder falsche Person erreicht
- `Gatekeeper` – von Assistent/Empfang gefiltert, keine Verbindung zum Zielkontakt

*Beispiel:* „Verbunden mit Jennifer Martinez, CMO, für 12 Min. Sie hat direkt meine Frage zu Initiative X beantwortet."

**Erwähnte Hauptprobleme**
Erfassen Sie exakte Interessenten-Formulierungen in Anführungszeichen. Nicht paraphrasieren – direkte Zitate sind Gold für Einwand-Handling und Personalisierung in zukünftigen Kontakten.

*Beispiel:* „Sie sagte: ‚Wir sind an [Legacy System] gebunden und können die Kosten für einen Wechsel nicht rechtfertigen. Unser CFO wird neuen Tool-Ausgaben erst im nächsten Geschäftsjahr genehmigen.'"

**Qualifikationsstatus**
Ordnen Sie den bisherigen MEDDPICC-Elementen zu:
- **Metrics**: Wurde eine Revenue-Impact-Zahl erwähnt? Ist ein Budget zugeteilt?
- **Economic Buyer**: Haben Sie ihn erreicht/identifiziert? Rolle bestätigt?
- **Decision Criteria**: Nach welchen Kriterien evaluieren sie? Geschwindigkeit, Kosten, Integration?
- **Decision Process**: Timeline bestätigt? Genehmigungsebenen identifiziert?
- **Pain**: Anerkannt und quantifiziert?
- **Identified Champion**: Gibt es einen internen Befürworter?
- **Implications**: Haben sie die geschäftliche Konsequenz erläutert?
- **Commitment**: Welcher nächste Schritt wurde zugesagt?

Markieren Sie jedes Element als `Confirmed`, `Partial`, oder `Missing`. Dies bestimmt die Bereitschaft für AE-Übergabe.

*Beispiel:*
```
Metrics: Confirmed (£2M jährliches Budget erwähnt)
Economic Buyer: Missing (mit Benutzer gesprochen, nicht CFO/VP Finance)
Decision Criteria: Partial (Geschwindigkeit erwähnt, Kostentolerant unklar)
Pain: Confirmed (exaktes Zitat erfasst)
Champion: Missing
```

**Nächster Schritt**
Spezifische, datierte Maßnahme mit Verantwortlichem. Nicht vage. Enthalten Sie:
- Was: genaue nächste Aktion (Anruf, E-Mail mit Ressource, Treffen)
- Verantwortlicher: SDR-Name oder AE-Name, falls Übergabe
- Datum: Kalenderdatum, nicht „nächste Woche"
- Notfall: Was passiert, wenn sie in 5 Tagen nicht antworten?

*Beispiel:* „SDR (Sarah) sendet 3-Min-Produktübersicht-Video bis 2026-06-05. Wenn bis 2026-06-10 keine Antwort, an AE-Follow-up eskalieren."

**Einwände erhoben**
Protokollieren Sie jeden Einwand wörtlich. Fügen Sie Ihre Antwort hinzu, falls gegeben. Nehmen Sie nicht an, dass dies Deal-Killer sind – sie sind Daten für AE-Vorbereitung.

*Beispiel:*
```
Einwand: „Wir haben einen Incumbentanbieter und sind bis Q3 2027 gebunden."
Antwort gegeben: „Verstanden. Wenn Q3 näher rückt, würde es Sinn machen, 90 Tage voraus Optionen zu evaluieren?"
Follow-up-Flag: Ja – 2026-04-01 zurückgreifen, wenn Vertragserneuerung näher rückt.
```

---

### II. Standards für Aktivitätsprotokolle

**Timing**: Protokollieren Sie jede Aktivität innerhalb von 2 Stunden nach Abschluss. Keine Batching-Arbeit am Ende des Tages.

**Erfassung**: Protokollieren Sie jeden Kontakt, einschließlich:
- Telefonanrufe (eingehend/ausgehend)
- Hinterlassene Voicemails
- Versendete E-Mails (enthalten Sie Betreff-Snippet)
- LinkedIn-Nachrichten, Verbindungsanfragen, Profilaufrufe bei aktiven Konten
- Demos, Webinar-Teilnahme, Content-Downloads
- Aufgabenvervollständigungen (Follow-up geplant, Ressource gesendet)

**Disposition-Codes (Standardisiert)**

| Aktivitätstyp | Code | Definition |
|---|---|---|
| Anruf | Connected | Live-Gespräch mit Zielkontakt |
| Anruf | Left VM | Voicemail hinterlassen; Grußstil protokollieren |
| Anruf | No Answer | Angerufen, keine Antwort, keine VM; erneut versuchen |
| Anruf | Bad Number | Ungültig, falsche Person oder Gatekeeper-Ablehnung |
| E-Mail | Sent | Zeitstempel beim Versand; Betreff dokumentieren |
| E-Mail | Opened | Via Pixel oder Antwort-Annahme verfolgen |
| E-Mail | Replied | Antwort-Stimmung notieren (positiv/neutral/negativ) |
| E-Mail | Bounced | Unzustellbar; zur Neurecherche markieren |
| LinkedIn | Message Sent | Personalisierungsniveau notieren |
| LinkedIn | Profile View | Nur wenn Konto ACTIVE-Tier ist (siehe Tagging) |
| Sonstiges | Task Completed | Ressource gesendet, Anruf geplant, Follow-up protokolliert |

---

### III. Pipeline-Tagging-Taxonomie

**Jeder Lead-Datensatz muss alle vier Tag-Ebenen haben.** Verwenden Sie diese genauen Tags; erfinden Sie keine Varianten.

#### Lead-Source-Tag (Eines erforderlich)
- `INBOUND` – eingehende Anfrage, Formulareinreichung, Empfehlung, Event-Teilnehmer
- `POSTBOUND` – Post-Event-Nurture, Webinar-Teilnehmer, Blog-Downloader
- `BRIDGEBOUND` – warme Einführung, gegenseitige Verbindungs-Empfehlung
- `OUTBOUND` – kalter Kontakt, LinkedIn-Nachricht, E-Mail-Listen-Kauf

#### Signal-Tag (Was Kontakt ausgelöst hat)
Erfassen Sie den spezifischen Grund für Engagement:
- `Hiring_Spree` – LinkedIn zeigt neuen Personalbestand (Einstellungsseite, Job-Postings)
- `Funding_Event` – Serie A/B-Abschluss, Pressemitteilung, Crunchbase-Signal
- `Leadership_Change` – neuer CMO, CFO, VP Engineering eingestellt (LinkedIn)
- `Integration_Partnership` – angekündigte Partnerschaft mit Tool-Ökosystem
- `Compliance_Change` – neue Regelung mit Auswirkungen auf ihre Branche (SOC 2, HIPAA, GDPR)
- `Earnings_Call` – börsennotiertes Unternehmen, Earnings-Transkript erwähnt Schmerz
- `RFP_Issued` – Interessent hat RFP ausgestellt (manchmal in Beschaffungsforen sichtbar)
- `Contract_Renewal` – geschätztes Erneuerungsdatum für Incumbent-Ansatz (recherchiert)
- `Dormant_Account` – vorheriger Kontakt 12+ Monate inaktiv, neues Signal angekommen
- `Generic_Outreach` – kein spezifischer Trigger; allgemeines Prospecting

#### Sequence-Stufe (Eines erforderlich)
- `ACTIVE` – in aktiver Kadenz, Kontakt erwartet in den nächsten 7 Tagen
- `PAUSED` – pausiert (warte auf Antwort, abwesend, schlechtes Timing); Wiederaufnahmedatum gesetzt
- `COMPLETED` – Kadenz abgeschlossen; keine weiteren Kontakte außer bei neuem Signal
- `CONVERTED` – zu Opportunity verschoben, jetzt AE-Besitz
- `DEAD` – unqualifiziert, nicht responsiv oder explizit disqualifiziert; kein weiterer Kontakt

#### Tier-Tag (Eines erforderlich)
- `T1` – Economic Buyer bestätigt, MEDDPICC 80%+ abgeschlossen, Deal unmittelbar (AE-Besitz)
- `T2` – Influencer oder Benutzer identifiziert, Schmerz bestätigt, 60%+ abgeschlossen, benötigt weitere Qualifizierung
- `T3` – Early-Stage-Lead, oberflächlicher Schmerz, 30%+ abgeschlossen, Hochvolumen-Prospecting-Pool

---

### IV. Pre-Meeting-Handoff-Brief (SDR → AE)

Erstellen Sie dieses Dokument in Slack, Notion oder CRM, wenn Sie ein Treffen an AE übergeben. Geschätzte Lesedauer: 2 Minuten. Verwenden Sie diese genaue Struktur:

#### 1. Konto-Hintergrund (Max. 2 Sätze)
- Unternehmensgröße, Branche, Revenue-Bereich
- Was sie tun; warum wir denken, dass sie passen

*Beispiel:* „Revolve ist ein £180M-Mittelmarkt-SaaS-Anbieter in vertikaler HR. Sie haben gerade Series C gesammelt und skalieren von 3 auf 8 Lösungen in Produktportfolio."

#### 2. Kontaktprofil (Rolle, Betriebszugehörigkeit, Schmerz)
- Titel und genaue Rolle (verwenden Sie LinkedIn-Titel, falls verfügbar)
- Betriebszugehörigkeit im Unternehmen (Einfluss-Ebene)
- Ihr spezifischer Schmerz und Zitat

*Beispiel:* „Jennifer Martinez, CMO, 2,4 Jahre Betriebszugehörigkeit. Verantwortlich für Marketing-Tech-Stack und Personalisierung. Schmerz: ‚Wir sind an Legacy MarTech gebunden und verlieren Feature-Parität gegenüber Konkurrenten. Jedes neue Tool, das wir kaufen, benötigt 4 Wochen Integrationsarbeit.'"

#### 3. MEDDPICC-Score und Lücken
- Gesamtscore (0–100%); Aufschlüsselung nach Element
- Kritische Lücken, die AE in diesem Treffen ansprechen muss

*Beispiel:*
```
Gesamtqualifikation: 68%
- Metrics: 75% (Budget erwähnt)
- Economic Buyer: 40% (mit CMO gesprochen, nicht CFO)
- Decision Criteria: 80% (Geschwindigkeit + Integrations-Tiefe)
- Pain: 85% (Zitat erfasst)
- Champion: 0% (zu identifizieren)

Kritische Lücke: Muss Economic Buyer und CFO-Involvement bis Ende Treffen bestätigen.
```

#### 4. Sequence-Messaging (Was wurde gesagt)
- Personalisierungs-Hooks (Unternehmensforschung, Ankündigung, Empfehler-Name)
- Erhobene Einwände (nicht wiederholen; markieren)
- Gesprächston (empfänglich, skeptisch, abgelenkt)

*Beispiel:* „Nutzte ihre Series-C-Ankündigung zum Öffnen. Sie war empfänglich für Speed/Integration-Winkel, aber skeptisch bei Kosten. ROI in ersten 90 Tagen erwähnen; sie wird danach fragen."

#### 5. Warum sie einem Treffen zugestimmt haben
- Was genau resonierte; was sie von ‚Nein' zu ‚Ja' bewegte
- Was sie in diesem Anruf lernen möchten

*Beispiel:* „Sie stimmte zu, als ich sagte ‚Wir würden einen maßgeschneiderten 60-Tage-Implementierungsplan für Ihren Stack durchgehen.' Sie möchte sehen, ob wir ihre Speed-Anforderungen erfüllen können, ohne 4-Wochen-Integrationen."

---

### V. Deduplizierungsregeln

**Bevor Sie einen neuen Kontakt im CRM protokollieren, überprüfen Sie:**

1. **E-Mail-Abgleich**: Suchen Sie nach Arbeits-E-Mail-Domain + Vor-/Nachname. Falls gefunden, zusammenführen; kein doppelter Datensatz.
2. **LinkedIn-URL-Abgleich**: Wenn zwei Datensätze die gleiche LinkedIn-Profil-URL haben, sind sie die gleiche Person.
3. **Telefonnummern-Abgleich**: Exakte Telefonnummer OR gleiches Unternehmen + gleicher Name = gleiche Person. Zusammenführen.
4. **Konto-Level-Dedup**: Falls Kontakt bereits unter korrektem Unternehmenskonto protokolliert, verwenden Sie vorhandenen Datensatz, nicht Verwaisten.

**Merge-Protokoll:**
- Bewahren Sie gesamten Aktivitätsverlauf beider Datensätze
- Behalten Sie ursprüngliches Kontaktdatum
- Kombinieren Sie Notizen (mit Zeitstempel voranstellen)
- Archivieren Sie Datensatz mit Merge-Notiz

---

### VI. Datenqualitäts-Gates (Bevor Treffen protokolliert wird)

**Ein Treffen kann nicht als ‚geplant' protokolliert werden, bis alle Gates bestanden sind:**

1. **Kontaktfeld-Vervollständigung**:
   - Vorname: erforderlich
   - Nachname: erforderlich
   - Arbeits-E-Mail: erforderlich
   - LinkedIn-Profil-URL: erforderlich
   - Jobtitel: erforderlich

2. **Kontofeld-Vervollständigung**:
   - Unternehmensname: erforderlich (exakte juristische Person, nicht Spitzname)
   - Branche: erforderlich
   - Unternehmensgröße (Mitarbeiterzahl): erforderlich
   - Jährlicher Revenue oder Finanzierungsstufe: erforderlich

3. **Qualifikations-Gate**:
   - Lead-Tier zugewiesen (T1, T2, T3)
   - Mindestens ein MEDDPICC-Element bestätigt
   - Schmerzaussage erfasst (mindestens ein Satz)

4. **Aktivitätsverlauf-Gate**:
   - Mindestens eine protokollierte Aktivität (Anruf, E-Mail, LinkedIn-Nachricht) in den letzten 30 Tagen
   - Nächster Schritt dokumentiert
   - Keine verwaisten Kontakte (muss mit korrektem Unternehmenskonto verknüpft sein)

**Konsequenz**: Falls Gates fehlschlagen, wird Treffen im CRM als „Genehmigung ausstehend" markiert. AE kann Deal nicht voranbringen, bis SDR Daten behebt.

---

### VII. CRM-Feldvervollständigungs-Checkliste

**Mindestens erforderliche Felder pro Stufe:**

**Lead-Stufe (Interessent identifiziert, nicht qualifiziert)**
- Kontakt: Vorname, Nachname, E-Mail, Telefon, Titel, Unternehmen, LinkedIn-URL
- Konto: Unternehmensname, Branche, Größe, Revenue, Standort
- Aktivität: Anruf-Disposition oder E-Mail gesendet (letzte 30 Tage)
- Tagging: Lead-Quelle, Signal-Trigger, Sequence-Stufe (ACTIVE/PAUSED)

**Qualifizierter Lead (MEDDPICC 50%+, Schmerz bestätigt)**
- Alle Felder oben, plus:
- MEDDPICC-Aufschlüsselung (ein Satz pro Element)
- Schmerzaussage (exaktes Zitat, falls möglich)
- Nächster Schritt (datiert, mit Verantwortlichem)
- Kontakt-Einwände (falls vorhanden)
- Tier-Tag zugewiesen (T1/T2/T3)

**Treffen geplant (mit Interessent bestätigt)**
- Alle Felder oben, plus:
- Treffendatum/Uhrzeit/Teilnehmer (bestätigt)
- Treffinags-Zusammenfassung (eine Zeile)
- Pre-Meeting-Brief (5-Punkte-Handoff-Dokument)
- AE-Zuweisung bestätigt
- Follow-up-Task für Tag nach Treffen erstellt

**Opportunity (AE-Besitz, Deal im Zyklus)**
- Alle Felder oben, plus:
- Deal-Wert (ARR/einmalige Gebühr)
- Schließungsdatum (realistisch)
- Primary Decision-Maker bestätigt
- Economic Buyer bestätigt
- Genehmigungskette identifiziert (CEO, CFO, VP, etc.)

---

## Beispiel

**Szenario**: Sarah (SDR) schließt einen kalten Anruf an Marcus Chen, VP of Product bei einem Mittelmarkt-Fintech-Startup ab. Er hebt ab, hört den Pitch, sagt aber, dass sie an ihren aktuellen Anbieter gebunden sind. Sarah dokumentiert den Anruf und übergebe Erkenntnisse an ihren AE, James.

**Post-Call-Notiz (Sarah protokolliert innerhalb 45 Min)**

```
Aktivitätstyp: Telefonanruf
Kontakt: Marcus Chen
Unternehmen: PaymentFlow (£80M Revenue, Fintech)
Datum: 2026-06-02, 10:15 Uhr
Dauer: 7 Min

WAS IST PASSIERT
Verbunden mit Marcus Chen, VP of Product, für 7 Minuten. Er hob direkt ab und engagierte sich während des gesamten Pitch.

ERWÄHNTE HAUPTPROBLEME
„Unser aktueller Anbieter ist solide, aber fügt weiterhin Ballast hinzu. Jedes Update hat Features, die wir nicht brauchen. Wir verbringen 20% unserer Engineering-Zeit mit der Integration ihres Mülls."

QUALIFIKATIONSSTATUS
Metrics: Partial (Revenue erwähnt, Budget nicht)
Economic Buyer: Missing (mit Benutzer gesprochen, benötigen CFO)
Decision Criteria: Confirmed (Anbieter-Ballast, Integrations-Aufwand)
Pain: Confirmed (exaktes Zitat erfasst)
Champion: Partial (Marcus ist interner Befürworter, nicht yet bestätigt)
Timeline: Missing
Implications: Partial (Zeit-Kosten erwähnt, geschäftliche Auswirkung unklar)
Commitment: None yet (nur zuhörende Haltung)

NÄCHSTER SCHRITT
Sarah sendet 4-Min-Demo-Video (Integrations-Beispiele) bis 2026-06-04.
Falls angesehen, 30-Min-Technical-Deep-Dive mit Marcus + 1 Engineer bis 2026-06-08 planen.
Falls keine Antwort bis 2026-06-08, Sequence pausieren und Q4 2026 überprüfen (Vertragserneuerungs-Zyklus).

ERHOBENE EINWÄNDE
Einwand: „Wir sind an unserem Incumbent bis Ende 2027 gebunden."
Antwort gegeben: „Verstanden. Wir erstellen typischerweise einen Business Case zur Erneuerung. Würde es Sinn machen, April 2027, 9 Monate voraus zu chatten?"
Seine Antwort: „Vielleicht. Senden Sie mir zuerst etwas."
Follow-up-Flag: JA – zu Vertragserneuerungs-Sequenz hinzufügen, Zyklus 2027-04-01.

ZUGEWIESENE TAGS
Lead-Quelle: OUTBOUND
Signal-Trigger: Earnings_Call (kürzliche Fintech-Finanzierungsrunden-Ankündigung)
Sequence-Stufe: ACTIVE (Demo-Video ausstehend)
Tier: T2 (Influencer, Schmerz bestätigt, Budget/Timeline fehlt)

HANDOFF AN AE (Noch nicht nötig; wird vor geplanter Treffen erstellt.)
```

---

**Pre-Meeting-Handoff-Brief (3 Tage später erstellt, wenn Marcus Treffen zustimmt)**

```
AN: James (AE) | VON: Sarah (SDR) | DATUM: 2026-06-05
TREFFEN: Marcus Chen, PaymentFlow | GEPLANT: 2026-06-09, 14:00 Uhr

1. KONTO-HINTERGRUND
PaymentFlow ist eine £80M-Mittelmarkt-Fintech-Plattform für KMUs. Sie haben kürzlich Finanzierung abgeschlossen und skalieren Engineering für schnellere Feature-Velocity. Integrations-Overhead ist ein wachsender Reibungspunkt.

2. KONTAKTPROFIL
Marcus Chen, VP of Product, 2,3 Jahre Betriebszugehörigkeit. Direkter Einfluss auf Anbieter-Stack. Schmerz (wörtlich): „Jedes Update hat Features, die wir nicht brauchen. Wir verbringen 20% unserer Engineering-Zeit mit der Integration ihres Mülls."

3. MEDDPICC-SCORE
Gesamt: 58%
- Metrics: Partial (Revenue bekannt, Budget nicht; Schätzung erforderlich)
- Economic Buyer: Missing (nur mit Benutzer gesprochen; CFO noch nicht kontaktiert)
- Decision Criteria: Confirmed (Einfachheit + niedriger Integrations-Aufwand)
- Pain: Confirmed (Anbieter-Ballast, Zeit-Sink)
- Champion: Partial (Marcus wird Befürworter, benötigen aber Peer-Bestätigung)
- Implications: Missing (geschäftliche Auswirkung des Ballasts nicht quantifiziert)
- Commitment: None yet

Kritische Lücke: Muss Economic Buyer identifizieren (CFO?) und Kosten des Integrations-Overhead in £/Stunden quantifizieren.

4. SEQUENCE-MESSAGING
Öffnungs-Hook: Referenziert ihre Fintech-Finanzierungsrunde und Engineering-Skalierungs-Narrative (von Crunchbase).
Er engagierte sich stark auf „Integrations-Belastungs"-Winkel.
Zögern: Incumbent-Lock-in bis Ende 2027. Positioniert Ernuerungs-Gespräch als 9-Monats-Fenster.

5. WARUM SIE ZUGESTIMMT HABEN
Resonanz-Punkt: „Wir zeigen, wie andere Fintech-Plattformen Integrations-Overhead um 60% reduziert haben."
Er möchte sehen: Beweis von ähnlichen Unternehmen; Low-Touch-Integrations-Beispiele.

---

NÄCHSTE SCHRITTE FÜR JAMES:
- Mit Konkurrenz-Vergleich (ähnlicher Fintech-Use-Case) führen.
- Nach Integrations-Team-Größe fragen; aktuelle Kosten quantifizieren.
- Economic-Buyer-Frage identifizieren: „Wer genehmigt Anbieter-Änderungen hier?"
- Erwartung setzen: Schleife Marcus's CEO/CFO ein, falls Deal vorwärts geht.
```

---

**CRM-Felder vervollständigt (Screenshot-äquivalente Ausgabe)**

```
KONTAKT-DATENSATZ: Marcus Chen
Vorname: Marcus
Nachname: Chen
E-Mail: marcus.chen@paymentflow.io
Telefon: +44 20 XXXX XXXX
Titel: VP of Product
LinkedIn-URL: linkedin.com/in/marcuschen-fintech
Unternehmen: PaymentFlow

KONTO-DATENSATZ: PaymentFlow
Juristische Name: PaymentFlow Ltd.
Branche: Financial Services / Fintech
Mitarbeiterzahl: 240
Jährlicher Revenue: £80M (geschätzt von Crunchbase)
Finanzierungsstufe: Serie B/C (kürzliche Runde)
Sitz: London, UK
Website: paymentflow.com

AKTIVITÄTSPROTOKOLL: Letzte 30 Tage
- 2026-06-02, 10:15 Uhr | Telefonanruf | Connected (7 Min) | Sarah
- 2026-06-04, 14:30 Uhr | E-Mail gesendet | Demo-Video-Link | Sarah
- 2026-06-05, 11:00 Uhr | E-Mail geöffnet | Marcus öffnete Demo-Video
- 2026-06-05, 13:45 Uhr | E-Mail beantwortet | „Interessant. Lass uns sprechen." | Marcus
- 2026-06-09, 14:00 Uhr | Treffen geplant | James (AE) + Marcus + 1 Engineer

TAGGING
Lead-Quelle: OUTBOUND
Signal-Trigger: Earnings_Call / Fintech Expansion
Sequence-Stufe: CONVERTED (jetzt in AE-Pipeline)
Tier: T2

QUALIFIKATION
Schmerz (Exaktes Zitat): „Jedes Update hat Features, die wir nicht brauchen. Wir verbringen 20% unserer Engineering-Zeit mit der Integration ihres Mülls."
MEDDPICC Gesamt: 58% (Economic Buyer fehlend, Implications fehlend)
Nächster Schritt: Treffen 2026-06-09; AE zu identifizieren CFO/Economic Buyer
```

---

## Benchmarks & Standards

- **Log-Rate-Ziel**: 95%+ der Aktivitäten innerhalb von 2 Stunden protokolliert. Wöchentlich prüfen.
- **Handoff-Qualität**: AE sollte nie fragen „Wer ist das?" oder „Was haben sie gesagt?" – gesamter Kontext im Brief.
- **Dedup-Rate**: <2% doppelte Datensätze pro 100 neue Leads. Monatlich zusammenführen.
- **Datengate-Bestehensrate**: 90%+ der geplanten Treffen bestehen alle Feldvervollständigungs-Gates, bevor sie als „bestätigt" protokolliert werden.
- **MEDDPICC-Durchschnitt bei T1-Handoff**: 80%+ über sechs Elemente (ausschließlich Timeline/Implications, falls noch nicht besprochen).
- **Aktivitätsprotokoll-SLA**: 95% innerhalb von 2 Stunden; 99% innerhalb von 4 Stunden. Null Protokolle älter als Tagesende.
