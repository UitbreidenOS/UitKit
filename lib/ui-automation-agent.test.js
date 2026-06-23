/**
 * UI Automation Agent - Test Suite
 *
 * Tests for screenshot capture, vision analysis, form filling,
 * element interaction, data extraction, and session management
 */

const {
  UIAutomationAgent,
  INTERACTION_TYPES,
  ELEMENT_TYPES,
  WAIT_CONDITIONS,
  CONFIG,
} = require('./ui-automation-agent');

// Mock objects for testing
const mockPage = {
  screenshot: async (options) => {
    return Buffer.from('mock-screenshot-data');
  },
  goto: async (url, options) => {
    return {
      status: () => 200,
      ok: () => true,
    };
  },
  $: async (selector) => {
    return { selector, value: '' };
  },
  $$: async (selector) => {
    return [{ selector, textContent: 'Element 1' }, { selector, textContent: 'Element 2' }];
  },
  $eval: async (selector, func) => {
    return 'Test Value';
  },
  click: async (selector) => {},
  type: async (selector, text, options) => {},
  evaluate: async (func, ...args) => {
    return 'eval-result';
  },
  waitForSelector: async (selector, options) => {},
  waitForFunction: async (func, ...args) => {},
  close: async () => {},
};

const mockBrowser = {
  close: async () => {},
};

describe('UIAutomationAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new UIAutomationAgent({
      page: mockPage,
      browser: mockBrowser,
      visionEnabled: false,
      recordingEnabled: true,
    });
  });

  describe('Initialization', () => {
    test('creates agent with default config', () => {
      expect(agent).toBeDefined();
      expect(agent.session).toBeDefined();
      expect(agent.session.id).toBeDefined();
      expect(agent.session.actions).toEqual([]);
      expect(agent.session.screenshots).toEqual([]);
    });

    test('initializes with custom options', () => {
      const customAgent = new UIAutomationAgent({
        timeout: 60000,
        maxRetries: 5,
        visionEnabled: false,
      });
      expect(customAgent.timeout).toBe(60000);
      expect(customAgent.maxRetries).toBe(5);
    });

    test('creates required directories', () => {
      expect(agent.screenshotDir).toBeDefined();
      expect(agent.sessionFile).toBeDefined();
    });
  });

  describe('Action Recording', () => {
    test('records action with type and details', () => {
      const actionId = agent.recordAction('click_element', { selector: '#btn' });
      expect(actionId).toBeDefined();
      expect(agent.session.actions.length).toBe(1);

      const action = agent.session.actions[0];
      expect(action.type).toBe('click_element');
      expect(action.details.selector).toBe('#btn');
      expect(action.status).toBe('pending');
    });

    test('updates action status and result', () => {
      const actionId = agent.recordAction('test_action', {});
      agent.updateAction(actionId, 'success', { result: 'test' });

      const action = agent.session.actions[0];
      expect(action.status).toBe('success');
      expect(action.result.result).toBe('test');
    });

    test('records errors in session', () => {
      const error = new Error('Test error');
      agent.recordError('test_action', error);

      expect(agent.session.errors.length).toBe(1);
      expect(agent.session.errors[0].message).toBe('Test error');
      expect(agent.session.errors[0].action).toBe('test_action');
    });
  });

  describe('Screenshot Capture', () => {
    test('captures screenshot and saves metadata', async () => {
      const screenshot = await agent.captureScreenshot();

      expect(screenshot).toBeDefined();
      expect(screenshot.id).toBeDefined();
      expect(screenshot.filename).toBeDefined();
      expect(screenshot.size).toBeGreaterThan(0);
      expect(screenshot.timestamp).toBeDefined();
    });

    test('records screenshot in session', async () => {
      await agent.captureScreenshot();

      expect(agent.session.screenshots.length).toBe(1);
      expect(agent.session.screenshots[0].id).toBeDefined();
    });

    test('handles screenshot with custom options', async () => {
      const screenshot = await agent.captureScreenshot({
        fullPage: false,
        quality: 75,
      });

      expect(screenshot).toBeDefined();
    });

    test('throws error when no page object', async () => {
      const noPageAgent = new UIAutomationAgent({ visionEnabled: false });
      await expect(noPageAgent.captureScreenshot()).rejects.toThrow('No page object');
    });
  });

  describe('Element Interaction', () => {
    test('clicks element with selector', async () => {
      const result = await agent.clickElement('#submit-btn');

      expect(result).toBeDefined();
      expect(result.clicked).toBe(true);
      expect(result.selector).toBe('#submit-btn');
    });

    test('records click interaction', async () => {
      await agent.clickElement('#btn');

      expect(agent.session.interactions.length).toBe(1);
      expect(agent.session.interactions[0].type).toBe(INTERACTION_TYPES.CLICK);
    });

    test('fills form field with value', async () => {
      const result = await agent.fillForm('#email', 'test@example.com');

      expect(result).toBeDefined();
      expect(result.filled).toBe(true);
      expect(result.value).toBe('test@example.com');
    });

    test('fills form using object config', async () => {
      const result = await agent.fillForm({
        selector: '#password',
        value: 'secret123',
      });

      expect(result.value).toBe('secret123');
    });

    test('records fill interaction', async () => {
      await agent.fillForm('#field', 'value');

      expect(agent.session.interactions.length).toBe(1);
      expect(agent.session.interactions[0].type).toBe(INTERACTION_TYPES.FILL);
    });

    test('scrolls page', async () => {
      const result = await agent.scroll({ direction: 'down', amount: 500 });

      expect(result).toBeDefined();
      expect(result.direction).toBe('down');
      expect(result.amount).toBe(500);
    });

    test('records scroll interaction', async () => {
      await agent.scroll();

      expect(agent.session.interactions.length).toBe(1);
      expect(agent.session.interactions[0].type).toBe(INTERACTION_TYPES.SCROLL);
    });
  });

  describe('Data Extraction', () => {
    test('extracts data from multiple selectors', async () => {
      const result = await agent.extractData({
        title: 'h1',
        description: '.desc',
        price: '.price',
      });

      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.count).toBeGreaterThanOrEqual(0);
    });

    test('records extraction interaction', async () => {
      await agent.extractData({ field1: 'selector1' });

      expect(agent.session.interactions.length).toBe(1);
      expect(agent.session.interactions[0].type).toBe(INTERACTION_TYPES.EXTRACT);
    });

    test('handles extraction errors gracefully', async () => {
      const result = await agent.extractData({
        field1: '#non-existent',
        field2: '.missing',
      });

      expect(result.errors).toBeDefined();
    });
  });

  describe('Navigation', () => {
    test('navigates to URL', async () => {
      const result = await agent.navigate('https://example.com');

      expect(result).toBeDefined();
      expect(result.url).toBe('https://example.com');
      expect(result.ok).toBe(true);
    });

    test('records navigation', async () => {
      await agent.navigate('https://example.com');

      expect(agent.session.interactions.length).toBe(1);
      expect(agent.session.interactions[0].type).toBe(INTERACTION_TYPES.NAVIGATE);
    });

    test('updates current URL in metadata', async () => {
      await agent.navigate('https://test.com');

      expect(agent.session.metadata.currentUrl).toBe('https://test.com');
    });
  });

  describe('JavaScript Execution', () => {
    test('executes JavaScript code', async () => {
      const result = await agent.executeScript('return 2 + 2');

      expect(result).toBeDefined();
    });

    test('handles script errors', async () => {
      mockPage.evaluate = async () => {
        throw new Error('Script error');
      };

      const testAgent = new UIAutomationAgent({
        page: mockPage,
        visionEnabled: false,
      });

      await expect(testAgent.executeScript('throw new Error("test")')).rejects.toThrow();
    });
  });

  describe('Wait Conditions', () => {
    test('waits for element visibility', async () => {
      const result = await agent.waitForElement('#btn', WAIT_CONDITIONS.VISIBLE);
      expect(typeof result).toBe('boolean');
    });

    test('waits for element presence', async () => {
      const result = await agent.waitForElement('#btn', WAIT_CONDITIONS.PRESENT);
      expect(typeof result).toBe('boolean');
    });

    test('waits for clickable element', async () => {
      const result = await agent.waitForElement('#btn', WAIT_CONDITIONS.CLICKABLE);
      expect(typeof result).toBe('boolean');
    });

    test('handles wait timeout', async () => {
      mockPage.waitForSelector = async () => {
        throw new Error('Timeout');
      };

      const testAgent = new UIAutomationAgent({
        page: mockPage,
        visionEnabled: false,
      });

      const result = await testAgent.waitForElement('#btn', WAIT_CONDITIONS.VISIBLE);
      expect(result).toBe(false);
    });
  });

  describe('Session Management', () => {
    test('gets session summary', () => {
      agent.recordAction('test1', {});
      agent.recordAction('test2', {});

      const summary = agent.getSummary();

      expect(summary).toBeDefined();
      expect(summary.sessionId).toBe(agent.session.id);
      expect(summary.actionsCount).toBe(2);
      expect(summary.stats).toBeDefined();
    });

    test('calculates success rate', () => {
      const id1 = agent.recordAction('test1', {});
      const id2 = agent.recordAction('test2', {});

      agent.updateAction(id1, 'success', {});
      agent.updateAction(id2, 'error', {});

      const rate = agent.getSuccessRate();
      expect(rate).toBe(50);
    });

    test('calculates total duration', () => {
      agent.recordAction('test1', {});
      agent.recordAction('test2', {});

      // Mock durations
      agent.session.actions[0].duration = 100;
      agent.session.actions[1].duration = 200;

      const total = agent.getTotalDuration();
      expect(total).toBe(300);
    });

    test('calculates average action duration', () => {
      agent.recordAction('test1', {});
      agent.recordAction('test2', {});
      agent.recordAction('test3', {});

      agent.session.actions[0].duration = 100;
      agent.session.actions[1].duration = 200;
      agent.session.actions[2].duration = 300;

      const avg = agent.getAverageActionDuration();
      expect(avg).toBe(200);
    });
  });

  describe('Session Export', () => {
    test('exports session as JSON', () => {
      agent.recordAction('test', {});

      const exported = agent.exportSession('json');

      expect(exported).toBeDefined();
      expect(exported.sessionId).toBeDefined();
      expect(exported.actions).toBeDefined();
    });

    test('generates automation report', () => {
      agent.recordAction('test1', {});
      agent.recordError('test_error', new Error('Test'));

      const report = agent.generateReport();

      expect(report).toBeDefined();
      expect(report.title).toBe('UI Automation Session Report');
      expect(report.timeline).toBeDefined();
      expect(report.issues).toBeDefined();
    });

    test('generates recommendations', () => {
      // Add multiple errors
      for (let i = 0; i < 6; i++) {
        agent.recordError('action', new Error('Error ' + i));
      }

      const recommendations = agent.generateRecommendations();

      expect(recommendations).toBeDefined();
      expect(recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('Constants', () => {
    test('defines interaction types', () => {
      expect(INTERACTION_TYPES.CLICK).toBe('click');
      expect(INTERACTION_TYPES.FILL).toBe('fill');
      expect(INTERACTION_TYPES.EXTRACT).toBe('extract');
      expect(INTERACTION_TYPES.NAVIGATE).toBe('navigate');
    });

    test('defines element types', () => {
      expect(ELEMENT_TYPES.BUTTON).toBe('button');
      expect(ELEMENT_TYPES.INPUT).toBe('input');
      expect(ELEMENT_TYPES.TABLE).toBe('table');
    });

    test('defines wait conditions', () => {
      expect(WAIT_CONDITIONS.VISIBLE).toBe('visible');
      expect(WAIT_CONDITIONS.CLICKABLE).toBe('clickable');
      expect(WAIT_CONDITIONS.PRESENT).toBe('present');
    });

    test('defines configuration', () => {
      expect(CONFIG.DEFAULT_TIMEOUT).toBe(30000);
      expect(CONFIG.ACTION_DELAY).toBe(500);
      expect(CONFIG.MAX_RETRIES).toBe(3);
    });
  });

  describe('Error Handling', () => {
    test('records and tracks errors', async () => {
      mockPage.click = async () => {
        throw new Error('Click failed');
      };

      const testAgent = new UIAutomationAgent({
        page: mockPage,
        visionEnabled: false,
      });

      await expect(testAgent.clickElement('#btn')).rejects.toThrow();
      expect(testAgent.session.errors.length).toBeGreaterThan(0);
    });

    test('updates action on error', async () => {
      mockPage.click = async () => {
        throw new Error('Click failed');
      };

      const testAgent = new UIAutomationAgent({
        page: mockPage,
        visionEnabled: false,
      });

      await expect(testAgent.clickElement('#btn')).rejects.toThrow();

      const action = testAgent.session.actions[0];
      expect(action.status).toBe('error');
    });
  });
});
