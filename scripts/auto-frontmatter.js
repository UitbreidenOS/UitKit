const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const TRANSLATION_DIRS = new Set(['fr', 'de', 'es', 'nl'])

function walkMarkdown(dir, callback) {
  if (!fs.existsSync(dir)) return
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!TRANSLATION_DIRS.has(entry.name)) {
        walkMarkdown(fullPath, callback)
      }
    } else if (entry.name.endsWith('.md')) {
      callback(fullPath)
    }
  }
}

let count = 0

walkMarkdown(path.join(ROOT, 'skills'), (file) => {
  const content = fs.readFileSync(file, 'utf8')
  if (content.startsWith('---')) {
    return
  }

  // Find first H1
  const h1Match = content.match(/^#\s+(.+)$/m)
  if (!h1Match) {
    console.log(`⚠️ No H1 header found in: ${path.relative(ROOT, file)}`)
    return
  }

  const title = h1Match[1].trim()
  // Clean title for slug name
  const name = path.basename(file, '.md')
  
  // Create description based on title
  const description = `Claude Code ${title.toLowerCase()}: workflow guidelines, best practices, instructions, and integration examples`

  const frontmatter = `---
name: ${name}
description: "${description}"
updated: 2026-06-17
---

`

  fs.writeFileSync(file, frontmatter + content, 'utf8')
  console.log(`✅ Added frontmatter to: ${path.relative(ROOT, file)}`)
  count++
})

console.log(`\n🎉 Processed ${count} files.`)
