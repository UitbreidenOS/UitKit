# UI Automation Agent - Quick Reference

Fast lookup for common tasks and methods.

## Setup

```javascript
const { UIAutomationAgent } = require('./ui-automation-agent');
const puppeteer = require('puppeteer');

const browser = await puppeteer.launch();
const page = await browser.newPage();

const agent = new UIAutomationAgent({
  page,
  browser,
  visionEnabled: true,
  recordingEnabled: true,
});
```

## Common Tasks

### Navigate & Wait

```javascript
// Go to URL
await agent.navigate('https://example.com');

// Wait for element
await agent.waitForElement('#element', 'visible');

// Wait for element to be clickable
await agent.waitForElement('#button', 'clickable', 10000);

// Wait for element to be gone
await agent.waitForElement('.loader', 'gone', 5000);
```

### Take Screenshots

```javascript
// Capture full page
const ss = await agent.captureScreenshot({ fullPage: true });

// Capture viewport only
const ss = await agent.captureScreenshot({ fullPage: false });

// Analyze with Claude vision
const analysis = await agent.analyzeScreenshot(ss);

// Custom analysis prompt
const analysis = await agent.analyzeScreenshot(ss, {
  prompt: 'List all buttons on this page'
});
```

### Form Filling

```javascript
// Fill single field
await agent.fillForm('#email', 'test@example.com');

// Fill multiple fields
await agent.fillForm('#name', 'John Doe');
await agent.fillForm('#phone', '+1-555-0123');
await agent.fillForm('#message', 'Hello world');

// Using object syntax
await agent.fillForm({
  selector: '#username',
  value: 'testuser',
  delay: 50  // ms between characters
});
```

### Element Interaction

```javascript
// Click button
await agent.clickElement('#submit-btn');

// Click with wait after
await agent.clickElement('#next', { waitAfter: 2000 });

// Scroll page
await agent.scroll({ direction: 'down', amount: 500 });

// Scroll up
await agent.scroll({ direction: 'up', amount: 300 });
```

### Data Extraction

```javascript
// Extract from selectors
const data = await agent.extractData({
  title: 'h1',
  price: '.price',
  rating: '.rating',
  inStock: '.stock-status'
});

// Result format
// {
//   data: { title: '...', price: '...', ... },
//   errors: null,
//   count: 4
// }

// Extract from table
const tableData = await agent.extractTableData('table.products');
// Result: { headers: [...], rows: [...] }
```

### JavaScript Execution

```javascript
// Execute JS on page
const result = await agent.executeScript('return document.title');

// Get element count
const count = await agent.executeScript(
  'return document.querySelectorAll(".item").length'
);

// Modify page
await agent.executeScript(`
  document.querySelectorAll('button').forEach(btn => {
    btn.style.background = 'red';
  });
`);
```

## Session Management

```javascript
// Save session to file
agent.saveSession();

// Load previous session
agent.loadSession('sessionId');

// Get session summary
const summary = agent.getSummary();
// {
//   sessionId: '...',
//   actionsCount: 10,
//   screenshotsCount: 5,
//   interactionsCount: 8,
//   errorsCount: 0,
//   stats: {
//     successRate: 100,
//     totalDuration: 15234,
//     averageActionDuration: 1523
//   }
// }

// Get metrics
const rate = agent.getSuccessRate();        // 0-100
const total = agent.getTotalDuration();     // ms
const avg = agent.getAverageActionDuration(); // ms
```

## Reporting & Export

```javascript
// Export session as JSON
const json = agent.exportSession('json');

// Generate detailed report
const report = agent.generateReport();
// {
//   title: '...',
//   timestamp: '...',
//   summary: { ... },
//   timeline: [ ... ],
//   issues: [ ... ],
//   recommendations: [ ... ]
// }

// Get recommendations
const recommendations = agent.generateRecommendations();

// Close agent
await agent.close();
```

## Selectors

### Common CSS Selectors

```javascript
// By ID
'#submit'

// By class
'.button'
'.btn-primary'

// By tag
'button'
'input'

// By attribute
'input[type="email"]'
'button[aria-label="Submit"]'

// Combination
'form#login button.submit'
'div.card input[type="text"]'

// Pseudo-selectors
'button:nth-child(2)'
'input:first-of-type'
'div:last-child'

// Descendant
'.form input'
'table tbody tr'

// Child
'form > button'
'ul > li'
```

## Wait Conditions

```javascript
// Element is visible in viewport
'visible'

// Element is clickable
'clickable'

// Element exists in DOM
'present'

// Element is hidden/removed
'gone'

// Element stops moving
'stable'

// Text content changes
'text-change'
```

## Configuration Quick Access

```javascript
// Default timeout
CONFIG.DEFAULT_TIMEOUT  // 30000 ms

// Wait time
CONFIG.DEFAULT_WAIT_TIME  // 2000 ms

// Action delay
CONFIG.ACTION_DELAY  // 500 ms

// Screenshot quality
CONFIG.SCREENSHOT_QUALITY  // 90

// Max retries
CONFIG.MAX_RETRIES  // 3
```

## Error Handling

```javascript
// Try-catch
try {
  await agent.clickElement('#missing');
} catch (error) {
  console.error('Click failed:', error.message);
}

// Check session errors
const errors = agent.session.errors;
errors.forEach(err => {
  console.log(`${err.action}: ${err.message}`);
});

// Get failed actions
const failed = agent.session.actions.filter(a => a.status === 'error');
console.log(`${failed.length} actions failed`);
```

## Debugging

```javascript
// Print last action
const lastAction = agent.session.actions[agent.session.actions.length - 1];
console.log(lastAction);

// Print all interactions
agent.session.interactions.forEach(i => {
  console.log(`${i.type}: ${i.target}`);
});

// List all screenshots
agent.session.screenshots.forEach(s => {
  console.log(`${s.filename} (${s.size} bytes)`);
});

// See full session
console.log(JSON.stringify(agent.session, null, 2));
```

## Real-World Patterns

### Login + Verify

```javascript
await agent.navigate('https://app.example.com/login');
await agent.fillForm('#email', 'user@example.com');
await agent.fillForm('#password', 'pass123');
await agent.clickElement('#login');
await agent.waitForElement('.dashboard', 'visible');
const user = await agent.extractData({ name: '.user-name' });
```

### Search + Extract

```javascript
await agent.navigate('https://shop.example.com');
await agent.fillForm('input[placeholder="Search"]', 'laptop');
await agent.clickElement('button[type="submit"]');
await agent.waitForElement('.results', 'visible');
const products = await agent.extractData({
  name: '.product-name',
  price: '.product-price'
});
```

### Multi-page Scrape

```javascript
let page = 1;
const results = [];
while (page <= 10) {
  await agent.navigate(`https://site.com/page/${page}`);
  const data = await agent.extractData({ item: '.item' });
  results.push(...data);
  page++;
}
```

### Retry with Backoff

```javascript
for (let i = 0; i < 3; i++) {
  try {
    await agent.clickElement('#flaky-button');
    break;
  } catch (e) {
    if (i === 2) throw e;
    await new Promise(r => setTimeout(r, 1000 * (i + 1)));
  }
}
```

### Form Validation

```javascript
await agent.fillForm('#email', 'invalid');
await agent.clickElement('#submit');
const error = await agent.extractData({ 
  message: '.error-message' 
});
if (error.data.message) {
  console.log('Validation error:', error.data.message);
}
```

### Responsive Testing

```javascript
for (const size of [
  { w: 375, h: 667 },   // Mobile
  { w: 768, h: 1024 },  // Tablet
  { w: 1920, h: 1080 }  // Desktop
]) {
  await agent.page.setViewport({ width: size.w, height: size.h });
  const ss = await agent.captureScreenshot();
  // Analyze for each size
}
```

## Metrics & Analytics

```javascript
// Action success rate
const rate = agent.getSuccessRate();
console.log(`Success: ${rate}%`);

// Total time spent
const ms = agent.getTotalDuration();
console.log(`Total time: ${(ms / 1000).toFixed(1)}s`);

// Average action speed
const avg = agent.getAverageActionDuration();
console.log(`Avg action: ${avg}ms`);

// Action breakdown
const actions = agent.session.actions;
const clicks = actions.filter(a => a.type === 'click_element').length;
const fills = actions.filter(a => a.type === 'fill_form').length;
const extracts = actions.filter(a => a.type === 'extract_data').length;
console.log(`Clicks: ${clicks}, Fills: ${fills}, Extracts: ${extracts}`);
```

## Tips & Tricks

1. **Always capture after navigation**
   ```javascript
   await agent.navigate(url);
   const ss = await agent.captureScreenshot();
   ```

2. **Use unique IDs over classes**
   ```javascript
   // Better - ID is unique
   await agent.clickElement('#primary-button');
   
   // Avoid - class might match multiple
   await agent.clickElement('.button');
   ```

3. **Add waits for dynamic content**
   ```javascript
   await agent.fillForm('#search', 'query');
   await agent.clickElement('#search-btn');
   await agent.waitForElement('.results', 'visible', 10000);
   ```

4. **Extract data in batches**
   ```javascript
   // Good - one call with multiple selectors
   await agent.extractData({ f1, f2, f3, f4, f5 });
   
   // Avoid - multiple separate calls
   // for each selector
   ```

5. **Use vision for layout analysis**
   ```javascript
   const ss = await agent.captureScreenshot();
   const layout = await agent.analyzeScreenshot(ss, {
     prompt: 'What is the main purpose of this page?'
   });
   ```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Element not found | Use `waitForElement` with visible condition |
| Timeout waiting | Increase timeout: `waitForElement(sel, 'visible', 60000)` |
| Click fails | Scroll to element first: `page.evaluate(el => el.scrollIntoView())` |
| Form field not filled | Add delay between keystrokes: `delay: 100` |
| Screenshot is blank | Use `fullPage: true` to capture entire page |
| Data extraction empty | Verify selector with browser devtools |
| Action speed slow | Use headless mode and disable images |
| Vision API errors | Provide valid Claude API key and model ID |

## Resources

- Full docs: See `UI_AUTOMATION_AGENT_README.md`
- Examples: See `ui-automation-agent-integration-example.js`
- Tests: See `ui-automation-agent.test.js`
- Puppeteer: https://pptr.dev
- Playwright: https://playwright.dev
