# SDR Sequence Builder

## Quand exécuter

Ce workflow s'active lorsque vous lancez une nouvelle séquence sortante ciblant un segment de compte spécifique. Les déclencheurs incluent :
- Le cycle de planification trimestriel nécessite un nouvel axe de segment
- Le lancement d'un produit nécessite une motion sortante vers de nouveaux personas acheteurs
- La stratégie d'expansion verticale a besoin de séquences spécifiques à un segment
- L'analyse des victoires et des pertes identifie un signal répétable que vous voulez cibler

## Entrées requises

Avant de commencer, rassemblez :
1. **Définition de l'ICP** — taille de l'entreprise, industrie, fourchette de revenus, pile technologique
2. **Type de signal** — basé sur les déclencheurs (financement, changement de poste, adoption technologique) ou sortante statique (expansion au sein du segment existant)
3. **Tier de compte** — quel(s) tier(s) vous ciblez (Tier 1 = 10M+, Tier 2 = 1-10M, Tier 3 = <1M, ou votre propre échelle)
4. **Cible de séniorité** — niveau VP, C-suite, Director, Manager
5. **Liste de comptes ou source de données** — CSV, résultat de requête Salesforce, ou export Apollo/Hunter (N comptes, généralement 50-500)
6. **Choix de framework de messagerie** — sélectionnez parmi : Short Trigger, Do the Math, Founder's Story, Compliance + ROI, Community Proof, Feature Parity, DM Social, ou custom

## Étapes

### Étape 1 — Définir le segment cible (15 min)

**Action Claude :**
Demandez à Claude de raffiner votre définition de segment. Fournissez :
- Définition de l'ICP (ou esquisse sommaire)
- Type de signal (déclencheur ou statique)
- Tier(s) de compte
- Cible de séniorité

**Prompt Claude :**
"Aide-moi à définir le segment pour cette séquence. ICP : [X]. Signal : [Y]. Tier de compte : [Z]. Séniorité : [W]. Quels filtres firmographiques et technographiques dois-je utiliser pour affiner cette liste ? Dois-je exclure certains types d'entreprises, régions ou industries ?"

**Output Claude :**
- Critères de segment affinés (5-10 filtres spécifiques)
- Justification pour chaque filtre
- Taille estimée du marché adressable
- Signaler les préoccupations relatives à la qualité des données

**Point de décision :**
Est-ce que le segment semble actionnable (500-2000 comptes) ou trop restreint (<100) ou trop large (>5000) ?

---

### Étape 2 — Construire et scorer la liste de comptes (30 min)

**Votre action :**
Exportez votre liste de comptes depuis votre source de données. Assurez-vous qu'elle inclut :
- Nom de l'entreprise, domaine, taille de l'entreprise, financement, pile technologique (si disponible)
- Noms de contacts, titres, e-mails pour 2-4 décideurs par compte
- Tous les signaux récents (changement de poste, événement de financement, adoption technologique) avec dates

**Action Claude :**
Scorer et tier les comptes. Fournissez la liste à Claude.

**Prompt Claude :**
"Score ces [N] comptes par rapport à l'ICP. Tier-les 1/2/3 selon l'adéquation. Signale lesquels ont des signaux au cours des 14 derniers jours. Pour les 20 comptes Tier 1 les plus performants, liste le(s) signal(aux) et la date. Output sous forme de CSV : Account | Tier | Score | Signal | Signal Date."

**Output Claude :**
- Liste de comptes scorée (classée par tier et score d'adéquation)
- 20 comptes chauds (Tier 1 + signal récent)
- 20 comptes froids (Tier 1, pas de signal, mais bonne adéquation ICP)
- Signaux d'alerte (entreprises à déprioritiser ou éviter)

**Point de décision :**
Avez-vous au moins 15 comptes Tier 1 à cibler ? Si non, élargissez le segment ou abaissez le seuil de tier.

---

### Étape 3 — Sélectionner le framework de messagerie (10 min)

**Action Claude :**
Recommandez le meilleur framework de messagerie pour votre segment.

**Prompt Claude :**
"Donné ce segment : comptes Tier 1, [cible de séniorité], [type de signal], en [industrie/cas d'usage], lequel de ces 8 frameworks s'adapte le mieux et pourquoi ? Frameworks : (1) Short Trigger, (2) Do the Math, (3) Founder's Story, (4) Compliance + ROI, (5) Community Proof, (6) Feature Parity, (7) DM Social, (8) Custom. Justifiez votre choix avec 2-3 raisons."

**Output Claude :**
- Framework recommandé avec justification
- Hooks clés et points de douleur à emphasiser
- 3 exemples de lignes d'ouverture uniques à ce framework
- Framework alternatif si le principal ne résonne pas

**Point de décision :**
Est-ce que le framework s'aligne avec votre playbook de vente et la messagerie de votre équipe ? Si non, suggérez un framework différent.

---

### Étape 4 — Rédiger la séquence (45 min)

**Action Claude :**
Générez la séquence de 4 e-mails pour 3-5 comptes d'exemple.

**Prompt Claude :**
"Rédige la séquence de 4 e-mails pour ces 3 comptes d'exemple en utilisant le framework [Framework]. Détails : Titre cible [X], tier d'entreprise [Y], signal : [Z]. E-mail 1 : hook + référence de signal spécifique, moins de 100 mots. E-mail 2 : point de douleur + KPI pertinent, 120-150 mots. E-mail 3 : délégation/preuve sociale + soft ask, 100-140 mots. E-mail 4 : break-up + rappel de valeur, 80-100 mots. Incluez les lignes d'objet. Pour chaque e-mail, montrez 2 variations (Version A et B) pour que je puisse faire des tests A/B."

**Output Claude :**
Pour chacun des 3 comptes :
- E-mail 1 (2 versions) : Hook + Signal
- E-mail 2 (2 versions) : Pain + KPI
- E-mail 3 (2 versions) : Délégation + Ask
- E-mail 4 (2 versions) : Break-up
- Cadence d'envoi recommandée (jours entre chaque e-mail)

**Point de décision :**
Est-ce que tous les 4 e-mails semblent personnalisés et crédibles pour votre équipe ? Évitent-ils le pitch produit dans l'e-mail 1 ?

---

### Étape 5 — Contrôle QA (15 min)

**Action Claude :**
Révision QA par rapport à la checklist de qualité en 5 points.

**Prompt Claude :**
"QA ces 12 e-mails par rapport aux règles de messagerie. Pour chaque e-mail, vérifiez : (1) Sous la limite de mots (E-mail 1 : <100w, E-mail 2 : <150w, E-mail 3 : <140w, E-mail 4 : <100w) ? (2) Personnalisation spécifique (mentionne signal, entreprise, ou cas d'usage, pas générique) ? (3) L'e-mail 1 n'a pas de pitch produit ? (4) CTA clair (ask spécifique, pas 'parlons') ? (5) Pas de mots déclencheurs de spam ? Signale les violations. Suggère 1 correction par problème."

**Output Claude :**
- Pass/fail QA pour chaque e-mail
- Violations signalées avec corrections spécifiques
- E-mails révisés (si nécessaire)
- Approbation pour procéder au chargement CRM

**Point de décision :**
Tous les 4 e-mails sont-ils approuvés ? Si non, révisez et relancez QA.

---

### Étape 6 — Chargement CRM et configuration de séquence (20 min)

**Votre action :**
1. Taggez tous les contacts dans votre liste cible avec : `[Nom de séquence] - Active` et tags de tier de compte
2. Connectez-vous à votre outil de sensibilisation (Salesforce/Outreach/Instantly/etc.)
3. Créez la séquence avec des dates de début échelonnées
4. Configurez la cadence d'envoi :
   - E-mail 1 : Jour 0 (immédiat, 9 h fuseau horaire du destinataire)
   - E-mail 2 : Jour 2 (48 heures plus tard, 10 h)
   - E-mail 3 : Jour 5 (3 jours après l'e-mail 2, 14 h)
   - E-mail 4 : Jour 9 (4 jours après l'e-mail 3, 11 h)
5. N'envoyez jamais tous les contacts le même jour — échelonnez sur 5 jours
6. Configurez le suivi des réponses et l'arrêt automatique sur réponse positive

**Action Claude :**
Assistez à la logique de séquence si nécessaire.

**Prompt Claude :**
"Aide-moi à configurer cette séquence dans [nom d'outil]. Je veux échelonner 250 comptes sur 5 jours, 50 par jour. Dois-je randomiser au sein de chaque jour ou utiliser une heure fixe ? Quelle est la meilleure logique d'arrêt automatique : réponse reçue, réunion calendrier réservée, ou les deux ?"

**Output Claude :**
- Checklist de configuration
- Stratégie d'échelonnement recommandée
- Conditions d'arrêt automatique

**Point de décision :**
La séquence est-elle en direct et les contacts coulent-ils ? Vérifiez que 2-3 contacts ont reçu l'e-mail 1 avant de continuer.

---

### Étape 7 — Porte de révision des performances (après 7 jours)

**Action Claude :**
Analysez les métriques de 7 jours et recommandez les optimisations.

**Prompt Claude :**
"Voici les métriques pour cette séquence après 7 jours : Taux d'ouverture [X]%, Taux de réponse [Y]%, Taux de clic [Z]%, Taux de désabonnement [W]%. Comparaison : la moyenne de l'entreprise est [A]% d'ouverture, [B]% de réponse. Qualité du signal (Tier 1 vs Tier 2) : [breakdown]. Performance du framework : [framework] vs [alternative]. Que devrait-on changer et pourquoi ? Priorisez les 3 meilleures améliorations."

**Output Claude :**
- Comparaison de référence (vs votre baseline)
- Analyse des causes profondes (message, qualité de liste, timing, ou ciblage)
- 3 recommandations d'optimisation principales :
  1. Tweak de copie e-mail (ligne ou hook spécifique)
  2. Ajustement de timing ou de cadence
  3. Affinage de ciblage ou de liste
- Décision : Continuer tel quel, pause + révision, ou expansion à nouveau segment ?

**Point de décision :**
La performance justifie-t-elle la mise à l'échelle vers plus de comptes ? Si les métriques sont faibles, implémentez les tweaks recommandés par Claude et re-testez dans un micro-segment nouveau avant le déploiement large.

---

## Output

Une séquence sortante prête pour la production comprenant :
1. **Document de définition de segment** — filtres ICP, breakdown de tier, marché adressable
2. **Liste de comptes scorée** — 250-500 comptes classés par adéquation et récence de signal
3. **Séquence de 4 e-mails (8 variations)** — 2 versions A/B par e-mail, 4 cadences d'envoi, framework de messagerie clairement indiqué
4. **Rapport QA** — Tous les e-mails passent la checklist de qualité, pas de flags spam, personnalisation confirmée
5. **Configuration de séquence** — Live dans CRM/outil de sensibilisation, échelonnée sur 5 jours, règles d'arrêt automatique configurées
6. **Snapshot de performances 7 jours** — Métriques, benchmarks, et 3 recommandations d'optimisation principales

---

## Exemple

**Scénario :** Vous êtes Account Executive dans une entreprise B2B SaaS vendant l'infrastructure de données. Vous voulez cibler les entreprises mid-market (Tier 1 : 10-50M) en FinTech qui ont récemment adopté un outil de données concurrent.

### Étape 1 — Définir le segment
- **ICP :** FinTech, 10-50M ARR, fondée 2015+, co-fondateur technique toujours dans l'entreprise
- **Signal :** Installation de Databricks ou Snowflake au cours des 30 derniers jours (basé sur déclencheur)
- **Séniorité :** VP Engineering, VP Data
- **Output Claude :** "Ajouter filtre : Doit avoir 50+ headcount en engineering. Exclure les traders pure-play (ils ne possèdent pas l'infrastructure). Cibler 8 métros clés : NYC, SF, LA, Boston, Austin, Chicago, Londres, Singapour."

### Étape 2 — Construire et scorer
- **Entrées :** 300 entreprises FinTech depuis G2/Crunchbase + données d'installation Salesforce
- **Output Claude :** 
  - 45 comptes Tier 1 (ICP fort, 20-50M, >50 engineers)
  - 15 de ces 45 avec signal Snowflake/Databricks au cours des 14 derniers jours (chaud)
  - 30 sans signal mais avec adéquation ICP forte (froid)

### Étape 3 — Sélectionner le framework
- **Segment :** Tier 1, VP Engineering, basé sur déclencheur (installation Databricks récente)
- **Recommandation Claude :** "**Do the Math** — meilleure adéquation. Ces VPs évaluent les coûts d'infrastructure. Hook sur l'écart ROI entre Databricks + votre outil vs. stacks hérités. Ouvrez avec le déclencheur (nous voyons que vous avez installé Databricks) + valeur immédiate (30% de réduction des coûts de calcul)."

### Étape 4 — Rédiger la séquence
**Compte d'exemple :** Prism Analytics, NYC, VP Eng nommée Sarah Chen, installation Databricks il y a 8 jours.

**E-mail 1 (Hook + Signal) :**
> Objet : Une chose que manque l'installation de Databricks chez Prism
> 
> Sarah,
> 
> J'ai remarqué que votre équipe a déployé Databricks la semaine dernière. Bonne décision—les requêtes sont 10x plus rapides dès le départ.
> 
> Voici ce que nous voyons généralement ensuite : les coûts d'infrastructure gonflent quand le volume de requêtes augmente. Tu es curieuse si c'est sur ta roadmap à résoudre ?
> 
> Ça vaut un appel de 10 min ?
> 
> [Nom]

**E-mail 2 (Pain + KPI) :**
> Objet : Re: Une chose que manque l'installation de Databricks...
> 
> Sarah,
> 
> Les équipes de données utilisant Databricks frappent généralement un mur de coûts à ~3M requêtes quotidiennes. À cette échelle, les factures de calcul doublent souvent d'un trimestre à l'autre.
> 
> La plupart des équipes avec lesquelles nous parlons n'étaient pas préparées à cela. Peu ont une stratégie de gouvernance des coûts construite dès le départ.
> 
> C'est quelque chose que nous avons résolu pour les équipes comme Ramp et Stripe—les deux ont réduit leurs coûts Databricks de 35% au Q1 sans perdre de vitesse de requête.
> 
> Si l'optimisation des coûts est sur votre roadmap, je suis heureux de parcourir ce que cela ressemblait pour eux.
> 
> [Nom]

**E-mail 3 (Délégation + Ask) :**
> Objet : J'ai repéré votre VP Data sur LinkedIn—j'ai pensé que ça lui importerait
> 
> Sarah,
> 
> Vient de publier un 1-pager sur "Databricks Cost Patterns at Scale" basé sur 200+ déploiements. Votre VP Data pourrait le trouver utile pour la planification.
> 
> Je vais l'envoyer si c'est utile.
> 
> [Nom]

**E-mail 4 (Break-up) :**
> Objet : Dernière note—opportunité Databricks de Prism
> 
> Sarah,
> 
> Je vais prendre du recul, mais une dernière ressource : notre calculatrice ROI montre que des entreprises similaires à Prism économisent ~2,1M$ annuellement avec des contrôles de coûts intelligents.
> 
> Si cela change votre avis, je suis là.
> 
> [Nom]

### Étape 5 — Contrôle QA
- **E-mail 1 :** ✓ 47 mots, ✓ signal spécifique (déployé Databricks la semaine dernière), ✓ pas de pitch produit, ✓ CTA clair (appel de 10 min), ✓ pas de mots spam. **PASS**
- **E-mail 2 :** ✓ 91 mots, ✓ KPI spécifique (3M requêtes, économies de 35%), ✓ preuve sociale (Ramp, Stripe), ✓ ask clair, ✓ pas de spam. **PASS**
- **E-mail 3 :** ✓ 43 mots, ✓ délégation personnalisée, ✓ CTA clair, ✓ pas de spam. **PASS**
- **E-mail 4 :** ✓ 44 mots, ✓ référence de calculatrice est value-add pas pitch, ✓ clean break-up, ✓ porte ouverte. **PASS**

### Étape 6 — Chargement CRM
- Taggé 45 comptes FinTech Tier 1 : `Databricks-Sequence-2024Q2`, `Tier1`, `VP-Eng`
- Créé une séquence dans Outreach
- Cadence : E-mail 1 (Jour 0, 9 h PT), E-mail 2 (Jour 2, 10 h PT), E-mail 3 (Jour 5, 14 h PT), E-mail 4 (Jour 9, 11 h PT)
- Échelonné 45 contacts sur 5 jours : 9 par jour, randomisés au sein de chaque jour
- Arrêt automatique : Réponse reçue ou réunion calendrier réservée

### Étape 7 — Performance (snapshot 7 jours)
- **Métriques :** Taux d'ouverture de 34%, taux de réponse de 8,2%, désabonnement de 1,1%
- **Benchmark :** Moyenne de l'entreprise 28% d'ouverture, 6% de réponse
- **Tier 1 vs Tier 2 :** Comptes Tier 1 : 41% d'ouverture, 12% de réponse (signal = qualité)
- **Recommandation Claude :** "Vous dépassez les benchmarks. 12% de réponse sur Tier 1 chaud est excellent. Développez cela vers les 30 comptes Tier 1 froids (pas de signal récent) et testez A/B le hook—essayez 'Nous avons aidé [concurrent] à réduire les coûts Databricks' vs la version actuelle 'une chose manquante' sur les 50 prochains comptes."
- **Décision :** Mise à l'échelle vers la cohorte Tier 1 froide et test de variation de hook.

---

**Créé :** 2026-06-02
**Dernière mise à jour :** 2026-06-02
