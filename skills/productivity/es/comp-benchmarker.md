---
name: comp-benchmarker
description: "Benchmarking de compensación: análisis de datos de mercado, establecimiento de bandas salariales, directrices de acciones y generación de cartas de oferta para contratación competitiva"
---

# Habilidad: Benchmarker de Compensación

## Cuándo activar
- Establecer un rango salarial para un nuevo puesto antes de publicar el trabajo
- Un candidato ha hecho una contraoferta y necesitas saber si está en el mercado
- Construir o actualizar las bandas de compensación en toda la organización
- Un empleado actual solicita un ajuste de mercado o revisión salarial
- Generar una carta de oferta formal después de que se acepta una oferta verbal
- Diseñar un programa de acciones por primera vez o actualizar uno existente
- Decidir entre estructuras de compensación con mucho efectivo vs. muchas acciones para diferentes perfiles de candidatos

## Cuándo NO usar
- Benchmarking de compensación ejecutiva (C-suite) — requiere un consultor especializado en compensación y proceso de aprobación del consejo
- Benchmarking en industrias altamente reguladas (finanzas, salud) donde aplican regulaciones de compensación — verificar localmente
- Revisión de cumplimiento legal de equidad salarial — usa un abogado laboral
- Benchmarking de beneficios — diferentes fuentes de datos y análisis

## Instrucciones

### Constructor de bandas salariales

```
Construye bandas salariales para [rol] en mi empresa.

Rol: [Título del puesto]
Niveles: [lista — ej., L1 / L2 / L3 / Senior / Staff / Principal]
Ubicación: [Ciudad, País / Remoto — y si pagas al mercado local o tasa nacional única]
Etapa de la empresa: [Semilla / Serie A-B / Serie C+ / Pública / PYME / Empresa grande]
Industria: [SaaS / Fintech / Salud / Comercio electrónico / Agencia / etc.]
Urgencia de contratación: [¿puedes esperar 90 días para la persona correcta, o necesitas a alguien en 30 días?]

Filosofía de compensación (elige una o describe la tuya):
- Liderar el mercado (percentil 75+): pagamos el tope del mercado para atraer el mejor talento
- Igualar el mercado (percentil 50): competitivo pero no el que más paga
- Menos efectivo, más acciones: común en startups en etapa temprana
- Diferenciación geográfica: pagar según el costo de vida local

Fuentes de datos a referenciar (en orden de prioridad):
1. Levels.fyi — roles de ingeniería de software y técnicos
2. Radford / Mercer — encuestas de compensación empresarial (si tienes acceso)
3. Glassdoor / LinkedIn Salary Insights — direccional, auto-reportado
4. Benchmarks de pares — ¿qué están pagando empresas similares? (pregunta a tu VC, revisa AngelList)
5. Datos de ofertas de contrataciones recientes en tu empresa (ancla interna)

Estructura de bandas (para cada nivel):

| Nivel | Rango de Salario Base | Bono Objetivo | Otorgamiento de Acciones | OTE (si aplica) |
|---|---|---|---|---|
| [L1] | $[X] - $[Y] | [X%] | [X acciones / X% del pool] | $[X] |
| [L2] | $[X] - $[Y] | [X%] | [X acciones / X% del pool] | $[X] |
[continuar]

Reglas:
- Ninguna banda debe superponerse más del 20% con el nivel superior/inferior (evita la compresión)
- Punto medio = lo que debería ganar alguien con rendimiento completo en este nivel
- Mínimo = contratación inicial para alguien nuevo en el nivel o en la empresa
- Máximo = donde alguien alcanza el tope antes de ser promovido al siguiente nivel

Señalar áreas de riesgo en compensación:
- Si [salario del empleado actual] > máximo de la banda: problema de compresión — abordar proactivamente
- Si la mayoría de las ofertas van al tope de la banda: la banda es demasiado baja para el mercado actual
- Si los candidatos están rechazando por compensación: proporcionar datos, no anécdotas, a liderazgo

Construye la estructura completa de bandas para [rol] con contexto de mercado.
```

### Constructor de paquete de oferta

```
Construye una oferta de compensación para este candidato.

Rol: [Título, nivel]
Candidato: [describe — años de experiencia, compensación actual, ofertas competidoras si se conocen]
Ubicación: [Ciudad, País]
Mi banda para este rol: [$X - $Y base]
Objetivo en la banda: [inferior / punto medio / superior — y por qué]

Situación actual del candidato:
- Base actual: $[X]
- Bono actual (esperado): $[X]
- Acciones actuales (valor no adquirido): $[X] (esto es lo que les estás pidiendo que abandonen)
- Oferta competidora: [empresa, $X base, $X acciones — si se conoce]
- Período de aviso: [X semanas]

Tu oferta:

SALARIO BASE: $[X]
Justificación: [por qué este número — X% de prima sobre el actual, percentil Y de la banda, etc.]

BONO / VARIABLE:
- Tipo: [bono objetivo anual / comisión / bono puntual]
- Objetivo: $[X] al [X%] de la base objetivo
- Estructura: [¿cómo se mide y paga?]

ACCIONES:
- Tipo: [opciones ISO / RSUs / SAFEs en etapa temprana]
- Tamaño del otorgamiento: [X acciones / valor $X al 409A actual / X% del total diluido]
- Adquisición: [estándar: 4 años, 1 año de acantilado — nota si es diferente]
- Valor estimado actual: $[X] (409A o FMV)
- Nota si es pública: valor actual / nota que puede bajar
- Provisiones de acantilado y aceleración (si las hay)

BENEFICIOS:
- Salud: [100% / X% empresa paga médico, dental, visión]
- 401K: [aporta X% hasta Y%]
- PTO: [X días / ilimitado / flexible]
- Equipo: [$X estipendio / equipo de la empresa]
- Remoto/flex: [describe la política]
- Otro: [presupuesto de aprendizaje, licencia parental, política de refresco de acciones]

FECHA DE INICIO: [fecha propuesta, con flexibilidad para el período de aviso]

VENCIMIENTO DE LA OFERTA: [da entre 5-7 días hábiles — razonable, sin presión]

Resumen de compensación total:
- Base anual: $[X]
- Bono objetivo: $[X]
- Acciones (estimación de valor anual): $[X]
- Objetivo total en efectivo: $[X]
- Compensación total incluidas acciones: $[X]

Análisis de oferta competidora (si aplica):
Si tienen una oferta competidora en [competidor]:
[Compara tu oferta en efectivo, potencial de acciones, riesgo, calidad del rol, crecimiento — no solo los números]

Genera el paquete de oferta completo y una narrativa de comparación para la conversación con el candidato.
```

### Directrices de acciones

```
Diseña directrices de acciones para [empresa / nivel de rol].

Tipo de empresa: [Pre-semilla / Semilla / Serie A / Serie B / Serie C+]
Tamaño del pool de opciones: [X% de acciones totalmente diluidas]
Valoración actual: $[X] (o precio 409A: $[X/acción])

Benchmarks de otorgamiento de acciones por nivel y etapa:

PRE-SEMILLA / SEMILLA (primeros 10-20 empleados):
| Nivel | Rango (% del total diluido) |
|---|---|
| VP / C-suite | 0.5% - 2.0% |
| IC Senior / Director | 0.2% - 0.75% |
| IC de nivel medio | 0.05% - 0.25% |
| Carrera inicial / Junior | 0.01% - 0.1% |

SERIE A-B (20-100 empleados):
| Nivel | Rango (% del total diluido) |
|---|---|
| VP / C-suite (nueva contratación) | 0.15% - 0.75% |
| Director | 0.1% - 0.3% |
| IC Senior | 0.05% - 0.15% |
| IC de nivel medio | 0.02% - 0.08% |
| IC Junior | 0.005% - 0.025% |

SERIE C+ (100+ empleados, pre-OPV):
Cambiar a RSUs en objetivos de valor en dólares (la volatilidad del precio de las acciones hace difícil comparar otorgamientos en %):
| Nivel | Rango de otorgamiento anual |
|---|---|
| VP | $150K - $500K en RSUs |
| Director | $75K - $200K en RSUs |
| IC Senior | $40K - $100K en RSUs |
| IC de nivel medio | $15K - $50K en RSUs |

Estándares de adquisición:
- Estándar: adquisición de 4 años, acantilado de 1 año
- Adquisición acelerada en adquisición (disparador único): inusual, pero a veces ofrecido a ejecutivos
- Otorgamientos de refresco: ofrecer después de 2 años para empleados de alto rendimiento retenidos (evita el efecto de acantilado de no adquirido en el año 4)

Cómo presentar las acciones a los candidatos:
No hacer: "Recibirás X,000 opciones por valor de $Y hoy."
Hacer: "Con nuestro 409A actual de $X/acción, tu otorgamiento vale $Y hoy. Si alcanzamos nuestro objetivo de [Serie C / OPV] de $Z/acción, tu otorgamiento vale $W. Eso asume [10x / 20x / hito específico]."
Sé honesto sobre el riesgo de dilución en cada ronda futura.

Construye directrices de acciones para la etapa y el pool de opciones de mi empresa.
```

### Generador de cartas de oferta

```
Genera una carta de oferta para [candidato] para [rol].

Empresa: [Nombre de la empresa]
Candidato: [Nombre completo]
Rol: [Título del puesto]
Departamento: [Departamento]
Reporta a: [Nombre del gerente, título]
Fecha de inicio: [fecha]
Ubicación: [ciudad / estado / remoto]

Compensación:
- Salario base: $[X] por [año / hora]
- Bono: [objetivo X% de la base, pagado [anualmente / trimestralmente], sujeto a rendimiento]
- Acciones: [X acciones ordinarias, adquisición de 4 años, acantilado de 1 año, sujeto a aprobación del consejo]

Beneficios: [describe]

Tipo de empleo: [tiempo completo / tiempo parcial / contrato]
Empleo a voluntad: [sí / no — verificar jurisdicción]
Fecha de vencimiento de la oferta: [fecha]

Anexos requeridos:
- Acuerdo de asignación de invenciones del empleado y confidencialidad (PIIA/CIIA)
- Formulario de consentimiento para verificación de antecedentes (si aplica)
- Verificación de elegibilidad de empleo I-9

Produce una carta de oferta formal con:
- Tono profesional — cálido pero formal
- Todos los detalles de compensación claramente indicados
- Acciones descritas con descargo de responsabilidad de que están sujetas a aprobación del consejo y 409A
- Cláusula de empleo a voluntad (si aplica en esta jurisdicción)
- Instrucciones de confirmación — cómo aceptar (correo electrónico / enlace DocuSign)
- Vencimiento indicado
- Contacto para preguntas

Nota: Esta es una plantilla — revisar con asesor legal antes de enviar. Las leyes laborales varían según la jurisdicción.
```

## Ejemplo

**Usuario:** Estoy contratando a un Gerente de Producto Senior en Londres. Mi startup en Serie B, ~80 personas. ¿Cuál debería ser la banda salarial y cómo estructuro la oferta?

**Benchmark de Claude:**

**Gerente de Producto Senior — Londres — Serie B**

**Contexto de mercado (2025-2026):**
El mercado de PM en Londres es competitivo, particularmente para ICs senior con experiencia en SaaS B2B. Las empresas en Serie B típicamente se posicionan en el percentil 50-65 para mantenerse competitivas sin agotar el pool de opciones.

**Banda salarial — PM Senior, Londres:**
| Componente | Rango | Notas |
|---|---|---|
| Salario base | £85,000 - £115,000 | Punto medio ~£100K para un PM de 5-7 años |
| Bono (objetivo) | 10-15% de la base | Típicamente vinculado a OKRs de la empresa, no individual |
| Acciones | 0.05-0.1% del total diluido | ~£40-80K a la valoración actual si Serie B es £80M |

**Dónde colocar a un candidato específico:**
- En transición desde un rol o empresa muy adyacente: inferior de la banda (£85-90K)
- 5-7 años de experiencia como PM, coincidencia de dominio: punto medio (£95-105K)
- 8+ años, ha liderado un área de producto con responsabilidad de ingresos: tope de la banda (£108-115K)
- No superar la banda — promueve la filosofía de compensación, no la negociación individual

**Estructura de acciones para este nivel (Serie B):**
- 0.075% típico para una contratación sólida de PM Senior
- A valoración de £80M: ~£60K de valor actual
- Adquisición: 4 años, acantilado de 1 año — estándar
- Al presentar: "Si alcanzamos Serie C a £250M, este otorgamiento vale ~£190K"

**Compitiendo contra empresas tecnológicas más grandes:**
Si tienen una oferta de Amazon/Google con RSUs, no puedes igualar en efectivo. Compite en: alcance (serán responsables de un área de producto completa, no de una función), velocidad (lanzarán en semanas, no trimestres) y potencial (las acciones pueden valer múltiplos de un RSU público).

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
