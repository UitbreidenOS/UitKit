---
description: Generar un componente React tipado y accesible con interfaz de props y pruebas básicas
argument-hint: "[ComponentName] [variant: functional|compound] [framework: react|next]"
---
Generar un componente React listo para producción basado en: $ARGUMENTS

Analizar los argumentos:
- El primer token es el nombre del componente en formato PascalCase
- Variante opcional `functional` (por defecto) o `compound`
- Framework opcional `react` (por defecto) o `next` para patrones específicos del framework

Requisitos:
1. TypeScript con interfaz Props explícita — sin `any`, sin tipos implícitos
2. Solo exportación nombrada — sin exportaciones por defecto
3. Props debe incluir `className?: string` para extensión de estilos y `children?: React.ReactNode` si el componente es un contenedor
4. Usar `forwardRef` si el componente envuelve un elemento DOM nativo
5. Variante compound: exponer subcomponentes como propiedades estáticas (por ejemplo `Card.Header`, `Card.Body`)
6. Sin estilos en línea — usar CSS Modules o clases de utilidad Tailwind dependiendo de lo que ya exista en el proyecto
7. Los roles y atributos ARIA deben ser correctos para el tipo de componente (button, dialog, listbox, etc.)
8. Soporte de navegación por teclado donde sea aplicable (Escape cierra overlays, Enter/Space activa botones)

Estructura de archivos a emitir:
- `ComponentName.tsx` — implementación del componente
- `ComponentName.test.tsx` — pruebas unitarias RTL cubriendo: render, props forwarding, interacción por teclado, accesibilidad mediante `@testing-library/jest-dom`
- `ComponentName.stories.tsx` — historia Storybook CSF3 con al menos una historia Default y una historia variante

Antes de escribir, explorar el repositorio para:
- Patrones de componentes existentes a emparejar (nomenclatura, layout de archivos, estilo de import)
- Archivos de token de diseño o tema para obtener color/espaciado
- Configuración de pruebas existente (jest config, test utilities, render wrappers)

No inventar un sistema de diseño — emparejar lo que ya existe en la codebase. Si no existe ninguno, usar markup mínimo sin estilos y anotar que el estilo es responsabilidad del consumidor.
