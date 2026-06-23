# Contributor Onboarding System - Quick Reference

## Files Created

| File | Size | Purpose |
|------|------|---------|
| `scripts/contributor-onboarding.js` | 19KB | Interactive onboarding wizard |
| `scripts/process-contributor-rewards.js` | 15KB | Rewards processor & analytics |
| `scripts/contributor-onboarding.test.js` | 12KB | Test suite (40+ tests) |
| `scripts/CONTRIBUTOR-ONBOARDING-README.md` | 8KB | Technical documentation |
| `guides/contributor-onboarding-guide.md` | 12KB | User guide |
| `examples/contributor-onboarding-example.js` | 6KB | Integration examples |
| `.github/workflows/contributor-onboarding.yml` | 4KB | GitHub Actions automation |
| `package.json` | Updated | Added 3 npm scripts |
| `CONTRIBUTOR_ONBOARDING_IMPLEMENTATION.md` | 8KB | Summary document |

## Command Reference

### Run Onboarding
```bash
npm run contributor-onboarding
```
Interactive wizard for new contributors.

### Run Tests
```bash
npm run test:contrib
```
Execute 40+ test suite (should all pass).

### View Leaderboard
```bash
npm run contributor-rewards -- --leaderboard
```
Show top 50 contributors ranked by contributions.

### Generate Report
```bash
npm run contributor-rewards -- --generate-report --month 2026-06
```
Monthly analytics: new members, tier promotions, stats.

### Check Pending Rewards
```bash
npm run contributor-rewards -- --pending-rewards
```
List swag orders awaiting fulfillment.

### Get Contributor Stats
```bash
npm run contributor-rewards -- --stats @username
```
Individual contributor metrics and achievements.

### View Tier Distribution
```bash
npm run contributor-rewards -- --distribution
```
Visual chart of contributors by achievement tier.

## System Architecture

### Contribution Roles
1. Skill Creator
2. Agent Builder
3. Translator
4. Documenter
5. Tester
6. Reviewer

### Achievement Tiers
| Tier | Milestone | Key Reward |
|------|-----------|-----------|
| Bronze | 1 contribution | Sticker Pack |
| Silver | 5 contributions | t-shirt |
| Gold | 15 contributions | Limited Edition t-shirt |
| Platinum | 30 contributions | Hoodie + Pin |
| Legend | 100 contributions | Jacket + README mention |

### Onboarding Stages
1. Welcome & Profile
2. Profile Setup
3. Role Selection
4. Fork & Setup
5. Create Skill
6. Submit PR
7. Mentorship
8. View Progress

## State Files

**Location**: `.claude/contributor-state.json`

Stores per-contributor:
- Profile (name, email, handle)
- Roles (selected paths)
- Contributions (list of PRs/merges)
- Achievements (milestones reached)
- Mentor (assigned mentor name)
- Tier (current achievement level)

**Location**: `.claude/contributors/leaderboard.json`

Leaderboard with stats for all contributors.

**Location**: `.claude/contributors/reports/report-{YYYY-MM}.json`

Monthly analytics and metrics.

## Integration Points

### GitHub Actions
- On PR open: Welcome new contributors
- On PR merge: Update stats + check tier promotion
- On 1st of month: Generate leaderboard
- Automatic mentor assignment

### Discord (Ready)
- Tier promotion announcements
- New contributor welcomes
- Mentor pairings
- Monthly leaderboard

### Email (Ready)
- Welcome message
- Tier promotion notice
- Reward shipment confirmation
- Monthly leaderboard

### Slack (Optional)
```bash
npm run contributor-rewards -- --slack-webhook WEBHOOK_URL
```

## Key Features

✅ Interactive guided wizard
✅ Automated state persistence
✅ Git workflow integration
✅ Skill template generation
✅ Mentor matching algorithm
✅ Gamified rewards (5 tiers)
✅ Physical swag tracking
✅ Comprehensive analytics
✅ GitHub Actions automation
✅ Discord notifications
✅ Complete test coverage

## Customization

### Add Mentor
Edit `scripts/contributor-onboarding.js`, array `mentors`:
```javascript
{
  name: 'Your Name',
  expertise: ['skill-creator', 'agent-builder'],
  contributions: 127,
  badge: 'Legend',
  bio: 'Your specialization',
}
```

### Change Reward Items
Edit `SWAG_REWARDS` constant:
```javascript
[ACHIEVEMENT_TIERS.GOLD]: {
  name: 'Gold Badge',
  items: ['Your Item 1', 'Your Item 2'],
  milestone: 15,
}
```

### Add Contribution Role
Edit `CONTRIBUTOR_ROLES`:
```javascript
CONTRIBUTOR_ROLES.YOUR_ROLE = 'your-role'
```

## Testing

```bash
# Run complete test suite
npm run test:contrib

# Expected: 40+ tests pass
# Should include:
# - Tier calculations
# - PR processing
# - Reward generation
# - Profile management
# - Mentorship matching
# - State persistence
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Script won't run | `chmod +x scripts/contributor-onboarding.js` |
| No state file | `mkdir -p .claude` (auto-created on first run) |
| Git clone fails | Verify GitHub handle and auth |
| Mentor not assigned | Check mentor list has matching expertise |
| Wrong tier | Run `npm run test:contrib` to verify logic |

## Next Steps

1. ✅ Scripts deployed
2. ✅ Documentation written
3. ✅ Tests written
4. ⏳ **Configure GitHub Actions** (copy workflow file)
5. ⏳ **Set up Discord webhooks** (optional)
6. ⏳ **Configure email templates** (optional)
7. ⏳ **Add mentors** (customize list)
8. ⏳ **Test with first contributor** (manual flow)

## Files to Review

**Start here**:
1. `CONTRIBUTOR_ONBOARDING_IMPLEMENTATION.md` - Full summary
2. `guides/contributor-onboarding-guide.md` - User guide
3. `scripts/CONTRIBUTOR-ONBOARDING-README.md` - Technical docs

**Code**:
1. `scripts/contributor-onboarding.js` - Main wizard
2. `scripts/process-contributor-rewards.js` - Rewards logic
3. `scripts/contributor-onboarding.test.js` - Tests

**Integration**:
1. `.github/workflows/contributor-onboarding.yml` - CI/CD
2. `examples/contributor-onboarding-example.js` - Examples

## Metrics to Track

```bash
# Monthly (1st of month)
npm run contributor-rewards -- --generate-report --month 2026-07

# Key metrics:
# - New contributors this month
# - Total contributions
# - Tier distribution
# - Tier promotions
# - Top contributors
# - Retention rate
```

## Support Resources

- **Questions**: GitHub Discussions
- **Bugs**: GitHub Issues (tag: contributor-onboarding)
- **Community**: Discord #contributors
- **Docs**: guides/contributor-onboarding-guide.md

## Version Info

- **Version**: 1.0.0
- **Created**: June 2026
- **Node**: 18+
- **License**: AGPL-3.0-or-later + CC-BY-SA-4.0

---

**Ready to onboard contributors!** 🚀

Start with: `npm run contributor-onboarding`
