# Document Processor

Enterprise-grade document processing module for PDFs, images, and scans with comprehensive data extraction, classification, and quality assessment.

## Features

- **Multi-Format Support**: PDF, JPEG, PNG, TIFF, BMP, WebP
- **Text Extraction**: OCR with confidence scoring and skew detection
- **Table Detection**: Intelligent structure detection and export (JSON, CSV, Markdown)
- **Form Fields**: Checkbox, radio, text field detection and extraction
- **Signature Detection**: Signature identification with complexity analysis
- **Document Classification**: 12 document types with confidence scoring
- **Information Extraction**: Entities (names, emails, phones, addresses, dates, currency)
- **Quality Assessment**: Readability, contrast, blur, noise, skew analysis
- **Batch Processing**: Concurrent multi-document processing
- **Validation**: Integrity and completeness checks

## Installation

```javascript
const processor = require('./document-processor');
```

## Quick Start

```javascript
// Load document
const doc = await processor.loadDocument('./invoice.pdf');

// Parse structure
await processor.parseDocument(doc);

// Extract text with OCR
const ocrResult = await processor.performOCR(doc);

// Classify document type
const classification = await processor.classifyDocument(doc);

// Extract information
const extracted = await processor.extractInformation(doc);

console.log(`Type: ${classification.type}`);
console.log(`Confidence: ${(classification.confidence * 100).toFixed(1)}%`);
console.log(`Names: ${extracted.entities.names.join(', ')}`);
```

## API Reference

### Document Loading

#### `loadDocument(source, options)`

Load a document from file path or Buffer.

**Parameters:**
- `source` (string | Buffer): File path or document buffer
- `options` (object):
  - `filename` (string): Filename if source is Buffer
  - `loadTimeout` (number): Load timeout in ms (default: 30000)

**Returns:** Document object with metadata

```javascript
// From file
const doc = await processor.loadDocument('./invoice.pdf');

// From Buffer
const buffer = await fs.readFile('./contract.pdf');
const doc = await processor.loadDocument(buffer, { 
  filename: 'contract.pdf' 
});
```

**Document Structure:**
```javascript
{
  id: 'doc_1234567890_abc123',
  filename: 'invoice.pdf',
  format: 'pdf',
  buffer: <Buffer>,
  size: 125440,
  loadTime: 15.3,
  metadata: {
    created: Date,
    modified: null
  },
  pages: [],
  processed: false
}
```

### Document Parsing

#### `parseDocument(doc, options)`

Parse document structure and initialize pages.

**Parameters:**
- `doc` (object): Document object from loadDocument
- `options` (object):
  - `extractMetadata` (boolean): Extract PDF metadata (default: true)
  - `pageRange` (object): { start, end } for partial parsing

**Returns:** Parsed document object

```javascript
const doc = await processor.loadDocument('./document.pdf');
const parsed = await processor.parseDocument(doc);

console.log(`Pages: ${parsed.pages.length}`);
console.log(`Total size: ${parsed.size} bytes`);
```

### Text Extraction & OCR

#### `performOCR(doc, options)`

Perform Optical Character Recognition on document pages.

**Parameters:**
- `doc` (object): Parsed document
- `options` (object):
  - `language` (string): OCR language (default: 'eng')
  - `minConfidence` (number): Confidence threshold 0-1 (default: 0.6)
  - `deskew` (boolean): Auto-deskew pages (default: true)

**Returns:** OCR results with per-page analysis

```javascript
const ocrResult = await processor.performOCR(doc, {
  language: 'eng',
  minConfidence: 0.8,
  deskew: true
});

console.log(`Average confidence: ${ocrResult.averageConfidence}`);
console.log(`Average quality: ${ocrResult.averageQuality}`);

ocrResult.pageResults.forEach(page => {
  console.log(`Page ${page.pageNumber}: ${(page.confidence * 100).toFixed(1)}%`);
  console.log(`  Skew: ${page.skewAngle.toFixed(1)}°`);
  console.log(`  Quality: ${page.quality.toFixed(1)}`);
});
```

#### `extractText(doc, options)`

Extract text from document with optional layout preservation.

**Parameters:**
- `doc` (object): Document with OCR data
- `options` (object):
  - `preserveLayout` (boolean): Preserve original layout (default: false)
  - `pages` (array): Specific page numbers to extract (default: all)

**Returns:** Extracted text with metadata

```javascript
const extraction = await processor.extractText(doc, {
  pages: [1, 2, 3],
  preserveLayout: true
});

console.log(`Full text:\n${extraction.fullText}`);

extraction.pages.forEach(page => {
  console.log(`Page ${page.number}: ${page.characterCount} chars`);
});
```

### Table Detection & Extraction

#### `detectTables(doc, options)`

Detect tables in document pages.

**Parameters:**
- `doc` (object): Parsed document
- `options` (object):
  - `strictMode` (boolean): Only high-confidence tables (default: false)
  - `minConfidence` (number): Minimum confidence 0-1

**Returns:** Table detection results

```javascript
const tables = await processor.detectTables(doc, {
  strictMode: true,
  minConfidence: 0.7
});

console.log(`Tables found: ${tables.tablesFound}`);

tables.tables.forEach(table => {
  console.log(`Page ${table.pageNumber}:`);
  console.log(`  Rows: ${table.rows.length}`);
  console.log(`  Columns: ${table.columns.length}`);
  console.log(`  Confidence: ${(table.confidence * 100).toFixed(1)}%`);
});
```

#### `extractTables(doc, options)`

Extract table data in multiple formats.

**Parameters:**
- `doc` (object): Document with table detection
- `options` (object):
  - `format` (string): 'json', 'csv', 'markdown' (default: 'json')
  - `includeConfidence` (boolean): Include confidence scores

**Returns:** Extracted tables in specified format

```javascript
// JSON format
const jsonTables = await processor.extractTables(doc, {
  format: 'json'
});

// CSV format
const csvTables = await processor.extractTables(doc, {
  format: 'csv'
});

csvTables.tables.forEach(table => {
  console.log(table.csv);
});

// Markdown format
const mdTables = await processor.extractTables(doc, {
  format: 'markdown'
});

mdTables.tables.forEach(table => {
  console.log(table.markdown);
});
```

### Form Field Processing

#### `detectFormFields(doc, options)`

Detect and identify form fields (text, checkbox, radio, signature).

**Parameters:**
- `doc` (object): Parsed document
- `options` (object):
  - `includeUnfilled` (boolean): Include empty fields (default: true)
  - `fieldTypes` (array): Specific types to detect

**Returns:** Form field detection results

```javascript
const fields = await processor.detectFormFields(doc, {
  includeUnfilled: true
});

console.log(`Fields found: ${fields.fieldsFound}`);

fields.fields.forEach(field => {
  console.log(`${field.label} (${field.type})`);
  console.log(`  Filled: ${field.filled}`);
  console.log(`  Required: ${field.required}`);
  console.log(`  Page ${field.pageNumber}`);
});
```

#### `extractFormData(doc, options)`

Extract filled form data with completion tracking.

**Parameters:**
- `doc` (object): Document with form field detection
- `options` (object):
  - `includeEmpty` (boolean): Include empty fields (default: false)

**Returns:** Form data extraction results

```javascript
const formData = await processor.extractFormData(doc);

console.log(`Completion: ${formData.completionPercentage.toFixed(1)}%`);
console.log(`Total fields: ${formData.totalFields}`);
console.log(`Filled: ${formData.filledFields}`);
console.log(`Empty: ${formData.emptyFields}`);

formData.formFields.forEach(field => {
  if (field.filled) {
    console.log(`${field.label}: ${field.value}`);
  }
});
```

### Signature Detection

#### `detectSignatures(doc, options)`

Detect and analyze signatures in document.

**Parameters:**
- `doc` (object): Parsed document
- `options` (object):
  - `minConfidence` (number): Confidence threshold 0-1 (default: 0.7)
  - `includeTimestamp` (boolean): Include detection timestamp

**Returns:** Signature detection results

```javascript
const signatures = await processor.detectSignatures(doc, {
  minConfidence: 0.75,
  includeTimestamp: true
});

console.log(`Signatures detected: ${signatures.signaturesFound}`);
console.log(`All signed: ${signatures.allSigned}`);

signatures.signatures.forEach(sig => {
  console.log(`Page ${sig.pageNumber}:`);
  console.log(`  Confidence: ${(sig.confidence * 100).toFixed(1)}%`);
  console.log(`  Complexity: ${sig.characteristics.complexity}`);
  console.log(`  Strokes: ${sig.characteristics.strokeCount}`);
  console.log(`  Ink ratio: ${(sig.characteristics.inkRatio * 100).toFixed(1)}%`);
});
```

### Document Classification

#### `classifyDocument(doc, options)`

Classify document into predefined types.

**Supported Types:**
- `invoice` - Sales invoices, bills
- `receipt` - Purchase receipts
- `contract` - Legal contracts, agreements
- `form` - Forms, applications
- `report` - Reports, summaries
- `identity` - Identity documents
- `passport` - Passport documents
- `license` - Driver/Professional licenses
- `insurance` - Insurance documents
- `medical` - Medical records
- `financial` - Financial statements
- `legal` - Legal documents

**Parameters:**
- `doc` (object): Document object
- `options` (object):
  - `threshold` (number): Minimum confidence 0-1

**Returns:** Classification results

```javascript
const classification = await processor.classifyDocument(doc);

console.log(`Type: ${classification.type}`);
console.log(`Confidence: ${(classification.confidence * 100).toFixed(1)}%`);

console.log('Type scores:');
Object.entries(classification.scores).forEach(([type, score]) => {
  console.log(`  ${type}: ${(score * 100).toFixed(1)}%`);
});

console.log('Metadata:');
console.log(`  Pages: ${classification.metadata.pageCount}`);
console.log(`  Has images: ${classification.metadata.hasImages}`);
console.log(`  Has tables: ${classification.metadata.hasTables}`);
console.log(`  Has forms: ${classification.metadata.hasForms}`);
```

### Information Extraction

#### `extractInformation(doc, options)`

Extract entities and structured information.

**Extracted Entities:**
- `names` - Person and organization names
- `emails` - Email addresses
- `phones` - Phone numbers
- `addresses` - Physical addresses
- `dates` - Dates and date ranges
- `currency` - Currency amounts
- `urls` - URLs and links
- `keyValuePairs` - Label-value pairs
- `summary` - Document summary

**Parameters:**
- `doc` (object): Document object
- `options` (object):
  - `summaryLength` (number): Summary length in characters (default: 200)
  - `entityTypes` (array): Specific entities to extract

**Returns:** Extracted information

```javascript
const extracted = await processor.extractInformation(doc, {
  summaryLength: 300
});

console.log('Entities:');
console.log(`  Names: ${extracted.entities.names.join(', ')}`);
console.log(`  Emails: ${extracted.entities.emails.join(', ')}`);
console.log(`  Phones: ${extracted.entities.phones.join(', ')}`);
console.log(`  Addresses: ${extracted.entities.addresses.join(', ')}`);
console.log(`  Dates: ${extracted.entities.dates.join(', ')}`);
console.log(`  Currency: ${extracted.entities.currency.join(', ')}`);

console.log('\nKey-Value Pairs:');
Object.entries(extracted.keyValuePairs).forEach(([key, value]) => {
  console.log(`  ${key}: ${value}`);
});

console.log(`\nSummary:\n${extracted.summary}`);
console.log(`\nConfidence: ${(extracted.confidence * 100).toFixed(1)}%`);
```

### Quality & Validation

#### `assessDocumentQuality(doc, options)`

Assess document quality across multiple dimensions.

**Quality Metrics:**
- `readability` - Text readability (0-100)
- `contrast` - Image contrast (0-100)
- `skew` - Page orientation correction (0-100)
- `blur` - Sharpness/blur assessment (0-100)
- `noise` - Noise levels (0-100)
- `completeness` - Document completeness (0-100)

**Parameters:**
- `doc` (object): Document object
- `options` (object):
  - `detailed` (boolean): Detailed scoring per page

**Returns:** Quality assessment

```javascript
const quality = await processor.assessDocumentQuality(doc);

console.log(`Overall Quality: ${quality.overallScore}/100`);

console.log('Metrics:');
console.log(`  Readability: ${quality.scores.readability}`);
console.log(`  Contrast: ${quality.scores.contrast}`);
console.log(`  Skew: ${quality.scores.skew}`);
console.log(`  Blur: ${quality.scores.blur}`);
console.log(`  Noise: ${quality.scores.noise}`);

if (quality.issues.length > 0) {
  console.log('\nIssues:');
  quality.issues.forEach(issue => console.log(`  - ${issue}`));
}

if (quality.recommendations.length > 0) {
  console.log('\nRecommendations:');
  quality.recommendations.forEach(rec => console.log(`  - ${rec}`));
}
```

#### `validateDocument(doc, options)`

Validate document integrity and completeness.

**Checks:**
- File integrity
- Format validation
- Page structure
- Text extraction
- Metadata consistency

**Parameters:**
- `doc` (object): Document object
- `options` (object):
  - `strict` (boolean): Strict validation mode

**Returns:** Validation results

```javascript
const validation = await processor.validateDocument(doc);

console.log(`Valid: ${validation.valid}`);

if (!validation.valid) {
  console.log('Errors:');
  validation.errors.forEach(err => console.log(`  - ${err}`));
}

if (validation.warnings.length > 0) {
  console.log('Warnings:');
  validation.warnings.forEach(warn => console.log(`  - ${warn}`));
}

console.log(`Checks performed: ${validation.checksPerformed.join(', ')}`);
```

### Batch Processing

#### `batchProcess(documents, operations, options)`

Process multiple documents efficiently.

**Operations:**
- `load` - Load document
- `parse` - Parse structure
- `ocr` - Perform OCR
- `tables` - Extract tables
- `forms` - Extract forms
- `signatures` - Detect signatures
- `classify` - Classify type
- `extract` - Extract information

**Parameters:**
- `documents` (array): Array of document sources
- `operations` (array): Operations to perform
- `options` (object):
  - `concurrency` (number): Concurrent operations (default: 1)
  - `skipErrors` (boolean): Continue on errors (default: true)

**Returns:** Batch processing results

```javascript
const documents = [
  { source: './doc1.pdf', options: { filename: 'doc1.pdf' } },
  { source: './doc2.pdf', options: { filename: 'doc2.pdf' } },
  { source: './doc3.pdf', options: { filename: 'doc3.pdf' } },
];

const results = await processor.batchProcess(documents, 
  ['load', 'parse', 'ocr', 'classify'],
  { concurrency: 2 }
);

console.log(`Total: ${results.totalDocuments}`);
console.log(`Successful: ${results.successCount}`);
console.log(`Failed: ${results.failureCount}`);
console.log(`Time: ${(results.processingTime / 1000).toFixed(2)}s`);

results.results.forEach(result => {
  if (result.success) {
    console.log(`✓ ${result.documentId}`);
  } else {
    console.log(`✗ ${result.documentId}: ${result.error}`);
  }
});
```

## Supported Formats

### PDF Formats
- `pdf` - Portable Document Format

### Image Formats
- `jpg`, `jpeg` - JPEG images
- `png` - PNG images
- `tiff`, `tif` - TIFF images
- `bmp` - Bitmap images
- `webp` - WebP images

## Document Types

```javascript
processor.DOCUMENT_TYPES = {
  INVOICE: 'invoice',
  RECEIPT: 'receipt',
  CONTRACT: 'contract',
  FORM: 'form',
  REPORT: 'report',
  IDENTITY: 'identity',
  PASSPORT: 'passport',
  LICENSE: 'license',
  INSURANCE: 'insurance',
  MEDICAL: 'medical',
  FINANCIAL: 'financial',
  LEGAL: 'legal',
  UNKNOWN: 'unknown',
};
```

## Error Handling

```javascript
try {
  const doc = await processor.loadDocument('./document.pdf');
  await processor.parseDocument(doc);
  const classification = await processor.classifyDocument(doc);
} catch (error) {
  console.error(`Processing error: ${error.message}`);
  
  if (error.message.includes('Unsupported format')) {
    // Handle format error
  } else if (error.message.includes('Failed to parse')) {
    // Handle parse error
  }
}
```

## Performance Tips

1. **Batch Processing**: Use `batchProcess()` for multiple documents
2. **Selective Processing**: Only run needed operations
3. **Page Ranges**: Process specific pages when possible
4. **Concurrency**: Adjust concurrency based on system resources
5. **Memory**: Large documents may require streaming

## Examples

See `document-processor-integration-example.js` for:
1. Invoice processing workflow
2. Form completion verification
3. Batch document classification
4. Contract analysis
5. Medical document extraction
6. Identity document verification
7. Scan quality assessment
8. Multi-page segmentation
9. Results export
10. Robust error handling

## Constants

```javascript
processor.SUPPORTED_FORMATS  // All supported formats
processor.PDF_FORMATS         // PDF formats
processor.IMAGE_FORMATS       // Image formats
processor.DOCUMENT_TYPES      // Document type constants
```

## License

AGPL-3.0-or-later AND CC-BY-SA-4.0
