# Leitfaden für Multi-Agent-Muster

Designmuster für den Aufbau zuverlässiger Multi-Agent-Systeme mit Claude Code.

## Wann man Multi-Agent-Muster verwendet

Verwenden Sie mehrere Agenten, wenn:
- Eine Aufgabe echte unabhängige Teilaufgaben hat, die parallel ausgeführt werden können
- Verschiedene Teilaufgaben unterschiedliche Fachkompetenz oder Kontext erfordern
- Die Aufgabe zu groß ist, um in ein einzelnes Kontextfenster zu passen
- Sie redundante Überprüfungen benötigen (mehrere Agenten überprüfen die gleiche Ausgabe)
- Verschiedene Teile der Aufgabe unterschiedliche Zugriffsstufen für Tools erfordern

Verwenden Sie nicht mehrere Agenten, wenn:
- Ein einzelner Agent die Aufgabe verwalten kann — Orchestrierungsaufwand ist nicht kostenlos
- Teilaufgaben komplexe Abhängigkeiten haben (besser: sequentielles Prompting)
- Die Aufgabe kontinuierlichen gemeinsamen Status erfordert (Agenten können Speicher nicht einfach teilen)

## Muster 1: Parallele Worker

**Wann:** Mehrere unabhängige Aufgaben desselben Typs.

```typescript
// Claude Code — Agenten parallel für unabhängige Aufgaben generieren
// Beispiel: eine Skill-Datei gleichzeitig in 4 Sprachen übersetzen

const translationTasks = ['fr', 'de', 'nl', 'es'].map(lang =>
  Agent({
    description: `In ${lang} übersetzen`,
    model: 'haiku',  // kleineres Modell für Übersetzung verwenden
    prompt: `Diese Skill-Datei in ${lang} übersetzen: [content]`
  })
)

// Alle 4 laufen parallel — 4x schneller als sequenziell
const [fr, de, nl, es] = await Promise.all(translationTasks)
```

**Regeln:**
- Jeder Agent muss vollständig unabhängig sein (all Kontext in der Aufforderung)
- Kein Agent sollte von der Ausgabe eines anderen abhängen
- Verwenden Sie billigere Modelle für einfachere Aufgaben

## Muster 2: Pipeline (sequentieller Handoff)

**Wann:** Jede Stufe ist die Eingabe der nächsten Stufe.

```
Forschungsagent → Analysisagent → Schreibagent → Überprüfungsagent
```

```typescript
// Stufe 1: Forschung
const research = await Agent({
  prompt: 'Recherchieren Sie die Wettbewerbslandschaft für [Thema]. Strukturierte Erkenntnisse ausgeben.'
})

// Stufe 2: Analyse (verwendet Ausgabe von Stufe 1)
const analysis = await Agent({
  prompt: `Analysieren Sie diese Forschungsergebnisse und identifizieren Sie Schlüsselerkenntnisse:
  ${research.output}`
})

// Stufe 3: Schreiben (verwendet Ausgabe von Stufe 2)
const draft = await Agent({
  prompt: `Schreiben Sie ein strategisches Memorandum basierend auf dieser Analyse:
  ${analysis.output}`
})

// Stufe 4: Überprüfung (unabhängige Überprüfung)
const reviewed = await Agent({
  prompt: `Überprüfen Sie dieses Memorandum auf Genauigkeit, Klarheit und strategische Lücken:
  ${draft.output}`
})
```

**Regeln:**
- Jede Stufe validiert die Ausgabe der vorherigen Stufe vor dem Fortfahren
- Explizite Bestanden/Fehlgeschlagen-Kriterien an jedem Handoff einschließen
- Definieren, was zu tun ist, wenn eine Stufe fehlschlägt (wiederholen, überspringen, benachrichtigen)

## Muster 3: Spezialist + Generalist

**Wann:** Eine allgemeine Aufgabe, aber spezifische Teile erfordern tiefe Fachkompetenz.

```
Generalist-Agent (koordiniert)
├── Sicherheitsspezialist-Agent (Auth-Code)
├── Leistungsspezialist-Agent (Datenbankabfragen)
└── UX-Spezialist-Agent (Kopie für Benutzer)
```

```typescript
const [securityReview, perfReview, uxReview] = await Promise.all([
  Agent({
    description: 'Sicherheitsüberprüfung',
    prompt: `Überprüfen Sie diesen Code auf Sicherheitslücken. Konzentrieren Sie sich auf: Auth, Injection, Datenlecks.
    Code: ${authCode}`
  }),
  Agent({
    description: 'Leistungsüberprüfung', 
    prompt: `Überprüfen Sie diese Datenbankabfragen auf Leistungsprobleme. Konzentrieren Sie sich auf: N+1, fehlende Indizes.
    Code: ${dbCode}`
  }),
  Agent({
    description: 'UX-Überprüfung',
    prompt: `Überprüfen Sie diesen Text auf Klarheit und Konvertierung. Konzentrieren Sie sich auf: CTA-Text, Fehlermeldungen.
    Text: ${uiCopy}`
  })
])

// Erkenntnisse zusammenführen
const synthesis = await Agent({
  prompt: `Kombinieren Sie diese Spezialisten-Reviews in eine priorisierte Aktionsliste:
  Sicherheit: ${securityReview}
  Leistung: ${perfReview}
  UX: ${uxReview}`
})
```

## Muster 4: Redundante Überprüfung

**Wann:** Korrektheit ist kritisch und Fehler sind teuer.

```typescript
// Gleiche Aufgabe, zwei unabhängige Agenten, Ausgaben vergleichen
const [agent1Result, agent2Result] = await Promise.all([
  Agent({ prompt: reviewPrompt }),
  Agent({ prompt: reviewPrompt })
])

// Übereinstimmung vergleichen
if (agent1Result.verdict !== agent2Result.verdict) {
  // Uneinigkeit — auf Person eskalieren oder dritten Agenten als Schiedsrichter verwenden
  const tiebreaker = await Agent({
    prompt: `Zwei Prüfer waren sich uneinig. Führen Sie zusammen:
    Prüfer 1: ${agent1Result}
    Prüfer 2: ${agent2Result}
    Geben Sie die korrekte Schlussfolgerung an.`
  })
}
```

**Wann verwenden:** Sicherheitsüberprüfungen, rechtliche Risikobewertungen, Finanzberechnungen, medizinische Informationen.

## Muster 5: Map-Reduce

**Wann:** Großen Datensatz parallel verarbeiten, dann aggregieren.

```typescript
// Map: jedes Segment unabhängig verarbeiten
const chunks = splitIntoChunks(largeDocument, chunkSize)
const chunkResults = await Promise.all(
  chunks.map(chunk => Agent({
    model: 'haiku',
    prompt: `Extrahieren Sie Schlüsselentitäten und Aussagen aus diesem Abschnitt: ${chunk}`
  }))
)

// Reduce: alle Segmentergebnisse aggregieren
const finalSummary = await Agent({
  model: 'sonnet',
  prompt: `Synthetisieren Sie diese Abschnittsanalysen zu einer einheitlichen Zusammenfassung:
  ${chunkResults.join('\n\n')}`
})
```

## Best Practices für Agent-Kommunikation

**Für Zustandslosigkeit entwerfen:**
- Jeder Agent erhält all den Kontext, den er in der Aufforderung benötigt
- Agenten teilen keinen Speicher oder Status zwischen Aufrufen
- Ausgabe ist der einzige Kommunikationskanal zwischen Agenten

**Explizite Ausgabeverträge:**
```typescript
// Sagen Sie Agenten genau, welches Format zu ausgeben ist
prompt: `
Analysieren Sie diesen Code auf Fehler.

Geben Sie NUR gültiges JSON in diesem genauen Format aus:
{
  "bugs": [{"severity": "high|medium|low", "description": "string", "line": number}],
  "summary": "string"
}
`

// Dann die Ausgabe validieren
const result = outputSchema.parse(JSON.parse(agentOutput))
```

**Fehlerbehandlung:**
```typescript
try {
  const result = await Agent({ prompt })
  return parseOutput(result)
} catch (error) {
  // Agent ist fehlgeschlagen — entscheiden: wiederholen, Fallback, oder eskalieren
  if (isRetryable(error)) {
    return await retryWithBackoff(() => Agent({ prompt }), 3)
  }
  throw new AgentError(`Agent für Aufgabe fehlgeschlagen: ${taskDescription}`, { cause: error })
}
```

## Kostenverwaltung

- Verwenden Sie Haiku für Extraktion, Übersetzung, Klassifikation (hohes Volumen, einfache Aufgaben)
- Verwenden Sie Sonnet für Denken, Schreiben, Analyse (Standard für die meisten Aufgaben)
- Verwenden Sie Opus für kritische Entscheidungen, komplexe Code-Überprüfung (nur hohe Einsätze)
- Teure Agenten nur einmal ausführen — Ausgaben cachen oder speichern

---
