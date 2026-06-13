---
name: supabase
description: "Supabase: Row Level Security policies, auth integration, realtime subscriptions, Storage, Edge Functions, pgvector"
---

> 🇩🇪 Deutsche Version. [Englische Version](../supabase.md).

# Supabase-Skill

## Wann aktivieren
- Einrichten von Row Level Security (RLS)-Richtlinien für authentifizierungsbewussten Datenzugriff
- Integration von Supabase Auth mit Ihrem Frontend (Session, JWT, OAuth)
- Aufbau von Echtzeit-Features (Live-Updates, kollaboratives Bearbeiten, Chat)
- Verwendung von Supabase Storage für Datei-Uploads mit Zugriffsrichtlinien
- Schreiben von Supabase Edge Functions (Deno-basiert, serverlos)
- Einrichten von Vektorsuche mit `pgvector` auf Supabase

## Wann nicht verwenden
- Standard-PostgreSQL-Abfragen ohne Supabase-spezifische Features — verwenden Sie den SQL-Skill
- Projekte, die Supabase nicht verwenden (der JS-Client und RLS-Muster sind Supabase-spezifisch)
- Komplexe Auth-Flows, die besser zu Auth0 oder Clerk passen

## Anweisungen

### Client-Einrichtung

```typescript
// lib/supabase/client.ts — Browser-Client (verwendet die Session des Benutzers)
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// lib/supabase/server.ts — Server-Client (verwendet Cookies, für Server Components)
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

### Row Level Security — das kritische Muster

RLS ist das am häufigsten falsch konfigurierte Supabase-Feature. Jede Tabelle benötigt Richtlinien.

```sql
-- RLS auf jeder Tabelle aktivieren (Standard: alles verweigern)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Benutzer können nur ihre eigenen Beiträge lesen
CREATE POLICY "users can read own posts"
ON posts FOR SELECT
USING (auth.uid() = user_id);

-- Benutzer können nur ihre eigenen Beiträge einfügen (serverseitig erzwungen)
CREATE POLICY "users can insert own posts"
ON posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Benutzer können nur ihre eigenen Beiträge aktualisieren
CREATE POLICY "users can update own posts"
ON posts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Benutzer können nur ihre eigenen Beiträge löschen
CREATE POLICY "users can delete own posts"
ON posts FOR DELETE
USING (auth.uid() = user_id);
```

**Häufige RLS-Muster:**

```sql
-- Öffentliches Lesen, authentifiziertes Schreiben
CREATE POLICY "public read" ON articles FOR SELECT USING (true);
CREATE POLICY "auth write"  ON articles FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Team-basierter Zugriff (Benutzer gehört zur gleichen Organisation)
CREATE POLICY "team members can read"
ON projects FOR SELECT
USING (
  org_id IN (
    SELECT org_id FROM org_members WHERE user_id = auth.uid()
  )
);

-- Admin-Bypass
CREATE POLICY "admins can do anything"
ON posts FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Service-Role-Bypass (für serverseitige Admin-Operationen)
-- Verwenden Sie den supabase.service_role-Client — umgeht RLS vollständig
```

**RLS-Richtlinien testen:**
```sql
-- Einen bestimmten Benutzer simulieren, um seine Richtlinien zu testen
SET LOCAL role = authenticated;
SET LOCAL "request.jwt.claims" = '{"sub": "user-uuid-here"}';

SELECT * FROM posts; -- sollte nur die Beiträge dieses Benutzers zurückgeben
```

### Auth-Integration (Next.js App Router)

```typescript
// app/auth/callback/route.ts — OAuth-Callback verarbeiten
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

// middleware.ts — Routen schützen
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
// Client-seitige Auth-Aktionen
const supabase = createClient()

// Mit OAuth anmelden
await supabase.auth.signInWithOAuth({ provider: 'github' })

// Mit E-Mail/Passwort anmelden
const { data, error } = await supabase.auth.signInWithPassword({
  email, password
})

// Abmelden
await supabase.auth.signOut()

// Aktuellen Benutzer abrufen (Client-seitig)
const { data: { user } } = await supabase.auth.getUser()
```

### Echtzeit-Abonnements

```typescript
'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function LiveMessages({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const supabase = createClient()

  useEffect(() => {
    // Neue Nachrichten in diesem Raum abonnieren
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
// Eine Datei hochladen
const supabase = createClient()
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.png`, file, {
    cacheControl: '3600',
    upsert: true,
  })

// Eine öffentliche URL abrufen
const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(`${userId}/avatar.png`)

// Eine signierte URL abrufen (für private Buckets)
const { data: { signedUrl } } = await supabase.storage
  .from('private-docs')
  .createSignedUrl(`${userId}/doc.pdf`, 3600) // läuft in 1 Stunde ab
```

**Storage-RLS-Richtlinien:**
```sql
-- Benutzer können in ihren eigenen Ordner hochladen
CREATE POLICY "users upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Öffentliches Lesen für den avatars-Bucket
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
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // Service-Role umgeht RLS
  )

  const { record } = await req.json() // von einem Datenbank-Webhook

  await sendEmail({
    to: record.email,
    subject: 'Willkommen!',
    body: `Hallo ${record.name}, willkommen in unserer App.`,
  })

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

```bash
# Bereitstellen
supabase functions deploy send-welcome-email

# Lokal testen
supabase functions serve send-welcome-email
curl -X POST http://localhost:54321/functions/v1/send-welcome-email \
  -H "Authorization: Bearer $ANON_KEY" \
  -d '{"record": {"email": "test@example.com", "name": "Test"}}'
```

### pgvector für semantische Suche

```sql
-- Aktivieren
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabelle
CREATE TABLE documents (
  id        BIGSERIAL PRIMARY KEY,
  content   TEXT NOT NULL,
  metadata  JSONB,
  embedding vector(1536)
);

-- Match-Funktion (vom JS-Client aufrufen)
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
// Vom JS-Client aufrufen (RLS gilt automatisch)
const { data } = await supabase.rpc('match_documents', {
  query_embedding: embedding, // float[]
  match_count: 5,
  match_threshold: 0.5,
})
```

### Typ-Generierung

```bash
# TypeScript-Typen aus Ihrem Datenbankschema generieren
supabase gen types typescript --project-id your-project-id > lib/supabase/types.ts

# oder lokal
supabase gen types typescript --local > lib/supabase/types.ts
```

```typescript
// Generierte Typen für vollständige Typsicherheit verwenden
import type { Database } from '@/lib/supabase/types'
type Post = Database['public']['Tables']['posts']['Row']
```

## Beispiel

**Benutzer:** Eine mandantenfähige Notizen-App erstellen — Benutzer können nur ihre eigenen Notizen sehen, mit Echtzeit-Updates und Dateianhängen.

**Erwartete Ausgabe:**
- SQL: `notes`-Tabelle mit RLS (SELECT/INSERT/UPDATE/DELETE-Richtlinien mit `auth.uid()`)
- SQL: `storage.objects`-Richtlinie für den `note-attachments`-Bucket, auf den Benutzerordner beschränkt
- `lib/supabase/client.ts` und `server.ts` — SSR-kompatible Clients
- `app/notes/page.tsx` — Server Component zum Abrufen von Notizen (benutzerbeschränkt via RLS)
- `components/notes-live.tsx` — Client Component mit `postgres_changes`-Abonnement
- `components/upload.tsx` — Datei-Upload in den Ordner des Benutzers mit signierter URL-Abfrage

---
