---
name: shadcn
description: "shadcn/ui: install components, customise variants, theming with CSS variables, compose compound components, extend with custom primitives"
---

> 🇪🇸 Versión en español. [Versión en inglés](../shadcn.md).

# Habilidad shadcn/ui

## Cuándo activar
- Añadir componentes shadcn/ui a un proyecto Next.js o React
- Personalizar el estilo o comportamiento de un componente shadcn existente
- Añadir nuevos temas de color o extender el tema por defecto
- Construir patrones de UI compuestos sobre primitivas shadcn (Dialog + Form, etc.)
- Entender por qué un componente shadcn falla o se renderiza incorrectamente

## Cuándo NO usar
- Proyectos que usan otra biblioteca de componentes (MUI, Chakra) — no mezclar
- Cuando necesitas un componente que shadcn no tiene — consultar directamente las primitivas Radix UI
- Proyectos no-React — shadcn es exclusivamente para React

## Por qué shadcn para generación con IA

shadcn/ui copia el código fuente bruto de los componentes en tu repositorio en lugar de ocultarlo detrás de un paquete npm. Esto significa que Claude puede leer, entender y modificar quirúrgicamente el código exacto del componente. No hay sobreescrituras de caja negra — cada botón, dialog e input es un archivo plano en `components/ui/`. Esto hace de shadcn la biblioteca de componentes más legible por IA disponible.

## Instrucciones

### Instalación (proyecto nuevo)

```bash
# Next.js
npx shadcn@latest init

# Opciones solicitadas:
# Estilo: Default (o New York)
# Color base: Slate (o Zinc, Stone, Gray, Neutral)
# Variables CSS: Yes
```

### Añadir componentes

```bash
# Añadir componentes individuales
npx shadcn@latest add button
npx shadcn@latest add card dialog input label
npx shadcn@latest add form          # incluye integración con react-hook-form
npx shadcn@latest add table         # incluye TanStack Table
npx shadcn@latest add data-table    # tabla de datos completa con paginación/ordenación

# Añadir todo a la vez
npx shadcn@latest add button card dialog input form table badge avatar
```

### Estructura de archivos tras init

```
components/
└── ui/
    ├── button.tsx      # cada componente vive aquí — código fuente editable
    ├── card.tsx
    ├── dialog.tsx
    ├── input.tsx
    └── ...
lib/
└── utils.ts           # función helper cn() (clsx + tailwind-merge)
app/
└── globals.css        # variables CSS para temas
```

### Usar los componentes

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

### Personalizar variantes de componentes

```typescript
// components/ui/button.tsx — añadir una nueva variante
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
        // ─── Variantes personalizadas ──────────────────────────────────────────
        success: 'bg-green-600 text-white hover:bg-green-700',
        warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
        brand: 'bg-orange-500 text-white hover:bg-orange-600 shadow-[3px_3px_0_#0a0a0a] border-2 border-black',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-8',
        xl: 'h-12 px-10 text-base',   // tamaño personalizado
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

// Uso
<Button variant="brand" size="xl">Get Started</Button>
<Button variant="success">Confirm</Button>
```

### Temas con variables CSS

```css
/* app/globals.css */
@layer base {
  :root {
    /* Reemplazar valores por defecto para ajustar a tu marca */
    --background: 0 0% 100%;
    --foreground: 224 71.4% 4.1%;
    --primary: 220.9 39.3% 11%;       /* cambiar para el color de marca */
    --primary-foreground: 210 20% 98%;
    --accent: 220 14.3% 95.9%;
    --accent-foreground: 220.9 39.3% 11%;
    --border: 220 13% 91%;
    --radius: 0.5rem;                  /* escala de border-radius */
  }

  /* Tema de marca naranja */
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

### Formulario con integración react-hook-form

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

### Patrón Dialog

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

### Tabla de datos con TanStack Table

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

## Ejemplo

**Usuario:** Construir una página de configuración con un formulario de perfil (nombre, email, carga de avatar), una tarjeta de zona peligrosa con un dialog de eliminación de cuenta, y un botón de cambio de tema.

**Resultado esperado:**
- `app/settings/page.tsx` — diseño con secciones
- `components/profile-form.tsx` — shadcn Form + Input + Avatar + Button
- `components/delete-account-dialog.tsx` — Dialog con entrada de confirmación
- `components/theme-toggle.tsx` — Button que alterna dark/light mediante next-themes

---
