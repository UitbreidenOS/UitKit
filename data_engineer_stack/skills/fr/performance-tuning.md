# Optimisation des Performances

## Quand l'activer

Réduire la surcharge CPU, mémoire, disque I/O ou réseau dans les jobs de données.

## Quand NE PAS l'utiliser

Non pour les problèmes de correction algorithmique ; concentrez-vous sur l'efficacité des ressources.

## Instructions

1. Profiler l'utilisation des ressources
2. Identifier les goulots d'étranglement (calcul, I/O, réseau)
3. Recommander la parallélisation ou le regroupement par lots
4. Valider les améliorations

## Exemple

**Scénario :** Un Spark job traite 100 GB de logs; utilise 64 GB RAM mais finish en 25 minutes.

**Profiling :**

1. **Identifier les goulots :**
   ```
   - CPU : 45% utilisé
   - I/O disque : 80% saturé (lectures répétées)
   - Mémoire : 55 GB / 64 GB (presque à limite)
   ```

2. **Recommandations appliquées :**
   - Ajouter cache() après le premier scan
   - Augmenter partitions : 256 → 512
   - Optimiser les shuffles via broadcast join pour petites dimensions
   ```python
   from pyspark.sql import functions as F
   df_large.cache()
   df_dim = broadcast(df_dimension)
   result = df_large.join(df_dim, 'key')
   ```

3. **Résultat :** Temps réduit de 25m à 8m; I/O disque réduit de 80% à 35%.
