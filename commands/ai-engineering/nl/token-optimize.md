---
description: Controleer een prompt of LLM-pijplijn op tokenverspilling en pas gerichte reducties toe
argument-hint: "[prompt file, chain file, or code path]"
---
Controleer de prompt of pijplijn op $ARGUMENTS voor token-inefficiëntie en produceer een geoptimaliseerde versie.

Lees alle verstrekte bestandspaden. Als het argument een directory is, scan naar `.py`, `.ts`, `.md` bestanden met prompt-strings of LLM-aanroepsites.

**Controle-dimensies — controleer elk:**

**1. Prompt-verbositeit**
- Opvulwoorden die tokens toevoegen zonder beperking toe te voegen ("Als een AI-taalmodel", "Uiteraard!", "Zeker")
- Herhaalde instructies die in zowel systeembericht als gebruikersbericht voorkomen
- Overbodige voorbeelden die identieke gevallen behandelen
- Proza-instructies die als een list met bullets met de helft van de tokens zouden kunnen zijn

**2. Context-venster-misbruik**
- Volledig document doorgegeven terwijl alleen een sectie nodig is — markeer met geschatte besparing
- Chatgeschiedenis woordelijk opgenomen wanneer een samenvatting zou volstaan
- Dubbele inhoud: dezelfde tekst tweemaal opgenomen onder verschillende sleutels

**3. Caching-mogelijkheden**
- Identificeer statische prompt-segmenten (systeemprompt, statische context, few-shot voorbeelden) die `cache_control: {"type": "ephemeral"}` op de Anthropic API zouden moeten gebruiken
- Markeer als het cache-geschikt segment < 1024 tokens is (onder de minimale cachedrempel — geen voordeel)
- Toon de herstructureerde berichtarray met cache-blokken correct geplaatst

**4. Uitvoerlengte**
- Is `max_tokens` ingesteld? Zo niet, markeer als onbegrensd kostenrisico
- Vraagt de prompt om uitleg wanneer alleen gestructureerde gegevens nodig zijn?
- Zou een kortere uitvoerindeling (JSON versus proza, alleen code versus code+uitleg) de generatiekosten verminderen?

**5. Model-tier-geschiktheid**
- Gebruikt de taak `claude-sonnet-4-6` of `claude-opus-4-7` voor werk dat `claude-haiku-4-5-20251001` met 10x lagere kosten kan uitvoeren?
- Classificeer taakcomplexiteit: eenvoudig extraheren/classificeren → Haiku; redenering/generatie → Sonnet; complexe multi-stap → Opus

**Uitvoerindeling:**

```
## Token-controlerapport
| Probleem | Locatie | Geschatte token-impact | Prioriteit |
|----------|---------|------------------------|-----------|
| ...      | ...     | ...                    | H/M/L     |

## Geoptimaliseerde prompt / keten
<volledige herschreven versie met toegepaste wijzigingen>

## Cache-configuratie
<berichtarray-fragment met cache_control-plaatsing, indien van toepassing>

## Geschatte besparing
Voor: ~N tokens/oproep  →  Na: ~M tokens/oproep  (~X% reductie)
Bij 1000 oproepen/dag op [model]: $Y/maand besparing
```

Pas alle problemen met hoge prioriteit rechtstreeks toe in de uitvoer. Leg items met gemiddelde/lage prioriteit uit maar pas deze niet toe zonder te vragen.
