# Intelligence sur les comptes

## Quand activer

- L'utilisateur fournit un nom d'entreprise et une URL LinkedIn et demande de « rechercher ce compte », « constituer un dossier », « identifier les décideurs » ou « extraire des signaux de douleur »
- L'utilisateur a besoin de comprendre qui détient le budget, qui influence et qui bloque au sein d'une entreprise spécifique
- L'utilisateur souhaite identifier des points d'accroche avant une démarche de prospection à froid ou une cartographie de compte
- L'utilisateur se prépare pour un appel de découverte et a besoin d'informations pré-appel
- L'utilisateur dispose d'une liste de comptes cibles et a besoin d'une priorisation de la profondeur de recherche par niveau

## Quand NE PAS utiliser

- L'utilisateur pose des questions générales de recherche B2B non liées à un compte spécifique (utiliser un outil de recherche web à la place)
- L'utilisateur souhaite générer du contenu d'e-mail de prospection à froid (l'intelligence sur les comptes alimente la prospection, mais ne la rédige pas)
- L'utilisateur recherche une entreprise pour l'évaluer en tant que *fournisseur* ou *employeur potentiel* (modèle de recherche différent)
- L'utilisateur a déjà effectué ses propres recherches approfondies et souhaite simplement une validation (utiliser code-review ou verify à la place)
- L'utilisateur veut des données de tarification en temps réel ou des métriques financières (cette compétence se concentre sur la prise de décision et les signaux de douleur, pas sur les finances)

## Instructions

### Le modèle d'intelligence de compte à 5 couches

Chaque dossier de compte est construit en empilant ces couches. Les niveaux supérieurs nécessitent les cinq ; les niveaux inférieurs en nécessitent trois.

#### Couche 1 : Structure organisationnelle (cartographie des décideurs)

**Objectif :** Identifier trois types de rôles dans l'entreprise :
- **Acheteur économique** — détient le budget, a une responsabilité P&L, veto final. (CFO, VP Finance, CRO, VPE, VP Ops)
- **Champion** — utilise votre solution quotidiennement, a une incitation personnelle à acheter. (Responsable d'équipe, collaborateur individuel, manager de la fonction que vous résolvez)
- **Influenceur** — façonne la perception et peut bloquer ou accélérer. (CTO, Chief Product Officer, responsable pair, fonction d'audit)

**Sources à consulter :**
- Page LinkedIn de l'entreprise : section direction, recrutements récents aux postes C-suite/VP
- LinkedIn : rechercher « [Entreprise] [Titre] » pour chaque rôle, vérifier la dernière activité (dans les 30 jours = actif)
- G2/Capterra : les auteurs d'avis indiquent souvent leur titre et leur séniorité
- Offres d'emploi : les nouveaux recrutements/rôles révèlent qui développe quelle fonction (signale une priorité)

**Logique de décision :**
- Si l'entreprise compte <100 employés : l'acheteur économique est souvent le fondateur/PDG ; le champion est le responsable d'équipe directement impacté
- Si l'entreprise compte 100–1000 employés : l'acheteur économique est VP/CFO de la fonction ; le champion est le manager ou le collaborateur principal ; l'influenceur est le CTO ou le responsable de cette fonction
- Si l'entreprise compte >1000 employés : ajouter une couche supplémentaire — trouver un sponsor (niveau directeur pouvant vous présenter à l'acheteur économique)

#### Couche 2 : Événements récents (signaux de dynamique)

**Objectif :** Trouver les 90 derniers jours d'activité de l'entreprise qui créent de l'urgence ou du contexte.

**Sources à consulter (dans l'ordre) :**
1. LinkedIn de l'entreprise : publications, annonces d'embauche, jalons (financement, IPO, acquisition, ouverture de bureau)
2. Activité LinkedIn du PDG/VP : retweets, partages, commentaires d'articles — révèle ce qui les préoccupe
3. Communiqués de presse : Crunchbase, site web de l'entreprise, Medium, fils d'actualité
4. Annonces de financement : Crunchbase, TechCrunch, VentureBeat (révèle le capital, les objectifs de croissance, les nouveaux problèmes à résoudre)
5. Lancements de produits : nouvelles fonctionnalités G2, annonces dans la newsletter ou le blog de l'entreprise
6. Changements de direction : PDG, CRO, CTO, VP de la fonction dans laquelle vous vendez (révèle les priorités, l'appétit pour le changement)

**Notation :**
- Financement récent (dans les 90 derniers jours) = urgence maximale (argent à dépenser, pression pour le déployer)
- Lancement de produit ou expansion de marché = urgence moyenne (construction d'un nouveau flux de revenus, peut avoir besoin d'outils)
- Changement de direction dans votre fonction = urgence moyenne (le nouveau leader veut avoir de l'impact)
- Actualités/presse = faible urgence (contexte, pas un déclencheur)

#### Couche 3 : Stack technologique et lacunes (évaluation des capacités)

**Objectif :** Identifier ce qu'ils utilisent, ce qu'ils n'utilisent pas et ce qui est défaillant.

**Sources à consulter (dans l'ordre) :**
1. BuiltWith : révèle les technologies marketing, l'analytique, le CRM, l'infrastructure, les outils de sécurité
2. Offres d'emploi LinkedIn : « Recherche expert [outil] » ou « requis : expérience avec [outil] » = stack actuelle ; « apprécié : [outil] » = aspirationnel/lacune
3. Avis G2 : filtrer par taille d'entreprise et secteur, lire les commentaires sur les problèmes (lenteur, lacunes d'intégration, coût)
4. Crunchbase : intégrations technologiques de l'entreprise si répertoriées
5. Blog/podcast de l'entreprise : articles tech, études de cas, décisions d'architecture révèlent les choix d'infrastructure
6. Dépôts SEC (si cotée en bourse) : les détails des dépenses logicielles sont parfois révélés

**Logique de décision :**
- S'ils utilisent [Outil A] + [Outil B] mais *pas* [Outil C] = lacune probable ou décision consciente
- Si plusieurs avis disent « [Outil] est lent à intégrer » = proxy de douleur
- Si une offre d'emploi dit « doit connaître [Outil] » mais vous ne voyez aucune utilisation ailleurs = nouvelle initiative qu'ils construisent
- S'ils utilisent [Outil concurrent] = préparer l'objection de référence

#### Couche 4 : Proxies de douleur (analyse des offres d'emploi et des avis)

**Objectif :** Extraire les problèmes implicites des offres d'emploi et des avis utilisateurs.

**Méthodologie :**

Correspondance de modèles dans les offres d'emploi :
- « Recherche [rôle] pour posséder/construire/améliorer [fonction] » → ils investissent dans ce domaine
- « 5+ ans d'expérience avec [compétence technique spécifique] » → c'est un goulot d'étranglement aujourd'hui
- « Doit avoir de l'expérience avec la mise à l'échelle/la croissance/l'automatisation » → ils rencontrent des frictions
- « Nous cherchons quelqu'un pour rationaliser [X] » → le processus actuel est lent ou manuel
- « Aidez-nous à migrer de [Ancien système] vers [Nouveau système] » → dette héritée, évaluation de fournisseur en cours
- « Construire des tableaux de bord/rapports pour [département] » → aucune visibilité aujourd'hui

Correspondance de modèles dans les avis G2 (filtrer par taille/secteur de votre entreprise) :
- « Lent à implémenter » → durée du cycle de vente + friction de déploiement
- « Manque [fonctionnalité] » → lacune fonctionnelle que vous pourriez combler
- « Cher » → objection sur le coût, sensibilité budgétaire
- « Mauvaise intégration avec [outil] » → cauchemar d'intégration = point d'accroche commercial
- « J'adore mais ne peut pas s'adapter au-delà de X » → douleur de croissance, opportunité d'acquisition

**Notation :** Compter les signaux de douleur. 3+ signaux distincts entre avis et offres d'emploi = qualification solide.

#### Couche 5 : Empreinte sociale (engagement et leadership éclairé)

**Objectif :** Comprendre la visibilité et l'activité des décideurs ; ce qui les préoccupe.

**Sources à consulter :**
1. Activité LinkedIn du PDG/VP : publications (pas seulement des partages), engagement, lectures d'articles, commentaires sur les tendances sectorielles
2. LinkedIn de l'entreprise : taux d'engagement organique (commentaires, partages, réactions) ; sujets sectoriels qu'ils défendent
3. Twitter/X du PDG : si actif, révèle les priorités en temps réel, la philosophie, la prise de décision
4. Newsletter de l'entreprise : si ils en publient une, montre dans quoi ils investissent
5. Apparitions en podcast/webinaire : les prises de parole révèlent le positionnement et l'audience

**Notation :**
- Actif (publie 2–4 fois par semaine, engage avec les commentaires) = leader visible, réceptif aux messages entrants, peut lire les prospections à froid
- Dormant (<1 publication par mois, pas d'engagement) = moins susceptible de voir une prospection à froid, peut nécessiter une introduction chaleureuse
- Leadership éclairé (prises de parole, écrits, cité comme expert) = leader crédible, plus facile avec un point d'accroche basé sur la flatterie

---

### Profondeur de recherche par niveau

Tous les niveaux utilisent le modèle à 5 couches, mais l'intensité de la recherche et le détail des résultats diffèrent.

#### Niveau 1 — Dossier complet (20 minutes)
**Quand utiliser :** Compte à haute valeur (transaction nommée, ACV entreprise >100 k$, cible de liste C, partenariat stratégique)
**Profondeur de recherche :**
- Couche 1 : Trouver 3 décideurs par nom, titre, activité LinkedIn actuelle, date de dernière publication
- Couche 2 : Extraire 3–5 événements récents avec dates, lien vers chacun (financement, embauches, lancements, changements de direction)
- Couche 3 : Lister 10+ outils dans leur stack, identifier 2–3 lacunes, citer la source pour chaque outil
- Couche 4 : Analyser 5+ offres d'emploi + 8–10 avis G2, extraire 5+ signaux de douleur avec exemples
- Couche 5 : Profiler le PDG + 2 VP — fréquence d'activité, date de dernière publication, style d'engagement

**Résultat :** Dossier de compte complet (modèle ci-dessous)
**Estimation de temps :** 18–22 minutes (4–5 min par couche + 2 min de synthèse)

#### Niveau 2 — Brief intermédiaire (10 minutes)
**Quand utiliser :** Compte mid-market (ACV 20 k$–100 k$), liste de comptes, prospection initiale
**Profondeur de recherche :**
- Couche 1 : Trouver 2 décideurs (acheteur économique + champion), noms + titres seulement
- Couche 2 : Extraire 2–3 événements récents (les plus récents seulement)
- Couche 3 : Lister 5–7 outils clés, 1–2 lacunes
- Couche 4 : Analyser 3–4 offres d'emploi + 4–5 avis, extraire 3–4 signaux de douleur avec des exemples légers
- Couche 5 : Niveau d'activité du PDG seulement (actif/dormant/leadership éclairé)

**Résultat :** Dossier abrégé (1 page)
**Estimation de temps :** 8–11 minutes

#### Niveau 3 — Profil minimum (3 minutes)
**Quand utiliser :** Recherche sur liste à volume élevé, qualification rapide, social selling
**Profondeur de recherche :**
- Couche 1 : Trouver le nom + titre du PDG seulement
- Couche 2 : Un signal récent (financement, actualités ou embauche récente)
- Couche 3 : Un outil ou une lacune notable
- Couche 4 : Un signal de douleur (d'une offre ou d'un avis)
- Couche 5 : Ignorée

**Résultat :** Instantané de l'entreprise en un paragraphe
**Estimation de temps :** 2–4 minutes

---

### Modèle de dossier de compte

Utiliser ce format exact pour la recherche de Niveau 1. Adapter pour les Niveaux 2/3 en supprimant les sections marquées [N1 seulement].

```
## [NOM DE L'ENTREPRISE] — Dossier d'intelligence de compte

### Vue d'ensemble de l'entreprise (2 phrases)
[1 phrase sur ce qu'ils font + marché]
[1 phrase sur la traction récente ou le contexte qui compte pour votre argumentaire]

### Cartographie des décideurs
[Format : Nom (Titre, Dernière activité LinkedIn) — Rôle et influence]

**Acheteur économique :** [Nom], [Titre]
- Propriétaire P&L : [fonction spécifique : Ventes, Ingénierie, Finance, Opérations]
- Dernière activité sur LinkedIn : [date]
- Signal : [contexte bref, ex. : « A publié sur le recrutement pour l'expansion de l'équipe » ou « Aucune activité depuis 60 jours »]

**Champion :** [Nom], [Titre]
- Utilise votre catégorie de solution quotidiennement
- Dernière activité sur LinkedIn : [date]
- Signal : [preuve par offre d'emploi ou avis décrivant la douleur dans ce rôle]

**Influenceur :** [Nom], [Titre]
- Peut bloquer/accélérer : [pourquoi : CTO, Chief Product Officer, responsable pair dans sa fonction]
- Dernière activité sur LinkedIn : [date]
- Signal : [activité récente prouvant la pertinence : publication sur les choix technologiques, recrutement, M&A]

[N1 seulement] **Sponsor (optionnel) :** [Nom], [Titre]
- Pont vers l'acheteur économique (si l'entreprise compte >1000 employés)

### Couche 2 : Événements récents (signaux de dynamique)
[3–5 événements, les plus récents en premier, avec dates et liens]

- **[Date, Type d'événement] :** [Ce qui s'est passé] → Implication pour votre argumentaire
  - Source : [Lien]

### Couche 3 : Stack technologique et lacunes
[Lister les outils actuels ; identifier les lacunes et les aspirations]

**Stack actuelle (vérifiée) :**
- [Catégorie] : [Outil 1], [Outil 2]
- [Catégorie] : [Outil]

**Lacunes identifiées :**
- [Lacune 1] : Utilise [Ancien outil], les offres d'emploi montrent un intérêt pour [Nouvelle catégorie] → Opportunité de migration
- [Lacune 2] : [Problème], non résolu par la stack actuelle → Douleur directe

**Friction d'intégration :**
- [Outil A] + [Outil B] noté comme « difficile à synchroniser » dans 3 avis → Point de vente sur l'intégration

### Couche 4 : Signaux de douleur (Top 3)
[Classer par force des preuves : offres d'emploi > plusieurs avis > avis unique > inférence]

**Signal #1 : [Énoncé du problème]**
- Preuves : [2–3 offres d'emploi ou citations d'avis]
- Fréquence : Mentionné dans [X] offres / [X] avis
- Urgence : [Élevée/Moyenne/Faible — déduite de la récence et du niveau de l'offre d'emploi]
- Votre point d'accroche : [Comment votre produit résout cela en une phrase]

**Signal #2 : [Énoncé du problème]**
- Preuves : [2–3 offres d'emploi ou citations d'avis]
- Fréquence : Mentionné dans [X] offres / [X] avis
- Urgence : [Élevée/Moyenne/Faible]
- Votre point d'accroche : [Une phrase]

**Signal #3 : [Énoncé du problème]**
- Preuves : [Offre d'emploi ou citation d'avis]
- Fréquence : Mentionné dans [X] offres / [X] avis
- Urgence : [Élevée/Moyenne/Faible]
- Votre point d'accroche : [Une phrase]

### Meilleur point d'accroche de personnalisation
[Un angle spécifique et crédible pour introduire. Format : « Utiliser [Signal/Événement/Personne] comme point d'accroche. Exemple d'ouverture : '...' » ]

Exemples de formats :
- Point d'accroche actualité : « La publication de [Nom du PDG] sur [sujet] le [date] suggère qu'ils priorisent X. Nous aidons des entreprises comme [entreprise similaire] à résoudre cela en... »
- Point d'accroche douleur : « J'ai remarqué que 5 de vos offres d'emploi récentes mentionnent [compétence]. Cela signifie généralement... »
- Point d'accroche technologique : « Vous utilisez [Outil A] mais les offres d'emploi montrent que vous recrutez pour [nouveau domaine]. Nous sommes spécialisés dans... »
- Point d'accroche leadership : « [Nom du nouveau recrutement] vient de rejoindre en tant que [rôle]. D'après son parcours dans [domaine], elle est probablement responsable de... »

### Premier canal recommandé
[Choisir un ; expliquer pourquoi]

- **InMail LinkedIn à [Acheteur économique] ?** — Si actif, <5 contacts dans le rôle, signal de confiance élevé
- **Message LinkedIn à [Champion] ?** — S'il est visible, moins menaçant que directement à l'acheteur, plus facile à réchauffer
- **E-mail (introduction chaleureuse) ?** — Si vous avez une connexion mutuelle (vérifier « Personnes que vous connaissez » sur LinkedIn)
- **E-mail (froid) ?** — Si la douleur est suffisamment aiguë, l'entreprise recrute (visible sur LinkedIn)
- **Prospection LinkedIn à [Influenceur] ?** — S'ils sont très actifs et leaders éclairés (plus facile d'obtenir un rendez-vous)

**Pourquoi :** [Justifier en fonction de leur niveau d'activité, de la taille de l'organisation, de l'urgence de la douleur]

### Cadre recommandé
[En choisir un ; expliquer pourquoi]

- **Cadre « Au fait »** — Idéal si : La douleur est évidente, le champion est réceptif, l'objectif est une introduction chaleureuse
- **Qualification MEDDIC / BANT** — Idéal si : Transaction entreprise, processus d'achat complexe, plusieurs décideurs
- **Point d'accroche ROI/efficacité** — Idéal si : L'acheteur Finance est la cible, la douleur est le coût ou le travail manuel, vous avez des benchmarks
- **Déclenché par un événement** — Idéal si : Un financement ou une embauche récente suggère une réceptivité ; utiliser les actualités comme preuve d'appétit pour le changement
- **Preuve sociale par les pairs** — Idéal si : [Outil concurrent ou entreprise similaire] est client ; mentionner le nom de manière contextuelle

**Pourquoi :** [Expliquer la pertinence]

### Qualité des données et notation de confiance
[N1 seulement]

- **Fraîcheur des données :** Dernière mise à jour de la recherche [date]
- **Confiance dans la précision des décideurs :** [Élevée/Moyenne/Faible — basée sur la confirmation de 2+ sources]
- **Force du signal de douleur :** [Élevée/Moyenne/Faible — basée sur la fréquence des mentions + récence]
- **Prochaine étape recommandée :** [Prospection directe / Introduction chaleureuse nécessaire / Trop de bruit, rechercher davantage / Prêt pour le pitch]
```

---

### Modèle de prompt

**Prompt à utiliser au démarrage de la recherche :**

```
Act as a B2B account intelligence specialist. I'm researching [COMPANY NAME] to prepare for outreach.

Depth: [Tier 1 / Tier 2 / Tier 3]

Company Info:
- Company: [COMPANY NAME]
- LinkedIn URL: [LINKEDIN_URL]
- Industry: [If known — optional]
- Company Size: [If known — optional]
- Your product: [Brief 1-sentence description of what you sell]

For Tier 1: Use all 5 layers (org structure, recent events, tech stack, pain signals, social footprint). Find 3 named decision-makers with current LinkedIn activity. Extract 3–5 pain signals from job postings and G2 reviews. Provide a complete Account Dossier using the template.

For Tier 2: Focus on layers 1–4. Find 2 key decision-makers. Extract 3–4 pain signals. Provide a 1-page abbreviated dossier.

For Tier 3: Quick snapshot only. CEO name, one recent signal, one pain signal, one tool/gap.

Research checklist:
- [ ] Company LinkedIn page reviewed (leadership, recent activity, headcount)
- [ ] CEO/VP LinkedIn activity checked (last 30 days)
- [ ] 3+ job postings analyzed (if available)
- [ ] G2/Capterra reviews mined (industry/size filter applied)
- [ ] BuiltWith tech stack verified
- [ ] Recent press/news checked (funding, hires, product launches)

Output format: Use the Account Dossier template provided. Be specific — cite sources, dates, and names. No vague claims.
```

---

### Arbres de décision et logique

#### Dois-je rechercher ce compte ?

```
Do you have a company name + LinkedIn URL?
├─ Yes
│  ├─ Is it a Tier 1 account (high-value, strategic, named deal)?
│  │  └─ Yes → Invest 20 min in full dossier (Tier 1)
│  └─ Is it Tier 2 (mid-market, account list)?
│     └─ Yes → 10-min medium brief (Tier 2)
│  └─ Is it volume prospecting or quick-qualify?
│     └─ Yes → 3-min snapshot (Tier 3)
└─ No → Ask for company name + LinkedIn URL before starting
```

#### Comment trouver les décideurs ?

```
Start with company LinkedIn page:
├─ Does it list C-suite/VP?
│  ├─ Yes → Note names, check their individual LinkedIn profiles for recent activity
│  └─ No → Company may be <50 headcount; assume CEO is economic buyer
├─ Check "People" tab on company page
│  └─ Filter by title (VP Finance, VP Sales, CTO, Chief Product Officer)
├─ Cross-check on job postings
│  └─ "Reporting to [Name]" in job posting = confirms role + name
└─ Search Google + LinkedIn for "[Company] [Role]"
   └─ Use last activity date to gauge engagement
```

#### Comment extraire les signaux de douleur ?

```
Job Postings (highest fidelity):
├─ Read 3–5 postings for your function
├─ Extract patterns: "seeking X to fix Y"
├─ Note urgency (hiring at manager/director level = high priority)
├─ Note context (hiring for new function = expansion; reqs = problems)

G2 Reviews (validation):
├─ Filter by company size + industry
├─ Read 4–6 reviews, search for keywords: "slow," "integration," "lack," "need," "expensive"
├─ Count frequency (3+ reviews mention same pain = strong signal)
└─ Prioritize recent reviews (< 6 months old)

LinkedIn Job Postings:
├─ Search "[Company Name] hiring"
├─ Sort by most recent
├─ Extract 3–5 open roles + their descriptions
└─ Note: Stack of titles reveals org priorities (e.g., 5 sales roles open = growth mode)
```

#### Comment choisir le niveau de recherche ?

```
Tier 1 Criteria (Full Dossier — 20 min):
├─ ACV or deal size >$100k
├─ Named deal or strategic account
├─ C-suite target or enterprise buying process
└─ Can invest time for high-precision research

Tier 2 Criteria (Medium Brief — 10 min):
├─ ACV $20k–$100k
├─ Account on list of 10–50 targets
├─ Sales development (SDR) lead generation
└─ Need signal before first touchpoint

Tier 3 Criteria (Minimum Profile — 3 min):
├─ ACV <$20k or volume prospecting
├─ Account list of 100+
├─ Social selling or rapid qualification
└─ Quick decision: fit or skip
```

---

### Benchmarks de recherche et allocation du temps

**Répartition Niveau 1 (20 min) :**
- Couche 1 (Structure organisationnelle) : 5 min
- Couche 2 (Événements récents) : 3 min
- Couche 3 (Stack technologique) : 4 min
- Couche 4 (Signaux de douleur) : 6 min
- Couche 5 (Social) : 1 min
- Synthèse + rédaction du dossier : 1 min

**Répartition Niveau 2 (10 min) :**
- Couches 1–4 : 9 min (sans profondeur sur la couche 5)
- Rédaction du dossier : 1 min

**Répartition Niveau 3 (3 min) :**
- Scan rapide de la page de l'entreprise : 1 min
- Un signal de douleur : 1 min
- Rédaction du paragraphe : 1 min

**Conseils pour réduire l'effort :**
- BuiltWith avant LinkedIn (10 secondes pour révéler 80% de la stack)
- Recherche d'avis G2 : filtrer d'abord par taille d'entreprise (économise 3 min d'avis non pertinents)
- Offres d'emploi : lire seulement les 5 premières (rendements décroissants après 5)
- LinkedIn : vérifier uniquement les 30 derniers jours d'activité (les publications plus anciennes ne sont pas pertinentes pour les priorités actuelles)

---

### Anti-modèles à éviter

1. **Rechercher sans hypothèse** — Ne pas commencer la couche 4 (douleur) sans la couche 3 (stack technologique) ; vous manquerez des signaux.
2. **Sur-rechercher le Niveau 3** — Si vous n'avez que 3 minutes, ne passez pas 5 minutes à lire des avis. Choisissez un signal et passez à autre chose.
3. **Confondre l'activité du fondateur/PDG avec l'activité de l'entreprise** — Un PDG silencieux sur LinkedIn ≠ l'entreprise est dormante. Vérifier la page de l'entreprise + la presse indépendamment.
4. **Prendre les avis G2 pour argent comptant** — Toujours vérifier : (a) le titre du rédacteur (collaborateur individuel vs. décideur), (b) la date de l'avis (60+ jours = moins pertinent), (c) la correspondance de taille d'entreprise.
5. **Manquer le « pourquoi » dans la stack technologique** — Ne pas se contenter de lister les outils. Demander : pourquoi cet outil ? Quel problème résout-il ? Est-ce une lacune ou un atout ?
6. **Prioriser la nouveauté sur la pertinence** — Un tour de financement de 3 mois n'est pas un point d'accroche si leur signal de douleur date de 2 ans et n'est pas résolu (suggère des priorités différentes).
7. **Affirmations à source unique** — Une offre d'emploi mentionnant « croissance » ≠ signal d'urgence élevée automatique. Croiser avec des actualités récentes ou un consensus d'avis.

---

## Exemple

### Scénario : Recherche Niveau 1 sur [EXEMPLE D'ENTREPRISE RÉELLE]

**Brief :** Vous êtes un responsable de compte pour une plateforme de pipeline de données (comme Fivetran, Airbyte ou dbt Cloud). Votre entreprise est spécialisée dans l'automatisation de l'ingestion et de la transformation des données. Vous avez identifié une entreprise e-commerce mid-market, [TechRetail Inc.], comme cible. Vous avez besoin d'un dossier de compte complet avant votre premier appel avec leur VP des données.

**Entreprise :** TechRetail Inc. (exemple fictif)
**LinkedIn :** linkedin.com/company/techretail-inc
**Votre produit :** Orchestration automatisée de pipeline de données + surveillance de la qualité des données
**Niveau :** Niveau 1 (transaction nommée, ACV entreprise)

---

### Processus de recherche (suivant les 5 couches)

#### Couche 1 : Structure organisationnelle

**Revue de la page LinkedIn de l'entreprise :**
- Effectif : ~450 (d'après la section « À propos »)
- Direction : PDG [Sarah Chen], CTO [Marcus Williams], VP Finance [David Park], VP Ventes [Jessica Liu]

**Résultats de recherche :** « [TechRetail VP Data] » → Trouvé [Alex Rodriguez], VP Données & Analytique, URL LinkedIn [lien], dernière publication le 1er juin 2026 (actif, 3–4 publications par semaine)

**Résultats de recherche :** « [TechRetail Director Engineering] » → Trouvé [Jamie Kim], Directrice de l'ingénierie des données, URL LinkedIn [lien], dernière publication le 28 mai 2026 (active, répond aux commentaires)

**Vérification croisée sur l'onglet « Personnes » de LinkedIn :**
- [Alex Rodriguez] : VP Données & Analytique — rapport direct à VP Ventes (Jessica Liu) selon le profil
- [Jamie Kim] : Directrice de l'ingénierie des données — rapport direct au CTO (Marcus Williams)
- [Sarah Chen] : PDG — publie occasionnellement sur la culture d'entreprise + la croissance

**Cartographie des décideurs :**
- **Acheteur économique :** [David Park], VP Finance (détient le budget d'infrastructure de données, P&L pour les dépenses technologiques)
- **Champion :** [Alex Rodriguez], VP Données (utilisateur quotidien des outils de pipeline, a des KPI liés à la qualité + la vélocité des données)
- **Influenceur :** [Marcus Williams], CTO (peut bloquer si l'architecture ne correspond pas aux pratiques d'ingénierie ; peut accélérer s'il la défend)

---

#### Couche 2 : Événements récents

**Page LinkedIn de l'entreprise :**
- 15 mai 2026 : Annonce publiée : « Nous avons levé 25 M$ en financement Série B pour alimenter notre expansion vers les marchés européens et renforcer notre infrastructure de données. » [Lien]
- 22 mai 2026 : « Heureux d'annoncer [Jamie Kim] comme nouvelle Directrice de l'ingénierie des données ! Jamie apporte 10 ans d'expérience dans la construction de plateformes de données chez [Entreprise précédente]. »
- 8 mai 2026 : Étude de cas publiée : « Comment nous avons réduit le temps de traitement des données de 40% grâce à [initiative interne]. »

**PDG (Sarah Chen) LinkedIn :**
- 1er juin 2026 : A repartagé un article TechCrunch sur « L'avenir des plateformes de données client » avec le commentaire : « Cela résonne — notre feuille de route est fortement axée sur les données. »
- 25 mai 2026 : A publié sur sa participation à une conférence sur l'ingénierie des données, a mentionné « impressionnée par les nouveaux outils dans l'espace d'orchestration. »

**Presse/Actualités :**
- Crunchbase : financement Série B, 25 M$, mené par [Nom VC], 15 mai 2026
- VentureBeat : « TechRetail lève 25 M$ pour étendre la personnalisation axée sur les données » (l'article confirme la focalisation sur les données client + personnalisation)

**Traduction :** L'entreprise dispose de capital, investit dans l'équipe données (la nouvelle embauche de directeur signale l'urgence), le PDG recherche activement de nouveaux outils de données, et le VP Finance (propriétaire du budget) publie activement sur des sujets finance/opérations (signal de réceptivité).

**Notation de récence :**
- Série B (mai) = urgence maximale (capital à déployer, fenêtre de dépense de 90 jours)
- Nouvelle embauche en ingénierie des données (mai) = urgence moyenne-élevée (élargissement de l'équipe, probablement évaluation des outils)
- Recherche d'outils par le PDG (juin) = moyen (signale une ouverture aux nouvelles solutions)

---

#### Couche 3 : Stack technologique et lacunes

**Vérification BuiltWith :**
- Analytique : Mixpanel, Segment, Google Analytics
- CRM : Salesforce
- Entrepôt de données : Snowflake (confirmé dans offre d'emploi + matériaux de presse)
- BI : Looker (mentionné dans le LinkedIn de [Jamie Kim] comme « travaillé avec Looker dans l'entreprise précédente »)
- ETL/Pipeline de données : [Pas clairement répertorié]

**Offres d'emploi LinkedIn (5 dernières) :**
1. « Ingénieur senior en données » (publié le 20 mai) : « Requis : SQL, Python, Airflow ou outil d'orchestration similaire. Apprécié : expérience dbt. »
   - Traduction : Utilise actuellement Airflow, intéressé par dbt ; évalue probablement des améliorations d'orchestration
2. « Ingénieur analytique » (publié le 28 mai) : « Construire des transformations et des modèles de données. Expérience avec SQL, dbt, Snowflake requise. »
   - Traduction : Recrute activement pour l'ingénierie dbt/analytique ; capacité en début de phase qu'ils ajoutent
3. « Ingénieur qualité des données » (publié le 1er juin) : « Prendre en charge la qualité et les tests des données. Nous construisons de nouveaux processus de surveillance. »
   - Traduction : La qualité des données est un *nouveau problème* qu'ils résolvent ; investissement en infrastructure confirmé
4. « Responsable de l'infrastructure de données » (publié le 10 mai) : « Propriétaire de la feuille de route de notre plateforme de données. Doit avoir de l'expérience dans la mise à l'échelle des clusters Snowflake + la réduction des coûts. »
   - Traduction : Douleur de coût + mise à l'échelle ; l'efficacité de l'infrastructure est importante

**Avis G2 (filtrés par 100–1000 employés, e-commerce) :**
- Avis 1 (mai 2026, Analyste de données senior) : « Snowflake est solide, mais notre couche de transformation est fragmentée. Nous avons des scripts Python, des modèles dbt et des DAGs Airflow — difficile de suivre les dépendances. L'intégration entre ces outils nécessite des améliorations. »
  - Douleur : L'orchestration multi-outils est fragmentée ; le suivi des dépendances est cassé
- Avis 2 (juin 2026, Manager analytique) : « Nous atteignons des problèmes de mise à l'échelle avec Airflow. Les déploiements prennent 2+ heures, et le débogage des travaux échoués est pénible. »
  - Douleur : Évolutivité Airflow + surcharge opérationnelle
- Avis 3 (avril 2026, Responsable ingénierie des données) : « Transition de scripts personnalisés vers Airflow, mais la courbe d'apprentissage est raide et nous manquons d'une bonne surveillance. Cherche des solutions pour simplifier cela. »
  - Douleur : Adoption Airflow + surveillance
- Avis 4 (mai 2026, VP Analytique, autre entreprise, même taille) : « Notre pipeline de données est un goulot d'étranglement. Nous voulons passer à une solution gérée pour réduire la surcharge des opérations, mais nous sommes bloqués sur Airflow. »
  - Inférence : TechRetail a probablement le même problème (verrouillage Airflow)

**Résumé de la stack technologique :**

Outils actuels :
- Entrepôt : Snowflake
- Orchestration : Airflow (principal), scripts Python personnalisés
- Transformation : dbt (en cours d'adoption)
- Analytique : Looker, Mixpanel, Segment
- Aucune preuve de solution de pipeline de données gérée (Fivetran, Airbyte, etc.)

Lacunes identifiées :
1. **Évolutivité de l'orchestration :** Temps de déploiement Airflow lents (2+ heures selon les avis du responsable du recrutement), pas de stratégie de surveillance, intégration multi-outils fragmentée
2. **Gouvernance de la transformation des données :** Plusieurs couches de transformation (dbt + scripts Python) non intégrées ; suivi des dépendances manquant
3. **Qualité/observabilité des données :** La nouvelle embauche (Ingénieur qualité des données) suggère que c'est nouvellement prioritaire ; pas encore de solution établie

Friction d'intégration :
- Airflow + Snowflake : intégration manuelle, surveillance via les journaux Airflow (limité)
- Airflow + dbt : pas d'intégration native ; nécessite une orchestration personnalisée
- dbt + Snowflake : fonctionne, mais la mise à l'échelle nécessite une gouvernance (suivi des modèles, lignée)

---

#### Couche 4 : Signaux de douleur (Top 3)

**Signal #1 : Surcharge opérationnelle Airflow + goulot d'étranglement d'évolutivité**

Preuves :
- Offre d'emploi (20 mai) : « Ingénieur senior en données requis : Airflow ou orchestration similaire. Apprécié : expérience dbt » → signale l'utilisation actuelle d'Airflow, intérêt pour les alternatives
- Offre d'emploi (10 mai) : « Responsable de l'infrastructure de données — Propriétaire de la feuille de route de la plateforme de données. Doit avoir de l'expérience dans la mise à l'échelle des clusters Snowflake + réduction des coûts » → douleur explicite de coût + mise à l'échelle
- Avis G2 (filtrés par taille d'entreprise + e-commerce) :
  - Mai 2026 : « Les déploiements prennent 2+ heures, le débogage des travaux échoués est pénible »
  - Avril 2026 : « Courbe d'apprentissage raide, manque de surveillance »
- Contexte de la nouvelle embauche : Jamie Kim (Directrice de l'ingénierie des données, embauchée le 22 mai) avec un parcours dans « la mise à l'échelle des plateformes de données » dans son entreprise précédente → signale que cette douleur était une exigence d'embauche

Fréquence : Mentionné dans 3 offres d'emploi + 2 avis G2 = consensus élevé
Urgence : **Élevée** — Nouveau directeur embauché pour résoudre ; capital Série B alloué ; offres d'emploi récentes
Votre point d'accroche (angle Fivetran/Airbyte) : « Votre calcul Série B ne fonctionne pas si 2 heures de chaque journée de déploiement sont consacrées aux opérations Airflow. Votre nouvelle Directrice de l'ingénierie des données (Jamie Kim, d'après son parcours) va probablement évaluer des solutions d'orchestration qui réduisent la surcharge opérationnelle de 50%+ au cours du T3. Une plateforme gérée permet à votre équipe de se concentrer sur la stratégie de données, pas sur l'infrastructure. »

---

**Signal #2 : Fragmentation de la stack de données multi-outils + suivi des dépendances**

Preuves :
- Offre d'emploi (28 mai) : « Ingénieur analytique — Transformer les données avec SQL, dbt, Snowflake » → signale l'adoption de dbt mais pas encore mature
- Offre d'emploi (20 mai) : « Ingénieur senior en données — Airflow ou similaire + dbt apprécié » → signale la coexistence de deux approches de transformation
- Avis G2 (mai 2026) : « Nous avons des scripts Python, des modèles dbt et des DAGs Airflow — difficile de suivre les dépendances. L'intégration entre les outils nécessite des améliorations »
- Offre d'emploi (1er juin, Ingénieur qualité des données) : « Prendre en charge la qualité et les tests des données » → signale qu'ils veulent centraliser la qualité, mais la stack actuelle est fragmentée

Fréquence : Plusieurs offres d'emploi + 1 avis détaillé = modèle clair
Urgence : **Moyenne-élevée** — Ils recrutent activement pour résoudre cela (rôle d'Ingénieur analytique), mais pas encore critique
Votre point d'accroche (dbt Cloud / plateforme d'orchestration) : « Vous construisez une stack de données moderne (Snowflake + dbt), mais votre couche d'orchestration n'est pas conçue pour cela. Vous avez une logique de transformation dispersée entre des scripts Python, dbt et Airflow. Consolider sur une plateforme qui synchronise les trois réduit votre dette de suivi des dépendances de 70% et rend votre gouvernance des données évolutive. »

---

**Signal #3 : Qualité des données + observabilité (nouvelle priorité critique)**

Preuves :
- Offre d'emploi (1er juin) : « Ingénieur qualité des données — Nous construisons de nouveaux processus de surveillance » (nouveau rôle, publication récente)
- Avis G2 (avril 2026) : « Nous manquons d'une bonne surveillance. Transition vers Airflow, mais la stratégie de surveillance n'est pas établie »
- Contexte : Expansion Série B vers l'UE + focus personnalisation = la précision des données impacte directement l'expérience client + les revenus
- Signal du PDG (1er juin) : « Notre feuille de route est fortement axée sur les données » → l'investissement dans la qualité des données est stratégique

Fréquence : 1 offre d'emploi récente + 1 avis + contexte stratégique = priorité émergente
Urgence : **Moyenne** — Nouvellement prioritaire (recrutement aujourd'hui), mais pas encore mature ; deviendra cependant critique dans 60 jours
Votre point d'accroche (dbt + outils de qualité des données) : « Vous venez d'ajouter un rôle d'Ingénieur qualité des données. Cela signifie que la précision des données est maintenant à l'ordre du jour exécutif (probablement déclenché par votre expansion UE + feuille de route de personnalisation). La partie la plus difficile de la qualité des données n'est pas la surveillance — c'est d'empêcher les mauvaises données d'entrer dans votre pipeline en premier lieu. La plupart des plateformes ajoutent la surveillance après coup. [Votre outil] prévient les problèmes en amont. »

---

#### Couche 5 : Empreinte sociale

**PDG (Sarah Chen) activité LinkedIn :**
- Niveau d'activité : 2–3 publications par semaine (engagement élevé)
- Contenu : Jalons de l'entreprise (financement, embauches), tendances sectorielles (plateformes de données, personnalisation), culture
- Engagement : ~100–200 likes par publication, commentaires de figures sectorielles
- Dernière activité : 1er juin 2026 (actif aujourd'hui)
- Verdict : **Leader éclairé, très visible, réceptif aux tendances sectorielles**

**VP Données (Alex Rodriguez) LinkedIn :**
- Niveau d'activité : 3–4 publications par semaine (très actif)
- Contenu : Ingénierie des données, conseils de carrière, astuces Snowflake/dbt, points de vue personnels sur les outils de données
- Engagement : ~50–150 likes, répond aux commentaires
- Dernière activité : 1er juin 2026 (actif)
- Connexions : ~2 500 (réseau sectoriel solide)
- Verdict : **Très engagé dans la communauté d'ingénierie des données, probablement réceptif aux messages entrants de leaders éclairés**

**CTO (Marcus Williams) LinkedIn :**
- Niveau d'activité : 1 publication par mois (moins visible)
- Contenu : Réussites d'ingénierie, annonces d'embauche
- Dernière activité : 28 mai 2026
- Verdict : **Moins visible, mais répond aux commentaires (pas dormant)**

---

### Résultat du dossier de compte

```
## TechRetail Inc. — Dossier d'intelligence de compte

### Vue d'ensemble de l'entreprise
TechRetail Inc. est une plateforme e-commerce d'environ 450 personnes spécialisée dans les données client et la personnalisation, avec des clients dans les secteurs retail et CPG. Ils viennent de clôturer une Série B de 25 M$ (mai 2026) pour s'étendre sur les marchés européens et renforcer leur infrastructure de données — créant une fenêtre de déploiement de capital active de 90 jours.

### Cartographie des décideurs

**Acheteur économique :** David Park, VP Finance
- Propriétaire P&L : budget d'infrastructure de données + dépenses technologiques
- Dernière activité sur LinkedIn : 30 mai 2026 (publie 1–2 fois par mois sur les finances/opérations)
- Signal : Assez actif pour voir les prospections à froid ; Finance contrôle le budget données/infrastructure

**Champion :** Alex Rodriguez, VP Données & Analytique
- Utilise les outils d'orchestration + de transformation des données quotidiennement ; OKR liés à la vélocité + qualité du pipeline de données
- Dernière activité sur LinkedIn : 1er juin 2026 (publie 3–4 fois par semaine, très engagé)
- Signal : Très engagé dans la communauté d'ingénierie des données ; lira probablement les messages entrants de pairs ou de fournisseurs ; peut influencer la décision d'achat vers le haut jusqu'aux finances

**Influenceur :** Marcus Williams, CTO
- Peut bloquer/accélérer : décisions d'architecture, pratiques d'ingénierie ; dernier mot sur l'intégration de la plateforme
- Dernière activité sur LinkedIn : 28 mai 2026 (activité plus faible, mais engagé quand actif)
- Signal : La récente embauche de directeur en ingénierie des données (Jamie Kim) lui rapporte ; son adhésion est requise pour la mise en œuvre

---

### Couche 2 : Événements récents (signaux de dynamique)

- **15 mai 2026 (Financement Série B) :** 25 M$ de financement Série B pour l'expansion UE + renforcement de l'infrastructure de données
  - Implication : Capital alloué pour l'investissement en infrastructure ; fenêtre de dépense de 90 jours probablement active ; cycle budgétaire réinitialisé
  - Source : [company-linkedin-post]

- **22 mai 2026 (Embauche de directeur) :** Jamie Kim embauchée comme Directrice de l'ingénierie des données (ex-[Entreprise précédente], 10 ans d'expérience en plateforme de données)
  - Implication : L'entreprise accélère le développement de la plateforme de données ; les problèmes d'opérations/mise à l'échelle sont directement adressés ; la nouvelle directrice évaluera les outils
  - Source : [alex-rodriguez-linkedin-post]

- **1er juin 2026 (Nouveau rôle qualité des données) :** Rôle d'Ingénieur qualité des données publié ; la description du poste indique « Nous construisons de nouveaux processus de surveillance »
  - Implication : La qualité des données est maintenant une priorité critique pour l'entreprise (probablement expansion UE + précision des données pour la personnalisation) ; stack de surveillance en cours de construction
  - Source : [techretail-careers-page]

- **8 mai 2026 (Succès interne) :** Étude de cas publiée sur la réduction du temps de traitement des données de 40%
  - Implication : L'entreprise est axée sur les données ; célèbre publiquement les gains d'efficacité ; ouverte aux améliorations de processus
  - Source : [company-blog]

- **1er juin 2026 (Recherche d'outils par le PDG) :** Sarah Chen (PDG) a repartagé un article TechCrunch sur « L'avenir des plateformes de données client » avec le commentaire : « Cela résonne — notre feuille de route est fortement axée sur les données »
  - Implication : Le PDG recherche activement les tendances en matière de plateformes de données ; l'infrastructure de données est une priorité stratégique
  - Source : [sarah-chen-linkedin]

---

### Couche 3 : Stack technologique et lacunes

**Stack actuelle (vérifiée par BuiltWith + offres d'emploi + LinkedIn) :**
- **Entrepôt de données :** Snowflake (principal)
- **Orchestration :** Apache Airflow (principal), scripts Python personnalisés
- **Transformation :** dbt (récemment adopté ; recrutement pour le rôle « Ingénieur analytique »)
- **Analytique/BI :** Looker
- **Données client :** Segment, Mixpanel
- **CRM :** Salesforce

**Lacunes identifiées :**

1. **Évolutivité de l'orchestration + opérations :** Utilise Airflow open-source avec une surcharge opérationnelle élevée. L'offre d'emploi pour « Responsable de l'infrastructure de données » mentionne explicitement « réduire la surcharge opérationnelle » et « mettre à l'échelle les clusters Snowflake ». Les avis G2 d'entreprises similaires notent « des déploiements de 2+ heures » et des « lacunes de surveillance ». Aucune solution d'orchestration gérée en place (pas de Fivetran, Airbyte, Prefect, Dagster ou dbt Cloud observé).
   - Implication de la lacune : Ils le construisent en interne aujourd'hui ; le capital Série B en fait un acheteur maintenant

2. **Intégration dbt + gouvernance :** Récemment recruté pour le rôle « Ingénieur analytique », mais dbt n'est pas encore intégré à Airflow à grande échelle. L'avis G2 note « des fragments de scripts Python + des modèles dbt + des DAGs Airflow — difficile de suivre les dépendances. »
   - Implication de la lacune : La stack de données multi-outils nécessite une couche d'intégration ; le suivi des dépendances est cassé

3. **Observabilité de la qualité des données :** Nouveau rôle « Ingénieur qualité des données » ; la description du poste indique explicitement « construction de nouveaux processus de surveillance ». L'avis G2 note « manque d'une bonne surveillance ».
   - Implication de la lacune : La qualité des données est nouvellement prioritaire ; la stack de surveillance est en cours de construction ; acheteur d'outils d'observabilité maintenant

**Friction d'intégration :**
- Snowflake + Airflow : Intégration manuelle, surveillance via les journaux Airflow (limité)
- Airflow + dbt : Pas d'intégration native ; nécessite une orchestration personnalisée
- dbt + Snowflake : Fonctionne, mais la mise à l'échelle nécessite une gouvernance (suivi des modèles, lignée)

---

### Couche 4 : Signaux de douleur (Top 3)

**Signal de douleur #1 : Surcharge opérationnelle Airflow + évolutivité**

Preuves :
- Offre d'emploi (20 mai) : « Ingénieur senior en données requis : Airflow ou orchestration similaire. Apprécié : expérience dbt » → signale l'utilisation actuelle d'Airflow, intérêt pour les alternatives
- Offre d'emploi (10 mai) : « Responsable de l'infrastructure de données — Propriétaire de la feuille de route de la plateforme de données. Doit avoir de l'expérience dans la mise à l'échelle des clusters Snowflake + réduction des coûts » → douleur explicite de coût + mise à l'échelle
- Avis G2 (filtrés par taille d'entreprise + e-commerce) :
  - Mai 2026 : « Les déploiements prennent 2+ heures, le débogage des travaux échoués est pénible »
  - Avril 2026 : « Courbe d'apprentissage raide, manque de surveillance »
- Contexte de la nouvelle embauche : Jamie Kim (Directrice de l'ingénierie des données, embauchée le 22 mai) avec un parcours dans « la mise à l'échelle des plateformes de données » dans son entreprise précédente → signale que cette douleur était une exigence d'embauche

Fréquence : Mentionné dans 3 offres d'emploi + 2 avis G2 = consensus élevé
Urgence : **Élevée** — Nouveau directeur embauché pour résoudre ; capital Série B alloué ; offres d'emploi récentes
Votre point d'accroche : « Votre calcul Série B ne fonctionne pas si 2 heures de chaque journée de déploiement sont consacrées aux opérations Airflow. Votre nouvelle Directrice de l'ingénierie des données (Jamie Kim, d'après son parcours) va probablement évaluer des solutions d'orchestration qui réduisent la surcharge opérationnelle de 50%+ au cours du T3. Une plateforme gérée permet à votre équipe de se concentrer sur la stratégie de données, pas sur l'infrastructure. »

---

**Signal de douleur #2 : Fragmentation de la stack de données multi-outils + suivi des dépendances**

Preuves :
- Offre d'emploi (28 mai) : « Ingénieur analytique — Transformer les données avec SQL, dbt, Snowflake » → signale l'adoption de dbt mais pas encore mature
- Offre d'emploi (20 mai) : « Ingénieur senior en données — Airflow ou similaire + dbt apprécié » → signale la coexistence de deux approches de transformation
- Avis G2 (mai 2026) : « Nous avons des scripts Python, des modèles dbt et des DAGs Airflow — difficile de suivre les dépendances. L'intégration entre les outils nécessite des améliorations »
- Offre d'emploi (1er juin, Ingénieur qualité des données) : « Prendre en charge la qualité et les tests des données » → signale qu'ils veulent centraliser la qualité, mais la stack actuelle est fragmentée

Fréquence : Plusieurs offres d'emploi + 1 avis détaillé = modèle clair
Urgence : **Moyenne-élevée** — Ils recrutent activement pour résoudre cela (rôle d'Ingénieur analytique), mais pas encore critique
Votre point d'accroche : « Vous construisez une stack moderne (dbt + Snowflake), mais votre couche d'orchestration n'a pas été conçue pour cela. Vous avez une logique de transformation dispersée entre des scripts Python, dbt et Airflow. Consolider sur une plateforme qui synchronise les trois réduit votre dette de suivi des dépendances de 70% et rend votre gouvernance des données évolutive. »

---

**Signal de douleur #3 : Qualité des données + observabilité (nouvelle priorité critique)**

Preuves :
- Offre d'emploi (1er juin) : « Ingénieur qualité des données — Nous construisons de nouveaux processus de surveillance » (nouveau rôle, publication récente)
- Avis G2 (avril 2026) : « Nous manquons d'une bonne surveillance. Transition vers Airflow, mais la stratégie de surveillance n'est pas établie »
- Contexte : Expansion Série B vers l'UE + focus personnalisation = la précision des données impacte directement l'expérience client + les revenus
- Signal du PDG (1er juin) : « Notre feuille de route est fortement axée sur les données » → l'investissement dans la qualité des données est stratégique

Fréquence : 1 offre d'emploi récente + 1 avis + contexte stratégique = priorité émergente
Urgence : **Moyenne** — Nouvellement prioritaire (recrutement aujourd'hui), mais pas encore mature ; deviendra cependant critique dans 60 jours
Votre point d'accroche : « Vous venez d'ajouter un rôle d'Ingénieur qualité des données. Cela signifie que la précision des données est maintenant à l'ordre du jour exécutif (probablement déclenché par votre expansion UE + feuille de route de personnalisation). La partie la plus difficile de la qualité des données n'est pas la surveillance — c'est d'empêcher les mauvaises données d'entrer dans votre pipeline en premier lieu. La plupart des plateformes ajoutent la surveillance après coup. [Votre outil] prévient les problèmes en amont. »

---

### Meilleur point d'accroche de personnalisation

**Utiliser le capital Série B + la nouvelle embauche de directeur comme vecteur d'entrée. Mener avec le parcours de Jamie Kim comme preuve sociale.**

**Ouverture recommandée :**
« Alex, j'ai remarqué que TechRetail vient d'embaucher Jamie Kim comme Directrice de l'ingénierie des données (félicitations à l'équipe). Son parcours chez [Entreprise précédente] consistait à construire des plateformes de données qui sont passées d'Airflow à 10 milliards+ d'événements/jour. Je suppose que c'est en partie pourquoi elle est là — pour relever les mêmes défis d'évolutivité que vous rencontrez post-Série B. Nous aidons des équipes d'ingénierie comme la vôtre à réduire la surcharge opérationnelle Airflow de 50%+ tout en préservant vos investissements dbt + Snowflake. J'aimerais partager comment [entreprise similaire de sa taille] a résolu cela au T2. Avez-vous 20 minutes la semaine prochaine ? »

**Points d'accroche alternatifs (par ordre de priorité) :**
1. **Point d'accroche actualité :** « L'expansion Série B vers l'UE nécessite une précision des données à grande échelle. Votre nouveau rôle d'Ingénieur qualité des données confirme que c'est à votre ordre du jour. Voici comment [entreprise] gère les contrôles de qualité des données en amont... »
2. **Point d'accroche technologique :** « Vos offres d'emploi montrent que vous recrutez pour dbt + Airflow. La partie délicate — et la raison pour laquelle la plupart des équipes atteignent des murs d'évolutivité — est d'intégrer les deux sans embaucher une équipe de plateforme. [Votre outil] résout cela... »
3. **Point d'accroche coût :** « Votre rôle de 'Responsable de l'infrastructure de données' mentionne la réduction des coûts Snowflake. La plupart des équipes atteignent un mur : les déploiements Airflow deviennent plus lents, les requêtes dbt s'allongent, les coûts grimpent. [Votre outil] est conçu pour faire fonctionner les deux efficacement... »

---

### Premier canal recommandé

**InMail LinkedIn à Alex Rodriguez, VP Données**

**Pourquoi :** 
- Il est très actif (3–4 publications par semaine, dernière activité aujourd'hui), donc susceptible d'ouvrir + lire l'InMail
- En tant que VP Données, il est propriétaire de la douleur quotidienne (opérations d'orchestration, gouvernance de la transformation)
- Il n'est *pas* l'acheteur économique (David Park, VP Finance l'est), mais il est le Champion qui peut planifier une réunion et influencer vers le haut
- Aller directement à l'acheteur économique (David Park) court-circuite le champion ; moins chaleureux, nécessite une preuve sociale de niveau PDG
- L'e-mail (froid) est possible, mais son engagement LinkedIn suggère que l'InMail surperformera

**Pourquoi pas les alternatives :**
- E-mail (introduction chaleureuse) : Plus rapide si vous avez une connexion mutuelle, mais pas de preuve ; l'InMail LinkedIn est plus chaleureux
- Message LinkedIn : L'InMail a une intention plus élevée du point de vue du fournisseur ; montre que vous respectez leur temps
- Prospection de l'influenceur (Marcus Williams, CTO) : Il est moins actif ; Alex est le public plus réceptif

---

### Cadre recommandé

**Cadre « déclenché par un événement » avec preuve sociale par les pairs**

**Pourquoi ce cadre :**
1. **Déclencheur d'événement :** Série B + nouvelle embauche de directeur = preuve d'appétit pour le changement et d'allocation budgétaire
2. **Preuve sociale par les pairs :** Vous avez un client de taille/stade similaire dans l'e-commerce ou l'infrastructure de données qui a résolu cela post-Série B ; cette entreprise devient votre référence
3. **Crédibilité :** La nouvelle directrice (Jamie Kim) voudra évaluer les solutions rapidement ; avoir des études de cas de son réseau de pairs accélère le cycle de transaction

**Exécution :**
- **Premier contact (InMail à Alex) :** Point d'accroche actualités (Série B) + nouvelle embauche de directeur comme preuve qu'ils se soucient de ce problème + étude de cas client de référence (si vous en avez une en e-commerce/infrastructure de données à une échelle similaire)
  - Longueur du message : 40 mots max + un lien vers l'étude de cas
  - Objectif : Obtenir un appel de découverte de 20 minutes
- **Appel de découverte avec Alex + Jamie Kim :** Cadre MEDDIC (comprendre le budget, les parties prenantes, le calendrier lié à la fenêtre de capital Série B)
  - Clé : Jamie Kim sera probablement propriétaire de l'évaluation ; s'aligner sur la preuve technique (démo scénario dbt + Snowflake)
- **Clôture :** Cadre ROI (réduire la surcharge opérationnelle + les coûts Snowflake)
  - Benchmark : « La plupart des clients voient une réduction de 50%+ de la surcharge opérationnelle dans les 90 premiers jours + des économies de coûts Snowflake de 20–30% »

---

### Qualité des données et notation de confiance

- **Fraîcheur des données :** Recherche complétée le 2 juin 2026 (à jour à ce jour)
- **Confiance dans la cartographie des décideurs :** **Élevée**
  - Alex Rodriguez confirmé via LinkedIn en tant que VP Données (sources multiples : page de l'entreprise, LinkedIn personnel, contexte des offres d'emploi)
  - David Park confirmé via LinkedIn en tant que VP Finance (page de l'entreprise + modèles de publications financières)
  - Marcus Williams confirmé en tant que CTO (page de l'entreprise, Jamie Kim lui rapporte)
  - Les trois confirmés actifs dans les 3 derniers jours
- **Confiance dans la force du signal de douleur :** **Élevée**
  - Douleur Airflow : 3 offres d'emploi + 2 avis G2 récents + nouvelle embauche de directeur = très haute confiance
  - Douleur d'intégration dbt : 2 offres d'emploi + 1 avis + signal d'embauche = haute confiance
  - Douleur qualité des données : 1 offre d'emploi récente + 1 avis + contexte stratégique (expansion UE) = confiance moyenne-élevée
- **Prochaine étape recommandée :** **Prêt pour la prospection chaleureuse**
  - Timing Série B + embauches récentes + décideurs actifs = fenêtre à haute intention (30–60 jours avant que le capital ne soit déployé ailleurs)
  - Priorité : InMail à Alex Rodriguez dans les 48 heures
  - Secondaire : Obtenir une introduction chaleureuse à Jamie Kim via une connexion mutuelle si disponible (réduit le risque de la conversation technique)
```

---

## Notes pour les praticiens

1. **Recherche Niveau 1 à l'échelle entreprise :** Si l'entreprise compte >2 000 employés, vous devrez peut-être ajouter une couche « Sponsor » (introducteur au niveau directeur pour l'Acheteur économique). À cette échelle, contacter directement le CFO à froid est moins efficace que passer par un sponsor de confiance.

2. **Adapter le modèle de dossier à votre produit :** Le modèle ci-dessus est générique. Pour votre cas d'utilisation (quel que soit le produit que vous vendez), remplacez les puces « Votre point d'accroche » par votre proposition de valeur spécifique. Exemples :
   - Si vous vendez une plateforme de données (Fivetran) : Mettez l'accent sur « orchestration gérée + réduction des coûts »
   - Si vous vendez dbt Cloud : Mettez l'accent sur « gouvernance dbt + suivi des dépendances »
   - Si vous vendez des outils de qualité des données (tests dbt + Great Expectations) : Mettez l'accent sur « prévenir les mauvaises données en amont »

3. **Quand re-rechercher :** Mettre à jour ce dossier si (a) l'entreprise lève de nouveaux fonds, (b) un décideur clé part/rejoint, (c) nouveau lancement de produit ou pivot, (d) actualités majeures (acquisition, dépôt public). Sinon, le dossier est valide pendant 60 jours.

4. **Entreprise unique vs. liste de comptes :** Utiliser le Niveau 1 pour les transactions nommées ; utiliser les Niveaux 2/3 pour les listes de comptes. Si vous travaillez sur une liste de 100 comptes, exécutez tous les 100 en Niveau 3 d'abord (identifie les fruits à portée de main), puis montez les 10–15 meilleurs en Niveau 1 pour une recherche plus approfondie.

5. **La recherche comme qualification :** Les signaux de douleur doivent informer la logique de qualification. Si vous voyez <3 signaux de douleur après l'analyse de la couche 4, l'entreprise peut être un mauvais fit (ne rencontre pas les problèmes que votre produit résout). Envisager de la déprioritiser jusqu'à ce que les signaux deviennent plus clairs.
