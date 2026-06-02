# Analytics Platform — Project Structure

> For a data engineering and analytics team managing the full lifecycle from raw source ingestion to governed BI delivery, optimizing pipeline reliability, metric consistency, and time-to-insight.

## Stack

- **Ingestion:** Fivetran (managed connectors) or Airbyte 0.50+ (self-hosted, open-source connectors)
- **Data warehouse:** BigQuery (Google Cloud) or Snowflake (Enterprise / Business Critical)
- **Transformations:** dbt Core 1.8+ with dbt-bigquery or dbt-snowflake adapter
- **Documentation + tests:** dbt docs, dbt built-in generic tests + dbt-expectations, dbt-utils
- **Metrics layer:** dbt Semantic Layer (MetricFlow 0.200+) with JDBC/ADBC exposure
- **Data quality:** Soda Core 3.x (checks-as-code) or Great Expectations 0.18+ (GX Cloud)
- **BI / dashboards:** Looker (LookML) or Metabase 0.49+ (open-source)
- **Data observability:** Monte Carlo or Bigeye (SaaS; connects to warehouse + dbt manifest)
- **Orchestration:** dbt Cloud Jobs or Apache Airflow 2.9+ (self-hosted) or Dagster 1.7+
- **Version control:** GitHub (dbt project, dbt profiles template, CI workflows)
- **Infrastructure:** Terraform 1.8+ (BigQuery datasets, Snowflake warehouses, IAM, Fivetran connectors)
- **Alerting:** Slack (webhook-based alerts from Soda, Monte Carlo, dbt Cloud)
- **Secrets:** Google Secret Manager or AWS Secrets Manager; referenced in Terraform + dbt profiles

## Directory tree

```
analytics-platform/                          # Monorepo root — version-controlled in GitHub
├── .claude/
│   ├── CLAUDE.md                            # Repo-level instructions for Claude Code
│   ├── settings.json                        # MCP servers, hooks, permissions
│   └── commands/
│       ├── new-model.md                     # /new-model — scaffold staging/mart dbt model + tests
│       ├── run-quality.md                   # /run-quality — execute Soda checks against a dataset
│       ├── publish-dashboard.md             # /publish-dashboard — Looker LookML or Metabase flow
│       ├── data-incident.md                 # /data-incident — incident triage runbook prompt
│       └── seed-refresh.md                  # /seed-refresh — reload dbt seeds from source CSVs
├── .github/
│   └── workflows/
│       ├── ci.yml                           # dbt compile + test on PR against CI target
│       ├── slim-ci.yml                      # dbt build --select state:modified+ (Slim CI)
│       └── deploy.yml                       # Production dbt run triggered on merge to main
├── terraform/                               # Infrastructure as code
│   ├── environments/
│   │   ├── prod/
│   │   │   ├── main.tf                      # BigQuery / Snowflake prod resources
│   │   │   ├── variables.tf
│   │   │   └── terraform.tfvars.example     # Example var values — real tfvars gitignored
│   │   └── dev/
│   │       ├── main.tf                      # Dev/staging warehouse resources
│   │       └── variables.tf
│   ├── modules/
│   │   ├── bigquery/
│   │   │   ├── datasets.tf                  # Raw, staging, marts, metrics datasets + IAM
│   │   │   └── service_accounts.tf          # dbt runner, Fivetran, Looker service accounts
│   │   ├── snowflake/
│   │   │   ├── warehouses.tf                # Virtual warehouses by workload (ETL, BI, ad-hoc)
│   │   │   ├── databases.tf                 # RAW, DEV, PROD databases + roles
│   │   │   └── grants.tf                    # Role-based grants: transformer, reporter, loader
│   │   ├── fivetran/
│   │   │   └── connectors.tf                # Fivetran connector resources (provider: fivetran/fivetran)
│   │   └── iam/
│   │       └── roles.tf                     # Principle of least privilege IAM bindings
│   └── README.md                            # Terraform usage + state backend setup
├── dbt/                                     # dbt Core project root
│   ├── dbt_project.yml                      # Project name, version, model paths, var defaults
│   ├── profiles.yml.template                # Profile template — real profiles.yml gitignored
│   ├── packages.yml                         # dbt-utils, dbt-expectations, dbt-date, codegen
│   ├── selectors.yml                        # Named selectors: nightly, finance, marketing
│   ├── seeds/
│   │   ├── country_codes.csv                # Static reference: ISO country codes
│   │   ├── currency_rates.csv               # Monthly FX rates for financial normalization
│   │   └── product_taxonomy.csv             # Internal product/SKU taxonomy mapping
│   ├── macros/
│   │   ├── generate_schema_name.sql         # Custom schema routing by environment + target
│   │   ├── cents_to_dollars.sql             # Monetary unit conversion macro
│   │   ├── surrogate_key.sql                # Wraps dbt_utils.generate_surrogate_key
│   │   ├── not_null_proportion.sql          # Custom test: assert column null rate < threshold
│   │   └── freshness_check.sql              # Macro to assert max row age in hours
│   ├── models/
│   │   ├── staging/                         # 1:1 with source tables — light cleaning only
│   │   │   ├── stripe/
│   │   │   │   ├── _stripe__sources.yml     # Source definitions + freshness thresholds
│   │   │   │   ├── _stripe__models.yml      # Column-level docs + generic tests for all staging models
│   │   │   │   ├── stg_stripe__customers.sql
│   │   │   │   ├── stg_stripe__subscriptions.sql
│   │   │   │   ├── stg_stripe__invoices.sql
│   │   │   │   └── stg_stripe__events.sql
│   │   │   ├── salesforce/
│   │   │   │   ├── _salesforce__sources.yml
│   │   │   │   ├── _salesforce__models.yml
│   │   │   │   ├── stg_salesforce__accounts.sql
│   │   │   │   ├── stg_salesforce__opportunities.sql
│   │   │   │   └── stg_salesforce__contacts.sql
│   │   │   ├── hubspot/
│   │   │   │   ├── _hubspot__sources.yml
│   │   │   │   ├── _hubspot__models.yml
│   │   │   │   ├── stg_hubspot__contacts.sql
│   │   │   │   └── stg_hubspot__deals.sql
│   │   │   └── app_db/                      # Production database replica (via Fivetran/Airbyte)
│   │   │       ├── _app_db__sources.yml
│   │   │       ├── _app_db__models.yml
│   │   │       ├── stg_app_db__users.sql
│   │   │       ├── stg_app_db__events.sql
│   │   │       └── stg_app_db__orders.sql
│   │   ├── intermediate/                    # Business logic joins — not exposed to BI directly
│   │   │   ├── int_customer_subscriptions.sql   # Joined customer + subscription history
│   │   │   ├── int_revenue_recognized.sql        # ASC 606 revenue schedule calculation
│   │   │   └── int_user_sessions.sql             # Sessionized event stream
│   │   └── marts/                           # Final analytics-ready models exposed to BI
│   │       ├── core/
│   │       │   ├── _core__models.yml        # Docs + tests for all core mart models
│   │       │   ├── dim_customers.sql        # Customer dimension with attributes + segments
│   │       │   ├── dim_products.sql         # Product hierarchy from taxonomy seed
│   │       │   ├── fct_orders.sql           # Order fact with all foreign keys + metrics
│   │       │   └── fct_subscriptions.sql    # Subscription lifecycle events
│   │       ├── finance/
│   │       │   ├── _finance__models.yml
│   │       │   ├── fct_mrr.sql              # Monthly recurring revenue by account
│   │       │   ├── fct_arr_movements.sql    # ARR waterfall: new, expansion, churn, contraction
│   │       │   └── fct_invoices.sql         # Invoice-level revenue with recognition schedule
│   │       └── marketing/
│   │           ├── _marketing__models.yml
│   │           ├── fct_campaigns.sql        # Campaign performance: spend, conversions, CAC
│   │           └── fct_attribution.sql      # Multi-touch attribution model
│   ├── metrics/                             # dbt Semantic Layer MetricFlow definitions
│   │   ├── mrr.yml                          # MRR metric: measure, dimensions, time grains
│   │   ├── arr.yml                          # ARR metric with filters
│   │   ├── customer_count.yml               # Active customer count by segment
│   │   └── cac.yml                          # Customer acquisition cost metric
│   ├── analyses/                            # Ad-hoc SQL saved as dbt analyses (not materialized)
│   │   └── churn_cohort_analysis.sql        # Cohort retention analysis for quarterly reviews
│   └── tests/                               # Singular data tests (complex logic, not generic)
│       ├── assert_mrr_nonnegative.sql       # MRR must never be negative at account level
│       └── assert_no_duplicate_orders.sql   # Order IDs must be unique across all sources
├── quality/                                 # Data quality checks (Soda or Great Expectations)
│   ├── soda/
│   │   ├── configuration.yml                # Soda Cloud connection + warehouse credentials
│   │   ├── checks/
│   │   │   ├── staging/
│   │   │   │   ├── stripe_customers.yml     # Freshness, completeness, format checks
│   │   │   │   └── salesforce_accounts.yml
│   │   │   └── marts/
│   │   │       ├── fct_mrr.yml              # Revenue accuracy checks vs source
│   │   │       └── dim_customers.yml        # PK uniqueness, referential integrity
│   │   └── scan.sh                          # Entrypoint: soda scan -d warehouse -c config
│   └── great_expectations/                  # Alternative: GX Cloud config
│       ├── great_expectations.yml           # Datasource: BigQuery or Snowflake connection
│       └── expectations/
│           ├── fct_orders_suite.json        # Expectation suite for orders fact
│           └── dim_customers_suite.json
├── observability/                           # Monte Carlo / Bigeye config + alert routing
│   ├── monte_carlo/
│   │   └── monitors.yml                     # Table-level freshness + volume monitors
│   └── alerts/
│       └── slack_routing.yml                # Alert severity → Slack channel mapping
├── docs/                                    # Supplementary documentation
│   ├── data-dictionary.md                   # Business glossary: canonical metric definitions
│   ├── lineage.md                           # Source-to-BI lineage map for key tables
│   ├── incident-response.md                 # Data quality incident runbook
│   └── onboarding.md                        # New data engineer onboarding guide
├── scripts/
│   ├── bootstrap_dev.sh                     # Set up local dbt profile + warehouse dev schema
│   └── validate_manifest.py                 # Parse dbt manifest.json to assert coverage thresholds
├── .env.example                             # All required env vars documented with comments
└── .gitignore                               # profiles.yml, target/, dbt_packages/, *.tfvars
```

## Key files explained

| Path | Purpose |
|---|---|
| `dbt/dbt_project.yml` | Project-level config: model materialization defaults by folder (staging → view, marts → table), variable defaults for environment-specific logic, target path |
| `dbt/macros/generate_schema_name.sql` | Overrides dbt's default schema naming so dev runs land in a user-scoped schema (e.g., `dbt_alice`) rather than overwriting shared schemas |
| `dbt/models/staging/stripe/_stripe__sources.yml` | Declares the raw Stripe tables as dbt sources with freshness thresholds; source freshness failures block downstream runs in CI |
| `dbt/metrics/mrr.yml` | MetricFlow semantic model definition: references `fct_mrr`, defines the `mrr` measure, supported dimensions (customer_segment, plan), and time grains (day, month, quarter) |
| `quality/soda/checks/marts/fct_mrr.yml` | Soda checks run post-dbt: asserts MRR sum matches expected tolerance vs prior day, no nulls in key columns, no negative values — alerts Slack on failure |
| `terraform/modules/bigquery/datasets.tf` | Creates `raw`, `staging`, `marts`, and `metrics` BigQuery datasets with correct IAM: Fivetran writer → raw only; dbt service account → staging + marts; Looker → marts + metrics read-only |
| `dbt/selectors.yml` | Named selectors allow `dbt build --selector nightly` to run the full DAG and `--selector finance` to run only finance mart models + their upstream dependencies |
| `.github/workflows/slim-ci.yml` | Uses dbt's Slim CI: compares the PR's `manifest.json` against the production manifest artifact to only build and test models changed in the PR, reducing CI runtime by 60–80% |
| `observability/alerts/slack_routing.yml` | Maps alert severity levels to Slack channels: critical → #data-incidents, warning → #data-quality, info → #data-observability; prevents alert fatigue |
| `docs/data-dictionary.md` | Canonical definitions for all business metrics; MRR, ARR, CAC, churn — referenced in dbt model descriptions and Looker LookML labels to ensure consistency |

## Quick scaffold

```bash
# Prerequisites: Python 3.11+, pip or pipx, Terraform 1.8+, GitHub CLI

# Create project root and enter it
mkdir analytics-platform && cd analytics-platform
git init

# Set up Python virtual environment for dbt
python -m venv .venv && source .venv/bin/activate

# Install dbt Core with your warehouse adapter
pip install dbt-core==1.8.* dbt-bigquery==1.8.*
# OR for Snowflake:
# pip install dbt-core==1.8.* dbt-snowflake==1.8.*

# Install Soda Core
pip install soda-core-bigquery==3.*
# OR for Snowflake: pip install soda-core-snowflake==3.*

# Save dependencies
pip freeze > requirements.txt

# Initialize dbt project
dbt init dbt --skip-profile-setup
cd dbt

# Install dbt packages
cat > packages.yml <<'EOF'
packages:
  - package: dbt-labs/dbt_utils
    version: [">=1.1.0", "<2.0.0"]
  - package: calogica/dbt_expectations
    version: [">=0.10.0", "<1.0.0"]
  - package: dbt-labs/codegen
    version: [">=0.12.0", "<1.0.0"]
  - package: calogica/dbt_date
    version: [">=0.10.0", "<1.0.0"]
EOF
dbt deps
cd ..

# Create directory structure
mkdir -p dbt/models/staging/{stripe,salesforce,hubspot,app_db}
mkdir -p dbt/models/intermediate
mkdir -p dbt/models/marts/{core,finance,marketing}
mkdir -p dbt/metrics dbt/analyses dbt/tests dbt/seeds dbt/macros
mkdir -p quality/soda/checks/{staging,marts}
mkdir -p quality/great_expectations/expectations
mkdir -p observability/{monte_carlo,alerts}
mkdir -p terraform/environments/{prod,dev}
mkdir -p terraform/modules/{bigquery,snowflake,fivetran,iam}
mkdir -p docs scripts
mkdir -p .github/workflows
mkdir -p .claude/commands

# Initialize Terraform
cd terraform && terraform init && cd ..

# Create .env.example
cat > .env.example <<'EOF'
# BigQuery
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
BQ_PROJECT=your-gcp-project-id
BQ_DATASET_RAW=raw
BQ_DATASET_STAGING=staging
BQ_DATASET_MARTS=marts

# Snowflake (alternative)
SNOWFLAKE_ACCOUNT=yourorg-youraccountname
SNOWFLAKE_USER=dbt_runner
SNOWFLAKE_PRIVATE_KEY_PATH=/path/to/rsa_key.p8
SNOWFLAKE_DATABASE=PROD
SNOWFLAKE_WAREHOUSE=TRANSFORMING

# dbt
DBT_TARGET=dev
DBT_PROFILES_DIR=~/.dbt

# Soda
SODA_API_KEY_ID=your-soda-api-key-id
SODA_API_KEY_SECRET=your-soda-api-key-secret

# Slack alerting
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/yyy/zzz
SLACK_CHANNEL_INCIDENTS=#data-incidents

# Monte Carlo
MONTECARLO_API_KEY_ID=your-mc-key-id
MONTECARLO_API_TOKEN=your-mc-token

# Terraform state
TF_STATE_BUCKET=your-terraform-state-bucket
EOF

# Create .gitignore
cat > .gitignore <<'EOF'
.venv/
dbt/target/
dbt/dbt_packages/
dbt/logs/
profiles.yml
*.tfvars
!*.tfvars.example
.env
*.credentials.json
__pycache__/
.DS_Store
EOF

# Set up Claude Code config
touch .claude/CLAUDE.md .claude/settings.json
touch .claude/commands/new-model.md
touch .claude/commands/run-quality.md
touch .claude/commands/publish-dashboard.md
touch .claude/commands/data-incident.md

# Install Claudient skills
npx claudient add skill data-ml/sql
npx claudient add skill data-ml/dbt-data-pipelines
npx claudient add skill data-ml/data-quality-checker
npx claudient add skill data-ml/dashboard-narrator
npx claudient add skill data-ml/stakeholder-report
npx claudient add skill devops-infra/terraform
npx claudient add skill devops-infra/cicd

echo "Analytics platform scaffolded. Next: set up profiles.yml, configure Terraform backend, run: dbt debug"
```

## CLAUDE.md template

```markdown
# Analytics Platform

Data engineering monorepo managing the full analytics stack: Fivetran/Airbyte for ingestion,
BigQuery or Snowflake as the warehouse, dbt Core 1.8 for transformations and metrics,
Soda for data quality checks, and Looker or Metabase for BI delivery.
Monte Carlo or Bigeye provides observability. All infrastructure is managed by Terraform.

## Stack

- dbt Core 1.8 + dbt-bigquery or dbt-snowflake adapter
- Warehouse: BigQuery (google cloud) or Snowflake
- Ingestion: Fivetran (managed) or Airbyte (self-hosted)
- Data quality: Soda Core 3.x (checks-as-code YAML)
- Metrics: dbt Semantic Layer with MetricFlow
- Observability: Monte Carlo or Bigeye
- BI: Looker (LookML) or Metabase
- Orchestration: dbt Cloud Jobs or Airflow 2.9+ or Dagster 1.7
- Infrastructure: Terraform 1.8
- Alerting: Slack webhooks
- CI/CD: GitHub Actions (slim CI on PR, full run on merge to main)

## Project layout

- `dbt/models/staging/` — 1:1 with raw source tables; only rename, cast, coalesce — no joins
- `dbt/models/intermediate/` — business logic joins; not exposed to BI
- `dbt/models/marts/` — final consumer-facing tables; exposed to Looker / Metabase
- `dbt/metrics/` — MetricFlow semantic model definitions
- `dbt/macros/` — reusable Jinja macros; always document inputs and outputs
- `dbt/seeds/` — static reference CSVs; only for slow-changing lookup data
- `quality/soda/` — Soda checks run post-dbt against mart tables
- `terraform/` — all infrastructure defined here; no manual console changes
- `observability/` — Monte Carlo monitor configs and Slack alert routing

## Adding a new dbt model — exact steps

1. Determine the correct layer: staging (raw 1:1), intermediate (joined business logic), or mart (BI-ready)
2. For staging: run `dbt run-operation codegen.generate_source` to scaffold the source YAML
3. Create the SQL file in the correct subdirectory following the naming convention:
   - Staging: `stg_{source}__{entity}.sql`
   - Intermediate: `int_{description}.sql`
   - Mart: `fct_{fact_name}.sql` or `dim_{dimension_name}.sql`
4. Add the model to the corresponding `_models.yml` file with description and column-level docs
5. Add at minimum: `not_null` + `unique` tests on the primary key; `accepted_values` on enum columns
6. For marts: add a corresponding Soda check file in `quality/soda/checks/marts/`
7. Run locally: `dbt build --select +your_model_name+ --target dev`
8. Verify with: `dbt test --select your_model_name`
9. Use `/new-model` slash command to scaffold the SQL + YAML boilerplate

## Running data quality checks

```bash
# Run Soda checks for a specific dataset
cd quality/soda
soda scan -d bigquery -c configuration.yml checks/marts/fct_mrr.yml

# Run all staging checks
soda scan -d bigquery -c configuration.yml checks/staging/

# Run all mart checks (typically after dbt build completes)
soda scan -d bigquery -c configuration.yml checks/marts/

# Use the /run-quality slash command for Claude-guided check execution
```

Soda configuration expects `SODA_API_KEY_ID` and `SODA_API_KEY_SECRET` in environment.
Failed checks send Slack alerts via the webhook configured in `observability/alerts/slack_routing.yml`.

## Publishing a Looker dashboard

1. Add or update LookML view files referencing the mart model
2. Define explores in the model file with appropriate joins and access filters
3. Create or update the dashboard LookML file in `looker/dashboards/`
4. Run `lookml-linter` locally before pushing
5. Merge to main — Looker pulls from the connected GitHub branch automatically
6. Validate in Looker IDE: Content Validator must pass with zero errors
7. For Metabase: connect to the mart table directly, build question, save to collection
8. Use `/publish-dashboard` slash command for guided LookML scaffolding

## dbt Semantic Layer / MetricFlow

- Metric definitions live in `dbt/metrics/*.yml` — not inside model YAML files
- Each metric must reference a semantic model (the underlying mart table)
- Supported time grains: `day`, `week`, `month`, `quarter`, `year`
- Test metrics locally: `dbt sl query --metrics mrr --group-by metric_time__month`
- Metrics exposed to Looker via the dbt Semantic Layer JDBC connection; do not duplicate in LookML
- Adding a metric: define in YAML, run `dbt sl validate`, then `dbt sl generate-metrics-docs`

## Environment variable conventions

| Variable | Purpose | Where set |
|---|---|---|
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to BigQuery service account JSON | Local ~/.zshrc, CI secret |
| `SNOWFLAKE_PRIVATE_KEY_PATH` | Path to RSA key for Snowflake auth | Local ~/.zshrc, CI secret |
| `DBT_TARGET` | Active dbt target: `dev`, `ci`, or `prod` | Set per-invocation or in CI env |
| `SODA_API_KEY_ID` / `SODA_API_KEY_SECRET` | Soda Cloud authentication | CI secret, local .env |
| `SLACK_WEBHOOK_URL` | Slack incoming webhook for quality alerts | CI secret, local .env |
| `MONTECARLO_API_KEY_ID` / `MONTECARLO_API_TOKEN` | Monte Carlo API access | CI secret |
| `TF_STATE_BUCKET` | GCS or S3 bucket for Terraform remote state | CI secret |

Never commit `.env`, `profiles.yml`, or `*.tfvars` files containing real credentials.
All variables must be documented in `.env.example` before merging.

## Access control model

- **Raw layer:** Fivetran service account has write; no human users
- **Staging + marts:** dbt runner service account has write; Looker / Metabase service accounts have read
- **Dev schemas:** each engineer has their own schema (`dbt_<username>`); isolated via `generate_schema_name` macro
- **Production schemas:** only the dbt Cloud / CI runner can write; enforced via IAM / Snowflake grants
- **Terraform:** infra changes require PR review; `terraform apply` runs only in CI on merge to main
- **Looker:** content access controlled by Looker groups mapped to data team roles

## Incident response for data quality failures

1. **Alert fires** (Soda check or Monte Carlo): appears in #data-incidents Slack channel
2. **Triage** (< 15 min): use `/data-incident` slash command to run the guided triage prompt
3. **Identify scope**: check dbt manifest lineage to find all downstream models + dashboards affected
4. **Quarantine**: if data is wrong in production, add a `where false` filter to the affected mart model and redeploy to prevent BI consumers from seeing bad data
5. **Root cause**: check source freshness (`dbt source freshness`), raw table row counts, Fivetran connector status
6. **Fix**: correct the upstream source issue or dbt logic; run `dbt build --select +affected_model+`
7. **Re-run quality checks**: `soda scan` against affected tables before removing quarantine
8. **Post-mortem**: document in `docs/incident-response.md` with timeline, root cause, and prevention steps
9. **Notify stakeholders**: use the `/stakeholder-report` skill to generate an incident summary

## Terraform workflow

```bash
# Plan changes (always before apply)
cd terraform/environments/prod
terraform init -backend-config="bucket=${TF_STATE_BUCKET}"
terraform plan -out=tfplan

# Apply (CI only for production; local dev environment is okay)
terraform apply tfplan

# Never use terraform apply without a plan file in production
```

## dbt model materialization strategy

- `staging/` → `view` (cheap, always fresh, no storage cost)
- `intermediate/` → `ephemeral` or `view` (depends on query complexity)
- `marts/core/` → `table` (refreshed each run; small tables under 10M rows)
- `marts/finance/`, `marts/marketing/` → `incremental` for large fact tables (> 10M rows)
- `metrics/` → managed by MetricFlow; do not set materialization manually

## What not to do

- Do not join across staging models — joins belong in intermediate or mart layers
- Do not hard-code warehouse or dataset names in SQL — use `{{ target.schema }}` and `{{ ref() }}`
- Do not run `dbt run` in production without running `dbt test` immediately after
- Do not modify `dbt/target/manifest.json` manually — it is generated artifact
- Do not apply Terraform changes to production without a PR-approved plan
- Do not grant raw layer access to BI tools — Looker and Metabase must only read from marts
- Do not add a metric to Looker LookML if it is already defined in the dbt Semantic Layer
```

## MCP servers

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/analytics-platform"
      ]
    },
    "bigquery": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-bigquery"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "${GOOGLE_APPLICATION_CREDENTIALS}",
        "BIGQUERY_PROJECT": "${BQ_PROJECT}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "${POSTGRES_CONNECTION_STRING}"
      }
    },
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}"
      }
    }
  }
}
```

## Recommended hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'f=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$f\" == */dbt/models/*.sql ]]; then echo \"[HOOK] dbt model written — run: dbt compile --select $(basename $f .sql) to verify Jinja renders\" >&2; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'f=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$f\" == */dbt/metrics/*.yml ]]; then echo \"[HOOK] MetricFlow metric written — validate with: dbt sl validate\" >&2; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'f=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$f\" == */terraform/*.tf ]]; then echo \"[HOOK] Terraform file changed — run: terraform validate && terraform plan\" >&2; fi'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_COMMAND\" | grep -qE \"dbt run|dbt build\" && echo \"$CLAUDE_TOOL_INPUT_COMMAND\" | grep -qv \"\\-\\-target dev\"; then echo \"[HOOK] WARNING: running dbt without --target dev — confirm this is intentional\" >&2; fi'"
          }
        ]
      },
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_COMMAND\" | grep -q \"terraform apply\" && echo \"$CLAUDE_TOOL_INPUT_COMMAND\" | grep -qv \"tfplan\"; then echo \"[HOOK] BLOCKED: always run terraform plan first and apply with a plan file\" >&2; exit 1; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
npx claudient add skill data-ml/sql
npx claudient add skill data-ml/dbt-data-pipelines
npx claudient add skill data-ml/data-quality-checker
npx claudient add skill data-ml/dashboard-narrator
npx claudient add skill data-ml/stakeholder-report
npx claudient add skill devops-infra/terraform
npx claudient add skill devops-infra/cicd
npx claudient add skill productivity/stakeholder-comms
```

## Related

- [dbt Data Pipelines Guide](../guides/dbt-data-pipelines.md)
- [Data Quality Workflow](../workflows/data-quality-pipeline.md)
- [Stakeholder Report Workflow](../workflows/stakeholder-reporting.md)
- [Infrastructure as Code Structure](./infrastructure-as-code.md)
- [Data Pipeline Structure](./data-pipeline.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
