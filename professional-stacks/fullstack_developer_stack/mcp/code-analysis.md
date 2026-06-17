# Code Analysis MCP Tools

## Overview

MCP servers for static analysis, linting, type checking, complexity measurement, and code quality assessment. These tools integrate language-specific analysis capabilities into Claude workflows.

---

## Recommended Servers

### Language-Agnostic

#### SonarQube MCP
- **Scope**: Multi-language static analysis, code smells, security vulnerabilities, technical debt
- **Best for**: Large codebases requiring standardized quality metrics
- **Config template**:
  ```json
  {
    "name": "sonarqube",
    "command": "mcp-sonarqube",
    "args": ["--host", "http://localhost:9000", "--token", "${SONAR_TOKEN}"]
  }
  ```

### JavaScript/TypeScript

#### ESLint MCP
- **Scope**: Linting, code style, potential bugs
- **Config template**:
  ```json
  {
    "name": "eslint",
    "command": "mcp-eslint",
    "args": ["--config", ".eslintrc.json"]
  }
  ```

#### TypeScript Type Checker
- **Scope**: Type errors, unused variables, strict mode violations
- **Config template**:
  ```json
  {
    "name": "typescript",
    "command": "mcp-typescript-compiler",
    "args": ["--noEmit", "--skipLibCheck"]
  }
  ```

### Python

#### Pylint MCP
- **Scope**: Code analysis, style guide violations, potential bugs
- **Config template**:
  ```json
  {
    "name": "pylint",
    "command": "mcp-pylint",
    "args": ["--exit-zero"]
  }
  ```

#### MyPy MCP
- **Scope**: Static type checking
- **Config template**:
  ```json
  {
    "name": "mypy",
    "command": "mcp-mypy",
    "args": ["--strict", "--ignore-missing-imports"]
  }
  ```

### Go

#### Golangci-lint MCP
- **Scope**: Multi-linter aggregation, comprehensive Go analysis
- **Config template**:
  ```json
  {
    "name": "golangci-lint",
    "command": "mcp-golangci-lint",
    "args": ["--config", ".golangci.yml"]
  }
  ```

### Rust

#### Clippy MCP
- **Scope**: Linting and performance suggestions
- **Config template**:
  ```json
  {
    "name": "clippy",
    "command": "mcp-clippy",
    "args": ["--", "-D", "warnings"]
  }
  ```

---

## Integration Patterns

### Setup

1. Install MCP server binaries for your stack
2. Add configuration to `.claude/settings.json` under `mcpServers`
3. Restart Claude Code to enable
4. Verify with `claude info mcp`

### Usage

Reference analysis servers in skill definitions or invoke directly:
```bash
claude mcp call <server-name> <method> <args>
```

### CI/CD Integration

Chain analysis tools in pre-commit hooks or GitHub Actions for automated quality gates.

---

## Best Practices

- **Baseline first**: Establish baseline metrics before enforcing strict analysis
- **Gradual enforcement**: Increase strictness incrementally to avoid overwhelming developers
- **Config per project**: Version control analyzer configs (`.eslintrc`, `pylintrc`, etc.)
- **Suppress selectively**: Use inline directives (`# noqa`, `// eslint-disable`) for justified violations only
- **Regular updates**: Keep analyzer versions in sync with language runtime updates

---

## Status

This is a stub. Expand with project-specific configurations as code analysis tooling is adopted.
