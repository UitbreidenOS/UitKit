# Knowledge Graph System

Enterprise-grade knowledge graph builder for Claudient skills, agents, and domains.

## Features

### Entity Extraction
- Heading extraction (h1-h6 as primary entities)
- Code block analysis (inline and fenced)
- Framework/library detection (React, Vue, Angular, etc.)
- Capitalized phrase extraction (proper nouns)
- Table data parsing
- Tool pattern matching

### Relationship Mapping
- Markdown link extraction
- Dependency detection (requires, depends on, prerequisite)
- Activation trigger identification
- Type-aware relationship classification
- Cross-domain relationship tracking

### Semantic Search
- TF-IDF keyword extraction
- Embedding-based similarity search
- Cosine similarity computation
- Context-aware relevance ranking
- Threshold-configurable results

### Graph Analytics
- Node centrality computation (in/out degree, betweenness)
- Cluster detection (community discovery)
- Learning path extraction (skill prerequisites)
- Domain expertise mapping
- Knowledge gap identification
- Recommendation generation

### Visualizations
- Interactive HTML explorer (Cytoscape.js)
- Force-directed layout
- Node importance sizing
- Relationship type coloring
- Search-based filtering
- Statistics dashboard
- Analytics tabbed interface

### Exports
- JSON (comprehensive graph data)
- Cytoscape.js format (for visualization)
- HTML explorer (interactive dashboard)
- Learning path sequences
- Domain matrices

## CLI Commands

```bash
# Build
node scripts/knowledge-graph-cli.js build

# Search
node scripts/knowledge-graph-cli.js search "agent memory"

# Statistics
node scripts/knowledge-graph-cli.js stats

# Ranking
node scripts/knowledge-graph-cli.js centrality

# Related
node scripts/knowledge-graph-cli.js related "agent-construction"

# Pathfinding
node scripts/knowledge-graph-cli.js path "from" "to"

# Export
node scripts/knowledge-graph-cli.js export json
node scripts/knowledge-graph-cli.js export cytoscape

# Visualize
node scripts/knowledge-graph-cli.js explore

# Domains
node scripts/knowledge-graph-cli.js domains
node scripts/knowledge-graph-cli.js skills "ai-engineering"
node scripts/knowledge-graph-cli.js agents "ai-engineering"

# Analysis
node scripts/knowledge-graph-cli.js clusters
node scripts/knowledge-graph-cli.js paths
node scripts/knowledge-graph-cli.js gaps
node scripts/knowledge-graph-cli.js analytics
```

## API Usage

```javascript
import KnowledgeGraph from './lib/knowledge-graph.js';

const kg = new KnowledgeGraph();
await kg.loadFromFilesystem();

// Search
const results = kg.semanticSearch('query', 10);

// Find related
const related = kg.findRelated('nodeId', 5);

// Centrality
const centrality = kg.computeCentrality();

// Clusters
const clusters = kg.detectClusters(0.4);

// Domain expertise
const domains = kg.extractDomainExpertise();

// Skill dependencies
const deps = kg.extractSkillDependencies();

// Agent capabilities
const agents = kg.extractAgentCapabilities();

// Learning paths
const paths = kg.exportLearningPaths();

// Analytics
const report = kg.generateAnalyticsReport();

// Export
const json = kg.exportJSON();
const cytoscape = kg.exportCytoscape();
kg.generateHTMLExplorer('./output.html');
```

## Testing

```bash
node lib/knowledge-graph.test.js
```

Comprehensive test coverage for all major features.
