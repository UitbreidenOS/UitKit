# Flujo de trabajo de lanzamiento de funciones

Proceso de extremo a extremo para lanzar una función de producto — desde el desarrollo final hasta la comunicación y el monitoreo.

## Cuándo usar

Utilice este flujo de trabajo para cualquier lanzamiento de función que:
- Afecte más del 10% de su base de usuarios
- Afecte flujos de pago, autenticación o funcionalidad de producto principal
- Implique integraciones externas o API en las que otros servicios dependan
- Algo con un anuncio de marketing adjunto

## Fase 1: Preparación de lanzamiento (1 semana antes)

**Lista de verificación de ingeniería:**
- [ ] Todos los criterios de aceptación de la especificación se cumplen
- [ ] El código se ha revisado y aprobado
- [ ] Pruebas unitarias e integración aprobadas
- [ ] Pruebas E2E aprobadas en staging
- [ ] Desempeño probado: sin regresión en latencia p99
- [ ] Bandera de función configurada para lanzamiento gradual
- [ ] Eventos de análisis instrumentados y verificados
- [ ] Plan de reversión documentado y probado
- [ ] Alertas de monitoreo configuradas para nuevos caminos de código

**Lista de verificación del producto:**
- [ ] Función probada por PM en staging contra criterios de aceptación
- [ ] Casos extremos probados (estado vacío, estado de error, móvil)
- [ ] Documentación de ayuda escrita o actualizada
- [ ] Información sobre herramientas o incorporación en la aplicación para la nueva interfaz de usuario (si aplicable)
- [ ] Métricas de éxito definidas y línea de base capturada

**Lista de verificación de diseño:**
- [ ] La implementación final coincide con los diseños aprobados
- [ ] Respuesta en móvil (si web)
- [ ] Accesibilidad: navegación por teclado, lector de pantalla, contraste de colores
- [ ] Estados de carga y error implementados

## Fase 2: Preparación de comunicación (3-5 días antes)

**Comunicación interna:**
- [ ] Equipo de ingeniería informado sobre qué se lanza y cuándo
- [ ] Equipo de éxito del cliente informado (qué hay de nuevo, preguntas esperadas del cliente)
- [ ] Equipo de ventas informado si afecta lo que pueden demostrar o vender
- [ ] El equipo de soporte tiene documentación para manejar preguntas comunes

**Comunicación externa (si es orientada al cliente):**
- [ ] Entrada de registro de cambios escrita
- [ ] Anuncio en la aplicación redactado (si es necesario)
- [ ] Correo electrónico a usuarios afectados redactado (si es necesario)
- [ ] Publicación de blog o redes sociales preparada (si es significativo)
- [ ] Prensa / PR coordinada (si es lanzamiento importante)

## Fase 3: Ejecución de lanzamiento

**Día de lanzamiento:**

```
1. Confirme que todos los elementos de la lista de verificación de prelanzamiento se han completado
2. Notificar al equipo en Slack: "Lanzando [Función] a [hora]"
3. Habilitar bandera de función para [X]% de usuarios (comenzar pequeño: 5-10%)
4. Monitorear durante 30 minutos:
   - Tasa de error en nuevos caminos de código
   - Latencia p99 sin cambios
   - Las métricas de negocio principal no retroceden
5. Si está sano: aumentar a 50%, esperar 30 min
6. Si está sano: aumentar a 100%
7. Anunciar en Slack: "La función está activa para el 100% de usuarios ✅"
8. Publicar entrada de registro de cambios / publicación de blog si se preparó
```

**Disparador de reversión:** Si la tasa de error aumenta >2x línea de base o los errores orientados al usuario aumentan → deshabilitar inmediatamente la bandera de función e investigar.

## Fase 4: Monitoreo posterior al lanzamiento (24-72 horas)

**Rastrear durante 48 horas después del lanzamiento:**
- [ ] Tasa de error vuelve a la normalidad
- [ ] Latencia p99 vuelve a la normalidad
- [ ] Métrica de éxito principal se mueve en la dirección correcta
- [ ] Volumen de ticket de soporte: sin pico relacionado con la función
- [ ] Comentarios del usuario (si aplicable): NPS, reacciones en la aplicación

**Abordar rápidamente:**
- Errores que los usuarios reportan en las primeras 24 horas (los clientes son más indulgentes inmediatamente después del lanzamiento)
- Patrones de interfaz de usuario confusos señalados por el soporte
- Casos extremos que superaron las pruebas

## Fase 5: Revisión (1 semana después)

**Retrospectiva de función (15 minutos asincrónico o sincrónico):**
1. ¿La función alcanzó las métricas de éxito que definimos?
2. ¿Qué comentarios de los usuarios recibimos?
3. ¿Qué salió bien en el proceso de lanzamiento?
4. ¿Qué haríamos diferente la próxima vez?
5. ¿Se identifica algún trabajo de seguimiento (errores, mejoras, ideas v2)?

**Actualizar la hoja de ruta:**
- Archivo de especificación de función con resultado real vs. resultado predicho
- Añadir elementos de seguimiento al backlog
- Publicar aprendizajes internos (especialmente si algo sorprendente sucedió)

## Tipos de lanzamiento y el proceso correcto para cada uno

| Tipo | Audiencia | Despliegue | Comunicación | Monitoreo |
|---|---|---|---|---|
| **Mayor** | Todos los usuarios, flujo principal | Bandera de función, 5→50→100% | Email + en la aplicación + blog | 72h monitoreo activo |
| **Moderado** | Segmento específico | Gradual | En la aplicación o correo electrónico | 48h monitoreo activo |
| **Menor** | Todos los usuarios, no-core | Directo a 100% | Solo registro de cambios | 24h pasivo |
| **Interno** | Solo equipo | Directo | Slack | Monitoreo estándar |
| **Beta** | Usuarios de opción | Solo invitación | Correo electrónico de invitación | Verificación semanal |

---
