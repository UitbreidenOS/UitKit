---
name: claude-design
updated: 2026-06-13
---

# Claude Design Integration

## When to activate

- User has exported a handoff bundle from Claude Design and wants to implement it as code
- User wants to set up a design→code workflow using Claude Design output
- User asks how to convert a Claude Design export into React, HTML, or framework components
- User wants to extract design tokens (colors, spacing, typography) from a Claude Design bundle
- User is mapping Claude Design component annotations to a UI library (shadcn/ui, MUI, Tailwind, Radix)

## When NOT to use

- Building UI from scratch with no design input — use a code-first approach instead
- Working with Figma, Sketch, or other vector design tools — this skill is Claude Design-specific
- Pure refactoring or logic work with no visual design component
- User has a screenshot or image but not a Claude Design bundle — handle as a standard visual prompt

## Instructions

### Receiving the handoff bundle

Ask the user to confirm the bundle contents before starting implementation:

```bash
unzip design-handoffs/checkout.bundle -d design-handoffs/checkout/
ls design-handoffs/checkout/
# Expect: layout.json, tokens.json, components.md, preview.png
```

If the bundle contains `tokens.json`, load it first. Design tokens define the entire visual contract — colors, spacing, font sizes, border radii. Never hardcode values that appear in the token file.

### Placing bundle files

Standardize on this location to avoid path drift across projects:

```
project-root/
└── design-handoffs/
    └── <feature-name>/
        ├── layout.json
        ├── tokens.json
        ├── components.md
        └── preview.png
```

Never place bundle files inside `src/` or alongside application code.

### Extracting and applying design tokens

Convert `tokens.json` into the project's token format before writing components:

```typescript
// tokens.json (Claude Design output)
{
  "color": {
    "primary": "#1A56DB",
    "surface": "#F9FAFB",
    "text-primary": "#111928"
  },
  "spacing": {
    "4": "1rem",
    "6": "1.5rem"
  },
  "radius": {
    "md": "0.5rem"
  }
}
```

Mapping examples:

| Claude Design token | Tailwind class | CSS variable | shadcn/ui token |
|--------------------|---------------|--------------|-----------------|
| `color.primary` | `bg-blue-600` | `--color-primary` | `--primary` |
| `spacing.4` | `p-4` | `--spacing-4` | direct value |
| `radius.md` | `rounded-md` | `--radius-md` | `--radius` |

When the project uses Tailwind, extend `tailwind.config.js` with extracted tokens rather than applying them inline.

### Reading component annotations

Open `components.md` before writing component code. It lists:
- Component names and their design-system equivalents
- Variant names (e.g., `Button/primary`, `Card/elevated`)
- State annotations (hover, focus, disabled, loading)
- Responsive behavior notes (stack at mobile, side-by-side at desktop)

Prompt pattern for component implementation:

```
"Implement the [ComponentName] described in design-handoffs/checkout/components.md.
Use shadcn/ui as the base. Match the token values in tokens.json exactly.
The layout spec is in layout.json — use it for spacing and positioning only,
not as a pixel-perfect constraint."
```

### Handling responsive breakpoints

Claude Design bundles include breakpoint annotations in `layout.json`. Map them:

```json
// layout.json breakpoint section
"breakpoints": {
  "mobile": "< 768px",
  "tablet": "768px – 1024px",
  "desktop": "> 1024px"
}
```

In Tailwind: `sm:` maps to tablet, `lg:` maps to desktop. Verify this against the project's `tailwind.config.js` — custom breakpoints may differ.

### Match exactly vs. use as inspiration

Use explicit prompt language to set the implementation contract:

| Intent | Prompt phrasing |
|--------|----------------|
| Exact match | "Implement this design as close to pixel-perfect as the component library allows. Flag any deviations." |
| Inspired by | "Use this design as a reference for layout and color direction. Adapt as needed for our component library conventions." |
| Token-only | "Ignore the layout; apply only the design tokens from tokens.json to our existing components." |

Default to "inspired by" unless the user specifies otherwise — exact matches are rarely achievable across design tools and UI libraries and often produce brittle CSS.

### Validating implementation against preview

After generating the component, ask Claude to compare against `preview.png`:

```
"Compare the generated component against design-handoffs/checkout/preview.png.
List any visual differences — layout, color, spacing, or typography — and fix them."
```

## Example

```
User: "I exported a checkout page from Claude Design. The bundle is at 
design-handoffs/checkout-v2.bundle. Generate the React component using 
shadcn/ui to match it."

Claude Code workflow:
1. Unzip bundle to design-handoffs/checkout-v2/
2. Read tokens.json → extend tailwind.config.js with extracted tokens
3. Read components.md → identify: CheckoutForm, OrderSummary, PaymentInput components
4. Read layout.json → note two-column layout collapses to single column at mobile
5. Generate CheckoutPage.tsx using Card, Input, Button from shadcn/ui
6. Apply token classes (bg-primary, text-primary, rounded-md) from Tailwind extension
7. Verify against preview.png, fix spacing deviation in OrderSummary padding
```

---
