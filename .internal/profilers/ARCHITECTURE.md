# Profiler Architecture

Technical design of the sandbox profiler system.

## Component Overview

```
┌─────────────────────────────────────────────────────────────┐
│ Main Entry: swarm-sandbox-profiler.js                       │
│ - Argument parsing (--output, --iterations, --leak-detection)│
│ - Scenario orchestration                                     │
│ - Result collection & export                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
    ┌────────┐  ┌──────────────┐  ┌────────────┐
    │ Fork   │  │ Leak         │  │ Concurrency│
    │ Spawn  │  │ Detection    │  │ Profiler   │
    │ IPC    │  │ Profiler     │  │            │
    └───┬────┘  └───┬──────────┘  └─────┬──────┘
        │           │                   │
        └───────────┼───────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
    ┌────────┐  ┌────────┐  ┌────────┐
    │ Memory │  │   FD   │  │Reporter│
    │Profiler│  │Profiler│  │        │
    └────────┘  └────────┘  └────────┘
```

## Class Hierarchy

### Measurement Classes

```
MemoryProfiler
├─ start()              - Initialize heap tracking
├─ sample()            - Capture heap snapshot
├─ end()               - Finalize & return metrics
└─ getAveragePeakGrowthRate() - Calculate growth trend

FDProfiler
├─ start()             - Initialize FD counter
├─ sample()            - Count current FDs
├─ end()               - Finalize & return metrics
└─ countOpenFDs()      - Platform-specific FD lookup
```

### Test Profilers

```
ForkSpawnProfiler
├─ profileFork(modulePath, iterations)
│  └─ Uses: MemoryProfiler, FDProfiler
│  └─ Returns: { fork[], ipc[], cleanup[] }
│
└─ profileSpawn(command, args, iterations)
   └─ Uses: MemoryProfiler, FDProfiler
   └─ Returns: { spawn[], cleanup[] }

LeakDetectionProfiler
├─ profileLeaks(duration, sampleInterval)
│  ├─ Uses: MemoryProfiler, FDProfiler
│  ├─ Calls: simulateSandboxOperation() repeatedly
│  └─ Returns: { memory, fds, leakAnalysis }
│
└─ calculateLeakSeverity(memLeak, fdLeak, ...) 
   └─ Returns: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

ConcurrencyProfiler
├─ profileConcurrentForks(count, iterations)
│  ├─ Uses: MemoryProfiler, FDProfiler
│  ├─ Forks N children concurrently
│  └─ Returns: { concurrent[], peaks, statistics }
```

### Reporter

```
Reporter
├─ reportForkSpawn(label, results)   - Format fork/spawn data
├─ reportLeaks(label, results)       - Format leak analysis
├─ reportConcurrency(label, results) - Format concurrency data
├─ printForkSpawnText(...)           - Console output
├─ printLeaksText(...)               - Console output
├─ printConcurrencyText(...)         - Console output
└─ save(filename)                    - JSON export
```

## Execution Flow

### Default Profiling Session

```
1. Parse arguments (--output, --iterations, etc.)
2. Create profilers:
   ├─ ForkSpawnProfiler (for fork/spawn tests)
   ├─ LeakDetectionProfiler (if --leak-detection)
   └─ ConcurrencyProfiler (if --all-tests)

3. Execute profilers in sequence:
   ├─ Fork profiling (fork() + IPC + cleanup)
   │  └─ For each iteration:
   │     ├─ Start MemoryProfiler & FDProfiler
   │     ├─ Measure fork() time
   │     ├─ Measure IPC latency (ping-pong)
   │     ├─ Measure cleanup time
   │     ├─ Sample profilers
   │     ├─ End profilers & collect metrics
   │     └─ Pause 100ms before next iteration
   │
   ├─ Spawn profiling (spawn() + cleanup)
   │  └─ Similar to fork, but uses spawn() instead
   │
   ├─ Leak detection (if enabled)
   │  └─ 30 second run with 100ms samples
   │     └─ Repeatedly call simulateSandboxOperation()
   │
   └─ Concurrency profiling (if --all-tests)
      └─ Fork N=10 children concurrently
         └─ Measure peak memory & FD usage

4. Report results:
   ├─ Text format (console)
   └─ or JSON format (file)

5. Cleanup:
   ├─ Remove worker-stub.js
   └─ Exit with status 0 (success) or 1 (error)
```

## Memory Profiling Strategy

```
Cycle 1: MemoryProfiler lifecycle
┌─────────────────────────────────────┐
│ start()  (GC, record heap baseline) │
│   ↓                                 │
│ operation() ← measured section      │
│   ↓                                 │
│ sample() (point-in-time snapshot)   │
│   ↓                                 │
│ ... more samples ...                │
│   ↓                                 │
│ end() (GC, record final heap)       │
│   ↓                                 │
│ Return metrics: {                   │
│   startHeapUsed,                    │
│   finalHeapUsed,                    │
│   peakHeapUsed,                     │
│   heapGrowth,                       │
│   samples[]                         │
│ }                                   │
└─────────────────────────────────────┘
```

Key technique: Aggressive GC at start/end for clean baseline.

## File Descriptor Profiling Strategy

### Linux (/proc interface)
```
/proc/$PID/fd/
├─ 0     (stdin)
├─ 1     (stdout)
├─ 2     (stderr)
├─ 3     (file handle 1)
├─ 4     (socket 1)
└─ ...
```

Count = `ls /proc/$PID/fd | wc -l`

### macOS (Not available)
- Returns -1 (unavailable)
- Can be supplemented with `lsof` if needed

### Detection logic
```
for each operation:
  ├─ fd_start = countOpenFDs()
  ├─ fd_peak = track maximum during operation
  ├─ fd_final = countOpenFDs()
  └─ fd_leak = fd_final - fd_start
     (if positive, descriptors not closed)
```

## Statistical Functions

```javascript
stats(values[])
├─ sorted = values.sort()
├─ min = sorted[0]
├─ max = sorted[-1]
├─ avg = sum(values) / count
├─ median = sorted[count/2]
├─ stdDev = sqrt(sum((val - avg)²) / count)
├─ p95 = sorted[floor(count * 0.95)]
└─ p99 = sorted[floor(count * 0.99)]
```

Used to aggregate:
- Fork times across iterations
- IPC latencies
- Cleanup times
- Memory growth rates
- Peak FD usage

## Platform Abstractions

### Operating System Detection
```javascript
os.platform()
├─ 'linux'   ← Full FD support
├─ 'darwin'  ← Partial FD support
└─ 'win32'   ← No FD support
```

### FD Counting
```javascript
countOpenFDs()
├─ Linux:
│  └─ fs.readdirSync('/proc/' + pid + '/fd').length
├─ macOS/BSD:
│  └─ return -1 (unavailable)
└─ Windows:
   └─ return -1 (unavailable)
```

## Configuration Integration

### profiles.config.js Usage
```javascript
const config = require('./profiles.config.js');

// Get scenario parameters
const scenario = config.getScenario('leakDetection');
// { duration, sampleInterval, thresholds, ... }

// Evaluate metric
const status = config.evaluateMetric('forkTime', 2.5);
// 'good' | 'warning' | 'critical'

// Detect regression
const alert = config.getAlert('memoryGrowth', 150K, 100K);
// { metric, change, severity } or null
```

## Error Handling

```
Error scenarios:
├─ Fork failure
│  └─ Log error, continue with next iteration
│     (don't abort entire test suite)
│
├─ Timeout (child doesn't exit)
│  └─ force kill with SIGKILL
│  └─ Record fdLeak (orphaned process)
│
├─ IPC timeout
│  └─ Skip IPC measurement, continue
│
├─ GC unavailable (no --expose-gc)
│  └─ Proceed without GC guarantee (warn user)
│
└─ No /proc (macOS/Windows)
   └─ Skip FD counting (return -1)
```

## Output Formats

### Text Format (Console)
```
[HH:MM:SS] [LEVEL] Message

Fork Performance Profile
================================================================================

Fork Performance:
  Time: 1.45 ms avg, 0.88-4.22 ms range
  Stddev: 1.12 ms, P95: 3.89 ms, P99: 4.22 ms
```

### JSON Format (File)
```json
{
  "Fork Performance Profile": {
    "fork": [
      { "iteration": 1, "time": 1.45, "memory": {...}, "fds": {...} }
    ],
    "ipc": [...],
    "cleanup": [...]
  }
}
```

## Resource Cleanup

```
Process lifecycle:
├─ Child forked/spawned
├─ Measurement phase
│  ├─ Parent: measure time, memory, FDs
│  └─ Child: receive message if fork
├─ Cleanup phase
│  ├─ Parent: send SIGTERM
│  └─ Child: exit gracefully
├─ Verify exit
│  └─ If not exited in 100ms, SIGKILL
└─ Final accounting
   ├─ Check FDs closed (leak detection)
   ├─ Check memory reclaimed
   └─ Record metrics
```

## Performance Characteristics

```
Typical execution times:

Fork profiling (5 iterations):
├─ Fork time measurement: ~5 ms × 5 = 25 ms
├─ IPC latency: ~25 ms × 5 = 125 ms
├─ Cleanup: ~2 ms × 5 = 10 ms
├─ Inter-iteration delays: 100 ms × 5 = 500 ms
└─ Total: ~660 ms

Spawn profiling (5 iterations):
├─ Spawn time: ~1 ms × 5 = 5 ms
├─ Cleanup: ~0.7 ms × 5 = 3.5 ms
├─ Inter-iteration delays: 100 ms × 5 = 500 ms
└─ Total: ~510 ms

Leak detection (30 seconds):
├─ Sample interval: 100 ms × 300 = ~30 sec
└─ Total: 30 sec + overhead

Concurrency (10 children, 3 iterations):
├─ Fork 10: ~15 ms × 3 = 45 ms
├─ Cleanup: ~9 ms × 3 = 27 ms
├─ Inter-iteration delays: 500 ms × 3 = 1500 ms
└─ Total: ~1.6 s

Overall default run: ~2.5 seconds
```

## Future Extensions

```
Planned enhancements:
├─ CPU profiling (v8 profiler)
├─ Disk I/O profiling
├─ Network socket tracking
├─ Heap snapshot analysis
├─ GC pause tracking
├─ Prometheus export
├─ Grafana dashboard
├─ Historical trend analysis
└─ Automated regression detection
```
