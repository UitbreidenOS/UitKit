#!/bin/bash
# Full-scale SVG Inspector Load Test
# Runs with maximum dataset and concurrency: 10K nodes, 50K edges, 1000 operations

set -e

echo "🚀 Starting full-scale SVG Inspector load test..."
echo "📊 Configuration: 10,000 nodes, 50,000 edges, 1,000 operations"
echo ""

node load-tests/svg-inspector-load.js --full-scale

echo ""
echo "✅ Full-scale load test complete"
