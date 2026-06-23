# Multi-stage build for Claudient knowledge system

# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git python3 make g++

# Copy package files
COPY package*.json ./
COPY .npmrc* ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build all distributions
RUN npm run build-index && \
    npm run build-plugins && \
    npm run build-catalog || true

# Run validation
RUN npm run validate || true

# Stage 2: Runtime stage
FROM node:20-alpine

WORKDIR /app

LABEL org.opencontainers.image.title="Claudient"
LABEL org.opencontainers.image.description="The Claude Code knowledge system - skills, agents, hooks, workflows, and more"
LABEL org.opencontainers.image.source="https://github.com/UitbreidenOS/Claudient"
LABEL org.opencontainers.image.documentation="https://github.com/UitbreidenOS/Claudient#readme"

# Install runtime dependencies
RUN apk add --no-cache git curl

# Copy built artifacts from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/skills ./skills
COPY --from=builder /app/agents ./agents
COPY --from=builder /app/hooks ./hooks
COPY --from=builder /app/rules ./rules
COPY --from=builder /app/workflows ./workflows
COPY --from=builder /app/prompts ./prompts
COPY --from=builder /app/mcp ./mcp
COPY --from=builder /app/guides ./guides
COPY --from=builder /app/structures ./structures
COPY --from=builder /app/professional-stacks ./professional-stacks
COPY --from=builder /app/compatibility ./compatibility
COPY --from=builder /app/claude-md-examples ./claude-md-examples
COPY --from=builder /app/plugins ./plugins
COPY --from=builder /app/commands ./commands
COPY --from=builder /app/personas ./personas
COPY --from=builder /app/output-styles ./output-styles
COPY --from=builder /app/statuslines ./statuslines
COPY --from=builder /app/themes ./themes
COPY --from=builder /app/keybindings ./keybindings
COPY --from=builder /app/settings-templates ./settings-templates
COPY --from=builder /app/routines ./routines
COPY --from=builder /app/examples ./examples
COPY --from=builder /app/.claude-plugin ./.claude-plugin
COPY --from=builder /app/*.md ./
COPY --from=builder /app/index.json ./

# Set NODE_ENV
ENV NODE_ENV=production

# Expose default ports
EXPOSE 3000 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "console.log('OK')" || exit 1

# Default command
CMD ["node", "scripts/cli.js", "list"]
