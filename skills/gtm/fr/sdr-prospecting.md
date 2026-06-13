# Prospection SDR

## Quand l'activer
- Construire une nouvelle liste de comptes à partir de zéro (campagnes de prospection trimestrielles, pénétration de marché)
- Recherche pré-appel avant un appel de découverte programmé
- Planifier un sprint de prospection (activation cadencée hebdomadaire, remplissage du pipeline)
- Augmenter la prospection sortante à travers plusieurs personas acheteurs
- Actualiser des listes de comptes obsolètes pour exposer de nouveaux signaux

## Quand NE PAS l'utiliser
- Conclure des accords — c'est seulement de la recherche de compte et du séquençage en haut de l'entonnoir
- Gérer les prospects entrants — la qualification des prospects entrants suit une logique différente
- Workflows de réussite client — la gestion des comptes post-vente est distincte
- Sourcer des candidats — ce n'est pas du recrutement
- Prospection opportuniste ponctuelle — utilisez-la uniquement pour les campagnes systématiques

## Instructions

### Phase 1 : Définition de l'ICP et filtrage firmographique

Commencez en amont. Votre liste n'est aussi bonne que votre ICP.

**Couche Firmographique (Non-Négociable) :**
- **Verticale industrielle :** Mapper aux codes NAICS/SIC. Si vous vendez à « des équipes logicielles PME », c'est trop large. Soyez précis : « Entreprises SaaS de Série A/B dans MarTech, PipeTech ou Sales Automation. »
- **Plage d'effectifs :** Définir précisément. Exemple : 20–150 employés (ajustement du marché produit précoce, toujours bricolé en opérations). Utilisez les bandes d'effectifs de LinkedIn comme filtre principal.
- **Plage ARR :** Si vous vendez en amont, appliquez un plancher (ARR minimum $1M). Si en aval, appliquez un plafond ($10M ARR). Mélanger casse votre modèle.
- **Stack technologique :** Lister vos outils phares (Salesforce + Marketo + Workato) ou listes à éviter (entreprises sur solution en titre = intention inférieure). Utilisez les filtres Apollo, Clay ou BuiltWith ici.
- **Géographie :** Par défaut, marchés anglophones (États-Unis, Royaume-Uni, Canada, Australie) sauf si votre GTM est mondial. Affinez par fuseau horaire pour correspondre à vos opérations commerciales.

**Production de la Phase 1 :** Une liste de prospects de semences, pas encore notée, typiquement 500–5k comptes selon la taille du marché.

### Phase 2 : Notation d'ajustement — Indicateurs de croissance et proxys de douleur

Pas tous les ICP sont également prêts à acheter. Superposez les signaux qui prédisent la disponibilité d'achat.

**Indicateurs de croissance (Intention d'expansion) :**
- Tour de financement annoncé (<6 mois) — signaux forts d'embauche + dépenses
- Croissance d'effectifs >20% YoY — friction opérationnelle augmente
- Lancements de produits ou versions majeures — nouveau mouvement GTM = disponibilité budgétaire
- Expansion vers nouvelles géographies/verticales — investissement infrastructure en cours
- Offres d'emploi dans les rôles clés (Sales Ops, Marketing Ops, Revenue Ops) — zone de douleur explicite

**Proxys de douleur (Signaux de friction) :**
- Fragmentation de la stack technologique — 8+ solutions ponctuelles dans une catégorie qu'ils pourraient consolider dans votre plateforme
- Outil récemment perdu ou consolidation de vendeurs — budget déjà alloué, maintenant disponible
- Changements exécutifs dans l'org de l'acheteur — les nouveaux leaders mandatent souvent un renouvellement des outils
- Changements réglementaires affectant leur industrie — les dépenses de conformité = fenêtre budgétaire ouverte
- Victoires concurrentes dans leur espace — ils évaluent comment répondre

**Formule de notation (Simple) :**
- Signaux de croissance : +1 point chacun (max +5)
- Proxys de douleur : +1 point chacun (max +5)
- Prospects Tier 1 : 7–10 points (profondeur de recherche : 20 min)
- Prospects Tier 2 : 5–6 points (profondeur de recherche : 10 min)
- Prospects Tier 3 : 1–4 points (profondeur de recherche : 5 min + 1 point de personnalisation)

**Production de la Phase 2 :** Une liste classée avec notes. Maintenant vous savez où investir le temps de recherche.

### Phase 3 : La règle du 3-Contact — Multi-Threading au niveau du compte

Ne jamais séquencer un seul contact. Les impasses tuent l'élan. Construisez toujours 3+ fils de contact par compte.

**Archétypes de contact à cibler :**
1. **Acheteur économique** (détient le budget, prend la décision oui/non)
   - Signaux de titre : CFO, VP Finance, VP Ops, VP Sales, Chief Revenue Officer, VP/Director of [fonction acheteur]
   - Persona varie selon le produit. Si vous vendez des outils opérationnels : VP Ops ou Chief Operations Officer. Si activation des ventes : CRO ou VP Sales.
   - Angle de recherche : embauches récentes = aucunes relations avec le vendeur incumbent, table rase

2. **Champion** (évangélisera en interne, exécute la preuve de concept, a crédibilité entre pairs)
   - Signaux de titre : Senior Manager, Director (sous C-suite), Ops Lead, Program Manager
   - Dirige souvent le processus au quotidien, expérimente directement la douleur
   - Angle de recherche : promotions, changements d'emploi d'autres entreprises de votre espace (ils comprennent déjà votre pitch)

3. **Influenceur** (gardien technique, façonne les critères de sélection)
   - Signaux de titre : Principal [fonction], Head of, Manager, Senior Specialist
   - Les décisions de stack technologique passent souvent par eux
   - Angle de recherche : parle lors d'événements de l'industrie, publie sur les sujets de douleur pertinents pour votre solution

**Trouver ces contacts :**
- LinkedIn Sales Navigator : Company > Role filter + bouton « Messaging ». Remarque : limiter aux connexions de 1er degré pour des taux de réponse plus élevés dans la première séquence.
- Hunter.io ou RocketReach : Export en masse depuis votre liste de comptes cibles, puis vérifier manuellement les emails (les faux positifs sont coûteux dans vos limites d'envoi).
- Clay : Configurer un flux de travail : Clearbit (recherche d'entreprise) → Hunter (email) → LinkedIn (enrichir détails contact) → examen manuel pour pertinence rôle.
- Site web de l'entreprise : Vérifier /team, /leadership, page d'entreprise LinkedIn, actualités/communiqués pour annonces d'offres d'emploi.

**Logique de séquençage :**
- Contact 1 (Acheteur économique) : Prospection jour 1, suivi jour 2, suivi jour 5
- Contact 2 (Champion) : Jour 0 ou 1 (légèrement décalé), même cadence de suivi
- Contact 3 (Influenceur) : Jour 2, échelonné, ton de priorité inférieure (information/opinion, pas une demande)
- Mélanger (ne pas envoyer 3 emails identiques le jour 1 au même compte—paraît robotique ; décaler de 1–2 jours pour casser le motif)

### Phase 4 : Niveaux de profondeur de recherche — Allouer le temps, pas l'effort de manière égale

Votre temps est fini. Organisez votre recherche pour correspondre à l'ajustement du compte.

**Comptes Tier 1 (Score d'ajustement Tier 1 : 7–10)** — 20 minutes de profondeur de recherche
- Recherche d'entreprise complète : site web, actualités récentes, financement/valorisation, bios cadres
- Recherche spécifique acheteur : historique du profil LinkedIn, contenu publié, mentions sur blog d'entreprise ou podcasts
- Mappage de douleur : Identifier 2–3 problèmes spécifiques qu'ils risquent de rencontrer selon l'étape + verticale
- Document de recherche : Prospectus de prospection avec 3 points personnalisés par contact (corrélation douleur, événement récent, connexion commune)
- Séquençage : Email personnalisé par contact (pas de modèle), 3+ fils de contact en parallèle

**Comptes Tier 2 (Score d'ajustement Tier 2 : 5–6)** — 10 minutes de profondeur de recherche
- Aperçu d'entreprise : Industrie, taille, financement, titres clés d'acheteurs
- Acheteur-spécifique : Balayage rapide LinkedIn (mouvements récents, ancienneté, un point de données que vous pouvez référencer)
- Mappage de douleur : Douleur générique pour leur verticale (sauter la plongée profonde spécifique au compte)
- Document de recherche : Prospectus de prospection léger, 1 point personnalisé + 2 points de modèle par contact
- Séquençage : Email de modèle + légère personnalisation (première ligne, nom d'entreprise, 1 détail), toujours 3+ contacts

**Comptes Tier 3 (Score d'ajustement Tier 3 : 1–4)** — 5 minutes de profondeur de recherche
- Aperçu d'entreprise : Taille, verticale seulement (sauter recherche profonde)
- Acheteur-spécifique : Titre + titre LinkedIn seulement (pas de lecture profonde du profil)
- Mappage de douleur : Douleur verticale seulement (pas de recherche d'entreprise)
- Document de recherche : Email de modèle avec 1 point d'insertion (nom d'entreprise ou douleur verticale)
- Séquençage : Pure modèle avec fusion de courrier, toujours 3+ contacts (laisser le volume porter)
- Triage : Si pas de réponse après 3 séquences sur 2 semaines, ajouter immédiatement au parking lot (ne pas gaspiller de séquences)

**Budget temps :**
- Tier 1 : 20 comptes → 6–8 heures
- Tier 2 : 40 comptes → 6–7 heures
- Tier 3 : 100+ comptes → 8–10 heures (surtout fusion de courrier)
- Total : ~20–25 comptes par jour (varie selon mélange tier)

### Phase 5 : Flux de travail Clay / LinkedIn Sales Navigator pour la construction de liste à grande échelle

**Configuration du flux de travail Clay (Recommandé pour 100+ comptes) :**

1. **Couche source :**
   - Entrée : Liste industrielle de Clearbit, export Crunchbase, Apollo ou ZoomInfo
   - Filtre 1 : Plage d'effectifs (plage cible uniquement)
   - Filtre 2 : Plage ARR (seuil minimum)
   - Filtre 3 : Stack technologique (Clearbit : doit inclure outils phares, exclure outils concurrents)
   - Production : 200–1000 entreprises (ajuster les filtres jusqu'à ce que la taille correspondent à votre capacité hebdomadaire)

2. **Couche d'enrichissement :**
   - Enrichissement Clearbit : Financiers de l'entreprise, financement, localisation, verticale industrielle, nombre d'employés
   - Hunter Email Finder : Recherche d'email en masse (ATTENTION : le taux de Hunter chute sur employés plus anciens/inactifs ; vérifier manuellement)
   - LinkedIn Scrape : Exécuter recherche d'URL personnalisée par entreprise pour extraire profils cadre + fondateur → email via Hunter
   - BuiltWith API : Validation secondaire de stack technologique (pour verticales sensibles au stack tech)

3. **Couche de notation :**
   - Ajouter colonne : « Signal de croissance » (vrai/faux basé sur actualités/financement dans les 6 derniers mois)
   - Ajouter colonne : « Correspondance Proxy de douleur » (nombre d'indicateurs de douleur présents)
   - Formule : IF(growth=true, +2) + pain_proxy_count = Fit Score
   - Trier décroissant, assigner Tier (1/2/3) basé sur bandes de note

4. **Threading de contact :**
   - Filtrer par mots-clés rôle contact : exécutif (CEO, CFO, CRO), directeur/VP (rôle acheteur), manager (champion)
   - Dédupliquer sur même compte (un acheteur économique, un champion, un influenceur par compte)
   - Pass d'assurance qualité manuel : vérification d'échantillon 5–10% pour pertinence rôle (éviter titres de poste qui ne correspondent pas à votre acheteur)
   - Production : Liste threadée avec colonnes [Account, Contact1_Name, Contact1_Email, Contact1_Role, Contact2_Name…] pour import aux séquences email

5. **Intégration LinkedIn Sales Navigator :**
   - Flux de travail parallèle (pas remplacement) : Exporter liste d'entreprises cibles
   - Sales Navigator > Company search > Ajouter comptes cibles à liste
   - Remarque : Visiter profils (signal engagement aux prospects), mais compter sur Hunter/Clay pour email (Sales Navigator ne fournit pas export d'email en masse)

**Production de la Phase 5 :** Liste threadée et propre de 100–500 comptes avec 3+ contacts par compte, prêt pour le séquençage.

### Phase 6 : Méthode du Parking Lot — Capturer les signaux faibles tôt

Pas tous les comptes sont prêts à séquencer aujourd'hui. Mais les signaux expirent. Capturer tout.

**Ce qui va dans le Parking Lot :**
- Comptes avec seulement 1–2 signaux de croissance/douleur (prospects Tier 3 avec seulement 1 point)
- Entreprises que vous avez recherchées mais détails contact incomplets (acheteur économique ou champion manquant)
- Comptes avec fort ajustement ICP mais pas signal de douleur actuel (forte correspondance verticale, effectifs faibles, mais financement stable)
- Cibles de prospection ponctuelles d'introductions chaudes qui ne font pas partie de votre liste principale

**Maintenance du Parking Lot (Hebdomadaire) :**
- Signaler tout nouveau signal (offres d'emploi, financement, mention de nouvelles) qui déplace comptes de Tier 3 → Tier 2 ou Tier 2 → Tier 1
- Promouvoir comptes à haut signal à liste de séquençage actif
- Ne pas supprimer comptes ; ils restent dans parking lot jusqu'à :
  - Contactés 3+ fois sans réponse (puis : tag « pas intérêt », supprimer)
  - Accord fermé (puis : tag « client »)
  - Explicitement non-ajusté (puis : tag « hors ICP »)

**Configuration d'outil :**
- Google Sheet ou Airtable : Colonnes [Company, ICP Fit Score, Latest Signal, Signal Date, Status (Active/Parking Lot/Suppressed), Last Outreach Date]
- Script hebdomadaire : Rechercher fil d'actualités + feeds offres d'emploi + LinkedIn pour comptes parking lot, enregistrer nouveaux signaux en colonne Signal Date
- Promotion mensuelle : Déplacer comptes Tier 3 avec nouveau signal à bucket Tier 2, ajouter à séquence prochaine semaine

**Pourquoi c'est important :**
- Les comptes du parking lot sont prospects à démarrage chaud pour campagne du prochain trimestre
- La première séquence arrive quand ils considèrent déjà le changement (signal apparu cette semaine, vous contactez la semaine prochaine = timing)
- Réduit le gaspillage : vous ne re-recherchez pas comptes que vous avez déjà touchés

### Phase 7 : Rythme de prospection quotidienne — La journée de travail 4 heures

**Heure 1 : Recherche (9h00–10h00)**
- Réviser engagement du jour précédent (ouvertures, clics, réponses de la veille)
- Rechercher 20–30 comptes basé sur tier (mélanger Tier 1/2/3 pour rester frais)
- Remplir modèle prospectus de prospection pour chaque compte
- Limite de temps : 2–3 min par Tier 3, 5 min par Tier 2, 15–20 min par Tier 1

**Heures 2–3 : Séquençage (10h00–12h00)**
- Écrire ou personnaliser séquences basé sur prospectus de recherche
- Envoyer séquences de prospection à 20–40 comptes (séquences jour 1 pour comptes nouvellement recherchés)
- Exécuter séquences de suivi (séquences jour 2, jour 5 pour comptes que vous avez déjà contactés)
- Vérifier délivrabilité : vérifier rebonds, drapeaux spam ; échanger emails si nécessaire
- Limite de temps : 3 min par compte pour envois de modèles, 8 min pour personnalisé (Tier 1)

**Heure 4 : Suivi et examen de pipeline (12h00–13h00)**
- Enregistrer toutes réponses dans CRM (ne pas laisser emails s'accumuler dans boîte mail)
- Répondre à réponses positives/engagées immédiatement (priorité Tier 1 ; Tier 2 secondaire)
- Déplacer objections à suivi d'objections (enregistrer motif, ne pas répondre encore ; réponse batch plus tard)
- Ajouter prospects nouveaux à parking lot si signal faible capturé
- Vérifier métriques : Envoyé cette semaine, Taux d'ouverture par tier, Taux de réponse par position séquence, Conversion à réunion

**Pourquoi 4 heures :**
- Recherche plus profonde (accent Tier 1) → conversations de meilleure qualité
- Séquençage batch → efficacité (pas de changement de contexte constant)
- Gestion des réponses même jour → construction de confiance, vélocité pipeline plus rapide
- Examen de métriques → itération rapide (changer séquences si taux ouverture <20%, pivoter message si motif objection émerge)

---

## Exemple

**Scénario : Plateforme B2B SaaS Sales Enablement, cible $3k–$8k MRR, ciblant mid-market US/UK**

**Phase 1 : Définition de l'ICP**
- Industrie : SaaS (NAICS 5112xx), MarTech (contenu/analytics/engagement), PipeTech (adjacent CRM)
- Effectifs : 40–300 employés (pas pré-seed, pas entreprise verrouillée)
- ARR : $5M–$50M (sweet spot : $10M–$30M, minimum $5M)
- Stack technologique : Salesforce + Slack + Outreach/Salesloft + Gong ou Chorus (phares), pas Showpad (incumbent)
- Géographie : US et UK (support anglophone)

**Phase 2 : Exemple de notation d'ajustement de compte**
```
Entreprise : DataBox (Analytics SaaS, 80 employés, $15M ARR)
Signaux de croissance :
  - Financement Série B annoncé (il y a 2 mois) → +1
  - Embauché 3 rôles sales ops (le mois dernier) → +1
  - Ouvert bureau UK (annoncé) → +1
Proxys de douleur :
  - Stack 12+ outils (rapports fragmentés) → +1
  - Actuellement utilise Tableau + Looker (pas plateforme unique analytics ventes) → +1
Score d'ajustement : 5 points (Tier 2)
```

**Phase 3 : Fil 3-Contact**
```
Compte : DataBox
Contact 1 (Acheteur économique) :
  - Nom : James Chen, VP Sales
  - LinkedIn : Récemment promu (il y a 6 mois), précédemment Manager AE chez Stripe
  - Angle de prospection : « James — vu que vous avez agrandi l'org Sales de Stripe ; Databox vient d'embaucher 3 rôles ops. Les outils sales enablement que j'ai vus fonctionner au mieux quand... »
  
Contact 2 (Champion) :
  - Nom : Sarah Patel, Sales Operations Manager
  - LinkedIn : Récemment embauché (il y a 2 mois), avant 4 ans chez HubSpot dans rôle similaire
  - Angle de prospection : « Sarah — les gens HubSpot avec lesquels je travaille font souvent face au même chaos rapports au stade précoce ; nous avons construit [feature] spécifiquement pour... »
  
Contact 3 (Influenceur) :
  - Nom : Marcus Rodriguez, Senior Product Manager (Sales)
  - LinkedIn : Actif dans communauté SaaS Ops, publié sur intégration tech ventes
  - Angle de prospection : « Marcus — remarqué votre post récent sur analytics unifiée. Curieux votre avis sur [topic]—quelque chose sur lequel nous avons été obsédés avec nos clients... »
```

**Phase 4 : Profondeur de recherche**
- Assignation Tier : Score d'ajustement 5 = Tier 2
- Temps de recherche : 10 minutes
  - Aperçu d'entreprise (2 min) : DataBox, Série B, 80 employés, $15M ARR, le produit est tableau de bord analytics
  - Recherche acheteur (3 min) : James promu il y a 6mo de Stripe ; Sarah embauché il y a 2mo de HubSpot ; Marcus actif dans communauté
  - Mappage de douleur (3 min) : Orgs ventes avec outils fragmentés + forte croissance = lacunes rapports ; pane verre unique pour tableaux de bord = leur douleur
  - Prospectus de prospection (2 min) : 3 crochets personnalisés (signal croissance, expérience entreprise antérieure, signal communauté)

**Phase 5 : Production du flux de travail Clay**
```
Entrée (export Crunchbase) : 500 entreprises SaaS, 40–300 HC, $5M–$50M ARR, US/UK
↓
Enrichir Clearbit (supprimer <$5M, >$50M, non-US/UK)
↓
Filtre stack technologique (Salesforce + exclure Showpad)
↓
Email Hunter (recherche en masse pour profils James Chen, Sarah Patel, Marcus Rodriguez)
↓
Formule notation : (Financement Série dans 6mo ? +2) + (Embauches sales ops ? +1) + (0–5 pain proxy) = Fit Score
↓
Assignation Tier + dédupliquer contact
↓
Production : 120 comptes, 360 contacts, liste prête-thread, 30 Tier 1 / 60 Tier 2 / 30 Tier 3
```

**Phase 6 : Entrées du Parking Lot**
```
Entreprise : TechCorp Inc.
- Ajustement ICP : 6/10 (borderline Tier 2)
- Signal : Pas financement récent, mais ouvert rôle Sales ops la semaine dernière
- Statut : Parking Lot
- Dernier contrôle : 2026-01-15
- Action : Contrôler hebdomadaire ; s'ils embauchent 2+ staff ops, promouvoir à séquence active

Entreprise : MidMarket SaaS Co.
- Ajustement ICP : 4/10 (Tier 3)
- Signal : Correspondance verticale forte (MarTech), mais toujours sur HubSpot (pas Salesforce)
- Statut : Parking Lot
- Dernier contrôle : 2026-01-15
- Action : Signaler s'ils annoncent migration Salesforce ou changement d'outils
```

**Phase 7 : Rythme quotidien (Lundi, 20 janvier)**
```
9h00–10h00 Recherche :
- Recherché 5 comptes Tier 1 du parking lot avec signaux nouveaux
- Recherché 10 comptes Tier 2 de nouvelle liste (production Clay)
- Recherché 20 comptes Tier 3 (modèle fusion de courrier)
- Production : 35 prospectus de recherche, prêt à séquencer

10h00–12h00 Séquençage :
- Envoyé prospection jour 1 : 35 comptes (5 personnalisés, 30 modèle avec personnalisation)
- Exécuté suivis jour 5 : 12 comptes (personnes contactées la semaine dernière, pas de réponse encore)
- Exécuté suivis jour 2 : 8 comptes (toucher léger, deuxième contact du fil)
- Statut CRM : 55 séquences envoyées ce matin

12h00–13h00 Suivi et examen :
- Enregistré 3 réponses dans CRM (2 « intéressé par appel », 1 « mauvaise personne, transféré à James »)
- Programmé 2 appels de découverte pour la semaine prochaine
- Identifié motif : taux ouverture 35% sur Tier 1, 18% sur Tier 2, 4% sur Tier 3 (en rythme pour cibles)
- Ajouté 5 comptes parking lot avec signaux nouveaux à file d'attente séquence cette semaine
- Aperçu métriques : 90 séquences envoyées cette semaine, 12 réponses (taux réponse 13%), 2 réunions réservées

Mise à jour parking lot :
- DataBox (de l'exemple ci-dessus) déplacé de Parking Lot à Actif (signal nouveau : Série B)
- Ajouté à file d'attente séquence cette semaine (commencer mercredi pour éviter surcharge lundi)
```

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
