---
name: voice-input
description: "Entrée vocale : dicter vos prompts au lieu de les taper avec reconnaissance vocale push-to-talk dans Claude Code"
---

# Voice Input

## Quand activer
- L'utilisateur veut parler sa invite plutôt que la taper
- L'utilisateur demande comment utiliser la voix ou la dictée dans Claude Code
- L'utilisateur demande `/voice`, push-to-talk ou le mode voix
- L'utilisateur veut se libérer les mains en examinant le code sur un deuxième moniteur
- L'utilisateur demande comment rebinder la clé push-to-talk ou changer la langue de reconnaissance

## Quand ne PAS utiliser
- L'utilisateur est dans une session SSH — l'entrée de microphone n'est pas transférée sur SSH ; la voix n'est pas disponible
- L'utilisateur authentifié avec seulement une clé API brute (pas de compte claude.ai) — la voix nécessite un compte claude.ai
- L'utilisateur travaille dans l'interface Web Claude — `/voice` est une commande CLI uniquement
- L'utilisateur est sur Linux et n'a pas confirmé que `arecord` ou `sox` est installé
- La question de l'utilisateur concerne les fonctionnalités vocales de l'API Claude — c'est un système séparé non lié à cette compétence

## Instructions

### Activer la voix

Exécuter à l'intérieur de toute session Claude Code :

```
/voice        # basculer sur (par défaut mode hold)
/voice hold   # tenir l'espace pour enregistrer, relâcher pour envoyer
/voice tap    # taper l'espace une fois pour commencer, une fois pour arrêter et envoyer
/voice off    # désactiver
```

### Choisir le bon mode

**Mode hold** — appuyer et tenir l'espace en parlant, relâcher pour envoyer. Meilleur pour les invites courtes à moyennes. Moins de friction pour les questions rapides.

**Mode tap** — taper l'espace une fois pour commencer l'enregistrement, une fois pour arrêter et envoyer. Meilleur pour la plus longue dictée où tenir une clé est maladroit.

### Persister le paramètre

Ajouter à `~/.claude/settings.json`:

```json
{
  "voice": {
    "enabled": true,
    "mode": "tap"
  }
}
```

Ceci survit aux redémarrages de session. Passer entre `"hold"` et `"tap"` au besoin.

### Rebinder la clé push-to-talk

La clé par défaut est Espace. Pour la changer, éditer `~/.claude/keybindings.json`:

```json
{
  "Chat": {
    "voice:pushToTalk": "v"
  }
}
```

Utiliser n'importe quelle clé qui ne rentre pas en conflit avec votre dactylographie normale. `v`, `F9` ou le backtick sont des choix courants. La liaison est limitée au contexte `Chat`.

### Définir la langue de transcription

Ajouter une clé `language` au niveau supérieur de `~/.claude/settings.json`:

```json
{
  "voice": { "enabled": true, "mode": "hold" },
  "language": "fr"
}
```

Langues supportées : 20 total, y compris `en`, `fr`, `de`, `es`, `nl`, `ja`, `zh`, `pt`, `ko`, `it`. Utiliser les balises BCP 47.

### Configuration Linux / WSL

**Linux (ALSA):**
```bash
sudo apt install alsa-utils
```

**Linux (alternative sox):**
```bash
sudo apt install sox
```

**WSL:**
```bash
sudo apt install sox libsox-fmt-pulse
# WSLg doit être actif — mettre à jour WSL depuis PowerShell: wsl --update
```

macOS fonctionne sans aucune configuration.

## Exemple

**Scénario:** Un développeur refactorise un grand module et veut dicter une instruction détaillée sans briser son flux de lecture.

1. Passer au mode tap pour une dictée plus longue :
   ```
   /voice tap
   ```

2. Taper l'espace pour commencer l'enregistrement, puis dicter :
   > « Diviser la classe `UserController` en trois modules focalisés : `user-auth.ts` pour la connexion et la gestion des tokens, `user-profile.ts` pour CRUD sur les données de profil, et `user-preferences.ts` pour les paramètres. Déplacer les tests existants pour correspondre à la nouvelle structure. Garder l'interface publique existante intacte — rien dans `routes/` ne devrait avoir besoin de changer. »

3. Taper l'espace à nouveau pour arrêter. Examiner la transcription dans le champ d'entrée, faire les corrections nécessaires, puis appuyer sur Entrée.

**Résultat:** Une invite précise et multi-phrase livrée sans taper — et sans perdre la concentration sur le code lu.

---
