## Summary

<!-- One or two sentences: what does this PR add or fix? -->

## Type of change

- [ ] New skill(s)
- [ ] New agent(s)
- [ ] New hook(s)
- [ ] New command(s)
- [ ] Bug fix (skill/agent/hook/command)
- [ ] Documentation improvement
- [ ] CLI enhancement
- [ ] Other:

## What's included

<!-- List the files added or modified -->

- Added: `skills/...`
- Modified: `agents/...`
- Fixed: `hooks/...`

## Quality checklist

- [ ] Skills include all 4 required sections: `## When to activate`, `## When NOT to use`, `## Instructions`, `## Example`
- [ ] Skills have YAML frontmatter with `name` and `description`
- [ ] Agents include all 5 required sections: `## Purpose`, `## Model guidance`, `## Tools`, `## When to delegate here`, `## Example use case`
- [ ] Hooks include a `## settings.json entry` with a valid JSON snippet
- [ ] File follows existing naming conventions (kebab-case, lowercase)
- [ ] No vendor-specific API keys, tokens, or personal data included
- [ ] Tested locally with Claude Code (skill activates correctly)

## How to test

<!-- Steps to verify this works -->

1. Install: `npx claudient add skills <category>`
2. Open Claude Code
3. Try: `...`

## Related issue

<!-- Link to any related issue: Closes #123 -->
