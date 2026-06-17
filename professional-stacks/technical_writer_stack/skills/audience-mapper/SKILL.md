# Audience Mapper

## When to activate
User runs `/define-audience` or before writing docs for a new feature.

## When NOT to use
Do not use to redefine audience mid-writing. Define once, use throughout.

## Instructions

1. Accept feature brief or scope description.
2. Define audience profile:
   - **Role:** Who will use this? (developer, operator, end user, etc.)
   - **Expertise level:** Beginner, intermediate, advanced
   - **Prior knowledge assumed:** What do they already know?
   - **Goals:** What are they trying to accomplish?
   - **Pain points:** What frustrates them about [similar tool/process]?
3. Recommend reading level (Flesch Reading Ease score).
4. Suggest terminology to use/avoid.
5. Link to related docs for this audience.
6. Return profile in structured format.

## Example

**Input:** "We're documenting our webhook API."

**Output:**
```
# Audience Profile: Webhook API Documentation

## Primary Audience
**Role:** Backend engineer integrating webhooks  
**Expertise:** Comfortable with REST APIs; new to webhooks  
**Prior Knowledge:** HTTP, JSON, API authentication  
**Goal:** Implement reliable webhook handling for order events  
**Pain Point:** Confusion about retries, delivery guarantees, and event ordering

## Secondary Audience
**Role:** DevOps engineer monitoring webhooks  
**Expertise:** Comfortable with logs, metrics, alerting  
**Prior Knowledge:** HTTP status codes, timeouts  
**Goal:** Ensure webhook delivery, debug failures  

## Reading Level
Flesch Reading Ease: 50–60 (college level)

## Terminology
**Use:** endpoint, payload, event, delivery, retry
**Avoid:** seamlessly, leverage, empower, webhook architecture, event-driven paradigm

## Related Docs
- [REST API Basics](link) — for engineers new to APIs
- [Authentication](link) — reference for API key setup

## Writing Guidelines
- Lead with the task: "How to set up your first webhook"
- Define "webhook" on first use; link to conceptual doc
- Use imperative voice: "Click X" not "X should be clicked"
- Every code example must be runnable
```
