# Claude für DevOps- und Platform-Engineers

Alles, was ein DevOps- oder Platform-Engineer für KI-gestützte Infrastrukturoperationen benötigt — Incident-Response, Runbooks, IaC, CI/CD-Pipelines, Kapazitätsplanung, SLO-Management und die täglichen Rhythmen, um Produktion gesund zu halten.

---

## Für wen dieser Leitfaden ist

Du bist DevOps-Engineer, SRE oder Platform-Engineer und verantwortlich für Infrastruktur-Zuverlässigkeit, Deployment-Pipelines und den operativen Zustand von Produktionssystemen. Du hast On-Call-Dienst, schreibst Terraform und Kubernetes-Manifeste, besitzt die CI/CD-Pipelines und bist die erste Verteidigungslinie, wenn etwas kaputtgeht.

**Vor Claude Code:** 2 Stunden für das Schreiben eines Runbooks. 30 Minuten für einen Postmortem-Entwurf. Ein halber Tag für das Design einer neuen Monitoring-Strategie. IaC-Änderungen werden langsam geprüft, weil sie für nicht-Infra-Stakeholder schwer zu erklären sind.

**Danach:** Runbook aus Incident-Historie in 20 Minuten generiert. Postmortem in 10 Minuten strukturiert. Terraform-Module mit sinnvollen Standardwerten in einer Session entworfen. Monitoring-Strategie mit eingebautem SLO-Kontext entwickelt.

---

## 30-Sekunden-Installation

```bash
# Den vollständigen DevOps/Platform-Stack installieren
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

## Dein Claude Code DevOps-Stack

### Skills (Slash-Befehle)

| Skill | Was er tut | Wann verwenden |
|---|---|---|
| `/incident-response` | Strukturierte Incident-Response: Triage, War Room, Postmortem | Bei jedem Produktions-Incident |
| `/oncall-runbook` | Runbooks aus Incident-Historie generieren, bestehende prüfen | Vor neuen On-Call-Services, nach Incidents |
| `/observability-designer` | Strategie für Metriken, Logs, Traces entwerfen — Datadog, Prometheus, OTel | Neue Services, Monitoring-Lücken |
| `/slo-architect` | SLOs, Error-Budgets, Alerting-Schwellenwerte definieren | Neue Services, SLO-Reviews |
| `/capacity-planner` | Ressourcenbedarf prognostizieren, Kostenprojektionen, Skalierungsschwellenwerte | Quartalsplanung, Pre-Launch |
| `/kubernetes` | K8s-Manifeste, HPA, Ressourcenlimits, Debugging, Netzwerkrichtlinien | Jede K8s-Arbeit |
| `/terraform` | IaC-Module, State-Management, Import, Plan-Review | Jede Infrastruktur-Provisionierung |
| `/docker` | Dockerfiles, Multi-Stage-Builds, Image-Optimierung, Compose | Container-Arbeit |
| `/github-actions` | CI/CD-Pipeline-Design, Optimierung, Secrets, Caching | Pipeline-Arbeit |
| `/aws-architect` | AWS-Architektur-Design: VPC, IAM, ECS, RDS, CloudFront | AWS-Infrastruktur |

### Agenten

| Agent | Modell | Wann einsetzen |
|---|---|---|
| `sre-engineer` | Sonnet | Zuverlässigkeitsanalyse, SLO-Design, Error-Budget-Entscheidungen |
| `incident-commander` | Sonnet | Koordination bei größeren Incidents, War-Room-Struktur |
| `platform-engineer` | Sonnet | Developer Experience, internes Tooling, Plattform-Design |
| `kubernetes-architect` | Opus | Komplexe K8s-Architektur, Multi-Cluster, Service Mesh |

---

## Täglicher Workflow

### Morgen-Infrastruktur-Health-Check (15–20 Minuten)

```
/observability-designer

Morgen-Infrastruktur-Review — [DATUM]:

Services: [deine wichtigsten Services auflisten]
Zeitraum: letzte 24 Stunden

Aus deinen Dashboards abrufen und einfügen oder beschreiben:
- Über Nacht ausgelöste P1- oder P2-Alerts?
- Aktuelle Fehlerraten für jeden Service vs. SLO
- Services mit Error-Budget-Burn-Rate > 1x (schneller als erlaubt verbrauchend)?
- Deployment-Aktivität in den letzten 24 Stunden: Rollouts in Bearbeitung oder kürzlich abgeschlossen?
- Datenbank-Gesundheit: Replikations-Lag, Verbindungsanzahl, langsame Abfragen
- Kosten-Anomalien (Anstieg in Cloud-Ausgaben)?

Triage-Output:
- Was erfordert heute Maßnahmen?
- Was ist es wert zu beobachten, aber nicht dringend?
- Was kann ich ohne Maßnahme schließen?
```

### Infrastruktur-Änderungsplanung

```
/terraform (oder /kubernetes oder /aws-architect)

Ich plane diese Infrastrukturänderung: [beschreiben]

Vor der Implementierung:
1. Was sind die Risiken dieser Änderung?
2. Was sollte ich in Staging testen, bevor ich auf Produktion anwende?
3. Gibt es einen sichereren Weg, diese Änderung schrittweise durchzuführen?
4. Was ist der Rollback-Plan, wenn dies fehlschlägt?
5. Wer sollte das prüfen, bevor ich es anwende?
6. Welches Monitoring sollte ich unmittelbar nach der Änderung beobachten?

Änderung: [Terraform-Plan, kubectl-Diff einfügen oder Änderung beschreiben]
```

### CI/CD-Pipeline-Pflege

```
/github-actions

Meine CI/CD-Pipeline prüfen und optimieren.

Aktuelle Pipeline: [Workflow-YAML einfügen oder beschreiben]
Pain Points: [langsame Builds / flaky Tests / Secret-Management-Probleme / Cache-Misses]
Gewünschte Verbesserung: [schneller / zuverlässiger / bessere Sicherheit / günstiger]

Analysieren:
1. Was ist der kritische Pfad — welche Schritte verlangsamen die Pipeline am meisten?
2. Was kann parallel laufen, das derzeit sequenziell läuft?
3. Gibt es ungenutzte Caching-Möglichkeiten?
4. Sicherheits-Anti-Patterns (hartcodierte Secrets, zu permissives GITHUB_TOKEN, etc.)?
5. Optimierte Version der Pipeline mit Erklärungen

Den verbesserten Workflow-YAML generieren.
```

---

## Wichtige Workflows nach Szenario

### Neuer Service geht in Produktion

```
Schritt 1: SLO-Design
/slo-architect
SLOs für [Service-Name] definieren:
- Verfügbarkeit: Welcher Uptime-Prozentsatz ist akzeptabel?
- Latenz: p50 / p95 / p99 Ziele
- Fehlerrate: Welche Fehlerrate löst einen Alert aus?
- Error-Budget: Wie viel Error-Budget pro 30 Tage?

Schritt 2: Observability
/observability-designer
Den Monitoring-Stack für [Service] entwerfen:
- Wichtige zu instrumentierende Metriken (RED-Methode: Rate, Errors, Duration)
- Log-Struktur und Retention
- Distributed-Tracing-Setup
- Dashboard-Layout für On-Call-Engineers

Schritt 3: Runbook
/oncall-runbook
Das initiale Runbook für [Service] generieren:
- Service-Übersicht
- Bekannte Ausfallmodi (auch pre-Launch — basierend auf der Architektur)
- Eskalationspfad
- Erste-Tag-Alert-Antworten

Schritt 4: Kapazitäts-Baseline
/capacity-planner
Kapazitäts-Baseline und Skalierungsauslöser festlegen:
- Erwarteter Launch-Traffic
- Auto-Scaling-Konfiguration
- Kostenprognose für die ersten 3 Monate
```

### Incident-Response

```
/incident-response

Incident: [was passiert]
Schweregrad: [P1 / P2 / P3]
Betroffene Services: [Liste]
Kundenauswirkung: [beschreiben]
Zeitpunkt des Beginns: [wann hat das angefangen?]

Strukturierte Incident-Response durchführen:
1. Erstbeurteilung und Schweregradsbestätigung
2. War-Room-Setup (wen benachrichtigen, Kommunikationskanal)
3. Sofortige Mitigationsoptionen
4. Untersuchungspfad (welche Logs, Metriken und Traces zuerst betrachten)
5. Stakeholder-Kommunikationsvorlage
6. Wann eskalieren vs. wann weitersuchen
```

### Postmortem nach einem Incident

```
/incident-response

Den Postmortem für [INCIDENT-NAME] vom [DATUM] schreiben.

Timeline (Incident-Kanal-Historie oder Notizen einfügen):
[Timeline einfügen]

Auswirkung:
- Dauer: [X Minuten]
- Betroffene Services: [Liste]
- Betroffene Kunden: [N oder %]
- Umsatzauswirkung (falls bekannt): [$X]

Grundursache (was gefunden wurde):
[beschreiben]

Beitragende Faktoren:
[beschreiben]

Was wir gut gemacht haben:
[beschreiben]

Generieren: strukturierten Postmortem mit Timeline, Grundursachen-Analyse, beitragenden Faktoren, Action Items (mit Verantwortlichen und Fälligkeitsdaten) und der einen Monitoring- oder Alerting-Änderung, die dies schneller erkannt hätte.
```

### Terraform-Infrastruktur-Review

```
/terraform

Diesen Terraform-Plan prüfen, bevor ich ihn auf Produktion anwende.

Umgebung: [Produktion / Staging]
Änderungstyp: [neue Ressource / Modifikation / Zerstörung]

Plan-Output:
[terraform plan Output einfügen]

Prüfen auf:
1. Ressource-Zerstörungen, die unerwartet oder riskant sind
2. Sicherheitsfehlkonfigurationen (offene Security Groups, öffentliche S3-Buckets, IAM-Überberechtigung)
3. Fehlende Tags oder Namenskonventions-Verletzungen
4. State-Management-Probleme (sensible Daten im State, State-Lock-Probleme)
5. Kostenwirkungsschätzung für die Änderung

Außerdem: Was sollte ich in den 30 Minuten nach dem Anwenden beobachten?
```

---

## 30-Tage-Einarbeitungsplan (DevOps-Engineer neu in einem Team oder System)

### Woche 1 — Landschaft kartieren
- Alle DevOps-Skills und Agenten installieren
- `/oncall-runbook`-Audit für die 3 kritischsten Services ausführen — Lücken identifizieren
- Aktuelle SLOs kartieren: Existieren sie? Werden sie gemessen? `/slo-architect` zur Beurteilung verwenden
- Einen vollständigen Incident-Zyklus begleiten — auch wenn keiner passiert, die letzten 3 Postmortems prüfen

### Woche 2 — Operative Sicherheit aufbauen
- `/observability-designer` verwenden, um eine Monitoring-Lückenanalyse zu erstellen — was überwacht wird und was nicht
- `/capacity-planner` für die Top-2-Services ausführen — Kosten- und Skalierungsmodell verstehen
- Eine CLAUDE.md mit Infrastrukturkontext einrichten (Accounts, Cluster, Schlüsselservices), damit Claude immer Kontext hat

### Woche 3 — Das System verbessern
- Das schlechteste Runbook (das vagueste, veralteste) mit `/oncall-runbook` neu schreiben
- Eine CI/CD-Pipeline, die den meisten Schmerz verursacht, mit `/github-actions` optimieren
- Ein Terraform-Modul mit `/terraform` entwerfen oder überprüfen

### Woche 4 — Verantwortung übernehmen
- Erste On-Call-Schicht mit den verbesserten Runbooks übernehmen
- Chaos-Game-Day-Simulation mit `/incident-response` durchführen, um Runbooks zu testen
- Erste Kapazitätsprognose für das kommende Quartal mit `/capacity-planner` schreiben

---

## CLAUDE.md für DevOps-Engineers

Eine projekt-weite `CLAUDE.md` erstellen, damit Claude Infrastrukturkontext hat:

```markdown
# Infrastrukturkontext

Cloud-Anbieter: [AWS / GCP / Azure]
Primäre Region: [us-east-1 / europe-west1 / etc.]
Sekundäre Region: [falls zutreffend]

## Wichtige Services
- [service-name]: [was er tut, Sprache, Cluster/Namespace]
- [service-name]: [...]

## Kubernetes-Cluster
- Produktion: [Cluster-Name, Zugriffsmethode]
- Staging: [Cluster-Name]
- Tools: [Cluster-Name — für internes Tooling]

## IaC
- Tool: [Terraform / Pulumi / CDK]
- State: [S3-Bucket / Terraform Cloud / lokal]
- Modulstruktur: [Monorepo / pro Service / gemeinsame Modulbibliothek]

## CI/CD
- Plattform: [GitHub Actions / GitLab CI / CircleCI]
- Deployment-Methode: [ArgoCD / Helm / raw kubectl / CDK Pipelines]
- Umgebungen: [dev / staging / Produktion — wie werden sie promoted?]

## Monitoring
- Metriken: [Datadog / Prometheus + Grafana / CloudWatch]
- Logs: [Datadog / ELK / Loki]
- Traces: [Datadog APM / Jaeger / Honeycomb]
- Alerting: [PagerDuty / OpsGenie]

## SLOs
- [service]: [SLO-Definition]
- [service]: [...]

## On-Call-Rotation
- Zeitplan: [PagerDuty-Rotationsname]
- Eskalation: [Engineering-Lead-Name, Slack, Telefon]
```

---

## Tool-Integrationen

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

Mit PagerDuty verbunden kann Claude Incident-Historie abrufen, um Runbooks zu generieren, aktuelle On-Call-Pläne prüfen und aktuelle Alerts auflisten — ohne den Kontext zu wechseln.

### Datadog

Datadog MCP verbinden, um Claude direkt Metriken und Logs während der Incident-Response abfragen zu lassen. Statt Dashboards zu kopieren, kann Claude Live-Abfragen ausführen und die Ergebnisse im Kontext interpretieren.

### AWS (per CLI oder MCP)

AWS-Credentials in der Umgebung konfigurieren. Claude Code kann dann das Bash-Tool verwenden, um `aws`-CLI-Befehle für den Live-Infrastrukturstatus auszuführen — `aws ec2 describe-instances`, `aws cloudwatch get-metric-statistics`, `aws rds describe-db-instances` — im Kontext des Incident- oder Kapazitätsplanungs-Sessions.

### Terraform Cloud

Terraform Cloud per API verbinden, um Claude Plan-Outputs und aktuelle Run-Historie lesen zu lassen. Mit `/terraform` für Pre-Apply-Review-Sessions kombinieren, wo Claude den tatsächlichen Plan sieht, nicht eine Beschreibung davon.

---

## Zu verfolgende Metriken

### Zuverlässigkeit

| Metrik | Ziel | Warnsignal |
|---|---|---|
| Service-Verfügbarkeit | Gemäß SLO (z. B. 99,9 %) | Error-Budget-Burn-Rate > 2x |
| P99-Latenz | Gemäß SLO (z. B. < 500 ms) | Anhaltender Verstoß für > 5 Minuten |
| MTTR (Mean Time to Resolve) | < 30 Min für P1 | > 60 Min: Runbook- oder Erkennungslücke |
| MTTD (Mean Time to Detect) | < 5 Min für P1 | > 15 Min: Alerting-Lücke |
| Deployment-Frequenz | Täglich bis wöchentlich | < Monatlich: Delivery-Engpass |
| Change-Failure-Rate | < 5 % | > 10 %: Test- oder Review-Problem |

### Infrastrukturkosten

| Metrik | Ziel | Signal |
|---|---|---|
| Monat-über-Monat-Kostenwachstum | ≤ Traffic-Wachstum % | Schnelleres Wachstum: Verschwendung |
| CPU-Auslastung über Fleet | 40–70 % Durchschnitt | < 30 %: Über-provisioniert |
| Reserved-Instance-Coverage | > 60 % für stabile Workloads | < 40 %: Zu viel On-Demand-Zahlung |
| Kosten pro Anfrage | Über Zeit sinkend | Steigend: Effizienzproblem |

---

## Häufige DevOps-Fehler, bei denen Claude Code hilft

**Fehler 1: Runbooks, die veraltet sind**
`/oncall-runbook` enthält einen Freshness-Check — jedes Runbook, das seit 90 Tagen nicht aktualisiert wurde, wird markiert. Den Audit-Modus vor jeder On-Call-Rotationsübergabe verwenden.

**Fehler 2: Kapazitätsüberraschungen**
`/capacity-planner` erstellt eine 12-Monats-Prognose mit Skalierungsauslösern. CPU-Alert-Schwellenwerte aus der Prognose festlegen, nicht aus dem Raten.

**Fehler 3: SLOs ohne Error-Budgets**
`/slo-architect` generiert die vollständige SLO-Definition einschließlich Error-Budget-Berechnung. Verfügbarkeit nie definieren, ohne zu definieren, was getan wird, wenn das Budget verbrennt.

**Fehler 4: Postmortems ohne umsetzbaren Output**
`/incident-response` generiert Postmortems mit explizit zugewiesenen Action Items, Verantwortlichen und Fälligkeitsdaten. "Wir werden das Monitoring verbessern" ist kein Action Item.

**Fehler 5: Terraform-Änderungen ohne Review anwenden**
`/terraform` enthält eine Risikoanalyse und einen Rollback-Plan für jedes Plan-Review. Vor jedem Produktions-`terraform apply` ausführen.

---

## Ressourcen

- [Erste Schritte mit Claude Code](getting-started.md)
- [DevOps-Incident-Workflow](../workflows/devops-incident.md)
- [On-Call-Runbook-Skill](../skills/devops-infra/oncall-runbook.md)
- [Capacity-Planner-Skill](../skills/devops-infra/capacity-planner.md)
- [SLO-Architect-Skill](../skills/devops-infra/slo-architect.md)
- [SRE-Engineer-Agent](../agents/roles/sre-engineer.md)

---
