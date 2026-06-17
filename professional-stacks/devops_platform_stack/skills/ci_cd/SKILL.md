# CI/CD Pipelines

## When to activate

Building, debugging, or optimizing CI/CD workflows in GitHub Actions, GitLab CI, or Jenkins.

## When NOT to use

For manual deployment runbooks — use deployment guides instead.

## Instructions

1. Parse pipeline YAML and identify bottlenecks
2. Validate job dependencies and parallel execution
3. Review secrets management and gating
4. Optimize build cache and artifact handling

## Example

Reduce pipeline duration from 45min to 18min by parallelizing tests and caching dependencies.
