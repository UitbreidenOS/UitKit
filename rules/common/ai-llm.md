# AI and LLM Rules

Apply these rules when building features that use Claude, OpenAI, or other language models.

## Prompt design

- System prompts define role and constraints — they are not suggestions
- User-controlled content must never be concatenated into the system prompt
- Tag untrusted content explicitly: `[USER INPUT]...[/USER INPUT]`
- Define output format in the prompt, not just in code that parses it
- Always specify what to do when uncertain: "If you don't know, say so"

```typescript
// WRONG: user input in system prompt = injection risk
const systemPrompt = `You are a helpful assistant. ${userInstruction}`

// RIGHT: keep system prompt and user content separate
const messages = [
  { role: 'system', content: systemPrompt },
  { role: 'user', content: userInput }
]
```

## Output handling

- Never render raw LLM output as HTML (XSS via AI-generated content)
- Always sanitise before rendering: `DOMPurify.sanitize(llmOutput)`
- For structured outputs (JSON), validate with Zod before using
- LLM outputs that inform consequential decisions need a human review gate
- Never assume the LLM returned what you asked for — parse defensively

```typescript
// WRONG: assume JSON was returned
const data = JSON.parse(await llm.generate(prompt))

// RIGHT: handle parse failures
try {
  const raw = await llm.generate(prompt)
  const data = outputSchema.parse(JSON.parse(raw))
} catch (e) {
  // Log, retry, or fallback
}
```

## Cost and rate limits

- Log token counts for every LLM call (input + output)
- Set maximum token limits on input to prevent cost spikes from large inputs
- Implement retry with exponential backoff for rate limit errors
- Cache responses for identical prompts where appropriate (semantic cache)
- Alert when daily spend exceeds budget threshold

```typescript
const response = await claude.messages.create({
  model: 'claude-opus-4-7',
  max_tokens: 1024,  // always set max_tokens
  messages,
})
// Log usage
logger.info('llm_call', {
  input_tokens: response.usage.input_tokens,
  output_tokens: response.usage.output_tokens,
  cost: estimateCost(response.usage),
})
```

## Agentic patterns

- Tools with side effects (write, delete, send) must have human confirmation
- Give agents the minimum tools needed for the task — never all tools by default
- Log all tool calls made by agents
- Build in a maximum iteration count to prevent infinite loops
- Test with adversarial inputs before exposing agents to untrusted users

```typescript
// WRONG: unlimited iterations
while (!done) { await agent.step() }

// RIGHT: bounded execution
for (let i = 0; i < MAX_ITERATIONS; i++) {
  const result = await agent.step()
  if (result.done) break
  if (i === MAX_ITERATIONS - 1) {
    throw new Error(`Agent exceeded ${MAX_ITERATIONS} iterations`)
  }
}
```

## Privacy and data

- Never log PII in prompts or responses (email, phone, SSN, health data)
- Don't include customer data in prompts sent to third-party LLM APIs without DPA/consent
- Use pseudonymisation before including in prompts: replace names with IDs
- Confirm your AI provider's data retention policy before sending sensitive data

## Evaluation

- Every AI feature needs a test set before shipping (minimum: 20 examples)
- Define the acceptable failure rate before launch (not after)
- Monitor output quality in production — thumbs up/down at minimum
- Regression test the prompt against the test set before any prompt change
