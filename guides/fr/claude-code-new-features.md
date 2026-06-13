# Guide des nouvelles fonctionnalités Claude Code (2026)

Le guide définitif des dernières capacités de Claude Code — basé sur le changelog officiel et la documentation Nouveautés. Couvre Agent View, /goal, /ultrareview, Auto Mode, Opus 4.7, Computer Use, Ultraplan et le bureau redessiné.

---

## Référence rapide — Toutes les nouvelles commandes

| Commande | Ce qu'elle fait | Depuis |
|---|---|---|
| `claude agents` | Tableau de bord pour toutes les sessions parallèles | v2.1.139 |
| `/goal [condition]` | Claude travaille de manière autonome jusqu'à ce que la condition soit remplie | v2.1.139 |
| `/ultrareview` | Flotte d'agents cloud examine votre code | v2.1.111 |
| `claude ultrareview [target]` | Examen cloud non-interactif pour CI | v2.1.120 |
| `/effort` | Curseur interactif pour définir le niveau d'intelligence | v2.1.111 |
| `/loop [interval]` | Exécuter une commande sur un calendrier récurrent | v2.1.95 |
| `/goal` | Accomplissement autonome de tâches | v2.1.139 |
| `/autofix-pr` | Correction automatique des PR depuis votre terminal | v2.1.100 |
| `/team-onboarding` | Empaquetez votre configuration en tant que guide rejouable | v2.1.100 |
| `claude project purge` | Supprimer tout l'état local d'un projet | v2.1.126 |
| `--plugin-url <url>` | Charger le plugin depuis une URL pour la session actuelle | v2.1.129 |
| `--plugin-dir <path.zip>` | Charger le plugin depuis une archive .zip | v2.1.128 |

---

## Agent View — Toutes les sessions dans un tableau de bord

`claude agents` (lancé le 11 mai 2026 — Aperçu de recherche) vous donne un écran pour chaque session Claude Code: ce qui s'exécute, ce qui est bloqué en attendant votre saisie, ce qui est fait.

```bash
# Ouvrir Agent View
claude agents

# Agent View avec paramètres spécifiques
claude agents --model claude-opus-4-7 --effort xhigh

# Lister les sessions en JSON (pour scripts, barres de statut, tmux)
claude agents --json

# Limiter à un répertoire spécifique
claude agents --cwd /path/to/project
```

**Ce que vous voyez:**
- Chaque session en cours d'exécution avec sa tâche actuelle et son statut
- Sessions bloquées attendant votre saisie (signalées de manière évidente)
- Sessions complétées avec la durée de leur exécution
- Coûts en temps réel par session

**Répondre sans perdre le contexte:**
Vous pouvez répondre à n'importe quelle session en attente directement depuis Agent View sans basculer les fenêtres de terminal.

**Le titre de l'onglet montre le nombre en attente:**
Le titre de l'onglet du terminal se met à jour pour afficher combien de sessions attendent votre saisie — consultable sans ouvrir Agent View.

**Meilleure pratique — sessions de worktree parallèles:**
```bash
# Créer des worktrees isolés pour chaque tâche
git worktree add ../myapp-auth feature/auth
git worktree add ../myapp-payments fix/payment-timeout
git worktree add ../myapp-docs docs/api-reference

# Démarrer Claude dans chacun (mode arrière-plan)
cd ../myapp-auth     && claude --bg "implement OAuth with Better Auth"
cd ../myapp-payments && claude --bg "fix the Stripe webhook signature verification"
cd ../myapp-docs     && claude --bg "write API documentation for all routes"

# Surveiller les trois depuis un seul écran
claude agents
```

---

## /goal — Accomplissement autonome de tâches

Définissez une condition d'accomplissement mesurable. Claude itère — écrivant du code, exécutant des tests, corrigeant les erreurs — jusqu'à ce que la condition soit remplie.

```bash
# En mode interactif
/goal all tests pass for the auth module

# Avec une condition mesurable spécifique
/goal the /api/users endpoint returns 201 with valid input and 422 with invalid email

# Avec un budget de temps
/goal migrate the database schema and verify all existing tests still pass

# S'exécute également en mode non-interactif (-p flag)
claude -p "..." --goal "all TypeScript errors resolved"
```

**Comment fonctionne /goal:**
1. Claude comprend l'état actuel
2. Écrit ou corrige du code vers l'objectif
3. Exécute les tests ou les commandes de vérification
4. Lit les résultats, corrige les erreurs
5. Répète jusqu'à ce que la condition d'objectif soit remplie ou qu'une impasse soit atteinte
6. S'arrête et rapporte le résultat

**Bons objectifs (spécifiques, testables):**
```
/goal npm test passes with zero failures
/goal the Lighthouse score for the homepage is above 90
/goal the Docker container builds and all health checks pass
/goal all TypeScript errors in src/ are resolved
/goal the migration runs cleanly on the staging database
```

**Éviter les objectifs vagues:**
```
/goal make the app better           ← not testable
/goal fix all the bugs              ← too open-ended
/goal improve code quality          ← no clear signal
```

**Remarque:** L'évaluateur /goal attend que tous les shells et sous-agents en cours d'exécution se terminent avant de vérifier la condition.

---

## /ultrareview — Examen du code de la flotte cloud

Une flotte d'agents spécialisés s'exécute dans le cloud pour examiner votre code. Les résultats arrivent directement dans votre CLI ou Bureau.

```bash
# Examiner la branche actuelle (interactif)
/ultrareview

# Examiner un PR spécifique
/ultrareview PR#123

# Non-interactif (pour les scripts CI/CD)
claude ultrareview                    # review current branch
claude ultrareview --pr 123          # review specific PR
claude ultrareview --focus security  # focus on security only
```

**Ce que la flotte vérifie:**
- Vulnérabilités de sécurité (injection, contournement d'authentification, secrets exposés)
- Erreurs de logique et cas limites manqués dans les tests
- Goulets d'étranglement de performance (requêtes N+1, fuites de mémoire)
- Modifications d'API incompatibles
- Lacunes de couverture de test

**vs. /code-review (local):**
- `/code-review` — agent unique, contexte de session actuelle, plus rapide
- `/ultrareview` — plusieurs agents spécialisés en parallèle, couverture plus large, meilleur avant la fusion

---

## Auto Mode — Gestion intelligente des permissions

Auto mode classe vos invites de permission automatiquement:
- **Opérations sûres** (lecture seule, sandbox) → s'exécuter sans vous interrompre
- **Opérations risquées** (destructives, réseau, accès aux identifiants) → bloquées ou escaladées

```bash
# Activer le mode auto
claude --auto-mode

# Le mode auto est désormais disponible sans le drapeau pour les abonnés Max
# Sur Opus 4.7 avec abonnement Max: activé par défaut

# Règles de refus difficile (bloquées inconditionnellement indépendamment des exceptions autorisées)
# Dans .claude/settings.json:
{
  "autoMode": {
    "hard_deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force)"
    ]
  }
}
```

**Le spinner Auto mode devient rouge** quand une vérification de permission se bloque — signal visuel qu'il faut votre attention.

---

## Claude Opus 4.7 + Niveaux d'effort

Opus 4.7 est maintenant le modèle par défaut pour Max et Team Premium. Il introduit le niveau d'effort `xhigh` — le paramètre recommandé pour les tâches de codage complexes.

```bash
# Définir le niveau d'effort de manière interactive
/effort

# Utilisez le curseur d'effort (touches fléchées, Entrée pour confirmer)
# Niveaux: low → medium → high → xhigh

# Définir via la ligne de commande
claude --effort xhigh "debug this race condition"
claude --effort low   "rename this variable"

# Vérifier le niveau d'effort dans les hooks via $CLAUDE_EFFORT
# Ou effort.level dans l'entrée JSON du hook

# Le mode rapide utilise maintenant Opus 4.7 par défaut
# Revenir à 4.6: CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE=1
```

**Quand utiliser chaque niveau d'effort:**

| Niveau | Utiliser pour | Dépense de tokens |
|---|---|---|
| `low` | Renommage de variable, formatage, complétions simples | Minimal |
| `medium` | Travail de fonction standard, débogage d'erreurs courantes | Modéré |
| `high` | Refactorings, examens architecturaux, rédaction de tests | Plus élevé |
| `xhigh` | Audits de sécurité, conditions de course, modifications complexes multi-fichiers | Le plus élevé |

**Compresser le contexte antérieur:**
Le menu Rewind inclut maintenant "Summarize up to here" — compresse les tours antérieurs tout en conservant le contexte récent. Réduit les coûts sans perdre les décisions clés.

---

## Computer Use — Contrôle CLI des applications GUI

Claude peut ouvrir les applications natives, cliquer dans l'interface utilisateur et vérifier les modifications qui ne peut que confirmer une interface graphique.

```bash
# Activer l'utilisation du clavier (aperçu de recherche)
claude --computer-use

# Claude peut maintenant:
# - Ouvrir des applications sur votre bureau
# - Cliquer sur des boutons et remplir des formulaires
# - Prendre des captures d'écran et vérifier l'état de l'interface
# - Exécuter des flux de bout en bout qui nécessitent un vrai navigateur ou une application
```

**Meilleurs cas d'utilisation:**
- Vérifier qu'un changement d'interface utilisateur semble correct
- Automatiser les flux qui n'ont pas d'interface CLI (applications héritées, interfaces web complexes)
- Fermer la boucle après les modifications du code: "cela fonctionne-t-il réellement dans le navigateur?"

**Également disponible dans l'application Bureau** — l'utilisation du clavier fonctionne à la fois en interface CLI et en bureau redessiné.

---

## Ultraplan — Planification cloud + Exécution distante

Rédigez un plan dans le cloud, examinez et commentez dans un éditeur web, puis exécutez-le à distance ou ramenez-le localement.

```bash
# Démarrer Ultraplan (aperçu précoce)
/ultraplan

# Claude rédige un plan structuré
# → Vous obtenez une URL pour examiner et commenter dans un éditeur web
# → Commenter sur les étapes, approuver/rejeter des pièces
# → Exécuter à distance dans un environnement cloud
# → Ou ramener localement et exécuter là

# La première exécution crée automatiquement un environnement cloud pour vous
```

**Idéal pour:**
- Les tâches multi-jours longues qui bénéficient d'un plan structuré écrit avant l'exécution
- Partager un plan avec les coéquipiers pour examen avant exécution
- Les tâches qui doivent s'exécuter dans un environnement cloud propre (pas votre machine locale)

---

## Routines — Agents cloud programmés

Sur Claude Code Web, les Routines exécutent les agents cloud modélisés à partir d'un calendrier, d'un événement GitHub ou d'un appel API.

```
Exemples de routines:
- "Every Monday: review open PRs and summarize what needs attention"
- "On push to main: run /ultrareview on the diff"
- "Daily at 9am: check for dependency security advisories"
- "On GitHub issue opened: triage and label it"
```

Configurer dans l'interface Claude Code Web → Routines.

---

## Monitor Tool — Diffusion en direct des journaux

L'outil Monitor diffuse les événements de fond dans la conversation — Claude peut suivre les logs et réagir en temps réel.

```bash
# Claude peut utiliser l'outil Monitor automatiquement lors de la surveillance des processus
# Ou vous pouvez l'invoquer explicitement:
/monitor <process or log source>

# Exemple: Claude surveille un déploiement et réagit aux erreurs
"Deploy this to staging and monitor the logs — fix any errors that appear"
```

---

## Expérience de bureau redessinée

Le Claude Code Desktop (Web) a reçu une refonte majeure avec:

**Disposition parallèle:**
- Plusieurs agents visibles simultanément à partir d'une fenêtre
- Chats latéraux sans perdre le fil principal
- Arrangement de panneaux par glisser-déposer
- Barre latérale des sessions pour naviguer entre les projets

**Outils intégrés:**
- Prévisualistes HTML et PDF (afficher la sortie générée en ligne)
- Éditeur de fichiers intégré (modifier les fichiers sans basculer vers votre IDE)
- Visionneur de diff reconstruit (examiner les modifications sans un autre outil)
- Thèmes personnalisés (créer à partir de `/theme` ou via un plugin)

**Auto-archive:**
Les sessions s'archiver automatiquement quand leur PR associé est fusionné — garde votre espace de travail propre.

**Récapitulatif de session:**
Quand vous revenez à une session qui s'exécutait en arrière-plan, Claude fournit un récapitulatif de ce qui s'est passé pendant votre absence.

---

## Plugins: Chargement .zip et URL

```bash
# Charger un plugin depuis un fichier .zip (pour la session actuelle)
claude --plugin-dir ./my-plugin.zip

# Charger depuis une URL
claude --plugin-url https://example.com/my-plugin.zip

# Parcourir et installer depuis la marketplace
/plugin

# Afficher les détails du plugin (composants, coût du token)
claude plugin details <name>

# Lister les composants du plugin avant installation
# /plugin affiche maintenant les compétences, les hooks, les agents, les serveurs MCP dans le volet de parcours
```

---

## Windows: Pas de Git Bash requis

Claude Code fonctionne maintenant nativement sur Windows avec PowerShell — Git pour Windows n'est plus un prérequis.

```powershell
# Installer Claude Code sur Windows (aucun Git Bash requis)
winget install Anthropic.ClaudeCode

# Ou via npm
npm install -g @anthropic-ai/claude-code

# PowerShell est maintenant le shell principal sur Windows
# L'outil Bash revient automatiquement à PowerShell
```

---

## Autres ajouts notables

**Auto-rythme `/loop`:**
```bash
/loop 5m /check-deploy    # run every 5 minutes
/loop /monitor-tests      # self-pace (Claude decides interval)
```

**`/team-onboarding`:**
Empaquette votre configuration Claude Code (hooks, compétences, CLAUDE.md) en guide rejouable pour les nouveaux membres de l'équipe.

**`/autofix-pr`:**
Active les suggestions de correction automatique de PR depuis votre terminal — Claude surveille les résultats CI et propose des corrections.

**Corrections de l'entrée vocale:**
La poussée vocale maintenant fonctionne dans le volet de réponse d'Agent View. Fiabilité améliorée sur macOS.

**Notifications push mobiles:**
Quand une tâche longue se termine ou Claude a besoin de votre saisie, recevez une notification push sur votre téléphone (via Remote Control).
```bash
# Nécessite la configuration de Claude Code Remote Control
# Configurer dans Paramètres du Bureau → Notifications → Mobile
```

---

## Commandes CLI supplémentaires

**`claude agents --json`** (v2.1.145+)
Listage de session lisible par machine — imprime toutes les sessions actives en tant que tableau JSON et quitte:
```bash
claude agents --json | jq '.[] | select(.status == "running")'
```
Champs: `pid`, `cwd`, `kind`, `startedAt`, `sessionId`, `name`, `status`. Combiner avec `--cwd` pour filtrer par répertoire.

**`claude respawn`**
Redémarrer une session avec l'historique de conversation intacte:
```bash
claude respawn <session-id>      # restart one session
claude respawn --all             # restart all running sessions
```

**`claude daemon status`**
Afficher l'état du processus superviseur et le nombre de travailleurs. Utile pour diagnostiquer pourquoi les sessions ne démarrent pas.

**`/scroll-speed`**
Ajuster la vitesse de défilement à la molette de la souris dans la CLI. `/scroll-speed 3` (par défaut), `/scroll-speed 1` (lent), `/scroll-speed 10` (rapide).

**`/code-review` (renommé de `/simplify`)**
À partir de v2.1.146, `/simplify` a été renommé en `/code-review`. L'ancien nom fonctionne toujours comme alias. Accepte maintenant un niveau d'effort optionnel:
```
/code-review
/code-review xhigh
```
Examine les diffs actuels pour les erreurs de compilation, erreurs de logique, vulnérabilités de sécurité — pas de style ou de formatage.

---
