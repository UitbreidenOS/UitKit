# Localization Prep

## When to activate
Before sending docs for translation into other languages.

## When NOT to use
Do not use before docs are final. Use only on published or near-published content.

## Instructions

1. Identify translatable strings (headings, body text, examples, alerts).
2. Mark strings with context for translators:
   - Section name (e.g., "API Reference: Parameters")
   - Purpose (e.g., "User instruction" vs. "Code comment")
   - Special handling (e.g., "keep as-is" for variable names)
3. Extract glossary:
   - Product-specific terms (should not be translated)
   - Technical terms (may need regional variants)
   - Common phrases (standardize translation across docs)
4. Flag untranslatable elements (code blocks, URLs, file paths).
5. Return translatable text file + context guide for translators.
6. Identify languages and regional variants (e.g., en-US vs. en-GB).

## Example

**Input:** "How to set up webhooks" guide

**Output:**
```
# Localization Prep: How to Set Up Webhooks

## Translatable Strings

### Section: Getting Started
[1] "Webhooks allow your application to receive real-time event notifications."
Context: Introductory sentence; explain what webhooks are
Variant: US English; formal tone

[2] "You'll need an active account and API credentials to proceed."
Context: Prerequisites; list requirements
Variant: US English; formal tone

### Section: Step 1 — Create an Endpoint
[3] "Click the Webhooks section in your dashboard."
Context: User instruction; action-oriented
Variant: US English; imperative voice

## Glossary (Do Not Translate)
- Webhook (technical term; keep as "webhook")
- Payload (keep as "payload")
- Event (context: webhook events; consider regional term if needed)
- Dashboard (product term; keep as "dashboard")

## Code & Untranslatable
```bash
curl -X POST https://api.example.com/webhooks
```
→ Keep as-is; no translation needed

## Languages to Translate
- French (fr_FR)
- German (de_DE)
- Spanish (es_ES)
- Dutch (nl_NL)

## Translator Checklist
- [ ] Maintain code block integrity (no line breaks in code)
- [ ] Preserve heading hierarchy (H1, H2, etc.)
- [ ] Keep URLs unchanged
- [ ] Preserve backticks for code references
- [ ] Use glossary for consistent terminology
```
