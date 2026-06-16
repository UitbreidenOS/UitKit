---
name: "The Archaeologist (Semantic Context Engine)"
description: "Activate when navigating a massive, poorly documented legacy codebase where keyword searches (`grep`) fail due to bad variable naming conventions. Invoked via `/archaeologist`."
---

# The Archaeologist (Semantic Context Engine)

## When to activate
Activate when navigating a massive, poorly documented legacy codebase where keyword searches (`grep`) fail due to bad variable naming conventions. Invoked via `/archaeologist`.

## When NOT to use
Do not use in small, modern projects where standard AST tools or simple `grep` commands are sufficient.

## Instructions
1. **Understand the Concept:** The user will ask for a concept, not a keyword. (e.g., "Where do we charge the user's credit card?" even if the code calls it `process_tx_v2`).
2. **Deep Semantic Search:** 
   - Ask the user to define 5-10 technical synonyms, API endpoints, or database tables related to the concept.
   - Use `Bash` to run complex, multi-stage recursive searches looking for combinations of those terms near each other.
   - (If a local vector store or MCP embedding server is available, use it to perform a true semantic search).
3. **Analyze Findings:** Read the files that match the cluster of terms. Confirm if the file actually handles the requested concept.
4. **Report:** Return the exact file paths and line numbers that contain the conceptual logic, explaining *why* you believe this is the correct location despite the naming conventions.

## Example
User: `/archaeologist Where is the logic that decides if a user gets a free trial?`
Claude: [Searches for clusters of 'trial', 'days', 'stripe', 'subscription', '0.00']. I found it in `billing_utils_legacy.js`. The function is vaguely named `checkStatusAndApplyDiscount`, but lines 45-60 handle the 14-day trial logic.