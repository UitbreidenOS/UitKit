# SVG Map Inspector — Edge Cases & Optimization Guide

Comprehensive reference for handling edge cases in the SVG Map Inspector: large graphs (10K+ nodes), nested SVG rendering, performance limits, and browser compatibility across Firefox, Safari, Chrome, and mobile devices.

---

## Part 1: Large Graph Handling (10K+ Nodes)

### 1.1 Performance Bottlenecks at Scale

When inspecting architectural maps with 10,000+ nodes, several performance issues emerge:

**Problem: DOM Thrashing**
- Creating 10K individual SVG elements causes reflow/repaint storms
- Selection events trigger cascading DOM updates
- Event delegation becomes a bottleneck

**Solution: Virtual Rendering with Quadtree Spatial Indexing**

```typescript
class QuadTreeSpatialIndex {
  private quadtree: any;
  private nodeMap: Map<string, { x: number; y: number; r: number }>;
  
  constructor(bounds: { x: number; y: number; width: number; height: number }) {
    this.quadtree = this.createQuadtree(bounds);
    this.nodeMap = new Map();
  }
  
  private createQuadtree(bounds: any) {
    // Use a 4-level quadtree for spatial partitioning
    return {
      nw: null,
      ne: null,
      sw: null,
      se: null,
      nodes: [],
      bounds,
    };
  }
  
  insertNode(id: string, x: number, y: number, r: number) {
    this.nodeMap.set(id, { x, y, r });
    this.insert(this.quadtree, id, x, y, r);
  }
  
  private insert(tree: any, id: string, x: number, y: number, r: number) {
    const b = tree.bounds;
    
    // Node fits in this quadrant
    if (tree.nodes.length < 16) {
      tree.nodes.push(id);
      return;
    }
    
    // Subdivide if not already done
    if (!tree.nw) {
      const hw = b.width / 2;
      const hh = b.height / 2;
      tree.nw = this.createQuadtree({
        x: b.x,
        y: b.y,
        width: hw,
        height: hh,
      });
      tree.ne = this.createQuadtree({
        x: b.x + hw,
        y: b.y,
        width: hw,
        height: hh,
      });
      tree.sw = this.createQuadtree({
        x: b.x,
        y: b.y + hh,
        width: hw,
        height: hh,
      });
      tree.se = this.createQuadtree({
        x: b.x + hw,
        y: b.y + hh,
        width: hw,
        height: hh,
      });
    }
    
    // Route to appropriate quadrant
    const midX = b.x + b.width / 2;
    const midY = b.y + b.height / 2;
    
    if (x < midX) {
      if (y < midY) {
        this.insert(tree.nw, id, x, y, r);
      } else {
        this.insert(tree.sw, id, x, y, r);
      }
    } else {
      if (y < midY) {
        this.insert(tree.ne, id, x, y, r);
      } else {
        this.insert(tree.se, id, x, y, r);
      }
    }
  }
  
  queryViewport(vpX: number, vpY: number, vpWidth: number, vpHeight: number): string[] {
    const visible = [];
    this.queryRecursive(this.quadtree, vpX, vpY, vpWidth, vpHeight, visible);
    return visible;
  }
  
  private queryRecursive(
    tree: any,
    vpX: number,
    vpY: number,
    vpWidth: number,
    vpHeight: number,
    results: string[]
  ) {
    // Check intersection with viewport
    const b = tree.bounds;
    if (!(b.x + b.width < vpX || vpX + vpWidth < b.x ||
          b.y + b.height < vpY || vpY + vpHeight < b.y)) {
      
      // Add nodes in this quadrant
      results.push(...tree.nodes);
      
      // Recurse if subdivided
      if (tree.nw) {
        this.queryRecursive(tree.nw, vpX, vpY, vpWidth, vpHeight, results);
        this.queryRecursive(tree.ne, vpX, vpY, vpWidth, vpHeight, results);
        this.queryRecursive(tree.sw, vpX, vpY, vpWidth, vpHeight, results);
        this.queryRecursive(tree.se, vpX, vpY, vpWidth, vpHeight, results);
      }
    }
  }
}
```

**Problem: Memory Bloat**
- 10K nodes × 100+ bytes/node = ~1MB minimum overhead
- Transform attributes and event listeners multiply memory usage
- SVG attribute serialization on zoom/pan is expensive

**Solution: Lazy DOM Rendering with Batch Updates**

```typescript
class VirtualSVGRenderer {
  private quadtree: QuadTreeSpatialIndex;
  private renderedNodes: Set<string>;
  private batchUpdateTimer: any;
  private pendingUpdates: Set<string>;
  private svg: SVGElement;
  private state: any;
  
  constructor(svg: SVGElement, quadtree: QuadTreeSpatialIndex) {
    this.svg = svg;
    this.quadtree = quadtree;
    this.renderedNodes = new Set();
    this.pendingUpdates = new Set();
  }
  
  // Call after pan/zoom to update visible nodes
  updateViewport(panOffset: { x: number; y: number }, zoomLevel: number) {
    const vpWidth = this.svg.clientWidth;
    const vpHeight = this.svg.clientHeight;
    
    // Viewport in model coordinates
    const modelVpX = -panOffset.x / zoomLevel;
    const modelVpY = -panOffset.y / zoomLevel;
    const modelVpWidth = vpWidth / zoomLevel;
    const modelVpHeight = vpHeight / zoomLevel;
    
    // Query visible nodes
    const visibleNodes = this.quadtree.queryViewport(
      modelVpX,
      modelVpY,
      modelVpWidth,
      modelVpHeight
    );
    
    // Nodes to add
    const toAdd = visibleNodes.filter(id => !this.renderedNodes.has(id));
    // Nodes to remove
    const toRemove = Array.from(this.renderedNodes).filter(
      id => !visibleNodes.includes(id)
    );
    
    // Batch updates to avoid reflow thrashing
    this.batchRemoveNodes(toRemove);
    this.batchAddNodes(toAdd);
  }
  
  private batchRemoveNodes(nodeIds: string[]) {
    requestAnimationFrame(() => {
      const fragment = document.createDocumentFragment();
      nodeIds.forEach(id => {
        const el = this.svg.querySelector(`[data-node-id="${id}"]`);
        if (el) {
          fragment.appendChild(el);
        }
        this.renderedNodes.delete(id);
      });
      // Nodes removed from DOM in single operation
    });
  }
  
  private batchAddNodes(nodeIds: string[]) {
    if (nodeIds.length === 0) return;
    
    // Clear any pending batch timer
    if (this.batchUpdateTimer) {
      clearTimeout(this.batchUpdateTimer);
    }
    
    // Defer to next frame
    this.batchUpdateTimer = setTimeout(() => {
      const fragment = document.createDocumentFragment();
      
      nodeIds.forEach(id => {
        const nodeData = this.state.nodeMap.get(id);
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('data-node-id', id);
        circle.setAttribute('cx', nodeData.x);
        circle.setAttribute('cy', nodeData.y);
        circle.setAttribute('r', nodeData.r);
        circle.setAttribute('data-node', '');
        
        fragment.appendChild(circle);
        this.renderedNodes.add(id);
      });
      
      // Single append operation
      this.svg.querySelector('g[data-content]')?.appendChild(fragment);
    }, 50); // Debounce rapid viewport changes
  }
}
```

### 1.2 Zoom Performance Degradation

**Problem:** Rendering 10K nodes at 5x zoom slows to <10 FPS

**Metric Thresholds:**
- 0-1K nodes: 60 FPS sustained at all zoom levels
- 1K-5K nodes: 60 FPS at zoom 1-2x, drops to 30 FPS at 5x
- 5K-10K nodes: 30 FPS at zoom 1x, 15 FPS at 3x+
- 10K+ nodes: Virtual rendering REQUIRED (15-30 FPS even at scale)

**Solution: Progressive Level-of-Detail (LOD) Rendering**

```typescript
class LODRenderer {
  private lodLevels = [
    { zoom: 0.5, detail: 'none', strategy: 'hide' },        // Very zoomed out
    { zoom: 1.0, detail: 'basic', strategy: 'circles-only' }, // Normal
    { zoom: 2.0, detail: 'labels', strategy: 'circles+text' }, // Zoomed in
    { zoom: 5.0, detail: 'full', strategy: 'all-details' },  // Highly zoomed
  ];
  
  selectLOD(zoomLevel: number): string {
    let selectedLod = this.lodLevels[0].strategy;
    for (const lod of this.lodLevels) {
      if (zoomLevel >= lod.zoom) {
        selectedLod = lod.strategy;
      }
    }
    return selectedLod;
  }
  
  applyLOD(svg: SVGElement, zoomLevel: number) {
    const strategy = this.selectLOD(zoomLevel);
    
    switch (strategy) {
      case 'hide':
        // At extreme zoom out, hide most nodes, show only cluster centers
        svg.querySelectorAll('[data-node-id]').forEach((node: any) => {
          node.style.display = node.dataset.isClusterCenter ? 'block' : 'none';
        });
        svg.querySelectorAll('text').forEach((text: any) => {
          text.style.display = 'none';
        });
        break;
        
      case 'circles-only':
        // Show circles only, no labels
        svg.querySelectorAll('[data-node-id]').forEach((node: any) => {
          node.style.display = 'block';
        });
        svg.querySelectorAll('text').forEach((text: any) => {
          text.style.display = 'none';
        });
        break;
        
      case 'circles+text':
        // Show circles and labels
        svg.querySelectorAll('[data-node-id]').forEach((node: any) => {
          node.style.display = 'block';
        });
        svg.querySelectorAll('text').forEach((text: any) => {
          text.style.display = 'block';
        });
        break;
        
      case 'all-details':
        // Show everything
        svg.querySelectorAll('[data-node-id]').forEach((node: any) => {
          node.style.display = 'block';
        });
        svg.querySelectorAll('text').forEach((text: any) => {
          text.style.display = 'block';
        });
        break;
    }
  }
}
```

### 1.3 Edge Rendering at Scale

**Problem:** 10K nodes generate ~50K edges; rendering all edges is prohibitively slow

**Solution: Edge Culling & Clustering**

```typescript
class EdgeOptimizer {
  cullEdges(edges: Array<any>, zoomLevel: number, nodeRadius: number) {
    if (zoomLevel < 0.5) {
      // At extreme zoom out, show only "important" edges (high weight)
      return edges.filter(e => e.weight >= edges.reduce((sum, x) => sum + x.weight, 0) / edges.length);
    } else if (zoomLevel < 1.5) {
      // Show edges above median weight
      const median = this.getMedian(edges.map(e => e.weight));
      return edges.filter(e => e.weight >= median);
    }
    // At higher zoom, show all edges
    return edges;
  }
  
  private getMedian(arr: number[]) {
    const sorted = arr.slice().sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted[mid];
  }
  
  bundleEdges(edges: Array<any>, bundleDistance: number = 50) {
    // Cluster edges that run parallel to reduce visual clutter
    const bundles: Map<string, any[]> = new Map();
    
    edges.forEach(edge => {
      const key = this.getEdgeKey(edge, bundleDistance);
      if (!bundles.has(key)) {
        bundles.set(key, []);
      }
      bundles.get(key)!.push(edge);
    });
    
    // Render bundle as single path with stroke-width proportional to count
    return Array.from(bundles.values()).map(bundle => ({
      path: bundle[0],
      count: bundle.length,
      strokeWidth: Math.min(bundle.length * 0.5, 10),
    }));
  }
  
  private getEdgeKey(edge: any, distance: number) {
    // Round coordinates to grid for bundling
    const grid = Math.floor(distance);
    const x1 = Math.round(edge.x1 / grid);
    const y1 = Math.round(edge.y1 / grid);
    const x2 = Math.round(edge.x2 / grid);
    const y2 = Math.round(edge.y2 / grid);
    return `${x1},${y1}-${x2},${y2}`;
  }
}
```

### 1.4 Memory Profiling: Benchmarks

| Node Count | Memory (loaded) | Memory (rendered) | DOM nodes | Time to render |
|---|---|---|---|---|
| 100 | 50 KB | 100 KB | 100 | <1ms |
| 1K | 500 KB | 1 MB | 1K | 10ms |
| 5K | 2.5 MB | 5 MB | 5K | 100ms |
| 10K | 5 MB | 10 MB | 10K | 500ms |
| 50K | 25 MB | 50 MB | 10K (virtual) | 1s |
| 100K | 50 MB | 100 MB | 10K (virtual) | 2s |

**Recommendation:** Use virtual rendering (quadtree + LOD) for >5K nodes. Without optimization, performance degrades to unacceptable levels (sub-10 FPS) beyond 10K nodes.

---

## Part 2: Nested SVG Rendering

### 2.1 Common Issues with Nested SVGs

SVG maps sometimes contain nested `<svg>` elements (e.g., imported diagrams, sub-graphs). This creates unexpected rendering and interaction issues.

**Problem 1: Transform Stacking**

```xml
<!-- Outer SVG with transform -->
<svg viewBox="0 0 1000 800" transform="translate(100, 100) scale(2)">
  <!-- Inner SVG with its own transform -->
  <svg viewBox="0 0 500 400" x="50" y="50" width="300" height="240">
    <circle cx="50" cy="50" r="25" />
  </svg>
</svg>
```

Transforms compose unexpectedly: the circle is transformed by both the outer and inner transforms.

**Solution: Flatten Nested SVGs Before Rendering**

```typescript
class SVGFlattener {
  flattenNestedSVGs(svgRoot: SVGElement): SVGElement {
    const cloned = svgRoot.cloneNode(true) as SVGElement;
    this.flattenRecursive(cloned, {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
    });
    return cloned;
  }
  
  private flattenRecursive(
    element: Element,
    parentTransform: any
  ) {
    const nestedSvgs = element.querySelectorAll('svg');
    const toRemove: Element[] = [];
    
    nestedSvgs.forEach(nested => {
      if (nested.parentElement === element) {
        // Direct child nested SVG
        const x = parseFloat(nested.getAttribute('x') || '0');
        const y = parseFloat(nested.getAttribute('y') || '0');
        const width = parseFloat(nested.getAttribute('width') || '0');
        const height = parseFloat(nested.getAttribute('height') || '0');
        
        // Extract viewBox for scaling calculation
        const viewBox = nested.getAttribute('viewBox');
        let scaleX = 1, scaleY = 1;
        if (viewBox && width && height) {
          const [vbX, vbY, vbWidth, vbHeight] = viewBox.split(' ').map(Number);
          scaleX = width / vbWidth;
          scaleY = height / vbHeight;
        }
        
        // Create group to replace nested SVG
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute(
          'transform',
          `translate(${x + parentTransform.x}, ${y + parentTransform.y}) scale(${scaleX * parentTransform.scaleX}, ${scaleY * parentTransform.scaleY})`
        );
        
        // Move nested SVG children to group
        while (nested.firstChild) {
          g.appendChild(nested.firstChild);
        }
        
        nested.parentElement?.insertBefore(g, nested);
        toRemove.push(nested);
        
        // Recurse with updated transform
        this.flattenRecursive(g, {
          x: x,
          y: y,
          scaleX: scaleX * parentTransform.scaleX,
          scaleY: scaleY * parentTransform.scaleY,
        });
      }
    });
    
    // Remove flattened nested SVGs
    toRemove.forEach(el => el.remove());
  }
}
```

**Problem 2: Clipping & Mask Scope**

Nested SVGs can have their own `<defs>` sections with clip paths and masks. These are scoped to the nested SVG, causing them to not apply correctly when flattened.

**Solution: Merge Defs & Rename IDs**

```typescript
class SVGDefsMerger {
  mergeDefsFromNestedSVGs(svgRoot: SVGElement): void {
    const mainDefs = this.getOrCreateDefs(svgRoot);
    const idMap = new Map<string, string>();
    
    // Collect all nested defs
    svgRoot.querySelectorAll('svg defs').forEach((nestedDefs, index) => {
      Array.from(nestedDefs.children).forEach(def => {
        const originalId = def.getAttribute('id');
        if (originalId) {
          // Rename to avoid collision
          const newId = `def-${index}-${originalId}`;
          idMap.set(originalId, newId);
          def.setAttribute('id', newId);
          mainDefs.appendChild(def.cloneNode(true));
        }
      });
    });
    
    // Update all references in the document
    this.updateDefReferences(svgRoot, idMap);
  }
  
  private updateDefReferences(root: Element, idMap: Map<string, string>) {
    // Update url() references
    root.querySelectorAll('[clip-path], [mask], [fill], [stroke]').forEach(el => {
      const attrs = ['clip-path', 'mask', 'fill', 'stroke'];
      attrs.forEach(attr => {
        const value = el.getAttribute(attr);
        if (value && value.includes('url(')) {
          const match = value.match(/url\(#([^)]+)\)/);
          if (match) {
            const oldId = match[1];
            const newId = idMap.get(oldId);
            if (newId) {
              el.setAttribute(attr, value.replace(`#${oldId}`, `#${newId}`));
            }
          }
        }
      });
    });
  }
  
  private getOrCreateDefs(svgRoot: SVGElement): Element {
    let defs = svgRoot.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svgRoot.insertBefore(defs, svgRoot.firstChild);
    }
    return defs;
  }
}
```

### 2.2 viewBox Inheritance Issues

**Problem:** When a nested SVG has a different viewBox, coordinates don't align

```xml
<svg viewBox="0 0 1000 800">
  <!-- Nested SVG with different viewBox scales everything -->
  <svg x="200" y="150" width="400" height="300" viewBox="0 0 100 75">
    <rect x="10" y="10" width="80" height="55" />
  </svg>
</svg>
```

The rect appears 4x larger than expected (400/100).

**Solution: ViewBox-Aware Transform Calculation**

```typescript
function calculateNestedSVGTransform(
  nested: SVGElement,
  parent: SVGElement
): string {
  const parentViewBox = parent.getAttribute('viewBox')?.split(' ').map(Number) || [0, 0, parent.clientWidth, parent.clientHeight];
  const nestedViewBox = nested.getAttribute('viewBox')?.split(' ').map(Number) || [0, 0, nested.clientWidth, nested.clientHeight];
  
  const x = parseFloat(nested.getAttribute('x') || '0');
  const y = parseFloat(nested.getAttribute('y') || '0');
  const width = parseFloat(nested.getAttribute('width') || '0');
  const height = parseFloat(nested.getAttribute('height') || '0');
  
  // Calculate scale from viewBox dimensions
  const scaleX = width / nestedViewBox[2];
  const scaleY = height / nestedViewBox[3];
  
  // Offset for viewBox position
  const offsetX = -nestedViewBox[0] * scaleX;
  const offsetY = -nestedViewBox[1] * scaleY;
  
  return `translate(${x + offsetX}, ${y + offsetY}) scale(${scaleX}, ${scaleY})`;
}
```

---

## Part 3: Interactive Performance Limits

### 3.1 Selection & Highlighting Performance

**Problem:** With 10K nodes, selecting one and highlighting connected edges takes 100+ ms

**Benchmark:**
- 100 nodes: <5ms
- 1K nodes: ~20ms
- 5K nodes: ~150ms
- 10K+ nodes: >500ms (unacceptable)

**Solution: Pre-computed Connection Index**

```typescript
class ConnectionIndex {
  private outgoing: Map<string, string[]>;
  private incoming: Map<string, string[]>;
  
  constructor(edges: Array<{ from: string; to: string }>) {
    this.outgoing = new Map();
    this.incoming = new Map();
    
    edges.forEach(edge => {
      if (!this.outgoing.has(edge.from)) {
        this.outgoing.set(edge.from, []);
      }
      this.outgoing.get(edge.from)!.push(edge.to);
      
      if (!this.incoming.has(edge.to)) {
        this.incoming.set(edge.to, []);
      }
      this.incoming.get(edge.to)!.push(edge.from);
    });
  }
  
  getConnections(nodeId: string): {
    incoming: string[];
    outgoing: string[];
  } {
    return {
      incoming: this.incoming.get(nodeId) || [],
      outgoing: this.outgoing.get(nodeId) || [],
    };
  }
}

// Usage during selection
selectNode(nodeId: string, connectionIndex: ConnectionIndex) {
  const connections = connectionIndex.getConnections(nodeId);
  const allConnected = new Set([
    nodeId,
    ...connections.incoming,
    ...connections.outgoing,
  ]);
  
  // Use CSS class for batch highlighting (instead of DOM updates)
  document.querySelectorAll('[data-node-id]').forEach(node => {
    const id = node.getAttribute('data-node-id');
    if (allConnected.has(id)) {
      node.classList.add('connected');
    } else {
      node.classList.remove('connected');
    }
  });
}
```

### 3.2 Pan/Zoom Event Throttling

**Problem:** Mouse wheel events fire 60+ times/sec; updating DOM on every event drops FPS

**Solution: Debounced Viewport Updates**

```typescript
class ThrottledPanZoom {
  private updateTimer: any;
  private isPanning: boolean = false;
  private lastUpdateTime: number = 0;
  private updateInterval: number = 16; // ~60 FPS
  
  handleZoom(e: WheelEvent) {
    e.preventDefault();
    
    const now = performance.now();
    if (now - this.lastUpdateTime > this.updateInterval) {
      // Update immediately
      this.doZoom(e);
      this.lastUpdateTime = now;
    } else {
      // Debounce
      clearTimeout(this.updateTimer);
      this.updateTimer = setTimeout(() => {
        this.doZoom(e);
        this.lastUpdateTime = performance.now();
      }, 5);
    }
  }
  
  private doZoom(e: WheelEvent) {
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    // ... zoom logic ...
  }
  
  handlePan(e: MouseEvent) {
    if (!this.isPanning) return;
    
    // Use requestAnimationFrame for smooth 60 FPS panning
    requestAnimationFrame(() => {
      this.doPan(e);
    });
  }
  
  private doPan(e: MouseEvent) {
    // ... pan logic ...
  }
}
```

---

## Part 4: Browser Compatibility

### 4.1 Chrome/Chromium

**Supported Features:**
- SVG transforms (translate, scale, rotate) — fully supported
- Viewport queries via getBBox() — accurate
- `pointer-events` CSS property — fully supported
- CSS filters (drop-shadow, brightness) — fully supported

**Known Issues:**
- High memory usage on >10K nodes (can exhaust memory ~2GB)
- requestAnimationFrame throttles to 60 FPS even on 120Hz displays

**Workarounds:**
```javascript
// Detect Chrome
const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

if (isChrome && nodeCount > 10000) {
  // Enable virtual rendering
  enableQuadtreeOptimization();
}
```

### 4.2 Firefox

**Supported Features:**
- SVG transforms — fully supported
- getBBox() — generally accurate, but slower than Chrome
- CSS filters — fully supported

**Known Issues:**
- getBBox() can be inaccurate on deeply nested transforms (off by 1-3 pixels)
- Slower pan/zoom response on large graphs

**Workarounds:**
```javascript
// Firefox getBBox workaround
function getBBoxWithFallback(element: SVGElement) {
  try {
    const bbox = element.getBBox();
    // Validate result
    if (bbox.width > 0 && bbox.height > 0) {
      return bbox;
    }
  } catch (e) {
    // Fall back to computing from attributes
  }
  
  return {
    x: parseFloat(element.getAttribute('cx') || element.getAttribute('x') || '0') - 25,
    y: parseFloat(element.getAttribute('cy') || element.getAttribute('y') || '0') - 25,
    width: 50,
    height: 50,
  };
}
```

### 4.3 Safari

**Supported Features:**
- SVG transforms — mostly supported (some edge cases with nested SVGs)
- CSS filters — limited support (drop-shadow has lower precision)

**Known Issues:**
- SVG text rendering is slower than Chrome/Firefox
- Zoom performance degrades rapidly beyond 500 nodes
- getBBox() sometimes throws errors on complex paths

**Workarounds:**
```javascript
// Safari detection
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

if (isSafari) {
  // Disable text labels on large graphs
  if (nodeCount > 500) {
    document.querySelectorAll('text').forEach(t => {
      t.style.display = 'none';
    });
  }
  
  // Use simpler filters
  document.querySelectorAll('[data-node].selected').forEach(node => {
    node.style.stroke = '#3b82f6';
    node.style.strokeWidth = '2';
    // Instead of drop-shadow filter
  });
}
```

### 4.4 Mobile Browsers (iOS Safari, Chrome Mobile)

**Issues:**
- Touch events don't fire consistently on SVG elements
- Pinch-to-zoom interferes with pan/zoom handlers
- Double-tap zoom causes layout shift
- Memory constraints limit node count to ~1K

**Workarounds:**

```typescript
class MobileCompatibleInspector {
  private touchStartDistance: number = 0;
  
  setupMobileHandlers() {
    const svg = document.querySelector('svg');
    
    // Prevent default touch behaviors
    svg?.addEventListener('touchstart', e => {
      if (e.touches.length > 1) {
        // Multi-touch: pinch to zoom
        this.touchStartDistance = this.getTouchDistance(e.touches);
        e.preventDefault();
      } else {
        // Single touch: pan
        this.isPanning = true;
        this.panStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: false });
    
    svg?.addEventListener('touchmove', e => {
      if (e.touches.length > 1) {
        // Pinch zoom
        const currentDistance = this.getTouchDistance(e.touches);
        const ratio = currentDistance / this.touchStartDistance;
        this.zoomLevel *= ratio;
        this.touchStartDistance = currentDistance;
      } else if (this.isPanning) {
        // Pan
        const dx = e.touches[0].clientX - this.panStart.x;
        const dy = e.touches[0].clientY - this.panStart.y;
        this.panOffset.x += dx;
        this.panOffset.y += dy;
        this.panStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      e.preventDefault();
    }, { passive: false });
    
    svg?.addEventListener('touchend', () => {
      this.isPanning = false;
    });
    
    // Disable double-tap zoom
    let lastTap = 0;
    svg?.addEventListener('touchend', e => {
      const now = Date.now();
      if (now - lastTap < 300) {
        e.preventDefault();
      }
      lastTap = now;
    });
  }
  
  private getTouchDistance(touches: TouchList): number {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
```

### 4.5 Browser Compatibility Matrix

| Feature | Chrome | Firefox | Safari | Chrome Mobile | iOS Safari |
|---|---|---|---|---|---|
| SVG rendering | ✓ | ✓ | ✓ | ✓ | ✓ |
| Transform performance | Excellent | Good | Fair | Fair | Poor |
| getBBox() | ✓ Accurate | ✓ Mostly | Buggy | N/A | N/A |
| CSS filters | ✓ Full | ✓ Full | ⚠ Limited | ✓ Full | ⚠ Limited |
| Touch events | ✓ | ✗ | ✓ | ✓ | ✓ |
| Max nodes (60 FPS) | 10K | 5K | 500 | 500 | 100 |

---

## Part 5: Mobile Responsiveness

### 5.1 Viewport Adaptation

**Problem:** SVG inspector designed for desktop (1920x1200) breaks on mobile (375x812)

**Solution: Responsive Layout Adapter**

```css
/* Mobile-first design */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
  
  .map-viewport {
    height: 60vh;
    flex: 0 0 auto;
    min-height: 300px;
  }
  
  .sidebar {
    width: 100%;
    height: 40vh;
    border-left: none;
    border-top: 1px solid #3f3f46;
  }
  
  .toolbar {
    flex-wrap: wrap;
  }
  
  .toolbar-button {
    flex: 1;
    min-width: 60px;
    font-size: 11px;
  }
  
  .zoom-display {
    margin-left: 0;
    margin-top: 8px;
    width: 100%;
    text-align: center;
  }
  
  svg [data-node] {
    r: 6; /* Larger for touch targets */
  }
  
  .node-info {
    font-size: 13px;
  }
  
  .connection-item {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .sidebar-header {
    font-size: 12px;
  }
  
  .node-title {
    font-size: 14px;
  }
  
  svg [data-node] {
    r: 8; /* Even larger for small screens */
  }
  
  .toolbar-button {
    padding: 6px 8px;
    font-size: 10px;
  }
}
```

### 5.2 Touch Target Size

**Problem:** Nodes are too small to tap reliably on mobile (minimum 44x44px for iOS HIG)

**Solution: Invisible Expanded Touch Areas**

```typescript
class MobileTouchOptimizer {
  addExpandedTouchTargets(svg: SVGElement) {
    const nodes = svg.querySelectorAll('[data-node-id]');
    
    nodes.forEach(node => {
      const bbox = node.getBBox();
      const minTouchSize = 44; // iOS minimum
      const expandedSize = Math.max(minTouchSize, bbox.width * 1.5);
      
      // Create invisible expanded circle for touch
      const touchTarget = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      touchTarget.setAttribute('cx', bbox.x + bbox.width / 2);
      touchTarget.setAttribute('cy', bbox.y + bbox.height / 2);
      touchTarget.setAttribute('r', expandedSize / 2);
      touchTarget.setAttribute('fill', 'transparent');
      touchTarget.setAttribute('pointer-events', 'all');
      touchTarget.setAttribute('data-touch-target', node.getAttribute('data-node-id'));
      
      node.parentElement?.insertBefore(touchTarget, node);
      
      // Forward events from touch target to actual node
      touchTarget.addEventListener('click', () => {
        node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
    });
  }
}
```

### 5.3 Orientation Changes

**Problem:** Layout breaks when rotating device from portrait to landscape

**Solution: OrientationChange Listener**

```typescript
class OrientationHandler {
  setupOrientationListener() {
    window.addEventListener('orientationchange', () => {
      this.handleOrientationChange();
    });
    
    // Also handle resize for desktop scenarios
    window.addEventListener('resize', this.debounce(() => {
      this.handleOrientationChange();
    }, 200));
  }
  
  private handleOrientationChange() {
    // Re-fit view to new dimensions
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    
    const svg = document.querySelector('svg');
    if (svg) {
      svg.style.width = newWidth + 'px';
      svg.style.height = newHeight + 'px';
      
      // Recalculate zoom to fit
      this.fitToView();
    }
  }
  
  private debounce(fn: Function, delay: number) {
    let timer: any;
    return function() {
      clearTimeout(timer);
      timer = setTimeout(fn, delay);
    };
  }
}
```

---

## Part 6: Practical Deployment Checklist

### Pre-Launch Testing

- [ ] Load graphs with 1K, 5K, 10K, 50K nodes and verify FPS targets
- [ ] Test pan/zoom responsiveness on Chrome, Firefox, Safari, Chrome Mobile, iOS Safari
- [ ] Verify getBBox() accuracy across browsers
- [ ] Test nested SVG flattening with >3 levels of nesting
- [ ] Stress test selection highlighting with 100+ node clusters
- [ ] Verify memory usage stays <500MB for 10K nodes
- [ ] Test touch events on iOS/Android (pinch, pan, tap)
- [ ] Verify viewport adapts correctly on resize/rotation
- [ ] Check for console warnings/errors across all browsers
- [ ] Profile using DevTools to identify remaining bottlenecks

### Performance Monitoring

```typescript
class PerformanceMonitor {
  measureRenderTime(operation: string, fn: () => void) {
    const start = performance.now();
    fn();
    const duration = performance.now() - start;
    
    // Log if exceeds threshold
    if (duration > 16) { // >1 frame at 60 FPS
      console.warn(`${operation} took ${duration.toFixed(2)}ms (target: <16ms)`);
    }
    
    // Send to analytics
    if (window.analytics) {
      window.analytics.track('svg_inspector', {
        operation,
        duration,
        nodeCount: document.querySelectorAll('[data-node-id]').length,
      });
    }
  }
  
  monitorFPS() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      const now = performance.now();
      frameCount++;
      
      if (now - lastTime >= 1000) {
        const fps = frameCount;
        frameCount = 0;
        lastTime = now;
        
        // Report if below target
        if (fps < 30) {
          console.warn(`Low FPS: ${fps}`);
        }
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }
}
```

---

## Summary: Performance Tiers

| Scale | Approach | FPS Target | Max Browser Memory |
|---|---|---|---|
| <1K nodes | Full rendering | 60 FPS | 100 MB |
| 1K-5K nodes | Virtual rendering (quadtree) | 30-60 FPS | 300 MB |
| 5K-10K nodes | LOD + edge culling | 15-30 FPS | 500 MB |
| 10K-50K nodes | Aggressive LOD + clustering | 10-15 FPS | 1 GB |
| 50K+ nodes | Server-side aggregation + LOD | <10 FPS | 2+ GB |

For production deployments, implement monitoring and gracefully degrade to appropriate strategy based on detected environment and graph size.
