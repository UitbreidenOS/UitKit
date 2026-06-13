---
name: seo-audit
description: "Audit SEO : problèmes techniques, facteurs on-page, profil de backlinks, Core Web Vitals, données structurées, liste de corrections hiérarchisée avec impact estimé sur le trafic"
---

# Compétence Audit SEO

## Quand l'activer
- Réaliser un audit SEO complet d'un site web
- Enquêter sur la baisse du trafic organique
- Identifier les problèmes de SEO technique bloquant l'exploration ou l'indexation
- Auditer la stratégie SEO d'un concurrent
- Hiérarchiser les corrections SEO selon l'impact estimé sur le trafic

## Quand ne pas l'utiliser
- Suivi de classement en temps réel — utiliser Ahrefs, SEMrush ou Google Search Console
- Exécution de création de liens — nécessite des outils d'outreach
- Recherche payante (Google Ads) — canal entièrement différent

## Instructions

### Audit technique SEO

```
Réaliser un audit technique SEO. Fournir :

URL du site : [URL]
Outils disponibles : [Google Search Console / Screaming Frog / Ahrefs / SEMrush / PageSpeed Insights]

Vérifier ces facteurs techniques :

EXPLORATION & INDEXATION
- Le site est-il indexable ? Vérifier robots.txt et balises meta robots
- Y a-t-il des balises noindex bloquant les pages importantes ?
- Plan du site XML : présent, soumis à GSC, erreurs ?
- Erreurs d'exploration dans Google Search Console ?
- Balises canoniques : correctes, aucun problème d'auto-référence ?

PERFORMANCE TECHNIQUE
- Core Web Vitals (LCP, FID/INP, CLS) : approuvé/échoué ?
- Vitesse des pages : scores mobile et desktop (PageSpeed Insights)
- Compatible mobile : réussit le test d'utilisabilité mobile de Google ?
- HTTPS : toutes les pages, pas de contenu mixte ?

STRUCTURE DU SITE
- Structure URL : propre, descriptive, pas de paramètres en double ?
- Liens internes : pages orphelines ? Pages profondes (> 3 clics depuis l'accueil) ?
- Pagination : rel prev/next ou utilisation de canonique ?
- Architecture du site : catégories logiques, breadcrumbs appropriés ?

Pour chaque problème trouvé :
- Gravité : Critique / Élevée / Moyenne / Basse
- Impact estimé sur le trafic
- Recommandation de correction
- Effort d'implémentation : Facile / Moyen / Difficile
```

### Audit SEO on-page

```
Auditer le SEO on-page pour [URL ou type de page] :

CONTENU
- Balises title : uniques, moins de 60 caractères, contiennent le mot-clé principal ?
- Méta-descriptions : attrayantes, moins de 160 caractères, uniques ?
- H1 : une par page, contient le mot-clé ?
- Structure des en-têtes : hiérarchie logique H1→H2→H3 ?
- Profondeur du contenu : couvre le sujet complètement vs pages classées au top ?
- Utilisation de mots-clés : naturelle, pas de bourrage, termes LSI inclus ?
- Fraîcheur du contenu : date de mise à jour, contenu obsolète ?

MÉDIAS
- Images : texte alt présent, descriptif, pas de bourrage de mots-clés ?
- Tailles des fichiers image : compressées pour la performance ?
- Vidéos : transcriptions, balisage de schéma ?

DONNÉES STRUCTURÉES
- Balisage de schéma présent ? (Article, Product, FAQ, How-to, Review, LocalBusiness)
- Valide selon le Rich Results Test de Google ?
- Opportunités de schéma manquantes ?

Fournir une liste de corrections hiérarchisée.
```

### Analyse SEO des concurrents

```
Analyser [URL concurrent] vs mon site [mon URL] :

ÉCART DE MOTS-CLÉS
- Quels mots-clés classent-ils et pas moi ?
- Quel est leur trafic organique estimé ?
- Quelles sont leurs pages principales générant le plus de trafic ?

ÉCART DE CONTENU
- Quel contenu ont-ils que je n'ai pas ?
- Quels sujets dans notre secteur maîtrisent-ils ?

ÉCART DE BACKLINKS
- Comparaison de l'autorité du domaine
- Combien de domaines référents ont-ils vs moi ?
- Leurs meilleures sources de backlinks (pour la recherche d'outreach)

Hiérarchiser : quels écarts puis-je combler en 90 jours ?
```

### Priorités de correction Core Web Vitals

```
Mes scores Core Web Vitals :
- LCP (Largest Contentful Paint) : [Xs] — cible < 2,5s
- INP (Interaction to Next Paint) : [Xms] — cible < 200ms
- CLS (Cumulative Layout Shift) : [X] — cible < 0,1

Stack technologique du site : [Next.js / WordPress / Shopify / autre]

Pour chaque métrique en échec :
1. Quelle est la cause la plus probable sur ma stack ?
2. Quels sont les 3 meilleurs correctifs à implémenter en premier ?
3. Amélioration estimée de chaque correction ?
```

### Rapport d'audit SEO

```
Générer un résumé exécutif d'audit SEO pour [site].

Résultats d'audit : [coller les problèmes clés trouvés]

Format :
1. Score de santé SEO global (1-10) avec justification
2. Problèmes critiques (doivent être corrigés — bloquent le trafic ou l'indexation)
3. Opportunités de haute priorité (gains de trafic estimés les plus importants)
4. Quick wins (faciles à implémenter, impact immédiat)
5. Feuille de route SEO 90 jours avec priorités
```

## Exemple

**Utilisateur :** Le trafic de mon blog a baissé de 40 % après la mise à jour principale de Google en mars 2026. Réaliser un audit.

**Framework d'audit de Claude :**
1. Vérifier Google Search Console pour les actions manuelles ou les problèmes de couverture
2. Identifier les pages ayant perdu les classements (rapport de changement de position)
3. Vérifier si les pages perdues ont un contenu mince, de faibles signaux E-E-A-T ou du contenu dupliqué
4. Analyser les pages les plus performantes qui ont survécu — qu'ont-elles que les pages perdues n'ont pas ?
5. Réviser l'ensemble du site : texte d'ancrage trop optimisé pour le SEO ? Contenu d'affiliation mince ? Contenu généré par IA sans signaux d'expertise humaine ?
6. Générer une liste de corrections hiérarchisée avec calendrier de récupération estimé par catégorie de correction

---
