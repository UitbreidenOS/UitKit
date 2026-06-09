---
description: Voeg gezondheidscontrolepunten toe of controleer probe-configuraties voor de huidige service
argument-hint: "[service name or file path]"
---
Voeg gezondheidscontroledekking toe of controleer deze voor: $ARGUMENTS

Inspecteer het project om het framework, het servertype en bestaande gezondheidscontroleimplementaties te identificeren.

**Indien geen gezondheidsendpoints bestaan — implementeer ze:**

Genereer de minimale code om toe te voegen:
1. `GET /healthz` (liveness) — retourneert `200 OK` met `{"status":"ok"}` als het proces actief is; geen afhankelijkheidscontroles
2. `GET /readyz` (readiness) — retourneert `200 OK` alleen als alle kritieke afhankelijkheden (DB, cache, downstreamservices) bereikbaar zijn; retourneert `503` met een JSON-body met een lijst van mislukte controles
3. `GET /metrics` — Prometheus-compatibele presentatie als het framework dit ondersteunt (anders noteren wat nodig is)

Implementatieregels:
- Beide endpoints moeten onder normale belasting in minder dan 100ms reageren
- `/readyz` afhankelijkheidscontroles moeten timeouts hebben (standaard 2s per controle) — blokkeer nooit oneindig
- Geen authenticatie vereist op `/healthz` of `/readyz` — probes moeten niet-geverifieerd zijn
- Log mislukkingen op WARN-niveau, niet ERROR — probe-fouten zijn operationele signalen, geen toepassingsfouten
- Voor `/readyz` DB-controle: gebruik een lichte query (`SELECT 1`) niet een schema-introspectie

**Indien gezondheidsendpoints al bestaan — controleer ze:**

Controleer op:
- Liveness versus readiness-vermenging (een liveness-probe die DB controleert zal pods herstarten bij DB-storing — fout)
- Ontbrekende timeout op afhankelijkheidscontroles
- Endpoints die 200 retourneren met een foutbody (beschadigt alle probes)
- Probe-configs in Kubernetes/Compose die te agressief zijn (`failureThreshold: 1`) of te toegeeflijk (geen `initialDelaySeconds`)

**Voer in alle gevallen de overeenkomstige probe-configuratie uit voor elk implementatiedoel dat in het project wordt gevonden:**

Kubernetes:
```yaml
livenessProbe:
  httpGet: { path: /healthz, port: <port> }
  initialDelaySeconds: 10
  periodSeconds: 15
  failureThreshold: 3

readinessProbe:
  httpGet: { path: /readyz, port: <port> }
  initialDelaySeconds: 5
  periodSeconds: 10
  failureThreshold: 3
```

Docker Compose:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:<port>/healthz"]
  interval: 15s
  timeout: 5s
  retries: 3
  start_period: 10s
```

Markeer alles wat valse-positieve herstart of stille readiness-fouten zou veroorzaken.
