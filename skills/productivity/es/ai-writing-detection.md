# Detección de Escritura de IA

## Cuándo activar
Auditar documentación, publicaciones de blog o copia de marketing para texto con patrones de IA; cuando el usuario quiere que el contenido suene más humano; revisar un README o documento público antes de publicar.

## Cuándo NO usar
- Especificaciones técnicas o documentación de API donde la precisión importa más que la voz
- Documentación de herramientas internas donde la audiencia no se preocupa por el registro
- Contenido que ya ha sido revisado y aprobado — no relitigar

## Instrucciones

### Patrones Comunes de Texto de IA para Señalar

**Coletillas de cobertura — eliminar completamente:**
- "Vale la pena notar que..."
- "Es importante entender que..."
- "¡Ciertamente!" / "¡Absolutamente!" / "¡Por supuesto!" (respuestas de apertura)
- "Me encantaría ayudarte con eso."

**Sobre-uso de transiciones — reemplazar con una oración directa o nada:**
- "En conclusión, ..." — solo termina el párrafo
- "Además, ..." — solo di la siguiente cosa
- "Además, ..." — lo mismo
- "Adicionalmente, ..." — lo mismo
- "En resumen, ..." — solo válido si resumes >5 elementos

**Sobre-uso de guiones largos:** más de un guión largo por párrafo es una fuerte señal; usa un período o coma en su lugar.

**Entusiasmo no ganado:** oraciones que usan signos de exclamación para afirmaciones notables ("¡Esto hace el desarrollo más rápido!"). Reserva `!` para resultados genuinamente sorprendentes.

**Preámbulo antes de responder:** reformular la pregunta antes de responderla ("Preguntaste sobre X. X es un tema importante porque..."). Corta a la respuesta.

**Apilamiento de palabras clave sin sustancia:**
- "aprovechando soluciones impulsadas por IA de vanguardia"
- "valor sinérgico agregado para las partes interesadas"
- "arquitectura robusta y escalable"
Estas frases no contienen información. Reemplaza con un reclamo concreto o elimina.

**Sobre-calificación:** "podría potencialmente", "podría posiblemente", "podría quizás". Elige una cobertura o ninguna.

### Principios de Reescritura

1. **Conducir con el hecho.** Malo: "Es importante notar que la autenticación requiere un token válido." Bueno: "Las solicitudes requieren un token válido."

2. **Corta preámbulo.** Elimina cualquier oración que reformule el contexto que el lector ya tiene.

3. **Prefiere sustantivos concretos.** Malo: "el sistema procesa los datos." Bueno: "la API valida y almacena el cuerpo de la solicitud."

4. **Voz activa.** Malo: "La configuración se carga por la aplicación al inicio." Bueno: "La aplicación carga la configuración al inicio."

5. **Haz coincidir el vocabulario con el lector.** Una audiencia de desarrolladores no necesita explicaciones "en otras palabras" de REST o JSON. Una audiencia no técnica no necesita acrónimos sin explicación.

6. **Elimina cualquier cosa que no añada información.** Lee cada oración y pregunta: si eliminara esto, ¿el lector sabría menos? Si no, elimínalo.

### Qué No Cambiar
- Términos técnicos, aunque suenen formales — "idempotente", "deserialización", "mutex" son precisos
- Ejemplos de código — nunca reescribas código como parte de una limpieza de prosa
- Hechos precisos — solo reescribe la prosa alrededor de ellos, no los reclamos mismos
- Listas estructuradas — si una lista es clara y correcta, déjala; no conviertas a prosa

### Lista de Verificación de Detección
Recorre esta lista cuando revises un documento:
- [ ] ¿Alguna oración comienza con "Vale la pena notar" o "Es importante notar"?
- [ ] ¿Hay más de 2 guiones largos por página?
- [ ] ¿Algún párrafo comienza con "Ciertamente", "Absolutamente" o "Por supuesto"?
- [ ] ¿Se usa "En conclusión" en cualquier lugar excepto después de un resumen multi-elemento?
- [ ] ¿Se usan "además", "además" o "adicionalmente" más de una vez por sección?
- [ ] ¿Hay signos de exclamación en afirmaciones notables?
- [ ] ¿El párrafo de apertura reformula el título del documento o la pregunta que se responde?
- [ ] ¿Hay frases como "robusto", "escalable", "vanguardia", "poderoso" sin evidencia de apoyo?

### Niveles de Gravedad
- **Eliminar:** coletillas, preámbulo, entusiasmo no ganado, palabras clave sin sustancia — estos no agregan valor
- **Reescribir:** afirmaciones sobre-calificadas, voz pasiva, hechos enterrados — reestructura la oración
- **Revisar:** guiones largos, palabras de transición — uno por sección puede estar bien; el sobre-uso es el problema

## Ejemplo

**Original (texto con patrones de IA):**
> Vale la pena notar que nuestra plataforma aprovecha inteligencia artificial de vanguardia para entregar soluciones robustas y escalables. Además, el sistema está diseñado para manejar grandes volúmenes de datos de manera eficiente. En conclusión, esto la hace una excelente opción para clientes empresariales.

**Después de aplicar esta habilidad:**
> La plataforma procesa hasta 10,000 solicitudes por segundo y escala horizontalmente entre regiones. Los clientes empresariales pueden implementarla sin cambios de infraestructura.

Cambios realizados: eliminado "vale la pena notar", reemplazado "IA vanguardia / robusto / escalable" con un número de rendimiento concreto, eliminado "además" e "en conclusión", convertido a voz activa, y cortado la oración de cierre redundante.

---
