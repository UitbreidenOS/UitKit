# Preisoptimierer

## Wann aktivieren
- Du erwägst eine Preiserhöhung und möchtest einen strukturierten Rahmen statt zu raten
- Du hast Preise seit 18+ Monaten nicht überprüft und allein Inflation hat deine realen Preise erodiert
- Du launchst ein neues Produkt oder Service und brauchst einen verteidigbaren Preis statt "was sich richtig anfühlt"
- Deine Services sind für verschiedene Clients unterschiedlich tarifiert ohne klare Logik — du vermutest, dass du deine besten Clients unterpreist
- Ein Konkurrent hat Preise erhöht oder gesenkt und du musst entscheiden, wie du reagierst

## Wann NICHT nutzen
- Du bist in einem Commodity-Markt, wo Preise vom Markt festgelegt werden, nicht von dir — Race-to-the-bottom-Dynamiken überschreiben Preisstrategie
- Du hast einen CFO oder Preisanalyst, der schon strukturierte Preisreviews durchführt
- Du bist pre-product-market-fit — erreiche erst PMF, dann optimiere Preise

## Anweisungen

### Schritt 1: Etabliere deinen Preiskontext

Sag:

"Ich führe ein [Geschäftstyp] das [Produkt/Service] verkauft. Meine aktuelle Preisgestaltung ist [liste jedes Tier oder Produkt mit seinem Preis]. Mein durchschnittlicher Customer LTV ist [$X]. Meine Brutomarge ist [Y%]. Mein typischer Customer ist [Persona]. Meine Hauptkonkurrenten preisen bei [Liste — Name und ungefährer Preispunkt]. Ich habe Preise [Z] mal in den letzten 2 Jahren geändert."

### Schritt 2: Preisaudit

Frag Claude, um deine aktuelle Preisgestaltung zu auditieren.

Sag:

"Auditiere meine aktuelle Preisstruktur. Flagge: (1) jeden Tier, der zu nah an einem anderen Tier tarifiert ist (niedrige Differenzierung), (2) jeden Tier, der zu weit von einem anderen entfernt ist (Lücke in der Wertleiter), (3) jeden Tier, der unter Markt tarifiert ist basierend auf der Konkurrenzpreisgestaltung, die ich bereitgestellt habe, (4) jeden Tier, wo der Preis rund ist (oft ein Zeichen, dass er durch Vermutung festgelegt wurde, nicht durch Analyse), (5) jeden Service oder Produkt, der nicht sauber in die Preisleiter passt."

Lies das Audit sorgfältig. Claude wird manchmal eine "runde Zahl" als Problem flaggen, wenn die runde Zahl der richtige Ruf ist — runde Zahlen reduzieren Entscheidungsreibung bei den niedrigeren Tiers. Nutze das Audit als Ausgangspunkt.

### Schritt 3: Preiserhöhungs-Entscheidungs-Framework

Wenn du eine Preiserhöhung erwägst:

Sag:

"Ich erwäge eine Preiserhöhung bei [Tier/Produkt] von [$X] zu [$Y] — eine [Z%] Erhöhung. Meine aktuellen Customers auf diesem Tier sind [N]. Letzte Erhöhung war [Datum]. Baue den Fall für und gegen: (1) was ist die erwartete Churn von bestehenden Customers, (2) was ist die neue Customer Nachfrage-Auswirkung, (3) was ist die Brand-Positionierungs-Auswirkung, (4) was ist die operative Kosten für den Betrieb von zwei Preis-Tiers während der Übergang, (5) was ist das Timing-Risiko (ein Ereignis in den nächsten 6 Monaten, das die Erhöhung schlecht aussehen lässt)?"

Du bekommst einen strukturierten Pro/Con. Der Output ist ein Entscheidungsunterstützungs-Tool, nicht die Entscheidung selbst.

### Schritt 4: Tier-Umstrukturierung

Wenn dein Preisaudit einen Bedarf zur Umstrukturierung von Tiers zeigte:

Sag:

"Schlag 3 alternative Preisstrukturen für mein Geschäft vor: (1) eine wertbasierte 3-Tier-Leiter, (2) eine pro-Sitz oder pro-Unit-Struktur falls anwendbar, (3) eine ergebnis-basierte oder Hybrid-Struktur. Für jede, zeige: Preisgestaltung pro Tier, der Wert-Delta zwischen Tiers, der Ziel-Customer für jeden Tier, der Migrations-Plan für bestehende Customers, die projizierte Umsatz-Auswirkung in Jahr 1."

Schau dir alle drei an. Oft ist die "offensichtliche" Antwort (mehr Tiers) falsch, und die richtige Antwort ist weniger, mehr differenzierte Tiers.

### Schritt 5: Bestehender Customer-Migrations-Plan

Wenn du Preise auf bestehende Customers erhöhst:

Sag:

"Ich erhöhe Preise auf [Tier] von [$X] zu [$Y] effektiv [Datum]. Ich habe [N] bestehende Customers auf diesem Tier mit durchschnittlicher Amtszeit von [Z] Monaten. Entwerfe: (1) die Ankündigungs-Email — klar, respektvoll, führt mit Grund und Wert statt Preis, (2) ein Preis-Sperr-Angebot für lang-etablierte Customers, die für 12 Monate zum aktuellen Satz sperren, (3) die Antwort-Vorlage für Customers, die drücken, (4) die Antwort-Vorlage für Customers, die sich für Kündigung entscheiden."

Die Beibehaltungsauswirkung davon, wie du die Preiserhöhung handhabst, ist oft wichtiger als die Preiserhöhung selbst. Ein schlampiger Email erzeugt vermeidbare Churn.

### Schritt 6: A/B Preistest

Wenn dein Geschäftsvolumen es unterstützt:

Sag:

"Entwerfe einen Preistest für mein [Produkt/Service]. Aktueller Preis [$X]. Test-Varianten: [$Y] und [$Z]. Mein monatliches Traffic/Lead-Volumen ist [N]. Design: (1) die Test-Struktur (welche Customers sehen welchen Preis), (2) die Stichprobengröße, die für statistische Signifikanz erforderlich ist, (3) die Entscheidungskriterien (Konversionsrate, Gesamtrevenue, LTV-Implikationen), (4) die Test-Dauer, (5) der Rollback-Plan, falls der Test einen unerwarteten Rückgang offenbart."

Die meisten kleinen Unternehmen haben nicht das Volumen für saubere A/B Preistore. Die strukturierte Analyse sagt dir, ob du es hast.

### Schritt 7: Konkurrenten-Reaktion

Wenn ein Konkurrent ihre Preisgestaltung ändert:

Sag:

"Konkurrent [Name] hat gerade ihre Preisgestaltung von [$X] zu [$Y] geändert. Mein aktueller Preis ist [$Z]. Ihre Positionierung ist [Premium / Mid-Market / Rabatt]. Meine Positionierung ist [gleich / anders]. Analysiere: (1) die wahrscheinliche strategische Absicht hinter ihrem Zug, (2) die Auswirkung auf meine Pipeline wenn ich nicht reagiere, (3) drei Antwortoptionen (abgleichen, halten und differenzieren, erhöhen um die Lücke zu vergrößern), (4) die empfohlene Antwort mit Begründung."

Gleiche Konkurrenten-Zügel nicht reflexiv ab. Die strukturierte Analyse offenbart oft, dass halten der richtige Ruf ist.

## Beispiel

Du führst ein kleines B2B SaaS für Sales Teams bei $99/Monat für den Pro Tier. Du hast 340 Pro Customers — $34K MRR auf diesem Tier. Du hast Preise seit 28 Monaten nicht erhöht. Allein Inflation hat deinen realen Preis um ungefähr 12% über diesem Zeitraum reduziert.

Du setzt das Preisaudit auf. Claude flaggt:
- Der Pro Tier ($99) ist zu nah am Team Tier ($149) — nur ein 51% Delta für eine bedeutende Fähigkeits-Lücke
- Der Pro Tier ist weit unter Markt — Konkurrenten Mid-Tier-Angebote liegen zwischen $129 und $199
- Dein Enterprise Tier ($499) hat eine zu breite Lücke vom Team ($149)

Du entscheidest, Pro von $99 zu $129 zu erhöhen — eine 30% Erhöhung, aber immer noch unter Markt.

Du führst den Migrations-Plan-Workflow durch. Claude entwirft:

**Ankündigungs-Email (340 Customers):**
> Vor zwei Jahren, als wir den Pro Tier bei $99 launchten, hatte unser Produkt [Liste 3 spezifische Funktionen bei Launch]. Heute enthält derselbe Tier [Liste 6 Funktionen hinzugefügt seit]. Ab [Datum 60 Tage], wird der Pro Tier $129 sein. Wenn du den aktuellen $99-Satz für die nächsten 12 Monate sperren möchtest, indem du zu jährlicher Abrechnung wechselst, kannst du das hier tun: [Link]. Das ist die erste Preisänderung, die wir jemals auf Pro gemacht haben. Wir erwarten, dass es mindestens 24 Monate das letzte ist.

**Sperr-Angebot:** Jährliche Abrechnung bei $99/Monat-Äquivalent, gesperrt bis [Datum 12 Monate].

**Pushback-Antwort:** Anerkennt Bedenken, Referenzen das Sperr-Angebot, versucht nicht aufzuverkaufen.

**Kündigungs-Antwort:** Anerkennt, bietet eine 30-Tage Schonfrist, fragt nach Feedback.

Du sendest. Über die nächsten 30 Tage:
- 110 von 340 Customers (32%) nehmen das jährliche Sperr-Angebot — gesperrt bei $99 für 12 Monate
- 12 Customers (3,5%) kündigen — innerhalb des erwarteten Churn-Bereichs des Modells
- 218 Customers bleiben monatlich beim neuen $129-Preis

Netto-MRR-Auswirkung: $34K → $40,2K nach Migrations-Ende. Das ist $74K annualisiertes inkrementelles Umsatz. Die 12 gekündigten Customers stellen $14K in verlorenem ARR dar, das du ohnehin über Zeit verloren hättest.

Du planest einen 24-Monat Kalender-Erinnerung, um Pro-Preisgestaltung zu revidieren. Derselbe Workflow handhabt die nächste Anpassung.
