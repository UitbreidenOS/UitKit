#!/usr/bin/env node

/**
 * Memory System CLI — Command-line interface for memory management
 *
 * Usage:
 * node memory-system-cli.js [command] [options]
 *
 * Commands:
 * - store      Store a new memory
 * - recall     Recall memory by ID
 * - search     Search memories
 * - list       List memories by type, agent, or tags
 * - update     Update a memory
 * - delete     Delete a memory
 * - export     Export memory snapshot
 * - import     Import memory snapshot
 * - stats      Show memory statistics
 * - cleanup    Clean up expired memories
 * - clear      Clear all memories
 */

const { MemorySystem, MEMORY_TYPES, ACCESS_LEVELS, RETENTION_POLICIES } = require('./memory-system')
const fs = require('fs')
const path = require('path')
const readline = require('readline')

/**
 * Parse command-line arguments
 */
function parseArgs(args) {
  const result = {
    command: args[0] || 'help',
    options: {}
  }

  for (let i = 1; i < args.length; i++) {
    const arg = args[i]

    if (arg.startsWith('--')) {
      const [key, ...valueParts] = arg.substring(2).split('=')
      const value = valueParts.length > 0 ? valueParts.join('=') : args[++i]
      result.options[key] = value
    } else if (arg.startsWith('-')) {
      result.options[arg.substring(1)] = args[++i]
    }
  }

  return result
}

/**
 * Initialize memory system
 */
function initMemory(options = {}) {
  const agentId = options.agent || process.env.MEMORY_AGENT_ID || 'cli-agent'
  const encryptionKey = options.key || process.env.MEMORY_ENCRYPTION_KEY

  return new MemorySystem({
    agentId,
    encryptionKey,
    enableEncryption: !!encryptionKey,
    verbose: options.verbose || false
  })
}

/**
 * CLI Commands
 */
const commands = {
  /**
   * Store a new memory
   */
  store(memory, options) {
    if (!options.content) {
      console.error('Error: --content is required')
      return
    }

    try {
      let content = options.content
      try {
        content = JSON.parse(content)
      } catch (e) {
        // Keep as string if not JSON
      }

      const result = memory.storeMemory({
        type: options.type || MEMORY_TYPES.CONTEXT,
        content,
        description: options.description || '',
        tags: (options.tags || '').split(',').filter(Boolean),
        agentId: options.agent || undefined,
        accessLevel: options.access || ACCESS_LEVELS.PRIVATE,
        retentionDays: parseInt(options.retention) || RETENTION_POLICIES.MEDIUM_TERM,
        baseRelevance: parseFloat(options.relevance) || 1.0,
        metadata: options.metadata ? JSON.parse(options.metadata) : {}
      })

      console.log(JSON.stringify(result, null, 2))
    } catch (error) {
      console.error(`Error: ${error.message}`)
    }
  },

  /**
   * Recall memory by ID
   */
  recall(memory, options) {
    if (!options.id) {
      console.error('Error: --id is required')
      return
    }

    const result = memory.recallById(options.id)

    if (result) {
      console.log(JSON.stringify(result, null, 2))
    } else {
      console.log('Memory not found')
    }
  },

  /**
   * Search memories
   */
  search(memory, options) {
    if (!options.pattern) {
      console.error('Error: --pattern is required')
      return
    }

    const results = memory.searchByPattern(options.pattern, {
      matchType: options.match || 'fuzzy',
      type: options.type || null,
      tags: (options.tags || '').split(',').filter(Boolean),
      agentId: options.agent || null,
      minRelevance: parseFloat(options.relevance) || 0.3,
      limit: parseInt(options.limit) || 10
    })

    console.log(`Found ${results.length} memories:\n`)
    results.forEach((result, index) => {
      console.log(`${index + 1}. ID: ${result.id}`)
      console.log(`   Type: ${result.entry.type}`)
      console.log(`   Relevance: ${result.relevance.toFixed(3)}`)
      console.log(`   Description: ${result.entry.description}`)
      console.log(`   Content: ${JSON.stringify(result.entry.content).substring(0, 100)}...`)
      console.log()
    })
  },

  /**
   * List memories
   */
  list(memory, options) {
    let results = []

    if (options.type) {
      results = memory.getByType(options.type, {
        limit: parseInt(options.limit) || 50
      })
    } else if (options.agent) {
      results = memory.getByAgent(options.agent, {
        limit: parseInt(options.limit) || 50
      })
    } else if (options.tags) {
      const tags = options.tags.split(',')
      results = memory.getByTags(tags, {
        limit: parseInt(options.limit) || 50
      })
    } else {
      // List all
      const allIds = Array.from(memory.memory.keys())
      results = allIds.slice(0, parseInt(options.limit) || 50).map(id => ({
        id,
        relevance: 1.0,
        entry: memory.memory.get(id)
      }))
    }

    console.log(`Found ${results.length} memories:\n`)
    results.forEach((result, index) => {
      console.log(`${index + 1}. [${result.entry.type}] ${result.entry.description}`)
      console.log(`   ID: ${result.id}`)
      console.log(`   Created: ${result.entry.createdAt}`)
      console.log(`   Relevance: ${result.relevance.toFixed(3)}`)
      console.log(`   Tags: ${result.entry.tags.join(', ')}`)
      console.log()
    })
  },

  /**
   * Update memory
   */
  update(memory, options) {
    if (!options.id) {
      console.error('Error: --id is required')
      return
    }

    try {
      const updates = {}

      if (options.content) {
        try {
          updates.content = JSON.parse(options.content)
        } catch (e) {
          updates.content = options.content
        }
      }

      if (options.tags) {
        updates.tags = options.tags.split(',').filter(Boolean)
      }

      if (options.relevance) {
        updates.relevanceScore = parseFloat(options.relevance)
      }

      const result = memory.updateMemory(options.id, updates)
      console.log(JSON.stringify(result, null, 2))
    } catch (error) {
      console.error(`Error: ${error.message}`)
    }
  },

  /**
   * Delete memory
   */
  delete(memory, options) {
    if (!options.id) {
      console.error('Error: --id is required')
      return
    }

    try {
      memory.deleteMemory(options.id)
      console.log(`Deleted memory: ${options.id}`)
    } catch (error) {
      console.error(`Error: ${error.message}`)
    }
  },

  /**
   * Export memory snapshot
   */
  export(memory, options) {
    try {
      const snapshot = memory.exportSnapshot({
        metadata: options.metadata ? JSON.parse(options.metadata) : {}
      })

      const output = options.output || 'memory-export.json'
      fs.writeFileSync(output, JSON.stringify(snapshot, null, 2))
      console.log(`Exported ${snapshot.memories.length} memories to ${output}`)
    } catch (error) {
      console.error(`Error: ${error.message}`)
    }
  },

  /**
   * Import memory snapshot
   */
  import(memory, options) {
    if (!options.input) {
      console.error('Error: --input is required')
      return
    }

    try {
      const data = fs.readFileSync(options.input, 'utf8')
      const snapshot = JSON.parse(data)

      const count = memory.importSnapshot(snapshot)
      console.log(`Imported ${count} memories from ${options.input}`)
    } catch (error) {
      console.error(`Error: ${error.message}`)
    }
  },

  /**
   * Show statistics
   */
  stats(memory, options) {
    const stats = memory.getStats()

    console.log('=== Memory Statistics ===\n')
    console.log(`Memory Count: ${stats.memoryCount}`)
    console.log(`Total Stored: ${stats.totalStored}`)
    console.log(`Total Recalled: ${stats.totalRecalled}`)
    console.log(`Total Expired: ${stats.totalExpired}`)
    console.log(`Cache Hit Rate: ${(stats.hitRate * 100).toFixed(2)}%`)
    console.log(`Avg Relevance Score: ${stats.avgRelevanceScore.toFixed(3)}\n`)

    console.log('Type Distribution:')
    Object.entries(stats.typeDistribution).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`)
    })

    console.log('\nAgent Distribution:')
    Object.entries(stats.agentDistribution).forEach(([agent, count]) => {
      console.log(`  ${agent}: ${count}`)
    })
  },

  /**
   * Clean up expired memories
   */
  cleanup(memory, options) {
    const expiredIds = memory.cleanupExpired()
    console.log(`Cleaned up ${expiredIds.length} expired memories`)

    if (options.verbose) {
      expiredIds.forEach(id => console.log(`  - ${id}`))
    }
  },

  /**
   * Clear all memories
   */
  clear(memory, options) {
    if (options.force !== 'true' && options.force !== true) {
      console.error('Error: use --force=true to confirm deletion of all memories')
      return
    }

    const ids = Array.from(memory.memory.keys())
    ids.forEach(id => {
      try {
        memory.deleteMemory(id)
      } catch (e) {
        // Continue even if delete fails
      }
    })

    console.log(`Cleared ${ids.length} memories`)
  },

  /**
   * Show help
   */
  help() {
    console.log(`
Memory System CLI

Usage: memory-system-cli [command] [options]

Commands:
  store       Store a new memory
  recall      Recall memory by ID
  search      Search memories by pattern
  list        List memories (by type, agent, or tags)
  update      Update a memory
  delete      Delete a memory
  export      Export memory snapshot
  import      Import memory snapshot
  stats       Show memory statistics
  cleanup     Clean up expired memories
  clear       Clear all memories
  help        Show this help message

Global Options:
  --agent          Agent ID (default: cli-agent)
  --key            Encryption key
  --verbose        Verbose output

Store Options:
  --content        Memory content (JSON or string, required)
  --type           Memory type (pattern|preference|decision|strategy|mistake|context|relationship)
  --description    Description
  --tags           Comma-separated tags
  --access         Access level (private|team|trusted|public)
  --retention      Retention days (or use PERMANENT, LONG_TERM, MEDIUM_TERM, SHORT_TERM, EPHEMERAL)
  --relevance      Base relevance score (0-1)
  --metadata       Metadata as JSON

Recall Options:
  --id             Memory ID (required)

Search Options:
  --pattern        Search pattern (required)
  --match          Match type (exact|fuzzy|regex, default: fuzzy)
  --type           Filter by memory type
  --tags           Comma-separated tags to filter
  --agent          Filter by agent ID
  --relevance      Minimum relevance score
  --limit          Result limit (default: 10)

List Options:
  --type           Filter by type
  --agent          Filter by agent
  --tags           Comma-separated tags
  --limit          Result limit (default: 50)

Update Options:
  --id             Memory ID (required)
  --content        New content
  --tags           New tags (comma-separated)
  --relevance      New relevance score

Delete Options:
  --id             Memory ID (required)

Export Options:
  --output         Output file path (default: memory-export.json)
  --metadata       Export metadata as JSON

Import Options:
  --input          Input file path (required)

Examples:
  # Store a pattern
  node memory-system-cli.js store \\
    --type pattern \\
    --content '{"rule": "always validate input"}' \\
    --tags learning,security

  # Search memories
  node memory-system-cli.js search \\
    --pattern "error handling" \\
    --type decision \\
    --limit 20

  # List all patterns
  node memory-system-cli.js list --type pattern

  # Export all memories
  node memory-system-cli.js export --output backup.json

  # Show statistics
  node memory-system-cli.js stats

  # Clean up expired
  node memory-system-cli.js cleanup --verbose
    `)
  }
}

/**
 * Main CLI handler
 */
function main() {
  const args = process.argv.slice(2)
  const { command, options } = parseArgs(args)

  if (!commands[command]) {
    console.error(`Unknown command: ${command}`)
    console.log('Run with --help or no arguments to see available commands')
    process.exit(1)
  }

  const memory = initMemory(options)

  try {
    commands[command](memory, options)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

// Run if executed directly
if (require.main === module) {
  main()
}

module.exports = { commands, parseArgs, initMemory }
