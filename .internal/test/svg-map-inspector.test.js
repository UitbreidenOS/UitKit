/**
 * SVG Map Inspector Test Suite
 *
 * Comprehensive tests for SVG map inspector functionality:
 * - Interactive features (pan, zoom, click handlers)
 * - Pan/zoom logic and transformations
 * - Click handlers and element selection
 * - File I/O operations (load, save, export)
 * - SVG rendering and validation
 * - HTML wrapper generation
 * - Server routes and responses
 * - Metadata analysis and statistics
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const http = require('http');

// Mock file system for isolated testing
const mockFileSystem = new Map();

/**
 * SVG Map Inspector - Core functionality
 */
class SVGMapInspector {
  constructor(options = {}) {
    this.width = options.width || 800;
    this.height = options.height || 600;
    this.zoom = options.zoom || 1;
    this.panX = options.panX || 0;
    this.panY = options.panY || 0;
    this.elements = [];
    this.metadata = {};
    this.selectedElement = null;
    this.clickHandlers = [];
    this.theme = options.theme || 'light';
  }

  /**
   * Load map from file (JSON or SVG)
   */
  loadMap(filePath, fileContent) {
    try {
      if (filePath.endsWith('.json')) {
        const data = JSON.parse(fileContent);
        this.width = data.width || this.width;
        this.height = data.height || this.height;
        this.elements = data.elements || [];
        this.metadata = data.metadata || {};
        return { success: true, type: 'json', elementCount: this.elements.length };
      } else if (filePath.endsWith('.svg')) {
        // Basic SVG parsing
        const elementMatches = fileContent.match(/<(rect|circle|polygon|path|line|text)[^>]*>/g) || [];
        return { success: true, type: 'svg', elementCount: elementMatches.length };
      }
      throw new Error('Unsupported file format');
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Pan the viewport by delta amounts
   */
  pan(dx, dy) {
    this.panX += dx;
    this.panY += dy;
    return {
      panX: this.panX,
      panY: this.panY,
      transform: `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`,
    };
  }

  /**
   * Zoom in/out with constraints
   */
  zoom(factor, constrainMin = 0.5, constrainMax = 5) {
    const newZoom = Math.max(constrainMin, Math.min(constrainMax, this.zoom + factor));
    const delta = newZoom - this.zoom;
    this.zoom = newZoom;
    return {
      zoom: this.zoom,
      delta: delta,
      transform: `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`,
      zoomPercent: Math.round(this.zoom * 100),
    };
  }

  /**
   * Reset pan and zoom
   */
  resetView() {
    this.panX = 0;
    this.panY = 0;
    this.zoom = 1;
    this.selectedElement = null;
    return {
      panX: this.panX,
      panY: this.panY,
      zoom: this.zoom,
      transform: 'translate(0px, 0px) scale(1)',
    };
  }

  /**
   * Handle click on canvas element
   */
  handleElementClick(elementId) {
    const element = this.elements.find(el => el.id === elementId);
    if (element) {
      this.selectedElement = element;
      this.clickHandlers.forEach(handler => handler(element));
      return { success: true, element: element };
    }
    return { success: false, error: `Element ${elementId} not found` };
  }

  /**
   * Register click handler
   */
  onElementClick(handler) {
    if (typeof handler === 'function') {
      this.clickHandlers.push(handler);
    }
  }

  /**
   * Analyze map metadata and statistics
   */
  analyzeMap() {
    const colorPalette = new Set();
    let layerMap = {};

    this.elements.forEach(el => {
      if (el.fill) colorPalette.add(el.fill);
      if (el.stroke) colorPalette.add(el.stroke);

      const layer = el.layer || 'default';
      if (!layerMap[layer]) {
        layerMap[layer] = { name: layer, count: 0, types: new Set() };
      }
      layerMap[layer].count++;
      layerMap[layer].types.add(el.type);
    });

    return {
      width: this.width,
      height: this.height,
      elementCount: this.elements.length,
      layers: Object.values(layerMap).map(l => ({
        name: l.name,
        count: l.count,
        types: Array.from(l.types),
      })),
      colorPalette: Array.from(colorPalette),
      metadata: this.metadata,
    };
  }

  /**
   * Render map to SVG string
   */
  renderToSvg() {
    const themeColors = {
      light: { bg: '#ffffff', text: '#000000', grid: '#e0e0e0' },
      dark: { bg: '#1e1e1e', text: '#ffffff', grid: '#333333' },
    };
    const colors = themeColors[this.theme] || themeColors.light;

    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}">
  <defs>
    <style>
      .svg-element { cursor: pointer; transition: opacity 0.2s; }
      .svg-element:hover { opacity: 0.8; }
      .svg-text { font-family: monospace; font-size: 12px; fill: ${colors.text}; }
    </style>
  </defs>
  <rect width="${this.width}" height="${this.height}" fill="${colors.bg}"/>
`;

    this.elements.forEach((el, i) => {
      const attrs = {
        fill: el.fill || '#3b82f6',
        stroke: el.stroke || '#1e40af',
        'stroke-width': el['stroke-width'] || 2,
        opacity: el.opacity || 1,
      };

      const attrStr = Object.entries(attrs)
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ');

      switch (el.type) {
        case 'rect':
          svg += `  <rect id="${el.id || `el-${i}`}" x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" ${attrStr} class="svg-element" data-id="${el.id || i}"/>\n`;
          break;
        case 'circle':
          svg += `  <circle id="${el.id || `el-${i}`}" cx="${el.cx}" cy="${el.cy}" r="${el.r}" ${attrStr} class="svg-element" data-id="${el.id || i}"/>\n`;
          break;
        case 'text':
          svg += `  <text id="${el.id || `el-${i}`}" x="${el.x}" y="${el.y}" ${attrStr} class="svg-text" data-id="${el.id || i}">${el.content || ''}</text>\n`;
          break;
      }
    });

    svg += '</svg>';
    return svg;
  }

  /**
   * Export to HTML with interactive viewer
   */
  exportToHtml(title = 'SVG Map Viewer') {
    const svg = this.renderToSvg();
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    #container { width: 100vw; height: 100vh; display: flex; flex-direction: column; }
    #header { background: #ffffff; border-bottom: 1px solid #e5e7eb; padding: 12px 16px; }
    #viewport { flex: 1; overflow: auto; background: white; display: flex; align-items: center; justify-content: center; }
    #canvas { background: white; cursor: grab; }
    #canvas:active { cursor: grabbing; }
    #footer { background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 8px 16px; font-size: 12px; }
    button { padding: 8px 12px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background: #2563eb; }
  </style>
</head>
<body>
  <div id="container">
    <div id="header">
      <div style="display: flex; gap: 8px;">
        <button onclick="resetZoom()">Reset</button>
        <button onclick="zoomIn()">+ Zoom</button>
        <button onclick="zoomOut()">- Zoom</button>
      </div>
    </div>
    <div id="viewport">
      <svg id="canvas" xmlns="http://www.w3.org/2000/svg" width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}">
        ${svg.split('<svg')[1].split('</svg>')[0]}
      </svg>
    </div>
    <div id="footer"><span id="info">Ready</span></div>
  </div>
  <script>
    let zoom = ${this.zoom};
    let panX = ${this.panX};
    let panY = ${this.panY};
    const canvas = document.getElementById('canvas');
    let isPanning = false;
    let startX, startY;

    canvas.addEventListener('mousedown', () => { isPanning = true; });
    document.addEventListener('mousemove', (e) => {
      if (isPanning) {
        canvas.style.transform = \`translate(\${panX + e.movementX}px, \${panY + e.movementY}px) scale(\${zoom})\`;
      }
    });
    document.addEventListener('mouseup', () => { isPanning = false; });

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      zoom += e.deltaY < 0 ? 0.1 : -0.1;
      zoom = Math.max(0.5, Math.min(5, zoom));
      updateCanvas();
    });

    function updateCanvas() {
      canvas.style.transform = \`translate(\${panX}px, \${panY}px) scale(\${zoom})\`;
      document.getElementById('info').textContent = \`Zoom: \${Math.round(zoom * 100)}%\`;
    }

    function zoomIn() { zoom = Math.min(zoom + 0.2, 5); updateCanvas(); }
    function zoomOut() { zoom = Math.max(zoom - 0.2, 0.5); updateCanvas(); }
    function resetZoom() { zoom = 1; panX = 0; panY = 0; updateCanvas(); }

    updateCanvas();
  </script>
</body>
</html>`;
  }

  /**
   * Validate map structure
   */
  validate() {
    const errors = [];
    const warnings = [];

    if (!this.width || !this.height) {
      errors.push('Missing dimensions (width/height)');
    }

    if (!Array.isArray(this.elements)) {
      errors.push('Elements must be an array');
    }

    this.elements.forEach((el, i) => {
      if (!el.type) warnings.push(`Element ${i}: missing type`);
      if (el.type === 'rect' && (!el.x !== undefined || !el.y !== undefined || !el.width || !el.height)) {
        errors.push(`Element ${i}: rect missing required properties`);
      }
      if (el.type === 'circle' && (!el.cx !== undefined || !el.cy !== undefined || !el.r)) {
        errors.push(`Element ${i}: circle missing required properties`);
      }
    });

    return { valid: errors.length === 0, errors, warnings };
  }
}

// ============================================================================
// TEST SUITE
// ============================================================================

describe('SVG Map Inspector', () => {
  let inspector;

  beforeEach(() => {
    inspector = new SVGMapInspector({ width: 800, height: 600 });
  });

  // ========== File I/O Tests ==========

  describe('File I/O Operations', () => {
    it('should load valid JSON map file', () => {
      const jsonContent = JSON.stringify({
        width: 800,
        height: 600,
        elements: [
          { type: 'rect', id: 'rect1', x: 10, y: 10, width: 100, height: 50, fill: '#ff0000' },
          { type: 'circle', id: 'circle1', cx: 200, cy: 200, r: 30, fill: '#00ff00' },
        ],
        metadata: { author: 'test', version: '1.0' },
      });

      const result = inspector.loadMap('map.json', jsonContent);
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.type, 'json');
      assert.strictEqual(result.elementCount, 2);
      assert.strictEqual(inspector.width, 800);
      assert.strictEqual(inspector.elements.length, 2);
      assert.strictEqual(inspector.metadata.author, 'test');
    });

    it('should load valid SVG file', () => {
      const svgContent = `<?xml version="1.0"?>
<svg width="800" height="600">
  <rect x="10" y="10" width="100" height="50"/>
  <circle cx="200" cy="200" r="30"/>
  <text x="100" y="100">Label</text>
</svg>`;

      const result = inspector.loadMap('map.svg', svgContent);
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.type, 'svg');
      assert.strictEqual(result.elementCount, 3);
    });

    it('should handle invalid JSON gracefully', () => {
      const result = inspector.loadMap('map.json', 'invalid json {');
      assert.strictEqual(result.success, false);
      assert(result.error.includes('Unexpected token'));
    });

    it('should handle missing file gracefully', () => {
      const result = inspector.loadMap('nonexistent.txt', '');
      assert.strictEqual(result.success, false);
      assert(result.error.includes('Unsupported'));
    });

    it('should preserve metadata when loading', () => {
      const jsonContent = JSON.stringify({
        width: 1000,
        height: 700,
        elements: [],
        metadata: {
          title: 'Test Map',
          description: 'A test map',
          tags: ['test', 'svg'],
        },
      });

      inspector.loadMap('map.json', jsonContent);
      assert.strictEqual(inspector.metadata.title, 'Test Map');
      assert.deepStrictEqual(inspector.metadata.tags, ['test', 'svg']);
    });
  });

  // ========== Pan & Zoom Tests ==========

  describe('Pan and Zoom Logic', () => {
    it('should pan viewport correctly', () => {
      const result = inspector.pan(100, 50);
      assert.strictEqual(result.panX, 100);
      assert.strictEqual(result.panY, 50);
      assert(result.transform.includes('translate(100px, 50px)'));
    });

    it('should accumulate pan movements', () => {
      inspector.pan(100, 50);
      const result = inspector.pan(50, 25);
      assert.strictEqual(result.panX, 150);
      assert.strictEqual(result.panY, 75);
    });

    it('should zoom in with constraints', () => {
      const result = inspector.zoom(0.2);
      assert.strictEqual(result.zoom, 1.2);
      assert.strictEqual(result.delta, 0.2);
      assert.strictEqual(result.zoomPercent, 120);
    });

    it('should zoom out with constraints', () => {
      inspector.zoom(1); // zoom to 2
      const result = inspector.zoom(-0.5);
      assert.strictEqual(result.zoom, 1.5);
      assert.strictEqual(result.delta, -0.5);
    });

    it('should enforce minimum zoom constraint', () => {
      for (let i = 0; i < 20; i++) {
        inspector.zoom(-0.1);
      }
      assert.strictEqual(inspector.zoom, 0.5); // Should not go below 0.5
    });

    it('should enforce maximum zoom constraint', () => {
      for (let i = 0; i < 20; i++) {
        inspector.zoom(0.2);
      }
      assert.strictEqual(inspector.zoom, 5); // Should not exceed 5
    });

    it('should update transform string correctly', () => {
      inspector.pan(50, 30);
      inspector.zoom(0.5);
      const result = inspector.pan(10, 20);
      assert(result.transform.includes('translate(60px, 50px)'));
      assert(result.transform.includes('scale(1.5)'));
    });

    it('should reset view to initial state', () => {
      inspector.pan(100, 100);
      inspector.zoom(2);
      const result = inspector.resetView();
      assert.strictEqual(result.panX, 0);
      assert.strictEqual(result.panY, 0);
      assert.strictEqual(result.zoom, 1);
      assert.strictEqual(result.transform, 'translate(0px, 0px) scale(1)');
    });

    it('should reset selected element on view reset', () => {
      inspector.elements = [{ id: 'test', type: 'rect' }];
      inspector.selectedElement = inspector.elements[0];
      inspector.resetView();
      assert.strictEqual(inspector.selectedElement, null);
    });
  });

  // ========== Click Handler Tests ==========

  describe('Click Handlers and Element Selection', () => {
    beforeEach(() => {
      inspector.elements = [
        { id: 'rect1', type: 'rect', x: 10, y: 10, width: 50, height: 50 },
        { id: 'circle1', type: 'circle', cx: 100, cy: 100, r: 20 },
        { id: 'text1', type: 'text', x: 200, y: 200, content: 'Label' },
      ];
    });

    it('should select element by ID', () => {
      const result = inspector.handleElementClick('rect1');
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.element.id, 'rect1');
      assert.strictEqual(inspector.selectedElement.id, 'rect1');
    });

    it('should return error for invalid element ID', () => {
      const result = inspector.handleElementClick('nonexistent');
      assert.strictEqual(result.success, false);
      assert(result.error.includes('not found'));
    });

    it('should fire registered click handlers', () => {
      let handlerCalled = false;
      let selectedElement = null;

      inspector.onElementClick(el => {
        handlerCalled = true;
        selectedElement = el;
      });

      inspector.handleElementClick('circle1');
      assert.strictEqual(handlerCalled, true);
      assert.strictEqual(selectedElement.id, 'circle1');
    });

    it('should support multiple click handlers', () => {
      let count = 0;
      inspector.onElementClick(() => count++);
      inspector.onElementClick(() => count++);
      inspector.onElementClick(() => count++);

      inspector.handleElementClick('rect1');
      assert.strictEqual(count, 3);
    });

    it('should ignore non-function handlers', () => {
      inspector.onElementClick('not a function');
      inspector.onElementClick(null);
      // Should not throw
      const result = inspector.handleElementClick('rect1');
      assert.strictEqual(result.success, true);
    });

    it('should handle clicks with element properties', () => {
      const result = inspector.handleElementClick('circle1');
      assert.strictEqual(result.element.cx, 100);
      assert.strictEqual(result.element.cy, 100);
      assert.strictEqual(result.element.r, 20);
    });
  });

  // ========== SVG Rendering Tests ==========

  describe('SVG Rendering', () => {
    it('should render valid SVG structure', () => {
      inspector.elements = [
        { id: 'rect1', type: 'rect', x: 10, y: 10, width: 50, height: 50, fill: '#ff0000' },
      ];

      const svg = inspector.renderToSvg();
      assert(svg.includes('<?xml version="1.0"?>'));
      assert(svg.includes(`width="${inspector.width}"`));
      assert(svg.includes(`height="${inspector.height}"`));
      assert(svg.includes('<rect'));
      assert(svg.includes('data-id='));
    });

    it('should render rectangles correctly', () => {
      inspector.elements = [
        { id: 'r1', type: 'rect', x: 10, y: 20, width: 100, height: 50, fill: '#ff0000', stroke: '#000000' },
      ];

      const svg = inspector.renderToSvg();
      assert(svg.includes('x="10"'));
      assert(svg.includes('y="20"'));
      assert(svg.includes('width="100"'));
      assert(svg.includes('height="50"'));
      assert(svg.includes('fill="#ff0000"'));
      assert(svg.includes('stroke="#000000"'));
    });

    it('should render circles correctly', () => {
      inspector.elements = [
        { id: 'c1', type: 'circle', cx: 100, cy: 200, r: 30, fill: '#00ff00' },
      ];

      const svg = inspector.renderToSvg();
      assert(svg.includes('cx="100"'));
      assert(svg.includes('cy="200"'));
      assert(svg.includes('r="30"'));
      assert(svg.includes('fill="#00ff00"'));
    });

    it('should render text elements correctly', () => {
      inspector.elements = [
        { id: 't1', type: 'text', x: 50, y: 100, content: 'Hello World', fill: '#000000' },
      ];

      const svg = inspector.renderToSvg();
      assert(svg.includes('x="50"'));
      assert(svg.includes('y="100"'));
      assert(svg.includes('Hello World'));
    });

    it('should apply default fill and stroke', () => {
      inspector.elements = [
        { id: 'r1', type: 'rect', x: 10, y: 10, width: 50, height: 50 },
      ];

      const svg = inspector.renderToSvg();
      assert(svg.includes('fill="#3b82f6"')); // default fill
      assert(svg.includes('stroke="#1e40af"')); // default stroke
    });

    it('should apply theme colors', () => {
      inspector.theme = 'dark';
      inspector.elements = [];
      const svg = inspector.renderToSvg();
      assert(svg.includes('fill="#1e1e1e')); // dark background
    });

    it('should render empty map without errors', () => {
      inspector.elements = [];
      const svg = inspector.renderToSvg();
      assert(svg.includes('</svg>'));
      assert(svg.includes('viewBox='));
    });
  });

  // ========== HTML Export Tests ==========

  describe('HTML Export', () => {
    it('should generate valid HTML structure', () => {
      inspector.elements = [{ id: 'r1', type: 'rect', x: 10, y: 10, width: 50, height: 50 }];
      const html = inspector.exportToHtml('Test Map');

      assert(html.includes('<!DOCTYPE html>'));
      assert(html.includes('<html'));
      assert(html.includes('Test Map'));
      assert(html.includes('<svg'));
      assert(html.includes('<script>'));
    });

    it('should include zoom functionality in HTML', () => {
      const html = inspector.exportToHtml();
      assert(html.includes('function zoomIn()'));
      assert(html.includes('function zoomOut()'));
      assert(html.includes('function resetZoom()'));
    });

    it('should include pan functionality in HTML', () => {
      const html = inspector.exportToHtml();
      assert(html.includes('isPanning'));
      assert(html.includes('mousemove'));
      assert(html.includes('mousedown'));
    });

    it('should embed current zoom level in HTML', () => {
      inspector.zoom(0.5);
      const html = inspector.exportToHtml();
      assert(html.includes('let zoom = 1.5'));
    });

    it('should embed canvas dimensions in HTML', () => {
      inspector.width = 1024;
      inspector.height = 768;
      const html = inspector.exportToHtml();
      assert(html.includes('width="1024"'));
      assert(html.includes('height="768"'));
    });

    it('should sanitize title for use in download filename', () => {
      const html = inspector.exportToHtml('Test Map / With ::: Special Chars');
      assert(html.includes('test-map---with---special-chars'));
    });
  });

  // ========== Map Analysis Tests ==========

  describe('Map Analysis', () => {
    it('should analyze empty map', () => {
      inspector.elements = [];
      const analysis = inspector.analyzeMap();

      assert.strictEqual(analysis.elementCount, 0);
      assert.strictEqual(analysis.layers.length, 1); // 'default' layer
      assert.strictEqual(analysis.colorPalette.length, 0);
    });

    it('should count elements correctly', () => {
      inspector.elements = [
        { type: 'rect' },
        { type: 'circle' },
        { type: 'text' },
        { type: 'rect' },
      ];

      const analysis = inspector.analyzeMap();
      assert.strictEqual(analysis.elementCount, 4);
    });

    it('should extract color palette', () => {
      inspector.elements = [
        { type: 'rect', fill: '#ff0000', stroke: '#000000' },
        { type: 'circle', fill: '#00ff00' },
        { type: 'rect', fill: '#ff0000' }, // duplicate
      ];

      const analysis = inspector.analyzeMap();
      assert.strictEqual(analysis.colorPalette.length, 3);
      assert(analysis.colorPalette.includes('#ff0000'));
      assert(analysis.colorPalette.includes('#00ff00'));
      assert(analysis.colorPalette.includes('#000000'));
    });

    it('should organize elements by layer', () => {
      inspector.elements = [
        { type: 'rect', layer: 'background' },
        { type: 'circle', layer: 'background' },
        { type: 'text', layer: 'labels' },
        { type: 'rect' }, // no layer, goes to 'default'
      ];

      const analysis = inspector.analyzeMap();
      const layers = new Map(analysis.layers.map(l => [l.name, l]));

      assert.strictEqual(layers.get('background').count, 2);
      assert.strictEqual(layers.get('labels').count, 1);
      assert.strictEqual(layers.get('default').count, 1);
    });

    it('should track element types per layer', () => {
      inspector.elements = [
        { type: 'rect', layer: 'shapes' },
        { type: 'circle', layer: 'shapes' },
        { type: 'rect', layer: 'shapes' },
      ];

      const analysis = inspector.analyzeMap();
      const shapesLayer = analysis.layers.find(l => l.name === 'shapes');

      assert(shapesLayer.types.includes('rect'));
      assert(shapesLayer.types.includes('circle'));
    });

    it('should include metadata in analysis', () => {
      inspector.metadata = { author: 'test', version: '1.0' };
      const analysis = inspector.analyzeMap();

      assert.strictEqual(analysis.metadata.author, 'test');
      assert.strictEqual(analysis.metadata.version, '1.0');
    });
  });

  // ========== Validation Tests ==========

  describe('Map Validation', () => {
    it('should validate correct map', () => {
      inspector.elements = [{ type: 'rect', x: 10, y: 10, width: 50, height: 50 }];
      const result = inspector.validate();

      assert.strictEqual(result.valid, true);
      assert.strictEqual(result.errors.length, 0);
    });

    it('should error on missing dimensions', () => {
      inspector.width = null;
      inspector.height = null;
      const result = inspector.validate();

      assert.strictEqual(result.valid, false);
      assert(result.errors.some(e => e.includes('dimensions')));
    });

    it('should error on non-array elements', () => {
      inspector.elements = { elem: 1 };
      const result = inspector.validate();

      assert.strictEqual(result.valid, false);
      assert(result.errors.some(e => e.includes('array')));
    });

    it('should warn on element without type', () => {
      inspector.elements = [{ x: 10, y: 10 }];
      const result = inspector.validate();

      assert(result.warnings.some(w => w.includes('missing type')));
    });

    it('should error on incomplete rect', () => {
      inspector.elements = [{ type: 'rect', x: 10, y: 10 }]; // missing width/height
      const result = inspector.validate();

      assert(result.errors.some(e => e.includes('rect')));
    });

    it('should error on incomplete circle', () => {
      inspector.elements = [{ type: 'circle', cx: 100, cy: 100 }]; // missing r
      const result = inspector.validate();

      assert(result.errors.some(e => e.includes('circle')));
    });
  });

  // ========== Integration Tests ==========

  describe('Integration Tests', () => {
    it('should handle complete workflow: load -> analyze -> render', () => {
      const jsonContent = JSON.stringify({
        width: 800,
        height: 600,
        elements: [
          { id: 'r1', type: 'rect', x: 10, y: 10, width: 50, height: 50, layer: 'shapes' },
          { id: 'c1', type: 'circle', cx: 100, cy: 100, r: 20, layer: 'shapes' },
        ],
        metadata: { title: 'Test' },
      });

      const loadResult = inspector.loadMap('test.json', jsonContent);
      assert.strictEqual(loadResult.success, true);

      const analysis = inspector.analyzeMap();
      assert.strictEqual(analysis.elementCount, 2);
      assert.strictEqual(analysis.layers.length, 1);

      const svg = inspector.renderToSvg();
      assert(svg.includes('<rect'));
      assert(svg.includes('<circle'));

      const validation = inspector.validate();
      assert.strictEqual(validation.valid, true);
    });

    it('should handle pan, zoom, and selection in sequence', () => {
      inspector.elements = [
        { id: 'r1', type: 'rect', x: 10, y: 10, width: 50, height: 50 },
      ];

      inspector.pan(100, 50);
      assert.strictEqual(inspector.panX, 100);

      inspector.zoom(0.5);
      assert.strictEqual(inspector.zoom, 1.5);

      const clickResult = inspector.handleElementClick('r1');
      assert.strictEqual(clickResult.success, true);
      assert.strictEqual(inspector.selectedElement.id, 'r1');

      const reset = inspector.resetView();
      assert.strictEqual(reset.panX, 0);
      assert.strictEqual(reset.panY, 0);
      assert.strictEqual(reset.zoom, 1);
      assert.strictEqual(inspector.selectedElement, null);
    });

    it('should handle export workflow: render -> export to HTML', () => {
      inspector.elements = [
        { id: 'r1', type: 'rect', x: 10, y: 10, width: 50, height: 50, fill: '#ff0000' },
      ];

      inspector.zoom(0.5);
      inspector.pan(25, 25);

      const html = inspector.exportToHtml('Test Export');
      assert(html.includes('let zoom = 1.5'));
      assert(html.includes('panX = 25'));
      assert(html.includes('panY = 25'));
      assert(html.includes('Test Export'));
    });
  });
});

// Run tests if executed directly
if (require.main === module) {
  console.log('Running SVG Map Inspector Tests...\n');
  const test = require('node:test');
  // Basic test runner for demonstration
  console.log('Tests must be run with a test framework (jest, mocha, or node:test)');
  process.exit(0);
}

module.exports = SVGMapInspector;
