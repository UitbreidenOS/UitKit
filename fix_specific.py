#!/usr/bin/env python3
"""Fix known incorrect entries in feature-presence.txt."""

import re

with open('feature-presence.txt') as f:
    lines = f.read().strip().split('\n')

fixes = {
    'council': 'PRESENT | ./scripts/council.js',
    'sentinel': 'PRESENT | ./scripts/sentinel.js',
    'blast-radius': 'PRESENT | ./skills/architecture/blast-radius.md, ./.claude/blast-radius-report.md',
    'shadow-pr': 'PRESENT | ./routines/shadow-pr.md',
    'dba-box': 'PRESENT | ./skills/architecture/dba-in-a-box.md',
    'shell-aliases': 'PRESENT | ./scripts/install-aliases.sh',
    'repair-agent': 'PRESENT | ./scripts/repair.js',
    'spec-enforcer': 'PRESENT | ./hooks/pre-tool-use/spec-enforcer.md, ./hooks/pre-tool-use/spec-enforcer.sh',
    'grill-me': 'PRESENT | ./skills/productivity/grill-me.md',
    'design-extract': 'PRESENT | ./skills/frontend/design-system-extraction.md',
    'audit-html': 'PRESENT | ./enterprise/audit_trail.md',
    'matrix-theme': 'MISSING | none',
    'self-healing-ci': 'PRESENT | ./skills/devops-infra/heal-ci.md',
    'swarm-sandbox': 'MISSING | none',
    'svg-map-inspector': 'MISSING | none',
}

new_lines = []
for line in lines:
    parts = [p.strip() for p in line.split('|')]
    fid = parts[0]
    if fid in fixes:
        status, matches = fixes[fid].split(' | ')
        new_lines.append(f"{fid} | {parts[1]} | {parts[2]} | {status} | {matches}")
    else:
        new_lines.append(line)

with open('feature-presence.txt', 'w') as f:
    f.write('\n'.join(new_lines) + '\n')
print(f"Done: {len(new_lines)} lines.")
