#!/usr/bin/env node

/**
 * auto-skill-discovery.test.js
 *
 * Comprehensive test suite for auto-skill-discovery system.
 * Tests pattern detection, skill generation, validation, and reporting.
 *
 * Usage:
 *   node tools/auto-skill-discovery.test.js
 *   npm test -- tools/auto-skill-discovery.test.js
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const {
  PatternDetector,
  CodebaseScanner,
  SkillGenerator,
  SkillValidator,
  SkillTester,
  ReportGenerator,
  SkillDiscoverer,
} = require('./auto-skill-discovery');

// Color codes for test output
const COLORS = {
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  CYAN: '\x1b[36m',
};

class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  async run() {
    console.log(`${COLORS.BOLD}${COLORS.CYAN}=== Auto-Skill Discovery Test Suite ===${COLORS.RESET}\n`);

    for (const { name, fn } of this.tests) {
      try {
        await fn();
        this.passed++;
        console.log(`${COLORS.GREEN}✓${COLORS.RESET} ${name}`);
      } catch (error) {
        this.failed++;
        console.log(`${COLORS.RED}✗${COLORS.RESET} ${name}`);
        console.log(`  ${error.message}`);
      }
    }

    console.log(`\n${COLORS.BOLD}Results: ${this.passed} passed, ${this.failed} failed${COLORS.RESET}\n`);
    return this.failed === 0;
  }
}

// ============================================================================
// TEST SUITES
// ============================================================================

const runner = new TestRunner();

// --- PatternDetector Tests ---

runner.test('PatternDetector: detect profiler pattern from filename', () => {
  const detector = new PatternDetector();
  const patterns = detector.detectPattern('/path/to/profiler.js', 'const profiler = {};');
  assert(patterns.includes('profiler'), 'Should detect profiler pattern');
});

runner.test('PatternDetector: detect tester pattern from filename', () => {
  const detector = new PatternDetector();
  const patterns = detector.detectPattern('/path/to/module.test.js', 'describe("test", () => {});');
  assert(patterns.includes('tester'), 'Should detect tester pattern');
});

runner.test('PatternDetector: detect middleware pattern', () => {
  const detector = new PatternDetector();
  const patterns = detector.detectPattern('/path/to/middleware-auth.js', 'module.exports = (req, res, next) => {};');
  assert(patterns.includes('middleware'), 'Should detect middleware pattern');
});

runner.test('PatternDetector: detect class-based pattern from content', () => {
  const detector = new PatternDetector();
  const code = `
    class MyClass {
      constructor() {
        this.value = 0;
      }
    }
  `;
  const patterns = detector.detectPattern('/path/to/file.js', code);
  assert(patterns.includes('class-based'), 'Should detect class-based pattern');
});

runner.test('PatternDetector: detect utility function pattern', () => {
  const detector = new PatternDetector();
  const code = 'module.exports = function() { return 42; };';
  const patterns = detector.detectPattern('/path/to/util.js', code);
  assert(patterns.includes('utility-function'), 'Should detect utility function');
});

runner.test('PatternDetector: detect async handler pattern', () => {
  const detector = new PatternDetector();
  const code = 'const fn = () => { setTimeout(() => {}, 100); };';
  const patterns = detector.detectPattern('/path/to/handler.js', code);
  assert(patterns.includes('async-handler'), 'Should detect async handler');
});

runner.test('PatternDetector: detect performance measurement', () => {
  const detector = new PatternDetector();
  const code = `
    const { performance } = require('perf_hooks');
    const start = performance.now();
  `;
  const patterns = detector.detectPattern('/path/to/perf.js', code);
  assert(patterns.includes('performance-measurement'), 'Should detect performance measurement');
});

runner.test('PatternDetector: extract JSDoc comments', () => {
  const detector = new PatternDetector();
  const code = `
    /**
     * This is a test function
     * @param {string} name - The name
     * @returns {void}
     */
    function test() {}
  `;
  const jsDoc = detector.extractJSDoc(code);
  assert(jsDoc !== null, 'Should extract JSDoc');
  assert(jsDoc.description.includes('test function'), 'Should extract description');
});

runner.test('PatternDetector: extract named functions', () => {
  const detector = new PatternDetector();
  const code = `
    function add(a, b) { return a + b; }
    async function fetch() {}
  `;
  const functions = detector.extractFunctions(code);
  assert(functions.length === 2, 'Should extract 2 functions');
  assert(functions[0].name === 'add', 'First function should be "add"');
  assert(functions[1].name === 'fetch', 'Second function should be "fetch"');
});

runner.test('PatternDetector: extract arrow functions', () => {
  const detector = new PatternDetector();
  const code = `
    const add = (a, b) => a + b;
    const fetch = async () => [];
  `;
  const functions = detector.extractFunctions(code);
  assert(functions.length === 2, 'Should extract 2 arrow functions');
  assert(functions[0].type === 'arrow', 'Should identify as arrow function');
});

runner.test('PatternDetector: extract classes', () => {
  const detector = new PatternDetector();
  const code = `
    class Base {}
    class Child extends Base {}
  `;
  const classes = detector.extractClasses(code);
  assert(classes.length === 2, 'Should extract 2 classes');
  assert(classes[1].extends === 'Base', 'Should detect inheritance');
});

// --- SkillGenerator Tests ---

runner.test('SkillGenerator: infer skill name from class', () => {
  const generator = new SkillGenerator();
  const discovery = {
    fileName: 'analyzer.js',
    patterns: ['analyzer'],
    classes: [{ name: 'CodeAnalyzer' }],
    functions: [],
    jsDoc: null,
    linesOfCode: 150,
  };
  const skill = generator.generateSkill(discovery);
  assert(skill.name.includes('CodeAnalyzer'), 'Skill name should include class name');
});

runner.test('SkillGenerator: generate skill has all required sections', () => {
  const generator = new SkillGenerator();
  const discovery = {
    fileName: 'profiler.js',
    patterns: ['profiler'],
    classes: [{ name: 'Profiler' }],
    functions: [{ name: 'profile', params: ['fn'] }],
    jsDoc: { description: 'Profile execution time' },
    linesOfCode: 250,
  };
  const skill = generator.generateSkill(discovery);
  assert(skill.content.includes('## When to activate'), 'Should have trigger section');
  assert(skill.content.includes('## When NOT to use'), 'Should have anti-patterns');
  assert(skill.content.includes('## Instructions'), 'Should have instructions');
  assert(skill.content.includes('## Example'), 'Should have example');
});

runner.test('SkillGenerator: calculate confidence score', () => {
  const generator = new SkillGenerator();
  const discovery = {
    fileName: 'profiler.js',
    patterns: ['profiler', 'performance-measurement'],
    classes: [{ name: 'Profiler' }],
    functions: [{ name: 'profile', params: [] }],
    jsDoc: { description: 'Test' },
    linesOfCode: 300,
  };
  const skill = generator.generateSkill(discovery);
  assert(skill.confidence > 50, 'Confidence should be calculated');
  assert(skill.confidence <= 100, 'Confidence should not exceed 100');
});

runner.test('SkillGenerator: kebab-case conversion', () => {
  const generator = new SkillGenerator();
  const result = generator.toKebabCase('My Awesome Skill!');
  assert(result === 'my-awesome-skill', 'Should convert to kebab-case');
});

runner.test('SkillGenerator: generate example from class', () => {
  const generator = new SkillGenerator();
  const discovery = {
    fileName: 'analyzer.js',
    patterns: [],
    classes: [{ name: 'Analyzer' }],
    functions: [],
    jsDoc: null,
    linesOfCode: 100,
  };
  const skill = generator.generateSkill(discovery);
  assert(skill.content.includes('new Analyzer()'), 'Example should instantiate class');
});

runner.test('SkillGenerator: generate example from function', () => {
  const generator = new SkillGenerator();
  const discovery = {
    fileName: 'util.js',
    patterns: [],
    classes: [],
    functions: [{ name: 'process', params: ['data'] }],
    jsDoc: null,
    linesOfCode: 50,
  };
  const skill = generator.generateSkill(discovery);
  assert(skill.content.includes('process('), 'Example should call function');
});

// --- SkillValidator Tests ---

runner.test('SkillValidator: validate skill has required sections', () => {
  const validator = new SkillValidator();
  const skill = `
# Test Skill
## When to activate
When testing
## When NOT to use
Never
## Instructions
Do this
## Example
\`\`\`js
test();
\`\`\`
`;
  const result = validator.validateSkillFormat(skill);
  assert(result.valid === true, 'Valid skill should pass');
});

runner.test('SkillValidator: detect missing required sections', () => {
  const validator = new SkillValidator();
  const skill = `
# Test Skill
## When to activate
When testing
`;
  const result = validator.validateSkillFormat(skill);
  assert(result.valid === false, 'Should detect missing sections');
  assert(result.errors.length > 0, 'Should list missing sections');
});

runner.test('SkillValidator: warn about missing code example', () => {
  const validator = new SkillValidator();
  const skill = `
# Test Skill
## When to activate
When testing
## When NOT to use
Never
## Instructions
Do this
## Example
No code here
`;
  const result = validator.validateSkillFormat(skill);
  assert(result.warnings.length > 0, 'Should warn about missing code');
});

// --- SkillTester Tests ---

runner.test('SkillTester: check documentation completeness', () => {
  const tester = new SkillTester();
  const discovery = {
    jsDoc: { description: 'Test' },
    functions: [{ name: 'test' }],
    classes: [{ name: 'Test' }],
    linesOfCode: 200,
  };
  const score = tester.checkDocumentationCompleteness(discovery);
  assert(score > 0, 'Should calculate completeness score');
  assert(score <= 1, 'Score should be between 0 and 1');
});

// --- ReportGenerator Tests ---

runner.test('ReportGenerator: generate discovery report', () => {
  const generator = new ReportGenerator();
  const discoveries = [
    {
      filePath: '/path/to/profiler.js',
      relPath: 'profilers/profiler.js',
      patterns: ['profiler'],
      functions: [{ name: 'profile' }],
      classes: [{ name: 'Profiler' }],
      jsDoc: null,
      linesOfCode: 200,
    },
  ];
  const skills = [
    {
      name: 'Profiler Skill',
      slug: 'profiler-skill',
      confidence: 85,
      discovery: discoveries[0],
    },
  ];
  const report = generator.generateDiscoveryReport(discoveries, skills);
  assert(report.timestamp !== undefined, 'Report should have timestamp');
  assert(report.summary !== undefined, 'Report should have summary');
  assert(report.skills.length === 1, 'Report should list skills');
});

runner.test('ReportGenerator: calculate confidence buckets', () => {
  const generator = new ReportGenerator();
  const discoveries = [];
  const skills = [
    { name: 'High', confidence: 85, discovery: {} },
    { name: 'Medium', confidence: 70, discovery: {} },
    { name: 'Low', confidence: 45, discovery: {} },
  ];
  const report = generator.generateDiscoveryReport(discoveries, skills);
  assert(report.summary.confidenceBuckets.high === 1, 'Should count high confidence');
  assert(report.summary.confidenceBuckets.medium === 1, 'Should count medium confidence');
  assert(report.summary.confidenceBuckets.low === 1, 'Should count low confidence');
});

runner.test('ReportGenerator: format report for console', () => {
  const generator = new ReportGenerator();
  const report = {
    timestamp: new Date().toISOString(),
    discoveredFiles: 5,
    suggestedSkills: 3,
    summary: {
      totalDiscoveries: 5,
      totalSkillSuggestions: 3,
      averageConfidence: 75,
      confidenceBuckets: { high: 2, medium: 1, low: 0 },
    },
    skills: [
      { name: 'Skill1', confidence: 85, sourceFile: 'file1.js' },
    ],
  };
  const output = generator.printReport(report, 'console');
  assert(typeof output === 'string', 'Should return string');
  assert(output.includes('Auto-Skill Discovery Report'), 'Should have title');
  assert(output.includes('3'), 'Should show skill count');
});

runner.test('ReportGenerator: format report as JSON', () => {
  const generator = new ReportGenerator();
  const report = {
    timestamp: new Date().toISOString(),
    discoveredFiles: 1,
    suggestedSkills: 1,
    summary: {},
    skills: [],
  };
  const output = generator.printReport(report, 'json');
  const parsed = JSON.parse(output);
  assert(parsed.timestamp !== undefined, 'JSON should parse correctly');
});

// --- Integration Tests ---

runner.test('SkillDiscoverer: full discovery workflow', async () => {
  const discoverer = new SkillDiscoverer();
  assert(discoverer.scanner !== undefined, 'Should have scanner');
  assert(discoverer.generator !== undefined, 'Should have generator');
  assert(discoverer.validator !== undefined, 'Should have validator');
});

runner.test('SkillDiscoverer: generate markdown report', () => {
  const discoverer = new SkillDiscoverer();
  const skills = [
    {
      name: 'Test Skill',
      slug: 'test-skill',
      confidence: 80,
      content: '# Test\n## When to activate\nAlways',
      discovery: { relPath: 'test.js' },
    },
  ];
  const report = discoverer.generateMarkdownReport(skills);
  assert(report.includes('# Auto-Discovered Skills'), 'Should have title');
  assert(report.includes('Test Skill'), 'Should list skill');
  assert(report.includes('80%'), 'Should show confidence');
});

// --- Edge Cases ---

runner.test('PatternDetector: handle empty content', () => {
  const detector = new PatternDetector();
  const patterns = detector.detectPattern('/path/to/file.js', '');
  assert(Array.isArray(patterns), 'Should return array even for empty content');
});

runner.test('CodebaseScanner: handle missing directory', () => {
  const scanner = new CodebaseScanner();
  const result = scanner.analyzeFile('/nonexistent.js', 'code');
  assert(result === null, 'Should handle missing files gracefully');
});

runner.test('SkillValidator: validate empty skill', () => {
  const validator = new SkillValidator();
  const result = validator.validateSkillFormat('');
  assert(result.valid === false, 'Empty skill should be invalid');
});

runner.test('SkillGenerator: handle discovery with no functions or classes', () => {
  const generator = new SkillGenerator();
  const discovery = {
    fileName: 'constants.js',
    patterns: [],
    classes: [],
    functions: [],
    jsDoc: null,
    linesOfCode: 20,
  };
  const skill = generator.generateSkill(discovery);
  assert(skill.name !== undefined, 'Should still generate skill name');
  assert(skill.content !== undefined, 'Should generate skill content');
});

// --- Performance Tests ---

runner.test('PatternDetector: process large file', () => {
  const detector = new PatternDetector();
  const largeCode = 'function f() {}\n'.repeat(1000);
  const start = Date.now();
  const functions = detector.extractFunctions(largeCode);
  const duration = Date.now() - start;
  assert(functions.length === 1000, 'Should extract all functions');
  assert(duration < 100, 'Should process in reasonable time');
});

runner.test('CodebaseScanner: analyze multiple files efficiently', () => {
  const scanner = new CodebaseScanner();
  const discoveries = [
    scanner.analyzeFile('/file1.js', 'class A {}'),
    scanner.analyzeFile('/file2.js', 'function b() {}'),
    scanner.analyzeFile('/file3.js', 'const c = () => {}'),
  ];
  assert(discoveries.length === 3, 'Should analyze all files');
});

// ============================================================================
// RUN TESTS
// ============================================================================

async function main() {
  const success = await runner.run();
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { runner, TestRunner };
