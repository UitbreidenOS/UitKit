---
description: Revisar la lógica de autorización para escalada de privilegios, control de acceso roto y vulnerabilidades IDOR
argument-hint: "[archivo o módulo]"
---
Revisar la implementación de autorización y control de acceso en `$ARGUMENTS` (predeterminado: todo el codebase) para control de acceso roto, rutas de escalada de privilegios y vulnerabilidades IDOR.

**1. Mapear el modelo de permisos**

Identificar y documentar:
- Mecanismo de autenticación (sesión, JWT, clave API, OAuth)
- Definiciones de rol/permiso — dónde se almacenan y cómo se cargan
- Middleware o decoradores que aplican authz (p. ej., `@require_permission`, guardias `isAdmin`)
- Recursos que están protegidos versus aquellos que no

**2. Verificar control de acceso roto (OWASP A01)**

- ¿Se aplican verificaciones de autorización consistentemente, o solo en algunos caminos de código que conducen al mismo recurso?
- ¿Puede un usuario con privilegios bajos alcanzar endpoints de privilegios altos manipulando la solicitud (anulación de método, manipulación de parámetros, path traversal)?
- ¿Hay rutas solo de administrador que se basan únicamente en un indicador booleano en entrada controlada por el usuario (p. ej., `?admin=true`)?
- ¿Oculta el frontend elementos de interfaz de usuario para usuarios no autorizados pero falla al aplicar las mismas reglas del lado del servidor?

**3. Verificar IDOR (Insecure Direct Object Reference)**

- Encontrar cada endpoint que acepta una ID suministrada por el usuario (parámetro de ruta, parámetro de consulta, campo de cuerpo) y obtiene un registro.
- Verificar que cada búsqueda incluya una verificación de propiedad o membresía — no solo que el registro exista.
- Marcar patrones como: `GET /invoices/:id` donde la consulta es `SELECT * FROM invoices WHERE id = ?` sin `AND user_id = current_user`.

**4. Verificar escalada de privilegios**

- ¿Puede un usuario regular modificar su propio rol/permisos a través de un endpoint API?
- ¿Hay vulnerabilidades de asignación masiva donde un `PATCH /users/:id` acepta un campo `role`?
- ¿Hay un flujo de creación de usuario o invitación donde la persona que llama puede establecer roles arbitrarios en la nueva cuenta?

**5. Verificaciones específicas de JWT / sesión** (si aplica)

- ¿Se valida el algoritmo del lado del servidor? (ataque `alg: none`, confusión de algoritmo RS256→HS256)
- ¿Se verifican los JWT para vencimiento, emisor y audiencia en cada ruta protegida?
- ¿Se invalidan los tokens de sesión al cerrar sesión y cambiar la contraseña?

**6. Resultado**

Para cada hallazgo:
```
[SEVERITY] [archivo:línea] — descripción
Escenario de ataque: una frase explicando cómo un atacante explota esto
Solución: cambio de código específico o patrón a aplicar
```

Gravedad: Crítica (filtración de datos directa o toma de cuenta), Alta (escalada de privilegios), Media (divulgación de información), Baja (brecha de defensa en profundidad).
