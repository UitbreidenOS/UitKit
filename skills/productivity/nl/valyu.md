---
name: valyu
description: "Toegang tot betaalde onderzoeksgegevens via Valyu MCP: SEC EDGAR-indieningen, PubMed-papers, klinische onderzoeken, octrooien, financiële rapporten."
---

# Valyu Research API

## Wanneer activeren

- Gebruiker heeft SEC EDGAR-indieningen (10-K, 10-Q, 8-K, DEF 14A) nodig voor een beursgenoteerd bedrijf
- Toegang tot PubMed of biomedische literatuur achter journaalmuren
- Bevragen van ClinicalTrials.gov voor proefgegevens, inschrijvingsstatus of resultaten
- Zoekopdrachten in octrooibases (USPTO, EPO, WIPO)
- Financiële gegevens die officiële indieningen vereisen in plaats van gekraapte webgegevens
- Academische papers waar vrije preprints niet beschikbaar zijn en volledige tekst nodig is
- Elke onderzoekstaken waarbij gezaghebbende primaire bronnen belangrijker zijn dan geaggregeerde webinhoud

## Wanneer niet gebruiken

- Algemene webzoeking (gebruik WebSearch in plaats daarvan — Valyu voegt kosten toe zonder voordeel voor openbare webinhoud)
- Nieuwsartikelen, blogberichten of opiniestukken
- Codedocumentatie of Stack Overflow-style technische antwoorden
- Gegevens die vrij en betrouwbaar beschikbaar zijn via standaardzoeking (Wikipedia, officiële productdocs)
- Realtime prijzen, live marktgegevens of streaming financiële feeds — Valyu heeft indieneringsgegevens, geen tickers

## Instructies

### MCP-setup

Voeg Valyu toe aan uw Claude Code MCP-configuratie:

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

Verkrijg een API-sleutel op valyu.network. Sla de sleutel op in uw shell-omgeving of `.env` — nooit in `settings.json` of gecommitteerde bestanden:

```bash
export VALYU_API_KEY="vk_..."
```

Verwijs er dan naar in MCP-configuratie als `"${VALYU_API_KEY}"` of gebruik het env-blok zoals weergegeven.

### Beschikbare gegevensbronnen

| Bron | Wat het bevat | Best querytype |
|---|---|---|
| SEC EDGAR | 10-K, 10-Q, 8-K, DEF 14A, S-1 en alle andere SEC-formulieren | CIK-nummer of bedrijfsticker + formuliertype |
| PubMed | 35M+ biomedische abstracten en volledige teksten | PMID, DOI of trefwoord + datumbereik |
| ClinicalTrials.gov | Proefmetagegevens, status, resultaten, protocollen | NCT-nummer of aandoening + interventie |
| USPTO-octrooien | US octrooivolledige tekst, citaties, toewijzingen | Octrooinum of trefwoord + classificatiecode |
| EPO / WIPO | Europese en internationale octrooien | Aanvraagnummer of trefwoord |
| Financiële rapporten | Inkomstenmededelingen, beleggerspresentaties | Bedrijfsnaam + fiscale periode |

### Query-patronen per bron

**SEC EDGAR — 10-K indieningen:**
```
Gebruik Valyu om de 10-K-indiening voor [COMPANY] (ticker: [TICKER]) voor fiscaal jaar [YEAR] op te halen.
Extraheer: inkomsten, brutomarge, O&O-uitgaven, bedrijfsinkomen, nettowinst, aandelencount.
Retourneer als tabel met jaar-op-jaar-verandering.
```

**SEC EDGAR — trendanalyse over jaren:**
```
Gebruik Valyu om 10-K-indieningen voor [COMPANY] op te halen voor fiscale jaren [YEAR-2], [YEAR-1] en [YEAR].
Extraheer voor elk jaar: totale inkomsten, O&O-uitgaven als % van inkomsten, vrije cashflow.
Bouw een trendtabel en noteer jaar-op-jaar-wijzigingen.
```

**PubMed — literatuurzoeking:**
```
Gebruik Valyu om PubMed te doorzoeken naar papers over [TOPIC].
Filter: gepubliceerd [DATE RANGE], alleen Engels, menselijke proefpersonen.
Retourneer: titel, auteurs, journal, jaar, abstract, DOI voor top 10 op citaataantal.
```

**ClinicalTrials.gov — proefstudie opzoeking:**
```
Gebruik Valyu om ClinicalTrials.gov te bevragen voor trials die [INTERVENTION] in [CONDITION] bestuderen.
Filter: fase 2 of 3, voltooid of actief zoekend, beschikbare resultaten.
Retourneer: NCT-nummer, titel, sponsor, inschrijving, primair eindpunt, samenvattingsresultaten indien beschikbaar.
```

**Octrooizoeking:**
```
Gebruik Valyu om USPTO-octrooien te doorzoeken naar [TECHNOLOGY AREA].
Filter: verleende octrooien, [DATE RANGE], toegewezen aan [COMPANY] indien specifiek.
Retourneer: octrooinum, titel, abstract, indiendatum, verleeningsdatum, samenvatting van belangrijke vorderingen.
```

### Citatieformattering

Maak Valyu-bronnen citaten aan als:

**SEC-indiening:**
```
[Company Name]. Form 10-K. United States Securities and Exchange Commission. Filed [date]. 
Accession number: [accession]. Retrieved via Valyu.
```

**PubMed-paper:**
```
[Authors]. "[Title]." [Journal] [Vol]([Issue]) ([Year]): [Pages]. PMID: [PMID]. DOI: [DOI].
```

**Klinische proef:**
```
[Trial Title]. ClinicalTrials.gov identifier: [NCT number]. [Sponsor]. [Status as of retrieved date].
```

**Octrooi:**
```
[Assignee]. "[Patent Title]." [Patent Number]. [Grant date]. [Classification].
```

### Valyu combineren met websearch

Voor uitgebreid onderzoek kunt u Valyu (primaire bronnen) combineren met WebSearch (context, analyse, nieuws):

```
Onderzoeksworkflow voor [COMPANY] concurrentieanalyse:

Stap 1 — Valyu: Haal de laatste 3 jaar van 10-K-indieningen op. Extraheer inkomsten, marges, O&O-uitgaven.
Stap 2 — Valyu: Haal alle 8-K-indieningen uit de afgelopen 12 maanden op voor substantiële omstandigheden.
Stap 3 — WebSearch: Vind analystendekking, recent nieuws en openbare opmerkingen.
Stap 4 — Synthesize: Primaire financiële gegevens van Valyu + kwalitatieve context van web.
Duidelijk noteren welke claims afkomstig zijn van officiële indieningen versus secundaire bronnen.
```

### Kostenbewustzijn

Valyu berekent per query. Richtlijnen voor kostenverlaging:
- Gebruik specifieke identifiers (CIK, PMID, NCT-nummer, octrooinum) als u deze hebt — trefwoordzoeking verbruikt meer quota
- Alleen aangevraagde jaren of datumbereiken — niet alle indieningen ophalen als u slechts de laatste 3 nodig hebt
- Cacheresultaten voor sessie: als u een 10-K hebt opgehaald, deze in context houden in plaats van opnieuw op te halen

## Voorbeeld

**Taak:** Haal de afgelopen 3 jaar 10-K indieningen op voor een beursgenoteerd bedrijf en extraheer inkomstengrowth en O&O-uitgaventrends.

**Prompt:**
```
Gebruik Valyu om de jaarlijkse 10-K indieningen voor Cloudflare (ticker: NET) voor fiscale jaren
2022, 2023 en 2024 op te halen.

Extraheer uit elke indiening:
- Totale inkomsten
- Inkomstengrowth jaar-op-jaar %
- O&O-uitgaven
- O&O als % van inkomsten
- Bedrijfsverlies / -inkomsten
- Vrije cashflow (operationele cashflow minus capex)

Presenteer als tabel met alle drie jaren naast elkaar.
Schrijf vervolgens 3 zinnen waarin u de trend interpreteert.
Citeer elke indiening met het SEC-toewijzingsnummer.
```

**Verwachte uitvoerstructuur:**
| Metriek | FY2022 | FY2023 | FY2024 |
|---|---|---|---|
| Revenue | $975M | $1.30B | $1.63B |
| YoY growth | 49% | 33% | 26% |
| R&D expense | $423M | $522M | $609M |
| R&D % revenue | 43% | 40% | 37% |

Met citatie: "Cloudflare Inc. Form 10-K. SEC. Filed 2025-02-21. Accession: 0001477932-25-003456."

---
