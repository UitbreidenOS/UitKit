# Datenschutzrichtlinien

Wenden Sie diese an, wenn Sie mit persönlichen, sensiblen oder regulierten Daten arbeiten.

## Dataminimierung

- Sammeln Sie nur Daten, für die Sie einen spezifischen, dokumentierten Verwendungszweck haben — "nur für den Fall" zu sammeln ist eine Haftung
- Legen Sie Aufbewahrungsfristen zum Zeitpunkt der Erfassung fest; löschen oder anonymisieren Sie Daten, wenn die Frist abläuft
- Protokollieren Sie keine personenbezogenen Daten (Namen, E-Mails, IP-Adressen, Geräte-IDs), es sei denn, dies ist betrieblich erforderlich — und auch dann begrenzen Sie es
- Bevorzugen Sie die Speicherung eines abgeleiteten Attributs gegenüber dem Rohwert: Altersgruppe statt Geburtsdatum, gehashte ID statt E-Mail

## Klassifizierung

- Klassifizieren Sie alle Datenfelder vor der Speicherung: öffentlich / intern / vertraulich / eingeschränkt
- Eingeschränkte Daten (PII, Zahlungsdaten, Gesundheitsakten) erfordern Verschlüsselung im Ruhezustand und bei der Übertragung
- Speichern Sie Passwörter niemals in wiederherstellbarer Form — verwenden Sie bcrypt, Argon2 oder scrypt mit ausreichendem Kostenfaktor
- Behandeln Sie Sitzungstoken, API-Schlüssel und JWTs als eingeschränkte Daten

## Zugriffskontrolle

- Wenden Sie das Prinzip der geringsten Berechtigung an: Dienste und Benutzer greifen nur auf das zu, was sie benötigen
- Implementieren Sie Sicherheit auf Zeilenebene für Multi-Tenant-Daten — verlassen Sie sich nicht nur auf Filter auf Anwendungsebene
- Audit-Protokoll von Lesezugriffen auf sensible Einträge: wer hat wann auf was zugegriffen
- Widerrufen Sie den Zugriff sofort bei Rollenänderung oder Ausscheiden — warten Sie nicht auf den nächsten Provisioning-Zyklus

## Grenzüberschreitend und Regulatorisch

- Kennen Sie die geltenden Vorschriften: GDPR (EU-Einwohner), CCPA (Einwohner Kaliforniens), HIPAA (US-Gesundheitsdaten), PCI DSS (Zahlungskarten)
- Rechte von Betroffenen (Zugang, Löschung, Datenübertragbarkeit) müssen umsetzbar sein — gestalten Sie das Schema so, dass Sie alle Daten für einen bestimmten Benutzer finden und löschen können
- Übertragen Sie personenbezogene Daten nicht in Länder ohne angemessene rechtliche Grundlage (SCCs, Angemessenheitsbeschluss)
- Dokumentieren Sie Ihre Datenflüsse: welche Daten wohin gehen, von wem verarbeitet werden, unter welcher rechtlichen Grundlage

## Third-Party-Integrationen

- Überprüfen Sie Datenverarbeiter von Drittanbietern, bevor Sie ihnen personenbezogene Daten senden — überprüfen Sie ihre DPA und Zertifizierungen
- Verwenden Sie Tokenisierung beim Übergeben von Benutzer-IDs an Analyse- oder Anzeigenplattformen — niemals rohe PII
- Beachten Sie Do Not Track / Opt-out-Signale an der Integrationsgrenzen, nicht nur auf der UI-Ebene

## Vorfallreaktion

- Definieren Sie, was einen meldepflichtigen Verstoß darstellt, bevor dieser auftritt
- GDPR erfordert die Benachrichtigung der Aufsichtsbehörde innerhalb von 72 Stunden nach Entdeckung
- Verfügen Sie über ein dokumentiertes Runbook für: Eindämmung, Bewertung, Benachrichtigung und Nachbesprechung
- Versuchen Sie niemals, einen Verstoß zu verbergen — dies verstärkt die rechtliche Haftung

## Testen

- Verwenden Sie synthetische oder anonymisierte Daten in Nicht-Produktionsumgebungen — kopieren Sie niemals PII aus der Produktion zur Inszenierung
- Redaktion oder Maskierung von sensiblen Feldern in Protokollen und Fehlerberichten, bevor sie die Systemgrenze verlassen

