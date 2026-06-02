# 📂 Data Engineering Workspace

> The canonical workspace for a Data Engineer, designed to build idempotent pipelines, orchestrate complex Directed Acyclic Graphs (DAGs), and enforce strict data quality checks at scale.

📄 `pipeline-architecture-brief.md` # Canonical brief: Defines the target data warehouse (Snowflake/BigQuery), latency SLAs (batch vs. streaming), and naming conventions
🧠 `active-backfills.md`            # Session memory: Dynamic context tracking for currently running historical data backfills and broken DAG recovery
🤖 `CLAUDE.md`                      # Operating rules: Strict instructions to enforce idempotency—ensuring a pipeline can run multiple times without duplicating data

## 📁 ingestion-and-extract/ (4 skills - Moving Data)
📄 `api-paginator.md`               # Scripts to reliably extract data from paginated third-party REST APIs with exponential backoff
📄 `cdc-configurator.md`            # Change Data Capture (Debezium/Kafka) setups to stream row-level database changes in real-time
📄 `batch-job-scheduler.md`         # Logic for nightly cron jobs scraping massive CSVs from SFTP servers or S3 buckets
📄 `local-ingest-sandbox.md`        # Configurations for running heavy extraction test runs locally on a dedicated Mac mini before pushing to the cloud

## 📁 transformation-dbt/ (4 skills - Modeling)
📄 `dbt-model-generator.md`         # Scaffolds staging, intermediate, and mart layer SQL models following Kimball methodology
📄 `incremental-load-logic.md`      # Complex Jinja macros to only process new records, drastically cutting compute costs
📄 `dag-optimizer.md`               # Analyzes the dependency graph to identify bottlenecks and parallelize independent transformations
📄 `slow-query-refactor.md`         # Automated suggestions to replace heavy `JOIN`s or window functions with more efficient clustered keys

## 📁 orchestration-airflow/ (3 skills - Scheduling)
📄 `dag-scaffolder.md`              # Generates Apache Airflow DAGs (or Prefect/Dagster flows) with standardized retry logic
📄 `sensor-and-hook-config.md`      # Waits for upstream events (e.g., "S3 file landed") before triggering downstream processing
📄 `sla-miss-alerter.md`            # PagerDuty routing logic for when a critical dashboard pipeline misses its 8:00 AM delivery window

## 📁 data-quality-and-ops/ (3 skills - Trust)
📄 `great-expectations-suite.md`    # Generates rigorous tests asserting column uniqueness, non-null constraints, and expected data types
📄 `dead-letter-queue-handler.md`   # Safely routes malformed JSON payloads to a quarantine zone for inspection rather than crashing the pipeline
📄 `anomaly-detector.md`            # Statistical checks to flag if today's revenue sum is wildly out of bounds compared to the 30-day moving average

## 📁 infrastructure-and-sync/ (3 skills - Deployment)
📄 `warehouse-sizer.md`             # Terraform logic for dynamically scaling up Snowflake compute warehouses during heavy ELT hours and suspending them afterward
📄 `role-based-access.md`           # Scripts to provision masked views, ensuring PII (like emails) is hidden from standard analyst roles
📄 `github-final-sync.md`           # Automated CI/CD action to test pipeline changes in staging and sync approved code to Github final repos

---
**Configuration Files**
⚙️ `dbt_project.yml`                # Defines model materializations (table vs. view) and tag groupings
📦 `airflow.cfg`                    # Core scheduler configurations and worker concurrency limits

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
