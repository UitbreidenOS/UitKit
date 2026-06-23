# UI Automation Agent

Control browser and desktop UI via Claude vision + programmatic control. Enables agents to fill forms, click buttons, navigate websites, extract data, and test user interfaces with full session recording and audit trails.

## Features

### Core Capabilities
- **Screenshot Capture** - Full-page or windowed screenshots with metadata
- **Vision Analysis** - Claude vision API integration for UI understanding
- **Element Interaction** - Click, fill, scroll, type, select on any element
- **Form Automation** - Smart form filling with validation support
- **Data Extraction** - Extract text, tables, structured data from pages
- **Navigation** - URL navigation with wait conditions
- **JavaScript Execution** - Execute custom JS on page for advanced automation
- **Wait Conditions** - Visible, clickable, present, gone, stable checks
- **Session Recording** - Full action replay & audit trail

### Advanced Features
- Vision-based element detection
- Automatic scrolling into view
- Action retry with exponential backoff
- Session persistence and recovery
- Performance metrics (duration, success rate)
- Error logging and analytics
- Multi-viewport testing
- Table data extraction
- Custom wait conditions

## Installation

```bash
npm install puppeteer  # or playwright
```

## Quick Start

```javascript
const { UIAutomationAgent } = require('./ui-automation-agent');
const puppeteer = require('puppeteer');

// Setup
const browser = await puppeteer.launch();
const page = await browser.newPage();

// Create automation agent
const agent = new UIAutomationAgent({
  page,
  browser,
  visionClient: claudeVisionClient, // optional
  visionEnabled: true,
  recordingEnabled: true,
});

// Navigate and interact
await agent.navigate('https://example.com');
const screenshot = await agent.captureScreenshot();
await agent.fillForm('#email', 'test@example.com');
await agent.clickElement('#submit');
const data = await agent.extractData({ title: 'h1', price: '.price' });

// Export results
const report = agent.generateReport();
console.log(report);

await agent.close();
```

## API Reference

### Constructor

```javascript
new UIAutomationAgent(options)
```

**Options:**
- `page` (Object) - Puppeteer/Playwright page object
- `browser` (Object) - Puppeteer/Playwright browser object
- `visionClient` (Object) - Claude vision API client (optional)
- `visionEnabled` (Boolean) - Enable vision analysis (default: false)
- `recordingEnabled` (Boolean) - Record actions and interactions (default: true)
- `timeout` (Number) - Default timeout in ms (default: 30000)
- `maxRetries` (Number) - Max retries for flaky operations (default: 3)
- `screenshotDir` (String) - Directory for screenshots
- `sessionFile` (String) - Path to session JSON file

### Methods

#### Navigation

```javascript
// Navigate to URL
await agent.navigate(url, options)
// options: { waitUntil, timeout }
// Returns: { url, status, ok, timestamp }

// Wait for element
await agent.waitForElement(selector, condition, timeout)
// condition: 'visible' | 'clickable' | 'present' | 'gone' | 'stable'
// Returns: boolean
```

#### Screenshots & Vision

```javascript
// Capture screenshot
const screenshot = await agent.captureScreenshot(options)
// options: { fullPage, quality, type }
// Returns: { id, filepath, size, timestamp, url }

// Analyze with Claude vision
const analysis = await agent.analyzeScreenshot(screenshot, instructions)
// instructions: { prompt: '...' }
// Returns: { id, elements, suggestions, layout }
```

#### Element Interaction

```javascript
// Click element
const result = await agent.clickElement(selector, options)
// options: { waitAfter }
// Returns: { selector, clicked, timestamp }

// Fill form field
const result = await agent.fillForm(selector, value, options)
// Can also pass: { selector, value, delay }
// Returns: { selector, value, filled, timestamp }

// Execute JavaScript
const result = await agent.executeScript(code, args)
// Returns: result value from script

// Scroll page
const result = await agent.scroll(options)
// options: { direction, amount }
// Returns: { direction, amount, timestamp }
```

#### Data Extraction

```javascript
// Extract data from selectors
const result = await agent.extractData(selectors, options)
// selectors: { label1: 'selector1', label2: 'selector2' }
// options: { extractTable: true }
// Returns: { data: {...}, errors: [...], count }

// Extract from table
const tableData = await agent.extractTableData(selector)
// Returns: { headers: [], rows: [{...}, ...] }
```

#### Session Management

```javascript
// Save/load session
agent.saveSession()
agent.loadSession(sessionId)

// Record actions and errors
const actionId = agent.recordAction(type, details)
agent.updateAction(actionId, status, result)
agent.recordError(action, error)

// Get session info
const summary = agent.getSummary()
const rate = agent.getSuccessRate()
const duration = agent.getTotalDuration()
const avg = agent.getAverageActionDuration()

// Export session
const json = agent.exportSession('json')
const report = agent.generateReport()
const recommendations = agent.generateRecommendations()

// Close agent
await agent.close()
```

## Usage Examples

### Example 1: Login Automation

```javascript
const agent = new UIAutomationAgent({ page, browser });

await agent.navigate('https://example.com/login');

// With vision analysis
const screenshot = await agent.captureScreenshot();
const analysis = await agent.analyzeScreenshot(screenshot);

// Fill form
await agent.fillForm('#email', 'user@example.com');
await agent.fillForm('#password', 'securePass123!');

// Submit and wait
await agent.clickElement('#login-btn');
await agent.waitForElement('.dashboard', 'visible', 10000);

// Extract user info
const userData = await agent.extractData({
  name: '.user-name',
  email: '.user-email',
  status: '.account-status',
});

console.log('Logged in as:', userData.data);
```

### Example 2: E-commerce Purchase

```javascript
const agent = new UIAutomationAgent({ page, browser });

// Search for product
await agent.navigate('https://shop.example.com');
await agent.fillForm('input[placeholder="Search"]', 'laptop');
await agent.clickElement('button[type="submit"]');

// Wait and analyze results
await agent.waitForElement('.product-grid', 'visible');
await agent.clickElement('.product-card:nth-child(1)');

// Extract product info
const product = await agent.extractData({
  name: '.product-name',
  price: '.product-price',
  rating: '.product-rating',
});

// Add to cart and checkout
await agent.clickElement('#add-to-cart-btn');
await agent.clickElement('#checkout-btn');

// Fill checkout form
await agent.fillForm('#card-number', '4111111111111111');
await agent.fillForm('#card-expiry', '12/25');
await agent.clickElement('#place-order-btn');

// Confirm order
await agent.waitForElement('.order-confirmation', 'visible');
const order = await agent.extractData({
  orderNumber: '.order-number',
  total: '.order-total',
});

console.log('Order placed:', order.data);
```

### Example 3: Web Scraping

```javascript
const agent = new UIAutomationAgent({ page, browser });

const articles = [];
await agent.navigate('https://news.example.com');

for (let page = 1; page <= 5; page++) {
  await agent.waitForElement('.article-item', 'visible');

  // Get all articles on page
  const elements = await agent.page.$$('.article-item');
  
  for (let i = 0; i < elements.length; i++) {
    const selector = `.article-item:nth-child(${i + 1})`;
    const article = await agent.extractData({
      title: `${selector} .title`,
      author: `${selector} .author`,
      date: `${selector} .date`,
      summary: `${selector} .summary`,
    });
    
    if (article.data.title) {
      articles.push(article.data);
    }
  }

  // Next page
  if (page < 5) {
    await agent.clickElement('.pagination .next-btn');
  }
}

console.log(`Scraped ${articles.length} articles`);
```

### Example 4: Responsive UI Testing

```javascript
const agent = new UIAutomationAgent({ page, browser });

const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1920, height: 1080 },
];

const results = {};

for (const viewport of viewports) {
  await agent.page.setViewport(viewport);
  await agent.navigate('https://example.com');

  // Capture and analyze
  const screenshot = await agent.captureScreenshot();
  const analysis = await agent.analyzeScreenshot(screenshot, {
    prompt: `Check if this ${viewport.name} layout is responsive`,
  });

  // Test visibility
  const visible = await agent.waitForElement('.main-content', 'visible', 5000);
  
  results[viewport.name] = {
    visible,
    analysis: analysis.suggestions,
  };
}

console.log('Responsive test results:', results);
```

### Example 5: Error Handling with Retry

```javascript
const agent = new UIAutomationAgent({ 
  page, 
  browser,
  maxRetries: 3 
});

const retryWithBackoff = async (fn, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.log(`Attempt ${attempt} failed: ${error.message}`);
      if (attempt === maxRetries) throw error;
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
};

try {
  await agent.navigate('https://flaky-app.example.com');

  // Retry clicking element that may not be ready
  await retryWithBackoff(async () => {
    await agent.clickElement('#sometimes-missing-btn');
  });

  // Retry form fill
  await retryWithBackoff(async () => {
    await agent.fillForm('#dynamic-field', 'value');
  });

  console.log('Success!');
} catch (error) {
  console.error('Failed after retries:', error.message);
}
```

## Session Recording & Replay

### Capture Session Data

```javascript
const agent = new UIAutomationAgent({ 
  recordingEnabled: true 
});

// All actions are recorded automatically
await agent.navigate('https://example.com');
await agent.clickElement('#btn');
await agent.fillForm('#field', 'value');

// Save session
agent.saveSession();
```

### Export & Analyze

```javascript
// Export as JSON
const json = agent.exportSession('json');
console.log(JSON.stringify(json, null, 2));

// Generate report
const report = agent.generateReport();
console.log(report);
// {
//   title: 'UI Automation Session Report',
//   summary: { ... },
//   timeline: [ ... ],
//   issues: [ ... ],
//   recommendations: [ ... ]
// }

// Get summary
const summary = agent.getSummary();
console.log(`Success rate: ${summary.stats.successRate}%`);
console.log(`Total duration: ${summary.stats.totalDuration}ms`);
console.log(`Avg action duration: ${summary.stats.averageActionDuration}ms`);
```

## Constants

### Interaction Types

```javascript
INTERACTION_TYPES = {
  CLICK: 'click',
  FILL: 'fill',
  SELECT: 'select',
  SCROLL: 'scroll',
  HOVER: 'hover',
  DRAG: 'drag',
  TYPE: 'type',
  WAIT: 'wait',
  EXTRACT: 'extract',
  NAVIGATE: 'navigate',
}
```

### Element Types

```javascript
ELEMENT_TYPES = {
  BUTTON: 'button',
  INPUT: 'input',
  LINK: 'link',
  SELECT: 'select',
  TEXTAREA: 'textarea',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  TABLE: 'table',
  FORM: 'form',
  CONTAINER: 'container',
}
```

### Wait Conditions

```javascript
WAIT_CONDITIONS = {
  VISIBLE: 'visible',      // Element is visible in viewport
  CLICKABLE: 'clickable',  // Element is clickable
  PRESENT: 'present',      // Element exists in DOM
  GONE: 'gone',            // Element is removed
  STABLE: 'stable',        // Element stops moving
  TEXT_CHANGE: 'text-change', // Text content changes
}
```

## Configuration

```javascript
CONFIG = {
  DEFAULT_TIMEOUT: 30000,           // 30 seconds
  DEFAULT_WAIT_TIME: 2000,          // 2 seconds
  SCREENSHOT_QUALITY: 90,           // PNG quality
  MAX_RETRIES: 3,                   // Retry attempts
  VISION_API_TIMEOUT: 60000,        // Vision API timeout
  ELEMENT_VISIBILITY_THRESHOLD: 0.5, // Visibility %
  SCROLL_PADDING: 50,               // Scroll buffer (px)
  ACTION_DELAY: 500,                // Delay between actions
}
```

## Best Practices

### 1. Wait for Elements

Always wait for elements before interacting:

```javascript
await agent.waitForElement(selector, 'clickable', 5000);
await agent.clickElement(selector);
```

### 2. Use Unique Selectors

Prefer specific, unique selectors:

```javascript
// Good
await agent.clickElement('#submit-btn');

// Bad
await agent.clickElement('button');
```

### 3. Handle Errors Gracefully

```javascript
try {
  await agent.fillForm('#optional-field', 'value');
} catch (error) {
  console.log('Field not found (optional)', error.message);
}
```

### 4. Add Delays Between Actions

```javascript
await agent.fillForm('#field1', 'value1');
await new Promise(r => setTimeout(r, 500));
await agent.fillForm('#field2', 'value2');
```

### 5. Use Vision for Complex Pages

```javascript
const screenshot = await agent.captureScreenshot();
const analysis = await agent.analyzeScreenshot(screenshot, {
  prompt: 'What are the main sections of this page?'
});
```

### 6. Record Sessions for Auditing

```javascript
const agent = new UIAutomationAgent({ 
  recordingEnabled: true 
});

// ... automation ...

const report = agent.generateReport();
// Share report for audit trail
```

## Troubleshooting

### Element Not Found

```javascript
// Check if element exists
await agent.waitForElement(selector, 'present', 5000);

// Use vision to find elements
const screenshot = await agent.captureScreenshot();
const analysis = await agent.analyzeScreenshot(screenshot);
```

### Timeout Issues

```javascript
// Increase timeout
await agent.waitForElement(selector, 'visible', 60000);

// Or scroll into view first
await agent.page.evaluate(sel => {
  document.querySelector(sel).scrollIntoView();
}, selector);
```

### Flaky Elements

```javascript
// Use retry logic
const retryClick = async (selector) => {
  for (let i = 0; i < 3; i++) {
    try {
      await agent.clickElement(selector);
      return;
    } catch (e) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
};
```

## Performance Tips

1. **Use headless mode** for faster execution
2. **Disable images** to reduce bandwidth
3. **Minimize waits** - only wait when necessary
4. **Use unique selectors** to speed up element detection
5. **Extract data in bulk** instead of one-by-one
6. **Cache screenshots** if analyzing multiple times

## Limitations

- Requires Puppeteer/Playwright setup
- Vision analysis requires Claude API key
- Cannot interact with native OS dialogs
- JavaScript execution limited to page context
- No native keyboard shortcuts support
- File uploads limited to local files

## See Also

- `ui-automation-agent-integration-example.js` - Real-world examples
- `ui-automation-agent.test.js` - Test suite and usage patterns
- Puppeteer docs: https://pptr.dev
- Playwright docs: https://playwright.dev
