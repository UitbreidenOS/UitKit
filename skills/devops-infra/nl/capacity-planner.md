---
name: capacity-planner
description: "Infrastructuurcapaciteitsplanning: prognose van resourcebehoeften, kostenprojecties, schaalaanbevelingen"
---

# Infrastructuurcapaciteitsplanner Vaardigheid

## Wanneer activeren
- Infrastructuurplanning vóór een productlancering of verkeersspiek
- Cloudkosten voorspellen voor het volgende kwartaal of boekjaar
- Beslissen wanneer een dienst horizontaal of verticaal te schalen
- Evalueren of gereserveerde instanties versus on-demand-prijzen te gebruiken
- Voorbereiding van een infrastructuurbudget voor een fondsenwervingsgesprek
- Overgeprovisioneerde resources verkleinen om clouduitgaven te verlagen
- Databasecapaciteit plannen vóór gegevensgroei

## Wanneer NIET gebruiken
- Realtime incidentschalingsbeslissingen — gebruik `/incident-response`
- Architectuurherontwerp — gebruik `/aws-architect`, `/gcp-architect` of `/azure-architect`
- SLO-definitie en foutbudget — gebruik `/slo-architect`
- Kostenoptimalisatie van bestaande uitgaven (verkleinen, gereserveerde instanties) zonder planningscontext — gebruik een speciale kostentool

## Instructies

### Kernprompt voor capaciteitsplanning

```
Maak een capaciteitsplan voor [DIENST of SYSTEEM] voor de komende [3 / 6 / 12] maanden.

Huidige staat:
- Dienst: [wat het doet]
- Verkeer: [huidige verzoeken/dag of RPS]
- Infrastructuur: [huidige compute — bijv. 3x t3.medium EC2, 2 Kubernetes-pods, etc.]
- Database: [type, instantiegrootte, huidig gebruikte opslag]
- Huidige maandelijkse cloudkosten: [$X]
- Huidig gebruik: [CPU: X%, Geheugen: X%, DB-verbindingen: X van Y]

Groeiassumpties:
- Verwachte verkeersgroei: [X% per maand / vlak / specifieke gebeurtenisgestuurde piek]
- Verwachte gegevensgroei: [GB/maand opgeslagen in database of objectopslag]
- Geplande productlanceringen: [gebeurtenissen die plotselinge pieken veroorzaken]

Beperkingen:
- SLO: [beschikbaarheidsdoel, latency-SLO]
- Budgetplafond: [$X/maand maximum]
- Cloudprovider: [AWS / GCP / Azure]
- Bestaande verplichtingen: [eventuele gereserveerde instanties of spaarplannen reeds aangeschaft]

Stel op:

## 1. Capaciteitsprognose
Geprojecteerde resourcebehoeften op: [3 maanden / 6 maanden / 12 maanden]
- Compute: huidig vs. benodigd
- Geheugen: huidig vs. benodigd
- Database: opslag- en IOPS-groei
- Bandbreedte / datatransferkosten
- Impact CDN of cachelaag

## 2. Schaaltriggers
Bij welke statistiekdrempel moeten we schalen?
- CPU > X% gedurende Y minuten → schaal uit met Z replica's
- Geheugen > X% → verticaal schalen naar volgende tier of swap toevoegen
- DB-verbindingen > X% van max → overweeg verbindingspooling (PgBouncer) of leesreplica

## 3. Kostenprojectie
| Maand | Compute | Database | Opslag | Bandbreedte | Totaal |
|---|---|---|---|---|---|
| Nu | $X | $X | $X | $X | $X |
| +3 mnd | $X | $X | $X | $X | $X |
| +6 mnd | $X | $X | $X | $X | $X |
| +12 mnd | $X | $X | $X | $X | $X |

## 4. Schaalaanbevelingen
Concrete acties in volgorde:
1. [Wat nu te doen — onmiddellijke actie]
2. [Wat te doen over 30-60 dagen]
3. [Wat te plannen op 6 maanden]

## 5. Kostenoptimalisatiemogelijkheden
Beschikbare besparingen zonder capaciteitsvermindering:
- Gereserveerde instanties / spaarplannen: $X/maand bespaard indien nu aangeschaft
- Verkleinen: [specifieke instanties die overgeprovisioneerd zijn]
- Opslagtiering: [gegevens die naar goedkopere opslag kunnen]
- Caching: [wat gecached kan worden om DB-belasting en computerkosten te verlagen]
```

### Verkeersgebaseerd schaalmodel

```
Maak een schaalmodel voor [DIENST] op basis van verkeerspatronen.

Huidige verkeersgegevens:
- Gemiddeld RPS (verzoeken per seconde): [X]
- Piek-RPS (hoogste waargenomen): [X]
- Dagelijks verkeerspatroon: [vlak / ochtendpiek / avondpiek / bursty]
- Wekelijks patroon: [weekdag-zwaar / weekend-zwaar / vlak]

Dienstkenmerken:
- Gemiddelde aanvraaglatency: [Xms bij huidige belasting]
- CPU per aanvraag (bij benadering): [X% per pod per 100 RPS]
- Geheugen per aanvraag: [X MB werkende set per pod]
- Stateless of stateful: [stateless = eenvoudig horizontaal te schalen]

Schaalmodeluitvoer:

Per RPS-niveau:
| RPS | Benodigde pods | CPU-marge | Latentyschatting | Kosten/maand |
|---|---|---|---|---|
| [Huidig: X] | [Y pods] | [X% marge] | [Xms] | $X |
| [2x groei] | | | | |
| [5x groei] | | | | |
| [10x groei] | | | | |

Horizontale schaalregels:
- Schaal uit wanneer: CPU > [X]% gedurende [Y] minuten OF RPS > [Z]
- Schaal in wanneer: CPU < [X]% gedurende [Y] minuten EN RPS < [Z]
- Minimale pods: [N] (voor beschikbaarheid tijdens schaalevenementen)
- Maximale pods: [N] (kostenplafond of accountlimiet)

HPA (Horizontal Pod Autoscaler) configuratie voor Kubernetes:
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: [service-name]
  namespace: [namespace]
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: [service-name]
  minReplicas: [N]
  maxReplicas: [N]
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

Genereer het schaalmodel voor mijn dienst.
```

### Databasecapaciteitsplanning

```
Plan databasecapaciteit voor [DIENST] over [N] maanden.

Huidige staat:
- Database: [PostgreSQL / MySQL / MongoDB / DynamoDB / etc.]
- Instantie: [huidig instantietype en -grootte]
- Opslag: [huidig gebruikt / totaal voorzien]
- Verbindingen: [huidige actieve verbindingen / maximale verbindingen]
- Grootste tabellen: [naam: X GB, naam: Y GB]
- Querypatronen: [leeszwaar 80/20 / schrijfzwaar / gebalanceerd]
- Back-upretentie: [X dagen]

Groeii-invoer:
- Nieuwe gegevens per dag: [X GB / X rijen in grootste tabel]
- Maandelijkse groeisnelheid: [X%]
- Geplande gegevensmigraties of schemawijzigingen: [beschrijf]

Databasecapaciteitsplanuitvoer:

## Opslagprognose
| Maand | Gegevensomvang | Indexomvang | Totaal | Opslagkosten |
|---|---|---|---|---|
| Nu | X GB | X GB | X GB | $X |
| +3 mnd | | | | |
| +6 mnd | | | | |
| +12 mnd | | | | |

Drempels voor opslagmeldingen:
- Amber: opslag > 70% vol → upgrade plannen
- Rood: opslag > 85% vol → upgrade binnen 1 week

## Verbindingscapaciteit
Huidige maximale verbindingen voor [instantietype]: [N]
Huidig gebruik: [X verbindingen, X% van max]
Aanbeveling verbindingspool:

Bij gebruik van PgBouncer of RDS Proxy:
- Poolgrootte per toepassingsinstantie: [N]
- Maximale clients: [N]
- Poolmodus: [transactie / sessie — transactie aanbevolen voor stateless API's]

## Instantie-upgradetrigger
Upgrade instantie wanneer:
- Gemiddelde CPU > 70% voor > 30 minuten dagelijks
- Vrije opslag < 20% van totaal
- Lees-IOPS > 80% van voorziene IOPS consistent
- P99-querylatency > [X]ms voor top 10 queries

Volgende instantietier: [huidig] → [aanbevolen volgende] op [X maanden]
Kostenverschil: $X/maand extra

## Overweging leesreplica
Voeg een leesreplica toe wanneer:
- Lees-schrijf-verhouding > 5:1
- Rapportage-/analysequeries de primaire prestaties beïnvloeden
- Primaire CPU wordt aangestuurd door leesbewerkingen, niet schrijfbewerkingen

Kosten leesreplica: $X/maand (zelfde instantietype als primair)
Verbindingsroutering: [beschrijf hoe lees- vs. schrijfbewerkingen te routeren in toepassingscode]
```

### Lanceringskapaciteitsplan

```
Maak een lanceringskapaciteitsplan voor [PRODUCT / FUNCTIE / EVENEMENT].

Lanceringsdetails:
- Wat wordt gelanceerd: [beschrijf]
- Verwachte lanceringsdatum: [DATUM]
- Verkeersscenario (kies één of modelleer alle drie):
  - Conservatief: [X% stijging van huidig verkeer]
  - Basisscenario: [X gebruikers in eerste 48 uur]
  - Optimistisch: [X gebruikers, uitgelicht in [media / App Store / Product Hunt]]

Huidige infrastructuur:
- Compute: [beschrijf]
- Database: [beschrijf]
- CDN / cache: [beschrijf]
- Huidige capaciteit: [wat is de maximale RPS die het systeem vandaag aankan?]

Lanceringsplanuitvoer:

## Pre-lanceringschecklist (infrastructuur)
- [ ] Belastingstest op [2x / 5x / 10x] verwacht piekverkeer — documenteer resultaten
- [ ] Bevestig dat automatisch schalen is geconfigureerd en getest
- [ ] Cache-opwarmplan voor statische assets en veelgebruikte queries
- [ ] Databaseverbindingspool gedimensioneerd voor piekverbindingen
- [ ] CDN-cacheregels beoordeeld voor nieuwe pagina's/assets
- [ ] Monitoringdashboards ingesteld voor lanceringsdag
- [ ] On-call-engineer geïdentificeerd en ingelicht over runbook
- [ ] Rollback-plan gedocumenteerd en getest

## Verkeersscenario's en infrastructuurbehoeften
| Scenario | Piek-RPS | Benodigde pods | DB-verbindingen | Vereiste actie |
|---|---|---|---|---|
| Conservatief | X | N | X | [geen wijziging / kleine aanpassing] |
| Basisscenario | X | N | X | [vooraf schalen naar N pods] |
| Optimistisch | X | N | X | [tijdelijk verticaal schalen + vooropwarmen] |

## Procedure op lanceringsdag
T-24u: compute vooraf schalen naar [N] pods (niet wachten op automatische schaler)
T-4u: CDN-cache opwarmen voor alle nieuwe pagina's
T-0: plaatsen in #engineering en on-call taggen met link naar lanceringsdashboard
T+1u: foutpercentages, latency, DB-verbindingen controleren — vergelijken met basislijn
T+24u: werkelijk verkeer vs. prognose beoordelen, verkleinen indien overgeprovisioneerd

## Kosten voor lanceringsperiode
Extra kosten voor [7 dagen vooraf geschaalde infrastructuur]: $X
Terugkeer naar normale provisioning na: [DATUM] als verkeer stabiliseert onder [X] RPS
```

### Cloudkostenoptimalisatieanalyse

```
Analyseer mijn cloudkosten en vind besparingsmogelijkheden.

Huidige maandelijkse rekening: [$X totaal]
Uitsplitsing:
- Compute (EC2 / GKE-nodes / Cloud Run): $X
- Database (RDS / Cloud SQL / Firestore): $X
- Opslag (S3 / GCS / Azure Blob): $X
- Datatransfer / CDN: $X
- Overige (Lambda, SQS, monitoring, etc.): $X

Infrastructuurinventaris:
- Instanties/nodes: [vermeld met groottes en gemiddeld gebruik]
- Databases: [vermeld met groottes en gemiddeld gebruik]
- Opslagbuckets: [totaal opgeslagen, toegangspatronen]
- Eventuele gereserveerde instanties of spaarplannen reeds aanwezig: [vermeld]

Analyseer per categorie:

COMPUTE-VERKLEINING:
- Instanties met gemiddeld CPU < 20%: kandidaten voor verkleining
- Geheugengebruik: overgeprovisioneerde instanties
- Geschatte besparingen door verkleining: $X/maand

GERESERVEERDE INSTANTIES / SPAARPLANNEN:
- Break-evenanalyse: als we ons verbinden aan [N]x [instantietype] voor 1 jaar, besparen we $X vs. on-demand
- Aanbeveling: welke instanties nu te reserveren vs. on-demand te houden

OPSLAGKOSTREDUCTIE:
- S3 Intelligent Tiering voor weinig gebruikte gegevens
- Logretentiebeleid: verminderen van [N] naar [M] dagen → bespaar $X/maand
- Identificeer verweesde EBS-volumes of snapshots: [veelvoorkomende verspillingsbron]

DATABASE-OPTIMALISATIE:
- Multi-AZ vs. single-AZ voor dev/staging: bespaar $X/maand
- Aurora Serverless voor variabele werklasten: break-even bij [X uur/dag gebruik]
- Leesreplica's die verwijderd of verkleind kunnen worden

Stel op: gerangschikte lijst van besparingsmogelijkheden op maandelijkse dollar-impact, met implementatie-inspanning (laag / gemiddeld / hoog).
```

## Voorbeeld

**Gebruiker:** We zijn van plan een tool open-source te maken en verwachten volgende maand uitgelicht te worden op Product Hunt. Momenteel hebben we 2 t3.medium EC2-instanties achter een ALB, die 500 RPS bedienen op 45% CPU. We verwachten een 5-10x verkeersspiek op lanceringsdag. Maandelijkse rekening is $220.

**Uitvoer (uittreksel):**

```markdown
# Capaciteitsplan: Product Hunt Lancering

## Huidige basislijn
2x t3.medium (2 vCPU, 4GB RAM) — 500 RPS bij 45% CPU.
Geschatte maximale capaciteit: ~1.100 RPS voor CPU-verzadiging.

## Verkeersscenario's
| Scenario | Piek-RPS | Benodigde instanties | Marge |
|---|---|---|---|
| Conservatief (5x) | 2.500 | 5x t3.medium | 20% |
| Basisscenario (7x) | 3.500 | 7x t3.medium | 10% |
| Optimistisch (10x+) | 5.000+ | 10x t3.medium of 5x t3.large | 15% |

## Pre-lanceringsacties (op prioriteit)

**Nu (vandaag):**
- EC2 Auto Scaling inschakelen met min=2, max=12, schaal uit bij CPU>60% gedurende 3 minuten
- Schaal-in cooldown instellen op 15 minuten (voorkomt schommeling na piek)
- Verifieer dat ALB-gezondheidscontrole correct is geconfigureerd en reageert < 2s

**T-48u voor lancering:**
- Vooraf schalen naar 6 instanties handmatig (vertrouw niet op automatische schaler tijdens de piek — die loopt 3-5 minuten achter)
- Voer een belastingstest uit naar 3.500 RPS met k6 of Locust — bevestig latency blijft < 200ms

**T-4u:**
- CloudFront-cache opwarmen voor alle statische assets op de nieuwe pagina's
- Als database-backed content wordt geserveerd: controleer cache-control headers

**Kosten lanceringsdag:**
7 dagen van 6x t3.medium vooraf geschaald: ~$90 extra
Als u 10x bereikt en schaalt naar 10 instanties: ~$150 extra voor de week
Aanbeveling: vooraf schalen, bewaken, verkleinen na 48-72u wanneer verkeer normaliseert.

**Wat te volgen op lanceringsdag:**
- ALB RequestCount (niet alleen RPS bij uw app — ALB is de vroege indicator)
- Aantal gezonde hosts in doelgroep (moet gedurende de dag op vooraf geschaalde N blijven)
- DB-verbindingen — t3.medium kan ~50 verbindingen elk aan; bij 10 instanties is dat 500 verbindingen
- Bij RDS: controleer FreeableMemory en DatabaseConnections statistieken
```

---

> **Werk met ons samen:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
