---
description: Generieren Sie typsichere Mocks und Stubs für ein bestimmtes Modul oder Interface
argument-hint: "[module-path-or-interface-name]"
---
Generieren Sie Mocks und Stubs für: $ARGUMENTS

1. Lokalisieren Sie das Ziel — finden Sie die Moduldatei, Klasse oder das in $ARGUMENTS benannte Interface. Lesen Sie es vollständig, um die gesamte Oberfläche zu verstehen: alle exportierten Funktionen, Klassenmethoden und deren Typsignaturen.

2. Erkennen Sie den Mocking-Ansatz des Projekts:
   - Jest: `jest.fn()`, `jest.mock()`, manuelle Mocks in `__mocks__/`
   - Pytest: `unittest.mock.MagicMock`, `pytest-mock` Fixtures
   - Go: Interface-basierte manuelle Mocks oder `mockery`-ähnliche generierte Strukturen
   - TypeScript: bewahren Sie alle generischen Typen; verwenden Sie nicht `any`

3. Generieren Sie Mocks, die:
   - das vollständige Interface implementieren — keine fehlenden Methoden
   - typsicher sind (keine Umwandlung, kein `any` falls nicht das Original `any` verwendet)
   - konfigurierbare Rückgabewerte pro Aufruf über Standard-Mock-APIs haben
   - eine Standard-Implementierung beinhalten, die Nullwerte/leere Strukturen zurückgibt, damit Tests ohne zusätzliches Setup kompilieren
   - Aufrufverfolgung (Aufrufzahl, empfangene Argumente) dort verfügbar machen, wo das Framework dies unterstützt

4. Generieren Sie eine entsprechende Factory oder Fixture, die einen vorkonfigurierten Mock für häufige Testszenarios zurückgibt. Nennen Sie sie `make<Name>Mock` oder folgen Sie der Namenskonvention des Projekts.

5. Platzieren Sie den Mock am korrekten Ort gemäß Projektkonventionen (`__mocks__/`, `mocks/`, `testutil/`, usw.). Falls das Projekt keine Konvention hat, platzieren Sie ihn neben der Quelldatei.

6. Schreiben Sie einen Beispieltest, der demonstriert, wie man den Mock importiert und verwendet, inklusive wie man auf empfangene Aufrufe prüft.

Ausgabe: die Mock-Datei und der Beispieltest. Keine Platzhalter-Methoden.
