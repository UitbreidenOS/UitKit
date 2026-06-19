---
name: prune-context
description: "Claude Code Kontext-Pruner: Slash-Befehl zur Zusammenfassung der Sitzung und Zurücksetzung des Token-Overheads"
updated: 2026-06-19
---

# Kontext-Pruner (Context Pruner)

## Wann aktivieren
Aktivieren Sie diesen Befehl, wenn der Benutzer `/prune-context` ausführt, wenn der Token-Verbrauch der Sitzung hoch ist oder das Kontextfenster in einer langen Sitzung überfüllt ist.

## Wann NICHT verwenden
Nicht zu Beginn einer Sitzung oder für einfache Abfragen verwenden, die keine Zustandspersistenz oder Kontextreduzierung erfordern.

## Anweisungen
1. Pausieren Sie aktuelle Aufgaben und überprüfen Sie den Konversationsverlauf der aktiven Sitzung.
2. Fassen Sie die Sitzung in einen stark kondensierten, Token-effizienten Zustand zusammen:
   - **Aktives Ziel**: Das aktuelle übergeordnete Ziel, an dem Sie arbeiten.
   - **In der Sitzung abgeschlossen**: Eine prägnante Liste der abgeschlossenen Änderungen, Tests und Dateien.
   - **Wichtiger Architekturkontext**: Entscheidende Projektdetails, APIs oder Dateien, die während der Sitzung entdeckt wurden.
   - **Nächste Schritte**: Eine explizite Checkliste der Aufgaben, die als nächstes anstehen.
3. Schreiben Sie diese Zusammenfassung in `.claude/pruned_context.md`.
4. Geben Sie die Zusammenfassung im Chat aus, damit der Benutzer sie sehen kann.
5. Weisen Sie den Benutzer an, den Befehl `/clear` auszuführen, um das Kontextfenster zurückzusetzen und den Token-Overhead zu löschen.
6. Geben Sie den Befehl oder Text an, den er nach dem Zurücksetzen eingeben soll, um fortzufahren: *"Bitte führen Sie jetzt `/clear` aus, um den Speicher zurückzusetzen. Sobald er gelöscht ist, fordern Sie mich mit: 'Resume from `.claude/pruned_context.md`' auf, diesen Zustand wiederherzustellen."*

## Beispiel
Benutzer: `/prune-context`
Claude:
Kontext-Pruning gestartet, um den Token-Overhead zu reduzieren.
[Claude schreibt die Zusammenfassung in .claude/pruned_context.md]

### Snapshot der aktuellen Sitzung
- **Aktives Ziel**: README-Dokumentation umstrukturieren und Fail-Fast-Regeln hinzufügen.
- **Abgeschlossen**: Erstellung von `rules/common/fail-fast.md` und `hooks/post-tool-use/fail-fast.sh`.
- **Wichtiger Kontext**: Der Compiler wird über `npm test` ausgeführt und erfordert eine spezifische Git-Autorenkonfiguration.
- **Nächste Schritte**: Plan-First Pre-Tool-Use Hook implementieren.

Zustand unter `.claude/pruned_context.md` gespeichert.
Bitte führen Sie jetzt `/clear` aus, um den Speicher zurückzusetzen und den Token-Overhead zu löschen. Sobald er gelöscht ist, fordern Sie mich mit: `Resume from .claude/pruned_context.md` auf, diesen Zustand wiederherzustellen.
