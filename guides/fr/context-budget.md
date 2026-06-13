# Gestion du Budget de Contexte

Comment suivre, planifier et optimiser l'utilisation des tokens au sein d'une session Claude Code — pour les développeurs seniors gérant de longues sessions, des pipelines d'agents et des boucles de travail autonome.

---

## Pourquoi le budget de contexte est important

Les sessions Claude Code opèrent dans une fenêtre de contexte finie. Au fur et à mesure qu'une session grandit, chaque appel d'outil, lecture de fichier, sortie bash et tour d'assistant s'accumule. Quand la fenêtre se remplit :

- La qualité de réponse de Claude se dégrade notablement avant la limite stricte (empiriquement, autour de 300–400k tokens sur le modèle 1M)
- Vous êtes forcé d'utiliser `/compact` (résumé avec perte) ou une nouvelle session
- Les coûts augmentent avec la taille du contexte — une fenêtre gonflée coûte plus par tour

Le mode d'échec n'est pas d'atteindre la limite stricte — c'est de dépenser la majeure partie de votre budget sur du bruit avant que votre tâche soit à moitié terminée. Les longs résultats de log non tronqués, les fichiers entiers lus quand seules 30 lignes étaient nécessaires, les relectures répétées du même fichier, les appels d'agents enfants qui portent le contexte parent complet : ce sont les modèles qui effondrent un budget.

Ce guide couvre ce qui consomme le budget, comment le mesurer et comment rester en contrôle tout au long du cycle de vie complet de la session.

---

## Qu'est-ce qui consomme le contexte

| Source | Coût typique | Notes |
|---|---|---|
| Prompt système / CLAUDE.md | 500–5 000 tokens | Chargé au démarrage de chaque session |
| Chaque appel d'outil + résultat | 200–2 000 tokens | Dépend entièrement de la verbosité de la sortie |
| Lectures de fichiers | ~1 token par 4 caractères | Un fichier de 1 000 lignes représente environ 10K tokens |
| Sortie Bash | Illimitée | La sortie de log longue est le plus grand destructeur de budget |
| Définitions des outils MCP (10 serveurs) | ~25 000–35 000 tokens | Chargé au démarrage de la session, avant le premier message |
| Appels d'agents enfants | Contexte complet du sous-agent | Chaque agent spawné initialise sa propre fenêtre de contexte |
| Images / captures d'écran | 1 500–3 000 tokens | Par image, indépendamment de la complexité du contenu |
| Historique de conversation | Grandit à chaque tour | Les tours utilisateur et assistant s'accumulent tous deux |

Les deux sources que la plupart des développeurs sous-estiment sont **la sortie Bash** et **les définitions des outils MCP**. Un simple `npm install` avec journalisation verbose peut ajouter 3–5K tokens. Dix serveurs MCP activés avec huit outils chacun représentent ~30K tokens de surcharge chargés avant le premier message utilisateur.

---

## La commande `/compact`

`/compact` résume l'historique de conversation en une représentation compressée et la remplace dans le contexte. C'est une opération avec perte — le résumé conserve les décisions et les résultats mais supprime les détails exacts.

**Ce qui survit à la compaction :**
- Les décisions de haut niveau et le raisonnement
- L'état actuel du fichier (ce qui a été écrit)
- Les faits clés explicitement discutés

**Ce qui ne survit pas à la compaction :**
- Les messages d'erreur exacts et les stack traces
- Les snippets de code spécifiques qui ont été lus mais non écrits
- Les chaînes de débogage étape par étape
- Le contenu de fichiers qui ont été lus mais non modifiés

**Quand compacter :**
- À 50–60% d'utilisation du contexte, pas à 90%. La compaction à 50% produit un résumé de meilleure qualité car plus de signal est encore dans la fenêtre par rapport au bruit.
- Après avoir complété une sous-tâche majeure avant de commencer la suivante
- Avant une tâche qui nécessitera de lire de nombreux fichiers volumineux
- Après une longue session de débogage où les tentatives échouées polluent le contexte

**Compaction dirigée** préserve le fil le plus important :

```
/compact focus on the auth refactor — drop the test debugging context
```

Sans indice, le résumeur fait ses propres choix sur ce qui importe. Un indice spécifique ancre le résumé.

**Ne pas attendre le seuil automatique.** La compaction automatique par défaut se déclenche à ~95% de capacité. À ce moment, la qualité s'est déjà dégradée considérablement et le résumé a moins de signal avec lequel travailler.

---

## Stratégies de budget de contexte

### a. Lire uniquement ce dont vous avez besoin

Utilisez les paramètres `limit` et `offset` sur l'outil Read. Un fichier de 2 000 lignes lu en intégralité représente ~20K tokens. Si vous avez besoin des lignes 400–450, c'est ~500 tokens.

```
# Fichier complet : ~20K tokens
Read /path/to/service.ts

# Lecture ciblée : ~500 tokens
Read /path/to/service.ts, offset: 400, limit: 50
```

Utilisez Grep au lieu de lire des fichiers quand vous recherchez un motif. Grep retourne les lignes correspondantes et un petit contexte — pas le fichier entier. Pour une base de code de 5 000 lignes, c'est la différence entre 50K tokens et 500.

Ne jamais lire des fichiers de log entiers. Créez un pipe vers `head` et recherchez d'abord la section pertinente.

### b. Tronquer la sortie Bash

La sortie Bash incontrôlée est la source la plus courante de consommation de contexte incontrôlable. Appliquez ces modèles systématiquement :

```bash
# Limiter le volume de sortie
npm install 2>/dev/null | tail -5
docker logs mycontainer --tail 100
git log --oneline -20

# Supprimer le bruit de progression
curl -s https://api.example.com/endpoint
rsync -a --quiet src/ dst/

# Rediriger stderr quand ce n'est pas pertinent
make build 2>/dev/null

# Résumer avant de retourner
./run-tests.sh | grep -E "PASS|FAIL|ERROR" | tail -30
```

Pour toute commande qui produit une sortie multi-écran, ajoutez `| head -N` ou `| tail -N` comme pratique par défaut. Le N exact importe moins que l'habitude.

### c. Utiliser la compression de sortie PostToolUse

À partir de Claude Code v2.1.121+, un hook `PostToolUse` peut remplacer la sortie de l'outil avant que Claude ne la traite. Cela vous permet de compresser, de rediger ou de résumer les résultats des outils verbeux automatiquement — sans modifier l'appel d'outil lui-même.

**settings.json :**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/compress-output.sh"
          }
        ]
      }
    ]
  }
}
```

**`.claude/hooks/compress-output.sh` :**
```bash
#!/usr/bin/env bash
# Lit la sortie de l'outil à partir de stdin (JSON), compresse si elle dépasse le seuil, écrit vers stdout.
# Claude reçoit la sortie du hook comme résultat de l'outil.

set -euo pipefail

input=$(cat)
output=$(echo "$input" | jq -r '.output // ""')
line_count=$(echo "$output" | wc -l | tr -d ' ')

if [ "$line_count" -gt 150 ]; then
  # Tronquer et annoter — Claude voit une version tronquée
  trimmed=$(echo "$output" | head -100)
  tail_section=$(echo "$output" | tail -20)
  echo "$input" | jq --arg trimmed "$trimmed" --arg tail "$tail_section" \
    '.output = "[Output truncated from '"$line_count"' lines]\n\nFirst 100 lines:\n" + $trimmed + "\n\n[...]\n\nLast 20 lines:\n" + $tail'
else
  echo "$input"
fi
```

Cela s'exécute sur chaque appel Bash. Si la sortie est inférieure à 150 lignes, elle passe inchangée. Plus de 150 lignes, elle remplace le résultat par une version tronquée annotée avec le décompte de lignes. Le contexte de Claude reçoit le résultat compressé — la sortie complète n'entre jamais dans la fenêtre.

Le même modèle fonctionne pour rediger les secrets : supprimez les lignes correspondant à `API_KEY|SECRET|TOKEN|PASSWORD` avant que Claude ne les traite.

### d. Portée CLAUDE.md agressivement

Le `CLAUDE.md` au niveau du projet se charge au démarrage de chaque session. Chaque token qu'il contient est un coût fixe qui se compose à travers chaque session que vous exécutez.

**Objectif :** Gardez votre `CLAUDE.md` de projet en dessous de 2 000 tokens (~300–400 lignes de prose simple). Le `CLAUDE.md` au niveau de l'utilisateur `~/.claude/CLAUDE.md` s'ajoute — traitez le total combiné comme votre surcharge de base.

**Ce qu'il faut garder dans CLAUDE.md :**
- Description du projet (3–5 phrases)
- Répertoires clés et leur objectif
- Les conventions non évidentes que Claude doit suivre
- Commandes pour build, test, lint
- Les choses à ne pas modifier sans demander

**Ce qu'il faut déplacer :**
- Documentation de référence (formes d'API, descriptions de schéma) — lisez-les à la demande, uniquement quand c'est pertinent
- Les longs exemples — référencez-les par chemin de fichier et lisez à la demande
- Les décisions historiques — gardez un `decisions.md` séparé et chargez-le uniquement quand vous travaillez dans ce domaine

Un `CLAUDE.md` qui a grandi organiquement au cours de mois contient souvent des règles pour des problèmes qui n'existent plus. Auditez-le et supprimez les règles mortes. Chaque règle supprimée économise des tokens à chaque session pour toujours.

### e. Résumer avant de spawner les agents

Quand vous spawner un sous-agent, il obtient sa propre fenêtre de contexte. La façon dont vous transmettez les informations détermine si vous transmettez du signal ou du bruit.

**Ne forwarded pas l'historique d'outil brut.** Si vous venez de faire 20 lectures de fichiers et 10 appels bash dans le contexte parent, passer cette conversation verbatim à un sous-agent gaspille le budget et dégrade la concentration du sous-agent.

À la place, résumez les résultats en un briefing structuré avant de spawner :

```
# Mauvaise approche :
Spawn agent with: full parent conversation history

# Meilleure approche :
Before spawning, construct a briefing:
  "The auth module is in src/auth/. The issue is in jwt.ts line 84 —
  the expiry check compares against Date.now() but tokens use seconds, not
  milliseconds. The fix is to multiply exp by 1000 before comparing.
  Relevant files: jwt.ts, middleware/auth.ts, tests/auth.test.ts.
  Task: fix the comparison and update the test."

Spawn agent with: the briefing only
```

Le sous-agent reçoit exactement ce dont il a besoin. Le contexte parent retrouve les conclusions du sous-agent sans que l'historique complet des outils du sous-agent soit réinjecté.

### f. Conscience de LLMS.txt

Quand vous tirez de la documentation externe — une référence d'API de bibliothèque, un guide de configuration de framework — vérifiez si le projet publie un fichier `llms.txt`.

`llms.txt` est un format de documentation compressé spécifiquement conçu pour la consommation LLM. C'est généralement 5–10x plus petit que le contenu équivalent du site de docs. Récupérer `https://docs.example.com/llms.txt` au lieu de scraper plusieurs pages peut économiser 50–200K tokens sur des tâches intensives en documentation.

Vérifiez avant de lire les docs brutes :
```bash
curl -s https://docs.anthropic.com/llms.txt | head -50
```

S'il existe, utilisez-le comme source principale. S'il n'existe pas, ne récupérez que la page spécifique dont vous avez besoin au lieu de suivre les liens.

### g. Utiliser les opérations batch

Dans les pipelines d'agents et les workflows SDK, accumulez les résultats dans les appels batch plutôt que dans les tours interactifs individuels. `agent_sdk.batch()` exécute plusieurs sous-tâches et retourne leurs résultats sans que chaque sous-tâche remplisse le contexte interactif du parent avec l'historique des outils intermédiaires.

C'est l'équivalent programmatique de la stratégie de résumé du sous-agent ci-dessus — structurez le travail pour que les étapes intermédiaires ne persistent pas dans le contexte principal.

---

## La commande `/usage`

`/usage` affiche une décomposition des tokens par catégorie pour la session actuelle. Disponible dans Claude Code (vérifiez `claude --version` pour la disponibilité dans votre build).

**Catégories affichées :**
- Prompt système (CLAUDE.md + contexte système intégré)
- Définitions des outils MCP
- Historique de conversation (tours utilisateur + assistant)
- Résultats des outils (lectures de fichiers, sorties bash, réponses MCP)
- Appels d'agents enfants

**Comment l'utiliser efficacement :**

Exécutez `/usage` au démarrage de la session, immédiatement après le chargement de Claude. Cela vous donne une ligne de base — la surcharge fixe de votre CLAUDE.md, des outils MCP et du prompt système avant que vous ayez fait du travail. Ce nombre est votre plancher ; chaque session coûtera au moins ce montant.

Si la ligne de base de démarrage de la session est supérieure à 30–40K tokens, vous avez un problème de configuration :
- Trop de serveurs MCP activés
- CLAUDE.md est trop grand
- Les deux

Exécutez `/usage` à nouveau après une phase de tâche majeure (par exemple, après avoir terminé l'exploration de fichiers, avant de commencer l'implémentation). Cela montre combien de budget chaque phase a consommé, ce qui informe les décisions sur la question de savoir si compact avant de continuer.

---

## Budget de contexte dans les boucles autonomes / agents

Les boucles autonomes (`/loop`, agents planifiés, pipelines CI) accumulent le contexte différemment des sessions interactives. Chaque itération d'une boucle s'ajoute au même contexte sauf si vous le gérez activement.

**Modèles clés :**

**Résumer entre les itérations.** À la fin de chaque itération de boucle, écrivez un résumé structuré dans un fichier. L'itération suivante lit le fichier de résumé au lieu de porter l'historique complet des outils de l'itération précédente.

```bash
# Fin de chaque itération de boucle — écrire l'état sur le disque
cat > /tmp/loop-state.json <<EOF
{
  "iteration": 3,
  "completed": ["auth module", "user service"],
  "current": "payment service",
  "blockers": [],
  "next": "review payment integration tests"
}
EOF
```

**Utiliser ScheduleWakeup pour réinitialiser le contexte.** L'outil `ScheduleWakeup` termine la fenêtre de contexte actuelle et reprend au prochain tick programmé dans une fenêtre fraîche. Pour les tâches autonomes longues, c'est préférable à l'accumulation de contexte à travers des dizaines d'itérations. Le compromis est un cache miss (> 5 minutes de délai) — acceptable quand le travail de l'itération prend plus que quelques minutes.

**Écrire les résumés de session dans le hook Stop.** Quand Claude termine un tour dans une session autonome, le hook Stop s'exécute. Utilisez-le pour écrire un résumé de session sur le disque avant que le contexte ne s'accumule davantage.

**`.claude/hooks/stop-summary.sh` :**
```bash
#!/usr/bin/env bash
# S'exécute sur l'événement Stop. Ajoute un résumé de session à un log persistant.

set -euo pipefail

timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
last_commit=$(git log -1 --oneline 2>/dev/null || echo "no commits")

cat >> "${CLAUDE_PROJECT_DIR}/.claude/session-log.md" <<EOF

## Session ended: ${timestamp}
Branch: ${branch}
Last commit: ${last_commit}

EOF
```

**Injecter le contexte compact au SessionStart.** Au lieu de rétablir le contexte à travers des lectures de fichiers répétées au démarrage de chaque session autonome, utilisez un hook `SessionStart` pour injecter le résumé écrit par le hook Stop de la session précédente. Cela donne à la nouvelle fenêtre de contexte une orientation structurée immédiatement.

**`.claude/hooks/session-start.sh` :**
```bash
#!/usr/bin/env bash
# S'exécute au SessionStart. Produit un briefing compact que Claude lit à l'ouverture de la session.

set -euo pipefail

summary_file="${CLAUDE_PROJECT_DIR}/.claude/session-log.md"

if [ -f "$summary_file" ]; then
  echo "=== SESSION CONTEXT (from previous session) ==="
  tail -50 "$summary_file"
  echo "=== END SESSION CONTEXT ==="
fi
```

---

## Modèle de hook Pre-compact

Quand `/compact` s'exécute, Claude génère un résumé de la conversation. Le hook `PreCompact` s'exécute avant ce résumé — vous donnant une fenêtre pour injecter l'état structuré qui enrichit le résumé.

Sans un hook PreCompact, le résumé est généré purement à partir de la conversation. Avec un hook PreCompact qui injecte la branche actuelle, les tâches ouvertes, les commits récents et les décisions clés, le résumé de compaction porte considérablement plus de contexte opérationnel dans la fenêtre suivante.

**settings.json :**
```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/pre-compact.sh",
            "timeout": 15
          }
        ]
      }
    ]
  }
}
```

**`.claude/hooks/pre-compact.sh` :**
```bash
#!/usr/bin/env bash
# S'exécute avant /compact. Produit l'état structuré qui enrichit le résumé de compaction.

set -euo pipefail

branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
recent_commits=$(git log -5 --oneline 2>/dev/null || echo "unavailable")
staged=$(git diff --cached --stat 2>/dev/null || echo "none")
unstaged=$(git diff --stat 2>/dev/null || echo "none")

cat <<EOF
=== PRE-COMPACT STATE INJECTION ===
Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
Branch: ${branch}

Recent commits:
${recent_commits}

Staged changes:
${staged}

Unstaged changes:
${unstaged}
=== END STATE INJECTION ===
EOF
```

La sortie injectée apparaît dans le contexte immédiatement avant la génération du résumé de compaction. Claude incorpore cet état lors de la rédaction du résumé. Le résumé résultant — qui devient l'ouverture de la nouvelle fenêtre de contexte — contiendra la branche, l'historique récent des commits et le statut des modifications sans que vous ayez besoin de rétablir ces faits manuellement après la compaction.

Étendez ce modèle pour inclure les tâches ouvertes (à partir d'un fichier de tâche), les décisions architecturales prises pendant la session (à partir d'un log de décisions), ou tout autre état structuré qui serait autrement perdu.

---

## Référence rapide — liste de contrôle d'hygiène du contexte

- [ ] CLAUDE.md du projet est en dessous de 2 000 tokens ; CLAUDE.md utilisateur est maigre
- [ ] Seuls les serveurs MCP nécessaires pour cette session sont activés
- [ ] Les commandes Bash créent un pipe vers `| head -N` ou `| tail -N` quand la sortie est illimitée
- [ ] Hook de compression PostToolUse installé pour les outils verbeux (Bash, MCP produisant des logs)
- [ ] Les lectures de fichiers volumineux utilisent `limit` et `offset` — pas de lectures complètes de fichiers sur 200 lignes sauf si le contenu complet est nécessaire
- [ ] `/compact` déclenché à 50–60% d'utilisation du contexte, pas à 90%+
- [ ] Les sous-agents reçoivent un briefing structuré, pas l'historique brut de la conversation parent
- [ ] Documentation externe chargée via `llms.txt` quand disponible
- [ ] Les itérations de boucle autonome écrivent l'état sur le disque ; l'itération suivante lit depuis le disque
- [ ] Hook PreCompact installé pour enrichir les résumés de compaction
- [ ] Hook Stop écrit le résumé de session pour le chargeur de contexte de la session suivante
- [ ] `/usage` vérifiée au démarrage de la session pour confirmer que la surcharge de base est acceptable

---
