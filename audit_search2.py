#!/usr/bin/env python3
import os
import re
import json

STOP_WORDS = {'the', 'a', 'an', 'in', 'on', 'at', 'to', 'and', 'or', 'of', 'for', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'shall', 'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs', 'myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'yourselves', 'themselves'}

SEARCH_DIRS = ['skills', 'agents', 'hooks', 'rules', 'workflows', 'commands', 'mcp']

def get_keywords(name):
    """Extract meaningful keywords from feature name."""
    cleaned = re.sub(r'[^a-zA-Z0-9\s]', ' ', name)
    words = cleaned.lower().split()
    keywords = [w for w in words if w not in STOP_WORDS and len(w) > 2]
    return keywords

def search_feature(id_val, keywords):
    """Search directories for matches."""
    matches = set()

    # Also search id itself if it's meaningful
    search_terms = [id_val] + keywords

    for term in search_terms:
        # Skip very short or common terms
        if len(term) <= 2:
            continue
        for dir_name in SEARCH_DIRS:
            if not os.path.isdir(dir_name):
                continue
            # Search file paths
            for root, dirs, files in os.walk(dir_name):
                # Skip language subdirs for path search? No, include all
                for f in files:
                    fpath = os.path.join(root, f)
                    fname, _ = os.path.splitext(f)
                    # Skip DS_Store and hidden
                    if f.startswith('.') or f == 'index.json':
                        continue
                    # Check filename
                    if term in fname.lower() or term.replace('-', '') in fname.lower().replace('-', '').replace('_', ''):
                        matches.add(fpath)
                        continue
                    # Check file content (only for English/non-lang files to avoid false positives)
                    # Heuristic: if dir contains /de/, /es/, /fr/, /nl/ skip content search for broad terms
                    is_lang_file = any('/' + lang + '/' in fpath for lang in ['de', 'es', 'fr', 'nl'])
                    if is_lang_file and len(term) < 6:
                        continue
                    # Content search for more specific terms
                    if len(term) >= 4:
                        try:
                            with open(fpath, 'r', encoding='utf-8', errors='ignore') as fh:
                                content = fh.read()
                                if term in content.lower():
                                    matches.add(fpath)
                        except Exception:
                            pass
    return sorted(matches)

def check_index_json(id_val):
    """Check if id is in index.json."""
    if not os.path.exists('index.json'):
        return False
    try:
        with open('index.json', 'r', encoding='utf-8') as f:
            content = f.read()
            return id_val in content
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
            matches = search_feature(id_val, keywords)

            in_index = check_index_json(id_val)

            if in_index:
                matches = ['index.json'] + matches

            # Deduplicate
            seen = set()
            unique_matches = []
            for m in matches:
                if m not in seen:
                    seen.add(m)
                    unique_matches.append(m)

            if unique_matches:
                status = 'PRESENT'
                # Check if any match is a placeholder (all .md files that are very short)
                total_size = 0
                for m in unique_matches:
                    if os.path.exists(m):
                        try:
                            total_size += os.path.getsize(m)
                        except Exception:
                            pass
                if len(unique_matches) == 1 and total_size < 200:
                    status = 'PARTIAL'
            else:
                status = 'MISSING'
                unique_matches = ['none']

            matches_str = ', '.join(unique_matches[:15])  # Limit to 15
            out.write(f"{id_val} | {category} | {name} | {status} | {matches_str}\n")

    with open('feature-presence.txt', 'r') as f:
        lines = [l for l in f if l.strip()]
    print(f"Done. Lines in output: {len(lines)}")

if __name__ == '__main__':
    main()
