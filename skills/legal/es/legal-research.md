---
name: legal-research
description: "Asistente de investigación jurídica: resúmenes de jurisprudencia, orientación regulatoria, comparación de jurisdicciones"
---

# Habilidad: Investigación Jurídica

## Cuándo activar
- Resumir jurisprudencia, reglamentos o documentos de orientación antes de una reunión o memorando
- Comparar cómo se trata una cuestión jurídica en múltiples jurisdicciones
- Redactar un memorando de investigación jurídica con fuentes citadas y análisis
- Comprender las implicaciones prácticas de una nueva ley o cambio regulatorio
- Obtener una primera lectura de un estatuto o reglamento antes de informar a un abogado
- Preparar preguntas o una agenda de investigación para abogados externos

## Cuándo NO usar
- Proporcionar asesoramiento jurídico a clientes — Claude es un asistente de investigación, no un asesor legal
- Escritos judiciales, alegaciones o presentaciones formales — requieren un abogado con licencia
- Decisiones de alto riesgo e irreversibles (firmar un contrato, respuesta regulatoria) — obtenga asesoramiento real
- Jurisdicciones donde Claude puede tener datos de entrenamiento limitados — siempre validar con fuentes primarias
- Actualizaciones de jurisprudencia en tiempo real — consultar bases de datos actuales (Westlaw, LexisNexis, Casetext, Free Law Project)

## IMPORTANTE

Claude es un asistente de investigación jurídica, no un abogado. Todos los resultados son únicamente para fines de investigación interna y deben validarse contra fuentes primarias autorizadas antes de su uso. El análisis jurídico puede cambiar con nuevas resoluciones, orientaciones regulatorias o enmiendas legislativas. Verifique siempre la vigencia con un profesional con licencia en la jurisdicción correspondiente.

## Instrucciones

### Prompt para memorando de investigación jurídica

```
Draft a legal research memo on: [LEGAL QUESTION]

Jurisdiction(s): [e.g. English and Welsh law / New York / EU / federal US / multi-jurisdiction]
Context: [why this question matters — business decision, contract issue, compliance concern]
Requester role: [in-house counsel / compliance officer / business stakeholder]
Depth: [quick brief (1-2 pages) / standard memo (4-6 pages) / deep research (10+ pages)]

Memo structure:
I. Question Presented
II. Short Answer (1-2 paragraphs — the answer, with key qualifications)
III. Facts Relevant to the Analysis
IV. Discussion
   - Legal framework / applicable statutes and regulations
   - Relevant case law (summarise key holdings)
   - Analysis of how law applies to our facts
   - Counterarguments or alternative interpretations
V. Conclusion and Recommendation
VI. Open Questions / Further Research Needed

Format citations as: [Case Name, [Year] Jurisdiction Citation] or [Statute/Regulation, Section]
Mark where primary source verification is needed: [VERIFY - source needed]
```

### Prompt de resumen de jurisprudencia

```
Summarise the following case for a non-lawyer audience.

Case: [Case name / citation / paste case text]
Context: We are researching this because [business/legal context].

Produce:
1. One-sentence holding (what the court decided)
2. Key facts (2-3 sentences — only facts relevant to the holding)
3. Legal principle established (the rule of law from this case)
4. Practical implication (how this affects our situation)
5. Precedential weight: [binding / persuasive / limited authority — and in which courts]
6. Any subsequent treatment (has it been followed, distinguished, or overruled? — flag if uncertain)

Keep language accessible to a business audience. Legal terms must be explained on first use.
```

### Prompt de comparación de jurisdicciones

```
Compare how [LEGAL ISSUE] is treated across [JURISDICTIONS].

Issue: [plain language description of the legal question]
Jurisdictions to compare: [e.g. EU, UK, US-Federal, California, New York, Singapore]
Our business context: [why we need this comparison — contract choice of law, compliance in multiple markets, etc.]

For each jurisdiction, provide:
1. Applicable law/regulation (cite the statute or regulation name)
2. The rule in that jurisdiction (2-4 sentences)
3. Key requirements or thresholds
4. Enforcement body and enforcement history (brief)
5. Penalties for non-compliance
6. Key differences from the other jurisdictions listed

Output format: comparison table + one paragraph per jurisdiction for detail.
Flag: [VERIFY] on any specific penalty amounts, thresholds, or dates — these change.

End with: "Practical takeaway for a company operating in all of these jurisdictions" — what's the highest common denominator approach to compliance?
```

### Prompt de resumen de orientación regulatoria

```
Summarise this regulatory guidance document.

Source: [Regulator name, guidance title, date published]
[Paste text or provide URL/description]

Produce:
1. What the guidance covers (scope and purpose)
2. Who it applies to (regulated entities)
3. Key obligations or expectations (numbered list — what must or should regulated entities do?)
4. Deadlines or transition periods
5. What the regulator will look for in enforcement
6. How this differs from or clarifies previous guidance
7. Practical steps for compliance (what an in-house team should do following this guidance)

[VERIFY]: Note any provisions where the guidance is ambiguous or where I should consult primary regulation.
```

### Prompt de análisis de estatutos y reglamentos

```
Analyse [STATUTE/REGULATION] as it applies to [OUR SITUATION].

Statute: [cite fully — name, year, section]
Our situation: [describe the facts]
Jurisdiction: [where this applies]

Analysis structure:
1. Text of the relevant provision(s) — quote directly
2. Defined terms — how does the statute define key terms used?
3. Scope — who and what activities does this provision cover?
4. Application to our facts — does our situation fall within scope?
   - Elements of the provision: [list each element]
   - Our facts against each element: [analyse one by one]
   - Conclusion: [within scope / outside scope / uncertain]
4. Exceptions or safe harbours — are any available to us?
5. Enforcement mechanism — what can the regulator do?
6. Practical recommendation

[VERIFY] all statutory references against the current version of the legislation.
Note: statutes are frequently amended — confirm the version in force at the relevant date.
```

### Prompt de matriz de riesgos jurídicos

```
Build a legal risk matrix for [PROJECT/TRANSACTION/ACTIVITY].

Context: [describe what we're doing — new product launch, entering a new market, M&A, etc.]
Jurisdictions involved: [list]
Stakeholders: [business teams involved]

For each identified legal risk:
| Risk | Legal basis | Likelihood | Impact | Owner | Mitigation |
|---|---|---|---|---|---|
| [Risk description] | [Law/reg/case] | H/M/L | H/M/L | [Role] | [Action] |

Risk categories to scan:
1. Regulatory: are we a regulated entity in this jurisdiction? Is this activity regulated?
2. Contract: what contractual obligations or gaps create exposure?
3. IP: does this activity infringe third-party rights, or fail to protect our own?
4. Data/Privacy: what personal data processing does this involve? What framework applies?
5. Employment: any new jurisdiction, new activity type, or new worker category?
6. Liability: where are the indemnification exposures? Is there any unlimited liability?
7. Compliance: export controls, sanctions, anti-bribery, competition law
8. Litigation: any ongoing disputes that this activity could trigger or worsen?

Flag any risk that requires external counsel before proceeding.
```

### Prompt de interpretación de contratos

```
Interpret this contract clause in the context of the following dispute.

Clause: "[paste exact clause text]"
Contract type: [SaaS / services / employment / NDA / M&A]
Governing law: [jurisdiction]
Factual context: [what happened — the dispute facts in 3-5 sentences]
Our position: [what interpretation benefits us]
Counterparty's likely position: [what interpretation benefits them]

Analysis:
1. Plain reading — what does the clause say on its face?
2. Defined terms — are any words defined in the contract? How?
3. Contextual reading — how does the rest of the contract inform this clause?
4. How courts in [jurisdiction] interpret ambiguous contract language generally
   (e.g. contra proferentem, ejusdem generis, noscitur a sociis)
5. Which interpretation is stronger? Why?
6. What does the party that drafted this clause lose if our interpretation prevails?
7. Practical recommendation: negotiate / accept / litigate / seek specialist advice

[VERIFY]: For contested clause interpretation, instruct external counsel before taking a position.
```

### Prompt de construcción de agenda de investigación

```
Build a legal research agenda for [TOPIC].

I need to brief external counsel in [X days/weeks] on [topic].
Budget for external counsel research: [X hours]
Questions I already know to ask: [list any]

Produce:
1. Legal questions to answer (ranked by priority)
2. For each question:
   - The research path (statutes → case law → secondary sources)
   - Jurisdictions to cover
   - Likely complexity (high/medium/low)
   - Recommended research tool (Westlaw / LexisNexis / BAILII / EUR-Lex / Google Scholar / Free Law)
3. Questions I can answer internally (with Claude + open sources)
4. Questions that require external counsel
5. A brief for external counsel: what we need, what we already know, what the business decision depends on

Estimated research time for external counsel: [X hours — broken down by question]
```

## Ejemplo

**Usuario:** Somos una empresa SaaS en el Reino Unido y queremos saber si podemos usar datos de clientes para entrenar nuestro modelo de IA. Resuma la posición jurídica bajo el GDPR.

**Resultado esperado:**
```markdown
# Memorando de Investigación Jurídica

**Cuestión Planteada:**
¿Puede una empresa SaaS del Reino Unido utilizar datos personales de clientes para entrenar un modelo de IA interno bajo el UK GDPR?

**Respuesta Resumida:**
Sí, pero únicamente si existe una base jurídica válida para el tratamiento, el fin es compatible con el propósito original de la recopilación, y los clientes están informados. En la práctica, esto normalmente requiere: (a) consentimiento explícito, una evaluación de intereses legítimos (LIA) o una base contractual; (b) una DPIA si el entrenamiento de IA constituye un tratamiento de alto riesgo; y (c) avisos de privacidad actualizados. Usar datos para entrenar IA que los clientes no esperaban — y sobre lo que no se les ha informado — genera un riesgo significativo de aplicación del GDPR.
[VERIFICAR contra la orientación actual de la ICO — guía sobre IA y protección de datos actualizada en 2024]

**Discusión:**

**1. Base Jurídica (Art. 6 UK GDPR)**
El tratamiento de datos de clientes para el entrenamiento de IA requiere una base jurídica. Las bases más comúnmente aplicables:

- **Intereses Legítimos (Art. 6(1)(f)):** Disponible si el tratamiento es necesario para sus intereses legítimos y no prevalecen los intereses del interesado. Debe estar respaldado por una LIA documentada. La ICO espera que la LIA considere: (i) la naturaleza del interés legítimo; (ii) la necesidad; (iii) la prueba de ponderación frente al impacto individual. Riesgo: los clientes pueden razonablemente no esperar que sus datos se usen para el entrenamiento de IA.
[VERIFICAR - Guía de la ICO sobre IA y protección de datos, 2024]

- **Consentimiento (Art. 6(1)(a)):** Válido si es libre, específico, informado e inequívoco. Requiere un consentimiento nuevo si el original no especificaba el entrenamiento de IA. Debe preservarse el derecho a retirar el consentimiento. Listón alto — raramente viable a escala.

- **Ejecución de un contrato (Art. 6(1)(b)):** Solo disponible si el entrenamiento de IA es estrictamente necesario para ejecutar el contrato. Es poco probable que aplique a menos que el producto *sea* un modelo de IA para el que el cliente contrató.

**2. Limitación de Finalidad (Art. 5(1)(b))**
Los datos personales recopilados para una finalidad (por ejemplo, usar su producto SaaS) solo pueden usarse para una finalidad compatible. El entrenamiento de modelos de IA es probablemente una nueva finalidad. Prueba de compatibilidad (Art. 6(4)): considerar el vínculo entre finalidades, el contexto, la naturaleza de los datos, las consecuencias y las salvaguardas aplicadas.
[VERIFICAR] No existe resolución definitiva de la ICO sobre la compatibilidad del entrenamiento de IA — la posición actual está evolucionando.

**3. Requisito de DPIA (Art. 35 UK GDPR)**
El tratamiento a gran escala de datos personales mediante tecnología novedosa (IA/ML) aparece en la lista de la ICO como algo que probablemente requiere una DPIA. Elabore la DPIA antes de comenzar el entrenamiento.

**4. Actualización del Aviso de Privacidad (Art. 13-14)**
Debe informar a los interesados sobre este nuevo tratamiento. Actualice su aviso de privacidad para describir: el hecho del entrenamiento de IA, la base jurídica utilizada, cualquier participación de terceros y los derechos de los interesados (incluido el derecho de oposición si se basa en intereses legítimos).

**Recomendación Práctica:**
Antes de usar datos de clientes para el entrenamiento de IA: (1) Documente una Evaluación de Intereses Legítimos; (2) Actualice los avisos de privacidad; (3) Complete una DPIA; (4) Implemente la minimización de datos — use datos seudonimizados o anonimizados donde sea posible (los datos verdaderamente anonimizados quedan fuera del GDPR). Consulte a un asesor externo en materia de privacidad sobre los hechos concretos antes de proceder.

**Cuestiones Abiertas:**
- ¿Alguno de los datos es de categoría especial (Art. 9) — p. ej. salud, opiniones políticas? Si es así, se requiere una base del Art. 9(2), un listón significativamente más alto.
- ¿El resultado del modelo expone alguna vez datos a nivel individual? Si es así, se necesitan salvaguardas adicionales.
- ¿Hay clientes fuera de la UE/UK? Verificar las normas equivalentes (CCPA, nFADP suizo, etc.)
```

---
