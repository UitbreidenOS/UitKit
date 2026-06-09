# Regeln zur Secrets-Verwaltung

Anwenden, wenn Code API-Schlüssel, Passwörter, Token, Zertifikate oder Anmeldeinformationen verarbeitet.

## Diese Dinge darf man nie tun

- Geben Sie Secrets niemals an die Versionskontrolle ein – nicht einmal in privaten Repositories, nicht einmal vorübergehend
- Codieren Sie Secrets niemals als String-Literale in Quellcode
- Speichern Sie Secrets niemals in Umgebungsvariablendateien (`.env`), die in Git eingecheckt sind
- Protokollieren Sie Secrets niemals – nicht beim Start, nicht in Debug-Ausgaben, nicht in Fehlermeldungen
- Übertragen Sie Secrets niemals in URLs oder Abfrageparametern – sie landen in Zugriffslogs und im Browserverlauf

## Wo Secrets gespeichert werden

- Verwenden Sie in allen Produktionsumgebungen einen dedizierten Secrets-Manager: AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault oder Azure Key Vault
- Injizieren Sie Secrets zur Laufzeit über Umgebungsvariablen aus dem Secrets-Manager – nicht über Dateien, die in Container-Images gebacken sind
- Für die lokale Entwicklung: `.env`-Dateien sind akzeptabel, müssen aber in `.gitignore` aufgeführt sein; stellen Sie eine `.env.example` mit Platzhalterwerten bereit
- CI/CD-Pipelines: Verwenden Sie den Geheimnisspeicher der Plattform (GitHub Actions secrets, GitLab CI variables); geben Sie sie niemals in Logs aus

## Rotation

- Alle Secrets müssen einen definierten Rotationsplan haben – API-Schlüssel rotieren mindestens jährlich, Datenbankpasswörter mindestens vierteljährlich
- Entwerfen Sie Services so, dass sie einen neuen Secret ohne Ausfallzeiten akzeptieren: unterstützen Sie duale Credential-Fenster während der Rotation
- Automatisieren Sie die Rotation, wenn der Anbieter dies unterstützt; manuelle Rotation ist fehleranfällig
- Widerrufen Sie kompromittierte Anmeldeinformationen sofort – bevor Sie den Umfang des Lecks untersuchen

## Zugriffskontrolle

- Gewähren Sie das Prinzip der geringsten Berechtigung: Ein Secret ist auf den Service beschränkt, der es benötigt, nicht über Services hinweg gemeinsam genutzt
- Verwenden Sie separate Anmeldeinformationen pro Umgebung (Entwicklung, Staging, Produktion) – teilen Sie Production Secrets niemals
- Überprüfen Sie, wer und was Zugang zu jedem Secret hat; überprüfen Sie vierteljährlich
- Service-to-Service-Authentifizierung: Verwenden Sie kurzfristige Token (OIDC Workload Identity, IAM Roles) anstelle von statischen API-Schlüsseln, wenn möglich

## Erkennung

- Aktivieren Sie die Secrets-Erkennung in CI (GitHub secret scanning, GitLeaks, truffleHog) – brechen Sie die Pipeline bei einem Hit ab
- Scannen Sie die Git-Historie, wenn Sie dies für ein bestehendes Repository aktivieren – gehen Sie davon aus, dass Secrets, die historisch eingecheckt wurden, kompromittiert sind
- Richten Sie Warnungen für anormale Nutzung von Anmeldeinformationen in der Produktion ein (ungewöhnliche Aufrufvolumina, neue Quell-IPs)

## Wenn ein Secret geleakt wird

1. Widerrufen Sie die Anmeldeinformationen sofort – warten Sie nicht auf die Untersuchung
2. Überprüfen Sie die Zugriffslogs für die Gültigkeitsdauer der Anmeldeinformationen
3. Rotieren Sie alle Secrets, die durch denselben Breach-Vektor offengelegt worden sein könnten
4. Entfernen Sie das Secret aus der Git-Historie mit `git filter-repo`; erzwingen Sie Push; benachrichtigen Sie alle Forks
