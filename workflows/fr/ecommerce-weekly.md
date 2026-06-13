# Flux de travail hebdomadaire — Opérateur e-commerce

Un flux de travail hebdomadaire reproductible pour un opérateur e-commerce augmenté par l'IA — couvrant le suivi des ventes, l'optimisation des fiches produit, le service client, l'e-mail marketing, la performance publicitaire et la gestion des stocks.

---

## Vue d'ensemble

**Investissement en temps :** ~2-3 heures de sessions Claude Code structurées par semaine (remplace 10-12 heures de travail manuel).

**Ce que ce flux de travail couvre :**
- Chaque matin : tableau de bord des ventes + triage client (20 minutes)
- Lundi : planification hebdomadaire + lancement de la campagne e-mail
- Mardi-mercredi : travail sur les fiches produit et le SEO
- Jeudi : performance publicitaire et marketing payant
- Vendredi : rapport hebdomadaire + planification des stocks

**Prérequis :** Au minimum `/ecommerce-seller`, `/product-listing-optimizer`, et `/review-response` installés.

---

## Quotidien — Routine matinale (20 minutes, chaque jour)

### Vérification du tableau de bord des ventes

```
/ecommerce-seller

Bilan quotidien — [DATE] :

Performance d'hier :
- Chiffre d'affaires : [$X] vs. [$X même jour la semaine dernière] vs. [$X objectif quotidien]
- Commandes : [X] / Panier moyen : [$X]
- Produit de tête en unités : [nom, X unités]
- Taux d'abandon de panier : [X%]

Service client :
- Nouvelles demandes : [X] — des urgences/escalades ?
- Demandes de retour : [X]
- Nouveaux avis : [positifs : X / neutres : X / négatifs : X]

Alertes stocks :
- Tout SKU avec moins de 14 jours de stock à la vélocité actuelle : [liste ou aucun]
- Un réapprovisionnement qui aurait dû être passé et ne l'a pas été ?

Marketing :
- Dépenses publicitaires d'hier : [$X] / Chiffre d'affaires attribué : [$X] / ROAS : [X]
- Performance de la campagne e-mail active : [taux d'ouverture, taux de clic si envoyée]

Signalez : ce qui nécessite une attention aujourd'hui (classé par urgence) ?
```

---

### Triage du service client (15 minutes)

**Réponse aux avis :**

```
/review-response

[Collez les nouveaux avis de la nuit — avec la note en étoiles et la plateforme]

Pour les avis négatifs (1-3 étoiles) : rédigez une réponse professionnelle traitant la plainte spécifique.
Pour les avis positifs : remerciez brièvement (optionnel, utile sur Amazon).
Pour les avis neutres contenant une préoccupation : traitez comme un négatif.

Moins de 100 mots par réponse. Jamais sur la défensive.
```

**Demandes de retour et de remboursement :**

```
/returns-handler

Nouvelles demandes de retour :
1. [Décrivez la demande — produit, plainte, date de commande, valeur]
2. [etc.]

Pour chacune : dans les règles ? [oui/non] → rédigez la réponse appropriée + note interne.
```

---

## Lundi — Planification de la semaine et lancement e-mail

### 9h00-9h30 — Planification de la semaine

```
/ecommerce-seller

Planification de la semaine du [PLAGE DE DATES] :

Performance de la semaine dernière :
- Chiffre d'affaires : [$X] vs. [$X objectif]
- Meilleure performance : [SKU + chiffre d'affaires]
- Moins bonne performance : [SKU]
- Charge du service client : [X tickets, X retours]

Cette semaine :
- Des événements promotionnels ou soldes à venir ? [oui/non + détails]
- Des mots-clés saisonniers qui devraient atteindre leur pic cette semaine ? [ex. "cadeaux fête des pères"]
- Produits à prioriser pour le travail sur les fiches cette semaine : [liste]
- Publicités à revoir : [campagnes nécessitant un rafraîchissement créatif ou un ajustement des enchères]

Top 3 priorités de la semaine : qu'est-ce qui va le plus faire évoluer le chiffre d'affaires ?
```

### 9h30-10h30 — Lancement de la campagne e-mail

```
/email-campaign

E-mail de cette semaine :
- Segment : [nom du segment, taille — ou liste complète]
- Objectif : [générer du chiffre d'affaires / réengager les inactifs / annoncer un nouveau produit]
- Offre : [% de réduction / nouvelle arrivée / contenu / accroche saisonnière]
- Jour et heure d'envoi : [recommandation basée sur le segment]

Produisez :
- Ligne d'objet (variantes A/B)
- Texte d'aperçu
- Brouillon d'e-mail (bref mais complet — hero, corps, CTA)
- Paramètres UTM pour le suivi

Après approbation, planifiez dans [Klaviyo / Mailchimp / votre plateforme].
```

---

## Mardi — Optimisation des fiches produit

### 9h00-11h00 — Travail sur les fiches produit

**Priorisez par :** taux de conversion le plus bas parmi vos 20 SKUs à plus fort chiffre d'affaires.

**Fiche nouvelle ou sous-performante :**

```
/product-listing-optimizer

Marketplace : [Amazon / Shopify / Etsy]
Produit : [nom]
Performance actuelle : [taux de conversion X%, position de classement pour le mot-clé principal]
Client cible : [qui achète ça]
Caractéristiques clés : [liste]
Concurrents : [nommez 2-3]

Mode : [Optimisation complète / Audit uniquement]

Produisez : recherche de mots-clés, titre optimisé, points de vente, description, brief image.
```

**Rafraîchissement saisonnier (si applicable) :**

```
/product-listing-optimizer

Mode rafraîchissement saisonnier.

Produit : [nom]
Saison/événement : [Q4 / Prime Day / Fête des mères / etc.]
Titre + points de vente actuels : [collez]

Ajoutez l'angle saisonnier sans effectuer de changements permanents. Signalez les modifications à annuler après l'événement.
```

**Suivez ce que vous avez modifié :**
Après chaque mise à jour de fiche, notez : date, ce qui a changé, taux de conversion actuel. Revoyez dans 14 jours.

---

## Mercredi — SEO et veille concurrentielle

### 10h00-11h00 — Revue concurrentielle et des mots-clés

Exécutez mensuellement, pas hebdomadairement. Mais utilisez les mercredis pour ça quand ça se présente :

```
/product-listing-optimizer

Analyse des écarts concurrentiels pour : [catégorie de produit]

Mon SKU de tête : [nom]
Concurrents : [nommez 2-3 + leurs URLs ou ASINs]

Trouvez :
- Mots-clés sur lesquels les concurrents se classent et pas moi
- Plaintes dans les avis concurrents que mon produit résout
- Lacunes visuelles dans leurs fiches (images manquantes)

Produisez : liste d'écarts de mots-clés + angles de différenciation que je devrais mettre en avant dans ma prochaine mise à jour de fiche.
```

---

## Jeudi — Performance des publicités payantes et marketing

### 10h00-11h00 — Revue de performance publicitaire

```
/paid-ads

Plateforme : [Meta Ads / Google Ads / Amazon PPC]

Performance des 7 derniers jours :
- Dépenses totales : [$X]
- Chiffre d'affaires attribué : [$X] / ROAS : [X]
- CTR : [X%] / Taux de conversion : [X%]

Par campagne :
[Listez chaque campagne active : nom, dépenses, ROAS, CTR]

Analysez :
1. Quelles campagnes sont en dessous du ROAS cible ($[X] cible) ?
   → Recommandation : mettre en pause / réduire les enchères / nouveau créatif
2. Quelles campagnes sont au-dessus de l'objectif ?
   → Recommandation : augmenter les dépenses
3. Des ensembles d'annonces avec CTR > 2% mais conversion < 1% ?
   → Probablement un problème de page de destination, pas de l'annonce
4. Des audiences qui saturent ? (CTR en baisse semaine après semaine)
   → Temps pour un nouveau créatif ou une expansion d'audience

Produisez : changements spécifiques à effectuer aujourd'hui + brief créatif pour toute annonce nécessitant un rafraîchissement.
```

### 11h00-11h30 — Production créative (si nécessaire)

```
/paid-ads

Rédigez le texte publicitaire pour : [nom de la campagne et objectif]
Produit : [nom et caractéristiques clés]
Audience cible : [démographie + intérêts + points de douleur]
Offre : [le cas échéant — réduction, bundle, seuil de livraison gratuite]
Format : [image unique / carrousel / script vidéo]

Rédigez : variantes de titre (5), variantes de texte principal (3), options CTA, et un brief pour l'équipe créative/designer.
```

---

## Vendredi — Rapport hebdomadaire et planification des stocks

### 14h00-15h00 — Planification des stocks et des réapprovisionnements

```
/ecommerce-seller

Planification des stocks pour la semaine se terminant le [DATE] :

Stock actuel par SKU :
[Collez votre CSV d'inventaire ou les SKUs clés avec : unités en stock, vélocité de ventes journalières des 14 derniers jours]

Délais d'approvisionnement :
- Fournisseur A : [X jours]
- Fournisseur B : [X jours]

Règles de réapprovisionnement :
- Point de réapprovisionnement : [X jours de stock restant]
- Quantité minimale de commande : [X unités par SKU]

Produisez :
1. Liste des risques de rupture de stock : SKUs atteignant le point de réapprovisionnement dans < 14 jours
2. Articles en surstock : > 90 jours de stock — recommandez réduction, bundle, ou pause des dépenses publicitaires
3. Recommandation de réapprovisionnement : quels SKUs commander maintenant, quantité, et date d'arrivée prévue
4. Instructions aux fournisseurs : formatez les demandes de réapprovisionnement pour chaque fournisseur
```

### 15h00-16h00 — Rapport de performance hebdomadaire

```
/ecommerce-seller

Rapport hebdomadaire pour la semaine se terminant le [DATE] :

Chiffre d'affaires : [$X] vs. [$X semaine précédente] vs. [$X objectif]
Commandes : [X] / Panier moyen : [$X]
Unités vendues : [X]
Taux de retour cette semaine : [X%]

Marketing :
- E-mail : envoyé à [X] abonnés, taux d'ouverture [X%], taux de clic [X%], chiffre d'affaires $[X]
- Publicités payantes : dépenses $[X], ROAS [X], chiffre d'affaires $[X]
- Organique : [toutes mises à jour SEO/fiches produit effectuées cette semaine]

Service client :
- Tickets : [X] / Délai de réponse moyen : [X heures]
- Retours : [X] / Valeur totale des remboursements : [$X]
- Nouveaux avis négatifs : [X] / Tous répondus : [oui/non]

Produit de tête : [SKU, unités, chiffre d'affaires]
Moins bon produit : [SKU, unités — signalez si en dessous des attentes]

Fiches mises à jour cette semaine : [liste]
Tests A/B en cours : [liste avec statut actuel]

Priorités de la semaine prochaine : [top 3 basé sur les données de cette semaine]

Format : résumé exécutif en 3 points + détail complet pour les archives.
```

---

## Rythme mensuel

### Première semaine du mois — Reporting complet

```
/ecommerce-seller

Rapport mensuel pour [MOIS] :

Chiffre d'affaires : [$X] vs. [$X objectif] vs. [$X même mois l'année dernière]
Commandes : [X] / Panier moyen : [$X] / Unités totales : [X]
Taux de retour : [X%] — tendance vs. les 3 derniers mois : [en hausse/stable/en baisse]

Top 5 SKUs par chiffre d'affaires : [liste]
Bottom 5 SKUs par marge (si connu) : [liste]

Programme e-mail :
- Envois totaux : [X]
- Taux d'ouverture moyen : [X%] / taux de clic : [X%]
- Chiffre d'affaires attribué : [$X]

Publicités payantes :
- Dépenses totales : [$X] / Chiffre d'affaires attribué : [$X] / ROAS combiné : [X]

Fiches et stocks :
- Ruptures de stock : [X incidents, X jours en rupture]
- Dépréciations de surstock : [$X le cas échéant]

Service client :
- Total tickets : [X] / Taux de retour : [X%] / CSAT si suivi : [X]

Qu'est-ce qui a fonctionné ce mois ?
Qu'est-ce qui n'a pas fonctionné ?
Que changer pour le mois prochain ?
```

### Planification saisonnière (90-60 jours avant les grands événements)

```
@ecommerce-specialist

Préparez notre plan [SAISON / ÉVÉNEMENT].

Produits à mettre en avant : [liste avec niveaux de stocks]
Mouvements probables des concurrents : [ce que vous savez ou anticipez]
Budget : [$X pour publicités + promotion e-mail]
Date de l'événement : [date]
Date d'aujourd'hui : [date]

Produisez :
- Liste de contrôle à 90/60/30 jours
- Stratégie de prix et de réductions
- Plan de rafraîchissement des fiches (quels SKUs nécessitent une mise à jour saisonnière)
- Calendrier e-mail : [N e-mails, thèmes, dates d'envoi]
- Allocation du budget publicitaire
- Réapprovisionnement des stocks : quantités à commander et date limite de commande basée sur les délais d'approvisionnement
```

---

## Quand les choses tournent mal

### "Le ROAS a baissé de 30 % cette semaine"

```
/paid-ads

Diagnostic ROAS :
Plateforme : [précisez]
ROAS actuel : [X] — moyenne du mois dernier : [X]

Vérifiez :
1. Le CPM (coût pour 1 000 impressions) a-t-il augmenté ? → Saturation de l'audience ou pression concurrentielle
2. Le CTR a-t-il baissé ? → Fatigue créative
3. Le taux de conversion a-t-il baissé avec un CTR stable ? → Problème de page de destination ou de fiche
4. Le panier moyen a-t-il baissé ? → Mauvais produit mis en avant ou offre moins attractive

Identifiez la métrique qui a changé en premier. C'est là que se trouve le problème.
Diagnostic recommandé : changez une variable à la fois.
```

### "J'ai un avis négatif qui devient viral"

```
/review-response

Situation d'avis escaladé :
Plateforme : [Amazon / Google / Trustpilot / réseaux sociaux]
Texte de l'avis : [collez]
Note en étoiles : [1]
Engagement : [X likes/partages — ça prend de l'ampleur]
Détails de la commande : [ce que nous savons sur ce client et cette commande]
La plainte est-elle factuellement exacte ? [oui / partielle / non]

Rédigez :
1. Réponse publique (moins de 100 mots — calme, factuel, orienté solution)
2. Message d'approche privée à l'auteur de l'avis
3. Note interne : quel problème systémique cet avis révèle-t-il, le cas échéant ?
```

### "Un produit clé est en rupture de stock et je perds mon classement"

```
/ecommerce-seller

Plan de rétablissement après rupture de stock pour : [nom du produit]

Statut actuel : 0 unités / réapprovisionnement estimé : [date]
Classement actuel pour le mot-clé principal : [position — était [X] avant la rupture]
Impact sur le chiffre d'affaires quotidien : [$X par jour]
Options fournisseurs :
- Option A : [délai, coût]
- Option B (accéléré) : [délai, coût plus élevé]

Recommandez :
1. Faut-il accélérer (ROI du coût accéléré vs. valeur du rétablissement du classement)
2. Comment minimiser les dommages au classement pendant la rupture de stock (réduire les dépenses publicitaires, marquer comme "temporairement indisponible" vs. laisser actif)
3. Stratégie de relancement une fois restocké (campagne de demande d'avis, calendrier de montée en puissance publicitaire)
```

---

## Indicateurs de référence clés

| Métrique | Objectif | Investiguer si... |
|---|---|---|
| Taux de conversion produit | > 3 % (Shopify) / > 15 % (Amazon) | < 1,5 % / < 8 % |
| Taux de retour | < 10 % | > 20 % |
| Taux de réponse aux avis négatifs | 100 % | Tout avis sans réponse |
| ROAS e-mail | > 10x | < 5x |
| ROAS publicités payantes | > 3x | < 2x |
| Taux de rupture de stock | < 2 % des SKUs | > 5 % |
| Délai de réponse client | < 4 heures | > 24 heures |
| Cadence de mise à jour des fiches | Mensuelle pour les 20 SKUs principaux | Trimestrielle ou moins |

---
