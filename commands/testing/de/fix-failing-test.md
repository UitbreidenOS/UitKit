---
description: Fehlerhafte Tests diagnostizieren und beheben, wobei die Grundursache vor dem Patchen ermittelt wird
argument-hint: "[test-name-or-file]"
---
Beheben Sie den fehlgeschlagenen Test: $ARGUMENTS

Ändern Sie den Test oder die Implementierung erst, nachdem Sie die Grundursache diagnostiziert haben.

Schritt 1 — Führen Sie den fehlgeschlagenen Test isoliert aus und erfassen Sie die vollständige Fehlerausgabe einschließlich Stack Trace.

Schritt 2 — Klassifizieren Sie den Fehler:
- Assertion-Fehler: Das Code-Verhalten hat sich geändert oder die Assertion war von Anfang an falsch
- Setup-/Teardown-Problem: Gemeinsamer Zustand leckt zwischen Tests, fehlender Mock-Reset, falsche Reihenfolge
- Umgebungsproblem: Fehlende Umgebungsvariable, falsches Arbeitsverzeichnis, nicht initialisierte DB/Service
- Typ- oder Importfehler: Signatur geändert, Modulpfad falsch, fehlende Abhängigkeit
- Timing-/Async-Problem: Ungelöstes Promise, fehlender await, Race Condition

Schritt 3 — Verfolgen Sie den Fehler bis zu seiner Quelle zurück. Lesen Sie die getestete Implementierung. Lesen Sie alle beteiligten Mocks oder Fixtures. Verstehen Sie, was der Test ursprünglich überprüfen sollte.

Schritt 4 — Bestimmen Sie, wer schuld ist:
- Wenn die Implementierung einen echten Fehler durch eine kürzliche Änderung hat, beheben Sie die Implementierung und behalten Sie den Test.
- Wenn der Test schon immer falsches Verhalten überprüft hat, beheben Sie den Test.
- Wenn der Test etwas überprüft, das sich absichtlich geändert hat (Spezifikation geändert), aktualisieren Sie den Test und notieren Sie die Spezifikationsänderung.

Schritt 5 — Wenden Sie die minimale Korrektur an. Refaktorisieren Sie nicht den umgebenden Code. Ändern Sie keine nicht zusammenhängenden Assertions.

Schritt 6 — Führen Sie die vollständige Test-Suite für das betroffene Modul aus, um zu bestätigen, dass keine Regressionen eingeführt wurden.

Bericht: Klassifizierung der Grundursache, was Sie geändert haben und warum.
