---
name: competitor-monitor
description: "Intelligence concurrentielle hebdomadaire : suivi des changements de prix, de positionnement, des nouvelles et des offres d'emploi comme signaux — synthétisé en un résumé d'une page"
---

# Competitor Monitor

## When to activate
- Vous menez un examen concurrentiel hebdomadaire ou bi-hebdomadaire et vous voulez transformer les résultats bruts en signaux clairs
- Un concurrent vient de faire une grande annonce et vous avez besoin de comprendre ce que cela signifie pour votre entreprise
- Vous préparez un changement de prix et vous voulez savoir comment vous êtes positionné avant de vous déplacer
- Vous perdez des contrats et soupçonnez qu'un concurrent spécifique en est la raison

## When NOT to use
- Recherche concurrentielle approfondie pour un document de financement — cela nécessite une recherche de marché professionnelle
- Suivi juridique ou de la PI — utilisez un spécialiste pour la surveillance des marques/brevets
- Suivi automatisé en temps réel — cette compétence nécessite que vous fassiez le contrôle hebdomadaire ; elle synthétise ce que vous trouvez, elle n'efface pas automatiquement

## Instructions

### Set up your competitor list

Gardez-le à 3-5 concurrents. Plus que cela produit du bruit, pas du signal. Pour chacun, donnez à Claude :
- Leur nom et site Web
- Leur produit ou service principal et son chevauchement avec le vôtre
- Leur tarification publique (si disponible) — noms de niveaux, points de prix, ce que chaque niveau inclut
- Ce pour quoi ils sont connus — leur principal différenciateur ou angle marketing
- Toute nouvelle récente que vous connaissez déjà à leur sujet

Faites ceci une fois. Enregistrez-le comme bloc de contexte concurrent et collez-le au début de chaque session hebdomadaire.

### Build your weekly checklist

Demandez à Claude de générer une liste de contrôle hebdomadaire de 15-20 minutes pour votre ensemble de concurrents spécifique. Claude l'adapte à votre industrie — une liste de vérification des concurrents SaaS diffère d'une liste de vérification des concurrents de restaurant.

La liste de contrôle standard couvre : page de tarification (quelque chose a-t-il changé ?), journal ou blog des produits (nouvelles fonctionnalités ou mises à jour ?), tableau d'emplois (quels rôles embauchent-ils ?), sites d'avis (nouveaux avis, tendance de notation ?), LinkedIn et actualités (annonces ?), et vos propres données de ventes (y a-t-il un contrat perdu qui cite ce concurrent ?).

Vous faites la vérification. Cela prend 5 minutes par concurrent. Puis vous collez les résultats.

### Weekly digest

Collez vos résultats de la liste de contrôle. Claude les synthétise en un résumé structuré d'une page :

**Ce qui a changé cette semaine** — résumé factuel de toute différence par rapport à la semaine dernière

**Ce que cela signale** — Claude interprète chaque changement. Une baisse de prix pourrait signaler qu'ils sont sous pression, pas qu'ils gagnent. Une vague d'embauches dans une fonction signale où ils investissent ensuite. Les nouvelles critiques négatives signalent les problèmes de support ou de qualité que vous pouvez utiliser dans les conversations de vente.

**Action recommandée** — une chose concrète que vous devriez faire, le cas échéant. Souvent, la réponse est « surveiller — aucune action nécessaire pour l'instant. » Claude ne fabrique pas l'urgence.

### Job posting signals

Les offres d'emploi sont l'un des signaux publics les plus fiables pour la stratégie des concurrents. Claude lit les offres d'emploi et vous dit ce qu'elles signifient :

- Embauches d'ingénierie dans un domaine spécifique : ils construisent une fonctionnalité qu'ils n'ont pas encore
- Embauches commerciales dans une région spécifique : ils s'y développent
- Embauches de succès client : ils grandissent ou churning — dépend du contexte
- Remplacement de la suite C : instabilité du leadership
- Embauches de données et d'analyse : ils sont sur le point de prendre des décisions plus basées sur les données, possiblement liées aux prix

Collez le titre et la description de l'offre d'emploi. Claude l'interprète dans le contexte de ce que vous savez déjà sur eux.

### Pricing change response

Si un concurrent baisse son prix, dites à Claude :
- Le changement (ancien prix, nouveau prix, quel niveau)
- Votre tarification actuelle par rapport à la leur
- Votre situation victoire/perte dans les contrats récents

Claude rédige des points de discussion pour vos conversations de vente — pas une réaction de panique, mais une réponse calme et factuelle à la question « pourquoi êtes-vous $50 plus cher ? » qui souligne les choses spécifiques que vous faites mieux.

### Lost deal debrief

Après avoir perdu un contrat face à un concurrent, dites à Claude :
- Ce que le client a dit être la raison
- Ce que vous savez sur le pitch de votre concurrent
- La taille du contrat et le profil client

Claude identifie si c'est un modèle ou une exception et suggère si une réponse de prix, messaging ou produit est garantie.

---

### Prompt template

```
Voici mon contexte concurrent (mettez à jour mensuellement) :

Concurrent A : [nom]
- Site Web : [url]
- Produit principal : [description]
- Tarification : [niveaux et prix]
- Connu pour : [différenciateur]

[répéter pour chaque concurrent]

---

Les résultats de cette semaine :

Concurrent A :
- [Ce que j'ai trouvé sur leur page de tarification]
- [Ce que j'ai trouvé sur leur tableau d'emplois]
- [Toute nouvelle ou annonce]
- [Nouveaux avis ou changements de notation]

Concurrent B :
- [résultats]

S'il vous plaît, donnez-moi :
1. Ce qui a changé cette semaine (factuel)
2. Ce que chaque changement signale
3. Une action recommandée, le cas échéant
```

## Example

Vous gérez une société de logiciels de planification B2B. Vous collez vos résultats hebdomadaires :

- Le concurrent A a réduit son plan Starter de $79 à $49 par mois
- Le concurrent B a posté trois rôles « Ingénierie des données » sur LinkedIn cette semaine
- Le concurrent C a reçu 4 nouveaux avis de 1 étoile cette semaine, tous citant des temps de réponse du support lents

Claude produit :

Ce qui a changé : Le concurrent A a réduit la tarification de niveau de départ de 38 %. Le concurrent B construit activement l'infrastructure de données interne. Le concurrent C a un problème visible de qualité de support cette semaine (4 nouveaux avis 1 étoile en 7 jours sont inhabituellement concentrés).

Ce qu'il signale : La baisse de prix du concurrent A reflète probablement la pression sur ses chiffres d'acquisition d'entrée de gamme, pas la force — les entreprises avec des revenus croissants augmentent généralement les prix ou les maintiennent. C'est une opportunité de repositionner votre tarification comme premium avec intégration plus rapide. Le concurrent B qui construit l'ingénierie des données interne suggère qu'il se déplace vers la réduction d'une dépendance d'intégration tierce — vaut la peine de surveiller quelle intégration ils remplacent. Le cluster de support du concurrent C est un atout de vente : mentionnez votre SLA et temps de réponse moyen dans vos trois prochaines propositions.

Action recommandée : Mettez à jour votre feuille de vente unique pour ajouter une comparaison des temps de réponse. Si un prospect cite le nouveau prix $49 du concurrent A, utilisez ce script : « Leur plan de démarrage à $49 inclut [X limitation]. Notre plan de base à $89 comprend [Y et Z] et un appel d'intégration dédié — la plupart des clients récupèrent cette différence de $40 dans la première semaine. »

---
