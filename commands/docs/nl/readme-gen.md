---
description: Genereer een uitgebreide README.md voor het huidige project
argument-hint: "[output-path]"
---
Analyseer dit project en genereer een production-grade README.md.

Stappen:
1. Scan de repo-structuur: lees package.json / pyproject.toml / Cargo.toml / go.mod of equivalent om taal, framework en afhankelijkheden te bepalen.
2. Identificeer de entry point(s), build-systeem en test runner.
3. Lees bestaande README, CONTRIBUTING en docs/ bestanden voor context — duplieer niet, verbeter.
4. Inspecteer CI-configuratie (.github/workflows/, .gitlab-ci.yml, etc.) voor badges en werkstroomnamen.

Schrijf de README met deze secties (voeg alleen secties toe die relevant zijn — laat lege weg):

- **Projectnaam + één-zins tagline** — begin met waarde, niet tech stack.
- **Badges** — build status, coverage, licentie, versie (gebruik echte shield URLs als CI bestaat).
- **Overzicht** — 2–4 zinnen: welk probleem het oplost, voor wie het is, wat het onderscheidt.
- **Vereisten** — minimale runtime/compiler versies, OS-beperkingen.
- **Installatie** — exacte commando's, copy-pasteable. Dek alle ondersteunde package managers af indien van toepassing.
- **Snelstart** — de minimale code of commando om in minder dan 2 minuten een werkend resultaat te bereiken.
- **Gebruik** — belangrijke CLI-vlaggen, API-oppervlak of configuratieopties. Gebruik echte voorbeelden uit de codebase.
- **Configuratie** — omgevingsvariabelen, config-bestandsformaat, standaardwaarden. Verwijs naar werkelijke variabelenamen in code.
- **Architectuur** (als niet-triviaal) — één korte alinea of ASCII-diagram met belangrijke componenten.
- **Ontwikkeling** — hoe je klont, dev-deps installeert, tests uitvoert, lint en bouwt.
- **Bijdragen** — link naar CONTRIBUTING.md als die bestaat; anders twee zinnen schrijven.
- **Licentie** — licentienaam en link naar LICENSE-bestand.

Beperkingen:
- Elk code blok moet zijn taalafscheiding aangeven.
- Verzin geen functies of API's — documenteer alleen wat bestaat in de codebase.
- Schrijf voor een developer die dit project nog nooit heeft gezien.
- Gebruik ATX-koppen (##), niet onderlijningsstijl.
- Houd de toon direct en neutraal — geen marketingtaal.

Uitvoerpad: $ARGUMENTS (standaard: README.md in de repowortel).
Schrijf het bestand. Print de inhoud niet naar de terminal — bevestig alleen het geschreven pad.
