# Reglas de Gestión de Dependencias

## Aplicado a
Todos los proyectos — cualquier lenguaje, cualquier gestor de paquetes (`npm`, `pip`, `cargo`, `go mod`, `maven`, `gem`).

## Reglas

1. **Fija dependencias directas a versiones exactas o bloqueadas por rango** — `"express": "4.18.2"` no `"express": "*"`. Para librerías, `"~4.18.0"` (solo parches) es aceptable. Las dependencias transitivas sin fijar se manejan mediante archivos de bloqueo.

2. **Confirma archivos de bloqueo para aplicaciones, no para librerías** — `package-lock.json`, `Cargo.lock`, `poetry.lock`, `go.sum` pertenecen al control de fuente para aplicaciones desplegadas. Los archivos de bloqueo de librerías restringen innecesariamente a los consumidores.

3. **Ejecuta `npm audit` / `pip-audit` / `cargo audit` en CI** — falla la construcción en CVEs de severidad alta o crítica. Trata una dependencia vulnerable como una prueba fallida.

4. **Separa dependencias de tiempo de ejecución de dependencias de desarrollo** — `devDependencies` en npm, `dev = true` en Poetry, `[dev-dependencies]` en Cargo. Las herramientas de desarrollo no deben enviarse en imágenes de producción.

5. **Revisa cada nueva dependencia antes de agregarla** — verifica: fecha del último commit, descargas semanales, CVEs abiertos, compatibilidad de licencia. Una dependencia es un compromiso de mantenimiento. Rechaza paquetes abandonados o mal mantenidos para uso en producción.

6. **Prefiere la librería estándar** — antes de agregar una dependencia, verifica si la librería estándar del lenguaje cubre la necesidad. Una solución de 5 líneas de librería estándar supera a un gráfico de dependencias transitivas de 500 KB para formato de fechas.

7. **Actualiza dependencias según un horario, no solo cuando se rompen** — PR automatizadas semanales o quincenales (Dependabot, Renovate) con CI pasando son rutina. Las actualizaciones de emergencia bajo presión sin cobertura de pruebas son peligrosas.

8. **Verifica licencia en CI** — usa `license-checker`, `pip-licenses`, o `cargo-deny` para aplicar listas de permisos de licencia. Enviar código GPL en un producto propietario es un riesgo legal, no uno técnico.

9. **Elimina dependencias no utilizadas** — `depcheck` (Node), `pip-autoremove`, `cargo machete`. Los paquetes no utilizados inflan el tamaño de la imagen, aumentan la superficie de ataque y complican las auditorías.

10. **Aísla actualizaciones de versión mayor como su propio PR** — un aumento de versión mayor es un cambio importante. Agruparla con trabajo de características hace imposible el análisis de causa raíz cuando algo se rompe.

11. **Vende dependencias para entornos sin aire o altamente regulados** — `go mod vendor`, npm `--prefer-offline` con un registro local, o un proxy privado Artifactory/Nexus. Depender de registros públicos en tiempo de ejecución es un riesgo de cadena de suministro.

12. **Verifica integridad del paquete** — usa `npm ci` en lugar de `npm install` en CI (estricto de archivo de bloqueo). En Python, verifica hashes con `pip install --require-hashes`. En Go, `go.sum` proporciona esto automáticamente.

13. **Nunca instales paquetes con `sudo` en entornos de aplicación** — usa entornos virtuales de espacio de usuario (Python `venv`, Node `node_modules` local del proyecto). Las instalaciones globales contaminan el sistema y crean conflictos entre proyectos.

14. **Observa ataques de confusión de dependencias** — los nombres de paquetes internos no deben colisionar con nombres de registros públicos. Usa paquetes con alcance (`@myorg/internal-lib`) o alcance privado del registro para prevenir ataques de ocupación de espacio de nombres.

15. **Documenta por qué existe una dependencia no obvia** — un comentario `# needed for X because stdlib doesn't support Y` en `requirements.txt` o una nota en la descripción del PR evita que los desarrolladores futuros eliminen una dependencia que parece no utilizada.


---

> **Trabaja con nosotros:** Claudient es respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
