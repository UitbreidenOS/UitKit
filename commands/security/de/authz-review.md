---
description: Überprüfen Sie die Autorisierungslogik auf Privilege-Escalation, fehlerhafte Zugriffskontrolle und IDOR-Schwachstellen
argument-hint: "[file or module]"
---
Überprüfen Sie die Autorisierungs- und Zugriffskontrollimplementierung in `$ARGUMENTS` (Standard: gesamte Codebasis) auf fehlerhafte Zugriffskontrolle, Privilege-Escalation-Pfade und IDOR-Anfälligkeiten.

**1. Modellieren Sie das Berechtigungssystem**

Identifizieren und dokumentieren Sie:
- Authentifizierungsmechanismus (Session, JWT, API-Schlüssel, OAuth)
- Rollen-/Berechtigungsdefinitionen — wo sie gespeichert und geladen werden
- Middleware oder Dekoratoren, die Autorisierung durchsetzen (z. B. `@require_permission`, `isAdmin`-Guards)
- Ressourcen, die geschützt sind, und solche, die nicht geschützt sind

**2. Überprüfen Sie auf fehlerhafte Zugriffskontrolle (OWASP A01)**

- Werden Autorisierungsprüfungen konsistent angewendet oder nur in einigen Code-Pfaden, die zur gleichen Ressource führen?
- Kann ein Benutzer mit niedrigeren Berechtigungen Endpunkte mit höheren Berechtigungen durch Manipulation der Anfrage erreichen (Methodenüberschreibung, Parametermanipulation, Pfadtraversal)?
- Gibt es Admin-Only-Routes, die sich nur auf ein boolesches Flag in benutzergesteuerten Eingaben verlassen (z. B. `?admin=true`)?
- Blendet das Frontend UI-Elemente für nicht autorisierte Benutzer aus, setzt aber die gleichen Regeln serverseitig nicht durch?

**3. Überprüfen Sie auf IDOR (Insecure Direct Object Reference)**

- Finden Sie jeden Endpunkt, der eine von Benutzern bereitgestellte ID (Pfadparameter, Abfrageparameter, Body-Feld) akzeptiert und einen Datensatz abruft.
- Überprüfen Sie, dass jede Suche eine Eigentums- oder Mitgliedschaftsprüfung enthält — nicht nur dass der Datensatz existiert.
- Markieren Sie Muster wie: `GET /invoices/:id` wobei die Abfrage `SELECT * FROM invoices WHERE id = ?` lautet ohne `AND user_id = current_user`.

**4. Überprüfen Sie auf Privilege-Escalation**

- Kann ein regulärer Benutzer seine eigene Rolle/Berechtigungen durch einen API-Endpunkt ändern?
- Gibt es Mass-Assignment-Anfälligkeiten, bei denen ein `PATCH /users/:id` ein `role`-Feld akzeptiert?
- Gibt es einen Benutzererstell- oder Einladungsablauf, bei dem der Aufrufer beliebige Rollen für das neue Konto festlegen kann?

**5. JWT-/Sitzungsspezifische Überprüfungen** (falls zutreffend)

- Wird der Algorithmus serverseitig validiert? (`alg: none`-Angriff, Algorithmusverwirrung RS256→HS256)
- Werden JWTs bei Ablauf, Aussteller und Audience bei jeder geschützten Route verifiziert?
- Werden Session-Token bei Abmeldung und Passwortänderung ungültig gemacht?

**6. Ausgabe**

Für jeden Fund:
```
[SEVERITY] [file:line] — description
Attack scenario: one sentence explaining how an attacker exploits this
Fix: specific code change or pattern to apply
```

Severity: Critical (direct data breach or account takeover), High (privilege escalation), Medium (info disclosure), Low (defense in depth gap).
