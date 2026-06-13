---
name: prompt-engineering
description: "Prompt engineering for production: few-shot prompting, chain-of-thought, system prompt design, output formatting, temperature settings, and evaluation — for Claude and other LLMs"
updated: 2026-06-13
---

# Prompt Engineering Skill

## When to activate
- Writing a system prompt for a Claude-powered application or agent
- Improving the reliability or quality of LLM outputs
- Designing few-shot examples to steer model behaviour
- Debugging why a model isn't following instructions
- Setting up a prompt evaluation framework
- Formatting prompts for structured outputs (JSON, markdown tables, etc.)

## When NOT to use
- RAG system design — use the rag-architect skill
- Agent orchestration — use the agent-construction or langgraph skill
- Fine-tuning models — different process entirely
- Prompt injection defence — that's a security topic for the security-reviewer agent

## Instructions

### System prompt design

```
Write a production system prompt for [use case].

Use case: [what the AI assistant does — customer support / coding assistant / data extractor / etc.]
User: [who sends messages — end users / developers / internal staff]
Output format: [free text / JSON / markdown / structured]
Constraints: [what the assistant must never do]
Tone: [professional / friendly / concise / technical]

System prompt structure:

## Role and purpose
[Define exactly who the assistant is and what it does]
[Be specific — "You are a customer support assistant for Acme Inc., helping users troubleshoot billing issues" is better than "You are a helpful assistant"]

## What you do
[List 3-5 specific things the assistant handles]
[Use imperative: "Answer questions about...", "Help users...", "Extract..."]

## What you do NOT do
[Explicit refusals — critical for production systems]
[Examples: "Do not give medical/legal/financial advice", "Do not discuss competitor products", "Do not make up information"]

## Output format
[Describe the exact format expected]
[If structured: "Always respond in valid JSON matching this schema: {...}"]
[If markdown: "Use headings and bullet points. Keep responses under 200 words."]

## Tone and style
[Specific guidance: "Be concise — one paragraph max per response", "Use the user's name if available", "If you don't know, say so — do not guess"]

## Examples (optional but powerful)
[2-3 few-shot examples showing ideal input → output pairs]
User: [example input]
Assistant: [ideal output]

Write the production system prompt for my use case.
```

### Few-shot prompting

```
Design few-shot examples for [task].

Task: [what the model should do — classify / extract / reformat / generate / analyse]
Input format: [describe]
Desired output format: [describe]
Common failure modes without examples: [what goes wrong with zero-shot?]

Few-shot design rules:
1. Show the format, not just describe it (a concrete example beats 5 lines of instruction)
2. Cover the main input variations (not just the happy path)
3. Include at least one edge case example
4. Examples must be correct — wrong examples harm performance
5. 3-5 examples is usually optimal; > 10 is rarely worth the token cost

Template:
Here are examples of the task:

<example>
Input: [example input 1]
Output: [ideal output 1]
</example>

<example>
Input: [example input 2 — different variation]
Output: [ideal output 2]
</example>

<example>
Input: [example input 3 — edge case]
Output: [ideal output 3]
</example>

Now perform the task for this input:
Input: [actual input]
Output:

For classification tasks: ensure examples cover all classes, balanced.
For extraction tasks: show what to return when the field is absent.
For generation tasks: demonstrate length, tone, and structure.

Design few-shot examples for my specific task.
```

### Chain-of-thought prompting

```
Add chain-of-thought reasoning to [prompt].

Current prompt: [paste]
Problem: [model gives wrong or inconsistent answers on complex inputs]
Task type: [math / logic / multi-step reasoning / analysis / planning]

Chain-of-thought trigger phrases:

Basic CoT:
"Think step by step before giving your final answer."

Zero-shot CoT (powerful, often sufficient):
"Let's think through this carefully:
1. First, identify...
2. Then, consider...
3. Finally, conclude...

Provide your reasoning, then state your answer clearly."

Few-shot CoT (show the reasoning, not just the answer):
<example>
Question: [complex question]
Reasoning: Let me work through this step by step.
First, [observation 1].
This means [inference].
Therefore, [conclusion].
Answer: [final answer]
</example>

Now answer this question using the same approach:
Question: [actual question]

Structured reasoning for complex analysis:
"Before answering, complete this analysis:
1. SITUATION: [summarise the key facts]
2. CONSTRAINTS: [identify limits or requirements]
3. OPTIONS: [list possible approaches]
4. RECOMMENDATION: [choose the best option and explain why]
5. ANSWER: [final response]"

Add chain-of-thought to my prompt. Show before/after comparison.
```

### Output formatting

```
Control the output format for [prompt].

Desired format: [JSON / markdown table / numbered list / code block / structured text]
Why format matters here: [downstream parsing / human readability / API contract]
Common formatting failures: [model adds preamble / wrong JSON / mixed formats]

JSON output (reliable extraction):
Prompt addition:
"Respond ONLY with valid JSON. No explanation, no preamble, no markdown code fences.
The JSON must match this schema exactly:
{
  "field1": string,
  "field2": number,
  "field3": boolean,
  "items": Array<{name: string, value: number}>
}

If a field cannot be determined, use null (not the string 'null')."

Validation: parse the response with JSON.parse() — if it throws, the prompt needs refinement.

Markdown table output:
"Format your response as a markdown table with these exact columns:
| Column 1 | Column 2 | Column 3 |
Do not add any text before or after the table."

Numbered list with specific structure:
"Respond as a numbered list. Each item: [Title]: [explanation in one sentence].
Example format:
1. First item: This is what it means.
2. Second item: This is what it means."

Output control techniques:
- Prefix the expected output: "The answer is:" → model continues the format
- Use XML tags for clear boundaries: <answer>...</answer>
- Specify negative constraints: "Do not include any markdown formatting"
- Show the first token: "{"  → model continues with JSON

Fix the output format for my prompt.
```

### Prompt evaluation

```
Set up a prompt evaluation framework for [application].

Application: [describe the AI feature]
Current prompt: [paste]
Quality criteria: [what makes a good output?]
Failure modes observed: [what goes wrong?]

Evaluation framework:

1. Define metrics (pick 2-4):
   - Accuracy: correct answer vs. ground truth (for factual tasks)
   - Format compliance: did it follow the output format? (parseable, valid)
   - Relevance: did it answer the actual question?
   - Safety: did it refuse anything it should have / comply with anything it shouldn't?
   - Latency: tokens generated / time to first token

2. Build a golden test set:
   - 20-50 representative examples
   - Cover: common cases, edge cases, adversarial inputs
   - Each example has: input + expected output (or expected behaviour)
   - Review golden set with domain expert — garbage in, garbage out

3. Automated evaluation options:
   - Exact match: for structured outputs (JSON field match)
   - LLM-as-judge: use Claude to score outputs against criteria
     "Rate this response 1-5 for [criterion]: [output]"
   - Semantic similarity: for free-text where paraphrasing is OK
   - Rule-based: regex for format, word count, forbidden phrases

4. Evaluation loop:
   a. Write prompt v1
   b. Run against golden set
   c. Identify failure modes
   d. Fix prompt (add instruction, example, or constraint)
   e. Re-run — confirm improvement, watch for regressions
   f. Ship when accuracy meets threshold

5. Production monitoring:
   - Sample X% of production calls for human review
   - Track refusal rate, error rate, user feedback
   - Alert if output format compliance drops below threshold

Set up the evaluation framework for my specific application.
```

## Example

**User:** I'm building a customer support bot for a SaaS product. It keeps making up answers when it doesn't know something. How do I fix this?

**Claude's system prompt fix:**

This is a grounding problem — the model defaults to generating plausible-sounding answers rather than admitting uncertainty. Fix it with explicit instructions, a clear knowledge boundary, and a refusal template.

**Before (broken):**
```
You are a helpful customer support assistant for Acme SaaS.
Answer customer questions about the product.
```

**After (fixed system prompt):**
```
You are a customer support assistant for Acme SaaS. You help users with billing questions, account management, and product usage.

## What you know
You can answer questions about:
- How to use features documented in our help centre
- Billing, subscription plans, and invoice questions
- Account settings and user management
- Common error messages and how to resolve them

## What you do NOT do
- Do not guess or make up product features, pricing, or capabilities
- Do not answer questions about competitor products
- Do not make promises about future features or timelines

## When you don't know the answer
Say exactly this: "I don't have that information in my knowledge base. Let me connect you with a human agent who can help."
Then provide this: "You can reach our team at support@acme.com or chat with a human below."

Never say "I think" or "I believe" — if you're not certain, say you don't know.

## Response format
- Keep responses under 150 words
- Use bullet points for multi-step instructions
- Always end with: "Does that help? Let me know if you have any other questions."
```

**Additional fix — add a knowledge file:**
Pass the actual product documentation in the context (or via RAG). The model can't "know" something it wasn't told. A system prompt that says "you know X" without providing X just encourages hallucination.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
