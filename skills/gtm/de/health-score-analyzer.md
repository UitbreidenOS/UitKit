---
name: health-score-analyzer
description: "Kundenzustandsanalyse: Nutzungssignale, Beziehungssignale, kommerzielle Signale, Abwanderungsrisiko-Bewertung und empfohlene CS-Intervention fur jeden Account"
---

# Health Score Analyzer Skill

## Wann aktivieren
- Sie fuhren Ihr wochentliches Gefahrdeten-Kunden-Review durch und benotigen eine strukturierte Analyse
- Sie haben rohe Produktnutzungsdaten und mochten diese in einen Gesundheitsscore umwandeln
- Ein Kunde ist still geworden oder zeigt ungewohnliches Verhalten und Sie mochten eine Risikobewertung
- Aufbau oder Neukalibrierung Ihres Gesundheitsscoremodells nach einer Welle unerwarteter Abwanderung
- Vorbereitung des Portfolio-Reviews Ihres CS-Teams fur die Woche — welche Accounts benotigen Aufmerksamkeit?
- Sie mochten einen Account vor einem Verlangerungs- oder Expansionsgesprach bewerten

## Wann NICHT verwenden
- Aufbau des initialen Gesundheitsscore-Systems von Grund auf — verwenden Sie `/customer-success` fur das Modell-Design
- Detaillierte Produktanalysen fur interne Produktentscheidungen — andere Funktion
- Feststellung, ob ein Kunde bereit ist als Referenz oder Case Study zu dienen — separates Signal
- Vertriebsqualifizierungs-Scoring fur Interessenten — das ist Lead-Scoring-Gebiet

## Anweisungen

### Einzelaccount-Gesundheitsanalyse

```
Analysiere die Gesundheit dieses Kunden-Accounts und gib mir eine Risikobewertung.

Kunde: [Unternehmensname]
ARR: $[X]
Verlangerung: [Datum / X Monate entfernt]
Vertragstyp: [monatlich / jahrlich / mehrjahrig]
CSM: [Name]
Laufzeit: [X Monate / Jahre als Kunde]

NUTZUNGSSIGNALE — aus Ihrer Produktanalytik ziehen:
- Letzter Login (Team): [Datum — wie viele Tage her?]
- Login-Haufigkeit in diesem Monat: [X Logins] vs. letzten Monat: [X Logins]
- Kernfunktionsnutzung: [Was ist ihr primarer Anwendungsfall, und nutzen sie ihn?]
  - Funktion A: [X Mal in diesem Monat / nicht genutzt]
  - Funktion B: [X Mal in diesem Monat / nicht genutzt]
- Aktive Nutzer: [N von N lizenzierten Sitzen] = [X%] Sitzauslastung
- Nutzungstrend: [wachsend / gleich / sinkend — uber die letzten 3 Monate]
- Letzte Produktaktion: [beschreiben, was sie zuletzt getan haben]

BEZIEHUNGSSIGNALE:
- Letzter CSM-Kontaktpunkt: [Datum — X Tage her] [Call / E-Mail / Meeting]
- Champion-Status: [stark / schwach / kein Champion identifiziert / Champion gegangen]
- Executive Sponsor: [engagiert / nicht engagiert / unbekannt]
- NPS-Score: [X — Promoter / Passiv / Detractor] [Datum der letzten Umfrage]
- Support-Tickets in den letzten 90 Tagen: [N Tickets] — Typen: [beschreiben]
- Tickets uber Datenexport, API-Zugang oder Wettbewerber-Erwahnung? [ja/nein]
- Antwortzeit auf CSM-Kontaktaufnahme: [schnell / langsam / keine Reaktion]

KOMMERZIELLE SIGNALE:
- Rechnungsstatus: [aktuell / X Tage uberfalling]
- Angewendeter Rabatt: [X% — hoherer Rabatt = geringere Wechselkosten]
- Vertragswachstumstrend: [erweitert / gleich / reduziert seit Beginn]
- Stakeholder-Stabilitat: [sind wichtige Kontakte das Unternehmen verlassen?]
- Budget-Signale: [Anzeichen von Budget-Druck oder Umstrukturierung?]

WETTBEWERBSSIGNALE (falls bekannt):
- Wettbewerber in Support-Tickets oder Calls erwahnt? [ja/nein — welcher Wettbewerber]
- RFP oder Preisvergleichsanfrage? [ja/nein]
- LinkedIn-Aktivitat des Champions: [beworben Ihr Produkt noch / still / gegangen]

---

Erstellen:

GESUNDHEITSSCORE: [0-100]
Gesundheitsstufe: [GREEN 70-100 / YELLOW 40-69 / RED 0-39]
Abwanderungswahrscheinlichkeit: [GERING / MITTEL / HOCH / KRITISCH]

Top 3 Risikosignale (wichtigstes zuerst):
1. [Signal] — [Schwere] — [was es bedeutet]
2. [Signal] — [Schwere] — [was es bedeutet]
3. [Signal] — [Schwere] — [was es bedeutet]

Top 2 positive Signale:
1. [Signal]
2. [Signal]

Empfohlene Intervention:
- [Massnahme 1 — wer macht es, bis wann]
- [Massnahme 2 — wer macht es, bis wann]
- Eskalation erforderlich? [ja / nein — und auf welcher Ebene]

Verlangerungsprognose: [wird wahrscheinlich verlangern / gefahrdet / wird wahrscheinlich abwandern]
Expansionspotenzial: [keines / in X Monaten moglich / bereit jetzt zu besprechen]
```

### Portfolio-Gesundheits-Review

```
Fuhre ein Portfolio-Gesundheits-Review uber meine Kunden-Accounts durch.

CSM: [Name]
Gesamtaccounts: [N]
Verwalteter Gesamt-ARR: $[X]

[Kontodaten in diesem Format einfugen, eine Zeile pro Kunde:]

| Account | ARR | Verlangerung | Letzter Login | Aktive Sitze | NPS | Letzter Kontakt | Probleme |
|---|---|---|---|---|---|---|---|
| Unternehmen A | $24K | 2 Monate | vor 12 Tagen | 8/10 | 42 | vor 8 Tagen | Keine |
| Unternehmen B | $60K | 5 Monate | vor 45 Tagen | 3/10 | 18 | vor 21 Tagen | Support-Ticket offen |
| Unternehmen C | $12K | 1 Monat | vor 3 Tagen | 10/10 | 67 | vor 5 Tagen | Keine |
[fur alle Accounts fortsetzen]

Erstellen:

## Portfolio-Gesundheitszusammenfassung
- Gesamter ARR gefahrdet (Rote Accounts): $[X] ([X%] des Portfolios)
- Gesamt-ARR gelb: $[X]
- Gesamt-ARR gesund (Grun): $[X]
- Accounts, die sofortiges Handeln erfordern: [N]

## Account-Risikostufen

ROT — Sofortiges Handeln erforderlich:
| Account | ARR | Verlangerung | Risikosignal | Massnahme |
|---|---|---|---|---|
| [Unternehmen] | $[X] | [X Monate] | [Hauptrisiko] | [spezifische Massnahme] |

GELB — Aktive Uberwachung:
[gleiche Tabelle]

GRUN — Gesund / Expansionsbereit:
[gleiche Tabelle]

## CS-Prioritatenliste dieser Woche
1. [Account] — [warum dringend] — [spezifische Massnahme]
2. [Account] — [warum dringend] — [spezifische Massnahme]
3. [Account] — [warum dringend] — [spezifische Massnahme]

## Verlangerungen in den nachsten 60 Tagen — Verlangerungsbereitschaft:
| Account | ARR | Verlangerungsdatum | Gesundheit | Erforderliche Massnahme |
|---|---|---|---|---|
[Tabelle]

## Gefahrdeter ARR dieses Quartals: $[X]
Konservative Erholungsschatzung (wenn Massnahmen ergriffen): $[X]
```

### Erkennung von Abwanderungssignalen

```
Analysiere diese Kundensignale und teile mir das Abwanderungsrisiko mit.

Kunde: [Unternehmen]
Vertrag: $[X] ARR, verlangert sich am [Datum]

Zu bewertende Signale:
[Beschreiben Sie, was Sie beobachtet haben — E-Mails, Support-Ticket-Zusammenfassungen, Nutzungsdaten oder Notizen aus Calls einfugen]

Verwende diesen Abwanderungssignal-Bewertungsrahmen:

NUTZUNGSVERSCHLECHTERUNG (am prognostizierend):
- Logins um > 30% MoM gesunken: HOHES Risikosignal
- Kernfunktion seit > 30 Tagen nicht genutzt: HOHES Risikosignal
- Sitzauslastung unter 40% gesunken: MITTLERES Risikosignal
- Keine neuen Nutzer in > 60 Tagen hinzugefugt: MITTLERES Risikosignal

ENGAGEMENT-VERSCHLECHTERUNG:
- CSM-Kontaktaufnahme seit > 7 Tagen nicht beantwortet: HOHES Risikosignal
- Executive Sponsor abgetaucht: HOHES Risikosignal
- Champion hat das Unternehmen verlassen: KRITISCH — als neuen Deal behandeln
- Kunde fehlt bei oder sagt geplante Calls ab: HOHES Risikosignal
- NPS von Promoter zu Passiv oder Passiv zu Detractor gesunken: MITTLERES Risikosignal

KOMMERZIELLE SIGNALE:
- Rechnung > 30 Tage uberfalling: HOHES Risikosignal
- Nach Vertragsbedingungen, Kunstigungsprozess oder Datenexport gefragt: KRITISCH
- Rabatt ohne genannten Erweiterungsgrund angefordert: MITTLERES Risikosignal
- Personalabbau oder Budgetstopp in ihrem Unternehmen: MITTLERES Risikosignal

WETTBEWERBSSIGNALE:
- Wettbewerber namentlich erwahnt: HOHES Risikosignal
- Preisvergleich oder RFP angefordert: KRITISCH
- LinkedIn zeigt Champion, der jetzt Wettbewerberprodukt nutzt: KRITISCH

Die Signale bewerten und erstellen:
- Abwanderungswahrscheinlichkeit: [X%] — abgeleitet aus Anzahl und Schwere der Signale
- Zeithorizont: wahrscheinlich Abwanderung in [30 / 60 / 90+ Tagen]
- Grundursachen-Hypothese: [warum das passiert — Produktpassform / Support / Geschaftsveranderung / falsch verkauft]
- Rettungs-Playbook: [spezifische Massnahmensequenz fur dieses spezifische Risikoprofil]
- Eskalation: [wer sonst einbezogen werden sollte und warum]
```

### Gesundheitsscore-Modell-Kalibrierung

```
Helfen Sie mir, mein Gesundheitsscore-Modell basierend auf aktuellen Abwanderungsdaten zu kalibrieren.

Kontext:
- Abgewanderte Accounts letztes Quartal: [N Accounts, gesamt $X ARR]
- Was hatten die abgewanderten Accounts gemeinsam? [beobachtete Muster beschreiben]
- Wie war ihr Gesundheitsscore einen Monat vor der Abwanderung? [falls verfolgt]
- Accounts, die sich trotz niedrigem Gesundheitsstand uberraschend verlangert haben: [Beispiele?]

Zu uberpruifendes Gesundheitsscore-Modell:
Aktuelle Gewichtungen:
- Nutzungssignale: [X%]
- Beziehungssignale: [X%]
- Kommerzielle Signale: [X%]
- Ergebnissignale: [X%]

Aktuelle Signaldefinitionen:
[beschreiben, was Sie fur jeden Bereich messen]

Kalibrierungsanalyse:

1. Welche Signale waren fuhrende Indikatoren (traten vor der Abwanderung auf)?
   Die besten Gesundheitssignale sagen Abwanderung 60-90 Tage im Voraus vorher — nicht 2 Wochen davor.

2. Welche Signale waren nachlaufend (erst bei der Abwanderung sichtbar, zu spat zum Handeln)?
   Uberfallte Rechnung und Kunstigungsanfragen sind nachlaufend — dann ist man im Krisenmodus, nicht in der Pravention.

3. Falsch-Positive — Accounts, die rot scoreten, aber verlangerten:
   Was war bei ihnen anders? Gewichtung anpassen, um Fehlalarm-Ermudung zu reduzieren.

4. Falsch-Negative — Accounts, die grun scoreten, aber abwanderten:
   Welches Signal hat gefehlt? Hinzufugen oder Gewichtung erhohen.

5. Empfohlene Gewichtungsanpassung:
   Vorher: [aktuelle Gewichtungen]
   Nachher: [empfohlene Gewichtungen basierend auf Vorhersagegenauigkeit]
   Begrundung: [warum jede Anderung]

6. Neue hinzuzufugende Signale:
   - [Signal] — Datenquelle: [woher beziehen] — fuhrend/nachlaufend: [Typ]

Erstellen Sie ein aktualisiertes Gesundheitsscore-Modell mit neu kalibrierten Gewichtungen und Signaldefinitionen.
```

## Beispiel

**Benutzer:** Einer meiner $85K ARR Accounts ist still geworden. Der Champion hat in 3 Wochen auf zwei E-Mails nicht geantwortet. Die Nutzung sieht auf der Oberflache gut aus (sie loggen sich ein), aber es ist nur eine Person. Sie verlangern in 8 Wochen. Was soll ich tun?

**Gesundheitsanalyse von Claude:**

**Gesundheitsscore: 34/100 — ROT**
**Abwanderungswahrscheinlichkeit: HOCH — Risiko materialisiert sich jetzt**

**Was Sie beschreiben, ist ein klassisches falsch-positives Nutzungssignal:**
Eine Person loggt sich ein, um den Account "aktiv" zu halten, wahrend die Kaufentscheidung hinter den Kulissen fallt. Echte Akzeptanz ist 1 Person, nicht ein Team. Das ist kein Nutzungssignal — das ist ein Haftungssignal.

**Aktive Risikosignale:**
1. Champion nicht responsive x 2 Versuche (HOCH) — entweder ist er/sie nicht mehr Ihr Champion, oder das Gesprach hat sich uber seine/ihre Hierarchieebene verschoben
2. Einzelnutzer-Akzeptanz (HOCH) — Produkt hat nie Team-Akzeptanz erreicht; keine internen Stakeholder, die ein Interesse daran haben
3. 8 Wochen bis zur Verlangerung ohne Engagement (KRITISCH) — Sie sind aus der Zeit fur normale CS-Schritte

**Empfohlene Intervention — diese Woche, nicht nachste Woche:**

1. **Den Champion umgehen.** Finden Sie dessen Vorgesetzten oder den wirtschaftlichen Entscheider auf LinkedIn. Senden Sie eine kurze, direkte E-Mail: "Ich habe versucht, [Name] zu erreichen und keine Antwort erhalten. Ich mochte sicherstellen, dass [Unternehmen] im Hinblick auf Ihre Verlangerung den vollen Wert aus Ihrer Investition bei uns zieht — konnen wir diesen Monat 20 Minuten sprechen?"

2. **Produktdaten als Aufhanger nutzen.** E-Mail an den Champion (ein letzter Versuch): "Ich habe Ihre Team-Nutzungsdaten vor Ihrer Verlangerung uberpruft und festgestellt, dass wir [Funktion] stark unternutzen, die normalerweise [spezifisches Ergebnis] fur Teams wie Ihres erzielt. Ich wurde Ihnen gerne zeigen, was andere [Branchen]-Unternehmen tun — 15 Minuten diese Woche?"

3. **Ihren AE jetzt informieren.** Uberfallen Sie ihn nicht 2 Wochen vor der Verlangerung. Er hat moglicherweise eine Beziehung auf Executive-Ebene.

**Wenn Sie in 5 Tagen keine Reaktion erhalten:** Intern eskalieren. Lassen Sie Ihren VP eine direkte E-Mail an denjenigen senden, der den ursprunglichen Vertrag unterzeichnet hat. Als Geschaftspruifung rahmen, nicht als Verlangerungsdruck.

**Expansionspotenzial: Keines, bis die Gesundheit wiederhergestellt ist.**

---

> **Arbeiten Sie mit uns:** Claudient wird unterstuetzt von [Uitbreiden](https://uitbreiden.com/) — wir entwickeln KI-Produkte und B2B-Losungen mit Entwicklergemeinschaften.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
