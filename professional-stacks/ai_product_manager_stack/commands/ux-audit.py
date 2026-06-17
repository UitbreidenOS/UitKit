#!/usr/bin/env python3

"""
UX Audit Script
Compares UX/usability of two products side-by-side

Usage:
    python ux-audit.py --product "our-ai-tool" --competitor "openai-api" --dimension "onboarding"

Outputs:
    - Side-by-side UX comparison matrix
    - Friction points identified
    - Recommendations for improvement
"""

import sys
import argparse
from datetime import datetime

def format_bold(text):
    """ANSI bold formatting"""
    return f"\033[1m{text}\033[0m"

def format_section(text):
    """ANSI blue section header"""
    return f"\033[0;34m{text}\033[0m"

def format_check(text):
    """Green checkmark"""
    return f"\033[0;32m✓\033[0m {text}"

def format_x(text):
    """Red X"""
    return f"\033[0;31m✗\033[0m {text}"

def format_caution(text):
    """Yellow caution"""
    return f"\033[0;33m⚠\033[0m {text}"

# UX audit data by dimension
UX_DATA = {
    "onboarding": {
        "our-ai-tool": {
            "time_to_first_metric": "3 min",
            "signup_steps": 2,
            "auth_complexity": "Simple (OAuth)",
            "api_key_visibility": "Immediate",
            "documentation": "Good",
            "getting_started_video": "Yes",
            "interactive_tutorial": "Yes",
            "sample_data": "Pre-loaded",
            "error_messages": "Generic",
            "mobile_friendly": "Partial",
            "friction_points": ["Error messages could be more helpful", "Mobile setup not optimized"],
            "score": 8.5,
        },
        "openai-api": {
            "time_to_first_metric": "8 min",
            "signup_steps": 3,
            "auth_complexity": "API key only",
            "api_key_visibility": "Requires menu navigation",
            "documentation": "Extensive but dense",
            "getting_started_video": "No",
            "interactive_tutorial": "No",
            "sample_data": "None",
            "error_messages": "Detailed (can be overwhelming)",
            "mobile_friendly": "Yes",
            "friction_points": ["No interactive guide", "Dense documentation", "Must read docs to get started"],
            "score": 6.5,
        },
        "anthropic-api": {
            "time_to_first_metric": "5 min",
            "signup_steps": 2,
            "auth_complexity": "API key + webhook",
            "api_key_visibility": "Settings page",
            "documentation": "Clear and organized",
            "getting_started_video": "Yes (embedded)",
            "interactive_tutorial": "No",
            "sample_data": "Code examples",
            "error_messages": "Contextual",
            "mobile_friendly": "Yes",
            "friction_points": ["No interactive tutorial", "Webhook setup slightly complex"],
            "score": 8.0,
        },
    },
    "api-design": {
        "our-ai-tool": {
            "endpoint_clarity": "Clear, RESTful",
            "parameter_naming": "Intuitive (model, temperature, max_tokens)",
            "response_format": "JSON, consistent",
            "pagination": "Cursor-based",
            "rate_limiting": "Per-second, clear headers",
            "error_codes": "Standard HTTP + custom codes",
            "batch_support": "Yes",
            "streaming": "Yes (SSE)",
            "webhook_support": "Yes",
            "sdk_availability": "Python, JS, Go",
            "friction_points": ["Batch API under-documented", "Streaming has latency variance"],
            "score": 8.0,
        },
        "openai-api": {
            "endpoint_clarity": "Clear, RESTful",
            "parameter_naming": "Clear but verbose",
            "response_format": "JSON, sometimes inconsistent",
            "pagination": "Token-based",
            "rate_limiting": "Token-based, can be confusing",
            "error_codes": "Generic HTTP codes",
            "batch_support": "Yes (asynchronous)",
            "streaming": "Yes (Server-Sent Events)",
            "webhook_support": "No (polling required)",
            "sdk_availability": "Python, JS, Node",
            "friction_points": ["No webhooks", "Rate limiting model is complex", "Response format varies by endpoint"],
            "score": 7.0,
        },
        "anthropic-api": {
            "endpoint_clarity": "Clear, RESTful",
            "parameter_naming": "Intuitive (system, messages, max_tokens)",
            "response_format": "JSON, consistent",
            "pagination": "None needed (message-based)",
            "rate_limiting": "Per-minute, clear",
            "error_codes": "Standard + helpful messages",
            "batch_support": "No",
            "streaming": "Yes (via messages)",
            "webhook_support": "No",
            "sdk_availability": "Python, JS, Go, .NET",
            "friction_points": ["No batch API", "No webhooks", "Synchronous-only for larger payloads"],
            "score": 7.5,
        },
    },
    "pricing-transparency": {
        "our-ai-tool": {
            "pricing_page_clarity": "Clear tier structure",
            "per_unit_pricing": "Per token (visible)",
            "calculator_availability": "Yes",
            "hidden_fees": "None",
            "volume_discounts": "Yes (10%+ at scale)",
            "overage_charges": "Clear per-token",
            "free_tier": "Yes (100K tokens/mo)",
            "enterprise_pricing": "Negotiable",
            "comparison_chart": "Yes, vs. competitors",
            "cost_monitoring_tools": "Built-in dashboard",
            "friction_points": ["Enterprise pricing requires sales call", "Forecast calculator needs more detail"],
            "score": 8.5,
        },
        "openai-api": {
            "pricing_page_clarity": "Model-dependent pricing table",
            "per_unit_pricing": "Per 1K tokens (must calculate)",
            "calculator_availability": "No",
            "hidden_fees": "Slightly unclear (token counting)",
            "volume_discounts": "No published discounts",
            "overage_charges": "Automatic",
            "free_tier": "$5 trial credit",
            "enterprise_pricing": "Available but opaque",
            "comparison_chart": "No",
            "cost_monitoring_tools": "Usage dashboard (basic)",
            "friction_points": ["No calculator", "Must decode token counting", "No volume discounts public", "Hard to forecast costs"],
            "score": 6.0,
        },
        "anthropic-api": {
            "pricing_page_clarity": "Clear per-token pricing",
            "per_unit_pricing": "Per 1M tokens (input/output split)",
            "calculator_availability": "Yes (input + output)",
            "hidden_fees": "None visible",
            "volume_discounts": "Yes (5%+ at scale)",
            "overage_charges": "Clear",
            "free_tier": "$5 credit",
            "enterprise_pricing": "Yes",
            "comparison_chart": "Minimal (no direct comps)",
            "cost_monitoring_tools": "Dashboard + alerts",
            "friction_points": ["Input/output token split can be confusing", "No comparison chart"],
            "score": 8.0,
        },
    },
}

def print_header():
    """Print report header"""
    print(format_bold("UX Audit Report"))
    print("═" * 80)
    print()

def print_dimension_comparison(dimension, product, competitor, third_party=None):
    """Print side-by-side comparison for a dimension"""

    our_data = UX_DATA[dimension][product]
    their_data = UX_DATA[dimension][competitor]

    print(format_section(f"Dimension: {dimension.replace('-', ' ').title()}"))
    print("─" * 80)
    print()

    # Create comparison table
    print(f"{'Metric':<35} {'Our Product':<20} {'Competitor':<20}")
    print("─" * 80)

    # Extract keys (skip derived fields)
    metric_keys = [k for k in our_data.keys() if k not in ['friction_points', 'score']]

    for key in metric_keys:
        metric_name = key.replace('_', ' ').title()
        our_val = str(our_data[key])
        their_val = str(their_data[key])

        # Truncate long values
        our_val = our_val[:19] if len(our_val) > 19 else our_val
        their_val = their_val[:19] if len(their_val) > 19 else their_val

        print(f"{metric_name:<35} {our_val:<20} {their_val:<20}")

    print()

    # Scoring
    our_score = our_data['score']
    their_score = their_data['score']

    print(format_bold("Overall UX Score"))
    print(f"  Our product:  {our_score:.1f}/10")
    print(f"  Competitor:   {their_score:.1f}/10")

    if our_score > their_score:
        gap = our_score - their_score
        print(format_check(f"We lead by {gap:.1f} points"))
    elif their_score > our_score:
        gap = their_score - our_score
        print(format_caution(f"Competitor leads by {gap:.1f} points"))
    else:
        print("  Tie")

    print()

    # Friction points
    print(format_bold("Friction Points"))
    print()

    print(f"  {product.upper()} (Our product):")
    for point in our_data['friction_points']:
        print(f"    • {point}")
    print()

    print(f"  {competitor.upper()} (Competitor):")
    for point in their_data['friction_points']:
        print(f"    • {point}")
    print()

def print_recommendations(product, competitor, dimension):
    """Print actionable recommendations"""
    print(format_bold("Recommendations"))
    print("─" * 80)

    recommendations = {
        "onboarding": [
            "Improve error messages: Add context-aware guidance, not just error codes",
            "Create mobile-optimized onboarding flow (currently 'Partial')",
            "Add interactive tutorial: Reduce time-to-first-metric by 50% target",
            "Benchmark against: Competitor takes 8 min vs. our 3 min (we're winning)",
        ],
        "api-design": [
            "Add webhook support: Critical missing feature vs. competitor landscape",
            "Document batch API more extensively: Currently under-documented",
            "Reduce rate-limiting confusion: Clearly explain token-based limits",
            "Ensure response format consistency: Some endpoints vary from standard",
        ],
        "pricing-transparency": [
            "Add cost calculator: Competitors don't have it; we should promote ours",
            "Publish volume discounts: Make 10%+ discounts more visible/automatic",
            "Create pricing comparison chart: Show why we're better value",
            "Improve forecast accuracy: Help customers predict bills to ±10%",
        ],
    }

    if dimension in recommendations:
        for i, rec in enumerate(recommendations[dimension], 1):
            print(f"{i}. {rec}")
    print()

def main():
    parser = argparse.ArgumentParser(description='UX Audit: Compare two products side-by-side')
    parser.add_argument('--product', required=True, help='Our product name')
    parser.add_argument('--competitor', required=True, help='Competitor product name')
    parser.add_argument('--dimension', required=True, help='UX dimension to compare')

    args = parser.parse_args()

    product = args.product.lower().replace(' ', '-')
    competitor = args.competitor.lower().replace(' ', '-')
    dimension = args.dimension.lower().replace(' ', '-')

    # Validate inputs
    if dimension not in UX_DATA:
        print(f"Error: Unknown dimension '{dimension}'")
        print(f"Available dimensions: {', '.join(UX_DATA.keys())}")
        sys.exit(1)

    if product not in UX_DATA[dimension]:
        print(f"Error: Product '{product}' not in '{dimension}' data")
        sys.exit(1)

    if competitor not in UX_DATA[dimension]:
        print(f"Error: Competitor '{competitor}' not in '{dimension}' data")
        sys.exit(1)

    # Print report
    print_header()
    print(f"Product:   {product}")
    print(f"Competitor: {competitor}")
    print(f"Dimension: {dimension.replace('-', ' ').title()}")
    print()
    print("─" * 80)
    print()

    print_dimension_comparison(dimension, product, competitor)
    print_recommendations(product, competitor, dimension)

    print(format_bold("Summary"))
    print("─" * 80)
    print("This UX audit compares user experience across a specific dimension.")
    print("Repeat for other dimensions to build comprehensive competitive profile.")
    print()

    print(format_bold("Next Steps"))
    print("─" * 80)
    print("1. Audit additional dimensions (e.g., API design, documentation)")
    print("2. Interview customers: Ask which UX factors matter most")
    print("3. Measure: Track time-to-value, error rates, support volume")
    print("4. Iterate: Fix friction points quarterly")
    print()

    print("═" * 80)
    print(f"Report generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == '__main__':
    main()
