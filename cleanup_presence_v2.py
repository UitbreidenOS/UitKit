#!/usr/bin/env python3
"""Clean up feature-presence.txt efficiently with pre-computed data."""

import json, re, os

# Load index.json
with open('index.json') as f:
    index_data = json.load(f)

# Build keyword index from index.json
index_keywords = {}
for section in ['skills', 'agents', 'hooks', 'rules', 'workflows', 'commands', 'mcp']:
    for item in index_data.get(section, []):
        item_id = item.get('id', '')
        name = item.get('name', '')
        for kw in [item_id.lower(), name.lower()]:
            if kw:
                index_keywords.setdefault(kw, []).append(f"index.json/{section} -> {item_id}")

# Pre-scan all relevant files
relevant_files = []
for root, dirs, files in os.walk('.'):
    # Skip irrelevant dirs
    skip = False
    for skip_dir in ['node_modules', '.git', '.out-of-scope', 'site/node_modules']:
        if skip_dir in root.split(os.sep):
            skip = True
            break
    if skip:
        continue
    # Only include relevant top-level dirs
    rel_root = root.lstrip('./')
    if not any(rel_root.startswith(d) for d in ['skills', 'agents', 'hooks', 'rules', 'workflows', 'commands', 'mcp', 'scripts', 'guides', 'keybindings', 'statuslines', 'claudeignore-templates']):
        continue
    for fname in files:
        fpath = os.path.join(root, fname)
        relevant_files.append(fpath)

# Normalize paths
all_paths_lower = [p.lower() for p in relevant_files]
all_basenames_lower = [os.path.basename(p).lower() for p in relevant_files]

with open('feature-presence.txt') as f:
    lines = f.read().strip().split('\n')

new_lines = []
for line in lines:
    parts = [p.strip() for p in line.split('|')]
    if len(parts) < 4:
        new_lines.append(line)
        continue
    fid, cat, name = parts[0], parts[1], parts[2]
    
    # Build search terms
    terms = set()
    terms.add(fid.lower())
    terms.add(fid.lower().replace('-', ''))
    words = re.sub(r'[^a-zA-Z0-9\s]', ' ', name).lower().split()
    for w in words:
        if len(w) > 3 and w not in {'with', 'from', 'your', 'this', 'that', 'into', 'code', 'mode', 'hook', 'first', 'self', 'safe', 'fast', 'plan', 'auto', 'dev', 'infra'}:
            terms.add(w)
    
    matches = []
    # Check index.json
    for t in terms:
        if t in index_keywords:
            matches.extend(index_keywords[t])
    
    # Check file paths and basenames
    for i, p in enumerate(all_paths_lower):
        for t in terms:
            if t in p or t in all_basenames_lower[i]:
                if relevant_files[i] not in matches:
                    matches.append(relevant_files[i])
                break
    
    if matches:
        status = 'PRESENT'
        match_str = ', '.join(matches[:5])
    else:
        status = 'MISSING'
        match_str = 'none'
    
    new_lines.append(f"{fid} | {cat} | {name} | {status} | {match_str}")

with open('feature-presence.txt', 'w') as f:
    f.write('\n'.join(new_lines) + '\n')
print(f"Done: {len(new_lines)} lines.")
