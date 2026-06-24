---
description: Add or fix form validation with schema, error display, and accessible error messaging
argument-hint: "[file] [library: zod|yup|valibot|native]"
---
Implement or repair form validation in: $ARGUMENTS

Parse args: first token is the target file; optional library name overrides auto-detection.

**Step 1 — Detect existing stack**
Scan for imports of: `react-hook-form`, `formik`, `zod`, `yup`, `valibot`, `@conform-to/react`.
Use whatever is already installed. If nothing is installed, default to `react-hook-form` + `zod`.
Do not install new packages without noting them explicitly.

**Step 2 — Define the schema**
For each field in the form, derive validation rules from:
- Field name semantics (email, phone, url, password, date)
- Existing constraints visible in the markup (`required`, `minLength`, `pattern`, `type`)
- Any server-side validation logic visible in the codebase

Schema rules to apply:
- `email`: `.email()` with a human-readable message
- `password`: min 8 chars, at least one number or symbol — emit the constraint clearly in the message
- `url`: `.url()` — allow empty string only if field is optional
- `phone`: E.164 regex or locale-appropriate pattern
- Required fields: explicit `.min(1, "Field is required")` — not just `.nonempty()`
- Optional fields: wrap with `.optional()` or `.nullable()` as appropriate — do not leave ambiguous

**Step 3 — Wire validation to the form**
For react-hook-form:
- Use `resolver` with the schema library's resolver adapter
- Replace any manual `onChange` validation with `register()` and `formState.errors`
- Use `handleSubmit` — do not manually call `preventDefault`

For formik:
- Pass `validationSchema` prop
- Use `<ErrorMessage>` component or `formik.errors[field]` — not ad hoc string checks

**Step 4 — Error display**
Each error message must:
- Appear below the relevant input, not in a toast or alert banner
- Be associated with the input via `aria-describedby` pointing to the error element's `id`
- Set `aria-invalid="true"` on the input when an error is present
- Use `role="alert"` on the error container if it appears after user action (not on initial render)
- Not use red color alone to convey error state — include an icon or text prefix like "Error:"

**Step 5 — Submit behavior**
- Disable the submit button while submission is in progress (`isSubmitting`)
- Re-enable on error so the user can retry
- Clear field-level errors on successful resubmit
- If the server returns field errors (400 with error map), apply them via `setError` to the correct fields

Apply all changes to the file. List every field updated and every new validation rule added.
