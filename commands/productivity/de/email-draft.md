---
description: Entwerfen Sie eine professionelle E-Mail zu einem Thema, einer Absicht und optionalem Kontext
argument-hint: "[recipient, purpose, key points]"
---
Entwerfen Sie eine professionelle E-Mail basierend auf: $ARGUMENTS

Leiten Sie Folgendes aus $ARGUMENTS ab:
- **Empfängertyp**: Führungskraft, Ingenieuream-Mitglied, externer Anbieter, Kunde, Personalvermittler usw.
- **Absicht**: informieren, anfragen, eskalieren, ablehnen, nachverfolgen, vorstellen usw.
- **Ton**: formal, kollegial oder direkt — standardmäßig kollegial, es sei denn, der Kontext deutet etwas anderes an.

Ausgabeformat:

**Subject:** [prägnant, spezifisch — kein „Nachverfolgung" oder „Schnelle Frage"]

**Body:**
[E-Mail-Text]

Regeln für den Text:
- Beginnen Sie mit dem Kernpunkt, nicht mit „Ich hoffe, diese E-Mail findet Sie gut" oder ähnlichen Füllwörtern.
- Geben Sie die Anfrage oder wichtige Informationen in den ersten zwei Sätzen an.
- Verwenden Sie kurze Absätze (maximal 2–4 Sätze). Eine Idee pro Absatz.
- Falls eine Aktion vom Empfänger erforderlich ist, machen Sie sie explizit: was, bis wann.
- Beenden Sie mit einem Satz — entweder ein klarer nächster Schritt oder eine unkomplizierte Handlungsaufforderung.
- Keine Abschlussfloskeln („Bitte zögern Sie nicht, mich zu kontaktieren", „Danke im Voraus").
- Signaturplatzhalter: `[Ihr Name]`
- Zielumfang: 80–200 Wörter für die meisten E-Mails. Gehen Sie länger nur, wenn der Inhalt dies erfordert.

Tonkalibrierung nach Empfängertyp:
- Führungskraft: hoher Informationswert, keine Füllwörter, mit Auswirkungen eröffnen.
- Team-Mitglied / Kollege: direkt, kann „wir"-Rahmung verwenden, Gesprächston ist in Ordnung.
- Externer Anbieter: professionell, aber nicht steif; seien Sie spezifisch darüber, was Sie benötigen.
- Kunde: empathische Rahmung, vermeiden Sie interne Fachsprache.
- Personalvermittler: prägnant, selbstbewusst, kein Desperation.

Wenn $ARGUMENTS über Absicht oder Empfänger mehrdeutig ist, geben Sie Ihre Annahme oben in einer Zeile an und erstellen Sie dann den Entwurf.

Geben Sie die Betreffzeile, den Text und eine Anmerkung zur Annahme aus, falls vorhanden. Keine Präambel.
