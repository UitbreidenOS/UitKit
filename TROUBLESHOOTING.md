# Claudient Troubleshooting Guide

Master troubleshooting guide for the Claudient ecosystem. Common issues across **Skills & Agents**, **Plugin Marketplace**, and **MCP Integration**, with diagnostic commands and solutions.

---

## Quick Diagnostics

Run these commands first to identify your issue:

```bash
# Check Claude Code installation & environment
npx claudient doctor

# Audit your Claudient installation
npx claudient audit

# List all installed skills, agents, hooks
npx claudient list

# Check Node.js version (required: >=18)
node --version

# Verify Claude Code CLI is available
which claude

# Check .claude directory structure
ls -la ~/.claude/
```

---

## Feature 1: Installation & Version Conflicts

### Issue: `npx claudient: command not found`

**Symptom:** Installation failed or not in PATH.

**Diagnosis:**
```bash
npm list -g claudient
npm list -g @anthropic-ai/claude-code
```

**Solutions:**

1. **Reinstall claudient:**
   ```bash
   npm uninstall -g claudient
   npm install -g claudient@latest
   ```

2. **Update npm to latest:**
   ```bash
   npm install -g npm@latest
   npm cache clean --force
   npm install -g claudient
   ```

3. **Use npx directly (no global install):**
   ```bash
   npx claudient@latest doctor
   ```

4. **Check Node.js version (must be >=18):**
   ```bash
   node --version
   # If <18, upgrade Node.js
   nvm install 20
   nvm use 20
   ```

---

### Issue: `Could not find installation of Claude Code`

**Symptom:** Claudient detected but Claude Code CLI is not installed.

**Diagnosis:**
```bash
which claude
claude --version
npm list -g @anthropic-ai/claude-code
```

**Solutions:**

1. **Install Claude Code CLI:**
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```

2. **Verify Claude Code desktop app integration:**
   - Open Claude Code desktop app (Mac/Windows/Linux)
   - Enable CLI in Settings → Developer → CLI
   - CLI should appear after 1–2 minutes

3. **If using VS Code extension:**
   - Claude Code requires the CLI for skill installation
   - Terminal → Claude Code must show commands after install

---

### Issue: `Version conflict between Claudient and Claude Code`

**Symptom:** Error like `Claudient@1.10.1 requires claude-code@^2.5.0 but found @2.1.3`.

**Diagnosis:**
```bash
npm list -g claudient @anthropic-ai/claude-code
npx claudient doctor | grep -i version
```

**Solutions:**

1. **Update Claude Code to compatible version:**
   ```bash
   npm install -g @anthropic-ai/claude-code@latest
   npm install -g claudient@latest
   ```

2. **Check compatibility matrix:**
   | Claudient | Claude Code | Status |
   |---|---|---|
   | 1.10.x | 2.5+ | ✓ Compatible |
   | 1.9.x | 2.3–2.5 | ✓ Compatible |
   | 1.8.x | 2.1–2.3 | ✓ Compatible |

3. **Lock to known-good versions:**
   ```bash
   npm install -g @anthropic-ai/claude-code@2.5.1 claudient@1.10.1
   ```

---

### Issue: `Permission denied` when installing to ~/.claude

**Symptom:** Error: `EACCES: permission denied, mkdir '~/.claude/skills'`

**Diagnosis:**
```bash
ls -la ~/.claude/
whoami
id -G $USER
```

**Solutions:**

1. **Fix directory ownership:**
   ```bash
   mkdir -p ~/.claude/{skills,agents,hooks,rules}
   chown -R $(whoami) ~/.claude
   chmod -R 755 ~/.claude
   ```

2. **On macOS, if ~/. claude is protected:**
   ```bash
   # Check Full Disk Access (System Prefs → Security & Privacy)
   # Grant Terminal app Full Disk Access
   mkdir -p ~/.claude && chmod 755 ~/.claude
   ```

3. **Use sudo as last resort:**
   ```bash
   sudo mkdir -p ~/.claude/{skills,agents,hooks,rules}
   sudo chown -R $(whoami) ~/.claude
   ```

---

## Feature 2: Skills & Agents Installation

### Issue: `npx claudient add skills backend` fails silently

**Symptom:** Command exits without output or error.

**Diagnosis:**
```bash
# Run with verbose logging
DEBUG=* npx claudient add skills backend

# Check if skills directory exists
ls -la ~/.claude/skills/

# Test manifest validation
npx claudient validate:manifests
```

**Solutions:**

1. **Clear npm cache and retry:**
   ```bash
   npm cache clean --force
   npx claudient add skills backend --force
   ```

2. **Check disk space:**
   ```bash
   df -h ~
   # Claudient needs ≥500MB free space
   ```

3. **Validate package.json:**
   ```bash
   npm ls claudient
   npm outdated
   ```

4. **Reinstall from scratch:**
   ```bash
   rm -rf ~/.claude/skills ~/.claude/agents
   npx claudient add all
   ```

---

### Issue: Skills not appearing in Claude Code after installation

**Symptom:** Ran `npx claudient add skills backend` but `/swift-backend` doesn't trigger.

**Diagnosis:**
```bash
# Check installed skills
ls -la ~/.claude/skills/backend/

# Verify skill frontmatter
head -20 ~/.claude/skills/backend/swift-backend.md

# Check Claude Code can read them
cd ~/.claude && ls -la
```

**Solutions:**

1. **Reload Claude Code session:**
   - Exit Claude Code completely (Cmd+Q / Ctrl+Alt+Q)
   - Reopen Claude Code
   - Run `/list-skills` or `/help` to refresh

2. **Verify skill frontmatter (first 20 lines must have YAML):**
   ```bash
   head -20 ~/.claude/skills/backend/swift.md | grep -E "^(name|trigger|description):"
   ```

3. **Check Claude Code settings:**
   - Open `~/.claude/settings.json`
   - Verify `"skills": { "enabled": true }`
   ```json
   {
     "skills": {
       "enabled": true,
       "searchPath": "~/.claude/skills"
     }
   }
   ```

4. **Rebuild skill index:**
   ```bash
   npx claudient build-index
   npx claudient add all --force
   ```

---

### Issue: `Agent not spawning` or error `Unknown agent: sre-engineer`

**Symptom:** Running `claude --agent sre-engineer` fails or agent doesn't load.

**Diagnosis:**
```bash
# List installed agents
ls -la ~/.claude/agents/

# Check agent manifest
ls -la ~/.claude/agents/roles/ | grep sre

# Validate agent frontmatter
head -30 ~/.claude/agents/roles/sre-engineer.md
```

**Solutions:**

1. **Install agents explicitly:**
   ```bash
   npx claudient add agents
   ```

2. **Check if agent is in correct subdirectory:**
   ```bash
   # Agents must be in ~/.claude/agents/[roles|advisors|specialists]/
   mv ~/.claude/agents/sre-engineer.md ~/.claude/agents/roles/sre-engineer.md
   ```

3. **Verify agent YAML frontmatter (must be valid YAML):**
   ```bash
   # Should output valid YAML
   sed -n '1,/^---$/p' ~/.claude/agents/roles/sre-engineer.md
   ```

4. **Reload Claude Code and re-register agent:**
   ```bash
   claude --reload
   claude --agent sre-engineer --test
   ```

---

### Issue: Agent spawned but `"permission denied"` errors on tool use

**Symptom:** Agent triggers but fails: `Tool "bash" not allowed in subagent context`.

**Diagnosis:**
```bash
# Check agent tool restrictions
grep -A 10 "tools:" ~/.claude/agents/roles/sre-engineer.md

# Check Claude Code global permissions
cat ~/.claude/settings.json | jq '.permissions'
```

**Solutions:**

1. **Agent has intentionally restricted tools** — this is by design for security:
   - Security reviewer cannot modify files
   - Compliance agent cannot execute commands
   - This is a feature, not a bug

2. **If you need to override restrictions** (not recommended):
   ```bash
   # Edit ~/.claude/settings.json
   {
     "permissions": {
       "subagents": {
         "allowAllTools": false,
         "overrides": {
           "sre-engineer": {
             "bash": true,
             "file-edit": true
           }
         }
       }
     }
   }
   ```

3. **Use a less restricted agent instead:**
   ```bash
   # sre-engineer is read-only by design
   # Use: architect (broader permissions), or codebase-orchestrator
   claude --agent architect
   ```

---

## Feature 3: Plugin Marketplace Installation

### Issue: `/plugin marketplace add Claudient/Claudient` fails

**Symptom:** Error: `Invalid marketplace URL` or `Not found`.

**Diagnosis:**
```bash
# Check if plugin system is enabled
cat ~/.claude/settings.json | jq '.plugin'

# Test marketplace.json accessibility
curl -s https://raw.githubusercontent.com/Claudient/Claudient/main/.claude-plugin/marketplace.json | jq '.name'

# Check Claude Code version supports plugins (requires 2.5+)
claude --version
```

**Solutions:**

1. **Ensure Claude Code 2.5+ is installed:**
   ```bash
   npm install -g @anthropic-ai/claude-code@latest
   claude --version
   # Should show >=2.5.0
   ```

2. **Enable plugins in settings:**
   ```bash
   # Edit ~/.claude/settings.json
   {
     "plugin": {
       "enabled": true,
       "searchPath": "~/.claude/plugins"
     }
   }
   ```

3. **Retry marketplace add:**
   ```bash
   /plugin marketplace add Claudient/Claudient
   # Or via CLI:
   npx claudient plugin:marketplace:add Claudient/Claudient
   ```

4. **If GitHub is unreachable:**
   ```bash
   # Check network connectivity
   ping github.com
   curl -I https://github.com

   # Try with explicit timeout
   npm config set fetch-timeout 60000
   /plugin marketplace add Claudient/Claudient
   ```

---

### Issue: `/plugin install claudient-everything@claudient` fails or hangs

**Symptom:** Command hangs for >5 minutes or returns `Failed to download plugin`.

**Diagnosis:**
```bash
# Check marketplace catalog is cached
ls -la ~/.claude/plugin-cache/

# Test individual plugin manifest
curl -s https://raw.githubusercontent.com/Claudient/Claudient/main/plugins/claudient-everything/manifest.json | jq '.name'

# Monitor disk usage
df -h ~
du -sh ~/.claude/plugins/
```

**Solutions:**

1. **Clear plugin cache and retry:**
   ```bash
   rm -rf ~/.claude/plugin-cache
   /plugin install claudient-everything@claudient
   ```

2. **Install domain plugins instead (lighter-weight):**
   ```bash
   # Instead of claudient-everything, try:
   /plugin install claudient-backend@claudient
   /plugin install claudient-devops-infra@claudient
   /plugin install claudient-productivity@claudient
   ```

3. **Check available disk space:**
   ```bash
   df -h
   # Each plugin requires ~50-200MB
   # claudient-everything needs ~1.5GB
   ```

4. **Use CLI fallback if plugin system fails:**
   ```bash
   npx claudient add all
   npx claudient add skills backend
   npx claudient add agents
   ```

---

### Issue: Installed plugin not activating in Claude Code

**Symptom:** `/plugin list` shows `claudient-backend` installed, but skills don't trigger.

**Diagnosis:**
```bash
# Check plugin installation directory
ls -la ~/.claude/plugins/

# Verify plugin.json manifest
cat ~/.claude/plugins/claudient-backend/plugin.json | jq '.components'

# Check if Claude Code reloaded plugin list
claude --reload-plugins
```

**Solutions:**

1. **Reload Claude Code plugin system:**
   ```bash
   # In Claude Code:
   /plugin reload
   /plugin list
   ```

2. **Force plugin re-registration:**
   ```bash
   /plugin uninstall claudient-backend@claudient
   /plugin install claudient-backend@claudient
   ```

3. **Check plugin manifest structure:**
   ```bash
   # Should contain skills, agents, hooks sections
   cat ~/.claude/plugins/claudient-backend/plugin.json | jq '.components | keys'
   # Output: ["skills", "agents", "hooks"]
   ```

4. **Restart Claude Code desktop app completely:**
   - Quit app (Cmd+Q / Ctrl+Alt+Q)
   - Wait 3 seconds
   - Reopen and wait for plugin load banner

---

## Feature 4: MCP Integration

### Issue: MCP server fails to connect during skill use

**Symptom:** Error: `MCP server "postgres" not found` when running `/db-query`.

**Diagnosis:**
```bash
# List enabled MCP servers
cat ~/.claude/settings.json | jq '.mcp'

# Check if server is running
ps aux | grep mcp

# Test MCP server connection
curl http://localhost:3000/health  # if applicable
```

**Solutions:**

1. **Install MCP server config:**
   ```bash
   npx claudient add mcp starter
   # Or specific server:
   npx claudient add mcp postgres
   ```

2. **Add MCP server to settings.json:**
   ```bash
   # Edit ~/.claude/settings.json
   {
     "mcp": {
       "servers": {
         "postgres": {
           "command": "node",
           "args": ["/path/to/postgres-mcp/server.js"],
           "env": {
             "DB_HOST": "localhost",
             "DB_PORT": "5432",
             "DB_USER": "postgres"
           }
         }
       }
     }
   }
   ```

3. **Verify MCP server is installed globally:**
   ```bash
   npm install -g @mcp/postgres
   which postgres-mcp
   ```

4. **Start MCP server manually first:**
   ```bash
   postgres-mcp &
   # Then reload Claude Code
   claude --reload
   ```

---

### Issue: MCP server crashes with `ENOENT: no such file or directory`

**Symptom:** MCP connects briefly then crashes, error mentions missing config file.

**Diagnosis:**
```bash
# Check MCP server logs
tail -f ~/.claude/logs/mcp-*.log

# Verify config file exists
cat ~/.claude/mcp/postgres.json

# Check environment variables
env | grep DB_
```

**Solutions:**

1. **Create missing config file:**
   ```bash
   npx claudient add mcp postgres --generate-config
   # Or manually:
   cat > ~/.claude/mcp/postgres.json << 'EOF'
   {
     "host": "localhost",
     "port": 5432,
     "database": "postgres",
     "user": "postgres",
     "password": "YOUR_PASSWORD"
   }
   EOF
   chmod 600 ~/.claude/mcp/postgres.json  # Restrict permissions
   ```

2. **Set environment variables:**
   ```bash
   export DB_HOST=localhost
   export DB_PORT=5432
   export DB_USER=postgres
   export DB_PASSWORD=YOUR_PASSWORD
   ```

3. **Update MCP config path in settings.json:**
   ```bash
   {
     "mcp": {
       "servers": {
         "postgres": {
           "configPath": "~/.claude/mcp/postgres.json"
         }
       }
     }
   }
   ```

4. **Test MCP connection independently:**
   ```bash
   npm install -g @mcp/postgres
   postgres-mcp --config ~/.claude/mcp/postgres.json
   ```

---

## Feature 5: Permission Errors

### Issue: `PERMISSION_DENIED` when running bash commands in skills

**Symptom:** Skill executes but fails: `Permission denied on tool: "bash"`.

**Diagnosis:**
```bash
# Check Claude Code permissions policy
cat ~/.claude/settings.json | jq '.permissions'

# Check if bash is in allow/block list
grep -i "bash\|shell" ~/.claude/settings.json

# Test manually
echo "test" | bash
```

**Solutions:**

1. **Allow bash in settings.json:**
   ```bash
   # Edit ~/.claude/settings.json
   {
     "permissions": {
       "allowedTools": ["bash", "file-edit", "web-search"]
     }
   }
   ```

2. **Use auto-allowlist for common tools:**
   ```bash
   npx claudient add hook auto-allow-readonly
   # This auto-approves safe read-only tools (ls, cat, grep, etc.)
   ```

3. **Check if permission hook is active:**
   ```bash
   ls ~/.claude/hooks/permission/
   # Should show: auto-allow-readonly.sh
   ```

4. **Grant session-level permissions:**
   - Start Claude Code with: `claude --allow-bash`
   - Or in settings: `"sessionPermissions": ["bash"]`

---

### Issue: `Secret-scanner hook blocked write` when committing code

**Symptom:** Skill tries to write file but hook blocks: `Potential credential detected in output`.

**Diagnosis:**
```bash
# Check if secret-scanner hook is active
ls ~/.claude/hooks/pre-tool-use/ | grep secret

# View secret patterns it's checking
cat ~/.claude/hooks/pre-tool-use/secret-scanner.sh | grep -A 5 "patterns="
```

**Solutions:**

1. **Disable false-positive for safe values:**
   ```bash
   # Edit ~/.claude/hooks/pre-tool-use/secret-scanner.sh
   # Whitelist known safe patterns (e.g., DEMO_ prefixed vars)
   ```

2. **Use plaintext placeholders instead of real secrets:**
   ```bash
   # Instead of:
   export API_KEY=sk-123abc...
   
   # Use:
   export API_KEY=YOUR_API_KEY_HERE
   ```

3. **Store secrets outside Claude Code:**
   ```bash
   # Create .env file (gitignored) and load separately
   echo "API_KEY=..." > .env.local
   # Reference in code: $API_KEY (sourced from shell, not Claude)
   ```

4. **Disable hook temporarily if needed (not recommended):**
   ```bash
   mv ~/.claude/hooks/pre-tool-use/secret-scanner.sh ~/.claude/hooks/pre-tool-use/secret-scanner.sh.bak
   ```

---

## Feature 6: Performance Issues

### Issue: Claude Code is slow to load skills (hangs for 10+ seconds)

**Symptom:** First command in session hangs before executing.

**Diagnosis:**
```bash
# Measure Claude Code startup time
time claude --help

# Check if skills are too large
du -sh ~/.claude/skills/

# Monitor CPU/memory during load
top -n1 | head -20
```

**Solutions:**

1. **Install only needed skill categories:**
   ```bash
   # Instead of: npx claudient add all
   npx claudient add skills backend
   npx claudient add skills devops-infra
   # Uninstall unused:
   rm -rf ~/.claude/skills/legal ~/.claude/skills/finance
   ```

2. **Rebuild skill index:**
   ```bash
   npx claudient build-index
   ```

3. **Increase Claude Code cache timeout:**
   ```bash
   # Edit ~/.claude/settings.json
   {
     "cache": {
       "skillIndexTTL": 3600,
       "agentListTTL": 1800
     }
   }
   ```

4. **Use minimal skill set:**
   ```bash
   rm -rf ~/.claude/skills
   mkdir -p ~/.claude/skills
   # Copy only 3-5 most-used skills manually
   ```

---

### Issue: Integration failures — `Agent timeout after 30s`

**Symptom:** Running `/security-audit` succeeds initially but times out mid-execution.

**Diagnosis:**
```bash
# Check agent timeout settings
cat ~/.claude/settings.json | jq '.agent.timeout'

# Monitor agent memory usage
ps aux | grep claude

# Check if slow I/O (e.g., git repo scan)
time git status  # in your project repo
```

**Solutions:**

1. **Increase agent timeout:**
   ```bash
   # Edit ~/.claude/settings.json
   {
     "agent": {
       "timeout": 120000  # Increase from 30s to 2m
     }
   }
   ```

2. **Optimize skill for large projects:**
   ```bash
   # Edit the skill to add file limits
   # E.g., /security-audit should skip node_modules, .git
   echo "*.md,*.js,*.ts" > ~/.claude/skills/audit-scope.txt
   ```

3. **Check for blocking I/O:**
   ```bash
   # If in large git repo, clone is slow
   # Pre-clone or use shallow clone
   git clone --depth 1 https://repo.git
   ```

4. **Split work across multiple agent calls:**
   ```bash
   # Instead of /security-audit (entire project)
   # Run: /security-audit --file src/critical-auth.js
   ```

---

## Diagnostic Commands Summary

Keep this checklist for quick diagnosis:

```bash
# Environment & installation
node --version                      # Should be >=18
npm list -g claudient              # Check claudient version
which claude                        # Claude Code CLI location
claude --version                    # Check Claude Code version
npx claudient doctor               # Full system diagnosis

# Skills & agents
ls -la ~/.claude/skills/           # List installed skills
npx claudient list                 # All installed skills/agents
npx claudient validate             # Validate skill YAML
npx claudient build-index          # Rebuild search index

# Plugins
/plugin list                        # List installed plugins
cat ~/.claude/settings.json | jq .plugin  # Plugin settings
/plugin validate                   # Check plugin manifests

# MCP
cat ~/.claude/settings.json | jq .mcp  # MCP server configs
ps aux | grep mcp                  # Check running MCP servers

# Permissions
cat ~/.claude/settings.json | jq .permissions  # Permission policy

# Performance
du -sh ~/.claude/                  # Disk usage
du -sh ~/.claude/skills/           # Skills directory size
time npx claudient list            # Measure command latency
```

---

## Integration Failures — Common Root Causes

| Symptom | Root Cause | Solution |
|---|---|---|
| **Skill doesn't run** | Skill YAML frontmatter is malformed | `npx claudient validate:frontmatter` |
| **Agent spawns but fails** | Tool not in agent's allowed list | Check agent frontmatter `tools:` section |
| **MCP server "not found"** | MCP not registered in settings.json | `npx claudient add mcp [server-name]` |
| **Plugin installs but doesn't activate** | Claude Code not reloaded after install | `/plugin reload` then quit/reopen app |
| **Permission denied on file edit** | `bash` not in `allowedTools` | Add to `~/.claude/settings.json` permissions |
| **Hook not firing** | Hook script not executable | `chmod +x ~/.claude/hooks/**/*.sh` |
| **Skills appear but trigger fails** | Frontmatter trigger keywords misspelled | Check skill YAML `trigger:` field matches usage |
| **Agent timeout** | Project too large or MCP server slow | Increase `agent.timeout` in settings |
| **Marketplace add fails** | GitHub API rate limit or network down | Retry later or use CLI: `npx claudient add all` |

---

## Getting More Help

- **Documentation:** [Getting Started Guide](guides/getting-started.md)
- **Skill Format:** [Skills Frontmatter Reference](guides/skills-frontmatter.md)
- **Agent Format:** [Agent Frontmatter Reference](guides/agent-frontmatter.md)
- **Plugin Authoring:** [Plugin Authoring Guide](guides/plugin-authoring.md)
- **GitHub Issues:** [Claudient/Claudient Issues](https://github.com/Claudient/Claudient/issues)
- **Reddit:** [r/uitbreiden](https://www.reddit.com/r/uitbreiden/)

---

## Version Information

| Component | Version | Release Date |
|---|---|---|
| Claudient | 1.10.1 | 2026-06-22 |
| Claude Code CLI | 2.5+ | Required minimum |
| Node.js | 18+ | Required minimum |
| Plugin System | 2.5+ | Requires Claude Code 2.5+ |
| MCP Spec | 1.0+ | Current standard |

---

**Last updated: 2026-06-22**  
**Maintainer:** [Uitbreiden](https://uitbreiden.com/)
