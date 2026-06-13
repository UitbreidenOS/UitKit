---
description: Genereer productie-klare Kubernetes manifesten voor de huidige applicatie
argument-hint: "[resource-type of app-name] [namespace]"
---
Genereer productie-klare Kubernetes manifesten voor: $ARGUMENTS

Inspecteer het project om het workload-type te bepalen (stateless service, worker, CronJob, StatefulSet). Kies de juiste resource dienovereenkomstig.

Output alle manifesten als aparte YAML-documenten gescheiden door `---` in één bestand.

Neem deze resources op:
- `Namespace` als een niet-standaard namespace is opgegeven
- `Deployment` of `StatefulSet` voor de primaire workload
- `Service` (ClusterIP standaard; noteer wanneer LoadBalancer/NodePort gerechtvaardigd is)
- `ConfigMap` voor niet-gevoelige configuratie
- `Secret` met base64-gecodeerde placeholderwaarden en een duidelijke waarschuwing om deze vóór toepassing te vervangen
- `HorizontalPodAutoscaler` gericht op CPU- en geheugenmetrics
- `PodDisruptionBudget` met `minAvailable: 1`
- `Ingress` als de service HTTP-facing is — gebruik nginx ingress class, voeg TLS-stanza toe met cert-manager annotatie

Workload spec-vereisten:
- `resources.requests` en `resources.limits` voor CPU en geheugen — grootte gebaseerd op de gedetecteerde stack
- `livenessProbe` en `readinessProbe` — HTTP of exec waar van toepassing; neem `initialDelaySeconds` en `failureThreshold` op
- Pod-level `securityContext`: `runAsNonRoot: true`, `seccompProfile: RuntimeDefault`
- Container-level `securityContext`: `readOnlyRootFilesystem: true`, `allowPrivilegeEscalation: false`, `capabilities: drop: [ALL]`
- `terminationGracePeriodSeconds` afgestemd op het shutdown-gedrag van de app
- `topologySpreadConstraints` om over nodes en zones te spreiden
- `app.kubernetes.io/*` standaard labels op elke resource

Na de manifesten, output een checklist met items die moeten worden voltooid vóór `kubectl apply`:
1. Vervang de image tag placeholder met de echte digest of semver tag
2. Vul Secret-waarden in (of verwijs naar een external secrets operator)
3. Stel ingress hostname en TLS secret name in
4. Bevestig storage class name als u een StatefulSet met PVCs gebruikt
5. Controleer of HPA metric names overeenkomen met uw metrics-server of Prometheus adapter config
