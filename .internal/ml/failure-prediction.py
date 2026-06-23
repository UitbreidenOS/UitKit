#!/usr/bin/env python3
"""
Failure Prediction System for Task Execution

Analyzes task parameters and historical execution data to predict failure probability.
Alerts when failure risk exceeds 60% and suggests alternatives.
"""

import json
import sqlite3
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import Optional, List, Dict, Tuple
from datetime import datetime, timedelta
import hashlib
from enum import Enum


class TaskStatus(Enum):
    """Task execution outcomes."""
    SUCCESS = "success"
    FAILURE = "failure"
    TIMEOUT = "timeout"
    CANCELLED = "cancelled"


@dataclass
class TaskRecord:
    """Historical task execution record."""
    task_id: str
    task_type: str
    parameters: Dict
    status: str
    duration_seconds: float
    timestamp: str
    error_category: Optional[str] = None
    retry_count: int = 0


@dataclass
class FailurePrediction:
    """Failure prediction result."""
    failure_probability: float
    risk_level: str  # "low", "medium", "high"
    primary_risk_factors: List[str]
    similar_failures: int
    success_rate: float
    confidence_score: float
    suggested_alternatives: List[str]
    recommendation: str


class FailurePredictor:
    """ML-based task failure predictor."""

    def __init__(self, db_path: Optional[str] = None):
        """Initialize predictor with historical data store."""
        if db_path is None:
            db_path = str(Path.home() / ".claude" / "task_history.db")

        self.db_path = db_path
        self._init_db()

    def _init_db(self) -> None:
        """Initialize SQLite database for task history."""
        Path(self.db_path).parent.mkdir(parents=True, exist_ok=True)

        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS task_executions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                task_id TEXT NOT NULL,
                task_type TEXT NOT NULL,
                parameters TEXT NOT NULL,
                status TEXT NOT NULL,
                duration_seconds REAL NOT NULL,
                error_category TEXT,
                retry_count INTEGER DEFAULT 0,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)

        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_task_type_status
            ON task_executions(task_type, status)
        """)

        cursor.execute("""
            CREATE INDEX IF NOT EXISTS idx_timestamp
            ON task_executions(timestamp)
        """)

        conn.commit()
        conn.close()

    def log_execution(self, record: TaskRecord) -> None:
        """Log a task execution to history."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO task_executions
            (task_id, task_type, parameters, status, duration_seconds,
             error_category, retry_count, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            record.task_id,
            record.task_type,
            json.dumps(record.parameters),
            record.status,
            record.duration_seconds,
            record.error_category,
            record.retry_count,
            record.timestamp or datetime.now().isoformat()
        ))

        conn.commit()
        conn.close()

    def predict(self, task_type: str, parameters: Dict,
                task_id: Optional[str] = None) -> FailurePrediction:
        """
        Predict failure probability for a task.

        Args:
            task_type: Type/category of the task
            parameters: Task configuration parameters
            task_id: Optional identifier for this specific task

        Returns:
            FailurePrediction with probability, risk factors, and recommendations
        """
        if task_id is None:
            task_id = self._generate_task_id(task_type, parameters)

        # Fetch historical data
        history = self._get_task_history(task_type, lookback_days=30)

        # Calculate base metrics
        base_failure_rate = self._calculate_base_failure_rate(history)

        # Identify risk factors
        risk_factors = self._analyze_risk_factors(
            task_type, parameters, history
        )

        # Calculate adjusted probability
        failure_probability = self._calculate_adjusted_probability(
            base_failure_rate, risk_factors
        )

        # Determine risk level
        risk_level = self._assess_risk_level(failure_probability)

        # Find similar historical failures
        similar_failures = self._find_similar_failures(task_type, parameters)

        # Calculate confidence in prediction
        confidence = self._calculate_confidence(len(history), len(risk_factors))

        # Get success rate for this task type
        success_rate = 1.0 - base_failure_rate if history else 0.5

        # Generate suggestions
        suggestions = self._generate_alternatives(
            task_type, risk_factors, similar_failures
        )

        # Create recommendation
        recommendation = self._create_recommendation(
            failure_probability, risk_factors, success_rate
        )

        return FailurePrediction(
            failure_probability=failure_probability,
            risk_level=risk_level,
            primary_risk_factors=risk_factors[:3],
            similar_failures=len(similar_failures),
            success_rate=success_rate,
            confidence_score=confidence,
            suggested_alternatives=suggestions,
            recommendation=recommendation
        )

    def _get_task_history(self, task_type: str,
                          lookback_days: int = 30) -> List[TaskRecord]:
        """Retrieve recent execution history for task type."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cutoff_date = (datetime.now() - timedelta(days=lookback_days)).isoformat()

        cursor.execute("""
            SELECT task_id, task_type, parameters, status, duration_seconds,
                   error_category, retry_count, timestamp
            FROM task_executions
            WHERE task_type = ? AND timestamp >= ?
            ORDER BY timestamp DESC
        """, (task_type, cutoff_date))

        rows = cursor.fetchall()
        conn.close()

        records = []
        for row in rows:
            records.append(TaskRecord(
                task_id=row[0],
                task_type=row[1],
                parameters=json.loads(row[2]),
                status=row[3],
                duration_seconds=row[4],
                error_category=row[5],
                retry_count=row[6],
                timestamp=row[7]
            ))

        return records

    def _calculate_base_failure_rate(self, history: List[TaskRecord]) -> float:
        """Calculate baseline failure rate from history."""
        if not history:
            return 0.2  # Default 20% failure rate if no history

        failures = sum(1 for r in history if r.status == TaskStatus.FAILURE.value)
        return failures / len(history)

    def _analyze_risk_factors(self, task_type: str, parameters: Dict,
                             history: List[TaskRecord]) -> List[str]:
        """Identify risk factors in task configuration."""
        risk_factors = []

        # Check parameter complexity
        param_count = len(parameters)
        if param_count > 10:
            risk_factors.append(f"high_complexity_{param_count}_params")

        # Check for timeout-prone patterns
        if parameters.get("timeout_seconds", 0) > 3600:
            risk_factors.append("long_timeout_risk")

        # Check for resource constraints
        if parameters.get("max_retries", 0) == 0:
            risk_factors.append("no_retry_configured")

        if parameters.get("memory_mb", 0) < 512:
            risk_factors.append("low_memory_allocation")

        # Check for dependency patterns
        dependencies = parameters.get("dependencies", [])
        if len(dependencies) > 5:
            risk_factors.append("high_dependency_chain")

        # Analyze similar tasks in history
        if history:
            error_types = {}
            for record in history:
                if record.status == TaskStatus.FAILURE.value:
                    error_cat = record.error_category or "unknown"
                    error_types[error_cat] = error_types.get(error_cat, 0) + 1

            if error_types:
                most_common = max(error_types, key=error_types.get)
                risk_factors.append(f"recurring_{most_common}")

        # Check for retry patterns
        if history:
            avg_retries = sum(r.retry_count for r in history) / len(history)
            if avg_retries > 2:
                risk_factors.append("high_retry_pattern")

        return risk_factors

    def _calculate_adjusted_probability(self, base_rate: float,
                                       risk_factors: List[str]) -> float:
        """Calculate failure probability adjusted by risk factors."""
        probability = base_rate

        # Weight each risk factor
        factor_weights = {
            "high_complexity": 0.08,
            "long_timeout_risk": 0.05,
            "no_retry_configured": 0.12,
            "low_memory_allocation": 0.15,
            "high_dependency_chain": 0.10,
            "recurring_": 0.20,
            "high_retry_pattern": 0.10
        }

        for factor in risk_factors:
            for key, weight in factor_weights.items():
                if key in factor:
                    probability += weight
                    break

        # Cap at 0.99 (never predict absolute certainty)
        return min(probability, 0.99)

    def _assess_risk_level(self, probability: float) -> str:
        """Categorize risk level based on probability."""
        if probability < 0.3:
            return "low"
        elif probability < 0.6:
            return "medium"
        else:
            return "high"

    def _find_similar_failures(self, task_type: str,
                              parameters: Dict) -> List[TaskRecord]:
        """Find historical failures with similar parameters."""
        history = self._get_task_history(task_type, lookback_days=90)

        failures = [r for r in history if r.status == TaskStatus.FAILURE.value]

        # Score similarity based on parameter overlap
        scored_failures = []
        for failure in failures:
            similarity = self._parameter_similarity(
                parameters, failure.parameters
            )
            scored_failures.append((similarity, failure))

        # Return top 5 most similar failures
        scored_failures.sort(key=lambda x: x[0], reverse=True)
        return [f[1] for f in scored_failures[:5]]

    def _parameter_similarity(self, params1: Dict, params2: Dict) -> float:
        """Calculate parameter similarity score."""
        if not params1 or not params2:
            return 0.0

        common_keys = set(params1.keys()) & set(params2.keys())
        if not common_keys:
            return 0.0

        matches = sum(1 for k in common_keys if params1[k] == params2[k])
        return matches / len(common_keys)

    def _calculate_confidence(self, history_size: int,
                            factor_count: int) -> float:
        """Calculate confidence in prediction."""
        # More history = higher confidence
        history_confidence = min(history_size / 100, 1.0)

        # Multiple corroborating factors = higher confidence
        factor_confidence = min(factor_count / 5, 1.0)

        # Average of both signals
        return (history_confidence + factor_confidence) / 2

    def _generate_alternatives(self, task_type: str,
                              risk_factors: List[str],
                              similar_failures: List[TaskRecord]) -> List[str]:
        """Generate alternative approaches."""
        suggestions = []

        # Based on risk factors
        if "no_retry_configured" in risk_factors:
            suggestions.append("Enable retry mechanism with exponential backoff")

        if "low_memory_allocation" in risk_factors:
            suggestions.append("Increase memory allocation to 1024MB minimum")

        if "high_dependency_chain" in risk_factors:
            suggestions.append("Parallelize independent subtasks")

        if "high_complexity" in str(risk_factors):
            suggestions.append("Break down into smaller, focused tasks")

        if "long_timeout_risk" in risk_factors:
            suggestions.append("Implement intermediate checkpoints")

        # Based on similar failures
        if similar_failures:
            error_types = {}
            for failure in similar_failures:
                cat = failure.error_category or "unknown"
                error_types[cat] = error_types.get(cat, 0) + 1

            most_common_error = max(error_types, key=error_types.get)
            suggestions.append(f"Address recurring '{most_common_error}' errors")

        # Default suggestions
        if not suggestions:
            suggestions.append("Add comprehensive error handling and logging")
            suggestions.append("Implement health checks before execution")

        return suggestions[:4]  # Return top 4

    def _create_recommendation(self, probability: float,
                             risk_factors: List[str],
                             success_rate: float) -> str:
        """Create human-readable recommendation."""
        if probability >= 0.60:
            if success_rate < 0.3:
                return "ALERT: Do not execute. Redesign task or fix recurring issues first."
            else:
                return f"HIGH RISK ({probability:.0%} failure predicted). Execute with caution and manual monitoring."
        elif probability >= 0.40:
            return f"MEDIUM RISK ({probability:.0%} failure predicted). Review risk factors and apply suggested mitigations."
        elif probability >= 0.20:
            return f"LOW-MEDIUM RISK ({probability:.0%} failure predicted). Standard monitoring recommended."
        else:
            return f"LOW RISK ({probability:.0%} failure predicted). Safe to execute."

    def _generate_task_id(self, task_type: str, parameters: Dict) -> str:
        """Generate deterministic task ID from type and parameters."""
        combined = f"{task_type}:{json.dumps(parameters, sort_keys=True)}"
        return hashlib.sha256(combined.encode()).hexdigest()[:12]

    def batch_predict(self, tasks: List[Tuple[str, Dict]]) -> Dict[str, FailurePrediction]:
        """Predict failures for multiple tasks."""
        predictions = {}
        for task_type, parameters in tasks:
            prediction = self.predict(task_type, parameters)
            task_id = self._generate_task_id(task_type, parameters)
            predictions[task_id] = prediction
        return predictions

    def export_analysis(self, output_path: str) -> None:
        """Export prediction analysis to JSON."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT task_type, COUNT(*) as count,
                   SUM(CASE WHEN status = 'failure' THEN 1 ELSE 0 END) as failures
            FROM task_executions
            GROUP BY task_type
            ORDER BY count DESC
        """)

        analysis = {
            "generated_at": datetime.now().isoformat(),
            "task_types": []
        }

        for row in cursor.fetchall():
            task_type, count, failures = row
            failure_rate = failures / count if count > 0 else 0
            analysis["task_types"].append({
                "type": task_type,
                "total_executions": count,
                "failures": failures,
                "failure_rate": failure_rate
            })

        conn.close()

        with open(output_path, "w") as f:
            json.dump(analysis, f, indent=2)


def main():
    """CLI interface for failure prediction."""
    import argparse
    import sys

    parser = argparse.ArgumentParser(
        description="Predict task failure probability"
    )
    parser.add_argument("task_type", help="Type of task to predict")
    parser.add_argument("--params", type=str, default="{}",
                       help="Task parameters as JSON")
    parser.add_argument("--log", type=str, help="Log a task execution")
    parser.add_argument("--status", type=str,
                       choices=["success", "failure", "timeout"],
                       help="Execution status for logging")
    parser.add_argument("--error", type=str, help="Error category for failures")
    parser.add_argument("--duration", type=float, help="Execution duration in seconds")
    parser.add_argument("--export", type=str, help="Export analysis to file")
    parser.add_argument("--db", type=str, help="Path to history database")

    args = parser.parse_args()

    predictor = FailurePredictor(db_path=args.db)

    if args.log:
        # Log an execution
        record = TaskRecord(
            task_id=args.log,
            task_type=args.task_type,
            parameters=json.loads(args.params),
            status=args.status or "unknown",
            duration_seconds=args.duration or 0.0,
            error_category=args.error,
            timestamp=datetime.now().isoformat()
        )
        predictor.log_execution(record)
        print(f"Logged: {args.task_type} -> {args.status}")
        return

    if args.export:
        predictor.export_analysis(args.export)
        print(f"Analysis exported to {args.export}")
        return

    # Predict failure
    params = json.loads(args.params)
    prediction = predictor.predict(args.task_type, params)

    # Output
    result = {
        "failure_probability": prediction.failure_probability,
        "risk_level": prediction.risk_level,
        "primary_risk_factors": prediction.primary_risk_factors,
        "success_rate": prediction.success_rate,
        "confidence_score": prediction.confidence_score,
        "similar_failures": prediction.similar_failures,
        "suggested_alternatives": prediction.suggested_alternatives,
        "recommendation": prediction.recommendation
    }

    print(json.dumps(result, indent=2))

    # Alert if high risk
    if prediction.failure_probability >= 0.60:
        print("\n⚠️  FAILURE ALERT: High risk of task failure (>60%)", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
