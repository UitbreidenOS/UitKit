# SVG Layout Analyzer - CLI Reference

Quick command reference for the SVG Layout Analyzer command-line tool.

## Installation

The CLI tool is available in `svg-layout-analyzer-integration-example.js`:

```bash
node lib/svg-layout-analyzer-integration-example.js <command> [options]
```

## Commands

### 1. Analyze SVG Layout

Analyze an SVG file and report layout issues.

```bash
node lib/svg-layout-analyzer-integration-example.js analyze <file.svg> [--verbose]
```

**Options:**
- `--verbose` - Show detailed cluster and suggestion information

**Example:**
```bash
# Basic analysis
node lib/svg-layout-analyzer-integration-example.js analyze map.svg

# Detailed analysis with all info
node lib/svg-layout-analyzer-integration-example.js analyze map.svg --verbose
```

**Output:**
```
╔══════════════════════════════════════════════════════════╗
║  SVG Layout Analysis: map.svg
╚══════════════════════════════════════════════════════════╝

Summary:
  Total nodes: 50
  Total edges: 75
  Clusters detected: 3
  Overlapping pairs: 12
  Visibility issues: 8
  Repositioning suggestions: 15
  Analysis time: 12.3ms

Clusters:
  cluster_0: 18 nodes at (245, 318), radius 42.5
  cluster_1: 22 nodes at (512, 156), radius 38.2
  cluster_2: 10 nodes at (375, 425), radius 25.8

Top 5 Repositioning Suggestions:
  1. [spread_cluster] cluster_0: Dense cluster with 18 nodes
  2. [resolve_overlap] node15: Overlaps with node8 by 4.9px
  3. [resolve_overlap] node22: Overlaps with node21 by 3.2px
  ...
```

---

### 2. Optimize Layout

Optimize an SVG layout using a specified algorithm and save the result.

```bash
node lib/svg-layout-analyzer-integration-example.js optimize <input.svg> <output.svg> [algorithm] [--iterations N]
```

**Parameters:**
- `input.svg` - Source SVG file
- `output.svg` - Destination for optimized SVG
- `algorithm` - Layout algorithm:
  - `force-directed` (default) - Physics-based simulation
  - `hierarchical` - Layer-based for DAGs
  - `circular` - Radial arrangement
- `--iterations N` - Number of optimization iterations (default: 100)

**Examples:**
```bash
# Optimize with default force-directed algorithm
node lib/svg-layout-analyzer-integration-example.js optimize input.svg output.svg

# Use hierarchical layout
node lib/svg-layout-analyzer-integration-example.js optimize input.svg output.svg hierarchical

# Force-directed with more iterations (slower, better quality)
node lib/svg-layout-analyzer-integration-example.js optimize input.svg output.svg force-directed --iterations 200

# Circular layout with 50 iterations
node lib/svg-layout-analyzer-integration-example.js optimize input.svg output.svg circular --iterations 50
```

**Output:**
```
✓ Optimized SVG saved to output.svg

Improvement metrics:
  Overlaps reduced: 12 (100.0%)
  Visibility issues reduced: 8
  Density reduction: 45.3%
```

---

### 3. Compare Algorithms

Test all three layout algorithms and compare results.

```bash
node lib/svg-layout-analyzer-integration-example.js compare <file.svg> [--iterations N]
```

**Parameters:**
- `file.svg` - SVG file to analyze
- `--iterations N` - Iterations per algorithm (default: 100)

**Example:**
```bash
# Compare all algorithms with 100 iterations each
node lib/svg-layout-analyzer-integration-example.js compare map.svg

# Use 150 iterations for better quality
node lib/svg-layout-analyzer-integration-example.js compare map.svg --iterations 150
```

**Output:**
```
╔══════════════════════════════════════════════════════════╗
║  Algorithm Comparison: map.svg
╚══════════════════════════════════════════════════════════╝

Testing force-directed...
Testing hierarchical...
Testing circular...

Results:

┌─────────────────────┬─────────┬──────────────────┬──────────────────┬────────────┐
│ (index)             │ overlaps│ visibility_issues│ overlaps_reduction│ duration_ms│
├─────────────────────┼─────────┼──────────────────┼──────────────────┼────────────┤
│ force-directed      │ 2       │ 1                │ 10                │ 45.2       │
│ hierarchical        │ 4       │ 3                │ 8                 │ 2.1        │
│ circular            │ 6       │ 5                │ 6                 │ 0.8        │
└─────────────────────┴─────────┴──────────────────┴──────────────────┴────────────┘

✓ Recommended algorithm: force-directed
  Reduces overlaps by 83.3%
```

---

### 4. Batch Process Directory

Process all SVG files in a directory with the same algorithm.

```bash
node lib/svg-layout-analyzer-integration-example.js batch <directory> [algorithm] [--iterations N]
```

**Parameters:**
- `directory` - Directory containing SVG files
- `algorithm` - Layout algorithm (default: force-directed)
- `--iterations N` - Iterations per file (default: 100)

**Example:**
```bash
# Process all SVGs with force-directed layout
node lib/svg-layout-analyzer-integration-example.js batch ./maps/

# Use hierarchical layout for all
node lib/svg-layout-analyzer-integration-example.js batch ./maps/ hierarchical

# Optimize with 150 iterations
node lib/svg-layout-analyzer-integration-example.js batch ./maps/ force-directed --iterations 150
```

**Output:**
```
Processing 5 SVG files from ./maps/...

✓ map1.svg
✓ map2.svg
✓ map3.svg
✓ network.svg
✓ topology.svg

 Results:

┌──────────────────┬───────┬─────────────────┬─────────────────┬──────────────────┬──────┐
│ file             │ nodes │ overlaps_before │ overlaps_after  │ overlaps_reduction│duration
├──────────────────┼───────┼─────────────────┼─────────────────┼──────────────────┼──────┤
│ map1.svg         │ 50    │ 12              │ 2               │ 10                │ 45.2 │
│ map2.svg         │ 75    │ 18              │ 3               │ 15                │ 68.5 │
│ map3.svg         │ 40    │ 8               │ 1               │ 7                 │ 32.1 │
│ network.svg      │ 100   │ 25              │ 4               │ 21                │ 98.3 │
│ topology.svg     │ 60    │ 15              │ 2               │ 13                │ 54.7 │
└──────────────────┴───────┴─────────────────┴─────────────────┴──────────────────┴──────┘

Summary:
  Total overlaps reduced: 66
  Average reduction: 85.3%
  Output saved to: ./maps/optimized/
```

---

## Algorithm Guide

### Force-Directed Layout
Best for: General graphs, network diagrams, organic layouts

**Characteristics:**
- Uses physics simulation (repulsive and attractive forces)
- Prevents node overlaps
- Nodes spread naturally
- Requires 50-200 iterations

**Performance:**
- 100 nodes: ~50ms (100 iterations)
- 1000 nodes: ~500ms (100 iterations)

**Use when:**
- You want natural-looking layouts
- Overlap reduction is critical
- Layout quality > speed is priority

```bash
node lib/svg-layout-analyzer-integration-example.js optimize map.svg out.svg force-directed --iterations 150
```

### Hierarchical Layout
Best for: Organizational charts, dependency graphs, DAGs (directed acyclic graphs)

**Characteristics:**
- Arranges nodes in layers
- Minimizes edge crossings
- Linear time complexity O(n)
- Fast, deterministic output

**Performance:**
- 100 nodes: ~2ms
- 1000 nodes: ~20ms

**Use when:**
- Your graph has clear hierarchy
- Speed is more important than quality
- You need consistent results

```bash
node lib/svg-layout-analyzer-integration-example.js optimize map.svg out.svg hierarchical
```

### Circular Layout
Best for: Peer-to-peer networks, symmetric layouts, ring topologies

**Characteristics:**
- Arranges nodes in a circle
- Uniform angular spacing
- Very fast O(n)
- Good for symmetrical graphs

**Performance:**
- 100 nodes: <1ms
- 1000 nodes: ~10ms

**Use when:**
- Your graph is naturally ring-shaped
- You need maximum speed
- Circular arrangement is semantically appropriate

```bash
node lib/svg-layout-analyzer-integration-example.js optimize map.svg out.svg circular
```

---

## Advanced Usage

### Tuning Iterations

Affects quality vs performance:

```bash
# Quick preview (10 iterations, very fast)
node lib/svg-layout-analyzer-integration-example.js optimize in.svg out.svg force-directed --iterations 10

# Standard quality (100 iterations, balanced)
node lib/svg-layout-analyzer-integration-example.js optimize in.svg out.svg force-directed --iterations 100

# High quality (250 iterations, slower)
node lib/svg-layout-analyzer-integration-example.js optimize in.svg out.svg force-directed --iterations 250

# Maximum quality (500 iterations, very slow)
node lib/svg-layout-analyzer-integration-example.js optimize in.svg out.svg force-directed --iterations 500
```

### Batch Processing with Verbosity

```bash
# Show results for each file
node lib/svg-layout-analyzer-integration-example.js batch ./maps/ force-directed --iterations 100
```

### Comparing Quality Between Algorithms

For a specific file:

```bash
# Test all algorithms to find best one
node lib/svg-layout-analyzer-integration-example.js compare map.svg --iterations 150

# Then use the recommended algorithm
node lib/svg-layout-analyzer-integration-example.js optimize map.svg optimized.svg force-directed --iterations 150
```

---

## Output Files

### Optimized SVG
- Location: `<output.svg>` or `<input-dir>/optimized/`
- Format: Standard SVG markup
- Includes: Node circles, edges, text labels
- Styling: Basic colors and strokes

### Analysis Reports
- Console output only (no file)
- Contains: Metrics, suggestions, comparisons
- Can be captured: `> report.txt`

---

## Performance Tips

1. **Large Files (500+ nodes):**
   ```bash
   # Use fewer iterations and hierarchical layout
   node lib/svg-layout-analyzer-integration-example.js optimize large.svg out.svg hierarchical --iterations 50
   ```

2. **Real-Time Processing:**
   ```bash
   # Use circular or hierarchical for instant results
   node lib/svg-layout-analyzer-integration-example.js optimize map.svg out.svg circular
   ```

3. **Batch Production Quality:**
   ```bash
   # Use force-directed with many iterations
   node lib/svg-layout-analyzer-integration-example.js batch ./maps/ force-directed --iterations 200
   ```

4. **Offline/Development:**
   ```bash
   # Use force-directed with high iterations
   node lib/svg-layout-analyzer-integration-example.js optimize map.svg out.svg force-directed --iterations 500
   ```

---

## Troubleshooting

**No output file created:**
- Check output directory exists
- Ensure write permissions
- Verify input SVG is valid

**Optimization takes too long:**
- Reduce `--iterations` value
- Use `hierarchical` or `circular` instead
- Check node count (n² complexity for force-directed)

**Poor layout quality:**
- Increase `--iterations` (try 200-500)
- Try different algorithm
- Check input SVG validity

**Memory issues with large files:**
- Use `hierarchical` layout (lower memory)
- Process in batches
- Reduce iterations

---

## Integration with Other Tools

### Using in Scripts
```bash
#!/bin/bash
for file in maps/*.svg; do
  node lib/svg-layout-analyzer-integration-example.js optimize "$file" "optimized/$file" force-directed
done
```

### Export as Variable
```bash
RESULT=$(node lib/svg-layout-analyzer-integration-example.js analyze map.svg)
echo "$RESULT" > analysis.txt
```

### Watch Directory
```bash
# With entr or similar file watcher
ls maps/*.svg | entr -c 'node lib/svg-layout-analyzer-integration-example.js batch maps/'
```

---

## Exit Codes

- `0` - Success
- `1` - Error (file not found, invalid SVG, etc.)

---

## Related Documentation

- [SVG_LAYOUT_ANALYZER_README.md](./SVG_LAYOUT_ANALYZER_README.md) - Full API reference
- [SVG_LAYOUT_ANALYZER_DELIVERABLES.md](./SVG_LAYOUT_ANALYZER_DELIVERABLES.md) - Project summary
