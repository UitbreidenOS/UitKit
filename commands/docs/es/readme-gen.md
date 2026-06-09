---
description: Genera un archivo README.md completo para el proyecto actual
argument-hint: "[output-path]"
---
Analiza este proyecto y genera un README.md de calidad para producción.

Pasos:
1. Escanea la estructura del repositorio: lee package.json / pyproject.toml / Cargo.toml / go.mod o su equivalente para determinar el lenguaje, marco de trabajo y dependencias.
2. Identifica el punto o puntos de entrada, el sistema de compilación y el ejecutor de pruebas.
3. Lee cualquier archivo README, CONTRIBUTING y docs/ existente para obtener contexto — no duplices, mejora.
4. Inspecciona la configuración de CI (.github/workflows/, .gitlab-ci.yml, etc.) para obtener insignias y nombres de flujos de trabajo.

Escribe el README con estas secciones (incluye solo las secciones que sean relevantes — omite las vacías):

- **Nombre del proyecto + lema de una frase** — comienza con el valor, no la pila tecnológica.
- **Insignias** — estado de compilación, cobertura, licencia, versión (usa URLs reales de shield si CI existe).
- **Descripción general** — 2–4 frases: qué problema resuelve, para quién es, qué lo hace distinto.
- **Requisitos** — versiones mínimas de tiempo de ejecución/compilador, restricciones de SO.
- **Instalación** — comandos exactos, copiables. Cubre todos los administradores de paquetes soportados si es aplicable.
- **Inicio rápido** — el código o comando mínimo para obtener un resultado funcional en menos de 2 minutos.
- **Uso** — banderas CLI clave, superficie API u opciones de configuración. Usa ejemplos reales del código base.
- **Configuración** — variables de entorno, formato de archivo de configuración, valores por defecto. Referencia nombres de variables reales encontradas en el código.
- **Arquitectura** (si no es trivial) — un párrafo corto o diagrama ASCII mostrando los componentes principales.
- **Desarrollo** — cómo clonar, instalar dependencias de desarrollo, ejecutar pruebas, linting y compilación.
- **Contribución** — enlace a CONTRIBUTING.md si existe; de lo contrario, escribe dos frases.
- **Licencia** — nombre de licencia y enlace al archivo LICENSE.

Restricciones:
- Todo bloque de código debe especificar su cerca de lenguaje.
- No inventes características o APIs — solo documenta lo que existe en el código base.
- Escribe para un desarrollador que nunca ha visto este proyecto.
- Usa encabezados ATX (##), no estilo subrayado.
- Mantén el tono directo y neutral — sin lenguaje de marketing.

Ruta de salida: $ARGUMENTS (valor por defecto: README.md en la raíz del repositorio).
Escribe el archivo. No imprimas el contenido en la terminal — solo confirma la ruta escrita.
