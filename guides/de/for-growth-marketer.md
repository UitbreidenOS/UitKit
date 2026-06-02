# Claude für Growth Marketer

Alles, was ein Growth Hacker oder Performance Marketer braucht, um KI-gestützte Experimente durchzuführen, Paid Acquisition zu optimieren, Funnels zu analysieren und über Wachstum zu berichten — ohne auf Daten-Teams oder Engineering-Sprints warten zu müssen.

---

## Für wen das gedacht ist

Du bist Growth Marketer, Performance Marketer oder Growth Hacker, der für das Bewegen von Kennzahlen verantwortlich ist: Anmeldungen, Aktivierungsraten, Paid CAC, Conversion Rates, MRR-Wachstum. Du führst ständig Experimente durch, lebst in Tabellen und Dashboards und stehst immer unter Zeitdruck.

**Vor Claude Code:** 3 Stunden, um ein Experiment-Brief und eine Stichprobengrößenberechnung zu schreiben. 2 Stunden, um einen wöchentlichen Wachstumsbericht zu erstellen. 45 Minuten pro A/B-Test-Dokumentation. Manuelle Funnel-Analysen aus rohen Datenexporten.

**Danach:** Experiment-Briefs in 5 Minuten. Wöchentliches Wachstumsnarrativ in 10 Minuten geschrieben und strukturiert. Stichprobengrößenberechnungen sofort. Funnel-Analyse strukturiert und aus deinen Rohdaten interpretiert. Du konzentrierst dich auf die Entscheidungen, Claude übernimmt die Synthese.

---

## 30-Sekunden-Installation

```bash
# Installiere den vollständigen Growth-Marketer-Stack
npx claudient add skill marketing/experiment-tracker
npx claudient add skill marketing/growth-dashboard
npx claudient add skill marketing/paid-ads
npx claudient add skill marketing/onboarding-cro
npx claudient add skill marketing/page-cro
npx claudient add skill marketing/analytics-tracking
npx claudient add skill marketing/referral-program
npx claudient add skill marketing/pricing-strategy
npx claudient add skill product/experiment-designer
npx claudient add agent advisors/cmo-advisor
npx claudient add agent advisors/cro-advisor
```

---

## Dein Claude Code Growth-Stack

### Skills (Slash-Befehle)

| Skill | Was er tut | Wann verwenden |
|---|---|---|
| `/experiment-tracker` | Hypothesenformulierung, Stichprobengrößenrechner, Ergebnisanalyse, statistische Signifikanz | Jeder A/B-Test — vor, während und danach |
| `/growth-dashboard` | Wöchentliches AARRR-Dashboard mit Trendanalyse und Kommentar | Montagmorgen-Metriken-Review |
| `/paid-ads` | Google, Meta, LinkedIn Kampagnenstruktur, Creative Brief, ROAS-Optimierung | Jede Paid-Channel-Arbeit |
| `/onboarding-cro` | Aktivierungsfunnel-Analyse, Onboarding-Sequenz-Optimierung | Wenn die Aktivierungsrate der Engpass ist |
| `/page-cro` | Landing-Page- und Conversion-Rate-Optimierung — Text, Layout, CTA-Tests | Seitenbasierte Conversion-Arbeit |
| `/analytics-tracking` | GA4, Mixpanel, Amplitude, PostHog Einrichtung und Funnel-Analyse | Analytics-Instrumentierung |
| `/referral-program` | Referral-Mechaniken, Anreizstruktur, viraler Koeffizient-Modellierung | Aufbau oder Verbesserung von Referral |
| `/pricing-strategy` | Preisseiten-Strategie, Plan-Positionierung, Preis-Tests | Preisexperimente |
| `/experiment-designer` | End-to-End-Experimentdesign: Hypothese, Methodik, Erfolgskennzahlen | Komplexe multivariate Experimente |

### Agents

| Agent | Modell | Wann einsetzen |
|---|---|---|
| `cmo-advisor` | Opus | Strategischer Channel-Mix, Budgetallokation, Wachstumsstrategie-Entscheidungen |
| `cro-advisor` | Sonnet | Spezifische Conversion-Rate-Probleme — was testen und warum |

---

## Täglicher Workflow

### Morgen (30–45 Minuten)

**1. Wöchentliches Wachstums-Dashboard — nur montags**
```
/growth-dashboard

Wöchentliche Wachstumskennzahlen — Woche vom [DATUM]:

Akquisition:
- Neue Anmeldungen: [N] (vs. [N] letzte Woche)
- Paid Spend: $[X]
- CAC nach Kanal: Google $[X] | Meta $[X] | Organisch $[X]

Aktivierung:
- Aktivierungsrate: [X%] (vs. [X%] letzte Woche)
- Zeit bis zum Aha-Moment (Median): [X Tage]

Retention:
- 7-Tage-Retention: [X%]
- 30-Tage-Retention: [X%]
- DAU/MAU: [X%]

Umsatz:
- MRR: $[X] (+$[X] WoW)
- Abgewanderter MRR: $[X]
- LTV:CAC: [X:1]

Laufende Experimente:
- [Testname]: Tag [X], Lift [+/-X%], Signifikanz [X%]

Schreibe mir das Dashboard mit Kommentar, Ampelstatus und empfohlenen Maßnahmen.
```

**2. Tägliche Experiment-Überprüfung — dauert 5 Minuten**
```
/experiment-tracker

Meine laufenden Tests:
1. [Testname]: Kontrolle [X%] vs. Variante [X%], [N] Besucher je, läuft seit [X Tagen]
2. [Testname]: Kontrolle [X] vs. Variante [X], [N] Besucher je, läuft seit [X Tagen]

Für jeden Test:
- Haben wir bereits statistische Signifikanz erreicht?
- Sind wir auf Kurs, bis [Zieldatum] abzuschließen?
- Zeigen Guardrail-Metriken Bedenken?
- Soll ich verlängern, stoppen oder weiterlaufen lassen?
```

---

### Mittag — Kampagnen- und Experimentarbeit

**3. Paid Acquisition-Optimierung**
```
/paid-ads

Kanal: [Google / Meta / LinkedIn]
Aktueller ROAS: [X] (Ziel: [X])
Aktueller CPA: $[X] (Ziel: $[X])
Monatlicher Spend: $[X]

Probleme dieser Woche:
- [Beschreibe, was unterdurchschnittlich abschneidet und welche Änderungen vorgenommen wurden]

Diagnostiziere das Problem und gib mir 3 Maßnahmen zur Verbesserung des ROAS diese Woche.
```

**4. CRO — Landing Page oder Funnel**
```
/page-cro

Seite: [URL oder Beschreibung]
Aktuelle Conversion Rate: [X%]
Traffic-Quelle: [paid / organisch / E-Mail]
Ziel: [Anmeldung / Kauf / Demo-Anfrage]
Vermutete Top-Reibungspunkte: [beschreiben]

Prüfe die Seite und gib mir die Top-3-Experimente, sortiert nach erwartetem Impact.
```

---

### Experiment-Launch-Checkliste

**Bevor du einen A/B-Test startest:**
```
/experiment-tracker

Ich bin dabei, diesen Test zu starten. Führe die Pre-Launch-Checkliste durch.

Test: [beschreibe die Änderung]
Primäre Kennzahl: [Conversion Rate / Klickrate / Umsatz pro Besucher]
Ausgangswert: [X%]
MDE: [X% relative Verbesserung, die ich erkennen muss]
Traffic: [X Besucher pro Tag auf dieser Seite/in diesem Flow]
Tool: [Optimizely / VWO / GrowthBook / LaunchDarkly]

Bestätige:
1. Erforderliche Stichprobengröße (pro Variante)
2. Erwartete Testdauer
3. Pre-Launch-Checkliste (Tracking, gegenseitige Ausschließlichkeit, Rollback-Plan)
4. Risiken, die ich kennen sollte
```

---

### Freitag — Wöchentlicher Experiment-Review

**5. Experiment-Portfolio-Review**
```
/experiment-tracker

Überprüfe mein Experiment-Portfolio diese Woche.

Abgeschlossene Tests:
[Testname]: Kontrolle [X%] vs. Variante [X%], [N] pro Variante, p-Wert [X], lief [X Tage]
Meine Entscheidung: [ausgerollt / gestoppt]

Laufende Tests:
[weiter für jeden aktiven Test]

Backlog (noch nicht gestartet):
1. [Idee 1] — geschätzter Impact [hoch/mittel/niedrig], Aufwand [hoch/mittel/niedrig]
2. [Idee 2]

Gib mir: ICE-Scores für das Backlog, ob meine abgeschlossenen Tests korrekt dokumentiert sind,
und was ich nächstes Quartal testen sollte.
```

---

## 30-Tage-Einarbeitungsplan (neue Growth Marketer)

### Woche 1 — Baseline-Messung
- Installiere alle Skills über die obigen Installationsbefehle
- Verbinde dein Analytics-Tool (GA4, Mixpanel, Amplitude oder PostHog)
- Führe `/analytics-tracking` aus, um dein aktuelles Tracking zu prüfen — finde, was kaputt oder fehlend ist
- Führe `/growth-dashboard` mit historischen Daten aus — etabliere deine Baseline-Zahlen
- Kartiere deinen vollständigen Funnel: von der Traffic-Quelle bis zum zahlenden Kunden — jeder Schritt

### Woche 2 — Hypothesen-Backlog
- Führe `/experiment-designer` und `/experiment-tracker` aus, um dein Hypothesen-Backlog zu bewerten
- Nutze ICE-Scoring, um die Top-5-Experimente für dieses Quartal zu priorisieren
- Für jede Hypothese: schreibe eine formale Hypothese, Stichprobengrößenberechnung und Erfolgskriterien, bevor du Code anfasst
- Starte in Woche 2 nichts — verstehe zuerst die Baseline

### Woche 3 — Erste Experimente
- Starte deine Top-2-Experimente aus dem Backlog
- Nutze `/paid-ads`, um das aktuelle Paid-Acquisition-Setup zu prüfen — finde verschwendete Ausgaben
- Führe ein CRO-Audit mit `/page-cro` auf deiner Traffic-stärksten Conversion-Seite durch
- Tracke: Wie lange dauert es, ein Experiment-Brief zu schreiben? Tracke das wöchentlich — es sollte bis Woche 4 auf unter 10 Minuten sinken

### Woche 4 — Velocity und Reporting
- Führe dein erstes vollständiges wöchentliches Wachstums-Dashboard von Grund auf durch
- Etabliere deine Experiment-Velocity: Wie viele Tests kann dein Team pro Monat durchführen?
- Präsentiere der Führungsebene: Was sind die Top-3-Wachstumshebel und was führst du gegen jeden durch?
- Identifiziere deine Analytics-Lücken — was kannst du nicht messen, obwohl du es brauchst?

---

## Tool-Integrationen

### Amplitude / Mixpanel / PostHog

Dies sind deine primären Datenquellen für jede Claude-Sitzung. Verbinde sie über MCP für Live-Datenzugriff:

```json
// Für PostHog — zu ~/.claude/settings.json hinzufügen
{
  "mcpServers": {
    "posthog": {
      "command": "npx",
      "args": ["-y", "@posthog/mcp-server"],
      "env": {
        "POSTHOG_API_KEY": "your-api-key",
        "POSTHOG_HOST": "https://app.posthog.com"
      }
    }
  }
}
```

Mit Live-Analytics-Zugriff kann Claude:
- Funnel-Conversion-Daten nach Kohorte, Segment oder Zeitfenster abrufen
- Ereignisanzahlen und Benutzereigenschaften abfragen, ohne in CSV zu exportieren
- Retention-Tabellen auf Abruf erstellen
- Segmente mit anomalem Verhalten identifizieren

### Google Ads und Meta Ads

Exportiere Performance-Daten als CSV → füge sie in `/paid-ads` zur Analyse ein.
Für automatisiertes Reporting verbinde über n8n oder Make — ziehe wöchentliche Kampagnendaten in eine Notion-Seite, dann führe `/growth-dashboard` dagegen aus.

### GrowthBook / LaunchDarkly (Experimentierplattformen)

Exportiere Experimentergebnisse → füge sie in `/experiment-tracker` für statistische Analyse und Entscheidungsunterstützung ein.
Claude trifft keine Ship/Kill-Entscheidungen — es liefert das statistische Bild und den Rahmen. Du triffst die Entscheidung.

### Notion / Confluence (Experiment-Log)

Nutze Claude, um Experiment-Dokumentation zu erstellen → füge sie nach jedem abgeschlossenen Test in das Team-Experiment-Log ein. Konsistente Dokumentation ist die einzige wichtigste Sache, die Growth-Teams nicht tun.

---

## Kennzahlen zum Verfolgen

| Kennzahl | Definition | Grün | Gelb | Rot |
|---|---|---|---|---|
| Wöchentliche Experiment-Velocity | Gestartete Tests pro Woche | ≥ 2 | 1 | 0 |
| Win-Rate | % der Experimente mit signifikantem positivem Lift | 25–35% | 15–25% | < 15% oder > 40% |
| Aktivierungsrate | % der neuen Anmeldungen, die den Aha-Moment abschließen | > 40% | 20–40% | < 20% |
| CAC-Rückzahlungszeitraum | Monate zur Rückgewinnung des CAC aus der Bruttomarge einer Kohorte | < 12 Mon. | 12–18 Mon. | > 18 Mon. |
| LTV:CAC-Verhältnis | Kunden-LTV geteilt durch CAC | > 3:1 | 2–3:1 | < 2:1 |
| Net Revenue Retention | (MRR + Expansion - Churn) / Anfangs-MRR | > 100% | 90–100% | < 90% |
| D30-Retention | % der Nutzer von Tag 0, die an Tag 30 noch aktiv sind | > 30% | 15–30% | < 15% |

---

## Häufige Wachstumsfehler (und wie Claude Code hilft, sie zu vermeiden)

**Fehler 1: Experimente ohne ordentliche Hypothese starten**
`/experiment-tracker` zwingt dich, die Hypothese, MDE und Erfolgskriterien zu schreiben, bevor du das Test-Tool anfasst. Keine Hypothese = kein Start.

**Fehler 2: Tests beim ersten Signifikanzergebnis stoppen**
Die Pre-Launch-Checkliste legt eine Testdauer und ein Enddatum fest. Claude weist darauf hin, wenn du Ergebnisse liest, bevor die erforderliche Stichprobengröße erreicht ist.

**Fehler 3: Einen kaputten Funnel optimieren**
`/analytics-tracking` und `/page-cro` identifizieren Tracking-Lücken und UX-Friction, bevor du CRO-Experimente durchführst. Ein kaputtes Onboarding zu beheben ist kein Test — es ist ein Bug-Fix.

**Fehler 4: Metriken ohne Kontext berichten**
`/growth-dashboard` generiert narrative Kommentare bei jedem Bericht — nicht nur Zahlen. "Anmeldungen sanken um 18%" braucht eine Erklärung und eine Maßnahme, nicht nur eine rote Ampel.

**Fehler 5: Paid-Spending, bevor der Funnel konvertiert**
`/onboarding-cro` und `/page-cro` identifizieren die größten Conversion-Drops. Behebe diese, bevor du Paid Acquisition skalierst — sonst füllst du einen undichten Eimer.

---

## Ressourcen

- [Erste Schritte mit Claude Code](./getting-started.md)
- [Experiment-Tracker-Skill](../skills/marketing/experiment-tracker.md)
- [Growth-Dashboard-Skill](../skills/marketing/growth-dashboard.md)
- [Growth-Experiment-Workflow](../workflows/growth-experiment.md)
- [Analytics-Tracking-Einrichtung](../skills/marketing/analytics-tracking.md)
- [Paid-Ads-Optimierung](../skills/marketing/paid-ads.md)

---

> **Arbeite mit uns:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
