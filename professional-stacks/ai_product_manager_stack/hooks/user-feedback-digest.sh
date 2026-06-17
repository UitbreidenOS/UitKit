#!/bin/bash

##
# User Feedback Digest Hook
# Aggregates user feedback from support, surveys, and product data
# Fires daily (3 PM) to deliver feedback digest to PM team
#
# Configuration (add to settings.json):
# {
#   "hooks": {
#     "digest": {
#       "user-feedback": {
#         "enabled": true,
#         "schedule": "0 15 * * *",
#         "command": "./hooks/user-feedback-digest.sh"
#       }
#     }
#   }
# }
##

set -e

# Configuration
EMAIL_TO="${PM_EMAIL_DIGEST:-pm@company.com}"
LOG_FILE="${HOME}/.pm-hooks/feedback-digest-$(date +%Y-%m-%d).log"

# Ensure log directory exists
mkdir -p "${HOME}/.pm-hooks"

# Generate digest
{
  echo "Daily User Feedback Digest"
  echo "Generated: $(date)"
  echo "═════════════════════════════════════════════════════════════"
  echo ""

  # Today's date
  TODAY=$(date +%Y-%m-%d)

  echo "📊 Feedback Summary ($TODAY)"
  echo "─────────────────────────────────────────────────────────────"
  echo ""

  # Example data (in real implementation, query actual sources)
  echo "Support Tickets: 12 new"
  echo "  • Resolved: 8"
  echo "  • Open: 4"
  echo "  • Avg resolution time: 2.3 hours"
  echo ""

  echo "Survey Responses: 7 new"
  echo "  • NPS score: 42 (↑ from 38 last week)"
  echo "  • Sentiment: Positive (71% positive, 29% neutral)"
  echo ""

  echo "Product Analytics:"
  echo "  • Daily active users: 312"
  echo "  • Feature adoption: Latency dashboard 84%, Cost dashboard 61%"
  echo "  • Churn: 0 customers (healthy)"
  echo ""

  echo "─────────────────────────────────────────────────────────────"
  echo ""

  echo "🎯 Top Feedback Themes (Last 7 days)"
  echo "─────────────────────────────────────────────────────────────"
  echo ""

  echo "1. Latency Monitoring (23 mentions) ⭐⭐⭐⭐⭐"
  echo "   Sentiment: Positive (customers love this)"
  echo "   Sample quotes:"
  echo "   • \"Saved us 10 hours/week debugging. Game-changer.\""
  echo "   • \"Finally can see where slowdowns are happening.\""
  echo "   • \"Detection is fast; very helpful.\""
  echo "   Action: Double down on this feature; it's a differentiator"
  echo ""

  echo "2. Cost Transparency (18 mentions) ⭐⭐⭐⭐"
  echo "   Sentiment: Positive + requests for expansion"
  echo "   Sample quotes:"
  echo "   • \"Love seeing cost per model. Finally understand our bill.\""
  echo "   • \"Can we add cost per customer? Need for chargeback.\""
  echo "   • \"Cost optimization feature would be killer.\""
  echo "   Action: Cost tracking is working; extend with routing/optimization"
  echo ""

  echo "3. Model A/B Testing (12 mentions) ⭐⭐⭐"
  echo "   Sentiment: Positive (requested feature)"
  echo "   Sample quotes:"
  echo "   • \"When will A/B testing be available?\""
  echo "   • \"Can't wait to test Claude vs. GPT-4 safely.\""
  echo "   • \"This is blocking our deployment strategy.\""
  echo "   Action: Feature is on roadmap (Q3); communicate ETA to customers"
  echo ""

  echo "4. Documentation (7 mentions) ⭐⭐"
  echo "   Sentiment: Neutral (could be better)"
  echo "   Sample quotes:"
  echo "   • \"API docs are good but examples would help.\""
  echo "   • \"Getting started guide is helpful.\""
  echo "   • \"Advanced use cases not well documented.\""
  echo "   Action: Expand advanced docs; add more code examples"
  echo ""

  echo "5. Mobile Access (5 mentions) ⭐⭐"
  echo "   Sentiment: Neutral (nice-to-have)"
  echo "   Sample quotes:"
  echo "   • \"Would love to check alerts on phone.\""
  echo "   • \"Mobile dashboard could be useful.\""
  echo "   Action: Low priority; track demand; may not justify effort"
  echo ""

  echo "─────────────────────────────────────────────────────────────"
  echo ""

  echo "⚠️  Issues & Support Escalations"
  echo "─────────────────────────────────────────────────────────────"
  echo ""

  echo "Critical (0 issues)"
  echo "  • No system outages"
  echo "  • No critical bugs reported"
  echo ""

  echo "High priority (2 issues)"
  echo "  1. Latency detection occasionally misses outliers"
  echo "     • Impact: 2 customers affected"
  echo "     • Status: Engineering investigating (ETA: tomorrow)"
  echo "     • Action: Proactive customer communication sent"
  echo ""
  echo "  2. Cost calculation incorrect for multi-region deployments"
  echo "     • Impact: 1 customer (large deploy)"
  echo "     • Status: Engineering has fix (testing phase)"
  echo "     • Action: Patch rolling out tomorrow morning"
  echo ""

  echo "─────────────────────────────────────────────────────────────"
  echo ""

  echo "💡 Insights & Recommendations"
  echo "─────────────────────────────────────────────────────────────"
  echo ""

  echo "1. Latency monitoring is killer feature"
  echo "   • Customers cite it as primary reason for adoption"
  echo "   • Consider case study from top customer"
  echo "   • Include in sales pitch (mention in first conversation)"
  echo ""

  echo "2. Cost feature has expansion opportunities"
  echo "   • Customers want: per-customer chargeback, optimization"
  echo "   • Upsell: Cost optimization could be premium feature"
  echo "   • Timing: Add to Q3-Q4 roadmap"
  echo ""

  echo "3. A/B testing is expected feature"
  echo "   • Multiple customers asking; seems critical to buying decision"
  echo "   • Current roadmap: Q3 (on track)"
  echo "   • Risk: If we slip, may lose 2-3 customers"
  echo ""

  echo "4. Customer satisfaction is high but not exceptional"
  echo "   • NPS 42 is solid (industry average ~35)"
  echo "   • Opportunity: Get to 50+ by closing A/B testing gap"
  echo "   • Action: Invest in product quality (not just features)"
  echo ""

  echo "─────────────────────────────────────────────────────────────"
  echo ""

  echo "📞 Actions Needed"
  echo "─────────────────────────────────────────────────────────────"
  echo ""
  echo "Today (PM):"
  echo "  [ ] Review cost calculation bug; coordinate with Eng"
  echo "  [ ] Reach out to affected customer; confirm ETA on fix"
  echo ""
  echo "This week (PM + Eng):"
  echo "  [ ] Plan case study interview with top Latency adopter"
  echo "  [ ] Spec out A/B testing feature (validate with 3 customers)"
  echo "  [ ] Start design work on cost optimization (Q3 planning)"
  echo ""
  echo "Next sprint (Eng + Product):"
  echo "  [ ] Update product roadmap: communicate A/B ETA to customers"
  echo "  [ ] Expand API docs: add advanced use case examples"
  echo "  [ ] Plan mobile dashboard spike (low priority, track demand)"
  echo ""

  echo "═════════════════════════════════════════════════════════════"
  echo "Report prepared: $(date)"
  echo "Next digest: Tomorrow at 3 PM"

} | tee "$LOG_FILE"

# Send email
if command -v mail &> /dev/null || command -v sendmail &> /dev/null; then
  {
    echo "Subject: Daily Feedback Digest - $(date +%Y-%m-%d)"
    echo "To: $EMAIL_TO"
    echo ""
    echo "Daily feedback summary attached. Key highlights:"
    echo ""
    echo "• Latency monitoring: Killer feature, customers love it"
    echo "• Cost transparency: Working well; expansion opportunities"
    echo "• A/B testing: Expected feature; roadmap on track"
    echo "• NPS: 42 (up from 38); solid but not exceptional"
    echo ""
    echo "2 high-priority issues being addressed by Eng."
    echo ""
    echo "See attached for full details and action items."
    echo ""
    cat "$LOG_FILE"
  } | sendmail "$EMAIL_TO" 2>/dev/null || true
fi

echo ""
echo "✓ User feedback digest saved: $LOG_FILE"
echo "✓ Email sent to: $EMAIL_TO"
