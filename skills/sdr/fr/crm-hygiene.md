# Hygiène du CRM

## Quand l'activer

Déclenchez cette compétence lorsque :
- Un SDR complète tout contact sortant/entrant (appel, email, message LinkedIn, message vocal)
- Avant qu'un AE participe à une réunion avec un prospect
- Pendant l'examen du pipeline pour assurer l'intégrité des données avant la progression des affaires
- Lorsque les enregistrements du CRM montrent des journaux d'activité incomplets ou obsolètes (>2 heures depuis le dernier contact)
- Lors de la planification d'une transmission entre l'équipe SDR et l'équipe commerciale
- Lorsqu'une affaire passe entre les étapes du pipeline (nécessite une porte de réalisation des champs)

## Quand NE PAS l'utiliser

N'invoquez pas cette compétence pour :
- Les activités de support client post-vente (utilisez plutôt les modèles CRM de succès client)
- Les réunions internes d'équipe ou les activités administratives
- Le nettoyage rétroactif des anciens enregistrements (>90 jours) sans déclencheur d'audit explicite
- Les activités sans contact (par exemple, recherche, administration d'équipe)
- Les comptes marqués MORT qui n'ont pas de nouveau signal depuis 6+ mois (archiver plutôt)

---

## Instructions

### I. Modèle de note post-appel

Chaque appel — entrant ou sortant, réussi ou échoué — doit être enregistré dans les 2 heures avec ces champs complétés :

#### Champs requis

**Ce qui s'est passé**  
Disposition en exactement une phrase. Utilisez les codes standardisés :
- `Connecté` — une vraie personne a répondu, la conversation a eu lieu
- `Messagerie vocale laissée` — message vocal déposé, précisez le message d'accueil entendu (générique/personnalisé)
- `Pas de réponse` — sonnerie sans réponse
- `Mauvais numéro` — numéro invalide, déconnecté, ou mauvaise personne atteinte
- `Gardien` — filtré par assistant/réception, pas de transmission à la cible

*Exemple :* « Connecté avec Jennifer Martinez, CMO, pendant 12 min. Elle a répondu directement à la question sur l'initiative X. »

**Pain clé mentionné**  
Capturez le langage exact du prospect entre guillemets. Pas de paraphrase — les citations directes sont précieuses pour la gestion des objections et la personnalisation dans les futurs contacts.

*Exemple :* « Elle a dit : « Nous sommes coincés avec [Système hérité] et ne pouvons pas justifier le coût du passage. Notre CFO n'approuvera pas les nouvelles dépenses d'outils jusqu'au prochain exercice fiscal. » »

**Statut de qualification**  
Tracez aux éléments MEDDPICC confirmés jusqu'à présent :
- **Métriques** : Un chiffre d'impact sur les revenus mentionné ? Budget alloué ?
- **Acheteur économique** : L'avez-vous atteint/identifié ? Rôle confirmé ?
- **Critères de décision** : Sur quoi évaluent-ils ? Vitesse, coût, intégration ?
- **Processus de décision** : Calendrier confirmé ? Niveaux d'approbation identifiés ?
- **Pain** : Reconnu et quantifié ?
- **Champion identifié** : Y a-t-il un partisan interne ?
- **Implications** : Ont-ils articulé la conséquence commerciale ?
- **Engagement** : Quelle étape suivante ont-ils acceptée ?

Marquez chacun comme `Confirmé`, `Partiel`, ou `Manquant`. Cela détermine la disponibilité pour la transmission à l'AE.

*Exemple :*
```
Métriques : Confirmé (Budget annuel de £2M mentionné)
Acheteur économique : Manquant (parlé à l'utilisateur, pas au CFO/VP Finance)
Critères de décision : Partiel (vitesse mentionnée, tolérance des coûts peu claire)
Pain : Confirmé (citation exacte capturée)
Champion : Manquant
```

**Étape suivante**  
Action spécifique et datée avec propriétaire. Pas de vague. Inclure :
- Quoi : action exacte suivante (appel, email avec ressource, réunion)
- Propriétaire : nom du SDR ou nom de l'AE si transmission
- Date : date de calendrier, pas « semaine prochaine »
- Contingence : que se passe-t-il s'il ne répond pas dans 5 jours ?

*Exemple :* « SDR (Sarah) pour envoyer une vidéo d'aperçu du produit de 3 min avant le 2026-06-05. Si pas de réponse avant le 2026-06-10, escalader au suivi de l'AE. »

**Objections levées**  
Enregistrez chaque objection mot pour mot. Ajoutez votre réponse si donnée. Ne supposez pas que ce sont des tueurs d'affaires — ce sont des données pour la préparation de l'AE.

*Exemple :*
```
Objection : « Nous avons un fournisseur incumbent et nous sommes bloqués jusqu'au Q3 2027. »
Réponse donnée : « Compris. Quand Q3 approchera, aurait-il du sens d'évaluer les options 90 jours avant ? »
Drapeau de suivi : Oui — revenir le 2026-04-01 à l'approche du renouvellement de contrat.
```

---

### II. Normes de journalisation des activités

**Chronométrage** : Enregistrez chaque activité dans les 2 heures suivant son achèvement. Pas de lots en fin de journée.

**Couverture** : Enregistrez chaque contact, y compris :
- Appels téléphoniques (entrant/sortant)
- Messages vocaux déposés
- Emails envoyés (inclure l'extrait de ligne d'objet)
- Messages LinkedIn, demandes de connexion, vues de profil sur les comptes actifs
- Démos, participation à des webinaires, téléchargements de contenu
- Complétions de tâches (suivi programmé, ressource envoyée)

**Codes de disposition (standardisés)**

| Type d'activité | Code | Définition |
|---|---|---|
| Appel | Connecté | Conversation en direct avec la cible |
| Appel | Messagerie vocale laissée | Message vocal déposé ; journal du style de message d'accueil |
| Appel | Pas de réponse | Sonné, pas de prise, pas de messagerie vocale ; réessayer |
| Appel | Mauvais numéro | Invalide, mauvaise personne, ou refus du gardien |
| Email | Envoyé | Horodatage lors du déploiement ; enregistrer l'objet |
| Email | Ouvert | Suivi via pixel ou hypothèse de réponse |
| Email | Répondu | Note sur le sentiment de la réponse (positif/neutre/négatif) |
| Email | Rejeté | Non livrable ; drapeau pour ré-sourçage |
| LinkedIn | Message envoyé | Note sur le niveau de personnalisation |
| LinkedIn | Vue de profil | Enregistrer uniquement si le compte est de niveau ACTIF (voir balisage) |
| Autre | Tâche complétée | Ressource envoyée, appel programmé, suivi enregistré |

---

### III. Taxonomie du balisage du pipeline

**Chaque enregistrement de prospect doit avoir les quatre couches de balises.** Utilisez ces balises exactes ; n'inventez pas de variantes.

#### Balise de source de prospect (une requise)
- `ENTRANT` — enquête entrante, soumission de formulaire, parrainage, participant à un événement
- `APRÈS-ÉVÉNEMENT` — suivi post-événement, participant à un webinaire, téléchargeur de blog
- `INTRODUCTION CHALEUREUSE` — présentation chaleureuse, parrainage de connexion mutuelle
- `SORTANT` — prospection froide, message LinkedIn, achat de liste d'emails

#### Balise de signal (Ce qui a déclenché le contact)
Capturez la raison spécifique de l'engagement :
- `Hiring_Spree` — LinkedIn affiche un nouvel effectif (page d'embauche, publications d'emploi)
- `Funding_Event` — clôture de la série A/B, mention de presse, signal Crunchbase
- `Leadership_Change` — nouveau CMO, CFO, VP Engineering embauché (LinkedIn)
- `Integration_Partnership` — partenariat annoncé avec l'écosystème d'outils
- `Compliance_Change` — nouvelle réglementation affectant son secteur (SOC 2, HIPAA, RGPD)
- `Earnings_Call` — transcription d'appel de résultats d'une entreprise publique mentionne un pain
- `RFP_Issued` — prospect a émis un RFP (parfois visible dans les forums de passation de marché)
- `Contract_Renewal` — date de renouvellement estimée pour l'approche de l'incumbent (basée sur la recherche)
- `Dormant_Account` — contact précédent inactif depuis 12+ mois, nouveau signal arrivé
- `Generic_Outreach` — pas de déclencheur spécifique ; prospection générale

#### Étape de séquence (une requise)
- `ACTIF` — en cadence active, contact attendu dans les 7 prochains jours
- `EN PAUSE` — en pause (attente de réponse, absence du bureau, mauvais moment) ; date de reprise définie
- `COMPLÉTÉ` — cadence terminée ; aucun contact supplémentaire à moins d'un nouveau signal
- `CONVERTI` — déplacé à l'occasion, maintenant propriété de l'AE
- `MORT` — non qualifié, sans réponse, ou explicitement disqualifié ; aucun contact supplémentaire

#### Balise de niveau (une requise)
- `T1` — acheteur économique confirmé, MEDDPICC à 80%+ complet, affaire imminente (propriété de l'AE)
- `T2` — influenceur ou utilisateur identifié, pain confirmé, 60%+ complet, a besoin de plus de qualification
- `T3` — prospect en phase initiale, pain de niveau surface, 30%+ complet, groupe de prospection à grand volume

---

### IV. Résumé de transmission pré-réunion (SDR → AE)

Créez ce document dans Slack, Notion, ou CRM lors du transfert d'une réunion à l'AE. Temps de lecture estimé : 2 minutes. Utilisez cette structure exacte :

#### 1. Contexte du compte (2 phrases max)
- Taille de l'entreprise, secteur, fourchette de revenus
- Ce qu'ils font ; pourquoi nous pensons qu'ils sont un ajustement

*Exemple :* « Revolve est un fournisseur SaaS mid-market de £180M dans les HR verticales. Ils viennent de lever la série C et sont en train de passer de 3 à 8 solutions dans le portefeuille de produits. »

#### 2. Profil du contact (Rôle, ancienneté, pain)
- Titre et rôle exact (utiliser le titre LinkedIn si disponible)
- Ancienneté dans l'entreprise (niveau d'influence)
- Leur point douloureux spécifique et citation

*Exemple :* « Jennifer Martinez, CMO, 2,4 ans d'ancienneté. Responsable de la pile technologique marketing et de la personnalisation. Pain : « Nous sommes coincés avec MarTech hérité et perdons la parité des fonctionnalités par rapport aux concurrents. Chaque nouvel outil que nous achetons nécessite 4 semaines de travail d'intégration. » »

#### 3. Score MEDDPICC et écarts
- Score global (0–100%) ; décomposez par élément
- Lacunes critiques que l'AE doit résoudre lors de cette réunion

*Exemple :*
```
Qualification globale : 68%
- Métriques : 75% (budget mentionné)
- Acheteur économique : 40% (parlé au CMO, pas au CFO)
- Critères de décision : 80% (vitesse + profondeur d'intégration)
- Pain : 85% (citation capturée)
- Champion : 0% (besoin d'identifier)

Lacune critique : Doit déterminer l'acheteur économique et l'implication du CFO avant la fin de la réunion.
```

#### 4. Messages de séquence (Ce qui a été dit)
- Crochets de personnalisation utilisés (recherche d'entreprise, annonce, nom de parrainage)
- Objections levées (ne les répétez pas ; signalez-les)
- Ton de la conversation (réceptif, septique, distrait)

*Exemple :* « Utilisé leur annonce de série C pour ouvrir. Elle était réceptive à l'angle vitesse/intégration mais septique sur le coût. Mentionner le ROI dans les 90 premiers jours ; elle le demandera. »

#### 5. Pourquoi ils ont accepté une réunion
- Ce qui a spécifiquement résonné ; ce qui les a fait passer de « non » à « oui »
- Ce qu'ils veulent apprendre lors de cet appel

*Exemple :* « Elle a accepté quand j'ai dit « Nous parcourions un plan de mise en œuvre de 60 jours adapté à votre pile. » Elle veut voir si nous pouvons répondre à ses exigences de vitesse sans intégrations de 4 semaines. »

---

### V. Règles de dédoublonnage

**Avant d'enregistrer tout nouveau contact dans le CRM, vérifiez :**

1. **Correspondance des emails** : Recherchez par domaine de messagerie professionnelle + prénom/nom. Si trouvé, fusionnez les enregistrements ; ne créez pas de doublon.
2. **Correspondance d'URL LinkedIn** : Si deux enregistrements ont la même URL de profil LinkedIn, c'est la même personne.
3. **Correspondance de numéro de téléphone** : Correspondance de numéro exacte OU même entreprise + même nom = même personne. Fusionner.
4. **Dédoublonnage au niveau du compte** : Si le contact est déjà enregistré sous le compte de l'entreprise correct, utilisez l'enregistrement existant au lieu de créer un orphelin.

**Protocole de fusion :**
- Préservez l'historique complet de l'activité des deux enregistrements
- Conservez la date de contact d'origine
- Combinez les notes (prépend avec horodatage)
- Archivez l'enregistrement en double avec note de fusion

---

### VI. Portes de qualité des données (Avant qu'une réunion soit enregistrée)

**Une réunion ne peut pas être enregistrée comme « programmée » tant que toutes les portes ne réussissent :**

1. **Accomplissement des champs de contact** :
   - Prénom : requis
   - Nom : requis
   - Email professionnel : requis
   - URL du profil LinkedIn : requis
   - Titre du poste : requis

2. **Accomplissement des champs de compte** :
   - Nom de l'entreprise : requis (entité juridique exacte, pas surnom)
   - Secteur : requis
   - Taille de l'entreprise (nombre d'employés) : requis
   - Chiffre d'affaires annuel ou stade de financement : requis

3. **Porte de qualification** :
   - Niveau de prospect assigné (T1, T2, T3)
   - Au moins un élément MEDDPICC confirmé
   - Déclaration de pain capturée (minimum une phrase)

4. **Porte de piste d'activité** :
   - Au moins une activité enregistrée (appel, email, message LinkedIn) au cours des 30 derniers jours
   - Étape suivante documentée
   - Aucun contact orphelin (doit être lié au compte de l'entreprise correct)

**Conséquence** : Si les portes échouent, la réunion est marquée « en attente d'approbation » dans le CRM. L'AE ne peut pas faire avancer l'affaire tant que le SDR ne remédie pas aux données.

---

### VII. Liste de contrôle de réalisation des champs du CRM

**Champs minimaux requis par étape :**

**Étape de prospect (prospect identifié, non qualifié)**
- Contact : prénom, nom, email, téléphone, titre, entreprise, URL LinkedIn
- Compte : nom de l'entreprise, secteur, taille, revenus, emplacement
- Activité : disposition d'appel ou email envoyé (30 derniers jours)
- Balisage : source du prospect, déclencheur du signal, étape de séquence (ACTIF/EN PAUSE)

**Prospect qualifié (MEDDPICC à 50%+, pain confirmé)**
- Tous les champs ci-dessus, plus :
- Décomposition MEDDPICC (une phrase par élément)
- Déclaration de pain (citation exacte si possible)
- Étape suivante (datée, avec propriétaire)
- Objections du contact (le cas échéant)
- Balise de niveau assignée (T1/T2/T3)

**Réunion programmée (confirmée avec le prospect)**
- Tous les champs ci-dessus, plus :
- Date/heure/participants de la réunion (confirmés)
- Agenda de la réunion (résumé d'une ligne)
- Document de transmission pré-réunion (5 points)
- Assignation d'AE confirmée
- Tâche de suivi créée pour le jour après la réunion

**Opportunité (propriété de l'AE, affaire en cycle)**
- Tous les champs ci-dessus, plus :
- Valeur de l'affaire (ARR/frais uniques)
- Date de clôture (réaliste)
- Décideur principal confirmé
- Acheteur économique confirmé
- Chaîne d'approbation identifiée (PDG, CFO, VP, etc.)

---

## Exemple

**Scénario** : Sarah (SDR) complète un appel froid à Marcus Chen, VP of Product chez une startup fintech mid-market. Il répond, entend le pitch, mais dit qu'ils sont bloqués avec leur fournisseur actuel. Sarah documente l'appel et transmet les informations à son AE, James.

**Note post-appel (Sarah enregistre dans les 45 min)**

```
Type d'activité : Appel téléphonique
Contact : Marcus Chen
Entreprise : PaymentFlow (£80M de revenus, fintech)
Date : 2026-06-02, 10:15 AM
Durée : 7 min

CE QUI S'EST PASSÉ
Connecté avec Marcus Chen, VP of Product, pendant 7 minutes. Il a répondu directement et s'est engagé tout au long du pitch.

PAIN CLÉ MENTIONNÉ
« Notre fournisseur actuel est solide mais continue d'ajouter des ballonnements. Chaque mise à jour a des fonctionnalités dont nous n'avons pas besoin. Nous passons 20 % du temps d'ingénierie à intégrer leurs ordures. »

STATUT DE QUALIFICATION
Métriques : Partiel (revenu mentionné, budget pas)
Acheteur économique : Manquant (parlé à l'utilisateur, besoin de CFO)
Critères de décision : Confirmé (ballonnements du vendeur, charge d'intégration)
Pain : Confirmé (citation exacte capturée)
Champion : Partiel (Marcus est un partisan interne, pas encore confirmé)
Calendrier : Manquant
Implications : Partiel (coût de temps mentionné, impact commercial peu clair)
Engagement : Aucun pour l'instant (posture d'écoute seulement)

ÉTAPE SUIVANTE
Sarah pour envoyer une vidéo de démo de 4 min (exemples d'intégration) avant le 2026-06-04.
Si visualisée, programmer une plongée technique approfondie de 30 min avec Marcus + 1 ingénieur avant le 2026-06-08.
Si pas de réponse avant le 2026-06-08, mettre en pause la séquence et revisiter le Q4 2026 (cycle de renouvellement de contrat).

OBJECTIONS LEVÉES
Objection : « Nous sommes bloqués avec notre incumbent jusqu'à la fin de 2027. »
Réponse donnée : « Compris. Nous construisons généralement un cas d'affaire à pitcher au renouvellement. Aurait-il du sens de discuter à nouveau autour d'avril 2027, 9 mois avant ? »
Sa réponse : « Peut-être. Envoie-moi quelque chose d'abord. »
Drapeau de suivi : OUI — ajouter à la séquence de renouvellement de contrat, cycle 2027-04-01.

BALISES ASSIGNÉES
Source du prospect : SORTANT
Déclencheur du signal : Earnings_Call (annonce récente de financement fintech)
Étape de séquence : ACTIF (vidéo de démo en attente)
Niveau : T2 (influenceur, pain confirmé, budget/calendrier manquant)

TRANSMISSION À AE (Pas encore nécessaire ; créera avant la réunion programmée.)
```

---

**Résumé de transmission pré-réunion (Créé 3 jours plus tard quand Marcus accepte la réunion)**

```
À : James (AE) | DE : Sarah (SDR) | DATE : 2026-06-05
RÉUNION : Marcus Chen, PaymentFlow | PROGRAMMÉE : 2026-06-09, 14:00

1. CONTEXTE DU COMPTE
PaymentFlow est une plateforme fintech mid-market de £80M servant les PME. Ils ont récemment clôturé un financement et ont augmenté l'ingénierie pour soutenir une vélocité de fonctionnalités plus rapide. La surcharge d'intégration est un point de friction croissant.

2. PROFIL DU CONTACT
Marcus Chen, VP of Product, 2,3 ans d'ancienneté. Influence directe sur la pile de vendeurs. Pain (verbo) : « Chaque mise à jour a des fonctionnalités dont nous n'avons pas besoin. Nous passons 20 % du temps d'ingénierie à intégrer leurs ordures. »

3. SCORE MEDDPICC
Global : 58%
- Métriques : Partiel (revenu connu, budget pas ; estimation nécessaire)
- Acheteur économique : Manquant (uniquement parlé à l'utilisateur ; CFO pas encore contacté)
- Critères de décision : Confirmé (simplicité + charge d'intégration faible)
- Pain : Confirmé (ballonnements du vendeur, puits de temps)
- Champion : Partiel (Marcus plaidera pour, mais avoir besoin de confirmation des pairs)
- Implications : Manquant (impact commercial du ballonnement pas quantifié)
- Engagement : Aucun pour l'instant

Lacune critique : Doit identifier l'acheteur économique (CFO ?) et quantifier le coût de la surcharge d'intégration en £/heures.

4. MESSAGES DE SÉQUENCE
Crochet d'ouverture : Référencé leur financement fintech et narration d'augmentation d'ingénierie (à partir de Crunchbase).
Il s'est engagé fortement sur l'angle « fardeau d'intégration ».
Hésitation : Lock-in incumbent jusqu'à la fin de 2027. Conversation de renouvellement positionnée comme fenêtre de 9 mois.

5. POURQUOI ILS ONT ACCEPTÉ
Point de résonance : « Nous parcourrons comment d'autres plateformes fintech ont réduit la surcharge d'intégration de 60 %. »
Il veut voir : Preuve d'entreprises similaires ; exemples d'intégration à faible contact.

---

PROCHAINES ÉTAPES POUR JAMES :
- Mener avec la comparaison des concurrents (cas d'usage fintech similaire).
- Poser des questions sur la taille de l'équipe d'intégration ; quantifier le coût actuel.
- Question d'identification de l'acheteur économique : « Qui approuve les changements de vendeur ici ? »
- Définir l'attente : Bouclez le PDG/CFO de Marcus si l'affaire avance.
```

---

**Champs du CRM complétés (Sortie équivalente à une capture d'écran)**

```
ENREGISTREMENT DE CONTACT : Marcus Chen
Prénom : Marcus
Nom : Chen
Email : marcus.chen@paymentflow.io
Téléphone : +44 20 XXXX XXXX
Titre : VP of Product
URL LinkedIn : linkedin.com/in/marcuschen-fintech
Entreprise : PaymentFlow

ENREGISTREMENT DE COMPTE : PaymentFlow
Nom juridique : PaymentFlow Ltd.
Secteur : Services financiers / Fintech
Nombre d'employés : 240
Chiffre d'affaires annuel : £80M (estimé à partir de Crunchbase)
Stade de financement : Série B/C (tour récent)
Siège social : Londres, Royaume-Uni
Site Web : paymentflow.com

JOURNAL D'ACTIVITÉ : 30 derniers jours
- 2026-06-02, 10:15 AM | Appel téléphonique | Connecté (7 min) | Sarah
- 2026-06-04, 14:30 | Email envoyé | Lien vidéo de démo | Sarah
- 2026-06-05, 11:00 AM | Email ouvert | Marcus a ouvert la vidéo de démo
- 2026-06-05, 13:45 | Email répondu | « Intéressant. Parlons. » | Marcus
- 2026-06-09, 14:00 | Réunion programmée | James (AE) + Marcus + 1 ingénieur

BALISAGE
Source du prospect : SORTANT
Déclencheur du signal : Earnings_Call / Expansion fintech
Étape de séquence : CONVERTI (maintenant dans le pipeline AE)
Niveau : T2

QUALIFICATION
Pain (citation exacte) : « Chaque mise à jour a des fonctionnalités dont nous n'avons pas besoin. Nous passons 20 % du temps d'ingénierie à intégrer leurs ordures. »
Global MEDDPICC : 58% (acheteur économique manquant, implications manquant)
Étape suivante : Réunion 2026-06-09 ; l'AE doit identifier le CFO/acheteur économique
```

---

## Repères et normes

- **Taux de journalisation cible** : 95%+ des activités enregistrées dans les 2 heures. Audit hebdomadaire.
- **Qualité de la transmission** : L'AE ne devrait jamais demander « Qui est-ce ? » ou « Qu'ont-ils dit ? » — tout le contexte en résumé.
- **Taux de dédoublonnage** : <2% d'enregistrements en double pour 100 nouveaux prospects. Fusionner mensuellement.
- **Taux de réussite de la porte de données** : 90%+ des réunions programmées respectent toutes les portes de réalisation des champs avant d'être enregistrées comme « confirmées ».
- **Moyenne MEDDPICC sur transmission T1** : 80%+ sur six éléments (excluant calendrier/implications si non encore discutés).
- **SLA d'enregistrement des activités** : 95% dans les 2 heures ; 99% dans les 4 heures. Zéro enregistrement plus ancien que la fin de la journée ouvrable.
