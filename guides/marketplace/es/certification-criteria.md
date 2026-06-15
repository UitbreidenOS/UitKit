# Criterios de Certificación de Stack Marketplace

Esta guía detalla los criterios cuantificados, las rúbricas de calidad y las metodologías de medición para la Certificación de Stack Claudient.

## Descripción General

La certificación de stack tiene tres niveles: Bronce, Plata y Oro. Cada nivel tiene criterios medibles en cinco dimensiones: calidad del código, adopción de usuarios, satisfacción del usuario, mantenimiento y documentación.

---

## Cálculo de la Puntuación de Calidad

Cada stack recibe una puntuación de calidad compuesta (0-100) calculada como:

```
Quality Score = (0.20 × Code Quality) + (0.20 × Adoption) + (0.20 × Satisfaction) + (0.20 × Maintenance) + (0.20 × Documentation)
```

Rangos de puntuación:
- 80-100: Candidato a Oro
- 60-79: Candidato a Plata
- 40-59: Candidato a Bronce
- Inferior a 40: No elegible para certificación

---

## 1. Calidad del Código (20%)

**Medición:** Cobertura de pruebas, conformidad de linting, actualización de dependencias, resultados de auditoría de seguridad.

| Métrica | Excelente (90-100) | Bueno (70-89) | Aceptable (50-69) | Deficiente (Inferior a 50) |
|--------|-------------------|--------------|-------------------|-----------------|
| **Cobertura de Pruebas** | 80%+ | 60-79% | 40-59% | Inferior a 40% |
| **Linting** | Sin problemas | ≤2 problemas menores | 3-5 problemas menores | 6+ problemas o problemas críticos |
| **Dependencias** | Todas actualizadas; actualizaciones automáticas | 1-2 obsoletas; plan de actualización en vigor | 3+ obsoletas; se requiere plan | 5+ gravemente obsoletas; vulnerabilidades críticas |
| **Seguridad** | Auditoría anual; sin problemas | Sin vulnerabilidades conocidas | 1-2 problemas de gravedad baja | Vulnerabilidades sin parches |

**Requisito de Bronce:** 50+ (aceptable) en cada métrica
**Requisito de Plata:** 70+ (bueno) en cada métrica
**Requisito de Oro:** 90+ (excelente) en cada métrica

---

## 2. Adopción de Usuarios (20%)

**Medición:** Recuento de instalaciones, usuarios activos semanalmente, velocidad de tendencia, uso de comandos.

| Métrica | Oro | Plata | Bronce |
|--------|------|--------|--------|
| **Instalaciones Totales (ventana de 90 días)** | 200+ | 50+ | 10+ |
| **Usuarios Activos Semanalmente** | 25+ | 10+ | 3+ |
| **Velocidad de Tendencia** | +20% semana a semana | +10% semana a semana | Estable o creciente |
| **Uso de Comandos/Habilidades** | 70%+ características utilizadas regularmente | 50%+ características utilizadas regularmente | 30%+ características utilizadas |

**Puntuación de Adopción = (Instalaciones / Objetivo) × 25 + (WAU / Objetivo) × 25 + (Bonificación de Velocidad) + (Bonificación de Uso)**

Instalaciones objetivas: Bronce=10, Plata=50, Oro=200. Si se excede, limitado a 100 puntos.

---

## 3. Satisfacción del Usuario (20%)

**Medición:** Calificación promedio, sentimiento de reseñas, tasa de resolución de problemas, NPS.

| Métrica | Oro | Plata | Bronce |
|--------|------|--------|--------|
| **Calificación Promedio** | 4.5+ | 4.0+ | 3.5+ |
| **Conteo de Reseñas** | 20+ reseñas | 10+ reseñas | 5+ reseñas |
| **Tasa de Resolución de Problemas** | 95%+ problemas resueltos | 85%+ problemas resueltos | 70%+ problemas resueltos |
| **Sentimiento (Reseñas Positivas)** | 80%+ positivas | 70%+ positivas | 60%+ positivas |
| **NPS (si está disponible)** | 50+ | 40+ | 30+ |

**Puntuación de Satisfacción = (Calificación × 25) + (Tasa de Resolución × 25) + (Sentimiento × 25) + (Bonificación NPS × 25)**

---

## 4. Mantenimiento (20%)

**Medición:** Recencia de actualizaciones, actualización de dependencias, tiempo de respuesta a problemas, frecuencia de confirmación.

| Métrica | Oro | Plata | Bronce |
|--------|------|--------|--------|
| **Días desde la Última Actualización** | 30 días | 90 días | 180 días |
| **Edad de Dependencias** | 90% versiones actuales | 80% versiones actuales | 70% versiones actuales |
| **Tiempo Promedio de Respuesta a Problemas** | 48 horas | 1 semana | 2 semanas |
| **Frecuencia de Confirmación** | Mensualmente o más | Trimestralmente o más | Semestralmente o más |
| **Problemas Críticos Pendientes** | 0 | 0 | 0 (anteriores a 60 días) |

**Puntuación de Mantenimiento = (Bonificación de Recencia × 25) + (Actualización de Dependencias × 25) + (Tiempo de Respuesta × 25) + (Frecuencia de Confirmación × 25)**

Puntuación de tiempo de respuesta:
- ≤48 horas: 100 puntos
- ≤1 semana: 80 puntos
- ≤2 semanas: 60 puntos
- >2 semanas: 40 puntos

---

## 5. Documentación (20%)

**Medición:** Completitud del README, calidad de ejemplos, comentarios en línea, claridad, precisión.

| Componente | Excelente (90-100) | Bueno (70-89) | Aceptable (50-69) | Deficiente (Inferior a 50) |
|-----------|-------------------|--------------|-------------------|-----------------|
| **README** | Secciones completas; casos de uso claros; instalación 5 min | La mayoría de secciones presentes; algunas brechas; instalación 10 min | Información básica presente; secciones poco claras; instalación 15+ min | Incompleto; confuso; no funcional |
| **Ejemplos** | 3+ ejemplos completos con explicaciones | 2 ejemplos funcionales; algunas explicaciones | 1 ejemplo; explicación mínima | Ejemplos faltantes o no funcionales |
| **CLAUDE.md** | Instrucciones claras; todas las características explicadas | La mayoría de instrucciones presentes; algunas brechas | Instrucciones básicas; incompletas | Faltante o poco clara |
| **Comentarios de Código** | Funciones/algoritmos documentados; intención clara | Secciones clave comentadas | Comentarios dispersos | Sin comentarios significativos |
| **Precisión** | Mejores prácticas actuales; sin errores | Elementos levemente obsoletos; mayormente precisos | Algunos patrones obsoletos; inexactitudes menores | Significativamente obsoleto; errores mayores |

**Puntuación de Documentación = (README × 25) + (Ejemplos × 25) + (CLAUDE.md × 25) + (Comentarios × 15) + (Precisión × 10)**

---

## Umbrales de Uso

### Mínimos de Instalación

La certificación requiere conteos mínimos de instalación sobre una ventana de medición:

**Bronce:** 10+ instalaciones (cualquier período)
**Plata:** 50+ instalaciones durante 90 días
**Oro:** 200+ instalaciones durante 180 días

Las instalaciones se rastrean a través de:
- Descargas de paquetes npm (para stacks basados en CLI)
- Clones del repositorio de GitHub
- Seguimiento de instalación del marketplace de Claude Code
- Instalaciones informadas directamente por el autor (con verificación)

### Mínimos de Calificación

**Bronce:** Promedio de 3.5+ (se requieren 5+ reseñas para cálculo)
**Plata:** Promedio de 4.0+ (se requieren 10+ reseñas para cálculo)
**Oro:** Promedio de 4.5+ (se requieren 20+ reseñas para cálculo)

Las calificaciones se normalizan a una escala de 5 puntos. El conteo de reseñas debe cumplir con el mínimo antes de que la puntuación se considere válida.

### Umbrales de Actividad

**Bronce:** Actualizado dentro de 6 meses
**Plata:** Actualizado dentro de 3 meses
**Oro:** Actualizado dentro de 1 mes

Las actualizaciones incluyen:
- Confirmaciones de código a la rama principal
- Actualizaciones de documentación
- Incrementos de dependencias
- Respuestas a problemas

---

## SLAs de Mantenimiento

### SLA de Bronce

- Responde a todos los problemas dentro de 2 semanas
- Corrige errores críticos dentro de 2 semanas
- Aplica actualizaciones de dependencias de ruptura dentro de 1 mes
- Actualiza la documentación para cambios de API dentro de 2 semanas

### SLA de Plata

- Responde a todos los problemas dentro de 1 semana
- Corrige errores críticos dentro de 2 semanas
- Evalúa todas las actualizaciones de dependencias dentro de 2 semanas
- Mantiene la documentación actualizada con cambios de características
- Lanzamientos mensuales o trimestrales

### SLA de Oro

- Responde a todos los problemas dentro de 48 horas
- Corrige errores críticos dentro de 5 días hábiles
- Evalúa y aplica todas las actualizaciones de dependencias dentro de 1 semana
- Mantiene la documentación sincronizada con el código (dentro de 1 semana)
- Lanzamientos mensuales o desarrollo activo
- Auditorías de seguridad proactivas (mínimo anual)

---

## Período de Medición

**Certificación Inicial:** Basado en los últimos 90 días de actividad
**Recertificación:** Basado en una ventana móvil de 365 días

---

## Casos Extremos

### Stacks Nuevos

Los stacks menores a 90 días pueden solicitar certificación Bronce si:
- La puntuación de calidad del código es 50+
- La documentación está completa
- La revisión manual confirma calidad

Los criterios basados en instalación se renuncian para los primeros 90 días.

### Idioma y Localización

La documentación en inglés es obligatoria para todos los niveles.

**Plata y Oro:** Requieren al menos un idioma adicional (FR, DE, ES o NL)

### Stacks Comunitarios vs. Oficiales

Los criterios de certificación son idénticos independientemente del modelo de mantenimiento. El estado oficial (mantenedor tushar2704) no otorga certificación automática.

---

## Auditoría y Verificación

El equipo central realiza auditorías puntuales:
- Descarga y prueba la funcionalidad de la stack
- Verifica el conteo de instalaciones y calificaciones
- Revisa las confirmaciones recientes y las respuestas a problemas
- Confirma la precisión de la documentación
- Escaneo de seguridad para vulnerabilidades comunes

Los auditorios ocurren:
- Antes de la aprobación de certificación inicial
- Trimestralmente para stacks de nivel Oro
- Anualmente para stacks de nivel Plata
- Cada 18 meses para stacks de nivel Bronce

---

## Apelaciones

Si un stack se niega certificación o se degrada:

1. El autor puede solicitar aclaración (dentro de 1 semana)
2. El equipo central proporciona desglose detallado de puntuación
3. El autor puede repostularse después de abordar problemas identificados (después de 2 semanas)
4. Si está insatisfecho con la retroalimentación, escale a marketplace@claudient.dev para revisión independiente

---

**Última actualización:** 15 de junio de 2026
