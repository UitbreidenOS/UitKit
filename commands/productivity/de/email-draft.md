---
description: Entwerfen Sie eine professionelle E-Mail basierend auf einem Thema, einer Absicht und optionalem Kontext
argument-hint: "[Empfänger, Zweck, Schlüsselpunkte]"
---
Entwerfen Sie eine professionelle E-Mail basierend auf: $ARGUMENTS

Leiten Sie folgende Punkte aus $ARGUMENTS ab:
- **Empfängertyp**: Führungskraft, Kolleg:in aus dem Engineering, externer Anbieter, Kunde, Recruiter, etc.
- **Absicht**: informieren, anfordern, eskalieren, ablehnen, nachfassen, vorstellen, etc.
- **Ton**: formal, kollegial oder direkt — standardmäßig kollegial, es sei denn der Kontext legt etwas anderes nahe.

Ausgabeformat:

**Betreff:** [prägnant, spezifisch — kein „Nachfass-E-Mail" oder „Kurze Frage"]

**Text:**
[E-Mail-Text]

Regeln für den Text:
- Beginnen Sie mit dem Kernpunkt, nicht mit „Ich hoffe, diese E-Mail erreicht Sie wohlauf" oder ähnlichen Füllwörtern.
- Nennen Sie die Anfrage oder wichtigste Information in den ersten zwei Sätzen.
- Verwenden Sie kurze Absätze (max. 2–4 Sätze). Ein Gedanke pro Absatz.
- Falls vom Empfänger eine Aktion erforderlich ist, machen Sie diese explizit: was, bis wann.
- Beenden Sie mit einem Satz — entweder einem klaren nächsten Schritt oder einer unkomplizierten Handlungsaufforderung.
- Keine Standard-Schlussfloskeln („Zögern Sie nicht zu kontaktieren", „Vielen Dank im Voraus").
- Signaturplatzhalter: `[Ihr Name]`
- Zielwortanzahl: 80–200 Wörter für die meisten E-Mails. Länger nur wenn der Inhalt dies erfordert.

Tonabstimmung nach Empfängertyp:
- Führungskraft: hoher Informationswert, kein Ballast, mit Auswirkungen einleiten.
- Kolleg:in / Teamkamerad:in: direkt, kann „Wir"-Rahmung verwenden, umgangssprachlich ist ok.
- Externer Anbieter: professionell aber nicht steif; seien Sie spezifisch in dem, was Sie brauchen.
- Kunde: empathische Rahmung, vermeiden Sie interne Fachbegriffe.
- Recruiter: kurz, selbstbewusst, keine Verzweiflung.

Falls $ARGUMENTS unklar bezüglich der Absicht oder des Empfängers ist, nennen Sie Ihre Annahme oben in einer Zeile, dann erstellen Sie den Entwurf.

Geben Sie die Betreffzeile, den Text und notfalls die Anmerkung zur Annahme aus. Keine Einleitung.
