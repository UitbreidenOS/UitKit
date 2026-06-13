---
name: mongodb
description: "MongoDB patterns: schema design, aggregation pipeline, indexes, transactions, Atlas Search, Mongoose vs native driver"
updated: 2026-06-13
---

# MongoDB Skill

## When to activate
- Designing a MongoDB schema (embedding vs referencing)
- Writing aggregation pipelines for complex queries
- Setting up indexes for query performance
- Using MongoDB transactions across multiple documents
- Integrating MongoDB Atlas Search (full-text)
- Choosing between Mongoose and the native driver

## When NOT to use
- Relational data with many joins — use PostgreSQL
- When you need ACID transactions at scale — consider PostgreSQL
- Simple key-value caching — use Redis
- Analytics on large datasets — use a data warehouse

## Instructions

### When to embed vs reference

**Embed when:**
- Data is always accessed together (post + its comments if comments are few)
- Child data has no independent lifecycle
- Array size stays bounded (< 100 items, rarely grows to thousands)

**Reference when:**
- Data is accessed independently
- Array could grow unboundedly (all orders for a user)
- Many-to-many relationships

```javascript
// Embedded — good for address (always with user, doesn't change often)
{
  _id: ObjectId("..."),
  email: "alice@example.com",
  address: {
    street: "123 Main St",
    city: "San Francisco",
    zip: "94105"
  }
}

// Referenced — good for orders (many, independent lifecycle)
// User document
{ _id: ObjectId("user1"), email: "alice@example.com" }

// Order document (references user)
{ _id: ObjectId("order1"), userId: ObjectId("user1"), total: 99.99 }
```

### Native driver (Node.js)

```typescript
import { MongoClient, ObjectId } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db('myapp')
const users = db.collection('users')

// Connect (call once at startup)
await client.connect()

// CRUD
const user = await users.findOne({ _id: new ObjectId(id) })
const result = await users.insertOne({ email, name, createdAt: new Date() })
await users.updateOne(
  { _id: new ObjectId(id) },
  { $set: { name }, $currentDate: { updatedAt: true } }
)
await users.deleteOne({ _id: new ObjectId(id) })

// Find with projection and sort
const recent = await users
  .find({ active: true })
  .project({ email: 1, name: 1, _id: 0 })
  .sort({ createdAt: -1 })
  .limit(10)
  .toArray()
```

### Mongoose (schema-based ODM)

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

// Virtuals (not stored in DB)
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
const user = await UserModel.findById(id).lean()  // .lean() = plain JS object, faster
const users = await UserModel.find({ role: 'admin' }).select('email name').limit(20)
const user = await UserModel.findOneAndUpdate(
  { email },
  { $set: { name } },
  { new: true, runValidators: true }
)
```

### Aggregation pipeline — the most powerful MongoDB feature

```javascript
// Sales report: revenue by category for the last 30 days
db.orders.aggregate([
  // Stage 1: filter
  { $match: {
    status: 'completed',
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  }},

  // Stage 2: unwind array (one doc per item)
  { $unwind: '$items' },

  // Stage 3: group by category
  { $group: {
    _id: '$items.category',
    totalRevenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
    orderCount: { $addToSet: '$_id' },  // count distinct orders
    avgOrderValue: { $avg: '$total' },
  }},

  // Stage 4: project clean output
  { $project: {
    category: '$_id',
    totalRevenue: { $round: ['$totalRevenue', 2] },
    orderCount: { $size: '$orderCount' },
    avgOrderValue: { $round: ['$avgOrderValue', 2] },
    _id: 0,
  }},

  // Stage 5: sort
  { $sort: { totalRevenue: -1 } },
])
```

**Common pipeline stages:**

| Stage | Use for |
|-------|---------|
| `$match` | Filter documents (put early to use indexes) |
| `$group` | Aggregate: sum, count, avg, min, max, push |
| `$project` | Reshape documents, add computed fields |
| `$unwind` | Flatten array into multiple documents |
| `$lookup` | Left join with another collection |
| `$sort` | Sort results |
| `$limit` / `$skip` | Pagination |
| `$facet` | Multiple aggregations in one pass |
| `$bucket` | Group into ranges (histogram) |
| `$addFields` | Add/modify fields without changing the rest |

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
// Single field
db.users.createIndex({ email: 1 }, { unique: true })

// Compound (query most selective field first)
db.orders.createIndex({ userId: 1, createdAt: -1 })

// Text index for basic search
db.posts.createIndex({ title: 'text', content: 'text' }, {
  weights: { title: 10, content: 1 },  // title matches rank higher
  default_language: 'english'
})
db.posts.find({ $text: { $search: 'typescript patterns' } },
              { score: { $meta: 'textScore' } })
       .sort({ score: { $meta: 'textScore' } })

// Partial index (only index a subset)
db.orders.createIndex(
  { createdAt: 1 },
  { partialFilterExpression: { status: 'pending' } }
)

// TTL index (auto-delete documents)
db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

### Transactions

```typescript
// Multi-document transactions (requires replica set)
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

### Update operators

```javascript
// $set — update specific fields
{ $set: { name: 'Alice', 'address.city': 'NYC' } }

// $inc — increment/decrement
{ $inc: { views: 1, stock: -1 } }

// $push — append to array
{ $push: { tags: 'typescript' } }

// $addToSet — add to array only if not present
{ $addToSet: { tags: 'typescript' } }

// $pull — remove from array by value
{ $pull: { tags: 'draft' } }

// $pop — remove first or last element
{ $pop: { history: -1 } }  // -1 = first, 1 = last

// $unset — remove a field
{ $unset: { legacyField: '' } }

// $currentDate — set to current date
{ $currentDate: { updatedAt: true } }
```

## Example

**User:** Build a MongoDB aggregation to find the top 5 content creators by total post views in the last 7 days, with their user info, broken down by post category.

**Expected pipeline:**
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
