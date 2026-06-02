---
name: content-brief
description: "Brief de contenu optimisé SEO : ciblage des mots-clés, plan, lacunes concurrentielles, liens internes, CTA"
---

# Compétence Content Brief

## Quand activer
- Briefer un rédacteur (humain ou IA) avant de produire un article de blog, une landing page ou un guide
- S'assurer que les fondamentaux SEO sont intégrés avant de commencer à écrire, pas après
- Identifier ce qui manque dans le contenu des concurrents avant de choisir votre angle
- Structurer du contenu long-format pour qu'il obtienne des featured snippets et se classe bien
- Standardiser la qualité des briefs dans toute une équipe contenu pour que chaque pièce atteigne le même niveau

## Quand NE PAS utiliser
- Publications courtes sur les réseaux sociaux — trop légères pour être briefées ainsi
- Documents internes, SOPs ou supports de vente — structure différente, non orientée SEO
- Vous rédigez le contenu vous-même sans brief — commencez directement à écrire
- Contenu réactif / newsjacking — la rapidité importe plus que la profondeur du brief ici

## Instructions

### Prompt principal de brief de contenu

```
Générer un brief de contenu SEO complet pour ce contenu.

Mot-clé cible : [mot-clé principal]
Mots-clés secondaires : [listez 3-5 termes connexes]
Audience cible : [personne spécifique — intitulé de poste, contexte, problème qu'elle cherche à résoudre]
Type de contenu : [tutoriel / liste / comparaison / étude de cas / pilier / opinion]
Nombre de mots cible : [basé sur l'analyse concurrentielle — demandez à Claude de recommander si incertain]
Publication : [blog de l'entreprise / article invité / landing page]
CTA business : [ce que nous voulons que le lecteur fasse à la fin]
Ton : [autoritaire / conversationnel / technique / accessible]
URLs concurrentes à surpasser : [top 3-5 pages classées pour le mot-clé principal]

Produisez :

## 1. Stratégie de mots-clés
- Mot-clé principal : [correspondance exacte, estimation du volume de recherche, difficulté]
- Mots-clés sémantiques à inclure : [termes LSI, variantes de questions, mentions d'entités]
- Opportunité de featured snippet : [oui/non, et quel format cibler]
- Intention de recherche : [informationnelle / navigationnelle / commerciale / transactionnelle]

## 2. Analyse des lacunes concurrentielles
Pour chaque URL concurrente :
- Ce qu'elle couvre bien (ne l'ignorez pas — égalez ou dépassez)
- Ce qu'elle manque (votre angle de différenciation)
- Nombre de mots et profondeur du contenu
- Données uniques, exemples ou perspectives absents

## 3. Angle recommandé
Une phrase : pourquoi ce contenu se classera ET sera partagé par rapport aux concurrents.

## 4. Plan de contenu complet
Avec les H2 et H3, le nombre de mots estimé par section, et les notes pour le rédacteur.

## 5. Liens internes
- 3-5 pages de notre site qui devraient pointer VERS ce contenu
- 3-5 contenus existants vers lesquels ce nouveau contenu devrait pointer

## 6. Balise title, meta description et slug d'URL

## 7. Checklist SEO on-page
```

### Cadre de stratégie des mots-clés

```typescript
interface ContentBrief {
  keyword: {
    primary: string
    volume: string            // monthly searches (approximate)
    difficulty: number        // 0-100 (Ahrefs KD equivalent)
    intent: 'informational' | 'commercial' | 'transactional' | 'navigational'
    featuredSnippetFormat: 'paragraph' | 'list' | 'table' | 'none'
  }
  semanticKeywords: string[]  // include naturally in the content
  entityKeywords: string[]    // people, tools, brands to mention for topical depth
  questionKeywords: string[]  // "People Also Ask" targets → answer in H2/H3s

  competitors: Array<{
    url: string
    wordCount: number
    strengths: string[]       // what they do well
    gaps: string[]            // what they miss
    differentiator: string    // how to beat this specific URL
  }>

  brief: {
    recommendedWordCount: number
    sections: Array<{
      heading: string         // H2 or H3
      level: 'H2' | 'H3'
      purpose: string         // what this section accomplishes
      wordCount: number       // target for this section
      writerNote: string      // specific guidance (include stat, example, table, etc.)
    }>
  }
}
```

### Prompt d'analyse des lacunes concurrentielles

```
Effectuer une analyse des lacunes de contenu concurrentiel pour : [MOT-CLÉ PRINCIPAL]

URLs les mieux classées :
1. [URL 1]
2. [URL 2]
3. [URL 3]

Pour chaque URL, identifiez :
1. Angle principal et thèse
2. Profondeur du contenu (quels sujets sont couverts vs. survolés)
3. Données uniques, recherches ou exemples cités
4. Choix de format (tableaux, listes, captures d'écran, vidéos intégrées)
5. Sujets manquants qu'un lecteur voudrait encore après avoir lu ce contenu
6. Sections les plus faibles (contenu mince, informations obsolètes, conseils génériques)

Puis produisez :
- Notre matrice de différenciation : 3 angles qu'aucun des 3 premiers ne couvre
- La « chose unique » que nous devrions posséder dans ce contenu que les concurrents n'ont pas
- Types de preuves à inclure (données originales, citations d'experts, études de cas)
- Nombre de mots recommandé pour surperformer la moyenne des 3 premiers
```

### Générateur de plan de contenu

```
Générer un plan de contenu détaillé.

Sujet : [titre ou titre provisoire]
Mot-clé principal : [mot-clé]
Audience : [profil du lecteur]
Objectif du contenu : [ce que le lecteur accomplit en lisant jusqu'à la fin]

FORMAT DU PLAN :
Pour chaque section :
H2 : [Titre de section — sensible aux mots-clés mais pas bourré]
  Objectif : [ce que cette section accomplit pour le lecteur]
  Points clés : [2-3 points que le rédacteur doit aborder]
  Recommandation de format : [paragraphe / liste / tableau / exemple / capture d'écran]
  Nombre de mots : [cible pour cette section]
  Note au rédacteur : [instruction spécifique — ex. « incluez un vrai exemple client ici »]

Exigences d'introduction :
- Accroche en première phrase (statistique, question ou affirmation audacieuse)
- Établir le problème du lecteur en phrases 2-3
- Promettre le résultat (« à la fin de ceci, vous saurez... »)
- PAS d'ouvertures en « Dans cet article, nous allons... »
- Incluez le mot-clé principal naturellement dans les 100 premiers mots

Exigences de conclusion :
- Résumez les 3 points les plus importants
- CTA : [spécifique — « télécharger le modèle » / « réserver une démo » / « s'abonner »]
- Lecture connexe : [2 liens internes]
```

### Checklist SEO on-page

```
Avant de publier, vérifiez :

BALISE TITLE (meta title) :
- [ ] Contient le mot-clé principal
- [ ] Moins de 60 caractères
- [ ] Accrocheur — a un mot fort (Meilleur, Complet, Ultime, Guide, etc.)
- [ ] Ne duplique pas une autre balise title sur le site

META DESCRIPTION :
- [ ] 150-160 caractères
- [ ] Contient le mot-clé principal
- [ ] A une proposition de valeur claire ou une accroche
- [ ] Se termine par un CTA doux ou une boucle ouverte

SLUG D'URL :
- [ ] Court (2-4 mots)
- [ ] Contient le mot-clé principal
- [ ] Tout en minuscules, avec tirets, sans mots vides

H1 :
- [ ] Contient le mot-clé principal
- [ ] Formulation différente de la balise title (OK de varier)
- [ ] Un seul H1

H2 et H3 :
- [ ] 3-8 H2 (feuille de route du contenu pour le lecteur)
- [ ] Mot-clé principal dans au moins un H2
- [ ] Mots-clés secondaires et questions dans les H2/H3
- [ ] Pas de bourrage de mots-clés — les titres doivent être descriptifs

CONTENU DU CORPS :
- [ ] Mot-clé principal dans le premier paragraphe
- [ ] Densité des mots-clés 0,5-1,5% (naturel, pas forcé)
- [ ] Mots-clés sémantiques et LSI distribués dans tout le texte
- [ ] Au moins un tableau, une liste ou un élément structuré (cible de snippet)
- [ ] Chaque image a un texte alternatif (descriptif, avec mot-clé si naturel)

LIENS INTERNES :
- [ ] 3-5 liens vers du contenu existant sur le site
- [ ] Le texte d'ancre est descriptif (pas « cliquez ici »)
- [ ] Au moins un lien d'une page existante à forte autorité vers ce contenu

LIENS EXTERNES :
- [ ] Lien vers 2-4 sources autoritaires (statistiques, recherches, outils)
- [ ] Définissez les liens externes en rel="noopener" (pas nofollow sauf si payé/UGC)

BALISAGE SCHEMA :
- [ ] Schema Article (toujours)
- [ ] Schema FAQ si vous avez une section Q&R
- [ ] Schema HowTo si c'est un tutoriel/pas-à-pas
```

### Ciblage des featured snippets

```
Optimiser ce contenu pour capturer le featured snippet pour : [MOT-CLÉ]

Détenteur actuel du snippet (si connu) : [URL et texte du snippet]

Formats de featured snippet selon le type de mot-clé :
- « Comment [tâche] » → Liste numérotée étape par étape avec un H2 qui est la question exacte
- « Qu'est-ce que [terme] » → Paragraphe de définition de 2-3 phrases sous un H2 qui reflète la question
- « Meilleur(s) [outils/options] » → Tableau avec colonnes nom/fonctionnalité/prix, ou liste ordonnée
- « [Terme] vs [Terme] » → Tableau comparatif, puis explication en prose

Instructions pour la structure de ciblage de snippet :
1. Utilisez la question exacte comme titre H2
2. Répondez directement et complètement dans les 40-60 premiers mots sous ce titre
3. Pour les snippets de liste : utilisez <ol> ou <ul> immédiatement après le titre
4. Pour les snippets de tableau : utilisez un tableau HTML approprié avec en-têtes
5. Puis développez avec des paragraphes de détail (Claude lit au-delà du snippet)
6. NE PAS enfouir la réponse — mettez-la en premier, expliquez en second

Rédigez le titre H2 optimisé et la section d'ouverture :
```

### Modèle de brief (copier-coller pour les rédacteurs)

```markdown
# Brief de contenu : [TITRE]

**Mot-clé principal :** [mot-clé] | Volume : [X/mois] | Difficulté : [X/100]
**Mots-clés secondaires :** [liste]
**Nombre de mots cible :** [X mots]
**Date de publication cible :** [date]
**Rédacteur :** [nom]
**Revue éditoriale avant le :** [date]

## Audience
[Intitulé de poste], [taille d'entreprise], [problème spécifique qu'ils résolvent avec cette recherche].
Ils sont au stade de [conscience : conscient du problème / conscient de la solution / conscient du produit].

## Intention de recherche
[Que veut accomplir le lecteur en cherchant ce mot-clé ? Quel format attend-il ?]

## Angle recommandé
[Une phrase — pourquoi notre contenu sera meilleur que les 3 premiers résultats actuels]

## Plan

### Introduction (~150 mots)
Accroche avec : [statistique / question / affirmation audacieuse]
Établir le problème : [avec quoi le lecteur lutte]
Promettre le résultat : [ce qu'il saura à la fin]

### H2 : [Titre de la section 1] (~300 mots)
[Points clés que le rédacteur doit couvrir]
[Format : paragraphe/liste/tableau]
[Note au rédacteur : instruction spécifique]

### H2 : [Titre de la section 2] (~400 mots)
...

### Conclusion (~200 mots)
Résumé : [3 points clés]
CTA : [action spécifique]
Connexe : [2 liens internes]

## Exigences SEO
- [ ] Mot-clé principal dans les 100 premiers mots
- [ ] H2 qui est une question « People Also Ask »
- [ ] Un tableau ou une liste numérotée (cible de snippet)
- [ ] 4+ liens internes
- [ ] Toutes les images avec texte alternatif descriptif

## Méta
**Balise title :** [60 caractères max] [BROUILLON]
**Meta description :** [155 caractères max] [BROUILLON]
**Slug URL :** /[slug]

## Plan de liens internes
Lier DEPUIS ce contenu vers :
- [URL 1] — texte d'ancre : [texte]
- [URL 2] — texte d'ancre : [texte]

Lier VERS ce contenu depuis :
- [URL 1] — mettre à jour cette page pour ajouter un lien ici
- [URL 2] — ajouter un lien contextuel
```

## Exemple

**Utilisateur :** Rédigez un brief de contenu pour « content marketing strategy » ciblant les responsables marketing B2B.

**Résultat :**
```markdown
# Brief de contenu : Le Guide de la Stratégie de Content Marketing B2B (2026)

**Mot-clé principal :** content marketing strategy | Volume : ~18 000/mois | Difficulté : 68/100
**Mots-clés secondaires :** b2b content strategy, content marketing framework, content strategy template, how to build a content strategy
**Nombre de mots cible :** 3 800 mots (moyenne des concurrents 3 100 — allez plus en profondeur sur les frameworks et modèles)
**Intention de recherche :** Informationnelle — le lecteur veut un processus étape par étape à suivre, avec des modèles à adapter

## Audience
Responsable Marketing B2B dans une entreprise SaaS ou de services de 50 à 500 personnes. Vient de prendre en charge le contenu. Doit présenter une stratégie à son VP Marketing dans les 30 jours. Recherche au travail, sur ordinateur de bureau, pendant un cycle de planification.

## Angle recommandé
La plupart des guides listent des tactiques. Ce guide construit un vrai cadre de stratégie en séquence étape par étape avec un modèle téléchargeable — le lecteur termine avec un plan complet sur 90 jours, pas seulement de l'inspiration.

## Plan

### Introduction (~200 mots)
Accroche : « La plupart des stratégies de contenu échouent dans les 90 premiers jours — non pas parce que l'écriture est mauvaise, mais parce qu'il n'y avait jamais eu de vraie stratégie. »
Problème : Les équipes produisent du contenu sans recherche d'audience, cartographie des mots-clés ou plan de distribution.
Promesse : « À la fin de ce guide, vous aurez une stratégie de contenu sur 90 jours que vous pouvez présenter cette semaine. »

### H2 : Ce qu'est vraiment une stratégie de content marketing B2B (~300 mots)
[Cible de featured snippet — répondez au « qu'est-ce que » en 50 mots d'abord]
Définir : stratégie vs. tactiques vs. calendrier
Les 5 composantes d'une vraie stratégie : audience, objectifs, mix de canaux, système de production, mesure

### H2 : Étape 1 — Définir vos objectifs de contenu (~400 mots)
Tableau de traduction objectifs business → objectifs de contenu
Trafic, leads, pipeline, marque : quelles métriques correspondent à quel objectif
Note au rédacteur : Inclure un vrai exemple B2B montrant comment une entreprise SaaS a défini ses KPIs de contenu

### H2 : Étape 2 — Recherche d'audience et de mots-clés (~500 mots)
Cartographie ICP → intention de mots-clés
Outils : Ahrefs, Semrush, Answer the Public, notes d'appels commerciaux internes
Note au rédacteur : Montrez le processus de recherche de mots-clés sous forme de liste étape par étape (cible de snippet)

### H2 : Étape 3 — Construire vos clusters thématiques (~400 mots)
Modèle pilier/spoke avec description de diagramme
Comment choisir les piliers en fonction des objectifs business, pas seulement du volume
Lien interne : [/article-blog-calendrier-editorial]

### H2 : Étape 4 — Choisir votre mix de contenu (~400 mots)
Tableau du mix de types de contenu : [Type | % | Quand utiliser | Exemple]
Le mix diffère entre une entreprise débutante et une entreprise mature — montrez les deux

### H2 : Étape 5 — Construire un système de production (~400 mots)
Workflow brief → brouillon → édition → publication → distribution
Rôles : qui fait quoi (même si c'est une seule personne)
Outils : Notion, Airtable, ou un simple modèle Google Sheet

### H2 : Étape 6 — Mesurer et itérer (~400 mots)
Métriques par objectif (trafic / leads / marque)
Modèle de revue mensuelle du contenu
À quoi ressemble le « succès » à 30/60/90 jours

### Conclusion (~200 mots)
Points clés : 3 choses à faire cette semaine
CTA : Télécharger le modèle de stratégie de contenu sur 90 jours
Connexe : Lien vers /seo-audit, /editorial-calendar

## Méta
**Balise title :** Stratégie de Content Marketing B2B : Le Guide Étape par Étape 2026
**Meta description :** Construisez une stratégie de contenu B2B qui génère un vrai pipeline. Framework en 6 étapes, modèles et un plan sur 90 jours que vous pouvez présenter cette semaine.
**Slug URL :** /content-marketing-strategy
```

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous créons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
