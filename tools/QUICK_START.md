# Auto-Skill Discovery: Quick Start

Get started with auto-skill-discovery in 5 minutes.

## Installation

No additional dependencies required — uses only Node.js built-ins.

```bash
cd /Users/tushar/Desktop/Claudient
```

## Usage

### 1. Run Discovery

```bash
node tools/auto-skill-discovery.js
```

Output:
```
✓ Found 169 potential skill candidates
✓ Generated 119 skill suggestions

=== Auto-Skill Discovery Report ===
Timestamp: 2026-06-22T10:28:57.611Z
Files analyzed: 169
Skills suggested: 119

Summary:
- Average confidence: 76%
- High confidence (≥80%): 64
```

### 2. Generate Documentation

```bash
node tools/auto-skill-discovery.js --output=md
```

Creates: `tools/discovery-results/discovered-skills.md` (143 KB)

Contains full skill markdown with:
- Skill names and confidence scores
- When to activate / When NOT to use sections
- Instructions and code examples
- Source file references

### 3. Export as JSON

```bash
node tools/auto-skill-discovery.js --output=json > discoveries.json
```

Machine-readable format for scripting/processing.

### 4. Run Tests

```bash
node tools/auto-skill-discovery.test.js
```

Output:
```
=== Auto-Skill Discovery Test Suite ===

✓ PatternDetector: detect profiler pattern from filename
✓ PatternDetector: extract JSDoc comments
...
Results: 33 passed, 0 failed
```

## Key Features

| Feature | Command |
|---------|---------|
| Console report | `node tools/auto-skill-discovery.js` |
| Markdown docs | `--output=md` |
| JSON export | `--output=json` |
| High confidence only | `--min-confidence=85` |
| Validate format | `--validate` |
| Run tests | `--test` |

## What It Does

```
Input: Codebase (213 JS files)
  ↓
[Scan & Pattern Detection]
  ↓
Discoveries: 169 candidates (functions, classes, patterns)
  ↓
[Skill Generation]
  ↓
Skills: 119 suggestions (Claudient-compliant markdown)
  ↓
[Validation & Testing]
  ↓
Report: Console, Markdown, or JSON
```

## Sample Results

### Discovered Skills (119 total)

**High Confidence (≥80%):**
- SandboxBench Usage — 95% (profilers/swarm-sandbox-benchmark.js)
- Message Usage — 95% (lib/agent-orchestration.js)
- CommunityForum Usage — 95% (lib/community-forum.js)
- ThemeStore Usage — 95% (load-tests/matrix-theme-load.js)
- SandboxSimulator Usage — 95% (load-tests/swarm-sandbox-load.js)

(64 total high-confidence skills)

**Medium Confidence (60-80%):**
- 55 additional skills
- Ready for review before adding to skills/ directory

## Generated Skill Format

Each discovered skill generates Claudient-compliant markdown:

```markdown
# SandboxBench Usage

## When to activate
When class-based functionality is needed
- When performance-measurement is needed

## When NOT to use
- Not a replacement for proper testing
- Don't use for one-off tasks

## Instructions
**Classes:**
- `SandboxBench`

**Key Functions:**
- `log(msg, level = 'INFO')`
- `runBenchmarkSuite(topologies, iterations)`

**Usage Steps:**
1. Import the module
2. Instantiate the class
3. Call methods as needed

## Example
```javascript
const { SandboxBench } = require('./path/to/swarm-sandbox-benchmark.js');
const instance = new SandboxBench();
console.log(instance);
```
```

## Next Steps

### Option A: Review & Copy

1. Open `tools/discovery-results/discovered-skills.md`
2. Review high-confidence (≥80%) skills
3. Copy to `skills/` directory
4. Customize as needed

### Option B: Integrate into Workflow

Add to `package.json`:
```json
{
  "scripts": {
    "discover:skills": "node tools/auto-skill-discovery.js"
  }
}
```

Run: `npm run discover:skills`

### Option C: Use as Module

```javascript
const { SkillDiscoverer } = require('./tools/auto-skill-discovery');

const discoverer = new SkillDiscoverer();
const report = await discoverer.run({ output: 'json' });
console.log(`Found ${report.summary.totalSkillSuggestions} skills`);
```

## Common Tasks

### Find only profiler skills
```bash
node tools/auto-skill-discovery.js --output=json | jq '.skills | map(select(.sourceFile | contains("profiler")))'
```

### Filter by confidence threshold
```bash
node tools/auto-skill-discovery.js --min-confidence=90
```

### Validate format compliance
```bash
node tools/auto-skill-discovery.js --validate
```

### Save individual skills
```bash
# Extract from markdown and save
node tools/auto-skill-discovery.js --output=md
# Then manually copy sections to skills/ as needed
```

## Architecture

Four main components:

1. **PatternDetector** — Finds reusable patterns in code
2. **SkillGenerator** — Creates Claudient-compliant markdown
3. **SkillValidator** — Checks format compliance
4. **ReportGenerator** — Produces reports

All components are reusable as a module.

## Supported Patterns

The system detects:
- `profiler` — Performance analysis tools
- `tester` — Testing utilities
- `middleware` — Request/response handlers
- `workflow` — Process orchestration
- `analyzer` — Code/data analysis
- `validator` — Input validation
- `formatter` — Data transformation
- `parser` — Text/config parsing
- `builder` — Complex object construction
- `optimizer` — Performance optimization
- `debugger` — Execution tracing
- `logger` — Event logging
- `cache` — Result caching
- `monitor` — Health monitoring
- `class-based` — Class implementations
- `function-export` — Function utilities
- `async-handler` — Async functions
- `performance-measurement` — Perf hooks usage
- `data-serialization` — JSON/data handling
- `testing-utility` — Test helpers

## Troubleshooting

**Q: No skills found?**  
A: Check that JS files exist: `find . -name "*.js" | wc -l`

**Q: Low confidence scores?**  
A: Add JSDoc comments and well-structure code

**Q: Slow scanning?**  
A: Exclude large dirs: `--exclude="node_modules|dist"`

**Q: Want to customize?**  
A: See `AUTO_SKILL_DISCOVERY.md` for full API

## Performance

- **Scanning:** 212 JS files in ~2 seconds
- **Analysis:** 169 discoveries in ~0.5 seconds
- **Generation:** 119 skills in ~0.5 seconds
- **Total:** ~3 seconds for full report

## Files Included

- `tools/auto-skill-discovery.js` — Main system (700+ lines)
- `tools/auto-skill-discovery.test.js` — 33 comprehensive tests
- `tools/AUTO_SKILL_DISCOVERY.md` — Full documentation
- `tools/AUTO_SKILL_DISCOVERY_EXAMPLES.md` — Usage examples
- `tools/discovery-results/discovered-skills.md` — Generated report

## Documentation

- **Full API:** `AUTO_SKILL_DISCOVERY.md`
- **Examples:** `AUTO_SKILL_DISCOVERY_EXAMPLES.md`
- **Caveman Mode:** ✓ Enabled (no conversational output)

## License

Part of Claudient repository. Uses Node.js built-ins only.

---

**Ready?** Run: `node tools/auto-skill-discovery.js`
