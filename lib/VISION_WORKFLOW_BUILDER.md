# Vision Workflow Builder

Build UI automation workflows from screenshot sequences without coding. The system learns user interaction patterns by analyzing visual changes and applies those patterns to new screenshots.

## Features

- **Screenshot Sequence Learning**: Learn workflows by showing example interactions
- **UI Element Detection**: Automatically identify buttons, forms, inputs, labels, and more
- **Interaction Recognition**: Detect clicks, typing, selections, and navigation
- **Pattern Generalization**: Extract reusable rules from learned patterns
- **Workflow Application**: Apply learned patterns to new screenshots with fuzzy matching
- **Data Pattern Recognition**: Identify email, phone, date, currency patterns
- **Script Generation**: Export workflows as JavaScript or JSON automation scripts
- **Pattern Comparison**: Analyze similarity between different learned workflows

## Architecture

```
Vision Workflow Builder
├── UI Element Detection (extractUIElements)
│   ├── Text Region Analysis
│   ├── Element Classification
│   └── Property Extraction
├── Interaction Detection (detectInteractions)
│   ├── Element Matching
│   ├── Change Detection
│   └── Interaction Type Classification
├── Pattern Learning (learnWorkflowPattern)
│   ├── Step Extraction
│   ├── Context Capture
│   └── Rule Generation
├── Pattern Application (applyPatternToScreenshot)
│   ├── Element Matching
│   ├── Fuzzy Matching Fallback
│   └── Action Plan Generation
└── Workflow Orchestration (createLearner)
    ├── Pattern Storage
    ├── History Tracking
    └── Pattern Merging
```

## Quick Start

### Learn a Workflow

```javascript
const builder = require('./vision-workflow-builder');

// Create learner instance
const learner = builder.createLearner();

// Show example interaction sequence (screenshots in order)
const screenshots = [
  loginPageScreenshot,
  emailFilledScreenshot,
  dashboardScreenshot,
];

const result = await learner.learnFromSequence(screenshots, {
  domain: 'login-system',
});

console.log(result);
// {
//   patternId: 'pattern_1234567890',
//   stepCount: 3,
//   ruleCount: 2,
//   selectorCount: 2,
//   duration_ms: 45.23,
//   timestamp: '2026-06-22T10:30:00.000Z'
// }
```

### Apply the Learned Workflow

```javascript
// Get actions for a new screenshot
const actionPlan = await learner.applyWorkflow(newScreenshot, 'pattern_1234567890');

console.log(actionPlan);
// {
//   patternId: 'pattern_1234567890',
//   actions: [
//     {
//       order: 0,
//       type: 'click',
//       target: { id: 'elem_2', text: 'Email', position: {...} },
//       confidence: 0.92
//     },
//     {
//       order: 1,
//       type: 'type',
//       target: { id: 'elem_3', text: 'Email Input' },
//       payload: { newText: 'user@example.com' },
//       confidence: 0.88
//     },
//     ...
//   ],
//   metadata: {
//     matchedSteps: 3,
//     totalSteps: 3,
//     matchRate: '1.00',
//     duration_ms: 23.45
//   }
// }
```

### Generate Automation Script

```javascript
const script = builder.generateWorkflowScript(actionPlan, 'javascript');

// Or export as JSON for other tools
const jsonScript = builder.generateWorkflowScript(actionPlan, 'json');
```

## API Reference

### Core Functions

#### `extractUIElements(screenshot)`

Extract all UI elements from a screenshot.

**Parameters:**
- `screenshot` (Object): Screenshot data with visionData and visualData arrays
  - `visionData` (Array): Text detection results from vision API
  - `visualData` (Array): Visual element detection results

**Returns:** Array of UI elements with:
- `id`: Unique element identifier
- `type`: Element type (button, input, label, etc.)
- `text`: Extracted text content
- `bounds`: Bounding box coordinates
- `position`: Center position (x, y)
- `confidence`: Detection confidence (0-1)
- `properties`: Visual properties (size, color, style, clickable)

**Example:**
```javascript
const elements = builder.extractUIElements(screenshot);
// [
//   {
//     id: 'elem_0',
//     type: 'button',
//     text: 'Submit',
//     bounds: { left: 120, top: 210, width: 100, height: 40 },
//     position: { x: 170, y: 230 },
//     confidence: 0.94,
//     properties: { size: { width: 100, height: 40 }, clickable: true }
//   },
//   ...
// ]
```

#### `detectInteractions(prevScreenshot, currScreenshot, prevElements, currElements)`

Detect what interactions happened between two screenshots.

**Parameters:**
- `prevScreenshot`: Previous screenshot
- `currScreenshot`: Current screenshot
- `prevElements`: Elements from previous screenshot
- `currElements`: Elements from current screenshot

**Returns:** Array of detected interactions:
```javascript
[
  {
    type: 'click',
    targetId: 'elem_2',
    targetText: 'Email',
    targetType: 'text_input',
    position: { x: 170, y: 120 },
    confidence: 0.90,
    reason: 'Element state changed'
  },
  {
    type: 'type',
    targetId: 'elem_3',
    targetText: 'Email Input',
    newText: 'user@example.com',
    confidence: 0.88,
    reason: 'Text content changed'
  },
  ...
]
```

#### `learnWorkflowPattern(screenshots, elementSequences)`

Learn a workflow pattern from a sequence of screenshots.

**Parameters:**
- `screenshots` (Array): Array of screenshots in order
- `elementSequences` (Array): Corresponding UI elements for each screenshot

**Returns:** Pattern object with:
- `id`: Unique pattern identifier
- `steps`: Array of workflow steps
- `metadata`: Learning metadata (screenshotCount, duration, etc.)

#### `generalizePattern(pattern)`

Generalize a learned pattern for reuse on different UI layouts.

**Parameters:**
- `pattern`: Learned pattern from `learnWorkflowPattern()`

**Returns:** Generalized pattern with:
- `rules`: Reusable extraction rules
- `selectors`: Fuzzy element selectors
- `steps`: Original steps with enhanced matching

#### `applyPatternToScreenshot(pattern, newScreenshot, newElements)`

Apply a learned pattern to a new screenshot.

**Parameters:**
- `pattern`: Learned pattern
- `newScreenshot`: New screenshot to apply pattern to
- `newElements`: UI elements extracted from new screenshot

**Returns:** Action plan with:
- `patternId`: Source pattern ID
- `actions`: Array of actions to execute
- `metadata`: Execution metadata (matchRate, confidence, etc.)

### Learner Instance

#### `createLearner()`

Create a workflow learner instance.

**Returns:** Learner object with methods:

##### `learner.learnFromSequence(screenshots, metadata)`

Learn workflow from screenshot sequence.

**Parameters:**
- `screenshots` (Array): Screenshots in order
- `metadata` (Object): Optional metadata (domain, name, etc.)

**Returns:** Learning result with patternId and statistics

##### `learner.applyWorkflow(screenshot, patternId)`

Apply learned pattern to new screenshot.

**Parameters:**
- `screenshot`: New screenshot
- `patternId`: Pattern to apply

**Returns:** Action plan for execution

##### `learner.listPatterns()`

List all learned patterns.

**Returns:** Array of pattern summaries

##### `learner.getPattern(patternId)`

Get full pattern details.

**Parameters:**
- `patternId`: Pattern ID

**Returns:** Complete pattern object

##### `learner.mergePatterns(patternIds)`

Merge multiple patterns into composite workflow.

**Parameters:**
- `patternIds` (Array): Pattern IDs to merge

**Returns:** Result with merged pattern ID and step count

##### `learner.getHistory(limit)`

Get execution history.

**Parameters:**
- `limit` (Number): Max entries to return (default: 50)

**Returns:** Array of historical operations

##### `learner.clearPatterns()`

Clear all stored patterns.

**Returns:** Confirmation with timestamp

### Utilities

#### `generateWorkflowScript(actionPlan, format)`

Generate executable workflow script.

**Parameters:**
- `actionPlan`: Action plan from pattern application
- `format`: 'javascript' or 'json'

**Returns:** Script string

#### `comparePatterns(pattern1, pattern2)`

Compare two patterns for similarity.

**Parameters:**
- `pattern1`: First pattern
- `pattern2`: Second pattern

**Returns:** Comparison object with:
- `commonSteps`: Shared workflow steps
- `uniqueToPattern1`: Steps only in first pattern
- `uniqueToPattern2`: Steps only in second pattern
- `similarity`: Similarity score (0-1)

#### `extractDataPattern(text)`

Identify data type/format of text.

**Parameters:**
- `text` (String): Text to analyze

**Returns:** Pattern object:
```javascript
{
  type: 'date|email|phone|currency|number|text',
  format: 'YYYY-MM-DD|user@domain.com|XXX-XXX-XXXX|...'
}
```

#### `calculateElementSimilarity(elem1, elem2)`

Calculate similarity between two UI elements.

**Parameters:**
- `elem1`: First element
- `elem2`: Second element

**Returns:** Similarity score (0-1)

## Constants

### UI Element Types

```javascript
{
  BUTTON: 'button',
  TEXT_INPUT: 'text_input',
  CHECKBOX: 'checkbox',
  DROPDOWN: 'dropdown',
  TABLE: 'table',
  FORM: 'form',
  IMAGE: 'image',
  LINK: 'link',
  MODAL: 'modal',
  MENU: 'menu',
  LABEL: 'label',
  TEXT: 'text',
  ICON: 'icon',
  FIELD: 'field',
}
```

### Interaction Types

```javascript
{
  CLICK: 'click',
  TYPE: 'type',
  SELECT: 'select',
  SUBMIT: 'submit',
  HOVER: 'hover',
  SCROLL: 'scroll',
  DRAG: 'drag',
  WAIT: 'wait',
  EXTRACT: 'extract',
}
```

### Confidence Thresholds

```javascript
{
  HIGH: 0.8,
  MEDIUM: 0.6,
  LOW: 0.4,
}
```

## Use Cases

### 1. E-Commerce Checkout Flow

```javascript
const learner = builder.createLearner();

// Show checkout workflow
const checkoutSequence = [
  cartPageScreenshot,
  shippingFormFilledScreenshot,
  paymentPageScreenshot,
  confirmationPageScreenshot,
];

const result = await learner.learnFromSequence(checkoutSequence, {
  domain: 'ecommerce-checkout',
  version: '2.0',
});

// Reuse on different products
const actionPlan = await learner.applyWorkflow(newProductPage, result.patternId);
```

### 2. Form Filling Automation

```javascript
// Learn from multiple form-filling examples
const forms = [
  addressFormSequence,
  contactFormSequence,
  surveyFormSequence,
];

const formPatterns = await Promise.all(
  forms.map(seq => learner.learnFromSequence(seq))
);

// Merge similar patterns
const mergedForm = learner.mergePatterns(formPatterns.map(p => p.patternId));
```

### 3. Data Entry with Pattern Recognition

```javascript
const action = await learner.applyWorkflow(screenshot, patternId);

// Extract identified data patterns
action.actions.forEach(action => {
  if (action.type === 'type' && action.payload.newText) {
    const dataPattern = builder.extractDataPattern(action.payload.newText);
    console.log(`Found ${dataPattern.type}: ${action.payload.newText}`);
  }
});
```

### 4. Test Automation Script Generation

```javascript
const actionPlan = await learner.applyWorkflow(screenshot, patternId);
const testScript = builder.generateWorkflowScript(actionPlan, 'javascript');

// Save and run in CI/CD pipeline
require('fs').writeFileSync('automation-test.js', testScript);
```

## How It Works

### Learning Phase

1. **Screenshot Analysis**: Extract UI elements (text, buttons, forms, images)
2. **Sequence Comparison**: Analyze changes between consecutive screenshots
3. **Interaction Detection**: Identify what actions caused the changes
4. **Pattern Extraction**: Generalize the sequence into reusable steps
5. **Rule Generation**: Create selectors and conditions for element matching

### Application Phase

1. **Element Extraction**: Find UI elements in new screenshot
2. **Exact Matching**: Try to match learned pattern steps precisely
3. **Fuzzy Matching**: Use similarity heuristics for layout variations
4. **Action Plan**: Generate ordered list of interactions
5. **Confidence Scoring**: Rate likelihood of success for each action

### Matching Strategy

- **Text-based**: Match elements by extracted text (high confidence)
- **Type-based**: Match by element type (button, input, label)
- **Position-based**: Match by relative position (for layout variations)
- **Fuzzy**: Levenshtein-like string similarity for typos/variations
- **Fallback**: Skip unmatched elements with warning

## Performance

- **Learning Time**: ~50-100ms per screenshot sequence
- **Application Time**: ~20-50ms per new screenshot
- **Pattern Size**: ~2-5KB per learned workflow
- **Memory Usage**: ~1-2MB for 100 patterns

## Limitations

- Requires clear visual changes between screenshots
- Works best with consistent UI layouts
- May struggle with dynamic/animated content
- Limited to text-based element identification
- Doesn't handle complex multi-step modals well yet

## Advanced Features

### Pattern Merging

Combine multiple workflows into a composite pattern:

```javascript
const merged = learner.mergePatterns([
  pattern1Id,
  pattern2Id,
  pattern3Id,
]);
```

### Pattern Comparison

Analyze similarity between workflows:

```javascript
const comparison = builder.comparePatterns(pattern1, pattern2);
console.log(`Similarity: ${comparison.similarity}`);
console.log(`Common steps: ${comparison.commonSteps.length}`);
```

### History Tracking

Monitor all operations:

```javascript
const history = learner.getHistory(20);
history.forEach(h => {
  console.log(`${h.action} at ${h.result.timestamp}`);
});
```

## Testing

Run the test suite:

```bash
node lib/vision-workflow-builder.test.js
```

Or with a test framework:

```bash
npm test -- vision-workflow-builder
```

## Integration Examples

### With Puppeteer

```javascript
const script = builder.generateWorkflowScript(actionPlan, 'javascript');
// Adapt script for your Puppeteer setup
```

### With Playwright

```javascript
const actionPlan = await learner.applyWorkflow(screenshot, patternId);
// Iterate actions and map to Playwright commands
actionPlan.actions.forEach(action => {
  switch (action.type) {
    case 'click':
      page.click(selector);
      break;
    case 'type':
      page.fill(selector, action.payload.newText);
      break;
  }
});
```

### With Claude Vision API

```javascript
const screenshot = {
  visionData: await claudeVision.analyzeImage(imageBuffer),
  visualData: await customVisionAPI.detectElements(imageBuffer),
};

const actionPlan = await learner.applyWorkflow(screenshot, patternId);
```

## Future Enhancements

- [ ] Screenshot cropping for element isolation
- [ ] Time-aware workflow optimization
- [ ] Natural language workflow descriptions
- [ ] Cross-browser pattern adaptation
- [ ] Mobile/responsive layout handling
- [ ] Video input support (extract frames)
- [ ] Real-time pattern learning
- [ ] ML-based element classifier
- [ ] Workflow visualization/replay
- [ ] Performance analytics

## License

Part of Claudient knowledge system. See main LICENSE file.
