# Optimiseur de Prix

## Quand activer
- Tu envisages une augmentation de prix et tu veux un framework structuré plutôt que de deviner
- Tu n'as pas revu les prix depuis 18+ mois et l'inflation seule a érodé tes prix réels
- Tu lances un nouveau produit ou service et tu as besoin d'un prix défendable plutôt que "ce qui semble juste"
- Tes services sont tarifés différemment pour différents clients sans logique claire — tu soupçonnes de sous-facturer tes meilleurs clients
- Un concurrent a augmenté ou baissé ses prix et tu dois décider comment réagir

## Quand NE PAS utiliser
- Tu es sur un marché de commodités où les prix sont fixés par le marché, pas par toi — la dynamique de course vers le bas domine la stratégie de prix
- Tu as un CFO ou un analyste de prix qui gère déjà les revues de prix structurées
- Tu suis pré-product-market-fit — atteins d'abord PMF, puis optimise les prix

## Instructions

### Étape 1 : Établis ton contexte de prix

Di:

"Je dirige un [type d'entreprise] vendant [produit/service]. Ma tarification actuelle est [liste chaque tier ou produit avec son prix]. Valeur de durée de vie client moyenne est [$X]. Ma marge brute est [Y%]. Mon client typique est [persona]. Mes principaux concurrents tarifent à [liste — nom et point de prix approximatif]. J'ai changé les prix [Z] fois au cours des 2 dernières années."

### Étape 2 : Audit de prix

Demande à Claude d'auditer ta tarification actuelle.

Di:

"Audite ma structure de prix actuelle. Signale : (1) tout tier tarifé trop près d'un autre tier (faible différenciation), (2) tout tier tarifé trop loin d'un autre tier (écart dans l'échelle de valeur), (3) tout tier tarifé sous le marché en fonction de la tarification des concurrents que j'ai fournie, (4) tout tier où le prix est rond (souvent un signe qu'il a été fixé par supposition, pas par analyse), (5) tout service ou produit qui n's'insère pas proprement dans l'échelle de prix."

Lis l'audit attentivement. Claude signalera parfois un "nombre rond" comme un problème quand le nombre rond est le bon appel — les nombres ronds réduisent la friction décisionnelle aux tiers inférieurs. Utilise l'audit comme point de départ.

### Étape 3 : Framework de décision d'augmentation de prix

Quand tu envisages une augmentation de prix :

Di:

"Je envisage une augmentation de prix sur [tier/produit] de [$X] à [$Y] — une augmentation de [Z%]. Mes clients actuels sur ce tier sont [N]. La dernière augmentation était [date]. Construis le cas pour et contre : (1) quelle est l'attrition attendue des clients existants, (2) quel est l'impact sur la demande de nouveaux clients, (3) quel est l'impact sur le positionnement de la marque, (4) quel est le coût opérationnel de gérer deux tiers de prix pendant la transition, (5) quel est le risque temporel (quelconque événement au cours des 6 prochains mois qui ferait sembler mauvaise l'augmentation)?"

Tu obtiendras un pro/con structuré. Le résultat est un outil de soutien à la décision, pas la décision elle-même.

### Étape 4 : Restructuration des tiers

Si ton audit de prix a révélé un besoin de restructurer les tiers :

Di:

"Propose 3 structures de prix alternatives pour mon entreprise : (1) une échelle de valeur à 3 tiers, (2) une structure par siège ou par unité le cas échéant, (3) une structure basée sur les résultats ou hybride. Pour chacune, montre : prix par tier, delta de valeur entre les tiers, client cible pour chaque tier, plan de migration pour les clients existants, impact de revenu projeté en année 1."

Examine les trois. Souvent la réponse "évidente" (plus de tiers) est mauvaise, et la bonne réponse est fewer, tiers plus différenciés.

### Étape 5 : Plan de migration des clients existants

Quand tu augmentes les prix des clients existants :

Di:

"J'augmente les prix sur [tier] de [$X] à [$Y] à compter du [date]. J'ai [N] clients existants sur ce tier avec ancienneté moyenne de [Z] mois. Redacte : (1) l'email d'annonce — clair, respectueux, mène avec la raison et la valeur plutôt que le prix, (2) une offre de blocage de prix pour les clients d'ancienneté longue qui bloquent à 12 mois au tarif actuel, (3) le modèle de réponse pour les clients qui se battent, (4) le modèle de réponse pour les clients qui choisissent d'annuler."

L'impact de rétention de la façon dont tu gères l'augmentation de prix compte souvent plus que l'augmentation de prix elle-même. Un email maladroit crée une attrition évitable.

### Étape 6 : Test de prix A/B

Si le volume de ton entreprise le supporte :

Di:

"Conçois un test de prix pour mon [produit/service]. Prix actuel [$X]. Variantes de test : [$Y] et [$Z]. Mon volume mensuel de trafic/lead est [N]. Conception : (1) la structure du test (quels clients voient quel prix), (2) la taille d'échantillon nécessaire pour la signification statistique, (3) les critères de décision (taux de conversion, revenu total, implications LTV), (4) la durée du test, (5) le plan de restauration si le test révèle une baisse inattendue."

La plupart des petites entreprises n'ont pas le volume pour des tests de prix A/B propres. L'analyse structurée te dit si tu le fais.

### Étape 7 : Réaction concurrente

Quand un concurrent change ses prix :

Di:

"Le concurrent [nom] vient de changer sa tarification de [$X] à [$Y]. Mon prix actuel est [$Z]. Son positionnement est [premium / mid-market / discount]. Mon positionnement est [même / différent]. Analyse : (1) l'intention stratégique probable de leur mouvement, (2) l'impact sur mon pipeline si je ne réponds pas, (3) trois options de réponse (correspondance, tenue et différenciation, augmentation pour élargir l'écart), (4) la réponse recommandée avec justification."

Ne fais pas automatiquement correspondance aux mouvements des concurrents. L'analyse structurée révèle souvent que la tenue est le bon appel.

## Exemple

Tu diriges un petit SaaS B2B pour les équipes de vente à $99/mois pour le tier Pro. Tu as 340 clients Pro — $34K MRR sur ce tier. Tu n'as pas augmenté les prix depuis 28 mois. Seule l'inflation a réduit ton prix réel d'environ 12% au cours de cette période.

Tu configures l'audit de prix. Claude signale :
- Le tier Pro ($99) est trop proche du tier Team ($149) — seulement un delta de 51% pour une lacune de capacité significative
- Le tier Pro est bien en dessous du marché — les offres mid-tier des concurrents vont de $129 à $199
- Ton tier Entreprise ($499) a trop grand un écart du Team ($149)

Tu décides d'augmenter Pro de $99 à $129 — une augmentation de 30%, mais toujours en dessous du marché.

Tu exécutes le flux de travail du plan de migration. Claude rédige :

**Email d'annonce (340 clients) :**
> Il y a deux ans, quand nous avons lancé le tier Pro à $99, notre produit avait [liste 3 fonctionnalités spécifiques au lancement]. Aujourd'hui, le même tier inclut [liste 6 fonctionnalités ajoutées depuis]. À partir du [date 60 jours], le tier Pro sera $129. Si tu aimerais bloquer le tarif actuel de $99 pour les 12 prochains mois en passant à la facturation annuelle, tu peux le faire ici : [lien]. C'est le premier changement de prix que nous avons jamais fait sur Pro. Nous nous attendons à ce qu'il soit le dernier pendant au moins 24 mois.

**Offre de blocage :** Facturation annuelle à $99/mois équivalent, bloquée jusqu'à [date 12 mois].

**Réponse à la battage :** Reconnaît les préoccupations, références l'offre de blocage, n'essaie pas de vendre à la hausse.

**Réponse d'annulation :** Reconnaît, offre une période de grâce de 30 jours, demande des commentaires.

Tu envoies. Au cours des 30 prochains jours :
- 110 des 340 clients (32%) acceptent l'offre de blocage annuel — bloqués à $99 pendant 12 mois
- 12 clients (3,5%) annulent — dans la plage d'attrition attendue du modèle
- 218 clients restent mensuels au nouveau prix de $129

Impact MRR net : $34K → $40,2K après la fin de la migration. C'est $74K de revenu incrémenta annualisé. Les 12 clients annulés représentent $14K d'ARR perdu, que tu aurais perdu de toute façon au fil du temps.

Tu planifies un rappel de calendrier de 24 mois pour revoir la tarification Pro. Le même flux de travail gère l'ajustement suivant.
