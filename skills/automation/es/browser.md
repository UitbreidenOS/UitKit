---
name: browser
description: "Browser automation with Playwright: web scraping, UI testing, form filling, screenshot capture, PDF generation, session recording"
---

> 🇪🇸 Versión en español. [Versión en inglés](../browser.md).

# Habilidad Browser

## Cuándo activar
- Automatizar cualquier flujo de trabajo que requiera un navegador real (flujos de login, SPAs, contenido renderizado con JavaScript)
- Escribir pruebas de extremo a extremo para interfaces web
- Hacer scraping de sitios que bloquean solicitudes headless o requieren JavaScript
- Generar PDFs o capturas de pantalla de páginas web de forma programática
- Rellenar formularios, navegar por flujos de múltiples pasos, simular el comportamiento del usuario
- Pruebas de regresión visual

## Cuándo NO usar
- APIs que retornan JSON — usar `fetch`/`requests` directamente, no se necesita navegador
- Scraping de HTML estático simple — `cheerio` o `BeautifulSoup` es más rápido
- Scrapers críticos en rendimiento a gran escala — Playwright es lento para miles de páginas
- Cuando la API de un sitio está disponible y documentada — siempre preferir la API

## Instrucciones

### Configuración
```bash
# Install
npm install playwright
npx playwright install chromium   # install browser binaries

# or with Python
pip install playwright
playwright install chromium
```

### Interacción básica con una página (TypeScript)
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

### Autenticación — persistir sesiones
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

### Web scraping (contenido renderizado con JavaScript)
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

### Captura de pantalla y PDF
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

### Pruebas de extremo a extremo (con Playwright Test)
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

### Manejo de medidas anti-bot
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

### Equivalente en Python
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

## Ejemplo

**Usuario:** Extraer listados de productos de un sitio de e-commerce que requiere login y usa JavaScript para renderizar los productos.

**Resultado esperado:**
- `scripts/scrape-products.ts`
- `storageState: 'session.json'` para persistencia de autenticación
- `waitForSelector('.product-grid')` antes de la extracción
- Bucle de paginación con `waitForLoadState('networkidle')`
- Resultados escritos en `products.json`
- Limitación de velocidad: `waitForTimeout(1000)` entre páginas

---
