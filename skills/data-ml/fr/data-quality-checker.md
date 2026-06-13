---
name: data-quality-checker
description: "Audit de qualité des données : identifier les valeurs nulles, doublons, valeurs aberrantes, dérive de schéma et incohérences de types — générer un rapport sur la santé des données et le SQL de remédiation"
---

# Compétence : Vérificateur de Qualité des Données

## Quand activer
- Une nouvelle source de données vient d'être ingérée et nécessite un référentiel de qualité
- Des parties prenantes remettent en question une métrique et vous devez écarter la qualité des données comme cause
- Exécuter un audit mensuel de la santé des données sur vos tables de production
- Avant de publier un tableau de bord ou un rapport — vérifier d'abord les données sous-jacentes
- Après un changement de schéma ou une migration de pipeline pour détecter les régressions
- Investiguer un pic ou une chute soudaine d'une métrique qui pourrait être un problème de qualité, pas un vrai signal

## Quand NE PAS utiliser
- Audits formels avec des implications légales ou de conformité — faire appel à un auditeur de données
- Surveillance de la qualité des données en temps réel — configurer Great Expectations, des tests dbt, ou Soda pour une surveillance continue
- Échantillonnage statistique approfondi sur des milliards de lignes — adapter le périmètre de l'audit

## Instructions

### Audit complet de la qualité d'une table

```python
# Coller ce modèle Python et remplir avec votre table/DataFrame

import pandas as pd
import numpy as np

def audit_dataframe(df: pd.DataFrame, table_name: str, primary_key: str = None) -> dict:
    """
    Audit complet de la qualité des données. Retourne un dict de rapport.
    Remplacer df par : pd.read_csv('votre_fichier.csv') ou le résultat de votre requête de base de données.
    """
    report = {
        "table": table_name,
        "rows": len(df),
        "columns": len(df.columns),
        "issues": []
    }

    # 1. ANALYSE DES VALEURS NULLES
    null_counts = df.isnull().sum()
    null_pct = (null_counts / len(df) * 100).round(2)
    for col in df.columns:
        if null_counts[col] > 0:
            severity = "CRITICAL" if null_pct[col] > 10 else "WARNING" if null_pct[col] > 1 else "INFO"
            report["issues"].append({
                "type": "NULL",
                "column": col,
                "count": int(null_counts[col]),
                "pct": float(null_pct[col]),
                "severity": severity
            })

    # 2. ANALYSE DES DOUBLONS
    if primary_key:
        dup_count = df.duplicated(subset=[primary_key]).sum()
        if dup_count > 0:
            report["issues"].append({
                "type": "DUPLICATE_PK",
                "column": primary_key,
                "count": int(dup_count),
                "severity": "CRITICAL"
            })

    full_dups = df.duplicated().sum()
    if full_dups > 0:
        report["issues"].append({
            "type": "DUPLICATE_ROWS",
            "count": int(full_dups),
            "severity": "WARNING"
        })

    # 3. DÉTECTION DES VALEURS ABERRANTES (colonnes numériques)
    for col in df.select_dtypes(include=[np.number]).columns:
        q1, q3 = df[col].quantile([0.25, 0.75])
        iqr = q3 - q1
        lower_fence = q1 - 3 * iqr
        upper_fence = q3 + 3 * iqr
        outliers = df[(df[col] < lower_fence) | (df[col] > upper_fence)]
        if len(outliers) > 0:
            report["issues"].append({
                "type": "OUTLIER",
                "column": col,
                "count": len(outliers),
                "min": float(df[col].min()),
                "max": float(df[col].max()),
                "p25": float(q1),
                "p75": float(q3),
                "upper_fence": float(upper_fence),
                "lower_fence": float(lower_fence),
                "severity": "WARNING"
            })

    # 4. VÉRIFICATION DE LA CARDINALITÉ (colonnes catégorielles)
    for col in df.select_dtypes(include=['object']).columns:
        unique_count = df[col].nunique()
        total = len(df)
        if unique_count == total and total > 100:
            report["issues"].append({
                "type": "HIGH_CARDINALITY",
                "column": col,
                "unique_count": unique_count,
                "note": "All values unique — may be a free-text field or ID column, not a category",
                "severity": "INFO"
            })
        if unique_count == 1:
            report["issues"].append({
                "type": "SINGLE_VALUE",
                "column": col,
                "value": df[col].iloc[0],
                "severity": "WARNING"
            })

    # 5. VALIDATION DE LA PLAGE DE DATES
    for col in df.select_dtypes(include=['datetime64']).columns:
        min_date = df[col].min()
        max_date = df[col].max()
        future_dates = (df[col] > pd.Timestamp.now()).sum()
        if future_dates > 0:
            report["issues"].append({
                "type": "FUTURE_DATE",
                "column": col,
                "count": int(future_dates),
                "severity": "WARNING"
            })

    return report
```

---

### Requêtes SQL d'audit de qualité

À utiliser dans votre entrepôt de données (PostgreSQL, BigQuery, Snowflake, Redshift) :

```sql
-- 1. TAUX DE VALEURS NULLES PAR COLONNE
-- Exécuter pour chaque colonne à vérifier
SELECT
    COUNT(*) AS total_rows,
    COUNT(column_name) AS non_null_count,
    COUNT(*) - COUNT(column_name) AS null_count,
    ROUND(100.0 * (COUNT(*) - COUNT(column_name)) / COUNT(*), 2) AS null_pct
FROM your_table;

-- 2. VÉRIFICATION DES DOUBLONS SUR LA CLÉ PRIMAIRE
SELECT
    primary_key_column,
    COUNT(*) AS occurrence_count
FROM your_table
GROUP BY primary_key_column
HAVING COUNT(*) > 1
ORDER BY occurrence_count DESC;

-- 3. VÉRIFICATION DES LIGNES ENTIÈREMENT DUPLIQUÉES
SELECT *, COUNT(*) AS occurrences
FROM your_table
GROUP BY ALL
HAVING COUNT(*) > 1;

-- 4. DÉTECTION DES VALEURS ABERRANTES (méthode z-score)
WITH stats AS (
    SELECT
        AVG(numeric_column) AS mean_val,
        STDDEV(numeric_column) AS std_val
    FROM your_table
)
SELECT
    id,
    numeric_column,
    ABS(numeric_column - stats.mean_val) / NULLIF(stats.std_val, 0) AS z_score
FROM your_table, stats
WHERE ABS(numeric_column - stats.mean_val) / NULLIF(stats.std_val, 0) > 3
ORDER BY z_score DESC;

-- 5. VÉRIFICATION DE L'INTÉGRITÉ RÉFÉRENTIELLE
-- Trouver les clés étrangères orphelines
SELECT t1.foreign_key_col
FROM child_table t1
LEFT JOIN parent_table t2 ON t1.foreign_key_col = t2.id
WHERE t2.id IS NULL;

-- 6. VÉRIFICATION DE COHÉRENCE DE LA PLAGE DE DATES
SELECT
    MIN(created_at) AS earliest_record,
    MAX(created_at) AS latest_record,
    COUNT(*) FILTER (WHERE created_at > CURRENT_TIMESTAMP) AS future_dates,
    COUNT(*) FILTER (WHERE created_at < '2000-01-01') AS suspiciously_old
FROM your_table;

-- 7. COHÉRENCE DES VALEURS ÉNUMÉRÉES/CATÉGORIELLES
-- Voir toutes les valeurs distinctes et les comptes — signaler les valeurs inattendues
SELECT
    status_column,
    COUNT(*) AS count,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) AS pct
FROM your_table
GROUP BY 1
ORDER BY 2 DESC;

-- 8. VÉRIFICATION DE PLAGE DE VALEURS
-- Signaler les valeurs hors de la plage attendue pour le métier
SELECT
    COUNT(*) FILTER (WHERE price < 0) AS negative_prices,
    COUNT(*) FILTER (WHERE price > 1000000) AS suspiciously_high,
    COUNT(*) FILTER (WHERE quantity = 0) AS zero_quantity,
    MIN(price) AS min_price,
    MAX(price) AS max_price
FROM orders;
```

---

### Détection de dérive de schéma

```python
# Comparer deux snapshots du schéma d'une table pour détecter la dérive
import json

def detect_schema_drift(schema_before: dict, schema_after: dict) -> list:
    """
    format du schéma : {"nom_colonne": "type_de_données"}
    Exemple : {"user_id": "int64", "email": "object", "created_at": "datetime64"}
    """
    issues = []

    cols_before = set(schema_before.keys())
    cols_after = set(schema_after.keys())

    # Nouvelles colonnes ajoutées
    for col in cols_after - cols_before:
        issues.append({"type": "COLUMN_ADDED", "column": col, "new_type": schema_after[col]})

    # Colonnes supprimées
    for col in cols_before - cols_after:
        issues.append({"type": "COLUMN_REMOVED", "column": col, "old_type": schema_before[col], "severity": "CRITICAL"})

    # Changements de type
    for col in cols_before & cols_after:
        if schema_before[col] != schema_after[col]:
            issues.append({
                "type": "TYPE_CHANGED",
                "column": col,
                "old_type": schema_before[col],
                "new_type": schema_after[col],
                "severity": "CRITICAL" if "int" in schema_before[col] and "object" in schema_after[col] else "WARNING"
            })

    return issues
```

---

### Invite pour le rapport de santé des données

```
Générer un rapport de santé des données basé sur les résultats de cet audit.

RÉSULTATS DE L'AUDIT :
[Coller la sortie de l'audit Python ou des vérifications SQL ci-dessus]

TABLE : [nom]
LIGNES : [N]
COLONNES : [N]
DATE DE L'AUDIT : [date]

Générer un rapport de santé des données avec :

## Résumé exécutif
Score de santé global : [calculer en % de colonnes sans problèmes, pondéré par gravité]
Statut : [Vert / Jaune / Rouge]
Problèmes critiques nécessitant une action immédiate : [N]

## Tableau récapitulatif des problèmes
| Type de problème | Colonne | Nombre | % des lignes | Gravité | Action recommandée |
|---|---|---|---|---|---|

## Problèmes critiques (à résoudre avant d'utiliser les données dans des rapports)
[Pour chaque problème CRITIQUE : ce que c'est, pourquoi c'est important, comment le corriger]

## Avertissements (à résoudre dans les 30 jours)
[Pour chaque AVERTISSEMENT : ce que c'est, le risque métier si non résolu, la correction recommandée]

## SQL de remédiation
[Pour chaque problème, fournir une requête SQL pour investiguer davantage et/ou une requête de correction]

## Recommandations de surveillance
[Lister 3-5 tests dbt ou vérifications de qualité des données à ajouter pour prévenir la récurrence]
```

---

### Recommandations de tests dbt

```
En se basant sur cet audit de qualité des données, générer des définitions de tests dbt en YAML pour détecter ces problèmes automatiquement.

TABLE : [nom]
CLÉ PRIMAIRE : [colonne]
PROBLÈMES IDENTIFIÉS :
- [lister les problèmes de l'audit]

Générer le bloc `schema.yml` avec les tests :

```yaml
version: 2

models:
  - name: [table_name]
    description: "[table description]"
    columns:
      - name: [primary_key]
        tests:
          - unique
          - not_null
      - name: [column_with_nulls]
        tests:
          - not_null:
              severity: warn
              config:
                where: "created_at > '2024-01-01'"  # if applicable
      - name: [categorical_column]
        tests:
          - accepted_values:
              values: ['value1', 'value2', 'value3']
      - name: [foreign_key_col]
        tests:
          - relationships:
              to: ref('parent_table')
              field: id
```
```

---

### Vérifications rapides de qualité (triage rapide)

```python
import pandas as pd

df = pd.read_csv('your_file.csv')  # ou le résultat de votre requête

# Profil rapide
print(df.describe(include='all'))          # Statistiques récapitulatives toutes colonnes
print(df.isnull().sum().sort_values(ascending=False))  # Comptes de valeurs nulles classés
print(df.duplicated().sum())               # Nombre de lignes dupliquées
print(df.dtypes)                           # Types de données — vérifier les objets qui devraient être numériques
print(df.nunique().sort_values())          # Cardinalité — faible = probablement catégoriel, élevée = ID/texte libre
```

## Exemple

**Utilisateur :** Je viens d'ingérer un CSV de 50 000 commandes de notre système e-commerce. Les noms de colonnes sont : order_id, user_id, product_id, quantity, price, created_at, status, shipping_address. Les chiffres de revenus semblent plus élevés que prévu cette semaine. Aidez-moi à auditer les données.

**Résultat attendu :** Script d'audit Python rempli pour cette table. Requêtes SQL pour : vérification des doublons sur order_id (clé primaire), vérification des valeurs aberrantes de prix (prix négatifs, prix > 10 K$), vérification des quantités (zéro ou négatif), dates futures dans created_at, valeurs distinctes de la colonne status (signaler les valeurs inattendues), intégrité référentielle sur user_id par rapport à une table users. Après exécution : modèle de rapport de santé des données. Trois tests dbt à ajouter : unique/not_null sur order_id, accepted_values sur status, relationships sur user_id. Commentaire : si des valeurs aberrantes de prix sont trouvées, cela expliquerait les revenus élevés — investiguer si le pic est réel ou un problème de qualité des données.

---
