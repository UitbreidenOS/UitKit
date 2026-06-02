# Señales de Compra

## Cuándo activar

Cuando prospecteas B2B SaaS, estás decidiendo si y cuándo contactar a una cuenta objetivo. Activa esta skill cuando tengas:
- Una cuenta identificada como apta (tamaño de empresa, industria, coincidencia de stack tecnológico)
- Acceso a herramientas de detección de señales (LinkedIn, Crunchbase, bolsas de empleo, BuiltWith, G2, APIs de noticias)
- Intención de maximizar la tasa de respuesta en el primer contacto y la probabilidad de conversión
- Un cadencia de monitoreo de múltiples señales (verificaciones diarias o semanales en cuentas cálidas)

Esta skill está operacionalizada para SaaS, PaaS, fintech B2B y software empresarial. Funciona mejor en cuentas con 50+ empleados (suficientes señales para detectar, presupuesto suficiente para cerrar).

## Cuándo NO usar

- No apliques a B2C o negocios de un solo fundador — las señales son demasiado escasas y los comités de compra no existen
- No uses si careces de herramientas de detección para verificar señales de forma confiable (LinkedIn Premium, BuiltWith, acceso a bolsas de empleo)
- No apliques a ventas internas donde ya tienes presentación cálida o contacto directo — usa relación primero, señal segundo
- No trates esto como determinista — las señales son probabilísticas, no certezas; siempre valida con investigación
- No ignores la degradación de señales; una ronda de financiación hace 8 meses no tiene valor predictivo
- No dispares con señales únicas solas a menos que el rango sea 1 o 2; espera por apilamiento (2+ señales) para outreach frío en rangos 3–6

## Instrucciones

### Las 6 Señales de Compra Clasificadas por Correlación de Compra

**Señal 1: Excliente Se Unió a una Empresa Nueva**
- **Rango:** 1 (correlación más alta, ~35% tasa de respuesta vs. 3.4% línea base)
- **Por qué importa:** Tienen conocimiento probado del producto, entienden el ROI, y frecuentemente tienen autoridad presupuestaria en su nueva empresa
- **Método de detección:**
  - LinkedIn "People Also Viewed" en tus contactos clientes
  - LinkedIn Sales Navigator: alertas de cambio de trabajo en perfiles de compradores pasados
  - Seguimiento de salida de empresa vía Crunchbase (cuando empleados se mueven en masa)
  - Revisión manual: escanea perfiles LinkedIn de clientes mensualmente para actividad de "nueva empresa"
- **Ventana de degradación:** 90 días máximo. Después de 90 días, su autoridad inicial y mandato se desvanecen; reprioriza por cambio de rol
- **Tiempo ideal para primer contacto:** Dentro de 14 días del cambio de trabajo (antes de que ya hayan comprado alternativas)
- **Verificación:** Confirma que tenían influencia de compra en la empresa anterior (título de trabajo, rol Salesforce, bandera de propietario de presupuesto)
- **Fórmula de mensaje de primer contacto:**
  ```
  [Nombra la señal explícitamente] "Vi que acabas de unirte a [Empresa] como [Rol]"
  [Por qué importa] "Cuando las personas se mudan a una nueva org, lo primero que arreglan es [problema común del departamento]"
  [Una pregunta abierta] "¿Estás buscando [categoría de herramienta] para resolver [dolor específico] allí, o aún no es una prioridad?"
  ```
- **Mejora de tasa de respuesta:** +35% vs. 3.4% línea base
- **Ejemplo de disparo:** "Vi que acabas de unirte a Acme como VP de Operaciones. Cuando los líderes de ops se mudan de empresas, generalmente quieren limpiar su stack de análisis. ¿Estás pensando en reemplazar [herramienta actual] o está en la hoja de ruta?"

---

**Señal 2: Nuevo Liderazgo de C-Suite o VP Contratado Dentro de Últimos 90 Días**
- **Rango:** 2 (segunda correlación más alta, ~28% tasa de respuesta)
- **Por qué importa:** Los nuevos ejecutivos necesitan probarse rápidamente (mandato de 100 días); están abiertos a conversaciones con proveedores y tienen presupuesto para respaldar ganancias rápidas
- **Método de detección:**
  - Página de empresa LinkedIn: revisa la sección "Contrataciones Recientes" para roles de nivel C o VP
  - Crunchbase: rastrea cambios de liderazgo vía pestaña "People"
  - Comunicados de prensa de la empresa (API de noticias o verificación manual)
  - API de bolsa de empleo: filtra por contrataciones de nivel C/VP en cuentas objetivo
  - LinkedIn Sales Navigator: establece alerta en "[Empresa] ha contratado nuevo [C-suite/VP]"
- **Ventana de degradación:** 90 días. Después del día 90, la presión del mandato se suaviza; están en estado estable
- **Tiempo ideal para primer contacto:** Dentro de 30 días del anuncio de contratación (día 1–30 = urgencia máxima)
- **Verificación:** Confirma rol y línea de reporte (debe ser propietario directo de P&L o VP funcional, no rol de personal)
- **Fórmula de mensaje de primer contacto:**
  ```
  [Nombra la señal explícitamente] "Felicidades por [nuevo VP/CRO] uniéndose a [Empresa]"
  [Por qué importa] "Los líderes de [Rol] típicamente gastan sus primeros 90 días en [iniciativa común]; eso usualmente requiere [categoría de solución]"
  [Una pregunta abierta] "¿Está [Empresa] construyendo [capacidad relevante] este trimestre, o está más abajo en la hoja de ruta?"
  ```
- **Mejora de tasa de respuesta:** +28% vs. línea base
- **Ejemplo de disparo:** "Felicidades por traer un nuevo VP de Ventas. La mayoría de VPs de Ventas se mueven rápido en sus primeros 90 días—usualmente refactorizando compensación y herramientas de ventas. ¿Eso está en tu lista, o tu playbook ya está bloqueado?"

---

**Señal 3: Actividad de Sitio Web de Alto Intento (Página de Precios, Página de Demo, 3+ Visitas en 7 Días)**
- **Rango:** 3 (evaluación activa en progreso, ~18% tasa de respuesta)
- **Por qué importa:** Están comparando activamente soluciones; estás en su ventana de evaluación ahora
- **Método de detección:**
  - Analítica de sitio web: HubSpot, Segment, o rastreo UTM personalizado
  - Plataforma de datos de intento: 6sense, ZoomInfo, Demandbase (más confiable para B2B SaaS)
  - Rastreo en sitio Drift/Intercom: señaliza cuentas que alcanzan página de precios o demo
  - Actividad de comentarios LinkedIn en tus posts de producto (señal fuerte de intento)
  - Lecturas de reseña G2 (si tienes rastreo basado en píxel; la mayoría no)
- **Ventana de degradación:** 7 días máximo. Después de 7 días sin actividad de seguimiento, asume que están en el pipeline de otro proveedor
- **Tiempo ideal para primer contacto:** Dentro de 24 horas de la tercera visita o vista de página de demo (el outreach el mismo día duplica la tasa de respuesta)
- **Verificación:** Confirma tamaño de cuenta y rol del visitante (si está disponible vía herramienta de intento); descarta si el visitante es freelancer o está fuera del comité de compra
- **Fórmula de mensaje de primer contacto:**
  ```
  [Nombra la señal explícitamente] "Noté que estuviste en nuestra página de [precios/demo] esta semana"
  [Por qué importa] "Usualmente eso significa que estás en evaluación activa. La mayoría de equipos de tu tamaño gastan [X semanas] comparando—puedo ayudarte a comprimir ese cronograma"
  [Una pregunta abierta] "¿Nos estás comparando con [competidor conocido], o estás mirando algunas opciones en [categoría]?"
  ```
- **Mejora de tasa de respuesta:** +18% vs. línea base
- **Ejemplo de disparo:** "Vi que estuviste en nuestra página de precios tres veces esta semana. Usualmente eso significa que estás evaluando activamente—quiero asegurarme de que no te estés perdiendo nada. ¿Nos estás comparando con Competidor X, o aún estás explorando qué hay?"

---

**Señal 4: Cambio de Stack Tecnológico Detectado (Competidor Removido o Herramienta Complementaria Agregada)**
- **Rango:** 4 (momento de adopción, ~16% tasa de respuesta)
- **Por qué importa:** Están activamente remodelando su stack tecnológico; tu producto resuelve dolor adyacente; el tiempo importa
- **Método de detección:**
  - BuiltWith: monitorea cuentas objetivo para competidores removidos, nueva adopción de herramientas
  - Datanyze: rastrea cambios de stack con API o auditorías semanales manuales
  - Lecturas de reseña G2 y señales de compra (nuevos proveedores agregando reseñas = nueva adopción)
  - Publicaciones de trabajo LinkedIn mencionando nuevos requisitos de herramientas
  - Módulo de stack tecnológico ZoomInfo
- **Ventana de degradación:** 14 días. Los cambios de stack requieren 1–2 semanas para estabilizarse; después de 14 días, se han movido
- **Tiempo ideal para primer contacto:** Dentro de 7 días de detección de cambio de stack (atrápales en medio de la evaluación)
- **Verificación:** Confirma que el cambio es reciente (dentro de 30 días) y representa adopción intencional, no remoción accidental
- **Fórmula de mensaje de primer contacto:**
  ```
  [Nombra la señal explícitamente] "Vi que [Empresa] agregó [herramienta nueva] a tu stack este mes"
  [Por qué importa] "[Herramienta nueva] típicamente expone problemas con [proceso relacionado]. Los equipos usualmente descubren que necesitan [tu solución] dentro de semanas"
  [Una pregunta abierta] "¿Estás planeando integrar eso con [herramienta existente], o estás refactorizando ese flujo de trabajo completamente?"
  ```
- **Mejora de tasa de respuesta:** +16% vs. línea base
- **Ejemplo de disparo:** "Noté que acabas de agregar Segment a tu stack. La mayoría de empresas que migran a Segment también descubren que necesitan mejor gobernanza de datos downstream—eso es lo que hacemos. ¿Estás pensando en esa pieza, o es fase dos?"

---

**Señal 5: Financiación, Adquisición, Entrada a Nuevo Mercado, o Pico de Headcount de 20%+**
- **Rango:** 5 (disponibilidad de presupuesto, ~12% tasa de respuesta)
- **Por qué importa:** Tienen capital, mandato de crecimiento, y probablemente nuevo presupuesto para gastar en herramientas para respaldar expansión
- **Método de detección:**
  - Crunchbase: anuncios de financiación y rastreo de adquisiciones
  - Página de empresa LinkedIn: cambio de headcount en ventana de 90 días (compara con trimestre anterior)
  - API de bolsa de empleo LinkedIn: pico en publicaciones de trabajo (proxy para crecimiento de headcount)
  - APIs de noticias: M&A, lanzamientos en nuevos mercados, presentaciones de IPO
  - 6sense o ZoomInfo: banderas de cuenta de "Alto crecimiento"
- **Ventana de degradación:** 120 días. Después de 4 meses, el capital de crecimiento está asignado; los presupuestos están bloqueados
- **Tiempo ideal para primer contacto:** Dentro de 30 días del anuncio (días 1–30: el capital está sin comprometer; días 31–90: los presupuestos se están asignando)
- **Verificación:** Confirma que el crecimiento es real (no reclasificación contable o evento único); verifica de forma cruzada Crunchbase, LinkedIn, y fuentes de noticias
- **Fórmula de mensaje de primer contacto:**
  ```
  [Nombra la señal explícitamente] "Felicidades por la Serie [X] / [X crecimiento de headcount] / adquisición de [Empresa]"
  [Por qué importa] "Ese tipo de crecimiento usualmente dispara [cuello de botella operacional común]. La mayoría de equipos de tu tamaño lo resuelven por [categoría de solución]"
  [Una pregunta abierta] "¿Está tu [equipo relevante] planeando expandir headcount este trimestre, o estás enfocándote en eficiencia primero?"
  ```
- **Mejora de tasa de respuesta:** +12% vs. línea base
- **Ejemplo de disparo:** "Felicidades por la Serie C. Usualmente ese crecimiento significa que estás escalando tu equipo de ingeniería. La mayoría de empresas que escalan ing al tu ritmo se chocan con cuellos de botella CI/CD dentro de 6 meses—¿ya lo estás viendo, o la infraestructura aún es estable?"

---

**Señal 6: Patrones de Contratación Estratégica (5+ Publicaciones de Trabajo en Departamento Objetivo Dentro de 30 Días)**
- **Rango:** 6 (presupuesto aprobado y en progreso, ~10% tasa de respuesta)
- **Por qué importa:** Múltiples roles abiertos = presupuesto aprobado + contratación activa = gasto de herramientas es inminente para ese departamento
- **Método de detección:**
  - API de bolsa de empleo LinkedIn: filtra por empresa + departamento + fecha publicada (últimos 30 días)
  - Indeed, Greenhouse, API de tablero ATS: cuenta roles abiertos por departamento
  - Página de carreras de la empresa: auditoría manual de roles abiertos
  - Rastreador de contratación ZoomInfo
  - Persado: señales de intento de contratación
- **Ventana de degradación:** 45 días. Después de 6 semanas, los roles se cubren o el momento de contratación se detiene; la ventana de presupuesto se cierra
- **Tiempo ideal para primer contacto:** Dentro de 14 días de la publicación del 5º rol (cuando está claro que esto es un empujón de contratación real, no ruido)
- **Verificación:** Confirma que 5+ roles estén en el mismo departamento (no dispersos en la empresa); verifica descripciones de trabajo para mezcla de antigüedad (indica inversión real)
- **Fórmula de mensaje de primer contacto:**
  ```
  [Nombra la señal explícitamente] "Vi que [Empresa] tiene 5+ roles abiertos en [departamento] este mes"
  [Por qué importa] "Cuando los equipos están contratando tan agresivamente, usualmente necesitan [categoría de herramienta] para incorporar y respaldar nuevas contrataciones rápidamente"
  [Una pregunta abierta] "¿Ese sprint de contratación es impulsado por [iniciativa conocida], o estás expandiendo el alcance de ese equipo?"
  ```
- **Mejora de tasa de respuesta:** +10% vs. línea base
- **Ejemplo de disparo:** "Vi que tienes 6 roles abiertos en ingeniería este mes. Usualmente cuando los equipos contratan tan agresivamente, enfrentan problemas de velocidad dentro de los primeros 30 días—necesitan mejor revisión de código o herramientas CI. ¿Es algo en lo que tu ingeniero principal está pensando?"

---

### Lógica de Apilamiento de Señales

**No hagas outreach frío en una sola señal (rangos 3–6) sola.** Espera por apilamiento de señales.

**Reglas de apilamiento de señales:**
- **2+ señales detectadas (cualquier rango) = outreach prioritario dentro de 24 horas**
  - Ejemplo: Señal 3 (visita de sitio web) + Señal 5 (financiación) = multi-contacto de alta urgencia
  - Ejemplo: Señal 4 (cambio de tecnología) + Señal 6 (contratación) = programa multi-contacto
- **Señales 1 o 2 solas = outreach inmediato (dentro de 1 día)** — no esperes por apilamiento
- **Señales únicas 3–6 = agrega a cadencia de nutrición, no outreach prioritario** — revisa semanalmente hasta que la señal se apile o se degrade
- **3+ señales = opción nuclear** — outreach de ejecutivos, oferta de demo personalizada, SLA de respuesta de 2 horas

**Ejemplo de apilamiento:**
```
Lunes: Señal 3 detectada (visita de sitio web)
  → Agrega a lista de nutrición, verificación 1x/semana
Miércoles: Señal 6 detectada (4 nuevas publicaciones de trabajo en ventas)
  → AHORA: 2+ señales. Dispara outreach prioritario dentro de 24h
  → Mensaje: "Noté que estás expandiendo ventas Y explorando nuestra plataforma esta semana"
Viernes: Señal 5 detectada (Crunchbase muestra Serie B)
  → 3 señales. Escala: llamada del fundador o jefe de ventas
```

---

### Stack de Monitoreo de Señales

**Verificaciones diarias (cuentas en evaluación activa):**
- LinkedIn Sales Navigator: alertas de cambio de trabajo en personas objetivo y leads cálidas
- Panel de datos de intento (6sense, Demandbase): actividad de sitio web, umbral de puntuación >60%
- Drift/Intercom: notificaciones en tiempo real en vistas de página de precios o demo

**Verificaciones semanales (cuentas en pipeline o lista de vigilancia):**
- API de BuiltWith: cambios de stack tecnológico (Señal 4)
- Alertas de noticias de empresa (Crunchbase, API de Google News): financiación, M&A, contrataciones ejecutivas (Señales 2, 5)
- Página de empresa LinkedIn: conteo de publicaciones de trabajo en departamentos objetivo (Señal 6)
- Raspado de bolsa de empleo: Indeed, Lever, Greenhouse para contratación de empresa (Señal 6)
- Perfil de empresa G2: pico de actividad de reseña = señal de interés (proxy para Señal 3)

**Auditorías mensuales (retrospectiva y degradación):**
- Hoja de cálculo o CRM: marca fecha de señal, fecha límite de degradación, estado de outreach
- Elimina señales degradadas (más antiguas que 90 días para Señales 1–2, más antiguas que 14 días para Señal 3, más antiguas que 14 días para Señal 4, más antiguas que 120 días para Señal 5, más antiguas que 45 días para Señal 6)
- Califica cuentas por conteo de señal y nivel de urgencia

---

### Regla Universal de Degradación de 14 Días

Todas las señales se degradan. El estándar de la industria es:
- **Señal 1 y 2:** Útil por 90 días, la prioridad cae después del día 30
- **Señal 3:** Útil por 7 días (la actividad del sitio web está limitada en tiempo), el toque frío después del día 7 es 60% menos efectivo
- **Señal 4:** Útil por 14 días, obsoleto después de eso
- **Señal 5:** Útil por 120 días, la prioridad cae después del día 30
- **Señal 6:** Útil por 45 días, el momento se detiene después del día 45

**Implementación:**
1. Etiqueta cada señal con fecha de detección en CRM u hoja de cálculo
2. Calcula fecha límite de degradación (ver ventanas arriba)
3. Automatiza con Zapier, Make, o script interno: if (hoy > fecha_señal + ventana_degradación), elimina de lista prioritaria, mueve a nutrición
4. Nunca hagas outreach frío en una señal degradada; revisa nuevamente si aparece nueva señal

---

### Fórmula de Mensaje de Primer Contacto (Operacionalizada)

Cada primer contacto debe seguir esta estructura de 3 partes (máx 3 oraciones):

**[Parte 1: Nombra la señal explícitamente]**
- Hace que el outreach sea creíble y específico (no spray-and-pray)
- Ejemplo: "Vi que acabas de unirte a Acme como VP de Ops" O "Noté que estuviste en nuestra página de demo tres veces esta semana"

**[Parte 2: Por qué importa para ellos (no para ti)]**
- Articula el problema comercial que probablemente están enfrentando *porque* de esa señal
- Ejemplo: "Cuando los líderes de ops se mudan a una nueva empresa, lo primero que usualmente abordan es la visibilidad de la cadena de suministro" (Señal 1)
- Ejemplo: "Cuando agregas un almacén de datos, usualmente descubres problemas de calidad de datos downstream" (Señal 4)

**[Parte 3: Una pregunta abierta (no un pitch)]**
- Muestra que te importa, no estás vendiendo
- Hace que la respuesta sea más fácil (binaria/específica, no abierta)
- Ejemplo: "¿Estás buscando [categoría] para resolver eso, o la visibilidad aún no es un problema para ti?"
- Ejemplo: "¿Tu equipo ya está pensando en gobernanza de datos, o es fase dos?"

**Plantilla:**
```
[Señal] "Noté [señal específica]"
[Problema] "[Rol/situación] usualmente significa [implicación comercial]"
[Pregunta] "¿Estás pensando en [área de solución relevante], o eso no está en la hoja de ruta?"
```

---

### Puntos de Referencia de Tasa de Respuesta (Línea Base vs. Señal)

| Señal | Línea Base | Con Señal | Mejora |
|--------|----------|-------------|--------|
| Sin señal (correo frío) | 3.4% | — | — |
| Señal 1 (excliente) | 3.4% | 35% | +10.3x |
| Señal 2 (nuevo C-suite/VP) | 3.4% | 28% | +8.2x |
| Señal 3 (actividad de sitio web) | 3.4% | 18% | +5.3x |
| Señal 4 (cambio de tecnología) | 3.4% | 16% | +4.7x |
| Señal 5 (financiación/crecimiento) | 3.4% | 12% | +3.5x |
| Señal 6 (contratación) | 3.4% | 10% | +2.9x |
| 2+ señales (apiladas) | 3.4% | 42–58% | +12–17x |

*Fuente: investigación ColdIQ (2024). Los puntos de referencia asumen B2B SaaS, cuentas de 50–1000 empleados, personas de nivel senior/mid-market. YMMV.*

---

## Ejemplo

**Escenario: VP Ventas en Acme Corp**

**Día 1 — Lunes 9 AM**
- Alerta LinkedIn: Sarah Chen se une a Acme Corp como VP de Ventas (Señal 2)
- Verificación: Verifica LinkedIn, confirma que el rol es de nivel VP, reporta a CRO, tamaño de empresa = 350 empleados, adyacente a SaaS
- Decisión: Señal 2 sola = outreach inmediato (rango 2, apilamiento no requerido)
- Ventana de degradación: 90 días, outreach prioritario día 1–30

**Correo de primer contacto (enviado 9:15 AM el mismo día):**
```
Asunto: Felicidades por el rol VP en Acme

Sarah,

Felicidades por unirte a Acme como VP de Ventas—emocionado de ver nuevo liderazgo allí.

La mayoría de VP de Ventas gastan sus primeros 90 días en dos cosas: reestructuración de compensación y modernización de herramientas. 
Usualmente hacia el mes 2, están evaluando flujos de trabajo CRM o stacks de engagement de ventas para alcanzar sus objetivos de ramp más rápido.

¿Tu playbook ya está bloqueado allí, o aún estás pensando en esa pieza?

Mejor,
[Nombre]
```

**Rastreo de degradación:**
- Correo enviado: Día 0 (Lunes)
- Seguimiento 1: Día 3 (Jueves) si no hay respuesta
- Seguimiento 2: Día 7 (Lunes siguiente) si no hay respuesta
- Seguimiento 3: Día 14 si no hay respuesta
- Depreca la señal: Día 90 (si no hay respuesta para entonces, elimina de pipeline activo)

---

**Día 3 — Miércoles 10 AM**
- Alerta de datos de intento: Acme.com visitó tu página de demo (Señal 3)
- Verificación manual: Drift muestra visita de [sarah.chen@acme.com](mailto:sarah.chen@acme.com) — la misma persona
- Decisión: 2+ señales ahora (Señal 2 + Señal 3) = escala a outreach prioritario dentro de 24h
- Acción inmediata: 

**Segundo contacto (oferta de llamada prioritaria, enviada 10:30 AM el mismo día):**
```
Asunto: Re: Felicidades por el rol VP en Acme—pregunta rápida

Sarah,

Vi que revisaste nuestra página de demo esta mañana. Dado tu timing en Acme, estoy adivinando que estás en 
la fase de evaluación en herramientas de ventas. 

Más bien que otro correo, ¿serían mejores 15 min de tu tiempo? Feliz de mostrarte cómo generalmente 
solucionamos los flujos de trabajo específicos que Acme probablemente está enfrentando.

¿Hazme saber tu disponibilidad esta semana o la próxima?

Mejor,
[Nombre]
```

**Resultado:** Si Sarah responde a cualquier correo, muévela a pista de demo/conversación. Si no hay respuesta hacia el día 14, re-evalúa: ¿se ha degradado la Señal 3 (actividad de sitio web)? (Sí, 7 días máximo—Señal 3 es obsoleta.) Revisa para nuevas señales. Si no aparecen nuevas señales, continúa cadencia de nutrición, 1x/semana, hasta día 90.

---

**Ejemplo de degradación real (qué NO hacer):**
- Día 1: Señal 5 detectada—Acme levanta Serie B (financiación)
- Día 60: Envías correo frío sobre la financiación
  - ❌ Incorrecto: 60 días está más allá de la ventana prioritaria (día 1–30); el presupuesto ya está asignado
  - ✓ Correcto: Úsalo como contexto suave ("Vi que Acme levantó Serie B a principios de esta primavera"), pero lidera con una señal nueva y actual

---
