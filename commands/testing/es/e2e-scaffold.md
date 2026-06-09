---
description: Genera pruebas end-to-end para una página, ruta o flujo de usuario
argument-hint: "[page or flow description]"
---
Estás generando pruebas end-to-end para: $ARGUMENTS

Sigue estos pasos:

1. Detecta el framework de E2E en uso verificando los archivos de configuración y dependencias:
   - Playwright: `playwright.config.ts`, `@playwright/test`
   - Cypress: `cypress.config.ts`, `cypress/`
   - Puppeteer: `puppeteer` en package.json
   - Si no se encuentra ninguno, utiliza Playwright por defecto y anota esta suposición.

2. Identifica el objetivo — una página, ruta o flujo de usuario nombrado — basándote en el argumento. Si es ambiguo, deduce la información de la estructura de directorios y archivos de prueba existentes.

3. Lee las pruebas E2E existentes en el proyecto para coincidir con:
   - Convenciones de ubicación de archivos (por ejemplo, `e2e/`, `tests/`, `cypress/e2e/`)
   - Patrones de ayudantes/fixtures ya en uso
   - Configuración de URL base y configuración de autenticación si existen

4. Genera un archivo de prueba que contenga:
   - Al menos un bloque `describe` nombrado según el objetivo
   - Una prueba de caso feliz que cubra la acción principal (cargar, enviar, navegar)
   - Una prueba de error/caso extremo (entrada inválida, 404, estado vacío)
   - Una prueba para cualquier elemento interactivo crítico visible en el objetivo
   - Configuración apropiada de `beforeEach` (navegar a la página, simular autenticación si es necesario)

5. Utiliza los selectores idiomáticos del framework:
   - Playwright/Cypress: prefiere `getByRole`, `getByLabel`, `getByTestId` sobre selectores CSS
   - Puppeteer: utiliza `waitForSelector` con atributos semánticos

6. No simules solicitudes de red a menos que el argumento incluya explícitamente "mock" o el proyecto ya utilice interceptores ampliamente.

7. Añade un comentario `// TODO:` para cualquier aserción que requiera un valor solo conocido en tiempo de ejecución (por ejemplo, IDs dinámicos, marcas de tiempo).

8. Coloca el archivo en el directorio correcto. No crees nuevos directorios a menos que no exista ningún directorio de E2E.

9. Salida:
   - La ruta del archivo creado
   - Una breve lista de lo que cubre cada prueba
   - Cualquier suposición hecha (elección de framework, URL base, autenticación)
