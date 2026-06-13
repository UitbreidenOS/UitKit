# /goal — Finalización Autónoma de Tareas

## Cuándo activar
El usuario quiere que Claude siga trabajando en una tarea sin detenerse para verificar; el usuario quiere establecer una condición de finalización e irse; el usuario pregunta sobre operación autónoma o mantener a Claude ejecutándose hasta que se alcance un resultado específico.

## Cuándo NO usar
Tareas simples de un solo paso donde una respuesta es suficiente; tareas donde el usuario quiere que Claude haga una pausa y confirme después de cada acción; sesiones de depuración interactivas donde el ir y venir es el punto.

## Instrucciones

**Sintaxis :**
```
/goal <condición de finalización>
```

La condición se evalúa después de cada turno del asistente. Claude continúa trabajando — escribiendo código, ejecutando comandos, viendo fallas, ajustando — hasta que la condición se cumpla, luego se detiene e informa.

**Escribir buenas condiciones :**

El lenguaje natural funciona. La condición debe ser observable e inequívoca :

- `Todas las pruebas pasan` — Claude ejecuta la suite de pruebas, corrige fallas, vuelve a ejecutar, hasta verde
- `El PR se crea` — Claude termina el trabajo y abre un PR
- `La migración se ejecuta sin errores` — Claude aplica la migración, verifica errores, corrige problemas de esquema
- `tsc --noEmit se cierra con 0` — Claude resuelve errores TypeScript hasta que el compilador esté limpio
- `CHANGELOG.md existe y tiene la fecha de hoy` — Claude escribe el archivo changelog

**Condiciones malas a evitar :**
- Subjetivas: "se ve bien", "está limpio" — no verificables por Claude
- Abiertas: "sigue mejorando el código" — sin condición de parada
- Basadas en tiempo: "ejecutar durante una hora" — no un resultado

**Combinar con nivel de esfuerzo** para máxima autonomía :
```
/goal Todas las pruebas pasan
/effort xhigh
```

**Interrumpir :** Envíe cualquier mensaje para interrumpir, o elimine `.claude/goal` para cancelar. El estado del goal persiste entre compresiones de contexto — Claude recuerda el goal incluso después de la compresión de ventana de contexto.

**Sesiones en segundo plano :** Funciona con `claude --bg`. Establezca el goal, cierre su terminal, vuelva cuando esté hecho.

**Qué sucede en cada turno :**
1. Claude toma acciones (edita archivos, ejecuta comandos)
2. Evalúa: ¿se cumple la condición?
3. Si no — continúa
4. Si sí — se detiene e informa sobre qué se hizo

## Ejemplo

```
/goal Todos los errores TypeScript se resuelven y tsc --noEmit se cierra con 0
```

Claude ejecuta `tsc --noEmit`, lee la lista de errores, corrige cada error, ejecuta de nuevo, ve errores restantes, corrige los mismos, ejecuta de nuevo — el ciclo continúa hasta cero errores. Luego se detiene e informa: "Resuelto 14 errores TypeScript en 6 archivos. `tsc --noEmit` se cierra limpiamente."

---
