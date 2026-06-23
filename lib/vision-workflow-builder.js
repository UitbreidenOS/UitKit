/**
 * Vision Workflow Builder
 *
 * Learns automation patterns from screenshot sequences without coding.
 * Uses vision analysis to detect UI elements, user interactions, and data patterns,
 * then applies learned workflows to new screenshots.
 *
 * Usage:
 *   const builder = require('./vision-workflow-builder');
 *   const learner = builder.createLearner();
 *   await learner.learnFromSequence([screenshot1, screenshot2, screenshot3]);
 *   const actions = await learner.applyWorkflow(newScreenshot);
 */

const { performance } = require('perf_hooks');

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

const UI_ELEMENT_TYPES = {
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
};

const INTERACTION_TYPES = {
  CLICK: 'click',
  TYPE: 'type',
  SELECT: 'select',
  SUBMIT: 'submit',
  HOVER: 'hover',
  SCROLL: 'scroll',
  DRAG: 'drag',
  WAIT: 'wait',
  EXTRACT: 'extract',
};

const PATTERN_CONFIDENCE = {
  HIGH: 0.8,
  MEDIUM: 0.6,
  LOW: 0.4,
};

// ============================================================================
// UI ELEMENT DETECTION
// ============================================================================

/**
 * Extract UI elements from a screenshot using vision analysis
 */
function extractUIElements(screenshot) {
  const elements = [];
  let elementId = 0;

  // Parse OCR/vision data to find text regions (buttons, labels, inputs)
  const textRegions = analyzeTextRegions(screenshot);

  textRegions.forEach(region => {
    const element = {
      id: `elem_${elementId++}`,
      type: classifyElementType(region),
      text: region.text,
      bounds: region.bounds,
      position: {
        x: region.bounds.left + (region.bounds.width / 2),
        y: region.bounds.top + (region.bounds.height / 2),
      },
      confidence: region.confidence,
      properties: extractElementProperties(region),
    };
    elements.push(element);
  });

  // Detect visual elements (images, icons, separators)
  const visualElements = analyzeVisualElements(screenshot);
  visualElements.forEach(elem => {
    elements.push({
      id: `elem_${elementId++}`,
      type: elem.type,
      bounds: elem.bounds,
      position: {
        x: elem.bounds.left + (elem.bounds.width / 2),
        y: elem.bounds.top + (elem.bounds.height / 2),
      },
      confidence: elem.confidence,
      properties: elem.properties,
    });
  });

  return elements;
}

/**
 * Analyze text regions in screenshot
 */
function analyzeTextRegions(screenshot) {
  const regions = [];

  // Simulate vision API response with text detection
  // In production, this would call Claude Vision API or similar
  const visionData = screenshot.visionData || [];

  visionData.forEach(item => {
    if (item.type === 'text' || item.type === 'word') {
      regions.push({
        text: item.text || '',
        bounds: item.boundingBox || { left: 0, top: 0, width: 0, height: 0 },
        confidence: item.confidence || 0.9,
      });
    }
  });

  return regions;
}

/**
 * Classify element type based on visual characteristics
 */
function classifyElementType(region) {
  const text = (region.text || '').toLowerCase();
  const bounds = region.bounds || {};
  const aspectRatio = (bounds.width || 1) / (bounds.height || 1);

  // Heuristics for element classification
  if (text.match(/^(submit|ok|save|delete|cancel|close|next|back|search|login)/i)) {
    return UI_ELEMENT_TYPES.BUTTON;
  }
  if (text.match(/^(email|password|username|name|phone|address|search|enter|type)/i)) {
    return UI_ELEMENT_TYPES.TEXT_INPUT;
  }
  if (text.match(/^(select|choose|option|filter|sort|by)/i)) {
    return UI_ELEMENT_TYPES.DROPDOWN;
  }
  if (text.match(/^(check|agree|enable|disable)/i)) {
    return UI_ELEMENT_TYPES.CHECKBOX;
  }
  if (aspectRatio > 3) {
    return UI_ELEMENT_TYPES.LABEL;
  }
  if (bounds.width > 200 && bounds.height > 100) {
    return UI_ELEMENT_TYPES.TABLE;
  }

  return UI_ELEMENT_TYPES.TEXT;
}

/**
 * Extract element properties
 */
function extractElementProperties(region) {
  return {
    size: {
      width: region.bounds.width,
      height: region.bounds.height,
    },
    color: region.color || 'unknown',
    style: region.style || 'normal',
    clickable: isLikelyClickable(region),
    filled: isFilledElement(region),
  };
}

/**
 * Analyze visual elements (images, icons, etc.)
 */
function analyzeVisualElements(screenshot) {
  const elements = [];
  const visualData = screenshot.visualData || [];

  visualData.forEach(item => {
    if (item.type === 'image' || item.type === 'icon') {
      elements.push({
        type: item.type === 'icon' ? UI_ELEMENT_TYPES.ICON : UI_ELEMENT_TYPES.IMAGE,
        bounds: item.boundingBox || { left: 0, top: 0, width: 0, height: 0 },
        confidence: item.confidence || 0.85,
        properties: {
          isButton: item.isButton || false,
          description: item.description || '',
        },
      });
    }
  });

  return elements;
}

function isLikelyClickable(region) {
  const text = (region.text || '').toLowerCase();
  return text.match(/(button|click|submit|select|choose|option|link)/i) !== null;
}

function isFilledElement(region) {
  return region.filled === true || (region.text && region.text.length > 0);
}

// ============================================================================
// INTERACTION DETECTION
// ============================================================================

/**
 * Detect interactions between consecutive screenshots
 */
function detectInteractions(prevScreenshot, currScreenshot, prevElements, currElements) {
  const interactions = [];

  // Match elements between screenshots
  const elementMap = matchElements(prevElements, currElements);

  // Detect what changed
  elementMap.forEach((currElem, prevElem) => {
    const changes = detectElementChanges(prevElem, currElem);

    if (changes.disappeared) {
      interactions.push({
        type: INTERACTION_TYPES.CLICK,
        targetId: prevElem.id,
        targetText: prevElem.text,
        targetType: prevElem.type,
        position: prevElem.position,
        confidence: 0.9,
        reason: 'Element disappeared after click',
      });
    } else if (changes.textChanged) {
      interactions.push({
        type: INTERACTION_TYPES.TYPE,
        targetId: prevElem.id,
        targetText: prevElem.text,
        newText: currElem.text,
        position: prevElem.position,
        confidence: 0.85,
        reason: 'Text content changed',
      });
    } else if (changes.stateChanged) {
      interactions.push({
        type: INTERACTION_TYPES.SELECT,
        targetId: prevElem.id,
        targetText: prevElem.text,
        newState: changes.newState,
        position: prevElem.position,
        confidence: 0.8,
        reason: 'Element state changed',
      });
    } else if (changes.positionChanged) {
      interactions.push({
        type: INTERACTION_TYPES.SCROLL,
        direction: changes.scrollDirection,
        distance: changes.scrollDistance,
        confidence: 0.75,
        reason: 'Page scrolled',
      });
    }
  });

  // Detect new elements (might indicate navigation or modal opening)
  const newElements = currElements.filter(
    ce => !elementMap.has(prevElements.find(pe => pe.id === ce.id))
  );

  if (newElements.length > 0) {
    interactions.push({
      type: INTERACTION_TYPES.WAIT,
      description: `${newElements.length} new elements appeared`,
      confidence: 0.7,
      reason: 'Page navigation or dynamic content loading',
    });
  }

  return interactions;
}

/**
 * Match elements between two screenshots based on similarity
 */
function matchElements(prevElements, currElements) {
  const map = new Map();

  prevElements.forEach(prevElem => {
    let bestMatch = null;
    let bestScore = 0.3; // Minimum confidence threshold

    currElements.forEach(currElem => {
      const score = calculateElementSimilarity(prevElem, currElem);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = currElem;
      }
    });

    if (bestMatch) {
      map.set(prevElem, bestMatch);
    }
  });

  return map;
}

/**
 * Calculate similarity between two elements
 */
function calculateElementSimilarity(elem1, elem2) {
  let score = 0;
  let factors = 0;

  // Text similarity
  if (elem1.text && elem2.text) {
    const textSim = calculateStringSimilarity(elem1.text, elem2.text);
    score += textSim;
    factors++;
  }

  // Type similarity
  if (elem1.type === elem2.type) {
    score += 0.3;
    factors++;
  }

  // Position similarity
  if (elem1.position && elem2.position) {
    const maxDistance = 50; // pixels
    const distance = Math.hypot(
      elem1.position.x - elem2.position.x,
      elem1.position.y - elem2.position.y
    );
    const posSim = Math.max(0, 1 - distance / maxDistance);
    score += posSim * 0.4;
    factors++;
  }

  return factors > 0 ? score / factors : 0;
}

/**
 * Calculate string similarity (Levenshtein-like)
 */
function calculateStringSimilarity(str1, str2) {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  if (s1 === s2) return 1.0;
  if (Math.abs(s1.length - s2.length) > s1.length * 0.5) return 0;

  let matches = 0;
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  for (const char of shorter) {
    if (longer.includes(char)) matches++;
  }

  return matches / longer.length;
}

/**
 * Detect changes to an element
 */
function detectElementChanges(prevElem, currElem) {
  return {
    disappeared: !currElem,
    textChanged: prevElem.text !== currElem?.text,
    stateChanged: prevElem.properties?.filled !== currElem?.properties?.filled,
    positionChanged:
      prevElem.position?.x !== currElem?.position?.x ||
      prevElem.position?.y !== currElem?.position?.y,
    newState: currElem?.properties?.filled ? 'filled' : 'empty',
    scrollDirection: prevElem.position?.y < currElem?.position?.y ? 'down' : 'up',
    scrollDistance: Math.abs((prevElem.position?.y || 0) - (currElem?.position?.y || 0)),
  };
}

// ============================================================================
// PATTERN LEARNING & EXTRACTION
// ============================================================================

/**
 * Learn workflow pattern from screenshot sequence
 */
function learnWorkflowPattern(screenshots, elementSequences) {
  const startTime = performance.now();
  const pattern = {
    id: `pattern_${Date.now()}`,
    steps: [],
    metadata: {
      screenshotCount: screenshots.length,
      learnedAt: new Date().toISOString(),
    },
  };

  // Convert element sequences to actionable steps
  for (let i = 0; i < screenshots.length - 1; i++) {
    const currScreenshot = screenshots[i];
    const nextScreenshot = screenshots[i + 1];
    const currElements = elementSequences[i];
    const nextElements = elementSequences[i + 1];

    const interactions = detectInteractions(
      currScreenshot,
      nextScreenshot,
      currElements,
      nextElements
    );

    interactions.forEach(interaction => {
      pattern.steps.push({
        stepIndex: i,
        interaction,
        contextBefore: {
          elementCount: currElements.length,
          visibleText: currElements
            .filter(e => e.type === UI_ELEMENT_TYPES.LABEL || e.type === UI_ELEMENT_TYPES.BUTTON)
            .map(e => e.text),
        },
        contextAfter: {
          elementCount: nextElements.length,
          visibleText: nextElements
            .filter(e => e.type === UI_ELEMENT_TYPES.LABEL || e.type === UI_ELEMENT_TYPES.BUTTON)
            .map(e => e.text),
        },
      });
    });
  }

  const duration = performance.now() - startTime;

  return {
    ...pattern,
    metadata: {
      ...pattern.metadata,
      duration_ms: parseFloat(duration.toFixed(2)),
      stepCount: pattern.steps.length,
    },
  };
}

/**
 * Generalize pattern for reuse on different UI layouts
 */
function generalizePattern(pattern) {
  const generalized = {
    ...pattern,
    rules: [],
    selectors: [],
  };

  pattern.steps.forEach((step, index) => {
    const { interaction } = step;

    // Create element selector rules
    if (interaction.targetText) {
      generalized.selectors.push({
        priority: index,
        rules: [
          { type: 'text', value: interaction.targetText, fuzzy: true },
          { type: 'elementType', value: interaction.targetType },
        ],
      });
    }

    // Extract reusable rules
    if (interaction.type === INTERACTION_TYPES.TYPE && interaction.newText) {
      generalized.rules.push({
        type: 'dataExtraction',
        pattern: extractDataPattern(interaction.newText),
        appliesTo: interaction.targetType,
      });
    }

    if (interaction.type === INTERACTION_TYPES.SELECT) {
      generalized.rules.push({
        type: 'stateTransition',
        from: 'unselected',
        to: interaction.newState,
        condition: `element matches "${interaction.targetText}"`,
      });
    }
  });

  return generalized;
}

/**
 * Extract data pattern from text input
 */
function extractDataPattern(text) {
  if (text.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return { type: 'date', format: 'YYYY-MM-DD' };
  }
  if (text.match(/^\d{3}-\d{3}-\d{4}$/)) {
    return { type: 'phone', format: 'XXX-XXX-XXXX' };
  }
  if (text.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return { type: 'email', format: 'user@domain.com' };
  }
  if (text.match(/^\d+$/)) {
    return { type: 'number', format: 'integer' };
  }
  if (text.match(/^\d+\.\d{2}$/)) {
    return { type: 'currency', format: 'decimal' };
  }

  return { type: 'text', format: 'freeform' };
}

// ============================================================================
// WORKFLOW APPLICATION
// ============================================================================

/**
 * Apply learned pattern to new screenshot
 */
function applyPatternToScreenshot(pattern, newScreenshot, newElements) {
  const startTime = performance.now();
  const actions = [];
  let matchedSteps = 0;

  pattern.steps.forEach((step, index) => {
    const { interaction } = step;
    const matchedElement = findMatchingElement(newElements, interaction);

    if (matchedElement) {
      matchedSteps++;
      actions.push({
        order: index,
        type: interaction.type,
        target: {
          id: matchedElement.id,
          text: matchedElement.text,
          position: matchedElement.position,
          type: matchedElement.type,
        },
        payload: {
          newText: interaction.newText,
          newState: interaction.newState,
        },
        confidence: calculateActionConfidence(interaction, matchedElement),
      });
    } else {
      // Couldn't find exact match, try fuzzy matching
      const fuzzyMatch = findFuzzyMatchingElement(newElements, interaction);
      if (fuzzyMatch && fuzzyMatch.confidence > PATTERN_CONFIDENCE.MEDIUM) {
        actions.push({
          order: index,
          type: interaction.type,
          target: {
            id: fuzzyMatch.element.id,
            text: fuzzyMatch.element.text,
            position: fuzzyMatch.element.position,
            type: fuzzyMatch.element.type,
          },
          confidence: fuzzyMatch.confidence,
          warning: 'Fuzzy match used - element may not be exact',
        });
      } else {
        actions.push({
          order: index,
          type: 'wait',
          description: `Unable to find element matching "${interaction.targetText}"`,
          confidence: 0,
          status: 'unmatched',
        });
      }
    }
  });

  const duration = performance.now() - startTime;

  return {
    patternId: pattern.id,
    actions,
    metadata: {
      matchedSteps,
      totalSteps: pattern.steps.length,
      matchRate: (matchedSteps / pattern.steps.length).toFixed(2),
      duration_ms: parseFloat(duration.toFixed(2)),
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Find element matching interaction requirement
 */
function findMatchingElement(elements, interaction) {
  return elements.find(
    elem =>
      elem.text === interaction.targetText &&
      elem.type === interaction.targetType
  );
}

/**
 * Find element using fuzzy matching
 */
function findFuzzyMatchingElement(elements, interaction) {
  let bestMatch = null;
  let bestScore = PATTERN_CONFIDENCE.MEDIUM;

  elements.forEach(elem => {
    const score = calculateElementSimilarity(
      { text: interaction.targetText, type: interaction.targetType },
      elem
    );

    if (score > bestScore) {
      bestScore = score;
      bestMatch = { element: elem, confidence: score };
    }
  });

  return bestMatch;
}

/**
 * Calculate confidence for action execution
 */
function calculateActionConfidence(interaction, element) {
  let confidence = 0.9; // Base confidence for exact matches

  if (interaction.targetType !== element.type) {
    confidence -= 0.2;
  }

  if (element.confidence) {
    confidence *= element.confidence;
  }

  return Math.max(0, Math.min(1, confidence));
}

// ============================================================================
// WORKFLOW ORCHESTRATION
// ============================================================================

/**
 * Create a workflow learner instance
 */
function createLearner() {
  const learner = {
    patterns: new Map(),
    history: [],

    /**
     * Learn workflow from screenshot sequence
     */
    async learnFromSequence(screenshots, metadata = {}) {
      const startTime = performance.now();
      const elementSequences = [];

      // Extract elements from each screenshot
      for (const screenshot of screenshots) {
        const elements = extractUIElements(screenshot);
        elementSequences.push(elements);
      }

      // Learn pattern from sequence
      const pattern = learnWorkflowPattern(screenshots, elementSequences);
      const generalized = generalizePattern(pattern);

      // Store pattern
      learner.patterns.set(generalized.id, {
        ...generalized,
        metadata: {
          ...generalized.metadata,
          ...metadata,
          sourceDomain: metadata.domain || 'unknown',
          trainingSamples: screenshots.length,
        },
      });

      const duration = performance.now() - startTime;

      const result = {
        patternId: generalized.id,
        stepCount: generalized.steps.length,
        ruleCount: generalized.rules.length,
        selectorCount: generalized.selectors.length,
        duration_ms: parseFloat(duration.toFixed(2)),
        timestamp: new Date().toISOString(),
      };

      learner.history.push({ action: 'learnFromSequence', result });
      return result;
    },

    /**
     * Apply learned pattern to new screenshot
     */
    async applyWorkflow(screenshot, patternId) {
      if (!learner.patterns.has(patternId)) {
        throw new Error(`Pattern not found: ${patternId}`);
      }

      const pattern = learner.patterns.get(patternId);
      const elements = extractUIElements(screenshot);
      const actionPlan = applyPatternToScreenshot(pattern, screenshot, elements);

      learner.history.push({
        action: 'applyWorkflow',
        patternId,
        result: actionPlan.metadata,
      });

      return actionPlan;
    },

    /**
     * List all learned patterns
     */
    listPatterns() {
      return Array.from(learner.patterns.values()).map(p => ({
        id: p.id,
        stepCount: p.steps.length,
        ruleCount: p.rules.length,
        learnedAt: p.metadata.learnedAt,
        sourceDomain: p.metadata.sourceDomain,
      }));
    },

    /**
     * Get pattern details
     */
    getPattern(patternId) {
      return learner.patterns.get(patternId);
    },

    /**
     * Merge multiple patterns into composite workflow
     */
    mergePatterns(patternIds) {
      const patterns = patternIds
        .map(id => learner.patterns.get(id))
        .filter(p => p !== undefined);

      if (patterns.length === 0) {
        throw new Error('No valid patterns to merge');
      }

      const merged = {
        id: `merged_${Date.now()}`,
        steps: [],
        rules: [],
        metadata: {
          sourcePatterns: patternIds,
          mergedAt: new Date().toISOString(),
        },
      };

      patterns.forEach(pattern => {
        merged.steps.push(...pattern.steps);
        merged.rules.push(...pattern.rules);
      });

      // Deduplicate similar steps
      merged.steps = deduplicateSteps(merged.steps);

      learner.patterns.set(merged.id, merged);
      return { mergedId: merged.id, stepCount: merged.steps.length };
    },

    /**
     * Get execution history
     */
    getHistory(limit = 50) {
      return learner.history.slice(-limit);
    },

    /**
     * Clear patterns
     */
    clearPatterns() {
      learner.patterns.clear();
      return { status: 'cleared', timestamp: new Date().toISOString() };
    },
  };

  return learner;
}

/**
 * Deduplicate similar workflow steps
 */
function deduplicateSteps(steps) {
  const seen = new Set();
  const unique = [];

  steps.forEach(step => {
    const key = `${step.interaction.type}:${step.interaction.targetText || step.interaction.description}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(step);
    }
  });

  return unique;
}

// ============================================================================
// ADVANCED WORKFLOW FEATURES
// ============================================================================

/**
 * Generate executable workflow script
 */
function generateWorkflowScript(actionPlan, format = 'javascript') {
  const { actions } = actionPlan;
  let script = '';

  if (format === 'javascript') {
    script = 'async function executeWorkflow() {\n';
    script += '  const browser = await puppeteer.launch();\n';
    script += '  const page = await browser.newPage();\n\n';

    actions.forEach((action, index) => {
      switch (action.type) {
        case INTERACTION_TYPES.CLICK:
          script += `  // Step ${index + 1}: Click ${action.target.text}\n`;
          script += `  await page.click('[aria-label="${action.target.text}"], button:contains("${action.target.text}")');\n`;
          break;
        case INTERACTION_TYPES.TYPE:
          script += `  // Step ${index + 1}: Type into ${action.target.text}\n`;
          script += `  await page.type('input', '${action.payload.newText}');\n`;
          break;
        case INTERACTION_TYPES.SELECT:
          script += `  // Step ${index + 1}: Select option\n`;
          script += `  await page.select('select', '${action.payload.newState}');\n`;
          break;
        case INTERACTION_TYPES.WAIT:
          script += `  // Step ${index + 1}: Wait for navigation\n`;
          script += `  await page.waitForNavigation({ waitUntil: 'networkidle2' });\n`;
          break;
      }
      script += `  await page.waitForTimeout(500);\n\n`;
    });

    script += '  await browser.close();\n';
    script += '}\n';
  } else if (format === 'json') {
    script = JSON.stringify(actions, null, 2);
  }

  return script;
}

/**
 * Compare workflow patterns
 */
function comparePatterns(pattern1, pattern2) {
  const comparison = {
    pattern1Id: pattern1.id,
    pattern2Id: pattern2.id,
    commonSteps: [],
    uniqueToPattern1: [],
    uniqueToPattern2: [],
    similarity: 0,
  };

  pattern1.steps.forEach(step1 => {
    const match = pattern2.steps.find(
      step2 =>
        step2.interaction.type === step1.interaction.type &&
        step2.interaction.targetText === step1.interaction.targetText
    );

    if (match) {
      comparison.commonSteps.push({
        stepType: step1.interaction.type,
        targetText: step1.interaction.targetText,
      });
    } else {
      comparison.uniqueToPattern1.push({
        stepType: step1.interaction.type,
        targetText: step1.interaction.targetText,
      });
    }
  });

  pattern2.steps.forEach(step2 => {
    const match = pattern1.steps.find(
      step1 =>
        step1.interaction.type === step2.interaction.type &&
        step1.interaction.targetText === step2.interaction.targetText
    );

    if (!match) {
      comparison.uniqueToPattern2.push({
        stepType: step2.interaction.type,
        targetText: step2.interaction.targetText,
      });
    }
  });

  const maxSteps = Math.max(pattern1.steps.length, pattern2.steps.length);
  comparison.similarity = (comparison.commonSteps.length / maxSteps).toFixed(2);

  return comparison;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  createLearner,
  extractUIElements,
  detectInteractions,
  learnWorkflowPattern,
  generalizePattern,
  applyPatternToScreenshot,
  generateWorkflowScript,
  comparePatterns,

  // Utilities
  UI_ELEMENT_TYPES,
  INTERACTION_TYPES,
  PATTERN_CONFIDENCE,
  calculateElementSimilarity,
  findMatchingElement,
  findFuzzyMatchingElement,
  extractDataPattern,
  deduplicateSteps,
};
