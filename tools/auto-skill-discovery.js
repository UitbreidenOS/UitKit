#!/usr/bin/env node

/**
 * auto-skill-discovery.js
 *
 * Auto-discover new skills from codebase. Scans for functions, detects patterns,
 * suggests as skills. Enables code-to-skill conversion. Automatic testing.
 *
 * Usage:
 *   node tools/auto-skill-discovery.js [--scan-dir=path] [--output=json|md]
 *   node tools/auto-skill-discovery.js --test [--skill=path/to/skill.md]
 *   node tools/auto-skill-discovery.js --validate [--exclude=pattern]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CLAUDIENT_ROOT = path.join(__dirname, '..');
const SKILLS_DIR = path.join(CLAUDIENT_ROOT, 'skills');
const GUIDES_DIR = path.join(CLAUDIENT_ROOT, 'guides');
const AGENTS_DIR = path.join(CLAUDIENT_ROOT, 'agents');
const PROFILERS_DIR = path.join(CLAUDIENT_ROOT, 'profilers');
const MIDDLEWARE_DIR = path.join(CLAUDIENT_ROOT, 'middleware');
const RESULTS_DIR = path.join(__dirname, 'discovery-results');

const COLORS = {
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  RED: '\x1b[31m',
  CYAN: '\x1b[36m',
  GRAY: '\x1b[90m',
  MAGENTA: '\x1b[35m',
};

// ============================================================================
// PATTERN DETECTORS
// ============================================================================

class PatternDetector {
  constructor() {
    this.patterns = {
      profiler: /profil[er]*\.js$/i,
      tester: /\.test\.js$/i,
      middleware: /middleware.*\.js$/i,
      workflow: /workflow|pipeline|orchestrat/i,
      analyzer: /analyz[er]*\.js$/i,
      validator: /validat.*\.js$/i,
      formatter: /format.*\.js$/i,
      parser: /pars.*\.js$/i,
      builder: /build.*\.js$/i,
      optimizer: /optim.*\.js$/i,
      debugger: /debug.*\.js$/i,
      logger: /log.*\.js$/i,
      cache: /cach.*\.js$/i,
      monitor: /monitor.*\.js$/i,
      health: /health|check.*\.js$/i,
    };
  }

  detectPattern(filePath, content) {
    const fileName = path.basename(filePath);
    const detectedPatterns = [];

    // File-name based detection
    for (const [pattern, regex] of Object.entries(this.patterns)) {
      if (regex.test(fileName)) {
        detectedPatterns.push(pattern);
      }
    }

    // Content-based detection
    if (content.includes('class') && content.includes('constructor')) {
      detectedPatterns.push('class-based');
    }

    if (content.includes('module.exports') && !detectedPatterns.includes('class-based')) {
      detectedPatterns.push('utility-function');
    }

    if (content.match(/function\s+\w+\s*\(.*\)\s*{/)) {
      detectedPatterns.push('function-export');
    }

    if (content.includes('setTimeout') || content.includes('setInterval')) {
      detectedPatterns.push('async-handler');
    }

    if (content.includes('perf_hooks') || content.includes('performance.now')) {
      detectedPatterns.push('performance-measurement');
    }

    if (content.includes('JSON.stringify') && content.includes('fs.write')) {
      detectedPatterns.push('data-serialization');
    }

    if (content.match(/mock|stub|spy/i)) {
      detectedPatterns.push('testing-utility');
    }

    return [...new Set(detectedPatterns)];
  }

  extractJSDoc(content) {
    const jsdocRegex = /\/\*\*([\s\S]*?)\*\//;
    const match = content.match(jsdocRegex);
    if (!match) return null;

    const doc = match[1];
    const lines = doc.split('\n');
    const description = lines
      .slice(0, 3)
      .map(line => line.replace(/^\s*\*\s*/, '').trim())
      .filter(line => line && !line.startsWith('@'))
      .join(' ');

    return {
      description: description,
      fullDoc: doc,
    };
  }

  extractFunctions(content) {
    const functions = [];

    // Named functions
    const namedFuncRegex = /(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)/g;
    let match;
    while ((match = namedFuncRegex.exec(content)) !== null) {
      functions.push({
        name: match[1],
        params: match[2].split(',').map(p => p.trim()).filter(Boolean),
        type: 'named',
      });
    }

    // Arrow functions assigned to const/let
    const arrowFuncRegex = /(?:const|let)\s+(\w+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>/g;
    while ((match = arrowFuncRegex.exec(content)) !== null) {
      functions.push({
        name: match[1],
        params: match[2].split(',').map(p => p.trim()).filter(Boolean),
        type: 'arrow',
      });
    }

    return functions;
  }

  extractClasses(content) {
    const classes = [];
    const classRegex = /class\s+(\w+)(?:\s+extends\s+(\w+))?\s*{/g;
    let match;
    while ((match = classRegex.exec(content)) !== null) {
      classes.push({
        name: match[1],
        extends: match[2] || null,
      });
    }
    return classes;
  }
}

// ============================================================================
// CODEBASE SCANNER
// ============================================================================

class CodebaseScanner {
  constructor() {
    this.detector = new PatternDetector();
    this.discoveries = [];
  }

  scan(directory, options = {}) {
    const { exclude = /node_modules|\.git|\.out-of-scope/ } = options;

    const files = this.walkDir(directory, exclude);
    const jsFiles = files.filter(f => f.endsWith('.js'));

    console.log(`${COLORS.CYAN}Scanning ${jsFiles.length} JavaScript files...${COLORS.RESET}`);

    jsFiles.forEach(filePath => {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const discovery = this.analyzeFile(filePath, content);
        if (discovery) {
          this.discoveries.push(discovery);
        }
      } catch (error) {
        // Skip files that can't be read
        if (process.env.DEBUG) {
          console.log(`${COLORS.GRAY}Skipped ${filePath}: ${error.message}${COLORS.RESET}`);
        }
      }
    });

    return this.discoveries;
  }

  analyzeFile(filePath, content) {
    const fileName = path.basename(filePath);
    const relPath = path.relative(CLAUDIENT_ROOT, filePath);

    const patterns = this.detector.detectPattern(filePath, content);
    if (patterns.length === 0) return null;

    const functions = this.detector.extractFunctions(content);
    const classes = this.detector.extractClasses(content);
    const jsDoc = this.detector.extractJSDoc(content);

    // Skip if it's already a skill or test
    if (fileName.endsWith('.test.js') || filePath.includes('/skills/') || filePath.includes('/guides/')) {
      return null;
    }

    return {
      filePath,
      relPath,
      fileName,
      patterns,
      functions,
      classes,
      jsDoc,
      linesOfCode: content.split('\n').length,
      hasExports: content.includes('module.exports') || content.includes('export'),
    };
  }

  walkDir(dir, exclude) {
    const results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    entries.forEach(entry => {
      const fullPath = path.join(dir, entry.name);
      if (exclude.test(fullPath)) return;

      if (entry.isDirectory()) {
        results.push(...this.walkDir(fullPath, exclude));
      } else {
        results.push(fullPath);
      }
    });

    return results;
  }
}

// ============================================================================
// SKILL GENERATOR
// ============================================================================

class SkillGenerator {
  constructor() {
    this.skillTemplate = this.loadTemplate();
  }

  loadTemplate() {
    return `# {{skillName}}

## When to activate
{{trigger}}

## When NOT to use
{{antiPatterns}}

## Instructions
{{instructions}}

## Example
\`\`\`javascript
{{example}}
\`\`\`
`;
  }

  generateSkill(discovery) {
    const skillName = this.inferSkillName(discovery);
    const trigger = this.inferTrigger(discovery);
    const antiPatterns = this.inferAntiPatterns(discovery);
    const instructions = this.generateInstructions(discovery);
    const example = this.generateExample(discovery);

    let skill = this.skillTemplate
      .replace('{{skillName}}', skillName)
      .replace('{{trigger}}', trigger)
      .replace('{{antiPatterns}}', antiPatterns)
      .replace('{{instructions}}', instructions)
      .replace('{{example}}', example);

    return {
      name: skillName,
      slug: this.toKebabCase(skillName),
      content: skill,
      discovery,
      confidence: this.calculateConfidence(discovery),
    };
  }

  inferSkillName(discovery) {
    const { fileName, patterns, classes } = discovery;

    if (classes.length > 0) {
      return `${classes[0].name} Usage`;
    }

    const baseName = fileName.replace('.js', '').replace(/-/g, ' ').toUpperCase();
    return `${baseName} Pattern`;
  }

  inferTrigger(discovery) {
    const { patterns, jsDoc } = discovery;

    const triggerMap = {
      profiler: 'When performance analysis or bottleneck identification is needed',
      tester: 'When unit testing or integration testing is required',
      middleware: 'When request/response intercepting or pipeline handling is needed',
      workflow: 'When orchestrating multi-step processes or workflows',
      analyzer: 'When analyzing code, logs, or data patterns',
      validator: 'When input validation or schema checking is needed',
      formatter: 'When transforming or formatting data structures',
      parser: 'When parsing configuration files, logs, or structured text',
      builder: 'When constructing complex objects or configurations',
      optimizer: 'When performance optimization or resource allocation is needed',
      debugger: 'When debugging issues or tracing execution paths',
      logger: 'When logging application events or metrics',
      cache: 'When caching results or improving lookup performance',
      monitor: 'When monitoring system health or performance metrics',
      health: 'When checking system health or status',
    };

    const triggers = patterns.map(p => triggerMap[p] || `When ${p} functionality is needed`);
    return triggers.join('\n- ');
  }

  inferAntiPatterns(discovery) {
    const { patterns, jsDoc } = discovery;
    const antiPatterns = [
      'This skill is not a replacement for proper testing — it augments existing test suites',
      'Do not use this skill for one-off tasks when a simple manual check suffices',
      'Avoid using this skill in performance-critical paths without profiling first',
    ];

    if (patterns.includes('profiler')) {
      antiPatterns.push('Do not run profiling in production without adequate load isolation');
    }

    if (patterns.includes('tester')) {
      antiPatterns.push('Do not rely solely on unit tests for integration testing');
    }

    return antiPatterns.join('\n- ');
  }

  generateInstructions(discovery) {
    const { jsDoc, functions, classes } = discovery;

    const parts = [];

    if (jsDoc?.description) {
      parts.push(`**Overview:** ${jsDoc.description}`);
    }

    if (classes.length > 0) {
      parts.push('\n**Classes:**');
      classes.forEach(cls => {
        parts.push(`- \`${cls.name}\`${cls.extends ? ` (extends ${cls.extends})` : ''}`);
      });
    }

    if (functions.length > 0) {
      parts.push('\n**Key Functions:**');
      functions.slice(0, 5).forEach(fn => {
        parts.push(`- \`${fn.name}(${fn.params.join(', ')})\``);
      });
    }

    parts.push('\n**Usage Steps:**');
    parts.push('1. Import the module in your codebase');
    parts.push('2. Instantiate or call the primary exported function');
    parts.push('3. Process the results according to your use case');
    parts.push('4. Integrate with your error handling and logging');

    return parts.join('\n');
  }

  generateExample(discovery) {
    const { fileName, functions, classes } = discovery;

    if (classes.length > 0) {
      const cls = classes[0];
      return `const { ${cls.name} } = require('./path/to/${fileName}');

const instance = new ${cls.name}();
// Use instance methods and properties
console.log(instance);`;
    }

    if (functions.length > 0) {
      const fn = functions[0];
      return `const { ${fn.name} } = require('./path/to/${fileName}');

const result = ${fn.name}(${fn.params.map(p => `'${p}'`).join(', ')});
console.log(result);`;
    }

    return `// Import and use ${fileName}
const module = require('./path/to/${fileName}');`;
  }

  calculateConfidence(discovery) {
    let score = 0;

    // Patterns add confidence
    score += Math.min(discovery.patterns.length * 15, 40);

    // Functions add confidence
    score += Math.min(discovery.functions.length * 5, 20);

    // Classes add confidence
    score += discovery.classes.length > 0 ? 15 : 0;

    // JSDoc adds confidence
    score += discovery.jsDoc ? 10 : 0;

    // Large files suggest deliberate implementation
    score += discovery.linesOfCode > 200 ? 10 : 0;

    return Math.min(score, 100);
  }

  toKebabCase(str) {
    return str
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
}

// ============================================================================
// SKILL VALIDATOR
// ============================================================================

class SkillValidator {
  validateSkillFormat(skillContent) {
    const errors = [];
    const warnings = [];

    // Check required sections
    const requiredSections = ['When to activate', 'When NOT to use', 'Instructions', 'Example'];
    requiredSections.forEach(section => {
      if (!skillContent.includes(`## ${section}`)) {
        errors.push(`Missing required section: "${section}"`);
      }
    });

    // Check markdown structure
    const lines = skillContent.split('\n');
    const headingLines = lines.filter(l => l.startsWith('#'));

    if (headingLines.length < 4) {
      warnings.push('Skill has fewer than 4 sections (minimum recommended)');
    }

    // Check code examples
    const hasCodeExample = skillContent.includes('```');
    if (!hasCodeExample) {
      warnings.push('No code example found in skill');
    }

    // Check length of descriptions
    const sections = skillContent.split('## ');
    sections.forEach(section => {
      const lines = section.split('\n').filter(l => l.trim() && !l.startsWith('#'));
      if (lines.length < 2) {
        warnings.push(`Section "${section.split('\n')[0]}" might be too brief`);
      }
    });

    return { valid: errors.length === 0, errors, warnings };
  }

  validateAgainstClaudeMD() {
    // Verify against CLAUDE.md rules
    const claudeMdPath = path.join(CLAUDIENT_ROOT, 'CLAUDE.md');
    if (!fs.existsSync(claudeMdPath)) {
      return { compliant: true, notes: ['CLAUDE.md not found for validation'] };
    }

    const claudeMdContent = fs.readFileSync(claudeMdPath, 'utf8');
    const notes = [];

    if (!claudeMdContent.includes('## Skill File Format')) {
      notes.push('Could not find Skill File Format in CLAUDE.md');
    }

    return { compliant: true, notes };
  }
}

// ============================================================================
// TESTING FRAMEWORK
// ============================================================================

class SkillTester {
  async testSkill(skillPath, discovery) {
    const results = {
      skillPath,
      tests: [],
      passed: 0,
      failed: 0,
    };

    // Test 1: File format validation
    if (skillPath && fs.existsSync(skillPath)) {
      const content = fs.readFileSync(skillPath, 'utf8');
      const validator = new SkillValidator();
      const validation = validator.validateSkillFormat(content);

      results.tests.push({
        name: 'Skill format validation',
        passed: validation.valid,
        errors: validation.errors,
        warnings: validation.warnings,
      });

      if (validation.valid) {
        results.passed++;
      } else {
        results.failed++;
      }
    }

    // Test 2: Source code exists and is accessible
    const sourceExists = discovery && fs.existsSync(discovery.filePath);
    results.tests.push({
      name: 'Source file accessibility',
      passed: sourceExists,
      error: sourceExists ? null : `File not found: ${discovery?.filePath}`,
    });

    if (sourceExists) {
      results.passed++;
    } else {
      results.failed++;
    }

    // Test 3: Code can be parsed
    if (sourceExists) {
      try {
        const content = fs.readFileSync(discovery.filePath, 'utf8');
        // Try to parse as valid JavaScript
        new Function(content);
        results.tests.push({
          name: 'Source code syntax validation',
          passed: true,
        });
        results.passed++;
      } catch (e) {
        results.tests.push({
          name: 'Source code syntax validation',
          passed: false,
          error: e.message,
        });
        results.failed++;
      }
    }

    // Test 4: Documentation completeness
    const completenessScore = this.checkDocumentationCompleteness(discovery);
    results.tests.push({
      name: 'Documentation completeness',
      passed: completenessScore >= 0.6,
      score: Math.round(completenessScore * 100),
    });

    if (completenessScore >= 0.6) {
      results.passed++;
    } else {
      results.failed++;
    }

    return results;
  }

  checkDocumentationCompleteness(discovery) {
    let score = 0;

    if (discovery.jsDoc) score += 0.25;
    if (discovery.functions.length > 0) score += 0.25;
    if (discovery.classes.length > 0) score += 0.25;
    if (discovery.linesOfCode > 100) score += 0.25;

    return Math.min(score, 1);
  }
}

// ============================================================================
// REPORT GENERATOR
// ============================================================================

class ReportGenerator {
  generateDiscoveryReport(discoveries, skills) {
    const report = {
      timestamp: new Date().toISOString(),
      discoveredFiles: discoveries.length,
      suggestedSkills: skills.length,
      summary: this.generateSummary(discoveries, skills),
      discoveries: discoveries.map(d => ({
        file: d.relPath,
        patterns: d.patterns,
        confidence: skills.find(s => s.discovery === d)?.confidence || 0,
        functions: d.functions.length,
        classes: d.classes.length,
      })),
      skills: skills.map(s => ({
        name: s.name,
        slug: s.slug,
        confidence: s.confidence,
        sourceFile: s.discovery.relPath,
      })),
    };

    return report;
  }

  generateSummary(discoveries, skills) {
    const avgConfidence = skills.length > 0
      ? Math.round(skills.reduce((sum, s) => sum + s.confidence, 0) / skills.length)
      : 0;

    const highConfidence = skills.filter(s => s.confidence >= 80).length;
    const mediumConfidence = skills.filter(s => s.confidence >= 60 && s.confidence < 80).length;
    const lowConfidence = skills.filter(s => s.confidence < 60).length;

    return {
      totalDiscoveries: discoveries.length,
      totalSkillSuggestions: skills.length,
      averageConfidence: avgConfidence,
      confidenceBuckets: {
        high: highConfidence,
        medium: mediumConfidence,
        low: lowConfidence,
      },
    };
  }

  printReport(report, format = 'console') {
    if (format === 'json') {
      return JSON.stringify(report, null, 2);
    }

    let output = '';
    output += `${COLORS.BOLD}${COLORS.CYAN}=== Auto-Skill Discovery Report ===${COLORS.RESET}\n\n`;
    output += `Timestamp: ${report.timestamp}\n`;
    output += `Files analyzed: ${report.discoveredFiles}\n`;
    output += `Skills suggested: ${report.suggestedSkills}\n\n`;

    output += `${COLORS.YELLOW}Summary:${COLORS.RESET}\n`;
    output += `- Average confidence: ${report.summary.averageConfidence}%\n`;
    output += `- High confidence (≥80%): ${report.summary.confidenceBuckets.high}\n`;
    output += `- Medium confidence (60-80%): ${report.summary.confidenceBuckets.medium}\n`;
    output += `- Low confidence (<60%): ${report.summary.confidenceBuckets.low}\n\n`;

    if (report.skills.length > 0) {
      output += `${COLORS.GREEN}Top suggested skills:${COLORS.RESET}\n`;
      report.skills
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 10)
        .forEach(skill => {
          const confColor = skill.confidence >= 80 ? COLORS.GREEN : skill.confidence >= 60 ? COLORS.YELLOW : COLORS.RED;
          output += `- ${confColor}${skill.name}${COLORS.RESET} (${skill.confidence}% confidence, ${skill.sourceFile})\n`;
        });
    }

    return output;
  }
}

// ============================================================================
// MAIN ORCHESTRATOR
// ============================================================================

class SkillDiscoverer {
  constructor() {
    this.scanner = new CodebaseScanner();
    this.generator = new SkillGenerator();
    this.validator = new SkillValidator();
    this.tester = new SkillTester();
    this.reporter = new ReportGenerator();
  }

  async run(options = {}) {
    const {
      scanDir = CLAUDIENT_ROOT,
      output = 'console',
      test = false,
      validate = false,
      minConfidence = 60,
    } = options;

    console.log(`${COLORS.CYAN}Starting skill discovery...${COLORS.RESET}\n`);

    // Phase 1: Scan codebase
    const discoveries = this.scanner.scan(scanDir);
    console.log(`${COLORS.GREEN}✓ Found ${discoveries.length} potential skill candidates${COLORS.RESET}\n`);

    // Phase 2: Generate skill suggestions
    const skills = discoveries
      .map(d => this.generator.generateSkill(d))
      .filter(s => s.confidence >= minConfidence);

    console.log(`${COLORS.GREEN}✓ Generated ${skills.length} skill suggestions${COLORS.RESET}\n`);

    // Phase 3: Validate (optional)
    if (validate) {
      console.log(`${COLORS.CYAN}Validating skills...${COLORS.RESET}`);
      skills.forEach(skill => {
        const validation = this.validator.validateSkillFormat(skill.content);
        if (!validation.valid) {
          console.log(`${COLORS.RED}✗ ${skill.name}: ${validation.errors.join(', ')}${COLORS.RESET}`);
        }
      });
      console.log();
    }

    // Phase 4: Test (optional)
    if (test) {
      console.log(`${COLORS.CYAN}Testing skills...${COLORS.RESET}`);
      for (const skill of skills) {
        const testResults = await this.tester.testSkill(null, skill.discovery);
        console.log(`${skill.name}: ${testResults.passed}/${testResults.passed + testResults.failed} tests passed`);
      }
      console.log();
    }

    // Phase 5: Generate report
    const report = this.reporter.generateDiscoveryReport(discoveries, skills);

    // Output results
    if (output === 'json') {
      return JSON.stringify(report, null, 2);
    } else if (output === 'md') {
      return this.generateMarkdownReport(skills);
    } else {
      console.log(this.reporter.printReport(report, 'console'));
      return report;
    }
  }

  generateMarkdownReport(skills) {
    let md = '# Auto-Discovered Skills\n\n';
    md += `Generated: ${new Date().toISOString()}\n\n`;
    md += `Total suggestions: ${skills.length}\n\n`;

    const sortedSkills = Array.isArray(skills)
      ? skills.sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
      : [];

    sortedSkills.forEach(skill => {
      md += `## ${skill.name}\n\n`;
      md += `**File:** ${skill.discovery.relPath}\n`;
      md += `**Confidence:** ${skill.confidence || 0}%\n`;
      const patterns = (skill.discovery.patterns || []).join(', ');
      md += `**Patterns:** ${patterns}\n\n`;
      md += skill.content + '\n\n---\n\n';
    });

    return md;
  }

  saveSkills(skills, outputDir = RESULTS_DIR) {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    skills.forEach(skill => {
      const filePath = path.join(outputDir, `${skill.slug}.md`);
      fs.writeFileSync(filePath, skill.content);
      console.log(`${COLORS.GREEN}✓ Saved ${filePath}${COLORS.RESET}`);
    });

    return outputDir;
  }
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const options = {};

  // Parse arguments
  args.forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      options[key] = value || true;
    }
  });

  try {
    const discoverer = new SkillDiscoverer();

    const output = options.output || 'console';
    const test = options.test === 'true' || options.test === true;
    const validate = options.validate === 'true' || options.validate === true;
    const scanDir = options['scan-dir'] || CLAUDIENT_ROOT;
    const minConfidence = parseInt(options['min-confidence'] || '60', 10);

    const result = await discoverer.run({
      scanDir,
      output,
      test,
      validate,
      minConfidence,
    });

    if (output === 'json') {
      console.log(result);
    } else if (output === 'md') {
      // Save markdown report
      const outputPath = path.join(RESULTS_DIR, 'discovered-skills.md');
      if (!fs.existsSync(RESULTS_DIR)) {
        fs.mkdirSync(RESULTS_DIR, { recursive: true });
      }
      fs.writeFileSync(outputPath, result);
      console.log(`\n${COLORS.GREEN}✓ Report saved to ${outputPath}${COLORS.RESET}`);
    }

    process.exit(0);
  } catch (error) {
    console.error(`${COLORS.RED}Error: ${error.message}${COLORS.RESET}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// Export for use as a module
module.exports = {
  PatternDetector,
  CodebaseScanner,
  SkillGenerator,
  SkillValidator,
  SkillTester,
  ReportGenerator,
  SkillDiscoverer,
};

// Run CLI if invoked directly
if (require.main === module) {
  main();
}
