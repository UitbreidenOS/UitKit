---
name: doc-site-builder
description: "Architecture d'un site de documentation : hiérarchie de l'information, structure de navigation, modèles de contenu, stratégie de recherche"
---

# Compétence : Constructeur de site de documentation

## Quand activer
- Vous démarrez un nouveau site de documentation de zéro et avez besoin d'une architecture de l'information
- Vous migrez des docs d'un wiki (Notion, Confluence) ou de fichiers README vers un site de documentation dédié
- Un site de documentation existant a dépassé sa structure et a besoin d'une refonte de l'architecture de l'information
- Vous devez définir des modèles de contenu pour que plusieurs contributeurs produisent des pages cohérentes
- Vous planifiez un workflow docs-as-code où les ingénieurs et les rédacteurs collaborent dans le même dépôt

## Quand NE PAS utiliser
- Vous devez rédiger des pages de documentation individuelles — utilisez `/api-doc-writer` ou `/readme-generator` pour du contenu spécifique
- Vous choisissez une plateforme de docs (Docusaurus vs MkDocs vs Mintlify vs GitBook) — cette compétence couvre l'architecture, pas la sélection de plateforme ; prenez cette décision d'abord
- Vous souhaitez auditer la qualité de docs existantes — c'est une compétence structurelle et d'architecture, pas un outil d'audit
- Vous devez configurer le pipeline de build technique — cette compétence produit l'architecture ; l'implémentation est une tâche d'ingénierie

## Instructions

### Architecture complète d'un site de documentation

```
Conçois l'architecture de l'information pour un site de documentation.

## Contexte
Produit : [nom et description en 1 phrase]
Audience : [qui lit ces docs — utilisateurs finaux / développeurs / admins / les trois]
Types de docs nécessaires : [démarrage / référence API / guides pratiques / guides conceptuels / notes de version / dépannage / tout]
État actuel : [nouveau de zéro / migration depuis [source] / restructuration du site existant]
Volume de contenu : [nombre approximatif de pages — une estimation grossière suffit]
Équipe : [qui rédige : [N] rédacteurs techniques / les ingénieurs rédigent eux-mêmes / mixte]
Plateforme choisie : [Docusaurus / MkDocs / Mintlify / GitBook / Notion / personnalisé / pas encore choisi]

## Produire :

### 1. Vue d'ensemble de l'architecture de l'information
Structure de navigation de premier niveau avec justification pour chaque section :

```
/ (Accueil)
├── Démarrage/
│   ├── Introduction
│   ├── Démarrage rapide
│   └── Installation
├── Guides/
│   ├── [Sujet 1]
│   └── [Sujet 2]
├── Référence/
│   ├── Référence API
│   ├── Configuration
│   └── Référence CLI
├── Concepts/
│   └── [Explications des concepts fondamentaux]
└── Changelog/
```

Pour chaque section de premier niveau : expliquer l'intention utilisateur qu'elle sert et le contenu qu'elle contient.

### 2. Taxonomie du contenu
Définir les quatre types de contenu Diátaxis pour ce produit :

**Tutoriels** (axés sur l'apprentissage, expérience guidée) :
- Quand rédiger un tutoriel vs un guide pratique
- Modèle pour les tutoriels dans ce contexte produit
- Exemples de titres de tutoriels pour ce produit

**Guides pratiques** (axés sur les tâches, résolution de problèmes) :
- Quand rédiger un guide pratique vs un tutoriel
- Modèle pour les guides pratiques
- Exemples de titres de guides pratiques pour ce produit

**Référence** (axée sur l'information, consultation) :
- Ce qui appartient à la référence (endpoints API, clés de config, options CLI, modèles de données)
- Modèle pour les pages de référence
- Comment la référence est auto-générée vs rédigée manuellement pour ce produit

**Explication / Conceptuel** (axé sur la compréhension) :
- Quels concepts nécessitent des docs d'explication pour ce produit
- Modèle pour les pages conceptuelles
- Exemples de sujets conceptuels pour ce produit

### 3. Modèles de pages
Fournir des modèles à compléter pour :

**Modèle Démarrage / Démarrage rapide :**
```markdown
# Démarrage avec [Produit]

## Ce que vous allez construire
[1-2 phrases — le résultat que le lecteur atteint]

## Prérequis
- [prérequis 1]
- [prérequis 2]

## Étape 1 : [Première action]
[instruction]

```[langage]
[exemple de code]
```

Sortie attendue :
```
[ce qu'ils voient quand ça fonctionne]
```

## Étape 2 : [Action suivante]
[instruction]

## Ce qui vient de se passer
[Brève explication de ce que fait le code du démarrage rapide — construit le modèle mental]

## Prochaines étapes
- [Lien vers le prochain tutoriel]
- [Lien vers le guide pratique pertinent]
- [Lien vers la référence]
```

**Modèle de guide pratique :**
```markdown
# Comment [accomplir une tâche spécifique]

[Une phrase : pour qui c'est et ce que ça accomplit]

## Prérequis
- [Ce dont ils ont besoin avant de commencer]

## Étapes

### 1. [Première étape]
[instruction — voix impérative, deuxième personne]

```[langage]
[code]
```

### 2. [Deuxième étape]
[instruction]

## Dépannage
**[Problème courant] :** [Solution]
**[Message d'erreur courant] :** [Ce que ça signifie et comment le corriger]

## Voir aussi
- [Guide pratique souvent associé à celui-ci]
- [Page de référence pour la config/API principale utilisée ici]
```

**Modèle de page de référence :**
```markdown
# [Clé de configuration / Endpoint API / Nom de commande CLI]

[Une phrase décrivant ce que ça fait]

## Syntaxe / Signature
```
[syntaxe exacte]
```

## Paramètres / Options
| Paramètre | Type | Requis | Défaut | Description |
|---|---|---|---|---|
| `name` | string | Oui | — | [ce qu'il fait] |
| `timeout` | number | Non | 30 | [ce qu'il fait] |

## Exemple
```[langage]
[exemple minimal fonctionnel]
```

## Notes
[Cas limites, pièges, contraintes de version]

## Voir aussi
[Éléments de référence associés]
```

### 4. Règles de conception de la navigation
Principes pour la navigation de ce site de documentation :

- Profondeur maximale : [2 / 3 niveaux — choisir-en un ; plus profond est presque toujours pire]
- Barre latérale : [toujours visible / réduite sur mobile / délimitée par section]
- Fil d'Ariane : [oui / non — oui pour les hiérarchies profondes]
- Longueur de page : [longueur maximale recommandée et quand diviser en sous-pages]
- Versionnage : [le site a-t-il besoin de versionner les docs ? Stratégie pour comment faire]

### 5. Stratégie de recherche
- Outil de recherche : [Algolia DocSearch / plein texte intégré / pagefind / aucun]
- Optimisation de la recherche : quelles métadonnées ajouter à chaque page (titre, description, tags)
- Facettes / filtrage : l'audience a-t-elle besoin de filtrer par rôle, niveau de produit, ou version ?

### 6. Workflow des contributeurs
Comment les ingénieurs et les rédacteurs collaborent :

- Convention de nommage des fichiers : [kebab-case.md / sujet/sous-sujet.md]
- Processus de revue des PRs : [le rédacteur revoit toutes les PRs touchant les docs / l'ingénieur fusionne lui-même avec revue du rédacteur]
- Signal de fraîcheur : frontmatter last_updated sur chaque page
- Vérification des liens cassés : [étape CI — quel outil utiliser]
- Emplacement du guide de style : [lien ou intégré]

### 7. Liste de contrôle pour le lancement
- [ ] La page d'accueil a des chemins clairs vers les 3 intentions utilisateurs les plus courantes
- [ ] Chaque page a un titre, une description, et un last_updated
- [ ] Tous les exemples de code sont testés et exécutables
- [ ] La recherche est configurée et indexée
- [ ] La page 404 a une navigation utile vers le contenu
- [ ] Analytics configurées (vues de pages, requêtes de recherche, 404)
- [ ] Widget de feedback sur chaque page ("Cette page vous a-t-elle été utile ?")
- [ ] La vérification des liens cassés passe dans CI
```

### Classification du contenu Diátaxis

```
Classe ce contenu par type Diátaxis et dis-moi ce qui manque.

J'ai les pages de documentation suivantes (lister les titres et une description d'une ligne) :
[lister vos pages existantes]

Pour chaque page :
1. Classer comme : Tutoriel / Guide pratique / Référence / Explication / Flou / Mixte (signaler les mixtes comme un problème)
2. Signaler les pages qui sont de type "mixte" — elles doivent être séparées
3. Identifier quels quadrants Diátaxis ont des lacunes de contenu pour ce produit

Sortie d'analyse des lacunes :
| Type Diátaxis | Couverture | Sujets manquants |
|---|---|---|
| Tutoriel | Bonne / Mince / Aucune | [ce qui manque] |
| Guide pratique | Bonne / Mince / Aucune | [ce qui manque] |
| Référence | Bonne / Mince / Aucune | [ce qui manque] |
| Explication | Bonne / Mince / Aucune | [ce qui manque] |

Priorité recommandée : [quel type rédiger en plus en premier, et pourquoi]
```

### Interprétation des analytics du site de documentation

```
Interprète les analytics du site de documentation et fais remonter les problèmes de contenu.

Source d'analytics : [Google Analytics / Plausible / Posthog / personnalisé]

Données disponibles :
- Top 10 des pages par vues : [coller]
- Top 10 des requêtes de recherche : [coller]
- Pages avec le taux de sortie le plus élevé : [coller]
- Erreurs 404 (chemins cassés les plus fréquents) : [coller]

Analyser :
1. REQUÊTES DE RECHERCHE QUI NE TROUVENT RIEN : requêtes dans le log de recherche avec 0 résultats = lacune de contenu. Les lister.
2. PAGES À FORT TAUX DE SORTIE : les pages avec un très fort taux de sortie peuvent ne pas répondre à la question de l'utilisateur. Diagnostiquer les 3 premières.
3. PAGES MANQUANTES (404) : lister les chemins cassés — lesquels représentent du contenu réel qui devrait exister ?
4. PAGES SOUS-PERFORMANTES : pages qui devraient avoir beaucoup de trafic mais n'en ont pas. Qu'est-ce qui pourrait expliquer l'écart ?

Sortie : backlog de contenu priorisé basé sur les données analytics.
```

## Exemple

**Utilisateur :** Je construis des docs pour une bibliothèque d'intégration webhook orientée développeurs. Les utilisateurs sont des ingénieurs qui intègrent notre API. Je dois passer de 3 fichiers README à un site de documentation correct sur Docusaurus. Prévu : ~40 pages au total.

**Sortie (extrait) :**

```markdown
## Architecture de l'information : Docs de la bibliothèque Webhook

### Navigation de premier niveau

```
/ (Accueil)
├── Démarrage/
│   ├── Introduction (ce que fait la bibliothèque ; lecture de 2 minutes)
│   ├── Démarrage rapide (webhook fonctionnel en 5 minutes)
│   └── Installation (tous les gestionnaires de packages)
├── Guides/
│   ├── Recevoir des webhooks
│   ├── Valider les signatures
│   ├── Gérer les nouvelles tentatives et l'idempotence
│   ├── Tester les webhooks en local
│   └── Migrer depuis la gestion HTTP directe
├── Référence/
│   ├── Options du client
│   ├── Types d'événements
│   ├── Codes d'erreur
│   └── Changelog
└── Concepts/
    ├── Comment fonctionne la livraison de webhooks
    ├── Approfondissement de la vérification des signatures
    └── Garanties de nouvelle tentative et d'ordre
```

### Analyse des lacunes de contenu
Vos 3 fichiers README couvrent probablement : l'installation, l'utilisation de base, et quelques références API.

Manquant (haute priorité) :
- Tutoriel : "Recevoir votre premier webhook en 5 minutes" — c'est le point d'entrée pour tous les nouveaux utilisateurs
- Guide pratique : "Tester les webhooks en local avec ngrok ou Cloudflare Tunnel" — point de friction le plus courant pour les développeurs
- Concept : "Garanties de nouvelle tentative et d'ordre" — les ingénieurs en auront besoin avant de l'utiliser en production
- Référence : Catalogue des types d'événements — devrait être auto-généré depuis votre schéma, pas rédigé manuellement
```

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
