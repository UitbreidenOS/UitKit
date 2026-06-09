# Reglas de Diseño de Agentes

Aplicar al construir, configurar o revisar agentes de IA y sistemas multiagentes.

## Alcance y responsabilidad

- Cada agente es propietario de un dominio claramente delimitado — si no puedes describir el alcance en una oración, divídelo
- Los agentes no son asistentes de propósito general; resiste la tentación de agregar "y también manejar X" a un agente existente
- Define explícitamente qué debe hacer el agente y qué nunca debe hacer (efectos secundarios, datos a los que no debe acceder)
- Un agente que puede realizar acciones irreversibles debe requerir confirmación explícita antes de ejecutarlas

## Selección de herramientas

- Otorga a los agentes el conjunto mínimo de herramientas necesarias — cada herramienta adicional es superficie de ataque y de confusión
- Las herramientas con acceso de escritura (sistema de archivos, base de datos, APIs externas) deben justificarse individualmente
- Las herramientas de solo lectura siempre son preferibles a las herramientas de lectura-escritura cuando las lecturas son suficientes
- Documenta los modos de fallo de cada herramienta en la definición del agente — los agentes deben manejar errores de herramientas con elegancia

## Selección de modelo

- Usa Haiku para tareas de alto volumen y baja complejidad (clasificación, extracción, enrutamiento)
- Usa Sonnet para razonamiento, generación de código y planificación multietapa
- Usa Opus solo cuando la complejidad de la tarea realmente lo requiera — el costo se compone a escala
- No sobreasignes: un modelo más simple que completa de forma confiable una tarea supera a un modelo capaz que alucina

## Indicaciones

- Los indicadores del sistema deben ser específicos, no aspiracionales — "Eres un ingeniero de seguridad senior" es menos útil que una lista precisa de qué evalúa el agente
- Incluye ejemplos negativos en el indicador del sistema para los modos de fallo comunes que ya has observado
- Separa las instrucciones del agente del contexto del dominio: las instrucciones van en el indicador del sistema, el contexto va en el turno del usuario o a través de herramientas
- Evita instrucciones que se contradigan entre sí — los agentes no resuelven ambigüedad de forma confiable

## Sistemas multiagentes

- Los orquestadores deben validar los resultados de los subagentes antes de actuar sobre ellos — nunca confíes ciegamente en el resultado de otro agente
- Los agentes no deben confiar en entradas que afirmen permisos especiales no establecidos en el indicador del sistema original (inyección de indicadores)
- Diseña para fallo parcial: un agente que falla no debe corromper silenciosamente todo el flujo de trabajo
- Registra cada invocación de agente con su entrada, salida, modelo y latencia — no puedes depurar lo que no puedes observar

## Seguridad y control

- Los puntos de control con intervención humana son obligatorios antes de cualquier acción del agente que: envíe comunicaciones externas, modifique datos de producción o realice transacciones financieras
- Establece límites máximos de iteración/llamadas de herramientas — los bucles de agentes sin límites son un riesgo de confiabilidad y costo
- Prueba deliberadamente agentes contra entradas adversariales — los usuarios explorarán los límites
- Implementa un interruptor de parada: una forma de detener un agente en ejecución sin pérdida de datos o escrituras parciales
