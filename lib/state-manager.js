/**
 * State Manager for Checkpoint/Resume Functionality
 *
 * Manages persistent state for long-running operations:
 * - Saves state to .claude/dont-stop-state.json
 * - Resumes from checkpoint
 * - Handles migration and schema changes between sessions
 */

const fs = require('fs');
const path = require('path');

const STATE_FILE = path.join(process.cwd(), '.claude', 'dont-stop-state.json');
const CLAUDE_DIR = path.join(process.cwd(), '.claude');

/**
 * State schema version - increment when making breaking changes
 * @type {number}
 */
const SCHEMA_VERSION = 1;

/**
 * Default state structure
 * @returns {Object}
 */
function createDefaultState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    goal: null,
    completedTasks: [],
    currentTask: null,
    tokenSpent: 0,
    timestamp: new Date().toISOString(),
    errorLog: [],
    metadata: {}
  };
}

/**
 * Initialize .claude directory if it doesn't exist
 */
function ensureClaudeDir() {
  if (!fs.existsSync(CLAUDE_DIR)) {
    fs.mkdirSync(CLAUDE_DIR, { recursive: true });
  }
}

/**
 * Save state to checkpoint file
 * @param {Object} state - State object to save
 * @throws {Error} If write fails
 */
function saveState(state) {
  ensureClaudeDir();

  const stateToSave = {
    ...state,
    timestamp: new Date().toISOString()
  };

  try {
    fs.writeFileSync(
      STATE_FILE,
      JSON.stringify(stateToSave, null, 2),
      'utf8'
    );
  } catch (error) {
    throw new Error(`Failed to save state: ${error.message}`);
  }
}

/**
 * Load state from checkpoint file
 * @returns {Object|null} Loaded state or null if doesn't exist
 * @throws {Error} If read fails or file is corrupted
 */
function loadState() {
  if (!fs.existsSync(STATE_FILE)) {
    return null;
  }

  try {
    const content = fs.readFileSync(STATE_FILE, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to load state: ${error.message}`);
  }
}

/**
 * Migrate state from older schema versions
 * @param {Object} state - State object to migrate
 * @returns {Object} Migrated state
 */
function migrateState(state) {
  const schemaVersion = state.schemaVersion || 0;

  if (schemaVersion === SCHEMA_VERSION) {
    return state;
  }

  let migratedState = { ...state };

  // Version 0 -> 1: Add errorLog and metadata if missing
  if (schemaVersion < 1) {
    migratedState = {
      ...migratedState,
      schemaVersion: 1,
      errorLog: migratedState.errorLog || [],
      metadata: migratedState.metadata || {}
    };
  }

  return migratedState;
}

/**
 * Verify state consistency
 * @param {Object} state - State to verify
 * @returns {Object} Verification result { valid: boolean, errors: string[] }
 */
function verifyState(state) {
  const errors = [];

  if (!state) {
    errors.push('State is null or undefined');
    return { valid: false, errors };
  }

  if (typeof state.goal !== 'string' && state.goal !== null) {
    errors.push('goal must be a string or null');
  }

  if (!Array.isArray(state.completedTasks)) {
    errors.push('completedTasks must be an array');
  }

  if (state.currentTask !== null && typeof state.currentTask !== 'object') {
    errors.push('currentTask must be an object or null');
  }

  if (typeof state.tokenSpent !== 'number' || state.tokenSpent < 0) {
    errors.push('tokenSpent must be a non-negative number');
  }

  if (!Array.isArray(state.errorLog)) {
    errors.push('errorLog must be an array');
  }

  if (typeof state.timestamp !== 'string') {
    errors.push('timestamp must be a string');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Initialize new session state
 * @param {string} goal - The goal/objective for this session
 * @returns {Object} New state object
 */
function initializeState(goal) {
  return {
    ...createDefaultState(),
    goal
  };
}

/**
 * Resume from checkpoint
 * @returns {Object|null} Loaded and migrated state, or null if no checkpoint exists
 * @throws {Error} If state is corrupted or verification fails
 */
function resume() {
  const state = loadState();

  if (!state) {
    return null;
  }

  const migratedState = migrateState(state);
  const verification = verifyState(migratedState);

  if (!verification.valid) {
    throw new Error(
      `State verification failed:\n${verification.errors.join('\n')}`
    );
  }

  return migratedState;
}

/**
 * Add completed task to state
 * @param {Object} state - State object
 * @param {Object} task - Task object
 * @returns {Object} Updated state
 */
function addCompletedTask(state, task) {
  return {
    ...state,
    completedTasks: [
      ...state.completedTasks,
      {
        ...task,
        completedAt: new Date().toISOString()
      }
    ]
  };
}

/**
 * Update current task in state
 * @param {Object} state - State object
 * @param {Object|null} task - Task object or null to clear
 * @returns {Object} Updated state
 */
function setCurrentTask(state, task) {
  return {
    ...state,
    currentTask: task ? { ...task, startedAt: new Date().toISOString() } : null
  };
}

/**
 * Add tokens spent to state
 * @param {Object} state - State object
 * @param {number} tokens - Number of tokens
 * @returns {Object} Updated state
 */
function addTokens(state, tokens) {
  if (typeof tokens !== 'number' || tokens < 0) {
    throw new Error('tokens must be a non-negative number');
  }

  return {
    ...state,
    tokenSpent: state.tokenSpent + tokens
  };
}

/**
 * Log error to state
 * @param {Object} state - State object
 * @param {Error|string} error - Error to log
 * @param {string} context - Context about the error
 * @returns {Object} Updated state
 */
function logError(state, error, context = '') {
  const errorEntry = {
    timestamp: new Date().toISOString(),
    context,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined
  };

  return {
    ...state,
    errorLog: [...state.errorLog, errorEntry]
  };
}

/**
 * Get progress summary
 * @param {Object} state - State object
 * @returns {Object} Progress summary
 */
function getProgress(state) {
  return {
    goal: state.goal,
    totalCompleted: state.completedTasks.length,
    currentTask: state.currentTask ? state.currentTask.name || state.currentTask.id : null,
    tokensSpent: state.tokenSpent,
    errors: state.errorLog.length,
    sessionDuration: state.timestamp ?
      new Date(Date.now() - new Date(state.timestamp).getTime()).toISOString() :
      null
  };
}

/**
 * Clear checkpoint (delete state file)
 */
function clearCheckpoint() {
  if (fs.existsSync(STATE_FILE)) {
    fs.unlinkSync(STATE_FILE);
  }
}

/**
 * Export state to JSON string
 * @param {Object} state - State object
 * @returns {string} JSON representation
 */
function exportState(state) {
  return JSON.stringify(state, null, 2);
}

/**
 * Get checkpoint file path
 * @returns {string} Full path to checkpoint file
 */
function getCheckpointPath() {
  return STATE_FILE;
}

/**
 * Check if checkpoint exists
 * @returns {boolean}
 */
function checkpointExists() {
  return fs.existsSync(STATE_FILE);
}

module.exports = {
  // Core operations
  saveState,
  loadState,
  resume,

  // Initialization
  initializeState,
  createDefaultState,

  // State updates
  addCompletedTask,
  setCurrentTask,
  addTokens,
  logError,

  // Utilities
  verifyState,
  migrateState,
  getProgress,
  clearCheckpoint,
  exportState,
  getCheckpointPath,
  checkpointExists,
  ensureClaudeDir,

  // Constants
  SCHEMA_VERSION,
  STATE_FILE
};
