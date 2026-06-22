# SVG Inspector Guide

## Overview

`claudient svg-inspector` is a comprehensive CLI tool for inspecting, validating, rendering, and exporting SVG maps. It converts JSON map definitions to interactive SVG visualizations and provides a local development server for real-time viewing and manipulation.

## Installation

The tool is included with Claudient. Access via:

```bash
npx claudient svg-inspector <command> [file] [options]
node scripts/claudient-svg-inspector.js <command> [file] [options]
```

## Commands

### inspect

Analyze and display metadata about a map file.

```bash
claudient svg-inspector inspect <file>
```

**Output includes:**
- File type and size
- Canvas dimensions
- Total element count
- Layer structure and composition
- Color palette extraction
- Custom metadata

**Example:**

```bash
$ claudient svg-inspector inspect maps/sample-network.json

=== SVG Map Inspector ===

File: maps/sample-network.json
Type: json
Size: 2220 bytes
Dimensions: 800x600
Elements: 9
Layers: 3
Colors: 12

Layers:
  [0] nodes - rect (5 elements)
  [1] connections - line (3 elements)
  [2] labels - text (1 elements)

Color Palette:
  #3b82f6
  #1e40af
  #10b981
  ...

Metadata:
  created: 2026-06-22
  version: 1.0
  author: Claudient
```

### render

Convert a JSON map definition to SVG format.

```bash
claudient svg-inspector render <file> [options]
```

**Options:**
- `--output <path>` — Output file path (default: replace extension with .svg)
- `--zoom <factor>` — Zoom multiplier for canvas size (default: 1)
- `--width <px>` — Override canvas width
- `--height <px>` — Override canvas height
- `--theme <light|dark>` — Color theme (default: light)
- `--show-grid` — Display alignment grid overlay

**Example:**

```bash
# Basic render
claudient svg-inspector render map.json

# Render with 2x zoom
claudient svg-inspector render map.json --zoom 2 --output map-large.svg

# Render with custom theme
claudient svg-inspector render map.json --theme dark --output map-dark.svg

# Render with grid overlay
claudient svg-inspector render map.json --show-grid
```

### export

Export a map to HTML with interactive viewer or standalone SVG.

```bash
claudient svg-inspector export <file> [options]
```

**Options:**
- `--export-html` — Wrap SVG in interactive HTML viewer (default: SVG only)
- `--output <path>` — Output file path
- `--zoom <factor>` — Initial zoom level in viewer

**Example:**

```bash
# Export as standalone SVG
claudient svg-inspector export map.json --output map-export.svg

# Export with interactive viewer
claudient svg-inspector export map.json --export-html --output viewer.html

# Export with preset zoom
claudient svg-inspector export map.json --export-html --zoom 1.5
```

### serve

Start a local development server with interactive map viewer and API endpoints.

```bash
claudient svg-inspector serve <file> [options]
```

**Options:**
- `--port <number>` — Server port (default: 8080)
- `--interactive` — Auto-open browser

**API Endpoints:**
- `GET /` — Main viewer HTML
- `GET /map.svg` — SVG file
- `GET /api/meta` — Metadata JSON
- `GET /api/data` — Map data JSON
- `GET /styles.css` — Viewer styles
- `GET /viewer.js` — Viewer script

**Viewer Features:**
- Pan and zoom with mouse
- Scroll to zoom in/out
- Drag to pan
- Element hover info
- SVG download button
- Reset view button

**Example:**

```bash
# Start dev server (auto-opens browser)
claudient svg-inspector serve map.json

# Start on custom port
claudient svg-inspector serve map.json --port 3000

# Start without opening browser
claudient svg-inspector serve map.json --interactive
```

### validate

Check map structure for errors and inconsistencies.

```bash
claudient svg-inspector validate <file>
```

**Checks:**
- Required fields (type, dimensions)
- Element structure
- Layer definitions
- ViewBox configuration
- Element-specific requirements (rect: x,y,width,height; circle: cx,cy,r; etc.)

**Exit codes:**
- `0` — Valid map
- `1` — Errors found

**Example:**

```bash
$ claudient svg-inspector validate map.json

=== Validation Report ===

File: maps/sample-network.json
✓ Map is valid
```

### list

Display all available maps in the `maps/` directory.

```bash
claudient svg-inspector list
```

**Example:**

```bash
$ claudient svg-inspector list

Available Maps:

  dashboard-layout.json                    2.3 KB
  sample-network.json                      2.2 KB
```

## JSON Map Format

### Structure

```json
{
  "type": "network|layout|flowchart|custom",
  "title": "Map Title",
  "description": "Optional description",
  "width": 800,
  "height": 600,
  "viewBox": "0 0 800 600",
  "metadata": {
    "created": "2026-06-22",
    "version": "1.0",
    "author": "Name"
  },
  "elements": [
    {
      "type": "rect|circle|polygon|text|line|path",
      "x": 50,
      "y": 50,
      "width": 150,
      "height": 100,
      "fill": "#3b82f6",
      "stroke": "#1e40af",
      "stroke-width": 2,
      "opacity": 1,
      "layer": "nodes",
      "label": "Server A"
    }
  ]
}
```

### Element Types

#### rect
```json
{
  "type": "rect",
  "x": 50,
  "y": 50,
  "width": 150,
  "height": 100,
  "fill": "#3b82f6",
  "stroke": "#1e40af",
  "stroke-width": 2
}
```

#### circle
```json
{
  "type": "circle",
  "cx": 150,
  "cy": 300,
  "r": 40,
  "fill": "#ef4444",
  "stroke": "#991b1b"
}
```

#### polygon
```json
{
  "type": "polygon",
  "points": "0,0 100,0 50,100",
  "fill": "#f59e0b",
  "stroke": "#d97706"
}
```

#### text
```json
{
  "type": "text",
  "x": 400,
  "y": 500,
  "fill": "#1f2937",
  "content": "Label text"
}
```

#### line
```json
{
  "type": "line",
  "x1": 125,
  "y1": 150,
  "x2": 150,
  "y2": 260,
  "stroke": "#6b7280",
  "stroke-width": 2
}
```

#### path
```json
{
  "type": "path",
  "d": "M 10 10 L 90 90",
  "stroke": "#3b82f6",
  "stroke-width": 2,
  "fill": "none"
}
```

## Options Reference

### Global Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--port` | number | 8080 | Server port for serve command |
| `--zoom` | decimal | 1 | Zoom/scale multiplier |
| `--output` | path | Auto | Output file path |
| `--format` | string | svg | Output format (svg, html, json) |
| `--width` | number | 800 | Canvas width in pixels |
| `--height` | number | 600 | Canvas height in pixels |
| `--theme` | string | light | Color theme (light, dark) |
| `--show-grid` | flag | false | Display grid overlay |
| `--interactive` | flag | false | Launch interactive mode |
| `--export-html` | flag | false | Wrap in HTML viewer |

## Themes

### Light (default)
- Background: white
- Text: black
- Grid: light gray

### Dark
- Background: dark gray (#1e1e1e)
- Text: white
- Grid: darker gray

## Examples

### Network Topology Diagram

```json
{
  "type": "network",
  "title": "Network Topology",
  "width": 800,
  "height": 600,
  "elements": [
    {
      "type": "rect",
      "x": 50,
      "y": 50,
      "width": 150,
      "height": 100,
      "fill": "#3b82f6",
      "stroke": "#1e40af",
      "layer": "nodes",
      "label": "Server A"
    },
    {
      "type": "circle",
      "cx": 400,
      "cy": 300,
      "r": 40,
      "fill": "#ef4444",
      "stroke": "#991b1b",
      "layer": "nodes",
      "label": "Database"
    },
    {
      "type": "line",
      "x1": 125,
      "y1": 150,
      "x2": 400,
      "y2": 260,
      "stroke": "#6b7280",
      "stroke-width": 2,
      "layer": "connections"
    }
  ]
}
```

**Render and view:**
```bash
claudient svg-inspector render network.json
claudient svg-inspector export network.json --export-html
claudient svg-inspector serve network.json
```

### Dashboard Layout

```json
{
  "type": "layout",
  "title": "Dashboard Layout",
  "width": 1200,
  "height": 800,
  "elements": [
    {
      "type": "rect",
      "x": 20,
      "y": 20,
      "width": 1160,
      "height": 60,
      "fill": "#1f2937",
      "layer": "header"
    },
    {
      "type": "rect",
      "x": 20,
      "y": 100,
      "width": 200,
      "height": 680,
      "fill": "#f3f4f6",
      "layer": "sidebar"
    },
    {
      "type": "rect",
      "x": 240,
      "y": 100,
      "width": 940,
      "height": 680,
      "fill": "#ffffff",
      "layer": "content"
    }
  ]
}
```

## Workflow Examples

### Development Workflow

```bash
# 1. Create map definition
cat > mymap.json << EOF
{
  "type": "network",
  "width": 800,
  "height": 600,
  "elements": [...]
}
EOF

# 2. Validate structure
claudient svg-inspector validate mymap.json

# 3. Inspect metadata
claudient svg-inspector inspect mymap.json

# 4. Render to SVG
claudient svg-inspector render mymap.json

# 5. Start dev server for interactive editing
claudient svg-inspector serve mymap.json --port 3000

# 6. Export for production
claudient svg-inspector export mymap.json --export-html
```

### Documentation Workflow

```bash
# Generate SVG visualization for docs
claudient svg-inspector render architecture.json \
  --zoom 1.5 \
  --output docs/architecture.svg

# Create interactive embed for docs site
claudient svg-inspector export architecture.json \
  --export-html \
  --output docs/architecture-viewer.html
```

### Testing Workflow

```bash
# Validate all maps
for map in maps/*.json; do
  claudient svg-inspector validate "$map" || exit 1
done

# Generate SVGs
for map in maps/*.json; do
  claudient svg-inspector render "$map"
done
```

## Performance

- **Small maps** (< 100 elements): < 100ms render time
- **Medium maps** (100-1000 elements): 100-500ms
- **Large maps** (1000+ elements): 500ms-2s

## Browser Compatibility

The interactive viewer supports:
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Port already in use
```bash
claudient svg-inspector serve map.json --port 3001
```

### Invalid JSON map
```bash
claudient svg-inspector validate map.json
# Review error messages and fix structure
```

### Large maps render slowly
```bash
# Optimize by:
# 1. Reducing element count
# 2. Simplifying paths
# 3. Using lower precision coordinates
```

### Colors not rendering
```bash
# Use valid hex colors:
# Valid: #3b82f6, #fff, #ffffff
# Invalid: rgb(59, 130, 246), hsl(...)

# For grayscale, use:
# #000000 (black) to #ffffff (white)
```

## API Reference

### Metadata Object

```javascript
{
  type: 'json|svg',
  width: number,
  height: number,
  elementCount: number,
  layers: Array<{
    name: string,
    type: string,
    elements: number
  }>,
  colorPalette: Array<string>,
  metadata: object
}
```

### Validation Results

```javascript
{
  valid: boolean,
  errors: Array<string>,
  warnings: Array<string>
}
```

## Advanced Usage

### Programmatic API

```bash
# Pipe JSON to viewer
cat map.json | node scripts/claudient-svg-inspector.js render

# Extract metadata via API
curl http://localhost:8080/api/meta | jq '.colorPalette'

# Get map data
curl http://localhost:8080/api/data | jq '.elements[0]'
```

### Batch Operations

```bash
# Validate all maps
node -e "
  require('fs').readdirSync('maps')
    .filter(f => f.endsWith('.json'))
    .forEach(f => {
      const { execSync } = require('child_process');
      try {
        execSync(\`node scripts/claudient-svg-inspector.js validate maps/\${f}\`);
      } catch(e) {
        console.error(\`Invalid: \${f}\`);
      }
    });
"
```

## License

Part of Claudient. Licensed under AGPL-3.0-or-later and CC-BY-SA-4.0.

## See Also

- `claudient map` — Generate codebase dependency graphs
- `claudient chart` — Create statistical visualizations
- Maps directory: `maps/`
