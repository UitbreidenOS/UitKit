---
name: legal-research
description: "Rechtlicher Rechercheassistent: Zusammenfassungen von Rechtsprechung, Regulierungsleitfäden, Jurisdiktionsvergleiche"
---

# Skill: Juristische Recherche

## Wann aktivieren
- Zusammenfassung von Rechtsprechung, Vorschriften oder Leitliniendokumenten vor einem Meeting oder Memo
- Vergleich der rechtlichen Behandlung einer Frage über mehrere Jurisdiktionen hinweg
- Erstellung eines juristischen Recherche-Memos mit zitierten Quellen und Analyse
- Verständnis der praktischen Auswirkungen eines neuen Gesetzes oder einer regulatorischen Änderung
- Erstlektüre eines Gesetzes oder einer Verordnung vor der Besprechung mit Rechtsberatern
- Vorbereitung von Fragen oder einer Forschungsagenda für externe Anwälte

## Wann NICHT verwenden
- Rechtliche Beratung von Mandanten — Claude ist ein Rechercheassistent, kein Rechtsanwalt
- Gerichtsschriftsätze, Klageschriften oder formelle Eingaben — erfordern einen zugelassenen Anwalt
- Weitreichende, nicht umkehrbare Entscheidungen (Vertragsunterzeichnung, regulatorische Antwort) — echten Rechtsrat einholen
- Jurisdiktionen, in denen Claudes Trainingsdaten möglicherweise begrenzt sind — stets mit Primärquellen validieren
- Aktuelle Rechtsprechungsupdates — aktuelle Datenbanken prüfen (Westlaw, LexisNexis, Casetext, Free Law Project)

## WICHTIG

Claude ist ein juristischer Rechercheassistent, kein Rechtsanwalt. Alle Ergebnisse dienen ausschließlich internen Recherchezwecken und müssen vor der Verwendung gegen maßgebliche Primärquellen validiert werden. Juristische Analysen können sich durch neue Urteile, Regulierungsleitlinien oder Gesetzesänderungen ändern. Stets die Aktualität mit einem zugelassenen Praktiker in der betreffenden Jurisdiktion verifizieren.

## Anweisungen

### Prompt für das juristische Recherche-Memo

```
Erstelle ein juristisches Recherche-Memo zu: [RECHTSFRAGE]

Jurisdiktion(en): [z.B. englisches und walisisches Recht / New York / EU / US-Bundesrecht / mehrere Jurisdiktionen]
Kontext: [warum diese Frage relevant ist — Geschäftsentscheidung, Vertragsproblem, Compliance-Bedenken]
Anfragende Rolle: [Unternehmensjurist / Compliance-Officer / Geschäftsverantwortlicher]
Tiefe: [Kurzbericht (1–2 Seiten) / Standard-Memo (4–6 Seiten) / Tiefenrecherche (10+ Seiten)]

Memo-Struktur:
I. Gestellte Frage
II. Kurze Antwort (1–2 Absätze — die Antwort mit wesentlichen Einschränkungen)
III. Für die Analyse relevante Fakten
IV. Erörterung
   - Rechtlicher Rahmen / anwendbare Gesetze und Verordnungen
   - Relevante Rechtsprechung (wesentliche Entscheidungen zusammenfassen)
   - Analyse der Anwendung des Rechts auf unsere Fakten
   - Gegenargumente oder alternative Auslegungen
V. Schlussfolgerung und Empfehlung
VI. Offene Fragen / Weiterer Forschungsbedarf

Zitate im Format: [Fallname, [Jahr] Jurisdiktion Zitat] oder [Gesetz/Verordnung, Paragraf]
Stellen kennzeichnen, wo Primärquellenverifizierung erforderlich ist: [PRÜFEN - Quelle erforderlich]
```

### Prompt für die Rechtsprechungszusammenfassung

```
Fasse den folgenden Fall für ein nicht-juristisches Publikum zusammen.

Fall: [Fallname / Zitat / Falltext einfügen]
Kontext: Wir recherchieren diesen Fall, weil [geschäftlicher/rechtlicher Kontext].

Erstelle:
1. Leitsatz (was das Gericht entschieden hat)
2. Wesentliche Fakten (2–3 Sätze — nur für den Leitsatz relevante Fakten)
3. Aufgestellter Rechtsgrundsatz (die aus diesem Fall resultierende Rechtsregel)
4. Praktische Auswirkung (wie dies unsere Situation beeinflusst)
5. Präzedenzwert: [bindend / überzeugend / begrenzte Autorität — und in welchen Gerichten]
6. Spätere Behandlung (wurde er befolgt, abgegrenzt oder aufgehoben? — Unsicherheiten kennzeichnen)

Sprache für ein geschäftliches Publikum zugänglich halten. Juristische Fachbegriffe sind beim ersten Vorkommen zu erklären.
```

### Prompt für den Jurisdiktionsvergleich

```
Vergleiche, wie [RECHTSFRAGE] in [JURISDIKTIONEN] behandelt wird.

Frage: [Beschreibung der Rechtsfrage in einfacher Sprache]
Zu vergleichende Jurisdiktionen: [z.B. EU, UK, US-Bundesrecht, Kalifornien, New York, Singapur]
Unser Geschäftskontext: [warum wir diesen Vergleich benötigen — Vertragsrechtswahl, Compliance in mehreren Märkten etc.]

Für jede Jurisdiktion angeben:
1. Anwendbares Gesetz/Verordnung (Gesetzes- oder Verordnungsname angeben)
2. Die Regel in dieser Jurisdiktion (2–4 Sätze)
3. Wesentliche Anforderungen oder Schwellenwerte
4. Vollstreckungsbehörde und Vollstreckungsgeschichte (kurz)
5. Sanktionen bei Nichtkonformität
6. Wesentliche Unterschiede zu den anderen aufgeführten Jurisdiktionen

Ausgabeformat: Vergleichstabelle + ein Absatz pro Jurisdiktion mit Details.
Kennzeichnung: [PRÜFEN] bei konkreten Sanktionsbeträgen, Schwellenwerten oder Daten — diese ändern sich.

Abschluss mit: „Praktische Schlussfolgerung für ein Unternehmen, das in all diesen Jurisdiktionen tätig ist" — was ist der Ansatz mit dem höchsten gemeinsamen Nenner für Compliance?
```

### Prompt für die Zusammenfassung regulatorischer Leitlinien

```
Fasse dieses regulatorische Leitliniendokument zusammen.

Quelle: [Name der Regulierungsbehörde, Titel der Leitlinie, Veröffentlichungsdatum]
[Text einfügen oder URL/Beschreibung angeben]

Erstelle:
1. Was die Leitlinie abdeckt (Anwendungsbereich und Zweck)
2. Für wen sie gilt (regulierte Einheiten)
3. Wesentliche Pflichten oder Erwartungen (nummerierte Liste — was müssen oder sollten regulierte Einheiten tun?)
4. Fristen oder Übergangsfristen
5. Worauf die Regulierungsbehörde bei der Durchsetzung achtet
6. Wie diese Leitlinie von früheren Leitlinien abweicht oder diese klärt
7. Praktische Schritte zur Compliance (was ein internes Team nach dieser Leitlinie tun sollte)

[PRÜFEN]: Bestimmungen kennzeichnen, bei denen die Leitlinie unklar ist oder wo primäre Rechtsvorschriften konsultiert werden sollten.
```

### Prompt für die Gesetzes- und Verordnungsanalyse

```
Analysiere [GESETZ/VERORDNUNG] in Bezug auf [UNSERE SITUATION].

Gesetz: [vollständig zitieren — Name, Jahr, Paragraph]
Unsere Situation: [Sachverhalt beschreiben]
Jurisdiktion: [wo dies gilt]

Analysestruktur:
1. Text der relevanten Vorschrift(en) — direkt zitieren
2. Definierte Begriffe — wie definiert das Gesetz verwendete Schlüsselbegriffe?
3. Anwendungsbereich — welche Personen und Tätigkeiten deckt diese Vorschrift ab?
4. Anwendung auf unsere Fakten — fällt unsere Situation in den Anwendungsbereich?
   - Elemente der Vorschrift: [jedes Element auflisten]
   - Unsere Fakten gegenüber jedem Element: [einzeln analysieren]
   - Schlussfolgerung: [im Anwendungsbereich / außerhalb des Anwendungsbereichs / unsicher]
4. Ausnahmen oder Safe Harbours — sind welche für uns verfügbar?
5. Durchsetzungsmechanismus — was kann die Regulierungsbehörde tun?
6. Praktische Empfehlung

[PRÜFEN] Alle gesetzlichen Verweise gegen die aktuelle Fassung der Rechtsvorschriften prüfen.
Hinweis: Gesetze werden häufig geändert — die zum relevanten Datum geltende Fassung bestätigen.
```

### Prompt für die RechtsrisikoMatrix

```
Erstelle eine RechtsrisikoMatrix für [PROJEKT/TRANSAKTION/TÄTIGKEIT].

Kontext: [Beschreibung der Tätigkeit — neues Produktlaunch, Markteintritt, M&A etc.]
Beteiligte Jurisdiktionen: [Liste]
Beteiligte Stakeholder: [beteiligte Geschäftsbereiche]

Für jedes identifizierte Rechtsrisiko:
| Risiko | Rechtsgrundlage | Wahrscheinlichkeit | Auswirkung | Verantwortlicher | Minderung |
|---|---|---|---|---|---|
| [Risikobeschreibung] | [Gesetz/Verordnung/Urteil] | H/M/N | H/M/N | [Rolle] | [Maßnahme] |

Zu prüfende Risikokategorien:
1. Regulatorisch: Sind wir in dieser Jurisdiktion eine regulierte Einheit? Ist diese Tätigkeit reguliert?
2. Vertraglich: Welche vertraglichen Pflichten oder Lücken erzeugen Haftungsrisiken?
3. IP: Verletzt diese Tätigkeit Rechte Dritter oder versäumt es, eigene Rechte zu schützen?
4. Daten/Datenschutz: Welche personenbezogenen Daten werden verarbeitet? Welcher Rahmen gilt?
5. Arbeit: Neue Jurisdiktion, neue Tätigkeitsart oder neue Arbeitnehmerkategorie?
6. Haftung: Wo liegen die Freistellungsrisiken? Gibt es unbegrenzte Haftung?
7. Compliance: Exportkontrolle, Sanktionen, Antikorruption, Wettbewerbsrecht
8. Rechtsstreitigkeiten: Laufende Streitigkeiten, die durch diese Tätigkeit ausgelöst oder verschärft werden könnten?

Jedes Risiko kennzeichnen, das externe Rechtsberatung vor dem Fortfahren erfordert.
```

### Prompt für den Aufbau einer Forschungsagenda

```
Erstelle eine juristische Forschungsagenda für [THEMA].

Ich muss externe Rechtsberater in [X Tagen/Wochen] zu [Thema] briefen.
Budget für externe Rechtsberatungsrecherche: [X Stunden]
Fragen, die ich bereits zu stellen weiß: [ggf. auflisten]

Erstelle:
1. Zu beantwortende Rechtsfragen (nach Priorität geordnet)
2. Für jede Frage:
   - Den Recherchepfad (Gesetze → Rechtsprechung → Sekundärquellen)
   - Zu erfassende Jurisdiktionen
   - Voraussichtliche Komplexität (hoch/mittel/niedrig)
   - Empfohlenes Recherchewerkzeug (Westlaw / LexisNexis / BAILII / EUR-Lex / Google Scholar / Free Law)
3. Fragen, die intern beantwortet werden können (mit Claude + offenen Quellen)
4. Fragen, die externe Rechtsberatung erfordern
5. Ein Briefing für externe Rechtsberater: was wir benötigen, was wir bereits wissen, wovon die Geschäftsentscheidung abhängt

Geschätzte Recherchezeit für externe Rechtsberater: [X Stunden — aufgeschlüsselt nach Frage]
```

## Beispiel

**Nutzer:** Wir sind ein britisches SaaS-Unternehmen und möchten wissen, ob wir Kundendaten zum Training unseres KI-Modells verwenden dürfen. Fasse die Rechtslage gemäß GDPR zusammen.

**Erwartete Ausgabe:**
```markdown
# Juristisches Recherche-Memo

**Gestellte Frage:**
Darf ein britisches SaaS-Unternehmen personenbezogene Kundendaten zum Training eines internen KI-Modells gemäß UK GDPR verwenden?

**Kurze Antwort:**
Ja, aber nur wenn eine gültige Rechtsgrundlage für die Verarbeitung vorliegt, der Zweck mit dem ursprünglichen Erhebungszweck vereinbar ist und Kunden informiert werden. In der Praxis erfordert dies in der Regel: (a) entweder ausdrückliche Einwilligung, eine berechtigtes-Interessen-Bewertung (LIA) oder eine Vertragsgrundlage; (b) eine DSFA, wenn das KI-Training eine Hochrisikoverarbeitung darstellt; und (c) aktualisierte Datenschutzhinweise. Die Verwendung von Daten für KI-Training, das Kunden nicht erwartet haben — und über das sie nicht informiert wurden — schafft erhebliche GDPR-Durchsetzungsrisiken.
[GEGEN aktuelle ICO-Leitlinien PRÜFEN — KI- und Datenschutzleitlinien 2024 aktualisiert]

**Erörterung:**

**1. Rechtsgrundlage (Art. 6 UK GDPR)**
Die Verarbeitung von Kundendaten für das KI-Training erfordert eine Rechtsgrundlage. Die am häufigsten anwendbaren Grundlagen:

- **Berechtigte Interessen (Art. 6(1)(f)):** Verfügbar, wenn die Verarbeitung für berechtigte Interessen notwendig ist und die Interessen der betroffenen Person nicht überwiegen. Muss durch eine dokumentierte LIA unterstützt werden. Der ICO erwartet, dass die LIA berücksichtigt: (i) die Art des berechtigten Interesses; (ii) Notwendigkeit; (iii) Abwägungstest gegenüber individuellen Auswirkungen. Risiko: Kunden erwarten möglicherweise nicht, dass ihre Daten für KI-Training verwendet werden.
[PRÜFEN - ICO-Leitlinien zu KI und Datenschutz, 2024]

- **Einwilligung (Art. 6(1)(a)):** Gültig, wenn freiwillig, spezifisch, informiert und unmissverständlich. Erfordert eine neue Einwilligung, wenn die ursprüngliche Einwilligung kein KI-Training spezifiziert hat. Das Recht auf Widerruf der Einwilligung muss erhalten bleiben. Hohe Hürde — selten im großen Maßstab praktikabel.

- **Vertragserfüllung (Art. 6(1)(b)):** Nur verfügbar, wenn das KI-Training strikt notwendig ist, um den Vertrag zu erfüllen. Unwahrscheinlich, es sei denn, das Produkt *ist* ein KI-Modell, das der Kunde vertraglich vereinbart hat.

**2. Zweckbindung (Art. 5(1)(b))**
Für einen Zweck erhobene personenbezogene Daten (z.B. Nutzung des SaaS-Produkts) können nur für einen vereinbaren Zweck verwendet werden. KI-Modelltraining ist wahrscheinlich ein neuer Zweck. Vereinbarkeitstest (Art. 6(4)): Verbindung zwischen Zwecken, Kontext, Art der Daten, Konsequenzen und angewandte Schutzmaßnahmen berücksichtigen.
[PRÜFEN] Keine endgültige ICO-Entscheidung zur Vereinbarkeit von KI-Training — aktuelle Position entwickelt sich.

**3. DSFA-Anforderung (Art. 35 UK GDPR)**
Die Großverarbeitung personenbezogener Daten mit neuer Technologie (KI/ML) wird vom ICO als voraussichtlich DSFA-pflichtig eingestuft. DSFA vor Beginn des Trainings erstellen.

**4. Aktualisierung des Datenschutzhinweises (Art. 13–14)**
Betroffene Personen über diese neue Verarbeitung informieren. Datenschutzhinweis aktualisieren: Tatsache des KI-Trainings, angewandte Rechtsgrundlage, Einbeziehung Dritter und Rechte der betroffenen Personen (einschließlich Widerspruchsrecht bei berechtigten Interessen).

**Praktische Empfehlung:**
Vor der Verwendung von Kundendaten für das KI-Training: (1) Eine berechtigtes-Interessen-Bewertung dokumentieren; (2) Datenschutzhinweise aktualisieren; (3) Eine DSFA abschließen; (4) Datensparsamkeit umsetzen — pseudonymisierte oder anonymisierte Daten verwenden, wo möglich (tatsächlich anonymisierte Daten fallen aus dem GDPR-Anwendungsbereich heraus). Externe Datenschutzrechtsberatung zu den konkreten Fakten einholen, bevor fortgefahren wird.

**Offene Fragen:**
- Handelt es sich bei den Daten um besondere Datenkategorien (Art. 9) — z.B. Gesundheit, politische Meinungen? Wenn ja, ist eine Art.-9(2)-Grundlage erforderlich, erheblich höhere Hürde.
- Offenbart der Modell-Output jemals individuelle Daten? Falls ja, sind weitere Schutzmaßnahmen erforderlich.
- Sind Nicht-EU/UK-Kunden beteiligt? Gleichwertige Regeln prüfen (CCPA, Schweizer nDSG etc.)
```

---
