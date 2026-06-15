# Obtener la Certificación de su Stack

Esta guía lo guía a través del proceso paso a paso de certificación de su stack en el Marketplace Claudient.

## Requisitos Previos

Antes de solicitar la certificación, asegúrese de que su stack:

1. **Ya está publicado** en el Marketplace Claudient con retroalimentación positiva
2. **Cumple con los criterios base** (consulte VETTING.md)
3. **Tiene un repositorio de GitHub** (público, activo, mantenido)
4. **Cumple con los requisitos mínimos** para su nivel de destino:
   - Bronce: 10+ instalaciones, 3.5+ calificación
   - Plata: 50+ instalaciones, 4.0+ calificación, 6+ meses de desarrollo activo
   - Oro: 200+ instalaciones, 4.5+ calificación, aprobación del mantenedor oficial

---

## Paso 1: Evalúe su Stack

Utilice la rúbrica de calidad en [certification-criteria.md](./certification-criteria.md) para evaluar la preparación de su stack.

### Lista de Verificación

**Calidad del Código**
- [ ] Cobertura de pruebas 50%+ (aceptable) o 70%+ (plata) o 90%+ (oro)
- [ ] Linting aprobado; sin problemas críticos
- [ ] Dependencias actualizadas en los últimos 3 meses
- [ ] Sin vulnerabilidades de seguridad conocidas

**Adopción**
- [ ] Bronce: 10+ instalaciones
- [ ] Plata: 50+ instalaciones durante 90 días
- [ ] Oro: 200+ instalaciones durante 180 días

**Satisfacción**
- [ ] Bronce: 3.5+ calificación (5+ reseñas)
- [ ] Plata: 4.0+ calificación (10+ reseñas)
- [ ] Oro: 4.5+ calificación (20+ reseñas)

**Mantenimiento**
- [ ] Actualizado en los últimos 6 meses (bronce), 3 meses (plata), 1 mes (oro)
- [ ] Tiempo promedio de respuesta a problemas aceptable
- [ ] Sin problemas críticos pendientes

**Documentación**
- [ ] README completo y claro
- [ ] Al menos 1 ejemplo (bronce), 2+ (plata), 3+ (oro)
- [ ] CLAUDE.md presente y preciso
- [ ] Plata/Oro: Al menos un idioma adicional

---

## Paso 2: Calcule su Puntuación de Calidad

Utilice la metodología en [certification-criteria.md](./certification-criteria.md):

```
Quality Score = (0.20 × Code Quality) + (0.20 × Adoption) + (0.20 × Satisfaction) + (0.20 × Maintenance) + (0.20 × Documentation)
```

Registre puntuaciones para cada dimensión:

| Dimensión | Puntuación (0-100) |
|-----------|---------------|
| Calidad del Código | ___ |
| Adopción | ___ |
| Satisfacción | ___ |
| Mantenimiento | ___ |
| Documentación | ___ |
| **Puntuación Compuesta** | **___** |

**Elegibilidad de Nivel:**
- 80-100 → Candidato a Oro
- 60-79 → Candidato a Plata
- 40-59 → Candidato a Bronce

---

## Paso 3: Prepare Materiales de Certificación

Cree un documento que contenga:

### A. Resumen de Stack
- Nombre e ID de la stack
- URL del repositorio de GitHub
- Conteo de instalaciones (con fuente: npm, GitHub o seguimiento del marketplace)
- Calificación promedio actual y conteo de reseñas
- Lista de características/habilidades clave

### B. Prueba de Calidad
- Enlaces a 2+ reseñas comunitarias o testimonios
- Registro de actividad de GitHub (últimos 6 meses)
- Lista de problemas resueltos (con tiempos de respuesta)
- Informe de cobertura de pruebas (si está disponible)

### C. Compromiso de Mantenimiento
- Nombre(s) del/de los autor(es)
- Nivel de compromiso: Bronce/Plata/Oro
- Horas de mantenimiento estimadas por mes
- Canales de soporte (GitHub Issues, Discord, correo electrónico, etc.)
- Plan para manejar problemas críticos

### D. Propuesta de Valor Único
- Breve explicación de lo que hace valiosa esta stack
- Cómo se diferencia de stacks similares
- Prueba de adopción comunitaria

### E. Declaración de Cumplimiento de SLA

**Para Bronce:**
"Me comprometo a responder a todos los problemas dentro de 2 semanas y corregir errores críticos dentro de 2 semanas."

**Para Plata:**
"Me comprometo a responder a todos los problemas dentro de 1 semana y corregir errores críticos dentro de 2 semanas. Mantendré una cadencia de lanzamiento mensual o trimestral."

**Para Oro:**
"Me comprometo a responder a todos los problemas dentro de 48 horas y corregir errores críticos dentro de 5 días hábiles. Mantendré lanzamientos mensuales y realizaré auditorías de seguridad anuales."

---

## Paso 4: Solicite Revisión de Certificación

Envíe un correo electrónico a **marketplace@claudient.dev** con la línea de asunto:

```
Certification Request: [Stack Name] - [Tier] Tier
```

Incluya:
1. Todos los materiales del Paso 3
2. Su desglose de puntuación de calidad calculado
3. Enlace a la lista de esta stack en el marketplace
4. Cualquier contexto o nota adicional

**Cronograma de Respuesta:** El equipo central reconocerá dentro de 3 días hábiles e iniciará la revisión.

---

## Paso 5: Responda a Retroalimentación del Equipo Central

El equipo central puede solicitar:

**Información Adicional:**
- Aclaraciones sobre métricas
- Ejemplos o documentación adicional
- Informe de auditoría de seguridad o dependencias

**Actualizaciones Menores:**
- Mejoras de documentación
- Adiciones de ejemplos
- Mejoras de claridad del README

**Aprobación Condicional:**
- Cumplir métricas específicas antes de la aprobación final
- Corregir problemas identificados y repostularse

**Repostúlese Después de Mejoras:**
Si se rechaza, puede repostularse después de:
- Abordar retroalimentación (mínimo 2+ semanas)
- Mejorar áreas débiles
- Construir adopción adicional (si es necesario)

---

## Paso 6: Aprobación de Certificación

Tras la aprobación:

1. **Lista del marketplace actualizada** con insignia de certificación
2. **Índice de stacks certificadas actualizado** (marketplace/certified/README.md)
3. **Designación de nivel publicada:**
   - Bronce: Listado en stacks certificadas
   - Plata: Destacado en categoría "Recomendado"
   - Oro: Destacado en la página de inicio del marketplace

4. **Autor notificado** con:
   - Activo de insignia de certificación (PNG, SVG)
   - Certificado de certificación
   - Plantilla de comunicado de prensa (opcional)
   - Activos de marketing

---

## Paso 7: Mantenga su Certificación

### Responsabilidades Continuas

**Bronce (cada 6 meses) :**
- Mantenga calificación promedio superior a 3.5
- Mantenga al menos 10 instalaciones
- Responda a problemas dentro de 2 semanas
- Recertifique para mantener insignia

**Plata (cada 12 meses) :**
- Mantenga calificación promedio superior a 4.0
- Mantenga al menos 50 instalaciones
- Publique actualizaciones trimestrales
- Responda a problemas dentro de 1 semana
- Recertifique para mantener insignia

**Oro (cada 24 meses) :**
- Mantenga calificación promedio superior a 4.5
- Mantenga al menos 200 instalaciones
- Publique actualizaciones mensuales
- Responda a problemas dentro de 48 horas
- Realice auditoría de seguridad anual
- Recertifique para mantener insignia

### Proceso de Recertificación Anual

**30 días antes de la fecha de vencimiento:**
- Recibirá aviso de recertificación
- Verifique que las métricas actuales sigan cumpliendo con los requisitos de nivel
- Envíe confirmación de recertificación a marketplace@claudient.dev

**Si las métricas han disminuido:**
- La stack puede ser degradada un nivel
- Tiene 60 días para mejorar y apelar
- Si no mejora, la certificación se revoca

---

## Renovación de Certificación

Su insignia de certificación sigue siendo válida hasta la fecha de vencimiento. La renovación a corto plazo (dentro de 60 días) puede ser activada por:
- Adición de características significativas
- Hito importante de mantenimiento
- Solicitud de actualización de nivel

El proceso de renovación es idéntico a la certificación inicial.

---

## Actualizaciones de Nivel

Para actualizar de Bronce a Plata o de Plata a Oro:

1. Asegúrese de que las nuevas métricas cumplan con el nivel de destino
2. Envíe una solicitud de actualización a marketplace@claudient.dev con puntuación de calidad actualizada
3. El equipo central verifica métricas (2-3 días hábiles)
4. Tras aprobación, la lista y la insignia se actualizan

---

## Revocación de Certificación y Apelaciones

Si su certificación es revocada:

1. **Notificación de Razón:** Recibirá explicación detallada
2. **Ventana de Apelación:** 2 semanas para proporcionar contexto adicional
3. **Revisión de Apelación:** Un miembro independiente del equipo central revisa la decisión
4. **Repostulación:** Disponible después de 6 meses de mejoras

---

## ¿Preguntas?

- **Criterios de certificación:** Consulte [certification-criteria.md](./certification-criteria.md)
- **Detalles de nivel:** Consulte [../CERTIFICATION.md](../CERTIFICATION.md)
- **Preguntas generales:** marketplace@claudient.dev
- **Discusión comunitaria:** [GitHub Discussions](https://github.com/claudients/claudient/discussions)

---

**Última actualización:** 15 de junio de 2026
