#!/usr/bin/env python3
import os
import re
import json

SEARCH_DIRS = ['skills', 'agents', 'hooks', 'rules', 'workflows', 'commands', 'mcp']

STOP_WORDS = {'the', 'a', 'an', 'in', 'on', 'at', 'to', 'and', 'or', 'of', 'for', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'shall', 'it', 'its', 'this', 'that', 'these', 'those'}

def get_keywords(name):
    cleaned = re.sub(r'[^a-zA-Z0-9\s]', ' ', name)
    words = cleaned.lower().split()
    return [w for w in words if w not in STOP_WORDS and len(w) > 2]

def find_file_matches(id_val, keywords):
    """Find files whose paths contain the id or keywords."""
    matches = set()
    terms = [id_val] + keywords
    for term in terms:
        if len(term) < 3:
            continue
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
                    if term in fname_lower or term.replace('-', '') in fname_lower.replace('-', '').replace('_', ''):
                        matches.add(fpath)
    return matches

def content_search_exact(id_val, keywords):
    """Content search only for exact id or long unique keywords."""
    matches = set()
    # Only content-search for exact id OR keywords >= 6 chars (to avoid common word matches)
    search_terms = [id_val]
    for kw in keywords:
        if len(kw) >= 6:
            search_terms.append(kw)

    for term in search_terms:
        for dir_name in SEARCH_DIRS:
            if not os.path.isdir(dir_name):
                continue
            for root, dirs, files in os.walk(dir_name):
                # Skip translated files for content search
                if any('/' + lang + '/' in root for lang in ['de', 'es', 'fr', 'nl']):
                    continue
                for f in files:
                    if f.startswith('.') or not f.endswith(('.md', '.sh', '.json', '.txt')):
                        continue
                    fpath = os.path.join(root, f)
                    try:
                        with open(fpath, 'r', encoding='utf-8', errors='ignore') as fh:
                            content = fh.read()
                            if term.lower() in content.lower():
                                matches.add(fpath)
                    except Exception:
                        pass
    return matches

def check_index_json(id_val):
    if not os.path.exists('index.json'):
        return False
    try:
        with open('index.json', 'r', encoding='utf-8') as f:
            content = f.read()
            # Check for exact id patterns
            patterns = [
                f'"{id_val}"',
                f'"id": "{id_val}"',
            ]
            return any(p in content for p in patterns)
    except Exception:
        return False

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
            matches.update(content_search_exact(id_val, keywords))
            in_index = check_index_json(id_val)

            # Index.json match
            if in_index:
                matches = set(['index.json']) | matches

            # POST-PROCESSING: remove false positive matches that are just generic agent role files
            # if there are more specific matches (filename contains the id)
            specific = [m for m in matches if id_val in os.path.basename(m).lower().replace('-', '').replace('_', '')]
            if specific:
                # Keep only specific matches + index.json
                filtered = set(specific)
                if in_index:
                    filtered.add('index.json')
                matches = filtered

            # Deduplicate and sort
            unique_matches = sorted(set(matches))

            if unique_matches:
                status = 'PRESENT'
            else:
                status = 'MISSING'
                unique_matches = ['none']

            # Limit output
            display = unique_matches[:10]
            out.write(f"{id_val} | {category} | {name} | {status} | {', '.join(display)}\n")

    with open('feature-presence.txt', 'r') as f:
        lines = [l for l in f if l.strip()]
    print(f"Done. Lines in output: {len(lines)}")

if __name__ == '__main__':
    main()
