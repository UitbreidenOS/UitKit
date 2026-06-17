#!/bin/bash

##
# Market Sizing Script
# Quantifies TAM/SAM/SOM for a given market segment
#
# Usage:
#   ./market-sizing.sh --segment "enterprise-ai-ops" --region "na" --confidence "80"
#
# Outputs:
#   - TAM estimate (global addressable market)
#   - SAM estimate (serviceable market given constraints)
#   - SOM estimate (year 1 obtainable market)
#   - Sensitivity analysis (upside/downside scenarios)
##

set -e

# Parse arguments
SEGMENT=""
REGION="na"
CONFIDENCE=80

while [[ $# -gt 0 ]]; do
  case $1 in
    --segment)
      SEGMENT="$2"
      shift 2
      ;;
    --region)
      REGION="$2"
      shift 2
      ;;
    --confidence)
      CONFIDENCE="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 --segment <name> [--region <region>] [--confidence <0-100>]"
      exit 1
      ;;
  esac
done

if [ -z "$SEGMENT" ]; then
  echo "Error: --segment is required"
  echo "Usage: $0 --segment <segment-name>"
  exit 1
fi

# Colors for output
BOLD='\033[1m'
RESET='\033[0m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'

echo -e "${BOLD}Market Sizing Report${RESET}"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo -e "${BLUE}Segment:${RESET} $SEGMENT"
echo -e "${BLUE}Region:${RESET} $(echo $REGION | tr '[:lower:]' '[:upper:]')"
echo -e "${BLUE}Confidence Target:${RESET} $CONFIDENCE%"
echo ""

# Market data by segment (example data - customize per use case)
case "$SEGMENT" in
  "enterprise-ai-ops")
    TAM_GLOBAL=3000000000  # $3B
    TAM_DESC="Global DevOps tools market ($8.2B) × AI Ops penetration (25-30%)"
    REGIONAL_PERCENT_NA=50
    REGIONAL_PERCENT_EU=30
    REGIONAL_PERCENT_APAC=20
    SAM_PERCENT=35
    SAM_DESC="Mid-market + Enterprise, tech/SaaS focused"
    COMPANIES_IN_SAM=3000
    AVG_CONTRACT_VALUE=120000
    YEAR1_CLOSE_RATE=0.015
    ;;
  "rag-applications")
    TAM_GLOBAL=2500000000  # $2.5B
    TAM_DESC="Emerging RAG/retrieval market (subset of larger AI infrastructure)"
    REGIONAL_PERCENT_NA=60
    REGIONAL_PERCENT_EU=25
    REGIONAL_PERCENT_APAC=15
    SAM_PERCENT=25
    SAM_DESC="Scale-ups and mid-market with active RAG projects"
    COMPANIES_IN_SAM=2000
    AVG_CONTRACT_VALUE=85000
    YEAR1_CLOSE_RATE=0.02
    ;;
  "agentic-workflows")
    TAM_GLOBAL=4200000000  # $4.2B
    TAM_DESC="Emerging agent infrastructure market (Gartner projection 2026-2030)"
    REGIONAL_PERCENT_NA=55
    REGIONAL_PERCENT_EU=28
    REGIONAL_PERCENT_APAC=17
    SAM_PERCENT=30
    SAM_DESC="Enterprise and scale-ups with AI teams"
    COMPANIES_IN_SAM=2500
    AVG_CONTRACT_VALUE=150000
    YEAR1_CLOSE_RATE=0.012
    ;;
  *)
    echo "Error: Unknown segment '$SEGMENT'"
    echo "Supported segments: enterprise-ai-ops, rag-applications, agentic-workflows"
    exit 1
    ;;
esac

# Regional adjustment
case "$REGION" in
  "na")
    REGIONAL_MULTIPLIER=$REGIONAL_PERCENT_NA
    REGION_NAME="North America"
    ;;
  "eu")
    REGIONAL_MULTIPLIER=$REGIONAL_PERCENT_EU
    REGION_NAME="Europe"
    ;;
  "apac")
    REGIONAL_MULTIPLIER=$REGIONAL_PERCENT_APAC
    REGION_NAME="Asia-Pacific"
    ;;
  *)
    echo "Error: Unknown region '$REGION'"
    echo "Supported: na, eu, apac"
    exit 1
    ;;
esac

# Calculations
TAM_REGIONAL=$((TAM_GLOBAL * REGIONAL_MULTIPLIER / 100))
SAM=$((TAM_REGIONAL * SAM_PERCENT / 100))
SOM=$((COMPANIES_IN_SAM * AVG_CONTRACT_VALUE * YEAR1_CLOSE_RATE))

# Sensitivity analysis (upside/downside)
DOWNSIDE=$((SOM * 60 / 100))  # 40% pessimistic
BASE=$SOM
UPSIDE=$((SOM * 140 / 100))   # 40% optimistic

# Format currency
format_currency() {
  printf "\$%.0fM" $(($1 / 1000000))
}

echo -e "${BOLD}TAM Analysis (Total Addressable Market)${RESET}"
echo "─────────────────────────────────────────────────"
echo "Global TAM: $(format_currency $TAM_GLOBAL)"
echo "  Basis: $TAM_DESC"
echo ""
echo "Regional TAM ($REGION_NAME): $(format_currency $TAM_REGIONAL)"
echo "  Regional penetration: $REGIONAL_MULTIPLIER%"
echo ""

echo -e "${BOLD}SAM Analysis (Serviceable Addressable Market)${RESET}"
echo "─────────────────────────────────────────────────"
echo "SAM: $(format_currency $SAM)"
echo "  Basis: $SAM_DESC"
echo "  Approximate company count: $COMPANIES_IN_SAM"
echo "  Average contract value: $(printf '\$%.0fK' $(($AVG_CONTRACT_VALUE / 1000)))"
echo ""

echo -e "${BOLD}SOM Analysis (Serviceable Obtainable Market) — Year 1${RESET}"
echo "─────────────────────────────────────────────────"
echo "Base estimate: $(format_currency $BASE)"
echo "  Model: $COMPANIES_IN_SAM companies × $(printf '\$%.0fK' $(($AVG_CONTRACT_VALUE / 1000))) ACV × $YEAR1_CLOSE_RATE close rate"
echo ""

echo -e "${BOLD}Sensitivity Analysis${RESET}"
echo "─────────────────────────────────────────────────"
echo "Downside (40% lower): $(format_currency $DOWNSIDE)"
echo "  Assumptions: Slower adoption, competitive pressure, execution risk"
echo ""
echo "Base case: $(format_currency $BASE)"
echo "  Assumptions: On-plan execution, market responsive"
echo ""
echo "Upside (40% higher): $(format_currency $UPSIDE)"
echo "  Assumptions: Faster adoption, market shift, strong product-market fit"
echo ""

echo -e "${BOLD}Key Assumptions${RESET}"
echo "─────────────────────────────────────────────────"
echo "• TAM based on analyst research (Gartner, IDC)"
echo "• SAM filtered by: geography ($REGION_NAME), vertical (tech/SaaS), company size (mid+)"
echo "• Year 1 close rate: $YEAR1_CLOSE_RATE (conservative for new market)"
echo "• ACV growth: 10% YoY (as customers expand)"
echo "• Confidence level: $CONFIDENCE%"
echo ""

echo -e "${BOLD}Decision Framework${RESET}"
echo "─────────────────────────────────────────────────"
if (( $(echo "$SAM > 1000000000" | bc -l) )); then
  echo "✓ SAM > \$1B: Large market opportunity. Proceed with entry."
else
  echo "⚠ SAM < \$1B: Market may be too small for standalone business."
fi

if (( $(echo "$BASE > 3000000" | bc -l) )); then
  echo "✓ Year 1 SOM > \$3M: Viable initial revenue target."
else
  echo "⚠ Year 1 SOM < \$3M: May be hard to justify team investment."
fi

echo ""
echo -e "${BOLD}Next Steps${RESET}"
echo "─────────────────────────────────────────────────"
echo "1. Validate TAM estimates with 5+ customer conversations"
echo "2. Run 3-5 sales cycles to calibrate SOM close rate"
echo "3. Update forecast quarterly with actual vs. expected"
echo "4. Monitor TAM expansion (market shifts, new use cases)"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo -e "${GREEN}Report generated: $(date)${RESET}"
