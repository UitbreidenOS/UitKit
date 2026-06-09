# Reglas de Privacidad de Datos

Aplicar al manejar datos personales, sensibles o regulados.

## Minimización de datos

- Recopilar solo datos con un uso específico y documentado — recopilar "por si acaso" es un riesgo legal
- Establecer períodos de retención en el momento de la recopilación; eliminar o anonimizar datos cuando expire el período
- No registrar datos personales (nombres, correos, IPs, IDs de dispositivo) a menos que sea operacionalmente necesario — y aunque sea así, limitar su alcance
- Preferir almacenar un atributo derivado sobre el valor bruto: rango de edad en lugar de fecha de nacimiento, ID hasheado en lugar de correo

## Clasificación

- Clasificar todos los campos de datos antes de almacenarlos: público / interno / confidencial / restringido
- Los datos restringidos (PII, datos de pago, registros de salud) requieren encriptación en reposo y en tránsito
- Nunca almacenar contraseñas en forma recuperable — usar bcrypt, Argon2 o scrypt con factor de costo suficiente
- Tratar tokens de sesión, claves API y JWTs como datos restringidos

## Control de acceso

- Aplicar el principio de menor privilegio: los servicios y usuarios acceden solo a lo que necesitan
- Implementar seguridad a nivel de fila para datos multiempresa — nunca confiar únicamente en filtros de capa de aplicación
- Registrar de auditoría las lecturas de registros sensibles: quién accedió a qué y cuándo
- Revocar acceso inmediatamente en cambio de rol u offboarding — no esperar el próximo ciclo de aprovisionamiento

## Transfronterizo y regulatorio

- Conocer qué regulaciones aplican: GDPR (residentes de la UE), CCPA (residentes de California), HIPAA (datos de salud de EE.UU.), PCI DSS (tarjetas de pago)
- Los derechos del titular de datos (acceso, eliminación, portabilidad) deben ser implementables — diseñar el esquema para poder encontrar y eliminar todos los datos de un usuario determinado
- No transferir datos personales a jurisdicciones sin base legal adecuada (SCCs, decisión de adecuación)
- Documentar flujos de datos: qué datos van a dónde, procesados por quién, bajo qué base legal

## Integraciones de terceros

- Revisar procesadores de terceros antes de enviarles datos personales — verificar su DPA y certificaciones
- Usar tokenización al pasar identificadores de usuario a plataformas de análisis o publicidad — nunca PII sin procesar
- Respetar señales Do Not Track / opt-out en el límite de integración, no solo en la capa de UI

## Respuesta a incidentes

- Definir qué constituye una infracción notificable antes de que ocurra una
- GDPR requiere notificar a la autoridad de supervisión dentro de 72 horas del descubrimiento
- Tener un runbook documentado para: contención, evaluación, notificación y post-mortem
- Nunca intentar ocultar una infracción — amplía la exposición legal

## Testing

- Usar datos sintéticos o anonimizados en entornos que no sean de producción — nunca copiar PII de producción a staging
- Redactar o enmascarar campos sensibles en registros e informes de error antes de que salgan del límite del sistema
