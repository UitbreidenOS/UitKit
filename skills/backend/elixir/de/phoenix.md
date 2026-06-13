# Elixir + Phoenix

## Wann aktivieren
- Aufbau von Phoenix-Webanwendungen oder APIs
- Designen von OTP-Supervision-Bäumen mit GenServer und Supervisor
- Implementierung von Phoenix LiveView für Server-Rendered Reactive UIs
- Schreiben von Ecto Changesets und Database Transactions
- Konfigurieren von Mix-Releases für Production Deployment
- Verwendung des Pipe-Operators und Pattern-Matching-Idiome

## Wann NICHT verwenden
- Nicht-Elixir Erlang/OTP-Arbeit, bei der Elixir-Syntax irrelevant ist
- Einfache Scripting-Aufgaben, die besser durch ein Shell-Script gehandhabt werden
- Wenn die Codebase Elixir ist, aber die Frage rein PostgreSQL-Query-Optimierung ohne Ecto ist

## Anweisungen

### GenServer Skeleton

Ein GenServer ist ein zustandsbehafteter Prozess. Implementieren Sie alle Standard-Callbacks explizit:

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

Verwenden Sie `handle_call` für synchrone Operationen, die einen Wert zurückgeben. Verwenden Sie `handle_cast` für Fire-and-Forget-Mutationen. Verwenden Sie `handle_info` für Nachrichten, die nicht über `call`/`cast` gesendet werden (Timer, Process Monitor Nachrichten).

### Supervision Strategy Selection

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

Strategy Guide:
- `:one_for_one` — starten Sie nur das abgestürzte Kind neu. Verwenden Sie bei vollständig unabhängigen Children.
- `:one_for_all` — starten Sie alle Children neu, wenn eines abstürzt. Verwenden Sie bei gemeinsam genutztem Status oder wenn alle Children gemeinsam starten müssen.
- `:rest_for_one` — starten Sie das abgestürzte Kind und jedes Kind neu, das danach gestartet wurde. Verwenden Sie für Pipeline-style Abhängigkeitsketten.

Verwenden Sie `DynamicSupervisor` für unbegrenzte, zur Laufzeit erstellte Prozesse (z.B. Pro-Benutzer-Sitzungen, Pro-Connection-Worker):

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

LiveView-Prozesslebenszyklus:
1. `mount/3` — aufgerufen beim statischen Render (kein Socket) und beim Live-Socket-Verbindung
2. `handle_params/3` — aufgerufen nach Mount bei Live-Navigation
3. `handle_event/3` — handhabt `phx-click`, `phx-change`, `phx-submit`
4. `handle_info/2` — handhabt Nachrichten von anderen Prozessen (PubSub-Broadcasts)

Für komplexe Komponenten extrahieren Sie zu `Phoenix.LiveComponent`, um State zu scopen und Parent-Re-Renders zu reduzieren.

### Ecto.Multi for Transactions

Verwenden Sie `Ecto.Multi`, um mehrere Datenbankoperationen in einer atomaren Transaktion zu gruppieren:

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

`Repo.transaction/1` auf einem Multi gibt zurück:
- `{:ok, %{user: user, wallet: wallet, welcome_email: user}}` bei Erfolg
- `{:error, failed_operation_name, changeset_or_value, changes_so_far}` bei Fehler

Jeder Schritt erhält Ergebnisse aus vorherigen Schritten in der Map-Argument. Rollback ist automatisch bei jedem `{:error, ...}` Return.

### Pipeline Operator Patterns

Der Pipe-Operator `|>` übergibt das Ergebnis des linken Ausdrucks als erstes Argument an die rechte Funktion:

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

Verwenden Sie `with` anstelle verschachtelter `case`-Ausdrücke für Sequenzen von Operationen, die unabhängig fehlschlagen können.

### Environment Config with Config

Phoenix 7 verwendet das Drei-Datei-Config-Pattern:

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

Build a Mix Release:

```bash
MIX_ENV=prod mix release
_build/prod/rel/my_app/bin/my_app start
```

## Beispiel

Eine PubSub-gestützte LiveView, die Echtzeit-Order-Updates zeigt:

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
