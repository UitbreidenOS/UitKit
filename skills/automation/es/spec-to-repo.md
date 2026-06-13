---
name: spec-to-repo
description: "Especificación a repositorio: convertir una especificación de producto, PRD o descripción de característica en un repositorio completo y funcional con código, pruebas, CI e documentación"
---

# Skill Spec to Repo

## Cuándo activar
- Tienes una especificación clara o PRD y quieres que Claude construya la implementación completa
- Iniciar un proyecto greenfield a partir de un resumen de producto
- Convertir un documento de diseño o especificación técnica en código ejecutable
- Construir una prueba de concepto que implemente una interfaz bien definida

## Cuándo NO usar
- Prototipos exploratorios donde la especificación no está clara — descubrir primero, luego especificar
- Sistemas complejos grandes que excedan una sola ventana de contexto
- Cuando quieres aprender construyendo — esto genera todo de una vez

## Instrucciones

### Ingesta de especificación

```
Construir un repositorio a partir de esta especificación.

Especificación: [pegar especificación, PRD o descripción de característica]

Antes de generar código, producir:
1. VERIFICACIÓN DE ENTENDIMIENTO:
   - Resumir qué estás construyendo en 3 puntos de bala
   - Listar cualquier ambigüedad o información faltante
   - Confirmar la pila de tecnología que usarás

2. PLAN DE ARCHIVOS:
   - Listar cada archivo que crearás antes de crear ninguno
   - Esto te da la oportunidad de redirigir antes de que comience

3. ORDEN DE IMPLEMENTACIÓN:
   - ¿Qué construyes primero? (generalmente: esquema → tipos → lógica principal → API → UI → pruebas)

Esperar mi aprobación antes de proceder.
```

### Generación completa de repositorio

```
Generar un repositorio completo para [proyecto].

Especificación: [pegar especificación]
Pila: [especificar o usar predeterminados]

Generar en este orden:
1. Andamiaje de proyecto (package.json, tsconfig, .gitignore, .env.example)
2. Esquema de base de datos (si aplicable)
3. Lógica empresarial principal (servicios, utilidades)
4. Capa API (rutas, controladores, validación)
5. Capa UI (si aplicable)
6. Pruebas (unidad + integración para lógica principal)
7. CI/CD (GitHub Actions)
8. README con instrucciones de configuración

Reglas:
- Cada archivo debe ser completo y ejecutable — sin TODOs, sin marcadores de posición
- Las pruebas deben probar la lógica (no simular todo)
- README debe incluir: instalar, configurar, ejecutar, comandos de prueba
- .env.example debe documentar cada variable requerida
- Todo TypeScript (si Node.js) debe compilarse sin errores
```

### Especificación incremental a código

```
Construir [característica] a partir de esta especificación incrementalmente.

Especificación: [pegar especificación]

Fase 1 — Capa de datos:
Construir: esquema, tipos, migraciones de base de datos
Entregar: directorios migrations/ y types/
Prueba antes de proceder: ejecutar migraciones en BD de prueba

Fase 2 — Lógica empresarial:
Construir: funciones de servicio que implementen la especificación
Entregar: directorio services/
Prueba antes de proceder: pruebas unitarias aprobadas

Fase 3 — Capa API:
Construir: puntos finales de API que expongan los servicios
Entregar: directorio routes/ o app/api/
Prueba antes de proceder: pruebas de integración aprobadas

Fase 4 — Documentación:
Construir: README, documentos de API, .env.example
Entregar: directorio docs/ y README.md actualizado

Completar una fase completamente antes de comenzar la siguiente.
```

### Validación de especificación antes de construir

```
Revisar esta especificación antes de que construya a partir de ella.

Especificación: [pegar]

Verificar:
1. COMPLETITUD: ¿Hay suficiente detalle para construir sin adivinar?
   - ¿Se definen todos los tipos de datos y estructuras?
   - ¿Se especifican todos los casos de error?
   - ¿Son claros todos los requisitos de autenticación/permiso?

2. CONSISTENCIA: ¿La especificación se contradice?
   - ¿Se usan los términos consistentemente?
   - ¿Las entradas/salidas de API se alinean con el modelo de datos?

3. CONSTRUCTIBILIDAD: ¿Es esto viable en una sesión?
   - ¿Cuántos archivos generaría esto? (estimar)
   - ¿Hay dependencias externas que necesiten acceso preconfigurado?

4. PREGUNTAS ABIERTAS: ¿Qué tendría que adivinar?
   - Listar cada suposición que haría sin preguntar

Producir: una lista de brechas para resolver antes de construir.
```

## Ejemplo

**Usuario:** Construirme un servicio acortador de URL desde esta especificación:
- POST /links con {url, customSlug?, expiresAt?} → devuelve {id, shortUrl}
- GET /:slug redirige a URL original (302)
- GET /links/:id devuelve metadatos de enlace
- Los enlaces vencen después de expiresAt si se establece
- Rastrear recuentos de clics

**Plan de archivo de Claude:**

```
Archivos que crearé (en espera de aprobación):

Infraestructura:
- package.json (Express, Drizzle, Neon)
- tsconfig.json
- .env.example

Base de datos:
- db/schema.ts (tabla links: id, slug, originalUrl, expiresAt, clicks, createdAt)
- drizzle.config.ts
- db/migrations/0001_create_links.sql

Lógica empresarial:
- services/links.ts (createLink, getBySlug, getLinkById, incrementClicks)
- lib/slugify.ts (generar slug aleatorio si ninguno proporcionado)
- lib/db.ts (cliente Drizzle)

API:
- app.ts (configuración de Express)
- routes/links.ts (POST /links, GET /links/:id)
- routes/redirect.ts (GET /:slug)
- middleware/validation.ts (esquemas de Zod)

Pruebas:
- tests/links.test.ts (pruebas unitarias para servicios)
- tests/api.test.ts (pruebas de integración para rutas)

Documentación:
- README.md
- .env.example

Total: 14 archivos

¿Procedo?
```

Después de la aprobación, genera los 14 archivos de forma completa y correcta con:
```bash
npm install && npx drizzle-kit migrate && npm test && npm run dev
# All pass on first run
```

---
