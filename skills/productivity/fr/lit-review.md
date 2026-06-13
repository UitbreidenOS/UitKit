---
name: lit-review
description: "Revue de littérature académique : stratégie de recherche systématique, criblage des articles, cadres de synthèse, gestion des citations et production d'une section d'examen structurée ou d'un résumé"
---

# Compétence Lit Review

## Quand l'activer
- Réaliser une revue systématique ou exploratoire de la littérature académique
- Synthétiser les résultats de plusieurs articles sur un sujet
- Rédiger une section de revue de littérature pour une thèse, un rapport ou un article
- Identifier les lacunes dans les recherches existantes
- Évaluer la qualité des preuves académiques
- Trouver les citations canoniques pour un concept technique

## Quand NE PAS l'utiliser
- Analyse de brevets — utiliser la compétence patent-analysis
- Recherche générale sur internet — celle-ci est spécifique à la littérature académique
- Collecte de données primaires ou conception d'études — compétence des méthodes de recherche différente
- Rédaction de l'article complet — cette compétence couvre la revue, pas la recherche originale

## Instructions

### Stratégie de recherche

```
Concevoir une stratégie de recherche bibliographique pour [sujet].

Thème de recherche : [description — quelle question essayez-vous de répondre ?]
Type de revue : [systématique (exhaustive) / exploratoire (large mappage) / narrative (sélective)]
Bases de données à interroger : [PubMed / Scopus / Web of Science / ACM / IEEE / Google Scholar / arXiv]
Plage de dates : [les 5 dernières années / 2000-présent / tous les temps]
Langues : [anglais uniquement / toutes les langues]

Stratégie de recherche :

1. Décomposer le sujet en concepts :
   PICO (pour médical/clinique) ou SPIDER (qualitatif) :
   Population : [qui/quoi est étudié]
   Intervention/exposition : [ce qui est fait/étudié]
   Comparaison : [à quoi est-ce comparé, le cas échéant]
   Résultat : [ce qui est mesuré]

2. Construire des listes de mots-clés pour chaque concept :
   Concept 1 : [terme principal] ET [synonymes] ET [abréviations]
   Exemple : « machine learning » OU « ML » OU « artificial intelligence » OU « deep learning »
   
   Concept 2 : [terme principal] ET [synonymes]
   Exemple : « clinical prediction » OU « diagnostic accuracy » OU « clinical decision support »

3. Combiner avec des opérateurs booléens :
   (Mots-clés Concept 1) ET (Mots-clés Concept 2) ET (Mots-clés Concept 3)

4. Appliquer des filtres :
   - Plage de dates : publié : [YYYY] à [YYYY]
   - Type de document : articles de journal / articles de conférence / exclure les dissertations
   - Langue : anglais
   - Type d'étude (le cas échéant) : essai contrôlé randomisé / revue systématique / cohorte

5. Exécuter dans chaque base de données séparément (ne pas supposer qu'elles sont identiques) :
   - Enregistrer : base de données, chaîne de recherche utilisée, date d'exécution, nombre de résultats

6. Gérer les doublons entre les bases de données :
   Utiliser : Zotero / Mendeley / Rayyan pour la dédupplication
   Exporter tous les résultats → combiner → dédupliquer sur titre/DOI

Générer la stratégie de recherche pour mon sujet avec des chaînes de recherche spécifiques à chaque base de données.
```

### Protocole de criblage

```
Cribler les articles pour l'inclusion/exclusion pour [revue].

Total récupéré : [X articles]
Critères d'inclusion : [ce qui se qualifie pour l'inclusion]
Critères d'exclusion : [ce qui est supprimé et pourquoi]

Protocole de criblage :

STADE 1 — Criblage du titre et du résumé (plus rapide) :
Inclure si : le titre ou le résumé suggère que l'article aborde [votre sujet]
Exclure si : clairement hors sujet, mauvaise population, mauvais type d'étude
Décision : inclure / exclure / incertain (incertain → inclure pour examen du texte intégral)

STADE 2 — Criblage du texte intégral :
Lire la section méthodes : respecte-t-elle tous les critères d'inclusion ?
Appliquer les critères d'exclusion systématiquement

Liste de vérification des critères d'inclusion (personnalisez pour votre sujet) :
☐ Population : [décrire qui/quoi se qualifie]
☐ Intervention : [décrire ce qui doit être étudié]
☐ Résultat : [ce qui doit être mesuré/rapporté]
☐ Conception de l'étude : [conceptions acceptables — par ex., ECR, cohorte, avant-après]
☐ Publication : [seul examiné par les pairs / littérature grise OK / articles de conférence OK]
☐ Langue : [anglais uniquement]
☐ Date : [publié après YYYY]

Critères d'exclusion :
☐ Publication en double de la même étude
☐ Données insuffisantes pour extraction (seul le résumé disponible)
☐ Article de protocole sans résultats
☐ Résumé de conférence sans article complet
☐ Non évalué par les pairs (le cas échéant)

Enregistrer les décisions :
| Article | Titre | Décision | Raison de l'exclusion |
|---|---|---|---|
| [1] | [titre] | Inclure | — |
| [2] | [titre] | Exclure | Mauvaise population |

Cible : un taux d'inclusion de 5 à 15% est typique pour les revues systématiques.
Si > 30% : la recherche est trop étroite ou les critères trop larges — revisiter.
Si < 2% : la recherche est trop large ou les critères trop étroits — ajuster.

Générer les critères de criblage pour mon sujet de revue spécifique.
```

### Modèle d'extraction de données

```
Extraire les données des articles pour [revue].

Articles à extraire : [X articles inclus]
Question de recherche : [reformuler]
Données à extraire : [quelles informations avez-vous besoin de chaque article]

Tableau d'extraction de données (personnalisez les colonnes pour votre sujet) :

Pour chaque article, enregistrer :
| Champ | Description |
|---|---|
| Citation | Auteur (Année). Titre. Journal. DOI. |
| Conception de l'étude | ECR / cohorte / transversale / cas-contrôle / qualitative |
| Population | N, démographie, cadre, pays |
| Intervention | Ce qui a été fait, durée, dose |
| Comparaison | Condition témoin |
| Mesure de résultat | Résultat primaire, comment mesuré |
| Résultat clé | Conclusion principale (inclure la taille de l'effet / valeur p / IC) |
| Risque de biais | Élevé / Moyen / Faible (basé sur la conception de l'étude) |
| Pertinence pour notre question | Directe / Indirecte / Périphérique |
| Notes | Limitations, constatations inhabituelles, conflits d'auteur |

Outils d'évaluation de la qualité par type d'étude :
- ECR : Outil de risque de biais Cochrane (RoB 2)
- Études de cohorte : Échelle de Newcastle-Ottawa (NOS)
- Qualitative : liste de contrôle CASP
- Revues systématiques : AMSTAR-2
- Tous les types d'études : GRADE pour la certitude de la preuve

Meilleures pratiques d'extraction :
- Extraire par une personne, vérifier par une seconde (l'extraction double réduit les erreurs)
- Extraire à l'unité d'analyse — si l'article rapporte 3 résultats pertinents, extraire chacun
- Noter si les données manquent ou ne sont pas claires — ne pas imputer
- Enregistrer la source figure/tableau pour chaque nombre extrait

Générer le modèle d'extraction pour ma question d'examen et mes types d'articles.
```

### Synthèse et rédaction

```
Synthétiser les résultats et rédiger une section de revue de littérature.

Articles inclus : [X]
Thèmes émergents : [décrire 3-5 thèmes récurrents dans les articles]
Résultats du consensus : [où les articles s'accordent]
Contradictions : [où les articles ne s'accordent pas et pourquoi]
Lacunes : [ce qui n'a pas été étudié]
Public : [comité de thèse / examinateurs de journal / décideurs / non-spécialistes]

Approches de synthèse :

SYNTHÈSE NARRATIVE (plus courante) :
Grouper les articles par thème ou résultat, pas par article individuel.
Ne pas : « Smith (2020) a trouvé X. Jones (2021) a trouvé Y. Brown (2022) a trouvé Z. »
Faire : « De multiples études démontrent [X], particulièrement dans [contexte] (Smith 2020 ; Jones 2021). Cependant, les preuves sont mitigées dans [contexte différent], Brown (2022) trouvant [Y] mais Chen (2023) rapportant [Z], potentiellement en raison de [différence méthodologique]. »

META-ANALYSE (si les données quantitatives sont homogènes) :
Mettre en commun les tailles d'effet dans les études → moyenne pondérée
Nécessite : même mesure de résultat, populations comparables, conceptions d'études compatibles
Outils : RevMan, package R metafor

ANALYSE THÉMATIQUE (pour qualitative) :
Coder les thèmes dans les articles → synthétiser les modèles

Structure de la section revue de littérature :

1. Paragraphe d'ouverture :
   [Encadrer la revue dans le contexte de votre question de recherche]
   « Cette section examine [X] études examinant [sujet]. »

2. Corps (organisé par thème, pas par article) :
   Thème 1 : [Résultats dans plusieurs articles + citations]
   Thème 2 : [Preuves contradictoires + explication]
   Thème 3 : [Avancées méthodologiques]

3. Paragraphe de lacunes :
   « Malgré une preuve substantielle pour [X], [lacune] reste peu étudiée. [Seulement N études] ont examiné [population/contexte spécifique]. Cette revue [identifie / adresse] cette lacune. »

4. Paragraphe de fermeture :
   [Ce que la revue établit / ce qu'elle ne peut pas établir / comment cela configure votre recherche]

Rédiger la section revue de littérature pour mes articles et thèmes inclus.
```

## Exemple

**Utilisateur :** Je révise la littérature sur les hallucinations LLM dans les contextes médicaux pour un article de conférence. J'ai trouvé 32 articles. Comment les synthétiser ?

**Plan de synthèse de Claude :**

32 articles est gérable pour une synthèse narrative dans un article de conférence (plutôt qu'une revue systématique complète). Organiser par thème, pas par article.

**Thèmes probables dans 32 articles sur les hallucinations LLM en médecine :**

1. **Fréquence et domaines cliniques** — Quel taux d'hallucination ? Quels domaines cliniques (radiologie, dosage des médicaments, maladies rares) sont les pires ? (Organiser les articles par domaine et rapporter les taux)

2. **Méthodes de détection** — Comment les chercheurs identifient-ils les hallucinations ? (Examen d'expert / vérification de fait automatisée / corrélation des résultats des patients) — synthétiser les approches méthodologiques

3. **Facteurs de risque** — Qu'est-ce qui augmente le risque d'hallucination ? (Résultats longs ? Conditions rares ? LLM spécifiques ?) — c'est où le désaccord vit habituellement

4. **Stratégies d'atténuation** — RAG, fine-tuning, boucle humaine, IA constitutionnelle — quelles preuves existent pour chacun ?

5. **Lacunes méthodologiques** — La plupart des études : petit N, institution unique, anglais uniquement, LLM généraux plutôt que fine-tunes cliniques. C'est votre section de lacune.

**Exemple de paragraphe de synthèse (thème 1) :**

« Les taux d'hallucination dans les applications LLM cliniques varient considérablement selon le domaine et la complexité des tâches. Dans les tâches de dosage des médicaments et de pharmacologie, [X] études rapportent [plage]% des taux d'erreur (Smith 2023 ; Lee 2024 ; Patel 2024), avec des taux plus élevés observés pour les médicaments rares ou les scénarios de polypharmacologie complexe (Smith 2023 ; Brown 2024). La génération de rapports radiologiques montre des taux d'hallucination comparativement plus faibles ([Y]%) dans les tâches impliquant des résultats structurés (Jones 2023), bien que les tâches d'interprétation narrative montrent des taux approchant [Z]% (Kim 2024 ; Thomas 2024). Dans tous les domaines, les taux d'hallucination sont régulièrement plus élevés dans les contextes où le modèle doit générer des valeurs numériques spécifiques (dosages, plages de référence de laboratoire) comparé aux conseils cliniques généraux (Smith 2023 ; Lee 2024 ; Kim 2024). »

Note : Je synthétise les articles par résultat, pas par article — c'est le changement structurel clé.

---
