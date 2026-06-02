# Catégories de Prospection

## Quand activer

Lorsque vous devez déterminer quelle stratégie de messagerie déployer pour une cohorte de prospects ou de leads donnée. Utilisez ce cadre pour :
- Classifier les sources de leads entrantes, postbound, bridgebound ou sortantes
- Fixer les attentes de taux de réponse avant le lancement d'une campagne
- Planifier la longueur de la séquence et le nombre de contacts en fonction de la force du signal d'intention
- Ajuster le ton de la messagerie et la profondeur de la personnalisation en conséquence
- Assigner les tags CRM pour le reporting et la logique de suivi

Activez cette compétence au moment où vous vous apprêtez à rédiger votre premier message de prospection ou à planifier une séquence multi-contacts.

## Quand NE PAS utiliser

N'utilisez pas ce cadre pour :
- Justifier une messagerie standard qui ignore les différences de catégories (par exemple, utiliser une copie sortante froide pour des leads entrants)
- Ignorer la préférence déclarée d'un prospect ou un signal de non-opt par des séquences plus agressives
- Ignorer la vérification de l'assignation de catégorie (par exemple, supposer qu'un « téléchargement de contact » est entrant sans vérifier la source)
- Appliquer des benchmarks à des séquences dépourvues de qualité de liste appropriée ou de suivi de page d'atterrissage
- Mélanger des catégories dans une seule séquence sans resegmentation

## Instructions

### Le Cadre ColdIQ : Quatre Catégories de Sources de Leads

#### 1. ENTRANT — Signal d'intention actif

**Définition :** Le prospect a initié le contact. Il a rempli un formulaire (demande de démo, inscription à un essai, téléchargement de contenu gardienné), a planifié un appel ou vous a contacté directement.

**Caractéristiques :**
- Intention la plus élevée
- Ils se sont auto-sélectionnés dans votre entonnoir
- Vous avez un contexte clair pour leur demande (par exemple, titre d'emploi, taille d'entreprise, intérêt pour une fonctionnalité)
- Aucune présentation froide nécessaire

**Attentes de taux de réponse :** 25–40 %

**Stratégie de messagerie :**
- Reconnaître leur action : « Merci d'avoir signé pour l'essai » ou « J'ai vu que vous vous êtes inscrit à la démo »
- Confirmer leur douleur ou leur cas d'utilisation : « Je suppose que vous cherchez à [problème spécifique qu'ils ont probablement] »
- Proposer une prochaine étape (appel, onboarding, mise en place du produit) : « Je veux m'assurer que vous tirez le meilleur parti de cela. Pouvons-nous avoir un appel de 15 minutes mardi ? »
- Ton : chaleureux, réactif, affirmé (ils sont prêts)

**Longueur de la séquence :** Maximum 2 contacts
- Contact 1 : Dans les 5 minutes (automatisation ou humain)
- Contact 2 : 24–48 heures si pas de réponse (léger ré-engagement, pas de pitch de vente)

**Convention d'étiquetage CRM :**
```
Source: Entrant | Catégorie: {Demande de Démo | Inscription Essai | Téléchargement Contenu | Référence (entrant)}
Niveau d'Intention: Élevé
SLA de Réponse: 5 minutes
```

**Note ATL vs. BTL :** Les leads entrants sont gagnés par l'investissement en haut d'entonnoir (contenu, publicités payantes, SEO organique, marque). Une fois arrivés, le suivi BTL (1-on-1) est approprié et attendu. Budgétisez en conséquence : une dépense ATL élevée justifie une réponse commerciale à haut contact.

---

#### 2. POSTBOUND — Engagé avec votre contenu

**Définition :** Le prospect a démontré son engagement envers vos médias possédés ou campagnes sans demander directement le contact. Il a regardé un webinaire, lu un article de blog, cliqué sur un lien suivi dans un e-mail, téléchargé un rapport ou a assisté à votre événement.

**Caractéristiques :**
- Signal chaud, mais pas encore une demande de contact
- Vous savez quel contenu a déclenché l'engagement
- Ils ont montré un intérêt pour un sujet ou une zone de douleur spécifique
- Intention inférieure à l'entrant, mais beaucoup plus élevée que la prospection froide sortante

**Attentes de taux de réponse :** 8–15 %

**Stratégie de messagerie :**
- Référencer le contenu spécifique avec lequel ils se sont engagés : « J'ai remarqué que vous avez regardé notre webinaire 'Scaling Sales Ops' la semaine dernière »
- Relier leur engagement à leur situation probable : « La plupart des gens de votre rôle regardent cela parce que [raison commune]. C'est vous ? »
- CTA doux, pas un pitch de démo : « Cela vaut-il 15 minutes pour explorer ce que nous voyons dans votre secteur ? »
- Ton : informé, conversationnel, basé sur la permission (vous n'êtes pas froid ; vous suivez un signal)

**Longueur de la séquence :** 3 contacts
- Contact 1 : Dans les 48 heures de la détection d'engagement (pendant que c'est chaud)
- Contact 2 : 5–7 jours plus tard (angle alternatif ou nouveau contenu)
- Contact 3 : 10–14 jours (vérification finale « sans pression »)

**Convention d'étiquetage CRM :**
```
Source: Postbound | Catégorie: {Webinaire | Blog | Clic Email | Événement | Téléchargement Rapport}
Date d'Engagement: {timestamp}
Contenu Consommé: {titre}
Niveau d'Intention: Moyen
```

**Note ATL vs. BTL :** Les leads postbound sont les résultats des campagnes de demand gen. Vous avez déjà investi dans l'actif de contenu ; la séquence de suivi coûte moins cher que la prospection froide sortante mais devrait toujours être ciblée et respectueuse du timing.

---

#### 3. BRIDGEBOUND — Signal de tiers

**Définition :** Un tiers neutre (ni le prospect, ni vous directement) a créé un point de connexion. Exemples : visiteur du site d'avis G2, référence client actuelle ou partenaire, examinateur de produit concurrent, liste d'assistants de conférence, connexion LinkedIn, réseau mutuel.

**Caractéristiques :**
- Intention moyenne : le signal existe, mais le prospect ne s'est pas auto-sélectionné dans votre entonnoir
- Vous pouvez nommer le pont explicitement, ce qui crée de la crédibilité
- La pertinence doit être établie, non supposée
- Potentiel de preuve sociale puissant

**Attentes de taux de réponse :** 5–12 %

**Stratégie de messagerie :**
- Nommer le pont explicitement dans votre première ligne : « J'ai remarqué que vous avez laissé un avis sur G2 pour [concurrent] » ou « Sarah Chen vous a recommandé à moi » ou « Je vous ai vu dans la liste des assistants pour SaaS North »
- Établir la pertinence sans surdimensionner : « Parce que vous évaluez [catégorie de produit], j'ai pensé qu'il serait logique de vous contacter »
- Proposer un échange de valeur spécifique et à faible friction : « J'ai travaillé avec [X entreprise similaire], et ils ont fait face à [bloqueur spécifique]. Heureux de partager ce qui a fonctionné »
- Ton : crédible, spécifique, axé sur la valeur (pas agressif)

**Longueur de la séquence :** 3 contacts
- Contact 1 : Dans les 24 heures (le pont est le plus frais)
- Contact 2 : 6–8 jours plus tard (nouvel angle ou insight sectoriel)
- Contact 3 : 12–15 jours (vérification douce finale)

**Convention d'étiquetage CRM :**
```
Source: Bridgebound | Catégorie: {Examinateur G2 | Référence | Client du Concurrent | Conférence | LinkedIn}
Source du Pont: {nom ou entreprise}
Niveau de Crédibilité: {nom de la connexion mutuelle ou tiers}
Niveau d'Intention: Moyen
```

**Note ATL vs. BTL :** Les leads bridgebound proviennent souvent d'aucune dépense payante (références, avis organiques, conférences déjà budgétisées). Le suivi a un ROI élevé car vous tirez parti de la preuve sociale existante. Investissez dans la personnalisation ici.

---

#### 4. SORTANT — Purement proactif, aucun signal antérieur

**Définition :** Vous avez initié le contact sans engagement antérieur, signal ou référence. E-mail froid, appel froid, message LinkedIn froid.

**Caractéristiques :**
- Intention la plus basse : le prospect n'avait aucune raison d'attendre ou de vouloir votre message
- Friction la plus élevée à surmonter
- Nécessite une personnalisation basée sur un déclencheur ou un cadrage orienté vers la douleur
- Taux de réponse les plus bas ; effort maximal par réponse

**Attentes de taux de réponse :** 2–5 %

**Stratégie de messagerie :**
- Commencez par le déclencheur ou la douleur, pas votre produit : « J'ai remarqué que vous avez tout juste lancé un produit dans [catégorie]. Cela signifie généralement [point de douleur] » ou « Déclencheur basé sur le rôle : la plupart des nouvelles embauches Directeur des Ventes font face à [bloqueur spécifique de 30 jours] »
- Éviter les ouvertures génériques (« Je suis tombé sur votre profil ») ; utiliser la spécificité : « Vous avez récemment [action d'entreprise spécifique], ce qui me dit que vous êtes probablement… »
- Proposer une micro-valeur en premier, pas une démo : « J'ai créé un résumé de 2 minutes sur la façon dont [entreprise similaire] a résolu [votre bloqueur]. Vous voulez le voir ? »
- Ton : direct, pertinent, humble par rapport à la nature froide (« Je sais que cela vous arrive sans prévenir, mais… »)

**Longueur de la séquence :** 4 contacts (les séquences froides nécessitent plus de répétition)
- Contact 1 : Amorce initiale (Jour 1)
- Contact 2 : Angle alternatif ou preuve sociale (Jour 4–5)
- Contact 3 : Format différent ou nouvel insight (Jour 8–10)
- Contact 4 : Final « sans pression » + CTA alternatif (Jour 14–16)
- Multiplicateur d'effort : 3 fois plus d'effort par message que l'entrant (prévoir 10–15 min par message sortant vs. 3–5 min pour l'entrant)

**Convention d'étiquetage CRM :**
```
Source: Sortant | Catégorie: {Email Froid | Appel Froid | Prospection LinkedIn}
Déclencheur Utilisé: {déclencheur spécifique ou point de douleur}
Séquence: {1 of 4, 2 of 4, etc.}
Niveau d'Intention: Faible
```

**Note ATL vs. BTL :** Sortant est pur BTL. Vous ne tirez parti d'aucune dépense ATL ou pull entrant. Cela signifie :
- Le ROI dépend de la qualité de la liste, de la précision du déclencheur et de la compétence en copywriting
- L'échelle est limitée par votre capacité à personnaliser et à maintenir la délivrabilité
- Considérez le volume seulement après avoir testé et maintenu un taux de réponse de 3–5 % sur un segment de 100 personnes
- Le coût mixte par dollar de pipeline dépasse souvent l'entrant ou le postbound ; utilisez-le stratégiquement

---

### Arbre de Décision : Classifier Votre Lead

```
Le prospect a-t-il une demande claire ou une action liée à votre marque ?
├─ OUI → Est-ce une demande directe (formulaire, appel, message) ?
│  ├─ OUI → ENTRANT [taux de réponse de 25-40 %, 2 contacts, SLA de 5 min]
│  └─ NON → Se sont-ils engagés avec votre contenu en premier ?
│     └─ OUI → POSTBOUND [taux de réponse de 8-15 %, 3 contacts, suivi dans 48 h]
└─ NON → Un tiers a-t-il recommandé ou créé un point de connexion ?
   ├─ OUI → Pouvez-vous nommer le pont de manière crédible ?
   │  └─ OUI → BRIDGEBOUND [taux de réponse de 5-12 %, 3 contacts, suivi dans 24 h]
   └─ NON → SORTANT [taux de réponse de 2-5 %, 4 contacts, basé sur le déclencheur]
```

---

### Convention d'Étiquetage CRM (Unifié)

Pour l'analytique et le routage de séquence, utilisez cette structure :

**Tag principal :** `Source: {Entrant | Postbound | Bridgebound | Sortant}`

**Tags secondaires (sous-type de catégorie) :**
- Entrant: `Demande de Démo` | `Inscription Essai` | `Téléchargement Contenu (gardienné)` | `Référence Entrant`
- Postbound: `Webinaire` | `Blog` | `Clic Email` | `Événement` | `Téléchargement Rapport` | `Essai Produit`
- Bridgebound: `Examinateur G2` | `Référence Payante` | `Référence Organique` | `Client du Concurrent` | `Conférence` | `LinkedIn` | `Liste Sectorielle`
- Sortant: `Email Froid` | `Appel Froid` | `Prospection LinkedIn` | `Liste Payante` | `Prospection Basée sur les Comptes`

**Tag tertiaire (niveau d'intention) :**
- `Intention: Élevée` (Entrant)
- `Intention: Moyenne` (Postbound, Bridgebound)
- `Intention: Faible` (Sortant)

**Tag d'étape de séquence :**
- `Séquence: 1 de {2|3|4}` (pour le suivi du nombre de contacts et le routage d'automatisation)

---

### Benchmarking Votre Campagne

Avant de lancer, fixez les attentes :

| Catégorie | Taux de Réponse | Temps Moyen de Réponse | Longueur de Séquence | Coût par Réponse | Notes |
|----------|------------|-------------------|-----------------|-------------------|-------|
| Entrant | 25–40% | <1 heure | 2 | $0–5 (exécution seulement) | Conversion la plus rapide, intention la plus élevée |
| Postbound | 8–15% | 24–48 heures | 3 | $5–15 (contenu + suivi) | Contenu déjà payé |
| Bridgebound | 5–12% | 24–72 heures | 3 | $10–20 (personnalisation + recherche) | La crédibilité du pont est clé |
| Sortant | 2–5% | 48–168 heures | 4 | $20–50 (effort élevé + coût de liste) | Nécessite 3 fois plus d'effort de personnalisation |

---

### Prompts de Modèle de Messagerie par Catégorie

#### Prompt de modèle Entrant :
```
Rédigez un message de suivi pour un prospect qui {action spécifique: demande de démo, inscription essai, etc.}.
Contexte: {pourquoi ils ont probablement demandé cela, leur titre d'emploi, taille d'entreprise}.
Objectif: Confirmer leur douleur, proposer un appel de 15 min.
Ton: chaleureux, réactif, affirmé qu'ils sont prêts à parler.
Longueur: 2–3 phrases max.
```

#### Prompt de modèle Postbound :
```
Rédigez un message de prospection pour un prospect qui {type de contenu consommé: regardé webinaire, lu article blog, etc.}.
Titre du contenu: {titre}.
Indicateur d'engagement: {temps de visualisation, téléchargement, clic de lien}.
Objectif: Relier leur engagement à leur situation probable ; proposer une conversation.
Éviter: Faire le pitch du produit. À la place, demander si le contenu a résonné.
Ton: informé, conversationnel, basé sur la permission.
Longueur: 4–5 phrases.
```

#### Prompt de modèle Bridgebound :
```
Rédigez un message de prospection pour un prospect que vous avez trouvé via {source du pont: avis G2, référence de X, assistant de conférence}.
Comment ils sont pertinents: {raison spécifique pour laquelle ils correspondent à votre ICP}.
Le pont: {nommez le pont explicitement dans la première phrase}.
Objectif: Établir la crédibilité, proposer une conversation de valeur de 15 min.
Ton: crédible, spécifique, pas agressif.
Longueur: 5–6 phrases.
```

#### Prompt de modèle Sortant :
```
Rédigez un message de prospection froide pour un prospect à {entreprise}.
Son déclencheur: {action d'entreprise spécifique, douleur basée sur le rôle ou tendance sectorielle}.
Votre angle unique: {pourquoi vous, pas un concurrent}.
Objectif: Commencer par la douleur ou le déclencheur, proposer un échange de micro-valeur (insight 1 min, résumé 2 min, etc.).
Éviter: « Je suis tombé sur votre profil. » Utilisez la spécificité à la place.
Ton: direct, humble par rapport au fait d'être froid, axé sur la valeur.
Longueur: 6–8 phrases. Effort: personnalisation élevée requise.
```

---

### Matrice d'Ajustement : ATL (Above-the-Line) vs. BTL (Below-the-Line)

Utilisez cette matrice pour allouer votre budget commercial et marketing :

| Catégorie | Investissement ATL | Investissement BTL | Approche Mixte |
|----------|---|---|---|
| **Entrant** | Élevé (publicités payantes, contenu, SEO) | Moyen (suivi 1-on-1, support commercial) | Stratégie pull : investir fortement en ATL, adapter BTL au volume |
| **Postbound** | Moyen (contenu possédé, e-mail, événements) | Moyen (séquences de suivi ciblées) | Stratégie de nurture : utiliser demand gen pour réchauffer les leads, puis commercial léger |
| **Bridgebound** | Faible à Moyen (partenaire, événements, avis) | Moyen (prospection personnalisée, construction de relation) | Stratégie de leverage : les ponts gratuits ou organiques obtiennent un effort commercial de niveau moyen |
| **Sortant** | Aucun (purement commercial) | Élevé (personnalisation, recherche, appels) | Stratégie push : tout investissement est temps commercial et coût de liste |

---

## Exemple

### Scénario : Plateforme SaaS d'Opérations Commerciales, Planification Campagne Trimestrielle

**Votre produit :** Plateforme d'automatisation des opérations commerciales ciblant les VP/Directeurs des Ventes.

**Objectif de la campagne :** Générer 20 nouvelles opportunités en Q3.

**Répartition des sources de leads :**
- 40 leads entrants (demandes de démo)
- 150 leads postbound (spectateurs de webinaire de votre série « Scale Sales Ops » en 3 parties)
- 30 leads bridgebound (examinateurs G2 de votre concurrent)
- 200 leads sortants (e-mail froid aux Directeurs des Ventes dans les entreprises financées en Série A–C)

---

### Exécution par Catégorie :

**ENTRANT (40 leads) :**
- Réponses attendues : 40 × 30% (conservateur) = **12 réponses**
- Séquence : 2 contacts
  - Contact 1 (automatisé) : Dans les 5 minutes de la soumission du formulaire. « Merci d'avoir demandé la démo. Voici votre heure programmée : [lien]. Je vous réserverai une place. »
  - Contact 2 (humain, si pas de présence) : 24 heures avant l'appel programmé. « J'ai hâte de discuter demain. Voici une courte vidéo de 2 minutes sur ce que nous couvrirons. »
- Tags CRM : `Source: Entrant | Catégorie: Demande de Démo | Intention: Élevée | Séquence: 1 de 2`
- Coût : $0 (main-d'œuvre d'exécution seulement, ~5 min par lead)
- Contribution pipeline : 12 conversations qualifiées (chemin de conversion le plus élevé)

---

**POSTBOUND (150 leads) :**
- Réponses attendues : 150 × 12% (milieu de gamme) = **18 réponses**
- Séquence : 3 contacts, échelonnés
  - Contact 1 (Jour 0) : « J'ai vu que vous avez regardé la Partie 2 de notre série 'Scale Sales Ops' sur l'automatisation des prévisions. C'est la partie avec laquelle la plupart des équipes ops ont du mal. Devrions-nous faire un appel rapide de 15 min pour voir si [solution] vous convient ? »
  - Contact 2 (Jour 6) : « Si vous y réfléchissez toujours, voici un document d'une page sur la façon dont [entreprise similaire] a réduit son cycle de prévision de 60 %. »
  - Contact 3 (Jour 13) : « Dernier check-in — pas de pression si ce n'est pas le bon moment. Mais si vous voulez explorer, je suis disponible cette semaine. »
- Tags CRM : `Source: Postbound | Catégorie: Webinaire | Contenu: Scale Sales Ops Pt. 2 | Séquence: 1 de 3`
- Coût : $5–10 par lead (contenu webinaire déjà payé ; main-d'œuvre de suivi ~7 min par lead)
- Contribution pipeline : 18 conversations qualifiées (chemin chaud, ROI élevé sur dépense de contenu)

---

**BRIDGEBOUND (30 leads) :**
- Réponses attendues : 30 × 8% (conservateur) = **2–3 réponses**
- Séquence : 3 contacts, pont d'abord
  - Contact 1 (Jour 0) : « J'ai remarqué que vous avez laissé un avis sur G2 pour [plateforme concurrente]. Parce que vous avez évalué cet espace, j'ai pensé que vous aimeriez voir comment [notre solution] est différente. Cela vaut 15 minutes ? »
  - Contact 2 (Jour 7) : « J'ai vu [entreprise similaire, aussi un examinateur] passer à nous le mois dernier parce que [fonctionnalité spécifique]. Curieux de savoir si [même problème] est sur votre radar. »
  - Contact 3 (Jour 14) : « Une dernière chose — j'ai des données de benchmarking de votre secteur qui pourraient être utiles. Laissez-moi savoir si vous aimeriez les voir. »
- Tags CRM : `Source: Bridgebound | Catégorie: Examinateur G2 | Crédibilité: Avis G2 | Séquence: 1 de 3`
- Coût : $10–15 par lead (recherche + personnalisation, ~10 min par lead)
- Contribution pipeline : 2–3 conversations qualifiées (chemin crédible, bon ROI pour l'effort)

---

**SORTANT (200 leads) :**
- Réponses attendues : 200 × 3.5% (milieu de gamme pour e-mail froid bien exécuté) = **7 réponses**
- Séquence : 4 contacts, basée sur le déclencheur
  - Contact 1 (Jour 0) : « J'ai vu [nom d'entreprise] vient d'embaucher un VP des Ventes le mois dernier. Cela signifie généralement que les prévisions et la gestion du pipeline sont des priorités absolues dans les 90 premiers jours. Nous aidons les équipes ops à rationaliser exactement cela. Cela vaut 15 minutes pour explorer ? »
  - Contact 2 (Jour 5) : « [Angle de preuve sociale] Les Directeurs des Ventes chez [entreprise similaire] nous ont dit que leur plus grand défi dans les 90 premiers jours était de bien faire les prévisions. Cela résonne ? »
  - Contact 3 (Jour 10) : « [Proposition de valeur alternative] Angle différent : la plupart des embauches VP héritent de processus ops cassés. Voici un résumé de 2 minutes sur la façon dont [entreprise] a réparé les leurs en 30 jours. Pertinent ? »
  - Contact 4 (Jour 16) : « [Fermeture sans pression] Je sais que cela vous arrive sans prévenir, mais j'ai 15 min jeudi si c'est utile de discuter. Sinon, pas de problème. »
- Tags CRM : `Source: Sortant | Catégorie: Email Froid | Déclencheur: Embauche VP Ventes | Séquence: 1 de 4`
- Coût : $15–25 par lead (recherche + liste + main-d'œuvre de personnalisation élevée, ~15 min par lead)
- Contribution pipeline : 7 conversations qualifiées (intention la plus basse, effort le plus élevé)

---

### Résultats Campagne Mixte :

| Catégorie | Leads | Taux de Réponse | Réponses Attendues | Effort (h) | Coût | Réponses par Heure | Contribution Pipeline |
|----------|-------|------------|------------------|---|---|---|---|
| Entrant | 40 | 30% | 12 | 3 | $0 | 4.0 | 12 appels haute intention |
| Postbound | 150 | 12% | 18 | 17.5 | $1,050 | 1.0 | 18 appels chauds |
| Bridgebound | 30 | 8% | 2–3 | 5 | $375 | 0.5 | 2–3 appels crédibles |
| Sortant | 200 | 3.5% | 7 | 50 | $4,000 | 0.14 | 7 appels froids |
| **TOTAL** | **420** | — | **39–40** | **75.5** | **$5,425** | **0.52** | **39–40 pipeline total**|

---

### Insights Clés de Cet Exemple :

1. **Entrant est votre ROI le plus élevé de loin.** 40 leads / 3 heures de travail = 4 réponses par heure. Investissez agressivement en ATL pour générer plus de demande entrant.

2. **Postbound adapte les dépenses de demand gen.** Le webinaire était déjà payé ; les séquences de suivi sont du leverage. À 1 réponse par heure, c'est toujours un ROI solide.

3. **Bridgebound est du leverage de crédibilité.** Volume faible (30 leads), mais conversations de haute qualité. N'ignorez pas G2, les références et les listes d'événements.

4. **Sortant est votre jeu de volume, pas votre jeu d'efficacité.** À 0,14 réponses par heure, c'est cher. Mais si votre équipe commerciale a de la capacité et doit combler des lacunes de pipeline, c'est nécessaire. Échelonnez seulement après avoir prouvé un taux de réponse de 3 %+ sur un pilote.

5. **La campagne mixte fournit ~40 conversations de pipeline à partir de 420 leads en Q3.** C'est une conversion de pipeline de 9,5 % à partir de la prospection. Si votre taille d'accord est de $50K et votre taux de clôture est de 20 %, vous regardez $400K de revenu potentiel à partir de 75,5 heures d'effort commercial et d'exécution combinés.

---

### Ce Qui a Changé en Messagerie Parmi les Catégories :

**Même entreprise, message différent :**

- **Entrant :** « Merci d'avoir signé. Commençons à vous mettre en place pour la réussite. Êtes-vous libre mardi à 14h ? »
- **Postbound :** « J'ai vu que vous avez regardé la Partie 2 de notre webinaire sur l'automatisation des prévisions. C'est le bloqueur que nous résolvons. Cela vaut 15 minutes ? »
- **Bridgebound :** « J'ai remarqué que vous avez examiné [concurrent] sur G2. Parce que vous avez évalué cet espace, j'ai pensé que vous aimeriez voir ce qui nous rend différents. »
- **Sortant :** « J'ai vu [entreprise] venir d'embaucher un VP des Ventes. Les prévisions deviennent généralement une priorité dans les 90 premiers jours. Nous aidons les équipes ops à bien faire cela. Cela vaut un appel rapide ? »

Chaque message reconnaît le signal spécifique à la catégorie et supprime la friction froide où possible.

---

done:fr/outreach-categories
