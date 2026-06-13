---
description: Générer un plan de restauration étape par étape pour le déploiement actuel ou une modification récente
argument-hint: "[nom du service, version, ou PR/commit à restaurer]"
---
Générez un plan de restauration pour : $ARGUMENTS

Inspectez le projet pour déterminer le mécanisme de déploiement (Kubernetes, ECS, Heroku, VM nue, Lambda, etc.), le pipeline CI/CD et les composants avec état (bases de données, files d'attente, caches, feature flags).

Produisez un runbook avec ces sections :

**1. Liste de vérification pré-restauration**
- Confirmez la version/révision cible précédente vers laquelle effectuer la restauration (étiquette d'image, SHA Git, révision Helm)
- Identifiez qui doit approuver avant l'exécution (chef on-call, commandant d'incident)
- Vérifiez que l'artefact précédent existe toujours dans le registre/magasin — sinon, signalez immédiatement
- Listez toute migration de schéma appliquée depuis la version précédente (les migrations irréversibles bloquent une restauration propre)

**2. Évaluation de l'impact**
- Temps d'arrêt estimé ou fenêtre dégradée pendant la restauration
- Les utilisateurs/tenants/régions affectés
- Toute donnée écrite depuis le mauvais déploiement qui peut être incompatible avec le schéma précédent

**3. Étapes de restauration** (numérotées, commandes prêtes à copier-coller)

Pour Kubernetes :
```
kubectl rollout undo deployment/<name> -n <namespace>
kubectl rollout status deployment/<name> -n <namespace>
kubectl get pods -n <namespace> -w
```

Pour Helm :
```
helm history <release> -n <namespace>
helm rollback <release> <revision> -n <namespace>
```

Pour les migrations de base de données : fournissez la commande de migration descendante exacte ou notez qu'une inversion manuelle du schéma est requise et spécifiez le SQL à exécuter.

Pour les feature flags : listez les drapeaux qui doivent être désactivés avant ou après la restauration du binaire.

**4. Étapes de vérification**
- Commandes de test de fumée ou URL pour confirmer que le service est sain sur la version précédente
- Métriques clés à surveiller pendant 10 minutes après la restauration (taux d'erreur, latence p99, profondeur de file d'attente)

**5. Critères d'interruption**
- Conditions dans lesquelles la restauration elle-même doit être arrêtée et escaladée
- Secours en cas d'échec de la restauration (par exemple, basculement du trafic vers une région connue comme bonne)

**6. Actions post-restauration**
- Ouvrez un problème de suivi pour l'analyse de la cause première
- Préservez les journaux et les traces de la fenêtre d'incident avant leur expiration
- Calendrier pour tenter un re-déploiement avec la correction

Signalez toute étape qui ne peut pas être automatisée et nécessite un jugement humain ou un accès élevé.
