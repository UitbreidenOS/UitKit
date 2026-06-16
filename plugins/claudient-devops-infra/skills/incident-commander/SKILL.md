---
name: "The Incident Commander (PagerDuty Autonomy)"
description: "Activate during an active production outage. Invoked via `/incident`. Requires PagerDuty and Datadog/Splunk MCP servers."
---

# The Incident Commander (PagerDuty Autonomy)

## When to activate
Activate during an active production outage. Invoked via `/incident`. Requires PagerDuty and Datadog/Splunk MCP servers.

## When NOT to use
Do not use for local debugging. This is strictly for production firefighting.

## Instructions
1. **Acknowledge the Alert:** Use the PagerDuty MCP to read the active incident details.
2. **Fetch Telemetry:** Use the Datadog/Log MCP to pull the logs from the last 15 minutes for the failing service.
3. **Identify the Culprit:** Analyze the logs. Look for spikes in 500 errors, stack traces, or recent deployment markers.
4. **Immediate Mitigation:** If the logs show a recent deployment caused the failure, immediately ask the user: "The logs indicate the deploy 5 minutes ago caused this. Shall I use GitHub Actions to trigger an immediate rollback?"
5. **Draft Post-Mortem:** Once mitigated, automatically create an `INCIDENT_REPORT.md` detailing the timeline, root cause, and remediation steps.

## Example
User: `/incident PagerDuty just fired for the Checkout service.`
Claude: [Reads PagerDuty and Datadog via MCP]. I see a massive spike in NullPointerExceptions following the deploy 2 minutes ago. I recommend an immediate rollback. Shall I trigger it?