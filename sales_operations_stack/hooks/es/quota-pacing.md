## Script del Hook (quota-pacing.sh)

```bash
#!/bin/bash
# Monitorea el ritmo de cumplimiento de cuota; alerta si el equipo tiende a perder

QUOTA_FILE="${1:-.claude/quota-latest.md}"
CALENDAR_DAY=$(date +%d)
CALENDAR_DAYS_IN_MONTH=30  # Ajustar por mes según sea necesario

if [ ! -f "$QUOTA_FILE" ]; then
  echo "QUOTA-PACING: No se encontró archivo de cuota. Omitiendo validación." >&2
  exit 0
fi

# Calcular cumplimiento esperado en este punto del mes
EXPECTED_PCT=$((CALENDAR_DAY * 100 / CALENDAR_DAYS_IN_MONTH))

# Extraer cumplimiento del equipo del informe
TEAM_ATTAINMENT=$(grep -i "cumplimiento\|%" "$QUOTA_FILE" | grep "Equipo" | grep -o "[0-9]*%" | head -1 | sed 's/%//')

if [ ! -z "$TEAM_ATTAINMENT" ]; then
  VARIANCE=$((TEAM_ATTAINMENT - EXPECTED_PCT))
  if [ "$VARIANCE" -lt -15 ]; then
    echo "QUOTA-PACING-ALERT: El equipo está ${VARIANCE}% por debajo del ritmo. Requerido para alcanzar cuota a fin de mes: {plan de acción}" >&2
  fi
fi

echo "QUOTA-PACING: Validación completada en el día ${CALENDAR_DAY}/30." >&2
exit 0