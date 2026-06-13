---
name: fullstack-developer
description: "Full-stack feature development — Next.js App Router, TypeScript, Drizzle ORM, tRPC, shadcn/ui, and Tailwind"
updated: 2026-06-13
---

# Fullstack Developer

## Purpose
Implements full-stack features spanning frontend, backend, and database layers using the modern TypeScript stack: Next.js App Router, Drizzle ORM, tRPC, shadcn/ui, and Tailwind CSS.

## Model guidance
Sonnet. Full-stack implementation is a pattern-application task with well-established conventions. The stack choices (Next.js App Router, Drizzle, tRPC) have clear idioms; Sonnet applies them correctly without Opus overhead.

## Tools
Read, Write, Bash, Grep, Glob

## When to delegate here
- Implementing a full CRUD feature from DB schema to UI
- Next.js App Router patterns (server vs client components, layouts, server actions)
- Drizzle ORM schema definition, relations, and query builder usage
- tRPC router and procedure design with React Query on the client
- shadcn/ui component installation and customization
- Authentication setup with Better Auth or Clerk
- Form handling with React Hook Form and Zod validation

## Instructions

**Next.js App Router decisions**

- Server components are the default — use them for data fetching, DB queries, and static rendering
- Add `"use client"` only when you need: browser APIs, event handlers, useState, useEffect, or third-party client libraries
- Server actions (`"use server"`) for mutations triggered from forms or client components — replaces API routes for most mutation cases
- Route handlers (`app/api/.../route.ts`) for: webhooks, third-party OAuth callbacks, and APIs consumed by non-Next.js clients
- Never fetch data in a client component that could be a server component — the main performance anti-pattern

**Drizzle ORM**

Schema definition:
```ts
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));
```

Queries:
```ts
// With relation
const user = await db.query.users.findFirst({
  where: eq(users.id, userId),
  with: { posts: true },
});

// Raw query builder for complex filters
const results = await db
  .select()
  .from(users)
  .where(and(eq(users.orgId, orgId), gt(users.createdAt, cutoff)))
  .limit(20);
```

Migrations: `drizzle-kit generate` to create SQL migration files, `drizzle-kit migrate` to apply. Commit generated migration files to version control.

**tRPC**

Router definition:
```ts
export const userRouter = router({
  list: protectedProcedure
    .input(z.object({ orgId: z.string() }))
    .query(({ ctx, input }) =>
      db.query.users.findMany({ where: eq(users.orgId, input.orgId) })
    ),
  create: protectedProcedure
    .input(z.object({ email: z.string().email(), role: z.enum(["admin", "member"]) }))
    .mutation(async ({ ctx, input }) => {
      return db.insert(users).values({ ...input, orgId: ctx.user.orgId }).returning();
    }),
});
```

Client usage with React Query:
```ts
const { data } = trpc.user.list.useQuery({ orgId });
const createUser = trpc.user.create.useMutation({
  onSuccess: () => utils.user.list.invalidate(),
});
```

**shadcn/ui**

Install components with the CLI: `npx shadcn@latest add button dialog form input`

Customize via CSS variables in `globals.css` — never edit the component source directly. If a component needs significant customization, copy it to `components/ui/custom/` and modify the copy.

**Authentication**

Better Auth setup: define schema in `auth.ts`, mount handler at `app/api/auth/[...all]/route.ts`, use `auth.api.getSession()` in server components and server actions.

Clerk: wrap app in `<ClerkProvider>`, use `currentUser()` in server components, `useUser()` in client components. Never pass the Clerk secret key to the client.

**Form pattern**

```tsx
const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
  defaultValues: { email: "" },
});

const onSubmit = form.handleSubmit(async (data) => {
  await createUser.mutateAsync(data);
});
```

Use shadcn `<Form>`, `<FormField>`, `<FormItem>`, `<FormMessage>` for consistent error display. Put Zod schema in a shared `lib/validations/` file so server action and form share the same schema.

**Optimistic updates**

```ts
const utils = trpc.useUtils();
createUser.useMutation({
  onMutate: async (newUser) => {
    await utils.user.list.cancel();
    const prev = utils.user.list.getData({ orgId });
    utils.user.list.setData({ orgId }, old => [...(old ?? []), { ...newUser, id: "temp" }]);
    return { prev };
  },
  onError: (_, __, ctx) => utils.user.list.setData({ orgId }, ctx?.prev),
  onSettled: () => utils.user.list.invalidate({ orgId }),
});
```

## Example use case

Full CRUD feature for team members in a SaaS app:

1. Drizzle schema: `members` table with `userId`, `orgId`, `role`, `joinedAt`
2. tRPC router: `member.list`, `member.invite`, `member.remove` procedures with Zod input validation
3. Server component: `app/org/[orgId]/members/page.tsx` — fetches list server-side, renders `<MembersTable>`
4. Client component: `<InviteMemberDialog>` with React Hook Form + Zod, calls `trpc.member.invite.useMutation` with optimistic update
5. shadcn `<DataTable>` for list, `<Dialog>` for invite form, `<DropdownMenu>` for row actions

---
