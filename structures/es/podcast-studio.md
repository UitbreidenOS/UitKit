# Operaciones de Podcast Studio — Estructura del Proyecto

> Para creadores de podcasts y redes de múltiples shows que gestionan el ciclo de producción completo — desde la reserva de invitados y grabación hasta edición, distribución, monetización y crecimiento de comunidad — en un único espacio de trabajo de Claude Code.

## Stack

- **Grabación remota:** Riverside.fm (pistas de audio/video separadas, grabación local) o SquadCast (similar; preferido para shows solo de audio)
- **Edición + transcripción:** Descript (edición basada en palabras, Studio Sound, overdub, exportación de transcripción)
- **Hosting + RSS:** Buzzsprout (un show único, análisis, envío automático a Spotify/Apple) o RSS.com (múltiples shows; admite estadísticas de descarga certificadas por IAB)
- **Gestión de múltiples shows:** Transistor (múltiples shows bajo una cuenta, acceso de equipo, podcasts privados)
- **Sitio web:** Podpage (generado automáticamente desde el feed RSS; páginas de episodios, biografías de invitados, reseñas de oyentes)
- **Distribución:** Spotify for Podcasters, Apple Podcasts Connect, YouTube (podcast en video + clips)
- **Lista de correo:** ConvertKit (secuencias de automatización, emisiones de episodios, segmentos de suscriptores premium)
- **Contenido premium + pagos:** Stripe (facturación por suscripción para episodios bonus, feeds sin anuncios)
- **Audiograma / clips sociales:** Descript (exportación de clips), Headliner (audiogramas con forma de onda), CapCut (reels de video de corta duración)
- **Programación:** Calendly (reserva de invitados, recordatorios automáticos) vinculado a la invitación de sesión de Riverside.fm
- **Analytics:** Estadísticas integradas de Buzzsprout/Transistor, Chartable (atribución multiplataforma), panel de Spotify for Podcasters

## Árbol de directorios

```
podcast-studio/
├── .claude/
│   ├── CLAUDE.md                              # Instrucciones del espacio de trabajo para Claude Code
│   ├── settings.json                          # Servidores MCP, hooks, permisos
│   └── commands/
│       ├── new-episode.md                     # /new-episode — estructura carpeta de episodio + resumen
│       ├── show-notes.md                      # /show-notes — generar notas de show desde transcripción
│       ├── social-promo.md                    # /social-promo — crear posts sociales nativos de plataforma
│       ├── guest-outreach.md                  # /guest-outreach — redactar email de pitch personalizado
│       ├── sponsor-pitch.md                   # /sponsor-pitch — escribir propuesta de patrocinio desde kit
│       ├── newsletter-episode.md              # /newsletter-episode — convertir notas de show a email ConvertKit
│       └── performance-review.md              # /performance-review — resumir analytics de episodio
├── episodes/
│   ├── _template/                             # Copiar esta carpeta al iniciar un nuevo episodio
│   │   ├── brief.md                           # Contexto de invitado + tema, ángulo, preguntas clave
│   │   ├── outline.md                         # Guía de diálogo segmento por segmento (intro, preguntas, cierre)
│   │   ├── shownotes.md                       # Notas de show publicadas: resumen, enlaces, capítulos
│   │   ├── transcript.md                      # Transcripción limpia exportada de Descript
│   │   ├── social-promo.md                    # LinkedIn, Twitter/X, Instagram, descripción de YouTube
│   │   └── performance.md                     # Conteos de descarga, retención de oyentes, delta de calificaciones
│   ├── ep001-[guest-slug]/
│   │   ├── brief.md                           # Investigación previa a la llamada + stack de preguntas
│   │   ├── outline.md                         # Tiempo de segmento, marcadores de posición de anuncios
│   │   ├── recorded-2026-05-14.md             # Notas de sesión de grabación (problemas técnicos, marcas de tiempo clave)
│   │   ├── shownotes.md                       # Notas de show finales publicadas con marcas de tiempo de capítulo
│   │   ├── transcript.md                      # Transcripción completa de Descript, etiquetada por hablante
│   │   ├── social-promo.md                    # Todas las variantes de copia social para la semana de lanzamiento
│   │   └── performance.md                     # Estadísticas de descarga 7/30/90 días + retroalimentación de oyentes
│   ├── ep002-[guest-slug]/
│   │   ├── brief.md
│   │   ├── outline.md
│   │   ├── recorded-2026-05-28.md
│   │   ├── shownotes.md
│   │   ├── transcript.md
│   │   ├── social-promo.md
│   │   └── performance.md
│   └── ep003-[topic-slug]/                    # Episodio en solitario — sin invitado; brief cubre solo investigación
│       ├── brief.md
│       ├── outline.md
│       ├── recorded-2026-06-04.md
│       ├── shownotes.md
│       ├── transcript.md
│       ├── social-promo.md
│       └── performance.md
├── production/
│   ├── recording-sop.md                       # Lista de verificación de sesión Riverside.fm (verificación de micrófono, grabación de respaldo)
│   ├── editing-checklist.md                   # Pasos de edición Descript: limpiar, Studio Sound, capítulos, exportar
│   ├── distribution-checklist.md              # Carga de Buzzsprout, envío Spotify/Apple, actualización de Podpage
│   ├── thumbnail-specs.md                     # Tamaños de portada: 3000x3000px (podcast), 1280x720px (YT)
│   ├── audio-settings.md                      # Especificaciones de exportación: 128kbps MP3, 44.1kHz, estéreo, -16 LUFS
│   └── release-schedule.md                   # Calendario semanal/quincenal, cola de episodios, tiempos de publicación
├── guests/
│   ├── prospect-list.md                       # Lista clasificada de invitados objetivo con información de contacto + notas
│   ├── outreach-templates.md                  # Plantillas de email: pitch en frío, presentación cálida, y seguimiento
│   ├── prep-guide.md                          # Documento de preparación de invitado: formato, configuración técnica, enlace Riverside.fm
│   ├── post-interview-followup.md             # Plantilla de email de agradecimiento + solicitud de compartir en redes
│   ├── booking-tracker.md                     # Pipeline: prospección / propuesta enviada / reservado / grabado / transmitido
│   └── past-guests/
│       ├── [guest-slug].md                    # Por invitado: biografía, enlace de episodio, perfiles sociales, retroalimentación
│       └── vip-guests.md                      # Invitados de alto valor dignos de re-reservar o co-promocionar
├── marketing/
│   ├── social-templates/
│   │   ├── linkedin-episode-launch.md         # Plantilla de post de LinkedIn para lanzamiento de nuevo episodio
│   │   ├── twitter-thread-template.md         # Estructura de hilo de Twitter/X para puntos clave del episodio
│   │   ├── instagram-caption-template.md      # Subtítulo de IG con contexto de audiograma + CTA
│   │   ├── youtube-description-template.md    # Descripción de video de YT con capítulos + enlaces
│   │   └── tiktok-hook-template.md            # Scripts de gancho de 3 segundos para clips de TikTok/Reels
│   ├── clip-strategy.md                       # Qué momentos clipar, duración de clip por plataforma, herramientas
│   ├── newsletter-promo.md                    # Plantilla de emisión de episodio ConvertKit + líneas de asunto
│   ├── cross-promo-tracker.md                 # Intercambios de invitados, lecturas de anuncios, y partnerships de co-marketing
│   └── launch-playbook.md                     # Campaña completa de semana de lanzamiento: calendario de publicación día a día
├── monetization/
│   ├── sponsor-kit.md                         # Una página: estadísticas de show, demografía de audiencia, formatos de anuncios
│   ├── ad-rates.md                            # Tarifas CPM de pre-roll / mid-roll / post-roll por tier
│   ├── sponsor-tracker.md                     # Patrocinadores activos: fechas de contrato, entregables, estado de pago
│   ├── premium-content.md                     # Tiers de suscripción Stripe, cadencia de episodios bonus, beneficios
│   └── affiliate-tracker.md                   # Partners afiliados, enlaces únicos, tasas de comisión, pagos
└── analytics/
    ├── episode-performance.md                 # Tabla por episodio: descargas, tasa de finalización, calificaciones
    ├── growth-dashboard.md                    # Crecimiento de suscriptores mensual, desglose por plataforma, episodios principales
    ├── audience-survey-2026-q1.md             # Resultados de encuesta de oyentes + insights clave
    └── benchmarks.md                          # Benchmarks de industria CPD, objetivos de descarga por tier de show
```

## Explicación de archivos clave

| Ruta | Propósito |
|---|---|
| `episodes/_template/brief.md` | Documento de investigación previa a la grabación: biografía de invitado, contenido anterior, puntos de conversación, 10-12 preguntas de entrevista organizadas por segmento; copiar a nueva carpeta de episodio antes de cada grabación |
| `episodes/_template/shownotes.md` | Plantilla de notas de show publicadas con párrafo de resumen, puntos clave, bloque de biografía de invitado, enlaces de recursos, marcas de tiempo de capítulo y enlace de transcripción; impulsa la descripción de episodio de Buzzsprout |
| `production/recording-sop.md` | Lista de verificación paso a paso de sesión Riverside.fm cubriendo niveles de micrófono, respaldo de grabación local, prueba de red, permisos y contingencia si la conexión del invitado se cae |
| `production/editing-checklist.md` | Flujo de trabajo de edición Descript: eliminar palabras de relleno, aplicar Studio Sound, establecer marcadores de capítulo, agregar música intro/outro, exportar en LUFS correcto y cargar a Buzzsprout |
| `production/distribution-checklist.md` | Lista de verificación de publicación posterior a edición: configuración de carga de Buzzsprout, confirmación de envío Spotify/Apple, actualización de caché de Podpage, carga de YouTube y activación de newsletter en ConvertKit |
| `guests/prospect-list.md` | Lista clasificada de invitados objetivo con columna para relevancia, tamaño de audiencia, calidez de relación y estado de prospección — la fuente única de verdad para el pipeline de invitados |
| `monetization/sponsor-kit.md` | Mazo de pitch en Markdown: descripción de show, demografía de oyentes (edad, rol, ingresos), estadísticas de descarga, opciones de formato de anuncio, scripts de anuncio de ejemplo y testimonios de patrocinadores anteriores |
| `analytics/growth-dashboard.md` | Snapshot mensual de suscriptores totales, desglose de descarga por plataforma, 5 episodios principales, descargas promedio por episodio en los primeros 7 días y porcentaje de crecimiento MoM |

## Andamiaje rápido

```bash
# Crear raíz del espacio de trabajo
mkdir -p podcast-studio && cd podcast-studio

# Directorios de Claude Code
mkdir -p .claude/commands

# Plantilla de episodio
mkdir -p episodes/_template
touch episodes/_template/brief.md
touch episodes/_template/outline.md
touch episodes/_template/shownotes.md
touch episodes/_template/transcript.md
touch episodes/_template/social-promo.md
touch episodes/_template/performance.md

# Primeros tres episodios stub
for ep in ep001-guest-placeholder ep002-guest-placeholder ep003-solo-placeholder; do
  mkdir -p "episodes/$ep"
  for f in brief.md outline.md shownotes.md transcript.md social-promo.md performance.md; do
    touch "episodes/$ep/$f"
  done
done

# SOPs de producción
mkdir -p production
touch production/recording-sop.md
touch production/editing-checklist.md
touch production/distribution-checklist.md
touch production/thumbnail-specs.md
touch production/audio-settings.md
touch production/release-schedule.md

# Pipeline de invitados
mkdir -p guests/past-guests
touch guests/prospect-list.md
touch guests/outreach-templates.md
touch guests/prep-guide.md
touch guests/post-interview-followup.md
touch guests/booking-tracker.md
touch guests/past-guests/vip-guests.md

# Activos de marketing
mkdir -p marketing/social-templates
touch marketing/social-templates/linkedin-episode-launch.md
touch marketing/social-templates/twitter-thread-template.md
touch marketing/social-templates/instagram-caption-template.md
touch marketing/social-templates/youtube-description-template.md
touch marketing/social-templates/tiktok-hook-template.md
touch marketing/clip-strategy.md
touch marketing/newsletter-promo.md
touch marketing/cross-promo-tracker.md
touch marketing/launch-playbook.md

# Monetización
mkdir -p monetization
touch monetization/sponsor-kit.md
touch monetization/ad-rates.md
touch monetization/sponsor-tracker.md
touch monetization/premium-content.md
touch monetization/affiliate-tracker.md

# Analytics
mkdir -p analytics
touch analytics/episode-performance.md
touch analytics/growth-dashboard.md
touch analytics/benchmarks.md

# Inicializar archivos de configuración
touch .claude/CLAUDE.md
touch .claude/settings.json

# Instalar skills de producción de podcast
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/doc-site-builder
npx claudient add skill data-ml/stakeholder-report
npx claudient add skill marketing/social-media-manager
npx claudient add skill small-business/content-repurposer

# Agregar comandos de slash personalizados
npx claudient add command new-episode
npx claudient add command show-notes
npx claudient add command social-promo
npx claudient add command guest-outreach
npx claudient add command sponsor-pitch
npx claudient add command newsletter-episode
npx claudient add command performance-review

echo "Espacio de trabajo de podcast studio listo."
```

## Plantilla CLAUDE.md

```markdown
# Podcast Studio — Instrucciones de Claude

## Qué es esto

Este espacio de trabajo gestiona operaciones de podcast end-to-end: prospección de invitados, investigación previa a la entrevista, preparación de sesión de grabación, flujo de trabajo de edición, producción de notas de show, distribución multiplataforma, estrategia de clips sociales, marketing por correo electrónico, ventas de patrocinio y análisis.

El show se publica semanalmente. Todo el trabajo del episodio vive en episodes/<ep-slug>/. No redacte nada fuera de esa estructura.

## Stack

- Grabación remota: Riverside.fm — pistas de audio/video separadas, respaldo de grabación local habilitado
- Edición + transcripción: Descript — edición basada en palabras, eliminación de ruido Studio Sound
- Hosting: Buzzsprout — feed RSS, auto-distribución Spotify/Apple, análisis de descarga
- Sitio web: Podpage — generado automáticamente desde RSS de Buzzsprout; actualizar después de cada publicación
- Correo: ConvertKit — secuencia de emisión de episodio, segmento de suscriptor premium (etiqueta: premium)
- Pagos: Stripe — tier premium de $9/mes (episodios bonus, feed sin anuncios)
- Distribución: Spotify for Podcasters, Apple Podcasts Connect, YouTube (podcast en video)
- Clips: Descript (exportación de clips), Headliner (audiogramas), CapCut (Reels/TikTok)
- Analytics: Estadísticas de Buzzsprout + Chartable (atribución multiplataforma)

## Convenciones de directorio

- episodes/<ep-slug>/ — una carpeta por episodio; copiar desde episodes/_template/
- episodes/_template/ — plantilla maestra; nunca publicar directamente desde esta carpeta
- production/ — SOPs y listas de verificación; actualizar cuando el flujo de trabajo cambie, no por episodio
- guests/ — pipeline de prospección y plantillas; past-guests/ para registros por invitado archivados
- marketing/social-templates/ — marcos reutilizables; rellenar por episodio en carpeta de episodio
- monetization/ — contratos de patrocinador activos en sponsor-tracker.md; tasas en ad-rates.md
- analytics/ — actualizar episode-performance.md en día 7 y día 30 post-publicación

## Nomenclatura de carpeta de episodio

Formato: ep<NNN>-<guest-or-topic-slug>
Ejemplos: ep042-sarah-jones, ep043-ai-in-healthcare, ep044-solo-q-and-a

## Tareas comunes — comandos exactos

**Estructura una nueva carpeta de episodio:**
/new-episode number=043 guest="First Last" topic="[topic]" record-date="YYYY-MM-DD"

**Generar notas de show desde transcripción:**
/show-notes transcript=episodes/ep043-[slug]/transcript.md guest="First Last" links="[URLs separadas por comas]"

**Crear copia social de semana de lanzamiento:**
/social-promo episode=episodes/ep043-[slug]/shownotes.md platforms="linkedin,twitter,instagram,youtube"

**Redactar email de prospección de invitado:**
/guest-outreach guest="First Last" company="[Company]" topic="[pitch angle]" warm="[contacto mutuo o no]"

**Escribir una propuesta de patrocinio:**
/sponsor-pitch sponsor="[Brand]" format="mid-roll" episodes=4 rate=episodes

**Generar email de episodio ConvertKit:**
/newsletter-episode shownotes=episodes/ep043-[slug]/shownotes.md subject-variants=3

**Obtener resumen de desempeño de episodio:**
/performance-review episode=episodes/ep043-[slug]/performance.md period=30d

## Convenciones de grabación

- Riverside.fm: siempre habilitar respaldo de grabación local antes de comenzar; verificar micrófono del invitado en los primeros 30 segundos; detener y re-grabar si el audio está por debajo de -24 LUFS pico
- Exportación de audio desde Descript: 128kbps MP3, 44.1kHz, estéreo, -16 LUFS integrado
- Nomenclatura de archivo de episodio para carga de Buzzsprout: show-name-ep043-guest-slug.mp3
- Las marcas de tiempo en transcript.md usan formato HH:MM:SS; los marcadores de capítulo coinciden con shownotes.md

## Convenciones de notas de show

- Resumen: 3-4 oraciones, sin relleno, destacar el insight principal del invitado
- Puntos clave: 3-5 puntos de bala, cada uno accionable o citable
- Biografía de invitado: máximo 2 oraciones, enlace a su sitio y LinkedIn
- Recursos: cada enlace mencionado en el episodio, claramente etiquetado
- Marcas de tiempo de capítulo: cada límite de segmento, mínimo 5 capítulos por episodio
- CTA: una CTA primaria (suscribir, reseñar, o premium) — nunca apilar tres CTAs

## Lista de verificación de distribución (ejecutar después de carga de Buzzsprout)

1. Confirmar que Spotify auto-envío se entregó dentro de 4 horas de publicación
2. Enviar a Apple Podcasts Connect si se requiere aprobación manual
3. Actualizar Podpage (Configuración > Actualizar Feed)
4. Cargar versión en video a YouTube con descripción de social-promo.md
5. Programar emisión de ConvertKit para las 8 AM en zona horaria del oyente (martes preferido)
6. Publicar clips sociales: LinkedIn mismo día, hilo de Twitter/X día 2, Instagram día 3
7. Registrar episodio en analytics/episode-performance.md

## Convenciones de monetización

- Ubicaciones de anuncios: pre-roll 60s (máx), mid-roll 90s en la marca de 20 minutos, post-roll 30s
- Solo anuncios leídos por host — sin anuncios insertados dinámicamente por debajo de 10k descargas/episodio
- La copia de patrocinador vive en el outline.md del episodio bajo marcadores de "AD BREAK"
- Las nuevas tasas de patrocinador requieren aprobación; usar tiers de ad-rates.md, nunca negociar por debajo del piso
- Registrar cada entregable y pago en monetization/sponsor-tracker.md el mismo día

## Cadencia de analytics

- Día 7 post-publicación: registrar descargas en analytics/episode-performance.md
- Día 30: actualizar con total de 30 días y tasa de finalización desde Spotify for Podcasters
- Mensual: actualizar analytics/growth-dashboard.md con conteo de suscriptores y delta MoM
- Trimestral: ejecutar encuesta de oyentes; archivar resultados en analytics/audience-survey-YYYY-QN.md
```

## Servidores MCP

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/${USER}/podcast-studio"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    },
    "convertkit": {
      "command": "npx",
      "args": ["-y", "@convertkit/mcp-server"],
      "env": {
        "CONVERTKIT_API_KEY": "${CONVERTKIT_API_KEY}",
        "CONVERTKIT_API_SECRET": "${CONVERTKIT_API_SECRET}"
      }
    },
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/agent-toolkit"],
      "env": {
        "STRIPE_SECRET_KEY": "${STRIPE_SECRET_KEY}"
      }
    }
  }
}
```

## Hooks recomendados

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_FILE_PATH\"; if [[ \"$FILE\" == */episodes/*/shownotes.md ]]; then echo \"[hook] Notas de show guardadas: $FILE — ejecutar /social-promo y /newsletter-episode antes de publicar\"; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_OUTPUT_FILE_PATH\"; if [[ \"$FILE\" == */monetization/sponsor-tracker.md ]]; then echo \"[hook] Rastreador de patrocinador actualizado: verificar alineación de ad-rates.md y confirmar fechas de entregable\"; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR}\" && MISSING=$(find episodes/ -mindepth 2 -name \"transcript.md\" -empty 2>/dev/null | wc -l | tr -d \" \"); [ \"$MISSING\" -gt 0 ] && echo \"[recordatorio] $MISSING episodio(s) tiene(n) transcript.md vacío — exportar desde Descript y pegar\" || true'"
          }
        ]
      }
    ]
  }
}
```

## Skills para instalar

```bash
npx claudient add skill productivity/stakeholder-comms
npx claudient add skill productivity/doc-site-builder
npx claudient add skill productivity/process-mapper
npx claudient add skill productivity/vendor-evaluator
npx claudient add skill data-ml/stakeholder-report
npx claudient add skill marketing/social-media-manager
npx claudient add skill small-business/content-repurposer
```

## Relacionado

- [Guía: Claude para Creadores de Contenido](../guides/for-content-marketer.md)
- [Flujo de trabajo: Creación de Contenido end-to-end](../workflows/content-creation.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
