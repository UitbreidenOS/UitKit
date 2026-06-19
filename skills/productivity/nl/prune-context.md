---
name: prune-context
description: "Claude Code context opschoner: slash-opdracht om sessie samen te vatten en token-overtolligheid te resetten"
updated: 2026-06-19
---

# Context Pruner (Context opschoner)

## Wanneer te activeren
Activeren wanneer de gebruiker de opdracht `/prune-context` uitvoert, of wanneer het tokenverbruik van de sessie hoog is, of wanneer het contextvenster vol raakt tijdens een lange sessie.

## Wanneer NIET te gebruiken
Niet gebruiken aan het begin van een sessie, of voor eenvoudige vragen die geen statusbehoud of contextreductie vereisen.

## Instructies
1. Pauzeer lopende taken en bekijk de gesprekgeschiedenis van de actieve sessie.
2. Vat de sessie samen in een zeer gecondenseerde, token-efficiënte status:
   - **Actief doel**: Het huidige doel op hoog niveau waaraan u werkt.
   - **Voltooid in sessie**: Een beknopte opsomming van voltooide wijzigingen, tests en bestanden.
   - **Belangrijke architecturale context**: Cruciale projectdetails, API's of bestanden die tijdens de sessie zijn ontdekt.
   - **Volgende stappen**: Expliciete checklist van wat er nu moet gebeuren.
3. Schrijf deze samenvatting naar `.claude/pruned_context.md`.
4. Toon de samenvatting in de chat zodat de gebruiker deze kan zien.
5. Instrueer de gebruiker om de opdracht `/clear` uit te voeren om het contextvenster te resetten en de token-overtolligheid te wissen.
6. Geef de opdracht of tekst op die ze na het wissen moeten invoeren om te hervatten: *"Voer nu `/clear` uit om het geheugen te resetten. Eenmaal gewist, vraagt u mij met: 'Resume from `.claude/pruned_context.md`' om deze status te herstellen."*

## Voorbeeld
Gebruiker: `/prune-context`
Claude:
Context-opschoning starten om token-overtolligheid te verminderen.
[Claude schrijft samenvatting naar .claude/pruned_context.md]

### Momentopname van huidige sessie
- **Actief doel**: README-documentatie herstructureren en fail-fast enforcer-regels toevoegen.
- **Voltooid**: `rules/common/fail-fast.md` en `hooks/post-tool-use/fail-fast.sh` aangemaakt.
- **Belangrijke context**: De compiler wordt uitgevoerd via `npm test` en vereist een specifieke git-auteurconfiguratie.
- **Volgende stappen**: Plan-First pre-tool-use hook implementeren.

Status opgeslagen in `.claude/pruned_context.md`.
Voer nu `/clear` uit om het geheugen te resetten en token-overtolligheid te wissen. Eenmaal gewist, vraagt u mij met: `Resume from .claude/pruned_context.md` om deze status te herstellen.
