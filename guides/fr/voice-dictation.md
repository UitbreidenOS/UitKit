# Dictée Vocale dans Claude Code

La dictée vocale vous permet de parler les invites au lieu de les taper. C'est une fonctionnalité de première classe de la CLI Claude Code — pas un plugin, pas une intégration tierce. La transcription s'exécute via les serveurs d'Anthropic, ce qui signifie qu'elle nécessite un compte claude.ai et ne fonctionnera pas avec une clé API seule.

---

## Prérequis

**Exigence de compte :** La dictée vocale nécessite un compte claude.ai lié à votre session Claude Code. Si vous vous êtes authentifié avec une clé API brute uniquement, la voix est indisponible.

**Support de plateforme :**

| Plateforme | Statut | Setup |
|---|---|---|
| macOS | Fonctionne prêt à l'emploi | Rien nécessaire |
| Linux | Nécessite un outil audio | Installer `arecord` (ALSA) ou `sox` |
| WSL | Nécessite WSLg + audio | Installer `sox libsox-fmt-pulse` ; WSLg doit être actif |
| Sesession SSH | Non supportée | Utiliser terminal local uniquement |
| Interface web | Non supportée | CLI uniquement |

**Setup Linux :**
```bash
# Debian/Ubuntu — ALSA
sudo apt install alsa-utils

# Debian/Ubuntu — sox (alternatif, également requis pour WSL)
sudo apt install sox libsox-fmt-pulse

# Fedora
sudo dnf install sox
```

**Setup WSL :**
```bash
sudo apt install sox libsox-fmt-pulse
# Confirmez que WSLg est actif — exécutez depuis PowerShell :
# wsl --update
```

---

## Activation de la Dictée Vocale

Basculez la voix depuis n'importe quelle session Claude Code :

```
/voice
```

Cela active la voix en mode par défaut (`hold`). Pour basculer les modes explicitement :

```
/voice hold   # maintenez Space pour enregistrer, relâchez pour envoyer
/voice tap    # appuyez sur Space une fois pour démarrer, appuyez à nouveau pour envoyer
/voice off    # désactiver la voix
```

**Mode tenu** est le défaut et fonctionne bien pour dicter les invites de longueur naturelle — appuyez et maintenez Space, parlez, relâchez une fois terminé. L'invite est envoyée immédiatement au relâchement.

**Mode tap** est meilleur pour la dictée plus longue où vous ne voulez pas maintenir une clé. Appuyez sur Space une fois pour commencer l'enregistrement, appuyez à nouveau une fois terminé.

---

## Configuration Persistante

Définissez les préférences de voix dans `~/.claude/settings.json` afin qu'elles persistent entre les sessions :

```json
{
  "voice": {
    "enabled": true,
    "mode": "tap"
  }
}
```

Les valeurs valides pour `mode` : `"hold"` ou `"tap"`. Définissez `enabled: false` pour désactiver la voix par défaut sans supprimer la configuration.

---

## Rebinding la Clé Push-to-Talk

La clé d'enregistrement par défaut est Space, contrôlée par `$VOICE_PUSH_TO_TALK_KEY`. Pour rebind, modifiez `~/.claude/keybindings.json` :

```json
{
  "Chat": {
    "voice:pushToTalk": "v"
  }
}
```

La liaison vit dans le contexte `Chat`. Toute seule clé ou combinaison de clés supportée par le système de liaisons fonctionne ici. Space est pratique mais entre en collision avec l'entrée de texte normale — certains développeurs préfèrent `v` ou `F9` pour éviter les activations accidentelles.

---

## Support des Langues

Claude Code voice supporte 20 langues. Changez la langue de transcription via la clé `language` dans les paramètres utilisateur :

```json
{
  "voice": {
    "enabled": true,
    "mode": "hold"
  },
  "language": "fr"
}
```

Le paramètre `language` est une balise de langue BCP 47. Exemples : `en`, `fr`, `de`, `es`, `nl`, `ja`, `zh`, `pt`, `ko`, `it`. Définissez ceci au niveau de l'utilisateur (`~/.claude/settings.json`), pas par projet.

---

## Comment Fonctionne la Transcription

Quand vous relâchez la clé push-to-talk (mode tenu) ou appuyez pour arrêter (mode tap), l'audio enregistré est transmis en continu aux serveurs de transcription d'Anthropic. Le texte retourné est placé dans le champ d'entrée de l'invite exactement comme si vous l'aviez tappé. Vous pouvez modifier la transcription avant que Claude la traite — elle ne s'auto-soumet pas sauf si vous la configurez ainsi.

Cela signifie que la voix ne contourne pas le flux de session Claude Code normal. Les hooks, les permissions, et les demandes d'approbation d'outils se comportent tous de la même manière qu'avec l'entrée tapée.

---

## Modèles d'Utilisation Pratique

**Dictant les longs demandes de refactorisation :** Basculez au mode tap, appuyez sur Space, décrivez la refactorisation complète en langage naturel (« Extraire la logique de connexion à la base de données de `server.ts` dans un module dédié `db/connection.ts`, mettez à jour tous les imports, ajoutez un pool de connexion avec max 10 connexions »), appuyez à nouveau. Vérifiez la transcription, appuyez sur Entrée.

**Examen sans mains tout en lisant :** Ouvrez un fichier sur un second moniteur, lisez le code, et dictant des observations sans changer le focus du clavier. La voix fonctionne pendant les sessions Claude actives — Claude n'a pas besoin d'être inactif.

**Itération rapide sur les invites :** Utilisez le mode tenu pour les courtes questions de suivi. Maintenez Space, dites « Pourquoi avez-vous choisi cette approche ? », relâchez. Plus rapide que taper pour les courtes questions.

**Appairez avec `/btw` pour les questions latérales :** La voix fonctionne également avec `/btw`. Maintenez Space après avoir tapé `/btw ` et dictating la question — la transcription remplit après le préfixe de commande.

---

## Limitations

- Les sessions SSH ne peuvent pas utiliser la voix — l'entrée microphone n'est pas transférée via SSH. Utilisez un terminal local.
- L'authentification par clé API seule ne déverrouille pas la voix. La fonctionnalité est limitée aux sessions du compte claude.ai.
- L'interface web sur claude.ai a ses propres fonctionnalités vocales, séparées de la CLI — `/voice` est une commande CLI uniquement.
- La précision de la transcription se dégrade dans les environnements bruyants. L'audio est envoyé tel quel ; il n'y a pas de suppression du bruit dans le client.
- La dictée multi-locuteur n'est pas supportée — le modèle suppose un seul locuteur.

---
