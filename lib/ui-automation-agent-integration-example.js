/**
 * UI Automation Agent - Integration Example
 *
 * Real-world examples showing how to use the UI Automation Agent for:
 * - Web form automation
 * - Data extraction from web pages
 * - UI testing workflows
 * - Web scraping tasks
 * - Cross-browser testing
 */

const { UIAutomationAgent } = require('./ui-automation-agent');

// ============================================================================
// EXAMPLE 1: Web Form Automation
// ============================================================================

async function automate_login_form() {
  /**
   * Example: Automate login flow on a website
   * - Navigate to login page
   * - Capture screenshot
   * - Analyze with Claude vision
   * - Fill email and password
   * - Click login button
   * - Wait for navigation
   * - Extract user dashboard data
   */

  const agent = new UIAutomationAgent({
    timeout: 30000,
    visionEnabled: true,
    recordingEnabled: true,
  });

  try {
    // 1. Navigate to login page
    console.log('Step 1: Navigating to login page...');
    await agent.navigate('https://example.com/login');

    // 2. Capture initial screenshot
    console.log('Step 2: Capturing screenshot...');
    const screenshot = await agent.captureScreenshot();
    console.log('Screenshot saved:', screenshot.filename);

    // 3. Analyze page structure with Claude vision
    console.log('Step 3: Analyzing page structure...');
    const analysis = await agent.analyzeScreenshot(screenshot, {
      prompt: 'Identify all form fields and buttons on this login page',
    });
    console.log('Page structure:', analysis.elements);

    // 4. Fill login credentials
    console.log('Step 4: Filling login form...');
    await agent.fillForm('#email-input', 'user@example.com');
    await agent.fillForm('#password-input', 'securePassword123!');

    // 5. Click login button
    console.log('Step 5: Clicking login button...');
    await agent.clickElement('#login-btn');

    // 6. Wait for dashboard to load
    console.log('Step 6: Waiting for dashboard...');
    await agent.waitForElement('.dashboard-container', 'visible', 10000);

    // 7. Extract dashboard data
    console.log('Step 7: Extracting dashboard data...');
    const dashboardData = await agent.extractData({
      username: '.user-name',
      email: '.user-email',
      accountStatus: '.account-status',
      lastLogin: '.last-login',
    });
    console.log('Dashboard data:', dashboardData.data);

    // 8. Get session report
    const report = agent.generateReport();
    console.log('\nAutomation Report:');
    console.log(`- Total actions: ${report.summary.actionsCount}`);
    console.log(`- Success rate: ${report.summary.stats.successRate}%`);
    console.log(`- Duration: ${report.summary.stats.totalDuration}ms`);

    return dashboardData;
  } catch (error) {
    console.error('Automation failed:', error.message);
    const summary = agent.getSummary();
    console.log('Failed at action:', summary.actionsCount);
  } finally {
    await agent.close();
  }
}

// ============================================================================
// EXAMPLE 2: E-commerce Product Search & Purchase
// ============================================================================

async function automate_ecommerce_purchase() {
  /**
   * Example: Complete e-commerce flow
   * - Search for product
   * - Filter results
   * - Select product
   * - Add to cart
   * - Checkout
   * - Verify order confirmation
   */

  const agent = new UIAutomationAgent({
    visionEnabled: true,
    recordingEnabled: true,
  });

  try {
    // Navigate to shop
    await agent.navigate('https://shop.example.com');

    // Search for product
    console.log('Searching for "laptop"...');
    await agent.fillForm('input[placeholder="Search products"]', 'laptop');
    await agent.clickElement('button[type="submit"]');

    // Wait for results
    await agent.waitForElement('.product-grid', 'visible');

    // Take screenshot for analysis
    const resultScreenshot = await agent.captureScreenshot();
    const analysis = await agent.analyzeScreenshot(resultScreenshot, {
      prompt: 'List all products shown and their prices',
    });

    // Click first product
    await agent.clickElement('.product-grid .product-card:nth-child(1)');

    // Extract product details
    const productDetails = await agent.extractData({
      name: '.product-name',
      price: '.product-price',
      rating: '.product-rating',
      description: '.product-description',
      inStock: '.stock-status',
    });
    console.log('Product details:', productDetails.data);

    // Add to cart
    await agent.clickElement('#add-to-cart-btn');

    // Wait for confirmation
    await agent.waitForElement('.cart-notification', 'visible', 5000);

    // Navigate to checkout
    await agent.clickElement('.cart-icon');
    await agent.clickElement('#checkout-btn');

    // Fill shipping info
    await agent.fillForm('#shipping-address', '123 Main St');
    await agent.fillForm('#shipping-city', 'New York');
    await agent.fillForm('#shipping-zip', '10001');

    // Fill payment info
    await agent.fillForm('#card-number', '4111111111111111');
    await agent.fillForm('#card-expiry', '12/25');
    await agent.fillForm('#card-cvc', '123');

    // Place order
    await agent.clickElement('#place-order-btn');

    // Verify order confirmation
    await agent.waitForElement('.order-confirmation', 'visible');
    const confirmationData = await agent.extractData({
      orderNumber: '.order-number',
      orderTotal: '.order-total',
      estimatedDelivery: '.delivery-date',
    });
    console.log('Order confirmed:', confirmationData.data);

    return confirmationData;
  } catch (error) {
    console.error('E-commerce automation failed:', error.message);
  } finally {
    await agent.close();
  }
}

// ============================================================================
// EXAMPLE 3: Data Extraction & Web Scraping
// ============================================================================

async function extract_news_articles() {
  /**
   * Example: Extract news articles from multiple pages
   * - Navigate to news site
   * - Scroll through articles
   * - Extract article data
   * - Handle pagination
   */

  const agent = new UIAutomationAgent({
    visionEnabled: true,
    recordingEnabled: true,
  });

  const articles = [];

  try {
    await agent.navigate('https://news.example.com');

    // Extract multiple pages of articles
    for (let page = 1; page <= 3; page++) {
      console.log(`Extracting page ${page}...`);

      // Wait for articles to load
      await agent.waitForElement('.article-item', 'visible');

      // Capture screenshot for analysis
      const screenshot = await agent.captureScreenshot();
      const analysis = await agent.analyzeScreenshot(screenshot, {
        prompt: 'How many article items are visible on this page?',
      });

      // Extract all articles on current page
      const articleElements = await agent.page.$$('.article-item');
      console.log(`Found ${articleElements.length} articles`);

      for (let i = 0; i < articleElements.length; i++) {
        const selector = `.article-item:nth-child(${i + 1})`;
        const articleData = await agent.extractData({
          title: `${selector} .article-title`,
          author: `${selector} .article-author`,
          date: `${selector} .article-date`,
          summary: `${selector} .article-summary`,
          category: `${selector} .article-category`,
        });

        if (articleData.data && articleData.data.title) {
          articles.push(articleData.data);
        }
      }

      // Go to next page if available
      if (page < 3) {
        const nextPageBtn = await agent.page.$('.pagination .next-btn');
        if (nextPageBtn) {
          await agent.clickElement('.pagination .next-btn');
          await delay(1000); // Wait between pages
        }
      }
    }

    console.log(`Total articles extracted: ${articles.length}`);
    return articles;
  } catch (error) {
    console.error('Scraping failed:', error.message);
  } finally {
    await agent.close();
  }
}

// ============================================================================
// EXAMPLE 4: UI Testing Workflow
// ============================================================================

async function test_responsive_ui() {
  /**
   * Example: Test UI responsiveness across viewport sizes
   * - Test desktop layout
   * - Test tablet layout
   * - Test mobile layout
   * - Verify element visibility at each size
   */

  const agent = new UIAutomationAgent({
    visionEnabled: true,
    recordingEnabled: true,
  });

  const viewportConfigs = [
    { name: 'desktop', width: 1920, height: 1080 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 667 },
  ];

  const testResults = {};

  try {
    for (const viewport of viewportConfigs) {
      console.log(`Testing ${viewport.name} viewport (${viewport.width}x${viewport.height})...`);

      // Set viewport size
      await agent.page.setViewport({
        width: viewport.width,
        height: viewport.height,
      });
      agent.session.metadata.viewportWidth = viewport.width;
      agent.session.metadata.viewportHeight = viewport.height;

      // Navigate to page
      await agent.navigate('https://responsive-test.example.com');

      // Capture screenshot
      const screenshot = await agent.captureScreenshot();

      // Analyze layout
      const analysis = await agent.analyzeScreenshot(screenshot, {
        prompt: `Check if this ${viewport.name} layout is properly responsive. List any layout issues.`,
      });

      // Test key elements are visible
      const elementTests = {
        header: '.header',
        navigation: 'nav',
        mainContent: '.main-content',
        footer: 'footer',
      };

      const visibilityResults = {};
      for (const [name, selector] of Object.entries(elementTests)) {
        const visible = await agent.waitForElement(selector, 'visible', 5000);
        visibilityResults[name] = visible;
      }

      testResults[viewport.name] = {
        analysis: analysis.suggestions,
        elementVisibility: visibilityResults,
        screenshotId: screenshot.id,
      };

      console.log(`✓ ${viewport.name} testing complete`);
    }

    // Generate test report
    console.log('\n=== Responsive UI Test Results ===');
    for (const [viewport, results] of Object.entries(testResults)) {
      console.log(`\n${viewport.toUpperCase()}:`);
      Object.entries(results.elementVisibility).forEach(([element, visible]) => {
        console.log(`  ${element}: ${visible ? '✓' : '✗'}`);
      });
    }

    return testResults;
  } catch (error) {
    console.error('UI testing failed:', error.message);
  } finally {
    await agent.close();
  }
}

// ============================================================================
// EXAMPLE 5: Complex Multi-Step Workflow
// ============================================================================

async function automate_customer_support_workflow() {
  /**
   * Example: Automate customer support ticketing system
   * - Submit support ticket
   * - Upload attachments
   * - Fill form with validation
   * - Track ticket status
   * - Extract support response
   */

  const agent = new UIAutomationAgent({
    visionEnabled: true,
    recordingEnabled: true,
  });

  try {
    // Step 1: Navigate to support portal
    await agent.navigate('https://support.example.com/tickets/new');

    // Step 2: Analyze form structure
    const screenshot = await agent.captureScreenshot();
    const formAnalysis = await agent.analyzeScreenshot(screenshot, {
      prompt: 'What form fields are required to submit a support ticket?',
    });
    console.log('Form fields:', formAnalysis.elements);

    // Step 3: Fill support ticket form
    const ticketData = {
      subject: 'Cannot reset password',
      category: 'Account & Security',
      priority: 'High',
      description: 'I am unable to reset my password. The reset email is not arriving.',
      email: 'customer@example.com',
      phone: '+1-555-0123',
    };

    await agent.fillForm('#ticket-subject', ticketData.subject);
    await agent.fillForm('#ticket-category', ticketData.category);
    await agent.fillForm('#ticket-priority', ticketData.priority);
    await agent.fillForm('#ticket-description', ticketData.description);
    await agent.fillForm('#ticket-email', ticketData.email);
    await agent.fillForm('#ticket-phone', ticketData.phone);

    // Step 4: Add attachment (if needed)
    const fileInput = await agent.page.$('#ticket-attachment');
    if (fileInput) {
      await fileInput.uploadFile('/path/to/screenshot.png');
    }

    // Step 5: Submit ticket
    await agent.clickElement('#submit-ticket-btn');

    // Step 6: Wait for confirmation and extract ticket number
    await agent.waitForElement('.ticket-confirmation', 'visible', 10000);
    const confirmationData = await agent.extractData({
      ticketNumber: '.ticket-number',
      reference: '.reference-id',
      estimatedResponse: '.response-time',
      message: '.confirmation-message',
    });

    const ticketNumber = confirmationData.data.ticketNumber;
    console.log('Ticket created:', ticketNumber);

    // Step 7: Wait for and extract support response
    console.log('Waiting for support response...');
    for (let i = 0; i < 5; i++) {
      await delay(10000); // Check every 10 seconds

      // Refresh ticket page
      await agent.navigate(`https://support.example.com/tickets/${ticketNumber}`);

      // Check for response
      const responseData = await agent.extractData({
        status: '.ticket-status',
        latestResponse: '.latest-response',
        respondent: '.respondent-name',
      });

      if (responseData.data.status === 'Answered') {
        console.log('Support response received:', responseData.data.latestResponse);
        return responseData.data;
      }
    }

    console.log('Timeout waiting for response');
    return confirmationData;
  } catch (error) {
    console.error('Support workflow failed:', error.message);
  } finally {
    await agent.close();
  }
}

// ============================================================================
// EXAMPLE 6: Error Handling & Retry Logic
// ============================================================================

async function automate_with_retry() {
  /**
   * Example: Implement retry logic for flaky elements
   */

  const agent = new UIAutomationAgent({
    maxRetries: 3,
    visionEnabled: false,
    recordingEnabled: true,
  });

  const retryWithBackoff = async (fn, maxRetries = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        console.log(`Attempt ${attempt} failed: ${error.message}`);
        if (attempt === maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  };

  try {
    await agent.navigate('https://flaky-app.example.com');

    // Retry clicking button that may not be immediately clickable
    await retryWithBackoff(async () => {
      await agent.clickElement('#sometimes-missing-btn');
    });

    // Retry form fill with validation
    await retryWithBackoff(async () => {
      await agent.fillForm('#dynamic-field', 'test-value');
    });

    // Take final screenshot
    await agent.captureScreenshot();

    const summary = agent.getSummary();
    console.log(`Successfully completed after ${summary.actionsCount} actions`);
  } catch (error) {
    console.error('Automation failed after retries:', error.message);
  } finally {
    await agent.close();
  }
}

// ============================================================================
// EXAMPLE 7: Session Replay & Audit
// ============================================================================

async function export_automation_session() {
  /**
   * Example: Export automation session for audit and replay
   */

  const agent = new UIAutomationAgent({
    visionEnabled: false,
    recordingEnabled: true,
  });

  try {
    // Perform automation
    await agent.navigate('https://example.com');
    await agent.captureScreenshot();
    await agent.clickElement('#btn');
    await agent.fillForm('#field', 'value');

    // Export session
    const jsonExport = agent.exportSession('json');
    console.log('JSON Export:', JSON.stringify(jsonExport, null, 2));

    // Generate report
    const report = agent.generateReport();
    console.log('Report:', JSON.stringify(report, null, 2));

    // Get summary
    const summary = agent.getSummary();
    console.log('Summary:', summary);

    return { jsonExport, report, summary };
  } finally {
    await agent.close();
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  automate_login_form,
  automate_ecommerce_purchase,
  extract_news_articles,
  test_responsive_ui,
  automate_customer_support_workflow,
  automate_with_retry,
  export_automation_session,
};
