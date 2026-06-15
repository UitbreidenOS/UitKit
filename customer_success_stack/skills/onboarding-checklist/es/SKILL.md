# Skill: Lista de verificación de incorporación

## Cuándo activar

Nuevo registro de cliente o actualización a nuevo nivel de plan.

## Cuándo NO usar

No aplicar a clientes existentes a mitad del contrato (usar plan de éxito en su lugar).

## Instrucciones

1. Generar lista de verificación basada en roles (administrador, usuario, integrador)
2. Rastrear finalización mediante casillas de verificación automatizadas o manuales
3. Alertar sobre bloqueos (integración faltante, factura sin pagar)
4. Medir tiempo para obtener valor (días hasta el primer uso)

## Ejemplo

```
/onboard-checklist --customer=startup-xyz --plan=pro
→ 12 elementos; 8 completados, 4 pendientes
→ Bloqueador: Autenticación de integración de Salesforce
```
