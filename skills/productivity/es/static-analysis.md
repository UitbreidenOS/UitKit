# Análisis Estático

## Cuándo activar
Revisiones de seguridad, auditorías de calidad de código, o cuando el usuario menciona CodeQL, Semgrep, o encontrar patrones de vulnerabilidad en una base de código.

## Cuándo NO usar
- Pruebas de seguridad en tiempo de ejecución (fuzzing, pruebas de penetración, DAST) — análisis estático solo cubre rutas de código, no ejecución en vivo
- Linting para estilo/formateo — usar ESLint, Prettier, Ruff; esos no son escáneres de vulnerabilidad
- Revisión de código de archivo único sin enfoque de vulnerabilidad — usar la habilidad `code-review` en su lugar

## Instrucciones

### Semgrep

**Ejecutar contra un repositorio:**
```bash
# Usar conjunto de reglas administrado (OWASP, CVEs, secretos)
semgrep --config auto .

# Ejecutar un conjunto de reglas específico
semgrep --config p/owasp-top-ten .

# Ejecutar reglas personalizadas
semgrep --config ./rules/custom.yaml .

# Integración CI — fallar en error o advertencia
semgrep --config auto --error .
```

**Sintaxis de patrón:**
- `$X` — metavariable, coincide con cualquier expresión
- `...` — elipsis, coincide con cero o más sentencias o argumentos
- `(int)$X` — metavariable tipificada (solo Java/C)

**Escribir una regla personalizada:**
```yaml
rules:
  - id: sql-string-concat
    pattern: |
      $QUERY = "..." + $INPUT
      $DB.execute($QUERY)
    message: "Posible inyección SQL: entrada de usuario concatenada en consulta"
    severity: ERROR
    languages: [python, javascript]
    metadata:
      cwe: "CWE-89"
```

**Patrones clave para escribir en cualquier base de código:**
- Inyección SQL: entrada no confiable alcanzando `.execute()`, `.query()`, `db.raw()`
- Traversal de ruta: `path.join()` con entrada de usuario, `fs.readFile()` con rutas no verificadas
- Inyección de comando: `exec()`, `spawn()`, `subprocess.run()` con interpolación de cadena
- Deserialización: `pickle.loads()`, `JSON.parse()` en datos de red pasados a `eval()`
- Secretos codificados: patrones como `password = "..."`, `api_key = "sk-..."`, `token = "..."`
- XSS reflejado: entrada de usuario en `innerHTML`, `document.write()`, `res.send()` sin desinfección

### CodeQL

**Flujo de trabajo CLI:**
```bash
# Crear base de datos desde fuente
codeql database create mydb --language=javascript --source-root=.

# Ejecutar una consulta
codeql query run queries/sql-injection.ql --database=mydb

# Ejecutar un conjunto de consultas integradas
codeql database analyze mydb javascript-security-extended.qls --format=sarif-latest --output=results.sarif
```

**Estructura de consulta:**
```ql
import javascript

from DataFlow::PathNode source, DataFlow::PathNode sink, TaintTracking::Configuration cfg
where cfg.hasFlowPath(source, sink)
select sink, source, sink, "Datos contaminados de $@ alcanzan consulta SQL.", source, "entrada de usuario"
```

**GitHub Actions — Code Scanning:**
```yaml
- name: Inicializar CodeQL
  uses: github/codeql-action/init@v3
  with:
    languages: javascript, python

- name: Realizar Análisis de CodeQL
  uses: github/codeql-action/analyze@v3
  with:
    category: "/language:javascript"
```

### Análisis de Variantes
Cuando se encuentra una vulnerabilidad conocida (ej. una inyección SQL), usar análisis de variantes para encontrar todas las instancias del mismo patrón:
1. Escribir una regla Semgrep o CodeQL que capture el patrón exacto
2. Ejecutarla en la base de código completa, no solo el archivo afectado
3. Revisar cada coincidencia — verdadero positivo, falso positivo, o necesita revisión
4. Documentar qué instancias están arregladas vs. riesgo aceptado

### Verificación de Arreglo
Después de parchar una vulnerabilidad:
1. Re-ejecutar la regla original que la detectó — debería producir cero hallazgos
2. Verificar código adyacente para el mismo patrón — el arreglo puede haber perdido sumideros relacionados
3. Agregar la regla a CI para que la regresión se atrape automáticamente

### Estrategia de Integración CI
```yaml
# Ejecutar en cada PR, fallar en alta severidad
semgrep --config auto --severity ERROR --error .

# Ejecutar escaneo completo en rama main semanalmente (más lento, más exhaustivo)
semgrep --config auto --severity WARNING --json --output results.json .
```

No fallar CI en WARNING para conjuntos de reglas amplios — la tasa de falsos positivos bloqueará trabajo legítimo. Ajustar el umbral de severidad por proyecto.

## Ejemplo

Auditoría de seguridad de una API Node.js Express:

```bash
# Paso 1: Escaneo auto amplio
semgrep --config auto . --json --output results.json
# Encuentra 14 hallazgos: 3 ERROR, 8 WARNING, 3 INFO

# Paso 2: Escribir regla personalizada para el constructor de consultas de la aplicación
cat > rules/knex-injection.yaml << 'EOF'
rules:
  - id: knex-raw-injection
    pattern: knex.raw($QUERY + $INPUT)
    message: "Entrada sin desinfectar en knex.raw()"
    severity: ERROR
    languages: [javascript, typescript]
EOF
semgrep --config rules/knex-injection.yaml .
# Encuentra 2 verdaderos positivos adicionales perdidos por escaneo auto

# Paso 3: Parchar ambos, re-ejecutar para confirmar cero hallazgos
# Paso 4: Agregar semgrep a CI con bandera --error
```

---
