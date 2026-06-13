# Guide de gestion de la mémoire

Comment persister le contexte entre les sessions, survivre à la compaction et garder la mémoire de travail de Claude précise.

---

## Le problème de la mémoire

Claude Code n'a pas de mémoire persistante entre les sessions par défaut. Chaque nouvelle session commence à zéro. Dans une session, le contexte croît jusqu'au déclenchement de la compaction — à ce moment, l'historique de conversation est compressé et certains détails sont perdus.

La gestion de la mémoire est la pratique de contrôler explicitement ce que Claude sait, quand il le sait et comment cette connaissance survit aux frontières de session.

---

## Les quatre couches de mémoire

| Couche | Où | Persiste entre sessions | Survit à la compaction |
|---|---|---|---|
| **CLAUDE.md** | Racine du projet | Oui | Oui |
| **Fichiers de session** | `.claude/memory/` ou `.tmp/` | Oui (si sauvegardé) | Oui (si sauvegardé avant compact) |
| **Fenêtre de contexte** | Session uniquement | Non | Non (compressé) |
| **Contexte de sous-agent** | Par sous-agent | Non | Non |

---

## 1. CLAUDE.md comme mémoire permanente

`CLAUDE.md` est lu au début de chaque session. C'est la couche de mémoire la plus fiable.

**Ce qui appartient à CLAUDE.md :**
- Vue d'ensemble de l'architecture du projet (un paragraphe, pas exhaustif)
- Conventions que Claude se tromperait sans guidance (nommage, patterns, choix de stack)
- Décisions déjà prises et qui ne doivent pas être remises en question
- Ce que Claude ne doit jamais faire dans ce projet

**Ce qui N'appartient PAS à CLAUDE.md :**
- Travail en cours ou état des tâches (change trop vite, devient obsolète)
- Longues explications sur le fonctionnement des technologies
- Tout — CLAUDE.md de plus de 500 lignes commence à coûter plus qu'il ne rapporte

**Exemple de section mémoire CLAUDE.md :**
```markdown
## Decisions (do not re-discuss)
- Auth: JWT with 15-minute access tokens, 7-day refresh tokens. Not sessions.
- ORM: raw SQL with pg. No Prisma, no Drizzle — decided March 2026.
- Error format: `{ error: string, code: string }` — never change shape.

## Conventions
- All API routes return 204 (not 200) for successful mutations with no body.
- Database column names are snake_case; JS/TS properties are camelCase.
```

---

## 2. Fichiers de session pour la mémoire de travail

Pour le contexte en cours qui n'appartient pas définitivement à CLAUDE.md, utilisez des fichiers de session.

**Pattern :**
```
.claude/
└── memory/
    ├── current-task.md       ← sur quoi vous travaillez en ce moment
    ├── decisions.md          ← décisions prises cette semaine
    └── context-dump.md       ← contexte nécessaire pour une longue tâche
```

Au début d'une session : "Lis `.claude/memory/current-task.md` en premier."

**Compression des fichiers de session :** Utilisez le pattern caveman-compress — réécrire les fichiers mémoire en prose compressée économise ~46% sur les tokens d'entrée lus chaque session.

---

## 3. Hook pre-compact pour survivre

Quand la compaction se déclenche automatiquement, tout contexte de travail dans la session qui n'a pas été sauvegardé dans un fichier est perdu. Un hook `PreCompact` s'exécute avant la compaction.

```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/pre-compact-save.sh"
          }
        ]
      }
    ]
  }
}
```

**Ce que `pre-compact-save.sh` doit faire :**
1. Demander à Claude de résumer : état de la tâche actuelle, décisions ouvertes, fichiers modifiés, prochaines étapes
2. Écrire ce résumé dans `.claude/memory/session-state.md` avec un horodatage

---

## 4. Isolation de la mémoire des sous-agents

Les sous-agents obtiennent une fenêtre de contexte propre — ils n'ont pas de mémoire de la session parente par défaut.

**Passer la mémoire aux sous-agents :**
- Inclure explicitement les sections CLAUDE.md pertinentes dans le prompt du sous-agent
- Passer les chemins de fichiers spécifiques et les décisions dont le sous-agent a besoin

**Récupérer la mémoire des sous-agents :**
- Faire écrire les résultats dans un fichier par le sous-agent
- Relire ce fichier dans la session parente

---

## 5. CONTEXT.md pour le langage du domaine

Les projets complexes bénéficient d'un `CONTEXT.md` — un glossaire des termes spécifiques au domaine.

**Structure :**
```markdown
# Contexte du projet

## Language
**Order**: Intent d'achat d'un client pour un ou plusieurs Produits.
**Cart**: État pré-commande temporaire. Distinct d'Order — ne pas confondre.

## Relationships
- Un Order contient un ou plusieurs OrderLines
- Un Cart appartient à exactement un User

## Decisions
- "Basket" était utilisé dans le code ancien — résolu : toujours utiliser "Cart"
```

---

## 6. Stratégie de compaction de mémoire

**La compaction proactive bat la compaction réactive.**

**Quand compacter manuellement (`/compact`) :**
- Avant de commencer une nouvelle tâche majeure dans la même session
- Après avoir terminé une longue session de débogage
- Quand Claude commence à répéter des questions ou perd le fil des décisions

**Ce que `/compact` préserve :** Le résumé que Claude génère. Avant de compacter : "Quand tu compactes, assure-toi de préserver : la décision d'auth, les trois fichiers modifiés et le bug dans le parser."

---

## Référence rapide

| Situation | Action |
|---|---|
| Décisions immuables | Mettre dans CLAUDE.md |
| État de la tâche actuelle | `.claude/memory/current-task.md` |
| Terminologie du domaine | `CONTEXT.md` à la racine du projet |
| Survivre à la compaction | Hook `PreCompact` → session-state.md |
| Démarrer une nouvelle tâche majeure | `/compact` d'abord |
| Passer le contexte à un sous-agent | L'inclure explicitement dans le prompt |
| Claude pose des questions déjà répondues | Ajouter la réponse à CLAUDE.md |

---

## Travaillez avec nous
