# Débogage ETL

## Quand l'activer

Le pipeline échoue, la perte de données se produit, ou les enregistrements sont manquants ou en double de manière inattendue.

## Quand ne pas l'utiliser

Pas pour l'examen de la conception ; seulement pour les erreurs post-exécution.

## Instructions

1. Isoler l'étape d'échec
2. Vérifier les journaux et les métriques
3. Vérifier les données d'entrée et le schéma
4. Tracer les transformations de bout en bout

## Exemple

**Scénario :** Un job dbt échoue; 50K lignes attendues mais seules 45K sont chargées.

**Processus de débogage :**

1. **Isoler l'étape :** Vérifier les logs dbt
   ```
   dbt run --select model_name --debug
   ```

2. **Vérifier les données sources :**
   ```sql
   SELECT COUNT(*) FROM raw.source_table WHERE load_date = '2024-06-14';
   -- Résultat : 49K (pas 50K attendus)
   ```

3. **Tracer les transformations :**
   ```sql
   -- Vérifier où les 4K lignes sont perdues
   SELECT COUNT(*) FROM intermediate_stage_1;  -- 49K
   SELECT COUNT(*) FROM intermediate_stage_2;  -- 48K (perte ici)
   -- Issue trouvée : JOIN sur clé manquante
   ```

4. **Solution :** Ajouter LEFT JOIN et valider la reconstruction avant reprise.
