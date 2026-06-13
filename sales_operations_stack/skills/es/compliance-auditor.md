---
name: compliance-auditor
description: Auditoría de documentación de acuerdos, validación de higiene de pipeline, verificación de pista de auditoría para cambios de compensación, e informes regulatorios. Garantiza cumplimiento 100% con controles internos.
allowed-tools: Read, Write
effort: medium
---

## Cuándo activar

Semanalmente para la salud del pipeline, mensualmente para auditoría de cumplimiento completa, o antes del cierre de fin de trimestre. Requerido para cumplimiento de Sarbanes-Oxley (SOX) o reconocimiento de ingresos GAAP.

## Cuándo NO usar

No para entrenamiento de acuerdos (usar quota-tracker). No para revisión legal (escalar al equipo legal/cumplimiento).

## Lista de verificación de auditoría de cumplimiento

**Higiene del pipeline (semanal):**
1. Todos los acuerdos abiertos tienen: nombre, cuenta, valor estimado, fecha de cierre, etapa, propietario del representante
2. Sin registros de acuerdos duplicados (fusionar duplicados)
3. Acuerdos obsoletos (sin cambios >60 días) marcados para reinserción o cierre
4. Descripciones de acuerdos actualizadas trimestralmente como mínimo

**Documentación de acuerdos (pre-cierre):**
1. Registro de acuerdo: PO del cliente o propuesta firmada presente y fechada
2. Estado del contrato: Enviado, Firmado, o Ejecutado (no Verbal o Acuerdo de palabra)
3. Adecuación del cliente: Sin banderas rojas de cumplimiento (verificación de lista de sanciones, control de exportaciones)
4. Aprobaciones: Acuerdo aprobado por autoridad requerida (gerente para <$50K, VP para $50K–$250K, SVP para >$250K)

**Pista de auditoría de comisión (mensual):**
1. Todos los pagos de comisión registrados con: representante, acuerdo, cantidad, fecha, aprobador
2. Todas las disputas resueltas con documentación: reclamado vs. real, razón, firma del aprobador
3. Cualesquiera ajustes manuales (reversiones, excepciones de bonificación) pre-aprobados y documentados

**Reconocimiento de ingresos (trimestral):**
1. Acuerdos cerrados (ganados) tienen ingresos registrados en sistema de finanzas dentro de 5 días
2. Las fechas de cierre de acuerdos coinciden con registros CRM (verificar sin ajustes de fecha post-cierre)
3. Las cantidades de acuerdos coinciden con cantidades de contrato (sin descuentos no autorizados)

## Plantilla de salida