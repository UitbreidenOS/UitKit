---
name: shadcn
description: "shadcn/ui: install components, customise variants, theming with CSS variables, compose compound components, extend with custom primitives"
---

> 🇫🇷 Version française. [English version](../shadcn.md).

# Compétence shadcn/ui

## Quand activer
- Ajouter des composants shadcn/ui à un projet Next.js ou React
- Personnaliser le style ou le comportement d'un composant shadcn existant
- Ajouter de nouveaux thèmes de couleurs ou étendre le thème par défaut
- Construire des patterns d'interface composites sur les primitives shadcn (Dialog + Form, etc.)
- Comprendre pourquoi un composant shadcn plante ou s'affiche incorrectement

## Quand NE PAS utiliser
- Projets utilisant une autre bibliothèque de composants (MUI, Chakra) — ne pas mélanger
- Quand vous avez besoin d'un composant que shadcn ne propose pas — consulter directement les primitives Radix UI
- Projets non-React — shadcn est exclusivement React

## Pourquoi shadcn pour la génération par IA

shadcn/ui copie le code source brut des composants dans votre dépôt plutôt que de le masquer derrière un paquet npm. Cela signifie que Claude peut lire, comprendre et modifier chirurgicalement le code exact du composant. Il n'y a pas de surcharges en boîte noire — chaque bouton, dialog et input est un simple fichier dans `components/ui/`. Cela fait de shadcn la bibliothèque de composants la plus lisible par l'IA disponible.

## Instructions

### Installation (nouveau projet)

```bash
# Next.js
npx shadcn@latest init

# Options proposées :
# Style : Default (ou New York)
# Couleur de base : Slate (ou Zinc, Stone, Gray, Neutral)
# Variables CSS : Yes
```

### Ajouter des composants

```bash
# Ajouter des composants individuellement
npx shadcn@latest add button
npx shadcn@latest add card dialog input label
npx shadcn@latest add form          # inclut l'intégration react-hook-form
npx shadcn@latest add table         # inclut TanStack Table
npx shadcn@latest add data-table    # table de données complète avec pagination/tri

# Tout ajouter d'un coup
npx shadcn@latest add button card dialog input form table badge avatar
```

### Structure de fichiers après init

```
components/
└── ui/
    ├── button.tsx      # chaque composant se trouve ici — code source modifiable
    ├── card.tsx
    ├── dialog.tsx
    ├── input.tsx
    └── ...
lib/
└── utils.ts           # helper cn() (clsx + tailwind-merge)
app/
└── globals.css        # variables CSS pour le thème
```

### Utiliser les composants

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

### Personnaliser les variantes de composants

```typescript
// components/ui/button.tsx — ajouter une nouvelle variante
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
        // ─── Variantes personnalisées ──────────────────────────────────────────
        success: 'bg-green-600 text-white hover:bg-green-700',
        warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
        brand: 'bg-orange-500 text-white hover:bg-orange-600 shadow-[3px_3px_0_#0a0a0a] border-2 border-black',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-8',
        xl: 'h-12 px-10 text-base',   // taille personnalisée
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

// Utilisation
<Button variant="brand" size="xl">Get Started</Button>
<Button variant="success">Confirm</Button>
```

### Thème avec variables CSS

```css
/* app/globals.css */
@layer base {
  :root {
    /* Remplacer les valeurs par défaut pour correspondre à votre marque */
    --background: 0 0% 100%;
    --foreground: 224 71.4% 4.1%;
    --primary: 220.9 39.3% 11%;       /* modifier pour la couleur de marque */
    --primary-foreground: 210 20% 98%;
    --accent: 220 14.3% 95.9%;
    --accent-foreground: 220.9 39.3% 11%;
    --border: 220 13% 91%;
    --radius: 0.5rem;                  /* échelle border-radius */
  }

  /* Thème de marque orange */
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

### Formulaire avec intégration react-hook-form

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

### Pattern Dialog

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

### Table de données avec TanStack Table

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

## Exemple

**Utilisateur :** Construire une page de paramètres avec un formulaire de profil (nom, email, téléchargement d'avatar), une carte zone dangereuse avec un dialog de suppression de compte, et un bouton de bascule de thème.

**Résultat attendu :**
- `app/settings/page.tsx` — mise en page avec sections
- `components/profile-form.tsx` — shadcn Form + Input + Avatar + Button
- `components/delete-account-dialog.tsx` — Dialog avec saisie de confirmation
- `components/theme-toggle.tsx` — Button basculant dark/light via next-themes

---
