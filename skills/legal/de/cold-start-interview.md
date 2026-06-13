# Kaltstart-Interview — Rechtliches Plugin-Setup

## Wann aktivieren

- Erste Verwendung einer rechtlichen Kompetenz für eine neue Organisation
- Die Ausgabe des Rechts-Plugins enthält `[PLACEHOLDER]` Markierungen
- Die Ausgabe ist zu allgemein und nicht praxisspezifisch
- Onboarding eines neuen rechtlichen Teams zu Claude Code

**Warum dies wichtig ist :** Das Kaltstart-Interview ist der häufigste Hebelpunkt für die Qualität rechtlicher Kompetenzen. Eine generische Ausgabe ist fast immer auf ein übersprungenes oder unvollständiges Interview zurückzuführen. Ein 10–15 Minuten langes Interview verwandelt jede nachgelagerte Kompetenz von generisch zu praxisspezifisch.

## Wann NICHT verwenden

- Interview ist bereits abgeschlossen und ein Organisationsprofil existiert — überprüfen Sie `~/.claude/plugins/config/legal/company-profile.md` vor erneuter Ausführung
- Schnelle einmalige Rechtsrecherchen, bei denen Personalisierung nicht erforderlich ist und keine Playbook-Entscheidungen getroffen werden

## Anleitung

Das Interview sammelt vier Kategorien von Informationen und schreibt sie in ein Organisationsprofil. Arbeiten Sie sequenziell durch jede Kategorie — überspringen Sie keine Abschnitte.

---

**1. Praxiskontext (wer Sie sind)**

Sammeln Sie :
- Organisationsname und Entitätstyp : Anwaltskanzlei / interne Rechtsabteilung / eigenständige Rechtsabteilung
- Behandelte Praxisbereiche (Handelsverträge, Arbeitsrecht, Geistiges Eigentum, M&A, Datenschutz usw.)
- Gerichtsbarkeit(en), in der Sie tätig sind — geben Sie das primäre geltende Recht an
- Typische Transaktionsgröße (z. B. Lieferantenvereinbarungen von 50.000 bis 2 Millionen Dollar)
- Risikohaltung : aggressiv / marktkonform / konservativ

---

**2. Team- und Eskalationsstruktur**

Sammeln Sie :
- Teamgröße und Rollen (Jurist → Anwalt → Counsel → General Counsel / Senior Partner)
- Dollargrenzen pro Rolle — was jede Rolle ohne Eskalation genehmigen kann
- Eskalationskontakte : Name und Slack-Handle oder E-Mail pro Autorisierungsebene
- Bevorzugter Eskalationskanal : Slack / E-Mail / regelmäßiges Treffen

---

**3. Playbook-Positionen (pro Vertragstyp)**

Dokumentieren Sie für jeden von Ihrem Team behandelten Vertragstyp :

| Feld | Sammeln |
|-------|---------|
| Seite | Verkaufsseite oder Einkaufsseite |
| Haftungsbeschränkung | Bevorzugte Obergrenze (z. B. 1× Gebühren), akzeptable Alternativen, Nicht-akzeptieren-Liste |
| Entschädigung | Standardposition, akzeptable Alternativen, Nicht-akzeptieren |
| Anwendbares Recht und Gerichtsstand | Bevorzugt, akzeptabel, Nicht-akzeptieren |
| Datenschutz | DPA-Anforderungen, bevorzugte Standardklauseln |
| Ausschlusskriterium | Die eine Klausel, die sofort eine Eskalation für diesen Vertragstyp erfordert |

Typische Vertragstypen zum Abdecken : SaaS-Lieferantenvereinbarung, NDA, Arbeitsvertrag, Dienstleistungsvertrag, Datenverarbeitungsvertrag, Partnerschaftsvertrag.

---

**4. Systeme und Integrationen**

Sammeln Sie :
- Verwendetes CLM-System (falls vorhanden) und Integrationsstatus mit Claude Code
- Speicherort von Verträgen (gemeinsames Laufwerk, CLM, E-Mail-Archiv)
- Weitere Tools im rechtlichen Stack, mit denen Claude Code möglicherweise interagieren muss

---

**Ausgabe :** Schreiben Sie ein Profil zu `~/.claude/plugins/config/legal/company-profile.md` (gemeinsam für alle Rechtskompetenzen) und praxisspezifische Unterprofile pro Kompetenztyp im selben Verzeichnis.

Nach dem Schreiben des Profils bestätigen Sie, welche Rechtskompetenzen jetzt aktiv sind und wie sie das Profil verwenden werden. Alle Rechtskompetenzen lesen dieses Profil, bevor sie ein Dokument verarbeiten.

**Sicherheit :** Das Profil wird nur lokal gespeichert. Senden Sie den Profilinhalt nie außerhalb des lokalen Systems.

## Beispiel

**Eingabe :** « Führen Sie mich durch das Kaltstart-Interview für unser internes Rechtsteam bei einem 200-Personen-SaaS-Unternehmen. Wir behandeln hauptsächlich SaaS-Lieferantenvereinbarungen, NDAs und Arbeitsangelegenheiten. Wir befinden uns auf der Käuferseite und bevorzugen konservative Positionen. »

**Erwartetes Verhalten :**

Die Kompetenz führt das vierkategorige Interview aus als strukturiertes Gespräch durch und sammelt Antworten zu jedem Feld. Am Ende schreibt es :

- `~/.claude/plugins/config/legal/company-profile.md` — Organisationsidentität, Teamstruktur, Eskalationskontakte
- `~/.claude/plugins/config/legal/playbook-saas-vendor.md` — Positionen für SaaS-Lieferantenvereinbarungen
- `~/.claude/plugins/config/legal/playbook-nda.md` — Positionen für NDAs
- `~/.claude/plugins/config/legal/playbook-employment.md` — Positionen für Arbeitsangelegenheiten

Dann bestätigt : « Profil abgeschlossen. Die Kompetenzen Contract Reviewer, Escalation Flagger und Redline Negotiator werden dieses Profil jetzt für alle Überprüfungen verwenden. »

---
