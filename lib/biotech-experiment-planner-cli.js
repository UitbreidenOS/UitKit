#!/usr/bin/env node

/**
 * Biotech Experiment Planner CLI
 * Command-line interface for biotech experiment planning
 */

const BiotechExperimentPlanner = require('./biotech-experiment-planner');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

class BiotechPlannerCLI {
  constructor() {
    this.planner = new BiotechExperimentPlanner({
      labNotebookIntegration: process.env.LAB_NOTEBOOK_SERVICE || 'none',
      benchlingApiKey: process.env.BENCHLING_API_KEY,
      labkeyServer: process.env.LABKEY_SERVER,
      labkeyApiKey: process.env.LABKEY_API_KEY,
    });

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.planner.on('log', (data) => {
      console.log(`[${data.level.toUpperCase()}] ${data.message}`);
    });

    this.planner.on('error', (data) => {
      console.error(`[ERROR] ${data.message}`);
    });
  }

  prompt(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  async promptMultiline(question) {
    console.log(question);
    const lines = [];
    console.log('(Enter each item on a new line, empty line to finish)');

    while (true) {
      const line = await this.prompt('> ');
      if (!line) break;
      lines.push(line);
    }

    return lines;
  }

  async interactiveHypothesisGeneration() {
    console.log('\n=== Hypothesis Generation ===\n');

    const researchQuestion = await this.prompt('Enter your research question: ');
    const backgroundContext = await this.promptMultiline(
      'Enter background context (optional):'
    );
    const maxHypotheses = parseInt(
      await this.prompt('How many hypotheses to generate? (1-5) [2]: ')
    ) || 2;

    try {
      const hypotheses = await this.planner.generateHypotheses({
        researchQuestion,
        backgroundContext,
        maxHypotheses: Math.min(Math.max(maxHypotheses, 1), 5),
      });

      console.log('\nGenerated Hypotheses:');
      hypotheses.forEach((h, idx) => {
        console.log(`\n${idx + 1}. ${h.id} (${h.type})`);
        console.log(`   Statement: ${h.statement}`);
        console.log(`   Testability: ${h.testability.score * 100}%`);
        console.log(`   Falsifiability: ${h.falsifiability.score * 100}%`);
        console.log(`   Confidence: ${h.confidence * 100}%`);
      });

      return hypotheses;
    } catch (error) {
      console.error('Error generating hypotheses:', error.message);
      return [];
    }
  }

  async interactiveProtocolDesign() {
    console.log('\n=== Protocol Design ===\n');

    const hypothesisId = await this.prompt('Enter hypothesis ID (e.g., H1): ');
    const primaryOutcome = await this.prompt('Enter primary outcome measure: ');
    const secondaryOutcomes = await this.promptMultiline(
      'Enter secondary outcomes (optional):'
    );

    console.log('\nExperimental Designs:');
    console.log('  1. RCT (Randomized Controlled Trial)');
    console.log('  2. factorial');
    console.log('  3. time-course');
    console.log('  4. dose-response');
    console.log('  5. observational');

    const designChoice = await this.prompt('Choose design (1-5) [4]: ');
    const designs = ['RCT', 'factorial', 'time-course', 'dose-response', 'observational'];
    const selectedDesign = designs[Math.max(0, (parseInt(designChoice) || 4) - 1)];

    try {
      const protocol = await this.planner.designProtocol({
        hypothesisId,
        primaryOutcome,
        secondaryOutcomes,
        experimentalDesign: selectedDesign,
      });

      console.log('\nProtocol Designed Successfully!');
      console.log(`  ID: ${protocol.id}`);
      console.log(`  Design: ${protocol.experimentalDesign}`);
      console.log(`  Sample Size: ${protocol.sampleSize.total} (${protocol.sampleSize.perGroup}/group)`);
      console.log(`  Timepoints: ${protocol.measurements.timepoints.join(', ')}`);
      console.log(`  Replicates: ${protocol.quality.replicates}`);

      return protocol;
    } catch (error) {
      console.error('Error designing protocol:', error.message);
      return null;
    }
  }

  async interactivePowerAnalysis() {
    console.log('\n=== Statistical Power Analysis ===\n');

    const effectSize = parseFloat(
      await this.prompt('Enter effect size (0.2=small, 0.5=medium, 0.8=large) [0.8]: ')
    ) || 0.8;

    const alpha = parseFloat(
      await this.prompt('Enter alpha level (0.05, 0.01, 0.001) [0.05]: ')
    ) || 0.05;

    const power = parseFloat(
      await this.prompt('Enter desired power (0.8=80%, 0.9=90%, 0.95=95%) [0.8]: ')
    ) || 0.8;

    const groups = parseInt(await this.prompt('Number of groups [2]: ')) || 2;

    try {
      const analysis = await this.planner.calculatePowerAnalysis({
        experimentalDesign: groups > 2 ? 'one-way-anova' : 'two-sample-ttest',
        effectSize,
        alpha,
        power,
        groups,
      });

      console.log('\nPower Analysis Results:');
      console.log(`  Sample size per group: ${analysis.results.sampleSize.perGroup}`);
      console.log(`  Total sample size: ${analysis.results.sampleSize.total}`);
      console.log(`  Power: ${analysis.results.statisticalPower * 100}%`);
      console.log(`  Type I error (α): ${analysis.results.typeIError}`);
      console.log(`  Type II error (β): ${analysis.results.typeIIError * 100}%`);
      console.log(`\n  ${analysis.results.interpretation}`);

      return analysis;
    } catch (error) {
      console.error('Error calculating power:', error.message);
      return null;
    }
  }

  async interactiveExperimentCreation() {
    console.log('\n=== Create Experiment Record ===\n');

    const title = await this.prompt('Experiment title: ');
    const hypothesis = await this.prompt('Associated hypothesis ID: ');
    const protocol = await this.prompt('Associated protocol ID: ');
    const description = await this.prompt('Brief description (optional): ');

    try {
      const experiment = await this.planner.createExperiment({
        title,
        hypothesis,
        protocol,
        description,
      });

      console.log(`\nExperiment created: ${experiment.id}`);
      console.log(`  Title: ${experiment.title}`);
      console.log(`  Status: ${experiment.status}`);
      console.log(`  Created: ${experiment.createdAt}`);

      return experiment;
    } catch (error) {
      console.error('Error creating experiment:', error.message);
      return null;
    }
  }

  async interactiveExport() {
    console.log('\n=== Export Experiment ===\n');

    const experimentId = await this.prompt('Enter experiment ID: ');
    const protocolId = await this.prompt('Enter protocol ID: ');

    console.log('\nExport Formats:');
    console.log('  1. JSON');
    console.log('  2. Markdown (MD)');
    console.log('  3. HTML');

    const formatChoice = parseInt(await this.prompt('Choose format (1-3) [1]: ')) || 1;
    const formats = ['json', 'md', 'html'];
    const selectedFormat = formats[Math.min(Math.max(formatChoice - 1, 0), 2)];

    try {
      const result = await this.planner.exportToLabNotebook({
        experimentId,
        protocolId,
        format: selectedFormat,
        labNotebookService: 'none',
      });

      console.log(`\n✓ Export successful!`);
      console.log(`  Format: ${result.format.toUpperCase()}`);
      console.log(`  File: ${result.filepath}`);

      return result;
    } catch (error) {
      console.error('Error exporting:', error.message);
      return null;
    }
  }

  async mainMenu() {
    while (true) {
      console.log('\n=== Biotech Experiment Planner ===\n');
      console.log('1. Generate Hypotheses');
      console.log('2. Design Protocol');
      console.log('3. Power Analysis');
      console.log('4. Create Experiment');
      console.log('5. Export Experiment');
      console.log('6. List Experiments');
      console.log('7. View Experiment Report');
      console.log('8. Exit');

      const choice = await this.prompt('\nSelect option (1-8): ');

      try {
        switch (choice) {
          case '1':
            await this.interactiveHypothesisGeneration();
            break;
          case '2':
            await this.interactiveProtocolDesign();
            break;
          case '3':
            await this.interactivePowerAnalysis();
            break;
          case '4':
            await this.interactiveExperimentCreation();
            break;
          case '5':
            await this.interactiveExport();
            break;
          case '6':
            this.listExperiments();
            break;
          case '7':
            await this.viewExperimentReport();
            break;
          case '8':
            console.log('Goodbye!');
            this.rl.close();
            return;
          default:
            console.log('Invalid option. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
  }

  listExperiments() {
    const experiments = this.planner.listExperiments();
    if (experiments.length === 0) {
      console.log('\nNo experiments found.');
      return;
    }

    console.log('\nExperiments:');
    experiments.forEach((e) => {
      console.log(`  ${e.id}: ${e.title} [${e.status}]`);
    });
  }

  async viewExperimentReport() {
    const experimentId = await this.prompt('Enter experiment ID: ');

    try {
      const report = this.planner.generateReport(experimentId);
      console.log(`\n${report.title}`);
      console.log(`Generated: ${report.generatedAt}`);
      console.log(report.summary);
    } catch (error) {
      console.error('Error generating report:', error.message);
    }
  }

  async run() {
    console.log('Starting Biotech Experiment Planner CLI...');
    await this.mainMenu();
  }
}

// Quick command-line usage
function printUsage() {
  console.log(`
Biotech Experiment Planner CLI

Usage:
  npx biotech-experiment-planner-cli                # Interactive mode
  npx biotech-experiment-planner-cli hypotheses     # Quick hypothesis generation
  npx biotech-experiment-planner-cli protocol       # Quick protocol design
  npx biotech-experiment-planner-cli power          # Quick power analysis
  npx biotech-experiment-planner-cli help           # Show this help

Environment Variables:
  BENCHLING_API_KEY     - Benchling API key (optional)
  LABKEY_SERVER         - LabKey server URL (optional)
  LABKEY_API_KEY        - LabKey API key (optional)
  LAB_NOTEBOOK_SERVICE  - Default: 'none' ('benchling', 'labkey', 'none')

Examples:
  $ npx biotech-experiment-planner-cli
  $ BENCHLING_API_KEY=xxx npx biotech-experiment-planner-cli
  `);
}

// Handle command-line arguments
const args = process.argv.slice(2);

if (args.includes('help') || args.includes('-h') || args.includes('--help')) {
  printUsage();
  process.exit(0);
}

const cli = new BiotechPlannerCLI();
cli.run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

module.exports = BiotechPlannerCLI;
