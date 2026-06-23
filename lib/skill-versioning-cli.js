#!/usr/bin/env node

/**
 * Skill Versioning CLI
 * Command-line interface for managing skill versions
 *
 * Usage:
 *   skill-versioning list <skillId>
 *   skill-versioning register <skillId> <version> <file>
 *   skill-versioning get <skillId> <version>
 *   skill-versioning latest <skillId>
 *   skill-versioning rollback <skillId> <version>
 *   skill-versioning diff <skillId> <versionA> <versionB>
 *   skill-versioning deprecate <skillId> <version> <reason>
 *   skill-versioning check-deprecation <skillId> <version>
 *   skill-versioning compatible <skillId> <version1> <version2>
 *   skill-versioning stats <skillId>
 *   skill-versioning export <skillId> [json|csv]
 *   skill-versioning changelog <skillId> [limit]
 *   skill-versioning migrate <skillId> <fromVersion> <toVersion>
 */

const fs = require('fs')
const path = require('path')
const {
  SkillVersioning,
  SemanticVersion,
  MigrationGuide
} = require('./skill-versioning')

const STORAGE_DIR = process.env.SKILL_VERSIONS_DIR || './.claude/skill-versions'
const versioning = new SkillVersioning(STORAGE_DIR)

// ============================================================================
// CLI Commands
// ============================================================================

const commands = {
  /**
   * List all versions of a skill
   */
  list: (skillId) => {
    try {
      const versions = versioning.getAllVersions(skillId)

      if (versions.length === 0) {
        console.log(`No versions found for skill: ${skillId}`)
        return
      }

      console.log(`\nVersions for ${skillId}:\n`)

      for (const v of versions) {
        const deprecated = versioning.isDeprecated(skillId, v.version)
        const deprecationMark = deprecated ? ' [DEPRECATED]' : ''
        const timestamp = new Date(v.timestamp).toISOString()
        console.log(`  ${v.version}${deprecationMark}`)
        console.log(`    Timestamp: ${timestamp}`)
        console.log(`    Hash: ${v.hash.slice(0, 12)}...`)
      }

      console.log()
    } catch (err) {
      console.error(`Error: ${err.message}`)
      process.exit(1)
    }
  },

  /**
   * Register a new version from file
   */
  register: (skillId, version, filePath, opts = {}) => {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`)
      }

      const content = fs.readFileSync(filePath, 'utf-8')
      const metadata = {
        author: opts.author || process.env.USER || 'unknown',
        description: opts.description || '',
        ...opts
      }

      const snapshot = versioning.register(skillId, version, content, metadata)

      versioning.persist(skillId)

      console.log(`✓ Registered ${skillId}@${snapshot.version}`)
      console.log(`  File: ${filePath}`)
      console.log(`  Hash: ${snapshot.hash}`)
      console.log(`  Author: ${metadata.author}`)
      if (metadata.description) {
        console.log(`  Description: ${metadata.description}`)
      }
    } catch (err) {
      console.error(`Error: ${err.message}`)
      process.exit(1)
    }
  },

  /**
   * Get and display a specific version
   */
  get: (skillId, version) => {
    try {
      const snapshot = versioning.getVersion(skillId, version)

      console.log(`\n${skillId}@${snapshot.version}\n`)
      console.log(`Timestamp: ${snapshot.timestamp}`)
      console.log(`Author: ${snapshot.metadata.author}`)
      console.log(`Hash: ${snapshot.hash}`)

      if (snapshot.metadata.description) {
        console.log(`Description: ${snapshot.metadata.description}`)
      }

      if (snapshot.metadata.tags && snapshot.metadata.tags.length > 0) {
        console.log(`Tags: ${snapshot.metadata.tags.join(', ')}`)
      }

      console.log()
    } catch (err) {
      console.error(`Error: ${err.message}`)
      process.exit(1)
    }
  },

  /**
   * Get latest version
   */
  latest: (skillId) => {
    try {
      const latest = versioning.getLatest(skillId)
      console.log(latest.version)
    } catch (err) {
      console.error(`Error: ${err.message}`)
      process.exit(1)
    }
  },

  /**
   * Rollback to a version
   */
  rollback: (skillId, version) => {
    try {
      const snapshot = versioning.rollback(skillId, version)
      versioning.persist(skillId)

      console.log(`✓ Rolled back to ${skillId}@${version}`)
      console.log(`  Hash: ${snapshot.hash}`)
      console.log(`  Timestamp: ${snapshot.timestamp}`)
    } catch (err) {
      console.error(`Error: ${err.message}`)
      process.exit(1)
    }
  },

  /**
   * Diff between two versions
   */
  diff: (skillId, versionA, versionB) => {
    try {
      const diff = versioning.diff(skillId, versionA, versionB)

      console.log(`\nDiff: ${skillId}@${versionA} → @${versionB}\n`)
      console.log(`Summary:`)
      console.log(`  Added:    ${diff.summary.added}`)
      console.log(`  Removed:  ${diff.summary.removed}`)
      console.log(`  Modified: ${diff.summary.modified}`)
      console.log(`  Hash A:   ${diff.summary.hashA}`)
      console.log(`  Hash B:   ${diff.summary.hashB}`)

      if (diff.changes.length > 0) {
        console.log(`\nChanges:`)
        for (const change of diff.changes.slice(0, 20)) {
          console.log(`\n  Line ${change.lineNumber}:`)
          if (change.removed) {
            console.log(`    - ${change.removed.slice(0, 70)}...`)
          }
          if (change.added) {
            console.log(`    + ${change.added.slice(0, 70)}...`)
          }
        }

        if (diff.changes.length > 20) {
          console.log(`\n  ... and ${diff.changes.length - 20} more changes`)
        }
      }

      console.log()
    } catch (err) {
      console.error(`Error: ${err.message}`)
      process.exit(1)
    }
  },

  /**
   * Deprecate a version
   */
  deprecate: (skillId, version, reason, opts = {}) => {
    try {
      const notice = versioning.deprecate(skillId, version, reason)

      if (opts.replacement) {
        notice.replacedWith(opts.replacement)
      }

      if (opts.sunsetDate) {
        notice.setSunsetDate(opts.sunsetDate)
      }

      if (opts.severity) {
        notice.setSeverity(opts.severity)
      }

      versioning.persist(skillId)

      console.log(`✓ Deprecated ${skillId}@${version}`)
      console.log(`  Reason: ${reason}`)

      if (opts.replacement) {
        console.log(`  Replacement: ${opts.replacement}`)
      }

      if (opts.sunsetDate) {
        console.log(`  Sunset Date: ${opts.sunsetDate}`)
      }

      if (opts.severity) {
        console.log(`  Severity: ${opts.severity}`)
      }
    } catch (err) {
      console.error(`Error: ${err.message}`)
      process.exit(1)
    }
  },

  /**
   * Check if version is deprecated
   */
  checkDeprecation: (skillId, version) => {
    try {
      if (!versioning.isDeprecated(skillId, version)) {
        console.log(`${skillId}@${version} is NOT deprecated`)
        return
      }

      const warning = versioning.getDeprecationWarning(skillId, version)
      console.log(warning)
    } catch (err) {
      console.error(`Error: ${err.message}`)
      process.exit(1)
    }
  },

  /**
   * Check compatibility between versions
   */
  compatible: (skillId, version1, version2) => {
    try {
      const compatible = versioning.isCompatible(skillId, version1, version2)

      if (compatible) {
        console.log(`✓ ${skillId}@${version2} is compatible with constraint ${version1}`)
      } else {
        console.log(`✗ ${skillId}@${version2} is NOT compatible with constraint ${version1}`)
      }
    } catch (err) {
      console.error(`Error: ${err.message}`)
      process.exit(1)
    }
  },

  /**
   * Get statistics
   */
  stats: (skillId) => {
    try {
      const stats = versioning.getStats(skillId)

      console.log(`\n${skillId} Statistics\n`)
      console.log(`Total Versions:     ${stats.totalVersions}`)
      console.log(`Latest Version:     ${stats.latestVersion}`)
      console.log(`Deprecated:         ${stats.deprecatedVersions}`)
      console.log(`Total Changes:      ${stats.totalChanges}`)

      console.log(`\nVersion History:`)
      for (const v of stats.versions) {
        const deprecated = v.deprecated ? ' [DEPRECATED]' : ''
        const timestamp = new Date(v.timestamp).toISOString().split('T')[0]
        console.log(`  ${v.version}${deprecated} - ${timestamp}`)
      }

      console.log()
    } catch (err) {
      console.error(`Error: ${err.message}`)
      process.exit(1)
    }
  },

  /**
   * Export version history
   */
  export: (skillId, format = 'json') => {
    try {
      const exported = versioning.export(skillId, format)

      if (format === 'json') {
        console.log(exported)
      } else if (format === 'csv') {
        console.log(exported)
      }
    } catch (err) {
      console.error(`Error: ${err.message}`)
      process.exit(1)
    }
  },

  /**
   * Get changelog
   */
  changelog: (skillId, limit) => {
    try {
      const log = versioning.getChangelog(skillId, limit ? parseInt(limit) : null)

      if (log.length === 0) {
        console.log(`No changelog entries for ${skillId}`)
        return
      }

      console.log(`\nChangelog for ${skillId}\n`)

      for (const entry of log) {
        const timestamp = new Date(entry.timestamp).toISOString()
        console.log(`${entry.version} - ${timestamp}`)
        console.log(`  Action: ${entry.action}`)

        if (entry.description) {
          console.log(`  Description: ${entry.description}`)
        }

        if (entry.reason) {
          console.log(`  Reason: ${entry.reason}`)
        }

        console.log()
      }
    } catch (err) {
      console.error(`Error: ${err.message}`)
      process.exit(1)
    }
  },

  /**
   * Create migration guide
   */
  migrate: (skillId, fromVersion, toVersion) => {
    try {
      const guide = versioning.createMigrationGuide(skillId, fromVersion, toVersion)

      // Auto-populate from diff
      const diff = versioning.diff(skillId, fromVersion, toVersion)

      for (const change of diff.changes) {
        if (change.removed && !change.added) {
          guide.addBreakingChange(
            `Line ${change.lineNumber} removed`,
            `Review and update code accordingly`
          )
        }
      }

      versioning.persist(skillId)

      console.log(`✓ Created migration guide: ${skillId}@${fromVersion} → @${toVersion}`)
      console.log(`  File: ${STORAGE_DIR}/${skillId}/migrations.json`)
      console.log(`  Breaking changes detected: ${guide.breakingChanges.length}`)
    } catch (err) {
      console.error(`Error: ${err.message}`)
      process.exit(1)
    }
  },

  /**
   * Build compatibility matrix
   */
  matrix: (skillId) => {
    try {
      const matrix = versioning.getCompatibilityMatrix(skillId)

      console.log(`\nCompatibility Matrix: ${skillId}\n`)

      for (const [version, info] of Object.entries(matrix)) {
        const deprecated = info.deprecated ? ' [DEPRECATED]' : ''
        console.log(`${version}${deprecated}`)
        console.log(`  Compatible with: ${info.compatibleWith.join(', ')}`)

        if (info.migrationGuides.length > 0) {
          console.log(`  Migrations:`)
          for (const mg of info.migrationGuides) {
            console.log(`    - ${mg.fromVersion} → ${mg.toVersion}`)
          }
        }

        console.log()
      }
    } catch (err) {
      console.error(`Error: ${err.message}`)
      process.exit(1)
    }
  },

  /**
   * Help text
   */
  help: () => {
    console.log(`
Skill Versioning CLI

Usage:
  skill-versioning list <skillId>
    List all versions of a skill

  skill-versioning register <skillId> <version> <file>
    Register new version from file

  skill-versioning get <skillId> <version>
    Get version metadata

  skill-versioning latest <skillId>
    Get latest version number

  skill-versioning rollback <skillId> <version>
    Rollback to a previous version

  skill-versioning diff <skillId> <versionA> <versionB>
    Compare two versions

  skill-versioning deprecate <skillId> <version> <reason>
    Deprecate a version

  skill-versioning check-deprecation <skillId> <version>
    Check if version is deprecated

  skill-versioning compatible <skillId> <constraint> <version>
    Check version compatibility

  skill-versioning stats <skillId>
    Get version statistics

  skill-versioning export <skillId> [json|csv]
    Export version history

  skill-versioning changelog <skillId> [limit]
    Show changelog

  skill-versioning migrate <skillId> <fromVersion> <toVersion>
    Create migration guide

  skill-versioning matrix <skillId>
    Build compatibility matrix

Environment Variables:
  SKILL_VERSIONS_DIR   Storage directory (default: ./.claude/skill-versions)
  USER                 Author name for registration

Examples:
  skill-versioning register my-skill 1.0.0 ./src/skill.js
  skill-versioning diff my-skill 1.0.0 1.1.0
  skill-versioning deprecate my-skill 1.0.0 "Use v2 instead"
  skill-versioning stats my-skill
    `)
  }
}

// ============================================================================
// Main CLI Router
// ============================================================================

function main() {
  const args = process.argv.slice(2)

  if (args.length === 0 || args[0] === 'help' || args[0] === '--help') {
    commands.help()
    return
  }

  const command = args[0]

  try {
    switch (command) {
      case 'list':
        if (args.length < 2) throw new Error('Missing skillId')
        commands.list(args[1])
        break

      case 'register':
        if (args.length < 4) throw new Error('Usage: register <skillId> <version> <file>')
        commands.register(args[1], args[2], args[3])
        break

      case 'get':
        if (args.length < 3) throw new Error('Usage: get <skillId> <version>')
        commands.get(args[1], args[2])
        break

      case 'latest':
        if (args.length < 2) throw new Error('Missing skillId')
        commands.latest(args[1])
        break

      case 'rollback':
        if (args.length < 3) throw new Error('Usage: rollback <skillId> <version>')
        commands.rollback(args[1], args[2])
        break

      case 'diff':
        if (args.length < 4) throw new Error('Usage: diff <skillId> <versionA> <versionB>')
        commands.diff(args[1], args[2], args[3])
        break

      case 'deprecate':
        if (args.length < 4) throw new Error('Usage: deprecate <skillId> <version> <reason>')
        commands.deprecate(args[1], args[2], args[3])
        break

      case 'check-deprecation':
        if (args.length < 3) throw new Error('Usage: check-deprecation <skillId> <version>')
        commands.checkDeprecation(args[1], args[2])
        break

      case 'compatible':
        if (args.length < 4) throw new Error('Usage: compatible <skillId> <constraint> <version>')
        commands.compatible(args[1], args[2], args[3])
        break

      case 'stats':
        if (args.length < 2) throw new Error('Missing skillId')
        commands.stats(args[1])
        break

      case 'export':
        if (args.length < 2) throw new Error('Missing skillId')
        commands.export(args[1], args[2] || 'json')
        break

      case 'changelog':
        if (args.length < 2) throw new Error('Missing skillId')
        commands.changelog(args[1], args[2])
        break

      case 'migrate':
        if (args.length < 4) throw new Error('Usage: migrate <skillId> <fromVersion> <toVersion>')
        commands.migrate(args[1], args[2], args[3])
        break

      case 'matrix':
        if (args.length < 2) throw new Error('Missing skillId')
        commands.matrix(args[1])
        break

      default:
        throw new Error(`Unknown command: ${command}`)
    }
  } catch (err) {
    console.error(`Error: ${err.message}`)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = { commands, versioning }
