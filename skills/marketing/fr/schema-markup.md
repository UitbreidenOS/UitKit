---
name: schema-markup
description: "Schema.org données structurées : générer JSON-LD pour riches résultats, valider le balisage, choisir le bon type de schéma, implémenter sur les types de pages communs"
---

# Compétence Balisage de Schéma

## Quand l'activer
- Ajouter des données structurées pour améliorer les résultats enrichis dans Google Search
- Générer JSON-LD pour articles, produits, FAQ, how-tos, avis, entreprises locales
- Valider le balisage de schéma avant le déploiement
- Choisir le bon type de schéma pour une page
- Déboguer pourquoi les résultats enrichis n'apparaissent pas

## Quand ne pas l'utiliser
- Le schéma seul ne vous classera pas — il améliore le contenu existant
- Faux avis ou données trompeuses — Google pénalisera
- Pour chaque page de votre site — priorisez les pages de valeur élevée en premier

## Instructions

### Choisir le bon type de schéma

```
Quel balisage de schéma dois-je utiliser pour cette page ?

Type de page/contenu : [décrivez ce que la page contient]
Objectif : [résultats enrichis / panneau de connaissance / pack local / recherche vocale]

Types de schéma communs :
- Article / BlogPosting : actualités, billets de blog, contenu éditorial
- Product : pages de produits e-commerce avec prix, disponibilité, avis
- LocalBusiness : emplacements physiques (comprend heures, adresse)
- FAQPage : pages avec sections Q&A (apparaît comme extensible dans les SERP)
- HowTo : instructions étape par étape
- Recipe : contenu culinaire avec ingrédients, étapes, nutrition
- Event : conférences, concerts, webinaires
- JobPosting : offres d'emploi
- Course : contenu d'apprentissage en ligne
- SoftwareApplication : applications et outils logiciels
- Review / AggregateRating : avis d'utilisateurs ou d'experts
- BreadcrumbList : hiérarchie de navigation du site
- Organization : informations sur l'entreprise, profils sociaux
- Person : auteur, orateur, profils professionnels

Quels types s'appliquent ? Plusieurs types peuvent-ils être combinés ?
```

### Générer JSON-LD (prêt à coller)

**Article / Billet de Blog :**
```
Générer le schéma Article pour :
Titre : [titre]
Auteur : [nom, URL]
Publié : [date]
Modifié : [date]
Image : [URL]
Éditeur : [nom de l'entreprise, URL du logo]
URL : [URL de la page]
Description : [méta-description]
```

**LocalBusiness :**
```
Générer le schéma LocalBusiness pour :
Nom de l'entreprise : [nom]
Type : [Restaurant / ClinicMédical / ServiceJuridique / Magasin / etc.]
Adresse : [adresse complète]
Téléphone : [numéro]
Site Web : [URL]
Heures : [lun-ven 9-17, sam 10-15, etc.]
Gamme de prix : [$ / $$ / $$$]
Latitude/Longitude : [si connu]
```

**FAQPage :**
```
Générer le schéma FAQPage pour ces Q&A :
Q1 : [question]
A1 : [réponse]
Q2 : [question]
A2 : [réponse]
[ajouter autant que nécessaire — 5-10 est idéal]
URL de la page : [URL]
```

**Product :**
```
Générer le schéma Product pour :
Nom : [nom du produit]
Description : [description]
Image : [URL]
Marque : [nom de la marque]
SKU : [SKU si disponible]
Prix : [montant]
Devise : [USD/GBP/EUR]
Disponibilité : InStock / OutOfStock / PreOrder
Évaluation : [score moyen] de [nombre] avis
```

**HowTo :**
```
Générer le schéma HowTo pour ce tutoriel :
Titre : [how-to titre]
Description : [ce que cela enseigne]
Temps total : [PT30M = 30 minutes]
Étapes :
1. [nom de l'étape] — [description de l'étape]
2. [nom de l'étape] — [description de l'étape]
[continuer pour toutes les étapes]
```

### Valider et déboguer

```
Valider ce balisage de schéma :

[coller le code JSON-LD]

Vérifier :
1. Syntaxe JSON valide ?
2. Champs obligatoires présents pour ce type de schéma ?
3. Champs recommandés manquants (qui activeraient les résultats enrichis) ?
4. Propriétés dépréciées ?
5. URL de test : https://search.google.com/test/rich-results

Aussi vérifier : ce type de schéma est-il éligible pour les résultats enrichis ?
(Tous les types de schéma ne génèrent pas d'améliorations visuelles — certains aident juste à comprendre)
```

### Implémentation sur les types de pages

```
Créer un plan d'implémentation du balisage de schéma pour mon site.

Type de site : [blog / e-commerce / entreprise locale / SaaS / marketplace]
Types de pages principaux : [listez : accueil, pages produits, billets de blog, pages de catégorie, etc.]

Pour chaque type de page :
1. Type(s) de schéma recommandé(s)
2. Champs de données à inclure
3. Quels champs sont dynamiques (CMS/DB) vs statiques
4. Priorité : [élevée — éligible résultat enrichi / moyen / basse]
5. Méthode d'implémentation : [en-tête HTML / plugin CMS / via GTM / server-rendered]

Résultat : checklist d'implémentation ordonnée par priorité.
```

## Exemple

**Utilisateur :** J'ai un blog d'avis SaaS. Chaque article révise un outil. Je veux des extraits enrichis dans Google.

**Claude génère :**

Pour un article d'avis, utiliser `SoftwareApplication` + `Review` combinés :

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Notion",
  "applicationCategory": "ProductivityApplication",
  "operatingSystem": "Web, iOS, Android, macOS, Windows",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free tier available"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.6",
    "reviewCount": "1",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": {
    "@type": "Review",
    "author": { "@type": "Person", "name": "Your Name" },
    "datePublished": "2026-05-20",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "4.6",
      "bestRating": "5"
    },
    "reviewBody": "First sentence of your review summary..."
  }
}
```

Éligibilité résultat enrichi : ✅ Extraits enrichis de produit (évaluations en étoiles dans SERP)

---
