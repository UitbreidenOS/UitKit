# SVG Inspector + Swarm Sandbox Integration Tests

## Overview

Comprehensive integration test suite for SVG visualization of multi-agent swarms with real-time inspection and state synchronization.

**File:** `test/integration/svg-swarm-integration.test.js`

**Test Framework:** Mocha + Node.js Assert

**Total Tests:** 24 passing

## Test Suites

### 1. SVG Map Generation (5 tests)

Tests for converting swarm topology into interactive SVG diagrams.

- **generates SVG from valid topology** - Validates SVG XML structure and agent node rendering
- **throws error for invalid topology** - Error handling for malformed input
- **positions agents in circular layout** - Verifies circular force-directed layout positioning
- **renders edges between connected agents** - Tests inter-agent connection visualization
- **highlights active edges in SVG** - Active state styling with color coding (#4fe990 for active)

### 2. Interactive Node Inspection (5 tests)

Tests for detailed inspection of individual agent nodes in the SVG.

- **retrieves node data for inspection** - Get full node metadata (skills, commands, status)
- **updates node state dynamically** - Modify node state during execution
- **returns null for nonexistent node** - Graceful handling of missing agents
- **selects node and retrieves detailed info** - Selection tracking and data retrieval
- **highlights related nodes from selected** - Find connected agents visually

**Key Features:**
- Node selection tracking
- Real-time metadata access
- Related node discovery
- Status monitoring (idle, assembling, executing, validating, completed)

### 3. Real-time Updates During Execution (6 tests)

Tests for synchronization between sandbox execution and SVG visualization.

- **initializes sandbox with topology** - Setup with multi-agent configuration
- **executes swarm and updates node states** - Full execution lifecycle with state changes
- **streams real-time events during execution** - Continuous event emission during phases
- **updates SVG during execution** - SVG reflects state changes in real-time
- **handles agent messages between nodes** - Inter-agent communication tracking
- **validates all agents complete execution** - Completion verification

**Execution Phases Tested:**
1. Assembly Phase - Agent initialization
2. Execution Phase - Distributed processing
3. Validation Phase - Result verification

**Event Types Emitted:**
- `sandbox.initialized` - Sandbox ready
- `sandbox.started` - Execution begins
- `phase.assembly.started/completed` - Assembly phase events
- `phase.execution.started/completed` - Execution phase events
- `phase.validation.started/completed` - Validation phase events
- `agent.assembled` - Agent ready
- `agent.message` - Inter-agent message (from, to, content, timestamp)
- `agent.completed` - Agent finished processing
- `node.updated` - State change event
- `sandbox.completed/failed` - Execution result

### 4. Performance and Scalability (3 tests)

Tests for handling large-scale swarms and execution speed.

- **handles large agent topologies** - 100-agent topology SVG generation (< 1000ms)
- **initializes sandbox with many agents** - 50-agent initialization
- **executes large swarm efficiently** - 20-agent execution (< 8000ms)

**Performance Targets:**
- SVG generation: < 1 second for 100+ nodes
- Initialization: O(n) agent setup time
- Execution: Proportional to agent count and phases

### 5. Event Synchronization (2 tests)

Tests for correct event ordering and listener management.

- **maintains event order during execution** - Events fire in correct sequence
- **unsubscribes from events** - Listener cleanup prevents stale callbacks

**Event Order Validation:**
1. `sandbox.started`
2. `phase.assembly.started`
3. `phase.assembly.completed`
4. `phase.execution.started`
5. `phase.execution.completed`
6. `phase.validation.started`
7. `phase.validation.completed`
8. `sandbox.completed`

### 6. Error Handling (3 tests)

Tests for graceful error handling and edge cases.

- **handles missing agent in inspection** - Update nonexistent agent throws error
- **prevents execution when already running** - State validation prevents concurrent execution
- **gracefully handles invalid node selection** - Selection of missing node throws error

## Implementation Details

### SVGSwarmGenerator Class

Generates SVG visualizations from topology:
- **Input:** Topology object with agents and connections
- **Output:** Valid SVG with styled nodes and edges
- **Layout:** Circular positioning with automatic spacing
- **Styling:** CSS classes for hover effects and active states

**Methods:**
- `generateFromTopology(topology)` - Main generation
- `updateNodeState(svgString, agentId, state)` - State updates
- `getNodeData(agentId)` - Retrieve node info
- `_calculatePositions(agents)` - Layout calculation

### SwarmSandbox Class

Simulates multi-agent execution environment:
- **State Machine:** idle → running → completed/failed
- **Phases:** Assembly → Execution → Validation
- **Events:** Pub/sub event system with unsubscribe
- **Logging:** Full execution audit trail

**Methods:**
- `initialize(topology)` - Setup with agents
- `execute(objective)` - Start execution
- `on(eventName, callback)` - Subscribe to events
- `getStats()` - Execution statistics
- `getTopology()` - Current topology snapshot

### SVGInteractiveInspector Class

Enables interactive inspection of SVG nodes:
- **Selection:** Track selected node
- **Queries:** Get node data via callback
- **Discovery:** Find related connected nodes
- **Events:** Click event emission

**Methods:**
- `attach(svgString, nodeDataProvider)` - Bind to SVG
- `selectNode(agentId)` - Select and inspect
- `getSelectedNode()` - Current selection
- `highlightRelated(agentId, connections)` - Find neighbors
- `onNodeClick(callback)` - Listen to clicks

## Running the Tests

```bash
# Run all integration tests
npx mocha test/integration/svg-swarm-integration.test.js --timeout 10000

# Run specific test suite
npx mocha test/integration/svg-swarm-integration.test.js --grep "SVG Map Generation"

# Run with verbose output
npx mocha test/integration/svg-swarm-integration.test.js --reporter spec --timeout 10000
```

## Test Execution Results

**Total:** 24 tests
**Passed:** 24 ✅
**Failed:** 0
**Duration:** ~7 seconds

**Coverage:**
- ✅ SVG generation from topology
- ✅ Node positioning and layout
- ✅ Edge rendering with styling
- ✅ Interactive node inspection
- ✅ Real-time state updates
- ✅ Event streaming and ordering
- ✅ Multi-agent execution phases
- ✅ Agent-to-agent messaging
- ✅ Performance at scale (100+ agents)
- ✅ Error handling and edge cases
- ✅ Event listener lifecycle
- ✅ Validation and completion tracking

## Architecture Highlights

### Topology Structure
```javascript
{
  agents: [
    {
      id: "agent-1",
      name: "SDR Leader",
      active: false,
      status: "idle",
      skills: ["skill-1", "skill-2"],
      commands: ["cmd-1"],
      metadata: { role: "executor" }
    }
  ],
  connections: [
    { from: "agent-1", to: "agent-2", active: false }
  ]
}
```

### SVG Output Features
- Circular node layout with automatic spacing
- Animated edges with arrow markers
- Hover effects with shadow filters
- Status badges on nodes
- CSS-based styling for active states
- Data attributes for inspection

### Event-Driven Architecture
- Centralized event emitter in sandbox
- Subscribe/unsubscribe listener management
- Ordered phase events for state tracking
- Per-agent status updates
- Message exchange logging
- Completion and failure events

## Future Extensions

Possible enhancements for more comprehensive testing:
1. Load balancing and agent failure scenarios
2. Dynamic topology changes during execution
3. SVG animation of message flow
4. Performance profiling with large messages
5. Network latency simulation
6. Concurrent execution of multiple swarms
7. Persistent execution logs with replay
8. Interactive debugging of agent decisions
9. Resource usage tracking per agent
10. Adaptive layout for graph visualization

## Related Components

- **SwarmApp.tsx** - React UI for swarm visualization
- **CliApp.tsx** - CLI interface for swarm commands
- **Topology definitions** - Agent and connection configuration

## Notes

- Tests run with 10-second timeout for full async execution
- Mock implementations simulate real swarm behavior
- Event ordering is validated for synchronization correctness
- Performance tests include execution time assertions
- All edge cases and error conditions are covered
