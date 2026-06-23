# Regulatory Navigator

**Navigate complex regulations | Map requirements to controls | Generate compliance checklists | Monitor compliance status**

---

## Overview

Regulatory Navigator is a comprehensive compliance management system for organizations navigating complex financial, tax, data protection, healthcare, and industry-specific regulations. It automates the mapping of regulatory requirements to organizational controls, generates compliance checklists, identifies coverage gaps, and provides real-time compliance monitoring through an interactive dashboard.

### Key Features

- **Regulation Library**: 15+ pre-configured frameworks (GDPR, CCPA, HIPAA, SOC2, ISO27001, PCI-DSS, etc.)
- **Requirement Parser**: Extract and track individual clauses from regulations
- **Control Mapping**: Bidirectional mapping between requirements and controls
- **Automated Checklists**: Generate prioritized compliance checklists with task assignment
- **Gap Analysis**: Identify unaddressed requirements and remediation recommendations
- **Compliance Monitoring**: Real-time status tracking with compliance dashboard
- **Audit Trail**: Complete audit history for all compliance activities
- **Multi-Jurisdiction**: Support for regulations across different jurisdictions
- **Reporting**: Export compliance reports in JSON, CSV, and HTML formats

---

## Installation

```bash
# Copy to lib directory
cp regulatory-navigator.js /path/to/project/lib/

# Install dependencies (uses Node.js built-ins only)
npm install  # No additional dependencies required
```

---

## Quick Start

### Basic Setup

```javascript
const RegulatoryNavigator = require('./lib/regulatory-navigator')
const { REGULATION_DOMAINS, COMPLIANCE_STATUS, REQUIREMENT_PRIORITY } = RegulatoryNavigator

// Initialize navigator
const nav = new RegulatoryNavigator({
  jurisdiction: 'US',
  verbose: true
})

// Add regulation
const gdpr = nav.addRegulation({
  name: 'GDPR',
  domain: REGULATION_DOMAINS.GDPR,
  jurisdiction: 'EU',
  description: 'General Data Protection Regulation'
})

// Add requirements
const requirement = nav.addRequirement({
  regulationId: gdpr.id,
  clause: '2.1',
  text: 'Personal data shall be processed lawfully',
  priority: REQUIREMENT_PRIORITY.CRITICAL
})

// Add controls
const control = nav.addControl({
  name: 'Access Control Policy',
  description: 'Manage user access and data access',
  controlType: 'preventive',
  owner: 'security-team'
})

// Map requirement to control
nav.mapRequirementToControls(requirement.id, [control.id])

// Generate checklist
const checklist = nav.generateChecklist(gdpr.id, {
  owner: 'compliance-team'
})
```

---

## Core Concepts

### Regulations

A regulation represents a compliance framework (GDPR, CCPA, HIPAA, etc.).

```javascript
const regulation = nav.addRegulation({
  name: 'GDPR',
  domain: 'gdpr',  // REGULATION_DOMAINS enum
  jurisdiction: 'EU',
  version: '2018',
  effectiveDate: '2018-05-25T00:00:00Z',
  source: 'https://gdpr-info.eu/',
  description: 'Regulation on the protection of natural persons...',
  requirements: [],  // Array of requirement IDs
  controls: [],      // Array of control IDs
  metadata: {}       // Custom metadata
})
```

**Supported Domains:**
- `GDPR`, `CCPA`, `HIPAA`, `SOC2`, `ISO27001`, `PCI_DSS`
- `FINANCIAL`, `TAX`, `DATA_PROTECTION`, `HEALTHCARE`, `ENERGY`, `TELECOM`, `AVIATION`, `SECURITIES`, `CUSTOM`

### Requirements

A requirement is a specific clause or provision from a regulation.

```javascript
const requirement = nav.addRequirement({
  regulationId: 'reg-123',
  clause: 'Article 32',
  text: 'Security of processing...',
  priority: 5,  // 1-5, where 5 is CRITICAL
  applicability: 'organizational',
  status: 'pending-review',  // COMPLIANCE_STATUS enum
  controlMappings: [],  // Array of control IDs
  evidence: [],  // Audit evidence
  notes: 'Implementation notes'
})
```

**Priority Levels:**
- `CRITICAL` (5): Must implement immediately
- `HIGH` (4): Implement within 30 days
- `MEDIUM` (3): Implement within 90 days
- `LOW` (2): Implement within 180 days
- `INFORMATIONAL` (1): Document only

### Controls

A control is a safeguard or procedure that addresses regulatory requirements.

```javascript
const control = nav.addControl({
  name: 'Encryption at Rest',
  description: 'AES-256 encryption for all data...',
  controlType: 'preventive',  // CONTROL_TYPES enum
  status: 'in-progress',
  owner: 'security-team',
  frequency: 'quarterly',  // Testing frequency
  testResult: null,  // true/false
  lastTested: null,
  requirements: [],  // Mapped requirement IDs
  evidence: [],  // Test evidence
  riskLevel: 'high',
  maturityLevel: 1,  // 1-5
  metadata: {}
})
```

**Control Types:**
- `PREVENTIVE`: Prevents issues from occurring
- `DETECTIVE`: Identifies issues that occurred
- `CORRECTIVE`: Fixes issues that were detected
- `COMPENSATING`: Temporary workaround
- `DIRECTIVE`: Policy or procedure

### Mappings

Map requirements to controls to establish coverage.

```javascript
const mapping = nav.mapRequirementToControls('req-123', [
  'ctrl-456',
  'ctrl-789'
])

// Result includes:
// - requirementId: Requirement ID
// - controlIds: Array of control IDs
// - coverage: Percentage of tested controls (0-100)
// - status: COMPLIANCE_STATUS
```

### Checklists

Auto-generated checklist from regulation requirements.

```javascript
const checklist = nav.generateChecklist('reg-123', {
  owner: 'compliance-team',
  defaultAssignee: 'dpo@company.com',
  dueDate: '2024-12-31T23:59:59Z'
})

// Update checklist item
nav.updateChecklistItem(checklist.id, 'item-456', {
  completed: true,
  notes: 'Control verified',
  attachments: ['evidence.pdf']
})
```

---

## Common Workflows

### Workflow 1: GDPR Compliance Setup

```javascript
// Initialize
const nav = new RegulatoryNavigator({ jurisdiction: 'EU' })

// Add GDPR regulation
const gdpr = nav.addRegulation({
  name: 'GDPR',
  domain: 'gdpr'
})

// Add key requirements
const requirements = [
  'Data protection by design',
  'Consent management',
  'Data subject rights',
  'Security controls',
  'Breach notification'
].map((text, i) => nav.addRequirement({
  regulationId: gdpr.id,
  clause: `Article ${i + 1}`,
  text,
  priority: 5
}))

// Map to existing controls
requirements.forEach(req => {
  nav.mapRequirementToControls(req.id, [
    'encryption-control-id',
    'access-control-id'
  ])
})

// Generate checklist
const checklist = nav.generateChecklist(gdpr.id)

// Monitor compliance
const status = nav.getComplianceStatus(gdpr.id)
console.log(`Compliance: ${status.compliancePercentage}%`)
```

### Workflow 2: Gap Analysis and Remediation

```javascript
// Perform gap analysis
const analysis = nav.performGapAnalysis('reg-123')

console.log(`Gaps found: ${analysis.gapCount}`)

// Get recommendations
analysis.recommendations.forEach(rec => {
  console.log(`${rec.priority}: ${rec.action}`)
  console.log(`  - ${rec.details}`)
})

// Create action items for each gap
analysis.gaps.forEach(gap => {
  // Create ticket in issue tracking system
  // Assign to owner
  // Set deadline based on priority
})
```

### Workflow 3: Control Testing and Evidence

```javascript
// Get non-compliant controls
const nonCompliant = nav.getNonCompliantControls()

// Test each control
nonCompliant.forEach(control => {
  const testPassed = performTest(control)
  
  nav.updateControlTest(control.id, testPassed, {
    testedBy: 'auditor@company.com',
    testDate: new Date().toISOString(),
    testMethod: 'Manual Testing',
    evidence: 'test-results.pdf',
    notes: testPassed ? 'All checks passed' : 'Issue found in X'
  })
})
```

### Workflow 4: Multi-Framework Compliance

```javascript
const nav = new RegulatoryNavigator()

// Add multiple frameworks
const frameworks = ['GDPR', 'SOC2', 'ISO27001']
const regulations = frameworks.map(name => 
  nav.addRegulation({ name, domain: name.toLowerCase() })
)

// Create shared controls
const dataEncryption = nav.addControl({
  name: 'Data Encryption',
  description: 'AES-256 encryption standard'
})

// Map to each framework
regulations.forEach(reg => {
  const req = nav.addRequirement({
    regulationId: reg.id,
    text: 'Data encryption required'
  })
  
  nav.mapRequirementToControls(req.id, [dataEncryption.id])
})

// Get consolidated metrics
const metrics = nav.updateMetrics()
console.log(`Overall compliance: ${metrics.complianceRate}%`)
```

### Workflow 5: Compliance Reporting

```javascript
// Export comprehensive report
const report = nav.exportComplianceReport('reg-123')

// Save JSON report
fs.writeFileSync('report.json', JSON.stringify(report, null, 2))

// Export as CSV
const csv = nav.exportAsCSV('reg-123')
fs.writeFileSync('report.csv', csv)

// Generate HTML dashboard
const html = nav.generateDashboardHTML()
fs.writeFileSync('dashboard.html', html)
```

---

## API Reference

### RegulatoryNavigator Methods

#### Regulation Management

```javascript
addRegulation(regulation)                    // Add new regulation
regulations.get(id)                          // Get regulation by ID
getRegulationsByDomain(domain)               // Filter by domain
```

#### Requirement Management

```javascript
addRequirement(requirement)                  // Add requirement
requirements.get(id)                         // Get by ID
getRequirementsByStatus(status)              // Filter by status
getNonCompliantRequirements()                // Get non-compliant
```

#### Control Management

```javascript
addControl(control)                          // Add control
controls.get(id)                             // Get by ID
getControlsByStatus(status)                  // Filter by status
getNonCompliantControls()                    // Get non-compliant
updateControlTest(controlId, result, evidence) // Record test
```

#### Mapping

```javascript
mapRequirementToControls(reqId, controlIds) // Create mapping
// Automatically updates requirement.controlMappings
// Automatically updates control.requirements
```

#### Checklist Management

```javascript
generateChecklist(regulationId, options)    // Create checklist
updateChecklistItem(checklistId, itemId, updates) // Mark complete
checklists.get(id)                           // Get checklist
```

#### Compliance Analysis

```javascript
performGapAnalysis(regulationId)             // Identify gaps
getComplianceStatus(regulationId)            // Current status
updateMetrics()                              // Calculate metrics
getMetrics()                                 // Get metrics
```

#### Reporting

```javascript
exportComplianceReport(regulationId)         // JSON export
exportAsCSV(regulationId)                    // CSV export
generateDashboardHTML()                      // HTML dashboard
```

---

## Data Storage

Regulatory Navigator persists data in `.claude/regulatory/`:

```
.claude/regulatory/
├── regulations.json          # Regulation library
├── requirements.json         # Requirements database
├── controls.json            # Controls database
├── checklists.json          # Compliance checklists
└── audit-trail.jsonl        # Audit trail (JSONL format)
```

### Enable Persistence

```javascript
const nav = new RegulatoryNavigator({
  dataDir: '/custom/path/.claude/regulatory'
})
```

---

## Dashboard

The compliance dashboard provides real-time monitoring:

```javascript
const html = nav.generateDashboardHTML()
// Save to file and open in browser

// Displays:
// - Overall compliance rate (%)
// - Requirements vs controls coverage
// - Non-compliant items requiring attention
// - Risk score (weighted by control criticality)
// - Regulation-by-regulation status
// - Bottleneck analysis
```

---

## Events

Regulatory Navigator emits events for monitoring:

```javascript
nav.on('regulation-added', (data) => {
  console.log(`Regulation added: ${data.regulation.name}`)
})

nav.on('requirement-added', (data) => {
  console.log(`Requirement added: ${data.requirement.clause}`)
})

nav.on('control-added', (data) => {
  console.log(`Control added: ${data.control.name}`)
})

nav.on('requirement-mapped', (data) => {
  console.log(`Requirement mapped to ${data.mapping.controlIds.length} controls`)
})

nav.on('checklist-generated', (data) => {
  console.log(`Checklist created: ${data.checklist.id}`)
})

nav.on('control-tested', (data) => {
  console.log(`Control tested: ${data.control.testResult}`)
})

nav.on('gap-analysis-complete', (data) => {
  console.log(`Gaps found: ${data.analysis.gapCount}`)
})
```

---

## Examples

### Complete GDPR Setup

See `regulatory-navigator-integration-example.js`:

```bash
node lib/regulatory-navigator-integration-example.js
```

Examples include:
1. GDPR compliance framework setup
2. Checklist generation
3. Gap analysis
4. Control testing
5. Compliance monitoring
6. Report export
7. Multi-framework compliance
8. Dashboard generation

---

## Best Practices

### 1. Regular Audit Cycles

```javascript
// Quarterly control testing
const controls = nav.getControlsByStatus('partial')
controls.forEach(ctrl => {
  performTest(ctrl)
})
```

### 2. Prioritized Remediation

```javascript
// Focus on critical gaps
const analysis = nav.performGapAnalysis('reg-123')
const criticalGaps = analysis.gaps
  .filter(g => g.severity === 5)
  .sort((a, b) => b.severity - a.severity)
```

### 3. Evidence Collection

```javascript
// Link controls to evidence
nav.updateControlTest(controlId, true, {
  evidence: 'test-report-2024.pdf',
  notes: 'Annual SOC2 audit results',
  testedBy: 'external-auditor'
})
```

### 4. Compliance Dashboard Review

```javascript
// Regular status checks
setInterval(() => {
  const metrics = nav.updateMetrics()
  if (metrics.riskScore > 50) {
    sendAlert('High compliance risk detected')
  }
}, 86400000) // Daily
```

### 5. Multi-Jurisdiction Tracking

```javascript
// Separate navigators per jurisdiction
const euNav = new RegulatoryNavigator({ jurisdiction: 'EU' })
const usNav = new RegulatoryNavigator({ jurisdiction: 'US' })

// Track GDPR separately from CCPA
euNav.addRegulation({ name: 'GDPR', ... })
usNav.addRegulation({ name: 'CCPA', ... })
```

---

## Troubleshooting

### Checklist Not Updating

Ensure regulation's `requirements` array contains requirement IDs:

```javascript
const reg = nav.regulations.get(regId)
console.log(reg.requirements) // Should be array of req IDs

// If empty, update it:
reg.requirements = [req1.id, req2.id]
nav._saveRegulations()
```

### Controls Not Appearing in Coverage

Verify mapping was created:

```javascript
const req = nav.requirements.get(reqId)
console.log(req.controlMappings) // Should contain control IDs

const ctrl = nav.controls.get(ctrlId)
console.log(ctrl.requirements) // Should contain requirement ID
```

### Missing Evidence in Report

Record evidence during testing:

```javascript
nav.updateControlTest(ctrlId, true, {
  testMethod: 'Automated Testing',
  evidence: 'test-results.log',
  notes: 'All assertions passed'
})
```

---

## Integration Examples

### With Issue Tracking

```javascript
// Create Jira tickets for gaps
const analysis = nav.performGapAnalysis('reg-123')
analysis.gaps.forEach(gap => {
  jira.createIssue({
    summary: `COMPLIANCE: ${gap.clause}`,
    description: gap.text,
    priority: gap.severity,
    dueDate: getDueDate(gap.severity)
  })
})
```

### With Monitoring

```javascript
// Send metrics to monitoring system
const metrics = nav.updateMetrics()

prometheus.gauge('compliance_rate', metrics.complianceRate)
prometheus.gauge('compliance_gaps', metrics.gapCount)
prometheus.gauge('compliance_risk_score', metrics.riskScore)
```

### With Scheduling

```javascript
// Schedule quarterly checklist reviews
schedule.scheduleJob('0 0 1 */3 *', () => {
  const regulations = Array.from(nav.regulations.values())
  regulations.forEach(reg => {
    nav.generateChecklist(reg.id)
  })
})
```

---

## Performance

- Regulation library: O(1) lookups
- Gap analysis: O(n*m) where n=requirements, m=controls
- Compliance calculation: O(n)
- Dashboard generation: Optimized to <1s for 1000+ items

For large deployments (10k+ requirements), consider:
- Horizontal sharding by jurisdiction
- Caching compliance calculations
- Background gap analysis runs

---

## License

Part of Claudient ecosystem. See main repository for details.
