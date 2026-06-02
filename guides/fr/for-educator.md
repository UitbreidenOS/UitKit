# Claude pour les Enseignants et Créateurs de Cours

Tout ce dont un enseignant, professeur, concepteur pédagogique ou créateur de cours a besoin pour piloter la planification de leçons augmentée par l'IA, le développement de programmes, l'analyse des retours d'étudiants, la conception d'évaluations et la création de contenus dans Claude Code.

---

## À qui s'adresse ce guide

Vous êtes enseignant, chargé de cours, concepteur pédagogique, professionnel de la formation et du développement (L&D), ou créateur de cours indépendant. Vous passez un temps considérable à planifier vos leçons, rédiger des évaluations, créer du contenu et analyser les retours d'étudiants — un travail qui se fait avant et après les cours, rarement pendant les heures rémunérées. Claude Code compresse le travail de préparation afin que vous puissiez consacrer plus de temps à ce que vous seul pouvez faire : enseigner réellement, accompagner les apprenants et y répondre en temps réel.

**Avant Claude Code :** 3 heures pour planifier une leçon bien structurée de zéro. 2 heures pour créer un quiz avec des questions de qualité. 90 minutes pour donner du sens à 30 enquêtes de retour à questions ouvertes.

**Après :** Plan de leçon en 20 minutes. Quiz avec corrigé en 15 minutes. Synthèse des retours en 10 minutes.

---

## Installation en 30 secondes

```bash
# Installer les compétences pour enseignants
npx claudient add skill productivity/lesson-planner
npx claudient add skill productivity/student-feedback-analyzer
npx claudient add skill small-business/online-course-creator
npx claudient add skill small-business/newsletter-publisher
npx claudient add skill productivity/lit-review

# Installer l'agent chercheur scientifique
npx claudient add agent roles/scientific-researcher
```

---

## Votre stack Claude Code pour enseignants

### Compétences (commandes slash)

| Compétence | Ce qu'elle fait | Quand l'utiliser |
|---|---|---|
| `/lesson-planner` | Plan de leçon complet : objectifs, activités, évaluations, différenciation, matériel | Toute nouvelle leçon ou adaptation |
| `/student-feedback-analyzer` | Analyser les résultats d'enquêtes et les données d'évaluation : thèmes, lacunes, améliorations | Après la collecte des retours, après les évaluations |
| `/online-course-creator` | Structure complète du cours : modules, parcours d'apprentissage, scripts vidéo, quiz, textes de vente | Création d'un cours sur une plateforme (Teachable, Thinkific, etc.) |
| `/newsletter-publisher` | Newsletter du cours ou séquence d'e-mails pour les apprenants — contenu en goutte-à-goutte, engagement | Construction de communauté, communication continue avec les apprenants |
| `/lit-review` | Revue de littérature et de recherche pour le contenu du cours — enseignement fondé sur des données probantes | Cours académiques, programme ancré dans la recherche |

### Agent

| Agent | Modèle | Quand l'activer |
|---|---|---|
| `scientific-researcher` | Opus | Revue de littérature approfondie, développement de programme fondé sur des données probantes, recherche académique |

---

## Flux de travail quotidien

### Avant le cours (20-30 minutes de préparation)

**1. Plan de leçon — préparer une nouvelle leçon**
```
/lesson-planner

Construis une leçon sur [sujet] pour [public].

Durée : [X minutes]
Format : [en présentiel / en ligne / hybride]
Connaissances préalables : [ce qu'ils savent déjà]
Objectifs : [ce qu'ils seront capables de faire après — ou laisse Claude les formuler]
Contraintes clés : [technologie disponible, taille du groupe, besoins d'accessibilité]

Génère le plan de leçon complet avec minutage, activités et un ticket de sortie.
```

**2. Conception d'évaluation — pour le quiz ou le projet de demain**
```
/lesson-planner

Conçois une évaluation pour [sujet de la leçon].

Objectifs d'apprentissage : [liste issue du plan de leçon]
Type d'évaluation : [quiz / réponse courte / projet / rubrique de présentation]
Temps alloué : [X minutes / X jours]
Niveau de Bloom : [mémorisation / application / analyse / évaluation]

Génère les questions avec un corrigé, et une rubrique pour les composantes à questions ouvertes.
```

---

### Après le cours / fin d'unité

**3. Analyse des retours — donner du sens aux données d'enquête**
```
/student-feedback-analyzer

Analyse les retours du [nom du cours/de la leçon].

Notes quantitatives : [colle les moyennes de ton enquête]
Réponses à questions ouvertes (anonymisées) : [colle toutes les réponses]

Quels sont les schémas récurrents ? Que devrais-je changer la prochaine fois ? Qu'est-ce qui a bien fonctionné ?
```

**4. Bilan d'évaluation — ce que les résultats vous révèlent**
```
/student-feedback-analyzer

Ma classe vient de terminer [nom de l'évaluation].

Moyenne de la classe : [X]%
Distribution des notes : [colle]
Détail question par question : [colle le taux de réussite par question]
Objectifs évalués : [liste]

Où se situent les lacunes d'apprentissage ? Que dois-je réenseigner ? Qu'est-ce qui est maîtrisé ?
```

---

### Développement de cours (travail à plus long terme)

**5. Structure de cours en ligne**
```
/online-course-creator

Construis la structure du cours sur [sujet].

Public cible : [qui ils sont, connaissances préalables]
Format : [vidéo en autonomie / basé sur une cohorte / bootcamp]
Durée : [X semaines / X heures de contenu]
Plateforme : [Teachable / Thinkific / Udemy / LMS interne]
Objectifs d'apprentissage : [transformation principale — ce qu'ils peuvent faire après ?]

Génère : plan des modules, séquence des leçons, points d'évaluation, activités de clôture.
```

**6. Revue de littérature pour le contenu du cours**
```
/lit-review

Recherche la base de données probantes pour [méthodologie d'enseignement / domaine thématique].

Je conçois un cours sur [sujet] et je veux m'assurer que le programme repose sur des données probantes.
Que dit la recherche sur [aspect spécifique de votre programme] ?
Y a-t-il des articles de référence ou des résultats faisant consensus que je devrais connaître ?
```

---

### Communauté et engagement des apprenants

**7. Séquence d'e-mails pour les apprenants**
```
/newsletter-publisher

Rédige une séquence d'e-mails pour les apprenants inscrits au [nom du cours].

Objectif de la séquence : [accueil / point hebdomadaire / ré-engagement / célébration]
Ton : [encourageant / professionnel / conversationnel]
Messages clés pour [cet e-mail ou cette semaine] : [décrire]
Longueur : [court — 150 mots / complet — 300 mots]
```

---

## Plan de montée en compétence sur 30 jours (nouveaux enseignants ou nouveau cours)

### Semaine 1 — Fondations de la planification de leçons
- Installer toutes les compétences pour enseignants : `npx claudient add skill productivity/[nom]`
- Utiliser `/lesson-planner` pour planifier vos 3 prochaines leçons — comparer au processus habituel
- Lancer le rédacteur d'objectifs d'apprentissage sur chaque leçon — transformer des objectifs vagues en résultats mesurables
- Créer votre premier ticket de sortie et l'utiliser en classe

### Semaine 2 — Évaluation et retours
- Utiliser `/lesson-planner` pour concevoir une évaluation — générer les questions et la rubrique
- Après l'évaluation, coller les résultats dans `/student-feedback-analyzer` — pratiquer l'interprétation des données
- Analyser un ticket de sortie — que devriez-vous aborder au début du prochain cours ?

### Semaine 3 — Retours et amélioration
- Envoyer une enquête de retour à mi-parcours (5 questions maximum)
- Utiliser `/student-feedback-analyzer` pour analyser les résultats
- Apporter au moins un changement visible basé sur les retours — et l'annoncer aux étudiants (renforce la confiance et les taux de réponse aux enquêtes futures)

### Semaine 4 — Développement du cours
- Utiliser `/online-course-creator` si vous construisez un cours, ou `/lesson-planner` pour cartographier la prochaine unité
- Utiliser `/lit-review` pour vérifier qu'une approche pédagogique majeure de votre programme repose sur des données probantes
- Mesurer le temps : combien de temps prend maintenant la planification de leçons par rapport à avant Claude ?

---

## Flux de travail pour la création de contenu

### Créer un quiz (de bout en bout)

```
/lesson-planner

Conçois un quiz pour [sujet de la leçon/unité].

Objectifs d'apprentissage évalués :
1. [Objectif]
2. [Objectif]
3. [Objectif]

Types de questions nécessaires : [QCM / réponse courte / vrai-faux / texte à trous / cas pratique]
Niveau de difficulté : [introductif / intermédiaire / avancé]
Nombre total de questions : [N]
Temps alloué : [X minutes]
Niveaux de Bloom à couvrir : [mémorisation : X questions / application : X questions / analyse : X questions]

Génère : le quiz avec corrigé, les distracteurs pour les QCM ciblant les idées fausses courantes, et une rubrique de notation pour les questions ouvertes.
```

### Créer une rubrique

```
/lesson-planner

Conçois une rubrique de notation pour [type de devoir : dissertation / projet / présentation / rapport de laboratoire].

Objectifs d'apprentissage évalués : [liste]
Description du devoir : [brève description de ce que les étudiants soumettent]
Échelle de points : [4 points / pourcentage / note alphabétique / fondé sur les standards]

Génère une rubrique avec :
- 4-5 dimensions (critères)
- 4 niveaux de performance par dimension (excellent / compétent / en développement / débutant)
- Des descripteurs clairs et comportementaux pour chaque cellule — pas de formules vagues comme "montre une compréhension"
```

### Rédiger les notes d'exposé pour un diaporama

```
J'ai une présentation sur [sujet] avec ces diapositives :

Diapositive 1 : [titre et point clé]
Diapositive 2 : [titre et point clé]
[Continuer]

Pour chaque diapositive, rédige :
- 2-3 phrases de notes d'exposé (ce qu'il faut dire, pas ce qui est sur la diapositive)
- Une question de discussion à poser à la classe après cette diapositive
- Une idée fausse courante à aborder de manière préventive
```

### Guide de facilitation d'atelier

```
Rédige un guide de facilitation pour un atelier de [X heures] sur [sujet].

Public : [qui ils sont]
Objectif : [ce qu'ils devraient être capables de faire ou de penser différemment]
Format : [en présentiel / virtuel / hybride]
Taille du groupe : [N participants]

Génère :
1. Travail préparatoire à assigner (le cas échéant)
2. Instructions de mise en place de la salle/plateforme
3. Brise-glace ou ouverture (en lien avec le thème de l'atelier)
4. Activités principales avec notes de facilitation
5. Questions de discussion pour chaque segment
6. Défis de facilitation courants et comment les gérer
7. Réflexion de clôture et engagement d'action
8. E-mail post-atelier à envoyer aux participants
```

---

## Intégrations d'outils

### Google Classroom / Canvas / Blackboard
Claude génère des plans de leçons, des questions de quiz, des rubriques et des annonces sous forme de texte → vous collez dans votre LMS. Pour les questions de quiz spécifiquement, formatez la sortie de Claude en questions numérotées → importez via la fonction d'importation groupée de votre LMS.

### Google Forms / Microsoft Forms
Claude rédige vos questions d'enquête de retour → collez dans Forms → collectez → exportez en CSV → collez les réponses dans `/student-feedback-analyzer`. La boucle complète prend environ 15 minutes une fois les données collectées.

### Notion (pour l'organisation du cours)
Construisez votre structure de cours dans Notion — une page par leçon. Claude génère le contenu du plan de leçon → collez dans chaque page. Utilisez la base de données de Notion pour suivre quelles leçons ont des données de ticket de sortie et des retours collectés.

### Canva (pour les supports visuels)
Claude rédige le contenu des diapositives, des polycopiés et des infographies → vous concevez dans Canva. Utilisez Claude pour écrire des puces spécifiques et claires — Canva fonctionne mieux quand le texte est déjà bien travaillé.

### Zoom / Google Meet
Après les sessions synchrones en ligne, collez les transcriptions de chat ou les notes de session dans `/meeting-to-action` pour extraire les points de discussion et les questions sans réponse pour le suivi.

---

## Indicateurs à suivre

| Activité | Temps manuel | Avec Claude |
|---|---|---|
| Plan de leçon (nouveau sujet) | 3 heures | 20-30 min |
| Quiz avec corrigé | 90 min | 15 min |
| Rubrique de devoir | 45 min | 10 min |
| Analyse d'enquête de retour | 90 min | 15 min |
| Analyse des données d'évaluation | 60 min | 20 min |
| Guide de facilitation d'atelier | 3 heures | 30 min |

**Que faire avec le temps gagné :** Plus de soutien individuel aux étudiants, des retours plus réactifs sur les travaux des étudiants, une personnalisation plus approfondie des leçons, de la lecture professionnelle et du développement.

---

## Erreurs courantes (et comment Claude Code les prévient)

**Erreur 1 : Objectifs d'apprentissage vagues**
`/lesson-planner` impose des verbes de la taxonomie de Bloom — plus de "comprendre" ou "apprécier". Les objectifs deviennent mesurables.

**Erreur 2 : Évaluations qui testent la mémorisation quand les objectifs requièrent l'application**
`/lesson-planner` associe les questions d'évaluation aux objectifs par niveau de Bloom. Le désalignement est visible.

**Erreur 3 : Données de retours qui ne mènent jamais à des changements**
`/student-feedback-analyzer` se termine par des recommandations concrètes et actionnables. La sortie est une liste de tâches, pas un rapport.

**Erreur 4 : Leçons sans vérification de la compréhension**
Chaque plan de leçon de `/lesson-planner` inclut un ticket de sortie. Si la leçon est trop courte, c'est une question formative intégrée à l'activité.

**Erreur 5 : Enseigner de la même façon année après année parce que la refonte prend trop de temps**
Avec Claude, la révision d'un cours qui prenait une semaine prend une journée. L'énergie d'activation pour l'amélioration chute considérablement.

---

## Ressources

- [Démarrer avec Claude Code](getting-started.md)
- [Compétence planificateur de leçons](../skills/productivity/lesson-planner.md)
- [Compétence analyseur de retours d'étudiants](../skills/productivity/student-feedback-analyzer.md)
- [Compétence créateur de cours en ligne](../skills/small-business/online-course-creator.md)
- [Compétence revue de littérature](../skills/productivity/lit-review.md)

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous créons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
