---
description: Detecteer N+1 query-patronen in ORM-code en produceer batch-loading-oplossingen
argument-hint: "[file path, directory, or route/controller name]"
---
Scan voor N+1 query-patronen in: $ARGUMENTS

Als $ARGUMENTS een bestandspad is, lees het. Als het een directory is, scan alle relevante bronbestanden erin. Als het een controller- of routenaam is, zoek de bijbehorende codebestanden.

Detectiebenadering:

1. Identificeer de ORM of query-bibliotheek in gebruik (ActiveRecord, SQLAlchemy, Django ORM, TypeORM, Prisma, Sequelize, GORM, Hibernate, etc.).

2. Scan op N+1 patronen:
   - Loops (for, forEach, map, each, .all.map, etc.) die ORM-aanroepen in de body van de loop bevatten.
   - Lazy-loaded associaties die zijn geopend in een loop (bv. `post.comments` aangeroepen per bericht in een iteratie).
   - Serializers of view-templates die associatiebelastingen per record activeren.
   - `.find()` of `.get()` aanroepen in loops die kunnen worden gebatcheerd.
   - Ontbrekende eager-load richtlijnen (includes, eager_load, preload, joinedload, selectinload, with, include).

3. Voor elke N+1 die is gevonden, output:
   - Bestandspad en regelnummer(s) van de beledigende code.
   - De query die N keer wordt uitgevoerd.
   - De oplossing: exacte code die aantoont hoe de associatie in batch/eager-load moet worden geladen.
   - De ORM-specifieke methode die moet worden gebruikt (bv. `includes(:comments)` voor ActiveRecord, `options(selectinload(Post.comments))` voor SQLAlchemy, `include: { comments: true }` voor Prisma).

4. Markeer ook:
   - Ontbrekende `select` velden die volledige rij-belastingen veroorzaken wanneer slechts een subset nodig is.
   - Ontbrekende `.distinct` op associatietellingen die opgeblazen resultaten veroorzaken.
   - Herhaalde identieke queries binnen dezelfde requestcyclus die moeten worden gememoiseerd of gecached.

5. Als de codebase query-logging of een query-telling assertion patroon heeft (bv. `assert_queries`, `nplusone` bibliotheek), stel voor om bewakers toe te voegen ter voorkoming van regressies.

Output bevindingen als een geprioriseerde lijst — HIGH (in een hot path of loop over onbegrensde collecties), MEDIUM, LOW — met exacte codeoplossing voor elk.
