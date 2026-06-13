---
name: dashboard-narrator
description: "Dashboard-Daten und Diagramme in verständliche Prosa übersetzen: wichtigste Erkenntnisse, Anomalien, Empfehlungen — geschrieben für nicht-technische Stakeholder, die keine Diagramme lesen"
---

# Skill: Dashboard-Narrator

## Wann aktivieren
- Ein Stakeholder benötigt eine schriftliche Zusammenfassung des Dashboard-Inhalts — nicht nur einen Link dazu
- Vorbereitung einer wöchentlichen oder monatlichen Geschäftsüberprüfung und Bedarf an Begleittexten zu Diagrammen
- Das Führungsteam liest die Dashboards nicht und die Daten müssen zu ihnen gebracht werden
- Mehrere Metriken müssen zu einer kohärenten Geschichte zusammengefasst werden, nicht als bloße Zahlenliste
- Übersetzung eines komplexen Mehrmetriken-Dashboards in ein Executive Briefing

## Wann NICHT verwenden
- Ursachenanalyse, die SQL-Abfragen auf Rohdaten erfordert — dafür `/sql` verwenden
- Erstellung des Dashboards selbst — dafür das BI-Tool nutzen (Looker, Tableau, Metabase)
- Statistische Analysen oder Hypothesentests — dafür `/pandas-polars` oder `/sql` verwenden
- Echtzeit-Datenwarnungen — diese im Warnsystem des BI-Tools einrichten

## Anweisungen

### Kernprompt für die Dashboard-Narration

```
Übersetze diese Dashboard-Daten in eine verständliche Prosa für ein nicht-technisches Publikum.

DASHBOARD: [Name und was es verfolgt — z.B. „Wöchentliche Geschäftsüberprüfung", „Wachstumsmetriken", „Produktzustand"]
PUBLIKUM: [wer dies lesen wird — Führungsteam / Vorstand / Abteilungsleiter / Investoren]
BERICHTSZEITRAUM: [diese Woche / dieser Monat / Q? 202?]
VERGLEICHSZEITRAUM: [vs. letzte Woche / letzten Monat / gleicher Zeitraum letztes Jahr]

METRIKEN (Daten einfügen):
[Für jede Metrik angeben: Name, aktueller Wert, Vorperiodenwert, Ziel/Plan falls vorhanden]

Beispielformat:
- Wöchentlich aktive Nutzer: 48.200 (↑ 3,1 % vs. letzte Woche, Ziel: 50.000, -3,6 % vs. Ziel)
- Umsatz: 1,24 Mio. $ (↑ 8,4 % vs. letzte Woche, ↑ 22 % vs. gleiche Woche letztes Jahr)
- Konversionsrate: 3,2 % (↓ 0,4 Pp vs. letzte Woche — vorher 3,6 %)
- Kundenfluktuation: 1,8 % monatlich (↑ 0,3 Pp vs. letzten Monat — höchster Wert seit 6 Monaten)
- CAC: 142 $ (↓ 12 % vs. letzten Monat — verbessert sich)
- LTV/CAC: 4,1x (stabil)
- NPS: 42 (von 48 letztes Quartal)

KONTEXT DEN ICH KENNE:
[Geschäftsereignisse, die die Daten erklären — Produktlaunch, Marketingkampagne, Preisänderung, Saisonalität, Vorfall]

Schreibe:
1. SCHLAGZEILE (1 Satz): Was ist der Gesamtzustand des Unternehmens in diesem Zeitraum?
2. ERFOLGE (2–3 Stichpunkte): Was hat sich verbessert und warum das wichtig ist
3. BEDENKEN (2–3 Stichpunkte): Was sich verschlechtert hat, das Ausmaß und ob es ein Trend oder Einmaleffekt ist
4. ANOMALIEN (falls vorhanden): Alles, was nicht zum Muster passt — Untersuchungshinweise
5. EMPFEHLUNG: 1–2 Maßnahmen, die das Team basierend auf diesen Daten ergreifen sollte
6. BEOBACHTUNGSLISTE: Metriken, die im nächsten Zeitraum genau beobachtet werden sollten

Unter 400 Wörter halten. Für einen CEO schreiben, der es in 90 Sekunden liest.
```

---

### Anomalieerkennung und -erklärung

```
Ich habe eine Anomalie in meinen Dashboard-Daten. Hilf mir, sie klar zu beschreiben und mögliche Ursachen zu untersuchen.

METRIK: [Metrikname]
ERWARTETER WERT: [was er typischerweise ist oder was der Plan vorgibt]
TATSÄCHLICHER WERT: [was er in diesem Zeitraum ist]
AUSMASS: [X % über/unter erwartet, X Standardabweichungen vom 30-Tage-Durchschnitt]
DAUER: [wann es begann — einmaliger Ausreißer oder anhaltende Änderung?]

UMGEBUNGSKONTEXT (benachbarte Metriken einfügen, die korreliert sein könnten):
[Andere Metriken aus demselben Zeitraum]

Mögliche Ursachen zur Untersuchung:
1. [Geschäftsereignis — hat sich operativ etwas geändert?]
2. [Datenqualität — könnte dies ein Tracking- oder Protokollierungsproblem sein?]
3. [Saisonal oder extern — gibt es ein bekanntes Muster oder einen externen Faktor?]
4. [Upstream-Abhängigkeit — hat sich eine Datenquelle oder Pipeline geändert?]

Schreibe:
1. Eine verständliche Beschreibung der Anomalie (1–2 Sätze), die ein nicht-technischer Stakeholder verstehen kann
2. Die 3 wahrscheinlichsten Erklärungen, nach Wahrscheinlichkeit geordnet
3. Wie festgestellt werden kann, welche Erklärung zutrifft (was zu prüfen ist)
4. Ob dies sofortiges Handeln oder Beobachtung erfordert
```

---

### Mehrdiagramm-Synthese (wöchentliche Geschäftsüberprüfung)

```
Ich habe mehrere Dashboards, die zu einer einzigen wöchentlichen Geschäftsüberprüfungs-Prosa zusammengefasst werden sollen.

GESCHÄFTSKONTEXT:
- Unternehmen: [kurze Beschreibung]
- Phase: [Seed / Series A / Wachstum / etabliert]
- Primäres Geschäftsmodell: [SaaS / Marktplatz / E-Commerce / etc.]
- Aktuelle strategische Priorität: [Wachstum / Rentabilität / Bindung / Expansion]

DASHBOARD 1 — WACHSTUM:
[Metriken einfügen: neue Nutzer, Anmeldungen, MQLs, Testphasen, Demo-Anfragen]

DASHBOARD 2 — UMSATZ:
[Metriken einfügen: MRR/ARR, Expansion, Kontraktion, Fluktuation, NRR]

DASHBOARD 3 — PRODUKT:
[Metriken einfügen: DAU/WAU/MAU, Aktivierungsrate, Feature-Nutzung, NPS]

DASHBOARD 4 — EINHEITENÖKONOMIE (falls zutreffend):
[Metriken einfügen: CAC, LTV, Amortisationszeitraum, Bruttomarge]

EREIGNISSE DIESE WOCHE:
[Produkt-Releases, Kampagnen, Vorfälle, externe Neuigkeiten]

Schreibe eine einzelne kohärente Geschäftsüberprüfungs-Prosa, die:
1. Mit dem Gesamtzustand des Unternehmens beginnt (1-Satz-Urteil)
2. Die Geschichte über Wachstum → Umsatz → Produkt → Effizienz in logischer Reihenfolge erzählt
3. Die 2–3 wichtigsten Ereignisse über alle Dashboards hinweg hervorhebt
4. Widersprüche kennzeichnet (z.B. „Aktivierung verbessert, aber NPS gesunken — lohnt sich zu untersuchen")
5. Mit dem endet, was nächste Woche beobachtet werden sollte

Ziel: max. 500 Wörter. In 3 Minuten lesbar. Keine Aufzählungspunkte um ihrer selbst willen — Fließtext mit eingebetteten Datenpunkten.
```

---

### Stakeholder-spezifische Rahmung

Den Output je nach Leserschaft anpassen:

**Für den CEO:**
```
Rahme die Dashboard-Prosa für einen CEO.
Fokus auf: Ist das Unternehmen auf Kurs? Worauf sollten wir uns konzentrieren? Dringende Entscheidungen?
Weglassen: Technische Metrikdefinitionen, Methodikhinweise.
Mit dem Urteil beginnen, mit 3 Datenpunkten belegen, mit empfohlener Maßnahme enden.
```

**Für den Vorstand:**
```
Rahme die Dashboard-Prosa für ein Vorstandsupdate.
Fokus auf: Fortschritt vs. Plan, wesentliche Risiken, Kapitaleffizienz.
Format: 3 Stichpunkte — was gut lief, was nicht, was wir dagegen tun.
Einbeziehen: Vergleich mit Plan/Ziel, nicht nur Periodenvergleich.
Vermeiden: Operative Details, die sie nicht genehmigen oder entscheiden müssen.
```

**Für ein funktionales Team (Marketing, Produkt, Vertrieb):**
```
Rahme die Dashboard-Prosa für das [Marketing- / Produkt- / Vertriebs-]team.
Fokus auf: Metriken, die sie besitzen und auf die sie reagieren können.
Einbeziehen: Konkrete Maßnahmen, die sie basierend auf den Daten ergreifen sollten.
Ton: Direkt, handlungsorientiert. Sie wollen wissen, was zu tun ist, nicht nur was passiert ist.
```

---

### Übersetzungsmuster: Diagramm zu Text

Diese Muster verwenden, wenn spezifische Diagrammtypen beschrieben werden:

```
Trendlinienchart beschreiben:
„[Metrik] [Richtung: stieg / fiel / blieb stabil] von [X] auf [X] über [Zeitraum],
ein [Ausmaß: starker / gradueller / moderater] [Anstieg/Rückgang] von [X %].
[Bei Trend]: Der [Aufwärts-/Abwärtstrend] begann im [Monat] und hat sich [fortgesetzt / umgekehrt / abgeflacht]."

Balkendiagramm-Vergleich beschreiben:
„[Kategorie A] übertraf [Kategorie B] um [X %] ([A: X] vs. [B: X]).
[Kategorie C] zeigte den größten [Anstieg/Rückgang], [um / unter] [X %] vs. [Vorperiode]."

Trichterdiagramm beschreiben:
„Von [X] [obere Trichterstufe] erreichten [X] % ([N]) [Stufe 2], und [X] % ([N]) konvertierten zur [letzten Stufe].
Der größte Abfall tritt bei [Stufe] auf, wo [X] % [derer, die diese Stufe erreichten] nicht fortschritten."

Verteilung / Histogramm beschreiben:
„Der Median [Metrik] beträgt [X], wobei [X] % der [Einheiten] zwischen [X] und [X] liegen.
Der [rechte/linke] Schwanz zeigt, dass [X] % der [Einheiten] Werte über/unter [Schwellenwert] haben."
```

---

### Qualitäts-Checkliste für Erkenntnisse

Vor dem Versand einer Dashboard-Prosa prüfen:

```
Überprüfe diese Dashboard-Prosa auf Qualität.

Tut sie folgendes:
[ ] Mit dem wichtigsten Befund beginnen, nicht dem offensichtlichsten?
[ ] Jede Aussage quantifizieren (nicht „Umsatz wuchs" — „Umsatz wuchs um 14 %")?
[ ] Zwischen Korrelation und Kausalität unterscheiden?
[ ] Fakten von Interpretationen trennen (Fakten: „Fluktuation stieg um 0,3 Pp"; Interpretation: „wahrscheinlich wegen...")?
[ ] Kennzeichnen, was wir nicht wissen oder aus den Daten nicht erklären können?
[ ] Mit einer konkreten Maßnahme enden, nicht einem vagen „wir sollten das beobachten"?
[ ] Fachbegriffe vermeiden, die das Publikum nicht versteht?

Falls ein Punkt nicht erfüllt ist, die betreffenden Abschnitte neu schreiben.
```

## Beispiel

**Nutzer:** Wöchentliches Dashboard — WAUs: 48.200 (+3,1 % WoW, Ziel war 50 Tsd.). Konversionsrate: 3,2 % (war 3,6 % letzte Woche). Umsatz: 1,24 Mio. $ (+8,4 % WoW). Fluktuation: 1,8 % (war 1,5 % letzten Monat). NPS: 42 (war 48 letztes Quartal). Neues Produkt-Feature am Dienstag gelauncht. Publikum: CEO und Führungsteam.

**Erwartete Ausgabe:** Einleitender Urteilssatz („Das Umsatzwachstum beschleunigt sich, aber Konversions- und Bindungssignale erfordern Aufmerksamkeit"). Erfolge: starkes Umsatzwachstum, positiver WAU-Trend. Bedenken: Der Konversionsratenrückgang fällt mit dem Dienstag-Launch zusammen — das neue Feature könnte den Anmeldeprozess stören; der Fluktuationsanstieg ist früh, aber ein 3-Monats-Trend zu beobachten. Empfehlung: A/B-Test des neuen Onboarding-Flows gegenüber der vorherigen Version; Fluktuations-Kohortenanalyse einplanen, um festzustellen, ob ein bestimmtes Segment die 1,8 %-Rate treibt. Beobachtungsliste: Konversionsrate und Fluktuation für die nächsten 2 Wochen.

---
