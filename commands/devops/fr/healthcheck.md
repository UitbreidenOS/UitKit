---
description: Ajouter ou auditer les endpoints de vérification de santé et les configurations de sondes pour le service actuel
argument-hint: "[nom du service ou chemin de fichier]"
---
Ajouter ou auditer la couverture de vérification de santé pour : $ARGUMENTS

Inspecter le projet pour identifier le framework, le type de serveur et les implémentations de vérification de santé existantes.

**S'il n'existe aucun endpoint de santé — les implémenter :**

Générer le code minimal pour ajouter :
1. `GET /healthz` (vivacité) — retourne `200 OK` avec `{"status":"ok"}` si le processus est vivant ; aucune vérification de dépendance
2. `GET /readyz` (disponibilité) — retourne `200 OK` uniquement si toutes les dépendances critiques (DB, cache, services en aval) sont accessibles ; retourne `503` avec un corps JSON listant les vérifications qui ont échoué
3. `GET /metrics` — exposition compatible Prometheus si le framework le supporte (sinon noter ce qui est nécessaire)

Règles d'implémentation :
- Les deux endpoints doivent répondre en moins de 100ms sous charge normale
- Les vérifications de dépendance `/readyz` doivent avoir des délais d'attente (2s par défaut par vérification) — ne jamais bloquer indéfiniment
- Ne pas exiger d'authentification sur `/healthz` ou `/readyz` — les sondes doivent être non authentifiées
- Enregistrer les défaillances au niveau WARN, non ERROR — les défaillances de sonde sont des signaux opérationnels, pas des erreurs d'application
- Pour la vérification DB `/readyz` : utiliser une requête légère (`SELECT 1`) et non une introspection de schéma

**Si les endpoints de santé existent déjà — les auditer :**

Vérifier :
- Conflation de vivacité vs disponibilité (une sonde de vivacité qui vérifie la DB redémarrera les pods en cas de panne DB — incorrect)
- Délai d'attente manquant sur les vérifications de dépendance
- Endpoints qui retournent 200 avec un corps d'erreur (casse toutes les sondes)
- Configurations de sonde dans Kubernetes/Compose qui sont trop agressives (`failureThreshold: 1`) ou trop clémentes (pas de `initialDelaySeconds`)

**Dans tous les cas, afficher la configuration de sonde correspondante pour chaque cible de déploiement trouvée dans le projet :**

Kubernetes :
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

Docker Compose :
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:<port>/healthz"]
  interval: 15s
  timeout: 5s
  retries: 3
  start_period: 10s
```

Signaler tout ce qui causerait des redémarrages faux positifs ou des défaillances silencieuses de disponibilité.
