# Reproducibility Enforcer Hook

## Description

A pre-commit hook that enforces reproducibility best practices for ML/AI workflows. This hook validates that:
- Random seeds are explicitly set in code and experiments
- Dependency versions are pinned in requirements files
- Experiment configurations are version-controlled
- Model weights and checkpoints are tracked
- Computational environment (CUDA version, library versions) is documented

Fires on: `pre-commit` before staging ML/AI artifacts and code changes.

---

## Settings Entry

Add this to `.claude/settings.json`:

```json
{
  "hooks": {
    "pre-commit": [
      {
        "name": "reproducibility-enforcer",
        "command": ".claude/hooks/reproducibility-enforcer.sh",
        "description": "Enforce reproducibility checks for ML workflows"
      }
    ]
  }
}
```

---

## Hook Script

[Placeholder: `.claude/hooks/reproducibility-enforcer.sh`]

Setup instructions:
1. Create `.claude/hooks/reproducibility-enforcer.sh`
2. Make executable: `chmod +x .claude/hooks/reproducibility-enforcer.sh`
3. Add the JSON configuration above to `.claude/settings.json`
4. Hook runs automatically before each commit

---

## Checks Performed

[To be implemented]

- Seed pinning validation
- Dependency version pinning
- Environment documentation
- Checkpoint tracking
- Experiment config versioning
