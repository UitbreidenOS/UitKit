# Chaos Engineering Game Day

Gestructureerde foutinjunctie-oefening die chaos engineering verplaatst van ad-hoc experimenten naar een herhaalbare, teamwijde praktijk met gedefinieerde fasen, blast-radiusbesturingingen en een blameless retrospective.

---

## Wanneer te gebruiken

- Voor een grote lancering om onbekende foutmodi te testen
- Na een incident dat een ongetest afhankelijkheidspad onthult
- Op kwartaalbasis om vaardigheden voor herstelling van fouten scherp te houden
- Wanneer betrouwbaarheidsvereisten toenemen (nieuw SLO, nieuwe klantenlaag)

Niet op productie uitvoeren zonder geteste terugrolpad. Niet tijdens piekverkeer uitvoeren, tenzij de hypothese het speciaal vereist.

---

## Fasen / Stappen

### Faseoverzicht

```
Pre-Game → Inject → Observe → Rollback → Retrospective
```

Elke fase heeft een gedefinieerde ingangspoort en uitgangeartefact. Sla fasen niet over, zelfs niet als het experiment 'veilig' lijkt.

---

### Fase 1: Pre-Game

**Poort:** Game day start niet totdat alle volgende waar zijn.

- [ ] Change freeze actief — geen implementaties tijdens het oefenvenster
- [ ] Alle deelnemers gebriefd over de hypothese en hun observatierol
- [ ] Rollback-procedure getesttested en gedocumenteerd (automatische trigger gedefinieerd)
- [ ] Metriek-baseline vastgesteld (foutpercentage, latentie p50/p99, doorvoer) voor de 30 minuten vóór injectie
- [ ] Runbook-locatie gedeeld in teamkanaal

**Briefing-sjabloon:**

```
Game Day: [experiment name]
Date/time: [ISO timestamp]
Facilitator: [name]
Observers: [names + what they're watching]

Hypothesis: [see template below]
Blast radius start: [1 instance / 1% traffic / etc.]
Rollback trigger: error rate > X% for Y minutes OR manual call
Duration limit: [max minutes before mandatory rollback]
```

---

### Hypothese-sjabloon

Elk game day voert tegen precies één hypothese uit. Geen multi-hypothese-sessies — zij besmetten waarnemingen.

```
Steady state:  [what normal looks like — metric + value]
Failure type:  [what you're injecting — network latency / pod kill / CPU stress / etc.]
Expected impact: [what you predict will happen — "p99 latency increases to ~800ms, no errors"]
Success criteria: [what a passing result looks like — "system recovers within 60s of rollback with no data loss"]
```

**Voorbeeld:**
```
Steady state:  API p99 < 200ms, error rate < 0.1%
Failure type:  Add 500ms of network latency between API and database (Toxiproxy)
Expected impact: p99 rises to ~700ms; error rate stays < 0.5% due to connection pool buffering
Success criteria: Removing the proxy restores p99 < 200ms within 30 seconds
```

Indien de verwachte impact overeenkomt met waargenomen gedrag: het systeem is veerkrachtig zoals ontworpen.
Indien gedrag afwijkt: je hebt ofwel een verborgen afhankelijkheid ofwel een onjuist mentaal model gevonden — beide zijn waardevolle bevindingen.

---

### Fase 2: Inject

Begin met de kleinste blast-radius. Escaleer alleen als het systeem de huidige radius zonder schending van rollback-triggers aankan.

**Blast-radiusfasen:**

| Fase | Bereik | Wacht voordat u escaleeert |
|-------|--------|------------------------|
| 1 | 1 instantie (1-5% van vloot) | 5 minuten |
| 2 | 5% van verkeer (verkeer verschuiven of functievlag) | 10 minuten |
| 3 | 25% van verkeer | 15 minuten |
| 4 | Volledig verkeer / alle instanties | Beslissing facilitator |

Nooit van fase 1 naar fase 4 overslaan. De tussenfasen onthullen of fout gelokaliseerd of systemisch is.

**Gereedschapsopdrachten:**

```bash
# AWS FIS — start experiment
aws fis start-experiment --experiment-template-id EXTabc123

# Toxiproxy — add latency between app and DB
toxiproxy-cli toxic add -t latency -a latency=500 -a jitter=50 db_connection

# tc netem — packet loss on a network interface (requires root)
tc qdisc add dev eth0 root netem loss 5%

# Remove tc netem
tc qdisc del dev eth0 root
```

---

### Fase 3: Observe

**Grijp niet in tijdens waarneming.** Het punt is om te zien hoe het systeem echt zich gedraagt, niet hoe het zich gedraagt wanneer een ingenieur het actief verzorgt. Ingenieurs mogen alleen metriek en logs bekijken.

Waarnemer-toewijzingen:
- Eén persoon let op foutpercentage en latentie-dashboards
- Eén persoon bekijkt logs op onverwachte fouttypen
- Eén persoon bekijkt afhankelijke services (downstreameffect)
- Facilitator volgt tijd en documenteert waarnemingen in realtime

**Observatielogindeling (toevoegen aan runbook):**
```
[14:32:15] Blast radius: stage 1 (1 instance)
[14:32:15] Metrics: error_rate=0.08%, p99=210ms — within baseline
[14:37:00] Escalate to stage 2 (5% traffic)
[14:37:30] Metrics: error_rate=0.12%, p99=650ms — above baseline, below rollback trigger
[14:42:00] Escalate to stage 3 (25% traffic)
[14:42:15] Metrics: error_rate=1.8% — approaching rollback trigger (2%)
[14:43:30] error_rate=2.3% — rollback trigger hit
```

**De "grijp niet te snel in"-regel:** de rollback-trigger is van tevoren gedefinieerd. Rol niet handmatig terug voordat de trigger afgaat, tenzij er een noodsituatie buiten het bereik van de hypothese is. Vroegtijdig ingrijpen maakt de waarneming ongeldig.

---

### Fase 4: Rollback

**Geautomatiseerde trigger:**

```yaml
# Prometheus alerting rule that fires rollback
- alert: GameDayRollbackTrigger
  expr: |
    sum(rate(http_requests_total{status=~"5.."}[2m]))
    / sum(rate(http_requests_total[2m])) > 0.02
  for: 2m
  labels:
    severity: game_day_rollback
  annotations:
    summary: "Game day rollback trigger — error rate {{ $value }}"
```

Als waarschuwing afvuurt, voert geautomatiseerd rollback-script uit:
```bash
#!/bin/bash
# .claude/game-day-rollback.sh
toxiproxy-cli toxic remove db_connection --toxicName latency || true
aws fis stop-experiment --id "$FIS_EXPERIMENT_ID" || true
tc qdisc del dev eth0 root 2>/dev/null || true
echo "Rollback complete at $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> .claude/game-day-log.txt
```

**Handmatige terugrol:** facilitator roept terugrol op als geautomatiseerde trigger niet afgaat maar situatie is duidelijk onveilig (cascade-fouten bereiken niet-scoped services, klantimpact buiten blast-radius, enz.).

Na terugrol: verifiëren dat het systeem terugkeert naar stabiele status voordat de oefening wordt beëindigd. Verklaar succes niet totdat baseline-metriken zijn hersteld.

---

### Fase 5: Retrospective

Retrospective gebeurt binnen 24 uur terwijl waarnemingen vers zijn. Formaat: schuldloos, gericht op systeemgedrag, niet individuele acties.

**IMTD — Intent, Mistake, Trigger, Discovery:**
- **Intent:** wat de hypothese voorspelde
- **Mistake:** waar het systeem of mentale model fout was
- **Trigger:** welke voorwaarde de afwijking veroorzaakte
- **Discovery:** wat wij nu weten dat we eerder niet wisten

Voer geen schuld-georiënteerde retrospective uit. 'De ingenieur heeft niet opgemerkt dat het foutpercentage steeg' is geen IMTD-bevinding. 'De foutpercentage-waarschuwing heeft een 5-minuten venster — te traag om deze foutverkleining te vangen' is.

**Retrospectieve uitgangeartefacten:**
- Bijgewerkt runbook met werkelijke vastgelegde waarnemingen
- Lijst met bevindingen (elk als kaartje)
- Lijst van vervolgexperimenten als hypothese was gevalideerd en systeem hield
- Beslissing: wordt dit een terugkerend experiment? Welke cadentie?

---

### Claude Code Game Day Assistant

Claude Code fungeert als realtime-assistent tijdens het game day: leest het runbook, volgt de hypothese, registreert geregistreerde waarnemingen met timestamps en genereert het retrospectieve rapport.

**Setup:**

1. Runbook plaatsen op `.claude/game-day-runbook.md`
2. Claude Code-sessie starten met:
```
Read .claude/game-day-runbook.md. You are the game day assistant for this session.
Track observations I give you with timestamps. When I say "retro", generate the IMTD retrospective report based on all observations.
```

**Tijdens het game day:**
- Waarnemingen geven terwijl je logt: `"[14:42:15] error_rate hit 2.3%, rollback trigger fired"`
- Claude handhaaft het lopende logboek en vlagt of blast-radius-verblijftijd niet is bereikt
- Aan het einde: `"retro"` genereert het volledige retrospectieve met alle geregistreerde waarnemingen geformatteerd in IMTD-sjabloon

---

## Voorbeeld

**Service:** checkout-API  
**Hypothese:** alle Redis-instanties doden forceert terugval naar database zonder zichtbare gebruikersfouten

```
Steady state:  checkout success rate 99.8%, p99 < 300ms
Failure type:  Kill all Redis instances (docker stop redis)
Expected impact: p99 increases to ~800ms (DB fallback), success rate holds
Success criteria: No checkout failures; p99 recovers within 60s of Redis restart
```

**Game Day Log:**

```
[Pre-Game] Baseline captured: success=99.81%, p99=287ms
[10:05:00] Stage 1: killed 1 of 3 Redis instances
[10:10:00] Metrics: success=99.80%, p99=310ms — holding
[10:15:00] Stage 2: killed all 3 Redis instances
[10:15:30] Metrics: success=97.2%, p99=4200ms — UNEXPECTED
[10:17:00] Rollback trigger hit (error_rate > 2%)
[10:17:00] Automated rollback: Redis restarted
[10:18:45] Metrics returned to baseline
```

**Bevinding:** de toepassing heeft geen terugval logica — het werpt 500 fouten in plaats van terug te vallen op de database. Het mentale model was fout. Kaartje geopend voor het implementeren van terugval. Hypothese gepland om opnieuw uit te voeren na correcties.

---
