# /define-audience

**What it does:** Analyze feature scope and define audience profile(s) before writing documentation.

**Trigger:** Slash command in Claude Code

**Usage:**
```
/define-audience [feature name or brief]
```

**Output:**
- Primary and secondary audience profiles
- Expertise level and prior knowledge assumptions
- Goals and pain points
- Recommended reading level
- Terminology guidelines (use/avoid)
- Related docs to link to

**Example:**
```
/define-audience Rate limiting API
```

**Calls:** audience-mapper skill
