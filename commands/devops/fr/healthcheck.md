---
description: Ajouter ou auditer les points de terminaison et les configurations de sonde de vérification d'intégrité pour le service actuel
argument-hint: "[service name or file path]"
---
Ajouter ou auditer la couverture des vérifications d'intégrité pour: $ARGUMENTS

Inspectez le projet pour identifier le framework, le type de serveur et les implémentations de vérification d'intégrité existantes.

**Si aucun point de terminaison de santé n'existe — implémentez-les:**

Générez le code minimal pour ajouter:
1. `GET /healthz` (liveness) — retourne `200 OK` avec `{"status":"ok"}` si le processus est en vie; aucune vérification de dépendance
2. `GET /readyz` (readiness) — retourne `200 OK` uniquement si toutes les dépendances critiques (DB, cache, services en aval) sont accessibles; retourne `503` avec un corps JSON listant les vérifications échouées
3. `GET /metrics` — exposition compatible Prometheus si le framework la supporte (sinon noter ce qui est nécessaire)

Règles d'implémentation:
- Les deux points de terminaison doivent répondre en moins de 100ms sous charge normale
- Les vérifications de dépendance de `/readyz` doivent avoir des délais d'expiration (2s par défaut par vérification) — ne jamais bloquer indéfiniment
- Ne pas exiger d'authentification sur `/healthz` ou `/readyz` — les sondes doivent être non authentifiées
- Enregistrer les défaillances au niveau WARN, non ERROR — les défaillances de sonde sont des signaux opérationnels, non des erreurs applicatives
- Pour la vérification DB de `/readyz`: utiliser une requête légère (`SELECT 1`) non une introspection de schéma

**Si des points de terminaison de santé existent déjà — auditez-les:**

Vérifiez:
- La conflation liveness vs readiness (une sonde de liveness qui vérifie la DB redémarrera les pods en cas de panne DB — mauvais)
- Délai d'expiration manquant sur les vérifications de dépendance
- Points de terminaison qui retournent 200 avec un corps d'erreur (casse toutes les sondes)
- Configurations de sonde dans Kubernetes/Compose qui sont trop agressives (`failureThreshold: 1`) ou trop indulgentes (pas de `initialDelaySeconds`)

**Dans tous les cas, produisez la configuration de sonde correspondante pour chaque cible de déploiement trouvée dans le projet:**

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

Signalez tout ce qui causerait des redémarrages de faux positifs ou des défaillances de readiness silencieuses.
