> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../security.md).

# Sicherheitsregeln

Relevante Abschnitte in die `CLAUDE.md` des Projekts kopieren.

---

## Secrets

- Niemals Secrets im Quellcode — nicht in Kommentaren, nicht in Testdateien, nicht in Beispielkonfigurationen
- Niemals Secrets protokollieren — prüfen, dass Logger-Aufrufe keine `password`-, `token`-, `key`-, `secret`- oder `credential`-Felder enthalten
- Umgebungsvariablen für alle Secrets verwenden; beim Start lesen und ihre Existenz validieren
- Secrets rotieren, die versehentlich committet wurden — jeden committeten Secret als kompromittiert behandeln

## Eingabevalidierung

- Alle Eingaben an Systemgrenzen validieren: API-Parameter, Query-Strings, Request-Bodies, Datei-Uploads, Umgebungsvariablen
- Typ, Format, Länge und Bereich validieren — nicht nur Vorhandensein
- Eine Allowlist (gültige Werte) anstelle einer Denylist (blockierte Werte) verwenden, wo möglich
- Niemals Benutzereingaben direkt in SQL-Abfragen, Shell-Befehlen, Dateipfaden oder HTML ohne Bereinigung verwenden

## Authentifizierung und Autorisierung

- Authentifizierung bei jeder Anfrage prüfen, die sie erfordert — niemals auf Frontend-Routing verlassen
- Autorisierung (Benutzer kann DIESE Aktion durchführen) separat von Authentifizierung (Benutzer ist angemeldet) prüfen
- Autorisierungsprüfungen müssen den authentifizierten Benutzer aus dem Anfrage-Kontext referenzieren — niemals aus einem Query-Parameter
- Token-Ablauf muss serverseitig erzwungen werden — niemals client-seitig bereitgestellte Token-Zeitstempel vertrauen

## Datenbanken

- Parametrisierte Abfragen oder ORM verwenden — niemals SQL durch String-Verkettung erstellen
- Datenbankbenutzer müssen Mindestberechtigungen haben — App-Benutzer sollte keinen DDL-Zugriff haben
- Interne Datenbankfehler niemals an Clients weitergeben — serverseitig protokollieren, generischen Fehler an den Client zurückgeben

## Abhängigkeiten

- Abhängigkeitsversionen pinnen — niemals `*` oder `latest` in der Produktion verwenden
- `npm audit` / `pip-audit` / `govulncheck` vor jedem Release ausführen
- Nicht verwendete Abhängigkeiten entfernen — jede Abhängigkeit ist eine potenzielle Angriffsfläche
- Quellcode neuer Abhängigkeiten prüfen, bevor sie hinzugefügt werden

---
