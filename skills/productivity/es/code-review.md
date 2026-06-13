---
name: code-review
description: "Revisión de código estructurada: corrección, seguridad, desempeño, mantenibilidad — con severidad y retroalimentación accionable por hallazgo"
---

# Skill Code Review

## Cuándo activar
- Revisar un PR antes de aprobarlo
- Auto-revisar tu propio código antes de abrir un PR
- Hacer una revisión exhaustiva de un cambio crítico o sensible en seguridad
- Incorporar un desarrollador junior y dar retroalimentación estructurada
- Lista de verificación pre-merge para una característica antes de ir a producción

## Cuándo NO usar
- Linting automatizado — usar ESLint, Ruff, golangci-lint para estilo/formateo
- Escaneo de vulnerabilidad de dependencia — usar `npm audit`, Snyk, Dependabot
- Perfilado de desempeño — usar un perfilador, no una revisión de código

## Instrucciones

### Invocar la revisión

```
/code-review

PR: [pegar diff, o describir qué cambió]
Contexto: [para qué es este PR, cualquier preocupación específica]
Enfoque: [corrección / seguridad / desempeño / todos]
```

O para un archivo específico:
```
/code-review

Archivo: src/billing/checkout.py
Preocupaciones: procesamiento de pagos, manejo de errores, idempotencia
```

### Lista de verificación de revisión por la que Claude trabaja

**Corrección**
- [ ] ¿Hace el código lo que dice la descripción del PR que hace?
- [ ] ¿Se manejan casos extremos? (entrada vacía, nulo, cero, valores muy grandes)
- [ ] ¿Se manejan condiciones de error y son los errores informativos?
- [ ] ¿Está el manejo de errores en el nivel correcto? (no atrapar y suprimir errores silenciosamente)
- [ ] ¿Se esperan operaciones asincrónicas? ¿Hay condiciones de carrera posibles?
- [ ] ¿Es la lógica correcta para todas las ramas de los condicionales?

**Seguridad**
- [ ] ¿Se valida y desinfecta la entrada del usuario antes de usar?
- [ ] ¿Están parametrizadas las consultas SQL?
- [ ] ¿Se manejan secretos / credenciales correctamente (variables de entorno, no codificadas)?
- [ ] ¿Se verifica autorización (no solo autenticación)?
- [ ] ¿Se validan rutas de archivo? (traversal de ruta)
- [ ] ¿Se validan URLs externas? (SSRF)

**Desempeño**
- [ ] ¿Hay patrones de N+1 query? (bucle con llamada a BD dentro)
- [ ] ¿Se almacenan en caché operaciones costosas cuando es apropiado?
- [ ] ¿Se indexan consultas de base de datos en las columnas de filtro?
- [ ] ¿Se paginan o se transmiten payloads grandes?
- [ ] ¿Hay operaciones O(n²) escondiéndose en la lógica?

**Mantenibilidad**
- [ ] ¿Hacen funciones una cosa? (< 30 líneas como guía aproximada)
- [ ] ¿Son nombres de variables y funciones descriptivos?
- [ ] ¿Se puede leer el código sin comentarios? (buen nombramiento > comentarios)
- [ ] ¿Se introduce duplicación que podría extraerse?
- [ ] ¿Hay números mágicos que deberían ser constantes nombradas?
- [ ] ¿Está cubierto el cambio por pruebas?

**Diseño de API / Interfaz**
- [ ] ¿Es la API pública consistente con patrones existentes?
- [ ] ¿Están documentados los cambios de ruptura?
- [ ] ¿Están los parámetros en un orden sensato?
- [ ] ¿Comunica la firma de función su intención?

### Formato de salida

Claude produce hallazgos en orden de prioridad:

```
🔴 BLOQUEANTE — {título}
Archivo: {ruta}:{línea}
Problema: {qué está mal y por qué importa}
Solución:
  {cambio de código específico}

🟠 IMPORTANTE — {título}
...

🟡 SUGERENCIA — {título}
...

ℹ️ DETALLES — {lista de elementos menores de estilo/nombramiento}

Resumen: X bloqueantes, Y importantes, Z sugerencias
General: [Aprobar / Solicitar cambios / Necesita discusión]
```

**Niveles de severidad:**
- 🔴 **BLOQUEANTE** — debe arreglarse antes de merge: bug, problema de seguridad, riesgo de pérdida de datos
- 🟠 **IMPORTANTE** — debería arreglarse antes de merge: problema significativo de calidad o confiabilidad
- 🟡 **SUGERENCIA** — vale la pena discutir: opción de diseño, enfoque alternativo
- ℹ️ **DETALLE** — estilo menor, nombramiento o formateo (agrupar estos al final)

### Áreas de revisión de alto valor por tipo de cambio

**Nuevo endpoint API:**
- Validación de entrada en todos los parámetros
- Autenticación y autorización
- Limitación de velocidad
- Consistencia de formato de respuesta de error
- Registro de eventos importantes

**Cambio de esquema de base de datos:**
- La migración es segura para despliegue sin tiempo de inactividad
- Nuevas columnas son nulables o tienen predeterminados
- Índices agregados para nuevos patrones de consulta
- Claves foráneas tienen comportamiento ON DELETE apropiado

**Código de pagos / facturación:**
- Claves de idempotencia utilizadas para operaciones de cargo
- Validación de firma de webhook
- Manejo de reembolso/reversión
- Manejo de moneda (enteros/centavos, no floats)
- Separación del modo de prueba vs. modo de producción

**Cambio de autenticación:**
- Invalidación de sesión al cerrar sesión
- Algoritmo de hash de contraseña (bcrypt/argon2, no MD5/SHA1)
- Lógica de expiración y renovación de token
- Protección CSRF en endpoints que cambian estado

### Dar retroalimentación de manera efectiva

**Sé específico, no vago:**
```
# Retroalimentación mala
"Esto podría ser más eficiente"

# Buena retroalimentación
🟠 IMPORTANTE — Consulta N+1 en el listado de usuarios
Línea 47: `orders = [get_orders(user.id) for user in users]` ejecuta una consulta por usuario.
Reemplazar con una sola consulta JOIN o usar `select_related('orders')`.
```

**Sugerir la solución, no solo el problema:**
```
🔴 BLOQUEANTE — Entrada del usuario usada directamente en consulta SQL
Línea 23: f"SELECT * FROM products WHERE name = '{search_term}'"
Riesgo de inyección SQL. Reemplazar con una consulta parametrizada:
  cursor.execute("SELECT * FROM products WHERE name = %s", (search_term,))
```

**Reconocer buenas decisiones:**
```
✅ Buena decisión usar UPSERT aquí en lugar de SELECT + INSERT — evita condición de carrera.
```

## Ejemplo

**PR:** Agregar endpoint de búsqueda de usuario

**Diff (simplificado):**
```python
@app.get("/users/search")
def search_users(query: str):
    results = db.execute(f"SELECT * FROM users WHERE email LIKE '%{query}%'")
    return [dict(r) for r in results]
```

**Salida de revisión esperada:**
```
🔴 BLOQUEANTE — Inyección SQL vía consulta sin parametrizar
Archivo: api/users.py:3
Problema: El `query` proporcionado por el usuario está interpolado directamente en SQL. Un atacante puede
extraer todos los datos o soltar tablas.
Solución:
  results = db.execute(
      "SELECT * FROM users WHERE email LIKE %s",
      (f"%{query}%",)
  )

🟠 IMPORTANTE — Sin verificación de autenticación o autorización
Archivo: api/users.py:1
Problema: El endpoint devuelve datos del usuario sin verificar que la llamada es autenticada.
Solución: Agregar `user = Depends(get_current_user)` y verificar que la llamada tiene permisos de búsqueda.

🟠 IMPORTANTE — Sin paginación — devolverá todos los usuarios
Archivo: api/users.py:3
Problema: `SELECT *` sin LIMIT puede devolver miles de filas.
Solución: Agregar `LIMIT 50` y un parámetro `page`.

🟡 SUGERENCIA — SELECT * devuelve password_hash y otros campos sensibles
Considerar seleccionar explícitamente solo columnas seguras: id, email, name, created_at.

Resumen: 2 bloqueantes, 2 importantes
Decisión: Solicitar cambios — problemas de seguridad deben arreglarse antes de merge.
```

---
