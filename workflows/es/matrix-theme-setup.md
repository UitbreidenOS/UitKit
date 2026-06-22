# Flujo de trabajo de configuración del tema Matrix

Proceso de punta a punta para instalar y personalizar el tema Matrix en todo el equipo — desde la configuración inicial hasta la estandarización y el mantenimiento continuo.

---

## Cuándo usar este flujo de trabajo

Utilice este flujo de trabajo cuando:
- Incorporar un nuevo equipo al tema Matrix
- Estandarizar la configuración del tema en múltiples desarrolladores o máquinas
- Implementar el tema Matrix en entornos CI/CD
- Establecer directrices de personalización de temas para la organización
- Migrar desde otros temas a Matrix

---

## Fase 1: Planificación y Requisitos Previos (Día 1)

**Definir el alcance del tema:**
- [ ] Identificar qué aplicaciones/proyectos utilizarán el tema Matrix
- [ ] Determinar si es un estándar de todo el equipo o específico del proyecto
- [ ] Documentar cualquier personalización de marca o invalidación de color necesaria
- [ ] Enumerar todos los entornos (desarrollo local, staging, producción)
- [ ] Identificar miembros del equipo que necesitan acceso a la configuración del tema

**Requisitos técnicos:**
- [ ] Verificar compatibilidad de versión de Node.js (14+ recomendado)
- [ ] Confirmar que la versión npm/yarn/pnpm admite su proyecto
- [ ] Verificar frameworks de tema o estilo existentes para migrar
- [ ] Revisar el pipeline de construcción del proyecto (config webpack, Vite, esbuild)
- [ ] Documentar puntos de integración de CSS-in-JS o bibliotecas de estilo

**Comunicación del equipo:**
- [ ] Programar una sesión informativa del equipo de 15 minutos sobre la adopción del tema Matrix
- [ ] Crear un documento compartido para rastrear personalizaciones y decisiones
- [ ] Asignar propietario del tema (persona responsable del mantenimiento y actualizaciones)

---

## Fase 2: Instalación y Configuración (Días 2-3)

**Instalar el paquete del tema Matrix:**

```bash
# Usando npm
npm install @matrix/theme

# Usando yarn
yarn add @matrix/theme

# Usando pnpm
pnpm add @matrix/theme
```

**Verificar instalación:**
```bash
npm list @matrix/theme
# Debe mostrar versión instalada, sin errores
```

**Agregar al punto de entrada del proyecto (ej. `index.js`, `App.tsx`):**
```javascript
import '@matrix/theme'
// o solo para variables CSS:
import '@matrix/theme/css-variables'
```

**Configurar pipeline de construcción:**

Si usa Webpack:
```javascript
module: {
  rules: [
    {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        'postcss-loader'
      ]
    }
  ]
}
```

Si usa Vite:
```javascript
export default {
  css: {
    preprocessorOptions: {
      css: {
        // El CSS del tema Matrix se cargará automáticamente
      }
    }
  }
}
```

**Probar integración básica:**
```bash
npm run dev
# Verificar DevTools del navegador → pestaña Elements
# Verificar clases de tema Matrix presentes: .matrix-*, --matrix-*
```

Crear un componente de prueba para confirmar que el tema está activo:
```jsx
export function ThemeTest() {
  return (
    <div className="matrix-container">
      <h1 className="matrix-heading">Tema Matrix Activo</h1>
      <p className="matrix-text">Si este texto aparece con estilo, la integración es exitosa.</p>
    </div>
  )
}
```

---

## Fase 3: Personalización y Marca (Días 4-5)

**Crear archivo de configuración del tema (`src/theme-config.js` o similar):**

```javascript
// theme-config.js
export const matrixThemeConfig = {
  colors: {
    primary: '#00FF00',      // Invalidar verde Matrix predeterminado
    secondary: '#00AA00',
    background: '#000000',
    text: '#00FF00',
    accent: '#00DD00'
  },
  typography: {
    fontFamily: 'Courier New, monospace',
    headingScale: 1.2
  },
  spacing: {
    unit: 8,  // Unidad base en píxeles
  }
}
```

**Invalidar variables CSS en hoja de estilos raíz (`src/styles/theme-overrides.css`):**

```css
:root {
  /* Valores predeterminados del tema Matrix */
  --matrix-primary: #00FF00;
  --matrix-secondary: #00AA00;
  --matrix-background: #000000;
  --matrix-text: #00FF00;
  --matrix-accent: #00DD00;
  --matrix-border-radius: 2px;
  --matrix-transition: 0.2s ease-out;
}

/* Variante de modo oscuro */
@media (prefers-color-scheme: dark) {
  :root {
    --matrix-background: #0a0a0a;
    --matrix-text: #00FF00;
  }
}

/* Variante de modo claro (si se admite ambos) */
@media (prefers-color-scheme: light) {
  :root {
    --matrix-background: #F5F5F5;
    --matrix-text: #004D00;
    --matrix-primary: #00AA00;
  }
}
```

**Importar invalidaciones en el punto de entrada principal:**

```javascript
import '@matrix/theme'
import './styles/theme-overrides.css'
```

**Documentar decisiones de personalización:**

Crear `docs/THEME.md`:
```markdown
# Configuración del Tema Matrix

## Paleta de Colores
- Primario: #00FF00 (verde de marca de la empresa)
- Secundario: #00AA00 (acciones secundarias)
- Fondo: #000000 (coincide con la estética de la empresa)

## Tipografía
- Familia de fuentes: Courier New, monospace
- Los títulos usan --matrix-heading-scale: 1.2

## Espaciado
- Unidad base: 8px
- Usar variables --matrix-spacing-* para consistencia

## Cuándo invalidar
- Invalidar solo para alineación de marca
- Todas las invalidaciones deben documentarse en este archivo
- No crear variantes personalizadas sin aprobación del equipo

## Mantenimiento
- Propietario del tema: @[nombre]
- Última actualización: [fecha]
- Calendario de revisión: Trimestral
```

---

## Fase 4: Estandarización en el Equipo (Días 6-7)

**Crear paquete de configuración compartida (opcional pero recomendado para equipos más grandes):**

```
packages/theme-config/
├── index.js              # Exportar configuración del tema
├── colors.js             # Paleta de colores
├── typography.js         # Configuración de fuentes y texto
├── spacing.js            # Escala de espaciado
└── README.md            # Documentación de uso
```

En el `package.json` de cada proyecto:
```json
{
  "dependencies": {
    "@company/theme-config": "^1.0.0",
    "@matrix/theme": "^x.x.x"
  }
}
```

En el punto de entrada de cada proyecto:
```javascript
import '@matrix/theme'
import { applyThemeConfig } from '@company/theme-config'

applyThemeConfig()
```

**Crear lista de verificación de instalación para nuevos miembros:**

Crear `.claude/matrix-theme-checklist.md`:
```markdown
# Lista de verificación de incorporación del tema Matrix

- [ ] Ejecutar `npm install` (instala @matrix/theme automáticamente)
- [ ] Verificar importación en `src/index.js` o `src/App.tsx`
- [ ] Ejecutar `npm run dev` y verificar errores CSS en consola del navegador
- [ ] Abrir DevTools → Elements y confirmar clases Matrix presentes
- [ ] Leer `docs/THEME.md` para reglas de personalización
- [ ] Verificar `.env.example` para variables THEME_*
- [ ] Ejecutar `npm run test` para confirmar que el tema no rompe pruebas
- [ ] Pedir al propietario del tema (@[nombre]) que revise su configuración

¿Preguntas? Ver README del paquete theme-config o canal Slack #design-systems.
```

**Configurar tema en entorno CI/CD:**

En `.github/workflows/build.yml` (o equivalente):
```yaml
name: Build with Matrix Theme

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Verify theme assets bundled
        run: |
          grep -r "matrix-" dist/ || echo "Warning: No Matrix theme classes in output"
```

**Documentar invalidaciones específicas del entorno:**

Crear `src/theme-env.js`:
```javascript
// Aplicar ajustes de tema específicos del entorno

const env = process.env.NODE_ENV || 'development'

export const getEnvTheme = () => {
  switch (env) {
    case 'production':
      return {
        primaryColor: '#00FF00',
        reducedMotion: false
      }
    case 'staging':
      return {
        primaryColor: '#FFFF00',  // Banner amarillo para staging
        reducedMotion: false
      }
    case 'development':
    default:
      return {
        primaryColor: '#00FF00',
        reducedMotion: true  // Más rápido para desarrollo local
      }
  }
}
```

---

## Fase 5: Pruebas y Validación (Días 8-9)

**Pruebas unitarias para integración del tema:**

Crear `src/theme.test.js`:
```javascript
describe('Matrix Theme', () => {
  it('should load theme CSS variables', () => {
    const root = document.documentElement
    const primaryColor = getComputedStyle(root).getPropertyValue('--matrix-primary').trim()
    expect(primaryColor).toBeTruthy()
  })

  it('should apply theme classes to components', () => {
    const element = document.querySelector('.matrix-container')
    expect(element).toBeTruthy()
  })

  it('should respect color overrides', () => {
    const root = document.documentElement
    const overriddenColor = getComputedStyle(root).getPropertyValue('--matrix-primary').trim()
    expect(overriddenColor).toMatch(/#[0-9A-Fa-f]{6}/) // Color hex válido
  })
})
```

**Pruebas de regresión visual (opcional pero recomendado):**

Utilizar Percy, Chromatic o servicio similar para capturar capturas de pantalla base.

**Auditoría de accesibilidad:**

```bash
# Instalar verificador de accesibilidad
npm install --save-dev @axe-core/react axe-playwright

# Ejecutar auditoría
npm run test:a11y
```

Verificar:
- [ ] Contraste de color cumple WCAG AA (4.5:1 para texto)
- [ ] Estados de enfoque visibles con tema Matrix aplicado
- [ ] Navegación por teclado funciona
- [ ] Lector de pantalla lee elementos con estilo de tema correctamente

**Pruebas de compatibilidad del navegador:**

Probar tema Matrix en:
- [ ] Chrome/Chromium (más reciente)
- [ ] Firefox (más reciente)
- [ ] Safari (más reciente)
- [ ] Navegadores móviles (iOS Safari, Chrome Mobile)

Documentar problemas de compatibilidad en `docs/THEME.md`.

---

## Fase 6: Capacitación y Lanzamiento del Equipo (Días 10-11)

**Organizar sesión de capacitación de equipo de 30 minutos:**

Agenda:
1. Por qué tema Matrix (5 min) — justificación comercial/UX
2. Cómo usarlo (10 min) — importación, puntos de personalización, patrón de invalidación
3. Errores comunes (5 min) — especificidad CSS, nomenclatura de variables, puntos de quiebre
4. Preguntas y respuestas (10 min)

Grabar y compartir de forma asincrónica para miembros que no puedan asistir.

**Compartir documentación:**
- [ ] Enviar enlace a `docs/THEME.md` en Slack/email del equipo
- [ ] Fijar lista de verificación en canal Slack relevante
- [ ] Crear video de demostración corto antes/después
- [ ] Actualizar wiki del equipo o documentos de incorporación

**Implementar en todos los proyectos:**

Para configuración de monorepo:
```bash
# Actualizar package.json raíz
npm install @matrix/theme

# Instalar en todos los espacios de trabajo
npm install --workspaces
```

Para múltiples repositorios:
```bash
# Crear script para actualización masiva
for repo in repo1 repo2 repo3; do
  cd $repo
  npm install @matrix/theme
  git commit -am "chore: install Matrix theme"
  git push origin feature/matrix-theme
done
```

**Crear solicitudes de extracción para revisión:**

Cada RP debe incluir:
- Instalación e importación del tema
- Archivo de configuración del tema o referencia a config compartida
- `docs/THEME.md` actualizado o documentos de tema del equipo
- Verificación que las pruebas pasan
- Enlace a lista de verificación del tema

Ejemplo de descripción de RP:
```markdown
## Instalación del Tema Matrix

Instala @matrix/theme y lo configura para [nombre del proyecto].

### Cambios
- Agregado @matrix/theme a dependencias
- Creado src/theme-config.js con personalización de marca
- Actualizado punto de entrada principal para importar tema
- Agregado docs/THEME.md con estándares del equipo

### Pruebas
- [ ] Dev local: `npm run dev` muestra componentes con estilo
- [ ] Build: `npm run build` incluye CSS del tema
- [ ] Pruebas: Todas pasan
- [ ] Accesibilidad: Sin nuevas violaciones de contraste

### Lanzamiento
- [ ] Revisar y aprobar
- [ ] Fusionar en main
- [ ] Implementar en staging para 24h de QA
- [ ] Implementar en producción

Ver workflows/matrix-theme-setup.md para proceso completo.
```

---

## Fase 7: Mantenimiento Continuo (Semanal/Mensual)

**Verificación semanal de salud del tema (5 min):**
- [ ] Monitorear Slack para preguntas o bugs relacionados con el tema
- [ ] Verificar que nuevas funciones se integren limpiamente con tema Matrix
- [ ] Verificar que pipeline CI/CD aún empaqueta tema correctamente

**Revisión mensual del tema (30 min, asincrónica):**
- [ ] Recopilar comentarios del equipo en hilo Slack dedicado
- [ ] Revisar personalizaciones o casos límite descubiertos
- [ ] Actualizar `docs/THEME.md` con nuevos patrones o errores
- [ ] Verificar si versión más nueva de @matrix/theme disponible

**Auditoría trimestral del tema (1-2 horas):**
- [ ] Ejecutar auditoría de accesibilidad nuevamente en todos los proyectos
- [ ] Volver a verificar compatibilidad del navegador
- [ ] Análisis de impacto en rendimiento (tamaño de paquete CSS, tiempo de carga)
- [ ] Revisar cumplimiento de personalización (sin invalidaciones ad-hoc)
- [ ] Planificar cualquier actualización importante a siguiente versión

**Mantener documentación actual:**
```markdown
# Última Auditoría: [Fecha]
# Propietario del Mantenimiento: @[nombre]
# Próxima Revisión: [Fecha + 90 días]
```

---

## Guía de Resolución de Problemas

**CSS del tema no carga:**
- [ ] Verificar que `import '@matrix/theme'` esté en punto de entrada
- [ ] Verificar logs de construcción para errores de cargador CSS
- [ ] Asegurar postcss-loader configurado si se usan variables personalizadas
- [ ] Borrar node_modules y reinstalar: `rm -rf node_modules && npm install`

**Las clases del tema no aparecen:**
- [ ] Verificar DevTools del navegador → Elements para `class="matrix-*"`
- [ ] Verificar que markup del componente usa nombres de clase correctos (ver docs)
- [ ] Verificar si CSS se elimina por build de producción (problema de minificación)

**Las invalidaciones de color no funcionan:**
- [ ] Verificar que variable CSS esté configurada antes de importación del tema
- [ ] Verificar especificidad CSS (tema Matrix usa `:root`, asegurar que invalidaciones también)
- [ ] Borrar caché del navegador: Ctrl+Shift+R o Cmd+Shift+R

**Tema se rompe en dispositivo móvil:**
- [ ] Verificar que puntos de quiebre responsivos estén definidos
- [ ] Probar que media queries no están en conflicto con estilos del tema
- [ ] Verificar que estados táctiles están con estilo (hover no funcionará en móvil)

**Degradación de rendimiento:**
- [ ] Verificar tamaño del paquete: `npm run build:analyze`
- [ ] Buscar variables de tema no utilizadas en CSS final
- [ ] Considerar tree-shaking si se usa CSS-in-JS

**Miembro del equipo tiene versión desactualizada:**
- [ ] Hacerles ejecutar `npm install @matrix/theme@latest`
- [ ] Borrar caché npm: `npm cache clean --force`
- [ ] Reinstalar: `rm -rf node_modules && npm install`

---

## Plan de Reversión

Si el tema Matrix causa problemas críticos en producción:

```bash
# Paso 1: Identificar problema
# [Verificar logs de error, reportes de usuarios]

# Paso 2: Revertir importación del tema
# En src/index.js, comentar o eliminar:
# import '@matrix/theme'

# Paso 3: Verificar build
npm run build

# Paso 4: Probar localmente
npm run dev
# Confirmar que la app funciona sin tema

# Paso 5: Implementar reversión
git commit -am "Revert: Matrix theme (temporary rollback)"
git push origin main
# Implementar en producción

# Paso 6: Investigar causa raíz
# Crear issue de GitHub vinculado a esta reversión
# Asignar al propietario del tema para diagnóstico

# Paso 7: Reintroducir con corrección
# Después de que se corrija la causa raíz, reaplicar tema con versión actualizada
```

---

## Lista de Verificación: Tema Matrix Completamente Implementado

- [ ] Fase 1: Planificación completa, equipo alineado en alcance
- [ ] Fase 2: Instalación verificada en al menos un proyecto
- [ ] Fase 3: Personalizaciones documentadas en `docs/THEME.md`
- [ ] Fase 4: Paquete de configuración compartida creado (si aplica)
- [ ] Fase 4: Pruebas de pipeline CI/CD pasan con tema
- [ ] Fase 5: Auditoría de accesibilidad aprobada (WCAG AA)
- [ ] Fase 5: Compatibilidad del navegador verificada
- [ ] Fase 6: Capacitación del equipo completada
- [ ] Fase 6: Todos los proyectos del equipo tienen tema instalado
- [ ] Fase 6: Propietario del tema asignado y canal Slack creado
- [ ] Fase 7: Cronograma de mantenimiento documentado
- [ ] Plan de reversión probado (si está en producción)

---
