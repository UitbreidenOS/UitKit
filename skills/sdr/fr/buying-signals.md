# Signaux d'Achat

## Quand activer

Lors de la prospection B2B SaaS, vous décidez si et quand contacter un compte cible. Activez cette compétence lorsque vous avez :
- Un compte identifié comme correspondant (taille de l'entreprise, secteur d'activité, correspondance de la pile technologique)
- Accès à des outils de détection de signaux (LinkedIn, Crunchbase, boards emploi, BuiltWith, G2, APIs d'actualités)
- L'intention de maximiser le taux de réponse au premier contact et la probabilité de conversion
- Un cadence de surveillance multi-signaux (vérifications quotidiennes ou hebdomadaires sur les comptes chauds)

Cette compétence est opérationnalisée pour SaaS, PaaS, B2B fintech et logiciels d'entreprise. Fonctionne mieux sur les comptes avec 50+ employés (suffisamment de signaux à détecter, suffisamment de budget pour fermer).

## Quand NE PAS utiliser

- N'appliquez pas à B2C ou aux entreprises mono-fondateur — les signaux sont trop rares et les comités d'achat n'existent pas
- Ne l'utilisez pas si vous manquez des outils de détection pour vérifier les signaux de manière fiable (LinkedIn Premium, BuiltWith, accès aux boards emploi)
- N'appliquez pas à la prospection de ventes internes où vous avez déjà une introduction chaleureuse ou un contact direct — utilisez plutôt la relation en premier, le signal en second
- Ne traitez pas cela comme déterministe — les signaux sont probabilistes, pas des certitudes ; validez toujours par la recherche
- N'ignorez pas la décadence des signaux ; un tour de financement d'il y a 8 mois a zéro valeur prédictive
- Ne déclenchez pas sur des signaux uniques seuls sauf si le rang du signal est 1 ou 2 ; attendez l'empilement (2+ signaux) pour la prospection à froid sur les rangs 3–6

## Instructions

### Les 6 Signaux d'Achat Classés par Corrélation avec l'Achat

**Signal 1 : Un Ancien Client a Rejoint une Nouvelle Entreprise**
- **Rang :** 1 (corrélation la plus élevée, ~35% de taux de réponse vs. 3,4% de base)
- **Pourquoi c'est important :** Il a des connaissances produit prouvées, comprend le ROI et a souvent l'autorité budgétaire à sa nouvelle entreprise
- **Méthode de détection :**
  - LinkedIn « People Also Viewed » sur vos contacts clients
  - LinkedIn Sales Navigator : alertes de changement d'emploi sur les profils des anciens acheteurs
  - Suivi des sorties d'entreprise via Crunchbase (quand les employés partent en masse)
  - Examen manuel : analysez mensuellement les profils LinkedIn des clients pour les activités « nouvelle entreprise »
- **Fenêtre de décadence :** 90 jours maximum. Après 90 jours, leur autorité et mandat initiaux s'estompent ; repriorisez par changement de rôle
- **Timing ideal du premier contact :** Dans les 14 jours suivant leur changement d'emploi (avant qu'ils aient déjà acheté des alternatives)
- **Vérification :** Confirmez qu'ils avaient une influence d'achat à l'ancienne entreprise (titre de poste, rôle Salesforce, drapeau propriétaire du budget)
- **Formule de message de déclenchement :**
  ```
  [Nommez le signal explicitement] "J'ai vu que vous venez de rejoindre [Entreprise] en tant que [Rôle]"
  [Pourquoi c'est important] "Quand les gens se déplacent vers une nouvelle organisation, la première chose qu'ils résolvent est [problème courant du département]"
  [Une question ouverte] "Cherchez-vous à [catégorie d'outil] pour résoudre [douleur spécifique] là, ou ce n'est pas une priorité pour le moment ?"
  ```
- **Augmentation du taux de réponse :** +35% vs. 3,4% de base
- **Exemple de déclenchement :** "J'ai vu que vous avez rejoint Acme en tant que VP des Opérations. Quand les responsables des opérations changent d'entreprise, ils veulent généralement nettoyer leur pile d'analyse. Envisagez-vous de remplacer [outil actuel] ou est-ce sur la feuille de route ?"

---

**Signal 2 : Nouvelle Direction C-Suite ou VP Embauchée dans les 90 Derniers Jours**
- **Rang :** 2 (corrélation deuxième plus élevée, ~28% de taux de réponse)
- **Pourquoi c'est important :** Les nouveaux cadres doivent se prouver rapidement (mandat des 100 jours) ; ils sont ouverts aux conversations avec les vendeurs et disposent d'un budget pour soutenir les victoires rapides
- **Méthode de détection :**
  - Page LinkedIn de l'entreprise : vérifiez la section « Embauches récentes » pour les rôles C-level ou VP
  - Crunchbase : suivez les changements de direction via l'onglet « Personnes »
  - Communiqués de presse de l'entreprise (API d'actualités ou vérification manuelle)
  - Job board API : filtrez les offres de postes C-level/VP sur les comptes cibles
  - LinkedIn Sales Navigator : définissez une alerte sur « [Entreprise] a embauché un nouveau [C-suite/VP] »
- **Fenêtre de décadence :** 90 jours. Après le jour 90, la pression du mandat s'atténue ; ils sont dans un état stable
- **Timing ideal du premier contact :** Dans les 30 jours suivant l'annonce de l'embauche (jour 1–30 = urgence maximale)
- **Vérification :** Confirmez le rôle et la ligne hiérarchique (doit être un propriétaire direct P&L ou un VP fonctionnel, pas un rôle de personnel)
- **Formule de message de déclenchement :**
  ```
  [Nommez le signal explicitement] "Félicitations pour l'arrivée du/de la nouveau/nouvelle [VP/CRO] chez [Entreprise]"
  [Pourquoi c'est important] "Les responsables [Rôle] passent généralement leurs premiers 90 jours sur [initiative courante] ; cela nécessite généralement [catégorie de solution]"
  [Une question ouverte] "Est-ce que [Entreprise] construit [capacité pertinente] ce trimestre, ou est-ce plus bas sur la feuille de route ?"
  ```
- **Augmentation du taux de réponse :** +28% vs. base
- **Exemple de déclenchement :** "Félicitations d'avoir embauché un nouveau VP des Ventes. La plupart des VP des Ventes se déplacent vite pendant leurs premiers 90 jours—généralement en refactorisnt la rémunération et les outils de vente. Est-ce sur votre assiette, ou votre playbook est-il déjà verrouillé ?"

---

**Signal 3 : Activité Haute Intention sur le Site Web (Page Tarification, Page Démo, 3+ Visites en 7 Jours)**
- **Rang :** 3 (évaluation active en cours, ~18% de taux de réponse)
- **Pourquoi c'est important :** Ils comparent activement les solutions ; vous êtes dans leur fenêtre d'évaluation en ce moment
- **Méthode de détection :**
  - Analytique du site Web : HubSpot, Segment ou suivi UTM personnalisé
  - Plateforme de données d'intention : 6sense, ZoomInfo, Demandbase (la plus fiable pour B2B SaaS)
  - Suivi sur site Drift/Intercom : marquez les comptes accédant à la page de tarification ou de démo
  - Activité de commentaires LinkedIn sur vos articles de produits (signal fort d'intention)
  - Lectures d'examens G2 (si vous avez un suivi basé sur pixel ; la plupart ne l'ont pas)
- **Fenêtre de décadence :** 7 jours maximum. Après 7 jours sans activité de suivi, supposez qu'ils sont dans le pipeline d'un autre vendeur
- **Timing ideal du premier contact :** Dans les 24 heures suivant la troisième visite ou la visualisation de la page démo (le suivi le même jour double le taux de réponse)
- **Vérification :** Confirmez la taille du compte et le rôle du visiteur (si disponible via l'outil d'intention) ; écartez si le visiteur est indépendant ou en dehors du comité d'achat
- **Formule de message de déclenchement :**
  ```
  [Nommez le signal explicitement] "J'ai remarqué que vous étiez sur notre page [tarification/démo] cette semaine"
  [Pourquoi c'est important] "Généralement, cela signifie que vous êtes en évaluation active. La plupart des équipes de votre taille passent [X semaines] à comparer—je peux aider à compresser cette chronologie"
  [Une question ouverte] "Nous comparez-vous à [concurrent connu], ou cherchez-vous quelques options en [catégorie] ?"
  ```
- **Augmentation du taux de réponse :** +18% vs. base
- **Exemple de déclenchement :** "J'ai vu que vous étiez sur notre page de tarification trois fois cette semaine. Généralement, cela signifie que vous évaluez activement—je veux m'assurer que vous ne manquez rien. Nous comparez-vous à Concurrent X, ou êtes-vous toujours en exploration ?"

---

**Signal 4 : Changement de Pile Technologique Détecté (Suppression d'un Concurrent ou Ajout d'un Outil Complémentaire)**
- **Rang :** 4 (momentum d'adoption, ~16% de taux de réponse)
- **Pourquoi c'est important :** Ils remodèlent activement leur pile technologique ; votre produit résout la douleur adjacente ; le timing compte
- **Méthode de détection :**
  - BuiltWith : surveillez les comptes cibles pour les concurrents supprimés et la nouvelle adoption d'outils
  - Datanyze : suivez les changements de pile avec API ou audits hebdomadaires manuels
  - Lectures d'examens G2 et signaux d'achat (les nouveaux vendeurs ajoutant des examens = nouvelle adoption)
  - Offres d'emploi LinkedIn mentionnant les nouvelles exigences d'outils
  - Module de pile technologique ZoomInfo
- **Fenêtre de décadence :** 14 jours. Les changements de pile nécessitent 1–2 semaines pour se stabiliser ; après 14 jours, ils ont avancé
- **Timing ideal du premier contact :** Dans les 7 jours suivant la détection du changement de pile (rattrapez-les en mi-évaluation)
- **Vérification :** Confirmez que le changement est récent (dans les 30 jours) et représente une adoption intentionnelle, pas une suppression accidentelle
- **Formule de message de déclenchement :**
  ```
  [Nommez le signal explicitement] "J'ai vu que [Entreprise] a ajouté [nouvel outil] à votre pile ce mois-ci"
  [Pourquoi c'est important] "[Nouvel outil] fait généralement surface des problèmes avec [processus connexe]. Les équipes découvrent généralement qu'elles ont besoin de [votre solution] dans les semaines"
  [Une question ouverte] "Prévoyez-vous d'intégrer cela avec [outil existant], ou refactorisez-vous complètement ce workflow ?"
  ```
- **Augmentation du taux de réponse :** +16% vs. base
- **Exemple de déclenchement :** "J'ai remarqué que vous venez d'ajouter Segment à votre pile. La plupart des entreprises qui migrent vers Segment découvrent également qu'elles ont besoin d'une meilleure gouvernance des données en aval—c'est ce que nous faisons. Pensez-vous à ce morceau, ou est-ce la phase deux ?"

---

**Signal 5 : Financement, Acquisition, Nouvelle Entrée sur le Marché ou Augmentation des Effectifs de 20%+**
- **Rang :** 5 (disponibilité budgétaire, ~12% de taux de réponse)
- **Pourquoi c'est important :** Ils ont du capital, un mandat de croissance et probablement un nouveau budget à dépenser en outils pour soutenir l'expansion
- **Méthode de détection :**
  - Crunchbase : suivi des annonces de financement et des acquisitions
  - Page LinkedIn de l'entreprise : changement des effectifs sur une fenêtre de 90 jours (comparer au trimestre précédent)
  - API du board emploi LinkedIn : augmentation des offres d'emploi (proxy pour la croissance des effectifs)
  - APIs d'actualités : F&A, nouveaux lancements sur le marché, dépôts IPO
  - 6sense ou ZoomInfo : drapeaux de compte « Croissance élevée »
- **Fenêtre de décadence :** 120 jours. Après 4 mois, le capital de croissance est alloué ; les budgets sont verrouillés
- **Timing ideal du premier contact :** Dans les 30 jours suivant l'annonce (jours 1–30 : le capital n'est pas engagé ; jours 31–90 : les budgets sont en cours d'allocation)
- **Vérification :** Confirmez que la croissance est réelle (pas une reclassification comptable ou un événement unique) ; vérifiez croisée Crunchbase, LinkedIn et les sources d'actualités
- **Formule de message de déclenchement :**
  ```
  [Nommez le signal explicitement] "Félicitations pour la Série [X] / [croissance des effectifs X] / acquisition de [Entreprise]"
  [Pourquoi c'est important] "Cette sorte de croissance déclenche généralement [goulot d'étranglement opérationnel courant]. La plupart des équipes de votre taille résolvent cela par [catégorie de solution]"
  [Une question ouverte] "Votre [équipe pertinente] prévoit-elle d'augmenter les effectifs ce trimestre, ou vous concentrez-vous d'abord sur l'efficacité ?"
  ```
- **Augmentation du taux de réponse :** +12% vs. base
- **Exemple de déclenchement :** "Félicitations pour la Série C. Généralement, cette croissance signifie que vous mettez à l'échelle votre équipe d'ingénierie. La plupart des entreprises qui mettent à l'échelle l'ing au votre rythme rencontrent des goulots d'étranglement CI/CD dans les 6 mois—le voyez-vous déjà, ou l'infrastructure est-elle toujours stable ?"

---

**Signal 6 : Modèles d'Embauche Stratégique (5+ Offres d'Emploi dans le Département Cible dans les 30 Jours)**
- **Rang :** 6 (budget approuvé et en cours, ~10% de taux de réponse)
- **Pourquoi c'est important :** Plusieurs postes ouverts = budget approuvé + embauche active = les dépenses d'outils sont imminentes pour ce département
- **Méthode de détection :**
  - API du board emploi LinkedIn : filtrez par entreprise + département + date de publication (30 derniers jours)
  - Indeed, Greenhouse, ATS board API : comptez les postes ouverts par département
  - Page carrières de l'entreprise : audit manuel des postes ouverts
  - Suivi des embauches ZoomInfo
  - Persado : signaux d'intention d'embauche
- **Fenêtre de décadence :** 45 jours. Après 6 semaines, les postes sont pourvus ou l'élan d'embauche stagne ; la fenêtre budgétaire se ferme
- **Timing ideal du premier contact :** Dans les 14 jours suivant la 5e offre d'emploi (quand il est clair que c'est un vrai push d'embauche, pas du bruit)
- **Vérification :** Confirmez que 5+ postes sont dans le même département (pas dispersés dans l'entreprise) ; vérifiez les descriptions de poste pour le mélange de séniorité (indique un investissement réel)
- **Formule de message de déclenchement :**
  ```
  [Nommez le signal explicitement] "J'ai vu que [Entreprise] a 5+ postes ouverts en [département] ce mois-ci"
  [Pourquoi c'est important] "Quand les équipes embauchent si agressivement, elles ont généralement besoin de [catégorie d'outil] pour accueillir et soutenir les nouvelles recrues rapidement"
  [Une question ouverte] "Ce sprint d'embauche est-il motivé par [initiative connue], ou développez-vous la portée de cette équipe ?"
  ```
- **Augmentation du taux de réponse :** +10% vs. base
- **Exemple de déclenchement :** "J'ai vu que vous avez 6 postes ouverts en ingénierie ce mois-ci. Généralement, quand les équipes embauchent si agressivement, elles font face à des problèmes de vélocité dans les 30 premiers jours—elles ont besoin d'une meilleure révision du code ou d'outils CI. Est-ce quelque chose auquel votre lead eng pense ?"

---

### Logique d'Empilement de Signaux

**Ne faites pas de prospection à froid sur un seul signal (rangs 3–6) seul.** Attendez l'empilement de signaux.

**Règles d'empilement de signaux :**
- **2+ signaux détectés (tout rang) = prospection prioritaire dans les 24 heures**
  - Exemple : Signal 3 (visite du site) + Signal 5 (financement) = multi-touch haute urgence
  - Exemple : Signal 4 (changement de technologie) + Signal 6 (embauche) = programmer un multi-touch
- **Signaux 1 ou 2 seuls = prospection immédiate (dans les 1 jour)** — n'attendez pas l'empilement
- **Signaux uniques 3–6 = ajouter à la cadence de nurture, pas à la prospection prioritaire** — revérifiez hebdomadairement jusqu'à ce que le signal s'empile ou se désintègre
- **3+ signaux = option nucléaire** — prospection exécutive, offre de démo personnalisée, SLA de réponse de 2 heures

**Exemple d'empilement :**
```
Lundi : Signal 3 détecté (visite du site)
  → Ajouter à la liste de nurture, vérification 1x/semaine
Mercredi : Signal 6 détecté (4 nouvelles offres d'emploi en ventes)
  → MAINTENANT : 2+ signaux. Déclencher la prospection prioritaire dans les 24h
  → Message : "J'ai remarqué que vous développez les ventes ET explorez notre plateforme cette semaine"
Vendredi : Signal 5 détecté (Crunchbase montre la Série B)
  → 3 signaux. Escalader : appel du fondateur ou du responsable des ventes
```

---

### Pile de Surveillance des Signaux

**Vérifications quotidiennes (comptes en évaluation active) :**
- LinkedIn Sales Navigator : alertes de changement d'emploi sur les personas cibles et les prospects chauds
- Tableau de bord de données d'intention (6sense, Demandbase) : activité du site, seuil de score >60%
- Drift/Intercom : notifications en temps réel sur les pages de tarification ou de vues de pages démo

**Vérifications hebdomadaires (comptes dans le pipeline ou la watchlist) :**
- API BuiltWith : changements de pile technologique (Signal 4)
- Alertes d'actualités de l'entreprise (Crunchbase, Google News API) : financement, F&A, embauches exécutives (Signaux 2, 5)
- Page LinkedIn de l'entreprise : comptage des offres d'emploi dans les départements cibles (Signal 6)
- Web scraping du board emploi : Indeed, Lever, Greenhouse pour les embauches de l'entreprise (Signal 6)
- Profil d'entreprise G2 : augmentation de l'activité d'examen = signal d'intérêt (proxy pour Signal 3)

**Audits mensuels (regard en arrière et décadence) :**
- Feuille de calcul ou CRM : marquez la date du signal, la date limite de décadence, le statut de prospection
- Élaguez les signaux décédents (plus anciens que 90 jours pour les Signaux 1–2, plus anciens que 14 jours pour le Signal 3, plus anciens que 14 jours pour le Signal 4, plus anciens que 120 jours pour le Signal 5, plus anciens que 45 jours pour le Signal 6)
- Notez les comptes par nombre de signaux et niveau d'urgence

---

### Règle de Décadence de 14 Jours (Universelle)

Tous les signaux se désintègrent. La norme industrielle est :
- **Signal 1 & 2 :** Utile pendant 90 jours, la priorité diminue après le jour 30
- **Signal 3 :** Utile pendant 7 jours (l'activité du site est liée au temps), le toucher à froid après le jour 7 est 60% moins efficace
- **Signal 4 :** Utile pendant 14 jours, devenu stérile après cela
- **Signal 5 :** Utile pendant 120 jours, la priorité diminue après le jour 30
- **Signal 6 :** Utile pendant 45 jours, le momentum stagne après 45 jours

**Implémentation :**
1. Marquez chaque signal avec la date de détection dans le CRM ou la feuille de calcul
2. Calculez la date limite de décadence (voir les fenêtres ci-dessus)
3. Automatisez avec Zapier, Make ou un script maison : si (aujourd'hui > date_signal + fenêtre_décadence), supprimez de la liste de priorité, déplacez vers nurture
4. Ne faites jamais de prospection à froid sur un signal décédent ; revérifiez si un nouveau signal apparaît

---

### Formule de Message de Premier Contact (Opérationnalisée)

Chaque premier contact doit suivre cette structure en 3 parties (max 3 phrases) :

**[Partie 1 : Nommez le signal explicitement]**
- Rend la prospection crédible et spécifique (pas spray-and-pray)
- Exemple : « J'ai vu que vous venez de rejoindre Acme en tant que VP des Opérations » OU « J'ai remarqué que vous étiez sur notre page démo trois fois cette semaine »

**[Partie 2 : Pourquoi c'est important pour eux (pas pour vous)]**
- Articulez le problème commercial qu'ils risquent de rencontrer *en raison* de ce signal
- Exemple : « Quand les responsables des opérations passent à une nouvelle entreprise, la première chose qu'ils abordent généralement est la visibilité de la chaîne d'approvisionnement » (Signal 1)
- Exemple : « Quand vous ajoutez un entrepôt de données, vous découvrez généralement des problèmes de qualité des données en aval » (Signal 4)

**[Partie 3 : Une question ouverte (pas une présentation)]**
- Montre que vous êtes curieux, pas en train de vendre
- Rend la réponse plus facile (binaire/spécifique, pas ouverte)
- Exemple : « Cherchez-vous [catégorie] pour résoudre cela, ou la visibilité n'est-elle pas un problème pour vous pour le moment ?"
- Exemple : « Votre équipe pense-t-elle déjà à la gouvernance des données, ou est-ce la phase deux ? »

**Modèle :**
```
[Signal] "J'ai remarqué [signal spécifique]"
[Problème] "[Rôle/situation] signifie généralement [implication commerciale]"
[Question] "Pensez-vous à [zone de solution pertinente], ou ce n'est pas sur la feuille de route ?"
```

---

### Repères de Taux de Réponse (Base vs. Signal)

| Signal | Base | Avec Signal | Augmentation |
|--------|------|------------|-------------|
| Aucun signal (email à froid) | 3,4% | — | — |
| Signal 1 (ancien client) | 3,4% | 35% | +10,3x |
| Signal 2 (nouveau C-suite/VP) | 3,4% | 28% | +8,2x |
| Signal 3 (activité du site) | 3,4% | 18% | +5,3x |
| Signal 4 (changement de technologie) | 3,4% | 16% | +4,7x |
| Signal 5 (financement/croissance) | 3,4% | 12% | +3,5x |
| Signal 6 (embauche) | 3,4% | 10% | +2,9x |
| 2+ signaux (empilés) | 3,4% | 42–58% | +12–17x |

*Source : Recherche ColdIQ (2024). Les repères supposent B2B SaaS, comptes de 50–1000 employés, personas senior/mid-market. YMMV.*

---

## Exemple

**Scénario : VP Ventes chez Acme Corp**

**Jour 1 — Lundi 9 h**
- Alerte LinkedIn : Sarah Chen rejoint Acme Corp en tant que VP des Ventes (Signal 2)
- Vérification : Vérifiez LinkedIn, confirmez que le rôle est VP, rapport à CRO, taille de l'entreprise = 350 employés, SaaS-adjacent
- Décision : Signal 2 seul = prospection immédiate (rang 2, pas d'empilement requis)
- Fenêtre de décadence : 90 jours, prospection prioritaire jour 1–30

**Email de premier contact (envoyé 9 h 15 le même jour) :**
```
Sujet : Félicitations pour le rôle de VP chez Acme

Sarah,

Félicitations d'avoir rejoint Acme en tant que VP des Ventes—ravi de voir une nouvelle direction là.

La plupart des VP des Ventes passent leurs premiers 90 jours sur deux choses : la restructuration de la rémunération et la modernisation des outils. 
Habituellement au mois 2, ils évaluent les workflows CRM ou les piles d'engagement des ventes pour atteindre leurs objectifs de ramp plus rapidement.

Votre playbook est-il déjà verrouillé là, ou êtes-vous toujours en train de réfléchir à ce morceau ?

Cordialement,
[Nom]
```

**Suivi de la décadence :**
- Email envoyé : Jour 0 (Lundi)
- Suivi 1 : Jour 3 (Jeudi) si pas de réponse
- Suivi 2 : Jour 7 (Lundi suivant) si pas de réponse
- Suivi 3 : Jour 14 si pas de réponse
- Signal d'obsolescence : Jour 90 (si pas de réponse d'ici là, supprimez du pipeline actif)

---

**Jour 3 — Mercredi 10 h**
- Alerte de données d'intention : Acme.com a visité votre page démo (Signal 3)
- Vérification manuelle : Drift montre la visite de [sarah.chen@acme.com](mailto:sarah.chen@acme.com) — la même personne
- Décision : 2+ signaux maintenant (Signal 2 + Signal 3) = escalader vers la prospection prioritaire dans les 24h
- Action immédiate : 

**Deuxième contact (offre d'appel prioritaire, envoyée 10 h 30 le même jour) :**
```
Sujet : Re: Félicitations pour le rôle de VP chez Acme—question rapide

Sarah,

J'ai vu que vous avez consulté notre page démo ce matin. Vu votre timing chez Acme, je suppose que vous êtes en 
phase d'évaluation sur les outils de vente. 

Plutôt qu'un autre email, seraient 15 min de votre temps meilleur ? Content de vous montrer comment nous 
résolvons généralement les workflows spécifiques qu'Acme risque de rencontrer.

Dites-moi votre disponibilité cette semaine ou la prochaine ?

Cordialement,
[Nom]
```

**Résultat :** Si Sarah répond à l'un ou l'autre email, déplacez-la vers la piste de démo/conversation. Si pas de réponse avant le jour 14, réévaluez : Signal 3 (activité du site) a-t-il décédé ? (Oui, 7 jours max—Signal 3 est devenu stérile.) Vérifiez les nouveaux signaux. Si aucun nouveau signal n'apparaît, continuez la cadence de nurture, 1x/semaine, jusqu'au jour 90.

---

**Exemple réel de décadence (ce qu'il NE FAUT PAS faire) :**
- Jour 1 : Signal 5 détecté—Acme lève une Série B (financement)
- Jour 60 : Vous envoyez un email à froid sur le financement
  - ❌ Mal : 60 jours dépasse la fenêtre de priorité (jour 1–30) ; le budget est déjà alloué
  - ✓ Bien : Utilisez-le comme contexte doux (« J'ai vu Acme lever une Série B au début du printemps »), mais commencez par un signal nouveau et actuel

---
