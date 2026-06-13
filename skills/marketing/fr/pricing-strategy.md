---
name: pricing-strategy
description: "Stratégie de tarification : analyse du modèle (basée sur la valeur, coût-plus, compétitive), conception des tiers, freemium vs essai, approche d'augmentation des prix, recherche de volonté de payer"
---

# Compétence Stratégie de Tarification

## Quand l'activer
- Fixer la tarification pour un nouveau produit ou service
- Décider entre les modèles de tarification (abonnement, basé sur l'utilisation, une seule fois, freemium)
- Concevoir les tiers de tarification (combien, quoi inclure, comment différencier)
- Augmenter les prix pour les clients existants
- Exécuter une analyse de volonté de payer

## Quand ne pas l'utiliser
- Produits réglementés de tarification — nécessite examen de conformité
- Négociations de tarification personnalisée en entreprise — processus différent
- Modélisation financière pour investisseurs — utiliser la compétence financial-plan

## Instructions

### Choisir un modèle de tarification

```
Aidez-moi à choisir le bon modèle de tarification pour mon produit.

Produit : [décrire — logiciel / service / produit physique / marketplace]
Clients : [qui achète, taille de l'entreprise, gamme budgétaire]
Comment ils l'utilisent : [fréquence, volume, intensité]
Notre structure de coûts : [grossièrement — coûts fixes élevés ou bas ? Variable par client ?]
Modèles des concurrents : [ce qu'ils facturent et comment]

Évaluer ces modèles pour ma situation :
1. Forfait unique (prix unique) — simple, prévisible, bon pour produits simples
2. Abonnement par tiers — bon, meilleur, meilleur, modèle SaaS le plus courant
3. Basé sur l'utilisation / mesuré — charger par appel API, siège, transaction, GB
4. Freemium — couche gratuite pour toujours + payant pour plus de fonctionnalités/limites
5. Essai gratuit — accès complet pour X jours, puis payer
6. Par siège — prix par utilisateur, bon pour outils d'équipe
7. Basé sur la valeur — prix ancrés au ROI client (idéal mais difficile à faire appliquer)
8. Paiement unique — bon pour outils sans valeur continue, audiences qui détestent les abonnements

Recommander : quels modèles correspondent à mon produit et pourquoi ?
```

### Concevoir les tiers de tarification

```
Concevoir les tiers de tarification pour [produit].

Objectif : [maximiser conversion / maximiser revenu / se déplacer vers le marché premium]
Segments client que je veux servir : [décrivez chaque — p.ex. indépendant / petite équipe / entreprise]
Pilotes de valeur clés : [ce qui importe le plus aux clients]
Tarification des concurrents : [ce que d'autres facturent, si connu]

Concevoir 3 tiers :
- Tier 1 (entrée / self-serve) : limites, features, prix, client cible
- Tier 2 (moyen / plus populaire) : limites, features, prix, client cible
- Tier 3 (pro / équipes) : limites, features, prix, client cible

Optionnel : Tier 0 (gratuit) et Tier 4 (entreprise / personnalisé)

Règles pour bonne conception de tier :
- Chaque tier devrait sembler clairement "valoir de l'upgrade"
- Mettez 1-2 features que les gens veulent vraiment derrière les portes payantes
- Le tier le plus populaire devrait être au milieu (tarification appât)
- Annuel vs mensuel : quel % de réduction proposer pour annuel ?
```

### Freemium vs essai gratuit

```
Devrais-je utiliser freemium ou un essai gratuit ?

Mon produit : [décrivez]
Temps avant la valeur : [combien de temps avant que les utilisateurs obtiennent une valeur significative ?]
Acquisition utilisateur : [inbound / payant / bouche à oreille]
Marché cible : [PME self-serve / entreprise / consommateur]
Objectif de conversion : [X% target essai-payant]

Freemium pour ma situation — pros/cons :
- Pro : friction basse, viral/bouche à oreille, construit la base utilisateur
- Con : coût de support élevé pour utilisateurs non-payants, motivation d'upgrade floue

Essai gratuit pour ma situation — pros/cons :
- Pro : urgence claire, capture les utilisateurs engagés, produit plus simple
- Con : friction à l'inscription, l'utilisateur doit agir avant le deadline

Recommandation + la variable clés qui pilote la décision pour mon cas.
```

### Stratégie d'augmentation de prix

```
Je veux augmenter les prix. Aidez-moi à le faire sans perdre les clients.

Tarification actuelle : $[X]/mois
Tarification proposée : $[X]/mois (augmentation : [X]%)
Raison : [valeur livrée, inflation, repositionnement de marché]
Base client : [X] clients, durée moyenne [X] mois

Concevoir le rollout :
1. Qui granulaire (les anciens clients gardent l'ancien prix combien de temps ?)
2. Qui migrer en premier (les nouveaux clients immédiatement, les anciens après X mois ?)
3. Séquence de communication (quand notifier, quoi dire, qui signe l'email)
4. Gérer les objections (que dire à "votre concurrent est moins cher")
5. Modèle d'impact de churn et revenu
6. Ébaucher l'email d'augmentation de prix

Benchmark historique : les augmentations de prix SaaS bien exécutées voient 2-8% de churn, revenus nets positifs.
```

### Recherche de volonté de payer

```
Concevoir un processus de recherche de volonté de payer pour [produit].

Segment cible : [qui interviewer/surveiller]
Gamme de tarification que j'envisage : $[X] à $[X]

Méthodes de recherche (par ordre d'effort) :
1. Van Westendorp Price Sensitivity Meter (sondage 4-questions) :
   - À quel prix cela semble trop bon marché pour faire confiance ?
   - À quel prix cela semble une bonne affaire ?
   - À quel prix cela semble cher mais vous achèteriez quand même ?
   - À quel prix cela semble trop cher ?

2. Entretiens client (5-10 clients existants ou potentiels) :
   - Que payez-vous actuellement pour les alternatives ?
   - Quel ROI obtenez-vous en résolvant ce problème ?
   - Parcourez-moi votre processus d'achat pour les outils comme celui-ci

3. Test de page de tarification A/B :
   - Divisez le trafic vers différents points de prix
   - Mesurez conversion et churn à chaque prix

Concevoir le sondage Van Westendorp et le script d'entretien pour mon produit.
```

## Exemple

**Utilisateur :** J'ai un outil SaaS à $29/mois plat. Le revenu va bien mais je soupçonne que je laisse de l'argent sur la table. Que devrais-je faire ?

**Analyse de Claude :**

La tarification plate à $29 est la simplicité de stade précoce classique — intelligente pour validation, limitante pour l'échelle.

**Le problème :** $29 capture le même prix d'un indépendant utilisant votre outil 2 heures/semaine et une équipe de 10 personnes l'utilisant toute la journée. Vous sous-monétisez le segment haute valeur.

**Mouvement recommandé : Restructuration 3-tiers**

| Tier | Prix | Pour | Limites clés |
|---|---|---|---|
| Solo | $29/mo | Freelancers, indépendants | 1 utilisateur, 100 items |
| Team | $79/mo | Petites équipes | 5 utilisateurs, 1,000 items |
| Business | $199/mo | Entreprises en croissance | 20 utilisateurs, illimité |

**Stratégie de migration pour les clients existants $29 :**
- Grandfathered à $29 pendant 12 mois (récompense de loyauté)
- Après 12 mois : inviter à choisir nouveau tier basé sur l'utilisation
- Ne vous excusez pas — expliquez l'augmentation de valeur

**Impact projeté :** Si 20% des clients existants passent à Team ($79) et 5% à Business ($199), le revenu mensuel augmente ~35% avec même nombre de clients.

---
