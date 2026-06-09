---
description: Generar un componente de React tipado y accesible con interfaz de props y pruebas básicas
argument-hint: "[ComponentName] [variant: functional|compound] [framework: react|next]"
---
Generar un componente de React listo para producción basado en: $ARGUMENTS

Analizar los argumentos:
- El primer token es el nombre del componente en PascalCase
- Variante opcional `functional` (predeterminada) o `compound`
- Marco de trabajo opcional `react` (predeterminado) o `next` para patrones específicos del marco

Requisitos:
1. TypeScript con interfaz explícita de Props — sin `any`, sin tipos implícitos
2. Exportación nombrada solo — sin exportaciones predeterminadas
3. Los Props deben incluir `className?: string` para extensión de estilos y `children?: React.ReactNode` si el componente es un contenedor
4. Usar `forwardRef` si el componente envuelve un elemento DOM nativo
5. Variante compuesta: exponer subcomponentes como propiedades estáticas (p. ej. `Card.Header`, `Card.Body`)
6. Sin estilos en línea — usar CSS Modules o clases de utilidad de Tailwind según lo que ya existe en el proyecto
7. Los roles y atributos ARIA deben ser correctos para el tipo de componente (botón, diálogo, listbox, etc.)
8. Soporte de navegación por teclado donde sea aplicable (Escape cierra superposiciones, Enter/Space activa botones)

Estructura de archivo a emitir:
- `ComponentName.tsx` — implementación del componente
- `ComponentName.test.tsx` — pruebas unitarias RTL que cubren: renderización, reenvío de props, interacción del teclado, accesibilidad mediante `@testing-library/jest-dom`
- `ComponentName.stories.tsx` — historia de Storybook CSF3 con al menos Default y una historia de variante

Antes de escribir, escanear el repositorio para:
- Patrones de componentes existentes a coincidir (nomenclatura, diseño de archivo, estilo de importación)
- Archivos de token de diseño o tema para extraer color/espaciado
- Configuración de pruebas existente (config de jest, utilidades de prueba, envoltorios de renderización)

No inventar un sistema de diseño — hacer coincidir lo que ya existe en la base de código. Si no existe ninguno, usar marcado mínimo sin estilos y anotar que el estilo se deja al consumidor.
