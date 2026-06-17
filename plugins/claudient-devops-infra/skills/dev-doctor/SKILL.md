---
name: "dev-doctor"
description: "Claude Code dev doctor: workflow guidelines, best practices, instructions, and integration examples"
---

# Dev Doctor

## When to activate
Activate when a user reports that "the app won't start", "the database isn't connecting", or when experiencing generic `ECONNREFUSED` or startup errors. Invoked via `/dev-doctor`.

## When NOT to use
Do not use for debugging specific syntax errors, failing unit tests, or logic bugs inside application code. This is strictly for *environment* and *infrastructure* health checks.

## Instructions
1. Pause whatever coding task you are currently on. You are now acting as a SysAdmin diagnosing a local developer environment.
2. Systematically check the following common failure points using shell commands:
    *   **Environment Variables:** Check if `.env.example` or `.env.template` exists. If it does, compare its keys against the actual `.env` file. Report any missing keys.
    *   **Ports in Use:** Look at the project's configuration (e.g., `docker-compose.yml`, `package.json` scripts) to find expected ports (e.g., 3000, 5432, 6379, 8080). Use `lsof -i :<port>` or `netstat -tuln | grep <port>` to check if those ports are already occupied by zombie processes.
    *   **Docker Daemon:** If the project uses Docker, run `docker info` to verify the Docker daemon is actually running.
    *   **Dependency Drift:** 
        * Node: Check if `node_modules` exists. Run `npm ls` or `yarn check` to see if dependencies need installing.
        * Python: Check if the virtual environment is activated and `pip freeze` matches `requirements.txt`.
3. Provide a clear, color-coded (using emojis) diagnostic report:
    *   🟢 Healthy
    *   🔴 Failing
    *   🟡 Warning
4. For any 🔴 Failing items, propose a direct fix (e.g., "Run `kill -9 1234` to free port 3000" or "Copy `.env.example` to `.env` and fill in `DATABASE_URL`"). Ask for permission before running the fix.

## Example
User: `/dev-doctor`
Claude: Running environment diagnostics...
*   🔴 **.env File:** Missing! Found `.env.example` but no `.env`.
*   🔴 **Ports:** Port 5432 is already in use by PID 8891 (looks like an older local postgres instance, not the docker container).
*   🟢 **Docker:** Daemon is running.
*   🟢 **Dependencies:** `node_modules` is present and up to date.

**Suggested Fixes:**
1. I can copy `.env.example` to `.env`.
2. I can kill PID 8891 to free up port 5432.
Shall I proceed with these fixes?