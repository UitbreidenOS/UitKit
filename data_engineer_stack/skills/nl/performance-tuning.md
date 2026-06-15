# Performance Tuning

## Wanneer activeren

CPU-, geheugen-, schijf-I/O- of netwerkoverhead in gegevenstaak verminderen.

## Wanneer NIET te gebruiken

Niet voor algoritmische correctieproblemen; focus op resource-efficiëntie.

## Instructies

1. Resourcegebruik profileren
2. Knelpunten identificeren (compute, I/O, netwerk)
3. Parallelisatie of batching aanbevelen
4. Verbeteringen valideren

## Voorbeeld

Profiel een Spark-job dat 1 GB RAM en 10 minuten nodig heeft: identificeer dat 8 minuten op schijf-I/O wachten; voeg partitionering toe (4 partities in plaats van 1); cache tussenresultaten in geheugen; runtime daalt naar 3 minuten. Meet ook GC-overhead om geheugen-tuning te valideren.
