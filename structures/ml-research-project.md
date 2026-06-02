# ML Research Project — Project Structure

> For ML researchers and data scientists running reproducible experiments — optimizing the cycle from raw data through feature engineering, model training, MLflow tracking, and DVC-versioned artifacts.

## Stack

- **Python:** 3.12 (managed via `uv`)
- **Package management:** uv 0.4+ (replaces pip/venv; lockfile at `uv.lock`)
- **Notebooks:** JupyterLab 4.2+ (launched via `make lab`)
- **Experiment tracking + model registry:** MLflow 2.14+ (`mlruns/` local or remote tracking URI)
- **Data versioning:** DVC 3.50+ (remotes: S3 / GCS / local; `data/` and `models/` tracked)
- **Config management:** Hydra 1.3 + OmegaConf (YAML configs composed per experiment run)
- **Deep learning:** PyTorch 2.3+ (optional: swap with scikit-learn 1.5 for classical ML)
- **Classical ML:** scikit-learn 1.5, xgboost 2.1, lightgbm 4.3
- **Data wrangling:** pandas 2.2, polars 0.20+, numpy 1.26
- **Visualisation:** matplotlib 3.9, seaborn 0.13, plotly 5.22
- **Testing:** pytest 8+ with pytest-cov, nbval (notebook regression tests)
- **Linting/formatting:** Ruff 0.4+, mypy 1.10 (src/ only)
- **Pre-commit hooks:** pre-commit 3.7 (ruff, mypy, nbstripout, detect-secrets)
- **CI:** GitHub Actions (lint → test → DVC repro check on PRs)
- **Task runner:** Makefile (lab, train, evaluate, dvc-pull, lint, test)

## Directory tree

```
ml-research-project/
├── .github/
│   └── workflows/
│       ├── ci.yml                              # PR: ruff, mypy, pytest, nbval smoke tests
│       └── dvc-repro-check.yml                 # On PR: dvc repro --dry on changed stages
├── .dvc/
│   ├── config                                  # DVC remote URL, auth settings
│   └── .gitignore                              # Ignores DVC cache
├── configs/
│   ├── config.yaml                             # Root Hydra config: defaults list
│   ├── data/
│   │   ├── raw_tabular.yaml                    # raw_path, target_col, id_col, date_col
│   │   └── image_dataset.yaml                  # image_dir, resize, channels, augment flag
│   ├── features/
│   │   ├── baseline_features.yaml              # feature list for baseline run
│   │   └── engineered_features.yaml            # polynomial, interaction, lag features
│   ├── model/
│   │   ├── logistic_regression.yaml            # C, solver, max_iter, class_weight
│   │   ├── xgboost.yaml                        # n_estimators, max_depth, lr, subsample
│   │   ├── lightgbm.yaml                       # num_leaves, min_child_samples, lambda_l1
│   │   └── pytorch_mlp.yaml                    # hidden_dims, dropout, activation, batch_norm
│   ├── training/
│   │   ├── default.yaml                        # epochs, batch_size, optimizer, scheduler
│   │   ├── fast_debug.yaml                     # max_samples: 1000, epochs: 2 (sanity check)
│   │   └── full_run.yaml                       # full dataset, early stopping, cv_folds: 5
│   └── experiment/
│       ├── baseline.yaml                       # Composes: data/raw_tabular + model/logistic_regression + training/default
│       ├── xgb_sweep.yaml                      # Composes: data/raw_tabular + model/xgboost + training/full_run
│       └── mlp_ablation.yaml                   # Composes: data/raw_tabular + model/pytorch_mlp + training/full_run
├── data/
│   ├── .gitignore                              # Ignores all data files (DVC manages them)
│   ├── raw/
│   │   ├── dataset.csv.dvc                     # DVC pointer to raw dataset in remote
│   │   └── dataset.csv                         # Not committed; pulled via dvc pull
│   ├── processed/
│   │   ├── train.parquet.dvc                   # DVC pointer: cleaned, split, encoded
│   │   ├── val.parquet.dvc
│   │   └── test.parquet.dvc
│   └── external/
│       └── reference_labels.csv.dvc            # Third-party lookup table (DVC tracked)
├── models/
│   ├── .gitignore                              # Ignores all artifact files
│   ├── baseline_lr/
│   │   ├── model.pkl.dvc                       # DVC pointer to serialized sklearn pipeline
│   │   └── metadata.json                       # run_id, mlflow_uri, train_date, metrics snapshot
│   ├── xgb_v1/
│   │   ├── model.pkl.dvc
│   │   └── metadata.json
│   └── best/
│       └── model.pkl.dvc                       # Symlink/copy of current champion model artifact
├── notebooks/
│   ├── 01_eda.ipynb                            # Exploratory data analysis: distributions, nulls, correlations
│   ├── 02_baseline.ipynb                       # Baseline pipeline: logistic regression, confusion matrix, PR curve
│   ├── 03_experiments/
│   │   ├── 03a_xgboost_tuning.ipynb           # XGBoost hyperparam sweep, feature importance
│   │   ├── 03b_feature_engineering.ipynb       # Lag features, interactions, target encoding
│   │   └── 03c_error_analysis.ipynb            # Slice-based error breakdown, hardest examples
│   ├── 04_model_comparison.ipynb               # MLflow query: compare all runs, plot Pareto front
│   └── 05_production_readiness.ipynb           # Latency benchmark, calibration curve, threshold selection
├── reports/
│   ├── figures/
│   │   ├── eda_distributions.png               # Generated by 01_eda.ipynb
│   │   ├── roc_curves.png                      # Generated by 02_baseline.ipynb
│   │   ├── feature_importance.png              # Generated by 03a_xgboost_tuning.ipynb
│   │   └── model_comparison_pareto.png         # Generated by 04_model_comparison.ipynb
│   └── metrics/
│       ├── baseline_eval.json                  # {"accuracy": 0.82, "f1": 0.79, "auc": 0.87}
│       └── xgb_eval.json                       # Keyed by mlflow run_id for traceability
├── src/
│   ├── __init__.py
│   ├── data/
│   │   ├── __init__.py
│   │   ├── loader.py                           # load_raw(), load_processed() — returns polars DataFrame
│   │   ├── splitter.py                         # temporal_split(), stratified_split() — sklearn-compatible
│   │   ├── validator.py                        # great_expectations schema checks on ingested data
│   │   └── pipeline.py                         # DVC stage: raw → processed (called by dvc.yaml)
│   ├── features/
│   │   ├── __init__.py
│   │   ├── encoders.py                         # TargetEncoder, FrequencyEncoder (sklearn TransformerMixin)
│   │   ├── lag_features.py                     # add_lag_features(df, cols, windows) for time-series tasks
│   │   ├── interactions.py                     # add_polynomial_features(), add_ratio_features()
│   │   └── selector.py                         # BorutaPy wrapper, mutual_info_classif ranking helper
│   ├── models/
│   │   ├── __init__.py
│   │   ├── base.py                             # BaseModel ABC: fit(), predict(), predict_proba(), get_params()
│   │   ├── sklearn_model.py                    # SklearnModel wraps Pipeline; logs to MLflow on fit()
│   │   ├── xgb_model.py                        # XGBModel with early stopping, eval_set, mlflow.xgboost.autolog()
│   │   ├── lgbm_model.py                       # LGBMModel with dart/gbdt toggle, log_evaluation callback
│   │   └── pytorch_model.py                    # MLPClassifier (nn.Module) + Trainer with AMP, grad clip
│   └── evaluation/
│       ├── __init__.py
│       ├── metrics.py                          # compute_metrics(y_true, y_pred) → dict; logs to active MLflow run
│       ├── calibration.py                      # reliability_diagram(), expected_calibration_error()
│       ├── explainability.py                   # SHAP values, waterfall plots, dependence plots
│       └── report.py                           # generate_eval_report() → saves JSON to reports/metrics/
├── tests/
│   ├── conftest.py                             # Shared fixtures: tiny_df (10-row polars), tmp_mlflow_tracking_uri
│   ├── data/
│   │   ├── test_loader.py                      # load_raw/load_processed with local fixture parquet files
│   │   ├── test_splitter.py                    # split size, stratification, no leakage assertions
│   │   └── test_validator.py                   # schema checks pass on valid fixture; fail on corrupt input
│   ├── features/
│   │   ├── test_encoders.py                    # TargetEncoder fit/transform, inverse, unseen category handling
│   │   ├── test_lag_features.py                # Correct lag window, no lookahead on sorted df
│   │   └── test_selector.py                    # selector returns subset of columns, deterministic on seed
│   ├── models/
│   │   ├── test_sklearn_model.py               # fit() logs run to MLflow tmp URI; predict() returns correct shape
│   │   ├── test_xgb_model.py                   # early stopping terminates; mlflow run created
│   │   └── test_pytorch_model.py               # forward pass shape, training loop does not crash on tiny_df
│   └── evaluation/
│       ├── test_metrics.py                     # compute_metrics returns expected keys; values in [0,1]
│       └── test_report.py                      # generate_eval_report writes valid JSON to tmp path
├── dvc.yaml                                    # DVC pipeline stages: prepare → featurize → train → evaluate
├── dvc.lock                                    # Locked checksums for all DVC stage outputs
├── Makefile                                    # Targets: lab, train, evaluate, dvc-pull, lint, test, repro
├── pyproject.toml                              # All deps, ruff config, mypy config, pytest config, tool.uv
├── .pre-commit-config.yaml                     # ruff, mypy, nbstripout, detect-secrets hooks
├── .env.example                                # MLFLOW_TRACKING_URI, DVC_REMOTE_URL, AWS_* / GCS_* keys
├── mlruns/                                     # MLflow local tracking directory (.gitignored except .gitkeep)
└── .gitignore                                  # data/, models/, mlruns/, __pycache__, .ipynb_checkpoints
```

## Key files explained

| Path | Purpose |
|---|---|
| `dvc.yaml` | Declares DVC pipeline stages (`prepare`, `featurize`, `train`, `evaluate`); each stage specifies `cmd`, `deps`, `params`, and `outs`; `dvc repro` runs the full pipeline and skips unchanged stages |
| `configs/experiment/baseline.yaml` | Hydra defaults list that composes `data/raw_tabular`, `model/logistic_regression`, and `training/default`; passed to `src/models/sklearn_model.py` via `@hydra.main(config_path="../../configs", config_name="experiment/baseline")` |
| `src/models/base.py` | Abstract base class all model wrappers implement; ensures every model exposes `fit()`, `predict()`, `predict_proba()`, and `get_params()` so evaluation and DVC stages are model-agnostic |
| `src/evaluation/metrics.py` | `compute_metrics(y_true, y_pred, y_proba)` computes accuracy, F1, ROC-AUC, log-loss; logs each as `mlflow.log_metric()` on the caller's active run; returns the dict for JSON serialisation |
| `src/data/pipeline.py` | Entry point for the `prepare` DVC stage; reads `data/raw/dataset.csv`, validates schema via `validator.py`, runs cleaning steps, writes `data/processed/train|val|test.parquet` |
| `pyproject.toml` | Single source of truth: `[project.dependencies]`, `[tool.ruff]` (select E/F/I/UP, per-file ignores for notebooks), `[tool.mypy]` (strict, `src/` only), `[tool.pytest.ini_options]` (cov=src, testpaths=tests) |
| `Makefile` | Canonical task runner: `make train` runs Hydra+MLflow experiment; `make dvc-pull` fetches remote data; `make lab` launches JupyterLab; `make repro` runs `dvc repro` |
| `.pre-commit-config.yaml` | Runs `nbstripout` (strips notebook outputs before commit), `detect-secrets` (blocks credential commits), `ruff` (format + lint), `mypy` (type-check `src/`) |

## Quick scaffold

```bash
# Prerequisites: Python 3.12+, uv (pip install uv), DVC (pip install dvc[s3])
PROJECT=ml-research-project
mkdir -p $PROJECT && cd $PROJECT

# Python project init with uv
uv init --python 3.12
uv add mlflow==2.14 dvc hydra-core omegaconf \
    torch torchvision scikit-learn xgboost lightgbm \
    pandas polars numpy matplotlib seaborn plotly \
    shap great-expectations

uv add --dev pytest pytest-cov nbval ruff mypy pre-commit \
    jupyterlab ipywidgets nbstripout detect-secrets

# Directory structure
mkdir -p .github/workflows
mkdir -p .dvc
mkdir -p configs/data configs/features configs/model configs/training configs/experiment
mkdir -p data/raw data/processed data/external
mkdir -p models/baseline_lr models/xgb_v1 models/best
mkdir -p notebooks/03_experiments
mkdir -p reports/figures reports/metrics
mkdir -p src/data src/features src/models src/evaluation
mkdir -p tests/data tests/features tests/models tests/evaluation
mkdir -p mlruns

# Touch source files
touch src/__init__.py
touch src/data/__init__.py src/data/loader.py src/data/splitter.py src/data/validator.py src/data/pipeline.py
touch src/features/__init__.py src/features/encoders.py src/features/lag_features.py src/features/interactions.py src/features/selector.py
touch src/models/__init__.py src/models/base.py src/models/sklearn_model.py src/models/xgb_model.py src/models/lgbm_model.py src/models/pytorch_model.py
touch src/evaluation/__init__.py src/evaluation/metrics.py src/evaluation/calibration.py src/evaluation/explainability.py src/evaluation/report.py

# Touch test files
touch tests/conftest.py
touch tests/data/test_loader.py tests/data/test_splitter.py tests/data/test_validator.py
touch tests/features/test_encoders.py tests/features/test_lag_features.py tests/features/test_selector.py
touch tests/models/test_sklearn_model.py tests/models/test_xgb_model.py tests/models/test_pytorch_model.py
touch tests/evaluation/test_metrics.py tests/evaluation/test_report.py

# DVC init
dvc init
dvc remote add -d myremote s3://your-bucket/ml-research-project  # swap for GCS/local as needed

# .gitignore for data and mlruns
cat > .gitignore << 'EOF'
data/raw/*.csv
data/raw/*.parquet
data/processed/
data/external/*.csv
models/*/model.pkl
models/best/
mlruns/
__pycache__/
.ipynb_checkpoints/
*.pyc
.env
.mypy_cache/
.ruff_cache/
EOF

# .gitkeep for mlruns so the directory is tracked
touch mlruns/.gitkeep

# DVC pipeline skeleton
cat > dvc.yaml << 'EOF'
stages:
  prepare:
    cmd: uv run python src/data/pipeline.py
    deps:
      - src/data/pipeline.py
      - src/data/loader.py
      - src/data/validator.py
      - data/raw/dataset.csv
    params:
      - configs/data/raw_tabular.yaml:
    outs:
      - data/processed/train.parquet
      - data/processed/val.parquet
      - data/processed/test.parquet

  featurize:
    cmd: uv run python src/features/selector.py
    deps:
      - src/features/
      - data/processed/train.parquet
    params:
      - configs/features/baseline_features.yaml:
    outs:
      - data/processed/train_features.parquet
      - data/processed/val_features.parquet

  train:
    cmd: uv run python -m src.models.sklearn_model
    deps:
      - src/models/sklearn_model.py
      - src/models/base.py
      - data/processed/train_features.parquet
    params:
      - configs/model/logistic_regression.yaml:
      - configs/training/default.yaml:
    outs:
      - models/baseline_lr/model.pkl

  evaluate:
    cmd: uv run python -m src.evaluation.report
    deps:
      - src/evaluation/
      - models/baseline_lr/model.pkl
      - data/processed/val_features.parquet
      - data/processed/test.parquet
    outs:
      - reports/metrics/baseline_eval.json
EOF

# Makefile
cat > Makefile << 'EOF'
.PHONY: lab train evaluate dvc-pull dvc-push repro lint test clean

lab:
	uv run jupyter lab --notebook-dir=notebooks/

train:
	uv run python -m hydra_plugins.experiment +experiment=baseline

evaluate:
	uv run python -m src.evaluation.report

dvc-pull:
	dvc pull

dvc-push:
	dvc push

repro:
	dvc repro

lint:
	uv run ruff check src/ tests/
	uv run ruff format --check src/ tests/
	uv run mypy src/

format:
	uv run ruff format src/ tests/
	uv run ruff check --fix src/ tests/

test:
	uv run pytest tests/ --cov=src --cov-report=term-missing --cov-fail-under=75

nbtest:
	uv run pytest --nbval notebooks/01_eda.ipynb notebooks/02_baseline.ipynb

clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	rm -rf .mypy_cache .ruff_cache
EOF

# pre-commit config
cat > .pre-commit-config.yaml << 'EOF'
repos:
  - repo: https://github.com/kynan/nbstripout
    rev: 0.7.1
    hooks:
      - id: nbstripout
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.5.0
    hooks:
      - id: detect-secrets
        args: ["--baseline", ".secrets.baseline"]
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.4.10
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.10.0
    hooks:
      - id: mypy
        files: ^src/
        additional_dependencies: [types-all]
EOF

uv run pre-commit install

# GitHub Actions CI
cat > .github/workflows/ci.yml << 'EOF'
name: CI
on: [pull_request]
jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v2
        with:
          python-version: "3.12"
      - run: uv sync --all-extras
      - run: uv run ruff check src/ tests/
      - run: uv run ruff format --check src/ tests/
      - run: uv run mypy src/
      - run: uv run pytest tests/ --cov=src --cov-fail-under=75
EOF

# .env.example
cat > .env.example << 'EOF'
# MLflow tracking (set to remote URI for team use, e.g. http://mlflow-server:5000)
MLFLOW_TRACKING_URI=mlruns

# DVC remote credentials (S3 example)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1

# DVC remote credentials (GCS example — alternative to S3)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# Optional: MLflow experiment name (defaults to "Default")
MLFLOW_EXPERIMENT_NAME=ml-research-project
EOF

# Install Claudient skills
npx claudient add skill data-ml/experiment-tracker
npx claudient add skill data-ml/dvc-pipeline
npx claudient add skill data-ml/model-evaluator
npx claudient add skill data-ml/feature-engineer
npx claudient add skill backend/python/hydra-config
npx claudient add skill productivity/notebook-reviewer
npx claudient add skill productivity/test-generator

echo "ML research scaffold complete. Next steps:"
echo "  1. cp .env.example .env && edit .env with your DVC remote credentials"
echo "  2. dvc pull  # fetch data from remote"
echo "  3. make lab  # open JupyterLab"
echo "  4. make repro  # run full DVC pipeline"
```

## CLAUDE.md template

```markdown
# ML Research Project

Reproducible ML experiment codebase using Hydra (config), MLflow (tracking), and DVC (data+model versioning).
All experiments are tracked in MLflow. All data and model artifacts are versioned with DVC.
Source code lives in src/; notebooks in notebooks/; configs in configs/.

## Stack

- Python 3.12, uv (package manager, lockfile at uv.lock)
- JupyterLab 4.2 — notebooks/ — launch with `make lab`
- MLflow 2.14 — experiment tracking + model registry — local at mlruns/ or remote via MLFLOW_TRACKING_URI
- DVC 3.50 — data/ and models/ are DVC-tracked; never commit these files directly
- Hydra 1.3 — configs/ directory; compose experiment configs via defaults list
- PyTorch 2.3 (src/models/pytorch_model.py) and scikit-learn 1.5 (src/models/sklearn_model.py)
- pandas 2.2, polars 0.20, numpy 1.26
- pytest 8 + pytest-cov + nbval; tests live in tests/

## Running an experiment

### Step 1: Pull data from DVC remote
```bash
dvc pull                                     # fetch data/ and models/ from DVC remote
# or pull a specific path:
dvc pull data/raw/dataset.csv.dvc
```

### Step 2: Run via Hydra + MLflow (recommended)
```bash
# Run baseline experiment (composes configs/experiment/baseline.yaml)
uv run python -m src.models.sklearn_model +experiment=baseline

# Run XGBoost with overrides
uv run python -m src.models.xgb_model +experiment=xgb_sweep model.xgboost.max_depth=8

# Run with fast_debug config (1000 samples, 2 epochs — sanity check)
uv run python -m src.models.sklearn_model +experiment=baseline training=fast_debug

# Multirun sweep (Hydra sweep syntax)
uv run python -m src.models.xgb_model +experiment=xgb_sweep \
    model.xgboost.max_depth=4,6,8 \
    model.xgboost.n_estimators=100,200 --multirun
```

The experiment script must call `mlflow.set_experiment(cfg.experiment_name)` and
`mlflow.start_run()` before fitting. All Hydra config values should be logged via
`mlflow.log_params(OmegaConf.to_container(cfg, resolve=True))`.

### Step 3: Run the DVC pipeline (data → features → train → evaluate)
```bash
make repro        # runs dvc repro — skips unchanged stages
dvc repro -f      # force re-run all stages
dvc status        # show which stages are stale
```

### Step 4: View results in MLflow UI
```bash
uv run mlflow ui --port 5001
# navigate to http://localhost:5001
# filter by experiment name, sort by val_auc
```

## Makefile targets

| Target | Command | Purpose |
|---|---|---|
| `make lab` | `uv run jupyter lab --notebook-dir=notebooks/` | Open JupyterLab |
| `make train` | Hydra + MLflow experiment | Run configured experiment |
| `make evaluate` | `uv run python -m src.evaluation.report` | Evaluate champion model |
| `make dvc-pull` | `dvc pull` | Fetch all DVC-tracked files |
| `make dvc-push` | `dvc push` | Push new artifacts to remote |
| `make repro` | `dvc repro` | Re-run stale DVC pipeline stages |
| `make lint` | ruff + mypy | Check src/ and tests/ |
| `make format` | ruff format + fix | Auto-format src/ and tests/ |
| `make test` | pytest --cov=src | Run tests with coverage gate (75%) |
| `make nbtest` | pytest --nbval | Regression-test key notebooks |
| `make clean` | rm __pycache__, caches | Remove build artifacts |

## Notebook naming conventions

- Prefix with two-digit sequence number: `01_`, `02_`, `03_`
- Sub-experiments under `03_experiments/` use letter suffixes: `03a_`, `03b_`
- All notebooks must be stripped of outputs before commit (`nbstripout` runs via pre-commit)
- Notebooks are not the source of truth for model logic — move reusable code to src/ after prototyping
- Use `%autoreload 2` in the first cell to pick up live src/ changes without kernel restarts
- Log all key results to MLflow from within notebooks using `mlflow.log_metric()` / `mlflow.log_artifact()`

## Model evaluation protocol

1. **Never evaluate on test set during development.** Val set only. Test set is held for final model selection.
2. Call `src.evaluation.metrics.compute_metrics(y_true, y_pred, y_proba)` to log metrics to MLflow.
3. Run calibration check: `src.evaluation.calibration.reliability_diagram()` before promoting a model.
4. Generate SHAP values for the champion model: `src.evaluation.explainability`.
5. Save evaluation report: `src.evaluation.report.generate_eval_report()` writes to `reports/metrics/<run_id>.json`.
6. Register champion in MLflow Model Registry:
   ```python
   mlflow.register_model(f"runs:/{run_id}/model", "ChampionModel")
   ```
7. Push model artifact to DVC remote: `dvc push models/best/model.pkl.dvc`

## Adding a new model

1. Create `src/models/<name>_model.py` implementing `BaseModel` (from `src/models/base.py`)
2. Add a Hydra config: `configs/model/<name>.yaml` with all hyperparameters
3. Create an experiment config: `configs/experiment/<name>_experiment.yaml` composing data + model + training
4. Add a DVC stage in `dvc.yaml` for the new model's train + evaluate steps
5. Write tests in `tests/models/test_<name>_model.py` — at minimum: fit() logs a run, predict() returns correct shape

## DVC workflow rules

- Never `git add data/` or `git add models/` — always `dvc add` these paths
- After adding a new data file: `dvc add data/raw/newfile.csv && git add data/raw/newfile.csv.dvc .gitignore && dvc push`
- After training a new model: `dvc add models/<name>/model.pkl && dvc push`
- `dvc.lock` is committed and tracks exact checksums — always commit it alongside code changes that retrain a model

## What not to do

- Do not import from notebooks into src/ — notebooks consume src/, not the other way around
- Do not hardcode file paths — use cfg.data.raw_path from Hydra config
- Do not log to print() during training — use Python logging or MLflow tags
- Do not commit data/ or models/ files directly — DVC must track them
- Do not commit notebook outputs — nbstripout in pre-commit handles this
- Do not evaluate on the test set before final model selection
```

## MCP servers

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/ml-research-project"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "sqlite": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sqlite", "--db-path", "mlruns/mlflow.db"],
      "description": "Query MLflow SQLite tracking DB directly when using local sqlite:///mlruns/mlflow.db URI"
    },
    "aws": {
      "command": "npx",
      "args": ["-y", "@aws/mcp-server-core"],
      "env": {
        "AWS_ACCESS_KEY_ID": "${AWS_ACCESS_KEY_ID}",
        "AWS_SECRET_ACCESS_KEY": "${AWS_SECRET_ACCESS_KEY}",
        "AWS_DEFAULT_REGION": "${AWS_DEFAULT_REGION}"
      },
      "description": "Inspect and manage DVC remote data on S3"
    },
    "jupyter": {
      "command": "npx",
      "args": ["-y", "@jupyterlab/mcp-server"],
      "env": {
        "JUPYTER_TOKEN": "${JUPYTER_TOKEN}",
        "JUPYTER_BASE_URL": "http://localhost:8888"
      },
      "description": "Read and execute notebook cells via running JupyterLab instance"
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$FILE\" == *.py && \"$FILE\" == */src/* ]]; then uv run ruff format \"$FILE\" 2>/dev/null || true; uv run ruff check --fix \"$FILE\" 2>/dev/null || true; fi'"
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
            "command": "bash -c 'CMD=\"$CLAUDE_TOOL_INPUT_COMMAND\"; if echo \"$CMD\" | grep -q \"git add\" && echo \"$CMD\" | grep -qE \"data/|models/\"; then echo \"[HOOK] Warning: attempting to git add a DVC-tracked path. Use dvc add instead.\" >&2; exit 1; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR:-$PWD}\" && STALE=$(dvc status 2>/dev/null | grep -v \"^Data and pipelines are up to date\" | head -5); if [ -n \"$STALE\" ]; then echo \"[Reminder] DVC pipeline has stale stages — run make repro to sync:\"; echo \"$STALE\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
npx claudient add skill data-ml/experiment-tracker
npx claudient add skill data-ml/dvc-pipeline
npx claudient add skill data-ml/model-evaluator
npx claudient add skill data-ml/feature-engineer
npx claudient add skill data-ml/stakeholder-report
npx claudient add skill backend/python/hydra-config
npx claudient add skill productivity/notebook-reviewer
npx claudient add skill productivity/test-generator
npx claudient add skill git/pr-description
```

## Related

- [ML Research Guide](../guides/for-ml-researchers.md)
- [Experiment Tracking Workflow](../workflows/ml-experiment-tracking.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
