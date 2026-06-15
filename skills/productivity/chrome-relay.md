---
name: chrome-relay
description: "Chrome Relay: browser automation via Chrome DevTools Protocol, web scraping, form filling, screenshot capture, performance auditing, and headless Chrome workflows"
updated: 2026-06-13
---

# Chrome Relay — Browser Automation via CDP

## When to activate
- Automating browser interactions (login, form filling, navigation sequences)
- Web scraping dynamic content that requires JavaScript rendering
- Taking screenshots of web pages at various viewport sizes
- Auditing web performance (Lighthouse metrics) from within Claude Code
- Monitoring web page changes (price tracking, content updates, availability)
- Testing web applications end-to-end without a full test framework

## When NOT to use
- Simple HTTP requests where `curl` or `fetch` suffices (static APIs)
- API testing where dedicated tools (Postman, HTTPie) are better
- When Playwright MCP is already configured and sufficient
- Scraping static HTML that doesn't require JavaScript execution
- Production load testing (use k6, Artillery instead)

## Instructions

### 1. Setup — Chrome DevTools Protocol

```bash
# Launch Chrome with remote debugging
google-chrome --remote-debugging-port=9222 --headless=new

# Or use Puppeteer (managed Chrome)
npm install puppeteer
```

**Connect from Claude Code:**
```javascript
const puppeteer = require('puppeteer');

async function connectBrowser() {
  // Option 1: Launch new browser
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });
  
  // Option 2: Connect to existing Chrome
  const browser = await puppeteer.connect({
    browserURL: 'http://localhost:9222'
  });
  
  return browser;
}
```

### 2. Page Navigation & Interaction

```javascript
async function scrapePage(url) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Navigate and wait for content
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  // Extract content
  const data = await page.evaluate(() => {
    return {
      title: document.title,
      h1: document.querySelector('h1')?.textContent,
      links: [...document.querySelectorAll('a')].map(a => ({
        text: a.textContent.trim(),
        href: a.href
      })).filter(l => l.href && l.text),
      meta: {
        description: document.querySelector('meta[name="description"]')?.content,
        ogImage: document.querySelector('meta[property="og:image"]')?.content,
      }
    };
  });
  
  await browser.close();
  return data;
}
```

### 3. Form Automation

```javascript
async function fillAndSubmit(page, formData) {
  // Type into input fields with realistic delays
  for (const [selector, value] of Object.entries(formData)) {
    await page.waitForSelector(selector, { timeout: 5000 });
    await page.click(selector, { clickCount: 3 }); // select existing text
    await page.type(selector, value, { delay: 50 }); // human-like typing
  }
  
  // Handle dropdowns
  await page.select('#country', 'US');
  
  // Click submit and wait for navigation
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('button[type="submit"]')
  ]);
  
  // Check for success/error
  const result = await page.evaluate(() => {
    const error = document.querySelector('.error-message');
    return error ? { success: false, error: error.textContent } : { success: true };
  });
  
  return result;
}
```

### 4. Screenshot Capture

```javascript
async function captureScreenshots(url, viewports) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  const screenshots = {};
  
  for (const [name, viewport] of Object.entries(viewports)) {
    await page.setViewport(viewport);
    // Wait for responsive layout to settle
    await new Promise(r => setTimeout(r, 500));
    
    screenshots[name] = `screenshots/${name}.png`;
    await page.screenshot({
      path: screenshots[name],
      fullPage: true,
      type: 'png'
    });
  }
  
  await browser.close();
  return screenshots;
}

// Usage
captureScreenshots('https://example.com', {
  desktop: { width: 1920, height: 1080 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 },
});
```

### 5. Performance Auditing

```javascript
async function auditPerformance(url) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Enable performance metrics
  await page.setCacheEnabled(false);
  
  const client = await page.createCDPSession();
  await client.send('Performance.enable');
  
  // Navigate and measure
  const start = Date.now();
  await page.goto(url, { waitUntil: 'load' });
  const loadTime = Date.now() - start;
  
  // Get performance metrics
  const metrics = await client.send('Performance.getMetrics');
  const perfMetrics = metrics.metrics.reduce((acc, m) => {
    acc[m.name] = m.value;
    return acc;
  }, {});
  
  // Get Core Web Vitals
  const webVitals = await page.evaluate(() => {
    return new Promise(resolve => {
      new PerformanceObserver(list => {
        const entries = list.getEntries();
        resolve({
          LCP: entries[entries.length - 1]?.startTime,
          FID: entries[0]?.processingStart - entries[0]?.startTime,
        });
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      
      // Timeout fallback
      setTimeout(() => resolve({ LCP: null, FID: null }), 5000);
    });
  });
  
  await browser.close();
  
  return {
    load_time_ms: loadTime,
    dom_content_loaded: perfMetrics['DomContentLoaded'],
    js_heap_used: perfMetrics['JSHeapUsedSize'],
    web_vitals: webVitals,
  };
}
```

### 6. Network Interception

```javascript
async function interceptRequests(page) {
  const requests = [];
  
  // Log all network requests
  page.on('request', req => {
    requests.push({
      url: req.url(),
      method: req.method(),
      resourceType: req.resourceType(),
      size: req.headers()['content-length'] || 'unknown',
    });
  });
  
  // Block specific resource types (speed up scraping)
  await page.setRequestInterception(true);
  page.on('request', req => {
    if (['image', 'font', 'media'].includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });
  
  await page.goto('https://example.com');
  return requests;
}
```

## Example

**Scraping a product listing page with dynamic content:**

```
User: "Scrape the top 20 products from our competitor's catalog page.
       Get name, price, rating, and image URL."

Agent:
1. Launch headless Chrome
2. Navigate to catalog page, wait for product grid to render
3. Scroll to load lazy-loaded products (infinite scroll)
4. Extract product data via page.evaluate:
   - Name from .product-title elements
   - Price from .product-price (strip currency symbol)
   - Rating from .star-rating (count filled stars)
   - Image from img.product-image src attribute
5. Block image/font requests for faster scraping
6. Handle pagination (click "Next", wait for new products)
7. Output: JSON array of 20 products with all fields
```

## Anti-Patterns

- **No wait strategy:** Navigating and immediately scraping without waiting for JS rendering — use `waitUntil: 'networkidle2'` or `waitForSelector`
- **Aggressive scraping:** Firing 100 requests/second without delays — add random delays (1-3s) between page loads to avoid IP blocking
- **Ignoring robots.txt:** Scraping pages that explicitly disallow bots — check robots.txt first and respect rate limits
- **Missing error handling:** Not handling CAPTCHAs, 403s, or cloudflare challenges — always check response status before parsing
- **Memory leaks:** Keeping browser instances open without closing — always `browser.close()` in a finally block
- **Hardcoded selectors:** Using brittle CSS selectors that break on minor UI updates — prefer semantic selectors (aria-labels, data-testids, role attributes)
