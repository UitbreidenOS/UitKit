/**
 * Document Processor Integration Examples
 *
 * Practical usage patterns for document processing workflows
 */

const processor = require('./document-processor');
const fs = require('fs').promises;
const path = require('path');

// ============================================================================
// EXAMPLE 1: INVOICE PROCESSING WORKFLOW
// ============================================================================

async function processInvoiceWorkflow(invoicePath) {
  console.log('\n=== INVOICE PROCESSING WORKFLOW ===\n');

  try {
    // Load document
    const doc = await processor.loadDocument(invoicePath);
    console.log(`✓ Loaded invoice: ${doc.filename}`);

    // Parse document structure
    await processor.parseDocument(doc);
    console.log(`✓ Parsed document (${doc.pages.length} pages)`);

    // Extract text with OCR
    const ocrResult = await processor.performOCR(doc);
    console.log(`✓ OCR complete (avg confidence: ${(ocrResult.averageConfidence * 100).toFixed(1)}%)`);

    // Classify document
    const classification = await processor.classifyDocument(doc);
    console.log(`✓ Classified as: ${classification.type} (${(classification.confidence * 100).toFixed(1)}% confidence)`);

    // Extract tables (line items)
    const tables = await processor.extractTables(doc, { format: 'json' });
    console.log(`✓ Found ${tables.tablesExtracted} table(s)`);

    // Extract information
    const extracted = await processor.extractInformation(doc);
    console.log(`✓ Extracted entities:`);
    console.log(`  - Names: ${extracted.entities.names.length}`);
    console.log(`  - Emails: ${extracted.entities.emails.length}`);
    console.log(`  - Phones: ${extracted.entities.phones.length}`);
    console.log(`  - Currency: ${extracted.entities.currency.length}`);

    // Assess quality
    const quality = await processor.assessDocumentQuality(doc);
    console.log(`✓ Quality assessment: ${quality.overallScore}/100`);
    if (quality.issues.length > 0) {
      console.log(`  Issues: ${quality.issues.join(', ')}`);
    }

    // Validate
    const validation = await processor.validateDocument(doc);
    console.log(`✓ Validation: ${validation.valid ? 'PASSED' : 'FAILED'}`);

    return {
      document: doc,
      classification,
      tables,
      extracted,
      quality,
    };
  } catch (error) {
    console.error(`Error processing invoice: ${error.message}`);
    throw error;
  }
}

// ============================================================================
// EXAMPLE 2: FORM COMPLETION VERIFICATION
// ============================================================================

async function verifyFormCompletion(formPath) {
  console.log('\n=== FORM COMPLETION VERIFICATION ===\n');

  try {
    // Load and parse
    const doc = await processor.loadDocument(formPath);
    await processor.parseDocument(doc);
    console.log(`✓ Loaded form: ${doc.filename}`);

    // Detect form fields
    const fields = await processor.detectFormFields(doc, { includeUnfilled: true });
    console.log(`✓ Found ${fields.fieldsFound} form field(s)`);

    // Extract form data
    const formData = await processor.extractFormData(doc);
    console.log(`✓ Completion: ${formData.completionPercentage.toFixed(1)}%`);
    console.log(`  - Total fields: ${formData.totalFields}`);
    console.log(`  - Filled: ${formData.filledFields}`);
    console.log(`  - Empty: ${formData.emptyFields}`);

    // Detect signatures
    const signatures = await processor.detectSignatures(doc);
    console.log(`✓ Signatures detected: ${signatures.signaturesFound}`);

    // Report missing fields
    const emptyFields = formData.formFields.filter(f => !f.filled);
    if (emptyFields.length > 0) {
      console.log('\nMissing fields:');
      emptyFields.forEach(f => {
        console.log(`  - ${f.label} (page ${f.pageNumber})`);
      });
    }

    return {
      form: doc,
      fields: formData,
      signatures,
      isComplete: formData.completionPercentage === 100,
    };
  } catch (error) {
    console.error(`Error verifying form: ${error.message}`);
    throw error;
  }
}

// ============================================================================
// EXAMPLE 3: BATCH DOCUMENT CLASSIFICATION
// ============================================================================

async function batchClassifyDocuments(documentPaths) {
  console.log('\n=== BATCH DOCUMENT CLASSIFICATION ===\n');

  try {
    const documents = await Promise.all(
      documentPaths.map(filePath =>
        processor.loadDocument(filePath)
      )
    );

    console.log(`✓ Loaded ${documents.length} document(s)`);

    // Parse all documents
    await Promise.all(documents.map(doc => processor.parseDocument(doc)));
    console.log(`✓ Parsed all documents`);

    // Classify all
    const results = await Promise.all(
      documents.map(async doc => ({
        filename: doc.filename,
        classification: await processor.classifyDocument(doc),
      }))
    );

    // Group by type
    const grouped = {};
    for (const result of results) {
      const type = result.classification.type;
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(result);
    }

    // Report
    console.log('\nClassification Results:');
    for (const [type, docs] of Object.entries(grouped)) {
      console.log(`  ${type}: ${docs.length} document(s)`);
      docs.forEach(d => {
        const conf = (d.classification.confidence * 100).toFixed(1);
        console.log(`    - ${d.filename} (${conf}%)`);
      });
    }

    return results;
  } catch (error) {
    console.error(`Error batch classifying: ${error.message}`);
    throw error;
  }
}

// ============================================================================
// EXAMPLE 4: CONTRACT ANALYSIS
// ============================================================================

async function analyzeContractDocument(contractPath) {
  console.log('\n=== CONTRACT ANALYSIS ===\n');

  try {
    const doc = await processor.loadDocument(contractPath);
    await processor.parseDocument(doc);
    console.log(`✓ Loaded contract: ${doc.filename}`);

    // Extract text
    const text = await processor.extractText(doc);
    console.log(`✓ Extracted text (${text.fullText.length} characters)`);

    // Extract information
    const info = await processor.extractInformation(doc);
    console.log(`✓ Extracted information:`);
    console.log(`  - Names: ${info.entities.names.join(', ') || 'none'}`);
    console.log(`  - Key terms: ${Object.entries(info.keyValuePairs).slice(0, 3)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ')}`);

    // Extract tables (terms, parties, etc.)
    const tables = await processor.extractTables(doc, { format: 'markdown' });
    console.log(`✓ Found ${tables.tablesExtracted} structured section(s)`);

    // Detect signatures
    const sigs = await processor.detectSignatures(doc);
    console.log(`✓ Found ${sigs.signaturesFound} signature(s)`);
    if (sigs.signaturesFound === 0) {
      console.log('  WARNING: Contract may not be fully executed');
    }

    // Quality check
    const quality = await processor.assessDocumentQuality(doc);
    console.log(`✓ Document quality: ${quality.overallScore}/100`);

    return {
      document: doc,
      extracted: info,
      tables,
      signatures: sigs,
      quality,
    };
  } catch (error) {
    console.error(`Error analyzing contract: ${error.message}`);
    throw error;
  }
}

// ============================================================================
// EXAMPLE 5: MEDICAL DOCUMENT EXTRACTION
// ============================================================================

async function extractMedicalDocument(docPath) {
  console.log('\n=== MEDICAL DOCUMENT EXTRACTION ===\n');

  try {
    const doc = await processor.loadDocument(docPath);
    await processor.parseDocument(doc);
    console.log(`✓ Loaded medical document: ${doc.filename}`);

    // High-accuracy OCR
    const ocr = await processor.performOCR(doc, {
      minConfidence: 0.8,
      language: 'eng',
    });
    console.log(`✓ OCR Quality: ${(ocr.averageConfidence * 100).toFixed(1)}%`);

    // Classify (should be medical)
    const classification = await processor.classifyDocument(doc);
    console.log(`✓ Document type: ${classification.type}`);

    // Extract structured data
    const extracted = await processor.extractInformation(doc);
    console.log(`✓ Extracted data:`);
    console.log(`  - Dates: ${extracted.entities.dates.join(', ') || 'none'}`);
    console.log(`  - Names: ${extracted.entities.names.join(', ') || 'none'}`);

    // Extract tables (lab results, medications)
    const tables = await processor.extractTables(doc, { format: 'csv' });
    console.log(`✓ Found ${tables.tablesExtracted} data table(s)`);

    // Assess quality (important for medical docs)
    const quality = await processor.assessDocumentQuality(doc);
    if (quality.overallScore < 70) {
      console.log('⚠ WARNING: Document quality is low - manual review recommended');
    }

    return {
      document: doc,
      classification,
      extracted,
      tables,
      quality,
    };
  } catch (error) {
    console.error(`Error extracting medical document: ${error.message}`);
    throw error;
  }
}

// ============================================================================
// EXAMPLE 6: IDENTITY DOCUMENT VERIFICATION
// ============================================================================

async function verifyIdentityDocument(idPath) {
  console.log('\n=== IDENTITY DOCUMENT VERIFICATION ===\n');

  try {
    const doc = await processor.loadDocument(idPath);
    await processor.parseDocument(doc);
    console.log(`✓ Loaded document: ${doc.filename}`);

    // Classify
    const classification = await processor.classifyDocument(doc);
    console.log(`✓ Document type: ${classification.type}`);

    const isIdentity = ['identity', 'passport', 'license'].includes(classification.type);
    if (!isIdentity) {
      console.log('⚠ WARNING: Document may not be an ID document');
    }

    // Extract personal information
    const info = await processor.extractInformation(doc);
    console.log(`✓ Extracted information:`);
    console.log(`  - Names: ${info.entities.names.join(', ') || 'none'}`);
    console.log(`  - Dates: ${info.entities.dates.join(', ') || 'none'}`);

    // Check for signatures
    const signatures = await processor.detectSignatures(doc);
    console.log(`✓ Signature present: ${signatures.signaturesFound > 0 ? 'YES' : 'NO'}`);

    // Quality check (critical for IDs)
    const quality = await processor.assessDocumentQuality(doc);
    console.log(`✓ Quality: ${quality.overallScore}/100`);

    const isValid = isIdentity && quality.overallScore >= 70;
    console.log(`\n${isValid ? '✓ VERIFIED' : '✗ FAILED VERIFICATION'}`);

    return {
      document: doc,
      classification,
      info,
      signatures,
      quality,
      isValid,
    };
  } catch (error) {
    console.error(`Error verifying identity: ${error.message}`);
    throw error;
  }
}

// ============================================================================
// EXAMPLE 7: SCAN QUALITY ASSESSMENT & CORRECTION
// ============================================================================

async function assessScanQuality(imagePath, options = {}) {
  console.log('\n=== SCAN QUALITY ASSESSMENT ===\n');

  try {
    const doc = await processor.loadDocument(imagePath);
    await processor.parseDocument(doc);
    console.log(`✓ Loaded image: ${doc.filename}`);

    // Get quality metrics
    const quality = await processor.assessDocumentQuality(doc);
    console.log(`✓ Quality Assessment:`);
    console.log(`  - Overall: ${quality.overallScore}/100`);
    console.log(`  - Readability: ${quality.scores.readability}/100`);
    console.log(`  - Contrast: ${quality.scores.contrast}/100`);
    console.log(`  - Skew: ${quality.scores.skew}/100`);
    console.log(`  - Blur: ${quality.scores.blur}/100`);
    console.log(`  - Noise: ${quality.scores.noise}/100`);

    // Provide recommendations
    if (quality.recommendations.length > 0) {
      console.log(`\n✓ Recommendations:`);
      quality.recommendations.forEach(rec => {
        console.log(`  - ${rec}`);
      });
    }

    // Suggest rescan if quality is poor
    if (quality.overallScore < 60) {
      console.log('\n⚠ RESCAN RECOMMENDED');
      if (options.autoRescan) {
        console.log('  Initiating rescan with adjustments...');
      }
    } else {
      console.log('\n✓ SCAN ACCEPTABLE');
    }

    return quality;
  } catch (error) {
    console.error(`Error assessing scan: ${error.message}`);
    throw error;
  }
}

// ============================================================================
// EXAMPLE 8: MULTI-PAGE DOCUMENT SEGMENTATION
// ============================================================================

async function segmentMultiPageDocument(docPath) {
  console.log('\n=== MULTI-PAGE DOCUMENT SEGMENTATION ===\n');

  try {
    const doc = await processor.loadDocument(docPath);
    await processor.parseDocument(doc);
    console.log(`✓ Loaded document: ${doc.filename} (${doc.pages.length} pages)`);

    // Process each page
    const segments = [];
    for (const page of doc.pages) {
      const segment = {
        pageNumber: page.number,
        textLength: (page.text || '').length,
        hasTables: page.tables.length > 0,
        hasForms: page.forms.length > 0,
        hasSignatures: page.signatures.length > 0,
        hasImages: page.images.length > 0,
      };
      segments.push(segment);

      console.log(`✓ Page ${page.number}:`);
      console.log(`  - Text: ${segment.textLength} chars`);
      console.log(`  - Tables: ${page.tables.length}`);
      console.log(`  - Forms: ${page.forms.length}`);
      console.log(`  - Signatures: ${page.signatures.length}`);
    }

    // Classify overall and per-section
    const overall = await processor.classifyDocument(doc);
    console.log(`\n✓ Overall type: ${overall.type}`);

    return {
      document: doc,
      segments,
      overall,
    };
  } catch (error) {
    console.error(`Error segmenting document: ${error.message}`);
    throw error;
  }
}

// ============================================================================
// EXAMPLE 9: EXPORT RESULTS
// ============================================================================

async function exportProcessingResults(doc, results, outputDir) {
  console.log('\n=== EXPORTING RESULTS ===\n');

  try {
    // Create output directory
    await fs.mkdir(outputDir, { recursive: true });

    // Export JSON results
    const jsonPath = path.join(outputDir, `${doc.id}-results.json`);
    await fs.writeFile(jsonPath, JSON.stringify(results, null, 2));
    console.log(`✓ Exported JSON: ${jsonPath}`);

    // Export tables as CSV
    if (results.tables && results.tables.length > 0) {
      for (let i = 0; i < results.tables.length; i++) {
        const table = results.tables[i];
        const csvPath = path.join(outputDir, `${doc.id}-table-${i + 1}.csv`);
        if (table.csv) {
          await fs.writeFile(csvPath, table.csv);
          console.log(`✓ Exported table: ${csvPath}`);
        }
      }
    }

    // Export extracted text
    if (results.extracted) {
      const textPath = path.join(outputDir, `${doc.id}-extracted.txt`);
      const content = [
        `Document: ${doc.filename}`,
        `Type: ${results.classification?.type || 'unknown'}`,
        `\n=== ENTITIES ===\n`,
        `Names: ${results.extracted.entities.names.join(', ')}`,
        `Emails: ${results.extracted.entities.emails.join(', ')}`,
        `Phones: ${results.extracted.entities.phones.join(', ')}`,
        `Addresses: ${results.extracted.entities.addresses.join(', ')}`,
        `Dates: ${results.extracted.entities.dates.join(', ')}`,
        `Currency: ${results.extracted.entities.currency.join(', ')}`,
        `\n=== SUMMARY ===\n${results.extracted.summary}`,
      ].join('\n');

      await fs.writeFile(textPath, content);
      console.log(`✓ Exported extracted data: ${textPath}`);
    }

    console.log(`\n✓ All results exported to ${outputDir}`);
  } catch (error) {
    console.error(`Error exporting results: ${error.message}`);
    throw error;
  }
}

// ============================================================================
// EXAMPLE 10: ERROR HANDLING & RETRY
// ============================================================================

async function robustDocumentProcessing(docPath, options = {}) {
  console.log('\n=== ROBUST DOCUMENT PROCESSING ===\n');

  const maxRetries = options.maxRetries || 3;
  const retryDelay = options.retryDelay || 1000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries}...`);

      const doc = await processor.loadDocument(docPath);
      await processor.parseDocument(doc);

      // Validate before processing
      const validation = await processor.validateDocument(doc);
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Process
      const ocr = await processor.performOCR(doc);
      const classification = await processor.classifyDocument(doc);
      const extracted = await processor.extractInformation(doc);

      console.log('✓ Processing successful');
      return { doc, ocr, classification, extracted };
    } catch (error) {
      console.error(`✗ Attempt ${attempt} failed: ${error.message}`);

      if (attempt < maxRetries) {
        console.log(`Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      } else {
        throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
      }
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  processInvoiceWorkflow,
  verifyFormCompletion,
  batchClassifyDocuments,
  analyzeContractDocument,
  extractMedicalDocument,
  verifyIdentityDocument,
  assessScanQuality,
  segmentMultiPageDocument,
  exportProcessingResults,
  robustDocumentProcessing,
};

// ============================================================================
// DEMO
// ============================================================================

if (require.main === module) {
  console.log('Document Processor Integration Examples Loaded');
  console.log('\nAvailable examples:');
  console.log('  1. processInvoiceWorkflow(path)');
  console.log('  2. verifyFormCompletion(path)');
  console.log('  3. batchClassifyDocuments([paths])');
  console.log('  4. analyzeContractDocument(path)');
  console.log('  5. extractMedicalDocument(path)');
  console.log('  6. verifyIdentityDocument(path)');
  console.log('  7. assessScanQuality(path)');
  console.log('  8. segmentMultiPageDocument(path)');
  console.log('  9. exportProcessingResults(doc, results, dir)');
  console.log('  10. robustDocumentProcessing(path, options)');
}
