---
name: editorial-calendar
description: "Calendrier éditorial mensuel : clusters thématiques, programme de publication, mix de contenus, plan de distribution"
---

# Compétence Calendrier Éditorial

## Quand l'activer
- Planifier un mois ou un trimestre de contenus pour un blog, une newsletter ou les réseaux sociaux
- Associer des clusters thématiques à des mots-clés et construire un planning de publication cohérent
- Décider du bon mix de contenus (tutoriel, leadership éclairé, étude de cas, comparatif, etc.)
- Créer des plans de distribution qui associent le type de contenu au canal adapté
- Intégrer un nouveau collaborateur chargé du contenu et avoir besoin d'un système de publication structuré
- Lancer une nouvelle marque ou un nouveau site web et devoir construire une autorité thématique rapidement

## Quand NE PAS utiliser
- Rédiger des contenus individuels — utiliser `/content-brief` pour cela
- Auditer le SEO d'un site existant — utiliser `/seo-audit` à la place
- Publications sociales ponctuelles sans plan de publication stratégique
- Vous avez déjà un calendrier et avez seulement besoin de combler des lacunes — commencer par `/seo-audit` pour identifier ces lacunes

## Instructions

### Prompt principal de génération de calendrier

```
Construis un calendrier éditorial mensuel pour [MARQUE/PUBLICATION].

Contexte :
- Marque : [nom de l'entreprise, description en une ligne]
- Audience cible : [ICP — intitulé de poste, secteur, problématiques]
- Objectif business principal : [ex. trafic organique, abonnés newsletter, génération de pipeline]
- Canaux de contenu : [blog, newsletter, LinkedIn, X, YouTube — lister ce qui s'applique]
- Cadence de publication : [ex. 2 articles de blog/semaine, LinkedIn quotidien, newsletter hebdomadaire]
- Autorité de domaine / maturité du contenu : [nouveau site / 6-12 mois / établi (DA 40+)]
- Cluster de mots-clés principal : [thématique principale, ex. "onboarding SaaS B2B"]
- Concurrent publiant à : [URL ou nom — optionnel]

Produire :

## 1. Carte des clusters thématiques
Construire 3 à 5 sujets piliers et 4 à 6 sous-sujets pour chacun :
- Pilier 1 : [sujet large] → sous-sujets : [liste]
- Pilier 2 : [sujet large] → sous-sujets : [liste]
...

## 2. Mix de types de contenu (% du contenu total)
- Tutoriel éducatif : [X]%
- Leadership éclairé / opinion : [X]%
- Étude de cas / témoignage client : [X]%
- Comparatif / versus : [X]%
- Ciblé mots-clés (bas de funnel) : [X]%
- Actualité / newsjacking : [X]%

## 3. Calendrier mensuel — [MOIS ANNÉE]
Pour chaque semaine, préciser :
- Articles de blog (titre, mot-clé cible, type de contenu, potentiel de trafic estimé)
- Newsletter (ligne d'objet, thème, CTA principal)
- Publications LinkedIn (thème, format : texte/image/carrousel/sondage/vidéo)
- Contenu des autres canaux

## 4. Plan de distribution
Pour chaque contenu publié, lister :
- Canal principal : [où il vit]
- Réutilisation : [comment vous le diffusez sur d'autres canaux dans les 48 heures]
- Promotion : [outreach, communautés, amplification payante si budget disponible]

## 5. Stratégie de maillage interne
Cartographier quels nouveaux contenus doivent pointer vers les contenus piliers existants et vers d'autres contenus liés.
```

### Framework de clusters thématiques

```typescript
interface TopicCluster {
  pillar: {
    title: string
    targetKeyword: string
    searchVolume: string      // from Ahrefs/Semrush or estimated
    difficulty: number        // 0-100
    format: 'ultimate-guide' | 'hub-page' | 'long-form'
    wordCount: number         // target
  }
  spokes: Array<{
    title: string
    targetKeyword: string
    searchVolume: string
    intent: 'informational' | 'navigational' | 'commercial' | 'transactional'
    format: 'how-to' | 'listicle' | 'comparison' | 'case-study' | 'opinion'
    linksToPillar: boolean    // always true for hub-and-spoke
    priority: 'high' | 'medium' | 'low'
  }>
}

// Règles pour le contenu pilier :
// - Cibler des mots-clés principaux (1-2 mots), volume élevé, difficulté élevée
// - 3 000-8 000 mots — exhaustif, génère des liens entrants
// - Mis à jour chaque trimestre
//
// Règles pour les contenus satellites :
// - Cibler des mots-clés longue traîne (3-5 mots), volume modéré, difficulté faible à moyenne
// - 1 200-2 500 mots — spécifique, actionnable
// - Toujours pointer vers le pilier et vers 2-3 satellites connexes
```

### Calculateur du mix de contenu

```
Calculer le mix de contenu optimal pour ma situation :

Stade de l'entreprise : [early / growth / mature]
Objectif : [traffic / leads / brand / community]
Fréquence de publication : [X contenus/mois]
Taille de l'équipe : [solo / 1-2 rédacteurs / petite équipe / agence]

Stade précoce + objectif trafic :
- 60% SEO informationnel (haut de funnel, éducatif)
- 20% SEO commercial (comparatif, meilleur de, alternatives)
- 20% leadership éclairé (construit l'autorité + est partagé)
- Newsletter : récapitulatif hebdomadaire, 500-800 mots, haute valeur de curation

Stade croissance + objectif pipeline :
- 40% SEO informationnel
- 30% SEO commercial/transactionnel (bas de funnel)
- 20% études de cas + témoignages clients
- 10% leadership éclairé sur les problématiques des acheteurs
- Newsletter : insight hebdomadaire + un CTA produit

Stade mature + objectif marque :
- 30% maintenance SEO (mise à jour des meilleures performances)
- 40% leadership éclairé + recherches originales
- 20% collaboration communauté/audience
- 10% formats expérimentaux (vidéo, audio, interactif)
```

### Planning hebdomadaire de production de contenu

```markdown
# Modèle de production de contenu hebdomadaire

## Lundi — Planification
- [ ] Récupérer les analytics de la semaine précédente (sessions, temps sur la page, conversions par contenu)
- [ ] Confirmer que les contenus de cette semaine ont un brief et sont assignés
- [ ] Vérifier les sujets tendance dans votre secteur (Twitter/LinkedIn, Google Trends, Feedly)
- [ ] Briefer les contenus réactifs (opportunités de newsjacking)

## Mardi–Mercredi — Production
- [ ] Le rédacteur soumet les brouillons
- [ ] Révision éditoriale : exactitude, structure, SEO, CTA
- [ ] Audit du maillage interne (chaque contenu pointe-t-il vers 3+ autres ?)
- [ ] Méta-titre et description finalisés

## Jeudi — Publication et distribution
- [ ] Publier l'article de blog (vérifier l'URL canonique, le schéma, les balises OG)
- [ ] Envoyer la newsletter si cadence hebdomadaire
- [ ] Rédiger un post LinkedIn à partir du blog — format carrousel ou post texte
- [ ] Soumettre aux communautés pertinentes (HN Show, Reddit, groupes Slack)

## Vendredi — Réutilisation
- [ ] Convertir des sections du blog en 3-5 posts LinkedIn (programmer pour les 2 prochaines semaines)
- [ ] Extraire des citations pour un fil X/Twitter
- [ ] Mettre à jour le calendrier éditorial avec les dates de publication réelles et les espaces réservés pour les analytics
- [ ] Ajouter le contenu publié au backlog de maillage interne pour les prochains contenus
```

### Stratégie de distribution par type de contenu

```
Associer chaque type de contenu à sa distribution optimale :

TUTORIEL / HOW-TO :
Principal : Blog (SEO) + YouTube (si adapté à la vidéo)
Réutilisation : Carrousel LinkedIn → fil X → extrait newsletter → tutoriel Reddit
Amplification payante : Seulement si le classement est en page 2 et nécessite un coup de pouce

LEADERSHIP ÉCLAIRÉ / OPINION :
Principal : LinkedIn (le long format natif performe bien) + cross-post Blog
Réutilisation : Article de tête de newsletter → fil X → sujet d'épisode de podcast
Amplification : Taguer les personnes mentionnées, répondre aux commentaires dans les 60 premières minutes

ÉTUDE DE CAS / TÉMOIGNAGE CLIENT :
Principal : Blog (pilier, mise en accès restreint optionnel) + Ressource commerciale
Réutilisation : Mise en avant client LinkedIn → Email aux prospects similaires → Diapositive de deck commercial
Amplification : Envoyer au client pour qu'il partage — la confiance de son audience > la vôtre

COMPARATIF / VERSUS :
Principal : Blog (bas de funnel, forte intention d'achat)
Réutilisation : Pièce jointe email commercial → réponse chatbot → page d'atterrissage PPC
Amplification : NE PAS partager sur les réseaux sociaux — paraît auto-promotionnel ; laisser le SEO agir

NEWSJACKING / TENDANCE :
Principal : LinkedIn (publier dans les 2 heures suivant l'actualité) + X
Réutilisation : Section P.S. newsletter → court article de blog le lendemain
Amplification : La rapidité est l'amplification ; distribuer immédiatement ou ne pas le faire
```

### Modèle de calendrier éditorial (copier-coller)

```markdown
# Calendrier éditorial — [MOIS ANNÉE]

## Objectifs du mois
- Objectif trafic : [X sessions]
- Objectif newsletter : [X abonnés / X% taux d'ouverture]
- Objectif pipeline : [X leads issus du contenu]
- Objectif autorité : [X liens entrants / Y amélioration DA]

## Semaine 1 ([Période])

| Jour | Canal | Titre / Objet | Type | Mot-clé | CTA |
|---|---|---|---|---|---|
| Lun | Blog | [Titre] | Tutoriel | [mot-clé] | [s'abonner / démo / télécharger] |
| Mer | Newsletter | [Ligne d'objet] | Récapitulatif | — | [CTA] |
| Jeu | LinkedIn | [Thème du post] | Carrousel | — | [engager / visiter] |
| Ven | LinkedIn | [Thème du post] | Texte | — | — |

## Semaine 2 ([Période])
...

## Semaine 3 ([Période])
...

## Semaine 4 ([Période])
...

## Backlog evergreen (publier selon les disponibilités)
- [Titre] — [Mot-clé] — [Priorité : H/M/L]
- [Titre] — [Mot-clé] — [Priorité : H/M/L]

## Audits de contenus prévus ce mois
- [URL] — dernière mise à jour [date] — action : [actualiser / consolider / supprimer]
```

### Prompt de planification trimestrielle

```
Conduire une session de planification trimestrielle du contenu.

Performances du trimestre précédent :
- Top 5 des contenus par trafic : [liste]
- Top 5 des contenus par conversions : [liste]
- Bottom 5 (faible trafic, aucune conversion) : [liste]
- Nouveaux mots-clés classés page 1 : [liste]
- Mots-clés ayant glissé hors de la page 1 : [liste]

Priorités de ce trimestre :
1. Capitaliser sur : [ce qui a fonctionné] — produire plus de contenus dans ces clusters
2. Actualiser : [ce qui a glissé] — mettre à jour, ré-optimiser, ajouter des liens internes
3. Consolider : [contenu mince] — fusionner en un seul contenu solide
4. Attaquer : [nouveau cluster] — nouvelle thématique sur laquelle construire l'autorité
5. Supprimer : [sous-performeurs irréversibles] — redirection 301 vers un contenu solide connexe

Livrable :
- Priorités des clusters pour le T[X]
- Une feuille de route de publication sur 13 semaines
- Allocation de l'équipe : [X contenus/rédacteur/semaine]
- Estimation budgétaire si externalisation : [X contenus × [Y] €/contenu]
```

## Exemple

**Utilisateur :** Construire un calendrier éditorial mensuel pour une startup SaaS B2B (outil de gestion de projet) ciblant les responsables opérations dans des entreprises de 50 à 500 employés. Publication : 2 blogs/semaine, newsletter hebdomadaire, LinkedIn quotidien. Mois : juin.

**Résultat :**
```markdown
# Calendrier éditorial — Juin 2026
**Marque :** [SaaS Gestion de projet] | **Audience :** Directeurs Ops, Chiefs of Staff | **Objectif :** Trafic organique + croissance newsletter

## Clusters thématiques
**Pilier 1 :** Efficacité opérationnelle → satellites : workflows équipes à distance, documentation des processus, modèles de cadence de réunions, suivi OKR
**Pilier 2 :** Gestion de projet → satellites : planification des ressources, cartographie des dépendances, projets cross-fonctionnels, reporting de statut
**Pilier 3 :** Mise à l'échelle des opérations → satellites : SOP pour la croissance, playbook recrutement ops, audit de la stack technologique, KPI opérations

## Mix de contenus
60% SEO éducatif | 20% leadership éclairé | 15% études de cas | 5% comparatif

## Semaine 1 (1-7 juin)
| Jour | Canal | Titre | Type | Mot-clé | CTA |
|---|---|---|---|---|---|
| Lun 2 | Blog | "Comment organiser une revue Ops hebdomadaire qui fonctionne vraiment" | Tutoriel | "réunion de revue ops" | S'abonner à la newsletter |
| Mer 4 | Newsletter | "La semaine à 5 réunions qui se pilote toute seule" | Insight | — | Lire l'article |
| Jeu 5 | LinkedIn | Carrousel surcharge de réunions : 5 modèles de réunions ops | Carrousel | — | MP pour le modèle |
| Sam 7 | LinkedIn | "Opinion impopulaire : la plupart des outils de gestion de projet ne résolvent pas le vrai problème" | Texte | — | Commenter |

## Semaine 2 (8-14 juin)
| Jour | Canal | Titre | Type | Mot-clé | CTA |
|---|---|---|---|---|---|
| Lun 9 | Blog | "Asana vs Monday vs [Votre outil] : lequel convient aux équipes Ops ?" | Comparatif | "asana vs monday pour les opérations" | Essai gratuit |
| Mer 11 | Newsletter | "Comment [Client] a réduit son temps de reporting hebdomadaire de 70%" | Extrait étude de cas | — | Lire l'histoire complète |
| Jeu 12 | LinkedIn | Carrousel 5 diapositives : "La transformation ops de notre client en 90 jours" | Carrousel | — | Lien en commentaire |
| Ven 13 | LinkedIn | "3 signes que votre outil de gestion de projet vous freine" | Texte | — | — |

## Règles de distribution
- Chaque article de blog → carrousel LinkedIn dans les 48 heures
- Chaque étude de cas → l'équipe commerciale reçoit le lien pour son pipeline
- Clic abonné newsletter → Tagué dans HubSpot comme "lead contenu engagé"
```

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
