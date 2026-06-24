---
name: "document-processing"
description: "Document processing: extract structured data from PDF, DOCX, XLSX, PPTX files, parse tables, convert formats, handle OCR for scanned documents, and build document pipelines"
---

# Document Processing — Multi-Format Extraction

## When to activate
- User needs to extract text, tables, or metadata from PDF, Word, Excel, or PowerPoint files
- Converting documents between formats (PDF → Markdown, DOCX → HTML, XLSX → JSON)
- Parsing structured data from invoices, reports, contracts, or spreadsheets
- Building document processing pipelines (batch convert, extract, transform)
- Handling scanned documents that require OCR
- Analyzing document structure (headings, sections, footnotes, references)

## When NOT to use
- Plain text or Markdown files that don't need parsing
- Simple CSV files (use standard file reading)
- When the document content is already available in structured format
- Real-time document editing (this is for extraction/processing, not live editing)

## Instructions

### 1. Format Detection & Tool Selection

| Format | Primary Tool | Fallback | Best for |
|--------|-------------|----------|----------|
| **PDF (text)** | `pdfplumber` (Python) | `pdftotext` CLI | Text extraction, table detection |
| **PDF (scanned)** | `pytesseract` + `pdf2image` | `ocrmypdf` CLI | OCR on scanned pages |
| **DOCX** | `python-docx` | `pandoc` CLI | Text, tables, styles, images |
| **XLSX** | `openpyxl` | `pandas` | Spreadsheets, formulas, charts data |
| **PPTX** | `python-pptx` | `pandoc` CLI | Slides, notes, embedded media |

### 2. PDF Processing

```python
import pdfplumber

def extract_pdf(path: str) -> dict:
    """Extract text, tables, and metadata from a PDF."""
    result = {"pages": [], "tables": [], "metadata": {}}
    
    with pdfplumber.open(path) as pdf:
        result["metadata"] = {
            "pages": len(pdf.pages),
            "title": pdf.metadata.get("Title", ""),
            "author": pdf.metadata.get("Author", ""),
        }
        
        for i, page in enumerate(pdf.pages):
            # Extract text
            text = page.extract_text()
            result["pages"].append({"page": i + 1, "text": text})
            
            # Extract tables
            tables = page.extract_tables()
            for table in tables:
                result["tables"].append({
                    "page": i + 1,
                    "headers": table[0],
                    "rows": table[1:],
                })
    
    return result
```

**For scanned PDFs (OCR):**
```python
from pdf2image import convert_from_path
import pytesseract

def ocr_pdf(path: str, lang: str = "eng") -> str:
    """OCR a scanned PDF to text."""
    images = convert_from_path(path, dpi=300)
    text_parts = []
    for i, img in enumerate(images):
        text = pytesseract.image_to_string(img, lang=lang)
        text_parts.append(f"--- Page {i+1} ---\n{text}")
    return "\n\n".join(text_parts)
```

### 3. DOCX Processing

```python
from docx import Document

def extract_docx(path: str) -> dict:
    """Extract paragraphs, tables, and styles from a Word document."""
    doc = Document(path)
    result = {"paragraphs": [], "tables": [], "headings": []}
    
    for para in doc.paragraphs:
        entry = {
            "text": para.text,
            "style": para.style.name,  # "Heading 1", "Normal", etc.
            "bold": any(run.bold for run in para.runs),
        }
        result["paragraphs"].append(entry)
        
        if para.style.name.startswith("Heading"):
            result["headings"].append({
                "level": int(para.style.name.split()[-1]),
                "text": para.text,
            })
    
    for table in doc.tables:
        rows = [[cell.text for cell in row.cells] for row in table.rows]
        result["tables"].append({"headers": rows[0], "rows": rows[1:]})
    
    return result
```

### 4. XLSX Processing

```python
import openpyxl

def extract_xlsx(path: str) -> dict:
    """Extract all sheets from an Excel workbook."""
    wb = openpyxl.load_workbook(path, data_only=True)
    result = {"sheets": {}}
    
    for sheet_name in wb.sheetnames:
        ws = wb[sheet_name]
        rows = list(ws.iter_rows(values_only=True))
        
        result["sheets"][sheet_name] = {
            "headers": [str(h) for h in rows[0] if h],
            "rows": [
                [str(cell) if cell is not None else "" for cell in row]
                for row in rows[1:]
            ],
            "row_count": len(rows) - 1,
            "col_count": ws.max_column,
        }
    
    return result
```

### 5. Format Conversion

```bash
# PDF → Markdown (preserving structure)
pandoc input.pdf -t markdown -o output.md

# DOCX → HTML (with styles)
pandoc input.docx -t html --standalone -o output.html

# DOCX → Markdown
pandoc input.docx -t markdown -o output.md

# Markdown → PDF (with template)
pandoc input.md --pdf-engine=xelatex --template=template.tex -o output.pdf

# XLSX → CSV (first sheet)
python -c "import pandas; pandas.read_excel('input.xlsx').to_csv('output.csv', index=False)"
```

### 6. Document Pipeline

```yaml
pipeline:
  name: "invoice-processor"
  steps:
    - name: "extract"
      action: "ocr_pdf"
      config: {lang: "eng", dpi: 300}
      
    - name: "parse"
      action: "regex_extract"
      fields:
        invoice_number: 'Invoice\s*#\s*(\w+)'
        date: 'Date:\s*(\d{4}-\d{2}-\d{2})'
        total: 'Total:\s*\$?([\d,]+\.\d{2})'
        vendor: '(?:From|Vendor):\s*(.+)'
        
    - name: "validate"
      action: "schema_check"
      required: ["invoice_number", "date", "total"]
      
    - name: "transform"
      action: "to_json"
      output: "processed/invoice-{invoice_number}.json"
```

## Example

**Extracting and converting a quarterly report:**

```
User: "Process quarterly-report-Q1.pdf — extract the executive summary,
       all financial tables, and convert the whole thing to Markdown"

Agent:
1. Extract text from all 24 pages with pdfplumber
2. Identify executive summary (pages 1-3, under "Executive Summary" heading)
3. Extract 4 financial tables (pages 8, 12, 15, 19) with headers and data
4. Convert full document to Markdown via pandoc
5. Output:
   - executive-summary.md (3 pages of text)
   - financial-tables.json (4 tables as structured data)
   - quarterly-report-Q1-full.md (complete Markdown conversion)
```

## Anti-Patterns

- **Ignoring scan quality:** Running OCR on a 72 DPI scan produces gibberish — always use 300+ DPI for scanned documents
- **Losing table structure:** Extracting PDF text line-by-line destroys table alignment — use table-specific extraction (pdfplumber, tabula)
- **No validation:** Extracting data without validating against expected schemas — always check required fields and data types
- **Encoding issues:** Not handling Unicode, special characters, or non-Latin scripts — set explicit encoding on all read/write operations
- **Large file memory:** Loading a 500-page PDF entirely into memory — process page-by-page with streaming for large documents
- **Ignoring metadata:** PDFs contain creation date, author, revision history — extract metadata for document management workflows
