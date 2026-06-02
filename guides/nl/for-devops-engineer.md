# Claude voor DevOps en Platform Engineers

Alles wat een DevOps- of platform-engineer nodig heeft voor AI-ondersteunde infrastructuuroperaties — incidentrespons, runbooks, IaC, CI/CD-pipelines, capaciteitsplanning, SLO-beheer en de dagelijkse ritmes van een gezonde productie.

---

## Voor wie is dit bedoeld

Je bent een DevOps-engineer, SRE of platform-engineer verantwoordelijk voor infrastructuurbetrouwbaarheid, deployment-pipelines en de operationele gezondheid van productiesystemen. Je hebt on-call dienst, schrijft Terraform en Kubernetes-manifests, bezit de CI/CD-pipelines en bent de eerste verdedigingslinie als er iets kapotgaat.

**Voor Claude Code:** 2 uur om een runbook te schrijven. 30 minuten om een postmortem te schrijven. Een halve dag om een nieuwe monitoringstrategie te ontwerpen. IaC-wijzigingen worden langzaam gereviewd omdat het moeilijk is ze aan niet-infra-stakeholders uit te leggen.

**Na:** Runbook gegenereerd uit incidentgeschiedenis in 20 minuten. Postmortem gestructureerd in 10 minuten. Terraform-modules in een sessie ontworpen met verstandige standaarden. Monitoringstrategie ontworpen met ingebouwde SLO-context.

---

## Installatie in 30 seconden

```bash
# Installeer de volledige DevOps/platform-stack
npx claudient add skill devops-infra/kubernetes
npx claudient add skill devops-infra/terraform
npx claudient add skill devops-infra/docker
npx claudient add skill devops-infra/github-actions
npx claudient add skill devops-infra/observability-designer
npx claudient add skill devops-infra/incident-response
npx claudient add skill devops-infra/aws-architect
npx claudient add skill devops-infra/slo-architect
npx claudient add skill devops-infra/oncall-runbook
npx claudient add skill devops-infra/capacity-planner
npx claudient add agents roles/sre-engineer
npx claudient add agents roles/incident-commander
npx claudient add agents roles/platform-engineer
npx claudient add agents roles/kubernetes-architect
```

---

## Jouw Claude Code DevOps-stack

### Skills (slash-commando's)

| Skill | Wat het doet | Wanneer te gebruiken |
|---|---|---|
| `/incident-response` | Gestructureerde incidentrespons: triage, oorlogsruimte, postmortem | Elk productie-incident |
| `/oncall-runbook` | Genereer runbooks uit incidentgeschiedenis, audit bestaande runbooks | Voor nieuwe diensten on-call gaan, na incidenten |
| `/observability-designer` | Ontwerp metrics-, logs-, trace-strategie — Datadog, Prometheus, OTel | Nieuwe diensten, monitoringsgaten |
| `/slo-architect` | Definieer SLO's, foutbudgetten, alarmdrempels | Nieuwe diensten, SLO-reviews |
| `/capacity-planner` | Voorspel resourcebehoeften, kostenprognoses, schaaldrempels | Kwartaalplanning, pre-lancering |
| `/kubernetes` | K8s-manifests, HPA, resourcelimieten, debuggen, netwerkbeleid | Elk K8s-werk |
| `/terraform` | IaC-modules, statusbeheer, importeren, planreview | Elke infrastructuurprovisioning |
| `/docker` | Dockerfiles, multi-stage builds, image-optimalisatie, compose | Containerwerk |
| `/github-actions` | CI/CD pipeline-ontwerp, optimalisatie, secrets, caching | Pipelinewerk |
| `/aws-architect` | AWS-architectuurontwerp: VPC, IAM, ECS, RDS, CloudFront | AWS-infrastructuur |

### Agents

| Agent | Model | Wanneer in te schakelen |
|---|---|---|
| `sre-engineer` | Sonnet | Betrouwbaarheidsanalyse, SLO-ontwerp, foutbudgetbeslissingen |
| `incident-commander` | Sonnet | Coördinatie van grote incidenten, structuur van de oorlogsruimte |
| `platform-engineer` | Sonnet | Developer experience, interne tooling, platformontwerp |
| `kubernetes-architect` | Opus | Complexe K8s-architectuur, multi-cluster, service mesh |

---

## Dagelijkse workflow

### Ochtend infrastructuurgezondheidcheck (15-20 minuten)

```
/observability-designer

Ochtend infrastructuurreview — [DATUM]:

Diensten: [geef een lijst van je kerndiensten]
Tijdsperiode: afgelopen 24 uur

Haal op uit je dashboards en plak of beschrijf:
- P1 of P2 alarmen die 's nachts zijn afgegaan?
- Huidige foutratio's per dienst vs. SLO
- Diensten met foutbudgetverbrandingsratio > 1x (sneller verbranden dan toegestaan)?
- Deployactiviteit in de afgelopen 24 uur: uitrollingen in uitvoering of recent voltooid?
- Databasegezondheid: replicatievertraging, verbindingstelling, trage query's
- Kostenanomalieën (piek in clouduitgaven)?

Triageoutput:
- Wat vereist vandaag actie?
- Wat is het waard om te monitoren maar niet dringend?
- Wat kan ik zonder actie sluiten?
```

### Infrastructuurwijzigingsplanning

```
/terraform (of /kubernetes of /aws-architect)

Ik plan deze infrastructuurwijziging: [beschrijf]

Voor implementatie:
1. Wat zijn de risico's van deze wijziging?
2. Wat moet ik testen in staging voor ik het op productie toepas?
3. Is er een veiligere manier om deze wijziging incrementeel door te voeren?
4. Wat is het rollbackplan als dit mislukt?
5. Wie moet dit reviewen voor ik het toepas?
6. Welke monitoring moet ik direct na de wijziging bekijken?

Wijziging: [plak het Terraform-plan of kubectl-diff of beschrijf de wijziging]
```

### CI/CD pipeline-onderhoud

```
/github-actions

Review en optimaliseer mijn CI/CD-pipeline.

Huidige pipeline: [plak workflow-YAML of beschrijf]
Pijnpunten: [trage builds / instabiele tests / secret management-problemen / cache-missers]
Gewenste verbetering: [sneller / betrouwbaarder / betere beveiliging / goedkoper]

Analyseer:
1. Wat is het kritieke pad — welke stappen vertragen de pipeline het meest?
2. Wat kan parallel lopen dat nu sequentieel loopt?
3. Zijn er cachingkansen die worden gemist?
4. Beveiligingsantipatronen (hardcoded secrets, te permissieve GITHUB_TOKEN, etc.)?
5. Geoptimaliseerde versie van de pipeline met uitleg

Genereer de verbeterde workflow-YAML.
```

---

## Kernworkflows per scenario

### Nieuwe dienst naar productie

```
Stap 1: SLO-ontwerp
/slo-architect
Definieer SLO's voor [dienstnaam]:
- Beschikbaarheid: welk % uptime is acceptabel?
- Latentie: p50 / p95 / p99-doelen
- Foutratio: welke foutratio triggert een alarm?
- Foutbudget: hoeveel foutbudget per 30 dagen?

Stap 2: Observability
/observability-designer
Ontwerp de monitoringsstack voor [dienst]:
- Kernmetrics te instrumenteren (RED-methode: Rate, Errors, Duration)
- Logstructuur en retentie
- Gedistribueerde trace-opzet
- Dashboardindeling voor on-call engineers

Stap 3: Runbook
/oncall-runbook
Genereer het initiële runbook voor [dienst]:
- Dienstoverzicht
- Bekende faalmodi (ook pre-lancering — gebaseerd op de architectuur)
- Escalatiepad
- Eerste-dag alarmresponsen

Stap 4: Capaciteitsbaseline
/capacity-planner
Stel capaciteitsbaseline en schaaldrempels in:
- Verwacht startverkeer
- Auto-schaling configuratie
- Kostenprognose voor de eerste 3 maanden
```

### Incidentrespons

```
/incident-response

Incident: [beschrijf wat er gebeurt]
Ernst: [P1 / P2 / P3]
Getroffen diensten: [lijst]
Klantimpact: [beschrijf]
Begintijd: [wanneer begon dit?]

Voer gestructureerde incidentrespons uit:
1. Initiële beoordeling en bevestiging van ernst
2. Oorlogsruimte-opzet (wie te pagen, communicatiekanaal)
3. Onmiddellijke mitigatieoptien
4. Onderzoekspad (welke logs, metrics en traces eerst bekijken)
5. Stakeholdercommunicatiesjabloon
6. Wanneer te escaleren vs. wanneer door te rechercheren
```

### Postmortem na een incident

```
/incident-response

Schrijf de postmortem voor [INCIDENTNAAM] op [DATUM].

Tijdlijn (plak je incidentkanaalgeschiedenis of notities):
[plak tijdlijn]

Impact:
- Duur: [X minuten]
- Getroffen diensten: [lijst]
- Getroffen klanten: [N of %]
- Omzetimpact (indien bekend): [$X]

Oorzaak (wat je hebt gevonden):
[beschrijf]

Bijdragende factoren:
[beschrijf]

Wat we goed deden:
[beschrijf]

Genereer: gestructureerde postmortem met tijdlijn, oorzaakanalyse, bijdragende factoren, actiepunten (met eigenaren en vervaldatums) en de ene monitoring- of alarmwijziging die dit eerder had gedetecteerd.
```

### Terraform-infrastructuurreview

```
/terraform

Review dit Terraform-plan voor ik het op productie toepas.

Omgeving: [productie / staging]
Wijzigingstype: [nieuwe resource / modificatie / verwijdering]

Planoutput:
[plak terraform plan-output]

Review op:
1. Resourceverwijderingen die onverwacht of riskant zijn
2. Beveiligingsmisconfiguraties (open beveiligingsgroepen, publieke S3-buckets, IAM-overpermissie)
3. Ontbrekende tags of naamconventieovertr eding
4. Statusbeheerproblemen (gevoelige data in status, statusvergrendelingsproblemen)
5. Kostenimpactschatting voor de wijziging

Ook: wat moet ik in de 30 minuten na het toepassen bekijken?
```

---

## 30-daags inwerklist (DevOps-engineer nieuw in een team of systeem)

### Week 1 — Breng het landschap in kaart
- Installeer alle DevOps-skills en agents
- Voer `/oncall-runbook`-audit uit op de 3 meest kritieke diensten — identificeer gaten
- Breng de huidige SLO's in kaart: bestaan ze? Worden ze gemeten? Gebruik `/slo-architect` om te beoordelen
- Woon één volledige incidentcyclus bij — ook als er geen is, review de laatste 3 postmortems

### Week 2 — Bouw operationeel vertrouwen
- Gebruik `/observability-designer` om een monitoringsgapanalyse te bouwen — wat wordt bewaakt en wat niet
- Voer `/capacity-planner` uit op de top 2 diensten — begrijp het kosten- en schaalmodel
- Stel een CLAUDE.md in met infrastructuurcontext (accounts, clusters, kerndiensten) zodat Claude altijd context heeft

### Week 3 — Verbeter het systeem
- Kies het slechtste runbook (meest vaag, meest verouderd) en herschrijf het met `/oncall-runbook`
- Optimaliseer één CI/CD-pipeline die de meeste pijn veroorzaakt met `/github-actions`
- Stel of review één Terraform-module op met `/terraform`

### Week 4 — Bezit een deel ervan
- Neem je eerste on-call dienst met de verbeterde runbooks
- Voer een chaos game day-simulatie uit met `/incident-response` om je runbooks te testen
- Schrijf je eerste capaciteitsforecast voor het komende kwartaal met `/capacity-planner`

---

## CLAUDE.md voor DevOps-engineers

Maak een project-niveau `CLAUDE.md` zodat Claude infrastructuurcontext heeft:

```markdown
# Infrastructuurcontext

Cloudprovider: [AWS / GCP / Azure]
Primaire regio: [us-east-1 / europe-west1 / etc.]
Secundaire regio: [indien van toepassing]

## Kerndiensten
- [dienstnaam]: [wat het doet, taal, cluster/namespace]
- [dienstnaam]: [...]

## Kubernetes-clusters
- Productie: [clusternaam, toegangsmethode]
- Staging: [clusternaam]
- Tools: [clusternaam — voor interne tooling]

## IaC
- Tool: [Terraform / Pulumi / CDK]
- Status: [S3-bucket / Terraform Cloud / lokaal]
- Modulestructuur: [monorepo / per-dienst / gedeelde module-bibliotheek]

## CI/CD
- Platform: [GitHub Actions / GitLab CI / CircleCI]
- Deploymethode: [ArgoCD / Helm / raw kubectl / CDK-pipelines]
- Omgevingen: [dev / staging / productie — hoe worden ze gepromoveerd?]

## Monitoring
- Metrics: [Datadog / Prometheus + Grafana / CloudWatch]
- Logs: [Datadog / ELK / Loki]
- Traces: [Datadog APM / Jaeger / Honeycomb]
- Alarmering: [PagerDuty / OpsGenie]

## SLO's
- [dienst]: [SLO-definitie]
- [dienst]: [...]

## On-call rotatie
- Schema: [PagerDuty-rotatienaam]
- Escalatie: [naam engineering lead, Slack, telefoon]
```

---

## Tool-integraties

### PagerDuty

```json
{
  "mcpServers": {
    "pagerduty": {
      "command": "npx",
      "args": ["-y", "@pagerduty/mcp-server"],
      "env": {
        "PAGERDUTY_API_KEY": "your-key"
      }
    }
  }
}
```

Met PagerDuty verbonden kan Claude incidentgeschiedenis ophalen om runbooks te genereren, huidige on-call-schema's controleren en recente alarmen weergeven — zonder van context te wisselen.

### Datadog

Verbind de Datadog MCP om Claude direct metrics en logs te laten opvragen tijdens incidentrespons. In plaats van dashboards te kopiëren kan Claude live query's uitvoeren en de resultaten in context interpreteren.

### AWS (via CLI of MCP)

Configureer AWS-inloggegevens in je omgeving. Claude Code kan dan de Bash-tool gebruiken om `aws` CLI-opdrachten uit te voeren voor live infrastructuurstatus — `aws ec2 describe-instances`, `aws cloudwatch get-metric-statistics`, `aws rds describe-db-instances` — in context met je incident- of capaciteitsplanningssessie.

### Terraform Cloud

Verbind Terraform Cloud via de API om Claude planoutputs en recente rungeschiedenis te laten lezen. Combineer met `/terraform` voor pre-apply-reviewsessies waar Claude het werkelijke plan ziet, niet een beschrijving ervan.

---

## Te volgen metrics

### Betrouwbaarheid

| Metric | Doel | Waarschuwingssignaal |
|---|---|---|
| Dienstbeschikbaarheid | Per SLO (bijv. 99,9%) | Foutbudgetverbrandingsratio > 2x |
| P99-latentie | Per SLO (bijv. < 500ms) | Aanhoudende overschrijding voor > 5 minuten |
| MTTR (gemiddelde hersteltijd) | < 30 min voor P1 | > 60 min: runbooks of detectiekloof |
| MTTD (gemiddelde detectietijd) | < 5 min voor P1 | > 15 min: alarmkloof |
| Deployfrequentie | Dagelijks tot wekelijks | < Maandelijks: leveringsbottleneck |
| Change failure rate | < 5% | > 10%: test- of reviewprobleem |

### Infrastructuurkosten

| Metric | Doel | Signaal |
|---|---|---|
| Maand-over-maand kostengroei | ≤ verkeersgroei % | Snellere groei: verspilling |
| CPU-gebruik over fleet | 40-70% gemiddeld | < 30%: overprovisioned |
| Reserved instance-dekking | > 60% voor stabiele workloads | < 40%: te veel betalen on-demand |
| Kosten per verzoek | Daalt in de loop van de tijd | Stijgt: efficiëntieprobleem |

---

## Veelgemaakte DevOps-fouten die Claude Code helpt te vermijden

**Fout 1: Runbooks die verouderd zijn**
`/oncall-runbook` bevat een versheidscheck — elk runbook dat al meer dan 90 dagen niet is bijgewerkt wordt gemarkeerd. Gebruik de auditmodus voor elke on-call-rotatieoverdracht.

**Fout 2: Capaciteitsverrassingen**
`/capacity-planner` bouwt een 12-maandsprognose met schaaldrempels. Stel de CPU-alarmdrempels in vanuit de prognose, niet vanuit raden.

**Fout 3: SLO's zonder foutbudgetten**
`/slo-architect` genereert de volledige SLO-definitie inclusief foutbudgetberekening. Definieer beschikbaarheid nooit zonder te definiëren wat je doet als het budget verbrandt.

**Fout 4: Postmortems zonder uitvoerbare output**
`/incident-response` genereert postmortems met expliciet toegewezen actiepunten, eigenaren en vervaldatums. "We zullen de monitoring verbeteren" is geen actiepunt.

**Fout 5: Terraform-wijzigingen toegepast zonder review**
`/terraform` bevat een risicoanalyse en rollbackplan voor elke planreview. Voer het uit voor elke productie `terraform apply`.

---

## Bronnen

- [Aan de slag met Claude Code](getting-started.md)
- [DevOps incident workflow](../workflows/devops-incident.md)
- [On-call runbook skill](../skills/devops-infra/oncall-runbook.md)
- [Capacity planner skill](../skills/devops-infra/capacity-planner.md)
- [SLO architect skill](../skills/devops-infra/slo-architect.md)
- [SRE engineer agent](../agents/roles/sre-engineer.md)

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
