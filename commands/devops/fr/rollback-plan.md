---
description: Générer un plan de restauration étape par étape pour le déploiement actuel ou le changement récent
argument-hint: "[service name, version, or PR/commit to roll back]"
---
Générer un plan de restauration pour : $ARGUMENTS

Inspectez le projet pour déterminer le mécanisme de déploiement (Kubernetes, ECS, Heroku, VM nu, Lambda, etc.), le pipeline CI/CD, et tous les composants avec état (bases de données, files d'attente, caches, feature flags).

Produisez un runbook avec ces sections :

**1. Liste de contrôle pré-restauration**
- Confirmez la version/révision cible précédente à laquelle effectuer une restauration (image tag, Git SHA, révision Helm)
- Identifiez qui doit approuver avant exécution (on-call lead, incident commander)
- Vérifiez que l'artefact précédent existe toujours dans le registre/store — sinon, signalez immédiatement
- Listez les migrations de schéma appliquées depuis la version précédente (les migrations irréversibles bloquent une restauration propre)

**2. Évaluation de l'impact**
- Durée d'indisponibilité estimée ou fenêtre dégradée pendant la restauration
- Quels utilisateurs/tenants/régions sont affectés
- Toutes données écrites depuis le mauvais déploiement qui pourraient être incompatibles avec le schéma précédent

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

Pour migrations de base de données : fournissez la commande de down-migration exacte ou notez qu'une inversion manuelle du schéma est requise et spécifiez quel SQL doit être exécuté.

Pour feature flags : listez les flags qui doivent être désactivés avant ou après la restauration binaire.

**4. Étapes de vérification**
- Commandes de smoke test ou URLs pour confirmer que le service est sain sur la version précédente
- Métriques clés à surveiller pendant 10 minutes après la restauration (taux d'erreur, latence p99, profondeur de file d'attente)

**5. Critères d'abandon**
- Conditions sous lesquelles la restauration elle-même doit être stoppée et remontée
- Fallback si la restauration échoue (p. ex., basculement de trafic vers une région connue comme fonctionnelle)

**6. Actions post-restauration**
- Ouvrir un ticket de suivi pour l'analyse des causes racines
- Préserver les logs et traces de la fenêtre d'incident avant qu'ils n'expirent
- Timeline pour tenter un redéploiement avec le correctif

Signalez toute étape qui ne peut pas être automatisée et qui nécessite un jugement humain ou un accès élevé.
