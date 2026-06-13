> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../testing.md).

# Test-Regeln

Relevante Abschnitte in die `CLAUDE.md` des Projekts kopieren.

---

## Was testen

- Verhalten über öffentliche APIs testen — nicht interne Implementierungsdetails
- Tests müssen Refactoring überleben: wenn das Umbenennen einer privaten Funktion Tests bricht, sind die Tests falsch
- Edge Cases testen: null/leere Eingaben, Grenzwerte, Fehlerpfade
- Framework-Code oder Sprach-Builtins nicht testen

## Test-Struktur

- Eine logische Assertion pro Test — wenn ein Test mehrere nicht zusammenhängende Dinge prüft, aufteilen
- Testnamen beschreiben WAS das System tut, nicht WIE: `"returns 404 when user not found"` nicht `"test findUser"`
- Arrange → Act → Assert — je ein Block, kein Durchmischen
- Keine Bedingungslogik in Tests — wenn ein `if` benötigt wird, zwei Tests schreiben

## Mocking

- Interne Module nicht mocken — nur an Systemgrenzen mocken (externe APIs, Datenbanken, Dateisystem)
- Die Klasse/das Modul, das getestet wird, niemals mocken
- Integrationstests müssen die echte Datenbank treffen — Test-Datenbank verwenden, keine Mocks
- Wenn ein Unit-Test 5+ Mocks benötigt, ist der Code wahrscheinlich nicht gut strukturiert

## Abdeckung

- Abdeckung ist ein Minimum, kein Ziel — 80% Abdeckung mit schlechten Tests ist schlechter als 60% mit guten Tests
- Jedes neue Feature benötigt mindestens einen Happy-Path-Test und einen Error-Path-Test
- Jeder Bugfix benötigt einen Regressionstest, der den Bug erkannt hätte

## Testdaten

- Factories oder Fixtures verwenden — niemals User-IDs, E-Mails oder UUIDs in Tests hardcoden
- Tests müssen isoliert sein — kein gemeinsamer veränderbarer State zwischen Tests
- Tests müssen deterministisch sein — keine Zufallsdaten, keine zeitabhängigen Assertions ohne Mockierung der Uhr
- Nach jedem Test bereinigen — Tabellen abschneiden, Mocks zurücksetzen, erstellte Dateien löschen

---
