# Angular 17+

## Quand activer
- Construire ou maintenir des applications Angular 17+
- Migration des composants basés sur NgModule vers les composants autonomes
- Implémentation d'état réactif avec Signals ou NgRx
- Optimisation des opérateurs RxJS dans le code de service ou d'effet
- Configuration du chargement tardif avec le routage `loadComponent`
- Application de la détection de changement OnPush avec le pipe async

## Quand ne PAS utiliser
- Projets React, Vue ou Svelte où les idiomes Angular ne s'appliquent pas
- Angular.js (Angular 1.x) — cadre fondamentalement différent
- Versions d'Angular en dessous de 14 où les composants autonomes n'existent pas

## Instructions

### Migration de composant autonome

Les composants autonomes déclarent leurs propres importations au lieu de s'appuyer sur un NgModule. Les nouveaux projets Angular 17+ utilisent l'autonome par défaut.

```typescript
// Before (NgModule-based)
@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
})
export class UserCardComponent {}

@NgModule({
  declarations: [UserCardComponent],
  imports: [CommonModule, RouterModule],
  exports: [UserCardComponent],
})
export class SharedModule {}
```

```typescript
// After (standalone)
@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {
  @Input() user!: User;
}
```

Amorcer une application autonome :

```typescript
// main.ts
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    importProvidersFrom(StoreModule.forRoot(reducers), EffectsModule.forRoot(effects)),
  ],
});
```

### Signals vs BehaviorSubject

Angular Signals (17+) sont des primitives réactives synchrones et à grain fin. Elles s'intègrent au système de détection de changement Angular sans gestion d'abonnement zone.js.

```typescript
// BehaviorSubject pattern (RxJS)
export class CartService {
  private _items = new BehaviorSubject<CartItem[]>([]);
  readonly items$ = this._items.asObservable();
  readonly count$ = this._items.pipe(map((items) => items.length));

  add(item: CartItem) {
    this._items.next([...this._items.value, item]);
  }
}

// Signal pattern (Angular 17+)
export class CartService {
  private _items = signal<CartItem[]>([]);
  readonly items  = this._items.asReadonly();
  readonly count  = computed(() => this._items().length);

  add(item: CartItem) {
    this._items.update((current) => [...current, item]);
  }
}
```

| | `signal()` | `BehaviorSubject` |
|---|---|---|
| Flux asynchrone | Non | Oui |
| Liaison de modèle | Natif, pas de pipe async | Nécessite le pipe `async` ou abonnement manuel |
| Valeurs dérivées | `computed()` | `pipe(map(...))` |
| Effets secondaires | `effect()` | `tap()` / subscribe |
| Réponses HTTP | Convertir avec `toSignal()` | Bon ajustement naturel |

Utiliser `toSignal()` pour faire la passerelle entre les Observables et les signaux pour l'utilisation en modèle :

```typescript
readonly users = toSignal(this.http.get<User[]>('/api/users'), { initialValue: [] });
```

### Passe-partout NgRx createFeature

```typescript
// store/products.feature.ts
import { createFeature, createReducer, on, createActionGroup, emptyProps, props } from '@ngrx/store';

// Action group keeps actions co-located with the feature
export const ProductsActions = createActionGroup({
  source: 'Products',
  events: {
    'Load Products':         emptyProps(),
    'Load Products Success': props<{ products: Product[] }>(),
    'Load Products Failure': props<{ error: string }>(),
    'Select Product':        props<{ id: number }>(),
  },
});

// State interface
interface ProductsState {
  products: Product[];
  selectedId: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  selectedId: null,
  loading: false,
  error: null,
};

// Feature creates reducer + selectors automatically
export const productsFeature = createFeature({
  name: 'products',
  reducer: createReducer(
    initialState,
    on(ProductsActions.loadProducts, (state) =>
      ({ ...state, loading: true, error: null })),
    on(ProductsActions.loadProductsSuccess, (state, { products }) =>
      ({ ...state, products, loading: false })),
    on(ProductsActions.loadProductsFailure, (state, { error }) =>
      ({ ...state, error, loading: false })),
    on(ProductsActions.selectProduct, (state, { id }) =>
      ({ ...state, selectedId: id })),
  ),
});

// Auto-generated selectors: selectProducts, selectLoading, selectError, selectSelectedId
export const { selectProducts, selectLoading, selectError } = productsFeature;

// Effect
@Injectable()
export class ProductsEffects {
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      switchMap(() =>
        this.api.getProducts().pipe(
          map((products) => ProductsActions.loadProductsSuccess({ products })),
          catchError((error) => of(ProductsActions.loadProductsFailure({ error: error.message }))),
        )
      ),
    )
  );

  constructor(private actions$: Actions, private api: ProductService) {}
}
```

### Tableau de décision des opérateurs RxJS

| Opérateur | À utiliser quand |
|---|---|
| `switchMap` | La dernière gagne — annule les observables internes précédents (typeahead de recherche, données de route) |
| `exhaustMap` | Ignorer les nouvelles émissions pendant que le courant s'exécute (soumission de formulaire, bouton de connexion) |
| `mergeMap` | Tous concurrents, l'ordre n'est pas préservé (requêtes HTTP parallèles, tir et oublie) |
| `concatMap` | File d'attente ordonnée — complétez chacune avant de commencer la suivante (file d'attente de téléchargement, écritures séquentielles) |

```typescript
// switchMap — cancels previous search request on new keystroke
searchControl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap((q) => this.api.search(q)),
).subscribe((results) => this.results = results);

// exhaustMap — ignores submit clicks while request is in flight
this.submitBtn.clicks$.pipe(
  exhaustMap(() => this.api.submit(this.form.value)),
).subscribe((resp) => this.onSuccess(resp));

// concatMap — process upload queue in order
this.uploadQueue$.pipe(
  concatMap((file) => this.api.upload(file)),
).subscribe((result) => this.onUploaded(result));
```

### Chargement tardif avec loadComponent

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./features/products/products.routes').then((m) => m.PRODUCTS_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/admin.component').then((m) => m.AdminComponent),
  },
];

// features/products/products.routes.ts
export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./list/product-list.component').then((m) => m.ProductListComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./detail/product-detail.component').then((m) => m.ProductDetailComponent),
    resolve: { product: productResolver },
  },
];
```

### Détection de changement OnPush avec le pipe async

OnPush instruit Angular à ignorer le composant pendant la détection de changement sauf :
1. Une référence `@Input()` change
2. Un événement provient du composant ou de ses enfants
3. Un Observable lié avec le pipe `async` émet
4. `markForCheck()` est appelé explicitement

```typescript
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="products$ | async as products; else loading">
      <app-product-card
        *ngFor="let p of products; trackBy: trackById"
        [product]="p"
        (addToCart)="onAdd(p)"
      />
    </ng-container>
    <ng-template #loading><app-skeleton /></ng-template>
  `,
})
export class ProductListComponent {
  readonly products$ = this.store.select(selectProducts);

  constructor(
    private store: Store,
    private cdr: ChangeDetectorRef,
  ) {}

  trackById(_: number, item: Product) { return item.id; }

  onAdd(product: Product) {
    this.store.dispatch(CartActions.addItem({ product }));
  }
}
```

Toujours utiliser `trackBy` avec `*ngFor` dans les composants OnPush pour empêcher la re-render complète de la liste sur l'actualisation des données.

## Exemple

Une fonctionnalité de recherche de produit autonome avec Signals et routage tardif :

```typescript
// features/search/search.component.ts
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, ProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <input [formControl]="query" placeholder="Search products..." />
    @for (product of results(); track product.id) {
      <app-product-card [product]="product" />
    }
    @if (loading()) {
      <app-spinner />
    }
  `,
})
export class SearchComponent {
  query = new FormControl('', { nonNullable: true });
  loading = signal(false);
  results = signal<Product[]>([]);

  private destroy$ = new Subject<void>();

  constructor(private api: ProductService) {
    this.query.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter((q) => q.length >= 2),
      tap(() => this.loading.set(true)),
      switchMap((q) => this.api.search(q).pipe(catchError(() => of([])))),
      takeUntil(this.destroy$),
    ).subscribe((products) => {
      this.results.set(products);
      this.loading.set(false);
    });
  }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }
}

// Route registration
{
  path: 'search',
  loadComponent: () =>
    import('./features/search/search.component').then((m) => m.SearchComponent),
}
```

---
