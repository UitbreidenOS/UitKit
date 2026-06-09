# Reglas de Convenciones de Commits

## Aplicable a
Todos los commits de git en todos los repositorios.

## Reglas

1. **Sigue el formato de Conventional Commits** — `<type>(<scope>): <subject>`. El tipo es obligatorio; el ámbito es opcional pero recomendado. El asunto debe ser imperativo, en presente, minúscula, sin punto final.

2. **Tipos válidos: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `ci`, `build`, `revert`** — `feat` es una característica visible para el usuario, `fix` es una corrección de error visible para el usuario. Los cambios en herramientas, dependencias y configuración son `chore`. No inventes tipos.

3. **Línea de asunto inferior a 72 caracteres** — git log, GitHub y la mayoría de herramientas truncan en 72. Si no puedes describir el cambio en 72 caracteres, el commit probablemente es demasiado grande.

4. **Usa el cuerpo para explicar el por qué, no el qué** — el diff muestra qué cambió. El cuerpo explica la motivación, la restricción o la compensación. Omite el cuerpo cuando el asunto es autoexplicativo.

5. **El ámbito debe nombrar el módulo, paquete o dominio** — `feat(auth): add refresh token rotation` no `feat(code): add thing`. Los ámbitos hacen que los changelogs y `git log --grep` sean útiles.

6. **Los cambios incompatibles usan `!` y un pie de página `BREAKING CHANGE:`** — `feat(api)!: remove v1 endpoints` en el asunto, y un pie de página `BREAKING CHANGE: v1 endpoints removed, migrate to v2` en el cuerpo. Esto desencadena un aumento de versión mayor en semantic-release.

7. **Un cambio lógico por commit** — no agrupes una característica, dos correcciones de errores y un aumento de dependencia. Si el mensaje del commit requiere "y", debe dividirse.

8. **Nunca hagas commit con `--no-verify`** — los hooks previos al commit existen para detectar problemas. Omitirlos significa enviar código que falla en linting, pruebas o verificaciones de formato. Soluciona el problema en su lugar.

9. **Los commits `fix:` hacen referencia al problema o ticket** — `fix(payments): prevent double-charge on retry (#1234)`. La referencia vincula el commit al contexto en el rastreador de problemas.

10. **Los commits `revert:` hacen referencia al SHA del commit original** — `revert: feat(auth): add refresh token rotation` con cuerpo `Reverts commit abc1234`. Permite que bisect funcione correctamente.

11. **No uses tiempo pasado en el asunto** — `feat: add user export` no `feat: added user export`. El asunto completa la oración "Si se aplica, este commit hará... add user export."

12. **Aplasta commits de corrección antes de fusionar** — `fix typo`, `wip`, `address review comments` son ruido en el historial permanente. Aplástalos en el commit al que pertenecen antes de que el PR se fusione.

13. **Los commits de fusión no deben contener cambios de código** — un commit de fusión que también corrige un conflicto en la lógica es un cambio oculto. Resuelve conflictos en un commit separado antes de fusionar.

14. **Etiqueta las versiones usando versionado semántico** — `v1.2.3`, no `1.2.3`, no `release-jan-24`. Las herramientas (lanzamientos de GitHub, semantic-release, gráficos Helm) esperan el prefijo `v`.

15. **Aplica convenciones a través de herramientas** — usa `commitlint` con `@commitlint/config-conventional` en CI. La revisión humana de mensajes de commit no escala; la aplicación automatizada sí.


---

> **Trabaja con nosotros:** Claudient es respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
