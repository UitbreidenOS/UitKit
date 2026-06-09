# Règles CI/CD

Appliquez lors de la rédaction ou de la révision de la configuration du pipeline, des scripts de déploiement ou des processus de publication.

## Conception du pipeline

- Chaque exécution du pipeline doit être reproductible : mêmes entrées → mêmes sorties, peu importe quand ou où elle s'exécute
- Épinglez les versions des actions et les images de base sur des digests, pas sur des tags flottants : `actions/checkout@v4` est acceptable ; `actions/checkout@latest` ne l'est pas
- Séparez les étapes : lint → test → build → publish → deploy ; ne sautez jamais d'étapes sur la branche principale
- Échouez rapidement : exécutez d'abord les contrôles les moins chers et les plus rapides pour donner un retour aux développeurs en moins de 2 minutes
- Parallélisez les tâches indépendantes ; ne chaînez pas les tâches qui n'ont pas de vraie dépendance

## Portes de test

- Les fusions sur `main`/`master` exigent : tous les tests réussis, lint propre, pas de nouvelles vulnérabilités de sécurité
- La couverture ne doit pas tomber en dessous du seuil configuré — appliquez cela comme une porte du pipeline, pas comme un contrôle de courtoisie
- Les suites de tests d'intégration et de bout en bout s'exécutent sur chaque PR ; les suites longues peuvent s'exécuter la nuit si nécessaire
- Ne fusionnez jamais une PR qui contourne le pipeline de test sauf en cas d'urgence documentée avec un ticket de suivi

## Secrets et environnement

- Les secrets du pipeline vivent dans le magasin de secrets de la plateforme CI — jamais dans le YAML du pipeline ou dans les fichiers `.env` commités
- N'imprimez jamais de secrets dans les journaux du pipeline ; ajoutez `::add-mask::` (GitHub Actions) ou équivalent avant de les utiliser
- Utilisez des ensembles de credentials séparés par environnement cible ; le déployeur de staging ne peut pas toucher à la production

## Artefacts de compilation

- Compilez une fois, promuvez le même artefact dans les environnements — ne recompilez jamais pour staging vs. production
- Étiquetez les images de conteneur et les artefacts de compilation avec le SHA du commit git, pas un tag mutable comme `latest`
- Stockez les artefacts dans un registre versionné (ECR, Artifact Registry, GitHub Packages) — pas comme des pièces jointes du pipeline
- Analysez les artefacts pour les vulnérabilités avant la promotion en production

## Déploiement

- Utilisez une stratégie de déploiement qui permet le retour en arrière : blue/green, canary, ou rolling avec une étape de retour en arrière
- Effectuez un smoke-test du déploiement automatiquement avant de le marquer comme réussi
- Les migrations de base de données et les déploiements de code sont des étapes séparées — déployez d'abord le code rétrocompatible, puis migrez
- Le déploiement en production nécessite une approbation explicite ou est limité à une fenêtre de temps — pas de poussées accidentelles

## Maintenance

- Gardez la configuration du pipeline DRY : extrayez les étapes partagées dans des workflows réutilisables ou des actions composites
- Chaque étape du pipeline a un nom qui rend le journal lisible sans fouiller dans la configuration
- Alertez les défaillances du pipeline sur le canal de l'équipe — ne vous fiez pas à des individus vérifiant le tableau de bord
- Examinez et mettez à jour les versions épinglées mensuellement ; les outils obsolètes sont un risque de sécurité
