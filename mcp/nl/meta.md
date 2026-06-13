# MCP: Meta Ads

Beheer Facebook- en Instagram-advertentiecampagnes vanuit Claude Code — maak campagnes aan, optimaliseer doelgroepen, analyseer A/B-tests en handelen naar prestatiegegevens zonder Ads Manager te openen.

## Waarom je dit nodig hebt

Ads Manager is gebouwd voor menselijke navigatie, niet voor programmatische analyse. Prestatiegegevens eruit krijgen, onderpresterende adsets vinden en bulkwijzigingen aanbrengen vergen allemaal repetitief UI-werk. De Meta MCP zet je volledige campagnetree — campagnes, adsets, ads, doelgroepen en inzichten — in Claude's context zodat je in gewoon Engels kunt analyseren en handelen.

## Installatie

```bash
npx -y @meta/mcp-server-ads
```

Runs on demand via `npx` — no global install required.

## Configuratie

```json
{
  "mcpServers": {
    "meta-ads": {
      "command": "npx",
      "args": ["-y", "@meta/mcp-server-ads"],
      "env": {
        "META_ACCESS_TOKEN": "your-system-user-token",
        "META_AD_ACCOUNT_ID": "act_XXXXXXXXX"
      }
    }
  }
}
```

`META_AD_ACCOUNT_ID` begint altijd met `act_`. Vind het in Meta Business Manager onder **Business Settings → Ad Accounts**.

## Sleuteltools

| Tool | Wat het doet |
|---|---|
| `list_campaigns` | Lijst alle campagnes met status, doel en uitgaven |
| `get_campaign` | Volledige campagnedetails inclusief budget, schema en prestatie |
| `create_campaign` | Maak een nieuwe campagne aan met doel en budget |
| `update_campaign` | Werk budget, status, schema of bidstrategie bij |
| `list_ad_sets` | Lijst adsets met targeting, plaatsing en leveringsstatus |
| `create_ad_set` | Maak een adset aan met doelgroep- en plaatsingsconfiguratie |
| `list_ads` | Lijst afzonderlijke ads met creatief previews en metriek |
| `create_ad` | Maak een ad aan met creatief en copy |
| `get_insights` | Trek prestatiegegevens op met opsplitsingen en datumbereiken |
| `list_audiences` | Lijst opgeslagen, aangepaste en kijkende doelgroepen |
| `create_custom_audience` | Bouw een aangepaste doelgroep uit een klantenlijst of pixelgebeurtenissen |
| `create_lookalike_audience` | Genereer een kijkende van een seed-doelgroep |
| `get_ab_test_results` | Haal statistische A/B-testresultaten en winnende variant op |

## Gebruiksvoorbeelden

```
Toon alle actieve campagnes met uitgaven versus budget voor deze maand

Welk advertentiecreatief had deze week de beste CTR?

Maak een kijkende doelgroep aan uit onze top 5% kopers

Pauzeer alle adsets met CPA boven $40

Vergelijk de prestatie van de twee varianten in A/B-test #12345

Haal een opsplitsing op van uitgaven op leeftijdsgroep en plaatsing voor de retargetingcampagne

Welke campagnes hebben een ondermaats ritme ten opzichte van hun dagelijks budget?
```

## Verificatie

1. Ga in Meta Business Manager naar **Business Settings → System Users**
2. Maak een nieuwe systeemgebruiker aan (of gebruik een bestaande systeemgebruiker met beheerdersrechten)
3. Klik op **Nieuw token genereren** en selecteer de advertentieaccount die je wilt beheren
4. Schakel deze machtigingen in: `ads_management`, `ads_read`, `business_management`
5. Kopieer het token en stel het in als `META_ACCESS_TOKEN`
6. Vind je advertentieaccount-ID onder **Business Settings → Ad Accounts** — het begint met `act_`

Systeemgebruikertokens verlopen niet op een 60-daagse cyclus zoals gebruikerstokens — gebruik ze voor persistente MCP-toegang.

## Tips

- Gebruik `get_insights` met `breakdowns=["age","placement","device"]` voor gedetailleerde prestatiesegmentatie in één aanroep.
- Systeemgebruikertokens hebben hogere tarieflimieten dan persoonlijke gebruikerstokens en verlopen niet — geef ze altijd de voorkeur voor API-toegang.
- Geef altijd `date_preset` of een expliciet `time_range` op voor inzichtaanroepen — het standaard lookback-venster is slechts 7 dagen en kan trends niet aan de oppervlakte brengen.
- Meta Ads MCP gelanceerd in april 2026 als onderdeel van Meta's officiële MCP-programma voor ontwikkelaars.
- `create_lookalike_audience` vereist een seed-doelgroep van minstens 100 personen. Lookalikes duurt 1-2 uur om in te vullen voordat ze in adsets kunnen worden gebruikt.
- Om overuitgaven tijdens testen te voorkomen, stel je `status=PAUSED` in bij het maken van campagnes via MCP — schakel ze handmatig in na beoordeling van de setup.

---
