# Auto-Skill Discovery Examples

Practical examples for using the auto-skill-discovery system in various contexts.

## CLI Examples

### Basic Discovery Report

```bash
node tools/auto-skill-discovery.js
```

Shows colorized console output with top suggestions:

```
=== Auto-Skill Discovery Report ===

Timestamp: 2026-06-22T10:28:57.611Z
Files analyzed: 169
Skills suggested: 119

Summary:
- Average confidence: 76%
- High confidence (≥80%): 64
- Medium confidence (60-80%): 55
- Low confidence (<60%): 0

Top suggested skills:
- SandboxBench Usage (95% confidence, benchmarks/swarm-sandbox-benchmark.js)
- Message Usage (95% confidence, lib/agent-orchestration.js)
- CommunityForum Usage (95% confidence, lib/community-forum.js)
...
```

### Export to JSON

```bash
# Generate JSON report
node tools/auto-skill-discovery.js --output=json > discoveries.json

# Process with jq
jq '.summary' discoveries.json
jq '.skills | sort_by(.confidence) | reverse | .[0:10]' discoveries.json

# Filter high-confidence skills
jq '.skills | map(select(.confidence >= 80))' discoveries.json
```

**Output sample:**
```json
{
  "timestamp": "2026-06-22T10:28:57.611Z",
  "discoveredFiles": 169,
  "suggestedSkills": 119,
  "summary": {
    "totalDiscoveries": 169,
    "totalSkillSuggestions": 119,
    "averageConfidence": 76,
    "confidenceBuckets": {
      "high": 64,
      "medium": 55,
      "low": 0
    }
  },
  "skills": [
    {
      "name": "SandboxBench Usage",
      "slug": "sandboxbench-usage",
      "confidence": 95,
      "sourceFile": "benchmarks/swarm-sandbox-benchmark.js"
    }
  ]
}
```

### Generate Markdown Documentation

```bash
# Create full markdown report
node tools/auto-skill-discovery.js --output=md

# Output goes to: tools/discovery-results/discovered-skills.md
cat tools/discovery-results/discovered-skills.md
```

Sample output structure:
```markdown
# Auto-Discovered Skills

Generated: 2026-06-22T10:28:57.611Z

Total suggestions: 119

## SandboxBench Usage

**File:** benchmarks/swarm-sandbox-benchmark.js
**Confidence:** 95%
**Patterns:** class-based, function-export, performance-measurement

# SandboxBench Usage

## When to activate
When class-based functionality is needed
- When performance-measurement is needed
...

## When NOT to use
This skill is not a replacement for proper testing
...

## Instructions
...

## Example
```

### Validate and Test

```bash
# Validate all discoveries
node tools/auto-skill-discovery.js --validate --output=console

# Run tests on discoveries
node tools/auto-skill-discovery.js --test --output=console

# Full validation and testing pipeline
node tools/auto-skill-discovery.js --validate --test --output=json > validated-discoveries.json
```

### Filter by Confidence

```bash
# Only high-confidence suggestions (≥80%)
node tools/auto-skill-discovery.js --min-confidence=80

# Only very high confidence (≥90%)
node tools/auto-skill-discovery.js --min-confidence=90

# Include marginal suggestions
node tools/auto-skill-discovery.js --min-confidence=50
```

### Scan Specific Directory

```bash
# Scan only profilers
node tools/auto-skill-discovery.js --scan-dir=profilers --output=json

# Scan with exclusions
node tools/auto-skill-discovery.js --exclude="test|mock|old" --output=console
```

## Programmatic Examples

### Basic Discovery

```javascript
const { SkillDiscoverer } = require('./tools/auto-skill-discovery');

async function findSkills() {
  const discoverer = new SkillDiscoverer();
  
  const result = await discoverer.run({
    output: 'console'
  });
  
  console.log(`Found ${result.summary.totalSkillSuggestions} skills`);
}

findSkills();
```

### High-Confidence Skills Only

```javascript
const { SkillDiscoverer } = require('./tools/auto-skill-discovery');

async function findHighConfidenceSkills() {
  const discoverer = new SkillDiscoverer();
  
  const result = await discoverer.run({
    minConfidence: 85,
    output: 'json'
  });
  
  const topSkills = result.skills
    .filter(s => s.confidence >= 90)
    .sort((a, b) => b.confidence - a.confidence);
  
  console.log('Top skills:');
  topSkills.forEach(skill => {
    console.log(`- ${skill.name} (${skill.confidence}%)`);
  });
}

findHighConfidenceSkills();
```

### Process and Save Results

```javascript
const { SkillDiscoverer } = require('./tools/auto-skill-discovery');
const fs = require('fs');
const path = require('path');

async function discoverAndSaveSkills() {
  const discoverer = new SkillDiscoverer();
  
  // Run discovery
  const result = await discoverer.run({
    minConfidence: 70,
    output: 'json'
  });
  
  // Save individual skill files
  const skillsDir = './discovered-skills';
  if (!fs.existsSync(skillsDir)) {
    fs.mkdirSync(skillsDir);
  }
  
  // Extract markdown for each skill
  const mdResult = await discoverer.run({
    minConfidence: 70,
    output: 'md'
  });
  
  // Save to file
  fs.writeFileSync(
    path.join(skillsDir, 'ALL_SKILLS.md'),
    mdResult
  );
  
  // Save JSON metadata
  fs.writeFileSync(
    path.join(skillsDir, 'metadata.json'),
    JSON.stringify(result, null, 2)
  );
  
  console.log(`✓ Saved ${result.summary.totalSkillSuggestions} skills`);
}

discoverAndSaveSkills();
```

### Pattern Detection Only

```javascript
const { PatternDetector, CodebaseScanner } = require('./tools/auto-skill-discovery');
const fs = require('fs');

function analyzePatterns() {
  const scanner = new CodebaseScanner();
  const discoveries = scanner.scan('./profilers');
  
  // Group by pattern
  const byPattern = {};
  discoveries.forEach(d => {
    d.patterns.forEach(p => {
      if (!byPattern[p]) byPattern[p] = [];
      byPattern[p].push(d.fileName);
    });
  });
  
  // Report
  Object.entries(byPattern).forEach(([pattern, files]) => {
    console.log(`\n${pattern}:`);
    files.forEach(f => console.log(`  - ${f}`));
  });
}

analyzePatterns();
```

### Custom Skill Generation

```javascript
const { SkillGenerator } = require('./tools/auto-skill-discovery');

class CustomSkillGenerator extends SkillGenerator {
  generateInstructions(discovery) {
    const base = super.generateInstructions(discovery);
    
    // Add custom instructions
    const custom = `
## Best Practices
- Always validate inputs before processing
- Use error handling for all operations
- Follow the established naming conventions
`;
    
    return base + '\n' + custom;
  }
  
  inferSkillName(discovery) {
    const base = super.inferSkillName(discovery);
    
    // Prepend with category
    if (discovery.patterns.includes('profiler')) {
      return `[Performance] ${base}`;
    }
    
    return base;
  }
}

const generator = new CustomSkillGenerator();
const skill = generator.generateSkill({
  fileName: 'profiler.js',
  patterns: ['profiler'],
  functions: [{ name: 'profile', params: ['fn'] }],
  classes: [],
  jsDoc: null,
  linesOfCode: 200
});

console.log(skill.content);
```

### Skill Validation Pipeline

```javascript
const { SkillValidator, SkillDiscoverer } = require('./tools/auto-skill-discovery');
const fs = require('fs');

async function validateDiscoveredSkills() {
  const discoverer = new SkillDiscoverer();
  const validator = new SkillValidator();
  
  // Get markdown output with full skills
  const mdReport = await discoverer.run({
    output: 'md'
  });
  
  // Parse skills from markdown
  const skillBlocks = mdReport.split('## ').slice(1);
  const validationResults = [];
  
  skillBlocks.forEach(block => {
    const skillContent = '## ' + block;
    const validation = validator.validateSkillFormat(skillContent);
    
    const name = block.split('\n')[0];
    validationResults.push({
      name,
      ...validation
    });
  });
  
  // Report
  const valid = validationResults.filter(r => r.valid).length;
  const invalid = validationResults.filter(r => !r.valid).length;
  
  console.log(`Valid: ${valid}, Invalid: ${invalid}`);
  
  // Show errors
  validationResults
    .filter(r => !r.valid)
    .forEach(r => {
      console.log(`\n❌ ${r.name}`);
      r.errors.forEach(e => console.log(`   ${e}`));
    });
}

validateDiscoveredSkills();
```

### CI/CD Integration (Node.js)

```javascript
// scripts/check-skill-coverage.js
const { SkillDiscoverer } = require('./tools/auto-skill-discovery');

async function checkSkillCoverage() {
  const discoverer = new SkillDiscoverer();
  
  const result = await discoverer.run({
    minConfidence: 75,
    output: 'json'
  });
  
  const { summary } = result;
  
  // Define quality gates
  const MIN_SKILLS = 50;
  const MIN_AVG_CONFIDENCE = 70;
  const MIN_HIGH_CONFIDENCE = 30;
  
  let passed = true;
  
  if (summary.totalSkillSuggestions < MIN_SKILLS) {
    console.error(`❌ Too few skills: ${summary.totalSkillSuggestions} < ${MIN_SKILLS}`);
    passed = false;
  }
  
  if (summary.averageConfidence < MIN_AVG_CONFIDENCE) {
    console.error(`❌ Low average confidence: ${summary.averageConfidence}% < ${MIN_AVG_CONFIDENCE}%`);
    passed = false;
  }
  
  if (summary.confidenceBuckets.high < MIN_HIGH_CONFIDENCE) {
    console.error(`❌ Too few high-confidence skills: ${summary.confidenceBuckets.high} < ${MIN_HIGH_CONFIDENCE}`);
    passed = false;
  }
  
  if (passed) {
    console.log('✓ All skill coverage gates passed');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

checkSkillCoverage();
```

Add to `package.json`:
```json
{
  "scripts": {
    "check:skills": "node scripts/check-skill-coverage.js"
  }
}
```

## Integration with Build System

### npm Scripts

```json
{
  "scripts": {
    "discover:skills": "node tools/auto-skill-discovery.js --output=console",
    "discover:skills:json": "node tools/auto-skill-discovery.js --output=json",
    "discover:skills:docs": "node tools/auto-skill-discovery.js --output=md",
    "discover:skills:validate": "node tools/auto-skill-discovery.js --validate --test",
    "discover:skills:high": "node tools/auto-skill-discovery.js --min-confidence=85 --output=json",
    "test:discovery": "node tools/auto-skill-discovery.test.js",
    "ci:check-skills": "node scripts/check-skill-coverage.js"
  }
}
```

Usage:
```bash
npm run discover:skills
npm run discover:skills:docs
npm run test:discovery
```

### GitHub Actions

```yaml
name: Auto-Skill Discovery

on:
  push:
    branches: [main, develop]
    paths:
      - 'profilers/**'
      - 'lib/**'
      - 'scripts/**'
      - 'middleware/**'

jobs:
  discover:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run skill discovery
        run: npm run discover:skills:validate
      
      - name: Generate documentation
        run: npm run discover:skills:docs
      
      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: skill-discoveries
          path: tools/discovery-results/
      
      - name: Quality gates
        run: npm run ci:check-skills
```

## Use Cases

### 1. Documentation Generation

Auto-generate skill documentation from source code:

```bash
npm run discover:skills:docs
# Creates tools/discovery-results/discovered-skills.md
# Ready for review and inclusion in skills/ directory
```

### 2. Skill Auditing

Find unmaintained or undocumented utilities:

```bash
# Find low-confidence discoveries
node tools/auto-skill-discovery.js --min-confidence=40 --output=json \
  | jq '.skills | map(select(.confidence < 60))'
```

### 3. Codebase Health Check

Verify skill coverage and quality:

```bash
npm run ci:check-skills
# Enforces minimum skill count, confidence thresholds
```

### 4. Pattern Analysis

Understand architectural patterns:

```javascript
const { CodebaseScanner } = require('./tools/auto-skill-discovery');

const scanner = new CodebaseScanner();
const discoveries = scanner.scan('./lib');

// Group by pattern
const patterns = {};
discoveries.forEach(d => {
  d.patterns.forEach(p => {
    patterns[p] = (patterns[p] || 0) + 1;
  });
});

console.log('Pattern distribution:');
Object.entries(patterns)
  .sort((a, b) => b[1] - a[1])
  .forEach(([p, count]) => {
    console.log(`${p}: ${count} files`);
  });
```

### 5. Team Skills Inventory

Generate a report of available skills for the team:

```bash
node tools/auto-skill-discovery.js --output=md \
  | grep "^## " \
  | sed 's/## //' \
  | sort
```

Shows all discoverable skills:
```
Agent Usage
Analyzer Usage
CacheManager Usage
...
```

## Troubleshooting

### Issue: No Skills Discovered

Check that JavaScript files exist and are readable:

```bash
find . -name "*.js" -type f | wc -l
```

Verify pattern detection:

```javascript
const { PatternDetector } = require('./tools/auto-skill-discovery');
const fs = require('fs');

const detector = new PatternDetector();
const code = fs.readFileSync('./myfile.js', 'utf8');
const patterns = detector.detectPattern('./myfile.js', code);

console.log('Detected patterns:', patterns);
```

### Issue: Low Confidence Scores

Add JSDoc and well-structure code:

```javascript
/**
 * Performs critical operation
 * @param {Object} config - Configuration
 * @returns {Promise<Result>}
 */
class MyHandler {
  async process(config) {
    // implementation
  }
}
```

### Issue: Slow Scanning

Exclude large directories:

```bash
node tools/auto-skill-discovery.js \
  --exclude="node_modules|dist|build|\.git" \
  --output=console
```

Or use in code:

```javascript
const discoveries = scanner.scan('./', {
  exclude: /node_modules|dist|build|\.git/
});
```

## Performance Tips

1. **First run:** Scan takes ~2-5 seconds for typical codebase
2. **Caching:** Results can be cached in JSON format
3. **Parallel processing:** Modify scanner to use Worker threads for 10x+ speedup
4. **Incremental:** Scan only changed directories with `--scan-dir`

## Next Steps

1. Review generated skills in `tools/discovery-results/`
2. Copy high-confidence skills to `skills/` directory
3. Adjust patterns and triggers for your use case
4. Integrate into CI/CD pipeline for continuous discovery
