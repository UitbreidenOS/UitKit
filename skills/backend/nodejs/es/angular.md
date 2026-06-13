# Angular 17+

## Cuándo activar
- Construcción o mantenimiento de aplicaciones Angular 17+
- Migración de componentes basados en NgModule a componentes autónomos
- Implementación de estado reactivo con Signals o NgRx
- Optimización de operadores RxJS en código de servicio o efecto
- Configuración de carga perezosa con `loadComponent` routing
- Aplicación de detección de cambios OnPush con la tubería async

## Cuándo NO usar
- Proyectos React, Vue, o Svelte donde los idiomas de Angular no aplican
- Angular.js (Angular 1.x) — framework fundamentalmente diferente
- Versiones de Angular inferiores a 14 donde no existen componentes autónomos

## Instrucciones

### Migración de Componentes Autónomos

Los componentes autónomos declaran sus propias importaciones en lugar de depender de un NgModule. Los nuevos proyectos Angular 17+ usan autónomos por defecto.

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

Arrancar una aplicación autónoma:

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

Los Signals de Angular (17+) son primitivos reactivos síncronos de grano fino. Se integran con el sistema de detección de cambios de Angular sin gestión de suscripción zone.js.

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
| Flujo async | No | Sí |
| Vinculación de plantilla | Nativa, sin tubería async | Requiere `async` pipe o suscripción manual |
| Valores derivados | `computed()` | `pipe(map(...))` |
| Efectos secundarios | `effect()` | `tap()` / subscribe |
| Respuestas HTTP | Convertir con `toSignal()` | Adecuación natural |

Usar `toSignal()` para puente Observables en signals para uso en plantillas:

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

### Tabla de Decisión de Operador RxJS

| Operator | Usar cuando |
|---|---|
| `switchMap` | Últimas ganancias — cancelar observable anterior (búsqueda typeahead, datos de ruta) |
| `exhaustMap` | Ignorar nuevas emisiones mientras se ejecuta actual (envío de formulario, botón de inicio de sesión) |
| `mergeMap` | Todos concurrentes, orden no preservado (solicitudes HTTP paralelas, fire-and-forget) |
| `concatMap` | Cola ordenada — completar cada antes de comenzar siguiente (cola de carga, escrituras secuenciales) |

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

### Carga Perezosa con loadComponent

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

### Detección de Cambios OnPush con Tubería Async

OnPush instruye a Angular a saltar el componente durante la detección de cambios a menos que:
1. Una referencia `@Input()` cambia
2. Un evento se origina del componente o sus hijos
3. Un Observable enlazado con la tubería `async` emite
4. `markForCheck()` se llama explícitamente

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

Siempre usar `trackBy` con `*ngFor` en componentes OnPush para prevenir re-renders completos de lista en actualización de datos.

## Ejemplo

Una característica de búsqueda de productos autónoma con Signals y enrutamiento perezoso:

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
