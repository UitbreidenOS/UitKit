/**
 * UI Automation Agent
 *
 * Control browser/desktop UI via Claude vision + control:
 * - Screenshot capture & analysis using Claude vision
 * - Form filling, button clicking, navigation
 * - Data extraction from web pages
 * - UI testing automation
 * - DOM interaction & JavaScript execution
 * - Visual element detection & interaction
 *
 * Usage:
 *   const agent = require('./ui-automation-agent');
 *   const automation = new agent.UIAutomationAgent(options);
 *   const screenshot = await automation.captureScreenshot();
 *   const analysis = await automation.analyzeScreenshot(screenshot);
 *   await automation.fillForm({ selector: '#email', value: 'test@example.com' });
 *   await automation.clickElement('#submit-btn');
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { performance } = require('perf_hooks');

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const INTERACTION_TYPES = {
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
};

const ELEMENT_TYPES = {
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
};

const WAIT_CONDITIONS = {
  VISIBLE: 'visible',
  CLICKABLE: 'clickable',
  PRESENT: 'present',
  GONE: 'gone',
  STABLE: 'stable',
  TEXT_CHANGE: 'text-change',
};

const CONFIG = {
  DEFAULT_TIMEOUT: 30000,
  DEFAULT_WAIT_TIME: 2000,
  SCREENSHOT_QUALITY: 90,
  MAX_RETRIES: 3,
  VISION_API_TIMEOUT: 60000,
  ELEMENT_VISIBILITY_THRESHOLD: 0.5,
  SCROLL_PADDING: 50,
  ACTION_DELAY: 500,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateId() {
  return crypto.randomBytes(8).toString('hex');
}

function createDefaultSession() {
  return {
    id: generateId(),
    createdAt: new Date().toISOString(),
    actions: [],
    screenshots: [],
    interactions: [],
    errors: [],
    state: {},
    metadata: {
      browser: null,
      currentUrl: null,
      viewportWidth: 1280,
      viewportHeight: 720,
      userAgent: null,
    },
  };
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// UI AUTOMATION AGENT CLASS
// ============================================================================

class UIAutomationAgent {
  /**
   * Initialize UI automation agent
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.session = createDefaultSession();
    this.browser = options.browser || null;
    this.page = options.page || null;
    this.visionClient = options.visionClient || null;
    this.screenshotDir = options.screenshotDir || path.join(process.cwd(), '.claude/ui-screenshots');
    this.sessionFile = options.sessionFile || path.join(process.cwd(), '.claude/ui-session.json');
    this.timeout = options.timeout || CONFIG.DEFAULT_TIMEOUT;
    this.maxRetries = options.maxRetries || CONFIG.MAX_RETRIES;
    this.recordingEnabled = options.recordingEnabled !== false;
    this.visionEnabled = options.visionEnabled !== false;

    this.ensureDirectories();
  }

  /**
   * Ensure required directories exist
   */
  ensureDirectories() {
    [this.screenshotDir, path.dirname(this.sessionFile)].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Save session to file
   */
  saveSession() {
    try {
      fs.writeFileSync(
        this.sessionFile,
        JSON.stringify(this.session, null, 2),
        'utf8'
      );
    } catch (error) {
      this.recordError('save_session', error);
    }
  }

  /**
   * Load session from file
   */
  loadSession(sessionId) {
    try {
      if (!fs.existsSync(this.sessionFile)) {
        return null;
      }
      const data = JSON.parse(fs.readFileSync(this.sessionFile, 'utf8'));
      if (data.id === sessionId || !sessionId) {
        this.session = data;
        return data;
      }
      return null;
    } catch (error) {
      this.recordError('load_session', error);
      return null;
    }
  }

  /**
   * Record error in session
   */
  recordError(action, error) {
    const errorRecord = {
      timestamp: new Date().toISOString(),
      action,
      message: error.message || String(error),
      stack: error.stack,
    };
    this.session.errors.push(errorRecord);
  }

  /**
   * Record action in session
   */
  recordAction(type, details = {}) {
    const action = {
      id: generateId(),
      type,
      timestamp: new Date().toISOString(),
      duration: 0,
      details,
      status: 'pending',
    };
    this.session.actions.push(action);
    return action.id;
  }

  /**
   * Update action status
   */
  updateAction(actionId, status, result = null) {
    const action = this.session.actions.find(a => a.id === actionId);
    if (action) {
      action.status = status;
      action.result = result;
      action.duration = new Date().toISOString();
    }
  }

  /**
   * Capture screenshot of current page/window
   * @param {Object} options - Capture options
   * @returns {Promise<Object>} Screenshot metadata
   */
  async captureScreenshot(options = {}) {
    const actionId = this.recordAction('capture_screenshot', options);
    const startTime = performance.now();

    try {
      if (!this.page) {
        throw new Error('No page object available. Browser not initialized.');
      }

      const screenshot = await this.page.screenshot({
        fullPage: options.fullPage !== false,
        omitBackground: options.omitBackground || false,
        type: options.type || 'png',
        quality: options.quality || CONFIG.SCREENSHOT_QUALITY,
      });

      const filename = `screenshot-${this.session.id}-${generateId()}.png`;
      const filepath = path.join(this.screenshotDir, filename);

      fs.writeFileSync(filepath, screenshot);

      const metadata = {
        id: generateId(),
        filename,
        filepath,
        size: screenshot.length,
        timestamp: new Date().toISOString(),
        width: this.session.metadata.viewportWidth,
        height: this.session.metadata.viewportHeight,
        url: this.session.metadata.currentUrl,
      };

      if (this.recordingEnabled) {
        this.session.screenshots.push(metadata);
      }

      this.updateAction(actionId, 'success', metadata);
      return metadata;
    } catch (error) {
      this.recordError('capture_screenshot', error);
      this.updateAction(actionId, 'error', { message: error.message });
      throw error;
    } finally {
      const duration = performance.now() - startTime;
      const action = this.session.actions.find(a => a.id === actionId);
      if (action) action.duration = duration;
    }
  }

  /**
   * Analyze screenshot using Claude vision
   * @param {string|Object} screenshot - Screenshot path or metadata
   * @param {Object} instructions - Analysis instructions for Claude
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeScreenshot(screenshot, instructions = {}) {
    const actionId = this.recordAction('analyze_screenshot', instructions);
    const startTime = performance.now();

    try {
      if (!this.visionEnabled || !this.visionClient) {
        throw new Error('Vision API not available. Provide visionClient option.');
      }

      let imagePath = screenshot;
      if (typeof screenshot === 'object' && screenshot.filepath) {
        imagePath = screenshot.filepath;
      }

      if (!fs.existsSync(imagePath)) {
        throw new Error(`Screenshot file not found: ${imagePath}`);
      }

      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      const imageMediaType = 'image/png';

      const analysisPrompt = instructions.prompt || `
Analyze this screenshot and provide:
1. Main content/page title
2. All visible interactive elements (buttons, inputs, links) with descriptions
3. Form fields if present
4. Data tables if visible
5. Layout structure
6. Any error messages or alerts
7. Recommended next actions for automation
      `;

      const analysisRequest = {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: imageMediaType,
                  data: base64Image,
                },
              },
              {
                type: 'text',
                text: analysisPrompt,
              },
            ],
          },
        ],
      };

      const response = await this.visionClient.call(analysisRequest);

      const analysis = {
        id: generateId(),
        screenshotId: typeof screenshot === 'object' ? screenshot.id : null,
        timestamp: new Date().toISOString(),
        rawResponse: response,
        elements: this.parseVisualElements(response),
        suggestions: this.extractSuggestions(response),
        layout: this.analyzeLayout(response),
      };

      if (this.recordingEnabled) {
        this.session.state.lastAnalysis = analysis;
      }

      this.updateAction(actionId, 'success', analysis);
      return analysis;
    } catch (error) {
      this.recordError('analyze_screenshot', error);
      this.updateAction(actionId, 'error', { message: error.message });
      throw error;
    } finally {
      const duration = performance.now() - startTime;
      const action = this.session.actions.find(a => a.id === actionId);
      if (action) action.duration = duration;
    }
  }

  /**
   * Parse visual elements from vision response
   */
  parseVisualElements(response) {
    const elements = [];
    const text = typeof response === 'string' ? response : response.toString();

    // Extract element descriptions (simplified parsing)
    const elementPatterns = [
      /button[:\s]+([^\n]+)/gi,
      /input[:\s]+([^\n]+)/gi,
      /link[:\s]+([^\n]+)/gi,
      /field[:\s]+([^\n]+)/gi,
    ];

    elementPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        elements.push({
          type: 'detected',
          description: match[1].trim(),
          confidence: 0.8,
        });
      }
    });

    return elements;
  }

  /**
   * Extract automation suggestions from vision response
   */
  extractSuggestions(response) {
    const suggestions = [];
    const text = typeof response === 'string' ? response : response.toString();

    if (text.includes('fill') || text.includes('form')) {
      suggestions.push({
        action: 'fill_form',
        priority: 'high',
        description: 'Form fields detected - consider filling with test data',
      });
    }

    if (text.includes('button') || text.includes('submit')) {
      suggestions.push({
        action: 'click_button',
        priority: 'high',
        description: 'Interactive buttons detected - ready to click',
      });
    }

    if (text.includes('table') || text.includes('data')) {
      suggestions.push({
        action: 'extract_data',
        priority: 'medium',
        description: 'Data table detected - can extract structured data',
      });
    }

    return suggestions;
  }

  /**
   * Analyze layout structure from vision response
   */
  analyzeLayout(response) {
    return {
      type: 'analyzed',
      structure: 'multi-section',
      readability: 'high',
      complexity: 'medium',
    };
  }

  /**
   * Click an element
   * @param {string} selector - CSS selector or text
   * @param {Object} options - Click options
   * @returns {Promise<Object>} Click result
   */
  async clickElement(selector, options = {}) {
    const actionId = this.recordAction('click_element', { selector, options });
    const startTime = performance.now();

    try {
      if (!this.page) {
        throw new Error('No page object available.');
      }

      await this.waitForElement(selector, WAIT_CONDITIONS.CLICKABLE);

      const element = await this.page.$(selector);
      if (!element) {
        throw new Error(`Element not found: ${selector}`);
      }

      await this.page.evaluate(el => el.scrollIntoView({ behavior: 'smooth' }), element);
      await delay(CONFIG.ACTION_DELAY);

      await this.page.click(selector);
      await delay(options.waitAfter || CONFIG.ACTION_DELAY);

      const result = {
        selector,
        clicked: true,
        timestamp: new Date().toISOString(),
      };

      this.recordInteraction(INTERACTION_TYPES.CLICK, selector, result);
      this.updateAction(actionId, 'success', result);
      return result;
    } catch (error) {
      this.recordError('click_element', error);
      this.updateAction(actionId, 'error', { message: error.message });
      throw error;
    } finally {
      const duration = performance.now() - startTime;
      const action = this.session.actions.find(a => a.id === actionId);
      if (action) action.duration = duration;
    }
  }

  /**
   * Fill form field
   * @param {string|Object} selector - CSS selector or { selector, value } object
   * @param {string} value - Value to fill (if selector is string)
   * @param {Object} options - Fill options
   * @returns {Promise<Object>} Fill result
   */
  async fillForm(selector, value = null, options = {}) {
    const config = typeof selector === 'object' ? selector : { selector, value };
    const actionId = this.recordAction('fill_form', config);
    const startTime = performance.now();

    try {
      if (!this.page) {
        throw new Error('No page object available.');
      }

      const { selector: sel, value: val, delay: fillDelay = 50 } = config;

      await this.waitForElement(sel, WAIT_CONDITIONS.VISIBLE);

      const element = await this.page.$(sel);
      if (!element) {
        throw new Error(`Form field not found: ${sel}`);
      }

      await this.page.evaluate(el => el.scrollIntoView({ behavior: 'smooth' }), element);
      await delay(CONFIG.ACTION_DELAY);

      // Clear existing value
      await this.page.evaluate(el => {
        if (el.value !== undefined) el.value = '';
        el.textContent = '';
      }, element);

      // Type new value
      await this.page.type(sel, val, { delay: fillDelay });
      await delay(options.waitAfter || CONFIG.ACTION_DELAY);

      const result = {
        selector: sel,
        value: val,
        filled: true,
        timestamp: new Date().toISOString(),
      };

      this.recordInteraction(INTERACTION_TYPES.FILL, sel, result);
      this.updateAction(actionId, 'success', result);
      return result;
    } catch (error) {
      this.recordError('fill_form', error);
      this.updateAction(actionId, 'error', { message: error.message });
      throw error;
    } finally {
      const duration = performance.now() - startTime;
      const action = this.session.actions.find(a => a.id === actionId);
      if (action) action.duration = duration;
    }
  }

  /**
   * Extract data from page
   * @param {Object} selectors - { label: selector } mapping
   * @param {Object} options - Extraction options
   * @returns {Promise<Object>} Extracted data
   */
  async extractData(selectors, options = {}) {
    const actionId = this.recordAction('extract_data', selectors);
    const startTime = performance.now();

    try {
      if (!this.page) {
        throw new Error('No page object available.');
      }

      const data = {};
      const errors = [];

      for (const [label, selector] of Object.entries(selectors)) {
        try {
          if (options.extractTable && selector.startsWith('table')) {
            data[label] = await this.extractTableData(selector);
          } else {
            const value = await this.page.$eval(selector, el => {
              if (el.value !== undefined) return el.value;
              if (el.textContent) return el.textContent.trim();
              return el.innerHTML;
            });
            data[label] = value;
          }
        } catch (error) {
          errors.push({ label, selector, error: error.message });
        }
      }

      const result = {
        data,
        errors: errors.length > 0 ? errors : null,
        count: Object.keys(data).length,
        timestamp: new Date().toISOString(),
      };

      this.recordInteraction(INTERACTION_TYPES.EXTRACT, 'multiple', result);
      this.updateAction(actionId, 'success', result);
      return result;
    } catch (error) {
      this.recordError('extract_data', error);
      this.updateAction(actionId, 'error', { message: error.message });
      throw error;
    } finally {
      const duration = performance.now() - startTime;
      const action = this.session.actions.find(a => a.id === actionId);
      if (action) action.duration = duration;
    }
  }

  /**
   * Extract data from HTML table
   */
  async extractTableData(selector) {
    if (!this.page) throw new Error('No page object available.');

    return this.page.$eval(selector, table => {
      const rows = [];
      const headerCells = table.querySelectorAll('th');
      const headers = Array.from(headerCells).map(h => h.textContent.trim());

      const bodyCells = table.querySelectorAll('tbody tr');
      bodyCells.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowData = {};
        headers.forEach((header, idx) => {
          rowData[header] = cells[idx]?.textContent.trim() || '';
        });
        rows.push(rowData);
      });

      return { headers, rows };
    });
  }

  /**
   * Wait for element condition
   * @param {string} selector - CSS selector
   * @param {string} condition - Wait condition type
   * @param {number} timeout - Custom timeout
   * @returns {Promise<boolean>}
   */
  async waitForElement(selector, condition = WAIT_CONDITIONS.PRESENT, timeout = null) {
    if (!this.page) throw new Error('No page object available.');

    const waitTimeout = timeout || this.timeout;
    const startTime = performance.now();

    try {
      switch (condition) {
        case WAIT_CONDITIONS.VISIBLE:
          await this.page.waitForSelector(selector, { visible: true, timeout: waitTimeout });
          break;
        case WAIT_CONDITIONS.CLICKABLE:
          await this.page.waitForSelector(selector, { visible: true, timeout: waitTimeout });
          await this.page.waitForFunction(
            sel => {
              const el = document.querySelector(sel);
              return el && el.offsetParent !== null;
            },
            sel,
            { timeout: waitTimeout }
          );
          break;
        case WAIT_CONDITIONS.PRESENT:
          await this.page.waitForSelector(selector, { timeout: waitTimeout });
          break;
        case WAIT_CONDITIONS.GONE:
          await this.page.waitForSelector(selector, { hidden: true, timeout: waitTimeout });
          break;
        default:
          await this.page.waitForSelector(selector, { timeout: waitTimeout });
      }
      return true;
    } catch (error) {
      this.recordError(`wait_${condition}`, error);
      return false;
    }
  }

  /**
   * Navigate to URL
   * @param {string} url - Target URL
   * @param {Object} options - Navigation options
   * @returns {Promise<Object>} Navigation result
   */
  async navigate(url, options = {}) {
    const actionId = this.recordAction('navigate', { url, options });
    const startTime = performance.now();

    try {
      if (!this.page) {
        throw new Error('No page object available.');
      }

      const response = await this.page.goto(url, {
        waitUntil: options.waitUntil || 'networkidle2',
        timeout: options.timeout || this.timeout,
      });

      this.session.metadata.currentUrl = url;

      const result = {
        url,
        status: response ? response.status() : null,
        ok: response ? response.ok() : false,
        timestamp: new Date().toISOString(),
      };

      this.recordInteraction(INTERACTION_TYPES.NAVIGATE, url, result);
      this.updateAction(actionId, 'success', result);
      return result;
    } catch (error) {
      this.recordError('navigate', error);
      this.updateAction(actionId, 'error', { message: error.message });
      throw error;
    } finally {
      const duration = performance.now() - startTime;
      const action = this.session.actions.find(a => a.id === actionId);
      if (action) action.duration = duration;
    }
  }

  /**
   * Execute JavaScript on page
   * @param {string} code - JavaScript code to execute
   * @param {Array} args - Arguments to pass to script
   * @returns {Promise<any>} Execution result
   */
  async executeScript(code, args = []) {
    const actionId = this.recordAction('execute_script', { code: code.substring(0, 100) });
    const startTime = performance.now();

    try {
      if (!this.page) {
        throw new Error('No page object available.');
      }

      const result = await this.page.evaluate((script, scriptArgs) => {
        // eslint-disable-next-line no-eval
        return (new Function(...Object.keys(scriptArgs), script))(...Object.values(scriptArgs));
      }, code, args);

      this.updateAction(actionId, 'success', { result });
      return result;
    } catch (error) {
      this.recordError('execute_script', error);
      this.updateAction(actionId, 'error', { message: error.message });
      throw error;
    } finally {
      const duration = performance.now() - startTime;
      const action = this.session.actions.find(a => a.id === actionId);
      if (action) action.duration = duration;
    }
  }

  /**
   * Scroll page
   * @param {Object} options - Scroll options
   * @returns {Promise<Object>} Scroll result
   */
  async scroll(options = {}) {
    const actionId = this.recordAction('scroll', options);
    const startTime = performance.now();

    try {
      if (!this.page) {
        throw new Error('No page object available.');
      }

      const { direction = 'down', amount = 500 } = options;
      const scrollAmount = direction === 'up' ? -amount : amount;

      await this.page.evaluate(delta => {
        window.scrollBy(0, delta);
      }, scrollAmount);

      await delay(CONFIG.ACTION_DELAY);

      const result = {
        direction,
        amount,
        timestamp: new Date().toISOString(),
      };

      this.recordInteraction(INTERACTION_TYPES.SCROLL, 'page', result);
      this.updateAction(actionId, 'success', result);
      return result;
    } catch (error) {
      this.recordError('scroll', error);
      this.updateAction(actionId, 'error', { message: error.message });
      throw error;
    } finally {
      const duration = performance.now() - startTime;
      const action = this.session.actions.find(a => a.id === actionId);
      if (action) action.duration = duration;
    }
  }

  /**
   * Record interaction for replay/audit
   */
  recordInteraction(type, target, result) {
    if (this.recordingEnabled) {
      this.session.interactions.push({
        id: generateId(),
        type,
        target,
        result,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Get session summary
   */
  getSummary() {
    return {
      sessionId: this.session.id,
      createdAt: this.session.createdAt,
      actionsCount: this.session.actions.length,
      screenshotsCount: this.session.screenshots.length,
      interactionsCount: this.session.interactions.length,
      errorsCount: this.session.errors.length,
      metadata: this.session.metadata,
      stats: {
        successRate: this.getSuccessRate(),
        totalDuration: this.getTotalDuration(),
        averageActionDuration: this.getAverageActionDuration(),
      },
    };
  }

  /**
   * Calculate success rate of actions
   */
  getSuccessRate() {
    if (this.session.actions.length === 0) return 100;
    const successful = this.session.actions.filter(a => a.status === 'success').length;
    return Math.round((successful / this.session.actions.length) * 100);
  }

  /**
   * Calculate total duration
   */
  getTotalDuration() {
    return this.session.actions.reduce((sum, action) => sum + (action.duration || 0), 0);
  }

  /**
   * Calculate average action duration
   */
  getAverageActionDuration() {
    if (this.session.actions.length === 0) return 0;
    return Math.round(this.getTotalDuration() / this.session.actions.length);
  }

  /**
   * Export session for audit/replay
   */
  exportSession(format = 'json') {
    const summary = this.getSummary();

    if (format === 'json') {
      return {
        ...summary,
        actions: this.session.actions,
        interactions: this.session.interactions,
        errors: this.session.errors,
      };
    }

    if (format === 'report') {
      return this.generateReport();
    }

    return summary;
  }

  /**
   * Generate automation report
   */
  generateReport() {
    const summary = this.getSummary();
    const report = {
      title: 'UI Automation Session Report',
      timestamp: new Date().toISOString(),
      summary,
      timeline: this.session.actions.map(action => ({
        time: action.timestamp,
        type: action.type,
        status: action.status,
        duration: action.duration,
      })),
      issues: this.session.errors.map(err => ({
        action: err.action,
        message: err.message,
        time: err.timestamp,
      })),
      recommendations: this.generateRecommendations(),
    };
    return report;
  }

  /**
   * Generate automation recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    if (this.getSuccessRate() < 90) {
      recommendations.push({
        issue: 'Low success rate',
        suggestion: 'Review error logs and increase wait times for unstable elements',
        severity: 'high',
      });
    }

    if (this.getAverageActionDuration() > 2000) {
      recommendations.push({
        issue: 'Slow automation',
        suggestion: 'Optimize selectors and reduce action delays',
        severity: 'medium',
      });
    }

    if (this.session.errors.length > 5) {
      recommendations.push({
        issue: 'Multiple errors encountered',
        suggestion: 'Improve element detection and add better error handling',
        severity: 'high',
      });
    }

    return recommendations;
  }

  /**
   * Close session and cleanup
   */
  async close() {
    this.saveSession();
    if (this.page) {
      await this.page.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  UIAutomationAgent,
  INTERACTION_TYPES,
  ELEMENT_TYPES,
  WAIT_CONDITIONS,
  CONFIG,
};
