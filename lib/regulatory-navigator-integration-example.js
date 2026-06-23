/**
 * Regulatory Navigator Integration Example
 * Demonstrates comprehensive compliance management workflow
 */

const RegulatoryNavigator = require('./regulatory-navigator')
const {
  REGULATION_DOMAINS,
  COMPLIANCE_STATUS,
  REQUIREMENT_PRIORITY,
  CONTROL_TYPES
} = RegulatoryNavigator

/**
 * Example 1: Set up GDPR compliance framework
 */
async function setupGDPRCompliance() {
  console.log('\n=== GDPR Compliance Setup ===\n')

  const nav = new RegulatoryNavigator({
    jurisdiction: 'EU',
    verbose: true
  })

  // Add GDPR regulation
  const gdpr = nav.addRegulation({
    name: 'General Data Protection Regulation (GDPR)',
    domain: REGULATION_DOMAINS.GDPR,
    jurisdiction: 'EU',
    version: '2018',
    description: 'Regulation on the protection of natural persons with regard to the processing of personal data',
    source: 'https://gdpr-info.eu/'
  })

  console.log(`✓ Added regulation: ${gdpr.name}`)

  // Add core GDPR requirements
  const requirements = [
    {
      clause: 'Article 5',
      text: 'Personal data shall be processed lawfully, fairly and in a transparent manner',
      priority: REQUIREMENT_PRIORITY.CRITICAL
    },
    {
      clause: 'Article 7',
      text: 'Consent must be freely given, specific, informed and unambiguous',
      priority: REQUIREMENT_PRIORITY.CRITICAL
    },
    {
      clause: 'Article 12-22',
      text: 'Data Subject Rights - Right to access, rectification, erasure',
      priority: REQUIREMENT_PRIORITY.HIGH
    },
    {
      clause: 'Article 32',
      text: 'Security of processing - Encryption, pseudonymization required',
      priority: REQUIREMENT_PRIORITY.CRITICAL
    },
    {
      clause: 'Article 33',
      text: 'Notification of a personal data breach to the supervisory authority',
      priority: REQUIREMENT_PRIORITY.CRITICAL
    }
  ]

  const requirementIds = requirements.map((req) => {
    const added = nav.addRequirement({
      ...req,
      regulationId: gdpr.id,
      status: COMPLIANCE_STATUS.PENDING_REVIEW
    })
    return added.id
  })

  console.log(`✓ Added ${requirementIds.length} GDPR requirements`)

  // Add controls
  const controls = [
    {
      name: 'Data Inventory and Classification',
      description: 'Maintain comprehensive inventory of personal data and classify by sensitivity',
      controlType: CONTROL_TYPES.DETECTIVE,
      owner: 'data-governance',
      riskLevel: 'high'
    },
    {
      name: 'Encryption at Rest',
      description: 'All personal data encrypted using AES-256 or equivalent',
      controlType: CONTROL_TYPES.PREVENTIVE,
      owner: 'security-team',
      riskLevel: 'critical'
    },
    {
      name: 'Encryption in Transit',
      description: 'TLS 1.2+ for all data transmission',
      controlType: CONTROL_TYPES.PREVENTIVE,
      owner: 'security-team',
      riskLevel: 'critical'
    },
    {
      name: 'Access Control Matrix',
      description: 'Role-based access control with least privilege principle',
      controlType: CONTROL_TYPES.PREVENTIVE,
      owner: 'security-team',
      riskLevel: 'high'
    },
    {
      name: 'Data Subject Rights Platform',
      description: 'Automated system for handling access, rectification, erasure requests',
      controlType: CONTROL_TYPES.DETECTIVE,
      owner: 'legal-compliance',
      riskLevel: 'high'
    },
    {
      name: 'Breach Response Procedure',
      description: '72-hour notification protocol for data breaches',
      controlType: CONTROL_TYPES.CORRECTIVE,
      owner: 'security-team',
      riskLevel: 'critical'
    },
    {
      name: 'Consent Management System',
      description: 'Track and manage explicit user consent',
      controlType: CONTROL_TYPES.PREVENTIVE,
      owner: 'legal-compliance',
      riskLevel: 'high'
    },
    {
      name: 'Privacy Impact Assessment (DPIA)',
      description: 'Conduct DPIA for high-risk processing activities',
      controlType: CONTROL_TYPES.DETECTIVE,
      owner: 'data-governance',
      riskLevel: 'medium'
    }
  ]

  const controlIds = controls.map((ctrl) => {
    const added = nav.addControl({
      ...ctrl,
      status: COMPLIANCE_STATUS.IN_PROGRESS
    })
    return added.id
  })

  console.log(`✓ Added ${controlIds.length} controls`)

  // Map requirements to controls
  const mappings = [
    { reqIdx: 0, ctrlIndices: [0, 1, 2, 3] }, // Article 5 -> Inventory, Encryption at rest/transit, Access Control
    { reqIdx: 1, ctrlIndices: [6, 0] }, // Article 7 -> Consent Management, Data Inventory
    { reqIdx: 2, ctrlIndices: [4] }, // Article 12-22 -> Data Subject Rights Platform
    { reqIdx: 3, ctrlIndices: [1, 2, 3] }, // Article 32 -> Encryption & Access Control
    { reqIdx: 4, ctrlIndices: [5] } // Article 33 -> Breach Response
  ]

  mappings.forEach((mapping) => {
    const reqId = requirementIds[mapping.reqIdx]
    const ctrls = mapping.ctrlIndices.map((idx) => controlIds[idx])
    nav.mapRequirementToControls(reqId, ctrls)
  })

  console.log(`✓ Mapped requirements to controls`)

  return { nav, gdpr, requirementIds, controlIds }
}

/**
 * Example 2: Generate compliance checklist
 */
async function generateComplianceChecklist(nav, regulationId) {
  console.log('\n=== Generate Compliance Checklist ===\n')

  const checklist = nav.generateChecklist(regulationId, {
    owner: 'compliance-team',
    defaultAssignee: 'data-protection-officer'
  })

  console.log(`✓ Generated checklist: ${checklist.name}`)
  console.log(`  Total items: ${checklist.totalItems}`)
  console.log(`  Progress: ${checklist.progress}%`)
  console.log(`  Due date: ${new Date(checklist.dueDate).toDateString()}`)

  // Simulate completing some items
  const itemsToComplete = checklist.items.slice(0, 2)
  itemsToComplete.forEach((item) => {
    nav.updateChecklistItem(checklist.id, item.id, {
      completed: true,
      notes: 'Control implementation verified',
      attachments: ['implementation-report.pdf']
    })
  })

  console.log(`✓ Completed ${itemsToComplete.length} checklist items`)

  return checklist
}

/**
 * Example 3: Perform gap analysis
 */
async function analyzeGaps(nav, regulationId) {
  console.log('\n=== Gap Analysis ===\n')

  const analysis = nav.performGapAnalysis(regulationId)

  console.log(`Total requirements: ${analysis.totalRequirements}`)
  console.log(`Compliance gaps: ${analysis.gapCount}`)
  console.log(`Gap percentage: ${analysis.gapPercentage}%`)

  if (analysis.gaps.length > 0) {
    console.log('\nIdentified gaps:')
    analysis.gaps.slice(0, 5).forEach((gap) => {
      console.log(`  - ${gap.clause}: ${gap.reason}`)
    })
  }

  if (analysis.recommendations.length > 0) {
    console.log('\nRecommendations:')
    analysis.recommendations.slice(0, 5).forEach((rec) => {
      console.log(`  - [${rec.priority}] ${rec.action}`)
      console.log(`    Details: ${rec.details}`)
    })
  }

  return analysis
}

/**
 * Example 4: Conduct control testing
 */
async function conductControlTesting(nav, controlIds) {
  console.log('\n=== Control Testing ===\n')

  const testResults = []

  controlIds.slice(0, 3).forEach((controlId, idx) => {
    const passed = idx === 1 ? false : true

    const result = nav.updateControlTest(controlId, passed, {
      testedBy: 'internal-auditor',
      testDate: new Date().toISOString(),
      testMethod: 'Documentation Review',
      notes: passed ? 'Control verified effective' : 'Non-conformity identified'
    })

    testResults.push(result)
    console.log(`✓ Tested: ${result.name} - ${passed ? 'PASS' : 'FAIL'}`)
  })

  return testResults
}

/**
 * Example 5: Monitor compliance status
 */
async function monitorComplianceStatus(nav, regulationId) {
  console.log('\n=== Compliance Monitoring ===\n')

  const status = nav.getComplianceStatus(regulationId)

  console.log(`Regulation: ${status.regulationName}`)
  console.log(`Total requirements: ${status.totalRequirements}`)
  console.log(`  ✓ Compliant: ${status.compliant}`)
  console.log(`  ✗ Non-compliant: ${status.nonCompliant}`)
  console.log(`  ⚠ Partial: ${status.partial}`)
  console.log(`  ⏳ In Progress: ${status.inProgress}`)
  console.log(`Overall compliance: ${status.compliancePercentage}%`)
  console.log(`Status: ${status.status}`)

  return status
}

/**
 * Example 6: Export compliance report
 */
async function exportComplianceReport(nav, regulationId) {
  console.log('\n=== Export Compliance Report ===\n')

  const report = nav.exportComplianceReport(regulationId)

  console.log(`Report Generated: ${new Date(report.timestamp).toISOString()}`)
  console.log(`Regulation: ${report.regulation.name} v${report.regulation.version}`)
  console.log(`Domain: ${report.regulation.domain}`)
  console.log(`Compliance: ${report.summary.compliancePercentage}%`)
  console.log(`Requirements analyzed: ${report.requirements.length}`)

  if (report.gaps.length > 0) {
    console.log(`\nCompliance gaps found: ${report.gaps.length}`)
  }

  return report
}

/**
 * Example 7: Multi-framework compliance (GDPR + ISO27001)
 */
async function multiFrameworkCompliance() {
  console.log('\n=== Multi-Framework Compliance Management ===\n')

  const nav = new RegulatoryNavigator({ verbose: true })

  // Add multiple regulations
  const frameworks = [
    { name: 'GDPR', domain: REGULATION_DOMAINS.GDPR, jurisdiction: 'EU' },
    { name: 'ISO 27001', domain: REGULATION_DOMAINS.ISO27001, jurisdiction: 'Global' },
    { name: 'SOC 2 Type II', domain: REGULATION_DOMAINS.SOC2, jurisdiction: 'US' }
  ]

  const regulations = frameworks.map((fw) =>
    nav.addRegulation({
      name: fw.name,
      domain: fw.domain,
      jurisdiction: fw.jurisdiction
    })
  )

  console.log(`✓ Added ${regulations.length} regulatory frameworks`)

  // Create shared controls that address multiple frameworks
  const dataEncryptionCtrl = nav.addControl({
    name: 'Data Encryption Standard',
    description: 'AES-256 encryption for all data at rest and in transit',
    controlType: CONTROL_TYPES.PREVENTIVE,
    owner: 'security-team'
  })

  console.log(`✓ Created shared control: ${dataEncryptionCtrl.name}`)

  // Map this control to multiple regulations' requirements
  regulations.forEach((reg) => {
    const req = nav.addRequirement({
      regulationId: reg.id,
      clause: 'Encryption',
      text: 'Data must be encrypted',
      priority: REQUIREMENT_PRIORITY.CRITICAL,
      status: COMPLIANCE_STATUS.IN_PROGRESS
    })

    nav.mapRequirementToControls(req.id, [dataEncryptionCtrl.id])
  })

  console.log(`✓ Mapped encryption control to ${regulations.length} frameworks`)

  // Generate metrics across all frameworks
  const metrics = nav.updateMetrics()
  console.log(`\nCross-framework metrics:`)
  console.log(`  Total regulations: ${metrics.totalRegulations}`)
  console.log(`  Total requirements: ${metrics.totalRequirements}`)
  console.log(`  Total controls: ${metrics.totalControls}`)
  console.log(`  Overall compliance rate: ${metrics.complianceRate}%`)

  return nav
}

/**
 * Example 8: Dashboard generation
 */
async function generateDashboard(nav) {
  console.log('\n=== Dashboard Generation ===\n')

  const html = nav.generateDashboardHTML()

  // Save to file
  const fs = require('fs')
  const path = require('path')
  const dashboardPath = path.join(process.cwd(), 'compliance-dashboard.html')

  fs.writeFileSync(dashboardPath, html, 'utf8')
  console.log(`✓ Generated compliance dashboard: ${dashboardPath}`)

  return dashboardPath
}

/**
 * Run all examples
 */
async function runAllExamples() {
  console.log('╔═══════════════════════════════════════════════════════════╗')
  console.log('║   Regulatory Navigator - Comprehensive Examples           ║')
  console.log('╚═══════════════════════════════════════════════════════════╝')

  try {
    // Setup GDPR
    const { nav, gdpr, requirementIds, controlIds } = await setupGDPRCompliance()

    // Generate checklist
    await generateComplianceChecklist(nav, gdpr.id)

    // Perform gap analysis
    await analyzeGaps(nav, gdpr.id)

    // Conduct testing
    await conductControlTesting(nav, controlIds)

    // Monitor status
    await monitorComplianceStatus(nav, gdpr.id)

    // Export report
    await exportComplianceReport(nav, gdpr.id)

    // Multi-framework setup
    await multiFrameworkCompliance()

    // Generate dashboard
    await generateDashboard(nav)

    console.log('\n✓ All examples completed successfully')
  } catch (error) {
    console.error('Error running examples:', error.message)
    process.exit(1)
  }
}

// Run if executed directly
if (require.main === module) {
  runAllExamples()
}

module.exports = {
  setupGDPRCompliance,
  generateComplianceChecklist,
  analyzeGaps,
  conductControlTesting,
  monitorComplianceStatus,
  exportComplianceReport,
  multiFrameworkCompliance,
  generateDashboard
}
