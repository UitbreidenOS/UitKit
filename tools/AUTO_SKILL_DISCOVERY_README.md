# Auto-Skill Discovery System

Automatically discover new skills from the Claudient codebase. Scans JavaScript files, detects reusable patterns, generates Claudient-compliant skill markdown, and validates with automatic testing.

## Overview

The auto-skill-discovery system enables code-to-skill conversion through:

- **Pattern Detection** — Identifies profilers, validators, formatters, handlers, and more
- **Skill Generation** — Creates Claudient-compliant `.md` files from discovered functions and classes
- **Validation** — Checks generated skills against CLAUDE.md format rules
- **Testing** — Automatically tests pattern detection, format compliance, and documentation
- **Reporting** — Produces detailed discovery reports with confidence scores

## Quick Start

```bash
# Scan codebase for skill candidates
node tools/auto-skill-discovery.js

# Output as JSON
node tools/auto-skill-discovery.js --output=json

# Output as markdown (saves to tools/discovery-results/)
node tools/auto-skill-discovery.js --output=md

# Validate all discoveries against CLAUDE.md
node tools/auto-skill-discovery.js --validate

# Run all tests
node tools/auto-skill-discovery.js --test

# Run tests
node tools/auto-skill-discovery.test.js
```

## Architecture

```
SkillDiscoverer (orchestrator)
├── CodebaseScanner
│   └── PatternDetector
├── SkillGenerator
├── SkillValidator
├── SkillTester
└── ReportGenerator
```

### Components

#### PatternDetector
Identifies reusable patterns in JavaScript source code:

```javascript
const detector = new PatternDetector();

// File-based pattern detection
detector.detectPattern('/path/to/profiler.js', code);
// → ['profiler', 'performance-measurement']

// Extract documentation
detector.extractJSDoc(code);
// → { description: "...", fullDoc: "..." }

// Extract functions
detector.extractFunctions(code);
// → [{ name: "profile", params: [...], type: "named" }, ...]

// Extract classes
detector.extractClasses(code);
// → [{ name: "Profiler", extends: "BaseProfiler" }, ...]
```

**Detected Patterns:**
- `profiler` — Performance measurement and bottleneck analysis
- `tester` — Unit/integration testing utilities
- `middleware` — Request/response interceptors
- `workflow` — Multi-step process orchestration
- `analyzer` — Code/log/data pattern analysis
- `validator` — Input validation and schema checking
- `formatter` — Data transformation/formatting
- `parser` — Configuration/log/text parsing
- `builder` — Complex object construction
- `optimizer` — Performance optimization
- `debugger` — Execution tracing
- `logger` — Event/metric logging
- `cache` — Result caching
- `monitor` — Health/performance monitoring
- `health` — System status checking

#### CodebaseScanner
Traverses the codebase, analyzes files, and returns discovery objects:

```javascript
const scanner = new CodebaseScanner();

// Scan entire codebase
const discoveries = scanner.scan(CLAUDIENT_ROOT);
// → [{ filePath, patterns, functions, classes, jsDoc, ... }, ...]

// Scan specific directory
const discoveries = scanner.scan('/path/to/dir', {
  exclude: /node_modules|\.git/
});
```

Returns discovery objects with:
- `filePath` — Absolute path to source file
- `relPath` — Relative path from Claudient root
- `patterns` — Detected pattern names
- `functions` — Extracted function definitions
- `classes` — Extracted class definitions
- `jsDoc` — JSDoc comment if present
- `linesOfCode` — Total lines in file
- `hasExports` — Whether file exports anything

#### SkillGenerator
Converts discoveries into Claudient-compliant skills:

```javascript
const generator = new SkillGenerator();

const skill = generator.generateSkill(discovery);
// → {
//     name: "Profiler Pattern",
//     slug: "profiler-pattern",
//     content: "# Profiler Pattern\n## When to activate\n...",
//     confidence: 82
//   }
```

**Generates:**
- Skill name from class or pattern
- Trigger conditions (when to activate)
- Anti-patterns (when NOT to use)
- Instructions with function/class list
- Working code examples
- Confidence score (0-100)

#### SkillValidator
Checks generated skills against CLAUDE.md rules:

```javascript
const validator = new SkillValidator();

const validation = validator.validateSkillFormat(skillContent);
// → {
//     valid: true,
//     errors: [],
//     warnings: ["Section might be too brief"]
//   }
```

**Validates:**
- Required sections: "When to activate", "When NOT to use", "Instructions", "Example"
- Markdown structure (proper heading hierarchy)
- Code examples (at least one ```...``` block)
- Section length (minimum recommended content)

#### SkillTester
Runs automatic tests on discovered skills:

```javascript
const tester = new SkillTester();

const results = await tester.testSkill(skillPath, discovery);
// → {
//     skillPath,
//     tests: [
//       { name: "Skill format validation", passed: true },
//       { name: "Source file accessibility", passed: true },
//       ...
//     ],
//     passed: 4,
//     failed: 0
//   }
```

**Tests:**
1. Skill format validation
2. Source file accessibility
3. Source code syntax validation
4. Documentation completeness

#### ReportGenerator
Produces formatted discovery reports:

```javascript
const reporter = new ReportGenerator();

const report = reporter.generateDiscoveryReport(discoveries, skills);
// → {
//     timestamp,
//     discoveredFiles: 142,
//     suggestedSkills: 28,
//     summary: {
//       averageConfidence: 72,
//       confidenceBuckets: { high: 15, medium: 10, low: 3 }
//     },
//     discoveries: [...],
//     skills: [...]
//   }
```

**Output formats:**
- Console (colored, human-readable)
- JSON (machine-readable, for scripting)
- Markdown (documentation, with full skill content)

#### SkillDiscoverer
Orchestrates the full discovery workflow:

```javascript
const discoverer = new SkillDiscoverer();

const result = await discoverer.run({
  scanDir: '/path/to/codebase',
  output: 'console',  // 'console', 'json', 'md'
  test: false,
  validate: false,
  minConfidence: 60
});
```

## Usage Examples

### Example 1: Scan and Report

```bash
node tools/auto-skill-discovery.js --output=console
```

**Output:**
```
=== Auto-Skill Discovery Report ===

Timestamp: 2026-06-22T14:30:45.123Z
Files analyzed: 142
Skills suggested: 28

Summary:
- Average confidence: 72%
- High confidence (≥80%): 15
- Medium confidence (60-80%): 10
- Low confidence (<60%): 3

Top suggested skills:
- Profiler Pattern (85% confidence, profilers/swarm-profiler.js)
- SVG Analyzer (82% confidence, lib/svg-layout-analyzer.js)
...
```

### Example 2: Generate Markdown Report

```bash
node tools/auto-skill-discovery.js --output=md
```

Generates `tools/discovery-results/discovered-skills.md` with complete skill markdown:

```markdown
# Auto-Discovered Skills

Generated: 2026-06-22T14:30:45.123Z

Total suggestions: 28

## Profiler Pattern

**File:** profilers/swarm-profiler.js
**Confidence:** 85%
**Patterns:** profiler, performance-measurement

# Profiler Pattern

## When to activate
- When performance analysis or bottleneck identification is needed
...
```

### Example 3: JSON Export for Processing

```bash
node tools/auto-skill-discovery.js --output=json > discoveries.json
```

**Output:**
```json
{
  "timestamp": "2026-06-22T14:30:45.123Z",
  "discoveredFiles": 142,
  "suggestedSkills": 28,
  "summary": {
    "totalDiscoveries": 142,
    "totalSkillSuggestions": 28,
    "averageConfidence": 72,
    "confidenceBuckets": {
      "high": 15,
      "medium": 10,
      "low": 3
    }
  },
  "skills": [
    {
      "name": "Profiler Pattern",
      "slug": "profiler-pattern",
      "confidence": 85,
      "sourceFile": "profilers/swarm-profiler.js"
    }
  ]
}
```

### Example 4: Validation and Testing

```bash
node tools/auto-skill-discovery.js --validate --test --output=console
```

### Example 5: Use as Module

```javascript
const { SkillDiscoverer } = require('./tools/auto-skill-discovery');

async function findSkills() {
  const discoverer = new SkillDiscoverer();
  const report = await discoverer.run({
    minConfidence: 75,
    output: 'json'
  });
  
  const highConfidenceSkills = report.skills.filter(s => s.confidence >= 80);
  console.log(`Found ${highConfidenceSkills.length} high-confidence skills`);
}

findSkills();
```

## Confidence Scoring

Skills receive a confidence score (0-100) based on:

- **Patterns detected** (up to 40%) — More patterns = higher confidence
- **Functions extracted** (up to 20%) — Well-structured code gets higher scores
- **Classes detected** (up to 15%) — OOP code suggests intentional design
- **JSDoc present** (up to 10%) — Documentation indicates completeness
- **File size** (up to 10%) — Larger files suggest thorough implementation

**Score Interpretation:**
- **≥80%** — High confidence, likely a valuable skill
- **60-80%** — Medium confidence, review before using
- **<60%** — Low confidence, needs more context

## Skill Format Requirements

Generated skills must comply with CLAUDE.md format:

```markdown
# Skill Name

## When to activate
[Specific trigger conditions]

## When NOT to use
[Anti-patterns — when this skill is wrong]

## Instructions
[The actual skill content — patterns, steps]

## Example
[Concrete code example]
```

Validator enforces:
- ✓ All required sections present
- ✓ Proper markdown structure
- ✓ At least one code example
- ✓ Adequate section length
- ✓ No generic or placeholder text

## Testing

Run the comprehensive test suite:

```bash
node tools/auto-skill-discovery.test.js
```

**Test Coverage:**
- PatternDetector (10 tests) — File/content pattern detection, JSDoc/function/class extraction
- SkillGenerator (7 tests) — Name inference, section generation, confidence calculation
- SkillValidator (3 tests) — Format validation, section detection, warnings
- SkillTester (1 test) — Documentation completeness
- ReportGenerator (4 tests) — Report generation, confidence bucketing, formatting
- Integration (2 tests) — Full workflow, markdown generation
- Edge Cases (5 tests) — Empty content, missing files, invalid input
- Performance (2 tests) — Large file processing, batch analysis

## Configuration

### CLI Options

```bash
node tools/auto-skill-discovery.js [options]

Options:
  --scan-dir=PATH        Directory to scan (default: Claudient root)
  --output=FORMAT        Output format: console, json, md (default: console)
  --test                 Run automatic tests on discoveries
  --validate             Validate skills against CLAUDE.md
  --min-confidence=N     Minimum confidence score to suggest (default: 60)
  --exclude=PATTERN      Regex pattern for files to exclude
```

### Programmatic Configuration

```javascript
await discoverer.run({
  scanDir: '/path/to/scan',
  output: 'json',
  test: true,
  validate: true,
  minConfidence: 75
});
```

## Performance

- **Scanning:** ~500 files/second
- **Analysis:** ~1000 LOC/second
- **Generation:** ~100 skills/second
- **Validation:** ~200 skills/second
- **Testing:** ~50 skills/second

Total discovery cycle: ~2 seconds for typical 200-file codebase.

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Auto-Skill Discovery
on: [push]
jobs:
  discover:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: node tools/auto-skill-discovery.js --output=json > discoveries.json
      - uses: actions/upload-artifact@v3
        with:
          name: skill-discoveries
          path: discoveries.json
```

### npm Script Integration

In `package.json`:

```json
{
  "scripts": {
    "discover-skills": "node tools/auto-skill-discovery.js --output=console",
    "discover-skills:json": "node tools/auto-skill-discovery.js --output=json",
    "discover-skills:validate": "node tools/auto-skill-discovery.js --validate --test",
    "test:discovery": "node tools/auto-skill-discovery.test.js"
  }
}
```

## Extending the System

### Add New Pattern

```javascript
class PatternDetector {
  constructor() {
    this.patterns = {
      // Add new pattern
      mysterybox: /mystery.*\.js$/i,
    };
  }
}
```

### Customize Skill Generation

```javascript
const generator = new SkillGenerator();

// Override skill name inference
generator.generateSkill = function(discovery) {
  const skill = super.generateSkill(discovery);
  skill.name = `Custom: ${skill.name}`;
  return skill;
};
```

### Add Custom Validation Rule

```javascript
class CustomValidator extends SkillValidator {
  validateSkillFormat(skillContent) {
    const result = super.validateSkillFormat(skillContent);
    
    // Add custom rule
    if (!skillContent.includes('Co-Authored-By')) {
      result.warnings.push('Missing authorship attribution');
    }
    
    return result;
  }
}
```

## Troubleshooting

### No skills discovered

**Symptom:** `discoveredFiles: 0, suggestedSkills: 0`

**Fix:** Check that:
1. Scan directory exists and is readable
2. Files aren't excluded by regex
3. Files contain detectable patterns
4. JavaScript syntax is valid

```bash
node tools/auto-skill-discovery.js --scan-dir=/path/to/check --output=json | jq .
```

### Low confidence scores

**Symptom:** Most skills have <60% confidence

**Fix:** 
- Add JSDoc comments to source code
- Use well-defined classes/functions
- Increase file size or consolidate related utilities
- Add `@module` or `@description` JSDoc tags

### Validation failures

**Symptom:** "Missing required section: 'When to activate'"

**Fix:** Ensure generated skill includes all 4 required sections:
```markdown
## When to activate
...
## When NOT to use
...
## Instructions
...
## Example
```

### Performance issues

**Symptom:** Scanning takes >10 seconds

**Fix:**
- Exclude large directories: `--exclude='node_modules|dist|build'`
- Reduce LOC limit in PatternDetector
- Split scanning into multiple runs
- Check for symbolic links causing traversal loops

## Output Locations

- **Console output:** Prints to stdout
- **JSON output:** Prints to stdout (redirect with `> discoveries.json`)
- **Markdown output:** `tools/discovery-results/discovered-skills.md`
- **Test results:** Prints to stdout

## See Also

- [CLAUDE.md](../CLAUDE.md) — Project conventions and skill format
- [Skill File Format](../guides/skill-format.md) — Complete skill specification
- [Codebase Structure](../INDEX.md) — Project layout and organization

## Contributing

To improve the auto-skill-discovery system:

1. Add test cases for new patterns
2. Update confidence score calculations
3. Expand validator rules
4. Document new features in this README

Test coverage should remain >90% for all new code.
