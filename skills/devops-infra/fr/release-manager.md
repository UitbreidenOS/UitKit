---
name: release-manager
description: "Gestion des versions : versioning sémantique, génération de changelog à partir de commits conventionnels, listes de contrôle de préparation aux versions, procédures de correction d'urgence, plans de rétablissement et stratégie de branche de version"
---

# Compétence Gestionnaire de Version

## Quand l'activer
- Planifier et coordonner une version logicielle
- Générer un changelog à partir de l'historique des commits
- Déterminer le saut de version sémantique correct pour une version
- Exécuter les vérifications de préparation à la version avant le déploiement
- Gérer une procédure d'écorrection d'urgence
- Configurer une stratégie de branche de version (Git Flow, trunk-based, etc.)

## Quand NE PAS l'utiliser
- Configuration du pipeline CI/CD — utiliser la compétence cicd
- Configuration de l'infrastructure de déploiement — utiliser les compétences docker ou kubernetes
- Gestion des incidents post-version — utiliser l'agent incident-commander
- Publication npm spécifiquement — utiliser le workflow npm publish

## Instructions

### Versioning sémantique

```
Déterminer le saut de version pour [version].

Version actuelle : [X.Y.Z]
Modifications dans cette version : [décrire ou coller la liste des commits]

Règles de versioning sémantique (semver.org) :
MAJOR (X) : changement de rupture — les intégrations existantes seront cassées
  Exemples : endpoint API supprimé, signature de fonction modifiée, support de version Node supprimé
  Quand : n'importe quel commit avec « BREAKING CHANGE: » dans le corps, ou « ! » après le type (feat!: ...)

MINOR (Y) : nouvelle fonctionnalité, rétrocompatible
  Exemples : nouvel endpoint API, nouveau paramètre optionnel, nouvelle fonctionnalité derrière un drapeau
  Quand : commits avec type « feat: »

PATCH (Z) : correction de bogue rétrocompatible
  Exemples : corriger un bogue, mettre à jour une dépendance (sans rupture), améliorer le message d'erreur
  Quand : commits avec type « fix: », « perf: », « refactor: », « docs: » (sans nouvelles fonctionnalités)

Types de commits conventionnels :
- feat: → saut MINOR
- fix: → saut PATCH
- feat!: ou BREAKING CHANGE: → saut MAJOR
- chore:, docs:, style:, test:, refactor: → PATCH (ou pas de saut, à votre choix)
- perf: → saut PATCH

Selon vos modifications : [entrée]
Version recommandée : [X.Y.Z → A.B.C]
Raison : [quels commits ont déclenché quel saut]
```

### Génération de changelog

```
Générer un changelog pour [version].

Version : [X.Y.Z]
Date : [AAAA-MM-JJ]
Commits depuis la dernière version : [coller la sortie git log --oneline ou décrire les modifications]

Format de commit conventionnel : type(portée) : description
Exemple : feat(auth): ajouter le support de connexion OAuth2

Format du changelog (norme Keep a Changelog) :

## [X.Y.Z] — AAAA-MM-JJ

### Changements de rupture
- [description du changement de rupture + chemin de migration]

### Ajoutés
- [commits feat: → description orientée utilisateur]
- [commits feat(portée) : groupés par domaine]

### Modifiés
- [modifications aux fonctionnalités existantes]

### Corrigés
- [commits fix: → ce qui était cassé et fonctionne maintenant]

### Sécurité
- [modifications pertinentes pour la sécurité — vulnérabilités corrigées, permissions resserrées]

### Déprécié
- [fonctionnalités qui seront supprimées dans une version majeure future]

### Supprimé
- [fonctionnalités supprimées — changement de rupture, va dans Changements de rupture si la suppression est la rupture]

Règles pour les bonnes entrées de changelog :
- Écrire pour les utilisateurs, pas pour les développeurs
- « Ajouter la connexion OAuth2 » pas « feat(auth): implémenter le gestionnaire oauth2 »
- Inclure les étapes de migration pour les changements de rupture
- Grouper par impact, pas par fichier ou système

Générer le changelog pour ma version à partir des commits que je fournis.
```

### Liste de contrôle de préparation à la version

```
Exécuter les vérifications de préparation pour [version].

Type de version : [majeure / mineure / correctif / correction d'urgence]
Environnement cible : [staging → prod / direct vers prod / canary]
Heure du déploiement : [programmée / garde sur appel / uniquement heures d'affaires]

Liste de contrôle pré-version :

QUALITÉ DE CODE :
□ Tous les vérifications CI réussissent (tests, lint, vérification de type, scan de sécurité)
□ Révision de code complétée pour toutes les modifications dans cette version
□ Pas de bugs P1/P2 ouverts ciblant cette version qui ne sont pas corrigés
□ Pas de conflits de fusion non résolus

TESTING :
□ Tests unitaires réussissent (couverture ≥ seuil)
□ Tests d'intégration réussissent
□ Tests E2E réussissent sur l'environnement de staging
□ Test de fumée manuel des parcours utilisateurs critiques sur staging
□ Performance : pas de régression par rapport à la base de référence (vérifier la latence p99)
□ Migrations de base de données testées sur une BD de staging de taille similaire à la prod

COMMUNICATIONS :
□ Notes de version rédigées et approuvées
□ Changelog orienté client prêt (si les modifications affectent les utilisateurs)
□ Équipe d'assistance informée des changements
□ Ventes/CS informées si la version inclut de nouvelles fonctionnalités à démontrer
□ Page de statut : fenêtre de maintenance programmée affichée

DÉPLOIEMENT :
□ Carnet de déploiement révisé et à jour
□ Plan de rétablissement défini et testé
□ Rétablissement de migration de base de données confirmé (ou migration uniquement en avant avec raison documentée)
□ Drapeaux de fonctionnalité configurés pour déploiement progressif (si applicable)
□ Ingénieur de garde au courant du calendrier de déploiement
□ Tableaux de bord de surveillance ouverts : taux d'erreur, latence p99, métriques métier clés

VALIDATION POST-DÉPLOIEMENT (30 premières minutes) :
□ Point de terminaison de santé renvoyant 200
□ Taux d'erreur dans la plage normale
□ Flux utilisateur clés fonctionnant (test de fumée)
□ Migration de base de données complétée correctement
□ Pas d'alertes inhabituelles se déclenchant

APPROBATION :
□ Approbation du responsable technique
□ Approbation du propriétaire de produit (pour versions mineures/majeures)
□ [Optionnel] Révision de sécurité pour les modifications sensibles à la sécurité

Générer la liste de contrôle pour mon type de version et mon modèle de déploiement.
```

### Procédure de correction d'urgence

```
Exécuter une correction d'urgence pour [incident/bogue].

Gravité du problème : [P1 — production en panne / P2 — dégradation majeure]
Problème : [décrire le bogue et son impact]
Version de production actuelle : [X.Y.Z]
Branche de correction d'urgence depuis : [main / release/X.Y.Z]

Procédure de correction d'urgence :

ÉTAPE 1 — Créer une branche de correction d'urgence :
git checkout -b hotfix/X.Y.Z+1 main  # Branche depuis main (ou le tag de prod actuel)
# Si utilisation de Git Flow : git flow hotfix start X.Y.Z+1

ÉTAPE 2 — Appliquer la correction :
[Faire le changement minimal pour corriger le problème — pas de nettoyage opportuniste]
[Écrire un test qui reproduit le bogue, puis vérifier que la correction le réussit]

ÉTAPE 3 — Saut de version :
Augmenter la version à X.Y.Z+1 (PATCH)
Mettre à jour CHANGELOG.md avec la correction

ÉTAPE 4 — PR et révision :
PR depuis hotfix/X.Y.Z+1 → main
Révision accélérée : minimum 1 examinateur senior
CI doit réussir : pas d'exceptions pour les corrections d'urgence P1 — si CI est cassée, corriger d'abord CI

ÉTAPE 5 — Fusionner et étiqueter :
git tag -a vX.Y.Z+1 -m "Correction d'urgence : [description]"
git push origin vX.Y.Z+1

ÉTAPE 6 — Déployer :
Suivre le carnet de déploiement avec calendrier accéléré
Garder les tableaux de bord de surveillance ouverts pendant 30 minutes après déploiement
Confirmer que la correction résout l'incident avant de déclarer résolu

ÉTAPE 7 — Rétroporter vers develop :
git checkout develop
git cherry-pick [SHA du commit de correction d'urgence]
# Assure que la correction est dans la prochaine version régulière

ÉTAPE 8 — Après incident :
Mettre à jour CHANGELOG.md sur main et develop
Programmer PIR pour corrections d'urgence P1 (dans 48 heures)

Règles de correction d'urgence :
- Corriger UNIQUEMENT le bogue signalé — aucun autre changement dans la branche de correction d'urgence
- Correction d'urgence contourne le processus de version normal mais PAS la révision de code
- Correction d'urgence augmente automatiquement la version PATCH

Écrire le plan de correction d'urgence pour mon bogue spécifique.
```

### Stratégie de version

```
Concevoir une stratégie de branchement de version pour [équipe].

Taille de l'équipe : [X ingénieurs]
Fréquence de version : [quotidienne / hebdomadaire / mensuelle]
Modèle de déploiement : [continu / versions contrôlées / fenêtres programmées]
Problème actuel : [trop lent / trop risqué / aucun processus / conflits de fusion]

Comparaison des stratégies :

DÉVELOPPEMENT BASÉ SUR TRUNK (recommandé pour la plupart des équipes) :
- Tout le monde valide dans main quotidiennement
- Versions étiquetées depuis main à tout moment
- Drapeaux de fonctionnalité masquent les fonctionnalités incomplètes
- Meilleur pour : CI/CD, petites équipes, versions fréquentes
- Avantages : simple, rapide, pas de branches longue durée
- Inconvénients : nécessite de la discipline + infrastructure de drapeau de fonctionnalité

GIT FLOW (pour les versions programmées) :
- main : production
- develop : branche d'intégration
- feature/X : fonctionnalités individuelles → fusionner vers develop
- release/X.Y : préparation de version → fusionner vers main + develop
- hotfix/X : corrections d'urgence → fusionner vers main + develop
- Meilleur pour : applications mobiles, logiciels on-prem avec cycles de version
- Inconvénients : complexe, conflits de fusion, lent

GITHUB FLOW (léger) :
- main : toujours déployable
- feature/X : n'importe quel travail → PR → fusionner vers main → déployer
- Meilleur pour : services web déployant en continu

Pour le profil de votre équipe :
[Recommander une stratégie avec raison et instructions de configuration]

Configurer la stratégie recommandée pour mon équipe avec commandes git et points d'intégration CI/CD.
```

## Exemple

**Utilisateur :** Nous sommes sur le point de sortir la v2.0.0 de notre API SaaS. Elle a des changements de rupture (3 endpoints dépréciés supprimés). Comment communiquer cela et exécuter la version ?

**Plan de version de Claude :**

**Version :** 2.0.0 (saut MAJOR — changement de rupture = endpoints supprimés)

**Entrée du changelog :**
```markdown
## [2.0.0] — 2026-05-20

### Changements de rupture
- Endpoints dépréciés supprimés : `GET /api/v1/users/legacy`, `POST /api/v1/auth/old`, `DELETE /api/v1/items/purge`
  → **Migration :** Utiliser `GET /api/v2/users`, `POST /api/v2/auth/login`, `DELETE /api/v2/items` respectivement.
  → Guide de migration complet : docs.yourapi.com/migration/v1-to-v2

### Ajoutés
- [autres ajouts]

### Corrigés
- [corrections de bugs]
```

**Séquence de communication :**
1. **4 semaines avant :** E-mail à tous les détenteurs de clés API — « Changements de rupture à venir en v2.0.0 le [date]. Action requise. »
2. **2 semaines avant :** Deuxième rappel + lien du guide de migration
3. **1 semaine avant :** Avertissement final + offre d'extension 2 semaines pour les clients qui la demandent
4. **Jour de la version :** Notes de version affichées, note de page de statut, équipe d'assistance informée
5. **Après la version :** Surveiller les erreurs 400 sur les endpoints supprimés — s'attendre à une augmentation des migrants lents

**Portes de préparation à la version pour un changement majeur de rupture :**
- [ ] Tous les clients utilisant les endpoints dépréciés notifiés ≥4 semaines avant
- [ ] Guide de migration publié et vérifié précis
- [ ] Endpoints v1 conservés comme 410 Gone (pas 404) pendant 30 jours — aide les clients à déboguer plus vite
- [ ] Plan de rétablissement : pouvez-vous réactiver les anciens endpoints si l'adoption de la migration est trop faible ?

---
