# Claudient Docker Containerization

Multi-stage Docker container for Claudient — the Claude Code knowledge system. Includes health checks, monitoring endpoints, and production-ready security hardening.

## Quick Start

### Build the image
```bash
docker build -t claudient:latest -f docker/Dockerfile .
```

### Run standalone container
```bash
docker run -d \
  --name claudient \
  -p 9000:9000 \
  -p 4321:4321 \
  -v ~/.claude:/root/.claude \
  claudient:latest
```

### Using Docker Compose
```bash
cd docker
docker-compose up -d
```

## Services & Ports

| Service | Port | Purpose |
|---------|------|---------|
| Health Check Server | 9000 | `/health`, `/metrics`, `/ready` endpoints |
| Dashboard (Astro) | 4321 | Web UI for Claudient management |
| Alternative | 3000 | Fallback dashboard port |

## Health Check Endpoints

### `/health`
Returns comprehensive health status:
```json
{
  "status": "healthy",
  "timestamp": "2026-06-22T10:30:00.000Z",
  "version": "1.10.1",
  "uptime": 3600,
  "checks": {
    "cli": true,
    "site": true,
    "memory": { ... }
  }
}
```

### `/metrics`
Prometheus-compatible metrics:
```json
{
  "uptime": 3600,
  "memory": { ... },
  "pid": 1,
  "version": "1.10.1"
}
```

### `/ready`
Kubernetes-compatible readiness probe:
```json
{ "ready": true }
```

## Configuration

### Environment Variables
- `NODE_ENV`: Set to `production` (default) or `development`
- `HEALTH_PORT`: Health check server port (default: 9000)

### Volumes
- `/root/.claude`: Claude Code directory (required for skill/agent/hook integration)
- `/workspace`: Project workspace (optional)

## Security Features

- Multi-stage build (optimized image size)
- Non-root user (nodejs:1001)
- No new privileges (`security_opt: no-new-privileges:true`)
- Minimal capability set (only NET_BIND_SERVICE)
- Alpine base (reduced attack surface)
- Tini init process (proper signal handling)

## Image Specifications

| Property | Value |
|----------|-------|
| Base Image | `node:20-alpine` |
| Size | ~500MB (uncompressed) |
| User | nodejs (UID 1001) |
| Init | tini v0.19+ |
| Build Time | ~3-5 minutes (with cache) |

## Docker Compose Features

### claudient service
- Runs health check server
- Mounts local `.claude` directory
- Auto-restart on failure
- Health checks enabled
- Network: claudient-network

### dashboard service (optional)
- Runs Astro dev server on port 4321
- Depends on claudient service
- Mounts site directory for live reload
- Development mode

## Build Optimization

### Layer Caching
1. Copy package files first (slow to change)
2. Install dependencies (slow to rebuild)
3. Copy source code (frequently changes)
4. Build artifacts

### Size Reduction
- Multi-stage build: removes build dependencies
- Alpine base: 150MB vs 1GB+ for ubuntu
- Production dependencies only
- Unused files excluded via .dockerignore

## Usage Examples

### Run CLI commands
```bash
docker run --rm \
  -v ~/.claude:/root/.claude \
  claudient:latest \
  node scripts/cli.js add skills backend
```

### Run dashboard
```bash
docker run -it -p 4321:4321 \
  -v ~/.claude:/root/.claude \
  claudient:latest \
  npm run dashboard
```

### Interactive bash shell
```bash
docker run -it \
  -v ~/.claude:/root/.claude \
  claudient:latest \
  /bin/sh
```

### Health check monitoring
```bash
# Check health
curl http://localhost:9000/health

# View metrics
curl http://localhost:9000/metrics

# Ready check
curl http://localhost:9000/ready
```

## Kubernetes Deployment

### Deployment manifest
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: claudient
spec:
  replicas: 1
  selector:
    matchLabels:
      app: claudient
  template:
    metadata:
      labels:
        app: claudient
    spec:
      containers:
      - name: claudient
        image: claudient:latest
        ports:
        - containerPort: 9000
          name: health
        - containerPort: 4321
          name: dashboard
        livenessProbe:
          httpGet:
            path: /health
            port: 9000
          initialDelaySeconds: 10
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /ready
            port: 9000
          initialDelaySeconds: 5
          periodSeconds: 10
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        volumeMounts:
        - name: claude-data
          mountPath: /root/.claude
      volumes:
      - name: claude-data
        emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: claudient
spec:
  selector:
    app: claudient
  ports:
  - name: health
    port: 9000
    targetPort: 9000
  - name: dashboard
    port: 4321
    targetPort: 4321
  type: ClusterIP
```

## Troubleshooting

### Container won't start
```bash
docker logs claudient
```

### Health check failing
```bash
# Test health endpoint directly
docker exec claudient curl http://localhost:9000/health

# Check file permissions
docker exec claudient ls -la /app/scripts/cli.js
```

### High memory usage
```bash
# Check Node process memory
docker exec claudient ps aux

# View memory stats
docker stats claudient
```

### Port conflicts
Map to different host ports:
```bash
docker run -p 19000:9000 -p 14321:4321 claudient:latest
```

## Performance Tuning

### Increase memory limit
```bash
docker run -m 2g claudient:latest
```

### CPU limits
```bash
docker run --cpus 2 claudient:latest
```

### Production settings
```bash
docker run \
  -e NODE_ENV=production \
  --cpus 2 \
  -m 1g \
  claudient:latest
```

## Building for ARM64 (Apple Silicon, etc.)

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t claudient:latest \
  -f docker/Dockerfile \
  --push .
```

## CI/CD Integration

### GitHub Actions
```yaml
- name: Build Claudient Docker image
  run: |
    docker build -t claudient:${{ github.sha }} \
      -f docker/Dockerfile .
    
- name: Test container
  run: |
    docker run --rm \
      claudient:${{ github.sha }} \
      npm test
```

### GitLab CI
```yaml
build_image:
  stage: build
  image: docker:latest
  script:
    - docker build -t claudient:$CI_COMMIT_SHA -f docker/Dockerfile .
    - docker run --rm claudient:$CI_COMMIT_SHA npm test
```

## Cleanup

### Remove container
```bash
docker rm -f claudient
```

### Remove image
```bash
docker rmi claudient:latest
```

### Clean up all
```bash
docker-compose down -v
```

## License

Same as Claudient: AGPL-3.0-or-later AND CC-BY-SA-4.0

## Support

- GitHub Issues: https://github.com/UitbreidenOS/Claudient/issues
- Documentation: https://github.com/UitbreidenOS/Claudient/blob/main/README.md
