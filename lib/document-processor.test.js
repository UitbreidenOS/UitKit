/**
 * Document Processor Tests
 *
 * Comprehensive test suite for document processing module
 */

const processor = require('./document-processor');
const assert = require('assert');
const { performance } = require('perf_hooks');

// ============================================================================
// TEST UTILITIES
// ============================================================================

function createMockPDFBuffer() {
  // Minimal PDF header
  const header = Buffer.from('%PDF-1.4\n');
  const content = Buffer.from('Sample PDF content for testing\n'.repeat(500));
  return Buffer.concat([header, content]);
}

function createMockImageBuffer() {
  // PNG header
  const pngHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const content = Buffer.alloc(5000);
  return Buffer.concat([pngHeader, content]);
}

function createMockJPEGBuffer() {
  // JPEG header
  const jpegHeader = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0]);
  const content = Buffer.alloc(5000);
  return Buffer.concat([jpegHeader, content]);
}

// ============================================================================
// DOCUMENT LOADING TESTS
// ============================================================================

describe('Document Loading', () => {
  it('should load document from buffer', async () => {
    const buffer = createMockPDFBuffer();
    const doc = await processor.loadDocument(buffer, { filename: 'test.pdf' });

    assert.strictEqual(doc.filename, 'test.pdf');
    assert.strictEqual(doc.format, 'pdf');
    assert.strictEqual(doc.buffer.length, buffer.length);
    assert.strictEqual(doc.processed, false);
  });

  it('should generate unique document ID', async () => {
    const buffer1 = createMockPDFBuffer();
    const buffer2 = createMockPDFBuffer();

    const doc1 = await processor.loadDocument(buffer1, { filename: 'test1.pdf' });
    const doc2 = await processor.loadDocument(buffer2, { filename: 'test2.pdf' });

    assert.notStrictEqual(doc1.id, doc2.id);
  });

  it('should track load time', async () => {
    const buffer = createMockPDFBuffer();
    const doc = await processor.loadDocument(buffer, { filename: 'test.pdf' });

    assert.strictEqual(typeof doc.loadTime, 'number');
    assert(doc.loadTime >= 0);
  });

  it('should reject unsupported formats', async () => {
    const buffer = Buffer.from('invalid content');

    try {
      await processor.loadDocument(buffer, { filename: 'test.exe' });
      assert.fail('Should have thrown error');
    } catch (error) {
      assert(error.message.includes('Unsupported format'));
    }
  });

  it('should accept all supported formats', async () => {
    const formats = ['pdf', 'jpg', 'jpeg', 'png', 'tiff', 'tif', 'bmp', 'webp'];

    for (const format of formats) {
      const buffer = createMockPDFBuffer();
      const doc = await processor.loadDocument(buffer, { filename: `test.${format}` });
      assert.strictEqual(doc.format, format);
    }
  });
});

// ============================================================================
// DOCUMENT PARSING TESTS
// ============================================================================

describe('Document Parsing', () => {
  it('should parse PDF document', async () => {
    const buffer = createMockPDFBuffer();
    const doc = await processor.loadDocument(buffer, { filename: 'test.pdf' });
    const parsed = await processor.parseDocument(doc);

    assert.strictEqual(parsed.processed, true);
    assert(Array.isArray(parsed.pages));
    assert(parsed.pages.length > 0);
  });

  it('should parse image document', async () => {
    const buffer = createMockImageBuffer();
    const doc = await processor.loadDocument(buffer, { filename: 'test.png' });
    const parsed = await processor.parseDocument(doc);

    assert.strictEqual(parsed.processed, true);
    assert.strictEqual(parsed.pages.length, 1);
    assert(parsed.pages[0].images.length > 0);
  });

  it('should set page properties', async () => {
    const buffer = createMockPDFBuffer();
    const doc = await processor.loadDocument(buffer, { filename: 'test.pdf' });
    const parsed = await processor.parseDocument(doc);

    const page = parsed.pages[0];
    assert.strictEqual(typeof page.number, 'number');
    assert.strictEqual(typeof page.width, 'number');
    assert.strictEqual(typeof page.height, 'number');
    assert.strictEqual(page.rotation, 0);
    assert(Array.isArray(page.tables));
    assert(Array.isArray(page.forms));
    assert(Array.isArray(page.signatures));
  });

  it('should not reparse already parsed document', async () => {
    const buffer = createMockPDFBuffer();
    const doc = await processor.loadDocument(buffer, { filename: 'test.pdf' });
    await processor.parseDocument(doc);

    const parseTime1 = doc.parseTime;
    await processor.parseDocument(doc);
    const parseTime2 = doc.parseTime;

    assert.strictEqual(parseTime1, parseTime2);
  });

  it('should track parse time', async () => {
    const buffer = createMockPDFBuffer();
    const doc = await processor.loadDocument(buffer, { filename: 'test.pdf' });
    const parsed = await processor.parseDocument(doc);

    assert.strictEqual(typeof parsed.parseTime, 'number');
    assert(parsed.parseTime >= 0);
  });
});

// ============================================================================
// OCR & TEXT EXTRACTION TESTS
// ============================================================================

describe('OCR and Text Extraction', () => {
  let doc;

  beforeEach(async () => {
    const buffer = createMockPDFBuffer();
    doc = await processor.loadDocument(buffer, { filename: 'test.pdf' });
    await processor.parseDocument(doc);
  });

  it('should perform OCR on document', async () => {
    const result = await processor.performOCR(doc);

    assert.strictEqual(result.documentId, doc.id);
    assert(Array.isArray(result.pageResults));
    assert(result.pageResults.length > 0);
  });

  it('should provide OCR confidence scores', async () => {
    const result = await processor.performOCR(doc);
    const pageResult = result.pageResults[0];

    assert.strictEqual(typeof pageResult.confidence, 'number');
    assert(pageResult.confidence >= 0 && pageResult.confidence <= 1);
  });

  it('should detect page skew', async () => {
    const result = await processor.performOCR(doc);
    const pageResult = result.pageResults[0];

    assert.strictEqual(typeof pageResult.skewAngle, 'number');
    assert(Math.abs(pageResult.skewAngle) <= 45);
  });

  it('should assess image quality', async () => {
    const result = await processor.performOCR(doc);
    const pageResult = result.pageResults[0];

    assert.strictEqual(typeof pageResult.quality, 'number');
    assert(pageResult.quality >= 0 && pageResult.quality <= 100);
  });

  it('should extract text from document', async () => {
    const result = await processor.extractText(doc);

    assert.strictEqual(result.documentId, doc.id);
    assert.strictEqual(typeof result.fullText, 'string');
    assert(Array.isArray(result.pages));
    assert(result.pages.length > 0);
  });

  it('should preserve text per page', async () => {
    const result = await processor.extractText(doc);

    for (const page of result.pages) {
      assert.strictEqual(typeof page.number, 'number');
      assert.strictEqual(typeof page.text, 'string');
      assert.strictEqual(typeof page.characterCount, 'number');
      assert.strictEqual(typeof page.confidence, 'number');
    }
  });

  it('should extract specific pages', async () => {
    const result = await processor.extractText(doc, { pages: [1] });

    assert.strictEqual(result.pages.length, 1);
    assert.strictEqual(result.pages[0].number, 1);
  });
});

// ============================================================================
// TABLE DETECTION & EXTRACTION TESTS
// ============================================================================

describe('Table Detection and Extraction', () => {
  let doc;

  beforeEach(async () => {
    const buffer = createMockPDFBuffer();
    doc = await processor.loadDocument(buffer, { filename: 'test.pdf' });
    await processor.parseDocument(doc);
  });

  it('should detect tables in document', async () => {
    const result = await processor.detectTables(doc);

    assert.strictEqual(result.documentId, doc.id);
    assert.strictEqual(typeof result.tablesFound, 'number');
    assert(Array.isArray(result.tables));
  });

  it('should provide table confidence scores', async () => {
    const result = await processor.detectTables(doc);

    if (result.tables.length > 0) {
      const table = result.tables[0];
      assert.strictEqual(typeof table.confidence, 'number');
      assert(table.confidence >= 0 && table.confidence <= 1);
    }
  });

  it('should extract tables in JSON format', async () => {
    const result = await processor.extractTables(doc, { format: 'json' });

    assert.strictEqual(result.documentId, doc.id);
    assert.strictEqual(typeof result.tablesExtracted, 'number');
    assert(Array.isArray(result.tables));
  });

  it('should extract tables in CSV format', async () => {
    const result = await processor.extractTables(doc, { format: 'csv' });

    if (result.tables.length > 0) {
      const table = result.tables[0];
      assert.strictEqual(typeof table.csv, 'string');
    }
  });

  it('should extract tables in Markdown format', async () => {
    const result = await processor.extractTables(doc, { format: 'markdown' });

    if (result.tables.length > 0) {
      const table = result.tables[0];
      assert.strictEqual(typeof table.markdown, 'string');
      assert(table.markdown.includes('|'));
    }
  });
});

// ============================================================================
// FORM FIELD TESTS
// ============================================================================

describe('Form Field Detection', () => {
  let doc;

  beforeEach(async () => {
    const buffer = createMockPDFBuffer();
    doc = await processor.loadDocument(buffer, { filename: 'test.pdf' });
    await processor.parseDocument(doc);
  });

  it('should detect form fields', async () => {
    const result = await processor.detectFormFields(doc);

    assert.strictEqual(result.documentId, doc.id);
    assert.strictEqual(typeof result.fieldsFound, 'number');
    assert(Array.isArray(result.fields));
  });

  it('should identify field types', async () => {
    const result = await processor.detectFormFields(doc);

    if (result.fields.length > 0) {
      const field = result.fields[0];
      const validTypes = ['text', 'checkbox', 'radio', 'signature', 'date'];
      assert(validTypes.includes(field.type));
    }
  });

  it('should extract form data', async () => {
    const result = await processor.extractFormData(doc);

    assert.strictEqual(result.documentId, doc.id);
    assert.strictEqual(typeof result.totalFields, 'number');
    assert.strictEqual(typeof result.filledFields, 'number');
    assert.strictEqual(typeof result.completionPercentage, 'number');
  });

  it('should calculate completion percentage', async () => {
    const result = await processor.extractFormData(doc);

    assert(result.completionPercentage >= 0 && result.completionPercentage <= 100);
  });
});

// ============================================================================
// SIGNATURE DETECTION TESTS
// ============================================================================

describe('Signature Detection', () => {
  let doc;

  beforeEach(async () => {
    const buffer = createMockPDFBuffer();
    doc = await processor.loadDocument(buffer, { filename: 'test.pdf' });
    await processor.parseDocument(doc);
  });

  it('should detect signatures', async () => {
    const result = await processor.detectSignatures(doc);

    assert.strictEqual(result.documentId, doc.id);
    assert.strictEqual(typeof result.signaturesFound, 'number');
    assert(Array.isArray(result.signatures));
  });

  it('should provide signature confidence', async () => {
    const result = await processor.detectSignatures(doc);

    if (result.signatures.length > 0) {
      const sig = result.signatures[0];
      assert.strictEqual(typeof sig.confidence, 'number');
      assert(sig.confidence >= 0 && sig.confidence <= 1);
    }
  });

  it('should analyze signature characteristics', async () => {
    const result = await processor.detectSignatures(doc);

    if (result.signatures.length > 0) {
      const sig = result.signatures[0];
      assert(sig.characteristics);
      assert.strictEqual(typeof sig.characteristics.complexity, 'number');
      assert.strictEqual(typeof sig.characteristics.strokeCount, 'number');
      assert.strictEqual(typeof sig.characteristics.inkRatio, 'number');
    }
  });
});

// ============================================================================
// DOCUMENT CLASSIFICATION TESTS
// ============================================================================

describe('Document Classification', () => {
  let doc;

  beforeEach(async () => {
    const buffer = createMockPDFBuffer();
    doc = await processor.loadDocument(buffer, { filename: 'test.pdf' });
    await processor.parseDocument(doc);
  });

  it('should classify document type', async () => {
    const result = await processor.classifyDocument(doc);

    assert.strictEqual(result.documentId, doc.id);
    assert.strictEqual(typeof result.type, 'string');
    assert.strictEqual(typeof result.confidence, 'number');
  });

  it('should provide type scores', async () => {
    const result = await processor.classifyDocument(doc);

    assert(result.scores);
    assert.strictEqual(typeof result.scores.invoice, 'number');
    assert.strictEqual(typeof result.scores.contract, 'number');
  });

  it('should include metadata', async () => {
    const result = await processor.classifyDocument(doc);

    assert(result.metadata);
    assert.strictEqual(typeof result.metadata.pageCount, 'number');
    assert.strictEqual(typeof result.metadata.hasImages, 'boolean');
    assert.strictEqual(typeof result.metadata.hasTables, 'boolean');
  });
});

// ============================================================================
// INFORMATION EXTRACTION TESTS
// ============================================================================

describe('Information Extraction', () => {
  let doc;

  beforeEach(async () => {
    const buffer = createMockPDFBuffer();
    doc = await processor.loadDocument(buffer, { filename: 'test.pdf' });
    await processor.parseDocument(doc);
  });

  it('should extract information entities', async () => {
    const result = await processor.extractInformation(doc);

    assert.strictEqual(result.documentId, doc.id);
    assert(result.entities);
    assert(Array.isArray(result.entities.names));
    assert(Array.isArray(result.entities.emails));
    assert(Array.isArray(result.entities.phones));
    assert(Array.isArray(result.entities.addresses));
  });

  it('should extract key-value pairs', async () => {
    const result = await processor.extractInformation(doc);

    assert.strictEqual(typeof result.keyValuePairs, 'object');
  });

  it('should generate summary', async () => {
    const result = await processor.extractInformation(doc);

    assert.strictEqual(typeof result.summary, 'string');
  });

  it('should calculate extraction confidence', async () => {
    const result = await processor.extractInformation(doc);

    assert.strictEqual(typeof result.confidence, 'number');
    assert(result.confidence >= 0 && result.confidence <= 1);
  });
});

// ============================================================================
// QUALITY & VALIDATION TESTS
// ============================================================================

describe('Document Quality and Validation', () => {
  let doc;

  beforeEach(async () => {
    const buffer = createMockPDFBuffer();
    doc = await processor.loadDocument(buffer, { filename: 'test.pdf' });
    await processor.parseDocument(doc);
  });

  it('should assess document quality', async () => {
    const result = await processor.assessDocumentQuality(doc);

    assert.strictEqual(result.documentId, doc.id);
    assert.strictEqual(typeof result.overallScore, 'number');
    assert(result.overallScore >= 0 && result.overallScore <= 100);
  });

  it('should provide quality scores for metrics', async () => {
    const result = await processor.assessDocumentQuality(doc);

    assert(result.scores);
    assert.strictEqual(typeof result.scores.readability, 'number');
    assert.strictEqual(typeof result.scores.contrast, 'number');
    assert.strictEqual(typeof result.scores.blur, 'number');
    assert.strictEqual(typeof result.scores.noise, 'number');
  });

  it('should provide quality recommendations', async () => {
    const result = await processor.assessDocumentQuality(doc);

    assert(Array.isArray(result.issues));
    assert(Array.isArray(result.recommendations));
  });

  it('should validate document', async () => {
    const result = await processor.validateDocument(doc);

    assert.strictEqual(result.documentId, doc.id);
    assert.strictEqual(typeof result.valid, 'boolean');
    assert(Array.isArray(result.errors));
    assert(Array.isArray(result.warnings));
  });

  it('should detect validation issues', async () => {
    const buffer = Buffer.alloc(0);
    const doc = await processor.loadDocument(buffer, { filename: 'empty.pdf' });

    const result = await processor.validateDocument(doc);

    assert.strictEqual(result.valid, false);
    assert(result.errors.length > 0);
  });
});

// ============================================================================
// BATCH PROCESSING TESTS
// ============================================================================

describe('Batch Processing', () => {
  it('should process multiple documents', async () => {
    const documents = [
      {
        id: 'doc1',
        source: createMockPDFBuffer(),
        options: { filename: 'test1.pdf' },
      },
      {
        id: 'doc2',
        source: createMockImageBuffer(),
        options: { filename: 'test2.png' },
      },
    ];

    const result = await processor.batchProcess(documents, ['load', 'parse']);

    assert.strictEqual(result.totalDocuments, 2);
    assert.strictEqual(result.successCount, 2);
    assert.strictEqual(result.failureCount, 0);
    assert(Array.isArray(result.results));
  });

  it('should track batch processing time', async () => {
    const documents = [
      {
        id: 'doc1',
        source: createMockPDFBuffer(),
        options: { filename: 'test1.pdf' },
      },
    ];

    const result = await processor.batchProcess(documents, ['load']);

    assert.strictEqual(typeof result.processingTime, 'number');
    assert(result.processingTime >= 0);
  });

  it('should handle operation failures gracefully', async () => {
    const documents = [
      {
        id: 'doc1',
        source: Buffer.from('invalid'),
        options: { filename: 'test.exe' },
      },
    ];

    const result = await processor.batchProcess(documents, ['load']);

    assert(result.failureCount > 0 || result.successCount === 0);
  });
});

// ============================================================================
// CONSTANTS EXPORT TESTS
// ============================================================================

describe('Module Exports', () => {
  it('should export DOCUMENT_TYPES', () => {
    assert(processor.DOCUMENT_TYPES);
    assert.strictEqual(processor.DOCUMENT_TYPES.INVOICE, 'invoice');
    assert.strictEqual(processor.DOCUMENT_TYPES.CONTRACT, 'contract');
  });

  it('should export SUPPORTED_FORMATS', () => {
    assert(Array.isArray(processor.SUPPORTED_FORMATS));
    assert(processor.SUPPORTED_FORMATS.includes('pdf'));
    assert(processor.SUPPORTED_FORMATS.includes('png'));
  });

  it('should export format arrays', () => {
    assert(Array.isArray(processor.PDF_FORMATS));
    assert(Array.isArray(processor.IMAGE_FORMATS));
  });

  it('should export all main functions', () => {
    const functions = [
      'loadDocument',
      'parseDocument',
      'performOCR',
      'extractText',
      'detectTables',
      'extractTables',
      'detectFormFields',
      'extractFormData',
      'detectSignatures',
      'classifyDocument',
      'extractInformation',
      'assessDocumentQuality',
      'validateDocument',
      'batchProcess',
    ];

    for (const fn of functions) {
      assert.strictEqual(typeof processor[fn], 'function', `${fn} not exported`);
    }
  });
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('Integration Tests', () => {
  it('should process complete document workflow', async () => {
    const buffer = createMockPDFBuffer();
    const doc = await processor.loadDocument(buffer, { filename: 'invoice.pdf' });
    await processor.parseDocument(doc);

    const ocr = await processor.performOCR(doc);
    const text = await processor.extractText(doc);
    const tables = await processor.extractTables(doc);
    const forms = await processor.extractFormData(doc);
    const sigs = await processor.detectSignatures(doc);
    const classify = await processor.classifyDocument(doc);
    const extract = await processor.extractInformation(doc);
    const quality = await processor.assessDocumentQuality(doc);
    const validate = await processor.validateDocument(doc);

    assert(ocr.pageResults.length > 0);
    assert(text.fullText.length > 0);
    assert.strictEqual(typeof classify.type, 'string');
    assert(validate.valid);
  });

  it('should handle PDF to classified data pipeline', async () => {
    const buffer = createMockPDFBuffer();
    const doc = await processor.loadDocument(buffer, { filename: 'document.pdf' });

    await processor.parseDocument(doc);
    const ocrResult = await processor.performOCR(doc);
    const classified = await processor.classifyDocument(doc);
    const extracted = await processor.extractInformation(doc);

    assert(ocrResult.averageConfidence > 0);
    assert.strictEqual(typeof classified.type, 'string');
    assert(extracted.entities.names || extracted.entities.emails);
  });
});

// ============================================================================
// PERFORMANCE TESTS
// ============================================================================

describe('Performance', () => {
  it('should load document quickly', async () => {
    const buffer = createMockPDFBuffer();
    const start = performance.now();

    const doc = await processor.loadDocument(buffer, { filename: 'test.pdf' });

    const elapsed = performance.now() - start;
    assert(elapsed < 100, `Document load took ${elapsed}ms`);
  });

  it('should parse document within reasonable time', async () => {
    const buffer = createMockPDFBuffer();
    const doc = await processor.loadDocument(buffer, { filename: 'test.pdf' });
    const start = performance.now();

    await processor.parseDocument(doc);

    const elapsed = performance.now() - start;
    assert(elapsed < 500, `Document parse took ${elapsed}ms`);
  });

  it('should process batch efficiently', async () => {
    const documents = Array(5).fill().map((_, i) => ({
      id: `doc${i}`,
      source: createMockPDFBuffer(),
      options: { filename: `test${i}.pdf` },
    }));

    const result = await processor.batchProcess(documents, ['load']);

    assert(result.processingTime < 5000, `Batch processing took ${result.processingTime}ms`);
  });
});

console.log('Running Document Processor Tests...\n');
