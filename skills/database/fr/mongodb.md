---
name: mongodb
description: "MongoDB patterns: schema design, aggregation pipeline, indexes, transactions, Atlas Search, Mongoose vs native driver"
---

> 🇫🇷 Version française. [English version](../mongodb.md).

# Compétence MongoDB

## Quand activer
- Conception d'un schéma MongoDB (embedding vs référencement)
- Écriture de pipelines d'agrégation pour des requêtes complexes
- Mise en place d'index pour les performances des requêtes
- Utilisation des transactions MongoDB sur plusieurs documents
- Intégration de MongoDB Atlas Search (texte intégral)
- Choisir entre Mongoose et le driver natif

## Quand NE PAS utiliser
- Données relationnelles avec beaucoup de jointures — utilisez PostgreSQL
- Quand vous avez besoin de transactions ACID à grande échelle — envisagez PostgreSQL
- Simple mise en cache clé-valeur — utilisez Redis
- Analyse de grands ensembles de données — utilisez un entrepôt de données

## Instructions

### Quand embarquer vs référencer

**Embarquer quand :**
- Les données sont toujours accédées ensemble (post + ses commentaires si les commentaires sont peu nombreux)
- Les données enfants n'ont pas de cycle de vie indépendant
- La taille du tableau reste bornée (< 100 éléments, croît rarement à des milliers)

**Référencer quand :**
- Les données sont accédées indépendamment
- Le tableau pourrait croître indéfiniment (toutes les commandes d'un utilisateur)
- Relations many-to-many

```javascript
// Embarqué — bon pour l'adresse (toujours avec l'utilisateur, ne change pas souvent)
{
  _id: ObjectId("..."),
  email: "alice@example.com",
  address: {
    street: "123 Main St",
    city: "San Francisco",
    zip: "94105"
  }
}

// Référencé — bon pour les commandes (nombreuses, cycle de vie indépendant)
// Document utilisateur
{ _id: ObjectId("user1"), email: "alice@example.com" }

// Document commande (référence l'utilisateur)
{ _id: ObjectId("order1"), userId: ObjectId("user1"), total: 99.99 }
```

### Driver natif (Node.js)

```typescript
import { MongoClient, ObjectId } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db('myapp')
const users = db.collection('users')

// Connexion (appeler une seule fois au démarrage)
await client.connect()

// CRUD
const user = await users.findOne({ _id: new ObjectId(id) })
const result = await users.insertOne({ email, name, createdAt: new Date() })
await users.updateOne(
  { _id: new ObjectId(id) },
  { $set: { name }, $currentDate: { updatedAt: true } }
)
await users.deleteOne({ _id: new ObjectId(id) })

// Trouver avec projection et tri
const recent = await users
  .find({ active: true })
  .project({ email: 1, name: 1, _id: 0 })
  .sort({ createdAt: -1 })
  .limit(10)
  .toArray()
```

### Mongoose (ODM basé sur le schéma)

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

// Index
userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ createdAt: -1 })
userSchema.index({ tags: 1 })

// Virtuals (non stockés en DB)
userSchema.virtual('displayName').get(function() {
  return this.name.split(' ')[0]
})

// Hook pre-save
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

type User = InferSchemaType<typeof userSchema>
export const UserModel = model<User>('User', userSchema)

// Requêtes
const user = await UserModel.findById(id).lean()  // .lean() = objet JS simple, plus rapide
const users = await UserModel.find({ role: 'admin' }).select('email name').limit(20)
const user = await UserModel.findOneAndUpdate(
  { email },
  { $set: { name } },
  { new: true, runValidators: true }
)
```

### Pipeline d'agrégation — la fonctionnalité MongoDB la plus puissante

```javascript
// Rapport de ventes : chiffre d'affaires par catégorie sur les 30 derniers jours
db.orders.aggregate([
  // Étape 1 : filtrer
  { $match: {
    status: 'completed',
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  }},

  // Étape 2 : dérouler le tableau (un doc par article)
  { $unwind: '$items' },

  // Étape 3 : grouper par catégorie
  { $group: {
    _id: '$items.category',
    totalRevenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
    orderCount: { $addToSet: '$_id' },  // count distinct orders
    avgOrderValue: { $avg: '$total' },
  }},

  // Étape 4 : projeter une sortie propre
  { $project: {
    category: '$_id',
    totalRevenue: { $round: ['$totalRevenue', 2] },
    orderCount: { $size: '$orderCount' },
    avgOrderValue: { $round: ['$avgOrderValue', 2] },
    _id: 0,
  }},

  // Étape 5 : trier
  { $sort: { totalRevenue: -1 } },
])
```

**Étapes de pipeline courantes :**

| Étape | Utilisation |
|-------|---------|
| `$match` | Filtrer les documents (placer tôt pour utiliser les index) |
| `$group` | Agréger : sum, count, avg, min, max, push |
| `$project` | Remodeler les documents, ajouter des champs calculés |
| `$unwind` | Aplatir un tableau en plusieurs documents |
| `$lookup` | Jointure gauche avec une autre collection |
| `$sort` | Trier les résultats |
| `$limit` / `$skip` | Pagination |
| `$facet` | Plusieurs agrégations en une seule passe |
| `$bucket` | Grouper en plages (histogramme) |
| `$addFields` | Ajouter/modifier des champs sans changer le reste |

**Lookup (jointure) :**
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

### Index

```javascript
// Champ unique
db.users.createIndex({ email: 1 }, { unique: true })

// Composé (requêtez d'abord le champ le plus sélectif)
db.orders.createIndex({ userId: 1, createdAt: -1 })

// Index de texte pour la recherche de base
db.posts.createIndex({ title: 'text', content: 'text' }, {
  weights: { title: 10, content: 1 },  // title matches rank higher
  default_language: 'english'
})
db.posts.find({ $text: { $search: 'typescript patterns' } },
              { score: { $meta: 'textScore' } })
       .sort({ score: { $meta: 'textScore' } })

// Index partiel (indexer uniquement un sous-ensemble)
db.orders.createIndex(
  { createdAt: 1 },
  { partialFilterExpression: { status: 'pending' } }
)

// Index TTL (auto-suppression des documents)
db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

### Transactions

```typescript
// Transactions multi-documents (nécessite un replica set)
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

### Opérateurs de mise à jour

```javascript
// $set — mettre à jour des champs spécifiques
{ $set: { name: 'Alice', 'address.city': 'NYC' } }

// $inc — incrémenter/décrémenter
{ $inc: { views: 1, stock: -1 } }

// $push — ajouter à un tableau
{ $push: { tags: 'typescript' } }

// $addToSet — ajouter au tableau seulement si absent
{ $addToSet: { tags: 'typescript' } }

// $pull — supprimer du tableau par valeur
{ $pull: { tags: 'draft' } }

// $pop — supprimer le premier ou dernier élément
{ $pop: { history: -1 } }  // -1 = first, 1 = last

// $unset — supprimer un champ
{ $unset: { legacyField: '' } }

// $currentDate — définir à la date actuelle
{ $currentDate: { updatedAt: true } }
```

## Exemple

**Utilisateur :** Construire une agrégation MongoDB pour trouver les 5 créateurs de contenu avec le plus de vues totales de posts sur les 7 derniers jours, avec leurs informations utilisateur, réparties par catégorie de post.

**Pipeline attendu :**
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
