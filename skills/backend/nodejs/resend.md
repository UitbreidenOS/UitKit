---
name: resend
description: "Resend email API: transactional emails, React Email templates, email verification, password reset, notification emails, and webhook handling"
---

# Resend Skill

## When to activate
- Sending transactional emails from a Node.js/Next.js application
- Building email templates with React Email
- Implementing email verification, password reset, or notification flows
- Handling Resend webhooks (delivery, bounce, complaint events)
- Migrating from SendGrid, Postmark, or AWS SES to Resend

## When NOT to use
- Marketing email campaigns — use a dedicated ESP like Mailchimp or Brevo
- Email newsletters — Resend is for transactional, not bulk marketing
- SMS — use Twilio

## Instructions

### Setup

```
Set up Resend for [project].

Framework: [Next.js / Express / Hono / other Node.js]
Email types needed: [welcome / verification / password reset / notification / all]

Install:
npm install resend react-email @react-email/components

Get API key: resend.com → API Keys → Create API Key

Environment:
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=no-reply@yourdomain.com  # must be verified domain

Verify your domain: Resend dashboard → Domains → Add domain → follow DNS setup
```

### Send a transactional email

```
Send [email type] using Resend.

Email type: [welcome / verification / password-reset / notification]
Framework: [Next.js Server Action / Express route / API route]

Basic send (plain text/HTML):
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const { data, error } = await resend.emails.send({
  from: 'MyApp <no-reply@yourdomain.com>',
  to: [user.email],
  subject: 'Welcome to MyApp',
  html: '<h1>Welcome!</h1><p>Thanks for signing up.</p>',
  // text: 'Welcome! Thanks for signing up.',  // plain text fallback
})

if (error) {
  console.error('Email send failed:', error)
  throw new Error('Failed to send welcome email')
}

console.log('Email sent, ID:', data?.id)

Next.js Server Action:
'use server'
import { Resend } from 'resend'
import { WelcomeEmail } from '@/emails/WelcomeEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(email: string, name: string) {
  const { data, error } = await resend.emails.send({
    from: 'MyApp <no-reply@yourdomain.com>',
    to: [email],
    subject: 'Welcome to MyApp',
    react: <WelcomeEmail name={name} />,
  })
  
  if (error) throw new Error(error.message)
  return data?.id
}

Generate the send function for my email type.
```

### React Email templates

```
Create a React Email template for [email type].

Email type: [welcome / verification / password-reset / notification]
Brand: [company name, primary colour]
Content: [describe what the email should contain]

emails/WelcomeEmail.tsx:
import {
  Body, Button, Container, Head, Heading,
  Html, Preview, Section, Text
} from '@react-email/components'

interface WelcomeEmailProps {
  name: string
  loginUrl: string
}

export function WelcomeEmail({ name, loginUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to MyApp, {name}!</Preview>
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <Section style={{ backgroundColor: 'white', borderRadius: '8px', padding: '32px' }}>
            <Heading style={{ color: '#0a0a0a', fontSize: '24px' }}>
              Welcome, {name}! 👋
            </Heading>
            <Text style={{ color: '#6b7280', fontSize: '16px', lineHeight: '24px' }}>
              Thanks for joining MyApp. Your account is ready — get started by logging in.
            </Text>
            <Button
              href={loginUrl}
              style={{
                backgroundColor: '#f97316',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '6px',
                fontSize: '16px',
                fontWeight: 'bold',
                textDecoration: 'none',
              }}
            >
              Get started
            </Button>
            <Text style={{ color: '#9ca3af', fontSize: '14px', marginTop: '24px' }}>
              If you didn't create an account, ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

WelcomeEmail.PreviewProps = {
  name: 'Alice',
  loginUrl: 'https://myapp.com/login',
}

Preview locally:
npx email dev  # opens localhost:3000 with live preview

Generate the template for my email type.
```

### Email verification flow

```
Implement email verification for [auth system].

Auth: [Better Auth / NextAuth / custom]

// 1. Generate verification token (on signup)
import { randomBytes } from 'crypto'

async function sendVerificationEmail(userId: string, email: string) {
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)  // 24 hours
  
  // Store token in database
  await db.insert(emailVerifications).values({ userId, token, expiresAt })
  
  const verifyUrl = `${process.env.APP_URL}/verify-email?token=${token}`
  
  await resend.emails.send({
    from: 'MyApp <no-reply@yourdomain.com>',
    to: [email],
    subject: 'Verify your email address',
    react: <VerifyEmailTemplate name={userName} verifyUrl={verifyUrl} />,
  })
}

// 2. Verify token (on link click)
async function verifyEmail(token: string) {
  const record = await db.query.emailVerifications.findFirst({
    where: eq(emailVerifications.token, token),
  })
  
  if (!record) throw new Error('Invalid or expired token')
  if (record.expiresAt < new Date()) throw new Error('Token expired')
  
  await db.update(users)
    .set({ emailVerified: true })
    .where(eq(users.id, record.userId))
  
  await db.delete(emailVerifications)
    .where(eq(emailVerifications.token, token))
  
  return { userId: record.userId }
}

Generate the verification flow for my auth system.
```

### Webhook handling

```
Handle Resend webhooks for [events].

Events: [delivered / bounced / complained / opened / clicked]

// Set webhook URL in Resend dashboard: Webhooks → Add Endpoint
// URL: https://yourdomain.com/api/webhooks/resend

// app/api/webhooks/resend/route.ts (Next.js)
import { NextRequest } from 'next/server'
import { Webhook } from 'svix'

const webhookSecret = process.env.RESEND_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const payload = await req.text()
  const headers = {
    'svix-id': req.headers.get('svix-id')!,
    'svix-timestamp': req.headers.get('svix-timestamp')!,
    'svix-signature': req.headers.get('svix-signature')!,
  }
  
  // Verify signature
  const webhook = new Webhook(webhookSecret)
  let event: any
  try {
    event = webhook.verify(payload, headers)
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }
  
  switch (event.type) {
    case 'email.delivered':
      await db.update(emailLog)
        .set({ status: 'delivered', deliveredAt: new Date() })
        .where(eq(emailLog.resendId, event.data.email_id))
      break
      
    case 'email.bounced':
      await db.update(users)
        .set({ emailBounced: true })
        .where(eq(users.email, event.data.to[0]))
      break
      
    case 'email.complained':
      // Unsubscribe user from marketing (not transactional)
      await unsubscribeUser(event.data.to[0])
      break
  }
  
  return new Response(null, { status: 200 })
}

Generate webhook handling for my events.
```

## Example

**User:** Next.js + Drizzle + Better Auth. I need to send a password reset email. Show me the complete flow.

**Claude's output:**

```typescript
// lib/email.ts
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

// emails/PasswordResetEmail.tsx
export function PasswordResetEmail({ resetUrl }: { resetUrl: string }) {
  return (
    <Html>
      <Body style={{ fontFamily: 'Arial, sans-serif' }}>
        <Container>
          <Heading>Reset your password</Heading>
          <Text>Click the button below — this link expires in 1 hour.</Text>
          <Button href={resetUrl} style={{ background: '#f97316', color: 'white', padding: '12px 24px' }}>
            Reset password
          </Button>
          <Text style={{ color: '#9ca3af' }}>
            If you didn't request this, ignore this email. Your password won't change.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// app/api/auth/forgot-password/route.ts
export async function POST(req: Request) {
  const { email } = await req.json()
  const user = await db.query.users.findFirst({ where: eq(users.email, email) })
  
  // Always return 200 — don't reveal if email exists
  if (!user) return new Response(null, { status: 200 })
  
  const token = randomBytes(32).toString('hex')
  await db.insert(passwordResets).values({
    userId: user.id, token,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),  // 1 hour
  })
  
  await resend.emails.send({
    from: 'MyApp <no-reply@yourdomain.com>',
    to: [email],
    subject: 'Reset your password',
    react: <PasswordResetEmail resetUrl={`${process.env.APP_URL}/reset-password?token=${token}`} />,
  })
  
  return new Response(null, { status: 200 })
}
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
