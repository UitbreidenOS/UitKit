/**
 * Biotech Experiment Planner Integration Example
 * Demonstrates complete biotech experiment planning workflow
 */

const BiotechExperimentPlanner = require('./biotech-experiment-planner');
const path = require('path');

async function planBiotechExperiment() {
  const planner = new BiotechExperimentPlanner({
    projectName: 'Cancer Drug Efficacy Study',
    researchField: 'synthetic_biology',
    labNotebookIntegration: 'benchling', // or 'labkey' or 'none'
    benchlingApiKey: process.env.BENCHLING_API_KEY,
    labkeyServer: process.env.LABKEY_SERVER,
    labkeyApiKey: process.env.LABKEY_API_KEY,
  });

  // Event listeners
  planner.on('log', (data) => console.log(`[${data.level}] ${data.message}`));
  planner.on('error', (data) => console.error(`ERROR: ${data.message}`));
  planner.on('hypotheses-generated', (data) =>
    console.log(`Generated ${data.count} hypotheses`)
  );
  planner.on('protocol-designed', (data) =>
    console.log(`Protocol designed: ${data.protocolId}`)
  );
  planner.on('power-analysis-complete', (data) =>
    console.log(`Power analysis complete: ${data.analysisId}`)
  );
  planner.on('experiment-created', (data) =>
    console.log(`Experiment created: ${data.experimentId}`)
  );

  try {
    console.log('\n=== Biotech Experiment Planning Workflow ===\n');

    // STEP 1: Generate Hypotheses
    console.log('Step 1: Generating research hypotheses...');
    const hypotheses = await planner.generateHypotheses({
      researchQuestion:
        'Does compound XY-451 inhibit BRAF V600E mutation signaling and induce apoptosis in melanoma cells?',
      backgroundContext: [
        'Previous literature shows BRAF mutations drive 40-60% of melanomas',
        'Vemurafenib is approved but has resistance mechanisms',
        'XY-451 shows novel binding mode to BRAF',
      ],
      alternativeExplanations: [
        'Non-specific toxicity rather than targeted inhibition',
        'Off-target effects on related kinases',
      ],
      maxHypotheses: 3,
    });

    console.log(`\nGenerated ${hypotheses.length} hypotheses:`);
    hypotheses.forEach((h) => {
      console.log(`  ${h.id}: ${h.statement}`);
      console.log(`    Testability: ${h.testability.score * 100}%`);
      console.log(`    Confidence: ${h.confidence * 100}%`);
    });

    // STEP 2: Design Experimental Protocol
    console.log('\nStep 2: Designing experimental protocol...');
    const protocol = await planner.designProtocol({
      hypothesisId: hypotheses[0].id,
      experimentalDesign: 'dose-response',
      primaryOutcome: 'Melanoma cell death via propidium iodide staining',
      secondaryOutcomes: [
        'BRAF phosphorylation levels (pMEK/pERK)',
        'Caspase-3 activation (apoptosis marker)',
        'Cell cycle arrest (flow cytometry)',
        'IC50 determination',
      ],
      timepoints: ['0h', '2h', '6h', '24h', '48h', '72h'],
      materials: [
        { name: 'XY-451 compound', catalog: 'SYN-451', quantity: '10 mg', supplier: 'SynthLab' },
        { name: 'A375 melanoma cells', catalog: 'ATCC CRL-1619', quantity: '2 vials' },
        { name: 'DMEM media', catalog: 'Gibco 11965', quantity: '500 mL' },
        { name: 'Propidium iodide', catalog: 'Sigma P4864', quantity: '1 mg' },
        { name: 'Antibody: pERK', catalog: 'CST 4370', quantity: '100 μL' },
      ],
      methods: [
        {
          title: 'Cell culture preparation',
          description: 'Culture A375 melanoma cells in DMEM + 10% FBS at 37°C, 5% CO2',
          duration: '48 hours',
          equipment: ['CO2 incubator', 'Biosafety cabinet'],
        },
        {
          title: 'Dose-response treatment',
          description: 'Treat cells with XY-451 at concentrations: 0, 0.1, 1, 10, 100 μM',
          duration: '72 hours',
          equipment: ['96-well plate reader'],
        },
        {
          title: 'Viability assay',
          description: 'Measure cell death using propidium iodide staining via flow cytometry',
          duration: '2 hours',
          equipment: ['Flow cytometer', 'Centrifuge'],
        },
        {
          title: 'Western blot analysis',
          description: 'Extract proteins and quantify phosphorylated BRAF pathway markers',
          duration: '6 hours',
          equipment: ['Protein extraction kit', 'Western blot apparatus'],
        },
      ],
      analysisApproach: 'parametric',
    });

    console.log(`\nProtocol designed: ${protocol.id}`);
    console.log(`  Design: ${protocol.experimentalDesign}`);
    console.log(`  Sample size: ${protocol.sampleSize.perGroup}/group`);
    console.log(`  Timepoints: ${protocol.measurements.timepoints.join(', ')}`);
    console.log(`  Primary outcome: ${protocol.measurements.primary}`);

    // STEP 3: Define Expected Outcomes
    console.log('\nStep 3: Defining expected outcomes and success criteria...');
    const outcomes = await planner.defineExpectedOutcomes({
      protocolId: protocol.id,
      primaryOutcome: 'Melanoma cell death via propidium iodide staining',
      secondaryOutcomes: [
        'BRAF phosphorylation levels',
        'Caspase-3 activation',
      ],
      exploratory: ['Cell cycle changes', 'Mitochondrial membrane potential'],
      successCriteria: [
        'IC50 < 10 μM (better than vemurafenib)',
        'Statistical significance p < 0.05 vs. vehicle',
        'Dose-dependent response curve',
        'Biomarker changes consistent with BRAF inhibition',
      ],
    });

    console.log(`\nSuccess criteria defined:`);
    outcomes.successCriteria.forEach((c) => console.log(`  ✓ ${c}`));

    // STEP 4: Power Analysis
    console.log('\nStep 4: Performing statistical power analysis...');
    const powerAnalysis = await planner.calculatePowerAnalysis({
      experimentalDesign: 'one-way-anova', // Multiple concentrations
      effectSize: 0.75,
      alpha: 0.05,
      power: 0.9, // Higher power for exploratory biotech research
      groups: 6, // Vehicle + 5 dose levels
      testType: 'two-tailed',
    });

    console.log(`\nPower Analysis Results:`);
    console.log(`  Sample size per group: ${powerAnalysis.results.sampleSize.perGroup}`);
    console.log(`  Total N: ${powerAnalysis.results.sampleSize.total}`);
    console.log(`  Statistical power: ${powerAnalysis.results.statisticalPower * 100}%`);
    console.log(`  Type I error (α): ${powerAnalysis.results.typeIError}`);
    console.log(`  Type II error (β): ${powerAnalysis.results.typeIIError}`);
    console.log(
      `\n  Interpretation: ${powerAnalysis.results.interpretation}`
    );

    // STEP 5: Create Experiment Record
    console.log('\nStep 5: Creating experiment record...');
    const experiment = await planner.createExperiment({
      title: 'BRAF Inhibitor XY-451 Dose-Response Study in Melanoma Cells',
      description: 'In vitro investigation of novel BRAF inhibitor compound XY-451 efficacy in A375 melanoma cells',
      hypothesis: hypotheses[0].id,
      protocol: protocol.id,
      researchField: 'molecular_biology',
      status: 'planning',
    });

    console.log(`\nExperiment created: ${experiment.id}`);
    console.log(`  Status: ${experiment.status}`);
    console.log(`  Created: ${experiment.createdAt}`);

    // STEP 6: Generate Report
    console.log('\nStep 6: Generating experiment report...');
    const report = planner.generateReport(experiment.id);

    console.log(`\nExperiment Report: ${report.title}`);
    console.log(`  Generated: ${report.generatedAt}`);
    console.log(`  Summary: ${report.summary}`);

    // STEP 7: Export to Lab Notebook
    console.log('\nStep 7: Exporting to lab notebook systems...');

    // Export to JSON
    const jsonExport = await planner.exportToLabNotebook({
      experimentId: experiment.id,
      protocolId: protocol.id,
      format: 'json',
      labNotebookService: 'none',
    });

    console.log(`\nJSON Export: ${jsonExport.filepath}`);

    // Export to Markdown
    const mdExport = await planner.exportToLabNotebook({
      experimentId: experiment.id,
      protocolId: protocol.id,
      format: 'md',
      labNotebookService: 'none',
    });

    console.log(`Markdown Export: ${mdExport.filepath}`);

    // Export to HTML
    const htmlExport = await planner.exportToLabNotebook({
      experimentId: experiment.id,
      protocolId: protocol.id,
      format: 'html',
      labNotebookService: 'none',
    });

    console.log(`HTML Export: ${htmlExport.filepath}`);

    // Note: These would require valid API credentials
    if (process.env.BENCHLING_API_KEY) {
      const benchlingExport = await planner.exportToLabNotebook({
        experimentId: experiment.id,
        protocolId: protocol.id,
        format: 'json',
        labNotebookService: 'benchling',
      });
      console.log(`Benchling: ${benchlingExport.message}`);
    }

    if (process.env.LABKEY_SERVER) {
      const labkeyExport = await planner.exportToLabNotebook({
        experimentId: experiment.id,
        protocolId: protocol.id,
        format: 'json',
        labNotebookService: 'labkey',
      });
      console.log(`LabKey: ${labkeyExport.message}`);
    }

    // STEP 8: Experiment Management
    console.log('\nStep 8: Managing experiment collection...');
    const allExperiments = planner.listExperiments();
    console.log(`\nTotal experiments in project: ${allExperiments.length}`);

    allExperiments.forEach((e) => {
      console.log(`  - ${e.title} [${e.status}]`);
    });

    console.log('\n=== Experiment Planning Complete ===\n');

    // Summary
    console.log('Summary:');
    console.log(`  ✓ Hypotheses generated: ${hypotheses.length}`);
    console.log(`  ✓ Protocol designed with n=${protocol.sampleSize.total}`);
    console.log(`  ✓ Success criteria: ${outcomes.successCriteria.length}`);
    console.log(`  ✓ Power analysis: 90% power to detect ${powerAnalysis.parameters.effectSize}`);
    console.log(`  ✓ Experiment record created`);
    console.log(`  ✓ Multiple formats exported (JSON, MD, HTML)`);
    console.log(`  ✓ Ready for lab notebook integration`);

    return {
      hypotheses,
      protocol,
      outcomes,
      powerAnalysis,
      experiment,
      report,
    };
  } catch (error) {
    console.error('Error in biotech experiment planning:', error.message);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  planBiotechExperiment().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

module.exports = planBiotechExperiment;
