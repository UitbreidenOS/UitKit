# Multi-stage build for Claudient
# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY site/package*.json ./site/

# Install dependencies
RUN npm ci
RUN cd site && npm ci

# Copy source code
COPY . .

# Build site and index
RUN npm run build-index
RUN npm run build-plugins
RUN cd site && npm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache curl tini

# Create non-root user
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nodejs -u 1001

# Copy built artifacts from builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nodejs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nodejs:nodejs /app/skills ./skills
COPY --from=builder --chown=nodejs:nodejs /app/agents ./agents
COPY --from=builder --chown=nodejs:nodejs /app/hooks ./hooks
COPY --from=builder --chown=nodejs:nodejs /app/rules ./rules
COPY --from=builder --chown=nodejs:nodejs /app/workflows ./workflows
COPY --from=builder --chown=nodejs:nodejs /app/prompts ./prompts
COPY --from=builder --chown=nodejs:nodejs /app/mcp ./mcp
COPY --from=builder --chown=nodejs:nodejs /app/guides ./guides
COPY --from=builder --chown=nodejs:nodejs /app/structures ./structures
COPY --from=builder --chown=nodejs:nodejs /app/professional-stacks ./professional-stacks
COPY --from=builder --chown=nodejs:nodejs /app/plugins ./plugins
COPY --from=builder --chown=nodejs:nodejs /app/.claude-plugin ./.claude-plugin
COPY --from=builder --chown=nodejs:nodejs /app/index.json ./index.json
COPY --from=builder --chown=nodejs:nodejs /app/site/dist ./site/dist

# Copy site files for serving
COPY --from=builder --chown=nodejs:nodejs /app/site/node_modules ./site/node_modules
COPY --from=builder --chown=nodejs:nodejs /app/site/package.json ./site/package.json

# Create health check script
RUN mkdir -p /app/health && \
    cat > /app/health/check.js << 'EOF'
#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

const opts = {
  hostname: 'localhost',
  port: process.env.HEALTH_PORT || 9000,
  path: '/health',
  method: 'GET',
  timeout: 2000
};

const req = http.request(opts, (res) => {
  process.exit(res.statusCode === 200 ? 0 : 1);
});

req.on('error', () => process.exit(1));
req.on('timeout', () => {
  req.destroy();
  process.exit(1);
});

req.end();
EOF
    chmod +x /app/health/check.js

# Health check endpoint server
RUN mkdir -p /app/bin && \
    cat > /app/bin/health-server.js << 'EOF'
#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.HEALTH_PORT || 9000;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    // Check if CLI and site are accessible
    const cliExists = fs.existsSync(path.join(__dirname, '../scripts/cli.js'));
    const siteDistExists = fs.existsSync(path.join(__dirname, '../site/dist'));

    if (cliExists && siteDistExists) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: require('../package.json').version,
        uptime: process.uptime(),
        checks: {
          cli: true,
          site: true,
          memory: process.memoryUsage()
        }
      }));
    } else {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        checks: {
          cli: cliExists,
          site: siteDistExists
        }
      }));
    }
  } else if (req.url === '/metrics') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      pid: process.pid,
      version: require('../package.json').version
    }));
  } else if (req.url === '/ready') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ready: true }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Health check server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('Shutting down health check server');
  server.close(() => process.exit(0));
});
EOF
    chmod +x /app/bin/health-server.js

# Create monitoring entrypoint
RUN mkdir -p /app/bin && \
    cat > /app/bin/serve.sh << 'EOF'
#!/bin/sh

# Start health check server in background
node /app/bin/health-server.js &
HEALTH_PID=$!

# Start Claudient CLI/dashboard
exec "$@"

# Cleanup on exit
trap "kill $HEALTH_PID 2>/dev/null" EXIT
EOF
    chmod +x /app/bin/serve.sh

# Use tini as init (PID 1)
ENTRYPOINT ["/sbin/tini", "--"]

# Default command: run CLI or dashboard
CMD ["npm", "run", "list"]

# User
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node /app/health/check.js

# Expose ports
# 9000: Health check & metrics
# 4321: Dashboard (Astro dev/preview server)
# 3000: Alternative dashboard port
EXPOSE 9000 4321 3000

# Volume for Claude Code integration
VOLUME ["/root/.claude"]

# Metadata
LABEL org.opencontainers.image.title="Claudient" \
      org.opencontainers.image.description="Claude Code Knowledge System - Skills, Agents, Hooks, Workflows" \
      org.opencontainers.image.authors="tushar2704" \
      org.opencontainers.image.url="https://github.com/UitbreidenOS/Claudient"
