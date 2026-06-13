---
name: referral-program
description: "Diseño de programa de referencia: estructura de incentivos, mecánica de referencia, configuración de seguimiento, solicitudes por correo electrónico/in-app, prevención de fraude — para SaaS, ecommerce y productos de consumidor"
---

# Referral Program Skill

## Cuándo activar
- Diseñar un programa de referencia o de boca en boca desde cero
- Mejorar la conversión o participación en un programa de referencia existente
- Elegir entre modelos de incentivos de referencia (dar/obtener, unilateral, efectivo, créditos)
- Escribir invitaciones por correo electrónico de referencia y copie de página de inicio
- Configurar seguimiento de referencia y prevención de fraude

## Cuándo NO usar
- Marketing de afiliación (canal de socio, basado en comisión) — mecánica y contratos diferentes
- Campañas de influencers — usa la habilidad brand-guidelines o social-media-manager
- Programas de socios/revendedores — ventas de canal, no referencias

## Instrucciones

### Diseño del programa de referencia

```
Diseña un programa de referencia para [producto].

Tipo de producto: [SaaS / ecommerce / aplicación de consumidor / mercado]
Modelo de negocio: [suscripción / compra única / freemium]
LTV cliente promedio: $[X]
CAC actual (costo de adquisición): $[X]
Objetivo de adquisición primaria: [nuevos registros / primeras compras / conversiones pagadas]

Marco de diseño:

1. A quién pedir referencias:
   - Timing: pedir después del momento aha, no en el registro
   - Mejores disparadores: después del primer momento de éxito / después de revisión positiva / en la actualización
   - Segmento: los usuarios de poder se refieren más que los usuarios promedio; filtrar para cohorte comprometida

2. Estructura de incentivos (elegir según economía del producto):
   a. Dar/Obtener (ambos lados ganan):
      El remitente obtiene: [X crédito / X meses gratis / efectivo]
      El remitido obtiene: [X crédito / prueba extendida / descuento]
      Mejor para: SaaS, productos de suscripción
   
   b. Unilateral (solo remitente):
      El remitente obtiene: comisión en efectivo o crédito por conversión
      Mejor para: productos de margen alto, modelos similares a afiliación
   
   c. Donación benéfica:
      El remitente elige una caridad; donas $X por referencia
      Mejor para: B2B, donde el efectivo se siente transaccional

3. Calibración de incentivos:
   - Tope de costo de referencia en 20-30% de LTV para viabilidad
   - Si LTV = $[X], costo máximo de referencia = $[X × 0.25]
   - Desencadenar pago solo en conversión pagada, no en registro (prevención de fraude)

4. Mecánica de referencia:
   - Enlace de referencia único por usuario (no solo código — los enlaces rastrean mejor)
   - Plantillas de correo electrónico + compartir social preescritas
   - Panel de control: remitente puede ver a quién invitó y el estado

Diseño de programa recomendado para mi producto con números de incentivos específicos.
```

### Plantillas de correo electrónico de referencia

```
Escribe correos electrónicos del programa de referencia para [producto].

Producto: [describe]
Incentivo: [remitente obtiene X, remitido obtiene Y]
Enlace de referencia placeholder: [REFERRAL_URL]
Tono de marca: [profesional / casual / lúdico]

Correo 1 — Invitación de referencia (del remitente al remitido):
Asunto: [con sensación personal, no corporativo — desde la perspectiva del remitente]
Previsualización: [lo que van a obtener]
Cuerpo:
- Abridor personal (escrito como si viniera del remitente, no de la empresa)
- Descripción de producto de 1 oración usando lenguaje de prueba social
- La oferta: "Obtén [X] cuando te registres con mi enlace"
- [REFERRAL_URL]
- Mantén bajo 100 palabras

Correo 2 — Anuncio del programa de referencia (a usuarios existentes):
Asunto: [Dar [X], Obtener [X] — comparte [producto] con tu equipo]
Objetivo: impulsa la participación de la base de usuarios actual
Cuerpo:
- Comienza con su recompensa (no el beneficio del producto)
- Explicación simple de cómo funciona (máximo 3 pasos)
- CTA: "Obtén mi enlace de referencia" → enlace al panel de control
- Botones para compartir en redes sociales preconfigurados

Correo 3 — Recordatorio a no participantes (14 días después del lanzamiento):
Asunto: [Aún no has probado nuestro programa de referencia]
Objetivo: convertir no participantes con prueba social
Cuerpo:
- "[X] usuarios ya han ganado [recompensa] este mes"
- Eliminación de fricción: "Toma 30 segundos obtener tu enlace"
- CTA: igual que Correo 2

Correo 4 — Notificación de referencia recibida (al remitente):
Asunto: [[Nombre] se acaba de registrar con tu enlace]
Objetivo: refuerza participación, impulsa segunda referencia
Cuerpo:
- Confirmación: "[Nombre] se registró! Obtendrás [recompensa] cuando [conviertan]."
- Progreso si aplica: "Has referido [X] — [Y más] hasta [nivel de bonificación]"
- "¿Conoces a alguien más?" — CTA secundario

Escribe los 4 correos para mi producto.
```

### Página de inicio de referencia

```
Escribe copie de página de inicio de referencia para [producto].

URL de página: /invite o /referral
Contexto del visitante: llegó a través de enlace de referencia de amigo/colega
Su conocimiento del producto: cero a bajo
La oferta que recibieron: [X]
Beneficio del producto en una línea: [describe]

Estructura de página:

Héroe:
- Encabezado: "[Nombre del amigo] te invitó a [producto]" (personalizado a través de parámetro URL)
- Subencabezado: lo que el producto hace en inglés simple
- La oferta: "[X] gratis cuando te registres hoy"
- CTA: "Reclama [X] y comienza" (texto de botón basado en acción)

Prueba social (abajo):
- [X] clientes / [X] equipos / [X] ingresos rastreados
- 1-2 testimonios cortos

Cómo funciona (3 pasos):
1. Crea tu cuenta (30 segundos)
2. [Primera acción clave] para comenzar
3. [Momento aha] — [recompensa desbloqueada]

Preguntas frecuentes (2-3 preguntas):
- "¿Qué obtengo gratis?" → responder específicamente
- "¿Necesito una tarjeta de crédito?" → responder
- "¿Qué sucede después de [período de prueba/recompensa]?" → responder

CTA (repetido abajo): igual que héroe

Escribe copie de página completa con todas las secciones.
```

### Prevención de fraude

```
Diseña prevención de fraude para un programa de referencia.

Tipo de recompensa: [crédito de cuenta / pago en efectivo / meses gratis]
Disparador de pago: [en registro / en primera compra / en conversión pagada después de 30 días]
Nivel de riesgo: [recompensa de bajo valor / recompensa de alto valor]

Patrones de fraude comunes:
1. Autoreferencia: usuario crea segunda cuenta para referirse a sí mismo
2. Registros falsos: remitente crea cuentas ficticias para cobrar recompensas
3. Fraude de contracargo: compra completa → cobra recompensa de referencia → contracargo
4. Creación masiva de cuentas: scripts creando cientos de cuentas

Medidas de prevención:

Comprobaciones de identidad:
□ Deduplicación de dominio de correo electrónico (bloquea variaciones del mismo dominio: user+1@, user+2@)
□ Dirección IP: marca registros múltiples desde la misma IP dentro de 24h (no bloquea — marca para revisión)
□ Huella digital del dispositivo: marca el mismo dispositivo registrándose múltiples veces
□ Verificación telefónica para recompensas por encima de $[X]

Retraso de pago:
□ Retardar crédito de recompensa por [30-60 días] — pasado la ventana de contracargo
□ No pagar hasta que el usuario referido haya estado activo [X días] o haya realizado [X] acciones

Autoreferencia:
□ Bloquea el mismo dominio de correo electrónico en ambas cuentas
□ Marca si la dirección de facturación coincide con cliente existente

Tapas de pago:
□ Máximo [X] referencias recompensadas por usuario por mes
□ Revisión manual requerida por encima de [X] referencias/mes

Implementa estos controles clasificados por esfuerzo vs. riesgo de fraude para mi programa.
```

## Ejemplo

**Usuario:** Nuestro SaaS ($49/mes, LTV promedio de 18 meses = $882) no tiene programa de referencia. Los clientes nos dicen frecuentemente que nos recomiendan a colegas. Estamos dejando dinero en la mesa. Diseña uno.

**Recomendación de Claude:**

Con LTV de $882, puedes permitirte hasta $220 en costo de referencia (25% de LTV) y aún así estar por delante de la mayoría de canales pagados.

**Diseño del programa:**

**Dar/Obtener: crédito de $50 para remitente + crédito de $50 para remitido**

Porqué créditos, no efectivo:
- Los créditos cuestan ~0 para ti (se aplican a suscripción futura)
- Los usuarios permanecen comprometidos para canjearlos
- Efectivo en $50 por conversión es impacto real en P&L

**Mecánica:**
- Enlace de referencia (no código) — se genera en la página Configuración de Cuenta
- Disparador de pago: remitido permanece en plan pagado durante 30 días (previene fraude de contracargo)
- Panel de control: "Has referido X personas → $Y ganado"
- Tope: 10 referencias recompensadas por usuario por trimestre

**Cuándo preguntar:**
No preguntes en el registro. Pregunta:
1. Después de que hayan exportado su primer informe (momento aha)
2. Después de su primera puntuación NPS ≥ 9
3. Después del mes 3 de uso activo (señal de lealtad)

**Matemáticas proyectadas:**
Si el 5% de tu base de usuarios refiere 1 persona y el 40% de esos se convierten → costo por cliente adquirido = $125 (muy por debajo de tu CAC actual). Esto típicamente retorna 15-25% del nuevo crecimiento en programas de referencia maduros.

**Secuencia de lanzamiento:**
1. Construye generación de enlace de referencia (1 sprint de desarrollo)
2. Correo a clientes existentes anunciando el programa
3. Añade solicitud in-app en los 3 momentos de disparo anteriores
4. Mide tasa de participación semanalmente; itera el incentivo si < 5% participa

---
