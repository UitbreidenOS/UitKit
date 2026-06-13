---
description: Analyzes sentiment of a post or comment thread. Returns sentiment score, drivers, engagement recommendation, and moderation flag if needed.
---

# /analyze-sentiment

## What This Does

Runs the sentiment-analyzer skill on a specific post or comment. Scores sentiment (positive/neutral/negative), extracts drivers, recommends engagement or moderation action, and flags toxic content.

## Steps Claude Follows

1. Ask for: post/comment text or thread link
2. Run sentiment-analyzer skill — full analysis (polarity, tone dimensions, drivers, toxicity check)
3. Score sentiment on -1.0 to +1.0 scale with tone breakdown
4. Extract 3–5 sentiment drivers with evidence
5. Assess community impact: celebration, constructive, concern, spam, toxic, etc.
6. Return recommendation: celebrate/engage/educate/warn/escalate

## Next Action Logic

- **Very Positive (+0.7 to +1.0):** "Celebrate this! Share in #wins, tag relevant members, ask for expansion."
- **Positive (+0.3 to +0.6):** "Engage normally — reply, encourage response, surface to interested segment."
- **Neutral (-0.3 to +0.3):** "Allow, answer if question, encourage community discussion."
- **Negative (-0.6 to -0.3):** "Review for validity — if constructive, engage professionally. If tone issue, educate."
- **Very Negative (-1.0 to -0.6):** "Flag for moderation review. If toxicity >0.3, escalate immediately."

## Output Format

### Sentiment Score

```
Polarity: [X.XX] ([Label])
Tone: Constructivity [X/1.0], Toxicity [X/1.0], Dismissiveness [X/1.0]
```

### Sentiment Drivers

```
1. [Driver 1]: [Evidence quote]
2. [Driver 2]: [Evidence quote]
3. [Driver 3]: [Evidence quote]
```

### Impact Assessment

```
Type: [Celebration / Constructive / Concern / Spam / Toxic]
Community Value: [Positive / Neutral / Negative]
Recommendation: [Action]
```

### Moderation Status

```
Policy Violation: [Yes / No]
Escalation Needed: [No / Warning / Escalate]
```

## When to Use

- Before amplifying a post (sentiment check)
- On flagged content (moderation review)
- On trending discussions (understand community mood)
- On member feedback (is this frustration valid?)
- On high-engagement threads (check if sentiment is positive)

## Example

**Post:** "Just hit 1000 members in our community! Couldn't have done this without everyone's contributions. Let's celebrate this milestone together."

**Output:**

```
Polarity: +0.94 (Very Positive)
Tone: Constructivity 0.95, Toxicity 0.0, Dismissiveness 0.0

Sentiment Drivers:
1. Celebrating a quantifiable achievement (1000 members)
2. Acknowledging community contribution explicitly
3. Inclusive "let's celebrate together" language

Type: Celebration
Community Value: Positive (morale boost, reinforces culture)
Recommendation: Amplify — pin for 24h, tag Advocates for spread, repost to #wins

Moderation: No issues
```

---
