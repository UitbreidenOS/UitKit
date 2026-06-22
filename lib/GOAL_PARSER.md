# Goal Parser — NLP-Based Goal Decomposition

Parse complex engineering goals into structured subtasks, dependencies, and acceptance criteria using regex pattern matching and keyword extraction.

## Purpose

Convert unstructured goal statements into actionable project plans with:
- Subtask generation with phase ordering
- Dependency inference across tasks
- Context-aware acceptance criteria
- Complexity and scope estimation

## Features

### Pattern Recognition

Detects 5 common goal patterns:

```
add:          "Add X to Y" / "Add X across Y"
distribute:   "Implement Z across N services"
integrate:    "Integrate A and B [to/in/on Y]"
build:        "Build X for Y"
setup:        "Setup X with Y"
```

### Keyword Categorization

Organizes goals by domain:

| Category | Keywords |
|---|---|
| `auth` | oauth2, oauth, saml, ldap, oidc, jwt, mfa, 2fa, authentication |
| `infrastructure` | microservice, service, container, deployment, server, cluster |
| `database` | database, db, sql, postgres, mysql, mongodb, cache, redis |
| `api` | api, endpoint, rest, graphql, grpc, websocket |
| `testing` | test, unit test, integration test, e2e, qa, validation |
| `documentation` | doc, documentation, readme, guide, wiki |
| `deployment` | deploy, release, rollout, stage, production |

### Dependency Inference

Automatically infers task ordering based on goal content:

```
Auth goals → Infrastructure → API layer → Testing → Deployment
Database goals → Schema changes → Data validation → Testing
Multi-service rollouts → Planning → Implementation → Distributed rollout
```

### Phase-Based Subtask Generation

Breaks goals into 6 execution phases:

1. **Planning** — Architecture & design review
2. **Implementation** — Core feature development
3. **Rollout** — Distribution across services (multi-service goals only)
4. **Testing** — Security, unit, integration, e2e
5. **Documentation** — Guides, runbooks, training
6. **Deployment** — Staged rollout with monitoring

## API

### `parseGoal(goalText: string): ParsedGoal`

Parse a single goal string.

**Input:** `"Add OAuth2 + SAML across 15 microservices"`

**Output:**

```json
{
  "goal": "Add OAuth2 + SAML across 15 microservices",
  "pattern": "add",
  "components": {
    "quantifier": { "count": 15, "unit": "microservices" },
    "categories": {
      "auth": ["oauth2", "saml"],
      "infrastructure": ["microservices"]
    },
    "primary_feature": "OAuth2 + SAML",
    "target": "15 microservices"
  },
  "subtasks": [
    {
      "id": "task-1",
      "phase": "planning",
      "title": "Architecture & Design Review",
      "description": "Document architecture, security requirements, and integration points",
      "priority": "high",
      "depends_on": []
    },
    // ... more tasks
  ],
  "dependencies": {
    "infrastructure": "Affects 15 microservices",
    "database": "May need user/credential storage",
    "api": "Auth layer typically sits between API gateway and services",
    "testing": "Integration testing across all units required",
    "deployment": "Coordinated rollout strategy needed"
  },
  "acceptance_criteria": [
    "All code changes peer-reviewed and approved",
    "Automated tests pass (unit + integration)",
    "Authentication mechanism verified working",
    "Authorization policies enforced across all endpoints",
    // ... more criteria
  ],
  "metadata": {
    "complexity": "medium",
    "scope": "15 microservices",
    "estimated_phases": ["planning", "implementation", "rollout", "testing", "deployment"]
  }
}
```

### `parseGoals(goals: string[]): ParsedGoal[]`

Parse multiple goal strings.

```javascript
const results = parseGoals([
  'Add OAuth2 to API',
  'Deploy Redis cache',
  'Implement rate limiting',
]);
```

### `formatGoal(parsed: ParsedGoal): string`

Format parsed goal as human-readable text.

```javascript
const formatted = formatGoal(parseGoal('Add OAuth2 across 15 services'));
console.log(formatted);
```

Output:
```
GOAL: Add OAuth2 + SAML across 15 microservices

Pattern: add
Categories: auth, infrastructure
Scope: 15 microservices

Complexity: medium
Estimated phases: planning → implementation → rollout → testing → deployment

SUBTASKS (5):
  task-1: [planning] Architecture & Design Review (high)
  task-2: [implementation] Implement Authentication/Authorization (high)
    ↳ depends on: task-1
  task-3: [rollout] Rollout across 15 microservices (high)
    ↳ depends on: task-1
  task-4: [testing] Security & Integration Testing (high)
    ↳ depends on: task-1, task-2
  task-5: [deployment] Staged Deployment & Monitoring (high)
    ↳ depends on: task-4

DEPENDENCIES:
  • infrastructure: Affects 15 microservices
  • database: May need user/credential storage
  • api: Auth layer typically sits between API gateway and services
  • testing: Integration testing across all units required
  • deployment: Coordinated rollout strategy needed

ACCEPTANCE CRITERIA (13):
  1. All code changes peer-reviewed and approved
  2. Automated tests pass (unit + integration)
  3. Authentication mechanism verified working
  4. Authorization policies enforced across all endpoints
  5. Security audit completed and signed off
  6. No unauthorized access vulnerabilities found
  7. Deployed successfully to all 15 microservices
  8. Zero-downtime deployment verified
  9. All instances in healthy state post-deployment
  10. Runbooks and troubleshooting guides documented
  11. Team trained on new features/changes
  12. Monitoring and alerting configured
  13. Metrics baseline established
```

## Usage Examples

### Basic Goal Parsing

```javascript
const { parseGoal } = require('./goal-parser');

const result = parseGoal('Add OAuth2 + SAML across 15 microservices');

console.log('Complexity:', result.metadata.complexity);
console.log('Phases:', result.metadata.estimated_phases);
console.log('Tasks:', result.subtasks.length);
console.log('Criteria:', result.acceptance_criteria.length);
```

### Extract Subtasks

```javascript
const result = parseGoal('Implement rate limiting to the API gateway');

result.subtasks.forEach(task => {
  console.log(`${task.id}: ${task.title}`);
  if (task.depends_on.length > 0) {
    console.log(`  Depends on: ${task.depends_on.join(', ')}`);
  }
});
```

### Analyze Dependencies

```javascript
const result = parseGoal('Add JWT authentication to 12 backend services');

Object.entries(result.dependencies).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});
```

### Format for Display

```javascript
const { parseGoal, formatGoal } = require('./goal-parser');

const parsed = parseGoal('Integrate Redis cache across all services');
const readable = formatGoal(parsed);
console.log(readable);
```

### Batch Processing

```javascript
const { parseGoals } = require('./goal-parser');

const goals = [
  'Add OAuth2 to API',
  'Deploy Kubernetes cluster',
  'Migrate database to PostgreSQL',
];

const results = parseGoals(goals);

results.forEach(result => {
  console.log(`${result.goal} → ${result.metadata.complexity} complexity`);
});
```

## Complexity Scoring

Complexity is determined by number of subtasks:

- **Low** — 1–3 subtasks (simple feature additions)
- **Medium** — 4–5 subtasks (multi-component changes)
- **High** — 6+ subtasks (enterprise-scale initiatives)

## Supported Goal Formats

The parser handles these natural-language patterns:

```
Add OAuth2 + SAML across 15 microservices
Implement rate limiting to the API gateway
Integrate Redis cache across all services
Deploy Kubernetes across 5 staging clusters
Build authentication layer for mobile app
Setup PostgreSQL with replication across 3 nodes
Enable mTLS on 20 services
Migrate database to cloud across all regions
Add logging and monitoring to 8 backend services
Deploy multi-region failover strategy
```

## Extensibility

### Add Custom Patterns

Edit `PATTERNS` object:

```javascript
const PATTERNS = {
  myPattern: /^(?:do|make)\s+([^,]+?)\s+(?:in|on)\s+(.+)$/i,
  // ...
};
```

### Add Category Keywords

Edit `KEYWORDS` object:

```javascript
const KEYWORDS = {
  myCategory: ['keyword1', 'keyword2'],
  // ...
};
```

### Customize Dependency Inference

Modify `inferDependencies()` function to add rules:

```javascript
if (categories.myCategory && categories.infrastructure) {
  deps.myCategory = 'Custom dependency rule';
}
```

### Customize Subtasks

Modify `generateSubtasks()` to add phase-specific logic:

```javascript
if (categories.myCategory) {
  subtasks.push({
    id: `task-${order++}`,
    phase: 'myPhase',
    title: 'My Custom Task',
    // ...
  });
}
```

## Testing

Run the test suite:

```bash
node lib/goal-parser.test.js
```

All 13 tests validate:
- Pattern matching accuracy
- Quantifier extraction
- Category detection
- Subtask generation
- Dependency inference
- Acceptance criteria
- Edge case handling
- Batch processing
- Output formatting

## Performance

- Single goal parsing: ~1ms
- Batch parsing (100 goals): ~100ms
- No external dependencies (pure JavaScript)
- Suitable for real-time CLI applications

## Integration Points

Use goal parser in:

1. **Project scaffolding** — Convert pitch to initial checklist
2. **CLI tools** — `/parse-goal` command
3. **Workflow automation** — Break goals into CI/CD pipelines
4. **Documentation generators** — Auto-create runbooks
5. **Risk assessment** — Identify critical path items
6. **Team coordination** — Distribute subtasks by phase

## Notes

- Quantifier extraction assumes `number + unit` format (e.g., "15 microservices")
- Categories are case-insensitive and keyword-based (not semantic)
- Dependencies are heuristic-based; complex initiatives may need manual review
- Acceptance criteria are domain-aware but template-driven
- Regex patterns are intentionally strict to avoid false positives

## Files

- `lib/goal-parser.js` — Main parser implementation
- `lib/goal-parser.test.js` — Comprehensive test suite (13 tests, 100% pass)
- `lib/GOAL_PARSER.md` — This documentation
