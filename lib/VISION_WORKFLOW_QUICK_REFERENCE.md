# Vision Workflow Builder - Quick Reference

## Import
```javascript
const builder = require('./lib/vision-workflow-builder');
```

## Create Learner
```javascript
const learner = builder.createLearner();
```

## Learn Workflow
```javascript
const result = await learner.learnFromSequence(screenshots, {
  domain: 'login',
  name: 'Login flow'
});
// Returns: { patternId, stepCount, ruleCount, selectorCount, duration_ms }
```

## Apply Workflow
```javascript
const actionPlan = await learner.applyWorkflow(screenshot, patternId);
// Returns: { patternId, actions[], metadata }
```

## Generate Script
```javascript
const script = builder.generateWorkflowScript(actionPlan, 'javascript');
const json = builder.generateWorkflowScript(actionPlan, 'json');
```

## Pattern Management
```javascript
learner.listPatterns();              // List all patterns
learner.getPattern(patternId);       // Get pattern details
learner.mergePatterns([id1, id2]);   // Merge patterns
learner.getHistory(50);              // Get execution history
learner.clearPatterns();             // Clear all patterns
```

## Utilities
```javascript
builder.extractUIElements(screenshot);        // Get UI elements
builder.detectInteractions(before, after);    // Detect changes
builder.extractDataPattern('text');           // Identify data type
builder.comparePatterns(p1, p2);              // Compare workflows
builder.calculateElementSimilarity(e1, e2);   // Element similarity
```

## Constants

### Element Types
```javascript
builder.UI_ELEMENT_TYPES.BUTTON       // Button
builder.UI_ELEMENT_TYPES.TEXT_INPUT   // Text field
builder.UI_ELEMENT_TYPES.DROPDOWN     // Select dropdown
builder.UI_ELEMENT_TYPES.CHECKBOX     // Checkbox
builder.UI_ELEMENT_TYPES.LABEL        // Label
builder.UI_ELEMENT_TYPES.TABLE        // Table
builder.UI_ELEMENT_TYPES.FORM         // Form
builder.UI_ELEMENT_TYPES.MODAL        // Modal
builder.UI_ELEMENT_TYPES.LINK         // Link
builder.UI_ELEMENT_TYPES.IMAGE        // Image
builder.UI_ELEMENT_TYPES.ICON         // Icon
builder.UI_ELEMENT_TYPES.TEXT         // Text
builder.UI_ELEMENT_TYPES.MENU         // Menu
builder.UI_ELEMENT_TYPES.FIELD        // Field
```

### Interaction Types
```javascript
builder.INTERACTION_TYPES.CLICK       // Click
builder.INTERACTION_TYPES.TYPE        // Type text
builder.INTERACTION_TYPES.SELECT      // Select option
builder.INTERACTION_TYPES.SUBMIT      // Submit
builder.INTERACTION_TYPES.HOVER       // Hover
builder.INTERACTION_TYPES.SCROLL      // Scroll
builder.INTERACTION_TYPES.DRAG        // Drag
builder.INTERACTION_TYPES.WAIT        // Wait
builder.INTERACTION_TYPES.EXTRACT     // Extract
```

### Confidence
```javascript
builder.PATTERN_CONFIDENCE.HIGH    // 0.8
builder.PATTERN_CONFIDENCE.MEDIUM  // 0.6
builder.PATTERN_CONFIDENCE.LOW     // 0.4
```

## Typical Workflow

```javascript
// 1. Create learner
const learner = builder.createLearner();

// 2. Learn from examples
const learn = await learner.learnFromSequence([
  screen1, screen2, screen3, screen4
], { domain: 'login' });

// 3. Apply to new screenshot
const plan = await learner.applyWorkflow(newScreen, learn.patternId);

// 4. Check confidence
plan.actions.forEach(a => {
  if (a.confidence > 0.8) {
    console.log(`Execute: ${a.type} ${a.target.text}`);
  }
});

// 5. Optional: Generate script
const script = builder.generateWorkflowScript(plan, 'javascript');
```

## Data Pattern Types

```javascript
builder.extractDataPattern('2024-06-22');     // 'date' (YYYY-MM-DD)
builder.extractDataPattern('john@ex.com');    // 'email'
builder.extractDataPattern('555-123-4567');   // 'phone' (XXX-XXX-XXXX)
builder.extractDataPattern('99.99');          // 'currency'
builder.extractDataPattern('42');             // 'number'
builder.extractDataPattern('Hello');          // 'text'
```

## Action Object
```javascript
{
  order: 0,                          // Execution order
  type: 'click|type|select|...',     // Action type
  target: {
    id: 'elem_2',                    // Element ID
    text: 'Submit',                  // Element text
    position: { x: 170, y: 230 },    // Position
    type: 'button'                   // Element type
  },
  payload: {
    newText: 'value',                // For TYPE
    newState: 'selected'              // For SELECT
  },
  confidence: 0.92,                  // Confidence (0-1)
  warning: 'optional message'        // If present, be careful
}
```

## Pattern Object
```javascript
{
  id: 'pattern_1234567890',
  steps: [...],                      // Workflow steps
  rules: [...],                      // Generalization rules
  selectors: [...],                  // Element selectors
  metadata: {
    screenshotCount: 4,
    stepCount: 3,
    ruleCount: 2,
    learnedAt: 'ISO timestamp',
    sourceDomain: 'login'
  }
}
```

## Common Patterns

### Form Filling
```javascript
const filled = [emptyForm, nameEntered, emailEntered, submitted];
const result = await learner.learnFromSequence(filled);
const plan = await learner.applyWorkflow(newForm, result.patternId);
```

### Navigation
```javascript
const nav = [home, clicked, loading, destination];
const result = await learner.learnFromSequence(nav);
const plan = await learner.applyWorkflow(newHome, result.patternId);
```

### Multi-Step
```javascript
const combined = await Promise.all([
  learner.learnFromSequence(login),
  learner.learnFromSequence(setup),
  learner.learnFromSequence(purchase)
]);

const merged = learner.mergePatterns(
  combined.map(r => r.patternId)
);
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Low match rate | Train on more layouts, check confidence |
| Unmatched elements | Better screenshots, clearer text |
| Wrong element | More specific text, review positions |
| Pattern doesn't generalize | Train on variations, use merging |
| Low confidence scores | Verify OCR, improve screenshot quality |

## Performance Tips

- Keep screenshots <1MB
- Use consistent resolution
- Provide clear visual changes
- Train on representative examples
- Monitor match rates
- Test on sample before production

## Confidence Guidelines

| Score | Meaning | Action |
|-------|---------|--------|
| 0.9+ | Trust completely | Execute |
| 0.7-0.9 | Probably works | Execute with caution |
| 0.5-0.7 | Uncertain | Verify manually |
| <0.5 | Unlikely to work | Skip or retrain |

## Export Formats

### JavaScript (Puppeteer)
```javascript
const script = builder.generateWorkflowScript(actionPlan, 'javascript');
// Outputs: async function executeWorkflow() { ... }
```

### JSON (Universal)
```javascript
const json = builder.generateWorkflowScript(actionPlan, 'json');
const actions = JSON.parse(json);
// Outputs: Array of action objects
```

## Testing

```javascript
// Run tests
node lib/vision-workflow-builder.test.js

// Run examples
node lib/vision-workflow-builder-integration-example.js
```

## Size & Performance

| Metric | Value |
|--------|-------|
| Core library | 25KB, 932 lines |
| Tests | 19KB, 590 lines |
| Examples | 18KB, 445 lines |
| Docs | 1000+ lines |
| Learning time | 50-100ms per sequence |
| Apply time | 20-50ms per screenshot |
| Pattern size | 2-5KB each |
| Memory (100 patterns) | ~2MB |

## Error Handling

```javascript
try {
  const plan = await learner.applyWorkflow(screenshot, patternId);
  if (!plan) throw new Error('No pattern found');
  
  const lowConf = plan.actions.filter(a => a.confidence < 0.6);
  if (lowConf.length > 0) {
    console.warn('Low confidence actions detected');
  }
} catch (e) {
  console.error('Workflow execution failed:', e);
}
```

## Integration Examples

### With Puppeteer
```javascript
for (const action of actionPlan.actions) {
  if (action.type === 'click') {
    await page.click(`text=${action.target.text}`);
  } else if (action.type === 'type') {
    await page.type('input', action.payload.newText);
  }
}
```

### With Playwright
```javascript
for (const action of actionPlan.actions) {
  if (action.type === 'click') {
    await page.click(`text=${action.target.text}`);
  } else if (action.type === 'type') {
    await page.fill('input', action.payload.newText);
  }
}
```

## API Summary

| Function | Input | Output | Time |
|----------|-------|--------|------|
| `learnFromSequence` | screenshots[] | patternId | 50-100ms |
| `applyWorkflow` | screenshot | actions[] | 20-50ms |
| `extractUIElements` | screenshot | elements[] | <10ms |
| `detectInteractions` | 2 screenshots | interactions[] | <10ms |
| `generateWorkflowScript` | actionPlan | script | <5ms |
| `comparePatterns` | 2 patterns | comparison | <10ms |

## Documentation Files

- `VISION_WORKFLOW_BUILDER.md` - Complete API reference
- `VISION_WORKFLOW_BUILDER_GUIDE.md` - Integration guide
- `VISION_WORKFLOW_IMPLEMENTATION_SUMMARY.md` - Implementation details
- `vision-workflow-builder-integration-example.js` - 6 working examples
- `vision-workflow-builder.test.js` - 30+ test cases
