---
name: reinforcement-learning
updated: 2026-06-13
---

# Reinforcement Learning

## When to activate
Designing Gymnasium-compatible environments, training policies with Stable Baselines3, engineering or debugging reward functions, implementing curriculum learning schedules, deploying trained agents to production (ONNX export), hyperparameter tuning RL runs with Optuna, or closing the sim-to-real gap with domain randomization.

## When NOT to use
Supervised classification or regression — even if framed as "learning from feedback." Fine-tuning LLMs with RLHF (that is a different workflow). Solving tabular optimization problems where a greedy or LP solver is faster. When you have no simulator and collecting real environment rollouts is expensive without a clear feedback loop.

## Instructions

### Gymnasium Environment Design

Implement `Env` with typed spaces, deterministic reset, and capped episode length:

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

Always call `gym.utils.env_checker.check_env(env)` before training to catch space mismatches.

### Algorithm Selection

| Scenario | Algorithm | Reason |
|---|---|---|
| General / mixed action space | PPO | Stable, few hyperparams, clip objective prevents large updates |
| Continuous actions (robotics, control) | SAC | Off-policy, entropy regularization, sample efficient |
| Discrete actions (games, routing) | DQN | Simple, works well with replay buffer |
| Multi-agent cooperative | MAPPO | PPO extended to multi-agent |
| Very limited environment samples | TD3 | Deterministic policy, more sample efficient than SAC on some tasks |

### Stable Baselines3 Training with Callbacks

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

**Reward hacking** — if the agent finds a loophole that maximizes reward without solving the task, the reward function is underspecified. Common signs: reward goes up but task metric (e.g., actual inventory service level) doesn't.

**Sparse vs dense**: sparse rewards (only terminal) are harder to learn but less likely to be gamed. Dense rewards speed up learning but require careful design. Potential-based shaping `F(s,s') = γΦ(s') - Φ(s)` is theoretically safe — it cannot change the optimal policy.

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

Start with easy variants and increase difficulty only when the agent succeeds:

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

### Hyperparameter Tuning with Optuna

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

### ONNX Export for Production Inference

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

### Domain Randomization for Sim-to-Real

Randomize physics, sensor noise, and appearance parameters each episode reset so the policy learns to handle the full distribution, not a single simulation configuration:

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

## Example

Train a PPO agent on a custom inventory management Gymnasium environment using curriculum learning that gradually increases demand variance, evaluate with `EvalCallback` every 10,000 steps, tune `lr` and `n_steps` with Optuna over 50 trials, then export the best checkpoint to ONNX for production inference via FastAPI.

Training command:
```bash
python train.py --total-timesteps 2000000 --n-envs 8 --tensorboard-log ./tb_logs
```

Production inference endpoint loads `policy.onnx` at startup and returns discrete order actions in under 5ms p99.

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
