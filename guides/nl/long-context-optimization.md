# Long-Context Optimalisatie

Strategieën voor werkend effectief met Claude 200K–1M token context windows — hoe vermijd context rot, behoud kwaliteit schaal, en weet wanneer compact versus wanneer doorgaan.

Gids is companion naar [context-budget.md](context-budget.md), dekt general token accounting en mechanics compaction. Deze gids focus specifiek op 200K+ schaal: wat die window grootte betekent praktijk, waarom kwaliteit degraded goed voordat je limiet raakt, en hoe je je sessies en tooling structureer naar stay in de kwaliteit zone over lange workloads.

---

## Context window sizes in praktijk

| Model | Context window | Approximate woord count | Approximate pagina count |
|---|---|---|---|
| Claude Haiku 4.5 | 200K tokens | ~150.000 woorden | ~500 pagina's |
| Claude Sonnet 4.6 | 200K tokens (standaard) | ~150.000 woorden | ~500 pagina's |
| Claude Sonnet 4.6 | 1M tokens (extended) | ~750.000 woorden | ~2.500 pagina's |
| Claude Opus 4.7 | 200K tokens | ~150.000 woorden | ~500 pagina's |

**200K tokens in concreet:**

- 200K context window fit approximately volledige werken Shakespeare — twee keer voorbij
- Grote monorepo met 300 TypeScript bestanden 200 lijnen elk is ~60K tokens
- Enkel groot log bestand 10.000 lijnen is ruwweg 80–100K tokens
- Volle Claude Code sessie 50 turns van matig verbose tool gebruik averages 40–80K tokens

Getallen suggereren je hebt ruim kamer. Werkelijkheid is anders. 200K limiet is niet je operating plafond — het is cliff. Je effectieve plafond is ruwweg 60–70% van dat cijfer, en voor complexe taken dichter naar 40–50%.

---

## 1M context window (Sonnet 4.6 extended)

Sonnet 4.6 kan accessed met extended 1M token context window. Dit is niet standaard.

**Wanneer gebruiken:**
- Repository-breed analyse taken waar je houdt meerdere grote bestanden gelijktijdig
- Lange-loopend autonomous loops waar compaction zou discard kritieke intermediate staat
- Cross-file refactors waar 30+ bestanden moeten in context gelijktijdig voor correctheid
- Document analyse taken (juridisch, research, codebase archaeology) waar corpus werkelijk window vereist

**Wanneer niet gebruiken:**
- Algemeen development werk — standaard 200K model verwerkt meeste sessies zonder issue
- Kosten-gevoelige workflows — 1M window draagt premium pricing per token
- Taken waar extra capaciteit voord zou vul met noise in plaats van signaal

**Kosten en latentie implicaties:**

1M window affecteert pricing en response tijd. Op volledige context, first-token latentie verhoogt meetbaar. Cache schrijft — incurred op eerste turn sessie — scales lineair met context grootte. 200K-token sessie incurs 200K cache write tokens op turn één. 1M sessie costs 1M. Draai je 50 sessies dagelijks en 1M window gebruik onnodig, overhead compounds snel.

Rule van duim: gebruik standaard 200K model tenzij je hebt specifiek, concreet reden taak meer vereist. Meeste taken lijken 1M vereisen kunnen herstructureerd toward fit binnen 200K met juiste context hygiëne.

---

## Context rot: waarom kwaliteit degraded voordat limiet

Context rot beschrijft kwaliteit degradatie dat treedt op als context window vult — goed voordat harde limiet bereikt. Mechanisme is attention dilutie.

Claude verwerkt context via attention — mechanisme dat weighs relevantie elk token naar huide generatie. Als window groeit, signal-to-noise ratio context daalt. Belangrijk constraints set vroeg sessie compete met honderden duizenden tokens tool outputs, intermediate redenering, en bestand contents. Model's attention verdeelt over dit alles.

**Empirisch waargenomen degradatie curve:**

| Context fill level | Kwaliteit signature |
|---|---|
| 0–40% | Volledige kwaliteit; constraints en instructies betrouwbaar gevolgd |
| 40–60% | Kleine drift; vroege instructies soms gemist; kleine repetitie |
| 60–70% | Merkbare degradatie; key feiten begraven en retrieved inconsistent |
| 70–85% | Significant rot; besluiten contradictie vroeg sessie constraints |
| 85%+ | Onbetrouwbaar; effectief opereren op recente context alleen |

Dit zijn empirisch observaties, niet harde drempels. Werkelijk degradatie curve varies door taak type, context structuur, en hoe front-loaded versus gelijk verdeeld signaal.

---

## Warning signalen context rot

Kijk voor deze patronen. Enig één geïsoleerd kan ruis; twee of meer samen teken rot heeft geset.

**Repetitie:** Claude verklaart iets al genoemd twee pagina's terug, woord-voor-woord of bijna-woord-voor-woord. Dit meest gewoon vroeg signaal — model genereert van recente context zonder vorig derivatie terugherinnering.

**Constraint vergeten:** Je vastgesteld vroeg sessie project uses ESLint met strict instellingen, of specifieke API deprecated, of tests moet niet gebruik `describe.only`. Claude start schendend deze constraints. Instructie is nog in context maar is niet meer betrouwbaar bijgewoond.

**Inconsistent besluiten:** Je vastgesteld architectuur aanpak — zeg, alle database toegang via repository laag. Claude start schrijvend direct database aanroepen in service. Gevraagd verklaren, het produceert redenering contradictie vroeger besluiten zonder erkenning contradiction.

**Re-asking voor informatie:** Claude vraagt voor informatie het retrieved of je geleverd eerder sessie. Feit context; model retrieves niet.

**Vague responses op specifieke topics:** Vroeg sessie, Claude produced precies, specifiek antwoorden. Later dezelfde sessie, op soortgelijke vragen, responses worden hedged, generiek, of verwijs verkeerde codebase deel. Dit reflecteert flattened attention over groot context in plaats van gefocuste retrieval.

**Fix is niet altijd corrigeren:** Corrigeren in-sessie na rot sets in voegt meer tokens toe en compound problem. Juiste response compact of start fresh sessie.

---

## 7 optimalisatie strategieën

### 1. Front-loading: primacy en recency

Attention is niet uniform over context window. Claude betrouwbaar attendeert begin en eind context sterker dan midden — dit primacy en recency effect. Structuur je context exploit dit.

**Front-load kritieke constraints:**

```
# Goed sessie opening — constraints vastgesteld voordat enig tool gebruik
Je werken op payments service in deze monorepo.
Sleutel constraints voor deze sessie:
- Alle database aanroepen gaan door src/db/repositories/ — nooit direct naar Prisma
- PaymentService klasse moet stateless blijven — geen instance variabelen houden staat
- Error verwerking moet AppError klasse gebruiken van src/errors/
- Nooit wijzig migrations directory — schema wijzigingen zijn buiten bereik

Nu beginnen review huide PaymentService implementatie.
```

Openbegin sessie tool gebruik onmiddellijk — bestand reads, bash commando's — deze constraints worden geduwd omlaag. Door tijd context vult, zij begraven midden window.

**Herhaal kritieke constraints eind lange inputs:**

Voor zeer lange gebruiker berichten of structured prompts, restate enkel meest belangrijk constraint eind:

```
[... 500 tokens context ...]

Herinnering: alle database toegang moet gaan via repository laag.
```

Recency signaal zorgt constraint is in Claude's onmiddellijke attention wanneer het begint genereren.

**Niet front-load ruis:** Pas logica invers toe. Verbose achtergrond informatie niet decision-relevant moet niet occupation primacy slot. Leid met constraints en objectives, niet project historie.

---

### 2. Gestructureerde samenvatting: compact timing

`/compact` commando is gedekt detail in [context-budget.md](context-budget.md). Timing vraag specifiek lange-context sessies.

**Compact op 40–50% vul, niet 80%.**

Op 50% vul, compaction samenvatten heeft hoog-kwaliteit signaal naar werk van. Conversatie lang genoeg meaningful besluiten gezet, maar kort genoeg samenvatten nog onderscheid signaal van ruis. Resulterende samenvatting accurate en compleet.

Op 80% vul, samenvatten werkend met context al partially degraded. Samenvatting het produceert reflectie degraded staat — belangrijk vroeg besluiten kunnen underrepresented of ontbreken.

**Gebruik gerichte compaction:**

```
/compact focus op auth refactor — behoud besluit RSA256 gebruiken en JWT vorm, drop debug context voor expired token issue
```

Zonder directive, samenvatten maakt autonome keuzes over wat belang. Specifieke directive ankers het je huide werkend thread.

**Compact tussen major fasen, niet mid-taak:**

Compact na voltooiing gebonden sub-taak, voordat volgende start. Compacting mid-taak riskants verliezen intermediate staat je nodig doorgaan. Patroon:

```
Fase 1: exploration en analyse → compleet → /compact "behoud bevindingen op payment module architectuur"
Fase 2: implementatie → ... → compleet → /compact "behoud alle wijzigingen gemaakt, bestand paden, design besluiten"
Fase 3: testen → ...
```

---

### 3. Targeted reads: offset en limit

Elk bestand read enter context volledige tenzij je constraint. Voor lange-context sessies, dit primair bron avoidable bloat.

**Gebruik `offset` en `limit` op Read tool:**

```
# 2.000-regel bestand: ~20K tokens — leest volledig bestand
Read /path/to/service.ts

# Targeted lees regels 400–450: ~500 tokens
Read /path/to/service.ts, offset: 400, limit: 50
```

**Grep voordat lees.** Gebruik Grep lokaliseren relevante sectie, vervolgens lees alleen sectie:

```bash
# Stap 1: vind relevante functie
grep -n "processPayment" /path/to/payments.service.ts

# Output: regel 847
# Stap 2: lees alleen sectie
Read /path/to/payments.service.ts, offset: 840, limit: 60
```

Dit patroon — grep eerst, targeted lees tweede — consistent reduce context consumptie 80–95% navigatie taken.

**Samenvat voordat groot bestanden lees:**

Voor zeer groot bestanden waar je nodig hoog-level begrip voordat besluit lees:

```bash
wc -l /path/to/large-file.ts && grep -n "^export\|^class\|^function\|^const.*=.*function" /path/to/large-file.ts | head -40
```

Dit geeft bestand exports en structuur ~40 lijnen (~400 tokens) in plaats lezen 2.000+ lijnen volledig begrijpen.

---

### 4. Bash output trimming

Uncontrolled Bash output meest gewoon cause sudden context vul in lange sessies. Enkel `npm install`, `docker build`, of `pytest -v` kunt 5–20K tokens voeg één tool aanroep.

**Pas deze patronen systematisch:**

```bash
# Limiet log volume
docker logs my-container --tail 50
npm test 2>&1 | tail -30
./run-suite.sh | grep -E "PASS|FAIL|ERROR|WARN" | head -50

# Suppress ruis bij bron
curl -s https://api.example.com/v1/status         # -s suppress progressie
rsync -a --quiet src/ dst/
npm install --silent

# Redirect stderr wanneer niet relevant
make build 2>/dev/null
python setup.py install 2>/dev/null

# Extract signaal voordat context enter
git log --oneline -20
git diff --stat HEAD~5 HEAD
find . -name "*.ts" -newer src/auth.ts | head -20
```

**Pipe-en-filter als default discipline:**

```bash
# In plaats van: node scripts/analyze.js
# Gebruik: node scripts/analyze.js | grep -v "^DEBUG:" | head -100
```

Exact regel count materie minder dan habit. Enig Bash commando met potentially unbounded output moeten hebben truncatie pipe voordat context enter.

---

### 5. Subagent isolatie voor grote lees taken

Wanneer taak vereist lees veel bestanden — codebase survey, afhankelijkheid analyse, security scan over 50 modules — doen het in main context vult venster intermediate data nuttig alleen voor producering conclusie.

**Subagent patroon:**

```
# Wat NIET doen (main context reads 40 bestanden):
"Lees alle bestanden in src/auth/ en zeg mij wat zij doen"
[Claude leest 40 bestanden in main context — ~80K tokens]
"Nu samenvat architectuur"

# Wat doen (subagent reads, terugkeer samenvatting):
Spawn subagent met:
  Taak: Survey alle bestanden in src/auth/.
  Terugkeer: Structured samenvatting bevattende (1) wat elk bestand exports,
  (2) afhankelijkheid grafiek hun tussen, (3) enig bestanden houden
  veiligheid-gevoelig logica zoals token validatie of permission checks.
  Niet terugkeer bestand contents — terugkeer structured analyse alleen.

[Subagent leest 40 bestanden in zijn eigen context — main context ontvangt ~1K tokens gestructureerd bevindingen]
```

Main context ontvangt conclusies, niet ruwe intermediate data. Subagent context discard na taak.

**Wanneer subagent isolatie gebruiken:**
- Taak betreft lezen meer dan 10 bestanden discovery doelen
- Intermediate lees outputs (bestand contents) niet nodig opnieuw na conclusie
- Taak bounded en heeft duidelijk deliverable formaat

**Wanneer niet gebruiken:**
- Je zult directe edit bestanden survey — parent context nodig zien hun
- Taak eenvoudig genoeg overhead spawning niet waard

---

### 6. CLAUDE.md scoping

`CLAUDE.md` laadt elke sessie start en occupation primacy — het eerste content in context. Elk token het vaste kosten betaald elke sessie.

**Regels lange-context sessies:**

Behoud project `CLAUDE.md` onder 2.000 tokens. Dit niet aesthetic voorkeur — het budget beslissing. 3.000-token `CLAUDE.md` kost extra 1.000 tokens primacy-positie context elke enige sessie je loopt. Over 50 sessies per dag, dit 50.000 extra tokens dagelijks, compounding in cache write kosten.

**Wat behoren CLAUDE.md (blijft voor altijd):**
- Project beschrijving: 3–5 zinnen
- Sleutel directories hun doelen
- Non-duidelijk conventie Claude moeten volgen
- Bouw, test, lint commando's
- Dingen wijzig niet zonder expliciete instructie

**Wat niet behoren (load demand):**
- API reference documentatie — load via targeted Read wanneer werkend in dat gebied
- Historische besluiten — behoud apart `decisions.md`, load alleen werkend relevante domein
- Lange voorbeelden — verwijs bestand pad, lees demand
- Regels voor subsystems je niet werkend heden

**Domain-scoped CLAUDE.md bestanden:**

Voor grote monorepo's, gebruik directory-niveau `CLAUDE.md` bestanden:

```
/repo/
  CLAUDE.md                    # global conventie — onder 1.000 tokens
  src/
    payments/
      CLAUDE.md                # payments-specifieke regels — laadt alleen Claude in directory
    auth/
      CLAUDE.md                # auth-specifieke regels
```

Claude leest directory-niveau `CLAUDE.md` wanneer navigeert in die directory. Dit betekent context laadt incrementeel werk beweegt over domains, in plaats laden alle subsystem regels sessie start.

---

### 7. llms.txt: externe documentatie zonder plakt

Wanneer taak vereist externe documentatie — bibliotheek API, framework configuratie referentie, service integratie gids — standaard instinct plak relevante secties conversatie. Voor lange-context sessies, dit duur en vaak onnodig.

**Controleer llms.txt eerst:**

```bash
curl -s https://docs.anthropic.com/llms.txt | head -50
curl -s https://docs.example.com/llms.txt | head -50
```

`llms.txt` is gecomprimeerd documentatie formaat ontwerp voor LLM consumptie. Biblioteken en frameworks publish het bieden 5–10x kleinere representaties hun documentatie vergeleken gelijk docs-site content. Zij bestaan, gebruik als primaire referentie.

**Fetch alleen specifieke pagina je nodig:**

```bash
# In plaats van: plak volledige React hooks documentatie
# Gebruik: fetch specifieke hook pagina
curl -s "https://react.dev/reference/react/useCallback" | \
  python3 -c "import sys; from html.parser import HTMLParser; \
  class P(HTMLParser):
    def handle_data(self, d): print(d, end='')
  p = P(); p.feed(sys.stdin.read())" | \
  grep -v "^$" | head -100
```

Of fetch via WebFetch tool met targeted URL in plaats scrapen meerdere linked pagina's.

**Verwijs, niet plak:**

Voor good-known API's Claude al weet (standaard bibliotheek functie's, major framework API's), verwijs concept en laat Claude redeneren van training in plaats plakt documentatie. Plak documentatie alleen enig specifiek, ongewoon configuratie of known knowledge cutoff issue.

---

## PreCompact hook

Wanneer `/compact` fires — handmatig of automatisch — Claude genereren samenvatting conversatie van zijn huide context. `PreCompact` hook fires voordat samenvatting gegenereerd, geven venster injecteer gestructureerde staat samenvatten zal incorporeren.

Dit correct patroon lange-context sessies waar verliezen operationeel context na compaction zou force re-etablishing werk.

**settings.json:**

```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/pre-compact.sh",
            "timeout": 15
          }
        ]
      }
    ]
  }
}
```

**.claude/hooks/pre-compact.sh:**

```bash
#!/usr/bin/env bash
# Fires voorafgaand /compact. Injecteer gestructureerde sessie staat compaction context.

set -euo pipefail

branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
recent_commits=$(git log -5 --oneline 2>/dev/null || echo "unavailable")
staged=$(git diff --cached --name-only 2>/dev/null | head -20 || echo "none")
unstaged=$(git diff --name-only 2>/dev/null | head -20 || echo "none")
open_files=$(git status --short 2>/dev/null | head -20 || echo "none")

# Lees open taak lijst als je behoud één
tasks_file="${CLAUDE_PROJECT_DIR}/.claude/tasks.md"
tasks=""
if [ -f "$tasks_file" ]; then
  tasks=$(tail -30 "$tasks_file")
fi

cat <<EOF
=== PRE-COMPACT STAAT INJECTIE ===
Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
Branch: ${branch}

Recent commits:
${recent_commits}

Staged bestanden:
${staged}

Unstaged bestanden:
${unstaged}

Werkend tree staat:
${open_files}
EOF

if [ -n "$tasks" ]; then
cat <<EOF

Open taken (van .claude/tasks.md):
${tasks}
EOF
fi

echo "=== EINDE STAAT INJECTIE ==="
```

Injecteerde content aanwezig context wanneer compaction samenvatting gegenereerd. Samenvatting Claude schrijft zal incorporeer branch, commit geschiedenis, en bestand staat — dus post-compaction, deze informatie beschikbaar zonder nodig je re-etablish.

**Uitbereiding dit patroon:**

Voeg enig gestructureerde staat dat is duur naar re-derive na compaction:
- Architectuur besluiten gedaan sessie (lees van besluiten log)
- Output major analyse fase (schrijf bestand mid-sessie, injecteer compact tijd)
- Huide taak wachtrij als je behoud één

---

## Context gebruik traceren met `/usage`

`/usage` commando toont per-categorie token breakdown huide sessie.

**Laat het sessie start:**

```
/usage
```

Sessie-start baseline toont je vaste overhead voordat enig werk: system prompt, CLAUDE.md, MCP tool definities. Getal overschrijdt 30–40K tokens, je hebt configuratie probleem — veel MCP servers, overgegroeide CLAUDE.md, of beide. Fixeert voordat sessie groeit.

**Categorieën getoond:**

| Categorie | Wat het weerspiegelt | Actie als hoog |
|---|---|---|
| System prompt | Claude Code built-ins + CLAUDE.md | Trim CLAUDE.md; disable unused MCP servers |
| MCP tool definities | Enig entry per tool over alle enabled servers | Disable servers je niet gebruiken deze sessie |
| Conversatie geschiedenis | Accumulated turns — beide gebruiker en assistant | Compact benaderend 40% |
| Tool resultaten | Bestand reads, bash outputs, MCP responses | Review recente tool aanroepen verbose outputs |
| Agent sub-calls | Elk gespawnd subagent context contributie | Zeker subagents terugkeer samenvatting's, niet ruw tool geschiedenis |

**Gebruik het benchmark fasen:**

Laat `/usage` start elke major fase — na exploratie, na planning, na implementatie begint. Dit geeft consumptie kaart: hoe veel tokens elke fase kost. Op tweede derde soortgelijk project, kunt predict waar je 40% drempel raakt en plan compaction proactief.

---

## Autonomous loop patronen

Lange-loopend autonomous sessie's accumulate context anders dan interactieve sessies. Elk loop iteratie voegt hetzelfde window tenzij sessie gestructureerd voorkomen.

**Schrijf staat naar disk tussen iteraties:**

```bash
# Eind elke loop iteratie, schrijf gestructureerde staat
cat > "${CLAUDE_PROJECT_DIR}/.claude/loop-state.json" <<'EOF_TEMPLATE'
{
  "iteration": ${ITERATION},
  "completed": ${COMPLETED_JSON},
  "current_task": "${CURRENT_TASK}",
  "blockers": ${BLOCKERS_JSON},
  "next": "${NEXT_TASK}",
  "decisions": ${DECISIONS_JSON}
}
EOF_TEMPLATE
```

**Lees staat start elke iteratie:**

```bash
# Start volgende iteratie — lees staat bestand in plaats dragen context
state=$(cat "${CLAUDE_PROJECT_DIR}/.claude/loop-state.json")
echo "Resuming van staat: $state"
```

Sessie draagt alleen staat bestand's contents als zijn startend context volgende iteratie. Alle intermediate tool geschiedenis vorig iteraties afwezig.

**Gebruik ScheduleWakeup voor hard context resets:**

Wanneer loop iteratie neemt significant wall tijd, gebruik `ScheduleWakeup` beëindigen huide context window en hervat in frische één volgende tick. Trade-off cache miss (vertraging van paar minuten of meer voor context initialisering), acceptabel wanneer elke iteratie neemt meer paar minuten en accumulated context overhead niet waard dragen.

**SessionStart + Stop hooks voor persistent staat:**

Voor multi-sessie autonomous werk, paar Stop hook (schrijft sessie samenvatting naar disk) met SessionStart hook (injecteer vorige sessie's samenvatting). Zie [context-budget.md](context-budget.md) volledig implementatie. Dit geeft elke nieuw context window gestructureerde oriëntatie zonder nodig exploratie reads.

---

## Wanneer compact versus start nieuw sessie

Keuze tussen `/compact` en frisse sessie hangt af wat je nodig dragen vooruit.

**Compact wanneer:**
- Je nodig doorgaan huide taak — compaction behoud werkend thread
- Bestand bewerkingen zijn gemaakt je nodig Claude blijven bewust hun
- Je midden implementatie en sessie opslaan zou nodig re-etablishing context over wijzigingen al geschreven
- Sessie op 40–60% vul en taak heb zinvol werk resterend

**Start frische sessie wanneer:**
- Huide taak compleet — niets dragen vooruit
- Sessie significant degraded en compaction kwaliteit zou arm
- Je start geheel onafhankelijk taak in zelfde codebase
- Sessie voorbij 70% vul en je heb niet compact — accumulated rot maakt compaction samenvatting onbetrouwbaar

**Kosten wacht:**

Compacting op 80% kost meer dan compacting op 50% twee manieren. Eerst, 80% sessie al degraded — Claude heeft laagste kwaliteit voor 30% context window het niet nodig. Twee, compaction samenvatting gegenereerd van degraded 80% context minder accurate dan één van helder 50% context. Je betaal degradatie straf en krijg slechter samenvatting.

**Directed compact naar behoud kritieke thread:**

```
/compact focus op payment integratie refactor — specifiek behoud:
- Besluit idempotentie keys op alle schrijf operaties gebruiken
- Wijziging naar PaymentService.processCharge() op regel 847
- Open issue webhook retry logica nog niet resolved
```

Zonder dit richting, samenvatten kan niet weten welke sessie vele threads jij continuent.

---

## Kosten implicaties grote context sessies

Context grootte rechtstreeks affecteer kosten meerdere manieren niet altijd onmiddellijk duidelijk.

**Cache schrijft tokens op eerste turn:**

Wanneer sessie start, volledige context is geschreven prompt cache. 200K-token sessie incurs 200K cache schrijven tokens op turn één. Dit gefactureerd cache schrijven tarief, lager dan input token tarief maar niet nul. Looping dagelijks sessies op hoog context vul compound deze kosten.

**Input tokens op cache mislukking:**

Mislukking sessie niet cache hits — eerste sessie, koud start, sessie ouder cache TTL — alle context tokens gefactureerd als input tokens op volledige input tarief. Voor 200K context, dit significant kosten verschil versus cache hit.

**1M window premium:**

Extended 1M context window op Sonnet 4.6 draagt premium beide prijs en latentie. Looping volledige 1M context sessie 200K werkelijk nuttig content en 800K ruis verspilt beide. Gebruik extended window alleen taak werkelijk vereist capaciteit.

**Praktische kosten management lange-context sessies:**

- Houd sessies gefocust op enige taken — idle context bespaart kosten niet
- Compact voordat startend duur multi-bestand taken laag baseline
- Disable MCP servers niet nodig huide sessie (MCP tool definities laden sessie start en kunnen niet verwijderd mid-sessie)
- Gebruik standaard 200K window alle taken dat niet demonstrably meer vereist

---

## Pre-sessie checklist lange-context werk

Voordat sessie start verwacht loopen 50–100+ turns of involve significante bestand reads, verifiëer deze 12 items.

- [ ] **Model selection bevestigd** — gebruiken 1M context alleen taak werkelijk vereist
- [ ] **Alleen nodig MCP servers ingeschakeld** — disable servers niet gebruikt deze sessie
- [ ] **CLAUDE.md is onder 2.000 tokens** — audit het als het organisch groeid
- [ ] **Kritieke constraints geschreven uit** — zal voorkomen front-loaded huide bericht
- [ ] **Bestand lees strategie gepland** — grep-vervolgens-targeted-lees, niet volledige bestand reads
- [ ] **Bash output pipes bij plaats** — alle commando's unbounded output hebben `| head -N` of `| grep patroon`
- [ ] **PostToolUse compressie hook geïnstalleerd** — zie [context-budget.md](context-budget.md) implementatie
- [ ] **PreCompact hook geïnstalleerd** — zal injecteer git staat en taak lijst compaction tijd
- [ ] **Compact drempel besloten** — plan compact 40–50% vul, niet op 80%+
- [ ] **Subagent plan gereed** — taken involving 10+ bestand reads zal delegeren subagents
- [ ] **Staat-naar-disk patroon opstelling** — voor autonomous loops, staat bestand paden bepaald
- [ ] **`/usage` zal controleren sessie start** — baseline overhead bevestigd voordat eerste taak

Dit items checkboxes, niet aspirational doelen. Missing PostToolUse hook kost werkelijk geld over elke verbose bash commando sessie. Missing compact drempel middel je zult compact reactief op 80% in plaats proactief op 50%. Elk item heb meetbaar impact sessie kwaliteit en kosten.

---

## Gewone faal patronen en hun fixes

**Mislukking: sessie degraded op turn 30 ondanks onder 50% vul**

Oorzaak: verbose tool output vroeg sessie (bijv. 5.000-regel log lees vollediger) bezet 40% venster, verlaten 10% werkend context.

Fix: identificeer groot blok via `/usage`, merk tool resultaten categorie hoog relatief conversatie geschiedenis. Voorwaarts, voeg output trimming toe offending commando.

**Mislukking: post-compaction Claude vraagt over dingen het moet weten**

Oorzaak: compaction samenvatting verloren sleutel besluiten omdat zij niet front-loaded of versterkt. Samenvatten deprioritized hun.

Fix: gebruik directed compact met expliciete behoud instructie's. Installeer PreCompact hook. Na compaction, open met korte restatement meest kritieke constraints voordat werk continueer.

**Mislukking: 1M context sessie langzaam en duur maar niet produceren betere resultaten**

Oorzaak: taak niet nodig 1M tokens. Extra capaciteit vult met ruis — verbose bash outputs, volledige bestand reads, herhaald context.

Fix: wissel naar standaard 200K. Pas context hygiëne strategieën fit sessie winnen kleinere venster. Taak werkelijk niet fit 200K gezien juiste hygiëne, herbezoek 1M venster.

**Mislukking: autonomous loop degraded over 20 iteratie's zonder compaction**

Oorzaak: elke iteratie voegde 10K tokens tool geschiedenis aan zelfde context zonder reset mechanisme.

Fix: implementeer schrijf-staat-naar-disk patroon. Overweeg ScheduleWakeup voor hard reset tussen lange iteratie's.

---
