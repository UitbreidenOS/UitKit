# Niveles de Certificación de Stack Claudient

Este documento define los niveles de certificación para stacks en el Marketplace Claudient. Los stacks certificados han cumplido estándares de calidad cuantificados y compromisos de mantenimiento.

## Niveles de Certificación

### Nivel Bronce

**Criterios:**
- Pasa todas las verificaciones de validación automatizada
- Completa revisión humana sin obstáculos
- El autor se compromete con un período de mantenimiento de 6 meses

**Beneficios:**
- Insignia de certificación Bronce mostrada en el marketplace
- Stack listada en índice de stacks certificadas
- Prioridad en resultados de búsqueda
- Incluida en rotaciones destacadas

**SLA de Mantenimiento:**
- Responde a reportes de errores críticos dentro de 2 semanas
- Aborda actualizaciones de dependencias de ruptura dentro de 1 mes
- Actualiza documentación para cambios de API dentro de 2 semanas

**Vencimiento:** 6 meses desde la fecha de certificación

---

### Nivel Plata

**Criterios:**
- Cumple todos los requisitos del nivel Bronce
- Mínimo 50 instalaciones durante 90 días
- Calificación promedio de usuario de 4.0 o superior
- Sin problemas críticos pendientes por más de 1 mes
- Última actualización dentro de 6 meses de la solicitud de certificación

**Beneficios:**
- Insignia de certificación Plata (mayor prominencia)
- Destacado en categorías "Tendencia" y "Recomendado"
- Listado en índice de stacks certificadas de nivel Plata
- Elegibilidad para oportunidades de asociación
- Oferta de co-mantenimiento del equipo central (opcional)

**SLA de Mantenimiento:**
- Responde a todos los problemas dentro de 1 semana
- Errores críticos resueltos dentro de 2 semanas
- Actualizaciones de dependencias evaluadas y aplicadas dentro de 2 semanas
- Actualizaciones regulares (actividad mínima mensual)

**Vencimiento:** 12 meses desde la fecha de certificación

---

### Nivel Oro

**Criterios:**
- Cumple todos los requisitos del nivel Plata
- Mínimo 200 instalaciones durante 180 días
- Calificación promedio de usuario de 4.5 o superior
- Aprobación oficial del mantenedor (miembro oficial del equipo Claudient o mantenedor comunitario verificado con antecedentes)
- Documentación y ejemplos completos
- Soporte multiidioma (mínimo: inglés + 1 idioma adicional)

**Beneficios:**
- Insignia de certificación Oro (máxima prominencia)
- Destacado prominentemente en la página de inicio del marketplace
- Listado en índice de stacks certificadas de nivel Oro
- Soporte exclusivo de marketing y promoción
- Acceso directo al equipo central para solicitudes de características y soporte
- Elegibilidad para participación en ingresos (si aplica)

**SLA de Mantenimiento:**
- Responde a todos los problemas dentro de 48 horas
- Errores críticos resueltos dentro de 5 días hábiles
- Actualizaciones de dependencias evaluadas y aplicadas dentro de 1 semana
- Actualizaciones trimestrales (mínimo)
- Auditorías de seguridad proactivas (anual)

**Vencimiento:** 24 meses desde la fecha de certificación

---

## Cálculo de la Puntuación de Calidad

Cada stack recibe una puntuación de calidad compuesta (0-100) basada en:

| Métrica | Peso | Medición |
|--------|--------|-------------|
| Calidad del Código | 20% | Cobertura de pruebas, linting, completitud de documentación |
| Adopción de Usuario | 20% | Conteo de instalaciones, usuarios activos semanalmente, velocidad de tendencia |
| Satisfacción del Usuario | 20% | Calificación promedio, sentimiento de reseñas, tasa de resolución de problemas |
| Mantenimiento | 20% | Días desde la última actualización, actualización de dependencias, tiempo de respuesta a problemas |
| Documentación | 20% | Completitud, claridad, calidad de ejemplos, precisión |

**Interpretación de Puntuación:**
- 80-100: Candidato a nivel Oro
- 60-79: Candidato a nivel Plata
- 40-59: Candidato a nivel Bronce
- Inferior a 40: No elegible para certificación

---

## Recertificación

Todas las stacks certificadas se someten a recertificación anual:

**Stacks Bronce:**
- Deben mantener conteo mínimo de instalaciones (10)
- Calificación promedio se mantiene por encima de 3.5
- Sin problemas críticos sin resolver
- Autor confirma intención de mantener

**Stacks Plata:**
- Deben mantener conteo mínimo de instalaciones (50)
- Calificación promedio se mantiene por encima de 4.0
- Se requieren actualizaciones trimestrales
- SLA de respuesta a problemas mantenido

**Stacks Oro:**
- Deben mantener conteo mínimo de instalaciones (200)
- Calificación promedio se mantiene por encima de 4.5
- Se requieren actualizaciones mensuales
- SLA de respuesta a problemas mantenido
- Aprobación del mantenedor renovada

Si una stack no pasa la recertificación, se degrada un nivel. Si falla en nivel Bronce, la certificación se revoca.

---

## Revocación de Certificación

La certificación se revoca inmediatamente si:

1. **Violación del código de conducta:** Contenido prohibido descubierto en stack o conducta del autor
2. **Problema de seguridad crítico:** Vulnerabilidad sin parches que afecta sistemas de usuarios
3. **Violación de licencia:** Uso de licencias incompatibles o no divulgadas
4. **Abandonado:** Sin respuesta del autor durante 3 meses después de revisión de recertificación
5. **Mantenimiento hostil:** El autor previene activamente mejoras o ignora problemas críticos

Las stacks revocadas se desmarcan de índices certificados pero permanecen en el marketplace (si no hay violaciones). Los autores pueden solicitar recertificación después de 6 meses de mejoras.

---

## Proceso de Certificación

Consulte [becoming-certified.md](../guides/marketplace/becoming-certified.md) para el flujo de trabajo de certificación paso a paso.

Consulte [certification-criteria.md](../guides/marketplace/certification-criteria.md) para rubricas de calidad detalladas y metodologías de medición.

---

**Última actualización:** 15 de junio de 2026
