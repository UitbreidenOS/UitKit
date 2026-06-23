"""
ONNX Inference Wrapper - Runtime prediction using exported ONNX models.
Enables fast, cross-platform task prediction without training dependencies.
"""

import json
import logging
from pathlib import Path
from typing import Dict, List, Tuple, Any, Optional

import numpy as np

try:
    import onnxruntime as rt
except ImportError:
    rt = None

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


class ONNXTaskPredictor:
    """ONNX-based task predictor for inference."""

    def __init__(self, model_dir: Path = None):
        if rt is None:
            raise ImportError(
                "onnxruntime not installed. Install with: pip install onnxruntime"
            )

        self.model_dir = model_dir or Path(__file__).parent / "models"

        self.success_session = None
        self.duration_session = None
        self.feature_names = None
        self.label_encoders_map = {}

        self._load_models()

    def _load_models(self):
        """Load ONNX models and metadata."""
        logger.info(f"Loading ONNX models from {self.model_dir}")

        metadata_path = self.model_dir / "onnx_metadata.json"
        if not metadata_path.exists():
            raise FileNotFoundError(
                f"ONNX metadata not found at {metadata_path}. "
                "Run task-sequence-model.py to export models first."
            )

        with open(metadata_path, "r") as f:
            metadata = json.load(f)

        success_model_path = metadata.get("success_model_path")
        duration_model_path = metadata.get("duration_model_path")
        self.feature_names = metadata.get("feature_names")

        if not Path(success_model_path).exists():
            raise FileNotFoundError(f"Success model not found at {success_model_path}")

        if not Path(duration_model_path).exists():
            raise FileNotFoundError(f"Duration model not found at {duration_model_path}")

        try:
            providers = ["CPUExecutionProvider"]
            if rt.get_available_providers():
                providers = rt.get_available_providers()

            self.success_session = rt.InferenceSession(
                success_model_path, providers=providers
            )
            logger.info(f"Success model loaded with providers: {providers}")

            self.duration_session = rt.InferenceSession(
                duration_model_path, providers=providers
            )
            logger.info(f"Duration model loaded with providers: {providers}")

            meta_path = self.model_dir / "metadata.json"
            if meta_path.exists():
                with open(meta_path, "r") as f:
                    meta = json.load(f)
                    self.label_encoders_map = meta.get("encoder_categories", {})
                    logger.info(f"Loaded encoder categories: {self.label_encoders_map}")

        except Exception as e:
            logger.error(f"Failed to load ONNX models: {e}")
            raise

    def predict_task_success(
        self, features: np.ndarray
    ) -> float:
        """Predict task success probability using ONNX model."""
        if self.success_session is None:
            raise RuntimeError("Success model not loaded")

        features = features.astype(np.float32).reshape(1, -1)

        input_name = self.success_session.get_inputs()[0].name
        output_name = self.success_session.get_outputs()[0].name

        result = self.success_session.run([output_name], {input_name: features})

        success_prob = float(result[0][0])
        return np.clip(success_prob, 0.0, 1.0)

    def predict_task_duration(
        self, features: np.ndarray
    ) -> float:
        """Predict task duration using ONNX model."""
        if self.duration_session is None:
            raise RuntimeError("Duration model not loaded")

        features = features.astype(np.float32).reshape(1, -1)

        input_name = self.duration_session.get_inputs()[0].name
        output_name = self.duration_session.get_outputs()[0].name

        result = self.duration_session.run([output_name], {input_name: features})

        duration = float(result[0][0])
        return max(duration, 1.0)

    def batch_predict(
        self, features_list: List[np.ndarray]
    ) -> Tuple[np.ndarray, np.ndarray]:
        """Batch predict success and duration for multiple feature vectors."""
        if not features_list:
            return np.array([]), np.array([])

        features_batch = np.vstack(features_list).astype(np.float32)

        input_name_success = self.success_session.get_inputs()[0].name
        output_name_success = self.success_session.get_outputs()[0].name

        success_results = self.success_session.run(
            [output_name_success], {input_name_success: features_batch}
        )[0]

        input_name_duration = self.duration_session.get_inputs()[0].name
        output_name_duration = self.duration_session.get_outputs()[0].name

        duration_results = self.duration_session.run(
            [output_name_duration], {input_name_duration: features_batch}
        )[0]

        success_results = np.clip(success_results, 0.0, 1.0)
        duration_results = np.maximum(duration_results, 1.0)

        return success_results, duration_results

    def rank_tasks(
        self, features_list: List[Tuple[int, np.ndarray]]
    ) -> List[Tuple[int, float, float]]:
        """Rank tasks by success-to-duration ratio."""
        if not features_list:
            return []

        indices = [idx for idx, _ in features_list]
        features = [feat for _, feat in features_list]

        success_probs, durations = self.batch_predict(features)

        scores = []
        for idx, success_prob, duration in zip(indices, success_probs, durations):
            score = success_prob / (1.0 + duration / 60.0)
            scores.append((idx, float(success_prob), float(duration), score))

        scores.sort(key=lambda x: x[3], reverse=True)

        return [(idx, prob, dur) for idx, prob, dur, _ in scores]

    def model_info(self) -> Dict[str, Any]:
        """Get model information."""
        info = {
            "framework": "ONNX Runtime",
            "models": {
                "success": "XGBClassifier",
                "duration": "XGBRegressor",
            },
            "feature_names": self.feature_names,
            "feature_count": len(self.feature_names) if self.feature_names else 0,
            "encoder_categories": self.label_encoders_map,
            "model_directory": str(self.model_dir),
        }

        if self.success_session:
            success_inputs = self.success_session.get_inputs()
            success_outputs = self.success_session.get_outputs()
            info["success_model"] = {
                "input_shape": success_inputs[0].shape if success_inputs else None,
                "output_shape": success_outputs[0].shape if success_outputs else None,
            }

        if self.duration_session:
            duration_inputs = self.duration_session.get_inputs()
            duration_outputs = self.duration_session.get_outputs()
            info["duration_model"] = {
                "input_shape": duration_inputs[0].shape if duration_inputs else None,
                "output_shape": duration_outputs[0].shape if duration_outputs else None,
            }

        return info


class TaskPredictionService:
    """High-level service for task prediction and sequencing."""

    def __init__(self, model_dir: Path = None):
        self.predictor = ONNXTaskPredictor(model_dir)
        self.cache = {}

    def predict_task(
        self, task_id: str, features: np.ndarray
    ) -> Dict[str, float]:
        """Predict success and duration for a task."""
        success_prob = self.predictor.predict_task_success(features)
        duration = self.predictor.predict_task_duration(features)

        prediction = {
            "task_id": task_id,
            "success_probability": success_prob,
            "estimated_duration_seconds": duration,
            "risk_level": self._assess_risk(success_prob),
            "efficiency_score": success_prob / (1.0 + duration / 60.0),
        }

        self.cache[task_id] = prediction
        return prediction

    def predict_workflow(
        self, tasks: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Predict metrics for entire workflow."""
        workflow_features = []
        task_ids = []

        for task in tasks:
            task_id = task.get("id", f"task_{len(task_ids)}")
            features = self._prepare_features(task)
            workflow_features.append((len(task_ids), features))
            task_ids.append(task_id)

        if not workflow_features:
            return {
                "total_tasks": 0,
                "predictions": [],
                "workflow_success_probability": 0.0,
                "total_estimated_duration": 0.0,
            }

        indices, features = zip(*workflow_features)
        success_probs, durations = self.predictor.batch_predict(list(features))

        predictions = []
        total_duration = 0.0
        cumulative_success = 1.0

        for task_id, success_prob, duration in zip(task_ids, success_probs, durations):
            predictions.append(
                {
                    "task_id": task_id,
                    "success_probability": float(success_prob),
                    "estimated_duration_seconds": float(duration),
                    "risk_level": self._assess_risk(success_prob),
                }
            )
            total_duration += duration
            cumulative_success *= success_prob

        return {
            "total_tasks": len(task_ids),
            "predictions": predictions,
            "workflow_success_probability": float(
                np.clip(cumulative_success, 0.0, 1.0)
            ),
            "total_estimated_duration": float(total_duration),
            "average_task_duration": float(total_duration / len(task_ids)),
        }

    def optimize_execution(
        self, tasks: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Optimize task execution order."""
        workflow_features = []

        for idx, task in enumerate(tasks):
            features = self._prepare_features(task, position=idx)
            workflow_features.append((idx, features))

        if not workflow_features:
            return []

        ranked = self.predictor.rank_tasks(workflow_features)

        optimized = []
        for rank, (original_idx, success_prob, duration) in enumerate(ranked):
            task = tasks[original_idx].copy()
            task["optimized_position"] = rank
            task["predicted_success"] = success_prob
            task["predicted_duration"] = duration
            task["risk_level"] = self._assess_risk(success_prob)
            optimized.append(task)

        return optimized

    def _prepare_features(
        self, task: Dict[str, Any], position: int = 0
    ) -> np.ndarray:
        """Prepare feature vector from task dict."""
        task_position = task.get("position", position)
        task_count = task.get("task_count", 1)
        time_of_day = task.get("time_of_day", 12)
        day_of_week = task.get("day_of_week", 3)
        cpu_available = task.get("cpu_available", 0.5)
        memory_available = task.get("memory_available", 0.5)

        task_name_enc = self._encode_category("task_name", task.get("name", "unknown"))
        task_type_enc = self._encode_category("task_type", task.get("type", "computation"))
        goal_type_enc = self._encode_category("goal_type", task.get("goal_type", "analysis"))

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
            ],
            dtype=np.float32,
        )

        return features

    def _encode_category(self, category: str, value: str) -> int:
        """Encode categorical value, with fallback to 0."""
        categories = self.predictor.label_encoders_map.get(category, {})
        if isinstance(categories, dict):
            return categories.get(value, 0)
        return 0

    def _assess_risk(self, success_prob: float) -> str:
        """Assess risk level based on success probability."""
        if success_prob >= 0.85:
            return "low"
        elif success_prob >= 0.70:
            return "medium"
        elif success_prob >= 0.50:
            return "high"
        else:
            return "critical"


def main():
    """Test ONNX inference."""
    logger.info("=== ONNX Task Predictor Demo ===")

    try:
        predictor = ONNXTaskPredictor()
        logger.info("ONNX models loaded successfully")

        info = predictor.model_info()
        logger.info(f"Model info: {json.dumps(info, indent=2, default=str)}")

        test_features = np.array(
            [[2, 5, 14, 2, 0.7, 0.8, 1, 2, 0]], dtype=np.float32
        )
        success = predictor.predict_task_success(test_features)
        duration = predictor.predict_task_duration(test_features)

        logger.info(f"Test prediction - Success: {success:.4f}, Duration: {duration:.2f}s")

        service = TaskPredictionService()

        tasks = [
            {
                "id": "task_1",
                "name": "setup",
                "type": "data_prep",
                "goal_type": "analysis",
                "position": 0,
                "task_count": 3,
            },
            {
                "id": "task_2",
                "name": "fetch",
                "type": "io",
                "goal_type": "analysis",
                "position": 1,
                "task_count": 3,
            },
            {
                "id": "task_3",
                "name": "parse",
                "type": "computation",
                "goal_type": "analysis",
                "position": 2,
                "task_count": 3,
            },
        ]

        logger.info("Predicting workflow metrics...")
        workflow_pred = service.predict_workflow(tasks)
        logger.info(f"Workflow prediction: {json.dumps(workflow_pred, indent=2)}")

        logger.info("Optimizing execution order...")
        optimized = service.optimize_execution(tasks)
        logger.info(f"Optimized tasks: {json.dumps(optimized, indent=2, default=str)}")

    except Exception as e:
        logger.error(f"Error: {e}", exc_info=True)
        return 1

    return 0


if __name__ == "__main__":
    exit(main())
