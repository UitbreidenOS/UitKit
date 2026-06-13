---
name: programmatic-seo
description: "SEO programmatique : construire des modèles de landing pages à l'échelle, identifier les sources de données, concevoir les structures URL, éviter les pénalités de contenu mince"
---

# Compétence SEO Programmatique

## Quand l'activer
- Créer des centaines ou des milliers de pages de localisation/catégorie/comparaison
- Construire une stratégie de contenu basée sur la base de données (p.ex. pages "[Ville] + [Service]")
- Mettre à l'échelle la production de contenu avec des modèles et des flux de données
- Auditer les pages SEO programmatiques existantes pour les problèmes de qualité
- Planifier une stratégie SEO programmatique avant la mise en œuvre

## Quand ne pas l'utiliser
- Sites avec moins de 100 pages potentielles — le SEO manuel est meilleur
- Quand vous n'avez pas une véritable source de données — le spam de modèle pur est pénalisé
- Quand l'intention de l'utilisateur est trop étroite pour justifier l'échelle

## Instructions

### Identifier les opportunités de SEO programmatique

```
Identifier les opportunités de SEO programmatique pour mon entreprise.

Type d'entreprise : [décrivez]
Site actuel : [URL ou description]
Produits/services : [liste]

Motifs programmatiques courants :
1. Pages de localisation : "[Service] dans [Ville]" — fonctionne pour les entreprises locales, places de marché, B2B
2. Catégorie × modificateur : "[Catégorie] pour [Audience/Cas d'usage]"
3. Pages de comparaison : "[Outil A] vs [Outil B]" — fonctionne pour SaaS, outils
4. Pages d'intégration : "[Produit] + [Intégration]" — style Zapier
5. Pages de modèles : "[Rôle] modèle de CV", "[Industrie] modèle de facture"
6. Pages de données : "statistiques [Ville] [Métrique]", "rapport [Année] [Industrie]"

Quels motifs s'appliquent à mon entreprise ?
Estimez : combien de pages cela pourrait-il générer ?
Quelle source de données alimenterait chaque ?
```

### Concevoir la structure du modèle

```
Concevoir un modèle SEO programmatique pour [type de page].

Exemple d'URL : /[city]/[service] (ex. /london/web-design)
Requête cible : "[service] dans [city]"
Données que j'ai : [lister les champs — nom de la ville, population, statistiques locales, etc.]

Sections du modèle :
1. H1 : [formule — ex. "Web Design dans {{city}}"]
2. Paragraphe d'introduction (unique par ville — qu'est-ce qui varie ?)
3. Proposition de valeur principale (statique — identique sur toutes les pages)
4. Différenciation locale (qu'est-ce qui rend la ville/catégorie unique ?)
5. Témoignages/études de cas (filtrer par localisation si disponible)
6. FAQ (mélange de questions statiques + dynamiques spécifiques à la ville)
7. CTA

Stratégie d'unicité : qu'est-ce qui diffère entre les pages pour éviter le contenu mince ?
Seuil de contenu minimum : combien de mots de contenu vraiment unique par page ?
```

### Planification de l'architecture des données

```
Planifier l'architecture des données pour SEO programmatique.

Type de page : [décrivez]
Échelle : [X] pages prévues

Sources de données à considérer :
- Données internes (vos données de produit, données clients, transactions)
- Ensembles de données publiques (Census, Wikipedia, données ouvertes gouvernementales)
- Sources API (Google Places, Yelp, Météo, etc.)
- Données grattées/agrégées (listes de répertoires, tableaux d'emploi)
- Contenu généré par les utilisateurs (avis, Q&A)

Pour mon cas d'usage :
1. Quelles données rendent chaque page vraiment unique ?
2. Où je obtiens ces données ?
3. Comment les maintenir à jour ? (génération statique vs dynamique)
4. Quel est le minimum de données par page pour éviter le contenu mince ?

Résultat : plan d'architecture de données avec champs par modèle de page.
```

### Audit de contenu mince

```
Auditer ces pages programmatiques pour le risque de contenu mince.

Exemples de pages : [collez 3-5 URLs ou décrivez le modèle]
Problème observé : [faible trafic, action manuelle, mauvais classements]

Vérifier :
1. Ratio de contenu unique : quel % de chaque page est unique vs modèle ?
2. Valeur pour l'utilisateur : cette page répond-elle mieux à la requête que la recherche Google ?
3. Duplication : les pages sont-elles trop similaires entre elles ?
4. Signaux auto-générés : semble-t-il écrit pour les moteurs de recherche, pas les humains ?
5. Données d'engagement : taux de rebond, temps sur page (si disponible)

Recommandations : consolider / améliorer / supprimer / noindex.
```

### URL et architecture du site

```
Concevoir la structure URL et les liens internes pour SEO programmatique à l'échelle.

Type de page : [pages de localisation/catégorie/comparaison]
Échelle : [X] pages

Options de structure URL :
- Plate : /[city]-[service] (simple, perd la hiérarchie des catégories)
- Imbriquée : /[service]/[city] (meilleur pour la hiérarchie à facettes)
- Hybride : /[category]/[modifier]-[location]

Stratégie de lien interne :
1. Pages de hub : pages au niveau de la catégorie qui lient à toutes les variantes de localisation
2. Breadcrumbs : montrer la hiérarchie pour l'utilisateur et les crawlers
3. Pages associées : même ville, services différents / même service, villes proches
4. Pagination vs défilement infini vs "charger plus"
5. Segmentation du sitemap XML (sitemap séparé pour pages programmatiques)

Concevoir l'architecture pour [X] pages.
```

## Exemple

**Utilisateur :** Je gère une marketplace de freelancers. Je veux construire des pages "[Compétence] freelancers à [Ville]". J'ai 50 compétences et 200 villes = 10 000 pages. Comment faire sans être pénalisé ?

**Plan de Claude :**

**Stratégie d'unicité des données :**
- Population de la ville + industries notables (Census + API Wikipedia)
- Taux moyens pour la compétence dans cette ville (à partir de vos propres données de marketplace)
- Nombre de freelancers vérifiés sur votre plateforme dans ce combo ville/compétence
- Freelancers vedettes (dynamique, à partir de votre DB)
- Projets récents complétés dans cette ville (à partir de vos données de transaction)

**Seuil de contenu mince :** Chaque page a besoin ≥ 3 points de données vraiment uniques (données de taux + nombre de freelancers + profils en vedette). Les pages avec < 3 freelancers devraient être noindexées jusqu'à remplissage.

**Séquence de lancement :** Commencez par les 20 villes principales × les 50 compétences (1 000 pages). Validez l'indexation et la performance avant d'étendre aux 200 villes.

**Modèle H1 :** "Trouver des freelancers [Compétence] à [Ville] — [X] Professionnels Vérifiés"

---
