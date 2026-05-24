# /goal — Autonome Taakvoltooiing

## Wanneer activeren
Gebruiker wil dat Claude aan een taak blijft werken zonder te controleren; gebruiker wil een voltooiingsvoorwaarde stellen en weggaan; gebruiker vraagt naar autonoom werkings of Claude laten draaien tot een specifiek resultaat wordt bereikt.

## Wanneer NIET gebruiken
Eenvoudige eenstaps-taken waarbij één antwoord voldoende is; taken waarbij de gebruiker wil dat Claude na elke actie pauzeert en bevestigt; interactieve debugsessies waarbij heen-en-weer-communicatie het doel is.

## Instructies

**Syntaxis :**
```
/goal <voltooiingsvoorwaarde>
```

De voorwaarde wordt na elke assistent-beurt beoordeeld. Claude blijft werken — schrijft code, voert opdrachten uit, ziet fouten, past zich aan — totdat de voorwaarde vastgesteld is, stopt dan en rapporteert.

**Goede voorwaarden schrijven :**

Natuurlijke taal werkt. De voorwaarde moet waarneembaar en ondubbelzinnig zijn :

- `Alle tests slagen` — Claude voert de testsuite uit, beheert fouten, voert opnieuw uit, totdat groen
- `De PR wordt aangemaakt` — Claude voltooit het werk en opent een PR
- `De migratie wordt zonder fouten uitgevoerd` — Claude pas de migratie toe, controleert op fouten, beheert schemaproblemen
- `tsc --noEmit sluit af met 0` — Claude beheert TypeScript-fouten totdat de compiler schoon is
- `CHANGELOG.md bestaat en heeft de datum van vandaag` — Claude schrijft het changelog-bestand

**Slechte voorwaarden om te vermijden :**
- Subjectief: "ziet er goed uit", "is schoon" — niet verifieerbaar door Claude
- Open: "ga door met het verbeteren van code" — geen stoppingsvoorwaarde
- Op basis van tijd: "draai gedurende één uur" — geen resultaat

**Combineer met inspanningsniveau** voor maximale autonomie :
```
/goal Alle tests slagen
/effort xhigh
```

**Onderbreking :** Stuur bericht om te onderbreken, of verwijder `.claude/goal` om te annuleren. De doelstatus blijft behouden over context-compressies — Claude onthoudt het doel zelfs na context-venstercompressie.

**Achtergrond-sessies :** Werkt met `claude --bg`. Stel doel in, sluit terminal, kom terug wanneer klaar.

**Wat gebeurt er in elke beurt :**
1. Claude ondernemt actie (bewerkt bestanden, voert opdrachten uit)
2. Beoordeelt: is de voorwaarde vastgesteld?
3. Zo niet — gaat verder
4. Zo ja — stopt en rapporteert wat is gedaan

## Voorbeeld

```
/goal Alle TypeScript-fouten zijn opgelost en tsc --noEmit sluit af met 0
```

Claude voert `tsc --noEmit` uit, leest de foutlijst, beheert elke fout, voert opnieuw uit, ziet resterende fouten, beheert deze, voert opnieuw uit — lus gaat door totdat nul fouten. Stopt dan en rapporteert: "Opgelost 14 TypeScript-fouten over 6 bestanden. `tsc --noEmit` sluit schoon af."

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
