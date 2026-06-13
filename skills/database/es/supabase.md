---
name: supabase
description: "Supabase: Row Level Security policies, auth integration, realtime subscriptions, Storage, Edge Functions, pgvector"
---

> 🇪🇸 Versión en español. [Versión en inglés](../supabase.md).

# Habilidad Supabase

## Cuándo activar
- Configurar políticas de Row Level Security (RLS) para acceso a datos con conciencia de autenticación
- Integrar Supabase Auth con su frontend (sesión, JWT, OAuth)
- Construir funcionalidades en tiempo real (actualizaciones en vivo, edición colaborativa, chat)
- Usar Supabase Storage para cargas de archivos con políticas de acceso
- Escribir Supabase Edge Functions (serverless basado en Deno)
- Configurar búsqueda vectorial con `pgvector` en Supabase

## Cuándo no usar
- Consultas PostgreSQL estándar sin funcionalidades específicas de Supabase — use la habilidad SQL
- Proyectos que no usan Supabase (el cliente JS y los patrones RLS son específicos de Supabase)
- Flujos de autenticación complejos más adecuados para Auth0 o Clerk

## Instrucciones

### Configuración del cliente

```typescript
// lib/supabase/client.ts — cliente de navegador (usa la sesión del usuario)
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// lib/supabase/server.ts — cliente de servidor (usa cookies, para Server Components)
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

### Row Level Security — el patrón crítico

RLS es la funcionalidad de Supabase más frecuentemente mal configurada. Cada tabla necesita políticas.

```sql
-- Habilitar RLS en cada tabla (por defecto: denegar todo)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Los usuarios solo pueden leer sus propias publicaciones
CREATE POLICY "users can read own posts"
ON posts FOR SELECT
USING (auth.uid() = user_id);

-- Los usuarios solo pueden insertar sus propias publicaciones (aplicado en el servidor)
CREATE POLICY "users can insert own posts"
ON posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Los usuarios solo pueden actualizar sus propias publicaciones
CREATE POLICY "users can update own posts"
ON posts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Los usuarios solo pueden eliminar sus propias publicaciones
CREATE POLICY "users can delete own posts"
ON posts FOR DELETE
USING (auth.uid() = user_id);
```

**Patrones RLS comunes:**

```sql
-- Lectura pública, escritura autenticada
CREATE POLICY "public read" ON articles FOR SELECT USING (true);
CREATE POLICY "auth write"  ON articles FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Acceso basado en equipo (el usuario pertenece a la misma organización)
CREATE POLICY "team members can read"
ON projects FOR SELECT
USING (
  org_id IN (
    SELECT org_id FROM org_members WHERE user_id = auth.uid()
  )
);

-- Omisión de administrador
CREATE POLICY "admins can do anything"
ON posts FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Omisión de service role (para operaciones de administración en el servidor)
-- Use el cliente supabase.service_role — omite RLS completamente
```

**Probar políticas RLS:**
```sql
-- Simular un usuario específico para probar sus políticas
SET LOCAL role = authenticated;
SET LOCAL "request.jwt.claims" = '{"sub": "user-uuid-here"}';

SELECT * FROM posts; -- solo debe devolver las publicaciones de este usuario
```

### Integración Auth (Next.js App Router)

```typescript
// app/auth/callback/route.ts — manejar el callback OAuth
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

// middleware.ts — proteger rutas
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
// Acciones de autenticación del lado del cliente
const supabase = createClient()

// Iniciar sesión con OAuth
await supabase.auth.signInWithOAuth({ provider: 'github' })

// Iniciar sesión con correo/contraseña
const { data, error } = await supabase.auth.signInWithPassword({
  email, password
})

// Cerrar sesión
await supabase.auth.signOut()

// Obtener el usuario actual (lado del cliente)
const { data: { user } } = await supabase.auth.getUser()
```

### Suscripciones en tiempo real

```typescript
'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function LiveMessages({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const supabase = createClient()

  useEffect(() => {
    // Suscribirse a nuevos mensajes en esta sala
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
// Subir un archivo
const supabase = createClient()
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.png`, file, {
    cacheControl: '3600',
    upsert: true,
  })

// Obtener una URL pública
const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(`${userId}/avatar.png`)

// Obtener una URL firmada (para buckets privados)
const { data: { signedUrl } } = await supabase.storage
  .from('private-docs')
  .createSignedUrl(`${userId}/doc.pdf`, 3600) // expira en 1 hora
```

**Políticas RLS para Storage:**
```sql
-- Los usuarios pueden subir a su propia carpeta
CREATE POLICY "users upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Lectura pública para el bucket de avatares
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
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // service role omite RLS
  )

  const { record } = await req.json() // desde un webhook de base de datos

  await sendEmail({
    to: record.email,
    subject: '¡Bienvenido!',
    body: `Hola ${record.name}, bienvenido a nuestra aplicación.`,
  })

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

```bash
# Desplegar
supabase functions deploy send-welcome-email

# Probar localmente
supabase functions serve send-welcome-email
curl -X POST http://localhost:54321/functions/v1/send-welcome-email \
  -H "Authorization: Bearer $ANON_KEY" \
  -d '{"record": {"email": "test@example.com", "name": "Test"}}'
```

### pgvector para búsqueda semántica

```sql
-- Habilitar
CREATE EXTENSION IF NOT EXISTS vector;

-- Tabla
CREATE TABLE documents (
  id        BIGSERIAL PRIMARY KEY,
  content   TEXT NOT NULL,
  metadata  JSONB,
  embedding vector(1536)
);

-- Función de coincidencia (llamar desde el cliente JS)
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
// Llamar desde el cliente JS (RLS se aplica automáticamente)
const { data } = await supabase.rpc('match_documents', {
  query_embedding: embedding, // float[]
  match_count: 5,
  match_threshold: 0.5,
})
```

### Generación de tipos

```bash
# Generar tipos TypeScript desde su esquema de base de datos
supabase gen types typescript --project-id your-project-id > lib/supabase/types.ts

# o localmente
supabase gen types typescript --local > lib/supabase/types.ts
```

```typescript
// Usar los tipos generados para seguridad de tipos completa
import type { Database } from '@/lib/supabase/types'
type Post = Database['public']['Tables']['posts']['Row']
```

## Ejemplo

**Usuario:** Construir una aplicación de notas multi-tenant — los usuarios solo pueden ver sus propias notas, con actualizaciones en tiempo real y archivos adjuntos.

**Salida esperada:**
- SQL: tabla `notes` con RLS (políticas SELECT/INSERT/UPDATE/DELETE usando `auth.uid()`)
- SQL: política `storage.objects` para el bucket `note-attachments` limitada a la carpeta del usuario
- `lib/supabase/client.ts` y `server.ts` — clientes compatibles con SSR
- `app/notes/page.tsx` — Server Component que obtiene notas (limitadas al usuario via RLS)
- `components/notes-live.tsx` — Client Component con suscripción `postgres_changes`
- `components/upload.tsx` — carga de archivos a la carpeta del usuario con recuperación de URL firmada

---
