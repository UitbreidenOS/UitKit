# Claude pour les Recruteurs et les RH

Tout ce dont un recruteur ou un professionnel RH a besoin pour mener des pipelines de recrutement augmentés par l'IA — de la rédaction de la fiche de poste à la structuration des entretiens en passant par la génération de lettres d'offre — sans perdre le jugement humain qui fait les bonnes décisions de recrutement.

---

## À qui s'adresse ce guide

Vous êtes recruteur, spécialiste en acquisition de talents ou généraliste RH responsable de pourvoir des postes rapidement et efficacement. Vous gérez plusieurs postes ouverts, coordonnez avec des hiring managers dont les exigences ne sont pas claires, et êtes censé sourcer, trier, évaluer et finaliser des candidats — souvent sans une équipe complète.

**Avant Claude Code :** 2 à 3 heures pour rédiger une fiche de poste complète et une grille d'évaluation. 1 heure pour construire une recherche de sourcing et une séquence de prospection. 30 minutes pour documenter chaque débriefing d'entretien. Recherche de marché pour le benchmarking de rémunération effectuée manuellement depuis Glassdoor.

**Après :** Fiche de poste complète en 15 minutes. Recherche de sourcing + messages de prospection en 20 minutes. Grille d'évaluation construite pour n'importe quel poste en 30 minutes. Benchmarks de rémunération recherchés et structurés en 10 minutes. Vous passez plus de temps sur les conversations avec les candidats et moins sur la documentation.

---

## Installation en 30 secondes

```bash
# Installer la stack recruteur complète
npx claudient add skill productivity/interview-scorecard
npx claudient add skill productivity/comp-benchmarker
npx claudient add skill productivity/candidate-sourcer
npx claudient add skill small-business/hiring-pipeline
npx claudient add skill small-business/job-description
npx claudient add skill productivity/team-onboarding
npx claudient add agent advisors/chro-advisor
```

---

## Votre stack recruteur Claude Code

### Compétences (slash commands)

| Compétence | Ce qu'elle fait | Quand l'utiliser |
|---|---|---|
| `/candidate-sourcer` | Chaînes de recherche booléenne, messages de prospection LinkedIn, suivi du pipeline | Quand vous devez sourcer proactivement |
| `/interview-scorecard` | Questions basées sur les compétences, grille de notation, conception du panel, modèle de débriefing | Chaque nouveau poste — avant le premier entretien |
| `/comp-benchmarker` | Grilles salariales, directives sur l'équité, génération de lettres d'offre | Avant de publier le poste et avant de faire une offre |
| `/job-description` | Définition du rôle, rédaction des exigences, calibration du ton | Ouverture d'un nouveau poste |
| `/hiring-pipeline` | Étapes du pipeline, SLAs, modèles de reporting | Gestion de plusieurs postes ouverts |
| `/team-onboarding` | Plan d'intégration 30-60-90 jours pour les nouvelles recrues | Quand une offre est acceptée |

### Agents

| Agent | Modèle | Quand le solliciter |
|---|---|---|
| `chro-advisor` | Opus | Conception organisationnelle, stratégie RH, gestion de questions RH sensibles |

---

## Flux de travail quotidien

### Matin (20-30 minutes)

**1. Revue du pipeline — lundi matin**
```
/hiring-pipeline

Revue hebdomadaire du pipeline — semaine du [DATE].

Postes ouverts :
| Poste | Dept | Étape | Candidats en pipeline | Date cible |
|---|---|---|---|---|
| [Titre] | [Dept] | [Sourcing / Présélection / Entretiens / Offre] | [N] | [date] |
| [Titre] | [Dept] | [étape] | [N] | [date] |

Pour chaque poste :
- Quel est le goulot d'étranglement ? (pas assez de candidats / candidats qui n'avancent pas / offres refusées)
- Quelles actions sont dues cette semaine ?
- Des postes à risque de manquer leur date cible ?

Donnez-moi une liste d'actions priorisées pour cette semaine.
```

**2. Prospection candidats — deux fois par semaine**
```
/candidate-sourcer

Je source pour [Poste] à [Lieu].

Qualifications indispensables :
- [Qualification 1]
- [Qualification 2]

Entreprises cibles : [lister 5 à 8 entreprises où je trouverais ce profil]

Construire :
1. Chaîne de recherche booléenne LinkedIn Recruiter
2. Variante de recherche Google X-Ray
3. Modèle de message de prospection (première ligne personnalisée + accroche rôle + CTA)
4. Message de relance (pour les non-répondants après 7 jours)

J'envoie 20 messages cette semaine — aidez-moi à structurer la prospection.
```

---

### Préparation des entretiens

**3. Construire une grille d'évaluation pour un nouveau poste**
```
/interview-scorecard

Construisez une grille d'évaluation pour [Poste].

Niveau : [IC Senior / Manager / Directeur]
Département : [Dept]
Responsabilités clés :
- [Responsabilité 1]
- [Responsabilité 2]
- [Responsabilité 3]

Compétences indispensables :
- [Compétence 1]
- [Compétence 2]
- [Compétence 3]

Éliminatoires :
- [Tout ce qui disqualifie]

Construire : 4 à 5 compétences avec 2 à 3 questions chacune, grille de notation (1-4),
conception du panel d'entretien (qui évalue quelle compétence),
et modèle de débriefing pour le hiring manager.
```

**4. Préparation spécifique au candidat (avant un entretien panel)**
```
/interview-scorecard

J'interviewe [Nom du Candidat] pour [Poste] demain.

Son parcours : [décrire — poste actuel, entreprise, expérience pertinente depuis LinkedIn ou CV]
La compétence que j'évalue : [quelle compétence m'a été assignée]
Ce que je sais de ses points forts : [ce qui ressort de son CV/présélection]
Ce dont je ne suis pas certain : [les lacunes ou points à sonder]

Donnez-moi :
- 3 questions adaptées à ce candidat (pas génériques — référencer son parcours)
- À quoi ressemblent des réponses fortes vs. faibles pour chaque question
- Des relances si la réponse est trop générale
- Ce que je dois signaler au débriefing
```

---

### Gestion des offres

**5. Recherche de rémunération et construction de l'offre**
```
/comp-benchmarker

Construisez une offre de rémunération pour [Poste] chez [Entreprise].

Poste : [Titre]
Niveau : [IC Senior / Manager]
Lieu : [Ville, Pays]
Stade de l'entreprise : [Série A / B / cotée / grande entreprise]

Notre grille actuelle pour ce poste : [X] € - [Y] € de base
Rémunération actuelle du candidat : [X] € base, [X] € bonus, [X] € équité
Offre concurrente (si connue) : [X] € chez [Entreprise]

Construire :
1. Benchmark de marché pour ce poste et cette localisation (où se situe notre grille ?)
2. Offre recommandée dans notre grille avec justification
3. Package d'équité (options ou RSUs selon notre stade)
4. Résumé complet du package d'offre
5. Script pour l'appel d'offre verbal
6. Réponses aux objections si contre-offre
```

**6. Lettre d'offre**
```
/comp-benchmarker

Générez une lettre d'offre pour [Nom complet du Candidat] pour le poste de [Poste].

Entreprise : [Nom]
Date de début : [date]
Salaire de base : [X] €
Bonus : [X% du base, payé annuellement]
Équité : [X actions, acquisition sur 4 ans, falaise à 1 an]
Avantages : [décrire]
Lieu : [ville ou télétravail]
Rattachement hiérarchique : [Nom du Manager, Titre]
Expiration de l'offre : [date — accorder 5 à 7 jours ouvrables]

Générez une lettre d'offre professionnelle avec tous les composants clairement énoncés.
Incluez une note indiquant que l'équité est soumise à l'approbation du conseil d'administration.
```

---

### Passation d'intégration

**7. Plan d'intégration pour une nouvelle recrue**
```
/team-onboarding

Construisez un plan d'intégration sur 30-60-90 jours pour [Nom de la Recrue] qui rejoint en tant que [Poste].

Date de début : [date]
Manager : [nom]
Équipe : [décrire l'équipe qu'il/elle rejoint]
Parties prenantes clés à rencontrer dans les 30 premiers jours : [liste]
Objectifs principaux des 90 premiers jours : [à quoi ressemble le succès ?]
Outils et systèmes à configurer : [liste]
Contexte spécifique au rôle : [nuances, projets en cours, défis hérités]

Produire : plan structuré 30-60-90 avec jalons hebdomadaires, calendrier de réunions avec les parties prenantes,
et critères de succès pour chaque phase.
```

---

## Plan de montée en compétences sur 30 jours (nouveaux recruteurs ou généralistes RH)

### Semaine 1 — Exigences du poste et conception du processus
- Installer toutes les compétences via les commandes d'installation ci-dessus
- Pour chaque poste ouvert : exécuter `/interview-scorecard` pour documenter ce que vous recrutez avant de toucher à des candidats
- Exécuter `/comp-benchmarker` pour chaque poste ouvert — connaître votre grille avant de sourcer ou de trier
- Auditer votre pipeline actuel : quels postes sont bloqués et pourquoi ?

### Semaine 2 — Sourcing actif
- Exécuter `/candidate-sourcer` pour vos 2 meilleurs postes ouverts — construire des chaînes de recherche et des séquences de prospection
- Envoyer 20+ messages de prospection par poste cette semaine
- Utiliser `/job-description` pour auditer ou réécrire toute fiche de poste publiée depuis > 30 jours sans candidats de qualité
- Établir votre taux de conversion sourcing-vers-présélection de référence

### Semaine 3 — Processus d'entretien
- Mener chaque entretien planifié en utilisant la grille de la semaine 1
- Conduire le débriefing en utilisant le processus structuré — pas de discussion ouverte
- Suivre : où les offres sont-elles refusées ? Rémunération, clarté du rôle ou durée du processus ?
- Partager une amélioration de processus de sourcing et d'évaluation avec le hiring manager

### Semaine 4 — Offre et reporting
- Faire votre première offre en utilisant les données de `/comp-benchmarker` — défendre le chiffre avec la recherche de marché
- Conduire la revue hebdomadaire du pipeline et partager les métriques avec la direction
- Construire votre premier rapport de recrutement mensuel : délai de recrutement par poste, qualité des sources, taux d'acceptation des offres
- Identifier : quel est le principal goulot d'étranglement de votre processus de recrutement actuellement ?

---

## Intégrations d'outils

### LinkedIn Recruiter

Utilisez `/candidate-sourcer` pour générer des chaînes booléennes → exécutez dans LinkedIn Recruiter. Exportez les profils → construisez votre liste de prospection dans Recruiter → utilisez les modèles générés par Claude pour les InMails.

### Greenhouse / Lever / Ashby (ATS)

Exportez les données du pipeline de candidats en CSV → collez dans Claude pour analyse. Claude fonctionne avec n'importe quel export ATS. Utilisez Claude pour :
- Rédiger des retours d'entretien structurés qui vont dans l'ATS
- Générer le texte de la lettre d'offre à coller dans DocuSign
- Analyser les abandons du pipeline par étape

### HubSpot ou Notion pour le suivi du pipeline

Si vous n'avez pas d'ATS formel, utilisez la structure de suivi du pipeline de `/candidate-sourcer` dans Notion ou un tableur. Claude peut lire vos données de pipeline et générer des rapports de statut hebdomadaires.

### Levels.fyi / Glassdoor (recherche de rémunération)

Claude utilise vos données de marché collées depuis ces sources pour calibrer les recommandations dans `/comp-benchmarker`. Extrayez les données pertinentes, collez-les, et Claude les analyse dans le contexte de votre poste et du stade de votre entreprise.

---

## Métriques à suivre

| Métrique | Définition | Vert | Jaune | Rouge |
|---|---|---|---|---|
| Délai de recrutement | Jours de l'ouverture du poste à l'acceptation de l'offre | < 30 jours | 30-60 jours | > 60 jours |
| Taux d'acceptation des offres | % des offres émises acceptées | > 85 % | 70-85 % | < 70 % |
| Taux de réponse au sourcing | % des messages de prospection qui obtiennent une réponse | > 20 % | 10-20 % | < 10 % |
| Conversion du funnel (sourcé → recruté) | % des profils sourcés qui deviennent des recrues | > 3 % | 1-3 % | < 1 % |
| Ratio entretien-offre | Nombre d'entretiens par recrutement | < 5:1 | 5-8:1 | > 8:1 |
| Rétention des nouvelles recrues à 90 jours | % des recrues encore en poste à 90 jours | > 90 % | 80-90 % | < 80 % |
| Satisfaction du hiring manager | Notée par les hiring managers après recrutement | > 4/5 | 3-4/5 | < 3/5 |

---

## Erreurs de recrutement courantes (et comment Claude Code les évite)

**Erreur 1 : Commencer à sourcer avant de savoir ce que vous recrutez**
`/interview-scorecard` impose la définition des compétences avant toute prospection. Si vous ne pouvez pas rédiger la grille, vous ne savez pas encore ce que vous recrutez.

**Erreur 2 : Messages InMail génériques**
`/candidate-sourcer` produit des modèles qui nécessitent une première ligne personnalisée. Pas d'accroche personnelle = ne pas envoyer.

**Erreur 3 : Surprises de rémunération à l'étape de l'offre**
`/comp-benchmarker` construit la grille avant que vous commenciez à trier. Les candidats dont les attentes ne correspondent pas à votre grille doivent être disqualifiés au premier appel, pas à l'offre.

**Erreur 4 : Débriefing par consensus (effet HiPPO)**
La structure de débriefing dans `/interview-scorecard` exige que chaque intervieweur partage ses notes avant une discussion ouverte. Cela évite que la personne la plus senior de la salle ancre l'opinion de tout le monde.

**Erreur 5 : Pas de plan d'intégration prêt le Jour 1**
`/team-onboarding` génère le plan 30-60-90 avant que le candidat commence — pas la semaine de son arrivée. Une mauvaise première semaine est un signal de départ précoce évitable.

---

## Ressources

- [Démarrer avec Claude Code](./getting-started.md)
- [Compétence grille d'entretien](../skills/productivity/interview-scorecard.md)
- [Compétence benchmarking de rémunération](../skills/productivity/comp-benchmarker.md)
- [Compétence sourcing de candidats](../skills/productivity/candidate-sourcer.md)
- [Workflow de pipeline de recrutement](../workflows/recruiting-pipeline.md)
- [Compétence intégration d'équipe](../skills/productivity/team-onboarding.md)

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
