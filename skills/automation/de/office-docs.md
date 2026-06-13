---
name: office-docs
description: "Generate PPTX presentations, DOCX reports, and XLSX spreadsheets from structured data — using python-pptx, python-docx, and openpyxl without requiring Microsoft Office"
---

# Office Docs Skill

## Wann aktivieren
- Generating a PowerPoint presentation from structured content or data
- Creating a Word document report from a template or data source
- Building an Excel spreadsheet with formatted data, formulas, and charts
- Automating document generation in a CI/CD or data pipeline
- Converting markdown or structured data to professional Office documents

## Wann NICHT verwenden
- Simple PDF generation — use a PDF library (WeasyPrint, reportlab)
- Google Slides/Docs — use the Google Workspace MCP
- Interactive dashboards — use a BI tool (Metabase, Grafana)
- Real-time collaborative editing — use Google Workspace or Office 365 directly

## Anweisungen

### PowerPoint presentation (python-pptx)

```python
Install: pip install python-pptx

Generate a PPTX presentation for [topic].

Topic: [describe]
Slides: [list slide titles and key points]
Style: [corporate / minimal / dark / branded]

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

def create_presentation(title: str, slides: list[dict], output_path: str):
    prs = Presentation()
    
    # Set slide dimensions (16:9)
    prs.slide_width = Inches(13.33)
    prs.slide_height = Inches(7.5)
    
    # Title slide
    slide_layout = prs.slide_layouts[0]  # Title Slide layout
    slide = prs.slides.add_slide(slide_layout)
    slide.shapes.title.text = title
    slide.placeholders[1].text = "Prepared by [Name] · [Date]"
    
    # Content slides
    for slide_data in slides:
        layout = prs.slide_layouts[1]  # Title and Content
        slide = prs.slides.add_slide(layout)
        slide.shapes.title.text = slide_data["title"]
        
        tf = slide.placeholders[1].text_frame
        tf.clear()
        
        for i, bullet in enumerate(slide_data.get("bullets", [])):
            p = tf.add_paragraph() if i > 0 else tf.paragraphs[0]
            p.text = bullet
            p.level = 0
            p.font.size = Pt(18)
    
    prs.save(output_path)
    print(f"Saved: {output_path}")

# Usage
create_presentation(
    title="Q3 2026 Business Review",
    slides=[
        {"title": "Revenue", "bullets": ["ARR: $4.2M (+28% QoQ)", "NRR: 104%", "CAC Payback: 11 months"]},
        {"title": "Product", "bullets": ["Shipped 3 major features", "Activation rate: 62% (+8pp)", "NPS: 47"]},
    ],
    output_path="output/q3-review.pptx"
)
```

### Word document (python-docx)

```python
Install: pip install python-docx

Generate a DOCX report for [type].

Type: [technical report / executive summary / proposal / documentation]
Sections: [list sections and content]

from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn

def create_report(title: str, sections: list[dict], output_path: str):
    doc = Document()
    
    # Title
    title_para = doc.add_heading(title, level=0)
    title_para.alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    # Metadata
    doc.add_paragraph(f"Date: {__import__('datetime').date.today()}")
    doc.add_paragraph()
    
    for section in sections:
        # Section heading
        doc.add_heading(section["heading"], level=1)
        
        # Body text
        for paragraph in section.get("paragraphs", []):
            doc.add_paragraph(paragraph)
        
        # Table if present
        if "table" in section:
            headers = section["table"]["headers"]
            rows = section["table"]["rows"]
            
            table = doc.add_table(rows=1, cols=len(headers))
            table.style = "Light Grid Accent 1"
            
            # Header row
            hdr_cells = table.rows[0].cells
            for i, header in enumerate(headers):
                hdr_cells[i].text = header
                hdr_cells[i].paragraphs[0].runs[0].bold = True
            
            # Data rows
            for row_data in rows:
                row_cells = table.add_row().cells
                for i, cell_text in enumerate(row_data):
                    row_cells[i].text = str(cell_text)
        
        doc.add_paragraph()  # spacer
    
    doc.save(output_path)
    print(f"Saved: {output_path}")
```

### Excel spreadsheet (openpyxl)

```python
Install: pip install openpyxl

Generate an XLSX spreadsheet for [purpose].

Purpose: [financial model / data export / dashboard / report]
Sheets: [list sheets and data]

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.chart import BarChart, Reference

def create_spreadsheet(data: dict, output_path: str):
    wb = openpyxl.Workbook()
    
    for sheet_name, sheet_data in data.items():
        ws = wb.create_sheet(title=sheet_name)
        
        headers = sheet_data["headers"]
        rows = sheet_data["rows"]
        
        # Header row with styling
        header_fill = PatternFill("solid", fgColor="F97316")  # Orange
        header_font = Font(bold=True, color="FFFFFF")
        
        for col, header in enumerate(headers, 1):
            cell = ws.cell(row=1, column=col, value=header)
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = Alignment(horizontal="center")
        
        # Data rows
        for row_idx, row in enumerate(rows, 2):
            for col_idx, value in enumerate(row, 1):
                ws.cell(row=row_idx, column=col_idx, value=value)
        
        # Auto-fit column widths
        for col in ws.columns:
            max_length = max(len(str(cell.value or "")) for cell in col)
            ws.column_dimensions[get_column_letter(col[0].column)].width = min(max_length + 2, 50)
        
        # Add formula row if numeric data
        if sheet_data.get("totals"):
            total_row = len(rows) + 2
            for col_idx, (header, formula) in enumerate(sheet_data["totals"].items(), 1):
                cell = ws.cell(row=total_row, column=col_idx, value=formula)
                cell.font = Font(bold=True)
    
    # Remove default empty sheet
    if "Sheet" in wb.sheetnames:
        del wb["Sheet"]
    
    wb.save(output_path)
    print(f"Saved: {output_path}")

# Usage
create_spreadsheet({
    "Revenue": {
        "headers": ["Month", "ARR ($K)", "New ARR ($K)", "Churn ($K)"],
        "rows": [
            ["Jan 2026", 3200, 280, 45],
            ["Feb 2026", 3435, 300, 65],
            ["Mar 2026", 3670, 290, 55],
        ],
        "totals": {"Month": "TOTAL", "ARR ($K)": None, "New ARR ($K)": "=SUM(C2:C4)", "Churn ($K)": "=SUM(D2:D4)"}
    }
}, "output/revenue-report.xlsx")
```

## Beispiel

**User:** I need to generate a monthly board report as a DOCX from our metrics data.

**Claude's approach:**

```python
from docx import Document
from docx.shared import Pt
import datetime

def generate_board_report(metrics: dict, output_path: str):
    doc = Document()
    doc.add_heading("Monthly Board Report", 0)
    doc.add_paragraph(f"Period: {metrics['period']} · Generated: {datetime.date.today()}")
    
    # Executive summary
    doc.add_heading("Executive Summary", 1)
    doc.add_paragraph(
        f"ARR reached ${metrics['arr']:,.0f} ({metrics['arr_growth']:+.0f}% MoM). "
        f"NRR at {metrics['nrr']}%. Runway: {metrics['runway']} months."
    )
    
    # Key metrics table
    doc.add_heading("Key Metrics", 1)
    table = doc.add_table(rows=1, cols=3)
    table.style = "Light Grid Accent 1"
    table.rows[0].cells[0].text = "Metric"
    table.rows[0].cells[1].text = "This Month"
    table.rows[0].cells[2].text = "Last Month"
    
    for metric, current, previous in metrics["table_data"]:
        row = table.add_row()
        row.cells[0].text = metric
        row.cells[1].text = str(current)
        row.cells[2].text = str(previous)
    
    doc.save(output_path)

generate_board_report({
    "period": "May 2026",
    "arr": 4200000, "arr_growth": 8.1,
    "nrr": 104, "runway": 14,
    "table_data": [
        ("ARR", "$4.2M", "$3.9M"),
        ("NRR", "104%", "108%"),
        ("New Customers", "12", "9"),
    ]
}, "board-report-may-2026.docx")
```

---
