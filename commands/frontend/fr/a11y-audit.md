---
description: Auditez un composant ou une page pour les violations WCAG 2.1 AA et émettez une liste de corrections priorisée
argument-hint: "[file-or-directory]"
---
Effectuez un audit d'accessibilité WCAG 2.1 AA sur: $ARGUMENTS

Si aucun argument n'est fourni, auditez le fichier actuellement ouvert ou le répertoire `src/`.

Liste de contrôle d'audit — évaluez chaque critère et signalez les violations avec les références fichier:ligne:

**Perceptible**
- 1.1.1 Contenu non textuel: chaque `<img>`, `<svg>`, `<canvas>` a un `alt` ou `aria-label` significatif; les images décoratives utilisent `alt=""`
- 1.3.1 Informations et relations: le HTML sémantique (`<nav>`, `<main>`, `<header>`, `<section>`, `<article>`) est utilisé correctement; pas de tableaux de mise en page
- 1.3.2 Séquence significative: l'ordre du DOM correspond à l'ordre visuel; pas de réorganisation CSS uniquement qui casse le flux du lecteur d'écran
- 1.4.1 Utilisation de la couleur: l'information n'est pas transmise par la couleur seule
- 1.4.3 Contraste: le contraste du texte ≥ 4,5:1 (normal), ≥ 3:1 (grand); vérifiez les valeurs de couleur calculées
- 1.4.4 Redimensionner le texte: la mise en page survit au zoom de 200% sans défilement horizontal ni perte de contenu
- 1.4.10 Flux: pas de défilement bidimensionnel à une largeur de fenêtre d'affichage de 320px

**Exploitable**
- 2.1.1 Clavier: tous les éléments interactifs sont accessibles et utilisables via le clavier seul
- 2.1.2 Aucun piège au clavier: le focus peut toujours quitter chaque composant
- 2.4.3 Ordre de focus: la séquence de tabulation logique correspond au flux visuel
- 2.4.7 Focus visible: tous les éléments focalisables ont un indicateur de focus visible (pas seulement le défaut du navigateur)
- 2.4.6 Titres et étiquettes: les titres sont hiérarchiquement corrects (h1 → h2 → h3); pas de niveaux ignorés

**Compréhensible**
- 3.1.1 Langue de la page: `<html lang="...">` est défini correctement
- 3.2.2 À la saisie: pas de changements de contexte inattendus au focus ou à la saisie
- 3.3.1 Identification des erreurs: les erreurs de formulaire sont identifiées en texte et associées au champ via `aria-describedby`
- 3.3.2 Étiquettes ou instructions: chaque champ de formulaire a une étiquette visible ou `aria-label`

**Robuste**
- 4.1.2 Nom, rôle, valeur: les composants interactifs personnalisés exposent le rôle, l'état et la propriété ARIA corrects
- 4.1.3 Messages de statut: le contenu dynamique utilise les régions `aria-live` de manière appropriée

Format de sortie:
1. Ligne de synthèse: `N violations trouvées (X critiques, Y graves, Z modérées)`
2. Tableau de violations: `| fichier:ligne | critère | gravité | problème | correction |`
3. Après le tableau, émettez le code corrigé pour chaque violation en ligne — ne décrivez pas simplement les modifications, appliquez-les

Échelle de gravité: critique (bloque les utilisateurs de lecteur d'écran), grave (échec WCAG), modéré (lacune de bonne pratique).
