# Elixir + Phoenix

## Quand activer
- Construction d'applications ou d'API web Phoenix
- Conception des arbres de supervision OTP avec GenServer et Supervisor
- Implémentation de Phoenix LiveView pour les interfaces utilisateur réactives rendues côté serveur
- Écriture des changesets Ecto et transactions de base de données
- Configuration des mix releases pour déploiement en production
- Utilisation du pipe operator et des idiomes de pattern matching

## Quand ne PAS utiliser
- Travail Erlang/OTP non-Elixir où la syntaxe Elixir est sans pertinence
- Les tâches de scripting simples mieux gérées par un script shell
- Quand la base de code est Elixir mais la question est purement sur l'optimisation des requêtes PostgreSQL sans implication d'Ecto

## Instructions

### Squelette GenServer

Un GenServer est un processus stateful. Implémenter explicitement tous les callbacks standard :

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

Utiliser `handle_call` pour les opérations synchrones qui retournent une valeur. Utiliser `handle_cast` pour les mutations de type tir-et-oublie. Utiliser `handle_info` pour les messages non envoyés via `call`/`cast` (timeurs, messages de moniteur de processus).

### Sélection de stratégie de supervision

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

Guide des stratégies :
- `:one_for_one` — redémarrer seulement l'enfant crashé. À utiliser quand les enfants sont entièrement indépendants.
- `:one_for_all` — redémarrer tous les enfants quand un crash. À utiliser quand tous les enfants partagent l'état ou doivent démarrer ensemble.
- `:rest_for_one` — redémarrer l'enfant crashé et chaque enfant démarré après lui. À utiliser pour les chaînes de dépendance de style pipeline.

Utiliser `DynamicSupervisor` pour les processus non bornés créés à l'exécution (par ex. sessions par utilisateur, workers par connexion) :

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

Cycle de vie du processus LiveView :
1. `mount/3` — appelé sur rendu statique (pas de socket) et sur connexion socket en direct
2. `handle_params/3` — appelé après mount lors de la navigation en direct
3. `handle_event/3` — gère `phx-click`, `phx-change`, `phx-submit`
4. `handle_info/2` — gère les messages d'autres processus (broadcasts PubSub)

Pour les composants complexes, extraire en `Phoenix.LiveComponent` pour délimiter l'état et réduire les re-rendus du parent.

### Ecto.Multi pour les transactions

Utiliser `Ecto.Multi` pour grouper plusieurs opérations de base de données en une transaction atomique :

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

`Repo.transaction/1` sur un Multi retourne :
- `{:ok, %{user: user, wallet: wallet, welcome_email: user}}` en cas de succès
- `{:error, failed_operation_name, changeset_or_value, changes_so_far}` en cas d'échec

Chaque étape reçoit les résultats des étapes antérieures dans l'argument map. La restauration est automatique sur toute réaction `{:error, ...}`.

### Motifs du pipe operator

L'opérateur pipe `|>` passe le résultat de l'expression de gauche en tant que premier argument à la fonction de droite :

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

Utiliser `with` au lieu d'expressions `case` imbriquées pour les séquences d'opérations qui peuvent chacune échouer indépendamment.

### Configuration d'environnement avec Config

Phoenix 7 utilise le modèle de configuration à trois fichiers :

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

Construire une release mix :

```bash
MIX_ENV=prod mix release
_build/prod/rel/my_app/bin/my_app start
```

## Exemple

Une LiveView soutenue par PubSub qui affiche les mises à jour de commandes en temps réel :

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
