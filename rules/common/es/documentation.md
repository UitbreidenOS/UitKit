# Reglas de Documentación

Aplicar al escribir o revisar archivos README, documentación de API, guías o documentación en línea.

## Qué documentar

- Documenta el *por qué*, no el *qué* — el código muestra qué; los documentos explican intención, restricciones e intercambios
- Toda superficie de API pública necesita una descripción, tipos de parámetros, tipo de retorno y al menos un ejemplo
- Documenta explícitamente el comportamiento no obvio: límites de velocidad, consistencia eventual, garantías de ordenamiento, modos de fallo conocidos
- Registros de Decisiones Arquitectónicas (ADR) para cualquier decisión que tardó más de un día en alcanzarse — el contexto se pierde de otro modo

## Qué no documentar

- No repitas lo que el código ya dice claramente: `// increments counter by 1` en `counter++` es ruido
- No documentes estados temporales ("esto es un workaround hasta que X se arregle") — eso pertenece al rastreador de problemas
- No escribas documentación especulativa para características que aún no existen

## READMEs

Cada README del proyecto debe responder estas preguntas en orden:

1. ¿Qué hace este proyecto? (una oración)
2. ¿Cómo lo ejecuto localmente? (comandos exactos, sin suposiciones)
3. ¿Cómo ejecuto las pruebas?
4. ¿Cuáles son las variables de entorno clave?
5. ¿Dónde voy para más detalles? (enlaces a documentación adicional)

Un README que tarda más de 5 minutos en pasar de cero a un entorno local en ejecución es demasiado largo o le faltan pasos.

## Documentación de API

- Mantén la documentación de API adyacente al código — los documentos que viven en un repositorio separado se quedan obsoletos
- Usa OpenAPI/Swagger para REST; SDL + descripciones para GraphQL; genera desde la fuente cuando sea posible
- Cada endpoint documenta: requisitos de autenticación, esquema de solicitud/respuesta, códigos de error, límites de velocidad
- Proporciona ejemplos ejecutables (fragmentos de curl, SDK) — descripciones abstractas sin ejemplos no son útiles

## Estilo de escritura

- Escribe para un lector que es competente pero no está familiarizado con este sistema específico
- Oraciones cortas, voz activa, modo imperativo para instrucciones
- Usa ejemplos concretos sobre descripciones abstractas: muestra una solicitud/respuesta real, no solo un diagrama de esquema
- Tablas para material de referencia; prosa para explicaciones; listas numeradas para pasos secuenciales

## Mantenimiento

- Los documentos que están mal son peor que ningún documento — trata la documentación obsoleta como un error
- Actualiza los documentos en el mismo PR que el cambio de código; nunca dejes un "PR de documentación a seguir"
- Añade una fecha `last-verified` a las guías de formato largo para que los lectores puedan evaluar la frescura
- Enlaces a la fuente canónica de verdad; no copiar y pegar contenido que se quedará obsoleto
