# Équipes d'agents — Coordination multi-sessions

Les équipes d'agents vous permettent d'exécuter plusieurs instances de Claude Code travaillant ensemble comme une équipe coordonnée. Une session agit comme responsable — coordinatrice du travail, affectation des tâches et synthèse des résultats. Les coéquipiers travaillent indépendamment, chacun dans sa propre fenêtre de contexte, et peuvent communiquer directement entre eux.

Contrairement aux sous-agents (qui s'exécutent dans une seule session et rapportent uniquement à l'appelant), les coéquipiers d'équipes d'agents sont des sessions Claude Code totalement indépendantes qui partagent une liste de tâches et se communiquent directement entre eux.

**Cette fonctionnalité est expérimentale** et désactivée par défaut.

---

## Quand utiliser les équipes d'agents

| Cas d'usage | Pourquoi les équipes fonctionnent |
|----------|---------------|
| Recherche et revue | Plusieurs coéquipiers enquêtent sur différents aspects simultanément, puis partagent et défient les conclusions |
| Nouveaux modules/fonctionnalités | Chaque coéquipier possède une pièce distincte sans marcher sur les pieds l'un de l'autre |
| Débogage avec hypothèses concurrentes | Les coéquipiers testent différentes théories en parallèle et convergent plus rapidement |
| Coordination multi-couches | Les changements frontend, backend et tests sont chacun possédés par un coéquipier différent |

Quand NE PAS utiliser les équipes (utiliser une session unique ou des sous-agents à la place) :

- **Tâches séquentielles** où chaque étape dépend de la précédente
- **Éditions du même fichier** — les coéquipiers s'écraseront mutuellement
- **Travail avec de nombreuses dépendances inter-tâches** — les frais généraux de coordination dominent
- **Tâches simples** où les frais généraux de création d'une équipe dépassent les avantages

---

## Équipes d'agents vs Sous-agents

| | Sous-agents | Équipes d'agents |
|---|---|---|
| Contexte | Contexte propre ; résultats retournés à l'appelant | Contexte propre ; totalement indépendant |
| Communication | Rapportent au seul agent principal | Les coéquipiers se communiquent directement |
| Coordination | L'agent principal gère tout le travail | Liste de tâches partagée avec auto-coordination |
| Meilleur pour | Tâches ciblées où seul le résultat compte | Travail complexe nécessitant discussion et collaboration |
| Coût de tokens | Inférieur (résultats résumés en retour) | Supérieur (chaque coéquipier est une instance Claude distincte) |

Règle générale : utilisez les sous-agents quand les travailleurs doivent juste rapporter. Utilisez les équipes quand les travailleurs doivent partager les conclusions, se remettre en question et se coordonner par eux-mêmes.

---

## Activation des équipes d'agents

Ajoutez le drapeau expérimental à vos paramètres :

```json
// ~/.claude/settings.json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

Ou configurez-le dans votre shell :

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

Nécessite Claude Code v2.1.32 ou ultérieur. Vérifiez avec `claude --version`.

---

## Démarrage d'une équipe

Après activation, demandez à Claude de créer une équipe en langage naturel :

```
I'm designing a CLI tool for tracking TODO comments. Create an agent team:
one teammate on UX, one on technical architecture, one playing devil's advocate.
```

Claude crée l'équipe, crée les coéquipiers, coordonne le travail et synthétise les conclusions. Vous n'avez pas besoin d'écrire de fichiers de configuration — décrivez simplement la structure de l'équipe dans votre message.

---

## Modes d'affichage

Deux modes d'affichage contrôlent la façon dont les coéquipiers apparaissent dans votre terminal.

### In-process (par défaut)

Tous les coéquipiers s'exécutent dans votre terminal principal.

| Touche | Action |
|-----|--------|
| `Shift+Down` | Basculer entre les coéquipiers |
| Taper | Envoyer un message à un coéquipier directement |
| `Enter` | Afficher la session d'un coéquipier |
| `Escape` | Interrompre le tour actuel du coéquipier |
| `Ctrl+T` | Basculer la liste de tâches partagée |

Fonctionne dans n'importe quel terminal. Aucune configuration supplémentaire requise.

### Volets divisés

Chaque coéquipier obtient son propre volet de terminal. Vous pouvez voir la sortie de tout le monde à la fois et cliquer dans un volet pour interagir directement.

Nécessite **tmux** ou **iTerm2** :
- tmux : installez via votre gestionnaire de paquets (`brew install tmux`, `apt install tmux`)
- iTerm2 : installez le CLI `it2` et activez l'API Python dans les préférences iTerm2

### Configuration

```json
{
  "teammateMode": "in-process"
}
```

Valeurs valides : `"in-process"`, `"tmux"`, `"auto"` (détecte le multiplexeur de terminal disponible).

Remplacez par session :

```bash
claude --teammate-mode in-process
```

---

## Liste de tâches et affectation

La liste de tâches partagée coordonne le travail entre tous les coéquipiers. Les tâches ont trois états :

| État | Signification |
|-------|---------|
| **pending** | Non encore revendiqué par aucun coéquipier |
| **in progress** | Revendiqué et activement travaillé |
| **completed** | Terminé |

Les tâches peuvent dépendre d'autres tâches. Une tâche en attente avec des dépendances non résolues ne peut pas être revendiquée jusqu'à ce que ces dépendances se terminent.

### Modes d'affectation

- **Le responsable affecte** — dites au responsable quelle tâche donner à quel coéquipier
- **Auto-revendication** — après avoir terminé une tâche, un coéquipier choisit automatiquement la prochaine tâche non affectée et débloquée

La revendication de tâche utilise le verrouillage de fichiers pour prévenir les conditions de course lorsque plusieurs coéquipiers essaient de revendiquer simultanément.

---

## Spécification des coéquipiers et modèles

Claude décide de la taille de l'équipe à partir de la tâche, ou vous pouvez être explicite :

```
Create a team with 4 teammates to refactor these modules in parallel.
Use Sonnet for each teammate.
```

Les coéquipiers n'héritent pas de la sélection `/model` du responsable par défaut. Pour changer cela, définissez **Default teammate model** dans `/config` et choisissez **Default (leader's model)**.

---

## Portes d'approbation de plan

Pour les tâches risquées, exigez que les coéquipiers planifient avant de mettre en œuvre :

```
Spawn an architect teammate to refactor the auth module.
Require plan approval before they make any changes.
```

Quand un coéquipier termine la planification, il envoie une demande d'approbation de plan au responsable. Le responsable examine et soit :

- **Approuve** — le coéquipier commence la mise en œuvre
- **Rejette avec retour d'information** — le coéquipier révise le plan et le resoumis

Vous pouvez influencer le jugement du responsable :

```
Only approve plans that include test coverage.
Reject plans that modify the database schema.
```

---

## Conversation directe avec les coéquipiers

Chaque coéquipier est une session Claude Code complète et indépendante. Vous pouvez envoyer un message à n'importe quel coéquipier à tout moment.

- **Mode in-process :** `Shift+Down` pour passer au coéquipier, puis tapez votre message
- **Mode volets divisés :** cliquez dans le volet du coéquipier et tapez directement

---

## Utilisation des définitions de sous-agents comme coéquipiers

Référencez un type de sous-agent existant lors du lancement d'un coéquipier :

```
Spawn a teammate using the security-reviewer agent type to audit the auth module.
```

Le coéquipier utilise la liste des `tools` et le `model` de cette définition. Le corps de la définition est ajouté à l'invite de système du coéquipier comme instructions supplémentaires.

**Ce qui se transfère :** `tools`, `model`, corps de l'invite de système.

**Ce qui ne se transfère PAS :** `skills` et `mcpServers`. Les coéquipiers chargent les skills et les serveurs MCP à partir des paramètres de projet/utilisateur comme n'importe quelle session régulière.

---

## Architecture et stockage

| Composant | Rôle |
|-----------|------|
| Team lead | Session principale qui crée l'équipe, crée les coéquipiers, coordonne |
| Coéquipiers | Instances Claude Code distinctes qui travaillent sur les tâches affectées |
| Liste de tâches | Éléments de travail partagés que les coéquipiers revendiquent et terminent |
| Mailbox | Système de messagerie pour la communication entre agents |

### Emplacements de stockage

| Chemin | Contenu |
|------|----------|
| `~/.claude/teams/{team-name}/config.json` | Configuration de l'équipe (auto-générée, ne pas modifier manuellement) |
| `~/.claude/tasks/{team-name}/` | Données de liste de tâches partagées |

Il n'y a pas de configuration d'équipe au niveau du projet. Un fichier comme `.claude/teams/teams.json` dans votre répertoire de projet n'est pas reconnu.

---

## Permissions

Tous les coéquipiers commencent avec les paramètres de permissions du responsable. Si le responsable s'exécute avec `--dangerously-skip-permissions`, tous les coéquipiers aussi.

Vous pouvez changer les modes de coéquipiers individuels après le lancement, mais pas au moment du lancement.

---

## Contexte et communication

### Ce que les coéquipiers reçoivent

Les coéquipiers chargent le même contexte de projet qu'une session régulière : `CLAUDE.md`, serveurs MCP, skills. Ils reçoivent également l'invite de lancement du responsable. L'historique de conversation du responsable ne se transfère PAS.

### Comment fonctionne la communication

- Les messages sont livrés automatiquement (pas de polling nécessaire)
- Les notifications d'inactivité sont envoyées au responsable quand un coéquipier s'arrête
- La liste de tâches partagée est visible à tous les agents
- Envoyez un message à n'importe quel coéquipier par nom (noms affectés par le responsable au lancement)

---

## Événements de hooks pour les équipes d'agents

Trois événements de hooks fournissent des portes de qualité pour la coordination d'équipe.

### TeammateIdle

Se déclenche quand un coéquipier est sur le point de devenir inactif. Le code de sortie `2` envoie un retour d'information et garde le coéquipier actif.

### TaskCreated

Se déclenche quand une tâche est en cours de création. Le code de sortie `2` empêche la création avec retour d'information.

### TaskCompleted

Se déclenche quand une tâche est marquée comme complète. Le code de sortie `2` empêche l'achèvement avec retour d'information.

```json
{
  "hooks": {
    "TaskCompleted": [{
      "hooks": [{
        "type": "command",
        "command": "bash ~/.claude/hooks/verify-task-tests.sh"
      }]
    }]
  }
}
```

Utilisez les hooks `TaskCompleted` pour appliquer les normes — par exemple, vérifier qu'un coéquipier a écrit des tests avant de marquer une tâche terminée.

---

## Arrêt et nettoyage

### Arrêt d'un coéquipier

```
Ask the researcher teammate to shut down.
```

Le coéquipier peut approuver (quitter gracieusement) ou rejeter avec une explication de pourquoi il devrait continuer à fonctionner.

### Nettoyage de l'équipe

```
Clean up the team.
```

Utilisez toujours le responsable pour nettoyer. Les coéquipiers ne doivent pas exécuter le nettoyage eux-mêmes. Arrêtez tous les coéquipiers avant d'exécuter le nettoyage.

---

## Meilleures pratiques

1. **Taille de l'équipe : 3-5 coéquipiers.** Plus signifie plus de frais généraux de coordination avec des rendements décroissants.
2. **Tâches par coéquipier : 5-6.** Garde tout le monde productif sans changement de contexte excessif.
3. **Donnez du contexte.** Les coéquipiers n'héritent pas de la conversation du responsable. Incluez les détails spécifiques à la tâche dans les invites de lancement.
4. **Évitez les conflits de fichiers.** Affectez à chaque coéquipier des fichiers différents. Deux coéquipiers éditant le même fichier causent des écrasements.
5. **Commencez par la recherche.** Si nouveau pour les équipes, commencez par des tâches sans codage (revue, recherche, enquête) avant la mise en œuvre parallèle.
6. **Surveillez et orientez.** Vérifiez la progression. Laisser une équipe fonctionner sans surveillance trop longtemps augmente le risque d'effort gaspillé.
7. **Attendez vos coéquipiers.** Dites au responsable « attendre que vos coéquipiers terminent leurs tâches avant de continuer » s'il commence à mettre en œuvre au lieu de déléguer.

---

## Exemples de cas d'usage

### Revue de code parallèle

```
Create an agent team to review PR #142. Spawn three reviewers:
- One focused on security implications
- One checking performance impact
- One validating test coverage
Have them each review and report findings.
```

### Hypothèses concurrentes

```
Users report the app exits after one message. Spawn 5 teammates to
investigate different hypotheses. Have them talk to each other to
disprove each other's theories. Update findings doc with consensus.
```

### Fonctionnalité multi-couches

```
Build the notifications feature. Spawn teammates:
- Backend: API endpoints and database schema
- Frontend: React components and state management
- Tests: integration and unit tests for both layers
Each teammate owns their layer. Coordinate via the shared task list.
```

---

## Limitations

- Pas de reprise de session avec `/resume` ou `/rewind` pour les coéquipiers in-process
- L'état de la tâche peut être en retard — les coéquipiers oublient parfois de marquer les tâches comme complètes
- L'arrêt peut être lent (les coéquipiers terminent d'abord leur demande actuelle)
- Une équipe à la fois par responsable
- Pas d'équipes imbriquées (les coéquipiers ne peuvent pas créer leurs propres équipes)
- Le responsable est fixe pour toute la durée de vie de l'équipe
- Les permissions sont définies au lancement (changer individuellement après, pas au moment du lancement)
- Les volets divisés nécessitent tmux ou iTerm2 (pas terminal VS Code, Windows Terminal ou Ghostty)

---

## Coût de tokens

Les équipes d'agents utilisent considérablement plus de tokens qu'une session unique. Chaque coéquipier a sa propre fenêtre de contexte, et l'utilisation de tokens s'échelonne linéairement avec les coéquipiers actifs.

Pour la recherche, la revue et les nouvelles fonctionnalités, les tokens supplémentaires valent généralement la peine. Pour les tâches de routine, une session unique est plus rentable.

---
