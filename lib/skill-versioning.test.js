#!/usr/bin/env node

/**
 * Skill Versioning System - Test Suite
 *
 * Comprehensive tests for:
 * - Semantic versioning and comparisons
 * - Version snapshots and persistence
 * - Rollback functionality
 * - Diff and change tracking
 * - Migration guides
 * - Deprecation warnings
 * - Compatibility checks
 */

const assert = require('assert')
const fs = require('fs')
const path = require('path')
const {
  SkillVersioning,
  SemanticVersion,
  SkillSnapshot,
  MigrationGuide,
  DeprecationNotice
} = require('./skill-versioning')

const TEST_STORAGE = path.join(__dirname, '.test-versions')

// ============================================================================
// Test Utilities
// ============================================================================

function cleanupStorage() {
  if (fs.existsSync(TEST_STORAGE)) {
    fs.rmSync(TEST_STORAGE, { recursive: true })
  }
}

function testGroup(name) {
  console.log(`\n📋 ${name}`)
}

function testCase(name, fn) {
  try {
    fn()
    console.log(`  ✓ ${name}`)
  } catch (err) {
    console.error(`  ✗ ${name}`)
    console.error(`    ${err.message}`)
    throw err
  }
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(
      message || `Expected ${expected}, got ${actual}`
    )
  }
}

function assertArrayEquals(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      message || `Arrays not equal: ${JSON.stringify(actual)} !== ${JSON.stringify(expected)}`
    )
  }
}

/**
 * Test runner utility
 */
class TestRunner {
  constructor() {
    this.tests = []
    this.passed = 0
    this.failed = 0
  }

  test(name, fn) {
    this.tests.push({ name, fn })
  }

  async run() {
    console.log('Running skill-versioning tests...\n')

    for (const { name, fn } of this.tests) {
      try {
        await fn()
        console.log(`✓ ${name}`)
        this.passed++
      } catch (err) {
        console.error(`✗ ${name}`)
        console.error(`  ${err.message}`)
        this.failed++
      }
    }

    console.log(
      `\n${this.passed}/${this.tests.length} tests passed, ${this.failed} failed`
    )
    process.exit(this.failed > 0 ? 1 : 0)
  }
}

const tmpdir = require('os').tmpdir()

// Initialize test runner
const runner = new TestRunner()

// ============================
// SemanticVersion Tests
// ============================

runner.test('SemanticVersion: parse valid version', () => {
  const v = new SemanticVersion('1.2.3')
  assertEquals(v.major, 1)
  assertEquals(v.minor, 2)
  assertEquals(v.patch, 3)
})

runner.test('SemanticVersion: parse version with prerelease', () => {
  const v = new SemanticVersion('1.2.3-alpha')
  assertEquals(v.prerelease, 'alpha')
})

runner.test('SemanticVersion: parse version with metadata', () => {
  const v = new SemanticVersion('1.2.3+build.123')
  assertEquals(v.metadata, 'build.123')
})

runner.test('SemanticVersion: reject invalid version', () => {
  try {
    new SemanticVersion('invalid')
    throw new Error('Should have rejected invalid version')
  } catch (err) {
    assert(err.message.includes('Invalid semantic version'))
  }
})

runner.test('SemanticVersion: compare versions', () => {
  const v1 = new SemanticVersion('1.2.3')
  const v2 = new SemanticVersion('1.2.4')
  const v3 = new SemanticVersion('2.0.0')

  assert(v2.isGreaterThan('1.2.3'))
  assert(v1.isLessThan('1.2.4'))
  assert(v1.isEqualTo('1.2.3'))
  assert(v3.isGreaterThan('1.2.3'))
})

runner.test('SemanticVersion: compare with prerelease', () => {
  const stable = new SemanticVersion('1.0.0')
  const prerelease = new SemanticVersion('1.0.0-alpha')

  assert(stable.isGreaterThan('1.0.0-alpha'))
  assert(prerelease.isLessThan('1.0.0'))
})

runner.test('SemanticVersion: satisfies caret range', () => {
  const v = new SemanticVersion('1.2.5')
  assert(v.satisfies('^1.2.3'))
  assert(!v.satisfies('^2.0.0'))
})

runner.test('SemanticVersion: satisfies tilde range', () => {
  const v = new SemanticVersion('1.2.5')
  assert(v.satisfies('~1.2.3'))
  assert(!v.satisfies('~1.3.0'))
})

runner.test('SemanticVersion: satisfies comparison ranges', () => {
  const v = new SemanticVersion('1.5.0')
  assert(v.satisfies('>=1.0.0'))
  assert(v.satisfies('<=2.0.0'))
  assert(!v.satisfies('>2.0.0'))
  assert(!v.satisfies('<1.0.0'))
})

runner.test('SemanticVersion: toString', () => {
  const v = new SemanticVersion('1.2.3-alpha+build')
  assertEquals(v.toString(), '1.2.3-alpha+build')
})

// ============================
// SkillSnapshot Tests
// ============================

runner.test('SkillSnapshot: create snapshot', () => {
  const snapshot = new SkillSnapshot('my-skill', '1.0.0', 'console.log("hello")', {
    author: 'test',
    description: 'test skill'
  })

  assertEquals(snapshot.skillId, 'my-skill')
  assertEquals(snapshot.version, '1.0.0')
  assertEquals(snapshot.metadata.author, 'test')
})

runner.test('SkillSnapshot: compute hash', () => {
  const content = 'function test() {}'
  const s1 = new SkillSnapshot('skill1', '1.0.0', content)
  const s2 = new SkillSnapshot('skill2', '1.0.0', content)

  assertEquals(s1.hash, s2.hash)
})

runner.test('SkillSnapshot: toJSON excludes content', () => {
  const snapshot = new SkillSnapshot('skill', '1.0.0', 'code here')
  const json = snapshot.toJSON()

  assert(!('content' in json))
  assert('hash' in json)
  assert('version' in json)
})

// ============================
// MigrationGuide Tests
// ============================

runner.test('MigrationGuide: create and add steps', () => {
  const guide = new MigrationGuide('skill', '1.0.0', '2.0.0')
  guide.addStep('Step 1', 'code1')
  guide.addStep('Step 2', 'code2')

  assertEquals(guide.steps.length, 2)
})

runner.test('MigrationGuide: add breaking changes', () => {
  const guide = new MigrationGuide('skill', '1.0.0', '2.0.0')
  guide.addBreakingChange('API changed', 'Use new API')

  assertEquals(guide.breakingChanges.length, 1)
  assertEquals(guide.breakingChanges[0].change, 'API changed')
})

runner.test('MigrationGuide: add new features', () => {
  const guide = new MigrationGuide('skill', '1.0.0', '2.0.0')
  guide.addNewFeature('caching', 'New caching support')

  assertEquals(guide.newFeatures.length, 1)
})

runner.test('MigrationGuide: add code examples', () => {
  const guide = new MigrationGuide('skill', '1.0.0', '2.0.0')
  guide.addCodeExample('old()', 'new()', 'Updated API')

  assertEquals(guide.codeExamples.length, 1)
})

// ============================
// DeprecationNotice Tests
// ============================

runner.test('DeprecationNotice: create notice', () => {
  const notice = new DeprecationNotice('skill', '1.0.0', 'Use skill-v2 instead')
  assertEquals(notice.skillId, 'skill')
  assertEquals(notice.version, '1.0.0')
})

runner.test('DeprecationNotice: set replacement', () => {
  const notice = new DeprecationNotice('skill', '1.0.0', 'Old API')
  notice.replacedWith('skill-v2')

  assertEquals(notice.replacedBy, 'skill-v2')
})

runner.test('DeprecationNotice: set sunset date', () => {
  const notice = new DeprecationNotice('skill', '1.0.0', 'Old')
  const date = '2026-12-31'
  notice.setSunsetDate(date)

  assert(notice.sunsetDate.includes('2026-12-31'))
})

runner.test('DeprecationNotice: set severity', () => {
  const notice = new DeprecationNotice('skill', '1.0.0', 'Old')
  notice.setSeverity('error')

  assertEquals(notice.severity, 'error')
})

runner.test('DeprecationNotice: add alternatives', () => {
  const notice = new DeprecationNotice('skill', '1.0.0', 'Old')
  notice.addAlternative('skill-new', 'Better implementation')

  assertEquals(notice.alternatives.length, 1)
})

// ============================
// SkillVersioning Tests
// ============================

runner.test('SkillVersioning: register version', () => {
  const versioning = new SkillVersioning(path.join(tmpdir, 'test-versioning-1'))
  const snapshot = versioning.register('test-skill', '1.0.0', 'code here', {
    author: 'test'
  })

  assertEquals(snapshot.version, '1.0.0')
  assertEquals(snapshot.skillId, 'test-skill')
})

runner.test('SkillVersioning: get version', () => {
  const versioning = new SkillVersioning(path.join(tmpdir, 'test-versioning-2'))
  versioning.register('skill', '1.0.0', 'code v1')
  versioning.register('skill', '2.0.0', 'code v2')

  const v1 = versioning.getVersion('skill', '1.0.0')
  const v2 = versioning.getVersion('skill', '2.0.0')

  assertEquals(v1.version, '1.0.0')
  assertEquals(v2.version, '2.0.0')
})

runner.test('SkillVersioning: get latest version', () => {
  const versioning = new SkillVersioning(path.join(tmpdir, 'test-versioning-3'))
  versioning.register('skill', '1.0.0', 'v1')
  versioning.register('skill', '2.0.0', 'v2')
  versioning.register('skill', '1.5.0', 'v1.5')

  const latest = versioning.getLatest('skill')
  assertEquals(latest.version, '2.0.0')
})

runner.test('SkillVersioning: get all versions sorted', () => {
  const versioning = new SkillVersioning(path.join(tmpdir, 'test-versioning-4'))
  versioning.register('skill', '1.0.0', 'v1')
  versioning.register('skill', '2.0.0', 'v2')
  versioning.register('skill', '1.5.0', 'v1.5')

  const all = versioning.getAllVersions('skill')
  assertEquals(all[0].version, '2.0.0')
  assertEquals(all[1].version, '1.5.0')
  assertEquals(all[2].version, '1.0.0')
})

runner.test('SkillVersioning: diff versions', () => {
  const versioning = new SkillVersioning(path.join(tmpdir, 'test-versioning-5'))
  versioning.register('skill', '1.0.0', 'line 1\nline 2\nline 3')
  versioning.register('skill', '2.0.0', 'line 1\nmodified\nline 3')

  const diff = versioning.diff('skill', '1.0.0', '2.0.0')

  assertEquals(diff.changes.length, 1)
  assertEquals(diff.summary.modified, 1)
})

runner.test('SkillVersioning: rollback version', () => {
  const versioning = new SkillVersioning(path.join(tmpdir, 'test-versioning-6'))
  versioning.register('skill', '1.0.0', 'v1')
  versioning.register('skill', '2.0.0', 'v2')

  const rolled = versioning.rollback('skill', '1.0.0')
  assertEquals(rolled.version, '1.0.0')
})

runner.test('SkillVersioning: create migration guide', () => {
  const versioning = new SkillVersioning(path.join(tmpdir, 'test-versioning-7'))
  const guide = versioning.createMigrationGuide('skill', '1.0.0', '2.0.0')
  guide.addStep('Update API calls')
  guide.addBreakingChange('Config format', 'Use new format')

  assertEquals(guide.fromVersion, '1.0.0')
  assertEquals(guide.toVersion, '2.0.0')
  assertEquals(guide.steps.length, 1)
})

runner.test('SkillVersioning: get migration guide', () => {
  const versioning = new SkillVersioning(path.join(tmpdir, 'test-versioning-8'))
  const created = versioning.createMigrationGuide('skill', '1.0.0', '2.0.0')
  created.addStep('Step 1')

  const retrieved = versioning.getMigrationGuide('skill', '1.0.0', '2.0.0')
  assert(retrieved !== undefined)
  assertEquals(retrieved.steps.length, 1)
})

runner.test('SkillVersioning: deprecate version', () => {
  const versioning = new SkillVersioning(path.join(tmpdir, 'test-versioning-9'))
  versioning.register('skill', '1.0.0', 'code')

  const notice = versioning.deprecate('skill', '1.0.0', 'Use v2 instead')
  assertEquals(notice.reason, 'Use v2 instead')
})

runner.test('SkillVersioning: check is deprecated', () => {
  const versioning = new SkillVersioning(path.join(tmpdir, 'test-versioning-10'))
  versioning.register('skill', '1.0.0', 'code')
  versioning.deprecate('skill', '1.0.0', 'Old')

  assert(versioning.isDeprecated('skill', '1.0.0'))
  assert(!versioning.isDeprecated('skill', '2.0.0'))
})

runner.test('SkillVersioning: get deprecation warning', () => {
  const versioning = new SkillVersioning(path.join(tmpdir, 'test-versioning-11'))
  versioning.register('skill', '1.0.0', 'code')
  const notice = versioning.deprecate('skill', '1.0.0', 'Old version')
  notice.replacedWith('skill-v2')

  const warning = versioning.getDeprecationWarning('skill', '1.0.0')
  assert(warning.includes('DEPRECATION'))
  assert(warning.includes('skill-v2'))
})

runner.test('SkillVersioning: check compatibility', () => {
  const versioning = new SkillVersioning(path.join(tmpdir, 'test-versioning-12'))

  assert(versioning.isCompatible('skill', '^1.0.0', '1.2.3'))
  assert(!versioning.isCompatible('skill', '^1.0.0', '2.0.0'))
  assert(versioning.isCompatible('skill', '~1.2.0', '1.2.5'))
})

runner.test('SkillVersioning: get compatibility matrix', () => {
  const versioning = new SkillVersioning(path.join(tmpdir, 'test-versioning-13'))
  versioning.register('skill', '1.0.0', 'v1')
  versioning.register('skill', '1.5.0', 'v1.5')
  versioning.register('skill', '2.0.0', 'v2')
  versioning.deprecate('skill', '1.0.0', 'Old')

  const matrix = versioning.getCompatibilityMatrix('skill')
  assert('1.0.0' in matrix)
  assert(matrix['1.0.0'].deprecated)
})

runner.test('SkillVersioning: get compatible versions', () => {
  const versioning = new SkillVersioning(path.join(tmpdir, 'test-versioning-14'))
  versioning.register('skill', '1.0.0', 'v1')
  versioning.register('skill', '1.5.0', 'v1.5')
  versioning.register('skill', '2.0.0', 'v2')

  const compatible = versioning.getCompatibleVersions('skill', '1.0.0')
  assert(compatible.includes('1.0.0'))
  assert(compatible.includes('1.5.0'))
  assert(!compatible.includes('2.0.0'))
})

runner.test('SkillVersioning: add changelog entry', () => {
  const versioning = new SkillVersioning(path.join(tmpdir, 'test-versioning-15'))
  versioning.register('skill', '1.0.0', 'code', {
    changesSummary: 'Initial release'
  })

  versioning.addChangelogEntry('skill', '1.0.0', {
    action: 'registered'
  })

  const log = versioning.getChangelog('skill')
  assert(log.length > 0)
})

runner.test('SkillVersioning: get changelog with limit', () => {
  const versioning = new SkillVersioning(path.join(tmpdir, 'test-versioning-16'))
  versioning.register('skill', '1.0.0', 'v1')
  versioning.register('skill', '1.1.0', 'v1.1')
  versioning.register('skill', '1.2.0', 'v1.2')

  const log = versioning.getChangelog('skill', 2)
  assertEquals(log.length, 2)
})

runner.test('SkillVersioning: get stats', () => {
  const versioning = new SkillVersioning(path.join(tmpdir, 'test-versioning-17'))
  versioning.register('skill', '1.0.0', 'v1')
  versioning.register('skill', '1.1.0', 'v1.1')
  versioning.deprecate('skill', '1.0.0', 'Old')

  const stats = versioning.getStats('skill')
  assertEquals(stats.totalVersions, 2)
  assertEquals(stats.deprecatedVersions, 1)
  assertEquals(stats.latestVersion, '1.1.0')
})

runner.test('SkillVersioning: persist to disk', () => {
  const storageDir = path.join(tmpdir, 'test-versioning-persist')
  const versioning = new SkillVersioning(storageDir)
  versioning.register('skill', '1.0.0', 'code', { author: 'test' })
  versioning.persist('skill')

  const manifestPath = path.join(storageDir, 'skill', 'manifest.json')
  assert(fs.existsSync(manifestPath))

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
  assertEquals(manifest.skillId, 'skill')
  assert(manifest.versions.includes('1.0.0'))
})

runner.test('SkillVersioning: load from disk', () => {
  const storageDir = path.join(tmpdir, 'test-versioning-load')
  const v1 = new SkillVersioning(storageDir)
  v1.register('skill', '1.0.0', 'code', { author: 'test' })
  v1.persist('skill')

  const v2 = new SkillVersioning(storageDir)
  v2.load('skill')

  assert(v2.versions.has('skill'))
  const versions = v2.versions.get('skill')
  assert(versions.includes('1.0.0'))
})

runner.test('SkillVersioning: export as JSON', () => {
  const versioning = new SkillVersioning(path.join(tmpdir, 'test-versioning-export'))
  versioning.register('skill', '1.0.0', 'code', { author: 'test' })

  const exported = versioning.export('skill', 'json')
  const data = JSON.parse(exported)

  assertEquals(data.skillId, 'skill')
  assert('changelog' in data)
})

runner.test('SkillVersioning: export as CSV', () => {
  const versioning = new SkillVersioning(path.join(tmpdir, 'test-versioning-csv'))
  versioning.register('skill', '1.0.0', 'code')

  const csv = versioning.export('skill', 'csv')
  assert(csv.includes('Skill'))
  assert(csv.includes('1.0.0'))
})

// Run all tests
runner.run()
