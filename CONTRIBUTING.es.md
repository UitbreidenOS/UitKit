> 🇪🇸 Versión en español. [Versión en inglés](CONTRIBUTING.md).

# Contribuir a Claudient

Claudient crece gracias a las contribuciones de la comunidad. Si tiene un skill, un agente, un hook, un workflow o un prompt que ha mejorado significativamente Claude Code para usted — tiene su lugar aquí.

---

## Qué contribuir

| Tipo | Ubicación | Descripción |
|---|---|---|
| Skill | `skills/<category>/` | Un slash command que activa comportamiento específico de un dominio |
| Agent | `agents/<category>/` | Una definición de subagente especializado |
| Hook | `hooks/<trigger>/` | Una automatización activada por eventos |
| Rule | `rules/common/` o `rules/<language>/` | Una directriz que siempre se debe seguir |
| Workflow | `workflows/` | Un proceso de varios pasos de extremo a extremo |
| Prompt | `prompts/<category>/` | Una plantilla de prompt reutilizable |
| Guide | `guides/` | Un documento de documentación en profundidad |
| Traducción | `guides/<lang>/` | Una traducción de un guide en inglés existente |

---

## Estándar de calidad

Antes de enviar, verifique que su contribución cumple con el estándar:

**Skills**
- [ ] Tiene una sección „When to activate" clara con condiciones de activación específicas
- [ ] Tiene una sección „When NOT to use" con al menos un anti-patrón
- [ ] Incluye al menos un ejemplo concreto
- [ ] Hace referencia a funciones reales de Claude Code — no consejos genéricos de LLM
- [ ] Lo ha probado en al menos una sesión real

**Agents**
- [ ] Especifica un subconjunto de herramientas (no todas las herramientas)
- [ ] Incluye orientación sobre el modelo (Haiku / Sonnet / Opus) con justificación
- [ ] Incluye un caso de uso concreto de ejemplo

**Hooks**
- [ ] Incluye el fragmento JSON exacto para `settings.json`
- [ ] Incluye el script (si corresponde) con instrucciones de configuración
- [ ] Describe claramente qué lo activa y qué hace

**Guides**
- [ ] Escrito para una audiencia de desarrolladores senior
- [ ] Sin secciones con contenido provisional
- [ ] Preciso respecto al comportamiento actual de Claude Code

---

## Plantilla de Skill

Copie esto al añadir un nuevo skill:

```markdown
# Skill Name

## When to activate
[Specific trigger conditions]

## When NOT to use
[Anti-patterns]

## Instructions
[Skill content]

## Example
[Concrete example]
```

---

## Nomenclatura de archivos

- Use `kebab-case.md` para todos los archivos Markdown
- Use `kebab-case.sh` o `kebab-case.py` para los scripts
- Coloque los archivos en el subdirectorio correcto — consulte `README.md` para el mapa

---

## Enviar una PR

1. Haga un fork del repositorio y cree una rama: `git checkout -b add/fastapi-skill`
2. Añada su(s) archivo(s) siguiendo el formato indicado arriba
3. Si añadió un nuevo guide en inglés, indique en la descripción de la PR qué traducciones son necesarias
4. Abra una PR con un título como: `add: FastAPI skill` o `fix: token-optimization guide`
5. Complete la descripción de la PR — qué es, por qué es útil, cómo lo probó

---

## Traducciones

Para traducir un guide en inglés existente:

1. Copie el archivo en inglés: `cp guides/getting-started.md guides/fr/getting-started.md`
2. Traduzca el contenido — conserve todos los bloques de código, rutas de archivos y términos técnicos en inglés
3. Envíe una PR con el título: `translate: getting-started guide (French)`

Idiomas admitidos: inglés (principal), francés (`fr/`), alemán (`de/`), neerlandés (`nl/`), español (`es/`).

---

## Qué se rechaza

- Contenido que duplica un archivo existente sin una mejora clara
- Contribuciones provisionales o incompletas (secciones con „coming soon")
- Skills que describen comportamiento genérico de LLM en lugar de funciones específicas de Claude Code
- Código de aplicación (este repositorio es únicamente documentación y configuración)
- Cualquier cosa que incumpla las convenciones de nomenclatura o formato definidas en `CLAUDE.md`

---

## Preguntas

Abra una GitHub Discussion si no está seguro de dónde encaja algo o si desea retroalimentación antes de empezar a construir. Los Issues son para bugs y carencias concretas de cobertura.

---

## Trabajar con nosotros

Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA con comunidades de desarrolladores y ofrecemos soluciones de IA B2B. Si desea ir más allá de contribuir a este repositorio y realmente construir productos de IA o soluciones B2B con nosotros, contáctenos.

**[uitbreiden.com](https://uitbreiden.com/)**
