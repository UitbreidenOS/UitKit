---
name: content-freshness
description: "Onderhouds-SLA, vervalsdrempels en versnapperingsprocedures voor Claudient-inhoud"
updated: 2026-06-15
---

# Claudient Content Freshness SLA

Onderhoudsnormen en -procedures voor het actueel en nauwkeurig houden van Claudient-inhoud. Deze gids definieert vervalsdrempels, wat per inhoudstype moet worden gecontroleerd en het frontmatter-updateproces.

---

## Vervalsdrempels

Een bestand wordt als **verouderd** beschouwd wanneer de `updated` datum in het YAML-frontmatter ouder is dan de drempel voor het type:

| Inhoudstype | Drempel | Reden |
|---|---|---|
| Vaardigheden (kernproductiviteit, testing, debugging) | 6 maanden | Kernpatronen veranderen frequently met Claude-modelupdates |
| Vaardigheden (domeinspecifiek: backend, frontend, enz.) | 6 maanden | Gereedschap en best practices evolueren snel |
| Agenten (kernrollen: debugger, reviewer, enz.) | 6 maanden | Agentcapaciteiten hangen af van Claude-modelcapaciteiten |
| Gidsen (aan de slag, conceptueel) | 9 maanden | Referentiemateriaal is stabieler dan how-to |
| Gidsen (tool/framework-specifiek) | 6 maanden | Tools en API's veranderen sneller dan concepten |
| Workflows (tactisch: bug-investigation, code-review) | 6 maanden | Deze weerspiegelen huidige praktijken en tools |
| Workflows (strategisch: onboarding, planning) | 9 maanden | Langetermijnprocessen zijn stabieler |
| Prompts | 6 maanden | Prompt-effectiviteit verslechtert naarmate modelgedrag verandert |
| ADRs / Regels (gedocumenteerde beslissingen) | 12 maanden | Beslissingen zijn bedoeld om langdurig te zijn; controleer alleen wanneer de context verandert |

**Algemene regel:** Als het een `updated` datum heeft en ouder is dan 6 maanden, voeg het toe aan de ververssingswachtrij. Gebruik alleen langere drempels (9–12 maanden) voor echt niet-technische inhoud (historische voorbeelden, gearchiveerde gidsen).

---

## Indicatoren van verouderde inhoud

Een bestand is functioneel verouderd, zelfs als de datum recent is, als een van deze van toepassing is:

### Vaardigheden
- Voorbeelden van opdrachtssyntaxis die niet meer werken (test in Claude Code)
- Namen van tools die zijn hernoemd of verwijderd
- Verouderde screenshot- of UI-referentie
- Hook-triggercondities die niet meer bestaan
- Voorbeeld dat breekt in huidige Claude Code
- Vermeldt een afgeschaft onderdeel of modelnaam

### Agenten
- Beschrijft tools waar de agent niet langer toegang toe heeft
- Verwijst naar een modelversie die niet langer beschikbaar is
- Capaciteitsstellingen komen niet langer overeen met de werkelijkheid
- Prompt-voorbeelden die oud API-gedrag weerspiegelen

### Gidsen
- Vergelijkingtabel voor functies die is gewijzigd (bijv. modelprijs, contextvensters)
- Installatiehandleidingen voor een tool met een nieuwe hoofdversie
- Workflowstappen die afhankelijk zijn van een verwijderd onderdeel
- Verouderde screenshot- of interface-referentie
- Verwijst naar een oude projectstructuur of naamgevingsconventie

### Workflows
- Verwijst naar een tool of vaardigheid die is verwijderd
- Parallelle stappen die afhankelijk zijn van tools die niet langer beschikbaar zijn
- Voorbeeld gaat uit van een codebasestructuur die niet langer wordt aanbevolen
- Metriek of SLA die niet langer relevant is (verouderde teamformaten, verkeersvolume)

### Alle inhoudstypen
- Dode links (404's naar externe bronnen)
- Verwijzingen naar "toekomstige" functies die lang geleden zijn verzonden
- Voorbeelden met verouderde taal/framework-versies
- Dubbelfzinnige stellingen zonder ondersteunend bewijs

---

## Frontmatter-indeling

Elk bestand in `skills/`, `agents/`, `guides/`, `workflows/`, `rules/` en `prompts/` moet aan het begin een YAML-frontmatter-blok hebben:

```yaml
---
name: the-skill-name
description: "Doel van dit bestand in één zin"
updated: 2026-06-15
---
```

### Frontmatter-regels

- **name:** kebab-case, komt overeen met bestandsnaam (zonder `.md`)
- **description:** ~50 tekens, past op één regel, bevat niet de titel
- **updated:** ISO 8601-datum (`YYYY-MM-DD`), bijgewerkt naar vandaag wanneer u het bestand wijzigt

**Voorbeeld (vaardigheidsbestand):**
```yaml
---
name: freshness-auditor
description: "Voer versnapperingcontroles uit en genereer geprioriteerde verversingslijsten"
updated: 2026-06-15
---
```

**Voorbeeld (workflowbestand):**
```yaml
---
name: freshness-refresh
description: "Driemaandelijks onderhoudsprint om verouderde inhoud te controleren en te verversen"
updated: 2026-06-15
---
```

### Hoe frontmatter bijwerken

Wanneer u een bestand wijzigt:
1. Zoek het `---` blok bovenaan
2. Wijzig de `updated:` waarde naar vandaag's datum in ISO-indeling
3. Wijzig `name` of `description` niet (dit zijn stabiele identifiers)
4. Commit het bestand met de bijgewerkte datum

Als een bestand verouderd is maar nog steeds nauwkeurig, werk dan alleen de `updated:` datum bij om de vervalsteller opnieuw in te stellen. Dit geeft aan "versnapperingbevestigd — inhoud geverifieerd als actueel."

---

## Wat per vaardigheidstype moet worden gecontroleerd

### Productiviteitsvaardigheden
- Voer alle opdrachtvoorbeelden uit in een echte Claude Code-sessie — werkt het?
- Als de vaardigheid een slash-commando aanroept (bijv. `/code-review`), controleer of dat commando nog bestaat
- Als de vaardigheid naar een hook of instelling verwijst (bijv. `settings.json` configuratie), controleer of deze nog geldig is
- Controleer externe toolkoppelingen (npm, GitHub, docs) op 404's

### Domeinvaardigheden (backend, frontend, ML, enz.)
- Controleer of aanbevelingen voor framework/bibliotheekversie nog actueel zijn
- Voer codevoorbeelden uit (als op zichzelf staand) om ervoor te zorgen dat de syntaxis geldig is
- Controleer of het tool of framework een belangrijke versie heeft uitgebracht en het gedrag heeft gewijzigd
- Controleer of paketnamen en importpaden niet zijn gewijzigd

### Conceptuele vaardigheden en gidsen
- Herlezing van inhoud met frisse ogen — is de uitleg nog helder en nauwkeurig?
- Controleer externe koppelingen (tutorials, specs, standaarden) op 404's
- Als de vaardigheid twee opties vergelijkt, controleer of beide nog in algemeen gebruik zijn
- Als de vaardigheid een "best practice" beschrijft, controleer of deze aansluit bij de huidige industrieconsensus

### Agenten
- Controleer of de modelaanbeveling van de agent (Haiku/Sonnet/Opus) nog geschikt is voor de taak
- Controleer of het vermelde `tools:` nog in Claude Code bestaat
- Herlezing van de sectie `model guidance` — geldt deze nog voor het huidige Claude-model?
- Controleer of aangenomen agentcapaciteiten niet zijn verwijderd

### Workflows
- Lees de workflowstappen — zijn alle verwezen tools, commando's en functies nog beschikbaar?
- Controleer of een stap afhankelijk is van verouderd gedrag
- Controleer of vermelde metrieken of SLA's nog realistisch zijn
- Als de workflow agenten voortbrengt, zorg ervoor dat agentdefinities nog bestaan en hun rollen niet zijn gewijzigd

### Regels
- Controleer of de regel nog in de codebase wordt gevolgd
- Als de regel naar een tool of functie verwijst, controleer of deze nog bestaat
- Herlezing van de motivering — is deze nog geldig?

---

## Versnapperingcontrole Workflow (Voor individuele bijdragers)

Wanneer u een bestand toevoegt of wijzigt:

1. **Werk frontmatter bij:**
   ```yaml
   updated: [VANDAAG'S DATUM IN YYYY-MM-DD INDELING]
   ```

2. **Test waar van toepassing:**
   - Als het bestand commando's bevat, voer ze uit
   - Als het bestand code bevat, valideer de syntaxis
   - Als het bestand naar een functie verwijst, controleer of deze bestaat

3. **Controleer koppelingen:**
   - Externe URL's in het bestand mogen geen 404 zijn
   - Interne koppelingen (naar andere bestanden in Claudient) moeten naar bestaande bestanden verwijzen

4. **Commit:**
   ```bash
   git add path/to/file.md
   git commit -m "chore: refresh [filename] — verify accuracy and update date"
   ```

---

## Driemaandelijkse versnapperingssprint

Voer elke 3 maanden de volledige `/workflows/freshness-refresh` workflow uit:

1. **Genereer een rapport:** `node scripts/generate-refresh-report.js`
2. **Sorteer bestanden** op leeftijd en belang
3. **Spawn review-agenten** om inhoudsnauwkeurigheid te controleren
4. **Pas updates toe** van agentverslagen
5. **Commit de batch** en stel de vervalsteller opnieuw in

---

## SLA-doelstellingen

- **Kernproductiviteitsvaardigheden:** 95% vers (< 6 maanden)
- **Alle andere inhoud:** 85% vers
- **Ontbrekende frontmatter-datums:** 0 (alle bestanden moeten een `updated:` veld hebben)
- **Verbroken koppelingen:** 0 (CI-controle onmiddellijk gemarkeerd)

Controleer deze metriek in het driemaandelijks gegenereerde versnapperingrapport.

---

## Gerelateerde inhoud

- `/workflows/freshness-refresh` — driemaandelijks onderhoudsprint-procedure
- `/skills/productivity/freshness-auditor` — voer een versnapperingcontrole op verzoek uit
- `/scripts/check-freshness.js` — CLI-tool voor detectie van verouderde bestanden
- `/scripts/generate-refresh-report.js` — genereer een gedetailleerd versnapperingrapport

---
