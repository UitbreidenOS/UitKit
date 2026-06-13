---
name: excalidraw
description: "Generación de diagramas con Excalidraw: crear diagramas de arquitectura, flowcharts, mapas de sistemas y wireframes como archivos JSON de Excalidraw — guardables, versionables y editables en excalidraw.com"
---

# Skill Excalidraw

## Cuándo activar
- Crear un diagrama de arquitectura para una base de código o sistema
- Dibujar un mapa de dependencia de servicio para microservicios
- Construir un diagrama de flujo de datos o infraestructura
- Generar un wireframe o boceto de UI
- Producir un diagrama para incrustar en un README o docs

## Cuándo NO usar
- Flowcharts simples que se renderizan en GitHub/Notion — usar la habilidad mermaid en su lugar
- Diapositivas de presentación — exportar a PNG y usar en tu herramienta de diapositivas
- Pizarrón colaborativo en tiempo real — abrir excalidraw.com directamente

## Instrucciones

### Diagrama de arquitectura

```
Generar un diagrama de arquitectura de Excalidraw para [sistema].

Sistema: [describir — servicios, bases de datos, APIs externas, flujos de datos]
Estilo: [minimal / detallado / color-codificado por capa]
Guardar en: [docs/architecture.excalidraw o ruta de elección]

Convenciones de diagrama:
- Rectángulos con esquinas redondeadas: servicios y aplicaciones
- Cilindros: bases de datos y almacenamiento
- Diamantes: puntos de decisión o puertas de enlace
- Paralelogramos: servicios externos o terceros
- Flechas: dirección de flujo de datos
- Codificación de color: frontend (azul), backend (naranja), datos (verde), externo (gris)

Ejemplo de descripción de sistema:
"Frontend de Next.js en Vercel, API Express en Railway,
PostgreSQL en Neon, Redis en Upstash, Stripe para pagos"

Salida: JSON válido de Excalidraw guardado en la ruta especificada.
```

### Mapa de dependencia de servicio

```
Crear un mapa de dependencia de servicio de Excalidraw para [arquitectura].

Servicios: [listar todos los servicios]
Dependencias: [qué servicios llaman a cuáles]
Destacar: [ruta crítica / cuellos de botella / puntos únicos de fallo]

Mostrar:
- Cada servicio como una caja etiquetada
- Llamadas sincrónicas como flechas sólidas
- Llamadas asincrónicas/event-driven como flechas punteadas
- Dependencias externas en un color diferente
- Anotaciones para protocolos (REST, gRPC, eventos)
```

### Diagrama de infraestructura

```
Dibujar un diagrama de infraestructura de Excalidraw para [despliegue].

Nube: [AWS / GCP / Azure / multi-nube]
Componentes: [listar — load balancer, compute, base de datos, cache, CDN, etc.]
Regiones/zonas: [región única / multi-AZ / multi-región]

Convenciones:
- Agrupar componentes por VPC / límite de red usando formas de contenedor
- Mostrar límites de subred pública/privada
- Etiquetar cada componente con su nombre de servicio en la nube (ej. "ALB", "ECS Fargate", "RDS Aurora")
- Mostrar flujo de tráfico con flechas direccionales
```

### Wireframe

```
Crear un wireframe de Excalidraw para [pantalla/componente].

Pantalla: [describir — dashboard, form, landing page, pantalla móvil]
Elementos clave: [listar componentes UI — nav, sidebar, cards, table, form, buttons]
Layout: [desktop / móvil / ambos]
Fidelidad: [baja (solo cajas) / media (etiquetas + formas aproximadas)]

Usar estilo dibujado a mano de Excalidraw para wireframes (se ve intencionalmente aproximado).
Etiquetar cada componente con su propósito.
```

### Abrir y editar

```bash
# Abrir en VS Code (requiere extensión Excalidraw para VS Code)
code docs/architecture.excalidraw

# Abrir en navegador
open https://excalidraw.com
# Luego: Archivo → Abrir → seleccionar tu archivo .excalidraw

# Exportar a PNG/SVG desde Excalidraw:
# Menú → Exportar imagen → PNG o SVG

# Incrustar en README:
# Exportar a SVG → commit al repositorio → referenciar en markdown:
# ![Arquitectura](docs/architecture.svg)
```

### Excalidraw MCP (si está configurado)

Si el servidor MCP de Excalidraw está configurado, Claude puede generar diagramas directamente:
```
Usar Excalidraw MCP para dibujar un diagrama de arquitectura para nuestra aplicación:
- Frontend React → API Express → PostgreSQL + Redis
- Desplegado en Vercel + Railway
Guardar como docs/architecture.excalidraw
```

Ver `mcp/excalidraw.md` para instrucciones de configuración.

## Ejemplo

**Usuario:** Crear un diagrama de arquitectura para una aplicación SaaS: frontend Next.js, API routes + Prisma + PostgreSQL, webhooks Stripe, Resend para correo electrónico, Cloudflare CDN.

**Claude genera:**

```json
{
  "type": "excalidraw",
  "version": 2,
  "elements": [
    {
      "type": "rectangle",
      "x": 100, "y": 100,
      "width": 180, "height": 60,
      "strokeColor": "#3b82f6",
      "backgroundColor": "#dbeafe",
      "label": { "text": "Frontend Next.js\n(Vercel)" }
    },
    {
      "type": "rectangle",
      "x": 380, "y": 100,
      "width": 180, "height": 60,
      "strokeColor": "#f97316",
      "backgroundColor": "#ffedd5",
      "label": { "text": "API Routes\n(Next.js / Railway)" }
    },
    {
      "type": "ellipse",
      "x": 380, "y": 240,
      "width": 180, "height": 60,
      "strokeColor": "#10b981",
      "backgroundColor": "#d1fae5",
      "label": { "text": "PostgreSQL\n(Neon)" }
    }
  ]
}
```

*Guardar en `docs/architecture.excalidraw` y abrir en excalidraw.com para ver y editar.*

---
