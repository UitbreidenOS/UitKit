# Reinforcement Learning

## Wann aktivieren
Design von Gymnasium-Kompatiblen Umgebungen, Training von Policies mit Stable Baselines3, Engineering oder Debugging von Reward Functions, Implementierung von Curriculum Learning Schedules, Deployment von trainierten Agents zu Production (ONNX Export), Hyperparameter Tuning RL Runs mit Optuna oder Closing des Sim-to-Real Gap mit Domain Randomization.

## Wann NICHT verwenden
Supervised Classification oder Regression — auch wenn als "Learning from Feedback" framed. Fine-Tuning von LLMs mit RLHF (das ist ein anderer Workflow). Lösen von Tabular Optimization Problemen, wo ein Greedy oder LP Solver schneller ist. Wenn Sie keinen Simulator haben und das Sammeln von Real Environment Rollouts ohne ein klares Feedback Loop teuer ist.

## Anweisungen

### Gymnasium Environment Design

Implementieren Sie `Env` mit typisierten Spaces, deterministischem Reset und gecappter Episode Länge:

```python
import gymnasium as gym
from gymnasium import spaces
import numpy as np

class InventoryEnv(gym.Env):
    metadata = {"render_modes": ["human"]}

    def __init__(self, max_stock: int = 100):
        super().__init__()
        self.max_stock = max_stock
        # Observation: [current_stock, demand_forecast, days_until_reorder]
        self.observation_space = spaces.Box(
            low=np.array([0, 0, 0], dtype=np.float32),
            high=np.array([max_stock, max_stock, 30], dtype=np.float32),
        )
        # Action: order quantity (discrete bins)
        self.action_space = spaces.Discrete(11)  # 0, 10, 20, ... 100 units
        self._max_steps = 365
        self._step = 0

    def reset(self, seed=None, options=None):
        super().reset(seed=seed)
        self.stock = self.max_stock // 2
        self.demand_forecast = self.np_random.integers(10, 40)
        self._step = 0
        return self._obs(), {}

    def step(self, action: int):
        order_qty = action * 10
        demand = self.np_random.integers(
            max(0, self.demand_forecast - 5),
            self.demand_forecast + 6
        )
        self.stock = np.clip(self.stock + order_qty - demand, 0, self.max_stock)
        reward = self._reward(order_qty, demand)
        self._step += 1
        terminated = self._step >= self._max_steps
        return self._obs(), reward, terminated, False, {}

    def _obs(self):
        return np.array([self.stock, self.demand_forecast, 30 - self._step % 30],
                        dtype=np.float32)

    def _reward(self, order_qty, demand):
        holding_cost = self.stock * 0.1
        stockout_penalty = max(0, demand - self.stock) * 5.0
        order_cost = (order_qty > 0) * 2.0 + order_qty * 0.05
        return -(holding_cost + stockout_penalty + order_cost)
```

Rufen Sie immer `gym.utils.env_checker.check_env(env)` vor dem Training auf, um Space Mismatches zu fangen.

### Algorithm Selection

| Scenario | Algorithm | Reason |
|---|---|---|
| General / mixed action space | PPO | Stable, few hyperparams, clip objective prevents large updates |
| Continuous actions (robotics, control) | SAC | Off-policy, entropy regularization, sample efficient |
| Discrete actions (games, routing) | DQN | Simple, works well with replay buffer |
| Multi-agent cooperative | MAPPO | PPO extended to multi-agent |
| Very limited environment samples | TD3 | Deterministic policy, more sample efficient than SAC on some tasks |

### Stable Baselines3 Training mit Callbacks

```python
from stable_baselines3 import PPO
from stable_baselines3.common.callbacks import EvalCallback, CheckpointCallback
from stable_baselines3.common.env_util import make_vec_env

train_env = make_vec_env(InventoryEnv, n_envs=8)  # parallel rollouts
eval_env = make_vec_env(InventoryEnv, n_envs=4)

eval_callback = EvalCallback(
    eval_env,
    best_model_save_path="./checkpoints/best",
    log_path="./logs",
    eval_freq=10_000,
    n_eval_episodes=20,
    deterministic=True,
)
checkpoint_callback = CheckpointCallback(
    save_freq=50_000,
    save_path="./checkpoints",
    name_prefix="ppo_inventory",
)

model = PPO(
    "MlpPolicy",
    train_env,
    learning_rate=3e-4,
    n_steps=2048,
    batch_size=64,
    n_epochs=10,
    gamma=0.99,
    clip_range=0.2,
    verbose=1,
    tensorboard_log="./tb_logs",
)
model.learn(total_timesteps=2_000_000, callback=[eval_callback, checkpoint_callback])
```

### Reward Shaping Pitfalls

**Reward Hacking** — wenn der Agent ein Loch findet, die Reward ohne das Solving der Aufgabe zu maximieren, ist die Reward Function unterspecifiziert. Häufige Zeichen: Reward geht nach oben, aber Task Metrik (z.B. tatsächliche Inventory Service Level) nicht.

**Sparse vs Dense**: Sparse Rewards (nur Terminal) sind schwerer zu lernen, aber weniger wahrscheinlich gehackt zu werden. Dense Rewards beschleunigen das Lernen, erfordern aber sorgfältiges Design. Potential-Basiertes Shaping `F(s,s') = γΦ(s') - Φ(s)` ist theoretisch sicher — es kann die optimale Policy nicht ändern.

```python
# Potential-based shaping example
def _reward(self, ...):
    base_reward = ...
    phi_current = -abs(self.stock - self.target_stock)
    phi_prev = -abs(self.prev_stock - self.target_stock)
    shaping = 0.99 * phi_current - phi_prev
    return base_reward + 0.1 * shaping
```

### Curriculum Learning

Starten Sie mit einfachen Varianten und erhöhen Sie die Schwierigkeit nur, wenn der Agent erfolgreich ist:

```python
class CurriculumCallback(BaseCallback):
    def __init__(self, env, thresholds):
        super().__init__()
        self.env = env
        self.thresholds = thresholds  # [(min_reward, new_difficulty), ...]
        self.level = 0

    def _on_step(self):
        mean_reward = np.mean([ep["r"] for ep in self.model.ep_info_buffer])
        if (self.level < len(self.thresholds) and
                mean_reward > self.thresholds[self.level][0]):
            self.level += 1
            self.env.env_method("set_difficulty", self.thresholds[self.level - 1][1])
        return True
```

### Hyperparameter Tuning mit Optuna

```python
import optuna

def objective(trial):
    lr = trial.suggest_float("lr", 1e-5, 1e-3, log=True)
    n_steps = trial.suggest_categorical("n_steps", [512, 1024, 2048])
    gamma = trial.suggest_float("gamma", 0.95, 0.9999)

    model = PPO("MlpPolicy", train_env, learning_rate=lr,
                n_steps=n_steps, gamma=gamma, verbose=0)
    model.learn(500_000)
    mean_reward, _ = evaluate_policy(model, eval_env, n_eval_episodes=20)
    return mean_reward

study = optuna.create_study(direction="maximize")
study.optimize(objective, n_trials=50, n_jobs=4)
```

### ONNX Export für Production Inference

```python
import torch

obs = torch.zeros(1, *env.observation_space.shape)
torch.onnx.export(
    model.policy,
    obs,
    "policy.onnx",
    input_names=["obs"],
    output_names=["action"],
    dynamic_axes={"obs": {0: "batch"}},
    opset_version=17,
)

# Inference
import onnxruntime as ort
session = ort.InferenceSession("policy.onnx")
action = session.run(["action"], {"obs": obs_array})[0]
```

### Domain Randomization für Sim-to-Real

Randomisieren Sie Physik, Sensor Noise und Appearance Parameter bei jedem Episode Reset, damit die Policy lernt, die volle Distribution zu handhaben, nicht eine einzelne Simulation Konfiguration:

```python
def reset(self, seed=None, options=None):
    super().reset(seed=seed)
    # Randomize physics parameters
    self.mass = self.np_random.uniform(0.8, 1.2) * self.base_mass
    self.friction = self.np_random.uniform(0.5, 1.5) * self.base_friction
    # Randomize sensor noise level
    self.obs_noise_std = self.np_random.uniform(0.0, 0.02)
    ...
```

## Beispiel

Training eines PPO Agent auf einer Custom Inventory Management Gymnasium Umgebung mit Curriculum Learning, die graduell Demand Variance erhöht, evaluieren mit `EvalCallback` alle 10.000 Steps, tune `lr` und `n_steps` mit Optuna über 50 Trials, dann export das beste Checkpoint zu ONNX für Production Inference via FastAPI.

Training Command:
```bash
python train.py --total-timesteps 2000000 --n-envs 8 --tensorboard-log ./tb_logs
```

Production Inference Endpoint lädt `policy.onnx` beim Startup und gibt diskrete Order Actions in unter 5ms p99 zurück.

---
