# CI/CD-regels

Pas deze toe wanneer u pipelineconfiguratie, implementatiescripts of releaseprocessen schrijft of beoordeelt.

## Pipelineontwerp

- Elke pipeline-run moet reproduceerbaar zijn: dezelfde invoer → dezelfde output, ongeacht wanneer of waar deze wordt uitgevoerd
- Versie-acties en basisafbeeldingen vastleggen op digests, niet op floating tags: `actions/checkout@v4` is acceptabel; `actions/checkout@latest` niet
- Fasen scheiden: lint → test → build → publish → deploy; sla nooit fasen over op de hoofdbranch
- Snel falen: voer eerst de goedkoopste, snelste controles uit om ontwikkelaars feedback in minder dan 2 minuten te geven
- Maak onafhankelijke jobs parallel; koppel jobs niet in een keten die geen echte afhankelijkheid hebben

## Testgates

- Samenvoegingen op `main`/`master` vereisen: alle tests geslaagd, lint schoon, geen nieuwe beveiligingsproblemen
- Dekking mag niet onder de geconfigureerde drempel dalen — dwing dit af als een pipelinegate, niet als een beleefdheidskontrolle
- Integratie- en end-to-end-testsuites worden op elke PR uitgevoerd; langdurige suites kunnen indien nodig nightly worden uitgevoerd
- Voeg nooit een PR samen die de testpipeline omzeilt, behalve in een gedocumenteerde noodtoestand met een vervolgticket

## Geheimen en omgeving

- Pipelinegeheimen bevinden zich in het secretarchief van het CI-platform — nooit in pipeline-YAML of gecommitteerde `.env`-bestanden
- Print nooit geheimen naar pipelinelogboeken; voeg `::add-mask::` (GitHub Actions) of equivalent toe voordat u deze gebruikt
- Gebruik afzonderlijke referentiële sets per doelomgeving; de staging-deployer kan production niet aanraken

## Bouwartifacten

- Bouw eenmaal, promoveer dezelfde artifact door omgevingen heen — bouw nooit opnieuw voor staging vs. production
- Tag containerafbeeldingen en bouwartifacten met de git-commit SHA, niet met een mutable tag als `latest`
- Sla artifacts op in een versioned registry (ECR, Artifact Registry, GitHub Packages) — niet als pipelinebijlagen
- Scan artifacts op beveiligingsproblemen voordat u deze naar production promoveert

## Implementatie

- Gebruik een implementatiestrategie die terugdraaien toestaat: blue/green, canary of rolling met een stap om terug te draaien
- Test de implementatie automatisch voordat u deze als succesvol markeert
- Databasemigraties en code-implementaties zijn afzonderlijke stappen — voer eerst achterwaarts-compatibele code in, migreer dan
- Implementatie naar production vereist expliciete goedkeuring of wordt bepaald door een tijdvenster — geen onopzettelijke pushes

## Onderhoud

- Houd pipelineconfiguratie DRY: extraheer gedeelde stappen in herbruikbare workflows of composite actions
- Elke pipelinestap heeft een naam waardoor het logboek leesbaar is zonder in de config in te graven
- Waarschuw het team wanneer pipelinefouten optreden — vertrouw niet op individuen die het dashboard controleren
- Controleer en update vastgelegde versies maandelijks; verouderde tooling is een beveiligingsrisico
