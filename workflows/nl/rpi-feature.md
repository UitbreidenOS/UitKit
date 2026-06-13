# RPI-Functie-Workflow

Onderzoek, Plan, Implementeer — een drieases multi-agent workflow voor het afleveren van functies met strikte bereikcontrole. Elke fase produceert concreet artefact en moet voltooid zijn voordat volgende begint.

---

## Wanneer te gebruiken

- Functieaanvragen waar oppervlakte onduidelijk is aan start
- Werk dat meerdere bestanden of services omspant
- Elke taak waar slecht plan duurder is dan tijd besteed aan planning
- Situaties waar meerdere perspectieven (PM, UX, Engineering) vóór coderegels moeten worden afgestemd

---

## Fasen

### Fase 1 — Onderzoek (`/rpi:research`)

**Input:** ruwe functieaanvraag (één zin tot één alinea)

**Agenten:**
- **Explore-agent** — leest bestaande codebase voor patronen relevant voor aanvraag: vergelijkbare functies, gegevensmodellen, API-vormen, bestaande abstracties
- **Onderzoeks-agent** — onderzoekt alle externe afhankelijkheden: derde APIs, bibliotheken, documentatie, breuk-wijzigingen
- **Product Manager-agent** — synthetiseert exploratie- en onderzoeksresultaten in gestructureerd vereistendocument en geeft GO/NO-GO aanbeveling met expliciete rationale

**Poort:** Fase 2 kan niet beginnen tot PM-agent GO-aanbeveling heeft gegeven. Als NO-GO wordt geretourneerd, output legt uit waarom en stelt herziene aanvraag voor.

**Output:** `rpi/{feature-slug}/RESEARCH.md`

```markdown
# Onderzoek: {feature-slug}

## Vereisten
[Gestructureerde lijst afgeleid van ruwe aanvraag]

## Codebase-bevindingen
[Relevante bestaande patronen, ingangspunten, modellen]

## Externe bevindingen
[APIs, bibliotheken, compatibiliteitsnota's]

## Aanbeveling
GO / NO-GO

## Rationale
[Waarom — specifiek, niet generiek]
```

---

### Fase 2 — Plan (`/rpi:plan`)

**Vereenvoudiging:** `rpi/{feature-slug}/RESEARCH.md` bestaat en bevat GO-aanbeveling.

**Agenten (parallel uitgevoerd):**
- **PM-agent** — schrijft gebruikersverhalen en acceptatiecriterias uit vereisten
- **UX-agent** — kaart gebruikersstroom, randzaken, fouttoestand en toegankelijkheidsbeschouwingen
- **Engineering-agent** — produceert technische design: bestanden om te maken of wijzigen, gegevensmodelwijzigingen, API-contract, geschatte complexiteit

**Herziening:**
- **CTO-advisor-agent** — leest alle drie artefacten en herzie voor architectuurbezorgdheden, consistentie en ontbrekende cross-cutting concerns (authenticatie, observabiliteit, migraties). Geeft lijst onopgeloste bezorgdheden als die zijn; parallelle agenten behandelen deze vóór PLAN.md eindig.

**Poort:** Fase 3 kan niet beginnen tot PLAN.md geschreven is en CTO-advisor geen onopgeloste bezorgdheden heeft geretourneerd.

**Output:**
- `rpi/{feature-slug}/plan/pm.md`
- `rpi/{feature-slug}/plan/ux.md`
- `rpi/{feature-slug}/plan/eng.md`
- `rpi/{feature-slug}/PLAN.md` (geconsolideerde samenvatting, één pagina)

---

### Fase 3 — Implementeer (`/rpi:implement`)

**Vereenvoudiging:** `rpi/{feature-slug}/PLAN.md` bestaat.

**Proces:**
1. Lees PLAN.md om geordende lijst bestandswijzigingen uit engineering plan te extraheren
2. Implementeer één component tegelijk volgend opeenvolging in `eng.md`
3. Na elke primaire component (niet elk bestand) delegeer aan **code-reviewer-agent** — controleert component tegen acceptatiecriterias in `pm.md` en technisch design in `eng.md`
4. Reviewer keurt component goed of geeft specifieke wijzigingsverzoeken; behandel alle wijzigingsverzoeken vóór volgende component
5. Bij voltooiing, schrijf beslistingenlog

**Output:** werkende implementatie + `rpi/{feature-slug}/IMPLEMENT.md`

```markdown
# Implementatielogboek: {feature-slug}

## Besluiten
[Lijst implementatiebeslissingen afwijkend van plan, met rationale]

## Uitgesteld
[Alles expliciet uitgesteld tot vervolgstap]

## Voltooid
[Finale componentchecklist met reviewer-goedkeuring opgemerkt]
```

---

## Directoryindeling

```
rpi/
  {feature-slug}/
    RESEARCH.md
    PLAN.md
    IMPLEMENT.md
    plan/
      pm.md
      ux.md
      eng.md
```

---

## Voorbeeld

```
Gebruiker: /rpi:research "CSV-export tot orders-tabel toevoegen"

→ RESEARCH.md geschreven, GO uitgegevens

Gebruiker: /rpi:plan

→ plan/pm.md, ux.md, eng.md geschreven; CTO-review geslaagd; PLAN.md geschreven

Gebruiker: /rpi:implement

→ Implementatie voert component voor component voort met codeherzie-poorten
```

---
