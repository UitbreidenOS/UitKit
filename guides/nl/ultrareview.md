# Ultrareview — Op vloot gebaseerde adversariale codebeoordeling

Ultrareview is Claude Code's multi-agent review-systeem, uitgebracht in openbare preview in april 2026. Het vervangt het enkele-reviewer-model van `/code-review` met een gecoördineerde vloot van gespecialiseerde subagents die dezelfde diff onafhankelijk beoordelen, elkaar's bevindingen kruislings controleren en een gesynthetiseerd rapport produceren dat is geverifieerd op valse positieven. De sleuteleigenschappen zijn: adversariaal (agents proberen actief gaten in elkaar's conclusies te vinden), parallel (agents draaien gelijktijdig, niet achtereenvolgens) en diepte-geschaald (de vlootgrootte en inspanningsniveau schalen mee met diff-grootte en complexiteit).

---

## Hoe het werkt

### De vlootarchitectuur

Ultrareview spawnt een vloot van reviewer-subagents, elk met een duidelijke rol en een ander perspectief op dezelfde diff. De samenstelling van de vloot varieert op basis van diff-kenmerken, maar een typische run op een gemiddelde PR omvat:

| Agent | Focus |
|---|---|
| **Beveiligingsreviewer** | OWASP top 10, injectie, auth bypass, gegevensblootstelling, geheimen in diffs |
| **Correctheidsreviewer** | Logicafouten, randgevallen, race conditions, off-by-one, nulls |
| **Prestatiereviewer** | N+1-query's, blockering I/O, algoritmische complexiteit, geheugenallocatiepatronen |
| **Architectuurreviewer** | Ontwerpconsistentie, koppeling, patroonadhering, interface-contracten |
| **Testdekking-reviewer** | Wat is gedekt, wat niet, of tests het gedrag daadwerkelijk testen |
| **Adversariale verifier** | Beoordeelt de bevindingen van alle andere agents — markeert valse positieven, escaleert gemiste problemen |

De Adversariale Verifier is het onderscheidende onderdeel. Het ontvangt alle bevindingen van de specialistische agents en de expliciete taak is ze ter discussie stellen: bepalen of elke bevinding echt is, een fout-positief of een geldig bezwaar dat de originele agent onderbelicht heeft. Deze tweede-pass verificatie vermindert aanzienlijk het lawaai in de uiteindelijke output.

### Wat parallel vs. achtereenvolgens wordt uitgevoerd

Fase 1 (parallel): Alle specialistische agents beoordelen de diff gelijktijdig. Elk leest dezelfde input — de diff, relevante contextbestanden en eventuele gegeven instructies — maar past zijn eigen perspectief toe.

Fase 2 (achtereenvolgens): De Adversariale Verifier ontvangt alle Fase 1-bevindingen en produceert de synthese. Dit is opzettelijk achtereenvolgens — de verifier heeft het volledige beeld nodig.

Fase 3: Het gesynthetiseerde rapport wordt samengesteld, gededupliceerd en aan u geretourneerd.

De end-to-end clock-tijd is doorgaans 90–180 seconden voor een gemiddelde PR, afhankelijk van diff-grootte en het aantal geraadpleegde contextbestanden. Het parallelisme betekent dat dit sneller is dan dezelfde beoordeling achtereenvolgens uit te voeren, ondanks het gebruik van meer totale tokens.

### Contextresolutie

Voordat de vloot wordt gesmeten, lost Ultrareview de beoordelingscontext op. Het leest:

- De diff zelf (alleen gewijzigde regels tenzij `--full-files` is ingesteld)
- De bestanden aangrenzend aan gewijzigde bestanden (om omringende patronen te begrijpen)
- Testbestanden die de gewijzigde code dekken
- Relevante configuratie (linters, tsconfig, pyproject.toml) om te begrijpen wat statische analyse al dekt
- `CLAUDE.md` indien aanwezig — om beoordelingsregels specifiek voor de repo toe te passen op de vloot

Deze contextresolutie vindt plaats voordat de vloot wordt gesmeten, zodat elke agent een vooraf samengesteld pakket ontvangt, niet onbewerkte repo-toegang.

---

## Aanroeping

### Primaire aanroeping

```
/ultrareview
```

Geen argumenten nodig voor de standaardcase — Ultrareview pikt de huidige diff (staged + unstaged changes) en het branch-diff tegen de standaard remote branch op.

### Met een specifieke PR

```
/ultrareview 847
```

Geef een GitHub PR-nummer. Ultrareview haalt de PR-diff op via de GitHub MCP of `gh` CLI. Dit is de meest voorkomende aanroeping in de praktijk — je wijst het op een PR, het beoordeelt het.

### Met een focusgebied

```
/ultrareview --focus security
/ultrareview --focus performance
/ultrareview --focus correctness
```

Focus-hints beïnvloeden de vlootsamenstelling. `--focus security` vergroot de inspanning van de beveiligingsreviewer en vermindert die van de architectuurreviewer. De Adversariale Verifier draait altijd met volledige inspanning ongeacht de focus.

### Met inspanningsniveau

```
/ultrareview --effort high
/ultrareview --effort max
```

Inspanning schaalt de diepte van elke afzonderlijke agent, niet het aantal agents. Bij `--effort max` gebruikt elke agent extended thinking en leest een breder scala van contextbestanden. De kosten schalen aanzienlijk — gebruik `max` alleen voor beveiligingsgevoelige of architectuur-definiërende wijzigingen.

### Met volledige bestandscontext

```
/ultrareview --full-files
```

Standaard zien agents alleen de gewijzigde regels plus omringende context. `--full-files` geeft agents de volledige inhoud van elk gewijzigd bestand. Gebruik dit wanneer de diff klein is maar het gedrag sterk afhangt van de volledige structuur van het bestand (bijv. een klasse waarin een methodeverandering invarianten door het hele bestand beïnvloedt).

### Aanroepen vanaf de CLI

```bash
claude --ultrareview 847
claude --ultrareview --focus security --effort high
```

CLI-aanroeping is gelijk aan de slash-commando. Nuttig voor scripting Ultrareview in CI-pijplijnen of pre-merge hooks.

---

## Prijsstelling

Ultrareview wordt per run geprijsd, niet per token. De tokenkost wordt nog steeds gemaakt (en gereflecteerd in uw seat-facturering of API-gebruik), maar de per-run-kosten dekken de infrastructuur voor orkestbeheer van de vloot.

### Prijstarieven (vanaf april 2026 openbare preview)

| Tranche | Kosten | Opmerkingen |
|---|---|---|
| Eerste 3 runs | Gratis | Per account, reset nooit — eenmalige preview-toewijzing |
| Standaard run | $5 | Standaard inspanning, diffs tot ~500 regels veranderd |
| Grote run | $10 | Diffs 500–2000 regels veranderd, of `--effort high` |
| Max run | $20 | `--effort max`, of diffs over 2000 regels veranderd |

De run wordt geprijsd op de tranche die uw aanroeping *voordat* u bevestigt. U ziet een kostbevestigingsprompt voordat de vloot wordt gesmeten:

```
Ultrareview: Grote run — geschatte $10
Diff: 847 regels veranderd over 23 bestanden
Vloot: 6 agents + adversariale verifier
Doorgaan? [j/N]
```

Typ `j` om door te gaan. Als u weigert, worden geen kosten doorberekend.

### Waar de gratis runs goed voor zijn

Gebruik uw drie gratis runs op uw meest complexe of beveiligingsgevoelige recente wijzigingen. Verspil ze niet aan kleine PR's — `/code-review` dekt die goed zonder extra kosten. Bespaar gratis runs voor:

- Auth-systeemwijzigingen
- Database-migratieP PR's
- Facturerings-/betalingscode
- Eerste grote feature in onbekende codebase
- PR's waarover andere reviewers bezwaren hebben geuit maar zonder specifieke redenen

### Kosten versus engineeringstijd

De reviewuur van een gemiddelde engineer kost $75–150 volledig belast. Een $10 Ultrareview-run die één blokkeerend bug vangt voordat het in productie gaat is een 10x rendement op een enkel incident. De berekening verschuift op kleine PR's waar `/code-review` voldoende is — besteed niet $5 aan het beoordelen van een één-regel configwijziging.

---

## `/ultrareview` vs. `/code-review`

Het begrijpen van wanneer elk moet worden gebruikt is het belangrijkste praktische besluit.

| Dimensie | `/code-review` | `/ultrareview` |
|---|---|---|
| **Agents** | Enkele reviewer | Vloot van 5–7 specialisten |
| **Kosten** | $0 (alleen tokenkost) | $5–20 per run |
| **Tijd** | 15–30 seconden | 90–180 seconden |
| **Fout-positiefpercentage** | Matig | Laag (adversariale verificatie) |
| **Beveiligingsdiepte** | Goed | Grondig — dedicated agent + verifier |
| **Cross-file-analyse** | Beperkt | Vol — agents kunnen aangrenzende bestanden lezen |
| **Best voor** | Dagelijks review, kleine PR's | Kritieke PR's, veiligheidsbeoordeling, complexe wijzigingen |
| **Inspanningsniveaus** | `low` / `medium` / `high` / `max` | `default` / `high` / `max` |
| **GitHub PR-integratie** | Handmatig diff plakken | Inheems via PR-nummer |

**Gebruik `/code-review` wanneer:**
- De PR klein is en goed afgebakend (< 200 regels veranderd)
- U al een zelfbeoordeling heeft gedaan en een snelle tweede mening wilt
- U niet-kritieke applicatiecode beoordeelt onder strikte timelinedruk
- U snel door een feature wilt itereren met frequente reviews

**Gebruik `/ultrareview` wanneer:**
- De wijziging beveiligingsgevoelig is (auth, betalingen, gegevenstoegang, geheimen)
- De PR groot is en meerdere subsystemen raakt
- U staat op het punt om in main op een productiesysteem samen te voegen
- Een ander reviewer iets markeerde maar kon het niet precies formuleren
- U een geschreven record van een grondige beoordeling wilt (Ultrareview's output is artefactkwaliteit)
- De codebase is onbekend en vertrouwt u uw eigen beoordelingsdiepte niet

Er is geen schande in eerst `/code-review` uit te voeren en naar `/ultrareview` te upgraden wanneer het iets dubbelzinnigs aan het licht brengt. De kost van een `code-review` is bijna nul, dus gebruik het vrijelijk; gebruik Ultrareview doelbewust.

---

## De output lezen

Ultrareview produceert een gestructureerd rapport. Het begrijpen van het formaat laat u sneller triëren.

### Rapportstructuur

```
## Ultrareview-rapport
PR #847 · 23 bestanden · 847 regels veranderd
Vloot: Security, Correctness, Performance, Architecture, Tests, Adversarial Verifier
Runtime: 142 seconden

---

### Kritieke bevindingen (must fix vóór merge)

🔴 [SECURITY] SQL injectie in user search endpoint
Agent: Security Reviewer · Geverifieerd: Adversarial Verifier ✓
Bestand: api/search.py:34
...

---

### Belangrijke bevindingen (should fix vóór merge)

🟠 [CORRECTNESS] Race condition in concurrent payment processing
Agent: Correctness Reviewer · Geverifieerd: Adversarial Verifier ✓
Bestand: billing/processor.py:112
...

---

### Suggesties (worth discussing)

🟡 [ARCHITECTURE] Payment handler schendt single-responsibility
Agent: Architecture Reviewer · Betwist: Adversarial Verifier — lage zekerheid
...

---

### Genegeerde bevindingen

ℹ️ 3 bevindingen van specialistische agents werden genegeerd door de Adversariale Verifier als valse positieven. Zie bijlage.

---

### Samenvatting
Kritiek: 1 · Belangrijk: 3 · Suggesties: 5 · Genegeerd: 3
Aanbeveling: Wijzigingen aanvragen — kritieke bevinding moet worden opgelost.
```

### De verificatiebadge

Elke bevinding draagt een verificatiestatus van de Adversariale Verifier:

- **Geverifieerd ✓** — de Adversariale Verifier bevestigde dat de bevinding echt is en correct beschreven
- **Geëscaleerd ↑** — de Adversariale Verifier vond dat de bevinding onderschat; ernst kan worden verhoogd
- **Betwist —** — de Adversariale Verifier is het niet eens; de bevinding is opgenomen maar aangemerkt als onzeker
- **Genegeerd ✗** — de Adversariale Verifier concludeerde dat de bevinding een fout-positief is; verplaatst naar bijlage

Sla Betwiste bevindingen niet over. Ze zijn opgenomen omdat de Adversariale Verifier ze niet zelfverzekerd kan negeren — wat betekent dat ze de moeite waard zijn voor menselijk onderzoek, zelfs als de originele agent het risico overdeef.

### De Genegeerde bijlage

Lees altijd de genegeerde bevindingsbijlage, vooral op beveiligingsgevoelige PR's. De Adversariale Verifier is goed maar niet onfeilbaar. Een genegeerde beveiligingsbevinding die zich achteraf als echt blijkt te zijn is erger dan een fout-positief dat u kort overwogen en verworpen hebt.

Het bijlageformaat:

```
### Bijlage: Genegeerde bevindingen

[Security Reviewer] Potentiële SSRF via user-supplied URL
Genegeerd: De URL wordt gevalideerd tegen een allowlist op regel 12; de bevinding veronderstelt
dat geen validatie bestaat. Bevestigd veilig door Adversarial Verifier.

[Performance Reviewer] O(n²) sorteren in user listing
Genegeerd: Invoergrootte is beperkt tot 50 door de pagineringslimiet op regel 8.
Werkelijke complexiteit is O(50 log 50) = effectief constant.
```

Deze negaties zijn verklarend, niet alleen ja/nee. Als de redenering verkeerd lijkt, vertrouw op uw oordeel boven de Adversariale Verifier.

### Agenttoewijzing

Elke bevinding noemt de agent die hem heeft geuit. Dit is om twee redenen van belang:

1. **Kalibratie**: Sommige agents zijn conservatiever dan anderen. Als u eerder hebt gezien dat de Prestatiereviewer fout-positieven voor uw codebase aanvlekt, pas die prior toe.
2. **Vervolgvragen stellen**: U kunt naar de bevinding verwijzen en Claude vragen dieper in te gaan — "Breid de race condition bevinding uit op billing/processor.py:112" — en het zal opvatten waar de Correctheidsreviewer gebleven was.

---

## Praktische tips

### Tip 1: Beoordeel de genegeerde bevindingen vóór goedkeuring

De meest bruikbare gewoonte: voordat u op goedkeuren klikt, besteed 60 seconden aan het lezen van de genegeerde bevindingsbijlage. U zoekt naar gevallen waar de redenering van de Adversariale Verifier iets veronderstelt dat niet waar is voor uw specifieke codebase. Het gebeurt.

### Tip 2: Gebruik `--focus security` op elke PR die auth of betalingen raakt

Zelfs als u zelfverzekerd bent over de wijziging, vangt de beveiligingsfocus vlootsamenstelling dingen die bredere reviews missen. De dedicated beveiligingsagent leest de hele auth-flow, niet alleen de diff — het begrijpt of een wijziging aan een middleware-functie elke geverifieerde route of slechts de aangrenzende beïnvloedt.

```bash
claude --ultrareview 312 --focus security
```

### Tip 3: Ultrareview niet elke PR — stel een drempel in

Teams die de meeste waarde uit Ultrareview halen, stellen een drempel in: elke PR over X regels veranderd, of elke PR die Y-mappen raakt, gaat automatisch door Ultrareview. Daaronder draait `/code-review`. Voorbeeld-drempel:

```
Ultrareview als:
  - diff > 300 regels veranderd, OF
  - elk bestand in auth/, billing/, api/admin/ aangeraakt, OF
  - schema-migratie opgenomen
```

Documenteer dit in uw `CLAUDE.md` zodat Claude Code het automatisch toepast tijdens beoordeling.

### Tip 4: Voer ultrareview uit op uw eigen PR's vóór het aanvragen van menselijke beoordeling

Een veel voorkomend werkschema: schrijf de code, voer `/code-review` uit voor snelle iteratie, los de voor de hand liggende problemen op, voer vervolgens `/ultrareview` uit vóór het aanvragen van een menselijke reviewer. De menselijke reviewer ziet dan een PR die al door adversariale analyse is gegaan — hun beoordeling kan zich richten op ontwerpbeslissingen en context in plaats van voor de hand liggende bugs te vangen.

### Tip 5: Pipe de output naar een bestand voor asynchrone beoordeling

Ultrareview draait 90–180 seconden. U hoeft het niet te bekijken:

```bash
claude --ultrareview 847 > ultrareview-847.md
```

Open het bestand wanneer u klaar bent. Het rapport is zelfstandig en vereist geen interactieve vervolgstappen tenzij u dieper wilt graven.

### Tip 6: Gebruik `--full-files` voor klasse- of moduleherschrijvingen

Wanneer een PR een klasse herstruct maar de diff alleen gewijzigde methoden toont, kunnen agents invarianten missen die ongewijzigde methoden veronderstellen. `--full-files` geeft de vloot het volledige beeld:

```bash
claude --ultrareview 512 --full-files --focus correctness
```

Kost meer (meer tokens per agent), maar op een refactor op klasseniveau is het de moeite waard.

### Tip 7: Ultrareview de PR, niet de commit

Richt Ultrareview op het volledige PR-diff, niet op een enkele commit. Beoordeling van enkele commits mist het cumulatieve effect van meerdere commits — een beveiligingsfix in commit 2 die gedeeltelijk in commit 4 wordt teruggedraaid, bijvoorbeeld. Het PR-level diff is altijd het juiste bereik.

### Tip 8: Als de Adversariale Verifier een bevinding escaleert, behandel het als kritiek

Escalaties (↑) gebeuren wanneer de Adversariale Verifier denkt dat een originele agent een bevinding onderschat heeft. Deze zijn zeldzaam — onder 5% van de bevindingen — maar het zijn de gevallen die het meest waarschijnlijk echt ernstig zijn. Een geëscaleerde bevinding betekent dat twee agents onafhankelijk akkoord gingen dat het risico hoger is dan aanvankelijk aangemerkt. Behandel escalaties met dezelfde urgentie als een 🔴 Kritiek, ongeacht welke ernst de originele agent toewezenheid had.

---

## Bekende valkuilen

### Contextvensterlimieten op zeer grote PR's

PR's over ~5000 regels veranderd kunnen het contextvenster overschrijden dat agents coherent kunnen lezen. Ultrareview waarschuwt u voordat het draait als de diff dicht bij deze limiet ligt. Opties: splits de PR, gebruik `--focus` om het agent-bereik te verkleinen, of accepteer dat enige cross-file-analyse onvolledig zal zijn.

### Agentonenigheid is geen bug

Soms hebben de Correctheidsreviewer en de Architectuurreviewer tegenstrijdige aanbevelingen — de correctheidsfix omvat een patroon dat de architectuuragent aanmerkingen als inconsistent met de codebase. Dit wordt verwacht. De Adversariale Verifier noteert de tegenspraak maar lost het niet altijd op — dat is een oordeel voor u. Zoek naar de tegenspraak expliciet in bevindingen die Betwist zijn.

### De gratis tranche draagt niet over

Uw drie gratis Ultrareview runs worden toegewezen bij accountcreatie en resetten nooit. Als u in een team bent, krijgt elk teamlid zijn eigen toewijzing — ze worden niet samengevoegd. Een solo-ontwikkelaar krijgt drie gratis runs; een team van 10 krijgt 30 (10 × 3).

### `--effort max` op een grote PR is duur

Een max-effort-run op een PR met 2000 regels kan $20 kosten en 4–6 minuten duren. De kostbevestigingsprompt toont u dit voordat u zich bindt. Gebruik `--effort max` niet voor routinebeoordeling — reserveer het voor code die beveiligingsgrenzen in productie raakt.

### Ultrareview vervangt geen menselijke beoordeling voor architectuurbeslissingen

De Architecture Reviewer-agent is sterk op patroonsamenhang en koppelingsanalyse, maar kent uw team's productstrategie, uw technische schuld-tolerantie of beperkingen op uw implementatiemodel niet. Gebruik Ultrareview-bevindingen als input voor menselijke architectuurbeoordeling, niet als vervanging ervoor.

### Het rapport is beperkt tot de diff, niet het systeem

Ultrareview beoordeelt de diff in context maar kan niet weten van bugs in aangrenzende systemen die uw wijziging mee zal gaan. Een wijziging die in isolatie correct is maar een veronderstelling in een externe service breekt, zal niet worden opgemerkt. Dat is een systeemkwestie die menselijke domeinkennis vereist.

---

## Voorbeeld end-to-end workflow

**Scenario:** U hebt een betaalswebhook-handler voor Stripe geschreven. De PR is 340 regels veranderd over 8 bestanden. Voordat u review aanvraagt, voert u Ultrareview uit.

```bash
# Maak eerst de PR aan zodat u een PR-nummer hebt
gh pr create --title "Add Stripe webhook handler" --draft

# Haal het PR-nummer op
gh pr list --state open | head -5
# Output: 923  Add Stripe webhook handler  feat/stripe-webhooks

# Voer ultrareview uit met beveiligingsfocus
claude --ultrareview 923 --focus security
```

Output prompt:
```
Ultrareview: Grote run — geschatte $10
Diff: 340 regels veranderd over 8 bestanden
Vloot: Security (expanded), Correctness, Performance, Architecture, Tests, Adversarial Verifier
Focus: Security
Doorgaan? [j/N]
```

U typt `j`. 147 seconden later:

```
## Ultrareview-rapport — PR #923
...

### Kritieke bevindingen

🔴 [SECURITY] Webhook-handtekening niet geverifieerd vóór payload-verwerking
Agent: Security Reviewer · Geverifieerd: Adversarial Verifier ✓
Bestand: webhooks/stripe.py:18
Probleem: De handler verwerkt de event payload zonder eerst de
Stripe-Signature-header te verifiëren. Iedereen kan nepwebhook-events verzenden.
Fix:
  event = stripe.Webhook.construct_event(
      payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
  )
  # Verhoogt stripe.error.SignatureVerificationError als ongeldig

🔴 [SECURITY] Herhaalingsaanval mogelijk — geen timestamps-validatie
Agent: Security Reviewer · Geëscaleerd: Adversarial Verifier ↑
Bestand: webhooks/stripe.py:18
Probleem: Zelfs met handtekening-verificatie toegevoegd, moet de timestamp in de Stripe-Signature-
header worden gevalideerd om hergespeelde verzoeken te voorkomen. Stripe raadt aan
events ouder dan 300 seconden af te wijzen.
Fix:
  # stripe.Webhook.construct_event valideert timestamp als u tolerance parameter doorgeeft
  event = stripe.Webhook.construct_event(
      payload, sig_header, settings.STRIPE_WEBHOOK_SECRET,
      tolerance=300
  )
```

Twee kritieke bevindingen vóór menselijke beoordeling opgemerkt. U lost beide op, pushed, markeert de PR klaar voor beoordeling en noteert in de PR-beschrijving dat Ultrareview is uitgevoerd en bevindingen zijn opgelost. Uw reviewer besteedt zijn tijd aan de bedrijfslogica, niet aan de beveiligingsfundamenten.

---


📺 **[Abonneer u op ons YouTube-kanaal voor meer diepgaande analyses](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
