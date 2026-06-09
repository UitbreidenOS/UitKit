# Reglas de GraphQL

Aplica al diseñar esquemas, resolvedores o consultas de cliente.

## Diseño de esquema

- Modela el dominio, no la base de datos — los tipos deben reflejar entidades comerciales, no filas de tabla
- Usa no-null (`!`) agresivamente; los campos anulables son una promesa a los clientes de que el valor puede estar ausente
- Prefiere nombres de campo descriptivos sobre abreviados: `createdAt` no `cAt`
- Los tipos de entrada para mutaciones deben ser separados de los tipos de retorno de consulta — nunca reutilices el mismo tipo
- Usa enums para campos con un conjunto acotado de valores; documenta cada valor enum

## Consultas y mutaciones

- Las consultas deben estar libres de efectos secundarios; las mutaciones son el único punto de entrada para escrituras
- Nombra mutaciones como `<verbo><Sustantivo>`: `createOrder`, `cancelSubscription`
- Devuelve el objeto mutado desde cada mutación — los clientes lo necesitan para actualizar su caché
- Las mutaciones que pueden fallar parcialmente deben devolver un tipo union: `CreateOrderResult = Order | ValidationError`
- Implementa paginación basada en cursor (`first`/`after`) para cualquier lista que pueda crecer sin límites

## Resolvedores

- Agrupa consultas N+1 con un DataLoader — nunca emitas una consulta de BD por elemento de lista
- Mantén la lógica del resolvedor delgada: valida entrada, llama a un servicio, devuelve el resultado
- Resuelve solo lo que se solicita — no busques joins para campos que no están en el conjunto de selección
- Establece costo de complejidad por campo; rechaza consultas que excedan un presupuesto total
- Nunca expongas mensajes de error interno al cliente; regístralos en el lado del servidor

## Seguridad

- Autentica en la puerta de enlace antes de que cualquier resolvedor se ejecute
- Autoriza a nivel de resolvedor — verifica la propiedad antes de devolver o mutar datos
- Deshabilita introspección en producción para APIs que miran hacia afuera
- Aplica límites de profundidad de consulta y límites de complejidad de consulta
- Nunca expongas seguimientos de pila en `errors[].extensions`

## Suscripciones

- Usa suscripciones solo para datos genuinamente en tiempo real; el polling es más simple para la mayoría de los casos
- Siempre filtra eventos de suscripción por el alcance del usuario autenticado
- Implementa manejo de contrapresión — no impulses más rápido de lo que el cliente pueda consumir

## Versionado y evolución

- Depreca campos con `@deprecated(reason: "…")` antes de eliminarlos
- Nunca elimines ni renombres un campo en una única versión — marca como deprecado, espera un ciclo de versión
- Los cambios aditivos (nuevos campos, nuevos tipos) son no-rompedores y seguros para enviarse en cualquier momento
