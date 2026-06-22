# FAQ: Swarm Sandbox

Frequently asked questions about Swarm Sandbox isolation, monitoring, cleanup, scaling, debugging, and resource management.

---

## Sandbox Isolation

### Q: Sandbox not isolating — agents can see files from other sandbox sessions?

**A:** Verify the following:

1. **Unique sandbox IDs** — Each sandbox must have a distinct `sandbox_id` at creation:
   ```python
   sandbox = SwarmSandbox(sandbox_id=f"session_{uuid.uuid4()}")
   ```
   If IDs collide or reuse the same value, agents share the filesystem.

2. **Filesystem path isolation** — Check that the sandbox's working directory is unique:
   ```python
   sandbox.config.working_dir  # Should be /tmp/claude_sandbox_{sandbox_id}/
   ```

3. **No cross-sandbox references** — Ensure agents don't reference absolute paths outside their sandbox:
   ```python
   # BAD: /tmp/shared_state/data.json (could leak to other sandboxes)
   # GOOD: ./data.json (relative to sandbox working_dir)
   ```

4. **Reset between sessions** — Call `sandbox.cleanup()` before reusing a sandbox ID:
   ```python
   sandbox.cleanup()
   ```

### Q: Can agents in the same sandbox see each other's temporary files?

**A:** Yes. All agents in a single sandbox share the same working directory. This is intentional for inter-agent collaboration. If true isolation is required, create separate sandbox instances:

```python
# Isolated sandboxes
sandbox_a = SwarmSandbox(sandbox_id="task_a")
sandbox_b = SwarmSandbox(sandbox_id="task_b")
# Shared sandbox for teamwork
sandbox_team = SwarmSandbox(sandbox_id="team_collab")
```

### Q: How do I isolate environment variables between sandboxes?

**A:** Use the `env` parameter in sandbox config:

```python
sandbox = SwarmSandbox(
    sandbox_id="secure_task",
    env={
        "API_KEY": "secret_value",
        "DEBUG": "false"
    }
)
```

Environment variables set here are isolated to this sandbox and not visible to other sandboxes or the host.

---

## Monitoring Agents

### Q: How to monitor agent execution in real-time?

**A:** Enable logging and subscribe to execution events:

```python
import logging
logging.basicConfig(level=logging.DEBUG)

# Listen to agent state changes
sandbox.on_agent_state_change(lambda agent_id, state: 
    print(f"Agent {agent_id}: {state}")
)

# Monitor task execution
for event in sandbox.stream_events():
    print(f"Event: {event.type} - {event.data}")
```

### Q: How to check if an agent is still running?

**A:** Query the agent's status:

```python
status = sandbox.get_agent_status(agent_id)
print(status)
# Output: 
# {
#   "agent_id": "worker_1",
#   "state": "running",  # idle, running, error
#   "task_id": "task_123",
#   "uptime_seconds": 45.2,
#   "last_activity": "2026-06-22T14:32:10Z"
# }
```

### Q: How to get execution logs from an agent?

**A:** Retrieve logs by agent ID or time range:

```python
# Get all logs for an agent
logs = sandbox.get_agent_logs(agent_id="worker_1")

# Get logs in a time range
logs = sandbox.get_agent_logs(
    agent_id="worker_1",
    start_time="2026-06-22T14:00:00Z",
    end_time="2026-06-22T15:00:00Z"
)

for log in logs:
    print(f"[{log.timestamp}] {log.level}: {log.message}")
```

### Q: How to trace agent-to-agent communication?

**A:** Enable trace mode to capture all inter-agent calls:

```python
sandbox.enable_trace_mode()

# Agents execute...

traces = sandbox.get_traces()
for trace in traces:
    print(f"{trace.caller_agent} -> {trace.target_agent}: {trace.payload}")
```

### Q: How to set up alerts for agent failures?

**A:** Register error handlers:

```python
def on_agent_error(agent_id, error, context):
    print(f"ALERT: Agent {agent_id} failed: {error}")
    # Send to monitoring system
    notify_slack(f"Agent failure: {agent_id}")

sandbox.register_error_handler(on_agent_error)
```

---

## Cleanup & Resource Management

### Q: Cleanup not working — sandbox files persist after cleanup()?

**A:** Verify cleanup is called and check permissions:

```python
# Option 1: Explicit cleanup
sandbox.cleanup()

# Option 2: Context manager (automatic cleanup)
with SwarmSandbox(sandbox_id="temp") as sandbox:
    sandbox.spawn_agent("worker")
# Cleanup called automatically on exit

# Verify files are gone
import os
assert not os.path.exists(sandbox.config.working_dir), "Cleanup failed"
```

If files still exist:
1. Check file permissions: `ls -la /tmp/claude_sandbox_{sandbox_id}/`
2. Verify no agents are still running: `sandbox.list_agents()`
3. Force cleanup: `sandbox.cleanup(force=True)`

### Q: How to clean up only specific files in the sandbox?

**A:** Use targeted cleanup:

```python
# Clean specific directory
sandbox.cleanup_path("./logs/")

# Clean files matching pattern
sandbox.cleanup_pattern("*.tmp")

# Clean but preserve certain files
sandbox.cleanup(preserve=["config.json", "state.db"])
```

### Q: What happens to agent logs after cleanup?

**A:** By default, logs are archived before cleanup:

```python
# Export logs before cleanup
sandbox.export_logs(output_file="agent_logs.tar.gz")

sandbox.cleanup()  # Logs now archived, sandbox files removed

# Later, restore logs if needed
sandbox.import_logs("agent_logs.tar.gz")
```

### Q: How to set automatic cleanup on timeout?

**A:** Configure auto-cleanup:

```python
sandbox = SwarmSandbox(
    sandbox_id="auto_cleanup_demo",
    auto_cleanup_timeout_seconds=3600  # 1 hour
)

# Sandbox automatically cleaned up 1 hour after last activity
```

---

## Scaling to Production

### Q: How many sandboxes can run concurrently?

**A:** Depends on host resources and sandbox config:

```python
# Light sandboxes: 100+ concurrent on modern hardware
# Heavy sandboxes: 10-20 concurrent (CPU/memory bound)

# Monitor resource usage
stats = sandbox.get_resource_stats()
print(f"CPU: {stats.cpu_percent}%")
print(f"Memory: {stats.memory_mb}MB")
print(f"Disk: {stats.disk_usage_gb}GB")
```

Start with conservative estimates and load-test:

```python
import concurrent.futures
import time

def run_sandbox_task(task_id):
    sandbox = SwarmSandbox(sandbox_id=f"task_{task_id}")
    sandbox.spawn_agent("worker")
    # Execute work...
    sandbox.cleanup()

with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
    futures = [executor.submit(run_sandbox_task, i) for i in range(100)]
    concurrent.futures.wait(futures)
```

### Q: How to manage sandboxes across multiple machines?

**A:** Use a distributed sandbox manager:

```python
from swarm_sandbox import DistributedSandboxManager

manager = DistributedSandboxManager(
    backend="redis",  # or "etcd", "consul"
    nodes=["machine1:6379", "machine2:6379", "machine3:6379"]
)

# Sandboxes automatically distributed
sandbox = manager.create_sandbox(sandbox_id="distributed_task")

# Query any machine
status = manager.get_sandbox_status("distributed_task")
```

### Q: How to scale agent spawning?

**A:** Use batch spawning and worker pools:

```python
# Spawn many agents efficiently
agents = sandbox.spawn_agents(
    count=50,
    agent_class="worker",
    init_config={"role": "data_processor"}
)

# Use a pool for work distribution
work_queue = sandbox.create_work_queue()
for task in tasks:
    work_queue.put(task)

# Agents consume from queue
agents[0].consume_from_queue(work_queue)
```

### Q: What's the recommended sandbox lifecycle in production?

**A:** Use short-lived sandboxes for isolation:

```python
# Task-per-sandbox pattern (recommended)
for task in incoming_tasks:
    sandbox = SwarmSandbox(sandbox_id=f"task_{task.id}")
    try:
        result = execute_task_in_sandbox(sandbox, task)
        return result
    finally:
        sandbox.cleanup()

# vs. long-lived pool pattern (use cautiously)
pool = [SwarmSandbox(sandbox_id=f"pool_{i}") for i in range(10)]
# Reuse sandboxes, but risk state leakage
```

---

## Debugging Failed Agents

### Q: Agent failed silently — how to debug?

**A:** Enable debug mode and inspect the crash dump:

```python
sandbox = SwarmSandbox(sandbox_id="debug_task", debug=True)

# After agent fails
crash_report = sandbox.get_agent_crash_report(agent_id="worker_1")
print(crash_report)
# Output:
# {
#   "agent_id": "worker_1",
#   "error": "RuntimeError: Task failed",
#   "traceback": "...",
#   "last_command": "run_inference('prompt')",
#   "context": {"memory": {...}, "state": {...}}
# }
```

### Q: How to replay a failed agent's execution?

**A:** Use the replay feature:

```python
# Save state before failure
sandbox.save_checkpoint(checkpoint_name="before_failure")

# Later, replay from checkpoint
sandbox.restore_checkpoint("before_failure")

# Step through execution with breakpoints
sandbox.enable_step_mode()
sandbox.step_to_line(42)  # Stop at line 42
```

### Q: Agent throws "permission denied" error — why?

**A:** Check sandbox security policy:

```python
# Review current policy
policy = sandbox.get_security_policy()
print(policy)
# Output:
# {
#   "allowed_commands": ["python", "node", "curl"],
#   "allowed_paths": ["./", "/tmp/"],
#   "blocked_commands": ["rm -rf", "sudo"]
# }

# Expand permissions if safe
sandbox.update_security_policy(
    allowed_commands=["python", "node", "curl", "bash"],
    allowed_paths=["./", "/tmp/", "/usr/local/"]
)
```

### Q: How to capture agent stderr and stdout?

**A:** Enable output capture:

```python
# Capture all output
output = sandbox.capture_agent_output(agent_id="worker_1")

# Streaming output
for line in sandbox.stream_agent_output(agent_id="worker_1"):
    print(f"[stdout] {line}")

# Separate stderr
stderr = sandbox.get_agent_stderr(agent_id="worker_1")
print(f"[stderr] {stderr}")
```

### Q: Agent hangs — how to force termination?

**A:** Use timeout and force stop:

```python
# Set execution timeout
sandbox.spawn_agent("worker", timeout_seconds=30)

# If still hanging, force stop
sandbox.stop_agent(agent_id="worker_1", force=True, signal="SIGKILL")

# Set auto-timeout for future agents
sandbox.config.default_agent_timeout = 60
```

### Q: How to inspect agent memory state at failure?

**A:** Dump memory snapshot:

```python
# Get memory dump
memory = sandbox.get_agent_memory(agent_id="worker_1")
print(f"Variables: {memory.variables}")
print(f"Call stack: {memory.call_stack}")
print(f"Heap: {memory.heap_summary}")

# Export for analysis
sandbox.export_memory_dump("agent_memory.dump")
```

---

## Resource Limits

### Q: How to set CPU/memory limits per sandbox?

**A:** Configure resource constraints:

```python
sandbox = SwarmSandbox(
    sandbox_id="limited_task",
    resource_limits={
        "cpu_cores": 2,           # Max 2 CPU cores
        "memory_mb": 512,         # Max 512MB RAM
        "disk_gb": 10,            # Max 10GB disk
        "timeout_seconds": 300    # 5-minute timeout
    }
)

# Verify limits applied
limits = sandbox.get_resource_limits()
print(limits)
```

### Q: What happens when an agent exceeds memory limit?

**A:** Agent is killed and sandbox reports the violation:

```python
# Check if resource limit was exceeded
if sandbox.get_last_error_type() == "OUT_OF_MEMORY":
    # Handle OOM
    sandbox.cleanup()
    # Retry with higher limit
    sandbox = SwarmSandbox(
        sandbox_id="retry_with_more_memory",
        resource_limits={"memory_mb": 1024}
    )
```

### Q: How to monitor resource usage in real-time?

**A:** Stream resource metrics:

```python
import time

for metric in sandbox.stream_resource_metrics(interval_seconds=1):
    print(f"CPU: {metric.cpu_percent}% | Memory: {metric.memory_mb}MB | Disk: {metric.disk_gb}GB")
    
    # Alert if approaching limits
    if metric.memory_mb > 450:  # 88% of 512MB limit
        print("WARNING: Memory usage high")
```

### Q: How to set per-agent resource limits?

**A:** Use agent-level configuration:

```python
sandbox.spawn_agent(
    "worker",
    resource_limits={
        "cpu_cores": 1,
        "memory_mb": 256,
        "timeout_seconds": 60
    }
)
```

---

## Concurrent Execution

### Q: How to run multiple agents concurrently in one sandbox?

**A:** Spawn multiple agents and manage coordination:

```python
# Spawn concurrent agents
agents = []
for i in range(5):
    agent = sandbox.spawn_agent(f"worker_{i}")
    agents.append(agent)

# Distribute work
import queue
work_queue = queue.Queue()
for task in tasks:
    work_queue.put(task)

# Agents process concurrently
for agent in agents:
    agent.process_queue(work_queue)

# Wait for completion
for agent in agents:
    agent.wait()
```

### Q: How to synchronize agents?

**A:** Use barriers and locks:

```python
# Create a barrier for N agents
barrier = sandbox.create_barrier(num_agents=3)

# Agent 1
barrier.wait(agent_id="worker_1")  # Blocks until all 3 reach barrier

# Agent 2
barrier.wait(agent_id="worker_2")

# Agent 3
barrier.wait(agent_id="worker_3")
# All continue together

# Use locks for shared state
lock = sandbox.create_lock("data_lock")
lock.acquire(agent_id="worker_1")
# Modify shared state
lock.release()
```

### Q: How to avoid race conditions with shared sandbox state?

**A:** Use atomic operations and versioning:

```python
# Atomic write
sandbox.atomic_write("state.json", new_state)

# Optimistic locking with versioning
current_state = sandbox.read_with_version("state.json")
# Modify state...
success = sandbox.write_if_version_matches("state.json", new_state, current_state.version)
if not success:
    # Version mismatch — retry
    pass
```

### Q: How to coordinate work across multiple sandboxes?

**A:** Use a distributed work coordinator:

```python
coordinator = sandbox.create_work_coordinator(
    coordinator_id="master_task",
    num_workers=3
)

# Add tasks
for task in large_task_list:
    coordinator.add_task(task)

# Spawn worker sandboxes
for i in range(3):
    worker_sandbox = SwarmSandbox(sandbox_id=f"worker_{i}")
    worker_sandbox.consume_from_coordinator(coordinator)

# Wait for all tasks to complete
results = coordinator.wait_for_completion()
```

### Q: How to handle task dependencies in concurrent execution?

**A:** Use task DAG:

```python
dag = sandbox.create_task_dag()
task_a = dag.add_task("extract_data", func=extract)
task_b = dag.add_task("transform_data", func=transform, depends_on=[task_a])
task_c = dag.add_task("load_data", func=load, depends_on=[task_b])

# Execute respecting dependencies
result = dag.execute(num_concurrent=2)  # 2 tasks at a time
```

---

## General Troubleshooting

### Q: How to get a full health check of a sandbox?

**A:** Run a diagnostic:

```python
health = sandbox.health_check()
print(health)
# Output:
# {
#   "status": "healthy",  # or "degraded", "unhealthy"
#   "agents": {"total": 5, "running": 4, "failed": 1},
#   "resources": {"cpu": "12%", "memory": "45%", "disk": "23%"},
#   "errors": [],
#   "warnings": ["One agent failed in last hour"],
#   "timestamp": "2026-06-22T15:30:45Z"
# }
```

### Q: Where are sandbox logs stored?

**A:** Check the sandbox log directory:

```python
log_dir = sandbox.config.log_dir
print(log_dir)  # /tmp/claude_sandbox_{sandbox_id}/logs/

import subprocess
subprocess.run(["ls", "-la", log_dir])
```

### Q: How to enable verbose logging for debugging?

**A:** Configure logging level:

```python
sandbox.set_log_level("DEBUG")

# Or at creation time
sandbox = SwarmSandbox(
    sandbox_id="verbose_task",
    log_level="DEBUG"
)

# View logs
logs = sandbox.tail_logs(num_lines=100)
for line in logs:
    print(line)
```
