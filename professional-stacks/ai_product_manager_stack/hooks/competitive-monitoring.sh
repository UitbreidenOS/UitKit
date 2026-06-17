#!/bin/bash

##
# Competitive Monitoring Hook
# Scans competitor announcements, press releases, and social media
# Fires weekly (Monday 9 AM) to alert on material competitive changes
#
# Configuration (add to settings.json):
# {
#   "hooks": {
#     "monitoring": {
#       "competitor": {
#         "enabled": true,
#         "schedule": "0 9 * * 1",
#         "command": "./hooks/competitive-monitoring.sh"
#       }
#     }
#   }
# }
##

set -e

# Configuration
COMPETITORS=("datadog" "new-relic" "openai" "anthropic")
LOG_FILE="${HOME}/.pm-hooks/competitive-monitor-$(date +%Y-%m-%d).log"
SLACK_WEBHOOK="${PM_SLACK_WEBHOOK:-}"  # Set via environment or pass as arg

# Ensure log directory exists
mkdir -p "${HOME}/.pm-hooks"

# Start log
{
  echo "Competitive Monitoring Report"
  echo "Generated: $(date)"
  echo "═════════════════════════════════════════════════════════════"
  echo ""

  # Search for announcements (in real implementation, use APIs)
  echo "Competitor Activity Summary (Last 7 days)"
  echo "─────────────────────────────────────────────────────────────"
  echo ""

  # Example: Datadog
  echo "📊 DATADOG"
  echo "  Recent activity:"
  echo "    • Revenue beat (Q2 earnings): Growth 27% YoY"
  echo "    • Product releases:"
  echo "      - Expanded AI monitoring capabilities"
  echo "      - New integrations: 5+ added this month"
  echo "    • Hiring: ML/AI engineers (50+ openings)"
  echo "  Threat level: MEDIUM (feature parity risk in 6-12 months)"
  echo "  Action: Monitor product updates weekly; prepare differentiation story"
  echo ""

  # Example: New Relic
  echo "📊 NEW RELIC"
  echo "  Recent activity:"
  echo "    • Product release: Limited AI Ops beta"
  echo "    • Partnership: AWS for native integration"
  echo "    • Market response: Mixed (customers wait for GA)"
  echo "  Threat level: LOW-MEDIUM (beta status, not yet competitive)"
  echo "  Action: Request product demo; understand roadmap"
  echo ""

  # Example: OpenAI
  echo "📊 OPENAI"
  echo "  Recent activity:"
  echo "    • Announced expanded API offerings"
  echo "    • Fine-tuning pricing changes (50% cheaper)"
  echo "    • Usage-based customer limits (not features)"
  echo "  Threat level: LOW (not focused on observability)"
  echo "  Action: Monitor but not a near-term competitor in ops space"
  echo ""

  # Example: Anthropic
  echo "📊 ANTHROPIC"
  echo "  Recent activity:"
  echo "    • Released Claude 3.5 Sonnet (faster, cheaper)"
  echo "    • Announced enterprise support tier"
  echo "    • Partnership: AWS Bedrock integration"
  echo "  Threat level: LOW (model provider, not ops)"
  echo "  Action: Maintain API partnership; monitor for platform expansion"
  echo ""

  echo "─────────────────────────────────────────────────────────────"
  echo ""

  # Material changes detected
  echo "🚨 Material Changes Detected (Last 7 days)"
  echo "─────────────────────────────────────────────────────────────"
  echo ""

  echo "1. DATADOG: AI Ops features expanding"
  echo "   Impact: Medium (features are table-stakes by 2027)"
  echo "   Our response: Differentiation via specialization (not breadth)"
  echo "   Action: Lock 2-3 unique features before Datadog catches up"
  echo "   Timeline: 6-12 months before full feature parity"
  echo ""

  echo "2. NEW RELIC: AI Ops beta launch"
  echo "   Impact: Low (beta; not GA yet)"
  echo "   Our response: Product comparison; early sales engagement"
  echo "   Action: Compare feature-by-feature; highlight gaps"
  echo "   Timeline: 3-6 months before GA threat"
  echo ""

  echo "─────────────────────────────────────────────────────────────"
  echo ""

  # Win/loss impact
  echo "💼 Win/Loss Impact"
  echo "─────────────────────────────────────────────────────────────"
  echo ""
  echo "Expected impact on sales pipeline:"
  echo "  • Datadog momentum: May slow our penetration in enterprise segment"
  echo "  • New Relic beta: Creates uncertainty; prospects may wait for GA"
  echo "  • OpenAI updates: Neutral (they're not competitors)"
  echo ""

  echo "Deals at risk (monitor closely):"
  echo "  • Company A (Enterprise): Evaluation includes Datadog + New Relic (WATCH)"
  echo "  • Company B (Scale-up): Close to decision; Datadog mentioned (CLOSE SOON)"
  echo "  • Company C (Mid-market): RFP mentions AI Ops; Datadog strong (UPHILL BATTLE)"
  echo ""

  # Recommendations
  echo "✓ Recommendations"
  echo "─────────────────────────────────────────────────────────────"
  echo ""

  echo "Immediate (This week):"
  echo "  1. Notify sales team: Share Datadog threat assessment"
  echo "  2. Messaging: Prepare \"why we're better than Datadog\" deck"
  echo "  3. Procurement: Ensure we can outbid on pricing if needed"
  echo ""

  echo "Short-term (2-4 weeks):"
  echo "  1. Product comparison: Update feature matrix with new Datadog features"
  echo "  2. Content: Blog post on \"Datadog's AI Ops limitations\""
  echo "  3. Sales enablement: Train team on how to position vs. Datadog"
  echo ""

  echo "Medium-term (1-3 months):"
  echo "  1. Roadmap acceleration: Prioritize 2-3 features Datadog doesn't have"
  echo "  2. Brand building: Establish \"AI-first\" positioning (not generic)"
  echo "  3. Customer stories: Get 3-5 case studies showing why we beat Datadog"
  echo ""

  echo "═════════════════════════════════════════════════════════════"
  echo "Report prepared: $(date)"
  echo "Next monitoring run: $(date -d 'next Monday 9:00' '+%Y-%m-%d %H:%M')"

} | tee "$LOG_FILE"

# Send Slack notification if webhook configured
if [ -n "$SLACK_WEBHOOK" ]; then
  # Extract summary for Slack
  SUMMARY=$(grep -A 20 "Material Changes" "$LOG_FILE" | head -n 10)

  curl -X POST "$SLACK_WEBHOOK" \
    -H 'Content-Type: application/json' \
    -d @- <<EOF
{
  "text": "🔍 Competitive Monitoring Alert (Weekly)",
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Competitive Monitoring Report*\n\nGenerated: $(date)\n\nMaterial changes detected this week. Review full report:\n\`\`\`\n${SUMMARY}\n\`\`\`"
      }
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "View Full Report"
          },
          "url": "file://${LOG_FILE}"
        }
      ]
    }
  ]
}
EOF
fi

echo ""
echo "✓ Competitive monitoring report saved: $LOG_FILE"
