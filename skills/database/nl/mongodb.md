---
name: mongodb
description: "MongoDB patterns: schema design, aggregation pipeline, indexes, transactions, Atlas Search, Mongoose vs native driver"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../mongodb.md).

# MongoDB Skill

## Wanneer activeren
- Ontwerpen van een MongoDB-schema (inbedden vs. verwijzen)
- Schrijven van aggregation pipelines voor complexe queries
- Instellen van indexes voor queryprestaties
- Gebruik van MongoDB-transacties over meerdere documenten
- Integratie van MongoDB Atlas Search (volledige tekst)
- Kiezen tussen Mongoose en de native driver

## Wanneer NIET gebruiken
- Relationele data met veel joins — gebruik PostgreSQL
- Wanneer ACID-transacties op grote schaal nodig zijn — overweeg PostgreSQL
- Eenvoudige key-value caching — gebruik Redis
- Analyses op grote datasets — gebruik een data warehouse

## Instructies

### Wanneer inbedden vs. verwijzen

**Inbedden wanneer:**
- Data altijd samen wordt opgevraagd (post + zijn reacties als reacties weinig zijn)
- Kinddata geen onafhankelijke levenscyclus heeft
- Arraygrootte begrensd blijft (< 100 items, groeit zelden naar duizenden)

**Verwijzen wanneer:**
- Data onafhankelijk wordt opgevraagd
- Array onbegrensd kan groeien (alle bestellingen van een gebruiker)
- Many-to-many-relaties

```javascript
// Ingebed — goed voor adres (altijd bij gebruiker, verandert niet vaak)
{
  _id: ObjectId("..."),
  email: "alice@example.com",
  address: {
    street: "123 Main St",
    city: "San Francisco",
    zip: "94105"
  }
}

// Verwezen — goed voor bestellingen (veel, onafhankelijke levenscyclus)
// Gebruikersdocument
{ _id: ObjectId("user1"), email: "alice@example.com" }

// Bestellingsdocument (verwijst naar gebruiker)
{ _id: ObjectId("order1"), userId: ObjectId("user1"), total: 99.99 }
```

### Native driver (Node.js)

```typescript
import { MongoClient, ObjectId } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db('myapp')
const users = db.collection('users')

// Verbinden (eenmaal aanroepen bij opstarten)
await client.connect()

// CRUD
const user = await users.findOne({ _id: new ObjectId(id) })
const result = await users.insertOne({ email, name, createdAt: new Date() })
await users.updateOne(
  { _id: new ObjectId(id) },
  { $set: { name }, $currentDate: { updatedAt: true } }
)
await users.deleteOne({ _id: new ObjectId(id) })

// Zoeken met projectie en sortering
const recent = await users
  .find({ active: true })
  .project({ email: 1, name: 1, _id: 0 })
  .sort({ createdAt: -1 })
  .limit(10)
  .toArray()
```

### Mongoose (schema-gebaseerde ODM)

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

// Virtuals (niet opgeslagen in DB)
userSchema.virtual('displayName').get(function() {
  return this.name.split(' ')[0]
})

// Pre-save hook
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

type User = InferSchemaType<typeof userSchema>
export const UserModel = model<User>('User', userSchema)

// Queries
const user = await UserModel.findById(id).lean()  // .lean() = eenvoudig JS-object, sneller
const users = await UserModel.find({ role: 'admin' }).select('email name').limit(20)
const user = await UserModel.findOneAndUpdate(
  { email },
  { $set: { name } },
  { new: true, runValidators: true }
)
```

### Aggregation pipeline — de krachtigste MongoDB-functie

```javascript
// Verkooprapport: omzet per categorie van de afgelopen 30 dagen
db.orders.aggregate([
  // Fase 1: filteren
  { $match: {
    status: 'completed',
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  }},

  // Fase 2: array uitrollen (één document per item)
  { $unwind: '$items' },

  // Fase 3: groeperen per categorie
  { $group: {
    _id: '$items.category',
    totalRevenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
    orderCount: { $addToSet: '$_id' },  // count distinct orders
    avgOrderValue: { $avg: '$total' },
  }},

  // Fase 4: nette uitvoer projecteren
  { $project: {
    category: '$_id',
    totalRevenue: { $round: ['$totalRevenue', 2] },
    orderCount: { $size: '$orderCount' },
    avgOrderValue: { $round: ['$avgOrderValue', 2] },
    _id: 0,
  }},

  // Fase 5: sorteren
  { $sort: { totalRevenue: -1 } },
])
```

**Veelgebruikte pipeline-fasen:**

| Fase | Gebruik voor |
|-------|---------|
| `$match` | Documenten filteren (vroeg plaatsen om indexes te gebruiken) |
| `$group` | Aggregeren: sum, count, avg, min, max, push |
| `$project` | Documenten hervormen, berekende velden toevoegen |
| `$unwind` | Array afvlakken tot meerdere documenten |
| `$lookup` | Left join met een andere collectie |
| `$sort` | Resultaten sorteren |
| `$limit` / `$skip` | Paginering |
| `$facet` | Meerdere aggregaties in één doorloop |
| `$bucket` | Groeperen in bereiken (histogram) |
| `$addFields` | Velden toevoegen/wijzigen zonder de rest te veranderen |

**Lookup (join):**
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
// Enkel veld
db.users.createIndex({ email: 1 }, { unique: true })

// Samengesteld (meest selectieve veld eerst bevragen)
db.orders.createIndex({ userId: 1, createdAt: -1 })

// Tekst-index voor basiszoekfunctie
db.posts.createIndex({ title: 'text', content: 'text' }, {
  weights: { title: 10, content: 1 },  // title matches rank higher
  default_language: 'english'
})
db.posts.find({ $text: { $search: 'typescript patterns' } },
              { score: { $meta: 'textScore' } })
       .sort({ score: { $meta: 'textScore' } })

// Partiële index (alleen een subset indexeren)
db.orders.createIndex(
  { createdAt: 1 },
  { partialFilterExpression: { status: 'pending' } }
)

// TTL-index (documenten automatisch verwijderen)
db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

### Transacties

```typescript
// Multi-document transacties (vereist replica set)
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

### Update-operators

```javascript
// $set — specifieke velden bijwerken
{ $set: { name: 'Alice', 'address.city': 'NYC' } }

// $inc — verhogen/verlagen
{ $inc: { views: 1, stock: -1 } }

// $push — toevoegen aan array
{ $push: { tags: 'typescript' } }

// $addToSet — toevoegen aan array alleen als nog niet aanwezig
{ $addToSet: { tags: 'typescript' } }

// $pull — verwijderen uit array op waarde
{ $pull: { tags: 'draft' } }

// $pop — eerste of laatste element verwijderen
{ $pop: { history: -1 } }  // -1 = first, 1 = last

// $unset — een veld verwijderen
{ $unset: { legacyField: '' } }

// $currentDate — instellen op huidige datum
{ $currentDate: { updatedAt: true } }
```

## Voorbeeld

**Gebruiker:** Bouw een MongoDB-aggregatie om de top 5 contentmakers te vinden op basis van totale postweergaven in de afgelopen 7 dagen, met hun gebruikersinformatie, uitgesplitst per postcategorie.

**Verwachte pipeline:**
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
