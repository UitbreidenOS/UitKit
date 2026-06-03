---
name: visual-qa
description: Assurance qualité visuelle et de mise en page via captures d'écran — comparer les états de l'interface utilisateur, détecter les ruptures CSS et documenter la dérive visuelle.
---

# AQ Visuelle via Computer Use

## Quand l'activer

- L'utilisateur demande de vérifier si une modification CSS/mise en page a cassé quelque chose visuellement
- Un composant d'interface utilisateur a été modifié et l'utilisateur souhaite une comparaison côte à côte avant/après
- L'application n'a pas de suite de tests de régression visuelle (Percy, Chromatic, captures d'écran Playwright) et une vérification manuelle est nécessaire
- L'utilisateur signale un bug de mise en page ("cela semble cassé sur mon écran") et souhaite que vous le reproduisiez
- Vérification des points d'arrêt réactifs — vérification de l'apparence de l'interface utilisateur à différentes largeurs de viewport
- Vérification des variantes de mode sombre, contraste élevé ou autres thèmes visuellement
- L'utilisateur dit « cela a-t-il l'air correct », « vérifiez la mise en page » ou « comparez avant et après »

## Quand NE PAS l'utiliser

- L'utilisateur a une suite de régression visuelle Percy/Chromatic/Playwright — exécutez-la à la place
- La vérification de la mise en page nécessiterait de naviguer sur des écrans sensibles (paiement, identifiants, données de santé)
- Vous n'avez pas de capture d'écran de référence à comparer et l'utilisateur ne peut pas en fournir une
- La vérification est purement fonctionnelle (le bouton fonctionne-t-il) plutôt que visuelle — utilisez la compétence ui-testing à la place

## Instructions

### Établir des références

L'assurance qualité visuelle nécessite un état de référence. Établissez des références avant le déploiement de toute modification :

1. Prenez une capture d'écran pleine page de chaque vue à vérifier.
2. Nommez les captures d'écran avec une convention cohérente : `[composant]-[état]-[point-d'arrêt]-avant.png`
   - Exemple : `nav-menu-open-1280px-avant.png`
3. Stockez ou notez la référence pour que la capture d'écran après puisse être comparée.

Si l'utilisateur ne peut pas fournir de capture d'écran avant, notez ceci et procédez avec un audit d'état unique (vérifier les problèmes de mise en page évidents sans comparaison de régression).

### Discipline des captures d'écran

- Capturez toujours le viewport complet, pas une région recadrée, sauf si la vérification est limitée à un composant spécifique.
- Capturez à la même position de défilement avant et après.
- Pour les vérifications réactives, redimensionnez le viewport au point d'arrêt cible avant de capturer :
  - Mobile : 375px de large
  - Tablette : 768px de large
  - Bureau : 1280px de large
  - Large : 1440px de large
- Désactivez les animations/transitions avant la capture si possible — une capture en milieu d'animation n'est pas utile.

### Que vérifier dans un audit visuel

Parcourez cette liste de contrôle pour chaque capture d'écran :

**Intégrité de la mise en page**
- [ ] Aucun élément ne dépasse son conteneur
- [ ] Aucun texte tronqué de manière inattendue (vérifier les en-têtes, étiquettes, copie de bouton)
- [ ] Pas de barre de défilement horizontal inattendue
- [ ] L'espacement (remplissage/marge) est cohérent avec les éléments adjacents
- [ ] L'alignement de la grille/flexbox est correct — pas d'éléments égarés

**Typographie**
- [ ] Les tailles de police sont correctes (les en-têtes visuellement plus grands que le corps, les étiquettes plus petites)
- [ ] La hauteur de ligne n'est pas réduite (les lignes de texte ne se chevauchent pas)
- [ ] Pas de texte invisible (texte blanc sur fond blanc, etc.)
- [ ] Les modifications du poids de la police (gras, moyen) s'affichent correctement

**Couleur et contraste**
- [ ] Les couleurs de la marque correspondent aux valeurs attendues (vérifier par rapport au système de conception si disponible)
- [ ] Les états interactifs (survol, focus, actif) visibles et corrects
- [ ] Pas de débordement de couleur involontaire depuis les éléments adjacents
- [ ] Mode sombre : tous les appairages de premier plan/arrière-plan lisibles

**Spécifique au composant**
- [ ] Les modales et superpositions centrés et assombrissant correctement l'arrière-plan
- [ ] Les listes déroulantes et info-bulles ne sont pas recadragées par les conteneurs overflow:hidden
- [ ] Les images se chargent (pas d'icônes d'image cassée)
- [ ] Les icônes s'affichent à la bonne taille et couleur
- [ ] Les entrées de formulaire alignées avec leurs étiquettes

### Comparaison avant et après

Lorsque les deux états sont disponibles :

1. Placez les captures d'écran avant et après côte à côte ou décrivez les différences explicitement.
2. Pour chaque différence visible, classez :
   - **Modification intentionnelle** — correspond à ce que le développeur a modifié (ignorer)
   - **Régression** — quelque chose qui était correct est maintenant cassé (signaler)
   - **Dérive non liée** — contenu d'écran différent (données modifiées, ignorer)
3. Signalez les régressions avec : nom du composant, ce qui a changé, gravité (cosmétique / fonctionnelle / critique).

Guide de gravité :
- **Cosmétique** : espacement mineur décalé de quelques pixels, pas d'impact utilisateur
- **Fonctionnelle** : bouton partiellement obscurci, texte illisible, élément interactif inaccessible
- **Critique** : mise en page de la page complètement cassée, CTA principal invisible ou inaccessible

### Règles de sécurité

- Ne naviguez pas vers un écran susceptible de déclencher des transactions financières, des modifications d'identifiants ou d'exposer des données de santé lors d'une vérification visuelle.
- Si la capture d'un écran affiche accidentellement des données sensibles, notez ceci et n'incluez pas la capture d'écran dans aucun rapport partagé en externe.
- Observation visuelle en lecture seule uniquement — ne cliquez pas sur les éléments interactifs à moins d'être explicitement demandé dans le cadre de l'étendue de l'AQ visuelle.

### Format de rapport

```
Rapport AQ Visuelle
Composant/Vue : [nom]
Points d'arrêt vérifiés : [liste]
Thèmes vérifiés : [clair / sombre / les deux]

Régressions trouvées : [n]

[1] [Nom du composant] — [Gravité]
    Avant : [description ou référence de capture]
    Après : [description ou référence de capture]
    Problème : [ce qui s'est cassé et pourquoi c'est important]

Notes cosmétiques (non bloquantes) :
- [liste des problèmes mineurs]

Vérifications passées : [liste de ce qui semblait correct]
```

## Exemple

**Scénario** : Un développeur a mis à jour le CSS de la barre de navigation. L'utilisateur souhaite une AQ visuelle avant de fusionner.

**Exécution** :

1. L'utilisateur fournit une capture d'écran avant : `navbar-desktop-avant.png` — montre nav avec logo à gauche, liens au centre, bouton CTA à droite.
2. Naviguez vers l'application au viewport de 1280px. Prenez une capture : `navbar-desktop-après.png`.
3. Comparez :
   - Position du logo : même. RÉUSSI.
   - Liens de navigation : maintenant poussés vers la droite et chevauchant le bouton CTA. RÉGRESSION.
   - Bouton CTA : partiellement caché derrière les liens de navigation. Gravité : Fonctionnelle.
4. Redimensionnez à 375px. Prenez une capture : `navbar-mobile-après.png`.
   - Icône hamburger : présente et visible. RÉUSSI.
   - État du menu fermé : semble correct. RÉUSSI.

**Rapport** :
```
Rapport AQ Visuelle
Composant/Vue : Barre de navigation globale
Points d'arrêt vérifiés : 1280px, 375px
Thèmes vérifiés : clair

Régressions trouvées : 1

[1] Liens de navigation — Fonctionnelle
    Avant : liens centrés entre le logo et le bouton CTA
    Après : liens débordant dans le bouton CTA, bouton 40% occulté
    Problème : Le CTA « Get Started » est partiellement inaccessible sur le bureau — action de conversion principale bloquée

Notes cosmétiques (non bloquantes) :
- Aucun

Vérifications passées :
- Icône hamburger mobile visible
- Position du logo inchangée
- État du menu fermé mobile correct
```

Le développeur doit corriger la propriété flex/grid causant le débordement des liens de navigation avant de fusionner.
