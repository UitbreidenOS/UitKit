---
description: Genereer een uitgebreide README.md voor het huidige project
argument-hint: "[output-path]"
---
Analyseer dit project en genereer een production-quality README.md.

Stappen:
1. Scan de repostructuur: lees package.json / pyproject.toml / Cargo.toml / go.mod of equivalent om programmeertaal, framework, en afhankelijkheden te bepalen.
2. Identificeer het/de ingangs­punt(en), bouwsysteem, en test runner.
3. Lees eventuele bestaande README, CONTRIBUTING, en docs/ bestanden voor context — zorg voor geen duplicatie, verbetering.
4. Inspecteer CI-configuratie (.github/workflows/, .gitlab-ci.yml, etc.) voor badges en workflow-namen.

Schrijf de README met deze secties (neem alleen secties op die relevant zijn — laat lege uit):

- **Projectnaam + eenregelige tagline** — begin met waarde, niet tech stack.
- **Badges** — build-status, coverage, licentie, versie (gebruik echte shield-URL's als CI bestaat).
- **Overzicht** — 2–4 zinnen: welk probleem het oplost, voor wie het is, wat het onderscheidt maakt.
- **Vereisten** — minimale runtime-/compiler-versies, OS-beperkingen.
- **Installatie** — exacte commando's, copy-pasteable. Dekking van alle ondersteunde package managers indien van toepassing.
- **Snelle start** — de minimale code of commando om een werkend resultaat in minder dan 2 minuten te krijgen.
- **Gebruik** — belangrijkste CLI-flags, API-oppervlak, of configuratieopties. Gebruik echte voorbeelden uit de codebase.
- **Configuratie** — omgevingsvariabelen, config-bestandsindeling, standaards. Verwijs naar daadwerkelijke variabelen­namen in code.
- **Architectuur** (indien niet-triviaal) — één korte paragraaf of ASCII-diagram met grote onderdelen.
- **Development** — hoe klonen, dev-afhankelijkheden installeren, tests uitvoeren, linting, en bouwen.
- **Bijdragen** — link naar CONTRIBUTING.md als die bestaat; anders twee zinnen schrijven.
- **Licentie** — licentienaam en link naar LICENSE-bestand.

Beperkingen:
- Elk codeblok moet een taalomheining hebben.
- Verzin geen functies of API's — documenteer alleen wat in de codebase bestaat.
- Schrijf voor een ontwikkelaar die dit project nog nooit gezien heeft.
- Gebruik ATX-koppelingen (##), geen onderstrepingsstijl.
- Houd de toon direct en neutraal — geen marketingtaal.

Uitvoerpad: $ARGUMENTS (standaard: README.md in de projectwortel).
Schrijf het bestand. Druk de inhoud niet af in de terminal — bevestig alleen het geschreven pad.
