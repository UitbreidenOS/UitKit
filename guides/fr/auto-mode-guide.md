# Claude Code Auto Mode — Référence approfondie (Mars 2026, Stable)

La version stable de mars 2026 d'Auto Mode a remplacé les couches de permissions basées sur des heuristiques antérieures par un classificateur ML entraîné. Le résultat pratique : 84% moins d'invites de permission en moyenne sur les codebases standards, avec une couche de refus stricte qui est imperméable aux contournements de configuration. Ce guide couvre le fonctionnement du classificateur, chaque option `defaultMode`, les modèles de configuration à l'échelle de l'équipe, la distinction entre `bypassPermissions` et `--auto`, et une approche systématique du diagnostic des actions bloquées.

---

## Le classificateur de permissions ML

### Qu'est-ce que c'est

Avant mars 2026, Auto Mode utilisait un ensemble de règles statiques organisé en niveaux — les opérations de lecture approuvées automatiquement, les écritures avec confirmation, les opérations destructives toujours confirmées. Le problème : cet ensemble de règles n'avait aucun contexte. Un `git push` vers une branche personnelle dans un bac à sable déclenchait la même invite qu'un `git push --force origin main` sur un dépôt partagé. Chaque `npm run` invoquait une confirmation quel que soit ce que le script faisait.

Le classificateur de mars 2026 remplace les niveaux statiques par un modèle qui évalue chaque appel d'outil proposé selon trois axes :

1. **Réversibilité** — cette action peut-elle être annulée sans perte de données ?
2. **Rayon d'impact** — combien de systèmes ou de collaborateurs sont affectés si cela tourne mal ?
3. **Signal d'autorisation** — le contexte de la session actuelle (configuration du projet, approbations antérieures, identité de l'utilisateur) indique-t-il que c'était pré-autorisé ?

Le classificateur émet l'une de trois étiquettes : `auto`, `ask`, ou `deny`. L'étiquette `deny` a deux sous-types : `deny-soft` (contournable par une configuration utilisateur explicite) et `deny-hard` (non contournable en aucune circonstance).

### Comment il atteint une réduction de 84% des invites

La réduction provient principalement de trois améliorations par rapport au système de niveaux statiques :

**Sensibilité contextuelle à git.** Le classificateur sait si la télécommande cible est la branche amont canonique ou une branche personnelle/fork, si `--force` est présent, si la branche a des PR ouvertes, et si le dépôt est un dépôt d'équipe partagé ou un bac à sable privé. Un `git push` vers `origin feature/my-branch` dans un projet en solo est classé `auto` ; la même commande ciblant `main` sur un dépôt avec protection de branche est classée `ask`.

**Empreinte numérique des scripts.** Quand Claude propose `npm run <script>`, le classificateur lit la définition du script depuis `package.json` avant d'étiqueter l'appel. Un script `build` qui n'exécute que `tsc` ou `vite build` est `auto`. Un script `deploy` contenant `aws s3 sync` ou `kubectl apply` est `ask`. Un script `purge` contenant `rm -rf dist/ && ...` est `deny-soft`.

**Mémoire de session.** Une fois qu'un modèle d'appel est approuvé au cours d'une session, les appels sémantiquement équivalents sont `auto` pour le reste de cette session. Vous approuvez `git commit` une fois ; les appels `git commit` suivants ne re-demandent pas. Ceci est limité à la session — il ne persiste pas entre les redémarrages sauf si vous l'encodez dans `settings.json`.

### Confiance du classificateur et repli

Quand le score de confiance du classificateur tombe en dessous de 0.72 (le seuil par défaut), il se replie sur `ask` indépendamment de l'étiquette prédite. Vous pouvez observer cela en mode verbeux :

```bash
claude --auto --verbose "Refactor the auth module"
```

Une décision à faible confiance apparaît dans la sortie comme :

```
[classifier] git push origin feature/auth-refactor → ask (confidence: 0.61, fallback from: auto)
```

Le seuil est configurable mais ne devrait pas être modifié — c'est la principale protection contre les erreurs du classificateur causant une automatisation involontaire.

---

## Options `defaultMode`

`defaultMode` est le champ de haut niveau `settings.json` qui gouverne le comportement d'Auto Mode quand aucune règle plus spécifique ne correspond.

### Les trois valeurs

```json
{
  "defaultMode": "auto" | "ask" | "deny"
}
```

**`"ask"` (la valeur par défaut)**

Chaque appel d'outil qui ne correspond pas à une règle `allow` explicite génère une invite. C'est l'expérience interactive standard. Le classificateur ML est toujours actif — il informe l'interface utilisateur (par ex., présélectionnant « Autoriser » pour les appels sûrs à haute confiance) mais ne supprime pas l'invite.

**`"auto"`**

Les appels d'outil classés `auto` par le classificateur ML procèdent sans invite. Les appels classés `ask` génèrent une invite. Les appels classés `deny-soft` sont bloqués mais peuvent être déverrouillés via des règles `allow` explicites. Les appels classés `deny-hard` sont bloqués indépendamment de toute configuration.

C'est le mode destiné aux postes de travail des développeurs exécutant des sessions prolongées.

**`"deny"`**

Seuls les appels d'outil couverts par des règles `allow` explicites dans `settings.json` procèdent. Tout le reste est bloqué. C'est le mode correct pour les agents contraints — pipelines CI, automation adjacente à la production, environnements de contracteurs limités.

### Configuration par scope

`defaultMode` peut être défini à trois niveaux. Les scopes inférieurs remplacent les supérieurs :

| Scope | Fichier | Usage typique |
|---|---|---|
| Global | `~/.claude/settings.json` | Défaut personnel du développeur |
| Projet | `.claude/settings.json` | Base de référence partagée d'équipe |
| Local | `.claude/settings.local.json` | Contournement par développeur, gitignored |

```json
// ~/.claude/settings.json — default personnel : auto pour tous les projets
{
  "defaultMode": "auto"
}
```

```json
// .claude/settings.json — contournement du projet : ask sur ce dépôt partagé
{
  "defaultMode": "ask"
}
```

```json
// .claude/settings.local.json — contournement du développeur : auto même sur dépôt partagé
{
  "defaultMode": "auto"
}
```

Un développeur peut définir sa valeur par défaut globale à `"auto"` tandis que le projet impose `"ask"`, et sa `settings.local.json` revient à `"auto"` pour sa station de travail. C'est le modèle d'équipe recommandé.

---

## Configuration d'Auto Mode pour les équipes

### La stratégie de configuration par couches

Pour une équipe de toute taille, l'approche recommandée est :

1. **Le `.claude/settings.json` du projet** définit la base de référence sûre — généralement `"ask"` avec des règles `allow` explicites pour les opérations que chaque développeur exécute constamment (lecture, recherche, test).
2. **Le `~/.claude/settings.json` du développeur** définit la préférence personnelle — la plupart des développeurs définissent `"auto"` ici.
3. **Le `.claude/settings.local.json` du développeur** gère les contournements spécifiques au projet — utile quand un développeur a besoin de `"auto"` sur un projet qui impose `"ask"`.

Cela donne aux équipes l'auditabilité (la configuration partagée est vérifiée) sans contraindre le flux de travail de chaque développeur.

### Configuration de base d'équipe

Un point de départ raisonnable pour un projet TypeScript/Node.js :

```json
// .claude/settings.json
{
  "defaultMode": "ask",
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(git status)",
      "Bash(git log*)",
      "Bash(git diff*)",
      "Bash(git show*)",
      "Bash(npm run lint)",
      "Bash(npm run test*)",
      "Bash(npm run typecheck)",
      "Bash(npm run build)",
      "Bash(tsc*)",
      "Bash(find . *)",
      "Bash(ls*)"
    ],
    "deny": [
      "Bash(git push --force*)",
      "Bash(git push origin main*)",
      "Bash(git push origin master*)",
      "Bash(npm publish*)",
      "Bash(rm -rf*)",
      "Bash(* | sudo *)",
      "Bash(sudo *)"
    ]
  }
}
```

Cette configuration signifie : avec `defaultMode: "ask"`, Claude demande confirmation pour la plupart des choses, mais les opérations de lecture et de test listées ne jamais interrompent le flux, et les opérations destructives listées sont refusées strictement au niveau du projet indépendamment des paramètres personnels du développeur.

### Configuration CI/CD

En CI, utilisez `"deny"` comme défaut et énumérez exactement ce dont le pipeline a besoin :

```json
// .claude/settings.ci.json (pass via --config flag)
{
  "defaultMode": "deny",
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(npm ci)",
      "Bash(npm run build)",
      "Bash(npm run test)",
      "Bash(npm run lint)",
      "Bash(git status)",
      "Bash(git diff*)",
      "Write(dist/*)",
      "Write(.claude/tasks.jsonl)"
    ]
  }
}
```

```bash
# In CI
claude --config .claude/settings.ci.json --dangerously-skip-permissions \
  "Work through .claude/tasks.jsonl and run the test suite"
```

`--dangerously-skip-permissions` dans ce contexte est sûr : la défaut `"deny"` et la liste allow explicite signifient que les seules opérations que Claude peut effectuer sont celles dans le tableau `allow`. Le drapeau supprime simplement la couche d'invite de l'interface utilisateur — le modèle de permission est toujours imposé par la configuration.

### Intégration des nouveaux membres d'équipe

Incluez ce qui suit dans votre README du projet ou vos documents d'intégration :

```bash
# Enable auto mode globally (recommended for all developers)
# Add to ~/.claude/settings.json:
{
  "defaultMode": "auto"
}

# The project .claude/settings.json enforces safe baselines automatically.
# Your global "auto" setting is scoped down by the project config.
# To further override for this project only, create (gitignored):
touch .claude/settings.local.json
```

Une erreur courante d'intégration : définir `defaultMode: "auto"` dans le `.claude/settings.json` partagé du projet. Cela force chaque développeur en mode auto sur CI et dans les contextes où un humain ne regarde peut-être pas. Gardez la configuration partagée conservative.

---

## Règles de refus strict

### Ce que le refus strict signifie

Les étiquettes `deny-hard` du classificateur ML ne peuvent pas être contournées par aucune règle `allow` dans n'importe quel `settings.json` à n'importe quel scope. Elles ne peuvent pas être contournées avec `--dangerously-skip-permissions`. Elles ne peuvent pas être déverrouillées avec `bypassPermissions`. Elles sont appliquées dans le binaire Claude Code lui-même, pas dans la configuration.

La version stable de mars 2026 a été expédiée avec l'ensemble de refus strict suivant :

| Modèle | Raison |
|---|---|
| `Bash(* --no-verify *)` sur `git commit` ou `git push` | Contourne les hooks pre-commit et pre-push, qui sont des contrôles de sécurité |
| `Bash(rm -rf /)`, `Bash(rm -rf /*)` | Destruction du système de fichiers |
| `Bash(dd if=* of=/dev/*)` | Écritures de disque brutes |
| `Bash(mkfs*)` | Création de système de fichiers (destructive pour les données existantes) |
| `Bash(chmod -R 777 *)` sur les chemins système | Escalade de permissions |
| Toute commande modifiant `/etc/sudoers` ou `/etc/passwd` | Escalade de privilèges |
| `Bash(curl * | bash)`, `Bash(wget * | bash)` | Exécution de code distant via pipe |
| `Bash(python -c "import os; os.system*")` et chaînes eval similaires | Modèles d'échappement sandbox |

### Refus soft vs refus strict en pratique

Quand un appel `deny-soft` est bloqué, la sortie de Claude inclut l'étiquette et le chemin pour le déverrouiller :

```
Action blocked: Bash(rm -rf dist/)
Classification: deny-soft
To allow: add "Bash(rm -rf dist/)" to permissions.allow in .claude/settings.json
```

Quand un appel `deny-hard` est bloqué :

```
Action blocked: Bash(git commit --no-verify)
Classification: deny-hard
This action cannot be enabled via configuration. It is blocked at the binary level.
Reason: bypasses pre-commit hooks (security control)
```

Si vous rencontrez un refus strict qui bloque un cas d'usage légitime (par ex., `--no-verify` pendant un contournement intentionnel d'hook dans un script contrôlé), vous devez exécuter cette commande vous-même dans le terminal plutôt que de la déléguer à Claude. Claude ne l'exécutera pas sous aucune configuration.

### Identification des étiquettes de refus avant exécution

Utilisez `--dry-run` pour voir les étiquettes du classificateur pour chaque appel d'outil proposé avant l'exécution :

```bash
claude --auto --dry-run "Clean up the build artifacts and push to the release branch"
```

La sortie inclut une répartition par appel :

```
[dry-run] Bash(rm -rf dist/)         → deny-soft  (confidence: 0.97)
[dry-run] Bash(git push origin main) → ask        (confidence: 0.89)
[dry-run] Read(package.json)         → auto        (confidence: 0.99)
```

Cela vous permet d'ajuster votre invite de tâche ou `settings.json` avant de dépenser des tokens sur une session qui s'enlisera.

---

## `bypassPermissions` vs `--auto`

C'est la distinction la plus communément mal comprise dans Auto Mode.

### Ce que chacun fait

**`--auto` (ou `defaultMode: "auto"`)**

Dit au classificateur de supprimer les invites pour les appels qu'il étiquette `auto`. Le modèle de permission s'exécute toujours. Les appels étiquetés `ask` demandent toujours confirmation. Les appels étiquetés `deny-soft` sont toujours bloqués (sauf si vous avez une règle `allow` explicite). Les appels étiquetés `deny-hard` sont toujours bloqués.

Auto mode est une optimisation UX. Il élimine les frictions pour les opérations dont le classificateur est confiant. Le filet de sécurité est intact.

**`bypassPermissions: true` / `--dangerously-skip-permissions`**

Désactive entièrement la couche d'invite UI. Claude exécute tous les appels d'outil sans s'arrêter pour demander. Cependant — et c'est la distinction critique — les règles `deny-hard` sont toujours appliquées. La différence est que les blocages `deny-soft` sont aussi contournés.

`bypassPermissions` est un drapeau CI/sandbox. Il suppose que vous avez encodé vos contraintes de sécurité entièrement dans les règles `deny` et l'ensemble de refus strict. Si vous n'avez pas fait cela correctement, Claude peut exécuter des opérations destructives sans aucune confirmation.

### Le modèle mental correct

```
User prompt
    │
    ▼
ML Classifier
    │ auto ──────────────────────────────────────────── execute (no prompt)
    │ ask  ──── [bypassPermissions?] ──── yes ────────── execute (no prompt)
    │            │                                        │
    │            no                                       │
    │            │                                        │
    │            ▼                                        │
    │         prompt user ──── approved ──────────────── execute
    │ deny-soft ── [explicit allow rule?] ── yes ──────── execute (no prompt)
    │               │                                     │
    │               no                                    │
    │               ▼                                     │
    │            blocked (overridable via config)         │
    │ deny-hard ─────────────────────────────────────────── always blocked
```

### Quand utiliser chacun

Utilisez `--auto` (ou `defaultMode: "auto"`) quand :
- Un humain est disponible pour répondre à des invites occasionnelles `ask`
- Vous voulez un flux plus lisse sans sacrifier le filet de sécurité
- Exécution sur une station de travail de développeur

Utilisez `--dangerously-skip-permissions` quand :
- Exécution dans un environnement CI en sandbox avec une liste `deny` pré-configurée
- L'environnement est jetable (conteneur, VM, espace de travail éphémère)
- Vous avez vérifié que les règles `settings.json` `deny` couvrent toutes les opérations destructives
- Aucun humain ne regarde et vous avez besoin d'une exécution complètement non-interactive

N'utilisez jamais `--dangerously-skip-permissions` sur une station de travail de développeur sans une liste `deny` verrouillée. La combinaison de `defaultMode: "auto"` et `--dangerously-skip-permissions` sans règles `deny` explicites est effectivement pas de modèle de permission.

### Exemple pratique : la distinction compte

```bash
# This session will pause at "git push origin main" and wait for approval
claude --auto "Implement the feature from TICKET-442 and push when tests pass"

# This session will NOT pause — it will push to main without confirmation
# Safe only if .claude/settings.json denies "Bash(git push origin main)"
claude --dangerously-skip-permissions "Implement the feature from TICKET-442 and push when tests pass"
```

Pour la plupart des flux de travail de développement, `--auto` est le bon choix. `--dangerously-skip-permissions` est pour les pipelines.

---

## Dépannage des actions bloquées

### Étape 1 : Identifier la classification

Exécutez avec `--verbose` pour voir la sortie du classificateur pour l'appel bloqué :

```bash
claude --auto --verbose "Run the deployment script"
```

Cherchez des lignes comme :

```
[classifier] Bash(./scripts/deploy.sh) → deny-soft (confidence: 0.94)
[classifier] reason: script contains 'kubectl apply' — blast radius: cluster
```

Si la sortie ne comprend pas les lignes du classificateur, vérifiez que `--verbose` est actif et que le blocage se produit à la couche de permission (pas une erreur d'exécution).

### Étape 2 : Vérifier la mauvaise classification d'empreinte numérique de script

Le classificateur lit le contenu des scripts depuis `package.json` et les fichiers de script courants, mais il peut mal classer si :

- Le script est un wrapper qui appelle un autre script de manière dynamique
- Le chemin du script est construit au moment de l'exécution (par ex., `bash ${SCRIPT_DIR}/run.sh`)
- Le fichier script est en dehors de la racine du projet

Pour diagnostiquer : exécutez `claude --auto --dry-run` et inspectez le score de confiance. Une faible confiance (< 0.72) déclenche un repli sur `ask` ou `deny-soft`. Si un script est mal classé, ajoutez une règle `allow` explicite dans `settings.json` :

```json
{
  "permissions": {
    "allow": [
      "Bash(./scripts/deploy-staging.sh)"
    ]
  }
}
```

Remarque : la règle allow doit correspondre à la chaîne de commande exacte que Claude produira. Utilisez `--dry-run` pour voir la chaîne exacte avant d'écrire la règle.

### Étape 3 : Distinguer le refus soft du refus strict

La sortie de Claude indique explicitement si un blocage est soft ou strict. Si soft, la sortie vous dit la règle `allow` exacte à ajouter. Si strict, aucune modification de configuration n'aidera — vous devez exécuter la commande vous-même.

Mésidentification courante : les développeurs supposent que les commits `--force` sont refusés strictement. Ce n'est pas le cas. `git commit --amend` est `deny-soft`. `git commit --no-verify` est `deny-hard`. La distinction est : `--amend` réécrit l'historique (réversible avec reflog), tandis que `--no-verify` contourne les hooks de sécurité (le contournement lui-même est le problème, pas le commit).

### Étape 4 : Vérifier la précédence du scope des paramètres

Un problème courant : un développeur ajoute une règle `allow` à `settings.local.json`, mais le `settings.json` du projet a une règle `deny` pour le même modèle. Les règles `deny` dans les fichiers de scope inférieur ne remplacent pas les règles `deny` dans les fichiers de scope supérieur — mais les règles `allow` à n'importe quel scope peuvent remplacer les règles `deny-soft` des scopes supérieurs à moins que la configuration du projet n'utilise `forcePermissions`.

Vérifier la configuration effective :

```bash
claude --print-config
```

La sortie montre l'ensemble de permissions fusionné avec des annotations de source :

```
permissions.allow:
  "Read"                          [global]
  "Bash(npm run test)"            [project]
  "Bash(./scripts/deploy.sh)"     [local]

permissions.deny:
  "Bash(git push --force*)"       [project] [forced]
  "Bash(rm -rf*)"                 [project] [forced]
```

Les règles marquées `[forced]` ne peuvent pas être remplacées par les règles `allow` de scope inférieur. L'admin du projet les définit avec la clé `forcePermissions` :

```json
// .claude/settings.json
{
  "forcePermissions": {
    "deny": [
      "Bash(git push --force*)",
      "Bash(npm publish*)"
    ]
  }
}
```

### Étape 5 : Ajustement du seuil du classificateur

Si le classificateur applique systématiquement les invites `ask` aux opérations que vous considérez comme sûres — et les scores de confiance oscillent autour de 0.65–0.75 — vous pouvez baisser le seuil de confiance à vos propres risques :

```json
// ~/.claude/settings.json
{
  "classifier": {
    "confidenceThreshold": 0.65
  }
}
```

C'est un paramètre personnel, pas un paramètre d'équipe. Ne le mettez pas dans la configuration du projet. Les seuils inférieur signifient plus d'automatisation mais aussi plus de potentiel pour les appels mal classés à s'exécuter silencieusement.

### Étape 6 : Déboguer avec les transcriptions de session

Chaque session Claude Code écrit une transcription dans `~/.claude/sessions/`. Pour une session en mode auto bloquée ou enlisée, examinez la dernière transcription :

```bash
ls -t ~/.claude/sessions/ | head -1 | xargs -I{} cat ~/.claude/sessions/{}
```

Cherchez les entrées `[blocked]` avec la sortie du classificateur attachée. Cela vous donne la chaîne d'appel exacte, l'étiquette et le score de confiance — les trois entrées dont vous avez besoin pour écrire une règle `allow` ciblée ou diagnostiquer une mauvaise classification.

### Modèles courants et corrections

| Symptôme | Cause probable | Correction |
|---|---|---|
| `npm run deploy` demande toujours confirmation | Script empreinte numérisée comme déploiement | Ajouter une règle `allow` explicite pour le script exact |
| `git push` vers un fork personnel demande confirmation | Le classificateur ne peut pas vérifier le statut du fork | Ajouter `allow` pour ce modèle de télécommande spécifique |
| Tout demande confirmation malgré `defaultMode: "auto"` | Le `settings.json` du projet a `defaultMode: "ask"` et `forcePermissions` | Vérifier `--print-config` pour les règles forcées |
| Refus strict sur une commande que vous contrôlez | La commande correspond à un modèle de refus strict | Restructurer la commande pour éviter le modèle |
| La session s'enlise silencieusement | Invite `ask` émise mais terminal ne regarde pas | Utiliser `--max-turns` pour forcer la sortie ; examiner la transcription |
| Faible confiance sur tous les appels | Le projet utilise des outils inhabituels que le classificateur n'a pas vus | Ajouter des règles `allow` explicites pour votre chaîne d'outils |

---

## Référence : champs de paramètres clés

```json
{
  "defaultMode": "auto",                    // auto | ask | deny
  "permissions": {
    "allow": ["..."],                       // patterns that always proceed
    "deny": ["..."]                         // patterns that are blocked (soft)
  },
  "forcePermissions": {
    "deny": ["..."]                         // deny rules that lower scopes cannot override
  },
  "classifier": {
    "confidenceThreshold": 0.72,            // below this → fallback to ask
    "verbose": false                        // log classifier decisions to console
  },
  "maxTurns": 200,                          // hard cap on turns per session
  "bypassPermissions": false               // set true only in sandboxed CI
}
```

---

## Liste de contrôle de démarrage rapide

- [ ] Définir `defaultMode: "auto"` dans `~/.claude/settings.json` pour le dev local
- [ ] Ajouter des règles `deny` explicites pour les opérations destructives dans le `.claude/settings.json` du projet
- [ ] Utiliser `forcePermissions.deny` pour les règles qui doivent tenir même quand les développeurs contournent
- [ ] Tester votre configuration avec `--dry-run` avant d'exécuter une longue session autonome
- [ ] Utiliser `--dangerously-skip-permissions` uniquement en CI avec une liste `deny` verrouillée
- [ ] Surveiller la sortie `--print-config` lors de l'intégration de nouveaux développeurs pour attraper les conflits de scope
- [ ] Vérifier les transcriptions `~/.claude/sessions/` après toute session enlisée

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
