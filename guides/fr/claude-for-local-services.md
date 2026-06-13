# Claude pour les services locaux

Claude pour les petits services locaux est conçu pour le propriétaire qui dirige un service commercial dans un territoire géographique — plombiers, électriciens, HVAC, paysagistes, nettoyeurs, peintres, cabinets dentaires, salons, studios de fitness, photographes, ateliers de réparation automobile, et la longue traîne des métiers spécialisés. Ce guide couvre comment Claude (l'IA d'Anthropic) gère la dispatch, le suivi, la gestion des avis et le travail administratif qui éloigne les propriétaires du camion ou du fauteuil.

Si votre business gère une route, remplit des rendez-vous, ou facture par job, ce guide est pour vous.

---

## Pourquoi les services locaux sont différents

Les businesses de services locaux partagent trois faits opérationnels qui changent comment Claude est utilisé :

1. **Le cash et la capacité sont visibles hebdomadairement, pas mensuellement.** Un plombier sait dès mercredi si la semaine atteindra les revenus. Un opérateur ecommerce le voit à la fin du mois. Les workflows doivent s'exécuter sur une cadence hebdomadaire.
2. **Les avis sont existentiels.** Un propriétaire de salon dont la note Google chute de 4.7 à 4.4 perd 20% des réservations de nouveaux clients. La réponse aux avis n'est pas une sympathie marketing — c'est des opérations essentielles.
3. **La plupart des propriétaires sont d'abord des opérateurs de terrain.** Le propriétaire est sur un site de travail, dans un fauteuil, derrière un comptoir. Ils ouvrent leur téléphone, pas un laptop. Les workflows doivent être exécutables en 5 minutes depuis un téléphone.

L'ensemble de skills petite-entreprise de Claudient est construit autour de ces trois faits.

---

## Le skill stack des services locaux

### Dispatch et planification

- [Contractor Trades](../skills/small-business/contractor-trades.md) — brouillons de devis, planification de jobs, comms clients pour plomberie, HVAC, électrique
- [Customer Inquiry](../skills/small-business/customer-inquiry.md) — brouillons de première réponse pour les demandes de réservation après heures
- [Meeting to Action](../skills/small-business/meeting-to-action.md) — transformez une consultation téléphonique en devis structuré et suivi

### Verticaux spécifiques

- [Restaurant Operations](../skills/small-business/restaurant-ops.md) — workflows complets et QSR-spécifiques
- [Real Estate Listing](../skills/small-business/real-estate-listing.md) — copie de listing, recherche comp, suivi acheteur
- [Salon and Spa Operations](../skills/small-business/salon-spa-ops.md) — récupération pas-show, séquences de rétention, descriptions de service
- [Dental Practice](../skills/small-business/dental-practice.md) — planification de rappel, vérification d'assurance, suivi du plan de traitement
- [Fitness Gym Operations](../skills/small-business/fitness-gym-ops.md) — taux de remplissage de classe, rétention, conversion trial-to-member
- [Photography Studio](../skills/small-business/photography-studio.md) — enquête-à-réservation, contrat, livraison de galerie
- [Bookkeeper Practice](../skills/small-business/bookkeeper-practice.md) — pour le comptable ou l'expert-comptable dirigeant sa propre firme

### Avis et réputation

- [Review Response](../skills/small-business/review-response.md) — brouillons de réponse Google et Yelp qui correspondent à votre voix
- [Customer Feedback Synthesizer](../skills/small-business/customer-feedback-synthesizer.md) — détection de pattern sur des centaines d'avis

### Finance et admin

- [Invoice Chaser](../skills/small-business/invoice-chaser.md) — suivi AR par bucket d'âge
- [QuickBooks Workflow](../skills/small-business/quickbooks-workflow.md) — fermeture du mois
- [Cash Flow Forecast](../skills/small-business/cash-flow-forecast.md) — particulièrement important pour les businesses de service avec timing de paiement inégal
- [Margin Analyzer](../skills/small-business/margin-analyzer.md) — quels types de jobs et quels techniciens produisent la meilleure marge
- [Payroll Planner](../skills/small-business/payroll-planner.md) — cash runway par rapport à la paie pour les businesses avec personnel W-2

### Embauche et équipe

- [Job Description](../skills/small-business/job-description.md) — descriptions de job précises pour techniciens, assistants et apprentis
- [Hiring Pipeline](../skills/small-business/hiring-pipeline.md) — criblage structuré pour une industrie haute-application, bas-show
- [SOP Writer](../skills/small-business/sop-writer.md) — codifiez ce que le fondateur fait en un manuel que l'équipe peut exécuter

---

## Comment un propriétaire de services locaux le configure

Le budget de temps de setup est 90 minutes total. Les propriétaires de services locaux n'ont pas un soir libre — installez sur trois pauses déjeuner si nécessaire.

### Déjeuner 1 — Fondation (30 minutes)

1. **Claude Pro à $20/mois** pour les propriétaires-opérateurs solo. **Claude Team à $30/siège** si vous avez un dispatcher, un responsable de bureau, ou une assistante.
2. **Ouvrez Claude Cowork** depuis votre tableau de bord Claude.
3. **Écrivez le contexte business.** Pour un business de service, incluez : métier ou spécialité, aire de service (ville/région), mix de services et ticket moyen, taille et structure d'équipe, voix de marque (chaud-et-fiable vs straight-shooter), et vos trois plus grands concurrents.

### Déjeuner 2 — Connecter (30 minutes)

1. **Connectez QuickBooks Online.** Déverrouille les workflows de finance.
2. **Connectez votre CRM ou logiciel de service** s'il a une intégration MCP/API. ServiceTitan, Housecall Pro, Jobber, Mindbody, Acuity, et Square Appointments ont tous des niveaux variés de compatibilité. Si le vôtre ne l'a pas encore, les workflows s'exécutent toujours sur données copier-coller.
3. **Connectez Google Workspace.** Nécessaire pour les lectures de calendrier et la rédaction d'email.

### Déjeuner 3 — Premier workflow (30 minutes)

1. **Exécutez Review Response sur les 10 derniers avis sur votre Google Business Profile.** Lisez les brouillons de Claude, publiez ceux qui sonnent comme vous. C'est le workflow le plus immédiatement satisfaisant pour tout propriétaire de services locaux — il efface un arriéré assis depuis des semaines.
2. **Configurez le Monday Brief hebdomadaire.** Même pour les businesses de service où chaque jour ressemble au même, savoir les revenus de la semaine précédente, l'âge AR et la pipeline avant 9am le lundi change comment vous gérez le lundi.

---

## Services locaux 30/60/90

### Jours 1-30 : Avis et AR

Deux workflows s'exécutent hebdomadairement : Review Response sur les nouveaux avis, Invoice Chaser sur les factures en retard. Ensemble, ils récupèrent 60% des heures d'opérateur généralement perdues à "l'admin". Les propriétaires rapportent que seul le suivi AR récupère $2-5K d'argent précédemment coincé dans les 30 premiers jours.

### Jours 31-60 : Dispatch et client

Customer Inquiry gère les demandes de réservation après heures, qui est la plus grande source unique de business perdu pour la plupart des opérateurs de services locaux (le lead qui a appelé à 19h mardi et est allé avec la prochaine compagnie qui l'a rappelé mercredi matin). Le skill vertical-spécifique (Contractor Trades pour les métiers, Salon-Spa pour les services personnels, Dental pour la santé) couche le travail spécifique à votre industrie.

Temps sauvegardé : 8-12 heures par semaine.

### Jours 61-90 : Embauche et mise à l'échelle

Job Description et Hiring Pipeline activent quand vous décidez d'embaucher. SOP Writer capture le processus du fondateur par écrit — l'étape gâchette pour remettre le travail réel à une nouvelle embauche. Margin Analyzer révèle quels services sont réellement profitables (et lesquels sont des perte-leaders déguisés en revenu).

Temps sauvegardé : 10-15 heures par semaine, et le business devient opérable sans le propriétaire sur chaque appel.

---

## Patterns de succès spécifiques aux services locaux

**Review Response s'exécute tous les lundi matin, sans exception.** La chute de 4.7 à 4.4 arrive silencieusement. La réponse hebdomadaire maintient votre réactivité visible aux futurs chercheurs — Google considère la cadence de réponse comme un signal de classement pour les résultats de paquet local.

**Exécutez Customer Feedback Synthesizer trimestriellement.** Le pattern qui émerge de 200 avis est rarement ce que les avis individuels disent. Les surfaces communes : les techs sont super mais le bureau est lent à rappeler ; le prix est bon mais le devis initial ne correspond pas à la facture finale ; le nettoyage après le job est inconsistant. Ceux-ci sont corrigeables. Les avis individuels ne les rendent pas assez forts pour corriger.

**Invoice Chaser sauve le plus d'argent dans les métiers et la contracting.** Les métiers spécialisés ont le vieillissement AR le plus élevé de toute catégorie petite-entreprise — 30 jours moyenne est courant, 60+ jours n'est pas rare. Le suivi hebdomadaire récupère un bout significatif du capital de travail et change quels jobs le business peut accepter le mois prochain.

**Cash Flow Forecast prévient le mauvais mois.** Pour les businesses de service avec paie, savoir deux semaines à l'avance que le cash va être serré est la différence entre reprogrammer des vacances et manquer la paie. Exécutez-le hebdomadairement.

**Ne laissez pas Claude écrire des devis que vous n'avez pas révisés.** Le skill Contractor Trades ébauche les devis à partir de vos notes de scope. Ils semblent corrects. Mais les nuances de prix — le client qui demande toujours une remise, le surcharge de matériaux qui vient de frapper, le tarif syndical vs non-syndical — vivent dans votre tête. Claude ébauche, vous signez.

---

## Ce que Claude N'est PAS pour les services locaux

**Décisions de dispatch.** L'optimisation de routage (quel tech va à quel job) appartient à ServiceTitan, Housecall Pro, Jobber, ou votre logiciel dispatch. Claude lit le résultat, pas le planificateur de route.

**Stratégie de prix sans vos inputs.** Pricing Optimizer est un framework structuré pour tester les prix que vous envisagez. Il ne vous dit pas ce à charger basé sur votre marché local — c'est votre lecture.

**Interprétation d'assurance et de garantie.** Les workflows touchent vérification d'assurance et suivi de garantie mais ne remplacent pas votre jugement sur les décisions de couverture. Surtout en dentaire, auto et HVAC — la fine print de garantie compte.

**Remplacer les parties basées-sur-les-relations du business.** Les services locaux s'exécutent sur la confiance. Un client HVAC première fois devient un client de 20 ans parce que comment vous avez géré leur première urgence à 23h. Cet appel est le vôtre.

---

## FAQ

### Claude est-il bon pour les businesses de services locaux ?

Oui. La combinaison des workflows de cadence hebdomadaire (Invoice Chaser, Cash Flow, Review Response) et des skills vertical-spécifiques (Contractor Trades, Salon-Spa, Dental, Fitness) couvre le travail opérationnel qui consomme la plupart de la semaine d'un propriétaire de services locaux.

### Claude fonctionne-t-il avec ServiceTitan, Housecall Pro, ou Jobber ?

La profondeur d'intégration varie par platform. Les intégrations Claude for Small Business natives couvrent QuickBooks, HubSpot, PayPal, Google Workspace, et une liste croissante de platforms verticaux. Les intégrations spécifiques au logiciel-de-service s'améliorent via les serveurs MCP — vérifiez le [répertoire MCP](../mcp/) pour la liste actuelle. Les workflows s'exécutent toujours sur données copier-coller quand une intégration directe n'est pas disponible.

### Comment Claude aide-t-il avec les avis Google ?

Review Response ébauche les réponses aux avis Google Business Profile dans votre voix de marque. Vous approuvez et publiez. Le skill flag également les avis contenant des plaintes opérationnelles dignes d'être approfondies (tech spécifique nommé, problème récurrent, plainte d'emplacement/planification).

### Claude peut-il m'aider à embaucher techniciens, stylistes, ou assistants ?

Job Description écrit le post. Hiring Pipeline structure les appels de criblage et évalue les candidats contre vos critères. Les skills ne mènent pas les entrevues, ne conduisent pas les tests de métier, ou ne vérifient pas les références — ce sont les parties d'embauche qui doivent rester humaines.

### Combien coûte Claude pour un business de services locaux ?

$20/mois pour les propriétaires-opérateurs solo sur Claude Pro. $30/siège/mois pour Claude Team si vous avez un responsable de bureau, un dispatcher, ou un partenaire commercial utilisant les workflows. Plus vos abonnements existants QuickBooks, CRM et Google Workspace.

### Claude fonctionne-t-il pour les métiers comme plomberie, HVAC, électrique ?

Oui. Contractor Trades est le skill dédié pour les opérateurs de métiers. Il couvre les devis, les comms de planification, le suivi, et les séquences de remerciements post-job. Combiné avec Invoice Chaser et Cash Flow Forecast, il gère l'épine dorsale opérationnelle d'un business de métiers.

### Claude peut-il gérer vérification d'assurance ou réclamations ?

Claude ébauche les demandes de vérification d'assurance et lit les réponses pour la complétude, mais la lecture finale sur la couverture est la vôtre. Pour dentaire, le skill Dental Practice inclut un sous-flux de vérification d'assurance structuré. Pour métiers et auto, le travail d'assurance est plus variable et Claude assiste plutôt que possède.

### Claude est-il mieux que ChatGPT pour les services locaux ?

Pour l'automatisation des workflows liée à vos données de business réel, oui — significativement. ChatGPT écrit un rappel de facture générique. Claude lit votre rapport de vieillissement AR de QuickBooks et ébauche des rappels personnalisés par facture. Pour les questions ponctuelles et le brainstorming, les deux fonctionnent bien.

### Et si je ne suis pas technique du tout ?

Les workflows Claude for Small Business sont point-et-clic. Les skills Claudient dans ce repo sont activés en tapant des instructions en anglais simple à Claude. L'étape technique la plus difficile est de connecter QuickBooks via OAuth, ce qui est un processus 3-clic.

---

## Guides connexes

- [Claude for Small Business — Product Guide](claude-for-small-business.md)
- [Claude for Solopreneurs](claude-for-solopreneurs.md) — si vous dirigez le business seul
- [Claude for Ecommerce](claude-for-ecommerce.md) — si vous vendez aussi en ligne
- [Claude for Coaches and Consultants](claude-for-coaches-consultants.md)
- [SEO Strategy for Small Business Content](claude-small-business-seo-strategy.md)

---
