# Entrada de Voz

## Cuándo activar
- El usuario dice que quiere hablar su prompt en lugar de escribirlo
- El usuario pregunta cómo usar voz o dictado en Claude Code
- El usuario pregunta sobre `/voice`, push-to-talk, o modo de voz
- El usuario quiere ir sin manos mientras revisa código en un segundo monitor
- El usuario pregunta cómo reasignar la clave push-to-talk o cambiar el idioma de reconocimiento

## Cuándo NO usar
- El usuario está en una sesión SSH — la entrada de micrófono no se reenvía sobre SSH; la voz no está disponible
- El usuario se autenticó solo con una clave de API raw (sin cuenta claude.ai) — la voz requiere una cuenta claude.ai
- El usuario está trabajando en la interfaz web de Claude — `/voice` es un comando solo CLI
- El usuario está en Linux y no ha confirmado que `arecord` o `sox` estén instalados
- La pregunta del usuario es sobre características de voz de la API Claude — eso es un sistema separado no relacionado con esta habilidad

## Instrucciones

### Habilitar voz

Ejecutar dentro de cualquier sesión de Claude Code:

```
/voice        # activar (predeterminado a modo hold)
/voice hold   # mantener presionada Espacio mientras hablas, soltar para enviar
/voice tap    # pulsar Espacio una vez para comenzar, una vez para detener y enviar
/voice off    # desactivar
```

### Elegir el modo correcto

**Modo hold** — presionar y mantener presionada Espacio mientras hablas, soltar para enviar. Mejor para prompts cortos a medianos. Menos fricción para preguntas rápidas.

**Modo tap** — pulsar Espacio una vez para comenzar a grabar, pulsar nuevamente para detener y enviar. Mejor para dictado más largo donde mantener una clave es incómodo.

### Persistir la configuración

Agregar a `~/.claude/settings.json`:

```json
{
  "voice": {
    "enabled": true,
    "mode": "tap"
  }
}
```

Esto sobrevive reinicios de sesión. Cambiar entre `"hold"` y `"tap"` según sea necesario.

### Reasignar la clave push-to-talk

La clave predeterminada es Espacio. Para cambiarla, editar `~/.claude/keybindings.json`:

```json
{
  "Chat": {
    "voice:pushToTalk": "v"
  }
}
```

Usar cualquier clave que no entre en conflicto con tu mecanografía normal. `v`, `F9` o acento grave son opciones comunes. La asignación se limita al contexto `Chat`.

### Establecer el idioma de transcripción

Agregar una clave `language` al nivel superior de `~/.claude/settings.json`:

```json
{
  "voice": { "enabled": true, "mode": "hold" },
  "language": "es"
}
```

Idiomas soportados: 20 totales, incluyendo `en`, `fr`, `de`, `es`, `nl`, `ja`, `zh`, `pt`, `ko`, `it`. Usar etiquetas BCP 47.

### Configuración Linux / WSL

**Linux (ALSA):**
```bash
sudo apt install alsa-utils
```

**Linux (alternativa sox):**
```bash
sudo apt install sox
```

**WSL:**
```bash
sudo apt install sox libsox-fmt-pulse
# WSLg debe estar activo — actualizar WSL desde PowerShell: wsl --update
```

macOS funciona sin ninguna configuración.

## Ejemplo

**Escenario:** Un desarrollador está refacturizando un módulo grande y quiere dictar una instrucción detallada sin romper su flujo de lectura.

1. Cambiar a modo tap para dictado más largo:
   ```
   /voice tap
   ```

2. Pulsar Espacio para comenzar a grabar, luego dictar:
   > "Dividir la clase `UserController` en tres módulos enfocados: `user-auth.ts` para manejo de login y token, `user-profile.ts` para CRUD en datos de perfil, y `user-preferences.ts` para configuración. Mover las pruebas existentes para coincidir con la nueva estructura. Mantener la interfaz pública existente intacta — nada en `routes/` debería necesitar cambio."

3. Pulsar Espacio nuevamente para detener. Revisar la transcripción en el campo de entrada, hacer correcciones, luego presionar Enter.

**Resultado:** Un prompt preciso de múltiples oraciones entregado sin escribir — y sin perder el enfoque en el código que se lee.

---
