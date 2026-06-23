# Example Profiler Output

Real output from the swarm-sandbox-profiler running on standard system.

## Test Environment
- OS: macOS 25.5.0
- Node.js: v18.19.0
- CPU: 8-core
- Memory: 16 GB
- System load: light (background processes minimal)

## Example 1: Basic Profiling (2 Iterations)

```
[04:13:07] [36m[INFO][0m Swarm Sandbox Profiler v1.0
[04:13:07] [90m[DEBUG][0m Format: text, Iterations: 2, Duration: 10000ms
[04:13:07] [36m[INFO][0m Starting fork profiling...
[04:13:07] [90m[DEBUG][0m Profiling fork() operations with 2 iterations

Fork Performance Profile
================================================================================

Fork Performance:
  Time: 2.94 ms avg, 2.76 ms-3.11 ms range
  Stddev: 178.42 µs, P95: 3.11 ms, P99: 3.11 ms

IPC Latency:
  Latency: 28.63 ms avg, 27.05 ms-30.22 ms range

Cleanup Performance:
  Time: 1.78 ms avg, 1.42 ms-2.13 ms range

[04:13:07] [36m[INFO][0m Starting spawn profiling...
[04:13:07] [90m[DEBUG][0m Profiling spawn() operations with 2 iterations

Spawn Performance Profile
================================================================================

Cleanup Performance:
  Time: 653.67 µs avg, 385.54 µs-921.79 µs range

[04:13:07] [32m[✓][0m Profiling complete
```

### Interpretation

**Fork Performance:** ✓ GOOD
- Average: 2.94 ms (within good threshold <1.5 ms but close)
- Range: 2.76-3.11 ms (tight distribution, consistent)
- Low std dev (178 µs) indicates stable performance

**IPC Latency:** ✓ ACCEPTABLE
- Average: 28.63 ms (within warning threshold <50 ms)
- Likely due to process initialization overhead (typical for fork-based IPC)

**Cleanup Performance:** ✓ GOOD
- Average: 1.78 ms (well within threshold <5 ms)
- Spawn cleanup much faster (653 µs)

---

## Example 2: Extended Profiling (10 Iterations)

Expected output:

```
Fork Performance Profile
================================================================================

Fork Performance:
  Time: 1.45 ms avg, 0.88 ms-4.22 ms range
  Stddev: 1.12 ms, P95: 3.89 ms, P99: 4.22 ms

IPC Latency:
  Latency: 26.93 ms avg, 15.52 ms-48.34 ms range

Cleanup Performance:
  Time: 2.46 ms avg, 1.55 ms-8.38 ms range
```

### Analysis

**High P99 latency (4.22 ms)** suggests occasional system contention. Compare:
- P95 (3.89 ms): 95% of operations faster
- P99 (4.22 ms): Only 1% hit maximum latency (acceptable)

**IPC range (15-48 ms)** shows variability, likely due to:
- Process initialization time (varies with system load)
- Message queue delays (normal)
- GC pauses in parent or child process

---

## Example 3: Leak Detection (30-Second Run)

Expected output:

```
Memory & FD Leak Detection
================================================================================

Leak Analysis:
  Duration: 30000 ms (30.0 s)
  Samples: 300
  Severity: LOW

Memory Growth:
  Start: 2.45 MB
  Peak: 5.67 MB
  Final: 2.89 MB
  Growth Rate: 14.67 bytes/sec
  (No leak detected - normal variance)

File Descriptors:
  Start: 15
  Peak: 28
  Final: 15
  Leak: 0
  (No leak detected - all FDs cleaned up)
```

### Interpretation

**Severity: LOW** ✓ GOOD
- Memory growth: 14.67 bytes/sec (well under warning threshold 50KB/sec)
- FD leak: 0 (perfect cleanup)
- Peak memory returned to baseline (no retention)

**Healthy Pattern:**
- Peak memory during operations
- Full recovery after cleanup
- Consistent final state across iterations

---

## Example 4: Leak Detection with Memory Leak

Hypothetical warning output:

```
Memory & FD Leak Detection
================================================================================

Leak Analysis:
  Duration: 30000 ms
  Samples: 300
  Severity: HIGH

Memory Growth:
  Start: 2.45 MB
  Peak: 150.23 MB
  Final: 145.67 MB
  Growth Rate: 4762.33 bytes/sec
  LEAK DETECTED

File Descriptors:
  Start: 15
  Peak: 1024
  Final: 487
  Leak: 472
  LEAK DETECTED
```

### Red Flags

1. **Memory growth rate: 4762 bytes/sec**
   - = 4.76 KB/sec
   - = 286 KB/min
   - = 17 MB/hr
   - Clearly unsustainable (CRITICAL)

2. **Final memory: 145.67 MB > Start: 2.45 MB**
   - Did not recover after operations
   - ~143 MB leaked (CRITICAL)

3. **FD leak: 472 unclosed descriptors**
   - Every operation leaked ~16 FDs
   - System will hit ulimit quickly (CRITICAL)

**Action Items:**
- Run with `--expose-gc` for accurate GC behavior
- Review sandbox cleanup code (missing close() calls)
- Check for circular references in heap dumps
- Profile memory with V8 heap snapshots

---

## Example 5: Concurrency Stress Test

Expected output:

```
Concurrent Fork Profile
================================================================================

Concurrent fork: 10 children
  Fork time: 15.43 ms avg
  Cleanup time: 8.92 ms avg

Peak Memory Growth:
  Avg: 12.34 MB, Max: 18.76 MB

Peak FDs:
  Avg: 84.5, Max: 127
```

### Analysis

**Concurrency Metrics:**
- Forking 10 children takes ~15 ms (reasonable)
- Cleanup takes ~9 ms (expected to take longer with multiple processes)
- Peak memory: 18.76 MB (sustainable)
- Peak FDs: 127 (well under typical limit of 1024)

---

## Metric Reference Guide

### Good Baseline Metrics

```
Fork time:            0.8 - 1.5 ms
Spawn time:           1.5 - 3.0 ms
IPC latency:          15 - 30 ms
Cleanup time:         1 - 5 ms
Memory growth:        < 50 KB/sec
FD leaks:             0 per operation
Memory recovery:      100% (peak → baseline)
```

### Warning Indicators

```
Fork time:            > 5 ms
IPC latency:          > 50 ms
Cleanup time:         > 10 ms
Memory growth:        50 - 100 KB/sec
FD leaks:             1 - 5 per operation
Memory recovery:      < 80% (retained 20%+)
Peak FD usage:        > 512 of 1024
```

### Critical Thresholds

```
Fork time:            > 20 ms
IPC latency:          > 100 ms
Cleanup time:         > 50 ms
Memory growth:        > 500 KB/sec (likely leak)
FD leaks:             > 5 per operation
Memory recovery:      < 50% (retained 50%+)
Peak memory:          > 1 GB (memory spike)
```

---

## Regression Detection Example

### Baseline (v1.0)
```json
{
  "fork_time_ms": 1.45,
  "ipc_latency_ms": 26.93,
  "cleanup_ms": 2.46,
  "memory_growth_kb_sec": 0.015
}
```

### Current (v1.1)
```json
{
  "fork_time_ms": 1.68,
  "ipc_latency_ms": 32.15,
  "cleanup_ms": 2.51,
  "memory_growth_kb_sec": 0.024
}
```

### Regression Analysis
```
Fork time:      +15.9% (1.45 → 1.68 ms)  ⚠️  Warning (>15% tolerance)
IPC latency:    +19.2% (26.93 → 32.15 ms) ✓  OK (within 20% tolerance)
Cleanup:        +2.0%  (2.46 → 2.51 ms)  ✓  OK
Memory growth:  +60%   (0.015 → 0.024)    ⚠️  Warning (>25% tolerance)

Conclusion: Minor regressions detected. Investigate fork performance impact.
```

---

## Platform-Specific Output Variations

### Linux Output
- Full FD counting available
- Typically faster fork times (~0.5-1.5 ms)
- Better memory profiling with /proc interface
- CGroup memory limits if containerized

### macOS Output
- FD counting limited (shows -1)
- Slower fork times (~2-5 ms) due to system security features
- Memory profiling available
- Activity Monitor correlation useful

### Windows Output
- spawn() only (no fork)
- FD counting unavailable
- Memory profiling available
- CPU profiling less reliable

---

## Interpreting CSV Export

Example CSV output (when implemented):

```csv
iteration,metric,value,unit,platform,timestamp
1,fork_time,1.45,ms,linux,2024-06-22T04:13:07Z
1,ipc_latency,26.93,ms,linux,2024-06-22T04:13:07Z
1,cleanup_time,2.46,ms,linux,2024-06-22T04:13:07Z
1,memory_growth,15.4,bytes/sec,linux,2024-06-22T04:13:07Z
...
```

For trend analysis:
```bash
# Plot fork time over iterations
awk -F',' '$2=="fork_time" {print $1":"$3}' results.csv
```

---

## Next Steps

1. Establish baseline on target platform
2. Document normal ranges for your environment
3. Set regression alert thresholds
4. Integrate into CI/CD pipeline
5. Schedule nightly leak detection
6. Track trends over time for capacity planning
