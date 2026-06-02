# Séquenceur de Suivi

## Quand activer

Lors de la gestion de séquences SDR ou de vente où vous devez acheminer les interactions avec les prospects via des branches déterministes basées sur le type de réponse, appliquer des cadences de suivi standardisées et prendre des décisions de réengagement. Déclenchez : (1) email de sensibilisation initial envoyé et suivi, (2) réponse détectée (positive, négative ou nulle), ou (3) point de décision de réengagement à 60+ jours. Utilisez ceci pour remplacer la logique de suivi ad-hoc et assurer une cohérence temporelle, de messaging et de gestion des objections sur tout le volume du pipeline.

## Quand ne pas utiliser

Ne pas utiliser pour : les interactions unidirectionnelles ponctuelles, les communications internes d'équipe, les séquences de nurture post-réunion (celles-ci utilisent une logique différente — voir les workflows post-découverte), ou les campagnes de diffusion « toujours actives ». Ne pas appliquer la logique de séquençage aux pistes inbound chaleureuses ou aux SQL déjà qualifiés par le développement commercial. Ne pas compresser les délais ou ignorer les branches parce que « nous voulons une conversion plus rapide » — les délais des branches sont calibrés pour la délivrabilité, l'engagement et la conviction des objections.

## Instructions

### Logique de Séquençage Core : Trois Branches

#### Branche A : Réponse Positive (Action Requise le Même Jour)

Quand un prospect répond avec intérêt, signal d'engagement ou question :

1. **Quitter la séquence immédiatement** — retirer le prospect des suivis automatisés.
2. **Classifier la température de la réponse** (chaude/tiède/froide) :
   - **CHAUDE** : Demande explicite de réunion, mention de budget, signal de douleur urgent, ton exécutif, question de cas d'usage spécifique → l'intention de réunion est claire.
   - **TIÈDE** : Intéressé mais conditionnel (« Dis-moi plus sur X », « Comment ça se compare à Y ? », « Envoie-moi les infos »), délai non spécifié, ou test de vos connaissances → nécessite un appel de clarification ou une démo de valeur.
   - **FROIDE** : Refus poli (« merci mais ce n'est pas le bon moment »), objection énoncée, redirection (« parle à mon équipe »), ou courtoisie générique → classifier la branche d'objection (Branche C).

3. **Cadence de réponse le même jour** :
   - **Réponse CHAUDE** : Répondre dans les 2 heures. Message : confirmer l'heure de la réunion, éliminer les frictions (lien calendrier, Zoom), reformuler le problème avec vos mots, courte phrase sur le bénéfice mutuel. Viser réserver dans 48 heures. Ne pas surexpliquer ou faire de pitch.
   - **Réponse TIÈDE** : Répondre dans les 4 heures. Message : répondre à sa question spécifique en 1–2 phrases, ajouter un point de preuve (extrait d'étude de cas, stat, ou démo de feature), CTA doux (« J'enverrai une Loom rapide » ou « Parlons d'un appel pour explorer »). Planifier un appel de découverte pour 3–7 jours.

4. **Nurture post-réponse** :
   - **CHAUDE → Réunion réservée** : Passer au workflow de préparation de réunion. Suspendre le séquençage des suivis jusqu'à post-réunion.
   - **TIÈDE → Suivi dans 30 jours** : Si aucune réunion réservée après l'appel de découverte initial ou la réponse, réengager dans exactement 30 jours avec note de contexte spécifique : « La dernière fois qu'on s'est parlé, tu as posé une question sur [X]. Voici ce que j'ai appris... » Cela garde la conversation chaude sans churn.

---

#### Branche B : Pas de Réponse (Multi-Touch, Déclin Cadencé)

Quand le prospect ne répond pas dans la fenêtre de suivi :

**Jour 0** : Email initial envoyé (Email 1 : Hook de reconnaissance du problème).

**Jour 3** : Envoyer Email 2 — Cadrage de la Douleur.
- Prémisse : Votre email du Jour 0 a atteint la boîte de réception mais n'a pas déclenché de réponse (seuil d'engagement faible).
- Message : Passer de « vous devriez vous en soucier » à « voici ce qui casse pour les entreprises comme vous ». Utilisez les données, l'énoncé du problème ou l'écart de processus lié à leur entreprise/rôle. Introduire la preuve sociale (témoignage client, tendance, stat). Garder la ligne d'objet différente du Jour 0 (éviter le langage « suivi »).
- CTA : Plus doux que le Jour 0 — « Si ça résonne, parlons » plutôt que « Programmez un appel ».

**Jour 7** : Envoyer Email 3 — Demande de Délégation.
- Prémisse : Deux touches, pas de réponse. Le prospect peut être intéressé mais ne pas être la bonne personne, ou trop occupé.
- Message : « J'ai peut-être le mauvais contact — qui dans votre équipe supervise [processus/budget/décision] pour [résultat spécifique] ? » Vous enlève de l'équation et fournit une sortie facile (transférer au collègue).
- CTA : Aucun. S'attendre soit à un transfert, une redirection, ou un silence continu.

**Jour 12** : Envoyer Email 4 — Rupture (Email de Séquence Finale).
- Prémisse : Quatre touches sur 12 jours signale une faible intention ou une mauvaise adaptation.
- Message : Non-vendeur, adieu authentique-sounding. « Je vais me retirer — ça n'a pas l'air du bon moment. Si [déclencheur spécifique] change (nouvelle embauche, révision budgétaire, dette technique pic), j'aimerais renouer ».
- CTA : Pas de demande. Fermer la boucle gracieusement.

**Après Jour 12** : Parquer le prospect pour 60 jours.
- Définir une tâche à *ne pas* envoyer de courrier. Déplacer le prospect au segment « froid » dans le CRM.
- Définir le point de contrôle de réengagement au Jour 72 (60 jours + 12 jours écoulés).

---

#### Branche C : Réponse Négative (Routage des Objections)

Quand le prospect dit explicitement non, objecte, ou signale une intention négative :

1. **Classifier l'objection** :
   - **« Non merci » / « Pas intéressé »** : Déflexion poli, signal de faible conviction.
   - **« On utilise déjà [concurrent] »** : Alternative légitime en place.
   - **« Notre budget est gelé »** : Objection de timing (peut dégeler).
   - **« Ce n'est pas une priorité en ce moment »** : Faible urgence, pas de douleur active.
   - **« Tu n'es pas une bonne adaptation »** : Inadéquation explicite sur produit/marché.
   - **« Tu m'as contacté au mauvais moment/personne »** : Problème de routage, pas de problème produit.

2. **Tentative de reformulation unique uniquement** :
   - Répondre dans les 24 heures.
   - Prendre le cœur de l'objection et reformuler : « C'est logique que vous utilisiez [concurrent]. On fonctionne *différemment* parce que [différence clé liée à leur cas d'usage] ».
   - Ajouter preuve : citation client de quelqu'un dans la même situation, ou différence d'outcome spécifique.
   - *Ne pas* argumenter. *Ne pas* faire de pitch plus dur.
   - CTA unique : « Pas de pression — si [condition spécifique change], je t'enverrai ce que j'ai appris. Ça te semble bon ? »

3. **Décision finale après reformulation** :
   - **Le prospect accepte la condition de réengagement** : Définir la tâche pour le point de contrôle de réengagement (60 jours).
   - **Le prospect rejette la reformulation ou l'ignore** : Retirer le prospect pour 6 mois.
     - Tagger dans le CRM avec raison (solution en concurrence, budget, pas une adaptation, timing, etc.).
     - Définir tâche : « Revoir si [condition déclencheur] » (ex : « si Série B annoncée », « si remplacer [concurrent] », « si embaucher leader vente »).
     - *Ne pas* contacter jusqu'à ce que ce déclencheur se déclenche ou à la marque de 6 mois (le premier arrivant).

---

### Règles de Réengagement

Appliquer ces règles uniquement pour les prospects en parc de 60+ jours ou phase de retraite de 6 mois :

1. **Temps minimum écoulé** : 60 jours depuis le dernier contact (Branche B) ou 6 mois (Branche C). Ne pas compresser.

2. **Exigence de signal nouveau** — Un parmi :
   - Annonce de financement (Série A, B, ou round de croissance).
   - Changement d'emploi (prospect promu, déplacé vers une autre entreprise, ou rôle déplacé vers séniorité plus élevée).
   - Changement technologique (plates-formes commutées, stack nouveau adopté, ou initiative nouvelle annoncée).
   - Nouvelles publiques (expansion, nouveau bureau, nouveau produit, pivot stratégique, acquisition, changement de leadership).
   - Comportement inbound (site visité, email marketing ouvert, contenu LinkedIn cliqué).

3. **Structure de message** (référencer l'écart) :
   - Ouverture : « On s'est parlé il y a quelques mois sur [leur problème énoncé]. J'ai remarqué que tu [nouveau signal]. J'ai pensé que ça pouvait être opportun ».
   - Prémisse : Angle différent que la séquence originale. Si le Jour 0 était « problème de vitesse », réengager avec « problème d'échelle » ou « efficacité d'équipe ». Ne pas rejouer le pitch original.
   - Preuve : Nouvelle victoire client, feature produit, ou benchmark qui adresse directement le *nouveau* signal.
   - CTA : « Curieux si ça change la conversation. On peut prendre 20 minutes ? » (Moins de friction que la demande originale.)

4. **Cadence après réengagement** : Traiter comme nouvelle séquence. Appliquer la logique de Branche B (Jour 3, Jour 7, Jour 12) uniquement si l'email de réengagement n'obtient pas de réponse. *Ne pas* réutiliser l'ancienne copie d'email.

---

### Diagnostiques de Performance de Séquence

Pister ces métriques au *niveau séquence* (pas campagne-large) pour identifier les goulots et les corriger :

#### Diagnostic 1 : Taux d'Ouverture < 30%
**Problème** : Placement en boîte de réception ou fatigue de ligne d'objet.

- **Correction 1 (Délivrabilité)** : Vérifier alignement DKIM/SPF/DMARC. Vérifier que le domaine email n'est pas sur listes spam (vérifier MXToolbox). Tourner l'IP d'envoi ou le domaine si le taux persiste.
- **Correction 2 (Ligne d'objet)** : A/B tester les lignes d'objet en prochain envoi. Les performances basses si :
  - Tout en majuscules ou trop de marques de ponctuation (déclenche filtres spam).
  - Générique (« Suivi », « Question rapide ») vs. personnalisé (« J'ai vu que tu as embauché 3 engineers — voici ce que ça signifie pour Infra »).
  - Pas d'écart de curiosité ou pertinence au rôle.

**Cible** : 40–50% taux d'ouverture est fort pour sensibilisation froide ; 30% est minimum viable.

---

#### Diagnostic 2 : Taux d'Ouverture > 30%, Taux de Réponse < 2%
**Problème** : L'engagement ne se convertit pas en réponse. Contenu ou CTA unclear.

- **Correction 1 (Contenu)** : Est-ce que la proposition de valeur est claire dans les 2 premières lignes ? Le prospect devrait répondre « pourquoi c'est sur moi ? » en < 10 secondes. Réécrire pour :
  - Mener avec son problème (pas votre solution).
  - Utiliser 1–2 métriques de leur industrie (montre la recherche).
  - Garder le corps à max 100 mots.
  
- **Correction 2 (CTA)** : Est-ce que la demande est trop grande ? « Programmez un appel de découverte de 30 minutes » a une friction plus haute que « Je peux poser une question rapide ? » Réduire taille de demande :
  - Jour 0 : « Question rapide » ou « Une pensée ».
  - Jour 3 : « Ça résonne ? »
  - Jour 7 : « Qui devrais-je contacter ? »

**Cible** : 2–4% taux de réponse pour séquences froides B2B. Sous 1% signale contenu cassé ou qualité de liste.

---

#### Diagnostic 3 : Taux de Réponse > 2%, Taux de Réunion < 30%
**Problème** : Les réponses existent mais ne se convertissent pas en réunions. L'appel de découverte ou le CTA de réponse est unclear.

- **Correction 1 (Message de réponse)** : Quand vous répondez à une réponse positive, est-ce que le CTA est explicite ? Vague (« Parlons bientôt ») vs. explicite (« J'ai mardi 14h et jeudi 10h disponibles — lequel te convient ? »). Utiliser les liens calendrier (Calendly, Chili Piper). Réduire friction.

- **Correction 2 (Scripting d'appel de découverte)** : Est-ce que vos appels de découverte explorent *leur* problème ou font un pitch ? Auditer les appels pour : ouverture avec micro/caméra muets ? Parler en premier ? Ne pas poser de question sur timeline ? Remplacer avec :
  - « Qu'est-ce qui t'a amené à répondre ? »
  - « Si je pouvais faire un geste magique sur [problème], à quoi ça ressemblerait ? »
  - « Quand espérais-tu avoir ça résolu ? »

**Cible** : 30–50% des réponses devraient se convertir en réunions (dépend de température de réponse et de votre qualification).

---

### Superposition de Séquence Multi-Canal

L'email seul a 30–40% taux d'ouverture. Empiler les canaux pour conversion de réunion 2–3x :

```
Jour 0 : Email 1 (Hook de problème)
         ↓
Jour 1 : Voir leur profil LinkedIn + pas de message encore (signal passif)
         ↓
Jour 3 : Email 2 (Cadrage de douleur)
         ↓
Jour 5 : Message direct LinkedIn (pas demande de connexion)
         Message : « Vu ton profil — pensée rapide sur [leur récent changement d'emploi/entreprise/contenu] ».
         NE PAS renvoyer copie d'email.
         ↓
Jour 7 : Email 3 (Demande de délégation)
         ↓
Jour 7 (même jour) : Tentative d'appel téléphonique (optionnel, high-touch)
         Laisser voicemail si pas de réponse : « Salut [nom], c'est [votre nom] de [votre entreprise]. J'avais une pensée sur [problème] — rappelle-moi au [numéro]. Je t'envoie un email aussi ».
         ↓
Jour 12 : Email 4 (Rupture)
```

**Règles spécifiques au canal** :
- **Email** : Autorité, contexte, preuve. Utiliser pour déclaration de problème et reformulations.
- **Message LinkedIn** : Curiosité, bref, personnalisé à leur activité publique. « J'ai remarqué que tu as écrit sur [topic] — on voit [tendance associée] avec [entreprise similaire] ».
- **Téléphone** : Warmth, urgence, découverte. Utiliser voicemail pour amorcer suivi email. Si la personne répond, demander, ne pas faire de pitch. « C'est un mauvais moment ? » Écouter en premier.

**Bénéfice multi-canal** : Si email bounce ou se retrouve en spam, LinkedIn ou téléphone crée point de contact backup. Si they're receptifs à email mais pas téléphone, tu as appris la préférence.

---

### Structure de Tâche Quotidienne pour Gérer Plusieurs Séquences

Pour opérationaliser plusieurs séquences actives (50–100 prospects) sans dérive manuelle :

#### Examen Matinal (10 min)
1. Vérifier les réponses des envois d'hier (Email 1, 2, 3, 4 sur séquences actives).
2. Classifier chaque réponse : Chaude/Tiède/Froide ou Objection.
3. Créer tâches pour réponses le même jour (réponses Chaudes obtiennent minuteur 2-heures, réponses Tièdes obtiennent minuteur 4-heures).
4. Signaler tout nouveau signal positif (financement, changement d'emploi) pour prospects de réengagement en parc.

#### Bloc d'Envoi (par cadence)
- **Envois Jour 0** : Batch 20–30 envois Email 1 en bloc matinal (8–9am). Définir minuteur pour email Jour 3 (définir auto-envoi ou rappeler).
- **Envois Jour 3** : Auto-envoi Email 2 aux non-répondeurs du batch Jour 0. Examen manuel : des ouvertures qui n'ont pas répondu encore ? (Goulot possible.)
- **Envois Jour 7** : Auto-envoi Email 3. Vérification manuelle : quelqu'un qui a répondu entre Jour 3–7 ? Les sortir de la séquence, les passer au workflow Branche A.
- **Envois Jour 12** : Auto-envoi Email 4. Examen : quelqu'un qui passe à Branche C (objections) ? Les router au workflow de reformulation.

#### Examen Après-midi (10 min)
1. Vérifier les nouvelles réponses aux envois d'aujourd'hui (moins commun mais possible).
2. Logger tout signal de réengagement (financement, embauches, etc.). Tagger pour liste de réengagement 60 jours.
3. Confirmer les tâches d'envoi du jour suivant sont mises en queue (ou définir auto-envoi).

#### Examen Hebdomadaire (20 min)
- **Vérification de métriques** : Taux d'ouverture, taux de réponse, taux de réunion pour séquences de la semaine. Des diagnostiques déclenchés (< 30% ouverture, < 2% réponse, < 30% conversion réunion) ?
- **Examen de liste de parc** : Des prospects parqués 60 jours ou 6 mois prêts pour réengagement ? Vérifier pour nouveaux signaux.
- **Triage d'objection** : Quelqu'un dans reformulation d'objection ? Vérifier s'ils ont répondu à reformulation (dans 5 jours). Si non, les passer à retraite 6 mois, tagger raison.

#### Outils/Automatisation
- **Automatisation de tâche CRM** : Définir des règles donc emails Jour 3, 7, 12 se déclenchent automatiquement sauf si prospect a répondu (sortir de séquence sur réponse).
- **Rappels Slack/email** : Définir résumé quotidien 10am : « 20 prospects ont besoin de réponses le même jour. 5 séquences ont déclenché des diagnostiques. 3 prêts pour réengagement ».
- **Spreadsheet ou Airtable** : Pister chaque séquence : date d'envoi, ouvertures, réponses, réunion réservée, raison de parc/retraite.

---

## Exemple

### Scénario Réel : SDR SaaS Entreprise Gérant 60 Prospects Actifs

**Entreprise** : Plateforme d'intégration de données (entreprise). **SDR** : Alex. **Pool de prospects** : 60 leaders DevOps mid-market (VP/Director niveau).

---

**Semaine 1 : Sensibilisation Initiale (batch Jour 0)**

Alex envoie 20 Email 1s sur deux jours :
- Objet : « Dette d'ingénierie chez [entreprise] ? »
- Corps : « J'ai remarqué que [entreprise] a élargi votre équipe d'ingénierie des données 2x l'année dernière. Beaucoup d'entreprises avec qui on travaille frappent un mur d'échelle quand they do. Curieux si c'est sur votre roadmap ».
- CTA : « Une question rapide — est-ce que la complexité de pipeline de données est un problème pour votre équipe ? »

**Métriques Jour 0** : 12 sur 20 ouvertures (60% taux d'ouverture). ✅ Bon.

---

**Jour 3 : Cadrage de Douleur (Branche B, cohort pas de réponse)**

Alex envoie Email 2 à les 8 qui n'ont pas répondu :
- Objet : « Re: Dette d'ingénierie chez [entreprise] ? » (objet différent que Email 1).
- Corps : « Suivi — je vois une tendance. Les entreprises qui montent de 1 à 2 outils ETL se retrouvent d'habitude avec une plateforme de données cassante. Voici ce que ça coûte (étude de cas) : temps moyen de récupération est 6+ heures quand des défaillances arrivent. Deux questions : (1) Comment votre configuration actuelle échelle-t-elle ? (2) Qui supervise ça dans votre équipe ? »
- CTA : « Apprécie une réponse rapide — ou pointe-moi la bonne personne si c'est toi ».

**Observation** : 2 sur 8 ouvrent Email 2, aucun ne répond. 6 sur 8 ne l'ouvrent pas. → Problème de délivrabilité signalé. (Vérifier domaine DKIM ; Email 1 a probablement gone en spam.)

---

**Jour 3 : Branche A (Réponse positive)**

Parmi les 12 qui ont ouvert Email 1 :
- 1 prospect répond : « On évalue les solutions. Tu peux envoyer une démo ? »
- 1 prospect répond : « Merci mais on n'est pas sur le marché en ce moment ».

**Prospect A (positif)** : CHAUDE. Répondre dans les 2 heures.
- Message : « Génial — programmez 30 min la semaine prochaine. J'enverrai une Loom de ce que votre cas d'usage ressemble. Mardi 14h ou jeudi 10h ? » (CTA explicite, lien calendrier.)
- **Outcome** : Le prospect réserve réunion jeudi. Sortir de la séquence, passer à préparation de réunion.

**Prospect B (négatif)** : FROIDE. Passer à Branche C (objection).
- Tentative de reformulation dans les 24 heures : « C'est logique — la plupart des équipes évaluent quand elles frappent un point de rupture (habituellement quand les pipelines commencent à échouer en production). Si ça change, je t'enverrai un benchmark sur ce qui est typique pour des entreprises à votre scale ».
- Définir condition de réengagement : « Si tu embauches pour ça ou commences une évaluation, fais-moi signe ».
- **Outcome** : Le prospect ne répond pas. Passer à retraite 6 mois. Tagger : « Pas sur le marché ». Point de contrôle : 6 mois ou quand Série B annoncée.

---

**Jour 7 : Demande de Délégation (Branche B, continuée)**

Email 3 envoyé aux 6 restants (qui n'ont pas ouvert Email 2) :
- Objet : « Question rapide — qui supervise l'architecture de données chez [entreprise] ? »
- Corps : « J'ai peut-être la mauvaise personne. Si tu n'es pas la bonne adaptation, tu peux transférer à celui qui supervise l'architecture du pipeline de données ? »
- CTA : Aucun.

**Outcome** : 1 prospect répond, transférant au collègue (Lead d'Ingénierie de Données). Ajouter nouveau contact à la séquence, redémarrer au Jour 0.

---

**Jour 12 : Rupture**

Email 4 envoyé aux 5 non-répondeurs restants :
- Objet : « Pas de pression — je me retire »
- Corps : « Je vais finir ici. Ça n'a pas l'air du bon moment. Si tu frappes un point de rupture de plateforme de données ou as une migration qui vient, j'aimerais renouer. Bonne chance avec l'échelle d'équipe ».
- CTA : Aucun.

**Outcome** : Les 5 ont tous été déplacés au parc 60 jours. Définir point de contrôle de réengagement : Jour 72.

---

**Résumé après batch Jour 12** :

| Outcome | Nombre | Statut |
|---------|--------|--------|
| Réunion réservée | 1 | Actif (préparation réunion) |
| Passé à reformulation d'objection | 1 | Parc 6 mois |
| Transféré (nouveau contact) | 1 | Séquence redémarrée |
| Parqué 60 jours | 5 | Tâche définie pour Jour 72 |
| **Total engagé** | **8 / 20** | **40% engagement** |

---

**Semaine 4 : Réengagement (Point de contrôle Jour 72)**

Alex vérifie 5 prospects parqués pour nouveaux signaux :
- **Prospect C** : Round de financement annoncée (Série B, $40M). Nouveau signal détecté.
  - Email de réengagement : « On s'est parlé il y a quelques semaines sur votre échelle de données. J'ai remarqué la Série B — congratulations. C'est habituellement à ce moment que les décisions de plateforme de données s'accélèrent. Angle différent sur le problème : voici comment 3 entreprises à votre nouvelle scale ont géré leur data stack. On peut prendre 20 min ? »
  - CTA : Lien calendrier.
  
- **Prospects D, E** : Pas de nouveaux signaux. Continuer parc pour 30 jours supplémentaires.

**Outcome** : Le Prospect C ouvre email de réengagement, répond avec intérêt. Sortir de la séquence, passer à préparation de réunion. Les Prospects D, E restent parqués.

---

**Diagnostiques Appliqués (Examen Semaine 4)**

Alex a remarqué :
- **Taux d'ouverture Jour 0** : 60% (bon). **Taux d'ouverture Jour 3** : 25% (mauvais). → **Correction** : Problème de délivrabilité (DKIM du domaine n'était pas aligné). A ajouté un record DMARC.
- **Taux de réponse global** : 3 réponses sur 20 envois Email 1 Jour 0 = 15% (fort pour ingénierie données froide B2B).
- **Taux de réunion depuis réponses** : 2 réunions sur 3 réponses = 67% (élevé parce que les réponses CHAUDES ont été qualifiées rapidement, l'objection a été parquée tôt).

**Ajustements pour prochain batch** :
- Réaligner DKIM avant d'envoyer prochain 20 Email 1s.
- A/B tester les lignes d'objet (current « Dette d'ingénierie » fonctionne ; tester « L'équipe scaling a frappé un mur ? » sur prochain cohort).
- Garder demande de délégation (Jour 7) comme-c'est — c'est en générant des transferts.

---

Ce scénario montre comment les trois branches (A : sortie et nurture chaude/tiède ; B : cadence pas-réponse ; C : parc d'objection) opèrent simultanément sur 20 prospects sur 12 jours, avec des diagnostiques de métriques déclenchant les ajustements réels.
