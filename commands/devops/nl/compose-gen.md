---
description: Genereer een production-ready docker-compose.yml voor het huidige project
argument-hint: "[servicenaam of stapelbeschrijving]"
---
Genereer een production-ready `docker-compose.yml` voor: $ARGUMENTS

Inspecteer de huidige werkdirectory — lees alle bestaande Dockerfiles, package.json, pyproject.toml, go.mod of soortgelijke manifesten om de stapel af te leiden.

Vereisten:
- Gebruik benoemde volumes, geen bind mounts, voor persistente gegevens
- Stel `restart: unless-stopped` in op alle langlopende services
- Injecteer secrets via omgevingsvariabelen die verwijzen naar een `.env` bestand — hardcode nooit credentials
- Voeg een `healthcheck` blok toe voor elke service die een poort blootgeeft
- Definieer een toegewijd bridge network; gebruik niet het standaard network
- Zet afbeeldingtags vast — gebruik nooit `:latest`
- Voeg een `depends_on` toe met `condition: service_healthy` voor services met opstartverschilligheden
- Scheid `dev` en `prod` profielen waar van toepassing met behulp van de `profiles` sleutel
- Voor databases: stel expliciete `POSTGRES_DB` / `MYSQL_DATABASE` / etc. in en bloot poorten alleen naar localhost (`127.0.0.1:<port>:<port>`)

Output:
1. De volledige `docker-compose.yml`
2. Een `docker-compose.override.yml` met bronkoppeling en debug-poort overschrijvingen voor lokale ontwikkeling
3. Een `.env.example` met een lijst van elke vereiste variabele zonder werkelijke waarden

Na de bestanden een overzicht:
- Elke omgevingsvariabele die de operator moet leveren
- Alle volumes die pre-populatie of init-scripts nodig hebben
- Commando's om de stapel op te starten en de gezondheid te verifiëren:
  ```
  docker compose up -d
  docker compose ps
  docker compose logs --tail=50 <service>
  ```

Als de stapel een reverse proxy bevat (nginx/traefik/caddy), voeg deze toe met TLS-terminatieconfiguratie die structureel correct is maar uitgecommentarieerd.

Genereer geen Dockerfile tenzij expliciet gevraagd — alleen compose.
