# Kontextmanagement-Leitfaden

So verwalten Sie Claudios Kontextfenster effektiv — halten Sie Sitzungen fokussiert, verhindern Sie Kontextbloat und wahren Sie die Qualität über lange Arbeitssitzungen.

## Das Kontextfenster verstehen

Claude Code hat ein endliches Kontextfenster. Während Sie arbeiten, wächst die Konversation:
- Jeder Werkzeugaufruf und sein Ergebnis werden dem Kontext hinzugefügt
- Jede Dateilesung wird dem Kontext hinzugefügt
- Jede Codeänderung wird im Kontext verfolgt
- Lange Konversationen erreichen schließlich Grenzen und werden automatisch zusammengefasst

**Zeichen, dass Sie Kontextgrenzen erreichen:**
- Claude beginnt, frühere Entscheidungen zu vergessen
- Antworten werden weniger spezifisch für Ihr Projekt
- Auto-Kompaktierung aktiviert sich (fasst älteren Kontext zusammen)
- Claude fragt nach Informationen, die er bereits hat

## Sitzungen fokussiert halten

**Eine Sitzung = eine Aufgabe.** Verwenden Sie nicht die gleiche Claude Code-Sitzung für mehrere unabhängige Aufgaben.

```bash
# Falsch: eine Sitzung für alles
claude
# (erstellt Feature, behebt dann unabhängigen Bug, schreibt dann Docs, überprüft dann PR)

# Richtig: separate Sitzungen pro Aufgabe
claude "Benutzerauthentifizierung implementieren"  # Sitzung 1
claude "Payment-Timeout-Bug beheben"    # Sitzung 2
claude "API-Dokumentation schreiben"        # Sitzung 3
```

**Warum:** Kontext aus Aufgabe 1 verschmutzt Aufgabe 3. Claude Code funktioniert besser, wenn der Kontext relevant ist.

## Kontext effizient vorbeladen

Anstatt Claudios Codebasis durch Lesevorgänge entdecken zu lassen:

```bash
# CLAUDE.md-Datei zu Ihrem Projekt hinzufügen
# Claude liest dies beim Sessionstart — es wird zu Ihrem persistenten Kontext
cat CLAUDE.md
```

Ein gutes `CLAUDE.md` enthält:
- Projektbeschreibung (2-3 Sätze)
- Wichtige Verzeichnisse und deren Inhalte
- Wichtige Konventionen (Naming, Muster, Entscheidungen)
- Dinge, die NICHT ohne Nachfragen geändert werden dürfen
- Häufige Befehle (wie Tests ausgeführt werden, Build, etc.)

Dies ersetzt Dutzende explorativer Dateilesung durch eine strukturierte Kontextladung.

## Verwenden Sie den `/compact`-Befehl

Wenn eine Sitzung lang wird:
```
/compact
```

Dies fasst die frühere Konversation in eine kürzere Darstellung zusammen, wodurch Kontextfensterplatz freigegeben wird, ohne die Schlüsseleentscheidungen und den Kontext zu verlieren.

**Verwenden Sie Compact, wenn:**
- Sie eine Hauptteilaufgabe in einer längeren Sitzung abgeschlossen haben
- Der Kontext mit Exploration vollgestopft wirkt, die nicht mehr relevant ist
- Sie eine neue Arbeitsphase in der gleichen Sitzung starten werden

## Strategisches Dateilesen

Claude liest Dateien in den Kontext — seien Sie selektiv:

```
# Zu breit:
"Alle Dateien im Auth-Modul lesen"

# Besser:
"src/auth/jwt.ts und src/middleware/auth.ts lesen — ich möchte die JWT-Implementierung verstehen"
```

Bitten Sie Claude, Dateien zusammenzufassen, anstatt sie zu lesen, wenn Sie Verständnis benötigen:
```
"Ohne die Datei zu lesen, basierend auf ihrem Namen und den Imports, die Sie sehen können, was macht src/services/email.ts wahrscheinlich?"
```

## Worktrees für langfristige Isolation

Für Aufgaben, die sich über Tage erstrecken, verwenden Sie Git Worktrees:
```bash
git worktree add ../project-feature feature/my-feature
cd ../project-feature
claude "an der Benutzerauthentifizierungsfunktion arbeiten"
```

Jede Worktree = ihre eigene Claude Code-Sitzung mit ihrem eigenen sauberen Kontext.

## Die `/lean-claude`-Fähigkeit

Laden Sie `/lean-claude` am Anfang jeder Sitzung, um Token-effiziente Modi zu aktivieren:
- Kürzere, prägnantere Antworten
- Weniger wiederholte Informationen
- Direkte Antworten ohne Vorspiel

```bash
npx claudient add skills productivity
# Dann in Claude Code:
/lean-claude
```

## Wiederherstellung aus einer veralteten Sitzung

Wenn Claude frühere Kontexte aus den Augen verliert:

1. **Neustart mit Zusammenfassungsaufforderung:**
   ```
   "Lassen Sie mich Sie darauf aufmerksam machen, was wir getan haben. [Zusammenfassung der Schlüsseleentscheidungen, aktueller Status, nächste Schritte]"
   ```

2. **Verwenden Sie `/compact`**, um zu verdichten und neu zu fokussieren

3. **Neuer Start mit vorgeladenem Kontext:**
   ```bash
   # Sitzung beenden, neue starten
   claude "Ich arbeite weiter an [Feature]. Hier ist der Kontext: [kurze Zusammenfassung]. Der aktuelle Status ist [beschreiben]. Der nächste Schritt ist [spezifische Aufgabe]."
   ```

## Multi-Datei-Kontextstrategien

Wenn über viele Dateien gearbeitet wird:

```
# Anstelle von: "Alle 15 Dateien in diesem Modul lesen"
# Tun: "Ich arbeite am Payment-Modul. Die Schlüsseldateien sind payments.service.ts (behandelt Ladelogik), payments.controller.ts (Routen) und payments.dto.ts (Typen). Lesen Sie zuerst nur diese drei."
```

Lesen Sie dann zusätzliche Dateien nur bei Bedarf, nicht spekulativ.

## Token-Kostenbewusstsein

Längerer Kontext = höhere Kosten pro Anfrage. Strategien zur Kostenreduzierung:
- Verwenden Sie `/lean-claude` für Token-effizienten Modus
- Große Aufgaben in mehrere fokussierte Sitzungen aufteilen
- Vermeiden Sie das erneute Lesen von unveränderten Dateien
- Verwenden Sie `CLAUDE.md`, um stabilen Kontext billig vorzuladen

---
