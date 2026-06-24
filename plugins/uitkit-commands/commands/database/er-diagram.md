---
description: Generate an ER diagram in Mermaid or PlantUML from the project's database schema
argument-hint: "[schema file, table names, or directory]"
---
Generate an entity-relationship diagram for: $ARGUMENTS

If $ARGUMENTS is a file path, read it. If it is a table name or comma-separated list, locate their definitions in migrations, ORM models, or schema files. If it is a directory, scan for all schema definitions within it.

Steps:

1. Extract schema information:
   - Table names and their columns (name, type, nullability, default).
   - Primary keys (single and composite).
   - Foreign keys and the relationships they represent (one-to-one, one-to-many, many-to-many via junction tables).
   - Unique constraints that imply cardinality.

2. Detect diagram format preference:
   - If the project already contains `.mmd`, `mermaid`, or PlantUML files, match that format.
   - Default to Mermaid `erDiagram` syntax (renders in GitHub, Notion, most doc tools).
   - If the user specified PlantUML, use `@startuml` / `@enduml` with entity blocks.

3. Produce the diagram:
   - Include all columns with their types in the entity blocks.
   - Show relationship lines with correct Mermaid cardinality notation:
     - `||--o{` one-to-many
     - `||--||` one-to-one
     - `}o--o{` many-to-many
   - Label each relationship line with the foreign key name or a short semantic label.
   - Group junction/association tables visually distinct if possible via comments.

4. If the schema is large (>15 tables), produce two diagrams:
   - A high-level overview showing only tables and relationships (no column details).
   - A detailed diagram for the subset of tables in $ARGUMENTS or the core domain tables.

5. After the diagram, output:
   - A brief legend explaining any non-obvious abbreviations used in column types.
   - A list of any implied relationships found in the code but not declared as FK constraints.
   - Any junction tables that represent domain concepts worth renaming for clarity.

Output the diagram in a fenced code block with the correct language tag (`mermaid` or `plantuml`).
