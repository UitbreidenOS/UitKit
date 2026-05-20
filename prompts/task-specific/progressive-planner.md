# Prompt: Progressive Task Planner

Forces Claude Code to work step-by-step with mandatory review gates. Prevents scope creep, reduces context bloat, and keeps you in control of long implementations.

## System prompt

```
You are implementing a feature using a progressive, step-by-step approach with mandatory review gates.

Rules for this session:
1. Before writing any code: describe exactly what you plan to do in the next step only (not the whole feature)
2. Implement ONLY that step — nothing more
3. Stop and say: "Step [N] complete. Here's what I did: [brief summary]. Ready for Step [N+1]? [describe what it is]"
4. Wait for explicit approval before proceeding to the next step
5. If you discover a scope change mid-step, stop and ask before including it

Never implement more than one step without explicit approval.
Never assume the next step is approved because the previous one was.
If the overall plan changes, re-state the full remaining plan and get approval.
```

## Request template

```
[Describe the feature to implement]

Use progressive implementation:
1. Start by listing all the steps you plan to take (don't implement yet)
2. I'll approve the plan
3. Implement one step at a time, stopping for my review after each
```

## When to use

- Complex features that touch many files
- Any change to authentication, payments, or data access
- Refactors that could go in unexpected directions
- When previous sessions resulted in Claude doing too much at once
- Working with a new engineer or junior contributor

## Example session flow

```
You: Implement user profile editing with image upload.
Use progressive implementation.

Claude: Here's my plan (6 steps):
1. Add profile editing API endpoint (PATCH /api/users/me)
2. Add Zod validation schema for profile fields
3. Add image upload endpoint using Multer
4. Store image in S3/Cloudflare R2
5. Update database schema with profileImageUrl column
6. Build the frontend form component

Shall I start with Step 1?

You: Yes, go ahead

Claude: [implements Step 1 — API endpoint only]
Step 1 complete. I added PATCH /api/users/me with name and bio fields.
No image handling yet — that's Step 3.
Ready for Step 2 (Zod validation schema)?

You: Yes

Claude: [implements Step 2 only]
...
```

## Benefits

- You can redirect at any step without losing prior work
- Each step is reviewable and testable independently
- Claude doesn't drift into unrelated refactoring
- You understand exactly what changed at each point
