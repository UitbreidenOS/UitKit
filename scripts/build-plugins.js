#!/usr/bin/env node
// build-plugins.js — generates Claude Code plugin marketplace packaging
// Output: plugins/claudient-<category>/ with SKILL.md files + plugin.json manifests
// Root: .claude-plugin/marketplace.json

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const pkg = require(path.join(ROOT, 'package.json'))
const version = pkg.version

const PLUGINS_DIR = path.join(ROOT, 'plugins')
const CLAUDE_PLUGIN_DIR = path.join(ROOT, '.claude-plugin')
const LANG_DIRS = new Set(['fr', 'de', 'es', 'nl'])

// Skill categories to package (each becomes one plugin)
const SKILL_CATEGORIES = [
  'ai-engineering',
  'automation',
  'backend',
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

// Category display names and descriptions
const CATEGORY_META = {
  'ai-engineering': {
    display: 'AI Engineering',
    description: 'Claude API, agent construction, RAG, LangGraph, CrewAI, MCP server building, prompt caching, LLM eval, and AI-native development patterns.',
    keywords: ['claude-api', 'agents', 'rag', 'langgraph', 'mcp', 'prompt-engineering', 'llm'],
  },
  'automation': {
    display: 'Automation',
    description: 'Browser automation, Playwright, SaaS scaffolding, spec-to-repo generation, IoT, embedded systems, game dev, and office document automation.',
    keywords: ['playwright', 'browser-automation', 'saas', 'iot', 'embedded', 'game-dev'],
  },
  'backend': {
    display: 'Backend & Fullstack',
    description: '41 framework-specific skills covering Python (FastAPI, Django), Node.js (Next.js, NestJS, Hono, tRPC), Go, Rust, Ruby on Rails, Java Spring Boot, Elixir, Flutter, Swift, Kotlin, .NET, and PHP Laravel.',
    keywords: ['fastapi', 'nextjs', 'react', 'golang', 'rust', 'django', 'rails', 'spring-boot', 'flutter', 'swift', 'kotlin'],
  },
  'data-ml': {
    display: 'Data & ML',
    description: 'Data pipelines, dbt, Apache Spark, Kafka, MLOps, MLflow, PyTorch, TensorFlow, NLP pipelines, pandas/polars, reinforcement learning, and synthetic data generation.',
    keywords: ['dbt', 'spark', 'kafka', 'mlops', 'pytorch', 'tensorflow', 'pandas', 'nlp'],
  },
  'database': {
    display: 'Databases',
    description: 'PostgreSQL, MongoDB, Redis, Supabase, Neon, Turso, Prisma, Drizzle ORM, GraphQL, Elasticsearch, and blockchain/smart contracts.',
    keywords: ['postgresql', 'mongodb', 'redis', 'supabase', 'prisma', 'graphql', 'elasticsearch'],
  },
  'devops-infra': {
    display: 'DevOps & Infrastructure',
    description: '36 skills covering AWS, Azure, GCP, Kubernetes, Helm, Terraform, Pulumi, ArgoCD, Docker, CI/CD, GitHub Actions, secrets management, observability, SLOs, and platform engineering.',
    keywords: ['kubernetes', 'terraform', 'aws', 'docker', 'cicd', 'github-actions', 'observability', 'platform-engineering'],
  },
  'finance': {
    display: 'Finance',
    description: 'DCF models, 3-statement financial models, comps analysis, deal screening, IC memos, KYC/AML, pitch decks, earnings analysis, GL reconciliation, and financial planning.',
    keywords: ['dcf', 'finance', 'investment', 'kyc', 'aml', 'pitch-deck', 'financial-modeling'],
  },
  'finance-payments': {
    display: 'Finance & Payments',
    description: 'Stripe integration and webhook security patterns for payment processing.',
    keywords: ['stripe', 'payments', 'webhooks', 'fintech'],
  },
  'git': {
    display: 'Git',
    description: 'Commit message writing, PR description generation, and changelog automation.',
    keywords: ['git', 'commit', 'pull-request', 'changelog'],
  },
  'gtm': {
    display: 'Go-to-Market',
    description: '32 GTM skills: cold email, LinkedIn outreach, deal desk, revenue operations, HubSpot, channel economics, commercial forecasting, customer success, RFP response, and SDR workflows.',
    keywords: ['sales', 'gtm', 'cold-email', 'crm', 'hubspot', 'revenue-ops', 'deal-desk'],
  },
  'legal': {
    display: 'Legal',
    description: 'Contract review, NDA analysis, GDPR compliance, SOC 2, ISO 27001, IP clearance, EU AI Act, legal research (CourtListener, Thomson Reuters), DSAR response, and diligence review.',
    keywords: ['legal', 'contract-review', 'gdpr', 'compliance', 'ip', 'privacy'],
  },
  'marketing': {
    display: 'Marketing',
    description: 'SEO (technical, AI, programmatic), content strategy, copywriting, email sequences, paid ads, brand guidelines, CRO, social media, churn prevention, schema markup, and referral programs.',
    keywords: ['seo', 'content-marketing', 'copywriting', 'email-marketing', 'paid-ads', 'cro'],
  },
  'product': {
    display: 'Product',
    description: 'Product discovery, roadmapping, PRD writing, competitive teardowns, UX research, product analytics, experiment design, and landing page generation.',
    keywords: ['product-management', 'prd', 'roadmap', 'ux-research', 'product-analytics', 'a-b-testing'],
  },
  'productivity': {
    display: 'Productivity & Engineering',
    description: '66 skills for daily engineering work: debugging, refactoring, code review, PR automation, test generation, ADR writing, security auditing, context engineering, MCP clients, and dozens more.',
    keywords: ['productivity', 'code-review', 'debugging', 'testing', 'refactoring', 'adr', 'security'],
  },
  'sdr': {
    display: 'SDR',
    description: 'SDR-specific skills: cold call scripts, email sequences, ICP scoring, objection handling, LinkedIn SDR, MEDDPICC qualification, personalization, CRM hygiene, and prospect research.',
    keywords: ['sdr', 'sales-development', 'cold-calling', 'prospecting', 'qualification', 'meddpicc'],
  },
  'small-business': {
    display: 'Small Business',
    description: '47 skills for small business operations: cash flow forecasting, invoicing, campaign briefs, QuickBooks workflows, Shopify operations, SOP writing, job descriptions, and weekly business pulse.',
    keywords: ['small-business', 'operations', 'cash-flow', 'shopify', 'quickbooks', 'invoicing'],
  },
}

// Agent category → best matching skill plugin (for co-packaging agents)
// Agents are grouped by their own categories; we bundle them alongside best-fit skill plugins
const AGENT_CATEGORY_MAP = {
  'advisors':       'productivity',    // C-suite advisors → productivity/leadership
  'build-resolvers': 'productivity',   // build fix agents → productivity
  'core':           'productivity',    // architect, planner, code-reviewer → productivity
  'roles':          'productivity',    // 73 specialist role agents → productivity (biggest bucket)
  'sdr':            'sdr',             // SDR-specific agents → sdr plugin
  'specialists':    'small-business',  // ecommerce, local-services, etc → small-business
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true })
}

function readFrontmatter(content) {
  if (!content.startsWith('---')) return { fm: {}, body: content }
  const end = content.indexOf('---', 3)
  if (end === -1) return { fm: {}, body: content }
  const yamlStr = content.slice(3, end).trim()
  const body = content.slice(end + 3).trimStart()
  const fm = {}
  for (const line of yamlStr.split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    // Handle quoted or unquoted values, including multi-word
    let val = line.slice(colon + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    fm[key] = val
  }
  return { fm, body }
}

/** Derive a skill name from the filename when frontmatter lacks `name` */
function nameFromFilename(filepath) {
  return path.basename(filepath, '.md')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    // common normalizations
    .replace(/\bDotnet\b/, '.NET')
    .replace(/\bCsharp\b/, 'C#')
    .replace(/\bDbt\b/, 'dbt')
    .replace(/\bApi\b/, 'API')
    .replace(/\bCrm\b/, 'CRM')
    .replace(/\bSdr\b/, 'SDR')
    .replace(/\bGtm\b/, 'GTM')
    .replace(/\bSeo\b/, 'SEO')
    .replace(/\bPrd\b/, 'PRD')
    .replace(/\bAdr\b/, 'ADR')
    .replace(/\bKyc\b/, 'KYC')
    .replace(/\bDcf\b/, 'DCF')
    .replace(/\bGl\b/, 'GL')
    .replace(/\bIc\b/, 'IC')
    .replace(/\bNda\b/, 'NDA')
    .replace(/\bMcp\b/, 'MCP')
    .replace(/\bRag\b/, 'RAG')
    .replace(/\bSoc2\b/, 'SOC 2')
    .replace(/\bCro\b/, 'CRO')
    .replace(/\bSlo\b/, 'SLO')
    .replace(/\bCicd\b/, 'CI/CD')
}

/** Extract first H1 heading from body content */
function extractH1(body) {
  const match = body.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : null
}

/** Extract a short description from body if none in frontmatter */
function extractDescription(body) {
  // Try first paragraph after ## When to activate
  const activateMatch = body.match(/##\s+When to activate\s*\n+([\s\S]+?)(?=\n##|\n---|\z)/i)
  if (activateMatch) {
    const text = activateMatch[1].trim().replace(/\n/g, ' ').replace(/\s+/g, ' ')
    return text.slice(0, 200)
  }
  // Fallback: first non-header paragraph
  const lines = body.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('-') && !l.startsWith('|'))
  if (lines.length > 0) {
    return lines[0].trim().slice(0, 200)
  }
  return ''
}

/** Truncate combined name+description to 1536 chars total for plugin compliance */
function capFrontmatter(name, description) {
  const cap = 1536
  const nameUsage = name.length + 8 // 'name: ' + quotes + newline
  const maxDesc = cap - nameUsage - 16 // 'description: ""' overhead
  if ((name + description).length <= cap && description.length <= maxDesc) {
    return { name, description }
  }
  return { name, description: description.slice(0, Math.max(0, maxDesc - 3)) + '...' }
}

/** Collect English-only .md files recursively, skipping lang subdirs */
function collectSkillFiles(dir) {
  const results = []
  if (!fs.existsSync(dir)) return results
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (LANG_DIRS.has(entry.name)) continue  // skip fr/de/es/nl
      results.push(...collectSkillFiles(path.join(dir, entry.name)))
    } else if (entry.name.endsWith('.md')) {
      results.push(path.join(dir, entry.name))
    }
  }
  return results
}

/** Derive a unique skill slug for use as the SKILL.md directory name */
function skillSlug(skillFile, categoryDir) {
  // Make path relative to category root, replace path separators with __
  const rel = path.relative(categoryDir, skillFile)
  return rel.replace(/\.md$/, '').replace(/[/\\]/g, '__')
}

// ---------------------------------------------------------------------------
// Main build
// ---------------------------------------------------------------------------

// Clean and recreate plugins directory
if (fs.existsSync(PLUGINS_DIR)) {
  fs.rmSync(PLUGINS_DIR, { recursive: true, force: true })
}
fs.mkdirSync(PLUGINS_DIR, { recursive: true })
ensureDir(CLAUDE_PLUGIN_DIR)

const pluginSummaries = []  // for marketplace.json
const buildStats = []

for (const category of SKILL_CATEGORIES) {
  const pluginName = `claudient-${category}`
  const pluginDir = path.join(PLUGINS_DIR, pluginName)
  const skillsOutDir = path.join(pluginDir, 'skills')
  const agentsOutDir = path.join(pluginDir, 'agents')
  const pluginJsonDir = path.join(pluginDir, '.claude-plugin')

  ensureDir(skillsOutDir)
  ensureDir(pluginJsonDir)

  const meta = CATEGORY_META[category] || {
    display: category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    description: `Claudient skills for ${category}.`,
    keywords: [category],
  }

  // ---- Package skills ----
  const categorySkillDir = path.join(ROOT, 'skills', category)
  const skillFiles = collectSkillFiles(categorySkillDir)
  let skillCount = 0

  for (const skillFile of skillFiles) {
    const raw = fs.readFileSync(skillFile, 'utf-8')
    const { fm, body } = readFrontmatter(raw)

    // Determine name and description
    let skillName = fm.name || extractH1(body) || nameFromFilename(skillFile)
    let skillDesc = fm.description || extractDescription(body)

    const { name: cappedName, description: cappedDesc } = capFrontmatter(skillName, skillDesc)

    // Build SKILL.md content: frontmatter + original body
    let skillMd = `---\nname: ${JSON.stringify(cappedName)}\ndescription: ${JSON.stringify(cappedDesc)}\n---\n\n`
    skillMd += body

    // Output dir: plugins/claudient-<cat>/skills/<slug>/SKILL.md
    const slug = skillSlug(skillFile, categorySkillDir)
    const skillOutDir = path.join(skillsOutDir, slug)
    ensureDir(skillOutDir)
    fs.writeFileSync(path.join(skillOutDir, 'SKILL.md'), skillMd)
    skillCount++
  }

  // ---- Package agents (from AGENT_CATEGORY_MAP) ----
  // Agents require individual file paths in plugin.json (not directory globs)
  let agentCount = 0
  const agentFilePaths = []  // relative paths for plugin.json
  const agentCatsForPlugin = Object.entries(AGENT_CATEGORY_MAP)
    .filter(([, skillCat]) => skillCat === category)
    .map(([agentCat]) => agentCat)

  if (agentCatsForPlugin.length > 0) {
    ensureDir(agentsOutDir)
    for (const agentCat of agentCatsForPlugin) {
      const agentCatDir = path.join(ROOT, 'agents', agentCat)
      if (!fs.existsSync(agentCatDir)) continue
      for (const entry of fs.readdirSync(agentCatDir, { withFileTypes: true })) {
        if (!entry.isFile() || !entry.name.endsWith('.md')) continue
        const src = path.join(agentCatDir, entry.name)
        const srcContent = fs.readFileSync(src, 'utf-8')

        // Agent files lack frontmatter — wrap them so plugin validator is happy
        let outContent = srcContent
        if (!srcContent.startsWith('---')) {
          // Derive name/description from H1 heading + first Purpose section
          const h1 = (srcContent.match(/^#\s+(.+)$/m) || [])[1] || path.basename(entry.name, '.md')
          const purposeMatch = srcContent.match(/##\s+Purpose\s*\n+([\s\S]+?)(?=\n##|\z)/i)
          const desc = purposeMatch
            ? purposeMatch[1].trim().replace(/\n/g, ' ').replace(/\s+/g, ' ').slice(0, 200)
            : ''
          outContent = `---\nname: ${JSON.stringify(h1)}\ndescription: ${JSON.stringify(desc)}\n---\n\n` + srcContent
        }

        fs.writeFileSync(path.join(agentsOutDir, entry.name), outContent)
        agentFilePaths.push(`./agents/${entry.name}`)
        agentCount++
      }
    }
  }

  // ---- Write plugin.json ----
  const pluginJson = {
    $schema: 'https://json.schemastore.org/claude-code-plugin-manifest.json',
    name: pluginName,
    displayName: `Claudient — ${meta.display}`,
    version: version,
    description: meta.description,
    author: {
      name: 'tushar2704',
      email: 'ceo@uitbreiden.com',
      url: 'https://uitbreiden.com',
    },
    homepage: 'https://github.com/UitbreidenOS/Claudient',
    repository: 'https://github.com/UitbreidenOS/Claudient',
    license: 'CC-BY-SA-4.0',
    keywords: ['claudient', 'claude-code', ...meta.keywords],
    skills: ['./skills/'],
  }
  if (agentCount > 0) {
    pluginJson.agents = agentFilePaths
  }
  fs.writeFileSync(
    path.join(pluginJsonDir, 'plugin.json'),
    JSON.stringify(pluginJson, null, 2) + '\n'
  )

  buildStats.push({ plugin: pluginName, skills: skillCount, agents: agentCount })

  pluginSummaries.push({
    name: pluginName,
    source: `./plugins/${pluginName}`,
    description: meta.description,
    category: category,
    version: version,
    author: { name: 'tushar2704' },
  })
}

// ---- claudient-commands plugin ----
{
  const cmdPluginDir = path.join(PLUGINS_DIR, 'claudient-commands')
  const cmdPluginMetaDir = path.join(cmdPluginDir, '.claude-plugin')
  const cmdCommandsDir = path.join(cmdPluginDir, 'commands')
  ensureDir(cmdCommandsDir)
  ensureDir(cmdPluginMetaDir)

  // Copy all command files preserving category subdirs
  const commandsSourceDir = path.join(ROOT, 'commands')
  if (fs.existsSync(commandsSourceDir)) {
    for (const cat of fs.readdirSync(commandsSourceDir, { withFileTypes: true })) {
      if (!cat.isDirectory() || LANG_DIRS.has(cat.name)) continue
      const catOutDir = path.join(cmdCommandsDir, cat.name)
      ensureDir(catOutDir)
      const catDir = path.join(commandsSourceDir, cat.name)
      for (const f of fs.readdirSync(catDir).filter(n => n.endsWith('.md'))) {
        fs.copyFileSync(path.join(catDir, f), path.join(catOutDir, f))
      }
    }
  }

  const cmdTotalFiles = collectSkillFiles(cmdCommandsDir).length
  const cmdPluginJson = {
    $schema: 'https://json.schemastore.org/claude-code-plugin-manifest.json',
    name: 'claudient-commands',
    displayName: 'Claudient — Slash Commands',
    version: version,
    description: `${cmdTotalFiles}+ slash commands across git, testing, refactor, docs, debug, devops, database, security, frontend, api, ai-engineering, and productivity.`,
    author: { name: 'tushar2704', email: 'ceo@uitbreiden.com', url: 'https://uitbreiden.com' },
    homepage: 'https://github.com/UitbreidenOS/Claudient',
    repository: 'https://github.com/UitbreidenOS/Claudient',
    license: 'CC-BY-SA-4.0',
    keywords: ['claudient', 'claude-code', 'commands', 'slash-commands'],
    commands: ['./commands/'],
  }
  fs.writeFileSync(path.join(cmdPluginMetaDir, 'plugin.json'), JSON.stringify(cmdPluginJson, null, 2) + '\n')
  buildStats.push({ plugin: 'claudient-commands', skills: 0, agents: 0, commands: cmdTotalFiles })
  pluginSummaries.push({
    name: 'claudient-commands',
    source: './plugins/claudient-commands',
    description: cmdPluginJson.description,
    category: 'commands',
    version: version,
    author: { name: 'tushar2704' },
  })
}

// ---- claudient-personas plugin ----
{
  const pPluginDir = path.join(PLUGINS_DIR, 'claudient-personas')
  const pPluginMetaDir = path.join(pPluginDir, '.claude-plugin')
  const pAgentsDir = path.join(pPluginDir, 'agents')
  ensureDir(pAgentsDir)
  ensureDir(pPluginMetaDir)

  const personasSourceDir = path.join(ROOT, 'personas')
  const personaFiles = []
  if (fs.existsSync(personasSourceDir)) {
    for (const f of fs.readdirSync(personasSourceDir).filter(n => n.endsWith('.md'))) {
      fs.copyFileSync(path.join(personasSourceDir, f), path.join(pAgentsDir, f))
      personaFiles.push(`./agents/${f}`)
    }
  }

  const pPluginJson = {
    $schema: 'https://json.schemastore.org/claude-code-plugin-manifest.json',
    name: 'claudient-personas',
    displayName: 'Claudient — Personas',
    version: version,
    description: `10 operating personas for Claude: startup-cto, solo-founder, growth-marketer, indie-hacker, enterprise-architect, data-driven-pm, devrel-advocate, agency-operator, ai-product-builder, fractional-exec.`,
    author: { name: 'tushar2704', email: 'ceo@uitbreiden.com', url: 'https://uitbreiden.com' },
    homepage: 'https://github.com/UitbreidenOS/Claudient',
    repository: 'https://github.com/UitbreidenOS/Claudient',
    license: 'CC-BY-SA-4.0',
    keywords: ['claudient', 'claude-code', 'personas', 'roles'],
    agents: personaFiles,
  }
  fs.writeFileSync(path.join(pPluginMetaDir, 'plugin.json'), JSON.stringify(pPluginJson, null, 2) + '\n')
  buildStats.push({ plugin: 'claudient-personas', skills: 0, agents: personaFiles.length })
  pluginSummaries.push({
    name: 'claudient-personas',
    source: './plugins/claudient-personas',
    description: pPluginJson.description,
    category: 'personas',
    version: version,
    author: { name: 'tushar2704' },
  })
}

// ---- claudient-everything meta-bundle ----
// Strategy: list in marketplace.json as a top-level entry, no physical copy needed.
// Users who want everything install individual domain plugins.
// We create a thin meta-bundle that documents itself.
const everythingDir = path.join(PLUGINS_DIR, 'claudient-everything')
const everythingPluginDir = path.join(everythingDir, '.claude-plugin')
ensureDir(everythingDir)
ensureDir(everythingPluginDir)

const allPluginNames = SKILL_CATEGORIES.map(c => `claudient-${c}`)
const everythingReadme = `# Claudient Everything

This meta-bundle references all Claudient domain plugins.

Install each domain plugin directly:

${allPluginNames.map(n => `- \`/plugin install ${n}\``).join('\n')}

Or install from the marketplace registry:
  /plugin marketplace add UitbreidenOS/Claudient
`
fs.writeFileSync(path.join(everythingDir, 'README.md'), everythingReadme)

const everythingJson = {
  $schema: 'https://json.schemastore.org/claude-code-plugin-manifest.json',
  name: 'claudient-everything',
  displayName: 'Claudient — Everything',
  version: version,
  description: `Meta-bundle listing all Claudient domain plugins (377+ skills, 104 agents). Install individual plugins: ${allPluginNames.join(', ')}. See README.md for install commands.`,
  author: {
    name: 'tushar2704',
    email: 'ceo@uitbreiden.com',
    url: 'https://uitbreiden.com',
  },
  homepage: 'https://github.com/UitbreidenOS/Claudient',
  repository: 'https://github.com/UitbreidenOS/Claudient',
  license: 'CC-BY-SA-4.0',
  keywords: ['claudient', 'claude-code', 'all', 'meta-bundle'],
}
fs.writeFileSync(
  path.join(everythingPluginDir, 'plugin.json'),
  JSON.stringify(everythingJson, null, 2) + '\n'
)

pluginSummaries.push({
  name: 'claudient-everything',
  source: './plugins/claudient-everything',
  description: everythingJson.description,
  category: 'meta',
  version: version,
  author: { name: 'tushar2704' },
})

// ---- Write root marketplace.json ----
const marketplace = {
  $schema: 'https://code.claude.com/schema/marketplace.json',
  name: 'claudient',
  description: 'The Claude Code knowledge system — 377+ skills, 104 agents, hooks, MCP configs, and project structures across every professional domain.',
  owner: { name: 'tushar2704', email: 'ceo@uitbreiden.com' },
  metadata: { pluginRoot: './plugins' },
  plugins: pluginSummaries,
}
fs.writeFileSync(
  path.join(CLAUDE_PLUGIN_DIR, 'marketplace.json'),
  JSON.stringify(marketplace, null, 2) + '\n'
)

// ---- Print summary ----
const totalSkills = buildStats.reduce((s, r) => s + r.skills, 0)
const totalAgents = buildStats.reduce((s, r) => s + r.agents, 0)

console.log('\nClaudient Plugin Build Summary')
console.log('================================')
console.log(`Generated ${buildStats.length} domain plugins + 1 meta-bundle (claudient-everything)`)
console.log(`Total skills packaged : ${totalSkills}`)
console.log(`Total agents packaged : ${totalAgents}`)
console.log()
console.log('Plugin                      Skills  Agents')
console.log('------------------------------------------')
for (const { plugin, skills, agents } of buildStats) {
  const p = plugin.padEnd(28)
  const s = String(skills).padStart(5)
  const a = String(agents).padStart(7)
  console.log(`${p}${s}  ${a}`)
}
console.log()
console.log('Output locations:')
console.log('  plugins/                         <- all per-category plugin dirs')
console.log('  .claude-plugin/marketplace.json  <- root marketplace manifest')
console.log()
console.log('Install commands:')
console.log('  /plugin marketplace add UitbreidenOS/Claudient')
console.log('  # then install any domain plugin, e.g.:')
console.log('  /plugin install claudient-productivity')
console.log('  /plugin install claudient-backend')
console.log('  /plugin install claudient-gtm')
