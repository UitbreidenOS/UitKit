---
description: Audit un composant ou une page pour les violations WCAG 2.1 AA et émettre une liste de correctifs priorisée
argument-hint: "[fichier-ou-répertoire]"
---
Effectuer un audit d'accessibilité WCAG 2.1 AA sur : $ARGUMENTS

Si aucun argument n'est fourni, auditez le fichier actuellement ouvert ou le répertoire `src/`.

Liste de contrôle d'audit — évaluer chaque critère et signaler les violations avec les références fichier:ligne :

**Perceptible**
- 1.1.1 Contenu non textuel : chaque `<img>`, `<svg>`, `<canvas>` a un `alt` ou `aria-label` significatif ; les images décoratives utilisent `alt=""`
- 1.3.1 Information et relations : HTML sémantique (`<nav>`, `<main>`, `<header>`, `<section>`, `<article>`) utilisé correctement ; pas de tableaux de disposition
- 1.3.2 Séquence significative : l'ordre du DOM correspond à l'ordre visuel ; pas de réorganisation CSS seule qui rompt le flux du lecteur d'écran
- 1.4.1 Utilisation de la couleur : les informations ne sont pas transmises par la couleur seule
- 1.4.3 Contraste : contraste du texte ≥ 4.5:1 (normal), ≥ 3:1 (grand) ; vérifier les valeurs de couleur calculées
- 1.4.4 Redimensionner le texte : la mise en page survit à un zoom de 200 % sans défilement horizontal ou perte de contenu
- 1.4.10 Reflux : pas de défilement bidimensionnel à une largeur de viewport de 320px

**Utilisable**
- 2.1.1 Clavier : tous les éléments interactifs accessibles et utilisables au clavier uniquement
- 2.1.2 Pas de piège clavier : le focus peut toujours quitter chaque composant
- 2.4.3 Ordre du focus : la séquence de tabulation logique correspond au flux visuel
- 2.4.7 Focus visible : tous les éléments pouvant recevoir le focus ont un indicateur de focus visible (pas seulement le défaut du navigateur)
- 2.4.6 En-têtes et étiquettes : les en-têtes sont hiérarchiquement corrects (h1 → h2 → h3) ; pas de niveaux ignorés

**Compréhensible**
- 3.1.1 Langue de la page : `<html lang="...">` est défini correctement
- 3.2.2 À l'entrée : pas de changements de contexte inattendus au focus ou à la saisie
- 3.3.1 Identification des erreurs : les erreurs de formulaire sont identifiées en texte et associées au champ via `aria-describedby`
- 3.3.2 Étiquettes ou instructions : chaque champ de formulaire a une étiquette visible ou `aria-label`

**Robuste**
- 4.1.2 Nom, rôle, valeur : les composants interactifs personnalisés exposent le rôle, l'état et la propriété ARIA corrects
- 4.1.3 Messages de statut : le contenu dynamique utilise les régions `aria-live` de manière appropriée

Format de sortie :
1. Ligne de résumé : `N violations trouvées (X critiques, Y graves, Z modérées)`
2. Tableau des violations : `| fichier:ligne | critère | gravité | problème | correction |`
3. Après le tableau, émettre le code corrigé pour chaque violation en ligne — ne pas simplement décrire les modifications, les appliquer

Échelle de gravité : critique (bloque les utilisateurs de lecteurs d'écran), grave (échec WCAG), modéré (lacune des bonnes pratiques).
