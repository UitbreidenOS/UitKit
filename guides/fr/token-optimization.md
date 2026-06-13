# Guide d'optimisation des tokens

Comment réduire les coûts de Claude Code et améliorer la vitesse de réponse sans sacrifier la qualité.

---

## Le principe fondamental

Chaque token dans la fenêtre de contexte de Claude Code coûte de l'argent et ralentit les réponses. L'objectif est de garder la fenêtre de contexte légère — uniquement ce dont Claude a besoin pour bien accomplir la tâche en cours.

Il y a quatre leviers :
1. **Sélection du modèle** — associer le bon modèle à la tâche
2. **Gestion du contexte** — contrôler ce qui est dans la fenêtre
3. **Discipline MCP** — limiter la surcharge des outils
4. **Stratégie de compactage** — quand et comment comprimer l'historique

---

## 1. Sélection du modèle

Claude Code prend en charge plusieurs modèles. Choisir le mauvais modèle pour une tâche est l'erreur la plus coûteuse.

| Modèle | Idéal pour | Coût relatif |
|---|---|---|
| Claude Haiku 4.5 | Modifications simples, tâches sur un seul fichier, opérations répétitives, résumé | Le plus bas |
| Claude Sonnet 4.6 | La plupart des travaux de développement — modifications multi-fichiers, débogage, revue de code | Moyen |
| Claude Opus 4.7 | Décisions d'architecture complexes, analyse de sécurité, orchestration multi-agents | Le plus élevé |

**Règles pratiques :**
- Par défaut, utilisez Sonnet 4.6 pour le développement général
- Passez à Haiku 4.5 pour : corrections de linting, formatage, renommages simples, modifications de fonctions uniques, génération de code standard à partir d'un modèle
- Escaladez vers Opus 4.7 uniquement quand : le problème nécessite un raisonnement approfondi sur de nombreux fichiers, des décisions de sécurité sont impliquées, ou vous orchestrez plusieurs sous-agents

**Haiku économise environ 60 % par rapport à Sonnet sur les tâches éligibles.** La clé est d'identifier quelles tâches sont éligibles — tout ce dont la sortie est très contrainte et vérifiable est qualifié.

---

## 2. Gestion de la fenêtre de contexte

La fenêtre de contexte de Claude Code est grande (jusqu'à 1M tokens sur Opus 4.7 et Sonnet 4.6), mais la fenêtre **utilisable** est plus petite une fois la surcharge prise en compte.

### Ce qui consomme du contexte

| Source | Coût approximatif |
|---|---|
| Outils MCP (10 activés) | ~30k tokens |
| CLAUDE.md (projet + utilisateur) | 1k–10k tokens |
| Historique de conversation | Croît à chaque tour |
| Contenus de fichiers lus en contexte | Variable — souvent le facteur le plus important |
| Prompt système | ~5k–10k tokens |

### Garder le contexte léger

**CLAUDE.md :**
- Gardez le CLAUDE.md du projet sous 500 lignes
- Supprimez les règles qui ne s'appliquent plus à l'état actuel du projet
- Ne dupliquez pas le contenu du CLAUDE.md au niveau utilisateur dans le CLAUDE.md au niveau projet

**Lectures de fichiers :**
- Demandez à Claude de lire des plages de lignes spécifiques plutôt que des fichiers complets quand c'est possible
- Évitez de lire le même fichier volumineux plusieurs fois dans une session
- Utilisez des sous-agents pour les tâches isolées — ils obtiennent une fenêtre de contexte fraîche

**Historique de conversation :**
- Les longues sessions accumulent un contexte mort (fichiers lus mais plus pertinents, tentatives échouées, approches abandonnées)
- Déclenchez le compactage de manière proactive plutôt que d'attendre le seuil automatique

---

## 3. Discipline MCP

Chaque serveur MCP activé charge ses définitions d'outils dans le contexte au démarrage de la session. Avec 10 serveurs MCP et ~8 outils chacun, vous consommez ~80 emplacements d'outils — environ 30k tokens avant d'avoir tapé un mot.

**Auditez vos MCPs actifs :**
- N'activez que les MCPs que vous utilisez dans le projet actuel
- Désactivez les MCPs spécifiques à un domaine (ex. base de données, cloud) quand vous ne travaillez pas dans ce domaine
- Vérifiez `.claude/settings.json` et `~/.claude/settings.json` pour les serveurs activés

**Objectif :** Gardez les MCPs activés à ce que vous utiliserez réellement dans la session.

---

## 4. Stratégie de compactage

Claude Code compacte automatiquement l'historique de conversation quand le contexte approche sa limite. Le seuil par défaut est tardif — se déclenchant à ~95 % de capacité.

### Déclencher le compactage plus tôt

Utilisez la commande `/compact` manuellement avant de commencer une nouvelle tâche majeure.

**Quand compacter manuellement :**
- Avant de passer d'une tâche majeure à une autre dans la même session
- Après une longue session de débogage avec de nombreuses tentatives échouées dans l'historique
- Avant de commencer une tâche nécessitant la lecture de nombreux fichiers volumineux

### Ce que fait le compactage

Le compactage résume l'historique de conversation et le remplace par une représentation compressée. Vous perdez l'historique tour par tour exact mais conservez les décisions, le code écrit et le contexte clé.

**Hook pre-compact :** Utilisez un hook `PreCompact` pour sauvegarder l'état critique de la session dans un fichier avant le déclenchement du compactage.

---

## 5. Efficacité des prompts

**Soyez spécifique sur la portée :**

Au lieu de : "Corrige l'authentification"
Utilisez : "Corrige la vérification d'expiration JWT dans `auth/middleware.py:45` — elle ne rejette pas les tokens avec `exp` dans le passé"

**Limitez la longueur des réponses quand approprié :**

Pour les tâches où vous avez besoin d'un changement de code mais pas d'une explication : "Faites le changement, pas d'explication nécessaire."

**Regroupez les requêtes liées :**

Au lieu de cinq requêtes séparées "ajouter un test pour X", dites "ajoutez des tests pour les cinq fonctions dans `utils.py`."

---

## 6. Isolation du contexte des sous-agents

Les sous-agents obtiennent une fenêtre de contexte fraîche. C'est l'une des techniques d'optimisation les plus sous-utilisées.

**Utilisez des sous-agents quand :**
- Une tâche est autonome (entrées claires, sorties claires)
- La tâche nécessite la lecture de nombreux fichiers non pertinents pour le reste de la session
- Vous faites quelque chose de répétitif sur plusieurs fichiers

---

## 7. Suivi des coûts

Utilisez un hook `PostToolUse` pour journaliser l'utilisation des outils et estimer les coûts par session.

Voir `hooks/lifecycle/cost-tracker.sh` pour une implémentation prête à l'emploi.

---

## Référence rapide

| Situation | Action |
|---|---|
| Modification simple d'un seul fichier | Passer à Haiku 4.5 |
| Longue session qui ralentit | Compacter manuellement (`/compact`) |
| Démarrer une nouvelle tâche majeure | Compacter d'abord, puis commencer |
| Travail dans un domaine que vous ne toucherez pas | Désactiver les MCPs du domaine |
| Tâche autonome | Utiliser un sous-agent |
| Requête vague produisant de longues réponses | Réécrire comme un prompt spécifique et délimité |
| CLAUDE.md de plus de 500 lignes | Auditer et supprimer les règles obsolètes |

---

## Travaillez avec nous
