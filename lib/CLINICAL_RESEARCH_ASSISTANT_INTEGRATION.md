# Clinical Research Assistant - Integration Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│         Clinical Research Assistant Orchestrator                │
│                  (Main Entry Point)                             │
└──────────────────────┬──────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┬──────────────┬──────────────┐
        │              │              │              │              │
        ▼              ▼              ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Literature   │ │ Protocol     │ │ Data         │ │ Adverse      │ │ Statistical  │
│ Review Agent │ │ Analysis     │ │ Validation   │ │ Event Agent  │ │ Analysis     │
│              │ │ Agent        │ │ Agent        │ │              │ │ Agent        │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
        │              │              │              │              │
        └──────────────┼──────────────┼──────────────┼──────────────┘
                       │
        ┌──────────────▼──────────────┐
        │    FDA 21 CFR Part 11       │
        │    Audit Trail System       │
        │  - Cryptographic Signatures │
        │  - Electronic Records       │
        │  - Non-Repudiation          │
        └─────────────────────────────┘
```

## Seven-Step Workflow

### Step 1: Literature Review
```
Research Question
      ↓
[Search PubMed/ClinicalTrials]
      ↓
Relevance Scoring
      ↓
Summarization
      ↓
Key Findings & Recommendations
```

**Input**:
```javascript
{
  researchQuestion: "Efficacy and safety of XY-451 in melanoma"
}
```

**Output**:
```javascript
{
  results: [
    {
      type: "pubmed",
      pmid: "34567890",
      title: "...",
      authors: ["..."],
      relevance: 0.95,
      citationCount: 247
    },
    {
      type: "clinicaltrials",
      nctId: "NCT04123456",
      status: "recruiting",
      enrollment: 450
    }
  ],
  summary: {
    keyFindings: [...],
    recommendations: [...]
  }
}
```

### Step 2: Protocol Analysis
```
Raw Protocol Text
      ↓
[Parse & Validate]
      ↓
FDA Compliance Check
      ↓
ICH-GCP Compliance
      ↓
Detailed Assessment Report
```

**Input**:
```javascript
{
  protocolText: "PROTOCOL: Phase II Open-Label Study..."
}
```

**Output**:
```javascript
{
  protocolId: "abc123...",
  status: "compliant",
  sections: {
    objectives: { quality: "high", issues: [] },
    inclusionCriteria: { quality: "high", issues: [] },
    endpoints: { 
      primary: "Overall survival",
      secondary: [...],
      issues: []
    },
    sampleSize: {
      reported: 450,
      calculated: 468,
      power: 0.9,
      issues: ["Recommend N=468"]
    }
  },
  complianceChecks: {
    fdaCFRPart11: { status: "partial", issues: [...] },
    ichGcp: { status: "compliant", issues: [] }
  },
  recommendations: [...]
}
```

### Step 3: Data Validation
```
Patient Data Records
      ↓
[Apply Validation Rules]
      ↓
Range Checks
      ↓
Completeness Assessment
      ↓
Validation Report
```

**Input**:
```javascript
[
  {
    id: "PT001",
    age: 65,
    labs: { hemoglobin: 12.5, creatinine: 0.9 },
    visitDate: "2024-06-20T...",
    diagnosis: "Melanoma",
    performanceStatus: 1
  }
]
```

**Output**:
```javascript
{
  totalRecords: 150,
  passedRecords: 148,
  failedRecords: 2,
  results: [
    {
      recordId: "PT001",
      status: "pass",
      errors: [],
      warnings: [],
      checks: {
        ageCheck: true,
        labCheck: true,
        visitCheck: true,
        inclusionCheck: true
      }
    }
  ],
  summary: {
    completeness: 0.98,
    consistency: 0.99,
    outliers: 2
  }
}
```

### Step 4: Adverse Event Processing
```
Adverse Event Reports
      ↓
[Classify & Assess]
      ↓
SAE Detection
      ↓
Escalation (if needed)
      ↓
Safety Report
```

**Input** (per event):
```javascript
{
  patientId: "PT001",
  type: "Fever",
  severity: 3,
  onset: "2024-06-18T...",
  causality: "possible",
  hospitalization: false
}
```

**Output**:
```javascript
{
  reportId: "AE-001-...",
  totalEvents: 45,
  seriousAdverseEvents: 8,
  nonSerious: 37,
  eventTypes: [
    { type: "Rash", count: 15, saeCount: 0 },
    { type: "Fever", count: 12, saeCount: 3 },
    { type: "Nausea", count: 18, saeCount: 0 }
  ],
  safetyProfile: "expected",
  recommendations: ["Continue standard monitoring"]
}
```

### Step 5: Statistical Analysis
```
Efficacy/Safety Data
      ↓
[Calculate Descriptive Stats]
      ↓
[Perform Hypothesis Testing]
      ↓
[Assess Assumptions]
      ↓
Analysis Report
```

**Input**:
```javascript
[
  { id: "PT001", value: 1, outcome: "Partial Response", tumorReduction: 45 },
  { id: "PT002", value: 1, outcome: "Partial Response", tumorReduction: 38 },
  { id: "PT003", value: 0.5, outcome: "Stable Disease", tumorReduction: 15 }
]
```

**Output**:
```javascript
{
  analysisId: "stat-123...",
  descriptiveStatistics: {
    n: 150,
    mean: 52.3,
    median: 50.5,
    std: 8.7,
    range: [30, 75],
    quartiles: { q1: 45, q3: 60 }
  },
  inferentialStatistics: {
    testType: "ttest",
    pValue: 0.0234,
    ci95: [48.5, 56.1],
    effectSize: 0.75,
    statisticalPower: 0.90,
    statistically_significant: true
  },
  conclusions: {
    primary: "Treatment demonstrates efficacy",
    confidence: "high",
    recommendation: "Proceed to Phase III"
  },
  assumptions: {
    normality: "pass",
    homogeneity: "pass",
    independence: "pass"
  }
}
```

### Step 6: Compliance Report (FDA 21 CFR Part 11)
```
All Trial Activities
      ↓
[Audit Trail Review]
      ↓
[Signature Verification]
      ↓
[Compliance Assessment]
      ↓
Regulatory Report
```

**Output**:
```javascript
{
  reportId: "compliance-...",
  generatedAt: "2024-06-20T...",
  projectName: "Phase II XY-451",
  compliance: {
    electronicsRecords: {
      status: "compliant",
      checks: [
        "Audit trail established",
        "Records encrypted",
        "Signatures implemented"
      ]
    },
    auditTrail: {
      status: "compliant",
      totalRecords: 250,
      verifiedRecords: 250,
      integrityStatus: "verified"
    }
  },
  recommendations: [...]
}
```

### Step 7: Audit Trail Export
```
Complete Audit Trail
      ↓
[Format: JSON/CSV]
      ↓
[Verify All Signatures]
      ↓
Export Files
```

**JSON Format**:
```json
[
  {
    "id": "audit-001...",
    "timestamp": 1719072000000,
    "actor": "investigator_001",
    "action": "DATA_VALIDATION",
    "details": { "dataPoints": 150 },
    "signature": "sha256-hmac-hex",
    "encrypted": true
  }
]
```

**CSV Format**:
```
ID,Timestamp,Actor,Action,Details,Verified
audit-001...,2024-06-20T...,investigator_001,DATA_VALIDATION,"{...}",YES
```

## Integration Patterns

### Pattern 1: Complete Workflow (Recommended)
```javascript
const assistant = new ClinicalResearchAssistant({
  projectName: 'Phase II Trial',
  trialPhase: 'Phase II'
});

const results = await assistant.runCompleteTrialWorkflow({
  researchQuestion: '...',
  protocolText: '...',
  patientData: [...],
  adverseEvents: [...],
  analysisData: [...]
});

// All 7 steps executed with full audit trail
console.log(results.complianceReport);
```

### Pattern 2: Individual Agent Usage
```javascript
// Use specific agents for targeted operations
const litAgent = assistant.literatureAgent;
const protocolAgent = assistant.protocolAgent;
const statsAgent = assistant.statisticsAgent;

const litReview = await litAgent.searchLiterature('...');
const protocolAnalysis = await protocolAgent.analyzeProtocol('...');
const stats = await statsAgent.analyzeData([...]);
```

### Pattern 3: Custom Workflow
```javascript
const assistant = new ClinicalResearchAssistant({...});

// Execute specific steps
await assistant.validateClinicalData(data);
await assistant.performStatisticalAnalysis(stats);
const compliance = await assistant.generateComplianceReport();

// Other steps can be skipped as needed
```

### Pattern 4: Audit Trail Only
```javascript
const auditTrail = new AuditTrail();

// Manual action recording
auditTrail.recordAction('CUSTOM_ACTION', 'actor', { data: '...' });

// Export for regulatory review
const json = auditTrail.export('json');
const csv = auditTrail.export('csv');
```

## Data Flow Example: Phase II Melanoma Trial

### Input Data Structure
```javascript
const trialData = {
  // Step 1: Literature Review
  researchQuestion: 'Efficacy and safety of XY-451 BRAF inhibitor in advanced melanoma',

  // Step 2: Protocol Analysis
  protocolText: `PROTOCOL: Phase II Study
    PRIMARY: Response rate
    SECONDARY: PFS, OS, QoL
    SAMPLE SIZE: 60 patients
    ...`,

  // Step 3: Data Validation
  patientData: [
    {
      id: 'PT001',
      age: 65,
      performanceStatus: 1,
      labs: { hemoglobin: 12.5, creatinine: 0.9, ast: 35, alt: 28 },
      visitDate: '2024-06-20T...',
      baselineResponse: 'measurable'
    }
    // ... more patients
  ],

  // Step 4: Adverse Events
  adverseEvents: [
    {
      patientId: 'PT001',
      type: 'Rash',
      severity: 2,
      onset: '2024-06-15T...',
      causality: 'possible',
      hospitalization: false
    }
    // ... more events
  ],

  // Step 5: Analysis Data
  analysisData: [
    {
      id: 'PT001',
      value: 1,
      timepoint: 'week12',
      outcome: 'Partial Response',
      tumorReduction: 45
    }
    // ... more outcomes
  ]
};

// Execute
const results = await assistant.runCompleteTrialWorkflow(trialData);
```

### Output Data Structure
```javascript
{
  literatureReview: {
    results: [...],
    summary: {...}
  },
  protocolAnalysis: {
    status: 'compliant',
    sections: {...},
    recommendations: [...]
  },
  dataValidation: {
    totalRecords: 60,
    passedRecords: 58,
    summary: {...}
  },
  safetyReport: {
    totalEvents: 45,
    seriousAdverseEvents: 3,
    safetyProfile: 'expected'
  },
  statsAnalysis: {
    pValue: 0.0234,
    effectSize: 0.75,
    conclusion: 'Efficacy demonstrated'
  },
  complianceReport: {
    status: 'compliant',
    auditRecords: 250,
    integrityStatus: 'verified'
  },
  auditTrail: {
    recordCount: 250,
    jsonExport: '...',
    csvExport: '...'
  }
}
```

## Event Handling

### Setting Up Listeners
```javascript
const assistant = new ClinicalResearchAssistant({...});

// Log events
assistant.on('log', (data) => {
  console.log(`[${data.level}] ${data.message}`);
  // Level: INFO, DEBUG, WARN
});

// Alert events (high priority)
assistant.on('alert', (data) => {
  console.warn(`[${data.level}] ${data.message}`);
  // Level: CRITICAL, WARNING
  // Example: SAE detection
});

// Error events
assistant.on('error', (data) => {
  console.error(`ERROR: ${data.message}`);
  // Full error stack available
});

// Agent-specific events
assistant.literatureAgent.on('search-complete', (data) => {
  console.log(`Found ${data.resultsCount} results`);
});

assistant.adverseEventAgent.on('sae-detected', (data) => {
  console.warn(`SAE: ${data.eventId}`);
});

assistant.dataValidationAgent.on('validation-complete', (results) => {
  console.log(`Passed: ${results.passedRecords}/${results.totalRecords}`);
});
```

## FDA Compliance Verification

### Checklist for Compliance
- [x] Electronic Records: All actions recorded with signatures
- [x] Audit Trail: Complete history with timestamps and actors
- [x] Non-Repudiation: Actor identification on all actions
- [x] Data Integrity: HMAC signatures for tamper detection
- [x] Encryption: Support for encrypted storage
- [x] Export: JSON and CSV formats for regulatory review

### Compliance Report Contents
```javascript
{
  electronicsRecords: {
    status: "compliant",
    checks: [
      "Audit trail established",
      "Records encrypted",
      "Signatures implemented",
      "Access controls in place"
    ]
  },
  signatures: {
    status: "compliant",
    checks: [
      "Unique user identification",
      "Electronic signature capability",
      "Meaning preserved",
      "Non-repudiation"
    ]
  },
  auditTrail: {
    totalRecords: 250,
    verifiedRecords: 250,
    integrityStatus: "verified"
  },
  dataIntegrity: {
    controls: [
      "Cryptographic checksums",
      "Access logging",
      "Change tracking",
      "Backup procedures"
    ]
  }
}
```

## Error Handling

### Common Errors and Solutions

**1. Validation Failures**
```javascript
try {
  const results = await assistant.validateClinicalData(data);
  if (results.failedRecords > 0) {
    results.results
      .filter(r => r.status === 'fail')
      .forEach(r => {
        console.error(`Record ${r.recordId}: ${r.errors.join(', ')}`);
      });
  }
} catch (error) {
  console.error(`Validation error: ${error.message}`);
}
```

**2. SAE Detection**
```javascript
let saeDetected = false;
assistant.adverseEventAgent.on('sae-detected', (data) => {
  saeDetected = true;
  // Immediate escalation procedures
  notifyInvestigators(data);
  pauseTrial(); // If necessary
});
```

**3. Compliance Issues**
```javascript
const complianceReport = await assistant.generateComplianceReport();
complianceReport.recommendations.forEach(rec => {
  if (rec.includes('Must')) {
    // Critical issue - must address
    escalateToQA(rec);
  }
});
```

## Performance Optimization

### Data Validation at Scale
```javascript
// Process large datasets in batches
const batchSize = 100;
for (let i = 0; i < patientData.length; i += batchSize) {
  const batch = patientData.slice(i, i + batchSize);
  const results = await assistant.validateClinicalData(batch);
  console.log(`Batch ${i/batchSize + 1}: ${results.passedRecords}/${results.totalRecords}`);
}
```

### Parallel Analysis
```javascript
// Run independent operations in parallel
const [litReview, protocol, statsAnalysis] = await Promise.all([
  assistant.conductLiteratureReview(query),
  assistant.analyzeProtocol(protocolText),
  assistant.performStatisticalAnalysis(data)
]);
```

## Security Best Practices

1. **Protect Signing Keys**: Store `signingKey` securely
   ```javascript
   const signingKey = process.env.SIGNING_KEY;
   const assistant = new ClinicalResearchAssistant({
     signingKey: Buffer.from(signingKey, 'hex')
   });
   ```

2. **Verify Audit Trail**: Always verify signatures before trusting records
   ```javascript
   const isValid = auditTrail.verify(record);
   if (!isValid) {
     console.error(`Audit record ${record.id} is corrupted!`);
   }
   ```

3. **Access Control**: Implement role-based access on top
   ```javascript
   function authorizeAction(user, action) {
     const permissions = {
       'investigator': ['LITERATURE_SEARCH', 'DATA_VALIDATION'],
       'admin': ['ALL']
     };
     return permissions[user.role]?.includes(action);
   }
   ```

## Integration Testing

### Mock External Systems
```javascript
// Mock literature database
const assistant = new ClinicalResearchAssistant({
  database: {
    pubmed: { /* mock data */ },
    clinicaltrials: { /* mock data */ }
  }
});

// Real workflow with mock data
const results = await assistant.runCompleteTrialWorkflow(trialData);
```

### Test Audit Trail
```javascript
const { AuditTrail } = require('./clinical-research-assistant');

const auditTrail = new AuditTrail();
const record = auditTrail.recordAction('TEST', 'tester', { test: true });

// Verify
assert(auditTrail.verify(record), 'Record should be valid');

// Check export
const json = auditTrail.export('json');
const csv = auditTrail.export('csv');
assert(json.includes('TEST'), 'JSON should contain action');
```

## Next Steps

1. **Deploy**: Copy `clinical-research-assistant.js` to production
2. **Configure**: Set up signing/encryption keys in environment
3. **Test**: Run `npm test -- lib/clinical-research-assistant.test.js`
4. **Integrate**: Use patterns above for your trial system
5. **Monitor**: Track audit trail exports for regulatory compliance
