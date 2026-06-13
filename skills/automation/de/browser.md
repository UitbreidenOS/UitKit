---
name: browser
description: "Browser automation with Playwright: web scraping, UI testing, form filling, screenshot capture, PDF generation, session recording"
---

> 🇩🇪 Deutsche Version. [Englische Version](../browser.md).

# Browser-Skill

## Wann aktivieren
- Automatisierung von Workflows, die einen echten Browser erfordern (Login-Flows, SPAs, JavaScript-gerenderter Inhalt)
- Schreiben von End-to-End-Tests für Web-UIs
- Scraping von Websites, die Headless-Anfragen blockieren oder JavaScript benötigen
- Programmatische Generierung von PDFs oder Screenshots von Webseiten
- Formulare ausfüllen, mehrstufige Flows durchlaufen, Benutzerverhalten simulieren
- Visuelle Regressionstests

## Wann NICHT verwenden
- APIs, die JSON zurückgeben — `fetch`/`requests` direkt verwenden, kein Browser nötig
- Einfaches statisches HTML-Scraping — `cheerio` oder `BeautifulSoup` ist schneller
- Performance-kritische Scraper im großen Maßstab — Playwright ist langsam für Tausende von Seiten
- Wenn die API einer Website verfügbar und dokumentiert ist — immer die API bevorzugen

## Anleitung

### Einrichtung
```bash
# Install
npm install playwright
npx playwright install chromium   # install browser binaries

# or with Python
pip install playwright
playwright install chromium
```

### Grundlegende Seiteninteraktion (TypeScript)
```typescript
import { chromium, type Page } from 'playwright'

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext()
const page = await context.newPage()

await page.goto('https://example.com')

// Wait for element, then interact
await page.waitForSelector('button[data-testid="login"]')
await page.click('button[data-testid="login"]')
await page.fill('input[name="email"]', 'user@example.com')
await page.fill('input[name="password"]', process.env.PASSWORD!)
await page.press('input[name="password"]', 'Enter')

// Wait for navigation
await page.waitForURL('**/dashboard')

// Extract data
const text = await page.textContent('h1')
const items = await page.$$eval('ul.results li', els => els.map(el => el.textContent))

await browser.close()
```

### Authentifizierung — Sessions persistieren
```typescript
// First run: log in and save session
const context = await browser.newContext()
const page = await context.newPage()
await page.goto('/login')
await page.fill('#email', 'user@example.com')
await page.fill('#password', process.env.PASSWORD!)
await page.click('button[type=submit]')
await page.waitForURL('**/dashboard')

// Save cookies + localStorage
await context.storageState({ path: 'session.json' })
await browser.close()

// Subsequent runs: load saved session (skip login)
const context2 = await browser.newContext({ storageState: 'session.json' })
```

### Web Scraping (JavaScript-gerenderter Inhalt)
```typescript
// Wait for dynamic content to load before extracting
await page.goto('https://spa-app.com/products')

// Wait for the data to render (not just page load)
await page.waitForSelector('.product-card', { timeout: 10000 })

// Extract structured data
const products = await page.$$eval('.product-card', cards =>
  cards.map(card => ({
    name: card.querySelector('.name')?.textContent?.trim(),
    price: card.querySelector('.price')?.textContent?.trim(),
    url: card.querySelector('a')?.href,
  }))
)

// Handle pagination
while (true) {
  const nextBtn = await page.$('button.next-page:not([disabled])')
  if (!nextBtn) break
  await nextBtn.click()
  await page.waitForLoadState('networkidle')
  // extract this page's data...
}
```

### Screenshot und PDF
```typescript
// Full-page screenshot
await page.screenshot({ path: 'page.png', fullPage: true })

// Specific element
const element = await page.$('.report-card')
await element?.screenshot({ path: 'card.png' })

// PDF (Chromium only)
await page.pdf({
  path: 'report.pdf',
  format: 'A4',
  printBackground: true,
  margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
})
```

### End-to-End-Tests (mit Playwright Test)
```typescript
// tests/checkout.spec.ts
import { test, expect } from '@playwright/test'

test('complete checkout flow', async ({ page }) => {
  await page.goto('/shop')
  await page.click('[data-testid="product-1"] button.add-to-cart')
  await page.click('[data-testid="cart-icon"]')
  await expect(page.locator('.cart-count')).toHaveText('1')

  await page.click('button.checkout')
  await page.fill('#card-number', '4242 4242 4242 4242')
  await page.fill('#expiry', '12/28')
  await page.fill('#cvc', '123')
  await page.click('button.pay')

  await expect(page).toHaveURL('/order-confirmation')
  await expect(page.locator('h1')).toContainText('Order confirmed')
})
```

```bash
# Run tests
npx playwright test
npx playwright test --headed          # see the browser
npx playwright test --debug           # step through
npx playwright show-report            # HTML report
```

### Umgang mit Anti-Bot-Maßnahmen
```typescript
// Rotate user agents
const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...',
  viewport: { width: 1280, height: 800 },
  locale: 'en-US',
  timezoneId: 'America/New_York',
})

// Add delays between actions to mimic human behaviour
await page.waitForTimeout(500 + Math.random() * 1000)

// Intercept and modify requests
await page.route('**/*.{png,jpg,jpeg,webp}', route => route.abort()) // block images for speed
await page.route('**/api/data', route => {
  const body = route.request().postData()
  route.continue({ postData: body?.replace('original', 'modified') })
})
```

### Python-Äquivalent
```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("https://example.com")
    page.wait_for_selector("h1")
    title = page.text_content("h1")
    page.screenshot(path="page.png", full_page=True)
    browser.close()
```

## Beispiel

**Benutzer:** Produktlisten von einer E-Commerce-Website scrapen, die Login erfordert und JavaScript zum Rendern der Produkte verwendet.

**Erwartete Ausgabe:**
- `scripts/scrape-products.ts`
- `storageState: 'session.json'` für persistente Authentifizierung
- `waitForSelector('.product-grid')` vor der Extraktion
- Paginierungsschleife mit `waitForLoadState('networkidle')`
- Ergebnisse werden in `products.json` geschrieben
- Rate Limiting: `waitForTimeout(1000)` zwischen den Seiten

---
