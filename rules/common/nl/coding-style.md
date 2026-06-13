> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../coding-style.md).

# Codeerstijlregels

Kopieer de relevante secties naar de `CLAUDE.md` van je project.

---

## Naamgeving

- Variabelen en functies: `camelCase` (JS/TS), `snake_case` (Python, Go, Rust)
- Klassen en typen: `PascalCase` in alle talen
- Constanten: `SCREAMING_SNAKE_CASE` alleen voor echte constanten die nooit veranderen
- Booleaanse variabelen: voorvoegsel met `is`, `has`, `can`, `should` — `isActive`, `hasPermission`
- Verkort namen niet tenzij de afkorting universeel bekend is (`id`, `url`, `db`, `ctx`)

## Functies

- Één verantwoordelijkheid per functie — als je "en" nodig hebt in de beschrijving, splits dan
- Maximaal 40 regels per functie; als langer, extraheer subfuncties
- Geen booleaanse parameters — gebruik een opties-object of twee afzonderlijke functies
- Keer vroeg terug voor bewakende clausules — nest het gelukkige pad niet in conditionals

## Opmerkingen

- Schrijf geen opmerkingen tenzij het WAAROM niet vanzelfsprekend is
- Schrijf nooit opmerkingen die beschrijven wat de code doet (de code doet dat al)
- Schrijf een opmerking wanneer: er een verborgen beperking is, een workaround voor een specifieke bug, of gedrag dat een lezer zou verrassen
- Schrijf nooit TODO-opmerkingen — maak in plaats daarvan een bijgehouden issue aan

## Foutafhandeling

- Slik fouten nooit stilletjes in (`catch (e) {}` is altijd fout)
- Behandel fouten altijd op de grens waar je actie kunt ondernemen
- Geef fouten naar boven door met context — wikkel in met de relevante ID of operatienaam
- Gebruik geen `console.error` in productiecode — gebruik de logger van het project

## Bestandsorganisatie

- Één primaire export per bestand
- Bestandsnamen komen overeen met hun primaire export: `UserService.ts` exporteert `UserService`
- Geen barrel-bestanden (`index.ts` re-exports) — importeer direct vanuit het bronbestand
- Groepeer imports: externe packages eerst, dan interne modules, dan relatieve imports

---
