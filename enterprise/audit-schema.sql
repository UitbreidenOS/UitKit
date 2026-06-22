-- audit-schema.sql — Append-only audit trail for swarm-sandbox events
-- Designed for compliance, forensics, and immutable event logging
-- Supports: SOC 2 Type II, HIPAA, GDPR, PCI DSS

-- ============================================================================
-- AUDIT EVENTS TABLE
-- ============================================================================
-- Core audit log for all swarm sandbox activities
CREATE TABLE IF NOT EXISTS audit_events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    -- Core identifiers
    event_id VARCHAR(64) UNIQUE NOT NULL,  -- UUID for distributed tracing
    session_id VARCHAR(64) NOT NULL,       -- Links to session
    agent_id VARCHAR(128),                 -- Which agent (if applicable)
    topology_id VARCHAR(128),              -- Swarm topology name

    -- Timestamp (UTC, immutable after insert)
    event_timestamp TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    recorded_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    -- Event classification
    event_type ENUM(
        'agent_spawn',
        'agent_terminate',
        'agent_state_change',
        'message_sent',
        'message_received',
        'tool_call',
        'tool_result',
        'topology_start',
        'topology_stop',
        'topology_error',
        'permission_check',
        'rate_limit_hit',
        'resource_warning',
        'pii_detected',
        'security_violation',
        'config_change',
        'deployment',
        'health_check',
        'circuit_breaker',
        'retry_attempt',
        'timeout'
    ) NOT NULL,

    -- Severity and impact
    severity ENUM('INFO', 'WARNING', 'ERROR', 'CRITICAL') NOT NULL DEFAULT 'INFO',

    -- User information
    user_id VARCHAR(255),                  -- Email or user identifier
    user_email VARCHAR(255),               -- Sanitized user email
    api_key_id VARCHAR(64),                -- Which API key was used

    -- Request context
    request_id VARCHAR(64),                -- Parent request ID
    correlation_id VARCHAR(64),            -- For tracing distributed calls

    -- Event details (JSON for extensibility)
    event_data JSON NOT NULL DEFAULT '{}',

    -- Message flow (for inter-agent communication)
    message_from VARCHAR(128),             -- Source agent/service
    message_to VARCHAR(128),               -- Destination agent/service
    message_id VARCHAR(64),                -- Message UUID
    message_size_bytes INT,                -- Payload size

    -- Tool execution metadata
    tool_name VARCHAR(128),                -- Tool that was called
    tool_input_hash VARCHAR(64),           -- SHA256 of sanitized input
    tool_output_hash VARCHAR(64),          -- SHA256 of sanitized output
    tool_duration_ms INT,                  -- Execution time
    tool_exit_code INT,                    -- Exit code (0 = success)

    -- Resource metrics at time of event
    cpu_usage_percent DECIMAL(5,2),
    memory_usage_bytes BIGINT,
    agent_count INT,
    message_queue_depth INT,

    -- Compliance and security flags
    compliance_flags JSON,                 -- e.g., {pii_detected, encryption_mismatch, policy_violation}
    security_flags JSON,                   -- e.g., {rate_limited, unauthorized_access, suspicious_pattern}

    -- Environment metadata
    git_branch VARCHAR(255),
    git_commit_hash VARCHAR(40),
    deployment_env ENUM('sandbox', 'staging', 'production') DEFAULT 'sandbox',
    region VARCHAR(50),
    cluster_id VARCHAR(128),

    -- Indexes for common queries
    INDEX idx_session_id (session_id),
    INDEX idx_event_timestamp (event_timestamp),
    INDEX idx_event_type (event_type),
    INDEX idx_user_id (user_id),
    INDEX idx_agent_id (agent_id),
    INDEX idx_topology_id (topology_id),
    INDEX idx_severity (severity),
    INDEX idx_correlation_id (correlation_id),
    INDEX idx_user_timestamp (user_id, event_timestamp),
    INDEX idx_type_timestamp (event_type, event_timestamp),

    -- Fulltext search on event data
    FULLTEXT INDEX ft_event_data (event_data)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SESSION TABLE
-- ============================================================================
-- Tracks sandbox sessions, enabling user activity correlation
CREATE TABLE IF NOT EXISTS audit_sessions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_id VARCHAR(64) UNIQUE NOT NULL,

    -- Session metadata
    user_id VARCHAR(255) NOT NULL,
    user_email VARCHAR(255),
    started_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    ended_at TIMESTAMP(6),
    duration_ms BIGINT,

    -- Session context
    client_ip VARCHAR(45),                 -- IPv4 or IPv6
    user_agent VARCHAR(500),

    -- Sandbox session info
    topology_name VARCHAR(128),
    deployment_env ENUM('sandbox', 'staging', 'production'),

    -- Compliance
    mfa_verified BOOLEAN DEFAULT FALSE,
    encryption_enabled BOOLEAN DEFAULT TRUE,
    data_classification ENUM('public', 'internal', 'confidential', 'restricted') DEFAULT 'internal',

    -- Audit summary
    event_count INT DEFAULT 0,
    error_count INT DEFAULT 0,
    pii_events_count INT DEFAULT 0,
    security_violations_count INT DEFAULT 0,

    INDEX idx_user_id (user_id),
    INDEX idx_started_at (started_at),
    INDEX idx_session_id (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- AGENT STATE HISTORY TABLE
-- ============================================================================
-- Immutable log of agent state transitions for forensics
CREATE TABLE IF NOT EXISTS audit_agent_states (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    event_id VARCHAR(64) NOT NULL,
    session_id VARCHAR(64) NOT NULL,
    agent_id VARCHAR(128) NOT NULL,

    -- State transition
    state_from ENUM(
        'initializing', 'idle', 'executing', 'waiting',
        'error', 'terminated', 'paused', 'draining'
    ),
    state_to ENUM(
        'initializing', 'idle', 'executing', 'waiting',
        'error', 'terminated', 'paused', 'draining'
    ) NOT NULL,

    timestamp TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    -- Context
    reason VARCHAR(500),                   -- Why did state change occur
    error_message VARCHAR(1000),

    -- Metrics at time of change
    task_id VARCHAR(128),
    queue_depth_before INT,
    queue_depth_after INT,
    processing_time_ms INT,

    INDEX idx_agent_id (agent_id),
    INDEX idx_session_id (session_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_state_to (state_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- MESSAGE FLOW TABLE
-- ============================================================================
-- Detailed inter-agent message logging for debugging and compliance
CREATE TABLE IF NOT EXISTS audit_messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    event_id VARCHAR(64) UNIQUE NOT NULL,
    session_id VARCHAR(64) NOT NULL,

    -- Message metadata
    message_id VARCHAR(64) NOT NULL,
    timestamp TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    -- Routing
    from_agent VARCHAR(128) NOT NULL,
    to_agent VARCHAR(128) NOT NULL,
    route_path VARCHAR(500),               -- If routed through intermediaries

    -- Content
    message_type ENUM('request', 'response', 'event', 'broadcast') NOT NULL,
    payload_size_bytes INT,
    payload_hash VARCHAR(64),              -- SHA256 of sanitized payload

    -- Delivery
    delivery_status ENUM('sent', 'received', 'acked', 'failed', 'timeout', 'dropped'),
    delivery_timestamp TIMESTAMP(6),
    delivery_latency_ms INT,

    -- Retry tracking
    retry_count INT DEFAULT 0,
    last_retry_at TIMESTAMP(6),

    -- PII detection
    pii_detected BOOLEAN DEFAULT FALSE,
    encryption_used VARCHAR(50),           -- e.g., 'AES-256-GCM', 'TLS1.3'

    INDEX idx_session_id (session_id),
    INDEX idx_from_agent (from_agent),
    INDEX idx_to_agent (to_agent),
    INDEX idx_timestamp (timestamp),
    INDEX idx_delivery_status (delivery_status),
    INDEX idx_pii_detected (pii_detected)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- COMPLIANCE VIOLATIONS TABLE
-- ============================================================================
-- Immutable record of all compliance/security violations for investigation
CREATE TABLE IF NOT EXISTS audit_violations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    violation_id VARCHAR(64) UNIQUE NOT NULL,

    -- Event reference
    event_id VARCHAR(64) NOT NULL,
    session_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(255) NOT NULL,

    timestamp TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    -- Violation classification
    violation_type ENUM(
        'pii_exposure',
        'unauthorized_access',
        'rate_limit_exceeded',
        'permission_denied',
        'encryption_mismatch',
        'data_retention_violation',
        'policy_violation',
        'suspicious_behavior',
        'compliance_breach',
        'audit_tampering_attempt'
    ) NOT NULL,

    severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM',

    -- Details
    description VARCHAR(1000),
    evidence JSON,                         -- What triggered the violation

    -- Response
    action_taken ENUM('logged', 'alert_sent', 'rate_limited', 'access_denied', 'session_terminated'),
    notification_sent_at TIMESTAMP(6),
    notification_channel VARCHAR(100),     -- 'email', 'slack', 'pagerduty', etc.

    -- Investigation
    resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP(6),
    resolution_notes VARCHAR(1000),
    investigator_id VARCHAR(255),

    INDEX idx_user_id (user_id),
    INDEX idx_violation_type (violation_type),
    INDEX idx_severity (severity),
    INDEX idx_timestamp (timestamp),
    INDEX idx_resolved (resolved)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TOOL CALL AUDIT TABLE
-- ============================================================================
-- Detailed audit of all tool executions with input/output hashing
CREATE TABLE IF NOT EXISTS audit_tool_calls (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    event_id VARCHAR(64) UNIQUE NOT NULL,
    session_id VARCHAR(64) NOT NULL,

    -- Tool metadata
    tool_name VARCHAR(128) NOT NULL,
    tool_version VARCHAR(50),

    timestamp TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    -- Caller context
    agent_id VARCHAR(128),
    user_id VARCHAR(255),

    -- Input/output (hashed for compliance)
    input_hash VARCHAR(64) NOT NULL,       -- SHA256(sanitized_input)
    input_schema VARCHAR(500),             -- JSON Schema reference

    output_hash VARCHAR(64),               -- SHA256(sanitized_output)
    output_size_bytes INT,

    -- Execution
    duration_ms INT,
    exit_code INT,

    -- Compliance
    requires_consent BOOLEAN DEFAULT FALSE,
    pii_in_input BOOLEAN DEFAULT FALSE,
    pii_in_output BOOLEAN DEFAULT FALSE,

    -- Network/API metrics
    api_call_count INT DEFAULT 0,
    api_error_count INT DEFAULT 0,
    external_data_accessed BOOLEAN DEFAULT FALSE,

    INDEX idx_tool_name (tool_name),
    INDEX idx_session_id (session_id),
    INDEX idx_agent_id (agent_id),
    INDEX idx_user_id (user_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_pii_in_input (pii_in_input),
    INDEX idx_pii_in_output (pii_in_output)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- RESOURCE METRICS TABLE
-- ============================================================================
-- Track resource usage per session for cost and performance analysis
CREATE TABLE IF NOT EXISTS audit_resource_metrics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    event_id VARCHAR(64),
    session_id VARCHAR(64) NOT NULL,

    timestamp TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    -- CPU metrics
    cpu_percent DECIMAL(5,2),
    cpu_core_count INT,

    -- Memory metrics
    memory_allocated_bytes BIGINT,
    memory_used_bytes BIGINT,
    memory_peak_bytes BIGINT,

    -- Disk metrics
    disk_read_bytes BIGINT,
    disk_write_bytes BIGINT,

    -- Network metrics
    network_bytes_in BIGINT,
    network_bytes_out BIGINT,
    network_packet_loss_percent DECIMAL(5,2),

    -- Agent metrics
    agent_count INT,
    active_agents INT,
    message_queue_depth INT,
    message_throughput_per_sec DECIMAL(10,2),

    -- Cost metrics
    estimated_cost_usd DECIMAL(10,4),
    cost_category ENUM('compute', 'network', 'storage', 'api_calls') DEFAULT 'compute',

    INDEX idx_session_id (session_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_memory_used_bytes (memory_used_bytes),
    INDEX idx_estimated_cost_usd (estimated_cost_usd)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- ACCESS CONTROL AUDIT TABLE
-- ============================================================================
-- Track authorization decisions and access denials
CREATE TABLE IF NOT EXISTS audit_access_control (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    event_id VARCHAR(64) UNIQUE NOT NULL,
    session_id VARCHAR(64) NOT NULL,

    timestamp TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    -- Request context
    user_id VARCHAR(255) NOT NULL,
    action ENUM(
        'agent_spawn', 'agent_terminate', 'topology_start', 'topology_stop',
        'tool_invoke', 'secret_access', 'config_read', 'config_write',
        'log_access', 'session_terminate', 'user_impersonate'
    ) NOT NULL,
    resource_id VARCHAR(255),              -- What was being accessed
    resource_type VARCHAR(50),             -- agent, topology, tool, secret, etc.

    -- Decision
    decision ENUM('allow', 'deny', 'challenge') NOT NULL,
    reason VARCHAR(500),

    -- RBAC context
    user_role VARCHAR(100),
    required_permission VARCHAR(255),

    -- MFA context
    mfa_verified BOOLEAN,
    mfa_method VARCHAR(50),                -- 'totp', 'webauthn', 'email', etc.

    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_decision (decision),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- DATA RETENTION PARTITIONING
-- ============================================================================
-- Partition audit_events by month for efficient archival and retention
ALTER TABLE audit_events PARTITION BY RANGE (YEAR(event_timestamp) * 100 + MONTH(event_timestamp)) (
    PARTITION p_202401 VALUES LESS THAN (202402),
    PARTITION p_202402 VALUES LESS THAN (202403),
    PARTITION p_202403 VALUES LESS THAN (202404),
    PARTITION p_202404 VALUES LESS THAN (202405),
    PARTITION p_202405 VALUES LESS THAN (202406),
    PARTITION p_202406 VALUES LESS THAN (202407),
    PARTITION p_202407 VALUES LESS THAN (202408),
    PARTITION p_202408 VALUES LESS THAN (202409),
    PARTITION p_202409 VALUES LESS THAN (202410),
    PARTITION p_202410 VALUES LESS THAN (202411),
    PARTITION p_202411 VALUES LESS THAN (202412),
    PARTITION p_202412 VALUES LESS THAN (202501),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);

-- ============================================================================
-- AUDIT TRAIL INTEGRITY TRIGGERS
-- ============================================================================
-- Enforce immutability and automatic metadata
DELIMITER $$

CREATE TRIGGER audit_events_before_insert
BEFORE INSERT ON audit_events
FOR EACH ROW
BEGIN
    -- Auto-generate event_id if not provided
    IF NEW.event_id IS NULL THEN
        SET NEW.event_id = UUID();
    END IF;
    -- Enforce UTC timestamp
    SET NEW.event_timestamp = CONVERT_TZ(NEW.event_timestamp, @@session.time_zone, '+00:00');
END$$

CREATE TRIGGER audit_sessions_after_insert
AFTER INSERT ON audit_sessions
FOR EACH ROW
BEGIN
    -- Log session creation as audit event
    INSERT INTO audit_events (
        event_id, session_id, event_type, severity, user_id,
        event_data, deployment_env, recorded_at
    ) VALUES (
        UUID(), NEW.session_id, 'session_start', 'INFO', NEW.user_id,
        JSON_OBJECT('session_id', NEW.session_id, 'user_email', NEW.user_email),
        'sandbox', NOW(6)
    );
END$$

-- Prevent audit_events updates (immutable log)
CREATE TRIGGER audit_events_before_update
BEFORE UPDATE ON audit_events
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Audit events table is immutable. Updates are not permitted.';
END$$

-- Prevent audit_events deletes (append-only)
CREATE TRIGGER audit_events_before_delete
BEFORE DELETE ON audit_events
FOR EACH ROW
BEGIN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Audit events table is append-only. Deletions are not permitted.';
END$$

DELIMITER ;

-- ============================================================================
-- VIEWS FOR COMPLIANCE QUERIES
-- ============================================================================

-- View: User Activity Summary
CREATE OR REPLACE VIEW audit_user_activity_summary AS
SELECT
    user_id,
    COUNT(*) as total_events,
    COUNT(DISTINCT session_id) as session_count,
    COUNT(CASE WHEN severity IN ('ERROR', 'CRITICAL') THEN 1 END) as error_count,
    COUNT(CASE WHEN compliance_flags LIKE '%pii_detected%' THEN 1 END) as pii_events,
    MIN(event_timestamp) as first_activity,
    MAX(event_timestamp) as last_activity,
    DATEDIFF(MAX(event_timestamp), MIN(event_timestamp)) as activity_days
FROM audit_events
GROUP BY user_id;

-- View: Session Compliance Status
CREATE OR REPLACE VIEW audit_session_compliance_status AS
SELECT
    s.session_id,
    s.user_id,
    s.started_at,
    s.deployment_env,
    COUNT(ae.id) as event_count,
    COUNT(CASE WHEN av.violation_type IS NOT NULL THEN 1 END) as violation_count,
    CASE WHEN COUNT(CASE WHEN av.violation_type IS NOT NULL THEN 1 END) = 0 THEN 'COMPLIANT'
         ELSE 'VIOLATIONS' END as compliance_status,
    SUM(arm.estimated_cost_usd) as total_cost_usd
FROM audit_sessions s
LEFT JOIN audit_events ae ON s.session_id = ae.session_id
LEFT JOIN audit_violations av ON s.session_id = av.session_id
LEFT JOIN audit_resource_metrics arm ON s.session_id = arm.session_id
GROUP BY s.session_id;

-- View: Tool Usage Statistics
CREATE OR REPLACE VIEW audit_tool_usage_stats AS
SELECT
    tool_name,
    COUNT(*) as call_count,
    SUM(duration_ms) / COUNT(*) as avg_duration_ms,
    MAX(duration_ms) as max_duration_ms,
    COUNT(CASE WHEN pii_in_input OR pii_in_output THEN 1 END) as pii_involved_count,
    COUNT(CASE WHEN exit_code != 0 THEN 1 END) as error_count
FROM audit_tool_calls
GROUP BY tool_name;

-- ============================================================================
-- DATA RETENTION STORED PROCEDURE
-- ============================================================================

DELIMITER $$

CREATE PROCEDURE audit_purge_old_logs(
    IN retention_days INT,
    OUT deleted_rows INT
)
BEGIN
    DECLARE cutoff_date TIMESTAMP DEFAULT DATE_SUB(NOW(6), INTERVAL retention_days DAY);

    DELETE FROM audit_events
    WHERE event_timestamp < cutoff_date
    AND severity NOT IN ('ERROR', 'CRITICAL')
    AND compliance_flags NOT LIKE '%pii_detected%';

    SET deleted_rows = ROW_COUNT();

    -- Log the purge operation itself
    INSERT INTO audit_events (
        event_id, session_id, event_type, severity, event_data
    ) VALUES (
        UUID(), 'system', 'audit_maintenance', 'INFO',
        JSON_OBJECT('action', 'purge_old_logs', 'deleted_rows', deleted_rows, 'retention_days', retention_days)
    );
END$$

DELIMITER ;

-- ============================================================================
-- INITIALIZATION
-- ============================================================================
-- These statements should run once after table creation

-- Create default system session
INSERT IGNORE INTO audit_sessions (
    session_id, user_id, user_email, started_at, deployment_env
) VALUES (
    'system-session-' + UUID(), 'system', 'system@internal', NOW(6), 'sandbox'
);

-- Create indexes for common queries if not exists
CREATE INDEX IF NOT EXISTS idx_compliance_flags ON audit_events ((JSON_EXTRACT(compliance_flags, '$.pii_detected')));
CREATE INDEX IF NOT EXISTS idx_severity_timestamp ON audit_events (severity, event_timestamp);
