# Reglas de Gestión de Secretos

Aplicar siempre que el código maneje claves API, contraseñas, tokens, certificados o credenciales.

## Nunca hagas esto

- Nunca confirmes secretos al control de versiones — ni siquiera en repositorios privados, ni siquiera temporalmente
- Nunca codifiques secretos como literales de cadena en el código fuente
- Nunca almacenes secretos en archivos de variables de entorno (`.env`) confirmados en git
- Nunca registres secretos — ni al iniciar, ni en salida de depuración, ni en mensajes de error
- Nunca transmitas secretos en URLs o parámetros de consulta — terminan en registros de acceso e historial del navegador

## Dónde viven los secretos

- Usa un gestor de secretos dedicado en todos los entornos de producción: AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault o Azure Key Vault
- Inyecta secretos en tiempo de ejecución a través de variables de entorno desde el gestor de secretos — no a través de archivos incluidos en imágenes de contenedor
- Para desarrollo local: los archivos `.env` son aceptables pero deben estar en `.gitignore`; proporciona un `.env.example` con valores de marcador de posición
- Tuberías CI/CD: usa el almacén de secretos de la plataforma (secretos de GitHub Actions, variables de GitLab CI); nunca los imprimas en registros

## Rotación

- Todos los secretos deben tener un cronograma de rotación definido — las claves API rotan al menos anualmente, las contraseñas de base de datos al menos trimestralmente
- Diseña servicios para aceptar un nuevo secreto sin tiempo de inactividad: admite ventanas de credenciales duales durante la rotación
- Automatiza la rotación donde el proveedor lo permita; la rotación manual es propensa a errores
- Revoca las credenciales comprometidas inmediatamente — antes de investigar el alcance de la filtración

## Control de acceso

- Otorga privilegios mínimos: un secreto se limita al servicio que lo necesita, no se comparte entre servicios
- Usa credenciales separadas por entorno (desarrollo, staging, producción) — nunca compartas secretos de producción
- Audita quién y qué tiene acceso a cada secreto; revisa trimestralmente
- Autenticación de servicio a servicio: usa tokens de corta duración (identidad de carga de trabajo OIDC, roles IAM) en lugar de claves API estáticas cuando sea posible

## Detección

- Habilita escaneo de secretos en CI (escaneo de secretos de GitHub, GitLeaks, truffleHog) — falla la tubería en un acierto
- Escanea el historial de git al habilitar esto para un repositorio existente — asume que los secretos confirmados históricamente están comprometidos
- Configura alertas para uso anómalo de credenciales de producción (volúmenes de llamadas inusuales, nuevas direcciones IP de origen)

## Cuando se filtra un secreto

1. Revoca la credencial inmediatamente — no esperes a la investigación
2. Audita los registros de acceso durante la vida útil de la credencial
3. Rota todos los secretos que podrían haber sido expuestos en el mismo vector de filtración
4. Elimina el secreto del historial de git usando `git filter-repo`; fuerza la inserción; notifica a todos los forks
