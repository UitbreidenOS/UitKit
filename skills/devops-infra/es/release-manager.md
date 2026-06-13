---
name: release-manager
description: "Gestión de versiones: versionamiento semántico, generación de changelog a partir de commits convencionales, listas de verificación de preparación de versiones, procedimientos de revisión, planes de reversión y estrategia de rama de versión"
---

# Habilidad Gestor de Versiones

## Cuándo activar
- Planificación y coordinación de una versión de software
- Generación de changelog a partir del historial de commits
- Determinación del aumento de versión semántica correcto para una versión
- Ejecución de controles de preparación de versiones antes de la implementación
- Gestión de un procedimiento de revisión o versión de emergencia
- Configuración de una estrategia de rama de versión (Git Flow, trunk-based, etc.)

## Cuándo NO usar
- Configuración del pipeline de CI/CD — usar la habilidad cicd
- Configuración de infraestructura de implementación — usar las habilidades docker o kubernetes
- Gestión de incidentes posteriores a la versión — usar el agente incident-commander
- npm publish específicamente — usar el flujo de trabajo npm publish

## Instrucciones

### Versionamiento semántico

```
Determine el aumento de versión para [versión].

Versión actual: [X.Y.Z]
Cambios en esta versión: [describir o pegar lista de commits]

Reglas de versionamiento semántico (semver.org):
MAJOR (X): cambio de ruptura — las integraciones existentes se romperán
  Ejemplos: punto final API eliminado, firma de función cambiada, soporte de versión Node eliminado
  Cuándo: cualquier commit con "BREAKING CHANGE:" en cuerpo, o "!" después de tipo (feat!: ...)

MINOR (Y): nueva funcionalidad, compatible con versiones anteriores
  Ejemplos: nuevo punto final API, nuevo parámetro opcional, nueva función detrás de bandera
  Cuándo: commits con tipo "feat:"

PATCH (Z): corrección de error compatible con versiones anteriores
  Ejemplos: corregir un error, actualizar dependencia (sin ruptura), mejorar mensaje de error
  Cuándo: commits con tipo "fix:", "perf:", "refactor:", "docs:" (sin nuevas funciones)

Tipos de commit convencionales:
- feat: → aumento MINOR
- fix: → aumento PATCH
- feat!: o BREAKING CHANGE: → aumento MAJOR
- chore:, docs:, style:, test:, refactor: → PATCH (o sin aumento, su elección)
- perf: → aumento PATCH

Dados sus cambios: [entrada]
Versión recomendada: [X.Y.Z → A.B.C]
Razonamiento: [qué commits desencadenaron qué aumento]
```

### Generación de changelog

```
Genere changelog para [versión de lanzamiento].

Versión: [X.Y.Z]
Fecha: [AAAA-MM-DD]
Commits desde la última versión: [pegue la salida git log --oneline o describa cambios]

Formato de commit convencional: type(scope): description
Ejemplo: feat(auth): agregar soporte de inicio de sesión OAuth2

Formato de changelog (estándar Keep a Changelog):

## [X.Y.Z] — AAAA-MM-DD

### Cambios de ruptura
- [descripción del cambio de ruptura + ruta de migración]

### Agregado
- [commits feat: → descripción orientada al usuario]
- [commits feat(scope): agrupados por área]

### Modificado
- [cambios en la funcionalidad existente]

### Arreglado
- [commits fix: → qué estaba roto y ahora funciona]

### Seguridad
- [cambios relevantes para la seguridad — vulnerabilidades parcheadas, permisos endurecidos]

### Deprecado
- [funciones que se eliminarán en una versión principal futura]

### Removido
- [funciones removidas — ruptura, va en Cambios de ruptura si la eliminación es la ruptura]

Reglas para buenas entradas de changelog:
- Escriba para usuarios, no para desarrolladores
- "Agregar inicio de sesión OAuth2" no "feat(auth): implement oauth2 handler"
- Incluir pasos de migración para cambios de ruptura
- Agrupar por impacto, no por archivo o sistema

Genere el changelog para mi versión a partir de los commits que proporciono.
```

### Lista de verificación de preparación de versión

```
Ejecute controles de preparación de versión para [versión].

Tipo de versión: [major / minor / patch / hotfix]
Entorno de destino: [staging → prod / directo a prod / canary]
Tiempo de implementación: [programado / guardia en espera / solo horas de oficina]

Lista de verificación previa a la versión:

CALIDAD DE CÓDIGO:
□ Todas las verificaciones de CI aprobadas (pruebas, lint, verificación de tipo, escaneo de seguridad)
□ Revisión de código completada para todos los cambios en esta versión
□ Sin errores P1/P2 abiertos dirigidos a esta versión que no estén corregidos
□ Sin conflictos de fusión sin resolver

TESTING:
□ Pruebas unitarias aprobadas (cobertura ≥ umbral)
□ Pruebas de integración aprobadas
□ Pruebas E2E aprobadas en entorno de staging
□ Prueba de humo manual de recorridos de usuario críticos en staging
□ Rendimiento: sin regresión frente a línea de base (verificar latencia p99)
□ Migraciones de base de datos probadas en una BD de staging de tamaño similar a production

COMUNICACIONES:
□ Notas de versión redactadas y aprobadas
□ Changelog orientado al cliente listo (si los cambios afectan a los usuarios)
□ Equipo de soporte informado sobre cambios
□ Ventas/CS informados si la versión incluye nuevas funciones para demostrar
□ Página de estado: ventana de mantenimiento planificada publicada

IMPLEMENTACIÓN:
□ Runbook de implementación revisado y actualizado
□ Plan de reversión definido y probado
□ Reversión de migración de base de datos confirmada (o migración es solo hacia adelante con razón documentada)
□ Banderas de funcionalidad configuradas para lanzamiento gradual (si aplica)
□ Ingeniero de guardia consciente del cronograma de implementación
□ Paneles de control de monitoreo abiertos: tasa de error, latencia p99, métricas empresariales clave

VALIDACIÓN POST-IMPLEMENTACIÓN (primeros 30 minutos):
□ Punto final de salud devolviendo 200
□ Tasa de error dentro del rango normal
□ Flujos de usuario clave funcionando (prueba de humo)
□ Migración de base de datos completada limpiamente
□ Sin alertas inusuales disparando

FIRMA:
□ Firma del líder de ingeniería
□ Firma del propietario del producto (para versiones menores/mayores)
□ [Opcional] Revisión de seguridad para cambios sensibles a la seguridad

Genere la lista de verificación para mi tipo de versión y modelo de implementación.
```

### Procedimiento de revisión

```
Ejecute una revisión para [incidente/error].

Gravedad del problema: [P1 — producción caída / P2 — degradación importante]
Problema: [describir el error y su impacto]
Versión de producción actual: [X.Y.Z]
Rama de revisión desde: [main / release/X.Y.Z]

Procedimiento de revisión:

PASO 1 — Crear rama de revisión:
git checkout -b hotfix/X.Y.Z+1 main  # Rama desde main (o etiqueta de producción actual)
# Si usa Git Flow: git flow hotfix start X.Y.Z+1

PASO 2 — Aplicar la corrección:
[Realice el cambio mínimo para corregir el problema — sin limpieza oportunista]
[Escriba una prueba que reproduzca el error, luego verifique que la corrección la apruebe]

PASO 3 — Aumento de versión:
Aumente la versión a X.Y.Z+1 (PATCH)
Actualizar CHANGELOG.md con la corrección

PASO 4 — PR y revisión:
PR desde hotfix/X.Y.Z+1 → main
Revisión acelerada: mínimo 1 revisor senior
CI debe aprobar: sin excepciones para revisiones P1 — si CI está roto, arregle CI primero

PASO 5 — Fusionar y etiquetar:
git tag -a vX.Y.Z+1 -m "Hotfix: [description]"
git push origin vX.Y.Z+1

PASO 6 — Implementar:
Seguir runbook de implementación con cronograma acelerado
Mantener paneles de control de monitoreo abiertos durante 30 minutos después de la implementación
Confirme que la corrección resuelve el incidente antes de declarar resuelto

PASO 7 — Retroportar al desarrollo:
git checkout develop
git cherry-pick [SHA del commit de revisión]
# Asegura que la corrección esté en la próxima versión regular

PASO 8 — Incidente posterior:
Actualizar CHANGELOG.md en main y develop
Programar PIR para revisiones P1 (dentro de 48 horas)

Reglas de revisión:
- Corrija SOLO el error reportado — sin otros cambios en la rama de revisión
- La revisión omite el proceso de versión normal pero NO la revisión de código
- La revisión aumenta automáticamente la versión PATCH

Escriba el plan de revisión para mi error específico.
```

### Estrategia de versión

```
Diseñe una estrategia de bifurcación de versión para [equipo].

Tamaño del equipo: [X ingenieros]
Frecuencia de versión: [diaria / semanal / mensual]
Modelo de implementación: [continuo / versiones controladas / ventanas programadas]
Problema actual: [demasiado lento / demasiado riesgoso / sin proceso / conflictos de fusión]

Comparación de estrategias:

DESARROLLO BASADO EN TRONCO (recomendado para la mayoría de equipos):
- Todos los commits a main diariamente
- Versiones etiquetadas desde main en cualquier momento
- Las banderas de funcionalidad ocultan características incompletas
- Mejor para: CI/CD, equipos pequeños, versiones frecuentes
- Pros: simple, rápido, sin ramas de larga duración
- Contras: requiere disciplina + infraestructura de bandera de funcionalidad

GIT FLOW (para versiones programadas):
- main: producción
- develop: rama de integración
- feature/X: características individuales → fusionar con develop
- release/X.Y: preparación de versión → fusionar con main + develop
- hotfix/X: correcciones de emergencia → fusionar con main + develop
- Mejor para: aplicaciones móviles, software on-prem con ciclos de versión
- Contras: complejo, conflictos de fusión, lento

GITHUB FLOW (ligero):
- main: siempre implementable
- feature/X: cualquier trabajo → PR → fusionar con main → implementar
- Mejor para: servicios web que implementan continuamente

Para el perfil de su equipo:
[Recomiendo una estrategia con razonamiento e instrucciones de configuración]

Configure la estrategia recomendada para mi equipo con comandos git y puntos de integración de CI/CD.
```

## Ejemplo

**Usuario:** Estamos a punto de lanzar v2.0.0 de nuestra API de SaaS. Tiene cambios de ruptura (3 puntos finales deprecados eliminados). ¿Cómo comunico esto y ejecuto la versión?

**Plan de versión de Claude:**

**Versión:** 2.0.0 (aumento MAJOR — cambio de ruptura = puntos finales eliminados)

**Entrada del changelog:**
```markdown
## [2.0.0] — 2026-05-20

### Cambios de ruptura
- Puntos finales deprecados eliminados: `GET /api/v1/users/legacy`, `POST /api/v1/auth/old`, `DELETE /api/v1/items/purge`
  → **Migración:** Use `GET /api/v2/users`, `POST /api/v2/auth/login`, `DELETE /api/v2/items` respectivamente.
  → Guía de migración completa: docs.yourapi.com/migration/v1-to-v2

### Agregado
- [otras adiciones]

### Arreglado
- [correcciones de errores]
```

**Secuencia de comunicación:**
1. **4 semanas antes:** Correo electrónico a todos los titulares de claves API — "Cambios de ruptura próximos en v2.0.0 en [fecha]. Se requiere acción."
2. **2 semanas antes:** Segundo recordatorio + enlace de guía de migración
3. **1 semana antes:** Advertencia final + oferta de extensión de 2 semanas para clientes que la soliciten
4. **Día de lanzamiento:** Notas de versión publicadas, nota de página de estado, equipo de soporte informado
5. **Después del lanzamiento:** Supervisar errores 400 en puntos finales eliminados — esperar pico de migradores lentos

**Puertas de preparación de versión para un cambio importante de ruptura:**
- [ ] Todos los clientes que usan puntos finales deprecados notificados ≥4 semanas antes
- [ ] Guía de migración publicada y verificada por precisión
- [ ] Puntos finales v1 mantenidos como 410 Gone (no 404) durante 30 días — ayuda a los clientes a depurar más rápido
- [ ] Plan de reversión: ¿puede reactivar los puntos finales antiguos si la adopción de migración es demasiado baja?

---
