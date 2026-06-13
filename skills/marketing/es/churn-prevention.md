---
name: churn-prevention
description: "Prevención de churn: identifica clientes en riesgo, playbooks de intervención, diseño de oferta de retención, análisis de encuestas de salida, campañas de recuperación"
---

# Habilidad de Prevención de Churn

## Cuándo activar
- Identificar clientes que corren riesgo de cancelar
- Diseñar una intervención cuando un cliente muestra señales de churn
- Analizar respuestas de encuestas de salida para encontrar patrones
- Construir una campaña de recuperación para clientes que recientemente han desertado
- Calcular y reducir tu tasa de churn mensual

## Cuándo no usar
- Predicción de churn en tiempo real — necesita un modelo ML dedicado o herramienta (ChurnZero, Gainsight)
- Gestión del éxito del cliente para cuentas empresariales — usa plataforma CS dedicada

## Instrucciones

### Identificar clientes en riesgo

```
Ayúdame a identificar clientes en riesgo de estos datos de uso/engagement:

[pega o describe las señales a las que tienes acceso]:
- Cambios en frecuencia de inicio de sesión
- Declive en uso de características
- Aumento en volumen de tickets de soporte
- Problemas de facturación / pagos fallidos
- Características clave no utilizadas (especialmente si pagaron por ellas)
- Puntuación NPS baja (0-6 = detractores)
- No responde a outreach de CS

Para cada señal, dime:
1. ¿Qué tan fuerte es esto un indicador de churn?
2. ¿Qué intervención debo desencadenar?
3. ¿Qué tan urgente es el outreach?
```

### Playbook de intervención por señal

```
Diseña un playbook de intervención de churn.

Mi producto: [SaaS / servicio de suscripción / marketplace]
Segmento de cliente: [PYME / mid-market / enterprise]
Valor promedio del contrato: $[X]/mes
Tasa de churn: [X]% mensual

¿Qué debo hacer para cada señal de churn?

Señal: No ha iniciado sesión en 14 días
→ Desencadenar: [correo automatizado / llamada de CS / mensaje in-app]
→ Ángulo del mensaje: [reenganche / recordatorio de valor / oferta de ayuda]
→ Escalada si no hay respuesta: [después de X días → hacer Y]

Señal: NPS negativo enviado (0-6)
Señal: Contactado soporte 3+ veces en 30 días
Señal: Cancelado 3 de 5 asientos (cancelación parcial)
Señal: No completó onboarding

Crea el playbook con plantillas de mensajes específicas para cada desencadenante.
```

### Diseño de oferta de retención

```
Diseña una oferta de retención para clientes que han iniciado la cancelación.

Cuando hacen clic en "Cancelar", quiero ofrecer:
Precio de mi producto: $[X]/mes
Razón de churn (si se pregunta): [precio / no lo usamos / competidor / feature faltante / corte presupuestario]

Diseña ofertas de retención para cada razón:
- Preocupación de precio: [X]% de descuento durante [X] meses / opción de degradación / opción de pausa
- No lo estamos usando: sesión de onboarding 1:1 gratis + coaching de uso
- Competidor: [qué nos hace mejor / comparación específica]
- Feature faltante: [hoja de ruta / solución alternativa / captura de feedback]
- Corte presupuestario: pausa en lugar de cancelar (mantener relación)

Para cada: escriba el mensaje de la oferta de retención (< 150 palabras, honesto, no desesperado).
```

### Análisis de encuesta de salida

```
Analiza estas respuestas de encuesta de salida e identifica patrones:

[pega respuestas o describe la distribución]
Razones principales dadas: [lista]
Comentarios textuales: [pega una muestra]

De este análisis:
1. ¿Cuáles son las 3 principales razones evitables de churn?
2. ¿Qué cambios de producto o proceso abordarían cada una?
3. ¿Qué clientes desertados son más probables de recuperarse?
4. ¿Qué debo cambiar en mi onboarding para prevenir este churn?
```

### Campaña de recuperación

```
Diseña una campaña de recuperación por correo electrónico para clientes que desertaron hace [X] meses.

Razón de churn (si se conoce): [describe]
Qué ha cambiado desde que se fueron: [nuevas características / cambio de precio / mejoras]
Incentivo que puedo ofrecer: [descuento / prueba extendida / acceso a nueva característica]

Escribe una secuencia de recuperación de 3 correos:
Correo 1 (semana 4 después del churn): Check-in — "¿Cómo te va?"
Correo 2 (semana 8): "Aquí está lo nuevo desde que te fuiste"
Correo 3 (mes 6): Oferta de recuperación final con incentivo

Cada correo debe sentirse personal y sin presión.
```

### Análisis de tasa de churn

```
Ayúdame a entender y reducir mi tasa de churn.

Métricas actuales:
- Tasa de churn mensual: [X]%
- Vida promedio del cliente: [X] meses
- LTV del cliente: $[X]
- CAC: $[X]

Si reduzco churn en 1%:
- Nueva tasa de churn mensual: [X]%
- Impacto en LTV: $[X] → $[X]
- Impacto en ingresos a [X] clientes: mejora de $[X]/mes

¿Cuáles son los cambios de mayor apalancamiento que puedo hacer para reducir churn en 1% en los próximos 90 días?
```

## Ejemplo

**Usuario:** 8% de churn mensual en una herramienta SaaS de $49/mes. Las encuestas de salida muestran que 42% dicen "no lo uso lo suficiente".

**Análisis de Claude:**

Causa raíz: Falla de activación, no falla de producto. "No lo uso lo suficiente" = no llegó al valor.

**Top 3 intervenciones:**

1. **Arreglar onboarding (mayor apalancamiento):** 42% de churn debido a no-activación es un problema de onboarding. Añade un "momento de primer valor" obligatorio antes de que termine la prueba gratuita — hazlos completar una acción central que muestre el valor del producto. Objetivo: reducir este segmento a 20%.

2. **Outreach desencadenado por uso en el día 7:** Si un usuario no ha completado la acción central el día 7 de la prueba, envía un correo automatizado "¿atrapado?" con un video corto de Loom u oferta de llamada de 15 minutos. No esperes a que dejen de usar.

3. **Opción de pausa en la cancelación:** "No lo uso lo suficiente" a menudo significa ocupado, no desinteresado. Una pausa de 1 mes (sin cargo, suscripción en espera) convierte 15-25% de posibles desertores en clientes retenidos.

**Impacto proyectado:** Estos 3 cambios podrían reducir el segmento "no lo uso lo suficiente" de 42% a la mitad = ~1,6% de reducción en la tasa de churn mensual total.

---
