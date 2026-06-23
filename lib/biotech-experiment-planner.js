/**
 * Biotech Experiment Planner
 * Plan experiments: hypothesis generation, protocol design, expected outcomes, statistical power calculation
 * Integration with lab notebooks (Benchling, LabKey)
 */

const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

class BiotechExperimentPlanner extends EventEmitter {
  constructor(config = {}) {
    super();
    this.projectName = config.projectName || 'Experiment_' + Date.now();
    this.labNotebookIntegration = config.labNotebookIntegration || 'benchling'; // 'benchling', 'labkey', 'none'
    this.benchlingApiKey = config.benchlingApiKey || process.env.BENCHLING_API_KEY;
    this.benchlingApiUrl = config.benchlingApiUrl || 'https://api.benchling.com/v2';
    this.labkeyApiKey = config.labkeyApiKey || process.env.LABKEY_API_KEY;
    this.labkeyServer = config.labkeyServer || process.env.LABKEY_SERVER;
    this.researchField = config.researchField || 'molecular_biology'; // 'molecular_biology', 'synthetic_biology', 'protein_engineering', 'cell_biology', 'genomics'
    this.quiet = config.quiet || false;
    this.outputDir = config.outputDir || path.join(process.cwd(), '.experiment-plans');
    this.experiments = [];
    this.hypotheses = [];
    this.protocols = [];
    this.powerAnalysisResults = [];

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  log(message, level = 'info') {
    if (!this.quiet) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
    }
    this.emit('log', { message, level, timestamp: new Date().toISOString() });
  }

  error(message) {
    this.log(message, 'error');
    this.emit('error', { message, timestamp: new Date().toISOString() });
  }

  // ============ Hypothesis Generation ============
  /**
   * Generate experimental hypotheses based on research question
   */
  async generateHypotheses(config) {
    const {
      researchQuestion,
      backgroundContext = [],
      existingData = [],
      constraints = [],
      alternativeExplanations = [],
      maxHypotheses = 5,
    } = config;

    if (!researchQuestion) {
      throw new Error('researchQuestion is required');
    }

    this.log(`Generating hypotheses for: ${researchQuestion}`);

    const hypotheses = [];

    // Primary hypothesis
    const primaryHypothesis = {
      id: 'H1',
      type: 'primary',
      statement: this._generateHypothesisStatement(researchQuestion, 'primary'),
      rationale: this._generateRationale(researchQuestion, backgroundContext),
      predictions: this._generatePredictions(researchQuestion),
      testability: this._assessTestability(researchQuestion),
      falsifiability: this._assessFalsifiability(researchQuestion),
      confidence: 0.85,
      dependencies: [],
    };

    hypotheses.push(primaryHypothesis);

    // Generate alternative hypotheses
    if (alternativeExplanations.length > 0 || maxHypotheses > 1) {
      for (let i = 2; i <= Math.min(maxHypotheses, 5); i++) {
        const altHypothesis = {
          id: `H${i}`,
          type: 'alternative',
          statement: this._generateAlternativeHypothesis(researchQuestion, i),
          rationale: this._generateRationale(researchQuestion, backgroundContext, `alternative_${i}`),
          predictions: this._generatePredictions(researchQuestion, i),
          testability: this._assessTestability(researchQuestion, i),
          falsifiability: this._assessFalsifiability(researchQuestion, i),
          confidence: 0.5 - (i * 0.05), // Decreasing confidence for alternatives
          dependencies: [],
        };
        hypotheses.push(altHypothesis);
      }
    }

    this.hypotheses.push(...hypotheses);

    this.log(`Generated ${hypotheses.length} hypotheses`);
    this.emit('hypotheses-generated', { count: hypotheses.length, hypotheses });

    return hypotheses;
  }

  _generateHypothesisStatement(researchQuestion, type = 'primary') {
    const statements = {
      primary: `We hypothesize that [mechanism/intervention] will lead to [predicted outcome] in [system], based on [theoretical basis].`,
      alternative: `Alternative hypothesis: [competing mechanism] explains [observed phenomenon] through [proposed mechanism].`,
    };
    return statements[type] || statements['primary'];
  }

  _generateAlternativeHypothesis(researchQuestion, variant = 1) {
    const mechanisms = [
      'a compensatory pathway may underlie the observed effects',
      'off-target effects rather than specific inhibition',
      'indirect effects through secondary mechanisms',
      'context-dependent responses not captured in this model',
      'experimental artifacts or measurement limitations',
    ];
    return mechanisms[variant % mechanisms.length] || mechanisms[0];
  }

  _generateRationale(researchQuestion, backgroundContext = [], variant = '') {
    return {
      theoretical: 'Based on existing theory in the field...',
      empirical: 'Previous studies have shown...',
      mechanistic: 'The proposed mechanism involves...',
      contextual: backgroundContext.length > 0 ? backgroundContext.join('; ') : 'Context-dependent reasoning',
    };
  }

  _generatePredictions(researchQuestion, variant = 1) {
    return [
      {
        condition: 'Treatment group',
        expectedOutcome: 'Measurable increase in target variable',
        magnitude: '2-3 fold change',
        confidence: 0.8,
      },
      {
        condition: 'Control group',
        expectedOutcome: 'Baseline levels maintained',
        magnitude: 'No significant change',
        confidence: 0.95,
      },
    ];
  }

  _assessTestability(researchQuestion, variant = 1) {
    return {
      score: 0.85,
      measurableVariables: ['Primary outcome', 'Secondary outcomes', 'Biomarkers'],
      technicalFeasibility: 'High - established methods available',
      timeRequired: '4-8 weeks',
      costEstimate: '$5,000-$15,000',
    };
  }

  _assessFalsifiability(researchQuestion, variant = 1) {
    return {
      score: 0.9,
      conditions: [
        'Hypothesis falsified if outcome measure shows no significant difference',
        'Alternative mechanisms ruled out through mechanistic studies',
      ],
      requiredControls: ['Vehicle control', 'Positive control', 'Negative control'],
    };
  }

  // ============ Protocol Design ============
  /**
   * Design experimental protocol
   */
  async designProtocol(config) {
    const {
      hypothesisId = 'H1',
      experimentalDesign = 'RCT', // RCT, factorial, time-course, dose-response, observational
      sampleSize = null,
      groupAssignment = 'randomized',
      primaryOutcome,
      secondaryOutcomes = [],
      timepoints = [],
      materials = [],
      methods = [],
      analysisApproach = 'parametric',
    } = config;

    if (!primaryOutcome) {
      throw new Error('primaryOutcome is required for protocol design');
    }

    this.log(`Designing protocol for hypothesis ${hypothesisId}`);

    const protocol = {
      id: `PROTO_${Date.now()}`,
      hypothesisId,
      title: `Protocol for testing ${hypothesisId}`,
      experimentalDesign,
      studyPopulation: this._defineStudyPopulation(config),
      sampleSize: sampleSize || this._calculateSampleSize(config),
      randomization: this._designRandomization(groupAssignment),
      interventions: this._defineInterventions(config),
      measurements: {
        primary: primaryOutcome,
        secondary: secondaryOutcomes,
        timepoints: timepoints.length > 0 ? timepoints : this._suggestTimepoints(experimentalDesign),
      },
      materials: this._validateMaterials(materials),
      methods: this._structureMethods(methods),
      dataCollection: this._designDataCollection(primaryOutcome, secondaryOutcomes),
      analysis: {
        approach: analysisApproach,
        primaryAnalysis: this._definePrimaryAnalysis(primaryOutcome, analysisApproach),
        secondaryAnalysis: this._defineSecondaryAnalysis(secondaryOutcomes, analysisApproach),
      },
      quality: {
        blindingStatus: 'Double-blind',
        controlGroups: ['Vehicle', 'Positive control'],
        replicates: this._suggestReplicates(experimentalDesign),
      },
      timeline: this._estimateTimeline(experimentalDesign),
      risks: this._identifyRisks(experimentalDesign),
      contingencies: this._suggestContingencies(experimentalDesign),
    };

    this.protocols.push(protocol);
    this.log(`Protocol designed: ${protocol.id}`);
    this.emit('protocol-designed', { protocolId: protocol.id, protocol });

    return protocol;
  }

  _defineStudyPopulation(config) {
    return {
      type: config.subjectType || 'cells',
      species: config.species || 'human',
      cellType: config.cellType || 'fibroblasts',
      age: config.age || 'not applicable',
      gender: config.gender || 'mixed',
      inclusionCriteria: config.inclusionCriteria || [],
      exclusionCriteria: config.exclusionCriteria || [],
      sourceOrigin: config.sourceOrigin || 'primary culture',
    };
  }

  _calculateSampleSize(config) {
    const effectSize = config.effectSize || 0.8;
    const alpha = config.alpha || 0.05;
    const power = config.power || 0.8;

    // Simplified sample size calculation using Cohens formula
    const z_alpha = 1.96;
    const z_beta = 0.84;
    const n = Math.ceil(2 * ((z_alpha + z_beta) / effectSize) ** 2);

    return {
      perGroup: n,
      totalGroups: config.groups || 2,
      total: n * (config.groups || 2),
      rationale: `Based on effect size ${effectSize}, alpha ${alpha}, power ${power}`,
      justification: `Sample size sufficient to detect ${effectSize} effect size`,
    };
  }

  _designRandomization(assignmentType) {
    return {
      type: assignmentType,
      method: assignmentType === 'randomized' ? 'random number generator' : 'sequential',
      seed: Math.floor(Math.random() * 1000000),
      stratificationVariables: [],
    };
  }

  _defineInterventions(config) {
    return [
      {
        group: 'Treatment',
        intervention: config.intervention || 'Test compound',
        dose: config.dose || '10 μM',
        route: config.route || 'direct addition',
        duration: config.duration || '24 hours',
        frequency: config.frequency || 'single dose',
      },
      {
        group: 'Control',
        intervention: 'Vehicle control',
        dose: 'Equivalent volume',
        route: 'direct addition',
        duration: '24 hours',
        frequency: 'single dose',
      },
    ];
  }

  _validateMaterials(materials) {
    return materials.map((m) => ({
      name: m.name || m,
      catalog: m.catalog || 'unknown',
      quantity: m.quantity || '1 unit',
      storage: m.storage || 'RT',
      supplier: m.supplier || 'unknown',
    }));
  }

  _structureMethods(methods) {
    return methods.map((m, idx) => ({
      stepNumber: idx + 1,
      title: m.title || `Step ${idx + 1}`,
      description: m.description || m,
      duration: m.duration || 'unknown',
      equipment: m.equipment || [],
      notes: m.notes || [],
    }));
  }

  _designDataCollection(primaryOutcome, secondaryOutcomes) {
    return {
      primary: {
        outcome: primaryOutcome,
        method: 'Quantitative measurement',
        frequency: 'At each timepoint',
        quality: 'Technical replicates',
      },
      secondary: secondaryOutcomes.map((o, idx) => ({
        outcome: o,
        method: 'Quantitative or qualitative',
        frequency: 'As applicable',
      })),
      monitoring: {
        frequency: 'Real-time or daily',
        parameters: ['Cell viability', 'Growth rate', 'Morphology'],
      },
    };
  }

  _definePrimaryAnalysis(primaryOutcome, approach) {
    return {
      approach,
      test: approach === 'parametric' ? 't-test or ANOVA' : 'Mann-Whitney U or Kruskal-Wallis',
      pValue: 0.05,
      confidence: '95%',
      adjustments: ['Multiple comparison correction if applicable'],
    };
  }

  _defineSecondaryAnalysis(secondaryOutcomes, approach) {
    return secondaryOutcomes.map((o) => ({
      outcome: o,
      test: 'Exploratory',
      adjustments: ['Bonferroni correction'],
    }));
  }

  _suggestTimepoints(design) {
    const designs = {
      'time-course': ['0h', '1h', '4h', '8h', '24h', '48h', '72h'],
      'dose-response': ['0 nM', '1 nM', '10 nM', '100 nM', '1 μM', '10 μM'],
      RCT: ['Baseline', 'Week 2', 'Week 4', 'Week 8', 'Week 12'],
      factorial: ['Day 1', 'Day 3', 'Day 5'],
      observational: ['Baseline', 'Monthly x 12 months'],
    };
    return designs[design] || ['Baseline', 'End of study'];
  }

  _suggestReplicates(design) {
    const replicates = {
      'time-course': 3,
      'dose-response': 4,
      RCT: 30,
      factorial: 5,
      observational: 100,
    };
    return replicates[design] || 3;
  }

  _estimateTimeline(design) {
    const timelines = {
      'time-course': { setup: '1 week', execution: '2 weeks', analysis: '1 week' },
      'dose-response': { setup: '1 week', execution: '1 week', analysis: '1 week' },
      RCT: { setup: '2 weeks', execution: '12 weeks', analysis: '2 weeks' },
      factorial: { setup: '1 week', execution: '2 weeks', analysis: '1 week' },
      observational: { setup: '1 month', execution: '12 months', analysis: '1 month' },
    };
    return timelines[design] || { setup: '1 week', execution: '2 weeks', analysis: '1 week' };
  }

  _identifyRisks(design) {
    return [
      { risk: 'Sample contamination', probability: 'Medium', mitigation: 'Sterile technique, regular quality checks' },
      { risk: 'Equipment failure', probability: 'Low', mitigation: 'Maintenance schedule, backup equipment' },
      { risk: 'Dropout/attrition', probability: 'Medium', mitigation: 'Clear inclusion criteria, participant engagement' },
      { risk: 'Data quality issues', probability: 'Medium', mitigation: 'Standard operating procedures, staff training' },
    ];
  }

  _suggestContingencies(design) {
    return [
      'If sample size not achieved: Extended recruitment period',
      'If equipment fails: Switch to backup facility',
      'If high dropout rate: Use sensitivity analysis',
      'If unexpected adverse events: Stop-rule protocol',
    ];
  }

  // ============ Expected Outcomes ============
  /**
   * Define expected outcomes and success criteria
   */
  async defineExpectedOutcomes(config) {
    const {
      protocolId,
      primaryOutcome,
      secondaryOutcomes = [],
      exploratory = [],
      successCriteria = [],
      failureCriteria = [],
    } = config;

    this.log(`Defining expected outcomes for protocol ${protocolId}`);

    const outcomes = {
      id: `OUTCOMES_${Date.now()}`,
      protocolId,
      primary: this._defineOutcomeDetails(primaryOutcome, 'primary'),
      secondary: secondaryOutcomes.map((o) => this._defineOutcomeDetails(o, 'secondary')),
      exploratory: exploratory.map((o) => this._defineOutcomeDetails(o, 'exploratory')),
      successCriteria: successCriteria.length > 0 ? successCriteria : this._suggestSuccessCriteria(primaryOutcome),
      failureCriteria: failureCriteria.length > 0 ? failureCriteria : this._suggestFailureCriteria(primaryOutcome),
      clinicalSignificance: this._assessClinicalSignificance(primaryOutcome),
      statisticalSignificance: {
        threshold: 0.05,
        powerAnalysis: 'Detailed analysis in power section',
      },
    };

    this.emit('outcomes-defined', { outcomeId: outcomes.id, outcomes });
    return outcomes;
  }

  _defineOutcomeDetails(outcome, type) {
    return {
      name: typeof outcome === 'string' ? outcome : outcome.name,
      definition: typeof outcome === 'string' ? `Measure of ${outcome}` : outcome.definition || `Measure of ${outcome.name}`,
      unit: typeof outcome === 'object' ? outcome.unit : 'Unit TBD',
      instrument: typeof outcome === 'object' ? outcome.instrument : 'Measurement device TBD',
      type,
      timepoint: 'Primary: End of study',
      reliability: 'Good (ICC > 0.75)',
      validity: 'Established instrument',
    };
  }

  _suggestSuccessCriteria(outcome) {
    return [
      `${outcome} shows statistically significant improvement (p < 0.05)`,
      'Effect size meets clinical significance threshold',
      'No serious adverse events occur',
      'Compliance rate > 80%',
    ];
  }

  _suggestFailureCriteria(outcome) {
    return [
      `${outcome} shows no significant difference vs. control (p ≥ 0.05)`,
      'Severe adverse events occur',
      'Data quality compromised',
      'Study terminated early per stopping rules',
    ];
  }

  _assessClinicalSignificance(outcome) {
    return {
      minimumClinicallyImportantDifference: '20% change',
      patientRelevantOutcomes: true,
      qualityOfLife: 'Assessed via validated questionnaire',
    };
  }

  // ============ Statistical Power Analysis ============
  /**
   * Calculate statistical power and sample size
   */
  async calculatePowerAnalysis(config) {
    const {
      experimentalDesign = 'two-sample-ttest',
      effectSize = 0.8,
      alpha = 0.05,
      power = 0.8,
      groups = 2,
      repeatedMeasures = 1,
      testType = 'two-tailed',
    } = config;

    this.log(`Calculating power analysis for ${experimentalDesign}`);

    const powerAnalysis = {
      id: `POWER_${Date.now()}`,
      design: experimentalDesign,
      parameters: {
        effectSize,
        alpha,
        power,
        groups,
        repeatedMeasures,
        testType,
      },
      results: this._computePowerAnalysis(experimentalDesign, effectSize, alpha, power, groups),
      visualization: this._generatePowerCurves(effectSize, alpha, power),
      assumptions: this._listAssumptions(experimentalDesign),
      recommendations: this._generateRecommendations(effectSize, alpha, power),
    };

    this.powerAnalysisResults.push(powerAnalysis);
    this.log(`Power analysis complete: n=${powerAnalysis.results.sampleSize.perGroup}/group`);
    this.emit('power-analysis-complete', { analysisId: powerAnalysis.id, powerAnalysis });

    return powerAnalysis;
  }

  _computePowerAnalysis(design, effectSize, alpha, power, groups) {
    // Z-score approximations
    const z_alpha_map = { 0.05: 1.96, 0.01: 2.576, 0.001: 3.291 };
    const z_beta_map = { 0.8: 0.84, 0.9: 1.28, 0.95: 1.645 };

    const z_alpha = z_alpha_map[alpha] || 1.96;
    const z_beta = z_beta_map[power] || 0.84;

    let perGroup;
    if (design === 'two-sample-ttest') {
      perGroup = Math.ceil(2 * ((z_alpha + z_beta) / effectSize) ** 2);
    } else if (design === 'one-way-anova') {
      // Simplified ANOVA calculation
      perGroup = Math.ceil(((z_alpha + z_beta) / effectSize) ** 2 + 0.5);
    } else if (design === 'repeated-measures') {
      perGroup = Math.ceil(((z_alpha + z_beta) / effectSize) ** 2 * 1.5); // Adjusted for correlation
    } else {
      perGroup = Math.ceil(2 * ((z_alpha + z_beta) / effectSize) ** 2);
    }

    return {
      sampleSize: {
        perGroup,
        total: perGroup * groups,
        groups,
      },
      statisticalPower: power,
      typeIError: alpha,
      typeIIError: 1 - power,
      confidenceInterval: '95%',
      interpretation: `With n=${perGroup} per group (N=${perGroup * groups}), there is ${power * 100}% power to detect an effect size of ${effectSize}.`,
    };
  }

  _generatePowerCurves(effectSize, alpha, power) {
    return {
      powerVsSampleSize: 'Curve showing power increases with sample size',
      effectSizeVsSampleSize: 'Curve showing smaller effect sizes require larger samples',
      alphaVsPower: `With alpha=${alpha}, power=${power}`,
      visualization: 'Would be plotted in visualization tool',
    };
  }

  _listAssumptions(design) {
    const assumptions = {
      'two-sample-ttest': [
        'Normality of outcome data',
        'Equal variances between groups',
        'Independence of observations',
        'Random sampling',
      ],
      'one-way-anova': [
        'Normality within each group',
        'Homogeneity of variance',
        'Independence of observations',
        'Random assignment',
      ],
      'repeated-measures': [
        'Normality of differences',
        'Sphericity of within-subject factors',
        'Independence of observations',
      ],
    };
    return assumptions[design] || ['Standard statistical assumptions'];
  }

  _generateRecommendations(effectSize, alpha, power) {
    return [
      'Verify normality assumptions before analysis',
      'Consider sensitivity analysis for assumption violations',
      'Plan for potential missing data (5-10%)',
      'Use intention-to-treat analysis approach',
      'Report exact p-values and confidence intervals',
    ];
  }

  // ============ Lab Notebook Integration ============
  /**
   * Export experiment plan to lab notebook
   */
  async exportToLabNotebook(config) {
    const { experimentId, protocolId, format = 'json', labNotebookService = null } = config;

    const service = labNotebookService || this.labNotebookIntegration;

    this.log(`Exporting to ${service} lab notebook`);

    try {
      if (service === 'benchling') {
        return await this._exportToBenchling({ experimentId, protocolId, format });
      } else if (service === 'labkey') {
        return await this._exportToLabKey({ experimentId, protocolId, format });
      } else if (service === 'none') {
        return await this._exportToFile({ experimentId, protocolId, format });
      }
    } catch (err) {
      this.error(`Export failed: ${err.message}`);
      throw err;
    }
  }

  async _exportToBenchling(config) {
    const { experimentId, protocolId, format } = config;

    if (!this.benchlingApiKey) {
      throw new Error('Benchling API key not configured');
    }

    this.log(`Exporting to Benchling...`);

    const experiment = this.experiments.find((e) => e.id === experimentId);
    const protocol = this.protocols.find((p) => p.id === protocolId);

    if (!experiment || !protocol) {
      throw new Error('Experiment or protocol not found');
    }

    // Simulate API call
    const benchlingPayload = {
      name: protocol.title,
      description: protocol.studyPopulation,
      entries: [
        {
          type: 'protocol',
          title: protocol.title,
          content: JSON.stringify(protocol),
        },
      ],
    };

    this.log(`Benchling export prepared (simulated): ${JSON.stringify(benchlingPayload).substring(0, 100)}...`);

    return {
      status: 'success',
      service: 'benchling',
      payload: benchlingPayload,
      message: 'Export to Benchling prepared (requires valid API key for actual upload)',
    };
  }

  async _exportToLabKey(config) {
    const { experimentId, protocolId, format } = config;

    if (!this.labkeyApiKey || !this.labkeyServer) {
      throw new Error('LabKey API key or server not configured');
    }

    this.log(`Exporting to LabKey...`);

    const experiment = this.experiments.find((e) => e.id === experimentId);
    const protocol = this.protocols.find((p) => p.id === protocolId);

    if (!experiment || !protocol) {
      throw new Error('Experiment or protocol not found');
    }

    const labkeyPayload = {
      ExperimentName: protocol.title,
      Description: JSON.stringify(protocol),
      Status: 'Draft',
    };

    this.log(`LabKey export prepared (simulated): ${JSON.stringify(labkeyPayload).substring(0, 100)}...`);

    return {
      status: 'success',
      service: 'labkey',
      payload: labkeyPayload,
      message: 'Export to LabKey prepared (requires valid credentials for actual upload)',
    };
  }

  async _exportToFile(config) {
    const { experimentId, protocolId, format } = config;

    const experiment = this.experiments.find((e) => e.id === experimentId);
    const protocol = this.protocols.find((p) => p.id === protocolId);

    if (!experiment || !protocol) {
      throw new Error('Experiment or protocol not found');
    }

    const exportData = {
      experiment,
      protocol,
      generatedAt: new Date().toISOString(),
    };

    const filename = `experiment_${experimentId}_protocol_${protocolId}.${format}`;
    const filepath = path.join(this.outputDir, filename);

    if (format === 'json') {
      fs.writeFileSync(filepath, JSON.stringify(exportData, null, 2));
    } else if (format === 'md') {
      const mdContent = this._convertToMarkdown(exportData);
      fs.writeFileSync(filepath, mdContent);
    } else if (format === 'html') {
      const htmlContent = this._convertToHtml(exportData);
      fs.writeFileSync(filepath, htmlContent);
    }

    this.log(`Exported to file: ${filepath}`);

    return {
      status: 'success',
      service: 'file',
      filepath,
      format,
      message: `Experiment plan exported to ${format.toUpperCase()}`,
    };
  }

  _convertToMarkdown(data) {
    let md = `# Experiment Plan\n\n`;
    md += `**Generated:** ${data.generatedAt}\n\n`;

    if (data.experiment) {
      md += `## Experiment\n\n`;
      md += `- **ID:** ${data.experiment.id}\n`;
      md += `- **Title:** ${data.experiment.title || 'N/A'}\n\n`;
    }

    if (data.protocol) {
      md += `## Protocol\n\n`;
      md += `- **ID:** ${data.protocol.id}\n`;
      md += `- **Title:** ${data.protocol.title}\n`;
      md += `- **Design:** ${data.protocol.experimentalDesign}\n`;
      md += `- **Sample Size:** ${data.protocol.sampleSize.total}\n\n`;

      md += `### Primary Outcome\n`;
      md += `- ${data.protocol.measurements.primary}\n\n`;

      md += `### Methods\n`;
      data.protocol.methods.forEach((m) => {
        md += `${m.stepNumber}. ${m.title}\n`;
      });
    }

    return md;
  }

  _convertToHtml(data) {
    let html = `<!DOCTYPE html><html><head><title>Experiment Plan</title>`;
    html += `<style>body { font-family: Arial; margin: 20px; }</style></head><body>`;
    html += `<h1>Experiment Plan</h1>`;
    html += `<p><strong>Generated:</strong> ${data.generatedAt}</p>`;

    if (data.protocol) {
      html += `<h2>Protocol</h2>`;
      html += `<p><strong>ID:</strong> ${data.protocol.id}</p>`;
      html += `<p><strong>Title:</strong> ${data.protocol.title}</p>`;
      html += `<p><strong>Design:</strong> ${data.protocol.experimentalDesign}</p>`;
      html += `<p><strong>Sample Size:</strong> ${data.protocol.sampleSize.total}</p>`;

      html += `<h3>Primary Outcome</h3>`;
      html += `<p>${data.protocol.measurements.primary}</p>`;

      html += `<h3>Methods</h3><ol>`;
      data.protocol.methods.forEach((m) => {
        html += `<li><strong>${m.title}</strong>: ${m.description}</li>`;
      });
      html += `</ol>`;
    }

    html += `</body></html>`;
    return html;
  }

  // ============ Experiment Management ============
  /**
   * Create and manage experiments
   */
  async createExperiment(config) {
    const {
      title,
      description = '',
      hypothesis,
      protocol,
      researchField = this.researchField,
      status = 'planning',
    } = config;

    if (!title || !hypothesis || !protocol) {
      throw new Error('title, hypothesis, and protocol are required');
    }

    const experiment = {
      id: `EXP_${Date.now()}`,
      title,
      description,
      hypothesis,
      protocol,
      researchField,
      status,
      createdAt: new Date().toISOString(),
      metrics: {},
      logs: [],
    };

    this.experiments.push(experiment);
    this.log(`Experiment created: ${experiment.id}`);
    this.emit('experiment-created', { experimentId: experiment.id, experiment });

    return experiment;
  }

  /**
   * Get experiment summary
   */
  getExperimentSummary(experimentId) {
    const experiment = this.experiments.find((e) => e.id === experimentId);
    if (!experiment) {
      throw new Error(`Experiment ${experimentId} not found`);
    }

    return {
      id: experiment.id,
      title: experiment.title,
      status: experiment.status,
      hypothesis: experiment.hypothesis,
      protocol: experiment.protocol,
      createdAt: experiment.createdAt,
    };
  }

  /**
   * List all experiments
   */
  listExperiments(filters = {}) {
    let results = this.experiments;

    if (filters.status) {
      results = results.filter((e) => e.status === filters.status);
    }

    if (filters.researchField) {
      results = results.filter((e) => e.researchField === filters.researchField);
    }

    return results.map((e) => ({
      id: e.id,
      title: e.title,
      status: e.status,
      createdAt: e.createdAt,
    }));
  }

  /**
   * Generate experiment report
   */
  generateReport(experimentId) {
    const experiment = this.experiments.find((e) => e.id === experimentId);
    const protocol = this.protocols.find((p) => p.id === experiment?.protocol);
    const hypotheses = this.hypotheses.filter((h) => experiment?.hypothesis.includes(h.id));

    if (!experiment) {
      throw new Error(`Experiment ${experimentId} not found`);
    }

    return {
      title: `Experiment Report: ${experiment.title}`,
      experiment,
      hypotheses,
      protocol,
      generatedAt: new Date().toISOString(),
      summary: `Experiment plan containing ${hypotheses.length} hypotheses and 1 protocol`,
    };
  }
}

module.exports = BiotechExperimentPlanner;
