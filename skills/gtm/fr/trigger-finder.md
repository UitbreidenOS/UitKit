# Trigger Finder

## Quand activer
Flux de prospection quotidien lors de la création de séquences déclenchées par des événements, de la priorisation des personnes à contacter dans les 24 prochaines heures, ou de l'opérationnalisation des signaux d'intention d'achat en une cadence de prospection reproductible.

## Quand ne pas utiliser
Prospection froide sans déclencheur — utilisez la compétence Personalisation à la place pour une prospection ICP statique. N'utilisez pas Trigger Finder pour les prospects chauds entrants (ils ont déjà l'intention) ou les ventes basées sur les comptes où les relations sont préétablies.

## Instructions

### Les 4 catégories de déclencheurs

**1. Événements d'entreprise** — changements organisationnels directs qui créent un budget et une urgence
- Tours de financement (Série A/B/C, seed) — afflux de capital déclenche l'embauche, l'expansion des outils, la refonte de l'infrastructure
- Vague d'embauche (3+ postes affichés en 90 jours) — nouvelle équipe = nouveaux budgets d'outils, lacunes en compétences, goulots d'étranglement processus
- Activité M&A (acquisition ou en cours d'acquisition) — défis d'intégration, consolidation de systèmes, remplacement de plateforme héritée
- Changement de leadership (nouveau CTO, VP Engineering, CMO) — les nouveaux cadres apportent des relations fournisseurs fraîches et un mandat d'amélioration sous leur direction

**2. Signaux comportementaux** — activités révélatrices d'intention qui indiquent une évaluation active
- Téléchargements de contenu (livres blancs, guides, calculatrices ROI) — phase d'auto-éducation, comparaison d'options
- Participation à des webinaires/démos (événements de vos concurrents, conférences industrielles) — mode d'achat, collecte de benchmarks
- Activité sur les sites d'évaluation (G2, Capterra, Trustpilot — visites de site, vues de comparaison, demandes de démo) — évaluation en phase tardive
- Offres d'emploi mentionnant des lacunes de compétences ou de nouvelles initiatives — embauche pour des capacités qu'ils n'ont pas en interne

**3. Changements de stack technologique** — adoption de plateforme et churn qui révèlent les changements de dépenses et de priorités
- Nouvelles installations d'outils (via BuiltWith, offres d'emploi LinkedIn qui mentionnent « expérience avec X ») — expansion active de la stack, budget alloué
- Annonces de suppression/discontinuation d'outils concurrents — recherche active de remplacement en cours
- Adoption de concurrents par leurs pairs (visibilité de l'étude de cas, érosion de la preuve sociale) — FOMO, peur de rester en arrière
- Consolidation de stack ou initiatives de modernisation (glané à partir d'offres d'emploi, de contenu LinkedIn, de blogs techniques) — rationalisation de plateforme = fenêtre RFP

**4. Événements externes** — déclencheurs macro qui décalent l'urgence d'achat à grande échelle
- Changement réglementaire (RGPD, SOC2, lois de résidence des données, conformité IA) — dépenses de conformité forcées
- Défaillance de concurrents ou contraction du marché — perte de confiance, comportement de recherche d'alternative
- Changement de marché ou perturbation industrielle (IA, API-first, adoption sans serveur) — création de catégorie, adoption de nouvelle catégorie

### Sources de signaux : la stack

**Sources gratuites ou à faible coût :**
1. **LinkedIn** (gratuit) — offres d'emploi, mises à jour d'entreprise, changements de leadership, publications de fondateurs sur le financement
2. **G2/Capterra** (gratuit) — activité d'examen des concurrents, nombres de téléchargements, pics de demandes de démo
3. **Crunchbase** (niveau gratuit, alertes par e-mail) — annonces de financement, données d'embauche, actualités d'entreprise
4. **BuiltWith** (gratuit/payant) — identifier qui utilise une technologie spécifique, configurer le suivi des concurrents ou des profils ICP
5. **Google Alerts** (gratuit) — configurer des alertes pour les entreprises, les concurrents, les mots-clés réglementaires, les termes de l'industrie
6. **Agrégateurs d'offres d'emploi** (gratuit : LinkedIn, Indeed, Ashby) — proxy pour la vélocité d'embauche, les points douloureux, la direction du budget
7. **Page carrières de l'entreprise** (gratuit) — vagues d'embauche actives, formation de nouvelles équipes
8. **Modèles Zapier/Make** (payant, 10–50 $/mois) — automatiser la collecte quotidienne de signaux dans votre CRM

**Sources premium** (facultatif pour les opérations à grande échelle) :
- Apollo.io, Hunter.io ou ZoomInfo — alertes de déclencheurs, surcouches de données d'intention
- 6sense, Demandbase, Terminus — signaux d'intention au niveau du compte

### Cadre de notation des déclencheurs

Attribuez à chaque signal un score qui détermine la rapidité de réaction :

**Élevé (agir dans les 24 heures)**
- Annonce de financement active (dans les 7 jours)
- Offre d'emploi mentionnant explicitement la catégorie de votre produit ou l'écart concurrentiel
- Examen concurrent G2 (demande de démo, déplacement d'avis, activité de suivi)
- Changement de leadership dans le rôle cible (CTO, VP Eng, CMO)
- Actualités de l'entreprise concernant le pivot produit, l'expansion ou les M&A (acquis ou acquisition)

**Moyen (agir dans 1 semaine)**
- Téléchargement de contenu à partir de votre site ou du site d'un concurrent
- Participation à un webinaire (vos propres événements ou événements de concurrents)
- Embauche de 2+ rôles suggérant des lacunes de capacités
- Changement de stack technologique indiquant une initiative de modernisation
- Annonce réglementaire affectant leur industrie

**Faible (réserver pour une séquence future)**
- Offre d'emploi générale (pas de point douloureux spécifique au rôle)
- Mention de rapport trimestriel d'initiative stratégique
- Adoption par les pairs (intéressant mais pas d'intention directe)
- Tendance industrielle (macro, pas spécifique à l'entreprise)
Notez les signaux faibles et ajoutez à une séquence de maintien du contact ; révisez si un déclencheur de score plus élevé apparaît.

### La formule du message de déclencheur

Votre message d'ouverture doit contenir exactement trois éléments dans cet ordre :

1. **[Nommez le déclencheur spécifique]** — Soyez explicite sur ce que vous avez observé
   - ✓ « J'ai vu votre annonce de Série B mardi dernier »
   - ✗ « J'ai remarqué que vous grandissiez »

2. **[Pourquoi c'est important pour eux spécifiquement]** — Connectez le déclencheur à un impact commercial concret
   - ✓ « La Série B signifie généralement 2–3 nouveaux objectifs d'embauche, et c'est là que la friction d'intégration tue la vélocité »
   - ✗ « Les entreprises de Série B ont besoin de passer à l'échelle »

3. **[Une question]** — Ouverte, pas un oui/non, qui les invite à partager leur défi spécifique
   - ✓ « Quel est le plus gros problème d'intégration de vos nouvelles recrues en ce moment ? »
   - ✗ « Êtes-vous intéressé par une meilleure intégration ? »

**Exemple de formule en action :**
> « Bonjour [Nom], j'ai vu que [Entreprise] venait de clôturer votre Série B — félicitations. La plupart des équipes dans votre position ont du mal à intégrer rapidement les nouveaux ingénieurs, ce qui retarde le TTM. Quel a été le goulot d'étranglement pour vous ? »

### Création de votre stack de surveillance des déclencheurs

**Flux quotidien :**
1. Chaque matin, exécutez des requêtes sur vos sources (ou configurez les automations Zapier/Make pour qu'elles s'exécutent pendant la nuit)
2. Collectez les signaux dans un seul document d'entrée ou une vue CRM
3. Notez chaque signal (élevé/moyen/faible)
4. Acheminez les signaux à score élevé vers votre liste de prospection quotidienne
5. Ajoutez les signaux moyens et faibles à votre CRM avec une date de suivi de 7–14 jours

**Modèle d'automatisation (Zapier/Make) :**
- Déclencheur : « Nouvelle offre d'emploi correspondant aux mots-clés [votre ICP] » OU « Annonce de financement pour [liste d'entreprises] » OU « Avis G2 publié sur [concurrent] »
- Action : Créer une nouvelle ligne dans votre CRM (Salesforce, HubSpot, Pipedrive) avec le type de signal, le score, la date et le lien
- Fréquence : Quotidiennement à 8 h votre heure
- Coût : ~20–50 $/mois pour 3–5 automations de déclencheurs

**Configuration Zapier exemple :**
1. Déclencheur d'offre d'emploi LinkedIn → Filtre pour les mots-clés (« embauche », « ingénieur », « full-stack ») + ICP d'entreprise
2. Déclencheur de financement Crunchbase → Ajouter le filtre « Série A, B, C »
3. Action : Créer/mettre à jour l'affaire dans HubSpot avec le pipeline « Trigger Queue », définir la balise de score
4. Notification : Résumé Slack quotidien des signaux à score élevé pour votre équipe

### La fenêtre de décroissance de 14 jours

**Règle critique : la plupart des déclencheurs perdent leur pertinence après 14 jours.**

- Une annonce de financement au jour 1 est fraîche et urgente (le budget est alloué)
- Au jour 14, les cycles d'approvisionnement se sont resserrés ; au jour 30, la fenêtre s'est fermée
- Les offres d'emploi atteignent leur pic de pertinence pendant les semaines 2–3 (recrutement actif, postes non pourvus = douleur)
- Les changements de leadership ont la plus haute intention les jours 1–7 ; après 30 jours, ils se sont installés dans leur rôle
- Les annonces réglementaires ont une fenêtre plus longue (60–90 jours) mais se cumulent avec d'autres signaux

**Implications :**
- Ne vous asseyez pas sur les déclencheurs à score élevé. Prospectez au jour 1 ou 2
- Les déclencheurs de score moyen peuvent attendre 3–5 jours mais pas plus longtemps
- Après 14 jours, déplacez un signal vers « maintien du contact » (cadence inférieure, ajoutez à la séquence e-mail)
- Suivez les taux de réponse par âge du déclencheur ; vous verrez une baisse nette après le jour 10–14

### Opérationnalisation : du signal à la séquence

1. **Identifier** — Exécutez vos sources quotidiennes, capturez le signal
2. **Noter** — Cadre élevé/moyen/faible ci-dessus
3. **Message** — Utilisez la formule de déclencheur ; personnalisez en 2 minutes
4. **Temps** — Élevé = aujourd'hui, Moyen = cette semaine, Faible = maintien du contact
5. **Suivi** — Enregistrez le type de déclencheur, la date, le score et la réponse dans le CRM pour la notation prédictive
6. **Décroissance** — Archivez ou maintenez le contact après 14 jours si pas de réponse

### Modèles de messages de déclencheur par catégorie

**Événements d'entreprise :**
> « J'ai vu [Entreprise] embaucher [Nom] en tant que [Titre] le mois dernier. Les leaders dans ce rôle remodèlent généralement la stack [fonction]. Quel a été le mandat de votre leadership concernant [thème] ? »

**Signaux comportementaux :**
> « J'ai remarqué que vous aviez téléchargé notre guide « [Ressource] » la semaine dernière. Les équipes qui l'utilisent le plus s'attaquent à [douleur spécifique]. Où êtes-vous le plus bloqué en ce moment ? »

**Changements de stack technologique :**
> « J'ai vu [Entreprise] ajouter [Outil] à votre stack récemment. Beaucoup d'équipes le font quand [raison commerciale]. Êtes-vous en train de reconstruire [système] ce cycle ? »

**Événements externes :**
> « Avec [régulation] qui entre en vigueur dans [délai], les équipes comme la vôtre examinent les solutions [catégorie]. Quelle est votre priorité — conformité ou performance ? »

## Exemple

**Scénario :** Vous vendez l'automatisation de l'intégration des développeurs aux équipes d'ingénierie des startups de Série A/B.

**Collecte de signaux d'aujourd'hui :**

| Entreprise | Déclencheur | Score | Source | Message d'aujourd'hui | Réponse |
|---------|---------|-------|--------|-----------------|----------|
| TechCorp Labs | Série B, tour de 25M $ (annoncé il y a 2 jours) | Élevé | Crunchbase | « Félicitations pour la clôture de la Série B. La plupart des équipes à ce stade embauchent 5–8 nouveaux ingénieurs au cours du prochain trimestre, ce qui casse l'intégration. Quel est votre TTM actuel pour une nouvelle embauche ? » | Lecture (2h plus tard) : « Ha, on est à 6 semaines. D'accord, c'est nul. » |
| Aurora Systems | VP Engineering embauché (publication LinkedIn, il y a 3 jours) | Élevé | LinkedIn | « J'ai vu que vous aviez embauché [Nom] en tant que VP Eng — une bonne embauche. Les nouveaux leaders veulent généralement réduire de moitié le TTM. Envisagez-vous des outils d'intégration ce cycle ? » | Lecture (jour suivant) : « En fait oui, nous évaluons maintenant. » |
| Vertex AI | 4 offres d'emploi pour « Senior Backend Engineer » publiées en 7 jours | Moyen | Recherche d'emploi LinkedIn + Crunchbase | « Je vois que vous embauchéz agressivement pour le backend. Lorsque vous mettez à l'échelle l'équipe d'ingénierie aussi rapidement, les goulots d'intégration se composent. Question rapide — comment mettez-vous à l'échelle les processus d'intégration pour suivre ? » | Pas encore de réponse (réserver pour suivi de 5 jours) |
| Momentum Inc | Téléchargé votre guide « Onboarding Metrics » (e-mail suivi) | Moyen | Suivi des e-mails | « Merci d'avoir téléchargé le guide métriques. La plupart des équipes découvrent que leur TTM est à 40 % du mieux de la pratique industrielle. Quel est votre ligne de base en ce moment ? » | Lecture (même jour) : « Environ 6 semaines, cherchant à réduire à 3 » |
| Scale Ventures | Série A clôturée il y a 8 semaines ; pas de signal récent | Faible | Historique CRM | [Pas de prospection aujourd'hui ; ajouter à la séquence d'e-mail de maintien du contact] | — |

**Résultat du travail d'une matinée :** 2 conversations à score élevé ouvertes le même jour, 1 moyen déplacé au suivi, 1 inbound chaleureux généré à partir du toucher e-mail.

**Observation clé :** L'embauche du VP Engineering et l'annonce de la Série B ont déplacé l'aiguille le plus rapidement car ils signalent un décideur frais + un budget frais. Le téléchargement du guide d'intégration était une vélocité inférieure mais indiquait une évaluation active. Les offres d'emploi sont des indicateurs décalés (la douleur existait déjà ; maintenant ils embauchent pour la corriger).

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
