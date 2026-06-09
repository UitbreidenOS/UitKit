---
description: Genereer een productie-gereed Dockerfile voor het huidige project
argument-hint: "[language/runtime] [optional: base-image]"
---
Analyseer het huidige project en genereer een productie-gereed Dockerfile. Gebruik $ARGUMENTS om de doelprogrammeertaal/runtime en optionele basisafbeeldingsoverride af te leiden.

Stappen:
1. Inspecteer de projectwortel op pakketmanifesten (package.json, requirements.txt, go.mod, Cargo.toml, pom.xml, build.gradle, Gemfile, composer.json, enz.) om de stack automatisch te detecteren. Als $ARGUMENTS een taal of runtime biedt, geef daaraan de voorkeur.
2. Identificeer het toepassingsinvoerpunt en bouwstappen.
3. Kies de kleinste geschikte basisafbeelding (alpine, distroless, slim), tenzij $ARGUMENTS anders aangeeft.
4. Pas multi-stage build toe als er een compileer-/bouwstap is — scheid builder- en runtime-fasen.
5. Stel een niet-root USER in. Wijs expliciete numerieke UID toe (bijv. 1001) voor Kubernetes-compatibiliteit.
6. Kopieer alleen wat de runtime nodig heeft; sluit dev-afhankelijkheden, testfixtures en geheimen uit.
7. Stel WORKDIR, EXPOSE, ENV en ENTRYPOINT/CMD correct in.
8. Voeg een HEALTHCHECK-instructie toe met behulp van het waarschijnlijke health-eindpunt van de app of een eenvoudige procescontrole.
9. Zet alle basisafbeeldingslabels vast op een specifieke digest of versie — gebruik nooit `latest`.
10. Voeg inline-opmerkingen alleen toe waar de keuze niet voor de hand ligt (bijv. waarom een specifieke basisafbeelding of vlag is gekozen).
11. Voer een `.dockerignore`-bestand uit naast de Dockerfile dat het volgende uitsluit: `.git`, `node_modules`, `__pycache__`, testmappen, `.env*`, lokale bouwartefacten.

Na generering de gemaakte aannames opsommen (bijv. afgeleide poort, aangenomen invoerpunt) en alle handmatige stappen markeren die de ontwikkelaar moet voltooien (bijv. geheime injectie, build-arg-waarden).

Voeg geen placeholder-ARGs of ENV-variabelen toe die geen doel dienen. Geef geen marketingcommentaar of verklarende proza buiten inline-codecommentaren uit.
