> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../saas-backend.md).

# CLAUDE.md Starter — Backend SaaS

Copia esto en el `CLAUDE.md` de tu proyecto y completa las secciones entre corchetes.

---

```markdown
# [Nombre del Proyecto] — Instrucciones para Claude Code

## Qué es esto
[Un párrafo: qué hace el producto, quién lo usa, qué problema resuelve]

## Stack
- Lenguaje: [TypeScript / Python / Go]
- Framework: [Express / FastAPI / Gin / NestJS]
- Base de datos: [PostgreSQL via Prisma / raw pg / SQLAlchemy]
- Autenticación: [JWT con tokens de acceso de 15 min + tokens de refresco de 7 días / Clerk / Auth0]
- Caché: [Redis]
- Cola: [BullMQ / SQS / Celery]
- Despliegue: [AWS ECS / Fly.io / Railway]

## Estructura del proyecto
src/
├── api/          ← Manejadores de rutas — ligeros, delegan a servicios
├── services/     ← Lógica de negocio — sin preocupaciones HTTP
├── db/           ← Consultas a la base de datos — sin lógica de negocio
├── middleware/   ← Autenticación, limitación de tasa, manejo de errores
├── models/       ← Definiciones de tipos y esquemas
└── utils/        ← Funciones puras, sin efectos secundarios

## Convenciones
- Los manejadores de rutas son ligeros: valida la entrada, llama al servicio, devuelve respuesta
- Los servicios contienen toda la lógica de negocio: no conocen HTTP
- La capa de BD contiene solo consultas: sin lógica de negocio, sin preocupaciones HTTP
- Todo el acceso a la base de datos pasa por la capa db/ — nunca llames al ORM directamente desde los servicios
- Los errores se propagan hacia arriba con contexto — nunca los ignores silenciosamente
- Todas las rutas de API devuelven: 200 (éxito), 201 (creado), 204 (sin contenido), 400 (entrada inválida), 401 (no autenticado), 403 (prohibido), 404 (no encontrado), 409 (conflicto), 422 (validación), 500 (inesperado)

## Decisiones (no re-discutir)
- [Mecanismo de autenticación decidido: JWT, sin sesiones]
- [Elección de ORM: Prisma — sin SQL crudo excepto para consultas de analítica complejas]
- [Formato de error: { error: string, code: string } — nunca cambiar la forma]
- [Sin archivos barrel — importa directamente desde el código fuente]

## Testing
- Las pruebas de integración usan una base de datos de prueba real — sin mocks de BD
- Pruebas unitarias para lógica de negocio pura en services/
- Archivo de prueba: [filename].test.ts junto al archivo fuente
- Ejecutar: npm test

## Comandos
- npm run dev — iniciar servidor de desarrollo con hot reload
- npm test — ejecutar todas las pruebas
- npm run build — build de producción
- npm run lint — verificación de ESLint + Prettier
- npm run db:migrate — ejecutar migraciones pendientes
- npm run db:seed — sembrar datos de desarrollo

## Nunca hacer
- Nunca pongas lógica de negocio en los manejadores de rutas
- Nunca llames a la base de datos directamente desde los manejadores de rutas
- Nunca devuelvas errores brutos de la base de datos a los clientes
- Nunca hagas commit de archivos .env
- Nunca uses el tipo `any` en TypeScript
```

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores. [uitbreiden.com](https://uitbreiden.com/)
