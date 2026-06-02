# Claude für Account Executives

Alles, was ein Account Executive für KI-gestütztes Deal-Management benötigt — Deal-Reviews, gegenseitige Erfolgspläne, Champion-Entwicklung, RFP-Antworten, Wettbewerbspositionierung und Forecast-Management.

---

## Für wen dieser Leitfaden ist

Du bist ein Account Executive (AE), der eine Pipeline aus Mid-Market- oder Enterprise-Deals verwaltet. Dein Alltag besteht aus Deal-Reviews, Kundengesprächen, Champion-Management, Angebotserstellung, Verhandlungen und Forecast-Calls mit deiner Führungskraft. Du verlierst zu viel Zeit mit administrativen Aufgaben — Folien für Deal-Reviews erstellen, RFP-Antworten umformatieren, MEDDPICC manuell bewerten und Follow-up-E-Mails nach Calls schreiben. Claude Code übernimmt den Prozess, damit du dich auf das konzentrieren kannst, was Deals tatsächlich abschließt: Gespräche mit Käufern.

**Vor Claude Code:** 45 Minuten für die Vorbereitung einer Deal-Review-Folie. 2 Stunden für einen RFP-Antwort-Abschnitt. 30 Minuten für einen gegenseitigen Erfolgsplan von Grund auf. Manuelle MEDDPICC-Bewertung, die immer veraltet ist.

**Danach:** Deal-Review in 15 Minuten mit MEDDPICC-Bewertung und Risiko-Flags. RFP-Antwort-Abschnitt in 10 Minuten. Entwurf eines gegenseitigen Erfolgsplans in 20 Minuten. Champion-Enablement-Paket in 15 Minuten.

---

## 30-Sekunden-Installation

```bash
# Alle AE-Skills installieren
npx claudient add skills gtm

# Oder einzeln auswählen:
npx claudient add skill gtm/deal-review
npx claudient add skill gtm/champion-builder
npx claudient add skill gtm/mutual-success-plan
npx claudient add skill gtm/deal-desk
npx claudient add skill gtm/rfp-responder
npx claudient add skill gtm/commercial-forecaster
npx claudient add skill gtm/crm-hygiene
npx claudient add skill gtm/hubspot
npx claudient add skill gtm/revenue-operations
npx claudient add agents advisors/cro-advisor
npx claudient add agents roles/competitive-analyst
```

---

## Dein Claude Code AE-Stack

### Skills (Slash-Befehle)

| Skill | Was er tut | Wann verwenden |
|---|---|---|
| `/deal-review` | MEDDPICC-Bewertung, Risiko-Flags, Forecast-Kategorie, nächste Schritte | Wöchentliches Pipeline-Review, vor Manager-Call |
| `/champion-builder` | Champion-Identifikation, Enablement-Paket, Re-Engagement-Skripte | Wenn Champion schwach ist oder still geworden ist |
| `/mutual-success-plan` | Gemeinsamer Abschlussplan: Meilensteine, Stakeholder, gegenseitige Zusagen | Late-Stage-Deals (Evaluation → Negotiation) |
| `/deal-desk` | Deal-Strukturierung, Rabattgenehmigung, Prüfung von Vertragsbedingungen | Komplexe Konditionen, nicht standardmäßige Preisgestaltung |
| `/rfp-responder` | RFP/RFI-Antwortabschnitte, Compliance-Matrizen, Executive Summaries | Bei jedem eingegangenen RFP/RFI |
| `/commercial-forecaster` | Pipeline- und Forecast-Analyse, Deal-Bewertung, Umsatzprognosen | Wöchentliche Forecast-Calls |
| `/crm-hygiene` | Kontakt-/Deal-Bereinigung, Prüfung veralteter Pipeline, Deduplizierung | Monatliche CRM-Pflege |
| `/hubspot` | Direktes Lesen/Schreiben in HubSpot CRM | Notizen protokollieren, Deal-Phasen aktualisieren |
| `/revenue-operations` | Pipeline-Metriken, Stage-Conversion-Raten, ARR-Analyse | QBRs, Gebietsplanung |

### Agenten

| Agent | Modell | Wann einsetzen |
|---|---|---|
| `cro-advisor` | Opus | Komplexe Multi-Stakeholder-Deals, Verhandlungsstrategie, Einwandbehandlung auf Executive-Ebene |
| `competitive-analyst` | Sonnet | Echtzeit-Wettbewerbsinformationen, Positionierung gegen namentlich genannte Wettbewerber |

---

## Täglicher Workflow

### Morgen — Pipeline-Review (15–30 Minuten)

**1. Priorisierung der wichtigsten Deals:**
```
/commercial-forecaster

Morgen-Pipeline-Review. Zeig mir:
- Welche Deals stehen diese Woche auf Commit?
- Welche Commit-Deals haben das höchste Risiko (MEDDPICC-Lücken, verschobenes Abschlussdatum)?
- Welche Best-Case-Deals haben sich in den letzten 7 Tagen vor- oder zurückbewegt?
- Welche Deals habe ich seit 14+ Tagen nicht mehr kontaktiert?

CRM-Daten: [deine offene Pipeline aus HubSpot/Salesforce einfügen oder per MCP verbinden]
```

**2. Deal-Review für den Manager-Call dieser Woche:**
```
/deal-review

MEDDPICC-Review für [Deal-Name].

Unternehmen: [Name]
Deal-Größe: $[ACV]
Phase: [Phase]
Abschlussdatum: [Datum]

[Discovery-Notizen, E-Mail-Threads oder Meeting-Notizen einfügen]

Bewerte jede MEDDPICC-Dimension, zeige die Top-3-Risiken auf und empfehle eine Forecast-Kategorie.
```

---

### Aktive Deal-Arbeit (der Hauptteil deines Tages)

**3. Champion-Entwicklung:**
```
/champion-builder

Beurteilung von [Kontaktname] als Champion für [Deal].

Bisherige Interaktionen: [Zusammenfassung von Meetings und E-Mails]
Champion-Tests: [Welche Belege hast du für jeden der 4 Tests?]

Sag mir:
- Ist diese Person ein starker Champion, ein passiver Kontakt oder ein Coach?
- Welche Belege stützen die Beurteilung?
- Welche konkrete Maßnahme sollte ich heute ergreifen, um den Champion zu stärken oder einen besseren zu finden?
```

**4. Gegenseitiger Erfolgsplan (Late-Stage-Deals):**
```
/mutual-success-plan

Erstelle einen gegenseitigen Erfolgsplan für [Deal].

Käufer: [Unternehmen], Champion: [Name/Titel], Economic Buyer: [Name/Titel]
Deal-Größe: $[ACV], Ziel-Abschlussdatum: [Datum]
Aktuelle Phase: Übergang Evaluation → Negotiation
Verbleibende Schritte bis zur Unterzeichnung: [was du weißt, was noch aussteht]

Erstelle ein vollständiges MSP-Dokument, das ich heute mit dem Champion teilen kann.
Enthält: Erfolgsdefinition, Meilenstein-Tabelle, gegenseitige Verpflichtungen, Risikoregister.
```

**5. RFP-Antwort:**
```
/rfp-responder

Antworte auf diesen RFP-Abschnitt.

RFP-Frage: [Frage einfügen]
Unser Produkt: [einabsätzige Beschreibung]
Unsere Differenzierungsmerkmale für diesen Käufer: [spezifisch für dieses Konto und deren Kriterien]
Wortlimit: [falls angegeben]

Schreibe eine Antwort, die direkt antwortet, Passgenauigkeit demonstriert und keine Füllphrasen verwendet.
```

---

### Nach dem Call — Protokollierung und Follow-up (10–15 Minuten)

**6. Call-Debriefing und CRM-Aktualisierung:**
```
Ich war gerade in einem Call mit [Name, Titel] bei [Unternehmen].

Wichtigste Erkenntnisse:
[Stichpunkte zu besprochenen Themen — nimm dir direkt nach dem Call 2 Minuten für grobe Notizen]

Erstelle:
1. Eine CRM-Notiz (3–4 Absätze — was besprochen wurde, was wir erfahren haben, vereinbarte nächste Schritte)
2. Eine Follow-up-E-Mail, die heute versandt wird
3. MEDDPICC-Update: Welche Dimensionen haben sich aufgrund des Gehörten geändert?
4. Das Wichtigste, das ich vor dem nächsten Call mit diesem Konto tun muss

/hubspot — Protokolliere die CRM-Notiz zu [Kontaktname] bei [Unternehmen].
```

---

### Ende der Woche — Forecast und Pipeline-Pflege

**7. Forecast-Vorbereitung:**
```
/commercial-forecaster

Bereite meinen wöchentlichen Forecast vor.

Meine Deals:
[Pipeline-Liste mit Phase, ACV, Abschlussdatum und aktueller Forecast-Kategorie einfügen]

Für jeden Commit-Deal: Zuversichtswert 1–10 mit Begründung.
Für jeden Best-Case-Deal: Was müsste passieren, um ihn diese Woche auf Commit zu verschieben?
Für jeden Deal, den ich aus dem Forecast entfernen sollte: kennzeichnen.

Meine Wochenquote: $[X] in neuem ARR.
```

**8. Pipeline-Pflege:**
```
/crm-hygiene

Prüfe meine Pipeline auf veraltete und ungenaue Daten.

Meine offene Pipeline: [Deal-Liste mit letztem Aktivitätsdatum, Phase, Abschlussdatum einfügen]

Markiere:
- Deals mit vergangenem Abschlussdatum, die nicht als Closed Won oder Lost verbucht sind
- Deals ohne Aktivität seit 30+ Tagen (nach Phasen-Normen: Discovery >30 Tage, Evaluation >45 Tage)
- Deals, bei denen die Phase nicht mit dem MEDDPICC-Score übereinstimmt
- Doppelte Kontakt- oder Unternehmenseinträge

Für jeden veralteten Deal: Empfehlung — aktualisieren / deaktivieren / untersuchen.
```

---

## 30-Tage-Einarbeitungsplan (neue AEs oder Wechsel in ein neues Segment)

### Woche 1 — Einrichtung und Deal-Bestandsaufnahme
- Alle GTM-Skills installieren: `npx claudient add skills gtm`
- HubSpot per MCP verbinden (siehe Tool-Integrationen unten)
- `/deal-review` für jeden Deal in deiner übernommenen Pipeline ausführen — MEDDPICC-Basisbewertung erstellen
- `/commercial-forecaster` für deine gesamte Pipeline ausführen — echte von veralteten Deals unterscheiden

### Woche 2 — Discovery und Champion-Entwicklung
- `/champion-builder` für deine Top-3-Deals ausführen — wer ist dein tatsächlicher Champion?
- `cro-advisor`-Agent für deinen wertvollsten Deal einsetzen — Strategie für jede MEDDPICC-Lücke entwickeln
- RFP-Antworten für dein Produkt mit `/rfp-responder` üben
- Deal-Review-Vorlage einrichten, damit die Vorbereitung vor Manager-Calls unter 15 Minuten dauert

### Woche 3 — Late-Stage und Abschluss-Mechanismen
- `/mutual-success-plan` für jeden Deal in der Evaluierungsphase oder später verwenden — Abschlussplan erstellen
- `/deal-desk` für jeden Deal mit nicht standardmäßigen Konditionen ausführen — Rabatt-Befugnisse verstehen
- `/competitive-analyst` für deine Top-2-3 Wettbewerber üben — wissen, wie man den Vergleich gewinnt
- Forecast-Genauigkeit aus Wochen 1–2 vs. tatsächliche Ergebnisse prüfen

### Woche 4 — Optimierung und Reporting
- QBR-Vorbereitung: `/revenue-operations` für Pipeline-Metriken und Conversion-Raten nutzen
- Schwächste MEDDPICC-Dimension über alle Deals identifizieren — welche torpediert deine Deals am häufigsten?
- `/crm-hygiene` für die übernommene Pipeline verwenden — tote Deals entfernen, Phasen aktualisieren
- Champion-Beurteilung für jeden aktiven Deal durchführen — Schwachstellen kartieren

---

## Tool-Integrationen

### HubSpot (empfohlenes CRM)

```json
// Zu ~/.claude/settings.json hinzufügen
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}
```

Mit HubSpot MCP verbunden:
- Call-Notizen direkt protokollieren: `Claude, protokolliere diese Call-Notiz zu [Kontakt] bei [Unternehmen] in HubSpot`
- Deal-Phase aktualisieren: `Verschiebe [Deal-Name] in HubSpot auf Negotiation`
- Offene Pipeline abrufen: `Hole alle meine offenen Deals in HubSpot, inklusive Phase, ACV und Abschlussdatum`
- Follow-up-Aufgabe erstellen: `Erstelle eine HubSpot-Aufgabe für mein Follow-up mit [Kontakt] am [Datum]`

### Gong / Chorus (Call-Aufzeichnung)

Call-Transkripte in Claude Code einfügen für:
- MEDDPICC-Update nach dem Call
- Follow-up-E-Mail verfassen
- Champion-Beurteilung auf Basis des Gehörten aktualisieren
- CRM-Notiz generieren

```
Hier ist das Transkript meines Calls mit [Kontakt] bei [Unternehmen]:
[Gong-Transkript einfügen]

Extrahiere:
1. Welche MEDDPICC-Dimensionen bestätigt oder aktualisiert wurden
2. Etwaige Warnsignale, die ich meinem Manager melden sollte
3. Die Follow-up-E-Mail, die heute versandt werden soll
4. Die CRM-Notiz, die protokolliert werden soll
```

### Salesforce

Salesforce-Opportunity-Daten in jeden `/deal-review`- oder `/commercial-forecaster`-Prompt einfügen. Für direkte Salesforce-Integration den Salesforce-MCP-Server konfigurieren, falls in deinem Stack verfügbar.

### DocuSign / PandaDoc (Vertragsmanagement)

`/deal-desk` verwenden, um kommerzielle Konditionen vor der Weiterleitung an die Rechtsabteilung zu prüfen. Die wichtigsten Klauseln in `/deal-desk` einfügen für eine Risikobewertung vor der endgültigen Unterzeichnung.

### Slack (Deal-Room-Kanäle)

Für große Deals einen `#deal-[unternehmen]`-Slack-Kanal pflegen. Updates aus diesem Kanal in `/deal-review` einfügen für einen schnellen Deal-Health-Check vor einem Manager-Call.

---

## Zu verfolgende Metriken

Diese Metriken wöchentlich aus HubSpot oder Salesforce mit `/revenue-operations` abrufen:

| Metrik | Ziel (einarbeitender AE) | Ziel (volle Quote) |
|---|---|---|
| Deals mit vollständigem MEDDPICC | >80 % der aktiven Pipeline | 100 % |
| MSP für Late-Stage-Deals vorhanden | >90 % der Evaluation+ | 100 % |
| Forecast-Genauigkeit (Commit → Won) | >60 % | >80 % |
| Durchschnittliche Deal-Zykluszeit | Vergleich mit Team-Durchschnitt | Im oder unter Team-Durchschnitt |
| Abschlussrate (Evaluation → Won) | Vergleich mit Kohorte | Im oder über Kohortenwert |
| Aktivität pro Deal pro Woche | 2+ bedeutungsvolle Kontakte | 2+ bedeutungsvolle Kontakte |
| Pipeline-Coverage (vs. Quote) | 3x | 4x |
| CRM-Aktualisierungsrate (protokollierte Notizen) | 90 % innerhalb von 24h | 100 % |

---

## Häufige Fehler (und wie Claude Code hilft, sie zu vermeiden)

**Fehler 1: Deals ohne bestätigten Economic Buyer vorantreiben**
`/deal-review` markiert einen fehlenden Economic Buyer als kritische MEDDPICC-Lücke. Ein Deal kann nicht als Commit eingestuft werden, ohne diesen zu haben.

**Fehler 2: Einen passiven Kontakt als Champion behandeln**
`/champion-builder` führt die vier Champion-Tests durch. Ein Kontakt, der dir keinen Zugang zum Economic Buyer verschafft hat, ist ein Coach, kein Champion. Der Skill sagt dir das explizit.

**Fehler 3: Einen gegenseitigen Erfolgsplan erstellen, den der Käufer nie sieht**
Ein MSP funktioniert nur, wenn beide Parteien zustimmen. Der Skill enthält eine E-Mail-Vorlage, um ihn zur Überprüfung an deinen Champion zu senden, bevor der Economic Buyer ihn sieht.

**Fehler 4: Veraltete Deals in Commit belassen**
`/commercial-forecaster` markiert Deals mit letzter Aktivität vor >14 Tagen. Commit-Deals ohne Aktivität sind Forecast-Inflation, keine echte Pipeline.

**Fehler 5: RFP-Antworten, die die eigentliche Frage nicht beantworten**
`/rfp-responder` beantwortet zuerst die spezifische RFP-Frage und stützt sie dann mit Belegen — die Antwort wird nicht in einem Marketing-Absatz vergraben.

---

## Ressourcen

- [Erste Schritte mit Claude Code](../getting-started.md)
- [AE Deal-Cycle-Workflow](../workflows/ae-deal-cycle.md)
- [Deal-Desk-Skill](../skills/gtm/deal-desk.md)
- [RFP-Responder-Skill](../skills/gtm/rfp-responder.md)
- [CRO-Advisor-Agent](../agents/advisors/cro-advisor.md)
- [Competitive-Analyst-Agent](../agents/roles/competitive-analyst.md)

---

> **Arbeite mit uns:** Claudient wird unterstützt von [Uitbreiden](https://uitbreiden.com/) — wir entwickeln KI-Produkte und B2B-Lösungen mit Entwickler-Communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
