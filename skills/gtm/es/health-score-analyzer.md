---
name: health-score-analyzer
description: "Análisis de puntuación de salud del cliente: señales de uso, señales de relación, señales comerciales, calificación de riesgo de cancelación y recomendación de intervención de CS para cada cuenta"
---

# Habilidad Health Score Analyzer

## Cuándo activar
- Ejecutando tu revisión semanal de clientes en riesgo y necesitas un análisis estructurado
- Tienes datos de uso del producto sin procesar y quieres traducirlos a una puntuación de salud
- Un cliente se ha quedado en silencio o ha mostrado comportamiento inusual y quieres una calificación de riesgo
- Construyendo o recalibrando tu modelo de puntuación de salud después de una ola de cancelaciones inesperadas
- Preparando la revisión de portafolio de tu equipo de CS para la semana — ¿qué cuentas necesitan atención?
- Quieres puntuar una cuenta antes de una conversación de renovación o expansión

## Cuándo NO usar
- Construyendo el sistema de puntuación de salud inicial desde cero — usa `/customer-success` para el diseño del modelo
- Análisis profundo del producto para decisiones internas de producto — función diferente
- Determinar si un cliente está listo para ser una referencia o caso de estudio — señal separada
- Puntuación de calificación de ventas para prospectos — eso es territorio de puntuación de leads

## Instrucciones

### Análisis de salud de una sola cuenta

```
Analiza la salud de esta cuenta de cliente y dame una calificación de riesgo.

Cliente: [Nombre de la empresa]
ARR: $[X]
Renovación: [fecha / X meses de distancia]
Tipo de contrato: [mensual / anual / plurianual]
CSM: [nombre]
Permanencia: [X meses / años como cliente]

SEÑALES DE USO — extrae de tus análisis del producto:
- Último inicio de sesión (equipo): [fecha — ¿hace cuántos días?]
- Frecuencia de inicio de sesión este mes: [X inicios de sesión] vs. el mes pasado: [X inicios de sesión]
- Uso de la función principal: [¿cuál es su caso de uso principal, y lo están usando?]
  - Función A: [X veces este mes / no utilizada]
  - Función B: [X veces este mes / no utilizada]
- Usuarios activos: [N de N asientos con licencia] = [X%] de utilización de asientos
- Tendencia de uso: [creciendo / estable / disminuyendo — en los últimos 3 meses]
- Última acción en el producto: [describe lo que hicieron más recientemente]

SEÑALES DE RELACIÓN:
- Último contacto del CSM: [fecha — hace X días] [llamada / correo / reunión]
- Estado del defensor: [fuerte / débil / sin defensor identificado / el defensor se fue]
- Patrocinador ejecutivo: [comprometido / no comprometido / desconocido]
- Puntuación NPS: [X — promotor / pasivo / detractor] [fecha de la última encuesta]
- Tickets de soporte en los últimos 90 días: [N tickets] — tipos: [describe]
- ¿Algún ticket sobre exportación de datos, acceso a API o menciones de competidores? [sí/no]
- Tiempo de respuesta al contacto del CSM: [rápido / lento / sin respuesta]

SEÑALES COMERCIALES:
- Estado de facturas: [al día / X días vencida]
- Descuento aplicado: [X% — mayor descuento = menor costo de cambio]
- Tendencia de crecimiento del contrato: [expandido / estable / contraído desde el inicio]
- Estabilidad de las partes interesadas: [¿algún contacto clave dejó la empresa?]
- Señales de presupuesto: [¿alguna señal de presión presupuestaria o reorganización?]

SEÑALES COMPETITIVAS (si se conocen):
- ¿Se mencionó algún competidor en tickets de soporte o llamadas? [sí/no — ¿qué competidor?]
- ¿Solicitud de RFP o comparación de precios? [sí/no]
- Actividad de LinkedIn del defensor: [todavía defendiendo tu producto / en silencio / se fue]

---

Produce:

PUNTUACIÓN DE SALUD: [0-100]
Nivel de salud: [VERDE 70-100 / AMARILLO 40-69 / ROJO 0-39]
Probabilidad de cancelación: [BAJA / MEDIA / ALTA / CRÍTICA]

Las 3 principales señales de riesgo (de mayor a menor importancia):
1. [Señal] — [gravedad] — [qué significa]
2. [Señal] — [gravedad] — [qué significa]
3. [Señal] — [gravedad] — [qué significa]

Las 2 principales señales positivas:
1. [Señal]
2. [Señal]

Intervención recomendada:
- [Acción 1 — quién la hace, cuándo]
- [Acción 2 — quién la hace, cuándo]
- ¿Se necesita escalamiento? [sí / no — y a qué nivel]

Pronóstico de renovación: [probable que renueve / en riesgo / probable que cancele]
Potencial de expansión: [ninguno / posible en X meses / listo para discutir ahora]
```

### Revisión de salud del portafolio

```
Ejecuta una revisión de salud del portafolio en mis cuentas de clientes.

CSM: [nombre]
Total de cuentas: [N]
ARR total gestionado: $[X]

[Pega los datos de la cuenta en este formato, una fila por cliente:]

| Cuenta | ARR | Renovación | Último inicio de sesión | Asientos activos | NPS | Último contacto | Problemas |
|---|---|---|---|---|---|---|---|
| Empresa A | $24K | 2 meses | hace 12 días | 8/10 | 42 | hace 8 días | Ninguno |
| Empresa B | $60K | 5 meses | hace 45 días | 3/10 | 18 | hace 21 días | Ticket de soporte abierto |
| Empresa C | $12K | 1 mes | hace 3 días | 10/10 | 67 | hace 5 días | Ninguno |
[continuar para todas las cuentas]

Produce:

## Resumen de Salud del Portafolio
- ARR total en riesgo (cuentas rojas): $[X] ([X%] del portafolio)
- ARR total en amarillo: $[X]
- ARR total saludable (verde): $[X]
- Cuentas que necesitan acción inmediata: [N]

## Niveles de Riesgo de Cuentas

ROJO — Acción inmediata requerida:
| Cuenta | ARR | Renovación | Señal de riesgo | Acción |
|---|---|---|---|---|
| [Empresa] | $[X] | [X meses] | [riesgo principal] | [acción específica] |

AMARILLO — Monitoreo activo:
[misma tabla]

VERDE — Saludable / listo para expansión:
[misma tabla]

## Lista de Prioridades de CS de Esta Semana
1. [Cuenta] — [por qué es urgente] — [acción específica]
2. [Cuenta] — [por qué es urgente] — [acción específica]
3. [Cuenta] — [por qué es urgente] — [acción específica]

## Renovaciones en los próximos 60 días — preparación para la renovación:
| Cuenta | ARR | Fecha de renovación | Salud | Acción necesaria |
|---|---|---|---|---|
[tabla]

## ARR en riesgo este trimestre: $[X]
Estimación de recuperación conservadora (si se toman medidas): $[X]
```

### Detección de señales de cancelación

```
Analiza estas señales del cliente y dime el riesgo de cancelación.

Cliente: [Empresa]
Contrato: $[X] ARR, renueva [fecha]

Señales a evaluar:
[Describe lo que has observado — pega correos electrónicos, resúmenes de tickets de soporte, datos de uso o notas de llamadas]

Utiliza este marco de puntuación de señales de cancelación:

DETERIORO DE USO (más predictivo):
- Inicios de sesión cayeron > 30% mensual: señal de riesgo ALTO
- Función principal no utilizada en > 30 días: señal de riesgo ALTO
- Utilización de asientos cayó por debajo del 40%: señal de riesgo MEDIO
- Sin nuevos usuarios agregados en > 60 días: señal de riesgo MEDIO

DETERIORO DEL COMPROMISO:
- Contacto del CSM sin respuesta en > 7 días: señal de riesgo ALTO
- Patrocinador ejecutivo desaparecido: señal de riesgo ALTO
- El defensor dejó la empresa: CRÍTICO — tratar como trato nuevo
- El cliente falta o cancela llamadas programadas: señal de riesgo ALTO
- NPS cayó de Promotor a Pasivo o de Pasivo a Detractor: señal de riesgo MEDIO

SEÑALES COMERCIALES:
- Factura > 30 días vencida: señal de riesgo ALTO
- Preguntó sobre términos del contrato, proceso de cancelación o exportación de datos: CRÍTICO
- Solicitó descuento sin una razón de expansión declarada: señal de riesgo MEDIO
- Reducción de personal o congelación de presupuesto en su empresa: señal de riesgo MEDIO

SEÑALES COMPETITIVAS:
- Mencionó a un competidor por nombre: señal de riesgo ALTO
- Solicitó comparación de precios o RFP: CRÍTICO
- LinkedIn muestra que el defensor ahora usa el producto de un competidor: CRÍTICO

Puntúa las señales y produce:
- Probabilidad de cancelación: [X%] — derivada del número y gravedad de las señales
- Horizonte temporal: probable que cancele en [30 / 60 / 90+ días]
- Hipótesis sobre la causa raíz: [por qué está ocurriendo esto — ajuste del producto / soporte / cambio de negocio / vendido incorrectamente]
- Manual de rescate: [secuencia específica de acciones para este perfil de riesgo específico]
- Escalamiento: [quién más debe ser involucrado y por qué]
```

### Calibración del modelo de puntuación de salud

```
Ayúdame a calibrar mi modelo de puntuación de salud basado en datos de cancelación recientes.

Contexto:
- Cuentas canceladas el trimestre pasado: [N cuentas, total $X ARR]
- ¿Qué tenían en común las cuentas canceladas? [describe los patrones que observaste]
- ¿Cuál era su puntuación de salud el mes antes de que cancelaran? [si lo rastreaste]
- Cuentas que renovaron inesperadamente a pesar de salud baja: [¿algún ejemplo?]

Modelo de puntuación de salud a revisar:
Pesos actuales:
- Señales de uso: [X%]
- Señales de relación: [X%]
- Señales comerciales: [X%]
- Señales de resultados: [X%]

Definiciones de señales actuales:
[describe qué mides para cada una]

Análisis de calibración:

1. ¿Qué señales fueron indicadores adelantados (aparecieron antes de la cancelación)?
   Las mejores señales de salud predicen la cancelación con 60-90 días de anticipación — no 2 semanas antes.

2. ¿Qué señales fueron rezagadas (solo visibles en la cancelación, demasiado tarde para actuar)?
   Las facturas vencidas y las solicitudes de cancelación son rezagadas — para entonces es modo de crisis, no de prevención.

3. Falsos positivos — cuentas que puntuaron rojo pero renovaron:
   ¿Qué fue diferente en ellas? Ajusta el peso para reducir la fatiga de falsas alarmas.

4. Falsos negativos — cuentas que puntuaron verde pero cancelaron:
   ¿Qué señal faltaba? Agrégala o aumenta su peso.

5. Ajuste de peso recomendado:
   Antes: [pesos actuales]
   Después: [pesos recomendados basados en precisión predictiva]
   Justificación: [por qué cada cambio]

6. Nuevas señales a agregar:
   - [Señal] — fuente de datos: [dónde obtenerla] — adelantada/rezagada: [tipo]

Produce el modelo de puntuación de salud actualizado con pesos recalibrados y definiciones de señales.
```

## Ejemplo

**Usuario:** Una de mis cuentas de $85K ARR se ha quedado en silencio. El defensor no ha respondido a dos correos en 3 semanas. El uso parece bien en la superficie (están iniciando sesión) pero es solo una persona. Renuevan en 8 semanas. ¿Qué hago?

**Análisis de salud de Claude:**

**Puntuación de Salud: 34/100 — ROJO**
**Probabilidad de cancelación: ALTA — riesgo materializándose ahora**

**Lo que describes es una señal de uso de falso positivo clásica:**
Una persona iniciando sesión para mantener la cuenta "activa" mientras la decisión de compra ocurre detrás de escena. La adopción real es 1 persona, no un equipo. Eso no es una señal de uso — es una señal de responsabilidad.

**Señales de riesgo activas:**
1. Defensor sin respuesta x 2 intentos (ALTO) — o ya no son tu defensor, o la conversación se ha movido por encima de su nivel
2. Adopción de un solo usuario (ALTO) — el producto nunca logró adopción en el equipo; no hay partes interesadas internas con algo en juego
3. 8 semanas para la renovación sin compromiso (CRÍTICO) — te quedaste sin tiempo para los movimientos normales de CS

**Intervención recomendada — haz esto esta semana, no la próxima:**

1. **Rodea al defensor.** Encuentra a su gerente o al comprador económico en LinkedIn. Envía un correo breve y directo: "He intentado contactar a [Nombre] y no he recibido respuesta. Quiero asegurarme de que [Empresa] obtenga el valor completo de su inversión con nosotros de cara a la renovación — ¿podemos conectarnos durante 20 minutos este mes?"

2. **Usa los datos del producto como gancho.** Envía un correo al defensor (un intento más): "Revisé los datos de uso de tu equipo antes de tu renovación y noté que estamos usando poco [función] que típicamente genera [resultado específico] para equipos como el tuyo. Me encantaría mostrarte qué están haciendo otras empresas de [industria] — ¿15 minutos esta semana?"

3. **Informa a tu AE ahora.** No los sorprendas a 2 semanas de la renovación. Pueden tener una relación a nivel ejecutivo.

**Si no obtienes respuesta en 5 días:** Escala internamente. Haz que tu VP envíe un correo directo a quien firmó el contrato original. Enmarcarlo como una revisión de negocio, no como un empuje de renovación.

**Potencial de expansión: Ninguno hasta que se restaure la salud.**

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
