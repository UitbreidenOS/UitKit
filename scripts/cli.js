#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const os = require('os')
const { execSync } = require('child_process')
const { recommend } = require('./recommend')
const { learnCodebase } = require('./learn')
const { runSentinel } = require('./sentinel')
const { createCheckpoint, restoreCheckpoint } = require('./checkpoint')

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
  npx claudient init --enterprise             Set up enterprise-scale governance & compliance
  npx claudient doctor                        Check Claude Code setup health
  npx claudient dashboard                    Launch local dashboard app in browser
  npx claudient consult "<need>"             Recommend skills and stacks by keyword
  npx claudient benchmark [skill-id]          Show eval scores for skills
  npx claudient audit                         Deep compliance audit of your Claude Code setup
  npx claudient score                         AI-Readiness Score (0–100) across 8 dimensions
  npx claudient share                         Export your installed skills as a shareable bundle
  npx claudient import <gist-url>            Import a shared skill bundle from GitHub Gist
  npx claudient export <harness>              Export rules/guidelines to Cursor or Windsurf
  npx claudient council <domain>             Trigger domain-wide subagent swarm session
  npx claudient map                           Generate interactive codebase dependency graph
  npx claudient spec                          Run interactive Specify Wizard for Spec Kit
  npx claudient repair                        Run tests and capture errors for self-healing
  npx claudient tribunal                      Run PR adversarial review swarm on active changes
  npx claudient bisect                        Run autonomous git bisect debugger for regressions
  npx claudient oracle                        Trace downstream blast radius & audit concurrency
  npx claudient nightshift                    Run daemon for autonomous batch refactoring
  npx claudient caveman [--enable|--disable]  Toggle ultra-dense token optimization rules
  npx claudient jit <file>                    Compile JIT import dependencies context payload
  npx claudient commit -m "<msg>"             Verify validations and tests before git commit
  npx claudient permissions [list|add|remove] Edit and track model tool auto-permissions
  npx claudient handoff [--task "<task>"]    Orchestrate Architect/Mason design-to-code loop
  npx claudient tdd [--file <f>] [--test <t>] Automate Red-Green-Refactor test loops
  npx claudient enforce                       Audit changes against SPEC.md guidelines
  npx claudient sweep                         Scan project for dead code, unused imports/vars
  npx claudient documentation                 Synthesize zero-drift reference documentation
  npx claudient chaos                         Execute test suites under boundary latency injection
  npx claudient prophet                       Calculate change churn to predict outage risk
  npx claudient ci                            Scaffold self-healing GitHub Actions CI pipeline
  npx claudient incident [--alert "<alert>"]  Triage production alerts, audit commits, and revert
  npx claudient swarm-sandbox [init|run|validate|cleanup] <name>  Orchestrate multi-agent sandboxes
  npx claudient svg-inspector [inspect|render|export|serve|validate|list] <file>  SVG map inspector & renderer
  npx claudient learn                         Scan project and generate custom rules
  npx claudient sentinel                      Auto-generate anti-hallucination project rules
  npx claudient checkpoint "<task>"          Create workspace state checkpoint
  npx claudient restore                       Restore from latest checkpoint
  npx claudient search <query>               Search skills, agents, structures
  npx claudient add skills [category] [--lang <lang>]
  npx claudient add agents
  npx claudient add rules [--write]
  npx claudient add hooks
  npx claudient add statusline <name>        Install a statusline script preset
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

Or browse online: https://github.com/UitbreidenOS/Claudient/tree/main/hooks
`)
}

function addStatusline(name) {
  checkClaudeInstalled()
  const statuslinesDir = path.join(REPO_ROOT, 'statuslines')
  const validStatuslines = ['minimal', 'cost-watch', 'context-budget', 'git-focused', 'full', 'rate-limit', 'pulse']

  if (!name || !validStatuslines.includes(name)) {
    console.error(`Error: Omit or specify a valid statusline name.
Available statuslines:
  ${validStatuslines.join('\n  ')}

Example:
  npx claudient add statusline cost-watch`)
    process.exit(1)
  }

  const srcPath = path.join(statuslinesDir, `${name}.sh`)
  if (!fs.existsSync(srcPath)) {
    console.error(`Error: Statusline script not found at ${srcPath}`)
    process.exit(1)
  }

  const destDir = path.join(CLAUDE_DIR, 'statuslines')
  fs.mkdirSync(destDir, { recursive: true })
  
  const destPath = path.join(destDir, `${name}.sh`)
  fs.copyFileSync(srcPath, destPath)
  fs.chmodSync(destPath, '755')

  console.log(`\nCopied statusline script to ${destPath}`)

  const settingsPath = path.join(CLAUDE_DIR, 'settings.json')
  let settings = {}
  if (fs.existsSync(settingsPath)) {
    try {
      settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'))
    } catch (e) {
      console.warn('Warning: Could not parse existing settings.json, creating clean config.')
    }
  }

  settings.statusLine = {
    command: destPath
  }

  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf-8')
  console.log(`Configured settings.json to use the statusline.

Verify ~/.claude/settings.json:
  "statusLine": {
    "command": "${destPath}"
  }

Ensure you have 'jq' installed on your system as the script uses it to format stats.
Enjoy your custom Claude Code statusline!`)
}

function exportCommand(harness) {
  const validHarnesses = ['cursor', 'windsurf']
  if (!harness || !validHarnesses.includes(harness)) {
    console.error(`Error: Specify a valid harness to export.
Available harnesses:
  cursor      Generates .cursorrules for Cursor IDE
  windsurf    Generates .windsurfrules for Windsurf IDE

Example:
  npx claudient export cursor`)
    process.exit(1)
  }

  const outputFileName = harness === 'cursor' ? '.cursorrules' : '.windsurfrules'
  const outputPath = path.join(process.cwd(), outputFileName)

  console.log(`Compiling rules for ${harness}...`)

  let compiledContent = `# Claudient AI Rules for ${harness === 'cursor' ? 'Cursor' : 'Windsurf'}\n\n`
  compiledContent += `This file configures custom instructions for the AI assistant inside this workspace.\n\n`

  let rulesAdded = 0
  const localRulesDir = path.join(process.cwd(), '.claude', 'rules')
  const globalRulesDir = path.join(CLAUDE_DIR, 'rules')
  const repoRulesDir = path.join(REPO_ROOT, 'rules', 'common')

  let searchDirs = []
  if (fs.existsSync(localRulesDir)) {
    searchDirs.push({ dir: localRulesDir, label: 'Local Project Rules' })
  }
  if (fs.existsSync(globalRulesDir)) {
    searchDirs.push({ dir: globalRulesDir, label: 'Global Rules' })
  }
  if (searchDirs.length === 0 && fs.existsSync(repoRulesDir)) {
    searchDirs.push({ dir: repoRulesDir, label: 'Standard Repository Rules' })
  }

  for (const item of searchDirs) {
    const files = fs.readdirSync(item.dir).filter(f => f.endsWith('.md'))
    if (files.length > 0) {
      compiledContent += `## ${item.label}\n\n`
      for (const file of files) {
        const filePath = path.join(item.dir, file)
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        
        let cleanContent = fileContent
        if (fileContent.startsWith('---')) {
          const secondYamlBoundary = fileContent.indexOf('---', 3)
          if (secondYamlBoundary !== -1) {
            cleanContent = fileContent.substring(secondYamlBoundary + 3).trim()
          }
        }
        
        const title = file.replace('.md', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        compiledContent += `### ${title}\n\n${cleanContent}\n\n---\n\n`
        rulesAdded++
        console.log(`  + Compiled rule: ${file}`)
      }
    }
  }

  if (rulesAdded === 0) {
    console.error('Error: No rules found to export. Install rules first using \`npx claudient add rules\`.')
    process.exit(1)
  }

  fs.writeFileSync(outputPath, compiledContent, 'utf-8')
  console.log(`\n✓ Success! Exported ${rulesAdded} rules to ${outputPath}`)
  console.log(`AI assistants in ${harness === 'cursor' ? 'Cursor' : 'Windsurf'} will now automatically follow these guidelines.`)
}

function dashboardCommand() {
  const { spawn } = require('child_process')
  console.log('Launching Claudient Workspace Dashboard locally...')
  
  const siteDir = path.join(REPO_ROOT, 'site')
  if (!fs.existsSync(siteDir)) {
    console.error('Error: site/ directory not found in repository.')
    process.exit(1)
  }

  console.log('Starting local Astro dev server...')
  
  // Choose npm command according to platform
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const server = spawn(npmCmd, ['run', 'dev'], { cwd: siteDir, stdio: 'pipe' })
  
  server.stdout.on('data', (data) => {
    // Keep it quiet unless needed
  })

  server.stderr.on('data', (data) => {
    // Log server errors quietly
  })

  setTimeout(() => {
    const url = 'http://localhost:4321'
    console.log(`Opening dashboard at ${url} in your browser...`)
    try {
      const opener = process.platform === 'darwin' 
        ? spawn('open', [url]) 
        : process.platform === 'win32' 
          ? spawn('cmd', ['/c', 'start', '', url]) 
          : spawn('xdg-open', [url])
      
      opener.on('error', () => {
        console.log(`Failed to auto-open browser. Please open ${url} manually.`)
      })
    } catch {
      console.log(`Failed to auto-open browser. Please open ${url} manually.`)
    }
    console.log('\nPress Ctrl+C to terminate dashboard server.')
  }, 1800)

  process.on('SIGINT', () => {
    console.log('\nTerminating local dashboard server...')
    server.kill()
    process.exit(0)
  })
  process.on('SIGTERM', () => {
    server.kill()
    process.exit(0)
  })
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

function addStack(nameOrPath) {
  checkClaudeInstalled()
  if (!nameOrPath) {
    console.error('Usage: npx claudient add stack <stack-name-or-path>')
    process.exit(1)
  }

  // Resolve path
  let srcDir = nameOrPath
  if (!fs.existsSync(srcDir)) {
    // If it's a stack name like "ai_sdr_stack" or "ai_sdr", resolve under professional-stacks/
    let target = nameOrPath
    if (!target.endsWith('_stack')) {
      target = `${target}_stack`
    }
    srcDir = path.join(REPO_ROOT, 'professional-stacks', target)
  }

  if (!fs.existsSync(srcDir)) {
    console.error(`Error: Stack not found at: ${nameOrPath} or ${srcDir}`)
    process.exit(1)
  }

  console.log(`Installing stack from: ${srcDir}\n`)

  const destCwd = process.cwd()

  // Helper to copy files or directory recursively to dest
  const copyStackItem = (item, destParent) => {
    const srcPath = path.join(srcDir, item)
    if (!fs.existsSync(srcPath)) return

    const destPath = path.join(destParent, item)
    const stat = fs.statSync(srcPath)

    if (stat.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true })
      for (const file of fs.readdirSync(srcPath)) {
        copyStackItem(path.join(item, file), destParent)
      }
    } else {
      fs.mkdirSync(path.dirname(destPath), { recursive: true })
      fs.copyFileSync(srcPath, destPath)
      console.log(`  + ${item}`)
    }
  }

  // Files to copy to CWD
  const cwdFiles = ['CLAUDE.md', 'README.md', 'session-log.md']
  for (const f of cwdFiles) {
    if (fs.existsSync(path.join(srcDir, f))) {
      // Prompt user or warn if overwriting
      if (fs.existsSync(path.join(destCwd, f))) {
        console.log(`  ~ Overwriting existing ${f}`)
      }
      fs.copyFileSync(path.join(srcDir, f), path.join(destCwd, f))
      console.log(`  + ${f}`)
    }
  }

  // Folders to copy to local .claude/ directory
  const localClaudeDir = path.join(destCwd, '.claude')
  fs.mkdirSync(localClaudeDir, { recursive: true })

  const folders = ['skills', 'commands', 'hooks', 'mcp']
  for (const folder of folders) {
    const srcFolder = path.join(srcDir, folder)
    if (fs.existsSync(srcFolder) && fs.statSync(srcFolder).isDirectory()) {
      copyStackItem(folder, localClaudeDir)
    }
  }

  console.log(`\n✅ Stack installed successfully to: ${destCwd}`)
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

function guardCommand(action, file) {
  const BOLD  = '\x1b[1m'
  const GREEN = '\x1b[32m'
  const ORANGE = '\x1b[33m'
  const RESET = '\x1b[0m'
  
  if (action === 'unlock') {
    if (!file) {
      console.error(`${ORANGE}Usage: npx claudient guard unlock <file>${RESET}`)
      process.exit(1)
    }
    const unlockFile = path.join(process.cwd(), '.claudient-unlock')
    let unlocked = []
    if (fs.existsSync(unlockFile)) {
      unlocked = fs.readFileSync(unlockFile, 'utf-8').split('\n').filter(Boolean)
    }
    const absPath = path.resolve(file)
    if (!unlocked.includes(absPath)) {
      unlocked.push(absPath)
      fs.writeFileSync(unlockFile, unlocked.join('\n') + '\n')
    }
    console.log(`${GREEN}✓ Unlocked ${file} for AI modification.${RESET}`)
    const DIM = '\x1b[2m'
    console.log(`${DIM}Note: The Workspace Guardian hook will now allow edits to this file.${RESET}`)
  } else {
    console.log(`${BOLD}Workspace Guardian${RESET}`)
    console.log(`Protects infrastructure files (package.json, .env, etc.) from AI overwrite.`)
    console.log(`\nUsage: npx claudient guard unlock <file>`)
  }
}

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

  let detectedStacks = []
  const cwd = process.cwd()
  if (fs.existsSync(path.join(cwd, 'package.json'))) {
    try {
      const pkg = fs.readFileSync(path.join(cwd, 'package.json'), 'utf8')
      if (pkg.includes('"next"')) detectedStacks.push('Next.js')
      if (pkg.includes('"react"')) detectedStacks.push('React')
      if (pkg.includes('"typescript"')) detectedStacks.push('TypeScript')
      detectedStacks.push('Node.js')
    } catch(e) {}
  }
  if (fs.existsSync(path.join(cwd, 'requirements.txt')) || fs.existsSync(path.join(cwd, 'pyproject.toml'))) {
    detectedStacks.push('Python')
  }
  if (fs.existsSync(path.join(cwd, 'go.mod'))) {
    detectedStacks.push('Go')
  }
  if (fs.existsSync(path.join(cwd, 'Cargo.toml'))) {
    detectedStacks.push('Rust')
  }

  detectedStacks = [...new Set(detectedStacks)]

  if (detectedStacks.length > 0) {
    console.log(`${BOLD}✨ Magic Init Detected: ${detectedStacks.slice(0, 3).join(', ')}${RESET}`)
    const magicInput = (await ask('  Run Magic Init to auto-configure best rules and hooks for this stack? [Y/n] ')).trim().toLowerCase()
    if (magicInput !== 'n') {
      console.log(`\n${GREEN}Running Magic Init...${RESET}\n`)
      addHooks()
      addRulesWrite()
      addSkills(null, 'en')
      addAgents()
      console.log(`\n${GREEN}✓ Magic Init complete! Claudient is fully optimized for your stack.${RESET}\n`)
      rl.close()
      return
    }
  }

  const summary = { skills: [], agents: false, hooks: false, rules: false, lang: 'en', telemetry: true }

  // 1. Language
  console.log(`${BOLD}Step 1/6 — Language${RESET}`)
  console.log('  Available: en, fr, de, nl, es')
  const langInput = (await ask('  Which language? [en] ')).trim().toLowerCase() || 'en'
  summary.lang = SUPPORTED_LANGS.includes(langInput) ? langInput : 'en'
  console.log(`  → ${summary.lang}\n`)

  // 2. Skill categories
  console.log(`${BOLD}Step 2/6 — Skills${RESET}`)
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
  console.log(`${BOLD}Step 3/6 — Agents${RESET}`)
  console.log('  6 subagent definitions: Planner, Architect, Code Reviewer, Security, Build Resolvers')
  const agentsInput = (await ask('  Install agents? [Y/n] ')).trim().toLowerCase()
  summary.agents = agentsInput !== 'n'
  console.log(`  → ${summary.agents ? 'Yes' : 'No'}\n`)

  // 4. Hooks
  console.log(`${BOLD}Step 4/6 — Hooks${RESET}`)
  console.log('  7 shell scripts: safety guards, auto-formatter, audit log, cost tracker, session helpers')
  const hooksInput = (await ask('  Install hooks? [Y/n] ')).trim().toLowerCase()
  summary.hooks = hooksInput !== 'n'
  console.log(`  → ${summary.hooks ? 'Yes' : 'No'}\n`)

  // 5. Rules
  console.log(`${BOLD}Step 5/6 — Rules${RESET}`)
  console.log('  8 rule sets: coding style, git, security, testing, performance, Python, TypeScript, Go')
  const rulesInput = (await ask('  Add rules to ./CLAUDE.md? [Y/n] ')).trim().toLowerCase()
  summary.rules = rulesInput !== 'n'
  console.log(`  → ${summary.rules ? 'Yes' : 'No'}\n`)

  // 6. Telemetry
  console.log(`${BOLD}Step 6/6 — Telemetry${RESET}`)
  console.log('  Enable anonymous setup metrics to help improve Claudient?')
  const telemetryInput = (await ask('  Share anonymous metrics? [Y/n] ')).trim().toLowerCase()
  summary.telemetry = telemetryInput !== 'n'
  console.log(`  → ${summary.telemetry ? 'Yes' : 'No'}\n`)

  rl.close()

  // Confirm
  console.log(`${BOLD}Summary${RESET}`)
  console.log(`  Language  : ${summary.lang}`)
  console.log(`  Skills    : ${summary.skills.length ? summary.skills.join(', ') : 'none'}`)
  console.log(`  Agents    : ${summary.agents ? 'yes' : 'no'}`)
  console.log(`  Hooks     : ${summary.hooks ? 'yes' : 'no'}`)
  console.log(`  Rules     : ${summary.rules ? 'append to ./CLAUDE.md' : 'no'}`)
  console.log(`  Telemetry : ${summary.telemetry ? 'opt-in' : 'disabled'}`)
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

  // Save telemetry preference to global settings.json
  const settingsPath = path.join(CLAUDE_DIR, 'settings.json')
  let settings = {}
  if (fs.existsSync(settingsPath)) {
    try {
      settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'))
    } catch (e) {}
  }
  if (!settings.claudient) settings.claudient = {}
  settings.claudient.telemetry = summary.telemetry
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf-8')

  console.log(`${GREEN}${BOLD}✓ Claudient setup complete!${RESET}`)
  console.log()
  console.log('Next steps:')
  if (summary.hooks) {
    console.log(`  1. Add hook entries to .claude/settings.json`)
    console.log(`     See: https://github.com/UitbreidenOS/Claudient/tree/main/hooks`)
  }
  console.log(`  2. Restart Claude Code to activate all installed content`)
  console.log(`  3. Try a skill — type /fastapi or /kubernetes in Claude Code`)
  console.log()
  console.log(`  Full docs: https://github.com/UitbreidenOS/Claudient`)
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

function doctorCommand() {
  console.log()
  console.log('🏥 Claude Code Health Check')
  console.log('━'.repeat(50))
  console.log()

  let score = 5
  const issues = []

  const skillsDir = path.join(CLAUDE_DIR, 'skills')
  const skillsCount = fs.existsSync(skillsDir) ? getFiles(skillsDir).length : 0
  if (skillsCount > 0) {
    console.log(`✅ Skills installed: ${skillsCount}`)
  } else {
    console.log(`❌ No skills installed`)
    issues.push('Run "npx claudient add skills all" to install skills')
    score -= 1
  }

  const agentsDir = path.join(CLAUDE_DIR, 'agents')
  const agentsCount = fs.existsSync(agentsDir) ? getFiles(agentsDir).length : 0
  if (agentsCount > 0) {
    console.log(`✅ Agents: ${agentsCount} active`)
  } else {
    console.log(`⚠️  Agents: none installed (optional)`)
    score -= 0.5
  }

  const claudeMdFile = fs.existsSync('CLAUDE.md') ? 'CLAUDE.md' : fs.existsSync(path.join(CLAUDE_DIR, 'CLAUDE.md')) ? path.join(CLAUDE_DIR, 'CLAUDE.md') : null
  if (claudeMdFile) {
    console.log(`✅ CLAUDE.md: Found`)
  } else {
    console.log(`⚠️  CLAUDE.md: Not found`)
    issues.push('Run "claudient init" to create a CLAUDE.md')
    score -= 0.5
  }

  const hooksDir = path.join(CLAUDE_DIR, 'hooks')
  const hooksCount = fs.existsSync(hooksDir) ? fs.readdirSync(hooksDir, { withFileTypes: true }).filter(e => e.isFile() && e.name.endsWith('.sh')).length : 0
  if (hooksCount > 0) {
    console.log(`✅ Hooks: ${hooksCount} active`)
  } else {
    console.log(`⚠️  Hooks: none installed (automates repetitive tasks)`)
    score -= 0.5
  }

  let staleCount = 0
  if (skillsCount > 0) {
    const now = Date.now()
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000
    for (const file of getFiles(skillsDir)) {
      const fullPath = path.join(skillsDir, file)
      const stat = fs.statSync(fullPath)
      if (now - stat.mtimeMs > thirtyDaysMs) {
        staleCount++
      }
    }
  }
  if (staleCount > 0) {
    console.log(`⚠️  Freshness: ${staleCount} skill(s) need update (>30 days old)`)
    issues.push('Run "claudient update" to refresh stale skills')
    score -= 0.5
  } else if (skillsCount > 0) {
    console.log(`✅ Freshness: All current`)
  }

  console.log()
  console.log(`Health Score: ${Math.max(0, score).toFixed(1)}/5.0`)
  console.log()

  if (issues.length > 0) {
    console.log('Recommendations:')
    issues.forEach(issue => console.log(`  → ${issue}`))
  } else {
    console.log('✨ Your Claude Code setup is in great shape!')
  }
  console.log()
}

function consultCommand(need) {
  if (!need || need.trim().length === 0) {
    console.error('Usage: npx claudient consult "<skill or need>"')
    console.error('Example: npx claudient consult "sales automation"')
    process.exit(1)
  }

  const indexPath = path.join(REPO_ROOT, 'index.json')
  if (!fs.existsSync(indexPath)) {
    console.error('Error: index.json not found. Run "npm run build-index" first.')
    process.exit(1)
  }

  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'))
  const needLower = need.toLowerCase()

  const matched = index.skills
    .filter(skill =>
      skill.title.toLowerCase().includes(needLower) ||
      skill.description.toLowerCase().includes(needLower)
    )
    .slice(0, 5)

  if (matched.length === 0) {
    console.log()
    console.log('No skills found matching: "' + need + '"')
    console.log('Try a broader search or run: npx claudient list skills')
    console.log()
    return
  }

  console.log()
  console.log(`Top ${matched.length} matching skills for: "${need}"`)
  console.log('━'.repeat(60))
  console.log()

  matched.forEach((skill, i) => {
    const skillId = skill.id.replace(/\//g, ' / ')
    console.log(`${i + 1}. [${skill.title}]`)
    console.log(`   ${skill.description}`)
    console.log(`   Install: npx claudient add skill ${skill.category}/${skill.title.toLowerCase().replace(/ /g, '-')}`)
    console.log()
  })

  const categoryKeywords = {
    'gtm': 'ai_sdr_stack',
    'sdr': 'ai_sdr_stack',
    'sales': 'ai_sdr_stack',
    'marketing': 'content_marketing_stack',
    'backend': 'fullstack_developer_stack',
    'devops': 'devops_platform_stack',
    'finance': 'finance_cfo_stack',
    'legal': 'legal_operations_stack',
    'product': 'product_manager_stack'
  }

  let suggestedStack = null
  for (const [keyword, stack] of Object.entries(categoryKeywords)) {
    if (needLower.includes(keyword)) {
      suggestedStack = stack
      break
    }
  }

  if (suggestedStack) {
    console.log('Suggested stack:')
    console.log(`  npx claudient add stack ${suggestedStack}`)
  }

  console.log()
}

function shareCommand() {
  checkClaudeInstalled()

  const skillsDir = path.join(CLAUDE_DIR, 'skills')
  const agentsDir = path.join(CLAUDE_DIR, 'agents')
  const hooksDir = path.join(CLAUDE_DIR, 'hooks')

  // Count total skills
  const totalSkills = fs.existsSync(skillsDir) ? getFiles(skillsDir).length : 0

  // Count agents
  const agentsCount = fs.existsSync(agentsDir) ? getFiles(agentsDir).length : 0

  // Count hooks
  const hooksCount = fs.existsSync(hooksDir)
    ? fs.readdirSync(hooksDir, { withFileTypes: true }).filter(e => e.isFile() && e.name.endsWith('.sh')).length
    : 0

  // Detect skill categories installed
  const categories = []
  if (fs.existsSync(skillsDir)) {
    for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        categories.push(entry.name)
      }
    }
  }

  // Build bundle
  const bundle = {
    claudient: '1.10.1',
    shared_at: new Date().toISOString(),
    author: '',
    description: 'My Claude Code setup',
    skills: categories,
    agents_count: agentsCount,
    hooks_count: hooksCount,
    total_skills: totalSkills
  }

  console.log()
  console.log('📦 Your Claude Code Setup Bundle')
  console.log('━'.repeat(60))
  console.log()
  console.log(JSON.stringify(bundle, null, 2))
  console.log()
  console.log('━'.repeat(60))
  console.log()
  console.log('To share this setup:')
  console.log('  1. Copy the JSON above')
  console.log('  2. Create a GitHub Gist: https://gist.github.com')
  console.log('  3. Paste the JSON into the gist and save')
  console.log('  4. Share the gist raw URL with others:')
  console.log('     npx claudient import <gist-raw-url>')
  console.log()
}

function importCommand(gistUrl) {
  checkClaudeInstalled()

  // Validate URL
  if (!gistUrl.includes('gist.github.com') && !gistUrl.includes('gist.githubusercontent.com')) {
    console.error('Error: Invalid gist URL. Must be from gist.github.com or gist.githubusercontent.com')
    process.exit(1)
  }

  // Convert to raw URL if needed
  let rawUrl = gistUrl
  if (!rawUrl.endsWith('/raw')) {
    if (rawUrl.includes('gist.github.com')) {
      rawUrl = rawUrl.replace('gist.github.com', 'gist.githubusercontent.com')
      rawUrl = rawUrl.replace(/\/(\w+)$/, '/$1/raw')
    } else if (rawUrl.includes('gist.githubusercontent.com') && !rawUrl.endsWith('/raw')) {
      rawUrl += '/raw'
    }
  }

  console.log(`Fetching bundle from: ${rawUrl}`)
  console.log()

  // Fetch with Node 18 fetch
  fetch(rawUrl)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    })
    .then(bundle => {
      // Validate bundle
      if (!bundle.claudient) {
        throw new Error('Invalid bundle: missing claudient version field')
      }
      if (!Array.isArray(bundle.skills)) {
        throw new Error('Invalid bundle: skills must be an array')
      }

      console.log(`✓ Bundle loaded (claudient ${bundle.claudient})`)
      if (bundle.description) console.log(`  ${bundle.description}`)
      console.log()

      // Import each skill category
      if (bundle.skills.length === 0) {
        console.log('No skills to import.')
        return
      }

      console.log(`Installing ${bundle.skills.length} skill categories...\n`)
      for (const category of bundle.skills) {
        addSkills(category, null)
      }

      console.log()
      console.log('━'.repeat(60))
      console.log(`✅ Imported ${bundle.skills.length} skill categories from shared bundle`)
      console.log('━'.repeat(60))
      console.log()
      console.log('Restart Claude Code to activate all imported skills.')
      console.log()
    })
    .catch(err => {
      console.error(`Error importing bundle: ${err.message}`)
      process.exit(1)
    })
}

function benchmarkCommand(skillId) {
  const benchmarksPath = path.join(REPO_ROOT, 'benchmarks', 'results.json')
  if (!fs.existsSync(benchmarksPath)) {
    console.error('Error: benchmarks/results.json not found.')
    process.exit(1)
  }

  let data
  try {
    data = JSON.parse(fs.readFileSync(benchmarksPath, 'utf-8'))
  } catch (err) {
    console.error('Error parsing benchmarks/results.json:', err.message)
    process.exit(1)
  }

  const gradeEmoji = (grade) => {
    switch (grade) {
      case 'A': return '✅ A'
      case 'B': return '🟦 B'
      case 'C': return '🟨 C'
      case 'F': return '❌ F'
      default: return grade
    }
  }

  if (!skillId) {
    // Show top 10 skills by eval score
    console.log()
    console.log('🏆 Top 10 Skills by Eval Score')
    console.log('━'.repeat(70))
    console.log()

    const sorted = [...data.results].sort((a, b) => b.score - a.score).slice(0, 10)

    sorted.forEach((skill, i) => {
      const score = Math.round(skill.score * 100)
      const grade = gradeEmoji(skill.grade)
      const tests = `${skill.tests_passed}/${skill.tests_run}`
      console.log(`${i + 1}. ${skill.title} (${skill.category}) — ${score}% | ${grade} | Tests`)
    })

    console.log()
    console.log(`Run: npx claudient benchmark <skill-id>  for details`)
    console.log()
  } else {
    // Show detail card for a specific skill
    const skill = data.results.find(s => s.id === skillId)

    if (!skill) {
      console.log()
      console.log(`⚠️  Not yet benchmarked: "${skillId}"`)
      console.log()
      console.log('Run: npm run benchmark')
      console.log()
      return
    }

    console.log()
    console.log('━'.repeat(70))
    console.log(`📊 ${skill.title}`)
    console.log('━'.repeat(70))
    console.log()
    console.log(`ID:          ${skill.id}`)
    console.log(`Category:    ${skill.category}`)
    console.log(`Score:       ${Math.round(skill.score * 100)}%`)
    console.log(`Grade:       ${gradeEmoji(skill.grade)}`)
    console.log(`Tests:       ${skill.tests_passed}/${skill.tests_run} passed`)
    console.log(`Last tested: ${skill.last_tested}`)
    if (skill.notes) {
      console.log(`Notes:       ${skill.notes}`)
    }
    console.log()
  }
}

// ── Enterprise Lead-Gen Commands ──────────────────────────────────────────────

function writeReport(filename, content) {
  const filepath = path.join(process.cwd(), filename)
  fs.writeFileSync(filepath, content, 'utf-8')
  console.log(`📄 Report saved to ./${filename}`)
}

function writeHtmlReport(filename, title, date, score, percentage, results) {
  const filepath = path.join(process.cwd(), filename)
  
  let rowsHtml = ''
  for (const r of results) {
    const statusColor = r.status.includes('PASS') ? '#10b981' : r.status.includes('WARN') ? '#f59e0b' : '#ef4444';
    const statusBg = r.status.includes('PASS') ? '#ecfdf5' : r.status.includes('WARN') ? '#fffbeb' : '#fef2f2';
    
    rowsHtml += `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px 16px; font-weight: 600; color: #1f2937;">${r.dim}</td>
        <td style="padding: 12px 16px;">
          <span style="display: inline-block; padding: 4px 10px; font-size: 11px; font-weight: 700; border-radius: 9999px; background: ${statusBg}; color: ${statusColor};">
            ${r.status}
          </span>
        </td>
        <td style="padding: 12px 16px; font-weight: 500; color: #4b5563;">${r.score}/20</td>
        <td style="padding: 12px 16px; color: #4b5563; font-size: 13px;">${r.finding}</td>
      </tr>
    `
  }

  let recsHtml = ''
  for (const r of results) {
    if (r.status.includes('FAIL') || r.status.includes('WARN')) {
      let rec = ''
      switch (r.dim) {
        case 'Skills Coverage': rec = 'Install more skill categories: <code>npx claudient add skills all</code>'; break;
        case 'Agent Configuration': rec = 'Deploy agents: <code>npx claudient add agents</code>'; break;
        case 'Hook Security': rec = 'Review and install hooks: <code>npx claudient add hooks</code>'; break;
        case 'CLAUDE.md Governance': rec = 'Create CLAUDE.md: <code>npx claudient init</code> or <code>add rules --write</code>'; break;
        case 'Rules Compliance': rec = 'Add rules to CLAUDE.md: <code>npx claudient add rules --write</code>'; break;
        case 'Freshness': rec = 'Update stale skills: <code>npx claudient update</code>'; break;
        case 'Permission Scope': rec = 'Review ~/.claude/settings.json for overly broad permissions'; break;
        case 'Benchmark Coverage': rec = 'Run benchmarks: <code>npm run benchmark</code>'; break;
      }
      if (rec) {
        recsHtml += `
          <div style="display: flex; gap: 8px; align-items: start; margin-bottom: 10px; padding: 10px 14px; border-left: 4px solid #f59e0b; background: #fffbeb; border-radius: 4px; font-size: 13px; color: #78350f;">
            <span style="font-weight: bold; margin-right: 4px;">→</span>
            <span>${rec}</span>
          </div>
        `
      }
    }
  }

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #eeefe9;
      color: #2d2d2d;
      margin: 0;
      padding: 40px 20px;
      line-height: 1.5;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
      border: 1px solid #d0d1c9;
      overflow: hidden;
    }
    .header {
      padding: 32px 40px;
      background: #151515;
      color: #ffffff;
      border-bottom: 4px solid #f5b800;
    }
    .header h1 {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .header .meta {
      font-size: 13px;
      color: #a3a489;
      margin: 0;
    }
    .content {
      padding: 32px 40px;
    }
    .score-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: #f7f7f3;
      border: 1px solid #e5e7df;
      border-radius: 8px;
      margin-bottom: 32px;
    }
    .score-title {
      font-size: 14px;
      font-weight: 700;
      color: #76786c;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .score-value {
      font-size: 28px;
      font-weight: 800;
      color: #151515;
    }
    .score-pct {
      font-size: 14px;
      color: #a3a489;
      font-weight: 500;
    }
    .table-wrapper {
      overflow-x: auto;
      margin-bottom: 32px;
      border: 1px solid #e5e7df;
      border-radius: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 14px;
    }
    th {
      background: #f7f7f3;
      padding: 12px 16px;
      font-weight: 700;
      color: #76786c;
      border-bottom: 1px solid #e5e7df;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.5px;
    }
    .section-title {
      font-size: 16px;
      font-weight: 800;
      color: #151515;
      margin: 0 0 16px 0;
      border-bottom: 2px solid #eeefe9;
      padding-bottom: 8px;
    }
    .recs-list {
      margin-bottom: 32px;
    }
    .enterprise-box {
      padding: 24px;
      border: 1px dashed #b62ad9;
      background: rgba(182, 42, 217, 0.04);
      border-radius: 8px;
      color: #2d2d2d;
    }
    .enterprise-title {
      font-weight: bold;
      color: #b62ad9;
      font-size: 14px;
      margin-bottom: 8px;
    }
    code {
      font-family: monospace;
      background: #f3f4f6;
      padding: 2px 4px;
      border-radius: 4px;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${title}</h1>
      <p class="meta">Target Project: <code>${process.cwd()}</code> &bull; Audited on ${date}</p>
    </div>
    <div class="content">
      <div class="score-banner">
        <div>
          <div class="score-title">Audit Score</div>
          <div class="score-value">${score} <span style="font-size:18px; font-weight:normal; color:#999;">/ 160</span></div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 28px; font-weight: 800; color: #f5b800;">${percentage}%</div>
          <div class="score-pct">Status: Compliance Rating</div>
        </div>
      </div>

      <h2 class="section-title">Audit Dimensions</h2>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Dimension</th>
              <th>Status</th>
              <th>Score</th>
              <th>Findings</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>

      ${recsHtml ? `
      <h2 class="section-title">Compliance Recommendations</h2>
      <div class="recs-list">
        ${recsHtml}
      </div>
      ` : ''}

      <div class="enterprise-box">
        <div class="enterprise-title">🏢 Need a formal SOC2 / GDPR Governance Audit?</div>
        <div style="font-size: 13px; line-height: 1.6;">
          Claudient Enterprise provides regulatory-compliant workspace stack validation hooks, centralized permission controls, SSO, and audit-trail logging.<br>
          <a href="https://claudient.ai/enterprise" style="color: #b62ad9; font-weight: bold; text-decoration: underline;">Book a governance demo</a> &bull; Contact: <strong>enterprise@claudient.ai</strong>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `
  
  fs.writeFileSync(filepath, htmlContent, 'utf-8')
  console.log(`📄 Compliance Report saved to ./${filename}`)
}

function auditCommand() {
  if (!fs.existsSync(CLAUDE_DIR)) {
    console.error(`Error: ~/.claude directory not found. Claude Code must be installed.`)
    process.exit(1)
  }

  const date = new Date().toISOString().split('T')[0]
  const results = []
  let totalScore = 0

  // 1. Skills Coverage (count categories, not individual skills)
  const skillsDir = path.join(CLAUDE_DIR, 'skills')
  let skillsScore = 0
  let skillCategories = 0
  let skillCount = 0

  if (fs.existsSync(skillsDir)) {
    for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        skillCategories++
        const files = getFiles(path.join(skillsDir, entry.name))
        skillCount += files.length
      }
    }
  }

  let skillsStatus = '❌ FAIL'
  if (skillCount === 0) {
    skillsScore = 0
    results.push({ dim: 'Skills Coverage', status: skillsStatus, score: skillsScore, finding: 'No skills installed' })
  } else if (skillCategories <= 3) {
    skillsScore = 10
    skillsStatus = '⚠️ WARN'
    results.push({ dim: 'Skills Coverage', status: skillsStatus, score: skillsScore, finding: `${skillCount} skills across ${skillCategories} categories` })
  } else {
    skillsScore = 20
    skillsStatus = '✅ PASS'
    results.push({ dim: 'Skills Coverage', status: skillsStatus, score: skillsScore, finding: `${skillCount} skills across ${skillCategories} categories` })
  }
  totalScore += skillsScore

  // 2. Agent Configuration
  const agentsDir = path.join(CLAUDE_DIR, 'agents')
  let agentsScore = 0
  let agentCount = 0

  if (fs.existsSync(agentsDir)) {
    agentCount = getFiles(agentsDir).length
  }

  let agentsStatus = '❌ FAIL'
  if (agentCount === 0) {
    agentsScore = 0
    results.push({ dim: 'Agent Configuration', status: agentsStatus, score: agentsScore, finding: 'No agents deployed' })
  } else if (agentCount <= 5) {
    agentsScore = 10
    agentsStatus = '⚠️ WARN'
    results.push({ dim: 'Agent Configuration', status: agentsStatus, score: agentsScore, finding: `${agentCount} agents deployed` })
  } else {
    agentsScore = 20
    agentsStatus = '✅ PASS'
    results.push({ dim: 'Agent Configuration', status: agentsStatus, score: agentsScore, finding: `${agentCount} agents deployed` })
  }
  totalScore += agentsScore

  // 3. Hook Security
  const hooksDir = path.join(CLAUDE_DIR, 'hooks')
  let hooksScore = 0
  let hookCount = 0
  let hasRiskyPatterns = false

  if (fs.existsSync(hooksDir)) {
    for (const entry of fs.readdirSync(hooksDir, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.sh')) {
        hookCount++
        const content = fs.readFileSync(path.join(hooksDir, entry.name), 'utf-8')
        if (/curl|rm\s+-rf|sudo|eval/.test(content)) {
          hasRiskyPatterns = true
        }
      }
    }
  }

  let hooksStatus = '❌ FAIL'
  if (hookCount === 0) {
    hooksScore = 0
    hooksStatus = '⚠️ WARN'
    results.push({ dim: 'Hook Security', status: hooksStatus, score: hooksScore, finding: 'No hooks installed' })
  } else if (hookCount <= 2) {
    hooksScore = 10
    hooksStatus = '⚠️ WARN'
    results.push({ dim: 'Hook Security', status: hooksStatus, score: hooksScore, finding: `${hookCount} hook(s)${hasRiskyPatterns ? ' with risky patterns' : ''}` })
  } else {
    hooksScore = 20
    if (hasRiskyPatterns) {
      hooksScore = 15
      hooksStatus = '⚠️ WARN'
    } else {
      hooksStatus = '✅ PASS'
    }
    results.push({ dim: 'Hook Security', status: hooksStatus, score: hooksScore, finding: `${hookCount} hook(s)${hasRiskyPatterns ? ' (risky patterns detected)' : ''}` })
  }
  totalScore += hooksScore

  // 4. CLAUDE.md Governance
  const claudeMdPath = fs.existsSync('CLAUDE.md') ? 'CLAUDE.md' : path.join(CLAUDE_DIR, 'CLAUDE.md')
  let claudeScore = 0
  let claudeFinding = 'No CLAUDE.md found'
  let claudeStatus = '❌ FAIL'

  if (fs.existsSync(claudeMdPath)) {
    const content = fs.readFileSync(claudeMdPath, 'utf-8')
    const sectionCount = (content.match(/^##\s+/gm) || []).length
    claudeScore = 20
    claudeFinding = `CLAUDE.md with ${sectionCount} sections`
    claudeStatus = '✅ PASS'
    results.push({ dim: 'CLAUDE.md Governance', status: claudeStatus, score: claudeScore, finding: claudeFinding })
  } else {
    results.push({ dim: 'CLAUDE.md Governance', status: claudeStatus, score: claudeScore, finding: claudeFinding })
  }
  totalScore += claudeScore

  // 5. Rules Compliance
  const rulesDir = path.join(CLAUDE_DIR, 'rules')
  let rulesScore = 0
  let ruleCount = 0

  if (fs.existsSync(rulesDir)) {
    ruleCount = getFiles(rulesDir).length
  }

  let rulesStatus = '❌ FAIL'
  if (ruleCount === 0) {
    rulesScore = 0
    results.push({ dim: 'Rules Compliance', status: rulesStatus, score: rulesScore, finding: 'No rules configured' })
  } else if (ruleCount <= 4) {
    rulesScore = 10
    rulesStatus = '⚠️ WARN'
    results.push({ dim: 'Rules Compliance', status: rulesStatus, score: rulesScore, finding: `${ruleCount} rule(s) configured` })
  } else {
    rulesScore = 20
    rulesStatus = '✅ PASS'
    results.push({ dim: 'Rules Compliance', status: rulesStatus, score: rulesScore, finding: `${ruleCount} rule(s) configured` })
  }
  totalScore += rulesScore

  // 6. Freshness
  let freshnessScore = 20
  let staleCount = 0
  let totalFiles = 0

  if (fs.existsSync(skillsDir)) {
    const now = Date.now()
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000
    const files = getFiles(skillsDir)
    totalFiles = files.length

    for (const file of files) {
      const fullPath = path.join(skillsDir, file)
      const stat = fs.statSync(fullPath)
      if (now - stat.mtimeMs > thirtyDaysMs) {
        staleCount++
      }
    }
  }

  let freshnessStatus = '✅ PASS'
  let freshnessFinding = 'All current'

  if (totalFiles > 0 && staleCount / totalFiles > 0.5) {
    freshnessScore = 0
    freshnessStatus = '❌ FAIL'
    freshnessFinding = `${staleCount}/${totalFiles} files stale (>30 days)`
  } else if (staleCount > 0) {
    freshnessScore = 10
    freshnessStatus = '⚠️ WARN'
    freshnessFinding = `${staleCount}/${totalFiles} files stale`
  }

  results.push({ dim: 'Freshness', status: freshnessStatus, score: freshnessScore, finding: freshnessFinding })
  totalScore += freshnessScore

  // 7. Permission Scope
  let permScore = 20
  let permFinding = 'Permission scope OK'
  let permStatus = '✅ PASS'

  const settingsPath = path.join(CLAUDE_DIR, 'settings.json')
  if (fs.existsSync(settingsPath)) {
    try {
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'))
      if (settings.allow && (settings.allow.includes('bash:*') || settings.allow.includes('*'))) {
        permScore = 0
        permFinding = 'Overly broad permissions detected'
        permStatus = '❌ FAIL'
      }
    } catch {}
  }

  results.push({ dim: 'Permission Scope', status: permStatus, score: permScore, finding: permFinding })
  totalScore += permScore

  // 8. Benchmark Coverage
  const benchmarksPath = path.join(REPO_ROOT, 'benchmarks', 'results.json')
  let benchScore = 0
  let benchFinding = 'No benchmark data'
  let benchStatus = '❌ FAIL'

  if (fs.existsSync(benchmarksPath) && skillCount > 0) {
    try {
      const benchData = JSON.parse(fs.readFileSync(benchmarksPath, 'utf-8'))
      const benchedCount = benchData.results ? benchData.results.length : 0
      const percentage = Math.round((benchedCount / skillCount) * 100)

      if (percentage === 0) {
        benchScore = 0
        benchFinding = '0% of skills benchmarked'
        benchStatus = '❌ FAIL'
      } else if (percentage <= 10) {
        benchScore = 5
        benchFinding = `${percentage}% of skills benchmarked`
        benchStatus = '⚠️ WARN'
      } else if (percentage <= 50) {
        benchScore = 10
        benchFinding = `${percentage}% of skills benchmarked`
        benchStatus = '⚠️ WARN'
      } else {
        benchScore = 20
        benchFinding = `${percentage}% of skills benchmarked`
        benchStatus = '✅ PASS'
      }
    } catch {}
  } else if (skillCount === 0) {
    benchFinding = 'No skills to benchmark'
  }

  results.push({ dim: 'Benchmark Coverage', status: benchStatus, score: benchScore, finding: benchFinding })
  totalScore += benchScore

  // Generate output
  const percentage = Math.round((totalScore / 160) * 100)

  let output = `🔍 Claude Code Compliance Audit\n`
  output += `${'━'.repeat(50)}\n`
  output += `Project: ${process.cwd()}\n`
  output += `Date:    ${date}\n\n`
  output += `DIMENSION              STATUS    SCORE    FINDING\n`

  for (const r of results) {
    const dimPad = r.dim.padEnd(22)
    const statusPad = r.status.padEnd(9)
    const scorePad = `${r.score}/20`.padEnd(8)
    output += `${dimPad} ${statusPad} ${scorePad} ${r.finding}\n`
  }

  output += `\n${'━'.repeat(50)}\n`
  output += `Audit Score: ${totalScore}/160 (${percentage}%)\n\n`

  output += `Recommendations:\n`
  for (const r of results) {
    if (r.status.includes('FAIL') || r.status.includes('WARN')) {
      let rec = ''
      switch (r.dim) {
        case 'Skills Coverage':
          rec = 'Install more skill categories: npx claudient add skills all'
          break
        case 'Agent Configuration':
          rec = 'Deploy agents: npx claudient add agents'
          break
        case 'Hook Security':
          rec = 'Review and install hooks: npx claudient add hooks'
          break
        case 'CLAUDE.md Governance':
          rec = 'Create CLAUDE.md: npx claudient init or add rules --write'
          break
        case 'Rules Compliance':
          rec = 'Add rules to CLAUDE.md: npx claudient add rules --write'
          break
        case 'Freshness':
          rec = 'Update stale skills: npx claudient update'
          break
        case 'Permission Scope':
          rec = 'Review ~/.claude/settings.json for overly broad permissions'
          break
        case 'Benchmark Coverage':
          rec = 'Run: npm run benchmark (in repo context)'
          break
      }
      if (rec) output += `  → ${rec}\n`
    }
  }

  output += `\n${'─'.repeat(65)}\n`
  output += `🏢 Need a full governance audit with remediation support?\n`
  output += `   Claudient Enterprise includes:\n`
  output += `   • SOC2 / GDPR / EU-AI-Act compliance stacks\n`
  output += `   • Audit trail hooks with SSO integration\n`
  output += `   • Dedicated stack engineer\n`
  output += `   → Book a demo: https://claudient.ai/enterprise\n`
  output += `   → Email: enterprise@claudient.ai\n`
  output += `${'─'.repeat(65)}\n`

  writeReport('claudient-audit-report.md', output)
  writeHtmlReport('claudient-audit-report.html', 'Claude Code Compliance Audit', date, totalScore, percentage, results)
}

function scoreCommand() {
  if (!fs.existsSync(CLAUDE_DIR)) {
    console.error(`Error: ~/.claude directory not found. Claude Code must be installed.`)
    process.exit(1)
  }

  const scores = []
  let totalScore = 0

  // 1. Skills Installed (0-12.5)
  const skillsDir = path.join(CLAUDE_DIR, 'skills')
  let skillsScore = 0
  let skillCategories = 0

  if (fs.existsSync(skillsDir)) {
    for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
      if (entry.isDirectory()) skillCategories++
    }
  }

  if (skillCategories === 0) {
    skillsScore = 0
  } else if (skillCategories <= 3) {
    skillsScore = 6.25
  } else {
    skillsScore = 12.5
  }
  scores.push({ dim: 'Skills Installed', score: skillsScore, level: skillCategories === 0 ? 'None' : skillCategories <= 3 ? `${skillCategories} categories` : `${skillCategories}+ categories` })
  totalScore += skillsScore

  // 2. Agents Deployed (0-12.5)
  const agentsDir = path.join(CLAUDE_DIR, 'agents')
  let agentCount = 0
  if (fs.existsSync(agentsDir)) {
    agentCount = getFiles(agentsDir).length
  }

  let agentsScore = 0
  if (agentCount === 0) {
    agentsScore = 0
  } else if (agentCount <= 5) {
    agentsScore = 6.25
  } else {
    agentsScore = 12.5
  }
  scores.push({ dim: 'Agents Deployed', score: agentsScore, level: agentCount === 0 ? 'None' : agentCount <= 5 ? `${agentCount} agents` : `${agentCount}+ agents` })
  totalScore += agentsScore

  // 3. Hooks Active (0-12.5)
  const hooksDir = path.join(CLAUDE_DIR, 'hooks')
  let hookCount = 0
  if (fs.existsSync(hooksDir)) {
    for (const entry of fs.readdirSync(hooksDir, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.sh')) hookCount++
    }
  }

  let hooksScore = 0
  if (hookCount === 0) {
    hooksScore = 0
  } else if (hookCount <= 2) {
    hooksScore = 6.25
  } else {
    hooksScore = 12.5
  }
  scores.push({ dim: 'Hooks Active', score: hooksScore, level: hookCount === 0 ? 'None' : hookCount <= 2 ? `${hookCount} hooks` : `${hookCount}+ hooks` })
  totalScore += hooksScore

  // 4. Rules Configured (0-12.5)
  const rulesDir = path.join(CLAUDE_DIR, 'rules')
  let ruleCount = 0
  if (fs.existsSync(rulesDir)) {
    ruleCount = getFiles(rulesDir).length
  }

  let rulesScore = 0
  if (ruleCount === 0) {
    rulesScore = 0
  } else if (ruleCount <= 4) {
    rulesScore = 6.25
  } else {
    rulesScore = 12.5
  }
  scores.push({ dim: 'Rules Configured', score: rulesScore, level: ruleCount === 0 ? 'None' : ruleCount <= 4 ? `${ruleCount} rules` : `${ruleCount}+ rules` })
  totalScore += rulesScore

  // 5. CLAUDE.md Quality (0-12.5)
  const claudeMdPath = fs.existsSync('CLAUDE.md') ? 'CLAUDE.md' : path.join(CLAUDE_DIR, 'CLAUDE.md')
  let claudeScore = 0
  let claudeLevel = 'Missing'

  if (fs.existsSync(claudeMdPath)) {
    const content = fs.readFileSync(claudeMdPath, 'utf-8')
    if (content.length < 200) {
      claudeScore = 6.25
      claudeLevel = 'Basic'
    } else {
      claudeScore = 12.5
      claudeLevel = 'Substantial'
    }
  }

  scores.push({ dim: 'CLAUDE.md Quality', score: claudeScore, level: claudeLevel })
  totalScore += claudeScore

  // 6. Freshness (0-12.5)
  let freshnessScore = 12.5
  let freshnessLevel = 'All current'

  if (fs.existsSync(skillsDir)) {
    const now = Date.now()
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000
    const files = getFiles(skillsDir)
    let staleCount = 0

    for (const file of files) {
      const fullPath = path.join(skillsDir, file)
      const stat = fs.statSync(fullPath)
      if (now - stat.mtimeMs > thirtyDaysMs) staleCount++
    }

    if (files.length > 0 && staleCount / files.length > 0.5) {
      freshnessScore = 0
      freshnessLevel = 'Stale'
    } else if (staleCount > 0) {
      freshnessScore = 6.25
      freshnessLevel = 'Some stale'
    }
  }

  scores.push({ dim: 'Freshness', score: freshnessScore, level: freshnessLevel })
  totalScore += freshnessScore

  // 7. Benchmark Coverage (0-12.5)
  const benchmarksPath = path.join(REPO_ROOT, 'benchmarks', 'results.json')
  let benchScore = 0
  let benchLevel = 'None'

  if (fs.existsSync(benchmarksPath)) {
    try {
      const benchData = JSON.parse(fs.readFileSync(benchmarksPath, 'utf-8'))
      const benchedCount = benchData.results ? benchData.results.length : 0
      if (benchedCount === 0) {
        benchScore = 0
      } else if (benchedCount < 10) {
        benchScore = 6.25
        benchLevel = `${benchedCount} benchmarked`
      } else {
        benchScore = 12.5
        benchLevel = `${benchedCount}+ benchmarked`
      }
    } catch {}
  }

  scores.push({ dim: 'Benchmark Coverage', score: benchScore, level: benchLevel })
  totalScore += benchScore

  // 8. Multi-language (0-12.5)
  let langScore = 0
  let langCount = 0
  let langLevel = 'EN only'

  // Check for language subdirectories in skills or other sections
  if (fs.existsSync(skillsDir)) {
    const entries = fs.readdirSync(skillsDir, { withFileTypes: true })
    const langDirs = entries.filter(e => e.isDirectory() && SUPPORTED_LANGS.includes(e.name))
    langCount = langDirs.length
  }

  if (langCount === 0) {
    langScore = 0
    langLevel = 'EN only'
  } else if (langCount === 1) {
    langScore = 6.25
    langLevel = '1 extra language'
  } else {
    langScore = 12.5
    langLevel = `${langCount} languages`
  }

  scores.push({ dim: 'Multi-language', score: langScore, level: langLevel })
  totalScore += langScore

  // Calculate tier
  let tier, tierEmoji
  if (totalScore <= 25) {
    tier = 'Beginner'
    tierEmoji = '🥉'
  } else if (totalScore <= 50) {
    tier = 'Intermediate'
    tierEmoji = '🥈'
  } else if (totalScore <= 75) {
    tier = 'Advanced'
    tierEmoji = '🥈'
  } else {
    tier = 'Expert'
    tierEmoji = '🏆'
  }

  // Determine next tier
  let nextTier = null
  let nextThreshold = null
  if (totalScore < 25) {
    nextTier = 'Intermediate'
    nextThreshold = 26
  } else if (totalScore < 50) {
    nextTier = 'Advanced'
    nextThreshold = 51
  } else if (totalScore < 75) {
    nextTier = 'Expert'
    nextThreshold = 76
  }

  // Generate output
  let output = `🎯 AI-Readiness Score\n`
  output += `${'━'.repeat(50)}\n\n`
  output += `DIMENSION             SCORE   LEVEL\n`

  for (const s of scores) {
    const dimPad = s.dim.padEnd(21)
    const scorePad = s.score.toFixed(1).padEnd(7)
    const barCount = Math.round((s.score / 12.5) * 12)
    const bar = '█'.repeat(barCount) + '░'.repeat(12 - barCount)
    output += `${dimPad} ${scorePad} ${bar} ${s.level}\n`
  }

  output += `\n${'━'.repeat(50)}\n`
  output += `Total: ${totalScore.toFixed(1)}/100 — ${tier} ${tierEmoji}\n\n`

  if (nextTier) {
    output += `Next steps to reach ${nextTier}:\n`
    const gap = nextThreshold - totalScore
    const recs = []

    for (const s of scores) {
      if (s.score < 12.5) {
        switch (s.dim) {
          case 'Skills Installed':
            if (s.score < 12.5) recs.push(`Install additional skill categories: npx claudient add skills`)
            break
          case 'Agents Deployed':
            if (s.score < 12.5) recs.push(`Deploy 6+ agents: npx claudient add agents`)
            break
          case 'Hooks Active':
            if (s.score < 12.5) recs.push(`Install 3+ hooks: npx claudient add hooks`)
            break
          case 'Rules Configured':
            if (s.score < 12.5) recs.push(`Add 5+ rules: npx claudient add rules --write`)
            break
          case 'CLAUDE.md Quality':
            if (s.score < 12.5) recs.push(`Expand CLAUDE.md with substantial content`)
            break
          case 'Freshness':
            if (s.score < 12.5) recs.push(`Update stale skills: npx claudient update`)
            break
          case 'Benchmark Coverage':
            if (s.score < 12.5) recs.push(`Benchmark 10+ skills: npm run benchmark`)
            break
          case 'Multi-language':
            if (s.score < 12.5) recs.push(`Add translations for 2+ languages`)
            break
        }
      }
    }

    // Show only top recommendations
    for (let i = 0; i < Math.min(3, recs.length); i++) {
      output += `  → ${recs[i]}\n`
    }
  } else {
    output += `Expert tier reached! Continue advancing your setup.\n`
  }

  console.log(output)
  writeReport('claudient-score-report.md', output)
}

async function initEnterpriseCommand() {
  const readline = require('readline')
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const ask = (q) => new Promise(resolve => rl.question(q, resolve))

  const BOLD  = '\x1b[1m'
  const ORANGE = '\x1b[33m'
  const GREEN = '\x1b[32m'
  const BLUE = '\x1b[34m'
  const DIM   = '\x1b[2m'
  const RESET = '\x1b[0m'

  console.log(`
${BOLD}╔══════════════════════════════════════════════════════════╗
║         CLAUDIENT ENTERPRISE SETUP                         ║
║   Configure governance, compliance, and team-scale features ║
╚══════════════════════════════════════════════════════════════╝${RESET}
`)

  // Check Claude Code installed
  if (!fs.existsSync(CLAUDE_DIR)) {
    console.error(`${ORANGE}⚠ ~/.claude not found.${RESET}`)
    console.error(`  Claude Code must be installed first: https://claude.ai/code\n`)
    rl.close()
    process.exit(1)
  }
  console.log(`${GREEN}✓ Claude Code detected at ${CLAUDE_DIR}${RESET}\n`)

  // 1. Team Size
  console.log(`${BOLD}Step 1/4 — Team Size${RESET}`)
  console.log('  1. Small team (5–25 seats)')
  console.log('  2. Medium org (25–100 seats)')
  console.log('  3. Large enterprise (100+ seats)')
  const sizeInput = (await ask('  Select: ')).trim()
  const sizeMap = { '1': 'small', '2': 'medium', '3': 'large' }
  const teamSize = sizeMap[sizeInput] || 'medium'
  console.log(`  → ${teamSize}\n`)

  // 2. Compliance Requirements
  console.log(`${BOLD}Step 2/4 — Compliance${RESET}`)
  console.log('  1. SOC2 Type II (Logictech, Healthcare)')
  console.log('  2. GDPR (Europe)')
  console.log('  3. EU-AI-Act (EU regulated)')
  console.log('  4. Custom (other)')
  console.log('  5. None (proceed without compliance stack)')
  const compInput = (await ask('  Select: ')).trim()
  const compMap = { '1': 'soc2', '2': 'gdpr', '3': 'eu_ai_act', '4': 'custom' }
  const compliance = compMap[compInput] || null
  if (compliance) console.log(`  → ${compliance}\n`)
  else console.log(`  → Skipping compliance stack\n`)

  // 3. Enterprise Features
  console.log(`${BOLD}Step 3/4 — Enterprise Features${RESET}`)
  const auditInput = (await ask('  Enable audit logging? [Y/n] ')).trim().toLowerCase()
  const auditLogging = auditInput !== 'n'
  const ssoInput = (await ask('  Enable SSO/RBAC? [Y/n] ')).trim().toLowerCase()
  const ssorbac = ssoInput !== 'n'
  console.log(`  → Audit logging: ${auditLogging ? 'Yes' : 'No'}`)
  console.log(`  → SSO/RBAC: ${ssorbac ? 'Yes' : 'No'}\n`)

  // 4. Contact for onboarding
  console.log(`${BOLD}Step 4/4 — Sales Engagement${RESET}`)
  const emailInput = (await ask('  Email for onboarding support: ')).trim()
  console.log(`  → ${emailInput || 'skipped'}\n`)

  rl.close()

  // Install compliance stack if selected
  if (compliance && compliance !== 'custom') {
    console.log(`${BLUE}Installing ${compliance.toUpperCase()} compliance stack...${RESET}`)
    const stackPath = path.join(REPO_ROOT, 'enterprise', 'compliance_stacks', compliance)
    if (fs.existsSync(stackPath)) {
      try {
        execSync(`cd "${process.cwd()}" && npx claudient add stack ${stackPath}`, { stdio: 'inherit' })
        console.log(`${GREEN}✓ Compliance stack installed${RESET}\n`)
      } catch (e) {
        console.error(`${ORANGE}⚠ Could not auto-install stack. Run manually:${RESET}`)
        console.error(`  npx claudient add stack ${stackPath}\n`)
      }
    }
  }

  // Final summary and CTA
  console.log(`${BOLD}═══════════════════════════════════════════════════════════${RESET}`)
  console.log(`${GREEN}✓ Enterprise setup complete!${RESET}`)
  console.log(`
Your next steps:
  1. Run ${BLUE}npx claudient doctor${RESET} to verify setup
  2. Run ${BLUE}npx claudient audit${RESET} to check compliance status
  3. Review ${BLUE}enterprise/PRICING.md${RESET} for tier benefits

${BOLD}Ready to scale?${RESET}
  ${BLUE}https://claudient.ai/enterprise${RESET}
  ${BLUE}enterprise@claudient.ai${RESET}

We'll help you:
  → Configure governance hooks and audit trails
  → Set up team-scale RBAC and SSO
  → Map your compliance to controls (SOC2/GDPR/EU-AI-Act)
  → Train your team on enterprise features
  ${DIM}(Enterprise tier includes dedicated stack engineer + SLA)${RESET}
`)

  if (emailInput) {
    console.log(`${DIM}✓ Email logged for outreach. Expect contact within 24h.${RESET}\n`)
  }
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
      case 'statusline': addStatusline(arg2); break
      case 'structure': addStructure(arg2); break
      case 'stack': addStack(arg2); break
      case 'all':
        addSkills(null, lang)
        addAgents()
        addHooks()
        break
      case undefined:
        console.error('Usage: claudient add <skills|agents|rules|hooks|statusline|all>')
        process.exit(1)
        break
      default:
        // Backward compat: claudient add backend (old syntax)
        if (SKILL_CATEGORIES.includes(type)) {
          addSkills(type, lang)
        } else {
          console.error(`Unknown type: "${type}". Use: skills, agents, rules, hooks, statusline, all`)
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
    if (flags.enterprise) {
      initEnterpriseCommand().catch(err => { console.error(err); process.exit(1) })
    } else {
      initCommand().catch(err => { console.error(err); process.exit(1) })
    }
    break
  case 'recommend':
  case 'scan':
    recommend(positional[0] || '.')
    break
  case 'doctor':
    doctorCommand()
    break
  case 'consult': {
    const need = positional.join(' ')
    consultCommand(need)
    break
  }
  case 'benchmark': {
    const skillId = positional[0] || null
    benchmarkCommand(skillId)
    break
  }
  case 'audit':
    auditCommand()
    break
  case 'export': {
    const harness = positional[0]
    exportCommand(harness)
    break
  }
  case 'council': {
    const domain = positional[0]
    try {
      execSync(`node "${path.join(__dirname, 'council.js')}" "${domain || ''}"`, { stdio: 'inherit' })
    } catch {
      process.exit(1)
    }
    break
  }
  case 'chart':
  case 'map': {
    try {
      execSync(`node "${path.join(__dirname, 'chart.js')}"`, { stdio: 'inherit' })
    } catch {
      process.exit(1)
    }
    break
  }
  case 'spec': {
    try {
      execSync(`node "${path.join(__dirname, 'spec.js')}"`, { stdio: 'inherit' })
    } catch {
      process.exit(1)
    }
    break
  }
  case 'repair': {
    try {
      execSync(`node "${path.join(__dirname, 'repair.js')}"`, { stdio: 'inherit' })
    } catch {
      process.exit(1)
    }
    break
  }
  case 'tribunal': {
    const { spawnSync } = require('child_process')
    const res = spawnSync('node', [path.join(__dirname, 'tribunal.js'), ...process.argv.slice(3)], { stdio: 'inherit' })
    if (res.status !== 0) process.exit(res.status || 1)
    break
  }
  case 'bisect': {
    const { spawnSync } = require('child_process')
    const res = spawnSync('node', [path.join(__dirname, 'bisect.js'), ...process.argv.slice(3)], { stdio: 'inherit' })
    if (res.status !== 0) process.exit(res.status || 1)
    break
  }
  case 'oracle': {
    const { spawnSync } = require('child_process')
    const res = spawnSync('node', [path.join(__dirname, 'oracle.js'), ...process.argv.slice(3)], { stdio: 'inherit' })
    if (res.status !== 0) process.exit(res.status || 1)
    break
  }
  case 'nightshift': {
    const { spawnSync } = require('child_process')
    const res = spawnSync('node', [path.join(__dirname, 'nightshift.js'), ...process.argv.slice(3)], { stdio: 'inherit' })
    if (res.status !== 0) process.exit(res.status || 1)
    break
  }
  case 'caveman': {
    const { spawnSync } = require('child_process')
    const res = spawnSync('node', [path.join(__dirname, 'caveman.js'), ...process.argv.slice(3)], { stdio: 'inherit' })
    if (res.status !== 0) process.exit(res.status || 1)
    break
  }
  case 'jit': {
    const { spawnSync } = require('child_process')
    const res = spawnSync('node', [path.join(__dirname, 'jit.js'), ...process.argv.slice(3)], { stdio: 'inherit' })
    if (res.status !== 0) process.exit(res.status || 1)
    break
  }
  case 'commit':
  case 'safecommit': {
    const { spawnSync } = require('child_process')
    const res = spawnSync('node', [path.join(__dirname, 'commit.js'), ...process.argv.slice(3)], { stdio: 'inherit' })
    if (res.status !== 0) process.exit(res.status || 1)
    break
  }
  case 'permit':
  case 'permissions': {
    const { spawnSync } = require('child_process')
    const res = spawnSync('node', [path.join(__dirname, 'permissions.js'), ...process.argv.slice(3)], { stdio: 'inherit' })
    if (res.status !== 0) process.exit(res.status || 1)
    break
  }
  case 'handoff': {
    const { spawnSync } = require('child_process')
    const res = spawnSync('node', [path.join(__dirname, 'handoff.js'), ...process.argv.slice(3)], { stdio: 'inherit' })
    if (res.status !== 0) process.exit(res.status || 1)
    break
  }
  case 'tdd': {
    const { spawnSync } = require('child_process')
    const res = spawnSync('node', [path.join(__dirname, 'tdd.js'), ...process.argv.slice(3)], { stdio: 'inherit' })
    if (res.status !== 0) process.exit(res.status || 1)
    break
  }
  case 'enforce': {
    const { spawnSync } = require('child_process')
    const res = spawnSync('node', [path.join(__dirname, 'enforce.js'), ...process.argv.slice(3)], { stdio: 'inherit' })
    if (res.status !== 0) process.exit(res.status || 1)
    break
  }
  case 'sweep': {
    const { spawnSync } = require('child_process')
    const res = spawnSync('node', [path.join(__dirname, 'sweep.js'), ...process.argv.slice(3)], { stdio: 'inherit' })
    if (res.status !== 0) process.exit(res.status || 1)
    break
  }
  case 'docs':
  case 'documentation': {
    const { spawnSync } = require('child_process')
    const res = spawnSync('node', [path.join(__dirname, 'documentation.js'), ...process.argv.slice(3)], { stdio: 'inherit' })
    if (res.status !== 0) process.exit(res.status || 1)
    break
  }
  case 'chaos': {
    const { spawnSync } = require('child_process')
    const res = spawnSync('node', [path.join(__dirname, 'chaos.js'), ...process.argv.slice(3)], { stdio: 'inherit' })
    if (res.status !== 0) process.exit(res.status || 1)
    break
  }
  case 'prophet': {
    const { spawnSync } = require('child_process')
    const res = spawnSync('node', [path.join(__dirname, 'prophet.js'), ...process.argv.slice(3)], { stdio: 'inherit' })
    if (res.status !== 0) process.exit(res.status || 1)
    break
  }
  case 'ci': {
    const { spawnSync } = require('child_process')
    const res = spawnSync('node', [path.join(__dirname, 'ci.js'), ...process.argv.slice(3)], { stdio: 'inherit' })
    if (res.status !== 0) process.exit(res.status || 1)
    break
  }
  case 'swarm-sandbox': {
    const { spawnSync } = require('child_process')
    const res = spawnSync('node', [path.join(__dirname, 'claudient-swarm-sandbox.js'), ...process.argv.slice(3)], { stdio: 'inherit' })
    if (res.status !== 0) process.exit(res.status || 1)
    break
  }
  case 'svg-inspector': {
    const { spawnSync } = require('child_process')
    const res = spawnSync('node', [path.join(__dirname, 'claudient-svg-inspector.js'), ...process.argv.slice(3)], { stdio: 'inherit' })
    if (res.status !== 0) process.exit(res.status || 1)
    break
  }
  case 'commander':
  case 'incident': {
    const { spawnSync } = require('child_process')
    const res = spawnSync('node', [path.join(__dirname, 'incident.js'), ...process.argv.slice(3)], { stdio: 'inherit' })
    if (res.status !== 0) process.exit(res.status || 1)
    break
  }
  case 'gui':
  case 'dashboard':
    dashboardCommand()
    break
  case 'score':
    scoreCommand()
    break
  case 'share':
    shareCommand()
    break
  case 'import': {
    const url = positional[0]
    if (!url) { console.error('Usage: claudient import <gist-url>'); process.exit(1) }
    importCommand(url)
    break
  }
  case 'learn':
    learnCodebase(positional[0] || '.')
    break
  case 'sentinel':
    runSentinel(positional[0] || '.')
    break
  case 'guard':
    guardCommand(positional[0], positional[1])
    break
  case 'checkpoint': {
    const taskSummary = positional.join(' ')
    createCheckpoint(taskSummary)
    break
  }
  case 'restore':
    restoreCheckpoint()
    break
  case 'install': {
    const target = positional[0]
    if (target && (target.endsWith('_stack') || target.endsWith('-stack'))) {
      addStack(target)
    } else {
      addSkills(target || null, lang)
    }
    break
  }
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
