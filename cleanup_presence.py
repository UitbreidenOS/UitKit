#!/usr/bin/env python3
"""Clean up feature-presence.txt: remove false positives, add index.json checks."""

import subprocess, re, os, json

def sh(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=30)
    return r.stdout

# Load index.json
with open('index.json') as f:
    index_data = json.load(f)

# Build reverse map from index.json: keyword -> list of (type, id)
index_map = {}
for section in ['skills', 'agents', 'hooks', 'rules', 'workflows', 'commands', 'mcp']:
    items = index_data.get(section, [])
    for item in items:
        item_id = item.get('id', '')
        name = item.get('name', '')
        keywords = set([item_id.lower(), name.lower()])
        for kw in keywords:
            index_map.setdefault(kw, []).append((section, item_id))

# Relevant directories for matches
RELEVANT_DIRS = [
    './skills/', './agents/', './hooks/', './rules/', './workflows/',
    './commands/', './mcp/', './scripts/', './guides/', './keybindings/',
    './statuslines/', './claudeignore-templates/'
]

def is_relevant(path):
    for d in RELEVANT_DIRS:
        if path.startswith(d):
            return True
    return False

def search_terms(id_term, name):
    terms = set()
    terms.add(id_term.lower().replace('-', ''))
    terms.add(id_term.lower())
    # Extract meaningful words from name
    words = re.sub(r'[^a-zA-Z0-9\s]', ' ', name).lower().split()
    for w in words:
        if len(w) > 3 and w not in {'with', 'from', 'your', 'this', 'that', 'into', 'code'}:
            terms.add(w)
    return list(terms)

def find_matches(fid, name):
    terms = search_terms(fid, name)
    matched = set()
    # Check index.json
    for t in terms:
        index_hits = index_map.get(t, [])
        for section, item_id in index_hits:
            # Try to find file path
            found = sh(f"find . -path './node_modules/*' -prune -o -path './site/node_modules/*' -prune -o -path './.git/*' -prune -o -type f -name '*{item_id.replace('/', '*')}*' -print 2>/dev/null | head -5").strip().split('\n')
            for f in found:
                if f.strip() and is_relevant(f.strip()):
                    matched.add(f.strip())
    # Search relevant dirs only
    for t in terms:
        out = sh(f"find . -path './node_modules/*' -prune -o -path './site/node_modules/*' -prune -o -path './.git/*' -prune -o -path './.out-of-scope/*' -prune -o -type f \( -path './skills/*' -o -path './agents/*' -o -path './hooks/*' -o -path './rules/*' -o -path './workflows/*' -o -path './commands/*' -o -path './mcp/*' -o -path './scripts/*' -o -path './guides/*' -o -path './keybindings/*' -o -path './statuslines/*' -o -path './claudeignore-templates/*' \) -iname '*{t}*' -print 2>/dev/null | head -10").strip().split('\n')
        for f in out:
            if f.strip():
                matched.add(f.strip())
        # Content search in skills/, agents/, hooks/ only
        out = sh(f"grep -ri -l '{t}' skills/ agents/ hooks/ rules/ workflows/ commands/ mcp/ scripts/ guides/ keybindings/ statuslines/ claudeignore-templates/ 2>/dev/null | head -10").strip().split('\n')
        for f in out:
            if f.strip() and is_relevant(f.strip()):
                matched.add(f.strip())
    return list(matched)[:5]

with open('feature-presence.txt') as f:
    lines = f.read().strip().split('\n')

new_lines = []
for line in lines:
    parts = [p.strip() for p in line.split('|')]
    if len(parts) < 4:
        new_lines.append(line)
        continue
    fid, cat, name, status = parts[0], parts[1], parts[2], parts[3]
    matches = find_matches(fid, name)
    if matches:
        new_lines.append(f"{fid} | {cat} | {name} | PRESENT | {', '.join(matches)}")
    else:
        new_lines.append(f"{fid} | {cat} | {name} | MISSING | none")

with open('feature-presence.txt', 'w') as f:
    f.write('\n'.join(new_lines) + '\n')
print(f"Done: {len(new_lines)} lines.")
