#!/usr/bin/env node
// build-catalog.js — generates marketplace catalog from workspace stacks
// Output: marketplace/catalog.json with all 50 official stacks
// Reads: all *_stack directories, their CLAUDE.md, skills/, commands/, hooks/, mcp/

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const MARKETPLACE_DIR = path.join(ROOT, 'marketplace')
const CATALOG_FILE = path.join(MARKETPLACE_DIR, 'catalog.json')
const STACKS_GLOB = path.join(ROOT, 'professional-stacks', '*_stack')

// Category mapping rules from stack names
const CATEGORY_MAP = {
  agentic_ai_engineer: 'ai-engineering',
  ai_compliance_risk: 'compliance',
  ai_ethics_governance: 'compliance',
  ai_product_manager: 'product',
  ai_sdr: 'sales',
  analytics_engineer: 'data-ml',
  api_developer: 'backend',
  b2b_consultant: 'consulting',
  bio_research: 'specialized',
  blockchain_web3: 'web3',
  brand_manager: 'marketing',
  cloud_architect: 'devops',
  community_manager: 'operations',
  content_marketing: 'marketing',
  customer_success: 'sales',
  data_engineer: 'data-ml',
  database_admin: 'database',
  devops_platform: 'devops',
  distributed_systems_engineer: 'backend',
  ecommerce_operator: 'operations',
  embedded_iot: 'specialized',
  finance_cfo: 'finance',
  founder_ceo: 'operations',
  frontend_engineer: 'frontend',
  fullstack_developer: 'backend',
  game_developer: 'specialized',
  growth_engineer: 'marketing',
  gtm_engineer: 'sales',
  healthcare: 'specialized',
  hr_people_operations: 'hr',
  infrastructure_as_code: 'devops',
  investor_vc: 'finance',
  legal_operations: 'legal',
  mlai_engineer: 'ai-engineering',
  mobile_developer: 'frontend',
  newsletter_writer: 'marketing',
  operations_manager: 'operations',
  platform_engineer: 'devops',
  podcast_producer: 'marketing',
  product_manager: 'product',
  product_operations: 'product',
  qa_testing_engineer: 'qa',
  recruiter_ta: 'hr',
  sales_operations: 'sales',
  security_engineer: 'security',
  solutions_architect: 'consulting',
  sre: 'devops',
  technical_writer: 'operations',
  user_research: 'product',
  youtube_creator: 'marketing',
}

// Language detection patterns
const LANGUAGE_DIRS = new Set(['de', 'es', 'fr', 'nl'])

// Find all stack directories
function findAllStacks() {
  const parent = path.dirname(STACKS_GLOB)
  const entries = fs.readdirSync(parent)
  return entries
    .filter(e => e.endsWith('_stack'))
    .map(e => path.join(parent, e))
    .sort()
}

// Extract H1 title and subtitle from CLAUDE.md
function extractMetadataFromCLAUDE(stackPath) {
  const claudePath = path.join(stackPath, 'CLAUDE.md')
  if (!fs.existsSync(claudePath)) {
    return { title: '', subtitle: '' }
  }

  const content = fs.readFileSync(claudePath, 'utf8')
  const lines = content.split('\n')

  let title = ''
  let subtitle = ''

  // First line should be H1 title
  if (lines[0] && lines[0].startsWith('# ')) {
    title = lines[0].replace(/^# /, '').trim()
  }

  // Second non-empty line is typically the subtitle
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() && !lines[i].startsWith('#')) {
      subtitle = lines[i].trim()
      break
    }
  }

  return { title, subtitle }
}

// Count items in directory, excluding .DS_Store and common files
function countDirItems(dirPath, excludeFiles = ['.DS_Store', 'connections.md']) {
  if (!fs.existsSync(dirPath)) return 0

  try {
    const items = fs.readdirSync(dirPath)
    return items.filter(item => !excludeFiles.includes(item)).length
  } catch (e) {
    return 0
  }
}

// Detect supported languages from skills/* subdirectories
function detectLanguages(skillsPath) {
  const langs = new Set(['en'])

  if (!fs.existsSync(skillsPath)) return Array.from(langs)

  try {
    const items = fs.readdirSync(skillsPath)
    for (const item of items) {
      if (LANGUAGE_DIRS.has(item)) {
        const itemPath = path.join(skillsPath, item)
        if (fs.statSync(itemPath).isDirectory()) {
          langs.add(item)
        }
      }
    }
  } catch (e) {
    // ignore
  }

  return Array.from(langs).sort()
}

// Get stack icon based on category
function getIconForCategory(category) {
  const icons = {
    'ai-engineering': '🤖',
    'backend': '⚙️',
    'compliance': '📋',
    'consulting': '💼',
    'data-ml': '📊',
    'database': '🗄️',
    'devops': '🚀',
    'finance': '💰',
    'frontend': '🎨',
    'hr': '👥',
    'legal': '⚖️',
    'marketing': '📈',
    'operations': '🔧',
    'product': '📦',
    'qa': '✅',
    'sales': '💡',
    'security': '🔐',
    'specialized': '🔬',
    'web3': '⛓️',
  }
  return icons[category] || '📚'
}

// Main build function
function buildCatalog() {
  const stacks = findAllStacks()
  const catalog = []

  for (const stackPath of stacks) {
    const stackDir = path.basename(stackPath)
    const stackId = stackDir.replace('_stack', '')

    const { title, subtitle } = extractMetadataFromCLAUDE(stackPath)
    const skillsPath = path.join(stackPath, 'skills')
    const commandsPath = path.join(stackPath, 'commands')
    const hooksPath = path.join(stackPath, 'hooks')
    const mcpPath = path.join(stackPath, 'mcp')

    const skillCount = countDirItems(skillsPath)
    const commandCount = countDirItems(commandsPath)
    const hooksCount = countDirItems(hooksPath)
    const mcpCount = countDirItems(mcpPath, ['.DS_Store', 'connections.md', 'README.md'])

    const category = CATEGORY_MAP[stackId] || 'specialized'
    const languages = detectLanguages(skillsPath)
    const icon = getIconForCategory(category)

    const entry = {
      id: stackId,
      name: title || stackId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: subtitle || `${stackId.replace(/_/g, ' ')} workspace stack`,
      category: category,
      path: stackDir,
      version: '1.0.0',
      author: {
        name: 'tushar2704',
        type: 'official',
      },
      status: 'official',
      certified: false,
      icon: icon,
      languages: languages,
      assets: {
        skills: skillCount,
        commands: commandCount,
        hooks: hooksCount,
        mcp: mcpCount,
      },
      install: `claudient-${stackId.replace(/_/g, '-')}`,
    }

    catalog.push(entry)
  }

  // Ensure marketplace directory exists
  if (!fs.existsSync(MARKETPLACE_DIR)) {
    fs.mkdirSync(MARKETPLACE_DIR, { recursive: true })
  }

  // Write catalog.json
  fs.writeFileSync(
    CATALOG_FILE,
    JSON.stringify(
      {
        $schema: 'https://code.claude.com/schema/catalog.json',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        total: catalog.length,
        entries: catalog,
      },
      null,
      2
    )
  )

  console.log(`✓ Generated catalog.json with ${catalog.length} official stacks`)
  console.log(`  Location: ${CATALOG_FILE}`)
  console.log(`  Size: ${(fs.statSync(CATALOG_FILE).size / 1024).toFixed(1)} KB`)

  return catalog.length
}

// Run
try {
  const count = buildCatalog()
  process.exit(0)
} catch (error) {
  console.error('✗ Catalog generation failed:', error.message)
  process.exit(1)
}
