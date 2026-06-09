# GraphQL-Regeln

Wenden Sie diese an, wenn Sie Schemas, Resolver oder Client-Abfragen entwerfen.

## Schema-Design

- Modellieren Sie die Domäne, nicht die Datenbank — Typen sollten Geschäftsentitäten widerspiegeln, nicht Tabellenzeilen
- Verwenden Sie Non-Null (`!`) aggressiv; nullable Felder sind ein Versprechen an Clients, dass der Wert möglicherweise fehlt
- Bevorzugen Sie aussagekräftige Feldnamen statt abgekürzter: `createdAt` statt `cAt`
- Input-Typen für Mutationen müssen sich von Query-Rückgabetypen unterscheiden — verwenden Sie nie denselben Typ
- Verwenden Sie Enums für Felder mit einem begrenzten Wertebereich; dokumentieren Sie jeden Enum-Wert

## Abfragen und Mutationen

- Abfragen müssen nebenwirkungsfrei sein; Mutationen sind der einzige Einstiegspunkt für Schreibvorgänge
- Benennen Sie Mutationen als `<Verb><Substantiv>`: `createOrder`, `cancelSubscription`
- Geben Sie das mutierte Objekt von jeder Mutation zurück — Clients benötigen es, um ihren Cache zu aktualisieren
- Mutationen, die teilweise fehlschlagen können, müssen einen Union-Typ zurückgeben: `CreateOrderResult = Order | ValidationError`
- Implementieren Sie Cursor-basierte Paginierung (`first`/`after`) für alle Listen, die unbegrenzt wachsen können

## Resolver

- Batch N+1-Abfragen mit einem DataLoader — geben Sie niemals eine DB-Abfrage pro Listenelement aus
- Halten Sie die Resolver-Logik einfach: Eingabe validieren, einen Service aufrufen, das Ergebnis zurückgeben
- Lösen Sie nur auf, was angefordert wird — holen Sie keine Joins für Felder, die nicht im Selection Set sind
- Legen Sie Komplexitätskosten pro Feld fest; lehnen Sie Abfragen ab, die ein Gesamtbudget überschreiten
- Geben Sie niemals interne Fehlermeldungen an den Client weiter; protokollieren Sie sie serverseitig

## Sicherheit

- Authentifizieren Sie am Gateway, bevor ein Resolver ausgeführt wird
- Autorisieren Sie auf Resolver-Ebene — überprüfen Sie das Eigentum, bevor Sie Daten zurückgeben oder verändern
- Deaktivieren Sie Introspection in der Produktion für externe APIs
- Erzwingen Sie Abfragetiefen-Limits und Abfragekomplexitäts-Limits
- Geben Sie niemals Stack Traces in `errors[].extensions` preis

## Abonnements

- Verwenden Sie Abonnements nur für echte Echtzeit-Daten; Polling ist für die meisten Fälle einfacher
- Filtern Sie Abonnement-Events immer nach dem Umfang des authentifizierten Benutzers
- Implementieren Sie Backpressure-Handling — drücken Sie nicht schneller, als der Client verbrauchen kann

## Versionierung und Evolution

- Verwenden Sie `@deprecated(reason: "…")`, um Felder zu kennzeichnen, bevor Sie sie entfernen
- Entfernen oder benennen Sie ein Feld niemals in einer einzelnen Version um — kennzeichnen Sie es als veraltet, warten Sie einen Release-Zyklus
- Additive Änderungen (neue Felder, neue Typen) sind nicht brechend und können jederzeit bereitgestellt werden
