---
name: shadcn
description: "shadcn/ui: install components, customise variants, theming with CSS variables, compose compound components, extend with custom primitives"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../shadcn.md).

# shadcn/ui Vaardigheid

## Wanneer activeren
- shadcn/ui-componenten toevoegen aan een Next.js- of React-project
- De stijl of het gedrag van een bestaand shadcn-component aanpassen
- Nieuwe kleurthema's toevoegen of het standaardthema uitbreiden
- Samengestelde UI-patronen bouwen op shadcn-primitieven (Dialog + Form, enz.)
- Begrijpen waarom een shadcn-component crasht of onjuist wordt weergegeven

## Wanneer NIET gebruiken
- Projecten die een andere componentbibliotheek gebruiken (MUI, Chakra) — niet mengen
- Wanneer u een component nodig heeft die shadcn niet heeft — controleer Radix UI-primitieven direct
- Niet-React-projecten — shadcn is alleen voor React

## Waarom shadcn voor AI-generatie

shadcn/ui kopieert de ruwe componentbroncode naar uw repository in plaats van deze achter een npm-pakket te verbergen. Dit betekent dat Claude de exacte componentcode kan lezen, begrijpen en nauwkeurig aanpassen. Er zijn geen black-box-overschrijvingen — elke knop, dialog en input is een gewoon bestand in `components/ui/`. Dit maakt shadcn de meest AI-leesbare componentbibliotheek die beschikbaar is.

## Instructies

### Installatie (nieuw project)

```bash
# Next.js
npx shadcn@latest init

# Gevraagde opties:
# Stijl: Default (of New York)
# Basiskleur: Slate (of Zinc, Stone, Gray, Neutral)
# CSS-variabelen: Yes
```

### Componenten toevoegen

```bash
# Afzonderlijke componenten toevoegen
npx shadcn@latest add button
npx shadcn@latest add card dialog input label
npx shadcn@latest add form          # bevat react-hook-form-integratie
npx shadcn@latest add table         # bevat TanStack Table
npx shadcn@latest add data-table    # volledige datatabellen met paginering/sortering

# Alles tegelijk toevoegen
npx shadcn@latest add button card dialog input form table badge avatar
```

### Bestandsstructuur na init

```
components/
└── ui/
    ├── button.tsx      # elk component staat hier — bewerkbare broncode
    ├── card.tsx
    ├── dialog.tsx
    ├── input.tsx
    └── ...
lib/
└── utils.ts           # cn()-hulpfunctie (clsx + tailwind-merge)
app/
└── globals.css        # CSS-variabelen voor thema's
```

### Componenten gebruiken

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <span className="text-2xl font-bold">${product.price}</span>
        <Badge variant="secondary">{product.category}</Badge>
        <Button>Add to cart</Button>
      </CardContent>
    </Card>
  )
}
```

### Componentvarianten aanpassen

```typescript
// components/ui/button.tsx — nieuwe variant toevoegen
import { cva } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        // ─── Aangepaste varianten ──────────────────────────────────────────
        success: 'bg-green-600 text-white hover:bg-green-700',
        warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
        brand: 'bg-orange-500 text-white hover:bg-orange-600 shadow-[3px_3px_0_#0a0a0a] border-2 border-black',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-8',
        xl: 'h-12 px-10 text-base',   // aangepaste grootte
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

// Gebruik
<Button variant="brand" size="xl">Get Started</Button>
<Button variant="success">Confirm</Button>
```

### Thema met CSS-variabelen

```css
/* app/globals.css */
@layer base {
  :root {
    /* Standaardwaarden overschrijven om bij uw merk te passen */
    --background: 0 0% 100%;
    --foreground: 224 71.4% 4.1%;
    --primary: 220.9 39.3% 11%;       /* wijzig dit voor merkkleur */
    --primary-foreground: 210 20% 98%;
    --accent: 220 14.3% 95.9%;
    --accent-foreground: 220.9 39.3% 11%;
    --border: 220 13% 91%;
    --radius: 0.5rem;                  /* border-radius-schaal */
  }

  /* Oranje merkthema */
  :root[data-theme="orange"] {
    --primary: 24.6 95% 53.1%;         /* orange-500 */
    --primary-foreground: 60 9.1% 97.8%;
    --accent: 24.6 95% 95%;
    --ring: 24.6 95% 53.1%;
  }

  .dark {
    --background: 224 71.4% 4.1%;
    --foreground: 210 20% 98%;
    --primary: 210 20% 98%;
    --primary-foreground: 220.9 39.3% 11%;
  }
}
```

### Formulier met react-hook-form-integratie

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
})

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await signIn(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="password" render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl><Input type="password" {...field} /></FormControl>
            <FormDescription>Must be at least 8 characters.</FormDescription>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </Form>
  )
}
```

### Dialog-patroon

```tsx
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export function DeleteDialog({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={() => { onConfirm(); setOpen(false) }}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### Datatabel met TanStack Table

```tsx
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <Badge>{row.getValue('role')}</Badge>,
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => editUser(row.original)}>Edit</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600" onClick={() => deleteUser(row.original.id)}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

<DataTable columns={columns} data={users} />
```

## Voorbeeld

**Gebruiker:** Bouw een instellingenpagina met een profielformulier (naam, e-mail, avatar-upload), een gevarenzone-kaart met een dialog voor het verwijderen van het account, en een thema-schakelaar.

**Verwachte uitvoer:**
- `app/settings/page.tsx` — lay-out met secties
- `components/profile-form.tsx` — shadcn Form + Input + Avatar + Button
- `components/delete-account-dialog.tsx` — Dialog met bevestigingsinvoer
- `components/theme-toggle.tsx` — Button die dark/light omschakelt via next-themes

---
