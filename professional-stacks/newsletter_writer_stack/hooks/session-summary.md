# Hook: Session Summary

## What It Does

Auto-logs newsletter session activity to `session-log.md` at session end. Captures topics researched, drafts created, reviews completed, approvals, and performance data—building a searchable archive.

## Settings.json Entry

```json
{
  "hooks": {
    "newsletter-session-summary": {
      "event": "Stop",
      "scriptPath": "hooks/session-summary.sh"
    }
  }
}
```

## Setup Instructions

1. Add the JSON entry above to your `.claude/settings.json` under `hooks`
2. Place the hook script at `.claude/hooks/session-summary.sh`
3. Restart Claude Code session
4. Hook will auto-trigger when you stop Claude Code (end of session)

## What Gets Logged

### Topic Research

```
**Topic:** [Topic name]  
**Research Depth:** [Brief summary of sources checked]  
**Key Data Points:** [Number of sources cited]  
**Status:** [Completed / In Progress]  
```

### Newsletter Draft

```
**Newsletter Title:** [Title]  
**Hook:** [First sentence of newsletter]  
**Word Count:** [X words]  
**Sections:** [Number and names of main sections]  
**Status:** [Drafted / Reviewed / Approved / Sent]  
```

### Quality Reviews

```
**Review Type:** [Output Review / Link Check / Tone Audit / Length Validation]  
**Status:** [Pass / Needs Edits]  
**Issues Found:** [Number of issues]  
**Time to Fix:** [Estimated minutes]  
```

### Human Approvals

```
**Approval:** [Newsletter title]  
**Timestamp:** [YYYY-MM-DD HH:MM UTC]  
**Notes:** [Any human feedback or change requests]  
**Status:** [Approved for send / Pending edits]  
```

### Performance Data (Post-Send)

```
**Newsletter:** [Title]  
**Send Date:** [YYYY-MM-DD]  
**Recipients:** [Count]  
**Opens:** [Count + %]  
**Clicks:** [Count + % of opens]  
**Unsubscribes:** [Count + %]  
**Top Performing Link:** [URL that got most clicks]  
**Engagement Trend:** [Up / Down / Stable vs. prior send]  
```

---

## Session Log Format

The hook automatically appends to `session-log.md` in this format:

```markdown
## [YYYY-MM-DD HH:MM UTC] — Session Summary

**Duration:** [X minutes]  
**User:** [Your name]  

---

### Topics Researched
- [Topic 1] — [1–2 sentence summary] | Status: [Completed / In Progress]
- [Topic 2] — Status: Completed

### Newsletters Drafted
- [Title 1] — [Hook preview] | Word count: X | Status: [Drafted / Reviewed / Approved / Sent]
- [Title 2] — Status: Reviewed (Pass)

### Quality Audits Completed
- Tone Enforcement: [X issues found]
- Length Validation: [X issues found]
- Link Checking: [X issues found]
- Output Review: [Pass / Needs Edits]

### Approvals
- [Newsletter title] — [APPROVED] @ HH:MM UTC — Human feedback: "[Notes]"

### Performance Logged
- [Newsletter title] — Opens: X% | CTR: Y% | Unsubscribes: Z%

### Next Steps
- [Action item 1]
- [Action item 2]

---
```

---

## Example Session Log Entry

```markdown
## 2026-06-13 14:32 UTC — Session Summary

**Duration:** 47 minutes  
**User:** tushar2704  

---

### Topics Researched
- AI Regulation Trends Q2 2026 — EU enforcement, US framework, Asian standards | Status: Completed
- Enterprise Agentic Workflows — McKinsey data, case studies, expert commentary | Status: In Progress (50%)

### Newsletters Drafted
- "5 AI Trends Reshaping Enterprise Tech" — Hook: "Enterprises stopped chasing announcements..." | Word count: 487 | Status: Reviewed (Pass)

### Quality Audits Completed
- Tone Enforcement: 0 issues
- Length Validation: 1 issue (preview text trim)
- Link Checking: 2 issues (1 timeout, 1 weak anchor)
- Output Review: Pass

### Approvals
- "5 AI Trends Reshaping Enterprise Tech" — [APPROVED] @ 14:28 UTC — Human feedback: "Great hook. Fix preview text trim before send."

### Performance Logged
- (None this session — newsletters sent last week)

### Next Steps
- Trim preview text to 80 characters
- Test timeout link again before final send
- Complete research on Agentic Workflows (session cut short)
- Draft follow-up "Agentic Workflows" newsletter next session

---
```

---

## How the Hook Works

1. **Trigger:** At end of session (when you run `/stop` or exit Claude Code)
2. **Collect:** Hook gathers all CLI commands, tool use, and session context
3. **Parse:** Identifies research topics, newsletter drafts, reviews, approvals, and performance data
4. **Format:** Structures data into markdown sections
5. **Append:** Adds session summary to end of `session-log.md`
6. **Timestamp:** Logs with UTC timestamp and user name

---

## Using the Session Log

### Search Your History

```bash
# Find all sessions where you worked on a specific topic
grep -i "AI regulation" session-log.md

# Find all newsletters that were approved
grep "\[APPROVED\]" session-log.md

# Find sessions by date
grep "2026-06-" session-log.md
```

### Track Performance Over Time

Review the Performance Logged section to see trends:

- Are open rates improving?
- Which topics consistently outperform?
- What unsubscribe rate is normal for your list?

### Identify Patterns

Look at Next Steps sections to see what work carried over:

- Do you frequently leave sessions mid-research?
- Which newsletter types take longest to draft and review?
- How often do human approvals request changes?

---

## Customization

To adjust what gets logged:

1. Edit `.claude/hooks/session-summary.sh`
2. Modify the section templates to include additional fields
3. Restart Claude Code

Example addition (add reply rate if you track it):

```bash
echo "**Replies:** [Number of direct responses]" >> session-log.md
```

---

## Tips

- **Review your log weekly:** Identify patterns in what works (topics, tone, length, hook style)
- **Use for roadmap planning:** If you see consistent requests for follow-ups, those become next newsletter topics
- **Share with team:** If you have an editor or co-founder, share session logs as a way to communicate progress
- **Measure progress:** Look back at logs from a month ago—are you drafting faster? Getting fewer revision requests?

---
