---
name: candidate-sourcer
description: "Sourcing de candidats passifs : chaînes de recherche LinkedIn, recherche booléenne, séquences de messages de prise de contact, et suivi de pipeline pour les recruteurs"
---

# Compétence : Sourcing de candidats

## Quand activer
- Vous avez un poste ouvert sans candidats pour le moment et devez sourcer de façon proactive
- La qualité de vos candidats entrants est faible et vous devez trouver des candidats passifs
- Vous avez besoin d'une chaîne de recherche booléenne pour trouver des profils spécifiques sur LinkedIn Recruiter ou Google
- Vous rédigez le premier message de prise de contact pour un candidat passif qui ne cherche pas activement
- Vous construisez un pipeline de sourcing — vous devez trouver 50+ profils sur lesquels travailler
- Vous suivez une campagne de sourcing sur plusieurs postes simultanément

## Quand NE PAS utiliser
- Rédiger la fiche de poste — utilisez `/job-description` pour cela
- Présélectionner ou interviewer des candidats — utilisez `/interview-scorecard`
- Les offres de rémunération — utilisez `/comp-benchmarker`
- Les situations de mobilité interne ou de réembauche — conversation et processus différents

## Instructions

### Générateur de chaîne de recherche LinkedIn

```
Construis une chaîne de recherche LinkedIn pour trouver des candidats [poste].

Poste : [Intitulé du poste]
Qualifications indispensables :
- [Compétence ou expérience 1]
- [Compétence ou expérience 2]
- [Diplôme, outil, ou expérience sectorielle]

Souhaitables :
- [Différenciateur 1]
- [Différenciateur 2]

Entreprises cibles (où ils pourraient travailler maintenant ou précédemment) :
- Concurrents directs : [liste]
- Entreprises adjacentes avec des compétences transférables : [liste]
- Secteurs qui produisent de bons profils pour ce poste : [liste]

Exclure :
- [Entreprises depuis lesquelles vous ne voulez pas recruter — ex. votre propre entreprise, entreprises connues pour de mauvaises pratiques]
- [Lieux à exclure]

Séniorité / tranche d'expérience :
- Années d'expérience : [X-Y ans]
- Niveau : [IC / Manager / Director / VP]

Produire :

## Chaîne booléenne LinkedIn Recruiter
(À utiliser dans LinkedIn Recruiter Search → champ Mots-clés)

("variante titre 1" OR "variante titre 2" OR "variante titre 3")
AND ("compétence 1" OR "compétence 2")
AND ("nom entreprise" OR "nom entreprise 2")
NOT ("terme exclu")

## Recherche X-Ray Google
(Pour trouver des profils LinkedIn sans accès Recruiter)
site:linkedin.com/in "[titre du poste]" "[compétence]" "[lieu]" -intitle:"profiles" -inurl:"dir/"

## Logique booléenne expliquée
Utiliser AND pour exiger les deux termes
Utiliser OR pour trouver l'un ou l'autre (plus large)
Utiliser NOT pour exclure des termes
Utiliser des guillemets pour les expressions exactes
Utiliser des parenthèses pour grouper la logique

## Affinements
Si la recherche retourne trop de résultats : ajouter AND avec une autre compétence requise
Si trop peu de résultats : remplacer AND par OR entre les termes clés, ou supprimer le filtre entreprise
Cible : 50-200 profils solides pour une campagne de sourcing active — pas des milliers

## Variantes de recherche à exécuter en parallèle
Variante 1 : [axe titre]
Variante 2 : [axe compétences]
Variante 3 : [axe entreprise/parcours]
```

### Modèles de messages de prise de contact

```
Rédige des messages de prise de contact pour le sourcing de candidats passifs.

Poste : [Intitulé du poste]
Entreprise : [Nom de votre entreprise]
Ce qui rend ce poste attractif : [3 choses spécifiques — pas génériques]
Profil du candidat : [décrivez à qui vous envoyez ceci — leur parcours probable et leur poste actuel]
Canal : [LinkedIn InMail / Email / introduction via relation commune]
Ton : [professionnel / conversationnel — adapter au niveau de séniorité du poste]

Cadre du message :

STRUCTURE (dans l'ordre) :
1. Accroche différenciante — ne pas commencer par "Bonjour, je m'appelle [Recruteur] chez [Entreprise]"
2. Signal de pertinence — pourquoi eux, spécifiquement
3. Accroche sur le poste — 1 chose spécifique et attrayante sur le poste
4. Demande légère — prochaine étape sans pression, pas "Êtes-vous intéressé à postuler ?"

---

MODÈLE A — LinkedIn InMail (moins de 150 mots — aller droit au but)

Objet : [Poste] chez [Entreprise] — j'ai vu votre travail chez [leur entreprise]

Bonjour [Prénom],

[Observation spécifique sur leur parcours — "Votre expérience à diriger [X] chez [Entreprise] a retenu mon attention parce que..."] — pas "Je suis tombé sur votre profil."

Nous construisons [une phrase attrayante sur ce que fait l'entreprise — stade, mission, dynamique].

Le poste de [rôle] sur lequel je travaille serait responsable de [chose spécifique et impactante], et compte tenu de votre parcours en [correspondance spécifique], je pense que ça vaut une conversation.

Un appel de 20 minutes cette semaine vous semblerait-il pertinent pour voir s'il y a un intérêt commun à explorer ?

[Votre prénom]

---

MODÈLE B — Introduction via relation commune (email)

Objet : [Contact commun] m'a suggéré de vous contacter

Bonjour [Prénom],

[Contact commun] m'a mentionné que vous seriez peut-être ouvert à entendre ce que nous construisons chez [Entreprise] — j'espère qu'il ne vous dérange pas que je vous contacte directement.

[Une phrase sur l'entreprise — soyez spécifique, pas bateau.]

Le poste que j'essaie de pourvoir est [pitch spécifique — ce qu'ils posséderaient, avec qui ils travailleraient, pourquoi maintenant].

Je sais que ces conversations fonctionnent mieux quand il y a une vraie adéquation des deux côtés, donc je préfère parler avant d'envoyer quoi que ce soit de formel. 20 minutes cette semaine seraient-elles possibles ?

[Votre prénom]

---

MODÈLE C — Relance (si aucune réponse au premier message après 7 jours)

Bonjour [Prénom],

Je sais que vous ne passez pas votre journée à surveiller vos InMail — je voulais juste faire remonter ce message une fois au cas où il soit passé inaperçu.

Si ce n'est pas le bon moment, pas de problème du tout. Si vous êtes curieux de savoir ce que nous construisons, je suis heureux de partager plus de contexte avant tout type de conversation formelle.

[Votre prénom]

---

Règles :
- Personnaliser la première ligne — si vous ne pouvez pas dire quelque chose de spécifique sur eux, ne l'envoyez pas
- Une seule demande claire à la fin — un appel de 20 minutes, pas "faites-moi savoir ce que vous pensez"
- Ne jamais joindre une fiche de poste dans le premier message — cela signale une lettre type
- Relancer une seule fois — après ça, passer à autre chose

Générer des messages de prise de contact pour [poste] adaptés au [type de candidat] que je cible.
```

### Suivi du pipeline de sourcing

```
Construis un suivi de pipeline de sourcing pour [poste].

Poste : [Intitulé du poste]
Objectif de sourcing : [X candidats qualifiés dans le pipeline pour produire 1 embauche]
Première embauche cible d'ici : [date]

Mathématiques du pipeline (règle empirique pour les taux de conversion en recrutement) :
- Profils identifiés → Prise de contact envoyée : 30-50% (filtrer pour la qualité avant la prise de contact)
- Prise de contact envoyée → Réponse : 15-30% (les candidats passifs ont de faibles taux de réponse)
- Réponse → Intéressé par un appel : 50-70% (parmi ceux qui répondent, la plupart sont curieux)
- Entretien téléphonique réussi → Avancement vers le panel : 40-60%
- Panel → Offre : 30-50%
- Offre → Acceptation : 70-90%

Pour 1 embauche, travaillez à rebours :
Date d'embauche cible dans [X semaines]
Offres à étendre : ~1,5 (supposer 1 refus)
Passages de panel nécessaires : ~3-4
Entretiens téléphoniques : ~7-10
Réponses intéressées : ~12-15
Prises de contact envoyées : ~50-80
Profils identifiés et qualifiés : ~100-150

Suivi des étapes du pipeline (à construire dans Notion, Airtable, ou Google Sheets) :

| Candidat | Entreprise | Poste | Source | Étape | Dernier contact | Prochaine action | Notes |
|---|---|---|---|---|---|---|---|
| [Nom] | [Entreprise] | [Titre] | [LinkedIn / Recommandation / Tableau d'offres] | [Identifié / Prise de contact envoyée / Répondu / Entretien / Panel / Offre / Refusé / Embauché] | [date] | [action + date] | [notes] |

Définitions des étapes :
1. Identifié — trouvé sur LinkedIn, pas encore contacté
2. Prise de contact envoyée — premier message envoyé, en attente de réponse
3. Répondu — ils ont répondu, positivement ou en demandant plus d'informations
4. Entretien téléphonique — planifié ou réalisé
5. Avancé — passage à l'entretien panel
6. Panel — en cours d'entretien
7. Offre — offre étendue
8. Embauché / Refusé / En pause

Cadence hebdomadaire de sourcing :
- Lundi : revoir le pipeline, faire avancer ou clore les candidats en attente
- Mardi-Jeudi : nouvelles prises de contact — envoyer en lot 15-20 messages
- Vendredi : relancer les non-répondants (1 seule relance, après 7 jours)

Produire un plan de sourcing avec calendrier, objectifs de pipeline, et planning de prise de contact.
```

### Brief de recherche sur un candidat

```
Renseigne-toi sur ce candidat avant que je le contacte ou l'interviewe.

Candidat : [Nom]
Entreprise actuelle : [Entreprise]
Poste actuel : [Titre]
LinkedIn : [URL ou détails du profil]

Produire un brief sur le candidat :

RÉSUMÉ DU PARCOURS
- Poste actuel et durée : [X ans chez Entreprise — est-ce une durée typique ou inhabituellement courte/longue ?]
- Trajectoire de carrière : [cette personne monte-t-elle, se déplace-t-elle latéralement, ou descend-elle en séniorité ?]
- Expérience sectorielle : [dans quels secteurs ont-ils travaillé ?]
- Types d'entreprises : [startup / scale-up / enterprise / agence — quels environnements leur sont natifs ?]
- Compétences et outils : [quelles compétences techniques ou de domaine sont visibles sur le profil ?]

SIGNAUX D'ADÉQUATION AU POSTE
- Expérience pertinente pour [votre poste ouvert] : [forte / partielle / lacune]
- Lacune à combler en entretien : [ce qu'on ne peut pas savoir à partir du profil ?]
- Préoccupation potentielle : [quelque chose dans la trajectoire qui nécessite une explication ?]

ÉLÉMENTS DE PERSONNALISATION POUR LA PRISE DE CONTACT
- Quelque chose de spécifique à mentionner : [post récent / étape importante de l'entreprise / changement de carrière / relation commune]
- Ce qui pourrait les rendre réceptifs maintenant : [leur entreprise vient de faire des licenciements / ils viennent d'être promus — nouveau poste = probablement pas en train de bouger de sitôt]
- Ce dont ils se soucient probablement : [avancement de carrière / défi technique / mission / rémunération — inférer à partir de la trajectoire]

RENSEIGNEMENTS POUR L'ENTRETIEN
- Sur quoi approfondir : [transitions ou lacunes spécifiques dans le profil]
- Motivations probables : [pourquoi pourraient-ils être ouverts à un changement ?]
- Offres concurrentes probables : [qui d'autre pourrait recruter des profils similaires en ce moment ?]

Produire le brief sur le candidat pour [nom].
```

## Exemple

**Utilisateur :** Je source pour un Growth Marketing Manager dans mon entreprise SaaS B2B à Amsterdam. Ils doivent avoir de l'expérience en acquisition payante (Google/Meta), un peu de SEO, et idéalement venir d'un environnement SaaS. Aide-moi à construire ma recherche et ma prise de contact.

**Plan de sourcing de Claude :**

**Recherche booléenne LinkedIn :**

```
("Growth Marketing Manager" OR "Performance Marketing Manager" OR "Digital Marketing Manager" OR "Growth Manager")
AND ("Google Ads" OR "paid acquisition" OR "PPC" OR "SEM")
AND ("SaaS" OR "B2B" OR "software")
AND (Amsterdam OR Netherlands OR "The Netherlands")
```

**Google X-Ray (sans accès LinkedIn Recruiter) :**
```
site:linkedin.com/in "growth marketing" ("google ads" OR "paid acquisition") "saas" "amsterdam"
```

**Entreprises cibles à rechercher :**
Entreprises à Amsterdam avec des modèles commerciaux SaaS dont proviennent couramment les growth marketers : Booking.com (talents en marketing de performance), Adyen, MessageBird (maintenant Bird), Sendcloud, Picnic, Mews — regarder aussi les agences basées à Amsterdam qui font du paid pour des clients SaaS.

**Message de prise de contact — LinkedIn InMail :**

Objet : Poste de Growth Marketing à Amsterdam — votre parcours SaaS m'a intrigué

Bonjour [Prénom],

Votre temps chez [leur entreprise] à gérer [canal spécifique] a attiré mon attention — en particulier [chose spécifique qu'ils ont faite si visible sur le profil].

Nous développons la croissance chez [votre entreprise] — [pitch entreprise en une phrase : "un outil SaaS B2B utilisé par 2 000+ entreprises logistiques en Europe"] — et je recherche un Growth Marketing Manager pour prendre en charge notre motion d'acquisition payante et SEO de bout en bout. Une véritable propriété, pas de l'exécution pour une agence.

Un appel de 20 minutes vous semblerait-il pertinent pour voir si quelque chose peut se concrétiser ici ?

[Prénom]

**Objectif du pipeline :**
- Identifier 80-100 profils cette semaine
- Envoyer 30-40 messages de prise de contact (filtrer pour la qualité avant d'envoyer)
- Attendre 6-10 réponses en 2 semaines
- Entretiens téléphoniques 5-7, avancer 2-3 vers le panel
- Embauche 1 en 6-8 semaines à partir du début du sourcing actif

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
