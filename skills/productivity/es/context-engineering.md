# Ingeniería de Contexto

## Cuándo activar
El usuario quiere optimizar cómo se proporciona contexto a Claude, reducir uso de tokens, mejorar calidad de respuesta mediante diseño de contexto mejor, o está golpeando límites de ventana de contexto.

## Cuándo NO usar
- Ingeniería de prompt para salida estilística (tono, formato, persona) — eso es una preocupación diferente
- Arquitectura de sistema RAG — diseño de canalización de recuperación es separado del diseño de layout de contexto
- Conteo de tokens para estimaciones de facturación — usar la API del tokenizador directamente

## Instrucciones

### Divulgación Progresiva
Proporcionar solo el contexto necesario para el paso actual. Cargar contexto adicional cuando la tarea lo requiere.

No descargar una base de código completa al inicio de una conversación. En su lugar:
1. Comenzar con el archivo o función específica relevante a la tarea
2. Referenciar otros archivos por nombre: "Ver `utils/auth.ts` para la lógica de validación del token"
3. Agregar contexto cuando Claude pregunta o cuando una subtarea lo requiere

### Contexto Estructurado vs Prosa
Claude analiza estructura más confiablemente que párrafos de prosa. Preferir:
- Encabezados (`##`) para separar preocupaciones distintas
- Puntos de bala para listas de restricciones, requisitos o hechos
- Bloques de código para todo el código — incluso snippets cortos
- Tablas para comparaciones u opciones de configuración

Evitar: párrafos largos de prosa que entierren la instrucción clave en el medio.

### Orden de Prioridad de Contexto
Claude lee de inicio a fin pero tiene dos picos de atención: **principio** y **final**.

- Poner restricciones críticas y la tarea primaria al inicio
- Poner la instrucción final o el detalle más importante al final
- Dejar contexto de fondo/apoyo ocupando el medio

Para una ventana de contexto de 200k:
| Sección | Presupuesto de Token |
|---|---|
| System prompt | <5,000 |
| CLAUDE.md / reglas de proyecto | <2,000 |
| Descripción de tarea + restricciones | <10,000 |
| Archivos / documentos de referencia | resto |
| Reserva para salida | ~10,000 |

### Referenciar, No Repetir
Señalar a un archivo en lugar de pegarlo:
```
Lee `src/api/routes/user.ts` — enfoca en el manejador `POST /users`.
```
Esto usa 10 tokens en lugar de 2,000 y evita contexto desactualizado si el archivo cambia a mitad de sesión.

Solo pegar contenido de archivo cuando:
- El archivo no se puede leer (doc externa, screenshot, etc.)
- Necesitas que Claude analice una versión específica que difiere del disco
- El contenido es muy corto (<30 líneas) y central en cada respuesta en la conversación

### Anti-Patrones
- **Pegado de archivo completo para una función única:** pega solo la función más sus importaciones inmediatas
- **Repetir contexto establecido:** si Claude ya sabe X, no reestablezcas X en cada mensaje
- **Sobre-explicar lo que Claude sabe:** no expliques qué es JSON, qué es una API REST, etc.
- **Tarea vaga + contexto enorme:** una instrucción vaga con 50k tokens de contexto produce salida vaga; define la tarea precisamente primero
- **Inyectar vertidos HTML/PDF raw:** extrae y limpia el texto relevante antes de incluirlo

### Gestión de Contexto Multi-Vuelta
- Después de 10+ vueltas, hechos clave del turno 1 pueden recibir menos atención — reestablecer restricciones críticas en el mensaje donde se vuelvan relevantes de nuevo
- Usar CLAUDE.md o un system prompt fijado para reglas de proyecto invariantes en lugar de repetirlas en mensajes
- Compactación (el `/compact` de Claude Code) resume historial — usarlo antes de comenzar una nueva fase de una tarea

### Chunking Semántico para Documentos Grandes
Cuando debes incluir un documento grande, dividir por unidad semántica no por conteo de tokens:
- Docs de API: una sección por endpoint, no bloques arbitrarios de 500-tokens
- Código: una clase o una función por chunk, no dividido en línea 500
- Prosa: un argumento o un tema por chunk

Etiquetar cada chunk claramente para que Claude pueda citarlo: `### Sección: Autenticación (líneas 45-89)`

## Ejemplo

**Entrega de contexto mala:**
```
Aquí está mi proyecto completo (12 archivos pegados). Quiero que arregles el bug de login.
```

**Entrega de contexto buena:**
```
Tengo un bug de login: los usuarios obtienen un 401 incluso con credenciales válidas.

Archivo relevante: `src/auth/login.ts` (leerlo)
La clave de firma JWT se carga desde `process.env.JWT_SECRET`.
El middleware que valida tokens está en `src/middleware/auth.ts` (leerlo).

El bug se introdujo en el commit abc123. Enfoca en la ruta de validación de token.
```

La segunda versión le da a Claude los archivos correctos, el modo de fallo, la ubicación sospechosa y un ancla de tiempo — sin tokens desperdiciados en código no relacionado.

---
