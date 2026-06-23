# Claudient TypeScript SDK

Type-safe TypeScript client library for Claudient with async/await support, comprehensive error handling, automatic retry logic, and timeouts.

## Features

- **Type-Safe**: Full TypeScript support with interfaces for all API responses
- **Async/Await**: Promise-based API with async/await support
- **Automatic Retries**: Exponential backoff retry logic for failed requests
- **Timeout Management**: Configurable timeouts with automatic enforcement
- **Error Handling**: Custom error classes for different failure scenarios
- **Three Main Clients**: Skills, Agents, and Plugins management
- **Production-Ready**: Tested patterns for reliability in production environments

## Installation

```bash
npm install claudient-sdk
# or
yarn add claudient-sdk
```

## Quick Start

```typescript
import { ClaudientClient } from "claudient-sdk";

const client = new ClaudientClient({
  baseUrl: "https://api.claudient.dev",
  timeout: 30000,
  maxRetries: 3,
});

// Search skills
const skills = await client.skills.search({ category: "backend" });

// Spawn an agent
const spawn = await client.agents.spawn({
  agentId: "security-reviewer",
  taskDescription: "Review the authentication module",
});

// Load a plugin
const plugin = await client.plugins.load({
  pluginId: "ai-compliance-risk-stack",
});
```

## Configuration

```typescript
interface ClientConfig {
  baseUrl?: string;        // Default: "https://api.claudient.dev"
  timeout?: number;        // Default: 30000ms
  maxRetries?: number;     // Default: 3
  retryDelayMs?: number;   // Default: 1000ms
  apiKey?: string;         // Default: process.env.CLAUDIENT_API_KEY
}

const client = new ClaudientClient({
  baseUrl: "https://custom-api.example.com",
  timeout: 60000,
  maxRetries: 5,
  retryDelayMs: 500,
  apiKey: "sk-xyz123",
});
```

## Skills Client

The Skills client provides search and discovery of Claudient skills.

### Search Skills

```typescript
const result = await client.skills.search({
  category: "backend",
  query: "fastapi",
  tags: ["python", "rest"],
  limit: 50,
  offset: 0,
});

console.log(`Found ${result.total} skills, ${result.skills.length} returned`);
```

### Get Skill by ID

```typescript
const skill = await client.skills.get("fastapi-crud");
console.log(skill.name, skill.description);
```

### List All Skills

```typescript
const result = await client.skills.list(limit, offset);
const skills = result.skills;
```

### Get Skills by Category

```typescript
const backendSkills = await client.skills.getByCategory("backend", 100);
```

### Get Skills by Tags

```typescript
const pythonSkills = await client.skills.getByTags(["python"], 50);
```

### Check Skill Existence

```typescript
const exists = await client.skills.exists("fastapi-crud");
if (exists) {
  console.log("Skill is available");
}
```

## Agents Client

The Agents client manages agent discovery and spawning for autonomous tasks.

### List Available Agents

```typescript
const agents = await client.agents.list();
agents.forEach((agent) => {
  console.log(`${agent.name}: ${agent.purpose}`);
});
```

### Get Agent Details

```typescript
const agent = await client.agents.get("security-reviewer");
console.log(agent.modelGuidance);
console.log(agent.tools);
```

### Spawn an Agent

```typescript
const spawn = await client.agents.spawn({
  agentId: "security-reviewer",
  taskDescription: "Review authentication module for vulnerabilities",
  context: { filePath: "src/auth.ts", framework: "express" },
  timeout: 300000, // 5 minutes
});

console.log(`Agent spawned: ${spawn.spawnId}`);
console.log(`Status: ${spawn.status}`);
```

### Poll Agent Result (Manual)

```typescript
const spawnId = "spawn-123";
const result = await client.agents.pollSpawnResult(spawnId, 300000);

if (result.status === "completed") {
  console.log("Agent task completed:", result.result);
} else if (result.status === "failed") {
  console.error("Agent task failed:", result.error);
}
```

### Spawn and Wait for Completion

```typescript
const result = await client.agents.spawnAndWait({
  agentId: "security-reviewer",
  taskDescription: "Review authentication module",
  context: { filePath: "src/auth.ts" },
});

console.log(result.result); // Ready immediately
```

### Get Cached Spawn Status

```typescript
const cachedStatus = client.agents.getSpawnStatus("spawn-123");
if (cachedStatus) {
  console.log(cachedStatus.status);
}
```

### List Agents by Status

```typescript
const activeAgents = await client.agents.getByStatus("active");
const experimentalAgents = await client.agents.getByStatus("experimental");
```

## Plugins Client

The Plugins client manages plugin discovery and loading.

### List Available Plugins

```typescript
const plugins = await client.plugins.list();
plugins.forEach((plugin) => {
  console.log(`${plugin.name} v${plugin.version}`);
});
```

### Get Plugin Details

```typescript
const plugin = await client.plugins.get("ai-compliance-risk-stack");
console.log(plugin.assets); // { skills: 5, commands: 3, hooks: 2, mcp: 1 }
```

### Load a Plugin

```typescript
const result = await client.plugins.load({
  pluginId: "ai-compliance-risk-stack",
  version: "1.0.0",
  force: false,
});

console.log(`Loaded skills: ${result.assetsLoaded.skills}`);
console.log(`Loaded commands: ${result.assetsLoaded.commands}`);

if (result.warnings?.length) {
  console.warn("Warnings:", result.warnings);
}
```

### Unload a Plugin

```typescript
const success = await client.plugins.unload("ai-compliance-risk-stack");
console.log(`Plugin unloaded: ${success}`);
```

### Check Plugin Load Status

```typescript
const isLoaded = client.plugins.isLoaded("ai-compliance-risk-stack");
console.log(`Plugin loaded: ${isLoaded}`);

const status = client.plugins.getLoadStatus("ai-compliance-risk-stack");
console.log(status?.assetsLoaded);
```

### List Loaded Plugins

```typescript
const loaded = client.plugins.getLoadedPlugins();
console.log(`${loaded.length} plugins loaded`);
```

### List Plugins by Category

```typescript
const compliancePlugins = await client.plugins.getByCategory("compliance");
```

### List Certified Plugins

```typescript
const certified = await client.plugins.getCertified();
certified.forEach((plugin) => {
  console.log(`${plugin.name} (certified)`);
});
```

## Error Handling

The SDK provides custom error classes for different failure scenarios.

### Error Types

```typescript
import {
  ClaudientError,
  TimeoutError,
  RetryExhaustedError,
  NotFoundError,
  ValidationError,
} from "claudient-sdk";

try {
  const skill = await client.skills.get("nonexistent");
} catch (err) {
  if (err instanceof NotFoundError) {
    console.error(`Resource not found: ${err.resource}`);
  } else if (err instanceof ValidationError) {
    console.error(`Invalid field: ${err.field}`);
  } else if (err instanceof TimeoutError) {
    console.error(`Request timed out after ${err.timeout}ms`);
  } else if (err instanceof RetryExhaustedError) {
    console.error(`Failed after ${err.attempts} attempts`);
    console.error(`Last error: ${err.lastError.message}`);
  } else if (err instanceof ClaudientError) {
    console.error(`API Error [${err.code}]: ${err.message}`);
    console.error(`Status: ${err.statusCode}`);
  }
}
```

### Comprehensive Error Handling Example

```typescript
async function safeSkillSearch(category: string) {
  try {
    const skills = await client.skills.getByCategory(category, 100);
    return skills;
  } catch (err) {
    if (err instanceof ValidationError) {
      console.error(`Invalid input: ${err.message}`);
      // Handle user input validation error
    } else if (err instanceof NotFoundError) {
      console.error(`Category not found: ${category}`);
      // Handle not found gracefully
    } else if (err instanceof TimeoutError) {
      console.error(`Request took too long. Retrying with longer timeout...`);
      client.setTimeout(60000);
      // Retry with longer timeout
    } else if (err instanceof RetryExhaustedError) {
      console.error(`Service unavailable. Last error: ${err.lastError.message}`);
      // Handle service unavailability
    } else {
      console.error(`Unexpected error: ${err}`);
      throw err;
    }
  }
}
```

## Retry Logic

The SDK automatically retries failed requests with exponential backoff. Retryable errors include:

- Timeout errors
- Connection refused/reset
- Temporary unavailability

### Custom Retry Options

```typescript
const result = await client.skills.search(
  { category: "backend" },
  {
    retryOptions: {
      maxRetries: 5,
      delayMs: 500,
      backoffMultiplier: 2.0,
    },
  }
);
```

### Retry Backoff Formula

Delay for attempt N: `delayMs * (backoffMultiplier ^ (N - 1))`

Example with defaults:
- Attempt 1: fails immediately, retry after 1000ms
- Attempt 2: fails, retry after 1500ms
- Attempt 3: fails, retry after 2250ms
- Attempt 3 (final): throws RetryExhaustedError

## Timeout Management

All requests have configurable timeouts with automatic enforcement.

```typescript
// Global timeout
client.setTimeout(60000); // 60 seconds for all future requests

// Per-request timeout
const skill = await client.skills.get("fastapi-crud", {
  timeout: 10000, // 10 seconds for this request
});
```

## Health Check

```typescript
const healthy = await client.healthCheck();
if (!healthy) {
  console.error("Claudient API is unavailable");
}
```

## Configuration Updates

```typescript
const config = client.getConfig();
console.log(config.baseUrl);
console.log(config.timeout);
console.log(config.maxRetries);

// Update timeout
client.setTimeout(45000);
```

## Advanced Examples

### Bulk Operations with Error Recovery

```typescript
async function loadPluginsWithFallback(pluginIds: string[]) {
  const results = [];

  for (const pluginId of pluginIds) {
    try {
      const result = await client.plugins.load({ pluginId });
      results.push({ pluginId, success: true, result });
    } catch (err) {
      if (err instanceof NotFoundError) {
        console.warn(`Plugin ${pluginId} not found, skipping...`);
      } else if (err instanceof RetryExhaustedError) {
        console.warn(
          `Plugin ${pluginId} load failed after retries, skipping...`
        );
      } else {
        throw err;
      }
      results.push({ pluginId, success: false, error: err.message });
    }
  }

  return results;
}
```

### Parallel Skill Discovery

```typescript
async function discoverSkillsByCategories(categories: string[]) {
  const promises = categories.map((category) =>
    client.skills
      .getByCategory(category)
      .catch((err) => {
        console.error(`Failed to fetch ${category}:`, err.message);
        return [];
      })
  );

  const results = await Promise.all(promises);
  return results.flat();
}
```

### Agent Task Pipeline

```typescript
async function runAgentPipeline(tasks: string[]) {
  const results = [];

  for (const task of tasks) {
    try {
      const result = await client.agents.spawnAndWait({
        agentId: "ai-engineer",
        taskDescription: task,
      });

      if (result.status === "failed") {
        console.error(`Task failed: ${result.error}`);
      } else {
        results.push(result.result);
      }
    } catch (err) {
      console.error(`Task error: ${err.message}`);
    }
  }

  return results;
}
```

## TypeScript Support

Full type safety across the entire SDK:

```typescript
// Types are automatically inferred
const skills: SkillMetadata[] = await client.skills.getByCategory("backend");
const agents: AgentDefinition[] = await client.agents.list();
const plugins: PluginManifest[] = await client.plugins.list();

// Request/response types are strictly typed
const request: AgentSpawnRequest = {
  agentId: "security-reviewer",
  taskDescription: "Review code",
  context: { file: "main.ts" }, // Record<string, unknown>
  timeout: 300000,
};

const response: AgentSpawnResponse = await client.agents.spawn(request);
```

## Environment Variables

```bash
# Set default API key
export CLAUDIENT_API_KEY="sk-xyz123"

# The SDK will use it automatically
const client = new ClaudientClient();
```

## Best Practices

1. **Reuse Client Instance**: Create one client per application
   ```typescript
   const client = new ClaudientClient();
   // Use throughout your app
   ```

2. **Handle Errors Gracefully**: Always catch and handle errors
   ```typescript
   try {
     // operation
   } catch (err) {
     // handle specific error types
   }
   ```

3. **Set Appropriate Timeouts**: Adjust based on your needs
   ```typescript
   client.setTimeout(60000); // Longer for complex operations
   ```

4. **Check Availability Before Operations**: Use health check
   ```typescript
   if (await client.healthCheck()) {
     // proceed
   }
   ```

5. **Use Async/Await**: Avoid callback hell
   ```typescript
   const result = await client.skills.get("id");
   ```

## Performance

- **Automatic Connection Pooling**: Reuse HTTP connections
- **Exponential Backoff**: Reduces server load on retries
- **Timeout Enforcement**: Prevents hanging requests
- **Memory Efficient**: Lazy-loaded plugin status cache

## License

This SDK is part of Claudient and follows the same license: AGPL-3.0-or-later AND CC-BY-SA-4.0

## Support

For issues, questions, or contributions:
- GitHub: https://github.com/UitbreidenOS/Claudient
- Docs: https://claudient.dev
