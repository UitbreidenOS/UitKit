---
name: qbr-builder
description: "Constructeur de QBR (Quarterly Business Review) : récapitulatif de la santé client, ROI délivré, objectifs pour le prochain trimestre, cadre de discussion sur le renouvellement et l'expansion"
---

# Compétence QBR Builder

## Quand activer
- Vous avez un QBR planifié dans les 2 prochaines semaines et devez construire le support et les points de discussion
- Vous devez quantifier le ROI délivré à un client avant une conversation de renouvellement
- Préparation d'une revue de niveau exécutif avec le C-suite d'un client
- Construction d'un modèle de QBR que toute votre équipe CS peut utiliser de manière cohérente
- Reconquête d'une relation avant un QBR — vous savez que le client est mécontent et avez besoin d'une stratégie

## Quand NE PAS utiliser
- Appels d'intégration ou points mensuels — ceux-ci ont des structures différentes, utilisez `/customer-success`
- Présentations commerciales à des prospects — outil différent, objectif différent
- Revues business internes (non destinées aux clients) — utilisez un workflow différent
- QBR où vous n'avez pas de données d'utilisation ou de résultats à présenter — collectez d'abord les données

## Instructions

### Prompt complet de construction de QBR

```
Construire un QBR complet pour mon client.

Client : [Nom de l'entreprise]
Palier : [Stratégique / Enterprise / Croissance / Standard]
ARR : $[X]
Date de renouvellement : [date — dans combien de mois ?]
CSM : [nom]
Contacts clients présents : [titre du sponsor exécutif, titre du champion, autres]
Mes contacts présents : [CSM, AE, VP CS si stratégique]
Durée : [30 / 45 / 60 / 90 minutes]
Objectif principal de ce QBR : [fidéliser / étendre / cas d'étude / réinitialisation de la relation]

Contexte business du client :
- Dans quel secteur opèrent-ils ? [X]
- Quels étaient leurs critères de succès déclarés au début du contrat ? [X, Y, Z]
- Y a-t-il eu des changements dans leur activité ? [changement de direction / fusion / effectifs / budget]
- Quel est leur cas d'usage principal pour notre produit ? [X]

Contexte de notre produit :
- Données d'utilisation : [connexions, utilisateurs actifs, utilisation des fonctionnalités principales — décrivez ce que vous avez]
- Changements produit ce trimestre pertinents pour eux : [fonctionnalités livrées, bugs corrigés]
- Tickets de support ouverts ou problèmes non résolus : [décrire]
- Ont-ils participé à des fonctionnalités bêta ou des demandes ? [oui/non]

Contexte commercial :
- MRR/ARR actuel : $[X]
- Opportunité d'expansion : [sièges supplémentaires / modules complémentaires / palier supérieur] — $[X] potentiel
- Menace concurrentielle : [êtes-vous au courant d'une évaluation concurrentielle ?]
- Santé du renouvellement : [vert / jaune / rouge — et pourquoi]

Produisez :

## ORDRE DU JOUR DU QBR (pour une session de 60 minutes)

[5 min] Ouverture et point sur la relation
[15 min] Leur activité — qu'est-ce qui a changé depuis le trimestre dernier
[20 min] Valeur délivrée — ce qu'ils ont accompli avec notre produit
[10 min] Feuille de route — ce qui vient et les impacte
[10 min] Objectifs du prochain trimestre et critères de succès

## POINTS DE DISCUSSION POUR CHAQUE SECTION

Pour chaque section de l'ordre du jour :
- 2-3 questions à poser (écoutez avant de parler)
- Points de données clés à partager
- Ce qu'il faut surveiller (signaux : positif = expansion ; négatif = risque de résiliation)
- Comment gérer s'ils sont mécontents

## DIAPOSITIVE ROI (la plus importante dans tout QBR)
- Résultat 1 : [résultat spécifique lié à leurs critères de succès déclarés]
- Résultat 2 : [résultat spécifique]
- Résultat 3 : [résultat spécifique]
- Si ROI difficile indisponible : utilisez des indicateurs avancés (temps économisé, erreurs réduites, taux d'adoption)
- Ne jamais dire « nous vous avons aidé » — dites « vous avez atteint X, et voici comment notre produit l'a rendu possible »

## DISCUSSION RENOUVELLEMENT ET EXPANSION
- Quand l'aborder : pas avant d'avoir délivré la section valeur
- Comment cadrer : « D'après ce que vous avez accompli, voici ce que nous recommanderions pour le prochain trimestre... »
- Narratif d'expansion : [spécifique à leur situation et aux signaux d'utilisation]
- Gestion des objections : [objections probables compte tenu de leur santé actuelle]

## CHECKLIST PRÉ-QBR
□ Ordre du jour envoyé 5 jours à l'avance
□ Présence du sponsor exécutif confirmée
□ Toutes les données d'utilisation extraites de l'analytique produit
□ Tous les tickets de support des 90 derniers jours examinés
□ Quantification du ROI préparée
□ AE ou VP informé de la situation commerciale
□ Identifier la chose qui pourrait mal tourner et avoir un plan
```

### Cadre de quantification du ROI

```
Quantifier le ROI que ce client a reçu de notre produit ce trimestre.

Client : [Entreprise]
Produit : [décrire ce qu'il fait]
Leur cas d'usage : [flux de travail spécifique pour lequel ils l'utilisent]
Valeur du contrat : $[X] ARR

Cadre ROI — utilisez les dimensions qui s'appliquent :

GAINS DE TEMPS
- Processus avant notre produit : [décrivez les étapes manuelles]
- Temps économisé par tâche : [X heures]
- Fréquence : [X fois par semaine/mois]
- Taille de l'équipe effectuant cette tâche : [N personnes]
- Heures économisées par an : [X heures/semaine × N personnes × 52 semaines]
- Valeur à $[X]/heure coût complet : $[X] valeur annuelle
- Multiple ROI : $[X valeur] / $[X ARR] = [X:1] ROI

RÉDUCTION DES ERREURS / QUALITÉ
- Taux d'erreur avant : [X%] d'erreurs par [tâche]
- Taux d'erreur maintenant : [X%]
- Coût par erreur (retraitement, impact client, réputation) : $[X]
- Économies annuelles grâce à la réduction des erreurs : $[X]

IMPACT SUR LE CHIFFRE D'AFFAIRES
- Notre produit les a-t-il aidés à conclure plus de deals, fidéliser des clients ou augmenter leur chiffre d'affaires ?
- Chiffre d'affaires influencé ou protégé : $[X]
- Attribution : [comment savez-vous que notre produit a généré cela ?]

EFFECTIFS ÉVITÉS
- Auraient-ils eu besoin d'embaucher [N] personnes supplémentaires sans notre produit ?
- Salaire + avantages par recrutement : $[X]
- Coût d'effectifs évité : $[X]

RAPIDITÉ DE MISE EN MARCHÉ
- Combien plus vite livrent-ils / complètent-ils leur travail ?
- Avant : [X jours] → Après : [X jours]
- Valeur concurrentielle d'aller plus vite : [qualitatif ou quantitatif]

VALEUR TOTALE DÉLIVRÉE CE TRIMESTRE : $[X]
COÛT DU CONTRAT CE TRIMESTRE : $[X ARR / 4] = $[X]
MULTIPLE ROI : [X:1]

Si vous n'avez pas de données concrètes : utilisez les propres mots du client issus des tickets de support, des sondages NPS ou de conversations précédentes. « Vous nous avez dit lors de votre dernier point que [X] » vaut mieux qu'aucune preuve.

Présentez cela comme LEUR accomplissement, pas le vôtre.
```

### Conversation d'alignement exécutif

```
Préparez-moi pour la partie exécutive d'un QBR.

Exécutif client : [titre, ce que vous savez de ses priorités]
Niveau de risque : [compte stratégique à risque / sain et en expansion / inconnu]
Ma demande de cette conversation : [signature de renouvellement / discussion d'expansion / cas d'étude / référence]

Cadre de conversation exécutive :

NE COMMENCEZ PAS par le produit. Commencez par leur activité.

Questions d'ouverture (choisissez-en 2) :
- « Quelles sont vos 3 principales priorités pour [entreprise] au cours des 12 prochains mois ? »
- « À quoi ressemble le succès pour votre équipe d'ici la fin de l'année ? »
- « Quel est le plus grand obstacle entre où vous en êtes maintenant et où vous voulez être ? »
- « Qu'est-ce qui vous donnerait confiance que vous investissez dans les bons outils pour l'année prochaine ? »

Pont de leurs priorités vers votre produit :
« D'après ce que vous avez décrit — [leur priorité] — voici comment [votre produit] soutient directement cela... »
Puis délivrez votre déclaration ROI en une phrase.

Gestion du désengagement exécutif :
- S'ils vérifient leur téléphone : posez immédiatement une question directe — « Y a-t-il quelque chose de spécifique que vous aimeriez que nous abordions dans la session d'aujourd'hui ? »
- S'ils ne sont pas le vrai décideur : « Qui d'autre devrait participer à cette conversation pour la planification du prochain trimestre ? »

Gestion de l'insatisfaction exécutive :
- Ne soyez pas sur la défensive. Reconnaissez et questionnez.
- « Merci d'être direct — c'est exactement ce dont j'ai besoin d'entendre. Pouvez-vous m'aider à comprendre quelle est la chose la plus importante que nous devons corriger ? »
- Puis écoutez pleinement avant de répondre.
- Faites un suivi le jour même avec un résumé écrit de ce que vous avez entendu et un plan d'action concret.

Pont d'expansion (utilisez seulement si la relation est solide et la valeur établie) :
« Compte tenu de ce que vous avez accompli ce trimestre et de ce que vous m'avez dit au sujet de [leur priorité], j'aimerais vous montrer ce qui est possible si nous étendons notre collaboration à [nouveau cas d'usage / sièges supplémentaires / palier suivant]. »

JAMAIS : pitcher l'expansion avant d'avoir établi la valeur. La séquence compte.

Produisez des points de discussion adaptés à mon exécutif et ma situation spécifiques.
```

### Plan de récupération QBR (client à risque)

```
Mon client QBR est mécontent. Aidez-moi à préparer un QBR de récupération.

Client : [Entreprise]
Santé : ROUGE
Plainte principale : [ce qu'il a dit ou signalé]
Cause profonde (votre évaluation) : [lacune produit / échec d'intégration / échec du support / mauvais champion / mal vendu]
Renouvellement : [X mois à venir]
Alternative du client : [résilier / passer à un concurrent / réduire la portée]

Cadre de QBR de récupération :

AVANT L'APPEL
- N'attendez pas le QBR pour reconnaître le problème. Envoyez un e-mail 3 jours avant :
  « Je veux que ce QBR soit la conversation la plus productive que nous ayons eue. Je sais que [problème spécifique] n'a pas été là où il devrait être, et je veux consacrer du temps à y répondre directement. »
- Amenez votre VP CS ou un exécutif — signal que vous prenez cela au sérieux
- Préparez un plan d'action écrit à l'avance — n'improvisez pas

OUVERTURE (5 premières minutes)
- N'ouvrez pas avec votre ordre du jour. Ouvrez avec une reconnaissance :
  « Avant de parcourir l'ordre du jour, je veux aborder [problème] directement. Nous n'avons pas été à la hauteur de ce que nous nous étions engagés à faire dans [domaine], et je veux consacrer du temps à la façon dont nous le corrigeons. »
- Pause. Laissez-les répondre. Écoutez pleinement.

L'OFFRE DE RÉCUPÉRATION
- Qu'est-ce qui changera spécifiquement ? [listez 3 actions concrètes avec responsables et dates]
- Que pouvez-vous offrir en geste ? [support dédié / ETA de correction produit / remise / crédit de service]
- À quoi ressemble le succès dans 60 jours ? [définissez-le ensemble]
- « Si nous tenons ces trois engagements avant [date], seriez-vous prêt à vous engager à renouveler ? »

CE QU'IL NE FAUT PAS FAIRE
- Ne blâmez pas votre équipe produit, votre équipe support ou vos collègues lors de l'appel
- Ne promettez pas de fonctionnalités que vous ne pouvez pas livrer
- Ne faites pas de l'appel le sauvetage du contrat — faites-en le succès du client
- Ne minimisez pas leur plainte avec des données qui contredisent leur expérience

APRÈS L'APPEL DANS LES 24 HEURES
- Résumé écrit des engagements pris
- Responsable nommé pour chaque action
- Prochaine date de point dans les 2 semaines (pas le prochain trimestre)

Produisez le plan de QBR de récupération spécifique pour mon client.
```

## Exemple

**Utilisateur :** J'ai un QBR avec Acme Corp mardi prochain. Ils font 180 K$ ARR, renouvellement dans 3 mois. Leur CFO et leur Responsable Ops seront présents. Ils ont eu des plaintes sur la lenteur des réponses du support au T2 mais l'utilisation est en hausse de 40% en glissement annuel. Comment structurer cela ?

**Plan QBR de Claude :**

**Priorité stratégique : Protéger le renouvellement à 180 K$, préparer la conversation d'expansion.**

**Ordre du jour pour le QBR Acme Corp — 60 minutes :**

- [0:00] Ouverture : « Avant de rentrer dans notre ordre du jour — je veux vérifier directement. Nous avons eu des moments plus difficiles sur les délais de réponse du support au T2. Je veux comprendre si c'est résolu ou si c'est encore une préoccupation. » [Écoutez — cela fait remonter le risque avant qu'il vous surprenne]

- [0:10] Leur activité : « À l'approche du T4 et de la planification du renouvellement — quelles sont vos priorités principales en tant que responsable des opérations pour l'année prochaine ? » Demandez au CFO : « Où voyez-vous le plus de pression sur les coûts ou l'efficacité en ce moment ? » [Laissez-les parler. Cela révèle des signaux d'expansion.]

- [0:20] Valeur délivrée : « Voici ce que votre équipe a accompli ce trimestre... » Commencez par la croissance de 40% de l'utilisation comme signal de santé de l'adoption. Convertissez-la en ROI : avec 40% d'utilisation en plus, quel travail font-ils maintenant qu'ils ne faisaient pas avant ? Quantifiez en heures ou erreurs réduites.

- [0:35] Reconnaissance du support : « Je veux être direct sur le T2 du support. Les délais de réponse moyennaient 36 heures contre notre SLA de 12 heures. Ce n'est pas acceptable. Voici ce que nous avons changé : [correction spécifique]. Voici notre moyenne actuelle : [données actuelles]. Je vous enverrai un rapport mensuel SLA. »

- [0:45] Feuille de route : Montrez 2 fonctionnalités spécifiquement pertinentes pour les Ops — pas de dump produit.

- [0:55] Prochaines étapes : « D'après vos priorités pour l'année prochaine — [ce qu'ils ont dit] — j'aimerais vous proposer de discuter de [cas d'usage d'expansion] dans le cadre de votre renouvellement. Pouvons-nous planifier 30 minutes avec [votre AE] avant la fin du mois ? »

**Risque clé :** Si le CFO soulève la qualité du support comme condition de renouvellement, préparez un crédit de service à offrir — pas volontairement, mais prêt s'ils insistent.

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous créons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
