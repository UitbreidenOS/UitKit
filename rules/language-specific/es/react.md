# Reglas de React

## Aplicar a
Todos los archivos React (`*.tsx`, `*.jsx`) en cualquier proyecto.

## Reglas

1. **Un componente por archivo** — nombra el archivo con el nombre del componente. `UserCard.tsx` exporta `UserCard`. Los archivos barrel (`index.ts`) son aceptables para re-exportar, no para colocar múltiples componentes.

2. **Prefiere componentes funcionales con hooks sobre componentes de clase** — los componentes de clase son heredados. La única razón válida para usar un componente de clase es un boundary de errores basado en clases.

3. **Mantén los componentes bajo ~150 líneas** — si un componente necesita más, extrae sub-componentes o mueve la lógica a hooks personalizados. Los componentes largos violan el principio de responsabilidad única.

4. **Levanta el estado al ancestro común más bajo — no más alto** — no alojes estado en un padre solo porque sea conveniente. El estado global (Context, Zustand, etc.) es para datos genuinamente globales: autenticación, tema, locale.

5. **Hooks personalizados para lógica, componentes para renderizado** — la obtención de datos, el estado derivado, la manipulación de eventos pertenecen a hooks `use*`, no dentro del JSX. El cuerpo del componente debe ser principalmente JSX.

6. **Nunca mutes el estado directamente** — siempre devuelve objetos/arrays nuevos. `setState(prev => ({ ...prev, key: value }))` no `state.key = value; setState(state)`.

7. **Especifica claves en elementos de lista — nunca uses el índice del array como clave para listas dinámicas** — las claves de índice rompen la reconciliación cuando los elementos se reordenan o se insertan/eliminan. Usa IDs únicos y estables.

8. **Memoiza correctamente o no lo hagas en absoluto** — `useMemo` y `useCallback` añaden sobrecarga. Úsalos cuando un cálculo sea genuinamente costoso o cuando un cambio de identidad de referencia cause re-renders innecesarios en componentes hijos. Realiza benchmarks antes de añadir.

9. **Coloca estado, efectos y su UI juntos** — no disperses el estado relacionado en la parte superior de un archivo. Agrupa pares `useState`/`useEffect` cerca del JSX que afectan, o extrae a un hook.

10. **Evita `useEffect` para estado derivado** — si un valor puede computarse desde el estado/props existente de forma síncrona, calcúlalo inline. `useEffect` para estado derivado introduce un ciclo de renderizado y una ventana de lectura obsoleta.

11. **Tipifica todas las props con interfaces de TypeScript, no `any`** — `React.FC<Props>` es opcional; tipificar el parámetro directamente (`({ name }: Props) => ...`) es igualmente válido y evita el footgun implícito de `children` de `FC`.

12. **Maneja explícitamente los estados de carga, error y vacío** — cada UI dirigida por async tiene tres caminos no felices. Renderízalos intencionalmente, no mediante fallthrough.

13. **Mantén los arrays de dependencia de `useEffect` precisos** — `eslint-plugin-react-hooks` lo aplica. Nunca suprimas la advertencia exhaustive-deps sin un comentario explicando por qué.

14. **Evita prop drilling más allá de dos niveles** — pasa mediante Context o un gestor de estado. Tres niveles de threading de props es una señal de una abstracción faltante.

15. **Prueba el comportamiento, no la implementación** — usa React Testing Library. Afirma sobre lo que el usuario ve e interactúa, no sobre el estado interno o la estructura del árbol de componentes.


---

> **Trabaja con nosotros:** Claudient es respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
