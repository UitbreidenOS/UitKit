---
name: svg-map-inspector
description: "SVG Interactive Map Inspector: Inspizieren, navigieren und analysieren Sie architektonische Karten, Abhängigkeitsgraphen und Codebasis-Kartographie mit Pan/Zoom/Click-Workflows"
updated: 2026-06-22
category: enterprise-intel
---

# SVG Interactive Map Inspector

## Aktivierungsbedingungen
- Visualisierung von Codebasis-Kartographie (Komponentenhierarchien, Modulstruktur, Datei-Abhängigkeitsbäume)
- Inspektion architektonischer Diagramme, die von Analyse-Tools generiert werden (prophet.js, oracle.js)
- Erstellung interaktiver Abhängigkeitsgraphen, bei denen Benutzer in Knoten hineinzoomen müssen
- Erstellung von Enterprise-Level-Architektur-Dashboards, die Pan/Zoom/Click-Inspektionsmuster erfordern
- Analyse von System-Topologie-Karten, Service-Mesh-Diagrammen oder Microservice-Beziehungen
- Einbettung von SVG-Ausgaben aus Code-Analysen in interne Dashboards oder Dokumentations-Portale

## Nicht zu verwenden für
- Einfache textbasierte Dokumentation oder statische Baumvisualisierungen – verwenden Sie Markdown oder ASCII-Bäume
- Echtzeit-Streaming-Daten, die WebGL-Leistung erfordern – verwenden Sie Babylon.js oder Three.js
- Raster-Bildinspektion (PNG/JPG) – verwenden Sie Canvas-basierte Tools
- Nicht-SVG-Visualisierungen (D3-Kraft-Graphen mit 1000+ Knoten) – verwenden Sie `/d3-data-visualization`
- Designsystem-Erkundung – verwenden Sie `/design-system-extraction` oder Figma MCP

## Anleitung

### 1. SVG-Karten-Inspektions-Workflow

SVG-Karten von Code-Analyse-Tools (prophet.js, oracle.js) erfordern einen strukturierten Inspektionsansatz:

```typescript
// Kerninspektor für SVG-Karten
interface SVGMapNode {
  id: string;
  label: string;
  type: 'module' | 'component' | 'service' | 'file';
  metadata: Record<string, any>;
  children?: SVGMapNode[];
  edges?: Array<{ target: string; label?: string }>;
}

interface SVGInspectionContext {
  mapName: string;
  viewMode: 'overview' | 'focused' | 'details';
  selectedNode?: string;
  panOffset: { x: number; y: number };
  zoomLevel: number;
  filters?: Record<string, boolean>;
}
```

### 2. Pan/Zoom/Click-Muster

**Pan-Muster:** Mausbewegung verfolgen, um SVG-Viewport zu verschieben, ohne Text zu wählen

```javascript
const SVGPanHandler = {
  startPan: (e, state) => {
    state.panStart = { x: e.clientX, y: e.clientY };
    state.isPanning = true;
    e.preventDefault();
  },
  
  doPan: (e, state) => {
    if (!state.isPanning) return;
    const dx = e.clientX - state.panStart.x;
    const dy = e.clientY - state.panStart.y;
    state.panOffset.x += dx;
    state.panOffset.y += dy;
    state.panStart = { x: e.clientX, y: e.clientY };
    applyTransform(state);
  },
  
  endPan: (state) => {
    state.isPanning = false;
  },
  
  applyTransform: (state) => {
    const svg = document.querySelector('svg');
    const g = svg.querySelector('g[data-content]');
    g.setAttribute('transform', 
      `translate(${state.panOffset.x},${state.panOffset.y}) scale(${state.zoomLevel})`
    );
  }
};
```

**Zoom-Muster:** Mausrad oder Pinch-Gesten verwenden; Zoom-Mittelpunkt bewahren

```javascript
const SVGZoomHandler = {
  zoom: (e, state, centerX, centerY) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const oldZoom = state.zoomLevel;
    state.zoomLevel *= delta;
    state.zoomLevel = Math.max(0.1, Math.min(5, state.zoomLevel));
    
    // Pan anpassen, um den Zoom an der Mausposition zentriert zu halten
    const zoomDiff = state.zoomLevel - oldZoom;
    state.panOffset.x -= centerX * zoomDiff;
    state.panOffset.y -= centerY * zoomDiff;
    
    applyTransform(state);
  },
  
  fitToView: (state, bounds) => {
    const svg = document.querySelector('svg');
    const width = svg.clientWidth;
    const height = svg.clientHeight;
    
    const scaleX = width / (bounds.width || 1);
    const scaleY = height / (bounds.height || 1);
    state.zoomLevel = Math.min(scaleX, scaleY) * 0.95;
    
    state.panOffset.x = -bounds.x * state.zoomLevel + (width - bounds.width * state.zoomLevel) / 2;
    state.panOffset.y = -bounds.y * state.zoomLevel + (height - bounds.height * state.zoomLevel) / 2;
    
    applyTransform(state);
  }
};
```

**Click/Selections-Muster:** Knoten hervorheben und Metadaten in Seitenpanel anzeigen

```javascript
const SVGClickHandler = {
  selectNode: (nodeId, state, data) => {
    // Vorherige Auswahl löschen
    document.querySelectorAll('[data-node].selected').forEach(el => {
      el.classList.remove('selected');
    });
    
    // Neuen Knoten auswählen
    const node = document.querySelector(`[data-node-id="${nodeId}"]`);
    if (node) {
      node.classList.add('selected');
      node.classList.add('pulse'); // Visuelles Feedback
      
      state.selectedNode = nodeId;
      updateMetadataPanel(nodeId, data);
      highlightConnections(nodeId, data);
    }
  },
  
  highlightConnections: (nodeId, data) => {
    // Kanten hervorheben, die mit diesem Knoten verbunden sind
    document.querySelectorAll(`[data-edge-from="${nodeId}"], [data-edge-to="${nodeId}"]`)
      .forEach(edge => edge.classList.add('highlighted'));
  },
  
  drillDown: (nodeId, data) => {
    // Zum Knoten zoomen und seine Kinder anzeigen
    const nodeBounds = document.querySelector(`[data-node-id="${nodeId}"]`)?.getBBox();
    if (nodeBounds) {
      SVGZoomHandler.fitToView(state, nodeBounds);
      state.viewMode = 'focused';
    }
  }
};
```

### 3. SVG in Dashboard einbetten

**HTML-Dashboard-Vorlage für lokale Inspektion:**

```html
<!DOCTYPE html>
<html lang="de">
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
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
      stroke-width: 2;
      stroke: #3b82f6;
    }
    
    svg [data-node].pulse {
      animation: nodePulse 0.6s ease;
    }
    
    @keyframes nodePulse {
      0%, 100% { filter: drop-shadow(0 0 0px transparent); }
      50% { filter: drop-shadow(0 0 12px #3b82f6); }
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
      letter-spacing: 0.5px;
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
    
    .node-info {
      margin-bottom: 20px;
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
      letter-spacing: 0.5px;
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
      border-color: #52525b;
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
    
    .empty-state-text {
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="map-viewport">
      <div class="toolbar">
        <button class="toolbar-button" id="fitViewBtn" title="An Ansicht anpassen">Ansicht anpassen</button>
        <button class="toolbar-button" id="resetBtn" title="Pan/Zoom zurücksetzen">Zurücksetzen</button>
        <button class="toolbar-button" id="downloadBtn" title="Als SVG herunterladen">Herunterladen</button>
        <div class="zoom-display" id="zoomDisplay">100%</div>
      </div>
      <svg id="mapSvg" data-content=""></svg>
      <div class="empty-state" id="emptyState">
        <div class="empty-state-text">
          Laden Sie eine SVG-Karte zum Inspizieren.<br>
          <small>Ziehen zum Verschieben · Scroll zum Zoomen · Klick zum Auswählen</small>
        </div>
      </div>
    </div>
    
    <div class="sidebar">
      <div class="sidebar-header">Inspektor</div>
      <div class="metadata-panel" id="metadataPanel"></div>
      <div id="emptyInspector" style="color: #71717a; font-size: 13px;">
        Wählen Sie einen Knoten aus, um Details anzuzeigen.
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
        
        this.setupEventHandlers();
      }
      
      setupEventHandlers() {
        // Pan-Handler
        this.viewport.addEventListener('mousedown', e => this.startPan(e));
        this.viewport.addEventListener('mousemove', e => this.doPan(e));
        this.viewport.addEventListener('mouseup', () => this.endPan());
        this.viewport.addEventListener('mouseleave', () => this.endPan());
        
        // Zoom-Handler
        this.viewport.addEventListener('wheel', e => this.handleZoom(e), { passive: false });
        
        // Node-Click-Handler (delegiert)
        this.svg.addEventListener('click', e => this.handleNodeClick(e));
        
        // Toolbar-Handler
        document.getElementById('fitViewBtn').addEventListener('click', () => this.fitToView());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadSVG());
      }
      
      startPan(e) {
        if (e.button !== 0) return; // Nur Linksklick
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
          el.classList.remove('selected', 'pulse');
        });
        
        const node = document.querySelector(`[data-node-id="${nodeId}"]`);
        if (node) {
          node.classList.add('selected', 'pulse');
          this.state.selectedNode = nodeId;
          this.updateMetadataPanel(nodeId, data);
          this.highlightConnections(nodeId);
        }
      }
      
      updateMetadataPanel(nodeId, data) {
        this.emptyInspector.style.display = 'none';
        this.metadataPanel.classList.add('active');
        
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
          el.classList.remove('selected', 'pulse');
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
        a.download = 'map.svg';
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
        
        // Inhalt in Gruppe für Transformationskontrolle einwickeln
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('data-content', '');
        
        Array.from(root.childNodes).forEach(node => {
          g.appendChild(node.cloneNode(true));
        });
        
        this.svg.appendChild(g);
        
        // ViewBox setzen, falls nicht vorhanden
        if (!this.svg.hasAttribute('viewBox')) {
          this.svg.setAttribute('viewBox', '0 0 1000 800');
        }
        
        document.getElementById('emptyState').style.display = 'none';
        this.fitToView();
      }
    }
    
    // Inspektor initialisieren
    const inspector = new SVGMapInspector();
    
    // Beispiel: SVG aus Datei oder Daten laden
    window.loadMapFromFile = async (file) => {
      const text = await file.text();
      inspector.loadSVG(text);
    };
    
    window.loadMapFromData = (svgData) => {
      inspector.loadSVG(svgData);
    };
  </script>
</body>
</html>
```

### 4. SVG-Karten aus Code-Analyse generieren

**Integration mit prophet.js/oracle.js-Ausgabe:**

```typescript
// Ausgabe von Code-Analyse-Tool extrahieren und strukturieren
interface AnalysisOutput {
  nodes: Array<{
    id: string;
    name: string;
    type: 'module' | 'component' | 'service';
    filePath: string;
    size: number;
    dependencies: number;
  }>;
  edges: Array<{
    from: string;
    to: string;
    type: 'imports' | 'depends-on' | 'exports';
    weight: number;
  }>;
}

// SVG aus Analysedaten generieren
function generateMapSVG(analysis: AnalysisOutput): string {
  const width = 1200;
  const height = 800;
  const padding = 40;
  
  // Einfache kraftgesteuerte Layout-Simulation (oder d3.forceSimulation verwenden)
  const nodes = analysis.nodes.map((n, i) => ({
    ...n,
    x: Math.random() * (width - 2 * padding) + padding,
    y: Math.random() * (height - 2 * padding) + padding,
    radius: Math.sqrt(n.size) / 10
  }));
  
  let svg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<defs><style>
    .edge { stroke: #52525b; stroke-width: 1; }
    .node-circle { fill: #3b82f6; }
    .node-label { font-size: 11px; fill: #e4e4e7; }
  </style></defs>`;
  
  // Kanten zeichnen
  analysis.edges.forEach(edge => {
    const from = nodes.find(n => n.id === edge.from);
    const to = nodes.find(n => n.id === edge.to);
    if (from && to) {
      svg += `<line class="edge" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" 
              data-edge-from="${edge.from}" data-edge-to="${edge.to}" />`;
    }
  });
  
  // Knoten zeichnen
  nodes.forEach(node => {
    svg += `<circle class="node-circle" cx="${node.x}" cy="${node.y}" r="${node.radius}"
            data-node data-node-id="${node.id}" data-node-label="${node.name}" 
            data-node-type="${node.type}" data-file-path="${node.filePath}" 
            data-size="${node.size}" data-dependencies="${node.dependencies}" />`;
    
    svg += `<text class="node-label" x="${node.x}" y="${node.y + node.radius + 12}" 
            text-anchor="middle">${node.name}</text>`;
  });
  
  svg += '</svg>';
  return svg;
}
```

### 5. Best Practices für Inspektions-Workflow

**Schritt 1: Karte laden**
- SVG von prophet.js/oracle.js-Ausgabe akzeptieren oder rohes SVG einfügen
- Stellen Sie sicher, dass alle Knoten `data-node-id` und relevante Metadaten-Attribute haben
- Überprüfen Sie, dass Kanten mit `data-edge-from` und `data-edge-to` gekennzeichnet sind

**Schritt 2: Initiale Erkundung**
- "Ansicht anpassen" verwenden, um die gesamte Karte auf einmal zu sehen
- Cluster und Ausreißer visuell identifizieren
- Feststellen, welche Knoten die meisten Verbindungen haben

**Schritt 3: Hineinzoomen-Untersuchung**
- Auf Knoten klicken, um detaillierte Metadaten in der Seitenleiste anzuzeigen
- Verbindungen werden grün hervorgehoben, um die Auswirkungen zu zeigen
- Mit Zoom auf bestimmte Regionen konzentrieren

**Schritt 4: Analyse und Export**
- Screenshots für Dokumentation erstellen
- Ausgewählte Regionen als neue SVG-Dateien exportieren
- Erkenntnisse im Dashboard annotieren

### 6. Referenz: Figma MCP für Design-Assets

Für architektonische Diagramme, die ursprünglich in Figma entworfen wurden, siehe **Figma MCP** zum:
- Extrahieren von Komponenten-Spezifikationen und Abmessungen
- Programmgesteuert SVG-Assets exportieren
- Design-zu-Implementierungs-Konsistenz beibehalten
- Siehe: `/mcp/figma` für Konfiguration

---

## Beispiel

**Szenario:** Sie haben eine Codebasis-Kartographie-SVG, die von oracle.js generiert wurde und 47 Module mit 126 Abhängigkeiten zeigt. Sie müssen:
1. Die gesamte Architektur visualisieren
2. Zirkuläre Abhängigkeiten identifizieren
3. Module mit hoher Kopplung finden
4. Eine fokussierte Ansicht des Auth-Subsystems für die Dokumentation exportieren

**Workflow:**

1. **SVG-Karte laden**
   ```javascript
   const mapData = await fetch('/output/architecture-map.svg').then(r => r.text());
   inspector.loadSVG(mapData);
   ```

2. **Auf hoher Ebene erkunden**
   - "Ansicht anpassen" klicken, um alle 47 Module zu sehen
   - 3 Cluster visuell identifizieren: auth, api, persistence

3. **In Auth-Cluster hineinzoomen**
   - Auf den "auth-core"-Knoten klicken
   - Seitenleiste zeigt: 8 Dateien, 12 eingehende Abhängigkeiten, 4 ausgehende
   - Hervorgehobene Verbindungen zeigen, was von auth abhängt

4. **Zirkuläre Abhängigkeit erkennen**
   - "auth-guards" klicken → 2 Kanten sind rot (bidirektional)
   - Seitenleiste kennzeichnet: "auth-guards ↔ auth-core" als potenzielles Problem

5. **Auth-Subsystem-Ansicht exportieren**
   - In Auth-Cluster zoomen (Rad oder Shift-Drag)
   - Rechtsklick "Herunterladen", um fokussierte SVG zu speichern
   - In Architektur-Dokumentation einbinden

**Erwartete Ausgabe:** Interaktives Dashboard mit:
- Pan/Zoom-responsiver Karte mit 60-FPS-Leistung
- Clickable Knoten mit vollständigen Metadaten in der Seitenleiste
- Verbindungs-Hervorhebung in Grün/Rot für Import-/zirkuläre Muster
- Export-Funktion für statische Dokumentation

---
