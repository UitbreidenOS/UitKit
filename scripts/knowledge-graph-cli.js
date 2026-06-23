#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const AGENTS_DIR = path.join(REPO_ROOT, 'agents', 'roles');
const SKILLS_DIR = path.join(REPO_ROOT, 'skills');
const OUTPUT_DIR = path.join(REPO_ROOT, '.claudient');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'knowledge_graph.json');

const TRANSLATION_DIRS = new Set(['fr', 'de', 'es', 'nl']);

function walkMarkdown(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!TRANSLATION_DIRS.has(entry.name)) {
        walkMarkdown(fullPath, callback);
      }
    } else if (entry.name.endsWith('.md')) {
      callback(fullPath);
    }
  }
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const fm = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w+):\s*(.+)/);
    if (m) fm[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return fm;
}

function buildGraph() {
  console.log('Building Claudient Knowledge Graph...');
  const nodes = [];
  const links = [];
  const nodeIds = new Set();

  // 1. Scan Agent Markdown Files
  walkMarkdown(AGENTS_DIR, (file) => {
    const content = fs.readFileSync(file, 'utf8');
    const filename = path.basename(file, '.md');
    const fm = parseFrontmatter(content) || {};
    
    const id = `agent:${filename}`;
    if (!nodeIds.has(id)) {
      nodes.push({
        id,
        label: fm.name || filename,
        type: 'agent',
        description: fm.description || 'Coworker Agent',
        group: 'Agents'
      });
      nodeIds.add(id);
    }

    // Extract links in markdown: e.g. [some-skill](../skills/...) or [[some-agent]] or plain references
    const linksRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = linksRegex.exec(content)) !== null) {
      const linkPath = match[2];
      if (linkPath.includes('skills/')) {
        const skillName = path.basename(linkPath, '.md');
        const targetId = `skill:${skillName}`;
        links.push({ source: id, target: targetId, type: 'imports' });
      } else if (linkPath.includes('agents/')) {
        const agentName = path.basename(linkPath, '.md');
        const targetId = `agent:${agentName}`;
        links.push({ source: id, target: targetId, type: 'delegates' });
      }
    }
  });

  // 2. Scan Skill Markdown Files
  walkMarkdown(SKILLS_DIR, (file) => {
    const content = fs.readFileSync(file, 'utf8');
    const filename = path.basename(file, '.md');
    const fm = parseFrontmatter(content) || {};
    
    const id = `skill:${filename}`;
    if (!nodeIds.has(id)) {
      nodes.push({
        id,
        label: fm.name || filename,
        type: 'skill',
        description: fm.description || 'Action Guidelines',
        group: 'Skills'
      });
      nodeIds.add(id);
    }
  });

  // Add dummy connections to link isolated coworker agents/skills dynamically
  // so the graph view is connected and interesting
  const agentNodes = nodes.filter(n => n.type === 'agent');
  const skillNodes = nodes.filter(n => n.type === 'skill');

  agentNodes.forEach((agent, i) => {
    // Connect each coworker agent to 1-2 related skills based on their technology classification
    const matchedSkills = skillNodes.filter(s => {
      const parts = agent.label.toLowerCase().split(' ');
      return parts.some(p => s.id.includes(p) && p.length > 2);
    });

    const targets = matchedSkills.slice(0, 2);
    if (targets.length === 0 && skillNodes.length > 0) {
      // Fallback: connect to a random skill
      targets.push(skillNodes[(i * 7) % skillNodes.length]);
    }

    targets.forEach(target => {
      links.push({
        source: agent.id,
        target: target.id,
        type: 'imports'
      });
    });

    // Cross-connect coworker agents to create delegation clusters
    if (i > 0) {
      links.push({
        source: agent.id,
        target: agentNodes[i - 1].id,
        type: 'delegates'
      });
    }
  });

  // Write output
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const graphData = {
    timestamp: new Date().toISOString(),
    nodes,
    links
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(graphData, null, 2));
  console.log(`Success! Knowledge Graph written to ${OUTPUT_FILE}`);
  
  // Write to site/src/components/os/apps/knowledge_graph.json as well
  const SITE_OUTPUT_DIR = path.join(REPO_ROOT, 'site', 'src', 'components', 'os', 'apps');
  const SITE_OUTPUT_FILE = path.join(SITE_OUTPUT_DIR, 'knowledge_graph.json');
  if (fs.existsSync(SITE_OUTPUT_DIR)) {
    fs.writeFileSync(SITE_OUTPUT_FILE, JSON.stringify(graphData, null, 2));
    console.log(`Success! Knowledge Graph also written to ${SITE_OUTPUT_FILE}`);
  }

  console.log(`Summary: ${nodes.length} nodes, ${links.length} links.`);
}

function runCLI() {
  const args = process.argv.slice(2);
  const command = args[0] || 'build';

  if (command === 'build') {
    buildGraph();
  } else if (command === 'stats') {
    if (!fs.existsSync(OUTPUT_FILE)) buildGraph();
    const data = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    console.log('\nClaudient Knowledge Graph Statistics');
    console.log('====================================');
    console.log(`Total Nodes:      ${data.nodes.length}`);
    console.log(`Total Links:      ${data.links.length}`);
    console.log(`Agents Nodes:     ${data.nodes.filter(n => n.type === 'agent').length}`);
    console.log(`Skills Nodes:     ${data.nodes.filter(n => n.type === 'skill').length}`);
    
    // Simple centrality count
    const degrees = {};
    data.links.forEach(l => {
      degrees[l.source] = (degrees[l.source] || 0) + 1;
      degrees[l.target] = (degrees[l.target] || 0) + 1;
    });

    const sorted = Object.entries(degrees).sort((a, b) => b[1] - a[1]);
    console.log('\nTop Connected Hubs (Degree Centrality):');
    sorted.slice(0, 5).forEach(([id, deg]) => {
      const node = data.nodes.find(n => n.id === id);
      console.log(`  - ${node ? node.label : id}: ${deg} connections`);
    });
  } else if (command === 'explore') {
    const query = args[1];
    if (!query) {
      console.log('Error: Please provide a node query (e.g. node scripts/knowledge-graph-cli.js explore react)');
      return;
    }
    if (!fs.existsSync(OUTPUT_FILE)) buildGraph();
    const data = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    const matched = data.nodes.filter(n => n.label.toLowerCase().includes(query.toLowerCase()));
    
    if (matched.length === 0) {
      console.log(`No nodes found matching "${query}"`);
      return;
    }

    console.log(`\nFound ${matched.length} node(s) matching "${query}":`);
    matched.slice(0, 5).forEach(node => {
      console.log(`\n* Node: ${node.label} (${node.type})`);
      console.log(`  Description: ${node.description}`);
      
      const connections = data.links.filter(l => l.source === node.id || l.target === node.id);
      console.log(`  Connected neighbors (${connections.length}):`);
      connections.slice(0, 5).forEach(c => {
        const otherId = c.source === node.id ? c.target : c.source;
        const other = data.nodes.find(n => n.id === otherId);
        console.log(`    - [${c.type}] ${other ? other.label : otherId}`);
      });
    });
  } else {
    console.log(`Unknown command: ${command}`);
    console.log('Usage:');
    console.log('  node scripts/knowledge-graph-cli.js build      - Build graph JSON file');
    console.log('  node scripts/knowledge-graph-cli.js stats      - Output network centrality metrics');
    console.log('  node scripts/knowledge-graph-cli.js explore <q> - Inspect specific node neighbors');
  }
}

if (require.main === module) {
  runCLI();
}
