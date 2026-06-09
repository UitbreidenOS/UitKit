---
description: Générer un diagramme ER en Mermaid ou PlantUML à partir du schéma de base de données du projet
argument-hint: "[schema file, table names, or directory]"
---
Générer un diagramme entité-relation pour : $ARGUMENTS

Si $ARGUMENTS est un chemin de fichier, lisez-le. S'il s'agit d'un nom de table ou d'une liste séparée par des virgules, localisez leurs définitions dans les migrations, les modèles ORM ou les fichiers de schéma. S'il s'agit d'un répertoire, analysez toutes les définitions de schéma qu'il contient.

Étapes :

1. Extraire les informations de schéma :
   - Noms des tables et leurs colonnes (nom, type, nullabilité, valeur par défaut).
   - Clés primaires (simples et composées).
   - Clés étrangères et les relations qu'elles représentent (un-à-un, un-à-plusieurs, plusieurs-à-plusieurs via les tables de jonction).
   - Contraintes d'unicité qui impliquent la cardinalité.

2. Détecter la préférence de format de diagramme :
   - Si le projet contient déjà des fichiers `.mmd`, `mermaid` ou PlantUML, correspondez à ce format.
   - Par défaut, utilisez la syntaxe Mermaid `erDiagram` (rendu sur GitHub, Notion, la plupart des outils de documentation).
   - Si l'utilisateur a spécifié PlantUML, utilisez `@startuml` / `@enduml` avec les blocs d'entité.

3. Produire le diagramme :
   - Incluez toutes les colonnes avec leurs types dans les blocs d'entité.
   - Affichez les lignes de relation avec la notation de cardinalité Mermaid correcte :
     - `||--o{` un-à-plusieurs
     - `||--||` un-à-un
     - `}o--o{` plusieurs-à-plusieurs
   - Étiquetez chaque ligne de relation avec le nom de la clé étrangère ou une courte étiquette sémantique.
   - Groupez les tables de jonction/association visuellement distinctes si possible via des commentaires.

4. Si le schéma est volumineux (>15 tables), produisez deux diagrammes :
   - Un aperçu de haut niveau montrant uniquement les tables et les relations (sans détails de colonne).
   - Un diagramme détaillé pour le sous-ensemble de tables dans $ARGUMENTS ou les tables du domaine central.

5. Après le diagramme, produisez :
   - Une brève légende expliquant les abréviations non évidentes utilisées dans les types de colonne.
   - Une liste des relations implicites trouvées dans le code mais non déclarées comme contraintes FK.
   - Toute table de jonction qui représente un concept de domaine qui vaut la peine d'être renommée pour plus de clarté.

Affichez le diagramme dans un bloc de code délimité avec la bonne balise de langue (`mermaid` ou `plantuml`).
