# GitHub Actions Workflows

This directory contains CI/CD automation for Claudient repository.

## Available Workflows

### 1. feature-audit.yml
**Feature Audit & Validation** - Comprehensive feature catalog validation

- Validates `feature-presence.txt` structure and format
- Checks JSON and schema correctness
- Verifies markdown file references
- Runs feature integration tests
- Generates audit reports and PR comments

**Triggers:** Push/PR to main/master with changes to features or validation scripts

**Run locally:**
```bash
node scripts/validate-features.js
node test/features/validate-features.js
```

**Documentation:** See [FEATURE_AUDIT.md](./FEATURE_AUDIT.md)

---

### 2. claudient-ci.yml
**Claudient CI Validation** - Core system validation

- Installs dependencies
- Runs core codebase validations
- Validates catalog structure
- Audits workspace stacks
- Executes CLI smoke tests
- Self-healing repair on failure

**Triggers:** Push/PR to main/master

**Run locally:**
```bash
npm run validate
npm run validate:catalog
npm run validate:stacks
npm test
```

---

### 3. validate.yml
**Markdown & Structure Validation** - Content quality checks

- Markdown linting with markdownlint-cli2
- Frontmatter and format validation
- Internal link checking
- Manifest consistency
- Skill/agent freshness checks
- Workspace stack validation
- CLI smoke tests

**Triggers:** Push/PR to main/master

**Run locally:**
```bash
markdownlint-cli2 "**/*.md" --config .markdownlint.json
npm run validate:frontmatter
npm run validate:manifests
npm run validate:stacks
npm run validate:freshness
npm test
```

---

## Workflow Status

All workflows run independently but can be viewed in the Actions tab:
https://github.com/UitbreidenOS/Claudient/actions

## Common Tasks

### Run all validations locally
```bash
npm run validate
npm run validate:catalog
npm run validate:stacks
npm test
npm run test:regression
```

### Debug a failing workflow
1. Check PR comment for audit results
2. Review detailed logs in Actions tab
3. Run validation scripts locally to reproduce
4. Fix issues and commit
5. Workflow automatically reruns on push

### Add new features
1. Update `feature-presence.txt` with new entry
2. Update `feature-inventory.txt` (or regenerate)
3. Ensure file references are correct
4. Commit and push
5. Workflow validates automatically

### Monitor features
```bash
# View feature validation summary
node scripts/validate-features.js

# Run integration tests
node test/features/validate-features.js

# List all features
npm run list
```

## Permissions

Workflows require:
- `contents: read` - Read repository files
- `pull-requests: write` - Post PR comments (for feature-audit.yml)

See individual workflow files for exact permission requirements.

## Troubleshooting

| Workflow | Issue | Solution |
|----------|-------|----------|
| feature-audit | Missing files in references | Update paths in feature-presence.txt to be relative to repo root |
| feature-audit | Line count mismatch | Sync feature-presence.txt and feature-inventory.txt |
| claudient-ci | Tests timeout | Check for infinite loops; increase timeout if needed |
| validate.yml | Broken markdown links | Update links or add exceptions to .markdown-link-check.json |

## Adding New Workflows

To add a new workflow:

1. Create `<workflow-name>.yml` in this directory
2. Follow GitHub Actions YAML syntax
3. Document in this README
4. Add detailed documentation in a separate file if complex

See [GitHub Actions Documentation](https://docs.github.com/en/actions) for syntax reference.

## Related Files

- [FEATURE_AUDIT.md](./FEATURE_AUDIT.md) - Feature audit workflow details
- [../CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) - Community guidelines
- [../CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guide
