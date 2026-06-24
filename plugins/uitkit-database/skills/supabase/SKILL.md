---
name: "supabase"
description: "Supabase: Row Level Security policies, auth integration, realtime subscriptions, Storage, Edge Functions, pgvector"
---

# Supabase Skill

## When to activate
- Setting up Row Level Security (RLS) policies for auth-aware data access
- Integrating Supabase Auth with your frontend (session, JWT, OAuth)
- Building realtime features (live updates, collaborative editing, chat)
- Using Supabase Storage for file uploads with access policies
- Writing Supabase Edge Functions (Deno-based serverless)
- Setting up vector search with `pgvector` on Supabase

## When NOT to use
- Standard PostgreSQL queries without Supabase-specific features — use the SQL skill
- Projects not using Supabase (the JS client and RLS patterns are Supabase-specific)
- Complex auth flows better suited to Auth0 or Clerk

## Instructions

### Client setup

```typescript
// lib/supabase/client.ts — browser client (uses user's session)
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// lib/supabase/server.ts — server client (uses cookies, for Server Components)
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

### Row Level Security — the critical pattern

RLS is the most commonly misconfigured Supabase feature. Every table needs policies.

```sql
-- Enable RLS on every table (default: deny all)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Users can only read their own posts
CREATE POLICY "users can read own posts"
ON posts FOR SELECT
USING (auth.uid() = user_id);

-- Users can only insert their own posts (enforced server-side)
CREATE POLICY "users can insert own posts"
ON posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update only their own posts
CREATE POLICY "users can update own posts"
ON posts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete only their own posts
CREATE POLICY "users can delete own posts"
ON posts FOR DELETE
USING (auth.uid() = user_id);
```

**Common RLS patterns:**

```sql
-- Public read, authenticated write
CREATE POLICY "public read" ON articles FOR SELECT USING (true);
CREATE POLICY "auth write"  ON articles FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Team-based access (user belongs to same org)
CREATE POLICY "team members can read"
ON projects FOR SELECT
USING (
  org_id IN (
    SELECT org_id FROM org_members WHERE user_id = auth.uid()
  )
);

-- Admin bypass
CREATE POLICY "admins can do anything"
ON posts FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Service role bypass (for server-side admin operations)
-- Use supabase.service_role client — bypasses RLS entirely
```

**Testing RLS policies:**
```sql
-- Simulate a specific user to test their policies
SET LOCAL role = authenticated;
SET LOCAL "request.jwt.claims" = '{"sub": "user-uuid-here"}';

SELECT * FROM posts; -- should only return this user's posts
```

### Auth integration (Next.js App Router)

```typescript
// app/auth/callback/route.ts — handle OAuth callback
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

// middleware.ts — protect routes
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
// Client-side auth actions
const supabase = createClient()

// Sign in with OAuth
await supabase.auth.signInWithOAuth({ provider: 'github' })

// Sign in with email/password
const { data, error } = await supabase.auth.signInWithPassword({
  email, password
})

// Sign out
await supabase.auth.signOut()

// Get current user (client-side)
const { data: { user } } = await supabase.auth.getUser()
```

### Realtime subscriptions

```typescript
'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function LiveMessages({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const supabase = createClient()

  useEffect(() => {
    // Subscribe to new messages in this room
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
// Upload a file
const supabase = createClient()
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.png`, file, {
    cacheControl: '3600',
    upsert: true,
  })

// Get a public URL
const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(`${userId}/avatar.png`)

// Get a signed URL (for private buckets)
const { data: { signedUrl } } = await supabase.storage
  .from('private-docs')
  .createSignedUrl(`${userId}/doc.pdf`, 3600) // expires in 1 hour
```

**Storage RLS policies:**
```sql
-- Users can upload to their own folder
CREATE POLICY "users upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Public read for avatars bucket
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
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // service role bypasses RLS
  )

  const { record } = await req.json() // from a database webhook

  await sendEmail({
    to: record.email,
    subject: 'Welcome!',
    body: `Hi ${record.name}, welcome to our app.`,
  })

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

```bash
# Deploy
supabase functions deploy send-welcome-email

# Test locally
supabase functions serve send-welcome-email
curl -X POST http://localhost:54321/functions/v1/send-welcome-email \
  -H "Authorization: Bearer $ANON_KEY" \
  -d '{"record": {"email": "test@example.com", "name": "Test"}}'
```

### pgvector for semantic search

```sql
-- Enable
CREATE EXTENSION IF NOT EXISTS vector;

-- Table
CREATE TABLE documents (
  id        BIGSERIAL PRIMARY KEY,
  content   TEXT NOT NULL,
  metadata  JSONB,
  embedding vector(1536)
);

-- Match function (call from JS client)
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
// Call from the JS client (RLS applies automatically)
const { data } = await supabase.rpc('match_documents', {
  query_embedding: embedding, // float[]
  match_count: 5,
  match_threshold: 0.5,
})
```

### Type generation

```bash
# Generate TypeScript types from your database schema
supabase gen types typescript --project-id your-project-id > lib/supabase/types.ts

# or locally
supabase gen types typescript --local > lib/supabase/types.ts
```

```typescript
// Use generated types for full type safety
import type { Database } from '@/lib/supabase/types'
type Post = Database['public']['Tables']['posts']['Row']
```

## Example

**User:** Build a multi-tenant notes app — users can only see their own notes, with realtime updates and file attachments.

**Expected output:**
- SQL: `notes` table with RLS (SELECT/INSERT/UPDATE/DELETE policies using `auth.uid()`)
- SQL: `storage.objects` policy for `note-attachments` bucket scoped to user folder
- `lib/supabase/client.ts` and `server.ts` — SSR-compatible clients
- `app/notes/page.tsx` — Server Component fetching notes (user-scoped via RLS)
- `components/notes-live.tsx` — Client Component with `postgres_changes` subscription
- `components/upload.tsx` — file upload to user's folder with signed URL retrieval

---
