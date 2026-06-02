---
name: health-score-analyzer
description: "Analyse du score de santé client : signaux d'utilisation, signaux relationnels, signaux commerciaux, évaluation du risque de résiliation et intervention CS recommandée pour chaque compte"
---

# Compétence Health Score Analyzer

## Quand activer
- Vous effectuez votre revue hebdomadaire des clients à risque et avez besoin d'une analyse structurée
- Vous disposez de données brutes d'utilisation du produit et souhaitez les traduire en score de santé
- Un client s'est tu ou a montré un comportement inhabituel et vous voulez une évaluation du risque
- Vous construisez ou recalibrez votre modèle de score de santé après une vague de résiliations inattendues
- Vous préparez la revue de portefeuille de votre équipe CS pour la semaine — quels comptes nécessitent de l'attention ?
- Vous souhaitez évaluer un compte avant une conversation de renouvellement ou d'expansion

## Quand NE PAS utiliser
- Construction du système de score de santé initial de zéro — utilisez `/customer-success` pour la conception du modèle
- Analyses approfondies du produit pour les décisions internes produit — fonction différente
- Déterminer si un client est prêt à être une référence ou un cas d'étude — signal distinct
- Scoring de qualification commerciale pour les prospects — c'est du territoire de scoring de leads

## Instructions

### Analyse de la santé d'un compte unique

```
Analysez la santé de ce compte client et donnez-moi une évaluation du risque.

Client : [Nom de l'entreprise]
ARR : $[X]
Renouvellement : [date / X mois à venir]
Type de contrat : [mensuel / annuel / pluriannuel]
CSM : [nom]
Ancienneté : [X mois / années en tant que client]

SIGNAUX D'UTILISATION — extrait de votre analyse produit :
- Dernière connexion (équipe) : [date — il y a combien de jours ?]
- Fréquence de connexion ce mois-ci : [X connexions] vs. mois dernier : [X connexions]
- Utilisation des fonctionnalités principales : [quel est leur cas d'usage principal, et l'utilisent-ils ?]
  - Fonctionnalité A : [X fois ce mois / non utilisée]
  - Fonctionnalité B : [X fois ce mois / non utilisée]
- Utilisateurs actifs : [N sur N sièges sous licence] = [X%] d'utilisation des sièges
- Tendance d'utilisation : [croissante / stable / en déclin — sur les 3 derniers mois]
- Dernière action produit : [décrivez ce qu'ils ont fait le plus récemment]

SIGNAUX RELATIONNELS :
- Dernier point de contact CSM : [date — il y a X jours] [appel / e-mail / réunion]
- Statut du champion : [fort / faible / aucun champion identifié / champion parti]
- Sponsor exécutif : [engagé / désengagé / inconnu]
- Score NPS : [X — promoteur / passif / détracteur] [date du dernier sondage]
- Tickets de support sur 90 jours : [N tickets] — types : [décrire]
- Des tickets concernant l'export de données, l'accès API ou des mentions de concurrents ? [oui/non]
- Temps de réponse aux sollicitations du CSM : [rapide / lent / sans réponse]

SIGNAUX COMMERCIAUX :
- Statut de la facture : [à jour / X jours de retard]
- Remise appliquée : [X% — remise plus élevée = coût de transition plus faible]
- Tendance de croissance du contrat : [étendu / stable / réduit depuis le début]
- Stabilité des parties prenantes : [des contacts clés ont-ils quitté l'entreprise ?]
- Signaux budgétaires : [signes de pression budgétaire ou de réorganisation ?]

SIGNAUX CONCURRENTIELS (si connus) :
- Un concurrent mentionné dans les tickets de support ou lors des appels ? [oui/non — quel concurrent]
- Demande de comparaison de tarifs ou d'appel d'offres ? [oui/non]
- Activité LinkedIn du champion : [défend encore votre produit / silencieux / parti]

---

Produisez :

SCORE DE SANTÉ : [0-100]
Palier de santé : [VERTE 70-100 / JAUNE 40-69 / ROUGE 0-39]
Probabilité de résiliation : [FAIBLE / MOYEN / ÉLEVÉ / CRITIQUE]

Les 3 principaux signaux de risque (par ordre d'importance) :
1. [Signal] — [sévérité] — [ce que cela signifie]
2. [Signal] — [sévérité] — [ce que cela signifie]
3. [Signal] — [sévérité] — [ce que cela signifie]

Les 2 signaux positifs principaux :
1. [Signal]
2. [Signal]

Intervention recommandée :
- [Action 1 — qui la fait, avant quand]
- [Action 2 — qui la fait, avant quand]
- Escalade nécessaire ? [oui / non — et à quel niveau]

Prévision de renouvellement : [susceptible de renouveler / à risque / susceptible de résilier]
Potentiel d'expansion : [aucun / possible dans X mois / prêt à en discuter maintenant]
```

### Revue de portefeuille santé

```
Effectuer une revue de portefeuille santé sur mes comptes clients.

CSM : [nom]
Total des comptes : [N]
ARR total géré : $[X]

[Collez les données de compte dans ce format, une ligne par client :]

| Compte | ARR | Renouvellement | Dernière Connexion | Sièges Actifs | NPS | Dernier Contact | Problèmes |
|---|---|---|---|---|---|---|---|
| Entreprise A | $24K | 2 mois | Il y a 12 jours | 8/10 | 42 | Il y a 8 jours | Aucun |
| Entreprise B | $60K | 5 mois | Il y a 45 jours | 3/10 | 18 | Il y a 21 jours | Ticket support ouvert |
| Entreprise C | $12K | 1 mois | Il y a 3 jours | 10/10 | 67 | Il y a 5 jours | Aucun |
[continuer pour tous les comptes]

Produisez :

## Résumé de la santé du portefeuille
- ARR total à risque (comptes Rouges) : $[X] ([X%] du portefeuille)
- ARR total en jaune : $[X]
- ARR total sain (Vert) : $[X]
- Comptes nécessitant une action immédiate : [N]

## Paliers de risque des comptes

ROUGE — Action immédiate requise :
| Compte | ARR | Renouvellement | Signal de risque | Action |
|---|---|---|---|---|
| [Entreprise] | $[X] | [X mois] | [risque principal] | [action spécifique] |

JAUNE — Surveillance active :
[même tableau]

VERT — Sain / prêt pour l'expansion :
[même tableau]

## Liste de priorités CS de cette semaine
1. [Compte] — [pourquoi urgent] — [action spécifique]
2. [Compte] — [pourquoi urgent] — [action spécifique]
3. [Compte] — [pourquoi urgent] — [action spécifique]

## Renouvellements dans les 60 prochains jours — préparation au renouvellement :
| Compte | ARR | Date de renouvellement | Santé | Action nécessaire |
|---|---|---|---|---|
[tableau]

## ARR à risque ce trimestre : $[X]
Estimation de récupération conservative (si actions prises) : $[X]
```

### Détection des signaux de résiliation

```
Analysez ces signaux client et dites-moi le risque de résiliation.

Client : [Entreprise]
Contrat : $[X] ARR, renouvellement [date]

Signaux à évaluer :
[Décrivez ce que vous avez observé — collez des e-mails, résumés de tickets de support, données d'utilisation ou notes d'appels]

Utilisez ce cadre de scoring des signaux de résiliation :

DÉTÉRIORATION DE L'UTILISATION (le plus prédictif) :
- Connexions en baisse > 30% MoM : signal de risque ÉLEVÉ
- Fonctionnalité principale non utilisée depuis > 30 jours : signal de risque ÉLEVÉ
- Utilisation des sièges tombée sous 40% : signal de risque MOYEN
- Aucun nouvel utilisateur ajouté depuis > 60 jours : signal de risque MOYEN

DÉTÉRIORATION DE L'ENGAGEMENT :
- Sollicitation du CSM sans réponse depuis > 7 jours : signal de risque ÉLEVÉ
- Sponsor exécutif injoignable : signal de risque ÉLEVÉ
- Le champion a quitté l'entreprise : CRITIQUE — traiter comme un nouveau deal
- Client manquant ou annulant des appels planifiés : signal de risque ÉLEVÉ
- NPS passé de Promoteur à Passif ou de Passif à Détracteur : signal de risque MOYEN

SIGNAUX COMMERCIAUX :
- Facture > 30 jours de retard : signal de risque ÉLEVÉ
- Demande d'informations sur les conditions du contrat, le processus de résiliation ou l'export de données : CRITIQUE
- Demande de remise sans raison d'expansion déclarée : signal de risque MOYEN
- Réduction des effectifs ou gel budgétaire dans leur entreprise : signal de risque MOYEN

SIGNAUX CONCURRENTIELS :
- A mentionné un concurrent par son nom : signal de risque ÉLEVÉ
- Demande de comparaison de tarifs ou d'appel d'offres : CRITIQUE
- LinkedIn montre que le champion utilise maintenant le produit d'un concurrent : CRITIQUE

Évaluez les signaux et produisez :
- Probabilité de résiliation : [X%] — dérivée du nombre et de la sévérité des signaux
- Horizon temporel : susceptible de résilier dans [30 / 60 / 90+ jours]
- Hypothèse sur la cause profonde : [pourquoi cela se produit — adéquation produit / support / changement business / mal vendu]
- Playbook de sauvegarde : [séquence d'actions spécifique pour ce profil de risque spécifique]
- Escalade : [qui d'autre devrait être impliqué et pourquoi]
```

### Calibration du modèle de score de santé

```
Aidez-moi à calibrer mon modèle de score de santé en fonction des données récentes de résiliation.

Contexte :
- Comptes résiliés le trimestre dernier : [N comptes, total $X ARR]
- Qu'avaient en commun les comptes résiliés ? [décrivez les patterns observés]
- Quel était leur score de santé le mois précédant la résiliation ? [si vous le suiviez]
- Comptes ayant renouvelé de manière inattendue malgré une santé faible : [des exemples ?]

Modèle de score de santé à examiner :
Pondérations actuelles :
- Signaux d'utilisation : [X%]
- Signaux relationnels : [X%]
- Signaux commerciaux : [X%]
- Signaux de résultats : [X%]

Définitions actuelles des signaux :
[décrivez ce que vous mesurez pour chacun]

Analyse de calibration :

1. Quels signaux étaient des indicateurs avancés (apparus avant la résiliation) ?
   Les meilleurs signaux de santé prédisent la résiliation 60 à 90 jours à l'avance — pas 2 semaines avant.

2. Quels signaux étaient retardés (visibles seulement à la résiliation, trop tard pour agir) ?
   La facture en retard et les demandes d'annulation sont retardées — à ce stade, c'est en mode crise, pas en prévention.

3. Faux positifs — comptes qui ont scoré rouge mais ont renouvelé :
   Qu'avaient-ils de différent ? Ajustez la pondération pour réduire la fatigue aux fausses alertes.

4. Faux négatifs — comptes qui ont scoré vert mais ont résilié :
   Quel signal vous manquait ? Ajoutez-le ou augmentez son poids.

5. Ajustement de pondération recommandé :
   Avant : [pondérations actuelles]
   Après : [pondérations recommandées basées sur la précision prédictive]
   Justification : [pourquoi chaque changement]

6. Nouveaux signaux à ajouter :
   - [Signal] — source de données : [où l'obtenir] — avancé/retardé : [type]

Produisez le modèle de score de santé mis à jour avec les pondérations recalibrées et les définitions des signaux.
```

## Exemple

**Utilisateur :** Un de mes comptes à 85 K$ ARR s'est tu. Le champion n'a pas répondu à deux e-mails en 3 semaines. L'utilisation semble correcte en surface (ils se connectent) mais c'est juste une personne. Ils renouvellent dans 8 semaines. Que faire ?

**Analyse de santé de Claude :**

**Score de santé : 34/100 — ROUGE**
**Probabilité de résiliation : ÉLEVÉE — risque se matérialisant maintenant**

**Ce que vous décrivez est un signal d'utilisation faux positif classique :**
Une personne se connectant pour maintenir le compte « actif » pendant que la décision d'achat se déroule en coulisses. L'adoption réelle, c'est 1 personne, pas une équipe. Ce n'est pas un signal d'utilisation — c'est un signal de risque.

**Signaux de risque actifs :**
1. Champion non réactif x 2 tentatives (ÉLEVÉ) — soit ils ne sont plus votre champion, soit la conversation est remontée au-dessus de leur niveau
2. Adoption mono-utilisateur (ÉLEVÉ) — le produit n'a jamais atteint une adoption d'équipe ; aucune partie prenante interne n'a de jeu dans la partie
3. 8 semaines avant le renouvellement sans engagement (CRITIQUE) — vous manquez de temps pour les mouvements CS normaux

**Intervention recommandée — faites-le cette semaine, pas la semaine prochaine :**

1. **Contournez le champion.** Trouvez leur manager ou le décideur économique sur LinkedIn. Envoyez un e-mail bref et direct : « J'essaie de joindre [Nom] sans succès. Je veux m'assurer que [Entreprise] tire pleinement profit de votre investissement avec nous à l'approche du renouvellement — pouvons-nous nous connecter pour 20 minutes ce mois-ci ? »

2. **Utilisez les données produit comme accroche.** Envoyez un e-mail au champion (une dernière tentative) : « J'ai extrait les données d'utilisation de votre équipe avant votre renouvellement et j'ai remarqué que nous sous-utilisons largement [fonctionnalité] qui génère généralement [résultat spécifique] pour des équipes comme la vôtre. J'aimerais vous montrer ce que font les autres entreprises du secteur [X] — 15 minutes cette semaine ? »

3. **Informez votre AE maintenant.** Ne les surprenez pas à 2 semaines du renouvellement. Ils ont peut-être une relation au niveau exécutif.

**Si aucune réponse en 5 jours :** Escaladez en interne. Demandez à votre VP d'envoyer un e-mail direct à celui qui a signé le contrat initial. Cadrez-le comme une revue business, pas un push au renouvellement.

**Potentiel d'expansion : Aucun tant que la santé n'est pas rétablie.**

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous créons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
