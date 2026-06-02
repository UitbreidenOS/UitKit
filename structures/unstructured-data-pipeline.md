# 📂 Unstructured Data Pipeline

> The canonical workspace for an automated, multi-modal ingestion engine that normalizes raw audio, video, and complex PDFs into clean, vector-ready text and metadata.

📄 `pipeline-architecture-brief.md` # Canonical brief: Defines file size limits, supported mime-types, and chunking strategies
🧠 `memory.md`                      # Session memory: Dynamic context tracking for active long-running ingestion batch jobs
🤖 `CLAUDE.md`                      # Operating rules: Strict instructions to halt processing if file corruption is detected

## 📁 audio-processing/ (4 skills - Speech to Text)
📄 `format-converter.md`            # FFmpeg wrapper • standardizes .m4a, .ogg, and .wav to 16kHz mono .mp3
📄 `vad-silence-stripper.md`        # Voice Activity Detection • cuts dead air to save on transcription API costs
📄 `whisperx-transcriber.md`        # High-speed transcription • handles Word-Level timestamps and alignment
📄 `speaker-diarization.md`         # Pyannote integration • maps "Speaker A" and "Speaker B" accurately across the transcript

## 📁 video-processing/ (3 skills - Frame & Audio Extraction)
📄 `audio-extractor.md`             # Decouples the audio track and routes it to the `audio-processing` pipeline
📄 `keyframe-sampler.md`            # Extracts 1 frame per scene change (using OpenCV) for visual layout analysis
📄 `on-screen-ocr.md`               # Parses text from slides or screen-shares embedded within the video

## 📁 pdf-processing/ (4 skills - Complex Document Parsing)
📄 `layout-analyzer.md`             # Detects columns and reading order so text isn't mashed together horizontally
📄 `table-extractor.md`             # Preserves grid structures from financial reports into raw Markdown/JSON
📄 `ocr-fallback.md`                # Automatically routes scanned (non-selectable) PDFs to Tesseract/AWS Textract
📄 `image-asset-saver.md`           # Isolates embedded charts and diagrams, saving them to S3 with reference links

## 📁 unified-export/ (3 skills - Downstream Normalization)
📄 `schema-enforcer.md`             # Wraps all outputs (from video, audio, or PDF) into a single, unified JSON structure
📄 `metadata-tagger.md`             # Appends source URL, duration/page count, and processing timestamp
📄 `vector-db-router.md`            # Pushes the normalized chunks to Pinecone/Qdrant for RAG ingestion

## 📁 infrastructure-ops/ (3 skills - Scale & Sync)
📄 `s3-event-listener.md`           # AWS Lambda trigger • automatically starts processing when a file hits the bucket
📄 `gpu-queue-manager.md`           # RabbitMQ/Celery worker pool routing heavy tasks to Nvidia GPU instances
📄 `github-final-sync.md`           # Automated commits of processing logs and pipeline updates to Github final repos

---
**Configuration Files**
⚙️ `docker-compose.gpu.yml`         # Setup for local CUDA-enabled processing workers
📦 `requirements.txt`               # FFmpeg-python, PyMuPDF, WhisperX, and OpenCV dependencies

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
