---
name: release-manager
description: "Releasebeheer: semantische versionering, changelog-generatie uit conventionele commits, release-readinesschecklists, hotfix-procedures, rollback-plannen en release-branch-strategie"
---

# Vaardigheid Release Manager

## Wanneer activeren
- Planning en coördinatie van een softwarerelease
- Changelog genereren uit commit-geschiedenis
- Correct semantisch versiegebrek bepalen voor een release
- Release-readinesschecks uitvoeren voordat u implementeert
- Een hotfix- of noodrelease-proces beheren
- Release-branch-strategie instellen (Git Flow, trunk-based, enz.)

## Wanneer NIET gebruiken
- CI/CD pipeline-configuratie — use the cicd skill
- Setup van implementatie-infrastructuur — gebruik docker of kubernetes vaardigheden
- Incident-beheer na release — use the incident-commander agent
- npm publish specifiek — gebruik npm publish workflow

## Instructies

### Semantische versionering

```
Bepaal versiegebrek voor [release].

Huidige versie: [X.Y.Z]
Wijzigingen in deze release: [beschrijven of commit-lijst plakken]

Regels voor semantische versionering (semver.org):
MAJOR (X): breaking change — bestaande integraties zullen breken
  Voorbeelden: verwijderd API-eindpunt, gewijzigde functiehandtekening, verwijderde Node-versieondersteuning
  Wanneer: elke commit met "BREAKING CHANGE:" in body, of "!" na type (feat!: ...)

MINOR (Y): nieuwe functionaliteit, achterwaarts compatibel
  Voorbeelden: nieuw API-eindpunt, nieuwe optionele parameter, nieuwe functie achter vlag
  Wanneer: commits met type "feat:"

PATCH (Z): achterwaarts compatibele bugfix
  Voorbeelden: bug repareren, afhankelijkheid bijwerken (niet-breaking), foutbericht verbeteren
  Wanneer: commits met type "fix:", "perf:", "refactor:", "docs:" (zonder nieuwe features)

Conventionele commit-typen:
- feat: → MINOR gebrek
- fix: → PATCH gebrek
- feat!: of BREAKING CHANGE: → MAJOR gebrek
- chore:, docs:, style:, test:, refactor: → PATCH (of geen gebrek, uw keuze)
- perf: → PATCH gebrek

Gegeven uw wijzigingen: [invoer]
Aanbevolen versie: [X.Y.Z → A.B.C]
Redenering: [welke commits welk gebrek hebben getriggerd]
```

### Changelog-generatie

```
Genereer changelog voor [versierelease].

Versie: [X.Y.Z]
Datum: [JJJJ-MM-DD]
Commits sinds laatste release: [plak git log --oneline output of beschrijf wijzigingen]

Conventioneel commit-formaat: type(bereik): beschrijving
Voorbeeld: feat(auth): OAuth2 login-ondersteuning toevoegen

Changelog-formaat (Keep a Changelog-standaard):

## [X.Y.Z] — JJJJ-MM-DD

### Breaking Changes
- [beschrijving van breaking change + migratiepad]

### Toegevoegd
- [feat: commits → gebruikersgericht beschrijving]
- [feat(bereik): commits gegroepeerd per gebied]

### Gewijzigd
- [wijzigingen in bestaande functionaliteit]

### Opgelost
- [fix: commits → wat was kapot en werkt nu]

### Beveiliging
- [beveiligings-relevante wijzigingen — kwetsbaarheden gepatcht, machtigingen verscherpt]

### Afgeschaft
- [functies die in een toekomstige hoofdversie worden verwijderd]

### Verwijderd
- [verwijderde functies — breaking, gaat in Breaking Changes als verwijdering het break is]

Regels voor goede changelog-invoeren:
- Schrijf voor gebruikers, niet voor ontwikkelaars
- "OAuth2 login toevoegen" niet "feat(auth): implement oauth2 handler"
- Migratiestappen voor breaking changes opnemen
- Groeperen op impact, niet op bestand of systeem

Genereer de changelog voor mijn release uit de commits die ik lever.
```

### Release-readinesschecklist

```
Voer release-readinesschecks uit voor [versie].

Releasetype: [major / minor / patch / hotfix]
Doelomgeving: [staging → prod / direct naar prod / canary]
Implementatietijd: [gepland / on-call stand-by / alleen kantooruren]

Checkliste voordat release:

CODEKWALITEIT:
□ Alle CI-controles slagen (tests, lint, type check, security scan)
□ Code review voltooid voor alle wijzigingen in deze release
□ Geen open P1/P2-bugs die op deze release mikken die niet zijn opgelost
□ Geen onopgeloste merge-conflicten

TESTING:
□ Unit-tests geslaagd (coverage ≥ drempel)
□ Integratietests geslaagd
□ E2E-tests geslaagd op staging-omgeving
□ Handmatige smoke test van kritieke gebruikersroutes op staging
□ Prestaties: geen regressie versus baseline (controleer p99 latentie)
□ Databasemigraties getest op staging-DB van production-achtige grootte

COMMUNICATIE:
□ Release-opmerkingen opgesteld en goedgekeurd
□ Klantgericht changelog klaar (als wijzigingen gebruikers beïnvloeden)
□ Support-team ingelicht over wijzigingen
□ Verkoop/CS ingelicht als release nieuwe functies bevat om te demonstreren
□ Statuspagina: geplande onderhoudsvenster geplaatst

IMPLEMENTATIE:
□ Implementatie runbook gecontroleerd en actueel
□ Rollback-plan gedefinieerd en getest
□ Databasemigratie rollback bevestigd (of migratie is forward-only met gedocumenteerde reden)
□ Feature flags geconfigureerd voor geleidelijke rollout (indien van toepassing)
□ On-call ingenieur op de hoogte van implementatietiming
□ Monitoring dashboards open: foutfrequentie, p99 latentie, belangrijkste bedrijfsmetrics

POST-IMPLEMENTATIE VALIDATIE (eerste 30 min):
□ Health-eindpunt retourneert 200
□ Foutfrequentie binnen normaal bereik
□ Belangrijkste gebruikersstromen werken (smoke test)
□ Databasemigratie schoon voltooid
□ Geen ongewone alarmen afgaan

GOEDKEURING:
□ Engineering-lead goedkeuring
□ Product owner goedkeuring (voor minor/major releases)
□ [Optioneel] Beveiligingsevaluatie voor beveiligings-gevoelige wijzigingen

Genereer de checklist voor mijn releasetype en implementatiemodel.
```

### Hotfix-procedure

```
Voer hotfix uit voor [incident/bug].

Problemernstigheid: [P1 — production down / P2 — major degradation]
Probleem: [bug beschrijven en impact ervan]
Huidige productieversie: [X.Y.Z]
Hotfix-branch van: [main / release/X.Y.Z]

Hotfix-procedure:

STAP 1 — Hotfix-branch maken:
git checkout -b hotfix/X.Y.Z+1 main  # Branch van main (of huidige production tag)
# Indien Git Flow gebruikt: git flow hotfix start X.Y.Z+1

STAP 2 — Fix toepassen:
[Maak minimale wijziging om probleem op te lossen — geen opportunistisch opschonen]
[Schrijf test die bug reproduceert, verifieer dan dat fix het doorstaat]

STAP 3 — Versie bump:
Versie bumpen naar X.Y.Z+1 (PATCH)
CHANGELOG.md bijwerken met fix

STAP 4 — PR en review:
PR van hotfix/X.Y.Z+1 → main
Versnelde review: minimum 1 senior reviewer
CI moet slagen: geen uitzonderingen voor P1 hotfixes — als CI kapot is, fix CI eerst

STAP 5 — Samenvoegen en tag:
git tag -a vX.Y.Z+1 -m "Hotfix: [description]"
git push origin vX.Y.Z+1

STAP 6 — Implementeer:
Volg implementatie runbook met versnelde tijdlijn
Houd monitoring dashboards 30 minuten na implementatie open
Bevestig dat fix incident oplost voordat geresolved verklaard

STAP 7 — Terugport naar develop:
git checkout develop
git cherry-pick [hotfix commit SHA]
# Zorgt ervoor dat fix in volgende regular release is

STAP 8 — Na incident:
Update CHANGELOG.md op main en develop
Plan PIR voor P1 hotfixes (binnen 48 uur)

Hotfix-regels:
- Fix ALLEEN de gerapporteerde bug — geen andere wijzigingen in hotfix-branch
- Hotfix omzeilt normaal releaseproces maar NIET code review
- Hotfix verhoogt automatisch PATCH-versie

Schrijf hotfix-plan voor mijn specifieke bug.
```

### Release-strategie

```
Ontwerp release-branching-strategie voor [team].

Teamgrootte: [X ingenieurs]
Release-frequentie: [dagelijks / wekelijks / maandelijks]
Implementatiemodel: [continu / gecontroleerde releases / geplande vensters]
Huidig probleem: [te traag / te riskant / geen proces / merge-conflicten]

Vergelijking van strategieën:

TRUNK-BASED DEVELOPMENT (aanbevolen voor meeste teams):
- Iedereen commit dagelijks naar main
- Releases getagd van main op elk moment
- Feature flags verbergen onvolledigde functies
- Beste voor: CI/CD, kleine teams, frequente releases
- Voordelen: eenvoudig, snel, geen lang-bestaande branches
- Nadelen: vereist discipline + feature flag infrastructuur

GIT FLOW (voor geplande releases):
- main: production
- develop: integratietak
- feature/X: individuele functies → samenvoegen naar develop
- release/X.Y: releasevoorbereiding → samenvoegen naar main + develop
- hotfix/X: noodstopfixes → samenvoegen naar main + develop
- Beste voor: mobiele apps, on-prem software met releasecycli
- Nadelen: complex, merge-conflicten, traag

GITHUB FLOW (lichtgewicht):
- main: altijd inzetbaar
- feature/X: elk werk → PR → samenvoegen naar main → implementeer
- Beste voor: webservices die continu inzetten

Voor uw team-profiel:
[Aanbeveling van één strategie met motivering en setup-instructies]

Stel de aanbevolen strategie voor mijn team in met git-opdrachten en CI/CD-integratiepoints.
```

## Voorbeeld

**Gebruiker:** We brengen v2.0.0 van onze SaaS API uit. Het heeft breaking changes (3 verouderde eindpunten verwijderd). Hoe communiceer ik dit en voer ik de release uit?

**Claudes releaseplan:**

**Versie:** 2.0.0 (MAJOR bump — breaking change = verwijderde eindpunten)

**Changelog-invoer:**
```markdown
## [2.0.0] — 2026-05-20

### Breaking Changes
- Verouderde eindpunten verwijderd: `GET /api/v1/users/legacy`, `POST /api/v1/auth/old`, `DELETE /api/v1/items/purge`
  → **Migratie:** Gebruik respectievelijk `GET /api/v2/users`, `POST /api/v2/auth/login`, `DELETE /api/v2/items`.
  → Volledige migratiegids: docs.yourapi.com/migration/v1-to-v2

### Toegevoegd
- [andere toevoegingen]

### Opgelost
- [bugfixes]
```

**Communicatievolgorde:**
1. **4 weken eerder:** E-mail naar alle API-sleutelhouders — "Breaking changes komend in v2.0.0 op [datum]. Actie vereist."
2. **2 weken eerder:** Tweede herinnering + migratiegids link
3. **1 week eerder:** Laatste waarschuwing + aanbieding van 2-weken extensie voor klanten die dit aanvragen
4. **Release-dag:** Release-opmerkingen geplaatst, statuspaginanotitie, support-team ingelicht
5. **Na release:** Controleer op 400 fouten op verwijderde eindpunten — verwacht piek van trage migrateurs

**Release-readiness gates voor grote breaking:**
- [ ] Alle klanten die verouderde eindpunten gebruiken, ≥4 weken eerder ingelicht
- [ ] Migratiegids gepubliceerd en op nauwkeurigheid geverifieerd
- [ ] v1-eindpunten bewaard als 410 Gone (niet 404) gedurende 30 dagen — helpt klanten sneller debuggen
- [ ] Rollback-plan: kunt u de oude eindpunten opnieuw inschakelen als migration uptake te laag is?

---
