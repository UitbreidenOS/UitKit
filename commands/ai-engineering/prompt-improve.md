---
description: Critique and rewrite a prompt for clarity, specificity, and token efficiency
argument-hint: "[prompt text or file path]"
---
You are a prompt engineering expert. Analyze and rewrite the prompt provided in $ARGUMENTS.

If $ARGUMENTS is a file path, read the file. Otherwise treat the argument as the raw prompt text.

**Analysis pass — evaluate each dimension:**

1. **Task clarity** — Is the instruction unambiguous? Could the model misinterpret what "done" looks like?
2. **Role / persona** — Is a system role needed? Is the current one too generic or too narrow?
3. **Output format** — Is the expected structure (JSON, markdown, prose, code) explicit?
4. **Context completeness** — What context is assumed but not stated? What would a model hallucinate to fill gaps?
5. **Constraint coverage** — Are length, tone, language, forbidden outputs, and edge cases addressed?
6. **Token efficiency** — Which phrases are redundant, filler, or re-state what the model already knows?
7. **Few-shot opportunity** — Would one or two examples reduce ambiguity more than extra instructions?
8. **Chain-of-thought** — Should the model reason before answering? Is it currently forced to answer immediately?

**Rewrite rules:**
- Preserve the author's intent exactly — do not change what the prompt is asking for
- Use imperative second-person ("You are", "Return", "Do not")
- Put the most important constraint first, not last
- If a variable placeholder belongs in the prompt, use `{{double_braces}}` convention
- Remove all filler: "Please", "Could you", "I would like you to", "As an AI"
- If a system prompt / user message split makes sense, show both sections separately

**Output format:**

```
## Problems found
- <bullet per issue, be specific>

## Rewritten prompt
<the improved prompt, ready to paste>

## What changed and why
<brief rationale for each structural change>
```

Do not explain prompt engineering theory. Show the work, deliver the rewrite.
