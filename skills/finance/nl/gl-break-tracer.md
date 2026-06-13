# Hauptboekverschil-Tracer

## Wanneer activeren

Onderzoek naar een afstemming van het Grootboek, onverklaarde afwijking in een proefbalans, subledger-naar-Grootboek-mismatch, of een maandsluitingsdiscrepantie. Gebruik wanneer een numeriek verschil bestaat tussen twee representaties van dezelfde financiële positie en de oorzaak onbekend is.

## Wanneer NIET gebruiken

Jaalopgaven of aanpassingen inboeken. Deze vaardigheid diagnosticeert alleen — een resolver (menselijk of apart werkstroom) boekt aanpassingen na beoordeling in. Gebruik deze vaardigheid niet om inboekingen voor te stellen zonder goedkeuring van een gekwalificeerde accountant.

## Instructies

Drieëtappeonderzoek :

**Fase 1 — Grootboekniveau**

Lees het rekeningsaldo van het Grootboek. Identificeer de rapportageperiode, rekeningscode en entiteit. Extraheer de nettoverplaatsing en eindsaldo. Registreer de bron (ERP-systeem, rapportnaam, lopdatum).

**Fase 2 — Subledger-laag**

Trek het overeenkomstige subledger of ondersteunend schema. Som subledger-saldi op voor dezelfde periode en rekeningsschaal. Vergelijk met Grootboekindsaldo :

```
nettoverschil = Grootboeksaldo − subledger totaal
```

Indien nettoverschil = 0, geen verschil bestaat. Indien niet-nul, ga naar Fase 3.

**Fase 3 — Attribuutvergeking**

Voor elk regelitem dat bijdraagt aan het verschil, identificeer het attribuut dat verschilt :

- Datum (afsluitingsmonsters)
- Bedrag (afrounding, valutaconversie, dubbel item)
- Tegenpartij (verkeerd gecodeerde leverancier/klant)
- Valuta (wisselkoers anders toegepast)
- Kostenplaats of bedrijfsonderdeel (intercompany-allocatiefout)
- Transactietype (verkeerd geclassificeerde boeking)

Formaat oorzaakverklaring : `"[GB-zijde] [actie] omdat [subledger-reden]"`

Voorbeeld : `"Grootboekdebet geboekt op 31-05-2026 omdat subledger-item gedateerd 01-06-2026 — afsluitingsmismatch"`

**Uitvoerformaat (JSON) :**

```json
{
  "break_amount": 12450.00,
  "currency": "USD",
  "root_cause": "Grootboekdebet geboekt op 31-05-2026 ; subledger-item gedateerd 01-06-2026 (afsluitingsmismatch)",
  "owner": "AP-team",
  "action": "adjust",
  "action_detail": "Grootboekitem naar juni-periode herindelen ; omkeringsjournaalboeking gedateerd 01-06-2026 inboeken",
  "verification": "Afstemming na boeking opnieuw uitvoeren — verschil zou tot nul moeten opheffen"
}
```

**Actietype :**

| Type | Betekenis |
|------|---------|
| `monitor` | Toezicht maar nog geen actie ondernemen — verschil is timing-gerelateerd en zou zichzelf moeten opheffen |
| `adjust` | Correctiejournaalboeking inboeken om verschil op te heffen |
| `raise-ticket` | Eskaleren naar upstream-systeemeigenaar — oorzaak is systeem- of feed-fout buiten boekhoudbereik |
| `suppress` | Bekend permanent verschil — documenteren en goedkeuring krijgen ; uitsluiten van toekomstige afstemming |

**Veiligheidshek :** Deze vaardigheid produceert diagnose en aanbevolen actie. Alle voorgestelde journaalbewerkingen moeten door gekwalificeerde boekhoudkundige worden beoordeeld en goedgekeurd voor boeking. Nooit rechtstreeks uit deze vaardigheidsuitvoer inboeken.

## Voorbeeld

**Invoer :** « Het AP-subledger toont $45.230 in uitstaande facturen maar het AP-Grootboekrekening toont $57.680 voor dezelfde periode. Traceer het $12.450-verschil en identificeer de oorzaak. »

**Verwachte uitvoer :**

```json
{
  "break_amount": 12450.00,
  "currency": "USD",
  "root_cause": "Twee Grootboekitems totaal $12.450 hebben geen overeenkomstige subledger-records — waarschijnlijk handmatige journaalbewerkingen rechtstreeks op Grootboekrekening geboekt die AP-module omzeilen",
  "owner": "AP-team",
  "action": "raise-ticket",
  "action_detail": "Handmatige JE's identificeren door Grootboektransacties zonder subledger-verwijzing voor periode op te vragen. Bepaal of deze geldig (herindeling) of foutief (dubbel) zijn. Eskaleren naar GL-controller voor beoordeling.",
  "verification": "Na oplossing AP-afstemming opnieuw uitvoeren — verschil zou tot nul moeten opheffen of met gedocumenteerde rationale worden onderdrukt"
}
```

---
