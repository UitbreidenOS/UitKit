---
name: eu-ai-act
description: "Conformité Loi IA de l'UE (Règlement 2024/1689) : classification du niveau de risque (interdite/haut risque/limité/minimal), routes d'évaluation de conformité, documentation Annexe IV et obligations par rôle organisationnel"
---

# Compétence Loi IA de l'UE

## Quand l'activer
- Classification du niveau de risque d'un système IA selon le Règlement (UE) 2024/1689
- Détermination des exigences d'évaluation de conformité pour les systèmes IA à haut risque
- Identification des obligations par rôle organisationnel (fournisseur, déployeur, importateur, distributeur)
- Préparation de la documentation technique Annexe IV pour un système IA à haut risque
- Évaluation si un système IA est interdit selon l'Article 5
- Planification des chronologies et jalons de conformité à la Loi IA de l'UE

## Quand NE PAS l'utiliser
- Conformité RGPD pour les données de formation IA ou traitement des résultats — utiliser la compétence d'expert RGPD (les Actes interagissent mais sont distincts)
- Stratégie IA générale — cette compétence concerne le travail de conformité, pas les décisions IA stratégiques
- Gouvernance IA américaine (NIST AI RMF, lois d'État) — cadres différents
- Opinion juridique contraignante sur classifications nouvelles — engager un conseil juridique qualifié de l'UE

## Instructions

### Classification du niveau de risque

```
Classifiez ce système IA selon la Loi IA de l'UE.

Description du système : [décrivez ce que fait le système IA]
Données d'entrée : [quelles données il traite]
Résultat / décisions : [ce qu'il produit ou décide]
Contexte de déploiement : [où et par qui il sera utilisé]
Rôle organisationnel : [fournisseur (plaçant sur le marché) / déployeur (utilisant dans les opérations) / les deux]

Cadre de classification (hiérarchique — vérifiez dans l'ordre) :

ÉTAPE 1 — ARTICLE 5 : PRATIQUES INTERDITES (interdiction absolue) :
L'une de ces éléments = interdit ; ne peut pas être placé sur le marché ou utilisé dans l'UE :
□ Manipulation sublimale causant du tort à une personne
□ Exploitation des vulnérabilités de groupes spécifiques (âge, handicap) causant du tort
□ Notation sociale par autorités publiques entraînant un traitement défavorable
□ Identification biométrique à distance en temps réel dans espaces publics par forces de l'ordre (exceptions très limitées)
□ Catégorisation biométrique déduisant race, opinion politique, adhésion à syndicat, croyance religieuse, orientation sexuelle
□ Reconnaissance d'émotion en milieux professionnels ou éducatifs
□ Scrape non ciblée d'images faciales pour construire des bases de données

Si l'une des ci-dessus = OUI → INTERDITE. Ne procédez pas.

ÉTAPE 2 — ARTICLE 6 + ANNEXE III : HAUT RISQUE :
Le système est à haut risque s'il relève d'une des 8 catégories Annexe III ET est utilisé tel qu'envisagé :

Catégories Annexe III :
1. Identification et catégorisation biométrique (pas les interdites)
2. Infrastructure critique (eau, gaz, électricité, transport)
3. Éducation et formation professionnelle (évaluation des étudiants, décisions d'accès)
4. Emploi et gestion des travailleurs (dépistage de recrutement, surveillance de performance, allocation de tâches)
5. Services privés et publics essentiels (notation de crédit, admissibilité aux prestations, assurance, services d'urgence)
6. Application de la loi (évaluation des risques, polygraphes, évaluation des preuves, prédiction criminelle)
7. Migration, asile, contrôle aux frontières (évaluation des risques, vérification de documents, traitement des demandes)
8. Administration de la justice et processus démocratiques

Article 6(3) EXCLUSIONS (système Annexe III mais HAUT RISQUE seulement) :
a) Effectue une tâche procédurale étroite
b) Améliore le résultat d'une activité humaine précédemment complétée
c) Détecte des modèles de prise de décision sans remplacer l'évaluation humaine
d) Effectue une tâche préparatoire à une évaluation
⚠️ EXCEPTION : profilage de personnes physiques TOUJOURS à haut risque indépendamment des exclusions

Si la catégorie Annexe III s'applique ET pas d'exclusion → HAUT RISQUE (obligations Article 8-17 s'appliquent)

ÉTAPE 3 — ARTICLE 50 : RISQUE LIMITÉ (transparence seulement) :
□ Chatbots / IA conversationnelle interagissant avec humains → doit divulguer la nature IA
□ Deepfakes / médias synthétiques → doit étiqueter comme généré par IA
□ Reconnaissance d'émotion en dehors des contextes Article 5 → obligations de transparence
□ Catégorisation biométrique en dehors des contextes Article 5 → obligations de transparence

Si l'un des ci-dessus = OUI → RISQUE LIMITÉ (obligations de divulgation seulement)

ÉTAPE 4 — RISQUE MINIMAL (par défaut) :
Tout le reste → pas d'obligations selon la Loi (codes de conduite volontaires encouragés)

Résultat : niveau de risque + référence Article + obligations déclenchées
[RÉVISION JURIDIQUE REQUISE pour classifications nouvelles ou limites]
```

### Obligations des systèmes à haut risque

```
Cartographiez les obligations pour un système IA à haut risque.

Système : [nom et brève description]
Niveau de risque confirmé : HAUT RISQUE (Annexe III, catégorie [X])
Rôle organisationnel : [fournisseur / déployeur / les deux]

OBLIGATIONS DU FOURNISSEUR (Article 16) — plaçant le système sur le marché UE :

Article 9 — Système de gestion des risques :
□ Établir, implémenter, documenter et maintenir la gestion des risques tout au long du cycle de vie
□ Gestion des risques itérative — doit être mise à jour tout au long du cycle de vie du système
□ Identifier et analyser les risques connus et prévisibles
□ Adopter des mesures d'atténuation des risques ; les risques résiduels doivent être acceptables

Article 10 — Gouvernance des données de formation :
□ Les données de formation, validation et test doivent respecter critères de qualité
□ Les données doivent être pertinentes, représentatives, exemptes d'erreurs, complètes
□ Procédures d'examen et de détection des biais en place
□ Les données de catégories spéciales dans la formation seulement si strictement nécessaires + protections

Article 11 — Documentation technique (Annexe IV) :
Doit être préparée AVANT plaçage sur le marché. Contient :
□ Description générale du système IA et son objectif envisagé
□ Description des éléments et du processus de développement
□ Informations de surveillance, fonctionnement et contrôle
□ Description des changements apportés tout au long du cycle de vie du système
□ Documentation de gestion des risques
□ Plan de surveillance post-marché
□ Toute autre documentation requise par Annexe IV

Article 12 — Tenue des dossiers (journalisation) :
□ Journalisation automatique des événements tout au long de l'opération du système
□ Les journaux retenus pendant au moins 6 mois (ou plus selon règles sectorielles)
□ Les journaux doivent permettre la traçabilité de l'opération et la reconstruction d'incidents

Article 13 — Transparence et information :
□ Instructions d'utilisation fournies aux déployeurs (ce que fait le système, limitations, niveaux de précision)
□ Mesures de surveillance humaine décrites
□ Niveau de précision, robustesse, cybersécurité spécifiés

Article 14 — Surveillance humaine :
□ La conception doit permettre aux personnes de surveiller efficacement et d'intervenir
□ Les déployeurs doivent pouvoir comprendre capacités et limitations
□ Doit pouvoir ignorer, remplacer ou inverser les résultats
□ Doit pouvoir interrompre le système via un bouton d'arrêt ou similaire

Article 15 — Précision, robustesse, cybersécurité :
□ Métriques de précision documentées pour l'objectif envisagé
□ Résilience aux erreurs, défauts et incohérences
□ Résilience contre les tentatives adverses d'altérer les performances

OBLIGATIONS DU DÉPLOYEUR (Article 26) — utilisant le système dans les opérations :
□ Utiliser le système uniquement conformément aux instructions d'utilisation
□ Assigner la surveillance humaine à des personnes qualifiées
□ Surveiller l'opération et signaler les incidents graves au fournisseur (et autorité si préjudice direct)
□ Exécuter Évaluation d'impact sur les droits fondamentaux si requise (secteur public + services essentiels)
□ Informer les employés quand ils travaillent aux côtés ou sous surveillance d'IA à haut risque

Générez la liste de contrôle complète des obligations pour mon système et rôle.
```

[Continuing with conformity assessment and timeline sections in French...]

---
