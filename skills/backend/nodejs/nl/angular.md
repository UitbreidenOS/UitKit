# Angular 17+

## Wanneer activeren
- Bouwen of beheren van Angular 17+ applicaties
- Migreren van NgModule-based components naar standalone components
- Implementeren van reactive state met Signals of NgRx
- Optimaliseren van RxJS operators in service of effect code
- Configureren van lazy loading met `loadComponent` routing
- Applying OnPush change detection met async pipe

## Wanneer NIET gebruiken
- React, Vue, of Svelte projecten waarbij Angular idiomen niet van toepassing zijn
- Angular.js (Angular 1.x) — fundamenteel ander framework
- Angular versies lager dan 14 waarbij standalone components niet bestaan

## Instructies

### Standalone Component Migration

Standalone components declareren hun eigen imports in plaats van te vertrouwen op NgModule. Nieuwe Angular 17+ projecten gebruiken standalone standaard.

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

Bootstrap standalone applicatie:

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

Angular Signals (17+) zijn synchrone, fine-grained reactive primitives. Ze integreren met Angular change detection system zonder zone.js subscription management.

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
| Async stream | No | Yes |
| Template binding | Native, no async pipe | Requires `async` pipe or manual subscribe |
| Derived values | `computed()` | `pipe(map(...))` |
| Side effects | `effect()` | `tap()` / subscribe |
| HTTP responses | Convert with `toSignal()` | Natural fit |

Gebruik `toSignal()` om Observables in signals te overbruggen voor template use:

```typescript
readonly users = toSignal(this.http.get<User[]>('/api/users'), { initialValue: [] });
```

### NgRx createFeature Boilerplate

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

### RxJS Operator Decision Table

| Operator | Use when |
|---|---|
| `switchMap` | Latest wins — cancel previous inner observable (search typeahead, route data) |
| `exhaustMap` | Ignore new emissions while current is running (form submit, login button) |
| `mergeMap` | All concurrent, order not preserved (parallel HTTP requests, fire-and-forget) |
| `concatMap` | Ordered queue — complete each before starting next (upload queue, sequential writes) |

### Lazy Loading with loadComponent

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
```

### OnPush Change Detection with async Pipe

OnPush instrueert Angular component over te slaan tijdens change detection tenzij:
1. An `@Input()` reference verandert
2. An event originates van component of zijn children
3. An Observable gebonden met `async` pipe emits
4. `markForCheck()` is aangeroepen expliciet

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

Altijd gebruiken `trackBy` met `*ngFor` in OnPush components om volledige list re-renders op data refresh te voorkomen.

## Voorbeeld

Standalone product search feature met Signals en lazy routing:

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
```

---
