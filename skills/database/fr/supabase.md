---
name: supabase
description: "Supabase: Row Level Security policies, auth integration, realtime subscriptions, Storage, Edge Functions, pgvector"
---

> 🇫🇷 Version française. [English version](../supabase.md).

# Compétence Supabase

## Quand activer
- Mise en place de politiques Row Level Security (RLS) pour un accès aux données tenant compte de l'authentification
- Intégration de Supabase Auth avec votre frontend (session, JWT, OAuth)
- Construction de fonctionnalités en temps réel (mises à jour en direct, édition collaborative, chat)
- Utilisation de Supabase Storage pour les téléversements de fichiers avec des politiques d'accès
- Écriture de Supabase Edge Functions (serverless basé sur Deno)
- Configuration de la recherche vectorielle avec `pgvector` sur Supabase

## Quand ne pas utiliser
- Requêtes PostgreSQL standard sans fonctionnalités spécifiques à Supabase — utilisez la compétence SQL
- Projets n'utilisant pas Supabase (le client JS et les patterns RLS sont spécifiques à Supabase)
- Flux d'authentification complexes mieux adaptés à Auth0 ou Clerk

## Instructions

### Configuration du client

```typescript
// lib/supabase/client.ts — client navigateur (utilise la session de l'utilisateur)
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// lib/supabase/server.ts — client serveur (utilise les cookies, pour les Server Components)
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

### Row Level Security — le pattern critique

RLS est la fonctionnalité Supabase la plus souvent mal configurée. Chaque table a besoin de politiques.

```sql
-- Activer RLS sur chaque table (par défaut : tout refuser)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs ne peuvent lire que leurs propres publications
CREATE POLICY "users can read own posts"
ON posts FOR SELECT
USING (auth.uid() = user_id);

-- Les utilisateurs ne peuvent insérer que leurs propres publications (appliqué côté serveur)
CREATE POLICY "users can insert own posts"
ON posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs ne peuvent mettre à jour que leurs propres publications
CREATE POLICY "users can update own posts"
ON posts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs ne peuvent supprimer que leurs propres publications
CREATE POLICY "users can delete own posts"
ON posts FOR DELETE
USING (auth.uid() = user_id);
```

**Patterns RLS courants :**

```sql
-- Lecture publique, écriture authentifiée
CREATE POLICY "public read" ON articles FOR SELECT USING (true);
CREATE POLICY "auth write"  ON articles FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Accès basé sur l'équipe (l'utilisateur appartient à la même organisation)
CREATE POLICY "team members can read"
ON projects FOR SELECT
USING (
  org_id IN (
    SELECT org_id FROM org_members WHERE user_id = auth.uid()
  )
);

-- Contournement administrateur
CREATE POLICY "admins can do anything"
ON posts FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Contournement du rôle de service (pour les opérations d'administration côté serveur)
-- Utilisez le client supabase.service_role — contourne entièrement RLS
```

**Tester les politiques RLS :**
```sql
-- Simuler un utilisateur spécifique pour tester ses politiques
SET LOCAL role = authenticated;
SET LOCAL "request.jwt.claims" = '{"sub": "user-uuid-here"}';

SELECT * FROM posts; -- ne devrait retourner que les publications de cet utilisateur
```

### Intégration Auth (Next.js App Router)

```typescript
// app/auth/callback/route.ts — gérer le callback OAuth
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }
  return NextResponse.redirect(`${origin}/dashboard`)
}

// middleware.ts — protéger les routes
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { /* ... */ } }
  )
  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return response
}

export const config = { matcher: ['/dashboard/:path*'] }
```

```typescript
// Actions d'authentification côté client
const supabase = createClient()

// Se connecter avec OAuth
await supabase.auth.signInWithOAuth({ provider: 'github' })

// Se connecter avec email/mot de passe
const { data, error } = await supabase.auth.signInWithPassword({
  email, password
})

// Se déconnecter
await supabase.auth.signOut()

// Obtenir l'utilisateur actuel (côté client)
const { data: { user } } = await supabase.auth.getUser()
```

### Abonnements en temps réel

```typescript
'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function LiveMessages({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const supabase = createClient()

  useEffect(() => {
    // S'abonner aux nouveaux messages dans cette salle
    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [roomId])

  return <div>{messages.map(m => <p key={m.id}>{m.content}</p>)}</div>
}
```

### Storage

```typescript
// Téléverser un fichier
const supabase = createClient()
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.png`, file, {
    cacheControl: '3600',
    upsert: true,
  })

// Obtenir une URL publique
const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(`${userId}/avatar.png`)

// Obtenir une URL signée (pour les buckets privés)
const { data: { signedUrl } } = await supabase.storage
  .from('private-docs')
  .createSignedUrl(`${userId}/doc.pdf`, 3600) // expire dans 1 heure
```

**Politiques RLS pour Storage :**
```sql
-- Les utilisateurs peuvent téléverser dans leur propre dossier
CREATE POLICY "users upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Lecture publique pour le bucket avatars
CREATE POLICY "public read avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

### Edge Functions

```typescript
// supabase/functions/send-welcome-email/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // le rôle de service contourne RLS
  )

  const { record } = await req.json() // depuis un webhook de base de données

  await sendEmail({
    to: record.email,
    subject: 'Bienvenue !',
    body: `Bonjour ${record.name}, bienvenue dans notre application.`,
  })

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

```bash
# Déployer
supabase functions deploy send-welcome-email

# Tester en local
supabase functions serve send-welcome-email
curl -X POST http://localhost:54321/functions/v1/send-welcome-email \
  -H "Authorization: Bearer $ANON_KEY" \
  -d '{"record": {"email": "test@example.com", "name": "Test"}}'
```

### pgvector pour la recherche sémantique

```sql
-- Activer
CREATE EXTENSION IF NOT EXISTS vector;

-- Table
CREATE TABLE documents (
  id        BIGSERIAL PRIMARY KEY,
  content   TEXT NOT NULL,
  metadata  JSONB,
  embedding vector(1536)
);

-- Fonction de correspondance (appelée depuis le client JS)
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  match_count     INT DEFAULT 5,
  match_threshold FLOAT DEFAULT 0.5
)
RETURNS TABLE(id BIGINT, content TEXT, metadata JSONB, similarity FLOAT)
LANGUAGE SQL STABLE
AS $$
  SELECT id, content, metadata,
         1 - (embedding <=> query_embedding) AS similarity
  FROM documents
  WHERE 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
```

```typescript
// Appeler depuis le client JS (RLS s'applique automatiquement)
const { data } = await supabase.rpc('match_documents', {
  query_embedding: embedding, // float[]
  match_count: 5,
  match_threshold: 0.5,
})
```

### Génération de types

```bash
# Générer des types TypeScript depuis votre schéma de base de données
supabase gen types typescript --project-id your-project-id > lib/supabase/types.ts

# ou en local
supabase gen types typescript --local > lib/supabase/types.ts
```

```typescript
// Utiliser les types générés pour une sécurité de type complète
import type { Database } from '@/lib/supabase/types'
type Post = Database['public']['Tables']['posts']['Row']
```

## Exemple

**Utilisateur :** Construire une application de notes multi-tenant — les utilisateurs ne peuvent voir que leurs propres notes, avec des mises à jour en temps réel et des pièces jointes.

**Résultat attendu :**
- SQL : table `notes` avec RLS (politiques SELECT/INSERT/UPDATE/DELETE utilisant `auth.uid()`)
- SQL : politique `storage.objects` pour le bucket `note-attachments` limitée au dossier utilisateur
- `lib/supabase/client.ts` et `server.ts` — clients compatibles SSR
- `app/notes/page.tsx` — Server Component récupérant les notes (limitées à l'utilisateur via RLS)
- `components/notes-live.tsx` — Client Component avec abonnement `postgres_changes`
- `components/upload.tsx` — téléversement de fichiers dans le dossier de l'utilisateur avec récupération d'URL signée

---
