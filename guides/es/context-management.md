# Guía de gestión de contexto

Cómo administrar la ventana de contexto de Claude Code de manera efectiva — mantener sesiones enfocadas, prevenir la hinchazón de contexto y mantener la calidad en largas sesiones de trabajo.

## Comprender la ventana de contexto

Claude Code tiene una ventana de contexto finita. A medida que trabaja, la conversación crece:
- Cada llamada de herramienta y su resultado se agregan al contexto
- Cada lectura de archivo se agrega al contexto
- Cada edición de código se rastrea en el contexto
- Las conversaciones largas eventualmente alcanzan límites y se resumen automáticamente

**Señales de que estás alcanzando los límites de contexto:**
- Claude comienza a olvidar decisiones anteriores
- Las respuestas se vuelven menos específicas para su proyecto
- La compresión automática se activa (resume el contexto anterior)
- Claude pide información que ya tiene

## Mantener sesiones enfocadas

**Una sesión = una tarea.** No use la misma sesión de Claude Code para múltiples tareas no relacionadas.

```bash
# Incorrecto: una sesión para todo
claude
# (construye característica, luego corrige error no relacionado, luego escribe documentos, luego revisa PR)

# Correcto: sesiones separadas por tarea
claude "implementar autenticación de usuario"  # Sesión 1
claude "corregir el error de tiempo de espera de pago"    # Sesión 2
claude "escribir documentación de API"        # Sesión 3
```

**Por qué:** El contexto de la tarea 1 contamina la tarea 3. Claude Code funciona mejor cuando el contexto es relevante.

## Precarga de contexto eficientemente

En lugar de hacer que Claude descubra su codebase mediante lecturas:

```bash
# Agregar archivo CLAUDE.md a su proyecto
# Claude lo lee al iniciar la sesión — se convierte en su contexto persistente
cat CLAUDE.md
```

Un buen `CLAUDE.md` contiene:
- Descripción del proyecto (2-3 oraciones)
- Directorios clave y qué contienen
- Convenciones importantes (denominación, patrones, decisiones)
- Cosas que NO se deben modificar sin preguntar
- Comandos comunes (cómo ejecutar pruebas, construir, etc.)

Esto reemplaza docenas de lecturas de archivo exploratorio con una carga de contexto estructurada.

## Use el comando `/compact`

Cuando una sesión se hace larga:
```
/compact
```

Esto resume la conversación anterior en una representación más corta, liberando espacio en la ventana de contexto sin perder las decisiones clave y el contexto.

**Use compact cuando:**
- Ha completado una subtarea importante en una sesión más larga
- El contexto se siente hinchado con exploración que ya no es relevante
- Está a punto de iniciar una nueva fase de trabajo en la misma sesión

## Lectura estratégica de archivos

Claude lee archivos en contexto — sea selectivo:

```
# Demasiado amplio:
"Leer todos los archivos en el módulo de autenticación"

# Mejor:
"Leer src/auth/jwt.ts y src/middleware/auth.ts — quiero comprender la implementación de JWT"
```

Pida a Claude que resuma archivos en lugar de leerlos cuando necesite comprensión:
```
"Sin leer el archivo, basado en su nombre y las importaciones que puede ver, ¿qué hace probablemente src/services/email.ts?"
```

## Worktrees para aislamiento a largo plazo

Para tareas que se extienden durante días, use worktrees de git:
```bash
git worktree add ../project-feature feature/my-feature
cd ../project-feature
claude "trabajar en la característica de autenticación de usuario"
```

Cada worktree = su propia sesión de Claude Code con su propio contexto limpio.

## La habilidad `/lean-claude`

Cargue `/lean-claude` al principio de cualquier sesión para activar el modo eficiente en tokens:
- Respuestas más cortas y precisas
- Menos información repetida
- Respuestas directas sin preámbulo

```bash
npx claudient add skills productivity
# Luego en Claude Code:
/lean-claude
```

## Recuperación de una sesión obsoleta

Si Claude pierde el seguimiento del contexto anterior:

1. **Reinicie con solicitud de resumen:**
   ```
   "Déjame actualizarte sobre lo que hemos estado haciendo. [Resumen de decisiones clave, estado actual, siguiente]"
   ```

2. **Use `/compact`** para condensar y refocalizar

3. **Comience de nuevo con contexto precargado:**
   ```bash
   # Finalizar sesión, iniciar una nueva
   claude "Sigo trabajando en [característica]. Aquí está el contexto: [resumen breve]. El estado actual es [describir]. El siguiente paso es [tarea específica]."
   ```

## Estrategias de contexto de múltiples archivos

Cuando trabaja en muchos archivos:

```
# En lugar de: "leer los 15 archivos de este módulo"
# Haga: "Voy a trabajar en el módulo de pagos. Los archivos clave son payments.service.ts (maneja lógica de carga), payments.controller.ts (rutas) y payments.dto.ts (tipos). Lea solo esos tres primero."
```

Luego lea archivos adicionales solo según sea necesario, no especulativamente.

## Conciencia del costo de token

Contexto más largo = costo más alto por solicitud. Estrategias para reducir costos:
- Use `/lean-claude` para el modo eficiente en tokens
- Divida tareas grandes en múltiples sesiones enfocadas
- Evite releer archivos que no han cambiado
- Use `CLAUDE.md` para precarga de contexto estable económicamente

---
