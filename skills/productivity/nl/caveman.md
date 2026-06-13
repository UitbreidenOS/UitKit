> 🇳🇱 Nederlandse versie. [Engelse versie](../caveman.md).

# Caveman Mode Skill

## Wanneer te activeren
- Je wilt het tokengebruik aanzienlijk verminderen tijdens een lange sessie
- Het contextvenster raakt vol en je moet de nuttige levensduur van de sessie verlengen
- Je voert een kostengevoelige werklast uit (veel parallelle agents, batchverwerking)
- De antwoorden van Claude zijn uitgebreid en je wilt beknopte, fragmentstijl-uitvoer
- Je wilt bestaande geheugen- of CLAUDE.md-bestanden comprimeren om invoertokens te verminderen

## Wanneer NIET te gebruiken
- Beveiligingswaarschuwingen of bevestigingen van onomkeerbare acties — deze hebben volledige zinnen nodig
- Meerstappige reeksen waarbij fragmentambiguïteit tot verkeerd gelezen acties kan leiden
- Onboarding van nieuwe teamleden in een codebase — duidelijkheid gaat hier boven beknoptheid
- Documentatie schrijven die externe mensen zullen lezen

## Instructies

Caveman mode is een gevestigde tokencompressietechniek met een speciale implementatie op [github.com/JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman). Deze skill is een verwijzing — gebruik de originele repo, dupliceer deze niet.

### Wat het doet

Caveman mode instrueert Claude om gecomprimeerde, fragmentstijl-proza te produceren:

| Niveau | Regel | Voorbeeld |
|--------|-------|-----------|
| `lite` | Verwijder opvulling en aarzeling, behoud lidwoorden en volledige zinnen | "The function handles edge cases." |
| `full` | Verwijder lidwoorden, fragmenten toegestaan, korte synoniemen | "func handles edge cases" |
| `ultra` | Afkort prozawoorden, verwijder voegwoorden, pijlen voor causaliteit | "fn→edge cases handled" |

Gemeten resultaten (maart 2026, [arxiv.org/abs/2604.00025](https://arxiv.org/abs/2604.00025)):
- ~65% vermindering van uitvoertokens
- 26 punten verbetering op benchmarks (beknoptheid scherpt het redeneren)
- 100% technische nauwkeurigheid behouden

### caveman-compress sub-skill
Herschrijft `.md`-geheugen- en CLAUDE.md-bestanden naar caveman-proza — ~46% besparing op invoertokens per sessie, omdat gecomprimeerde bestanden bij elke contextlading opnieuw worden ingelezen.

### cavecrew subagents
Op Haiku gebaseerde subagents die in caveman mode draaien — ~60% minder tokens dan gewone agents voor eenvoudige classificatie-, extractie- en routeringstaken.

### caveman-shrink MCP middleware
Comprimeert MCP-toolteschrijvingen voordat ze de context van Claude binnengaan — vermindert MCP-overhead met ~30% zonder het gedrag van tools te wijzigen.

## Voorbeeld

**Caveman mode activeren in een sessie:**
```
Use caveman mode (full level) for this session. Drop articles, use fragments,
short synonyms. Auto-revert to normal prose for: security warnings,
irreversible action confirmations, multi-step sequences.
```

**caveman-compress gebruiken op een geheugenbestand:**
```
/caveman-compress .claude/memory/project-context.md
```

**cavecrew gebruiken voor een classificatietaak:**
```
Spawn a cavecrew subagent (Haiku, caveman full) to classify these 200 support
tickets into 5 categories. Return only: ticket_id, category.
```

---

**Referentie:** [github.com/JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) — de gezaghebbende caveman-implementatie. Claudient verwijst naar dit werk; het wordt hier niet gedupliceerd.

---
