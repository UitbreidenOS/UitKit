# REST API-regels

Pas toe bij het bouwen of gebruiken van HTTP/REST-services.

## Requestontwerp

- Accepteer `Content-Type: application/json` standaard; ondersteun `application/x-www-form-urlencoded` alleen waar nodig (OAuth, formulieren)
- Behandel `Accept`-headers correct — retourneer `406` als u het aangevraagde mediatype niet kunt leveren
- Parse en valideer queryparameters strikt; wijs onbekende parameters af met `400` in plaats van deze te negeren
- Gebruik `If-Match` / `ETag` voor optimistische gelijktijdigheid op veranderbare resources
- Ondersteun `Prefer: return=minimal` zodat aanroepers de antwoordtekst kunnen overslaan bij mutaties

## Responsontwerp

- Consistente envelop over alle endpoints — kom overeen met een vorm en wijk nooit af:
  ```json
  { "data": {}, "error": null, "meta": {} }
  ```
- Datum/tijd-velden: ISO 8601 met timezone (`2025-01-15T14:30:00Z`)
- Booleaanse velden: gebruik werkelijk `true`/`false`, nooit `"yes"`/`"no"` of `1`/`0`
- Null versus afwezig: kies één conventie en pas deze overal toe — geef de voorkeur aan het weglaten van optionele ontbrekende velden

## Foutresponses

- Elk foutantwoord bevat: `code` (machine-leesbare string), `message` (leesbaar voor mensen), optioneel `details`
- `code`-waarden zijn stabiel — clients vertakken zich erop; `message` is voor mensen en kan veranderen
- Retourneer nooit `500` voor clientfouten; classificeer de fout correct voordat u antwoordt
- Registreer de volledige fout server-zijdig; retourneer alleen de veilige samenvatting naar de client

## Caching

- Stel `Cache-Control` in op elk `GET`-antwoord — standaard alleen naar `no-store` als u een reden hebt
- Gebruik `ETag` of `Last-Modified` om voorwaardelijke requests in te schakelen
- `Vary`-header moet elke header vermelden die de antwoordvorm beïnvloedt (bijvoorbeeld `Vary: Accept, Accept-Language`)
- Cacheert nooit antwoorden die gebruikersspecifieke gegevens bevatten zonder `private`-richtlijn

## Snelheidsbeperking

- Retourneer `429 Too Many Requests` met `Retry-After`-header
- Expose rate limit-status in antwoordheaders: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Pas striktere limieten toe op auth-endpoints en bulkbewerkingen
- Beperk het aantal verzoeken per geverifieerde identiteit indien mogelijk, alleen als terugvaloptie op IP

## Clientverbruik

- Behandel alle niet-gedocumenteerde velden als instabiel — bouw geen logica erop
- Implementeer exponentiële backoff met jitter voor `429`- en `5xx`-retry's
- Stel expliciete lees- en verbindingstimeouts in op elke HTTP-client — vertrouw nooit op standaardwaarden
- Verifieer TLS-certificaten in alle omgevingen; schakel certificaatvalidatie nooit uit
