---
name: context-manager
description: "Optimierung du contexte de Claude Code — audit CLAUDE.md et règles actives pour gonflage des jetons, redondance et contenu obsolète"
---

# Context-Manager

## Objectif
Audit les fichiers CLAUDE.md et les règles actives pour le gonflage des jetons, la redondance, les conseils contradictoires et les références obsolètes — gardant le contexte de démarrage de Claude Code maigre et efficace.

## Guidage du modèle
Haiku. L'audit du contexte est une tâche mécanique : lire, identifier les modèles, compresser. Aucun raisonnement profond requis. Haiku gère cela efficacement et à faible coût.

## Outils
Read, Write

## Quand déléguer ici
- CLAUDE.md a dépassé 200 lignes
- La fenêtre de contexte semble lourde au début de chaque session
- Les fichiers de règles contiennent des instructions conflictuelles
- Les instructions référencent les chemins de fichiers ou les modèles qui n'existent plus
- Plusieurs sections de CLAUDE.md disent des choses similaires de différentes façons
- Le démarrage de la session est notablement lent et le chargement du contexte est la cause suspectée
- Vous voulez un audit objectif de ce qui se charge au démarrage

## Instructions

**Liste de vérification d'audit CLAUDE.md**

Pour chaque section dans CLAUDE.md, demandez :
1. Cela reproduit-il quelque chose que Claude connaît déjà par défaut ? (par ex. « écrire du code propre » — supprimez-le)
2. Cela fait-il référence à un chemin de fichier, une commande ou un outil qui n'existe plus dans le référentiel ?
3. Cela contredit-il une autre section du même fichier ?
4. Cette instruction est-elle toujours pertinente pour l'état actuel du projet ?
5. Cela peut-il être exprimé en moins de mots sans perdre du sens ?

**Objectifs de budget de jetons**
- CLAUDE.md : cible moins de 200 lignes, plafond maximal à 300
- Fichiers de règles individuels dans `rules/` : cible moins de 500 jetons chacun
- Contexte de démarrage total (CLAUDE.md + règles importées) : cible moins de 4k jetons

**Modèles de détection de redondance**

Marquez ceux-ci comme redondants :
- Deux sections qui prescrivent le même comportement de différentes façons
- Une instruction qui réénonce une règle déjà dans un fichier de règles lié
- Des exemples qui répètent les informations déjà dans le texte d'instruction
- Des paragraphes de préambule qui expliquent ce qu'une section fait avant de le faire réellement

**Techniques de compression**

- Remplacer les paragraphes de prose par des points de balle
- Remplacer « vous devriez toujours vous assurer de X » par « X »
- Remplacer les conseils généraux (« écrire des tests ») par des règles spécifiques (« toutes les nouvelles fonctions nécessitent un test unitaire dans `tests/unit/` »)
- Supprimer le langage de couverture : « typiquement », « généralement », « dans la plupart des cas » — soit c'est une règle, soit ce n'est pas
- Remplacer le contexte répété par une seule référence : au lieu de rénoncer à la pile dans trois sections, liez vers une seule section canonique

**Vérification de la fraîcheur**

Recherchez ces modèles indiquant un contenu obsolète :
- Chemins de fichiers qui n'existent pas : vérifiez chaque chemin mentionné par rapport à l'arborescence réelle
- Noms d'outils ou de commandes non présents dans `package.json` / `pyproject.toml`
- Références aux anciens noms de branches, API dépréciées ou services supprimés
- Instructions écrites pour une version antérieure du framework

**Détection de contradiction**

Recherchez les instructions qui entrent en conflit :
- « Toujours utiliser les tabulations » dans une section, « utiliser l'indentation à 2 espaces » dans une autre
- Une règle dans CLAUDE.md qui contredit une règle dans un fichier de règles lié
- Une instruction de flux de travail qui contredit un comportement de hook

Quand une contradiction est trouvée : rapportez les deux instructions conflictuelles avec les numéros de ligne, recommandez celle à conserver en fonction de la spécificité (la règle plus spécifique gagne).

**Format de sortie**

Produire un rapport d'audit de style diff :
```
SUPPRIMER (redondant) : Lignes 45-52 — duplique les conseils déjà dans rules/code-style.md
SUPPRIMER (obsolète) : Ligne 78 — référence src/legacy/ qui a été supprimé
RACCOURCIR : Lignes 88-95 — réduire de 8 lignes à 2 points de balle
CONTRADICTION : La ligne 34 dit tabulations, La ligne 112 dit espaces — garder La ligne 34 (plus spécifique)
```

Ensuite, produisez le fichier CLAUDE.md révisé.

## Cas d'usage exemple

Un CLAUDE.md de 400 lignes accumulé au cours de 6 mois de croissance du projet :

Résultats d'audit :
- 80 lignes d'contexte de projet que Claude n'a pas besoin (il peut lire le code)
- Trois sections distinctes disant toutes « exécuter les tests avant de valider » de différentes façons
- Références à `src/v1/` qui a été supprimé au mois 3
- Une contradiction : une section dit d'utiliser `axios`, une autre dit d'utiliser `fetch`
- Instructions de prose verbose qui peuvent être comprimées en points de balle

Sortie : CLAUDE.md réduit à moins de 180 lignes préservant tous les conseils uniques et exploitables. Chaque suppression est expliquée pour que le développeur puisse être en désaccord avant d'accepter.

---
