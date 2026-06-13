# Reinforcement Learning

## Wanneer activeren
Ontwerpen van Gymnasium-compatible environments, training van policies met Stable Baselines3, engineering of debugging van reward functions, implementeren van curriculum learning schedules, deployen van trained agents naar production (ONNX export), hyperparameter tuning RL runs met Optuna, of sluiten van sim-to-real gap met domain randomization.

## Wanneer NIET gebruiken
Supervised classification of regression — zelfs als framed als "learning from feedback." Fine-tuning LLMs met RLHF. Solving tabular optimization problems. Wanneer geen simulator en collecting real environment rollouts is duur.

## Instructies

### Gymnasium Environment Design

Implementeer `Env` met typed spaces, deterministic reset, en capped episode length:

```python
import gymnasium as gym
from gymnasium import spaces
import numpy as np

class InventoryEnv(gym.Env):
    def __init__(self, max_stock: int = 100):
        super().__init__()
        self.max_stock = max_stock
        self.observation_space = spaces.Box(
            low=np.array([0, 0, 0], dtype=np.float32),
            high=np.array([max_stock, max_stock, 30], dtype=np.float32),
        )
        self.action_space = spaces.Discrete(11)  # 0, 10, 20, ... 100 units
        self._max_steps = 365
        self._step = 0

    def reset(self, seed=None, options=None):
        super().reset(seed=seed)
        self.stock = self.max_stock // 2
        self._step = 0
        return self._obs(), {}

    def step(self, action: int):
        order_qty = action * 10
        demand = self.np_random.integers(10, 40)
        self.stock = np.clip(self.stock + order_qty - demand, 0, self.max_stock)
        reward = self._reward(order_qty, demand)
        self._step += 1
        terminated = self._step >= self._max_steps
        return self._obs(), reward, terminated, False, {}

    def _obs(self):
        return np.array([self.stock, 30, 30 - self._step % 30], dtype=np.float32)

    def _reward(self, order_qty, demand):
        holding_cost = self.stock * 0.1
        stockout_penalty = max(0, demand - self.stock) * 5.0
        order_cost = (order_qty > 0) * 2.0 + order_qty * 0.05
        return -(holding_cost + stockout_penalty + order_cost)
```

Altijd roep `gym.utils.env_checker.check_env(env)` voor training aan.

### Algorithm Selection

| Scenario | Algorithm | Reason |
|---|---|---|
| General | PPO | Stable, few hyperparams, clip objective |
| Continuous actions | SAC | Off-policy, entropy regularization, sample efficient |
| Discrete actions | DQN | Simple, works well with replay buffer |
| Multi-agent | MAPPO | PPO extended to multi-agent |

### Stable Baselines3 Training

```python
from stable_baselines3 import PPO
from stable_baselines3.common.callbacks import EvalCallback
from stable_baselines3.common.env_util import make_vec_env

train_env = make_vec_env(InventoryEnv, n_envs=8)
eval_env = make_vec_env(InventoryEnv, n_envs=4)

model = PPO(
    "MlpPolicy",
    train_env,
    learning_rate=3e-4,
    n_steps=2048,
    batch_size=64,
    n_epochs=10,
    gamma=0.99,
    clip_range=0.2,
)
model.learn(total_timesteps=2_000_000)
```

### Reward Shaping

Reward hacking — als agent loophole vind die reward maximize zonder task op te lossen, reward function is underspecified.

Potential-based shaping is theoretically safe: `F(s,s') = γΦ(s') - Φ(s)` kan niet optimal policy veranderen.

### Domain Randomization for Sim-to-Real

Randomiseer physics, sensor noise, en appearance parameters elke episode reset zodat policy leert volledige distribution te hanteren:

```python
def reset(self, seed=None, options=None):
    super().reset(seed=seed)
    self.mass = self.np_random.uniform(0.8, 1.2) * self.base_mass
    self.friction = self.np_random.uniform(0.5, 1.5) * self.base_friction
    self.obs_noise_std = self.np_random.uniform(0.0, 0.02)
```

---
