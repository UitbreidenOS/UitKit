---
description: Genereer een productie-klare Dockerfile voor het huidige project
argument-hint: "[taal/runtime] [optioneel: basis-image]"
---
Analyseer het huidige project en genereer een productie-klare Dockerfile. Gebruik $ARGUMENTS om de doeltaal/runtime en optionele basis-image override af te leiden.

Stappen:
1. Inspecteer de project-root op pakketmanifesten (package.json, requirements.txt, go.mod, Cargo.toml, pom.xml, build.gradle, Gemfile, composer.json, enz.) om de stack automatisch te detecteren. Geef voorrang aan de taal of runtime die door $ARGUMENTS wordt opgegeven.
2. Identificeer het toepassingsinvoerpunt en bouwstappen.
3. Kies de kleinste geschikte basis-image (alpine, distroless, slim) tenzij $ARGUMENTS iets anders aangeeft.
4. Pas multi-stage build toe als er een compile/bouw-stap is — scheid builder en runtime-fasen.
5. Stel een non-root USER in. Wijs een expliciet numerieke UID toe (bijv. 1001) voor Kubernetes-compatibiliteit.
6. Kopieer alleen wat de runtime nodig heeft; sluit dev-afhankelijkheden, testfixtures en geheimen uit.
7. Stel WORKDIR, EXPOSE, ENV en ENTRYPOINT/CMD correct in.
8. Voeg een HEALTHCHECK-instructie toe met behulp van het waarschijnlijke health-eindpunt van de app of een eenvoudige procescontrole.
9. Zet alle basis-image-tags vast op een specifieke digest of versie — gebruik nooit `latest`.
10. Voeg inline-opmerkingen alleen toe waar de keuze niet voor de hand liggend is (bijv. waarom een specifieke basis-image of vlag werd gekozen).
11. Voer een `.dockerignore`-bestand uit naast de Dockerfile dat het volgende uitsluit: `.git`, `node_modules`, `__pycache__`, testmappen, `.env*`, lokale bouwartefacten.

Na generatie, lijst alle aannames op (bijv. afgeleid poort, aangenomen invoerpunt) en markeer alle handmatige stappen die de ontwikkelaar moet voltooien (bijv. geheime injectie, build-arg waarden).

Voeg geen placeholder ARGs of ENV-variabelen toe die geen doel dienen. Geef geen marketingcommentaar of verklarende proza buiten inline codeopmerkingen uit.
