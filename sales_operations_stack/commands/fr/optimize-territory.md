# /optimize-territory

**Déclencheur:** Exécuter mensuellement, après de nouvelles embauches ou après des changements de quota. À la demande lorsqu'un déséquilibre territorial est soupçonné d'être injuste.

**Objectif:** Exécuter une analyse d'équilibre territorial : assignations de comptes, score d'équité des quotas, détection des chevauchements, plan de capacité des effectifs et recommandations de réalignement.

**Ce qu'il fait:**
1. Charge la liste maître des comptes : nom, rep assigné, territoire, potentiel de revenus (ARR)
2. Calcule les métriques d'équité : variance des quotas, variance du potentiel territorial, variance du nombre de comptes
3. Identifie les chevauchements : comptes assignés à plusieurs reps
4. Identifie les lacunes : comptes non assignés, zones géographiques mal desservies, déséquilibres de niveaux
5. Analyse le risque de concentration : % du revenu territorial dans les 5 premiers comptes
6. Attribue à chaque territoire un score de 0–100 sur la dimension d'équilibre
7. Génère des recommandations de rééquilibrage avec des prévisions d'impact
8. Sauvegarde le rapport dans `reports/territory-analysis-{YYYY-MM-DD}.md`

**Entrées:** Liste des comptes avec assignations de reps, quotas et potentiel de revenus

**Sortie:** `reports/territory-analysis-{date}.md` — Fiche d'équité, lacunes/chevauchements, plan de réalignement avec calendrier de déploiement

**Propriétaire:** VP Ventes + Sales Ops | **Fréquence:** Mensuelle après embauche + à la demande

**Exemple:**

```bash
/optimize-territory