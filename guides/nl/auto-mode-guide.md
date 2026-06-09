# Claude Code Auto Mode — Diepgaande Referentie (maart 2026, Stabiel)

De stabiele release van Auto Mode van maart 2026 verving de eerdere op heuristieken gebaseerde machtigingsniveaus met een getrainde ML-classifier. Het praktische resultaat: 84% minder machtigingsvragen gemiddeld op codebases, met een hard-deny laag die immuun is voor configuratieoverschrijvingen. Deze gids behandelt hoe de classifier werkt, alle `defaultMode` opties, team-brede configuratiepatronen, het `bypassPermissions` versus `--auto` onderscheid, en een systematische aanpak voor het diagnosticeren van geblokkeerde acties.

---

## De ML-machtigingsclassifier

### Wat het is

Vóór maart 2026 gebruikte Auto Mode een statische gelaagde regelset — lees-operaties automatisch goedgekeurd, schrijven eenmaal vragen, destructieve operaties altijd vragen. Het probleem: die regelset had geen context. `git push` naar een persoonlijke fork in een sandbox triggerde dezelfde vraag als `git push --force origin main` op een gedeelde repository. Elke `npm run` riep bevestiging op ongeacht wat het script deed.

De classifier van maart 2026 vervangt statische niveaus door een model dat elke voorgestelde tooloproep tegen drie assen evalueert:

1. **Reversibiliteit** — kan deze actie ongedaan worden gemaakt zonder gegevensverlies?
2. **Blast radius** — hoeveel systemen of medewerkers worden getroffen als dit fout gaat?
3. **Autorisatiesignaal** — geeft de huidige sessiecontext (projectconfiguratie, eerdere goedkeuringen, gebruikersidentiteit) aan dat dit vooraf was geautoriseerd?

De classifier geeft één van drie labels uit: `auto`, `ask`, of `deny`. Het `deny` label heeft twee subtypen: `deny-soft` (kan worden opgeheven door expliciete gebruikersconfiguratie) en `deny-hard` (niet opheffen onder enige omstandigheid).

### Hoe het 84% vraagverlaging bereikt

De verlaging komt voornamelijk uit drie verbeteringen ten opzichte van het statische nieveausysteem:

**Contextueel git-bewustzijn.** De classifier weet of de doelremote de canonieke upstream-branch of een persoonlijke/fork-branch is, of `--force` aanwezig is, of de branch open PR's heeft, en of de repository een gedeelde teamrepo of een persoonlijke sandbox is. Een `git push` naar `origin feature/my-branch` in een solo project is geclassificeerd als `auto`; dezelfde opdracht naar `main` op een repo met branch-beveiliging is geclassificeerd als `ask`.

**Scriptfingerprinting.** Wanneer Claude `npm run <script>` voorstelt, leest de classifier de scriptdefinitie uit `package.json` voordat het de oproep labelt. Een `build` script dat alleen `tsc` of `vite build` uitvoert is `auto`. Een `deploy` script met `aws s3 sync` of `kubectl apply` is `ask`. Een `purge` script met `rm -rf dist/ && ...` is `deny-soft`.

**Sessiegeheugen.** Zodra een oproeppatroon binnen een sessie is goedgekeurd, zijn semantisch gelijkwaardige oproepen `auto` voor de rest van die sessie. Je keurt `git commit` eenmaal goed; volgende `git commit` oproepen triggeren niet opnieuw. Dit is beperkt tot de sessie — het blijft niet bestaan tussen sessies tenzij je het in `settings.json` codeert.

### Classifier-betrouwbaarheid en fallback

Wanneer de betrouwbaarheidsscore van de classifier onder 0,72 daalt (de standaarddrempel), valt deze terug naar `ask` ongeacht het voorspelde label. Je kunt dit zien in verbose-modus:

```bash
claude --auto --verbose "Refactor the auth module"
```

Een laagvertrouwensbeslissing verschijnt in de uitvoer als:

```
[classifier] git push origin feature/auth-refactor → ask (confidence: 0.61, fallback from: auto)
```

De drempel is configureerbaar maar niet aanbevolen om te wijzigen — het is de primaire guard tegen classifier-fouten die onbedoelde automatisering veroorzaken.

---

## `defaultMode` Opties

`defaultMode` is het veld op topniveau van `settings.json` dat bepaalt hoe Auto Mode zich gedraagt wanneer geen meer specifieke regel overeenkomt.

### De drie waarden

```json
{
  "defaultMode": "auto" | "ask" | "deny"
}
```

**`"ask"` (de standaard)**

Elke tooloproep die niet overeenkomt met een expliciete `allow` regel genereert een vraag. Dit is de standaard interactieve ervaring. De ML-classifier is nog steeds actief — het informeert de UI (bijvoorbeeld door "Allow" vooraf te selecteren voor hoog-vertrouwde veilige oproepen) maar onderdrukt de vraag niet.

**`"auto"`**

Tooloproepen geclassificeerd als `auto` door de ML-classifier gaan zonder vraag door. Oproepen geclassificeerd als `ask` genereren een vraag. Oproepen geclassificeerd als `deny-soft` worden geblokkeerd maar kunnen worden ontgrendeld via expliciete `allow` regels. Oproepen geclassificeerd als `deny-hard` worden geblokkeerd ongeacht enige configuratie.

Dit is de modus bedoeld voor ontwikkelaarsworkstations die uitgebreide sessies uitvoeren.

**`"deny"`**

Alleen tooloproepen bedekt door expliciete `allow` regels in `settings.json` gaan door. Alles anders wordt geblokkeerd. Dit is de juiste modus voor beperkte agents — CI-pijplijnen, productienaburige automatisering, beperkte contractorinterventions.

### Instellen per bereik

`defaultMode` kan op drie bereiken worden ingesteld. Lagere bereiken overschrijven hogere:

| Bereik | Bestand | Typisch gebruik |
|---|---|---|
| Globaal | `~/.claude/settings.json` | Persoonlijke standaard van ontwikkelaar |
| Project | `.claude/settings.json` | Gedeelde teambasis |
| Lokaal | `.claude/settings.local.json` | Per-ontwikkelaars override, gitignored |

```json
// ~/.claude/settings.json — persoonlijke standaard: auto voor alle projecten
{
  "defaultMode": "auto"
}
```

```json
// .claude/settings.json — project override: vraag op deze gedeelde repo
{
  "defaultMode": "ask"
}
```

```json
// .claude/settings.local.json — ontwikkelaars override: auto zelfs op gedeelde repo
{
  "defaultMode": "auto"
}
```

Een ontwikkelaar kan hun wereldwijde standaard op `"auto"` instellen terwijl het project `"ask"` afdwingt, en hun `settings.local.json` terugopta naar `"auto"` voor hun workstation. Dit is het aanbevolen teampatroon.

---

## Auto Mode configureren voor teams

### De gelaagde configuratiestrategie

Voor een team van welke grootte dan ook, is de aanbevolen aanpak:

1. **Project `.claude/settings.json`** definieert de veilige basislijnjn — typisch `"ask"` met expliciete `allow` regels voor de operaties die elke ontwikkelaar constant uitvoert (lezen, zoeken, testen).
2. **Ontwikkelaar `~/.claude/settings.json`** stelt persoonlijke voorkeur in — de meeste ontwikkelaars stellen `"auto"` hier in.
3. **Ontwikkelaar `.claude/settings.local.json`** behandelt project-specifieke overrides — nuttig wanneer een ontwikkelaar `"auto"` nodig heeft op een project dat `"ask"` voorschrijft.

Dit geeft teams controleerbaarheid (de gedeelde config is ingecheckt) zonder individuele ontwikkelaarsworkflow te beperken.

### Configuratie baselineteam

Een redelijk startpunt voor een TypeScript/Node.js project:

```json
// .claude/settings.json
{
  "defaultMode": "ask",
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(git status)",
      "Bash(git log*)",
      "Bash(git diff*)",
      "Bash(git show*)",
      "Bash(npm run lint)",
      "Bash(npm run test*)",
      "Bash(npm run typecheck)",
      "Bash(npm run build)",
      "Bash(tsc*)",
      "Bash(find . *)",
      "Bash(ls*)"
    ],
    "deny": [
      "Bash(git push --force*)",
      "Bash(git push origin main*)",
      "Bash(git push origin master*)",
      "Bash(npm publish*)",
      "Bash(rm -rf*)",
      "Bash(* | sudo *)",
      "Bash(sudo *)"
    ]
  }
}
```

Deze configuratie betekent: met `defaultMode: "ask"`, vraagt Claude voor het meeste, maar de vermelde lees- en testoperaties onderbreken nooit de flow, en de vermelde destructieve operaties worden hard geweigerd op projectniveau ongeacht de persoonlijke instellingen van de ontwikkelaar.

### CI/CD-configuratie

In CI, gebruik `"deny"` als standaard en zet precies op wat de pijplijn nodig heeft:

```json
// .claude/settings.ci.json (pas via --config flag door)
{
  "defaultMode": "deny",
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(npm ci)",
      "Bash(npm run build)",
      "Bash(npm run test)",
      "Bash(npm run lint)",
      "Bash(git status)",
      "Bash(git diff*)",
      "Write(dist/*)",
      "Write(.claude/tasks.jsonl)"
    ]
  }
}
```

```bash
# In CI
claude --config .claude/settings.ci.json --dangerously-skip-permissions \
  "Work through .claude/tasks.jsonl and run the test suite"
```

`--dangerously-skip-permissions` in deze context is veilig: de `"deny"` standaard en expliciete allowlist betekenen dat de enige operaties die Claude kan uitvoeren de operaties in de `allow` array zijn. De vlag verwijdert gewoon de UI-vraaglaag — het machtigingsmodel wordt nog steeds afgedwongen door de config.

### Onboarden van nieuwe teamleden

Neem het volgende op in je project README of onboarding docs:

```bash
# Enable auto mode globally (recommended for all developers)
# Add to ~/.claude/settings.json:
{
  "defaultMode": "auto"
}

# The project .claude/settings.json enforces safe baselines automatically.
# Your global "auto" setting is scoped down by the project config.
# To further override for this project only, create (gitignored):
touch .claude/settings.local.json
```

Een veelgebruikte onboarding-fout: `defaultMode: "auto"` instellen in de gedeelde `.claude/settings.json` van het project. Dit forceert elke ontwikkelaar in auto-modus op CI en in contexten waar een mens misschien niet kijkt. Houd de gedeelde config voorzichtig.

---

## Hard Deny-regels

### Wat Hard Deny betekent

`deny-hard` labels van de ML-classifier kunnen niet worden opgeheven door enige `allow` regel in enige `settings.json` op enig bereik. Ze kunnen niet worden omzeild met `--dangerously-skip-permissions`. Ze kunnen niet worden ontgrendeld met `bypassPermissions`. Ze worden afgedwongen in het Claude Code-binair zelf, niet in configuratie.

De stabiele release van maart 2026 werd met de volgende hard deny-set geleverd:

| Patroon | Reden |
|---|---|
| `Bash(* --no-verify *)` op `git commit` of `git push` | Omzeilt pre-commit en pre-push hooks, die beveiligingscontroles zijn |
| `Bash(rm -rf /)`, `Bash(rm -rf /*)` | Bestandssysteemvernietiging |
| `Bash(dd if=* of=/dev/*)` | Raw schijfschrijvingen |
| `Bash(mkfs*)` | Bestandssysteemcreatie (destructief voor bestaande gegevens) |
| `Bash(chmod -R 777 *)` op systeempaden | Privilege-escalatie |
| Elke opdracht die `/etc/sudoers` of `/etc/passwd` wijzigt | Privilege-escalatie |
| `Bash(curl * | bash)`, `Bash(wget * | bash)` | Externe codeuitvoering via pijp |
| `Bash(python -c "import os; os.system*")` en gelijkaardige eval-ketens | Sandbox-ontsnappingspatronen |

### Soft Deny versus Hard Deny in de praktijk

Wanneer een `deny-soft` oproep wordt geblokkeerd, bevat de uitvoer van Claude het label en het pad om het te ontgrendelen:

```
Action blocked: Bash(rm -rf dist/)
Classification: deny-soft
To allow: add "Bash(rm -rf dist/)" to permissions.allow in .claude/settings.json
```

Wanneer een `deny-hard` oproep wordt geblokkeerd:

```
Action blocked: Bash(git commit --no-verify)
Classification: deny-hard
This action cannot be enabled via configuration. It is blocked at the binary level.
Reason: bypasses pre-commit hooks (security control)
```

Als je een hard deny tegenkomt die een legitiem use case blokkeert (bijvoorbeeld `--no-verify` tijdens een opzettelijke hook-bypass in een gecontroleerd script), moet je die opdracht zelf in de terminal uitvoeren in plaats van het aan Claude over te laten. Claude zal het niet uitvoeren onder enige configuratie.

### Hard Deny-labels identificeren voordat je uitvoert

Gebruik `--dry-run` om de labels van de classifier voor elke voorgestelde tooloproep vóór uitvoering te zien:

```bash
claude --auto --dry-run "Clean up the build artifacts and push to the release branch"
```

Uitvoer bevat een per-call breakdown:

```
[dry-run] Bash(rm -rf dist/)         → deny-soft  (confidence: 0.97)
[dry-run] Bash(git push origin main) → ask        (confidence: 0.89)
[dry-run] Read(package.json)         → auto        (confidence: 0.99)
```

Dit laat je je taakprompt of `settings.json` aanpassen voordat je tokens aan een sessie die zal stagneren.

---

## `bypassPermissions` versus `--auto`

Dit is het meest verkeerd begrepen onderscheid in Auto Mode.

### Wat elk doet

**`--auto` (of `defaultMode: "auto"`)**

Vertelt de classifier om vragen voor oproepen die het labelt als `auto` te onderdrukken. Het machtigingsmodel wordt nog steeds uitgevoerd. Oproepen gelabeld als `ask` vragen nog steeds. Oproepen gelabeld als `deny-soft` worden nog steeds geblokkeerd (tenzij je een expliciete `allow` regel hebt). Oproepen gelabeld als `deny-hard` worden altijd geblokkeerd.

Auto-modus is een UX-optimalisatie. Het verwijdert wrijving voor operaties waar de classifier zeker van is. Het veiligheidsnet is intact.

**`bypassPermissions: true` / `--dangerously-skip-permissions`**

Schakelt de UI-vraaglaag volledig uit. Claude voert alle tooloproepen zonder pauze uit. Echter — en dit is het kritieke onderscheid — `deny-hard` regels worden nog steeds afgedwongen. Het verschil is dat `deny-soft` blokkades ook worden omzeild.

`bypassPermissions` is een CI/sandbox vlag. Het veronderstelt dat je je veiligheidsbeperkingen volledig in `deny` regels hebt gecodeerd en de hard deny-set. Als je dit niet correct hebt gedaan, kan Claude destructieve operaties zonder enige bevestiging uitvoeren.

### Het juiste mentale model

```
User prompt
    │
    ▼
ML Classifier
    │ auto ──────────────────────────────────────────── execute (no prompt)
    │ ask  ──── [bypassPermissions?] ──── yes ────────── execute (no prompt)
    │            │                                        │
    │            no                                       │
    │            │                                        │
    │            ▼                                        │
    │         prompt user ──── approved ──────────────── execute
    │ deny-soft ── [explicit allow rule?] ── yes ──────── execute (no prompt)
    │               │                                     │
    │               no                                    │
    │               ▼                                     │
    │            blocked (overridable via config)         │
    │ deny-hard ─────────────────────────────────────────── always blocked
```

### Wanneer elk te gebruiken

Gebruik `--auto` (of `defaultMode: "auto"`) wanneer:
- Een mens beschikbaar is om op occasionele `ask` vragen te reageren
- Je smoothere flow wilt zonder het veiligheidsnet op te offeren
- Actief op een ontwikkelaarsworkstation

Gebruik `--dangerously-skip-permissions` wanneer:
- Actief in een sandboxed CI-omgeving met een vooraf geconfigureerde `deny` lijst
- De omgeving is wegwerpbaar (container, VM, kortstondig werkgebied)
- Je hebt geverifieerd dat de `settings.json` `deny` regels alle destructieve operaties dekken
- Geen mens kijkt toe en je hebt volledig niet-interactieve uitvoering nodig

Gebruik nooit `--dangerously-skip-permissions` op een ontwikkelaarsworkstation zonder een vergrendelde `deny` lijst. De combinatie van `defaultMode: "auto"` en `--dangerously-skip-permissions` zonder expliciete `deny` regels is in feite geen machtigingsmodel.

### Praktisch voorbeeld: het onderscheid doet ertoe

```bash
# This session will pause at "git push origin main" and wait for approval
claude --auto "Implement the feature from TICKET-442 and push when tests pass"

# This session will NOT pause — it will push to main without confirmation
# Safe only if .claude/settings.json denies "Bash(git push origin main)"
claude --dangerously-skip-permissions "Implement the feature from TICKET-442 and push when tests pass"
```

Voor de meeste ontwikkelaarsworkflows is `--auto` de juiste keuze. `--dangerously-skip-permissions` is voor pijplijnen.

---

## Geblokkeerde acties oplossen

### Stap 1: Identificeer de classificatie

Voer uit met `--verbose` om de classifier-uitvoer voor de geblokkeerde oproep te zien:

```bash
claude --auto --verbose "Run the deployment script"
```

Zoek naar regels zoals:

```
[classifier] Bash(./scripts/deploy.sh) → deny-soft (confidence: 0.94)
[classifier] reason: script contains 'kubectl apply' — blast radius: cluster
```

Als de uitvoer geen classifier-regels bevat, controleer dat `--verbose` actief is en dat de blokkade plaatsvindt op de machtigingslaag (niet een runtime-fout).

### Stap 2: Controleer op scriptfingerprinting-misclassificatie

De classifier leest scriptinhoud uit `package.json` en veelgebruikte scriptbestanden, maar kan misclassificeren als:

- Het script is een wrapper die een ander script dynamisch aanroept
- Het scriptpad wordt bij runtime geconstrueerd (bijvoorbeeld `bash ${SCRIPT_DIR}/run.sh`)
- Het scriptbestand bevindt zich buiten de projectwortel

Om te diagnosticeren: voer `claude --auto --dry-run` uit en inspecteer de betrouwbaarheidsscore. Lage vertrouwen (< 0,72) triggert een fallback naar `ask` of `deny-soft`. Als een script is misclassificeerd, voeg een expliciete `allow` regel in `settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(./scripts/deploy-staging.sh)"
    ]
  }
}
```

Opmerking: de allow-regel moet exact overeenkomen met de opdrachtreeks die Claude zal produceren. Gebruik `--dry-run` om de exacte reeks te zien voordat je de regel schrijft.

### Stap 3: Onderscheid soft deny van hard deny

De uitvoer van Claude geeft expliciet aan of een blokkade soft of hard is. Als soft, geeft de uitvoer je de exacte `allow` regel om toe te voegen. Als hard, helpt geen configuratiewijziging — je moet de opdracht zelf uitvoeren.

Veelgebruikte misidentificatie: ontwikkelaars nemen aan dat `--force` commits hard-verweigerd zijn. Ze zijn het niet. `git commit --amend` is `deny-soft`. `git commit --no-verify` is `deny-hard`. Het onderscheid is: `--amend` herschrijft geschiedenis (omkeerbaar met reflog), terwijl `--no-verify` veiligheidshooks omzeilt (de bypass zelf is het probleem, niet de commit).

### Stap 4: Controleer bereikvoorgangslijst voor instellingen

Een veelgebruikt probleem: een ontwikkelaar voegt een `allow` regel toe aan `settings.local.json`, maar het project `settings.json` heeft een `deny` regel voor hetzelfde patroon. `deny` regels in bestanden met lager bereik overschrijven niet `deny` regels in hogere bereiken — maar `allow` regels op enig bereik kunnen `deny-soft` regels van hogere bereiken overschrijven tenzij de projectconfig `forcePermissions` gebruikt.

Controleer effectieve config:

```bash
claude --print-config
```

Uitvoer toont de samengevoegde machtigingsset met bronnoteringen:

```
permissions.allow:
  "Read"                          [global]
  "Bash(npm run test)"            [project]
  "Bash(./scripts/deploy.sh)"     [local]

permissions.deny:
  "Bash(git push --force*)"       [project] [forced]
  "Bash(rm -rf*)"                 [project] [forced]
```

Regels gemarkeerd `[forced]` kunnen niet worden opgeheven door lagere bereik `allow` regels. De projectbeheerder stelt deze in met de `forcePermissions` sleutel:

```json
// .claude/settings.json
{
  "forcePermissions": {
    "deny": [
      "Bash(git push --force*)",
      "Bash(npm publish*)"
    ]
  }
}
```

### Stap 5: Classifier-drempel afstemming

Als de classifier consistent `ask` vragen toepast op operaties die je veilig acht — en de betrouwbaarheidsscores schommelen rond 0,65–0,75 — kun je de drempel op eigen risico verlagen:

```json
// ~/.claude/settings.json
{
  "classifier": {
    "confidenceThreshold": 0.65
  }
}
```

Dit is een persoonlijke instelling, niet een teaminstelling. Plaats het niet in de projectconfig. Lagere drempels betekenen meer automatisering maar ook meer mogelijkheid voor misclassificeerde oproepen die stiekem worden uitgevoerd.

### Stap 6: Foutopsporing met sessietranscripten

Elke Claude Code-sessie schrijft een transcript naar `~/.claude/sessions/`. Voor een geblokkeerde of vastgelopen auto-mode-sessie, onderzoek het laatste transcript:

```bash
ls -t ~/.claude/sessions/ | head -1 | xargs -I{} cat ~/.claude/sessions/{}
```

Zoek naar `[blocked]` entries met de classifier-uitvoer eraan. Dit geeft je de exacte oproepstring, het label en de betrouwbaarheidsscore — de drie inputs die je nodig hebt om een gerichte `allow` regel te schrijven of een misclassificatie te diagnosticeren.

### Veelgebruikte patronen en fixes

| Symptoom | Waarschijnlijke oorzaak | Fix |
|---|---|---|
| `npm run deploy` vraagt altijd | Script geclassificeerd als deployment | Voeg expliciete `allow` regel voor het exacte script toe |
| `git push` naar persoonlijke fork vraagt | Classifier kan fork-status niet verifiëren | Voeg `allow` toe voor dat specifieke remote-patroon |
| Alles vraagt ondanks `defaultMode: "auto"` | Project `settings.json` heeft `defaultMode: "ask"` en `forcePermissions` | Controleer `--print-config` op geforceerde regels |
| Hard deny op een opdracht die je controleert | Opdracht past hard deny-patroon | Herstructureer de opdracht om het patroon te vermijden |
| Sessie stalt stil | `ask` vraag uitgegeven maar terminal niet bewakend | Gebruik `--max-turns` om uit te forceren; controleer transcript |
| Laag vertrouwen op alle oproepen | Project gebruikt ongebruikelijke tooling die de classifier nog niet heeft gezien | Voeg expliciete `allow` regels voor je toolchain toe |

---

## Referentie: Belangrijke instellingsvelden

```json
{
  "defaultMode": "auto",                    // auto | ask | deny
  "permissions": {
    "allow": ["..."],                       // patterns that always proceed
    "deny": ["..."]                         // patterns that are blocked (soft)
  },
  "forcePermissions": {
    "deny": ["..."]                         // deny rules that lower scopes cannot override
  },
  "classifier": {
    "confidenceThreshold": 0.72,            // below this → fallback to ask
    "verbose": false                        // log classifier decisions to console
  },
  "maxTurns": 200,                          // hard cap on turns per session
  "bypassPermissions": false               // set true only in sandboxed CI
}
```

---

## Snel startlijstje

- [ ] Stel `defaultMode: "auto"` in `~/.claude/settings.json` in voor lokale dev
- [ ] Voeg expliciete `deny` regels voor destructieve operaties toe in project `.claude/settings.json`
- [ ] Gebruik `forcePermissions.deny` voor regels die zelfs moeten gelden als ontwikkelaars overschrijven
- [ ] Test je config met `--dry-run` voordat je een lange autonome sessie uitvoert
- [ ] Gebruik `--dangerously-skip-permissions` alleen in CI met een vergrendelde `deny` lijst
- [ ] Monitor `--print-config` uitvoer bij het onboarden van nieuwe ontwikkelaars om bereikconflicten op te vangen
- [ ] Controleer `~/.claude/sessions/` transcripten na enige vastgelopen sessie

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
