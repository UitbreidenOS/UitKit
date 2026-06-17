// checkpoint.js — manages session checkpointing and restoration
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

function createCheckpoint(taskSummary = '') {
  const absoluteDir = process.cwd()
  const claudeDir = path.join(absoluteDir, '.claude')

  if (!fs.existsSync(claudeDir)) {
    fs.mkdirSync(claudeDir, { recursive: true })
  }

  // Gather git status
  let gitChanges = []
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf-8' })
    gitChanges = status.split('\n').filter(Boolean).map(line => line.trim())
  } catch {}

  // Gather last modified files (last 30 mins)
  let recentlyModified = []
  try {
    const findCmd = process.platform === 'win32'
      ? `powershell -Command "Get-ChildItem -Recurse | Where-Object { $_.LastWriteTime -gt (Get-Date).AddMinutes(-30) -and !$_.PSIsContainer } | Select-Object -ExpandProperty FullName"`
      : `find . -type f -not -path '*/.*' -not -path '*/node_modules/*' -mmin -30`
    
    const modified = execSync(findCmd, { encoding: 'utf-8' })
    recentlyModified = modified.split('\n').filter(Boolean).map(f => f.trim())
  } catch {}

  const checkpoint = {
    timestamp: new Date().toISOString(),
    cwd: absoluteDir,
    taskSummary: taskSummary || 'General development workspace continuation',
    gitChanges,
    recentlyModified,
    env: {
      PATH: process.env.PATH ? 'configured' : 'missing',
      NODE_ENV: process.env.NODE_ENV || 'development'
    }
  }

  const checkpointPath = path.join(claudeDir, 'checkpoint.json')
  fs.writeFileSync(checkpointPath, JSON.stringify(checkpoint, null, 2), 'utf-8')

  console.log(`\n💾 Checkpoint saved successfully!`)
  console.log(`- File: .claude/checkpoint.json`)
  console.log(`- Changed files: ${gitChanges.length}`)
  console.log(`- Recent modifications: ${recentlyModified.length}`)
  if (taskSummary) console.log(`- Task Summary: "${taskSummary}"`)
  console.log()
}

function restoreCheckpoint() {
  const checkpointPath = path.join(process.cwd(), '.claude', 'checkpoint.json')

  if (!fs.existsSync(checkpointPath)) {
    console.error(`\n❌ Error: No checkpoint found at .claude/checkpoint.json`)
    console.error(`Run 'npx claudient checkpoint "task summary"' to create one.\n`)
    process.exit(1)
  }

  try {
    const checkpoint = JSON.parse(fs.readFileSync(checkpointPath, 'utf-8'))
    
    let report = `\n🔄 CLAUDIENT CHECKPOINT RESTORE REPORT\n`
    report += `━`.repeat(60) + `\n`
    report += `Saved At:        ${checkpoint.timestamp}\n`
    report += `Working Dir:     ${checkpoint.cwd}\n`
    report += `Active Task:     ${checkpoint.taskSummary}\n`
    report += `━`.repeat(60) + `\n\n`

    if (checkpoint.gitChanges.length) {
      report += `Uncommitted Git Changes:\n`
      checkpoint.gitChanges.forEach(f => report += `  - ${f}\n`)
      report += `\n`
    }

    if (checkpoint.recentlyModified.length) {
      report += `Recently Modified Files (within last 30 minutes of checkpoint):\n`
      checkpoint.recentlyModified.forEach(f => report += `  - ${f}\n`)
      report += `\n`
    }

    report += `Prompt to resume task:\n`
    report += `> "Resume execution from the checkpoint. Work context: ${checkpoint.taskSummary}. Recently edited files include: ${checkpoint.recentlyModified.slice(0, 5).join(', ')}."\n`

    console.log(report)
  } catch (err) {
    console.error(`Error reading checkpoint: ${err.message}`)
    process.exit(1)
  }
}

module.exports = { createCheckpoint, restoreCheckpoint }
