---
name: mongodb
description: "MongoDB patterns: schema design, aggregation pipeline, indexes, transactions, Atlas Search, Mongoose vs native driver"
---

> 🇩🇪 Deutsche Version. [Englische Version](../mongodb.md).

# MongoDB Skill

## Wann aktivieren
- Entwurf eines MongoDB-Schemas (Einbetten vs. Referenzieren)
- Schreiben von aggregation pipelines für komplexe Abfragen
- Einrichten von Indexes für Abfrageleistung
- Verwendung von MongoDB-Transaktionen über mehrere Dokumente
- Integration von MongoDB Atlas Search (Volltextsuche)
- Auswahl zwischen Mongoose und dem nativen Treiber

## Wann NICHT verwenden
- Relationale Daten mit vielen Joins — PostgreSQL verwenden
- Wenn ACID-Transaktionen in großem Maßstab benötigt werden — PostgreSQL erwägen
- Einfaches Key-Value-Caching — Redis verwenden
- Analysen auf großen Datensätzen — ein Data Warehouse verwenden

## Anweisungen

### Wann einbetten vs. referenzieren

**Einbetten wenn:**
- Daten immer zusammen abgerufen werden (Post + seine Kommentare, wenn Kommentare wenige sind)
- Kinddaten keinen eigenständigen Lebenszyklus haben
- Array-Größe begrenzt bleibt (< 100 Elemente, wächst selten auf Tausende)

**Referenzieren wenn:**
- Daten unabhängig voneinander abgerufen werden
- Array unbegrenzt wachsen könnte (alle Bestellungen eines Nutzers)
- Many-to-Many-Beziehungen

```javascript
// Eingebettet — gut für Adresse (immer beim Nutzer, ändert sich selten)
{
  _id: ObjectId("..."),
  email: "alice@example.com",
  address: {
    street: "123 Main St",
    city: "San Francisco",
    zip: "94105"
  }
}

// Referenziert — gut für Bestellungen (viele, eigenständiger Lebenszyklus)
// Nutzerdokument
{ _id: ObjectId("user1"), email: "alice@example.com" }

// Bestelldokument (referenziert Nutzer)
{ _id: ObjectId("order1"), userId: ObjectId("user1"), total: 99.99 }
```

### Nativer Treiber (Node.js)

```typescript
import { MongoClient, ObjectId } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db('myapp')
const users = db.collection('users')

// Verbinden (einmal beim Start aufrufen)
await client.connect()

// CRUD
const user = await users.findOne({ _id: new ObjectId(id) })
const result = await users.insertOne({ email, name, createdAt: new Date() })
await users.updateOne(
  { _id: new ObjectId(id) },
  { $set: { name }, $currentDate: { updatedAt: true } }
)
await users.deleteOne({ _id: new ObjectId(id) })

// Suchen mit Projektion und Sortierung
const recent = await users
  .find({ active: true })
  .project({ email: 1, name: 1, _id: 0 })
  .sort({ createdAt: -1 })
  .limit(10)
  .toArray()
```

### Mongoose (schemabasierter ODM)

```typescript
import mongoose, { Schema, model, type InferSchemaType } from 'mongoose'

const userSchema = new Schema({
  email:     { type: String, required: true, unique: true, lowercase: true },
  name:      { type: String, required: true },
  role:      { type: String, enum: ['user', 'admin'], default: 'user' },
  tags:      [String],
  metadata:  { type: Map, of: String },
  createdAt: { type: Date, default: Date.now },
})

// Indexes
userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ createdAt: -1 })
userSchema.index({ tags: 1 })

// Virtuals (nicht in DB gespeichert)
userSchema.virtual('displayName').get(function() {
  return this.name.split(' ')[0]
})

// Pre-save-Hook
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

type User = InferSchemaType<typeof userSchema>
export const UserModel = model<User>('User', userSchema)

// Abfragen
const user = await UserModel.findById(id).lean()  // .lean() = einfaches JS-Objekt, schneller
const users = await UserModel.find({ role: 'admin' }).select('email name').limit(20)
const user = await UserModel.findOneAndUpdate(
  { email },
  { $set: { name } },
  { new: true, runValidators: true }
)
```

### Aggregation Pipeline — die mächtigste MongoDB-Funktion

```javascript
// Verkaufsbericht: Umsatz nach Kategorie der letzten 30 Tage
db.orders.aggregate([
  // Stufe 1: filtern
  { $match: {
    status: 'completed',
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  }},

  // Stufe 2: Array entfalten (ein Dokument pro Artikel)
  { $unwind: '$items' },

  // Stufe 3: nach Kategorie gruppieren
  { $group: {
    _id: '$items.category',
    totalRevenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
    orderCount: { $addToSet: '$_id' },  // count distinct orders
    avgOrderValue: { $avg: '$total' },
  }},

  // Stufe 4: saubere Ausgabe projizieren
  { $project: {
    category: '$_id',
    totalRevenue: { $round: ['$totalRevenue', 2] },
    orderCount: { $size: '$orderCount' },
    avgOrderValue: { $round: ['$avgOrderValue', 2] },
    _id: 0,
  }},

  // Stufe 5: sortieren
  { $sort: { totalRevenue: -1 } },
])
```

**Häufige Pipeline-Stufen:**

| Stufe | Verwendung |
|-------|---------|
| `$match` | Dokumente filtern (früh platzieren, um Indexes zu nutzen) |
| `$group` | Aggregieren: sum, count, avg, min, max, push |
| `$project` | Dokumente umstrukturieren, berechnete Felder hinzufügen |
| `$unwind` | Array in mehrere Dokumente auffalten |
| `$lookup` | Left Join mit einer anderen Collection |
| `$sort` | Ergebnisse sortieren |
| `$limit` / `$skip` | Paginierung |
| `$facet` | Mehrere Aggregationen in einem Durchlauf |
| `$bucket` | In Bereiche gruppieren (Histogramm) |
| `$addFields` | Felder hinzufügen/ändern ohne den Rest zu ändern |

**Lookup (Join):**
```javascript
db.orders.aggregate([
  { $lookup: {
    from: 'users',
    localField: 'userId',
    foreignField: '_id',
    as: 'user',
    pipeline: [
      { $project: { email: 1, name: 1 } }  // only fetch needed fields
    ]
  }},
  { $unwind: '$user' },  // convert [user] array to user object
])
```

### Indexes

```javascript
// Einzelnes Feld
db.users.createIndex({ email: 1 }, { unique: true })

// Zusammengesetzt (selektivstes Feld zuerst abfragen)
db.orders.createIndex({ userId: 1, createdAt: -1 })

// Text-Index für einfache Suche
db.posts.createIndex({ title: 'text', content: 'text' }, {
  weights: { title: 10, content: 1 },  // title matches rank higher
  default_language: 'english'
})
db.posts.find({ $text: { $search: 'typescript patterns' } },
              { score: { $meta: 'textScore' } })
       .sort({ score: { $meta: 'textScore' } })

// Partieller Index (nur eine Teilmenge indexieren)
db.orders.createIndex(
  { createdAt: 1 },
  { partialFilterExpression: { status: 'pending' } }
)

// TTL-Index (Dokumente automatisch löschen)
db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

### Transaktionen

```typescript
// Multi-Dokument-Transaktionen (erfordert Replica Set)
const session = client.startSession()

try {
  await session.withTransaction(async () => {
    await accounts.updateOne(
      { _id: fromId },
      { $inc: { balance: -amount } },
      { session }
    )
    await accounts.updateOne(
      { _id: toId },
      { $inc: { balance: amount } },
      { session }
    )
    await ledger.insertOne(
      { from: fromId, to: toId, amount, createdAt: new Date() },
      { session }
    )
  })
} finally {
  await session.endSession()
}
```

### Update-Operatoren

```javascript
// $set — bestimmte Felder aktualisieren
{ $set: { name: 'Alice', 'address.city': 'NYC' } }

// $inc — erhöhen/verringern
{ $inc: { views: 1, stock: -1 } }

// $push — zum Array hinzufügen
{ $push: { tags: 'typescript' } }

// $addToSet — zum Array nur hinzufügen, wenn nicht vorhanden
{ $addToSet: { tags: 'typescript' } }

// $pull — nach Wert aus Array entfernen
{ $pull: { tags: 'draft' } }

// $pop — erstes oder letztes Element entfernen
{ $pop: { history: -1 } }  // -1 = first, 1 = last

// $unset — ein Feld entfernen
{ $unset: { legacyField: '' } }

// $currentDate — auf aktuelles Datum setzen
{ $currentDate: { updatedAt: true } }
```

## Beispiel

**Nutzer:** Eine MongoDB-Aggregation erstellen, um die 5 Content-Creator mit den meisten Post-Views der letzten 7 Tage zu finden, mit ihren Nutzerinformationen, aufgeschlüsselt nach Post-Kategorie.

**Erwartete Pipeline:**
```javascript
db.posts.aggregate([
  { $match: { publishedAt: { $gte: new Date(Date.now() - 7 * 86400000) } }},
  { $group: {
    _id: { authorId: '$authorId', category: '$category' },
    totalViews: { $sum: '$views' },
    postCount: { $sum: 1 }
  }},
  { $group: {
    _id: '$_id.authorId',
    totalViews: { $sum: '$totalViews' },
    breakdown: { $push: { category: '$_id.category', views: '$totalViews' } }
  }},
  { $sort: { totalViews: -1 } },
  { $limit: 5 },
  { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user',
    pipeline: [{ $project: { email: 1, name: 1 } }] }},
  { $unwind: '$user' },
])
```

---
