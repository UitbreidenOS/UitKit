#!/usr/bin/env python3
"""
Example: Using TokenForecaster for Multi-Agent Workflow Budget Management

This example demonstrates a realistic scenario: forecasting token costs for a
complex multi-step workflow, checking budget constraints, and handling alerts.
"""

import importlib.util
from pathlib import Path

# Load the forecaster module
spec = importlib.util.spec_from_file_location(
    "token_usage_forecaster",
    Path(__file__).parent / "token-usage-forecaster.py"
)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

TokenForecaster = module.TokenForecaster
TaskType = module.TaskType
ComplexityLevel = module.ComplexityLevel


def scenario_1_single_pr_review():
    """Scenario: Code review for a medium-sized PR (3 files changed)."""
    print("\n" + "=" * 70)
    print("SCENARIO 1: PR Code Review")
    print("=" * 70)

    forecaster = TokenForecaster(budget_tokens=50_000)

    # Estimate a single code review task
    estimate = forecaster.estimate_single_task(
        task_type=TaskType.CODE_REVIEW,
        complexity=ComplexityLevel.MEDIUM,
        file_count=3,
        codebase_size_kb=200,
    )

    print(f"PR Review Forecast:")
    print(f"  Total tokens: {estimate.total_tokens}")
    print(f"  Confidence: {estimate.confidence:.0%}")
    print(f"  Breakdown:")
    for key, value in estimate.breakdown.items():
        print(f"    {key:20}: {value:6}")

    # Check budget
    alert = forecaster.check_budget(tokens_needed=estimate.total_tokens, tokens_used=0)
    if alert:
        print(f"  Alert: {alert.message}")
    else:
        print(f"  Budget OK (using {estimate.total_tokens} of 50,000 tokens)")


def scenario_2_multi_step_feature():
    """Scenario: Implement a feature requiring code gen, testing, docs."""
    print("\n" + "=" * 70)
    print("SCENARIO 2: Multi-Step Feature Development")
    print("=" * 70)

    forecaster = TokenForecaster(budget_tokens=150_000)

    tasks = [
        (
            TaskType.CODE_GENERATION,
            ComplexityLevel.HIGH,
            {"file_count": 8, "codebase_size_kb": 1500},
        ),
        (
            TaskType.TESTING,
            ComplexityLevel.MEDIUM,
            {"file_count": 5, "codebase_size_kb": 1500},
        ),
        (
            TaskType.DOCUMENTATION,
            ComplexityLevel.MEDIUM,
            {"file_count": 2, "codebase_size_kb": 1500},
        ),
        (
            TaskType.REFACTORING,
            ComplexityLevel.MEDIUM,
            {"file_count": 3, "codebase_size_kb": 1500},
        ),
    ]

    total, estimates, summary = forecaster.forecast_multi_task(
        tasks, contingency_percent=25
    )

    print("Feature Development Forecast:")
    print(f"  Tasks: {summary['task_count']}")
    print(f"  Subtotal: {summary['subtotal_tokens']:,} tokens")
    print(f"  Contingency (25%): {summary['contingency_tokens']:,} tokens")
    print(f"  Total: {total:,} tokens")
    print(f"  Average per task: {summary['average_per_task']:,} tokens")
    print(f"  Max single task: {summary['max_single_task']:,} tokens")

    # Check budget
    alert = forecaster.check_budget(tokens_needed=total, tokens_used=0)
    if alert:
        print(f"  Alert: {alert.message}")
    else:
        print(f"  Budget OK (using {total:,} of 150,000 tokens)")

    # Show task-by-task breakdown
    print("\n  Task Breakdown:")
    task_names = ["Code Generation", "Testing", "Documentation", "Refactoring"]
    for i, (name, estimate) in enumerate(zip(task_names, estimates)):
        print(f"    {name:20} {estimate.total_tokens:6} tokens")


def scenario_3_budget_exhaustion():
    """Scenario: Show warning/critical/exceeded alerts."""
    print("\n" + "=" * 70)
    print("SCENARIO 3: Budget Constraint Handling")
    print("=" * 70)

    forecaster = TokenForecaster(budget_tokens=100_000)

    test_cases = [
        (20_000, "Small task, 80% remaining"),
        (70_000, "Large task, 30% remaining - WARNING threshold"),
        (85_000, "Very large task, 15% remaining - CRITICAL threshold"),
        (105_000, "Oversized task, exceeds budget"),
    ]

    for tokens_needed, description in test_cases:
        alert = forecaster.check_budget(
            tokens_needed=tokens_needed,
            tokens_used=0,
            threshold_warning=0.75,
            threshold_critical=0.90,
        )

        print(f"\n  {description}")
        print(f"    Tokens needed: {tokens_needed:,}")
        if alert:
            print(f"    Status: {alert.alert_type.upper()}")
            print(f"    Message: {alert.message}")
        else:
            print(f"    Status: OK")


def scenario_4_historical_calibration():
    """Scenario: Track actual usage and calibrate forecasts."""
    print("\n" + "=" * 70)
    print("SCENARIO 4: Forecast Calibration with Actual Data")
    print("=" * 70)

    forecaster = TokenForecaster(budget_tokens=500_000)

    # Simulate real usage data collected over time
    real_tasks = [
        (TaskType.CODE_GENERATION, 1150, 1750, ComplexityLevel.MEDIUM),
        (TaskType.CODE_GENERATION, 1300, 2000, ComplexityLevel.HIGH),
        (TaskType.CODE_GENERATION, 900, 1200, ComplexityLevel.LOW),
        (TaskType.CODE_REVIEW, 750, 350, ComplexityLevel.MEDIUM),
        (TaskType.CODE_REVIEW, 900, 500, ComplexityLevel.HIGH),
        (TaskType.TESTING, 850, 600, ComplexityLevel.MEDIUM),
        (TaskType.REFACTORING, 1000, 900, ComplexityLevel.HIGH),
    ]

    print("Recording 7 real task executions:")
    for i, (task_type, inp, out, complexity) in enumerate(real_tasks, 1):
        forecaster.record_actual_usage(task_type, inp, out, complexity)
        print(f"  {i}. {task_type.value:20} → {inp + out:5} tokens")

    # Analyze accuracy
    accuracy = forecaster.accuracy_vs_forecast()

    print("\nForecast Accuracy Analysis:")
    if "error" not in accuracy:
        for task_type, metrics in accuracy.items():
            print(
                f"  {task_type:20} forecast={metrics['forecast']:5}, "
                f"actual={metrics['avg_actual']:5}, "
                f"error={metrics['error_percent']:6.1f}% ({metrics['samples']} samples)"
            )
    else:
        print(f"  {accuracy['error']}")


def scenario_5_dynamic_budget_adjustment():
    """Scenario: Adjust task complexity based on remaining budget."""
    print("\n" + "=" * 70)
    print("SCENARIO 5: Dynamic Task Complexity Based on Budget")
    print("=" * 70)

    forecaster = TokenForecaster(budget_tokens=80_000)
    tokens_used = 0

    # Initial estimate at high complexity
    high_complexity_est = forecaster.estimate_single_task(
        TaskType.CODE_GENERATION, ComplexityLevel.HIGH, file_count=10
    )
    print(f"High complexity estimate: {high_complexity_est.total_tokens} tokens")

    # Check if it fits
    alert = forecaster.check_budget(high_complexity_est.total_tokens, tokens_used)
    if alert and alert.alert_type == "exceeded":
        print(f"Alert: {alert.message}")
        print("Downgrading to MEDIUM complexity...")

        medium_complexity_est = forecaster.estimate_single_task(
            TaskType.CODE_GENERATION, ComplexityLevel.MEDIUM, file_count=10
        )
        print(f"Medium complexity estimate: {medium_complexity_est.total_tokens} tokens")

        alert = forecaster.check_budget(medium_complexity_est.total_tokens, tokens_used)
        if alert:
            print(f"Still exceeds budget. Final alert: {alert.message}")
        else:
            print("Success! Medium complexity fits within budget.")


def scenario_6_multi_agent_workflow():
    """Scenario: Forecast costs for multi-agent workflow."""
    print("\n" + "=" * 70)
    print("SCENARIO 6: Multi-Agent Workflow Orchestration")
    print("=" * 70)

    forecaster = TokenForecaster(budget_tokens=250_000)

    workflows = [
        ("Security Review Agent", [
            (TaskType.ANALYSIS, ComplexityLevel.HIGH, {"file_count": 15, "codebase_size_kb": 2000}),
            (TaskType.DEBUGGING, ComplexityLevel.HIGH, {"file_count": 5, "codebase_size_kb": 2000}),
        ]),
        ("Performance Agent", [
            (TaskType.ANALYSIS, ComplexityLevel.MEDIUM, {"file_count": 8, "codebase_size_kb": 2000}),
            (TaskType.REFACTORING, ComplexityLevel.MEDIUM, {"file_count": 6, "codebase_size_kb": 2000}),
        ]),
        ("Documentation Agent", [
            (TaskType.DOCUMENTATION, ComplexityLevel.MEDIUM, {"file_count": 3, "codebase_size_kb": 2000}),
            (TaskType.CODE_GENERATION, ComplexityLevel.LOW, {"file_count": 2, "codebase_size_kb": 2000}),
        ]),
    ]

    total_workflow_tokens = 0

    print("Multi-Agent Workflow Forecast:")
    for agent_name, tasks in workflows:
        total, ests, summary = forecaster.forecast_multi_task(tasks, contingency_percent=20)
        total_workflow_tokens += total
        print(f"\n  {agent_name}:")
        print(f"    Tasks: {summary['task_count']}")
        print(f"    Total tokens: {total:,}")

    print(f"\nTotal for all agents: {total_workflow_tokens:,} tokens")

    alert = forecaster.check_budget(total_workflow_tokens, tokens_used=0)
    if alert:
        print(f"Alert: {alert.message}")
    else:
        print(f"Budget OK (using {total_workflow_tokens:,} of 250,000 tokens)")


def main():
    """Run all scenarios."""
    print("\n" + "#" * 70)
    print("# TOKEN FORECASTING EXAMPLES")
    print("#" * 70)

    scenario_1_single_pr_review()
    scenario_2_multi_step_feature()
    scenario_3_budget_exhaustion()
    scenario_4_historical_calibration()
    scenario_5_dynamic_budget_adjustment()
    scenario_6_multi_agent_workflow()

    print("\n" + "#" * 70)
    print("# END OF EXAMPLES")
    print("#" * 70 + "\n")


if __name__ == "__main__":
    main()
