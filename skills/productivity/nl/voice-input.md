# Voice Input

## Wanneer activeren
- Gebruiker zegt dat ze hun prompt willen spreken in plaats van intypen
- Gebruiker vraagt hoe je stem in Claude Code kunt gebruiken
- Gebruiker vraagt naar `/voice`, push-to-talk of voice mode
- Gebruiker wil hands-free gaan terwijl code op een tweede monitor wordt gecontroleerd
- Gebruiker vraagt hoe je de push-to-talk-sleutel opnieuw kunt binden of de opnametaal kunt wijzigen

## Wanneer NIET gebruiken
- Gebruiker is in een SSH-sessie — microfooninvoer wordt niet over SSH doorgestuurd; stem is niet beschikbaar
- Gebruiker geverifieerd met alleen een raw API-sleutel (geen claude.ai-account) — stem vereist een claude.ai-account
- Gebruiker werkt op de Claude-webinterface — `/voice` is alleen een CLI-opdracht
- Gebruiker is op Linux en heeft niet bevestigd dat `arecord` of `sox` is geïnstalleerd
- Gebruiker's vraag gaat over Claude API voice features — dat is een apart systeem zonder relatie tot deze skill

## Instructies

### Stem inschakelen

Uitvoering binnen elke Claude Code sessie:

```
/voice        # toggle on (defaults to hold mode)
/voice hold   # hold Space to record, release to send
/voice tap    # tap Space once to start, once to stop and send
/voice off    # disable
```

### Kies de juiste modus

**Hold mode** — druk en houd Space ingedrukt terwijl u spreekt, laat los om te verzenden. Beste voor korte-tot-middellange prompts. Minder wrijving voor snelle vragen.

**Tap mode** — tik eenmaal op Space om opname te starten, tik opnieuw om te stoppen en te verzenden. Beste voor langere dictaat waarbij het ingedrukt houden van een toets onhandig is.

### Zet de instelling voort

Voeg toe aan `~/.claude/settings.json`:

```json
{
  "voice": {
    "enabled": true,
    "mode": "tap"
  }
}
```

Dit overleeft sessie restarts. Wissel tussen `"hold"` en `"tap"` naar wens.

### Bind de push-to-talk toets opnieuw

De standaardtoets is Space. Om het te veranderen, bewerk `~/.claude/keybindings.json`:

```json
{
  "Chat": {
    "voice:pushToTalk": "v"
  }
}
```

Gebruik een toets die niet in conflict is met uw normale typen. `v`, `F9` of backtick zijn veelvoorkomende keuzes. De binding is bereikt tot de `Chat`-context.

### Stel de transcriptietaal in

Voeg een `language` sleutel toe op het topniveau van `~/.claude/settings.json`:

```json
{
  "voice": { "enabled": true, "mode": "hold" },
  "language": "fr"
}
```

Ondersteunde talen: 20 totaal, inclusief `en`, `fr`, `de`, `es`, `nl`, `ja`, `zh`, `pt`, `ko`, `it`. Gebruik BCP 47 tags.

### Linux / WSL setup

**Linux (ALSA):**
```bash
sudo apt install alsa-utils
```

**Linux (sox alternative):**
```bash
sudo apt install sox
```

**WSL:**
```bash
sudo apt install sox libsox-fmt-pulse
# WSLg must be active — update WSL from PowerShell: wsl --update
```

macOS werkt zonder enige setup.

## Voorbeeld

**Scenario:** Een ontwikkelaar refactoreert een grote module en wil een gedetailleerde instructie dicteren zonder hun leesstromen te verbreken.

1. Schakel over naar tap mode voor langere dictaat:
   ```
   /voice tap
   ```

2. Tik Space om opname te starten, dicteer dan:
   > "Split the `UserController` class into three focused modules: `user-auth.ts` for login and token handling, `user-profile.ts` for CRUD on profile data, and `user-preferences.ts` for settings. Move the existing tests to match the new structure. Keep the existing public interface intact — nothing in `routes/` should need to change."

3. Tik Space opnieuw om te stoppen. Controleer de transcriptie in het invoerveld, maak eventuele correcties en druk op Enter.

**Resultaat:** Een precieze, multi-zin prompt zonder typen — en zonder focus op de gelezen code te verliezen.

---
