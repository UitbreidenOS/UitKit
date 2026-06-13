# /goal — Autonome Task-Vervollständigung

## Wann aktivieren
Benutzer möchte, dass Claude weiterarbeitet, ohne zu überprüfen; Benutzer möchte eine Fertigstellungsbedingung setzen und weggehen; Benutzer fragt nach autonomer Bedienung oder wie Claude laufen gelassen wird, bis ein bestimmtes Ergebnis erreicht ist.

## Wann NICHT verwenden
Einfache Single-Step-Aufgaben, bei denen eine Antwort ausreichend ist; Aufgaben, bei denen der Benutzer möchte, dass Claude nach jeder Aktion pausiert und bestätigt; interaktive Debug-Sitzungen, bei denen das Hin und Her der Sinn ist.

## Anweisungen

**Syntax :**
```
/goal <Fertigstellungsbedingung>
```

Die Bedingung wird nach jedem Assistent-Turn bewertet. Claude arbeitet weiter — schreibt Code, führt Befehle aus, sieht Fehler, passt sich an — bis die Bedingung erfüllt ist, dann hält an und rapportiert.

**Gute Bedingungen schreiben :**

Natürliche Sprache funktioniert. Die Bedingung sollte beobachtbar und eindeutig sein :

- `Alle Tests bestehen` — Claude führt die Test-Suite aus, behebt Fehler, führt erneut aus, bis grün
- `Der PR wird erstellt` — Claude beendet die Arbeit und öffnet einen PR
- `Die Migration wird fehlerfrei ausgeführt` — Claude wendet die Migration an, prüft auf Fehler, behebt Schema-Probleme
- `tsc --noEmit beendet mit 0` — Claude behebt TypeScript-Fehler, bis der Compiler sauber ist
- `CHANGELOG.md existiert und hat das heutige Datum` — Claude schreibt die Changelog-Datei

**Schlechte Bedingungen zum Vermeiden :**
- Subjektiv: "sieht gut aus", "ist sauber" — nicht von Claude verifizierbar
- Offen: "verbessern Sie Code weiterhin" — keine Stoppbedingung
- Zeitbasiert: "eine Stunde laufen" — kein Ergebnis

**Mit Effort-Level kombinieren** für maximale Autonomie :
```
/goal Alle Tests bestehen
/effort xhigh
```

**Unterbrechen :** Senden Sie eine beliebige Nachricht zum Unterbrechen, oder löschen Sie `.claude/goal` zum Abbrechen. Der Goal-Status bleibt über Kontextkompressionen hinweg bestehen — Claude merkt sich das Goal auch nach Fenster-Kompression.

**Hintergrund-Sessions :** Funktioniert mit `claude --bg`. Goal setzen, Terminal schließen, zurückkommen wenn fertig.

**Was bei jedem Turn passiert :**
1. Claude ergreift Maßnahmen (bearbeitet Dateien, führt Befehle aus)
2. Bewertet: Ist die Bedingung erfüllt?
3. Wenn nein — setzt fort
4. Wenn ja — hält an und rapportiert, was getan wurde

## Beispiel

```
/goal Alle TypeScript-Fehler sind behoben und tsc --noEmit beendet mit 0
```

Claude führt `tsc --noEmit` aus, liest die Fehlerliste, behebt jeden Fehler, führt erneut aus, sieht verbleibende Fehler, behebt diese, führt erneut aus — Schleife läuft weiter bis null Fehler. Hält dann an und rapportiert: "Behoben 14 TypeScript-Fehler über 6 Dateien. `tsc --noEmit` beendet sauber."

---
