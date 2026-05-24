# Claude Mythos Preview

A guide to Anthropic's Claude Mythos initiative — a research preview program exploring capabilities beyond standard Claude deployments. Written for advanced Claude Code users, AI researchers, and developers working at the frontier of what agentic systems can do.

---

## What is Claude Mythos

Claude Mythos is an Anthropic Labs research preview program, announced in early 2026, focused on exploring Claude's capabilities outside the bounds of the standard, generally available product. It is not a product release — it is a structured access program for testing and validating capabilities that are not yet ready for general availability.

The initiative targets three capability clusters:

**Extended reasoning chains.** Standard Claude models operate within a fixed thinking budget. Mythos variants can sustain reasoning chains significantly longer than the standard token ceiling, enabling deeper decomposition of problems that require many reasoning steps before reaching an actionable conclusion. This is not simply a larger context window — the reasoning architecture itself is configured to allow more iterative refinement before committing to an output.

**Long-horizon multi-turn tool use.** Standard Claude Code sessions can complete complex multi-step tasks, but context pressure and tool call depth limits impose practical ceilings. Mythos is designed to hold coherent task state across 100+ tool calls, maintaining goal fidelity across a long sequence of actions without the degradation common in extended agentic sessions.

**Novel capability testing before general release.** Mythos serves as a controlled surface for Anthropic to evaluate capabilities — including multi-modal reasoning, novel tool interaction patterns, and agent coordination primitives — before those capabilities are promoted to production models. Behaviors observed in Mythos may change, be removed, or appear in a different form in later general releases.

Access is selective. Pro, Max, Team, and Enterprise subscribers can apply for early access through the Anthropic Labs program. Access is granted on a rolling basis, prioritizing researchers, high-usage power users, and use cases that generate useful signal for Anthropic's evaluation work.

---

## How It Differs from Standard Claude

| Feature | Claude (standard) | Claude Mythos |
|---|---|---|
| Thinking budget | Up to ~32K tokens | Extended — research limit, not published |
| Max session length | Standard context window | Extended context window |
| Tool call depth | Standard limits | Deeper recursive tool use supported |
| Availability | Generally available | Labs preview — selective access |
| Model identifier | claude-sonnet-4-6, claude-opus-4-6 | Research variant — see Labs dashboard |
| SLA | Yes (for API and Enterprise tiers) | None — preview models carry no SLA |
| Latency | Standard | Higher due to extended reasoning passes |
| Production readiness | Yes | No — not suitable for production workloads |

The model identifier for Mythos variants is not published in the standard API documentation. If you have access, the correct model ID will appear in the Anthropic Labs dashboard. Do not hardcode an assumed model string — retrieve it from the dashboard and treat it as subject to change between preview updates.

---

## Accessing Mythos

Access is not automatic, even for paying subscribers. The process:

1. Navigate to `claude.ai/labs` and apply for the Mythos preview.
2. An active Pro, Max (5x or 20x), Team, or Enterprise subscription is required. Free-tier accounts are not eligible.
3. Applications are reviewed on a rolling basis. There is no published SLA for when access is granted. Priority is given to use cases with clear research value.
4. Once approved, API access is provided through a separate preview model ID visible in the Labs dashboard. This model ID is distinct from any production model ID and changes with each preview update.
5. Claude.ai interactive access (if granted) appears as a separate mode selector — it is not enabled by default in the main interface.

If you are on a Team or Enterprise plan, access management may require an admin to enable Mythos for specific seats. Check with your organization's Anthropic account contact.

There is no self-serve upgrade path to Mythos. It is an application-gated program.

---

## What You Can Do with Mythos in Claude Code

The following use cases benefit materially from Mythos capabilities versus standard Claude Code:

**Long-horizon codebase refactors.** Tasks such as migrating an entire codebase from one framework to another, or enforcing a new architectural pattern across hundreds of files, require holding a consistent model of the target state while executing dozens of file edits. Mythos' extended context and tool call depth support makes these tasks more reliable — fewer mid-session context collapses, better goal retention across many sub-steps.

**Complex multi-step research tasks.** When a task requires reading many documents, synthesizing information across sources, forming hypotheses, testing them against additional sources, and revising, the extended reasoning budget allows more thorough reasoning traces before committing to conclusions. This is distinct from simply having more context — it changes the quality of intermediate reasoning steps.

**Extended autonomous sessions.** Standard agentic sessions in Claude Code are practical for tasks that complete in tens of steps. Mythos is designed to support sessions that run significantly longer without the typical degradation in task coherence. This is relevant for fully autonomous agents executing long build-test-fix cycles or multi-phase workflows.

**Novel agent coordination patterns.** Mythos is the appropriate surface for testing orchestration patterns that require a coordinator to hold state across many spawned subagent calls. If you are developing a multi-agent system that pushes against standard coordination limits, Mythos provides a context where those limits are relaxed enough to explore new patterns — with the understanding that what works in preview may require adjustment when the pattern moves to production models.

---

## Extended Reasoning Mode

If you have Mythos access, extended thinking is configured at the API level when making calls to the preview model.

**Enabling extended thinking budget in API calls.** In the Anthropic SDK, the `thinking` parameter accepts a `budget_tokens` value. For standard models, the documented ceiling applies. For Mythos preview models, the effective ceiling is higher — the exact limit is documented in the Labs dashboard for your access tier, and is subject to change between preview updates.

```python
response = client.messages.create(
    model="<mythos-model-id-from-labs-dashboard>",
    max_tokens=16000,
    thinking={
        "type": "enabled",
        "budget_tokens": 80000  # example — verify your tier's limit in the dashboard
    },
    messages=[{"role": "user", "content": your_prompt}]
)
```

Do not assume any specific `budget_tokens` ceiling. Retrieve the limit from the Labs dashboard. Exceeding the supported limit will result in an API error, not silent truncation.

**Reading the thinking trace.** The response object includes a `thinking` content block alongside the `text` block. The thinking trace is the model's internal reasoning — it reflects the steps taken before producing the final answer. In extended reasoning mode, this trace can be substantially longer than in standard mode. Treat it as diagnostic output rather than user-facing content. It is useful for understanding why the model reached a particular conclusion, identifying where reasoning went wrong in a failed task, and calibrating whether extended reasoning is providing value for a given task class.

**When extended reasoning helps.** Extended reasoning is most valuable for tasks where the correct answer is not immediately derivable — problems that require exploring multiple approaches, tasks with many interdependent constraints that must be satisfied simultaneously, and research tasks where the question itself needs refinement before an answer is meaningful. In these cases, the extended budget allows the model to exhaust more of the problem space before committing.

**When extended reasoning is overkill.** Simple, well-specified tasks do not benefit from extended thinking budgets. A request to format a file, write a unit test for a clearly defined function, or look up a value in a document does not improve with more reasoning tokens — it just costs more and takes longer. Use extended thinking only for tasks where the reasoning complexity justifies the cost and latency.

**Cost.** Extended thinking tokens are billed at the thinking-token rate, which differs from the standard input/output token rate. Thinking tokens accumulate quickly in extended reasoning mode. For cost details, see [guides/billing-and-pricing.md](billing-and-pricing.md). Monitor your usage during Mythos sessions — the preview models can generate very large thinking traces on complex tasks.

---

## Limitations and Caveats

Mythos is a preview program. That designation has specific, non-negotiable implications:

**Behavior changes between updates.** Anthropic updates preview models more frequently than production models, and without the stability guarantees that apply to GA releases. A behavior you depend on today may change in the next preview update. Do not build production systems on Mythos model identifiers or behaviors.

**Not all Claude Code features are validated with Mythos variants.** Features such as hooks, certain MCP server integrations, and specific tool call patterns are tested against production models. Compatibility with Mythos variants is not guaranteed, and issues encountered may not be prioritized for fixes given the preview status.

**Higher latency.** Extended reasoning passes take time. Tasks that complete in seconds on standard models may take minutes on Mythos when full reasoning budget is engaged. This is expected behavior, not a bug, but it disqualifies Mythos from any latency-sensitive use case.

**Not suitable for production workloads.** The absence of an SLA is the explicit signal here. If a workload requires reliability guarantees, use GA models. Mythos exists for research and exploration, not for serving end users.

**Access can be revoked.** As a preview program, Anthropic reserves the right to adjust access, modify terms, or discontinue the preview without advance notice. Plan accordingly — do not build critical infrastructure on preview access.

**Limited documentation.** Mythos capabilities are intentionally under-documented in public channels. The Labs dashboard is the authoritative source for your access tier's limits, model IDs, and supported features. Do not rely on third-party documentation as a primary reference.

---

## Staying Current

Mythos evolves faster than the standard product. The following sources are the authoritative references:

- `anthropic.com/research` — Anthropic's primary channel for announcing research directions, new capabilities, and program updates. This is where Mythos-level developments are first publicly discussed.
- `claude.ai/labs` — The access portal and dashboard for Labs programs including Mythos. Model IDs, tier limits, and feature availability are documented here for enrolled users.
- `anthropic.com/claude/changelog` — The public changelog for Claude model and product changes. Preview model updates may appear here with less detail than production model changes, but significant updates are noted.

There is no dedicated mailing list or RSS feed for Mythos-specific updates as of May 2026. Monitor the above channels, and pay attention to the Labs dashboard — updates to your available model ID or budget limits will appear there before they appear anywhere else.

---

## Related Guides

- [guides/billing-and-pricing.md](billing-and-pricing.md) — Token rates for thinking tokens, plan limits, and the June 15 billing change that affects how extended reasoning costs are accounted for under Pro and Max subscriptions.
- [guides/context-management.md](context-management.md) — Strategies for managing extended context windows, relevant to Mythos sessions where context use is substantially higher than in standard sessions.
