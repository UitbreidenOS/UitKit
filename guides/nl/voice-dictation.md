# Spraakinvoer in Claude Code

Met spraakinvoer kunt u prompts spreken in plaats van typen. Het is een eersteklasse functie van de Claude Code CLI — geen invoegtoepassing, geen integratie van derden. De transcriptie wordt uitgevoerd via Anthropic-servers, wat betekent dat het een claude.ai-account vereist en niet alleen met een API-sleutel zal werken.

---

## Vereisten

**Accountvereiste :** Spraakinvoer vereist een claude.ai-account gekoppeld aan uw Claude Code-sessie. Als u alleen met een raw API-sleutel hebt geverifieerd, is sprake niet beschikbaar.

**Platformondersteuning :**

| Platform | Status | Setup |
|---|---|---|
| macOS | Werkt out of the box | Niets nodig |
| Linux | Vereist audiotool | `arecord` (ALSA) of `sox` installeren |
| WSL | Vereist WSLg + audio | `sox libsox-fmt-pulse` installeren; WSLg moet actief zijn |
| SSH-sessie | Niet ondersteund | Alleen lokale terminal gebruiken |
| Webinterface | Niet ondersteund | Alleen CLI |

**Linux-setup :**
```bash
# Debian/Ubuntu — ALSA
sudo apt install alsa-utils

# Debian/Ubuntu — sox (alternatief, ook vereist voor WSL)
sudo apt install sox libsox-fmt-pulse

# Fedora
sudo dnf install sox
```

**WSL-setup :**
```bash
sudo apt install sox libsox-fmt-pulse
# Bevestig dat WSLg actief is — voer uit vanuit PowerShell:
# wsl --update
```

---

## Spraakinvoer inschakelen

Schakel sprake in vanuit elke Claude Code-sessie:

```
/voice
```

Dit schakelt sprake in de standaardmodus in (`hold`). Om modi expliciet in te schakelen:

```
/voice hold   # Spatie ingedrukt houden om op te nemen, loslaten om te verzenden
/voice tap    # Spatie één keer indrukken om op te nemen, opnieuw indrukken om te beëindigen
/voice off    # Sprake uitschakelen
```

**Hold-modus** is de standaard en werkt goed voor het dicteren van prompts van natuurlijke lengte — spatie ingedrukt houden, spreken, loslaten. De prompt wordt onmiddellijk na loslaten verzonden.

**Tap-modus** is beter voor langer dicteren waar u geen sleutel ingedrukt wilt houden. Spatie één keer indrukken om op te nemen, opnieuw indrukken wanneer klaar.

---

## Permanente configuratie

Stel stemvoorkeuren in `~/.claude/settings.json` in zodat deze over sessies heen behouden blijven:

```json
{
  "voice": {
    "enabled": true,
    "mode": "tap"
  }
}
```

Geldige waarden voor `mode`: `"hold"` of `"tap"`. Stel `enabled: false` in om stem standaard uit te schakelen zonder de configuratie te verwijderen.

---

## Push-to-Talk-toets opnieuw instellen

De standaard opnamettoets is Spatie, aangestuurd door `$VOICE_PUSH_TO_TALK_KEY`. Om opnieuw in te stellen, bewerkt u `~/.claude/keybindings.json`:

```json
{
  "Chat": {
    "voice:pushToTalk": "v"
  }
}
```

De binding leeft in de `Chat` context. Elke afzonderlijke toets of toetsencombinatie die door het bindingssysteem wordt ondersteund, werkt hier. Spatie is handig, maar botst met normale tekstinvoer — sommige ontwikkelaars geven de voorkeur aan `v` of `F9` om onbedoelde activeringen te vermijden.

---

## Taalondersteuning

Claude Code-stem ondersteunt 20 talen. Wissel de transcriptietaal over via de `language` sleutel in gebruikersinstellingen:

```json
{
  "voice": {
    "enabled": true,
    "mode": "hold"
  },
  "language": "fr"
}
```

De `language`-instelling is een BCP 47 taaltag. Voorbeelden: `en`, `fr`, `de`, `es`, `nl`, `ja`, `zh`, `pt`, `ko`, `it`. Stel dit in op gebruikersniveau (`~/.claude/settings.json`), niet per project.

---

## Hoe transcriptie werkt

Wanneer u de push-to-talk-toets loslaat (hold-modus) of tikt om te stoppen (tap-modus), wordt het opgenomen audio gestreamed naar Anthropic-transcriptieservers. De geretourneerde tekst wordt exact in het promptinvoerveld geplaatst alsof u het had getypt. U kunt de transcriptie bewerken voordat Claude deze verwerkt — deze wordt niet automatisch ingediend tenzij u dit configureert.

Dit betekent dat stem de normale Claude Code-sessiestroom niet omzeilt. Hooks, machtigingen en gereedschapsgoedkeuringsvragen gedragen zich allemaal identiek aan getypte invoer.

---

## Praktische gebruikspatronen

**Lange refactorverzoeken dicteren :** Schakel over naar tap-modus, tik spatie, beschrijf de volledige refactor in natuurlijke taal ("de databaseverbindingslogica uit `server.ts` in een speciaal `db/connection.ts` module extraheren, alle imports bijwerken, een connection pool toevoegen met max 10 verbindingen"), opnieuw tikken. Controleer de transcriptie, druk op Enter.

**Handsfree beoordeling tijdens het lezen :** Open een bestand op een tweede monitor, lees door de code en dicteer opmerkingen zonder toetsenbordfocus te schakelen. Sprake werkt tijdens actieve Claude-sessies — Claude hoeft niet inactief te zijn.

**Snel herhalen op prompts :** Gebruik hold-modus voor korte vervolgvragen. Houd spatie, zeg "Waarom hebt u deze benadering gekozen?", loslaten. Sneller typen voor korte vragen.

**Met `/btw` voor zijvragen koppelen :** Sprake werkt ook met `/btw`. Houd spatie na het typen van `/btw ` en dicteer de vraag — transcriptie vult in na het opdrachtvoorvoegsel.

---

## Beperkingen

- SSH-sessies kunnen sprake niet gebruiken — microfooninvoer wordt niet via SSH doorgestuurd. Gebruik alleen lokale terminal.
- Alleen API-sleutel authenticatie ontgrendelt stem niet. De functie is beperkt tot claude.ai-accountsessies.
- De webinterface op claude.ai heeft zijn eigen stemfuncties, gescheiden van de CLI — `/voice` is alleen een CLI-opdracht.
- Transcriptie-nauwkeurigheid verslechtert in lawaaierige omgevingen. Audio wordt onverwerkt verzonden; er is geen ruisonderdrukking in de client.
- Spraakinvoer met meerdere sprekers wordt niet ondersteund — het model veronderstelt één spreker.

---
