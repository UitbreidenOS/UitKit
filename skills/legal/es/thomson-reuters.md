# Investigación Legal Thomson Reuters vía MCP

## Cuándo activar
Investigación legal que requiere jurisprudencia, estatutos, regulaciones o contenido Westlaw/Practical Law; el usuario es un abogado o investigador legal usando Claude Code con una suscripción API Thomson Reuters activa; tareas que requieren citas autorizadas de fuentes legales primarias y secundarias.

## Cuándo NO usar
Usuarios sin suscripción API Thomson Reuters — este MCP es solo para empresas, no está disponible gratuitamente; tareas que no requieren investigación legal autorizada; cualquier cosa que requiera asesoramiento legal (este MCP proporciona investigación, no asesoramiento — siempre marque esta distinción).

## Instrucciones

**Lo que es :**
Thomson Reuters lanzó una integración oficial de MCP (mayo de 2026) que conecta Claude directamente a bases de datos Westlaw, Practical Law y otras de TR. Las consultas pasan a través de su clave API de TR a bases de datos legales en vivo.

**Configuración :**
Agregue a su configuración de MCP con su clave API de TR apuntando al punto final de MCP de TR. Requiere una suscripción activa a la API Thomson Reuters Enterprise — póngase en contacto con su representante de cuenta de TR para obtener acceso.

**Datos disponibles :**
- Jurisprudencia con citas completas (cortes federales y estatales, todos los niveles)
- Estatutos federales y estatales, actuales e históricos
- Reglamentaciones federales y estatales (CFR, códigos administrativos estatales)
- Fuentes secundarias a través de Practical Law: notas de orientación, documentos estándar, consejos de negociación, comparaciones de jurisdicciones
- Formularios y plantillas legales

**Patrones de consulta que funcionan bien :**

Jurisprudencia :
```
Encuentre casos que interpreten cláusulas de fuerza mayor en contratos de software de 2020-2026.
Devuelve citas en formato Bluebook y un resumen de sentencia de dos oraciones para cada una.
```

Búsqueda de estatuto :
```
¿Cuál es el texto actual de 17 U.S.C. § 107 (uso justo)?
Tenga en cuenta cualquier enmienda desde 2020.
```

Reglamentario :
```
Resume la última regla de la FTC sobre revelaciones de contenido generado por IA.
Incluya la cita del CFR y la fecha efectiva.
```

Fuente secundaria Practical Law :
```
¿Cuál es la posición de negociación estándar sobre límites de limitación de responsabilidad
en acuerdos SaaS? Referencia la nota de orientación relevante de Practical Law.
```

**Advertencia de salida OBLIGATORIA — incluir en cada salida de investigación :**
> Solo para propósitos de investigación — verifique con abogado autorizado antes de confiar en cualquier análisis legal.

**Formato de citación :** Siempre solicite formato Bluebook. Verifique todas las citas de forma independiente antes de presentar — las citas recuperadas por MCP pueden contener errores de formato y no deben ir directamente en documentos judiciales.

**Nota de privilegio :** Confirme si la investigación es para un asunto específico del cliente (el privilegio abogado-cliente puede aplicarse) o investigación de antecedentes general. Esta distinción afecta cómo se debe almacenar y compartir el resultado.

**Combine con CourtListener :** Para cobertura integral, empareje Thomson Reuters (fuentes secundarias, análisis de Westlaw) con MCP de Free Law Project (fuentes primarias gratuitas para búsquedas masivas). TR para profundidad; CourtListener para amplitud y volumen.

## Ejemplo

```
Encuentre todos los casos de la corte de circuitos de 2022-2026 que interpreten la disposición
"excede el acceso autorizado" del CFAA. Resuma la división del circuito
y la posición actual de la Corte Suprema después de Van Buren v. Estados Unidos.
Devuelve citas Bluebook para cada caso.
```

Claude consulta Westlaw a través del MCP de TR, devuelve un análisis estructurado de división de circuitos con citas, señala áreas de desacuerdo continuo y añade la advertencia obligatoria de investigación.

---

> **Trabaje con nosotros:** Claudient es respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
