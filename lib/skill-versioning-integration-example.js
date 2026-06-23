/**
 * Skill Versioning Integration Example
 * Complete example showing version control workflow for skills
 */

const {
  SkillVersioning,
  SemanticVersion,
  MigrationGuide,
  DeprecationNotice
} = require('./skill-versioning')
const path = require('path')

/**
 * Example 1: Basic version registration and retrieval
 */
function example1_BasicVersioning() {
  console.log('\n=== Example 1: Basic Versioning ===\n')

  const versioning = new SkillVersioning('./.claude/skill-versions')

  // Register skill versions
  versioning.register('markdown-formatter', '1.0.0', `
    function formatMarkdown(text) {
      return text.toUpperCase()
    }
  `, {
    author: 'alice',
    description: 'Basic markdown formatter',
    tags: ['markdown', 'utility']
  })

  versioning.register('markdown-formatter', '1.1.0', `
    function formatMarkdown(text, options = {}) {
      let result = text
      if (options.uppercase) result = result.toUpperCase()
      if (options.trim) result = result.trim()
      return result
    }
  `, {
    author: 'alice',
    description: 'Enhanced with options support',
    tags: ['markdown', 'utility']
  })

  versioning.register('markdown-formatter', '2.0.0', `
    class MarkdownFormatter {
      constructor(options = {}) {
        this.options = options
      }

      format(text) {
        return this.formatContent(text)
      }

      formatContent(text) {
        let result = text
        if (this.options.uppercase) result = result.toUpperCase()
        if (this.options.trim) result = result.trim()
        return result
      }
    }
  `, {
    author: 'alice',
    description: 'Refactored to class-based API',
    breaking: true,
    tags: ['markdown', 'utility']
  })

  // Retrieve versions
  const latest = versioning.getLatest('markdown-formatter')
  console.log(`Latest version: ${latest.version}`)

  const all = versioning.getAllVersions('markdown-formatter')
  console.log(`All versions: ${all.map(v => v.version).join(', ')}`)
}

/**
 * Example 2: Version diffing
 */
function example2_Diffing() {
  console.log('\n=== Example 2: Version Diffing ===\n')

  const versioning = new SkillVersioning('./.claude/skill-versions')

  // Register two versions
  versioning.register('api-client', '1.0.0', `
    function makeRequest(url, options) {
      return fetch(url, options)
    }

    function handleResponse(response) {
      return response.json()
    }
  `, { author: 'bob' })

  versioning.register('api-client', '1.1.0', `
    async function makeRequest(url, options) {
      const response = await fetch(url, options)
      return handleResponse(response)
    }

    async function handleResponse(response) {
      if (!response.ok) throw new Error('Request failed')
      return response.json()
    }
  `, { author: 'bob' })

  // Diff versions
  const diff = versioning.diff('api-client', '1.0.0', '1.1.0')

  console.log(`Diff between v1.0.0 and v1.1.0:`)
  console.log(`  Changes: ${diff.changes.length}`)
  console.log(`  Summary: +${diff.summary.added} -${diff.summary.removed} ~${diff.summary.modified}`)

  diff.changes.slice(0, 3).forEach(change => {
    console.log(`  Line ${change.lineNumber}:`)
    if (change.removed) console.log(`    - ${change.removed.substring(0, 50)}...`)
    if (change.added) console.log(`    + ${change.added.substring(0, 50)}...`)
  })
}

/**
 * Example 3: Migration guides
 */
function example3_MigrationGuides() {
  console.log('\n=== Example 3: Migration Guides ===\n')

  const versioning = new SkillVersioning('./.claude/skill-versions')

  // Register versions
  versioning.register('auth-service', '1.0.0', 'v1 auth code', { author: 'charlie' })
  versioning.register('auth-service', '2.0.0', 'v2 auth code', { author: 'charlie' })

  // Create migration guide
  const guide = versioning.createMigrationGuide('auth-service', '1.0.0', '2.0.0')

  guide.addBreakingChange(
    'authenticate() method renamed to login()',
    'Replace all calls to authenticate() with login()'
  )

  guide.addNewFeature(
    'Multi-factor authentication',
    'New MFA support with TOTP'
  )

  guide.addDeprecatedFeature(
    'basicAuth() method',
    'Use OAuth2 instead'
  )

  guide.addStep('Update all authenticate() calls to login()')
  guide.addStep('Enable MFA in configuration')
  guide.addStep('Migrate basicAuth implementations')

  guide.addCodeExample(
    `authenticate({ username, password })`,
    `login({ username, password, totp })`,
    'Login API change'
  )

  console.log(`Migration guide from ${guide.fromVersion} to ${guide.toVersion}:`)
  console.log(`  Breaking changes: ${guide.breakingChanges.length}`)
  console.log(`  Deprecated features: ${guide.deprecatedFeatures.length}`)
  console.log(`  New features: ${guide.newFeatures.length}`)
  console.log(`  Migration steps: ${guide.steps.length}`)
  console.log(`  Code examples: ${guide.codeExamples.length}`)

  guide.breakingChanges.forEach(change => {
    console.log(`\n  Breaking: ${change.change}`)
    console.log(`  → ${change.migration}`)
  })
}

/**
 * Example 4: Deprecation and lifecycle management
 */
function example4_Deprecation() {
  console.log('\n=== Example 4: Deprecation ===\n')

  const versioning = new SkillVersioning('./.claude/skill-versions')

  // Register versions
  versioning.register('old-logger', '1.0.0', 'old logger', { author: 'dave' })
  versioning.register('new-logger', '1.0.0', 'new logger', { author: 'dave' })

  // Create deprecation notice
  const notice = versioning.deprecate('old-logger', '1.0.0', 'Use new-logger instead')
  notice
    .replacedWith('new-logger')
    .setSunsetDate('2026-12-31')
    .setSeverity('warning')
    .addAlternative('winston', 'Third-party logging library')
    .addAlternative('pino', 'High-performance logging')

  console.log('Deprecation registered for old-logger@1.0.0')

  // Check deprecation
  if (versioning.isDeprecated('old-logger', '1.0.0')) {
    const warning = versioning.getDeprecationWarning('old-logger', '1.0.0')
    console.log('\n' + warning)
  }

  // Get all deprecations
  const allDeprecations = versioning.getDeprecations('old-logger')
  console.log(`\nTotal deprecations: ${allDeprecations.length}`)
}

/**
 * Example 5: Compatibility checking
 */
function example5_Compatibility() {
  console.log('\n=== Example 5: Compatibility ===\n')

  const versioning = new SkillVersioning('./.claude/skill-versions')

  // Register versions
  versioning.register('database', '1.0.0', 'v1 db', { author: 'eve' })
  versioning.register('database', '1.5.0', 'v1.5 db', { author: 'eve' })
  versioning.register('database', '2.0.0', 'v2 db', { author: 'eve' })
  versioning.register('database', '2.1.0', 'v2.1 db', { author: 'eve' })

  // Check compatibility
  console.log('Compatibility checks:')
  console.log(`  database@1.5.0 compatible with ^1.0.0? ${versioning.isCompatible('database', '^1.0.0', '1.5.0')}`)
  console.log(`  database@2.0.0 compatible with ^1.0.0? ${versioning.isCompatible('database', '^1.0.0', '2.0.0')}`)
  console.log(`  database@2.1.0 compatible with ~2.0.0? ${versioning.isCompatible('database', '~2.0.0', '2.1.0')}`)
  console.log(`  database@1.5.0 compatible with >=1.0.0? ${versioning.isCompatible('database', '>=1.0.0', '1.5.0')}`)

  // Build compatibility matrix
  const matrix = versioning.getCompatibilityMatrix('database')
  console.log('\nCompatibility matrix:')

  for (const [version, info] of Object.entries(matrix)) {
    console.log(`  ${version}:`)
    console.log(`    Deprecated: ${info.deprecated}`)
    console.log(`    Compatible with major: ${info.compatibleWith.join(', ')}`)
  }
}

/**
 * Example 6: Changelog and history
 */
function example6_Changelog() {
  console.log('\n=== Example 6: Changelog ===\n')

  const versioning = new SkillVersioning('./.claude/skill-versions')

  // Register versions
  versioning.register('cache-manager', '1.0.0', 'v1', { author: 'frank' })
  versioning.register('cache-manager', '1.1.0', 'v1.1', { author: 'frank' })
  versioning.register('cache-manager', '1.2.0', 'v1.2', { author: 'frank' })

  // Add changelog entries
  versioning.addChangelogEntry('cache-manager', '1.0.0', {
    action: 'released',
    type: 'feature'
  })

  versioning.addChangelogEntry('cache-manager', '1.1.0', {
    action: 'released',
    type: 'bugfix',
    description: 'Fixed memory leak'
  })

  versioning.addChangelogEntry('cache-manager', '1.2.0', {
    action: 'released',
    type: 'feature',
    description: 'Added TTL support'
  })

  // Get changelog
  const changelog = versioning.getChangelog('cache-manager')
  console.log('Changelog for cache-manager:')

  changelog.forEach(entry => {
    console.log(`  ${entry.version}: ${entry.action} (${entry.type || 'unknown'})`)
    if (entry.description) {
      console.log(`    → ${entry.description}`)
    }
  })

  // Get stats
  const stats = versioning.getStats('cache-manager')
  console.log(`\nStatistics:`)
  console.log(`  Total versions: ${stats.totalVersions}`)
  console.log(`  Latest: ${stats.latestVersion}`)
  console.log(`  Total changes: ${stats.totalChanges}`)
}

/**
 * Example 7: Persistence and export
 */
function example7_PersistenceAndExport() {
  console.log('\n=== Example 7: Persistence & Export ===\n')

  const versioning = new SkillVersioning('./.claude/skill-versions')

  // Register and persist
  versioning.register('export-skill', '1.0.0', 'code here', {
    author: 'grace',
    description: 'Test skill'
  })
  versioning.deprecate('export-skill', '1.0.0', 'Use v2')
  versioning.persist('export-skill')

  console.log('Skill registered and persisted to disk')

  // Export as JSON
  const json = versioning.export('export-skill', 'json')
  console.log('\nJSON Export (first 200 chars):')
  console.log(json.substring(0, 200) + '...')

  // Export as CSV
  const csv = versioning.export('export-skill', 'csv')
  console.log('\nCSV Export:')
  console.log(csv)
}

/**
 * Example 8: Complex workflow
 */
function example8_ComplexWorkflow() {
  console.log('\n=== Example 8: Complex Workflow ===\n')

  const versioning = new SkillVersioning('./.claude/skill-versions')

  // Simulate skill evolution
  console.log('Step 1: Develop and release v1.0.0')
  versioning.register('payment-gateway', '1.0.0', `
    function processPayment(amount, card) {
      return charge(card, amount)
    }
  `, {
    author: 'henry',
    description: 'Basic payment processing',
    tags: ['payment', 'core']
  })

  console.log('Step 2: Release v1.1.0 with minor improvements')
  versioning.register('payment-gateway', '1.1.0', `
    function processPayment(amount, card, metadata) {
      validateAmount(amount)
      return charge(card, amount, metadata)
    }
  `, {
    author: 'henry',
    description: 'Added metadata support',
    tags: ['payment', 'core']
  })

  console.log('Step 3: Release v2.0.0 with breaking changes')
  versioning.register('payment-gateway', '2.0.0', `
    class PaymentGateway {
      async process(paymentRequest) {
        const validated = await this.validate(paymentRequest)
        return this.charge(validated)
      }
    }
  `, {
    author: 'henry',
    description: 'Refactored to class-based API',
    breaking: true,
    tags: ['payment', 'core']
  })

  console.log('Step 4: Create migration guide v1.1.0 → v2.0.0')
  const migration = versioning.createMigrationGuide('payment-gateway', '1.1.0', '2.0.0')
  migration
    .addBreakingChange(
      'Function API replaced with class API',
      'Instantiate PaymentGateway and call process() method'
    )
    .addStep('Replace processPayment() calls with PaymentGateway.process()')
    .addStep('Update payment request format')
    .addCodeExample(
      'processPayment(99.99, card, metadata)',
      'new PaymentGateway().process({ amount: 99.99, card, metadata })',
      'Updated API'
    )

  console.log('Step 5: Deprecate v1.0.0')
  versioning.deprecate('payment-gateway', '1.0.0', 'Missing metadata support').replacedWith('payment-gateway@1.1.0')

  console.log('Step 6: View diff between v1.0.0 and v2.0.0')
  const diff = versioning.diff('payment-gateway', '1.0.0', '2.0.0')
  console.log(`  Changes: ${diff.changes.length}`)

  console.log('Step 7: Export full history')
  const stats = versioning.getStats('payment-gateway')
  console.log(`\nFinal Statistics:`)
  console.log(`  Total versions: ${stats.totalVersions}`)
  console.log(`  Latest version: ${stats.latestVersion}`)
  console.log(`  Deprecated versions: ${stats.deprecatedVersions}`)
}

/**
 * Example 9: Event listening
 */
function example9_EventListening() {
  console.log('\n=== Example 9: Event Listening ===\n')

  const versioning = new SkillVersioning('./.claude/skill-versions')

  // Set up event listeners
  versioning.on('version:registered', ({ skillId, version }) => {
    console.log(`Event: Version registered - ${skillId}@${version}`)
  })

  versioning.on('version:deprecated', ({ skillId, version, reason }) => {
    console.log(`Event: Version deprecated - ${skillId}@${version}`)
    console.log(`  Reason: ${reason}`)
  })

  versioning.on('version:rollback', ({ skillId, version }) => {
    console.log(`Event: Rollback to ${skillId}@${version}`)
  })

  versioning.on('migration:guide-created', ({ skillId, fromVersion, toVersion }) => {
    console.log(`Event: Migration guide created - ${fromVersion} → ${toVersion}`)
  })

  // Trigger events
  console.log('Triggering events...\n')
  versioning.register('event-skill', '1.0.0', 'code')
  versioning.register('event-skill', '2.0.0', 'code')
  versioning.deprecate('event-skill', '1.0.0', 'Use v2')
  versioning.createMigrationGuide('event-skill', '1.0.0', '2.0.0')
  versioning.rollback('event-skill', '1.0.0')
}

/**
 * Run all examples
 */
async function runExamples() {
  console.log('════════════════════════════════════════════════════════════')
  console.log('  Skill Versioning Integration Examples')
  console.log('════════════════════════════════════════════════════════════')

  try {
    example1_BasicVersioning()
    example2_Diffing()
    example3_MigrationGuides()
    example4_Deprecation()
    example5_Compatibility()
    example6_Changelog()
    example7_PersistenceAndExport()
    example8_ComplexWorkflow()
    example9_EventListening()

    console.log('\n════════════════════════════════════════════════════════════')
    console.log('  All examples completed successfully!')
    console.log('════════════════════════════════════════════════════════════\n')
  } catch (err) {
    console.error('\nError running examples:')
    console.error(err.message)
    console.error(err.stack)
  }
}

// Export for use as module or run directly
if (require.main === module) {
  runExamples()
}

module.exports = {
  example1_BasicVersioning,
  example2_Diffing,
  example3_MigrationGuides,
  example4_Deprecation,
  example5_Compatibility,
  example6_Changelog,
  example7_PersistenceAndExport,
  example8_ComplexWorkflow,
  example9_EventListening
}
