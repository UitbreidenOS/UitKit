# Docker Optimization

## When to activate

Building container images, reducing image size, or optimizing container runtime behavior.

## When NOT to use

For orchestration or multi-container deployment — use kubernetes-deployment skill instead.

## Instructions

1. Review Dockerfile for layer inefficiency
2. Suggest multi-stage builds and caching strategies
3. Run security scans on images
4. Validate runtime configuration

## Example

Reduce application image from 800MB to 120MB using distroless base and layer consolidation.
