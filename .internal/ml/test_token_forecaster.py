#!/usr/bin/env python3
"""Test suite for token-usage-forecaster.py"""

import json
import sys
import importlib.util
from pathlib import Path

# Load forecaster module directly by file path
spec = importlib.util.spec_from_file_location(
    "token_usage_forecaster",
    Path(__file__).parent / "token-usage-forecaster.py"
)
forecaster_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(forecaster_module)

TokenForecaster = forecaster_module.TokenForecaster
TaskType = forecaster_module.TaskType
ComplexityLevel = forecaster_module.ComplexityLevel
TokenEstimate = forecaster_module.TokenEstimate
BudgetAlert = forecaster_module.BudgetAlert


def test_single_task_estimation():
    """Test single task token estimation."""
    forecaster = TokenForecaster(budget_tokens=100_000)

    estimate = forecaster.estimate_single_task(
        task_type=TaskType.CODE_GENERATION,
        complexity=ComplexityLevel.MEDIUM,
        file_count=5,
        codebase_size_kb=500,
    )

    assert isinstance(estimate, TokenEstimate)
    assert estimate.total_tokens > 0
    assert estimate.confidence > 0.5
    assert 0 <= estimate.confidence <= 1.0
    print("✓ Single task estimation test passed")


def test_complexity_scaling():
    """Test that complexity correctly scales token estimates."""
    forecaster = TokenForecaster(budget_tokens=100_000)
    estimates = {}

    for complexity in ComplexityLevel:
        est = forecaster.estimate_single_task(
            task_type=TaskType.CODE_GENERATION,
            complexity=complexity,
            file_count=1,
        )
        estimates[complexity] = est.total_tokens

    # Verify scaling is monotonically increasing
    complexity_order = [
        ComplexityLevel.MINIMAL,
        ComplexityLevel.LOW,
        ComplexityLevel.MEDIUM,
        ComplexityLevel.HIGH,
        ComplexityLevel.CRITICAL,
    ]

    for i in range(len(complexity_order) - 1):
        assert (
            estimates[complexity_order[i]] < estimates[complexity_order[i + 1]]
        ), f"Complexity scaling broken: {complexity_order[i]} >= {complexity_order[i+1]}"

    print("✓ Complexity scaling test passed")


def test_task_type_variation():
    """Test that different task types have distinct token costs."""
    forecaster = TokenForecaster(budget_tokens=100_000)
    costs = {}

    for task_type in TaskType:
        est = forecaster.estimate_single_task(
            task_type=task_type,
            complexity=ComplexityLevel.MEDIUM,
            file_count=1,
        )
        costs[task_type] = est.total_tokens

    # Verify variation exists
    min_cost = min(costs.values())
    max_cost = max(costs.values())
    ratio = max_cost / min_cost

    assert ratio > 1.5, f"Task types too similar: {ratio}x variation"
    print(f"✓ Task type variation test passed (max/min ratio: {ratio:.2f}x)")


def test_multi_task_forecasting():
    """Test multi-task forecasting with contingency."""
    forecaster = TokenForecaster(budget_tokens=100_000)
    tasks = [
        (TaskType.CODE_REVIEW, ComplexityLevel.MEDIUM, {"file_count": 3}),
        (TaskType.REFACTORING, ComplexityLevel.HIGH, {"file_count": 8}),
        (TaskType.TESTING, ComplexityLevel.LOW, {"file_count": 2}),
    ]

    total, estimates, summary = forecaster.forecast_multi_task(tasks, contingency_percent=20)

    assert len(estimates) == 3
    assert total > 0
    assert summary["contingency_tokens"] > 0
    assert summary["total_tokens"] == total
    assert summary["task_count"] == 3
    print("✓ Multi-task forecasting test passed")


def test_budget_alerts():
    """Test budget alert generation at different thresholds."""
    forecaster = TokenForecaster(budget_tokens=100_000)

    # Test: Within limits (should not alert)
    alert = forecaster.check_budget(
        tokens_needed=10_000, tokens_used=20_000, threshold_warning=0.75
    )
    assert alert is None, "Should not alert when within limits"

    # Test: Warning level
    alert = forecaster.check_budget(
        tokens_needed=40_000, tokens_used=40_000, threshold_warning=0.75
    )
    assert alert is not None
    assert alert.alert_type == "warning"

    # Test: Critical level
    alert = forecaster.check_budget(
        tokens_needed=50_000, tokens_used=46_000, threshold_critical=0.90
    )
    assert alert is not None
    assert alert.alert_type == "critical"

    # Test: Exceeded budget
    alert = forecaster.check_budget(tokens_needed=60_000, tokens_used=50_000)
    assert alert is not None
    assert alert.alert_type == "exceeded"
    assert alert.remaining_tokens < 0

    print("✓ Budget alert test passed")


def test_history_tracking():
    """Test historical usage recording and retrieval."""
    forecaster = TokenForecaster(budget_tokens=100_000)

    # Record multiple tasks
    forecaster.record_actual_usage(
        task_type=TaskType.CODE_GENERATION,
        input_tokens=1200,
        output_tokens=1800,
        complexity=ComplexityLevel.MEDIUM,
        metadata={"attempt": 1},
    )

    forecaster.record_actual_usage(
        task_type=TaskType.CODE_REVIEW,
        input_tokens=800,
        output_tokens=400,
        complexity=ComplexityLevel.LOW,
        metadata={"attempt": 1},
    )

    assert len(forecaster.token_history) == 2
    assert forecaster.token_history[0]["task_type"] == "code_generation"
    assert forecaster.token_history[1]["task_type"] == "code_review"
    assert forecaster.token_history[0]["total_tokens"] == 3000
    assert forecaster.token_history[1]["total_tokens"] == 1200

    print("✓ History tracking test passed")


def test_accuracy_analysis():
    """Test forecast accuracy analysis."""
    forecaster = TokenForecaster(budget_tokens=100_000)

    # Record actual usage
    for _ in range(3):
        forecaster.record_actual_usage(
            task_type=TaskType.CODE_GENERATION,
            input_tokens=1050,
            output_tokens=1200,
            complexity=ComplexityLevel.MEDIUM,
        )

    accuracy = forecaster.accuracy_vs_forecast()
    # When history exists but forecasts don't, it returns error
    # This is expected behavior for incomplete data
    if "error" in accuracy:
        assert accuracy["error"] == "Insufficient history"
    else:
        assert "code_generation" in accuracy
        assert "error_percent" in accuracy["code_generation"]
        assert accuracy["code_generation"]["samples"] == 3

    print("✓ Accuracy analysis test passed")


def test_json_export():
    """Test JSON report export."""
    forecaster = TokenForecaster(budget_tokens=100_000)

    # Add some data
    forecaster.record_actual_usage(
        TaskType.CODE_GENERATION, 1200, 1800, ComplexityLevel.MEDIUM
    )

    # Export to string
    report_json = forecaster.export_forecast_report()
    report = json.loads(report_json)

    assert "generated_at" in report
    assert report["budget_tokens"] == 100_000
    assert "history_summary" in report

    print("✓ JSON export test passed")


def test_file_count_scaling():
    """Test that file count properly scales token estimates."""
    forecaster = TokenForecaster(budget_tokens=100_000)
    estimates = {}

    for file_count in [1, 2, 5, 10, 20]:
        est = forecaster.estimate_single_task(
            task_type=TaskType.CODE_REVIEW,
            complexity=ComplexityLevel.MEDIUM,
            file_count=file_count,
        )
        estimates[file_count] = est.total_tokens

    # Verify file count causes increases (log scale)
    assert estimates[1] < estimates[5] < estimates[20]
    print("✓ File count scaling test passed")


def test_codebase_size_scaling():
    """Test that codebase size properly scales token estimates."""
    forecaster = TokenForecaster(budget_tokens=100_000)
    estimates = {}

    for size_kb in [100, 500, 1000, 5000]:
        est = forecaster.estimate_single_task(
            task_type=TaskType.CODE_REVIEW,
            complexity=ComplexityLevel.MEDIUM,
            codebase_size_kb=size_kb,
        )
        estimates[size_kb] = est.total_tokens

    # Verify size causes increases
    assert estimates[100] < estimates[500] < estimates[5000]
    print("✓ Codebase size scaling test passed")


def test_breakdown_completeness():
    """Test that token breakdown is complete and adds up correctly."""
    forecaster = TokenForecaster(budget_tokens=100_000)
    estimate = forecaster.estimate_single_task(
        task_type=TaskType.CODE_GENERATION,
        complexity=ComplexityLevel.MEDIUM,
        file_count=3,
        codebase_size_kb=250,
    )

    breakdown = estimate.breakdown
    assert "input_tokens" in breakdown
    assert "output_tokens" in breakdown
    assert "prompt_overhead" in breakdown

    # Verify components sum to total
    calculated_total = (
        breakdown["input_tokens"]
        + breakdown["output_tokens"]
        + breakdown["prompt_overhead"]
    )
    assert calculated_total == estimate.total_tokens

    print("✓ Breakdown completeness test passed")


def run_all_tests():
    """Run all test functions."""
    tests = [
        test_single_task_estimation,
        test_complexity_scaling,
        test_task_type_variation,
        test_multi_task_forecasting,
        test_budget_alerts,
        test_history_tracking,
        test_accuracy_analysis,
        test_json_export,
        test_file_count_scaling,
        test_codebase_size_scaling,
        test_breakdown_completeness,
    ]

    print("Running Token Forecaster Test Suite\n" + "=" * 50)
    passed = 0
    failed = 0

    for test_func in tests:
        try:
            test_func()
            passed += 1
        except AssertionError as e:
            print(f"✗ {test_func.__name__} FAILED: {e}")
            failed += 1
        except Exception as e:
            print(f"✗ {test_func.__name__} ERROR: {e}")
            failed += 1

    print("\n" + "=" * 50)
    print(f"Results: {passed} passed, {failed} failed")

    return failed == 0


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
