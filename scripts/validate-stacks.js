#!/usr/bin/env node

/**
 * validate-stacks.js
 * Validates that each workspace stack directory has the expected structure.
 *
 * Required: CLAUDE.md, skills/ (with at least 1 .md file)
 * Recommended: commands/, hooks/, mcp/, README.md, session-log.md
 *
 * Exits 0 if all stacks are complete, 1 if any are incomplete.
 * Use --warn-only to always exit 0 (for CI warn-only mode).
 */

const fs = require('fs')
const path = require('path')

const REPO_ROOT = path.resolve(__dirname, '..')
const WARN_ONLY = process.argv.includes('--warn-only')

const REQUIRED_FILES = ['CLAUDE.md']
const REQUIRED_DIRS = ['skills']
const RECOMMENDED_FILES = ['README.md', 'session-log.md']
const RECOMMENDED_DIRS = ['commands', 'hooks', 'mcp']

function countMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return 0
  let count = 0
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      count += countMarkdownFiles(path.join(dir, entry.name))
    } else if (entry.name.endsWith('.md')) {
      count++
    }
  }
  return count
}

const stacks = []
const issues = []

// Find all *_stack/ directories
const stacksParentDir = path.join(REPO_ROOT, 'professional-stacks')
for (const entry of fs.readdirSync(stacksParentDir, { withFileTypes: true })) {
  if (!entry.isDirectory() || !entry.name.endsWith('_stack')) continue

  const stackDir = path.join(stacksParentDir, entry.name)
  const stack = {
    name: entry.name,
    complete: true,
    score: 0,
    maxScore: 0,
    details: [],
  }

  // Check required files
  for (const file of REQUIRED_FILES) {
    stack.maxScore += 2
    const exists = fs.existsSync(path.join(stackDir, file))
    if (exists) {
      stack.score += 2
    } else {
      stack.complete = false
      stack.details.push(`MISSING required: ${file}`)
      issues.push(`${entry.name}: missing required ${file}`)
    }
  }

  // Check required directories
  for (const dir of REQUIRED_DIRS) {
    stack.maxScore += 2
    const dirPath = path.join(stackDir, dir)
    const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()
    if (exists) {
      const count = countMarkdownFiles(dirPath)
      if (count > 0) {
        stack.score += 2
        stack.details.push(`  ${dir}/: ${count} files`)
      } else {
        stack.complete = false
        stack.details.push(`  ${dir}/: EMPTY (no .md files)`)
        issues.push(`${entry.name}: ${dir}/ has no markdown files`)
      }
    } else {
      stack.complete = false
      stack.details.push(`MISSING required: ${dir}/`)
      issues.push(`${entry.name}: missing required ${dir}/`)
    }
  }

  // Check recommended files
  for (const file of RECOMMENDED_FILES) {
    stack.maxScore += 1
    const exists = fs.existsSync(path.join(stackDir, file))
    if (exists) {
      stack.score += 1
    } else {
      stack.details.push(`  missing recommended: ${file}`)
    }
  }

  // Check recommended directories
  for (const dir of RECOMMENDED_DIRS) {
    stack.maxScore += 1
    const dirPath = path.join(stackDir, dir)
    const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()
    if (exists) {
      const count = countMarkdownFiles(dirPath)
      stack.score += count > 0 ? 1 : 0
      stack.details.push(`  ${dir}/: ${count} files${count === 0 ? ' (empty)' : ''}`)
    } else {
      stack.details.push(`  missing recommended: ${dir}/`)
    }
  }

  stacks.push(stack)
}

// Sort by completeness then score
stacks.sort((a, b) => {
  if (a.complete !== b.complete) return a.complete ? -1 : 1
  return (b.score / b.maxScore) - (a.score / a.maxScore)
})

// Output
console.log(`Workspace Stack Validation: ${stacks.length} stacks found\n`)

const complete = stacks.filter(s => s.complete).length
const incomplete = stacks.length - complete

console.log(`  Complete:   ${complete}/${stacks.length}`)
console.log(`  Incomplete: ${incomplete}/${stacks.length}\n`)

if (incomplete > 0) {
  console.log('Incomplete stacks:\n')
  for (const stack of stacks.filter(s => !s.complete)) {
    const pct = Math.round((stack.score / stack.maxScore) * 100)
    console.log(`  ${stack.name} (${pct}%)`)
    for (const detail of stack.details) {
      console.log(`    ${detail}`)
    }
    console.log()
  }
}

// Summary table
console.log('Full summary:\n')
for (const stack of stacks) {
  const pct = Math.round((stack.score / stack.maxScore) * 100)
  const status = stack.complete ? 'OK' : '!!'
  console.log(`  [${status}] ${stack.name.padEnd(35)} ${pct}%`)
}

if (issues.length > 0 && !WARN_ONLY) {
  process.exit(1)
}
