#!/usr/bin/env node

/**
 * claudient-svg-inspector.js
 *
 * SVG map inspector and rendering CLI tool.
 * Convert JSON maps to SVG, launch interactive server, export HTML.
 *
 * Usage:
 *   claudient svg-inspector inspect <file>                    Inspect SVG/JSON metadata
 *   claudient svg-inspector render <file>                     Render JSON map to SVG
 *   claudient svg-inspector export <file> [--export-html]    Export to HTML with viewer
 *   claudient svg-inspector serve <file> [--port 8080]       Start local dev server
 *   claudient svg-inspector validate <file>                   Validate map structure
 *   claudient svg-inspector list                              List available maps
 *
 * Options:
 *   --interactive                                 Launch interactive mode
 *   --port <number>                               Server port (default: 8080)
 *   --export-html                                 Export with embedded HTML viewer
 *   --zoom <factor>                               Zoom level for rendering (default: 1)
 *   --output <path>                               Output file path
 *   --format <svg|html|json>                      Output format (default: svg)
 *   --width <px>                                  Canvas width
 *   --height <px>                                 Canvas height
 *   --theme <light|dark|custom>                   Color theme
 */

const fs = require('fs')
const path = require('path')
const http = require('http')
const url = require('url')
const { execSync } = require('child_process')

const REPO_ROOT = path.resolve(__dirname, '..')

// Parse command-line arguments
const [, , command, targetFile, ...args] = process.argv
const options = parseOptions(args)

// Routes
const commands = {
  inspect: inspectMap,
  render: renderMap,
  export: exportMap,
  serve: serveMap,
  validate: validateMap,
  list: listMaps,
  help: showHelp,
}

// Main
if (!command || command === 'help') {
  showHelp()
  process.exit(0)
}

if (typeof commands[command] === 'function') {
  try {
    commands[command](targetFile, options)
  } catch (err) {
    console.error(`Error: ${err.message}`)
    process.exit(1)
  }
} else {
  console.error(`Unknown command: ${command}`)
  showHelp()
  process.exit(1)
}

// ============================================================================
// COMMANDS
// ============================================================================

function inspectMap(filePath, opts) {
  const file = resolveFile(filePath)
  const data = loadFile(file)
  const stats = analyzeMap(data, file)

  console.log('\n=== SVG Map Inspector ===\n')
  console.log(`File: ${path.relative(process.cwd(), file)}`)
  console.log(`Type: ${stats.type}`)
  console.log(`Size: ${fs.statSync(file).size} bytes`)
  console.log(`Dimensions: ${stats.width}x${stats.height}`)
  console.log(`Elements: ${stats.elementCount}`)
  console.log(`Layers: ${stats.layers.length}`)
  console.log(`Colors: ${stats.colorPalette.length}`)

  if (stats.layers.length > 0) {
    console.log('\nLayers:')
    stats.layers.forEach((layer, i) => {
      console.log(`  [${i}] ${layer.name || 'Unnamed'} - ${layer.type} (${layer.elements} elements)`)
    })
  }

  if (stats.colorPalette.length > 0) {
    console.log('\nColor Palette:')
    stats.colorPalette.slice(0, 10).forEach(color => {
      console.log(`  ${color}`)
    })
    if (stats.colorPalette.length > 10) {
      console.log(`  ... and ${stats.colorPalette.length - 10} more`)
    }
  }

  if (stats.metadata) {
    console.log('\nMetadata:')
    Object.entries(stats.metadata).forEach(([key, val]) => {
      console.log(`  ${key}: ${val}`)
    })
  }

  console.log('\n')
}

function renderMap(filePath, opts) {
  const file = resolveFile(filePath)
  const data = loadFile(file)
  const outputPath = opts.output || file.replace(/\.(json|svg)$/, '.svg')

  if (data.type === 'json' || typeof data === 'object') {
    const svg = jsonToSvg(data, opts)
    fs.writeFileSync(outputPath, svg)
    console.log(`Rendered SVG: ${path.relative(process.cwd(), outputPath)}`)
  } else if (data.type === 'svg' || file.endsWith('.svg')) {
    console.log('File is already SVG format')
  }
}

function exportMap(filePath, opts) {
  const file = resolveFile(filePath)
  const data = loadFile(file)
  let svg = ''

  if (typeof data === 'object') {
    svg = jsonToSvg(data, opts)
  } else {
    svg = data
  }

  const outputPath = opts.output || file.replace(/\.[^.]+$/, '.html')

  if (opts['export-html']) {
    const html = wrapSvgInHtml(svg, {
      title: path.basename(file),
      interactive: true,
      zoom: opts.zoom || 1,
    })
    fs.writeFileSync(outputPath, html)
    console.log(`Exported HTML: ${path.relative(process.cwd(), outputPath)}`)
  } else {
    fs.writeFileSync(outputPath, svg)
    console.log(`Exported SVG: ${path.relative(process.cwd(), outputPath)}`)
  }
}

function serveMap(filePath, opts) {
  const file = resolveFile(filePath)
  const port = parseInt(opts.port) || 8080
  const data = loadFile(file)
  let svg = ''

  if (typeof data === 'object') {
    svg = jsonToSvg(data, opts)
  } else {
    svg = data
  }

  const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true)
    const pathname = parsedUrl.pathname

    // Serve main viewer
    if (pathname === '/' || pathname === '/index.html') {
      const html = wrapSvgInHtml(svg, {
        title: path.basename(file),
        interactive: true,
        showControls: true,
        zoom: opts.zoom || 1,
      })
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(html)
    }
    // Serve SVG
    else if (pathname === '/map.svg') {
      res.writeHead(200, { 'Content-Type': 'image/svg+xml' })
      res.end(svg)
    }
    // Serve metadata API
    else if (pathname === '/api/meta') {
      const stats = analyzeMap(data, file)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(stats, null, 2))
    }
    // Serve data API
    else if (pathname === '/api/data') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(data, null, 2))
    }
    // Serve styles
    else if (pathname === '/styles.css') {
      res.writeHead(200, { 'Content-Type': 'text/css' })
      res.end(getStyles())
    }
    // Serve scripts
    else if (pathname === '/viewer.js') {
      res.writeHead(200, { 'Content-Type': 'text/javascript' })
      res.end(getViewerScript())
    }
    // 404
    else {
      res.writeHead(404)
      res.end('Not Found')
    }
  })

  server.listen(port, () => {
    const addr = `http://localhost:${port}`
    console.log(`\nSVG Map Viewer running at ${addr}`)
    console.log(`Press Ctrl+C to stop\n`)

    if (opts.interactive || process.platform !== 'win32') {
      try {
        if (process.platform === 'darwin') {
          execSync(`open "${addr}"`, { stdio: 'ignore' })
        } else if (process.platform === 'linux') {
          execSync(`xdg-open "${addr}"`, { stdio: 'ignore' })
        }
      } catch (e) {
        // Silently ignore if open fails
      }
    }
  })
}

function validateMap(filePath, opts) {
  const file = resolveFile(filePath)
  const data = loadFile(file)
  const errors = []
  const warnings = []

  if (typeof data === 'object') {
    // Validate JSON map structure
    if (!data.type) warnings.push('Missing type field')
    if (!data.width || !data.height) errors.push('Missing dimensions (width/height)')
    if (!Array.isArray(data.elements)) warnings.push('Elements should be an array')
    if (!data.viewBox && (!data.width || !data.height)) {
      errors.push('Missing viewBox or dimensions')
    }

    // Validate elements
    if (Array.isArray(data.elements)) {
      data.elements.forEach((el, i) => {
        if (!el.type) warnings.push(`Element ${i}: missing type`)
        if (el.type === 'rect' && (!el.x || !el.y || !el.width || !el.height)) {
          errors.push(`Element ${i}: rect missing required properties`)
        }
        if (el.type === 'circle' && (!el.cx || !el.cy || !el.r)) {
          errors.push(`Element ${i}: circle missing required properties`)
        }
      })
    }
  }

  console.log(`\n=== Validation Report ===\n`)
  console.log(`File: ${path.relative(process.cwd(), file)}`)

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✓ Map is valid\n')
    return
  }

  if (errors.length > 0) {
    console.log('ERRORS:')
    errors.forEach(e => console.log(`  ✗ ${e}`))
  }

  if (warnings.length > 0) {
    console.log('\nWARNINGS:')
    warnings.forEach(w => console.log(`  ⚠ ${w}`))
  }

  console.log()
  process.exit(errors.length > 0 ? 1 : 0)
}

function listMaps(_, opts) {
  const mapsDir = path.join(REPO_ROOT, 'maps')
  if (!fs.existsSync(mapsDir)) {
    console.log('No maps directory found')
    return
  }

  const files = fs.readdirSync(mapsDir)
    .filter(f => f.endsWith('.json') || f.endsWith('.svg'))
    .sort()

  console.log('\nAvailable Maps:\n')
  files.forEach(f => {
    const fullPath = path.join(mapsDir, f)
    const stats = fs.statSync(fullPath)
    const sizeKb = (stats.size / 1024).toFixed(1)
    console.log(`  ${f.padEnd(40)} ${sizeKb} KB`)
  })
  console.log()
}

// ============================================================================
// UTILITIES
// ============================================================================

function parseOptions(args) {
  const opts = {}
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].replace('--', '')
      if (args[i + 1] && !args[i + 1].startsWith('--')) {
        opts[key] = args[i + 1]
        i++
      } else {
        opts[key] = true
      }
    }
  }
  return opts
}

function resolveFile(filePath) {
  if (!filePath) {
    throw new Error('File path required')
  }

  // Try current directory
  if (fs.existsSync(filePath)) {
    return path.resolve(filePath)
  }

  // Try maps directory
  const mapsDir = path.join(REPO_ROOT, 'maps')
  if (fs.existsSync(path.join(mapsDir, filePath))) {
    return path.resolve(mapsDir, filePath)
  }

  throw new Error(`File not found: ${filePath}`)
}

function loadFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')

  if (filePath.endsWith('.json')) {
    return JSON.parse(content)
  } else if (filePath.endsWith('.svg')) {
    return content
  } else {
    try {
      return JSON.parse(content)
    } catch (e) {
      return content
    }
  }
}

function analyzeMap(data, filePath) {
  const stats = {
    type: filePath.endsWith('.svg') ? 'svg' : 'json',
    width: 800,
    height: 600,
    elementCount: 0,
    layers: [],
    colorPalette: new Set(),
    metadata: {},
  }

  if (typeof data === 'object') {
    stats.width = data.width || 800
    stats.height = data.height || 600
    stats.metadata = data.metadata || {}

    if (Array.isArray(data.elements)) {
      stats.elementCount = data.elements.length

      const layerMap = {}
      data.elements.forEach(el => {
        const layer = el.layer || 'default'
        if (!layerMap[layer]) {
          layerMap[layer] = { name: layer, type: el.type, elements: 0 }
        }
        layerMap[layer].elements++

        if (el.fill) stats.colorPalette.add(el.fill)
        if (el.stroke) stats.colorPalette.add(el.stroke)
      })

      stats.layers = Object.values(layerMap)
    }
  }

  stats.colorPalette = Array.from(stats.colorPalette)
  return stats
}

function jsonToSvg(data, opts) {
  const width = opts.width || data.width || 800
  const height = opts.height || data.height || 600
  const zoom = parseFloat(opts.zoom) || 1
  const theme = opts.theme || 'light'

  const themeColors = {
    light: { bg: '#ffffff', text: '#000000', grid: '#e0e0e0' },
    dark: { bg: '#1e1e1e', text: '#ffffff', grid: '#333333' },
  }

  const colors = themeColors[theme] || themeColors.light
  const scaledWidth = width * zoom
  const scaledHeight = height * zoom

  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${scaledWidth}" height="${scaledHeight}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      .svg-grid { stroke: ${colors.grid}; stroke-width: 1; }
      .svg-text { font-family: monospace; font-size: 12px; fill: ${colors.text}; }
      .svg-element { cursor: pointer; transition: opacity 0.2s; }
      .svg-element:hover { opacity: 0.8; }
    </style>
  </defs>
  <rect width="${width}" height="${height}" fill="${colors.bg}"/>
`

  // Add grid
  if (opts['show-grid']) {
    for (let x = 0; x <= width; x += 50) {
      svg += `  <line x1="${x}" y1="0" x2="${x}" y2="${height}" class="svg-grid"/>\n`
    }
    for (let y = 0; y <= height; y += 50) {
      svg += `  <line x1="0" y1="${y}" x2="${width}" y2="${y}" class="svg-grid"/>\n`
    }
  }

  // Add elements
  if (Array.isArray(data.elements)) {
    data.elements.forEach((el, i) => {
      const attrs = {
        fill: el.fill || '#3b82f6',
        stroke: el.stroke || '#1e40af',
        'stroke-width': el['stroke-width'] || 2,
        opacity: el.opacity || 1,
      }

      const attrStr = Object.entries(attrs)
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ')

      switch (el.type) {
        case 'rect':
          svg += `  <rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" ${attrStr} class="svg-element" data-id="${i}"/>\n`
          break
        case 'circle':
          svg += `  <circle cx="${el.cx}" cy="${el.cy}" r="${el.r}" ${attrStr} class="svg-element" data-id="${i}"/>\n`
          break
        case 'polygon':
          if (el.points) {
            svg += `  <polygon points="${el.points}" ${attrStr} class="svg-element" data-id="${i}"/>\n`
          }
          break
        case 'text':
          svg += `  <text x="${el.x}" y="${el.y}" ${attrStr} class="svg-text" data-id="${i}">${el.content || ''}</text>\n`
          break
        case 'line':
          svg += `  <line x1="${el.x1}" y1="${el.y1}" x2="${el.x2}" y2="${el.y2}" ${attrStr} class="svg-element" data-id="${i}"/>\n`
          break
        case 'path':
          svg += `  <path d="${el.d}" ${attrStr} class="svg-element" data-id="${i}"/>\n`
          break
      }
    })
  }

  svg += '</svg>'
  return svg
}

function wrapSvgInHtml(svg, opts) {
  const title = opts.title || 'SVG Map Viewer'
  const zoom = opts.zoom || 1
  const showControls = opts.showControls || false

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      overflow: hidden;
    }

    #container {
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    #header {
      background: #ffffff;
      border-bottom: 1px solid #e5e7eb;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    #title {
      font-weight: 600;
      color: #1f2937;
    }

    #controls {
      display: flex;
      gap: 8px;
    }

    button {
      padding: 8px 12px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }

    button:hover {
      background: #2563eb;
    }

    #viewport {
      flex: 1;
      overflow: auto;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #canvas {
      background: white;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transform-origin: center;
      cursor: grab;
    }

    #canvas:active {
      cursor: grabbing;
    }

    #footer {
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
      padding: 8px 16px;
      font-size: 12px;
      color: #6b7280;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .zoom-indicator {
      background: #ffffff;
      border: 1px solid #d1d5db;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <div id="container">
    <div id="header">
      <div id="title">${title}</div>
      <div id="controls">
        <button onclick="resetZoom()">Reset</button>
        <button onclick="zoomIn()">+ Zoom</button>
        <button onclick="zoomOut()">- Zoom</button>
        <button onclick="downloadSvg()">Download</button>
      </div>
    </div>

    <div id="viewport">
      <svg id="canvas" xmlns="http://www.w3.org/2000/svg">
      </svg>
    </div>

    <div id="footer">
      <span id="info">Ready</span>
      <div class="zoom-indicator"><span id="zoom-level">100%</span></div>
    </div>
  </div>

  <script>
    let currentZoom = ${zoom};
    const canvas = document.getElementById('canvas');
    const info = document.getElementById('info');
    const zoomLevel = document.getElementById('zoom-level');

    // Load SVG
    canvas.innerHTML = \`${svg.replace(/`/g, '\\`')}\`;

    // Pan and zoom
    let isPanning = false;
    let startX, startY, startTransformX = 0, startTransformY = 0;

    canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        isPanning = true;
        startX = e.clientX;
        startY = e.clientY;
        const transform = canvas.style.transform;
        const match = transform.match(/translate\\(([^,]+),\\s*([^)]+)\\)/);
        if (match) {
          startTransformX = parseFloat(match[1]);
          startTransformY = parseFloat(match[2]);
        }
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (isPanning) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        canvas.style.transform = \`translate(\${startTransformX + dx}px, \${startTransformY + dy}px) scale(\${currentZoom})\`;
      }
    });

    document.addEventListener('mouseup', () => {
      isPanning = false;
    });

    // Scroll zoom
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        currentZoom = Math.min(currentZoom + 0.1, 5);
      } else {
        currentZoom = Math.max(currentZoom - 0.1, 0.5);
      }
      updateZoom();
    });

    function updateZoom() {
      zoomLevel.textContent = Math.round(currentZoom * 100) + '%';
      canvas.style.transform = \`scale(\${currentZoom})\`;
    }

    function zoomIn() {
      currentZoom = Math.min(currentZoom + 0.2, 5);
      updateZoom();
    }

    function zoomOut() {
      currentZoom = Math.max(currentZoom - 0.2, 0.5);
      updateZoom();
    }

    function resetZoom() {
      currentZoom = 1;
      canvas.style.transform = 'translate(0, 0) scale(1)';
      updateZoom();
    }

    function downloadSvg() {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(canvas);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = '${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.svg';
      link.click();
    }

    // Element info on hover
    document.querySelectorAll('[data-id]').forEach(el => {
      el.addEventListener('mouseover', () => {
        info.textContent = \`Element #\${el.dataset.id} - \${el.tagName}\`;
      });
      el.addEventListener('mouseout', () => {
        info.textContent = 'Ready';
      });
    });

    updateZoom();
  </script>
</body>
</html>`
}

function getStyles() {
  return `
/* SVG Inspector Styles */
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
.container { max-width: 1200px; margin: 0 auto; padding: 20px; }
.header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
.section { background: white; padding: 16px; border-radius: 8px; margin-bottom: 16px; border: 1px solid #e5e7eb; }
.info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
.info-item { padding: 12px; background: #f9fafb; border-radius: 6px; }
.info-label { font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; }
.info-value { font-size: 16px; color: #1f2937; font-weight: 500; margin-top: 4px; font-family: monospace; }
.color-swatch { display: inline-block; width: 20px; height: 20px; border-radius: 4px; border: 1px solid #d1d5db; margin-right: 8px; vertical-align: middle; }
`
}

function getViewerScript() {
  return `
// SVG Viewer Script
const svgContainer = document.querySelector('svg');
let zoom = 1;
let panX = 0;
let panY = 0;

function updateTransform() {
  svgContainer.style.transform = \`translate(\${panX}px, \${panY}px) scale(\${zoom})\`;
}

document.addEventListener('wheel', (e) => {
  if (svgContainer.contains(e.target)) {
    e.preventDefault();
    zoom += e.deltaY > 0 ? -0.1 : 0.1;
    zoom = Math.max(0.5, Math.min(5, zoom));
    updateTransform();
  }
});
`
}

function showHelp() {
  console.log(`
claudient svg-inspector — SVG Map Inspector & Renderer

USAGE
  claudient svg-inspector <command> [file] [options]

COMMANDS
  inspect <file>              Analyze and display map metadata
  render <file>               Convert JSON map to SVG
  export <file>               Export to HTML or SVG
  serve <file>                Start interactive dev server
  validate <file>             Validate map structure
  list                        List available maps
  help                        Show this help message

OPTIONS
  --port <number>             Server port (default: 8080)
  --export-html               Export with HTML viewer wrapper
  --zoom <factor>             Zoom level (default: 1)
  --output <path>             Output file path
  --format <svg|html|json>    Output format
  --width <px>                Canvas width
  --height <px>               Canvas height
  --theme <light|dark>        Color theme
  --show-grid                 Display grid overlay
  --interactive               Launch interactive mode

EXAMPLES
  # Inspect map structure
  claudient svg-inspector inspect map.json

  # Render JSON to SVG
  claudient svg-inspector render map.json --output map.svg

  # Export with interactive viewer
  claudient svg-inspector export map.json --export-html

  # Start dev server on custom port
  claudient svg-inspector serve map.json --port 3000

  # Validate map and check for errors
  claudient svg-inspector validate map.json

  # List all available maps
  claudient svg-inspector list
`)
}
