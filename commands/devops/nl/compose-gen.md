---
description: Genereer een productie-klare docker-compose.yml voor het huidige project
argument-hint: "[service-name or stack description]"
---
Genereer een productie-klare `docker-compose.yml` voor: $ARGUMENTS

Inspecteer de huidige werkdirectory — lees alle bestaande Dockerfiles, package.json, pyproject.toml, go.mod of vergelijkbare manifesten om de stack af te leiden.

Vereisten:
- Gebruik benoemde volumes, geen bind mounts, voor persistente gegevens
- Stel `restart: unless-stopped` in op alle langdurig actieve services
- Injecteer geheimen via omgevingsvariabelen die naar een `.env`-bestand verwijzen — codeer nooit credentials in het bestand
- Neem een `healthcheck`-blok op voor elke service die een poort blootstelt
- Definieer een speciaal bridge-netwerk; gebruik niet het standaardnetwerk
- Pin afbeeldingstags — gebruik nooit `:latest`
- Voeg een `depends_on` toe met `condition: service_healthy` voor services met opstartkwaliteiten
- Scheid `dev`- en `prod`-profielen waar van toepassing met behulp van de `profiles`-sleutel
- Voor databases: stel expliciet `POSTGRES_DB` / `MYSQL_DATABASE` / enzovoort in en stel poorten alleen bloot aan localhost (`127.0.0.1:<port>:<port>`)

Uitvoer:
1. De volledige `docker-compose.yml`
2. Een `docker-compose.override.yml` met source-mount- en debug-port-overrides voor lokale ontwikkeling
3. Een `.env.example` met elke vereiste variabele zonder echte waarden

Na de bestanden, geef een lijst van:
- Elke omgevingsvariabele die de operator moet leveren
- Alle volumes die vooraf moeten worden ingevuld of initialisatiescripts nodig hebben
- Opdrachten om de stack omhoog te brengen en de gezondheid te verifiëren:
  ```
  docker compose up -d
  docker compose ps
  docker compose logs --tail=50 <service>
  ```

Als de stack een reverse proxy (nginx/traefik/caddy) heeft, voeg deze toe met TLS-terminatieconfiguratie structureel correct maar als opmerking.

Genereer geen Dockerfile tenzij expliciet gevraagd — alleen compose.
