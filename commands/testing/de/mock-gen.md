---
description: Generiere typsichere Mocks und Stubs für ein gegebenes Modul oder Interface
argument-hint: "[module-path-or-interface-name]"
---
Generiere Mocks und Stubs für: $ARGUMENTS

1. Lokalisiere das Ziel — finde die Moduldatei, Klasse oder das Interface mit dem Namen aus $ARGUMENTS. Lese die Datei vollständig, um die gesamte Oberfläche zu verstehen: alle exportierten Funktionen, Klassenmethoden und ihre Typ-Signaturen.

2. Erkenne den Mock-Ansatz des Projekts:
   - Jest: `jest.fn()`, `jest.mock()`, manuelle Mocks in `__mocks__/`
   - Pytest: `unittest.mock.MagicMock`, `pytest-mock` Fixtures
   - Go: Interface-basierte manuelle Mocks oder `mockery`-artige generierte Structs
   - TypeScript: bewahre alle generischen Typen; verwende nicht `any`

3. Generiere Mocks, die:
   - Das vollständige Interface implementieren — keine fehlenden Methoden
   - Typsicher sind (keine Typkonvertierungen, kein `any` außer wenn das Original `any` verwendet)
   - Pro Aufruf konfigurierbare Rückgabewerte über Standard-Mock-APIs haben
   - Eine Standard-Implementierung enthalten, die Null-Werte / leere Structs zurückgibt, damit Tests ohne zusätzliches Setup kompilieren
   - Call-Tracking (Aufrufzahl, empfangene Argumente) offenlegen, wo das Framework es unterstützt

4. Generiere eine entsprechende Factory oder Fixture, die einen vorkonfigurierten Mock für gängige Test-Szenarien zurückgibt. Benenne es `make<Name>Mock` oder folge der Namenskonvention des Projekts.

5. Platziere den Mock an der korrekten Stelle gemäß Projektkonventionen (`__mocks__/`, `mocks/`, `testutil/`, usw.). Falls das Projekt keine Konvention hat, platziere ihn neben der Quelldatei.

6. Schreibe einen Beispieltest, der zeigt, wie man den Mock importiert und verwendet, einschließlich wie man auf empfangene Aufrufe prüft.

Output: die Mock-Datei und der Beispieltest. Keine Platzhalter-Methoden.
