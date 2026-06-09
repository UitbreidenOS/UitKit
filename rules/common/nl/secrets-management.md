# Regels voor Geheimenbeheer

Pas toe wanneer code API-sleutels, wachtwoorden, tokens, certificaten of credentials verwerkt.

## Dit nooit doen

- Nooit geheimen naar versiebeheer committen — niet eens in privérepositories, niet eens tijdelijk
- Nooit geheimen als stringliteralen in broncode hardcoden
- Nooit geheimen opslaan in omgevingsvariabelbestanden (`.env`) die in git zijn gecontroleerd
- Nooit geheimen loggen — niet bij opstarten, niet in debug-uitvoer, niet in foutmeldingen
- Nooit geheimen in URL's of queryparameters verzenden — ze eindigen in toegangslogboeken en browsergeschiedenis

## Waar geheimen zich bevinden

- Gebruik een dedicated geheimenbeheerder in alle productieomgevingen: AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault of Azure Key Vault
- Geheimen tijdens runtime injecteren via omgevingsvariabelen van de geheimenbeheerder — niet via bestanden gebakken in containerafbeeldingen
- Voor lokale ontwikkeling: `.env`-bestanden zijn aanvaardbaar maar moeten in `.gitignore` staan; voorzien een `.env.example` met placeholderwaarden
- CI/CD-pijplijnen: gebruik de geheimopslag van het platform (GitHub Actions-geheimen, GitLab CI-variabelen); nooit in logboeken weergeven

## Rotatie

- Alle geheimen moeten een gedefinieerd rotatiesschema hebben — API-sleutels roteren minstens jaarlijks, databasewachtwoorden minstens driemaandelijks
- Ontwerp services om een nieuw geheim zonder downtime te accepteren: ondersteun dual-credential-vensters tijdens rotatie
- Automatiseer rotatie waar de provider dit ondersteunt; handmatige rotatie is foutgevoelig
- Trek gecompromitteerde credentials onmiddellijk in — voordat u het bereik van het lek onderzoekt

## Toegangsbeheer

- Verleen minimale privileges: een geheim is beperkt tot de service die het nodig heeft, niet gedeeld tussen services
- Gebruik afzonderlijke credentials per omgeving (dev, staging, productie) — nooit productiegeheimen delen
- Controleer wie en wat toegang heeft tot elk geheim; controleer driemaandelijks
- Service-to-service-verificatie: gebruik short-lived tokens (OIDC workload identity, IAM-rollen) in plaats van statische API-sleutels waar mogelijk

## Detectie

- Schakel geheimscanning in CI in (GitHub geheimscanning, GitLeaks, truffleHog) — fail de pijplijn bij een hit
- Scan gitgeschiedenis bij het inschakelen ervan voor een bestaande repo — ga ervan uit dat geheimen die historisch zijn gecommit, gecompromitteerd zijn
- Stel waarschuwingen in voor abnormaal gebruik van productiereferenties (ongebruikelijke oproepvolumes, nieuwe bron-IP's)

## Wanneer een geheim is gelekt

1. Trek de credential onmiddellijk in — wacht niet op onderzoek
2. Controleer de toegangslogboeken voor de levensduur van de credential
3. Roteer alle geheimen die in dezelfde bresvector kunnen zijn blootgesteld
4. Verwijder het geheim uit gitgeschiedenis met `git filter-repo`; force-push; notificeer alle vorken
