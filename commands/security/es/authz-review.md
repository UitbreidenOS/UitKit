---
description: Revisa la lógica de autorización para escalada de privilegios, control de acceso roto y vulnerabilidades IDOR
argument-hint: "[file or module]"
---
Revisa la implementación de autorización y control de acceso en `$ARGUMENTS` (por defecto: todo el código base) para control de acceso roto, rutas de escalada de privilegios y vulnerabilidades IDOR.

**1. Mapea el modelo de permisos**

Identifica y documenta:
- Mecanismo de autenticación (sesión, JWT, clave API, OAuth)
- Definiciones de roles/permisos — dónde se almacenan y cómo se cargan
- Middleware o decoradores que refuerzan la autorización (por ejemplo, `@require_permission`, guardias `isAdmin`)
- Recursos que están protegidos versus los que no lo están

**2. Verifica el control de acceso roto (OWASP A01)**

- ¿Se aplican las verificaciones de autorización de forma consistente o solo en algunas rutas de código que conducen al mismo recurso?
- ¿Puede un usuario con privilegios bajos alcanzar puntos finales con privilegios más altos manipulando la solicitud (anulación de método, alteración de parámetros, traversal de ruta)?
- ¿Hay rutas solo para administradores que se basan únicamente en una bandera booleana en la entrada controlada por el usuario (por ejemplo, `?admin=true`)?
- ¿Oculta la interfaz elementos de la interfaz de usuario para usuarios no autorizados pero falla al reforzar las mismas reglas del lado del servidor?

**3. Verifica IDOR (Insecure Direct Object Reference)**

- Encuentra cada punto final que acepte un ID suministrado por el usuario (parámetro de ruta, parámetro de consulta, campo de cuerpo) y obtiene un registro.
- Verifica que cada búsqueda incluya una verificación de propiedad o membresía — no solo que el registro exista.
- Marca patrones como: `GET /invoices/:id` donde la consulta es `SELECT * FROM invoices WHERE id = ?` sin `AND user_id = current_user`.

**4. Verifica la escalada de privilegios**

- ¿Puede un usuario regular modificar su propio rol/permisos a través de un punto final de API?
- ¿Hay vulnerabilidades de asignación masiva donde `PATCH /users/:id` acepta un campo `role`?
- ¿Hay un flujo de creación de usuario o invitación donde el llamador puede establecer roles arbitrarios en la nueva cuenta?

**5. Verificaciones específicas de JWT / sesión** (si aplica)

- ¿Se valida el algoritmo del lado del servidor? (ataque `alg: none`, confusión de algoritmo RS256→HS256)
- ¿Se verifican los JWT por expiración, emisor y audiencia en cada ruta protegida?
- ¿Se invalidan los tokens de sesión al cerrar sesión y cambiar contraseña?

**6. Salida**

Para cada hallazgo:
```
[SEVERITY] [file:line] — description
Attack scenario: one sentence explaining how an attacker exploits this
Fix: specific code change or pattern to apply
```

Severity: Critical (direct data breach or account takeover), High (privilege escalation), Medium (info disclosure), Low (defense in depth gap).
