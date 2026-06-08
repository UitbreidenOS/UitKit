#!/usr/bin/env node
// build-index.js — generates index.json, a machine-readable manifest of all content

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const LANGS = ['fr', 'de', 'nl', 'es']
const SKILL_CATEGORIES = ['ai-engineering', 'automation', 'backend', 'computer-use', 'data-ml', 'database', 'devops-infra', 'finance', 'finance-payments', 'git', 'gtm', 'legal', 'marketing', 'product', 'productivity', 'sdr', 'small-business']

function getFiles(dir, ext = '.md') {
  const results = []
  if (!fs.existsSync(dir)) return results
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) results.push(...getFiles(full, ext))
    else if (entry.name.endsWith(ext)) results.push(full)
  }
  return results
}

function relPath(full) {
  return full.replace(ROOT + '/', '')
}

function isTranslation(filepath) {
  return LANGS.some(l => filepath.includes(`/${l}/`))
}

function getLang(filepath) {
  for (const l of LANGS) {
    if (filepath.includes(`/${l}/`)) return l
  }
  return 'en'
}

function readFrontmatter(filepath) {
  try {
    const content = fs.readFileSync(filepath, 'utf-8')
    if (!content.startsWith('---')) return {}
    const end = content.indexOf('---', 3)
    if (end === -1) return {}
    const yaml = content.slice(3, end).trim()
    const result = {}
    for (const line of yaml.split('\n')) {
      const colon = line.indexOf(':')
      if (colon === -1) continue
      const key = line.slice(0, colon).trim()
      const val = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '')
      result[key] = val
    }
    return result
  } catch { return {} }
}

function readTitle(filepath) {
  try {
    const content = fs.readFileSync(filepath, 'utf-8')
    // Try frontmatter name first
    const fm = readFrontmatter(filepath)
    if (fm.name) {
      return fm.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        .replace(/Dotnet/, '.NET').replace(/Csharp/, 'C#').replace(/Dbt/, 'dbt')
    }
    const first = content.split('\n').find(l => l.startsWith('# '))
    return first ? first.replace(/^# /, '').trim() : path.basename(filepath, '.md')
  } catch {
    return path.basename(filepath, '.md')
  }
}

const index = {
  version: require(path.join(ROOT, 'package.json')).version,
  generated: new Date().toISOString(),
  skills: [],
  agents: [],
  hooks: [],
  rules: [],
  workflows: [],
  prompts: [],
  guides: [],
  structures: [],
  outputStyles: [],
  statuslines: [],
  themes: [],
  keybindings: [],
  settingsTemplates: [],
  routines: [],
  plugins: [],
  commands: [],
  personas: [],
}

// Skills
for (const cat of SKILL_CATEGORIES) {
  const catDir = path.join(ROOT, 'skills', cat)
  for (const file of getFiles(catDir)) {
    const rel = relPath(file)
    const lang = getLang(rel)
    const slug = rel.replace(/^skills\//, '').replace(/\.md$/, '').replace(/\/(fr|de|nl|es)\//, '/')
    const fm = readFrontmatter(file)
    index.skills.push({
      id: slug,
      category: cat,
      lang,
      title: readTitle(file),
      description: fm.description || '',
      file: rel,
    })
  }
}

// Agents
for (const file of getFiles(path.join(ROOT, 'agents'))) {
  const rel = relPath(file)
  const lang = getLang(rel)
  const slug = rel.replace(/^agents\//, '').replace(/\.md$/, '').replace(/\/(fr|de|nl|es)\//, '/')
  index.agents.push({ id: slug, lang, title: readTitle(file), file: rel })
}

// Hooks (md docs)
for (const file of getFiles(path.join(ROOT, 'hooks'))) {
  const rel = relPath(file)
  if (isTranslation(rel)) continue
  const cat = rel.split('/')[1]
  const slug = path.basename(file, '.md')
  index.hooks.push({ id: `${cat}/${slug}`, category: cat, title: readTitle(file), file: rel })
}

// Rules
for (const file of getFiles(path.join(ROOT, 'rules'))) {
  const rel = relPath(file)
  const lang = getLang(rel)
  const slug = rel.replace(/^rules\//, '').replace(/\.md$/, '').replace(/\/(fr|de|nl|es)\//, '/')
  index.rules.push({ id: slug, lang, title: readTitle(file), file: rel })
}

// Workflows
for (const file of getFiles(path.join(ROOT, 'workflows'))) {
  const rel = relPath(file)
  const lang = getLang(rel)
  const slug = path.basename(file, '.md')
  index.workflows.push({ id: slug, lang, title: readTitle(file), file: rel })
}

// Prompts
for (const file of getFiles(path.join(ROOT, 'prompts'))) {
  const rel = relPath(file)
  const lang = getLang(rel)
  const cat = rel.split('/')[1]
  const slug = `${cat}/${path.basename(file, '.md')}`
  index.prompts.push({ id: slug.replace(/\/(fr|de|nl|es)\//, '/'), category: cat, lang, title: readTitle(file), file: rel })
}

// Guides
for (const file of getFiles(path.join(ROOT, 'guides'))) {
  const rel = relPath(file)
  const lang = getLang(rel)
  const slug = path.basename(file, '.md')
  index.guides.push({ id: slug, lang, title: readTitle(file), file: rel })
}

// Structures
for (const file of getFiles(path.join(ROOT, 'structures'))) {
  const rel = relPath(file)
  if (isTranslation(rel)) continue // English only for now
  if (path.basename(file) === 'README.md') continue
  const slug = path.basename(file, '.md')
  const content = fs.readFileSync(file, 'utf-8')
  // Extract the tagline (first blockquote line)
  const tagline = (content.match(/^>\s*(.+)$/m) || [])[1] || ''
  // Detect type: workspace or template
  const type = slug.endsWith('-workspace') ? 'workspace' : 'template'
  index.structures.push({ id: slug, type, title: readTitle(file), tagline, file: rel })
}

// Commands
for (const file of getFiles(path.join(ROOT, 'commands'))) {
  const rel = relPath(file)
  if (isTranslation(rel)) continue
  const parts = rel.split('/')
  const cat = parts[1]
  const slug = path.basename(file, '.md')
  const fm = readFrontmatter(file)
  index.commands.push({ id: `${cat}/${slug}`, category: cat, title: readTitle(file), description: fm.description || '', file: rel })
}

// Personas
for (const file of getFiles(path.join(ROOT, 'personas'))) {
  const rel = relPath(file)
  if (isTranslation(rel)) continue
  if (path.basename(file) === 'README.md') continue
  const fm = readFrontmatter(file)
  index.personas.push({ id: path.basename(file, '.md'), title: readTitle(file), description: fm.description || '', file: rel })
}

// Output styles
for (const file of getFiles(path.join(ROOT, 'output-styles'))) {
  const rel = relPath(file)
  if (isTranslation(rel)) continue
  if (path.basename(file) === 'README.md') continue
  const fm = readFrontmatter(file)
  index.outputStyles.push({ id: path.basename(file, '.md'), title: fm.name || readTitle(file), description: fm.description || '', file: rel })
}

// Statuslines
for (const file of getFiles(path.join(ROOT, 'statuslines'), '.sh')) {
  const rel = relPath(file)
  index.statuslines.push({ id: path.basename(file, '.sh'), file: rel })
}

// Themes
for (const file of getFiles(path.join(ROOT, 'themes'), '.json')) {
  const rel = relPath(file)
  let name = path.basename(file, '.json')
  try { name = JSON.parse(fs.readFileSync(file, 'utf-8')).name || name } catch {}
  index.themes.push({ id: path.basename(file, '.json'), title: name, file: rel })
}

// Keybindings
for (const file of getFiles(path.join(ROOT, 'keybindings'), '.json')) {
  const rel = relPath(file)
  index.keybindings.push({ id: path.basename(file, '.json'), file: rel })
}

// Settings templates
for (const file of getFiles(path.join(ROOT, 'settings-templates'), '.json')) {
  const rel = relPath(file)
  index.settingsTemplates.push({ id: path.basename(file, '.json'), file: rel })
}

// Routines
for (const file of getFiles(path.join(ROOT, 'routines'))) {
  const rel = relPath(file)
  if (isTranslation(rel)) continue
  if (path.basename(file) === 'README.md') continue
  index.routines.push({ id: path.basename(file, '.md'), title: readTitle(file), file: rel })
}

// Plugins (marketplace bundles)
const pluginsDir = path.join(ROOT, 'plugins')
if (fs.existsSync(pluginsDir)) {
  for (const entry of fs.readdirSync(pluginsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const manifestPath = path.join(pluginsDir, entry.name, '.claude-plugin', 'plugin.json')
    if (!fs.existsSync(manifestPath)) continue
    try {
      const m = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
      const skillCount = getFiles(path.join(pluginsDir, entry.name, 'skills'), 'SKILL.md').length
      index.plugins.push({ id: m.name, displayName: m.displayName || m.name, description: m.description || '', version: m.version || '', skills: skillCount, file: relPath(manifestPath) })
    } catch {}
  }
}

// Summary counts (English only)
const en = (arr) => arr.filter(i => i.lang === 'en' || !i.lang)
index.summary = {
  skills: en(index.skills).length,
  agents: en(index.agents).length,
  hooks: index.hooks.length,
  rules: en(index.rules).length,
  workflows: en(index.workflows).length,
  prompts: en(index.prompts).length,
  guides: en(index.guides).length,
  structures: index.structures.length,
  outputStyles: index.outputStyles.length,
  statuslines: index.statuslines.length,
  themes: index.themes.length,
  keybindings: index.keybindings.length,
  settingsTemplates: index.settingsTemplates.length,
  routines: index.routines.length,
  plugins: index.plugins.length,
  commands: index.commands.length,
  personas: index.personas.length,
  languages: ['en', ...LANGS],
}

const outPath = path.join(ROOT, 'index.json')
fs.writeFileSync(outPath, JSON.stringify(index, null, 2) + '\n')
console.log(`Generated index.json — ${index.summary.skills} skills, ${index.summary.agents} agents, ${index.summary.hooks} hooks, ${index.summary.structures} structures, ${index.summary.plugins} plugins, ${index.summary.commands} commands, ${index.summary.personas} personas, ${index.summary.themes} themes, ${index.summary.outputStyles} output-styles`)
