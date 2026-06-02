# Claude pour les Assistants de Direction et Chiefs of Staff

Tout ce dont un Assistant de Direction (EA), EA Senior ou Chief of Staff a besoin pour piloter le soutien exécutif augmenté par l'IA — notes de briefing, gestion des réunions, communications avec les parties prenantes, préparation des conseils d'administration et suivi de projets dans Claude Code.

---

## À qui s'adresse ce guide

Vous êtes Assistant de Direction ou Chief of Staff au service d'un dirigeant de niveau C. Votre rôle est de rendre votre dirigeant plus efficace en contrôlant ce qui lui parvient, en le préparant à ce qui compte et en gérant tout ce qui ne requiert pas son attention directe. Vous passez vos journées dans un état permanent de changement de contexte — préparation des conseils, communications avec les parties prenantes, briefings, logistique et tout ce qui passe entre les mailles.

Claude Code devient votre moteur de préparation : des briefings rédigés en quelques minutes, des communications sensibles revues avant d'atterrir sur le bureau de votre dirigeant, et des présentations de conseil structurées avant que le dirigeant ne les touche.

**Avant Claude Code :** 90 minutes pour préparer un briefing exécutif solide. 45 minutes pour rédiger une annonce à l'ensemble du personnel sensible. 2 heures pour construire un document de préparation du conseil d'administration de zéro.

**Après :** Briefing exécutif en 20 minutes. Brouillon d'annonce en 15 minutes. Préparation du conseil en 30 minutes.

---

## Installation en 30 secondes

```bash
# Installer les compétences EA et CoS
npx claudient add skill small-business/meeting-to-action
npx claudient add skill small-business/monday-brief
npx claudient add skill productivity/board-deck-builder
npx claudient add skill productivity/confluence-expert
npx claudient add skill productivity/exec-briefing
npx claudient add skill productivity/stakeholder-comms

# Installer l'agent chief of staff
npx claudient add agent advisors/chief-of-staff
```

---

## Votre stack Claude Code pour EA et CoS

### Compétences (commandes slash)

| Compétence | Ce qu'elle fait | Quand l'utiliser |
|---|---|---|
| `/exec-briefing` | Briefing pré-réunion : profils des participants, points de discussion, ordre du jour, résultats souhaités, ce à quoi NE PAS s'engager | Toute réunion à enjeux élevés |
| `/stakeholder-comms` | Annonces d'entreprise, mises à jour sensibles, préparation d'assemblées générales, communications du conseil, messagerie de crise | Tout brouillon de communication significatif |
| `/meeting-to-action` | Transcription ou notes → points d'action, décisions, responsables, délais | Après chaque réunion importante |
| `/monday-brief` | Document de briefing hebdomadaire pour le dirigeant — priorités, réunions clés, liste de surveillance | Chaque lundi matin |
| `/board-deck-builder` | Structure du support de réunion du conseil, récit et préparation du contenu | Réunions mensuelles ou trimestrielles du conseil |
| `/confluence-expert` | Gestion des documents, structure du wiki, base de connaissances de l'équipe | Documentation et gestion des connaissances |

### Agent

| Agent | Modèle | Quand l'activer |
|---|---|---|
| `chief-of-staff` | Sonnet | Planification stratégique complexe, coordination multi-parties prenantes, conception du cadence opérationnel |

---

## Flux de travail quotidien

### Matin (30 minutes)

**1. Brief du lundi — ce que votre dirigeant doit savoir cette semaine**

À lancer chaque lundi matin avant que le dirigeant ne commence sa journée :

```
/monday-brief

Brief hebdomadaire pour [nom du dirigeant] — semaine du [plage de dates].

RÉUNIONS CLÉS CETTE SEMAINE :
- [Jour, heure] : [Nom de la réunion] — [contexte bref — qui, ce qui est en jeu]
- [Jour, heure] : [Nom de la réunion] — [contexte bref]
- [Jour, heure] : [Nom de la réunion] — [contexte]

LIVRABLES DUS DE LA PART DU DIRIGEANT CETTE SEMAINE :
- [Élément] — dû le [date] — [qui en a besoin]
- [Élément]

CE QU'ILS DOIVENT SAVOIR (mais ne savent probablement pas encore) :
- [Développement important — actualité concurrente, situation d'équipe, sentiment des parties prenantes]
- [Élément]

DÉCISIONS EN ATTENTE (le dirigeant doit les prendre cette semaine) :
- [Décision] — contexte : [bref] — délai : [date]

À SURVEILLER :
[Tout ce qui se développe et n'est pas encore urgent mais le deviendra si non géré]

Format : maximum 1 page. Points. Sans rembourrage. Le dirigeant lit ceci en 3 minutes.
```

**2. Briefings pré-réunion — préparation le jour même**

Pour toute réunion à enjeux élevés aujourd'hui :

```
/exec-briefing

[Dirigeant] a une réunion avec [participant(s)] à [heure].

Objectif de la réunion : [de quoi il s'agit]
Participants : [nom, titre, entreprise — faits clés pour chacun]
Ce que nous voulons de cette réunion : [résultat]
Ce qu'ils veulent de nous : [leur objectif]
Historique : [tout contexte pertinent]
Ce à quoi NE PAS s'engager : [contraintes éventuelles]

Générer le briefing. J'en ai besoin pour [heure — 1-2 heures avant la réunion].
```

---

### Post-réunion (15 minutes après les réunions importantes)

**3. Points d'action de réunion**

```
/meeting-to-action

Extraire les points d'action de cette réunion.

Réunion : [nom]
Date : [date]
Participants : [liste]

[Coller notes, transcription ou votre résumé]

Extraire :
- Décisions prises
- Points d'action (qui possède quoi et pour quand)
- Questions ouvertes (aucune décision prise, suivi nécessaire)
- Communications de suivi nécessaires
```

---

### Rédaction de communications (à la demande)

**4. Communication d'entreprise sensible**

```
/stakeholder-comms

Brouillon : [type de communication]
De : [nom et titre du dirigeant]
À : [public]

La nouvelle : [ce qui se passe]
Pourquoi cela se passe : [justification]
Ce que cela signifie pour le public : [impact]
Ton : [empathique / direct / festif / prudent]
Contraintes : [tout ce que le juridique/RH a dit de ne pas inclure]

Réviser pour : ton, clarté, tout ce qui pourrait être mal interprété, ce qui manque.
```

**5. Communication au conseil**

```
/stakeholder-comms

[Type] du conseil : résumé de réunion / mise à jour hors cycle / demande / annonce de jalon.

Ce qui s'est passé ou ce qui se passe : [faits]
Ce que le conseil doit faire ou savoir : [action ou information]
Calendrier : [quand la décision est nécessaire ou quand plus d'informations seront disponibles]

Moins de 400 mots. Direct. Les faits en premier.
```

---

### Préparation du conseil (mensuelle ou trimestrielle)

**6. Préparation du support de conseil**

```
/board-deck-builder

Construire la structure du support de réunion du conseil pour [nom de l'entreprise] — [T? Mois] [Année].

Date de la réunion du conseil : [date]
Composition du conseil : [lister les membres clés]
Sujets clés ce trimestre : [lister les points de l'ordre du jour]
Points forts des performances à mettre en avant : [métriques et jalons]
Défis à présenter honnêtement : [ce qui ne s'est pas passé comme prévu]
Décisions nécessaires du conseil : [liste]

Générer : plan du support, structure du contenu diapositive par diapositive, points de discussion par section, questions anticipées du conseil.
```

---

### Clôture de semaine (vendredi)

**7. Résumé de fin de semaine**

```
/monday-brief

Résumé de fin de semaine pour [dirigeant].

CE QUI A ÉTÉ ACCOMPLI CETTE SEMAINE :
[Lister les éléments majeurs complétés]

ÉLÉMENTS OUVERTS REPORTÉS À LA SEMAINE PROCHAINE :
[Liste]

CE QUI NÉCESSITE L'ATTENTION DU DIRIGEANT AVANT LUNDI :
[Éléments urgents à traiter avant la fin de semaine]

APERÇU DE LA SEMAINE PROCHAINE :
[Réunions clés, livrables et situations à surveiller]
```

---

## Plan de montée en compétence sur 30 jours (nouvel EA ou CoS)

### Semaine 1 — Cartographier le paysage
- Installer toutes les compétences EA/CoS : `npx claudient add skill productivity/[nom]`
- Apprendre le calendrier du dirigeant : quelles réunions se répètent, lesquelles sont à enjeux élevés, lesquelles il redoute
- Soumettre le format du brief du lundi au dirigeant — veut-il plus ou moins de détails ? un focus différent ?
- Identifier les 5 parties prenantes les plus importantes dans le monde du dirigeant et construire leurs profils avec `/exec-briefing`

### Semaine 2 — Flux de travail communications
- Rédiger la prochaine mise à jour du conseil ou annonce significative avec `/stakeholder-comms`
- Montrer le brouillon au dirigeant avant et après — lui faire voir le gain de temps et la qualité
- Établir le processus de révision des communications : qui révise les brouillons sensibles avant leur diffusion ?
- Utiliser `/meeting-to-action` sur chaque réunion pendant une semaine — suivre ce qui est fait vs. ce qui ne l'est pas

### Semaine 3 — Préparation du conseil et des parties prenantes
- Utiliser `/exec-briefing` pour préparer le dirigeant à sa prochaine réunion externe significative
- Utiliser `/board-deck-builder` pour la prochaine réunion du conseil
- Réviser le résultat avec le dirigeant — calibrer le niveau de détail et ce qu'il faut ajouter à partir des connaissances internes

### Semaine 4 — Systèmes et automatisation
- Documenter votre cadence hebdomadaire — quelles compétences Claude vous utilisez quels jours
- Construire une bibliothèque de prompts réutilisables pour vos tâches les plus fréquentes
- Identifier ce sur quoi vous passez encore trop de temps — il y a probablement un workflow Claude pour cela
- Établir des repères : combien de temps prend chaque tâche ? Suivre l'amélioration sur les 90 prochains jours

---

## Principes de communication à enjeux élevés

Ces principes s'appliquent à tout ce que vous rédigez pour votre dirigeant :

**1. Commencer par la nouvelle, pas par le contexte**
"Nous fermons le bureau de Londres au 1er mars." Pas "Alors que nous continuons d'évaluer notre empreinte immobilière dans le contexte de notre stratégie de travail hybride en évolution..."

**2. Dire la chose difficile clairement**
Les euphémismes n'adoucissent pas les mauvaises nouvelles — ils signalent que la direction ne fait pas confiance au public pour la vérité, ce qui détruit plus de confiance que la nouvelle elle-même.

**3. Maximum trois points**
Les gens retiennent trois choses de toute communication. Si vous avez sept points, choisissez-en trois. Le reste va en annexe ou en suivi.

**4. Dire ce qui se passe ensuite**
Chaque annonce significative doit se terminer par une prochaine étape spécifique — une réunion de suivi, une personne à contacter, une date pour plus d'informations.

**5. La révision juridique n'est pas optionnelle pour les communications sensibles**
Claude rédige efficacement et repère les problèmes de ton. Il ne remplace pas la révision RH et juridique pour : licenciements, mesures disciplinaires, questions réglementaires, changements matériels d'activité.

---

## Intégrations d'outils

### Google Calendar
Claude ne peut pas lire directement le calendrier de votre dirigeant (sauf si vous utilisez un MCP de calendrier), mais vous pouvez coller les réunions de la semaine en texte. Utilisez ce format :
```
Lundi 9h : [titre de la réunion] — [participants] — [durée] — [objectif]
Lundi 11h : [réunion] ...
```
Puis lancez `/monday-brief` avec cela comme contexte.

### Slack / Teams
Rédigez des messages ou annonces sensibles dans Claude → révisez → collez dans Slack. Pour les résumés d'assemblées générales récurrentes, collez les points clés de `/meeting-to-action` dans votre canal d'équipe.

### Notion / Confluence
Utilisez `/confluence-expert` pour structurer les pages de documentation. Claude rédige le contenu — vous collez dans votre wiki. Pour les documents récurrents (mises à jour du conseil, briefs hebdomadaires), construisez des modèles dans Notion et remplissez-les avec les sorties de Claude.

### Portail du conseil (Diligent, Boardvantage)
Claude génère les communications du conseil sous forme de texte → formatez et téléchargez dans votre portail de conseil. Pour le contenu du support, Claude fournit la structure et les points de discussion — votre designer construit la version visuelle.

---

## Indicateurs à suivre

| Activité | Temps avant Claude | Temps avec Claude |
|---|---|---|
| Document de briefing exécutif | 90 min | 20 min |
| Brouillon d'annonce à l'échelle de l'entreprise | 45 min | 15 min |
| Préparation de la réunion du conseil | 3 heures | 45 min |
| Points d'action de réunion | 30 min | 8 min |
| Brief du lundi | 30 min | 10 min |
| Brouillon de communication sensible | 60 min | 20 min |

---

## Erreurs courantes (et comment Claude Code les prévient)

**Erreur 1 : Briefings trop longs**
`/exec-briefing` est structuré pour produire des documents concis et lisibles en un coup d'œil. Les dirigeants ne lisent pas les longs briefings — ils obtiennent un résumé que vous l'écriviez ou non. Rendez-le intentionnel.

**Erreur 2 : Annonces qui enterrent la nouvelle**
`/stakeholder-comms` est conçu pour mettre la nouvelle en première phrase. Si Claude l'enterre, signalez-le et demandez une réécriture avec la nouvelle en phrase 1.

**Erreur 3 : Points d'action de réunion qui ne se réalisent pas**
`/meeting-to-action` structure les points d'action avec responsable, date d'échéance et critère de succès. Les actions ambiguës ne se réalisent pas. Les spécifiques si.

**Erreur 4 : Communications sensibles qui ratent le registre émotionnel**
Claude vérifie la clarté et les problèmes de ton, mais vous connaissez votre dirigeant et votre culture. Révisez chaque communication sensible avant qu'elle ne quitte votre bureau — Claude est le premier éditeur, pas le dernier.

**Erreur 5 : Supports du conseil qui rapportent au lieu d'informer**
`/board-deck-builder` est conçu pour structurer les supports autour des décisions, pas seulement des données. Les conseils doivent décider des choses. Facilitez-leur la tâche.

---

## Ressources

- [Démarrer avec Claude Code](getting-started.md)
- [Compétence briefing exécutif](../skills/productivity/exec-briefing.md)
- [Compétence communications parties prenantes](../skills/productivity/stakeholder-comms.md)
- [Compétence réunion en points d'action](../skills/small-business/meeting-to-action.md)
- [Compétence constructeur de support de conseil](../skills/productivity/board-deck-builder.md)

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous créons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
