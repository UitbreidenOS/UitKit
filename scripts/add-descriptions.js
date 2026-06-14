#!/usr/bin/env node
/**
 * Add missing `description` field to skill frontmatter.
 * Reads each file, extracts context, and generates a description.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

// Get list of files missing description from validator
const output = execSync('node scripts/validate-frontmatter.js 2>&1 || true', { cwd: ROOT, encoding: 'utf-8' });
const missingFiles = output
  .split('\n')
  .filter(l => l.includes('Frontmatter missing "description"'))
  .map(l => l.trim().split(':')[0]);

console.log(`Found ${missingFiles.length} files missing description`);

// Map of known descriptions for common skill names
const KNOWN_DESCRIPTIONS = {
  'advanced-tool-use': 'Master advanced tool use patterns including chaining, parallel calls, and error recovery for complex Claude Code workflows',
  'agent-sdk': 'Build AI agents using the Claude Agent SDK with tool use, memory, and multi-step orchestration',
  'claude-batch': 'Run large-scale batch processing with Claude API for bulk text analysis, classification, and generation',
  'crewai': 'Build multi-agent crews with CrewAI framework for collaborative AI task execution',
  'managed-agents': 'Deploy and manage Claude agents with lifecycle management, monitoring, and scaling',
  'modal': 'Build serverless AI pipelines with Modal for cloud-based compute and inference',
  'prompt-caching': 'Optimize Claude API costs and latency with prompt caching strategies',
  'ptc': 'Implement prompt-to-code workflows for rapid prototyping and code generation',
  'claude-design-branding': 'Create consistent brand systems with Claude Design including logos, colors, and typography',
  'claude-design-tokens': 'Manage design tokens for consistent theming across Claude Design projects',
  'claude-design-workflow': 'Build end-to-end design workflows with Claude Design for rapid UI/UX iteration',
  'claude-design': 'Build production-ready UIs and prototypes with Claude Design',
  'embedded': 'Develop embedded systems firmware and hardware interfaces with Claude Code',
  'frontier-design': 'Push creative boundaries with frontier design techniques for AI-generated interfaces',
  'game-dev': 'Build games with Claude Code — game loops, physics, AI behaviors, and asset management',
  'iot': 'Develop IoT applications with device communication, sensor data, and edge computing',
  'phoenix': 'Build Elixir Phoenix web applications with LiveView, channels, and Ecto',
  'flutter': 'Build cross-platform mobile apps with Flutter and Dart',
  'android': 'Build Android applications with Kotlin, Jetpack Compose, and modern Android architecture',
  'angular': 'Build Angular applications with TypeScript, RxJS, and NgRx state management',
};

function generateDescription(filePath, name, content) {
  // Check known descriptions first
  const baseName = path.basename(filePath, '.md').toLowerCase();
  if (KNOWN_DESCRIPTIONS[baseName]) {
    return KNOWN_DESCRIPTIONS[baseName];
  }

  // Try to extract first meaningful paragraph
  const bodyContent = content.split('---').slice(2).join('---').trim();
  const lines = bodyContent.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('```'));
  let firstLine = lines[0]?.trim() || '';
  
  // Clean up markdown formatting
  firstLine = firstLine.replace(/\*\*/g, '').replace(/\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  if (firstLine.length > 10) {
    // Use first line as base, cap at 150 chars
    let desc = firstLine.length > 150 ? firstLine.substring(0, 147) + '...' : firstLine;
    // Ensure it starts with a capital letter
    desc = desc.charAt(0).toUpperCase() + desc.slice(1);
    return desc;
  }

  // Fallback: generate from name
  const prettyName = baseName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return `Comprehensive guide for ${prettyName.toLowerCase()} workflows, best practices, and implementation patterns`;
}

let fixed = 0;
let errors = [];

for (const file of missingFiles) {
  const fullPath = path.join(ROOT, file);
  
  try {
    const content = fs.readFileSync(fullPath, 'utf-8');
    
    // Extract name from frontmatter
    const nameMatch = content.match(/^name:\s*(.+)$/m);
    const name = nameMatch ? nameMatch[1].trim().replace(/["']/g, '') : path.basename(file, '.md');
    
    // Generate description
    const description = generateDescription(file, name, content);
    
    // Add description after name line in frontmatter
    let newContent;
    if (nameMatch) {
      // Insert description after the name line
      const insertPoint = content.indexOf(nameMatch[0]) + nameMatch[0].length;
      newContent = content.substring(0, insertPoint) + `\ndescription: ${description}` + content.substring(insertPoint);
    } else {
      // Insert after first ---
      const firstDash = content.indexOf('---');
      if (firstDash === -1) continue;
      const secondDash = content.indexOf('---', firstDash + 3);
      if (secondDash === -1) continue;
      newContent = content.substring(0, secondDash) + `description: ${description}\n` + content.substring(secondDash);
    }
    
    fs.writeFileSync(fullPath, newContent, 'utf-8');
    fixed++;
  } catch (err) {
    errors.push(`${file}: ${err.message}`);
  }
}

console.log(`\nFixed: ${fixed}/${missingFiles.length}`);
if (errors.length) {
  console.log(`Errors: ${errors.length}`);
  errors.forEach(e => console.log(`  ${e}`));
}
