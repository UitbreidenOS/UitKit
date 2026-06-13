# Règles d'Accessibilité

## S'applique à
Tout code d'interface utilisateur — HTML, JSX, TSX, moteurs de templates, composants de système de conception.

## Règles

1. **HTML sémantique en priorité** — utilisez `<button>`, `<nav>`, `<main>`, `<article>`, `<header>` avant de recourir à `<div>` + ARIA. L'élément correct transmet le rôle, l'état et le comportement au clavier sans effort supplémentaire.

2. **Chaque élément interactif doit être accessible au clavier** — focalisable, activable avec Entrée/Espace, navigable avec Tab/Maj-Tab. Ne supprimez jamais le contour de focus sans fournir un indicateur visuel équivalent.

3. **Toutes les images doivent avoir du texte `alt`** — les images décoratives utilisent `alt=""`. Les images informatives décrivent le contenu, pas l'apparence : `alt="Erreur : impossible de soumettre le formulaire"` et non `alt="icône rouge"`.

4. **La couleur seule ne peut pas transmettre du sens** — associez la couleur à du texte, une icône ou un motif. Une bordure rouge sur un champ invalide doit s'accompagner d'un message d'erreur. Les graphiques doivent avoir des points de données étiquetés ou des motifs.

5. **Ratio de contraste minimum : 4,5:1 pour le texte normal, 3:1 pour le texte volumineux et les composants d'interface** — testez avec un outil (axe, Lighthouse, Stark). Ne vous fiez jamais à l'apparence visuelle uniquement.

6. **Étiquez chaque contrôle de formulaire** — utilisez `<label for="id">` ou `aria-label` ou `aria-labelledby`. Le texte d'espace réservé n'est pas une étiquette — il disparaît et a un contraste faible.

7. **Annoncez les changements de contenu dynamique** — quand le contenu se met à jour sans rechargement de page, utilisez `aria-live="polite"` pour les mises à jour non urgentes, `aria-live="assertive"` uniquement pour les erreurs ou les alertes sensibles au temps.

8. **Ne supprimez jamais `tabindex="-1"` pour masquer les éléments du clavier sans aussi les masquer visuellement** — utilisez `display: none` ou `visibility: hidden` ou l'attribut `hidden` pour supprimer simultanément de l'ordre de focus et du flux visuel.

9. **Les widgets personnalisés doivent implémenter le modèle ARIA Authoring Practices** — les modales capturent le focus. Les menus utilisent les touches fléchées. Les accordéons utilisent Entrée/Espace. N'inventez pas de modèles d'interaction.

10. **Testez avec un lecteur d'écran avant de mettre en ligne une interface utilisateur interactive** — VoiceOver (macOS/iOS) ou NVDA (Windows). Les outils automatisés détectent environ 30 % des problèmes ; les tests manuels sont non négociables pour les flux critiques.

11. **Les en-têtes forment un plan logique, ne sautez jamais de niveaux** — `h1` → `h2` → `h3`. Les en-têtes communiquent la structure du document, pas la taille visuelle. Utilisez CSS pour la taille.

12. **Les messages d'erreur sont spécifiques et associés à leur champ** — « Requis » est insuffisant. « L'adresse e-mail est requise » associée à `aria-describedby` pointant vers l'élément d'erreur est correct.

13. **Ne lancez pas automatiquement d'audio ou de vidéo avec du son** — fournissez des contrôles de lecture/pause. Le contenu clignotant au-dessus de 3 Hz peut déclencher des crises — évitez-le ou fournissez un avertissement.

14. **Les zones de contact minimum 44×44 pixels CSS** — s'applique aux interfaces mobiles et tactiles. Les petites zones de contact ne conviennent pas aux utilisateurs ayant des troubles moteurs et aux doigts épais.

15. **Exécutez `axe-core` ou `eslint-plugin-jsx-a11y` en CI** — détectez les régressions automatiquement. Zéro violation d'accessibilité dans les vérifications automatisées est le minimum, pas le plafond.


---
