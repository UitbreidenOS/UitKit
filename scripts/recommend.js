#!/usr/bin/env node

/**
 * recommend.js
 * Scans a project directory and recommends Claudient skills, hooks, and MCP servers.
 *
 * Usage: node scripts/recommend.js [path]
 *   path — defaults to current working directory
 */

const fs = require('fs')
const path = require('path')

const REPO_ROOT = path.resolve(__dirname, '..')

// ── Signal Definitions ──────────────────────────────────────────────────────
// Each signal: { id, label, test(dir) → bool, skills[], hooks[], mcp[] }

const SIGNALS = [
  // --- Node.js / JavaScript ---
  {
    id: 'nextjs',
    label: 'Next.js',
    test: dir => hasPkgDep(dir, d => d === 'next'),
    skills: ['backend/nodejs/nextjs'],
    hooks: [],
    mcp: [],
  },
  {
    id: 'express',
    label: 'Express.js',
    test: dir => hasPkgDep(dir, d => d === 'express'),
    skills: ['backend/nodejs/express'],
    hooks: [],
    mcp: [],
  },
  {
    id: 'fastify',
    label: 'Fastify',
    test: dir => hasPkgDep(dir, d => d === 'fastify'),
    skills: ['backend/nodejs/fastify'],
    hooks: [],
    mcp: [],
  },
  {
    id: 'nodejs',
    label: 'Node.js',
    test: dir => fileExists(dir, 'package.json'),
    skills: ['backend/nodejs/node-monorepo'],
    hooks: ['lifecycle/cost-tracker'],
    mcp: [],
  },

  // --- Python ---
  {
    id: 'fastapi',
    label: 'FastAPI',
    test: dir => hasPyDep(dir, 'fastapi'),
    skills: ['backend/python/fastapi'],
    hooks: [],
    mcp: [],
  },
  {
    id: 'django',
    label: 'Django',
    test: dir => hasPyDep(dir, 'django'),
    skills: ['backend/python/django'],
    hooks: [],
    mcp: [],
  },
  {
    id: 'flask',
    label: 'Flask',
    test: dir => hasPyDep(dir, 'flask'),
    skills: ['backend/python/flask'],
    hooks: [],
    mcp: [],
  },
  {
    id: 'python',
    label: 'Python',
    test: dir => fileExists(dir, 'requirements.txt') || fileExists(dir, 'pyproject.toml') || fileExists(dir, 'setup.py'),
    skills: ['backend/python/pytest'],
    hooks: [],
    mcp: [],
  },

  // --- Go ---
  {
    id: 'go',
    label: 'Go',
    test: dir => fileExists(dir, 'go.mod'),
    skills: ['backend/go/go-cli'],
    hooks: [],
    mcp: [],
  },

  // --- Rust ---
  {
    id: 'rust',
    label: 'Rust',
    test: dir => fileExists(dir, 'Cargo.toml'),
    skills: ['backend/rust/rust-axum', 'backend/rust/rust-tokio'],
    hooks: [],
    mcp: [],
  },

  // --- Java / Kotlin ---
  {
    id: 'java',
    label: 'Java (Maven/Gradle)',
    test: dir => fileExists(dir, 'pom.xml') || fileExists(dir, 'build.gradle') || fileExists(dir, 'build.gradle.kts'),
    skills: ['backend/java/spring-boot'],
    hooks: [],
    mcp: [],
  },
  {
    id: 'kotlin',
    label: 'Kotlin',
    test: dir => hasPyDep(dir, '') === false && fileExists(dir, 'build.gradle.kts'),
    skills: ['backend/kotlin/kotlin-ktor'],
    hooks: [],
    mcp: [],
  },

  // --- Ruby ---
  {
    id: 'ruby',
    label: 'Ruby',
    test: dir => fileExists(dir, 'Gemfile'),
    skills: ['backend/ruby/rails-api'],
    hooks: [],
    mcp: [],
  },

  // --- PHP ---
  {
    id: 'php',
    label: 'PHP',
    test: dir => fileExists(dir, 'composer.json'),
    skills: ['backend/php/laravel-api'],
    hooks: [],
    mcp: [],
  },

  // --- Elixir ---
  {
    id: 'elixir',
    label: 'Elixir',
    test: dir => fileExists(dir, 'mix.exs'),
    skills: ['backend/elixir/phoenix-liveview'],
    hooks: [],
    mcp: [],
  },

  // --- Swift ---
  {
    id: 'swift',
    label: 'Swift',
    test: dir => fileExists(dir, 'Package.swift'),
    skills: ['backend/swift/vapor-backend'],
    hooks: [],
    mcp: [],
  },

  // --- .NET ---
  {
    id: 'dotnet',
    label: '.NET',
    test: dir => globMatch(dir, '*.csproj') || globMatch(dir, '*.sln'),
    skills: ['backend/dotnet/dotnet-minimal-api'],
    hooks: [],
    mcp: [],
  },

  // --- Flutter ---
  {
    id: 'flutter',
    label: 'Flutter',
    test: dir => fileExists(dir, 'pubspec.yaml'),
    skills: ['backend/flutter/flutter-bloc'],
    hooks: [],
    mcp: [],
  },

  // --- DevOps / Infrastructure ---
  {
    id: 'docker',
    label: 'Docker',
    test: dir => fileExists(dir, 'Dockerfile') || fileExists(dir, 'docker-compose.yml') || fileExists(dir, 'docker-compose.yaml'),
    skills: ['devops-infra/docker', 'devops-infra/docker-compose'],
    hooks: [],
    mcp: [],
  },
  {
    id: 'kubernetes',
    label: 'Kubernetes',
    test: dir => dirExists(dir, 'kubernetes') || dirExists(dir, 'k8s') || globMatch(dir, '**/helm.yaml'),
    skills: ['devops-infra/kubernetes'],
    hooks: [],
    mcp: [],
  },
  {
    id: 'terraform',
    label: 'Terraform',
    test: dir => dirExists(dir, 'terraform') || globMatch(dir, '*.tf'),
    skills: ['devops-infra/terraform'],
    hooks: [],
    mcp: [],
  },
  {
    id: 'cicd',
    label: 'CI/CD (GitHub Actions)',
    test: dir => dirExists(dir, '.github/workflows'),
    skills: ['devops-infra/cicd'],
    hooks: [],
    mcp: ['github'],
  },
  {
    id: 'argocd',
    label: 'ArgoCD',
    test: dir => globMatch(dir, '**/argocd*.yaml') || globMatch(dir, '**/argocd*.yml'),
    skills: ['devops-infra/argocd'],
    hooks: [],
    mcp: [],
  },
  {
    id: 'aws',
    label: 'AWS (CDK/SAM/CloudFormation)',
    test: dir => fileExists(dir, 'cdk.json') || globMatch(dir, '**/template.yaml') || hasPkgDep(dir, d => d.startsWith('aws-cdk')),
    skills: ['devops-infra/aws-architect'],
    hooks: [],
    mcp: [],
  },

  // --- Data / ML ---
  {
    id: 'dbt',
    label: 'dbt',
    test: dir => fileExists(dir, 'dbt_project.yml') || dirExists(dir, 'dbt'),
    skills: ['data-ml/dbt-data-pipelines'],
    hooks: [],
    mcp: [],
  },
  {
    id: 'jupyter',
    label: 'Jupyter Notebooks',
    test: dir => globMatch(dir, '**/*.ipynb'),
    skills: ['data-ml/jupyter-datascience'],
    hooks: [],
    mcp: [],
  },
  {
    id: 'pytorch',
    label: 'PyTorch',
    test: dir => hasPyDep(dir, 'torch'),
    skills: ['data-ml/pytorch-tensorflow'],
    hooks: [],
    mcp: [],
  },
  {
    id: 'mlops',
    label: 'MLflow',
    test: dir => hasPyDep(dir, 'mlflow'),
    skills: ['data-ml/mlflow', 'data-ml/mlops'],
    hooks: [],
    mcp: [],
  },
  {
    id: 'kafka',
    label: 'Kafka',
    test: dir => hasPyDep(dir, 'kafka') || hasPkgDep(dir, d => d.includes('kafka')),
    skills: ['data-ml/kafka'],
    hooks: [],
    mcp: [],
  },

  // --- Database ---
  {
    id: 'prisma',
    label: 'Prisma',
    test: dir => fileExists(dir, 'prisma/schema.prisma') || hasPkgDep(dir, d => d === '@prisma/client' || d === 'prisma'),
    skills: ['database/prisma'],
    hooks: [],
    mcp: [],
  },
  {
    id: 'drizzle',
    label: 'Drizzle ORM',
    test: dir => hasPkgDep(dir, d => d === 'drizzle-orm'),
    skills: ['database/drizzle'],
    hooks: [],
    mcp: [],
  },
  {
    id: 'supabase',
    label: 'Supabase',
    test: dir => hasPkgDep(dir, d => d === '@supabase/supabase-js') || hasPkgDep(dir, d => d === 'supabase'),
    skills: ['database/supabase'],
    hooks: [],
    mcp: ['neon'],
  },
  {
    id: 'mongodb',
    label: 'MongoDB',
    test: dir => hasPkgDep(dir, d => d === 'mongoose' || d === 'mongodb') || hasPyDep(dir, 'pymongo') || hasPyDep(dir, 'motor'),
    skills: ['database/mongodb'],
    hooks: [],
    mcp: [],
  },
  {
    id: 'postgresql',
    label: 'PostgreSQL',
    test: dir => hasPkgDep(dir, d => d === 'pg') || hasPyDep(dir, 'psycopg2') || hasPyDep(dir, 'asyncpg'),
    skills: ['database/postgresql'],
    hooks: [],
    mcp: ['neon'],
  },
  {
    id: 'redis',
    label: 'Redis',
    test: dir => hasPkgDep(dir, d => d === 'redis' || d === 'ioredis') || hasPyDep(dir, 'redis'),
    skills: ['database/redis'],
    hooks: [],
    mcp: [],
  },
  {
    id: 'elasticsearch',
    label: 'Elasticsearch',
    test: dir => hasPkgDep(dir, d => d === '@elastic/elasticsearch') || hasPyDep(dir, 'elasticsearch'),
    skills: ['database/elasticsearch'],
    hooks: [],
    mcp: [],
  },
  {
    id: 'graphql',
    label: 'GraphQL',
    test: dir => hasPkgDep(dir, d => d === 'graphql' || d === '@apollo/server' || d === 'apollo-server'),
    skills: ['database/graphql'],
    hooks: [],
    mcp: [],
  },

  // --- AI Engineering ---
  {
    id: 'anthropic-sdk',
    label: 'Anthropic SDK',
    test: dir => hasPkgDep(dir, d => d === '@anthropic-ai/sdk') || hasPyDep(dir, 'anthropic'),
    skills: ['ai-engineering/claude-api', 'ai-engineering/advanced-tool-use'],
    hooks: ['lifecycle/compaction-advisor', 'lifecycle/cost-tracker'],
    mcp: [],
  },
  {
    id: 'openai-sdk',
    label: 'OpenAI SDK',
    test: dir => hasPkgDep(dir, d => d === 'openai') || hasPyDep(dir, 'openai'),
    skills: ['ai-engineering/claude-api'],
    hooks: ['lifecycle/cost-tracker'],
    mcp: [],
  },
  {
    id: 'langchain',
    label: 'LangChain',
    test: dir => hasPkgDep(dir, d => d.startsWith('langchain')) || hasPyDep(dir, 'langchain'),
    skills: ['ai-engineering/langgraph'],
    hooks: [],
    mcp: [],
  },
  {
    id: 'crewai',
    label: 'CrewAI',
    test: dir => hasPyDep(dir, 'crewai'),
    skills: ['ai-engineering/crewai'],
    hooks: [],
    mcp: [],
  },

  // --- Observability ---
  {
    id: 'sentry',
    label: 'Sentry',
    test: dir => hasPkgDep(dir, d => d === '@sentry/node' || d === '@sentry/nextjs') || hasPyDep(dir, 'sentry_sdk'),
    skills: ['devops-infra/cloud-security'],
    hooks: ['post-tool-use/sentry-check'],
    mcp: ['sentry-remote'],
  },
  {
    id: 'datadog',
    label: 'Datadog',
    test: dir => hasPkgDep(dir, d => d === 'datadog-ci') || hasPyDep(dir, 'datadog'),
    skills: [],
    hooks: [],
    mcp: ['datadog'],
  },
]

// ── Helper Functions ────────────────────────────────────────────────────────

function fileExists(dir, file) {
  return fs.existsSync(path.join(dir, file))
}

function dirExists(dir, subdir) {
  const full = path.join(dir, subdir)
  return fs.existsSync(full) && fs.statSync(full).isDirectory()
}

function globMatch(dir, pattern) {
  try {
    const base = pattern.includes('**/') ? dir : dir
    const simple = pattern.replace('**/', '').replace('*', '')
    return walkForPattern(base, simple, pattern.includes('**/'))
  } catch {
    return false
  }
}

function walkForPattern(dir, suffix, recursive, depth = 0) {
  if (depth > 4) return false
  if (!fs.existsSync(dir)) return false
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(suffix)) return true
    if (recursive && entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      if (walkForPattern(path.join(dir, entry.name), suffix, true, depth + 1)) return true
    }
  }
  return false
}

function hasPkgDep(dir, test) {
  const pkgPath = path.join(dir, 'package.json')
  if (!fs.existsSync(pkgPath)) return false
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies }
    return Object.keys(allDeps).some(test)
  } catch {
    return false
  }
}

function hasPyDep(dir, dep) {
  for (const file of ['requirements.txt', 'pyproject.toml', 'setup.py', 'setup.cfg']) {
    const fp = path.join(dir, file)
    if (!fs.existsSync(fp)) continue
    try {
      const content = fs.readFileSync(fp, 'utf8')
      if (content.includes(dep)) return true
    } catch { /* skip */ }
  }
  return false
}

// ── Main ────────────────────────────────────────────────────────────────────

function recommend(projectDir) {
  const absDir = path.resolve(projectDir || '.')

  if (!fs.existsSync(absDir)) {
    console.error(`Directory not found: ${absDir}`)
    process.exit(1)
  }

  console.log(`\nScanning: ${absDir}\n`)
  console.log('─'.repeat(60))

  const detected = []
  const allSkills = new Set()
  const allHooks = new Set()
  const allMcp = new Set()

  for (const signal of SIGNALS) {
    if (signal.test(absDir)) {
      detected.push(signal)
      signal.skills.forEach(s => allSkills.add(s))
      signal.hooks.forEach(h => allHooks.add(h))
      signal.mcp.forEach(m => allMcp.add(m))
    }
  }

  if (detected.length === 0) {
    console.log('\nNo technology signals detected.')
    console.log('Try running from a project root with package.json, requirements.txt, etc.\n')
    console.log('Browse all skills: npx claudient list skills')
    console.log('Browse all structures: npx claudient list structures\n')
    return
  }

  // Detected stack
  console.log(`\n  Detected stack: ${detected.map(s => s.label).join(', ')}\n`)
  console.log('─'.repeat(60))

  // Skills
  if (allSkills.size > 0) {
    console.log(`\n  Recommended skills (${allSkills.size}):\n`)
    for (const skill of allSkills) {
      const skillPath = path.join(REPO_ROOT, 'skills', skill + '.md')
      const exists = fs.existsSync(skillPath)
      const status = exists ? '' : ' (not found)'
      console.log(`    + ${skill}${status}`)
      console.log(`      npx claudient add skills ${skill.split('/')[0]}`)
    }
  }

  // Hooks
  if (allHooks.size > 0) {
    console.log(`\n  Recommended hooks (${allHooks.size}):\n`)
    for (const hook of allHooks) {
      console.log(`    + ${hook}`)
    }
    console.log(`\n    Install all hooks: npx claudient add hooks`)
  }

  // MCP servers
  if (allMcp.size > 0) {
    console.log(`\n  Recommended MCP servers (${allMcp.size}):\n`)
    for (const mcp of allMcp) {
      console.log(`    + ${mcp}`)
      console.log(`      See: mcp/${mcp}.md for setup`)
    }
  }

  // Summary
  console.log(`\n${'─'.repeat(60)}`)
  console.log(`\n  Quick install:  npx claudient add all`)
  console.log(`  Browse skills:  npx claudient list skills\n`)
}

// Allow both direct execution and import from cli.js
if (require.main === module) {
  const projectDir = process.argv[2] || '.'
  recommend(projectDir)
}

module.exports = { recommend }
