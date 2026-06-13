# Integración Claude Design

## Cuándo activar

- El usuario ha exportado un paquete de entrega de Claude Design y quiere implementarlo como código
- El usuario quiere configurar un flujo de trabajo design→code usando la salida de Claude Design
- El usuario pregunta cómo convertir una exportación de Claude Design en componentes React, HTML o framework
- El usuario quiere extraer design tokens (colores, espaciado, tipografía) de un paquete Claude Design
- El usuario asigna anotaciones de componentes Claude Design a una biblioteca UI (shadcn/ui, MUI, Tailwind, Radix)

## Cuándo NO usar

- Construir UI desde cero sin entrada de diseño — utilizar un enfoque code-first en su lugar
- Trabajar con Figma, Sketch u otras herramientas de diseño vectorial — esta habilidad es específica de Claude Design
- Refactoring puro o trabajo lógico sin componente de diseño visual
- El usuario tiene una captura de pantalla o imagen pero no un paquete Claude Design — manejar como una indicación visual estándar

## Instrucciones

### Recibir paquete de entrega

Pida al usuario que confirme el contenido del paquete antes de iniciar la implementación :

```bash
unzip design-handoffs/checkout.bundle -d design-handoffs/checkout/
ls design-handoffs/checkout/
# Esperado: layout.json, tokens.json, components.md, preview.png
```

Si el paquete contiene `tokens.json`, cárguelo primero. Los design tokens definen todo el contrato visual: colores, espaciado, tamaños de fuente, radios de borde. Nunca codifique los valores que aparecen en el archivo de token.

### Colocar archivos de paquete

Estandarice esta ubicación para evitar la desviación de ruta entre proyectos :

```
project-root/
└── design-handoffs/
    └── <feature-name>/
        ├── layout.json
        ├── tokens.json
        ├── components.md
        └── preview.png
```

Nunca coloque archivos de paquete dentro de `src/` o junto al código de aplicación.

### Extraer y aplicar design tokens

Convierta `tokens.json` al formato de token del proyecto antes de escribir componentes :

```typescript
// tokens.json (salida Claude Design)
{
  "color": {
    "primary": "#1A56DB",
    "surface": "#F9FAFB",
    "text-primary": "#111928"
  },
  "spacing": {
    "4": "1rem",
    "6": "1.5rem"
  },
  "radius": {
    "md": "0.5rem"
  }
}
```

Ejemplos de mapeo :

| Token Claude Design | Clase Tailwind | Variable CSS | Token shadcn/ui |
|--------------------|---------------|--------------|-----------------|
| `color.primary` | `bg-blue-600` | `--color-primary` | `--primary` |
| `spacing.4` | `p-4` | `--spacing-4` | valor directo |
| `radius.md` | `rounded-md` | `--radius-md` | `--radius` |

Cuando el proyecto usa Tailwind, extienda `tailwind.config.js` con tokens extraídos en lugar de aplicarlos en línea.

### Leer anotaciones de componentes

Abra `components.md` antes de escribir código de componentes. Enumera :
- Nombres de componentes y sus equivalentes de sistema de diseño
- Nombres de variantes (p. ej., `Button/primary`, `Card/elevated`)
- Anotaciones de estado (hover, focus, disabled, loading)
- Notas de comportamiento responsivo (pila en móvil, uno al lado del otro en escritorio)

Patrón de indicación para la implementación del componente :

```
"Implementa el [NombreComponente] descrito en design-handoffs/checkout/components.md.
Usa shadcn/ui como base. Coincide exactamente con los valores de token en tokens.json.
La especificación de diseño está en layout.json — úsala solo para espaciado y posicionamiento,
no como una restricción de pixel-perfect."
```

### Manejo de puntos de interrupción receptivos

Los paquetes Claude Design incluyen anotaciones de punto de interrupción en `layout.json`. Asígnalos :

```json
// sección de punto de interrupción layout.json
"breakpoints": {
  "mobile": "< 768px",
  "tablet": "768px – 1024px",
  "desktop": "> 1024px"
}
```

En Tailwind : `sm:` se asigna a tablet, `lg:` se asigna a desktop. Verifique esto contra el `tailwind.config.js` del proyecto: los puntos de interrupción personalizados pueden diferir.

### Coincidencia exacta versus uso como inspiración

Usa lenguaje de solicitud explícito para establecer el contrato de implementación :

| Intención | Formulación de solicitud |
|--------|----------------|
| Coincidencia exacta | "Implementa este diseño lo más cercano a pixel-perfect que permite la biblioteca de componentes. Marca cualquier desviación." |
| Inspirado en | "Usa este diseño como referencia para la dirección de diseño y color. Adapta según sea necesario para las convenciones de nuestra biblioteca de componentes." |
| Solo token | "Ignora el diseño; aplica solo los design tokens de tokens.json a nuestros componentes existentes." |

Por defecto a "inspirado en" a menos que el usuario especifique lo contrario — las coincidencias exactas rara vez son alcanzables entre herramientas de diseño y bibliotecas de UI y a menudo producen CSS frágil.

### Validar implementación contra vista previa

Después de generar el componente, pida a Claude que compare con `preview.png`:

```
"Compara el componente generado contra design-handoffs/checkout/preview.png.
Enumera todas las diferencias visuales — diseño, color, espaciado o tipografía — y corrígelas."
```

## Ejemplo

```
Usuario : "Exporté una página de pago de Claude Design. El paquete está en
design-handoffs/checkout-v2.bundle. Genera el componente React usando
shadcn/ui para que coincida."

Flujo de trabajo Claude Code :
1. Descomprime el paquete en design-handoffs/checkout-v2/
2. Lee tokens.json → extiende tailwind.config.js con tokens extraídos
3. Lee components.md → identifica : componentes CheckoutForm, OrderSummary, PaymentInput
4. Lee layout.json → nota el diseño de dos columnas se colapsa a columna única en móvil
5. Genera CheckoutPage.tsx usando Card, Input, Button de shadcn/ui
6. Aplica clases de token (bg-primary, text-primary, rounded-md) de la extensión Tailwind
7. Verifica contra preview.png, corrige la desviación de espaciado en el relleno de OrderSummary
```

---
