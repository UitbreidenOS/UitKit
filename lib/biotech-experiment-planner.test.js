/**
 * Biotech Experiment Planner Tests
 */

const assert = require('assert');
const BiotechExperimentPlanner = require('./biotech-experiment-planner');
const fs = require('fs');
const path = require('path');

describe('BiotechExperimentPlanner', () => {
  let planner;
  const tempDir = '/tmp/biotech-planner-test-' + Date.now();

  before(() => {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
  });

  beforeEach(() => {
    planner = new BiotechExperimentPlanner({
      projectName: 'Test Project',
      labNotebookIntegration: 'none',
      outputDir: tempDir,
      quiet: true,
    });
  });

  after(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
  });

  describe('Initialization', () => {
    it('should create planner instance with default config', () => {
      const p = new BiotechExperimentPlanner();
      assert.ok(p.projectName.startsWith('Experiment_'));
      assert.strictEqual(p.labNotebookIntegration, 'benchling');
      assert.strictEqual(p.researchField, 'molecular_biology');
    });

    it('should create planner with custom config', () => {
      const p = new BiotechExperimentPlanner({
        projectName: 'Custom Project',
        researchField: 'protein_engineering',
        labNotebookIntegration: 'labkey',
      });
      assert.strictEqual(p.projectName, 'Custom Project');
      assert.strictEqual(p.researchField, 'protein_engineering');
      assert.strictEqual(p.labNotebookIntegration, 'labkey');
    });

    it('should create output directory', () => {
      const testDir = path.join(tempDir, 'output-test');
      const p = new BiotechExperimentPlanner({ outputDir: testDir });
      assert(fs.existsSync(testDir));
    });
  });

  describe('Hypothesis Generation', () => {
    it('should generate primary hypothesis from research question', async () => {
      const hypotheses = await planner.generateHypotheses({
        researchQuestion: 'Does compound X inhibit protein Y?',
        maxHypotheses: 1,
      });

      assert.strictEqual(hypotheses.length, 1);
      assert.strictEqual(hypotheses[0].id, 'H1');
      assert.strictEqual(hypotheses[0].type, 'primary');
      assert.ok(hypotheses[0].statement);
      assert.ok(hypotheses[0].rationale);
      assert(hypotheses[0].confidence >= 0.8);
    });

    it('should generate multiple alternative hypotheses', async () => {
      const hypotheses = await planner.generateHypotheses({
        researchQuestion: 'What causes cell differentiation?',
        maxHypotheses: 4,
      });

      assert.strictEqual(hypotheses.length, 4);
      assert.strictEqual(hypotheses[0].type, 'primary');
      assert.strictEqual(hypotheses[1].type, 'alternative');
      assert.strictEqual(hypotheses[2].type, 'alternative');
    });

    it('should assess testability and falsifiability', async () => {
      const hypotheses = await planner.generateHypotheses({
        researchQuestion: 'Does kinase X regulate pathway Y?',
      });

      const h = hypotheses[0];
      assert.ok(h.testability);
      assert(h.testability.score >= 0.7);
      assert.ok(h.testability.measurableVariables);
      assert.ok(h.falsifiability);
      assert(h.falsifiability.score >= 0.7);
    });

    it('should emit hypotheses-generated event', async () => {
      let eventFired = false;
      planner.on('hypotheses-generated', (data) => {
        eventFired = true;
        assert(data.count > 0);
        assert(Array.isArray(data.hypotheses));
      });

      await planner.generateHypotheses({ researchQuestion: 'Test question?' });
      assert(eventFired);
    });
  });

  describe('Protocol Design', () => {
    it('should design basic protocol', async () => {
      const protocol = await planner.designProtocol({
        primaryOutcome: 'Protein expression level',
        experimentalDesign: 'RCT',
      });

      assert.ok(protocol.id.startsWith('PROTO_'));
      assert.strictEqual(protocol.experimentalDesign, 'RCT');
      assert.strictEqual(protocol.measurements.primary, 'Protein expression level');
      assert.ok(protocol.sampleSize);
      assert(protocol.sampleSize.total > 0);
    });

    it('should calculate sample size for protocol', async () => {
      const protocol = await planner.designProtocol({
        primaryOutcome: 'Biomarker level',
        experimentalDesign: 'two-sample-ttest',
        effectSize: 0.8,
        alpha: 0.05,
        power: 0.8,
      });

      assert.ok(protocol.sampleSize.perGroup > 0);
      assert.ok(protocol.sampleSize.total > 0);
      assert(protocol.sampleSize.total >= protocol.sampleSize.perGroup);
    });

    it('should suggest appropriate timepoints', async () => {
      const timepoints = [
        'dose-response',
        'time-course',
        'RCT',
        'factorial',
        'observational',
      ];

      for (const design of timepoints) {
        const protocol = await planner.designProtocol({
          primaryOutcome: 'Outcome',
          experimentalDesign: design,
        });

        assert.ok(protocol.measurements.timepoints);
        assert(Array.isArray(protocol.measurements.timepoints));
        assert(protocol.measurements.timepoints.length > 0);
      }
    });

    it('should include quality controls', async () => {
      const protocol = await planner.designProtocol({
        primaryOutcome: 'Cell viability',
        experimentalDesign: 'time-course',
      });

      assert.ok(protocol.quality);
      assert.ok(protocol.quality.blindingStatus);
      assert.ok(protocol.quality.controlGroups);
      assert.ok(protocol.quality.replicates > 0);
    });

    it('should emit protocol-designed event', (done) => {
      planner.on('protocol-designed', (data) => {
        assert(data.protocolId);
        assert(data.protocol);
        done();
      });

      planner.designProtocol({ primaryOutcome: 'Test outcome' });
    });
  });

  describe('Expected Outcomes', () => {
    it('should define outcomes with success criteria', async () => {
      const outcomes = await planner.defineExpectedOutcomes({
        protocolId: 'PROTO_test',
        primaryOutcome: 'Enzyme activity',
        secondaryOutcomes: ['Cell proliferation', 'Apoptosis rate'],
      });

      assert.ok(outcomes.id);
      assert.ok(outcomes.primary);
      assert.strictEqual(outcomes.secondary.length, 2);
      assert.ok(outcomes.successCriteria);
      assert(Array.isArray(outcomes.successCriteria));
    });

    it('should generate clinical significance assessment', async () => {
      const outcomes = await planner.defineExpectedOutcomes({
        protocolId: 'PROTO_test',
        primaryOutcome: 'Disease marker reduction',
      });

      assert.ok(outcomes.clinicalSignificance);
      assert.ok(outcomes.clinicalSignificance.minimumClinicallyImportantDifference);
    });

    it('should suggest failure criteria', async () => {
      const outcomes = await planner.defineExpectedOutcomes({
        protocolId: 'PROTO_test',
        primaryOutcome: 'Treatment efficacy',
      });

      assert.ok(outcomes.failureCriteria);
      assert(Array.isArray(outcomes.failureCriteria));
      assert(outcomes.failureCriteria.length > 0);
    });

    it('should emit outcomes-defined event', (done) => {
      planner.on('outcomes-defined', (data) => {
        assert(data.outcomeId);
        assert(data.outcomes);
        done();
      });

      planner.defineExpectedOutcomes({
        protocolId: 'PROTO_test',
        primaryOutcome: 'Test outcome',
      });
    });
  });

  describe('Power Analysis', () => {
    it('should calculate power for t-test', async () => {
      const analysis = await planner.calculatePowerAnalysis({
        experimentalDesign: 'two-sample-ttest',
        effectSize: 0.8,
        alpha: 0.05,
        power: 0.8,
      });

      assert.ok(analysis.results);
      assert(analysis.results.sampleSize.perGroup > 0);
      assert.strictEqual(analysis.results.statisticalPower, 0.8);
      assert.strictEqual(analysis.results.typeIError, 0.05);
    });

    it('should calculate power for ANOVA', async () => {
      const analysis = await planner.calculatePowerAnalysis({
        experimentalDesign: 'one-way-anova',
        effectSize: 0.5,
        alpha: 0.05,
        power: 0.9,
        groups: 3,
      });

      assert.ok(analysis.results);
      assert.strictEqual(analysis.results.sampleSize.groups, 3);
      assert(analysis.results.sampleSize.total > 0);
    });

    it('should account for repeated measures', async () => {
      const analysis = await planner.calculatePowerAnalysis({
        experimentalDesign: 'repeated-measures',
        effectSize: 0.6,
        alpha: 0.05,
        power: 0.8,
      });

      assert.ok(analysis.results);
      assert(analysis.results.sampleSize.perGroup > 0);
    });

    it('should generate power curves and assumptions', async () => {
      const analysis = await planner.calculatePowerAnalysis({
        experimentalDesign: 'two-sample-ttest',
      });

      assert.ok(analysis.visualization);
      assert.ok(analysis.assumptions);
      assert(Array.isArray(analysis.assumptions));
      assert(analysis.assumptions.length > 0);
    });

    it('should provide recommendations', async () => {
      const analysis = await planner.calculatePowerAnalysis({
        experimentalDesign: 'two-sample-ttest',
      });

      assert.ok(analysis.recommendations);
      assert(Array.isArray(analysis.recommendations));
      assert(analysis.recommendations.length > 0);
    });

    it('should emit power-analysis-complete event', (done) => {
      planner.on('power-analysis-complete', (data) => {
        assert(data.analysisId);
        assert(data.powerAnalysis);
        done();
      });

      planner.calculatePowerAnalysis({});
    });
  });

  describe('Lab Notebook Integration', () => {
    it('should export to file in JSON format', async () => {
      const exp = await planner.createExperiment({
        title: 'Test Experiment',
        hypothesis: 'H1',
        protocol: 'PROTO_test',
      });

      const proto = await planner.designProtocol({
        primaryOutcome: 'Test outcome',
      });

      const result = await planner.exportToLabNotebook({
        experimentId: exp.id,
        protocolId: proto.id,
        format: 'json',
        labNotebookService: 'none',
      });

      assert.strictEqual(result.status, 'success');
      assert.strictEqual(result.format, 'json');
      assert(fs.existsSync(result.filepath));

      const data = JSON.parse(fs.readFileSync(result.filepath, 'utf-8'));
      assert.ok(data.experiment);
      assert.ok(data.protocol);
    });

    it('should export to Markdown format', async () => {
      const exp = await planner.createExperiment({
        title: 'MD Export Test',
        hypothesis: 'H1',
        protocol: 'PROTO_test',
      });

      const proto = await planner.designProtocol({
        primaryOutcome: 'Cell viability',
      });

      const result = await planner.exportToLabNotebook({
        experimentId: exp.id,
        protocolId: proto.id,
        format: 'md',
        labNotebookService: 'none',
      });

      assert.strictEqual(result.format, 'md');
      const content = fs.readFileSync(result.filepath, 'utf-8');
      assert(content.includes('# Experiment Plan'));
      assert(content.includes('Cell viability'));
    });

    it('should export to HTML format', async () => {
      const exp = await planner.createExperiment({
        title: 'HTML Export Test',
        hypothesis: 'H1',
        protocol: 'PROTO_test',
      });

      const proto = await planner.designProtocol({
        primaryOutcome: 'Protein expression',
      });

      const result = await planner.exportToLabNotebook({
        experimentId: exp.id,
        protocolId: proto.id,
        format: 'html',
        labNotebookService: 'none',
      });

      assert.strictEqual(result.format, 'html');
      const content = fs.readFileSync(result.filepath, 'utf-8');
      assert(content.includes('<!DOCTYPE html>'));
      assert(content.includes('Protein expression'));
    });

    it('should prepare Benchling export payload', async () => {
      const plannerWithBenchlingKey = new BiotechExperimentPlanner({
        labNotebookIntegration: 'benchling',
        benchlingApiKey: 'test-key-123',
        quiet: true,
      });

      const exp = await plannerWithBenchlingKey.createExperiment({
        title: 'Benchling Test',
        hypothesis: 'H1',
        protocol: 'PROTO_test',
      });

      const proto = await plannerWithBenchlingKey.designProtocol({
        primaryOutcome: 'Biomarker level',
      });

      const result = await plannerWithBenchlingKey.exportToLabNotebook({
        experimentId: exp.id,
        protocolId: proto.id,
        labNotebookService: 'benchling',
      });

      assert.strictEqual(result.service, 'benchling');
      assert(result.message.includes('Benchling'));
    });

    it('should require Benchling API key for actual export', async () => {
      const plannerNoBenchlingKey = new BiotechExperimentPlanner({
        labNotebookIntegration: 'benchling',
        benchlingApiKey: null,
        quiet: true,
      });

      const exp = await plannerNoBenchlingKey.createExperiment({
        title: 'Test',
        hypothesis: 'H1',
        protocol: 'PROTO_test',
      });

      const proto = await plannerNoBenchlingKey.designProtocol({
        primaryOutcome: 'Outcome',
      });

      try {
        await plannerNoBenchlingKey.exportToLabNotebook({
          experimentId: exp.id,
          protocolId: proto.id,
          labNotebookService: 'benchling',
        });
        assert.fail('Should throw error without API key');
      } catch (err) {
        assert(err.message.includes('API key'));
      }
    });
  });

  describe('Experiment Management', () => {
    it('should create experiment', async () => {
      const exp = await planner.createExperiment({
        title: 'Drug Efficacy Study',
        hypothesis: 'H1',
        protocol: 'PROTO_001',
      });

      assert.ok(exp.id);
      assert.strictEqual(exp.title, 'Drug Efficacy Study');
      assert.strictEqual(exp.status, 'planning');
    });

    it('should get experiment summary', async () => {
      const exp = await planner.createExperiment({
        title: 'Gene Therapy Study',
        hypothesis: 'H2',
        protocol: 'PROTO_002',
      });

      const summary = planner.getExperimentSummary(exp.id);
      assert.strictEqual(summary.id, exp.id);
      assert.strictEqual(summary.title, 'Gene Therapy Study');
    });

    it('should list all experiments', async () => {
      await planner.createExperiment({
        title: 'Exp 1',
        hypothesis: 'H1',
        protocol: 'PROTO_001',
        status: 'planning',
      });

      await planner.createExperiment({
        title: 'Exp 2',
        hypothesis: 'H2',
        protocol: 'PROTO_002',
        status: 'in-progress',
      });

      const experiments = planner.listExperiments();
      assert(experiments.length >= 2);
    });

    it('should filter experiments by status', async () => {
      await planner.createExperiment({
        title: 'Draft Exp',
        hypothesis: 'H1',
        protocol: 'PROTO_001',
        status: 'planning',
      });

      const experiments = planner.listExperiments({ status: 'planning' });
      assert(experiments.every((e) => e.status === 'planning'));
    });

    it('should generate experiment report', async () => {
      const hypotheses = await planner.generateHypotheses({
        researchQuestion: 'Test?',
      });

      const protocol = await planner.designProtocol({
        primaryOutcome: 'Outcome',
      });

      const exp = await planner.createExperiment({
        title: 'Report Test',
        hypothesis: hypotheses[0].id,
        protocol: protocol.id,
      });

      const report = planner.generateReport(exp.id);
      assert.ok(report.title);
      assert.ok(report.experiment);
      assert.ok(report.protocol);
      assert.ok(report.generatedAt);
    });

    it('should emit experiment-created event', (done) => {
      planner.on('experiment-created', (data) => {
        assert(data.experimentId);
        assert(data.experiment);
        done();
      });

      planner.createExperiment({
        title: 'Event Test',
        hypothesis: 'H1',
        protocol: 'PROTO_001',
      });
    });
  });

  describe('Logging and Events', () => {
    it('should emit log events', (done) => {
      const testPlanner = new BiotechExperimentPlanner({ quiet: true });
      testPlanner.on('log', (data) => {
        assert.ok(data.message);
        assert.ok(data.level);
        assert.ok(data.timestamp);
        done();
      });

      testPlanner.log('Test message');
    });

    it('should emit error events', (done) => {
      const testPlanner = new BiotechExperimentPlanner({ quiet: true });
      testPlanner.on('error', (data) => {
        assert.ok(data.message);
        assert.ok(data.timestamp);
        done();
      });

      testPlanner.error('Test error');
    });
  });

  describe('Error Handling', () => {
    it('should validate hypothesis generation inputs', async () => {
      try {
        await planner.generateHypotheses({});
        assert.fail('Should throw error for missing researchQuestion');
      } catch (err) {
        assert(err.message.includes('researchQuestion'));
      }
    });

    it('should validate protocol design inputs', async () => {
      try {
        await planner.designProtocol({});
        assert.fail('Should throw error for missing primaryOutcome');
      } catch (err) {
        assert(err.message.includes('primaryOutcome'));
      }
    });

    it('should validate experiment creation inputs', async () => {
      try {
        await planner.createExperiment({ title: 'Test' });
        assert.fail('Should throw error for missing inputs');
      } catch (err) {
        assert(err.message.includes('required'));
      }
    });

    it('should handle missing experiments', () => {
      try {
        planner.getExperimentSummary('NON_EXISTENT_ID');
        assert.fail('Should throw error for non-existent experiment');
      } catch (err) {
        assert(err.message.includes('not found'));
      }
    });

    it('should handle missing protocols for export', async () => {
      const exp = await planner.createExperiment({
        title: 'Test',
        hypothesis: 'H1',
        protocol: 'PROTO_MISSING',
      });

      try {
        await planner.exportToLabNotebook({
          experimentId: exp.id,
          protocolId: 'PROTO_MISSING',
          labNotebookService: 'none',
        });
        assert.fail('Should throw error for missing protocol');
      } catch (err) {
        assert(err.message.includes('not found'));
      }
    });
  });

  describe('Integration Tests', () => {
    it('should complete full experiment workflow', async () => {
      // Generate hypotheses
      const hypotheses = await planner.generateHypotheses({
        researchQuestion: 'Does drug X improve patient outcomes?',
        maxHypotheses: 2,
      });

      assert.strictEqual(hypotheses.length, 2);

      // Design protocol
      const protocol = await planner.designProtocol({
        hypothesisId: hypotheses[0].id,
        primaryOutcome: 'Patient recovery rate',
        secondaryOutcomes: ['Side effects', 'Biomarker changes'],
        experimentalDesign: 'RCT',
      });

      assert.ok(protocol.id);

      // Define outcomes
      const outcomes = await planner.defineExpectedOutcomes({
        protocolId: protocol.id,
        primaryOutcome: 'Patient recovery rate',
        secondaryOutcomes: ['Side effects'],
      });

      assert.ok(outcomes.successCriteria);

      // Power analysis
      const powerAnalysis = await planner.calculatePowerAnalysis({
        experimentalDesign: 'two-sample-ttest',
        effectSize: 0.6,
        power: 0.9,
      });

      assert(powerAnalysis.results.sampleSize.total > 0);

      // Create experiment
      const experiment = await planner.createExperiment({
        title: 'Drug X Clinical Trial',
        hypothesis: hypotheses[0].id,
        protocol: protocol.id,
      });

      assert.ok(experiment.id);

      // Export
      const exportResult = await planner.exportToLabNotebook({
        experimentId: experiment.id,
        protocolId: protocol.id,
        format: 'json',
        labNotebookService: 'none',
      });

      assert.strictEqual(exportResult.status, 'success');
      assert(fs.existsSync(exportResult.filepath));
    });
  });
});
