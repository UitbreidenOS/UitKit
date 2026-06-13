---
name: shadcn
description: "shadcn/ui: install components, customise variants, theming with CSS variables, compose compound components, extend with custom primitives"
---

> 🇩🇪 Deutsche Version. [Englische Version](../shadcn.md).

# shadcn/ui Skill

## Wann aktivieren
- shadcn/ui-Komponenten zu einem Next.js- oder React-Projekt hinzufügen
- Den Stil oder das Verhalten einer bestehenden shadcn-Komponente anpassen
- Neue Farbthemen hinzufügen oder das Standardthema erweitern
- Zusammengesetzte UI-Muster auf shadcn-Primitiven aufbauen (Dialog + Form usw.)
- Verstehen, warum eine shadcn-Komponente abstürzt oder falsch gerendert wird

## Wann NICHT verwenden
- Projekte mit einer anderen Komponentenbibliothek (MUI, Chakra) — nicht mischen
- Wenn Sie eine Komponente benötigen, die shadcn nicht hat — Radix UI-Primitive direkt prüfen
- Nicht-React-Projekte — shadcn ist nur für React

## Warum shadcn für KI-Generierung

shadcn/ui kopiert den rohen Quellcode der Komponenten in Ihr Repository, anstatt ihn hinter einem npm-Paket zu verstecken. Das bedeutet, dass Claude den genauen Komponentencode lesen, verstehen und präzise anpassen kann. Es gibt keine Black-Box-Überschreibungen — jeder Button, Dialog und Input ist eine einfache Datei in `components/ui/`. Dies macht shadcn zur KI-lesbarsten verfügbaren Komponentenbibliothek.

## Anweisungen

### Installation (neues Projekt)

```bash
# Next.js
npx shadcn@latest init

# Abgefragte Optionen:
# Stil: Default (oder New York)
# Grundfarbe: Slate (oder Zinc, Stone, Gray, Neutral)
# CSS-Variablen: Yes
```

### Komponenten hinzufügen

```bash
# Einzelne Komponenten hinzufügen
npx shadcn@latest add button
npx shadcn@latest add card dialog input label
npx shadcn@latest add form          # beinhaltet react-hook-form-Integration
npx shadcn@latest add table         # beinhaltet TanStack Table
npx shadcn@latest add data-table    # vollständige Datentabelle mit Paginierung/Sortierung

# Alles auf einmal hinzufügen
npx shadcn@latest add button card dialog input form table badge avatar
```

### Dateistruktur nach init

```
components/
└── ui/
    ├── button.tsx      # jede Komponente liegt hier — bearbeitbarer Quellcode
    ├── card.tsx
    ├── dialog.tsx
    ├── input.tsx
    └── ...
lib/
└── utils.ts           # cn()-Hilfsfunktion (clsx + tailwind-merge)
app/
└── globals.css        # CSS-Variablen für das Theming
```

### Komponenten verwenden

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

### Komponentenvarianten anpassen

```typescript
// components/ui/button.tsx — neue Variante hinzufügen
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
        // ─── Benutzerdefinierte Varianten ──────────────────────────────────────────
        success: 'bg-green-600 text-white hover:bg-green-700',
        warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
        brand: 'bg-orange-500 text-white hover:bg-orange-600 shadow-[3px_3px_0_#0a0a0a] border-2 border-black',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-8',
        xl: 'h-12 px-10 text-base',   // benutzerdefinierte Größe
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

// Verwendung
<Button variant="brand" size="xl">Get Started</Button>
<Button variant="success">Confirm</Button>
```

### Theming mit CSS-Variablen

```css
/* app/globals.css */
@layer base {
  :root {
    /* Standardwerte überschreiben, um Ihrer Marke zu entsprechen */
    --background: 0 0% 100%;
    --foreground: 224 71.4% 4.1%;
    --primary: 220.9 39.3% 11%;       /* für Markenfarbe ändern */
    --primary-foreground: 210 20% 98%;
    --accent: 220 14.3% 95.9%;
    --accent-foreground: 220.9 39.3% 11%;
    --border: 220 13% 91%;
    --radius: 0.5rem;                  /* border-radius-Skala */
  }

  /* Oranges Markenthema */
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

### Formular mit react-hook-form-Integration

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

### Dialog-Muster

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

### Datentabelle mit TanStack Table

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

## Beispiel

**Benutzer:** Erstelle eine Einstellungsseite mit einem Profilformular (Name, E-Mail, Avatar-Upload), einer Gefahrenzonenkarte mit einem Dialog zum Löschen des Kontos und einem Theme-Umschalter.

**Erwartete Ausgabe:**
- `app/settings/page.tsx` — Layout mit Abschnitten
- `components/profile-form.tsx` — shadcn Form + Input + Avatar + Button
- `components/delete-account-dialog.tsx` — Dialog mit Bestätigungseingabe
- `components/theme-toggle.tsx` — Button zum Umschalten zwischen dark/light via next-themes

---
