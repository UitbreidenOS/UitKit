# Contributor Onboarding System

A comprehensive guided workflow for new Claudient contributors with mentorship matching and gamified swag rewards.

## Features

### Guided Workflow Stages

1. **Welcome & Profile Setup**
   - Greet new contributors
   - Restore state for returning contributors
   - Create contributor profile

2. **Role Selection**
   - Choose contribution paths (multiple selections allowed)
   - Options: Skill Creator, Agent Builder, Translator, Documenter, Tester, Reviewer

3. **Fork & Repository Setup**
   - Step-by-step fork instructions
   - Automated git clone to local machine
   - Configure upstream remote

4. **Create First Skill**
   - Interactive skill template generation
   - Guided walkthrough for skill creation
   - Auto-save to `skills/` directory

5. **PR Submission Guidance**
   - Pre-submission checklist
   - PR template with contributor info
   - URL validation and tracking

6. **Mentorship Matching**
   - Match contributors with experienced mentors
   - Display mentor expertise and contribution history
   - Role-based compatibility matching

7. **Progress & Achievements**
   - Track contribution milestones
   - Display tier progression (Bronze → Silver → Gold → Platinum → Legend)
   - Show swag rewards for each tier

## Achievement Tiers & Swag Rewards

### Bronze Tier (1 contribution)
- **Name**: Bronze Badge
- **Rewards**:
  - Claudient Sticker Pack (5x)
  - Digital Certificate

### Silver Tier (5+ contributions)
- **Name**: Silver Badge + Swag
- **Rewards**:
  - Premium Sticker Set (10x)
  - t-shirt (s/m/l/xl/xxl)
  - Digital Badge

### Gold Tier (15+ contributions)
- **Name**: Gold Badge + Premium Swag
- **Rewards**:
  - Exclusive Sticker Collection (20x)
  - Limited Edition t-shirt
  - Embroidered Cap
  - Digital Badge

### Platinum Tier (30+ contributions)
- **Name**: Platinum Badge + Collector Edition
- **Rewards**:
  - Collector Sticker Set (50x)
  - Signature Series t-shirt
  - Hoodie
  - Pin Badge
  - Digital Badge

### Legend Tier (100+ contributions)
- **Name**: Legend Status + Exclusive Perks
- **Rewards**:
  - All Previous Items
  - Limited Edition Jacket
  - Custom Badge
  - Mention in README
  - Special Discord Role

## Contribution Roles

### Skill Creator
- Create reusable skills and commands for Claude Code
- Build workflows and automation helpers
- Expected: Create 1-2 skills per quarter

### Agent Builder
- Build specialized agents for specific domains
- Design agent interactions and capabilities
- Expected: Create 1+ agent per quarter

### Translator
- Translate skills, guides, and documentation
- Supported languages: French, German, Dutch, Spanish
- Expected: Translate 5-10 files per month

### Documenter
- Write guides, tutorials, and technical documentation
- Create examples and integration guides
- Expected: Create 2-3 guides per month

### Tester
- Test features and edge cases
- Write test cases and report bugs
- Review test coverage
- Expected: 10+ test cases per month

### Reviewer
- Review pull requests for quality and correctness
- Provide technical feedback
- Ensure coding standards
- Expected: Review 5+ PRs per month

## Usage

### Run Interactive Onboarding

```bash
node scripts/contributor-onboarding.js
```

This launches the interactive wizard with:
- Welcome banner
- Profile creation (name, email, GitHub handle)
- Role selection
- Step-by-step guidance through each stage
- Real-time progress tracking

### State Persistence

Contributor state is saved to `.claude/contributor-state.json`:

```json
{
  "name": "Jane Developer",
  "email": "jane@example.com",
  "githubHandle": "janedev",
  "roles": ["skill-creator", "documenter"],
  "firstContributionDate": "2026-06-22T10:30:00.000Z",
  "contributions": [
    {
      "type": "skill",
      "name": "API Documentation Generator",
      "file": "/path/to/skills/api-docs-generator.md",
      "status": "submitted",
      "prUrl": "https://github.com/UitbreidenOS/Claudient/pull/1234",
      "date": "2026-06-22T11:45:00.000Z"
    }
  ],
  "achievements": ["first_contribution", "pr_merged"],
  "mentor": "Alex Chen",
  "tier": "silver",
  "progressData": {}
}
```

## Integration with GitHub Actions

### Automated Reward Processing

Add to `.github/workflows/contributor-rewards.yml`:

```yaml
name: Process Contributor Rewards

on:
  pull_request:
    types: [closed]

jobs:
  update-rewards:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Update contributor tier
        run: |
          node scripts/process-contributor-rewards.js \
            --github-handle ${{ github.actor }} \
            --pr-number ${{ github.event.pull_request.number }} \
            --merged ${{ github.event.pull_request.merged }}
```

## Mentorship System

### Available Mentors

The system includes pre-configured mentors with:
- Expertise areas (aligned with contributor roles)
- Contribution history
- Achievement badge
- Bio and specialization

Mentors can be extended in `scripts/contributor-onboarding.js`:

```javascript
const mentors = [
  {
    name: 'Your Name',
    expertise: ['skill-creator', 'agent-builder'],
    contributions: 127,
    badge: 'Legend',
    bio: 'Your specialization and achievements',
  },
  // Add more mentors...
];
```

### Mentor Responsibilities

- **Response Time**: Reply within 24-48 hours
- **Code Review**: Provide constructive feedback
- **Guidance**: Help contributors navigate the contribution process
- **Monthly Check-in**: Quarterly mentorship meeting

## Skill Template Generation

When creating a first skill, the system auto-generates a markdown template:

```markdown
# Skill Name

## When to activate
[Specific trigger conditions]

## When NOT to use
[Anti-patterns and wrong use cases]

## Instructions
[Step-by-step usage instructions]

## Example
[Concrete, runnable example]

---
**Author**: Contributor Name
**Created**: 2026-06-22
**Keywords**: keyword1, keyword2
**Description**: One-sentence description
```

## Progress Tracking

### View Current Progress

```bash
node scripts/contributor-onboarding.js
# Select "View Progress" to see:
# - Contribution count
# - Current tier
# - Next tier requirements
# - Available swag items
```

### Contribution Types Tracked

- Skills created
- Agents built
- Translations completed
- Guides written
- Test cases added
- PRs reviewed
- Issues resolved

## Best Practices

### For New Contributors

1. **Start Small**: Create one skill before building an agent
2. **Read Guidelines**: Review `CLAUDE.md` and `CONTRIBUTING.md`
3. **Use the Mentor**: Ask your assigned mentor for guidance
4. **Follow Templates**: Use auto-generated templates as starting points
5. **Test Thoroughly**: Run all tests before submitting PR

### For Mentors

1. **Onboard Properly**: Spend 30 min on initial orientation
2. **Be Responsive**: Respond to questions within 24 hours
3. **Encourage Mastery**: Guide contributors to understand not just copy-paste
4. **Celebrate Wins**: Acknowledge contributions and progress
5. **Provide Growth Paths**: Help contributors advance to more complex tasks

## Swag Fulfillment Process

### Order Management

1. **Tier Calculation**: Automatically updated when PR merges
2. **Notification**: Contributor receives Discord notification
3. **Fulfillment**: Team verifies address and ships within 30 days
4. **Tracking**: Contributor receives tracking number

### Address Collection

Before first shipment:
- Email sent to registered email address
- Contributor submits shipping address
- Optional: T-shirt size preferences

### Fraud Prevention

- Verify GitHub account age (30+ days)
- Confirm contribution authenticity (code review)
- Flag suspicious patterns (duplicate accounts)

## Analytics & Reporting

### Generate Contributor Report

```bash
node scripts/generate-contributor-report.js --month 2026-06
```

Output includes:
- New contributors this month
- Most active contributors
- Tier progression
- Swag shipments
- Mentor effectiveness

### Dashboard Data

Track:
- Time to first contribution
- Contribution quality (review feedback)
- Retention rate (30/60/90 days)
- Mentor satisfaction scores

## Customization

### Add Custom Rewards

Edit `SWAG_REWARDS` in `contributor-onboarding.js`:

```javascript
const SWAG_REWARDS = {
  [ACHIEVEMENT_TIERS.PLATINUM]: {
    name: 'Platinum Badge',
    items: ['Custom Item 1', 'Custom Item 2'],
    milestone: 30,
  },
};
```

### Add New Roles

```javascript
const CONTRIBUTOR_ROLES = {
  YOUR_NEW_ROLE: 'your-new-role',
  // ... other roles
};
```

### Customize Mentors

Edit the `mentors` array to add/update mentor profiles:

```javascript
const mentors = [
  {
    name: 'New Mentor Name',
    expertise: ['role1', 'role2'],
    contributions: 50,
    badge: 'Gold',
    bio: 'Specialization details',
  },
];
```

## Troubleshooting

### State File Not Found

If `.claude/contributor-state.json` doesn't exist:
- Create `.claude/` directory: `mkdir -p .claude`
- Re-run onboarding: `node scripts/contributor-onboarding.js`
- System creates new state file

### Git Clone Fails

If repository clone fails:
1. Verify GitHub handle is correct
2. Check SSH/HTTPS credentials configured
3. Clone manually, then run: `cd your-fork && node scripts/contributor-onboarding.js`

### Mentor Assignment Issues

If mentors aren't appearing:
- Check mentor expertise matches contributor roles
- Verify mentors array is populated
- Clear state file and restart: `rm .claude/contributor-state.json`

## Future Enhancements

### Planned Features

1. **Achievement Badges**: Digital badges displayable on GitHub profile
2. **Leaderboard**: Monthly top contributors dashboard
3. **Automated Swag Ordering**: Integration with print-on-demand service
4. **Skill Marketplace**: Rate and review community skills
5. **Streaming Workshops**: Live coding sessions with core team
6. **Contributor Spotlight**: Featured contributor in newsletter
7. **Revenue Sharing**: For premium skills/agents created
8. **Team Formation**: Automatically create squads based on interests

### Integration Roadmap

- Discord role assignment automation
- GitHub profile badge display
- LinkedIn endorsement recommendations
- Twitter contributor highlight script

## Support

- **Discord**: #contributors channel
- **GitHub Discussions**: Questions and feedback
- **Email**: contributors@claudient.com
- **Office Hours**: Weekly Zoom session (Fridays 2pm EST)

## License

This onboarding system is part of Claudient and licensed under:
- AGPL-3.0-or-later (code)
- CC-BY-SA-4.0 (documentation)

## Contributing to Onboarding

Found a bug or have ideas? Help improve the onboarding experience:

1. Open an issue describing the improvement
2. Comment on existing issues to show interest
3. Submit a PR with enhancements
4. Tag maintainers: @tushar2704

---

**Last Updated**: 2026-06-22
**Version**: 1.0.0
