# 📂 Real-Time Voice Agent
> The canonical production workspace for a sub-300ms latency voice-to-voice agent, utilizing LiveKit WebRTC and an active streaming pipeline.

📄 `voice-persona-brief.md`  # Canonical brief: Agent tone, fallback behavior, and escalation paths
🧠 `memory-context.md`       # Session memory: Dynamic context passed during the active phone call
🤖 `CLAUDE.md`               # Operating rules: Strict instructions for keeping responses under 2 sentences for natural flow

## 📁 livekit-orchestrator/ (5 skills - Real-Time Pipeline)
📄 `room-dispatcher.md`      # WebRTC room management • automated agent dispatch on user join
📄 `audio-buffer.md`         # PCM int16 stream handler • 20ms audio chunking protocols
📄 `turn-detector.md`        # Semantic turn detection • differentiates "umm" from end-of-thought
📄 `barge-in-handler.md`     # Interruption logic • acoustic VAD (Silero) tuning
📄 `telephony-bridge.md`     # SIP trunk integration • connecting real phone numbers to WebRTC

## 📁 streaming-pipeline/ (3 skills - Sub-300ms Stack)
📄 `stt-transcriber.md`      # Deepgram Nova-3 integration • persistent WebSocket connection
📄 `llm-reasoner.md`         # Streaming reasoning • OpenAI/Anthropic token generation via vLLM
📄 `tts-synthesizer.md`      # ElevenLabs Turbo v2.5 integration • streaming audio chunks as generated

## 📁 tool-execution/ (4 skills - Agent Actions)
📄 `tool-registry.md`        # XML tags and function calling specs for mid-turn execution
📄 `crm-sync.md`             # Real-time Salesforce/HubSpot data pulls during conversation
📄 `calendar-booker.md`      # Live availability checking and appointment scheduling
📄 `timeout-fallback.md`     # Graceful "system unavailable" verbalizations if tools fail

## 📁 telemetry-evals/ (3 skills - Quality & Latency)
📄 `latency-monitor.md`      # Time-to-first-audio (TTFA) tracking • alerts if > 500ms
📄 `conversation-logger.md`  # EU AI Act compliance • immutable transcripts and tool execution logs
📄 `escalation-trigger.md`   # Human-in-the-loop handoff when sentiment drops or logic loops

---
**Configuration Files**
⚙️ `docker-compose.yml`      # Local SFU and worker deployment mapping
📦 `requirements.txt`        # LiveKit Agents SDK, Pipecat, and VAD dependencies

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
