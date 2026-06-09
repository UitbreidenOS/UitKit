---
description: Generiert ein Standup-Update basierend auf aktueller Git-Aktivität oder Freitext-Notizen
argument-hint: "[context or notes]"
---
Erstelle ein prägnantes Standup-Update basierend auf: $ARGUMENTS

Wenn $ARGUMENTS leer ist, überprüfe das Git-Log der letzten 24 Stunden (`git log --since="24 hours ago" --oneline --author=$(git config user.email)`) und leite Gestern/Heute aus den Commits ab. Wenn das Repository gestagte oder ungestagte Änderungen hat, notiere, was in Arbeit ist.

Strukturiere die Ausgabe als drei einfache Abschnitte — keine Überschriften, keine Aufzählungszeichen, es sei denn natürlich:

Gestern: was abgeschlossen oder bedeutsam vorangebracht wurde.
Heute: was geplant ist oder aktiv in Arbeit.
Blockierungen: alles, was den Fortschritt blockiert. Falls keine vorhanden, omit this line entirely.

Rules:
- Keep each section to 1–3 sentences maximum.
- Write in first person, past/present tense.
- Strip implementation details — write at the level of task/feature, not function names.
- Do not mention file paths, line numbers, or commit SHAs.
- Do not add pleasantries, sign-offs, or filler phrases like "Hope everyone's doing well."
- If $ARGUMENTS contains explicit notes, prefer them over git history.
- If git history is ambiguous (merge commits, chores only), ask one clarifying question before generating.

Gib nur den Standup-Text aus. Kein Preamble, kein „Here is your standup:" wrapper.
