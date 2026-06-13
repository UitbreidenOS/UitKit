---
name: ai-impact-assessment
description: "Évaluation d'impact de l'IA (AIA) : classification de la loi sur l'IA de l'UE, piste de risque, tri des cas d'usage, cohérence des politiques, examen du fournisseur IA — pour les équipes juridiques et conformité"
---

# Compétence Évaluation d'Impact de l'IA

## Quand l'activer
- Votre organisation déploie un nouveau système ou cas d'usage IA
- Vous avez besoin de classer un système IA en vertu de la loi sur l'IA de l'UE
- Mener un examen de fournisseur IA avant d'acheter un produit IA
- Auditer les déploiements d'IA existants pour les lacunes de conformité
- Générer un document d'évaluation d'impact de l'IA pour gouvernance interne

## Quand NE PAS l'utiliser
- Remplacer une évaluation formelle d'impact sur la protection des données (DPIA) — exécuter les deux si requis
- Conseils juridiques sur les obligations de la loi sur l'IA — consulter un conseiller spécialisé
- Surveillance du système IA en temps réel — nécessite un outillage dédié

## ⚠️ Important

La loi sur l'IA de l'UE est entrée en application complète en août 2026. Les systèmes d'IA à haut risque exigent des évaluations de conformité et inscriptions obligatoires. Claude aide à structurer l'évaluation — votre DPO et conseils juridiques doivent vérifier avant les soumissions formelles.

## Instructions

### Étape 1 — Intake du cas d'usage

```
Nouveau système/cas d'usage IA à évaluer :

Nom : [nom du système ou cas d'usage]
Description : [ce qu'il fait, en langage clair]
Déployeur/développeur : [construisons-nous ceci ou l'achetons-nous ?]
Utilisateurs : [employés / clients / tiers / public]
Type de sortie : [décision / recommandation / contenu / classification / prédiction]
Résultats conséquents : [que se passe-t-il en fonction de la sortie de l'IA ?]
Entrées de données : [données personnelles / biométriques / catégories sensibles ?]
Échelle : [combien de personnes sont affectées ?]
```

### Étape 2 — Classification selon la loi sur l'IA de l'UE

```
Classer ce système IA en vertu de la loi sur l'IA de l'UE :

INTERDIT (Article 5) — vérifier en premier :
- Notation sociale par autorités publiques
- Identification biométrique à distance en temps réel dans espaces publics
- Manipulation subliminale
- Exploitation de groupes vulnérables
- Inférence de caractéristiques politiques/religieuses/raciales à partir de données biométriques

Si aucun des éléments ci-dessus ne s'applique, classez par palier de risque :

HAUT RISQUE (Annex III) — évaluation de conformité obligatoire requise :
- Identification/catégorisation biométrique
- Gestion d'infrastructure critique
- Résultats d'éducation/formation professionnelle
- Décisions d'emploi/RH
- Accès aux services essentiels (crédit, assurance, santé)
- Application de la loi
- Migration/contrôle aux frontières
- Administration de la justice

RISQUE LIMITÉ :
- Chatbots et IA conversationnelle (obligation de transparence)
- Reconnaissance d'émotions (divulgation requise)
- Contenu généré par IA (marquage)
- Modèles d'IA à usage général

RISQUE MINIMAL :
- IA utilisée dans les jeux
- Filtres anti-spam
- Recherche alimentée par l'IA

[VÉRIFIEZ] classification avec conseils juridiques avant de vous y fier.
```

## Exemple

**Cas d'usage :** Une équipe RH veut utiliser un outil d'IA qui sélectionne les CV et note les candidats avant examen humain.

**Évaluation Claude :**

**Classification : HAUT RISQUE** — Annex III, Section 4 : Systèmes d'IA utilisés dans emploi et gestion des travailleurs, y compris recrutement, sélection et évaluation des candidats.

**Requis avant déploiement :**
- Documentation technique complète (Art. 11)
- Évaluation de conformité ou audit tiers
- Inscription en base de données IA de l'UE
- DPIA (traite les données proches des biométriques — photos, inférence d'âge)

**Risques clés :**
- Discrimination proxy : le modèle peut proxifier des caractéristiques protégées via code postal, nom, année graduation
- Biais de données d'entraînement : si entraîné sur embauches historiques, réplique biais historique
- Manque de transparence : candidats ont droit à explication significative des décisions automatisées (GDPR Art. 22)

**Protections requises :**
- Examen humain obligatoire avant tout rejet
- Divulgation aux candidats que l'IA est utilisée en sélection
- Test de biais sur caractéristiques protégées avant déploiement
- Droit à examen humain à la demande
- Audits de biais réguliers post-déploiement

**Recommandé :** L'acquisition devrait être conditionnelle à la documentation d'évaluation de conformité du fournisseur et accord sur droits d'audit contractuels.

---
