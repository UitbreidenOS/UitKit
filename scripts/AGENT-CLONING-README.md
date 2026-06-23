# Agent Cloning System

Clone agents with custom configurations, save as reusable templates, share setups across teams, and track versions independently.

## Overview

The Agent Cloning System provides enterprise-grade agent management with:
- **Template Creation** — Save agent configurations as reusable templates
- **Agent Cloning** — Spawn agents from templates with custom overrides
- **Variant Management** — Create specialized variants of clones
- **Team Sharing** — Share agents with access control and expiry
- **Version Tracking** — Snapshot configs and restore previous versions
- **Lineage Tracking** — Maintain full ancestry and descent graphs
- **Import/Export** — Portable agent configuration sharing

## Installation & Usage

### Basic Setup

```bash
# Initialize and check stats
node scripts/agent-cloning.js stats

# Create first template
node scripts/agent-cloning.js create-template "DataAnalyzer" "tushar" \
  '{"name":"DataAnalyzer","model":"claude-opus-4-1","tools":["browser","search"]}'
```

### Creating Templates

Save agent configurations as reusable templates:

```bash
node scripts/agent-cloning.js create-template <name> [author] [config]
```

**Example:**
```bash
node scripts/agent-cloning.js create-template "SecurityReviewer" "alice" \
  '{
    "name":"SecurityReviewer",
    "model":"claude-opus-4-1",
    "maxTokens":100000,
    "temperature":0.3,
    "tools":["code-analyzer","risk-scanner"],
    "systemPrompt":"You are an expert security reviewer"
  }'
```

### Cloning Agents

Create instances from templates with custom overrides:

```bash
node scripts/agent-cloning.js clone <templateId> <cloneName> [author] [overrides]
```

**Example:**
```bash
node scripts/agent-cloning.js clone tpl-abc123 "MySecurityBot" "alice" \
  '{"temperature":0.5,"maxTokens":150000}'
```

The clone inherits all template settings but applies your overrides.

### Creating Variants

Spawn specialized variants from existing clones:

```bash
node scripts/agent-cloning.js variant <sourceCloneId> <variantName> [author] [customization]
```

**Example:**
```bash
# High creativity variant
node scripts/agent-cloning.js variant clone-def456 "CreativeMode" "bob" \
  '{"temperature":1.8,"tools":["ideation","brainstorm"]}'

# Conservative variant  
node scripts/agent-cloning.js variant clone-def456 "ConservativeMode" "bob" \
  '{"temperature":0.1,"tools":["validation","verification"]}'
```

### Sharing Agents

Share clones with team members via access control:

```bash
node scripts/agent-cloning.js share <cloneId> <recipients>
```

**Example:**
```bash
node scripts/agent-cloning.js share clone-def456 \
  "alice@example.com,bob@example.com,security-team@example.com"
```

Sharing options in `manager.shareAgent()`:
- `recipients` — Team member emails (array)
- `accessLevel` — 'read', 'edit', or 'admin'
- `canModify` — Allow clones to be modified (default: true)
- `canShare` — Allow resharing (default: false)
- `canVersion` — Allow version snapshots (default: true)
- `expiry` — Optional expiration timestamp

### Version Management

Create snapshots at key milestones:

```bash
node scripts/agent-cloning.js version <cloneId> <label> [notes]
```

**Example:**
```bash
# Snapshot before production
node scripts/agent-cloning.js version clone-def456 "v1.0-production" \
  "Ready for customer deployment"

# Test version
node scripts/agent-cloning.js version clone-def456 "v0.9-beta" \
  "Testing new capabilities"
```

Restore any previous version:
```javascript
manager.restoreVersion(versionId);
```

### Converting Clones to Templates

Promote successful clones into reusable templates:

```bash
node scripts/agent-cloning.js save-template <cloneId> <templateName>
```

**Example:**
```bash
node scripts/agent-cloning.js save-template clone-def456 "OptimizedSecurityReviewer"
```

## Programmatic API

### Creating Manager Instance

```javascript
const { AgentCloneManager } = require('./scripts/agent-cloning');

const manager = new AgentCloneManager({
  validateSchema: true,      // Validate configs
  preserveHistory: true,     // Track all changes
  autoBackup: true,          // Backup before delete
});
```

### Template Operations

```javascript
// Create template
const template = manager.createTemplate(config, 'TemplateName', {
  author: 'alice',
  description: 'Security reviewer agent',
  tags: ['security', 'review', 'production'],
});

// Get template
const tpl = manager.getTemplate(template.id);

// List templates
const templates = manager.listTemplates({ tag: 'security', author: 'alice' });
```

### Clone Operations

```javascript
// Clone from template
const clone = manager.cloneAgent(
  templateId,
  'MyClone',
  { temperature: 0.5, maxTokens: 150000 },
  { author: 'bob', branch: 'feature/new-tools' }
);

// Get clone
const c = manager.getClone(clone.id);

// List instances
const instances = manager.listInstances({ shared: true });

// Update clone
manager.updateClone(cloneId, { temperature: 0.7 }, {
  author: 'bob',
  reason: 'Tuning for production'
});

// Delete clone
manager.deleteClone(cloneId, false);  // false = protect if descendants
manager.deleteClone(cloneId, true);   // true = force purge
```

### Variant Operations

```javascript
// Create variant
const variant = manager.createVariant(
  sourceCloneId,
  'HighCreative',
  { temperature: 1.8, tools: ['ideation'] },
  { author: 'alice' }
);

// Variants are treated as clones in listings
const allVariants = manager.listInstances().filter(i => i.isVariant);
```

### Sharing & Access

```javascript
// Share agent
const sharing = manager.shareAgent(cloneId, {
  recipients: ['alice@example.com', 'team@example.com'],
  author: 'bob',
  accessLevel: 'edit',
  canModify: true,
  canShare: false,
  canVersion: true,
  description: 'Shared for review cycle 3',
  expiry: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
});

// Get sharing info
const shares = manager.getSharingInfo(cloneId);
```

### Version Control

```javascript
// Create version
const version = manager.versionClone(cloneId, 'v1.0-production', 
  'Production-ready configuration');

// Restore version
const restored = manager.restoreVersion(versionId);

// Get all versions (via registry)
manager.cloneRegistry.versions;
```

### Lineage & Ancestry

```javascript
// Get full lineage tree
const tree = manager.getLineageTree(cloneId);
// tree.history — all operations on this clone
// tree.descendants — all clones derived from this one

// Find descendants
const children = manager.findDescendants(cloneId);

// Record custom lineage events
manager.recordLineage(cloneId, parentId, 'custom-op', {
  author: 'alice',
  reason: 'Performance tuning',
  branch: 'main'
});
```

### Import/Export

```javascript
// Export clone
const exported = manager.exportClone(cloneId, 'json');  // or 'yaml'
fs.writeFileSync('my-agent.json', exported);

// Import from file
const data = fs.readFileSync('my-agent.json', 'utf8');
const imported = manager.importClone(data, {
  author: 'bob',
  reason: 'Adopted from shared config'
});

// Import as variant (without overwriting original)
const clone = manager.getClone(imported.id);
manager.createVariant(imported.id, 'ImportedVariant', {}, {
  author: 'bob'
});
```

### Statistics & Monitoring

```javascript
// Get system stats
const stats = manager.getStats();
// {
//   templates: 5,
//   instances: 23,
//   shared: 8,
//   sharedInstances: 12,
//   versions: 45,
//   lineageEntries: 142
// }
```

### Events

```javascript
manager.on('template-created', ({ templateId, templateName }) => {
  console.log(`Template created: ${templateName}`);
});

manager.on('clone-created', ({ cloneId, cloneName, templateId }) => {
  console.log(`Clone created: ${cloneName} from ${templateId}`);
});

manager.on('clone-updated', ({ cloneId, updates }) => {
  console.log(`Clone updated: ${cloneId}`);
});

manager.on('agent-shared', ({ shareId, cloneId, recipients }) => {
  console.log(`Shared with ${recipients.length} recipients`);
});

manager.on('clone-versioned', ({ versionId, cloneId, label }) => {
  console.log(`Version created: ${label}`);
});

manager.on('clone-restored', ({ cloneId, versionId }) => {
  console.log(`Restored clone to version ${versionId}`);
});

manager.on('clone-deleted', ({ cloneId }) => {
  console.log(`Clone deleted: ${cloneId}`);
});
```

## Configuration Schema

### Agent Config Format

```javascript
{
  // Identity
  name: string,              // Agent name (required)
  description: string,       // Human description

  // Model & Behavior
  model: string,             // claude-opus-4-1, claude-sonnet-4, etc.
  maxTokens: number,         // 0 - unlimited
  temperature: number,       // 0.0 - 2.0

  // Capabilities
  tools: string[],           // Tool names
  systemPrompt: string,      // Custom system prompt
  permissions: string[],     // Required permissions

  // Runtime
  timeout: number,           // ms timeout
  retryPolicy: {
    maxAttempts: number,
    backoffMs: number
  },
  environment: object,       // Env vars
  customFields: object,      // Custom metadata

  // Monitoring
  monitoring: {
    enabled: boolean,
    logLevel: 'debug'|'info'|'warn'|'error'
  }
}
```

## Directory Structure

```
.claude/
  agent-clones/
    registry.json              # Master registry
    templates/                 # Template definitions
      tpl-*.json
    instances/                 # Clone instances
      clone-*.json
    sharing/                   # Share records
      share-*.json
    lineage/                   # Historical records
    versions/                  # Version snapshots
      ver-*.json
    backups/                   # Pre-deletion backups
      clone-*-backup.json
```

## CLI Commands Reference

### Template Management
```bash
create-template <name> [author] [config]
list-templates
save-template <cloneId> <templateName>
```

### Clone Management
```bash
clone <templateId> <cloneName> [author] [overrides]
list-instances
variant <sourceCloneId> <variantName> [author] [customization]
```

### Sharing
```bash
share <cloneId> <recipients>
```

### Versioning
```bash
version <cloneId> <label>
```

### Exploration
```bash
lineage <cloneId>
stats
```

### Import/Export
```bash
export <cloneId> [format]
import <filePath>
```

## Best Practices

### Template Organization

1. **Name templates by capability** — `SecurityReviewer`, `CodeAnalyzer`, `DataProcessor`
2. **Tag for discovery** — `security`, `production`, `experimental`, `data-heavy`
3. **Document in description** — Intended use cases and model characteristics
4. **Version strategically** — v0.x = alpha, v1.x = stable, v2.x = redesigns

### Clone Management

1. **Clone for user/team** — Each user/team gets their own clone
2. **Use variants for tuning** — High creativity, low creativity, etc.
3. **Version before production** — Tag with `v1.0-production`
4. **Test before sharing** — Verify behavior with isolated clone first

### Sharing Practices

1. **Set appropriate access levels**
   - `read` — View only, no modifications
   - `edit` — Modify locally, create variants
   - `admin` — Full control, can reshare

2. **Use expiry dates** — Sunset shared agents after 30-90 days
3. **Document in description** — Explain use case and constraints
4. **Audit sharing** — Use `getSharingInfo()` for compliance

### Versioning Strategy

1. **Version at milestones** — Before major changes, production deploy
2. **Use semantic labels** — `v0.9-beta`, `v1.0-production`, `v1.1-patch`
3. **Add release notes** — Capture why this version matters
4. **Keep 3-5 recent** — Prune old versions periodically

### Lineage Tracking

1. **Monitor tree depth** — Deep trees become hard to manage
2. **Document forks** — When creating variant, explain divergence
3. **Use branches** — Tag variants by team/purpose: `main`, `experimental`, `customer-a`
4. **Archive old lineages** — Export before deleting clones

## Testing

Run the comprehensive test suite:

```bash
node scripts/agent-cloning.test.js
```

Tests cover:
- Template creation and retrieval
- Clone operations with overrides
- Variant creation and customization
- Team sharing with access control
- Lineage tracking and descendants
- Version management and restoration
- Import/export round-trips
- Configuration validation
- Deep merge behavior
- Deletion protection
- Statistics generation

## Examples

### Multi-Team Agent Distribution

```javascript
// Create base template
const template = manager.createTemplate(config, 'CompanyAgent', {
  author: 'platform-team',
  tags: ['standard', 'approved']
});

// Team A gets their clone
const teamAClone = manager.cloneAgent(template.id, 'TeamA-Agent', 
  { tools: ['teamA-api', 'teamA-db'] });

// Team B gets their clone
const teamBClone = manager.cloneAgent(template.id, 'TeamB-Agent',
  { tools: ['teamB-api', 'teamB-db'] });

// Share with each team
manager.shareAgent(teamAClone.id, {
  recipients: ['teamA@company.com'],
  accessLevel: 'edit'
});

manager.shareAgent(teamBClone.id, {
  recipients: ['teamB@company.com'],
  accessLevel: 'edit'
});
```

### Progressive Experimentation

```javascript
// Start with template
const base = manager.cloneAgent(templateId, 'Experiment-Base');

// Create high-temperature variant
const creative = manager.createVariant(base.id, 'Experiment-Creative',
  { temperature: 1.8 });

// Create low-temperature variant
const precise = manager.createVariant(base.id, 'Experiment-Precise',
  { temperature: 0.1 });

// Version for comparison
manager.versionClone(creative.id, 'run-1');
manager.versionClone(precise.id, 'run-1');

// Later: analyze results, then update and re-run
manager.updateClone(creative.id, { maxTokens: 200000 });
manager.versionClone(creative.id, 'run-2');
```

### Compliance & Audit Trail

```javascript
// Track all agent changes
manager.on('clone-updated', (event) => {
  auditLog.record({
    action: 'clone-updated',
    cloneId: event.cloneId,
    timestamp: Date.now(),
    user: process.env.USER
  });
});

// Export full lineage for compliance
const tree = manager.getLineageTree(cloneId);
const report = {
  clone: manager.getClone(cloneId),
  lineage: tree,
  sharing: manager.getSharingInfo(cloneId),
  versions: manager.cloneRegistry.versions
};
complianceAudit.save(report);
```

## Troubleshooting

### Clone not found after creation

**Issue:** `Error: Clone "clone-abc123" not found`

**Solution:** Ensure registry was saved. The `saveRegistry()` call is automatic but verify the `.claude/agent-clones/registry.json` file exists.

### Configuration validation errors

**Issue:** `Configuration validation failed: temperature must be between 0 and 2`

**Solution:** Review the `validateConfig()` constraints or disable validation:
```javascript
const manager = new AgentCloneManager({ validateSchema: false });
```

### Cannot delete clone with descendants

**Issue:** `Cannot delete clone - it has X descendant(s)`

**Solution:** Either delete descendants first, or force purge:
```javascript
manager.deleteClone(cloneId, true);  // Force delete with descendants
```

### Lineage tree too deep

**Issue:** Complex branching makes lineage hard to follow

**Solution:** Periodically flatten the tree by promoting stable variants to templates:
```javascript
// Convert variant to standalone template
manager.saveAsTemplate(variantId, 'StableVariant');
```

## Performance Notes

- **Registry size** — With 1000+ clones, registry.json can grow large
- **Solution** — Archive old clones via export, then delete
- **Lineage trees** — Deeply nested trees slow `getLineageTree()`
- **Solution** — Use `findDescendants()` for specific queries, not full traversal

## Security Considerations

1. **File permissions** — Agent configs stored in `.claude/` directory
   - Restrict file access to appropriate team members
   - Consider using `.gitignore` if sensitive configs

2. **Sharing records** — No built-in encryption
   - Share records contain recipient emails and access levels
   - Implement your own encryption if needed

3. **Audit trail** — Enable event listeners for compliance logging
   - Capture all template, clone, and sharing events
   - Store audit logs separately

4. **Access control** — Sharing permissions stored as metadata
   - Implement external authorization layer if needed
   - Don't rely solely on `shareAgent()` for security

## Future Enhancements

- [ ] YAML export/import
- [ ] Batch import/export
- [ ] Merge conflict detection for variant conflicts
- [ ] Automated backfill versioning
- [ ] Telemetry integration for agent usage tracking
- [ ] GraphQL API for lineage queries
- [ ] Web dashboard for visualization

## Support

For issues or feature requests, contact the platform team or file an issue in the repository.
