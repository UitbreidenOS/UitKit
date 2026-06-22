---
name: svg-map-inspector
description: "Inspecteur de Carte SVG Interactive : inspectez, naviguez et analysez des cartes architecturales, des graphes de dépendances et des cartographies de bases de code avec des flux de travail pan/zoom/click"
updated: 2026-06-22
category: enterprise-intel
---

# Inspecteur de Carte SVG Interactive

## Quand l'activer
- Visualiser des cartographies de bases de code (hiérarchies de composants, structure de modules, arbres de dépendances de fichiers)
- Inspecter des diagrammes architecturaux générés par des outils d'analyse (prophet.js, oracle.js)
- Créer des graphes de dépendances interactifs où les utilisateurs doivent creuser dans les nœuds
- Créer des tableaux de bord d'architecture au niveau entreprise nécessitant des motifs d'inspection pan/zoom/click
- Analyser des cartes de topologie système, des diagrammes de maille de services ou des relations de microservices
- Intégrer les sorties SVG de l'analyse de code dans des tableaux de bord internes ou des portails de documentation

## Quand NE PAS l'utiliser
- Documentation simple basée sur du texte ou visualisations d'arbres statiques — utilisez markdown ou arbres ASCII
- Données de streaming en temps réel nécessitant des performances WebGL — utilisez Babylon.js ou Three.js
- Inspection d'images raster (PNG/JPG) — utilisez des outils basés sur canvas
- Visualisations non-SVG (graphes de force D3 avec 1000+ nœuds) — utilisez `/d3-data-visualization`
- Exploration de systèmes de conception — utilisez `/design-system-extraction` ou Figma MCP

## Instructions

### 1. Flux de travail d'inspection de carte SVG

Les cartes SVG provenant d'outils d'analyse de code (prophet.js, oracle.js) nécessitent une approche d'inspection structurée :

```typescript
// Gestionnaire d'inspection principal pour les cartes SVG
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

### 2. Motifs Pan/Zoom/Click

**Motif de panoramique :** Suivre le glissement de la souris pour décaler la fenêtre d'affichage SVG sans sélectionner le texte

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

**Motif de zoom :** Utiliser la molette de la souris ou les gestes de pincement ; préserver le centre du zoom

```javascript
const SVGZoomHandler = {
  zoom: (e, state, centerX, centerY) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const oldZoom = state.zoomLevel;
    state.zoomLevel *= delta;
    state.zoomLevel = Math.max(0.1, Math.min(5, state.zoomLevel));
    
    // Ajuster le panoramique pour garder le zoom centré à la position de la souris
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

**Motif Click/Sélection :** Mettre en évidence les nœuds et afficher les métadonnées dans le panneau latéral

```javascript
const SVGClickHandler = {
  selectNode: (nodeId, state, data) => {
    // Effacer la sélection précédente
    document.querySelectorAll('[data-node].selected').forEach(el => {
      el.classList.remove('selected');
    });
    
    // Sélectionner le nouveau nœud
    const node = document.querySelector(`[data-node-id="${nodeId}"]`);
    if (node) {
      node.classList.add('selected');
      node.classList.add('pulse'); // Rétroaction visuelle
      
      state.selectedNode = nodeId;
      updateMetadataPanel(nodeId, data);
      highlightConnections(nodeId, data);
    }
  },
  
  highlightConnections: (nodeId, data) => {
    // Mettre en évidence les arêtes connectées à ce nœud
    document.querySelectorAll(`[data-edge-from="${nodeId}"], [data-edge-to="${nodeId}"]`)
      .forEach(edge => edge.classList.add('highlighted'));
  },
  
  drillDown: (nodeId, data) => {
    // Zoomer sur le nœud et afficher ses enfants
    const nodeBounds = document.querySelector(`[data-node-id="${nodeId}"]`)?.getBBox();
    if (nodeBounds) {
      SVGZoomHandler.fitToView(state, nodeBounds);
      state.viewMode = 'focused';
    }
  }
};
```

### 3. Intégration de SVG dans le tableau de bord

**Modèle de tableau de bord HTML pour inspection locale :**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inspecteur de Carte SVG</title>
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
        <button class="toolbar-button" id="fitViewBtn" title="Adapter à la vue">Adapter la vue</button>
        <button class="toolbar-button" id="resetBtn" title="Réinitialiser pan/zoom">Réinitialiser</button>
        <button class="toolbar-button" id="downloadBtn" title="Télécharger en SVG">Télécharger</button>
        <div class="zoom-display" id="zoomDisplay">100%</div>
      </div>
      <svg id="mapSvg" data-content=""></svg>
      <div class="empty-state" id="emptyState">
        <div class="empty-state-text">
          Chargez une carte SVG à inspecter.<br>
          <small>Faites glisser pour panoramique · Défilez pour zoomer · Cliquez pour sélectionner</small>
        </div>
      </div>
    </div>
    
    <div class="sidebar">
      <div class="sidebar-header">Inspecteur</div>
      <div class="metadata-panel" id="metadataPanel"></div>
      <div id="emptyInspector" style="color: #71717a; font-size: 13px;">
        Sélectionnez un nœud pour voir les détails.
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
        // Gestionnaires de panoramique
        this.viewport.addEventListener('mousedown', e => this.startPan(e));
        this.viewport.addEventListener('mousemove', e => this.doPan(e));
        this.viewport.addEventListener('mouseup', () => this.endPan());
        this.viewport.addEventListener('mouseleave', () => this.endPan());
        
        // Gestionnaire de zoom
        this.viewport.addEventListener('wheel', e => this.handleZoom(e), { passive: false });
        
        // Gestionnaires de clic de nœud (délégués)
        this.svg.addEventListener('click', e => this.handleNodeClick(e));
        
        // Gestionnaires de barre d'outils
        document.getElementById('fitViewBtn').addEventListener('click', () => this.fitToView());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadSVG());
      }
      
      startPan(e) {
        if (e.button !== 0) return; // Clic gauche uniquement
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
        
        // Envelopper le contenu dans un groupe pour contrôler la transformation
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('data-content', '');
        
        Array.from(root.childNodes).forEach(node => {
          g.appendChild(node.cloneNode(true));
        });
        
        this.svg.appendChild(g);
        
        // Définir viewBox s'il n'est pas présent
        if (!this.svg.hasAttribute('viewBox')) {
          this.svg.setAttribute('viewBox', '0 0 1000 800');
        }
        
        document.getElementById('emptyState').style.display = 'none';
        this.fitToView();
      }
    }
    
    // Initialiser l'inspecteur
    const inspector = new SVGMapInspector();
    
    // Exemple : Charger SVG à partir d'un fichier ou de données
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

### 4. Génération de cartes SVG à partir de l'analyse de code

**Intégration avec la sortie de prophet.js/oracle.js :**

```typescript
// Extraire et structurer la sortie de l'outil d'analyse de code
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

// Générer SVG à partir des données d'analyse
function generateMapSVG(analysis: AnalysisOutput): string {
  const width = 1200;
  const height = 800;
  const padding = 40;
  
  // Simulation de disposition dirigée par la force simple (ou utiliser d3.forceSimulation)
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
  
  // Dessiner les arêtes
  analysis.edges.forEach(edge => {
    const from = nodes.find(n => n.id === edge.from);
    const to = nodes.find(n => n.id === edge.to);
    if (from && to) {
      svg += `<line class="edge" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" 
              data-edge-from="${edge.from}" data-edge-to="${edge.to}" />`;
    }
  });
  
  // Dessiner les nœuds
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

### 5. Meilleures pratiques du flux de travail d'inspection

**Étape 1 : Charger la carte**
- Accepter SVG à partir de la sortie de prophet.js/oracle.js ou coller SVG brut
- S'assurer que tous les nœuds ont l'attribut `data-node-id` et les attributs de métadonnées pertinents
- Vérifier que les arêtes sont étiquetées avec `data-edge-from` et `data-edge-to`

**Étape 2 : Exploration initiale**
- Utiliser "Adapter la vue" pour voir la carte entière à la fois
- Identifier visuellement les clusters et les valeurs aberrantes
- Noter les nœuds qui ont le plus de connexions

**Étape 3 : Investigation approfondie**
- Cliquer sur les nœuds pour voir les métadonnées détaillées dans la barre latérale
- Les connexions se mettent en évidence en vert pour montrer l'impact
- Utiliser le zoom pour se concentrer sur des régions spécifiques

**Étape 4 : Analyse et export**
- Prendre des captures d'écran pour la documentation
- Exporter les régions sélectionnées en tant que nouveaux fichiers SVG
- Annoter les conclusions dans le tableau de bord

### 6. Référence : MCP Figma pour les ressources de conception

Pour les diagrammes architecturaux conçus à l'origine dans Figma, consultez le **MCP Figma** pour :
- Extraire les spécifications et dimensions des composants
- Exporter les ressources SVG par programmation
- Maintenir la cohérence de la conception à l'implémentation
- Voir : `/mcp/figma` pour la configuration

---

## Exemple

**Scénario :** Vous avez une cartographie de bases de code SVG générée par oracle.js montrant 47 modules avec 126 dépendances. Vous devez :
1. Visualiser l'architecture entière
2. Identifier les dépendances circulaires
3. Trouver les modules à couplage élevé
4. Exporter une vue focalisée du sous-système d'authentification pour la documentation

**Flux de travail :**

1. **Charger la carte SVG**
   ```javascript
   const mapData = await fetch('/output/architecture-map.svg').then(r => r.text());
   inspector.loadSVG(mapData);
   ```

2. **Explorer au niveau supérieur**
   - Cliquer sur "Adapter la vue" pour voir les 47 modules
   - Identifier visuellement 3 clusters : auth, api, persistence

3. **Creuser dans le cluster auth**
   - Cliquer sur le nœud "auth-core"
   - La barre latérale affiche : 8 fichiers, 12 dépendances entrantes, 4 sortantes
   - Les connexions mises en évidence montrent ce qui dépend de auth

4. **Détecter une dépendance circulaire**
   - Cliquer sur "auth-guards" → 2 arêtes sont rouges (bi-directionnelles)
   - La barre latérale signale : "auth-guards ↔ auth-core" comme problème potentiel

5. **Exporter la vue du sous-système auth**
   - Zoomer sur le cluster auth (molette ou shift-drag)
   - Cliquer avec le bouton droit "Télécharger" pour enregistrer le SVG focalisé
   - Inclure dans la documentation architecturale

**Sortie attendue :** Tableau de bord interactif affichant :
- Carte pan/zoom réactive avec performances de 60 FPS
- Nœuds sélectionnables au clic avec métadonnées complètes dans la barre latérale
- Mise en évidence des connexions en vert/rouge pour les motifs d'importation/circulaires
- Capacité d'export pour la documentation statique

---
