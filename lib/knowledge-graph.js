#!/usr/bin/env node
/**
 * knowledge-graph.js — Knowledge graph construction from skills/agents/domains
 *
 * Features:
 * - Entity extraction from markdown content
 * - Relationship mapping (dependencies, categories, domains)
 * - Semantic search across knowledge base
 * - Visual knowledge graph explorer (HTML/JSON export)
 * - Graph analytics (centrality, clustering, paths)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

class KnowledgeGraph {
  constructor(options = {}) {
    this.nodes = new Map();
    this.edges = new Map();
    this.entities = new Map();
    this.relationships = new Map();
    this.embeddings = new Map();
    this.options = {
      minEntityLength: options.minEntityLength || 3,
      maxEntityLength: options.maxEntityLength || 100,
      semanticSimilarityThreshold: options.semanticSimilarityThreshold || 0.6,
      includeMetadata: options.includeMetadata !== false,
      ...options
    };
  }

  /**
   * Load knowledge base from filesystem
   */
  async loadFromFilesystem(rootDir = ROOT) {
    const skillsDir = path.join(rootDir, 'skills');
    const agentsDir = path.join(rootDir, 'agents');
    const guidesDir = path.join(rootDir, 'guides');

    try {
      if (fs.existsSync(skillsDir)) {
        await this.loadDirectory(skillsDir, 'skill');
      }
      if (fs.existsSync(agentsDir)) {
        await this.loadDirectory(agentsDir, 'agent');
      }
      if (fs.existsSync(guidesDir)) {
        await this.loadDirectory(guidesDir, 'guide');
      }
    } catch (err) {
      console.error('Error loading filesystem:', err.message);
    }

    return this;
  }

  /**
   * Load directory recursively, extracting entities
   */
  async loadDirectory(dir, entityType) {
    const files = this.walkDir(dir);
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      try {
        await this.addNodeFromFile(file, entityType);
      } catch (err) {
        console.error(`Error processing ${file}:`, err.message);
      }
    }
  }

  /**
   * Walk directory recursively
   */
  walkDir(dir) {
    let files = [];
    if (!fs.existsSync(dir)) return files;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files = files.concat(this.walkDir(fullPath));
      } else {
        files.push(fullPath);
      }
    }
    return files;
  }

  /**
   * Parse markdown file and create node with extracted entities
   */
  async addNodeFromFile(filePath, entityType) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relPath = path.relative(ROOT, filePath);
    const nodeId = this.normalizeId(relPath.replace(/\.md$/, ''));

    const metadata = this.extractMetadata(content, filePath);
    const entities = this.extractEntities(content);
    const relationships = this.extractRelationships(content);

    const node = {
      id: nodeId,
      type: entityType,
      title: metadata.title,
      path: relPath,
      content: content.slice(0, 1000),
      entities,
      relationships,
      metadata,
      embedding: this.computeEmbedding(content),
      keywords: this.extractKeywords(content),
      links: this.extractLinks(content),
      lastModified: fs.statSync(filePath).mtime
    };

    this.nodes.set(nodeId, node);
    this.entities.set(nodeId, entities);
    this.relationships.set(nodeId, relationships);
    this.embeddings.set(nodeId, node.embedding);
  }

  /**
   * Extract frontmatter and heading metadata
   */
  extractMetadata(content, filePath) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(frontmatterRegex);

    let metadata = {
      title: path.basename(filePath, '.md'),
      category: this.inferCategory(filePath),
      language: 'en',
      tier: 'Bronze',
      tags: []
    };

    if (match) {
      const frontmatter = match[1];
      const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n]+)["']?/);
      const categoryMatch = frontmatter.match(/category:\s*["']?([^"'\n]+)["']?/);
      const tierMatch = frontmatter.match(/tier:\s*["']?([^"'\n]+)["']?/);
      const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/);

      if (titleMatch) metadata.title = titleMatch[1].trim();
      if (categoryMatch) metadata.category = categoryMatch[1].trim();
      if (tierMatch) metadata.tier = tierMatch[1].trim();
      if (tagsMatch) {
        metadata.tags = tagsMatch[1]
          .split(',')
          .map(t => t.trim().replace(/['"]/g, ''));
      }
    }

    // Extract h1 as fallback title
    const h1Match = content.match(/^#\s+(.+)/m);
    if (h1Match && !match) {
      metadata.title = h1Match[1].trim();
    }

    return metadata;
  }

  /**
   * Infer category from file path
   */
  inferCategory(filePath) {
    const parts = filePath.split(path.sep);
    if (parts.length > 1) {
      return parts[parts.length - 2];
    }
    return 'uncategorized';
  }

  /**
   * Extract named entities from content
   */
  extractEntities(content) {
    const entities = new Set();

    // Headings as entities
    const headings = content.match(/^#+\s+(.+)$/gm) || [];
    headings.forEach(h => {
      const text = h.replace(/^#+\s+/, '').trim();
      if (text.length >= this.options.minEntityLength) {
        entities.add(text);
      }
    });

    // Code blocks and inline code
    const codeMatches = content.match(/`[^`]+`/g) || [];
    codeMatches.forEach(code => {
      const text = code.slice(1, -1);
      if (text.length >= this.options.minEntityLength && text.length <= 50) {
        entities.add(text);
      }
    });

    // Capitalized phrases (potential proper nouns)
    const phraseMatches = content.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g) || [];
    phraseMatches.forEach(phrase => {
      if (phrase.length >= this.options.minEntityLength) {
        entities.add(phrase);
      }
    });

    // Tool patterns: [tool-name]
    const toolMatches = content.match(/\[([a-z-]+)\]/g) || [];
    toolMatches.forEach(match => {
      const tool = match.slice(1, -1);
      if (tool.length >= this.options.minEntityLength) {
        entities.add(tool);
      }
    });

    // Table entries as entities
    const tableMatches = content.match(/^\|[\s\S]+?\|$/gm) || [];
    tableMatches.forEach(table => {
      const rows = table.split('\n');
      rows.forEach(row => {
        const cells = row.split('|').slice(1, -1);
        cells.forEach(cell => {
          const text = cell.trim();
          if (text.length >= this.options.minEntityLength && !text.includes('---')) {
            entities.add(text);
          }
        });
      });
    });

    // Framework/library names (common patterns)
    const libPatterns = /\b(React|Vue|Angular|D3|Express|FastAPI|Kubernetes|Docker|AWS|Azure|GCP|PostgreSQL|MongoDB|Redis|GraphQL|TypeScript|Python|Rust|Go|JavaScript)\b/g;
    const libMatches = content.match(libPatterns) || [];
    libMatches.forEach(lib => entities.add(lib));

    return Array.from(entities);
  }

  /**
   * Extract relationships/dependencies from content
   */
  extractRelationships(content) {
    const relationships = [];

    // Links to other files: [text](path/to/file.md)
    const linkRegex = /\[([^\]]+)\]\(([^\)]+\.md)\)/g;
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
      relationships.push({
        type: 'links_to',
        target: this.normalizeId(match[2].replace(/\.md$/, '')),
        label: match[1],
        context: 'link'
      });
    }

    // Dependency indicators - more flexible matching
    const depPatterns = [
      { keyword: 'requires', regex: /requires\s+([a-z0-9-]+(?:\s+(?:and|or)\s+[a-z0-9-]+)*)/gi },
      { keyword: 'depends on', regex: /depends\s+on\s+([a-z0-9-]+(?:\s+(?:and|or)\s+[a-z0-9-]+)*)/gi },
      { keyword: 'prerequisite', regex: /prerequisite[s]?[^:]*:\s*([a-z0-9-]+)/gi },
      { keyword: 'builds on', regex: /builds\s+on\s+([a-z0-9-]+)/gi }
    ];

    depPatterns.forEach(({ keyword, regex }) => {
      let depMatch;
      while ((depMatch = regex.exec(content)) !== null) {
        const targets = depMatch[1].split(/\s+(?:and|or)\s+/);
        targets.forEach(target => {
          const normalized = target.trim().toLowerCase().replace(/\s+/g, '-');
          if (normalized.length > 0) {
            relationships.push({
              type: 'depends_on',
              target: normalized,
              label: keyword,
              context: 'dependency'
            });
          }
        });
      }
    });

    // "When to activate" -> potential triggers
    if (content.toLowerCase().includes('when to activate')) {
      const activateIdx = content.toLowerCase().indexOf('when to activate');
      const section = content.slice(activateIdx, activateIdx + 500);
      const relatedEntities = this.extractEntities(section);
      relatedEntities.forEach(entity => {
        relationships.push({
          type: 'activated_by',
          target: entity.toLowerCase().replace(/\s+/g, '-'),
          context: 'trigger'
        });
      });
    }

    return relationships;
  }

  /**
   * Extract links from markdown
   */
  extractLinks(content) {
    const links = [];
    const linkRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      links.push({
        text: match[1],
        url: match[2]
      });
    }

    return links;
  }

  /**
   * Extract keywords from content using TF-IDF-like scoring
   */
  extractKeywords(content) {
    const words = content
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3);

    const stopwords = new Set([
      'the', 'and', 'that', 'this', 'with', 'from', 'when', 'what', 'which',
      'your', 'code', 'file', 'using', 'also', 'more', 'some', 'into'
    ]);

    const frequency = {};
    words.forEach(word => {
      if (!stopwords.has(word)) {
        frequency[word] = (frequency[word] || 0) + 1;
      }
    });

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * Compute simple embedding (bag of words + TF-IDF approximation)
   */
  computeEmbedding(content) {
    const keywords = this.extractKeywords(content);
    const vector = new Float32Array(100);

    keywords.forEach((keyword, idx) => {
      const hash = this.simpleHash(keyword) % 100;
      vector[hash] += 1.0 / (idx + 1);
    });

    return Array.from(vector);
  }

  /**
   * Simple hash function
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  /**
   * Semantic search using embedding similarity
   */
  semanticSearch(query, limit = 10) {
    const queryEmbedding = this.computeEmbedding(query);
    const results = [];

    this.nodes.forEach((node, nodeId) => {
      const similarity = this.cosineSimilarity(queryEmbedding, node.embedding);
      if (similarity > this.options.semanticSimilarityThreshold) {
        results.push({
          nodeId,
          title: node.title,
          similarity,
          type: node.type,
          path: node.path
        });
      }
    });

    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  /**
   * Cosine similarity between two vectors
   */
  cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < Math.min(vecA.length, vecB.length); i++) {
      dotProduct += vecA[i] * vecB[i];
      magnitudeA += vecA[i] * vecA[i];
      magnitudeB += vecB[i] * vecB[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }

  /**
   * Find related nodes by entity/relationship similarity
   */
  findRelated(nodeId, limit = 5) {
    const node = this.nodes.get(nodeId);
    if (!node) return [];

    const related = new Map();

    // By shared entities
    node.entities.forEach(entity => {
      this.nodes.forEach((otherNode, otherId) => {
        if (otherId === nodeId) return;
        if (otherNode.entities.includes(entity)) {
          related.set(otherId, (related.get(otherId) || 0) + 2);
        }
      });
    });

    // By shared keywords
    node.keywords.forEach(keyword => {
      this.nodes.forEach((otherNode, otherId) => {
        if (otherId === nodeId) return;
        if (otherNode.keywords.includes(keyword)) {
          related.set(otherId, (related.get(otherId) || 0) + 1);
        }
      });
    });

    // By shared category
    this.nodes.forEach((otherNode, otherId) => {
      if (otherId === nodeId) return;
      if (otherNode.metadata.category === node.metadata.category) {
        related.set(otherId, (related.get(otherId) || 0) + 0.5);
      }
    });

    // By embedding similarity
    this.nodes.forEach((otherNode, otherId) => {
      if (otherId === nodeId) return;
      const similarity = this.cosineSimilarity(node.embedding, otherNode.embedding);
      if (similarity > 0.3) {
        related.set(otherId, (related.get(otherId) || 0) + similarity * 1.5);
      }
    });

    return Array.from(related.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id, score]) => ({
        nodeId: id,
        title: this.nodes.get(id).title,
        score,
        type: this.nodes.get(id).type
      }));
  }

  /**
   * Detect clusters/communities in the graph
   */
  detectClusters(similarityThreshold = 0.4) {
    const clusters = [];
    const visited = new Set();
    const nodeArray = Array.from(this.nodes.entries());

    for (const [nodeId, node] of nodeArray) {
      if (visited.has(nodeId)) continue;

      const cluster = [nodeId];
      visited.add(nodeId);
      const queue = [nodeId];

      while (queue.length > 0) {
        const current = queue.shift();
        const currentNode = this.nodes.get(current);

        for (const [otherId, otherNode] of nodeArray) {
          if (visited.has(otherId)) continue;

          const similarity = this.cosineSimilarity(currentNode.embedding, otherNode.embedding);
          if (similarity >= similarityThreshold) {
            cluster.push(otherId);
            visited.add(otherId);
            queue.push(otherId);
          }
        }
      }

      if (cluster.length > 1) {
        clusters.push({
          nodes: cluster,
          size: cluster.length,
          representative: cluster[0],
          category: this.nodes.get(cluster[0]).metadata.category
        });
      }
    }

    return clusters.sort((a, b) => b.size - a.size);
  }

  /**
   * Find shortest path between two nodes
   */
  findPath(startId, endId) {
    const visited = new Set();
    const queue = [[startId, [startId]]];

    while (queue.length > 0) {
      const [current, path] = queue.shift();

      if (current === endId) return path;
      if (visited.has(current)) continue;

      visited.add(current);

      const node = this.nodes.get(current);
      if (!node) continue;

      node.relationships.forEach(rel => {
        const target = rel.target;
        if (!visited.has(target)) {
          queue.push([target, [...path, target]]);
        }
      });
    }

    return null;
  }

  /**
   * Compute graph centrality (degree, betweenness approximation)
   */
  computeCentrality() {
    const centrality = {};

    this.nodes.forEach((node, nodeId) => {
      const inDegree = Array.from(this.nodes.values()).filter(n =>
        n.relationships.some(r => r.target === nodeId)
      ).length;

      const outDegree = node.relationships.length;

      centrality[nodeId] = {
        nodeId,
        title: node.title,
        inDegree,
        outDegree,
        totalDegree: inDegree + outDegree,
        importance: (inDegree * 2 + outDegree) / Math.max(1, this.nodes.size)
      };
    });

    return Object.values(centrality)
      .sort((a, b) => b.importance - a.importance);
  }

  /**
   * Get graph statistics
   */
  getStats() {
    const allRelationships = Array.from(this.relationships.values()).flat();
    const relationshipTypes = {};

    allRelationships.forEach(rel => {
      relationshipTypes[rel.type] = (relationshipTypes[rel.type] || 0) + 1;
    });

    const typeDistribution = {};
    this.nodes.forEach(node => {
      typeDistribution[node.type] = (typeDistribution[node.type] || 0) + 1;
    });

    return {
      totalNodes: this.nodes.size,
      totalEdges: allRelationships.length,
      typeDistribution,
      relationshipTypes,
      averageRelationshipsPerNode:
        allRelationships.length / Math.max(1, this.nodes.size),
      categories: [...new Set(
        Array.from(this.nodes.values()).map(n => n.metadata.category)
      )]
    };
  }

  /**
   * Extract domain expertise map
   */
  extractDomainExpertise() {
    const domains = {};

    this.nodes.forEach(node => {
      const category = node.metadata.category || 'uncategorized';
      if (!domains[category]) {
        domains[category] = {
          name: category,
          nodes: [],
          skills: [],
          agents: [],
          guides: [],
          keywords: new Set(),
          totalConnections: 0
        };
      }

      domains[category].nodes.push(node.id);
      if (node.type === 'skill') domains[category].skills.push(node.id);
      if (node.type === 'agent') domains[category].agents.push(node.id);
      if (node.type === 'guide') domains[category].guides.push(node.id);

      node.keywords.forEach(kw => domains[category].keywords.add(kw));
      domains[category].totalConnections += node.relationships.length;
    });

    // Convert Set to Array for serialization
    Object.values(domains).forEach(domain => {
      domain.keywords = Array.from(domain.keywords);
    });

    return domains;
  }

  /**
   * Find skill prerequisites and dependencies
   */
  extractSkillDependencies() {
    const dependencies = {};

    this.nodes.forEach((node, nodeId) => {
      if (node.type !== 'skill') return;

      dependencies[nodeId] = {
        skill: node.title,
        path: node.path,
        prerequisites: [],
        dependents: [],
        relatedSkills: (node.relationships && node.relationships.length > 0)
          ? this.findRelated(nodeId, 5)
          : []
      };

      // Extract prerequisites from "requires" or "builds on" language
      if (node.relationships && Array.isArray(node.relationships)) {
        node.relationships.forEach(rel => {
          if (rel && rel.type === 'depends_on') {
            dependencies[nodeId].prerequisites.push({
              target: rel.target,
              label: rel.label
            });
          }
        });
      }

      // Find skills that depend on this one
      this.nodes.forEach((otherNode, otherId) => {
        if (otherId === nodeId) return;
        if (otherNode.relationships && Array.isArray(otherNode.relationships)) {
          otherNode.relationships.forEach(rel => {
            if (rel && rel.target === nodeId && rel.type === 'depends_on') {
              dependencies[nodeId].dependents.push(otherId);
            }
          });
        }
      });
    });

    return dependencies;
  }

  /**
   * Analyze role/agent capabilities
   */
  extractAgentCapabilities() {
    const agents = {};

    this.nodes.forEach((node, nodeId) => {
      if (node.type !== 'agent') return;

      agents[nodeId] = {
        name: node.title,
        path: node.path,
        category: node.metadata.category,
        capabilities: [],
        relatedSkills: [],
        tools: new Set(),
        domains: new Set()
      };

      // Extract tool usage from content
      const toolPattern = /\[([a-z-]+)\]/g;
      let match;
      while ((match = toolPattern.exec(node.content)) !== null) {
        agents[nodeId].tools.add(match[1]);
      }

      // Find related skills
      node.relationships.forEach(rel => {
        if (rel.type === 'activated_by' || rel.type === 'links_to') {
          agents[nodeId].relatedSkills.push(rel.target);
        }
      });

      // Extract domains
      agents[nodeId].capabilities = node.entities.slice(0, 10);
      agents[nodeId].tools = Array.from(agents[nodeId].tools);
      agents[nodeId].domains = Array.from(agents[nodeId].domains);
    });

    return agents;
  }

  /**
   * Normalize ID format
   */
  normalizeId(id) {
    return id
      .toLowerCase()
      .replace(/\\/g, '/')
      .replace(/\.md$/, '');
  }

  /**
   * Export as JSON
   */
  exportJSON() {
    const nodes = Array.from(this.nodes.values()).map(node => ({
      id: node.id,
      type: node.type,
      title: node.title,
      path: node.path,
      metadata: node.metadata,
      entities: node.entities,
      keywords: node.keywords,
      relationships: node.relationships,
      links: node.links
    }));

    return {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      stats: this.getStats(),
      nodes,
      centrality: this.computeCentrality(),
      domains: this.extractDomainExpertise(),
      skillDependencies: this.extractSkillDependencies(),
      agentCapabilities: this.extractAgentCapabilities(),
      clusters: this.detectClusters()
    };
  }

  /**
   * Export learning paths (prerequisite chains)
   */
  exportLearningPaths() {
    const paths = [];
    const skillDeps = this.extractSkillDependencies();
    const visited = new Set();

    const buildPath = (skillId, path = []) => {
      if (visited.has(skillId)) return path;
      visited.add(skillId);

      const skill = skillDeps[skillId];
      if (!skill) return path;

      const currentPath = [...path, skillId];

      if (!skill.prerequisites || skill.prerequisites.length === 0) {
        return currentPath;
      }

      const extendedPaths = skill.prerequisites.map(prereq =>
        buildPath(prereq.target, currentPath)
      );

      return extendedPaths[0] || currentPath;
    };

    Object.keys(skillDeps).forEach(skillId => {
      if (!visited.has(skillId)) {
        const path = buildPath(skillId);
        if (path && path.length > 1) {
          paths.push({
            start: path[0],
            end: path[path.length - 1],
            path: path.map(id => ({
              id,
              title: this.nodes.get(id)?.title || id
            })),
            length: path.length
          });
        }
      }
    });

    return paths.sort((a, b) => b.length - a.length);
  }

  /**
   * Export skill/agent matrix
   */
  exportCategoryMatrix() {
    const matrix = {};
    const domains = this.extractDomainExpertise();

    Object.entries(domains).forEach(([domain, data]) => {
      matrix[domain] = {
        totalSkills: data.skills.length,
        totalAgents: data.agents.length,
        totalGuides: data.guides.length,
        topKeywords: data.keywords.slice(0, 10),
        avgConnectivity: data.totalConnections / Math.max(1, data.nodes.length)
      };
    });

    return matrix;
  }

  /**
   * Export as Cytoscape.js format for visualization
   */
  exportCytoscape() {
    const elements = [];
    const nodeIds = new Set(this.nodes.keys());

    // Add nodes
    this.nodes.forEach((node, nodeId) => {
      elements.push({
        data: {
          id: nodeId,
          label: node.title,
          type: node.type,
          category: node.metadata.category,
          importance: this.computeCentrality().find(c => c.nodeId === nodeId)?.importance || 0
        }
      });
    });

    // Add edges from relationships
    const edgeSet = new Set();
    this.relationships.forEach((rels, sourceId) => {
      rels.forEach(rel => {
        if (nodeIds.has(rel.target)) {
          const edgeKey = `${sourceId}-${rel.target}-${rel.type}`;
          if (!edgeSet.has(edgeKey)) {
            elements.push({
              data: {
                source: sourceId,
                target: rel.target,
                label: rel.type,
                type: rel.type
              }
            });
            edgeSet.add(edgeKey);
          }
        }
      });
    });

    return { elements };
  }

  /**
   * Generate advanced analytics report
   */
  generateAnalyticsReport() {
    const stats = this.getStats();
    const centrality = this.computeCentrality();
    const domains = this.extractDomainExpertise();
    const clusters = this.detectClusters();
    const learningPaths = this.exportLearningPaths();

    return {
      timestamp: new Date().toISOString(),
      summary: stats,
      topInfluencers: centrality.slice(0, 20),
      domainBreakdown: Object.entries(domains).map(([key, data]) => ({
        domain: key,
        ...data,
        nodeCount: data.nodes.length
      })),
      clusters: clusters.slice(0, 10),
      learningPaths: learningPaths.slice(0, 10),
      gaps: this.identifyKnowledgeGaps(),
      recommendations: this.generateRecommendations()
    };
  }

  /**
   * Identify knowledge gaps
   */
  identifyKnowledgeGaps() {
    const domains = this.extractDomainExpertise();
    const gaps = [];

    Object.entries(domains).forEach(([domain, data]) => {
      const skillCount = data.skills.length;
      const agentCount = data.agents.length;

      if (skillCount === 0) {
        gaps.push({
          domain,
          issue: 'No skills defined',
          severity: 'high'
        });
      }
      if (agentCount === 0 && skillCount > 5) {
        gaps.push({
          domain,
          issue: 'No agents for high skill count',
          severity: 'medium'
        });
      }
      if (data.nodes.length < 3) {
        gaps.push({
          domain,
          issue: 'Low coverage',
          severity: 'low'
        });
      }
    });

    return gaps;
  }

  /**
   * Generate learning recommendations
   */
  generateRecommendations() {
    const centrality = this.computeCentrality();
    const recommendations = [];

    // Recommend foundational skills
    const foundational = centrality
      .filter(n => this.nodes.get(n.nodeId).type === 'skill')
      .slice(0, 5);

    if (foundational.length > 0) {
      recommendations.push({
        type: 'foundational',
        reason: 'Most connected skills',
        items: foundational.map(n => ({
          id: n.nodeId,
          title: n.title,
          importance: n.importance
        }))
      });
    }

    // Recommend domain exploration
    const domains = this.extractDomainExpertise();
    const underexplored = Object.entries(domains)
      .filter(([, data]) => data.nodes.length < 10)
      .map(([name]) => name);

    if (underexplored.length > 0) {
      recommendations.push({
        type: 'domain_exploration',
        reason: 'Underexplored domains',
        items: underexplored
      });
    }

    return recommendations;
  }

  /**
   * Generate HTML explorer
   */
  generateHTMLExplorer(outputPath) {
    const cytoscapeData = this.exportCytoscape();
    const stats = this.getStats();
    const analytics = this.generateAnalyticsReport();

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Claudient Knowledge Graph Explorer</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.28.1/cytoscape.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #fff;
      height: 100vh;
      overflow: hidden;
    }
    .container {
      display: flex;
      height: 100vh;
    }
    .sidebar {
      width: 300px;
      background: rgba(0, 0, 0, 0.3);
      border-right: 1px solid rgba(255, 255, 255, 0.1);
      overflow-y: auto;
      padding: 20px;
    }
    .sidebar h2 {
      font-size: 18px;
      margin-bottom: 15px;
      color: #00ff88;
    }
    .stat {
      margin-bottom: 12px;
      padding: 8px;
      background: rgba(0, 255, 136, 0.1);
      border-radius: 4px;
      font-size: 12px;
    }
    .stat-label {
      color: #00ff88;
      font-weight: 600;
    }
    .stat-value {
      color: #00ffff;
      font-weight: bold;
    }
    .search-box {
      width: 100%;
      padding: 10px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      color: #fff;
      margin-bottom: 15px;
      font-size: 12px;
    }
    .search-box::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
    .node-list {
      font-size: 11px;
      max-height: 500px;
      overflow-y: auto;
    }
    .node-item {
      padding: 6px;
      margin: 4px 0;
      background: rgba(0, 255, 136, 0.1);
      border-left: 2px solid #00ff88;
      border-radius: 2px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .node-item:hover {
      background: rgba(0, 255, 136, 0.2);
      border-left-color: #00ffff;
    }
    .graph-container {
      flex: 1;
      position: relative;
    }
    #cy {
      width: 100%;
      height: 100%;
    }
    .controls {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.5);
      padding: 10px;
      border-radius: 4px;
      z-index: 10;
    }
    button {
      background: #00ff88;
      color: #1a1a2e;
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      margin: 4px;
      font-size: 12px;
      transition: all 0.2s;
    }
    button:hover {
      background: #00ffff;
      transform: scale(1.05);
    }
    .info-panel {
      position: absolute;
      bottom: 10px;
      left: 10px;
      background: rgba(0, 0, 0, 0.7);
      padding: 15px;
      border-radius: 4px;
      border: 1px solid #00ff88;
      max-width: 400px;
      max-height: 200px;
      overflow-y: auto;
      z-index: 10;
      font-size: 12px;
      display: none;
    }
    .info-panel.active {
      display: block;
    }
    .info-panel h3 {
      color: #00ff88;
      margin-bottom: 8px;
    }
    .info-panel p {
      margin: 4px 0;
      color: #00ffff;
    }
    .tabs {
      display: flex;
      gap: 5px;
      margin-bottom: 15px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .tab-btn {
      padding: 8px 12px;
      background: rgba(0, 255, 136, 0.1);
      border: 1px solid rgba(0, 255, 136, 0.3);
      color: #00ff88;
      cursor: pointer;
      border-radius: 4px 4px 0 0;
      font-size: 11px;
      font-weight: 600;
      transition: all 0.2s;
    }
    .tab-btn.active {
      background: rgba(0, 255, 136, 0.3);
      border-color: #00ffff;
      color: #00ffff;
    }
    .tab-content {
      display: none;
      max-height: 400px;
      overflow-y: auto;
    }
    .tab-content.active {
      display: block;
    }
    .analytics-item {
      padding: 8px;
      margin: 4px 0;
      background: rgba(0, 255, 136, 0.05);
      border-left: 2px solid #00ff88;
      border-radius: 2px;
      font-size: 11px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="sidebar">
      <h2>Knowledge Graph</h2>
      <input type="text" class="search-box" id="searchBox" placeholder="Search nodes...">

      <div class="tabs">
        <button class="tab-btn active" onclick="switchTab('stats')">Stats</button>
        <button class="tab-btn" onclick="switchTab('analytics')">Analytics</button>
        <button class="tab-btn" onclick="switchTab('gaps')">Gaps</button>
      </div>

      <div id="stats" class="tab-content active">
        <h2 style="font-size: 14px; margin-bottom: 10px;">Statistics</h2>
        <div class="stat">
          <span class="stat-label">Total Nodes:</span>
          <span class="stat-value">${stats.totalNodes}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Total Edges:</span>
          <span class="stat-value">${stats.totalEdges}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Avg Connections:</span>
          <span class="stat-value">${stats.averageRelationshipsPerNode.toFixed(2)}</span>
        </div>

        <h2 style="font-size: 14px; margin: 15px 0 10px;">Type Distribution</h2>
        ${Object.entries(stats.typeDistribution).map(([type, count]) => `
          <div class="stat">
            <span class="stat-label">${type}:</span>
            <span class="stat-value">${count}</span>
          </div>
        `).join('')}

        <h2 style="font-size: 14px; margin: 15px 0 10px;">Top Nodes</h2>
        <div class="node-list" id="nodeList"></div>
      </div>

      <div id="analytics" class="tab-content">
        <h2 style="font-size: 14px; margin-bottom: 10px;">Analytics</h2>
        <h3 style="font-size: 12px; color: #00ffff; margin: 10px 0 5px;">Top Influencers</h3>
        <div id="influencers"></div>
        <h3 style="font-size: 12px; color: #00ffff; margin: 10px 0 5px;">Clusters</h3>
        <div id="clusters"></div>
      </div>

      <div id="gaps" class="tab-content">
        <h2 style="font-size: 14px; margin-bottom: 10px;">Knowledge Gaps</h2>
        <div id="gapsList"></div>
      </div>
    </div>

    <div class="graph-container">
      <div id="cy"></div>
      <div class="controls">
        <button onclick="cy.layout({ name: 'cose' }).run()">Force Layout</button>
        <button onclick="cy.layout({ name: 'circle' }).run()">Circle</button>
        <button onclick="cy.fit()">Fit View</button>
        <button onclick="cy.elements().unselectify().select()">Select All</button>
      </div>
      <div class="info-panel" id="infoPanel"></div>
    </div>
  </div>

  <script>
    const data = ${JSON.stringify(cytoscapeData)};
    const analytics = ${JSON.stringify(analytics)};

    function switchTab(tabName) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
      document.getElementById(tabName).classList.add('active');
      event.target.classList.add('active');

      if (tabName === 'analytics') populateAnalytics();
      if (tabName === 'gaps') populateGaps();
    }

    function populateAnalytics() {
      const influencersDiv = document.getElementById('influencers');
      analytics.topInfluencers.slice(0, 5).forEach(node => {
        const item = document.createElement('div');
        item.className = 'analytics-item';
        item.innerHTML = \`<strong>\${node.title}</strong><br/>Importance: \${(node.importance * 100).toFixed(0)}%\`;
        influencersDiv.appendChild(item);
      });

      const clustersDiv = document.getElementById('clusters');
      analytics.clusters.slice(0, 3).forEach(cluster => {
        const item = document.createElement('div');
        item.className = 'analytics-item';
        item.innerHTML = \`<strong>Cluster</strong><br/>Size: \${cluster.size} nodes<br/>Category: \${cluster.category}\`;
        clustersDiv.appendChild(item);
      });
    }

    function populateGaps() {
      const gapsDiv = document.getElementById('gapsList');
      if (analytics.gaps.length === 0) {
        gapsDiv.innerHTML = '<div class="analytics-item">No knowledge gaps detected</div>';
        return;
      }
      analytics.gaps.forEach(gap => {
        const item = document.createElement('div');
        item.className = 'analytics-item';
        const color = gap.severity === 'high' ? '#ff6600' : gap.severity === 'medium' ? '#ffff00' : '#00ff88';
        item.innerHTML = \`<strong style="color: \${color}">\${gap.domain}</strong><br/>\${gap.issue}\`;
        gapsDiv.appendChild(item);
      });
    }

    const cy = cytoscape({
      container: document.getElementById('cy'),
      elements: data.elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': el => {
              const typeColors = {
                skill: '#00ff88',
                agent: '#00ffff',
                guide: '#ff00ff',
                default: '#ffff00'
              };
              return typeColors[el.data('type')] || typeColors.default;
            },
            'label': 'data(label)',
            'width': el => 20 + (el.data('importance') || 0) * 50,
            'height': el => 20 + (el.data('importance') || 0) * 50,
            'font-size': '12px',
            'color': '#1a1a2e',
            'text-opacity': 0.8,
            'text-valign': 'center',
            'text-halign': 'center'
          }
        },
        {
          selector: 'edge',
          style: {
            'line-color': '#00ff88',
            'target-arrow-color': '#00ff88',
            'target-arrow-shape': 'triangle',
            'width': 2,
            'opacity': 0.5,
            'label': 'data(label)',
            'font-size': '10px'
          }
        },
        {
          selector: 'node:selected',
          style: {
            'background-color': '#ff6600',
            'border-width': 3,
            'border-color': '#ffff00'
          }
        },
        {
          selector: 'edge:selected',
          style: {
            'line-color': '#ffff00',
            'target-arrow-color': '#ffff00',
            'width': 3,
            'opacity': 1
          }
        }
      ],
      layout: {
        name: 'cose',
        directed: true,
        animate: true,
        animationDuration: 500,
        avoidOverlap: true,
        nodeSpacing: 50
      }
    });

    // Populate node list
    const nodeList = document.getElementById('nodeList');
    cy.nodes().sort((a, b) =>
      (b.data('importance') || 0) - (a.data('importance') || 0)
    ).slice(0, 20).forEach(node => {
      const item = document.createElement('div');
      item.className = 'node-item';
      item.textContent = node.data('label');
      item.onclick = () => {
        cy.elements().unselectify();
        node.selectify().select();
        cy.animate({ fit: { eles: node.neighborhood().union(node), padding: 50 } });
      };
      nodeList.appendChild(item);
    });

    // Search functionality
    document.getElementById('searchBox').addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      cy.elements().removeClass('highlight');
      cy.nodes().forEach(node => {
        if (node.data('label').toLowerCase().includes(query)) {
          node.addClass('highlight');
        }
      });
    });

    // Node click to show info
    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      const panel = document.getElementById('infoPanel');
      panel.classList.add('active');
      panel.innerHTML = \`
        <h3>\${node.data('label')}</h3>
        <p><strong>Type:</strong> \${node.data('type')}</p>
        <p><strong>Category:</strong> \${node.data('category')}</p>
        <p><strong>Importance:</strong> \${(node.data('importance') * 100).toFixed(1)}%</p>
        <p><strong>Connections:</strong> \${node.degree()}</p>
      \`;
    });

    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        document.getElementById('infoPanel').classList.remove('active');
      }
    });
  </script>
</body>
</html>`;

    fs.writeFileSync(outputPath, html, 'utf8');
    return outputPath;
  }
}

export default KnowledgeGraph;
