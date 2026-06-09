---
description: Generar un documento de incorporación para desarrolladores en este código base
argument-hint: "[output-file]"
---
Estás escribiendo un documento de incorporación para desarrolladores en este código base. El objetivo es poner a un nuevo ingeniero en productividad lo más rápido posible — sin relleno, sin tono corporativo.

Archivo de salida de destino (si se especifica): $ARGUMENTS

Pasos a completar:

1. Escanea la raíz del repositorio para: README, package.json, pyproject.toml, Makefile, Dockerfile, docker-compose.yml, .env.example, y cualquier archivo de configuración de CI (.github/, .gitlab-ci.yml, etc.).

2. Identifica:
   - Qué hace el proyecto (un párrafo, sin lenguaje de marketing)
   - Lenguaje(s) principal(es) y versiones de tiempo de ejecución
   - Cómo instalar dependencias
   - Cómo ejecutar el proyecto localmente (modo de desarrollo)
   - Cómo ejecutar pruebas
   - Cómo ejecutar linting / verificaciones de tipo
   - Cualquier variable de entorno requerida (de .env.example o documentación)
   - Cualquier servicio externo requerido (bases de datos, colas, APIs)

3. Busca pasos de configuración no obvios: migraciones, scripts de semilla, instalaciones de certificados, túneles locales, mocks de servicio. Inclúyelos explícitamente.

4. Verifica si hay un CONTRIBUTING.md o similar. Si se encuentra, extrae la estrategia de ramificación, el proceso de PR y las expectativas de revisión de código y resúmelo.

5. Identifica los puntos de entrada principales: archivos principales, módulos clave, directorios importantes. Proporciona un mapa breve (3–8 elementos) para que el lector sepa por dónde empezar.

6. Nota cualquier trampa conocida, peculiaridad o cosa que sorprenda a los nuevos desarrolladores (herramientas rotas, pruebas inestables, convenciones inusuales, pasos manuales requeridos).

Escribe el documento en Markdown con las siguientes secciones — incluye solo secciones para las que tengas contenido real:

## Descripción General
## Requisitos Previos
## Instalación
## Ejecución Local
## Ejecución de Pruebas
## Variables de Entorno
## Dependencias Externas
## Mapa del Código Base
## Contribuyendo
## Problemas Conocidos / Trampas

Reglas:
- Escribe para un desarrollador senior que nunca ha visto este proyecto
- Cada comando debe ser copiable y correcto
- No inventes información — si algo no está claro, dilo explícitamente con un marcador TODO
- Sin lenguaje motivacional, sin encuadre de "camino feliz" — solo hechos y comandos
- Mantén cada sección compacta; puntos de viñeta sobre prosa cuando sea apropiado

Si $ARGUMENTS es una ruta de archivo, escribe la salida en ese archivo. De lo contrario, imprime el documento en la conversación.
