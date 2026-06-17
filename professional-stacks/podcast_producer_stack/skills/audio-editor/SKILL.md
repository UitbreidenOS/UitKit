---
name: audio-editor
description: Guide audio post-production — noise reduction, leveling, EQ, compression, and mastering for podcast episodes
allowed-tools: [Read, Write, Bash, Grep]
effort: high
---

## When to activate

- Cleaning up raw podcast recordings
- Applying noise reduction, EQ, and compression
- Normalizing audio levels across speakers
- Mastering final mix for distribution (-16 LUFS stereo, -19 LUFS mono)
- Creating FFmpeg or SoX processing pipelines

## When NOT to use

- For music production or mixing
- For live audio engineering
- For sound design and foley

## Instructions

1. **Assess raw audio.** Check for background noise, plosives, sibilance, clipping, and level inconsistency.
2. **Apply noise reduction.** Profile noise floor from silence segments; apply spectral subtraction (Audacity/SoX).
3. **Remove artifacts.** De-ess sibilance (>6kHz), de-plosive low-frequency pops (<100Hz), trim dead air.
4. **Level and compress.** Normalize each speaker track to -6dB peak; apply 3:1 compression with 10ms attack.
5. **EQ each voice.** High-pass at 80Hz, cut boxy frequencies (200-400Hz), presence boost at 3-5kHz.
6. **Master final mix.** Target -16 LUFS integrated (stereo) or -19 LUFS (mono) per podcast standard.
7. **Export and validate.** MP3 128kbps stereo + WAV backup; verify loudness with `ffmpeg -i file.mp3 -af loudnorm -f null -`.

## Example

```bash
# Noise reduction + normalization with SoX
sox input.wav cleaned.wav noiseprof silence.prof
sox cleaned.wav output.wav noise reduction silence.prof gain -n -3

# Loudness normalization with FFmpeg
ffmpeg -i mixed.wav -af loudnorm=I=-16:TP=-1.5:LRA=11 -ar 44100 final.mp3
```
