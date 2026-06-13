---
name: valyu
description: "Greifen Sie auf bezahlte Forschungsdaten über Valyu MCP zu: SEC EDGAR-Einreichungen, PubMed-Papiere, klinische Studien, Patente, Finanzberichte."
---

# Valyu Research API

## Wann aktivieren

- Benutzer benötigt SEC EDGAR-Einreichungen (10-K, 10-Q, 8-K, DEF 14A) für ein börsennotiertes Unternehmen
- Zugriff auf PubMed oder biomedizinische Fachliteratur hinter Journalpaywalls
- Abfrage von ClinicalTrials.gov für Studiendaten, Rekrutierungsstatus oder Ergebnisse
- Patentdatenbanksuchen (USPTO, EPO, WIPO)
- Finanzdaten, die offizielle Einreichungen erfordern, anstatt Daten aus dem Web zu kratzen
- Akademische Arbeiten, wo kostenlose Vordrucke nicht verfügbar sind und der Volltext benötigt wird
- Jede Forschungsaufgabe, bei der autoritäre primäre Quellen wichtiger sind als aggregierte Web-Inhalte

## Wann nicht verwenden

- Allgemeine Web-Suche (stattdessen WebSearch verwenden — Valyu fügt Kosten hinzu, ohne dass ein öffentlicher Web-Inhalt nutzt)
- Nachrichtenartikel, Blogbeiträge oder Meinungsinhalte
- Code-Dokumentation oder Stack Overflow-ähnliche technische Antworten
- Daten, die frei und zuverlässig über Standardsuche verfügbar sind (Wikipedia, offizielle Produktdokumentation)
- Echtzeit-Preise, Live-Marktdaten oder Streaming-Finanzfeeds — Valyu hat Einreichungsdaten, keine Tickers

## Anweisungen

### MCP-Setup

Valyu zu Ihrer Claude Code MCP-Konfiguration hinzufügen:

```json
{
  "mcpServers": {
    "valyu": {
      "command": "npx",
      "args": ["-y", "@valyu/mcp-server"],
      "env": {
        "VALYU_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Einen API-Schlüssel bei valyu.network abrufen. Den Schlüssel in Ihrer Shell-Umgebung oder `.env` speichern — niemals in `settings.json` oder übernommenen Dateien:

```bash
export VALYU_API_KEY="vk_..."
```

Dann in der MCP-Konfiguration als `"${VALYU_API_KEY}"` referenzieren oder den Env-Block wie gezeigt verwenden.

### Verfügbare Datenquellen

| Quelle | Inhalt | Bester Query-Typ |
|---|---|---|
| SEC EDGAR | 10-K, 10-Q, 8-K, DEF 14A, S-1 und alle anderen SEC-Formulare | CIK-Nummer oder Unternehmensticker + Formularttyp |
| PubMed | 35M+ biomedizinische Abstracts und Volltexte | PMID, DOI oder Stichwort + Datumsbereich |
| ClinicalTrials.gov | Studiemetadaten, Status, Ergebnisse, Protokolle | NCT-Nummer oder Bedingung + Intervention |
| USPTO-Patente | US-Patent-Volltext, Zitate, Abtretungen | Patentnummer oder Stichwort + Klassifizierungscode |
| EPO / WIPO | Europäische und internationale Patente | Antragsummer oder Stichwort |
| Finanzberichte | Gewinnmitteilungen, Investorenpräsentationen | Unternehmensname + Geschäftsperiode |

### Query-Muster pro Quelle

**SEC EDGAR — 10-K-Einreichungen:**
```
Verwenden Sie Valyu, um die 10-K-Einreichung für [COMPANY] (Ticker: [TICKER]) für das Geschäftsjahr [YEAR] abzurufen.
Extrakt: Umsatz, Rohertrag, F&E-Ausgaben, Betriebseinkommen, Nettogewinn, Anteilzahl.
Als Tabelle mit Jahr-über-Jahr-Änderung zurückgeben.
```

**SEC EDGAR — Trendanalyse über Jahre:**
```
Verwenden Sie Valyu, um die 10-K-Einreichungen für [COMPANY] für die Geschäftsjahre [YEAR-2], [YEAR-1] und [YEAR] abzurufen.
Für jedes Jahr Folgendes extrahieren: Gesamtumsatz, F&E-Ausgaben in % des Umsatzes, freier Cashflow.
Eine Trend-Tabelle erstellen und Jahr-über-Jahr-Änderungen notieren.
```

**PubMed — Literatursuche:**
```
Verwenden Sie Valyu, um PubMed nach Papieren zu [TOPIC] zu durchsuchen.
Filtern: veröffentlicht [DATE RANGE], nur englisch, menschliche Probanden.
Zurückgeben: Titel, Autoren, Zeitschrift, Jahr, Abstract, DOI für die Top 10 nach Zitierungen.
```

**ClinicalTrials.gov — Studiensuche:**
```
Verwenden Sie Valyu, um ClinicalTrials.gov für Studien abzufragen, die [INTERVENTION] in [CONDITION] untersuchen.
Filtern: Phase 2 oder 3, abgeschlossen oder aktive Rekrutierung, verfügbare Ergebnisse.
Zurückgeben: NCT-Nummer, Titel, Sponsor, Anmeldung, primärer Endpunkt, Ergebniszusammenfassung falls verfügbar.
```

**Patentsuche:**
```
Verwenden Sie Valyu, um USPTO-Patente für [TECHNOLOGY AREA] zu durchsuchen.
Filtern: erteilte Patente, [DATE RANGE], zugeordnet zu [COMPANY], falls spezifisch.
Zurückgeben: Patentnummer, Titel, Abstract, Einreichungsdatum, Erteilungsdatum, Zusammenfassung der Schlüsselansprüche.
```

### Zitierformatierung

Formatieren Sie Valyu-Quellen-Zitate als:

**SEC-Einreichung:**
```
[Company Name]. Form 10-K. United States Securities and Exchange Commission. Filed [date]. 
Accession number: [accession]. Retrieved via Valyu.
```

**PubMed-Papier:**
```
[Authors]. "[Title]." [Journal] [Vol]([Issue]) ([Year]): [Pages]. PMID: [PMID]. DOI: [DOI].
```

**Klinische Studie:**
```
[Trial Title]. ClinicalTrials.gov identifier: [NCT number]. [Sponsor]. [Status as of retrieved date].
```

**Patent:**
```
[Assignee]. "[Patent Title]." [Patent Number]. [Grant date]. [Classification].
```

### Valyu mit Web-Suche kombinieren

Für umfassende Recherche Valyu (primäre Quellen) mit WebSearch (Kontext, Analyse, Nachrichten) kombinieren:

```
Forschungs-Workflow für [COMPANY] Wettbewerbsanalyse:

Schritt 1 — Valyu: Letzte 3 Jahre von 10-K-Einreichungen abrufen. Umsatz, Margen, F&E-Ausgaben extrahieren.
Schritt 2 — Valyu: Alle 8-K-Einreichungen aus den letzten 12 Monaten für materielle Ereignisse abrufen.
Schritt 3 — WebSearch: Analystenbewertung, aktuelle Nachrichten und öffentliche Kommentare finden.
Schritt 4 — Synthesize: Primäre Finanzdaten von Valyu + qualitativer Kontext aus dem Web.
Eindeutig notieren, welche Behauptungen aus offiziellen Einreichungen vs. sekundären Quellen stammen.
```

### Kostenbestandteil

Valyu berechnet pro Abfrage. Richtlinien zur Kostensenkung:
- Spezifische Identifikatoren verwenden (CIK, PMID, NCT-Nummer, Patentnummer), wenn Sie diese haben — Stichwortsuchen verbrauchen mehr Quote
- Nur benötigte Jahre oder Datumsbereiche anfordern — nicht alle Einreichungen abrufen, wenn Sie nur die letzten 3 benötigen
- Ergebnisse für die Sitzung zwischenspeichern: Wenn Sie eine 10-K abgerufen haben, diese im Kontext behalten, anstatt neu abzurufen

## Beispiel

**Aufgabe:** Letzte 3 Jahre von 10-K-Einreichungen für ein börsennotiertes Unternehmen abrufen und Umsatzwachstum und F&E-Ausgabtentrends extrahieren.

**Prompt:**
```
Verwenden Sie Valyu, um die jährlichen 10-K-Einreichungen für Cloudflare (Ticker: NET) für die Geschäftsjahre
2022, 2023 und 2024 abzurufen.

Aus jeder Einreichung extrahieren:
- Gesamtumsatz
- Umsatzwachstum Jahr-über-Jahr %
- F&E-Ausgaben
- F&E als % des Umsatzes
- Betriebsverlust / -einkommen
- Freier Cashflow (Cashflow aus Betrieb minus Capex)

Als Tabelle mit allen drei Jahren nebeneinander präsentieren.
Dann 3 Sätze schreiben, die den Trend interpretieren.
Jede Einreichung mit der SEC-Zugangsummer zitieren.
```

**Erwartete Ausgabestruktur:**
| Metrik | FY2022 | FY2023 | FY2024 |
|---|---|---|---|
| Revenue | $975M | $1.30B | $1.63B |
| YoY growth | 49% | 33% | 26% |
| R&D expense | $423M | $522M | $609M |
| R&D % revenue | 43% | 40% | 37% |

Mit Zitat: "Cloudflare Inc. Form 10-K. SEC. Filed 2025-02-21. Accession: 0001477932-25-003456."

---
