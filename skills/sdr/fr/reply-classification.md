# Classification des réponses

## Quand l'activer

Vous recevez une réponse de prospect à un email, un message ou une tentative d'appel sortant. Vous devez classer la réponse, rédiger une réponse immédiate et l'acheminer vers l'action correcte dans votre flux de vente. Ceci s'applique aux flux de travail SDR, à la prospection des fondateurs et à tout engagement B2B où le type de réponse détermine le rythme de suivi et la tactique.

## Quand NE PAS l'utiliser

- Ne pas utiliser pour les prospects entrants ayant un intérêt préétabli — ils passent directement au routage des appels commerciaux.
- Ne pas utiliser pour les introductions chaudes où l'introducteur a déjà pré-qualifié — acheminez directement à CHAUD ou TRÈS CHAUD.
- Ne pas utiliser pour les réponses automatiques, les messages d'absence du bureau ou les rebonds — signalez-les comme du bruit système.
- Ne pas utiliser pour les réponses plus vieilles de 10 minutes sans relire le contexte actuel — l'intention du prospect peut changer.

## Instructions

### Système de classification à six catégories

#### Catégorie 1 : TRÈS CHAUD
**Définition :** Intérêt explicite + demande de réunion, appel, tarif ou démo. Pas d'ambiguïté.

**Indicateurs :**
- "Quand pouvons-nous nous appeler ?"
- "Envoie-moi un lien de démo."
- "Quel est votre tarif ?"
- "Je suis intéressé ; mettons quelque chose en place."
- "Pouvons-nous parler lundi ?"

**SLA de réponse :** < 1 heure (idéalement dans les 15 minutes).

**Tags CRM :** `hot`, `demo_requested`, `meeting_booked` (ou `calendar_pending`).

**Modèle d'action :**
```
[Ouverture] Merci — je suis ravi d'échanger.

[Prochaine étape] J'ai bloqué [heure spécifique, par exemple, "mardi 14 h HE"] — ça te convient ?
Sinon, [donner 2-3 autres options, toutes dans les 48 heures].

[Crédibilité] En attendant, [insérer 1 étude de cas ou métrique pertinente].

[Signature] J'attends avec impatience.
```

**Exemple de réponse TRÈS CHAUD :**
```
Prospect : "Ça semble intéressant. Pouvons-nous programmer un appel cette semaine ?"

Votre réponse :
Bonjour [Nom],

Excellent. J'ai mardi 10 h et jeudi 14 h HE — les deux me conviennent. Lequel te convient le mieux ?

En attendant, j'ai joint une brève étude de cas de [entreprise similaire dans son secteur] 
qui a constaté une amélioration de 40 % en [leur métrique clé] dans les 90 premiers jours.

J'attends avec impatience.

[Lien vers le calendrier avec 3 créneaux + joindre une fiche d'une page]
```

---

#### Catégorie 2 : CHAUD
**Définition :** Intéressé mais a une contrainte — calendrier, cycle budgétaire, priorité concurrente ou question de portée.

**Indicateurs :**
- "Ça pourrait fonctionner pour nous le trimestre prochain."
- "Nous explorons ceci, mais notre budget gèle jusqu'au Q3."
- "C'est intéressant, mais nous priorisons X en ce moment."
- "J'aime bien — je dois d'abord vérifier avec mon équipe."
- "Ça semble bon. Pouvez-vous me recontacter dans un mois ?"

**SLA de réponse :** Le même jour (dans les 4-6 heures).

**Tags CRM :** `warm`, `follow_up_scheduled`, `constraint_identified` (taguer la contrainte spécifique : `budget_cycle`, `timing`, `alignment_needed`, `stakeholder_involved`).

**Modèle d'action :**
```
[Reconnaître] Je comprends — [répéter la contrainte honnêtement].

[Reformuler] Ce timing joue en notre faveur car [expliquer pourquoi la contrainte est soluble ou temporaire].

[Engagement spécifique] Verrouillons [date spécifique — par exemple, "15 août"] pour que cela reste sur votre radar.
Je vais vous envoyer [valeur spécifique : 1 guide, benchmark ou checklist pertinent] en attendant.

[Tactique] Question : Quand vous revisitez ceci en [leur calendrier], quelle sera la priorité principale à valider ?
[Cette réponse vous aide à pré-positionner votre message.]

[Tâche CRM] J'ai noté ceci dans notre système — vous aurez de mes nouvelles le [date].
```

**Exemple de réponse CHAUD :**
```
Prospect : "C'est intéressant, mais nous sommes engagés sur d'autres priorités jusqu'au Q3. 
Peut-être me relancer ensuite ?"

Votre réponse :
Bonjour [Nom],

D'accord — Q3 est parfait. Q2 est en fait quand la plupart des équipes commencent à évaluer les outils pour 
une implémentation Q3/Q4, donc nous sommes en bonne position pour nous préparer.

Verrouillons le 15 août pour une conversation. En attendant, je vais vous envoyer notre 
"[Industrie] - Checklist prêt" — 3 questions pour valider si [votre solution] 
convient à votre stack.

Question rapide : Quand vous revisitez ceci en août, allez-vous évaluer 
[cas d'usage principal] ou [cas d'usage alternatif] ? Cela m'aide à adapter ce que nous discutons.

J'ai mis une alerte pour le 10 août. À bientôt.

[PDF Checklist]
```

---

#### Catégorie 3 : NEUTRE
**Définition :** Poli mais non-engageant. Aucune contrainte, aucune objection — juste un intérêt tiède.

**Indicateurs :**
- "C'est intéressant, je vais le garder en tête."
- "Merci de vous être manifesté — ça semble utile."
- "Ce n'est pas une priorité en ce moment, mais merci."
- "Je vais jeter un coup d'œil."
- [Pas de réponse après 3 jours de prospection initiale — traiter comme NEUTRE au deuxième contact.]

**SLA de réponse :** 24–48 heures.

**Tags CRM :** `neutral`, `one_follow_up_sent`, `interest_level_low`, `deprioritise_after_followup`.

**Stratégie d'action :**
- Envoyer exactement UN suivi avec une question très spécifique conçue pour découvrir une objection cachée ou un besoin caché.
- Si la question obtient un rejet ou du silence, déprioritisez immédiatement.
- Ne bouclez pas plus d'une fois les prospects NEUTRES — cela gaspille la vélocité du pipeline.

**Modèle d'action :**
```
[Personnalisation] J'ai remarqué que vous [action spécifique — par exemple, "avez visité notre page de tarification" / "avez ouvert mon dernier email"].

[Question spécifique] Question rapide : Quand vous pensez à [leur problème central], 
est-ce que [point de friction spécifique] est quelque chose que votre équipe gère actuellement ?

[Fermeture basse pression] Si ce n'est pas à l'esprit, pas de souci — je suis là si ça change.
Répondez avec un seul mot si vous voulez rester connecté.
```

**Exemple de réponse NEUTRE :**
```
Prospect (réponse initiale) : "Merci de vous être manifesté. Ça semble intéressant — je vais jeter un coup d'œil."

Votre suivi (1 jour plus tard) :
Bonjour [Nom],

Question rapide : J'ai remarqué que vous travaillez en [département]. Quand votre équipe gère [processus principal], 
comment gérez-vous actuellement [goulot d'étranglement spécifique que vous savez qu'ils rencontrent] ?

Je suis curieux de savoir si c'est un point de friction pour vous. Si ce n'est pas le cas, je comprends tout à fait — je vous recontacterai 
dans 6 mois si les choses changent.

[Seule question — pas de pitch]
```

---

#### Catégorie 4 : OBJECTION
**Définition :** Refus spécifique et énoncé — prix trop élevé, préférence concurrente, calendrier désaligné ou écart de besoin énoncé.

**Indicateurs :**
- "Nous utilisons déjà [concurrent]."
- "Votre tarif est trop élevé pour notre budget."
- "Nous ne sommes pas prêts pour ceci en ce moment."
- "Pourquoi aurions-nous besoin de ceci quand nous avons [solution interne] ?"
- "Je ne pense pas que ceci résout [problème spécifique que nous avons]."

**SLA de réponse :** Le même jour (dans les 2 heures, c'est idéal — montre que vous prenez les objections au sérieux).

**Tags CRM :** `objection`, `objection_type:[price|timing|competitor|feature_gap|internal_solution]`.

**Principe fondamental :** NE JAMAIS argumenter ni se défendre. Reconnaître, reformuler avec preuve sociale ou logique, rediriger avec une question qui avance vers l'insight.

**Modèle d'action :**
```
[Reconnaissance — répéter exactement leur préoccupation]
"Je comprends — [répéter l'objection en leurs paroles]. Ça a du sens."

[Reformulation — offrir une nouvelle perspective ou un point de données, PAS un contre-argument]
"Voici ce que j'ai trouvé : [entreprises similaires / point de données / insight client qui répond à leur préoccupation]."

[Question — rediriger vers un nouvel angle ou profondeur]
"Question : [demander quelque chose qui révèle si l'objection est réelle ou une tactique de retard] ?"

[Prochaine étape — conditionnelle, basée sur ce dont ils ont besoin pour avancer]
"Si nous pouvions [résoudre leur objection], cela changerait-il les choses ?"
```

**Prompts spécifiques à l'objection :**

**Objection de prix :**
```
Je comprends — le budget est serré. Voici ce que j'ai vu avec [entreprise de taille similaire] :
ils ont commencé par [1 cas d'usage spécifique] pour [coût X] au lieu d'un déploiement complet.
Ont vu [ROI spécifique] en 60 jours, puis ont étendu.

Une approche progressiste aurait-elle du sens pour vous ?
```

**Objection concurrent :**
```
[Concurrent] est solide — nous les voyons dans [X% d'entreprises similaires].
Voici où nous différons : [une différence spécifique et prouvable — pas des fonctionnalités, mais des résultats].

Avez-vous [quelque chose spécifique que le concurrent ne traite pas] ?
```

**Objection de timing :**
```
Le timing est important. La plupart des équipes qui retardent plus de 6 mois finissent par en avoir besoin plus tôt que prévu.
Question : Qu'est-ce qui devrait se passer dans les 30 prochains jours pour que cela monte sur votre liste ?
```

**Objection d'écart de fonctionnalité :**
```
C'est un bon point — [reconnaître l'écart]. Voici ce que nous entendons d'équipes similaires :
[expliquer comment le résultat est réalisé malgré l'écart, OU expliquer la feuille de route].

Cet écart spécifique est-il un bloquant, ou y a-t-il une solution qui convient à votre flux de travail ?
```

**Exemple de réponse OBJECTION :**
```
Prospect : "Votre tarif est bien supérieur à [concurrent]. Nous ne pouvons pas justifier cette dépense en ce moment."

Votre réponse :
Bonjour [Nom],

Je comprends — le tarif est une contrainte réelle. Je vais être direct : nous ne sommes pas les moins chers. 
Voici pourquoi les équipes nous choisissent malgré tout : [client médian] a récupéré son coût annuel 
dans les économies d'implémentation dans les 90 jours.

Je sais que [concurrent] coûte moins cher au départ. Ils sont bons. Compromise différent cependant — 
ils nécessitent 2-3x plus de configuration manuelle et d'ajustement continu.

Question rapide : Combien de temps votre équipe consacre-t-elle actuellement à [processus manuel 
que notre produit automatise] ? Si nous pouvions récupérer ne serait-ce qu'une partie de ce temps, 
le calcul du ROI fonctionnerait-il ?

Je suis heureux d'explorer les options si vous voulez creuser davantage.
```

---

#### Catégorie 5 : REJET
**Définition :** Non catégorique, manque d'intérêt explicite ou pertinence énoncée pour leur entreprise.

**Indicateurs :**
- "Je ne suis pas intéressé."
- "Nous n'avons pas besoin de ceci."
- "Veuillez me retirer de votre liste."
- "Mauvais timing — jamais pour nous."
- "Ceci ne s'applique pas à notre entreprise."

**SLA de réponse :** Dans l'heure (respectez leur temps et limite).

**Tags CRM :** `rejected`, `retirement_date:[6 mois à partir d'aujourd'hui]`, `do_not_contact_until:[date]`.

**Principe fondamental :** Remercier, respecter la limite, NE PAS essayer de convaincre. Définir une date de retraite automatique dans CRM (6 mois). Archiver le fil.

**Modèle d'action :**
```
[Respect] Pas de problème du tout — j'apprécie de vous l'avoir laissé savoir.

[Fermeture] Si jamais les choses changent à l'avenir, vous savez où me trouver.

[Signature] Bonne chance avec [leur entreprise principale].
```

**Exemple de réponse REJET :**
```
Prospect : "Je ne suis pas intéressé. Veuillez arrêter de me contacter."

Votre réponse :
Bonjour [Nom],

Complètement compris. Je vais vous retirer de ma liste — pas plus d'emails de ma part.

Si votre situation change un jour, n'hésitez pas à vous manifester.

Bonne chance avec [leur domaine d'intérêt énoncé].
```

**Action CRM :** Définir la tâche : `Réactiver [Nom] le [date 6 mois à partir de maintenant]` avec la note : "Vérifier si l'entreprise a grandi ou si les priorités ont changé."

---

#### Catégorie 6 : HORS ICP
**Définition :** Mauvaise personne, mauvais stade de l'entreprise, mauvaise industrie ou "pas pertinent pour nous" explicite.

**Indicateurs :**
- "Je ne suis pas la bonne personne — parlez à [Nom dans un département différent]."
- "Nous sommes une entreprise [stade] — ceci est pour [autre stade]."
- "Notre industrie n'utilise vraiment pas vraiment [ce type de solution]."
- "Nous externalisons cette fonction — parlez à notre [fournisseur/partenaire]."

**SLA de réponse :** Dans les 4 heures (utilisez leur momentum de référence).

**Tags CRM :** `not_icp`, `referred_to:[nom du nouveau contact + titre]`, `referral_source:[nom du prospect original]`.

**Principe fondamental :** Traiter la référence comme un cadeau. Demander la permission, obtenir le bon email, personnaliser la prospection avec le contexte de référence.

**Modèle d'action :**
```
[Gratitude] Merci beaucoup de m'avoir indiqué [la bonne personne].

[Permission] Puis-je mentionner que vous l'avez suggéré(e), ou préférez-vous que je ne le fasse pas ?

[Demande de connexion] Ce serait bizarre si je le/la contactais directement, ou préférez-vous que je fasse une introduction ?

[Repli] Si direct est mieux, vous pouvez me transmettre son email ?
```

**Exemple de réponse HORS ICP :**
```
Prospect : "Je m'occupe du budget, mais c'est vraiment une question d'opérations. Parlez à Sarah Chen — elle est notre VP Opérations."

Votre réponse :
Bonjour [Nom],

Merci pour cela — Sarah est exactement avec qui j'ai besoin de parler.

Puis-je vous mentionner comme l'ayant suggérée, ou préférez-vous que je ne fasse pas référence à notre conversation ?

Si vous êtes ouvert à cela, je pourrais rédiger un message et vous pouvez le transférer — 
ou je peux le contacter à froid en mentionnant votre nom. L'un ou l'autre fonctionne pour moi.

J'apprécie la direction.
```

**Action CRM immédiate :**
```
1. Créer un nouvel enregistrement de prospect : Sarah Chen, VP Opérations, [Entreprise], avec la note "Référence par [prospect original]"
2. Taguer le prospect original : `referral_sent_to:[nouveau prospect], date:[aujourd'hui]`
3. Personnaliser la première prospection : "Bonjour Sarah, [Prospect original] a suggéré que je me connecte avec vous concernant..."
```

---

### Prompt de classification (à utiliser avec Claude)

```
Vous êtes un classificateur de réponses de ventes B2B. Un prospect a répondu à un message sortant. 
Classifiez sa réponse dans exactement l'une de ces six catégories, rédigez une réponse et 
identifiez les actions CRM.

Réponse du prospect :
---
[INSÉRER LA RÉPONSE DU PROSPECT ICI]
---

Tâche de classification :
1. Déterminer la meilleure catégorie unique : TRÈS CHAUD, CHAUD, NEUTRE, OBJECTION, REJET, HORS ICP
2. Lister 2–3 indicateurs spécifiques qui soutiennent cette classification
3. Identifier le SLA de réponse (fenêtre de temps)
4. Rédiger une réponse en utilisant le modèle approuvé pour cette catégorie
5. Spécifier les tags CRM et toutes les tâches de suivi programmées

Format de sortie :
**Classification :** [CATÉGORIE]
**Indicateurs :** [lister 2-3 phrases/signaux spécifiques de leur réponse]
**SLA :** [fenêtre de temps]
**Tags CRM :** [tags à appliquer]
**Brouillon de réponse :**
[Votre réponse rédigée complète, prête à envoyer — pas d'édits nécessaires]
**Actions CRM :**
- [Action 1]
- [Action 2]

Souvenez-vous : Ne jamais argumenter avec les objections. Toujours poser une question de clarification pour les réponses NEUTRES. 
Toujours demander des infos de référence pour HORS ICP. Toujours respecter les limites de REJET.
```

---

### Arbre de décision (référence rapide)

```
Le prospect a répondu. Demandez dans l'ordre :

1. Demandent-ils une réunion, appel, démo ou tarif ?
   → OUI : TRÈS CHAUD (réponse < 1 heure)
   → NON : Question suivante

2. Expriment-ils de l'intérêt mais mentionnent une contrainte de timing, budget ou priorité ?
   → OUI : CHAUD (réponse le même jour, verrouiller date spécifique)
   → NON : Question suivante

3. Leur réponse est-elle polie mais non-engageante, sans contrainte ou objection énoncée ?
   → OUI : NEUTRE (un suivi avec question spécifique seulement)
   → NON : Question suivante

4. Énoncent-ils une objection spécifique (prix, concurrent, besoin, timing) ?
   → OUI : OBJECTION (reconnaître, reformuler, rediriger avec question)
   → NON : Question suivante

5. Disent-ils explicitement "non", "pas intéressé" ou "retirez-moi" ?
   → OUI : REJET (remercier, respecter limite, retraite 6 mois)
   → NON : Question finale

6. Sont-ils le mauvais contact, mauvais stade de l'entreprise, ou explicitement hors portée ?
   → OUI : HORS ICP (demander référence, remercier, escalade via référent)
   → NON : Relire la réponse originale — vous avez peut-être mal classifié.
```

---

### SLA et résumé du flux de travail CRM

| Catégorie | SLA de réponse | Tag CRM | Action CRM suivante | Déclencheur de suivi |
|----------|--------------|---------|-----------------|------------------|
| **TRÈS CHAUD** | < 1 heure | `hot` | Créer lien calendrier + envoyer confirmation | Confirmation calendrier ou annulation |
| **CHAUD** | Le même jour (4–6 h) | `warm` + type de contrainte | Définir tâche : suivi à date spécifique | Date de suivi cible ou silence après 3 jours |
| **NEUTRE** | 24–48 heures | `neutral`, `one_follow_up_sent` | UN suivi seulement ; en cas de silence, déprioritiser | 7 jours de silence = fermer boucle, marquer `deprioritised` |
| **OBJECTION** | Le même jour (< 2 h) | `objection` + type | Définir tâche : suivi après réponse | Le prospect répond à nouveau ou 5 jours de silence = NEUTRE |
| **REJET** | Dans l'heure | `rejected`, `retire_date:[6m]` | Définir rappel pour réactiver dans 6 mois | Date de réactivation seulement |
| **HORS ICP** | Dans les 4 heures | `not_icp`, `referred_to:[nom]` | Contacter le prospect référé ; tagger source | Suivi de référence envoyé |

---

### Alertes de piège

**Classer CHAUD au lieu de TRÈS CHAUD :**
Le prospect dit : "Ça semble bon — parlons le trimestre prochain."
Erreur : Traiter comme TRÈS CHAUD parce qu'il a dit "parlons."
Correct : C'est CHAUD. Ils ont une contrainte de timing. Verrouiller la date spécifique (Q3), envoyer contenu de valeur entre-temps.

**Argumenter avec OBJECTION :**
Erreur : "En fait, notre tarif est juste parce que..."
Correct : "Je comprends — le prix est une contrainte. Voici ce que d'autres équipes ont trouvé..."

**Boucler NEUTRE sans fin :**
Erreur : Envoyer 3–4 suivis à un prospect "Je vais garder ça en tête".
Correct : Un suivi avec question de sondage. Silence après = fermer, passer.

**Oublier de demander référence en HORS ICP :**
Erreur : "Merci pour le contexte — bonne chance."
Correct : "Pouvez-vous m'introduire à [personne qu'ils ont nommée] ? Comment dois-je les contacter ?"

**Respecter REJET mais vérifier 2 semaines plus tard :**
Erreur : Vous avez défini une retraite de 6 mois, mais après 2 semaines vous écrivez : "Juste pour vérifier..."
Correct : Vraiment les retirer. Définir rappel calendrier pour 6 mois. Ne pas revisiter.

---

## Exemple

### Scénario 1 : Classification TRÈS CHAUD

**Réponse du prospect :**
```
Hé [Votre nom],

C'est exactement ce dont nous avons besoin. Notre équipe cherchait une solution comme celle-ci 
depuis des mois. Quand pouvons-nous programmer une démo ? Nous sommes disponibles jeudi ou vendredi cette semaine.

Merci,
[Nom du prospect]
```

**Sortie de classification :**

**Classification :** TRÈS CHAUD

**Indicateurs :**
- "C'est exactement ce dont nous avons besoin" (validation explicite)
- "Nous cherchions une solution comme celle-ci depuis des mois" (pain + validation énoncés)
- "Quand pouvons-nous programmer une démo ?" (demande explicite de réunion)

**SLA :** < 1 heure (visez 15 minutes)

**Tags CRM :** `hot`, `demo_requested`, `meeting_pending`

**Brouillon de réponse :**
```
Bonjour [Nom du prospect],

Excellent — je suis aussi ravi de cet ajustement.

J'ai bloqué jeudi 14 h HE et vendredi 10 h HE. Lequel te convient le mieux ?

Je vais vous envoyer un bref aperçu de votre cas d'usage avant notre appel. J'enferme également 
une étude de cas de [entreprise similaire dans leur secteur] — ils ont implémenté en Q1 
et ont réduit leur [métrique clé dont ils se soucient] de 30 % au premier trimestre.

J'attends avec impatience la connexion.

[Lien vers sélecteur de calendrier 15 min avec les deux créneaux]
[Aperçu produit d'une page + 1 PDF d'étude de cas pertinente]
```

**Actions CRM :**
- Créer bloc calendrier pour jeudi 14 h et vendredi 10 h
- Taguer prospect : `hot`, `demo_requested`
- Si confirmé : créer tâche "Envoyer bref pré-appel + étude de cas" avec délai de 2 heures
- Escalade vers directeur de ventes pour visibilité (si cela fait partie de votre processus)

---

### Scénario 2 : Classification CHAUD

**Réponse du prospect :**
```
Merci de vous être manifesté. C'est définitivement sur notre feuille de route, mais nous n'aurons 
pas d'approbation budgétaire avant le Q3. Le timing n'est pas idéal en ce moment, mais j'aime ce que vous faites.

Laissez-moi savoir comment rester dans la boucle pour plus tard.

[Nom du prospect]
```

**Sortie de classification :**

**Classification :** CHAUD

**Indicateurs :**
- "C'est définitivement sur notre feuille de route" (besoin validé)
- "N'aura pas d'approbation budgétaire avant le Q3" (contrainte spécifique + intention future)
- "J'aime ce que vous faites" (intérêt authentique, pas un rejet poli)

**SLA :** Le même jour (dans les 6 heures)

**Tags CRM :** `warm`, `follow_up_scheduled`, `constraint_identified:budget_cycle`, `budget_approval_Q3`

**Brouillon de réponse :**
```
Bonjour [Nom du prospect],

Parfait — le Q3 est un timing idéal. La plupart des équipes évaluent les fournisseurs en Q2 pour 
une implémentation en Q3, donc vous êtes en avance sur la courbe.

J'ai verrouillé le 15 août sur mon calendrier pour vous reconnecter. En attendant, je vais vous envoyer notre 
"Checklist d'évaluation des fournisseurs" — trois questions pour valider l'ajustement avant 
votre examen budgétaire.

Question rapide : Quand vous revisitez ceci en Q3, allez-vous chercher à résoudre 
[cas d'usage principal] ou [cas d'usage alternatif] ? Cela m'aide à m'assurer que nous sommes positionnés 
sur ce qui compte le plus pour vous.

J'attends avec impatience la connexion en Q3.

[PDF Checklist]
```

**Actions CRM :**
- Créer tâche : "Suivi avec [Nom du prospect] le 15 août"
- Tagger : `warm`, `follow_up_scheduled`, `budget_cycle_Q3`
- Définir rappel : "Envoyer contenu de valeur (checklist, guide, benchmark) dans les 24 heures"
- Noter dans le fil : "Contrainte : Approbation budgétaire non disponible avant Q3. Pas d'objection au produit."

---

### Scénario 3 : Classification OBJECTION

**Réponse du prospect :**
```
Je vous apprécie de vous être manifesté. Nous avons déjà [nom concurrent] en place, 
et les coûts de passage seraient trop élevés en ce moment. C'est un bon produit, 
mais je ne vois pas de raison de bouger.

[Nom du prospect]
```

**Sortie de classification :**

**Classification :** OBJECTION

**Indicateurs :**
- "Avons déjà [concurrent] en place" (alternative concurrente énoncée)
- "Les coûts de passage seraient trop élevés" (préoccupation spécifique et quantifiée)
- "Ne vois pas de raison de bouger" (validation des besoins, pas un rejet)

**SLA :** Le même jour (< 2 h)

**Tags CRM :** `objection`, `objection_type:competitor`, `incumbent:[nom concurrent]`

**Brouillon de réponse :**
```
Bonjour [Nom du prospect],

[Concurrent] est solide — nous les voyons chez environ 40 % des entreprises avec qui nous parlons. 
Pas de discussion là-dessus.

Voici où nous différons : Nous sommes construits pour [résultat spécifique que le concurrent ne priorise pas], 
ce qui signifie généralement [bénéfice concret]. La plupart des équipes avec lesquelles nous avons travaillé avaient [concurrent] 
fonctionnant en parallèle au départ, puis ont progressivement déplacé des flux de travail.

Question : Votre équipe gère-t-elle actuellement [processus spécifique qui est douloureux avec concurrent] ? 
Si ce n'est pas un point de friction, alors oui, restez avec ce que vous avez. Mais si c'est le cas, 
nous avons un essai de 30 jours sans risque.

Cela vaut une conversation rapide ? Ou devrais-je revérifier dans 6 mois ?
```

**Actions CRM :**
- Tagger : `objection`, `objection_type:competitor`, `incumbent:[nom concurrent]`
- Définir tâche : "Suivi s'ils ne répondent pas dans 5 jours" (ils pourraient reconsidérer)
- Noter : "La préoccupation relative au coût de passage est réelle — commencer par le support de migration dans le prochain message s'ils s'engagent"

---

### Scénario 4 : Classification NEUTRE

**Réponse du prospect :**
```
Merci de vous être manifesté. Ça semble intéressant. Je vais jeter un coup d'œil et vous recontacter 
si je pense que c'est un ajustement.

[Nom du prospect]
```

**Sortie de classification :**

**Classification :** NEUTRE

**Indicateurs :**
- "Ça semble intéressant" (poli, non-engageant)
- "Je vais jeter un coup d'œil" (pas de calendrier, pas d'urgence)
- Pas de contrainte énoncée, pas d'objection, pas de demande

**SLA :** 24–48 heures

**Tags CRM :** `neutral`, `one_follow_up_scheduled`

**Brouillon de réponse (envoyer 1 jour plus tard) :**
```
Bonjour [Nom du prospect],

Question rapide : Quand votre équipe gère [leur processus principal], est-ce que [point de friction spécifique 
pertinent à votre solution] te ralentit ?

Je suis curieux de savoir si c'est sur votre radar. Si ce n'est pas le cas, pas de souci — je recontacterai dans 6 mois 
si les choses changent.

Un seul mot en retour et je resterai connecté.
```

**Actions CRM :**
- Tagger : `neutral`
- Définir un suivi seulement (programmé 1 jour à partir de maintenant)
- En cas de silence 7 jours après suivi : tagger `deprioritised`, fermer boucle
- NE PAS boucler plus d'une fois

---

Ce système de compétences garantit que chaque réponse est traitée avec précision, que chaque prospect sait à quoi s'attendre, et qu'aucune énergie n'est gaspillée sur des réponses qui ne convertissent pas. Utilisez l'arbre de décision ci-dessus comme votre référence rapide en prospection en temps réel.
