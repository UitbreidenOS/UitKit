# Vision Workflow Builder - Complete Integration Guide

Learn UI automation workflows from screenshot sequences without coding. This system uses computer vision and pattern learning to automate any UI interaction.

## What It Does

Take a series of screenshots showing user interactions and teach the system how to replicate those interactions:

```
Screenshot 1: Login page
    ↓ (user enters email)
Screenshot 2: Email entered
    ↓ (user clicks submit)
Screenshot 3: Dashboard loaded

→ System learns the pattern and can apply it to new login flows
```

## Key Capabilities

- **Zero-code UI Automation**: Show, don't tell. No need to write selectors or code.
- **Screenshot Learning**: Works with any screenshot format (PNG, JPG, etc.)
- **Pattern Generalization**: Learns to apply patterns across different UI layouts
- **Smart Element Matching**: Uses text, position, and visual similarity to find UI elements
- **Data Pattern Recognition**: Automatically identifies emails, phones, dates, currencies
- **Workflow Merging**: Combine multiple workflows into single composite pattern
- **Script Generation**: Export as JavaScript or JSON for integration with test frameworks
- **Confidence Scoring**: Rates likelihood of success for each action

## Quick Start

### 1. Install

The module is part of Claudient. Import it in your project:

```javascript
const builder = require('./lib/vision-workflow-builder');
```

### 2. Learn a Workflow

```javascript
// Create learner instance
const learner = builder.createLearner();

// Provide screenshot sequence showing desired interaction
const screenshots = [
  screenshot1, // initial state
  screenshot2, // after first interaction
  screenshot3, // after second interaction
  screenshot4, // final state
];

const result = await learner.learnFromSequence(screenshots, {
  domain: 'login-system',
  name: 'User login flow',
});

console.log(result.patternId); // Use this pattern ID later
```

### 3. Apply the Workflow

```javascript
// Get actions for a new screenshot
const actionPlan = await learner.applyWorkflow(newScreenshot, result.patternId);

// Execute each action
actionPlan.actions.forEach(action => {
  console.log(`Action: ${action.type} on "${action.target.text}"`);
  console.log(`Confidence: ${(action.confidence * 100).toFixed(0)}%`);
});
```

### 4. Generate Script (Optional)

```javascript
// Generate JavaScript automation script
const script = builder.generateWorkflowScript(actionPlan, 'javascript');

// Or get JSON for integration with other tools
const json = builder.generateWorkflowScript(actionPlan, 'json');
```

## How Screenshot Analysis Works

### Step 1: Element Detection

The system extracts UI elements from each screenshot:

```
Input: Screenshot image
  ↓
Vision Analysis
  - Detect text regions (buttons, labels, inputs)
  - Identify visual elements (images, icons)
  - Extract positions and properties
  ↓
Output: List of UI elements with:
  - ID, type, text content
  - Bounding boxes and center positions
  - Detection confidence
  - Clickability and state
```

### Step 2: Interaction Detection

Between consecutive screenshots, the system identifies what changed:

```
Compare Screenshot N → Screenshot N+1
  - Which elements disappeared/appeared?
  - Did any text change?
  - Did element state change?
  - Did page scroll?
  ↓
Inferred Interactions:
  - Click on element X
  - Type "text" into field Y
  - Select option from dropdown Z
  - Wait for page load
```

### Step 3: Pattern Learning

Group all interactions into reusable workflow steps:

```
Step 1: Click "Login" button
Step 2: Type email into "Email" field
Step 3: Type password into "Password" field
Step 4: Click "Submit" button
Step 5: Wait for dashboard to load
```

### Step 4: Pattern Generalization

Create fuzzy matching rules that work on different layouts:

```
Original: "Email" field at (100, 200)
Generalized: Any text input field containing "email" text

Original: "Submit" button with text "Submit"
Generalized: Any button containing "submit" text (case-insensitive)
```

### Step 5: Application to New Screenshots

When applying to a new screenshot:

1. Try exact matches first (high confidence)
2. Fall back to fuzzy matches (medium confidence)
3. Skip unmatched elements (with warning)
4. Generate ordered action plan

## Real-World Examples

### Example 1: E-Commerce Checkout

**Learn from:**
1. Product page → Cart page
2. Cart page → Shipping form
3. Shipping form → Payment page
4. Payment page → Confirmation

**Apply to:**
- Different products
- Different stores
- Different payment methods

**Generated Actions:**
```
1. Click "Add to Cart"
2. Click "Proceed to Checkout"
3. Type shipping address
4. Select shipping method
5. Enter payment details
6. Submit order
```

### Example 2: Data Entry Form

**Learn from:**
- Empty form → Form filled with data

**Detected Data Patterns:**
- Name: "John Doe" (text)
- Email: "john@example.com" (email)
- Phone: "555-123-4567" (phone)
- Birth Date: "1990-05-15" (date)

**Apply to:**
- Different form layouts
- Different data values

### Example 3: Multi-Step Process

**Learn from:**
1. Login page → Authenticated dashboard
2. Dashboard → Settings page
3. Settings → Profile editor
4. Profile → Changes saved confirmation

**Merge patterns:**
- Login workflow
- Navigation workflow
- Settings workflow
- Save workflow

**Result:** Complete end-to-end automation

## API Overview

### Creating a Learner

```javascript
const learner = builder.createLearner();
```

Methods:
- `learnFromSequence(screenshots, metadata)` - Learn from screenshot sequence
- `applyWorkflow(screenshot, patternId)` - Apply pattern to new screenshot
- `listPatterns()` - List all learned patterns
- `getPattern(patternId)` - Get pattern details
- `mergePatterns(patternIds)` - Combine multiple patterns
- `getHistory(limit)` - View execution history
- `clearPatterns()` - Remove all patterns

### Utility Functions

```javascript
builder.extractUIElements(screenshot);      // Get UI elements
builder.detectInteractions(before, after);  // Find interactions
builder.extractDataPattern(text);           // Identify data type
builder.comparePatterns(pattern1, pattern2); // Compare workflows
builder.generateWorkflowScript(plan, fmt);  // Export script
```

## Understanding Confidence Scores

Each action has a confidence score (0-1):

- **0.9-1.0** (High): Exact text match, same element type
- **0.7-0.9** (Medium): Fuzzy text match or position-based
- **0.5-0.7** (Low): Weak similarity, should verify manually
- **<0.5** (Very Low): Unable to match, action may fail

Example:
```javascript
{
  type: 'click',
  target: { text: 'Submit' },
  confidence: 0.95  // High confidence
}

{
  type: 'type',
  target: { text: 'Email Field' },
  confidence: 0.68  // Medium - verify works
}

{
  type: 'click',
  target: { text: 'Unknown Element' },
  confidence: 0.30  // Very low - likely won't work
}
```

## Handling Different UI Layouts

The system uses multiple matching strategies:

1. **Exact Text Matching** (90%+ confidence)
2. **Type + Position Matching** (70-80% confidence)
3. **Fuzzy Text Matching** (60-70% confidence)
4. **Type Matching Only** (50-60% confidence)

## Integration with Test Frameworks

### With Puppeteer

```javascript
const puppeteer = require('puppeteer');
const actionPlan = await learner.applyWorkflow(screenshot, patternId);

for (const action of actionPlan.actions) {
  switch (action.type) {
    case 'click':
      await page.click(`text=${action.target.text}`);
      break;
    case 'type':
      await page.type('input', action.payload.newText);
      break;
  }
  await page.waitForTimeout(300);
}
```

### With Playwright

```javascript
const { chromium } = require('playwright');
const actionPlan = await learner.applyWorkflow(screenshot, patternId);

for (const action of actionPlan.actions) {
  switch (action.type) {
    case 'click':
      await page.click(`text=${action.target.text}`);
      break;
    case 'type':
      await page.fill('input', action.payload.newText);
      break;
  }
}
```

## Best Practices

### 1. Provide Clear Screenshot Sequences

✓ Good:
- Empty login form
- Email entered
- Password entered
- Submit button clicked
- Dashboard loaded

✗ Bad:
- Login form
- Dashboard
(Missing intermediate steps makes it hard to infer interactions)

### 2. Use Consistent Layouts for Learning

✓ Good: Learn from similar UI designs (same site, same resolution)
✗ Bad: Mix desktop and mobile screenshots

### 3. Check Confidence Scores

```javascript
const actionPlan = await learner.applyWorkflow(screenshot, patternId);
const lowConfidence = actionPlan.actions.filter(a => a.confidence < 0.6);

if (lowConfidence.length > 0) {
  console.warn('Some actions have low confidence');
}
```

### 4. Monitor Match Rates

```javascript
const actionPlan = await learner.applyWorkflow(screenshot, patternId);
const matchRate = parseFloat(actionPlan.metadata.matchRate);

if (matchRate < 0.7) {
  console.warn('Pattern match rate is low, may need retraining');
}
```

### 5. Test Before Production

```javascript
const testScreenshots = [...];
for (const test of testScreenshots) {
  const plan = await learner.applyWorkflow(test, patternId);
  if (parseFloat(plan.metadata.matchRate) < 0.8) {
    console.error('Pattern failed on test screenshot');
    return false;
  }
}
```

## Troubleshooting

### Problem: Low match rate
- **Cause:** Layout differences
- **Solution:** Train on more diverse layouts

### Problem: Unmatched elements
- **Cause:** Element text changed or not detected
- **Solution:** Provide clearer screenshots

### Problem: Wrong element selected
- **Cause:** Multiple elements with similar text
- **Solution:** Use more specific text

### Problem: Pattern doesn't generalize
- **Cause:** Pattern was too specific to training layout
- **Solution:** Train on multiple variations

## Performance

- **Learning Time:** ~50-100ms per screenshot sequence
- **Application Time:** ~20-50ms per new screenshot
- **Pattern Size:** ~2-5KB per learned workflow
- **Memory Usage:** ~1-2MB for 100 patterns

## Limitations

- Requires clear visual changes between screenshots
- Works best with text-based element identification
- May struggle with dynamic/animated content
- Limited to 2D layouts

## License

Part of Claudient knowledge system.
