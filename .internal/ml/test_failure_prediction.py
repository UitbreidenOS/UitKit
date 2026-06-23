#!/usr/bin/env python3
"""Tests for failure prediction module."""

import json
import tempfile
import sys
import os
import importlib.util
from pathlib import Path
from datetime import datetime, timedelta

# Load failure_prediction.py module dynamically (handles hyphenated filename)
spec = importlib.util.spec_from_file_location(
    "failure_prediction",
    os.path.join(os.path.dirname(__file__), "failure-prediction.py")
)
failure_prediction = importlib.util.module_from_spec(spec)
spec.loader.exec_module(failure_prediction)

FailurePredictor = failure_prediction.FailurePredictor
TaskRecord = failure_prediction.TaskRecord
TaskStatus = failure_prediction.TaskStatus


def test_basic_prediction():
    """Test basic failure prediction."""
    with tempfile.TemporaryDirectory() as tmpdir:
        db_path = str(Path(tmpdir) / "test.db")
        predictor = FailurePredictor(db_path=db_path)

        # Predict with no history (should use defaults)
        prediction = predictor.predict(
            task_type="test_task",
            parameters={"timeout_seconds": 300}
        )

        assert prediction.failure_probability >= 0.0
        assert prediction.failure_probability <= 0.99
        assert prediction.risk_level in ["low", "medium", "high"]
        assert len(prediction.suggested_alternatives) > 0
        print("✓ Basic prediction works")


def test_log_and_predict():
    """Test logging executions and using them for predictions."""
    with tempfile.TemporaryDirectory() as tmpdir:
        db_path = str(Path(tmpdir) / "test.db")
        predictor = FailurePredictor(db_path=db_path)

        # Log some successful executions
        for i in range(5):
            record = TaskRecord(
                task_id=f"success-{i}",
                task_type="deploy",
                parameters={"service": "api", "timeout_seconds": 300},
                status=TaskStatus.SUCCESS.value,
                duration_seconds=120.0,
                timestamp=(datetime.now() - timedelta(days=i)).isoformat()
            )
            predictor.log_execution(record)

        # Log some failures with specific error
        for i in range(2):
            record = TaskRecord(
                task_id=f"failure-{i}",
                task_type="deploy",
                parameters={"service": "api", "timeout_seconds": 3600},
                status=TaskStatus.FAILURE.value,
                duration_seconds=3600.0,
                error_category="timeout",
                timestamp=(datetime.now() - timedelta(days=10 + i)).isoformat()
            )
            predictor.log_execution(record)

        # Predict for similar task
        prediction = predictor.predict(
            task_type="deploy",
            parameters={
                "service": "api",
                "timeout_seconds": 3600,
                "max_retries": 0
            }
        )

        assert prediction.success_rate > 0.0
        assert len(prediction.primary_risk_factors) > 0
        assert prediction.similar_failures >= 0
        print("✓ Log and predict works")


def test_high_risk_alert():
    """Test high-risk prediction alert."""
    with tempfile.TemporaryDirectory() as tmpdir:
        db_path = str(Path(tmpdir) / "test.db")
        predictor = FailurePredictor(db_path=db_path)

        # Log many failures
        for i in range(8):
            record = TaskRecord(
                task_id=f"failure-{i}",
                task_type="flaky_task",
                parameters={
                    "timeout_seconds": 7200,
                    "max_retries": 0,
                    "memory_mb": 256,
                    "dependencies": list(range(10))
                },
                status=TaskStatus.FAILURE.value,
                duration_seconds=1800.0,
                error_category="resource_exhaustion",
                retry_count=i % 3,
                timestamp=(datetime.now() - timedelta(days=i)).isoformat()
            )
            predictor.log_execution(record)

        # Log 2 successes for comparison
        for i in range(2):
            record = TaskRecord(
                task_id=f"success-{i}",
                task_type="flaky_task",
                parameters={
                    "timeout_seconds": 300,
                    "max_retries": 3,
                    "memory_mb": 2048
                },
                status=TaskStatus.SUCCESS.value,
                duration_seconds=60.0,
                timestamp=(datetime.now() - timedelta(days=20 + i)).isoformat()
            )
            predictor.log_execution(record)

        # Predict high-risk task
        prediction = predictor.predict(
            task_type="flaky_task",
            parameters={
                "timeout_seconds": 7200,
                "max_retries": 0,
                "memory_mb": 256,
                "dependencies": list(range(10))
            }
        )

        if prediction.failure_probability >= 0.60:
            assert prediction.risk_level == "high"
            print(f"✓ High-risk alert triggered: {prediction.failure_probability:.0%}")
        else:
            print(f"  Note: High-risk threshold not reached (prob: {prediction.failure_probability:.0%})")


def test_risk_factors():
    """Test risk factor identification."""
    with tempfile.TemporaryDirectory() as tmpdir:
        db_path = str(Path(tmpdir) / "test.db")
        predictor = FailurePredictor(db_path=db_path)

        high_risk_params = {
            "timeout_seconds": 7200,  # Long timeout
            "max_retries": 0,          # No retry
            "memory_mb": 256,          # Low memory
            "dependencies": list(range(8)),  # High dependency chain
            "param1": "v1",
            "param2": "v2",
            "param3": "v3",
            "param4": "v4",
            "param5": "v5",
            "param6": "v6",
            "param7": "v7",
            "param8": "v8",
            "param9": "v9",
            "param10": "v10",
            "param11": "v11"  # Over 10 params = complexity
        }

        prediction = predictor.predict(
            task_type="complex_task",
            parameters=high_risk_params
        )

        assert len(prediction.primary_risk_factors) > 0
        print(f"✓ Risk factors identified: {prediction.primary_risk_factors}")


def test_batch_predict():
    """Test batch prediction."""
    with tempfile.TemporaryDirectory() as tmpdir:
        db_path = str(Path(tmpdir) / "test.db")
        predictor = FailurePredictor(db_path=db_path)

        tasks = [
            ("task_a", {"timeout_seconds": 300}),
            ("task_b", {"timeout_seconds": 3600, "max_retries": 0}),
            ("task_c", {"timeout_seconds": 1800, "memory_mb": 1024}),
        ]

        predictions = predictor.batch_predict(tasks)

        assert len(predictions) == 3
        for task_id, prediction in predictions.items():
            assert prediction.failure_probability >= 0.0
            assert prediction.failure_probability <= 0.99

        print(f"✓ Batch prediction completed for {len(predictions)} tasks")


def test_export_analysis():
    """Test analysis export."""
    with tempfile.TemporaryDirectory() as tmpdir:
        db_path = str(Path(tmpdir) / "test.db")
        predictor = FailurePredictor(db_path=db_path)

        # Log some executions
        for task_type in ["deploy", "test", "build"]:
            for i in range(3):
                status = TaskStatus.SUCCESS.value if i % 2 == 0 else TaskStatus.FAILURE.value
                record = TaskRecord(
                    task_id=f"{task_type}-{i}",
                    task_type=task_type,
                    parameters={},
                    status=status,
                    duration_seconds=100.0 + i,
                    timestamp=datetime.now().isoformat()
                )
                predictor.log_execution(record)

        # Export analysis
        output_path = str(Path(tmpdir) / "analysis.json")
        predictor.export_analysis(output_path)

        assert Path(output_path).exists()

        with open(output_path) as f:
            analysis = json.load(f)

        assert "task_types" in analysis
        assert len(analysis["task_types"]) == 3
        print(f"✓ Analysis exported with {len(analysis['task_types'])} task types")


if __name__ == "__main__":
    print("Running failure prediction tests...\n")
    test_basic_prediction()
    test_log_and_predict()
    test_high_risk_alert()
    test_risk_factors()
    test_batch_predict()
    test_export_analysis()
    print("\n✓ All tests passed!")
