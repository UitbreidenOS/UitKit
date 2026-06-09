---
description: Productie-klaar Kubernetes-manifesten genereren voor de huidige applicatie
argument-hint: "[resource-type or app-name] [namespace]"
---
Productie-klaar Kubernetes-manifesten genereren voor: $ARGUMENTS

Inspecteer het project om het workload-type te bepalen (stateless service, worker, CronJob, StatefulSet). Kies de juiste resource dienovereenkomstig.

Voer alle manifesten uit als aparte YAML-documenten gescheiden door `---` in één bestand.

Neem deze resources op:
- `Namespace` als een niet-standaard namespace is opgegeven
- `Deployment` of `StatefulSet` voor de primaire workload
- `Service` (standaard ClusterIP; noteer wanneer LoadBalancer/NodePort gerechtvaardigd is)
- `ConfigMap` voor niet-gevoelige configuratie
- `Secret` met base64-gecodeerde placeholder-waarden en een duidelijke waarschuwing om te vervangen vóór het toepassen
- `HorizontalPodAutoscaler` gericht op CPU- en geheugenmetrieken
- `PodDisruptionBudget` met `minAvailable: 1`
- `Ingress` als de service HTTP-facing is — gebruik nginx ingress class, voeg TLS-stanza toe met cert-manager annotatie

Werkingsvereisten voor workload-spec:
- `resources.requests` en `resources.limits` voor CPU en geheugen — grootte op basis van de gedetecteerde stack
- `livenessProbe` en `readinessProbe` — HTTP of exec naar gelang van toepassing; voeg `initialDelaySeconds` en `failureThreshold` toe
- Pod-niveau `securityContext`: `runAsNonRoot: true`, `seccompProfile: RuntimeDefault`
- Container-niveau `securityContext`: `readOnlyRootFilesystem: true`, `allowPrivilegeEscalation: false`, `capabilities: drop: [ALL]`
- `terminationGracePeriodSeconds` afgestemd op het shutdown-gedrag van de app
- `topologySpreadConstraints` om verspreiding over nodes en zones te waarborgen
- `app.kubernetes.io/*` standaard labels op elke resource

Na de manifesten voert u een checklist uit van items die moeten worden voltooid vóór `kubectl apply`:
1. Vervang placeholder van image tag met de echte digest of semver tag
2. Vul Secret-waarden in (of verwijs naar een externe secrets operator)
3. Stel ingress hostname en TLS secret name in
4. Bevestig opslagklassennaam als u een StatefulSet met PVC's gebruikt
5. Controleer of HPA-metrieknamen overeenkomen met uw metrics-server of Prometheus adapter config
