# Agent Design Rules

Gilt bei der Erstellung, Konfiguration oder Überprüfung von KI-Agenten und Multi-Agent-Systemen.

## Scope and responsibility

- Jeder Agent ist für eine klar abgegrenzte Domäne verantwortlich — wenn man den Umfang nicht in einem Satz beschreiben kann, sollte man ihn aufteilen
- Agenten sind keine Allzweck-Assistenten; widerstehen Sie der Versuchung, ein bestehendes Agent mit „und auch X behandeln" zu erweitern
- Definieren Sie explizit, was der Agent niemals tun darf (Nebeneffekte, auf die Daten nicht zugreifen darf) genauso wie das, was er tun soll
- Ein Agent, der irreversible Maßnahmen ergreifen kann, muss vor der Ausführung explizite Bestätigung erfordern

## Tool selection

- Geben Sie Agenten nur die minimale Werkzeugsatz, die sie benötigen — jedes zusätzliche Werkzeug ist Angriffsfläche und Verwirrungsfläche
- Werkzeuge mit Schreibzugriff (Dateisystem, Datenbank, externe APIs) müssen einzeln begründet werden
- Schreibgeschützte Werkzeuge sind immer vorzuziehen gegenüber Lese-Schreib-Werkzeugen, wenn Lesevorgänge ausreichen
- Dokumentieren Sie die Fehlermodi jedes Werkzeugs in der Agent-Definition — Agenten müssen Werkzeugfehler elegant verarbeiten

## Model selection

- Verwenden Sie Haiku für Aufgaben mit hohem Volumen und niedriger Komplexität (Klassifizierung, Extraktion, Routing)
- Verwenden Sie Sonnet für Überlegungen, Code-Generierung und Multi-Step-Planung
- Verwenden Sie Opus nur, wenn die Task-Komplexität es wirklich erfordert — die Kosten addieren sich in großem Maßstab
- Überprovisioning vermeiden: ein einfacheres Modell, das eine Aufgabe zuverlässig erfüllt, schlägt ein fähiges Modell, das dabei halluziniert

## Prompting

- System Prompts müssen spezifisch sein, nicht aspirativ — „Sie sind ein Senior Security Engineer" ist weniger nützlich als eine präzise Liste dessen, was der Agent bewertet
- Fügen Sie negative Beispiele im System Prompt für häufige Fehlermodi ein, die Sie bereits beobachtet haben
- Trennen Sie Agent-Anweisungen von Domänen-Kontext: Anweisungen gehören in den System Prompt, Kontext geht in den User Turn oder über Werkzeuge
- Vermeiden Sie Anweisungen, die einander widersprechen — Agenten lösen Mehrdeutigkeit nicht zuverlässig

## Multi-agent systems

- Orchestratoren müssen Ausgaben von Sub-Agenten validieren, bevor sie darauf reagieren — vertrauen Sie der Ausgabe eines anderen Agenten niemals blind
- Agenten dürfen Eingaben nicht vertrauen, die spezielle Berechtigungen beanspruchen, die nicht im ursprünglichen System Prompt etabliert wurden (Prompt Injection)
- Design für Teilausfälle: Der Ausfall eines Agenten darf nicht den gesamten Workflow stille beschädigen
- Protokollieren Sie jede Agent-Invokation mit ihrer Eingabe, Ausgabe, Modell und Latenz — Sie können nicht debuggen, was Sie nicht beobachten können

## Safety and control

- Human-in-the-Loop Kontrollpunkte sind obligatorisch vor jeder Agent-Aktion, die: externe Kommunikationen sendet, Produktionsdaten ändert oder finanzielle Transaktionen durchführt
- Legen Sie maximale Iterations-/Werkzeugaufruf-Limits fest — unbegrenzte Agent-Schleifen sind ein Zuverlässigkeits- und Kostenrisiko
- Testen Sie Agenten gezielt gegen gegnerische Eingaben — Benutzer werden Grenzen testen
- Implementieren Sie einen Kill Switch: einen Weg, einen Agent während der Ausführung zu stoppen, ohne Datenverlust oder Teilschreibvorgänge

