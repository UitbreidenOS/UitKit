---
name: persona-builder
description: "Constructeur de personas utilisateurs à partir de données de recherche : démographie, objectifs, points de douleur, comportements, citations"
---

# Compétence Constructeur de Personas

## Quand l'activer
- Vous disposez de données de recherche utilisateur (entretiens, sondages, tickets de support, analytics) et avez besoin de les distiller en personas actionnables
- Une équipe design ou produit s'apprête à démarrer une nouvelle initiative et a besoin d'une compréhension partagée de pour qui elle construit
- Vous souhaitez challenger ou valider des hypothèses sur vos utilisateurs avec des archétypes fondés sur des données
- Vous avez besoin de créer des personas pour guider la priorisation de la roadmap, le ton du texte ou les décisions de périmètre fonctionnel
- Intégrer de nouveaux membres d'équipe qui ont besoin de comprendre rapidement la base d'utilisateurs

## Quand NE PAS utiliser
- Vous n'avez pas de vraies données utilisateurs — effectuez la recherche d'abord ; les personas synthétiques basés sur des hypothèses sont nuisibles
- Vous avez besoin d'un persona marketing pour le ciblage/la segmentation — objectif et structure différents d'un persona UX
- Vous souhaitez faire du journey mapping — utiliser `/ux-researcher` pour cette étape après que les personas sont définis
- Vous avez besoin d'un profil comportemental détaillé pour un power user spécifique — c'est un archétype utilisateur ou un job story, pas un persona

## Instructions

### Génération complète de personas à partir de données de recherche

```
Construire des personas utilisateurs à partir de ces données de recherche.

## Données d'entrée
Sources de données disponibles : [entretiens utilisateurs (N) / résultats de sondage (N réponses) / segments analytics / tickets de support / sessions d'utilisabilité / tout]
Produit : [nom et description en 1 phrase]
Base d'utilisateurs : [qui utilise ce produit — être précis sur la gamme de types d'utilisateurs]

## Données brutes à analyser
[Coller les notes d'entretien, thèmes de réponses au sondage, segments analytics, citations clés, thèmes de tickets de support, ou toute combinaison]

## Exigences des personas
Nombre de personas nécessaires : [2-4 — plage recommandée ; moins c'est mieux]
Usage principal : [décisions de design produit / priorisation de la roadmap / cadrage ingénierie / communication avec les parties prenantes]

## Pour chaque persona, produire :

---

### Persona [N] : [Nom de l'archétype]
[Le nom doit être un descripteur de rôle, pas un prénom fictif — ex. "Le Responsable Ops Débordé", "Le Constructeur Automation Power User", "Le Responsable Achats Prudent"]

**Accroche :** [Une phrase qui capture leur frustration ou objectif définissant — c'est la première chose que les lecteurs voient et doit être mémorable]

---

#### Rôle et contexte
- **Intitulé de poste / fonction :** [plage d'intitulés réaliste — pas un seul titre]
- **Secteur / type d'entreprise :** [où ils travaillent]
- **Taille d'entreprise :** [PME / mid-market / enterprise — et pourquoi ça compte pour votre produit]
- **Maîtrise technique :** [échelle 1-5 avec une description en langage courant]
- **Comment ils utilisent votre produit :** [usage quotidien / occasionnel / imposé par l'équipe / contournement pour autre chose]
- **Qui ils influencent ou avec qui ils travaillent :** [leurs parties prenantes — pertinent pour les produits B2B]

#### Objectifs (à quoi ressemble le succès pour eux)
- **Objectif principal :** [le travail qu'ils essaient de faire — utiliser le cadrage "Jobs to Be Done" si possible]
- **Objectif secondaire :** [un objectif de soutien qui est souvent en compétition avec le principal]
- **Métrique de succès qui les intéresse :** [le chiffre ou résultat sur lequel ils sont évalués — cela guide le comportement]

#### Frustrations (avec les solutions actuelles — fondées sur des preuves)
Pour chaque frustration, inclure la preuve (citation ou point de données qui l'a fait remonter) :

1. **[Titre de la frustration] :** [Description spécifique du problème]
   Preuve : "[Citation verbatim ou proche-paraphrase de la recherche]" — [source, ex. entretien P3, ou 34% des répondants au sondage]

2. **[Titre de la frustration] :** [...]
   Preuve : [...]

3. **[Titre de la frustration] :** [...]
   Preuve : [...]

#### Patterns de comportement
- **Comment ils découvrent les outils :** [bouche à oreille / mandat du manager / essai / recherche / recommandation de pairs]
- **Processus d'évaluation :** [comment ils décident d'adopter — essai, démo, revue par les pairs, achat, etc.]
- **Pattern d'utilisation :** [comment ils utilisent réellement le produit au quotidien]
- **Contournements qu'ils utilisent aujourd'hui :** [ce qu'ils font quand votre produit ne résout pas le problème — critique pour le design]
- **Style de communication :** [Slack / email / async / synchrone — pertinent pour la messagerie in-app]

#### La citation qui définit ce persona
"[Une citation verbatim ou quasi-verbatim de la recherche qui capture la vision du monde de ce persona. Ce doit être la citation que vous mettriez sur une affiche.]"

#### Ce dont ils ont besoin du produit (besoins guidant les décisions)
- [Besoin 1 — suffisamment spécifique pour guider une décision de design]
- [Besoin 2]
- [Besoin 3]

#### Ce qui les fera partir (facteurs de churn)
- [Risque 1 — la condition dans laquelle ce persona abandonne le produit]
- [Risque 2]

#### Implications design (traduction directe en décisions produit)
- [Implication 1 — "Parce que ce persona X, le produit devrait Y"]
- [Implication 2]
- [Implication 3]

---

### Tableau de comparaison des personas (après tous les personas)

| Dimension | Persona 1 | Persona 2 | Persona 3 |
|---|---|---|---|
| Maîtrise technique | Faible | Élevée | Moyenne |
| Pouvoir décisionnel | Aucun | Influenceur | Acheteur |
| Douleur principale | [douleur] | [douleur] | [douleur] |
| Proposition de valeur qui résonne | [prop] | [prop] | [prop] |
| Priorité fonctionnelle | [fonctionnalités] | [fonctionnalités] | [fonctionnalités] |
| Risque de churn | Élevé | Faible | Moyen |

### Priorisation des personas
Pour quel persona designer en premier — et pourquoi :
[Recommandation explicite basée sur l'impact business et l'adéquation stratégique — pas seulement "l'utilisateur le plus courant"]
```

### Esquisse rapide de persona (à partir de données minimales)

```
Créer une esquisse rapide de persona à partir de données limitées.

Ce que j'ai : [quelles données vous avez — ex. "5 tickets de support et les verbatims de notre sondage NPS"]
Produit : [nom]
Type d'utilisateur que j'essaie de comprendre : [ex. "les utilisateurs qui churneraient dans les 30 premiers jours"]

Générer un persona d'hypothèse de travail — le marquer clairement comme HYPOTHÈSE, pas validé.

Format :
- Nom de l'archétype et accroche
- 3 caractéristiques définissantes
- Frustration principale (avec toute preuve disponible)
- 2 implications design
- Les 3 questions que ce persona soulève et qui nécessitent une vraie recherche pour être validées

Étiqueter clairement chaque hypothèse. Un persona d'hypothèse est un point de départ pour la recherche, pas un substitut à celle-ci.
```

### Checklist de validation de persona

```
Valider ce persona existant contre de nouvelles données.

Persona existant : [coller le persona]
Nouvelles données : [coller de nouvelles notes d'entretien, résultats de sondage, ou analytics]

Vérifier :
1. Les nouvelles données confirment-elles ou contredisent-elles l'objectif principal ? [Confirmé / Contredit / Partiellement soutenu]
2. Les frustrations déclarées sont-elles toujours présentes ? [Lister celles qui apparaissent dans les nouvelles données]
3. Y a-t-il de nouvelles frustrations absentes du persona actuel ? [Les lister]
4. Le pattern de comportement a-t-il changé ? [Qu'est-ce qui est différent ?]
5. La citation représentative est-elle toujours représentative, ou y en a-t-il une meilleure dans les nouvelles données ?

Résultat : Persona mis à jour avec des marqueurs [NOUVEAU] sur les champs modifiés, et un résumé des changements.
```

### Détection des anti-patterns

```
Examiner ce persona et signaler les anti-patterns courants.

[Coller le persona existant]

Vérifier ces modes d'échec :
1. DÉTAILS DÉMOGRAPHIQUES SUPERFLUS — Y a-t-il des détails démographiques non pertinents (âge, genre, localisation, loisirs) qui ne guident pas les décisions produit ? Signaler et recommander de supprimer.
2. AFFIRMATION SANS PREUVE — Des affirmations sont-elles faites sans citer des données de recherche ? Signaler chacune.
3. ARCHÉTYPE UTILISATEUR UNIQUE — Ce persona représente-t-il plusieurs types d'utilisateurs distincts nécessitant des personas séparés ? Signaler si c'est le cas.
4. BIAIS ASPIRATIONNEL — Ce persona décrit-il qui l'équipe souhaite que l'utilisateur soit, plutôt que qui il est réellement ? Chercher un langage trop positif ou qui contredit les patterns courants de support.
5. CONFUSION PERSONA MARKETING — Ce persona décrit-il un comportement d'achat plutôt qu'un comportement d'utilisation du produit ? Ils servent des objectifs différents.
6. RÔLES CONFONDUS — Dans les produits B2B, ce persona est-il un mélange du Champion (utilisateur quotidien) et de l'Acheteur Économique ? Ils doivent être séparés.

Pour chaque anti-pattern trouvé : expliquer pourquoi c'est un problème et recommander une correction spécifique.
```

## Exemple

**Utilisateur :** Nous avons interrogé 8 utilisateurs de notre outil de gestion de projet. Voici les thèmes : la plupart sont des team leads dans des entreprises de 50 à 200 personnes. Ils se soucient de la visibilité sur les projets sans avoir à demander des mises à jour à leur équipe. Ils sont frustrés par le fait que notre reporting actuel est trop manuel — ils doivent construire leurs propres tableaux de bord. Trois d'entre eux ont dit qu'ils finissent par faire des captures d'écran de notre outil et les coller dans des diaporamas pour leur standup exec du lundi. Deux ont dit qu'ils ont essayé notre fonctionnalité de reporting et ont abandonné après 15 minutes.

**Résultat :**

```markdown
### Persona 1 : Le Team Lead Affamé de Visibilité

**Accroche :** "Je passe la moitié de mon dimanche à construire le deck de diapositives qui devrait se construire tout seul."

---

#### Rôle et contexte
- **Intitulé de poste / fonction :** Team Lead, Engineering Manager, Ops Manager, ou rôle similaire de people lead
- **Taille d'entreprise :** 50-200 employés (mid-market ; trop grand pour tout suivre de mémoire, trop petit pour un PMO dédié)
- **Maîtrise technique :** 3/5 — à l'aise avec les outils, mais ne passe pas de temps sur la configuration
- **Comment ils utilisent votre produit :** Vérifications quotidiennes sur leurs propres tâches, mais leur vrai besoin est une vue de statut cross-équipe qu'ils peuvent partager vers le haut
- **Qui ils influencent :** Leur équipe directe (5-15 personnes) et leur propre manager (l'exec auquel ils rendent compte hebdomadairement)

#### Objectifs
- **Objectif principal :** Connaître le statut de tous les projets actifs sans avoir à interrompre leur équipe pour demander
- **Objectif secondaire :** Produire une diapositive de standup du lundi en moins de 10 minutes
- **Métrique de succès qui les intéresse :** Leur manager dit "super mise à jour" sans poser de questions de suivi

#### Frustrations
1. **Le reporting est manuel et perd de l'information :** Ils doivent construire des tableaux de bord ou des exports personnalisés, et au moment où c'est fait, c'est déjà obsolète.
   Preuve : "Je fais des captures d'écran du tableau et je les colle dans des diapositives chaque semaine. Ça me semble ridicule." — entretien P3

2. **La fonctionnalité de reporting est trop complexe à configurer :** L'outil a une capacité de reporting mais elle nécessite trop de configuration pour quelqu'un qui a juste besoin d'une vue de statut hebdomadaire.
   Preuve : 2/8 participants ont essayé la fonctionnalité de reporting ; les deux l'ont abandonnée dans les 15 minutes. Aucun participant n'avait un rapport fonctionnel au moment de l'entretien.

3. **Pas d'export orienté direction :** Les sorties sont formatées pour les acteurs de projet, pas pour les dirigeants qui ont besoin d'un résumé en 3 diapositives.
   Preuve : 3/8 participants ont explicitement mentionné les captures d'écran pour les standups exécutifs.

#### La citation qui définit ce persona
"Je passe la moitié de mon dimanche à construire le deck de diapositives qui devrait se construire tout seul."

#### Ce dont ils ont besoin du produit
- Un résumé de statut hebdomadaire auto-généré qu'ils peuvent partager avec leur manager sans modification
- Visibilité cross-projets depuis une seule vue — pas un tableau par projet
- Un format d'export qui fonctionne dans Google Slides ou PowerPoint

#### Implications design
- Parce que le workflow principal de ce persona est le reporting vers le haut, le produit a besoin d'une "vue manager" distincte de la vue du travailleur sur les tâches
- Parce qu'ils font des captures d'écran aujourd'hui, le chemin de moindre résistance pour l'adoption est de remplacer cette capture d'écran par un export en un clic
- Parce qu'ils ont abandonné la configuration du reporting, toute solution de reporting doit fonctionner sans configuration pour le cas d'usage courant (statut projet hebdomadaire)
```

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
