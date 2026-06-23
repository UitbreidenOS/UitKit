#!/usr/bin/env python3
"""
Integration Example: Using Failure Predictor in Workflows

Demonstrates how to integrate failure prediction into task orchestration.
"""

import importlib.util
import os
import json
from datetime import datetime


def load_failure_predictor():
    """Load the failure prediction module."""
    spec = importlib.util.spec_from_file_location(
        "failure_prediction",
        os.path.join(os.path.dirname(__file__), "failure-prediction.py")
    )
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.FailurePredictor()


class WorkflowExecutor:
    """Task workflow executor with failure prediction."""

    def __init__(self):
        self.predictor = load_failure_predictor()

    def execute_task(self, task_type: str, parameters: dict,
                    allow_high_risk: bool = False) -> dict:
        """
        Execute a task with failure prediction.

        Args:
            task_type: Type of task to execute
            parameters: Task configuration
            allow_high_risk: Override high-risk alert

        Returns:
            Execution result with status and metrics
        """
        # Get prediction
        prediction = self.predictor.predict(task_type, parameters)

        # Check risk level
        if prediction.failure_probability >= 0.60 and not allow_high_risk:
            return {
                "status": "blocked",
                "reason": "High failure risk",
                "failure_probability": prediction.failure_probability,
                "recommendation": prediction.recommendation,
                "alternatives": prediction.suggested_alternatives
            }

        # Adjust execution strategy based on risk
        strategy = self._get_execution_strategy(prediction, parameters)

        # Execute task (simulated)
        print(f"\n[EXEC] Executing {task_type} with strategy: {strategy}")
        print(f"       Risk: {prediction.risk_level.upper()} "
              f"({prediction.failure_probability:.0%})")

        return {
            "status": "executing",
            "strategy": strategy,
            "monitoring": "enhanced" if prediction.risk_level == "high" else "standard"
        }

    def _get_execution_strategy(self, prediction, parameters) -> str:
        """Determine execution strategy based on prediction."""
        if prediction.failure_probability >= 0.80:
            return "serial_with_checkpoints"
        elif prediction.failure_probability >= 0.60:
            return "serial_with_enhanced_monitoring"
        elif prediction.failure_probability >= 0.40:
            return "parallel_with_standard_monitoring"
        else:
            return "parallel_standard"

    def batch_execute(self, tasks: list) -> dict:
        """Execute multiple tasks with prediction."""
        results = {
            "total": len(tasks),
            "executed": 0,
            "blocked": 0,
            "executions": []
        }

        for task_type, parameters in tasks:
            result = self.execute_task(task_type, parameters)
            results["executions"].append({
                "task_type": task_type,
                "result": result
            })

            if result["status"] == "blocked":
                results["blocked"] += 1
            else:
                results["executed"] += 1

        return results


def example_1_safe_execution():
    """Example 1: Safe task execution."""
    print("\n" + "="*60)
    print("EXAMPLE 1: Safe Task Execution")
    print("="*60)

    executor = WorkflowExecutor()

    # Low-risk task
    result = executor.execute_task(
        task_type="unit_tests",
        parameters={
            "suite": "fast",
            "timeout_seconds": 300,
            "max_retries": 2,
            "memory_mb": 1024
        }
    )

    print(f"Result: {json.dumps(result, indent=2)}")


def example_2_high_risk_blocked():
    """Example 2: High-risk task blocked."""
    print("\n" + "="*60)
    print("EXAMPLE 2: High-Risk Task Blocked (Requires Review)")
    print("="*60)

    executor = WorkflowExecutor()

    # High-risk task (no retries, long timeout, low memory)
    result = executor.execute_task(
        task_type="data_migration",
        parameters={
            "source": "postgres_prod",
            "destination": "new_cluster",
            "timeout_seconds": 7200,
            "max_retries": 0,
            "memory_mb": 256,
            "batch_size": 10000,
            "verify_checksums": True,
            "dependencies": ["pre_migration_checks", "backup", "network_setup"]
        }
    )

    print(f"Status: {result['status']}")
    if result['status'] == 'blocked':
        print(f"Reason: {result['reason']}")
        print(f"Recommendation: {result['recommendation']}")
        print("\nSuggested alternatives:")
        for alt in result['alternatives']:
            print(f"  - {alt}")


def example_3_override_high_risk():
    """Example 3: Override high-risk with manual approval."""
    print("\n" + "="*60)
    print("EXAMPLE 3: Override High-Risk (Manual Approval)")
    print("="*60)

    executor = WorkflowExecutor()

    # Same high-risk task but allow execution
    result = executor.execute_task(
        task_type="data_migration",
        parameters={
            "source": "postgres_prod",
            "destination": "new_cluster",
            "timeout_seconds": 7200,
            "max_retries": 0,
            "memory_mb": 256
        },
        allow_high_risk=True  # Manual approval given
    )

    print(f"Status: {result['status']}")
    print(f"Strategy: {result['strategy']}")
    print(f"Monitoring: {result['monitoring']}")


def example_4_batch_execution():
    """Example 4: Batch task execution with predictions."""
    print("\n" + "="*60)
    print("EXAMPLE 4: Batch Execution Planning")
    print("="*60)

    executor = WorkflowExecutor()

    tasks = [
        ("lint", {"timeout_seconds": 60, "max_retries": 1}),
        ("build", {"timeout_seconds": 300, "max_retries": 1}),
        ("deploy_staging", {
            "timeout_seconds": 1800,
            "max_retries": 2,
            "environment": "staging"
        }),
        ("deploy_prod", {
            "timeout_seconds": 3600,
            "max_retries": 0,
            "memory_mb": 256,
            "environment": "production",
            "dependencies": ["deploy_staging", "smoke_tests"]
        }),
    ]

    results = executor.batch_execute(tasks)

    print(f"\nBatch Summary:")
    print(f"  Total tasks: {results['total']}")
    print(f"  Executed: {results['executed']}")
    print(f"  Blocked: {results['blocked']}")
    print(f"\nExecution Plan:")
    for exec_result in results['executions']:
        task = exec_result['task_type']
        status = exec_result['result']['status']
        print(f"  [{status.upper():^10}] {task}")


if __name__ == "__main__":
    print("\n" + "="*60)
    print("Failure Prediction Integration Examples")
    print("="*60)

    example_1_safe_execution()
    example_2_high_risk_blocked()
    example_3_override_high_risk()
    example_4_batch_execution()

    print("\n" + "="*60)
    print("Integration Complete")
    print("="*60 + "\n")
