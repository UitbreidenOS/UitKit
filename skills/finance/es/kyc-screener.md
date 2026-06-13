---
name: kyc-screener
description: "Evaluador KYC/AML: análisis documentos, extracción beneficiarios, evaluación matriz reglas, controles PEP/sanciones, signalamiento lagunas y enrutamiento escalada"
---

# Habilidad Evaluador KYC

## Cuándo activar

- Incorporación cliente corporativo nuevo y necesidad completar KYC
- Análisis documentos entidad (certificados constitución, títulos fideicomiso, registros accionistas)
- Identificación propietarios beneficiarios y verificación contra listas PEP/sanciones
- Evaluación paquete KYC cliente contra checklist conformidad
- Enrutamiento casos incompletos o alto riesgo para due diligence mejorada

## Cuándo NO usar

- Reemplazo de aprobación oficial oficial conformidad sobre clientes alto riesgo
- Monitoreo transacción tiempo real (AML) — requiere software dedicado
- Cumplimiento sanciones formal para instituciones financieras — requiere revisión jurídica especialista

## ⚠️ Importante

Outputs KYC deben siempre ser revisados y firmados por oficial conformidad calificado. Claude ayuda estructurar y acelerar proceso — no reemplaza juicio humano sobre riesgo criminalidad financiera. Todos outputs portan `[VERIFY]`.

## Instrucciones

### Paso 1 — Análisis y extracción documento

```
Analizar este documento KYC y extraer todos datos estructurados:

Tipo documento: [Certificado Constitución / Título Fideicomiso / Registro Accionistas / 
               Estado Cuenta / Factura Servicios / Pasaporte / Licencia Conducir]

Documento: [pegar texto o describir contenidos]

Extraer:
- Nombre entidad (nombre legal exacto)
- Número registro
- Jurisdicción constitución
- Domicilio registrado
- Fecha constitución
- Directores / funcionarios (nombres, funciones)
- Accionistas / beneficiarios (nombre, % participación)
- Propietarios beneficiarios últimos (PBU > 25% umbral, o inferior por política)

Señale inconsistencias o información faltante.
[VERIFY] datos extraídos contra documento original.
```

### Paso 2 — Construir estructura propiedad

```
Mapa estructura propiedad desde documentos proporcionados:

Entidades y propiedad:
[pegar lo que ha extraído]

Trace cadena propiedad:
- ¿Quién es el propietario último de esta entidad?
- ¿Hay compañías holding intermedias?
- ¿Quién cruzapasa umbral PBU (típicamente 25%)?
- ¿Hay trusts, nominales o estructuras complejas?

Señale estructuras que:
- Usen acciones al portador (alto riesgo)
- Tengan directores nominales (alto riesgo)
- Impliquen múltiples capas holding offshore (riesgo elevado)
- No puedan identificar persona natural como PBU (laguna crítica)

[VERIFY] cadena propiedad es completa y trazable a personas naturales.
```

### Paso 3 — Aplicar matriz reglas KYC

```
Evalúe este paquete KYC contra requisitos:

Tipo cliente: [persona individual / corporativo / fideicomiso / fondo]
Nivel riesgo: [estándar / medio / alto / PEP]
Nuestra política KYC requiere: [describe requisitos o pega política]

Documentos presentados:
[lista cada documento con fecha y emisor]

Para cada documento requerido, marque: ✓ Recibido | ✗ Faltante | ⚠ Necesita renovación (expirado)

Checklist KYC corporativo común:
- Certificado constitución ✓/✗
- Memorándum y artículos asociación ✓/✗
- Registro directores ✓/✗
- Registro accionistas / declaración PBU ✓/✗
- Prueba domicilio registrado ✓/✗
- Copias pasaporte certificadas todos PBU > 25% ✓/✗
- Prueba dirección todos PBU (< 3 meses) ✓/✗
- Declaración fuente fondos / origen riqueza ✓/✗
- Últimos estados auditados (si disponible) ✓/✗

Genere reporte lagunas listando todos items faltantes con prioridad (bloqueante vs. no-bloqueante).
[VERIFY] checklist coincide requisitos su jurisdicción.
```

### Paso 4 — Verificación PEP y sanciones

```
Evalúe estos nombres/entidades contra bases datos riesgo:

Nombres a evaluar: [listar todos directores, PBU y entidad]
Jurisdicciones: [países constitución y residencia]

Verificar contra:
- Lista Sanciones ONU
- Lista SDN OFAC (US)
- Lista Sanciones Consolidada UE
- Sanciones HM Treasury UK
- [Su lista jurisdicción]
- PEP (Persona Políticamente Expuesta): jefe estado, alto funcionario gobierno,
  magistrado, ejecutivo principal empresa pública, militar alto,
  familia inmediata y contactos conocidos

Para cada encontrado: coincidencia nombre exacta / coincidencia parcial / sin coincidencia
Señale coincidencias parciales para revisión mejorada.

Nota: Evaluación tiempo real requiere integración WorldCheck, Refinitiv, Dow Jones o similar.
Claude identifica nombres a evaluar; evaluación debe usar bases datos verificadas.
[VERIFY] todos nombres contra bases datos sanciones en vivo antes onboarding.
```

### Paso 5 — Evaluación riesgo y enrutamiento

```
Basado en revisión KYC anterior, evalúe riesgo general:

Factores riesgo presentes:
[listar lo encontrado — riesgo jurisdicción, PEP, estructura compleja, etc.]

Aplique scoring riesgo:
RIESGO BAJO: Corporativo doméstico estándar, evaluación limpia, documentación completa
RIESGO MEDIO: Uno o más factores riesgo elevado — enrutar manager conformidad
RIESGO ALTO: PEP, jurisdicción alto riesgo, estructura compleja, medios adversos — Due Diligence Mejorada requiere
RECHAZADO: Prohibido por política (jurisdicciones GAFI alto riesgo, sanciones hit, PBU no identificable)

Decisión enrutamiento:
- BAJO: Manager relación puede proceder
- MEDIO: Revisión manager conformidad en [X] días hábiles
- ALTO: Aprobación oficial conformidad senior + MLRO (Oficial Reporte Lavado Dinero) requerida
- RECHAZADO: Documentar decisión, referir MLRO para consideración Reporte Actividad Sospechosa

[VERIFY] decisión enrutamiento con oficial conformidad.
```

## Ejemplo

**Usuario:** Estamos incorporando holding Islas Vírgenes Británicas con tres capas propiedad antes de alcanzar PBU individuales.

**Análisis Claude:**

**Riesgo estructura:** ALTO — Jurisdicción BVI + capas holding múltiples + patrón director nominal.

**Documentos necesarios (adicional estándar):**
- Registro miembros cada entidad intermedia
- Declaración PBU notariada para cada capa
- Fuente riqueza para PBU excediendo 10% umbral (no solo 25%)
- Declaración propósito negocio holding BVI

**PEP/sanciones:** Evalúe todos nombres contra OFAC + UE + ONU + UK + listas. Estructura BVI justifica evaluación contra base datos propiedad beneficiaria FinCEN.

**Enrutamiento:** Due Diligence Mejorada requiere antes onboarding. Oficial conformidad senior y aprobación MLRO necesaria. [VERIFY] todos hallazgos.

---
