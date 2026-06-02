# 📂 Multimodal Vision Agent
> The canonical production workspace for an autonomous vision agent capable of parsing dense PDFs, extracting complex tables, and reasoning over unstructured layouts.

📄 `vision-pipeline-brief.md` # Canonical brief: Layout parsing rules, fallback OCR logic, and chunking strategies
🧠 `memory.md`                # Session memory: Dynamic context for multi-page document tracking
🤖 `CLAUDE.md`                # Operating rules: Strict instructions for preserving spatial relationships in extracted text

## 📁 ingestion-engine/ (5 skills - Document Preprocessing)
📄 `format-normalizer.md`     # Converts diverse inputs (PDF, TIFF, HEIC) to standard resolution PNGs
📄 `layout-analyzer.md`       # Bounding box detection • separates text blocks, tables, and images
📄 `image-enhancer.md`        # Contrast adjustment • preserves original colors of critical assets (charts/paintings)
📄 `pii-redactor.md`          # Visual blacklisting • blurs sensitive fields before LLM API transmission
📄 `chunking-router.md`       # Splits 100-page PDFs into parallel processing batches

## 📁 vision-workers/ (4 agent personas - The Extractors)
📄 `ocr-specialist.md`        # High-precision text extraction for dense, low-quality scans
📄 `table-parser.md`          # Grid reconstruction • outputs raw structural Markdown or JSON
📄 `chart-reasoner.md`        # Visual QA • extracts trends and data points from graphs
📄 `signature-verifier.md`    # Detects presence and spatial alignment of human signatures

## 📁 data-normalization/ (3 skills - Output Structuring)
📄 `json-schema-enforcer.md`  # Validates extracted data against strict Pydantic models
📄 `confidence-scorer.md`     # Flags low-confidence extractions for human-in-the-loop review
📄 `spatial-reconstructor.md` # Merges independent chunks back into a cohesive reading order

## 📁 export-pipeline/ (3 skills - Downstream Sync)
📄 `database-commit.md`       # Inserts structured JSON into Postgres/MongoDB
📄 `vector-embedding.md`      # Sends processed text to the RAG pipeline vector store
📄 `github-final-sync.md`     # Automated commits of validated datasets to GitHub final repos

## 📁 evals/ (3 skills - Pipeline Benchmarking)
📄 `extraction-accuracy.md`   # Ground-truth comparison against known test documents
📄 `cost-optimizer.md`        # Token and image-tile spend tracking per document
📄 `hallucination-check.md`   # Ensures the agent didn't "invent" data not present in the image

---
**Configuration Files**
⚙️ `docker-compose.yml`       # Worker nodes and Redis queue configurations
📦 `requirements.txt`         # Dependencies (PyMuPDF, OpenCV, Anthropic SDK)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
