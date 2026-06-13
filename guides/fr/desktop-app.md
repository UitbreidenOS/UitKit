# Application de bureau Claude Code

Guide complet de l'espace de travail basé sur les panneaux introduit dans Claude Code v1.2581.0.

---

## Aperçu

L'application de bureau Claude Code n'est pas une fenêtre de chat avec une barre latérale. C'est un espace de travail complet basé sur les panneaux — plusieurs panneaux indépendamment redimensionnables que Claude et le développeur partagent simultanément. Chaque type de volet sert un objectif distinct et ils se composent en dispositions enregistrées par projet.

**Exigences:** Bureau v1.2581.0 ou ultérieur. Téléchargez depuis [claude.ai/code](https://claude.ai/code).

Le changement fondamental par rapport à Claude Code terminal: vous ne passez plus en contexte entre votre éditeur, le navigateur et le terminal. L'espace de travail les tient tous, et Claude peut voir et interagir avec les mêmes panneaux que vous.

---

## Système de panneaux

### Types de panneaux

**Panneau de chat**
L'interface de conversation principale. Toujours présente — elle ne peut pas être fermée. Tous les messages, réponses et résumés d'appels d'outils apparaissent ici.

**Panneau de différence** — `Cmd+Shift+D`
Visionneur de différence interactif. Affiche les diffs par tour, pas seulement l'état final cumulatif. Naviguer en arrière par tour pour voir exactement ce qui a changé quand. Décomposition par fichier avec sections extensibles. Prend en charge les commentaires en ligne sur les lignes spécifiques.

**Panneau d'aperçu** — `Cmd+Shift+P`
Rend les fichiers HTML en direct sans navigateur et ouvre les PDF, images et vidéos en ligne. Se met à jour automatiquement quand le fichier change sur le disque. Claude peut utiliser ce panneau pour la vérification visuelle — prendre des captures d'écran et inspecter le DOM — sans quitter l'espace de travail. L'option `Persister les sessions` conserve les cookies et l'état d'authentification entre les redémarrages.

**Panneau de terminal** — `Ctrl+\``
Terminal intégré. S'exécute à l'intérieur du répertoire du projet. Utile pour exécuter les tests, regarder les journaux ou émettre des commandes en parallèle avec une session Claude active sans changer de fenêtres.

**Panneau de fichier**
S'ouvre quand vous cliquez sur tout chemin de fichier mentionné dans le chat ou le visionneur de différence. Fournit un éditeur direct pour les modifications ciblées. Enregistre sur le disque immédiatement lors de l'enregistrement. Avertit si le fichier a changé sur le disque depuis son ouverture. Pas un IDE complet — adapté pour les modifications ciblées, pas pour les refactorisations structurelles importantes.

**Panneau de plan**
Visible pendant le mode plan. Affiche le plan actuel de Claude comme une liste structurée. Se met à jour à mesure que Claude révise le plan en cours de tâche.

**Panneau de tâches**
Vue de la liste des tâches. Affiche les tâches actives et complétées dans la session actuelle.

**Panneau de sous-agent**
Affiche les sous-agents en cours d'exécution et leur statut actuel — quel outil chacun exécute, s'il est bloqué en attente d'entrée et quand il se termine. Utile pour surveiller le travail d'agent parallèle sans interroger le chat.

### Contrôles de panneau

| Action | Méthode |
|---|---|
| Repositionner un panneau | Faire glisser l'en-tête du panneau |
| Redimensionner un panneau | Faire glisser le bord du panneau |
| Fermer le panneau focalisé | `Cmd+\` |
| Ouvrir des panneaux supplémentaires | Menu Affichages |

Les mises en page sont enregistrées par projet. La réouverture d'un projet restaure l'arrangement de panneau utilisé en dernier.

---

## Sessions parallèles

La barre latérale des sessions sur la gauche répertorie toutes les sessions actives pour la fenêtre actuelle. Cliquez pour basculer entre elles. Chaque session a un contexte indépendant — le basculement n'interrompt pas l'autre session.

`Cmd+;` ouvre un **chat latéral** qui n'affecte pas l'historique de la session principale. Le chat latéral voit le contexte actuel complet mais ne laisse aucune trace dans la conversation quand il est fermé. Utilisez-le pour les questions rapides en milieu de tâche — vérifier une valeur, demander un motif — sans polluer la session avec des allers-retours exploratoires.

Faites glisser et déposez les panneaux pour arranger les vues parallèles entre les sessions. Un agencement courant: chat de session principal sur la gauche, panneau de sous-agent sur la droite, visionneur de différence au bas.

---

## Panneau d'aperçu

Le panneau d'aperçu est le panneau à plus haut effet de levier pour le travail frontal et les documents.

- Ouvre HTML rendu en direct — les modifications du fichier sur le disque apparaissent immédiatement, pas de rechargement du navigateur
- Ouvre les PDF, images et fichiers vidéo en ligne
- Claude peut prendre une capture d'écran de l'aperçu et l'utiliser comme vérification visuelle avant de valider un changement
- Claude peut inspecter le DOM via le panneau d'aperçu, capturant les problèmes de mise en page sans une session de devtools de navigateur séparée
- `Persister les sessions` garde les cookies et l'état d'authentification entre les redémarrages — utile pour prévisualiser les états UI authentifiés
- Le panneau se met à jour automatiquement lors de l'enregistrement du fichier — pas d'actualisation manuelle

Utilisez ceci à la place d'un navigateur pour itérer sur l'interface utilisateur. Gardez le panneau d'aperçu ouvert aux côtés du panneau de chat lors du travail sur tout fichier HTML, CSS ou modèle.

---

## Panneau d'éditeur de fichier

Cliquez sur tout chemin de fichier dans la sortie de chat ou le visionneur de différence pour ouvrir le fichier dans le panneau d'éditeur de fichier.

- Les modifications s'enregistrent sur le disque immédiatement quand vous enregistrez
- Le panneau avertit si le fichier a été modifié sur le disque depuis son ouverture
- Utile pour examiner les écrits de Claude et apporter de petites corrections directement
- Non destiné aux refactorisations importantes — ouvrez un IDE approprié pour celles-ci

---

## Visionneur de différence

Le visionneur de différence affiche les diffs par tour, pas seulement l'état accumulé final.

- Naviguer tour par tour en utilisant le sélecteur de tour en haut du panneau
- Voir exactement les lignes qui ont changé dans quelle réponse
- Décomposition par fichier avec sections extensibles
- Ajouter des commentaires en ligne sur des lignes spécifiques — les commentaires sont visibles pour Claude dans les tours suivants

Ouvrez avec `Cmd+Shift+D`. Utile lors de l'examen d'une longue tâche multi-étapes pour comprendre la séquence des modifications, pas seulement le résultat.

---

## Auto-archivage

Les sessions s'archiver automatiquement quand la demande de tirage liée est fusionnée. Les sessions archivées sont supprimées de la barre latérale des sessions actives mais restent consultables. Rouvrez toute session archivée depuis l'onglet Archive.

L'archivage manuel est également disponible: cliquez avec le bouton droit sur n'importe quelle session dans la barre latérale pour l'archiver immédiatement.

---

## Raccourcis clavier

| Action | Raccourci |
|---|---|
| Ouvrir panneau de différence | `Cmd+Shift+D` |
| Ouvrir panneau d'aperçu | `Cmd+Shift+P` |
| Ouvrir panneau de terminal | `Ctrl+\`` |
| Ouvrir chat latéral | `Cmd+;` |
| Fermer le panneau focalisé | `Cmd+\` |
| Nouvelle session | `Cmd+N` |
| Basculer vers session 1–9 | `Cmd+[1-9]` |
| Soumettre l'invite | `Enter` |
| Nouvelle ligne dans l'invite | `Shift+Enter` |

---

## Thèmes personnalisés

Définissez le thème Clair, Sombre ou Système via `/config`. Pour les utilisateurs avancés, l'injection CSS personnalisée est disponible — injectez une feuille de style pour remplacer n'importe quel élément visuel de l'espace de travail. C'est une option avancée sans garantie de stabilité d'API officielle.

---

## Conseils

- Gardez le panneau d'aperçu ouvert lors de l'itération sur n'importe quelle interface utilisateur. Claude l'utilisera pour la vérification visuelle avant de déclarer une tâche terminée.
- Utilisez `Cmd+;` pour les chats latéraux pendant les tâches actives — posez une question rapide sur la base de code sans qu'elle n'apparaisse dans le contexte de session que Claude porte vers l'avant.
- Ouvrez un panneau de terminal aux côtés du chat lors de l'exécution des tests. Exécutez la suite de tests directement sans quitter l'espace de travail.
- Le panneau du sous-agent montre le statut en temps réel pour les agents parallèles — vérifiez-le au lieu de demander à Claude une mise à jour de statut.
- Faites glisser les sessions dans la barre latérale pour les réorganiser. Gardez les sessions les plus actives en haut.
- La navigation par tour du visionneur de différence est le moyen le plus rapide de vérifier ce qu'une tâche d'agent long a réellement fait — utilisez-la avant de fusionner.

---
