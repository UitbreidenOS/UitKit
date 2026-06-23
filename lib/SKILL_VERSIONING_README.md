# Skill Versioning System

Complete version control system for Claude Code skills with semantic versioning, rollback, diffing, migration guides, and deprecation management.

## Features

- **Semantic Versioning** (MAJOR.MINOR.PATCH) with prerelease and metadata support
- **Version Snapshots** with content hashing and metadata tracking
- **Rollback Support** to restore previous skill versions instantly
- **Diff & Change Tracking** between any two versions with line-by-line comparison
- **Migration Guides** with step-by-step instructions for version upgrades
- **Deprecation Warnings** with sunset dates, alternatives, and severity levels
- **Compatibility Matrix** for understanding which versions work together
- **Changelog Tracking** with automatic timestamped entries
- **Persistence** to disk with JSON-based storage
- **Export Options** as JSON or CSV for auditing and reporting

## Installation

```bash
npm install
```

## Quick Start

### Basic Version Management

```javascript
const { SkillVersioning } = require('./lib/skill-versioning')

const versioning = new SkillVersioning('./.claude/skill-versions')

// Register a new version
versioning.register('my-skill', '1.0.0', skillCode, {
  author: 'developer',
  description: 'Initial release'
})

// Get a specific version
const snapshot = versioning.getVersion('my-skill', '1.0.0')

// Get latest version
const latest = versioning.getLatest('my-skill')

// Get all versions (sorted by semver)
const allVersions = versioning.getAllVersions('my-skill')
```

### Rollback

```javascript
// Rollback to a previous version
const previous = versioning.rollback('my-skill', '1.0.0')
console.log(previous.version) // '1.0.0'
```

### Version Comparison

```javascript
// Get diff between two versions
const diff = versioning.diff('my-skill', '1.0.0', '2.0.0')
console.log(diff.changes)  // Line-by-line changes
console.log(diff.summary)  // { added: 5, removed: 2, modified: 3, ... }
```

### Migration Guides

```javascript
// Create migration guide
const guide = versioning.createMigrationGuide('my-skill', '1.0.0', '2.0.0')

// Add migration information
guide
  .addStep('Update configuration', 'config.format = "new"')
  .addBreakingChange('Old API removed', 'Use new API instead')
  .addNewFeature('Caching', 'Built-in caching support')
  .addCodeExample(
    'oldFunction()',
    'newFunction()',
    'Updated API signature'
  )

// Retrieve later
const retrieved = versioning.getMigrationGuide('my-skill', '1.0.0', '2.0.0')
```

### Deprecation Management

```javascript
// Mark version as deprecated
const notice = versioning.deprecate('my-skill', '1.0.0', 'Use v2 instead')

notice
  .replacedWith('my-skill@2.0.0')
  .setSunsetDate('2026-12-31')
  .setSeverity('warning')  // or 'error'
  .addAlternative('new-skill', 'Better implementation')

// Check deprecation
if (versioning.isDeprecated('my-skill', '1.0.0')) {
  const warning = versioning.getDeprecationWarning('my-skill', '1.0.0')
  console.warn(warning)
}

// Get all deprecations
const deprecations = versioning.getDeprecations('my-skill')
```

### Compatibility Checking

```javascript
// Check if version satisfies constraint
const compatible = versioning.isCompatible('my-skill', '^1.0.0', '1.5.0')

// Get compatible versions (same major version)
const compatible = versioning.getCompatibleVersions('my-skill', '1.0.0')

// Build compatibility matrix
const matrix = versioning.getCompatibilityMatrix('my-skill')
console.log(matrix['1.0.0'].compatibleWith)
console.log(matrix['1.0.0'].deprecated)
console.log(matrix['1.0.0'].migrationGuides)
```

## Semantic Version Matching

The system supports npm-style version range matching:

```javascript
const v = new SemanticVersion('1.5.0')

v.satisfies('^1.0.0')   // true - compatible with any 1.x
v.satisfies('~1.5.0')   // true - compatible with any 1.5.x
v.satisfies('>=1.0.0')  // true
v.satisfies('<=2.0.0')  // true
v.satisfies('>1.5.0')   // false
v.satisfies('<1.0.0')   // false
v.satisfies('=1.5.0')   // true

// Version comparison
const v1 = new SemanticVersion('1.0.0')
const v2 = new SemanticVersion('2.0.0')

v1.compare(v2)      // -1 (v1 is less)
v1.isLessThan(v2)   // true
v2.isGreaterThan(v1) // true
v1.isEqualTo('1.0.0') // true
```

## Prerelease Versions

```javascript
const alpha = new SemanticVersion('1.0.0-alpha')
const beta = new SemanticVersion('1.0.0-beta')
const stable = new SemanticVersion('1.0.0')

beta.isGreaterThan('1.0.0-alpha')   // true
stable.isGreaterThan('1.0.0-beta')  // true

// Prerelease versions are considered less than stable
alpha.isLessThan('1.0.0')  // true
```

## Changelog Management

```javascript
// Automatic changelog entries on registration/deprecation
versioning.register('skill', '1.0.0', code, {
  author: 'alice'
})

// Add custom entries
versioning.addChangelogEntry('skill', '1.0.0', {
  action: 'bugfix',
  description: 'Fixed critical issue'
})

// Retrieve changelog
const log = versioning.getChangelog('skill')          // All entries
const recent = versioning.getChangelog('skill', 10)  // Last 10 entries
```

## Persistence

```javascript
// Save to disk
versioning.persist('my-skill')
// Creates: .claude/skill-versions/my-skill/
//   - manifest.json (versions list)
//   - 1.0.0.json (snapshot metadata)
//   - changelog.json
//   - deprecations.json
//   - migrations.json

// Load from disk
versioning.load('my-skill')
```

## Export & Reporting

```javascript
// Export as JSON
const json = versioning.export('my-skill', 'json')
const data = JSON.parse(json)
// { skillId, stats, changelog, deprecations, exportedAt }

// Export as CSV
const csv = versioning.export('my-skill', 'csv')
// Headers: Skill, Version, Timestamp, Deprecated, Action

// Get statistics
const stats = versioning.getStats('my-skill')
console.log(stats)
// {
//   skillId: 'my-skill',
//   totalVersions: 5,
//   latestVersion: '2.0.0',
//   deprecatedVersions: 2,
//   totalChanges: 15,
//   versions: [...]
// }
```

## Events

The system emits events for tracking version lifecycle:

```javascript
versioning.on('version:registered', ({ skillId, version, snapshot }) => {
  console.log(`New version: ${skillId}@${version}`)
})

versioning.on('version:rollback', ({ skillId, version }) => {
  console.log(`Rolled back to: ${skillId}@${version}`)
})

versioning.on('version:deprecated', ({ skillId, version, reason }) => {
  console.log(`Deprecated: ${skillId}@${version}: ${reason}`)
})

versioning.on('migration:guide-created', ({ skillId, fromVersion, toVersion }) => {
  console.log(`Migration guide: ${skillId} ${fromVersion} → ${toVersion}`)
})
```

## Use Cases

### Scenario 1: Breaking Change Release

```javascript
const versioning = new SkillVersioning('./.claude/skill-versions')

// New major version with breaking changes
versioning.register('api-client', '2.0.0', newCode, {
  breaking: true,
  description: 'Rewritten for new API'
})

// Create migration guide
const guide = versioning.createMigrationGuide('api-client', '1.0.0', '2.0.0')
guide
  .addBreakingChange('Response format changed', 'Use new format')
  .addBreakingChange('Constructor signature', 'New parameters')
  .addCodeExample(
    'new Client(url)',
    'new Client({ baseUrl: url, timeout: 5000 })',
    'Constructor now takes config object'
  )

// Deprecate old version
const notice = versioning.deprecate('api-client', '1.0.0', 'Incompatible with new API')
notice
  .replacedWith('api-client@2.0.0')
  .setSunsetDate('2026-06-30')
  .setSeverity('error')  // Prevent usage
```

### Scenario 2: Gradual Feature Adoption

```javascript
// Version 1.5 adds optional feature
versioning.register('cache-plugin', '1.5.0', code, {
  description: 'Added optional caching'
})

const guide = versioning.createMigrationGuide('cache-plugin', '1.4.0', '1.5.0')
guide
  .addNewFeature('caching', 'Optional built-in caching (opt-in)')
  .addStep('To enable: add {cache: true} to config')

// Version 2.0 makes it required
versioning.register('cache-plugin', '2.0.0', code, {
  breaking: true
})

const guide2 = versioning.createMigrationGuide('cache-plugin', '1.5.0', '2.0.0')
guide2
  .addBreakingChange('Caching now required', 'Enable in config')
```

### Scenario 3: Security Patch

```javascript
// Patch with security fix
versioning.register('auth-helper', '1.0.1', securityFixCode, {
  description: 'Security: Fixed token validation bypass'
})

// Deprecate vulnerable versions
versioning.deprecate('auth-helper', '1.0.0', 'Security vulnerability in token validation')
  .setSeverity('error')
  .setSunsetDate('2026-05-15')

// Create guide for immediate upgrade
const guide = versioning.createMigrationGuide('auth-helper', '1.0.0', '1.0.1')
guide
  .addStep('Upgrade immediately', 'npm update')
  .addBugFix('Token validation bypass', 'Fixed token signature verification')
```

## API Reference

### SemanticVersion

```javascript
new SemanticVersion(versionString)
  .compare(other)          // Returns -1, 0, or 1
  .isGreaterThan(other)    // Returns boolean
  .isLessThan(other)       // Returns boolean
  .isEqualTo(other)        // Returns boolean
  .satisfies(range)        // Returns boolean (supports ^, ~, >, <, >=, <=, =)
  .toString()              // Returns formatted version string
```

### SkillSnapshot

```javascript
new SkillSnapshot(skillId, version, content, metadata)
  .toJSON()                // Returns serializable object
```

### MigrationGuide

```javascript
new MigrationGuide(skillId, fromVersion, toVersion)
  .addStep(description, code)
  .addBreakingChange(change, migration)
  .addDeprecatedFeature(feature, replacement)
  .addNewFeature(feature, description)
  .addBugFix(bug, fix)
  .addCodeExample(before, after, description)
  .toJSON()
```

### DeprecationNotice

```javascript
new DeprecationNotice(skillId, version, reason)
  .replacedWith(newSkill)
  .setSunsetDate(dateString)
  .setSeverity('warning' | 'error')
  .addAlternative(skillId, reason)
  .toJSON()
```

### SkillVersioning

Main orchestrator for version control:

```javascript
new SkillVersioning(storageDir)
  .register(skillId, version, content, metadata)
  .getVersion(skillId, version)
  .getLatest(skillId)
  .getAllVersions(skillId)
  .rollback(skillId, targetVersion)
  .diff(skillId, versionA, versionB)
  .createMigrationGuide(skillId, fromVersion, toVersion)
  .getMigrationGuide(skillId, fromVersion, toVersion)
  .deprecate(skillId, version, reason)
  .getDeprecationNotice(skillId, version)
  .isDeprecated(skillId, version)
  .getDeprecations(skillId)
  .isCompatible(skillId, requiredVersion, actualVersion)
  .getCompatibleVersions(skillId, version)
  .getCompatibilityMatrix(skillId)
  .addChangelogEntry(skillId, version, entry)
  .getChangelog(skillId, limit)
  .getStats(skillId)
  .export(skillId, format)  // 'json' or 'csv'
  .persist(skillId)
  .load(skillId)
```

## Storage Structure

```
.claude/skill-versions/
├── my-skill/
│   ├── manifest.json              # Version metadata index
│   ├── 1.0.0.json                 # Version snapshot
│   ├── 1.1.0.json
│   ├── 2.0.0.json
│   ├── changelog.json             # Full changelog
│   ├── deprecations.json          # Deprecation notices
│   └── migrations.json            # Migration guides
└── other-skill/
    ├── manifest.json
    └── ...
```

## Testing

Run the comprehensive test suite:

```bash
node lib/skill-versioning.test.js
```

Tests cover:
- Semantic version parsing and comparison
- Version registration and retrieval
- Rollback functionality
- Diff generation
- Migration guides
- Deprecation management
- Compatibility checking
- Changelog tracking
- Persistence and loading
- Export functionality
- Event emission

## Performance Considerations

- **In-memory Storage**: Versions cached in memory for fast access
- **Lazy Loading**: Disk reads only when needed
- **Efficient Diffing**: Line-by-line comparison with summary counts
- **Hashing**: SHA256 content hashing for integrity verification

## Integration Examples

See `/lib/skill-versioning-integration-example.js` for:
- Basic version management
- Version lifecycle with deprecation
- Complex migration scenarios
- Batch operations
- Event-driven workflows
- Reporting and analytics

## Error Handling

```javascript
try {
  versioning.getVersion('skill', '99.0.0')
} catch (err) {
  console.error(err.message)  // "Version not found: skill@99.0.0"
}

try {
  new SemanticVersion('invalid')
} catch (err) {
  console.error(err.message)  // "Invalid semantic version: invalid"
}
```

## Best Practices

1. **Use semantic versioning**: MAJOR.MINOR.PATCH consistently
2. **Document breaking changes**: Always create migration guides
3. **Set sunset dates**: Give users time to migrate from deprecated versions
4. **Use severity wisely**: Error-level deprecations for critical changes
5. **Maintain changelog**: Add entries for significant changes
6. **Test compatibility**: Use compatibility matrix for regression detection
7. **Batch deprecations**: Group related deprecations together
8. **Automate persistence**: Persist after major operations

## License

This file is part of Claudient.
