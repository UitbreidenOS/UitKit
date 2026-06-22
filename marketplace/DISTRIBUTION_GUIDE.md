# Plugin Distribution Guide

This guide covers how to distribute Claudient plugins through multiple channels: npm registry, GitHub releases, marketplace submission, and versioning strategy.

## Overview

Claudient plugins can be distributed through three primary channels:

1. **npm Registry** — For programmatic installation and dependency management
2. **GitHub Releases** — For direct downloads and version control
3. **Claudient Marketplace** — For discoverability and ecosystem integration

Each channel serves different use cases; most publishers use all three.

---

## Part 1: npm Package Publishing

### Prerequisites

- npm account with verified email ([npmjs.com](https://npmjs.com))
- Two-factor authentication enabled (required for package management)
- `npm` CLI installed locally (`npm --version`)
- Proper `package.json` configuration

### Step 1: Prepare Your package.json

Ensure your plugin's root `package.json` is properly configured:

```json
{
  "name": "@claudient/plugin-your-plugin-name",
  "version": "1.0.0",
  "description": "One-line plugin description (80 chars max)",
  "main": "index.js",
  "files": [
    "skills/",
    "agents/",
    "hooks/",
    "mcp/",
    "workflows/",
    ".claude-plugin/",
    "README.md",
    "CLAUDE.md",
    "LICENSE"
  ],
  "keywords": ["claude-code", "claudient", "plugin", "domain"],
  "author": {
    "name": "Your Name",
    "email": "you@example.com",
    "url": "https://github.com/yourname"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourname/plugin-repo"
  },
  "homepage": "https://github.com/yourname/plugin-repo#readme",
  "bugs": {
    "url": "https://github.com/yourname/plugin-repo/issues"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

### Step 2: Prepare Distribution Files

Before publishing, ensure these files exist:

```
your-plugin/
├── package.json          (configured as above)
├── README.md            (overview + installation)
├── CLAUDE.md            (plugin principles)
├── LICENSE              (MIT or compatible)
├── .claude-plugin/      (metadata)
│   └── plugin.json      (see Part 3)
├── .npmignore           (exclude non-essential files)
├── skills/              (your skills)
├── agents/              (your agents)
├── hooks/               (your hooks)
└── mcp/                 (your MCP configs)
```

### Step 3: Create .npmignore

Exclude unnecessary files from npm package:

```
.git*
.claude/
.vscode/
node_modules/
*.test.js
*.spec.js
examples/
docs/
audit_*.py
cleanup_*.py
*.sh
.env
.env.local
development.md
.claude-plugin/ (if distributing as marketplace-only)
```

### Step 4: Login to npm

```bash
npm login
# Enter username, password, and OTP when prompted
```

Verify authentication:

```bash
npm whoami
```

### Step 5: Publish to npm

Before publishing, test locally:

```bash
# Test package contents
npm pack

# Simulate installation
npm install ./your-plugin-1.0.0.tgz

# Verify installation
ls node_modules/@claudient/plugin-your-plugin-name/
```

Publish to npm:

```bash
npm publish
```

### Step 6: Verify Publication

```bash
# Check package on npm
npm view @claudient/plugin-your-plugin-name

# Test installation
npm install @claudient/plugin-your-plugin-name

# Verify version
npm list @claudient/plugin-your-plugin-name
```

### Troubleshooting npm Publishing

| Issue | Solution |
|-------|----------|
| Package already exists | Change version in `package.json` and retry |
| 403 Forbidden | Ensure two-factor auth is enabled; use `npm publish --otp=XXXXXX` |
| File size too large | Add files to `.npmignore` or reduce media assets |
| Invalid package name | Names must match regex `/^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/` |

---

## Part 2: GitHub Releases & Downloads

### Step 1: Create Release Artifacts

Package your plugin for direct download:

```bash
# Create distributable archive
mkdir -p dist/
tar -czf dist/plugin-your-plugin-name-1.0.0.tar.gz \
  skills/ agents/ hooks/ mcp/ workflows/ \
  README.md CLAUDE.md .claude-plugin/ LICENSE

# Create checksum
shasum -a 256 dist/plugin-your-plugin-name-1.0.0.tar.gz > dist/CHECKSUMS.txt
```

### Step 2: Prepare Release Notes

Create `RELEASE_NOTES.md`:

```markdown
# Release v1.0.0

## What's New

- Initial release with 5 core skills
- 3 example workflows
- Full documentation

## Installation

### Via npm
\`\`\`bash
npm install @claudient/plugin-your-plugin-name
\`\`\`

### Via Direct Download
[Download plugin-your-plugin-name-1.0.0.tar.gz](https://github.com/yourname/plugin-repo/releases/download/v1.0.0/plugin-your-plugin-name-1.0.0.tar.gz)

## Breaking Changes

None.

## Migration Guide

No action required if upgrading from 0.x releases.

## Contributors

Thanks to @contributor1, @contributor2, and all community members who reported issues.

## Verification

```bash
shasum -a 256 -c CHECKSUMS.txt
```

## Known Issues

- [Issue #123](https://github.com/yourname/plugin-repo/issues/123): Performance regression on large datasets (fixed in v1.0.1)
```

### Step 3: Create GitHub Release (CLI)

Using GitHub CLI:

```bash
# Create release with draft status
gh release create v1.0.0 \
  --title "Release v1.0.0" \
  --notes-file RELEASE_NOTES.md \
  --draft

# Upload assets
gh release upload v1.0.0 dist/plugin-your-plugin-name-1.0.0.tar.gz
gh release upload v1.0.0 dist/CHECKSUMS.txt

# Publish release (removes draft status)
gh release edit v1.0.0 --draft=false
```

### Step 4: Create GitHub Release (Web UI)

1. Go to your repository → Releases
2. Click "Draft a new release"
3. Tag version: `v1.0.0`
4. Release title: `Release v1.0.0`
5. Description: Paste contents of `RELEASE_NOTES.md`
6. Attach files: Upload `.tar.gz` and `CHECKSUMS.txt`
7. Set as latest release (if applicable)
8. Publish

### Step 5: Enable Auto-Generated Changelog

Add `.github/release.yml`:

```yaml
changelog:
  exclude:
    labels:
      - ignore-changelog
    authors:
      - dependabot
  categories:
    - title: Breaking Changes
      labels:
        - breaking
    - title: Features
      labels:
        - enhancement
        - feature
    - title: Bug Fixes
      labels:
        - fix
        - bugfix
    - title: Documentation
      labels:
        - documentation
    - title: Maintenance
      labels:
        - chore
        - maintenance
```

---

## Part 3: Claudient Marketplace Submission

### Step 1: Prepare Marketplace Metadata

Create `.claude-plugin/plugin.json` in your plugin root:

```json
{
  "name": "Your Plugin Name",
  "id": "your-plugin-id",
  "version": "1.0.0",
  "description": "One-line description (80 chars max)",
  "longDescription": "2-3 sentence detailed description of what the plugin does and who it's for.",
  "author": {
    "name": "Your Name",
    "email": "you@example.com",
    "url": "https://github.com/yourname",
    "type": "community"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourname/plugin-repo"
  },
  "homepage": "https://github.com/yourname/plugin-repo",
  "bugs": "https://github.com/yourname/plugin-repo/issues",
  "category": "backend",
  "tags": [
    "framework",
    "api",
    "production"
  ],
  "keywords": [
    "fastapi",
    "python",
    "rest-api"
  ],
  "minClaudeCodeVersion": "1.0.0",
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "skills": [
    {
      "id": "skill-one",
      "name": "Skill One",
      "file": "skills/skill-one/README.md",
      "status": "active"
    }
  ],
  "agents": [
    {
      "id": "agent-one",
      "name": "Agent One",
      "file": "agents/agent-one/README.md",
      "status": "active"
    }
  ],
  "hooks": [
    {
      "id": "hook-one",
      "name": "Hook One",
      "file": "hooks/hook-one.md",
      "status": "active"
    }
  ],
  "mcp": [
    {
      "name": "mcp-server-name",
      "file": "mcp/server-config.json",
      "status": "active"
    }
  ],
  "workflows": [
    {
      "id": "workflow-one",
      "name": "Workflow One",
      "file": "workflows/workflow-one.md",
      "status": "active"
    }
  ],
  "releaseNotes": "Initial release with core skills",
  "changelog": "https://github.com/yourname/plugin-repo/releases",
  "icon": "🎯",
  "banner": "skills/screenshot.png",
  "ratings": {
    "average": 0,
    "count": 0
  },
  "downloadCount": 0,
  "installCount": 0,
  "lastUpdated": "2026-06-22T00:00:00Z",
  "certified": false,
  "featured": false,
  "languages": ["en"]
}
```

### Step 2: Create Marketplace README

Create or update `README.md` in your plugin root with marketplace-specific sections:

```markdown
# Your Plugin Name

[One-line description]

## Overview

[Who is this for? What problems does it solve?]

## Features

- Feature one
- Feature two
- Feature three

## Components

### Skills

- **Skill Name** — Description
  - When to use: Context
  - Example: `claude /skill-name <args>`

### Agents

- **Agent Name** — Description
  - When to delegate: Conditions

### MCP Integrations

- **Tool Name** — Description

## Installation

### Via npm

```bash
npm install @claudient/plugin-your-plugin-name
```

### Via Claude Code Marketplace

```bash
claude marketplace install your-plugin-id
```

### Via GitHub Release

1. Download `plugin-your-plugin-name-1.0.0.tar.gz` from [Releases](https://github.com/yourname/plugin-repo/releases)
2. Extract to `~/.claude/marketplace/your-plugin-id/`
3. Restart Claude Code

## Quick Start

[2-3 steps to get started]

## Examples

- [Example 1: Use case](examples/example-1.md)
- [Example 2: Use case](examples/example-2.md)

## Directory Structure

```
your-plugin/
├── skills/      # Slash command definitions
├── agents/      # Subagent configurations
├── hooks/       # Event-triggered automations
├── mcp/         # Tool integrations
├── workflows/   # Multi-step processes
└── examples/    # Concrete, runnable examples
```

## Support & Contributing

- **Issues:** [GitHub Issues](https://github.com/yourname/plugin-repo/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourname/plugin-repo/discussions)
- **Contributing:** See [CONTRIBUTING.md](CONTRIBUTING.md)

## License

MIT License — See [LICENSE](LICENSE)

## Acknowledgments

[List contributors, inspirations, references]
```

### Step 3: Submit to Marketplace

1. **Fork** the Claudient repository: `github.com/claudients/claudient`
2. **Create a feature branch:**
   ```bash
   git checkout -b submit/your-plugin-name
   ```
3. **Add your plugin to `plugins/`:**
   ```
   plugins/your-plugin-name/
   ├── .claude-plugin/plugin.json
   ├── README.md
   ├── CLAUDE.md
   ├── skills/
   ├── agents/
   └── [other components]
   ```
4. **Update marketplace catalog** (see VETTING.md for instructions)
5. **Open a PR** with description:
   ```
   ## Plugin Submission: Your Plugin Name

   - [ ] Follows Claudient structure
   - [ ] README and CLAUDE.md complete
   - [ ] All examples tested
   - [ ] Code of conduct compliance confirmed
   - [ ] License specified (MIT/Apache 2.0/CC-BY-SA-4.0)

   **Plugin ID:** your-plugin-id
   **Category:** backend
   **Author:** Your Name (@yourname)

   ### Description
   [2-3 sentences]

   ### Components
   - 3 skills
   - 1 agent
   - 1 workflow

   ### Links
   - GitHub: https://github.com/yourname/plugin-repo
   - Docs: [link]
   ```
6. **Address review feedback** (typically 5-7 business days)
7. **Merge** — Plugin appears in marketplace within 24 hours

---

## Part 4: Versioning Strategy

### Semantic Versioning (SemVer)

Follow [semver.org](https://semver.org) strictly:

- **MAJOR** (X.0.0) — Breaking changes to skill signatures, removed agents, incompatible API changes
- **MINOR** (0.X.0) — New backwards-compatible features, new skills, new agents
- **PATCH** (0.0.X) — Bug fixes, documentation, internal improvements

### Examples

| Change | Version | Reason |
|--------|---------|--------|
| New skill added | 1.0.0 → 1.1.0 | MINOR: backwards compatible |
| Skill parameter renamed | 1.1.0 → 2.0.0 | MAJOR: breaking change |
| Bug in hook fixed | 1.1.0 → 1.1.1 | PATCH: internal fix |
| Agent removed | 1.1.0 → 2.0.0 | MAJOR: breaking change |
| Documentation improved | 1.1.0 → 1.1.1 | PATCH: no code change |
| New language translation | 1.1.0 → 1.2.0 | MINOR: adds capability |
| MCP tool upgraded | 1.1.0 → 1.2.0 | MINOR: if backwards compatible |

### Version Constraints

Specify minimum Claude Code version in `plugin.json`:

```json
{
  "minClaudeCodeVersion": "1.0.0",
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

### Git Tags

Tag each release:

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### Changelog Maintenance

Maintain `CHANGELOG.md` in project root:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-22

### Added
- Initial release with 5 core skills
- Support for Python 3.9+
- Example workflows for common patterns

### Changed
- [internal] Refactored skill loader

### Fixed
- Bug #45: Incorrect parameter parsing in skill-one

### Deprecated
- Old hook format (use new format instead)

### Removed
- Deprecated agent-old (use agent-new)

### Security
- Fixed XSS vulnerability in workflow templates

## [0.9.0] - 2026-06-15

### Added
- Beta release
- 3 community skills

[Full git log](https://github.com/yourname/plugin-repo/commits)
```

### Pre-Release Versions

For beta/alpha releases:

- **Alpha:** `1.0.0-alpha.1`, `1.0.0-alpha.2`
- **Beta:** `1.0.0-beta.1`, `1.0.0-beta.2`
- **Release Candidate:** `1.0.0-rc.1`, `1.0.0-rc.2`

Publish pre-releases to npm with tag:

```bash
npm publish --tag beta
npm publish --tag rc

# Users install with:
npm install @claudient/plugin-name@beta
npm install @claudient/plugin-name@rc
```

---

## Part 5: Complete Distribution Checklist

### Before Release

- [ ] `package.json` version updated
- [ ] `CHANGELOG.md` updated with new features/fixes
- [ ] `.claude-plugin/plugin.json` updated
- [ ] All skills/agents have README.md files
- [ ] Examples tested and working
- [ ] Documentation links validated
- [ ] Git repository is public
- [ ] License file present (MIT/Apache 2.0/CC-BY-SA-4.0)
- [ ] Code of conduct compliance confirmed

### npm Publication

- [ ] `.npmignore` configured
- [ ] `publishConfig` in `package.json` set to public
- [ ] Two-factor authentication enabled on npm
- [ ] `npm login` successful
- [ ] `npm pack` creates correct file structure
- [ ] `npm publish` succeeds
- [ ] `npm view` shows package metadata
- [ ] Installation test succeeds

### GitHub Release

- [ ] Git tag created (`git tag v1.0.0`)
- [ ] Release artifacts generated (`.tar.gz`)
- [ ] Checksums generated (`CHECKSUMS.txt`)
- [ ] Release notes prepared
- [ ] GitHub CLI or web UI used to publish
- [ ] Assets attached to release
- [ ] Release marked as latest (if applicable)

### Marketplace Submission

- [ ] `.claude-plugin/plugin.json` complete
- [ ] README.md marketplace-friendly
- [ ] CLAUDE.md and CONTRIBUTING.md created
- [ ] Fork of `github.com/claudients/claudient` created
- [ ] Plugin added to `plugins/` directory
- [ ] PR opened with complete description
- [ ] PR addressed all review feedback
- [ ] PR merged to main branch

### Ongoing Maintenance

- [ ] Bugfix releases published within 48 hours
- [ ] Security updates published immediately
- [ ] GitHub issues responded to within 2 weeks
- [ ] Monthly release notes published
- [ ] Marketplace metadata kept up-to-date
- [ ] npm and GitHub versions stay in sync

---

## Part 6: Troubleshooting Distribution Issues

### npm Publishing

**Problem:** `npm ERR! 403 Forbidden`

**Solutions:**
1. Enable two-factor authentication: `npm profile set 2fa on`
2. Use OTP when publishing: `npm publish --otp=XXXXXX`
3. Check organization permissions (if scoped package)
4. Verify package name availability

**Problem:** Package not found after publishing

**Solutions:**
1. npm has 5-10 minute index lag; check again later
2. Verify package name: `npm view @claudient/plugin-name`
3. Check npm account dashboard for recent publishes
4. Verify you're logged into correct account: `npm whoami`

### GitHub Releases

**Problem:** Release not appearing in marketplace

**Solutions:**
1. Verify git tag matches release version: `git tag -l`
2. Ensure `.claude-plugin/plugin.json` is in tagged commit
3. Check marketplace indexing (24-hour lag possible)
4. Manually update marketplace catalog.json if needed

**Problem:** Checksum verification fails

**Solutions:**
1. Regenerate checksums: `shasum -a 256 plugin-*.tar.gz > CHECKSUMS.txt`
2. Ensure file wasn't corrupted during upload
3. Re-upload file to release

### Marketplace Submission

**Problem:** PR rejected for missing files

**Solutions:**
1. Review VETTING.md criteria checklist
2. Add missing README.md, CLAUDE.md, LICENSE
3. Ensure plugin.json is valid JSON
4. Add example workflows or session logs

**Problem:** Plugin not appearing after merge

**Solutions:**
1. Wait 24-48 hours for marketplace rebuild
2. Verify plugin ID matches folder name
3. Check marketplace indexing logs
4. Contact marketplace@claudient.dev for manual sync

---

## Part 7: Distribution Channels Comparison

| Channel | Free | Automation | Discovery | Audience | Latency |
|---------|------|-----------|-----------|----------|---------|
| **npm** | Yes | Full | Package managers | Developers | Immediate |
| **GitHub** | Yes | Partial | Releases page | All | Immediate |
| **Marketplace** | Yes | Manual | Searchable UI | Claude Code users | 24-48h |

### Recommended Flow

1. **Develop** locally, test thoroughly
2. **Tag** release in git: `git tag v1.0.0`
3. **Publish to npm:** `npm publish`
4. **Create GitHub release** with assets
5. **Submit to marketplace** (or wait for auto-indexing)
6. **Announce** on Discord, Twitter, GitHub Discussions

---

## Part 8: Analytics & Monitoring

### npm Registry Analytics

```bash
# View download statistics (requires npm account)
npm stats @claudient/plugin-name

# Weekly downloads
curl https://api.npmjs.org/downloads/point/last-week/@claudient/plugin-name
```

### GitHub Analytics

1. Go to repository → Insights → Traffic
2. Monitor:
   - Clone graphs
   - Visitor trends
   - Popular content

3. Set up GitHub Actions to track releases:

```yaml
name: Track Release
on:
  release:
    types: [published]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v6
        with:
          script: |
            console.log('Release published: ${{ github.event.release.tag_name }}')
```

### Marketplace Metrics

Monitor in marketplace dashboard:
- Install count
- Rating/reviews
- Download trends
- Featured status

---

## Part 9: Revenue Share (Community Plugins)

If you publish a community plugin that reaches 1,000+ installs, you're eligible for revenue sharing.

**Note:** Free to install; optional donations supported through marketplace.

### Eligibility

- [ ] 1,000+ installs in 90 days
- [ ] 4.5+ average rating
- [ ] Active maintenance (updated in last 90 days)
- [ ] Compliant with code of conduct
- [ ] Author responds to issues within 2 weeks

### Enrollment

Email marketplace@claudient.dev:

```
Subject: Revenue Share Enrollment — [Your Plugin Name]

Plugin ID: your-plugin-id
GitHub: https://github.com/yourname/plugin-repo
Install Count: [number]
Rating: [X.X/5.0]

I understand the revenue sharing terms and agree to:
- Maintain the plugin for 12+ months
- Respond to issues within 2 weeks
- Not sell conflicting products on the marketplace
```

### Payment Terms

- **Frequency:** Monthly
- **Split:** 70% author / 30% Claudient platform
- **Minimum:** $10/month threshold
- **Method:** Stripe or bank transfer

---

## Summary

**Distribution involves three primary channels:**

1. **npm:** For programmatic installation via package managers
2. **GitHub Releases:** For version control and direct downloads
3. **Marketplace:** For discoverability within Claude Code

**Best practices:**
- Use semantic versioning consistently
- Update all channels together
- Maintain comprehensive CHANGELOG.md
- Respond promptly to issues
- Test distribution flow before release

**Timeline to production:**
- npm publish: Immediate
- GitHub release: Immediate
- Marketplace listing: 24-48 hours

For questions, contact marketplace@claudient.dev or join [Discord](https://join.claudient.dev).

---

**Last Updated:** June 22, 2026  
**Maintainer:** Claudient Core Team  
**License:** CC-BY-SA-4.0
