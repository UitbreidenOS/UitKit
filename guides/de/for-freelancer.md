# Claude für Freelancer und Berater

Alles, was ein Freelancer oder unabhängiger Berater benötigt, um KI-gestützte Kundenakquise, Projektmanagement, Abrechnung und Geschäftsentwicklung in Claude Code durchzuführen.

---

## Für wen dieser Leitfaden gedacht ist

Sie sind Freelancer oder unabhängiger Berater — Designer, Entwickler, Texter, Stratege, Marketer oder Spezialist — und führen Ihr eigenes kundendienstleistendes Unternehmen. Ihr Einkommen hängt davon ab, Projekte zu gewinnen, sie gut zu liefern, bezahlt zu werden und die Pipeline kontinuierlich zu füllen. Sie verbringen 30% Ihrer Zeit mit Geschäftsbetrieb, der keinen Umsatz generiert. Claude Code reduziert diesen Overhead, damit Sie mehr Zeit für fakturierbare Arbeit und Geschäftsentwicklung aufwenden können.

**Vor Claude Code:** 2 Stunden für das Schreiben eines überzeugenden Angebots. 45 Minuten für den Entwurf eines Leistungsumfangs. 30 Minuten pro Kunden-Statusbericht. Stunden für die Nachverfolgung unbezahlter Rechnungen jeden Monat.

**Danach:** Angebot in 20 Minuten. Leistungsumfang in 15 Minuten. Statusbericht in 8 Minuten. Rechnungs-Follow-up in 60 Sekunden entworfen.

---

## Installation in 30 Sekunden

```bash
# Alle Freelancer-Skills installieren
npx claudient add skill small-business/freelancer-proposal
npx claudient add skill small-business/scope-of-work
npx claudient add skill small-business/client-status-report
npx claudient add skill small-business/invoice-chaser
npx claudient add skill small-business/cold-outreach
npx claudient add skill small-business/cash-flow-forecast
npx claudient add skill small-business/agency-operations

# Den CEO-Berater-Agenten installieren
npx claudient add agent advisors/ceo-advisor
```

---

## Ihr Claude Code Freelancer-Stack

### Skills (Slash-Befehle)

| Skill | Was er tut | Wann verwenden |
|---|---|---|
| `/freelancer-proposal` | Mehr Projekte gewinnen — Angebotserstellung mit klaren Wertversprechen, Preisbegründung und Call to Action | Bei jeder neuen Projektmöglichkeit |
| `/scope-of-work` | Lieferungen, Ausschlüsse, Zeitplan, Zahlung und Nachtragsregelungen definieren | Vor jedem Projektstart |
| `/client-status-report` | Wöchentliche/monatliche Kunden-Updates — Fortschritt, Blocker, benötigte Entscheidungen | Aktives Projektmanagement |
| `/invoice-chaser` | Professionelle Zahlungsmahnungen für überfällige Rechnungen — eskalierendes Vorgehen | Bei jeder überfälligen Rechnung |
| `/cold-outreach` | Outbound-Akquise bei neuen Kunden — personalisiert, nicht aufdringlich | Geschäftsentwicklung |
| `/cash-flow-forecast` | 90-Tage-Cashflow-Prognose — wann Geld eingeht, wann Rechnungen fällig sind | Monatliche Finanzplanung |
| `/agency-operations` | SOPs, Onboarding, Teamprozesse beim Skalieren | Wachstum über Einzelpersonen hinaus |

### Agent

| Agent | Modell | Wann einsetzen |
|---|---|---|
| `ceo-advisor` | Sonnet | Preisentscheidungen, schwierige Kundensituationen, Geschäftsstrategie |

---

## Täglicher Workflow

### Morgen (15 Minuten)

**1. Neue Anfrage — Umfang einschätzen und antworten**
```
/freelancer-proposal

Neue Projektanfrage erhalten. Folgendes wurde mir mitgeteilt:
[Kundennachricht oder Brief einfügen]

Meine Dienstleistungen: [was Sie tun]
Mein Honorar: $[X]/Stunde oder $[X] für diesen Projekttyp
Wichtige Fragen, die ich habe: [was Sie wissen müssen, bevor Sie ein Angebot machen]

Entwerfen Sie eine Antwort, die:
1. Ihre Anfrage bestätigt
2. 2–3 Klärungsfragen stellt (nicht 10 — respektieren Sie ihre Zeit)
3. Einen groben Richtwert gibt, falls ich genug Informationen habe
4. Ein 20-minütiges Gespräch vorschlägt

Tonalität: selbstsicher, fachkundig, warmherzig.
```

**2. Aktives Projekt — Statusbericht für Kunden**
```
/client-status-report

Wöchentliches Status-Update für [Kundenname] — [Projektname].

Woche vom: [Datum]
Abgeschlossen: [auflisten, was getan wurde]
In Bearbeitung: [aktuelle Arbeit]
Blockiert durch: [was von ihnen benötigt wird — spezifisch sein]
Nächste Woche: [was getan wird]
```

---

### Beim Gewinnen eines neuen Projekts

**3. Überzeugendes Angebot**
```
/freelancer-proposal

Schreiben Sie ein Angebot für diese Projektmöglichkeit.

Kunde: [Unternehmensname, Kontaktname]
Was sie brauchen: [Projektbeschreibung]
Budget (falls bekannt): $[X]
Genannter Zeitplan: [X Wochen/Monate]
Wie ich es angehen werde: [Ihre Methodik]
Warum ich die richtige Wahl bin: [relevante Erfahrung, frühere Ergebnisse]

Mein vorgeschlagener Preis: $[X]
```

**4. Leistungsumfang — sich selbst schützen**
```
/scope-of-work

Schreiben Sie einen Leistungsumfang für das Projekt, auf das wir uns geeinigt haben.

Kunde: [Name]
Projekt: [Beschreibung]
Lieferungen: [spezifische Liste]
Ausschlüsse: [was ich nicht tue]
Zeitplan: [Daten]
Zahlung: $[X], [X]% im Voraus, [X]% bei Lieferung
Überarbeitungen: [X Runden enthalten]
Nachtragshonorarsatz: $[X]/Stunde
```

---

### Wenn Sie nicht bezahlt wurden

**5. Rechnungs-Follow-up**
```
/invoice-chaser

Rechnung #[X] über $[X] ist seit [X] Tagen überfällig.

Kunde: [Name]
Rechnungsdatum: [Datum]
Fälligkeitsdatum: [Datum]
Zahlungsbedingungen: [Netto 15 / Netto 30]
Kontakt: [Name, E-Mail]
Frühere Follow-ups: [keine / E-Mail am [Datum] / Anruf am [Datum]]

Entwerfen Sie eine Nachverfolgung, die für [X] Tage Überfälligkeit angemessen eskaliert.
Halten Sie die Tür für die Zahlung offen, während der Ernst der Lage klar ist.
```

---

### Geschäftsentwicklung (wöchentlich)

**6. Outbound-Akquise**
```
/cold-outreach

Recherchieren und entwerfen Sie eine Kontaktaufnahme mit einem potenziellen Kunden.

Ziel: [Unternehmensname oder Unternehmenstyp]
Kontakt: [Name, Titel falls bekannt]
Warum sie mich möglicherweise brauchen: [Ihre Einschätzung]
Meine relevante Erfahrung: [was ich getan habe, das relevant ist]
Was ich anbiete: [was ich für sie tun würde]

Schreiben Sie eine personalisierte Kontakt-E-Mail. Kein Verkaufsgespräch — eher eine professionelle Vorstellung mit einer spezifischen Beobachtung über ihr Unternehmen.
```

---

### Monatliche Finanzüberprüfung

**7. Cashflow-Prognose**
```
/cash-flow-forecast

90-Tage-Cashflow-Prognose für mein Freelance-Unternehmen.

Aktueller Kassenbestand: $[X]
Unterzeichnete Verträge mit bevorstehenden Zahlungen:
- [Kunde A]: $[X] fällig am [Datum]
- [Kunde B]: $[X] fällig am [Datum]

Ausstehende Rechnungen (noch nicht bezahlt):
- Rechnung #[X] — [Kunde] — $[X] — [X] Tage überfällig

Monatliche Ausgaben:
- [Software/Tools]: $[X]/Monat
- [Buchhaltung/Verwaltung]: $[X]/Monat
- [Sonstiges]: $[X]/Monat

Bevorstehende Ausgaben (einmalig):
- [Posten]: $[X] in [Monat]

Pipeline (noch nicht unterzeichnet):
- [Interessent A]: $[X] — Wahrscheinlichkeit [hoch/mittel/niedrig]
- [Interessent B]: $[X] — Wahrscheinlichkeit [mittel]

Zeigen Sie mir: monatlichen Cashflow, wann ich möglicherweise ein Defizit haben könnte, was es verursacht.
```

---

## 30-Tage-Einstiegsplan (neue Freelancer oder neuer Markt)

### Woche 1 — Geschäftsinfrastruktur
- Alle Freelancer-Skills installieren: `npx claudient add skill small-business/[name]`
- Ihre Standard-Angebotsvorlage mit `/freelancer-proposal` schreiben — für Ihre Dienstleistungen personalisieren
- Ihre Master-Leistungsumfang-Vorlage mit `/scope-of-work` schreiben — für jedes zukünftige Projekt verwenden
- Ihre Preise definieren: Stundensatz, Projekthonorare, Retainer-Honorare — dokumentieren

### Woche 2 — Aktives Kunden-Management
- `/client-status-report` für alle aktiven Projekte einsetzen — wöchentlichen Freitags-Rhythmus etablieren
- `/invoice-chaser` für jede überfällige Rechnung einsetzen — nicht über 7 Tage hinausgleiten lassen
- `/cash-flow-forecast` ausführen, um Ihre 90-Tage-Position zu verstehen

### Woche 3 — Geschäftsentwicklung
- 10 potenzielle Kunden in Ihrem bestehenden Netzwerk identifizieren
- `/cold-outreach` nutzen, um personalisierte Nachrichten für jeden zu entwerfen — 5 Minuten für die Personalisierung pro Nachricht
- Antworten tracken — welcher Hook funktioniert am besten für Ihren Markt?

### Woche 4 — Systematisieren
- `/agency-operations` nutzen, um Ihren Onboarding-Prozess zu dokumentieren (was neue Kunden in Woche 1 erhalten)
- Eine Kunden-FAQ mit Claude schreiben — reduziert die Zeit für die Beantwortung gleicher Fragen
- Ihre Honorare überprüfen: Tracken Sie Ihre Zeit genau? Sind Sie zu günstig?

---

## Preisgestaltung und Geschäftsstrategie

Den CEO-Berater-Agenten für schwierige Geschäftsentscheidungen nutzen:

**Honorare erhöhen:**
```
/ceo-advisor

Ich möchte mein Honorar von $[X]/Stunde auf $[X]/Stunde erhöhen. Meine aktuellen Kunden zahlen $[X]. Ich arbeite seit [X] Jahren als Freelancer. Meine Pipeline ist voll.

Helfen Sie mir zu überlegen:
- Wie ich die Honorarerhöhung bestehenden Kunden kommuniziere
- Ob ich bestehende Verträge beibehialte oder sofort anwende
- Wie ich meinen neuen Honorarsatz neuen Kunden positioniere
- Ob ich stattdessen auf Projektpreisgestaltung umstellen sollte
```

**Einen schlechten Kunden entlassen:**
```
/ceo-advisor

Ich habe einen Kunden, der [Problem beschreiben: zahlt spät, ständige Nachtragsaufwüchse, respektlos, unrentabel]. Er macht [X]% meines monatlichen Umsatzes aus.

Helfen Sie mir zu überlegen:
- Ob ich ihn entlassen oder versuchen soll, die Beziehung zu reparieren
- Wenn ich ihn entlassen soll, wie ich das professionell tue
- Wie ich den Umsatz ersetze
```

**Ein Retainer-Angebot bewerten:**
```
/ceo-advisor

Ein Kunde möchte mich für $[X]/Monat für [X] Stunden als Retainer engagieren. Mein aktueller Tagessatz ist $[X].

Ist das ein gutes Angebot? Wie sollten die Retainer-Bedingungen aussehen? Was sind die Risiken?
```

---

## Tool-Integrationen

### Rechnungsstellung (Wave, FreshBooks, Bonsai)
Claude entwirft Ihr professionelles Angebot und den Leistungsumfang → Sie fügen es in Ihr Rechnungsstellungs-Tool ein, um das Projekt zu erstellen und Rechnungen zu generieren. Für Rechnungs-Follow-up `/invoice-chaser` nutzen, um E-Mails zu entwerfen → aus Ihrem Rechnungsstellungs-Tool oder direkt versenden.

### Zeiterfassung (Toggl, Harvest, Clockify)
Zeit in Ihrem Tool erfassen → wöchentliche Summen exportieren → in `/client-status-report` einfügen, um Ihre Lieferungen mit aufgewendeter Zeit zu kontextualisieren (nützlich für stündliche Abrechnungstransparenz).

### Vertragsunterzeichnung (DocuSign, PandaDoc, HelloSign)
Claude erstellt den Leistungsumfang-Text → in Ihr E-Signatur-Tool einfügen → zur Unterzeichnung senden. Für wiederkehrende Kunden Ihre Claude-generierten Vorlagen in PandaDoc oder Bonsai speichern.

### CRM / Pipeline (HubSpot kostenlos, Notion, Airtable)
Ein einfaches Kanban für Ihre Pipeline nutzen: Interessent → Angebot gesendet → Verhandlung → Aktiv → Fakturiert → Bezahlt. Claude hilft in jeder Phase — `/cold-outreach` für Interessenten, `/freelancer-proposal` für Angebot gesendet, `/scope-of-work` für Aktiv.

---

## Kennzahlen zum Verfolgen

| Kennzahl | Ziel | Monatlich tracken |
|---|---|---|
| Angebotsgewinnrate | > 35% | Gesendete Angebote / gewonnene Projekte |
| Durchschnittlicher Projektwert | [Ihr Ziel] | Wachsend oder stagnierend? |
| Zahlungsdauer | < 15 Tage | Langsam zahlende Kunden markieren |
| Auslastungsrate | 70–80% der Arbeitsstunden fakturierbar | Über 80% = Honorare erhöhen oder einstellen |
| Umsatz pro Kunde | Top-3-Kunden tracken | Keinen Kunden > 40% des Umsatzes werden lassen |
| Stunden für Geschäftsentwicklung | 5–10% Ihrer Zeit | Wenn null, haben Sie einen Boom-Bust-Zyklus |
| Nettoumsatzmarge | > 50% (Dienstleistungsunternehmen) | Ihr Anteil nach Tools, Steuern, Verwaltung |

---

## Häufige Fehler (und wie Claude Code sie verhindert)

**Fehler 1: Vager Umfang = Umfangsausweitung**
`/scope-of-work` zwingt Sie, jede Lieferung aufzuzählen und jeden Ausschluss aufzulisten. Kein vager Umfang erlaubt.

**Fehler 2: Kein Nachtragsverfahren**
`/scope-of-work` enthält die Nachtragsklausel. Jede zusätzliche Anfrage löst sie aus — keine kostenlose Arbeit mehr.

**Fehler 3: Überfällige Rechnungen nicht nachverfolgen**
`/invoice-chaser` macht die Nachverfolgung in 60 Sekunden möglich. Kein "Ich mache es, wenn ich einen Moment habe" mehr.

**Fehler 4: Angebote, die Prozesse statt Ergebnisse beschreiben**
`/freelancer-proposal` stellt Kundenergebnisse an erste Stelle. Ihr Prozess ist sekundär zu ihren Ergebnissen.

**Fehler 5: Cashflow-Überraschungen**
`/cash-flow-forecast` jeden Monat. Ihre 90-Tage-Position kennen, bevor sie zur Krise wird.

---

## Ressourcen

- [Erste Schritte mit Claude Code](getting-started.md)
- [Leistungsumfang-Skill](../skills/small-business/scope-of-work.md)
- [Kunden-Statusbericht-Skill](../skills/small-business/client-status-report.md)
- [Rechnungsmahnungs-Skill](../skills/small-business/invoice-chaser.md)
- [Freelancer-Wochen-Workflow](../workflows/freelancer-weekly.md)

---

> **Arbeiten Sie mit uns:** Claudient wird von [Uitbreiden](https://uitbreiden.com/) unterstützt — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
