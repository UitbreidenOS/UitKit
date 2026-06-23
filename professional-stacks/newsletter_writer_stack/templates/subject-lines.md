# Subject Line Templates & Examples

Subject lines are the first impression. Use these patterns to generate variations quickly, then test with `/optimize-subject-line`.

---

## Patterns

### Pattern 1: Number + Insight

**Format:** `[NUMBER] [TREND/RESULT] [SPECIFICITY]`

**Examples:**
- "5 AI Trends Reshaping Enterprise Tech (Q2 2026)"
- "67% of Fortune 500 Now Testing Agentic Workflows"
- "3 Regulatory Changes That Will Hit Your Budget"
- "12 Enterprise Tech Hires Signal This Market Shift"

**Why it works:** Numbers are attention-grabbing. Readers know exactly what they're getting (5 trends, not 10).

**Character count:** 35–50 characters (be specific, not vague)

---

### Pattern 2: Curiosity / Question-Based

**Format:** `[QUESTION] About [TOPIC]?`

**Examples:**
- "Why Most Enterprise AI Projects Will Fail"
- "What's Really Driving AI Consolidation (Hint: It's Not What You Think)"
- "How Much Is AI Actually Saving Your Competitors?"
- "The One Thing Everyone Gets Wrong About Enterprise LLMs"

**Why it works:** Questions create open loops. Readers want answers. Works especially well for contrarian takes.

**Character count:** 40–50 characters

---

### Pattern 3: Urgency / FOMO

**Format:** `[TREND] Is Happening [NOW/THIS QUARTER/THIS WEEK]`

**Examples:**
- "Enterprise AI Consolidation Is Already Here"
- "The Great Model Migration Starts Now"
- "Agentic Workflows Just Hit Production at Fortune 500"
- "Your Competitors Are Skipping the Multi-Model Phase"

**Why it works:** Creates sense of immediacy and relevance. Effective for time-sensitive announcements.

**Character count:** 35–45 characters

---

### Pattern 4: Data-Driven / Specific Stat

**Format:** `[X%/NUMBER] [PHENOMENON]; Here's Why`

**Examples:**
- "68% of Enterprise AI Budgets Go Unused—Here's Why"
- "$2.3B In Wasted AI Pilots (And How to Avoid Yours)"
- "The Enterprise AI Spending Paradox (And What It Means)"

**Why it works:** Specific, verifiable, promises an explanation. High credibility.

**Character count:** 40–50 characters

---

### Pattern 5: Contrarian / Provocative

**Format:** `[BOLD CLAIM] About [TOPIC]`

**Examples:**
- "Stop Building AI Products, Start Using Them"
- "Your Enterprise AI Strategy Is Already Obsolete"
- "The AI Skills Gap Is Closing Faster Than You Think"
- "Multi-Model Stacks Are Dead (And That's Good)"

**Why it works:** Challenges assumptions. Attracts skeptical, high-engagement readers. Risk: may alienate some segments.

**Character count:** 35–50 characters

---

### Pattern 6: Benefit / Outcome-Focused

**Format:** `How to [BENEFIT] With [SPECIFIC METHOD]`

**Examples:**
- "How to Cut Enterprise AI Costs by 40%"
- "Speed Up Your AI Rollout: The Consolidation Playbook"
- "Avoid the $5M AI Integration Mistake"

**Why it works:** Readers immediately see value. Works for action-oriented audiences.

**Character count:** 35–50 characters

---

## Quick-Generate Exercise

**Step 1:** Your newsletter topic: `[INSERT YOUR TOPIC]`

**Step 2:** Generate variations:

| Pattern | Your Topic | Subject Line |
|---|---|---|
| **Number + Insight** | [Topic] | `5 [Trends] [About Your Topic]` |
| **Question-Based** | [Topic] | `Why [Surprising Claim] About [Topic]` |
| **Urgency** | [Topic] | `[Topic] Is Happening Now` |
| **Data-Driven** | [Topic] | `[X%] [Phenomenon]—Here's Why` |
| **Contrarian** | [Topic] | `Stop [Old Way]; Start [New Way]` |
| **Benefit-Focused** | [Topic] | `How to [Outcome] With [Topic]` |

**Step 3:** Pick top 3 and test with `/optimize-subject-line`

---

## Character Limits by Email Client

| Client | Visible Chars | Recommendation |
|---|---|---|
| **Desktop (Gmail, Outlook)** | 55–70 | Aim for 50 |
| **Mobile (iPhone, Android)** | 30–45 | Hard limit; be specific early |
| **Apple Mail** | 50–60 | Aim for 50 |

**Rule:** Keep primary message in first 40 characters. Everything after 50 is cut on mobile.

---

## Testing & Selection

Once you have 3 variations, run:

```
/optimize-subject-line [variation 1] / [variation 2] / [variation 3]
```

The command will:
1. Score each by predicted open rate
2. Estimate which appeals to which segment
3. Recommend a winner

Then send the winning variation to your full list, or A/B test all 3 on segments.

---

## Examples from High-Performing Newsletters

### Lenny's Product Lessons
- "Why Most Product Roadmaps Are Ineffective" (contrarian)
- "How to Build 10x Better Roadmaps" (benefit-focused)

### Stratechery
- "The State of Tech: 2026 Edition" (authority)
- "Why Apple's New Strategy Just Changed Everything" (urgency + impact)

### The Verge
- "The AI Arms Race Is Getting Ridiculous" (emotion + urgency)
- "5 Big Announcements From This Week's AI Summit" (number + newsworthiness)

---

## Words That Boost Open Rates

Research-backed words to **include**:
- "The," "You," "How," "Why," numbers (5, 7, etc.), specific timeframes ("Q2 2026")

Words to **avoid**:
- "Re:", "[No Subject]," "Follow up," all-caps (unless intentional), multiple punctuation marks

---

## What NOT to Do

- **Misleading claims:** "Click this to see one weird trick" (clickbait hurts long-term trust)
- **ALL CAPS:** Looks like spam, reduces credibility
- **Too clever:** Puns are fun but confuse mobile readers
- **Generic:** "Newsletter #47," "Monthly Update" (no value signal)
- **Spam triggers:** "Free," "Limited time," "Act now" (unless truly limited)

---

## Final Checklist

Before sending any newsletter:

- [ ] Subject line is <50 characters (test on mobile)
- [ ] First 40 characters convey the key value/curiosity
- [ ] Line matches newsletter content (no bait-and-switch)
- [ ] You'd personally open this email
- [ ] It's been tested with `/optimize-subject-line`

---

Built with [Claudient](https://github.com/UitbreidenOS/Claudient) · [Newsletter Writer Stack](./README.md)
