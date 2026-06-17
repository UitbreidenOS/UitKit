# Schema Migration

## Wanneer activeren

Kolommen toevoegen of wijzigen, gegevenstypes veranderen of schemawijzigingen beheren die downstreambrekingen veroorzaken.

## Wanneer NIET te gebruiken

Niet voor eenmalige gegevensreparaties; focus op structurele wijzigingen.

## Instructies

1. Plan een achterwaarts compatibiliteitsvenster
2. Schrijf migratietests
3. Voeg functievlaggen toe voor nieuwe kolommen
4. Documenteer de rollback-procedure

## Voorbeeld

Migreer een orders-tabel door een nieuwe kolom `shipping_address_id` toe te voegen: stel eerst een feature flag in zodat de producer kan schakelen; implementeer achterwaarts compatibiliteit (allow NULL op de nieuwe kolom); test in staging; schakkel geleidelijk in, 10% per dag; stel rollback-procedure in (DROP COLUMN, herstel feature flag).
