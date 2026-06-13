---
description: N+1-Abfragemuster in ORM-Code erkennen und Batch-Loading-Fixes produzieren
argument-hint: "[file path, directory, or route/controller name]"
---
Nach N+1-Abfragemustern suchen in: $ARGUMENTS

Wenn $ARGUMENTS ein Dateipfad ist, lesen Sie ihn. Wenn es ein Verzeichnis ist, scannen Sie alle relevanten Quelldateien darin. Wenn es ein Controller- oder Route-Name ist, lokalisieren Sie die entsprechenden Code-Dateien.

Erkennungsmethode:

1. Das verwendete ORM oder die Abfragebibliothek identifizieren (ActiveRecord, SQLAlchemy, Django ORM, TypeORM, Prisma, Sequelize, GORM, Hibernate, usw.).

2. Nach N+1-Mustern scannen:
   - Schleifen (for, forEach, map, each, .all.map, etc.), die ORM-Aufrufe im Schleifentext enthalten.
   - Lazy-Load-Zuordnungen, die innerhalb einer Schleife aufgerufen werden (z.B. `post.comments` aufgerufen pro Post in einer Iteration).
   - Serialisierer oder View-Templates, die Zuordnungs-Loads pro Datensatz auslösen.
   - `.find()`- oder `.get()`-Aufrufe innerhalb von Schleifen, die bündeln könnten.
   - Fehlende Eager-Load-Direktiven (includes, eager_load, preload, joinedload, selectinload, with, include).

3. Für jeden N+1-Fund ausgeben:
   - Dateipfad und Zeilennummer(n) des fehlerhaften Codes.
   - Die Abfrage, die N-mal ausgeführt wird.
   - Die Lösung: exakter Code zeigt, wie man die Zuordnung bündelt/eager-ladet.
   - Die ORM-spezifische Methode zur Verwendung (z.B. `includes(:comments)` für ActiveRecord, `options(selectinload(Post.comments))` für SQLAlchemy, `include: { comments: true }` für Prisma).

4. Auch kennzeichnen:
   - Fehlende `select`-Felder, die Vollzeilenladungen verursachen, wenn nur eine Teilmenge benötigt wird.
   - Fehlende `.distinct` bei Zuordnungszählern, die aufgeblasene Ergebnisse verursachen.
   - Wiederholte identische Abfragen innerhalb des gleichen Request-Zyklus, die memoized oder gecacht werden sollten.

5. Wenn die Codebasis Abfrage-Logging oder ein Query-Count-Assertion-Muster aufweist (z.B. `assert_queries`, `nplusone`-Bibliothek), schlagen Sie vor, Guards hinzuzufügen, um Regressions zu verhindern.

Ausgaben von Erkenntnissen als priorisierte Liste — HIGH (in einem Hot Path oder Schleife über unbegrenzte Sammlungen), MEDIUM, LOW — mit exaktem Code-Fix für jeden.
