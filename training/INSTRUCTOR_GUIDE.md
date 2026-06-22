# INSTRUCTOR GUIDE

Comprehensive resource for trainers delivering Claudient workshops and certification programs.

---

## Table of Contents

1. [Overview](#overview)
2. [Pre-Training Preparation](#pre-training-preparation)
3. [Slide Deck & Speaker Notes](#slide-deck--speaker-notes)
4. [Lab Environment Setup](#lab-environment-setup)
5. [Delivery Strategies](#delivery-strategies)
6. [Assessment Rubrics](#assessment-rubrics)
7. [Troubleshooting Guide](#troubleshooting-guide)
8. [Office Hours Protocol](#office-hours-protocol)
9. [Post-Training Follow-Up](#post-training-follow-up)

---

## Overview

### Instructor Role & Responsibilities

- **Facilitator**: Guide learners through Claudient concepts and workflows
- **Environment Manager**: Ensure lab environments are provisioned and functional
- **Assessor**: Evaluate hands-on exercises using standardized rubrics
- **Support Provider**: Run office hours and provide async feedback
- **Adapter**: Customize content to audience skill level and timeline

### Key Outcomes by Training Format

| Format | Duration | Audience | Key Outcome |
|--------|----------|----------|------------|
| **Bootcamp** | 5 days full-time | Beginner-to-intermediate | Build & deploy an AI agent from scratch |
| **Workshop** | 3 days part-time | Intermediate | Master workflows, hooks, and custom skills |
| **Certification** | Self-paced (4-6 weeks) | Intermediate-to-advanced | Pass capstone project review |
| **Office Hours** | 1–2 hrs weekly | Any level | Unblock specific use cases, Q&A |

---

## Pre-Training Preparation

### 4 Weeks Before

- [ ] Review current Claudient docs and release notes
- [ ] Test all lab exercises in a clean environment
- [ ] Identify any breaking changes or new features
- [ ] Update slide decks and speaker notes
- [ ] Confirm learner roster and technical prerequisites
- [ ] Send pre-work email (installation, git setup, environment variables)

### 2 Weeks Before

- [ ] Provision lab environments (VMs, containers, or cloud instances)
- [ ] Test SSH/VPN access, port forwarding if needed
- [ ] Create shared Google Drive / GitHub repo for class materials
- [ ] Record optional "Getting Started" video (15–20 min)
- [ ] Prepare breakout room assignments for group work
- [ ] Brief co-facilitators (TAs) on schedule and pain points

### 1 Week Before

- [ ] Dry-run all slides and demos in front of a colleague
- [ ] Verify all external links, code repos, and tool access
- [ ] Test screen sharing, recording setup, and audio
- [ ] Prepare backup environment (USB drive with pre-built images)
- [ ] Send calendar reminders with Zoom link and tech requirements

### Day Before

- [ ] Check lab environments one final time
- [ ] Review learner pre-work submissions
- [ ] Prepare opening slides with housekeeping info
- [ ] Set up break-out rooms in Zoom / Teams
- [ ] Have IT support phone number ready
- [ ] Charge laptop, test video conferencing setup

---

## Slide Deck & Speaker Notes

### Deck Structure (Modular)

Each training format has a corresponding deck in Google Slides (link in syllabus).

#### Module Breakdown

**Day 1: Foundations**
- Slide 1–5: Welcome, agenda, logistics
- Slide 6–15: What is Claudient? Core concepts (skills, agents, hooks)
- Slide 16–25: Hands-on: Installing Claude Code & Claudient
- Slide 26–30: Lab 1: Create your first skill

**Day 2: Workflows & Hooks**
- Slide 1–5: Recap and learning objectives
- Slide 6–20: Workflow orchestration deep dive
- Slide 21–30: Hook architecture and event triggers
- Slide 31–40: Lab 2: Build a multi-step workflow
- Slide 41–45: Checkpoint quiz

**Day 3: Custom Agents & Advanced Patterns**
- Slide 1–10: Recap, objectives, common questions
- Slide 11–25: Agent design patterns and delegation
- Slide 26–40: Advanced MCP and tool integration
- Slide 41–50: Lab 3: Design and implement a custom agent
- Slide 51–55: Q&A, office hours signup

### Speaker Notes Template

Each deck includes detailed speaker notes (accessible in edit mode) with:

```
[SLIDE 12: "Skills vs. Workflows"]

TALKING POINTS (2–3 min):
- Start with real-world analogy: skills are recipes, workflows are meal prep
- Show side-by-side comparison table
- Emphasize that skills are reusable, workflows orchestrate them

COMMON QUESTIONS:
Q: Can a skill call another skill?
A: Not directly—delegate via agents instead for clean separation

DEMO (live coding):
- Open CLAUDE.md of an existing skill
- Point out the structure: When to activate, Instructions, Example
- Show how it integrates into ~/.claude/settings.json

TRANSITION TO NEXT SLIDE:
"Now that you understand the difference, let's see how they work together..."
```

### Customization Tips

- **For advanced groups**: Skip foundational slides, add advanced use cases
- **For mixed skill levels**: Pair beginners with intermediate learners in labs
- **For async cohorts**: Record 10–15 min summary videos per module, post weekly
- **For specialized tracks** (AI engineering, DevOps, etc.): Swap Day 3 content

---

## Lab Environment Setup

### Local Development (Preferred for Bootcamp)

Learners develop on their own macOS/Linux/Windows machine.

**Prerequisites Check (Pre-Work)**

Learners should complete before Day 1:
```bash
# macOS / Linux
node --version          # v18+
git --version           # v2.37+
npm --version           # v9+
which claude-code       # Claude Code CLI installed

# Verify git config
git config --global user.name
git config --global user.email

# Test Claude API access
echo $ANTHROPIC_API_KEY  # Should be set
```

**Setup Script** (`setup-lab.sh`)

Provide all learners with this one-line setup:
```bash
curl -fsSL https://claudient-labs.example.com/setup.sh | bash
```

Script tasks:
1. Clone Claudient repo to ~/claudient-labs
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and prompt for API key
4. Run test suite: `npm test`
5. Print success message with next steps

### Cloud-Based Lab (For Async / Large Cohorts)

Use AWS, GCP, or Azure with pre-built images.

**Architecture**

```
┌─────────────────────────────────────────────┐
│ Learner Laptop                              │
│ (browser, SSH client)                       │
└────────────┬────────────────────────────────┘
             │ SSH / HTTPS
             ▼
┌─────────────────────────────────────────────┐
│ Cloud Lab Environment (t3.large instance)   │
│ - Ubuntu 22.04                              │
│ - Claude Code CLI pre-installed             │
│ - Project repo cloned                       │
│ - VS Code Server (port 8080)                │
│ - Shared lab materials (S3)                 │
└─────────────────────────────────────────────┘
```

**Provisioning Steps**

1. Create AMI with base tools pre-installed
2. Use Terraform to spin up N instances (one per learner)
3. Tag with learner email, auto-assign security group
4. Generate per-learner SSH keys, upload to learner portal
5. Print connection card: SSH command, VS Code Server URL, lab notebook link

**Tear-Down** (post-training)

```bash
# Auto-stop instances after 24 hrs of inactivity
# Learners can request extension via Slack
# Delete all instances 7 days after training end date
```

### Shared Lab Space (Optional: For Instructor Demo)

Separate environment for live demos and debugging.

- **Machine**: Dedicated laptop or small cloud instance
- **Purpose**: Isolate from learner environments, test new exercises
- **Access**: Instructor + TAs only
- **Snapshots**: Take pre-demo snapshots so you can revert cleanly

---

## Delivery Strategies

### Day 1: Building Momentum

**9:00–9:30 AM — Welcome & Logistics**

- Ice breaker: Ask 2–3 learners why they're here (capture motivations)
- Housekeeping: break times, Slack channel, office hours URL
- Quick poll: "How many of you have used Claude Code before?" (set baseline)
- Show 2-min demo video: "What you'll build by end of week"

**9:30–10:30 — Conceptual Overview**

- Start with pain point: "Why do we need Claudient?"
  - Without it: manually orchestrate Claude APIs, manage prompts, repeat logic
  - With it: skills, workflows, hooks, reusable agents
- Show three short examples on screen (code snippets, not full slides)
  1. A simple skill (5 lines)
  2. A workflow (10 lines)
  3. A hook trigger (3 lines)
- Pause for questions every 15 min

**10:30–11:00 — Break**

**11:00–12:30 — Hands-On: Local Setup**

- Screen share your terminal: run setup-lab.sh step-by-step
- Learners follow along on their machine
- TAs roam in Zoom breakout rooms, help with errors
- Use Slack for async help (don't wait for hand)
- **Checkpoint**: Everyone runs `npm test` successfully

**12:30–1:00 PM — Lunch**

**1:00–3:00 — Lab 1: Create a Skill**

- Guided walkthrough (30 min): build a "reverse string" skill together
  - Show the CLAUDE.md format
  - Write the skill markdown file
  - Test with `/reverse hello`
- Independent work (60 min): learners build their own skill (domain of choice)
- Peer review (30 min): learners trade skills, test each other's, give feedback
- Debrief (10 min): share 2–3 favorite skills created

### Mid-Week: Deepen Understanding

**Day 2–3 Rhythm**

- **Morning standup** (10 min): What did you build yesterday? Any blockers? (cold-call 3–5 learners)
- **Concept + demo** (45 min): New topic with live coding
- **Hands-on lab** (90 min): Guided + independent work
- **Show & tell** (20 min): Volunteer to demo their work

**Handling Struggles**

If 25%+ of learners are stuck on a concept:
- Pause and revisit the concept with a different analogy
- Do a mini-demo focusing on the pain point
- Offer "starter code" for the next exercise

If only 1–2 learners are struggling:
- Don't delay the group; have a TA work 1-on-1 in a breakout room
- Offer async follow-up (office hours or recorded explanation)

### Day 5: Capstone & Celebration

**Morning: Capstone Project Kickoff**

- Learners propose a skill + workflow to build in next 4 hours
- Instructor reviews each proposal for scope (not too big, not too small)
- Learners work in teams of 2–3
- Instructors available for questions (no passive lecturing)

**Midday Presentations**

- Each team presents 5 min: what they built, how it works, demo
- Audience asks 1–2 questions per project
- Instructor gives constructive feedback

**Wrap-Up (last 30 min)**

- Share class survey link (collect feedback while fresh)
- Announce office hours schedule and certification track
- Celebrate everyone who showed up and tried hard
- Optional: group photo, sign certificate

---

## Assessment Rubrics

### Lab Exercise Rubric (per submission)

Use this 4-point scale for each hands-on exercise.

| Criterion | Excellent (4) | Good (3) | Needs Work (2) | Incomplete (1) |
|-----------|---|---|---|---|
| **Correctness** | Passes all tests, handles edge cases | Passes all tests | Passes most tests | Fails tests or doesn't run |
| **Code Quality** | Clean, well-structured, follows conventions | Generally clear, minor improvements | Some readability issues, inconsistent style | Difficult to follow |
| **Documentation** | Clear comments, CLAUDE.md format perfect | Mostly documented, minor gaps | Minimal documentation | No docs |
| **Creativity** | Goes beyond requirements, novel approach | Meets requirements fully | Meets most requirements | Incomplete requirements |

**Scoring**: 13–16 pts = Pass | 10–12 pts = Pass w/ revision | 7–9 pts = Needs resubmission | <7 = Does not pass

### Capstone Project Rubric

Use this for final project assessment (worth 40% of certification grade).

| Criterion | Weight | Excellent | Good | Acceptable | Needs Improvement |
|-----------|--------|-----------|------|------------|------------------|
| **Functionality** | 25% | Feature-complete, no bugs | Works as intended, minor issues | Core works, some limitations | Incomplete or broken |
| **Architecture** | 25% | Well-designed, reusable patterns | Solid design, clear separation | Acceptable structure | Monolithic, unclear logic |
| **Documentation** | 20% | Comprehensive README, inline comments | Good README, some comments | Basic README, minimal comments | Missing or unclear docs |
| **Testing** | 15% | Full test coverage, edge cases | Good coverage, some gaps | Basic tests | No tests |
| **Presentation** | 15% | Clear demo, confident explanation | Mostly clear, good pace | Adequate explanation | Unclear or rushed |

**Scoring**: 45–50 pts = Distinction | 40–44 pts = Pass | 35–39 pts = Pass (revision required) | <35 = Does not pass

### Peer Review Rubric (optional, builds community)

Learners review each other's work using this simple scale:

**Code Review Comment Template**

```
WHAT WORKS WELL:
- [Specific praise, e.g., "Great use of async/await"]

QUESTIONS / SUGGESTIONS:
- [Concrete improvement, e.g., "Could you extract this function?"]

LEARNED FROM THIS:
- [What reviewer learned from reviewer's code]
```

Collect these comments and forward to learners after training (optional anonymized).

---

## Troubleshooting Guide

### Common Lab Setup Issues

**Problem: "npm install" fails with peer dependency warnings**

```bash
# Cause: Node version mismatch or npm cache corruption
# Solution 1: Clear npm cache
npm cache clean --force

# Solution 2: Use npm 7+ (auto-resolves peer deps)
npm install -g npm@latest

# Solution 3: Use .nvmrc for exact Node version
nvm use
npm install
```

**Problem: "Claude Code CLI not found" after installation**

```bash
# Cause: Installation didn't add to PATH
# Solution 1: Check installation
which claude-code  # Should print path

# Solution 2: Reinstall
npm install -g @anthropic-ai/claude-code

# Solution 3: Add to PATH manually (macOS/Linux)
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Problem: ANTHROPIC_API_KEY not recognized**

```bash
# Cause 1: Variable not exported
export ANTHROPIC_API_KEY="sk-ant-..."

# Cause 2: Wrong shell config file
# Check which shell: echo $SHELL
# Add to ~/.bash_profile (bash) or ~/.zshrc (zsh)

# Cause 3: API key format incorrect
# Verify: echo $ANTHROPIC_API_KEY | wc -c
# Should be 95+ characters
```

**Problem: "Git user not configured" error**

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global core.editor "vim"  # or your preferred editor
```

### Common Lab Execution Issues

**Problem: Test failures with "Haiku not available"**

```bash
# Cause: Model not in ANTHROPIC_API_KEY account or API quota exceeded
# Solution:
# 1. Check API key is for correct account
# 2. Log into console.anthropic.com and verify Haiku is available
# 3. Check rate limits: wait 1–2 min and retry
# 4. For bootcamp: use instructor's API key as fallback
```

**Problem: Learner repo diverges from main branch**

```bash
# Cause: Merge conflicts, local commits out of sync
# Solution (in learner's lab env):
git status
git stash                      # Save local work
git fetch origin
git checkout main
git pull origin main
git stash pop                  # Restore local work, resolve conflicts
```

**Problem: Skill or workflow not appearing in /slash menu**

```bash
# Cause: Changes not saved, file format invalid, or CLI not reloaded
# Solution:
# 1. Verify file saved: cat ~/.claude/skills/my-skill.md
# 2. Check format: CLAUDE.md structure correct?
# 3. Reload CLI: claude-code restart  (or kill -9 $PID)
# 4. Verify settings.json: cat ~/.claude/settings.json | jq
```

**Problem: Workflow hangs or never completes**

```bash
# Cause: Infinite loop, API timeout, or blocking subprocess
# Solution (for learner):
# 1. Check logs: tail -50f ~/.claude/logs/current.log
# 2. Kill workflow: Ctrl+C in terminal
# 3. Inspect workflow definition for loops or missing exit conditions
# 4. Test individual steps in isolation
# 5. Increase timeout: update settings.json workflowTimeout
```

### Common Conceptual Misunderstandings

**Misconception: "Skills and workflows are the same thing"**

- Skills are *components* (single, reusable task)
- Workflows are *compositions* (orchestrate skills + logic)
- Analogy: skill = function, workflow = script calling functions

**Misconception: "I need to commit my CLAUDE.md files to git"**

- CLAUDE.md files are configuration, not app code
- Store in `~/.claude/` or project `.claude/` directory
- Only commit `.claude/` to git if team sharing
- Personal skills → `~/.claude/`, shared skills → repo `.claude/`

**Misconception: "Hooks run continuously"**

- Hooks fire *on events* (file change, git commit, command failure)
- They don't poll or loop on their own
- Configure in settings.json with trigger condition
- Learner should add `"onFileSave": [ { "run": "lint" } ]` not a polling daemon

**Misconception: "Agents are just AI models"**

- Agents are *orchestration templates* that choose tools and manage context
- They wrap Claude (any model) with specialized tool access and memory
- Delegation to agents is about *isolation* and *specialized knowledge*, not just using different model

---

## Office Hours Protocol

### Scheduling & Communication

**Frequency**: 1–2 sessions per week for 4 weeks post-training

**Session Details**:
- Duration: 60 min (50 min Q&A + 10 min admin)
- Platform: Zoom (same link every week)
- Recording: Yes (post to learner portal)
- Attendance: Optional, drop-in format
- Max size: 15–20 learners per session (split if larger cohort)

**Announcement Template**

```
Hi everyone,

Office hours are Thursday 4–5pm PT and Tuesday 10–11am PT for the next 4 weeks.

Zoom link: [link]
Agenda: Bring your questions, blockers, or ideas for projects.

To ask a question:
1. Raise hand (Zoom) or type in Slack #office-hours
2. Instructor calls on you (FIFO)
3. Screen share if you need help debugging

Looking forward to seeing you!
```

### Pre-Session Prep (Instructor)

- [ ] Review Slack #office-hours for common questions
- [ ] Prepare 2–3 mini-demos if needed (e.g., "How to debug a stuck workflow")
- [ ] Note any learner struggles from previous labs (follow up)
- [ ] Have CLAUDE.md and troubleshooting guide open
- [ ] Start recording 2 min before scheduled time

### Session Structure

**Minute 0–5: Welcome & Icebreaker**

```
"Hi folks, thanks for joining! Quick reminder:
- This is a Q&A space, no judgment
- Share your screen if you want live help
- We'll record and post the video later
- Who's here this week? Anyone from the bootcamp? Certification track?"
```

**Minute 5–50: Q&A (Structured)**

1. **Poll for burning questions** (2 min)
   - "What's one thing you're stuck on?" (Slack poll or chat)
   - Vote on most common issues

2. **Address top 3 issues** (15 min each)
   - Have learner (or instructor) screen share
   - Live debug or demo solution
   - Explain the "why", not just the fix
   - Ask class: "Anyone else hit this?"

3. **Open Q&A** (remaining time)
   - Learner raises hand, asks question
   - Instructor or peer answers
   - Keep time per question to 3–5 min

**Minute 50–55: Mini-Demo or Announcement**

Examples:
- "Advanced pattern: nesting workflows"
- "New feature in Claude Code v2.0"
- "Recap of capstone project requirements"

**Minute 55–60: Wrap-Up & Next Steps**

```
"Great questions today. Quick reminders:
- Next office hours: [date]
- Post your questions in Slack if you can't make it
- Lab #4 due [date]
- Reach out to me individually if you need 1-on-1 help

See you next week!"
```

### Handling Difficult Questions

**"I'm completely lost; can you just write the code for me?"**

- Acknowledge frustration
- Pivot: "Let's break this down step-by-step. First, what's the smallest thing you're unsure about?"
- Pair with a peer mentor or offer 1-on-1 follow-up
- Don't code for them; guide the thought process

**"This is too advanced / too basic for me"**

- Differentiation is real; acknowledge it
- Offer parallel tracks: "Advanced learners, try [stretch goal]. Beginners, here's a [starter template]"
- Suggest 1-on-1 or different cohort for future training

**"Your training materials have a bug / are outdated"**

- Thank them; take responsibility
- Explain why (if known) + commit to fix
- Offer workaround for now
- Follow up with fix before next office hours
- Mention them in release notes (credit)

### 1-on-1 Office Hours (By Appointment)

For learners who need deeper help:

- 20–30 min slot, weekly or bi-weekly
- Learner books via Calendly link
- Focus areas: capstone project, certification prep, career questions
- Share code/screen via GitHub + Zoom
- Keep notes in shared Google Doc (learner + instructor)

---

## Post-Training Follow-Up

### Day After Training Ends

**Send Summary Email**

```
Hi Team,

Thanks for an amazing week! Here's what we covered and what's next.

WEEK 1 RECAP:
- Day 1: Skills fundamentals (20+ skills created!)
- Day 2: Workflows and hooks
- Day 3: Agents and advanced patterns
- Day 4: Capstone project kickoff
- Day 5: Presentations

CAPSTONE PROJECTS:
- [Team 1 project name]: [brief description]
- [Team 2 project name]: [brief description]
[List top 3–5]

CERTIFICATIONS:
Capstone projects are due in 2 weeks. Details: [link]

OFFICE HOURS:
Tuesdays 10–11am PT and Thursdays 4–5pm PT. Zoom: [link]

STAY CONNECTED:
- Slack channel: #claudient-alumni
- GitHub: github.com/anthropic/claudient
- Monthly newsletter: [subscribe]

Thanks again. You did great!
[Instructor name]
```

### 1 Week Post-Training

**Capstone Review**

- Learners submit capstone projects (via GitHub PR or uploaded files)
- Instructor reviews each using Capstone Rubric
- Provide feedback within 3–5 days:
  - What they did well
  - 2–3 specific improvements
  - Path to certification (if applicable)
- Learners revise and resubmit

### 4 Weeks Post-Training

**Certification Grades Released**

- Post-training learners notified of pass/distinction status
- Certification awarded (digital badge + certificate PDF)
- Share on LinkedIn, GitHub, etc.

**Feedback Survey** (if not already sent)

```
Quick survey: bit.ly/claudient-feedback

1. Overall satisfaction (1–5)
2. Most valuable topic (pick one)
3. What could we improve?
4. Would you recommend to a colleague?
5. Interest in advanced workshops? (Agents, MCP, etc.)
```

### Ongoing (Monthly)

**Alumni Office Hours Continues**

- Reduced to 1x/month (optional drop-in)
- Share updates: new Claudient features, learner showcases, etc.

**Celebrate Wins**

- Learners who built cool projects in production?
- Share in Slack + company newsletter
- Invite them to speak at next bootcamp (peer mentoring)

---

## Appendices

### A. Pre-Work Checklist (Email to Learners 2 Weeks Before)

```
Hi [Learner Name],

Excited to have you in the Claudient bootcamp! Before we start, please complete this pre-work.

INSTALL REQUIRED TOOLS:
- [ ] Node.js 18+ (node --version)
- [ ] Git 2.37+ (git --version)
- [ ] Claude Code CLI (npm install -g @anthropic-ai/claude-code)
- [ ] Text editor (VS Code recommended)

SETUP YOUR ENVIRONMENT:
- [ ] Create Anthropic API key: console.anthropic.com
- [ ] Add to ~/.env: export ANTHROPIC_API_KEY="sk-ant-..."
- [ ] Git config: git config --global user.name "Your Name"

VERIFY YOUR SETUP:
- [ ] Run: node --version (should print v18+)
- [ ] Run: claude-code --version (should print version number)
- [ ] Run: curl -s https://api.anthropic.com/v1/messages \
       -H "x-api-key: $ANTHROPIC_API_KEY" | jq .
       (should not error)

WATCH (OPTIONAL):
- Video: "Getting Started with Claude Code" (15 min)
- Article: "Claudient in 5 Minutes" (5 min)

QUESTIONS?
- Reply to this email or post in Slack #bootcamp-setup

See you soon!
```

### B. Emergency Hotline (Instructor Only)

Keep this handy for day-of emergencies:

```
NETWORK DOWN:
- Use personal hotspot via phone
- Switch to async labs (learners work independently)
- Record slides + upload to Google Drive, post link to Slack

LEARNER CAN'T JOIN ZOOM:
- Send dial-in phone number
- Switch to YouTube Live as backup stream
- Have a TA call learner if video doesn't work

API KEY QUOTA EXCEEDED:
- Use instructor's backup API key (rotated weekly)
- Pause labs, wait 5–10 min, retry
- Post in Slack: "We're being rate-limited; grab coffee!"

INSTRUCTOR SICK:
- TA takes over (pre-assigned and rehearsed)
- Simplify day's content (no new topics, recap + lab time)
- Reschedule any lectures for next day

CRITICAL BUG IN LABS:
- Post in Slack immediately
- Switch to manual debugging (no automation)
- If unfixable: pivot to theory discussion + offer async lab
```

### C. Recognition & Incentives

**Peer Teaching Award**

Recognize learners who helped others:
```
Great job answering questions in Slack and lab!
Here's a $25 Amazon gift card + shoutout in next newsletter.
```

**Most Creative Project**

Vote at final presentations; winner gets:
- Featured in Claudient blog or case study
- Free pass to next workshop level
- Mention in company all-hands

**Certified Peer Mentor**

Top learners invited to TA next cohort:
- Paid role (if applicable)
- Co-teaching experience
- Added to "Claudient Instructor Network"

---

## Contact & Support

**Questions about training?**
- Email: training@claudient.dev
- Slack: #training-instructors
- Monthly instructor sync: [calendar link]

**Found a bug in course materials?**
- GitHub: issues/new (tag: training)
- Email: training-feedback@claudient.dev

**Want to contribute?**
- PR to `training/` directory
- Review by training team lead
- Credit + incentives for contributions

---

**Last Updated**: June 2026
**Maintained By**: Claudient Training Team
**License**: CC-BY-4.0
