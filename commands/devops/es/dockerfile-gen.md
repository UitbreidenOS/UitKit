---
description: Generar un Dockerfile listo para producción para el proyecto actual
argument-hint: "[language/runtime] [optional: base-image]"
---
Analiza el proyecto actual y genera un Dockerfile listo para producción. Usa $ARGUMENTS para deducir el lenguaje/runtime de destino e imagen base opcional.

Pasos:
1. Inspecciona la raíz del proyecto para manifiestos de paquetes (package.json, requirements.txt, go.mod, Cargo.toml, pom.xml, build.gradle, Gemfile, composer.json, etc.) para detectar automáticamente la pila. Si $ARGUMENTS proporciona un lenguaje o runtime, prefiere eso.
2. Identifica el punto de entrada de la aplicación y los pasos de construcción.
3. Elige la imagen base más pequeña apropiada (alpine, distroless, slim) a menos que $ARGUMENTS especifique lo contrario.
4. Aplica construcción multi-etapa si hay un paso de compilación/construcción — separa etapas de constructor y runtime.
5. Establece un USER no-root. Asigna un UID numérico explícito (p. ej., 1001) para compatibilidad con Kubernetes.
6. Copia solo lo que el runtime necesita; excluye dependencias de desarrollo, fixtures de prueba y secretos.
7. Establece WORKDIR, EXPOSE, ENV y ENTRYPOINT/CMD correctamente.
8. Añade una instrucción HEALTHCHECK usando el endpoint de salud probable de la aplicación o una verificación de proceso simple.
9. Fija todas las etiquetas de imagen base a un digest específico o versión — nunca uses `latest`.
10. Añade comentarios en línea solo donde la elección no sea obvia (p. ej., por qué se eligió una imagen base específica o un flag).
11. Genera un archivo `.dockerignore` junto al Dockerfile que excluya: `.git`, `node_modules`, `__pycache__`, directorios de prueba, `.env*`, artefactos de construcción locales.

Después de generar, lista cualquier suposición realizada (p. ej., puerto deducido, punto de entrada asumido) e identifica cualquier paso manual que el desarrollador deba completar (p. ej., inyección de secretos, valores de build-arg).

No añadas ARGs o variables ENV de marcador de posición que no sirvan para nada. No emitas comentarios de marketing o prosa explicativa fuera de los comentarios de código en línea.
