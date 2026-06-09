---
description: Führen Sie eine vollständige statische Sicherheitsprüfung für eine Datei oder ein Verzeichnis durch und melden Sie ausnutzbare Sicherheitslücken
argument-hint: "[path]"
---
Führen Sie eine gründliche statische Sicherheitsanalyse von `$ARGUMENTS` durch. Wenn kein Pfad angegeben wird, scannen Sie den gesamten Arbeitsbaum.

Schritte:

1. **Angriffsfläche auflisten**: Listen Sie alle Einstiegspunkte auf — HTTP-Handler, CLI-Argumente, Dateileser, IPC, Umgebungsvariablen, Deserialisierung.

2. **Auf Schwachstelle-Klassen scannen** — für jeden Fund melden Sie: Datei, Zeile, Schweregrad (CRITICAL / HIGH / MEDIUM / LOW), CWE-ID und Einzeiler-Beschreibung:
   - Injection: SQL, NoSQL, LDAP, Command, Template, Header
   - Broken Authentication: hardcodierte Anmeldedaten, schwache Token-Generierung, fehlende Ablaufzeit
   - Sensitive Data Exposure: Secrets im Quellcode, unverschlüsselte Speicherung, ausführliche Fehlermeldungen
   - Insecure Deserialization: pickle, YAML load, eval-basierte Parser
   - Broken Access Control: fehlende Autorisierungsprüfungen, IDOR-Muster, Pfadtraversal
   - Security Misconfiguration: Debug-Flags, permissives CORS, Verzeichnisauflistung
   - XSS / CSRF: reflektiert, gespeichert, DOM-basiert; fehlende CSRF-Token
   - Vulnerable Components: Importe, die bekanntermaßen von CVE betroffen sind (für dep-audit kennzeichnen)
   - SSRF: benutzergesteuerte URLs, die serverseitig abgerufen werden
   - XXE: XML-Parser mit aktivierten externen Entities

3. **Triagieren und ordnen**: Sortieren Sie alle Funde nach Schweregrad und dann nach Ausnutzbarkeit. Kennzeichnen Sie alles, das ohne Authentifizierung ausnutzbar ist, als CRITICAL, unabhängig von der CVSS-Basis.

4. **Für jeden CRITICAL- und HIGH-Fund geben Sie an**:
   - Minimal-Szenario für Proof-of-Concept-Exploit (kein funktionierender Exploit-Code — beschreiben Sie den Vektor)
   - Empfohlene Behebung mit korrigiertem Code-Snippet

5. **Ausgabeformat**:
   ```
   ## Security Scan: <path>

   ### Summary
   CRITICAL: N | HIGH: N | MEDIUM: N | LOW: N

   ### Findings
   [severity] [CWE-XXX] file:line — description
   Fix: ...

   ### Deferred (MEDIUM/LOW)
   Bullet list only — no fix detail
   ```

Schließen Sie Funde nicht ein, bei denen Sie sich unsicher sind. Bevorzugen Sie Genauigkeit gegenüber Rückruf — ein bestätigter Critical schlägt zehn spekulative Lows.
