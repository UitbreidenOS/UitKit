---
name: visual-qa
description: Control de calidad visual y de diseño mediante capturas de pantalla — comparar estados de interfaz, detectar roturas de CSS y documentar cambios visuales.
---

# Control de Calidad Visual mediante Uso de Computadora

## Cuándo activar

- El usuario pregunta si un cambio de CSS/diseño rompió algo visualmente
- Se editó un componente de interfaz y el usuario desea una comparación antes/después lado a lado
- La aplicación no tiene una suite de pruebas de regresión visual (Percy, Chromatic, capturas de pantalla de Playwright) y se necesita una verificación manual
- El usuario reporta un error de diseño ("se ve roto en mi pantalla") y quiere que lo reproduzcas
- Verificar puntos de quiebre responsive — comprobar cómo se ve la interfaz en diferentes anchos de viewport
- Comprobar modo oscuro, contraste alto u otras variantes de tema visualmente
- El usuario dice "¿se ve bien esto?", "verifica el diseño" o "compara antes y después"

## Cuándo NO usar

- El usuario tiene una suite de regresión visual de Percy/Chromatic/Playwright — ejecuta eso en su lugar
- La verificación de diseño requeriría navegar por pantallas sensibles (pago, credenciales, datos de salud)
- No tienes una captura de pantalla de referencia para comparar y el usuario no puede proporcionar una
- La verificación es puramente funcional (¿funciona el botón?) en lugar de visual — usa la habilidad ui-testing en su lugar

## Instrucciones

### Establecer líneas base

El control de calidad visual requiere un estado de referencia. Establece líneas base antes de que se implementen cambios:

1. Toma una captura de pantalla de página completa de cada vista a verificar.
2. Nombra las capturas de pantalla con una convención consistente: `[componente]-[estado]-[punto-quiebre]-before.png`
   - Ejemplo: `nav-menu-open-1280px-before.png`
3. Almacena o anota la línea base para que se pueda comparar la captura posterior.

Si el usuario no puede proporcionar una captura de pantalla previa, télo en cuenta y procede con una auditoría de estado único (verifica problemas obvios de diseño sin comparación de regresión).

### Disciplina de capturas de pantalla

- Siempre captura la vista completa, no una región recortada, a menos que la verificación esté limitada a un componente específico.
- Captura en la misma posición de desplazamiento exacta antes y después.
- Para verificaciones responsive, redimensiona el viewport al punto de quiebre objetivo antes de capturar:
  - Móvil: 375px de ancho
  - Tableta: 768px de ancho
  - Escritorio: 1280px de ancho
  - Ancho: 1440px de ancho
- Desactiva animaciones/transiciones antes de capturar si es posible — una captura a mitad de una animación no es útil.

### Qué verificar en una auditoría visual

Trabaja con esta lista de verificación para cada captura de pantalla:

**Integridad del diseño**
- [ ] Sin elementos desbordando sus contenedores
- [ ] Sin texto truncado inesperadamente (verifica encabezados, etiquetas, texto de botón)
- [ ] Sin barra de desplazamiento horizontal inesperada
- [ ] El espaciado (relleno/margen) es consistente con elementos adyacentes
- [ ] La alineación de grid/flexbox es correcta — sin elementos desviados

**Tipografía**
- [ ] Los tamaños de fuente son correctos (encabezados visualmente más grandes que el cuerpo, etiquetas más pequeñas)
- [ ] La altura de línea no está colapsada (líneas de texto no superpuestas)
- [ ] Sin texto invisible (texto blanco sobre fondo blanco, etc.)
- [ ] Los cambios de peso de fuente (negrita, medio) se representan correctamente

**Color y contraste**
- [ ] Los colores de marca coinciden con los valores esperados (verifica contra el sistema de diseño si está disponible)
- [ ] Los estados interactivos (pasar el cursor, enfoque, activo) son visibles y correctos
- [ ] Sin sangrado de color no intencionado desde elementos adyacentes
- [ ] Modo oscuro: todos los pares de primer plano/fondo son legibles

**Específico de componentes**
- [ ] Modales y superposiciones centrados y atenuando correctamente el fondo
- [ ] Menús desplegables y información sobre herramientas no cortados por contenedores overflow:hidden
- [ ] Imágenes cargadas (sin iconos de imagen rota)
- [ ] Iconos representados al tamaño y color correcto
- [ ] Entradas de formulario alineadas con sus etiquetas

### Comparar antes y después

Cuando ambos estados están disponibles:

1. Coloca las capturas de pantalla antes y después lado a lado o describe las diferencias explícitamente.
2. Para cada diferencia visible, clasifica:
   - **Cambio intencionado** — coincide con lo que el desarrollador cambió (omite)
   - **Regresión** — algo que era correcto ahora está roto (marca)
   - **Cambio no relacionado** — contenido de pantalla diferente (datos cambiados, ignora)
3. Reporta regresiones con: nombre del componente, qué cambió, severidad (cosmético / funcional / crítico).

Guía de severidad:
- **Cosmético**: espaciado ligeramente desalineado por unos pocos píxeles, sin impacto visible para el usuario
- **Funcional**: botón parcialmente oscurecido, texto ilegible, elemento interactivo inaccesible
- **Crítico**: diseño de página completamente roto, CTA principal invisible o inaccesible

### Reglas de seguridad

- No navegues a ninguna pantalla que pudiera desencadenar transacciones financieras, cambios de credenciales o exponer datos de salud durante una verificación visual.
- Si capturas una pantalla que incidentalmente muestra datos sensibles, télo en cuenta y no incluyas la captura de pantalla en ningún informe compartido externamente.
- Solo observación visual de solo lectura — no hagas clic en elementos interactivos a menos que se te pida explícitamente como parte del alcance del control de calidad visual.

### Formato de informe

```
Informe de Control de Calidad Visual
Componente/Vista: [nombre]
Puntos de quiebre verificados: [lista]
Temas verificados: [claro / oscuro / ambos]

Regresiones encontradas: [n]

[1] [Nombre del componente] — [Severidad]
    Antes: [descripción o referencia de captura de pantalla]
    Después: [descripción o referencia de captura de pantalla]
    Problema: [qué se rompió y por qué importa]

Notas cosméticas (no bloqueante):
- [lista de problemas menores]

Verificaciones aprobadas: [lista de lo que se veía correcto]
```

## Ejemplo

**Escenario**: Un desarrollador actualizó el CSS de la barra de navegación. El usuario quiere un control de calidad visual antes de fusionar.

**Ejecución**:

1. El usuario proporciona una captura de pantalla previa: `navbar-desktop-before.png` — muestra nav con logo a la izquierda, enlaces al centro, botón CTA a la derecha.
2. Navega a la aplicación en viewport de 1280px. Toma una captura de pantalla: `navbar-desktop-after.png`.
3. Compara:
   - Posición del logo: igual. APROBADO.
   - Enlaces de navegación: ahora empujados a la derecha y superponiéndose al botón CTA. REGRESIÓN.
   - Botón CTA: parcialmente oculto detrás de los enlaces de navegación. Severidad: Funcional.
4. Redimensiona a 375px. Toma una captura de pantalla: `navbar-mobile-after.png`.
   - Icono de hamburguesa: presente y visible. APROBADO.
   - Estado de menú cerrado: se ve correcto. APROBADO.

**Informe**:
```
Informe de Control de Calidad Visual
Componente/Vista: Barra de Navegación Global
Puntos de quiebre verificados: 1280px, 375px
Temas verificados: claro

Regresiones encontradas: 1

[1] Enlaces de navegación — Funcional
    Antes: enlaces centrados entre el logo y el botón CTA
    Después: enlaces desbordándose en el botón CTA, botón 40% ocluido
    Problema: El CTA "Comenzar" es parcialmente inaccesible en escritorio — acción de conversión principal bloqueada

Notas cosméticas (no bloqueante):
- Ninguna

Verificaciones aprobadas:
- Icono de hamburguesa móvil visible
- Posición del logo sin cambios
- Estado de menú cerrado móvil correcto
```

El desarrollador debe corregir la propiedad flex/grid que causa el desbordamiento de enlaces de navegación antes de fusionar.
