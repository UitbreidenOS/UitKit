# Claude Design — Visual Design Agent by Anthropic Labs

Claude Design is a visual design agent — not a traditional design tool — that generates polished visual work from natural language descriptions. It reads your existing design system, codebase, and brand files to produce on-brand output, then packages the result as a handoff bundle that Claude Code can work from directly.

---

## What Claude Design Is

- **Text-to-design**: describe what you need, Claude builds a first version
- **Design system aware**: reads your codebase and design files to auto-apply colors, typography, and existing components
- **Conversational refinement**: inline comments, direct edits, custom adjustment sliders
- **Multi-format export**: internal URLs, Canva, PDF, PPTX, HTML
- **Claude Code handoff bundle**: packages the design into a development bundle Claude Code can consume
- **Availability**: Research preview for Pro, Max, Team, and Enterprise subscribers (as of April 17, 2026)

---

## How It Fits Into a Claude Code Workflow

1. Start in Claude Design — describe the UI or visual asset needed
2. Attach your design system tokens (colors, typography, component library)
3. Refine conversationally until the output matches intent
4. Export → "Send to Claude Code" generates a handoff bundle
5. In Claude Code: reference the handoff bundle to implement the design as code

The handoff bundle contains layout specs, extracted design tokens, component annotations, and responsive breakpoint notes — enough for Claude Code to implement without further design interpretation.

---

## Design→Code Handoff Pattern

```bash
# Export from Claude Design, then:
unzip checkout-v2.bundle -d design-handoffs/checkout-v2/

# Open Claude Code and reference the bundle
claude "Implement the checkout page from design-handoffs/checkout-v2/ using shadcn/ui components"
```

Recommended project structure:

```
project-root/
├── design-handoffs/
│   ├── checkout-v2/
│   │   ├── layout.json          # Component tree and positioning
│   │   ├── tokens.json          # Colors, spacing, typography
│   │   ├── components.md        # Component annotations
│   │   └── preview.png          # Visual reference
│   └── landing-v1/
└── src/
```

---

## Attaching a Design System

Claude Design reads design context from three sources:

| Source | How to attach | What Claude reads |
|--------|---------------|-------------------|
| Token file | Upload `tokens.json` or paste CSS variables | Colors, spacing, radii, font scales |
| Component library | Link to Storybook URL or upload component screenshots | Existing component names and variants |
| Brand file | Upload brand PDF or style guide | Logo usage, typography hierarchy, tone |
| Codebase | Paste `tailwind.config.js` or theme file | Utility class mappings, breakpoints |

The more context you provide, the less correction the refinement loop requires.

---

## Use Cases

- Product mockups and interactive prototypes before sprint planning
- Pitch decks and investor materials without a designer on the team
- Marketing collateral: one-pagers, landing page concepts, social cards
- UI exploration before full implementation — explore 3 directions cheaply
- Quick brand-consistent visual assets for teams without a dedicated designer
- Rapid onboarding screens, empty states, and error state designs

---

## Conversational Refinement

Claude Design supports natural language edits during refinement:

```
"Move the CTA button above the fold"
"Make the heading larger and use our primary brand color"
"Try a version with less whitespace — this is for a dense data dashboard"
"Add a dark mode variant"
"Match the typography from the homepage we uploaded"
```

Each instruction produces a new version; previous versions are preserved in version history.

---

## Export Formats

| Format | Best for |
|--------|---------|
| Handoff bundle (`.bundle`) | Claude Code implementation |
| HTML | Static mockup in browser |
| PDF | Stakeholder review, printing |
| PPTX | Pitch decks, presentations |
| Canva export | Marketing team editing |
| Internal URL | Sharing within claude.ai |

---

## Limitations (Research Preview)

- Research preview status — features and export formats may change without notice
- Not a vector editor — no Figma-equivalent node manipulation or precision layout tools
- Handoff bundle is a development aid, not a pixel-perfect spec; Claude Code may need to adapt layout for responsiveness
- Requires claude.ai account on a Pro, Max, Team, or Enterprise plan
- Not suitable as a sole source of truth for production design systems
- Complex designs with many custom components may require significant prompt refinement

---
