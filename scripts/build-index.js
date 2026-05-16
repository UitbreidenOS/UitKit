#!/usr/bin/env node
// build-index.js — generates index.json, a machine-readable manifest of all content

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const LANGS = ['fr', 'de', 'nl', 'es']
const SKILL_CATEGORIES = ['backend', 'devops-infra', 'data-ml', 'database', 'finance-payments', 'ai-engineering', 'productivity']

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

function readTitle(filepath) {
  try {
    const first = fs.readFileSync(filepath, 'utf-8').split('\n').find(l => l.startsWith('# '))
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
}

// Skills
for (const cat of SKILL_CATEGORIES) {
  const catDir = path.join(ROOT, 'skills', cat)
  for (const file of getFiles(catDir)) {
    const rel = relPath(file)
    const lang = getLang(rel)
    const slug = rel.replace(/^skills\//, '').replace(/\.md$/, '').replace(/\/(fr|de|nl|es)\//, '/')
    index.skills.push({
      id: slug,
      category: cat,
      lang,
      title: readTitle(file),
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
  languages: ['en', ...LANGS],
}

const outPath = path.join(ROOT, 'index.json')
fs.writeFileSync(outPath, JSON.stringify(index, null, 2) + '\n')
console.log(`Generated index.json — ${index.summary.skills} skills, ${index.summary.agents} agents, ${index.summary.hooks} hooks`)
