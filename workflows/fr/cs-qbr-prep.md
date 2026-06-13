# Flux de travail de préparation du QBR CS

Processus de préparation complet pour un bilan trimestriel — de la collecte des données au suivi post-appel — utilisant Claude Code pour réduire le temps de préparation de 4-6 heures à moins de 60 minutes.

---

## Vue d'ensemble

Ce flux de travail couvre le cycle de vie complet du QBR :

1. Collecte des données (14 jours avant)
2. Évaluation de l'état de santé et identification des risques (10 jours avant)
3. Quantification du ROI (7 jours avant)
4. Présentation et points de discussion (5 jours avant)
5. Préparation pré-appel (1 jour avant)
6. Suivi post-appel (le jour même)

**Temps total de préparation avec Claude Code :** 60-90 minutes réparties sur les deux semaines précédant le QBR

**Qui exécute ce flux de travail :** Le CSM, avec la coordination de l'AE et de la direction CS pour les comptes stratégiques

---

## Phase 1 — Collecte des données (14 jours avant)

**Objectif :** Rassembler toutes les données avant d'ouvrir Claude. Vous ne pouvez pas synthétiser ce que vous n'avez pas collecté.

**Liste de contrôle des données à extraire :**

**Depuis l'analytique produit :**
- Utilisateurs actifs mensuels (3 derniers mois, tendance)
- Fréquence et récence de connexion
- Utilisation des fonctionnalités principales par fonctionnalité (lesquelles, à quelle fréquence)
- Taux d'utilisation des sièges (sièges actifs / sièges licenciés)
- Toutes nouvelles fonctionnalités adoptées ce trimestre

**Depuis votre CRM :**
- Tous les tickets de support des 90 derniers jours — types, temps de résolution, problèmes ouverts
- Tous les points de contact CSM des 90 derniers jours — notes d'appel, fils de discussion par e-mail
- Score NPS (le plus récent) et tendance
- Carte des parties prenantes — qui est engagé, qui n'a pas été contacté, tout changement de personnel

**Depuis le commercial :**
- ARR actuel et date de renouvellement
- Termes du contrat — ce qui est inclus, ce qu'ils ont acheté par rapport à ce qu'ils ont utilisé
- Statut des factures — à jour ou en retard
- Toute conversation d'expansion survenue ce trimestre

**Depuis le client :**
- Leurs critères de succès déclarés au démarrage du contrat (à partir des notes de lancement)
- Toute actualité publique sur leur activité — effectifs, lancements de produits, financement, changements de direction

**Étape 1.1 — Organiser vos données**

Créez un document simple avec des sections pour chacune des catégories ci-dessus. Collez ce que vous avez. Laissez les lacunes visibles — elles signalent ce que vous devez combler avant le QBR.

Si vous avez des lacunes dans les données produit : demandez-les à votre équipe analytique ou data 10+ jours avant le QBR. Se précipiter pour les données d'utilisation 2 jours avant est évitable.

---

## Phase 2 — Évaluation de l'état de santé et identification des risques (10 jours avant)

**Étape 2.1 — Exécuter l'analyse de santé**

```
/health-score-analyzer

Analyse the health of [Customer Name] ahead of their QBR on [date].

[Paste all data gathered in Phase 1]

Produce:
1. Overall health score and risk tier
2. Top 3 risk signals (ranked by severity)
3. Top 3 positive signals (what's genuinely working)
4. Churn probability: low / medium / high
5. Expansion readiness: ready / not yet / blocked by [issue]
6. What needs to be addressed in the QBR vs. resolved before it
```

**Étape 2.2 — Déterminer la posture du QBR**

En fonction de l'évaluation de santé, choisissez l'un des trois modes de QBR :

**Compte VERT — QBR de partenariat**
Objectif : célébrer les victoires, approfondir la relation, préparer la conversation d'expansion
Ton : collaboratif, tourné vers l'avenir
Expansion : à soulever dans la session — « Étant donné ce que vous avez accompli, voici ce qui est possible ensuite »

**Compte JAUNE — QBR de recadrage**
Objectif : identifier et résoudre les obstacles empêchant la création de valeur complète
Ton : honnête, orienté résolution de problèmes
Expansion : à ne pas soulever sauf si la santé s'améliore clairement — concentrez-vous sur le rétablissement de la confiance

**Compte ROUGE — QBR de récupération**
Objectif : reconnaître le problème, présenter une solution concrète, rétablir la confiance
Ton : direct, responsable — ne pas commencer par de bonnes nouvelles si la relation est endommagée
Expansion : hors de question — concentrez-vous sur la sauvegarde du compte
Préparation spéciale requise : impliquer le VP CS ou un dirigeant ; préparer un crédit de service ou une offre de remédiation si nécessaire

---

## Phase 3 — Quantification du ROI (7 jours avant)

**C'est la diapositive la plus importante de tout QBR. Elle nécessite des chiffres précis, pas des affirmations vagues.**

**Étape 3.1 — Construire le dossier ROI**

```
/qbr-builder

Quantify the ROI [Customer Name] has received from our product this quarter.

Customer use case: [specific workflow they use our product for]
Contract value: $[X] ARR

Available data:
- Usage: [describe what you have — feature usage counts, user sessions, etc.]
- Success criteria from kickoff: [paste what was agreed at contract start]
- Any outcomes they've mentioned on calls: [paste relevant call notes]
- Industry benchmarks for this use case (if known): [X hours saved / X% efficiency gain]

ROI dimensions to quantify:
1. Time savings: [how much time does this use case save per user per week?]
2. Error reduction: [if applicable]
3. Revenue impact: [if their use of our product influences their revenue]
4. Headcount avoided: [if applicable]

Produce: ROI statement suitable for a QBR slide — specific numbers, their language, not product feature language.
```

**Règles pour la diapositive ROI :**
- Utilisez leurs chiffres, pas les vôtres. Leur % d'amélioration importe plus que votre liste de fonctionnalités.
- Si vous ne pouvez pas quantifier, utilisez leurs mots. Les citations des notes d'appel ou des tickets de support sont valides.
- Ne dites jamais « nous vous avons aidé à faire X ». Dites « vous avez accompli X ». Ils sont le protagoniste.
- Une seule diapositive, trois points maximum. N'enterrez pas le ROI dans une masse de données.

**Étape 3.2 — Préparer les données d'utilisation pour la présentation**

Extrayez un résumé de données propre pour la présentation du QBR :

| Indicateur | Trimestre précédent | Ce trimestre | Tendance |
|---|---|---|---|
| Utilisateurs actifs | [N] | [N] | [hausse/stable/baisse X%] |
| Utilisation des fonctionnalités principales | [N fois] | [N fois] | [tendance] |
| Taux d'utilisation des sièges | [X%] | [X%] | [tendance] |

---

## Phase 4 — Présentation et points de discussion (5 jours avant)

**Étape 4.1 — Construire la structure du QBR**

```
/qbr-builder

Build the complete QBR structure for [Customer Name].

QBR date: [date]
Duration: [60 minutes]
Attendees (customer): [exec title, champion title, others]
Attendees (us): [CSM, AE if applicable]
QBR mode: [GREEN partnership / YELLOW course correction / RED recovery]
Primary goal: [retain / expand / relationship reset]

Context:
- Health score: [X/100]
- ROI delivered (from Phase 3): [paste ROI summary]
- Open issues to address: [list]
- Expansion opportunity (if GREEN): $[X], based on [signal]
- Competitive threat (if any): [describe]

Produce:
1. Full 60-minute agenda with time blocks
2. Talking points for each section — what to say and what to listen for
3. Questions to ask in each section (listen > talk)
4. How to handle if they raise [most likely objection or concern]
5. Expansion discussion framework (if GREEN account)
6. Renewal discussion timing and approach
```

**Étape 4.2 — Envoyer l'ordre du jour (5 jours avant)**

Envoyez l'ordre du jour au client au moins 5 jours avant — pas la veille au soir.

Modèle d'e-mail :
```
Subject: [Company] + [Your Company] — QBR Agenda, [Date]

Hi [Name],

Looking forward to our QBR on [date]. Sharing the agenda in advance so we can make the most of our time together.

[TIME] — [Topic 1]
[TIME] — [Topic 2]
[TIME] — [Topic 3]
[TIME] — [Topic 4: Next quarter goals and action items]

Before we meet, one question for you:
What would make this the most valuable [60] minutes for your team this quarter?

Feel free to add anything you'd like us to cover. See you on [date].

[CSM Name]
```

---

## Phase 5 — Préparation pré-appel (1 jour avant)

**Étape 5.1 — Briefing de l'équipe interne**

Si l'AE ou le VP participe, briefez-les avant l'appel :

```
/qbr-builder

Write an internal briefing for the [AE / VP CS] joining the QBR with [Customer Name] tomorrow.

Key points they need to know:
- Account health and the reason for the current rating
- Commercial situation: ARR, renewal date, churn risk if any
- The primary goal of this QBR
- One thing they should NOT bring up
- One thing they should reinforce if it comes up naturally
- Expansion opportunity (if applicable) — what it is and whether to raise it in this session

Keep it to half a page — they need context, not a full history.
```

**Étape 5.2 — Anticiper la question difficile**

Chaque QBR a un sujet inconfortable. Identifiez-le et préparez votre réponse.

Demandez-vous : « Quel est le seul point que j'espère qu'ils ne soulèveront pas ? » — c'est précisément ce pour quoi vous devez vous préparer.

Préparez votre réponse avec `/qbr-builder` et entraînez-vous à la formuler à voix haute avant l'appel.

**Étape 5.3 — Vérification finale**

- La présentation est prête et testée (le partage d'écran fonctionne, les liens sont actifs)
- Toutes les données sont extraites et formatées
- La démo produit (si incluse) est scriptée et testée dans l'environnement du client si possible
- Vous connaissez la date de renouvellement du client à la semaine près — pas approximativement
- Vous savez qui est le décideur économique et s'il sera présent

---

## Phase 6 — Pendant le QBR

**Ratio idéal : 40% vous parlez, 60% eux parlent.**

Si vous parlez plus de 40% du temps, vous faites une présentation — pas un QBR.

**Règles essentielles :**
- Commencez par une question, pas votre ordre du jour
- Quand ils vous donnent une priorité ou une préoccupation, notez-la de manière visible — cela signale que vous avez entendu
- Ne réagissez pas de façon défensive aux critiques — reconnaissez, interrogez, comprenez
- Ne sautez pas la section des points d'action — clôturez toujours avec des prochaines étapes documentées, des responsables et des dates

**Si la conversation sort du sujet :**
« C'est vraiment important — je veux m'assurer de l'aborder correctement. Pouvons-nous le mettre de côté et y revenir dans les 10 dernières minutes ? Je veux lui accorder le temps qu'il mérite. »

---

## Phase 7 — Suivi post-appel (le jour même, dans les 2 heures)

**Étape 7.1 — E-mail de suivi**

```
/qbr-builder

Write the post-QBR follow-up email for [Customer Name].

The call was: [45/60/90 minutes] with [attendees]
What we covered:
- Key topics discussed: [list]
- Value delivered recap: [1-2 sentences]
- Issues raised by them: [describe]
- How I responded or what we committed to: [describe]
- Expansion discussion: [did it happen? What was the outcome?]
- Renewal: [what was discussed? Timeline?]

Action items agreed:
- [Action]: Owner [who], due [date]
- [Action]: Owner [who], due [date]

Next touchpoint: [date and format]

Write: professional, warm follow-up email that recaps the session, documents all commitments,
and confirms next steps. Send same day.
```

**Étape 7.2 — Mise à jour CRM**

Mettez à jour le compte dans le CRM dans les 24 heures suivant le QBR :
- Score de santé (révisé si nécessaire sur la base de l'appel)
- Date du dernier QBR
- Date de renouvellement confirmée
- Opportunité d'expansion notée (montant, calendrier, statut)
- Points d'action sous forme de tâches avec dates d'échéance
- Citations clés ou signaux du client

**Étape 7.3 — Débrief interne**

Si un dirigeant ou un AE a participé, envoyez-leur un résumé interne en 3 points :
- Ce qui s'est bien passé
- Les préoccupations soulevées
- La prochaine étape convenue

---

## Benchmarks de qualité du QBR

| Indicateur | Vert | Jaune | Rouge |
|---|---|---|---|
| Taux de complétion des QBR (% des comptes éligibles) | 100% | 75-99% | < 75% |
| Discussion sur le renouvellement complétée dans le QBR | Oui | - | Non (sera en difficulté au renouvellement) |
| Points d'action documentés | Tous | La plupart | Aucun (« super appel ! ») |
| Suivi envoyé le jour même | Oui | Lendemain | Plus tard ou jamais |
| Le client confirme la date avant expiration | 5+ jours avant | 1-4 jours | Précipitation le jour J |
| Opportunités d'expansion identifiées | ≥ 1 par compte VERT | - | Aucune explorée |

---
