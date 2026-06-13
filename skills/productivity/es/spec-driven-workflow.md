---
name: spec-driven-workflow
description: "Desarrollo guiado por especificaciones: escriba la especificación primero, luego pruebas, luego implementación — reduce rework, aclara requisitos antes de codificar y produce sistemas mejor documentados"
---

# Habilidad de Flujo de Trabajo Guiado por Especificaciones

## Cuándo activar
- Comenzar una función no trivial donde los requisitos son ambiguos
- Construir una API o interfaz en la que otros equipos dependerán
- Reducir rework causado por construir lo incorrecto
- Practicar el desarrollo guiado por pruebas (TDD) a nivel de función
- Querer que Claude entienda la especificación antes de escribir ningún código

## Cuándo NO usar
- Pequeños arreglos de errores — simplemente árreglalos
- Prototipos exploratorios donde el objetivo es aprender, no enviar
- Tareas donde la especificación ya está perfectamente clara y escrita
- Hotfixes que necesitan salir inmediatamente

## Instrucciones

### Plantilla spec-first

```
Escribir una especificación para [función].

Función: [describe en inglés simple lo que quieres construir]
Usuarios: [quién usará esta función]
Contexto: [dónde encaja en el sistema — qué servicio, página o API]
Restricciones: [rendimiento, seguridad, compatibilidad con versiones anteriores, interfaces existentes]

Plantilla de especificación:

## Función: [Nombre]

### Resumen
[1-2 oraciones — qué hace esta función y por qué]

### Contexto
[¿Por qué estamos construyendo esto? ¿Qué problema resuelve?]

### Alcance
En alcance:
- [Comportamiento específico 1]
- [Comportamiento específico 2]

Fuera de alcance (explícito):
- [Cosa que NO construimos]
- [Caso extremo que estamos posponiendo]

### Definición de interfaz
[Para API: puntos finales, entradas, salidas, códigos de estado]
[Para UI: viaje del usuario, estados, transiciones]
[Para biblioteca: firmas de función, tipos, valores de retorno]

Ejemplo (API):
POST /api/invoices
Solicitud:
  { customer_id: string, items: [{sku: string, qty: int, price_cents: int}], due_date: string }
Respuesta 201:
  { invoice_id: string, total_cents: int, pdf_url: string }
Respuesta 400:
  { error: "invalid_customer" | "items_empty" | "invalid_date" }

### Criterios de aceptación (comprobables)
Formato: Dado [contexto], cuando [acción], entonces [resultado observable]

- DADO un cliente válido y artículos, CUANDO se llama al punto final, ENTONCES se devuelve una respuesta 201 con invoice_id
- DADO un customer_id inválido, CUANDO se llama al punto final, ENTONCES se devuelve una respuesta 400 con error: "invalid_customer"
- DADO un array de elementos vacío, CUANDO se llama al punto final, ENTONCES se devuelve una respuesta 400
- DADO artículos con precio negativo, CUANDO se llama al punto final, ENTONCES se devuelve una respuesta 400

### Preguntas abiertas (resolver antes de construir)
- [ ] [Pregunta 1 — decisión necesaria]
- [ ] [Pregunta 2 — suposición a validar]

### Dependencias
- [Servicio o API externo del que depende]
- [Dependencia de servicio o equipo interno]

Escribir la especificación completa para mi función.
```

### Traducción de spec a prueba

```
Convertir esta especificación en pruebas fallidas antes de la implementación.

Especificación: [pega la especificación de arriba]
Lenguaje/marco: [TypeScript/Jest / Python/pytest / Go/testing / Ruby/RSpec]

Reglas para spec-a-prueba:
1. Una prueba por criterio de aceptación
2. Prueba la interfaz (entradas/salidas), no la implementación
3. Las pruebas deben ser legibles como documentación — alguien debe entender la función leyendo las pruebas
4. Los caminos infelices son tan importantes como los caminos felices

Ejemplo TypeScript/Jest (de la especificación de factura anterior):

describe('POST /api/invoices', () => {
  describe('success cases', () => {
    it('creates an invoice with valid inputs and returns 201 with invoice_id', async () => {
      const res = await request(app).post('/api/invoices').send({
        customer_id: 'cust_valid',
        items: [{ sku: 'SKU-001', qty: 2, price_cents: 2999 }],
        due_date: '2026-12-31',
      });
      
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        invoice_id: expect.stringMatching(/^inv_/),
        total_cents: 5998,
        pdf_url: expect.stringContaining('https://'),
      });
    });
  });

  describe('validation errors', () => {
    it('returns 400 with invalid_customer when customer_id does not exist', async () => {
      const res = await request(app).post('/api/invoices').send({
        customer_id: 'cust_nonexistent',
        items: [{ sku: 'SKU-001', qty: 1, price_cents: 1000 }],
        due_date: '2026-12-31',
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('invalid_customer');
    });

    it('returns 400 when items array is empty', async () => {
      const res = await request(app).post('/api/invoices').send({
        customer_id: 'cust_valid',
        items: [],
        due_date: '2026-12-31',
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('items_empty');
    });
  });
});

Convertir mi especificación en pruebas fallidas. Las pruebas deben fallar hasta que implemente la función.
```

### Implementación desde especificación

```
Implementar [función] de acuerdo con esta especificación y pruebas.

Especificación: [pega la especificación]
Pruebas: [pega las pruebas fallidas]
Lenguaje/marco: [especificar]
Contexto de código existente: [pega interfaces, tipos o código adyacente relevante]

Reglas de implementación:
1. Hacer pasar las pruebas — nada más, nada menos
2. No construyas funciones que no estén en la especificación (aunque parezcan obviamente necesarias)
3. No optimices prematuramente — simple y correcto vence ingenioso
4. Manejar cada caso de error en los criterios de aceptación de la especificación
5. Preguntar si un criterio de aceptación es ambiguo en lugar de asumir

Orden de implementación:
1. Definir primero tipos / interfaces (compila a ninguna salida, documenta la forma)
2. Implementación de ruta feliz (hacer pasar la prueba 201)
3. Validación y manejo de errores (hacer pasar las pruebas 400)
4. Casos extremos (si hay alguno en la especificación)
5. Ejecutar todas las pruebas — confirmar que todas pasan antes de enviar

El código producido debe:
- No tener TODOs ni comentarios de marcador de posición
- No tener código comentado
- Compilar y ejecutarse sin modificación

Implementar la función.
```

### Revisión de especificación

```
Revisar esta especificación antes de que la construyamos.

Especificación: [pega]
Objetivo: capturar ambiguedades, casos extremos perdidos y suposiciones no alineadas antes de codificar

Lista de verificación de revisión:

INTEGRIDAD:
□ ¿Se especifican completamente todas las entradas (tipos, formatos, restricciones)?
□ ¿Se especifican completamente todas las salidas (éxito + respuestas de error)?
□ ¿Se enumeran todos los estados de error?
□ ¿Son específicos y comprobables los criterios de aceptación?
□ ¿Se establecen explícitamente los elementos fuera de alcance?

AMBIGÜEDAD:
□ ¿Está abierto algún criterio a múltiples interpretaciones?
□ ¿Se usan consistentemente los términos?
□ ¿Hay suposiciones implícitas que deberían ser explícitas?
□ ¿Necesita "due_date: string" una especificación de formato? (¿ISO 8601? ¿YYYY-MM-DD? ¿Consciente de la zona horaria?)

CASOS EXTREMOS PERDIDOS:
□ ¿Qué sucede con las entradas vacías?
□ ¿Qué sucede con las entradas de tamaño máximo?
□ ¿Qué sucede si una dependencia no está disponible?
□ ¿Qué sucede con solicitudes concurrentes?
□ ¿Qué sucede después de la limitación de velocidad?

REVISIÓN DE INTERFAZ:
□ ¿Es la API consistente con los puntos finales existentes?
□ ¿Se siguen las convenciones de nombres?
□ ¿Es el formato de respuesta consistente con otros puntos finales?
□ ¿Se usan correctamente los códigos de estado (201 para crear, 200 para actualizar, 404 para no encontrado)?

PREGUNTAS ABIERTAS:
□ ¿Se resuelven todas las preguntas abiertas antes de construir?
□ ¿Hay decisiones que se están posponiendo pero deberían tomarse ahora?

Producir: lista de brechas y preguntas a resolver antes de que comience la implementación.
```

## Ejemplo

**Usuario:** Quiero construir una función donde los usuarios pueden cargar un CSV de contactos e importarlos en masa. Ayúdame a especificarlo primero.

**Especificación de Claude:**

---

## Función: Importación en Masa de Contactos vía CSV

### Resumen
Permitir a los usuarios cargar un archivo CSV que contenga datos de contacto. El sistema valida cada fila, importa contactos válidos y devuelve un informe que muestra éxitos y fracasos.

### Alcance
En alcance:
- Carga de archivo CSV a través del punto final de API
- Validación de cada fila (campos requeridos, formato)
- Importación de filas válidas como contactos
- Informe de errores por fila (qué filas fallaron y por qué)
- Detección de duplicados (mismo correo electrónico → saltar o actualizar, configurable)

Fuera de alcance:
- Selector de archivos UI (solo API por ahora)
- Descarga de plantilla CSV
- Procesamiento asincrónico para archivos > 10.000 filas (sincrónico para v1)
- Deduplicación de contactos en contactos existentes (solo coincidencia de correo electrónico)

### Definición de interfaz

```
POST /api/contacts/import
Content-Type: multipart/form-data

Campos:
  file: archivo CSV (requerido)
  duplicate_strategy: "skip" | "update" (opcional, predeterminado: "skip")

Formato CSV (fila de encabezado requerida):
  email (requerido), first_name, last_name, phone, company

Respuesta 200 (siempre 200, incluso si algunas filas fallaron):
{
  total_rows: 847,
  imported: 821,
  skipped: 14,        // duplicates
  failed: 12,          // validation errors
  errors: [
    { row: 3,  email: "bad-email", reason: "invalid_email_format" },
    { row: 17, email: null,       reason: "email_required" },
  ]
}

Respuesta 400 (errores a nivel de archivo antes del procesamiento):
  { error: "no_file_attached" | "invalid_file_type" | "file_too_large" }
  Tamaño máximo de archivo: 10MB
```

### Criterios de aceptación
- DADO un CSV válido con 100 filas, CUANDO se importa, ENTONCES se devuelve 200 con imported: 100
- DADO un CSV con 1 correo electrónico inválido, CUANDO se importa, ENTONCES la fila está en errors[], todos los demás importados
- DADO sin archivo adjunto, CUANDO se llama al punto final, ENTONCES 400 con no_file_attached
- DADO un archivo .xlsx, CUANDO se carga, ENTONCES 400 con invalid_file_type
- DADO duplicate_strategy: "skip" y un correo electrónico duplicado, CUANDO se importa, ENTONCES el duplicado está en el recuento omitido
- DADO duplicate_strategy: "update" y un correo electrónico duplicado, CUANDO se importa, ENTONCES el contacto existente se actualiza

### Preguntas abiertas (resolver antes de construir)
- [ ] ¿Cuál es el número máximo de filas por archivo? (propuesto: 10.000 — necesita aprobación del PM)
- [ ] ¿Qué campos son requeridos vs. opcionales? (propuesto: solo correo electrónico requerido)
- [ ] ¿Es "company" una cadena de texto libre o vinculada a un registro de Empresa?
- [ ] ¿Quién puede llamar a este punto final — todos los usuarios o solo administradores?

---

Resuelve las preguntas abiertas primero, luego generaré las pruebas fallidas.

---
