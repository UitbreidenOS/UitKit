# MCP: GitHub

Interactie met GitHub rechtstreeks vanuit Claude Code. Lees issues, open PR's, controleer code, zoek in repositories en beheer releases — allemaal zonder de terminal te verlaten of naar een browser te schakelen.

## Waarom je dit nodig hebt

De `gh` CLI dekt de meeste lokale Git-bewerkingen af, maar het API-oppervlak van GitHub is veel groter. Met GitHub MCP:
- Claude kan code doorzoeken in je hele org, niet alleen de huidige repo
- Issue-triage, labelen en opmerkingen gebeuren in dezelfde sessie als je codewijzigingen
- PR-creatie en review maken deel uit van de workflow, niet een aparte browsertaak
- Repositorymetagegevens, commit-geschiedenis en bestandsinhoud van elke branch kunnen worden gequery
- Cross-repo-taken (afhankelijkheidsaudits, org-brede zoekopdrachten) worden eenmalige prompts

## Installatie

```bash
npm install -g @modelcontextprotocol/server-github
```

## Configuratie

Voeg toe aan `~/.claude.json` of project `.claude/mcp.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-github-pat-here"
      }
    }
  }
}
```

## Sleuteltools

- `create_or_update_file` — maak of werk een bestand in een repository bij
- `search_repositories` — zoek GitHub naar repositories op trefwoord of onderwerp
- `create_repository` — maak een nieuwe repository onder je account of organisatie
- `get_file_contents` — lees een bestand van elke branch van elke toegankelijke repo
- `push_files` — push meerdere bestandswijzigingen als één commit
- `create_issue` — open een nieuw issue met titel, body, labels en assignees
- `create_pull_request` — open een PR met titel, body, basis en head-branch
- `fork_repository` — fork een repo naar je account
- `create_branch` — maak een nieuwe branch van een ref
- `list_commits` — haal de commit-geschiedenis op voor een branch of bestandspad
- `list_issues` / `get_issue` — query issues op staat, label, assignee of milestone
- `add_issue_comment` — voeg een opmerking toe aan een issue of PR
- `search_code` — zoek code op GitHub met behulp van codesearch-syntaxis
- `search_issues` — zoek issues en PR's met GitHub's volledige query-syntaxis

## Gebruiksvoorbeelden

```
Lijst alle openstaande issues in deze repo getagd met 'bug', gesorteerd op commentaantal,
en geef me een naar prioriteit gesorteerde samenvatting van wat eerst moet worden opgelost.
```

```
Lees de PR-beschrijving voor #123 en schrijf een gedetailleerde codereview-opmerking
over de authenticatiewijzigingen — focus op beveiliging en edge-cases.
```

```
Zoek alle TODO- en FIXME-opmerkingen in de codebase met behulp van search_code,
maak dan een GitHub-issue voor elk in het TECH-project,
toegewezen aan mij met het label 'tech-debt'.
```

```
Maak een release-branch genaamd release/2.4.0 van main, open dan een PR
terug naar main met het changelog voor alles wat in de afgelopen twee weken is samengevoegd.
```

```
Zoek alle repos in onze org naar package.json-bestanden die afhankelijk zijn van
lodash-versie 4.17.20 of eerder en list de betrokken repositories.
```

## Verificatie

1. Ga naar **GitHub → Instellingen → Ontwikkelaaresinstellingen → Persoonlijke toegangstokens**
2. Kies **Fine-grained tokens** (aanbevolen) of **Tokens (classic)**
3. Selecteer voor klassieke tokens deze scopes: `repo`, `read:org`, `read:user`
4. Voor fine-grained tokens, verleen je **Contents**, **Issues**, **Pull requests** en **Metadata**-machtigingen op de repos die je nodig hebt
5. Kopieer het token en stel het in als `GITHUB_PERSONAL_ACCESS_TOKEN` in het configuratieblok hierboven

## Tips

**Gebruk fine-grained tokens:** Beperk het token tot specifieke repositories in plaats van je hele account. Als het token lekt, is de impact beperkt.

**Tarieflimieten:** De GitHub API staat 5.000 aanvragen per uur toe voor geverifieerde aanvragen. Org-brede codesearches tellen tegen een afzonderlijke zoektarieflimiet (30 aanvragen per minuut) — cache resultaten bij bulkbewerkingen.

**Combineren met lokale git:** GitHub MCP behandelt het externe API-oppervlak; gebruik je lokale `git`-commando's voor staging, committen en pushen. De twee vullen elkaar aan in dezelfde sessie.

**Codesearch-syntaxis:** `search_code` ondersteunt GitHub's volledige query-syntaxis — `language:typescript repo:myorg/myrepo "TODO"` werkt precies zoals in de GitHub-UI. Gebruik het voor gerichte queries in plaats van hele bestanden op te halen.

**PR-body-kwaliteit:** Wanneer je `create_pull_request` gebruikt, geef je Claude het diff en de issuecontext en vraag je het om de PR-body te conceptualiseren. Het resultaat zal nuttiger zijn dan een sjabloongvulde tijdelijke aanduiding.

---
