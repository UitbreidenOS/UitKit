#!/usr/bin/env python3
"""
Token Usage Forecaster - Predict token consumption based on goal complexity and task types.

This module provides functionality to forecast total token needs for Claude API calls,
alert on budget constraints, and track historical token patterns.
"""

import json
import math
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional, Tuple
from pathlib import Path


class TaskType(Enum):
    """Task type categories for token estimation."""
    CODE_REVIEW = "code_review"
    CODE_GENERATION = "code_generation"
    DOCUMENTATION = "documentation"
    ANALYSIS = "analysis"
    TESTING = "testing"
    DEBUGGING = "debugging"
    REFACTORING = "refactoring"
    RESEARCH = "research"
    SUMMARIZATION = "summarization"
    TRANSLATION = "translation"
    CUSTOM = "custom"


class ComplexityLevel(Enum):
    """Complexity levels for goal assessment."""
    MINIMAL = "minimal"      # Single file, simple task
    LOW = "low"              # Single feature, straightforward
    MEDIUM = "medium"        # Multiple files, moderate scope
    HIGH = "high"            # Large system, complex interdependencies
    CRITICAL = "critical"    # Full codebase, multi-agent coordination


@dataclass
class TokenEstimate:
    """Token consumption estimate for a task."""
    base_tokens: int
    prompt_overhead: int
    response_tokens: int
    total_tokens: int
    confidence: float  # 0.0-1.0 confidence in estimate
    breakdown: Dict[str, int]


@dataclass
class BudgetAlert:
    """Alert when token usage approaches or exceeds budget."""
    alert_type: str  # "warning", "critical", "exceeded"
    current_tokens: int
    budget_tokens: int
    remaining_tokens: int
    percentage_used: float
    message: str


class TokenForecaster:
    """Main forecasting engine for token usage prediction."""

    # Base token costs per task type (input tokens)
    BASE_COSTS = {
        TaskType.CODE_REVIEW: 800,
        TaskType.CODE_GENERATION: 1200,
        TaskType.DOCUMENTATION: 600,
        TaskType.ANALYSIS: 1000,
        TaskType.TESTING: 900,
        TaskType.DEBUGGING: 1400,
        TaskType.REFACTORING: 1100,
        TaskType.RESEARCH: 1500,
        TaskType.SUMMARIZATION: 400,
        TaskType.TRANSLATION: 800,
        TaskType.CUSTOM: 1000,
    }

    # Complexity multipliers
    COMPLEXITY_MULTIPLIERS = {
        ComplexityLevel.MINIMAL: 0.5,
        ComplexityLevel.LOW: 0.8,
        ComplexityLevel.MEDIUM: 1.2,
        ComplexityLevel.HIGH: 1.8,
        ComplexityLevel.CRITICAL: 2.5,
    }

    # Expected output token ratios (output tokens / input tokens)
    OUTPUT_RATIOS = {
        TaskType.CODE_REVIEW: 0.6,
        TaskType.CODE_GENERATION: 1.5,
        TaskType.DOCUMENTATION: 0.8,
        TaskType.ANALYSIS: 1.2,
        TaskType.TESTING: 0.7,
        TaskType.DEBUGGING: 1.3,
        TaskType.REFACTORING: 1.1,
        TaskType.RESEARCH: 1.4,
        TaskType.SUMMARIZATION: 0.3,
        TaskType.TRANSLATION: 0.9,
        TaskType.CUSTOM: 1.0,
    }

    def __init__(self, budget_tokens: int = 1_000_000):
        """
        Initialize the token forecaster.

        Args:
            budget_tokens: Total available tokens for the project/session
        """
        self.budget_tokens = budget_tokens
        self.token_history: List[Dict] = []
        self.forecasts: List[Dict] = []

    def estimate_single_task(
        self,
        task_type: TaskType,
        complexity: ComplexityLevel,
        file_count: int = 1,
        codebase_size_kb: int = 100,
        custom_input_tokens: Optional[int] = None,
    ) -> TokenEstimate:
        """
        Estimate tokens needed for a single task.

        Args:
            task_type: Type of task being performed
            complexity: Complexity level of the goal
            file_count: Number of files involved (scales estimation)
            codebase_size_kb: Approximate codebase size in KB
            custom_input_tokens: Override base calculation with custom input token count

        Returns:
            TokenEstimate with breakdown and confidence
        """
        # Base cost from task type
        base = self.BASE_COSTS[task_type]

        # Apply complexity multiplier
        complexity_factor = self.COMPLEXITY_MULTIPLIERS[complexity]
        adjusted_base = int(base * complexity_factor)

        # Scale by file count (logarithmic to avoid explosion)
        file_scale = math.log2(file_count + 1) if file_count > 0 else 0
        file_adjustment = int(file_scale * 150)

        # Scale by codebase size (every 100KB adds ~10% overhead)
        codebase_factor = 1.0 + (codebase_size_kb / 1000.0) * 0.1
        codebase_adjustment = int(adjusted_base * (codebase_factor - 1.0))

        # Calculate input tokens
        input_tokens = custom_input_tokens or (
            adjusted_base + file_adjustment + codebase_adjustment
        )

        # Calculate expected output tokens
        output_ratio = self.OUTPUT_RATIOS[task_type]
        output_tokens = int(input_tokens * output_ratio)

        # Add prompt overhead (system message, context framing, etc.)
        prompt_overhead = int(input_tokens * 0.15)

        total = input_tokens + output_tokens + prompt_overhead

        # Confidence calculation (higher for common tasks, lower for custom)
        confidence = 0.85 if task_type != TaskType.CUSTOM else 0.6

        breakdown = {
            "base_cost": adjusted_base,
            "file_adjustment": file_adjustment,
            "codebase_adjustment": codebase_adjustment,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "prompt_overhead": prompt_overhead,
        }

        return TokenEstimate(
            base_tokens=adjusted_base,
            prompt_overhead=prompt_overhead,
            response_tokens=output_tokens,
            total_tokens=total,
            confidence=confidence,
            breakdown=breakdown,
        )

    def forecast_multi_task(
        self,
        tasks: List[Tuple[TaskType, ComplexityLevel, Dict]],
        contingency_percent: float = 15.0,
    ) -> Tuple[int, List[TokenEstimate], Dict]:
        """
        Forecast tokens for multiple tasks in sequence.

        Args:
            tasks: List of (task_type, complexity, kwargs) tuples
            contingency_percent: Add buffer % for unexpected overhead

        Returns:
            (total_tokens, estimates_list, summary_dict)
        """
        estimates = []
        subtotal = 0

        for task_type, complexity, kwargs in tasks:
            estimate = self.estimate_single_task(task_type, complexity, **kwargs)
            estimates.append(estimate)
            subtotal += estimate.total_tokens

        # Add contingency buffer
        contingency = int(subtotal * (contingency_percent / 100.0))
        total_with_contingency = subtotal + contingency

        summary = {
            "task_count": len(tasks),
            "subtotal_tokens": subtotal,
            "contingency_percent": contingency_percent,
            "contingency_tokens": contingency,
            "total_tokens": total_with_contingency,
            "average_per_task": int(subtotal / len(tasks)) if tasks else 0,
            "max_single_task": max(e.total_tokens for e in estimates) if estimates else 0,
        }

        return total_with_contingency, estimates, summary

    def check_budget(
        self,
        tokens_needed: int,
        tokens_used: int = 0,
        threshold_warning: float = 0.75,
        threshold_critical: float = 0.90,
    ) -> Optional[BudgetAlert]:
        """
        Check if token needs fit within budget and generate alerts.

        Args:
            tokens_needed: Tokens required for the task
            tokens_used: Tokens already consumed
            threshold_warning: Warn if usage > this fraction of budget (0-1)
            threshold_critical: Critical alert if usage > this fraction (0-1)

        Returns:
            BudgetAlert if budget constraint detected, None otherwise
        """
        total_projected = tokens_used + tokens_needed
        remaining = self.budget_tokens - total_projected
        percentage_used = (total_projected / self.budget_tokens) * 100

        if total_projected > self.budget_tokens:
            return BudgetAlert(
                alert_type="exceeded",
                current_tokens=total_projected,
                budget_tokens=self.budget_tokens,
                remaining_tokens=remaining,
                percentage_used=percentage_used,
                message=f"BUDGET EXCEEDED: Projected {total_projected} tokens exceeds budget of {self.budget_tokens}. Deficit: {abs(remaining)} tokens.",
            )

        if percentage_used > (threshold_critical * 100):
            return BudgetAlert(
                alert_type="critical",
                current_tokens=total_projected,
                budget_tokens=self.budget_tokens,
                remaining_tokens=remaining,
                percentage_used=percentage_used,
                message=f"CRITICAL: Token usage at {percentage_used:.1f}% of budget. Only {remaining} tokens remaining.",
            )

        if percentage_used > (threshold_warning * 100):
            return BudgetAlert(
                alert_type="warning",
                current_tokens=total_projected,
                budget_tokens=self.budget_tokens,
                remaining_tokens=remaining,
                percentage_used=percentage_used,
                message=f"WARNING: Token usage at {percentage_used:.1f}% of budget. {remaining} tokens remaining.",
            )

        return None

    def record_actual_usage(
        self,
        task_type: TaskType,
        input_tokens: int,
        output_tokens: int,
        complexity: Optional[ComplexityLevel] = None,
        metadata: Optional[Dict] = None,
    ) -> None:
        """
        Record actual token usage for historical analysis.

        Args:
            task_type: Type of task performed
            input_tokens: Actual input tokens consumed
            output_tokens: Actual output tokens consumed
            complexity: Complexity level (for matching forecast)
            metadata: Additional metadata for tracking
        """
        record = {
            "timestamp": datetime.now().isoformat(),
            "task_type": task_type.value,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "total_tokens": input_tokens + output_tokens,
            "complexity": complexity.value if complexity else None,
            "metadata": metadata or {},
        }
        self.token_history.append(record)

    def accuracy_vs_forecast(self) -> Dict:
        """
        Analyze forecast accuracy against actual usage.

        Returns:
            Dictionary with accuracy metrics
        """
        if not self.token_history or not self.forecasts:
            return {"error": "Insufficient history"}

        # Group actual usage by task type
        actual_by_type: Dict[str, List[int]] = {}
        for record in self.token_history:
            task_type = record["task_type"]
            if task_type not in actual_by_type:
                actual_by_type[task_type] = []
            actual_by_type[task_type].append(record["total_tokens"])

        # Calculate average actual vs forecast
        metrics = {}
        for task_type, actuals in actual_by_type.items():
            avg_actual = sum(actuals) / len(actuals)
            forecast = self.BASE_COSTS.get(TaskType(task_type), 0)
            error_percent = abs(avg_actual - forecast) / forecast * 100 if forecast else 0
            metrics[task_type] = {
                "avg_actual": int(avg_actual),
                "forecast": forecast,
                "error_percent": round(error_percent, 1),
                "samples": len(actuals),
            }

        return metrics

    def export_forecast_report(self, filepath: Optional[str] = None) -> str:
        """
        Export comprehensive forecast report as JSON.

        Args:
            filepath: Optional path to save report

        Returns:
            JSON string report
        """
        report = {
            "generated_at": datetime.now().isoformat(),
            "budget_tokens": self.budget_tokens,
            "forecasts_count": len(self.forecasts),
            "history_records": len(self.token_history),
            "accuracy_analysis": self.accuracy_vs_forecast(),
            "forecasts": self.forecasts,
            "history_summary": {
                "total_tokens_recorded": sum(r["total_tokens"] for r in self.token_history),
                "avg_tokens_per_task": (
                    int(sum(r["total_tokens"] for r in self.token_history) / len(self.token_history))
                    if self.token_history else 0
                ),
            },
        }

        json_report = json.dumps(report, indent=2)

        if filepath:
            Path(filepath).write_text(json_report)

        return json_report


def main():
    """Example usage of TokenForecaster."""
    forecaster = TokenForecaster(budget_tokens=100_000)

    # Example 1: Single task estimation
    print("=== Single Task Estimation ===")
    estimate = forecaster.estimate_single_task(
        task_type=TaskType.CODE_GENERATION,
        complexity=ComplexityLevel.MEDIUM,
        file_count=5,
        codebase_size_kb=500,
    )
    print(f"Task: Code Generation (Medium Complexity)")
    print(f"Estimated tokens: {estimate.total_tokens}")
    print(f"Breakdown: {estimate.breakdown}\n")

    # Example 2: Multi-task forecast
    print("=== Multi-Task Forecast ===")
    tasks = [
        (TaskType.CODE_REVIEW, ComplexityLevel.MEDIUM, {"file_count": 3}),
        (TaskType.REFACTORING, ComplexityLevel.HIGH, {"file_count": 8}),
        (TaskType.TESTING, ComplexityLevel.MEDIUM, {"file_count": 2}),
    ]
    total, estimates, summary = forecaster.forecast_multi_task(tasks, contingency_percent=20)
    print(f"Total tokens needed: {total}")
    print(f"Summary: {summary}\n")

    # Example 3: Budget check
    print("=== Budget Analysis ===")
    alert = forecaster.check_budget(tokens_needed=50_000, tokens_used=40_000)
    if alert:
        print(f"Alert: {alert.message}")
    else:
        print("Budget OK")

    # Example 4: Record actual usage
    print("\n=== Recording Actual Usage ===")
    forecaster.record_actual_usage(
        task_type=TaskType.CODE_GENERATION,
        input_tokens=1050,
        output_tokens=1200,
        complexity=ComplexityLevel.MEDIUM,
    )
    forecaster.record_actual_usage(
        task_type=TaskType.CODE_REVIEW,
        input_tokens=750,
        output_tokens=450,
        complexity=ComplexityLevel.MEDIUM,
    )
    print("Recorded 2 actual usage samples")

    # Example 5: Accuracy analysis
    print("\n=== Forecast Accuracy ===")
    accuracy = forecaster.accuracy_vs_forecast()
    print(json.dumps(accuracy, indent=2))

    # Example 6: Export report
    print("\n=== Exporting Report ===")
    report_path = "/tmp/token_forecast_report.json"
    forecaster.export_forecast_report(filepath=report_path)
    print(f"Report saved to: {report_path}")


if __name__ == "__main__":
    main()
