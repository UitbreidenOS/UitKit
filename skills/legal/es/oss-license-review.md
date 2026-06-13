---
name: oss-license-review
description: "Clasificación de licencia de código abierto: permisivo vs copyleft vs copyleft de red, matriz de compatibilidad, obligaciones del modelo de despliegue, requisitos de atribución y notificación"
---

> 🇪🇸 Versión en español. [Versión en inglés](../oss-license-review.md).

# Habilidad de Revisión de Licencia de Código Abierto

## Cuándo activar
- Revisando las licencias de código abierto de dependencias antes de enviar un producto
- Determinando si la licencia de una biblioteca es compatible con su producto comercial
- Entendiendo qué obligaciones tiene al distribuir software con componentes de código abierto
- Verificando si usar una biblioteca GPL requeriría que abriera su propio código
- Creando una lista de materiales de software (SBOM) para cumplimiento o ventas empresariales

## Cuándo NO usar
- Opiniones legales formales sobre compatibilidad de licencias para situaciones de alto riesgo — consulte a un abogado
- Licencia de patentes o indemnización de patentes — otra área del derecho de propiedad intelectual
- Marcas registradas relacionadas con nombres de proyectos de código abierto — análisis diferente

## Instrucciones

### Clasificar una licencia individual

```
Clasifique esta licencia y explique lo que significa para mi proyecto:

Licencia: [MIT / Apache 2.0 / GPL v2 / GPL v3 / LGPL / AGPL / MPL 2.0 / BSD 2-cláusula / BSD 3-cláusula / otra]

Mi proyecto:
- Tipo: [SaaS (sin distribución binaria) / aplicación móvil / aplicación de escritorio / biblioteca / incrustada]
- Cómo uso esta biblioteca: [vinculada / incluida / modificada / sin modificar]
- Distribución: [sí — público / solo interno / sin distribución]

Dígame:
1. ¿En qué categoría cae esta licencia (permisiva / copyleft débil / copyleft fuerte / copyleft de red)?
2. ¿Cuáles son mis obligaciones específicas?
3. ¿Necesito liberar mi código fuente?
4. ¿Qué requisitos de atribución/notificación se aplican?
5. ¿Hay una concesión de patente?
```

### Matriz de compatibilidad de licencias

```
Mi proyecto tiene licencia: [MIT / Apache 2.0 / comercial propietario / otro]

Quiero usar estas dependencias de código abierto:
1. [nombre de biblioteca] — [licencia]
2. [nombre de biblioteca] — [licencia]
3. [nombre de biblioteca] — [licencia]

Para cada dependencia:
- ¿Es esta licencia compatible con la licencia de mi proyecto?
- ¿Qué obligaciones crea?
- ¿Puedo distribuir mi producto sin liberar mi código fuente?
- ¿Consideraciones especiales para despliegue de SaaS/nube?
```

### Las categorías de licencia clave

```
Explique las categorías de licencia de código abierto clave y sus implicaciones prácticas:

PERMISIVO (usar libremente, obligaciones mínimas):
- MIT: usar, modificar, distribuir libremente — solo mantenga el aviso de copyright
- Apache 2.0: lo mismo que MIT + concesión de patente + documentación de cambios requerida
- BSD 2/3-cláusula: similar a MIT, redacción de atribución ligeramente diferente

COPYLEFT DÉBIL (las modificaciones a la biblioteca deben compartirse, pero no su aplicación):
- LGPL v2.1/v3: las modificaciones a la biblioteca LGPL en sí deben ser de código abierto
  La vinculación dinámica generalmente es segura; la vinculación estática puede activar obligaciones
- MPL 2.0: copyleft a nivel de archivo — los archivos MPL modificados deben ser de código abierto

COPYLEFT FUERTE (toda la obra vinculada puede necesitar ser de código abierto):
- GPL v2: la distribución activa la liberación completa de fuentes para obras vinculadas/combinadas
- GPL v3: lo mismo que v2 + anti-tivolización + disposiciones de terminación de patentes

COPYLEFT DE RED (el uso de SaaS activa la liberación de fuentes):
- AGPL v3: ejecutar un programa AGPL modificado como servicio de red = distribución
  Usar una biblioteca AGPL en su SaaS puede requerir que libere todo su código
```

### Auditoría de dependencias

```
Audite las dependencias de su proyecto para detectar riesgos de licencia.

[pegue su package.json / requirements.txt / pom.xml / go.mod / Cargo.toml]

Mi tipo de proyecto: [SaaS / aplicación propietaria / biblioteca de código abierto]
Mi intención comercial: [vender como producto / solo interno / código abierto]

Marcar:
1. Cualquier licencia copyleft que podría afectar su capacidad de mantener el código fuente cerrado
2. Cualquier licencia AGPL (riesgo más alto para SaaS)
3. Licencias que son incompatibles entre sí
4. Cualquier licencia sin concesión de patente clara (relevante para uso comercial)
5. Licencias que requieren atribución específica en su interfaz de usuario de producto o documentación
```

### Requisitos de atribución y notificación

```
Necesito incluir la atribución adecuada en mi producto para estos componentes de código abierto:

[listar bibliotecas y sus licencias]

Genere los avisos de atribución que necesito incluir, en el formato requerido por cada licencia.
Dígame dónde colocarlos: en la interfaz de usuario de la aplicación, en documentación, en el binario distribuido o en archivos fuente.
```

## Ejemplo

**Usuario:** Estamos construyendo un producto SaaS y descubrimos que estamos usando una biblioteca con licencia AGPL para generación de PDF. No lo sabíamos. ¿Qué significa esto?

**Análisis de Claude:**

**Problema crítico — AGPL en un producto SaaS.**

La sección 13 de AGPL v3 extiende el copyleft de GPL al uso de red: "si modifica el Programa, su versión modificada debe ofrecer prominentemente a todos los usuarios que interactúen con él remotamente a través de una red informática (si su versión admite tal interacción) una oportunidad de recibir la Fuente Correspondiente."

**Lo que significa para su SaaS:**
- Si modificó la biblioteca de alguna manera, puede ser requerido liberar su código fuente de aplicación completo a los usuarios que interactúan con ella sobre la red
- Incluso si la utilizó sin modificaciones, los requisitos de "fuente correspondiente" del AGPL se interpretan ampliamente en algunas jurisdicciones

**Sus opciones:**
1. **Reemplace la biblioteca** con una alternativa con licencia MIT/Apache (recomendado si desea mantener el código fuente cerrado)
2. **Compre una licencia comercial** si la biblioteca ofrece una licencia comercial/empresarial sin restricciones de AGPL (patrón común — verifique su sitio web)
3. **Código abierto su SaaS** bajo una licencia compatible (raramente el resultado deseado)
4. **Consulte a un abogado** para evaluar su riesgo específico dada su jurisdicción, caso de uso y si modificó la biblioteca

**Acción inmediata:** Deje de distribuir el producto actual hasta que tenga una resolución. [VERIFY] interpretación con un abogado de propiedad intelectual.

---
