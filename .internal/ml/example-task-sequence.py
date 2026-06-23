"""
Example: Task Sequence Model - Training and Inference
Demonstrates how to train, export, and use the task sequence model.
"""

import json
import logging
from pathlib import Path
import sys

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def example_training():
    """Example 1: Training the model from scratch."""
    logger.info("=" * 60)
    logger.info("EXAMPLE 1: Training Task Sequence Model")
    logger.info("=" * 60)

    from task_sequence_model import TaskSequenceModel

    model = TaskSequenceModel()

    logger.info("\n1. Generating synthetic training data...")
    df = model._generate_synthetic_data(n_samples=500)
    logger.info(f"   Generated {len(df)} samples")
    logger.info(f"   Sample columns: {list(df.columns)}")
    logger.info(f"\n   First few rows:\n{df.head(3)}")

    logger.info("\n2. Training models...")
    model.train(df)

    logger.info("\n3. Getting feature importance...")
    importance = model.get_feature_importance()
    logger.info("   Top features by importance:")
    sorted_features = sorted(
        importance.items(), key=lambda x: x[1]["combined"], reverse=True
    )
    for feature, scores in sorted_features[:5]:
        logger.info(
            f"   - {feature}: {scores['combined']:.4f} "
            f"(success: {scores['success_importance']:.4f}, "
            f"duration: {scores['duration_importance']:.4f})"
        )

    logger.info("\n4. Getting training report...")
    report = model.get_training_report()
    logger.info(f"   {json.dumps(report, indent=2)}")

    logger.info("\n5. Saving models...")
    model.save_models()
    logger.info(f"   Models saved to {model.model_dir}")

    logger.info("\n6. Exporting to ONNX...")
    model.export_to_onnx()
    logger.info(f"   ONNX models exported to {model.model_dir}")

    logger.info("\n✓ Training complete!\n")

    return model


def example_inference():
    """Example 2: Using ONNX models for inference."""
    logger.info("=" * 60)
    logger.info("EXAMPLE 2: ONNX Inference")
    logger.info("=" * 60)

    try:
        from onnx_inference import ONNXTaskPredictor
    except ImportError:
        logger.warning("onnxruntime not installed. Skipping ONNX example.")
        logger.info("Install with: pip install onnxruntime")
        return

    predictor = ONNXTaskPredictor()

    logger.info("\n1. Model information:")
    info = predictor.model_info()
    logger.info(f"   {json.dumps(info, indent=2, default=str)}")

    logger.info("\n2. Single task prediction:")
    import numpy as np

    test_features = np.array(
        [[2, 5, 14, 2, 0.7, 0.8, 1, 2, 0]], dtype=np.float32
    )
    success_prob = predictor.predict_task_success(test_features)
    duration = predictor.predict_task_duration(test_features)

    logger.info(f"   Task at position 2 of 5:")
    logger.info(f"   - Success probability: {success_prob:.4f}")
    logger.info(f"   - Estimated duration: {duration:.2f} seconds")

    logger.info("\n3. Batch prediction:")
    batch_features = np.array(
        [
            [0, 3, 9, 1, 0.6, 0.7, 0, 1, 0],
            [1, 3, 9, 1, 0.6, 0.7, 1, 2, 0],
            [2, 3, 9, 1, 0.6, 0.7, 2, 0, 0],
        ],
        dtype=np.float32,
    )
    success_probs, durations = predictor.batch_predict([batch_features[i] for i in range(3)])

    for idx, (s, d) in enumerate(zip(success_probs, durations)):
        logger.info(f"   Task {idx}: {s:.4f} success, {d:.2f}s")

    logger.info("\n✓ Inference complete!\n")


def example_service():
    """Example 3: Using the high-level prediction service."""
    logger.info("=" * 60)
    logger.info("EXAMPLE 3: Task Prediction Service")
    logger.info("=" * 60)

    try:
        from onnx_inference import TaskPredictionService
    except ImportError:
        logger.warning("onnxruntime not installed. Skipping service example.")
        return

    service = TaskPredictionService()

    logger.info("\n1. Predicting single task:")
    task = {
        "id": "fetch_data",
        "name": "fetch",
        "type": "io",
        "goal_type": "integration",
        "position": 1,
        "task_count": 5,
        "time_of_day": 14,
        "day_of_week": 2,
        "cpu_available": 0.7,
        "memory_available": 0.8,
    }

    features = service._prepare_features(task)
    prediction = service.predict_task(task["id"], features)
    logger.info(f"   {json.dumps(prediction, indent=2)}")

    logger.info("\n2. Predicting workflow metrics:")
    workflow_tasks = [
        {
            "id": "setup",
            "name": "setup",
            "type": "data_prep",
            "goal_type": "analysis",
            "position": 0,
            "task_count": 3,
            "time_of_day": 10,
            "day_of_week": 3,
            "cpu_available": 0.5,
            "memory_available": 0.6,
        },
        {
            "id": "fetch",
            "name": "fetch",
            "type": "io",
            "goal_type": "analysis",
            "position": 1,
            "task_count": 3,
            "time_of_day": 10,
            "day_of_week": 3,
            "cpu_available": 0.7,
            "memory_available": 0.8,
        },
        {
            "id": "parse",
            "name": "parse",
            "type": "computation",
            "goal_type": "analysis",
            "position": 2,
            "task_count": 3,
            "time_of_day": 10,
            "day_of_week": 3,
            "cpu_available": 0.6,
            "memory_available": 0.7,
        },
    ]

    workflow_pred = service.predict_workflow(workflow_tasks)
    logger.info(f"   Total tasks: {workflow_pred['total_tasks']}")
    logger.info(
        f"   Workflow success probability: {workflow_pred['workflow_success_probability']:.4f}"
    )
    logger.info(
        f"   Total estimated duration: {workflow_pred['total_estimated_duration']:.2f}s"
    )
    logger.info(f"   Average task duration: {workflow_pred['average_task_duration']:.2f}s")

    logger.info("\n   Per-task predictions:")
    for pred in workflow_pred["predictions"]:
        logger.info(f"   - {pred['task_id']}: {pred['success_probability']:.4f} success, "
                   f"{pred['estimated_duration_seconds']:.2f}s, {pred['risk_level']} risk")

    logger.info("\n3. Optimizing task execution order:")
    optimized = service.optimize_execution(workflow_tasks)

    logger.info("   Optimized sequence (by efficiency score):")
    for task in optimized:
        logger.info(
            f"   {task['optimized_position']}. {task['id']:10} - "
            f"{task['predicted_success']:.4f} success, "
            f"{task['predicted_duration']:.2f}s, "
            f"{task['risk_level']} risk"
        )

    logger.info("\n✓ Service example complete!\n")


def main():
    """Run all examples."""
    try:
        # Example 1: Train model
        model = example_training()

        # Example 2: ONNX inference
        example_inference()

        # Example 3: Prediction service
        example_service()

        logger.info("=" * 60)
        logger.info("ALL EXAMPLES COMPLETE")
        logger.info("=" * 60)
        logger.info("\nNext steps:")
        logger.info("1. Train your own model with historical data:")
        logger.info("   df = pd.read_csv('your_task_history.csv')")
        logger.info("   model.train(df)")
        logger.info("")
        logger.info("2. Use ONNX models in production:")
        logger.info("   from ml.onnx_inference import TaskPredictionService")
        logger.info("   service = TaskPredictionService()")
        logger.info("   optimized_tasks = service.optimize_execution(tasks)")
        logger.info("")

    except Exception as e:
        logger.error(f"Error running examples: {e}", exc_info=True)
        return 1

    return 0


if __name__ == "__main__":
    exit(main())
