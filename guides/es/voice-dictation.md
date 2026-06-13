# Dictado de Voz en Claude Code

El dictado de voz le permite hablar indicaciones en lugar de escribirlas. Es una función de primera clase de la CLI de Claude Code — no es un complemento, no es una integración de terceros. La transcripción se ejecuta a través de los servidores de Anthropic, lo que significa que requiere una cuenta claude.ai y no funcionará solo con una clave API.

---

## Requisitos previos

**Requisito de cuenta :** El dictado de voz requiere una cuenta claude.ai vinculada a su sesión de Claude Code. Si se autenticó solo con una clave API bruta, la voz no está disponible.

**Compatibilidad de plataforma :**

| Plataforma | Estado | Configuración |
|---|---|---|
| macOS | Funciona de inmediato | Nada necesario |
| Linux | Requiere herramienta de audio | Instalar `arecord` (ALSA) o `sox` |
| WSL | Requiere WSLg + audio | Instalar `sox libsox-fmt-pulse`; WSLg debe estar activo |
| Sesión SSH | No compatible | Usar solo terminal local |
| Interfaz web | No compatible | Solo CLI |

**Configuración de Linux :**
```bash
# Debian/Ubuntu — ALSA
sudo apt install alsa-utils

# Debian/Ubuntu — sox (alternativa, también requerida para WSL)
sudo apt install sox libsox-fmt-pulse

# Fedora
sudo dnf install sox
```

**Configuración de WSL :**
```bash
sudo apt install sox libsox-fmt-pulse
# Confirme que WSLg está activo — ejecute desde PowerShell:
# wsl --update
```

---

## Habilitar el dictado de voz

Cambie la voz desde dentro de cualquier sesión de Claude Code:

```
/voice
```

Esto habilita la voz en el modo predeterminado (`hold`). Para cambiar modos explícitamente:

```
/voice hold   # mantenga Espacio para grabar, suelte para enviar
/voice tap    # toque Espacio una vez para comenzar, toque de nuevo para enviar
/voice off    # deshabilitar la voz
```

**El modo hold** es el predeterminado y funciona bien para dictar indicaciones de longitud natural — presione y mantenga Espacio, hable, suelte cuando haya terminado. La indicación se envía inmediatamente al soltar.

**El modo tap** es mejor para dictado más largo donde no desea sostener una tecla. Toque Espacio una vez para comenzar la grabación, toque de nuevo cuando haya terminado.

---

## Configuración persistente

Establezca las preferencias de voz en `~/.claude/settings.json` para que persistan en las sesiones:

```json
{
  "voice": {
    "enabled": true,
    "mode": "tap"
  }
}
```

Los valores válidos para `mode`: `"hold"` o `"tap"`. Establezca `enabled: false` para deshabilitar la voz de forma predeterminada sin eliminar la configuración.

---

## Rebindear la tecla Push-to-Talk

La tecla de grabación predeterminada es Espacio, controlada por `$VOICE_PUSH_TO_TALK_KEY`. Para rebindear, edite `~/.claude/keybindings.json`:

```json
{
  "Chat": {
    "voice:pushToTalk": "v"
  }
}
```

El enlace vive en el contexto `Chat`. Cualquier tecla única o combinación de teclas compatible con el sistema de enlaces funciona aquí. Espacio es conveniente pero entra en conflicto con la entrada de texto normal — algunos desarrolladores prefieren `v` o `F9` para evitar activaciones accidentales.

---

## Soporte de idiomas

La voz de Claude Code admite 20 idiomas. Cambie el idioma de transcripción a través de la clave `language` en la configuración del usuario:

```json
{
  "voice": {
    "enabled": true,
    "mode": "hold"
  },
  "language": "fr"
}
```

La configuración `language` es una etiqueta de idioma BCP 47. Ejemplos: `en`, `fr`, `de`, `es`, `nl`, `ja`, `zh`, `pt`, `ko`, `it`. Configure esto a nivel de usuario (`~/.claude/settings.json`), no por proyecto.

---

## Cómo funciona la transcripción

Cuando suelta la tecla push-to-talk (modo hold) o toca para detener (modo tap), el audio grabado se transmite a los servidores de transcripción de Anthropic. El texto devuelto se coloca en el campo de entrada de indicación exactamente como si lo hubiera escrito. Puede editar la transcripción antes de que Claude la procese — no se envía automáticamente a menos que la configure para hacerlo.

Esto significa que la voz no evita el flujo normal de sesión de Claude Code. Los hooks, los permisos y las solicitudes de aprobación de herramientas se comportan de forma idéntica a la entrada escrita.

---

## Patrones de uso práctico

**Dictar solicitudes de refactorización largas :** Cambie al modo tap, toque Espacio, describa el refactor completo en lenguaje natural ("Extraiga la lógica de conexión a la base de datos de `server.ts` en un módulo dedicado `db/connection.ts`, actualice todas las importaciones, agregue un pool de conexión con máximo 10 conexiones"), toque de nuevo. Revise la transcripción, presione Intro.

**Revisión sin manos mientras lee :** Abra un archivo en un segundo monitor, lea el código y dicte observaciones sin cambiar el enfoque del teclado. La voz funciona durante las sesiones de Claude activas — Claude no necesita estar inactivo.

**Iteración rápida en indicaciones :** Use el modo hold para preguntas cortas de seguimiento. Mantenga Espacio, diga "¿Por qué eligió ese enfoque?", suelte. Más rápido que escribir para preguntas cortas.

**Empareja con `/btw` para preguntas laterales :** La voz también funciona con `/btw`. Mantenga Espacio después de escribir `/btw ` y dicte la pregunta — la transcripción se completa después del prefijo de comando.

---

## Limitaciones

- Las sesiones SSH no pueden usar voz — la entrada del micrófono no se reenvía a través de SSH. Use solo terminal local.
- La autenticación solo con clave API no desbloquea la voz. La función está limitada a sesiones de cuenta claude.ai.
- La interfaz web en claude.ai tiene sus propias características de voz, separadas de la CLI — `/voice` es solo un comando CLI.
- La precisión de la transcripción se degrada en entornos ruidosos. El audio se envía tal cual; no hay cancelación de ruido en el cliente.
- El dictado de varios hablantes no es compatible — el modelo asume un solo hablante.

---
