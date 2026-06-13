# Intégration Claude Design

## Quand activer

- L'utilisateur a exporté un paquet de handoff de Claude Design et veut l'implémenter en tant que code
- L'utilisateur veut configurer un workflow design→code en utilisant la sortie Claude Design
- L'utilisateur demande comment convertir une export Claude Design en composants React, HTML ou framework
- L'utilisateur veut extraire les jetons de design (couleurs, espacement, typographie) d'un paquet Claude Design
- L'utilisateur mappe les annotations de composants Claude Design à une bibliothèque UI (shadcn/ui, MUI, Tailwind, Radix)

## Quand ne PAS utiliser

- Construire l'UI à partir de zéro sans apport de design — utiliser une approche code-first à la place
- Travailler avec Figma, Sketch, ou d'autres outils de design vectoriel — cette compétence est spécifique à Claude Design
- Refactorisation pure ou travail logique sans composant de design visuel
- L'utilisateur a une capture d'écran ou une image mais pas un paquet Claude Design — gérer comme une invite visuelle standard

## Instructions

### Recevoir le paquet de handoff

Demandez à l'utilisateur de confirmer le contenu du paquet avant de commencer l'implémentation :

```bash
unzip design-handoffs/checkout.bundle -d design-handoffs/checkout/
ls design-handoffs/checkout/
# S'attendre à : layout.json, tokens.json, components.md, preview.png
```

Si le paquet contient `tokens.json`, chargez-le d'abord. Les jetons de design définissent l'ensemble du contrat visuel — couleurs, espacement, tailles de police, rayons de bordure. Ne codifiez jamais en dur les valeurs qui apparaissent dans le fichier de jeton.

### Placer les fichiers du paquet

Standardisez cet emplacement pour éviter la dérive de chemin entre les projets :

```
project-root/
└── design-handoffs/
    └── <feature-name>/
        ├── layout.json
        ├── tokens.json
        ├── components.md
        └── preview.png
```

Ne placez jamais les fichiers du paquet à l'intérieur de `src/` ou à côté du code d'application.

### Extraire et appliquer les jetons de design

Convertissez `tokens.json` au format de jetons du projet avant d'écrire les composants :

```typescript
// tokens.json (sortie Claude Design)
{
  "color": {
    "primary": "#1A56DB",
    "surface": "#F9FAFB",
    "text-primary": "#111928"
  },
  "spacing": {
    "4": "1rem",
    "6": "1.5rem"
  },
  "radius": {
    "md": "0.5rem"
  }
}
```

Exemples de mappage :

| Jeton Claude Design | Classe Tailwind | Variable CSS | Jeton shadcn/ui |
|--------------------|---------------|--------------|-----------------|
| `color.primary` | `bg-blue-600` | `--color-primary` | `--primary` |
| `spacing.4` | `p-4` | `--spacing-4` | valeur directe |
| `radius.md` | `rounded-md` | `--radius-md` | `--radius` |

Lorsque le projet utilise Tailwind, étendez `tailwind.config.js` avec les jetons extraits plutôt que de les appliquer en ligne.

### Lire les annotations de composants

Ouvrez `components.md` avant d'écrire le code des composants. Il répertorie :
- Les noms de composants et leurs équivalents de système de design
- Les noms de variantes (par exemple, `Button/primary`, `Card/elevated`)
- Les annotations d'état (hover, focus, disabled, loading)
- Notes de comportement réactif (empiler sur mobile, côte à côte sur bureau)

Modèle d'invite pour l'implémentation du composant :

```
"Implémentez le [NomDuComposant] décrit dans design-handoffs/checkout/components.md.
Utilisez shadcn/ui comme base. Faites correspondre exactement les valeurs de jetons dans tokens.json.
La spécification de mise en page est dans layout.json — utilisez-la uniquement pour l'espacement et le positionnement,
pas comme une contrainte pixel-parfait."
```

### Gérer les points d'arrêt réactifs

Les paquets Claude Design incluent les annotations de points d'arrêt dans `layout.json`. Mappez-les :

```json
// section breakpoint de layout.json
"breakpoints": {
  "mobile": "< 768px",
  "tablet": "768px – 1024px",
  "desktop": "> 1024px"
}
```

Dans Tailwind : `sm:` mappe à tablet, `lg:` mappe à desktop. Vérifiez cela par rapport au `tailwind.config.js` du projet — les points d'arrêt personnalisés peuvent différer.

### Correspondance exacte vs. utilisation comme inspiration

Utilisez une formulation d'invite explicite pour définir le contrat d'implémentation :

| Intention | Formulation d'invite |
|--------|----------------|
| Correspondance exacte | "Implémentez ce design aussi proche d'un pixel-parfait que la bibliothèque de composants le permet. Signez toute déviation." |
| Inspiré par | "Utilisez ce design comme référence pour la direction de mise en page et couleur. Adaptez au besoin pour les conventions de notre bibliothèque de composants." |
| Jetons uniquement | "Ignorez la mise en page; appliquez uniquement les jetons de design de tokens.json à nos composants existants." |

Par défaut à "inspiré par" sauf si l'utilisateur spécifie autrement — les correspondances exactes sont rarement réalisables entre les outils de design et les bibliothèques d'interface utilisateur et produisent souvent un CSS fragile.

### Valider l'implémentation par rapport à l'aperçu

Après avoir généré le composant, demandez à Claude de comparer par rapport à `preview.png`:

```
"Comparez le composant généré par rapport à design-handoffs/checkout/preview.png.
Listez toutes les différences visuelles — mise en page, couleur, espacement ou typographie — et corrigez-les."
```

## Exemple

```
Utilisateur : "J'ai exporté une page de paiement à partir de Claude Design. Le paquet est dans
design-handoffs/checkout-v2.bundle. Générez le composant React en utilisant
shadcn/ui pour l'assortir."

Flux de travail Claude Code :
1. Décompressez le paquet dans design-handoffs/checkout-v2/
2. Lisez tokens.json → étendez tailwind.config.js avec les jetons extraits
3. Lisez components.md → identifiez : composants CheckoutForm, OrderSummary, PaymentInput
4. Lisez layout.json → notez la mise en page à deux colonnes s'effondre à une seule colonne sur mobile
5. Générez CheckoutPage.tsx en utilisant Card, Input, Button de shadcn/ui
6. Appliquez les classes de jeton (bg-primary, text-primary, rounded-md) de l'extension Tailwind
7. Vérifiez par rapport à preview.png, corrigez la déviation d'espacement dans le padding d'OrderSummary
```

---
