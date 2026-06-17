# Storybook Generator

## When to activate

User runs `/generate-storybook` or requests Storybook story generation for a component with all prop variants and interactive controls.

## When NOT to use

- Component audits (use `/component-auditor` instead)
- Accessibility reviews (use `/review-a11y` instead)
- Existing well-documented Storybook stories (update instead)

## Instructions

1. **Analyze component props**
   - Extract all props and their types (required vs. optional)
   - Identify variant combinations (size, color, state, etc.)
   - Map props to Storybook controls (boolean, select, text, etc.)

2. **Generate story template**
   - Meta export with component, title, and controls config
   - Default story showing primary variant
   - Variant stories for each meaningful combination (Size, Variant, State, etc.)
   - Edge case stories (empty state, error state, loading state)

3. **Add interactive controls**
   - Boolean controls for toggles (disabled, loading, etc.)
   - Select controls for variants (size: small/medium/large)
   - Text controls for content
   - Suggest control groups (e.g., "Button" group for size + variant)

4. **Document usage examples**
   - Show primary use case
   - Show edge cases
   - Add JSDoc comments for prop descriptions
   - Include accessibility notes if relevant

5. **Export story code**
   - TypeScript with proper types
   - Modern Storybook CSF 3.0+ syntax
   - Ready to commit without modification

## Example

User: "Generate Storybook for this Button component."

Response generates:
```
export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    variant: { control: 'select', options: ['primary', 'secondary', 'outline'] },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
};

export const Primary = { args: { variant: 'primary', children: 'Click me' } };
export const Secondary = { args: { variant: 'secondary', children: 'Click me' } };
export const Disabled = { args: { disabled: true, children: 'Click me' } };
export const AllSizes = { render: () => <div>...</div> };
```
