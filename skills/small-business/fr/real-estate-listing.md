---
name: real-estate-listing
description: "Ensemble d'outils d'agent immobilier : descriptions de liste MLS, résumés CMA, emails de suivi post-visite, séquences de nurture d'acheteur et messages de médias sociaux — tous conformes à la Loi sur le logement équitable"
---

# Real Estate Listing

## When to activate
- Une nouvelle propriété arrive sur le marché et vous avez besoin de copie MLS plus de matériel marketing
- Vous présentez une CMA à un vendeur et avez besoin d'un récit écrit propre pour accompagner les chiffres
- Une visite a eu lieu et vous avez besoin d'un email de suivi personnalisé rédigé rapidement
- Un prospect est devenu silencieux et vous avez besoin d'un message de réengagement qui ne semble pas insistant

## When NOT to use
- Rédaction de documents contractuels ou juridiques — utilisez vos formulaires approuvés par le courtier et un avocat immobilier
- Notation de pistes automatisée ou flux de travail CRM — utilisez les outils intégrés de votre CRM
- Évaluations immobilières que vous représenterez comme des évaluations formelles — seuls les évaluateurs agréés peuvent les produire

## Instructions

### MLS listing descriptions

Donnez à Claude :
- Adresse et faits de base : lits, salles de bain, pieds carrés, taille du terrain, année de construction, garage
- Les 5 meilleures caractéristiques à mettre en évidence (soyez spécifique — « planchers en bois dur d'origine refinalis en 2023 » bat « jolis planchers »)
- Contexte du quartier : ce qui rend l'emplacement précieux sans se référer aux écoles, aux données démographiques ou à la proximité des institutions religieuses
- Votre prix et profil d'acheteur cible (décrivez en termes de style de vie ou d'étape de vie, pas de caractéristiques de classe protégée)
- Limite de caractères pour votre système MLS, le cas échéant

Claude écrit deux versions : une description MLS limitée par caractères (typiquement 250-500 caractères ou 150-250 mots selon votre MLS) et une copie marketing étendue pour votre site Web, email et médias sociaux.

Conformité au logement équitable : Claude n'inclura pas le langage qui implique une préférence pour ou contre les acheteurs ou locataires en fonction de la race, de la couleur, de l'origine nationale, de la religion, du sexe, du statut familial ou du handicap. Ceci inclut le langage indirect — mentionner la proximité des institutions religieuses spécifiques, décrivant les données démographiques du quartier, ou utilisant les noms d'écoles d'une manière qui signale le profil d'acheteur. Claude remplacera tout langage de ce type par des alternatives conformes. Vous êtes toujours responsable de l'examen final avant la publication.

---

### CMA narrative

Collez vos données de ventes comparables : pour chaque comp, incluez l'adresse (ou anonymisée comme « Comp 1 »), les pieds carrés, le prix de vente, les jours sur le marché, le prix de vente et la date de vente.

Dites à Claude :
- Les faits clés de la propriété du sujet
- Les ajustements que vous avez apportés (condition, mises à jour, prime de terrain, etc.)
- Votre gamme de prix de liste recommandée

Claude écrit un récit CMA de 3 paragraphes prêt à présenter à un vendeur :
- Paragraphe 1 : Ce qui se passe sur le marché en ce moment (taux d'absorption, tendance des prix)
- Paragraphe 2 : Ce que les ventes comparables nous disent, avec votre justification d'ajustement
- Paragraphe 3 : Votre gamme de prix recommandée et le raisonnement

Le récit est professionnel et clair — conçu pour être lu à voix haute ou laissé au vendeur comme un à-emporter.

---

### Showing follow-ups

Après une visite, dites à Claude :
- Profil d'acheteur : acheteur pour la première fois, acheteur de transition, investisseur ou réduction de taille — et leur chronologie
- Ce qu'ils ont dit qu'ils aimaient à propos de la propriété
- Ce qu'ils ont dit être préoccupés ou incertains
- S'ils ont vu d'autres propriétés en concurrence avec celle-ci

Claude rédige un email personnalisé qui :
- S'ouvre en référençant quelque chose de spécifique qu'ils ont dit pendant la visite
- Aborde directement l'une de leurs préoccupations avec un fait ou une ressource
- Fournit une information pertinente du marché (si utile)
- Propose une prochaine étape douce — pas « êtes-vous prêt à faire une offre ? » mais quelque chose moins difficile comme « je peux extraire les documents HOA si vous aimeriez les examiner »

Pour les acheteurs qui cessent de répondre : Claude rédige un message de vérification qui reconnaît leur chronologie, offre quelque chose d'utile et ne presse pas.

---

### Lead nurturing sequences

Pour les acheteurs qui sont à 3-6 mois de l'achat, une séquence d'email à 4 touches vous garde pertinent sans être intrusif.

Dites à Claude : profil d'acheteur, gamme de prix, type de propriété, zone désirée et leur chronologie énoncée.

Claude construit :
- Touch 1 (semaine 1) : une mise à jour du marché pertinente pour leur recherche spécifique — pas une infolettre générique
- Touch 2 (semaine 3) : une nouvelle liste pertinente ou une propriété vendue récemment avec une note sur ce qu'elle leur dit
- Touch 3 (semaine 6) : une pièce éducative — une chose spécifique sur le processus d'achat dans votre marché qui affecte leur situation
- Touch 4 (semaine 10) : un réengagement doux — « juste de retour sur votre chronologie, pas de pression » — avec une information fraîche

---

### Social media

Dites à Claude : les 3 meilleures caractéristiques de la propriété, le style de vie de l'acheteur cible, votre ton de marque personnel (professionnel, chaud, énergique, expert local) et quelle plateforme.

Claude écrit des publications appropriées à la plateforme :
- Instagram : caption visuelle-first, hameçons dans la première ligne, hashtags de localisation, se termine par une question ou CTA
- Facebook : légèrement plus long, encadrement axé sur la communauté, fonctionne avec ou sans la pression des caractères d'Instagram
- LinkedIn : utilisé pour les propriétés d'investissement ou les annonces commerciales — encadrement professionnel et orienté ROI

---

### Prompt template — MLS description

```
S'il vous plaît, écrivez une description de liste MLS. Conforme à la Loi sur le logement équitable.

Faits de propriété :
- Adresse : [ville et état seulement, ou omettez]
- Lits/salles de bain : [X] lit / [X] salle de bain
- Pieds carrés : [X] pi ca, terrain [X] pi ca
- Année de construction : [X]
- Garage : [oui/non, attaché/détaché, espaces]

Principales caractéristiques à mettre en évidence :
1. [caractéristique spécifique + tout détail pertinent]
2. [caractéristique spécifique]
3. [caractéristique spécifique]
4. [caractéristique spécifique]
5. [caractéristique spécifique]

Notes de quartier (pas d'écoles, pas de données démographiques, pas d'institutions religieuses) :
[promenade, près des magasins, rue tranquille, vues sur les montagnes, etc.]

Prix : $[X]
Style de vie d'acheteur cible : [décrivez en termes de style de vie — par ex., « les acheteurs à la recherche d'une maison à verrouiller et quitter près des restaurants du centre-ville »]
Limite de caractères MLS : [X mots ou caractères, ou « pas de limite »]

S'il vous plaît écrivez :
1. Description courte conforme MLS ([X] mots)
2. Copie marketing étendue pour le site Web (300-400 mots)
```

## Example

Vous dites : « Chalet Craftsman 3CH/2SdB à Oak Park, 1 850 pi ca, cuisine entièrement mise à jour avec comptoirs en quartz et nouveaux appareils en 2024, détails de caractère original de 1928, garage détaché, quartier promenade avec cafés et boutiques à deux pâtés de maisons, 485 000 $, ciblant les acheteurs qui veulent du caractère et la promenade sur une banlieue clé en main. »

Claude écrit la description MLS et la copie marketing étendue. Il inclut « à deux pâtés de maisons des cafés et boutiques locaux » et « quartier promenade » et exclut toute mention de l'école élémentaire proximale (que vous aviez mentionnée en passant). Claude signale ceci dans une note : « J'ai enlevé la référence à l'école pour conformité avec la Loi sur le logement équitable — remplacée par « quartier promenade avec magasins locaux » pour garder le contexte du style de vie sans impliquer le profil d'acheteur. »

Description MLS : 148 mots. Version étendue : 340 mots avec un titre, trois callouts de caractéristiques-avantages et un paragraphe de quartier.

---
