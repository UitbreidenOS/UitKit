# Agent Cloning System - Quick Start Guide

Get up and running with agent cloning in 5 minutes.

## 1. Create Your First Template

Save an agent configuration as a reusable template:

```bash
node scripts/agent-cloning.js create-template "MyAgent" "your-name" \
  '{
    "name":"MyAgent",
    "model":"claude-opus-4-1",
    "maxTokens":100000,
    "temperature":0.7,
    "tools":["search","calculator"],
    "systemPrompt":"You are a helpful assistant"
  }'
```

**Output:**
```
[✓] Template created: tpl-abc123def456
  Name: MyAgent
  Author: your-name
```

Note the template ID for next steps.

## 2. Clone the Template

Create an instance with custom overrides:

```bash
node scripts/agent-cloning.js clone tpl-abc123def456 "MyClone" "your-name" \
  '{"temperature":0.5,"maxTokens":150000}'
```

**Output:**
```
[✓] Clone created: clone-xyz789abc123
  Name: MyClone
  From template: tpl-abc123def456
  Overrides: 2 properties
```

## 3. Create a Variant

Spawn a specialized variant from your clone:

```bash
node scripts/agent-cloning.js variant clone-xyz789abc123 "HighCreative" "your-name" \
  '{"temperature":1.8}'
```

**Output:**
```
[✓] Variant created: var-def456ghi789
  Name: HighCreative
  From source: clone-xyz789abc123
```

## 4. Share with Team

Share your clone with team members:

```bash
node scripts/agent-cloning.js share clone-xyz789abc123 \
  "alice@example.com,bob@example.com"
```

**Output:**
```
[✓] Clone shared: share-jkl012mno345
  Clone: MyClone
  With: alice@example.com, bob@example.com
```

## 5. Version for Production

Create a versioned snapshot before deployment:

```bash
node scripts/agent-cloning.js version clone-xyz789abc123 "v1.0-production"
```

**Output:**
```
[✓] Version created: ver-pqr678stu901
  Clone: clone-xyz789abc123
  Label: v1.0-production
```

## 6. Check Your Work

List all your templates and instances:

```bash
node scripts/agent-cloning.js list-templates
node scripts/agent-cloning.js list-instances
node scripts/agent-cloning.js stats
```

## Common Workflows

### Multi-Team Agent Distribution

```bash
# 1. Create company-standard template
node scripts/agent-cloning.js create-template "CompanyAgent" "platform" '{...}'

# 2. Team A customizes
node scripts/agent-cloning.js clone tpl-xxx TeamA-Agent platform '{...}'

# 3. Team B customizes
node scripts/agent-cloning.js clone tpl-xxx TeamB-Agent platform '{...}'

# 4. Share with teams
node scripts/agent-cloning.js share clone-aaa "team-a@company.com"
node scripts/agent-cloning.js share clone-bbb "team-b@company.com"
```

### A/B Testing

```bash
# 1. Create base clone
node scripts/agent-cloning.js clone tpl-xxx Experiment-Control your-name '{}'

# 2. Create variant A (low temp)
node scripts/agent-cloning.js variant clone-base VariantA your-name '{"temperature":0.1}'

# 3. Create variant B (high temp)
node scripts/agent-cloning.js variant clone-base VariantB your-name '{"temperature":1.8}'

# 4. Version both
node scripts/agent-cloning.js version clone-a "round-1"
node scripts/agent-cloning.js version clone-b "round-1"
```

## View Lineage

See how clones and variants relate:

```bash
node scripts/agent-cloning.js lineage clone-xyz789abc123
```

## Programmatic Usage

Use the API directly in Node.js:

```javascript
const { AgentCloneManager } = require('./scripts/agent-cloning');

const manager = new AgentCloneManager();

// Create template
const template = manager.createTemplate(config, 'MyTemplate', {
  author: 'alice'
});

// Clone agent
const clone = manager.cloneAgent(template.id, 'MyClone', 
  { temperature: 0.5 }, 
  { author: 'alice' }
);

// Version clone
manager.versionClone(clone.id, 'v1.0-production');
```

## Run Examples

```bash
node scripts/agent-cloning-examples.js
```

Demonstrates:
- Multi-team distribution
- Experimental workflows
- Compliance & audit trails
- Template promotion
- Import/export sharing

## Run Tests

```bash
node scripts/agent-cloning.test.js
```

Should pass all 20 tests.

## Key Concepts

- **Template** — Reusable agent configuration (ID: `tpl-*`)
- **Clone** — Specific instance with overrides (ID: `clone-*`)
- **Variant** — Specialized clone version (ID: `var-*`)
- **Version** — Config snapshot at point in time (ID: `ver-*`)
- **Lineage** — Full ancestry and modification history
- **Sharing** — Distribute to team with access control (ID: `share-*`)

## Next Steps

1. Read full docs: `AGENT-CLONING-README.md`
2. Run examples: `node scripts/agent-cloning-examples.js`
3. Run tests: `node scripts/agent-cloning.test.js`
4. Use in workflows: `require('./scripts/agent-cloning')`

## CLI Command Reference

```bash
create-template <name> [author] [config]
clone <templateId> <cloneName> [author] [overrides]
variant <sourceId> <variantName> [author] [customization]
share <cloneId> <recipients>
version <cloneId> <label>
list-templates
list-instances
lineage <cloneId>
save-template <cloneId> <templateName>
export <cloneId> [format]
import <filePath>
stats
```

## Troubleshooting

- **"Template already exists"** — Use unique name or delete old one
- **"Clone not found"** — Verify ID format (starts with `clone-`, `var-`, etc.)
- **"Cannot delete - has descendants"** — Delete descendants first or use `manager.deleteClone(id, true)`

Happy cloning!
