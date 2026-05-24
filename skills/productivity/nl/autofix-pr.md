# /autofix-pr — Automatische Toepassing van PR-Fixes

## Wanneer activeren
Gebruiker wil dat Claude code review-suggesties automatisch zonder handmatige tussenkomst toepast; gebruiker vermeldt `/autofix-pr`; gebruiker wil handsfree PR-verfijning na het pushen van code en het ontvangen van reviewer-opmerkingen.

## Wanneer NIET gebruiken
Gebruiker wil elke wijziging controleren voordat deze wordt toegepast; repos zonder GitHub-integratie; PR's met complexe architectonische review-opmerkingen die beoordelingsvermogen vereisen; situaties waarin auto-commit naar de branche teambeleid zou schenden.

## Instructies

**Wat het doet :**
`/autofix-pr` maakt automatische toepassing van niet-destructieve PR-review-suggesties mogelijk. Claude leest de openstaande review-opmerkingen op de huidige PR en past fixes toe die voldoen aan de auto-apply-criteria zonder handmatige bevestiging af te wachten.

**Wat Claude automatisch toepast :**
- Opmaakfixes (inspringing, spaties aan het einde, lege regels)
- Typocorrectie in code en opmerkingen
- Eenvoudige variabele hernoemingen waarbij de reviewer de nieuwe naam expliciet heeft aangegeven
- Voor de hand liggende refactoring met duidelijke, ondubbelzinnige beschrijving ("haal dit uit in een helperfunctie met naam X")
- Lint-regelfixes (ongebruikte imports, ontbrekende puntkomma's, const versus let)

**Wat Claude NIET automatisch toepast :**
- Architectonische wijzigingen (verplaatsing van bestanden, herstructurering van modules)
- Logica-herschrijving of algoritme-wijzigingen
- Alles wat oordeel over afwegingen vereist
- Suggesties geformuleerd als vragen ("misschien overwegen…?")
- Dubbelzinnige suggesties waarbij meerdere geldige interpretaties bestaan

**Omgang met dubbelzinnige opmerkingen :**
Claude toont je de opmerking, legt uit waarom deze dubbelzinnig is, en vraagt voor toepassing. U antwoordt, Claude past toe, gaat naar volgende.

**Vereisten :**
- Repo moet verbonden zijn met Claude Code (dezelfde sessie die PR opende, of sessie in dezelfde lokale repo)
- GitHub-integratie moet actief zijn
- PR moet open zijn en reviewer-opmerkingen hebben

**Zichtbaarheid :**
Elke automatisch toegepaste fix verschijnt als commit in PR-timeline met notitie dat deze automatisch is toegepast. Reviewers zien precies wat is gewijzigd en waarom.

**In/uit :**
- `/autofix-pr` — activeer voor deze sessie
- `/autofix-pr off` — deactiveer

## Voorbeeld

PR heeft 12 review-opmerkingen. 9 zijn: "gebruik `const` in plaats van `let`", "voeg ontbrekende puntkomma's toe op regel 47", "variabelenaam moet `userId` zijn niet `user_id`", "verwijder ongebruikte import". Claude past automatisch alle 9 toe, committed ze als één opschoon-commit, en toont de resterende 3 architectonische opmerkingen ter handmatige beoordeling: "De volgende 3 opmerkingen vereisen uw inbreng voordat ik ze kan toepassen."

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
