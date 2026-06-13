# Canalización de pre-revisión humana

Una canalización secuencial de tres agentes que prepara una solicitud de extracción para revisión humana. Ejecuta simplificación de código, escaneo de seguridad y revisión de calidad final en orden — cada agente debe pasar antes de que el siguiente se ejecute. El resultado es una PR que llega a la revisión humana ya limpia, auditada y anotada.

---

## Cuándo usarlo

- Antes de solicitar una revisión de código de un compañero de equipo o enviándola a main
- Después de una sesión de construcción rápida asistida por IA donde la velocidad fue priorizada sobre el pulido
- Cualquier PR que toque autenticación, pagos o acceso a datos — donde un pase de seguridad es innegociable
- Equipos con ancho de banda limitado de revisión humana que quieren que la IA primero filtre el ruido

---

## Fases

### Fase 0 — Comprobación de requisitos previos

Antes de generar agentes, verifique:

```
Lea la diferencia de PR (git diff main...HEAD o la lista de archivos).

Dígame:
1. ¿Cuántos archivos han cambiado?
2. ¿Alguno de estos está presente: autenticación, pagos, migraciones, secretos, configuración de entorno?
3. ¿La diferencia está bajo 500 líneas? (Si más de 2000 líneas, recomiende dividir PR primero)

No proceda a la Fase 1 hasta que confirme.
```

Puerta: si la diferencia excede 2000 líneas, detenga e indique al usuario que divida la PR. Las diferencias grandes anulan el propósito de una revisión estructurada.

---

### Fase 1 — Simplificador de código

**Agente:** `agents/code-simplifier.md`
**Objetivo:** Elimine sobre-ingeniería, código muerto y complejidad innecesaria antes de que otros agentes gasten tokens en ello.

```
Genere agente simplificador de código.

Alcance: [lista de archivos modificados]
Tarea: Revise esta diferencia por sobre-ingeniería. Identifique:
  - Funciones que pueden ser reemplazadas por llamadas de biblioteca estándar
  - Abstracciones que agregan complejidad sin reutilización (violaciones YAGNI)
  - Código muerto o bloques comentados introducidos en esta PR
  - Lógica repetida que debe extraerse una vez

Para cada hallazgo: muestre el antes, el después sugerido y la razón.
NO haga cambios — simplemente produzca un informe de hallazgos.
```

**Puerta:** Revise los hallazgos del simplificador. Para cada hallazgo, acepte o rechace. Solo los hallazgos aceptados se aplican antes de pasar a la Fase 2. Si el simplificador reporta nada para simplificar — luz verde, continúe inmediatamente.

Aplicar simplificaciones aceptadas:
```
Aplique las siguientes simplificaciones aceptadas del informe simplificador de código:
[pegue hallazgos aceptados]

Haga los cambios mínimos requeridos. No introduzca nuevos patrones o refactorización más allá de lo que fue listado.
```

---

### Fase 2 — Auditor de seguridad

**Agente:** `agents/security-reviewer.md`
**Objetivo:** Marque vulnerabilidades introducidas en la diferencia de PR — no problemas preexistentes en la codebase.

```
Genere agente de revisión de seguridad.

Alcance: solo archivos modificados en esta PR — no audite código preexistente.
Diferencia: [adjunte diferencia o liste archivos]

Compruebe:
  - Vulnerabilidades de inyección (SQL, comando, plantilla)
  - Brechas de autenticación y autorización
  - Secretos o credenciales en código o comentarios
  - Deserialización insegura o patrones equivalentes a eval
  - Validación de entrada faltante en datos controlados por el usuario
  - Control de acceso roto (escalada de privilegios horizontal o vertical)

Para cada hallazgo: severidad (CRÍTICO / ALTO / MEDIO / BAJO), archivo + línea, descripción, remediación.
Los hallazgos CRÍTICO y ALTO bloquean la fusión. MEDIO y BAJO son consultativos.
```

**Puerta:** Cualquier hallazgo CRÍTICO o ALTO bloquea la Fase 3. El usuario debe reparar el problema o aceptar explícitamente el riesgo por escrito antes de proceder. Los hallazgos BAJO y MEDIO se adjuntan a la descripción de PR como notas consultativos.

---

### Fase 3 — Revisor de código

**Agente:** `agents/code-reviewer.md`
**Objetivo:** Pase de calidad final — corrección de lógica, cobertura de pruebas, documentación y disponibilidad general.

```
Genere agente revisor de código.

Contexto: Esta diferencia ya ha pasado simplificación y revisión de seguridad.
Enfoque su revisión en:
  - Corrección de lógica: ¿hace el código lo que afirma la descripción de PR?
  - Casos extremos: ¿qué entradas o estados podrían romper esto?
  - Cobertura de pruebas: ¿son las pruebas significativas o prueban detalles de implementación?
  - Manejo de errores: ¿se manejan los fallos en el nivel correcto?
  - Documentación: ¿tienen nuevas API públicas docstrings o JSDoc?

No vuelva a plantear problemas ya descubiertos por los pasos de seguridad o simplificación.
Produzca: un veredicto LGTM / NECESITA TRABAJO con una lista numerada de problemas (si las hay).
```

**Puerta:** LGTM → PR está lista para revisión humana. NECESITA TRABAJO → aborde problemas y reejecuté solo la Fase 3 (no hay necesidad de reejecutar Fases 1 o 2 a menos que se haya agregado código nuevo).

---

### Fase 4 — Empaque de salida

Una vez que los tres agentes hayan pasado:

```
Resuma esta PR para el revisor humano.

Incluya:
- Descripción de un párrafo de lo que hace esta PR
- Archivos modificados (agrupados por preocupación: código de características, pruebas, configuración)
- Problemas planteados y resueltos durante la canalización
- Cualquier nota (BAJO/MEDIO) de seguridad consultativos
- Áreas de enfoque de revisión sugeridas para el humano

Formato como actualización de descripción de PR — lo pegaré en el cuerpo de PR de GitHub.
```

---

## Ejemplo

PR: "Agregar inicio de sesión OAuth2 con Google"

- Fase 0: 8 archivos modificados, lógica de autenticación presente → proceda con pase de seguridad obligatorio
- Fase 1 (Simplificador): encontró 2 problemas — validación de token en línea duplica la utilidad `validateToken()` e importación muerta. Ambos aceptados y aplicados.
- Fase 2 (Seguridad): encontró 1 ALTO — parámetro de estado no validado en devolución de llamada OAuth (riesgo CSRF). Usuario lo reparó antes de la Fase 3.
- Fase 3 (Revisor): LGTM con 1 consultativo — falta prueba para caso de token expirado. Consultativo adjunto a PR.
- Fase 4: descripción de PR actualizada con resumen y nota consultativos.

El revisor humano recibe una diferencia que ya está simplificada, verificada de seguridad y anotada.

---
