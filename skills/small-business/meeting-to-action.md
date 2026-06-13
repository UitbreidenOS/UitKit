---
name: meeting-to-action
updated: 2026-06-13
---

# Meeting to Action

## When to activate
- Right after any client call, sales call, or team meeting — within the hour while context is fresh
- You have a transcript from Google Meet, Otter.ai, Zoom, or Fireflies and need to turn it into something useful fast
- Your meeting notes are rough and you need a professional follow-up email out the same day
- You want to track commitments across recurring meetings and see what is overdue versus completed

## When NOT to use
- You have not yet had the meeting — this skill processes what happened, not what to prepare
- The meeting was purely internal with no commitments or decisions made — not worth the overhead
- You need real-time transcription — use Google Meet, Otter.ai, or Zoom's built-in transcription for that, then bring the output here

## Instructions

### What to paste in

Paste whatever you have — a full transcript, Otter.ai export, your own rough notes, or even a voice memo you transcribed quickly. Claude handles messy input. You do not need to clean it up first.

If you have a transcript from Otter.ai or Zoom, paste the whole thing. If you took notes during the call, paste them as-is. If the meeting was an hour long and the transcript is long, paste it — Claude reads the full thing.

### Step 1: Get the structured summary

After pasting the transcript or notes, say:

"Summarize this meeting and give me action items, open questions, and a follow-up email ready to send."

Claude produces in one pass:

3-sentence meeting summary: what was discussed, what was decided, what the overall tone or outcome was. Short enough to paste into a CRM note or share in Slack.

Action items table: who is responsible for each item, what they need to do, and by when. Claude pulls commitments from both sides — yours and theirs. If a deadline was not specified on the call, Claude flags it as "confirm deadline" rather than inventing one.

Open questions: things that came up on the call but were not resolved. Framed as questions you need to answer before the next interaction.

Follow-up email: professional, references specific things said on the call, confirms commitments on both sides. Ready to send with no editing needed — or lightly edit if you want a different tone.

CRM note: short format (3-5 sentences) for pasting into HubSpot, Salesforce, or any notes field. Designed to be read by someone who was not on the call.

### Step 2: Extract sales intelligence (for sales calls)

If it was a sales or discovery call, add:

"Also extract: pain points they mentioned, buying signals, objections raised, and their language for describing their problem."

Claude adds a sales intelligence section:

- Pain points: what they said their problem was, in their words (useful for mirroring language in the proposal)
- Buying signals: statements or questions that indicate interest or urgency ("when could we start?" / "who else are you working with?")
- Objections: what they pushed back on and the exact language they used — important for crafting the proposal response
- Their words for their own pain: the phrases they used to describe the problem. Use these in your proposal, not your own language.

### Step 3: Track recurring meetings

For weekly team meetings or recurring client calls, tell Claude at the start:

"This is a recurring meeting. Here are last week's action items [paste them]. Here are this week's notes [paste them]. Tell me what got done, what is overdue, and what is new."

Claude compares the two sets and produces:

- Completed since last week (with who completed it)
- Overdue (who is responsible, how many days late)
- New action items added this week

This takes the place of manually checking a spreadsheet before every weekly call.

### Step 4: Send the follow-up fast

The follow-up email should go out within 2 hours of the call ending. Prospects and clients remember the energy of a call for less than a day. A same-day follow-up feels like momentum. A follow-up 3 days later feels like you forgot.

Claude's draft will be ready in under 2 minutes. Edit if needed, but prioritize speed over perfection.

If you want to adjust tone, say: "Make it warmer" or "Tighten this up" or "Remove the bullet points and make it conversational."

### What Claude will not invent

Claude will not fabricate commitments that were not in the notes, invent deadlines that were not mentioned, or add context about the company or prospect that was not in the transcript. If information is missing, it flags the gap rather than filling it with a guess.

### Time comparison

Writing a meeting summary, action items, follow-up email, and CRM note manually: 20-40 minutes.

Pasting notes into Claude and sending the output: 2-5 minutes.

Over 10 client calls per week, that is 3-6 hours recovered per week.

## Example

You paste a 45-minute client call transcript from Otter.ai. The call was a quarterly review with a key client, Meridian Logistics.

You say: "Summarize this client call, give me action items, open questions, and a follow-up email. Also pull any concerns they raised."

Claude produces:

Meeting summary (3 sentences): "Quarterly review with Meridian Logistics covering Q2 results and Q3 planning. Client is satisfied with current dashboard performance but raised concerns about report delivery timing — they want the Monday report by 7 AM, not 9 AM. Agreed to discuss a Q3 scope expansion for two additional data sources; you will send a proposal by Friday."

Action items:
- You: Send Q3 scope expansion proposal to Dana at Meridian — by Friday, June 6
- You: Confirm with your team whether the Monday 7 AM delivery is technically feasible — by Wednesday, June 4
- Meridian (Dana): Share the two additional data sources they want added — by end of this week
- Meridian (Dana): Loop in their IT contact for the data source discussion — timeline TBD, you flagged this as needed

Open questions:
- Can your system deliver the Monday report at 7 AM instead of 9 AM? (Do not commit until you confirm internally)
- Is the Q3 scope expansion a contract amendment or a new SOW?

Follow-up email (ready to send): "Dana — great call today. Quick recap: we are aligned on Q2 results and the Q3 expansion discussion is moving forward. I will have the proposal to you by Friday covering the two additional data sources you mentioned. On the Monday report timing — I am checking internally on the 7 AM delivery and will confirm by Wednesday. Please share the data source details when you get a chance, and if you can loop in your IT contact before our next call, that will keep the implementation on track. Talk soon."

CRM note: "Q2 QBR completed. Client satisfied with performance. Two open items: Monday report delivery time (7 AM request — feasibility TBD) and Q3 scope expansion (two new data sources). Proposal due Friday. Next call to be scheduled after proposal review."
