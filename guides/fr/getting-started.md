# Premiers pas avec Claudient

Ce guide vous amène de zéro à un environnement Claude Code fonctionnel avec votre première compétence, votre premier agent et votre premier hook — en moins de 10 minutes.

---

## Prérequis

- [Claude Code](https://claude.ai/code) installé et authentifié
- Un répertoire de projet sur lequel vous travaillez activement

---

## Étape 1 — Cloner Claudient

```bash

```

Vous disposez maintenant de la bibliothèque complète en local. Rien ne s'exécute automatiquement — vous choisissez ce dont vous avez besoin.

---

## Étape 2 — Configurer le répertoire `.claude/` de votre projet

Claude Code recherche la configuration dans `.claude/` à la racine de votre projet.

```bash
mkdir -p your-project/.claude/skills
mkdir -p your-project/.claude/hooks
```

La structure de votre projet devrait ressembler à ceci :

```
your-project/
├── .claude/
│   ├── skills/        ← les compétences vont ici (standard actuel)
│   ├── hooks/         ← les scripts de hooks vont ici
│   └── settings.json  ← la configuration des hooks va ici
├── CLAUDE.md          ← les règles vont ici
└── src/
```

---

## Étape 3 — Ajouter votre première compétence

Les compétences sont des commandes slash. Copiez n'importe quel fichier `.md` depuis `skills/` dans `.claude/skills/` :

```bash
# Exemple : ajouter la compétence FastAPI
cp ~/Claudient/skills/backend/python/fastapi.md your-project/.claude/skills/
```

Ouvrez maintenant Claude Code dans votre projet et tapez `/fastapi` — la compétence s'active.

> **Note :** `.claude/commands/` fonctionne toujours (chemin hérité) mais `.claude/skills/` est le standard actuel. Quand les deux existent, les compétences ont la priorité.

**Comment choisir une compétence :**
- Parcourez `skills/` par catégorie
- Lisez la section "When to activate" en haut de chaque fichier
- Si elle correspond à votre tâche actuelle, copiez-la

---

## Étape 4 — Ajouter une règle

Les règles se trouvent dans `CLAUDE.md` à la racine de votre projet. Claude lit ce fichier au début de chaque session.

```bash
# Copier un ensemble de règles communes dans le CLAUDE.md de votre projet
cat ~/Claudient/rules/common/coding-style.md >> your-project/CLAUDE.md
```

Ou ouvrez `rules/common/` et copiez manuellement les sections pertinentes pour votre projet.

---

## Étape 5 — Ajouter votre premier hook

Les hooks s'exécutent automatiquement sur les événements Claude Code. Ils résident dans `.claude/settings.json`.

Créez ou ouvrez `.claude/settings.json` dans votre projet :

```json
{
  "hooks": {}
}
```

Copiez un hook depuis `hooks/` — chaque fichier hook contient le JSON exact à coller. Par exemple, le hook de suivi des coûts :

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/cost-tracker.sh"
          }
        ]
      }
    ]
  }
}
```

Puis copiez le script correspondant :

```bash
cp ~/Claudient/hooks/lifecycle/cost-tracker.sh your-project/.claude/hooks/
chmod +x your-project/.claude/hooks/cost-tracker.sh
```

---

## Étape 6 — (Optionnel) Ajouter un agent

Les agents sont des définitions de sous-agents que vous référencez dans vos sessions Claude. Ils ne nécessitent pas de copie de fichier — vous les appelez par `subagent_type` dans un appel à l'outil Agent.

Parcourez `agents/` pour comprendre ce qui est disponible. Quand vous souhaitez que Claude délègue une tâche à un spécialiste (par exemple, un réviseur de sécurité, un spécialiste base de données), référencez la définition de l'agent pour comprendre ce qu'il attend et ce qu'il retourne.

---

## Que faire ensuite

| Objectif | Où chercher |
|---|---|
| Écrire votre propre compétence | [guides/skill-authoring.md](skill-authoring.md) |
| Réduire les coûts en tokens | [guides/token-optimization.md](token-optimization.md) |
| Comprendre la mémoire et l'état de session | [guides/memory-management.md](memory-management.md) |
| Sécuriser votre configuration Claude Code | [guides/security.md](security.md) |
| Construire des workflows automatisés multi-étapes | [guides/agent-orchestration.md](agent-orchestration.md) |
| Automatiser la qualité avec les hooks | [guides/hooks-cookbook.md](hooks-cookbook.md) |

---

## Dépannage

**La compétence n'apparaît pas comme commande slash**
— Vérifiez que le fichier est dans `.claude/skills/` (ou `.claude/commands/` pour l'ancien chemin)
— Vérifiez que l'extension du fichier est `.md`
— Redémarrez Claude Code

**Le hook ne se déclenche pas**
— Vérifiez que le nom de l'événement correspond exactement : `PreToolUse`, `PostToolUse`, `PreCompact`, `Notification`
— Vérifiez que le chemin du script est relatif à la racine du projet
— Vérifiez que le script est exécutable (`chmod +x`)

**CLAUDE.md n'est pas lu**
— Il doit se trouver à la racine du projet (au même niveau que `src/`, `package.json`, etc.)
— Redémarrez la session Claude Code après l'avoir modifié

---

## Travaillez avec nous
