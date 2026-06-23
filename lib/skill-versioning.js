/**
 * Skill Versioning System
 * Semantic versioning for skills with rollback, diff, migration guides, and deprecation warnings
 *
 * Features:
 * - Semantic versioning (MAJOR.MINOR.PATCH)
 * - Version history and snapshots
 * - Rollback to any version
 * - Diff between versions
 * - Deprecation warnings and lifecycle management
 * - Migration guides for version changes
 * - Compatibility matrix
 * - Changelog tracking
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { EventEmitter } = require('events')

/**
 * Semantic version comparator
 */
class SemanticVersion {
  constructor(version) {
    const parsed = this.parse(version)
    this.major = parsed.major
    this.minor = parsed.minor
    this.patch = parsed.patch
    this.prerelease = parsed.prerelease
    this.metadata = parsed.metadata
  }

  parse(version) {
    const match = String(version).match(
      /^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.-]+))?(?:\+([a-zA-Z0-9.-]+))?$/
    )
    if (!match) {
      throw new Error(`Invalid semantic version: ${version}`)
    }
    return {
      major: parseInt(match[1], 10),
      minor: parseInt(match[2], 10),
      patch: parseInt(match[3], 10),
      prerelease: match[4] || null,
      metadata: match[5] || null
    }
  }

  toString() {
    let version = `${this.major}.${this.minor}.${this.patch}`
    if (this.prerelease) version += `-${this.prerelease}`
    if (this.metadata) version += `+${this.metadata}`
    return version
  }

  compare(other) {
    const ov = new SemanticVersion(other)
    if (this.major !== ov.major) return this.major - ov.major
    if (this.minor !== ov.minor) return this.minor - ov.minor
    if (this.patch !== ov.patch) return this.patch - ov.patch
    if (this.prerelease && !ov.prerelease) return -1
    if (!this.prerelease && ov.prerelease) return 1
    if (this.prerelease && ov.prerelease) {
      return this.prerelease.localeCompare(ov.prerelease)
    }
    return 0
  }

  isGreaterThan(other) {
    return this.compare(other) > 0
  }

  isLessThan(other) {
    return this.compare(other) < 0
  }

  isEqualTo(other) {
    return this.compare(other) === 0
  }

  satisfies(range) {
    // Simple semver range matching: ^1.2.3, ~1.2.3, >=1.2.3, etc.
    if (range.startsWith('^')) {
      const base = new SemanticVersion(range.slice(1))
      return (
        this.major === base.major &&
        !this.isLessThan(base.toString())
      )
    }
    if (range.startsWith('~')) {
      const base = new SemanticVersion(range.slice(1))
      return (
        this.major === base.major &&
        this.minor === base.minor &&
        !this.isLessThan(base.toString())
      )
    }
    if (range.startsWith('>=')) {
      return !this.isLessThan(range.slice(2))
    }
    if (range.startsWith('<=')) {
      return !this.isGreaterThan(range.slice(2))
    }
    if (range.startsWith('>')) {
      return this.isGreaterThan(range.slice(1))
    }
    if (range.startsWith('<')) {
      return this.isLessThan(range.slice(1))
    }
    return this.isEqualTo(range)
  }
}

/**
 * Skill version snapshot
 */
class SkillSnapshot {
  constructor(skillId, version, content, metadata = {}) {
    this.skillId = skillId
    this.version = new SemanticVersion(version).toString()
    this.content = content
    this.hash = this.computeHash(content)
    this.timestamp = new Date().toISOString()
    this.metadata = {
      author: metadata.author || 'unknown',
      description: metadata.description || '',
      breaking: metadata.breaking || false,
      deprecated: metadata.deprecated || false,
      deprecationReason: metadata.deprecationReason || null,
      replacedBy: metadata.replacedBy || null,
      tags: metadata.tags || [],
      ...metadata
    }
    this.changesSummary = metadata.changesSummary || null
  }

  computeHash(content) {
    return crypto.createHash('sha256').update(content).digest('hex')
  }

  toJSON() {
    return {
      skillId: this.skillId,
      version: this.version,
      hash: this.hash,
      timestamp: this.timestamp,
      metadata: this.metadata,
      contentLength: this.content.length,
      changesSummary: this.changesSummary
    }
  }
}

/**
 * Migration guide between versions
 */
class MigrationGuide {
  constructor(skillId, fromVersion, toVersion) {
    this.skillId = skillId
    this.fromVersion = new SemanticVersion(fromVersion).toString()
    this.toVersion = new SemanticVersion(toVersion).toString()
    this.steps = []
    this.breakingChanges = []
    this.deprecatedFeatures = []
    this.newFeatures = []
    this.bugFixes = []
    this.codeExamples = []
  }

  addStep(description, code = null) {
    this.steps.push({ description, code })
    return this
  }

  addBreakingChange(change, migration) {
    this.breakingChanges.push({ change, migration })
    return this
  }

  addDeprecatedFeature(feature, replacement) {
    this.deprecatedFeatures.push({ feature, replacement })
    return this
  }

  addNewFeature(feature, description) {
    this.newFeatures.push({ feature, description })
    return this
  }

  addBugFix(bug, fix) {
    this.bugFixes.push({ bug, fix })
    return this
  }

  addCodeExample(before, after, description) {
    this.codeExamples.push({ before, after, description })
    return this
  }

  toJSON() {
    return {
      skillId: this.skillId,
      fromVersion: this.fromVersion,
      toVersion: this.toVersion,
      breakingChanges: this.breakingChanges,
      deprecatedFeatures: this.deprecatedFeatures,
      newFeatures: this.newFeatures,
      bugFixes: this.bugFixes,
      steps: this.steps,
      codeExamples: this.codeExamples
    }
  }
}

/**
 * Deprecation notice
 */
class DeprecationNotice {
  constructor(skillId, version, reason) {
    this.skillId = skillId
    this.version = new SemanticVersion(version).toString()
    this.reason = reason
    this.replacedBy = null
    this.sunsetDate = null
    this.severity = 'warning' // 'warning' | 'error'
    this.alternatives = []
  }

  replacedWith(newSkill) {
    this.replacedBy = newSkill
    return this
  }

  setSunsetDate(date) {
    this.sunsetDate = new Date(date).toISOString()
    return this
  }

  setSeverity(level) {
    if (!['warning', 'error'].includes(level)) {
      throw new Error(`Invalid severity: ${level}`)
    }
    this.severity = level
    return this
  }

  addAlternative(skillId, reason) {
    this.alternatives.push({ skillId, reason })
    return this
  }

  toJSON() {
    return {
      skillId: this.skillId,
      version: this.version,
      reason: this.reason,
      replacedBy: this.replacedBy,
      sunsetDate: this.sunsetDate,
      severity: this.severity,
      alternatives: this.alternatives
    }
  }
}

/**
 * Main skill versioning system
 */
class SkillVersioning extends EventEmitter {
  constructor(storageDir = './.claude/skill-versions') {
    super()
    this.storageDir = storageDir
    this.versions = new Map() // skillId -> version list
    this.snapshots = new Map() // skillId@version -> SkillSnapshot
    this.migrations = new Map() // skillId@fromVersion@toVersion -> MigrationGuide
    this.deprecations = new Map() // skillId@version -> DeprecationNotice
    this.changelog = new Map() // skillId -> changelog entries
    this.ensureStorageDir()
  }

  ensureStorageDir() {
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true })
    }
  }

  /**
   * Register a new skill version
   */
  register(skillId, version, content, metadata = {}) {
    const semver = new SemanticVersion(version).toString()
    const snapshot = new SkillSnapshot(skillId, semver, content, metadata)

    const key = `${skillId}@${semver}`
    this.snapshots.set(key, snapshot)

    if (!this.versions.has(skillId)) {
      this.versions.set(skillId, [])
    }

    const versionList = this.versions.get(skillId)
    if (!versionList.includes(semver)) {
      versionList.push(semver)
      versionList.sort((a, b) => new SemanticVersion(b).compare(a))
    }

    this.addChangelogEntry(skillId, semver, {
      action: 'registered',
      timestamp: snapshot.timestamp,
      metadata
    })

    this.persist(skillId)
    this.emit('version:registered', { skillId, version: semver, snapshot })

    return snapshot
  }

  /**
   * Get a specific version snapshot
   */
  getVersion(skillId, version) {
    const semver = new SemanticVersion(version).toString()
    const key = `${skillId}@${semver}`
    const snapshot = this.snapshots.get(key)

    if (!snapshot) {
      throw new Error(`Version not found: ${skillId}@${semver}`)
    }

    return snapshot
  }

  /**
   * Get latest version
   */
  getLatest(skillId) {
    const versions = this.versions.get(skillId)
    if (!versions || versions.length === 0) {
      throw new Error(`No versions found for skill: ${skillId}`)
    }
    return this.getVersion(skillId, versions[0])
  }

  /**
   * Get all versions of a skill
   */
  getAllVersions(skillId) {
    const versions = this.versions.get(skillId) || []
    return versions.map(v => this.getVersion(skillId, v))
  }

  /**
   * Rollback to a specific version
   */
  rollback(skillId, targetVersion) {
    const snapshot = this.getVersion(skillId, targetVersion)

    this.addChangelogEntry(skillId, targetVersion, {
      action: 'rollback',
      timestamp: new Date().toISOString()
    })

    this.emit('version:rollback', { skillId, version: targetVersion })
    this.persist(skillId)

    return snapshot
  }

  /**
   * Diff between two versions
   */
  diff(skillId, versionA, versionB) {
    const snapshotA = this.getVersion(skillId, versionA)
    const snapshotB = this.getVersion(skillId, versionB)

    const contentA = snapshotA.content.split('\n')
    const contentB = snapshotB.content.split('\n')

    const lines = []
    const maxLines = Math.max(contentA.length, contentB.length)

    for (let i = 0; i < maxLines; i++) {
      const lineA = contentA[i] || ''
      const lineB = contentB[i] || ''

      if (lineA !== lineB) {
        lines.push({
          lineNumber: i + 1,
          removed: lineA,
          added: lineB
        })
      }
    }

    return {
      skillId,
      versionA: snapshotA.version,
      versionB: snapshotB.version,
      changes: lines,
      summary: {
        added: lines.filter(l => l.added && !l.removed).length,
        removed: lines.filter(l => l.removed && !l.added).length,
        modified: lines.filter(l => l.added && l.removed).length,
        hashA: snapshotA.hash,
        hashB: snapshotB.hash
      }
    }
  }

  /**
   * Create a migration guide
   */
  createMigrationGuide(skillId, fromVersion, toVersion) {
    const guide = new MigrationGuide(skillId, fromVersion, toVersion)
    const key = `${skillId}@${guide.fromVersion}@${guide.toVersion}`
    this.migrations.set(key, guide)

    this.emit('migration:guide-created', {
      skillId,
      fromVersion: guide.fromVersion,
      toVersion: guide.toVersion
    })

    return guide
  }

  /**
   * Get migration guide
   */
  getMigrationGuide(skillId, fromVersion, toVersion) {
    const fromSem = new SemanticVersion(fromVersion).toString()
    const toSem = new SemanticVersion(toVersion).toString()
    const key = `${skillId}@${fromSem}@${toSem}`
    return this.migrations.get(key)
  }

  /**
   * Mark version as deprecated
   */
  deprecate(skillId, version, reason) {
    const notice = new DeprecationNotice(skillId, version, reason)
    const key = `${skillId}@${notice.version}`
    this.deprecations.set(key, notice)

    this.addChangelogEntry(skillId, notice.version, {
      action: 'deprecated',
      reason,
      timestamp: new Date().toISOString()
    })

    this.emit('version:deprecated', { skillId, version: notice.version, reason })
    this.persist(skillId)

    return notice
  }

  /**
   * Get deprecation notice
   */
  getDeprecationNotice(skillId, version) {
    const semver = new SemanticVersion(version).toString()
    const key = `${skillId}@${semver}`
    return this.deprecations.get(key)
  }

  /**
   * Check if version is deprecated
   */
  isDeprecated(skillId, version) {
    return this.getDeprecationNotice(skillId, version) !== undefined
  }

  /**
   * Get all deprecation notices for a skill
   */
  getDeprecations(skillId) {
    const deprecations = []
    for (const [key, notice] of this.deprecations) {
      if (key.startsWith(`${skillId}@`)) {
        deprecations.push(notice)
      }
    }
    return deprecations
  }

  /**
   * Check version compatibility
   */
  isCompatible(skillId, requiredVersion, actualVersion) {
    try {
      const required = new SemanticVersion(requiredVersion)
      const actual = new SemanticVersion(actualVersion)
      return actual.satisfies(requiredVersion)
    } catch (err) {
      return false
    }
  }

  /**
   * Build compatibility matrix
   */
  getCompatibilityMatrix(skillId) {
    const versions = this.getAllVersions(skillId)
    const matrix = {}

    for (const version of versions) {
      matrix[version.version] = {
        deprecated: this.isDeprecated(skillId, version.version),
        compatibleWith: this.getCompatibleVersions(skillId, version.version),
        migrationGuides: this.getMigrationGuidesFor(skillId, version.version)
      }
    }

    return matrix
  }

  /**
   * Get compatible versions
   */
  getCompatibleVersions(skillId, version) {
    const versions = this.versions.get(skillId) || []
    const semver = new SemanticVersion(version)
    const compatible = []

    for (const v of versions) {
      const current = new SemanticVersion(v)
      if (current.major === semver.major) {
        compatible.push(v)
      }
    }

    return compatible
  }

  /**
   * Get migration guides for a version
   */
  getMigrationGuidesFor(skillId, version) {
    const guides = []
    for (const [key, guide] of this.migrations) {
      if (key.startsWith(`${skillId}@`) &&
          (guide.fromVersion === version || guide.toVersion === version)) {
        guides.push({
          fromVersion: guide.fromVersion,
          toVersion: guide.toVersion
        })
      }
    }
    return guides
  }

  /**
   * Add changelog entry
   */
  addChangelogEntry(skillId, version, entry) {
    if (!this.changelog.has(skillId)) {
      this.changelog.set(skillId, [])
    }

    const log = this.changelog.get(skillId)
    log.push({
      version: new SemanticVersion(version).toString(),
      timestamp: entry.timestamp || new Date().toISOString(),
      ...entry
    })

    return this
  }

  /**
   * Get changelog
   */
  getChangelog(skillId, limit = null) {
    const log = this.changelog.get(skillId) || []
    return limit ? log.slice(-limit) : log
  }

  /**
   * Generate deprecation warning
   */
  getDeprecationWarning(skillId, version) {
    const notice = this.getDeprecationNotice(skillId, version)
    if (!notice) return null

    const messages = [
      `[DEPRECATION] ${skillId}@${version}: ${notice.reason}`
    ]

    if (notice.replacedBy) {
      messages.push(`  → Use ${notice.replacedBy} instead`)
    }

    if (notice.sunsetDate) {
      const sunset = new Date(notice.sunsetDate)
      const now = new Date()
      const daysLeft = Math.ceil((sunset - now) / (1000 * 60 * 60 * 24))
      messages.push(`  → Sunset date: ${notice.sunsetDate} (${daysLeft} days remaining)`)
    }

    if (notice.alternatives.length > 0) {
      messages.push(`  → Alternatives:`)
      for (const alt of notice.alternatives) {
        messages.push(`     - ${alt.skillId}: ${alt.reason}`)
      }
    }

    if (notice.severity === 'error') {
      messages.unshift('[ERROR]')
    }

    return messages.join('\n')
  }

  /**
   * Validate version compatibility
   */
  validateCompatibility(skillId, version) {
    const semver = new SemanticVersion(version)
    const deprecation = this.getDeprecationNotice(skillId, version)

    const result = {
      version: semver.toString(),
      valid: true,
      warnings: [],
      errors: []
    }

    if (deprecation) {
      result.warnings.push(deprecation.reason)
      if (deprecation.severity === 'error') {
        result.valid = false
        result.errors.push(`Version is deprecated as error: ${deprecation.reason}`)
      }
    }

    return result
  }

  /**
   * Persist versions to disk
   */
  persist(skillId) {
    const skillDir = path.join(this.storageDir, skillId)
    if (!fs.existsSync(skillDir)) {
      fs.mkdirSync(skillDir, { recursive: true })
    }

    // Persist versions manifest
    const versions = this.versions.get(skillId) || []
    const manifest = {
      skillId,
      versions,
      lastUpdated: new Date().toISOString()
    }

    fs.writeFileSync(
      path.join(skillDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    )

    // Persist individual snapshots
    for (const version of versions) {
      const snapshot = this.snapshots.get(`${skillId}@${version}`)
      if (snapshot) {
        fs.writeFileSync(
          path.join(skillDir, `${version}.json`),
          JSON.stringify(snapshot.toJSON(), null, 2)
        )
      }
    }

    // Persist changelog
    const changelog = this.changelog.get(skillId) || []
    if (changelog.length > 0) {
      fs.writeFileSync(
        path.join(skillDir, 'changelog.json'),
        JSON.stringify(changelog, null, 2)
      )
    }

    // Persist deprecations
    const deprecations = []
    for (const [key, notice] of this.deprecations) {
      if (key.startsWith(`${skillId}@`)) {
        deprecations.push(notice.toJSON())
      }
    }
    if (deprecations.length > 0) {
      fs.writeFileSync(
        path.join(skillDir, 'deprecations.json'),
        JSON.stringify(deprecations, null, 2)
      )
    }

    // Persist migrations
    const migrations = []
    for (const [key, guide] of this.migrations) {
      if (key.startsWith(`${skillId}@`)) {
        migrations.push(guide.toJSON())
      }
    }
    if (migrations.length > 0) {
      fs.writeFileSync(
        path.join(skillDir, 'migrations.json'),
        JSON.stringify(migrations, null, 2)
      )
    }
  }

  /**
   * Load from disk
   */
  load(skillId) {
    const skillDir = path.join(this.storageDir, skillId)
    if (!fs.existsSync(skillDir)) {
      return
    }

    // Load manifest
    const manifestPath = path.join(skillDir, 'manifest.json')
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
      this.versions.set(skillId, manifest.versions)
    }

    // Load snapshots
    const files = fs.readdirSync(skillDir)
    for (const file of files) {
      if (file.match(/^\d+\.\d+\.\d+/)) {
        const version = file.replace('.json', '')
        const snapshotPath = path.join(skillDir, file)
        const data = JSON.parse(fs.readFileSync(snapshotPath, 'utf-8'))
        // Reconstruct snapshot (content not persisted in JSON)
        const key = `${skillId}@${version}`
        this.snapshots.set(key, data)
      }
    }

    // Load changelog
    const changelogPath = path.join(skillDir, 'changelog.json')
    if (fs.existsSync(changelogPath)) {
      const changelog = JSON.parse(fs.readFileSync(changelogPath, 'utf-8'))
      this.changelog.set(skillId, changelog)
    }

    // Load deprecations
    const deprecationsPath = path.join(skillDir, 'deprecations.json')
    if (fs.existsSync(deprecationsPath)) {
      const deprecations = JSON.parse(fs.readFileSync(deprecationsPath, 'utf-8'))
      for (const dep of deprecations) {
        const key = `${dep.skillId}@${dep.version}`
        const notice = new DeprecationNotice(dep.skillId, dep.version, dep.reason)
        if (dep.replacedBy) notice.replacedBy = dep.replacedBy
        if (dep.sunsetDate) notice.sunsetDate = dep.sunsetDate
        notice.severity = dep.severity
        notice.alternatives = dep.alternatives
        this.deprecations.set(key, notice)
      }
    }

    // Load migrations
    const migrationsPath = path.join(skillDir, 'migrations.json')
    if (fs.existsSync(migrationsPath)) {
      const migrations = JSON.parse(fs.readFileSync(migrationsPath, 'utf-8'))
      for (const mig of migrations) {
        const key = `${mig.skillId}@${mig.fromVersion}@${mig.toVersion}`
        const guide = new MigrationGuide(mig.skillId, mig.fromVersion, mig.toVersion)
        guide.steps = mig.steps
        guide.breakingChanges = mig.breakingChanges
        guide.deprecatedFeatures = mig.deprecatedFeatures
        guide.newFeatures = mig.newFeatures
        guide.bugFixes = mig.bugFixes
        guide.codeExamples = mig.codeExamples
        this.migrations.set(key, guide)
      }
    }
  }

  /**
   * Get version statistics
   */
  getStats(skillId) {
    const versions = this.getAllVersions(skillId)
    const deprecations = this.getDeprecations(skillId)
    const changelog = this.getChangelog(skillId)

    return {
      skillId,
      totalVersions: versions.length,
      latestVersion: versions[0]?.version,
      deprecatedVersions: deprecations.length,
      totalChanges: changelog.length,
      versions: versions.map(v => ({
        version: v.version,
        timestamp: v.timestamp,
        deprecated: this.isDeprecated(skillId, v.version)
      }))
    }
  }

  /**
   * Export version history
   */
  export(skillId, format = 'json') {
    const stats = this.getStats(skillId)
    const changelog = this.getChangelog(skillId)
    const deprecations = this.getDeprecations(skillId).map(d => d.toJSON())

    const data = {
      skillId,
      stats,
      changelog,
      deprecations,
      exportedAt: new Date().toISOString()
    }

    if (format === 'json') {
      return JSON.stringify(data, null, 2)
    } else if (format === 'csv') {
      return this.toCSV(data)
    }

    return data
  }

  toCSV(data) {
    const rows = [
      ['Skill', 'Version', 'Timestamp', 'Deprecated', 'Action'],
      ...data.changelog.map(entry => [
        data.skillId,
        entry.version,
        entry.timestamp,
        data.deprecations.some(d => d.version === entry.version) ? 'Yes' : 'No',
        entry.action
      ])
    ]

    return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
  }
}

module.exports = {
  SkillVersioning,
  SemanticVersion,
  SkillSnapshot,
  MigrationGuide,
  DeprecationNotice
}
