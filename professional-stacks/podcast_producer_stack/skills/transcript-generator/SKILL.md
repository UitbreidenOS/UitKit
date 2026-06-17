---
name: transcript-generator
description: Generate formatted podcast transcripts with speaker labels, timestamps, and accessibility formatting
allowed-tools: [Read, Write, Bash, Grep]
effort: medium
---

## When to activate

- Creating transcripts from audio recordings
- Formatting transcripts with speaker labels and timestamps
- Generating accessible text versions for hearing-impaired listeners
- Creating blog post content from episode transcripts
- Building searchable text archives of episode content

## When NOT to use

- For live captioning (real-time services needed)
- For translation of transcripts
- For audio editing (use audio-editor)

## Instructions

1. **Transcribe audio.** Use Whisper, Deepgram, or Rev for initial transcription. Target >95% accuracy.
2. **Add speaker labels.** Format: `[HH:MM:SS] Speaker Name:` for each speaker turn.
3. **Insert timestamps.** Every 5 minutes and at segment transitions for easy navigation.
4. **Clean up text.** Remove filler words (um, uh, like), false starts, and repetitions. Keep natural tone.
5. **Add formatting.** Bold key terms, italicize emphasis, add [laughs], [music], [sound effect] markers.
6. **Verify accuracy.** Spot-check 10% of transcript against audio; correct proper nouns and technical terms.
7. **Export formats.** Plain text (.txt), markdown (.md), SRT/VTT for captions, and HTML for web publishing.

## Example

```markdown
# Episode 42 Transcript: Scaling APIs to 10M Requests/Day

[00:00:00] **Host:** Welcome back to the show. Today I'm joined by Dr. Sarah Chen, VP Engineering at ScaleAI. Sarah, thanks for being here.

[00:00:12] **Dr. Chen:** Thanks for having me! Excited to talk about scaling.

[00:00:18] **Host:** So let's jump right in. You recently gave a talk at KubeCon about ML at scale. What was the core message?

[00:00:28] **Dr. Chen:** The core message was that *ML infrastructure is 80% plumbing*. [laughs] People think it's about models, but it's really about the data pipelines...

[00:05:00] --- Segment: Architecture Decisions ---
```
