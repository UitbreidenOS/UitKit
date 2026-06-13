# /build-forecast

**Déclenchement :** Exécuter chaque semaine avant la réunion de direction, ou mensuellement pour les mises à jour du conseil. Toujours exécuter 2+ semaines avant la fin du trimestre.

**Objectif :** Générer une prévision roulante de 13 mois avec 3 scénarios (meilleur cas, engagement, potentiel). Afficher les tendances et l'écart par rapport au plan.

**Ce qu'il fait :**
1. Récupère un instantané du pipeline actuel (tous les accords ouverts avec probabilité de fermeture et valeur attendue)
2. Applique trois seuils de probabilité :
   - **Engagement (60%) :** Accords >50% de probabilité uniquement → Estimation conservatrice
   - **Meilleur cas (90%) :** Accords >30% de probabilité → Potentiel probable
   - **Potentiel :** Accords >10% de probabilité → Scénario ambitieux
3. Segmente par mois (13 prochains mois) et représentant
4. Calcule l'écart par rapport aux cibles mensuelles
5. Compare la prévision actuelle par rapport à la semaine/mois précédent (tendance de vélocité)
6. Compare la précision de la prévision : prévision du mois précédent vs. fermeture réelle
7. Identifie les écarts de confiance : % de prévision <50% de probabilité, risque de concentration
8. Génère un résumé de 13 mois + décomposition par représentant + analyse de variance
9. Enregistre dans `reports/forecast-{YYYY-MM-DD}.md`
10. Enregistre dans `session-log.md`

**Entrées :** Pipeline CRM actuel avec estimations de probabilité d'accord

**Sortie :** `reports/forecast-{date}.md` — Prévision roulante de 13 mois (les 3 scénarios), décompositions mensuelles, tendances de variance, évaluation des risques

**Propriétaire :** Chef Finance + Direction Ventes | **Fréquence :** Hebdomadaire + préparation mensuelle du conseil

**Exemple :**

```bash
/build-forecast