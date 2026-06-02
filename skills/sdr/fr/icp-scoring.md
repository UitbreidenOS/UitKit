# Évaluation de l'ICP

## Quand activer

Vous prospectez des entreprises B2B SaaS et devez qualifier les prospects par rapport à un profil client idéal (ICP) défini. Déclenchez ceci lorsque : vous évaluez un nouveau prospect pour le niveau de relance, vous priorisez une liste de prospects, vous décidez de la profondeur de contact pour une entreprise, ou vous validez l'adéquation avant la remise aux ventes.

## Quand NE PAS utiliser

- Vous avez déjà un prospect dans un flux de réussite client/rétention — utilisez plutôt les cadres de prévention du churn.
- Le prospect est déjà un client ou une opportunité active dans votre CRM — ceci est réservé aux nouvelles prospections.
- Vous effectuez une sourcing de génération de leads (trouver *quelles* entreprises prospecter) — ceci est pour *qualifier* les entreprises que vous avez déjà identifiées.
- L'entreprise cible compte moins de 10 employés ou opère dans un secteur franchement disqualifiant — l'évaluation n'a aucun sens ; marquez comme ne pas contacter.

## Instructions

### Définition de l'ICP à 3 couches

Chaque ICP est défini selon trois dimensions orthogonales. Évaluez chacune indépendamment, puis combinez.

**Couche 1 : Adéquation Firmographique (0–40 points)**

Attributs objectifs de l'entreprise qui déterminent la capacité structurelle à acheter.

| Attribut | Cible | Points |
|---|---|---|
| **Secteur vertical** | Principal (p. ex., SaaS, FinTech, Healthcare Tech) | 20 |
| Adéquation secondaire (adjacent, cas d'usage prouvé) | 10 |
| Mauvais secteur (disqualifiant) | 0 |
| **Effectif de l'entreprise** | 50–500 | 15 |
| 25–49 ou 501–1 000 | 8 |
| 10–24 ou 1 001+ | 2 |
| Moins de 10 | 0 (disqualifiant dur) |
| **Revenu annuel récurrent (ARR)** | 5M–100M $ | 5 |
| 2M–4,9M $ ou 100M–500M $ | 3 |
| Moins de 2M $ ou plus de 500M $ | 0 |
| **Géographie** | US, UK, Canada, Europe occidentale (principale) | Inclus ci-dessus ; les marchés secondaires marquent à 80 % |

*Plafond firmographique : 40 points. Une entreprise parfaite sur tous les attributs obtient 40 points.*

**Couche 2 : Adéquation Technographique (0–30 points)**

Les signaux de pile technologique et d'infrastructure qui indiquent l'adéquation du produit ou la disqualification.

Évaluez en fonction de la *présence* de signaux (pas l'absence). Vérifiez : piles technologiques publiques (StackShare, LinkedIn, annonces d'emploi, présentations de financement), repos GitHub publiques, annonces d'emploi pour les rôles technologiques, annonces de fondation/financement.

| Type de signal | Exemples | Points |
|---|---|---|
| **Adéquation centrale** (votre solution s'intègre directement dans leur pile) | Utilisant Node.js, PostgreSQL, Kubernetes ; embauche « Ingénieur DevOps » ; discussion publique sur les microservices | 15 |
| **Adéquation secondaire** (adjacence forte) | Infrastructure cloud (AWS, GCP, Azure) ; mentions CI/CD ; investissements en pipeline de données | 10 |
| **Signal faible** (technologie SaaS moderne générale, non spécifique à votre ICP) | Pile SaaS standard (React, Python, AWS typique) ; pas de drapeaux rouges mais pas d'adéquation forte non plus | 5 |
| **Disqualifiant dur** | Verrouillé dans la pile technologique d'un concurrent ; mainframe legacy uniquement ; utilisant un fournisseur complètement incompatible | 0 |

*Sélectionnez la catégorie de signal avec le score le plus élevé trouvée. Plafond technographique : 30 points.*

**Couche 3 : Signaux Comportementaux (0–20 points)**

Signaux récents d'élan et de croissance indiquant l'intention d'achat et l'allocation du budget.

| Signal | Récence | Points |
|---|---|---|
| **Tour de financement** (Série A ou ultérieure, pas seed) | 12 derniers mois | 8 |
| 13–24 mois ago | 5 |
| Plus de 24 mois | 2 |
| **Augmentation des embauches** (5+ postes ouverts affichés publiquement dans votre département cible : ingénierie, données, produit) | 30 derniers jours | 8 |
| 31–90 jours ago | 5 |
| Plus de 90 jours | 2 |
| **Signaux d'expansion** (nouveau bureau, lancement de nouveau produit, entrée sur nouveau marché, nouvel écosystème d'intégration) | 90 derniers jours | 4 |

*Plafond comportemental : 20 points. Les signaux multiples sont additifs jusqu'à 20.*

### Décroissance de la récence (bonus/pénalité 0–10 points)

Toutes les données firmographiques deviennent obsolètes. Ajustez le score final en fonction de la fraîcheur des données.

| Fraîcheur des données | Ajustement |
|---|---|
| Tous les attributs ICP vérifiés au cours des 30 derniers jours | +10 |
| Vérifiés 31–90 jours ago | +5 |
| Vérifiés 91–180 jours ago | 0 |
| Plus de 180 jours (pas de vérification récente) | –5 |

*Exemple : Un prospect de 75 points avec des données de taille d'entreprise datant de 6 mois devient 70 points.*

### Modèle d'évaluation complet : 0–100

**Formule :**
```
SCORE = Firmographique (0–40) + Technographique (0–30) + Comportemental (0–20) + Récence (–5 à +10)
PLAGE : 0–100
```

### Disqualifiants durs (Score = 0, ignorer tous les niveaux)

Même si d'autres dimensions obtiennent des scores élevés, marquez le prospect **ne pas contacter** si l'un des éléments suivants s'applique :

1. **Concurrent** — Ils créent/vendent un produit concurrent.
2. **Client existant** — Déjà dans votre base de clients ou essai actif.
3. **Mauvais secteur vertical** — En dehors de vos secteurs primaires/secondaires définis (p. ex., entrepreneur gouvernemental lorsque vous ciblez SaaS).
4. **Effectif sous 10** — Trop petit pour avoir un processus d'achat ou un budget.
5. **Signaux de disqualification explicites** — Déclarations publiques contre votre catégorie ; utilisation exclusive d'un fournisseur incompatible ; annonces de faillite/licenciement indiquant un gel du budget.

### Définitions des niveaux et manuels d'action

Après l'évaluation (et confirmation d'absence de disqualifiants durs), orientez vers le niveau de relance :

#### Niveau 1 (80–100 points)
**Caractéristiques :** Adéquation parfaite ou quasi-parfaite. Correspondance ICP sur 2+ dimensions. Signaux récents.

**Manuel de relance :**
- Recherche manuelle approfondie : Lisez les 3 derniers appels de résultats (le cas échéant), billets de blog récents, Twitter du PDG, annonces d'embauche LinkedIn, annonce de financement récente.
- Identifiez 2–3 crochets spécifiques et personnalisés (p. ex., « J'ai remarqué que vous avez affiché 7 postes d'ingénierie le mois dernier ; nous aidons les équipes comme la vôtre à réduire le temps d'intégration de 40 % »).
- Séquence d'e-mail personnalisée : 5 touches, cadence de 21 jours. Crochet personnalisé dans l'e-mail 1. Référence à une étape précise de l'entreprise dans l'e-mail 3. Touche sociale (commentaire LinkedIn sur un poste récent) en tant que touche 4.
- Implication des ventes : Attribuez à un gestionnaire de compte désigné. Utilisez le manuel de développement des ventes complet.

**Indice de réponse de référence :** 8–12 % de taux de réponse (avec personnalisation).

#### Niveau 2 (50–79 points)
**Caractéristiques :** Adéquation forte sur 1 dimension, adéquation adéquate sur les autres. Correspondance ICP claire mais peut manquer d'élan récent.

**Manuel de relance :**
- E-mail template avec 1 crochet de personnalisation (p. ex., « Votre équipe a embauché 6 ingénieurs le trimestre dernier ; nous aidons les équipes comme [entreprise similaire] à réduire [résultat] »).
- Séquence standard 3 touches sur 14 jours : E-mail → 5 jours d'attente → Message LinkedIn → 3 jours d'attente → E-mail final.
- Pas de recherche manuelle approfondie ; utilisez les signaux publics uniquement (LinkedIn, StackShare, annonces de financement).
- Implication légère des ventes : SDR uniquement, pas d'attribution d'AE.

**Indice de réponse de référence :** 4–6 % de taux de réponse.

#### Niveau 3 (20–49 points)
**Caractéristiques :** Adéquation partielle. Correspond à l'ICP sur une seule dimension ou signaux faibles sur plusieurs dimensions.

**Manuel de relance :**
- E-mail template (pas de personnalisation). Touche unique uniquement.
- Batch-and-blast : Envoyez dans les campagnes en masse. Pas de séquence de suivi.
- Utilisez pour la constitution de listes et la sensibilisation à la marque, pas les ventes directes.
- Aucune implication des ventes.

**Indice de réponse de référence :** 1–2 % de taux de réponse (attendez-vous à un faible engagement).

#### Moins de 20 points
**Action :** Ne pas contacter. Déplacez vers le segment « nurture » pour les futures campagnes uniquement. Re-évaluez trimestriellement.

---

### Modèle d'invite d'évaluation

Utilisez cette structure d'invite pour évaluer un prospect avec Claude :

```
Évaluez cette entreprise par rapport à notre ICP en utilisant le modèle 0–100 ci-joint.

ENTREPRISE : [Nom de l'entreprise]
SECTEUR : [Secteur]
EFFECTIF : [Nombre] (source : [LinkedIn/PitchBook/etc])
ARR : [Estimation ou public $] (source : [comment vous le savez])
GÉOGRAPHIE : [Pays/région]

SIGNAUX DE PILE TECHNOLOGIQUE :
- [Outil/plateforme 1] (source : [annonce d'emploi/StackShare/GitHub])
- [Outil/plateforme 2]
- [Outil/plateforme 3]

SIGNAUX COMPORTEMENTAUX :
- Financement : [Série X, $Y, date] (source : [Crunchbase/communiqué de presse])
- Embauche : [Nombre de postes ouverts dans le département cible, dates d'affichage] (source : [emplois LinkedIn])
- Expansion : [Nouveau marché/bureau/lancement de produit] (source : [annonce])

FRAÎCHEUR DES DONNÉES : Toutes les données vérifiées [plage de dates]

TÂCHE :
1. Évaluez chaque dimension indépendamment (Firmographique, Technographique, Comportemental, Récence).
2. Identifiez les disqualifiants durs.
3. Retournez : SCORE TOTAL, NIVEAU, RECOMMANDATION (profondeur de contact + type de séquence).
4. Listez les 2 meilleurs crochets de personnalisation (le cas échéant pour le niveau 1 ou 2).

Formatez la réponse comme suit :
---
**SCORE : [0-100]**
**NIVEAU : [1/2/3/Ne pas contacter]**
**DISQUALIFIANTS :** [Aucun / Listez-en trouvés]
**FIRMOGRAPHIQUE :** [X points] — [justification]
**TECHNOGRAPHIQUE :** [X points] — [justification]
**COMPORTEMENTAL :** [X points] — [justification]
**AJUSTEMENT DE RÉCENCE :** [+/- X points]

**MEILLEURS CROCHETS DE PERSONNALISATION :**
1. [Crochet 1 — spécifique, limité dans le temps]
2. [Crochet 2 — spécifique, limité dans le temps]

**RECOMMANDATION :** [Manuel de relance et prochaine étape]
---
```

---

## Exemple

### Scénario : Évaluez TechVentures Inc. (FinTech SaaS hypothétique)

**Données brutes collectées :**

| Attribut | Valeur | Source |
|---|---|---|
| Entreprise | TechVentures Inc. | Crunchbase |
| Secteur | FinTech (traitement des paiements) | Site web, LinkedIn |
| Effectif | 180 | Page Entreprise LinkedIn (mise à jour il y a 2 semaines) |
| ARR | 18M $ | Crunchbase financement + calcul burn |
| Géographie | San Francisco, CA (US) | Site web de l'entreprise |
| Pile technologique | Python, PostgreSQL, AWS, Kubernetes, microservices Node.js | Annonces d'emploi (Aug 2026), repos GitHub publiques |
| Financement | Série B, 45M $, levée en Mar 2026 | Crunchbase, TechCrunch |
| Embauche | 12 postes d'ingénierie ouverts (affichés dans les 30 derniers jours) | Page emplois LinkedIn |
| Expansion | Annonce d'expansion au Royaume-Uni (Jul 2025) | Blog de l'entreprise |
| Données vérifiées | Jun 2026 | Cette séance d'évaluation |

### Évaluation :

**FIRMOGRAPHIQUE (40 max) :**
- Adéquation sectorielle (FinTech secteur primaire) : 20 points
- Effectif (180, dans la plage 50–500) : 15 points
- ARR (18M $, dans la plage 5M–100M $) : 5 points
- **Sous-total : 40 points** ✓

**TECHNOGRAPHIQUE (30 max) :**
- Adéquation centrale : PostgreSQL + microservices Python sur AWS/Kubernetes correspondent à l'infrastructure SaaS moderne (15 points).
- Aucun signal disqualifiant.
- **Sous-total : 15 points** ✓

**COMPORTEMENTAL (20 max) :**
- Financement (Série B, 45M $, Mar 2026 = il y a 3 mois) : 8 points
- Augmentation des embauches (12 postes d'ingénierie, affichés <30 jours) : 8 points
- Expansion (bureau Royaume-Uni annoncé, mais il y a 11+ mois) : 2 points
- **Sous-total : 18 points** ✓

**RÉCENCE (±10) :**
- Toutes les données vérifiées au cours des 30 derniers jours : +10 points

---

### SCORE FINAL : 40 + 15 + 18 + 10 = **83 points**

### NIVEAU : **Niveau 1 (80–100)**

### DISQUALIFIANTS : Aucun

### RECOMMANDATION :

**Manuel de relance — Niveau 1 :**

**Crochets de personnalisation :**
1. « Vous avez levé 45M $ en Série B (Mar 2026) et embauchez agressivement (12 postes d'ingénierie ouverts). Nous aidons les plateformes FinTech qui se développent sur AWS/Kubernetes à réduire la complexité de l'infrastructure de 35 %—directement pertinent à mesure que vous vous développez au Royaume-Uni et augmentez les effectifs. »
2. « Vous avez construit sur PostgreSQL + microservices, ce qui est exactement là où [notre solution] fournit le plus de valeur. Des équipes comme Stripe et Wise nous utilisent pour accélérer les cycles de déploiement lors de la mise à l'échelle sur plusieurs régions. »

**Séquence d'e-mail (5 touches, 21 jours) :**
- **Jour 1 :** E-mail personnalisé. Objet : « [Nom du CTO], trajectoire de croissance de TechVentures + pile de microservices. » Incluez l'appel d'annonce de financement + 1 crochet de personnalisation.
- **Jour 6 :** E-mail de suivi. « Mon e-mail précédent sur les défis de l'expansion au Royaume-Uni a-t-il porté ses fruits ? »
- **Jour 10 :** Message LinkedIn au CTO/VP Engineering (angle de messaging différent).
- **Jour 14 :** Touche à valeur ajoutée : Partagez une étude de cas pertinente (entreprise FinTech, ARR similaire, scénario d'évolution).
- **Jour 21 :** E-mail de rupture final. « Dernière chance : Parlons de vos objectifs d'infrastructure Q3. »

**Implication des ventes :** Attribuez à un AE désigné. Ciblez la réservation d'un appel de découverte de 30 minutes.

**Résultat attendu :** 8–12 % de taux de réponse. Cible pour qualification des ventes immédiate.

---

**Fin de l'exemple d'évaluation. TechVentures Inc. est un feu vert pour la relance à intensité Niveau 1.**
