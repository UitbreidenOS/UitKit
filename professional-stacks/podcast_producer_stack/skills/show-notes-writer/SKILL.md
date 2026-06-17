---
name: show-notes-writer
description: Write SEO-optimized podcast show notes with timestamps, links, key takeaways, and guest bios
allowed-tools: [Read, Write, Grep]
effort: low
---

## When to activate

- Writing show notes after episode recording
- Creating timestamped chapter markers
- Compiling resource links mentioned in episodes
- Writing episode summaries for SEO and discoverability
- Generating newsletter content from episodes

## When NOT to use

- For episode planning (use episode-outliner)
- For social media clip creation (use social-clip-writer)
- For transcript generation (use transcript-generator)

## Instructions

1. **Write episode summary.** 2-3 sentence hook answering: what's this episode about and why should someone listen?
2. **Add timestamps.** Chapter markers for each segment: `[00:00] Intro`, `[02:30] Topic discussion`, etc.
3. **List key takeaways.** 3-5 bullet points of actionable insights from the episode.
4. **Compile resources.** Links to everything mentioned: tools, articles, books, guest's website/social.
5. **Write guest bio.** 2-3 sentences with credentials and where to find them online.
6. **Add SEO keywords.** Include relevant keywords naturally in the first paragraph and headings.
7. **Include CTAs.** Subscribe, leave a review, join newsletter, follow on social, sponsor link.

## Example

```
# Ep 42: Scaling APIs to 10M Requests/Day with Dr. Sarah Chen

What happens when your API needs to handle 10 million requests daily? Dr. Sarah Chen, VP Engineering at ScaleAI, shares battle-tested strategies from scaling ML infrastructure...

## Chapters
[00:00] Introduction
[02:30] Sarah's background and journey
[08:00] Architecture decisions for high-scale APIs
[18:00] The 3AM outage war story
[28:00] Lessons learned and advice

## Key Takeaways
- Start with caching before adding complexity
- Design for failure — every component will break
- Invest in observability before you need it

## Links & Resources
- Sarah Chen on Twitter: @sarahchen
- KubeCon 2026 talk: [link]
- "Designing Data-Intensive Applications" by Martin Kleppmann
```
