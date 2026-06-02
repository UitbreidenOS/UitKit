# Flujo de Trabajo Diario de SDR

## Cuándo ejecutar

Cada día hábil a las 8:00 AM. Diseñado para llenar un día estructurado de 4.5 horas (8:00 AM–12:15 PM, retomando brevemente a las 4:45–5:00 PM). Ejecutar manualmente o mediante un gancho programado para automatización diaria.

## Entradas requeridas

- **Listas de cuentas Tier 1 y Tier 2**: Exportación de CRM o hoja de cálculo con nombres de empresas y contactos clave
- **Estado de secuencia del día anterior**: cuentas activas, etapa e historial de respuestas
- **Fuentes de señales**: actualizaciones recientes de LinkedIn, anuncios de financiación, publicaciones de empleo, fuentes de noticias para cuentas objetivo
- **Plantillas de correo electrónico y marcos**: plantilla Short Trigger, plantillas de secuencia multitoque
- **Conexión CRM**: acceso para actualizar registros de contactos y crear tareas de seguimiento
- **Notas de llamadas** (si aplica): respuestas durante la noche o buzones de voz que requieren clasificación

## Pasos

### Paso 1: Revisión de Señales Matutinas (30 min, 8:00–8:30 AM)

**Tarea de Claude:**
"Revisa mis listas de cuentas Tier 1 y Tier 2 en busca de nuevas señales. Verifica: nuevas contrataciones de liderazgo, anuncios de financiación, cambios de stack tecnológico, actividad de LinkedIn de contactos objetivo, publicaciones de empleo en departamentos objetivo. Marca las señales de alta prioridad y recomienda acciones por cuenta."

**Entrada:** Lista de cuentas (nombres de empresas, contactos objetivo), fuentes de señales (LinkedIn, Crunchbase, noticias internas)

**Puntos de decisión:**
- Fortaleza de la señal: ¿Es este un fuerte gatillo para contactar? (Sí = prioridad Tier 1, Quizás = Tier 2, No = omitir)
- Disponibilidad del contacto: ¿Es el tomador de decisiones objetivo aún la persona correcta? Actualizar si hay una nueva contratación.

**Salida:** Lista de señales priorizada (5–15 cuentas) con:
- Nombre de la cuenta
- Tipo de señal (p. ej., "Nuevo VP de Ventas contratado", "Anuncio de financiación Series B")
- Nombre del contacto objetivo + rol actual
- Gancho recomendado (p. ej., "Felicitar por contratación + mencionar capacidad relevante")
- Tier de prioridad (Alto/Medio)

**Criterios de éxito:** La lista contiene solo cuentas con señales procesables; sin leads obsoletos.

---

### Paso 2: Sprint de Investigación de Cuentas (60 min, 8:30–9:30 AM)

**Tarea de Claude:**
"Para cada cuenta de alta señal del Paso 1, investiga y genera un expediente. Formato: descripción general de la empresa, mapa de tomadores de decisiones (enfoque en organigrama), 3 principales señales de dolor, gancho de personalización recomendado. Usa LinkedIn, sitio web de la empresa, noticias recientes y publicaciones de empleo."

**Entrada:** Lista de señales priorizada del Paso 1, herramientas de investigación de empresas (LinkedIn, Crunchbase, G2, sitios web de empresas)

**Puntos de decisión:**
- ¿Es la empresa un buen ajuste para nuestra solución? (Sí = proceder, No = deprioritizar)
- ¿Puedes identificar 2+ tomadores de decisiones o solo el objetivo inicial? (Múltiples = mayor confianza)
- ¿Cuál es la señal de dolor más fuerte para esta empresa? (Deuda técnica, escalado, presión competitiva, etc.)

**Salida:** Expediente de empresa por cuenta (1–2 páginas cada una):
```
[Nombre de la Empresa]

**Descripción General**
- Industria, tamaño, etapa de financiación, tasa de crecimiento
- Enfoque actual de producto/servicio
- Anuncios o noticias recientes

**Mapa de Tomadores de Decisiones**
- CEO / Fundador: [Nombre, LinkedIn]
- VP de [Función Relevante]: [Nombre, LinkedIn]
- [Otros influyentes]: [Nombres, roles]

**3 Principales Señales de Dolor**
1. [Señal de dolor + evidencia de publicación de empleo / LinkedIn / noticias]
2. [Señal de dolor + evidencia]
3. [Señal de dolor + evidencia]

**Gancho de Personalización Recomendado**
[Razón específica y concreta para contactar vinculada a la señal + nuestra solución]
```

**Criterios de éxito:** Cada expediente está 80% completo; tienes pasos siguientes claros para contacto.

---

### Paso 3: Lote de Contacto (90 min, 9:30–11:00 AM)

**Tarea de Claude:**
"Escribe Correo 1 (Asunto + Cuerpo) para cada prospecto objetivo usando el marco Short Trigger. Mantén menos de 50 palabras en el cuerpo. Luego, escribe los pasos de secuencia 2–4 para cuentas ya en secuencias activas (cadencia de días 3, 7, 12)."

**Entrada:** Expedientes de empresas del Paso 2, plantillas de correo, marco Short Trigger, lista de secuencias activas de CRM

**Puntos de decisión:**
- ¿Es este un contacto nuevo (Correo 1) o seguimiento en una secuencia activa? (Las rutas difieren)
- ¿Ha respondido ya este prospecto? (Sí = omitir secuenciación, pasar al Paso 4)
- ¿Deberías usar llamada, video o correo como paso 2? (Depende de señales de compromiso)

**Salida:**
1. **Correo 1 (Contacto Nuevo)** para cada objetivo:
   - Línea de asunto (menos de 10 palabras, referencia la señal)
   - Cuerpo (menos de 50 palabras, marco Short Trigger: contexto + problema + llamada a la acción)
   - Recomendación de archivo/activo (si aplica)

2. **Pasos de Secuencia 2–4** para secuencias activas:
   - Seguimiento Día 3: [Correo o tipo de tarea]
   - Seguimiento Día 7: [Correo, contacto de voz o compromiso en LinkedIn]
   - Seguimiento Día 12: [Correo o último toque, posible giro a nueva señal]

**Criterios de éxito:** Los correos están personalizados, bajo 50 palabras y hacen referencia a la señal. Las secuencias siguen cadencia y lógica de escalada.

---

### Paso 4: Bloque de Seguimiento (45 min, 11:00–11:45 AM)

**Tarea de Claude:**
"Clasifica todas las respuestas nocturnas y buzones de voz. Agrúpalos: (1) Compromiso positivo, (2) Necesita clarificación, (3) No interesado, (4) Spam. Redacta respuestas para respuestas de alta prioridad. Para cada lead cálido, decide: ¿correo, llamada hoy o seguimiento de secuencia?"

**Entrada:** Respuestas de correo/Slack nocturnas, transcripciones de buzón de voz, lista de prospectos activos de CRM

**Puntos de decisión:**
- Sentimiento de respuesta: Positivo (responder hoy), neutral (aclarar + secuencia), negativo (registrar + seguir adelante)
- Preparación para llamada: ¿Está este prospecto listo para una llamada? (Señales fuertes = sí)
- Continuación de secuencia: ¿Deberías continuar la secuencia o girar a un gancho diferente?

**Salida:**
1. **Tabla de clasificación de respuestas:**
   - Nombre del prospecto | Empresa | Contenido de respuesta | Cubo | Acción recomendada | Urgencia
2. **Respuestas borradores** para Cubos 1 y 2 (listas para enviar o personalizar)
3. **Lista de llamadas** para hoy con puntos de conversación

**Criterios de éxito:** Todas las respuestas clasificadas; los leads cálidos obtienen atención el mismo día; ningún lead cae entre grietas.

---

### Paso 5: Actualización de CRM (30 min, 11:45 AM–12:15 PM)

**Tarea de Claude:**
"Convierte notas de llamadas, envíos de correo y respuestas en actualizaciones estructuradas de CRM. Para cada contacto: actualiza fecha de última actividad, agrega resultado de llamada (si aplica), crea tareas de seguimiento con fechas de vencimiento, actualiza etapa de oportunidad, registra señales."

**Entrada:** Notas de llamadas del Paso 4, registro de envío de correos del Paso 3, clasificación de respuestas del Paso 4, registros actuales de CRM

**Puntos de decisión:**
- ¿Debería este lead pasar a una nueva etapa de oportunidad? (Calificado → En Conversación, etc.)
- ¿Cuál es la siguiente tarea y cuándo vence? (¿Hoy, mañana, en 3 días?)
- ¿Deberías agregar un nuevo contacto o empresa a la base de datos?

**Salida:**
1. **Instrucciones de actualización masiva de CRM** (listas para pegar en tu CRM):
   - Nombre del contacto | Tipo de actividad | Fecha de actividad | Notas de resultado | Siguiente tarea | Fecha de vencimiento | Etapa de oportunidad
2. **Adiciones de contacto/empresa nuevas** (si aplica)
3. **Resumen de tareas de seguimiento** (conteos de tareas creadas por persona)

**Criterios de éxito:** Toda la actividad registrada; sin trabajo duplicado; las tareas de seguimiento son específicas y con fecha de vencimiento.

---

### Paso 6: Revisión de Fin de Día (15 min, 4:45–5:00 PM)

**Tarea de Claude:**
"Resume métricas de hoy y prioridades de mañana. ¿Cuántas cuentas nuevas agregué? ¿Cuántas secuencias están activas? ¿Qué señales necesito revisar mañana? ¿Necesito ajustar mi lista de cuentas objetivo?"

**Entrada:** Instantánea de panel de CRM, fuentes de señales, conteo de secuencias activas, salidas del flujo de trabajo de hoy

**Puntos de decisión:**
- ¿Estamos a ritmo para objetivos semanales/mensuales? (Sí = mantener, No = escalar)
- ¿Deberías agregar o quitar cuentas de nuestras listas Tier 1/2? (Datos de desempeño en frío)
- ¿Tenemos suficientes cuentas de alta señal para mañana, o necesitamos buscar nuevas cuentas?

**Salida:**
1. **Métricas diarias:**
   - Cuentas nuevas agregadas
   - Secuencias nuevas iniciadas
   - Respuestas recibidas + tasa de respuesta %
   - Llamadas reservadas / reuniones programadas
   - Secuencias activas (total acumulado)

2. **Prioridades de mañana:**
   - Cuentas para investigar
   - Secuencias para seguimiento
   - Señales para monitorear
   - Llamadas o seguimientos urgentes

3. **Tendencia semanal** (si es viernes):
   - Total de cuentas tocadas
   - Tasa de conversión (secuencia → reunión)
   - Señales de mejor desempeño
   - Recomendaciones para la próxima semana

**Criterios de éxito:** Las métricas son precisas; las prioridades son claras; puedes comenzar mañana con cero tiempo de preparación.

---

## Salida

Una ejecución diaria completa de SDR que produce:

1. **Lista de señales matutinas** (Paso 1): 5–15 cuentas prioridas listas para investigar
2. **Expedientes de empresas** (Paso 2): Investigación completa + mapa de tomadores de decisiones + señales de dolor para cada cuenta
3. **Correos de contacto** (Paso 3): Correo 1 + pasos de secuencia 2–4, listos para encolar
4. **Clasificación de respuestas** (Paso 4): Todas las respuestas nocturnas ordenadas + leads cálidos con respuestas borradores
5. **Actualizaciones de CRM** (Paso 5): Registro de actividad masiva + tareas de seguimiento, listas para cargar
6. **Instantánea diaria** (Paso 6): Métricas + agenda de mañana

**Asignación de tiempo:**
- Bloque 1 (Revisión de señales): 30 min
- Bloque 2 (Investigación): 60 min
- Bloque 3 (Lote de contacto): 90 min
- Bloque 4 (Seguimiento): 45 min
- Bloque 5 (Actualización de CRM): 30 min
- Bloque 6 (Fin de día): 15 min
- **Total: 4.5 horas** (8:00 AM–12:15 PM, + 15 min a las 4:45–5:00 PM)

---

## Ejemplo

**Día: Lunes, 2 de junio de 2026**

### Paso 1: Revisión de Señales Matutinas (8:00–8:30 AM)

El usuario proporciona:
- Lista de cuentas Tier 1: Acme Corp, BuildCo, DataDrive Inc, TechScale Ltd
- Fuentes de señales: feed de LinkedIn, correo de Crunchbase, sitio de empleos

**Claude identifica:**
1. **Acme Corp** — Nuevo VP de Ventas contratado (publicación en LinkedIn, hace 2 días) → **ALTO**
2. **BuildCo** — Anuncio de financiación Series B $15M → **ALTO**
3. **DataDrive Inc** — Contratación de 3 ingenieros de datos (publicaciones de empleo en LinkedIn) → **MEDIO**
4. **TechScale Ltd** — Lanzamiento de nuevo producto anunciado en su blog → **MEDIO**

**Salida:**
```
LISTA DE PRIORIDAD DE SEÑALES — Lunes, 2 de junio

🔴 PRIORIDAD ALTA
1. Acme Corp | Señal: Nuevo VP de Ventas (hace 2 días) | Contacto: TBD (investigar) | Gancho: Felicitar por contratación + nuestra plataforma de eficiencia de ventas
2. BuildCo | Señal: Series B $15M | Contacto: Contacto de CEO existente | Gancho: Ayudarles a escalar operaciones de ventas post-financiación

🟡 PRIORIDAD MEDIA
3. DataDrive Inc | Señal: Contratando 3 ingenieros de datos | Contacto: Gerente de contratación TBD | Gancho: Escala de equipo de datos = desafíos de infraestructura
4. TechScale Ltd | Señal: Lanzamiento de nuevo producto | Contacto: Líder de producto existente | Gancho: Analizar respuesta del mercado + estrategia de ventas
```

---

### Paso 2: Sprint de Investigación de Cuentas (8:30–9:30 AM)

El usuario proporciona: Perfiles de LinkedIn, sitios web de empresas, enlaces de Crunchbase

**Claude produce expedientes:**

```
ACME CORP

**Descripción General**
- Industria: B2B SaaS (habilitación de ventas)
- Tamaño: 150 empleados
- Financiación: Series A ($8M, 2023)
- Reciente: Nuevo VP de Ventas contratado (30 de mayo de 2026)

**Mapa de Tomadores de Decisiones**
- CEO: Jane Smith (LinkedIn: /in/janesmith) — fundadora
- VP de Ventas: Michael Johnson (LinkedIn: /in/mjohnson) — NUEVA CONTRATACIÓN
- Rol CRO: TBD (probablemente creando rol de VP de Ventas para crecimiento)

**3 Principales Señales de Dolor**
1. Nuevo liderazgo de ventas → expandiendo equipo de ventas, necesidad de infraestructura/herramientas
2. Series A financiada hace 2+ años → probablemente planificando Series B, necesidad de escalar ingresos
3. 150 personas → moviéndose a fase de escala, operaciones de ventas volviéndose críticas

**Gancho Recomendado**
"Hola Michael, vi que te uniste a Acme como VP de Ventas — ¡felicidades! Las operaciones de ventas son brutales durante la rampa. Ayudamos a equipos como el tuyo a comprimir la incorporación de 60 a 30 días. ¿Una llamada rápida esta semana?"
```

```
BUILDCO

**Descripción General**
- Industria: Infraestructura DevOps
- Tamaño: 45 empleados
- Financiación: Series B ($15M, 1 de junio de 2026) — RECIÉN ANUNCIADO
- Tasa de crecimiento: 3x YoY (según Crunchbase)

**Mapa de Tomadores de Decisiones**
- CEO: Alex Chen (contacto existente, comprometido)
- VP de Producto: Sarah Lee (LinkedIn: /in/sarahlee)
- VP de Ventas: [Aún no contratado — oportunidad de crecimiento]

**3 Principales Señales de Dolor**
1. Financiación Series B → se espera crecimiento de 3x en personal, ventas explotarán
2. 45 → ~150 personas en 12 meses → desafío masivo de escalado operacional
3. Crecimiento dirigido por producto probablemente → necesidad de infraestructura de ventas para convertir entrada

**Gancho Recomendado**
"Alex, ¡felicidades por cerrar la Series B de BuildCo! Con un crecimiento de 3x por delante, tus operaciones de ventas serán la restricción. Tomemos un café y hablemos de cómo evitar errores de escalado comunes."
```

---

### Paso 3: Lote de Contacto (9:30–11:00 AM)

El usuario encola correos para envío

**Claude produce:**

```
CORREO 1 — Acme Corp / Michael Johnson (CONTACTO NUEVO)

Asunto: Operaciones de ventas para la próxima fase de Acme

Cuerpo:
Hola Michael,

Felicidades por el rol de VP. Los equipos de ventas escalan más rápido cuando las operaciones los acompañan.

Comprimimos la incorporación de 60 a 30 días. ¿Vale una llamada rápida?

Saludos,
[Nombre]
[Tu Empresa]

---

CORREO 1 — BuildCo / Alex Chen (CONTACTO NUEVO)

Asunto: Operaciones de BuildCo post-Series-B

Cuerpo:
Alex,

Vi que cerraste la Series B. Felicidades. Con un crecimiento de 3x por delante, las operaciones de ventas son tu restricción.

¿15 min esta semana?

Saludos,
[Nombre]
[Tu Empresa]

---

PASOS DE SECUENCIA 2–4 (Ejemplo: prospecto de DataDrive Inc ya en secuencia, día 1 enviado)

Seguimiento Día 3: Correo
Asunto: Pensamiento rápido sobre contratación

Cuerpo: "Hola [Nombre], Siguiendo mi correo del martes. Mientras escalas tu equipo de datos, las ventas se vuelven críticas. La mayoría de equipos fallan aquí. Asegurémonos de que no lo hagas. ¿Una llamada rápida?"

Seguimiento Día 7: Compromiso en LinkedIn
Acción: Comenta en su publicación de contratación reciente + envía mensaje: "Vi tus planes de crecimiento de equipo. Sincronicemos sobre operacionalizar ventas para equipos de datos."

Seguimiento Día 12: Correo (toque final)
Asunto: Último pensamiento

Cuerpo: "Hola [Nombre], Me mantendré fuera de tu bandeja de entrada después de esto. Pero si alguna vez quieres charlar sobre escalar ventas sin el caos, sabes dónde encontrarme."
```

---

### Paso 4: Bloque de Seguimiento (11:00–11:45 AM)

El usuario proporciona respuestas nocturnas (ejemplo):

**Claude clasifica:**

```
CLASIFICACIÓN DE RESPUESTAS NOCTURNAS

Prospecto: John Doe (BuildCo)
Respuesta: "Oye, esto se ve interesante. ¿Puedes enviar un enlace de demostración?"
Cubo: 1 — Compromiso positivo
Acción: Enviar enlace de demostración + llamar hoy
Urgencia: ALTA

Prospecto: Sarah Chen (Acme Corp)
Respuesta: "Agradezco la nota. No estamos buscando cambiar herramientas en este momento."
Cubo: 3 — No interesado
Acción: Registrar, no dar seguimiento; revisitar en 90 días
Urgencia: BAJA

Prospecto: Mike Peters (DataDrive Inc)
Respuesta: "¿Cuál es tu precio?"
Cubo: 2 — Necesita clarificación
Acción: Aclarar precio + propuesta de valor en correo + ofrecer llamada
Urgencia: MEDIA

---

RESPUESTA BORRADOR PARA RESPUESTAS DE ALTA PRIORIDAD

Para: John Doe (BuildCo)
Asunto: Re: Enlace de demostración

Hola John,

Aquí está la demostración: [enlace]. Es un recorrido de 15 minutos; la mayoría ve en 2x velocidad.

¿Llamada gratuita de 30 min el miércoles o jueves?

Saludos,
[Nombre]

---

LISTA DE LLAMADAS HOY
1. John Doe (BuildCo) — Demostración enviada, lead caliente
   Puntos de conversación: Su rol, cronograma para escalar ventas, dolor de herramientas actuales
```

---

### Paso 5: Actualización de CRM (11:45 AM–12:15 PM)

**Claude produce actualización masiva de CRM:**

```
ACTUALIZACIÓN MASIVA DE CRM — Lunes, 2 de junio

Nombre del Contacto | Tipo de Actividad | Fecha | Notas | Siguiente Tarea | Fecha de Vencimiento | Etapa de Oportunidad
John Doe | Correo enviado | 6/2 | Enlace de demostración enviado | Llamada | 6/2 | En Conversación
Michael Johnson | Correo enviado | 6/2 | Contacto de VP nueva contratación | Seguimiento | 6/5 | Prospecto
Alex Chen | Correo enviado | 6/2 | Felicitaciones de Series B | Llamada | 6/3 | Prospecto
Sarah Chen | Correo recibido | 6/2 | No interesado ahora | Revisitar | 90 días | No Calificado
Mike Peters | Correo recibido | 6/2 | Pregunta sobre precio | Aclarar en correo | 6/2 | En Conversación

---

NUEVAS TAREAS DE SEGUIMIENTO CREADAS
- John Doe: Llamada (hoy, 2:00 PM) — Seguimiento de demostración de BuildCo
- Mike Peters: Enviar correo de precio (hoy, 1:00 PM) — responder a pregunta
- Alex Chen: Llamada (miércoles, 9:00 AM) — Debrief de Series B
- Michael Johnson: Seguimiento por correo (jueves, 8:00 AM) — verificar nivel de interés
```

---

### Paso 6: Revisión de Fin de Día (4:45–5:00 PM)

**Claude produce:**

```
MÉTRICAS DIARIAS — Lunes, 2 de junio

✅ Cuentas tocadas: 4
✅ Secuencias nuevas iniciadas: 2 (Acme Corp, BuildCo)
✅ Respuestas recibidas: 3 (tasa de respuesta: TBD, muestra pequeña)
✅ Llamadas reservadas: 1 (John Doe, 2:00 PM hoy)
✅ Secuencias activas en ejecución: 7

---

PRIORIDADES DE MAÑANA (Martes, 3 de junio)

🔴 TAREAS URGENTES DE HOY
- Llamar a John Doe a las 2:00 PM hoy (seguimiento de demostración)
- Enviar correo a Mike Peters antes de fin de día (aclaración de precio)

🟡 AGENDA DEL MARTES
- Investigar 3 cuentas nuevas de alta señal (ejecutar revisión de señales de nuevo)
- Seguimiento Día 7 en 2 secuencias existentes
- Llamar a Alex Chen (debrief de Series B) — 9:00 AM
- Monitorear respuestas, responder el mismo día

🟢 PERSPECTIVA DE LA SEMANA
- 15–20 cuentas nuevas para investigar
- 3–4 llamadas reservadas ideal
- 2–3 reuniones programadas antes del viernes
- Continuar inicio diario a las 8:00 AM para consistencia
```

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**

📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
