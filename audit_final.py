#!/usr/bin/env python3
import os
import re

STOP_WORDS = {'the', 'a', 'an', 'in', 'on', 'at', 'to', 'and', 'or', 'of', 'for', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'shall', 'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they'}

EXCLUDE_DIRS = {'.git', 'node_modules', 'site', '.vercel', '.astro', '.DS_Store', '.claude', '__pycache__'}

def get_keywords(name):
    cleaned = re.sub(r'[^a-zA-Z0-9\s]', ' ', name)
    words = cleaned.lower().split()
    return [w for w in words if w not in STOP_WORDS and len(w) > 2]

def should_exclude(path_parts):
    for part in path_parts:
        if part in EXCLUDE_DIRS or part.startswith('.') or part.startswith('__'):
            return True
    return False

def file_matches(root, f, search_terms):
    fname = f.lower().replace('-', '').replace('_', '')
    for term in search_terms:
        if term.lower().replace('-', '').replace('_', '') in fname:
            return True
    # Also check content for exact id only
    fpath = os.path.join(root, f)
    if f.endswith(('.md', '.sh', '.json', '.js', '.py', '.ts', '.txt')):
        try:
            with open(fpath, 'r', encoding='utf-8', errors='ignore') as fh:
                content = fh.read().lower()
                for term in search_terms:
                    if term in content and len(term) >= 5:
                        return True
        except Exception:
            pass
    return False

def find_matches(id_val, keywords):
    matches = set()
    search_terms = [id_val] + keywords
    for root, dirs, files in os.walk('.', topdown=True):
        # Exclude dirs
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS and not d.startswith('.') and not d.startswith('__')]
        if should_exclude(root.split(os.sep)):
            continue
        for f in files:
            if f.startswith('.'):
                continue
            fpath = os.path.join(root, f)
            if file_matches(root, f, search_terms):
                matches.add(fpath)
    return matches

def check_index_json(id_val):
    if not os.path.exists('index.json'):
        return False
    try:
        with open('index.json', 'r', encoding='utf-8') as f:
            return f'"{id_val}"' in f.read()
    except Exception:
        return False

SPECIAL_CASES = {
    'claudeignore': ['./claudeignore-templates/'],
    'legacy-strangler': ['./workflows/strangle-legacy.md'],
    'council': ['./scripts/council.js'],
    'swarm-sandbox': ['./structures/local-first-agentic-sandbox.md'],
    'shadow-pr': ['./routines/shadow-pr.md'],
    'sentinel': ['./scripts/sentinel.js'],
    'design-extract': ['./skills/frontend/design-system-extraction.md'],
    'pulse-statusline': ['./statuslines/pulse.sh'],
    'power-keybindings': ['./keybindings/power-user.json', './keybindings/README.md', './guides/keybindings-guide.md'],
    'shell-aliases': ['./scripts/install-aliases.sh'],
    'mcp-discovery': ['./skills/ai-engineering/mcp-dynamic-discovery.md'],
    'repair-agent': ['./scripts/repair.js'],
    'figma-bridge': ['./skills/frontend/figma-to-code.md'],
    'graph-context': ['./skills/ai-engineering/graph-augmented-context.md'],
    'self-healing-ci': ['./skills/devops-infra/heal-ci.md'],
    'audit-html': [],
    'telemetry-optin': [],
    'matrix-theme': [],
    'dashboard-launcher': [],
    'svg-map-inspector': [],
}

def main():
    inventory = []
    with open('feature-inventory.txt', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = [p.strip() for p in line.split('|')]
            if len(parts) >= 3:
                inventory.append(parts)

    with open('feature-presence.txt', 'w', encoding='utf-8') as out:
        for parts in inventory:
            id_val = parts[0]
            category = parts[1]
            name = parts[2]
            keywords = get_keywords(name)

            matches = find_matches(id_val, keywords)

            # Add special cases
            if id_val in SPECIAL_CASES:
                for special in SPECIAL_CASES[id_val]:
                    if special.endswith('/'):
                        # Add all files in directory
                        if os.path.isdir(special):
                            for f in os.listdir(special):
                                matches.add(special + f)
                    elif os.path.exists(special):
                        matches.add(special)

            in_index = check_index_json(id_val)
            if in_index:
                matches.add('./index.json')

            # Remove node_modules and site matches
            clean_matches = set()
            for m in matches:
                if 'node_modules' not in m and 'site/' not in m and '.vercel' not in m:
                    clean_matches.add(m)

            # Normalize paths
            unique_matches = sorted(clean_matches)

            if unique_matches:
                status = 'PRESENT'
            else:
                status = 'MISSING'
                unique_matches = ['none']

            display = unique_matches[:10]
            out.write(f"{id_val} | {category} | {name} | {status} | {', '.join(display)}\n")

    with open('feature-presence.txt', 'r') as f:
        lines = [l for l in f if l.strip()]
    print(f"Done. Lines in output: {len(lines)}")

if __name__ == '__main__':
    main()
