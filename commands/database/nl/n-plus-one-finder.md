---
description: Detecteer N+1 querypatronen in ORM-code en produceer batch-loading fixes
argument-hint: "[bestandspad, directory of route/controller naam]"
---
Scan op N+1 querypatronen in: $ARGUMENTS

Als $ARGUMENTS een bestandspad is, lees het. Als het een directory is, scan alle relevante bronbestanden daarin. Als het een controller of route naam is, zoek de bijbehorende codebestanden.

Detectiebenadering:

1. Identificeer de ORM of querybibliotheek die in gebruik is (ActiveRecord, SQLAlchemy, Django ORM, TypeORM, Prisma, Sequelize, GORM, Hibernate, enz.).

2. Scan op N+1 patronen:
   - Lussen (for, forEach, map, each, .all.map, enz.) die ORM-aanroepen in de lusstructuur bevatten.
   - Lui geladen associaties die in een lus worden geopend (bijv. `post.comments` aangeroepen per post in een iteratie).
   - Serializers of view templates die per record associaties laden.
   - `.find()` of `.get()` aanroepen in lussen die kunnen worden gebatcherd.
   - Ontbrekende eager-load directives (includes, eager_load, preload, joinedload, selectinload, with, include).

3. Voor elke gevonden N+1, output:
   - Bestandspad en regelnummer(s) van de problematische code.
   - De query die N keer afvuurt.
   - De fix: exacte code die toont hoe de associatie moet worden gebatcherd/eager-geladen.
   - De ORM-specifieke methode om te gebruiken (bijv. `includes(:comments)` voor ActiveRecord, `options(selectinload(Post.comments))` voor SQLAlchemy, `include: { comments: true }` voor Prisma).

4. Markeer ook:
   - Ontbrekende `select` velden die volledige rij-loads veroorzaken wanneer slechts een subset nodig is.
   - Ontbrekend `.distinct` op associatietellingen die verhoogde resultaten veroorzaken.
   - Herhaalde identieke queries binnen dezelfde request-cyclus die moeten worden gememoiseerd of gecached.

5. Als de codebase query logging of een querycount assertion patroon heeft (bijv. `assert_queries`, `nplusone` bibliotheek), suggereer het toevoegen van guards om regressies te voorkomen.

Output bevindingen als een geprioriseerde lijst — HIGH (in een hot path of lus over onbegrensde collecties), MEDIUM, LOW — met exacte codefix voor elk.
