# SVG Map Render

Node.js script that converts prophet.js or oracle.js JSON output (codebase-map.json) to interactive SVG visualization with pan/zoom/click handlers.

## Usage

```bash
node scripts/svg-map-render.js [output-path]
```

### Examples

Generate to default location (.claude/codebase-map.svg):
```bash
node scripts/svg-map-render.js
```

Generate to custom location:
```bash
node scripts/svg-map-render.js ./my-map.svg
node scripts/svg-map-render.js /tmp/analysis-map.svg
```

## Features

- **Pan**: Click and drag on the background to pan across the visualization
- **Zoom**: Use mouse wheel to zoom in/out (0.5x to 3x)
- **Zoom Controls**: Click +/- buttons in the top-left corner
- **Reset View**: Double-click background to reset pan/zoom
- **Node Details**: Click any node to display file ID and extension
- **Force-Directed Layout**: Uses force-directed graph layout for optimal node positioning
- **Color-Coded Nodes**: 
  - `.js` → Yellow (#FFC107)
  - `.ts` → Light Blue (#2196F3)
  - `.tsx` → Dark Blue (#1976D2)
  - `.py` → Python Blue (#3776AB)
  - `.json` → Red (#FF6B6B)
  - `.md` → Green (#4CAF50)

## Input Format

Expects `.claude/codebase-map.json` with structure:
```json
{
  "nodes": [
    {
      "id": "path/to/file.js",
      "label": "file.js",
      "type": "file",
      "ext": ".js",
      "imports": [],
      "classes": [],
      "functions": []
    }
  ],
  "edges": [
    {
      "source": "path/to/file1.js",
      "target": "path/to/file2.js"
    }
  ]
}
```

## Output

Self-contained SVG file with embedded JavaScript for interactivity. Works in any modern browser or SVG viewer.

## Performance

- Optimized for up to 200 nodes
- Force-directed layout uses 50 iterations with collision detection
- Runs in ~200-500ms depending on node/edge count
