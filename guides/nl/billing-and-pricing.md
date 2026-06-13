# Facturering en prijzen — Claude-abonnementen, Agent SDK-tegoedenm en kostenbeheer

Een praktische referentie voor het begrijpen van Claudes abonnementstiers, de factureringssplitsing van 15 juni, API-tokentarieven en kostenoptimalisatiestrategieën.

---

## Overzicht van abonnementen

| Abonnement | Maandelijks bedrag | Interactieve limieten | Agent SDK-tegoedenm |
|---|---|---|---|
| **Pro** | €20/mnd | Standaard | €20/mnd |
| **Max 5×** | €100/mnd | 5× standaard | €100/mnd |
| **Max 20×** | €200/mnd | 20× standaard | €200/mnd |
| **Team** | Per gebruiker | Gedeelde pool | Afzonderlijke API-facturering |
| **Enterprise** | Per gebruiker | Onderhandeld | Afzonderlijke API-facturering |

**Team en Enterprise** accounts gebruiken per-gebruiker prijzen met API-facturering tegen tokentarieven — er is geen vaste Agent SDK-tegoedpool. Alle tokenverbruik wordt rechtstreeks tegen de API gemeten.

---

## De factuurwijziging van 15 juni 2026

> **Deze wijziging is van toepassing op alle Pro en Max-abonnees.** API-sleutelgebruikers (geen abonnement) worden niet beïnvloed — zij zijn altijd per token gefactureerd.

Voor 15 juni 2026: `claude -p` (printmodus), Agent SDK-sessies en Managed Agent-sessies putten allemaal uit dezelfde pool als interactieve Claude-chat en Claude Code-terminalsessies.

Na 15 juni 2026: **Twee afzonderlijke pools.**

### Pool 1 — Interactieve Pool
Omvat:
- Claude.ai-chatsessies
- Claude Code-terminalsessies (`claude` in uw terminal, interactieve modus)

### Pool 2 — Agent SDK-tegoedpool
Omvat:
- `claude -p` (printmodus / niet-interactief)
- Agent SDK-sessies (programmatische API-aanroepen)
- Managed Agent-sessies (in de cloud gehoste agenten via `client.beta.sessions`)

### Wat dit in de praktijk betekent

- U kunt `claude -p`-scripts, pijplijnen en automatisering de hele maand uitvoeren zonder uw interactieve chatlimieten aan te raken.
- Agent SDK-tegoedenm rollen **niet** mee van maand tot maand. Ongebruikt tegoed verloopt aan het einde van de factureringsperiode.
- Als u de Agent SDK-tegoedlimiet bereikt, retourneren volgende oproepen een `429` met `X-Limit-Pool: agent_sdk` in de antwoordheader. Interactief gebruik wordt niet beïnvloed.
- API-sleutelgebruikers: geen wijziging. Gefactureerd per token zoals altijd — geen pools, geen rollover.

### Gebruik controleren

```bash
# In Claude Code — toont per-categorie-uitsplitsing
/usage
```

De `/usage`-uitvoer toont nu twee rijen: `interactive` en `agent_sdk`, elk met gebruikte tokens en resterende toewijzing. Controleer dit voordat u grote batchtaken uitvoert om te bevestigen dat u voldoende Agent SDK-tegoedenm hebt.

De Claude.ai-gebruikspagina (Instellingen → Gebruik) volgt ook maandelijkse limieten per pool met een voortgangsbalk voor elk.

---

## API-prijzen (API-sleutelgebruikers)

Gefactureerd per token. Geen abonnement vereist. Tarieven vanaf juni 2026:

### Invoer-/uitvoertarieven

| Model | Invoer (per 1M tokens) | Uitvoer (per 1M tokens) |
|---|---|---|
| Claude Opus 4.7 | €5,00 | €25,00 |
| Claude Sonnet 4.6 | €3,00 | €15,00 |
| Claude Haiku 4.5 | €0,25 | €1,25 |

### Prompt Cache-tarieven

| Cache-bewerking | Vermenigvuldiger op invoerprijs |
|---|---|
| Cache-lezing | 0,1× (90% korting) |
| Cache-schrijven | 1,25× (25% toeslag bij eerste schrijven) |

Caching is nettoposítief wanneer u meer dan 1 lees per schrijven verwacht. Bij Opus 4.7-tarieven: een context van 100K tokens kost €0,50 om in cache te schrijven en €0,05 per cache-lezing. Break-even bij 1,25 lezingen; elke lees daarna spaart €0,45.

### Batch API

De Batch API verwerkt aanvragen asynchroon en retourneert resultaten binnen 24 uur. Korting: **50% korting op standaardtarieven** op zowel invoer- als uitvoertokens. Gebruik het voor:
- Classificatietaken
- Bulkdocumentverwerking
- Analyse-pijplijnen voor de nacht
- Elke werkbelasting waarbij latentie geen beperking is

---

## Kostenoptimalisatiestrategieën

### 1. Haiku gebruiken voor mechanische taken

Haiku 4.5 is ruwweg 12× goedkoper dan Opus 4.7 op invoertokens. Voor taken die geen reasoning vereisen — classificatie, samenvatting, sjabloonvulling, vertaling, extractie uit gestructureerde gegevens — produceert Haiku gelijkwaardige resultaten tegen een fractie van de kosten.

Vuistregel: als u er een regex voor zou kunnen schrijven, verwerkt Haiku het. Als de taak multi-stap-reasoning of oordeel vereist, pak Sonnet of Opus.

### 2. Prompt Caching voor herhaalde grote contexten

Elke contextblok die herhaald optreedt in oproepen — systeemaanwijzingen, grote codebases, referentiedocumenten, toolschema's — moet worden gecached. Bij een cache-lezes van 0,1×, kost een 200K-token systeemaanwijzing €1,00 om eenmaal te schrijven en €0,10 per lezing daarna.

Cache-schrijfbewerkingen zijn expliciet: gebruik de `cache_control: {"type": "ephemeral"}`-markering op het inhoudsblok. Gecached inhoud heeft een TTL van 5 minuten die bij elke lezing opnieuw wordt ingesteld.

### 3. Batch API voor niet-tijdsensitieve workloads

Als een pijplijn tot 24 uur latentie kan tolereren, route deze via de Batch API. 50% korting op alle modellen. Op schaal halveert dit uw API-uitgaven op asynchrone taken.

### 4. Uitvoerlengtebeheer

Uitvoertokens kosten 5× meer dan invoertokens tegen hetzelfde tarief. Instrueer het model om beknopt te zijn wanneer u alleen gestructureerde uitvoer of korte antwoorden nodig hebt. Voeg aan uw systeemaanwijzing toe:

```
Antwoord alleen met wat werd gevraagd. Voeg geen uitleg, voorbehouden of samenvattingen toe tenzij expliciet gevraagd.
```

Voor extractietaken: instrueer alleen JSON-uitvoer zonder omringende proza.

### 5. Uitgestelde gereedschapladen

Het vermelden van 50+ gereedschappen in een systeemaanwijzing kan 10K–20K tokens context per oproep toevoegen. Uitgestelde toolloading-patroon van Claude Code laadt toolschema's alleen wanneer Claude ernaar vraagt, waardoor de opstartscontext voor grote toolcatalogi met tot 85% wordt verminderd.

Zie `guides/token-cost-reduction.md` voor het patroon voor uitgestelde laadimplementatie.

### 6. Agent SDK-tegoedenm vóór API-sleutels gebruiken voor scripts

Als u een Max-abonnement hebt, is uw Agent SDK-tegoedpool vooruitbetaald. `claude -p`-scripts uitvoeren tegen uw abonnement kost niets extra totdat de tegoedpool is uitgeput. Alleen terugvallen naar directe API-sleutel-facturering wanneer uw tegoedpool is uitgeput of voor workloads die de tegoedlimiet overschrijden.

---

## Monitoring

| Gereedschap | Wat het toont |
|---|---|
| `/usage` in Claude Code | Huididig sessietokengebruik per categorie (interactief / agent_sdk) |
| Claude.ai → Instellingen → Gebruik | Maandelijkse limieten, per-pool voortgangsstaven |
| `hooks/post-tool-use/cost-tracker.sh` | Per-sessie kostlogging via PostToolUse hook |

Voor API-sleutelgebruikers biedt de Anthropic-console (console.anthropic.com) dagelijks tokengebruik uitgesplitst naar model en een uitgavengrafiek voor de factureringsperiode.

---
