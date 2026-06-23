# Document Processor - Quick Reference

## One-Minute Setup

```javascript
const processor = require('./document-processor');

// Load → Parse → Process
const doc = await processor.loadDocument('./document.pdf');
await processor.parseDocument(doc);
const results = await processor.classifyDocument(doc);
```

## Most Common Operations

### 1. Load & Classify
```javascript
const doc = await processor.loadDocument(path);
await processor.parseDocument(doc);
const type = await processor.classifyDocument(doc);
console.log(`Document is: ${type.type}`);
```

### 2. Extract Text
```javascript
const doc = await processor.loadDocument(path);
await processor.parseDocument(doc);
const ocr = await processor.performOCR(doc);
const text = await processor.extractText(doc);
```

### 3. Extract Tables
```javascript
const tables = await processor.extractTables(doc, {
  format: 'csv' // or 'json', 'markdown'
});
```

### 4. Extract Information
```javascript
const info = await processor.extractInformation(doc);
// Names, emails, phones, addresses, dates, currency
```

### 5. Check Form Completion
```javascript
const form = await processor.extractFormData(doc);
console.log(`Completion: ${form.completionPercentage}%`);
```

### 6. Detect Signatures
```javascript
const sigs = await processor.detectSignatures(doc);
console.log(`Signed: ${sigs.allSigned}`);
```

### 7. Assess Quality
```javascript
const quality = await processor.assessDocumentQuality(doc);
console.log(`Score: ${quality.overallScore}/100`);
```

### 8. Validate Document
```javascript
const valid = await processor.validateDocument(doc);
console.log(`Valid: ${valid.valid}`);
```

### 9. Batch Process
```javascript
const results = await processor.batchProcess(docs, 
  ['load', 'parse', 'ocr', 'classify']
);
```

### 10. Export Results
```javascript
const extracted = await processor.extractInformation(doc);
await fs.writeFile('results.json', JSON.stringify(extracted));
```

## Common Patterns

### Invoice Processing
```javascript
async function processInvoice(path) {
  const doc = await processor.loadDocument(path);
  await processor.parseDocument(doc);
  const classify = await processor.classifyDocument(doc);
  const tables = await processor.extractTables(doc);
  const info = await processor.extractInformation(doc);
  return { classify, tables, info };
}
```

### Document Quality Check
```javascript
async function checkQuality(path) {
  const doc = await processor.loadDocument(path);
  await processor.parseDocument(doc);
  const quality = await processor.assessDocumentQuality(doc);
  return quality.overallScore > 70 ? 'PASS' : 'FAIL';
}
```

### Batch Classification
```javascript
async function classifyMany(paths) {
  const docs = await Promise.all(
    paths.map(p => processor.loadDocument(p))
  );
  return await Promise.all(
    docs.map(doc => {
      processor.parseDocument(doc);
      return processor.classifyDocument(doc);
    })
  );
}
```

## Supported Formats

| Format | Extension | Type |
|--------|-----------|------|
| PDF | .pdf | Document |
| JPEG | .jpg, .jpeg | Image |
| PNG | .png | Image |
| TIFF | .tiff, .tif | Image |
| BMP | .bmp | Image |
| WebP | .webp | Image |

## Document Types

```
invoice    - Sales documents, bills
receipt    - Purchase receipts
contract   - Legal agreements
form       - Forms, applications
report     - Reports, summaries
identity   - ID documents
passport   - Travel documents
license    - Driver/Professional licenses
insurance  - Insurance documents
medical    - Medical records
financial  - Financial statements
legal      - Legal documents
```

## Confidence Levels

| Range | Meaning |
|-------|---------|
| 0.9-1.0 | Excellent (very confident) |
| 0.8-0.9 | Good (confident) |
| 0.7-0.8 | Fair (reasonably confident) |
| 0.6-0.7 | Poor (somewhat uncertain) |
| <0.6 | Very Poor (unreliable) |

## Quality Scores

| Score | Assessment |
|-------|------------|
| 80-100 | Excellent |
| 60-80 | Good |
| 40-60 | Fair |
| 20-40 | Poor |
| 0-20 | Very Poor |

## Returned Document Object

```javascript
{
  id: 'doc_timestamp_random',
  filename: 'name.pdf',
  format: 'pdf',
  buffer: Buffer,
  size: 125440,
  processed: true,
  pages: [
    {
      number: 1,
      width: 612,
      height: 792,
      text: 'extracted text',
      tables: [],
      forms: [],
      signatures: [],
      ocrData: {
        confidence: 0.92,
        quality: 85,
        skewAngle: 1.2
      }
    }
  ]
}
```

## Error Handling

```javascript
try {
  const doc = await processor.loadDocument(path);
  await processor.parseDocument(doc);
} catch (error) {
  console.error(error.message);
  // Handle: Unsupported format, File not found, Parse error
}
```

## Performance Tips

1. Use batch processing for multiple documents
2. Set appropriate `minConfidence` to skip low-quality results
3. Use `pages` option to process specific pages only
4. Adjust `concurrency` based on available memory
5. Cache parsed documents if reprocessing needed
6. Use `strictMode` in table detection for fewer false positives

## Key Constants

```javascript
processor.DOCUMENT_TYPES.INVOICE
processor.DOCUMENT_TYPES.CONTRACT
processor.SUPPORTED_FORMATS  // All formats
processor.PDF_FORMATS        // PDF only
processor.IMAGE_FORMATS      // Images only
```

## Batch Processing Config

```javascript
{
  concurrency: 1,        // Number of parallel operations
  skipErrors: true,      // Continue on error
  timeout: 30000,        // ms per document
  retries: 1             // Retry failed documents
}
```

## Result Export

```javascript
// Export as JSON
JSON.stringify(results, null, 2);

// Export as CSV
results.tables[0].csv;

// Export as Markdown
results.tables[0].markdown;

// Export to file
fs.writeFileSync(path, JSON.stringify(results));
```

## Testing

```bash
# Run all tests
node lib/document-processor.test.js

# Run specific test
node -e "require('./document-processor.test.js')" | grep "should extract text"
```

## Common Gotchas

1. **PDF files are complex** - Use OCR for image-based PDFs
2. **Quality matters** - Check quality score before processing
3. **Tables need structure** - Use `strictMode` for reliable detection
4. **Forms need boundaries** - Ensure form fields have clear regions
5. **Confidence varies** - Set appropriate thresholds for your use case

## Integration Examples File

See `document-processor-integration-example.js` for:
- Invoice processing workflow
- Form completion verification
- Batch classification
- Contract analysis
- Medical extraction
- Identity verification
- Quality assessment
- Segmentation
- Export
- Error handling with retry

## Documentation

- **Full API**: `DOCUMENT_PROCESSOR_README.md`
- **Examples**: `document-processor-integration-example.js`
- **Tests**: `document-processor.test.js`
- **Deliverables**: `DOCUMENT_PROCESSOR_DELIVERABLES.md`

## Support

For issues:
1. Check document quality (`assessDocumentQuality`)
2. Validate document (`validateDocument`)
3. Review error message in exception
4. See troubleshooting in full README
5. Check test cases for examples

## Getting Started

```javascript
const processor = require('./document-processor');

async function start() {
  // 1. Load
  const doc = await processor.loadDocument('./sample.pdf');
  
  // 2. Parse
  await processor.parseDocument(doc);
  
  // 3. Process (choose one or more)
  const ocr = await processor.performOCR(doc);
  const type = await processor.classifyDocument(doc);
  const info = await processor.extractInformation(doc);
  const tables = await processor.extractTables(doc);
  const forms = await processor.extractFormData(doc);
  const sigs = await processor.detectSignatures(doc);
  const quality = await processor.assessDocumentQuality(doc);
  
  // 4. Use results
  console.log({ type, info, tables, forms, sigs, quality });
}

start().catch(console.error);
```

---

**Last Updated**: 2026-06-22  
**Version**: 1.0.0  
**Status**: Production Ready
