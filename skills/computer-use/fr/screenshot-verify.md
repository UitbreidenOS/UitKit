---
name: screenshot-verify
description: Capturer et vérifier qu'une modification du code s'est réellement rendue visible — la boucle "voir ça marcher" après une édition.
---

# Vérification de capture d'écran

## Quand l'activer

- L'utilisateur dit "vérifie si c'est correct", "confirme que la modification s'affiche" ou "ça marche visuellement ?"
- Vous venez de faire une modification de code et vous voulez confirmer que la modification est visible dans l'application en cours d'exécution avant de signaler que c'est terminé
- Une compilation a été rechargée et l'utilisateur veut une confirmation que la nouvelle version est activo
- Vous devez boucler après une modification CSS, de mise en page ou de composant — la modification seule n'est pas une preuve
- L'utilisateur demande "peux-tu voir ça marcher" ou "montre-moi une capture d'écran après la correction"
- Débogage d'une modification qui "devrait avoir fonctionné" — confirmer si le nouveau code s'exécute réellement
- Vérification qu'un indicateur de fonctionnalité, une variable d'environnement ou une modification de configuration a pris effet visuellement

## Quand NE PAS l'utiliser

- La modification est purement back-end/API sans sortie visuelle — utilisez l'exécution de tests ou les journaux à la place
- L'application n'est pas en cours d'exécution et ne peut pas être démarrée sans informations d'identification ou configuration d'environnement fournies par l'utilisateur
- L'état visuel ne peut être atteint que par une connexion via un écran d'authentification sensible
- L'utilisateur dit explicitement "lance simplement les tests, ne vérifie pas visuellement"
- La modification concerne un composant sans sortie rendue (fonction utilitaire, définition de type, logique côté serveur uniquement)

## Instructions

### La boucle de vérification

La boucle de vérification est le cycle minimal pour fermer l'écart entre "j'ai fait une modification" et "je peux voir la modification fonctionner" :

```
EDIT → RELOAD → NAVIGATE → SCREENSHOT → ASSERT → REPORT
```

Chaque phase est décrite ci-dessous.

### Phase 1 : EDIT

Confirmez que la modification a été enregistrée sur le disque. Si vous avez fait l'édition, elle est enregistrée. Si l'utilisateur a fait l'édition, demandez : "Le fichier est-il enregistré ?" avant de continuer.

Notez le fichier exact et la ligne modifiée pour que vous sachiez quelle sortie visuelle attendre.

### Phase 2 : RELOAD

Déclenchez un rechargement de l'application en cours d'exécution :

**Application Web (navigateur)** :
- Si le remplacement de module à chaud (HMR) est actif, la modification peut avoir déjà été rechargée. Vérifiez la console du navigateur pour l'activité HMR.
- Si ce n'est pas le cas, déclenchez un rechargement forcé : Cmd+Shift+R (macOS) ou Ctrl+Shift+F5 (Windows).
- Attendez que l'indicateur d'activité réseau s'arrête avant de prendre une capture d'écran.

**Application native / Electron** :
- Vérifiez si le rechargement en direct est configuré. Si oui, attendez l'indicateur de rechargement.
- Si aucun rechargement en direct, demandez à l'utilisateur de redémarrer l'application ou d'utiliser le raccourci de rechargement de l'application.

**Application rendue côté serveur** :
- Confirmez que le serveur de développement a détecté la modification (surveillez le journal des modifications de fichier dans le terminal).
- Rechargez le navigateur.

**Fichier statique servi localement** :
- Confirmez que le fichier est servi à partir du disque (pas une version en cache). Rechargez avec contournement du cache.

### Phase 3 : NAVIGATE

Accédez à la vue exacte où la modification doit être visible :

1. Notez l'URL ou le chemin d'accès à l'écran avant de naviguer.
2. Prenez une capture d'écran à la vue cible avant d'affirmer — c'est votre preuve que l'écran correct est chargé.
3. Si la modification n'apparaît qu'après une interaction utilisateur (clic, survol, saisie), effectuez l'interaction minimale nécessaire pour la faire apparaître.

Ne prenez pas de capture d'écran d'une page qui charge encore — attendez que l'indicateur de chargement disparaisse.

### Phase 4 : SCREENSHOT

Capturez l'écran avec précision :

- Faites défiler la zone où l'élément modifié est visible si nécessaire.
- Si la modification concerne un composant spécifique, effectuez un zoom sur ce composant après la capture d'écran de la page complète.
- Si vous comparez à un état précédent, capturez à la même position de défilement et largeur de fenêtre d'affichage que la capture d'écran avant.
- Nommez la capture d'écran avec le contexte : `[composant]-[état]-après.png` — n'utilisez pas de noms génériques comme `capture-écran1.png`.

### Phase 5 : ASSERT

Examinez la capture d'écran et vérifiez la modification spécifique :

Pour une **modification CSS** (couleur, police, espacement, mise en page) :
- La nouvelle valeur est-elle visiblement appliquée ? Décrivez ce que vous voyez.
- Est-elle cohérente dans toutes les instances du composant sur cet écran ?
- Y a-t-il des éléments adjacents qui semblent cassés comme effet secondaire ?

Pour une **modification de texte/contenu** :
- Le nouveau texte apparaît-il exactement comme écrit dans l'édition ?
- Est-il au bon endroit (pas déplacé vers un élément différent) ?
- L'ancien texte a-t-il disparu ?

Pour un **nouveau composant ou une nouvelle fonctionnalité** :
- Le composant est-il rendu et visible ?
- Est-il à la bonne position dans la mise en page ?
- Répond-il à l'interaction attendue (état actif visible, étiquette, icône) ?

Pour une **correction de bug** :
- L'état précédemment cassé a-t-il disparu ?
- L'état corrigé est-il présent ?
- Décrivez à la fois l'ancien problème et le nouvel état dans l'assertion.

Pour une **modification de configuration ou d'indicateur de fonctionnalité** :
- Le contenu conditionnel est-il affiché/masqué comme prévu ?
- Vérifiez également la condition opposée si possible — confirmez que ce n'est pas affiché quand il ne devrait pas l'être.

### Phase 6 : REPORT

Produisez une déclaration de vérification concise après la vérification de capture d'écran :

**Format de réussite** :
```
Vérifiée : [ce qui a été modifié]
La capture d'écran montre : [observation spécifique confirmant la modification]
Aucune régression observée dans les éléments adjacents.
Statut : CONFIRMÉE
```

**Format d'échec** :
```
Vérification échouée : [ce qui a été modifié]
Attendu : [ce que la capture d'écran devrait montrer]
Observé : [ce que la capture d'écran montre réellement]
Cause probable : [raison la plus probable — fichier non enregistré, mauvais sélecteur, HMR non actif, compilation en cache]
Prochaine étape : [action spécifique à investiguer]
Statut : NON CONFIRMÉE
```

### Modes d'échec courants et comment les diagnostiquer

| Symptôme | Cause probable | À vérifier |
|---|---|---|
| Modification non visible après rechargement | Fichier non enregistré, ou mauvais fichier modifié | Confirmez le chemin du fichier et le contenu |
| Ancienne version toujours affichée | Cache du navigateur | Rechargement forcé avec Cmd+Shift+R |
| Modification visible au mauvais endroit | Sélecteur CSS trop large | Inspectez la portée du sélecteur |
| Composant ne s'affiche pas du tout | Erreur d'importation, rendu conditionnel, indicateur de fonctionnalité désactivé | Vérifiez la console du navigateur pour les erreurs |
| Modification visible en dev mais pas après la compilation | Étape de compilation nécessaire, pas seulement le serveur dev | Exécutez l'étape de compilation |
| L'application affiche un écran blanc après modification | Erreur de syntaxe dans le fichier modifié | Vérifiez le terminal/console pour l'erreur de compilation |

### Vérification dans plusieurs états

Certaines modifications n'apparaissent que dans des états spécifiques. Pour chaque état pertinent, exécutez la boucle de vérification indépendamment :

- **État par défaut** — rendu initial sans interaction utilisateur
- **État actif/survol** — après interaction à la souris (prenez une capture d'écran en survolant si possible)
- **État d'erreur** — avec saisie invalide ou récupération échouée
- **État vide** — sans données chargées
- **État de chargement** — immédiatement après le déclenchement d'une récupération de données

### Règles de sécurité

- Ne pas interagir avec aucun formulaire qui pourrait soumettre des données en tant qu'effet secondaire de la navigation pour vérifier une modification visuelle.
- Si le chemin de navigation pour atteindre la vue modifiée passe par un écran sensible (paiement, authentification, santé), arrêtez-vous et demandez à l'utilisateur d'y accéder manuellement, puis prenez une capture d'écran à partir de ce moment.
- La vérification est une observation en lecture seule — ne faites pas d'éditions supplémentaires pendant une boucle de vérification. Si une régression est détectée, signalez-la et attendez les instructions.

## Exemple

**Scénario** : Un développeur a changé la couleur du bouton principal de bleu à indigo dans une config Tailwind. Veut une confirmation que la modification est active dans toute l'application.

**Modification apportée** : `tailwind.config.js` — couleur `primary` mise à jour de `#3B82F6` à `#6366F1`.

**Boucle de vérification** :

1. **RELOAD** : Le HMR du navigateur est actif. Vérifiez le terminal — message "Tailwind config changed, rebuilding..." visible. Attendez le message de compilation terminée.

2. **NAVIGATE** : Allez à `http://localhost:3000` — page d'accueil avec un bouton principal "Get Started" visible.

3. **SCREENSHOT** : Capturez la page complète. Notez le bouton principal.

4. **ASSERT** : La couleur d'arrière-plan du bouton est visuellement indigo (tendant vers le violet) et non bleu. Correspond au ton `#6366F1` attendu. Aucun autre élément ne semble cassé. Les boutons secondaires adjacents restent gris.

5. Accédez à `/pricing` — un autre bouton CTA principal présent. Capture d'écran. Même couleur indigo appliquée. Cohérent.

**Rapport** :
```
Vérifiée : Modification de la couleur du bouton principal de bleu (#3B82F6) à indigo (#6366F1)
La capture d'écran montre : L'appel à l'action de la page d'accueil et l'appel à l'action de la page de tarification affichent la nouvelle couleur indigo
Aucune régression observée — les boutons secondaires et tertiaires inchangés
Statut : CONFIRMÉE
```

**Si le bouton était toujours bleu** :
```
Vérification échouée : Modification de la couleur du bouton principal
Attendu : Arrière-plan du bouton indigo (#6366F1)
Observé : Le bouton affiche toujours le bleu (#3B82F6)
Cause probable : Tailwind JIT n'a pas détecté le changement de config, ou le navigateur a mis en cache l'ancien CSS
Prochaine étape : Vérifiez les erreurs de compilation dans le terminal ; essayez un rechargement forcé avec Cmd+Shift+R ; confirmez que tailwind.config.js se trouve dans les chemins de contenu
Statut : NON CONFIRMÉE
```
