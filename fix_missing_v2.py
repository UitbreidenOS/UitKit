#!/usr/bin/env python3
"""Re-verify MISSING entries in feature-presence.txt with broader searches."""

import subprocess, re, os

def sh(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=60)
    return r.stdout

# Pre-compute all searchable files in the repo once
ALL_FILES = set()
print("Collecting file list...")
for line in sh("find . -type f -not -path './node_modules/*' -not -path './.git/*' -not -path './site/node_modules/*' -not -path './.out-of-scope/*' 2>/dev/null").split('\n'):
    if line.strip():
        ALL_FILES.add(line.strip().lower())

# Also pre-compute file names only
FILE_NAMES = {}
for f in ALL_FILES:
    base = os.path.basename(f)
    FILE_NAMES.setdefault(base, []).append(f)

def search_patterns(id_term, name_terms):
    results = set()
    terms = set([id_term.lower()] + [t.lower() for t in name_terms])
    for f in ALL_FILES:
        f_lower = f
        for t in terms:
            if t in f_lower:
                results.add(f)
                break
    for t in terms:
        for base, paths in FILE_NAMES.items():
            if t in base:
                results.update(paths)
    return list(results)[:8]

def main():
    with open('feature-presence.txt') as f:
        lines = f.read().strip().split('\n')
    new_lines = []
    for line in lines:
        parts = [p.strip() for p in line.split('|')]
        if len(parts) >= 4 and parts[3] == 'MISSING':
            fid, cat, name = parts[0], parts[1], parts[2]
            id_term = fid.replace('-', '')
            name_simple = re.sub(r'[^a-zA-Z0-9\s]', '', name).lower().split()
            name_terms = [n for n in name_simple if len(n) > 2]
            files = search_patterns(id_term, name_terms)
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
