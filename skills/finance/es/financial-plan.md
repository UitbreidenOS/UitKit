---
name: financial-plan
description: "Planificación financiera de gestión de patrimonio: análisis de flujo de caja, proyecciones de jubilación, financiamiento de educación, lista de verificación de patrimonio — para individuos y familias"
---

# Habilidad de Planificación Financiera

## Cuándo activar
- Construir un plan financiero integral para un cliente o para ti mismo
- Ejecutar una proyección de ahorros para jubilación (¿cuánto es suficiente?)
- Modelar el financiamiento de la educación (planes 529, montos objetivo)
- Revisar las brechas de cobertura de seguros
- Crear una lista de verificación de planificación patrimonial
- Hacer pruebas de estrés en un plan financiero contra caídas del mercado o pérdida de empleo

## Cuándo NO usar
- Recomendaciones de inversión específicas — requiere un asesor financiero autorizado
- Declaración de impuestos o asesoramiento fiscal — consulta con un CPA o abogado tributario
- Documentos legales (testamentos, fideicomisos) — requiere un abogado especializado en bienes

## ⚠️ Importante

Las proyecciones de planificación financiera se basan en suposiciones sobre rendimientos, inflación y eventos de la vida. Todas las proyecciones conllevan incertidumbre material. `[VERIFICAR]` todos los resultados con un planificador financiero autorizado. Claude ayuda a estructurar el análisis — no proporciona asesoramiento financiero regulado.

## Instrucciones

### Paso 1 — Panorama financiero

```
Construir un panorama financiero para:

Situación actual:
- Edad: [X], edad objetivo de jubilación: [X]
- Ingresos actuales: $[X]/año bruto, $[X]/año neto
- Ingresos de la pareja (si corresponde): $[X]
- Ahorros actuales:
  - 401(k)/IRA: $[X]
  - Cuenta de inversión imponible: $[X]
  - Efectivo/fondo de emergencia: $[X]
  - Otros: $[X]
- Gastos mensuales: $[X] (o enumera las categorías principales)
- Tasa de ahorro mensual: $[X]
- Deuda actual: hipoteca $[X], préstamos estudiantiles $[X], otros $[X]
- Equidad del hogar: $[X]

Metas:
- Jubilación a los [X] años
- Financiamiento de educación universitaria: [X] hijos, edades [X, X]
- Compras mayores: [enumera]
- Otras metas: [describe]
```

### Paso 2 — Proyección de jubilación

```
Proyectar preparación para jubilación.

Entradas:
- Edad actual: [X], edad de jubilación: [X] = [X] años hasta jubilación
- Ahorros de jubilación actuales: $[X]
- Contribuciones mensuales: $[X]
- Rendimiento anual esperado: [X]% (usar conservador 6-7% para cartera de acciones a largo plazo)
- Inflación esperada: 3%
- Seguro Social estimado en jubilación: $[X]/mes (verificar SSA.gov)
- Gastos de jubilación esperados: $[X]/mes en dólares actuales

Proyectar:
1. Valor futuro del ahorro actual en jubilación
2. Valor futuro de contribuciones continuas
3. Activos de jubilación totales a [edad de jubilación]
4. Tasa de retiro sostenible (regla del 4%: activos × 4% = ingresos anuales)
5. Comparación con meta: ¿brecha o superávit?
6. Monte Carlo: ¿con qué probabilidad no se me acaba el dinero?

[VERIFICAR] proyecciones con un planificador financiero autorizado.
```

### Paso 3 — Financiamiento de educación

```
Modelar financiamiento de educación para [X] hijos.

Hijo 1: Edad [X], inicio de universidad estimado: [año]
Meta: [universidad pública estatal / privada / Ivy League]
Costos actuales (en dólares actuales): [estatal ~$25-30K/año, privada ~$60-80K/año, Ivy ~$85K+/año]
Total de 4 años (en dólares actuales): $[X]
Tasa de inflación educativa: ~5% por año

Saldo actual 529: $[X]
Contribuciones mensuales a 529: $[X]
Rendimiento esperado en 529: [X]% (típicamente 6-8% pesado en acciones cuando el hijo es joven)

Calcular:
1. Costo proyectado de 4 años cuando el hijo comienza universidad
2. Saldo 529 proyectado al inicio universitario
3. Brecha de financiamiento (si existe)
4. Contribución mensual necesaria para financiar completamente

[VERIFICAR] proyecciones con especialista en planificación universitaria.
```

### Paso 4 — Análisis de brechas de seguros

```
Revisar mi cobertura de seguros para identificar brechas:

Cobertura actual:
- Seguro de vida: $[X] (plazo / vida entera, plazo vence [año])
- Seguro de incapacidad: [X]% reemplazo de ingresos, período de eliminación de [X] días
- Seguro de salud: [deducible], [máximo de bolsillo]
- Seguro de propietario/arrendatario: $[X] cobertura
- Póliza sombrilla: $[X] o ninguna
- Seguro de cuidado a largo plazo: sí / no

Perfil:
- Dependientes: [X]
- Ingresos: $[X]
- Deudas: $[X]
- Activos: $[X]

Identificar:
1. Adecuación del seguro de vida (regla: 10-12x ingresos)
2. Cobertura de incapacidad (¿tengo suficiente?)
3. Necesidad de cuidado a largo plazo (típicamente relevante a los 50+)
4. Necesidad de póliza sombrilla (típicamente: si patrimonio neto > $500K o riesgo de responsabilidad profesional)
```

### Paso 5 — Lista de verificación de planificación patrimonial

```
Revisar mi estado de planificación patrimonial:

Documentos actuales:
- Testamento: [sí/no/obsoleto]
- Fideicomiso viviente: [sí/no]
- Poder notarial: [sí/no]
- Directiva de atención médica / testamento vital: [sí/no]
- Designaciones de beneficiarios revisadas: [sí/no, última actualización: año]
- Seguro de vida pagadero a: [patrimonio / fideicomiso / beneficiario designado]

Situación familiar:
- Casado(a): [sí/no], cónyuge es ciudadano estadounidense: [sí/no]
- Hijos menores de edad: [sí/no]
- Familia ensamblada / hijastros: [sí/no]
- Dependientes con necesidades especiales: [sí/no]
- Valor patrimonial estimado: $[X]

Banderas:
1. Qué falta y por qué es importante
2. Exposición a impuesto sobre herencia (federal: patrimonios > ~$13M; algunos estados más bajo)
3. Si un fideicomiso está justificado
4. Desalineaciones de designación de beneficiarios

[VERIFICAR] con abogado especializado en planificación patrimonial.
```

## Ejemplo

**Usuario:** Edad 38, casado, dos hijos (6 y 4), ingresos familiares $180K, $250K en 401(k), $0 en 529, hipoteca $400K, quiere jubilarse a los 62.

**Análisis de Claude:**

**Jubilación (24 años):**
$250K creciendo a 7% + $1.500/mes en contribuciones → ~$2,1M a los 62 [VERIFICAR]
Regla del 4% → $84K/año + Seguro Social → probablemente suficiente para $120K en gastos objetivo

**Educación (12 y 14 años):**
2 hijos × $400K (universidad privada proyectada) = $800K necesarios [VERIFICAR]
$0 en 529 + 12-14 años → necesario ~$1.400/mes en 529 para ambos hijos
O: $700/mes por hijo comenzando ahora

**Prioridad jubilación vs educación:**
Ambos son alcanzables con ingresos actuales. Prioridad: maximizar 401(k) hasta coincidencia patronal primero, luego 529, luego ahorro de jubilación adicional.

**Acciones inmediatas:**
1. Abrir 529s para ambos hijos esta semana
2. Revisar seguro de vida (actual: desconocido — verificar si 10x ingresos = $1,8M está cubierto)
3. Redactar testamento y poder notarial (no hay documento mencionado — crítico con hijos menores)

---
