# Critères de Certification de Stack Marketplace

Ce guide détaille les critères quantifiés, les rubriques de qualité et les méthodologies de mesure pour la Certification de Stack Claudient.

## Vue d'ensemble

La certification de stack comporte trois niveaux : Bronze, Argent et Or. Chaque niveau a des critères mesurables sur cinq dimensions : qualité du code, adoption par les utilisateurs, satisfaction des utilisateurs, maintenance et documentation.

---

## Calcul du Score de Qualité

Chaque stack reçoit un score de qualité composite (0-100) calculé comme suit :

```
Quality Score = (0.20 × Code Quality) + (0.20 × Adoption) + (0.20 × Satisfaction) + (0.20 × Maintenance) + (0.20 × Documentation)
```

Plages de scores :
- 80-100 : Candidat niveau Or
- 60-79 : Candidat niveau Argent
- 40-59 : Candidat niveau Bronze
- Inférieur à 40 : Non admissible à la certification

---

## 1. Qualité du Code (20%)

**Mesure :** Couverture de test, conformité du linting, fraîcheur des dépendances, résultats des audits de sécurité.

| Métrique | Excellent (90-100) | Bon (70-89) | Acceptable (50-69) | Faible (Inférieur à 50) |
|--------|-------------------|--------------|-------------------|-----------------|
| **Couverture des tests** | 80%+ | 60-79% | 40-59% | Inférieur à 40% |
| **Linting** | Pas de problèmes | ≤2 problèmes mineurs | 3-5 problèmes mineurs | 6+ problèmes ou problèmes critiques |
| **Dépendances** | Toutes à jour ; mises à jour automatisées | 1-2 obsolètes ; plan de mise à jour en place | 3+ obsolètes ; plan nécessaire | 5+ gravement obsolètes ; vulnérabilités critiques |
| **Sécurité** | Audit annuel ; pas de problèmes | Aucune vulnérabilité connue | 1-2 problèmes de faible gravité | Vulnérabilités non corrigées |

**Exigence Bronze :** 50+ (acceptable) dans chaque métrique
**Exigence Argent :** 70+ (bon) dans chaque métrique
**Exigence Or :** 90+ (excellent) dans chaque métrique

---

## 2. Adoption par les Utilisateurs (20%)

**Mesure :** Nombre d'installations, utilisateurs actifs hebdomadaires, vélocité de tendance, utilisation des commandes.

| Métrique | Or | Argent | Bronze |
|--------|------|--------|--------|
| **Installations totales (fenêtre 90 jours)** | 200+ | 50+ | 10+ |
| **Utilisateurs actifs hebdomadaires** | 25+ | 10+ | 3+ |
| **Vélocité de tendance** | +20% semaine après semaine | +10% semaine après semaine | Stable ou croissant |
| **Utilisation Commandes/Compétences** | 70%+ des fonctionnalités utilisées régulièrement | 50%+ des fonctionnalités utilisées régulièrement | 30%+ des fonctionnalités utilisées |

**Score d'adoption = (Installations / Cible) × 25 + (WAU / Cible) × 25 + (Bonus Vélocité) + (Bonus Utilisation)**

Installations cibles : Bronze=10, Argent=50, Or=200. Si dépassé, plafonné à 100 points.

---

## 3. Satisfaction des Utilisateurs (20%)

**Mesure :** Note moyenne, sentiment des avis, taux de résolution des problèmes, NPS.

| Métrique | Or | Argent | Bronze |
|--------|------|--------|--------|
| **Note moyenne** | 4.5+ | 4.0+ | 3.5+ |
| **Nombre d'avis** | 20+ avis | 10+ avis | 5+ avis |
| **Taux de résolution des problèmes** | 95%+ des problèmes résolus | 85%+ des problèmes résolus | 70%+ des problèmes résolus |
| **Sentiment (Avis positifs)** | 80%+ positifs | 70%+ positifs | 60%+ positifs |
| **NPS (si disponible)** | 50+ | 40+ | 30+ |

**Score de satisfaction = (Note × 25) + (Taux de résolution × 25) + (Sentiment × 25) + (Bonus NPS × 25)**

---

## 4. Maintenance (20%)

**Mesure :** Récence des mises à jour, fraîcheur des dépendances, délai de réponse aux problèmes, fréquence des commits.

| Métrique | Or | Argent | Bronze |
|--------|------|--------|--------|
| **Jours depuis la dernière mise à jour** | 30 jours | 90 jours | 180 jours |
| **Âge des dépendances** | 90% des versions actuelles | 80% des versions actuelles | 70% des versions actuelles |
| **Délai moyen de réponse aux problèmes** | 48 heures | 1 semaine | 2 semaines |
| **Fréquence des commits** | Mensuel ou plus | Trimestriel ou plus | Semestriel ou plus |
| **Problèmes critiques en cours** | 0 | 0 | 0 (antérieurs à 60 jours) |

**Score de maintenance = (Bonus Récence × 25) + (Fraîcheur des dépendances × 25) + (Délai de réponse × 25) + (Fréquence des commits × 25)**

Notation du délai de réponse :
- ≤48 heures : 100 points
- ≤1 semaine : 80 points
- ≤2 semaines : 60 points
- >2 semaines : 40 points

---

## 5. Documentation (20%)

**Mesure :** Complétude du README, qualité des exemples, commentaires en ligne, clarté, précision.

| Composant | Excellent (90-100) | Bon (70-89) | Acceptable (50-69) | Faible (Inférieur à 50) |
|-----------|-------------------|--------------|-------------------|-----------------|
| **README** | Sections complètes ; cas d'utilisation clairs ; installation 5 min | Plupart des sections présentes ; quelques lacunes ; installation 10 min | Informations de base présentes ; sections peu claires ; installation 15+ min | Incomplet ; confus ; non fonctionnel |
| **Exemples** | 3+ exemples complets avec explications | 2 exemples fonctionnels ; quelques explications | 1 exemple ; explication minimale | Exemples manquants ou non fonctionnels |
| **CLAUDE.md** | Instructions claires ; toutes les fonctionnalités expliquées | Plupart des instructions présentes ; quelques lacunes | Instructions de base ; incomplètes | Manquant ou peu clair |
| **Commentaires de code** | Fonctions/algorithmes documentés ; intention claire | Sections clés commentées | Commentaires clairsemés | Pas de commentaires significatifs |
| **Précision** | Meilleures pratiques actuelles ; pas d'erreurs | Éléments mineurs obsolètes ; plupart précis | Certains modèles obsolètes ; inexactitudes mineures | Significativement obsolète ; erreurs majeures |

**Score de documentation = (README × 25) + (Exemples × 25) + (CLAUDE.md × 25) + (Commentaires × 15) + (Précision × 10)**

---

## Seuils d'Utilisation

### Minimums d'Installation

La certification nécessite des nombres minimum d'installations sur une fenêtre de mesure :

**Bronze :** 10+ installations (toute période)
**Argent :** 50+ installations sur 90 jours
**Or :** 200+ installations sur 180 jours

Les installations sont suivies via :
- Téléchargements du paquet npm (pour les stacks basés sur CLI)
- Clones du référentiel GitHub
- Suivi des installations du marketplace Claude Code
- Installations rapportées directement par l'auteur (avec vérification)

### Minimums de Notation

**Bronze :** 3.5+ moyenne (5+ avis requis pour le calcul)
**Argent :** 4.0+ moyenne (10+ avis requis pour le calcul)
**Or :** 4.5+ moyenne (20+ avis requis pour le calcul)

Les notes sont normalisées à une échelle de 5 points. Le nombre d'avis doit respecter le minimum avant que le score soit considéré comme valide.

### Seuils d'Activité

**Bronze :** Mise à jour dans les 6 mois
**Argent :** Mise à jour dans les 3 mois
**Or :** Mise à jour dans le mois

Les mises à jour incluent :
- Commits de code vers la branche principale
- Mises à jour de documentation
- Mises à jour des dépendances
- Réponses aux problèmes

---

## SLA de Maintenance

### SLA Bronze

- Répond à tous les problèmes dans les 2 semaines
- Corrige les bugs critiques dans les 2 semaines
- Applique les mises à jour de dépendances critiques dans le mois
- Met à jour la documentation dans les 2 semaines suivant les changements d'API

### SLA Argent

- Répond à tous les problèmes dans la semaine
- Corrige les bugs critiques dans les 2 semaines
- Évalue toutes les mises à jour de dépendances dans les 2 semaines
- Garde la documentation à jour avec les changements de fonctionnalités
- Versions mensuelles ou trimestrielles

### SLA Or

- Répond à tous les problèmes dans les 48 heures
- Corrige les bugs critiques dans les 5 jours ouvrables
- Évalue et applique toutes les mises à jour de dépendances dans la semaine
- Garde la documentation synchronisée avec le code (dans la semaine)
- Versions mensuelles ou développement actif
- Audits de sécurité proactifs (minimum annuel)

---

## Période de Mesure

**Certification Initiale :** Basée sur les 90 derniers jours d'activité
**Recertification :** Basée sur une fenêtre glissante de 365 jours

---

## Cas Limites

### Nouvelles Stacks

Les stacks de moins de 90 jours peuvent demander la certification Bronze si :
- Le score de qualité du code est 50+
- La documentation est complète
- L'examen manuel confirme la qualité

Les critères basés sur l'installation sont supprimés pour les premiers 90 jours.

### Langue et Localisation

La documentation en anglais est obligatoire pour tous les niveaux.

**Argent et Or :** Nécessitent au moins une langue supplémentaire (FR, DE, ES ou NL)

### Stacks Communautaires vs Officiels

Les critères de certification sont identiques indépendamment du modèle de maintenance. Le statut officiel (responsable tushar2704) n'accorde pas la certification automatique.

---

## Audit et Vérification

L'équipe centrale effectue des audits réguliers :
- Télécharge et teste la fonctionnalité de la stack
- Vérifie le nombre d'installations et les notes
- Examine les commits récents et les réponses aux problèmes
- Confirme la précision de la documentation
- Scan de sécurité pour les vulnérabilités courantes

Les audits surviennent :
- Avant l'approbation de la certification initiale
- Trimestriellement pour les stacks de niveau Or
- Annuellement pour les stacks de niveau Argent
- Tous les 18 mois pour les stacks de niveau Bronze

---

## Appels

Si une stack se voit refuser la certification ou être rétrogradée :

1. L'auteur peut demander une clarification (dans la semaine)
2. L'équipe centrale fournit une ventilation détaillée du score
3. L'auteur peut répostuler après avoir abordé les problèmes identifiés (après 2 semaines)
4. S'il est insatisfait de la rétroaction, escalader vers marketplace@claudient.dev pour un examen indépendant

---

**Dernière mise à jour :** 15 juin 2026
