---
name: spark
description: "Apache Spark DataFrames, Spark SQL, PySpark transformations, partitioning, UDFs, Structured Streaming, Delta Lake"
updated: 2026-06-13
---

# Apache Spark Skill

## When to activate
- Processing datasets too large to fit in memory (PySpark DataFrames)
- Writing Spark SQL transformations on a Databricks or EMR cluster
- Building Structured Streaming pipelines from Kafka or S3
- Optimizing Spark jobs: partitioning, caching, broadcast joins, skew handling
- Working with Delta Lake (ACID transactions, time travel, schema evolution)
- Migrating Pandas code to PySpark for scale

## When NOT to use
- Datasets under ~1GB — pandas or polars is faster with no cluster overhead
- Real-time sub-second latency — use Flink or Kafka Streams
- Simple batch SQL on a warehouse — use dbt + Snowflake/BigQuery directly
- Single-machine ML training — use sklearn/PyTorch directly

## Instructions

### SparkSession setup
```python
from pyspark.sql import SparkSession

# Local development
spark = SparkSession.builder \
    .appName("MyJob") \
    .master("local[*]") \
    .config("spark.sql.adaptive.enabled", "true") \
    .config("spark.sql.adaptive.coalescePartitions.enabled", "true") \
    .getOrCreate()

# Databricks — SparkSession is pre-configured, just use `spark`
# EMR — set master in spark-submit, not in code
```

### DataFrame fundamentals
```python
from pyspark.sql import functions as F
from pyspark.sql.types import StructType, StructField, StringType, IntegerType, TimestampType

# Read
df = spark.read.parquet("s3://bucket/path/")
df = spark.read.option("header", True).option("inferSchema", True).csv("s3://bucket/data.csv")

# Always define schema explicitly in production — inferSchema is expensive
schema = StructType([
    StructField("user_id", StringType(), nullable=False),
    StructField("event_type", StringType(), nullable=True),
    StructField("created_at", TimestampType(), nullable=False),
    StructField("amount", IntegerType(), nullable=True),
])
df = spark.read.schema(schema).parquet("s3://bucket/events/")

# Core transformations
result = df \
    .filter(F.col("event_type") == "purchase") \
    .withColumn("date", F.to_date("created_at")) \
    .withColumn("amount_usd", F.col("amount") / 100) \
    .groupBy("user_id", "date") \
    .agg(
        F.sum("amount_usd").alias("daily_spend"),
        F.count("*").alias("purchase_count"),
    ) \
    .orderBy("user_id", "date")

# Write
result.write.mode("overwrite").partitionBy("date").parquet("s3://bucket/output/")
```

### Spark SQL
```python
# Register temp view
df.createOrReplaceTempView("events")

result = spark.sql("""
    SELECT
        user_id,
        DATE(created_at)    AS date,
        SUM(amount / 100.0) AS daily_spend,
        COUNT(*)            AS purchase_count
    FROM events
    WHERE event_type = 'purchase'
    GROUP BY user_id, DATE(created_at)
    ORDER BY user_id, date
""")

# Catalog tables (Hive Metastore / Unity Catalog)
spark.sql("USE DATABASE analytics")
result = spark.sql("SELECT * FROM analytics.daily_spend WHERE date >= '2026-01-01'")
```

### Performance optimisation
```python
# 1. Adaptive Query Execution (AQE) — enable for most workloads
spark.conf.set("spark.sql.adaptive.enabled", "true")
spark.conf.set("spark.sql.adaptive.skewJoin.enabled", "true")

# 2. Broadcast join — use when one side is small (<200MB)
from pyspark.sql.functions import broadcast
result = large_df.join(broadcast(small_df), "user_id")

# 3. Repartition before writes — match output partition count to cluster size
df.repartition(200, "user_id").write.parquet(...)

# 4. Cache when reusing a DataFrame multiple times
df_filtered = df.filter(F.col("active") == True).cache()
df_filtered.count()  # Materialize cache

# 5. Avoid UDFs — use built-in functions (F.*) whenever possible
# Bad: UDF is slow (Python serialisation)
# from pyspark.sql.functions import udf
# @udf(returnType=StringType())
# def clean(x): return x.strip().lower()

# Good: native function
df.withColumn("cleaned", F.lower(F.trim(F.col("name"))))

# 6. Use Pandas UDF (Arrow) when native functions are insufficient
from pyspark.sql.functions import pandas_udf
import pandas as pd

@pandas_udf("double")
def percentile_udf(v: pd.Series) -> pd.Series:
    return v.rank(pct=True)
```

### Delta Lake
```python
# Write Delta table
df.write.format("delta").mode("overwrite").save("s3://bucket/delta/orders")

# Read Delta table
df = spark.read.format("delta").load("s3://bucket/delta/orders")

# Upsert (MERGE)
from delta.tables import DeltaTable

target = DeltaTable.forPath(spark, "s3://bucket/delta/orders")
target.alias("t").merge(
    source=updates_df.alias("s"),
    condition="t.order_id = s.order_id"
).whenMatchedUpdate(set={
    "status": "s.status",
    "updated_at": "s.updated_at",
}).whenNotMatchedInsertAll().execute()

# Time travel
df_yesterday = spark.read.format("delta") \
    .option("versionAsOf", 5) \
    .load("s3://bucket/delta/orders")

# Optimize + vacuum
target.optimize().executeCompaction()
spark.sql("VACUUM delta.`s3://bucket/delta/orders` RETAIN 168 HOURS")
```

### Structured Streaming
```python
# Read from Kafka
stream_df = spark.readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "kafka:9092") \
    .option("subscribe", "orders") \
    .option("startingOffsets", "latest") \
    .load()

# Parse JSON payload
from pyspark.sql.types import StructType, StructField, StringType, DoubleType
schema = StructType([
    StructField("order_id", StringType()),
    StructField("amount", DoubleType()),
])

events = stream_df \
    .select(F.from_json(F.col("value").cast("string"), schema).alias("data")) \
    .select("data.*")

# Windowed aggregation
result = events \
    .withWatermark("event_time", "10 minutes") \
    .groupBy(F.window("event_time", "5 minutes"), "user_id") \
    .agg(F.sum("amount").alias("total_amount"))

# Write to Delta Lake
query = result.writeStream \
    .format("delta") \
    .outputMode("append") \
    .option("checkpointLocation", "s3://bucket/checkpoints/orders") \
    .start("s3://bucket/delta/order-windows")

query.awaitTermination()
```

### Migrating Pandas to PySpark
```python
# Pandas
df["revenue"] = df["price"] * df["quantity"]
monthly = df.groupby(["month", "product_id"])["revenue"].sum().reset_index()

# PySpark equivalent
df = df.withColumn("revenue", F.col("price") * F.col("quantity"))
monthly = df.groupBy("month", "product_id").agg(F.sum("revenue").alias("revenue"))

# When you NEED pandas (small data, complex logic):
# Convert to pandas only after aggregation reduces the data
result_pd = monthly.toPandas()  # Only when result is small

# Or use mapInPandas for partition-level pandas operations
def process_partition(pdf_iter):
    for pdf in pdf_iter:
        pdf["processed"] = custom_pandas_logic(pdf)
        yield pdf

df.mapInPandas(process_partition, schema=df.schema)
```

## Example

**User:** Process 2 years of e-commerce event logs (~500GB Parquet on S3), compute daily active users and revenue per product category, write results partitioned by date to Delta Lake, and set up a Structured Streaming job for real-time updates from Kafka.

**Expected output:**
- `batch_job.py` — reads Parquet with explicit schema, joins with product catalog (broadcast), computes DAU + revenue, writes Delta partitioned by date
- `streaming_job.py` — Kafka source, 5-minute windowed aggregation, watermark, writes to Delta append mode with checkpoint
- AQE enabled, broadcast join for catalog, `repartition(200, "date")` before write
- Delta merge for idempotent reprocessing

---
