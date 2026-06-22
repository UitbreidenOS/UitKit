# SVG Map Inspector — Frequently Asked Questions

Comprehensive Q&A covering common issues, performance optimization, export workflows, embedding, and advanced usage of the SVG Map Inspector for interactive architectural diagrams.

---

## Table of Contents

- [Rendering Issues](#rendering-issues)
- [Interactive Features](#interactive-features)
- [Performance & Scale](#performance--scale)
- [Exporting & Sharing](#exporting--sharing)
- [Web App Integration](#web-app-integration)
- [Print & Document](#print--document)
- [Animation & Visualization](#animation--visualization)
- [Troubleshooting & Support](#troubleshooting--support)

---

## Rendering Issues

### Q1: SVG not rendering at all — blank viewport with no error

**Problem:** You load an SVG file, but the inspector shows only an empty viewport.

**Root causes:**
- SVG missing `xmlns` attribute
- Malformed XML (unclosed tags, invalid entities)
- SVG wrapped in invalid structure
- Parser treats file as text, not XML

**Solutions:**

1. **Verify SVG header:**
   ```xml
   <!-- CORRECT -->
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 800">
     <!-- content -->
   </svg>
   
   <!-- INCORRECT -->
   <svg viewBox="0 0 1000 800">
     <!-- missing xmlns -->
   </svg>
   ```

2. **Check for XML errors:**
   ```bash
   # Validate SVG syntax
   xmllint --noout your-map.svg
   ```

3. **Inspect in browser console (F12):**
   ```javascript
   // In DevTools, check if SVG loaded
   const svg = document.querySelector('svg');
   console.log('SVG loaded:', !!svg);
   console.log('SVG xmlns:', svg?.getAttribute('xmlns'));
   console.log('SVG children:', svg?.childElementCount);
   ```

4. **Ensure file is served as `text/xml` or `image/svg+xml`:**
   ```javascript
   // When loading from FileReader
   const reader = new FileReader();
   reader.onload = (e) => {
     const content = e.target.result;
     // Verify it's valid SVG before loading
     if (!content.includes('<svg')) {
       console.error('Not a valid SVG file');
       return;
     }
     inspector.loadSVG(content);
   };
   ```

---

### Q2: Nodes render but are not clickable — click events don't register

**Problem:** SVG displays correctly, but clicking on nodes has no effect.

**Root causes:**
- Nodes missing `data-node-id` attribute
- Event listeners not attached
- `pointer-events: none` CSS hiding nodes from clicks
- SVG elements nested inside unsupported containers

**Solutions:**

1. **Verify nodes have required attributes:**
   ```xml
   <!-- CORRECT: node with data-node-id -->
   <circle 
     cx="100" cy="100" r="20" 
     data-node-id="module-1"
     data-node-label="Auth Module"
   />
   
   <!-- INCORRECT: missing data-node-id -->
   <circle cx="100" cy="100" r="20" />
   ```

2. **Check CSS for blocking pointer events:**
   ```css
   /* BAD: hides click events */
   circle { pointer-events: none; }
   
   /* GOOD: allows clicks */
   circle { pointer-events: auto; }
   ```

3. **Inspect element in DevTools:**
   ```javascript
   // In DevTools console
   document.querySelectorAll('[data-node-id]').length; // Should be > 0
   ```

4. **Ensure click handler is bound:**
   ```javascript
   // In inspector, check handler attached
   const svg = document.querySelector('svg');
   svg.addEventListener('click', (e) => {
     const node = e.target.closest('[data-node-id]');
     console.log('Clicked node:', node?.getAttribute('data-node-id'));
   });
   ```

---

### Q3: Some nodes appear distorted or misaligned — viewBox scaling issues

**Problem:** Nodes render but appear stretched, rotated, or in wrong positions.

**Root causes:**
- Incorrect `viewBox` attribute
- Nested SVGs with conflicting viewBox values
- Transform attributes stacking unexpectedly
- Coordinate system mismatch (user-space vs screen-space)

**Solutions:**

1. **Verify viewBox is correct:**
   ```xml
   <!-- CORRECT: viewBox matches content bounds -->
   <svg viewBox="0 0 1000 800" width="1000" height="800">
     <circle cx="500" cy="400" r="50" />
   </svg>
   
   <!-- INCORRECT: viewBox smaller than content -->
   <svg viewBox="0 0 100 100" width="1000" height="800">
     <circle cx="500" cy="400" r="50" /> <!-- off-screen -->
   </svg>
   ```

2. **Flatten nested SVGs before rendering:**
   ```javascript
   // Use SVGFlattener to normalize nested SVGs
   class SVGFlattener {
     flattenNestedSVGs(svgRoot) {
       const cloned = svgRoot.cloneNode(true);
       // Convert nested <svg> to <g> with transform
       cloned.querySelectorAll('svg').forEach(nested => {
         const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
         const transform = this.calculateTransform(nested);
         g.setAttribute('transform', transform);
         
         while (nested.firstChild) {
           g.appendChild(nested.firstChild);
         }
         nested.replaceWith(g);
       });
       return cloned;
     }
   }
   ```

3. **Check for transform stacking:**
   ```javascript
   // Log all transforms
   document.querySelectorAll('[transform]').forEach(el => {
     console.log(`${el.tagName}: ${el.getAttribute('transform')}`);
   });
   ```

---

### Q4: Text labels are missing or unreadable — text rendering problems

**Problem:** Node labels don't appear or are illegible.

**Root causes:**
- Text color matches background
- Font size too small or zero
- Text elements have no content
- Font not available on system

**Solutions:**

1. **Check text visibility:**
   ```css
   /* Ensure good contrast */
   text {
     fill: #e4e4e7; /* light on dark background */
     font-size: 12px;
     font-weight: 500;
   }
   ```

2. **Inspect text elements:**
   ```javascript
   // Check if text nodes exist
   const textNodes = document.querySelectorAll('text');
   console.log('Text nodes found:', textNodes.length);
   textNodes.forEach(t => {
     console.log('Text content:', t.textContent, 'Fill:', t.getAttribute('fill'));
   });
   ```

3. **Fallback for missing fonts:**
   ```css
   text {
     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
     font-size: 12px;
   }
   ```

---

### Q5: SVG renders but colors are wrong or inverted — color/CSS issues

**Problem:** Nodes appear with unexpected colors or CSS styles don't apply.

**Root causes:**
- Inline styles override CSS
- Color values in different formats (hex vs rgb vs named)
- CSS selectors too specific or not specific enough
- Style sheet not loaded

**Solutions:**

1. **Verify color in SVG:**
   ```xml
   <!-- Check fill attribute -->
   <circle cx="100" cy="100" r="20" fill="#3b82f6" />
   
   <!-- Or CSS class -->
   <circle cx="100" cy="100" r="20" class="node-primary" />
   ```

2. **Apply CSS overrides:**
   ```css
   svg [data-node] {
     fill: #3b82f6 !important;
     stroke: #0f172a;
     stroke-width: 1;
   }
   ```

3. **Check for conflicting styles:**
   ```javascript
   // Inspect computed styles in DevTools
   const node = document.querySelector('[data-node-id]');
   console.log(getComputedStyle(node).fill);
   ```

---

## Interactive Features

### Q6: Pan works, but dragging feels laggy or stutters

**Problem:** Mouse drag is not smooth; map updates with visible delay.

**Root causes:**
- Too many DOM updates per frame
- Heavy event handlers running on every mousemove
- Browser rendering at <60 FPS

**Solutions:**

1. **Use requestAnimationFrame for smooth updates:**
   ```javascript
   let animationFramePending = false;
   
   document.addEventListener('mousemove', (e) => {
     if (animationFramePending) return;
     animationFramePending = true;
     
     requestAnimationFrame(() => {
       const dx = e.clientX - panStart.x;
       const dy = e.clientY - panStart.y;
       panOffset.x += dx;
       panOffset.y += dy;
       applyTransform();
       animationFramePending = false;
     });
   });
   ```

2. **Debounce rapid pan events:**
   ```javascript
   const debouncedPan = debounce((e) => updatePan(e), 10);
   document.addEventListener('mousemove', debouncedPan);
   ```

3. **Reduce visible nodes for large maps:**
   ```javascript
   // Hide labels at low zoom
   if (zoomLevel < 1.5) {
     document.querySelectorAll('text').forEach(t => t.style.display = 'none');
   }
   ```

4. **Check DevTools Performance:**
   - Open DevTools → Performance tab
   - Record while panning
   - Look for long frames (>16ms at 60 FPS)
   - Identify expensive repaints/reflows

---

### Q7: Zoom doesn't center at mouse position — zoom feels wrong

**Problem:** Scrolling to zoom causes map to jump or zoom doesn't center correctly.

**Root causes:**
- Incorrect viewport coordinate calculation
- Pan offset not adjusted after zoom
- Mouse position not factored into zoom center

**Solutions:**

1. **Calculate zoom center correctly:**
   ```javascript
   handleZoom(e) {
     e.preventDefault();
     const delta = e.deltaY > 0 ? 0.9 : 1.1;
     const oldZoom = this.zoomLevel;
     
     // Get mouse position in model coordinates
     const rect = this.viewport.getBoundingClientRect();
     const screenX = e.clientX - rect.left;
     const screenY = e.clientY - rect.top;
     
     // Convert to model space
     const modelX = (screenX - this.panOffset.x) / oldZoom;
     const modelY = (screenY - this.panOffset.y) / oldZoom;
     
     // Update zoom
     this.zoomLevel = Math.max(0.1, Math.min(5, this.zoomLevel * delta));
     
     // Adjust pan to keep model point under mouse
     this.panOffset.x = screenX - modelX * this.zoomLevel;
     this.panOffset.y = screenY - modelY * this.zoomLevel;
     
     this.applyTransform();
   }
   ```

2. **Test zoom centering:**
   ```javascript
   // Move mouse to corner of map, scroll — should zoom around that corner
   // Move mouse to center, scroll — should zoom around center
   ```

---

### Q8: Clicking to select nodes doesn't highlight connections — edges not highlighting

**Problem:** Edges connected to selected nodes don't highlight in green.

**Root causes:**
- Edges missing `data-edge-from` and `data-edge-to` attributes
- CSS rule for `.highlighted` class not applied
- Event delegation not working

**Solutions:**

1. **Verify edges have required attributes:**
   ```xml
   <!-- CORRECT -->
   <line x1="100" y1="100" x2="200" y2="200" 
         data-edge-from="node-1" data-edge-to="node-2" 
         data-edge />
   
   <!-- INCORRECT: missing data-edge-from/to -->
   <line x1="100" y1="100" x2="200" y2="200" />
   ```

2. **Add CSS for highlighted edges:**
   ```css
   svg [data-edge].highlighted {
     stroke: #10b981 !important;
     stroke-width: 2 !important;
   }
   ```

3. **Test selection handler:**
   ```javascript
   function selectNode(nodeId) {
     // Clear previous highlights
     document.querySelectorAll('[data-edge].highlighted').forEach(e => {
       e.classList.remove('highlighted');
     });
     
     // Find and highlight connected edges
     const connectedEdges = document.querySelectorAll(
       `[data-edge-from="${nodeId}"], [data-edge-to="${nodeId}"]`
     );
     console.log('Connected edges:', connectedEdges.length);
     connectedEdges.forEach(e => e.classList.add('highlighted'));
   }
   ```

---

### Q9: Node metadata sidebar shows wrong data or is empty

**Problem:** Sidebar doesn't update or shows incorrect information when selecting nodes.

**Root causes:**
- Node dataset attributes not populated
- Metadata panel HTML not updating
- Selected node DOM not found

**Solutions:**

1. **Verify node has full metadata:**
   ```xml
   <circle 
     data-node-id="auth-core"
     data-node-label="Auth Module"
     data-node-type="module"
     data-file-path="src/auth/core.ts"
     data-size="2400"
     data-dependencies="8"
   />
   ```

2. **Test metadata extraction:**
   ```javascript
   const node = document.querySelector('[data-node-id="auth-core"]');
   console.log('Node dataset:', node.dataset);
   // Should show: { nodeId: 'auth-core', nodeLabel: 'Auth Module', ... }
   ```

3. **Check metadata panel update:**
   ```javascript
   function updateMetadataPanel(nodeId, data) {
     const panel = document.getElementById('metadataPanel');
     const html = Object.entries(data)
       .map(([k, v]) => `<div><strong>${k}:</strong> ${v}</div>`)
       .join('');
     panel.innerHTML = html;
     console.log('Panel updated with:', data);
   }
   ```

---

### Q10: Reset button doesn't clear selection or restore zoom

**Problem:** Clicking Reset doesn't reset pan/zoom or clear node selection.

**Root causes:**
- Reset handler not bound to button
- State not properly reset
- DOM not cleared of selection classes

**Solutions:**

1. **Implement full reset:**
   ```javascript
   reset() {
     // Reset state
     this.state.panOffset = { x: 0, y: 0 };
     this.state.zoomLevel = 1;
     this.state.selectedNode = null;
     
     // Clear DOM classes
     document.querySelectorAll('[data-node].selected').forEach(el => {
       el.classList.remove('selected', 'pulse');
     });
     document.querySelectorAll('[data-edge].highlighted').forEach(el => {
       el.classList.remove('highlighted');
     });
     
     // Clear sidebar
     const panel = document.getElementById('metadataPanel');
     panel.classList.remove('active');
     panel.innerHTML = '';
     document.getElementById('emptyInspector').style.display = 'block';
     
     // Apply transform
     this.applyTransform();
   }
   ```

2. **Bind reset button:**
   ```javascript
   document.getElementById('resetBtn').addEventListener('click', () => {
     console.log('Reset clicked');
     inspector.reset();
   });
   ```

---

## Performance & Scale

### Q11: Large maps (10K+ nodes) are slow — pan/zoom drops to <30 FPS

**Problem:** Performance degrades significantly on large architectural diagrams.

**Root causes:**
- All nodes rendered in DOM (memory bloat)
- Event handlers re-querying all nodes
- No virtual rendering or LOD

**Solutions:**

1. **Implement virtual rendering (for 5K+ nodes):**
   ```javascript
   // Only render nodes visible in current viewport
   class VirtualRenderer {
     updateViewport(panOffset, zoomLevel, vpWidth, vpHeight) {
       const visibleNodeIds = this.quadtree.queryViewport(
         -panOffset.x / zoomLevel,
         -panOffset.y / zoomLevel,
         vpWidth / zoomLevel,
         vpHeight / zoomLevel
       );
       
       // Remove off-screen nodes from DOM
       const allRenderedIds = new Set(
         Array.from(document.querySelectorAll('[data-node-id]'))
           .map(n => n.getAttribute('data-node-id'))
       );
       
       allRenderedIds.forEach(id => {
         if (!visibleNodeIds.includes(id)) {
           document.querySelector(`[data-node-id="${id}"]`)?.remove();
         }
       });
       
       // Add visible nodes
       visibleNodeIds.forEach(id => {
         if (!document.querySelector(`[data-node-id="${id}"]`)) {
           // Create and append node
         }
       });
     }
   }
   ```

2. **Apply Level-of-Detail (LOD) rendering:**
   ```javascript
   // Hide labels at low zoom
   applyLOD(zoomLevel) {
     const textNodes = document.querySelectorAll('text');
     if (zoomLevel < 1.5) {
       textNodes.forEach(t => t.style.display = 'none');
     } else {
       textNodes.forEach(t => t.style.display = 'block');
     }
     
     // Hide small nodes at extreme zoom out
     if (zoomLevel < 0.5) {
       document.querySelectorAll('[data-node]').forEach(node => {
         const r = parseFloat(node.getAttribute('r') || 10);
         if (r < 15) {
           node.style.display = 'none';
         }
       });
     }
   }
   ```

3. **Cull edges (show only high-weight connections):**
   ```javascript
   cullEdges(zoomLevel) {
     const edges = document.querySelectorAll('[data-edge]');
     const weights = Array.from(edges).map(e => parseFloat(e.dataset.weight || 1));
     const median = this.getMedian(weights);
     
     edges.forEach(edge => {
       const weight = parseFloat(edge.dataset.weight || 1);
       edge.style.display = weight >= median ? 'block' : 'none';
     });
   }
   ```

4. **Benchmark performance:**
   ```javascript
   console.time('pan');
   applyTransform();
   console.timeEnd('pan');
   // Target: <16ms for 60 FPS
   ```

---

### Q12: Memory usage grows unbounded — "out of memory" errors

**Problem:** Inspecting large maps causes browser tab to crash.

**Root causes:**
- All nodes stored in memory (no streaming)
- Event listeners creating memory leaks
- Transform attributes repeatedly serialized

**Solutions:**

1. **Monitor memory usage:**
   ```javascript
   if (performance.memory) {
     console.log('Heap used:', Math.round(performance.memory.usedJSHeapSize / 1048576) + 'MB');
     console.log('Heap limit:', Math.round(performance.memory.jsHeapSizeLimit / 1048576) + 'MB');
   }
   ```

2. **Cleanup unused DOM:**
   ```javascript
   // Before rendering new map, clear old one
   document.getElementById('mapSvg').innerHTML = '';
   
   // Remove all event listeners
   const oldSvg = document.getElementById('mapSvg');
   const newSvg = oldSvg.cloneNode(false);
   oldSvg.replaceWith(newSvg);
   ```

3. **Use data-uri instead of inline SVG for huge maps:**
   ```javascript
   // Instead of loading entire SVG into DOM, use canvas or image
   const blob = new Blob([svgData], { type: 'image/svg+xml' });
   const url = URL.createObjectURL(blob);
   // Load as image (non-interactive but lightweight)
   const img = new Image();
   img.src = url;
   ```

---

### Q13: Clicking is slow on large maps — selection highlighting takes 100+ ms

**Problem:** After clicking a node, it takes >100ms to highlight connections.

**Root causes:**
- Querying all edges for each selection (O(n))
- DOM updates on every edge found
- No pre-computed connection index

**Solutions:**

1. **Pre-compute connection index:**
   ```javascript
   class ConnectionIndex {
     constructor(edges) {
       this.incoming = new Map();
       this.outgoing = new Map();
       
       edges.forEach(({ from, to }) => {
         if (!this.outgoing.has(from)) this.outgoing.set(from, []);
         this.outgoing.get(from).push(to);
         
         if (!this.incoming.has(to)) this.incoming.set(to, []);
         this.incoming.get(to).push(from);
       });
     }
     
     getConnected(nodeId) {
       return new Set([
         nodeId,
         ...(this.incoming.get(nodeId) || []),
         ...(this.outgoing.get(nodeId) || []),
       ]);
     }
   }
   
   // Usage
   const connIndex = new ConnectionIndex(edges);
   selectNode(nodeId) {
     const connected = connIndex.getConnected(nodeId);
     document.querySelectorAll('[data-node], [data-edge]').forEach(el => {
       const id = el.getAttribute('data-node-id') || 
                  el.getAttribute('data-edge-from') || 
                  el.getAttribute('data-edge-to');
       el.classList.toggle('highlighted', connected.has(id));
     });
   }
   ```

2. **Batch DOM updates with CSS class:**
   ```javascript
   // Add CSS rule once
   const style = document.createElement('style');
   style.textContent = `
     [data-node].highlighted { fill: #3b82f6; }
     [data-edge].highlighted { stroke: #10b981; stroke-width: 2; }
   `;
   document.head.appendChild(style);
   
   // Now just toggle class on each element
   element.classList.add('highlighted');
   ```

---

### Q14: Zoom limits feel restrictive — can't zoom out far enough to see entire map

**Problem:** "Fit View" doesn't fit large maps; zoom out limit (10%) is too high.

**Root causes:**
- Zoom range hardcoded to 0.1-5.0
- Fit calculation not accounting for actual map bounds
- Viewport doesn't account for padding

**Solutions:**

1. **Adjust zoom limits dynamically:**
   ```javascript
   fitToView() {
     const g = document.querySelector('g[data-content]');
     const bbox = g.getBBox();
     const vpWidth = this.viewport.clientWidth;
     const vpHeight = this.viewport.clientHeight;
     
     // Calculate minimal zoom needed
     const scaleX = vpWidth / (bbox.width || 1);
     const scaleY = vpHeight / (bbox.height || 1);
     const minZoom = Math.min(scaleX, scaleY) * 0.95;
     
     // Update limits
     this.minZoom = Math.min(minZoom, 0.01); // Allow 1% zoom
     this.maxZoom = 10.0; // Or 20.0 for detailed inspection
     
     this.zoomLevel = minZoom;
     this.applyTransform();
   }
   ```

2. **Adjust bounds calculation:**
   ```javascript
   // Account for label/decoration space beyond node bounds
   getBoundsWithMargin(g) {
     const bbox = g.getBBox();
     const margin = 50; // pixels
     return {
       x: bbox.x - margin,
       y: bbox.y - margin,
       width: bbox.width + 2 * margin,
       height: bbox.height + 2 * margin,
     };
   }
   ```

---

## Exporting & Sharing

### Q15: Download button doesn't work or exports corrupted SVG

**Problem:** "Download" button produces invalid or non-viewable SVG file.

**Root causes:**
- SVG namespace not preserved during clone
- Transform attributes embedded in exported file
- File encoding issues

**Solutions:**

1. **Export with proper namespace:**
   ```javascript
   downloadSVG() {
     const svg = document.querySelector('svg').cloneNode(true);
     
     // Ensure xmlns is set
     if (!svg.hasAttribute('xmlns')) {
       svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
     }
     
     // Remove applied transforms (reset to original state)
     const g = svg.querySelector('g[data-content]');
     if (g) {
       g.removeAttribute('transform');
     }
     
     // Serialize and export
     const serializer = new XMLSerializer();
     const svgString = serializer.serializeToString(svg);
     const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
     
     const link = document.createElement('a');
     link.href = URL.createObjectURL(blob);
     link.download = `map-${Date.now()}.svg`;
     link.click();
     URL.revokeObjectURL(link.href);
   }
   ```

2. **Include inline styles in export:**
   ```javascript
   // Compute styles before export
   document.querySelectorAll('[data-node], [data-edge]').forEach(el => {
     const computed = getComputedStyle(el);
     el.setAttribute('fill', computed.fill);
     el.setAttribute('stroke', computed.stroke);
     el.setAttribute('stroke-width', computed.strokeWidth);
   });
   ```

3. **Test exported file:**
   ```bash
   # Validate SVG
   xmllint --noout exported-map.svg
   
   # Open in browser to test
   open exported-map.svg
   ```

---

### Q16: Exported SVG is too large or takes long to download

**Problem:** Downloaded SVG file is 50+ MB; download times out or browser freezes.

**Root causes:**
- All nodes rendered in full detail
- Unnecessary metadata and attributes
- No compression

**Solutions:**

1. **Optimize before export:**
   ```javascript
   optimizeForExport() {
     const svg = document.querySelector('svg').cloneNode(true);
     
     // Remove unnecessary attributes
     svg.querySelectorAll('*').forEach(el => {
       // Keep only: id, class, data-*, viewBox, xmlns, transform
       const keep = ['id', 'class', 'viewBox', 'xmlns', 'transform', 'href'];
       Array.from(el.attributes).forEach(attr => {
         if (!keep.includes(attr.name) && !attr.name.startsWith('data-')) {
           el.removeAttribute(attr.name);
         }
       });
     });
     
     // Remove style tags (keep inline styles only)
     svg.querySelectorAll('style').forEach(s => s.remove());
     
     return svg;
   }
   ```

2. **Export only visible nodes:**
   ```javascript
   exportViewport() {
     // Get current viewport bounds
     const g = document.querySelector('g[data-content]');
     const bbox = g.getBBox();
     
     // Create new SVG with only visible nodes
     const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
     svg.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
     svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
     
     // Copy only nodes/edges within bounds
     g.querySelectorAll('[data-node-id]').forEach(node => {
       const nodeBbox = node.getBBox();
       if (this.boundsOverlap(bbox, nodeBbox)) {
         svg.appendChild(node.cloneNode(true));
       }
     });
     
     return svg;
   }
   
   boundsOverlap(box1, box2) {
     return !(box2.x + box2.width < box1.x || box1.x + box1.width < box2.x ||
              box2.y + box2.height < box1.y || box1.y + box1.height < box2.y);
   }
   ```

3. **Compress before download:**
   ```bash
   # On server side
   gzip -9 map.svg  # Results in .svg.gz
   
   # Browser decompression
   const compressed = await fetch('map.svg.gz').then(r => r.arrayBuffer());
   const decompressed = await decompress(compressed); // pako library
   ```

---

### Q17: How to export only a focused region or subsystem?

**Problem:** Want to export just the "auth" subsystem, not the entire map.

**Solution:**

1. **Zoom/pan to desired region**
2. **Use focused export:**
   ```javascript
   exportSelectedRegion() {
     const viewport = document.querySelector('.map-viewport');
     const g = document.querySelector('g[data-content]');
     
     // Calculate visible bounds in model coordinates
     const vpBounds = {
       x: -this.panOffset.x / this.zoomLevel,
       y: -this.panOffset.y / this.zoomLevel,
       width: viewport.clientWidth / this.zoomLevel,
       height: viewport.clientHeight / this.zoomLevel,
     };
     
     // Create export SVG
     const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
     svg.setAttribute('viewBox', 
       `${vpBounds.x} ${vpBounds.y} ${vpBounds.width} ${vpBounds.height}`);
     svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
     
     // Include only nodes in viewport
     g.querySelectorAll('[data-node-id]').forEach(node => {
       const cx = parseFloat(node.getAttribute('cx') || 0);
       const cy = parseFloat(node.getAttribute('cy') || 0);
       const r = parseFloat(node.getAttribute('r') || 10);
       
       if (this.isPointInBounds(cx, cy, vpBounds)) {
         svg.appendChild(node.cloneNode(true));
       }
     });
     
     // Download
     this.downloadSVG(svg);
   }
   ```

---

## Web App Integration

### Q18: How to embed the inspector in a React/Vue/Angular app?

**Problem:** Want to use SVG Map Inspector as a component in a framework.

**Solutions for React:**

```jsx
import React, { useEffect, useRef } from 'react';

function SVGMapInspectorComponent({ svgData }) {
  const containerRef = useRef(null);
  const inspectorRef = useRef(null);
  
  useEffect(() => {
    // Import inspector class
    const script = document.createElement('script');
    script.src = '/path/to/svg-map-inspector.js';
    script.onload = () => {
      if (window.SVGMapInspector) {
        inspectorRef.current = new window.SVGMapInspector();
        if (svgData) {
          inspectorRef.current.loadSVG(svgData);
        }
      }
    };
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, [svgData]);
  
  return <div ref={containerRef} style={{ width: '100%', height: '600px' }} />;
}

export default SVGMapInspectorComponent;
```

**Solutions for Vue:**

```vue
<template>
  <div class="svg-inspector-wrapper" ref="container" :style="{ width: '100%', height: height }"></div>
</template>

<script>
import { onMounted, ref } from 'vue';

export default {
  props: {
    svgData: String,
    height: { type: String, default: '600px' }
  },
  setup(props) {
    const container = ref(null);
    const inspector = ref(null);
    
    onMounted(() => {
      // Dynamically load inspector
      import('/path/to/svg-map-inspector.js').then(module => {
        inspector.value = new module.SVGMapInspector();
        if (props.svgData) {
          inspector.value.loadSVG(props.svgData);
        }
      });
    });
    
    return { container };
  }
};
</script>
```

---

### Q19: How to pass data between inspector and parent app?

**Problem:** Need to listen for node selections and update app state.

**Solution with postMessage:**

```javascript
// In inspector iframe
selectNode(nodeId, data) {
  // Existing selection logic
  // ...
  
  // Notify parent app
  if (window.parent !== window) {
    window.parent.postMessage({
      type: 'NODE_SELECTED',
      payload: { nodeId, ...data }
    }, '*');
  }
}

// In parent app
window.addEventListener('message', (event) => {
  if (event.data.type === 'NODE_SELECTED') {
    const { nodeId, nodeLabel, filePath } = event.data.payload;
    // Update app state
    updateSelectedModule(nodeId);
    fetchModuleDetails(filePath);
  }
});
```

---

### Q20: How to link map nodes to external data sources (GitHub, Jira)?

**Problem:** Want to click a node and open related GitHub issue or Jira ticket.

**Solution:**

```javascript
updateMetadataPanel(nodeId, data) {
  const filePath = data.filePath;
  const githubUrl = generateGitHubLink(filePath);
  const jiraLink = searchJiraForFile(filePath);
  
  const html = `
    <div class="node-info">
      <div class="node-title">${data.nodeLabel}</div>
      <div style="margin-top: 12px; display: flex; gap: 6px; flex-wrap: wrap;">
        ${githubUrl ? `<a href="${githubUrl}" target="_blank" class="link-btn">View on GitHub</a>` : ''}
        ${jiraLink ? `<a href="${jiraLink}" target="_blank" class="link-btn">Related Issues</a>` : ''}
        ${filePath ? `<a href="vscode://file/${filePath}" class="link-btn">Open in VS Code</a>` : ''}
      </div>
    </div>
  `;
  
  this.metadataPanel.innerHTML = html;
}

function generateGitHubLink(filePath) {
  const REPO = 'https://github.com/myorg/myrepo';
  const BRANCH = 'main';
  return `${REPO}/blob/${BRANCH}/${filePath}`;
}

async function searchJiraForFile(filePath) {
  const response = await fetch(`/api/jira/search?file=${encodeURIComponent(filePath)}`);
  const result = await response.json();
  return result.issues?.[0]?.url;
}
```

---

## Print & Document

### Q21: How to print the map at high quality?

**Problem:** Printing from browser produces low-resolution or distorted output.

**Solutions:**

1. **Print-specific CSS:**
   ```css
   @media print {
     * {
       background: white !important;
       color: black !important;
     }
     
     .toolbar, .sidebar { display: none !important; }
     
     svg {
       width: 100%;
       height: auto;
    page-break-inside: avoid;
     }
     
     svg [data-node] {
       fill: #000 !important;
       stroke: #333 !important;
     }
     
     text {
       fill: #000 !important;
       font-size: 11pt;
     }
   }
   ```

2. **Export as PDF via print dialog:**
   ```javascript
   printMap() {
     // Print from browser (Ctrl+P or Cmd+P)
     window.print();
   }
   ```

3. **Server-side rendering to PDF:**
   ```javascript
   // Use Puppeteer or Playwright
   const browser = await puppeteer.launch();
   const page = await browser.newPage();
   await page.goto(`http://localhost:3000/map/${mapId}`);
   await page.pdf({ path: `map-${mapId}.pdf`, format: 'A1' });
   ```

---

### Q22: Exported SVG looks different in Figma or Illustrator

**Problem:** SVG displays correctly in browser but distorted in design tools.

**Root causes:**
- Missing XML declaration
- Unsupported SVG features (CSS, filters)
- Coordinate precision issues

**Solutions:**

1. **Add XML declaration:**
   ```javascript
   downloadSVG() {
     const svgString = `<?xml version="1.0" encoding="UTF-8"?>\n${svgContent}`;
     // ...
   }
   ```

2. **Inline all styles:**
   ```javascript
   inlineStyles(svg) {
     svg.querySelectorAll('*').forEach(el => {
       const computed = getComputedStyle(el);
       el.setAttribute('fill', computed.fill);
       el.setAttribute('stroke', computed.stroke);
       el.setAttribute('stroke-width', computed.strokeWidth);
       el.setAttribute('font-size', computed.fontSize);
     });
   }
   ```

3. **Remove CSS filters (incompatible with Illustrator):**
   ```javascript
   sanitizeForDesignTools(svg) {
     svg.querySelectorAll('[style*="filter"]').forEach(el => {
       el.style.filter = '';
     });
     svg.querySelectorAll('filter').forEach(f => f.remove());
   }
   ```

---

## Animation & Visualization

### Q23: How to add animations to nodes (pulse, glow, fade)?

**Problem:** Static visualization is boring; want animated effects.

**Solutions:**

1. **CSS animations:**
   ```css
   @keyframes nodePulse {
     0%, 100% { opacity: 1; }
     50% { opacity: 0.5; }
   }
   
   @keyframes nodeGlow {
     0%, 100% { filter: drop-shadow(0 0 0px transparent); }
     50% { filter: drop-shadow(0 0 8px #3b82f6); }
   }
   
   [data-node].pulse { animation: nodePulse 0.8s ease-in-out infinite; }
   [data-node].glow { animation: nodeGlow 1.2s ease-in-out infinite; }
   ```

2. **JavaScript animations:**
   ```javascript
   animateNodeSelection(nodeId) {
     const node = document.querySelector(`[data-node-id="${nodeId}"]`);
     node.classList.add('pulse');
     
     setTimeout(() => {
       node.classList.remove('pulse');
     }, 3000);
   }
   ```

3. **Path animations for edges:**
   ```css
   @keyframes flowEdge {
     0% { stroke-dashoffset: 0; }
     100% { stroke-dashoffset: -20px; }
   }
   
   [data-edge].flow {
     stroke-dasharray: 20;
     animation: flowEdge 0.5s linear infinite;
   }
   ```

---

### Q24: How to highlight dependency flow from one node to another?

**Problem:** Want to visualize data flow or dependency chain interactively.

**Solution:**

```javascript
highlightDependencyChain(startNodeId, endNodeId) {
  // Breadth-first search for path
  const path = this.findPath(startNodeId, endNodeId);
  
  if (!path) {
    console.log('No path found');
    return;
  }
  
  // Highlight nodes in path
  path.forEach((nodeId, index) => {
    const node = document.querySelector(`[data-node-id="${nodeId}"]`);
    node.classList.add('chain');
    node.style.animationDelay = `${index * 100}ms`;
  });
  
  // Highlight edges in path
  for (let i = 0; i < path.length - 1; i++) {
    const fromId = path[i];
    const toId = path[i + 1];
    const edge = document.querySelector(
      `[data-edge-from="${fromId}"][data-edge-to="${toId}"]`
    );
    if (edge) {
      edge.classList.add('chain', 'flow');
    }
  }
}

findPath(start, end) {
  const queue = [[start]];
  const visited = new Set([start]);
  
  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];
    
    if (current === end) return path;
    
    const connections = this.getOutgoingConnections(current);
    connections.forEach(next => {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push([...path, next]);
      }
    });
  }
  
  return null;
}
```

---

## Troubleshooting & Support

### Q25: How to debug issues with DevTools?

**Problem:** Something isn't working; need to investigate.

**Solutions:**

1. **Inspect SVG structure:**
   ```javascript
   // In DevTools console
   const svg = document.querySelector('svg');
   console.log('SVG attributes:', {
     xmlns: svg.getAttribute('xmlns'),
     viewBox: svg.getAttribute('viewBox'),
     width: svg.getAttribute('width'),
     height: svg.getAttribute('height'),
   });
   
   console.log('Node count:', document.querySelectorAll('[data-node-id]').length);
   console.log('Edge count:', document.querySelectorAll('[data-edge]').length);
   ```

2. **Monitor events:**
   ```javascript
   // Capture all click events on SVG
   document.addEventListener('click', (e) => {
     const node = e.target.closest('[data-node-id]');
     if (node) {
       console.log('Clicked node:', node.getAttribute('data-node-id'), node.dataset);
     }
   }, true);
   ```

3. **Performance profiling:**
   ```javascript
   performance.mark('pan-start');
   applyTransform();
   performance.mark('pan-end');
   performance.measure('pan', 'pan-start', 'pan-end');
   
   const measure = performance.getEntriesByName('pan')[0];
   console.log(`Pan took ${measure.duration}ms`);
   ```

---

### Q26: Browser says "SVG rendering error" — what does it mean?

**Problem:** Console shows cryptic SVG errors.

**Common errors and fixes:**

| Error | Cause | Fix |
|---|---|---|
| `Failed to parse SVG` | Invalid XML | Run through XMLLint validator |
| `g.getBBox is not a function` | No `<g>` element with `data-content` | Ensure wrapper group exists |
| `Cannot read property 'getAttribute' of null` | Node not found in DOM | Check `data-node-id` is correct |
| `ReferenceError: SVGMapInspector is not defined` | Script not loaded | Ensure script tag is before usage |
| `Out of memory` | Too many nodes | Implement virtual rendering |

---

### Q27: Should I use SVG Map Inspector or D3/Three.js for my visualization?

**Decision matrix:**

| Feature | SVG Inspector | D3 | Three.js |
|---|---|---|---|
| **Best for** | Architectural maps, dependency graphs | Custom interactive charts | 3D visualizations, WebGL |
| **Ease of setup** | Minutes (ready-to-use) | Hours (custom code) | Days (3D knowledge needed) |
| **Max nodes** | 10K (optimized) | 50K (force sim) | 100K (WebGL) |
| **Performance** | Good (2D transforms) | Good (DOM/Canvas hybrid) | Excellent (GPU) |
| **SVG export** | Yes (native) | Yes (with work) | No (requires canvas2svg) |
| **Mobile** | Fair (touch support) | Good | Fair (performance) |
| **Learning curve** | Shallow | Moderate | Steep |

**Use SVG Map Inspector if:**
- Visualizing static or semi-dynamic architectural diagrams
- Need native SVG export for documentation
- Want minimal setup with interactive features
- Targeting <5K nodes

**Use D3 if:**
- Need custom force-directed layouts
- Want extensive customization
- Targeting 5K-50K nodes with animations

**Use Three.js if:**
- Visualizing 3D relationships
- Need WebGL performance for 100K+ nodes
- Showing temporal evolution or complex interactions

---

### Q28: How to report bugs or request features?

**Process:**

1. **Check existing issues:** Search GitHub issues for your problem
2. **Reproduce in isolation:** Create minimal SVG that triggers the bug
3. **Collect debug info:**
   ```javascript
   {
     nodeCount: document.querySelectorAll('[data-node-id]').length,
     edgeCount: document.querySelectorAll('[data-edge]').length,
     browser: navigator.userAgent,
     screenSize: `${window.innerWidth}x${window.innerHeight}`,
     memoryUsage: performance.memory?.usedJSHeapSize,
     timestamp: new Date().toISOString()
   }
   ```
4. **File issue with:** Bug title, reproduction steps, expected vs actual, debug info, SVG sample

---

## Performance Benchmarks & Recommendations

| Scenario | Node Count | Edge Count | Browser | FPS | Zoom Limit |
|---|---|---|---|---|---|
| Small codebase | <1K | <5K | All | 60 | 10%-500% |
| Medium codebase | 1K-5K | 5K-20K | All | 30-60 | 1%-500% |
| Large codebase | 5K-10K | 20K-50K | Chrome | 15-30 | 0.1%-500% |
| Enterprise | 10K-50K | 50K-200K | Chrome + LOD | 10-15 | 0.01%-500% |
| Massive | 50K+ | 200K+ | Server-side | <10 | 0.01%-500% |

**Recommendation:** For production deployments >5K nodes, implement quadtree virtual rendering and LOD with monitoring.

---

This FAQ should cover 95% of common questions. For additional help, consult the main skill documentation in `/skills/frontend/svg-map-inspector.md` or the tutorial in `/guides/svg-map-inspector-tutorial.md`.
