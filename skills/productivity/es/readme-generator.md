---
name: readme-generator
description: "Generate complete README.md files: badges, install, usage, API reference, contributing guide, from code or description"
---

> 🇪🇸 Versión en español. [Versión en inglés](../readme-generator.md).

# Habilidad: Generador de README

## Cuándo activar
- Un nuevo proyecto necesita un README escrito desde cero
- El README existente está desactualizado o incompleto
- Se está abriendo un proyecto como open source y se necesita documentación profesional
- Existe un README pero le faltan instrucciones de instalación, ejemplos de uso o referencia de API

## Cuándo NO usar
- Herramientas internas no destinadas al consumo público
- Proyectos con un sitio de documentación existente (Docusaurus, MkDocs, etc.) — el README debería simplemente enlazar allí
- Cuando se necesita documentación de referencia API en profundidad — usar un generador de documentación adecuado (TypeDoc, Sphinx)

## Instrucciones

### Estructura estándar de un README

```markdown
# Nombre del proyecto

> Descripción en una oración de lo que hace el proyecto y para quién es.

[![npm](badge)] [![license](badge)] [![ci](badge)]

## Características (opcional — omitir para herramientas simples)
- Capacidad clave 1
- Capacidad clave 2

## Instalación
\`\`\`bash
# Método de instalación principal
npm install your-package

# o
pip install your-package
\`\`\`

## Inicio rápido
\`\`\`language
// Ejemplo mínimo funcional — listo para copiar y pegar
\`\`\`

## Uso
[Ejemplos más detallados que cubren los casos de uso principales]

## Referencia de API (si es biblioteca/SDK)
### `functionName(param, options)`
Descripción.
**Parámetros:** ...
**Devuelve:** ...
**Ejemplo:** ...

## Configuración
[Tabla de variables de entorno u opciones de configuración]

## Contribuir
[Un párrafo + enlace a CONTRIBUTING.md]

## Licencia
MIT — ver [LICENSE](LICENSE)
```

### Invocación de la habilidad

**Desde cero:**
```
/readme-generator

Project: {nombre}
What it does: {un párrafo}
Tech stack: {lista}
Install method: {npm/pip/brew/binary/etc}
Key commands: {lista}
Target audience: {developers / end-users / both}
```

**Desde código existente:**
```
/readme-generator

Read the codebase and generate a complete README.md.
Focus on: install, quick start, and API reference for exported functions.
```

**Actualizar uno existente:**
```
/readme-generator

Update README.md — the install instructions are outdated (now uses pnpm),
and the API reference is missing the new `createSession()` function.
```

### Generación de badges

Claude sugerirá badges relevantes de shields.io:

```markdown
[![npm version](https://img.shields.io/npm/v/package-name)](https://npmjs.com/package/package-name)
[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)
[![CI](https://github.com/org/repo/actions/workflows/ci.yml/badge.svg)](https://github.com/org/repo/actions)
[![Downloads](https://img.shields.io/npm/dm/package-name)](https://npmjs.com/package/package-name)
```

### Principios de escritura

**Las primeras 3 líneas lo son todo.** GitHub muestra una vista previa — hacer que la descripción y el inicio rápido sean visibles sin desplazarse.

**Ejemplos funcionales sobre descripciones.** Un bloque de código que se ejecuta vale 10 párrafos de prosa.

**La instalación debe estar lista para copiar y pegar.** Cada paso debe funcionar literalmente en una máquina nueva.

**Formato de referencia de API:**
```markdown
### `createUser(email, options?)`

Crea una nueva cuenta de usuario.

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `email` | `string` | Sí | Dirección de correo del usuario |
| `options.role` | `'admin' \| 'user'` | No | Por defecto: `'user'` |

**Devuelve:** `Promise<User>`

\`\`\`typescript
const user = await createUser('alice@example.com', { role: 'admin' })
\`\`\`
```

### Calibrar la profundidad

| Tipo de proyecto | Profundidad del README |
|---|---|
| Herramienta CLI | Instalación + uso + todos los flags/comandos |
| Biblioteca npm | Referencia API completa para cada export |
| SaaS / aplicación web | Características + guía de despliegue + variables de entorno |
| Plantilla de GitHub | Qué reemplazar + cómo personalizar |
| Herramienta interna | Instalación + comandos clave + cómo contribuir |

## Ejemplo

**Entrada:**
```
Project: claudient
What it does: npm package with Claude Code skills, agents, hooks, and workflows
Install: npx claudient add all
Key commands: add, remove, list, search, init
Target audience: developers using Claude Code
```

**Salida esperada:** README completo con descripción principal, badges de npm/licencia/lenguaje, sección de instalación (`npx claudient add all`), tabla de referencia CLI para todos los subcomandos, lista de categorías, sección de contribución, pie de página de licencia MIT.

---
