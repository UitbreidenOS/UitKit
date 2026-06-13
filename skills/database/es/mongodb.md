---
name: mongodb
description: "MongoDB patterns: schema design, aggregation pipeline, indexes, transactions, Atlas Search, Mongoose vs native driver"
---

> 🇪🇸 Versión en español. [Versión en inglés](../mongodb.md).

# Skill MongoDB

## Cuándo activar
- Diseñar un esquema MongoDB (incrustación vs. referencia)
- Escribir aggregation pipelines para consultas complejas
- Configurar indexes para el rendimiento de consultas
- Usar transacciones MongoDB en múltiples documentos
- Integrar MongoDB Atlas Search (texto completo)
- Elegir entre Mongoose y el driver nativo

## Cuándo NO usar
- Datos relacionales con muchos joins — usar PostgreSQL
- Cuando se necesitan transacciones ACID a escala — considerar PostgreSQL
- Caché simple de clave-valor — usar Redis
- Análisis de grandes conjuntos de datos — usar un data warehouse

## Instrucciones

### Cuándo incrustar vs. referenciar

**Incrustar cuando:**
- Los datos siempre se acceden juntos (post + sus comentarios si los comentarios son pocos)
- Los datos hijos no tienen ciclo de vida independiente
- El tamaño del array se mantiene acotado (< 100 elementos, raramente crece a miles)

**Referenciar cuando:**
- Los datos se acceden de forma independiente
- El array podría crecer ilimitadamente (todos los pedidos de un usuario)
- Relaciones many-to-many

```javascript
// Incrustado — bueno para dirección (siempre con el usuario, no cambia a menudo)
{
  _id: ObjectId("..."),
  email: "alice@example.com",
  address: {
    street: "123 Main St",
    city: "San Francisco",
    zip: "94105"
  }
}

// Referenciado — bueno para pedidos (muchos, ciclo de vida independiente)
// Documento de usuario
{ _id: ObjectId("user1"), email: "alice@example.com" }

// Documento de pedido (referencia al usuario)
{ _id: ObjectId("order1"), userId: ObjectId("user1"), total: 99.99 }
```

### Driver nativo (Node.js)

```typescript
import { MongoClient, ObjectId } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db('myapp')
const users = db.collection('users')

// Conectar (llamar una vez al inicio)
await client.connect()

// CRUD
const user = await users.findOne({ _id: new ObjectId(id) })
const result = await users.insertOne({ email, name, createdAt: new Date() })
await users.updateOne(
  { _id: new ObjectId(id) },
  { $set: { name }, $currentDate: { updatedAt: true } }
)
await users.deleteOne({ _id: new ObjectId(id) })

// Buscar con proyección y ordenación
const recent = await users
  .find({ active: true })
  .project({ email: 1, name: 1, _id: 0 })
  .sort({ createdAt: -1 })
  .limit(10)
  .toArray()
```

### Mongoose (ODM basado en esquema)

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

// Virtuals (no almacenados en DB)
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

// Consultas
const user = await UserModel.findById(id).lean()  // .lean() = objeto JS simple, más rápido
const users = await UserModel.find({ role: 'admin' }).select('email name').limit(20)
const user = await UserModel.findOneAndUpdate(
  { email },
  { $set: { name } },
  { new: true, runValidators: true }
)
```

### Aggregation pipeline — la función más poderosa de MongoDB

```javascript
// Informe de ventas: ingresos por categoría de los últimos 30 días
db.orders.aggregate([
  // Fase 1: filtrar
  { $match: {
    status: 'completed',
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  }},

  // Fase 2: desplegar array (un documento por artículo)
  { $unwind: '$items' },

  // Fase 3: agrupar por categoría
  { $group: {
    _id: '$items.category',
    totalRevenue: { $sum: { $multiply: ['$items.price', '$items.qty'] } },
    orderCount: { $addToSet: '$_id' },  // count distinct orders
    avgOrderValue: { $avg: '$total' },
  }},

  // Fase 4: proyectar salida limpia
  { $project: {
    category: '$_id',
    totalRevenue: { $round: ['$totalRevenue', 2] },
    orderCount: { $size: '$orderCount' },
    avgOrderValue: { $round: ['$avgOrderValue', 2] },
    _id: 0,
  }},

  // Fase 5: ordenar
  { $sort: { totalRevenue: -1 } },
])
```

**Fases de pipeline comunes:**

| Fase | Uso |
|-------|---------|
| `$match` | Filtrar documentos (colocar temprano para usar indexes) |
| `$group` | Agregar: sum, count, avg, min, max, push |
| `$project` | Remodelar documentos, agregar campos calculados |
| `$unwind` | Aplanar array en múltiples documentos |
| `$lookup` | Left join con otra colección |
| `$sort` | Ordenar resultados |
| `$limit` / `$skip` | Paginación |
| `$facet` | Múltiples agregaciones en una sola pasada |
| `$bucket` | Agrupar en rangos (histograma) |
| `$addFields` | Agregar/modificar campos sin cambiar el resto |

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
// Campo único
db.users.createIndex({ email: 1 }, { unique: true })

// Compuesto (consultar el campo más selectivo primero)
db.orders.createIndex({ userId: 1, createdAt: -1 })

// Index de texto para búsqueda básica
db.posts.createIndex({ title: 'text', content: 'text' }, {
  weights: { title: 10, content: 1 },  // title matches rank higher
  default_language: 'english'
})
db.posts.find({ $text: { $search: 'typescript patterns' } },
              { score: { $meta: 'textScore' } })
       .sort({ score: { $meta: 'textScore' } })

// Index parcial (indexar solo un subconjunto)
db.orders.createIndex(
  { createdAt: 1 },
  { partialFilterExpression: { status: 'pending' } }
)

// Index TTL (auto-eliminar documentos)
db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

### Transacciones

```typescript
// Transacciones multi-documento (requiere replica set)
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

### Operadores de actualización

```javascript
// $set — actualizar campos específicos
{ $set: { name: 'Alice', 'address.city': 'NYC' } }

// $inc — incrementar/decrementar
{ $inc: { views: 1, stock: -1 } }

// $push — añadir al array
{ $push: { tags: 'typescript' } }

// $addToSet — añadir al array solo si no está presente
{ $addToSet: { tags: 'typescript' } }

// $pull — eliminar del array por valor
{ $pull: { tags: 'draft' } }

// $pop — eliminar primer o último elemento
{ $pop: { history: -1 } }  // -1 = first, 1 = last

// $unset — eliminar un campo
{ $unset: { legacyField: '' } }

// $currentDate — establecer a la fecha actual
{ $currentDate: { updatedAt: true } }
```

## Ejemplo

**Usuario:** Construir una agregación MongoDB para encontrar los 5 creadores de contenido con más vistas totales de posts en los últimos 7 días, con su información de usuario, desglosada por categoría de post.

**Pipeline esperado:**
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
