# Claude pour les Freelances et Consultants

Tout ce dont un freelance ou consultant indépendant a besoin pour piloter l'acquisition de clients, la gestion de projets, la facturation et le développement commercial augmentés par l'IA dans Claude Code.

---

## À qui s'adresse ce guide

Vous êtes freelance ou consultant indépendant — designer, développeur, rédacteur, stratège, marketeur ou spécialiste — gérant votre propre activité de services aux clients. Vos revenus dépendent de la conquête de projets, de leur bonne réalisation, de votre encaissement et d'un pipeline en continu. Vous consacrez 30% de votre temps à des opérations commerciales qui ne génèrent pas de revenus. Claude Code réduit ces charges pour que vous puissiez consacrer plus de temps au travail facturable et au développement commercial.

**Avant Claude Code :** 2 heures pour rédiger une proposition gagnante. 45 minutes pour rédiger un cahier des charges. 30 minutes par rapport de statut client. Des heures à relancer des factures impayées chaque mois.

**Après :** Proposition en 20 minutes. Cahier des charges en 15 minutes. Rapport de statut en 8 minutes. Relance de facture rédigée en 60 secondes.

---

## Installation en 30 secondes

```bash
# Installer toutes les compétences freelance
npx claudient add skill small-business/freelancer-proposal
npx claudient add skill small-business/scope-of-work
npx claudient add skill small-business/client-status-report
npx claudient add skill small-business/invoice-chaser
npx claudient add skill small-business/cold-outreach
npx claudient add skill small-business/cash-flow-forecast
npx claudient add skill small-business/agency-operations

# Installer l'agent conseiller PDG
npx claudient add agent advisors/ceo-advisor
```

---

## Votre stack Claude Code pour freelances

### Compétences (commandes slash)

| Compétence | Ce qu'elle fait | Quand l'utiliser |
|---|---|---|
| `/freelancer-proposal` | Gagner plus de projets — rédaction de propositions avec des propositions de valeur claires, justification du prix et appel à l'action | Toute nouvelle opportunité de projet |
| `/scope-of-work` | Définir les livrables, exclusions, calendrier, paiement et politique de modification | Avant de démarrer chaque projet |
| `/client-status-report` | Mises à jour client hebdomadaires/mensuelles — avancement, blocages, décisions nécessaires | Gestion de projet active |
| `/invoice-chaser` | Relance professionnelle pour factures en retard — séquence progressive | Toute facture en retard |
| `/cold-outreach` | Prospection sortante vers de nouveaux clients — personnalisée, non intrusive | Développement commercial |
| `/cash-flow-forecast` | Prévision de trésorerie à 90 jours — quand l'argent rentre, quand les factures sortent | Planification financière mensuelle |
| `/agency-operations` | SOPs, accueil, processus d'équipe si vous montez en échelle | Passer au-delà du solo |

### Agent

| Agent | Modèle | Quand l'activer |
|---|---|---|
| `ceo-advisor` | Sonnet | Décisions de prix, situations clients difficiles, stratégie d'entreprise |

---

## Flux de travail quotidien

### Matin (15 minutes)

**1. Nouvelle opportunité — qualifier et répondre**
```
/freelancer-proposal

Nouvelle demande de projet reçue. Voici ce qu'ils m'ont dit :
[Coller le message ou le brief du client]

Mes services : [ce que vous faites]
Mon tarif : $[X]/heure ou $[X] pour ce type de projet
Questions que j'ai : [ce dont vous avez besoin avant de proposer]

Rédiger une réponse qui :
1. Accuse réception de leur demande
2. Pose 2-3 questions de clarification (pas 10 — respecter leur temps)
3. Donne une fourchette approximative si j'ai suffisamment pour le faire
4. Propose un appel de 20 minutes pour en discuter

Ton : confiant, expert, chaleureux.
```

**2. Projet actif — rapport de statut pour le client**
```
/client-status-report

Mise à jour de statut hebdomadaire pour [nom du client] — [nom du projet].

Semaine du : [dates]
Complété : [lister ce que vous avez fait]
En cours : [travail actuel]
Bloqué par : [ce dont vous avez besoin d'eux — être précis]
Semaine prochaine : [ce que vous ferez]
```

---

### Lors de la conquête d'un nouveau projet

**3. Proposition gagnante**
```
/freelancer-proposal

Rédiger une proposition pour cette opportunité de projet.

Client : [nom de l'entreprise, nom du contact]
Ce dont ils ont besoin : [description du projet]
Budget (si communiqué) : $[X]
Délai mentionné : [X semaines/mois]
Comment je vais l'aborder : [votre méthodologie]
Pourquoi je suis le bon choix : [expérience pertinente, résultats passés]

Mon prix proposé : $[X]
```

**4. Cahier des charges — se protéger**
```
/scope-of-work

Rédiger un cahier des charges pour le projet que nous venons d'accepter.

Client : [nom]
Projet : [description]
Livrables : [liste spécifique]
Exclusions : [ce que je ne fais pas]
Calendrier : [dates]
Paiement : $[X], [X]% à la signature, [X]% à la livraison
Révisions : [X tours inclus]
Tarif de modification : $[X]/heure
```

---

### Quand vous n'avez pas été payé

**5. Relance de facture**
```
/invoice-chaser

La facture #[X] de $[X] est en retard de [X] jours.

Client : [nom]
Date de la facture : [date]
Date d'échéance : [date]
Conditions de paiement : [Net 15 / Net 30]
Contact : [nom, e-mail]
Relances précédentes : [aucune / e-mail le [date] / appel le [date]]

Rédiger une relance qui escalade de manière appropriée pour [X] jours de retard.
Garder la porte ouverte pour le paiement tout en étant clair sur le sérieux de la situation.
```

---

### Développement commercial (hebdomadaire)

**6. Prospection sortante**
```
/cold-outreach

Rechercher et rédiger un message de prospection vers un client potentiel.

Cible : [nom de l'entreprise ou type d'activité]
Contact : [nom, titre si connu]
Pourquoi ils pourraient avoir besoin de moi : [votre évaluation]
Mon expérience pertinente : [ce que j'ai fait de pertinent]
Ce que je propose : [ce que vous feriez pour eux]

Rédiger un e-mail de prospection personnalisé. Pas un argumentaire commercial — plutôt une introduction professionnelle avec une observation spécifique sur leur activité.
```

---

### Revue financière mensuelle

**7. Prévision de trésorerie**
```
/cash-flow-forecast

Prévision de trésorerie à 90 jours pour mon activité freelance.

Trésorerie actuelle : $[X]
Contrats signés avec paiements à venir :
- [Client A] : $[X] dû le [date]
- [Client B] : $[X] dû le [date]

Factures impayées (non encore réglées) :
- Facture #[X] — [client] — $[X] — [X] jours de retard

Charges mensuelles :
- [Logiciels/outils] : $[X]/mois
- [Comptabilité/admin] : $[X]/mois
- [Autres] : $[X]/mois

Charges à venir (ponctuelles) :
- [Élément] : $[X] en [mois]

Pipeline (pas encore signé) :
- [Prospect A] : $[X] — probabilité [haute/moyenne/basse]
- [Prospect B] : $[X] — probabilité [moyenne]

Montrez-moi : trésorerie mois par mois, quand je pourrais avoir un découvert, ce qui le génère.
```

---

## Plan de montée en compétence sur 30 jours (nouveaux freelances ou nouveau marché)

### Semaine 1 — Infrastructure business
- Installer toutes les compétences freelance : `npx claudient add skill small-business/[nom]`
- Rédiger votre modèle de proposition standard avec `/freelancer-proposal` — personnaliser pour vos services
- Rédiger votre modèle principal de cahier des charges avec `/scope-of-work` — l'utiliser pour chaque futur projet
- Définir vos prix : taux horaire, tarifs par projet, tarifs de rétainer — les documenter

### Semaine 2 — Gestion active des clients
- Utiliser `/client-status-report` sur tous les projets actifs — établir une cadence hebdomadaire le vendredi
- Utiliser `/invoice-chaser` sur toute facture en retard — ne pas laisser passer 7 jours
- Lancer `/cash-flow-forecast` pour comprendre votre position à 90 jours

### Semaine 3 — Développement commercial
- Identifier 10 clients potentiels dans votre réseau existant
- Utiliser `/cold-outreach` pour rédiger des messages personnalisés pour chacun — consacrer 5 minutes à la personnalisation par message
- Suivre les réponses — quel accroche fonctionne le mieux pour votre marché ?

### Semaine 4 — Systématiser
- Utiliser `/agency-operations` pour documenter votre processus d'accueil (ce que les nouveaux clients reçoivent en semaine 1)
- Rédiger une FAQ client avec Claude — réduit le temps passé à répondre aux mêmes questions
- Réviser vos tarifs : suivez-vous précisément votre temps ? Êtes-vous sous-tarifé ?

---

## Tarification et stratégie d'entreprise

Utilisez l'agent conseiller PDG pour les décisions d'entreprise difficiles :

**Augmenter ses tarifs :**
```
/ceo-advisor

Je veux augmenter mes tarifs de $[X]/heure à $[X]/heure. Mes clients actuels paient $[X]. Je fais du freelance depuis [X] ans. Mon pipeline est plein.

Aide-moi à réfléchir à :
- Comment communiquer l'augmentation de tarif aux clients existants
- Que ce soit raisonnable de maintenir les anciens tarifs pour les contrats en cours ou d'appliquer immédiatement
- Comment positionner mon nouveau tarif auprès des nouveaux clients
- Si je dois passer à une tarification au projet plutôt qu'à l'heure
```

**Renvoyer un mauvais client :**
```
/ceo-advisor

J'ai un client qui [décrire le problème : paye en retard, dépassements de périmètre constants, irrespectueux, non rentable]. Ils représentent [X]% de mes revenus mensuels.

Aide-moi à réfléchir à :
- Faut-il le renvoyer ou essayer de réparer la relation
- Si je dois le renvoyer, comment le faire professionnellement
- Comment remplacer les revenus
```

**Évaluer une offre de rétainer :**
```
/ceo-advisor

Un client veut me mettre sur un rétainer mensuel de $[X]/mois pour [X] heures. Mon tarif journalier actuel est de $[X].

Est-ce un bon deal ? À quoi devraient ressembler les conditions du rétainer ? Quels sont les risques ?
```

---

## Intégrations d'outils

### Facturation (Wave, FreshBooks, Bonsai)
Claude rédige votre proposition professionnelle et votre cahier des charges → vous collez dans votre outil de facturation pour créer le projet et générer les factures. Pour les relances de factures, utilisez `/invoice-chaser` pour rédiger les e-mails → envoyer depuis votre outil de facturation ou directement.

### Suivi du temps (Toggl, Harvest, Clockify)
Suivez votre temps dans votre outil → exportez les totaux hebdomadaires → collez dans `/client-status-report` pour contextualiser vos livrables avec le temps passé (utile pour la transparence de la facturation à l'heure).

### Signature de contrats (DocuSign, PandaDoc, HelloSign)
Claude génère le texte du cahier des charges → collez dans votre outil de signature électronique → envoyez pour signature. Pour les clients récurrents, sauvegardez vos modèles générés par Claude dans PandaDoc ou Bonsai.

### CRM / pipeline (HubSpot gratuit, Notion, Airtable)
Utilisez un Kanban simple pour votre pipeline : Prospect → Proposition envoyée → Négociation → Actif → Facturé → Payé. Claude aide à chaque étape — `/cold-outreach` pour Prospect, `/freelancer-proposal` pour Proposition envoyée, `/scope-of-work` pour Actif.

---

## Indicateurs à suivre

| Indicateur | Cible | Suivre mensuellement |
|---|---|---|
| Taux de conversion des propositions | >35% | Propositions envoyées / projets gagnés |
| Valeur moyenne du projet | [votre cible] | En croissance ou stagnante ? |
| Délai de paiement | <15 jours | Signaler les clients qui paient lentement |
| Taux d'utilisation | 70-80% des heures de travail facturables | Au-dessus de 80% = augmenter les tarifs ou recruter |
| Revenus par client | Suivre les 3 clients principaux | Ne pas laisser un seul client représenter >40% des revenus |
| Heures de développement commercial | 5-10% de votre temps | Si zéro, vous aurez un cycle feast/famine |
| Marge nette | >50% (activité de services) | Votre part après outils, impôts, admin |

---

## Erreurs courantes (et comment Claude Code les prévient)

**Erreur 1 : Périmètre vague = dépassement de périmètre**
`/scope-of-work` vous oblige à énumérer chaque livrable et à lister chaque exclusion. Aucun périmètre vague autorisé.

**Erreur 2 : Pas de processus de modification**
`/scope-of-work` inclut la clause de modification. Chaque demande supplémentaire la déclenche — plus de travail gratuit.

**Erreur 3 : Ne pas relancer les factures en retard**
`/invoice-chaser` rend la relance possible en 60 secondes. Plus de "je le ferai quand j'aurai un moment".

**Erreur 4 : Propositions qui décrivent le processus au lieu des résultats**
`/freelancer-proposal` commence par les résultats du client. Votre processus est secondaire par rapport à leurs résultats.

**Erreur 5 : Surprises de trésorerie**
`/cash-flow-forecast` chaque mois. Connaître votre position à 90 jours avant que cela ne devienne une crise.

---

## Ressources

- [Démarrer avec Claude Code](getting-started.md)
- [Compétence cahier des charges](../skills/small-business/scope-of-work.md)
- [Compétence rapport de statut client](../skills/small-business/client-status-report.md)
- [Compétence relance de facture](../skills/small-business/invoice-chaser.md)
- [Workflow hebdomadaire freelance](../workflows/freelancer-weekly.md)

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous créons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
