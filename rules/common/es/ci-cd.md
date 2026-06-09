# Reglas CI/CD

Aplicar al escribir o revisar configuración de canales, scripts de implementación o procesos de lanzamiento.

## Diseño de canales

- Cada ejecución de canal debe ser reproducible: las mismas entradas → los mismos resultados, sin importar cuándo o dónde se ejecute
- Fija versiones de acciones e imágenes base a resúmenes, no a etiquetas flotantes: `actions/checkout@v4` es aceptable; `actions/checkout@latest` no lo es
- Separa etapas: lint → test → build → publish → deploy; nunca saltes etapas en la rama principal
- Fallar rápido: ejecuta las comprobaciones más baratas y rápidas primero para dar retroalimentación a los desarrolladores en menos de 2 minutos
- Paraleliza trabajos independientes; no encadenes trabajos que no tengan una dependencia real

## Puertas de prueba

- Las fusiones `main`/`master` requieren: todas las pruebas pasando, lint limpio, sin nuevas vulnerabilidades de seguridad
- La cobertura no debe caer por debajo del umbral configurado — aplica esto como una puerta de canal, no como una comprobación de cortesía
- Los conjuntos de pruebas de integración y extremo a extremo se ejecutan en cada PR; los conjuntos de larga duración pueden ejecutarse cada noche si es necesario
- Nunca fusiones un PR que evite la canalización de pruebas excepto en una emergencia documentada con un ticket de seguimiento

## Secretos y entorno

- Los secretos del canal viven en el almacén de secretos de la plataforma CI — nunca en YAML de canal o archivos `.env` comprometidos
- Nunca imprimas secretos en los registros del canal; agrega `::add-mask::` (GitHub Actions) o equivalente antes de usarlos
- Usa conjuntos de credenciales separados por entorno de destino; el implementador de pruebas no puede tocar producción

## Artefactos de construcción

- Construye una vez, promociona el mismo artefacto a través de entornos — nunca reconstruyas para pruebas vs. producción
- Etiqueta imágenes de contenedor y artefactos de construcción con el SHA del commit de git, no una etiqueta mutable como `latest`
- Almacena artefactos en un registro versionado (ECR, Artifact Registry, GitHub Packages) — no como adjuntos de canal
- Escanea artefactos en busca de vulnerabilidades antes de promocionar a producción

## Implementación

- Utiliza una estrategia de implementación que permita reversión: azul/verde, canario o rodante con un paso de reversión
- Prueba automáticamente el despliegue antes de marcarlo como exitoso
- Las migraciones de base de datos y los despliegues de código son pasos separados — implementa código compatible hacia atrás primero, luego migra
- La implementación en producción requiere aprobación explícita o se controla en una ventana de tiempo — sin presiones accidentales

## Mantenimiento

- Mantén la configuración del canal DRY: extrae pasos compartidos en flujos de trabajo reutilizables o acciones compuestas
- Cada paso de canal tiene un nombre que hace que el registro sea legible sin profundizar en la configuración
- Alerta sobre fallas de canal al canal del equipo — no dependas de que los individuos revisen el panel
- Revisa y actualiza versiones fijadas mensualmente; las herramientas obsoletas son un riesgo de seguridad
