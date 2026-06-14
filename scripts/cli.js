#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execSync } = require('child_process')
const { recommend } = require('./recommend')

const REPO_ROOT = path.resolve(__dirname, '..')
const CLAUDE_DIR = path.join(os.homedir(), '.claude')
const SKILLS_DEST = path.join(CLAUDE_DIR, 'skills')
const AGENTS_DEST = path.join(CLAUDE_DIR, 'agents')
const HOOKS_DEST = path.join(CLAUDE_DIR, 'hooks')
const RULES_DEST = path.join(CLAUDE_DIR, 'rules')
const STRUCTURES_SRC = path.join(REPO_ROOT, 'structures')

const SKILL_CATEGORIES = [
  'ai-engineering',
  'automation',
  'backend',
  'computer-use',
  'data-ml',
  'database',
  'devops-infra',
  'finance',
  'finance-payments',
  'git',
  'gtm',
  'legal',
  'marketing',
  'product',
  'productivity',
  'sdr',
  'small-business',
]

const SUPPORTED_LANGS = ['en', 'fr', 'de', 'nl', 'es']

function usage() {
  console.log(`
claudient — Claude Code knowledge system

Usage:
  npx claudient init                          Interactive first-run setup
  npx claudient search <query>               Search skills, agents, structures
  npx claudient add skills [category] [--lang <lang>]
  npx claudient add agents
  npx claudient add rules [--write]
  npx claudient add hooks
  npx claudient add structure <name>         Copy a project structure to current dir
  npx claudient add all [--lang <lang>]
  npx claudient scaffold <name>              Print scaffold commands for a structure
  npx claudient remove skills [category]
  npx claudient remove agents
  npx claudient remove rules
  npx claudient update
  npx claudient scan                          Scan project and recommend skills/hooks/MCP
  npx claudient list [skills|agents|rules|hooks|structures]
  npx claudient help

Skill categories:
  ${SKILL_CATEGORIES.join('\n  ')}

Languages (--lang):
  en (default), fr, de, nl, es

Structure names (82 available):
  Professional workspaces: sdr-workspace, product-manager-workspace, devops-sre-workspace, founder-workspace ...
  Project templates: saas-web-app, rest-api-service, ai-agent-app, data-pipeline, monorepo ...
  AI/GTM workspaces: autonomous-saas-core, llm-guardrail-proxy, hitl-agentic-workflow, devsecops-workspace ...
  Run: npx claudient list structures

SDR skill category:
  npx claudient add skills sdr
  Includes: icp-scoring, buying-signals, cold-email-sequence, messaging-frameworks,
            qualification-meddpicc, reply-classification, objection-handling, and 11 more

Examples:
  npx claudient add structure saas-web-app
  npx claudient add structure sdr-workspace
  npx claudient scaffold saas-web-app
  npx claudient add skills
  npx claudient add skills backend --lang fr
  npx claudient add agents
  npx claudient add all --lang de
  npx claudient list structures
  npx claudient search data pipeline
`)
}

function checkClaudeInstalled() {
  if (!fs.existsSync(CLAUDE_DIR)) {
    console.error(`
Error: ~/.claude directory not found.

Claude Code must be installed first:
  https://claude.ai/code
`)
    process.exit(1)
  }
}

function parseArgs(args) {
  const flags = {}
  const positional = []
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--lang' && args[i + 1]) {
      flags.lang = args[++i]
    } else if (!args[i].startsWith('--')) {
      positional.push(args[i])
    }
  }
  return { flags, positional }
}

function copyDir(src, dest, label = '') {
  if (!fs.existsSync(src)) return 0
  fs.mkdirSync(dest, { recursive: true })
  let count = 0
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      count += copyDir(srcPath, destPath, label + entry.name + '/')
    } else if (entry.name.endsWith('.md')) {
      fs.copyFileSync(srcPath, destPath)
      console.log(`  + ${label}${entry.name}`)
      count++
    }
  }
  return count
}

function removeDir(dir, label) {
  if (!fs.existsSync(dir)) {
    console.log(`  ~ ${label} (not installed)`)
    return 0
  }
  fs.rmSync(dir, { recursive: true, force: true })
  console.log(`  - ${label} (removed)`)
  return 1
}

function addSkills(category, lang) {
  checkClaudeInstalled()
  fs.mkdirSync(SKILLS_DEST, { recursive: true })

  const installCategory = (cat) => {
    const src = path.join(REPO_ROOT, 'skills', cat)
    if (!fs.existsSync(src)) return 0

    if (!lang || lang === 'en') {
      const dest = path.join(SKILLS_DEST, cat)
      const count = copyDir(src, dest, cat + '/')
      if (count > 0) console.log(`  ✓ ${cat} (${count} files)`)
      return count
    }

    // Language-aware: copy only matching lang files, renaming to drop the lang subdir
    let count = 0
    count += copyLangFiles(src, path.join(SKILLS_DEST, cat), lang, cat + '/')
    if (count > 0) console.log(`  ✓ ${cat} [${lang}] (${count} files)`)
    return count
  }

  if (!category || category === 'all') {
    console.log(`Installing all skills${lang && lang !== 'en' ? ` [${lang}]` : ''}...\n`)
    for (const cat of SKILL_CATEGORIES) installCategory(cat)
  } else {
    if (!SKILL_CATEGORIES.includes(category)) {
      console.error(`Unknown category: "${category}". Valid: ${SKILL_CATEGORIES.join(', ')}`)
      process.exit(1)
    }
    console.log(`Installing ${category} skills${lang && lang !== 'en' ? ` [${lang}]` : ''}...\n`)
    installCategory(category)
  }

  console.log(`\nDone. Skills installed to: ${SKILLS_DEST}`)
  console.log('Restart Claude Code to activate.')
}

// Copies lang-specific files: for each file.md, checks if lang/file.md exists
// and copies it (as file.md) alongside the English version.
function copyLangFiles(src, dest, lang, prefix) {
  if (!fs.existsSync(src)) return 0
  fs.mkdirSync(dest, { recursive: true })
  let count = 0

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === lang) continue // skip the lang subdir itself
      if (SUPPORTED_LANGS.includes(entry.name)) continue // skip other lang subdirs
      count += copyLangFiles(srcPath, path.join(dest, entry.name), lang, prefix + entry.name + '/')
    } else if (entry.name.endsWith('.md')) {
      // Check for translated version
      const translated = path.join(src, lang, entry.name)
      const fileSrc = fs.existsSync(translated) ? translated : srcPath
      fs.copyFileSync(fileSrc, path.join(dest, entry.name))
      const tag = fs.existsSync(translated) ? `[${lang}]` : '[en]'
      console.log(`  + ${prefix}${entry.name} ${tag}`)
      count++
    }
  }
  return count
}

function addAgents() {
  checkClaudeInstalled()
  fs.mkdirSync(AGENTS_DEST, { recursive: true })
  console.log(`Installing agents to ${AGENTS_DEST}...\n`)
  const src = path.join(REPO_ROOT, 'agents')
  let total = 0
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    if (SUPPORTED_LANGS.includes(entry.name)) continue
    const count = copyDir(path.join(src, entry.name), path.join(AGENTS_DEST, entry.name), entry.name + '/')
    if (count > 0) console.log(`  ✓ ${entry.name} (${count} agents)`)
    total += count
  }
  console.log(`\nInstalled ${total} agent file(s) to: ${AGENTS_DEST}`)
  console.log('Restart Claude Code to activate.')
}

function addRules() {
  checkClaudeInstalled()
  const rulesDir = path.join(REPO_ROOT, 'rules')
  console.log('\nAvailable rules:\n')

  // Print all rules with their content paths
  let i = 1
  const rulePaths = []
  for (const cat of fs.readdirSync(rulesDir, { withFileTypes: true })) {
    if (!cat.isDirectory() || SUPPORTED_LANGS.includes(cat.name)) continue
    const catDir = path.join(rulesDir, cat.name)
    for (const f of fs.readdirSync(catDir, { withFileTypes: true })) {
      if (!f.isFile() || !f.name.endsWith('.md')) continue
      if (SUPPORTED_LANGS.some(l => f.name.startsWith(l + '/'))) continue
      const filepath = path.join(catDir, f.name)
      const relPath = `rules/${cat.name}/${f.name}`
      rulePaths.push({ label: relPath, filepath })
      console.log(`  ${i++}. ${relPath}`)
    }
  }

  console.log(`
Rules are added to your project's CLAUDE.md file.
Copy the rule content you need into your project's CLAUDE.md.

Rule files are located in:
  ${rulesDir}

Quick copy all rules into a new CLAUDE.md:`)
  console.log(`  npx claudient add rules --write`)
}

function addRulesWrite() {
  checkClaudeInstalled()
  const rulesDir = path.join(REPO_ROOT, 'rules')
  const claudeMd = path.join(process.cwd(), 'CLAUDE.md')
  const exists = fs.existsSync(claudeMd)

  let content = exists ? fs.readFileSync(claudeMd, 'utf-8') : '# Project Rules\n\n'
  content += '\n\n---\n<!-- Claudient Rules -->\n\n'

  for (const cat of fs.readdirSync(rulesDir, { withFileTypes: true })) {
    if (!cat.isDirectory() || SUPPORTED_LANGS.includes(cat.name)) continue
    const catDir = path.join(rulesDir, cat.name)
    for (const f of fs.readdirSync(catDir).filter(n => n.endsWith('.md'))) {
      const ruleContent = fs.readFileSync(path.join(catDir, f), 'utf-8')
      content += ruleContent + '\n\n'
      console.log(`  + rules/${cat.name}/${f}`)
    }
  }

  fs.writeFileSync(claudeMd, content)
  console.log(`\n${exists ? 'Updated' : 'Created'} CLAUDE.md with all rules.`)
}

function addHooks() {
  checkClaudeInstalled()
  fs.mkdirSync(HOOKS_DEST, { recursive: true })
  const hooksDir = path.join(REPO_ROOT, 'hooks')
  console.log(`Installing hooks to ${HOOKS_DEST}...\n`)
  let total = 0

  for (const cat of fs.readdirSync(hooksDir, { withFileTypes: true })) {
    if (!cat.isDirectory()) continue
    const catDir = path.join(hooksDir, cat.name)
    const destCatDir = path.join(HOOKS_DEST, cat.name)
    fs.mkdirSync(destCatDir, { recursive: true })

    for (const f of fs.readdirSync(catDir, { withFileTypes: true })) {
      if (!f.isFile() || !f.name.endsWith('.sh')) continue
      fs.copyFileSync(path.join(catDir, f.name), path.join(destCatDir, f.name))
      fs.chmodSync(path.join(destCatDir, f.name), '755')
      console.log(`  + ${cat.name}/${f.name}`)
      total++
    }
  }

  console.log(`
Installed ${total} hook script(s) to: ${HOOKS_DEST}

Next step — add hooks to your settings.json:
  ~/.claude/settings.json  (global)
  .claude/settings.json    (project)

See hook documentation at:
  ${path.join(REPO_ROOT, 'hooks')}

Or browse online: https://github.com/Claudient/Claudient/tree/main/hooks
`)
}

function listStructures() {
  const index = loadIndex()
  const BOLD = '\x1b[1m'
  const ORANGE = '\x1b[33m'
  const DIM = '\x1b[2m'
  const RESET = '\x1b[0m'

  if (index && index.structures && index.structures.length) {
    const workspaces = index.structures.filter(s => s.type === 'workspace')
    const templates = index.structures.filter(s => s.type === 'template')

    console.log(`\n${BOLD}Project Structures (${index.structures.length} total)${RESET}\n`)

    console.log(`${BOLD}Professional Workspaces (${workspaces.length})${RESET}`)
    console.log(`${DIM}Claude Code workspace setups for each professional role${RESET}\n`)
    for (const s of workspaces) {
      console.log(`  ${ORANGE}${s.id}${RESET}`)
      if (s.tagline) console.log(`  ${DIM}${s.tagline.slice(0, 90)}${RESET}`)
      console.log()
    }

    console.log(`${BOLD}Project Templates (${templates.length})${RESET}`)
    console.log(`${DIM}Technical and business project scaffolds${RESET}\n`)
    for (const s of templates) {
      console.log(`  ${ORANGE}${s.id}${RESET}`)
      if (s.tagline) console.log(`  ${DIM}${s.tagline.slice(0, 90)}${RESET}`)
      console.log()
    }

    console.log(`Install a structure:  npx claudient add structure <name>`)
    console.log(`Scaffold directories: npx claudient scaffold <name>`)
    return
  }

  // Fallback: filesystem scan
  if (!fs.existsSync(STRUCTURES_SRC)) {
    console.log('No structures found. Update claudient: npx claudient update')
    return
  }
  const files = fs.readdirSync(STRUCTURES_SRC).filter(f => f.endsWith('.md') && f !== 'README.md')
  console.log(`\nProject Structures (${files.length}):\n`)
  for (const f of files) console.log(`  ${f.replace('.md', '')}`)
  console.log(`\nInstall: npx claudient add structure <name>`)
}

function addStructure(name) {
  const BOLD = '\x1b[1m'
  const GREEN = '\x1b[32m'
  const ORANGE = '\x1b[33m'
  const DIM = '\x1b[2m'
  const RESET = '\x1b[0m'

  if (!name) {
    console.log('Usage: npx claudient add structure <name>')
    console.log('       npx claudient list structures\n')
    listStructures()
    return
  }

  const srcFile = path.join(STRUCTURES_SRC, `${name}.md`)
  if (!fs.existsSync(srcFile)) {
    console.error(`\n${ORANGE}Structure not found: "${name}"${RESET}`)
    console.error('Run: npx claudient list structures\n')
    process.exit(1)
  }

  const destFile = path.join(process.cwd(), `${name}-structure.md`)
  fs.copyFileSync(srcFile, destFile)

  const content = fs.readFileSync(srcFile, 'utf-8')
  const tagline = (content.match(/^>\s*(.+)$/m) || [])[1] || ''
  const skillsMatch = content.match(/```bash\n([\s\S]*?npx claudient[\s\S]*?)```/)
  const skills = skillsMatch ? skillsMatch[1].trim() : null

  console.log(`\n${GREEN}${BOLD}✓ ${name}-structure.md${RESET}`)
  if (tagline) console.log(`  ${DIM}${tagline}${RESET}`)
  console.log(`\nSaved to: ${destFile}`)
  console.log('\nNext steps:')
  console.log(`  1. Read the structure: cat ${name}-structure.md`)
  console.log(`  2. Scaffold the directories: npx claudient scaffold ${name}`)
  if (skills) {
    console.log('  3. Install skills:')
    for (const line of skills.split('\n').filter(l => l.trim().startsWith('npx'))) {
      console.log(`     ${line.trim()}`)
    }
  }
  console.log(`  4. Copy the CLAUDE.md template into your project\n`)
}

function scaffoldStructure(name) {
  const BOLD = '\x1b[1m'
  const GREEN = '\x1b[32m'
  const DIM = '\x1b[2m'
  const RESET = '\x1b[0m'

  if (!name) {
    console.error('Usage: npx claudient scaffold <structure-name>')
    console.error('       npx claudient list structures')
    process.exit(1)
  }

  const srcFile = path.join(STRUCTURES_SRC, `${name}.md`)
  if (!fs.existsSync(srcFile)) {
    console.error(`Structure not found: "${name}". Run: npx claudient list structures`)
    process.exit(1)
  }

  const content = fs.readFileSync(srcFile, 'utf-8')

  // Extract the Quick scaffold bash block
  const scaffoldSection = content.match(/## Quick scaffold\s*\n+```bash\n([\s\S]*?)```/)
  if (!scaffoldSection) {
    console.log(`No scaffold commands found in ${name}. Read the full structure:`)
    console.log(`  npx claudient add structure ${name}`)
    return
  }

  const commands = scaffoldSection[1].trim()
  const title = (content.match(/^# (.+)$/m) || [])[1] || name

  console.log(`\n${BOLD}Scaffold: ${title}${RESET}`)
  console.log(`${DIM}Run these commands to create the project structure:${RESET}\n`)
  console.log('─'.repeat(60))
  console.log(commands)
  console.log('─'.repeat(60))
  console.log()

  // Offer to run them
  const readline = require('readline')
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  rl.question(`${GREEN}Run these commands now in the current directory? [y/N] ${RESET}`, (answer) => {
    rl.close()
    if (answer.toLowerCase() === 'y') {
      console.log()
      try {
        // Run only mkdir and touch lines — skip comment lines and npx install lines
        const safeLines = commands.split('\n').filter(l => {
          const t = l.trim()
          return t.startsWith('mkdir') || t.startsWith('touch') || t.startsWith('cd ')
        })
        for (const line of safeLines) {
          console.log(`  $ ${line}`)
          execSync(line, { stdio: 'inherit', cwd: process.cwd() })
        }
        console.log(`\n${GREEN}${BOLD}✓ Directory structure created.${RESET}`)
        console.log(`Next: copy the CLAUDE.md template from ${name}-structure.md into your project.\n`)
      } catch (err) {
        console.error(`\nError running scaffold: ${err.message}`)
      }
    } else {
      console.log('Scaffold commands printed above — run them manually when ready.\n')
    }
  })
}

function removeCommand(type, category) {
  checkClaudeInstalled()
  switch (type) {
    case 'skills':
      if (category) {
        console.log(`Removing ${category} skills...\n`)
        removeDir(path.join(SKILLS_DEST, category), category)
      } else {
        console.log('Removing all skills...\n')
        for (const cat of SKILL_CATEGORIES) {
          removeDir(path.join(SKILLS_DEST, cat), cat)
        }
      }
      break
    case 'agents':
      console.log('Removing agents...\n')
      removeDir(AGENTS_DEST, 'agents')
      break
    case 'rules':
      console.log('Removing rules...\n')
      removeDir(RULES_DEST, 'rules')
      break
    case 'hooks':
      console.log('Removing hooks...\n')
      removeDir(HOOKS_DEST, 'hooks')
      break
    default:
      console.error(`Unknown type: "${type}". Use: skills, agents, rules, hooks`)
      process.exit(1)
  }
  console.log('\nDone. Restart Claude Code to apply.')
}

function updateCommand() {
  console.log('Checking for updates...\n')
  try {
    const current = require(path.join(REPO_ROOT, 'package.json')).version
    const latest = execSync('npm view claudient version', { encoding: 'utf-8' }).trim()
    if (current === latest) {
      console.log(`Already up to date (v${current}).`)
      return
    }
    console.log(`Update available: v${current} → v${latest}`)
    console.log('Run: npm install -g claudient  or  npx claudient@latest add all')
  } catch {
    console.log('Could not check for updates. Visit: https://www.npmjs.com/package/claudient')
  }
}

function loadIndex() {
  // Try index.json next to package.json first (installed package),
  // then fall back to filesystem scan (dev/repo context)
  const indexPath = path.join(REPO_ROOT, 'index.json')
  if (fs.existsSync(indexPath)) {
    try { return JSON.parse(fs.readFileSync(indexPath, 'utf-8')) } catch {}
  }
  return null
}

function listCommand(type) {
  const index = loadIndex()

  if (index) {
    // Fast path: use pre-built index.json
    const enOnly = (arr) => arr.filter(i => !i.lang || i.lang === 'en')

    const listSkills = () => {
      const byCategory = {}
      for (const s of enOnly(index.skills)) {
        if (!byCategory[s.category]) byCategory[s.category] = []
        byCategory[s.category].push(s)
      }
      console.log('Skills:\n')
      for (const [cat, items] of Object.entries(byCategory)) {
        console.log(`  ${cat}/ (${items.length})`)
        for (const s of items) console.log(`    ${s.id.split('/').slice(1).join('/')}.md`)
      }
      console.log(`\n  Total: ${enOnly(index.skills).length} skills in ${Object.keys(byCategory).length} categories`)
    }

    const listAgents = () => {
      const agents = enOnly(index.agents)
      const byCategory = {}
      for (const a of agents) {
        const cat = a.id.split('/')[0]
        if (!byCategory[cat]) byCategory[cat] = []
        byCategory[cat].push(a)
      }
      console.log('Agents:\n')
      for (const [cat, items] of Object.entries(byCategory)) {
        console.log(`  ${cat}/ (${items.length})`)
        for (const a of items) console.log(`    ${a.title}`)
      }
    }

    const listHooks = () => {
      const byCategory = {}
      for (const h of index.hooks) {
        if (!byCategory[h.category]) byCategory[h.category] = []
        byCategory[h.category].push(h)
      }
      console.log('Hooks:\n')
      for (const [cat, items] of Object.entries(byCategory)) {
        console.log(`  ${cat}/ (${items.length})`)
        for (const h of items) console.log(`    ${h.id.split('/')[1]}.sh`)
      }
    }

    const listRules = () => {
      const rules = enOnly(index.rules)
      const byCategory = {}
      for (const r of rules) {
        if (!byCategory[r.category]) byCategory[r.category] = []
        byCategory[r.category].push(r)
      }
      console.log('Rules:\n')
      for (const [cat, items] of Object.entries(byCategory)) {
        console.log(`  ${cat}/ (${items.length})`)
        for (const r of items) console.log(`    ${r.slug}.md`)
      }
    }

    const listAll = () => {
      listSkills(); console.log()
      listAgents(); console.log()
      listRules(); console.log()
      listHooks(); console.log()
      console.log(`Generated: ${index.generated}`)
      console.log(`Version:   claudient@${index.version}`)
    }

    switch (type) {
      case 'agents': listAgents(); break
      case 'hooks': listHooks(); break
      case 'rules': listRules(); break
      case 'skills': listSkills(); break
      default: if (!type) listAll(); else listSkills()
    }
    return
  }

  // Fallback: filesystem scan (repo dev context without index.json)
  const listSkillsFs = () => {
    console.log('Skills:\n')
    for (const cat of SKILL_CATEGORIES) {
      const catDir = path.join(REPO_ROOT, 'skills', cat)
      if (!fs.existsSync(catDir)) continue
      const files = getFiles(catDir).filter(f => !SUPPORTED_LANGS.some(l => f.includes(`/${l}/`)))
      console.log(`  ${cat}/ (${files.length})`)
      for (const f of files) console.log(`    ${f}`)
    }
  }

  switch (type) {
    case 'agents':
    case 'hooks':
    case 'rules':
      console.log('(index.json not found — run: npm run build-index)')
      break
    default:
      listSkillsFs()
  }
}

// ── Search ────────────────────────────────────────────────────────────────────

function searchCommand(query) {
  const index = loadIndex()
  const q = query.toLowerCase()
  const BOLD = '\x1b[1m'
  const ORANGE = '\x1b[33m'
  const DIM = '\x1b[2m'
  const RESET = '\x1b[0m'

  if (!index) {
    console.error('index.json not found. Run: npm run build-index')
    process.exit(1)
  }

  const enSkills = index.skills.filter(s => !s.lang || s.lang === 'en')
  const enAgents = index.agents.filter(a => !a.lang || a.lang === 'en')

  const skillMatches = enSkills.filter(s =>
    s.id.toLowerCase().includes(q) ||
    s.title.toLowerCase().includes(q) ||
    (s.description || '').toLowerCase().includes(q) ||
    s.category.toLowerCase().includes(q)
  )

  const agentMatches = enAgents.filter(a =>
    a.id.toLowerCase().includes(q) ||
    a.title.toLowerCase().includes(q)
  )

  const hookMatches = index.hooks.filter(h =>
    h.id.toLowerCase().includes(q) ||
    h.title.toLowerCase().includes(q)
  )

  const structureMatches = (index.structures || []).filter(s =>
    s.id.toLowerCase().includes(q) ||
    s.title.toLowerCase().includes(q) ||
    (s.tagline || '').toLowerCase().includes(q)
  )

  const total = skillMatches.length + agentMatches.length + hookMatches.length + structureMatches.length

  if (total === 0) {
    console.log(`No results for "${query}".`)
    console.log(`Try: npx claudient list`)
    return
  }

  console.log(`\n${BOLD}Search results for "${query}" — ${total} found${RESET}\n`)

  if (skillMatches.length) {
    console.log(`${BOLD}Skills (${skillMatches.length})${RESET}`)
    for (const s of skillMatches) {
      // Highlight query in description
      const desc = s.description
        ? `  ${DIM}${s.description.slice(0, 80)}${s.description.length > 80 ? '...' : ''}${RESET}`
        : ''
      console.log(`  ${ORANGE}${s.id}${RESET}`)
      if (desc) console.log(desc)
      console.log(`  Install: npx claudient add skills ${s.category}`)
      console.log()
    }
  }

  if (agentMatches.length) {
    console.log(`${BOLD}Agents (${agentMatches.length})${RESET}`)
    for (const a of agentMatches) {
      console.log(`  ${ORANGE}${a.id}${RESET} — ${a.title}`)
    }
    console.log(`  Install: npx claudient add agents`)
    console.log()
  }

  if (hookMatches.length) {
    console.log(`${BOLD}Hooks (${hookMatches.length})${RESET}`)
    for (const h of hookMatches) {
      console.log(`  ${ORANGE}${h.id}${RESET} — ${h.title}`)
    }
    console.log(`  Install: npx claudient add hooks`)
    console.log()
  }

  if (structureMatches.length) {
    console.log(`${BOLD}Project Structures (${structureMatches.length})${RESET}`)
    for (const s of structureMatches) {
      console.log(`  ${ORANGE}${s.id}${RESET} — ${s.title}`)
      if (s.tagline) console.log(`  ${DIM}${s.tagline.slice(0, 90)}${RESET}`)
      console.log(`  Install: npx claudient add structure ${s.id}`)
      console.log()
    }
  }
}

// ── Init (interactive first-run setup) ───────────────────────────────────────

async function initCommand() {
  const readline = require('readline')

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const ask = (q) => new Promise(resolve => rl.question(q, resolve))

  const BOLD  = '\x1b[1m'
  const ORANGE = '\x1b[33m'
  const GREEN = '\x1b[32m'
  const DIM   = '\x1b[2m'
  const RESET = '\x1b[0m'

  console.log(`
${BOLD}╔══════════════════════════════════════════════╗
║         CLAUDIENT SETUP                     ║
║   The Claude Code Knowledge System          ║
╚══════════════════════════════════════════════╝${RESET}
`)

  // Check Claude Code installed
  if (!fs.existsSync(CLAUDE_DIR)) {
    console.error(`${ORANGE}⚠ ~/.claude not found.${RESET}`)
    console.error(`  Claude Code must be installed first: https://claude.ai/code\n`)
    rl.close()
    process.exit(1)
  }
  console.log(`${GREEN}✓ Claude Code detected at ${CLAUDE_DIR}${RESET}\n`)

  const summary = { skills: [], agents: false, hooks: false, rules: false, lang: 'en' }

  // 1. Language
  console.log(`${BOLD}Step 1/5 — Language${RESET}`)
  console.log('  Available: en, fr, de, nl, es')
  const langInput = (await ask('  Which language? [en] ')).trim().toLowerCase() || 'en'
  summary.lang = SUPPORTED_LANGS.includes(langInput) ? langInput : 'en'
  console.log(`  → ${summary.lang}\n`)

  // 2. Skill categories
  console.log(`${BOLD}Step 2/5 — Skills${RESET}`)
  SKILL_CATEGORIES.forEach((cat, i) => console.log(`  ${i + 1}. ${cat}`))
  console.log('  a. All categories')
  console.log('  0. Skip skills')
  const catInput = (await ask('  Select categories (comma-separated numbers, or a/0): ')).trim()

  if (catInput === '0') {
    console.log('  → Skipping skills\n')
  } else if (catInput === 'a' || catInput === '') {
    summary.skills = [...SKILL_CATEGORIES]
    console.log(`  → All categories selected\n`)
  } else {
    const nums = catInput.split(',').map(n => parseInt(n.trim(), 10)).filter(n => n >= 1 && n <= SKILL_CATEGORIES.length)
    summary.skills = nums.map(n => SKILL_CATEGORIES[n - 1])
    console.log(`  → Selected: ${summary.skills.join(', ')}\n`)
  }

  // 3. Agents
  console.log(`${BOLD}Step 3/5 — Agents${RESET}`)
  console.log('  6 subagent definitions: Planner, Architect, Code Reviewer, Security, Build Resolvers')
  const agentsInput = (await ask('  Install agents? [Y/n] ')).trim().toLowerCase()
  summary.agents = agentsInput !== 'n'
  console.log(`  → ${summary.agents ? 'Yes' : 'No'}\n`)

  // 4. Hooks
  console.log(`${BOLD}Step 4/5 — Hooks${RESET}`)
  console.log('  7 shell scripts: safety guards, auto-formatter, audit log, cost tracker, session helpers')
  const hooksInput = (await ask('  Install hooks? [Y/n] ')).trim().toLowerCase()
  summary.hooks = hooksInput !== 'n'
  console.log(`  → ${summary.hooks ? 'Yes' : 'No'}\n`)

  // 5. Rules
  console.log(`${BOLD}Step 5/5 — Rules${RESET}`)
  console.log('  8 rule sets: coding style, git, security, testing, performance, Python, TypeScript, Go')
  const rulesInput = (await ask('  Add rules to ./CLAUDE.md? [Y/n] ')).trim().toLowerCase()
  summary.rules = rulesInput !== 'n'
  console.log(`  → ${summary.rules ? 'Yes' : 'No'}\n`)

  rl.close()

  // Confirm
  console.log(`${BOLD}Summary${RESET}`)
  console.log(`  Language : ${summary.lang}`)
  console.log(`  Skills   : ${summary.skills.length ? summary.skills.join(', ') : 'none'}`)
  console.log(`  Agents   : ${summary.agents ? 'yes' : 'no'}`)
  console.log(`  Hooks    : ${summary.hooks ? 'yes' : 'no'}`)
  console.log(`  Rules    : ${summary.rules ? 'append to ./CLAUDE.md' : 'no'}`)
  console.log()

  // Execute
  if (summary.skills.length) {
    for (const cat of summary.skills) {
      console.log(`Installing ${cat} skills...`)
      addSkills(cat, summary.lang === 'en' ? null : summary.lang)
    }
    console.log()
  }

  if (summary.agents) {
    console.log('Installing agents...')
    addAgents()
    console.log()
  }

  if (summary.hooks) {
    console.log('Installing hooks...')
    addHooks()
    console.log()
  }

  if (summary.rules) {
    console.log('Adding rules to ./CLAUDE.md...')
    addRulesWrite()
    console.log()
  }

  console.log(`${GREEN}${BOLD}✓ Claudient setup complete!${RESET}`)
  console.log()
  console.log('Next steps:')
  if (summary.hooks) {
    console.log(`  1. Add hook entries to .claude/settings.json`)
    console.log(`     See: https://github.com/Claudient/Claudient/tree/main/hooks`)
  }
  console.log(`  2. Restart Claude Code to activate all installed content`)
  console.log(`  3. Try a skill — type /fastapi or /kubernetes in Claude Code`)
  console.log()
  console.log(`  Full docs: https://github.com/Claudient/Claudient`)
}

function getFiles(dir, prefix = '') {
  const results = []
  if (!fs.existsSync(dir)) return results
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) results.push(...getFiles(p, prefix + entry.name + '/'))
    else if (entry.name.endsWith('.md')) results.push(prefix + entry.name)
  }
  return results
}

// ── Main ──────────────────────────────────────────────────────────────────────

const [, , command, ...rawArgs] = process.argv
const { flags, positional } = parseArgs(rawArgs)
const lang = flags.lang && SUPPORTED_LANGS.includes(flags.lang) ? flags.lang : null

if (lang && !SUPPORTED_LANGS.includes(lang)) {
  console.error(`Unknown language: "${flags.lang}". Supported: ${SUPPORTED_LANGS.join(', ')}`)
  process.exit(1)
}

switch (command) {
  case 'add': {
    const type = positional[0]
    const arg2 = positional[1]
    switch (type) {
      case 'skills': addSkills(arg2 || null, lang); break
      case 'agents': addAgents(); break
      case 'rules':
        if (flags.write) addRulesWrite()
        else addRules()
        break
      case 'hooks': addHooks(); break
      case 'structure': addStructure(arg2); break
      case 'all':
        addSkills(null, lang)
        addAgents()
        addHooks()
        break
      case undefined:
        console.error('Usage: claudient add <skills|agents|rules|hooks|all>')
        process.exit(1)
        break
      default:
        // Backward compat: claudient add backend (old syntax)
        if (SKILL_CATEGORIES.includes(type)) {
          addSkills(type, lang)
        } else {
          console.error(`Unknown type: "${type}". Use: skills, agents, rules, hooks, all`)
          process.exit(1)
        }
    }
    break
  }
  case 'remove': {
    const type = positional[0]
    const arg2 = positional[1]
    if (!type) { console.error('Usage: claudient remove <skills|agents|rules|hooks>'); process.exit(1) }
    removeCommand(type, arg2)
    break
  }
  case 'scaffold':
    scaffoldStructure(positional[0])
    break
  case 'update':
    updateCommand()
    break
  case 'list':
    if (positional[0] === 'structures') listStructures()
    else listCommand(positional[0])
    break
  case 'search': {
    const query = positional.join(' ')
    if (!query) { console.error('Usage: claudient search <query>'); process.exit(1) }
    searchCommand(query)
    break
  }
  case 'init':
    initCommand().catch(err => { console.error(err); process.exit(1) })
    break
  case 'recommend':
  case 'scan':
    recommend(positional[0] || '.')
    break
  case 'help':
  case '--help':
  case '-h':
  case undefined:
    usage()
    break
  default:
    console.error(`Unknown command: "${command}"`)
    usage()
    process.exit(1)
}
