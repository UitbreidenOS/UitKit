# Claude pour les Content Marketers et Spécialistes SEO

Tout ce dont un Content Marketer ou un Spécialiste SEO a besoin pour piloter avec l'IA la stratégie de contenu, la production, l'optimisation et la distribution dans Claude Code.

---

## À qui s'adresse ce guide

Vous êtes un content marketer, un responsable SEO ou un growth marketer dont le travail consiste à construire une audience, développer le trafic organique et convertir les lecteurs en leads ou en clients. Vous passez trop de temps à fixer des pages blanches, rédiger des briefs, reformater du contenu pour différents canaux et compiler des analyses dans des rapports.

**Avant Claude Code :** 90 minutes pour rechercher et briefer un article de blog. 45 minutes pour rédiger une série de posts sur les réseaux sociaux. Une demi-journée pour produire un calendrier éditorial mensuel. Des heures à relancer des rédacteurs pour des briefs encore vagues.

**Après :** Brief de contenu complet en 5 minutes. Calendrier éditorial du mois en 15 minutes. Plan d'article avec analyse concurrentielle en moins de 10 minutes. Republication d'un article de blog sur les réseaux sociaux en 3 minutes.

---

## Installation en 30 secondes

```bash
# Installer la stack complète content marketing et SEO
npx claudient add skills marketing

# Ou choisir à la carte :
npx claudient add skill marketing/content-strategy
npx claudient add skill marketing/content-brief
npx claudient add skill marketing/editorial-calendar
npx claudient add skill marketing/seo-audit
npx claudient add skill marketing/ai-seo
npx claudient add skill marketing/programmatic-seo
npx claudient add skill marketing/copywriting
npx claudient add skill marketing/social-media-manager
npx claudient add skill marketing/email-sequence
npx claudient add agents advisors/cmo-advisor
npx claudient add agents roles/competitive-analyst
```

---

## Votre stack content marketing avec Claude Code

### Compétences (commandes slash)

| Compétence | Ce qu'elle fait | Quand l'utiliser |
|---|---|---|
| `/content-brief` | Brief de contenu optimisé SEO : mot-clé, plan, lacunes, liens internes, CTA | Avant chaque contenu |
| `/editorial-calendar` | Calendrier mensuel : clusters thématiques, planning de publication, mix de contenus, distribution | Planification mensuelle |
| `/content-strategy` | Stratégie de contenu complète : audience, objectifs, canaux, clusters thématiques, KPIs | Planification trimestrielle ou au lancement d'une marque |
| `/seo-audit` | Audit SEO technique et on-page : problèmes, opportunités, liste de corrections priorisée | Audit mensuel du site |
| `/ai-seo` | SEO à l'ère de l'IA : optimisation pour ChatGPT, Perplexity, Bing AI, featured snippets | Lors de la mise à jour du contenu existant |
| `/programmatic-seo` | Modèles de pages programmatiques : schéma, patterns N-sur-M, production à l'échelle | Production de contenu à grande échelle |
| `/copywriting` | Pages d'atterrissage, titres, CTA, publicités — axé sur la conversion | Tout contenu critique pour la conversion |
| `/social-media-manager` | Création de posts natifs par plateforme, stratégie de planification, playbooks d'engagement | Contenu social et gestion des canaux |
| `/email-sequence` | Séquences de drip, newsletters, flux automatisés — copywriting complet + logique | Contenu email et flux de nurturing |

### Agents

| Agent | Modèle | Quand le solliciter |
|---|---|---|
| `cmo-advisor` | Opus | Questions de stratégie, priorisation des canaux, positionnement du contenu |
| `competitive-analyst` | Sonnet | Audits de contenu concurrents, analyse des lacunes, intelligence de positionnement |

---

## Flux de travail quotidien

### Matin — Revue des analyses (15 minutes)

**1. Bilan de performance**
```
/seo-audit

Récupérez mes métriques clés de contenu d'hier :
- Top 5 des pages par sessions
- Nouvelles pages apparaissant dans Google Search Console
- Pages ayant perdu du classement ces 7 derniers jours
- Taux d'ouverture de la newsletter de l'envoi d'hier

Donnez-moi un briefing en 5 points : ce qu'il faut célébrer, ce qu'il faut analyser, ce qu'il faut corriger aujourd'hui.
```

**2. Scan des opportunités**
```
/ai-seo

Quels mots-clés liés à [mon cluster thématique] ont augmenté ces 7 derniers jours ?
Y a-t-il des questions tendance dans ma niche sur lesquelles je devrais surfer aujourd'hui ?
Vérifiez : Google Trends, Reddit, les sujets tendance sur LinkedIn.
```

---

### Création de contenu (variable — 1-4 heures)

**3. Briefer un nouveau contenu**
```
/content-brief

Mot-clé cible : [mot-clé]
Mots-clés secondaires : [liste]
Type de contenu : [how-to / comparatif / leadership d'opinion]
Audience cible : [personne spécifique avec un problème spécifique]
URLs concurrentes : [3 pages mieux classées]
Notre CTA : [ce que nous voulons que les lecteurs fassent]
Objectif de nombre de mots : [basé sur la moyenne des concurrents]
```

**4. Rédiger ou réviser du contenu**
```
/copywriting

Rédigez [type de contenu] sur la base de ce brief :
[collez le brief ci-dessus]

Ton : [conversationnel / autoritaire / technique]
Voix de marque : [brève description — ou collez les directives de marque]
À inclure obligatoirement : [points spécifiques, données ou exemples]
```

---

### Optimisation SEO (20-30 minutes, plusieurs fois par semaine)

**5. Optimisation on-page**
```
/seo-audit

Revoyez ce brouillon avant publication :
[collez le contenu]

Mot-clé cible : [mot-clé]
Vérifiez : balise titre, méta description, H1, structure H2, liens internes,
opportunité de featured snippet, texte alternatif des images, balisage schema.
Donnez-moi une checklist de publication : ce qui est bon, ce qu'il faut corriger.
```

---

### Planification des réseaux sociaux (15-30 minutes, quotidienne ou hebdomadaire en lot)

**6. Republier le contenu publié**
```
/social-media-manager

Je viens de publier : [URL ou collez le contenu]

Créez :
- 3 posts LinkedIn (texte seul, concept de carrousel, et un sondage)
- 5 posts X/Twitter (dont un thread et 4 posts autonomes)
- 1 légende Instagram
- 1 script de courte vidéo (60 secondes)

Adaptez l'insight principal au format natif de chaque plateforme.
Ne copiez pas simplement l'introduction du blog — extrayez l'idée la plus partageable de chaque section.
```

---

### Reporting de performance (30-60 minutes, hebdomadaire)

**7. Rapport hebdomadaire de contenu**
```
/content-strategy

Revue de performance hebdomadaire :
- Publié cette semaine : [liste]
- Contenu le plus performant (sessions, temps sur page, conversions) : [données]
- Stats newsletter : [envois, taux d'ouverture, CTR]
- Stats réseaux sociaux : [impressions, engagements, évolution des abonnés]

Résumez : ce qui a fonctionné, ce qui n'a pas fonctionné, et ce que je devrais produire davantage la semaine prochaine.
Produisez un rapport d'une page que je peux partager avec mon manager.
```

---

## Flux de planification mensuelle

### Fin de mois : planifier le calendrier du mois suivant (60-90 minutes)

**Étape 1 — Réviser le mois écoulé**
```
/content-strategy

Audit du contenu du mois dernier :
- Quels contenus ont généré le plus de trafic organique ?
- Lesquels ont généré le plus de leads/conversions ?
- Lesquels ont eu le meilleur engagement sur les réseaux sociaux ?
- Du contenu qui a sous-performé malgré un effort important ?

Donnez-moi : liste des formats à développer (plus de contenu comme ça), liste des formats à arrêter (arrêtez ce format), et 3 nouvelles idées basées sur ce qui a fonctionné.
```

**Étape 2 — Construire le calendrier du mois prochain**
```
/editorial-calendar

Construisez le calendrier éditorial pour [mois prochain].

Marque : [nom de l'entreprise + description en une ligne]
Audience : [description du profil client idéal]
Objectif : [trafic / leads / notoriété]
Canaux : [blog / newsletter / LinkedIn / X]
Cadence de publication : [X/semaine blog, quotidien LinkedIn, newsletter hebdomadaire]
Cluster thématique principal actuel : [domaine thématique principal]
```

**Étape 3 — Briefer chaque contenu**
```
/content-brief

[Exécuter pour chaque contenu planifié dans le calendrier]
```

---

## Plan de montée en compétence sur 30 jours (nouveaux content marketers)

### Semaine 1 — Audit et compréhension
- Installez toutes les compétences marketing : `npx claudient add skills marketing`
- Exécutez `/seo-audit` sur l'ensemble de votre site — sachez ce que vous avez avant de publier davantage
- Exécutez `/competitive-analyst` sur vos 3 principaux concurrents — qu'écrivent-ils que vous n'écrivez pas ?
- Auditez votre liste email : taux d'ouverture, taux de clics, désabonnements — quel contenu performe ?
- Cartographiez vos clusters thématiques : utilisez `/content-strategy` pour définir vos 3 piliers

### Semaine 2 — Mise en place du système
- Construisez votre premier calendrier éditorial avec `/editorial-calendar`
- Créez des modèles de briefs pour vos 3 types de contenus les plus courants
- Configurez votre checklist de distribution de contenu (chaque post = distribution sur 5 canaux)
- Définissez votre carte de liens internes : quels sont vos 10 contenus piliers ?

### Semaine 3 — Lancement de la production
- Briefez et produisez vos 4 premiers contenus avec `/content-brief` + `/copywriting`
- Utilisez `/social-media-manager` pour republier chaque contenu sur les canaux
- Configurez votre email hebdomadaire avec `/email-sequence`
- Publiez, distribuez, suivez les résultats

### Semaine 4 — Analyse et optimisation
- Exécutez `/seo-audit` — qu'est-ce qui s'est amélioré ? Quelles nouvelles opportunités sont apparues ?
- Identifiez votre meilleur contenu et utilisez `/content-brief` pour en produire 3 similaires
- Configurez le modèle de reporting analytique mensuel
- Présentez votre premier rapport de stratégie de contenu mensuel

---

## Intégrations d'outils

### Ahrefs / Semrush

```
Collez les données de mots-clés directement dans Claude :
1. Exportez le rapport de mots-clés depuis Ahrefs → Copiez les 100 premières lignes
2. /seo-audit : collez les données et demandez la liste d'opportunités priorisées
3. Utilisez /content-brief avec les mots-clés identifiés

Pour l'analyse des lacunes concurrentielles :
1. Exécutez le rapport "Content Gap" dans Ahrefs sur vos 3 principaux concurrents
2. Collez les mots-clés de lacune dans /editorial-calendar
3. Associez les mots-clés aux clusters thématiques et construisez le calendrier
```

### Google Search Console

```bash
# Connecter les données GSC à Claude via MCP
# Ajoutez dans ~/.claude/settings.json :
{
  "mcpServers": {
    "google-search-console": {
      "command": "npx",
      "args": ["-y", "@anthropic/gsc-mcp"],
      "env": {
        "GSC_CREDENTIALS": "path/to/credentials.json",
        "GSC_SITE_URL": "https://votredomaine.com"
      }
    }
  }
}
```

Avec cette connexion, Claude peut :
- Récupérer directement vos meilleures requêtes et pages
- Identifier les mots-clés classés 11-20 (cibles d'optimisation à gains rapides)
- Suivre les impressions vs. les clics pour trouver les opportunités de CTR
- Surveiller les chutes de classement sur votre contenu

### HubSpot / Marketo (attribution du contenu)

```json
{
  "mcpServers": {
    "hubspot": {
      "command": "npx",
      "args": ["-y", "@hubspot/mcp-server"],
      "env": {
        "HUBSPOT_ACCESS_TOKEN": "your-token"
      }
    }
  }
}
```

Avec cette connexion :
- Demandez à Claude quels articles de blog génèrent le plus de conversions de contacts
- Identifiez quel contenu vos meilleurs leads ont consommé avant de convertir
- Construisez des plans de distribution avec tracking UTM liés à l'influence sur les deals

### Notion / Airtable (calendrier éditorial)

```
Exportez votre calendrier de contenu depuis Notion ou Airtable en CSV ou markdown.
Collez dans Claude avec :
"/editorial-calendar — voici mon calendrier actuel. Identifiez les lacunes de couverture thématique,
les sur-indexations sur un type de contenu, et les contenus qui nécessitent une actualisation prioritaire."
```

### n8n / Make (automatisation)

```
Automatisez la boucle de production de contenu :
- Nouvelle alerte de mot-clé Ahrefs → /content-brief auto-généré → page Notion créée
- Article de blog publié → /social-media-manager → posts planifiés dans Buffer/Hootsuite
- Email envoyé → taux d'ouverture sous le seuil → /email-sequence → variantes de ligne d'objet générées
- Mensuel : rapport Google Analytics → /content-strategy → document de revue mensuelle créé
```

---

## Indicateurs de référence à suivre

Extrayez-les depuis Google Analytics, GSC et votre plateforme email chaque semaine :

| Métrique | Phase de démarrage | Phase de croissance | Phase mature |
|---|---|---|---|
| Sessions organiques/mois | 1 000 | 10 000 | 50 000+ |
| Croissance organique MoM | >10% | 5-10% | 2-5% |
| Contenus publiés/mois | 8 | 16 | 25+ |
| Taux d'ouverture email | >25% | >30% | >35% |
| CTR email | >2% | >3% | >4% |
| Taux d'engagement social (LinkedIn) | >2% | >3% | >4% |
| Leads attribués au contenu/mois | 5 | 25 | 100+ |
| Temps par brief de contenu | <30 min | <15 min | <10 min |

---

## Erreurs courantes (et comment Claude Code aide à les éviter)

**Erreur 1 : Écrire sans brief**
`/content-brief` prend 5 minutes. Le sauter vous coûte 3 heures de réécritures quand le contenu rate l'intention.

**Erreur 2 : Produire du contenu sans plan de distribution**
`/editorial-calendar` intègre le plan de distribution dans le calendrier. Chaque contenu a un plan sur 5 canaux avant d'être rédigé.

**Erreur 3 : Publier sans liens internes**
`/content-brief` cartographie les liens internes dans le brief. Plus de contenu orphelin publié.

**Erreur 4 : Ignorer la dégradation du contenu**
`/seo-audit` fait remonter les pages qui étaient bien classées mais ont chuté. La mise à jour bat la publication de nouveau contenu pour les sites établis.

**Erreur 5 : Des posts sociaux qui partagent juste le lien**
`/social-media-manager` réécrit le contenu en posts natifs à chaque plateforme. Carrousels LinkedIn, threads Twitter, légendes Instagram — tous distincts du blog.

---

## Ressources

- [Démarrer avec Claude Code](../getting-started.md)
- [Workflow de création de contenu](../workflows/content-creation.md)
- [Compétence SEO audit](../skills/marketing/seo-audit.md)
- [Compétence content brief](../skills/marketing/content-brief.md)
- [Compétence editorial calendar](../skills/marketing/editorial-calendar.md)
- [Compétence email sequence](../skills/marketing/email-sequence.md)

---
