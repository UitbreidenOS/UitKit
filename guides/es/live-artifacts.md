# Artefactos vivos — Salidas interactivas conectadas a datos

Los artefactos vivos son salidas de Claude que se conectan a fuentes de datos en vivo y se actualizan automáticamente cuando se abren. A diferencia de los artefactos estáticos — que se generan una vez y se congelan — los artefactos vivos extraen de APIs, servidores MCP, bases de datos y hojas de cálculo en el momento de la visualización para mostrar datos actuales.

---

## Qué hace que un artefacto sea vivo

Un artefacto vivo se diferencia de un artefacto estático de una manera fundamental: obtiene datos en el momento de la apertura, no en el momento de la creación.

- **Conecta al abrir**: cada vez que se abre la URL del artefacto, consulta las fuentes de datos configuradas
- **Se actualiza automáticamente en la visualización**: los datos son actuales en el momento en que se renderiza el artefacto — no cuando se generó por primera vez
- **Se persiste en la barra lateral de Cowork**: los artefactos vivos se guardan y se enumeran junto con otros artefactos; los estáticos son efímeros a menos que se fijen
- **URL compartible**: cada artefacto vivo obtiene una URL estable; el control de acceso se establece por artefacto
- **Insertable en iframe**: pega el fragmento de inserción en Notion, Confluence o cualquier herramienta que acepte iframes

---

## Tipos de fuentes de datos

| Tipo de fuente | Cómo Claude se conecta | Ejemplo |
|-------------|--------------------|---------| 
| Servidor MCP | Cualquier herramienta MCP conectada está disponible como fuente de datos | MCP de Postgres → resultados de consulta en vivo |
| API REST | Describe el endpoint; Claude genera la llamada de obtención | API de GitHub → recuento de PR abiertos |
| Base de datos (vía MCP) | Consulta SQL incrustada en el artefacto | Supabase → métricas de usuario |
| Google Sheets / CSV | Adjunta vía conector de Google Drive (Cowork) | Rastreador presupuestario → gráfico en vivo |
| GitHub | Datos del repositorio vía API de GitHub o MCP | Actividad de confirmación, recuentos de problemas |

La fuente de datos debe permanecer accesible para que el artefacto se actualice. Si un servidor MCP se desconecta o una clave API caduca, el artefacto muestra el último resultado almacenado en caché con una advertencia de datos obsoletos.

---

## Creación de un artefacto vivo

Describe la salida deseada y referencia la fuente de datos explícitamente en tu prompt. Claude genera el artefacto y conecta la conexión de datos.

**Ejemplo de fuente única:**

```
"Crea un artefacto vivo mostrando el recuento actual de problemas abiertos por etiqueta 
de nuestro repositorio de GitHub (propietario: acme, repositorio: api-service). 
Muestra como un gráfico de barras, actualiza en cada apertura."
```

**Ejemplo de panel de múltiples fuentes:**

```
"Crea un artefacto de panel de control en vivo con tres paneles:
1. Recuento de PR abiertos desde GitHub (acme/api-service)
2. Recuento de filas actual de la tabla 'users' vía el MCP de Postgres
3. Últimos 7 días de registros desde la hoja de Google en [URL]

Actualiza los tres paneles al abrir. Diseño: paneles horizontales, ancho igual."
```

Claude genera el artefacto, incrusta la lógica de obtención de datos y registra las conexiones de fuentes de datos. El artefacto aparece en tu barra lateral inmediatamente.

---

## Compartición e inserción

**Enlace de compartición:**

Cada artefacto vivo tiene un botón de compartición. Al hacerlo, se genera una URL pública (o una URL restringida al espacio de trabajo para artefactos privados). Cualquier persona con el enlace ve el artefacto con datos en vivo cuando lo abre — no se requiere cuenta de Claude para artefactos públicos.

**Inserción de iframe:**

```html
<!-- Pega en Notion, Confluence, Linear o cualquier herramienta que admita iframe -->
<iframe
  src="https://claude.ai/artifacts/live/a1b2c3d4"
  width="100%"
  height="400"
  frameborder="0"
></iframe>
```

**Control de acceso:**

| Nivel de acceso | Quién puede ver | Plan requerido |
|-------------|-------------|---------------|
| Público | Cualquiera con el enlace | Pro+ |
| Espacio de trabajo | Miembros de tu equipo de Claude | Team o Enterprise |
| Privado | Solo tú | Pro+ |

---

## Artefacto vivo vs. Artefacto estático

| Propiedad | Artefacto vivo | Artefacto estático |
|----------|--------------|-----------------|
| Actualización de datos | Actual al momento de apertura | Instantánea al momento de creación |
| Persistencia | Guardado en barra lateral | Efímero a menos que se fije |
| Compartición | URL estable, compartible | Solo copia/pega de contenido |
| Fuentes de datos | APIs, MCP, bases de datos, hojas | Ninguna — contenido generado solo |
| Plan requerido | Pro+ (conexiones vivas) | Todos los planes |
| Disparador de actualización | Al abrir (+ intervalo opcional) | N/A |

---

## Limitaciones

- La fuente de datos subyacente debe permanecer accesible — los artefactos no almacenan un caché de datos completo entre vistas
- Los paneles de control de múltiples fuentes complejos con muchas consultas en vivo se cargan más lentamente que los artefactos de fuente única
- Las conexiones de datos en vivo requieren un plan Pro o superior; los artefactos de nivel gratuito siempre son estáticos
- No es un reemplazo de herramienta de BI — sin desgloses, filtros guardados o control de acceso por campo de datos
- La inserción en iframe requiere que la herramienta host permita iframes de terceros (Notion y Confluence lo hacen; algunas intranets empresariales los bloquean)
- La fuente de datos de Google Sheets requiere que el conector de Google Drive esté autorizado en Cowork

---
