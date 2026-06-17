# SQL Optimization

## Wanneer activeren

Gebruiker rapporteert trage query's of vraagt om begeleiding bij query-afstemming.

## Wanneer NIET te gebruiken

Optimaliseer niet voortijdig zonder prestatieprofiling van basislijn.

## Instructies

1. Query-uitvoeringsplan analyseren
2. Ontbrekende indexen of full table scans identificeren
3. Join-volgorde en cardinaliteitsschattingen controleren
4. Herschrijfpatronen aanbevelen

## Voorbeeld

Een query over orders en customers duurt 5 seconden. Analyseer het uitvoeringsplan: volledige scan van orders-tabel (2M rijen), dan join met customers. Bouw een index op orders.customer_id; herstructureer de join om filter-pushdown in te schakelen (WHERE customer.region = 'EU' voordat joining). Query loopt nu in 200 ms.
