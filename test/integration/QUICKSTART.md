# Swarm Matrix Integration Test - Quick Start

## Run All Scenarios

```bash
# Direct execution with visual output
node test/integration/swarm-matrix-integration.test.js

# With color preservation
node test/integration/swarm-matrix-integration.test.js | less -R

# Save output to file
node test/integration/swarm-matrix-integration.test.js > sandbox-output.txt
```

## Run Specific Test Scenarios

The main simulator generates 5 scenarios:

### 1. Successful Initialization
```javascript
const sim = new SwarmSandboxSimulator();
console.log(sim.simulateSuccessfulInit());
```

### 2. Execution Trace with Timing
```javascript
const sim = new SwarmSandboxSimulator();
console.log(sim.simulateExecutionTrace());
```

### 3. Complete Status Summary
```javascript
const sim = new SwarmSandboxSimulator();
console.log(sim.simulateStatusSummary());
```

### 4. Timeout Error with Recovery
```javascript
const sim = new SwarmSandboxSimulator();
console.log(sim.simulateTimeoutError());
```

### 5. Agent Failure with Fallback
```javascript
const sim = new SwarmSandboxSimulator();
console.log(sim.simulateAgentFailure());
```

### 6. Validation Failure with Remediation
```javascript
const sim = new SwarmSandboxSimulator();
console.log(sim.simulateValidationFailure());
```

## Export and Use in Your Code

```javascript
const {
  MatrixThemedCLI,
  SwarmSandboxSimulator,
  MATRIX_COLORS,
  ANSI_CODES
} = require('./test/integration/swarm-matrix-integration.test.js');

// Create a CLI with Matrix theme
const cli = new MatrixThemedCLI();

cli.header('My Custom Output');
cli.success('Operation completed');
cli.error('Something failed');
cli.warning('Proceed with caution');
cli.info('FYI: Important information');

console.log(cli.render());
```

## Matrix Theme Color Reference

```javascript
const MATRIX_COLORS = {
  primary: '#00ff41',        // Neon green
  primaryLight: '#39ff14',   // Bright green
  primaryDark: '#00cc33',    // Dark green
  background: '#0a0e27',     // Deep black
  surface: '#0f1419',        // Surface black
  error: '#ff004d',          // Neon red
  errorLight: '#ff1744',     // Bright red
  success: '#00ff41',        // Green success
  warning: '#ffb700',        // Orange warning
  info: '#00d4ff',           // Cyan info
  text: '#00ff41',           // Green text
  textSecondary: '#00cc33',  // Secondary green
  textTertiary: '#008000',   // Muted green
  border: '#00ff41'          // Green border
};
```

## ANSI Color Codes

```javascript
const ANSI_CODES = {
  RESET: '\x1b[0m',
  BRIGHT: '\x1b[1m',
  DIM: '\x1b[2m',
  GREEN: '\x1b[92m',      // Bright green (#00ff41)
  RED: '\x1b[91m',        // Bright red (#ff004d)
  YELLOW: '\x1b[93m',     // Bright yellow (#ffb700)
  CYAN: '\x1b[96m',       // Bright cyan (#00d4ff)
  BLACK_BG: '\x1b[40m',   // Black background
};
```

## Test Status Symbols

- `✓` - Success (green)
- `✗` - Error (red)
- `⚠` - Warning (yellow)
- `ℹ` - Info (cyan)

## CLI Builder Chaining

```javascript
const cli = new MatrixThemedCLI();

cli
  .header('Build Process')
  .info('Starting compilation...')
  .success('TypeScript compiled')
  .success('Assets bundled')
  .warning('3 lint warnings')
  .divider()
  .header('Test Results')
  .success('47 tests passed')
  .error('2 tests failed')
  .divider();

console.log(cli.render());
```

## Integration with Swarm Sandbox

The test validates that Swarm Sandbox output is properly styled:

1. **Topology validation** - Checks agent connectivity
2. **Dry-run execution** - Simulates multi-agent coordination
3. **Health monitoring** - Tracks latency, errors, queue depth
4. **Error handling** - Tests timeout recovery and fallback paths
5. **Theme styling** - Verifies Matrix colors remain readable

## Performance Metrics

- **Output generation**: < 500ms
- **Large reports (100 agents)**: < 200ms
- **Color code overhead**: < 10% of output

## Accessibility Checklist

- [x] Color contrast meets WCAG AA standards
- [x] Status indicated by symbol + text, not color alone
- [x] Output readable without ANSI codes
- [x] Error messages include descriptions
- [x] Timing information clearly formatted

## Common Issues

**Colors not showing?**
```bash
# Use less with color preservation
node test/integration/swarm-matrix-integration.test.js | less -R

# Or use cat with explicit escaping
node test/integration/swarm-matrix-integration.test.js | cat -v
```

**Want plain text?**
```javascript
const output = cli.render();
const plaintext = output.replace(/\x1b\[\d+m/g, '');
console.log(plaintext);
```

**Need to extract specific section?**
```javascript
const output = sim.simulateStatusSummary();
const lines = output.split('\n');
const healthSection = lines.filter(line => line.includes('Health'));
```

## Next Steps

1. Run the test to see Matrix theme in action
2. Integrate output into your Swarm Sandbox CLI
3. Customize colors by modifying MATRIX_COLORS
4. Add your own scenarios using MatrixThemedCLI
5. Use in CI/CD pipelines for styled terminal output

## Related Files

- `swarm-matrix-integration.test.js` - Full test suite
- `themes/matrix.json` - Matrix theme configuration
- `skills/ai-engineering/swarm-sandbox.md` - Sandbox documentation
- `site/src/components/os/apps/CliApp.tsx` - CLI component
