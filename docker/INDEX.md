# Docker Directory Index

Complete containerization setup for Claudient - production-ready Docker deployment.

## File Overview

### Core Docker Files

#### `Dockerfile` (5.6 KB)
Multi-stage production Docker image.

**Key Features:**
- Stage 1 (Builder): Compiles dependencies, builds assets
- Stage 2 (Runtime): Minimal production image
- Base: node:20-alpine (150MB)
- Non-root user: nodejs (UID 1001)
- Health check server on port 9000
- Tini init process (proper signal handling)

**What it includes:**
- CLI scripts (/app/scripts)
- Skills library (/app/skills)
- Agents (/app/agents)
- Dashboard (Astro build)
- Monitoring endpoints
- Health check scripts

**Output size:** ~500-600 MB

---

### Configuration Files

#### `docker-compose.yml` (1.4 KB)
Multi-service orchestration.

**Services:**
1. `claudient` - Main service with health server
2. `dashboard` - Optional Astro dev server (depends on claudient)

**Features:**
- Health checks enabled
- Auto-restart on failure
- Volume mounts for .claude and workspace
- Network isolation
- Security options

**Usage:**
```bash
docker-compose up -d
docker-compose down
```

---

#### `.env.example` (284 bytes)
Environment variable template.

**Variables:**
- `NODE_ENV` - production or development
- `HEALTH_PORT` - Health check server port
- `DASHBOARD_PORT` - Dashboard port
- `LOG_LEVEL` - Logging level
- `NODE_OPTIONS` - Node.js options
- `CLAUDIENT_TELEMETRY` - Telemetry enable/disable

**Usage:**
```bash
cp .env.example .env
docker-compose --env-file .env up -d
```

---

#### `.dockerignore` (467 bytes)
Files excluded from build context.

**Excluded:**
- Git files (.git, .github)
- node_modules and build artifacts
- IDE configs (.vscode, .idea)
- Environment files (.env, .env.local)
- Test files and coverage
- Docker/build files (prevent recursion)

**Purpose:** Reduces build context, speeds up builds

---

### Documentation

#### `README.md` (6.5 KB) - START HERE
**Comprehensive Docker guide covering:**
- Quick start (build, run, verify)
- Service & port overview
- Health check endpoints & responses
- Configuration (env vars, volumes)
- Security features & hardening
- Image specifications
- Docker Compose features
- Build optimization
- Usage examples (CLI, dashboard, interactive)
- Kubernetes deployment manifest
- Troubleshooting guide
- Performance tuning
- CI/CD integration (GitHub Actions, GitLab)
- Cleanup procedures

---

#### `QUICKSTART.md` (5.5 KB) - FASTEST PATH
**5-minute setup guide:**
1. Build image
2. Start container
3. Verify health
4. Access dashboard
5. Run CLI commands

Includes:
- Prerequisites
- Make commands (recommended)
- Common tasks
- Troubleshooting (quick reference)
- Next steps
- Performance tips

---

#### `ARCHITECTURE.md` (8.5 KB) - TECHNICAL DEEP DIVE
**Detailed technical documentation covering:**
- Build process (multi-stage architecture)
- Size optimization strategies
- Container structure (file layout)
- Health monitoring system (3 endpoints)
- Port mapping
- Security architecture (user, permissions, capabilities)
- Environment variables
- Volume management
- Docker Compose architecture
- Kubernetes integration
- Build pipeline (local, multi-arch, CI/CD)
- Runtime initialization
- Performance considerations
- Monitoring & observability
- Troubleshooting (deep)
- Scalability (horizontal & vertical)
- Migration paths
- Maintenance procedures

---

### Utility Scripts

#### `build.sh` (4.0 KB) - Build Automation
**Builds Docker image with options.**

**Usage:**
```bash
./build.sh                    # Build: claudient:latest
./build.sh -t v1.0           # Build: claudient:v1.0
./build.sh -m -p             # Multiarch build & push
```

**Options:**
- `-t, --tag TAG` - Image tag
- `-n, --name NAME` - Image name
- `-p, --push` - Push to registry
- `-m, --multiarch` - Build ARM64+AMD64
- `-h, --help` - Help

**Features:**
- Colored output
- Image size reporting
- Error handling
- Docker installation check

---

#### `run.sh` (3.8 KB) - Container Launcher
**Runs Docker container with options.**

**Usage:**
```bash
./run.sh                      # Run daemon
./run.sh -f                   # Run foreground
./run.sh -i claudient:v1.0 -f # Run specific image
```

**Options:**
- `-i, --image IMAGE` - Docker image
- `-n, --name NAME` - Container name
- `-f, --foreground` - Foreground mode
- `-v, --verbose` - Verbose output
- `-h, --help` - Help

**Features:**
- Colored output
- Automatic cleanup of existing containers
- Port mapping (9000, 4321, 3000)
- Volume mounting (~/.claude)
- Docker daemon check
- Image verification

---

#### `health.sh` (3.9 KB) - Health Monitoring
**Monitors container health and status.**

**Usage:**
```bash
./health.sh                   # Check all endpoints
./health.sh -t health         # Check /health only
./health.sh -c my-claudient   # Check specific container
./health.sh -v                # Verbose output
```

**Options:**
- `-c, --container NAME` - Container name
- `-t, --type TYPE` - Check type (all|health|metrics|ready|logs)
- `-v, --verbose` - Verbose output
- `-h, --help` - Help

**Features:**
- Container status inspection
- Resource usage reporting
- HTTP endpoint testing
- Log inspection
- JSON response parsing
- Colored output

---

### Build Automation

#### `Makefile` (5.5 KB) - Command Center
**27 convenient make commands for Docker operations.**

**Build Commands:**
```bash
make build              # Build image
make build-arm          # Build for ARM64
make build-push         # Build & push to registry
```

**Run Commands:**
```bash
make run                # Run daemon
make run-fg             # Run foreground
make stop               # Stop container
make restart            # Restart container
```

**Monitoring:**
```bash
make logs               # View logs (tail 50)
make shell              # Open shell
make health             # Check health endpoints
make metrics            # Get metrics
make ready              # Check readiness
make stats              # Real-time stats
```

**Docker Compose:**
```bash
make compose-up         # Start services
make compose-down       # Stop services
make compose-logs       # View logs
```

**Testing & Cleanup:**
```bash
make test               # Run tests
make lint               # Run linter
make audit              # Security audit
make clean              # Clean up
make clean-all          # Deep cleanup
```

**Info Commands:**
```bash
make info               # Show image info
make ps                 # Show containers
make inspect            # Inspect container
make size               # Show size breakdown
make validate-compose   # Validate compose file
```

**Development:**
```bash
make dev                # Build & run foreground
make dev-compose        # Build & compose up
make watch-logs         # Follow logs real-time
```

---

## Quick Navigation

### For First-Time Users
1. Start: `QUICKSTART.md`
2. Then: `README.md`
3. Reference: `docker/Dockerfile`

### For Operators
1. Use: `Makefile`
2. Monitor: `health.sh`
3. Debug: `README.md` Troubleshooting

### For DevOps/Platform Engineers
1. Study: `ARCHITECTURE.md`
2. Deploy: Kubernetes section in `README.md`
3. Reference: `docker-compose.yml`

### For CI/CD Integration
1. Build: `build.sh` or `make build`
2. Test: `make ci-test`
3. Deploy: GitHub Actions / GitLab CI examples in `README.md`

---

## Feature Matrix

| Feature | Dockerfile | Docker Compose | Scripts | Makefile | Docs |
|---------|:----------:|:--------------:|:-------:|:--------:|:----:|
| Multi-stage build | ✓ | | | | |
| Health checks | ✓ | ✓ | ✓ | | ✓ |
| Security hardening | ✓ | ✓ | | | ✓ |
| Non-root user | ✓ | ✓ | | | |
| Monitoring endpoints | ✓ | ✓ | | | ✓ |
| Environment config | | ✓ | | | ✓ |
| Multiple services | | ✓ | | | ✓ |
| Auto-restart | | ✓ | | | |
| Colored output | | | ✓ | ✓ | |
| Error handling | | | ✓ | ✓ | |
| Help messages | | | ✓ | ✓ | |
| K8s deployment | | | | | ✓ |
| CI/CD examples | | | | | ✓ |
| Performance tips | | | | | ✓ |
| Troubleshooting | | | ✓ | | ✓ |

---

## File Statistics

```
Total files: 9
Total size: ~120 KB

Breakdown:
├── Core Docker (2): 7.0 KB
├── Configuration (2): 1.7 KB
├── Documentation (3): 20.5 KB
├── Scripts (3): 11.7 KB
└── Automation (1): 5.5 KB
```

---

## Usage Patterns

### Development
```bash
make dev                # Build & run in foreground
make shell              # Access container shell
make logs               # Monitor logs
```

### Production
```bash
./build.sh -m -p        # Build multi-arch & push
docker-compose up -d    # Run services
./health.sh -t all      # Full health check
```

### Monitoring
```bash
make health             # Check health
make metrics            # View metrics
make stats              # Real-time stats
./health.sh -c name     # Container health
```

### CI/CD
```bash
make ci-build           # Build for CI
make ci-test            # Build & test
docker push ...         # Push to registry
```

---

## Version Information

- **Claudient Version:** 1.10.1
- **Node Version:** 20-alpine
- **Docker Base:** node:20-alpine (150MB)
- **Runtime Image:** ~500-600MB
- **Build Time:** 2-3 minutes (first), 30s (cached)
- **Created:** 2026-06-22

---

## Support & References

- **Dockerfile Docs:** https://docs.docker.com/engine/reference/builder/
- **Docker Compose:** https://docs.docker.com/compose/
- **Node Alpine:** https://hub.docker.com/_/node
- **Kubernetes:** https://kubernetes.io/docs/
- **Best Practices:** https://docs.docker.com/develop/dev-best-practices/

---

## License

Same as Claudient: AGPL-3.0-or-later AND CC-BY-SA-4.0

---

**Last Updated:** 2026-06-22  
**Maintainer:** tushar2704  
**Repository:** https://github.com/UitbreidenOS/Claudient
