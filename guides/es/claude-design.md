# Claude Design — Agente de diseño visual de Anthropic Labs

Claude Design es un agente de diseño visual — no una herramienta de diseño tradicional — que genera trabajo visual pulido a partir de descripciones en lenguaje natural. Lee tu sistema de diseño existente, base de código y archivos de marca para producir salida coherente con la marca, luego empaqueta el resultado como un paquete de entrega que Claude Code puede usar directamente.

---

## Qué es Claude Design

- **Texto a diseño**: describe lo que necesitas, Claude construye una primera versión
- **Consciente del sistema de diseño**: lee tu base de código y archivos de diseño para aplicar automáticamente colores, tipografía y componentes existentes
- **Refinamiento conversacional**: comentarios en línea, ediciones directas, controles deslizantes de ajuste personalizado
- **Exportación multiformato**: URLs internas, Canva, PDF, PPTX, HTML
- **Paquete de entrega de Claude Code**: empaqueta el diseño en un paquete de desarrollo que Claude Code puede consumir
- **Disponibilidad**: Vista previa de investigación para suscriptores Pro, Max, Team y Enterprise (a partir del 17 de abril de 2026)

---

## Cómo se ajusta a un flujo de trabajo de Claude Code

1. Comienza en Claude Design — describe el activo de interfaz de usuario o visual necesario
2. Adjunta tus tokens del sistema de diseño (colores, tipografía, biblioteca de componentes)
3. Refina conversacionalmente hasta que la salida coincida con la intención
4. Exportar → "Enviar a Claude Code" genera un paquete de entrega
5. En Claude Code: referencia el paquete de entrega para implementar el diseño como código

El paquete de entrega contiene especificaciones de diseño, tokens de diseño extraídos, anotaciones de componentes y notas de punto de ruptura receptivo — suficiente para que Claude Code implemente sin interpretación de diseño adicional.

---

## Patrón de entrega de diseño a código

```bash
# Exporta desde Claude Design, luego:
unzip checkout-v2.bundle -d design-handoffs/checkout-v2/

# Abre Claude Code y referencia el paquete
claude "Implementa la página de checkout de design-handoffs/checkout-v2/ usando componentes shadcn/ui"
```

Estructura de proyecto recomendada:

```
project-root/
├── design-handoffs/
│   ├── checkout-v2/
│   │   ├── layout.json          # Árbol de componentes y posicionamiento
│   │   ├── tokens.json          # Colores, espaciado, tipografía
│   │   ├── components.md        # Anotaciones de componentes
│   │   └── preview.png          # Referencia visual
│   └── landing-v1/
└── src/
```

---

## Adjuntar un sistema de diseño

Claude Design lee el contexto de diseño de tres fuentes:

| Fuente | Cómo adjuntar | Qué lee Claude |
|--------|---------------|-------------------|
| Archivo de tokens | Carga `tokens.json` o pega variables CSS | Colores, espaciado, radios, escalas de fuente |
| Biblioteca de componentes | Enlaza a URL de Storybook o carga capturas de componentes | Nombres y variantes de componentes existentes |
| Archivo de marca | Carga PDF de marca o guía de estilo | Uso de logo, jerarquía de tipografía, tono |
| Base de código | Pega `tailwind.config.js` o archivo de tema | Asignaciones de clases de utilidad, puntos de ruptura |

Cuanto más contexto proporciones, menos corrección requiere el bucle de refinamiento.

---

## Casos de uso

- Maquetas de productos e prototipos interactivos antes de la planificación de sprints
- Decks de presentación y materiales para inversores sin diseñador en el equipo
- Materiales de marketing: one-pagers, conceptos de página de destino, tarjetas sociales
- Exploración de interfaz de usuario antes de implementación completa — explora 3 direcciones económicamente
- Activos visuales rápidos coherentes con la marca para equipos sin diseñador dedicado
- Pantallas de incorporación rápida, estados vacíos y diseños de estados de error

---

## Refinamiento conversacional

Claude Design admite ediciones en lenguaje natural durante el refinamiento:

```
"Mueve el botón CTA encima de la línea de pliegue"
"Haz el encabezado más grande y usa nuestro color de marca principal"
"Prueba una versión con menos espacio en blanco — esto es para un panel de datos denso"
"Agrega una variante de modo oscuro"
"Coincide con la tipografía de la página de inicio que cargamos"
```

Cada instrucción produce una nueva versión; las versiones anteriores se conservan en el historial de versiones.

---

## Formatos de exportación

| Formato | Mejor para |
|--------|---------|
| Paquete de entrega (`.bundle`) | Implementación de Claude Code |
| HTML | Maqueta estática en navegador |
| PDF | Revisión de partes interesadas, impresión |
| PPTX | Decks de presentación, presentaciones |
| Exportación de Canva | Edición del equipo de marketing |
| URL interna | Compartir dentro de claude.ai |

---

## Limitaciones (Vista previa de investigación)

- Estado de vista previa de investigación — las características y formatos de exportación pueden cambiar sin previo aviso
- No es un editor de vectores — sin manipulación de nodos equivalente a Figma o herramientas de diseño de precisión
- El paquete de entrega es una ayuda para desarrollo, no una especificación de píxeles perfectos; Claude Code puede necesitar adaptar el diseño para capacidad de respuesta
- Requiere cuenta de claude.ai en un plan Pro, Max, Team o Enterprise
- No es apropiado como única fuente de verdad para sistemas de diseño de producción
- Los diseños complejos con muchos componentes personalizados pueden requerir refinamiento de prompt significativo

---
