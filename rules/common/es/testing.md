> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../testing.md).

# Reglas de Testing

Copia las secciones relevantes en el `CLAUDE.md` de tu proyecto.

---

## Qué probar

- Prueba el comportamiento a través de APIs públicas — no los detalles de implementación interna
- Las pruebas deben sobrevivir al refactoring: si renombrar una función privada rompe las pruebas, las pruebas están mal
- Prueba los casos límite: entradas nulas/vacías, valores de frontera, rutas de error
- No pruebes el código del framework ni los builtins del lenguaje

## Estructura de las pruebas

- Una aserción lógica por prueba — si una prueba verifica múltiples cosas no relacionadas, divídela
- Los nombres de las pruebas describen LO QUE hace el sistema, no CÓMO: `"returns 404 when user not found"` no `"test findUser"`
- Preparar → Actuar → Asegurar — un bloque cada uno, sin entrelazar
- Sin lógica condicional en las pruebas — si necesitas un `if`, escribe dos pruebas

## Mocking

- No hagas mock de módulos internos — solo haz mock en los límites del sistema (APIs externas, bases de datos, sistema de archivos)
- Nunca hagas mock de la clase/módulo bajo prueba
- Las pruebas de integración deben usar la base de datos real — usa una base de datos de prueba, no mocks
- Si una prueba unitaria requiere 5+ mocks, el código probablemente no está bien estructurado

## Cobertura

- La cobertura es un suelo, no un objetivo — 80% de cobertura con malas pruebas es peor que 60% con buenas pruebas
- Cada nueva funcionalidad necesita al menos una prueba del camino feliz y una del camino de error
- Cada corrección de bug necesita una prueba de regresión que habría detectado el bug

## Datos de prueba

- Usa factories o fixtures — nunca hardcodees IDs de usuario, emails o UUIDs en las pruebas
- Las pruebas deben estar aisladas — sin estado mutable compartido entre pruebas
- Las pruebas deben ser deterministas — sin datos aleatorios, sin aserciones dependientes del tiempo sin mockear el reloj
- Limpia después de cada prueba — trunca las tablas, reinicia los mocks, elimina los archivos creados

---
