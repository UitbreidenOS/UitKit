---
description: Entwerfen Sie einen Architektur- oder technischen Entscheidungsdatensatz (ADR) aus einer Beschreibung
argument-hint: "[decision topic and context]"
---
Entwurf eines Entscheidungsdokuments für folgende Angaben: $ARGUMENTS

Verwenden Sie diese Struktur:

**Status:** Vorgeschlagen | Akzeptiert | Veraltet | Ersetzt  
(Standardmäßig auf „Vorgeschlagen" setzen, sofern $ARGUMENTS nichts anderes angibt.)

**Kontext**  
Welche Situation erzwingt jetzt eine Entscheidung. Fügen Sie Einschränkungen, bisherige Arbeiten und die Gründe für die Unzulänglichkeit des Status quo ein. 3–6 Sätze.

**Entscheidung**  
Ein Absatz. Treffen Sie die Entscheidung direkt im ersten Satz. Verstecken Sie nicht die Kernaussage.

**Betrachtete Optionen**

Für jede Option (2–4 insgesamt, einschließlich der gewählten):
- **Option N: [Name]** — einzeilige Beschreibung
  - Vorteil: ...
  - Vorteil: ...
  - Nachteil: ...
  - Nachteil: ...

**Konsequenzen**

Positive Konsequenzen (was verbessert wird oder möglich wird).  
Negative Konsequenzen / Kompromisse (was schwieriger wird, was verloren geht).  
Risiken (was schiefgehen könnte, und Abschwächung, falls bekannt).

**Bedingungen für Überprüfung**  
Aufzählung: spezifische Bedingungen, unter denen diese Entscheidung überprüft werden sollte. Seien Sie konkret — nicht „wenn sich Anforderungen ändern", sondern „wenn das Anfragevolumen 10.000/s übersteigt" oder „wenn Anbieter X API Y einstellt".

Regeln:
- Schreiben Sie für einen Leser, der dieses Dokument in 18 Monaten ohne andere Kontexte liest.
- Empfehlen Sie nicht die „offensichtlich richtige" Option ohne reale Nachteile aufzulisten.
- Füllen Sie nicht mit Hintergrund, der für einen erfahrenen Ingenieur Allgemeinwissen ist.
- Wenn $ARGUMENTS nicht genug Kontext bietet, um echte Optionen zu benennen, nennen Sie die zwei häufigsten Industriealternativen und beachten Sie, dass der Leser diese validieren sollte.
- Halten Sie die Gesamtlänge unter 600 Wörtern, sofern die Entscheidung nicht ungewöhnlich komplex ist.

Geben Sie nur das Dokument aus.
