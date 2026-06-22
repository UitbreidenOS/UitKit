# SVG Map Inspector — Interactive Tutorial

Hands-on guide to opening, navigating, and analyzing architectural maps from prophet.js using the SVG Map Inspector. Learn pan, zoom, click workflows; embed in dashboards; link to source code; customize for your analysis.

---

## Getting Started

### Prerequisites

You need:
- An SVG file from a code analysis tool (prophet.js, oracle.js, custom)
- A modern browser (Chrome 90+, Firefox 88+, Safari 14+)
- Optionally, a web server for serving files locally

### What You'll Build

By the end of this tutorial, you'll have:
1. A working SVG Map Inspector embedded in an HTML file
2. The ability to pan, zoom, and click-select nodes
3. A sidebar showing metadata and connections for each node
4. Links to source code for drill-down navigation
5. Customization patterns for your codebase

---

## Part 1: Opening SVG Maps from prophet.js

### Step 1.1: Generate a Map with prophet.js

First, generate an architectural map from your codebase:

```bash
# Install prophet.js globally or run via npx
npx @claudient/prophet --output architecture.svg --format svg

# Or with options for filtering
npx @claudient/prophet \
  --output architecture.svg \
  --format svg \
  --max-depth 3 \
  --exclude node_modules,dist,build
```

**Output:** An SVG file at `architecture.svg` containing:
- Nodes representing modules, components, or services
- Edges representing dependencies
- Metadata attributes (file paths, sizes, dependency counts)

### Step 1.2: Inspect the SVG Structure

Open the generated SVG in a text editor to understand its structure:

```bash
cat architecture.svg | head -50
```

Look for:
- `<circle>` or `<rect>` elements with `data-node-id` attributes (nodes)
- `<line>` or `<path>` elements with `data-edge-from` and `data-edge-to` attributes (edges)
- `<text>` elements with node labels

**Example SVG node:**
```xml
<circle 
  cx="400" cy="300" r="25"
  class="node-circle" 
  data-node-id="auth-core"
  data-node-label="auth-core"
  data-node-type="module"
  data-file-path="src/auth/core.ts"
  data-size="2400"
  data-dependencies="8"
/>
```

### Step 1.3: Load the SVG into the Inspector

Save this as `svg-map-inspector.html` and open it in your browser:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SVG Map Inspector</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0f0f1e;
      color: #e4e4e7;
    }
    
    .container {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    
    .map-viewport {
      flex: 1;
      position: relative;
      background: #1a1a2e;
      border-right: 1px solid #3f3f46;
      overflow: hidden;
      user-select: none;
    }
    
    .map-viewport svg {
      width: 100%;
      height: 100%;
      cursor: grab;
    }
    
    .map-viewport svg:active {
      cursor: grabbing;
    }
    
    svg [data-node] {
      cursor: pointer;
      transition: filter 150ms ease;
    }
    
    svg [data-node]:hover {
      filter: brightness(1.2);
    }
    
    svg [data-node].selected {
      filter: drop-shadow(0 0 8px #3b82f6);
      stroke: #3b82f6;
      stroke-width: 2;
    }
    
    svg [data-edge].highlighted {
      stroke: #10b981;
      stroke-width: 2;
    }
    
    .sidebar {
      width: 320px;
      background: #18181b;
      border-left: 1px solid #3f3f46;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      padding: 16px;
    }
    
    .sidebar-header {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      color: #a1a1aa;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #3f3f46;
    }
    
    .metadata-panel {
      display: none;
    }
    
    .metadata-panel.active {
      display: block;
    }
    
    .node-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #fff;
    }
    
    .node-type {
      display: inline-block;
      font-size: 11px;
      text-transform: uppercase;
      padding: 4px 8px;
      background: #3f3f46;
      border-radius: 3px;
      margin-bottom: 8px;
      color: #a1a1aa;
    }
    
    .node-meta {
      font-size: 13px;
      line-height: 1.6;
    }
    
    .meta-key {
      color: #a1a1aa;
      font-weight: 500;
    }
    
    .meta-value {
      color: #e4e4e7;
      word-break: break-word;
      margin-bottom: 4px;
    }
    
    .toolbar {
      padding: 12px 16px;
      background: #18181b;
      border-bottom: 1px solid #3f3f46;
      display: flex;
      gap: 8px;
      align-items: center;
    }
    
    .toolbar-button {
      padding: 8px 12px;
      background: #27272a;
      border: 1px solid #3f3f46;
      color: #e4e4e7;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 500;
      transition: all 150ms ease;
    }
    
    .toolbar-button:hover {
      background: #3f3f46;
    }
    
    .toolbar-button.active {
      background: #3b82f6;
      border-color: #3b82f6;
    }
    
    .zoom-display {
      margin-left: auto;
      font-size: 12px;
      color: #a1a1aa;
    }
    
    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #71717a;
      text-align: center;
    }
    
    .file-input {
      margin-bottom: 12px;
    }
    
    .file-input input {
      display: none;
    }
    
    .file-input label {
      display: block;
      padding: 8px 12px;
      background: #27272a;
      border: 1px solid #3b82f6;
      color: #3b82f6;
      border-radius: 4px;
      cursor: pointer;
      text-align: center;
      font-size: 12px;
      font-weight: 500;
    }
    
    .file-input label:hover {
      background: #3f3f46;
    }
    
    .connections {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #3f3f46;
    }
    
    .connections-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      color: #a1a1aa;
      margin-bottom: 8px;
    }
    
    .connection-item {
      font-size: 12px;
      padding: 6px 8px;
      background: #27272a;
      border-left: 2px solid #10b981;
      margin-bottom: 6px;
      cursor: pointer;
      transition: background 150ms ease;
    }
    
    .connection-item:hover {
      background: #3f3f46;
    }
    
    .source-link {
      display: inline-block;
      margin-top: 12px;
      padding: 6px 10px;
      background: #3b82f6;
      color: white;
      border-radius: 3px;
      font-size: 11px;
      text-decoration: none;
      transition: background 150ms ease;
    }
    
    .source-link:hover {
      background: #2563eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="map-viewport">
      <div class="toolbar">
        <div class="file-input">
          <label for="svgFile">Load SVG</label>
          <input type="file" id="svgFile" accept=".svg" />
        </div>
        <button class="toolbar-button" id="fitViewBtn" title="Fit to view">Fit View</button>
        <button class="toolbar-button" id="resetBtn" title="Reset pan/zoom">Reset</button>
        <button class="toolbar-button" id="downloadBtn" title="Download as SVG">Download</button>
        <div class="zoom-display" id="zoomDisplay">100%</div>
      </div>
      <svg id="mapSvg" data-content=""></svg>
      <div class="empty-state" id="emptyState">
        <div>
          Load an SVG map to inspect.<br>
          <small>Drag to pan • Scroll to zoom • Click to select</small>
        </div>
      </div>
    </div>
    
    <div class="sidebar">
      <div class="sidebar-header">Inspector</div>
      <div class="metadata-panel" id="metadataPanel"></div>
      <div id="emptyInspector" style="color: #71717a; font-size: 13px;">
        Select a node to view details.
      </div>
    </div>
  </div>

  <script>
    class SVGMapInspector {
      constructor() {
        this.state = {
          viewMode: 'overview',
          selectedNode: null,
          panOffset: { x: 0, y: 0 },
          zoomLevel: 1,
          isPanning: false,
          panStart: { x: 0, y: 0 },
          filters: {}
        };
        
        this.svg = document.getElementById('mapSvg');
        this.viewport = document.querySelector('.map-viewport');
        this.metadataPanel = document.getElementById('metadataPanel');
        this.emptyInspector = document.getElementById('emptyInspector');
        this.zoomDisplay = document.getElementById('zoomDisplay');
        this.svgFile = document.getElementById('svgFile');
        
        this.setupEventHandlers();
      }
      
      setupEventHandlers() {
        // File input
        this.svgFile.addEventListener('change', e => this.handleFileSelect(e));
        
        // Pan handlers
        this.viewport.addEventListener('mousedown', e => this.startPan(e));
        this.viewport.addEventListener('mousemove', e => this.doPan(e));
        this.viewport.addEventListener('mouseup', () => this.endPan());
        this.viewport.addEventListener('mouseleave', () => this.endPan());
        
        // Zoom handler
        this.viewport.addEventListener('wheel', e => this.handleZoom(e), { passive: false });
        
        // Node click handlers
        this.svg.addEventListener('click', e => this.handleNodeClick(e));
        
        // Toolbar handlers
        document.getElementById('fitViewBtn').addEventListener('click', () => this.fitToView());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadSVG());
      }
      
      handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = event => {
            this.loadSVG(event.target.result);
          };
          reader.readAsText(file);
        }
      }
      
      startPan(e) {
        if (e.button !== 0) return;
        this.state.panStart = { x: e.clientX, y: e.clientY };
        this.state.isPanning = true;
        e.preventDefault();
      }
      
      doPan(e) {
        if (!this.state.isPanning) return;
        const dx = e.clientX - this.state.panStart.x;
        const dy = e.clientY - this.state.panStart.y;
        this.state.panOffset.x += dx;
        this.state.panOffset.y += dy;
        this.state.panStart = { x: e.clientX, y: e.clientY };
        this.applyTransform();
      }
      
      endPan() {
        this.state.isPanning = false;
      }
      
      handleZoom(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const oldZoom = this.state.zoomLevel;
        this.state.zoomLevel *= delta;
        this.state.zoomLevel = Math.max(0.1, Math.min(5, this.state.zoomLevel));
        
        const rect = this.viewport.getBoundingClientRect();
        const centerX = (e.clientX - rect.left - this.state.panOffset.x) / oldZoom;
        const centerY = (e.clientY - rect.top - this.state.panOffset.y) / oldZoom;
        
        const zoomDiff = this.state.zoomLevel - oldZoom;
        this.state.panOffset.x -= centerX * zoomDiff;
        this.state.panOffset.y -= centerY * zoomDiff;
        
        this.applyTransform();
      }
      
      applyTransform() {
        const g = this.svg.querySelector('g[data-content]');
        if (g) {
          g.setAttribute('transform',
            `translate(${this.state.panOffset.x},${this.state.panOffset.y}) scale(${this.state.zoomLevel})`
          );
        }
        this.zoomDisplay.textContent = Math.round(this.state.zoomLevel * 100) + '%';
      }
      
      handleNodeClick(e) {
        const node = e.target.closest('[data-node-id]');
        if (node) {
          e.stopPropagation();
          const nodeId = node.getAttribute('data-node-id');
          this.selectNode(nodeId, node.dataset);
        }
      }
      
      selectNode(nodeId, data) {
        document.querySelectorAll('[data-node].selected').forEach(el => {
          el.classList.remove('selected');
        });
        
        const node = document.querySelector(`[data-node-id="${nodeId}"]`);
        if (node) {
          node.classList.add('selected');
          this.state.selectedNode = nodeId;
          this.updateMetadataPanel(nodeId, data);
          this.highlightConnections(nodeId);
        }
      }
      
      updateMetadataPanel(nodeId, data) {
        this.emptyInspector.style.display = 'none';
        this.metadataPanel.classList.add('active');
        
        const filePath = data.filePath || data.filePath;
        const sourceLink = filePath ? `<a href="vscode://file${filePath}" class="source-link">Open in Editor</a>` : '';
        
        const html = `
          <div class="node-info">
            <div class="node-title">${data.nodeLabel || nodeId}</div>
            <span class="node-type">${data.nodeType || 'unknown'}</span>
            <div class="node-meta">
              ${Object.entries(data)
                .filter(([k]) => !k.startsWith('node'))
                .map(([k, v]) => `
                  <div class="meta-value">
                    <span class="meta-key">${k}:</span> ${v}
                  </div>
                `)
                .join('')}
            </div>
            ${sourceLink}
          </div>
        `;
        
        this.metadataPanel.innerHTML = html;
      }
      
      highlightConnections(nodeId) {
        document.querySelectorAll('[data-edge].highlighted').forEach(el => {
          el.classList.remove('highlighted');
        });
        document.querySelectorAll(
          `[data-edge-from="${nodeId}"], [data-edge-to="${nodeId}"]`
        ).forEach(edge => edge.classList.add('highlighted'));
      }
      
      fitToView() {
        const g = this.svg.querySelector('g[data-content]');
        if (!g) return;
        
        const bbox = g.getBBox();
        const vpWidth = this.viewport.clientWidth;
        const vpHeight = this.viewport.clientHeight;
        
        const scaleX = vpWidth / (bbox.width || 1);
        const scaleY = vpHeight / (bbox.height || 1);
        this.state.zoomLevel = Math.min(scaleX, scaleY) * 0.95;
        
        this.state.panOffset.x = -bbox.x * this.state.zoomLevel + (vpWidth - bbox.width * this.state.zoomLevel) / 2;
        this.state.panOffset.y = -bbox.y * this.state.zoomLevel + (vpHeight - bbox.height * this.state.zoomLevel) / 2;
        
        this.applyTransform();
      }
      
      reset() {
        this.state.panOffset = { x: 0, y: 0 };
        this.state.zoomLevel = 1;
        this.state.selectedNode = null;
        document.querySelectorAll('[data-node].selected').forEach(el => {
          el.classList.remove('selected');
        });
        document.querySelectorAll('[data-edge].highlighted').forEach(el => {
          el.classList.remove('highlighted');
        });
        this.emptyInspector.style.display = 'block';
        this.metadataPanel.classList.remove('active');
        this.metadataPanel.innerHTML = '';
        this.applyTransform();
      }
      
      downloadSVG() {
        const svg = this.svg.cloneNode(true);
        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `map-${new Date().getTime()}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      
      loadSVG(svgContent) {
        this.svg.innerHTML = '';
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgContent, 'image/svg+xml');
        const root = doc.documentElement;
        
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('data-content', '');
        
        Array.from(root.childNodes).forEach(node => {
          g.appendChild(node.cloneNode(true));
        });
        
        this.svg.appendChild(g);
        
        if (!this.svg.hasAttribute('viewBox')) {
          this.svg.setAttribute('viewBox', '0 0 1000 800');
        }
        
        document.getElementById('emptyState').style.display = 'none';
        this.fitToView();
      }
    }
    
    const inspector = new SVGMapInspector();
  </script>
</body>
</html>
```

To use it:
1. Save as `svg-map-inspector.html`
2. Open in browser
3. Click "Load SVG" and select your SVG file from prophet.js
4. The map loads with full pan/zoom/click interactivity

---

## Part 2: Interactive Features — Pan, Zoom, Click

### Feature 2.1: Panning

**How to pan:**
- Click and drag anywhere on the map with your left mouse button
- The map moves smoothly while you drag
- Release to stop panning

**Keyboard hint:** The cursor changes to a grab icon (🖐️) to indicate you can pan.

**Use cases:**
- Navigate large maps that don't fit in the viewport
- Center specific regions of interest
- Explore fine details without zooming

**Example:** With a 47-module architecture map, drag from top-left to bottom-right to explore the entire structure smoothly.

### Feature 2.2: Zooming

**How to zoom:**
- Scroll your mouse wheel to zoom in (up) or out (down)
- Zoom is centered at the mouse cursor position
- Zoom level ranges from 10% (far out) to 500% (far in)

**Zoom controls:**
- "Fit View" button: Automatically zoom to fit the entire map
- "Reset" button: Zoom back to 100% and reset all pan/zoom

**Use cases:**
- Zoom in to see small details (filenames, dependency counts)
- Zoom out to see high-level clusters and patterns
- Zoom to 500% for detailed node-by-node analysis

**Example:** Zoom to 250% to inspect individual modules within an auth subsystem cluster.

### Feature 2.3: Clicking & Selection

**How to select:**
- Click on any node (circle or box) in the map
- The selected node highlights with a blue border and drop-shadow
- The sidebar updates to show metadata for the selected node
- Connected edges highlight in green

**Selection effects:**
- **Visual feedback:** Selected node glows with #3b82f6 (blue)
- **Metadata panel:** Shows node details in the right sidebar
- **Connection highlighting:** Incoming and outgoing edges appear in green
- **State persistence:** Selection remains until you click another node or "Reset"

**Use cases:**
- Examine a specific module's properties (file path, size, dependency count)
- Understand what depends on a module (incoming edges)
- Explore what a module depends on (outgoing edges)
- Identify high-coupling or critical nodes

**Example:** Click the "auth-core" node to see:
- File path: `src/auth/core.ts`
- Type: `module`
- Size: `2,400 bytes`
- Dependencies: `8`
- Highlighted edges showing all modules that import from or export to `auth-core`

---

## Part 3: Embedding in Dashboards

### Step 3.1: Embed as an iframe

To embed the SVG Map Inspector in a larger dashboard:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Architecture Dashboard</title>
  <style>
    .dashboard {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      padding: 20px;
      background: #0f0f1e;
      height: 100vh;
    }
    
    .card {
      background: #18181b;
      border: 1px solid #3f3f46;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    .card-header {
      padding: 16px;
      border-bottom: 1px solid #3f3f46;
      font-weight: 600;
      color: #fff;
    }
    
    .card-content {
      flex: 1;
      overflow: hidden;
    }
    
    .map-inspector {
      width: 100%;
      height: 100%;
      border: none;
    }
    
    .stats {
      padding: 16px;
      color: #a1a1aa;
    }
    
    .stat-item {
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
    }
    
    .stat-label {
      font-size: 13px;
    }
    
    .stat-value {
      font-weight: 600;
      color: #3b82f6;
    }
  </style>
</head>
<body>
  <div class="dashboard">
    <div class="card">
      <div class="card-header">Architecture Map</div>
      <div class="card-content">
        <iframe 
          class="map-inspector"
          src="svg-map-inspector.html"
          sandbox="allow-scripts allow-same-origin">
        </iframe>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header">Architecture Stats</div>
      <div class="card-content">
        <div class="stats">
          <div class="stat-item">
            <span class="stat-label">Total Modules</span>
            <span class="stat-value" id="totalModules">47</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Total Dependencies</span>
            <span class="stat-value" id="totalDeps">126</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Circular Dependencies</span>
            <span class="stat-value" id="circularDeps">3</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Avg Module Size</span>
            <span class="stat-value" id="avgSize">3.2 KB</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Largest Module</span>
            <span class="stat-value" id="largestModule">api-handler (12 KB)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
```

### Step 3.2: Communication Between Inspector and Dashboard

To sync state between the inspector iframe and the dashboard:

```javascript
// In the dashboard (parent page)
const inspectorIframe = document.querySelector('.map-inspector');

// Listen for node selection events from the inspector
window.addEventListener('message', event => {
  if (event.data.type === 'NODE_SELECTED') {
    const nodeData = event.data.payload;
    console.log('Node selected:', nodeData);
    
    // Update stats or highlight related elements
    updateDashboardForNode(nodeData);
  }
});

function updateDashboardForNode(nodeData) {
  document.getElementById('selectedNode').textContent = nodeData.nodeLabel;
  document.getElementById('selectedNodePath').textContent = nodeData.filePath;
  document.getElementById('selectedNodeDeps').textContent = nodeData.dependencies;
}

// In the inspector (svg-map-inspector.html)
selectNode(nodeId, data) {
  // ... existing selection logic ...
  
  // Notify parent page of selection
  if (window.parent !== window) {
    window.parent.postMessage({
      type: 'NODE_SELECTED',
      payload: data
    }, '*');
  }
}
```

---

## Part 4: Linking to Source Code

### Step 4.1: Enable VS Code Deep Links

To make nodes clickable links to the actual source code, use `vscode://` protocol URLs:

```javascript
// In the metadata panel update function
updateMetadataPanel(nodeId, data) {
  const filePath = data.filePath;
  const line = data.lineNumber || 1;
  
  // Create VS Code deep link
  const vsCodeLink = filePath 
    ? `vscode://file/${filePath}:${line}`
    : null;
  
  const html = `
    <div class="node-info">
      <div class="node-title">${data.nodeLabel || nodeId}</div>
      <span class="node-type">${data.nodeType}</span>
      ${vsCodeLink ? `
        <a href="${vsCodeLink}" class="source-link">
          Open in VS Code
        </a>
      ` : ''}
    </div>
  `;
  
  this.metadataPanel.innerHTML = html;
}
```

**How it works:**
- Click "Open in Editor" to jump directly to the source file
- Works with VS Code (must have the File Explorer extension)
- Fails silently in browsers without VS Code

### Step 4.2: Link to GitHub

For web-based code viewing, generate GitHub links:

```javascript
const GITHUB_REPO = 'https://github.com/myorg/myrepo';
const GITHUB_BRANCH = 'main';

function generateGitHubLink(filePath, lineNumber = 1) {
  // Normalize file path to be relative from repo root
  const normalizedPath = filePath.replace(/^\.\//, '');
  return `${GITHUB_REPO}/blob/${GITHUB_BRANCH}/${normalizedPath}#L${lineNumber}`;
}

updateMetadataPanel(nodeId, data) {
  const filePath = data.filePath;
  const line = data.lineNumber || 1;
  
  const githubLink = filePath
    ? generateGitHubLink(filePath, line)
    : null;
  
  const html = `
    <div class="node-info">
      <div class="node-title">${data.nodeLabel}</div>
      <span class="node-type">${data.nodeType}</span>
      ${githubLink ? `
        <a href="${githubLink}" target="_blank" class="source-link">
          View on GitHub
        </a>
      ` : ''}
    </div>
  `;
  
  this.metadataPanel.innerHTML = html;
}
```

### Step 4.3: Context-Aware Navigation

Enhance navigation with multiple code view options:

```javascript
updateMetadataPanel(nodeId, data) {
  const filePath = data.filePath;
  const line = data.lineNumber || 1;
  
  const links = [];
  
  // VS Code
  if (filePath) {
    links.push(`
      <a href="vscode://file/${filePath}:${line}" class="source-link">
        VS Code
      </a>
    `);
  }
  
  // GitHub
  if (filePath) {
    const githubUrl = generateGitHubLink(filePath, line);
    links.push(`
      <a href="${githubUrl}" target="_blank" class="source-link">
        GitHub
      </a>
    `);
  }
  
  // Local server (if available)
  if (filePath) {
    links.push(`
      <a href="http://localhost:3000/source?file=${encodeURIComponent(filePath)}&line=${line}" 
         target="_blank" class="source-link">
        Local
      </a>
    `);
  }
  
  const html = `
    <div class="node-info">
      <div class="node-title">${data.nodeLabel}</div>
      <span class="node-type">${data.nodeType}</span>
      <div style="margin-top: 12px; display: flex; gap: 8px;">
        ${links.join('')}
      </div>
    </div>
  `;
  
  this.metadataPanel.innerHTML = html;
}
```

---

## Part 5: Advanced Customization

### Step 5.1: Custom Node Styling

Style nodes based on metadata (size, type, coupling):

```javascript
// Add this to the HTML <style> section
const dynamicStyles = `
  svg [data-node-type="module"] { fill: #3b82f6; }
  svg [data-node-type="component"] { fill: #10b981; }
  svg [data-node-type="service"] { fill: #f59e0b; }
  svg [data-node-type="util"] { fill: #8b5cf6; }
  
  /* Size-based opacity */
  svg [data-size="small"] { opacity: 0.7; }
  svg [data-size="large"] { filter: drop-shadow(0 0 3px rgba(59, 130, 246, 0.5)); }
  
  /* Dependency count based styling */
  svg [data-dependencies="0"] { opacity: 0.5; } /* Unused modules */
  svg [data-dependencies^="1"][data-dependencies$="0"],
  svg [data-dependencies^="1"][data-dependencies$="1"],
  svg [data-dependencies^="1"][data-dependencies$="2"],
  svg [data-dependencies^="1"][data-dependencies$="3"],
  svg [data-dependencies^="1"][data-dependencies$="4"],
  svg [data-dependencies^="1"][data-dependencies$="5"],
  svg [data-dependencies^="1"][data-dependencies$="6"],
  svg [data-dependencies^="1"][data-dependencies$="7"],
  svg [data-dependencies^="1"][data-dependencies$="8"],
  svg [data-dependencies^="1"][data-dependencies$="9"] { 
    filter: drop-shadow(0 0 6px rgba(249, 115, 22, 0.7)); 
  }
`;

document.querySelector('style').textContent += dynamicStyles;
```

### Step 5.2: Custom Filters

Add interactive filters to hide/show node categories:

```javascript
setupFilters() {
  const filterContainer = document.querySelector('.toolbar');
  
  const filterHTML = `
    <div style="display: flex; gap: 6px; margin-left: 12px; border-left: 1px solid #3f3f46; padding-left: 12px;">
      <label style="display: flex; align-items: center; gap: 4px; font-size: 12px; color: #a1a1aa; cursor: pointer;">
        <input type="checkbox" id="filterModules" checked /> Modules
      </label>
      <label style="display: flex; align-items: center; gap: 4px; font-size: 12px; color: #a1a1aa; cursor: pointer;">
        <input type="checkbox" id="filterComponents" checked /> Components
      </label>
      <label style="display: flex; align-items: center; gap: 4px; font-size: 12px; color: #a1a1aa; cursor: pointer;">
        <input type="checkbox" id="filterServices" checked /> Services
      </label>
    </div>
  `;
  
  filterContainer.insertAdjacentHTML('beforeend', filterHTML);
  
  document.getElementById('filterModules').addEventListener('change', e => {
    this.toggleNodeType('module', e.target.checked);
  });
  document.getElementById('filterComponents').addEventListener('change', e => {
    this.toggleNodeType('component', e.target.checked);
  });
  document.getElementById('filterServices').addEventListener('change', e => {
    this.toggleNodeType('service', e.target.checked);
  });
}

toggleNodeType(type, visible) {
  document.querySelectorAll(`[data-node-type="${type}"]`).forEach(node => {
    node.style.display = visible ? 'block' : 'none';
  });
  
  // Hide edges connected to hidden nodes
  this.updateEdgeVisibility();
}

updateEdgeVisibility() {
  document.querySelectorAll('[data-edge-from], [data-edge-to]').forEach(edge => {
    const fromNode = document.querySelector(`[data-node-id="${edge.dataset.edgeFrom}"]`);
    const toNode = document.querySelector(`[data-node-id="${edge.dataset.edgeTo}"]`);
    
    const visible = (fromNode?.style.display !== 'none') && 
                    (toNode?.style.display !== 'none');
    edge.style.display = visible ? 'block' : 'none';
  });
}
```

### Step 5.3: Search & Highlight

Add a search feature to find nodes by name:

```javascript
setupSearch() {
  const searchHTML = `
    <div style="flex: 1; margin: 0 12px;">
      <input 
        type="text" 
        id="searchInput" 
        placeholder="Search nodes..." 
        style="width: 100%; padding: 6px 10px; background: #27272a; border: 1px solid #3f3f46; color: #e4e4e7; border-radius: 4px; font-size: 12px;"
      />
    </div>
  `;
  
  const toolbar = document.querySelector('.toolbar');
  const zoomDisplay = toolbar.querySelector('.zoom-display');
  zoomDisplay.insertAdjacentHTML('beforebegin', searchHTML);
  
  document.getElementById('searchInput').addEventListener('input', e => {
    this.searchNodes(e.target.value);
  });
}

searchNodes(query) {
  const lowerQuery = query.toLowerCase();
  
  document.querySelectorAll('[data-node-id]').forEach(node => {
    const label = node.dataset.nodeLabel.toLowerCase();
    const path = (node.dataset.filePath || '').toLowerCase();
    
    const matches = label.includes(lowerQuery) || path.includes(lowerQuery);
    node.style.opacity = matches ? '1' : '0.2';
    
    if (matches) {
      node.classList.add('search-match');
    } else {
      node.classList.remove('search-match');
    }
  });
}
```

---

## Part 6: Practical Workflow Example

**Scenario:** Analyze a 61-feature showcase app with circular dependencies.

### Workflow Steps

1. **Generate the map**
   ```bash
   npx @claudient/prophet showcase/ --output showcase-map.svg --include-circular
   ```

2. **Load into inspector**
   - Open `svg-map-inspector.html`
   - Upload `showcase-map.svg`
   - Click "Fit View" to see all 61 features

3. **Identify clusters**
   - Zoom out to 50% to see high-level clusters
   - Note the auth, api, and ui subsystems

4. **Find circular deps**
   - Search for "circular" or filter to show only problem nodes
   - Zoom in on red-highlighted edges
   - Click each node to understand the cycle

5. **Drill into auth subsystem**
   - Zoom to 200%
   - Click auth-core node
   - Inspect its metadata and connections

6. **Link to source**
   - Click "Open in VS Code" to jump to the implementation
   - Make fixes based on your findings

7. **Export for docs**
   - Zoom and pan to the focused region
   - Click "Download" to save an export
   - Embed in architecture documentation

---

## Troubleshooting

**SVG doesn't load:**
- Check that the SVG has proper xmlns attribute: `<svg xmlns="http://www.w3.org/2000/svg">`
- Verify that nodes have `data-node-id` attributes
- Open browser console (F12) for parse errors

**Pan is too slow or jittery:**
- Reduce the number of visible nodes with filters
- Simplify SVG by removing unused metadata attributes
- Check browser performance in DevTools (Performance tab)

**Zoom jumps unexpectedly:**
- Ensure the viewport is fully visible (no hidden overflow)
- Check that SVG viewBox is set correctly

**Links to VS Code don't work:**
- Ensure VS Code is running
- Use absolute file paths, not relative
- Check that the file exists

---

## Next Steps

- **Customize colors** to match your brand by editing the CSS `:root` variables
- **Add more node types** by extending the `data-node-type` dataset and styling rules
- **Export reports** by taking screenshots or saving SVG exports
- **Automate generation** by integrating prophet.js into your CI/CD pipeline
- **Share dashboards** by hosting the inspector on an internal server

