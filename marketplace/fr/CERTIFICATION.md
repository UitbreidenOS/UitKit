# Niveaux de Certification de Stack Claudient

Ce document définit les niveaux de certification pour les stacks du Marketplace Claudient. Les stacks certifiées ont répondu à des normes de qualité quantifiées et des engagements de maintenance.

## Niveaux de Certification

### Niveau Bronze

**Critères :**
- Passe tous les contrôles de validation automatisés
- Complète l'examen humain sans obstacles
- L'auteur s'engage à une période de maintenance de 6 mois

**Avantages :**
- Badge de certification Bronze affiché dans le marketplace
- Stack listée dans l'index des stacks certifiées
- Priorité dans les résultats de recherche
- Inclus dans les rotations en vedette

**SLA de Maintenance :**
- Répond aux rapports de bugs critiques dans les 2 semaines
- Aborde les mises à jour de dépendances critiques dans le mois
- Met à jour la documentation pour les changements d'API dans les 2 semaines

**Expiration :** 6 mois à compter de la date de certification

---

### Niveau Argent

**Critères :**
- Respecte toutes les exigences du niveau Bronze
- Minimum 50 installations sur 90 jours
- Note utilisateur moyenne de 4.0 ou plus
- Pas de problèmes critiques en cours depuis plus d'un mois
- Dernière mise à jour dans les 6 mois précédant la demande de certification

**Avantages :**
- Badge de certification Argent (prominence plus élevée)
- Présenté dans les catégories "Tendance" et "Recommandé"
- Listé dans l'index des stacks certifiées Argent
- Admissibilité aux opportunités de partenariat
- Offre de co-maintenance de l'équipe principale (optionnel)

**SLA de Maintenance :**
- Répond à tous les problèmes dans la semaine
- Les bugs critiques résolus dans les 2 semaines
- Les mises à jour de dépendances évaluées et appliquées dans les 2 semaines
- Mises à jour régulières (activité minimale mensuelle)

**Expiration :** 12 mois à compter de la date de certification

---

### Niveau Or

**Critères :**
- Respecte toutes les exigences du niveau Argent
- Minimum 200 installations sur 180 jours
- Note utilisateur moyenne de 4.5 ou plus
- Approbation du responsable officiel (membre officiel de l'équipe Claudient ou responsable communautaire vérifié avec antécédents)
- Documentation et exemples complets
- Support multilingue (minimum : anglais + 1 langue supplémentaire)

**Avantages :**
- Badge de certification Or (plus haute prominence)
- Présenté en avant sur la page d'accueil du marketplace
- Listé dans l'index des stacks certifiées Or
- Support exclusif de marketing et de promotion
- Accès direct à l'équipe principale pour les demandes de fonctionnalités et le support
- Admissibilité au partage des revenus (si applicable)

**SLA de Maintenance :**
- Répond à tous les problèmes dans les 48 heures
- Les bugs critiques résolus dans les 5 jours ouvrables
- Les mises à jour de dépendances évaluées et appliquées dans la semaine
- Mises à jour trimestrielles (minimum)
- Audits de sécurité proactifs (annuel)

**Expiration :** 24 mois à compter de la date de certification

---

## Calcul du Score de Qualité

Chaque stack reçoit un score de qualité composite (0-100) basé sur :

| Métrique | Poids | Mesure |
|--------|--------|-------------|
| Qualité du Code | 20% | Couverture de test, linting, complétude de la documentation |
| Adoption par les Utilisateurs | 20% | Nombre d'installations, utilisateurs actifs hebdomadaires, vélocité de tendance |
| Satisfaction des Utilisateurs | 20% | Note moyenne, sentiment des avis, taux de résolution des problèmes |
| Maintenance | 20% | Jours depuis la dernière mise à jour, fraîcheur des dépendances, délai de réponse aux problèmes |
| Documentation | 20% | Complétude, clarté, qualité des exemples, précision |

**Interprétation du Score :**
- 80-100 : Candidat niveau Or
- 60-79 : Candidat niveau Argent
- 40-59 : Candidat niveau Bronze
- Inférieur à 40 : Non admissible à la certification

---

## Recertification

Toutes les stacks certifiées subissent une recertification annuelle :

**Stacks Bronze :**
- Doit maintenir le nombre minimum d'installations (10)
- La note moyenne reste au-dessus de 3.5
- Aucun problème critique non résolu
- L'auteur confirme l'intention de maintenir

**Stacks Argent :**
- Doit maintenir le nombre minimum d'installations (50)
- La note moyenne reste au-dessus de 4.0
- Les mises à jour trimestrielles sont requises
- Le SLA de réponse aux problèmes est maintenu

**Stacks Or :**
- Doit maintenir le nombre minimum d'installations (200)
- La note moyenne reste au-dessus de 4.5
- Les mises à jour mensuelles sont requises
- Le SLA de réponse aux problèmes est maintenu
- L'approbation du responsable est renouvelée

Si une stack ne passe pas la recertification, elle est rétrogradée d'un niveau. Si elle échoue au niveau Bronze, la certification est révoquée.

---

## Décertification

La certification est immédiatement révoquée si :

1. **Violation du code de conduite :** Contenu interdit découvert dans la stack ou conduite de l'auteur
2. **Problème de sécurité critique :** Vulnérabilité non corrigée affectant les systèmes des utilisateurs
3. **Violation de licence :** Utilisation de licences incompatibles ou non divulguées
4. **Abandonné :** Pas de réponse de l'auteur pendant 3 mois après l'examen de recertification
5. **Maintenance hostile :** L'auteur empêche activement les améliorations ou ignore les problèmes critiques

Les stacks révoquées sont retirées des index certifiés mais restent dans le marketplace (si pas de violations). Les auteurs peuvent demander une recertification après 6 mois.

---

## Processus de Certification

Consultez [becoming-certified.md](../guides/marketplace/becoming-certified.md) pour le flux de travail de certification étape par étape.

Consultez [certification-criteria.md](../guides/marketplace/certification-criteria.md) pour les rubriques de qualité détaillées et les méthodologies de mesure.

---

**Dernière mise à jour :** 15 juin 2026
