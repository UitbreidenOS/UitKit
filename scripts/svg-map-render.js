#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const CWD = process.cwd();
const CLAUDE_DIR = path.join(CWD, '.claude');
const COB_MAP_PATH = path.join(CLAUDE_DIR, 'codebase-map.json');

// Color constants
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const MAGENTA = '\x1b[35m';
const RESET = '\x1b[0m';

function loadCodebaseMap() {
  if (!fs.existsSync(COB_MAP_PATH)) {
    throw new Error(`Codebase map not found at ${COB_MAP_PATH}`);
  }
  try {
    return JSON.parse(fs.readFileSync(COB_MAP_PATH, 'utf-8'));
  } catch (e) {
    throw new Error(`Failed to parse codebase-map.json: ${e.message}`);
  }
}

function getFileExtension(filePath) {
  const ext = path.extname(filePath);
  return ext || 'unknown';
}

function getFileColor(ext) {
  const colorMap = {
    '.js': '#FFC107',
    '.ts': '#2196F3',
    '.tsx': '#1976D2',
    '.py': '#3776AB',
    '.json': '#FF6B6B',
    '.md': '#4CAF50',
  };
  return colorMap[ext] || '#9E9E9E';
}

function calculateLayoutDagre(nodes, edges) {
  const nodeMap = {};
  nodes.forEach(n => {
    nodeMap[n.id] = {
      ...n,
      x: Math.random() * 800,
      y: Math.random() * 600,
      vx: 0,
      vy: 0,
      fixed: false
    };
  });

  const edgeList = edges.map(e => ({
    source: nodeMap[e.source],
    target: nodeMap[e.target],
    distance: 120
  })).filter(e => e.source && e.target);

  const K = 150;
  const REPULSION = 500;
  const DAMPING = 0.85;
  const ITERATIONS = 50;

  for (let iter = 0; iter < ITERATIONS; iter++) {
    const forces = {};
    Object.keys(nodeMap).forEach(id => {
      forces[id] = { fx: 0, fy: 0 };
    });

    Object.keys(nodeMap).forEach(id1 => {
      Object.keys(nodeMap).forEach(id2 => {
        if (id1 === id2) return;
        const n1 = nodeMap[id1];
        const n2 = nodeMap[id2];
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const repForce = REPULSION / (dist * dist);

        forces[id1].fx -= (dx / dist) * repForce;
        forces[id1].fy -= (dy / dist) * repForce;
      });
    });

    edgeList.forEach(edge => {
      const dx = edge.target.x - edge.source.x;
      const dy = edge.target.y - edge.source.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const attractForce = (dist * dist) / K;

      forces[edge.source.id].fx += (dx / dist) * attractForce;
      forces[edge.source.id].fy += (dy / dist) * attractForce;

      forces[edge.target.id].fx -= (dx / dist) * attractForce;
      forces[edge.target.id].fy -= (dy / dist) * attractForce;
    });

    Object.keys(nodeMap).forEach(id => {
      const n = nodeMap[id];
      if (n.fixed) return;
      const f = forces[id];
      n.vx = (n.vx + f.fx) * DAMPING;
      n.vy = (n.vy + f.fy) * DAMPING;
      n.x = Math.max(10, Math.min(990, n.x + n.vx));
      n.y = Math.max(10, Math.min(790, n.y + n.vy));
    });
  }

  return nodeMap;
}

function generateSVG(nodes, edges, outputPath) {
  const nodeMap = calculateLayoutDagre(nodes, edges);
  const WIDTH = 1200;
  const HEIGHT = 800;
  const PADDING = 40;

  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <style>
      .node { cursor: pointer; user-select: none; }
      .node-circle { transition: r 0.2s, stroke-width 0.2s; }
      .node-circle:hover { r: 18; stroke-width: 3; }
      .node-label { font-size: 11px; font-family: monospace; pointer-events: none; }
      .edge { stroke: #999; stroke-width: 1.5; fill: none; opacity: 0.6; }
      .edge.highlight { stroke: #FF5722; stroke-width: 2.5; opacity: 1; }
      .controls { font-family: Arial, sans-serif; font-size: 13px; }
      .info-panel { background: #f5f5f5; border: 1px solid #ddd; padding: 10px; border-radius: 4px; }
      text.info { font-family: monospace; font-size: 12px; }
      .zoom-controls { cursor: pointer; }
    </style>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#999" />
    </marker>
    <marker id="arrowhead-highlight" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#FF5722" />
    </marker>
  </defs>

  <!-- Background (for pan/zoom interaction) -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="white" id="bg" />

  <!-- SVG Group for pan/zoom -->
  <g id="viewport">
    <!-- Edges -->
`;

  edges.forEach(edge => {
    const source = nodeMap[edge.source];
    const target = nodeMap[edge.target];
    if (source && target) {
      svg += `    <line class="edge" x1="${source.x}" y1="${source.y}" x2="${target.x}" y2="${target.y}" marker-end="url(#arrowhead)" />\n`;
    }
  });

  svg += `
    <!-- Nodes -->
`;

  nodes.forEach(node => {
    const pos = nodeMap[node.id];
    const ext = getFileExtension(node.id);
    const color = getFileColor(ext);
    const label = node.label || path.basename(node.id);

    svg += `    <g class="node" data-id="${node.id}" data-label="${label}" data-type="${node.type || 'file'}" data-ext="${ext}">
      <circle class="node-circle" cx="${pos.x}" cy="${pos.y}" r="12" fill="${color}" stroke="#333" stroke-width="1.5" />
      <text class="node-label" x="${pos.x}" y="${pos.y + 20}" text-anchor="middle">${label}</text>
    </g>
`;
  });

  svg += `
  </g>

  <!-- Controls & Info Panel -->
  <g class="controls">
    <rect x="10" y="10" width="280" height="120" fill="white" stroke="#ccc" stroke-width="1" rx="4" />
    <text class="info" x="20" y="28"><tspan font-weight="bold">SVG Map Render</tspan></text>
    <text class="info" x="20" y="48">
      <tspan>Nodes: ${nodes.length} | Edges: ${edges.length}</tspan>
    </text>
    <text class="info" x="20" y="65">
      <tspan>Click node for details</tspan>
    </text>
    <text class="info zoom-controls" x="20" y="82">
      <tspan fill="#2196F3" font-weight="bold">+ Zoom In</tspan>
      <tspan x="120" fill="#2196F3" font-weight="bold">- Zoom Out</tspan>
    </text>
    <text class="info" x="20" y="102" fill="#666">
      <tspan>Scroll to pan • Double-click to reset</tspan>
    </text>
  </g>

  <!-- Info Box (hidden by default) -->
  <rect id="infoBox" x="10" y="150" width="320" height="200" fill="white" stroke="#2196F3" stroke-width="2" rx="4" display="none" />
  <text id="infoTitle" class="info" x="20" y="175" font-weight="bold" display="none"></text>
  <text id="infoBody" class="info" x="20" y="200" display="none"></text>

  <!-- JavaScript interaction handler (inline) -->
  <script type="text/javascript"><![CDATA[
(function() {
  let scale = 1;
  let panX = 0;
  let panY = 0;
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 3;
  const viewport = document.getElementById('viewport');
  const bg = document.getElementById('bg');
  const infoBox = document.getElementById('infoBox');
  const infoTitle = document.getElementById('infoTitle');
  const infoBody = document.getElementById('infoBody');

  function updateTransform() {
    viewport.setAttribute('transform', \`translate(\${panX}, \${panY}) scale(\${scale})\`);
  }

  function showInfo(nodeId, label, ext) {
    infoTitle.textContent = label;
    infoBody.textContent = \`ID: \${nodeId}\\nExt: \${ext}\`;
    infoTitle.setAttribute('display', 'inline');
    infoBody.setAttribute('display', 'inline');
    infoBox.setAttribute('display', 'inline');
  }

  function hideInfo() {
    infoBox.setAttribute('display', 'none');
    infoTitle.setAttribute('display', 'none');
    infoBody.setAttribute('display', 'none');
  }

  // Node click handler
  document.querySelectorAll('.node').forEach(node => {
    node.addEventListener('click', function(e) {
      e.stopPropagation();
      const nodeId = this.getAttribute('data-id');
      const label = this.getAttribute('data-label');
      const ext = this.getAttribute('data-ext');
      showInfo(nodeId, label, ext);
    });
  });

  // Zoom controls
  document.querySelectorAll('.zoom-controls tspan').forEach((tspan, idx) => {
    tspan.addEventListener('click', function() {
      if (idx === 0) {
        scale = Math.min(scale + 0.2, MAX_SCALE);
      } else {
        scale = Math.max(scale - 0.2, MIN_SCALE);
      }
      updateTransform();
    });
  });

  // Mouse wheel zoom
  bg.addEventListener('wheel', function(e) {
    e.preventDefault();
    const oldScale = scale;
    scale += (e.deltaY > 0 ? -0.1 : 0.1);
    scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));
    updateTransform();
  });

  // Pan on drag
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };

  bg.addEventListener('mousedown', function(e) {
    isDragging = true;
    dragStart = { x: e.clientX - panX, y: e.clientY - panY };
    hideInfo();
  });

  document.addEventListener('mousemove', function(e) {
    if (isDragging) {
      panX = e.clientX - dragStart.x;
      panY = e.clientY - dragStart.y;
      updateTransform();
    }
  });

  document.addEventListener('mouseup', function() {
    isDragging = false;
  });

  // Double-click to reset
  bg.addEventListener('dblclick', function() {
    scale = 1;
    panX = 0;
    panY = 0;
    updateTransform();
    hideInfo();
  });
})();
  ]]></script>
</svg>`;

  return svg;
}

function main() {
  const args = process.argv.slice(2);
  let outputPath = path.join(CLAUDE_DIR, 'codebase-map.svg');

  if (args.length > 0 && !args[0].startsWith('-')) {
    outputPath = args[0];
  }

  try {
    console.log(`${BOLD}${CYAN}Loading codebase map...${RESET}`);
    const { nodes, edges } = loadCodebaseMap();

    if (!nodes || !edges || nodes.length === 0) {
      console.log(`${RED}Error: Invalid codebase map structure or empty nodes.${RESET}`);
      process.exit(1);
    }

    console.log(`${BOLD}Generating SVG visualization...${RESET}`);
    console.log(`  Nodes: ${CYAN}${nodes.length}${RESET}`);
    console.log(`  Edges: ${CYAN}${edges.length}${RESET}`);

    const svg = generateSVG(nodes, edges, outputPath);

    if (!fs.existsSync(CLAUDE_DIR)) {
      fs.mkdirSync(CLAUDE_DIR, { recursive: true });
    }

    fs.writeFileSync(outputPath, svg, 'utf-8');

    console.log(`${BOLD}${GREEN}✓${RESET} SVG map generated successfully\n`);
    console.log(`${BOLD}Output:${RESET} ${YELLOW}${outputPath}${RESET}\n`);
    console.log(`${BOLD}Features:${RESET}`);
    console.log(`  • Pan: Click & drag on background`);
    console.log(`  • Zoom: Mouse wheel or +/- controls`);
    console.log(`  • Reset: Double-click background`);
    console.log(`  • Details: Click any node to show info\n`);
  } catch (e) {
    console.error(`${RED}Error: ${e.message}${RESET}`);
    process.exit(1);
  }
}

main();
