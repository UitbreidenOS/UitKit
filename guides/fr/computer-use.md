# Utilisation d'ordinateur dans Claude Code

L'utilisation d'ordinateur permet à Claude de contrôler un environnement de bureau — il prend des captures d'écran pour voir l'écran, puis envoie des clics de souris, des entrées de clavier et des événements de défilement pour interagir avec n'importe quelle application visible. Aucun pilote de navigateur ou API requise.

---

## Comment cela fonctionne

Claude opère une boucle de rétroaction :

1. Prendre une capture d'écran de l'état du bureau actuel
2. Analyser ce qu'il voit (fenêtres d'application, boutons, champs de texte, dialogues)
3. Décider l'action suivante (clic aux coordonnées, type de texte, appui sur une touche)
4. Exécuter l'action
5. Prendre une autre capture d'écran pour vérifier le résultat
6. Répéter jusqu'à ce que la tâche soit terminée

Chaque capture d'écran est un appel d'inférence complet. Cela rend l'utilisation d'ordinateur considérablement plus lente et plus coûteuse que l'automatisation basée sur CLI ou API — planifiez en conséquence.

---

## Activation de l'utilisation d'ordinateur

**Drapeau CLI :**
```bash
claude --computer-use
```

**Fichier de paramètres** (`settings.json`) :
```json
{
  "computer_use": true
}
```

**Bascule par session :** Tapez `/computer-use` pour activer dans la session actuelle.

L'utilisation d'ordinateur nécessite que le modèle la supporte. Claude Opus 4.7 est recommandé pour les tâches de bureau complexes. Haiku ne prend pas en charge l'utilisation d'ordinateur.

---

## Actions disponibles

| Action | Description | Exemple |
|---|---|---|
| `screenshot` | Capturer l'écran actuel | Observation de base |
| `click` | Clic gauche aux coordonnées de pixel | `click(450, 320)` |
| `right_click` | Clic droit aux coordonnées | Menus contextuels |
| `double_click` | Double-clic aux coordonnées | Ouvrir les fichiers, activer les champs |
| `type` | Taper une chaîne de texte | Remplir les champs de formulaire |
| `key` | Appuyer sur une touche ou un accord | `key("ctrl+s")`, `key("Return")` |
| `scroll` | Faire défiler aux coordonnées | `scroll(400, 300, direction="down", amount=3)` |
| `drag` | Clic-maintien-faire glisser d'un point à un autre | Réorganiser les éléments, redimensionner les fenêtres |
| `move` | Déplacer la souris sans cliquer | Déclencher les états de surbrillance |

---

## Système de coordonnées

- Mappage de pixel 1:1 à la résolution d'affichage actuelle
- L'origine `(0, 0)` est le coin supérieur gauche de l'écran
- Résolution maximale : **2576px de large, 3,75MP au total** pour Claude Opus 4.7
- Pour les affichages haute DPI (Retina), la résolution logique et la résolution physique diffèrent — Claude opère en pixels logiques

Si l'écran est plus grand que la résolution supportée, Claude travaillera sur une version réduite. Les éléments UI ciblés peuvent légèrement se décaler. Testez avec la journalisation de coordonnées explicites quand la précision compte.

---

## Cas d'utilisation

**Test d'UI sans pilote de navigateur**
Capture d'écran avant et après un changement CSS, comparer les mises en page, vérifier le rendu des composants sur les points d'arrêt.

**Automatisation de formulaire pour les outils sans API**
Remplir les formulaires web, les outils internes ou les applications de bureau qui ne exposent pas d'interface programmatique.

**Extraction de données à partir d'applications de bureau**
Lire les valeurs affichées dans les applications GUI (Excel, GUI de base de données, tableaux de bord) qui n'ont pas d'option d'export.

**Automatisation des installateurs sans CLI**
Parcourir les installateurs de style assistant qui nécessitent l'interaction GUI.

**Vérification des fonctionnalités déployées**
Ouvrir une URL dans un vrai navigateur (pas headless), interagir avec la page comme un utilisateur le ferait, capturer le résultat.

---

## Limitations

| Limitation | Détail |
|---|---|
| Vitesse | Chaque action nécessite une capture d'écran (une inférence). Les tâches complexes peuvent prendre 10–30+ minutes. |
| Coût | Opus 4.7 à la fréquence de capture d'écran est coûteux — budgétez soigneusement |
| Parallélisme | Un bureau à la fois ; les actions sont strictement séquentielles |
| Précision | Les clics basés sur les coordonnées peuvent manquer de petites cibles à haute DPI ; utiliser les descriptions d'éléments si possible |
| Récupération d'état | Si un dialogue apparaît inopinément, Claude doit le reconnaître et le rejeter — cela ajoute des tours |
| Pas d'annulation | Les événements de souris et de clavier sont réels ; l'utilisation d'ordinateur peut déclencher des actions irréversibles |

---

## Sécurité

**Toujours utiliser `--dry-run` d'abord sur les flux de travail destructeurs :**
```bash
claude --computer-use --dry-run "Supprimer tous les fichiers du dossier Téléchargements qui sont plus vieux que 30 jours"
```

Le mode dry-run enregistre chaque action planifiée sans l'exécuter. Passez en revue le plan avant d'autoriser l'exécution.

**Limiter votre prompt étroitement.** L'utilisation d'ordinateur peut cliquer sur n'importe quoi visible — une invite largement délimitée comme « nettoyer mon bureau » peut déclencher des actions non intentionnelles. Nommez les applications, fenêtres et opérations spécifiques.

**Définir `maxTurns` pour les tâches longues :**
```json
{
  "computer_use": true,
  "maxTurns": 50
}
```

Sans limite de tour, un Claude confus peut boucler indéfiniment sur un état d'interface bloqué.

---

## Utilisation d'ordinateur vs Playwright

| | Utilisation d'ordinateur | Playwright |
|---|---|---|
| **Fonctionne sur** | N'importe quelle interface visible (web, bureau, applications natives) | Web uniquement (Chromium, Firefox, WebKit) |
| **Vitesse** | Lent (capture d'écran par action) | Rapide (accès direct à DOM) |
| **Fiabilité** | Modérée (sensible aux coordonnées) | Haute (basée sur le sélecteur) |
| **Configuration** | Aucune | `npm install playwright` |
| **Utiliser quand** | Aucune interface programmatique n'existe | Automatisation des interfaces web |

**Règle générale :** Utiliser Playwright pour l'automatisation web. Utiliser l'utilisation d'ordinateur uniquement quand il n'y a pas de chemin d'automatisation de navigateur — applications de bureau natives, applications web qui contournent la détection headless ou outils qui nécessitent une session GUI authentifiée réelle.

---

## Exemple : Test automatisé de capture d'écran

Comparer l'interface avant et après un changement CSS :

```
Vous avez l'utilisation d'ordinateur activée.

1. Ouvrir http://localhost:3000/dashboard dans Chrome
2. Prendre une capture d'écran et l'enregistrer sur /tmp/before.png
3. Je vais faire un changement CSS — attendez que je dise "done"
4. Après que je dise done, prendre une seconde capture d'écran et l'enregistrer sur /tmp/after.png
5. Comparer les deux captures d'écran et décrire les différences visuelles que vous voyez
```

Pour une version non-interactive (routine ou étape CI) :

```
Vous avez l'utilisation d'ordinateur activée.

Ouvrir http://localhost:3000/dashboard dans Chrome.
Prendre une capture d'écran.
Comparer avec la capture d'écran de référence sur /tmp/reference.png.
Signaler toutes les différences de mise en page, les éléments manquants ou les changements de couleur.
Écrire vos conclusions sur /tmp/visual-diff-report.md.
```

---
