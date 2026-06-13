# Pourquoi Claude Code — Harnais vs Invite

Une fausse conception courante : « À mesure que les modèles s'améliorent, les fonctionnalités deviennent des invites — donc une invite bien écrite équivaut à un harnais entièrement configuré. » C'est faux. Comprendre pourquoi est important pour tirer le meilleur parti de Claude Code et pour décider ce qui appartient à une invite par rapport à ce qui appartient à la configuration.

---

## Les 10 Choses qu'un Harnais Fait que les Invites Ne Peuvent Pas

| # | Capacité | Harnais | Invite |
|---|---|---|---|
| 1 | **Isolation du contexte** | Les sous-agents s'exécutent dans des fenêtres de contexte séparées | Les invites partagent un contexte — tout fuit ensemble |
| 2 | **Restrictions d'outils** | Le harnais applique quels outils un agent peut appeler — bloqué au niveau de l'exécution | Les invites ne peuvent que demander ; le modèle peut ou ne pas se conformer |
| 3 | **Chargement faible** | Les compétences se chargent uniquement lorsqu'elles correspondent sémantiquement — le contexte de démarrage reste petit | Les invites doivent charger tous les instructions en amont — contexte volumineux depuis le début |
| 4 | **Hooks** | Les commandes shell se déclenchent sur les événements (PreToolUse, Stop, PostCompact) indépendamment de la sortie du modèle | Les invites instruisent ; le modèle décide de se conformer |
| 5 | **Routage des modèles** | Les différentes tâches s'acheminent vers Haiku, Sonnet, ou Opus en fonction de la définition de l'agent | Une seule invite s'exécute sur un modèle — aucun routage |
| 6 | **Parallélisme** | Plusieurs agents s'exécutent simultanément dans des processus séparés | Les invites séquentielles ne peuvent pas paralléliser — un tour à la fois |
| 7 | **Persistance entre sessions** | CLAUDE.md, les règles, et la mémoire persistent automatiquement sur chaque session | Les invites se réinitialisent à la fin de la session — le contexte doit être réinjecté à chaque fois |
| 8 | **Prompt système modulaire** | Des centaines de fragments conditionnels s'activent en fonction de la configuration du projet | Un seul invite plat — tout est toujours présent ou jamais présent |
| 9 | **Activation automatique des compétences** | L'expertise de domaine s'active sur la correspondance de fichier ou le déclencheur sémantique | Les compétences doivent être invoquées manuellement — rien n'est automatique |
| 10 | **Portes de permission** | Le harnais applique les règles `allow`/`deny` pour les opérations destructrices au niveau d'exécution | Les invites ne peuvent que demander poliment — aucune application |

---

## L'Asymétrie de Jeton

Votre invite est généralement de 6–60 jetons. Le harnais gère 5 000–50 000+ jetons d'entrée du modèle via chargement faible, activation conditionnelle, et mise en cache du prompt.

Un « invite forte » fonctionne au niveau de l'entrée utilisateur — une fraction de ce que le modèle voit réellement. Il ne peut pas atteindre :

- Les fragments de prompt système injectés avant votre message
- Les descriptions d'outils chargées par le harnais
- Le contenu de compétence activé par le contexte de fichier
- Les fichiers de règles appariés au chemin de travail actuel
- Le contenu CLAUDE.md mis en cache des sessions précédentes

Écrire une longue invite détaillée pour compenser la configuration manquante est comme augmenter le signal en criant tandis que vous ignorez le plancher de bruit.

---

## Implications Pratiques

**Ne reproduisez pas le comportement du harnais dans les invites.**

Les invites qui tentent d'appliquer les restrictions d'outils (« n'utilisez pas Bash ») ou de définir les préférences persistantes (« utilisez toujours TypeScript pour les nouveaux fichiers ») ne sont pas fiables. Le modèle peut les suivre la plupart du temps, mais il n'y a aucune garantie. L'application du harnais ; les invites demandent.

| Ce que vous voulez | Mauvaise approche | Bonne approche |
|---|---|---|
| Normes de codage persistantes | Répéter dans chaque invite | `CLAUDE.md` |
| Restreindre l'agent à la lecture seule | « S'il vous plaît, ne pas écrire de fichiers » | `tools:` liste blanche de l'agent |
| Exécuter le linter après chaque modification | « S'il vous plaît, exécuter le lintage après les modifications » | Hook `PostToolUse` |
| Expertise de domaine pour une tâche | Coller les documents dans l'invite | Fichier Compétence |
| Effets secondaires garantis | « Après avoir terminé, me notifier » | Hook `Stop` |
| Limite de sécurité | « Ne pas toucher les credentials de prod » | Règle de permission `deny` |

---

## Quand les Invites Sont le Bon Outil

Les invites sont le bon outil pour :

- **Instructions de tâche ponctuelles** — conseils spécifiques et ponctuels qui ne se généralisent pas
- **Contexte dynamique** — information connue uniquement à l'exécution (une URL, un chemin de fichier fourni par l'utilisateur, un numéro de version spécifique)
- **Direction de conversation** — redirection mi-session en fonction de ce que vous venez de voir
- **Clarifier l'ambiguïté** — expliquer quel est le « comportement correct » pour ce cas spécifique

Tout le reste — valeurs par défaut, normes, modèles, restrictions, automatisation, persistance — appartient à la couche du harnais.

---

## L'Effet Composé

La configuration du harnais se compose. Un projet avec un CLAUDE.md bien structuré, trois compétences axées, deux automations de hook, et des agents correctement restreints fonctionne mieux au jour 100 qu'au jour 1, car chaque session bénéficie de la configuration accumulée sans aucune ingénierie de prompt supplémentaire.

Un projet qui s'appuie sur les invites se dégrade au fil du temps. À mesure que la base de code grandit, les invites deviennent plus longues, le contexte devient plus bruyant, et les frais généraux de rétablissement du contexte au début de chaque session augmentent.

L'investissement dans la configuration du harnais paie des dividendes sur chaque session future. L'investissement dans un long prompt système paie des dividendes uniquement sur le courant.

---
