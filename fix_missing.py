#!/usr/bin/env python3
"""Re-verify MISSING entries in feature-presence.txt with broader searches."""

import subprocess, json, re, os

def sh(cmd):
    return subprocess.run(cmd, shell=True, capture_output=True, text=True).stdout

def search_patterns(base_terms, id_term, name_terms):
    """Search repo for files matching any term."""
    patterns = set()
    for t in base_terms + [id_term] + name_terms:
        patterns.add(t.lower())
    results = set()
    for p in patterns:
        out = sh(f"find . -type f -not -path './node_modules/*' -not -path './.git/*' -not -path './.out-of-scope/*' -not -path './site/node_modules/*' -iname '*{p}*' 2>/dev/null | head -20")
        for line in out.strip().split('\n'):
            if line.strip():
                results.add(line.strip())
        out = sh(f"grep -ri -l '{p}' skills/ agents/ hooks/ rules/ workflows/ commands/ mcp/ scripts/ guides/ structures/ routines/ plugins/ keybindings/ statuslines/ claudeignore-templates/ 2>/dev/null | head -20")
        for line in out.strip().split('\n'):
            if line.strip():
                results.add(line.strip())
    return list(results)

def main():
    with open('feature-presence.txt') as f:
        lines = f.read().strip().split('\n')
    new_lines = []
    for line in lines:
        parts = [p.strip() for p in line.split('|')]
        if len(parts) >= 4 and parts[3] == 'MISSING':
            fid, cat, name = parts[0], parts[1], parts[2]
            base = [fid, cat, name]
            id_term = fid.replace('-', '')
            name_simple = re.sub(r'[^a-zA-Z0-9\s]', '', name).lower().split()
            name_terms = [n for n in name_simple if len(n) > 2]
            files = search_patterns([], id_term, name_terms)
            if files:
                matches = ', '.join(files[:8])
                status = 'PRESENT'
            else:
                matches = 'none'
                status = 'MISSING'
            new_lines.append(f"{fid} | {cat} | {name} | {status} | {matches}")
        else:
            new_lines.append(line)
    with open('feature-presence.txt', 'w') as f:
        f.write('\n'.join(new_lines) + '\n')
    print(f"Updated {len(new_lines)} lines.")

if __name__ == '__main__':
    main()
