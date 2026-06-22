# Integration Tests

This directory contains comprehensive integration tests for Claudient's core systems.

## Available Test Suites

### svg-swarm-integration.test.js

**Purpose:** Test SVG visualization of multi-agent swarms with real-time inspection

**What It Tests:**
- SVG map generation from swarm topology
- Interactive inspection of agent nodes
- Real-time updates during sandbox execution
- Performance with 100+ agent topologies
- Event streaming and synchronization

**Key Classes:**
- `SVGSwarmGenerator` - Convert topology to interactive SVG
- `SwarmSandbox` - Multi-agent execution environment simulator
- `SVGInteractiveInspector` - Interactive node inspection

**Test Count:** 24 tests, all passing

**Run Command:**
```bash
npx mocha test/integration/svg-swarm-integration.test.js --timeout 10000
```

**Test Duration:** ~7 seconds

### matrix-svg-integration.test.js

**Purpose:** Test SVG matrix visualization of system dependencies and relationships

**Run Command:**
```bash
npx mocha test/integration/matrix-svg-integration.test.js --timeout 10000
```

## Running All Integration Tests

```bash
# Run all integration tests
npx mocha test/integration/*.test.js --timeout 10000

# Run with verbose output
npx mocha test/integration/*.test.js --timeout 10000 --reporter spec

# Run specific test file
npx mocha test/integration/svg-swarm-integration.test.js --timeout 10000

# Run specific test suite within file
npx mocha test/integration/svg-swarm-integration.test.js --grep "SVG Map Generation"

# Run specific test
npx mocha test/integration/svg-swarm-integration.test.js --grep "generates SVG from valid topology"
```

## Test Organization

```
test/integration/
├── svg-swarm-integration.test.js       # SVG + Swarm tests
├── matrix-svg-integration.test.js      # Matrix visualization tests
├── SVG_SWARM_TEST_SUMMARY.md          # Detailed summary
└── README.md                           # This file
```

## Coverage Summary

| Component | Tests | Status |
|-----------|-------|--------|
| SVG Generation | 5 | ✅ All passing |
| Node Inspection | 5 | ✅ All passing |
| Real-time Updates | 6 | ✅ All passing |
| Performance | 3 | ✅ All passing |
| Event Sync | 2 | ✅ All passing |
| Error Handling | 3 | ✅ All passing |
| **Total** | **24** | **✅ 24/24** |

## Key Test Topics

### SVG Map Generation
- Valid topology conversion to SVG
- Error handling for invalid input
- Circular node layout positioning
- Edge rendering with connections
- Active state highlighting

### Interactive Inspection
- Node data retrieval
- Dynamic state updates
- Null handling for missing nodes
- Selection tracking
- Related node discovery

### Real-time Execution
- Sandbox initialization
- Full execution lifecycle (Assembly → Execution → Validation)
- Event streaming during phases
- SVG updates synchronized with state changes
- Inter-agent message handling
- Completion validation

### Performance
- 100-agent topology SVG generation < 1s
- 50-agent initialization
- 20-agent execution < 8s

### Event Management
- Correct event ordering
- Listener subscription/unsubscription
- Event audit logging

### Error Handling
- Missing agent errors
- Concurrent execution prevention
- Invalid node selection

## Debugging Tests

To add more logging or inspect test behavior:

```bash
# Run with Node inspector
node --inspect-brk ./node_modules/.bin/mocha test/integration/svg-swarm-integration.test.js

# Run single test with logging
npx mocha test/integration/svg-swarm-integration.test.js --grep "generates SVG" --reporter spec
```

## Integration Test Best Practices

1. **Async Tests** - Use `async/await` with proper timeout settings
2. **Cleanup** - Tests use `beforeEach` to reset state
3. **Mocking** - Mock implementations simulate real behavior
4. **Performance** - Tests include timing assertions
5. **Logging** - Full audit trail available via `getStats()`

## Adding New Tests

Template for adding new integration tests:

```javascript
it('should test new behavior', async function() {
  this.timeout(5000);  // Set appropriate timeout

  // Setup
  const component = new MyComponent();
  
  // Execute
  const result = await component.doSomething();
  
  // Assert
  assert(result, 'Should have result');
});
```

## Continuous Integration

These tests are designed to run in CI/CD pipelines:
- No external dependencies required
- Deterministic results
- Clear pass/fail status
- Execution time < 10s
- No file I/O side effects

## Related Documentation

- [SVG Swarm Test Summary](./SVG_SWARM_TEST_SUMMARY.md)
- [SwarmApp Component](../site/src/components/os/apps/SwarmApp.tsx)
- [Test Architecture](./svg-swarm-integration.test.js)

## Troubleshooting

**Tests timing out:**
- Increase `--timeout` value for slower machines
- Check for async operation delays

**Random failures:**
- Check for race conditions in event listeners
- Verify sandbox state machine logic
- Review timing of phase transitions

**Performance issues:**
- Profile with large agent counts
- Check SVG generation performance
- Monitor event listener overhead
