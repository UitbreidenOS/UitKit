---
description: Split an oversized or mixed-concern file into focused modules
argument-hint: "[file]"
---
Split $ARGUMENTS into smaller, single-concern files.

1. Read the entire file. Identify logical clusters of symbols:
   - Group by domain concern (e.g., auth logic, DB queries, HTTP handlers, utility helpers)
   - Group by type (e.g., all types/interfaces together, all constants together) if that is the project's convention
   - Look at existing sibling files in the same directory to match the established split pattern

2. Propose a split plan before making any edits:
   - List each new file name and which symbols it will contain
   - Identify all cross-file dependencies the split will create (imports that did not previously exist)
   - State which file, if any, becomes the re-export barrel (index.ts, __init__.py, mod.rs, etc.)

3. Execute the split:
   - Create each new file with only the symbols assigned to it
   - Add all necessary import statements — both within the new files and from any files that previously imported the original
   - Update the original file to re-export from the new modules if backward compatibility is required; otherwise delete the original
   - Remove any now-redundant imports within the new files

4. Verify that every symbol that was reachable from outside the original file is still reachable at the same import path, or document the path change explicitly.

5. Do not rename symbols, change logic, or reformat code during the split.

6. Output: list of new files created, symbols moved to each, and any import paths that external callers must update.

Constraints:
- Never split into more than 5 files in one pass — if the file warrants more, explain and stop after 5.
- Do not create files smaller than ~20 meaningful lines unless the domain boundary is exceptionally clear.
- Match the new filenames to the project's existing naming convention.
