---
name: freshness-auditor
description: "Exécutez des audits de fraîcheur et générez des listes de rafraîchissement prioritaires pour la maintenance des contenus"
updated: 2026-06-15
---

# Auditeur de Fraîcheur

## Quand l'activer

- **Avant le renouvellement de la certification** — auditez le contenu de Claudient pour assurer que tous les fichiers sont actuels et défendables
- **Avant la publication d'une nouvelle version ou mise à jour majeure** — vérifiez la précision de la documentation
- **Cycle de maintenance trimestriel** — identifiez le contenu obsolète qui doit être rafraîchi (tous les 3 mois)
- **Après une version majeure du modèle Claude** — signalisez les conseils potentiellement obsolètes dans les compétences et les flux de travail
- **Audit de contenu à la demande** — lorsque vous souhaitez évaluer l'état de santé général du contenu sans attendre le sprint trimestriel

## Quand NE PAS l'utiliser

- Pour la surveillance de la fraîcheur en temps réel (utilisez plutôt les vérifications CI avec `check-freshness.js`)
- Pour valider des liens externes spécifiques (utilisez un outil dédié de vérification de liens)
- Pour réécrire du contenu (utilisez plutôt `/workflows/freshness-refresh`, qui lance des agents d'examen)
- Pour appliquer la cohérence des styles (utilisez les règles de linting et la compétence `code-review`)

## Instructions

### Étape 1 : Exécutez l'audit de fraîcheur

Exécutez le script de vérification de fraîcheur :

```bash
node scripts/check-freshness.js
```

Cela analyse tous les répertoires `skills/` et `agents/` pour les fichiers avec une date `updated:` dans le préambule YAML. Il signale les fichiers plus anciens que 6 mois comme obsolètes et les fichiers manquant entièrement une date.

La sortie comprend :
- Nombre de fichiers frais, obsolètes et sans date
- Liste des fichiers obsolètes avec leur date de dernière mise à jour
- Liste des fichiers manquant un champ `updated:`

### Étape 2 : Générez le rapport détaillé

Pour une répartition plus détaillée organisée par catégorie et priorité :

```bash
node scripts/generate-refresh-report.js > FRESHNESS_REPORT.md
```

Cela produit un rapport Markdown avec :
- Nombre de fichiers frais vs obsolètes par catégorie (compétences, agents, guides, flux de travail)
- Fichiers triés par âge (les plus anciens d'abord)
- Temps estimé pour rafraîchir chaque fichier
- Catégorisation Tier 1/2/3 pour la priorisation

### Étape 3 : Catégorisez par impact

Lisez le rapport de fraîcheur et triez les fichiers dans les niveaux :

**Tier 1 (Critique — rafraîchir immédiatement) :**
- Compétences de débogage et de test essentielles
- Guides fréquemment référencés (démarrage, fondations conceptuelles)
- Définitions d'agents essentielles utilisées dans les flux de travail
- N'importe quel fichier plus vieux que 12 mois

Ces fichiers se trouvent sur des chemins critiques ; la mise en cache obsolète pourrait induire en erreur les utilisateurs ou casser les flux de travail.

**Tier 2 (Important — rafraîchir dans 2 semaines) :**
- Compétences spécifiques au domaine (frontend, backend, DevOps, etc.)
- Guides et flux de travail spécifiques aux piles
- Définitions d'agents secondaires
- Fichiers âgés de 6 à 12 mois dans les domaines actifs

Ceux-ci sont référencés régulièrement mais moins critiques que Tier 1.

**Tier 3 (Optionnel — réviser, peut garder tel quel) :**
- Compétences archivées ou obsolètes
- Définitions d'agents rarement utilisées
- Exemples historiques et études de cas
- Guides conceptuels intemporels peu susceptibles de changer

Ceux-ci n'ont peut-être pas besoin d'être mis à jour si le contenu est toujours exact.

### Étape 4 : Évaluez la précision du contenu (examen manuel)

Pour chaque fichier Tier 1, faites une vérification rapide de la précision :

```markdown
Fichier : [chemin]
Dernière mise à jour : [date]
Âge : [N mois]

Vérification rapide de la précision :
- [ ] Tous les exemples de commande fonctionnent toujours dans Claude Code actuel
- [ ] Les noms et fonctionnalités des outils référencés existent toujours
- [ ] Pas de références aux fonctionnalités obsolètes ou anciennes versions de modèles
- [ ] Les liens externes (le cas échéant) ne sont pas 404
- [ ] La syntaxe du code est actuelle (pas d'API obsolètes)

Statut : [Frais | Mises à jour Mineures Nécessaires | Réécriture Majeure Nécessaire]
```

Si >30% du contenu d'un fichier est inexact ou obsolète, marquez-le pour un rafraîchissement majeur dans le prochain cycle trimestriel.

### Étape 5 : Produisez la liste de rafraîchissement priorisée

Créez un fichier texte avec vos conclusions :

```markdown
# Résultats de l'Audit de Fraîcheur — [DATE]

## Résumé
- Fichiers totaux analysés : X
- Frais (< 6 mois) : X
- Obsolètes (≥ 6 mois) : X
- Dates manquantes : X

## Tier 1 (Rafraîchir immédiatement)
- [Chemin du fichier] — dernière mise à jour [date], [N] mois
- ...

## Tier 2 (Rafraîchir dans 2 semaines)
- [Chemin du fichier] — dernière mise à jour [date], [N] mois
- ...

## Tier 3 (Révision optionnelle)
- [Chemin du fichier] — dernière mise à jour [date], [N] mois
- ...

## Fichiers nécessitant une réécriture majeure
- [Chemin du fichier] — [raison : exemples obsolètes, fonctionnalités dépréciées, etc.]

## Prochaines étapes
1. Assigner les fichiers Tier 1 aux agents d'examen
2. Planifier l'examen Tier 2 pour le backlog de sprint
3. Archiver ou déprécier les fichiers Tier 3 s'ils ne sont plus pertinents
4. Exécuter le `/workflows/freshness-refresh` complet pour coordonner les mises à jour
```

### Étape 6 : Décidez de l'action suivante

En fonction des résultats de l'audit :

- **Si <10% obsolète :** Le contenu est sain. Rafraîchissez normalement au cycle trimestriel.
- **Si 10–30% obsolète :** Planifiez un sprint de rafraîchissement ciblé pour les fichiers Tier 1 et 2 dans les 2 prochaines semaines.
- **Si >30% obsolète :** Problème de santé critique. Exécutez `/workflows/freshness-refresh` immédiatement pour mettre à jour tous les agents en parallèle.
- **Si des fichiers sont >12 mois :** Escaladez pour examen immédiat.

---

## Exemple

### Scénario : Audit pré-certification

Avant de certifier Claudient comme outil de production, vous souhaitez vous assurer que tout le contenu est actuel.

### Exécution :

```bash
# Étape 1 : Exécutez la vérification de fraîcheur
node scripts/check-freshness.js

# Sortie :
# Vérification de fraîcheur : 847 fichiers analysés (seuil obsolète : 6 mois)
#   Frais :  621
#   Obsolètes :  156
#   Pas de date : 70
```

156 fichiers obsolètes et 70 dates manquantes — il est temps de corriger avant la certification.

```bash
# Étape 2 : Générez un rapport détaillé
node scripts/generate-refresh-report.js > FRESHNESS_REPORT.md

# Examen du rapport et catégorisation :
# Tier 1 (compétences essentielles) : 32 fichiers
# Tier 2 (compétences de domaine, flux de travail) : 89 fichiers
# Tier 3 (archivés, exemples) : 35 fichiers
```

### Décision :

En fonction de l'audit, l'équipe décide :
- Les fichiers Tier 1 (32) doivent être rafraîchis avant la signature de certification — assigner à 4 agents, 2 heures
- Les fichiers Tier 2 (89) peuvent être regroupés en sprints de 2 semaines — 3 agents en rotation
- Les fichiers Tier 3 (35) sont archivés/obsolètes — marquer avec la balise « archivé » dans le préambule, pas de rafraîchissement nécessaire

### Prochaine étape :

Lancez un workflow de rafraîchissement ciblé pour les fichiers Tier 1 uniquement :

```bash
# (Utilise le workflow freshness-refresh avec le drapeau --tier 1)
```

Cela garantit la préparation à la certification sans bloquer l'intégralité du backlog.

---

## Contenu connexe

- `/guides/content-freshness` — SLA, seuils de mise en cache et ce qu'il faut vérifier par type de contenu
- `/workflows/freshness-refresh` — sprint complet de maintenance trimestriel (utilise cet audit comme entrée)
- `/scripts/check-freshness.js` — CLI de détection de fraîcheur principal
- `/scripts/generate-refresh-report.js` — génère le rapport de fraîcheur détaillé

---
