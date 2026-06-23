#!/usr/bin/env node
/**
 * knowledge-graph-cli.js — CLI for building and exploring knowledge graphs
 *
 * Usage:
 *   node scripts/knowledge-graph-cli.js build              # Build graph from filesystem
 *   node scripts/knowledge-graph-cli.js search <query>     # Semantic search
 *   node scripts/knowledge-graph-cli.js stats              # Graph statistics
 *   node scripts/knowledge-graph-cli.js centrality         # Node importance ranking
 *   node scripts/knowledge-graph-cli.js related <nodeId>   # Find related nodes
 *   node scripts/knowledge-graph-cli.js path <from> <to>   # Find path between nodes
 *   node scripts/knowledge-graph-cli.js export <format>    # Export graph
 *   node scripts/knowledge-graph-cli.js explore            # Generate HTML explorer
 *   node scripts/knowledge-graph-cli.js domains            # Show domain expertise
 *   node scripts/knowledge-graph-cli.js skills <domain>    # List domain skills
 *   node scripts/knowledge-graph-cli.js agents <domain>    # List domain agents
 *   node scripts/knowledge-graph-cli.js clusters           # Detect clusters
 *   node scripts/knowledge-graph-cli.js paths              # Show learning paths
 *   node scripts/knowledge-graph-cli.js gaps               # Identify knowledge gaps
 *   node scripts/knowledge-graph-cli.js analytics          # Show analytics report
 */

import fs from 'fs';
import path from 'path';
import KnowledgeGraph from '../lib/knowledge-graph.js';

const args = process.argv.slice(2);
const command = args[0] || 'help';

async function main() {
  try {
    const kg = new KnowledgeGraph();

    switch (command) {
      case 'build':
        await buildGraph(kg);
        break;
      case 'search':
        await searchGraph(kg, args.slice(1).join(' '));
        break;
      case 'stats':
        await showStats(kg);
        break;
      case 'centrality':
        await showCentrality(kg);
        break;
      case 'related':
        await findRelated(kg, args[1]);
        break;
      case 'path':
        await findPath(kg, args[1], args[2]);
        break;
      case 'export':
        await exportGraph(kg, args[1] || 'json');
        break;
      case 'explore':
        await generateExplorer(kg);
        break;
      case 'domains':
        await showDomains(kg);
        break;
      case 'skills':
        await showDomainSkills(kg, args[1]);
        break;
      case 'agents':
        await showDomainAgents(kg, args[1]);
        break;
      case 'clusters':
        await showClusters(kg);
        break;
      case 'paths':
        await showLearningPaths(kg);
        break;
      case 'gaps':
        await showGaps(kg);
        break;
      case 'analytics':
        await showAnalytics(kg);
        break;
      case 'help':
      default:
        showHelp();
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

async function buildGraph(kg) {
  console.log('📚 Building knowledge graph...');
  await kg.loadFromFilesystem();
  console.log(`✅ Graph built: ${kg.nodes.size} nodes loaded`);

  const stats = kg.getStats();
  console.log(`📊 ${stats.totalEdges} relationships found`);
  console.log(`📂 Categories: ${stats.categories.join(', ')}`);

  // Save to cache
  const cacheDir = path.resolve('./.claude/cache');
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  const cacheFile = path.join(cacheDir, 'knowledge-graph.json');
  fs.writeFileSync(cacheFile, JSON.stringify(kg.exportJSON(), null, 2));
  console.log(`💾 Cached to ${cacheFile}`);
}

async function searchGraph(kg, query) {
  if (!query) {
    console.error('❌ Please provide a search query');
    process.exit(1);
  }

  await kg.loadFromFilesystem();
  console.log(`🔍 Searching for: "${query}"\n`);

  const results = kg.semanticSearch(query, 15);

  if (results.length === 0) {
    console.log('No results found.');
    return;
  }

  console.log(`Found ${results.length} results:\n`);
  results.forEach((result, idx) => {
    const percent = (result.similarity * 100).toFixed(1);
    console.log(
      `${idx + 1}. [${result.type.toUpperCase()}] ${result.title}`
    );
    console.log(`   ${result.path}`);
    console.log(`   Relevance: ${percent}%\n`);
  });
}

async function showStats(kg) {
  await kg.loadFromFilesystem();
  const stats = kg.getStats();

  console.log('\n📊 Knowledge Graph Statistics\n');
  console.log(`Total Nodes:         ${stats.totalNodes}`);
  console.log(`Total Edges:         ${stats.totalEdges}`);
  console.log(
    `Avg Edges/Node:      ${stats.averageRelationshipsPerNode.toFixed(2)}`
  );

  console.log('\n📂 Type Distribution:');
  Object.entries(stats.typeDistribution).forEach(([type, count]) => {
    const percent = ((count / stats.totalNodes) * 100).toFixed(1);
    console.log(`   ${type}: ${count} (${percent}%)`);
  });

  console.log('\n🔗 Relationship Types:');
  Object.entries(stats.relationshipTypes).forEach(([type, count]) => {
    console.log(`   ${type}: ${count}`);
  });

  console.log('\n📋 Categories:');
  stats.categories.forEach(cat => {
    const count = Array.from(kg.nodes.values()).filter(
      n => n.metadata.category === cat
    ).length;
    console.log(`   ${cat}: ${count}`);
  });
}

async function showCentrality(kg) {
  await kg.loadFromFilesystem();
  const centrality = kg.computeCentrality();

  console.log('\n🌟 Node Importance Ranking\n');
  console.log('Most Connected & Influential Nodes:\n');

  centrality.slice(0, 20).forEach((node, idx) => {
    const importance = (node.importance * 100).toFixed(1);
    console.log(
      `${(idx + 1).toString().padStart(2)}. ${node.title.padEnd(40)} ` +
        `In:${node.inDegree.toString().padStart(3)} ` +
        `Out:${node.outDegree.toString().padStart(3)} ` +
        `Importance:${importance}%`
    );
  });
}

async function findRelated(kg, nodeId) {
  if (!nodeId) {
    console.error('❌ Please provide a node ID');
    process.exit(1);
  }

  await kg.loadFromFilesystem();

  // Try to find the node (flexible matching)
  const normalizedId = nodeId.toLowerCase().replace(/\s+/g, '-');
  let foundNodeId = null;

  for (const [id, node] of kg.nodes) {
    if (id.includes(normalizedId) ||
        node.title.toLowerCase().includes(nodeId.toLowerCase())) {
      foundNodeId = id;
      break;
    }
  }

  if (!foundNodeId) {
    console.error(`❌ Node not found: ${nodeId}`);
    process.exit(1);
  }

  const related = kg.findRelated(foundNodeId, 10);
  const node = kg.nodes.get(foundNodeId);

  console.log(`\n🔗 Related to: ${node.title}\n`);

  if (related.length === 0) {
    console.log('No related nodes found.');
    return;
  }

  related.forEach((rel, idx) => {
    const relNode = kg.nodes.get(rel.nodeId);
    console.log(
      `${idx + 1}. [${rel.type}] ${rel.title} (score: ${rel.score.toFixed(2)})`
    );
  });

  console.log(`\n📌 Key Entities: ${node.entities.slice(0, 10).join(', ')}`);
  console.log(`🏷️  Top Keywords: ${node.keywords.join(', ')}`);
}

async function findPath(kg, fromId, toId) {
  if (!fromId || !toId) {
    console.error('❌ Please provide both source and target node IDs');
    process.exit(1);
  }

  await kg.loadFromFilesystem();

  const path = kg.findPath(fromId, toId);

  if (!path) {
    console.log(`\n❌ No path found between "${fromId}" and "${toId}"`);
    return;
  }

  console.log(`\n🛤️  Path from "${fromId}" to "${toId}"\n`);
  path.forEach((nodeId, idx) => {
    const node = kg.nodes.get(nodeId);
    const title = node ? node.title : nodeId;
    console.log(`${idx + 1}. ${title}`);
  });
  console.log(`\n📏 Path length: ${path.length} nodes`);
}

async function exportGraph(kg, format) {
  await kg.loadFromFilesystem();

  const outputDir = './.claude/cache';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  switch (format.toLowerCase()) {
    case 'json':
      const jsonPath = path.join(outputDir, 'knowledge-graph.json');
      fs.writeFileSync(jsonPath, JSON.stringify(kg.exportJSON(), null, 2));
      console.log(`✅ Exported to ${jsonPath}`);
      break;

    case 'cytoscape':
      const cytoscapePath = path.join(outputDir, 'knowledge-graph-cytoscape.json');
      fs.writeFileSync(
        cytoscapePath,
        JSON.stringify(kg.exportCytoscape(), null, 2)
      );
      console.log(`✅ Exported to ${cytoscapePath}`);
      break;

    default:
      console.error(`❌ Unknown format: ${format}`);
      console.log('Available formats: json, cytoscape');
      process.exit(1);
  }
}

async function generateExplorer(kg) {
  await kg.loadFromFilesystem();

  const outputPath = './.claude/cache/knowledge-graph-explorer.html';
  const dir = path.dirname(outputPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  kg.generateHTMLExplorer(outputPath);
  console.log(`✅ Explorer generated: ${outputPath}`);
  console.log(`📖 Open in browser to visualize the knowledge graph`);
}

async function showDomains(kg) {
  await kg.loadFromFilesystem();
  const domains = kg.extractDomainExpertise();

  console.log('\n📚 Domain Expertise Map\n');
  Object.entries(domains)
    .sort((a, b) => b[1].nodes.length - a[1].nodes.length)
    .forEach(([domain, data]) => {
      console.log(`${domain}`);
      console.log(`  Skills: ${data.skills.length} | Agents: ${data.agents.length} | Guides: ${data.guides.length}`);
      console.log(`  Top Keywords: ${data.keywords.slice(0, 5).join(', ')}`);
      console.log();
    });
}

async function showDomainSkills(kg, domain) {
  if (!domain) {
    console.error('❌ Please provide a domain name');
    process.exit(1);
  }

  await kg.loadFromFilesystem();
  const domains = kg.extractDomainExpertise();

  if (!domains[domain]) {
    console.error(`❌ Domain not found: ${domain}`);
    process.exit(1);
  }

  console.log(`\n🎯 Skills in ${domain}\n`);
  domains[domain].skills.forEach((skillId, idx) => {
    const node = kg.nodes.get(skillId);
    if (node) {
      console.log(`${idx + 1}. ${node.title}`);
      console.log(`   ${node.path}`);
    }
  });
}

async function showDomainAgents(kg, domain) {
  if (!domain) {
    console.error('❌ Please provide a domain name');
    process.exit(1);
  }

  await kg.loadFromFilesystem();
  const domains = kg.extractDomainExpertise();

  if (!domains[domain]) {
    console.error(`❌ Domain not found: ${domain}`);
    process.exit(1);
  }

  console.log(`\n🤖 Agents in ${domain}\n`);
  domains[domain].agents.forEach((agentId, idx) => {
    const node = kg.nodes.get(agentId);
    if (node) {
      console.log(`${idx + 1}. ${node.title}`);
      console.log(`   ${node.path}`);
    }
  });
}

async function showClusters(kg) {
  await kg.loadFromFilesystem();
  const clusters = kg.detectClusters();

  console.log('\n🔗 Detected Clusters\n');
  clusters.slice(0, 10).forEach((cluster, idx) => {
    console.log(`${idx + 1}. Cluster (size: ${cluster.size})`);
    console.log(`   Category: ${cluster.category}`);
    console.log(`   Representative: ${kg.nodes.get(cluster.representative)?.title || cluster.representative}`);
    console.log();
  });
}

async function showLearningPaths(kg) {
  await kg.loadFromFilesystem();
  const paths = kg.exportLearningPaths();

  console.log('\n🛤️  Learning Paths\n');
  paths.slice(0, 5).forEach((path, idx) => {
    console.log(`${idx + 1}. ${path.path.map(p => p.title).join(' → ')}`);
    console.log(`   Length: ${path.length} skills\n`);
  });
}

async function showGaps(kg) {
  await kg.loadFromFilesystem();
  const gaps = kg.identifyKnowledgeGaps();

  console.log('\n⚠️  Knowledge Gaps\n');
  if (gaps.length === 0) {
    console.log('No significant gaps detected.');
    return;
  }

  gaps.forEach((gap, idx) => {
    const severity = gap.severity === 'high' ? '🔴' : gap.severity === 'medium' ? '🟡' : '🟢';
    console.log(`${idx + 1}. ${severity} ${gap.domain}`);
    console.log(`   ${gap.issue}`);
  });
  console.log();
}

async function showAnalytics(kg) {
  await kg.loadFromFilesystem();
  const analytics = kg.generateAnalyticsReport();

  console.log('\n📊 Knowledge Graph Analytics\n');
  console.log(`Timestamp: ${analytics.timestamp}`);
  console.log(`Total Nodes: ${analytics.summary.totalNodes}`);
  console.log(`Total Edges: ${analytics.summary.totalEdges}`);
  console.log(`Clusters: ${analytics.clusters.length}`);
  console.log(`Learning Paths: ${analytics.learningPaths.length}`);
  console.log(`Knowledge Gaps: ${analytics.gaps.length}\n`);

  console.log('Top Influencers:');
  analytics.topInfluencers.slice(0, 5).forEach((node, idx) => {
    console.log(`  ${idx + 1}. ${node.title} (${(node.importance * 100).toFixed(0)}%)`);
  });
}

function showHelp() {
  console.log(`
🧠 Knowledge Graph CLI

Usage:
  node scripts/knowledge-graph-cli.js <command> [options]

Commands:
  build                    Build knowledge graph from filesystem
  search <query>          Semantic search across nodes
  stats                   Show graph statistics
  centrality              Rank nodes by importance
  related <nodeId>        Find nodes related to given node
  path <from> <to>        Find path between two nodes
  export <format>         Export graph (json, cytoscape)
  explore                 Generate interactive HTML explorer
  domains                 Show domain expertise map
  skills <domain>         List skills in domain
  agents <domain>         List agents in domain
  clusters                Detect and show clusters
  paths                   Show learning paths
  gaps                    Identify knowledge gaps
  analytics               Show analytics report
  help                    Show this help message

Examples:
  node scripts/knowledge-graph-cli.js build
  node scripts/knowledge-graph-cli.js search "agent memory"
  node scripts/knowledge-graph-cli.js domains
  node scripts/knowledge-graph-cli.js skills "ai-engineering"
  node scripts/knowledge-graph-cli.js clusters
  node scripts/knowledge-graph-cli.js gaps
  node scripts/knowledge-graph-cli.js analytics
`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
