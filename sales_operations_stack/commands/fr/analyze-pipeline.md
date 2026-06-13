# /analyze-pipeline

**Déclenchement :** Exécution hebdomadaire (tous les lundis) avant la synchronisation avec le leadership, ou à la demande pour une visibilité sur le pipeline.

**Objectif :** Générer un aperçu en temps réel de la santé du pipeline : nombre d'affaires par étape, âge moyen par étape, santé de la prévision, taux de conversion par étape et identification des affaires à risque.

**Ce qu'il fait :**
1. Récupère l'export CRM actuel (Salesforce, HubSpot ou Pipedrive)
2. Valide la fraîcheur des données (avertit si >24 heures d'ancienneté)
3. Segmente les affaires par étape, tier (Enterprise/Mid/Commercial) et représentant
4. Calcule les métriques clés : valeur du pipeline, vieillissement des étapes, taux de conversion, précision de la prévision
5. Identifie les affaires à risque (>30 jours à l'étape, <50% de probabilité)
6. Génère un tableau de bord résumé : risques principaux, rythme de quota, actions recommandées
7. Enregistre le rapport dans `reports/pipeline-snapshot-{YYYY-MM-DD}.md`
8. Enregistre un résumé dans `session-log.md`

**Entrées :** Connexion CRM (nécessite les identifiants API ou un fichier d'export)

**Sortie :** `reports/pipeline-snapshot-{date}.md` — Rapport de santé complet avec métriques, affaires à risque, tendances de conversion et actions

**Propriétaire :** Responsable Sales Ops | **Fréquence :** Hebdomadaire + à la demande

**Exemple :**

```bash
/analyze-pipeline