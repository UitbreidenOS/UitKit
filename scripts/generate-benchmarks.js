#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const REPO_ROOT = path.resolve(__dirname, '..')
const BENCHMARKS_FILE = path.join(REPO_ROOT, 'benchmarks', 'results.json')
const INDEX_FILE = path.join(REPO_ROOT, 'index.json')
const SUMMARY_FILE = path.join(REPO_ROOT, 'benchmarks', 'SUMMARY.md')

function calculateStats(results) {
  if (results.length === 0) return { avgScore: 0, topGrade: 'N/A', coverage: '0%' }

  const avgScore = (results.reduce((sum, r) => sum + r.score, 0) / results.length * 100).toFixed(1)
  const gradeDistribution = {
    A: results.filter(r => r.grade === 'A').length,
    B: results.filter(r => r.grade === 'B').length,
    C: results.filter(r => r.grade === 'C').length,
    F: results.filter(r => r.grade === 'F').length,
  }

  return { avgScore, gradeDistribution, coverage: `${results.length} benchmarked` }
}

function main() {
  console.log('📊 Generating Skill Benchmarks Report...\n')

  // Load benchmarks
  if (!fs.existsSync(BENCHMARKS_FILE)) {
    console.error(`Error: ${BENCHMARKS_FILE} not found`)
    process.exit(1)
  }

  const benchmarksData = JSON.parse(fs.readFileSync(BENCHMARKS_FILE, 'utf8'))
  const results = benchmarksData.results || []

  // Load index to compare coverage
  let allSkillIds = []
  if (fs.existsSync(INDEX_FILE)) {
    const indexData = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'))
    allSkillIds = (indexData.skills || []).map(s => s.id)
  }

  const benchmarkedIds = new Set(results.map(r => r.id))
  const unbenchmarkedIds = allSkillIds.filter(id => !benchmarkedIds.has(id))

  // Calculate stats
  const stats = calculateStats(results)
  const coverage = ((results.length / allSkillIds.length) * 100).toFixed(1)

  // Print report
  console.log(`✅ Benchmarks Loaded: ${results.length} skills evaluated`)
  console.log(`📈 Average Score: ${stats.avgScore}%`)
  console.log(`📊 Grade Distribution:`)
  console.log(`   A: ${stats.gradeDistribution.A} skills (${(stats.gradeDistribution.A / results.length * 100).toFixed(0)}%)`)
  console.log(`   B: ${stats.gradeDistribution.B} skills (${(stats.gradeDistribution.B / results.length * 100).toFixed(0)}%)`)
  console.log(`   C: ${stats.gradeDistribution.C} skills (${(stats.gradeDistribution.C / results.length * 100).toFixed(0)}%)`)
  console.log(`   F: ${stats.gradeDistribution.F} skills (${(stats.gradeDistribution.F / results.length * 100).toFixed(0)}%)`)
  console.log(`\n📚 Coverage: ${results.length}/${allSkillIds.length} skills (${coverage}%)`)

  // Freshness check
  const now = Date.now()
  const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000
  const staleResults = results.filter(r => {
    const testedDate = new Date(r.last_tested).getTime()
    return now - testedDate > ninetyDaysMs
  })

  if (staleResults.length > 0) {
    console.log(`\n⚠️  Stale Benchmarks (>90 days old): ${staleResults.length}`)
    staleResults.forEach(r => {
      console.log(`   - ${r.id} (tested ${r.last_tested})`)
    })
  } else {
    console.log(`\n✅ All benchmarks are fresh (<90 days)`)
  }

  // Top performers
  const topPerformers = results
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  console.log(`\n🏆 Top 5 Performers:`)
  topPerformers.forEach((r, i) => {
    console.log(`   ${i + 1}. ${r.title} — ${(r.score * 100).toFixed(0)}% (${r.grade})`)
  })

  // Generate markdown summary
  const markdown = `# Skill Benchmarks Summary

**Generated:** ${new Date().toISOString()}

## Overview

- **Total Benchmarked:** ${results.length} skills
- **Coverage:** ${coverage}% (${results.length}/${allSkillIds.length})
- **Average Score:** ${stats.avgScore}%
- **Methodology:** Each skill tested against 10 real-world prompts

## Grade Distribution

| Grade | Count | Percentage |
|-------|-------|------------|
| A | ${stats.gradeDistribution.A} | ${(stats.gradeDistribution.A / results.length * 100).toFixed(1)}% |
| B | ${stats.gradeDistribution.B} | ${(stats.gradeDistribution.B / results.length * 100).toFixed(1)}% |
| C | ${stats.gradeDistribution.C} | ${(stats.gradeDistribution.C / results.length * 100).toFixed(1)}% |
| F | ${stats.gradeDistribution.F} | ${(stats.gradeDistribution.F / results.length * 100).toFixed(1)}% |

## Top 10 Performers

${results
  .sort((a, b) => b.score - a.score)
  .slice(0, 10)
  .map((r, i) => `${i + 1}. **${r.title}** (${r.category}) — ${(r.score * 100).toFixed(0)}% | Grade: ${r.grade}`)
  .join('\n')}

## Freshness

${staleResults.length > 0
  ? `⚠️ ${staleResults.length} benchmarks older than 90 days`
  : '✅ All benchmarks are fresh'
}

## Next Steps

- Run: \`npm run benchmark\` to regenerate this report
- View benchmarks at: \`npx claudient benchmark\` or visit the 📊 Skill Evals window in the site

---
Last updated: ${new Date().toISOString()}
`

  // Write summary
  fs.mkdirSync(path.dirname(SUMMARY_FILE), { recursive: true })
  fs.writeFileSync(SUMMARY_FILE, markdown)
  console.log(`\n📄 Summary written to: benchmarks/SUMMARY.md`)
}

main()
