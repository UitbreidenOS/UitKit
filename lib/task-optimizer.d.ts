/**
 * TaskOptimizer - ML-Based Adaptive Task Sequencing
 * Type definitions for TypeScript
 */

export interface TaskOptimizerOptions {
  /**
   * localStorage key for persistence
   * @default 'task-optimizer-data'
   */
  storageKey?: string;

  /**
   * Confidence score cutoff (0-1)
   * @default 0.6
   */
  confidenceThreshold?: number;

  /**
   * Exponential decay factor for old data (0-1)
   * @default 0.95
   */
  decayFactor?: number;

  /**
   * Minimum attempts before confidence estimation
   * @default 3
   */
  minSamples?: number;

  [key: string]: any;
}

export interface TaskMetadata {
  /**
   * Human-readable task name
   */
  name?: string;

  /**
   * Task category for grouping
   */
  category?: string;

  /**
   * Available execution strategies
   */
  approaches?: string[];

  /**
   * Expected duration in milliseconds
   */
  estimatedDuration?: number | null;

  [key: string]: any;
}

export interface TaskRecord {
  /**
   * Unique task identifier
   */
  id: string;

  /**
   * Human-readable name
   */
  name: string;

  /**
   * Task category
   */
  category: string;

  /**
   * Expected duration in milliseconds
   */
  estimatedDuration: number | null;

  /**
   * Available approaches
   */
  approaches: string[];

  /**
   * Total execution attempts
   */
  attempts: number;

  /**
   * Successful executions
   */
  successes: number;

  /**
   * Failed executions
   */
  failures: number;

  /**
   * Sum of all execution durations
   */
  totalDuration: number;

  /**
   * Timestamp of last execution attempt
   */
  lastAttempt: number | null;

  /**
   * Failure patterns (errors and their frequency)
   */
  failurePatterns: FailurePattern[];

  /**
   * Task creation timestamp
   */
  createdAt: number;

  /**
   * Custom metadata
   */
  metadata: TaskMetadata;
}

export interface ExecutionResult {
  /**
   * Whether task succeeded
   */
  success: boolean;

  /**
   * Execution time in milliseconds
   */
  duration: number;

  /**
   * Which approach was used
   */
  approach?: string;

  /**
   * Error message if failed
   */
  error?: string | null;

  /**
   * Custom execution metadata
   */
  metadata?: Record<string, any>;
}

export interface HistoryRecord {
  /**
   * Task identifier
   */
  taskId: string;

  /**
   * Execution timestamp
   */
  timestamp: number;

  /**
   * Whether task succeeded
   */
  success: boolean;

  /**
   * Execution time in milliseconds
   */
  duration: number;

  /**
   * Approach used
   */
  approach: string;

  /**
   * Error message if failed
   */
  error: string | null;

  /**
   * Custom metadata
   */
  metadata: Record<string, any>;
}

export interface ConfidenceScore {
  /**
   * Confidence value (0-1)
   */
  score: number;

  /**
   * Factors contributing to score
   */
  factors: {
    successRate: number;
    samples: number;
    recencyWeight: number;
  };
}

export interface DurationEstimate {
  /**
   * Estimated duration in milliseconds
   */
  estimate: number | null;

  /**
   * Confidence in estimate (0-1)
   */
  confidence: number;

  /**
   * Breakdown of calculation
   */
  breakdown: {
    avgDuration: number | null;
    samples: number;
    total: number;
  };
}

export interface SequenceTask extends TaskRecord {
  /**
   * Confidence score for this task
   */
  confidence: number;

  /**
   * Duration estimate
   */
  durationEstimate: DurationEstimate;
}

export interface CompletionEstimate {
  /**
   * Total duration if run sequentially (milliseconds)
   */
  sequential: number;

  /**
   * Duration with parallelism (milliseconds)
   */
  parallel: number;

  /**
   * Parallelism level used
   */
  parallelism: number;

  /**
   * Average confidence across tasks
   */
  avgConfidence: number;

  /**
   * Number of tasks in estimate
   */
  taskCount: number;

  /**
   * Per-task breakdown
   */
  breakdown: Array<{
    id: string;
    name: string;
    duration: number | null;
    confidence: number;
  }>;
}

export interface ApproachSuggestion {
  /**
   * Suggested approach name
   */
  approach: string;

  /**
   * Historical success rate (0-1)
   */
  successRate: number;

  /**
   * Average execution duration
   */
  avgDuration: number;

  /**
   * Number of times attempted
   */
  attempts: number;

  /**
   * Confidence in recommendation (0-1)
   */
  confidence: number;

  /**
   * Reason for suggestion
   */
  reason: string;
}

export interface FailurePattern {
  /**
   * Error message/type
   */
  error: string;

  /**
   * Which approach produced this error
   */
  approach: string;

  /**
   * Frequency of occurrence
   */
  count: number;

  /**
   * First occurrence timestamp
   */
  firstOccurrence: number;

  /**
   * Most recent occurrence timestamp
   */
  lastOccurrence: number;
}

export interface SuccessPrediction {
  /**
   * Predicted success probability (0-1)
   */
  prediction: number;

  /**
   * Contributing factors and weights
   */
  factors: {
    baseSuccessRate: number;
    recentPerformance: number;
    categoryPerformance: number;
    confidence: number;
  };
}

export interface TaskAnalytics {
  /**
   * Task identifier
   */
  taskId: string;

  /**
   * Task name
   */
  name: string;

  /**
   * Task category
   */
  category: string;

  /**
   * Execution statistics
   */
  statistics: {
    totalAttempts: number;
    successes: number;
    failures: number;
    successRate: number;
    avgDuration: number;
    lastAttempt: number | null;
  };

  /**
   * Overall confidence score
   */
  confidence: number;

  /**
   * Duration estimation
   */
  durationEstimate: DurationEstimate;

  /**
   * Frequent failure patterns
   */
  failurePatterns: FailurePattern[];

  /**
   * Recent execution records
   */
  recentAttempts: Array<{
    timestamp: number;
    success: boolean;
    duration: number;
    approach: string;
    error: string | null;
  }>;

  /**
   * Suggested alternative approaches
   */
  suggestedApproaches: ApproachSuggestion[];
}

export interface ModelExport {
  /**
   * Model version
   */
  version: string;

  /**
   * Export timestamp
   */
  exportedAt: number;

  /**
   * Model configuration
   */
  config: TaskOptimizerOptions;

  /**
   * All tracked tasks
   */
  tasks: TaskRecord[];

  /**
   * Total history record count
   */
  historySize: number;

  /**
   * Last 100 history records
   */
  historySnapshot: HistoryRecord[];
}

/**
 * TaskOptimizer - ML-Based Adaptive Task Sequencing
 *
 * Learns task success rates, typical durations, and failure patterns.
 * Reorders tasks by confidence score, estimates completion time, and
 * suggests alternative approaches based on failure history.
 */
export class TaskOptimizer {
  /**
   * Initialize optimizer with options
   */
  constructor(options?: TaskOptimizerOptions);

  /**
   * Register a task or retrieve existing task
   */
  registerTask(taskId: string, metadata?: TaskMetadata): TaskRecord;

  /**
   * Record task execution result
   */
  recordResult(taskId: string, result: ExecutionResult): HistoryRecord;

  /**
   * Calculate confidence score (0-1) based on success rate and recency
   */
  calculateConfidenceScore(taskId: string): number;

  /**
   * Estimate task duration based on historical execution times
   */
  estimateDuration(taskId: string): DurationEstimate;

  /**
   * Get all tasks ordered by confidence (highest first)
   */
  getOptimalSequence(taskIds?: string[]): SequenceTask[];

  /**
   * Estimate total workflow completion time
   */
  estimateCompletion(taskIds?: string[], parallelism?: number): CompletionEstimate;

  /**
   * Suggest alternative approaches based on failure history
   */
  suggestAlternativeApproach(taskId: string, currentApproach?: string): ApproachSuggestion[];

  /**
   * Get failure patterns sorted by frequency
   */
  getFailurePatterns(taskId: string): FailurePattern[];

  /**
   * Predict likelihood of task success
   */
  predictSuccess(taskId: string, context?: Record<string, any>): SuccessPrediction;

  /**
   * Get comprehensive task analytics
   */
  getTaskAnalytics(taskId: string): TaskAnalytics | null;

  /**
   * Export model for analysis or transfer
   */
  exportModel(): ModelExport;

  /**
   * Persist data to storage
   */
  save(): void;

  /**
   * Load data from storage
   */
  load(): void;

  /**
   * Reset all data
   */
  reset(): void;

  /**
   * All registered tasks
   */
  tasks: Map<string, TaskRecord>;

  /**
   * Execution history
   */
  history: HistoryRecord[];

  /**
   * Current model version
   */
  modelVersion: string;

  /**
   * Optimizer configuration
   */
  config: Required<TaskOptimizerOptions>;
}

export default TaskOptimizer;
