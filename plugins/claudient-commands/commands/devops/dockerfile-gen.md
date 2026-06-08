---
description: Generate a production-ready Dockerfile for the current project
argument-hint: "[language/runtime] [optional: base-image]"
---
Analyze the current project and generate a production-ready Dockerfile. Use $ARGUMENTS to infer the target language/runtime and optional base image override.

Steps:
1. Inspect the project root for package manifests (package.json, requirements.txt, go.mod, Cargo.toml, pom.xml, build.gradle, Gemfile, composer.json, etc.) to detect the stack automatically. If $ARGUMENTS provides a language or runtime, prefer that.
2. Identify the application entry point and build steps.
3. Choose the smallest appropriate base image (alpine, distroless, slim) unless $ARGUMENTS specifies otherwise.
4. Apply multi-stage build if there is a compile/build step — separate builder and runtime stages.
5. Set a non-root USER. Assign explicit numeric UID (e.g., 1001) for Kubernetes compatibility.
6. Copy only what the runtime needs; exclude dev dependencies, test fixtures, and secrets.
7. Set WORKDIR, EXPOSE, ENV, and ENTRYPOINT/CMD correctly.
8. Add a HEALTHCHECK instruction using the app's likely health endpoint or a simple process check.
9. Pin all base image tags to a specific digest or version — never use `latest`.
10. Add inline comments only where the choice is non-obvious (e.g., why a specific base image or flag was chosen).
11. Output a `.dockerignore` file alongside the Dockerfile that excludes: `.git`, `node_modules`, `__pycache__`, test directories, `.env*`, local build artifacts.

After generating, list any assumptions made (e.g., inferred port, assumed entry point) and flag any manual steps the developer must complete (e.g., secret injection, build-arg values).

Do not add placeholder ARGs or ENV variables that serve no purpose. Do not emit marketing commentary or explanatory prose outside of inline code comments.
