#!/bin/bash

##
# Roadmap Generator Script
# Creates a multi-quarter roadmap with capacity modeling
#
# Usage:
#   ./roadmap-generator.sh --themes "rag,agentic" --quarters 4 --team-velocity 13
#
# Outputs:
#   - Quarterly breakdown by theme
#   - Capacity utilization chart
#   - Dependency map
#   - Risk flags
##

set -e

# Parse arguments
THEMES=""
QUARTERS=4
TEAM_VELOCITY=13
TEAM_SIZE=3

while [[ $# -gt 0 ]]; do
  case $1 in
    --themes)
      THEMES="$2"
      shift 2
      ;;
    --quarters)
      QUARTERS="$2"
      shift 2
      ;;
    --team-velocity)
      TEAM_VELOCITY="$2"
      shift 2
      ;;
    --team-size)
      TEAM_SIZE="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

if [ -z "$THEMES" ]; then
  echo "Error: --themes is required"
  echo "Usage: $0 --themes \"theme1,theme2\" [--quarters 4] [--team-velocity 13]"
  exit 1
fi

# Colors
BOLD='\033[1m'
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
RESET='\033[0m'

# Configuration by theme
declare -A THEME_DESCRIPTION
declare -A THEME_PRIORITY
declare -A THEME_EFFORT

THEME_DESCRIPTION[rag]="Retrieval-augmented generation: Document ingestion, vector storage, reranking"
THEME_PRIORITY[rag]="1"
THEME_EFFORT[rag]="11"

THEME_DESCRIPTION[agentic]="Agentic workflows: Tool use, multi-step planning, agent orchestration"
THEME_PRIORITY[agentic]="2"
THEME_EFFORT[agentic]="8"

THEME_DESCRIPTION[multimodel]="Multi-model support: Model switching, routing, cost optimization"
THEME_PRIORITY[multimodel]="2"
THEME_EFFORT[multimodel]="5"

THEME_DESCRIPTION[compliance]="Compliance and governance: Audit logs, RBAC, data retention"
THEME_PRIORITY[compliance]="3"
THEME_EFFORT[compliance]="6"

THEME_DESCRIPTION[observability]="Observability: Monitoring, alerting, performance dashboards"
THEME_PRIORITY[observability]="2"
THEME_EFFORT[observability]="7"

THEME_DESCRIPTION[scaling]="Scaling and performance: Multi-region, caching, optimization"
THEME_PRIORITY[scaling]="3"
THEME_EFFORT[scaling]="9"

# Calculate capacity
SPRINTS_PER_QUARTER=3
CAPACITY_PER_SPRINT=$((TEAM_SIZE * TEAM_VELOCITY))
CAPACITY_PER_QUARTER=$((CAPACITY_PER_SPRINT * SPRINTS_PER_QUARTER))
BUFFER_PERCENT=20
NET_CAPACITY=$((CAPACITY_PER_QUARTER * (100 - BUFFER_PERCENT) / 100))

echo -e "${BOLD}Multi-Quarter Roadmap Generator${RESET}"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo -e "${BLUE}Configuration:${RESET}"
echo "  Themes: $THEMES"
echo "  Quarters: $QUARTERS"
echo "  Team: $TEAM_SIZE engineers"
echo "  Velocity: $TEAM_VELOCITY points/sprint"
echo "  Capacity: $NET_CAPACITY points/quarter (after $BUFFER_PERCENT% buffer)"
echo ""

# Parse themes
IFS=',' read -ra THEME_ARRAY <<< "$THEMES"

# Print theme descriptions
echo -e "${BOLD}Themes to Plan:${RESET}"
echo "─────────────────────────────────────────────────────────────"
for theme in "${THEME_ARRAY[@]}"; do
  theme=$(echo "$theme" | xargs)  # Trim whitespace
  priority=${THEME_PRIORITY[$theme]:-"?"}
  effort=${THEME_EFFORT[$theme]:-"?"}
  echo -e "  • ${GREEN}$theme${RESET} (Priority: $priority, Effort: ${effort}mo)"
  echo "    ${THEME_DESCRIPTION[$theme]}"
  echo ""
done

# Generate quarterly roadmap
echo -e "${BOLD}Quarterly Roadmap${RESET}"
echo "═══════════════════════════════════════════════════════════════"
echo ""

TOTAL_EFFORT=0
for ((q = 1; q <= QUARTERS; q++)); do
  if [ "$q" -eq 1 ]; then
    Q="Q1"
    YEAR=2026
  elif [ "$q" -eq 2 ]; then
    Q="Q2"
    YEAR=2026
  elif [ "$q" -eq 3 ]; then
    Q="Q3"
    YEAR=2026
  else
    Q="Q4"
    YEAR=2026
  fi

  echo -e "${BLUE}${Q} ${YEAR} (Capacity: ${NET_CAPACITY} points)${RESET}"
  echo "─────────────────────────────────────────────────────────────"

  # Allocate themes to quarters
  QUARTER_EFFORT=0
  COMMITTED=""
  HIGHCONF=""

  for ((i = 0; i < ${#THEME_ARRAY[@]}; i++)); do
    theme=$(echo "${THEME_ARRAY[$i]}" | xargs)
    effort=${THEME_EFFORT[$theme]:-8}
    priority=${THEME_PRIORITY[$theme]:-3}

    # Simple allocation: assign themes round-robin, respecting capacity
    assigned_quarter=$(((i % QUARTERS) + 1))

    if [ "$assigned_quarter" -eq "$q" ]; then
      if [ $((QUARTER_EFFORT + effort)) -le $NET_CAPACITY ]; then
        COMMITTED="$COMMITTED $theme($effort)"
        QUARTER_EFFORT=$((QUARTER_EFFORT + effort))
        TOTAL_EFFORT=$((TOTAL_EFFORT + effort))
      else
        HIGHCONF="$HIGHCONF $theme($effort)"
      fi
    fi
  done

  echo "Committed:"
  if [ -z "$COMMITTED" ]; then
    echo "  (none)"
  else
    for item in $COMMITTED; do
      echo "  ✓ $item"
    done
  fi
  echo ""

  echo "High Confidence:"
  if [ -z "$HIGHCONF" ]; then
    echo "  (none)"
  else
    for item in $HIGHCONF; do
      echo "  ~ $item (at-risk)"
    done
  fi
  echo ""

  # Capacity check
  PERCENT=$((QUARTER_EFFORT * 100 / NET_CAPACITY))
  if [ "$PERCENT" -gt 100 ]; then
    echo -e "  Utilization: ${RED}${PERCENT}%${RESET} 🚩 OVER CAPACITY"
  elif [ "$PERCENT" -gt 80 ]; then
    echo -e "  Utilization: ${YELLOW}${PERCENT}%${RESET} (tight)"
  else
    echo -e "  Utilization: ${GREEN}${PERCENT}%${RESET} (healthy)"
  fi
  echo ""
done

# Dependency analysis
echo -e "${BOLD}Dependency Analysis${RESET}"
echo "═══════════════════════════════════════════════════════════════"
echo ""

echo "Dependency graph (sequential constraints):"
echo "  RAG integration (Q1)"
echo "    ↓ (blocking)"
echo "  Agentic workflows (Q2)"
echo "    ↓ (blocking)"
echo "  Tool use framework (Q2-Q3)"
echo ""

echo "Risk propagation:"
echo "  • If RAG slips by 2+ weeks → Agentic slip by 2 weeks"
echo "  • If Agentic slips by 2+ weeks → Tool use slip by 4+ weeks"
echo ""

# Risk register
echo -e "${BOLD}Risk Register${RESET}"
echo "═══════════════════════════════════════════════════════════════"
echo ""

echo "| Risk | Probability | Impact | Mitigation |"
echo "|------|-------------|--------|------------|"
echo "| RAG feature complexity underestimated | Medium | High | Spike week 1; validate architecture |"
echo "| Agentic framework needs rework | Medium | Medium | Prototype first; tech review |"
echo "| Team velocity drops due to tech debt | Low | High | Allocate 10% capacity for cleanup |"
echo "| Dependencies cascade | Medium | High | Weekly dependency health check |"
echo ""

# Summary
echo -e "${BOLD}Summary${RESET}"
echo "═══════════════════════════════════════════════════════════════"
echo "Total planned effort: $TOTAL_EFFORT person-months"
echo "Average per quarter: $((TOTAL_EFFORT / QUARTERS)) person-months"
echo ""

echo -e "${BOLD}Next Steps:${RESET}"
echo "  1. Review with engineering: Validate effort estimates"
echo "  2. Lock themes by EOW: Get alignment on priorities"
echo "  3. Monthly: Track burndown, flag slips early"
echo "  4. Mid-quarter: Adjust if needed (only High Confidence items)"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo -e "${GREEN}Roadmap generated: $(date)${RESET}"
