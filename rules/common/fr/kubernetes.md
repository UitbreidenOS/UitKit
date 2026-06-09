# Règles Kubernetes

## S'appliquer à
Tous les manifestes Kubernetes (`*.yaml` dans `k8s/`, `manifests/`, `helm/`), les graphiques Helm et les superpositions Kustomize.

## Règles

1. **Définissez `requests` et `limits` sur chaque conteneur** — les demandes non définies causent un ordonnancement imprévisible. Les limites non définies permettent à un seul pod d'affamer un nœud. La limitation du débit CPU est réelle ; mesurez et ajustez.

2. **Ne jamais utiliser l'espace de noms `default` pour les charges de travail d'application** — créez des espaces de noms à usage spécifique (`payments`, `workers`, `monitoring`). L'espace de noms `default` est pour l'exploration, pas la production.

3. **Définissez `replicas: 2` minimum pour tout déploiement critique pour la disponibilité** — un seul replica signifie qu'une mise à jour progressive ou une expulsion cause des temps d'arrêt. Utilisez `PodDisruptionBudget` pour éviter les expulsions simultanées.

4. **Définissez `readinessProbe` et `livenessProbe`** — la sonde de préparation contrôle le trafic. La sonde de vie redémarre les processus bloqués. Ce sont des outils différents pour différentes pannes. Ne jamais utiliser une sonde de vie pour les délais d'initialisation — utilisez `startupProbe`.

5. **Épinglez les étiquettes d'image sur les condensés SHA immuables en production** — `myapp@sha256:abc123` est immuable. `myapp:v1.2.3` est une étiquette mutable. Utilisez l'épinglage des condensés via votre pipeline CI ou des outils comme `kustomize edit set image`.

6. **Utilisez `RollingUpdate` avec `maxUnavailable: 0` pour les déploiements sans temps d'arrêt** — `maxUnavailable: 1` par défaut supprime le trafic pendant les mises à jour. Définissez `maxSurge: 1` pour permettre à un nouveau pod de démarrer avant l'arrêt de l'ancien.

7. **Stockez les secrets dans un gestionnaire de secrets, pas en base64 dans les manifestes** — les objets Kubernetes `Secret` sont en base64, pas chiffrés, par défaut dans etcd. Utilisez External Secrets Operator, Vault ou AWS Secrets Manager.

8. **Appliquez `NetworkPolicy` pour restreindre le trafic pod-à-pod** — par défaut, tous les pods peuvent atteindre tous les pods. Une règle de refus au niveau de l'espace de noms + des règles d'autorisation explicites limitent le rayon d'explosion en cas de compromission.

9. **Utilisez `topologySpreadConstraints` ou `podAntiAffinity` pour la résilience multi-AZ** — l'ordonnancement des replicas au même nœud ou AZ va à l'encontre du but d'avoir plusieurs replicas.

10. **Étiquetez les ressources de manière cohérente** — minimum : `app.kubernetes.io/name`, `app.kubernetes.io/version`, `app.kubernetes.io/component`. Les étiquettes sont utilisées par les sélecteurs, la surveillance et l'allocation des coûts.

11. **Définissez `terminationGracePeriodSeconds` pour correspondre au temps d'arrêt de votre application** — les 30 secondes par défaut sont trop courtes pour certaines charges de travail et trop longues pour d'autres. Définissez-le sur le temps d'arrêt + tampon.

12. **Utilisez `HorizontalPodAutoscaler` (HPA) pour les charges de travail sans état, pas la mise à l'échelle manuelle** — HPA sur les métriques CPU et personnalisées permet la montée en charge automatique. La gestion manuelle des replicas ne survit pas aux pics de charge.

13. **Ne jamais exécuter les conteneurs en tant que root** — définissez `securityContext.runAsNonRoot: true` et `runAsUser` au niveau du pod ou du conteneur. Définissez également `allowPrivilegeEscalation: false` et `readOnlyRootFilesystem: true` si possible.

14. **Validez les manifestes en CI avant de les appliquer** — utilisez `kubeval`, `kube-score` ou `kubectl --dry-run=server`. Détectez les erreurs de schéma et les violations de politique avant qu'elles n'affectent le cluster.

15. **Utilisez les rôles RBAC dans l'espace de noms, pas ClusterRole, sauf si l'accès à l'ensemble du cluster est requis** — principe du moindre privilège. Un compte de service pour un seul espace de noms ne doit jamais avoir d'accès en lecture/écriture à l'ensemble du cluster.


---

> **Travaillez avec nous:** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits AI et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
