# Arquitecturas de Mezcla de Expertos (MoE) en Claudient

Este documento describe las arquitecturas para enrutar solicitudes entre múltiples modelos para optimizar la generación de código, el razonamiento y los costos.

---

## 1. Arquitectura 1: Enrutamiento basado en complejidad (Tiered Dispatch)

### Cómo funciona
El sistema escala dinámicamente el razonamiento basado en heurísticas de entrada (ej. líneas agregadas, archivos impactados, flags de seguridad).

---

## 2. Arquitectura 2: Enrutamiento por dominio de especialidad (Dispatch por rol)

### Cómo funciona
Las consultas se analizan en busca de palabras clave, lenguajes y directorios técnicos para enrutarlas a plantillas/instrucciones del sistema altamente especializadas.

---

## 3. Arquitectura 3: Enjambre de consenso multiagente (Enrutamiento de debate)

### Cómo funciona
Para decisiones de alto riesgo, un agente supervisor coordina un debate entre dos agentes expertos adversarios, sintetizando los resultados antes de la ejecución.
