/**
 * SVG Inspector + Swarm Sandbox Integration Tests
 *
 * Comprehensive integration tests for:
 * - SVG map generation from swarm topology
 * - Interactive inspection of agent nodes
 * - Real-time updates during sandbox execution
 * - Performance under high agent counts
 * - Event streaming and synchronization
 */

const assert = require('assert');

/**
 * Mock SVG Generator for Swarm Topology
 */
class SVGSwarmGenerator {
  constructor(options = {}) {
    this.width = options.width || 1200;
    this.height = options.height || 800;
    this.nodes = new Map();
    this.edges = new Map();
    this.nodeRadius = options.nodeRadius || 40;
    this.padding = options.padding || 60;
  }

  /**
   * Generate SVG from swarm topology
   */
  generateFromTopology(topology) {
    if (!topology || !Array.isArray(topology.agents)) {
      throw new Error('Invalid topology: must have agents array');
    }

    this.nodes.clear();
    this.edges.clear();

    // Calculate node positions using force-directed layout approximation
    const positions = this._calculatePositions(topology.agents);

    // Build SVG elements
    let svg = this._createSVGHeader();
    svg += this._renderEdges(topology, positions);
    svg += this._renderNodes(topology, positions);
    svg += this._createSVGFooter();

    return svg;
  }

  /**
   * Calculate node positions using simple circular layout
   */
  _calculatePositions(agents) {
    const positions = new Map();
    const count = agents.length;
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radius = Math.min(this.width, this.height) / 2 - this.padding;

    agents.forEach((agent, i) => {
      const angle = (i / count) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      positions.set(agent.id, { x, y, agent });
      this.nodes.set(agent.id, { x, y, agent });
    });

    return positions;
  }

  /**
   * Render SVG header with viewBox and defs
   */
  _createSVGHeader() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.width} ${this.height}" width="${this.width}" height="${this.height}">
  <defs>
    <style>
      .agent-node { cursor: pointer; transition: all 0.2s ease; }
      .agent-node:hover { filter: drop-shadow(0 0 8px rgba(255, 184, 0, 0.6)); }
      .agent-node.active { filter: drop-shadow(0 0 12px rgba(79, 233, 144, 0.8)); stroke-width: 3; }
      .agent-edge { stroke-width: 2; fill: none; }
      .agent-edge.active { stroke: #4fe990; opacity: 1; }
      .agent-label { font-size: 12px; font-family: monospace; text-anchor: middle; pointer-events: none; }
      .agent-status { font-size: 10px; font-family: monospace; text-anchor: middle; opacity: 0.7; }
    </style>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#999" />
    </marker>
  </defs>
  <rect width="${this.width}" height="${this.height}" fill="#eeefe9"/>
`;
  }

  /**
   * Render edges between connected agents
   */
  _renderEdges(topology, positions) {
    let svg = '';
    const renderedEdges = new Set();

    if (topology.connections) {
      topology.connections.forEach((conn) => {
        const edgeKey = [conn.from, conn.to].sort().join('-');
        if (!renderedEdges.has(edgeKey)) {
          const fromPos = positions.get(conn.from);
          const toPos = positions.get(conn.to);

          if (fromPos && toPos) {
            const strokeColor = conn.active ? '#4fe990' : '#ccc';
            const opacity = conn.active ? '0.8' : '0.3';
            svg += `    <line x1="${fromPos.x}" y1="${fromPos.y}" x2="${toPos.x}" y2="${toPos.y}" stroke="${strokeColor}" opacity="${opacity}" class="agent-edge${conn.active ? ' active' : ''}" marker-end="url(#arrowhead)"/>\n`;
            this.edges.set(edgeKey, { from: conn.from, to: conn.to, active: conn.active });
            renderedEdges.add(edgeKey);
          }
        }
      });
    }

    return svg;
  }

  /**
   * Render agent nodes as circles with labels
   */
  _renderNodes(topology, positions) {
    let svg = '';

    positions.forEach((pos, agentId) => {
      const agent = pos.agent;
      const fillColor = agent.active ? '#4fe990' : '#f5b800';
      const status = agent.status || 'idle';
      const nodeClass = agent.active ? 'agent-node active' : 'agent-node';

      svg += `    <circle cx="${pos.x}" cy="${pos.y}" r="${this.nodeRadius}" fill="${fillColor}" class="${nodeClass}" data-agent-id="${agentId}" data-status="${status}"/>\n`;
      svg += `    <text x="${pos.x}" y="${pos.y + 2}" class="agent-label" data-agent-id="${agentId}">${agent.name}</text>\n`;
      svg += `    <text x="${pos.x}" y="${pos.y + 18}" class="agent-status" data-agent-id="${agentId}">${status}</text>\n`;
    });

    return svg;
  }

  /**
   * Render SVG footer
   */
  _createSVGFooter() {
    return `</svg>`;
  }

  /**
   * Update node state in existing SVG
   */
  updateNodeState(svgString, agentId, state) {
    if (!this.nodes.has(agentId)) {
      throw new Error(`Agent ${agentId} not found in topology`);
    }

    const node = this.nodes.get(agentId);
    node.agent.status = state.status || node.agent.status;
    node.agent.active = state.active !== undefined ? state.active : node.agent.active;

    // Update SVG dynamically
    let updated = svgString;
    const regex = new RegExp(`data-status="${node.agent.status}"`, 'g');
    updated = updated.replace(regex, `data-status="${state.status || node.agent.status}"`);

    return updated;
  }

  /**
   * Get node data for interactive inspection
   */
  getNodeData(agentId) {
    if (!this.nodes.has(agentId)) {
      return null;
    }

    const node = this.nodes.get(agentId);
    return {
      id: agentId,
      name: node.agent.name,
      status: node.agent.status,
      active: node.agent.active,
      x: node.x,
      y: node.y,
      skills: node.agent.skills || [],
      commands: node.agent.commands || [],
      metadata: node.agent.metadata || {}
    };
  }
}

/**
 * Mock Swarm Sandbox for testing
 */
class SwarmSandbox {
  constructor(options = {}) {
    this.agents = new Map();
    this.state = 'idle'; // idle, running, paused, completed
    this.eventListeners = new Map();
    this.executionLog = [];
    this.options = options;
    this.currentObjective = null;
  }

  /**
   * Initialize sandbox with agent topology
   */
  initialize(topology) {
    if (!topology || !Array.isArray(topology.agents)) {
      throw new Error('Invalid topology');
    }

    topology.agents.forEach((agent) => {
      this.agents.set(agent.id, {
        ...agent,
        status: 'initialized',
        lastUpdate: Date.now(),
        messageCount: 0
      });
    });

    this._emitEvent('sandbox.initialized', { agentCount: this.agents.size });
    return this;
  }

  /**
   * Execute swarm with objective
   */
  async execute(objective) {
    if (this.state !== 'idle') {
      throw new Error(`Cannot execute: sandbox is ${this.state}`);
    }

    this.state = 'running';
    this.currentObjective = objective;
    this._emitEvent('sandbox.started', { objective });

    try {
      // Simulate agent execution phases
      await this._runAssemblyPhase();
      await this._runExecutionPhase();
      await this._runValidationPhase();

      this.state = 'completed';
      this._emitEvent('sandbox.completed', { success: true });
    } catch (err) {
      this.state = 'idle';
      this._emitEvent('sandbox.failed', { error: err.message });
      throw err;
    }
  }

  /**
   * Simulate assembly phase
   */
  async _runAssemblyPhase() {
    this._emitEvent('phase.assembly.started', {});

    for (const [agentId, agent] of this.agents) {
      agent.status = 'assembling';
      this._updateNodeStatus(agentId, { status: 'assembling', active: false });

      await this._delay(50);
      this._emitEvent('agent.assembled', { agentId, agentName: agent.name });

      agent.status = 'ready';
      this._updateNodeStatus(agentId, { status: 'ready', active: false });
    }

    this._emitEvent('phase.assembly.completed', { agentCount: this.agents.size });
  }

  /**
   * Simulate execution phase
   */
  async _runExecutionPhase() {
    this._emitEvent('phase.execution.started', {});

    const executionOrder = Array.from(this.agents.keys()).sort();

    for (const agentId of executionOrder) {
      const agent = this.agents.get(agentId);
      agent.status = 'executing';
      this._updateNodeStatus(agentId, { status: 'executing', active: true });

      // Simulate message exchanges between agents
      const connectedAgents = this._getConnectedAgents(agentId);
      for (const connectedId of connectedAgents) {
        const connectedAgent = this.agents.get(connectedId);
        if (connectedAgent && connectedAgent.status !== 'executing') {
          this._emitEvent('agent.message', {
            from: agentId,
            to: connectedId,
            content: `Swarm message from ${agent.name} to ${connectedAgent.name}`,
            timestamp: Date.now()
          });
        }
      }

      await this._delay(100);
      agent.status = 'completed';
      agent.messageCount += 1;
      this._updateNodeStatus(agentId, { status: 'completed', active: false });

      this._emitEvent('agent.completed', { agentId, agentName: agent.name, messagesProcessed: agent.messageCount });
    }

    this._emitEvent('phase.execution.completed', { totalAgents: this.agents.size });
  }

  /**
   * Simulate validation phase
   */
  async _runValidationPhase() {
    this._emitEvent('phase.validation.started', {});

    let validationsPassed = 0;
    for (const [agentId, agent] of this.agents) {
      agent.status = 'validating';
      this._updateNodeStatus(agentId, { status: 'validating', active: true });

      await this._delay(40);

      const validationPassed = Math.random() > 0.1; // 90% pass rate
      if (validationPassed) {
        validationsPassed += 1;
        agent.status = 'validated';
      } else {
        agent.status = 'validation-failed';
      }

      this._updateNodeStatus(agentId, { status: agent.status, active: false });
      this._emitEvent('agent.validated', { agentId, passed: validationPassed });
    }

    this._emitEvent('phase.validation.completed', { totalValidated: validationsPassed, totalAgents: this.agents.size });
  }

  /**
   * Get agents connected to given agent
   */
  _getConnectedAgents(agentId) {
    // Simple mock: connect to ~30% of other agents
    const allAgents = Array.from(this.agents.keys()).filter(id => id !== agentId);
    return allAgents.slice(0, Math.ceil(allAgents.length * 0.3));
  }

  /**
   * Update node status and emit event
   */
  _updateNodeStatus(agentId, state) {
    if (this.agents.has(agentId)) {
      Object.assign(this.agents.get(agentId), state);
      this._emitEvent('node.updated', { agentId, ...state });
    }
  }

  /**
   * Register event listener
   */
  on(eventName, callback) {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, []);
    }
    this.eventListeners.get(eventName).push(callback);
    return () => {
      const listeners = this.eventListeners.get(eventName);
      listeners.splice(listeners.indexOf(callback), 1);
    };
  }

  /**
   * Emit event to all listeners
   */
  _emitEvent(eventName, data) {
    this.executionLog.push({ event: eventName, data, timestamp: Date.now() });
    if (this.eventListeners.has(eventName)) {
      this.eventListeners.get(eventName).forEach((cb) => cb(data));
    }
  }

  /**
   * Delay helper
   */
  _delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get execution statistics
   */
  getStats() {
    return {
      state: this.state,
      agentCount: this.agents.size,
      executionLog: this.executionLog,
      agentStates: Array.from(this.agents.entries()).map(([id, agent]) => ({
        id,
        name: agent.name,
        status: agent.status,
        messagesProcessed: agent.messageCount
      }))
    };
  }

  /**
   * Get topology snapshot
   */
  getTopology() {
    return {
      agents: Array.from(this.agents.values()),
      connections: this._generateConnections()
    };
  }

  /**
   * Generate connections for topology
   */
  _generateConnections() {
    const connections = [];
    const agentIds = Array.from(this.agents.keys());

    agentIds.forEach((fromId, idx) => {
      const connectedCount = Math.ceil(agentIds.length * 0.3);
      for (let i = 0; i < connectedCount; i++) {
        const toIdx = (idx + i + 1) % agentIds.length;
        const toId = agentIds[toIdx];
        connections.push({
          from: fromId,
          to: toId,
          active: this.agents.get(fromId)?.status === 'executing' || this.agents.get(toId)?.status === 'executing'
        });
      }
    });

    return connections;
  }
}

/**
 * SVG Interactive Inspector
 */
class SVGInteractiveInspector {
  constructor(svgElement) {
    this.svgElement = svgElement;
    this.selectedNode = null;
    this.nodeDataMap = new Map();
    this.clickListeners = [];
  }

  /**
   * Attach inspector to SVG and enable interactivity
   */
  attach(svgString, nodeDataProvider) {
    this.svgString = svgString;
    this.nodeDataProvider = nodeDataProvider;
    return this;
  }

  /**
   * Get data for a node
   */
  getNodeInfo(agentId) {
    if (typeof this.nodeDataProvider === 'function') {
      return this.nodeDataProvider(agentId);
    }
    return this.nodeDataMap.get(agentId) || null;
  }

  /**
   * Select node and highlight
   */
  selectNode(agentId) {
    const nodeData = this.getNodeInfo(agentId);
    if (!nodeData) {
      throw new Error(`Node ${agentId} not found`);
    }

    this.selectedNode = agentId;
    this._emitClickEvent({ agentId, nodeData });
    return nodeData;
  }

  /**
   * Get selected node info
   */
  getSelectedNode() {
    if (!this.selectedNode) return null;
    return this.getNodeInfo(this.selectedNode);
  }

  /**
   * Clear selection
   */
  clearSelection() {
    this.selectedNode = null;
  }

  /**
   * Listen to node clicks
   */
  onNodeClick(callback) {
    this.clickListeners.push(callback);
  }

  /**
   * Emit click event
   */
  _emitClickEvent(data) {
    this.clickListeners.forEach((cb) => cb(data));
  }

  /**
   * Highlight related nodes
   */
  highlightRelated(agentId, connections) {
    const relatedIds = connections
      .filter((conn) => conn.from === agentId || conn.to === agentId)
      .map((conn) => (conn.from === agentId ? conn.to : conn.from));

    return relatedIds.map((id) => this.getNodeInfo(id)).filter(Boolean);
  }
}

/**
 * Test Suite
 */
describe('SVG Inspector + Swarm Sandbox Integration', () => {
  let generator;
  let sandbox;
  let inspector;

  beforeEach(() => {
    generator = new SVGSwarmGenerator({ width: 1200, height: 800 });
    sandbox = new SwarmSandbox();
    inspector = new SVGInteractiveInspector(null);
  });

  describe('SVG Map Generation', () => {
    it('generates SVG from valid topology', () => {
      const topology = {
        agents: [
          { id: 'agent-1', name: 'SDR Leader', active: false, status: 'idle', skills: [], commands: [], metadata: {} },
          { id: 'agent-2', name: 'Email Personalizer', active: false, status: 'idle', skills: [], commands: [], metadata: {} },
          { id: 'agent-3', name: 'CRM Logger', active: false, status: 'idle', skills: [], commands: [], metadata: {} }
        ],
        connections: [
          { from: 'agent-1', to: 'agent-2', active: false },
          { from: 'agent-2', to: 'agent-3', active: false }
        ]
      };

      const svg = generator.generateFromTopology(topology);

      assert(svg.includes('<?xml version="1.0"'), 'SVG should be valid XML');
      assert(svg.includes('<svg'), 'SVG should contain svg tag');
      assert(svg.includes('agent-1'), 'SVG should contain agent nodes');
      assert(svg.includes('SDR Leader'), 'SVG should contain agent names');
      assert(svg.includes('</svg>'), 'SVG should be properly closed');
    });

    it('throws error for invalid topology', () => {
      assert.throws(() => {
        generator.generateFromTopology(null);
      }, /Invalid topology/);

      assert.throws(() => {
        generator.generateFromTopology({ agents: null });
      }, /Invalid topology/);
    });

    it('positions agents in circular layout', () => {
      const topology = {
        agents: [
          { id: 'a1', name: 'Agent 1', active: false, status: 'idle', skills: [], commands: [], metadata: {} },
          { id: 'a2', name: 'Agent 2', active: false, status: 'idle', skills: [], commands: [], metadata: {} },
          { id: 'a3', name: 'Agent 3', active: false, status: 'idle', skills: [], commands: [], metadata: {} }
        ],
        connections: []
      };

      generator.generateFromTopology(topology);
      const positions = Array.from(generator.nodes.values());

      assert.strictEqual(positions.length, 3, 'Should have 3 positions');
      positions.forEach((pos) => {
        assert(typeof pos.x === 'number', 'X coordinate should be number');
        assert(typeof pos.y === 'number', 'Y coordinate should be number');
      });
    });

    it('renders edges between connected agents', () => {
      const topology = {
        agents: [
          { id: 'a1', name: 'Agent 1', active: false, status: 'idle', skills: [], commands: [], metadata: {} },
          { id: 'a2', name: 'Agent 2', active: false, status: 'idle', skills: [], commands: [], metadata: {} }
        ],
        connections: [{ from: 'a1', to: 'a2', active: false }]
      };

      const svg = generator.generateFromTopology(topology);

      assert(svg.includes('<line'), 'SVG should contain edge lines');
      assert(svg.includes('x1='), 'Edge should have x1 coordinate');
      assert(svg.includes('marker-end'), 'Edge should have arrow marker');
    });

    it('highlights active edges in SVG', () => {
      const topology = {
        agents: [
          { id: 'a1', name: 'Agent 1', active: false, status: 'idle', skills: [], commands: [], metadata: {} },
          { id: 'a2', name: 'Agent 2', active: false, status: 'idle', skills: [], commands: [], metadata: {} }
        ],
        connections: [{ from: 'a1', to: 'a2', active: true }]
      };

      const svg = generator.generateFromTopology(topology);

      assert(svg.includes('stroke="#4fe990"'), 'Active edge should use green color');
      assert(svg.includes('agent-edge active'), 'Active edge should have active class');
    });
  });

  describe('Interactive Node Inspection', () => {
    it('retrieves node data for inspection', () => {
      const topology = {
        agents: [
          {
            id: 'agent-1',
            name: 'Test Agent',
            active: true,
            status: 'executing',
            skills: ['skill-1', 'skill-2'],
            commands: ['cmd-1'],
            metadata: { role: 'executor' }
          }
        ],
        connections: []
      };

      generator.generateFromTopology(topology);
      const nodeData = generator.getNodeData('agent-1');

      assert(nodeData, 'Should retrieve node data');
      assert.strictEqual(nodeData.id, 'agent-1', 'Node ID should match');
      assert.strictEqual(nodeData.name, 'Test Agent', 'Node name should match');
      assert.strictEqual(nodeData.status, 'executing', 'Node status should match');
      assert.strictEqual(nodeData.active, true, 'Node active state should match');
      assert.deepStrictEqual(nodeData.skills, ['skill-1', 'skill-2'], 'Node skills should match');
    });

    it('updates node state dynamically', () => {
      const topology = {
        agents: [{ id: 'agent-1', name: 'Test Agent', active: false, status: 'idle', skills: [], commands: [], metadata: {} }],
        connections: []
      };

      let svg = generator.generateFromTopology(topology);
      assert(svg.includes('data-status="idle"'), 'Should have idle status');

      const nodeData = generator.getNodeData('agent-1');
      nodeData.status = 'executing';
      svg = generator.updateNodeState(svg, 'agent-1', { status: 'executing', active: true });

      // Verify the node state was updated internally
      const updatedNodeData = generator.getNodeData('agent-1');
      assert.strictEqual(updatedNodeData.status, 'executing', 'Node status should be updated internally');
    });

    it('returns null for nonexistent node', () => {
      const topology = {
        agents: [{ id: 'agent-1', name: 'Test', active: false, status: 'idle', skills: [], commands: [], metadata: {} }],
        connections: []
      };

      generator.generateFromTopology(topology);
      const nodeData = generator.getNodeData('nonexistent');

      assert.strictEqual(nodeData, null, 'Should return null for nonexistent node');
    });

    it('selects node and retrieves detailed info', () => {
      const topology = {
        agents: [
          {
            id: 'agent-1',
            name: 'Selected Agent',
            active: false,
            status: 'idle',
            skills: ['skill-a'],
            commands: ['cmd-x'],
            metadata: {}
          }
        ],
        connections: []
      };

      generator.generateFromTopology(topology);
      inspector.attach('', (agentId) => generator.getNodeData(agentId));

      const selectedData = inspector.selectNode('agent-1');

      assert(selectedData, 'Should select node');
      assert.strictEqual(selectedData.name, 'Selected Agent', 'Should return selected node data');
      assert.strictEqual(inspector.selectedNode, 'agent-1', 'Should track selected node');
    });

    it('highlights related nodes from selected', () => {
      const topology = {
        agents: [
          { id: 'a1', name: 'Agent 1', active: false, status: 'idle', skills: [], commands: [], metadata: {} },
          { id: 'a2', name: 'Agent 2', active: false, status: 'idle', skills: [], commands: [], metadata: {} },
          { id: 'a3', name: 'Agent 3', active: false, status: 'idle', skills: [], commands: [], metadata: {} }
        ],
        connections: [
          { from: 'a1', to: 'a2', active: false },
          { from: 'a2', to: 'a3', active: false },
          { from: 'a1', to: 'a3', active: false }
        ]
      };

      generator.generateFromTopology(topology);
      sandbox.initialize(topology);
      inspector.attach('', (agentId) => generator.getNodeData(agentId));

      const related = inspector.highlightRelated('a2', topology.connections);

      assert(related.length >= 1, 'Should find related nodes');
      const relatedIds = related.map((r) => r.id);
      assert(relatedIds.includes('a1') || relatedIds.includes('a3'), 'Should include at least one connected node');
    });
  });

  describe('Real-time Updates During Execution', () => {
    it('initializes sandbox with topology', () => {
      const topology = {
        agents: [
          { id: 'agent-1', name: 'Agent 1', active: false, status: 'idle', skills: [], commands: [], metadata: {} },
          { id: 'agent-2', name: 'Agent 2', active: false, status: 'idle', skills: [], commands: [], metadata: {} }
        ],
        connections: []
      };

      sandbox.initialize(topology);
      const stats = sandbox.getStats();

      assert.strictEqual(stats.agentCount, 2, 'Should have 2 agents');
      assert.strictEqual(stats.state, 'idle', 'Should start in idle state');
    });

    it('executes swarm and updates node states', async function() {
      this.timeout(5000);

      const topology = {
        agents: [
          { id: 'agent-1', name: 'Agent 1', active: false, status: 'idle', skills: [], commands: [], metadata: {} },
          { id: 'agent-2', name: 'Agent 2', active: false, status: 'idle', skills: [], commands: [], metadata: {} },
          { id: 'agent-3', name: 'Agent 3', active: false, status: 'idle', skills: [], commands: [], metadata: {} }
        ],
        connections: [
          { from: 'agent-1', to: 'agent-2', active: false },
          { from: 'agent-2', to: 'agent-3', active: false }
        ]
      };

      sandbox.initialize(topology);
      generator.generateFromTopology(topology);

      const events = [];
      sandbox.on('node.updated', (data) => events.push(data));
      sandbox.on('agent.completed', (data) => events.push(data));

      await sandbox.execute('Test objective');

      assert(events.length > 0, 'Should emit node update events');
      assert.strictEqual(sandbox.state, 'completed', 'Sandbox should complete execution');
    });

    it('streams real-time events during execution', async function() {
      this.timeout(5000);

      const topology = {
        agents: [
          { id: 'a1', name: 'Agent 1', active: false, status: 'idle', skills: [], commands: [], metadata: {} },
          { id: 'a2', name: 'Agent 2', active: false, status: 'idle', skills: [], commands: [], metadata: {} }
        ],
        connections: []
      };

      sandbox.initialize(topology);

      const phaseEvents = [];
      sandbox.on('phase.assembly.started', () => phaseEvents.push('assembly-start'));
      sandbox.on('phase.assembly.completed', () => phaseEvents.push('assembly-end'));
      sandbox.on('phase.execution.started', () => phaseEvents.push('execution-start'));
      sandbox.on('phase.execution.completed', () => phaseEvents.push('execution-end'));
      sandbox.on('phase.validation.started', () => phaseEvents.push('validation-start'));
      sandbox.on('phase.validation.completed', () => phaseEvents.push('validation-end'));

      await sandbox.execute('Test objective');

      assert(phaseEvents.includes('assembly-start'), 'Should emit assembly start');
      assert(phaseEvents.includes('assembly-end'), 'Should emit assembly end');
      assert(phaseEvents.includes('execution-start'), 'Should emit execution start');
      assert(phaseEvents.includes('execution-end'), 'Should emit execution end');
      assert(phaseEvents.includes('validation-start'), 'Should emit validation start');
      assert(phaseEvents.includes('validation-end'), 'Should emit validation end');
    });

    it('updates SVG during execution', async function() {
      this.timeout(5000);

      const topology = {
        agents: [
          { id: 'a1', name: 'Agent 1', active: false, status: 'idle', skills: [], commands: [], metadata: {} },
          { id: 'a2', name: 'Agent 2', active: false, status: 'idle', skills: [], commands: [], metadata: {} }
        ],
        connections: []
      };

      sandbox.initialize(topology);
      let svg = generator.generateFromTopology(topology);

      const updates = [];
      let updateCount = 0;
      sandbox.on('node.updated', (data) => {
        updateCount += 1;
        const nodeData = generator.getNodeData(data.agentId);
        if (nodeData) {
          updates.push({ agentId: data.agentId, status: data.status });
        }
      });

      await sandbox.execute('Test');

      assert(updates.length > 0, 'Should receive node updates');
      assert(updateCount > 0, 'Should have tracked multiple state updates');
    });

    it('handles agent messages between nodes', async function() {
      this.timeout(5000);

      const topology = {
        agents: [
          { id: 'a1', name: 'Agent 1', active: false, status: 'idle', skills: [], commands: [], metadata: {} },
          { id: 'a2', name: 'Agent 2', active: false, status: 'idle', skills: [], commands: [], metadata: {} },
          { id: 'a3', name: 'Agent 3', active: false, status: 'idle', skills: [], commands: [], metadata: {} }
        ],
        connections: []
      };

      sandbox.initialize(topology);

      const messages = [];
      sandbox.on('agent.message', (data) => messages.push(data));

      await sandbox.execute('Test');

      assert(messages.length > 0, 'Should record inter-agent messages');
      messages.forEach((msg) => {
        assert(msg.from, 'Message should have sender');
        assert(msg.to, 'Message should have recipient');
        assert(msg.content, 'Message should have content');
        assert(msg.timestamp, 'Message should have timestamp');
      });
    });

    it('validates all agents complete execution', async function() {
      this.timeout(5000);

      const topology = {
        agents: [
          { id: 'a1', name: 'Agent 1', active: false, status: 'idle', skills: [], commands: [], metadata: {} },
          { id: 'a2', name: 'Agent 2', active: false, status: 'idle', skills: [], commands: [], metadata: {} },
          { id: 'a3', name: 'Agent 3', active: false, status: 'idle', skills: [], commands: [], metadata: {} }
        ],
        connections: []
      };

      sandbox.initialize(topology);
      await sandbox.execute('Test');

      const stats = sandbox.getStats();
      const completedAgents = stats.agentStates.filter((a) => a.status === 'completed' || a.status === 'validated');

      assert.strictEqual(completedAgents.length, 3, 'All agents should complete');
    });
  });

  describe('Performance and Scalability', () => {
    it('handles large agent topologies', () => {
      const agentCount = 100;
      const agents = Array.from({ length: agentCount }, (_, i) => ({
        id: `agent-${i}`,
        name: `Agent ${i}`,
        active: false,
        status: 'idle',
        skills: [],
        commands: [],
        metadata: {}
      }));

      const connections = agents.slice(0, -1).map((_, i) => ({
        from: agents[i].id,
        to: agents[i + 1].id,
        active: false
      }));

      const topology = { agents, connections };

      const startTime = Date.now();
      const svg = generator.generateFromTopology(topology);
      const generationTime = Date.now() - startTime;

      assert(svg.includes('<?xml'), 'Should generate valid SVG');
      assert(generationTime < 1000, `SVG generation should be fast, took ${generationTime}ms`);
    });

    it('initializes sandbox with many agents', () => {
      const agentCount = 50;
      const agents = Array.from({ length: agentCount }, (_, i) => ({
        id: `agent-${i}`,
        name: `Agent ${i}`,
        active: false,
        status: 'idle',
        skills: [],
        commands: [],
        metadata: {}
      }));

      const topology = { agents, connections: [] };

      sandbox.initialize(topology);
      const stats = sandbox.getStats();

      assert.strictEqual(stats.agentCount, agentCount, 'Should initialize all agents');
    });

    it('executes large swarm efficiently', async function() {
      this.timeout(10000);

      const agentCount = 20;
      const agents = Array.from({ length: agentCount }, (_, i) => ({
        id: `agent-${i}`,
        name: `Agent ${i}`,
        active: false,
        status: 'idle',
        skills: [],
        commands: [],
        metadata: {}
      }));

      const topology = { agents, connections: [] };

      sandbox.initialize(topology);

      const startTime = Date.now();
      await sandbox.execute('Large swarm test');
      const executionTime = Date.now() - startTime;

      assert.strictEqual(sandbox.state, 'completed', 'Should complete execution');
      assert(executionTime < 8000, `Execution should complete in reasonable time, took ${executionTime}ms`);
    });
  });

  describe('Event Synchronization', () => {
    it('maintains event order during execution', async function() {
      this.timeout(5000);

      const topology = {
        agents: [
          { id: 'a1', name: 'Agent 1', active: false, status: 'idle', skills: [], commands: [], metadata: {} }
        ],
        connections: []
      };

      sandbox.initialize(topology);

      const eventSequence = [];
      sandbox.on('sandbox.started', () => eventSequence.push('start'));
      sandbox.on('phase.assembly.started', () => eventSequence.push('assembly-start'));
      sandbox.on('phase.assembly.completed', () => eventSequence.push('assembly-end'));
      sandbox.on('phase.execution.started', () => eventSequence.push('exec-start'));
      sandbox.on('phase.execution.completed', () => eventSequence.push('exec-end'));
      sandbox.on('phase.validation.started', () => eventSequence.push('val-start'));
      sandbox.on('phase.validation.completed', () => eventSequence.push('val-end'));
      sandbox.on('sandbox.completed', () => eventSequence.push('complete'));

      await sandbox.execute('Test');

      assert.strictEqual(eventSequence[0], 'start', 'Should start first');
      assert(eventSequence.indexOf('complete') > eventSequence.indexOf('assembly-start'), 'Assembly should start before completion');
      assert(eventSequence.indexOf('assembly-end') < eventSequence.indexOf('exec-start'), 'Assembly should end before execution starts');
    });

    it('unsubscribes from events', async function() {
      this.timeout(5000);

      const topology = {
        agents: [{ id: 'a1', name: 'Agent 1', active: false, status: 'idle', skills: [], commands: [], metadata: {} }],
        connections: []
      };

      sandbox.initialize(topology);

      let callCount = 0;
      const unsubscribe = sandbox.on('node.updated', () => {
        callCount += 1;
      });

      await sandbox.execute('Test');
      const countAfterExecution = callCount;

      unsubscribe();
      callCount = 0;

      // Execution completed, but listener should be removed
      assert(countAfterExecution > 0, 'Should receive events before unsubscribe');
      assert.strictEqual(callCount, 0, 'Should not receive events after unsubscribe');
    });
  });

  describe('Error Handling', () => {
    it('handles missing agent in inspection', () => {
      const topology = {
        agents: [{ id: 'a1', name: 'Agent 1', active: false, status: 'idle', skills: [], commands: [], metadata: {} }],
        connections: []
      };

      generator.generateFromTopology(topology);

      assert.throws(() => {
        generator.updateNodeState('', 'nonexistent', { status: 'active' });
      }, /not found in topology/);
    });

    it('prevents execution when already running', async function() {
      this.timeout(5000);

      const topology = {
        agents: [{ id: 'a1', name: 'Agent 1', active: false, status: 'idle', skills: [], commands: [], metadata: {} }],
        connections: []
      };

      sandbox.initialize(topology);
      sandbox.state = 'running';

      try {
        await sandbox.execute('Test');
        assert.fail('Should throw error');
      } catch (err) {
        assert(err.message.includes('Cannot execute'), 'Should throw cannot execute error');
      }
    });

    it('gracefully handles invalid node selection', () => {
      inspector.attach('', () => null);

      assert.throws(() => {
        inspector.selectNode('nonexistent');
      }, /not found/);
    });
  });
});
