---
name: firebase
description: "Firebase: Firestore database, Authentication, Realtime Database, Cloud Functions, Firebase Storage, and security rules — for web and mobile apps"
updated: 2026-06-13
---

# Firebase Skill

## When to activate
- Building a web or mobile app with Firebase as the backend
- Setting up Firebase Authentication (email, Google, Apple, phone)
- Writing Firestore security rules and data models
- Building Cloud Functions for Firebase
- Implementing real-time features with Firestore listeners or Realtime Database

## When NOT to use
- PostgreSQL-backed apps — use the supabase or neon skills
- Complex relational data — Firestore's document model has limits for highly relational data
- Apps requiring complex SQL queries — Firestore is not a SQL database

## Instructions

### Project setup

```
Set up Firebase for [project type].

Project type: [web app / mobile (Flutter/React Native) / Next.js]
Auth methods: [email/password / Google / Apple / phone / anonymous]
Database: [Firestore / Realtime Database]
Storage: [Firebase Storage for files? yes/no]

Install:
npm install firebase
npm install -D firebase-tools

# Initialize Firebase project
npx firebase-tools login
npx firebase-tools init

firebase.ts (client SDK):
import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
```

### Firestore data model

```
Design a Firestore data model for [application].

Requirements: [describe what data you're storing and how it's accessed]

Firestore data modelling principles:
1. Denormalise for read performance — duplicate data to avoid joins
2. Structure data for your queries — you can't query across collections easily
3. Collections for lists, documents for objects
4. Subcollections for one-to-many relationships

Example — blog application:
/users/{userId}
  name: string
  email: string
  photoUrl: string
  createdAt: Timestamp

/posts/{postId}
  title: string
  content: string
  authorId: string
  authorName: string  // denormalised from users
  tags: string[]
  publishedAt: Timestamp | null
  likes: number

/posts/{postId}/comments/{commentId}
  text: string
  authorId: string
  authorName: string  // denormalised
  createdAt: Timestamp

/users/{userId}/likedPosts/{postId}
  // simple lookup: does this user like this post?
  likedAt: Timestamp

Reading:
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'

// Get single document
const docRef = doc(db, 'posts', postId)
const docSnap = await getDoc(docRef)
if (docSnap.exists()) {
  const post = { id: docSnap.id, ...docSnap.data() }
}

// Query collection
const q = query(
  collection(db, 'posts'),
  where('authorId', '==', userId),
  orderBy('publishedAt', 'desc'),
  limit(20)
)
const querySnap = await getDocs(q)
const posts = querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

// Real-time listener
const unsubscribe = onSnapshot(q, (snapshot) => {
  const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  setPosts(posts)
})
// Call unsubscribe() to stop listening

Writing:
import { addDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'

// Create (auto-ID)
const docRef = await addDoc(collection(db, 'posts'), {
  title, content, authorId,
  createdAt: serverTimestamp(),
})

// Create (specific ID)
await setDoc(doc(db, 'users', userId), { name, email })

// Update (partial)
await updateDoc(doc(db, 'posts', postId), { likes: increment(1) })

// Delete
await deleteDoc(doc(db, 'posts', postId))

Design the data model for my application.
```

### Security rules

```
Write Firestore security rules for [application].

Requirements: [describe who can read/write what]

firestore.rules:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users: read own profile, admins read all
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isOwner(userId) && !request.resource.data.keys().hasAny(['role']);
      allow delete: if isAdmin();
    }
    
    // Posts: public read, author write, admin delete
    match /posts/{postId} {
      allow read: if resource.data.published == true || isOwner(resource.data.authorId);
      allow create: if isAuthenticated() && 
        request.resource.data.authorId == request.auth.uid;
      allow update: if isOwner(resource.data.authorId);
      allow delete: if isOwner(resource.data.authorId) || isAdmin();
      
      // Comments subcollection
      match /comments/{commentId} {
        allow read: if true;  // public
        allow create: if isAuthenticated();
        allow delete: if isOwner(resource.data.authorId) || isAdmin();
      }
    }
  }
}

Write security rules for my data model.
```

### Cloud Functions

```
Write Cloud Functions for [use case].

Use case: [describe — on-document-create / scheduled / HTTP / auth trigger]
Runtime: [Node.js 20]

// functions/src/index.ts
import * as functions from 'firebase-functions/v2'
import * as admin from 'firebase-admin'

admin.initializeApp()
const db = admin.firestore()

// Firestore trigger: on new user document created
export const onUserCreated = functions.firestore
  .onDocumentCreated('users/{userId}', async (event) => {
    const userId = event.params.userId
    const userData = event.data?.data()
    
    if (!userData) return
    
    // Send welcome email via your email service
    await sendWelcomeEmail(userData.email, userData.name)
    
    // Initialise user stats
    await db.doc(`userStats/${userId}`).set({
      postCount: 0,
      followerCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })
  })

// Scheduled function: clean up old sessions daily
export const cleanupOldSessions = functions.scheduler
  .onSchedule('every 24 hours', async () => {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days
    const query = db.collection('sessions').where('lastActive', '<', cutoff)
    const batch = db.batch()
    const snapshot = await query.get()
    snapshot.forEach(doc => batch.delete(doc.ref))
    await batch.commit()
    console.log(`Deleted ${snapshot.size} old sessions`)
  })

// HTTP callable function
export const createPost = functions.https
  .onCall(async (request) => {
    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Must be logged in')
    }
    
    const { title, content } = request.data
    const post = await db.collection('posts').add({
      title, content,
      authorId: request.auth.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })
    
    return { postId: post.id }
  })

Deploy:
npm run build   # in functions/
firebase deploy --only functions

Generate Cloud Functions for my use case.
```

## Example

**User:** Next.js app, users can sign in with Google, create blog posts. Firestore. What's the minimum setup?

**Claude's minimum setup:**

```typescript
// lib/firebase.ts — client
import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const app = !getApps().length ? initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
}) : getApps()[0]

export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

// hooks/useAuth.ts
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'

export function useAuth() {
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    return onAuthStateChanged(auth, setUser)
  }, [])
  
  return {
    user,
    signInWithGoogle: () => signInWithPopup(auth, googleProvider),
    signOut: () => signOut(auth),
  }
}
```

Firestore rules for posts (read public, write authenticated):
```
match /posts/{postId} {
  allow read: if true;
  allow write: if request.auth.uid == request.resource.data.authorId;
}
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
