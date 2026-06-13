---
name: nda-review
description: "NDA triage and review: classify type, flag playbook deviations (GREEN/YELLOW/RED), identify scope issues, missing exclusions, hidden obligations — attorney review gate"
---

> 🇪🇸 Versión en español. [Versión en inglés](../nda-review.md).

# Habilidad de Revisión de Acuerdo de Confidencialidad (NDA)

## Cuándo activar
- Revisando un acuerdo de no divulgación (NDA) antes de firmar
- Triando un lote de NDAs para identificar cuáles necesitan atención de un abogado
- Entendiendo qué significa una cláusula NDA específica en lenguaje llano
- Verificando si un NDA tiene exclusiones y protecciones estándar
- Comparando los términos de un NDA contra las posiciones estándar del playbook de su empresa

## Cuándo NO usar
- Firmar en nombre de su organización — eso requiere un firmante autorizado
- Interpretar los términos de un NDA en una disputa activa — consulte a su abogado
- NDAs multijurisdiccionales con obligaciones transfronterizas complejas — necesita especialista

## Advertencia importante

Claude puede identificar problemas y explicar cláusulas. No puede dar asesoramiento legal, interpretar la ley específica de una jurisdicción, ni garantizar que ha detectado todos los problemas. **Haga que un abogado revise cualquier NDA antes de firmar si la relación es significativa.**

## Instrucciones

### Primero — clasificar el NDA

```
Revise este NDA y dígame:
1. ¿Es mutuo (ambas partes protegidas) o unilateral (solo una parte)?
2. ¿Quién es la parte divulgadora y quién es la parte receptora?
3. ¿Cuál es el plazo (duración)?
4. ¿Qué jurisdicción lo rige?

Texto del NDA: [pegar]
```

### Revisión completa según el playbook

```
Revise este NDA contra nuestras posiciones estándar:

Nuestras posiciones estándar:
- Preferencia por NDAs mutuos; unilateral aceptable si somos la parte receptora
- Plazo máximo del NDA: 3 años
- Definición de Información Confidencial: debe estar marcada o confirmada por escrito dentro de los 30 días
- Exclusiones estándar requeridas: dominio público, conocimiento previo, desarrollo independiente, divulgación obligada
- Ley aplicable: [su jurisdicción preferida]
- Sin cláusula de no solicitud ni de no competencia oculta en el NDA

Texto del NDA: [pegar]

Marque cada problema como VERDE (aceptable), AMARILLO (negociar), o ROJO (bloqueante).
```

### Verificación de exclusiones estándar

Todo NDA debería tener estas 4 exclusiones. Claude las verifica:

```
Verifique si este NDA contiene las 4 exclusiones estándar:
1. Información ya en el dominio público (no por incumplimiento)
2. Información que la parte receptora ya conocía antes de la divulgación
3. Información desarrollada independientemente por la parte receptora
4. Información que debe divulgarse por ley u orden judicial (divulgación obligada)

Texto del NDA: [pegar]

Si alguna falta, marcar como AMARILLO y redactar el lenguaje faltante.
```

### Análisis de obligaciones ocultas

```
Escanee este NDA para detectar obligaciones más allá de la confidencialidad estándar:
- Cláusulas de no solicitud (restricciones de contratación)
- Disposiciones de no competencia
- Lenguaje de cesión de propiedad intelectual
- Obligaciones de exclusividad
- Disposiciones de standstill (límites en actividades de M&A)

Texto del NDA: [pegar]

Marque todo lo que vaya más allá de la confidencialidad estándar como ROJO — esto no pertenece a un NDA.
```

### Explicación en lenguaje llano

```
Explique esta cláusula NDA en lenguaje llano:
"[pegar cláusula]"

Dígame: ¿qué significa esto realmente para mi negocio? ¿Cuál es la implicación práctica?
```

### Sugerencias de revisión

```
Este NDA tiene los siguientes problemas en los que quiero negociar:
[listar los problemas de la revisión anterior]

Redacte el lenguaje de revisión para cada problema — lo que quiero que diga en su lugar.
Formato: Texto original → Revisión propuesta → Razón
```

## Ejemplo

**Un NDA unilateral donde usted es la parte receptora:**

```
ROJO — Definición excesivamente amplia de Información Confidencial
Sección 1: "Toda la información divulgada por la Parte Divulgadora, en cualquier forma"
Problema: Sin requisito de marcado y sin exclusión para divulgaciones verbales.
          Podría quedar obligado inadvertidamente por cualquier cosa dicha en cualquier reunión.
Solución: Agregar "...siempre que las divulgaciones verbales sean confirmadas por escrito dentro
     de los 30 días de la divulgación como confidenciales."

AMARILLO — El plazo de 5 años excede el estándar
Sección 8: "Este Acuerdo permanecerá en vigor durante cinco (5) años"
Problema: 5 años es más largo que el estándar de 3 años. Manejable pero vale la pena negociarlo.
Solución: Proponer 2-3 años para la mayoría de los NDAs comerciales.

ROJO — Falta la exclusión de "desarrollo independiente"
La Sección 2 solo tiene 3 de las 4 exclusiones estándar — el desarrollo independiente está ausente.
Solución: Agregar: "(d) información desarrollada independientemente por la Parte Receptora sin
     uso ni referencia a la Información Confidencial de la Parte Divulgadora."

VERDE — Ley aplicable (California): aceptable si opera allí.
VERDE — Excepciones mutuas para divulgación obligada: presentes y estándar.

RECOMENDACIÓN: No firmar tal como está. Los puntos ROJOS deben corregirse antes de la ejecución.
Revisión por abogado: Recomendada si este NDA acompaña una relación comercial significativa.
```

---
