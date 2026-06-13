#!/usr/bin/env node

/**
 * backfill-dates.js
 * Adds "updated: 2025-06-13" to YAML frontmatter of skill and agent files
 * that don't already have an "updated" field.
 *
 * For files WITH frontmatter: inserts "updated: <date>" before closing ---
 * For files WITHOUT frontmatter: prepends a minimal frontmatter block
 *
 * Safe to re-run (skips files that already have "updated").
 */

const fs = require('fs')
const path = require('path')

const REPO_ROOT = path.resolve(__dirname, '..')
const DEFAULT_DATE = '2026-06-13'
const FORCE = process.argv.includes('--force')
const TRANSLATION_DIRS = new Set(['fr', 'de', 'es', 'nl'])
const DRY_RUN = process.argv.includes('--dry-run')

let updated = 0
let skipped = 0
let addedFrontmatter = 0

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

function processFile(file) {
  const content = fs.readFileSync(file, 'utf8')
  const rel = path.relative(REPO_ROOT, file)

  // Check if file has frontmatter
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)

  if (fmMatch) {
    // Has frontmatter — check if "updated" already present
    if (fmMatch[1].includes('updated:') && !FORCE) {
      skipped++
      return
    }

    // Insert or replace "updated: <date>" in frontmatter
    let newFrontmatter
    if (FORCE && fmMatch[1].includes('updated:')) {
      // Replace existing updated line
      newFrontmatter = fmMatch[0].replace(/updated:\s*\S+/, `updated: ${DEFAULT_DATE}`)
    } else {
      // Insert before closing ---
      newFrontmatter = fmMatch[0].replace(/\n---$/, `\nupdated: ${DEFAULT_DATE}\n---`)
    }
    const newContent = content.replace(fmMatch[0], newFrontmatter)

    if (!DRY_RUN) {
      fs.writeFileSync(file, newContent, 'utf8')
    }
    updated++
    console.log(`  + ${rel}`)
  } else {
    // No frontmatter — add minimal block
    // Extract title from first # heading if present
    const titleMatch = content.match(/^#\s+(.+)$/m)
    const name = path.basename(file, '.md')

    const frontmatter = `---\nname: ${name}\nupdated: ${DEFAULT_DATE}\n---\n\n`
    const newContent = frontmatter + content

    if (!DRY_RUN) {
      fs.writeFileSync(file, newContent, 'utf8')
    }
    addedFrontmatter++
    console.log(`  + ${rel} (added frontmatter)`)
  }
}

console.log(`${DRY_RUN ? '[DRY RUN] ' : ''}Backfilling "updated: ${DEFAULT_DATE}" into skill/agent files...\n`)

walkMarkdown(path.join(REPO_ROOT, 'skills'), processFile)
walkMarkdown(path.join(REPO_ROOT, 'agents'), processFile)

console.log(`\nDone:`)
console.log(`  Updated: ${updated}`)
console.log(`  Added frontmatter: ${addedFrontmatter}`)
console.log(`  Skipped (already has date): ${skipped}`)
if (DRY_RUN) {
  console.log(`\n  (dry run — no files were modified)`)
}
