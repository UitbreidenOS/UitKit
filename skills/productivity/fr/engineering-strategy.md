---
name: engineering-strategy
description: "Document de stratégie d'ingénierie : vision technique, décisions build vs buy, topologie des équipes, feuille de route sur 12 mois"
---

# Compétence : Stratégie d'ingénierie

## Quand activer
- Rédiger le document de stratégie d'ingénierie pour un nouveau rôle de CTO ou au début d'un cycle de planification
- Présenter la direction de l'ingénierie au conseil d'administration, au CEO, ou aux investisseurs
- Décider s'il faut construire, acheter, ou s'associer pour une capacité technique majeure
- Reconcevoir la topologie des équipes après une croissance significative, une réorganisation, ou un pivot produit
- Définir une feuille de route sur 12 mois équilibrant la livraison produit avec la santé de la plateforme
- Documenter la vision technique après des décisions architecturales majeures

## Quand NE PAS utiliser
- Décisions d'architecture individuelles — utilisez `/adr-writer` pour celles-ci
- Planification au niveau du sprint — utilisez votre outil de gestion de projet
- Recrutement de postes individuels — utilisez une fiche de poste et un référentiel d'évaluation à la place
- Revues post-incident — c'est un artefact opérationnel spécifique, pas un document de stratégie

## Instructions

### Document de stratégie d'ingénierie complet

```
Rédige un document de stratégie d'ingénierie pour [ENTREPRISE].

Contexte :
- Stade de l'entreprise : [amorçage / série A / série B / croissance / enterprise]
- Taille actuelle de l'équipe d'ingénierie : [X ingénieurs]
- Architecture actuelle : [monolithe / microservices / serverless / hybride]
- Stack technique principal : [langages, frameworks, fournisseur cloud]
- Principale douleur technique actuelle : [ex. vélocité de déploiement, fiabilité, mise à l'échelle, dette technique]
- Contexte business : [ce que l'entreprise cherche à accomplir dans les 12 prochains mois]
- Top 3 des priorités produit du CEO/CPO : [les lister]

Produire un document de stratégie couvrant :

## 1. Vision de l'ingénierie (12 mois)
Un paragraphe : à quoi ressemble notre organisation d'ingénierie dans 12 mois ?
Aborder spécifiquement :
- Fréquence de déploiement (cible)
- Fiabilité du système (cible de disponibilité / taux d'erreur)
- Structure des équipes (combien d'équipes, quel modèle)
- Expérience développeur (à quelle vitesse un nouvel ingénieur peut-il livrer sa première fonctionnalité ?)

## 2. Évaluation de l'état actuel
Diagnostic honnête — ce qui fonctionne, ce qui est cassé :
- Architecture : [état actuel et principales limitations]
- Dette technique : [quantifier si possible — % du temps de dev perdu]
- Vélocité de déploiement : [déploiements actuels par jour ou par semaine]
- Fiabilité : [disponibilité actuelle, taux d'incident]
- Structure des équipes : [topologie actuelle et où elle se dégrade]

## 3. Priorités stratégiques (classées)
Top 3-5 paris d'ingénierie pour les 12 prochains mois.
Pour chaque priorité :
- Ce que c'est
- Pourquoi ça compte (impact business, pas élégance technique)
- À quoi ressemble le succès (mesurable)
- Investissement approximatif requis (semaines d'ingénierie / effectifs)

## 4. Build vs. Buy vs. Partner
Pour chaque capacité technique majeure dont nous avons besoin :
| Capacité | Construire | Acheter | S'associer | Recommandation | Justification |
Critères à utiliser :
- Différenciateur fondamental ? → Construire
- Problème résolu/commodity ? → Acheter
- Besoin de portée/réseau ? → S'associer
- Time-to-market critique ? → Pencher vers Acheter

## 5. Topologie des équipes
Structure actuelle → cible sur 12 mois.
Modèles d'équipes à choisir :
- Équipes alignées sur le flux (ownership des fonctionnalités produit)
- Équipes plateforme/enablement (expérience développeur, infra)
- Équipes sous-système complexe (ML, recherche, pipeline de données)
Utiliser le vocabulaire Team Topologies : alignée sur le flux, plateforme, enablement, sous-système complexe.
Pour chaque équipe : mission, taille, ownership technique, interfaces avec les autres équipes.

## 6. Paris technologiques
Sur quoi nous nous engageons pour les 2-3 prochaines années ?
- Langages et frameworks principaux (sur quoi nous nous standardisons)
- Fournisseur cloud et services managés clés
- Ce dont nous nous éloignons (plan de dépréciation)
- Ce que nous observons mais sur quoi nous ne nous engageons pas encore

## 7. Métriques de santé de l'ingénierie
Comment saurons-nous si la stratégie fonctionne ?
| Métrique | Actuel | Cible 6 mois | Cible 12 mois |
Inclure : métriques DORA (fréquence de déploiement, lead time, MTTR, taux d'échec des changements), disponibilité, NPS développeur, ratio de dette technique.

## 8. Risques et mitigations
Top 3 risques pour cette stratégie :
- Risque, probabilité, impact, mitigation

## 9. Demande d'investissement
De quoi avons-nous besoin pour exécuter cette stratégie ?
- Effectifs : [X ingénieurs à recruter dans les 12 prochains mois]
- Budget outillage : [X € pour les décisions build-vs-buy]
- Infrastructure : [changement de coût infra prévu]
```

### Cadre de décision Build vs. Buy

```
Aide-moi à décider s'il faut construire ou acheter [CAPACITÉ].

Description de la capacité : [ce dont nous avons besoin]
Notre approche actuelle : [comment nous gérons ça aujourd'hui, le cas échéant]
Pression sur le calendrier : [quand nous en avons besoin]
Coût d'ingénierie pour construire : [estimation en semaines-ingénieur, ou demander à Claude d'estimer]
Options d'achat identifiées : [noms de fournisseurs, tarification si connu]
Expertise de notre équipe dans ce domaine : [forte / faible / aucune]

Évaluer selon ces critères :

1. Test du différenciateur fondamental
Cette capacité fait-elle partie de notre proposition de valeur unique ?
- OUI → Fort signal pour construire (la posséder = avantage concurrentiel)
- NON → Fort signal pour acheter (c'est de l'infrastructure commodity)

2. Complexité vs. expertise
- Forte complexité + faible expertise de l'équipe → Acheter (le risque de construction est élevé)
- Forte complexité + forte expertise de l'équipe → Construire (si différenciée)
- Faible complexité + toute expertise → Construire (sauf si l'off-the-shelf est trivial)

3. Time-to-market
- Besoin en < 3 mois → Acheter gagne presque toujours
- 3-12 mois → dépend de l'importance stratégique
- 12+ mois → construire si différenciant

4. Coût total de possession (horizon 3 ans)
Construire : coût d'ingénierie + overhead de maintenance + coût d'opportunité
Acheter : frais de licence + intégration + prime de lock-in

5. Risque fournisseur
- Fournisseur startup : risque de lock-in, risque d'acquisition
- Fournisseur établi : risque de pouvoir de tarification, risque de roadmap lente
- Open source : charge de maintenance, risque communautaire

Sortie :
- Recommandation : Construire / Acheter / Hybride / Reporter
- 3 raisons les plus fortes pour la recommandation
- Ce qui changerait votre avis
- Si Acheter : shortlist de fournisseurs et prochaine étape
- Si Construire : architecture approximative et affectation d'équipe
```

### Conception de la topologie des équipes

```
Conçois la topologie des équipes pour notre organisation d'ingénierie.

État actuel :
- Total d'ingénieurs : [X]
- Équipes actuelles : [les lister et ce qu'elles font]
- Principaux problèmes de coordination : [où les handoffs se cassent ou ralentissent les choses ?]
- Zones produit : [lister les domaines produit majeurs]
- Maturité plateforme/infra : [forte / faible / inexistante]

État cible :
- Ingénieurs dans 12 mois : [X (plan d'embauche inclus)]
- Priorité business principale : [livrer des fonctionnalités produit / mettre à l'échelle l'infrastructure / réduire les incidents]

Concevoir la topologie cible en utilisant ces types d'équipes :
1. Équipes alignées sur le flux : possèdent un domaine produit de bout en bout, flux rapide, autonomes
2. Équipe plateforme : produit interne — CI/CD, observabilité, outillage développeur, infra
3. Équipe enablement : temporaire, accompagne les autres équipes dans les transitions (migration, nouvelle technologie)
4. Équipe sous-système complexe : expertise approfondie requise — ML, recherche, traitement des paiements

Pour chaque équipe dans la conception cible :
- Nom et mission de l'équipe
- Taille de l'équipe (cible et intermédiaire)
- Ce qu'elles possèdent (services, fonctionnalités, infra)
- De quoi elles dépendent (de l'équipe plateforme ou externe)
- Comment elles interagissent avec les équipes adjacentes (API, service partagé, consultation)
- Métrique de succès pour cette équipe

Modes d'interaction entre équipes :
- Collaboration : travail étroit, communication fréquente (temporaire, pour les transitions)
- X-as-a-Service : relation consommateur/fournisseur avec interface définie
- Facilitation : une équipe aide une autre à développer une capacité (limité dans le temps)

Sortie : organigramme + chartes d'équipe + diagramme du modèle d'interaction (en texte)
```

### Feuille de route d'ingénierie sur 12 mois

```
Construis une feuille de route d'ingénierie sur 12 mois.

Priorités business de la direction :
T1 : [ce que l'entreprise doit livrer / accomplir]
T2 : [ce que l'entreprise doit livrer / accomplir]
T3 : [ce que l'entreprise doit livrer / accomplir]
T4 : [ce que l'entreprise doit livrer / accomplir]

Contraintes d'ingénierie :
- Capacité actuelle de l'équipe : [X ingénieurs × 10 jours productifs par sprint]
- Embauches prévues : [quand et quels rôles]
- Obligations de dette technique connues : [ce qui doit être traité]
- Migrations prévues : [ex. passage aux microservices, mise à niveau de l'infra]

Format de la feuille de route :

## T1 — [Thème]
Livrables produit : [liste]
Travail plateforme / infra : [liste]
Dette technique traitée : [liste]
Embauches : [rôles]
Risque : [ce qui pourrait faire dérailler ce trimestre]

[répéter pour T2, T3, T4]

## Répartition des investissements (cible)
- Nouvelles fonctionnalités produit : [X]%
- Plateforme et infrastructure : [X]%
- Réduction de la dette technique : [X]%
- Fiabilité et astreinte : [X]%

Ratio cible pour des orgs d'ingénierie saines :
- Phase précoce : 70/15/10/5 (livrer vite, s'occuper de la dette plus tard)
- Phase de croissance : 60/20/15/5 (commencer à investir dans la plateforme)
- Phase d'échelle : 50/25/20/5 (la dette et la fiabilité deviennent existentielles)

## Dépendances et blocages
Que doit-il se passer en dehors de l'ingénierie pour que cette feuille de route réussisse ?
- Décisions produit requises avant [date]
- Ressources design requises au [trimestre]
- Approbations données / légales / conformité requises pour [fonctionnalité]
```

### Baseline des métriques DORA

```typescript
interface DORAMetrics {
  // Fréquence de déploiement : à quelle fréquence vous déployez en production
  deploymentFrequency: 'multiple_per_day' | 'daily' | 'weekly' | 'monthly' | 'less_than_monthly'

  // Lead time pour les changements : temps du commit à la production
  leadTimeHours: number

  // Taux d'échec des changements : % des déploiements causant des incidents
  changeFailureRate: number  // 0.0 à 1.0

  // Mean Time to Restore : temps moyen pour se remettre d'un incident
  mttrHours: number
}

// Benchmarks des performers élite (rapport DORA State of DevOps)
const DORA_ELITE: DORAMetrics = {
  deploymentFrequency: 'multiple_per_day',
  leadTimeHours: 1,
  changeFailureRate: 0.05,   // < 5%
  mttrHours: 1,
}

// Benchmarks des hauts performers
const DORA_HIGH: DORAMetrics = {
  deploymentFrequency: 'daily',
  leadTimeHours: 24,
  changeFailureRate: 0.10,   // < 10%
  mttrHours: 8,
}

// Utiliser ces benchmarks pour évaluer l'état actuel et fixer des cibles dans la stratégie d'ingénierie
```

## Exemple

**Utilisateur :** Je suis un nouveau CTO dans une startup Série B (120 employés, 18 ingénieurs). Nous avons un monolithe Rails de 6 ans, 4 équipes indifférenciées, 1 déploiement par semaine, et 97% de disponibilité. Le conseil veut tripler notre livraison produit en 12 mois.

**Extrait de sortie :**

```
## Vision de l'ingénierie (12 mois)
Une organisation d'ingénierie de 25 personnes livrant en production 10x par jour avec 99,5% de disponibilité,
structurée en 4 équipes produit alignées sur le flux et 1 équipe plateforme. Un nouvel ingénieur livre
en production lors de sa première semaine.

## Évaluation de l'état actuel
Architecture : Monolithe Rails 6, 6 ans de dette. Limitation principale : les feature flags n'existent pas,
donc chaque déploiement est tout ou rien — c'est pourquoi les déploiements hebdomadaires semblent nécessaires.
Vélocité de déploiement : 1 déploiement/semaine = performer DORA "medium". Cible : minimum quotidien, plusieurs/jour d'ici T4.
Fiabilité : 97% de disponibilité = ~260 heures/an d'indisponibilité. Cible : 99,5% = < 44 heures/an.
Structure des équipes : 4 équipes indifférenciées = tout le monde dépend de tout le monde. L'overhead de coordination
explique pourquoi 18 ingénieurs semblent avancer lentement.

## Priorités stratégiques
1. Infrastructure de feature flags (T1) : Activer le déploiement continu sécurisé. Sans ça, la vélocité ne peut pas s'améliorer.
2. Formation de l'équipe plateforme (T1) : 3 ingénieurs sortis du produit, à plein temps sur CI/CD, observabilité, déploiement
3. Ownership de domaine par équipe (T2) : Assigner des frontières de domaine produit claires — arrêter le réseau de dépendances inter-équipes
4. Extraction de services (T3-T4) : Extraire 2-3 contextes délimités à plus haute valeur du monolithe

## Build vs. Buy
| Capacité | Recommandation | Justification |
|---|---|---|
| Feature flags | Acheter (LaunchDarkly) | Pas un différenciateur. 20 000 $/an économise 8 semaines-ingénieur |
| Observabilité | Acheter (Datadog ou Honeycomb) | Commodity. Acheter maintenant, construire le pipeline de données plus tard |
| Pipeline CI/CD | Construire sur GitHub Actions | Déjà en place, l'équipe a l'expertise |
| Gestion des incidents | Acheter (PagerDuty) | Problème résolu, chemin critique |
```

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
