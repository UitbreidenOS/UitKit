# Data Warehousing

## Wanneer activeren

Ontwerp van ster-schema's, OLAP-tabellen, partitioneringsstrategieën of kostenoptimalisatie.

## Wanneer NIET te gebruiken

Niet voor OLTP-ontwerp; focus op analytische werklasten.

## Instructies

1. Ontwerp dimensie- en feitentabellen
2. Plan partitionering (datum, regio, klant)
3. Schat opslag en kosten in
4. Documenteer vernieuwingscyclus

## Voorbeeld

Ontwerp een ster-schema voor verkoop: een centrale feitentabel met verkoop-transacties (transactie-ID, klant-ID, product-ID, datum, bedrag) en dimensietabellen voor klanten, producten en datums. Partitioneer op jaarbasis voor snelle query's en voer jaarlijkse archiveringsregels in.
