# SDR-Sequenz-Builder

## Wann sollte dieser Workflow ausgeführt werden

Dieser Workflow wird aktiviert, wenn Sie eine neue Outbound-Sequenz starten, die ein bestimmtes Kontosegment anvisiert. Trigger sind:
- Quartalsplanungszyklus erfordert einen neuen Segmentfokus
- Produktstart erfordert Outbound-Aktivitäten für neue Käuferpersonas
- Vertikale Expansionsstrategie benötigt segmentspezifische Sequenzen
- Win-Loss-Analyse identifiziert ein wiederholbares Signal, das Sie ansprechen möchten

## Erforderliche Eingaben

Bevor Sie starten, sammeln Sie:
1. **ICP-Definition** — Unternehmensgröße, Branche, Umsatzbereich, Technologie-Stack
2. **Signal-Typ** — Trigger-basiert (Finanzierung, Stellenwechsel, Tech-Adoption) oder statische Outbound-Aktivitäten (Expansion innerhalb bestehendem Segment)
3. **Kontotier** — welche Tiers Sie ansprechen (Tier 1 = 10M+, Tier 2 = 1-10M, Tier 3 = <1M, oder Ihre eigene Skala)
4. **Senioritätsziel** — VP-Level, C-Suite, Director, Manager
5. **Kontoliste oder Datenquelle** — CSV, Salesforce-Abfrageergebnis oder Apollo/Hunter-Export (N Konten, typischerweise 50-500)
6. **Messaging-Framework-Optionen** — wählen Sie aus: Short Trigger, Do the Math, Founder's Story, Compliance + ROI, Community Proof, Feature Parity, DM Social, oder Custom

## Schritte

### Schritt 1 — Zielssegment definieren (15 Min)

**Claude-Aktion:**
Bitten Sie Claude, Ihre Segmentdefinition zu verfeinern. Stellen Sie bereit:
- ICP-Definition (oder grobe Skizze)
- Signal-Typ (Trigger oder statisch)
- Kontotiers
- Senioritätsziel

**Claude-Prompt:**
"Hilf mir, das Segment für diese Sequenz zu definieren. ICP: [X]. Signal: [Y]. Kontotier: [Z]. Senioriät: [W]. Welche demografischen und technografischen Filter sollte ich verwenden, um diese Liste einzugrenzen? Sollte ich bestimmte Unternehmenstypen, Regionen oder Branchen ausschließen?"

**Claude-Ausgabe:**
- Verfeinerte Segmentkriterien (5-10 spezifische Filter)
- Begründung für jeden Filter
- Geschätzter adressierbarer Markt
- Kennzeichnung von Datenkualitätsproblemen

**Entscheidungspunkt:**
Wirkt das Segment umsetzbar (500-2000 Konten) oder zu eng (<100) oder zu breit (>5000)?

---

### Schritt 2 — Kontoliste erstellen und bewerten (30 Min)

**Ihre Aktion:**
Exportieren Sie Ihre Kontoliste aus Ihrer Datenquelle. Stellen Sie sicher, dass sie Folgendes umfasst:
- Unternehmensname, Domain, Unternehmensgröße, Finanzierung, Tech-Stack (falls verfügbar)
- Kontaktnamen, Titel, E-Mails für 2-4 Entscheidungsträger pro Konto
- Kürzliche Signale (Stellenwechsel, Finanzierungsereignis, Tech-Adoption) mit Daten

**Claude-Aktion:**
Bewerten und tiered Sie die Konten. Stellen Sie Claude die Liste bereit.

**Claude-Prompt:**
"Bewerten Sie diese [N] Konten gegen den ICP. Tiered Sie sie 1/2/3 basierend auf Passung. Kennzeichnen Sie, welche Signale in den letzten 14 Tagen haben. Für die 20 höchstbewerteten Tier-1-Konten, listen Sie die Signal(e) und Daten auf. Ausgabe als CSV: Account | Tier | Score | Signal | Signal Date."

**Claude-Ausgabe:**
- Bewertete Kontoliste (rangiert nach Tier und Passungsscore)
- 20 warme Konten (Tier 1 + kürzliches Signal)
- 20 kalte Konten (Tier 1, kein Signal, aber starke ICP-Passung)
- Rote Flaggen (Unternehmen zum Deprioritisieren oder Vermeiden)

**Entscheidungspunkt:**
Haben Sie mindestens 15 Tier-1-Konten zum Ansprechen? Wenn nicht, erweitern Sie das Segment oder senken Sie die Tier-Schwelle.

---

### Schritt 3 — Messaging-Framework wählen (10 Min)

**Claude-Aktion:**
Empfehlen Sie das beste Messaging-Framework für Ihr Segment.

**Claude-Prompt:**
"Gegeben dieses Segment: Tier-1-Konten, [Senioritätsziel], [Signal-Typ], in [Branche/Anwendungsfall], welches dieser 8 Frameworks passt am besten und warum? Frameworks: (1) Short Trigger, (2) Do the Math, (3) Founder's Story, (4) Compliance + ROI, (5) Community Proof, (6) Feature Parity, (7) DM Social, (8) Custom. Begründen Sie Ihre Wahl mit 2-3 Gründen."

**Claude-Ausgabe:**
- Empfohlenes Framework mit Begründung
- Wichtige Hooks und Schmerzpunkte zum Hervorheben
- 3 Beispiel-Öffnungszeilen eindeutig für dieses Framework
- Alternatives Framework, wenn das primäre nicht resoniert

**Entscheidungspunkt:**
Stimmt das Framework mit Ihrem Sales-Playbook und dem Messaging Ihres Teams überein? Falls nicht, schlagen Sie ein anderes Framework vor.

---

### Schritt 4 — Sequenz schreiben (45 Min)

**Claude-Aktion:**
Generieren Sie die 4-E-Mail-Sequenz für 3-5 Beispielkonten.

**Claude-Prompt:**
"Schreiben Sie die 4-E-Mail-Sequenz für diese 3 Beispielkonten mit dem [Framework]-Framework. Details: Ziel-Titel [X], Kontotier [Y], Signal: [Z]. E-Mail 1: Hook + spezifische Signalreferenz, unter 100 Wörter. E-Mail 2: Schmerzpunkt + relevante KPI, 120-150 Wörter. E-Mail 3: Delegation/Social Proof + schwache Bitte, 100-140 Wörter. E-Mail 4: Break-up + Wert-Erinnerung, 80-100 Wörter. Binden Sie Betreffzeilen ein. Zeigen Sie für jede E-Mail 2 Variationen (Version A und B), damit ich A/B testen kann."

**Claude-Ausgabe:**
Für jedes der 3 Konten:
- E-Mail 1 (2 Versionen): Hook + Signal
- E-Mail 2 (2 Versionen): Schmerz + KPI
- E-Mail 3 (2 Versionen): Delegation + Bitte
- E-Mail 4 (2 Versionen): Break-up
- Empfohlenes Versand-Cadence (Tage zwischen jeder E-Mail)

**Entscheidungspunkt:**
Wirken alle 4 E-Mails personalisiert und glaubwürdig für Ihr Team? Vermeiden sie Produktpitch in E-Mail 1?

---

### Schritt 5 — QA-Kontrolle (15 Min)

**Claude-Aktion:**
QA-Überprüfung gegen die 5-Punkte-Qualitätscheckliste.

**Claude-Prompt:**
"QA diese 12 E-Mails gegen die Messaging-Regeln. Überprüfen Sie für jede E-Mail: (1) Unter Wörterlimit (E-Mail 1: <100 W, E-Mail 2: <150 W, E-Mail 3: <140 W, E-Mail 4: <100 W)? (2) Spezifische Personalisierung (erwähnt Signal, Unternehmen oder Anwendungsfall, nicht generisch)? (3) E-Mail 1 hat kein Produktpitch? (4) Klarer CTA (spezifische Bitte, nicht 'lass uns plaudern')? (5) Keine Spam-Trigger-Wörter? Flaggen Sie Verstöße. Schlagen Sie 1 Fix pro Problem vor."

**Claude-Ausgabe:**
- QA-Bestehen/Durchfallen für jede E-Mail
- Gekennzeichnete Verstöße mit spezifischen Fixes
- Überarbeitete E-Mails (falls erforderlich)
- Genehmigung zum Fortfahren mit CRM-Ladung

**Entscheidungspunkt:**
Sind alle 4 E-Mails genehmigt? Falls nicht, überarbeiten und erneut QA durchführen.

---

### Schritt 6 — CRM-Ladung und Sequenzkonfiguration (20 Min)

**Ihre Aktion:**
1. Taggen Sie alle Kontakte in Ihrer Zielgruppe mit: `[Sequenzname] - Active` und Kontotier-Tags
2. Melden Sie sich in Ihrem Outreach-Tool an (Salesforce/Outreach/Instantly/etc.)
3. Erstellen Sie die Sequenz mit gestaffelten Startdaten
4. Konfigurieren Sie Versand-Cadence:
   - E-Mail 1: Tag 0 (sofort, 9 Uhr Empfänger-Zeitzone)
   - E-Mail 2: Tag 2 (48 Stunden später, 10 Uhr)
   - E-Mail 3: Tag 5 (3 Tage nach E-Mail 2, 14 Uhr)
   - E-Mail 4: Tag 9 (4 Tage nach E-Mail 3, 11 Uhr)
5. Versenden Sie niemals alle Kontakte am selben Tag — gestaffeln Sie über 5 Tage
6. Legen Sie Reply-Tracking fest und konfigurieren Sie Auto-Stop bei positiver Antwort

**Claude-Aktion:**
Unterstützen Sie die Sequenzlogik, falls erforderlich.

**Claude-Prompt:**
"Helfen Sie mir, diese Sequenz in [Tool-Name] zu konfigurieren. Ich möchte 250 Konten über 5 Tage gestaffeln, 50 pro Tag. Sollte ich innerhalb jedes Tages randomisieren oder einen festen Zeitpunkt verwenden? Welche Auto-Stop-Logik ist beste: Antwort erhalten, Kalendertreffen gebucht, oder beide?"

**Claude-Ausgabe:**
- Konfigurationscheckliste
- Empfohlene Staffelungsstrategie
- Auto-Stop-Bedingungen

**Entscheidungspunkt:**
Läuft die Sequenz live und fließen die Kontakte durch? Überprüfen Sie, ob 2-3 Kontakte E-Mail 1 erhalten haben, bevor Sie fortfahren.

---

### Schritt 7 — Performance Review Gate (nach 7 Tagen)

**Claude-Aktion:**
Analysieren Sie 7-Tage-Metriken und empfehlen Sie Optimierungen.

**Claude-Prompt:**
"Hier sind die Metriken für diese Sequenz nach 7 Tagen: Öffnungsrate [X]%, Antwortrate [Y]%, Klickrate [Z]%, Abmeldeindex [W]%. Vergleich: Unternehmensschnitt liegt bei [A]% Öffnung, [B]% Antwort. Signalqualität (Tier 1 vs. Tier 2): [Aufschlüsselung]. Framework-Performance: [Framework] vs [Alternative]. Was sollten wir ändern und warum? Priorisieren Sie die Top-3-Tweaks."

**Claude-Ausgabe:**
- Benchmark-Vergleich (vs. Ihre Baseline)
- Root-Cause-Analyse (Nachricht, Listenqualität, Timing oder Targeting)
- Top-3-Optimierungsempfehlungen:
  1. E-Mail-Kopie-Tweak (spezifische Zeile oder Hook)
  2. Timing- oder Cadence-Anpassung
  3. Targeting- oder Listen-Verfeinerung
- Entscheidung: Fortfahren wie geplant, pausieren + überarbeiten, oder auf neues Segment ausweiten?

**Entscheidungspunkt:**
Rechtfertigt die Performance eine Skalierung auf mehr Konten? Wenn die Metriken schwach sind, implementieren Sie Claudes empfohlene Tweaks und testen Sie erneut in einem neuen Mikro-Segment, bevor Sie breit ausrollen.

---

## Ausgabe

Eine produktionsreife Outbound-Sequenz bestehend aus:
1. **Segmentdefinitionsdokument** — ICP-Filter, Tier-Aufschlüsselung, adressierbarer Markt
2. **Bewertete Kontoliste** — 250-500 Konten rangiert nach Passung und Signalaktualität
3. **4-E-Mail-Sequenz (8 Variationen)** — 2 A/B-Versionen pro E-Mail, 4 Versand-Cadences, Messaging-Framework klar angegeben
4. **QA-Bericht** — Alle E-Mails bestehen Qualitätscheckliste, keine Spam-Flaggen, Personalisierung bestätigt
5. **Sequenzkonfiguration** — Live in CRM/Outreach-Tool, über 5 Tage gestaffelt, Auto-Stop-Regeln konfiguriert
6. **7-Tage-Performance-Snapshot** — Metriken, Benchmarks und Top-3-Optimierungsempfehlungen

---

## Beispiel

**Szenario:** Sie sind Account Executive bei einem B2B-SaaS-Unternehmen, das Dateninfrastruktur verkauft. Sie möchten Mid-Market-Unternehmen (Tier 1: 10-50M) in FinTech ansprechen, die kürzlich ein konkurrierendes Daten-Tool übernommen haben.

### Schritt 1 — Segment definieren
- **ICP:** FinTech, 10-50M ARR, gegründet 2015+, technischer Mit-Gründer noch im Unternehmen
- **Signal:** Databricks oder Snowflake in den letzten 30 Tagen installiert (Trigger-basiert)
- **Senioriät:** VP Engineering, VP Data
- **Claude-Ausgabe:** "Fügen Sie Filter hinzu: Muss 50+ Engineering-Mitarbeiter haben. Schließen Sie reine Trader aus (sie gehören nicht zur Infrastruktur). Zielen Sie auf 8 Schlüsselmetros ab: NYC, SF, LA, Boston, Austin, Chicago, London, Singapur."

### Schritt 2 — Erstellen und bewerten
- **Eingaben:** 300 FinTech-Unternehmen von G2/Crunchbase + Salesforce-Installationsdaten
- **Claude-Ausgabe:**
  - 45 Tier-1-Konten (starke ICP, 20-50M, >50 Engineers)
  - 15 dieser 45 mit Snowflake/Databricks-Signal in den letzten 14 Tagen (warm)
  - 30 ohne Signal aber starke ICP-Passung (kalt)

### Schritt 3 — Framework wählen
- **Segment:** Tier 1, VP Engineering, Trigger-basiert (kürzliche Databricks-Installation)
- **Claude-Empfehlung:** "**Do the Math** — beste Passung. Diese VPs evaluieren Infrastrukturkosten. Hook auf das ROI-Gap zwischen Databricks + Ihrem Tool vs. Legacy-Stacks. Öffnen Sie mit dem Trigger (wir sehen, dass Sie Databricks installiert haben) + unmittelbarer Wert (30% niedrigere Compute-Kosten)."

### Schritt 4 — Sequenz schreiben
**Beispielkonto:** Prism Analytics, NYC, VP Eng named Sarah Chen, installierte Databricks vor 8 Tagen.

**E-Mail 1 (Hook + Signal):**
> Betreff: Eine Sache, die der Databricks-Installation bei Prism fehlt
> 
> Sarah,
> 
> Habe bemerkt, dass Ihr Team Databricks letzte Woche bereitgestellt hat. Clevere Entscheidung—Abfragen sind sofort 10x schneller.
> 
> Hier ist, was wir normalerweise danach sehen: Infrastrukturkosten eskalieren, wenn das Abfragevolumen wächst. Neugierig, ob das auf Ihrer Roadmap steht zu beheben?
> 
> Lohnt sich ein 10-Min-Anruf?
> 
> [Name]

**E-Mail 2 (Schmerz + KPI):**
> Betreff: Re: Eine Sache, die der Databricks-Installation...
> 
> Sarah,
> 
> Data-Teams, die Databricks laufen, treffen normalerweise auf eine Kostenmauer bei ~3M tägliche Abfragen. Bei dieser Skala verdoppeln sich Compute-Rechnungen oft Quartal um Quartal.
> 
> Die meisten Teams, mit denen wir sprechen, waren darauf nicht vorbereitet. Wenige haben eine Kostenkontrollstrategie von Anfang an integriert.
> 
> Das haben wir für Teams wie Ramp und Stripe gelöst—beide reduzierten ihre Databricks-Kosten um 35% in Q1 ohne Abfragespeed zu verlieren.
> 
> Wenn Kostenoptimierung auf Ihrer Roadmap steht, könnte ich gerne durchgehen, wie das für sie aussah.
> 
> [Name]

**E-Mail 3 (Delegation + Bitte):**
> Betreff: Ihren VP Data auf LinkedIn entdeckt—dachte, sie würden sich dafür interessieren
> 
> Sarah,
> 
> Habe gerade ein 1-Pager zu "Databricks Cost Patterns at Scale" basierend auf 200+ Bereitstellungen veröffentlicht. Ihr VP Data könnte es für Planung nützlich finden.
> 
> Ich sende es gerne, falls es hilft.
> 
> [Name]

**E-Mail 4 (Break-up):**
> Betreff: Letzte Notiz—Prisms Databricks-Chance
> 
> Sarah,
> 
> Ich trete zurück, aber eine letzte Ressource: Unser ROI-Kalkulator zeigt, dass Unternehmen ähnlich wie Prism ~2,1M jährlich mit intelligenten Kostenkontrollen einsparen.
> 
> Wenn das Ihre Denkweise ändert, bin ich hier.
> 
> [Name]

### Schritt 5 — QA-Kontrolle
- **E-Mail 1:** ✓ 47 Wörter, ✓ spezifisches Signal (Databricks letzte Woche bereitgestellt), ✓ kein Produktpitch, ✓ klarer CTA (10-Min-Anruf), ✓ keine Spam-Wörter. **BESTANDEN**
- **E-Mail 2:** ✓ 91 Wörter, ✓ spezifische KPI (3M Abfragen, 35% Einsparungen), ✓ Social Proof (Ramp, Stripe), ✓ klare Bitte, ✓ keine Spam. **BESTANDEN**
- **E-Mail 3:** ✓ 43 Wörter, ✓ personalisierte Delegation, ✓ klarer CTA, ✓ keine Spam. **BESTANDEN**
- **E-Mail 4:** ✓ 44 Wörter, ✓ Kalkulator-Referenz ist Value-Add kein Pitch, ✓ sauberer Break-up, ✓ Tür offen. **BESTANDEN**

### Schritt 6 — CRM-Ladung
- Getagged 45 Tier-1 FinTech-Konten: `Databricks-Sequence-2024Q2`, `Tier1`, `VP-Eng`
- Sequenz in Outreach erstellt
- Cadence: E-Mail 1 (Tag 0, 9 Uhr PT), E-Mail 2 (Tag 2, 10 Uhr PT), E-Mail 3 (Tag 5, 14 Uhr PT), E-Mail 4 (Tag 9, 11 Uhr PT)
- 45 Kontakte über 5 Tage gestaffelt: 9 pro Tag, randomisiert innerhalb jedes Tages
- Auto-stop: Antwort erhalten oder Kalendertreffen gebucht

### Schritt 7 — Performance (7-Tage-Snapshot)
- **Metriken:** 34% Öffnungsrate, 8,2% Antwortrate, 1,1% Abmeldeindex
- **Benchmark:** Unternehmensschnitt 28% Öffnung, 6% Antwort
- **Tier 1 vs. Tier 2:** Tier-1-Konten: 41% Öffnung, 12% Antwort (Signal = Qualität)
- **Claude-Empfehlung:** "Sie schlagen Benchmarks. 12% Antwort auf warme Tier 1 ist hervorragend. Erweitern Sie dies auf die 30 kalten Tier-1-Konten (kein kürzliches Signal) und A/B-Test den Hook—versuchen Sie 'Wir halfen [Konkurrenten], Databricks-Kosten zu schneiden' vs. aktuelle 'eine Sache fehlt' Version auf den nächsten 50 Konten."
- **Entscheidung:** Ausweitung auf kalte Tier-1-Kohorte und Test-Hook-Variation.

---

**Erstellt:** 2026-06-02
**Zuletzt aktualisiert:** 2026-06-02
