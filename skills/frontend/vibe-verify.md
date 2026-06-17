---
name: vibe-verify
description: "Claude Code Vibe & Verify: adversarial UI/UX audit loop. Spawns/simulates a Vibe-Maker agent for aesthetic modern design and a Skeptic agent for accessibility, mobile-responsiveness, and edge cases"
updated: 2026-06-17
---

# Vibe & Verify — Adversarial UI/UX Audit Loop

## When to activate
- Designing, styling, or refactoring frontends, layouts, component libraries, or dashboards.
- Performing visual design audits or polishing CSS/HTML structure.
- Testing user interface responsiveness, accessibility (WCAG 2.1 AA/AAA), and interactive states.
- Running a design check session before finalizing UI components or page assemblies.

## When NOT to use
- Writing pure backend logic, database queries, migration scripts, or APIs.
- DevOps, infrastructure-as-code, and server configuration scripts.
- Data processing, algorithmic coding, or heavy computation.

## Instructions

The Vibe & Verify workflow orchestrates an adversarial collaboration between two distinct personas: the **Vibe-Maker** (Aesthetic Designer) and the **Skeptic** (QA & Accessibility Auditor).

```
          [User Request / Wireframe]
                       │
                       ▼
              ┌─────────────────┐
              │   Vibe-Maker    │ ◄──────────┐
              │ (Design & Code) │            │
              └────────┬────────┘            │
                       │                     │ Iterative
                       ▼                     │ Correction
              ┌─────────────────┐            │ Loop
              │   Skeptic QA    │ ───────────┘
              │ (Audit & Test)  │ (If fails criteria)
              └────────┬────────┘
                       │
                       ▼ (Passes all checks)
               [Final UI Code]
```

### 1. Persona Definitions

*   **Vibe-Maker (Aesthetic & Style specialist):**
    *   **Focus:** Typography, spacing hierarchy, visual rhythm, color palettes (HSL/HEX harmony), layout paradigms (Flexbox/Grid), micro-interactions (hover, focus, transition states), modern aesthetics (glassmorphism, clean shadows, gradients), and responsive adaptation.
    *   **Tone:** Highly creative, pixel-perfect, modern, UX-focused.
*   **Skeptic (QA, Performance & Accessibility specialist):**
    *   **Focus:** Keyboard accessibility (`tabindex`, focus traps), screen reader compatibility (semantic HTML, `aria-*` tags), responsiveness breakpoints (extreme viewport sizes), layout overflows, console warnings, performance footprints, and edge-case interactive failures.
    *   **Tone:** Rigorous, compliance-oriented, testing-first.

### 2. The Verification Loop Steps

1.  **Drafting (Vibe-Maker):** Write the styled UI component, establishing layout, color scheme, margins, font weights, and transition curves.
2.  **Audit (Skeptic):** Review the component line-by-line against the compliance checklists (defined below). Identify specific layout, responsive, or accessibility gaps.
3.  **Refinement (Vibe-Maker):** Adjust code based on the Skeptic's feedback.
4.  **Sign-off:** The Skeptic approves once all criteria are met, and the clean production-ready code is output.

### 3. Compliance Checklists

#### A. The Vibe Checklist (Visual Excellence)
*   [ ] **Typography:** Scale using modular hierarchy. Custom Google Fonts used (e.g., Inter, Outfit) with correct fallbacks. No raw browser defaults.
*   [ ] **Color Palette:** Curated, harmonious colors. Primary, secondary, success, warning, neutral scales. Dark mode colors explicitly handled.
*   [ ] **Spacing & Grid:** Consistently aligned to a 4px/8px grid. Flexbox and CSS Grid used for layout; no arbitrary hardcoded absolute positions (`left: 213px`).
*   [ ] **Elevation & Depth:** Dynamic layered shadows (`box-shadow`) or subtle borders indicating active/inactive depth.
*   [ ] **Micro-Interactions:** Custom `:hover`, `:focus-visible`, and `:active` transition properties (e.g., `transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`).

#### B. The Skeptic Checklist (Robustness & Accessibility)
*   [ ] **Semantic HTML:** Correct tags used (`<main>`, `<header>`, `<article>`, `<button>`, `<nav>`) instead of nested empty `<div>` tags.
*   [ ] **Contrast Ratio:** Text and interactive elements meet WCAG AA (at least 4.5:1 for normal text, 3:1 for large text).
*   [ ] **Keyboard Navigation:** All interactive elements focusable. Focus states highly visible and distinct. No disabled/stuck focus loops.
*   [ ] **Aria Tags:** Correct use of `aria-label`, `aria-expanded`, and `aria-hidden` where necessary.
*   [ ] **Responsive Breakpoints:** Component does not overflow at viewports from 320px (mobile) to 1920px (large desktop). Wrap controls or grid layouts properly.

---

## Example

**Vibe & Verify session outputting a glassmorphic user profile card component:**

### Vibe-Maker Draft
```html
<div class="card">
  <img src="avatar.jpg" alt="user">
  <div class="name">Sarah Jenkins</div>
  <div class="title">Lead Product Designer</div>
  <div class="actions">
    <button onclick="followUser()">Follow</button>
  </div>
</div>

<style>
.card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  color: white;
  font-family: 'Inter', sans-serif;
}
.name {
  font-size: 20px;
  font-weight: 600;
  margin: 12px 0 4px 0;
}
.title {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-bottom: 20px;
}
button {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
}
</style>
```

### Skeptic Audit Findings
1.  **Semantic HTML:** Card should use `<article>`, user photo needs proper alt text, action buttons list should use `<nav>` or list layout.
2.  **Accessibility (Contrast):** Text color on white glass (`rgba(255,255,255,0.7)`) may not pass contrast checks under light backgrounds.
3.  **Keyboard Accessibility:** The button has no `:focus-visible` outline. Focus styling is missing.
4.  **Responsive Layout:** If the name is extremely long, it might overflow. Add text-overflow prevention.

### Vibe-Maker Refined Code (Passed Loop)
```html
<article class="user-card">
  <img src="avatar.jpg" alt="Sarah Jenkins, Profile Photo" class="user-card__avatar">
  <h2 class="user-card__name">Sarah Jenkins</h2>
  <p class="user-card__title">Lead Product Designer</p>
  <div class="user-card__actions">
    <button class="btn btn--primary" aria-label="Follow Sarah Jenkins" onclick="followUser()">Follow</button>
  </div>
</article>

<style>
.user-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  color: #f8fafc;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  max-width: 320px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
}

.user-card__avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
}

.user-card__name {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 16px 0 4px 0;
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-card__title {
  color: #cbd5e1; /* High contrast gray on dark glass background */
  font-size: 0.875rem;
  margin-top: 0;
  margin-bottom: 20px;
}

.btn {
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn--primary {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: #ffffff;
  border: none;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn--primary:hover {
  background: linear-gradient(135deg, #4f46e5, #4338ca);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
}

.btn--primary:focus-visible {
  outline: 2px solid #a5b4fc;
  outline-offset: 2px;
}

.btn--primary:active {
  transform: translateY(0);
}
</style>
```
