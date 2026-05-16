#!/usr/bin/env node
// add-frontmatter.js — injects YAML frontmatter into skill files that lack it

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')

// name + description for every English skill
const SKILL_META = {
  'skills/backend/python/fastapi.md': {
    name: 'fastapi',
    description: 'FastAPI app structure, async routes, Pydantic models, SQLAlchemy, dependency injection, background tasks, TestClient',
  },
  'skills/backend/python/django.md': {
    name: 'django',
    description: 'Django project layout, ORM models, migrations, DRF serializers, viewsets, Celery tasks, admin customization',
  },
  'skills/backend/nodejs/nextjs.md': {
    name: 'nextjs',
    description: 'Next.js App Router patterns: Server Components, Server Actions, route handlers, middleware, parallel routes, ISR',
  },
  'skills/backend/nodejs/nestjs.md': {
    name: 'nestjs',
    description: 'NestJS modules, controllers, services, guards, interceptors, TypeORM, CQRS, microservices, Jest testing',
  },
  'skills/backend/go/go.md': {
    name: 'go',
    description: 'Go project layout, HTTP handlers, interfaces, goroutines, error wrapping, table-driven tests, slog logging',
  },
  'skills/backend/dotnet/csharp.md': {
    name: 'csharp',
    description: 'C#/.NET minimal API, Entity Framework Core, dependency injection, background services, middleware, LINQ',
  },
  'skills/backend/java/spring-boot.md': {
    name: 'spring-boot',
    description: 'Spring Boot REST API, JPA repositories, Spring Security JWT, @WebMvcTest, @SpringBootTest, Spring Cloud',
  },
  'skills/ai-engineering/claude-api.md': {
    name: 'claude-api',
    description: 'Anthropic Claude API: prompt caching, streaming, tool use, batch processing, model selection, cost optimization',
  },
  'skills/ai-engineering/agent-construction.md': {
    name: 'agent-construction',
    description: 'Multi-agent architecture, orchestrator patterns, tool design, agent loops, memory, error handling, handoffs',
  },
  'skills/devops-infra/kubernetes.md': {
    name: 'kubernetes',
    description: 'Kubernetes manifests, resource limits, health probes, secrets, RBAC, HPA, CrashLoopBackOff diagnosis',
  },
  'skills/devops-infra/terraform.md': {
    name: 'terraform',
    description: 'Terraform modules, state management, workspaces, provider config, plan/apply workflow, remote backends',
  },
  'skills/devops-infra/docker.md': {
    name: 'docker',
    description: 'Dockerfile best practices, multi-stage builds, Compose services, networking, volumes, build caching',
  },
  'skills/devops-infra/github-actions.md': {
    name: 'github-actions',
    description: 'GitHub Actions workflows, job matrices, caching, secrets, reusable workflows, deployment environments',
  },
  'skills/data-ml/pandas-polars.md': {
    name: 'pandas-polars',
    description: 'Pandas and Polars data manipulation: filtering, groupby, joins, time series, performance optimization',
  },
  'skills/data-ml/pytorch-tensorflow.md': {
    name: 'pytorch-tensorflow',
    description: 'PyTorch and TensorFlow model training, data loaders, GPU setup, checkpointing, inference optimization',
  },
  'skills/data-ml/dbt-data-pipelines.md': {
    name: 'dbt',
    description: 'dbt models, sources, tests, macros, incremental models, documentation, CI integration, Jinja patterns',
  },
  'skills/database/graphql.md': {
    name: 'graphql',
    description: 'GraphQL schema design, resolvers, mutations, subscriptions, DataLoader, Prisma integration, N+1 prevention',
  },
  'skills/finance-payments/stripe.md': {
    name: 'stripe',
    description: 'Stripe Checkout, subscriptions, webhooks, customer portal, payment intents, test mode, idempotency',
  },
  'skills/productivity/caveman.md': {
    name: 'caveman',
    description: 'Token compression via caveman mode: ~65% output reduction, caveman-compress, cavecrew subagents',
  },
}

let added = 0
let skipped = 0

for (const [relPath, meta] of Object.entries(SKILL_META)) {
  const filepath = path.join(ROOT, relPath)
  if (!fs.existsSync(filepath)) {
    console.log(`  MISSING: ${relPath}`)
    continue
  }

  const content = fs.readFileSync(filepath, 'utf-8')

  // Skip if frontmatter already exists
  if (content.startsWith('---')) {
    console.log(`  SKIP (has frontmatter): ${relPath}`)
    skipped++
    continue
  }

  const frontmatter = `---\nname: ${meta.name}\ndescription: "${meta.description}"\n---\n\n`
  fs.writeFileSync(filepath, frontmatter + content)
  console.log(`  + ${relPath}`)
  added++
}

console.log(`\nDone: ${added} files updated, ${skipped} skipped (already had frontmatter)`)
