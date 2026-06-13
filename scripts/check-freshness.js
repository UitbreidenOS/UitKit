#!/usr/bin/env node

/**
 * check-freshness.js
 * Scans skill and agent files for an "updated" date in YAML frontmatter.
 * Flags files older than STALE_MONTHS as stale.
 *
 * Exit 0 = all fresh, Exit 1 = stale files found (or missing dates).
 * Use --warn-only to always exit 0 (for CI warn-only mode).
 */

const fs = require('fs')
const path = require('path')

const REPO_ROOT = path.resolve(__dirname, '..')
const STALE_MONTHS = 6
const TRANSLATION_DIRS = new Set(['fr', 'de', 'es', 'nl'])
const WARN_ONLY = process.argv.includes('--warn-only')

function walkMarkdown(dir, callback) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory() && !TRANSLATION_DIRS.has(entry.name)) {
      walkMarkdown(full, callback)
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      callback(full)
    }
  }
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return null
  const fm = {}
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w+):\s*(.+)/)
    if (m) fm[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
  return fm
}

const fresh = []
const stale = []
const missing = []

const cutoff = new Date()
cutoff.setMonth(cutoff.getMonth() - STALE_MONTHS)

function check(dir) {
  walkMarkdown(path.join(REPO_ROOT, dir), (file) => {
    const content = fs.readFileSync(file, 'utf8')
    const fm = parseFrontmatter(content)
    const rel = path.relative(REPO_ROOT, file)

    if (!fm || !fm.updated) {
      missing.push(rel)
      return
    }

    const updated = new Date(fm.updated)
    if (isNaN(updated.getTime())) {
      missing.push(rel + ' (invalid date)')
      return
    }

    if (updated < cutoff) {
      stale.push({ file: rel, updated: fm.updated })
    } else {
      fresh.push(rel)
    }
  })
}

check('skills')
check('agents')

const total = fresh.length + stale.length + missing.length
console.log(`Freshness check: ${total} files scanned (stale threshold: ${STALE_MONTHS} months)\n`)
console.log(`  Fresh:  ${fresh.length}`)
console.log(`  Stale:  ${stale.length}`)
console.log(`  No date: ${missing.length}`)

if (stale.length > 0) {
  console.log(`\nStale files (updated before ${cutoff.toISOString().slice(0, 10)}):`)
  for (const { file, updated } of stale) {
    console.log(`  ${file} (last updated: ${updated})`)
  }
}

if (missing.length > 0) {
  console.log(`\nFiles missing "updated" field (first 20):`)
  for (const file of missing.slice(0, 20)) {
    console.log(`  ${file}`)
  }
  if (missing.length > 20) {
    console.log(`  ... and ${missing.length - 20} more`)
  }
}

const hasIssues = stale.length > 0 || missing.length > 0
if (hasIssues && !WARN_ONLY) {
  process.exit(1)
}
