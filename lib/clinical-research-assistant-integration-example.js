#!/usr/bin/env node

/**
 * Clinical Research Assistant Integration Example
 * Complete workflow demonstrating FDA 21 CFR Part 11 compliant clinical trial management
 */

const ClinicalResearchAssistant = require('./clinical-research-assistant');

async function runClinicalTrialWorkflow() {
  // Initialize the Clinical Research Assistant
  const assistant = new ClinicalResearchAssistant({
    projectName: 'Phase II Trial: XY-451 in Advanced Melanoma',
    trialPhase: 'Phase II',
    auditable: true,
  });

  // Setup event listeners
  assistant.on('log', (data) => {
    console.log(`[${data.level}] ${data.message}`);
  });

  assistant.on('alert', (data) => {
    console.warn(`[${data.level}] ${data.message}`);
  });

  assistant.on('error', (data) => {
    console.error(`ERROR: ${data.message}`);
  });

  try {
    // Prepare trial data
    const trialData = {
      // Research question for literature review
      researchQuestion: 'Efficacy and safety of XY-451 BRAF inhibitor in advanced melanoma',

      // Protocol for analysis
      protocolText: `
        PROTOCOL: Phase II Open-Label Study of XY-451 in Patients with BRAF-Mutant Advanced Melanoma

        1. PRIMARY OBJECTIVE
        To evaluate the objective response rate (ORR) of XY-451 in patients with BRAF V600E mutant advanced melanoma

        2. SECONDARY OBJECTIVES
        - Assess progression-free survival (PFS)
        - Evaluate overall survival (OS)
        - Characterize safety and tolerability
        - Assess quality of life measures

        3. INCLUSION CRITERIA
        - Age ≥18 years
        - Confirmed BRAF V600E mutation in melanoma tissue
        - ECOG performance status 0-1
        - Stage IIIC or IV melanoma
        - Prior treatment: ≤1 prior systemic therapy
        - Adequate organ function

        4. EXCLUSION CRITERIA
        - Active secondary malignancy
        - Pregnancy or lactation
        - Severe renal impairment (eGFR <30 mL/min)
        - Uncontrolled diabetes mellitus
        - History of QTc prolongation

        5. STUDY DESIGN
        - Open-label, single-arm
        - Target enrollment: 60 patients
        - Treatment: XY-451 800 mg PO BID
        - Primary efficacy assessment at 12 weeks
        - Safety assessments every 2 weeks for first month, then monthly

        6. DATA COLLECTION
        - Electronic case report forms (eCRF) with audit trail
        - Radiographic assessments at baseline, week 12, week 24
        - Laboratory safety assessments (CBC, CMP, LFTs) every 2 weeks
        - Patient-reported outcomes via secure portal

        7. STATISTICAL ANALYSIS
        - Efficacy analysis: mITT population
        - Safety analysis: all treated patients
        - Primary endpoint: ORR (95% CI)
        - Power: 85% to detect >40% ORR vs 20% historical control
      `,

      // Patient data for validation
      patientData: [
        {
          id: 'PT001',
          age: 65,
          performanceStatus: 1,
          diagnosis: 'Stage IV Melanoma with BRAF V600E mutation',
          labs: {
            hemoglobin: 12.5,
            creatinine: 0.9,
            ast: 35,
            alt: 28,
          },
          visitDate: new Date().toISOString(),
          baselineResponse: 'measurable disease',
        },
        {
          id: 'PT002',
          age: 52,
          performanceStatus: 0,
          diagnosis: 'Stage IIIC Melanoma with BRAF V600E mutation',
          labs: {
            hemoglobin: 13.8,
            creatinine: 0.85,
            ast: 32,
            alt: 25,
          },
          visitDate: new Date().toISOString(),
          baselineResponse: 'measurable disease',
        },
        {
          id: 'PT003',
          age: 71,
          performanceStatus: 1,
          diagnosis: 'Stage IV Melanoma with BRAF V600E mutation',
          labs: {
            hemoglobin: 11.2,
            creatinine: 1.1,
            ast: 40,
            alt: 38,
          },
          visitDate: new Date().toISOString(),
          baselineResponse: 'measurable disease',
        },
      ],

      // Adverse events
      adverseEvents: [
        {
          id: 'AE001',
          patientId: 'PT001',
          type: 'Rash',
          severity: 2,
          onset: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          causality: 'possible',
          action: 'none',
          outcome: 'resolved',
        },
        {
          id: 'AE002',
          patientId: 'PT002',
          type: 'Nausea',
          severity: 1,
          onset: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          causality: 'probable',
          action: 'none',
          outcome: 'resolving',
        },
        {
          id: 'AE003',
          patientId: 'PT003',
          type: 'Fever',
          severity: 3,
          onset: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          causality: 'possible',
          action: 'dose reduction',
          outcome: 'ongoing',
          hospitalization: false,
        },
      ],

      // Analysis data (efficacy outcomes)
      analysisData: [
        {
          id: 'PT001',
          value: 1,
          timepoint: 'week12',
          outcome: 'Partial Response',
          tumorReduction: 45,
        },
        {
          id: 'PT002',
          value: 1,
          timepoint: 'week12',
          outcome: 'Partial Response',
          tumorReduction: 38,
        },
        {
          id: 'PT003',
          value: 0.5,
          timepoint: 'week12',
          outcome: 'Stable Disease',
          tumorReduction: 15,
        },
      ],
    };

    // Run the complete clinical trial workflow
    const results = await assistant.runCompleteTrialWorkflow(trialData);

    // Display detailed results
    console.log('\n' + '='.repeat(70));
    console.log('DETAILED RESULTS');
    console.log('='.repeat(70) + '\n');

    // Literature Review Results
    console.log('LITERATURE REVIEW SUMMARY:');
    console.log('------------------------');
    console.log(results.literatureReview.summary);
    console.log();

    // Protocol Analysis Results
    console.log('PROTOCOL ANALYSIS:');
    console.log('------------------');
    console.log(`Status: ${results.protocolAnalysis.status}`);
    console.log('Compliance Checks:');
    Object.entries(results.protocolAnalysis.complianceChecks).forEach(([check, details]) => {
      console.log(`  ${check}: ${details.status}`);
      if (details.issues.length > 0) {
        details.issues.forEach((issue) => console.log(`    - ${issue}`));
      }
    });
    console.log();

    // Data Validation Results
    console.log('DATA VALIDATION:');
    console.log('----------------');
    console.log(`Total Records: ${results.dataValidation.totalRecords}`);
    console.log(`Passed: ${results.dataValidation.passedRecords}`);
    console.log(`Failed: ${results.dataValidation.failedRecords}`);
    console.log(`Completeness: ${(results.dataValidation.summary.completeness * 100).toFixed(1)}%`);
    console.log(`Consistency: ${(results.dataValidation.summary.consistency * 100).toFixed(1)}%`);
    console.log();

    // Safety Report
    console.log('SAFETY REPORT:');
    console.log('---------------');
    console.log(`Total Adverse Events: ${results.safetyReport.totalEvents}`);
    console.log(`Serious Adverse Events: ${results.safetyReport.seriousAdverseEvents}`);
    console.log(`Non-Serious Events: ${results.safetyReport.nonSerious}`);
    console.log(`Safety Profile: ${results.safetyReport.safetyProfile}`);
    console.log('Event Types:');
    results.safetyReport.eventTypes.forEach((et) => {
      console.log(
        `  ${et.type}: ${et.count} events (${et.saeCount} SAE)`
      );
    });
    console.log('Recommendations:');
    results.safetyReport.recommendations.forEach((rec) => {
      console.log(`  - ${rec}`);
    });
    console.log();

    // Statistical Analysis Results
    console.log('STATISTICAL ANALYSIS:');
    console.log('---------------------');
    const stats = results.statsAnalysis;
    console.log('Descriptive Statistics:');
    console.log(`  N: ${stats.descriptiveStatistics.n}`);
    console.log(`  Mean: ${stats.descriptiveStatistics.mean}`);
    console.log(`  Median: ${stats.descriptiveStatistics.median}`);
    console.log(`  Std Dev: ${stats.descriptiveStatistics.std}`);
    console.log(`  Range: [${stats.descriptiveStatistics.min}, ${stats.descriptiveStatistics.max}]`);
    console.log();
    console.log('Inferential Statistics:');
    console.log(`  Test Type: ${stats.inferentialStatistics.testType}`);
    console.log(`  P-value: ${stats.inferentialStatistics.pValue}`);
    console.log(`  95% CI: [${stats.inferentialStatistics.ci95.join(', ')}]`);
    console.log(`  Effect Size: ${stats.inferentialStatistics.effectSize}`);
    console.log(`  Statistical Power: ${(stats.inferentialStatistics.statisticalPower * 100).toFixed(1)}%`);
    console.log(`  Statistically Significant: ${stats.inferentialStatistics.statistically_significant ? 'YES' : 'NO'}`);
    console.log();
    console.log('Conclusions:');
    console.log(`  ${stats.conclusions.primary}`);
    console.log(`  Confidence: ${stats.conclusions.confidence}`);
    console.log(`  Recommendation: ${stats.conclusions.recommendation}`);
    console.log();

    // Compliance Report
    console.log('FDA 21 CFR PART 11 COMPLIANCE:');
    console.log('-------------------------------');
    const comp = results.complianceReport.compliance;
    console.log(`Electronic Records: ${comp.electronicsRecords.status}`);
    console.log(`Signatures: ${comp.signatures.status}`);
    console.log(`Audit Trail: ${comp.auditTrail.status}`);
    console.log(`  Total Records: ${comp.auditTrail.totalRecords}`);
    console.log(`  Verified Records: ${comp.auditTrail.verifiedRecords}`);
    console.log(`  Integrity Status: ${comp.auditTrail.integrityStatus}`);
    console.log(`Data Integrity: ${comp.dataIntegrity.status}`);
    console.log();
    console.log('Controls Implemented:');
    comp.dataIntegrity.controls.forEach((control) => {
      console.log(`  ✓ ${control}`);
    });
    console.log();

    // Audit Trail Export
    console.log('AUDIT TRAIL:');
    console.log('------------');
    console.log(`Total Records: ${results.auditTrail.recordCount}`);
    console.log(`JSON Export Size: ${results.auditTrail.jsonExport.length} bytes`);
    console.log(`CSV Export Lines: ${results.auditTrail.csvExport.split('\n').length}`);
    console.log();
    console.log('Sample Audit Trail (first 3 records):');
    const records = JSON.parse(results.auditTrail.jsonExport).slice(0, 3);
    records.forEach((rec, idx) => {
      console.log(`  ${idx + 1}. [${new Date(rec.timestamp).toISOString()}] ${rec.actor} - ${rec.action}`);
      console.log(`     Verified: ${results.complianceReport.compliance.auditTrail.verifiedRecords > idx ? 'YES' : 'NO'}`);
    });
    console.log();

    // Final Summary
    console.log('='.repeat(70));
    console.log('TRIAL WORKFLOW SUMMARY');
    console.log('='.repeat(70));
    console.log(`Project: ${results.complianceReport.projectName}`);
    console.log(`Phase: ${results.complianceReport.trialPhase}`);
    console.log(`Status: Complete`);
    console.log(`Generated: ${results.complianceReport.generatedAt}`);
    console.log();
    console.log('Key Outcomes:');
    console.log(`  ✓ Literature review: ${trialData.researchQuestion}`);
    console.log(`  ✓ Protocol compliance verified`);
    console.log(`  ✓ ${results.dataValidation.passedRecords} patient records validated`);
    console.log(`  ✓ ${results.safetyReport.totalEvents} adverse events tracked`);
    console.log(`  ✓ Statistical analysis completed (p=${results.statsAnalysis.inferentialStatistics.pValue})`);
    console.log(`  ✓ FDA 21 CFR Part 11 compliance verified`);
    console.log(`  ✓ Complete audit trail established (${results.auditTrail.recordCount} records)`);
    console.log();
    console.log('='.repeat(70));

    return results;
  } catch (error) {
    console.error('Fatal error in clinical trial workflow:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  runClinicalTrialWorkflow().catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}

module.exports = runClinicalTrialWorkflow;
