---
name: supabase
description: "Supabase: Row Level Security policies, auth integration, realtime subscriptions, Storage, Edge Functions, pgvector"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../supabase.md).

# Supabase-vaardigheid

## Wanneer activeren
- Row Level Security (RLS)-beleidsregels instellen voor authenticatie-bewuste gegevenstoegang
- Supabase Auth integreren met uw frontend (sessie, JWT, OAuth)
- Realtime-functies bouwen (live updates, collaboratief bewerken, chat)
- Supabase Storage gebruiken voor bestandsuploads met toegangsbeleid
- Supabase Edge Functions schrijven (Deno-gebaseerd, serverloos)
- Vectorzoeken instellen met `pgvector` op Supabase

## Wanneer niet gebruiken
- Standaard PostgreSQL-queries zonder Supabase-specifieke functies — gebruik de SQL-vaardigheid
- Projecten die geen gebruik maken van Supabase (de JS-client en RLS-patronen zijn Supabase-specifiek)
- Complexe auth-stromen die beter passen bij Auth0 of Clerk

## Instructies

### Clientinstellingen

```typescript
// lib/supabase/client.ts — browserclient (gebruikt de sessie van de gebruiker)
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// lib/supabase/server.ts — serverclient (gebruikt cookies, voor Server Components)
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

### Row Level Security — het kritieke patroon

RLS is de meest verkeerd geconfigureerde Supabase-functie. Elke tabel heeft beleidsregels nodig.

```sql
-- RLS inschakelen op elke tabel (standaard: alles weigeren)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Gebruikers kunnen alleen hun eigen berichten lezen
CREATE POLICY "users can read own posts"
ON posts FOR SELECT
USING (auth.uid() = user_id);

-- Gebruikers kunnen alleen hun eigen berichten invoegen (afgedwongen aan serverzijde)
CREATE POLICY "users can insert own posts"
ON posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Gebruikers kunnen alleen hun eigen berichten bijwerken
CREATE POLICY "users can update own posts"
ON posts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Gebruikers kunnen alleen hun eigen berichten verwijderen
CREATE POLICY "users can delete own posts"
ON posts FOR DELETE
USING (auth.uid() = user_id);
```

**Veelvoorkomende RLS-patronen:**

```sql
-- Openbaar lezen, geverifieerd schrijven
CREATE POLICY "public read" ON articles FOR SELECT USING (true);
CREATE POLICY "auth write"  ON articles FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Teamgebaseerde toegang (gebruiker behoort tot dezelfde organisatie)
CREATE POLICY "team members can read"
ON projects FOR SELECT
USING (
  org_id IN (
    SELECT org_id FROM org_members WHERE user_id = auth.uid()
  )
);

-- Beheerdersomzeiling
CREATE POLICY "admins can do anything"
ON posts FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Service role-omzeiling (voor serversijdige beheerdersoperaties)
-- Gebruik de supabase.service_role-client — omzeilt RLS volledig
```

**RLS-beleidsregels testen:**
```sql
-- Een specifieke gebruiker simuleren om zijn beleidsregels te testen
SET LOCAL role = authenticated;
SET LOCAL "request.jwt.claims" = '{"sub": "user-uuid-here"}';

SELECT * FROM posts; -- mag alleen berichten van deze gebruiker teruggeven
```

### Auth-integratie (Next.js App Router)

```typescript
// app/auth/callback/route.ts — OAuth-callback verwerken
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

// middleware.ts — routes beveiligen
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
// Clientzijdige auth-acties
const supabase = createClient()

// Aanmelden met OAuth
await supabase.auth.signInWithOAuth({ provider: 'github' })

// Aanmelden met e-mail/wachtwoord
const { data, error } = await supabase.auth.signInWithPassword({
  email, password
})

// Afmelden
await supabase.auth.signOut()

// Huidige gebruiker ophalen (clientzijde)
const { data: { user } } = await supabase.auth.getUser()
```

### Realtime-abonnementen

```typescript
'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function LiveMessages({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const supabase = createClient()

  useEffect(() => {
    // Abonneren op nieuwe berichten in deze kamer
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
// Een bestand uploaden
const supabase = createClient()
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.png`, file, {
    cacheControl: '3600',
    upsert: true,
  })

// Een openbare URL ophalen
const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(`${userId}/avatar.png`)

// Een ondertekende URL ophalen (voor privé-buckets)
const { data: { signedUrl } } = await supabase.storage
  .from('private-docs')
  .createSignedUrl(`${userId}/doc.pdf`, 3600) // verloopt na 1 uur
```

**Storage-RLS-beleidsregels:**
```sql
-- Gebruikers kunnen uploaden naar hun eigen map
CREATE POLICY "users upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Openbaar lezen voor de avatars-bucket
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
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // service role omzeilt RLS
  )

  const { record } = await req.json() // van een database-webhook

  await sendEmail({
    to: record.email,
    subject: 'Welkom!',
    body: `Hallo ${record.name}, welkom bij onze app.`,
  })

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

```bash
# Implementeren
supabase functions deploy send-welcome-email

# Lokaal testen
supabase functions serve send-welcome-email
curl -X POST http://localhost:54321/functions/v1/send-welcome-email \
  -H "Authorization: Bearer $ANON_KEY" \
  -d '{"record": {"email": "test@example.com", "name": "Test"}}'
```

### pgvector voor semantisch zoeken

```sql
-- Inschakelen
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabel
CREATE TABLE documents (
  id        BIGSERIAL PRIMARY KEY,
  content   TEXT NOT NULL,
  metadata  JSONB,
  embedding vector(1536)
);

-- Match-functie (aanroepen vanuit de JS-client)
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
// Aanroepen vanuit de JS-client (RLS geldt automatisch)
const { data } = await supabase.rpc('match_documents', {
  query_embedding: embedding, // float[]
  match_count: 5,
  match_threshold: 0.5,
})
```

### Type-generatie

```bash
# TypeScript-types genereren vanuit uw databaseschema
supabase gen types typescript --project-id your-project-id > lib/supabase/types.ts

# of lokaal
supabase gen types typescript --local > lib/supabase/types.ts
```

```typescript
// Gegenereerde types gebruiken voor volledige typeveiligheid
import type { Database } from '@/lib/supabase/types'
type Post = Database['public']['Tables']['posts']['Row']
```

## Voorbeeld

**Gebruiker:** Een multi-tenant notitie-app bouwen — gebruikers kunnen alleen hun eigen notities zien, met realtime-updates en bestandsbijlagen.

**Verwachte uitvoer:**
- SQL: `notes`-tabel met RLS (SELECT/INSERT/UPDATE/DELETE-beleidsregels met `auth.uid()`)
- SQL: `storage.objects`-beleid voor de `note-attachments`-bucket beperkt tot de gebruikersmap
- `lib/supabase/client.ts` en `server.ts` — SSR-compatibele clients
- `app/notes/page.tsx` — Server Component dat notities ophaalt (gebruikersbegrensd via RLS)
- `components/notes-live.tsx` — Client Component met `postgres_changes`-abonnement
- `components/upload.tsx` — bestandsupload naar de map van de gebruiker met ondertekende URL-ophaling

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — wij bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
