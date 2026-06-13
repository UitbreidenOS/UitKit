# Marcador de Escalada

## Cuándo activar

- Después que revisión de contrato identifica problemas que pueden exceder la autoridad del revisor
- Cualquier cláusula de contrato desencadena una condición de escalada automática (ver Paso 1 abajo)
- Incertidumbre sobre si un término requiere aprobación de nivel superior antes de proceder

## Cuándo NO usar

- Como sustituto para leer el contrato — esta habilidad marca problemas en un contrato revisado, no es sustituto para leer uno
- Para asesoramiento legal — esta habilidad enruta problemas al nivel de autoridad correcto ; no proporciona asesoramiento legal sobre los méritos de un término

## Instrucciones

Aplique el árbol de decisión de escalada en orden. Deténgase en el primer activador que se dispare — los pasos anteriores anulan los posteriores.

---

**Paso 1 — Activadores automáticos (siempre escalar independientemente del valor del contrato o antigüedad del revisor)**

Los siguientes términos requieren escalada a General Counsel o socio principal independientemente del valor del contrato o antigüedad del revisor :

- Cláusula de responsabilidad ilimitada (cualquier forma)
- Asignación de PI a la contraparte, incluidas cláusulas de trabajo por encargo que cubren PI de productos principales
- Licencia exclusiva perpetua para tecnología o datos de la organización
- Cualquier término en la lista documentada « nunca aceptar » de la organización (del perfil de estrategia)
- Impacto de sanciones confirmado en la contraparte

Si se dispara activador automático → establecer `Escalada requerida : SÍ` y `Escalar a : General Counsel / Socio Principal`.

---

**Paso 2 — Verificación de autoridad en dólares**

¿Excede el valor del contrato el límite de autoridad del revisor ?

Umbrales predeterminados (reemplazar con perfil de organización si está disponible) :

```
Ayudante legal :  <$50K, solo términos estándar
Counsel :    <$500K, términos estándar + alternativas documentadas
General Counsel :         ilimitado, todos los términos incluidos no estándar
```

Si el valor del contrato excede la autoridad del revisor → escalar al siguiente nivel de autoridad.

---

**Paso 3 — Términos no estándar**

¿Algún término negociado está fuera de las posiciones alternativas documentadas en la estrategia de la organización ?

Si es así → escalar al nivel de autoridad definido para términos no estándar en la estrategia. Documente qué término y cómo se desvía.

---

**Paso 4 — Silencio de Estrategia**

¿Aparece un término material que la estrategia no aborda en absoluto ?

Si es así → marcas como AMARILLO. No proceder. Pida al equipo que defina una posición para ese tipo de término antes de que este contrato avance. Los términos materiales no abordados no son seguros de aprobar por defecto.

---

**Formato de salida :**

```
EVALUACIÓN DE ESCALADA — [Nombre del Contrato]
Contraparte : [nombre]
Valor del contrato : $[X]
Revisor : [rol]

Activadores automáticos :   [ninguno / lista cada activador encontrado]
Autoridad en dólares :     $[valor del contrato] vs $[límite del revisor] → [dentro del límite / EXCEDE]
Términos no estándar :   [ninguno / lista cada desviación de estrategia]
Brechas de estrategia :        [ninguna / lista cada término material no abordado]

Escalada requerida :  [SÍ / NO]
Escalar a :          [rol y nombre del perfil org]
Canal :              [Slack / email]

---
Borrador de mensaje de escalada :

Hola [nombre],

Estoy revisando [nombre del contrato] con [contraparte]. Necesito su aprobación antes de proceder en :

1. [Término 1] — [lo que dice] — [por qué requiere su aprobación]
2. [Término 2] — [lo que dice] — [por qué requiere su aprobación]

Valor del contrato : $[X]. Contraparte : [nombre]. Plazo : [si se conoce, de lo contrario « no especificado »].

¿Puede revisar y asesorar ?
```

**Regla de costo-beneficio :** El costo de una escalada innecesaria (aproximadamente 30 segundos de atención de un revisor senior) es siempre menor que el costo de proceder con términos no estándar no aprobados. En caso de duda, marque.

**Nota :** Esta habilidad redacta el mensaje de escalada. No lo envía — el revisor lee el borrador, confirma la precisión y envía.

## Ejemplo

**Entrada :** « Un contrato de proveedor tiene una sección de NDA mutua, límite de responsabilidad limitado a 1× honorarios (nuestra posición alternativa aceptable estándar), pero incluye una cláusula que asigna todo el PI desarrollado durante el compromiso al proveedor. Marque apropiadamente. »

**Salida esperada :**

```
EVALUACIÓN DE ESCALADA — Acuerdo de Servicios de Proveedor (Acme Corp)
Contraparte : Acme Corp
Valor del contrato : $120.000
Revisor : Counsel

Activadores automáticos :   ASIGNACIÓN DE PI — La sección 8.3 asigna todos los productos de trabajo y PI desarrollados durante el compromiso al Proveedor. Este es un activador de escalada automática independientemente del tamaño del trato.
Autoridad en dólares :     $120.000 vs $500.000 (límite de Counsel) → dentro del límite
Términos no estándar :   La asignación de PI está en la lista de nunca aceptar
Brechas de estrategia :        ninguna

Escalada requerida :  SÍ
Escalar a :          Consejero General
Canal :              Slack (#legal-escalations)

---
Borrador de mensaje de escalada :

Hola [nombre de GC],

Estoy revisando el Acuerdo de Servicios de Proveedor con Acme Corp (compromiso de $120K). Necesito su aprobación antes de proceder en :

1. Sección 8.3 — Asignación de PI — asigna todos los productos de trabajo y PI desarrollados durante el compromiso a Acme Corp. Esto desencadena una escalada automática según nuestra estrategia (elemento de lista de nunca aceptar).

Valor del contrato : $120.000. Contraparte : Acme Corp. Plazo : no especificado.

¿Puede revisar y asesorar ?
```

---
