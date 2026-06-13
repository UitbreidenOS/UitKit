---
name: referral-program
description: "Conception de programme de parrainage: structure d'incitation, mécanique de parrainage, configuration du suivi, invites par e-mail/in-app, prévention de la fraude — pour SaaS, ecommerce et produits grand public"
---

# Referral Program Skill

## Quand activer
- Concevoir un programme de parrainage ou de bouche à oreille à partir de zéro
- Améliorer la conversion ou la participation dans un programme de parrainage existant
- Choisir entre les modèles d'incitation de parrainage (donner/obtenir, unilatéral, espèces, crédits)
- Rédiger les e-mails d'invitation de parrainage et la copie de la page d'accueil
- Configurer le suivi des parrainages et la prévention de la fraude

## Quand NE PAS utiliser
- Marketing d'affiliation (canal partenaire, commission) — mécanique et contrats différents
- Campagnes d'influenceurs — utilisez la compétence brand-guidelines ou social-media-manager
- Programmes partenaires/revendeurs — ventes de canal, pas de parrainages

## Instructions

### Conception du programme de parrainage

```
Concevez un programme de parrainage pour [produit].

Type de produit: [SaaS / ecommerce / application grand public / marketplace]
Modèle commercial: [abonnement / achat ponctuel / freemium]
LTV client moyen: $[X]
CAC actuel (coût d'acquisition): $[X]
Objectif d'acquisition principal: [nouvelles inscriptions / premiers achats / conversions payantes]

Cadre de conception:

1. À qui demander des parrainages:
   - Timing: demander après le moment aha, pas à l'inscription
   - Meilleurs déclencheurs: après premier moment de succès / après revue positive / à la mise à niveau
   - Segment: les utilisateurs puissants font plus de parrainages que les utilisateurs moyens; filtrer pour la cohorte engagée

2. Structure d'incitation (choisir en fonction de l'économie du produit):
   a. Donner/Obtenir (les deux côtés gagnent):
      Le parrain reçoit: [X crédit / X mois gratuit / espèces]
      Le filleul reçoit: [X crédit / essai prolongé / remise]
      Meilleur pour: SaaS, produits d'abonnement
   
   b. Unilatéral (parrain seulement):
      Le parrain reçoit: commission en espèces ou crédit par conversion
      Meilleur pour: produits à haute marge, modèles de type affiliation
   
   c. Donation caritative:
      Le parrain choisit une œuvre de charité; vous donnez $X par parrainage
      Meilleur pour: B2B, où les espèces semblent transactionnelles

3. Étalonnage des incitations:
   - Plafonner le coût de parrainage à 20-30% du LTV pour la viabilité
   - Si LTV = $[X], coût maximal de parrainage = $[X × 0.25]
   - Déclencher le paiement uniquement à la conversion payante, pas à l'inscription (prévention de la fraude)

4. Mécanique de parrainage:
   - Lien de parrainage unique par utilisateur (pas seulement un code — les liens de suivi mieux)
   - Modèles de partage d'e-mail + social pré-écrits
   - Tableau de bord: le parrain peut voir qui il a invité et le statut

Recommander la conception du programme pour mon produit avec des numéros d'incitation spécifiques.
```

### Modèles d'e-mails de parrainage

```
Écrivez les e-mails du programme de parrainage pour [produit].

Produit: [décrire]
Incitation: [le parrain reçoit X, le filleul reçoit Y]
Lien de parrainage placeholder: [REFERRAL_URL]
Ton de marque: [professionnel / décontracté / ludique]

E-mail 1 — Invitation de parrainage (du parrain au filleul):
Sujet: [personnel, pas corporatif — du point de vue du parrain]
Aperçu: [ce qu'ils vont obtenir]
Corps:
- Ouverture personnelle (écrite comme si elle venait du parrain, pas de l'entreprise)
- Description du produit en 1 phrase en utilisant un langage de preuve sociale
- L'offre: "Obtenez [X] lorsque vous vous inscrivez avec mon lien"
- [REFERRAL_URL]
- Gardez moins de 100 mots

E-mail 2 — Annonce du programme de parrainage (aux utilisateurs existants):
Sujet: [Donnez [X], Obtenez [X] — partagez [produit] avec votre équipe]
Objectif: impulser la participation de la base d'utilisateurs actuelle
Corps:
- Commencez par leur récompense (pas l'avantage du produit)
- Explication simple du fonctionnement (3 étapes maximum)
- CTA: "Obtenez mon lien de parrainage" → lien vers le tableau de bord
- Boutons de partage social pré-configurés

E-mail 3 — Rappel aux non-participants (14 jours après le lancement):
Sujet: [Vous n'avez pas encore essayé notre programme de parrainage]
Objectif: convertir les non-participants avec la preuve sociale
Corps:
- "[X] utilisateurs ont déjà gagnées [récompense] ce mois-ci"
- Suppression de friction: "Cela prend 30 secondes pour obtenir votre lien"
- CTA: même que l'e-mail 2

E-mail 4 — Notification de parrainage reçu (au parrain):
Sujet: [[First name] vient de s'inscrire avec votre lien]
Objectif: renforcer la participation, impulser un deuxième parrainage
Corps:
- Confirmation: "[Name] s'est inscrit! Vous obtiendrez [récompense] quand ils [convertissent]."
- Progression si applicable: "Vous avez parrainé [X] — [Y plus] jusqu'à [niveau bonus]"
- "Connaissez-vous quelqu'un d'autre?" — CTA secondaire

Écrivez les 4 e-mails pour mon produit.
```

### Page d'accueil de parrainage

```
Écrivez la copie de la page d'accueil de parrainage pour [produit].

URL de la page: /invite ou /referral
Contexte du visiteur: arrivé via lien de parrainage d'un ami/collègue
Leur conscience du produit: zéro à faible
L'offre qu'ils ont reçue: [X]
Avantage du produit en une ligne: [décrire]

Structure de la page:

Héros:
- Titre: "[Nom de l'ami] vous a invité à [produit]" (personnalisé via paramètre URL)
- Sous-titre: ce que le produit fait en anglais clair
- L'offre: "[X] gratuit quand vous vous inscrivez aujourd'hui"
- CTA: "Réclamez [X] et commencez" (texte de bouton basé sur l'action)

Preuve sociale (en bas de page):
- [X] clients / [X] équipes / [X] revenu suivi
- 1-2 courts témoignages

Comment ça marche (3 étapes):
1. Créez votre compte (30 secondes)
2. [Première action clé] pour commencer
3. [Moment aha] — [récompense déverrouillée]

FAQ (2-3 questions):
- "Qu'est-ce que j'obtiens gratuitement?" → répondre spécifiquement
- "Ai-je besoin d'une carte de crédit?" → répondre
- "Qu'arrive-t-il après [période d'essai/récompense]?" → répondre

CTA (répété en bas): même que le héros

Écrivez la copie complète de la page avec toutes les sections.
```

### Prévention de la fraude

```
Concevez la prévention de la fraude pour un programme de parrainage.

Type de récompense: [crédit de compte / paiement en espèces / mois gratuits]
Déclencheur de paiement: [à l'inscription / au premier achat / à la conversion payante après 30 jours]
Niveau de risque: [récompense de faible valeur / récompense de haute valeur]

Modèles de fraude courants:
1. Auto-parrainage: l'utilisateur crée un deuxième compte pour se parrainer
2. Fausses inscriptions: le parrain crée des comptes fictifs pour collecter des récompenses
3. Fraude par rétrofaction: achat complet → collecte récompense de parrainage → rétrofaction
4. Création en masse de comptes: scripts créant des centaines de comptes

Mesures de prévention:

Vérifications d'identité:
□ Déduplication du domaine de courrier électronique (bloquer les variations du même domaine: user+1@, user+2@)
□ Adresse IP: signaler les multiples inscriptions depuis la même IP dans les 24h (ne pas bloquer — signaler pour examen)
□ Empreinte digitale de l'appareil: signaler le même appareil s'inscrivant plusieurs fois
□ Vérification téléphonique pour les récompenses supérieures à $[X]

Délai de paiement:
□ Retarder le crédit de récompense de [30-60 jours] — passé la fenêtre de rétrofaction
□ Ne pas payer avant que l'utilisateur parrainé soit actif [X jours] ou ait fait [X] actions

Auto-parrainage:
□ Bloquer le même domaine de courrier électronique sur les deux comptes
□ Signaler si l'adresse de facturation correspond à un client existant

Plafonds de paiement:
□ Maximum [X] parrainages récompensés par utilisateur par mois
□ Examen manuel requis au-dessus de [X] parrainages/mois

Implémenter ces contrôles classés par effort par rapport au risque de fraude pour mon programme.
```

## Exemple

**Utilisateur:** Notre SaaS ($49/mois, LTV moyen de 18 mois = $882) n'a pas de programme de parrainage. Les clients nous disent fréquemment qu'ils nous recommandent à des collègues. Nous laissons de l'argent sur la table. Concevez un.

**Recommandation de Claude:**

Avec un LTV de $882, vous pouvez vous permettre jusqu'à $220 en coût de parrainage (25% du LTV) et toujours être en avant des la plupart des canaux payants.

**Conception du programme:**

**Donner/Obtenir: crédit de $50 pour le parrain + crédit de $50 pour le filleul**

Pourquoi les crédits, pas l'espèces:
- Les crédits ont un coût ~0 pour vous (ils sont appliqués à l'abonnement futur)
- Les utilisateurs restent engagés pour les échanger
- L'espèces à $50 par conversion a un impact réel P&L

**Mécanique:**
- Lien de parrainage (pas un code) — génère sur la page des Paramètres de Compte
- Déclencheur de paiement: le filleul reste sur le plan payant pendant 30 jours (prévient la fraude par rétrofaction)
- Tableau de bord: "Vous avez parrainé X personnes → $Y gagné"
- Plafond: 10 parrainages récompensés par utilisateur par trimestre

**Quand demander:**
Ne demandez pas à l'inscription. Demandez:
1. Après avoir exporté leur premier rapport (moment aha)
2. Après leur premier score NPS ≥ 9
3. Après le mois 3 d'utilisation active (signal de loyauté)

**Mathématiques projetées:**
Si 5% de votre base d'utilisateurs parraine 1 personne et 40% de ceux-ci se convertissent → coût par client acquis = $125 (bien en dessous de votre CAC actuel). Cela retourne généralement 15-25% de nouvelle croissance dans les programmes de parrainage matures.

**Séquence de lancement:**
1. Construire la génération de lien de parrainage (1 sprint développeur)
2. Courrier électronique des clients existants annonçant le programme
3. Ajouter une invite in-app aux 3 moments de déclenchement ci-dessus
4. Mesurer le taux de participation hebdomadaire; itérer l'incitation si < 5% participent

---
