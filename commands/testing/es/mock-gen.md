---
description: Genera mocks y stubs seguros de tipos para un módulo o interfaz dado
argument-hint: "[module-path-or-interface-name]"
---
Genera mocks y stubs para: $ARGUMENTS

1. Localiza el destino — encuentra el archivo del módulo, clase o interfaz nombrada en $ARGUMENTS. Léelo completamente para entender la superficie completa: todas las funciones exportadas, métodos de clase y sus firmas de tipo.

2. Detecta el enfoque de mocking del proyecto:
   - Jest: `jest.fn()`, `jest.mock()`, mocks manuales en `__mocks__/`
   - Pytest: `unittest.mock.MagicMock`, fixtures de `pytest-mock`
   - Go: mocks manuales basados en interfaz o structs de estilo `mockery`
   - TypeScript: preserva todos los tipos genéricos; no uses `any`

3. Genera mocks que:
   - Implementen la interfaz completa — sin métodos faltantes
   - Sean seguros de tipos (sin casting, sin `any` a menos que el original use `any`)
   - Tengan valores de retorno configurables por llamada a través de APIs de mock estándar
   - Incluyan una implementación por defecto que devuelve valores cero / structs vacíos para que las pruebas se compilen sin configuración adicional
   - Expongan rastreo de llamadas (conteo de llamadas, argumentos recibidos) donde el framework lo soporta

4. Genera una fábrica correspondiente o fixture que devuelva un mock preconfigurado adecuado para escenarios de prueba comunes. Nómbralo `make<Name>Mock` o sigue la convención de nombres del proyecto.

5. Coloca el mock en la ubicación correcta según las convenciones del proyecto (`__mocks__/`, `mocks/`, `testutil/`, etc.). Si el proyecto no tiene convención, colócalo adyacente al archivo fuente.

6. Escribe una prueba de ejemplo demostrando cómo importar y usar el mock, incluyendo cómo hacer aserciones sobre las llamadas recibidas.

Resultado: el archivo de mock y la prueba de ejemplo. Sin métodos de marcador de posición.
