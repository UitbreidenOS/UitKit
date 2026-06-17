# Optimisation SQL

## Quand activer

L'utilisateur signale des requêtes lentes ou demande des conseils d'optimisation de requêtes.

## Quand NE PAS utiliser

Ne pas optimiser prématurément sans profiler la performance de base.

## Instructions

1. Analyser le plan d'exécution de la requête
2. Identifier les index manquants ou les scans complets
3. Examiner l'ordre des jointures et les estimations de cardinalité
4. Recommander des modèles de réécriture

## Exemple

**Scénario :** Une requête d'agrégation s'exécute en 45 secondes sur une table de 500M de lignes.

```sql
-- Avant (full table scan)
SELECT customer_id, COUNT(*) as order_count
FROM orders
WHERE DATE(created_at) = CURRENT_DATE()
GROUP BY customer_id;

-- Après (index sur partition de date)
SELECT customer_id, COUNT(*) as order_count
FROM orders
WHERE created_at >= CURRENT_DATE() 
  AND created_at < CURRENT_DATE() + INTERVAL 1 DAY
GROUP BY customer_id;
```

**Gains :** Temps réduit de 45s à 2s via partition pruning et index sur created_at.
