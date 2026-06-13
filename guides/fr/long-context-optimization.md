# Optimisation de contexte long

Stratégies pour travailler efficacement avec les fenêtres de contexte 200K–1M de Claude — comment éviter la détérioration du contexte, maintenir la qualité à l'échelle, et savoir quand compacter versus quand continuer.

Ce guide est le compagnon à [context-budget.md](context-budget.md), qui couvre le comptage de tokens général et la mécanique de compaction. Ce guide se concentre spécifiquement sur l'échelle 200K+ : ce que cette taille de fenêtre signifie en pratique, pourquoi la qualité se dégrade bien avant que vous n'atteigniez la limite, et comment structurer vos sessions et outillage pour rester dans la zone de qualité à travers les longs workloads.

---

## Tailles de fenêtre de contexte en pratique

| Modèle | Fenêtre de contexte | Nombre de mots approximatif | Nombre de pages approximatif |
|---|---|---|---|
| Claude Haiku 4.5 | 200K tokens | ~150,000 mots | ~500 pages |
| Claude Sonnet 4.6 | 200K tokens (standard) | ~150,000 mots | ~500 pages |
| Claude Sonnet 4.6 | 1M tokens (étendu) | ~750,000 mots | ~2,500 pages |
| Claude Opus 4.7 | 200K tokens | ~150,000 mots | ~500 pages |

**200K tokens en termes concrets :**

- Une fenêtre de contexte 200K s'adapter à approximativement les œuvres complètes de Shakespeare — deux fois au-dessus
- Un gros monorepo avec 300 fichiers TypeScript à 200 lignes chacun est ~60K tokens
- Un single large fichier log avec 10,000 lignes est approximativement 80–100K tokens
- Une session Claude Code complet avec 50 tours de moderately verbose tool use fait en moyenne 40–80K tokens

Les nombres suggèrent que vous avez une salle amplement. La réalité est différente. La limite 200K n'est pas votre plafond opérationnel — c'est la falaise. Votre plafond effectif est approximativement 60–70% de ce chiffre, et pour les tâches complexes plus proche de 40–50%.

---

## La fenêtre de contexte 1M (Sonnet 4.6 étendu)

Sonnet 4.6 peut être accédé avec une fenêtre de contexte 1M étendue. Ce n'est pas le défaut.

**Quand l'utiliser :**
- Tâches d'analyse au niveau repository où vous devez maintenir plusieurs grands fichiers simultanément
- Boucles autonomes longues où la compaction jetterait l'état intermédiaire critique
- Refactors cross-fichier où 30+ fichiers doivent être en contexte à une fois pour la correction
- Tâches d'analyse de document (légal, recherche, archéologie de codebase) où le corpus requiert vraiment la fenêtre

**Quand ne pas l'utiliser :**
- Travail de développement général — le modèle standard 200K gère la plupart des sessions sans problème
- Workflows sensibles au coût — la fenêtre 1M porte le tarification premium par token
- Tâches où la capacité extra remplirait avec du bruit plutôt que du signal

**Implications de coût et latence :**

La fenêtre 1M affecte le tarification et le temps de réponse. À contexte complet, la latence jusqu'au premier token augmente notablement. Les écritures de cache — encourues au premier tour d'une session — s'adapter linéairement avec la taille de contexte. Une session 200K-token encourt 200K cache write tokens au tour un. Une session 1M encourt 1M. Si vous exécutez 50 sessions quotidien et utilisez la fenêtre 1M inutilement, cette surcharge se compose rapidement dans les coûts de cache write.

Règle générale : utilisez le modèle standard 200K à moins que vous ayez une raison spécifique et concrète que la tâche requiert plus. La plupart des tâches qui paraissent requérir 1M peuvent être restructurées pour s'adapter dans 200K avec l'hygiène correcte du contexte.

---

## Détérioration du contexte : pourquoi la qualité se dégrade avant la limite

La détérioration du contexte décrit la dégradation de qualité qui se produit comme une fenêtre de contexte se remplit — bien avant le limit dur n'est atteint. Le mécanisme est la dilution de l'attention.

Claude traite le contexte via l'attention — un mécanisme qui pèse la pertinence de chaque token au courant de génération. Comme la fenêtre grandit, le ratio signal-à-bruit du contexte diminue. Les contraintes importantes définies tôt dans la session entrent en concurrence avec des centaines de milliers de tokens de sorties d'outil, raisonnement intermédiaire, et contenus de fichier. L'attention du modèle se distribue à travers tout cela.

**La courbe de dégradation observée empiriquement :**

| Niveau de remplissage du contexte | Signature de qualité |
|---|---|
| 0–40% | Qualité complète; contraintes et instructions de manière fiable suivies |
| 40–60% | Drift mineur; les instructions tôt occasionnellement manquées; répétition légère |
| 60–70% | Dégradation notable; les faits clés enfouis et récupérés inconsistamment |
| 70–85% | Détérioration significative; les décisions contredisent les contraintes de session antérieures |
| 85%+ | Non-fiable; effectivement opérant sur le contexte récent seulement |

Ceux-ci sont les observations empiriques, pas les seuils durs. La courbe réelle de dégradation varie par type de tâche, structure de contexte, et comment front-loaded versus uniformément distribué le signal est.

---

## Signes d'alerte de détérioration du contexte

Regardez pour ces motifs. N'importe lequel isolément peut être du bruit; deux ou plus se produisant ensemble indique que la détérioration s'est installée.

**Répétition :** Claude explique quelque chose qu'il a déjà expliqué deux pages en arrière, verbatim ou near-verbatim. C'est le signal précoce le plus courant — le modèle génère depuis le contexte récent sans rappeler la dérivation antérieure.

**Oubli de contrainte :** Vous avez établi tôt dans la session que le projet utilise ESLint avec des paramètres stricts, ou qu'une API spécifique est dépréciée, ou que les tests ne doivent pas utiliser `describe.only`. Claude commence à violer ces contraintes. L'instruction est toujours en contexte mais n'est plus de manière fiable suivie.

**Décisions inconsistantes :** Vous avez établi une approche architecturale — disons, tout l'accès de base de données à travers une couche repository. Claude commence à écrire les appels de base de données directs dans un service. Demandé d'expliquer, il produit le raisonnement qui contredit les décisions antérieures sans reconnaître la contradiction.

**Re-demander pour l'information :** Claude vous demande pour l'information qu'il a récupéré ou vous avez fourni antérieurement dans la session. Le fait est en contexte; le modèle ne le récupère pas.

**Réponses vagues sur les sujets spécifiques :** Tôt dans la session, Claude a produit les réponses précises, spécifiques. Plus tard dans la même session, sur les questions similaires, les réponses deviennent hedged, générique, ou référencent la mauvaise partie du codebase. Cela reflète l'attention aplatie à travers un grand contexte plutôt que la récupération focalisée.

**Le fix n'est pas toujours corriger :** Corriger in-session après que la détérioration s'installe ajoute plus de tokens et aggrave le problème. La bonne réponse est de compacter ou de commencer une nouvelle session.

---

## 7 stratégies d'optimisation

### 1. Front-loading : primauté et récence

L'attention n'est pas uniforme à travers la fenêtre de contexte. Claude suit de manière fiable le début et la fin du contexte plus fortement que le milieu — c'est l'effet de primauté et récence. Structurez votre contexte pour exploiter ceci.

**Front-load les contraintes critiques :**

```
# Bon ouverture de session — contraintes énoncées avant n'importe quel tool use
Vous travaillez sur le service de paiements dans ce monorepo. 
Contraintes clés pour cette session :
- Tous les appels de base de données passent par src/db/repositories/ — jamais directement à Prisma
- La classe PaymentService doit rester stateless — pas de variables d'instance qui maintiennent l'état
- Le handling d'erreur doit utiliser la classe AppError depuis src/errors/
- Ne modifiez jamais le répertoire migrations — les changements de schéma sont hors de portée

Maintenant commençons en examinant l'implémentation PaymentService courante.
```

Si vous ouvrez une session avec le tool use immédiatement — lectures de fichier, commandes bash — ces contraintes se poussent bas. Par le temps que le contexte se remplisse, elles sont enfouies dans le milieu de la fenêtre.

**Répétez les contraintes critiques à la fin des longs inputs :**

Pour les très longs messages d'utilisateur ou les prompts structurés, retenez la contrainte unique la plus importante à la fin :

```
[... 500 tokens de contexte ...]

Rappelez-vous : tout l'accès de base de données doit passer par la couche repository.
```

Le signal de récence assure que la contrainte est dans l'attention immédiate de Claude quand il commence à générer.

**Ne pas front-load du bruit :** Appliquez la même logique inversement. Les informations de fond verbeux qui ne sont pas decision-relevant ne devrait pas occuper la fente de primauté. Menez avec les contraintes et objectifs, pas l'historique du projet.

---

### 2. Résumés structurés : timing de compaction

La commande `/compact` est couverte dans le détail dans [context-budget.md](context-budget.md). La question de timing est spécifique aux sessions à contexte long.

**Compactez à 40–50% de remplissage, pas 80%.**

À 50% de remplissage, le résumeur de compaction a le signal haute-qualité pour travailler avec. La conversation est assez longue pour avoir produit les décisions et résultats significatifs, mais suffisamment court que le résumeur peut toujours distinguer le signal du bruit. Le résumé résultant est exact et complet.

À 80% de remplissage, le résumeur travaille avec un contexte qui est déjà partiellement dégradé. Le résumé qu'il produit reflète l'état dégradé — les décisions antérieures importantes peuvent être sous-représentées ou manquantes.

**Utilisez la compaction dirigée :**

```
/compact focus on the auth refactor — retain the decision to use RS256 and the JWT shape, drop the debugging context for the expired token issue
```

Sans une directive, le résumeur fait les choix autonomes sur ce qui importe. Une directive spécifique l'ancre à votre fil de travail courant.

**Compactez entre les phases majeures, pas mid-tâche :**

Compactez après la fin d'un sous-tâche borné, avant de commencer le suivant. Compacter mid-tâche risque de perdre l'état intermédiaire dont vous avez besoin pour continuer. Le motif :

```
Phase 1 : exploration et analyse → complète → /compact "retain findings on payment module architecture"
Phase 2 : implémentation → ... → complète → /compact "retain all changes made, file paths, design decisions"
Phase 3 : testing → ...
```

---

### 3. Lectures ciblées : offset et limit

Chaque lecture de fichier entre le contexte en complet à moins que vous ne le constrainez. Pour les sessions à contexte long, ceci est la source primaire d'avérer bloat.

**Utilisez `offset` et `limit` sur l'outil Read :**

```
# Fichier 2,000-ligne : ~20K tokens — lit le fichier entier
Read /path/to/service.ts

# Lecture ciblée des lignes 400–450 : ~500 tokens
Read /path/to/service.ts, offset: 400, limit: 50
```

**Grep avant que vous lisiez.** Utilisez Grep pour localiser la section pertinente, puis lisez seulement cette section :

```bash
# Étape 1 : trouvez la fonction pertinente
grep -n "processPayment" /path/to/payments.service.ts

# Sortie : ligne 847
# Étape 2 : lisez seulement cette section
Read /path/to/payments.service.ts, offset: 840, limit: 60
```

Ce motif — grep premier, lecture ciblée deuxième — réduit systématiquement la consommation de contexte par 80–95% pour les tâches de navigation.

**Résumez avant de lire les gros fichiers :**

Pour les très gros fichiers où vous avez besoin d'une compréhension haute-niveau avant de décider quoi lire :

```bash
wc -l /path/to/large-file.ts && grep -n "^export\|^class\|^function\|^const.*=.*function" /path/to/large-file.ts | head -40
```

Ceci vous donne les exports et la structure du fichier dans ~40 lignes (~400 tokens) plutôt que de lire 2,000+ lignes pour le comprendre.

---

### 4. Trimming de sortie Bash

La sortie non-contrôlée de Bash est la cause la plus courante de remplissage soudain du contexte dans les longues sessions. Un single `npm install`, `docker build`, ou `pytest -v` peut ajouter 5–20K tokens dans un appel d'outil.

**Appliquez ces motifs systématiquement :**

```bash
# Limite le volume de log
docker logs my-container --tail 50
npm test 2>&1 | tail -30
./run-suite.sh | grep -E "PASS|FAIL|ERROR|WARN" | head -50

# Supprimez le bruit à la source
curl -s https://api.example.com/v1/status         # -s supprime le progrès
rsync -a --quiet src/ dst/
npm install --silent

# Redirigez stderr quand non-pertinent
make build 2>/dev/null
python setup.py install 2>/dev/null

# Extrayez le signal avant qu'il n'entre en contexte
git log --oneline -20
git diff --stat HEAD~5 HEAD
find . -name "*.ts" -newer src/auth.ts | head -20
```

**Pipe-et-filtre comme une discipline par défaut :**

```bash
# Instead of: node scripts/analyze.js
# Use: node scripts/analyze.js | grep -v "^DEBUG:" | head -100
```

Le nombre de lignes exact importe moins que l'habitude. N'importe quel commande Bash avec la sortie potentiellement unbounded devrait avoir un pipe de truncation avant qu'il n'entre en contexte.

---

### 5. Isolation de subagent pour les gros tasks de lecture

Quand une tâche requiert de lire de nombreux fichiers — un sondage de codebase, une analyse de dépendance, un scan de sécurité à travers 50 modules — le faire dans le contexte principal remplit la fenêtre avec les données intermédiaires qui sont seulement utiles pour produire une conclusion.

**Le motif de subagent :**

```
# Ce qu'il NE FAUT PAS faire (le contexte principal lit 40 fichiers) :
"Lisez tous les fichiers dans src/auth/ et dites-moi ce qu'ils font"
[Claude lit 40 fichiers dans le contexte principal — ~80K tokens]
"Maintenant résumez l'architecture"

# Ce qu'il faut faire (subagent lit, retourne le résumé) :
Générez un subagent avec :
  Tâche : Sondez tous les fichiers dans src/auth/. 
  Retour : Un résumé structuré couvrant (1) ce que chaque fichier exporte,
  (2) le graphe de dépendance entre eux, (3) n'importe quels fichiers qui contiennent
  la logique sensible à la sécurité comme la validation de token ou les contrôles de permission.
  Ne retournez pas les contenus de fichier — retournez seulement une analyse structurée.

[Le subagent lit 40 fichiers dans son propre contexte — le contexte principal reçoit ~1K tokens de trouvailles structurées]
```

Le contexte principal reçoit les conclusions, pas les données brutes intermédiaires. Le contexte du subagent est jeté après la tâche.

**Quand utiliser l'isolation de subagent :**
- La tâche implique de lire plus que 10 fichiers à des fins de découverte
- Les sorties brutes de lecture (contenus de fichier) ne seront pas nécessaires à nouveau après la conclusion
- La tâche est bornée et a un format de livrable clair

**Quand ne pas l'utiliser :**
- Vous aurez besoin d'éditer directement les fichiers en cours de sondage — le contexte parent a besoin de les voir
- La tâche est simple suffisamment que la surcharge de génération n'en vaut pas la peine

---

### 6. Scoping CLAUDE.md

`CLAUDE.md` charge à chaque démarrage de session et occupe la primauté — c'est le contenu premier en contexte. Chaque token en lui est un coût fixe payé sur chaque session que vous exécutez.

**Règles pour les sessions à contexte long :**

Gardez le `CLAUDE.md` du projet sous 2,000 tokens. Ceci n'est pas une préférence esthétique — c'est une décision de budget. Un `CLAUDE.md` 3,000-token coûte les 1,000 tokens de contexte extra de position-primauté sur chaque session unique que vous exécutez. À travers 50 sessions par jour, c'est 50,000 tokens extra quotidien, se composant dans les coûts de cache write.

**Ce qui appartient dans CLAUDE.md (reste forever) :**
- Description du projet : 3–5 phrases
- Directories clés et leur objectif
- Les conventions non-évidentes que Claude doit suivre
- Build, test, lint commandes
- Les choses ne pas modifier sans instruction explicite

**Ce qui ne le fait pas (charger sur demande) :**
- Documentation de référence d'API — charger via une Read ciblée quand travailler dans cette région
- Les décisions historiques — maintenir un separate `decisions.md`, charger seulement quand travailler dans le domaine pertinent
- Les longs exemples — référence par chemin de fichier, lisez sur demande
- Les règles pour les sous-systèmes que vous ne travaillez pas dedans actuellement

**Fichiers CLAUDE.md scoped de domaine :**

Pour les gros monorepos, utilisez les fichiers CLAUDE.md au niveau de directory :

```
/repo/
  CLAUDE.md                    # conventions globales — sous 1,000 tokens
  src/
    payments/
      CLAUDE.md                # règles spécifiques aux paiements — chargé seulement quand Claude est dans ce directory
    auth/
      CLAUDE.md                # règles spécifiques à l'auth
```

Claude lit le `CLAUDE.md` au niveau de directory quand il navigue dans ce directory. Cela signifie que le contexte charge progressivement au fur et à mesure que le travail se déplace à travers les domaines, plutôt que de charger toutes les règles de sous-système au démarrage de session.

---

### 7. llms.txt : documentation externe sans pasting

Quand une tâche requiert la documentation externe — une API de library, une référence de configuration de framework, un guide d'intégration de service — l'instinct par défaut est de coller les sections pertinentes dans la conversation. Pour les sessions à contexte long, c'est coûteux et souvent inutile.

**Vérifiez d'abord pour llms.txt :**

```bash
curl -s https://docs.anthropic.com/llms.txt | head -50
curl -s https://docs.example.com/llms.txt | head -50
```

`llms.txt` est un format compressé de documentation conçu pour la consommation LLM. Les libraries et frameworks qui le publient fournissent les représentations 5–10x plus petites de leur documentation comparée au contenu équivalent de sites de docs. S'il existe, utilisez-le comme la référence primaire.

**Récupérez seulement la page spécifique que vous avez besoin :**

```bash
# Au lieu de : coller la documentation de hooks React entière
# Utilisez : récupérez la page du hook spécifique
curl -s "https://react.dev/reference/react/useCallback" | \
  python3 -c "import sys; from html.parser import HTMLParser; \
  class P(HTMLParser):
    def handle_data(self, d): print(d, end='')
  p = P(); p.feed(sys.stdin.read())" | \
  grep -v "^$" | head -100
```

Ou récupérez via l'outil WebFetch avec une URL ciblée plutôt que de scraper les pages multiples liées.

**Référence, ne pas coller :**

Pour les APIs bien-connues que Claude connaît déjà (les fonctions de standard library, les APIs de framework majeur), référencez le concept et laissez Claude raisonner depuis l'entraînement plutôt que de coller la documentation. Collez seulement la documentation quand vous avez une configuration spécifique, inhabituelle ou un problème connu de knowledge cutoff.

---

## Le hook PreCompact

Quand `/compact` se déclenche — soit manuellement soit automatiquement — Claude génère un résumé de la conversation depuis son contexte courant. Le hook `PreCompact` se déclenche avant que ce résumé ne soit généré, vous donnant une fenêtre pour injecter l'état structuré que le résumeur incorporera.

C'est le motif correct pour les sessions à contexte long où perdre l'état opérationnel après compaction forcerait le travail de re-establishment.

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

**.claude/hooks/pre-compact.sh :**

```bash
#!/usr/bin/env bash
# Se déclenche avant /compact. Injecte l'état de session structuré dans le contexte de compaction.

set -euo pipefail

branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
recent_commits=$(git log -5 --oneline 2>/dev/null || echo "unavailable")
staged=$(git diff --cached --name-only 2>/dev/null | head -20 || echo "none")
unstaged=$(git diff --name-only 2>/dev/null | head -20 || echo "none")
open_files=$(git status --short 2>/dev/null | head -20 || echo "none")

# Lisez la liste de tâche ouverte si vous maintenez une
tasks_file="${CLAUDE_PROJECT_DIR}/.claude/tasks.md"
tasks=""
if [ -f "$tasks_file" ]; then
  tasks=$(tail -30 "$tasks_file")
fi

cat <<EOF
=== PRE-COMPACT STATE INJECTION ===
Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
Branch: ${branch}

Recent commits:
${recent_commits}

Staged files:
${staged}

Unstaged files:
${unstaged}

Working tree status:
${open_files}
EOF

if [ -n "$tasks" ]; then
cat <<EOF

Open tasks (from .claude/tasks.md):
${tasks}
EOF
fi

echo "=== END STATE INJECTION ==="
```

Le contenu injecté est présent en contexte quand le résumé de compaction est généré. Le résumé que Claude écrit incorporera la branche, l'historique de commit, et l'état de fichier — alors post-compaction, cette information est disponible sans vous forcer à la re-establish.

**Étendre ce motif :**

Ajoutez n'importe quel état structuré qui est coûteux à re-dériver après compaction :
- Les décisions architecturales faites pendant la session (lire à partir d'un journal de décisions)
- La sortie d'une phase d'analyse majeure (écrire à un fichier mid-session, l'injecter à temps de compact)
- La queue de tâche courante si vous maintenez une

---

## Tracking usage du contexte avec `/usage`

La commande `/usage` montre une décomposition de tokens par-catégorie pour la session courante.

**Exécutez-la au démarrage de session :**

```
/usage
```

La baseline de démarrage de session montre votre surcharge fixe avant n'importe quel travail : prompt système, CLAUDE.md, définitions d'outil MCP. Si ce nombre dépasse 30–40K tokens, vous avez un problème de configuration — trop de serveurs MCP, un CLAUDE.md qui a grandi, ou les deux. Corrigez-le avant que la session grandit.

**Catégories montées :**

| Catégorie | Ce qu'elle reflète | Action si élevée |
|---|---|---|
| System prompt | Claude Code built-ins + CLAUDE.md | Rognez CLAUDE.md; désactivez les serveurs MCP inutilisés |
| MCP tool definitions | Une entrée par outil à travers tous les serveurs activés | Désactivez les serveurs que vous ne vous utilisez pas cette session |
| Conversation history | Tours accumulés — à la fois utilisateur et assistant | Compactez si approche 40% |
| Tool results | Lectures de fichier, sorties bash, réponses MCP | Examiné les appels d'outil récent pour les sorties verbeux |
| Agent sub-calls | La contribution du contexte de chaque subagent généré | Assurez que les subagents retournent les résumés, pas l'historique d'outil brut |

**Utilisez-la pour benchmarquer les phases :**

Exécutez `/usage` au début de chaque phase majeure — après l'exploration, après la planification, après la mise en œuvre commence. Cela vous donne une map de consommation : combien de tokens chaque phase coûte. Sur un projet deuxième ou troisième similaire, vous pouvez prédire où vous allez frapper le seuil de 40% et planifier la compaction de manière proactive.

---

## Motifs de boucle autonome

Les sessions longues autonomes accumulent le contexte différemment des sessions interactives. Chaque itération de boucle ajoute à la même fenêtre à moins que la session ne soit structurée pour l'empêcher.

**Écrivez l'état sur le disque entre les itérations :**

```bash
# À la fin de chaque itération de boucle, écrivez l'état structuré
cat > "${CLAUDE_PROJECT_DIR}/.claude/loop-state.json" <<'EOF_TEMPLATE'
{
  "iteration": ${ITERATION},
  "completed": ${COMPLETED_JSON},
  "current_task": "${CURRENT_TASK}",
  "blockers": ${BLOCKERS_JSON},
  "next": "${NEXT_TASK}",
  "decisions": ${DECISIONS_JSON}
}
EOF_TEMPLATE
```

**Lisez l'état au début de chaque itération :**

```bash
# Début de la prochaine itération — lisez le fichier d'état au lieu de porter le contexte
state=$(cat "${CLAUDE_PROJECT_DIR}/.claude/loop-state.json")
echo "Resuming from state: $state"
```

La session porte seulement les contenus du fichier d'état comme son contexte de démarrage pour la nouvelle itération. Tout l'historique d'outil intermédiaire des itérations antérieures est absent.

**Utilisez ScheduleWakeup pour les resets durs du contexte :**

Quand une itération de boucle prend du temps mural significatif, utilisez `ScheduleWakeup` pour terminer la fenêtre de contexte courant et reprendre dans une fraîche à la prochaine tick. Le tradeoff est une cache miss (délais de quelques minutes ou plus pour l'initialisation du contexte), qui est acceptable quand chaque itération prend plus que quelques minutes et la surcharge du contexte accumulé ne vaut pas la peine de porter.

**Hooks SessionStart + Stop pour l'état persistant :**

Pour le travail autonome multi-session, pairez un hook `Stop` (écrit le résumé de session sur le disque) avec un hook `SessionStart` (injecte le résumé de la session antérieure). Voir [context-budget.md](context-budget.md) pour l'implémentation complète. Cela donne à chaque nouvelle fenêtre de contexte l'orientation structurée sans requiring les lectures exploratoires.

---

## Quand compacter versus commencer une nouvelle session

Le choix entre `/compact` et une nouvelle session fraîche dépend de ce que vous avez besoin de porter en avant.

**Compactez quand :**
- Vous avez besoin de continuer la tâche courante — la compaction préserve le fil de travail
- Les éditions de fichier ont été faites et vous avez besoin que Claude reste conscient d'eux
- Vous êtes mid-implémentation et l'abandon de la session forcerait la re-establishment du contexte sur les changements déjà écrits
- La session est à 40–60% de remplissage et la tâche a du travail significatif restant

**Commencez une nouvelle session quand :**
- La tâche courante est complète — il n'y a rien à porter en avant
- La session s'est dégradée significativement et la qualité de compaction serait pauvre
- Vous commencez une tâche complètement sans rapport dans le même codebase
- La session est dépasse 70% de remplissage et vous ne l'avez pas compacté — l'accumulated rot rend le résumé de compaction non-fiable

**Le coût d'attendre :**

Compacter à 80% coûte plus que compacter à 50% de deux manières. Premièrement, la session 80% s'est déjà dégradée — Claude a opéré à la qualité inférieure pour 30% de la fenêtre de contexte qu'il n'avait pas besoin. Deuxièmement, le résumé de compaction généré à partir du contexte dégradé 80% est moins précis que celui généré à partir du contexte clair 50%. Vous payez la pénalité de dégradation et obtenez un pire résumé.

**Compaction dirigée pour préserver le fil critique :**

```
/compact focus on the payment integration refactor — specifically retain:
- The decision to use idempotency keys on all write operations
- The change to PaymentService.processCharge() on line 847
- The open issue with the webhook retry logic not yet resolved
```

Sans cette direction, le résumeur peut ne pas savoir lequel des fils nombreux de session est celui que vous continuez.

---

## Implications de coût des sessions à contexte grand

La taille du contexte affecte directement le coût de plusieurs manières qui ne sont pas toujours immédiatement évidentes.

**Cache write tokens au premier tour :**

Quand une session démarre, le contexte entier est écrit au prompt cache. Une session 200K-token encourt 200K cache write tokens au tour un. Ceux-ci sont chargés au taux de cache write, qui est inférieur au taux de token d'input mais pas zéro. Exécuter les sessions quotidien à remplissage du contexte élevé se compose ce coût.

**Tokens d'input sur cache miss :**

Si une session ne frape pas la cache — première session, démarrage froid, session plus ancien que le TTL de cache — tous les tokens de contexte sont chargés comme tokens d'input au taux complet d'input. Pour un contexte 200K, c'est une différence de coût significative versus une cache hit.

**La prime de fenêtre 1M :**

La fenêtre de contexte étendu 1M sur Sonnet 4.6 porte un premium dans le prix et la latence. Exécuter une session 1M-contexte complet avec 200K de contenu réellement utile et 800K de bruit gaspille les deux. Utilisez la fenêtre étendu seulement quand la tâche requiert vraiment la capacité.

**Gestion pratique de coût pour les sessions à contexte long :**

- Gardez les sessions focalisées sur les tâches uniques — le contexte oisif ne sauve pas l'argent
- Compactez avant de commencer les tâches coûteuses multi-fichier pour garder le baseline bas
- Désactivez les serveurs MCP non-nécessaires pour la session courante (les définitions d'outil MCP chargent au démarrage de session et ne peuvent pas être supprimées mid-session)
- Utilisez la fenêtre standard 200K pour tous les tâches qui ne démontrent pas nécessitez plus

---

## Checklist pré-session pour le travail à contexte long

Avant de commencer une session que vous attendez de s'exécuter pendant plus que 50–100 tours ou impliquent les lectures de fichier significatif, vérifiez ces 12 éléments.

- [ ] **Sélection du modèle confirmée** — utilisant le contexte 1M seulement si la tâche requiert vraiment
- [ ] **Seulement les serveurs MCP nécessaires activés** — désactivez les serveurs non-utilisés cette session
- [ ] **CLAUDE.md est sous 2,000 tokens** — auditez-le s'il a grandi organiquement
- [ ] **Les contraintes critiques écrites** — seront front-loaded dans le message d'ouverture
- [ ] **Stratégie de lecture de fichier planifiée** — grep-puis-lecture-ciblée, pas lectures de fichier complet
- [ ] **Les pipes de sortie Bash en place** — tous les commandes avec la sortie unbounded ont `| head -N` ou `| grep pattern`
- [ ] **Hook de compression PostToolUse installé** — voir [context-budget.md](context-budget.md) pour l'implémentation
- [ ] **Hook PreCompact installé** — injectera l'état git et la liste de tâche à temps de compaction
- [ ] **Seuil de compaction décidé** — plan compacter à 40–50% remplissage, pas 80%+
- [ ] **Plan de subagent prêt** — les tâches impliquant les 10+ lectures de fichier seront déléguées aux subagents
- [ ] **Motif état-vers-disque configuré** — pour les boucles autonomes, les chemins de fichier d'état définis
- [ ] **`/usage` sera vérifiée au démarrage de session** — la surcharge de baseline confirmée avant la première tâche

Ces éléments sont les checkboxes, pas les objectifs aspirationnels. Manquer le hook PostToolUse coûte les vrais argent à travers tous les commandes bash verbeux dans la session. Manquer la décision de seuil de compaction signifie vous allez compacter réactivement à 80% au lieu de proactivement à 50%. Chaque élément a l'impact mesurable sur la qualité de session et le coût.

---

## Motifs de défaillance courants et leurs fixes

**Défaillance : session se dégrade au tour 30 malgré être sous 50% de remplissage**

Cause : une sortie d'outil verbeux tôt dans la session (par ex., une lecture log de 5,000-ligne en complet) occupe 40% de la fenêtre, laissant 10% pour le contexte de travail réel.

Fix : identifier le grand bloc via `/usage`, noter que la catégorie de résultats d'outil est élevée relativement à l'historique de conversation. Aller en avant, ajouter le trimming de sortie au commande offensante.

**Défaillance : post-compaction Claude demande les choses qu'il devrait savoir**

Cause : le résumé de compaction a perdu les décisions clés parce qu'elles n'ont pas été front-loaded ou renforcées. Le résumeur les déprioritisé.

Fix : utiliser la compaction dirigée avec les instructions explicites de rétention. Installer le hook PreCompact. Après compaction, ouvrir avec une brève réaffirmation des contraintes les plus critiques avant continuer le travail.

**Défaillance : la session 1M-contexte est lente et coûteuse mais ne produit pas les meilleurs résultats**

Cause : la tâche ne requiert pas 1M tokens. La capacité extra remplie avec le bruit — les sorties bash verbeux, les lectures de fichier complet, le contexte répété.

Fix : commuter au standard 200K. Appliquer les stratégies d'hygiène de contexte pour s'adapter la session dans la fenêtre plus petite. Si la tâche vraiment ne s'adapte pas 200K avec l'hygiène appropriée, revisit la fenêtre 1M.

**Défaillance : la boucle autonome s'est dégradée à travers 20 itérations sans compaction**

Cause : chaque itération ajouté les 10K tokens d'historique d'outil au même contexte sans mécanisme de reset.

Fix : mettre en place le motif write-état-vers-disque. Considérer ScheduleWakeup pour un reset dur entre les itérations longues.

---
