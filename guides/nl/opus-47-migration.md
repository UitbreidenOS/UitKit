# Migreren naar Claude Opus 4.7

Claude Opus 4.7 introduceert breaking changes in de Messages API naast nieuwe mogelijkheden. Drie parameters die eerder niet-standaardwaarden accepteerden, retourneren nu HTTP 400. Voordat u uw model-ID naar `claude-opus-4-7` bijwerkt, controleert u uw bestaande code op deze patronen.

---

## Breaking Changes

### 1. Uitgebreid nadenk-budget verwijderd

Opus 4.7 accepteert niet langer `budget_tokens` in de nadenk-configuratie. Het model beheert zijn eigen nadenk-budget adaptief.

**Oud (retourneert 400 op Opus 4.7) :**
```python
response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=16000,
    thinking={"type": "enabled", "budget_tokens": 8000},
    messages=[{"role": "user", "content": "..."}]
)
```

**Nieuw :**
```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=16000,
    thinking={"type": "adaptive"},
    output_config={"effort": "high"},
    messages=[{"role": "user", "content": "..."}]
)
```

`effort` accepteert `"low"`, `"medium"` of `"high"`. Gebruik `"high"` voor complexe redeneertaken waarbij u eerder een groot `budget_tokens` instelde. Het model bepaalt hoeveel het zal nadenken — de `effort` aanwijzing beïnvloedt die beslissing.

---

### 2. Sampling-parameters verwijderd

`temperature`, `top_p` en `top_k` moeten worden weggelaten of op hun standaardwaarden worden ingesteld. Het doorgeven van niet-standaardwaarden retourneert HTTP 400.

**Oud (retourneert 400 op Opus 4.7) :**
```python
response = client.messages.create(
    model="claude-opus-4-6",
    max_tokens=4096,
    temperature=0.7,
    top_p=0.9,
    messages=[{"role": "user", "content": "..."}]
)
```

**Nieuw — verwijder de parameters volledig :**
```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}]
)
```

Er is geen workaround voor dit. Opus 4.7 biedt geen sampling-besturingselementen. Als uw use case expliciete temperatuurbesturing vereist, blijft u op Opus 4.6 of gebruikt u een ander model in de 4.7 familie.

---

### 3. Nadenk-inhoud wordt standaard weggelaten

Nadenk-blokken worden nog steeds uitgevoerd en gestreamd, maar het `thinking` veld in de response is standaard leeg. Dit is een verandering van het Opus 4.6 gedrag.

**Om nadenk-samenvattingen te zien :**
```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=16000,
    thinking={"type": "adaptive", "display": "summarized"},
    messages=[{"role": "user", "content": "..."}]
)

for block in response.content:
    if block.type == "thinking":
        print("Thinking summary:", block.thinking)
    elif block.type == "text":
        print("Response:", block.text)
```

`"display": "full"` retourneert volledige nadenk-output. `"display": "summarized"` retourneert een samengeperste versie. `"display": "none"` (standaard) laat het weg. Gebruik `"summarized"` voor debugging; gebruik `"none"` in productie om de antwoordgrootte te verkleinen.

---

## Nieuwe mogelijkheden

### Adaptief nadenken

De enige ondersteunde nadenkmodus op Opus 4.7. Standaard uitgeschakeld — schakel het in voor taken die baat hebben bij uitgebreid redeneren:

```python
# Inschakelen — laat het model bepalen hoeveel het nadenkt
thinking={"type": "adaptive"}

# Inschakelen met effort-aanwijzing
thinking={"type": "adaptive"}
output_config={"effort": "high"}

# Uitgeschakeld (standaard)
# Laat de thinking parameter helemaal weg
```

Adaptief nadenken activeert automatisch op complexe multi-stap problemen wanneer ingeschakeld. Op eenvoudige prompts kan het weinig of geen uitgebreid nadenken gebruiken, zelfs met `effort: "high"` — het model kalibreert zich op de taak.

---

### Task-budgets (bèta)

Een adviseur cross-loop token-budget. Het model gebruikt het als richtlijn — het is geen harde cap, maar het model zal proberen de taak binnen het budget af te ronden.

**Bèta-header vereist :** `task-budgets-2026-03-13`

```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=32000,
    output_config={
        "task_budget": {
            "type": "tokens",
            "total": 128000
        }
    },
    extra_headers={"anthropic-beta": "task-budgets-2026-03-13"},
    messages=[{"role": "user", "content": "..."}]
)
```

**Minimum :** 20.000 tokens. Budgetten onder 20k worden geweigerd. Het budget is adviseur — als de taak werkelijk meer tokens nodig heeft, kan het model het overschrijden in plaats van een onvolledig antwoord te geven.

Gebruik task-budgets bij het orkestreren van multi-stap agenten waar ongecontroleerd token-verbruik een bezorgdheid is. Gebruik ze niet als mechanisme voor factureringscontrole — zij zijn een gedragsaanwijzing, geen afdwingingsgrenzen.

---

### Ondersteuning voor afbeeldingen met hoge resolutie

Opus 4.7 accepteert afbeeldingen tot 2.576 px aan de langste zijde, met een maximum van 3,75 megapixels. Dit is een stijging van 1.568 px / 1,15 MP op oudere modellen.

```python
# Computer-use-taken profiteren van de hogere resolutie
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=4096,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/png",
                    "data": screenshot_b64
                }
            },
            {"type": "text", "text": "Click the 'Submit' button."}
        ]
    }]
)
```

De nieuwe groottelimiet maakt 1:1 pixelcoördinaten mogelijk voor computer-use-taken — u kunt naar exacte schermposities verwijzen zonder schaalberekeningen.

Als u afbeeldingen groter dan 2.576 px doorgeeft, worden deze aan de serverzijde aangepast. Schaal ze vooraf op de client om overhead te voorkomen.

---

### Nieuwe tokenizer

Opus 4.7 gebruikt een nieuwe tokenizer die voor gelijkwaardige inhoud 1x–1,35x meer tokens produceert dan Opus 4.6. Dezelfde invoertekst kost meer tokens en dezelfde output kost meer tokens.

**Impact op `max_tokens` :** Als uw bestaande code `max_tokens` instelt op basis van verwachte uitvoerlengte, verhoogt u het met 35% als startpunt. Reacties die eerder in 4.000 tokens pasten, kunnen nu tot 5.400 vereisen.

```python
# Oud — kan op 4.7 afsnijden als output token-zwaar is
max_tokens=4096

# Nieuw — voeg ~35% speelruimte toe
max_tokens=5600
```

Voer uw eval-suite uit op een steekproef van echte prompts en vergelijk de token-aantallen van de output voordat u al uw `max_tokens` waarden bijwerkt.

---

## Gedragsveranderingen (niet Breaking)

Dit zijn geen API-fouten, maar ze beïnvloeden wel de output-kwaliteit als uw prompts op vorig gedrag steunen.

**Meer letterlijke instructie-volging.** Opus 4.7 interpreteert prompts nauwkeuriger. Vage instructies die eerder werkten, kunnen onverwachte resultaten opleveren. Wees expliciet: in plaats van "ruim deze code op" schrijft u "verwijder ongebruikte variabelen en voeg typeaannotaties toe aan alle functiehandtekeningen".

**Minder tool-aanroepen en subagenten standaard.** Het model is voorzichtiger met het starten van subagenten en het aanroepen van tools. Als uw werkstroom afhankelijk is van het model dat automatisch tools gebruikt, moet u het mogelijk expliciet instrueren om dit te doen.

**Reactielengte kalibreert op taakcomplexiteit.** Korte vragen krijgen korte antwoorden. Als u een gedetailleerd antwoord op een eenvoudige vraag nodig hebt, instrueert u het model om grondiger te zijn in plaats van aan te nemen dat het dat zal zijn.

---

## Migratiecontrolelijst

- [ ] `budget_tokens` uit alle `thinking` configuraties verwijderen — vervangen door `thinking: {type: "adaptive"}`
- [ ] `temperature`, `top_p`, `top_k` verwijderen indien ingesteld op niet-standaardwaarden
- [ ] `"display": "summarized"` toevoegen aan nadenk-configuratie als u nadenk-blokken in uw toepassing leest
- [ ] `max_tokens` met ~35% verhogen voor rekening met de nieuwe tokenizer
- [ ] Afbeeldingsingangen testen: verifieer dat afmetingen binnen 2.576 px / 3,75 MP liggen, werk alle coördinaatberekeningen bij
- [ ] Model-ID-strings bijwerken: `claude-opus-4-7`
- [ ] Prompts controleren op vage instructies — Opus 4.7 is letterlijker
- [ ] Controleer orkestratie die afhankelijk is van automatisch tool-gebruik — kan expliciete instructie nodig hebben

---

## Claude Code-gebruikers

Claude Code beheert de API-laag voor u. Er zijn geen API-level breaking changes om mee om te gaan — werk het model bij in uw instellingen en Claude Code doet de rest.

Wat mogelijk aanpassing vereist, is uw prompt-stijl. Opus 4.7's meer letterlijke interpretatie en meer conservatieve tool-gebruik kunnen complexe multi-stap sessies beïnvloeden. Als Claude Code-sessies minder autonoom worden na de model-update, voegt u expliciete instructies toe aan uw CLAUDE.md: geef aan welke tools proactief moeten worden gebruikt, definieer wat "grondige" betekent voor uw codebase, en verwijder alle ambigue staande instructies die erop vertrouwden dat het model intentie zou afleiden.

---
