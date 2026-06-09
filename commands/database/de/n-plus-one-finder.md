---
description: N+1-Abfragemuster in ORM-Code erkennen und Batch-Loading-Fixes erzeugen
argument-hint: "[file path, directory, or route/controller name]"
---
Scannen Sie nach N+1-Abfragemustern in: $ARGUMENTS

Wenn $ARGUMENTS ein Dateipfad ist, lesen Sie ihn. Wenn es sich um ein Verzeichnis handelt, scannen Sie alle relevanten Quelldateien darin. Wenn es sich um einen Controller- oder Route-Namen handelt, suchen Sie die entsprechenden Codedateien.

Erkennungsansatz:

1. Identifizieren Sie das verwendete ORM oder die Abfragebibliothek (ActiveRecord, SQLAlchemy, Django ORM, TypeORM, Prisma, Sequelize, GORM, Hibernate usw.).

2. Scannen Sie nach N+1-Mustern:
   - Schleifen (for, forEach, map, each, .all.map usw.), die ORM-Aufrufe im Schleifenkörper enthalten.
   - Lazy-loaded Zuordnungen, auf die innerhalb einer Schleife zugegriffen wird (z. B. `post.comments` wird pro Post in einer Iteration aufgerufen).
   - Serialisierer oder View-Templates, die Zuordnungslasten pro Datensatz auslösen.
   - `.find()` oder `.get()`-Aufrufe innerhalb von Schleifen, die batchartig sein könnten.
   - Fehlende Eager-Load-Direktiven (includes, eager_load, preload, joinedload, selectinload, with, include).

3. Geben Sie für jeden gefundenen N+1-Fall aus:
   - Dateipfad und Zeilennummern des fehlerhaften Codes.
   - Die Abfrage, die N-mal ausgeführt wird.
   - Die Korrektur: exakter Code, der zeigt, wie die Zuordnung batchartig oder eager-load wird.
   - Die ORM-spezifische Methode (z. B. `includes(:comments)` für ActiveRecord, `options(selectinload(Post.comments))` für SQLAlchemy, `include: { comments: true }` für Prisma).

4. Markieren Sie auch:
   - Fehlende `select`-Felder, die vollständige Zeilenlast verursachen, wenn nur eine Teilmenge benötigt wird.
   - Fehlende `.distinct` auf Zuordnungszahlen, die zu aufgeblasenen Ergebnissen führen.
   - Wiederholte identische Abfragen innerhalb desselben Request-Zyklus, die memoized oder gecacht werden sollten.

5. Wenn die Codebasis Query-Logging oder ein Query-Count-Assertion-Muster hat (z. B. `assert_queries`, `nplusone`-Bibliothek), schlagen Sie vor, Guards hinzuzufügen, um Regressionen zu verhindern.

Geben Sie Erkenntnisse als priorisierte Liste aus – HIGH (in einem heißen Pfad oder Schleife über unbegrenzte Sammlungen), MEDIUM, LOW – mit exaktem Code-Fix für jeden.
