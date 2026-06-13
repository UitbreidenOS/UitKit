# Elixir + Phoenix

## Cuándo activar
- Construcción de aplicaciones web o APIs de Phoenix
- Diseño de árboles de supervisión OTP con GenServer y Supervisor
- Implementación de Phoenix LiveView para UIs reactivos renderizados por servidor
- Escritura de changesets y transacciones de base de datos Ecto
- Configuración de releases mix para despliegue en producción
- Uso de operador pipe e idiomas de pattern matching

## Cuándo NO usar
- Trabajo Erlang/OTP no-Elixir donde la sintaxis de Elixir es irrelevante
- Tareas de scripting simple mejor manejadas por script shell
- Cuando el codebase es Elixir pero la pregunta es puramente sobre optimización de consultas PostgreSQL sin participación de Ecto

## Instrucciones

### Esqueleto de GenServer

Un GenServer es un proceso con estado. Implementar todos los callbacks estándar explícitamente:

```elixir
defmodule MyApp.Cache do
  use GenServer
  require Logger

  # --- Client API ---

  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  end

  def get(key), do: GenServer.call(__MODULE__, {:get, key})
  def put(key, value), do: GenServer.cast(__MODULE__, {:put, key, value})
  def delete(key), do: GenServer.cast(__MODULE__, {:delete, key})

  # --- Server Callbacks ---

  @impl true
  def init(_opts) do
    {:ok, %{}}   # initial state is an empty map
  end

  @impl true
  def handle_call({:get, key}, _from, state) do
    {:reply, Map.get(state, key), state}
  end

  @impl true
  def handle_cast({:put, key, value}, state) do
    {:noreply, Map.put(state, key, value)}
  end

  @impl true
  def handle_cast({:delete, key}, state) do
    {:noreply, Map.delete(state, key)}
  end

  @impl true
  def handle_info(:cleanup, state) do
    Logger.info("Running cache cleanup")
    {:noreply, %{}}
  end

  @impl true
  def terminate(reason, _state) do
    Logger.warning("Cache terminating: #{inspect(reason)}")
    :ok
  end
end
```

Usar `handle_call` para operaciones sincrónicas que retornan un valor. Usar `handle_cast` para mutaciones fire-and-forget. Usar `handle_info` para mensajes no enviados vía `call`/`cast` (timers, mensajes de monitor de proceso).

### Selección de Estrategia de Supervisión

```elixir
defmodule MyApp.Application do
  use Application

  def start(_type, _args) do
    children = [
      MyApp.Repo,
      MyAppWeb.Endpoint,
      {MyApp.Cache, []},
      {Task.Supervisor, name: MyApp.TaskSupervisor},
    ]

    opts = [strategy: :one_for_one, name: MyApp.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
```

Guía de estrategia:
- `:one_for_one` — reiniciar solo al hijo que cayó. Usar cuando los hijos son completamente independientes.
- `:one_for_all` — reiniciar todos los hijos cuando uno cae. Usar cuando todos los hijos comparten estado o deben iniciar juntos.
- `:rest_for_one` — reiniciar el hijo que cayó y cada hijo iniciado después de él. Usar para cadenas de dependencia de estilo tubería.

Usar `DynamicSupervisor` para procesos no acotados, creados en tiempo de ejecución (ej., sesiones por usuario, workers por conexión):

```elixir
{:ok, pid} = DynamicSupervisor.start_child(MyApp.SessionSupervisor, {MyApp.Session, user_id})
```

### Phoenix LiveView — mount/handle_event

```elixir
defmodule MyAppWeb.CounterLive do
  use MyAppWeb, :live_view

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, count: 0)}
  end

  @impl true
  def handle_event("increment", _params, socket) do
    {:noreply, update(socket, :count, &(&1 + 1))}
  end

  @impl true
  def handle_event("reset", _params, socket) do
    {:noreply, assign(socket, count: 0)}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <p>Count: <%= @count %></p>
      <button phx-click="increment">+1</button>
      <button phx-click="reset">Reset</button>
    </div>
    """
  end
end
```

Ciclo de vida del proceso LiveView:
1. `mount/3` — llamado en renderizado estático (sin socket) y en conexión de socket vivo
2. `handle_params/3` — llamado después de mount cuando se usa navegación viva
3. `handle_event/3` — maneja `phx-click`, `phx-change`, `phx-submit`
4. `handle_info/2` — maneja mensajes de otros procesos (difusiones PubSub)

Para componentes complejos, extraer a `Phoenix.LiveComponent` para scope de estado y reducir re-renders del padre.

### Ecto.Multi para Transacciones

Usar `Ecto.Multi` para agrupar múltiples operaciones de base de datos en una transacción atómica:

```elixir
defmodule MyApp.Accounts do
  alias MyApp.Repo
  alias MyApp.Accounts.{User, Wallet}
  import Ecto.Multi

  def register_user(attrs) do
    Ecto.Multi.new()
    |> Ecto.Multi.insert(:user, User.changeset(%User{}, attrs))
    |> Ecto.Multi.insert(:wallet, fn %{user: user} ->
      Wallet.changeset(%Wallet{}, %{user_id: user.id, balance: 0})
    end)
    |> Ecto.Multi.run(:welcome_email, fn _repo, %{user: user} ->
      case Mailer.send_welcome(user) do
        :ok -> {:ok, user}
        {:error, reason} -> {:error, reason}
      end
    end)
    |> Repo.transaction()
  end
end
```

`Repo.transaction/1` en un Multi retorna:
- `{:ok, %{user: user, wallet: wallet, welcome_email: user}}` al éxito
- `{:error, failed_operation_name, changeset_or_value, changes_so_far}` al fallo

Cada paso recibe resultados de pasos previos en el argumento de mapa. El rollback es automático en cualquier retorno `{:error, ...}`.

### Patrones de Operador Pipe

El operador pipe `|>` pasa el resultado de la expresión izquierda como primer argumento a la función derecha:

```elixir
# Data transformation pipeline
def process_orders(user_id) do
  user_id
  |> fetch_orders()
  |> Enum.filter(&(&1.status == :pending))
  |> Enum.map(&calculate_total/1)
  |> Enum.sort_by(& &1.amount, :desc)
  |> Enum.take(10)
end

# String processing
"  Hello, World!  "
|> String.trim()
|> String.downcase()
|> String.split(", ")
# => ["hello", "world!"]

# Pattern matching in pipelines with with
def create_and_notify(attrs) do
  with {:ok, user} <- create_user(attrs),
       {:ok, _token} <- generate_token(user),
       :ok <- send_notification(user) do
    {:ok, user}
  else
    {:error, %Ecto.Changeset{} = cs} -> {:error, format_errors(cs)}
    {:error, reason} -> {:error, reason}
  end
end
```

Usar `with` en lugar de expresiones `case` anidadas para secuencias de operaciones que pueden fallar independientemente.

### Configuración de Entorno con Config

Phoenix 7 usa el patrón de configuración de tres archivos:

```elixir
# config/config.exs — compile-time, all environments
config :my_app, MyApp.Repo,
  pool_size: 10

config :my_app, MyAppWeb.Endpoint,
  url: [host: "localhost"],
  render_errors: [formats: [html: MyAppWeb.ErrorHTML, json: MyAppWeb.ErrorJSON]]
```

```elixir
# config/runtime.exs — evaluated at runtime, reads System.get_env
import Config

if config_env() == :prod do
  database_url = System.fetch_env!("DATABASE_URL")

  config :my_app, MyApp.Repo,
    url: database_url,
    pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10")

  config :my_app, MyAppWeb.Endpoint,
    secret_key_base: System.fetch_env!("SECRET_KEY_BASE"),
    server: true
end
```

```elixir
# config/dev.exs — development overrides only
config :my_app, MyApp.Repo,
  username: "postgres",
  password: "postgres",
  database: "my_app_dev"
```

Construir una release mix:

```bash
MIX_ENV=prod mix release
_build/prod/rel/my_app/bin/my_app start
```

## Ejemplo

Una LiveView respaldada por PubSub que muestra actualizaciones de órdenes en tiempo real:

```elixir
defmodule MyAppWeb.OrdersLive do
  use MyAppWeb, :live_view
  alias MyApp.Orders

  @impl true
  def mount(_params, _session, socket) do
    if connected?(socket) do
      Phoenix.PubSub.subscribe(MyApp.PubSub, "orders")
    end

    {:ok, assign(socket, orders: Orders.list_recent())}
  end

  @impl true
  def handle_info({:order_updated, order}, socket) do
    updated = Enum.map(socket.assigns.orders, fn
      %{id: ^(order.id)} -> order
      existing -> existing
    end)
    {:noreply, assign(socket, orders: updated)}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <ul>
      <li :for={order <- @orders}>
        <%= order.id %> — <%= order.status %>
      </li>
    </ul>
    """
  end
end

# Broadcast from the context after an update
def update_order(id, attrs) do
  with {:ok, order} <- do_update(id, attrs) do
    Phoenix.PubSub.broadcast(MyApp.PubSub, "orders", {:order_updated, order})
    {:ok, order}
  end
end
```

---
