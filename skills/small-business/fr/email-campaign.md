---
name: email-campaign
description: "Email marketing pour petites entreprises : structure de campagne, lignes d'objet, variantes de copie par segment, configuration de test A/B, séquences de réengagement et analyse de performance"
---

# Email Campaign

## When to activate
- Planification d'une campagne promotionnelle et besoin d'atteindre différents segments de clients avec des messages différents
- Vos taux d'ouverture d'emails sont en dessous de 20% et vous voulez comprendre pourquoi et corriger
- Vous avez une liste d'abonnés inactifs et avez besoin d'une séquence de réengagement avant votre prochaine campagne
- Vous voulez mettre en place un test A/B mais ne savez pas quoi tester ou comment lire les résultats

## When NOT to use
- Configuration de plateforme e-mail, configuration d'automatisation ou conception de modèle — utilisez la documentation de votre ESP (Klaviyo, Mailchimp, ActiveCampaign) pour ça
- Stratégie de croissance de liste — cette compétence gère ce qu'envoyer, pas comment développer la liste
- Emails transactionnels (confirmations de commande, réinitialisations de mot de passe) — ceux-ci ont des exigences de conformité différentes et appartiennent au générateur de flux de votre plateforme

## Instructions

### Campaign planning

Avant d'écrire un seul mot, définissez la structure de la campagne. Dites à Claude :
- L'offre ou la nouvelle que vous voulez communiquer (soyez spécifique — « 20% de réduction sur tous les chaussures ce week-end » est utilisable ; « nous avons une vente » ne l'est pas)
- Les segments de votre liste (nouveaux abonnés, acheteurs récents, clients dormants, VIP, etc.)
- L'objectif de la campagne — un objectif, pas trois (entraîner les achats, réserver des rendez-vous, obtenir des RSVPs, annoncer des nouvelles)
- Votre chronologie (date de lancement, date de fin si c'est une vente)
- Combien d'emails vous êtes disposé à envoyer pour cette campagne (la plupart des campagnes de petite entreprise sont 2-3 emails)

Claude construit la carte de campagne : quels emails vont à quels segments, quel est le travail de chaque email, les temps d'envoi suggérés en fonction du type d'audience, et la logique de séquence (par ex., « l'email 2 va seulement aux ouvreurs de l'email 1, ou à tout le monde ? »).

---

### Subject lines

Les lignes d'objet déterminent le taux d'ouverture plus que tout autre facteur. Dites à Claude :
- Le contenu de l'email
- Le segment d'audience
- L'objectif de la campagne
- Votre ton de marque (ludique, direct, chaud, professionnel)

Claude génère 8 options de ligne d'objet dans quatre styles :
- 2 directs : énoncé simple de l'offre ou de la nouvelle
- 2 pilotés par la curiosité : ouvrir une boucle que l'email ferme
- 2 basés sur l'urgence : délai ou encadrement de rareté (utilisez-les uniquement si l'urgence est réelle)
- 2 axés sur les avantages : mener avec ce que le lecteur gagne

Claude signale laquelle pour A/B tester. Habituellement, l'option directe la plus simple par rapport à l'option de curiosité ou d'avantage la plus forte. Ne testez pas deux styles similaires — testez des approches véritablement différentes pour apprendre quelque chose d'utile.

Critères : les taux d'ouverture au-dessus de 20% sont sains pour la plupart des petites entreprises. Au-dessus de 28% est fort. En dessous de 15% signifie que vos lignes d'objet ou votre réputation d'expéditeur a besoin de travail. Si votre liste n'a pas été nettoyée depuis plus de 12 mois, les faibles taux d'ouverture peuvent être un problème de délivrabilité, pas un problème de copie.

---

### Email copy

Un email, un travail. Dites à Claude :
- La ligne d'objet que vous avez choisie
- Le segment d'audience et ce qu'ils savent de vous
- L'offre ou le message
- L'appel à l'action unique (un lien ou un bouton, pas trois)

Claude écrit trois sections :

**Crochet** — les 1-2 premières phrases du corps de l'email. C'est ce qui apparaît dans le volet d'aperçu à côté de la ligne d'objet. Il doit gagner le clic. Claude l'écrit pour continuer l'élan de la ligne d'objet, pas le répéter.

**Corps** — 3-4 courts paragraphes. La plupart des emails de petite entreprise sont lus en moins de 30 secondes. Claude écrit pour les scanneurs : courts paragraphes, langage concret, pas de remplissage.

**CTA** — une action claire avec texte de bouton ou de lien spécifique. « Achetez la vente » est mieux que « Cliquez ici. » « Réservez votre appel gratuit » est mieux que « En savoir plus. »

Variantes de segment : les clients fidèles reçoivent un encadrement d'appréciation (« Vous êtes avec nous depuis le début, alors vous obtenez un accès précoce... »). Les nouveaux abonnés reçoivent un encadrement d'avantages (« Voici ce que nous avons promis quand vous vous êtes inscrit... »). Les clients dormants reçoivent un encadrement de réengagement honnête (« Ça fait un moment. Voici ce qui a changé. »).

---

### A/B test setup

Dites à Claude ce que vous voulez tester. Une variable par test — tester la ligne d'objet par rapport au CTA dans le même test ne vous dit rien.

Les bonnes choses à tester pour les listes d'email de petite entreprise :
- Ligne d'objet (plus impactante, affecte le taux d'ouverture)
- Texte CTA (affecte le taux de clic)
- Longueur de l'email — court (150 mots) vs. moyen (350 mots)
- Temps d'envoi — mardi matin vs. jeudi après-midi

Claude écrit les deux variantes et vous dit : quelle est la différence entre elles, quelle métrique à regarder, quelle taille d'échantillon dont vous avez besoin pour voir un résultat significatif, et combien de temps pour exécuter le test avant de le lire.

Après le test : collez vos résultats (le taux d'ouverture de la variante A X %, le taux d'ouverture de la variante B Y %, la taille d'envoi Z). Claude vous dit ce que les résultats signifient, si la différence est significative ou du bruit, et quoi faire ensuite.

---

### Re-engagement sequences

Pour les abonnés qui n'ont pas ouvert depuis 90 jours ou plus.

Dites à Claude : la taille de votre liste, combien sont inactifs (90+ jours pas ouvert), ce que vous leur avez envoyé en dernier, et ce que votre entreprise offre maintenant qui vaut la réengagement.

Claude écrit une séquence de 3 emails :

**Email 1 — « Toujours là ? »** Reconnaître le silence, offrir quelque chose de vraiment utile (une ressource gratuite, un accès précoce, une mise à jour pertinente). Pas de culpabilité, pas de manipulation.

**Email 2 — Rappel de valeur.** Ce pour quoi ils se sont inscrits et pourquoi cela vaut toujours la peine d'être sur votre liste. Un point de preuve concret : un résultat récent de client, un contenu populaire, un produit qu'ils pourraient avoir manqué.

**Email 3 — Offre de désinscription final.** Encadrement honnête : « Si ce n'est plus pertinent, pas de problème — désabonnez-vous ci-dessous. Si vous aimeriez rester, vous n'avez rien à faire. » C'est l'étape du coucher de soleil.

Après la séquence : dites à Claude combien se sont réengagés (ont ouvert ou cliqué l'un des 3 emails). Claude rédige le message final pour tous ceux qui ne l'ont pas — une confirmation de désinscription propre. Supprimer les abonnés inactifs améliore la délivrabilité pour tous les autres.

---

### Performance analysis

Après une campagne, collez vos statistiques : taille d'envoi, taux d'ouverture, taux de clic, taux de désinscription, revenus générés (si traçable). Dites à Claude ce que vous attendiez.

Claude vous dit :
- Si chaque métrique est au-dessus ou au-dessous de la ligne de base pour votre industrie et taille de liste
- Ce que le modèle signifie (taux d'ouverture élevé, clic bas = ligne d'objet fonctionnant mais email ne livrant pas ; taux d'ouverture bas, clic élevé parmi les ouvreurs = problème de ligne d'objet, pas de problème de copie)
- Une chose spécifique à changer dans votre prochaine campagne en fonction des données

---

### Prompt template — campaign

```
S'il vous plaît, planifiez une campagne [X]-email.

Offre : [offre spécifique, avec dates le cas échéant]
Objectif : [un objectif]
Segments :
- [Segment 1] : [taille, relation avec votre entreprise]
- [Segment 2] : [taille]

Chronologie : [date de lancement] à [date de fin]
Ton de marque : [ludique/direct/chaud/professionnel]

S'il vous plaît, donnez-moi :
1. Carte de campagne (quel email va à quel segment, dans quel ordre)
2. 8 options de ligne d'objet pour le premier email (2 directs, 2 curiosité, 2 urgence, 2 avantages)
3. Indiquez laquelle 2 à A/B tester
4. Ébauche du premier email pour [segment principal]
```

## Example

Une boutique pour femmes dirige une vente d'été de 3 jours. Le propriétaire dit à Claude l'offre (25% de réduction sur tous les robes d'été), la liste (2 400 total : 800 achetés dans les 60 derniers jours, 1 100 achetés 61-180 jours, 500 inactifs 180+ jours) et l'objectif (entraîner les achats avant la fin de la vente dimanche).

Claude construit :

Carte de campagne : Email 1 (jeudi, liste complète) — annonce de vente, tous les segments. Email 2 (vendredi, ouvreurs de l'email 1 seulement) — meilleures robes en vedette avec preuve sociale. Email 3 (dimanche matin, acheteurs non-acheteurs qui ont ouvert l'un ou l'autre email) — dernière chance, urgence de fin de journée.

Lignes d'objet pour Email 1 (direct) : « 25% de réduction sur les robes d'été — ce week-end seulement. » (Curiosité) : « Votre garde-robe manque quelque chose. » (Urgence) : « 3 jours. 25% de réduction. Pas de code nécessaire. » (Avantage) : « La robe que vous avez regardée vient de devenir moins chère. »

Recommandation de test A/B : « 25% de réduction sur les robes d'été — ce week-end seulement » par rapport à « La robe que vous avez regardée vient de devenir moins chère » — encadrement direct par rapport à avantages.

Résultats après avoir exécuté la campagne : taux d'ouverture de 31% sur Email 1, taux de clic de 8,2%, $4 100 en revenus suivi à la campagne. Les campagnes précédentes affichaient une moyenne de 19% d'ouverture et 4,1% de clic. Analyse Claude : la ligne d'objet à cadrage bénéficiaire a surpassé la version directe de 4 points de pourcentage en taux d'ouverture — utilisez le cadrage bénéficiaire comme défaut pour les campagnes promotionnelles à l'avenir.

---
