---
name: valyu
description: "Accéder aux données de recherche payantes via Valyu MCP : dépôts SEC EDGAR, articles PubMed, essais cliniques, brevets, rapports financiers."
---

# Valyu Research API

## Quand l'activer

- L'utilisateur a besoin des dépôts SEC EDGAR (10-K, 10-Q, 8-K, DEF 14A) pour une entreprise publique
- Accès à PubMed ou à la littérature biomédicale derrière les murs de paie des journaux
- Interrogation de ClinicalTrials.gov pour les données d'essais, l'état d'inscription ou les résultats
- Recherches de bases de brevets (USPTO, EPO, WIPO)
- Données financières nécessitant des dépôts officiels plutôt que des données web extraites
- Articles académiques où les pré-impressions gratuites ne sont pas disponibles et le texte intégral est nécessaire
- N'importe quelle tâche de recherche où les sources primaires faisant autorité importent plus que le contenu web agrégé

## Quand ne pas l'utiliser

- Recherche générale sur le web (utiliser WebSearch à la place — Valyu ajoute des coûts sans bénéfice pour le contenu web public)
- Articles d'actualité, messages de blog ou contenu d'opinion
- Documentation de code ou réponses de style Stack Overflow
- Données librement et fiablement disponibles via recherche standard (Wikipedia, documentation officielle des produits)
- Prix en temps réel, données de marché en direct ou flux financiers en streaming — Valyu contient des données de dépôts, pas des cotations

## Instructions

### Configuration MCP

Ajouter Valyu à votre configuration MCP Claude Code :

```json
{
  "mcpServers": {
    "valyu": {
      "command": "npx",
      "args": ["-y", "@valyu/mcp-server"],
      "env": {
        "VALYU_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Obtenir une clé API sur valyu.network. Stocker la clé dans votre environnement shell ou `.env` — jamais dans `settings.json` ou fichiers commités :

```bash
export VALYU_API_KEY="vk_..."
```

Puis la référencer dans la configuration MCP comme `"${VALYU_API_KEY}"` ou utiliser le bloc env comme indiqué.

### Sources de données disponibles

| Source | Ce qu'elle contient | Type de requête optimal |
|---|---|---|
| SEC EDGAR | 10-K, 10-Q, 8-K, DEF 14A, S-1, et tous les autres formulaires SEC | Numéro CIK ou symbole + type de formulaire |
| PubMed | 35M+ résumés et textes intégraux biomédicaux | PMID, DOI, ou mots-clés + plage de dates |
| ClinicalTrials.gov | Métadonnées d'essais, statut, résultats, protocoles | Numéro NCT ou condition + intervention |
| Brevets USPTO | Texte intégral des brevets US, citations, cessions | Numéro de brevet ou mots-clés + code de classification |
| EPO / WIPO | Brevets européens et internationaux | Numéro de demande ou mots-clés |
| Rapports financiers | Communiqués de gains, présentations aux investisseurs | Nom de l'entreprise + période fiscale |

### Motifs de requête par source

**SEC EDGAR — dépôts 10-K:**
```
Utiliser Valyu pour récupérer le dépôt 10-K pour [COMPANY] (symbole : [TICKER]) pour l'année fiscale [YEAR].
Extraire : revenu, marge brute, dépense R&D, revenu d'exploitation, revenu net, nombre d'actions.
Retourner sous forme de tableau avec changement année sur année.
```

**SEC EDGAR — analyse de tendance sur les années:**
```
Utiliser Valyu pour extraire les dépôts 10-K pour [COMPANY] pour les années fiscales [YEAR-2], [YEAR-1], et [YEAR].
Pour chaque année, extraire : revenu total, dépense R&D en % du revenu, flux de trésorerie libre.
Construire un tableau de tendance et noter les changements année sur année.
```

**PubMed — recherche littéraire:**
```
Utiliser Valyu pour rechercher dans PubMed les articles sur [TOPIC].
Filtrer : publié [DATE RANGE], anglais uniquement, sujets humains.
Retourner : titre, auteurs, journal, année, résumé, DOI pour les 10 meilleurs par nombre de citations.
```

**ClinicalTrials.gov — recherche d'essais:**
```
Utiliser Valyu pour interroger ClinicalTrials.gov pour les essais étudiant [INTERVENTION] dans [CONDITION].
Filtrer : Phase 2 ou 3, terminée ou recrutement actif, résultats disponibles.
Retourner : numéro NCT, titre, sponsor, inscription, point final primaire, résumé des résultats si disponible.
```

**Recherche de brevets:**
```
Utiliser Valyu pour rechercher dans les brevets USPTO pour [TECHNOLOGY AREA].
Filtrer : brevets accordés, [DATE RANGE], assigné à [COMPANY] si spécifique.
Retourner : numéro de brevet, titre, résumé, date de dépôt, date d'accord, résumé des revendications clés.
```

### Formatage des citations

Lors de la production de résultats de recherche, formater les citations provenant de Valyu comme :

**Dépôt SEC:**
```
[Company Name]. Form 10-K. United States Securities and Exchange Commission. Filed [date]. 
Accession number: [accession]. Retrieved via Valyu.
```

**Article PubMed:**
```
[Authors]. "[Title]." [Journal] [Vol]([Issue]) ([Year]): [Pages]. PMID: [PMID]. DOI: [DOI].
```

**Essai clinique:**
```
[Trial Title]. ClinicalTrials.gov identifier: [NCT number]. [Sponsor]. [Status as of retrieved date].
```

**Brevet:**
```
[Assignee]. "[Patent Title]." [Patent Number]. [Grant date]. [Classification].
```

### Combiner Valyu avec la recherche web

Pour une recherche complète, combiner Valyu (sources primaires) avec WebSearch (contexte, analyse, actualités) :

```
Flux de travail de recherche pour [COMPANY] analyse concurrentielle :

Étape 1 — Valyu : Extraire les 3 dernières années de dépôts 10-K. Extraire revenu, marges, dépense R&D.
Étape 2 — Valyu : Extraire tous les dépôts 8-K des 12 derniers mois pour les événements importants.
Étape 3 — WebSearch : Trouver la couverture des analystes, les actualités récentes et les commentaires publics.
Étape 4 — Synthétiser : Données financières primaires de Valyu + contexte qualitatif du web.
Noter clairement les affirmations provenant de dépôts officiels par rapport aux sources secondaires.
```

### Sensibilisation aux coûts

Valyu facture par requête. Directives pour maintenir les coûts bas :
- Utiliser les identifiants spécifiques (CIK, PMID, numéro NCT, numéro de brevet) quand vous les avez — les recherches par mots-clés consomment plus de quota
- Demander uniquement les années ou plages de dates dont vous avez besoin — ne pas extraire tous les dépôts si vous avez besoin que des 3 derniers
- Mettre les résultats en cache pour la session : si vous avez extrait un 10-K, le garder en contexte plutôt que de le réquérir

## Exemple

**Tâche:** Extraire les 3 dernières années de dépôts 10-K pour une entreprise publique et extraire les tendances de croissance des revenus et dépense R&D.

**Requête:**
```
Utiliser Valyu pour récupérer les dépôts annuels 10-K pour Cloudflare (symbole : NET) pour les années fiscales
2022, 2023, et 2024.

De chaque dépôt, extraire :
- Revenu total
- Croissance du revenu année sur année %
- Dépense R&D
- R&D en % du revenu
- Perte / revenu d'exploitation
- Flux de trésorerie libre (flux de trésorerie d'exploitation moins capex)

Présenter sous forme de tableau avec les trois années côte à côte.
Puis écrire 3 phrases interprétant la tendance.
Citer chaque dépôt avec le numéro d'accréditation SEC.
```

**Structure de sortie attendue:**
| Métrique | FY2022 | FY2023 | FY2024 |
|---|---|---|---|
| Revenue | $975M | $1.30B | $1.63B |
| YoY growth | 49% | 33% | 26% |
| R&D expense | $423M | $522M | $609M |
| R&D % revenue | 43% | 40% | 37% |

Avec citation : "Cloudflare Inc. Form 10-K. SEC. Filed 2025-02-21. Accession: 0001477932-25-003456."

---
