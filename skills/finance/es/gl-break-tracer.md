# Trazador de Ruptura de Libro Mayor

## Cuándo activar

Investigación de ruptura de conciliación del libro mayor, varianza inexplicada en un saldo de prueba, desajuste de subledger a libro mayor, o discrepancia de cierre mensual. Utilice cuando existe una diferencia numérica entre dos representaciones de la misma posición financiera y la causa raíz es desconocida.

## Cuándo NO usar

Registrar asientos de diario o ajustes. Esta habilidad solo diagnostica — un resolvedor (humano o flujo separado) registra cualquier corrección después de la revisión. No use esta habilidad para proponer registros sin aprobación de un contador calificado.

## Instrucciones

Investigación en tres fases :

**Fase 1 — Capa de Libro Mayor**

Lea el saldo de la cuenta del libro mayor. Identifique el período de reporte, código de cuenta y entidad. Extraiga el movimiento neto y saldo final. Registre la fuente (sistema ERP, nombre del informe, fecha de ejecución).

**Fase 2 — Capa de Subledger**

Extraiga el subledger correspondiente o cronograma de apoyo. Sume los saldos del subledger para el mismo período y alcance de cuenta. Compare con saldo final del libro mayor :

```
diferencia neta = saldo de libro mayor − total de subledger
```

Si diferencia neta = 0, no existe ruptura. Si no es cero, proceda a la Fase 3.

**Fase 3 — Comparación de Atributos**

Para cada partida que contribuye a la ruptura, identifique el atributo que difiere :

- Fecha (desajuste de corte)
- Cantidad (redondeo, conversión de moneda, entrada duplicada)
- Contraparte (proveedor/cliente mal codificado)
- Moneda (tasa FX aplicada diferente)
- Centro de costos o unidad comercial (error de asignación interempresarial)
- Tipo de transacción (registro mal clasificado)

Formato de declaración de causa raíz : `"[lado del libro mayor] [acción] porque [razón del subledger]"`

Ejemplo : `"Débito en libro mayor registrado el 31-05-2026 porque entrada del subledger con fecha 01-06-2026 — desajuste de corte"`

**Formato de salida (JSON) :**

```json
{
  "break_amount": 12450.00,
  "currency": "USD",
  "root_cause": "Débito en libro mayor registrado el 31-05-2026 ; entrada del subledger con fecha 01-06-2026 (desajuste de corte)",
  "owner": "Equipo AP",
  "action": "adjust",
  "action_detail": "Reclasificar entrada de libro mayor a período de junio ; registrar asiento de reversión con fecha 01-06-2026",
  "verification": "Volver a ejecutar conciliación después del registro — la ruptura debe aclararse a cero"
}
```

**Tipos de acción :**

| Tipo | Significado |
|------|---------|
| `monitor` | Monitorear pero no tomar acción aún — diferencia está relacionada con el tiempo y debería aclararse por sí sola |
| `adjust` | Registrar asiento de corrección para resolver la ruptura |
| `raise-ticket` | Escalar al propietario del sistema ascendente — la causa raíz es error de sistema o alimentación fuera del control de contabilidad |
| `suppress` | Diferencia permanente conocida — documentar y obtener aprobación ; excluir de futuras conciliaciones |

**Compuerta de seguridad :** Esta habilidad produce un diagnóstico y acción recomendada. Todos los asientos de diario propuestos deben ser revisados y aprobados por un contador calificado antes de registrar. Nunca registre directamente desde la salida de esta habilidad.

## Ejemplo

**Entrada :** « El subledger de AP muestra $45.230 en facturas pendientes pero la cuenta de AP del libro mayor muestra $57.680 para el mismo período. Rastrear la ruptura de $12.450 e identificar la causa raíz. »

**Salida esperada :**

```json
{
  "break_amount": 12450.00,
  "currency": "USD",
  "root_cause": "Dos asientos de libro mayor totalizando $12.450 no tienen registros de subledger coincidentes — probablemente asientos de diario manuales registrados directamente en la cuenta de libro mayor omitiendo el módulo de AP",
  "owner": "Equipo AP",
  "action": "raise-ticket",
  "action_detail": "Identificar asientos manuales consultando transacciones de libro mayor sin referencia de subledger para el período. Determinar si son válidos (reclasificación) o erróneos (duplicado). Escalar a Controlador de GL para revisión.",
  "verification": "Después de la resolución, volver a ejecutar conciliación de AP — la ruptura debería aclararse a cero o suprimirse con justificación documentada"
}
```

---
