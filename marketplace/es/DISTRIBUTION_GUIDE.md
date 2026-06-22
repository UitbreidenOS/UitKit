# Guía de Distribución de Plugins

Esta guía cubre cómo distribuir plugins de Claudient a través de múltiples canales: registro npm, versiones de GitHub, envío a Marketplace y estrategia de versionado.

## Descripción general

Los plugins de Claudient se pueden distribuir a través de tres canales principales:

1. **Registro npm** — Para instalación programática y gestión de dependencias
2. **Versiones de GitHub** — Para descargas directas y control de versiones
3. **Claudient Marketplace** — Para descubribilidad e integración del ecosistema

Cada canal sirve casos de uso diferentes; la mayoría de los editores utilizan los tres.

---

## Parte 1: Publicación en el registro npm

### Requisitos previos

- Cuenta npm con correo electrónico verificado ([npmjs.com](https://npmjs.com))
- Autenticación de dos factores habilitada (requerida para gestión de paquetes)
- CLI `npm` instalado localmente (`npm --version`)
- Configuración apropiada de `package.json`

### Paso 1: Preparar package.json

Asegúrese de que el `package.json` raíz de su plugin esté correctamente configurado:

```json
{
  "name": "@claudient/plugin-su-nombre-plugin",
  "version": "1.0.0",
  "description": "Descripción de una línea del plugin (máx 80 caracteres)",
  "main": "index.js",
  "files": [
    "skills/",
    "agents/",
    "hooks/",
    "mcp/",
    "workflows/",
    ".claude-plugin/",
    "README.md",
    "CLAUDE.md",
    "LICENSE"
  ],
  "keywords": ["claude-code", "claudient", "plugin", "dominio"],
  "author": {
    "name": "Su Nombre",
    "email": "usted@example.com",
    "url": "https://github.com/yourname"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourname/plugin-repo"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

### Paso 2: Preparar archivos de distribución

Antes de publicar, asegúrese de que estos archivos existan:

```
su-plugin/
├── package.json          (configurado como arriba)
├── README.md            (descripción general + instalación)
├── CLAUDE.md            (principios del plugin)
├── LICENSE              (MIT o compatible)
├── .claude-plugin/      (metadatos)
│   └── plugin.json      (ver Parte 3)
├── .npmignore           (excluir archivos no esenciales)
├── skills/              (sus skills)
├── agents/              (sus agentes)
├── hooks/               (sus hooks)
└── mcp/                 (sus configuraciones MCP)
```

### Paso 3: Crear .npmignore

Excluir archivos innecesarios del paquete npm:

```
.git*
.claude/
.vscode/
node_modules/
*.test.js
*.spec.js
examples/
docs/
audit_*.py
cleanup_*.py
*.sh
.env
.env.local
development.md
```

### Paso 4: Iniciar sesión en npm

```bash
npm login
# Ingrese nombre de usuario, contraseña y OTP cuando se le solicite
```

Verificar autenticación:

```bash
npm whoami
```

### Paso 5: Publicar en npm

Antes de publicar, pruebe localmente:

```bash
# Probar contenido del paquete
npm pack

# Simular instalación
npm install ./su-plugin-1.0.0.tgz

# Verificar instalación
ls node_modules/@claudient/plugin-su-nombre-plugin/
```

Publicar en npm:

```bash
npm publish
```

### Paso 6: Verificar publicación

```bash
# Verificar paquete en npm
npm view @claudient/plugin-su-nombre-plugin

# Probar instalación
npm install @claudient/plugin-su-nombre-plugin
```

---

## Parte 2: Versiones de GitHub y Descargas

### Paso 1: Crear artefactos de versión

Empaquete su plugin para descarga directa:

```bash
# Crear archivo distribuible
mkdir -p dist/
tar -czf dist/plugin-su-nombre-plugin-1.0.0.tar.gz \
  skills/ agents/ hooks/ mcp/ workflows/ \
  README.md CLAUDE.md .claude-plugin/ LICENSE

# Crear suma de verificación
shasum -a 256 dist/plugin-su-nombre-plugin-1.0.0.tar.gz > dist/CHECKSUMS.txt
```

### Paso 2: Preparar notas de versión

Crear `RELEASE_NOTES.md`:

```markdown
# Versión v1.0.0

## Novedades

- Versión inicial con 5 skills principales
- 3 flujos de trabajo de ejemplo
- Documentación completa

## Instalación

### Vía npm
\`\`\`bash
npm install @claudient/plugin-su-nombre-plugin
\`\`\`

### Vía descarga directa
[Descargar plugin-su-nombre-plugin-1.0.0.tar.gz](https://github.com/yourname/plugin-repo/releases/download/v1.0.0/plugin-su-nombre-plugin-1.0.0.tar.gz)

## Cambios importantes

Ninguno.
```

### Paso 3: Crear versión de GitHub

Usando GitHub CLI:

```bash
# Crear versión con estado de borrador
gh release create v1.0.0 \
  --title "Versión v1.0.0" \
  --notes-file RELEASE_NOTES.md \
  --draft

# Cargar artefactos
gh release upload v1.0.0 dist/plugin-su-nombre-plugin-1.0.0.tar.gz
gh release upload v1.0.0 dist/CHECKSUMS.txt

# Publicar versión
gh release edit v1.0.0 --draft=false
```

---

## Parte 3: Envío a Claudient Marketplace

### Paso 1: Preparar metadatos del Marketplace

Crear `.claude-plugin/plugin.json` en la raíz del plugin:

```json
{
  "name": "Nombre de su plugin",
  "id": "su-id-plugin",
  "version": "1.0.0",
  "description": "Descripción de una línea (máx 80 caracteres)",
  "longDescription": "Descripción detallada de 2-3 oraciones.",
  "author": {
    "name": "Su Nombre",
    "email": "usted@example.com",
    "type": "community"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourname/plugin-repo"
  },
  "category": "backend",
  "tags": ["framework", "api"],
  "minClaudeCodeVersion": "1.0.0"
}
```

### Paso 2: Enviar a Marketplace

1. **Fork** el repositorio de Claudient: `github.com/claudients/claudient`
2. **Crear una rama de características:**
   ```bash
   git checkout -b submit/su-nombre-plugin
   ```
3. **Agregar su plugin a `plugins/`:**
   ```
   plugins/su-nombre-plugin/
   ├── .claude-plugin/plugin.json
   ├── README.md
   ├── CLAUDE.md
   └── skills/
   ```
4. **Abrir un PR** con descripción completa
5. **Abordar comentarios de revisión**
6. **Fusionar** — El plugin aparece en Marketplace dentro de 24 horas

---

## Parte 4: Estrategia de Versionado

### Versionado Semántico (SemVer)

Siga estrictamente [semver.org](https://semver.org):

- **MAJOR** (X.0.0) — Cambios importantes
- **MINOR** (0.X.0) — Nuevas características compatibles hacia atrás
- **PATCH** (0.0.X) — Correcciones de errores

### Etiquetas de Git

Etiquetar cada versión:

```bash
git tag -a v1.0.0 -m "Versión de lanzamiento 1.0.0"
git push origin v1.0.0
```

### Mantenimiento del Changelog

Mantener `CHANGELOG.md` en la raíz del proyecto:

```markdown
# Changelog

Todos los cambios notables se documentan en este archivo.

## [1.0.0] - 2026-06-22

### Agregado
- Versión inicial con 5 skills principales

### Corregido
- Bug #45: Análisis de parámetros incorrecto

### Eliminado
- Agent-old (use agent-new en su lugar)
```

---

## Parte 5: Lista de verificación de distribución completa

### Antes del lanzamiento

- [ ] Versión `package.json` actualizada
- [ ] `CHANGELOG.md` actualizado
- [ ] `.claude-plugin/plugin.json` actualizado
- [ ] Todos los skills/agentes tienen archivos README.md
- [ ] Ejemplos probados y funcionales
- [ ] Archivo LICENSE presente (MIT/Apache 2.0/CC-BY-SA-4.0)

### Publicación npm

- [ ] `.npmignore` configurado
- [ ] `npm login` exitoso
- [ ] `npm publish` exitoso
- [ ] `npm view` muestra metadatos del paquete
- [ ] Prueba de instalación exitosa

### Versión de GitHub

- [ ] Etiqueta git creada (`git tag v1.0.0`)
- [ ] Artefactos de versión generados (`.tar.gz`)
- [ ] Sumas de verificación generadas (`CHECKSUMS.txt`)
- [ ] Notas de versión preparadas
- [ ] Versión publicada

### Envío a Marketplace

- [ ] `.claude-plugin/plugin.json` completo
- [ ] README.md amigable con Marketplace
- [ ] Fork del repositorio Claudient creado
- [ ] Plugin agregado al directorio `plugins/`
- [ ] PR abierto con descripción completa
- [ ] PR fusionado

---

**Última actualización:** 22 de junio de 2026  
**Mantenedor:** Equipo principal de Claudient  
**Licencia:** CC-BY-SA-4.0
