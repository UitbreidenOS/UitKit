# Claudient Badge Renewal Checklist

Step-by-step guide to renewing your Claudient badge after 18 months.

---

## Before You Start

- [ ] You received a notification email (check spam folder)
- [ ] Your badge expiration date is within 2 months
- [ ] You have access to your GitHub account (where contributions are tracked)
- [ ] You're reviewing this checklist within your renewal window (months 16-18)

**Timeline:** Renewal check happens on the 1st of each month. If you're in your grace period (expired <30 days), you can still reactivate.

---

## Check Your Current Status

### Step 1: Verify Your Badge Status
Run this command to see your current badge and renewal eligibility:

```bash
npm run badge:status <your-github-username>
```

**You should see:**
- Current badge level (Learner / Contributor / Expert / Partner)
- Award date
- Expiration date
- Renewal window status (Active / Expired / Grace period)
- Requirements for renewal

### Step 2: Review Your Contributions
Check your contribution count:

```bash
npm run badge:score <your-github-username>
```

**Output includes:**
- Total contributions by category
- Reputation score
- Breakdown of points earned
- Date of last contribution

---

## Renewal Requirements by Badge Level

### Learner Badge Renewal
**Requirement:** ≥1 new contribution since award date

- [ ] Count merged PRs in past 18 months: _____ (need ≥1)
- [ ] Do all PRs have maintainer approval? (Check GitHub)
- [ ] Any code of conduct violations? (Should be none)

**If you meet requirements:** Automatic renewal on next check (1st of month)

**If you DON'T meet requirements:** 
- [ ] Make a new contribution (any category works)
- [ ] Submit manual renewal: `npm run badge:apply-renewal learner`
- [ ] Wait for approval (2 weeks)

---

### Contributor Badge Renewal
**Requirement:** ≥3 new contributions in past 18 months, across any categories

- [ ] Count all merged PRs: _____ (need ≥3)
- [ ] Contributions span multiple categories? (skills, workflows, docs, themes, etc.)
- [ ] Review any code violations: _____
- [ ] Active community standing? (No flagged issues)

**Tracking your contributions:**
1. Visit: https://github.com/UitbreidenOS/Claudient/pulls?q=author:<YOUR-USERNAME>+merged
2. Filter by date (18 months back to today)
3. Count merged PRs

**If you meet requirements:** Automatic renewal on next check

**If you DON'T meet requirements:**
- [ ] Make 1-3 additional contributions (any category)
- [ ] Wait until next month's automatic check, OR
- [ ] Submit manual renewal with new contributions documented:
```bash
npm run badge:apply-renewal contributor --contributions PR#123,PR#456,PR#789
```

---

### Expert Badge Renewal
**Requirement:** ≥1 significant contribution per 6-month period OR active mentorship

**Significant contributions include:**
- New skill/feature (≥50 LOC)
- Major bug fix (complex, high impact)
- Published guide/workflow/tutorial
- Created community resource (agent, workflow, benchmark)

**Tracking requirements:**

#### Method A: Recent Contributions
- [ ] Count significant contributions in past 18 months: _____
- [ ] Do you have at least one every 6 months? 
  - Months 0-6: _____ (need ≥1)
  - Months 6-12: _____ (need ≥1)
  - Months 12-18: _____ (need ≥1)

#### Method B: Active Mentorship
- [ ] Mentored ≥1 new contributor in past 18 months?
- [ ] Documented 5+ mentorship interactions?
- [ ] Provided code reviews/guidance (≥10)?

**Examples of mentorship documentation:**
- GitHub review comments with detailed feedback
- Discord/GitHub Discussions helping new contributors
- Co-authored contributions with junior contributors
- Documented case studies or tutorials you've created

#### If you meet requirements:
- Automatic renewal on next check
- Your Expert profile updated with mentorship notes

#### If you DON'T meet requirements:
- [ ] Submit manual renewal with evidence:
```bash
npm run badge:apply-renewal expert --evidence EVIDENCE_URL
```

**Evidence file format:**
```markdown
# Expert Badge Renewal Evidence

## Significant Contributions (Past 18 Months)
1. PR#1234 - Feature: [description]
   - Merged: 2026-03-15
   - LOC: 200+
   - Impact: High

2. PR#5678 - Guide: [description]
   - Published: 2026-06-10
   - Audience: 500+ views
   - Downloads: 50+

## Mentorship Activities
1. Mentored @newcontributor on skills/redis.md
   - 5 pairing sessions
   - Merged 3 contributions together

2. Code review feedback (examples):
   - PR#9999 - 3 detailed review rounds
   - PR#8888 - Security-focused feedback
   - PR#7777 - Architecture guidance
```

---

### Enterprise Partner Renewal
**Requirement:** Active partnership agreement + annual review

- [ ] Partnership agreement still valid? (Check expiration date in legal docs)
- [ ] Completed annual review with Claudient leadership?
- [ ] Met SLA commitments? (Response times, integrations, support)
- [ ] ≥1 major deliverable/integration in past 12 months?

**Partners: See BADGE_ADMINISTRATION.md for detailed renewal procedures**

---

## Document Your Evidence

### Create a renewal evidence file:

```markdown
# Renewal Evidence — [YOUR-USERNAME]
Submitted: 2026-06-22

## Badge Level
[Learner / Contributor / Expert]

## Contributions (Past 18 Months)

### Category: Skills
- PR#1234 (merged 2026-03-15): Enhanced redis-caching.md
- PR#2345 (merged 2026-05-20): Created new postgres-optimization.md

### Category: Workflows
- PR#3456 (merged 2026-02-10): Documented CI/CD workflow

### Category: Documentation
- PR#4567 (merged 2026-06-01): Added troubleshooting guide

### Total contributions: 4 ✓ (Contributor needs ≥3)

## Code Quality
- No code of conduct violations
- Review feedback: All positive
- Merged without major revision rounds

## Community Standing
- Participated in peer reviews: 3
- Helped others in discussions: 5
- No open issues with contributions

## Additional Context
[Optional: Any special circumstances, major projects, etc.]
```

---

## Submit Your Renewal

### If Automatic Renewal Applied:
- [ ] Check email on 1st of month following your renewal window
- [ ] Badge should remain active (no action needed)
- [ ] Verification page updates automatically

### If You Need Manual Renewal:

#### Step 1: Gather your evidence
- List of PRs with links and merge dates
- Links to published guides/tutorials (if Expert)
- Documentation of mentorship interactions (if Expert)
- Code quality context

#### Step 2: Submit renewal application
```bash
npm run badge:apply-renewal <level> --evidence "path/to/evidence.md"
```

**Or submit via GitHub:**
1. Create a private GitHub Gist with your evidence
2. File a private issue in the Claudient repo titled: "Badge Renewal: [YOUR-USERNAME]"
3. Include link to your evidence Gist
4. Maintainers will review within 2 weeks

#### Step 3: Wait for review
- Review period: Up to 2 weeks
- You'll receive email with decision
- If approved: Badge restored and email confirmation sent
- If denied: Specific feedback on what's needed (can reapply after 30 days)

---

## If Renewal is Denied

Don't worry! Renewal denials are usually fixable.

### Common reasons for denial:
1. **Incomplete evidence:** Missing links or dates
   - **Fix:** Resubmit with detailed PR links (e.g., github.com/UitbreidenOS/Claudient/pull/123)

2. **Contributions don't meet threshold:** Fewer than required
   - **Fix:** Make additional contributions and reapply after 30 days

3. **Code of conduct concern:** Flag on your account
   - **Fix:** Resolve issue through appeals process (see BADGE_SYSTEM.md)

4. **Documentation unclear:** Mentorship or impact not documented
   - **Fix:** Add links to merged PRs, code reviews, discussions

### Appeal a denial:
```bash
npm run badge:appeal-renewal --case-id <case-id>
```

- Independent review committee (not original reviewers)
- Decision within 4 weeks
- Email notification of outcome

---

## Special Renewal Situations

### Situation: I was inactive but want to renew
**Solution:**
1. Make new contributions (see requirement table for your badge)
2. Wait until next monthly check, OR
3. Submit manual renewal with your new work documented

### Situation: My contributions are mostly in one area
**Solutions:**
- **Learner:** No problem, any area counts
- **Contributor:** Need ≥3 categories. Make one contribution in a different area (documentation counts!)
- **Expert:** Depth in one area is fine; breadth appreciated but not required

### Situation: I was on sabbatical and missed renewal window
**Solution:**
1. You have 30-day grace period after expiration
2. If within grace period: Submit manual renewal application
3. If past grace period: Make new contributions and reapply from Learner level

### Situation: My GitHub username changed
**Solution:**
1. Contact: badges-support@claudient.dev
2. Provide old and new usernames
3. Provide proof of account ownership (screenshot with both shown)
4. Maintainers will update registry and transfer badge

### Situation: I want to downgrade my badge
**Solution:**
1. Email: badges-support@claudient.dev
2. Request downgrade (e.g., Expert → Contributor)
3. Confirmation sent, badge updated immediately
4. Can upgrade again later if you meet requirements

---

## After Renewal

### Verify Your Renewal
After your badge is renewed:

```bash
npm run badge:verify <your-github-username>
```

**Confirmation checklist:**
- [ ] Badge level shows correctly
- [ ] New expiration date shows (18 months from renewal date)
- [ ] Renewal status shows "active"
- [ ] Badge appears on your profile at https://claudient.dev/badges/

### Update Your Profiles

#### GitHub
Add or update your profile/README with badge:
```markdown
[![Claudient Contributor](https://claudient.dev/badges/contributor-badge.svg)](https://claudient.dev/badges/verify/YOUR-USERNAME)
```

#### LinkedIn
- Verify renewal shows in your credentials section
- Claudient company profile has endorsed your badge

#### Community Site
- Your profile auto-updates with new expiration date
- Featured in contributor showcase (if applicable)

### Share Your Renewal
- [ ] Post in GitHub Discussions (celebrate your renewal!)
- [ ] Share badge link on social media (optional)
- [ ] Update LinkedIn profile

---

## Timeline Reminder

| When | What | Action |
|---|---|---|
| **Month 1-14** | Regular contributions | Keep contributing |
| **Month 15** | Email notification arrives | Read renewal requirements |
| **Month 16-18** | Renewal window open | Submit if not automatic |
| **Month 19** | Automatic check happens | Badge renewed if eligible |
| **Month 19+** | Grace period (if expired) | 30 days to reactivate |
| **Month 20** | Badge removed | Reapply as new badge if desired |

---

## Frequently Asked Questions

**Q: What if I contribute just before the renewal check?**
A: Automatic check happens on the 1st of each month. Contributions after that date won't count until next month's check.

**Q: Can I renew early?**
A: Renewal checks are on a schedule (1st of month). You can't force an early check, but you can contribute proactively to ensure you meet requirements.

**Q: What if my renewal is denied but I have strong evidence?**
A: You can appeal the decision. See "Appeal a denial" section above.

**Q: Will the renewal process change in the future?**
A: Possibly. Claudient reviews the badge system annually. You'll be notified of any major changes.

**Q: Can I have multiple badges at once?**
A: Yes! If you upgrade from Learner to Contributor, you now have a Contributor badge. You can also have both a Community badge and an Enterprise Partner badge.

---

## Need Help?

- **General questions:** [BADGE_FAQ.md](BADGE_FAQ.md)
- **Full system documentation:** [BADGE_SYSTEM.md](BADGE_SYSTEM.md)
- **Technical issues:** badges-support@claudient.dev
- **Appeals:** badges-appeal@claudient.dev

---

## Checklist Summary

- [ ] Checked badge status with `npm run badge:status`
- [ ] Reviewed contribution requirements for my badge level
- [ ] Counted contributions in past 18 months
- [ ] Verified no code of conduct violations
- [ ] Documented evidence (if manual renewal needed)
- [ ] Submitted renewal application
- [ ] Received confirmation email
- [ ] Verified badge status online
- [ ] Updated social profiles with renewed badge

**Ready to renew?** Start with Step 1 above!

---

**Last Updated:** June 22, 2026
**For current renewal status:** npm run badge:status <USERNAME>
