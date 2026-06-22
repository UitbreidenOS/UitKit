"""
Task Sequence Model - XGBoost-based predictor for optimal task execution
Trains on historical dont-stop goal executions to predict:
  - Optimal task order
  - Success probability per task
  - Estimated duration per task
Exports to ONNX for inference.
"""

import json
import pickle
import logging
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple, Optional, Any

import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    mean_absolute_error,
    mean_squared_error,
)
import skl2onnx
from skl2onnx.common.data_types import FloatTensorType, StringTensorType

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


class TaskSequenceModel:
    """XGBoost model for task execution prediction and sequencing."""

    def __init__(self, model_dir: Path = None):
        self.model_dir = model_dir or Path(__file__).parent / "models"
        self.model_dir.mkdir(exist_ok=True)

        self.success_model = None
        self.duration_model = None
        self.sequence_model = None

        self.label_encoders = {}
        self.scalers = {}
        self.feature_names = None
        self.task_encoder = None

        self.training_stats = {}

    def _generate_synthetic_data(
        self, n_samples: int = 500
    ) -> pd.DataFrame:
        """Generate synthetic historical task execution data."""
        logger.info(f"Generating {n_samples} synthetic training samples")

        tasks = [
            "setup",
            "fetch",
            "parse",
            "validate",
            "transform",
            "optimize",
            "test",
            "deploy",
            "monitor",
            "cleanup",
        ]
        task_types = [
            "data_prep",
            "computation",
            "io",
            "validation",
            "cleanup",
        ]
        goal_types = ["analysis", "transformation", "integration", "migration"]

        data = []
        for _ in range(n_samples):
            n_tasks = np.random.randint(3, 8)
            task_sequence = np.random.choice(tasks, size=n_tasks, replace=True)

            for idx, task in enumerate(task_sequence):
                task_type = np.random.choice(task_types)
                goal_type = np.random.choice(goal_types)

                base_success = 0.85 if task_type != "computation" else 0.75
                success = base_success + np.random.normal(0, 0.15)
                success = np.clip(success, 0.0, 1.0)

                duration = np.random.lognormal(mean=2, sigma=1)

                data.append(
                    {
                        "task_name": task,
                        "task_type": task_type,
                        "goal_type": goal_type,
                        "task_position": idx,
                        "task_count": n_tasks,
                        "time_of_day": np.random.randint(0, 24),
                        "day_of_week": np.random.randint(0, 7),
                        "cpu_available": np.random.uniform(0.2, 1.0),
                        "memory_available": np.random.uniform(0.3, 1.0),
                        "success": 1 if success > 0.5 else 0,
                        "duration_seconds": duration,
                        "execution_date": datetime.now().isoformat(),
                    }
                )

        return pd.DataFrame(data)

    def _engineer_features(self, df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        """Engineer features from raw task data."""
        logger.info("Engineering features")

        feature_cols = [
            "task_position",
            "task_count",
            "time_of_day",
            "day_of_week",
            "cpu_available",
            "memory_available",
        ]

        df_features = df.copy()

        for col in ["task_name", "task_type", "goal_type"]:
            if col not in self.label_encoders:
                self.label_encoders[col] = LabelEncoder()
                df_features[f"{col}_encoded"] = self.label_encoders[col].fit_transform(
                    df[col]
                )
            else:
                df_features[f"{col}_encoded"] = self.label_encoders[col].transform(
                    df[col]
                )

        feature_cols.extend(["task_name_encoded", "task_type_encoded", "goal_type_encoded"])

        X = df_features[feature_cols].values
        self.feature_names = feature_cols

        if "success" in df.columns:
            y_success = df["success"].values
        else:
            y_success = None

        if "duration_seconds" in df.columns:
            y_duration = df["duration_seconds"].values
        else:
            y_duration = None

        return X, y_success, y_duration

    def train(self, df: Optional[pd.DataFrame] = None):
        """Train success and duration models."""
        if df is None:
            df = self._generate_synthetic_data(n_samples=500)

        logger.info(f"Training on {len(df)} samples")

        X, y_success, y_duration = self._engineer_features(df)

        if "success" in df.columns and "duration_seconds" in df.columns:
            X_train, X_test, y_success_train, y_success_test = train_test_split(
                X, y_success, test_size=0.2, random_state=42
            )
            _, _, y_duration_train, y_duration_test = train_test_split(
                X, y_duration, test_size=0.2, random_state=42
            )
        else:
            X_train, X_test = train_test_split(X, test_size=0.2, random_state=42)
            y_success_train, y_success_test = train_test_split(
                y_success, test_size=0.2, random_state=42
            )
            y_duration_train, y_duration_test = train_test_split(
                y_duration, test_size=0.2, random_state=42
            )

        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        self.scalers["features"] = scaler

        logger.info("Training success prediction model")
        self.success_model = xgb.XGBClassifier(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            random_state=42,
            eval_metric="logloss",
        )
        self.success_model.fit(X_train_scaled, y_success_train)

        success_pred = self.success_model.predict(X_test_scaled)
        success_acc = accuracy_score(y_success_test, success_pred)
        success_f1 = f1_score(y_success_test, success_pred)

        self.training_stats["success_accuracy"] = float(success_acc)
        self.training_stats["success_f1"] = float(success_f1)
        logger.info(
            f"Success model - Accuracy: {success_acc:.4f}, F1: {success_f1:.4f}"
        )

        logger.info("Training duration prediction model")
        self.duration_model = xgb.XGBRegressor(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            random_state=42,
        )
        self.duration_model.fit(X_train_scaled, y_duration_train)

        duration_pred = self.duration_model.predict(X_test_scaled)
        duration_mae = mean_absolute_error(y_duration_test, duration_pred)
        duration_rmse = np.sqrt(
            mean_squared_error(y_duration_test, duration_pred)
        )

        self.training_stats["duration_mae"] = float(duration_mae)
        self.training_stats["duration_rmse"] = float(duration_rmse)
        logger.info(
            f"Duration model - MAE: {duration_mae:.4f}, RMSE: {duration_rmse:.4f}"
        )

        logger.info("Training sequence optimization model")
        self.sequence_model = xgb.XGBRanker(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            random_state=42,
        )

        logger.info("Models trained successfully")

    def predict_task_success(self, task_features: np.ndarray) -> float:
        """Predict success probability for a task."""
        if self.success_model is None:
            raise ValueError("Model not trained. Call train() first.")

        features_scaled = self.scalers["features"].transform(task_features.reshape(1, -1))
        proba = self.success_model.predict_proba(features_scaled)[0, 1]
        return float(proba)

    def predict_task_duration(self, task_features: np.ndarray) -> float:
        """Predict duration for a task."""
        if self.duration_model is None:
            raise ValueError("Model not trained. Call train() first.")

        features_scaled = self.scalers["features"].transform(task_features.reshape(1, -1))
        duration = self.duration_model.predict(features_scaled)[0]
        return float(max(duration, 1.0))

    def optimize_task_sequence(
        self, tasks: List[Dict[str, Any]]
    ) -> List[Tuple[int, float, float]]:
        """
        Optimize task sequence based on success probability and duration.
        Returns: list of (task_index, success_probability, estimated_duration)
        """
        if self.success_model is None or self.duration_model is None:
            raise ValueError("Models not trained. Call train() first.")

        task_scores = []
        for idx, task in enumerate(tasks):
            features = self._prepare_task_features(task)
            success_prob = self.predict_task_success(features)
            duration = self.predict_task_duration(features)

            score = success_prob / (1.0 + duration / 60.0)

            task_scores.append((idx, success_prob, duration, score))

        task_scores.sort(key=lambda x: x[3], reverse=True)

        return [(idx, prob, dur) for idx, prob, dur, _ in task_scores]

    def _prepare_task_features(self, task: Dict[str, Any]) -> np.ndarray:
        """Prepare features from a task dict."""
        task_name = task.get("name", "unknown")
        task_type = task.get("type", "computation")
        goal_type = task.get("goal_type", "analysis")
        task_position = task.get("position", 0)
        task_count = task.get("task_count", 1)
        time_of_day = task.get("time_of_day", 12)
        day_of_week = task.get("day_of_week", 3)
        cpu_available = task.get("cpu_available", 0.5)
        memory_available = task.get("memory_available", 0.5)

        task_name_enc = self.label_encoders["task_name"].transform([task_name])[0]
        task_type_enc = self.label_encoders["task_type"].transform([task_type])[0]
        goal_type_enc = self.label_encoders["goal_type"].transform([goal_type])[0]

        features = np.array(
            [
                task_position,
                task_count,
                time_of_day,
                day_of_week,
                cpu_available,
                memory_available,
                task_name_enc,
                task_type_enc,
                goal_type_enc,
            ]
        )

        return features

    def save_models(self):
        """Save trained models and encoders."""
        logger.info(f"Saving models to {self.model_dir}")

        if self.success_model:
            self.success_model.save_model(
                str(self.model_dir / "success_model.json")
            )
            logger.info("Success model saved")

        if self.duration_model:
            self.duration_model.save_model(
                str(self.model_dir / "duration_model.json")
            )
            logger.info("Duration model saved")

        with open(self.model_dir / "label_encoders.pkl", "wb") as f:
            pickle.dump(self.label_encoders, f)

        with open(self.model_dir / "scalers.pkl", "wb") as f:
            pickle.dump(self.scalers, f)

        with open(self.model_dir / "metadata.json", "w") as f:
            json.dump(
                {
                    "feature_names": self.feature_names,
                    "training_stats": self.training_stats,
                    "timestamp": datetime.now().isoformat(),
                },
                f,
                indent=2,
            )

        logger.info("All models saved successfully")

    def load_models(self):
        """Load trained models and encoders."""
        logger.info(f"Loading models from {self.model_dir}")

        try:
            self.success_model = xgb.XGBClassifier()
            self.success_model.load_model(str(self.model_dir / "success_model.json"))

            self.duration_model = xgb.XGBRegressor()
            self.duration_model.load_model(str(self.model_dir / "duration_model.json"))

            with open(self.model_dir / "label_encoders.pkl", "rb") as f:
                self.label_encoders = pickle.load(f)

            with open(self.model_dir / "scalers.pkl", "rb") as f:
                self.scalers = pickle.load(f)

            with open(self.model_dir / "metadata.json", "r") as f:
                metadata = json.load(f)
                self.feature_names = metadata.get("feature_names")
                self.training_stats = metadata.get("training_stats", {})

            logger.info("Models loaded successfully")
        except FileNotFoundError as e:
            logger.error(f"Model files not found: {e}")
            raise

    def export_to_onnx(self):
        """Export models to ONNX format for cross-platform inference."""
        if self.success_model is None or self.duration_model is None:
            raise ValueError("Models not trained. Call train() first.")

        logger.info("Exporting models to ONNX format")

        initial_type_float = [("float_input", FloatTensorType([None, len(self.feature_names)]))]

        try:
            onnx_success = skl2onnx.convert_sklearn(
                self.success_model,
                initial_types=initial_type_float,
                target_opset=12,
            )
            onnx_success_path = self.model_dir / "success_model.onnx"
            with open(onnx_success_path, "wb") as f:
                f.write(onnx_success.SerializeToString())
            logger.info(f"Success model exported to {onnx_success_path}")

            onnx_duration = skl2onnx.convert_sklearn(
                self.duration_model,
                initial_types=initial_type_float,
                target_opset=12,
            )
            onnx_duration_path = self.model_dir / "duration_model.onnx"
            with open(onnx_duration_path, "wb") as f:
                f.write(onnx_duration.SerializeToString())
            logger.info(f"Duration model exported to {onnx_duration_path}")

            with open(self.model_dir / "onnx_metadata.json", "w") as f:
                json.dump(
                    {
                        "success_model_path": str(onnx_success_path),
                        "duration_model_path": str(onnx_duration_path),
                        "feature_names": self.feature_names,
                        "exported_at": datetime.now().isoformat(),
                    },
                    f,
                    indent=2,
                )

            logger.info("ONNX export completed successfully")

        except Exception as e:
            logger.error(f"ONNX export failed: {e}")
            raise

    def get_feature_importance(self) -> Dict[str, float]:
        """Get feature importance scores from trained models."""
        if self.success_model is None:
            raise ValueError("Model not trained. Call train() first.")

        importance_dict = {}
        success_importance = self.success_model.feature_importances_
        duration_importance = self.duration_model.feature_importances_

        for name, success_imp, duration_imp in zip(
            self.feature_names, success_importance, duration_importance
        ):
            importance_dict[name] = {
                "success_importance": float(success_imp),
                "duration_importance": float(duration_imp),
                "combined": float((success_imp + duration_imp) / 2),
            }

        return importance_dict

    def get_training_report(self) -> Dict[str, Any]:
        """Generate a training report."""
        return {
            "model_type": "XGBoost Task Sequence Model",
            "training_stats": self.training_stats,
            "feature_names": self.feature_names,
            "n_encoders": len(self.label_encoders),
            "encoder_categories": {
                name: len(encoder.classes_)
                for name, encoder in self.label_encoders.items()
            },
            "timestamp": datetime.now().isoformat(),
        }


def main():
    """Train, evaluate, save, and export the task sequence model."""
    logger.info("=== Task Sequence Model Training Pipeline ===")

    model = TaskSequenceModel()

    logger.info("Step 1: Generating synthetic training data")
    df = model._generate_synthetic_data(n_samples=500)
    logger.info(f"Generated {len(df)} training samples")

    logger.info("Step 2: Training models")
    model.train(df)

    logger.info("Step 3: Getting feature importance")
    importance = model.get_feature_importance()
    logger.info(f"Feature importance: {json.dumps(importance, indent=2)}")

    logger.info("Step 4: Generating training report")
    report = model.get_training_report()
    logger.info(f"Training report: {json.dumps(report, indent=2)}")

    logger.info("Step 5: Saving models")
    model.save_models()

    logger.info("Step 6: Exporting to ONNX")
    model.export_to_onnx()

    logger.info("Step 7: Testing predictions")
    test_task = {
        "name": "fetch",
        "type": "io",
        "goal_type": "integration",
        "position": 2,
        "task_count": 5,
        "time_of_day": 14,
        "day_of_week": 2,
        "cpu_available": 0.7,
        "memory_available": 0.8,
    }

    features = model._prepare_task_features(test_task)
    success_prob = model.predict_task_success(features)
    duration = model.predict_task_duration(features)

    logger.info(
        f"Test prediction - Task: {test_task['name']}, "
        f"Success Probability: {success_prob:.4f}, "
        f"Estimated Duration: {duration:.2f}s"
    )

    logger.info("Step 8: Optimizing task sequence")
    tasks = [
        {"name": "setup", "type": "data_prep", "goal_type": "analysis", "position": 0, "task_count": 3},
        {"name": "fetch", "type": "io", "goal_type": "analysis", "position": 1, "task_count": 3},
        {"name": "parse", "type": "computation", "goal_type": "analysis", "position": 2, "task_count": 3},
    ]
    optimized = model.optimize_task_sequence(tasks)
    logger.info(f"Optimized task sequence: {optimized}")

    logger.info("=== Training Pipeline Complete ===")


if __name__ == "__main__":
    main()
