# Eskalations-Flagge

## Wann aktivieren

- Nach einer Vertragsüberprüfung, die Probleme identifiziert, die die Autorität des Prüfers überschreiten können
- Jede Vertragsklausel löst eine automatische Eskalationsbedingung aus (siehe Schritt 1 unten)
- Unsicherheit darüber, ob ein Begriff eine Genehmigung von oben vor dem Fortfahren erfordert

## Wann NICHT verwenden

- Als Ersatz für das Lesen des Vertrags — diese Kompetenz kennzeichnet Probleme in einem überprüften Vertrag, nicht als Ersatz für das Lesen eines
- Für Rechtsberatung — diese Kompetenz leitet Probleme auf die richtige Ebene weiter ; sie bietet keine Rechtsberatung zum Inhalt eines Begriffs

## Anleitung

Wenden Sie den Eskalations-Entscheidungsbaum in Ordnung an. Halten Sie beim ersten Auslöser, der ausgelöst wird — frühere Schritte überschreiben spätere.

---

**Schritt 1 — Automatische Auslöser (immer eskalieren unabhängig von Vertragswert oder Prüfer-Senioritätsgrad)**

Die folgenden Bedingungen erfordern Eskalation an General Counsel oder Senior Partner unabhängig von Vertragswert oder Prüfer-Senioritätsgrad :

- Unbegrenzte Haftungsklausel (jede Form)
- IP-Abtretung an die Gegenpartei, einschließlich Work-for-Hire-Klauseln, die die Kern-Produkt-IP abdecken
- Ewige ausschließliche Lizenz zu Technologie oder Daten der Organisation
- Jeder Begriff auf der dokumentierten « Niemals akzeptieren » -Liste der Organisation (vom Playbook-Profil)
- Bestätigter Sanktionstreffer gegen die Gegenpartei

Wenn ein automatischer Auslöser ausgelöst wird → `Erforderliche Eskalation : JA` und `Eskalation an : General Counsel / Senior Partner` setzen.

---

**Schritt 2 — Dollarbefugnis-Check**

Übersteigt der Vertragswert die Befugnisgrenze des Prüfers ?

Standardschwellen (mit Organisationsprofil überschreiben, falls verfügbar) :

```
Jurist:  <50 K$, nur Standardbegriffe
Counsel:    <500 K$, Standardbegriffe + dokumentierte Ausweichpositionen
General Counsel:         unbegrenzt, alle Begriffe einschließlich Non-Standard
```

Wenn der Vertragswert die Befugnis des Prüfers überschreitet → eskaliere zur nächsten Befugnisstufe.

---

**Schritt 3 — Non-Standard-Begriffe**

Ist irgendein ausgehandelter Begriff außerhalb der dokumentierten Ausweichpositionen im Organisations-Playbook ?

Wenn ja → eskaliere auf die in dem Playbook für Non-Standard-Begriffe definierte Befugnisstufe. Dokumentieren Sie, welcher Begriff und wie er abweicht.

---

**Schritt 4 — Playbook-Stille**

Erscheint ein materieller Begriff, den das Playbook überhaupt nicht behandelt ?

Wenn ja → als GELB darstellen. Nicht fortfahren. Bitten Sie das Team, vor dem Fortfahren mit diesem Vertrag eine Position für diesen Begriffstyp zu definieren. Nicht adressierte materielle Begriffe sind nicht sicher zu akzeptieren.

---

**Ausgabeformat :**

```
ESKALATIONSBEWERTUNG — [Vertragsname]
Gegenpartei : [Name]
Vertragswert : $[X]
Prüfer : [Rolle]

Automatische Auslöser :   [Keine / Liste jeden gefundenen Auslöser]
Dollarbefugnis :     $[Vertragswert] vs $[Prüfer-Limit] → [Innerhalb Limit / ÜBERSCHREITET]
Non-Standard-Begriffe :   [Keine / Liste jede Abweichung von Playbook]
Playbook-Lücken :        [Keine / Liste jeden nicht adressierten materiellen Begriff]

Erforderliche Eskalation :  [JA / NEIN]
Eskalation an :          [Rolle und Name aus Org-Profil]
Kanal :              [Slack / E-Mail]

---
Entwurf der Eskalationsnachricht :

Hallo [Name],

Ich überprüfe [Vertragsname] mit [Gegenpartei]. Ich brauche Ihre Genehmigung bevor ich fortfahre auf :

1. [Begriff 1] — [was es sagt] — [warum es Ihre Genehmigung erfordert]
2. [Begriff 2] — [was es sagt] — [warum es Ihre Genehmigung erfordert]

Vertragswert : $[X]. Gegenpartei : [Name]. Fälligkeit : [falls bekannt, sonst « nicht angegeben »].

Können Sie überprüfen und beraten ?
```

**Kosten-Nutzen-Regel :** Die Kosten einer unnötigen Eskalation (ungefähr 30 Sekunden Aufmerksamkeit eines Senior-Prüfers) sind immer geringer als die Kosten des Fortfahrens mit nicht genehmigten Non-Standard-Begriffen. Im Zweifelsfall flaggen.

**Hinweis :** Diese Kompetenz entwirft die Eskalationsnachricht. Sie sendet sie nicht — der Prüfer liest den Entwurf, bestätigt die Richtigkeit und sendet.

## Beispiel

**Eingabe :** « Ein Lieferantenvertrag hat einen gegenseitigen NDA-Abschnitt, Haftungsbegrenzung gedeckelt bei 1× Gebühren (unsere Standard-Ausweichposition), aber enthält eine Klausel, die alle während des Engagements entwickelte IP an den Lieferanten abtreten. Flaggen Sie angemessen. »

**Erwartete Ausgabe :**

```
ESKALATIONSBEWERTUNG — Lieferanten-Dienstleistungsvereinbarung (Acme Corp)
Gegenpartei : Acme Corp
Vertragswert : $120.000
Prüfer : Counsel

Automatische Auslöser :   IP-ABTRETUNG — Abschnitt 8.3 tritt alle während des Engagements entwickelten Arbeitsprodukte und IP an Lieferant ab. Dies ist ein automatischer Eskalationsauslöser unabhängig von Transaktionsgröße.
Dollarbefugnis :     $120.000 vs $500.000 (Counsel-Limit) → Innerhalb Limit
Non-Standard-Begriffe :   IP-Abtretung ist auf der Nie-akzeptieren-Liste
Playbook-Lücken :        Keine

Erforderliche Eskalation :  JA
Eskalation an :          General Counsel
Kanal :              Slack (#legal-escalations)

---
Entwurf der Eskalationsnachricht :

Hallo [GC-Name],

Ich überprüfe die Lieferanten-Dienstleistungsvereinbarung mit Acme Corp (120-K$-Engagement). Ich brauche Ihre Genehmigung bevor ich fortfahre auf :

1. Abschnitt 8.3 — IP-Abtretung — tritt alle während des Engagements entwickelten Arbeitsprodukte und IP an Acme Corp ab. Dies löst eine automatische Eskalation unter unserem Playbook aus (Nie-akzeptieren-Listen-Punkt).

Vertragswert : $120.000. Gegenpartei : Acme Corp. Fälligkeit : nicht angegeben.

Können Sie überprüfen und beraten ?
```

---
