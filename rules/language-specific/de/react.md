# React-Regeln

## Anwendbar auf
Alle React-Dateien (`*.tsx`, `*.jsx`) in jedem Projekt.

## Regeln

1. **Eine Komponente pro Datei** — benenne die Datei nach der Komponente. `UserCard.tsx` exportiert `UserCard`. Barrel-Dateien (`index.ts`) sind akzeptabel zum erneuten Exportieren, nicht zum Zusammenfassen mehrerer Komponenten.

2. **Bevorzuge Funktionskomponenten mit Hooks gegenüber Klassenkomponenten** — Klassenkomponenten sind veraltet. Der einzige gültige Grund für die Verwendung einer Klassenkomponente ist eine klassenbasierte Error Boundary.

3. **Halte Komponenten unter ~150 Zeilen** — wenn eine Komponente mehr benötigt, extrahiere Unterkomponenten oder verschiebe Logik in Custom Hooks. Lange Komponenten verletzen das Single-Responsibility-Prinzip.

4. **Hebe den Status zum niedrigsten gemeinsamen Vorfahren — nicht höher** — verschiebe den Status nicht zu einem übergeordneten Element, nur weil es bequem ist. Globaler Status (Context, Zustand, etc.) ist für wirklich globale Daten: Auth, Thema, Gebietsschema.

5. **Custom Hooks für Logik, Komponenten für Rendering** — Datenbeschaffung, abgeleiteter Status, Event-Handling gehören in `use*` Hooks, nicht inline in JSX. Der Komponentenkörper sollte größtenteils JSX sein.

6. **Mutiere den Status niemals direkt** — gib immer neue Objekte/Arrays zurück. `setState(prev => ({ ...prev, key: value }))` nicht `state.key = value; setState(state)`.

7. **Gib Keys bei List-Elementen an — verwende niemals Array-Index als Key für dynamische Listen** — Index-Keys unterbrechen die Abstimmung, wenn Elemente neu geordnet oder eingefügt/gelöscht werden. Verwende stabile, eindeutige IDs.

8. **Merke korrekt oder gar nicht** — `useMemo` und `useCallback` verursachen Overhead. Verwende sie, wenn eine Berechnung wirklich teuer ist oder eine Änderung der Referenzidentität zu unnötigen Re-Renders des Kindes führt. Benchmark vor dem Hinzufügen.

9. **Colokiere Status, Effects und deren UI** — verteile nicht den zugehörigen Status über die Datei. Gruppiere `useState`/`useEffect`-Paare in der Nähe des JSX, das sie beeinflussen, oder extrahiere in einen Hook.

10. **Vermeide `useEffect` für abgeleiteten Status** — wenn ein Wert aus bestehendem Status/Props synchron berechnet werden kann, berechne ihn inline. `useEffect` für abgeleiteten Status führt zu einem Render-Zyklus und einem Fenster mit veraltenen Lesezugriffen.

11. **Gib alle Props mit TypeScript-Schnittstellen ein, nicht `any`** — `React.FC<Props>` ist optional; Die direkte Eingabe des Parameters (`({ name }: Props) => ...`) ist gleichermaßen gültig und vermeidet `FC`s implizite `children`-Falle.

12. **Behandle Loading-, Error- und leere Zustände explizit** — jede async-gesteuerte UI hat drei fehlgeschlagene Pfade. Rendern sie absichtlich, nicht durch Weitergabe.

13. **Halte `useEffect` Dependency Arrays genau** — `eslint-plugin-react-hooks` erzwingt dies. Unterdrücke niemals die exhaustive-deps-Warnung ohne einen Kommentar, der erklärt, warum.

14. **Vermeide Prop Drilling über zwei Ebenen hinaus** — übergebe über Context oder einen State Manager. Drei Ebenen des Prop-Threading sind ein Zeichen für eine fehlende Abstraktion.

15. **Teste Verhalten, nicht Implementierung** — verwende React Testing Library. Behaupte, was der Benutzer sieht und damit interagieren kann, nicht auf internem Status oder der Komponentenbaumstruktur.


---
