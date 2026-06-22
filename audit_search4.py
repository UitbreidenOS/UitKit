#!/usr/bin/env python3
import os
import re

STOP_WORDS = {'the', 'a', 'an', 'in', 'on', 'at', 'to', 'and', 'or', 'of', 'for', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'shall', 'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they'}

SEARCH_DIRS = ['skills', 'agents', 'hooks', 'rules', 'workflows', 'commands', 'mcp']

def get_keywords(name):
    cleaned = re.sub(r'[^a-zA-Z0-9\s]', ' ', name)
    words = cleaned.lower().split()
    return [w for w in words if w not in STOP_WORDS and len(w) > 2]

def is_translated(path):
    return any('/' + lang + '/' in path for lang in ['de', 'es', 'fr', 'nl'])

def is_generic_agent(path):
    return 'agents/roles/' in path or 'agents/advisors/' in path or 'agents/build-resolvers/' in path or 'agents/specialists/' in path

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
                    combined_term = term.replace('-', '').replace('_', '')
                    combined_fname = fname_lower.replace('-', '').replace('_', '')
                    if combined_term in combined_fname or term in path_lower:
                        matches.add(fpath)
                        break
    return matches

def content_search(id_val, keywords):
    """Content search: skip generic agent roles/advisors and translated files."""
    matches = set()
    # Only search exact id or keywords >= 5 chars to avoid false positives
    search_terms = [id_val]
    for kw in keywords:
        if len(kw) >= 5:
            search_terms.append(kw)

    for dir_name in SEARCH_DIRS:
        if not os.path.isdir(dir_name):
            continue
        for root, dirs, files in os.walk(dir_name):
            # Skip translated and generic agent directories for content search
            if is_translated(root) or is_generic_agent(root):
                continue
            for f in files:
                if f.startswith('.') or not f.endswith(('.md', '.sh', '.json')):
                    continue
                fpath = os.path.join(root, f)
                try:
                    with open(fpath, 'r', encoding='utf-8', errors='ignore') as fh:
                        content = fh.read().lower()
                        for term in search_terms:
                            if term in content:
                                matches.add(fpath)
                                break
                except Exception:
                    pass
    return matches

def check_index_json(id_val):
    if not os.path.exists('index.json'):
        return False
    try:
        with open('index.json', 'r', encoding='utf-8') as f:
            return f'"{id_val}"' in f.read()
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

            # Phase 1: filename/path matching (all dirs)
            matches = find_file_matches(id_val, keywords)

            # Phase 2: content search (excluding generic agents and translations)
            matches.update(content_search(id_val, keywords))

            # Phase 3: index.json
            in_index = check_index_json(id_val)
            if in_index:
                matches = set(['index.json']) | matches

            # Clean up: remove generic agent files UNLESS there's a specific filename match
            # A specific match is when the filename contains the exact id
            has_specific = any(id_val.replace('-', '') in os.path.basename(m).lower().replace('-', '').replace('_', '') for m in matches)
            if has_specific:
                filtered = set()
                for m in matches:
                    if id_val.replace('-', '') in os.path.basename(m).lower().replace('-', '').replace('_', ''):
                        filtered.add(m)
                if in_index:
                    filtered.add('index.json')
                matches = filtered
            else:
                # Remove generic agent files unless they are the ONLY matches
                non_generic = [m for m in matches if not is_generic_agent(m) or m == 'index.json']
                if non_generic:
                    matches = set(non_generic)

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
