# /outline-docs

**What it does:** Generate table of contents and structural outline for a documentation set based on feature scope.

**Trigger:** Slash command in Claude Code

**Usage:**
```
/outline-docs [feature brief or description]
```

**Output:**
- Hierarchical table of contents
- Doc type breakdown (guides, reference, conceptual, troubleshooting)
- Audience and reading level for each doc
- Estimated word counts
- Cross-reference map
- Publish order recommendation

**Example:**
```
/outline-docs We're shipping OAuth 2.0 authentication. Users need to understand grant types, implement the flow, and troubleshoot token errors.
```

**Calls:** documentation-outliner skill
