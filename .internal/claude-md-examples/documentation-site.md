# CLAUDE.md — Documentation Site (Annotated Example)
> Docusaurus 3 technical documentation site — shows how to apply writing quality standards, content architecture rules, and the review-before-publish discipline that docs sites require.

<!-- ANNOTATION: Documentation is a product. The opening line establishes the quality standard: docs must be accurate, complete, and tested. "Tested" is the unusual one — it means code samples actually run, links work, and steps produce the stated outcome. -->
This is a technical documentation site. Documentation quality standards are: accurate (tested against current code), complete (no unexplained gaps), and scannable (readers find answers in < 30 seconds). Every code example must be runnable and produce the stated output.

## Stack

- Docusaurus 3.5 (React-based static site generator)
- MDX (Markdown + JSX components)
- TypeScript for custom components
- Algolia DocSearch for search
- GitHub Actions for CI and deployment to GitHub Pages

## Site Structure

```
docs/
  getting-started/
    installation.md
    quickstart.md
    concepts.md
  guides/
    [topic]/          # One directory per major topic
  api-reference/
    [module]/         # Auto-generated from TSDoc + handwritten context
  tutorials/          # End-to-end walkthroughs (complete, runnable)
  troubleshooting/    # Known issues and solutions
src/
  components/         # Custom MDX components
  css/                # Custom CSS overrides
  pages/              # Non-doc pages (landing, changelog)
static/
  img/                # Screenshots and diagrams
```

## Content Types and Their Rules

<!-- ANNOTATION: Distinguishing content types prevents Claude from writing a reference page like a tutorial or a guide like an API reference. Each type has a specific job, and mixing them produces documents that are confusing to navigate. -->

### Guides (How-To)
- Goal-oriented: answers "how do I accomplish X?"
- Steps are numbered and imperative: "Run the following command"
- Prerequisites listed at the top
- Ends with a verification step — the reader should be able to confirm it worked

### Tutorials
- Learning-oriented: builds understanding through a complete project
- Fully runnable from start to finish — no "exercise left to the reader"
- Estimated time at the top
- Explain why, not just what

### Reference
- Information-oriented: complete, accurate, terse
- Parameters listed in a table with type, required/optional, default, description
- No opinion or recommendation — save that for guides

### Troubleshooting
- Problem-oriented: each entry is a symptom → cause → solution
- Symptom is the exact error message or behavior the user sees
- Solution includes the exact command or change to make

## Writing Standards

<!-- ANNOTATION: These standards exist to make docs consistent across multiple contributors. "Active voice" and "second person" are measurable style rules that Claude can apply uniformly. The 80-character prose width is enforced by the project's Prettier config. -->
- Active voice: "The function returns a string" not "A string is returned by the function"
- Second person: "You can configure..." not "Users can configure..."
- Present tense: "The API accepts..." not "The API will accept..."
- Code samples in fenced code blocks with language tag: ` ```typescript `
- Prose line width: 80 characters (enforced by Prettier)
- No "Note:", "Warning:", "Important:" — use Docusaurus admonitions: `:::note`, `:::warning`, `:::tip`

## Code Sample Rules

<!-- ANNOTATION: Untested code samples are the most common documentation failure. They erode trust more than any other issue — a developer who follows a sample and it doesn't work will not return. The verification requirement is the quality gate. -->
Every code sample must:
1. Be the minimal working example — no unnecessary boilerplate
2. Have been tested against the current version of the library/tool
3. Include all imports at the top
4. Produce the exact output shown (if output is shown)

If a code sample is illustrative only (pseudocode or partial), mark it with a comment: `// illustrative — not runnable`

## Versioning

- Docusaurus versioned docs are in `versioned_docs/`
- Only the latest stable version is in `docs/` — older versions are in versioned_docs
- When the library releases a new version: `pnpm run docusaurus docs:version <version>`
- Do not backport new content to old versions unless it fixes a factual error

## Screenshots and Diagrams

<!-- ANNOTATION: Screenshots go stale fast. The alt text rule is an accessibility requirement; the no-screenshot-for-code rule prevents the common mistake of screenshotting terminal output instead of quoting it. -->
- Screenshots must include alt text describing the content
- Do not screenshot code or terminal output — use fenced code blocks
- Diagrams: Mermaid for simple flows, exported SVGs for complex architecture diagrams
- Image filenames: descriptive-kebab-case.png — no `screenshot1.png`

## SEO and Metadata

- Every page has a `description` in frontmatter (used by search engines and Algolia)
- Slug is explicit in frontmatter for important pages — do not rely on file path
- `title` in frontmatter is the H1 — do not add a separate H1 in the content

## Commands

```bash
pnpm start         # Local dev server (port 3000)
pnpm build         # Production build
pnpm serve         # Serve production build locally
pnpm typecheck     # Check custom component TypeScript
pnpm linkcheck     # Verify no broken internal links
```

## What Not To Do

<!-- ANNOTATION: The "untested code samples" and "broken links" rules appear here even though they're in the body — docs failures that erode reader trust most deserve to be listed as explicit prohibitions. -->
- Do not publish code samples that have not been tested
- Do not use passive voice or third person in instructional content
- Do not create a new page without adding it to `sidebars.js`
- Do not use screenshots for code — use fenced code blocks
- Do not leave `TODO:` comments in published docs — they undermine credibility
- Do not mix content types on one page (guide + reference on same page)
