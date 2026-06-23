/**
 * Regulatory Navigator — Navigate complex regulations with requirement mapping, control management, compliance checklists, and monitoring dashboard.
 *
 * Features:
 * - Regulation library (financial, tax, data protection, industry-specific)
 * - Requirement parser and mapping to organizational controls
 * - Automated checklist generation with task assignment
 * - Compliance monitoring dashboard with real-time status
 * - Gap analysis and remediation tracking
 * - Audit trail and evidence collection
 * - Multi-jurisdiction support
 */

const { EventEmitter } = require('events')
const fs = require('fs')
const path = require('path')

const REGULATORY_DIR = path.join(process.cwd(), '.claude', 'regulatory')
const REGULATIONS_DB = path.join(REGULATORY_DIR, 'regulations.json')
const REQUIREMENTS_DB = path.join(REGULATORY_DIR, 'requirements.json')
const CONTROLS_DB = path.join(REGULATORY_DIR, 'controls.json')
const CHECKLISTS_DB = path.join(REGULATORY_DIR, 'checklists.json')
const AUDIT_LOG = path.join(REGULATORY_DIR, 'audit-trail.jsonl')

/**
 * Regulation domains and categories
 */
const REGULATION_DOMAINS = {
  FINANCIAL: 'financial',
  TAX: 'tax',
  DATA_PROTECTION: 'data-protection',
  HEALTHCARE: 'healthcare',
  ENERGY: 'energy',
  TELECOM: 'telecom',
  AVIATION: 'aviation',
  SECURITIES: 'securities',
  GDPR: 'gdpr',
  CCPA: 'ccpa',
  HIPAA: 'hipaa',
  SOC2: 'soc2',
  ISO27001: 'iso27001',
  PCI_DSS: 'pci-dss',
  CUSTOM: 'custom'
}

/**
 * Compliance status enum
 */
const COMPLIANCE_STATUS = {
  COMPLIANT: 'compliant',
  NON_COMPLIANT: 'non-compliant',
  PARTIAL: 'partial',
  NOT_APPLICABLE: 'not-applicable',
  IN_PROGRESS: 'in-progress',
  PENDING_REVIEW: 'pending-review'
}

/**
 * Requirement priority levels
 */
const REQUIREMENT_PRIORITY = {
  CRITICAL: 5,
  HIGH: 4,
  MEDIUM: 3,
  LOW: 2,
  INFORMATIONAL: 1
}

/**
 * Control types and objectives
 */
const CONTROL_TYPES = {
  PREVENTIVE: 'preventive',
  DETECTIVE: 'detective',
  CORRECTIVE: 'corrective',
  COMPENSATING: 'compensating',
  DIRECTIVE: 'directive'
}

/**
 * Regulatory Navigator — Comprehensive compliance management system
 */
class RegulatoryNavigator extends EventEmitter {
  constructor(options = {}) {
    super()
    this.options = {
      dataDir: options.dataDir || REGULATORY_DIR,
      verbose: options.verbose || false,
      jurisdiction: options.jurisdiction || 'US',
      ...options
    }

    this.regulations = new Map()
    this.requirements = new Map()
    this.controls = new Map()
    this.checklists = new Map()
    this.mappings = new Map() // requirement -> controls mapping
    this.metrics = {
      totalRegulations: 0,
      totalRequirements: 0,
      totalControls: 0,
      complianceRate: 0,
      gapCount: 0,
      riskScore: 0
    }

    this._ensureDataDir()
    this._loadAllData()
  }

  /**
   * Ensure regulatory directory exists
   */
  _ensureDataDir() {
    if (!fs.existsSync(this.options.dataDir)) {
      fs.mkdirSync(this.options.dataDir, { recursive: true })
    }
  }

  /**
   * Load all regulatory data from persistent storage
   */
  _loadAllData() {
    this._loadRegulations()
    this._loadRequirements()
    this._loadControls()
    this._loadChecklists()
  }

  /**
   * Load regulations database
   */
  _loadRegulations() {
    try {
      if (fs.existsSync(REGULATIONS_DB)) {
        const data = JSON.parse(fs.readFileSync(REGULATIONS_DB, 'utf8'))
        data.forEach((reg) => {
          this.regulations.set(reg.id, reg)
        })
      }
    } catch (error) {
      if (this.options.verbose) console.error(`Failed to load regulations: ${error.message}`)
    }
  }

  /**
   * Load requirements database
   */
  _loadRequirements() {
    try {
      if (fs.existsSync(REQUIREMENTS_DB)) {
        const data = JSON.parse(fs.readFileSync(REQUIREMENTS_DB, 'utf8'))
        data.forEach((req) => {
          this.requirements.set(req.id, req)
        })
      }
    } catch (error) {
      if (this.options.verbose) console.error(`Failed to load requirements: ${error.message}`)
    }
  }

  /**
   * Load controls database
   */
  _loadControls() {
    try {
      if (fs.existsSync(CONTROLS_DB)) {
        const data = JSON.parse(fs.readFileSync(CONTROLS_DB, 'utf8'))
        data.forEach((control) => {
          this.controls.set(control.id, control)
        })
      }
    } catch (error) {
      if (this.options.verbose) console.error(`Failed to load controls: ${error.message}`)
    }
  }

  /**
   * Load checklists database
   */
  _loadChecklists() {
    try {
      if (fs.existsSync(CHECKLISTS_DB)) {
        const data = JSON.parse(fs.readFileSync(CHECKLISTS_DB, 'utf8'))
        data.forEach((checklist) => {
          this.checklists.set(checklist.id, checklist)
        })
      }
    } catch (error) {
      if (this.options.verbose) console.error(`Failed to load checklists: ${error.message}`)
    }
  }

  /**
   * Save all data to persistent storage
   */
  _saveAllData() {
    this._saveRegulations()
    this._saveRequirements()
    this._saveControls()
    this._saveChecklists()
  }

  /**
   * Save regulations to disk
   */
  _saveRegulations() {
    try {
      const data = Array.from(this.regulations.values())
      fs.writeFileSync(REGULATIONS_DB, JSON.stringify(data, null, 2), 'utf8')
    } catch (error) {
      this.emit('error', { type: 'save-error', target: 'regulations', error: error.message })
    }
  }

  /**
   * Save requirements to disk
   */
  _saveRequirements() {
    try {
      const data = Array.from(this.requirements.values())
      fs.writeFileSync(REQUIREMENTS_DB, JSON.stringify(data, null, 2), 'utf8')
    } catch (error) {
      this.emit('error', { type: 'save-error', target: 'requirements', error: error.message })
    }
  }

  /**
   * Save controls to disk
   */
  _saveControls() {
    try {
      const data = Array.from(this.controls.values())
      fs.writeFileSync(CONTROLS_DB, JSON.stringify(data, null, 2), 'utf8')
    } catch (error) {
      this.emit('error', { type: 'save-error', target: 'controls', error: error.message })
    }
  }

  /**
   * Save checklists to disk
   */
  _saveChecklists() {
    try {
      const data = Array.from(this.checklists.values())
      fs.writeFileSync(CHECKLISTS_DB, JSON.stringify(data, null, 2), 'utf8')
    } catch (error) {
      this.emit('error', { type: 'save-error', target: 'checklists', error: error.message })
    }
  }

  /**
   * Audit log entry
   */
  _auditLog(entry) {
    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        ...entry
      }
      fs.appendFileSync(AUDIT_LOG, JSON.stringify(logEntry) + '\n', 'utf8')
    } catch (error) {
      if (this.options.verbose) console.error(`Failed to write audit trail: ${error.message}`)
    }
  }

  /**
   * Add a new regulation to the library
   */
  addRegulation(regulation) {
    const regId = regulation.id || `reg-${Date.now()}`
    const reg = {
      id: regId,
      name: regulation.name,
      domain: regulation.domain || REGULATION_DOMAINS.CUSTOM,
      jurisdiction: regulation.jurisdiction || this.options.jurisdiction,
      version: regulation.version || '1.0',
      effectiveDate: regulation.effectiveDate || new Date().toISOString(),
      source: regulation.source || '',
      description: regulation.description || '',
      requirements: regulation.requirements || [],
      controls: regulation.controls || [],
      metadata: regulation.metadata || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    this.regulations.set(regId, reg)
    this._saveRegulations()
    this._auditLog({ action: 'add-regulation', regulationId: regId })
    this.emit('regulation-added', { regulation: reg })

    return reg
  }

  /**
   * Add a requirement extracted from regulation
   */
  addRequirement(requirement) {
    const reqId = requirement.id || `req-${Date.now()}`
    const req = {
      id: reqId,
      regulationId: requirement.regulationId,
      clause: requirement.clause || '',
      text: requirement.text || '',
      priority: requirement.priority || REQUIREMENT_PRIORITY.MEDIUM,
      applicability: requirement.applicability || 'organizational',
      controlMappings: requirement.controlMappings || [],
      status: requirement.status || COMPLIANCE_STATUS.PENDING_REVIEW,
      evidence: requirement.evidence || [],
      notes: requirement.notes || '',
      metadata: requirement.metadata || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    this.requirements.set(reqId, req)
    this._saveRequirements()
    this._auditLog({ action: 'add-requirement', requirementId: reqId, regulationId: requirement.regulationId })
    this.emit('requirement-added', { requirement: req })

    return req
  }

  /**
   * Add a control that addresses regulatory requirements
   */
  addControl(control) {
    const controlId = control.id || `ctrl-${Date.now()}`
    const ctrl = {
      id: controlId,
      name: control.name || '',
      description: control.description || '',
      controlType: control.controlType || CONTROL_TYPES.PREVENTIVE,
      status: control.status || COMPLIANCE_STATUS.IN_PROGRESS,
      owner: control.owner || 'unassigned',
      frequency: control.frequency || 'quarterly',
      lastTested: control.lastTested || null,
      testResult: control.testResult || null,
      requirements: control.requirements || [],
      evidence: control.evidence || [],
      riskLevel: control.riskLevel || 'medium',
      maturityLevel: control.maturityLevel || 1,
      metadata: control.metadata || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    this.controls.set(controlId, ctrl)
    this._saveControls()
    this._auditLog({ action: 'add-control', controlId })
    this.emit('control-added', { control: ctrl })

    return ctrl
  }

  /**
   * Map a requirement to controls (create bidirectional mapping)
   */
  mapRequirementToControls(requirementId, controlIds) {
    const requirement = this.requirements.get(requirementId)
    if (!requirement) throw new Error(`Requirement ${requirementId} not found`)

    const mappingId = `map-${requirementId}-${Date.now()}`
    const mapping = {
      id: mappingId,
      requirementId,
      controlIds,
      coverage: this._calculateCoverage(controlIds),
      status: COMPLIANCE_STATUS.IN_PROGRESS,
      gaps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    this.mappings.set(mappingId, mapping)

    // Update requirement and controls
    requirement.controlMappings = [...new Set([...requirement.controlMappings, ...controlIds])]
    controlIds.forEach((cId) => {
      const ctrl = this.controls.get(cId)
      if (ctrl) {
        ctrl.requirements = [...new Set([...ctrl.requirements, requirementId])]
        ctrl.updatedAt = new Date().toISOString()
      }
    })

    this._saveRequirements()
    this._saveControls()
    this._auditLog({ action: 'map-requirement-controls', requirementId, controlIds })
    this.emit('requirement-mapped', { mapping })

    return mapping
  }

  /**
   * Calculate coverage percentage for a mapping
   */
  _calculateCoverage(controlIds) {
    if (controlIds.length === 0) return 0
    const tested = controlIds.filter((cId) => {
      const ctrl = this.controls.get(cId)
      return ctrl && ctrl.testResult === true
    }).length
    return Math.round((tested / controlIds.length) * 100)
  }

  /**
   * Generate compliance checklist from requirements
   */
  generateChecklist(regulationId, options = {}) {
    const checklistId = options.id || `checklist-${Date.now()}`
    const regulation = this.regulations.get(regulationId)
    if (!regulation) throw new Error(`Regulation ${regulationId} not found`)

    const items = regulation.requirements
      .map((reqId) => {
        const req = this.requirements.get(reqId)
        if (!req) return null
        return {
          id: `item-${reqId}`,
          requirementId: reqId,
          clause: req.clause,
          text: req.text,
          priority: req.priority,
          completed: false,
          assignee: options.defaultAssignee || 'unassigned',
          dueDate: options.dueDate || this._calculateDueDate(req.priority),
          notes: '',
          attachments: []
        }
      })
      .filter(Boolean)

    const checklist = {
      id: checklistId,
      regulationId,
      name: `${regulation.name} - Compliance Checklist`,
      status: COMPLIANCE_STATUS.IN_PROGRESS,
      totalItems: items.length,
      completedItems: 0,
      items,
      progress: 0,
      owner: options.owner || 'compliance-team',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: options.dueDate || this._calculateDueDate(REQUIREMENT_PRIORITY.HIGH)
    }

    this.checklists.set(checklistId, checklist)
    this._saveChecklists()
    this._auditLog({ action: 'generate-checklist', checklistId, regulationId })
    this.emit('checklist-generated', { checklist })

    return checklist
  }

  /**
   * Calculate due date based on priority
   */
  _calculateDueDate(priority) {
    const now = new Date()
    const days = {
      [REQUIREMENT_PRIORITY.CRITICAL]: 7,
      [REQUIREMENT_PRIORITY.HIGH]: 30,
      [REQUIREMENT_PRIORITY.MEDIUM]: 90,
      [REQUIREMENT_PRIORITY.LOW]: 180,
      [REQUIREMENT_PRIORITY.INFORMATIONAL]: 365
    }
    const daysToAdd = days[priority] || 90
    return new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000).toISOString()
  }

  /**
   * Update checklist item completion status
   */
  updateChecklistItem(checklistId, itemId, updates) {
    const checklist = this.checklists.get(checklistId)
    if (!checklist) throw new Error(`Checklist ${checklistId} not found`)

    const itemIndex = checklist.items.findIndex((i) => i.id === itemId)
    if (itemIndex === -1) throw new Error(`Item ${itemId} not found`)

    const item = checklist.items[itemIndex]
    const wasCompleted = item.completed

    Object.assign(item, updates)

    if (item.completed && !wasCompleted) {
      checklist.completedItems++
    } else if (!item.completed && wasCompleted) {
      checklist.completedItems--
    }

    checklist.progress = Math.round((checklist.completedItems / checklist.totalItems) * 100)
    checklist.updatedAt = new Date().toISOString()

    if (checklist.progress === 100) {
      checklist.status = COMPLIANCE_STATUS.COMPLIANT
    }

    this._saveChecklists()
    this._auditLog({ action: 'update-checklist-item', checklistId, itemId, updates })
    this.emit('checklist-updated', { checklist, item })

    return { checklist, item }
  }

  /**
   * Perform gap analysis between requirements and controls
   */
  performGapAnalysis(regulationId) {
    const regulation = this.regulations.get(regulationId)
    if (!regulation) throw new Error(`Regulation ${regulationId} not found`)

    const gaps = []
    const coverage = []

    regulation.requirements.forEach((reqId) => {
      const req = this.requirements.get(reqId)
      if (!req || !req.controlMappings || req.controlMappings.length === 0) {
        gaps.push({
          requirementId: reqId,
          clause: req?.clause || '',
          text: req?.text || '',
          severity: req?.priority || REQUIREMENT_PRIORITY.MEDIUM,
          reason: 'No controls mapped'
        })
      } else {
        const untested = req.controlMappings.filter((cId) => {
          const ctrl = this.controls.get(cId)
          return ctrl && ctrl.testResult !== true
        })

        if (untested.length > 0) {
          gaps.push({
            requirementId: reqId,
            clause: req?.clause || '',
            text: req?.text || '',
            severity: REQUIREMENT_PRIORITY.MEDIUM,
            reason: `${untested.length} mapped controls not tested`,
            affectedControls: untested
          })
        }

        coverage.push({
          requirementId: reqId,
          controlCount: req.controlMappings.length,
          testedCount: req.controlMappings.filter((cId) => {
            const ctrl = this.controls.get(cId)
            return ctrl && ctrl.testResult === true
          }).length
        })
      }
    })

    const analysis = {
      regulationId,
      timestamp: new Date().toISOString(),
      totalRequirements: regulation.requirements.length,
      gapCount: gaps.length,
      gapPercentage: Math.round((gaps.length / regulation.requirements.length) * 100),
      gaps,
      coverage,
      recommendations: this._generateRecommendations(gaps)
    }

    this._auditLog({ action: 'gap-analysis', regulationId, gapCount: gaps.length })
    this.emit('gap-analysis-complete', { analysis })

    return analysis
  }

  /**
   * Generate remediation recommendations based on gaps
   */
  _generateRecommendations(gaps) {
    const recommendations = []

    gaps.forEach((gap) => {
      if (gap.reason.includes('No controls mapped')) {
        recommendations.push({
          gapId: gap.requirementId,
          priority: gap.severity,
          action: 'Create and map controls',
          details: `Requirement "${gap.text}" lacks mapped controls`,
          effort: 'high'
        })
      } else if (gap.reason.includes('not tested')) {
        recommendations.push({
          gapId: gap.requirementId,
          priority: gap.severity,
          action: 'Test existing controls',
          details: `Schedule testing for ${gap.affectedControls?.length || 0} controls`,
          effort: 'medium'
        })
      }
    })

    return recommendations
  }

  /**
   * Update control test result
   */
  updateControlTest(controlId, testResult, evidence = {}) {
    const control = this.controls.get(controlId)
    if (!control) throw new Error(`Control ${controlId} not found`)

    control.testResult = testResult
    control.lastTested = new Date().toISOString()
    if (evidence) {
      control.evidence.push({
        timestamp: new Date().toISOString(),
        result: testResult,
        details: evidence
      })
    }

    if (testResult) {
      control.status = COMPLIANCE_STATUS.COMPLIANT
    } else {
      control.status = COMPLIANCE_STATUS.NON_COMPLIANT
    }

    control.updatedAt = new Date().toISOString()
    this._saveControls()
    this._auditLog({ action: 'test-control', controlId, result: testResult })
    this.emit('control-tested', { control })

    return control
  }

  /**
   * Get compliance status summary
   */
  getComplianceStatus(regulationId) {
    const regulation = this.regulations.get(regulationId)
    if (!regulation) throw new Error(`Regulation ${regulationId} not found`)

    const requirements = regulation.requirements
      .map((reqId) => this.requirements.get(reqId))
      .filter(Boolean)

    const compliant = requirements.filter((r) => r.status === COMPLIANCE_STATUS.COMPLIANT).length
    const nonCompliant = requirements.filter((r) => r.status === COMPLIANCE_STATUS.NON_COMPLIANT)
      .length
    const partial = requirements.filter((r) => r.status === COMPLIANCE_STATUS.PARTIAL).length
    const inProgress = requirements.filter((r) => r.status === COMPLIANCE_STATUS.IN_PROGRESS).length

    return {
      regulationId,
      regulationName: regulation.name,
      totalRequirements: requirements.length,
      compliant,
      nonCompliant,
      partial,
      inProgress,
      compliancePercentage: Math.round((compliant / requirements.length) * 100),
      status:
        compliant === requirements.length
          ? COMPLIANCE_STATUS.COMPLIANT
          : nonCompliant > 0
            ? COMPLIANCE_STATUS.NON_COMPLIANT
            : COMPLIANCE_STATUS.PARTIAL
    }
  }

  /**
   * Get all regulations by domain
   */
  getRegulationsByDomain(domain) {
    return Array.from(this.regulations.values()).filter((r) => r.domain === domain)
  }

  /**
   * Get all requirements by status
   */
  getRequirementsByStatus(status) {
    return Array.from(this.requirements.values()).filter((r) => r.status === status)
  }

  /**
   * Get all controls by status
   */
  getControlsByStatus(status) {
    return Array.from(this.controls.values()).filter((c) => c.status === status)
  }

  /**
   * Get all non-compliant requirements
   */
  getNonCompliantRequirements() {
    return this.getRequirementsByStatus(COMPLIANCE_STATUS.NON_COMPLIANT)
  }

  /**
   * Get all non-compliant controls
   */
  getNonCompliantControls() {
    return this.getControlsByStatus(COMPLIANCE_STATUS.NON_COMPLIANT)
  }

  /**
   * Calculate overall compliance metrics
   */
  updateMetrics() {
    this.metrics.totalRegulations = this.regulations.size
    this.metrics.totalRequirements = this.requirements.size
    this.metrics.totalControls = this.controls.size

    const allRequirements = Array.from(this.requirements.values())
    const compliantReqs = allRequirements.filter(
      (r) => r.status === COMPLIANCE_STATUS.COMPLIANT
    ).length
    this.metrics.complianceRate =
      allRequirements.length > 0 ? Math.round((compliantReqs / allRequirements.length) * 100) : 0

    const nonCompliant = this.getNonCompliantControls()
    const highRiskControls = nonCompliant.filter((c) => c.riskLevel === 'high').length
    const criticalRiskControls = nonCompliant.filter((c) => c.riskLevel === 'critical').length

    this.metrics.gapCount = Array.from(this.requirements.values()).filter(
      (r) => !r.controlMappings || r.controlMappings.length === 0
    ).length
    this.metrics.riskScore = criticalRiskControls * 10 + highRiskControls * 5 + nonCompliant.length

    return this.metrics
  }

  /**
   * Generate compliance dashboard HTML
   */
  generateDashboardHTML() {
    const metrics = this.updateMetrics()
    const nonCompliantReqs = this.getNonCompliantRequirements()
    const nonCompliantControls = this.getNonCompliantControls()

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Regulatory Compliance Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0d1117;
      color: #c9d1d9;
      padding: 20px;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    h1, h2 { color: #58a6ff; margin-bottom: 20px; }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    }
    .metric-card {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 8px;
      padding: 16px;
    }
    .metric-label { font-size: 11px; text-transform: uppercase; color: #8b949e; }
    .metric-value { font-size: 28px; font-weight: bold; color: #58a6ff; margin: 8px 0; }
    .metric-detail { font-size: 11px; color: #6e7681; }
    .progress-bar {
      background: #30363d;
      border-radius: 4px;
      height: 6px;
      margin-top: 8px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3fb950, #58a6ff);
      transition: width 0.3s;
    }
    .section { margin-bottom: 40px; }
    .requirement-item, .control-item {
      background: #161b22;
      border-left: 4px solid #f85149;
      border-radius: 4px;
      padding: 12px;
      margin-bottom: 8px;
      font-size: 12px;
    }
    .requirement-item.compliant, .control-item.compliant {
      border-left-color: #3fb950;
    }
    .requirement-item.warning, .control-item.warning {
      border-left-color: #d29922;
    }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: 600;
      margin-right: 4px;
      background: #30363d;
    }
    .badge.critical { background: #da3633; }
    .badge.high { background: #f85149; }
    .badge.medium { background: #d29922; }
    .badge.low { background: #3fb950; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #30363d;
    }
    th { background: #0d1117; font-weight: 600; }
    .empty-state { padding: 20px; text-align: center; color: #8b949e; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Regulatory Compliance Dashboard</h1>
    <p style="color: #8b949e; margin-bottom: 30px;">Real-time compliance monitoring across regulations</p>

    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">Compliance Rate</div>
        <div class="metric-value">${metrics.complianceRate}%</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${metrics.complianceRate}%"></div>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Total Regulations</div>
        <div class="metric-value">${metrics.totalRegulations}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Total Requirements</div>
        <div class="metric-value">${metrics.totalRequirements}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Total Controls</div>
        <div class="metric-value">${metrics.totalControls}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Compliance Gaps</div>
        <div class="metric-value" style="color: #f85149;">${metrics.gapCount}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Risk Score</div>
        <div class="metric-value" style="color: ${metrics.riskScore > 20 ? '#f85149' : metrics.riskScore > 10 ? '#d29922' : '#3fb950'};">${metrics.riskScore}</div>
      </div>
    </div>

    <div class="section">
      <h2>Non-Compliant Requirements (${nonCompliantReqs.length})</h2>
      ${
        nonCompliantReqs.length === 0
          ? '<div class="empty-state">All requirements are compliant</div>'
          : `
            <table>
              <thead>
                <tr>
                  <th>Requirement</th>
                  <th>Priority</th>
                  <th>Controls Mapped</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${nonCompliantReqs
                  .slice(0, 10)
                  .map(
                    (req) => `
                  <tr>
                    <td>${req.text.substring(0, 80)}...</td>
                    <td><span class="badge">${Object.keys(REQUIREMENT_PRIORITY).find((k) => REQUIREMENT_PRIORITY[k] === req.priority)}</span></td>
                    <td>${req.controlMappings?.length || 0}</td>
                    <td><span class="badge high">Non-Compliant</span></td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          `
      }
    </div>

    <div class="section">
      <h2>Non-Compliant Controls (${nonCompliantControls.length})</h2>
      ${
        nonCompliantControls.length === 0
          ? '<div class="empty-state">All controls are in compliance</div>'
          : `
            <table>
              <thead>
                <tr>
                  <th>Control</th>
                  <th>Type</th>
                  <th>Risk Level</th>
                  <th>Owner</th>
                  <th>Last Tested</th>
                </tr>
              </thead>
              <tbody>
                ${nonCompliantControls
                  .slice(0, 10)
                  .map(
                    (ctrl) => `
                  <tr>
                    <td>${ctrl.name}</td>
                    <td>${ctrl.controlType}</td>
                    <td><span class="badge ${ctrl.riskLevel}">${ctrl.riskLevel.toUpperCase()}</span></td>
                    <td>${ctrl.owner}</td>
                    <td>${ctrl.lastTested ? new Date(ctrl.lastTested).toLocaleDateString() : 'Never'}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          `
      }
    </div>

    <div class="section">
      <h2>Regulations Overview</h2>
      <table>
        <thead>
          <tr>
            <th>Regulation</th>
            <th>Domain</th>
            <th>Requirements</th>
            <th>Controls</th>
            <th>Compliance</th>
          </tr>
        </thead>
        <tbody>
          ${Array.from(this.regulations.values())
            .slice(0, 10)
            .map((reg) => {
              const status = this.getComplianceStatus(reg.id)
              return `
            <tr>
              <td>${reg.name}</td>
              <td>${reg.domain}</td>
              <td>${status.totalRequirements}</td>
              <td>${reg.controls?.length || 0}</td>
              <td><span class="badge" style="background: ${status.compliancePercentage === 100 ? '#238636' : status.compliancePercentage > 50 ? '#1f6feb' : '#f85149'};">${status.compliancePercentage}%</span></td>
            </tr>
          `
            })
            .join('')}
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>
    `
  }

  /**
   * Export compliance report to JSON
   */
  exportComplianceReport(regulationId) {
    const regulation = this.regulations.get(regulationId)
    if (!regulation) throw new Error(`Regulation ${regulationId} not found`)

    const requirements = regulation.requirements
      .map((reqId) => this.requirements.get(reqId))
      .filter(Boolean)

    const report = {
      timestamp: new Date().toISOString(),
      regulation: {
        id: regulation.id,
        name: regulation.name,
        domain: regulation.domain,
        jurisdiction: regulation.jurisdiction,
        version: regulation.version
      },
      summary: this.getComplianceStatus(regulationId),
      requirements: requirements.map((req) => ({
        id: req.id,
        clause: req.clause,
        text: req.text,
        priority: req.priority,
        status: req.status,
        controls: req.controlMappings?.map((cId) => {
          const ctrl = this.controls.get(cId)
          return {
            id: cId,
            name: ctrl?.name,
            status: ctrl?.status,
            lastTested: ctrl?.lastTested
          }
        })
      })),
      gaps: this.performGapAnalysis(regulationId).gaps
    }

    return report
  }

  /**
   * Export as CSV
   */
  exportAsCSV(regulationId) {
    const regulation = this.regulations.get(regulationId)
    if (!regulation) throw new Error(`Regulation ${regulationId} not found`)

    const lines = ['Requirement ID,Clause,Status,Priority,Mapped Controls,Test Results']

    const requirements = regulation.requirements
      .map((reqId) => this.requirements.get(reqId))
      .filter(Boolean)

    requirements.forEach((req) => {
      const controlInfo = (req.controlMappings || [])
        .map((cId) => {
          const ctrl = this.controls.get(cId)
          return `${ctrl?.name}(${ctrl?.testResult ? 'PASS' : 'FAIL'})`
        })
        .join('; ')

      lines.push(
        `"${req.id}","${req.clause}","${req.status}","${req.priority}","${controlInfo}",""`
      )
    })

    return lines.join('\n')
  }
}

module.exports = RegulatoryNavigator
module.exports.REGULATION_DOMAINS = REGULATION_DOMAINS
module.exports.COMPLIANCE_STATUS = COMPLIANCE_STATUS
module.exports.REQUIREMENT_PRIORITY = REQUIREMENT_PRIORITY
module.exports.CONTROL_TYPES = CONTROL_TYPES
