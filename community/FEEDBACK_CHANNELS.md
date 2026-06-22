# Community Feedback Channels

This document outlines where and how to submit feedback, report issues, and suggest improvements for Claudient. We value your input and are committed to timely, thoughtful responses.

---

## Primary Feedback Channels

### GitHub Discussions
**Best for:** Feature requests, high-level questions, discussions about stack design, feedback on documentation

- **URL:** https://github.com/claudient/claudient/discussions
- **Categories:**
  - **Stack Showcase** — Share your published stacks, ask for design feedback
  - **Feature Ideas** — Propose new features or improvements to existing ones
  - **Getting Help** — Ask questions about stack development, CLAUDE.md structure, skill design
  - **Show & Tell** — Share cool use cases or interesting workflows
  - **Announcements** — Official updates from Claudient maintainers

**Response SLA:** 48 hours for acknowledgment; full response within 1 week

**Guidelines:**
- Search existing discussions before posting (avoid duplicates)
- Be specific: include examples, error messages, or screenshots
- Follow the issue template provided
- Discussions may be promoted to GitHub Issues if they reveal bugs

---

### GitHub Issues
**Best for:** Bug reports, technical problems, documentation errors, security concerns

- **URL:** https://github.com/claudient/claudient/issues
- **Types:**
  - **Bug:** Something doesn't work as documented
  - **Documentation:** README, guides, or examples need clarification
  - **Enhancement:** Minor improvements to existing functionality
  - **Security:** Vulnerabilities (email security@claudient.dev instead for sensitive issues)

**Response SLA:** 24 hours for critical bugs; 72 hours for all others

**Guidelines:**
- Use the bug report template (include OS, Claude Code version, reproducible steps)
- Check the roadmap first—your issue may already be planned
- Assign labels: `bug`, `documentation`, `enhancement`, `stack-specific`
- Include logs, screenshots, or minimal reproducible examples

---

### Discord Server
**Best for:** Real-time chat, community help, live debugging, networking with other contributors

- **Server:** [https://discord.gg/claudient](https://discord.gg/claudient)
- **Key channels:**
  - **#general** — News, announcements, community chat
  - **#matrix-theme** — Feedback and discussion for the matrix-theme stack
  - **#svg-inspector** — Feedback and discussion for the svg-inspector stack
  - **#swarm-sandbox** — Feedback and discussion for the swarm-sandbox stack
  - **#help** — Ask questions (for quick answers, not bug reports)
  - **#showcase** — Share your stacks, skills, and workflows
  - **#random** — Off-topic fun and community building

**Response SLA:** Community members typically respond within 2-4 hours during active hours (9am–10pm UTC)

**Guidelines:**
- Use threads to keep channels organized
- Search message history before asking (avoid repeat questions)
- Be respectful and on-topic
- For critical bugs, create a GitHub Issue and link it in Discord

---

### Reddit
**Best for:** Broader audience reach, community discussions, best practices sharing

- **Subreddit:** [r/claudient](https://reddit.com/r/claudient)
- **Categories:**
  - Stack releases and updates
  - Tips, tricks, and workflows
  - Questions and troubleshooting
  - Community meetups and events

**Response SLA:** 72 hours from moderators/maintainers

**Guidelines:**
- Follow r/claudient community rules
- Search the subreddit before posting
- Use flairs: [Help], [Stack Release], [Tutorial], [Discussion]
- Cross-link with GitHub Issues for technical problems

---

### Email List
**Best for:** Newsletters, long-form feedback, formal inquiries, privacy-sensitive topics

- **Mailing List:** [community-list@claudient.dev](mailto:community-list@claudient.dev)
- **Subscribe:** [https://claudient.dev/subscribe](https://claudient.dev/subscribe)

**Use cases:**
- Subscribe for monthly newsletters (stack releases, community highlights, roadmap updates)
- Submit lengthy feature proposals or design feedback
- Report sensitive security issues (email security@claudient.dev)
- Private correspondence with Claudient maintainers

**Response SLA:** 5 business days

**Guidelines:**
- Use clear subject lines: `[FEEDBACK]`, `[BUG]`, `[SECURITY]`
- Keep emails concise but provide context
- For bugs, include OS, version info, and reproduction steps

---

## Stack-Specific Feedback

Each featured stack has its own feedback channel:

### Matrix Theme Stack
- **GitHub Issues:** https://github.com/claudient/matrix-theme/issues
- **Discord:** #matrix-theme
- **Use cases:** Theme customization issues, color/layout improvements, documentation

### SVG Inspector Stack
- **GitHub Issues:** https://github.com/claudient/svg-inspector/issues
- **Discord:** #svg-inspector
- **Use cases:** SVG parsing bugs, visualization improvements, feature requests

### Swarm Sandbox Stack
- **GitHub Issues:** https://github.com/claudient/swarm-sandbox/issues
- **Discord:** #swarm-sandbox
- **Use cases:** Multi-agent coordination, example workflows, performance tuning

---

## Response SLA Summary

| Channel | Type | SLA |
|---------|------|-----|
| **GitHub Issues** | Bugs (critical) | 24 hours |
| **GitHub Issues** | Bugs (standard) | 72 hours |
| **GitHub Discussions** | Feature requests | 1 week |
| **Discord** | General questions | 2-4 hours |
| **Reddit** | Community posts | 72 hours |
| **Email** | Direct feedback | 5 business days |

**SLA definition:** Time to initial acknowledgment + preliminary response, not necessarily resolution. Complex issues may require longer for investigation and fix.

---

## Best Practices for Feedback

### Do:
- ✓ Search existing feedback before posting (avoids duplicates)
- ✓ Be specific and include reproducible examples
- ✓ Provide context: OS, Claude Code version, stack version
- ✓ Link related issues (e.g., "This is similar to #123")
- ✓ Be patient—maintainers are volunteers and often have limited time
- ✓ Follow up constructively if your issue is marked "needs more info"
- ✓ Thank maintainers and community helpers publicly

### Don't:
- ✗ Post the same feedback across multiple channels simultaneously (choose one)
- ✗ Bump old issues without new information
- ✗ Use feedback channels for general chat (use Discord #general instead)
- ✗ Include sensitive credentials or API keys
- ✗ Post low-effort issues ("doesn't work, fix it")
- ✗ Cross-post across Reddit, Discord, and GitHub without noting it

---

## Escalation Process

**If your issue isn't resolved within the SLA:**

1. **GitHub Issues:** Add a comment pinging a maintainer (`@claudient-maintainers`)
2. **Discord:** Move to #help or tag a moderator
3. **Email:** Reply to your thread or open a new issue with `[URGENT]` prefix
4. **Reddit:** Report the post to r/claudient moderators

**For critical bugs:**
- If affecting production use, email security@claudient.dev with `[CRITICAL]` in subject
- Include workarounds if available

---

## Feedback Review & Prioritization

Claudient maintainers review feedback using this priority model:

1. **Critical bugs** (functionality broken, data loss, security) → 24h review
2. **High-impact feature requests** (solve common problems, align with roadmap) → 1-2 weeks
3. **Stack-specific issues** (individual stacks) → 1-2 weeks
4. **Documentation/examples** (clarity, typos) → 2-3 weeks
5. **Nice-to-have features** (quality-of-life, niche use cases) → Triaged quarterly

---

## Community Moderation

Our Discord and Reddit communities are moderated by:
- Claudient core team
- Volunteer community moderators
- Stack maintainers

**Moderation guidelines:**
- We enforce a code of conduct (no harassment, spam, or off-topic content)
- Spam and commercial promotion are removed
- Discussions that violate community standards may result in warnings or bans
- Maintainers reserve the right to close discussions or lock threads if they become unproductive

**Report abuse:** Use Discord's report feature or email community@claudient.dev

---

## Feedback Loop & Transparency

**How feedback shapes Claudient:**
1. All feedback is logged and reviewed in quarterly retrospectives
2. The top 5-10 items are discussed by the core team
3. Approved features/changes are added to the public roadmap
4. Community is notified when their feedback is acted upon (via announcements, Discord, email)

**Roadmap:** https://github.com/claudient/claudient/blob/main/ROADMAP.md

---

## Contact Information

| Topic | Email | Channel |
|-------|-------|---------|
| **General Feedback** | community@claudient.dev | GitHub Discussions / Discord |
| **Security Issues** | security@claudient.dev | Email (private) |
| **Stack Support** | [stack-author@email.com] | Stack-specific repo or Discord |
| **Business Inquiries** | hello@claudient.dev | Email |

---

## Acknowledgments

We are grateful to our community for:
- Reporting bugs and suggesting improvements
- Writing guides and examples
- Maintaining stacks and sharing expertise
- Answering questions and helping new contributors
- Sharing their workflows and use cases

Contributors are credited in each stack's README and in the monthly community newsletter.

---

**Last updated:** June 22, 2026 | **Maintained by:** Claudient Community Team
