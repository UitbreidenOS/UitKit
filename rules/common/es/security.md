> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../security.md).

# Reglas de Seguridad

Copia las secciones relevantes en el `CLAUDE.md` de tu proyecto.

---

## Secretos

- Nunca pongas secretos en el código fuente — ni en comentarios, ni en archivos de test, ni en configs de ejemplo
- Nunca registres secretos — verifica que las llamadas al logger no incluyan campos `password`, `token`, `key`, `secret` o `credential`
- Usa variables de entorno para todos los secretos; léelos al inicio, valida que existen
- Rota los secretos que hayan sido accidentalmente comprometidos — trata cualquier secreto comprometido como comprometido

## Validación de entradas

- Valida todas las entradas en los límites del sistema: parámetros de API, query strings, cuerpos de solicitudes, cargas de archivos, variables de entorno
- Valida el tipo, formato, longitud y rango — no solo la presencia
- Usa una lista de permitidos (valores válidos) no una lista de bloqueados (valores bloqueados) donde sea posible
- Nunca uses la entrada del usuario directamente en consultas SQL, comandos de shell, rutas de archivo o HTML sin saneamiento

## Autenticación y autorización

- Verifica la autenticación en cada solicitud que lo requiera — nunca confíes en el enrutamiento del frontend
- Verifica la autorización (el usuario puede hacer ESTA acción) separadamente de la autenticación (el usuario ha iniciado sesión)
- Las verificaciones de autorización deben referenciar al usuario autenticado desde el contexto de la solicitud — nunca desde un parámetro de consulta
- La expiración del token debe ser forzada en el servidor — nunca confíes en las marcas de tiempo de token proporcionadas por el cliente

## Bases de datos

- Usa consultas parametrizadas u ORM — nunca concatenes cadenas SQL
- Los usuarios de la base de datos deben tener los permisos mínimos requeridos — el usuario de la app no debe tener acceso DDL
- Nunca expongas errores internos de la base de datos a los clientes — registra en el servidor, devuelve un error genérico al cliente

## Dependencias

- Fija las versiones de las dependencias — nunca uses `*` o `latest` en producción
- Ejecuta `npm audit` / `pip-audit` / `govulncheck` antes de cada lanzamiento
- Elimina las dependencias no utilizadas — cada dependencia es una superficie de ataque potencial
- Revisa el código fuente de las nuevas dependencias antes de agregarlas

---
