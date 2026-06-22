#!/usr/bin/env python3
import os
import re

STOP_WORDS = {'the', 'a', 'an', 'in', 'on', 'at', 'to', 'and', 'or', 'of', 'for', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'shall', 'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'our', 'their'}

SEARCH_DIRS = ['skills', 'agents', 'hooks', 'rules', 'workflows', 'commands', 'mcp']

def get_keywords(name):
    cleaned = re.sub(r'[^a-zA-Z0-9\s]', ' ', name)
    words = cleaned.lower().split()
    return [w for w in words if w not in STOP_WORDS and len(w) > 2]

def find_file_matches(id_val, keywords):
    """Find files whose paths contain the id or keywords."""
    matches = set()
    terms = [id_val] + keywords
    for dir_name in SEARCH_DIRS:
        if not os.path.isdir(dir_name):
            continue
        for root, dirs, files in os.walk(dir_name):
            for f in files:
                if f.startswith('.') or f == 'index.json':
                    continue
                fpath = os.path.join(root, f)
                fname_lower = f.lower()
                path_lower = fpath.lower()
                for term in terms:
                    if len(term) < 3:
                        continue
                    # Combine dashes/underscores for fuzzy matching
                    combined_term = term.replace('-', '').replace('_', '')
                    combined_fname = fname_lower.replace('-', '').replace('_', '')
                    combined_path = path_lower.replace('-', '').replace('_', '')
                    if combined_term in combined_fname or term.lower() in path_lower:
                        matches.add(fpath)
                        break
    return matches

def check_index_json(id_val):
    if not os.path.exists('index.json'):
        return False
    try:
        with open('index.json', 'r', encoding='utf-8') as f:
            return f'"{id_val}"' in f.read()
    except Exception:
        return False

# Special cases: features that exist under different filenames
SPECIAL_CASES = {
    'graph-context': ['skills/ai-engineering/graph-augmented-context.md'],
    'figma-bridge': ['skills/frontend/figma-to-code.md'],
    'save-state': ['skills/productivity/save-state.md'],
    'legacy-strangler': ['workflows/strangle-legacy.md'],
    'self-healing-ci': ['skills/devops-infra/heal-ci.md'],
    'telemetry-optin': [],
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

            matches = find_file_matches(id_val, keywords)

            # Remove generic agent files unless the filename contains the exact feature id
            cleaned_id = id_val.replace('-', '')
            has_specific = any(cleaned_id in os.path.basename(m).lower().replace('-', '').replace('_', '') for m in matches)
            if has_specific:
                filtered = set()
                for m in matches:
                    if cleaned_id in os.path.basename(m).lower().replace('-', '').replace('_', ''):
                        filtered.add(m)
                matches = filtered

            # Add special cases
            if id_val in SPECIAL_CASES:
                for special in SPECIAL_CASES[id_val]:
                    if os.path.exists(special):
                        matches.add(special)

            in_index = check_index_json(id_val)
            if in_index:
                matches = set(['index.json']) | matches

            unique_matches = sorted(set(matches))

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
