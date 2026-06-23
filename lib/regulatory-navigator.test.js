/**
 * Tests for Regulatory Navigator
 */

const RegulatoryNavigator = require('./regulatory-navigator')
const {
  REGULATION_DOMAINS,
  COMPLIANCE_STATUS,
  REQUIREMENT_PRIORITY,
  CONTROL_TYPES
} = RegulatoryNavigator

describe('RegulatoryNavigator', () => {
  let nav
  const testDir = '/tmp/regulatory-test'

  beforeEach(() => {
    nav = new RegulatoryNavigator({ dataDir: testDir, verbose: false })
  })

  describe('Regulation Management', () => {
    test('should add a regulation', () => {
      const reg = nav.addRegulation({
        name: 'GDPR',
        domain: REGULATION_DOMAINS.GDPR,
        jurisdiction: 'EU',
        description: 'General Data Protection Regulation'
      })

      expect(reg.id).toBeDefined()
      expect(reg.name).toBe('GDPR')
      expect(reg.domain).toBe(REGULATION_DOMAINS.GDPR)
      expect(nav.regulations.size).toBe(1)
    })

    test('should retrieve regulation by ID', () => {
      const reg = nav.addRegulation({
        name: 'CCPA',
        domain: REGULATION_DOMAINS.CCPA
      })

      const retrieved = nav.regulations.get(reg.id)
      expect(retrieved).toEqual(reg)
    })

    test('should get regulations by domain', () => {
      nav.addRegulation({ name: 'GDPR', domain: REGULATION_DOMAINS.GDPR })
      nav.addRegulation({ name: 'CCPA', domain: REGULATION_DOMAINS.CCPA })
      nav.addRegulation({ name: 'HIPAA', domain: REGULATION_DOMAINS.HIPAA })

      const gdprRegs = nav.getRegulationsByDomain(REGULATION_DOMAINS.GDPR)
      expect(gdprRegs.length).toBe(1)
      expect(gdprRegs[0].name).toBe('GDPR')
    })

    test('should update regulation', () => {
      const reg = nav.addRegulation({
        name: 'SOC2',
        domain: REGULATION_DOMAINS.SOC2
      })

      reg.version = '2.1'
      nav._saveRegulations()

      const updated = nav.regulations.get(reg.id)
      expect(updated.version).toBe('2.1')
    })
  })

  describe('Requirement Management', () => {
    test('should add a requirement', () => {
      const reg = nav.addRegulation({
        name: 'PCI-DSS',
        domain: REGULATION_DOMAINS.PCI_DSS
      })

      const req = nav.addRequirement({
        regulationId: reg.id,
        clause: '2.1',
        text: 'Change all vendor-supplied defaults',
        priority: REQUIREMENT_PRIORITY.CRITICAL
      })

      expect(req.id).toBeDefined()
      expect(req.clause).toBe('2.1')
      expect(req.priority).toBe(REQUIREMENT_PRIORITY.CRITICAL)
      expect(nav.requirements.size).toBe(1)
    })

    test('should get requirements by status', () => {
      nav.addRequirement({
        clause: 'A1',
        text: 'Requirement A',
        status: COMPLIANCE_STATUS.COMPLIANT
      })
      nav.addRequirement({
        clause: 'A2',
        text: 'Requirement B',
        status: COMPLIANCE_STATUS.NON_COMPLIANT
      })

      const compliant = nav.getRequirementsByStatus(COMPLIANCE_STATUS.COMPLIANT)
      expect(compliant.length).toBe(1)

      const nonCompliant = nav.getRequirementsByStatus(COMPLIANCE_STATUS.NON_COMPLIANT)
      expect(nonCompliant.length).toBe(1)
    })

    test('should get non-compliant requirements', () => {
      nav.addRequirement({ clause: 'A1', status: COMPLIANCE_STATUS.COMPLIANT })
      nav.addRequirement({ clause: 'A2', status: COMPLIANCE_STATUS.NON_COMPLIANT })
      nav.addRequirement({ clause: 'A3', status: COMPLIANCE_STATUS.NON_COMPLIANT })

      const nonCompliant = nav.getNonCompliantRequirements()
      expect(nonCompliant.length).toBe(2)
    })
  })

  describe('Control Management', () => {
    test('should add a control', () => {
      const ctrl = nav.addControl({
        name: 'Access Control Policy',
        description: 'Manage user access',
        controlType: CONTROL_TYPES.PREVENTIVE,
        owner: 'security-team'
      })

      expect(ctrl.id).toBeDefined()
      expect(ctrl.name).toBe('Access Control Policy')
      expect(ctrl.controlType).toBe(CONTROL_TYPES.PREVENTIVE)
      expect(nav.controls.size).toBe(1)
    })

    test('should get controls by status', () => {
      nav.addControl({
        name: 'Control A',
        status: COMPLIANCE_STATUS.COMPLIANT
      })
      nav.addControl({
        name: 'Control B',
        status: COMPLIANCE_STATUS.NON_COMPLIANT
      })

      const compliant = nav.getControlsByStatus(COMPLIANCE_STATUS.COMPLIANT)
      expect(compliant.length).toBe(1)

      const nonCompliant = nav.getControlsByStatus(COMPLIANCE_STATUS.NON_COMPLIANT)
      expect(nonCompliant.length).toBe(1)
    })

    test('should update control test result', () => {
      const ctrl = nav.addControl({
        name: 'Test Control',
        testResult: null
      })

      const updated = nav.updateControlTest(ctrl.id, true, {
        testedBy: 'auditor',
        notes: 'Passed all checks'
      })

      expect(updated.testResult).toBe(true)
      expect(updated.status).toBe(COMPLIANCE_STATUS.COMPLIANT)
      expect(updated.evidence.length).toBe(1)
    })

    test('should get non-compliant controls', () => {
      nav.addControl({
        name: 'Control A',
        status: COMPLIANCE_STATUS.COMPLIANT
      })
      nav.addControl({
        name: 'Control B',
        status: COMPLIANCE_STATUS.NON_COMPLIANT
      })
      nav.addControl({
        name: 'Control C',
        status: COMPLIANCE_STATUS.NON_COMPLIANT
      })

      const nonCompliant = nav.getNonCompliantControls()
      expect(nonCompliant.length).toBe(2)
    })
  })

  describe('Requirement-Control Mapping', () => {
    test('should map requirements to controls', () => {
      const req = nav.addRequirement({
        clause: '1.1',
        text: 'Test requirement'
      })

      const ctrl1 = nav.addControl({
        name: 'Control 1'
      })

      const ctrl2 = nav.addControl({
        name: 'Control 2'
      })

      const mapping = nav.mapRequirementToControls(req.id, [ctrl1.id, ctrl2.id])

      expect(mapping.requirementId).toBe(req.id)
      expect(mapping.controlIds.length).toBe(2)
      expect(mapping.status).toBe(COMPLIANCE_STATUS.IN_PROGRESS)
    })

    test('should calculate coverage percentage', () => {
      const ctrl1 = nav.addControl({ name: 'Control 1', testResult: true })
      const ctrl2 = nav.addControl({ name: 'Control 2', testResult: false })
      const ctrl3 = nav.addControl({ name: 'Control 3', testResult: true })

      const req = nav.addRequirement({ clause: '1.1' })
      const mapping = nav.mapRequirementToControls(req.id, [ctrl1.id, ctrl2.id, ctrl3.id])

      expect(mapping.coverage).toBe(67)
    })

    test('should update requirement and control when mapping', () => {
      const req = nav.addRequirement({ clause: '1.1' })
      const ctrl = nav.addControl({ name: 'Control 1' })

      nav.mapRequirementToControls(req.id, [ctrl.id])

      const updatedReq = nav.requirements.get(req.id)
      const updatedCtrl = nav.controls.get(ctrl.id)

      expect(updatedReq.controlMappings).toContain(ctrl.id)
      expect(updatedCtrl.requirements).toContain(req.id)
    })
  })

  describe('Checklist Generation', () => {
    test('should generate compliance checklist', () => {
      const reg = nav.addRegulation({
        name: 'Test Regulation',
        requirements: []
      })

      const req1 = nav.addRequirement({
        regulationId: reg.id,
        clause: '1.1',
        text: 'First requirement',
        priority: REQUIREMENT_PRIORITY.HIGH
      })

      const req2 = nav.addRequirement({
        regulationId: reg.id,
        clause: '1.2',
        text: 'Second requirement',
        priority: REQUIREMENT_PRIORITY.MEDIUM
      })

      reg.requirements = [req1.id, req2.id]
      nav._saveRegulations()

      const checklist = nav.generateChecklist(reg.id, {
        owner: 'compliance-team'
      })

      expect(checklist.id).toBeDefined()
      expect(checklist.totalItems).toBe(2)
      expect(checklist.completedItems).toBe(0)
      expect(checklist.progress).toBe(0)
      expect(nav.checklists.size).toBe(1)
    })

    test('should update checklist item completion', () => {
      const reg = nav.addRegulation({
        name: 'Test Regulation',
        requirements: []
      })

      const req = nav.addRequirement({
        regulationId: reg.id,
        clause: '1.1',
        text: 'Test requirement'
      })

      reg.requirements = [req.id]
      nav._saveRegulations()

      const checklist = nav.generateChecklist(reg.id)
      const itemId = checklist.items[0].id

      const { updated } = nav.updateChecklistItem(checklist.id, itemId, {
        completed: true,
        notes: 'Task completed'
      })

      const updatedChecklist = nav.checklists.get(checklist.id)
      expect(updatedChecklist.completedItems).toBe(1)
      expect(updatedChecklist.progress).toBe(100)
      expect(updatedChecklist.status).toBe(COMPLIANCE_STATUS.COMPLIANT)
    })

    test('should calculate due date based on priority', () => {
      const criticalDate = nav._calculateDueDate(REQUIREMENT_PRIORITY.CRITICAL)
      const lowDate = nav._calculateDueDate(REQUIREMENT_PRIORITY.LOW)

      const now = new Date()
      const criticalMs = new Date(criticalDate).getTime() - now.getTime()
      const lowMs = new Date(lowDate).getTime() - now.getTime()

      expect(criticalMs).toBeLessThan(lowMs)
    })
  })

  describe('Gap Analysis', () => {
    test('should identify gaps in requirement coverage', () => {
      const reg = nav.addRegulation({
        name: 'Test Regulation',
        requirements: []
      })

      const req1 = nav.addRequirement({
        regulationId: reg.id,
        clause: '1.1',
        text: 'Requirement without control',
        priority: REQUIREMENT_PRIORITY.HIGH
      })

      const req2 = nav.addRequirement({
        regulationId: reg.id,
        clause: '1.2',
        text: 'Requirement with control',
        priority: REQUIREMENT_PRIORITY.MEDIUM
      })

      const ctrl = nav.addControl({ name: 'Control 1' })
      nav.mapRequirementToControls(req2.id, [ctrl.id])

      reg.requirements = [req1.id, req2.id]
      nav._saveRegulations()

      const analysis = nav.performGapAnalysis(reg.id)

      expect(analysis.totalRequirements).toBe(2)
      expect(analysis.gapCount).toBe(1)
      expect(analysis.gaps[0].requirementId).toBe(req1.id)
    })

    test('should generate remediation recommendations', () => {
      const reg = nav.addRegulation({
        name: 'Test Regulation',
        requirements: []
      })

      const req = nav.addRequirement({
        regulationId: reg.id,
        clause: '1.1',
        text: 'Uncovered requirement'
      })

      reg.requirements = [req.id]
      nav._saveRegulations()

      const analysis = nav.performGapAnalysis(reg.id)

      expect(analysis.recommendations.length).toBeGreaterThan(0)
      expect(analysis.recommendations[0].action).toContain('control')
    })
  })

  describe('Compliance Status', () => {
    test('should calculate compliance status', () => {
      const reg = nav.addRegulation({
        name: 'Test Regulation',
        requirements: []
      })

      const req1 = nav.addRequirement({
        regulationId: reg.id,
        clause: '1.1',
        status: COMPLIANCE_STATUS.COMPLIANT
      })

      const req2 = nav.addRequirement({
        regulationId: reg.id,
        clause: '1.2',
        status: COMPLIANCE_STATUS.NON_COMPLIANT
      })

      reg.requirements = [req1.id, req2.id]
      nav._saveRegulations()

      const status = nav.getComplianceStatus(reg.id)

      expect(status.totalRequirements).toBe(2)
      expect(status.compliant).toBe(1)
      expect(status.nonCompliant).toBe(1)
      expect(status.compliancePercentage).toBe(50)
      expect(status.status).toBe(COMPLIANCE_STATUS.PARTIAL)
    })

    test('should report fully compliant regulation', () => {
      const reg = nav.addRegulation({
        name: 'Compliant Regulation',
        requirements: []
      })

      const req = nav.addRequirement({
        regulationId: reg.id,
        clause: '1.1',
        status: COMPLIANCE_STATUS.COMPLIANT
      })

      reg.requirements = [req.id]
      nav._saveRegulations()

      const status = nav.getComplianceStatus(reg.id)

      expect(status.compliant).toBe(1)
      expect(status.compliancePercentage).toBe(100)
      expect(status.status).toBe(COMPLIANCE_STATUS.COMPLIANT)
    })
  })

  describe('Metrics', () => {
    test('should update compliance metrics', () => {
      nav.addRegulation({ name: 'Reg 1' })
      nav.addRegulation({ name: 'Reg 2' })

      nav.addRequirement({
        clause: '1.1',
        status: COMPLIANCE_STATUS.COMPLIANT
      })
      nav.addRequirement({
        clause: '1.2',
        status: COMPLIANCE_STATUS.NON_COMPLIANT
      })

      nav.addControl({ name: 'Control 1' })

      const metrics = nav.updateMetrics()

      expect(metrics.totalRegulations).toBe(2)
      expect(metrics.totalRequirements).toBe(2)
      expect(metrics.totalControls).toBe(1)
      expect(metrics.complianceRate).toBe(50)
    })

    test('should calculate risk score', () => {
      nav.addControl({
        name: 'Critical Control',
        status: COMPLIANCE_STATUS.NON_COMPLIANT,
        riskLevel: 'critical'
      })
      nav.addControl({
        name: 'High Control',
        status: COMPLIANCE_STATUS.NON_COMPLIANT,
        riskLevel: 'high'
      })
      nav.addControl({
        name: 'Low Control',
        status: COMPLIANCE_STATUS.NON_COMPLIANT,
        riskLevel: 'low'
      })

      const metrics = nav.updateMetrics()

      expect(metrics.riskScore).toBeGreaterThan(0)
      expect(metrics.riskScore).toBe(10 + 5 + 1)
    })
  })

  describe('Reporting', () => {
    test('should export compliance report as JSON', () => {
      const reg = nav.addRegulation({
        name: 'Test Regulation',
        domain: REGULATION_DOMAINS.SOC2,
        version: '1.0',
        requirements: []
      })

      const req = nav.addRequirement({
        regulationId: reg.id,
        clause: '1.1',
        text: 'Test requirement',
        status: COMPLIANCE_STATUS.COMPLIANT
      })

      const ctrl = nav.addControl({ name: 'Test Control' })
      nav.mapRequirementToControls(req.id, [ctrl.id])

      reg.requirements = [req.id]
      nav._saveRegulations()

      const report = nav.exportComplianceReport(reg.id)

      expect(report.timestamp).toBeDefined()
      expect(report.regulation.name).toBe('Test Regulation')
      expect(report.summary).toBeDefined()
      expect(report.requirements.length).toBe(1)
    })

    test('should export as CSV', () => {
      const reg = nav.addRegulation({
        name: 'Test Regulation',
        requirements: []
      })

      const req = nav.addRequirement({
        regulationId: reg.id,
        clause: '1.1',
        text: 'Test requirement',
        status: COMPLIANCE_STATUS.COMPLIANT
      })

      reg.requirements = [req.id]
      nav._saveRegulations()

      const csv = nav.exportAsCSV(reg.id)

      expect(csv).toContain('Requirement ID')
      expect(csv).toContain('1.1')
      expect(csv).toContain('COMPLIANT')
    })
  })

  describe('Event Emission', () => {
    test('should emit regulation-added event', (done) => {
      nav.on('regulation-added', (data) => {
        expect(data.regulation.name).toBe('Test Reg')
        done()
      })

      nav.addRegulation({ name: 'Test Reg' })
    })

    test('should emit requirement-added event', (done) => {
      nav.on('requirement-added', (data) => {
        expect(data.requirement.clause).toBe('1.1')
        done()
      })

      nav.addRequirement({ clause: '1.1', text: 'Test' })
    })

    test('should emit control-added event', (done) => {
      nav.on('control-added', (data) => {
        expect(data.control.name).toBe('Test Control')
        done()
      })

      nav.addControl({ name: 'Test Control' })
    })

    test('should emit checklist-generated event', (done) => {
      nav.on('checklist-generated', (data) => {
        expect(data.checklist.id).toBeDefined()
        done()
      })

      const reg = nav.addRegulation({ name: 'Test', requirements: [] })
      nav.generateChecklist(reg.id)
    })

    test('should emit control-tested event', (done) => {
      nav.on('control-tested', (data) => {
        expect(data.control.testResult).toBe(true)
        done()
      })

      const ctrl = nav.addControl({ name: 'Test' })
      nav.updateControlTest(ctrl.id, true)
    })
  })

  describe('Edge Cases', () => {
    test('should handle empty regulations gracefully', () => {
      const regs = nav.getRegulationsByDomain(REGULATION_DOMAINS.GDPR)
      expect(regs).toEqual([])
    })

    test('should handle non-existent regulation in gap analysis', () => {
      expect(() => {
        nav.performGapAnalysis('non-existent-id')
      }).toThrow()
    })

    test('should handle non-existent control in test update', () => {
      expect(() => {
        nav.updateControlTest('non-existent-id', true)
      }).toThrow()
    })

    test('should handle invalid mapping', () => {
      expect(() => {
        nav.mapRequirementToControls('non-existent-req', ['some-control'])
      }).toThrow()
    })

    test('should handle duplicate control mappings', () => {
      const req = nav.addRequirement({ clause: '1.1' })
      const ctrl = nav.addControl({ name: 'Control 1' })

      nav.mapRequirementToControls(req.id, [ctrl.id])
      nav.mapRequirementToControls(req.id, [ctrl.id])

      const updated = nav.requirements.get(req.id)
      const uniqueControls = new Set(updated.controlMappings)
      expect(uniqueControls.size).toBe(updated.controlMappings.length)
    })
  })
})
