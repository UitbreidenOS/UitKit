# Commande vs agent vs compétence — quand utiliser chacun

Claude Code a trois primitives pour étendre son comportement: les compétences, les agents et les commandes slash. Ils se chevauchent dans la zone de surface, c'est pourquoi c'est la source la plus courante de confusion lors de la construction d'un système de connaissances Claude Code. Ce guide clarifier l'ambiguïté avec un cadre décisionnel précis.

---

## Les trois primitives

### Compétence (auto-invoquée)

- Vit dans `.claude/skills/` en tant que fichier `.md` avec un frontmatter YAML
- Claude la charge automatiquement quand la tâche actuelle correspond sémantiquement à la description de la compétence — aucune saisie utilisateur requise
- Exécutée en ligne dans la conversation actuelle — aucune fenêtre de contexte séparée n'est créée
- La primitive la plus légère: partage l'historique complet de la conversation, le contexte immédiat et tous les fichiers ouverts
- Meilleur pour: expertise de domaine, motifs récurrents, conventions de codage, guides de style, idiomes API, connaissances spécifiques au projet
- À éviter pour: tâches nécessitant l'isolement, processus longs multi-étapes, quoi que ce soit qui devrait être consciemment déclenché

Une compétence est essentiellement une expertise persistante injectée dans le raisonnement de Claude au moment où elle est nécessaire. Quand Claude vous voit travailler sur une route FastAPI, la compétence `fastapi-crud` se charge automatiquement et façonne la sortie. Aucune invocation requise.

### Agent (sous-agent généré)

- Vit dans `agents/` en tant que fichier `.md` avec un frontmatter YAML
- Explicitement généré par la session parente Claude via `Agent(subagent_type="name", prompt="...")`
- S'exécute dans une fenêtre de contexte séparée — entièrement isolé de la conversation parente
- Peut s'exécuter en parallèle — plusieurs agents s'exécutent simultanément tandis que le parent attend ou continue
- A ses propres restrictions d'outils, sélection de modèle et niveau d'effort
- Meilleur pour: travail spécialisé nécessitant l'isolement, exécution parallèle, tâches où le bruit intermédiaire ne doit pas polluer le contexte principal, analyse longue durée
- À éviter pour: tâches qui ont besoin de l'historique complet de la conversation parent (les agents ne reçoivent que le message que vous leur passez)

Un agent est un entrepreneur: vous lui remettez un rapport et il travaille indépendamment. Ils ne peuvent pas lire votre historique de conversation à moins que vous l'incluiez explicitement dans le message.

### Commande slash (explicitement invoquée)

- Vit dans `.claude/commands/` en tant que fichier `.md`
- L'utilisateur tape `/command-name` pour invoquer — jamais auto-invoqué
- Exécutée en ligne dans la conversation actuelle, comme une compétence, mais nécessite une action explicite
- Peut coder des flux de travail multi-étapes complexes en tant que messages structurés
- Meilleur pour: flux de travail définis que les utilisateurs déclenchent consciemment — `/code-review`, `/deploy`, `/db-migrate`, `/release-notes`
- À éviter pour: capacités qui devrait s'activer automatiquement; tout ce que les utilisateurs oublieront d'invoquer

Une commande slash est une macro: un flux de travail prédéfini que vous pouvez appeler par nom quand vous en avez besoin. L'utilisateur est toujours en contrôle.

---

## Arbre décisionnel

Travaillez à travers ces questions dans l'ordre. Arrêtez à la première correspondance.

```
1. Devrait-il s'activer automatiquement sans que l'utilisateur tape quoi que ce soit?
   OUI → Compétence

2. A-t-il besoin d'isolement du contexte parent, ou devrait-il s'exécuter en parallèle
   avec d'autres travaux?
   OUI → Agent

3. A-t-il besoin d'un modèle différent (Haiku pour le coût, Opus pour la profondeur du raisonnement)
   ou un accès aux outils restreint?
   OUI → Agent

4. Est-ce un flux de travail défini que l'utilisateur déclenche consciemment par nom?
   OUI → Commande slash

5. Est-ce une pure expertise ou un motif (pas d'exécution, pas d'isolement nécessaire)?
   OUI → Compétence (en ligne)

TOUJOURS INCERTAIN → par défaut à Compétence, escalader à Commande slash, escalader à Agent
                     uniquement quand l'isolement est réellement requis
```

---

## Règles d'auto-invocation

### Comment les compétences sont activées

Claude lit le frontmatter de la compétence au démarrage de la session. Le champ `description` (jusqu'à ~1 536 caractères) est toujours en mémoire. Quand une tâche correspond sémantiquement, Claude charge le corps complet de la compétence.

```yaml
---
description: "Use for FastAPI route handlers, dependency injection, and Pydantic model definitions. Activates when writing Python web API code."
paths:
  - "**/*.py"
when_to_use: "Python web API development with FastAPI"
---
```

- `description` — signal d'appariement primaire; gardez-le spécifique, pas générique
- `paths` — filtre de glob de fichier; la compétence ne s'active que quand les fichiers correspondants sont en contexte
- `when_to_use` — indice d'appariement secondaire pour le routeur

Les compétences avec des descriptions génériques (`"Use this for Python"`) correspondent trop largement et se chargent inutilement. Soyez précis.

### Comment les agents sont invoqués

Les agents sont toujours explicitement générés. La session parent les appelle.

```python
# Invocation basique
Agent(
  subagent_type="security-auditor",
  description="Audit the authentication module for OWASP Top 10 issues",
  prompt="Review /src/auth/ for injection risks, session fixation, and token exposure. Report findings."
)

# Avec remplacement du modèle
Agent(
  subagent_type="doc-formatter",
  model="haiku",
  prompt="Reformat all docstrings in /src/utils/ to Google style."
)
```

Passez `background: true` dans le frontmatter (ou définissez-le au moment de l'appel) pour exécuter l'agent sans bloquer la session parent.

---

## Règles d'isolement du contexte

| Primitive | Voit la conversation parente? | Fenêtre de contexte propre? | Peut s'exécuter en parallèle? |
|-----------|--------------------------|------------------------|---------------------|
| Compétence | Oui — historique complet | Non | Non |
| Agent | Non — message seulement | Oui | Oui |
| Commande slash | Oui — historique complet | Non | Non |

La colonne d'isolement est le différentiateur critique. Si votre tâche a besoin d'accès à l'historique complet de la conversation, utilisez une compétence ou une commande slash. Si elle ne doit pas être contaminée par le contexte parent (ou devrait s'exécuter aux côtés d'autres tâches), utilisez un agent.

---

## Ordre de résolution le plus léger

Quand vous êtes incertain, par défaut à l'option la plus légère:

**Compétence → Commande slash → Agent**

Commencez par une compétence. Si la capacité ne peut pas être auto-invoquée de manière fiable (trop dépendante du contexte, trop explicite), passez à une commande slash. Escaladez uniquement à un agent quand l'isolement ou le parallélisme compte vraiment. Les agents coûtent une fenêtre de contexte supplémentaire et nécessitent de passer le contexte explicitement — ils sont plus coûteux à la fois en tokens et en complexité.

---

## Exemples pratiques

### Exemple 1: conventions de nommage de l'API REST

> "Je veux que Claude suive toujours nos normes de nommage de points de terminaison REST internes lors de la rédaction d'itinéraires."

**Réponse: Compétence**

C'est une expertise pure. Elle devrait s'activer automatiquement chaque fois que Claude écrit des gestionnaires de route. Aucun déclencheur utilisateur nécessaire, aucun isolement nécessaire. Créez `.claude/skills/rest-conventions.md` avec vos règles de nommage et glob de fichier `paths: ["**/*.py", "**/*.ts"]`.

### Exemple 2: audit de sécurité parallèle pendant le développement

> "Je veux exécuter un audit de sécurité complet du module d'authentification pendant que je continue à travailler sur la fonction."

**Réponse: Agent**

L'audit est un spécialiste, tâche longue durée. Elle ne devrait pas générer de bruit dans la conversation principale. Elle peut s'exécuter en parallèle tandis que le développeur continue. Définissez `background: true` et `model: opus` dans le frontmatter de l'agent. Passez la portée d'audit dans le message.

### Exemple 3: flux de travail de déploiement

> "Je veux une commande qui exécute les tests, construire l'image Docker et pousse vers le registre."

**Réponse: Commande slash**

C'est un flux de travail délibéré et consciemment déclenché. Le développeur veut taper `/deploy` quand il est prêt — pas l'avoir auto-déclenché. Créez `.claude/commands/deploy.md` avec le flux de travail multi-étapes complet codé en tant qu'instructions structurées.

---

## Comparaison des coûts en tokens

Comprendre le coût de démarrage aide à décider si utiliser une compétence agressivement ou avec parcimonie.

| Primitive | Coût de démarrage | Coût d'appariement | Remarques |
|-----------|-------------|---------------|-------|
| Description de la compétence | ~50–100 tokens | Toujours en contexte | Gardez les descriptions courtes et spécifiques |
| Corps complet de la compétence | ~200–2 000 tokens | Chargé sur appariement sémantique | Se charge uniquement quand nécessaire |
| Agent | 0 au démarrage | Payé lors de la génération | Fenêtre de contexte séparée |
| Commande slash | 0 au démarrage | Payé lors de l'invocation | Chargé sur `/command` |

Les compétences entraînent un petit coût de démarrage constant pour chaque session. Si vous avez 40 compétences avec des descriptions de 100 tokens, c'est 4 000 tokens de surcharge avant le premier message utilisateur. Auditez les descriptions de votre compétence et gardez-les serrées. Les agents et les commandes slash ne coûtent rien jusqu'à leur utilisation explicite.

---
