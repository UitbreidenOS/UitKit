# Vision and Multimodal Workflows in Claude Code

Claude can analyze images, PDFs, screenshots, and diagrams as first-class inputs alongside text. This guide covers how to get visual content into Claude Code, what Claude can extract from it, and end-to-end workflows that combine vision with code generation and automated fixes.

---

## What Claude Can See

Claude supports four image formats:

| Format | Notes |
|---|---|
| PNG | Lossless. Best for screenshots, diagrams, UI captures |
| JPEG / JPG | Lossy. Acceptable for photos; avoid for text-heavy images |
| GIF | Static frame only — Claude reads the first frame, not animation |
| WebP | Supported. Both lossless and lossy variants |

**PDFs** are processed as images — each page is rendered and analyzed visually. Claude does not parse PDF text streams; it reads what is visible on the rendered page. This means it can handle scanned PDFs, handwritten documents, and mixed-content PDFs the same way it handles images.

**Screenshots** are the most common multimodal input in Claude Code workflows. They require no format conversion — drag from any screenshot tool, or pipe from a capture script.

Claude cannot process:
- Video files (no frame extraction, no motion analysis)
- Real-time camera feeds
- Audio embedded in media files
- Animated GIF frames beyond the first

---

## Passing Images to Claude Code

### Drag and Drop in the Terminal

In terminals that support image rendering (iTerm2, Ghostty, Warp, Kitty), drag an image file from Finder directly into the terminal window where Claude is running. The image is attached to the current turn.

```
# macOS — drag any file from Finder into the Claude Code terminal session
# The image appears as an attachment before your typed message
```

### Paste from Clipboard

Claude Code reads clipboard images when you paste (`Cmd+V` on macOS, `Ctrl+V` on Linux). After taking a screenshot with `Cmd+Shift+4` (macOS selection screenshot) or `PrintScreen`, paste directly into the Claude Code terminal. The image is captured from the clipboard and attached to the current message.

```bash
# Capture a region and paste it into Claude
# macOS: Cmd+Shift+4 → select region → Cmd+V in Claude terminal
```

### Reference a File Path

Provide an absolute file path in your message and Claude Code reads the file:

```
Analyze the image at /tmp/error-screenshot.png. What is the root cause of the error shown?
```

This works without drag-and-drop in terminals that do not render images — Claude Code reads the file from disk when given a path.

### Programmatic Input via API

When calling the Claude API directly, images are passed as structured content blocks. Two source types are supported:

**Base64 (inline):**
```json
{
  "role": "user",
  "content": [
    {
      "type": "image",
      "source": {
        "type": "base64",
        "media_type": "image/png",
        "data": "<base64-encoded-bytes>"
      }
    },
    {
      "type": "text",
      "text": "What UI components are visible in this screenshot?"
    }
  ]
}
```

**URL (remote fetch):**
```json
{
  "role": "user",
  "content": [
    {
      "type": "image",
      "source": {
        "type": "url",
        "url": "https://example.com/diagram.png"
      }
    },
    {
      "type": "text",
      "text": "Convert this architecture diagram to Terraform."
    }
  ]
}
```

Use base64 for images that are not publicly accessible (local files, internal screenshots, CI artifacts). Use URL source for images already hosted and reachable from Anthropic's servers. Do not pass private internal URLs as URL source — they will fail silently or return a fetch error.

**Python helper for base64 encoding:**
```python
import anthropic
import base64
from pathlib import Path

def image_to_message(path: str, prompt: str) -> dict:
    data = base64.standard_b64encode(Path(path).read_bytes()).decode("utf-8")
    ext = Path(path).suffix.lstrip(".")
    media_type = {"png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg",
                  "gif": "image/gif", "webp": "image/webp"}[ext]
    return {
        "role": "user",
        "content": [
            {"type": "image", "source": {"type": "base64", "media_type": media_type, "data": data}},
            {"type": "text", "text": prompt}
        ]
    }

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[image_to_message("/tmp/screenshot.png", "Identify all form fields visible.")]
)
```

---

## Image Size Limits and Constraints

| Constraint | Value |
|---|---|
| Max file size | 5 MB per image |
| Recommended max dimension | 1568 × 1568 px |
| Absolute max dimension | ~8000 px on the long edge (internally downscaled) |
| Max images per request | 20 (API); no enforced limit in Claude Code sessions |

Images larger than 1568 × 1568 px are downscaled before processing. The model sees the downscaled version, not the original. For images with dense small text (receipts, data tables, technical diagrams), keep the resolution close to 1568 px on the long edge to preserve legibility. Sending a 4K screenshot does not improve accuracy — it just increases base64 payload size and network transfer time.

Downscale before sending when images exceed the limit:

```bash
# macOS ImageMagick — resize to fit within 1568x1568, preserve aspect ratio
magick input.png -resize '1568x1568>' output.png

# Or with sips (no install required on macOS)
sips --resampleHeightWidthMax 1568 input.png --out output.png
```

---

## Token Cost of Images

Images do not have a variable token cost that scales with pixel count. The cost is approximately fixed per image regardless of resolution (within the supported range):

| Model | Cost per image (approx.) |
|---|---|
| Claude Haiku | ~1500 tokens |
| Claude Sonnet | ~1500–1600 tokens |
| Claude Opus | ~1600–2000 tokens |

A 200 × 200 px thumbnail costs roughly the same as a 1568 × 1568 px diagram. This means:
- Do not send multiple small crops when one full image is clearer
- Do not assume smaller images are cheaper
- For multi-image workflows (e.g., 10 screenshots), estimate ~15,000–20,000 tokens of image overhead before any text

PDFs cost approximately 1500–2000 tokens per page rendered, using the same fixed-cost model.

---

## Use Case 1: UI/UX Review and Accessibility Audit

Paste a screenshot of any UI and ask Claude to identify accessibility issues, layout problems, or design inconsistencies.

**Prompt pattern:**
```
I'm pasting a screenshot of our login page.

1. List every WCAG 2.1 AA violation you can identify — focus on color contrast, missing labels, and keyboard focus indicators.
2. For each violation, cite the specific WCAG success criterion (e.g., 1.4.3 Contrast Minimum).
3. Suggest the minimum code change that fixes each issue.
```

**What this catches without a browser:** missing `aria-label` on icon buttons, low contrast text over background images, form fields with no visible label association, touch targets smaller than 44 × 44 px, placeholder text used as a label substitute.

For systematic review, capture screenshots at multiple viewport widths and pass them in a single turn:

```python
viewports = [375, 768, 1280]  # mobile, tablet, desktop
screenshots = [f"/tmp/ui-{w}.png" for w in viewports]

content = []
for path in screenshots:
    data = base64.standard_b64encode(Path(path).read_bytes()).decode("utf-8")
    content.append({"type": "image", "source": {"type": "base64", "media_type": "image/png", "data": data}})

content.append({"type": "text", "text": "Compare these three viewport screenshots. Identify layout breaks and accessibility issues at each width. Group findings by viewport."})
```

---

## Use Case 2: OCR — Text Extraction from Images

Claude extracts text from scanned documents, photos of whiteboards, receipts, business cards, and handwritten notes. Unlike traditional OCR tools, Claude understands context — it can extract structured data from unstructured visual layouts.

**Receipts and invoices:**
```
Extract all line items from this receipt. Return a JSON array with fields:
- description (string)
- quantity (number)
- unit_price (number)
- total (number)

Also include: vendor_name, date, subtotal, tax, total_amount.
```

**Whiteboard notes:**
```
Transcribe everything written on this whiteboard. Preserve the structure — if items are in a list, format them as a list. If there are diagrams with labels, describe the diagram and extract the labels.
```

**Handwritten forms:**
```
Extract all filled-in values from this form. Return a key-value mapping where the key is the field label printed on the form and the value is what was written in.
```

Limitations: Claude cannot reliably read text smaller than approximately 8–10pt equivalent at 1568 px resolution. Watermarks, overlapping text, and heavily degraded scans reduce accuracy. For critical OCR tasks (legal documents, financial records), validate extracted values against expected patterns.

---

## Use Case 3: Diagram-to-Code — Architecture Diagrams to Infrastructure

Pass an architecture diagram (hand-drawn, Lucidchart export, or whiteboard photo) and ask Claude to generate the corresponding infrastructure code.

**Prompt:**
```
This is an architecture diagram for our application. Generate a Terraform module that provisions every resource shown. 

Requirements:
- Use AWS provider
- Use variables for environment-specific values (region, instance types, CIDR blocks)
- Add outputs for all resource IDs and ARNs that downstream modules would need
- Follow the naming convention shown in the diagram labels
```

**What Claude infers from diagrams:**
- VPC boundaries and subnet layouts
- Load balancer → target group → instance relationships
- Database replica configurations
- Security group boundaries (dashed lines or color coding)
- Service names and instance types if labeled

For complex diagrams with overlapping elements, add a prompt hint: "Focus on the solid arrows — they represent network traffic flow. Dashed lines represent management access."

---

## Use Case 4: Error Debugging from UI Screenshots

When a bug manifests visually (unexpected layout, a broken state, an error modal), screenshot it and pass it to Claude with the relevant code.

**Prompt:**
```
This screenshot shows the error state our users see when checkout fails. 

Given this screenshot and the error handler below, identify:
1. What triggered this state
2. Why the error message is cut off at the bottom
3. What CSS or state management change fixes the overflow

[paste error handler code]
```

Claude correlates what it sees in the screenshot (truncated text, misaligned elements, unexpected background color) with the code you provide. This is faster than describing the visual bug in words — showing is unambiguous.

**For console errors:** If the browser DevTools console is visible in the screenshot, Claude reads the error messages, line numbers, and stack trace from the image.

---

## Use Case 5: Design Implementation — Figma Screenshot to Component

Take a screenshot of a Figma frame (or any design mockup) and generate the corresponding component.

**Prompt:**
```
This is a screenshot of a Figma design for a pricing card component.

Generate a React component that matches this design exactly. Requirements:
- Use Tailwind CSS for styling
- The component accepts these props: plan (string), price (number), features (string[]), isPopular (boolean)
- The "Popular" badge should only appear when isPopular is true
- Match the font weights, spacing, and border radius visible in the screenshot
- The CTA button should use the primary color shown
```

**Iterating on the output:**
```
The button text is too small — in the screenshot it appears to be approximately 16px, matching the body text size. Update the component.
```

Claude cannot extract exact hex values from screenshots reliably — color perception from screenshots depends on monitor calibration and compression artifacts. For precise colors, copy them from Figma directly and paste into the prompt: "The primary color is #6366F1."

---

## Use Case 6: Chart and Graph Data Extraction

Claude can read values from bar charts, line graphs, pie charts, and data tables displayed as images — useful when the underlying data is not accessible.

**Prompt:**
```
Extract all data points from this bar chart. Return a JSON array where each item has:
- label (the x-axis category)
- value (the numeric y-axis value)

Estimate values as precisely as possible from the bar heights relative to the y-axis scale. Include your confidence level (high/medium/low) for each value.
```

**For line graphs with multiple series:**
```
This line graph shows three metrics over time. For each series:
1. Identify the series name (from the legend)
2. Extract the approximate value at each labeled x-axis tick
3. Identify any crossover points between series
```

Limitations: Claude estimates values by visual proportion. On a chart with a y-axis from 0 to 1,000,000, accuracy degrades for values that are close together. For high-precision data extraction, request the underlying data from the data source — visual extraction from charts is a fallback when the source is unavailable.

---

## Combining Vision with MCP: Playwright Screenshot Workflow

The most powerful multimodal pattern in Claude Code combines Playwright MCP (which takes programmatic screenshots) with Claude's vision capabilities to create a closed-loop test-and-fix cycle.

### Setup

Install and configure Playwright MCP:

```bash
npm install -g @playwright/mcp
```

Add to `.claude/settings.json`:
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp", "--browser", "chromium"]
    }
  }
}
```

### The Closed-Loop Pattern

```
1. Navigate to http://localhost:3000/checkout
2. Take a screenshot with Playwright MCP
3. Analyze the screenshot: identify any visual regressions compared to the expected layout described below
4. If regressions are found, read the relevant component files and fix them
5. Take a second screenshot after your fix
6. Confirm the regression is resolved by comparing the before and after screenshots

Expected layout: three-column grid of product cards, each with image on top, title below, price in bold at bottom-left, Add to Cart button at bottom-right.
```

Claude Code executes this autonomously:
- Playwright MCP navigates the browser and captures screenshots
- Claude analyzes each screenshot
- Claude reads source files, makes edits, and re-screenshots to verify

### Multi-Step Navigation Example

```
Using Playwright MCP:
1. Open http://localhost:3000
2. Screenshot the homepage — describe what you see
3. Click the "Sign In" link
4. Screenshot the sign-in form — list every form field present
5. Fill in email: test@example.com, password: testpass123
6. Click Submit
7. Screenshot the result — did login succeed or fail? What error, if any, is shown?
```

---

## PDF Processing

Claude processes PDFs page by page, treating each page as a rendered image.

**Single-page PDF:**
```python
with open("invoice.pdf", "rb") as f:
    data = base64.standard_b64encode(f.read()).decode("utf-8")

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=2048,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "document",
                "source": {
                    "type": "base64",
                    "media_type": "application/pdf",
                    "data": data
                }
            },
            {"type": "text", "text": "Extract all line items and totals from this invoice."}
        ]
    }]
)
```

**Multi-page PDFs:** Claude processes all pages by default. For long PDFs where only specific pages are relevant, specify the range in the prompt: "Focus on pages 3–7. Ignore the appendix."

Token cost scales with page count — a 20-page PDF costs approximately 20× the single-image rate (~30,000–40,000 tokens for the PDF alone). For large PDFs, extract the relevant pages before sending:

```bash
# Extract pages 3-7 from a PDF (requires pdftk or ghostscript)
pdftk input.pdf cat 3-7 output extracted.pdf

# Or with ghostscript
gs -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -dFirstPage=3 -dLastPage=7 \
   -sOutputFile=extracted.pdf input.pdf
```

---

## Limitations

| Limitation | Detail |
|---|---|
| No video | Claude cannot process video files or extract frames from video |
| No real-time camera | There is no live camera feed capability — screenshots are always static captures |
| Tiny text | Text smaller than approximately 8–10pt equivalent at supported resolution is unreliable |
| Exact colors | Color hex values extracted from screenshots are estimates, not exact |
| Complex overlapping UI | Dense UIs with overlapping elements or transparency effects reduce identification accuracy |
| Handwriting quality | Heavily degraded handwriting, non-Latin scripts, or unusual letterforms degrade OCR accuracy |
| Chart precision | Numeric values read from charts are approximations based on visual proportion |
| Animated content | GIFs are read as a single static frame |

---

## Prompt Patterns for Vision Tasks

Use these as starting templates, adjusting the output format for your downstream use.

**General description:**
```
Describe what you see in this image. Be specific — list UI components, text content, colors, layout structure, and any visible state (error, loading, empty, active).
```

**Text extraction:**
```
Extract all text visible in this image. Preserve the reading order. Use markdown formatting to reflect visual hierarchy — headings as ##, lists as bullet points, bold where text appears bold.
```

**Component inventory:**
```
Identify every UI component in this screenshot. For each component, provide:
- Component type (button, input, modal, card, etc.)
- Visible text or label
- Approximate position (top-left, center, bottom-right, etc.)
- Apparent state (active, disabled, selected, error)
```

**Structured data extraction:**
```
Extract the data shown in this [table/chart/form] as JSON. Use the column headers as keys. Include all rows visible.
```

**Code generation from visual:**
```
Implement this design as [React component / HTML+CSS / SwiftUI view]. Match the visual structure exactly. Use [Tailwind / inline styles / CSS modules] for styling. The component should be self-contained with no external dependencies beyond the specified styling system.
```

**Diff comparison:**
```
I'm giving you two screenshots — before and after a change. List every visual difference you can identify, no matter how small. Group differences by category: layout, color, typography, content, spacing.
```

---

## Full Workflow Example: Screenshot to Code Change

This end-to-end example takes a bug report screenshot and produces a committed fix.

**Setup:** A user reports that the notification badge overlaps the avatar in the header on mobile.

**Step 1 — Capture and analyze:**
```
I have a screenshot of a mobile header bug at /tmp/header-bug.png.

Describe exactly what you see — where is the notification badge relative to the avatar? What is the overlap?
```

Claude responds: "The notification badge (red circle, top-right of avatar) is positioned at `top: -4px; right: -4px` but the avatar container has `overflow: hidden`, clipping the badge."

**Step 2 — Locate the source:**
```
Based on that analysis, find the avatar component in this codebase. Look for a component that renders a circular avatar with a notification badge overlay.
```

Claude searches and finds `src/components/Avatar/Avatar.tsx`.

**Step 3 — Generate the fix:**
```
Read Avatar.tsx and fix the overflow issue. The badge should be fully visible — don't clip it. Preserve all existing prop types and behavior.
```

Claude edits the file, changing `overflow: hidden` on the container to `overflow: visible` and adjusting the parent wrapper to handle the border-radius clipping separately.

**Step 4 — Verify:**
```
Using Playwright MCP, navigate to http://localhost:3000 at 375px viewport width and screenshot the header. Does the badge appear fully visible and unclipped?
```

Claude takes the screenshot, analyzes it, and confirms the fix or iterates.

---

## Decision Table

| Task | Approach |
|---|---|
| Screenshot of UI bug → root cause | Paste screenshot, describe expected behavior, ask for code fix |
| Figma mockup → component | Screenshot Figma frame, specify framework and styling system |
| Scanned PDF → structured data | Base64 encode, use document content block, specify output schema |
| Architecture diagram → Terraform | Screenshot diagram, ask for provider-specific IaC output |
| Chart → CSV | Screenshot chart, ask for JSON/CSV with confidence levels |
| Automated visual regression | Playwright MCP screenshot → Claude analysis → automated edit loop |
| Large PDF (10+ pages) | Extract relevant pages before sending; estimate ~1500 tokens/page |
| Multiple UI states | Send all screenshots in one turn; ask Claude to compare across them |

---
