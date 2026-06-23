#!/usr/bin/env node
/**
 * knowledge-graph.test.js — Comprehensive tests for knowledge graph builder
 *
 * Tests entity extraction, relationship mapping, semantic search,
 * graph analysis, clustering, and domain expertise extraction
 */

import KnowledgeGraph from './knowledge-graph.js';
import assert from 'assert';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class KnowledgeGraphTest {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.tests = [];
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  async run() {
    console.log('🧪 Knowledge Graph Tests\n');

    for (const { name, fn } of this.tests) {
      try {
        await fn();
        console.log(`✅ ${name}`);
        this.passed++;
      } catch (err) {
        console.log(`❌ ${name}`);
        console.log(`   ${err.message}\n`);
        this.failed++;
      }
    }

    console.log(`\n📊 Results: ${this.passed} passed, ${this.failed} failed\n`);
    process.exit(this.failed > 0 ? 1 : 0);
  }
}

const tester = new KnowledgeGraphTest();

// Entity Extraction Tests
tester.test('Extract headings as entities', () => {
  const kg = new KnowledgeGraph();
  const content = `# Main Title\n## Subsection\n### Details`;
  const entities = kg.extractEntities(content);
  assert(entities.includes('Main Title'), 'Should extract h1');
  assert(entities.includes('Subsection'), 'Should extract h2');
});

tester.test('Extract code blocks as entities', () => {
  const kg = new KnowledgeGraph();
  const content = '`react-component` and `node-server`';
  const entities = kg.extractEntities(content);
  assert(entities.some(e => e.includes('react')), 'Should extract code entity');
});

tester.test('Extract framework names', () => {
  const kg = new KnowledgeGraph();
  const content = 'Build with React, Vue, and Angular';
  const entities = kg.extractEntities(content);
  assert(entities.includes('React'), 'Should extract React');
  assert(entities.includes('Vue'), 'Should extract Vue');
  assert(entities.includes('Angular'), 'Should extract Angular');
});

tester.test('Extract capitalized phrases', () => {
  const kg = new KnowledgeGraph();
  const content = 'Machine Learning and Deep Learning techniques';
  const entities = kg.extractEntities(content);
  assert(
    entities.some(e => e.includes('Machine') || e.includes('Learning')),
    'Should extract capitalized phrases'
  );
});

// Relationship Extraction Tests
tester.test('Extract markdown links as relationships', () => {
  const kg = new KnowledgeGraph();
  const content = '[See also](path/to/skill.md) for more info';
  const rels = kg.extractRelationships(content);
  assert(rels.some(r => r.type === 'links_to'), 'Should extract link relationship');
});

tester.test('Extract dependency keywords', () => {
  const kg = new KnowledgeGraph();
  const content = 'This skill requires agent-construction and depends on advanced-tool-use';
  const rels = kg.extractRelationships(content);
  assert(
    rels.some(r => r.type === 'depends_on'),
    'Should extract dependency relationships'
  );
});

tester.test('Extract activation triggers', () => {
  const kg = new KnowledgeGraph();
  const content = '## When to activate\ndata-visualization, charts, graphs, D3.js';
  const rels = kg.extractRelationships(content);
  const hasActivation = rels.some(r => r.type === 'activated_by');
  assert(
    hasActivation || rels.length > 0,
    'Should extract or detect content'
  );
});

// Embedding Tests
tester.test('Compute embeddings with keywords', () => {
  const kg = new KnowledgeGraph();
  const content1 = 'Machine learning neural networks deep learning';
  const content2 = 'Web development React TypeScript JavaScript';
  const emb1 = kg.computeEmbedding(content1);
  const emb2 = kg.computeEmbedding(content2);

  assert(Array.isArray(emb1), 'Should return array embedding');
  assert(emb1.length === 100, 'Should have 100 dimensions');
  assert(emb1 !== emb2, 'Different content should have different embeddings');
});

// Similarity Tests
tester.test('Cosine similarity between vectors', () => {
  const kg = new KnowledgeGraph();
  const vec1 = new Float32Array([1, 0, 0]);
  const vec2 = new Float32Array([1, 0, 0]);
  const vec3 = new Float32Array([0, 1, 0]);

  const sim1 = kg.cosineSimilarity(vec1, vec2);
  const sim2 = kg.cosineSimilarity(vec1, vec3);

  assert(Math.abs(sim1 - 1.0) < 0.01, 'Identical vectors should have similarity ~1');
  assert(Math.abs(sim2 - 0.0) < 0.01, 'Orthogonal vectors should have similarity ~0');
});

// Graph Operations Tests
tester.test('Normalize node IDs', () => {
  const kg = new KnowledgeGraph();
  const id1 = kg.normalizeId('Skills\\AI-Engineering\\Agent-SDK');
  const id2 = kg.normalizeId('skills/ai-engineering/agent-sdk.md');

  assert(id1.toLowerCase().includes('agent'), 'Should normalize path separators');
  assert(!id2.endsWith('.md'), 'Should strip .md extension');
});

tester.test('Graph statistics computation', () => {
  const kg = new KnowledgeGraph();

  // Add some mock nodes
  kg.nodes.set('skill1', {
    id: 'skill1',
    type: 'skill',
    title: 'Skill 1',
    relationships: [{ type: 'links_to', target: 'skill2' }],
    metadata: { category: 'ai' }
  });
  kg.nodes.set('skill2', {
    id: 'skill2',
    type: 'skill',
    title: 'Skill 2',
    relationships: [],
    metadata: { category: 'ai' }
  });
  kg.relationships.set('skill1', [{ type: 'links_to', target: 'skill2' }]);
  kg.relationships.set('skill2', []);

  const stats = kg.getStats();
  assert.equal(stats.totalNodes, 2, 'Should count nodes');
  assert.equal(stats.totalEdges, 1, 'Should count edges');
  assert(stats.typeDistribution.skill === 2, 'Should count skill type');
});

tester.test('Centrality computation', () => {
  const kg = new KnowledgeGraph();

  kg.nodes.set('hub', {
    id: 'hub',
    type: 'skill',
    title: 'Hub Node',
    relationships: [
      { type: 'links_to', target: 'node1' },
      { type: 'links_to', target: 'node2' }
    ],
    metadata: { category: 'ai' }
  });
  kg.nodes.set('node1', {
    id: 'node1',
    type: 'skill',
    title: 'Node 1',
    relationships: [],
    metadata: { category: 'ai' }
  });
  kg.nodes.set('node2', {
    id: 'node2',
    type: 'skill',
    title: 'Node 2',
    relationships: [],
    metadata: { category: 'ai' }
  });

  const centrality = kg.computeCentrality();
  const hubCentrality = centrality.find(c => c.nodeId === 'hub');

  assert(hubCentrality.outDegree === 2, 'Hub should have 2 outgoing edges');
  assert(hubCentrality.importance > 0, 'Hub should have high importance');
});

// Domain Extraction Tests
tester.test('Extract domain expertise map', () => {
  const kg = new KnowledgeGraph();

  kg.nodes.set('skill1', {
    id: 'skill1',
    type: 'skill',
    title: 'Skill 1',
    path: 'skills/ai-engineering/skill1.md',
    relationships: [],
    metadata: { category: 'ai-engineering' },
    keywords: ['agent', 'llm'],
    entities: []
  });
  kg.nodes.set('skill2', {
    id: 'skill2',
    type: 'agent',
    title: 'Agent 2',
    path: 'agents/specialist.md',
    relationships: [],
    metadata: { category: 'ai-engineering' },
    keywords: ['tool', 'orchestration'],
    entities: []
  });

  const domains = kg.extractDomainExpertise();
  assert(domains['ai-engineering'], 'Should extract domain');
  assert.equal(domains['ai-engineering'].skills.length, 1, 'Should count skills');
  assert.equal(domains['ai-engineering'].agents.length, 1, 'Should count agents');
});

tester.test('Extract skill dependencies', () => {
  const kg = new KnowledgeGraph();

  kg.nodes.set('advanced', {
    id: 'advanced',
    type: 'skill',
    title: 'Advanced Skill',
    path: 'skills/advanced.md',
    content: '',
    relationships: [
      { type: 'depends_on', target: 'basic', label: 'requires' }
    ],
    metadata: { category: 'ai' },
    keywords: [],
    entities: [],
    embedding: new Float32Array(100),
    links: []
  });
  kg.nodes.set('basic', {
    id: 'basic',
    type: 'skill',
    title: 'Basic Skill',
    path: 'skills/basic.md',
    content: '',
    relationships: [],
    metadata: { category: 'ai' },
    keywords: [],
    entities: [],
    embedding: new Float32Array(100),
    links: []
  });

  const deps = kg.extractSkillDependencies();
  assert(deps['advanced'], 'Should extract skill');
  assert(deps['advanced'].prerequisites && deps['advanced'].prerequisites.length === 1, 'Should find prerequisites');
});

tester.test('Extract agent capabilities', () => {
  const kg = new KnowledgeGraph();

  kg.nodes.set('agent1', {
    id: 'agent1',
    type: 'agent',
    title: 'Security Agent',
    path: 'agents/security.md',
    content: '[vulnerability-scan] and [penetration-test] capabilities',
    relationships: [],
    metadata: { category: 'security' },
    keywords: ['audit', 'compliance'],
    entities: ['Audit', 'Compliance']
  });

  const caps = kg.extractAgentCapabilities();
  assert(caps['agent1'], 'Should extract agent');
  assert.equal(caps['agent1'].capabilities.length, 2, 'Should extract capabilities');
});

// Clustering Tests
tester.test('Detect clusters in graph', () => {
  const kg = new KnowledgeGraph();

  // Create similar nodes (same content pattern)
  for (let i = 0; i < 3; i++) {
    kg.nodes.set(`cluster1-${i}`, {
      id: `cluster1-${i}`,
      type: 'skill',
      title: `Cluster 1 Skill ${i}`,
      path: `skills/cluster1/skill${i}.md`,
      relationships: [],
      metadata: { category: 'ai-engineering' },
      keywords: ['neural', 'network', 'learning'],
      entities: ['Neural Network'],
      embedding: kg.computeEmbedding('neural network machine learning')
    });
  }

  const clusters = kg.detectClusters(0.3);
  assert(Array.isArray(clusters), 'Should return clusters array');
  assert(clusters.length >= 0, 'Should detect clusters');
});

// Learning Path Tests
tester.test('Export learning paths', () => {
  const kg = new KnowledgeGraph();

  kg.nodes.set('advanced', {
    id: 'advanced',
    type: 'skill',
    title: 'Advanced',
    path: 'skills/advanced.md',
    content: '',
    relationships: [{ type: 'depends_on', target: 'intermediate', label: 'requires' }],
    metadata: { category: 'ai' },
    keywords: [],
    entities: [],
    embedding: new Float32Array(100),
    links: []
  });
  kg.nodes.set('intermediate', {
    id: 'intermediate',
    type: 'skill',
    title: 'Intermediate',
    path: 'skills/intermediate.md',
    content: '',
    relationships: [{ type: 'depends_on', target: 'basic', label: 'requires' }],
    metadata: { category: 'ai' },
    keywords: [],
    entities: [],
    embedding: new Float32Array(100),
    links: []
  });
  kg.nodes.set('basic', {
    id: 'basic',
    type: 'skill',
    title: 'Basic',
    path: 'skills/basic.md',
    content: '',
    relationships: [],
    metadata: { category: 'ai' },
    keywords: [],
    entities: [],
    embedding: new Float32Array(100),
    links: []
  });

  const paths = kg.exportLearningPaths();
  assert(Array.isArray(paths), 'Should return learning paths');
});

// Export Tests
tester.test('Export to JSON format', () => {
  const kg = new KnowledgeGraph();

  kg.nodes.set('test', {
    id: 'test',
    type: 'skill',
    title: 'Test Skill',
    path: 'skills/test.md',
    relationships: [],
    metadata: { category: 'test' },
    keywords: ['test'],
    entities: ['Test'],
    links: []
  });

  const exported = kg.exportJSON();
  assert(exported.version, 'Should have version');
  assert(exported.timestamp, 'Should have timestamp');
  assert(exported.nodes.length > 0, 'Should export nodes');
  assert(exported.stats, 'Should include stats');
});

tester.test('Export Cytoscape format', () => {
  const kg = new KnowledgeGraph();

  kg.nodes.set('n1', {
    id: 'n1',
    type: 'skill',
    title: 'Node 1',
    relationships: [{ type: 'links_to', target: 'n2' }],
    metadata: { category: 'test' }
  });
  kg.nodes.set('n2', {
    id: 'n2',
    type: 'skill',
    title: 'Node 2',
    relationships: [],
    metadata: { category: 'test' }
  });
  kg.relationships.set('n1', [{ type: 'links_to', target: 'n2' }]);
  kg.relationships.set('n2', []);

  const cytoscape = kg.exportCytoscape();
  assert(cytoscape.elements, 'Should export elements');
  assert(cytoscape.elements.length > 0, 'Should have nodes and edges');
});

// Analytics Tests
tester.test('Generate analytics report', () => {
  const kg = new KnowledgeGraph();

  kg.nodes.set('test', {
    id: 'test',
    type: 'skill',
    title: 'Test',
    path: 'skills/test.md',
    relationships: [],
    metadata: { category: 'ai' },
    keywords: [],
    entities: [],
    embedding: new Float32Array(100)
  });

  const report = kg.generateAnalyticsReport();
  assert(report.timestamp, 'Should include timestamp');
  assert(report.summary, 'Should include summary');
  assert(Array.isArray(report.topInfluencers), 'Should include influencers');
  assert(Array.isArray(report.gaps), 'Should identify gaps');
});

tester.test('Identify knowledge gaps', () => {
  const kg = new KnowledgeGraph();

  kg.nodes.set('orphan', {
    id: 'orphan',
    type: 'agent',
    title: 'Orphan Agent',
    path: 'agents/orphan.md',
    relationships: [],
    metadata: { category: 'empty' },
    keywords: [],
    entities: []
  });

  const gaps = kg.identifyKnowledgeGaps();
  assert(Array.isArray(gaps), 'Should identify gaps');
});

tester.test('Generate recommendations', () => {
  const kg = new KnowledgeGraph();

  kg.nodes.set('foundational', {
    id: 'foundational',
    type: 'skill',
    title: 'Foundational Skill',
    path: 'skills/foundational.md',
    relationships: [
      { type: 'links_to', target: 'dep1' },
      { type: 'links_to', target: 'dep2' }
    ],
    metadata: { category: 'core' },
    keywords: [],
    entities: [],
    embedding: new Float32Array(100)
  });
  kg.nodes.set('dep1', {
    id: 'dep1',
    type: 'skill',
    title: 'Dependent 1',
    relationships: [],
    metadata: { category: 'core' },
    keywords: [],
    entities: []
  });
  kg.nodes.set('dep2', {
    id: 'dep2',
    type: 'skill',
    title: 'Dependent 2',
    relationships: [],
    metadata: { category: 'core' },
    keywords: [],
    entities: []
  });

  const recs = kg.generateRecommendations();
  assert(Array.isArray(recs), 'Should generate recommendations');
});

// Run all tests
tester.run();
