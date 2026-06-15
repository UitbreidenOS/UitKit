# Obtenir la Certification de Votre Stack

Ce guide vous guide à travers le processus étape par étape de la certification de votre stack sur le Marketplace Claudient.

## Prérequis

Avant de demander la certification, assurez-vous que votre stack :

1. **Est déjà publiée** sur le Marketplace Claudient avec des retours positifs
2. **Respecte les critères de base** (voir VETTING.md)
3. **Dispose d'un référentiel GitHub** (public, actif, maintenu)
4. **Respecte les exigences minimales** pour votre niveau cible :
   - Bronze : 10+ installations, note 3.5+
   - Argent : 50+ installations, note 4.0+, 6+ mois de développement actif
   - Or : 200+ installations, note 4.5+, approbation du responsable officiel

---

## Étape 1 : Évaluer Votre Stack

Utilisez la rubrique de qualité dans [certification-criteria.md](./certification-criteria.md) pour évaluer la préparation de votre stack.

### Liste de Contrôle

**Qualité du Code**
- [ ] Couverture de test 50%+ (acceptable) ou 70%+ (argent) ou 90%+ (or)
- [ ] Linting réussit ; pas de problèmes critiques
- [ ] Dépendances mises à jour dans les 3 derniers mois
- [ ] Aucune vulnérabilité de sécurité connue

**Adoption**
- [ ] Bronze : 10+ installations
- [ ] Argent : 50+ installations sur 90 jours
- [ ] Or : 200+ installations sur 180 jours

**Satisfaction**
- [ ] Bronze : note 3.5+ (5+ avis)
- [ ] Argent : note 4.0+ (10+ avis)
- [ ] Or : note 4.5+ (20+ avis)

**Maintenance**
- [ ] Mise à jour dans les 6 derniers mois (bronze), 3 mois (argent), 1 mois (or)
- [ ] Délai moyen de réponse aux problèmes acceptable
- [ ] Aucun problème critique en cours

**Documentation**
- [ ] README complet et clair
- [ ] Au moins 1 exemple (bronze), 2+ (argent), 3+ (or)
- [ ] CLAUDE.md présent et précis
- [ ] Argent/Or : Au moins une langue supplémentaire

---

## Étape 2 : Calculer Votre Score de Qualité

Utilisez la méthodologie dans [certification-criteria.md](./certification-criteria.md) :

```
Quality Score = (0.20 × Code Quality) + (0.20 × Adoption) + (0.20 × Satisfaction) + (0.20 × Maintenance) + (0.20 × Documentation)
```

Enregistrez les scores pour chaque dimension :

| Dimension | Score (0-100) |
|-----------|---------------|
| Qualité du Code | ___ |
| Adoption | ___ |
| Satisfaction | ___ |
| Maintenance | ___ |
| Documentation | ___ |
| **Score Composite** | **___** |

**Admissibilité au Niveau :**
- 80-100 → Candidat Or
- 60-79 → Candidat Argent
- 40-59 → Candidat Bronze

---

## Étape 3 : Préparer les Matériels de Certification

Créez un document contenant :

### A. Résumé de la Stack
- Nom et ID de la stack
- URL du référentiel GitHub
- Nombre d'installations (avec source : npm, GitHub ou suivi du marketplace)
- Note moyenne actuelle et nombre d'avis
- Liste des fonctionnalités/compétences clés

### B. Preuves de Qualité
- Liens vers 2+ avis ou témoignages communautaires
- Journal d'activité GitHub (6 derniers mois)
- Liste des problèmes résolus (avec délais de réponse)
- Rapport de couverture de test (si disponible)

### C. Engagement de Maintenance
- Nom(s) de l'auteur
- Niveau d'engagement : Bronze/Argent/Or
- Heures estimées de maintenance par mois
- Canaux de support (GitHub Issues, Discord, email, etc.)
- Plan de gestion des problèmes critiques

### D. Proposition de Valeur Unique
- Brève explication de ce qui rend cette stack précieuse
- Comment elle diffère des stacks similaires
- Preuve de l'adoption communautaire

### E. Déclaration de Conformité SLA

**Pour Bronze :**
"Je m'engage à répondre à tous les problèmes dans les 2 semaines et à corriger les bugs critiques dans les 2 semaines."

**Pour Argent :**
"Je m'engage à répondre à tous les problèmes dans la semaine et à corriger les bugs critiques dans les 2 semaines. Je maintiendrai une cadence de publication mensuelle ou trimestrielle."

**Pour Or :**
"Je m'engage à répondre à tous les problèmes dans les 48 heures et à corriger les bugs critiques dans les 5 jours ouvrables. Je maintiendrai des versions mensuelles et effectuerai des audits de sécurité annuels."

---

## Étape 4 : Demander un Examen de Certification

Envoyez un email à **marketplace@claudient.dev** avec la ligne d'objet :

```
Certification Request: [Stack Name] - [Tier] Tier
```

Inclure :
1. Tous les matériels de l'Étape 3
2. Votre ventilation du score de qualité calculé
3. Lien vers la liste de cette stack sur le marketplace
4. Tout contexte ou notes supplémentaires

**Calendrier de réponse :** L'équipe principale reconnaîtra le message dans les 3 jours ouvrables et commencera l'examen.

---

## Étape 5 : Répondre aux Retours de l'Équipe Principale

L'équipe principale peut demander :

**Informations Supplémentaires :**
- Clarifications sur les métriques
- Exemples ou documentation supplémentaires
- Rapport d'audit de sécurité ou de dépendances

**Mises à Jour Mineures :**
- Améliorations de la documentation
- Ajouts d'exemples
- Améliorations de la clarté du README

**Approbation Conditionnelle :**
- Respecter les métriques spécifiques avant l'approbation finale
- Corriger les problèmes identifiés et répostuler

**Repostuler Après Améliorations :**
Si refusé, vous pouvez repostuler après :
- Aborder les retours (minimum 2+ semaines)
- Améliorer les domaines faibles
- Augmenter l'adoption (si nécessaire)

---

## Étape 6 : Approbation de Certification

Après approbation :

1. **Listing du marketplace mis à jour** avec un badge de certification
2. **Index des stacks certifiées** mis à jour (marketplace/certified/README.md)
3. **Désignation du niveau publiée :**
   - Bronze : Listé dans les stacks certifiées
   - Argent : Présenté dans la catégorie "Recommandé"
   - Or : Présenté sur la page d'accueil du marketplace

4. **Auteur notifié** avec :
   - Ressource de badge de certification (PNG, SVG)
   - Certificat de certification
   - Modèle de communiqué de presse (optionnel)
   - Ressources de marketing

---

## Étape 7 : Maintenir Votre Certification

### Responsabilités Continues

**Bronze (tous les 6 mois) :**
- Garder la note moyenne au-dessus de 3.5
- Maintenir au moins 10 installations
- Répondre aux problèmes dans les 2 semaines
- Recertifier pour maintenir le badge

**Argent (tous les 12 mois) :**
- Garder la note moyenne au-dessus de 4.0
- Maintenir au moins 50 installations
- Publier des mises à jour trimestrielles
- Répondre aux problèmes dans la semaine
- Recertifier pour maintenir le badge

**Or (tous les 24 mois) :**
- Garder la note moyenne au-dessus de 4.5
- Maintenir au moins 200 installations
- Publier des mises à jour mensuelles
- Répondre aux problèmes dans les 48 heures
- Effectuer un audit de sécurité annuel
- Recertifier pour maintenir le badge

### Processus de Recertification Annuelle

**30 jours avant la date d'expiration :**
- Vous recevrez un avis de recertification
- Vérifiez que les métriques actuelles respectent toujours les exigences de niveau
- Soumettez la confirmation de recertification à marketplace@claudient.dev

**Si les métriques ont baissé :**
- La stack peut être rétrogradée d'un niveau
- Vous avez 60 jours pour améliorer et faire appel
- Si non amélioré, la certification est révoquée

---

## Renouvellement de Certification

Votre badge de certification reste valide jusqu'à la date d'expiration. Le renouvellement à court terme (dans les 60 jours) peut être déclenché par :
- Ajout de fonctionnalités significatives
- Jalon majeur de maintenance
- Demande de mise à niveau de niveau

Le processus de renouvellement est le même que la certification initiale.

---

## Mises à Niveau de Niveau

Pour passer de Bronze à Argent ou d'Argent à Or :

1. Assurez-vous que les nouvelles métriques respectent le niveau cible
2. Envoyez une demande de mise à niveau à marketplace@claudient.dev avec le score de qualité mis à jour
3. L'équipe principale vérifie les métriques (2-3 jours ouvrables)
4. Après approbation, le listing et le badge sont mis à jour

---

## Décertification et Appels

Si votre certification est révoquée :

1. **Notification des Raisons :** Vous recevrez une explication détaillée
2. **Fenêtre d'Appel :** 2 semaines pour fournir un contexte supplémentaire
3. **Examen d'Appel :** Un membre indépendant de l'équipe principale examine la décision
4. **Repostulation :** Disponible après 6 mois d'améliorations

---

## Des Questions?

- **Critères de certification :** Voir [certification-criteria.md](./certification-criteria.md)
- **Détails des niveaux :** Voir [../CERTIFICATION.md](../CERTIFICATION.md)
- **Questions générales :** marketplace@claudient.dev
- **Discussion communautaire :** [GitHub Discussions](https://github.com/claudients/claudient/discussions)

---

**Dernière mise à jour :** 15 juin 2026
