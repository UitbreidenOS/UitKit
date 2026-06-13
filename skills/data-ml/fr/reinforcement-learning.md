# Apprentissage par renforcement

## Quand activer
Conception d'environnements compatibles Gymnasium, entraînement de politiques avec Stable Baselines3, ingénierie ou débogage de fonctions de récompense, implémentation d'apprentissage par curriculum, déploiement d'agents entraînés en production (export ONNX), tuning d'hyperparamètres de runs RL avec Optuna, ou fermeture du gap sim-to-real avec randomisation de domaine.

## Quand ne PAS utiliser
Classification ou régression supervisée — même si encadré comme « apprentissage par retours ». Fine-tuning LLMs avec RLHF (workflow différent). Résolution de problèmes d'optimisation tabulaires où un solveur greedy ou LP est plus rapide. Quand vous n'avez pas de simulateur et collecter les rollouts d'environnement réel est cher sans boucle de feedback claire.

## Instructions

### Design d'environnement Gymnasium

Implémenter `Env` avec espaces typés, reset déterministe, et longueur d'épisode cappée :

```python
import gymnasium as gym
from gymnasium import spaces
import numpy as np

class InventoryEnv(gym.Env):
    metadata = {"render_modes": ["human"]}

    def __init__(self, max_stock: int = 100):
        super().__init__()
        self.max_stock = max_stock
        self.observation_space = spaces.Box(
            low=np.array([0, 0, 0], dtype=np.float32),
            high=np.array([max_stock, max_stock, 30], dtype=np.float32),
        )
        self.action_space = spaces.Discrete(11)
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

Toujours appeler `gym.utils.env_checker.check_env(env)` avant l'entraînement.

### Sélection d'algorithme

| Scénario | Algorithme | Raison |
|---|---|---|
| Général / espace d'action mixte | PPO | Stable, peu d'hyperparam, clip objective |
| Actions continues (robotique) | SAC | Off-policy, entropy regularization |
| Actions discrètes (jeux) | DQN | Simple, fonctionne bien avec buffer |
| Coopératif multi-agent | MAPPO | PPO étendu aux multi-agent |
| Très peu d'échantillons | TD3 | Politique déterministe, plus sample efficient |

### Entraînement Stable Baselines3 avec callbacks

```python
from stable_baselines3 import PPO
from stable_baselines3.common.callbacks import EvalCallback, CheckpointCallback
from stable_baselines3.common.env_util import make_vec_env

train_env = make_vec_env(InventoryEnv, n_envs=8)
eval_env = make_vec_env(InventoryEnv, n_envs=4)

eval_callback = EvalCallback(
    eval_env, best_model_save_path="./checkpoints/best",
    log_path="./logs", eval_freq=10_000, n_eval_episodes=20,
    deterministic=True,
)
checkpoint_callback = CheckpointCallback(
    save_freq=50_000, save_path="./checkpoints",
    name_prefix="ppo_inventory",
)

model = PPO(
    "MlpPolicy", train_env,
    learning_rate=3e-4, n_steps=2048, batch_size=64,
    n_epochs=10, gamma=0.99, clip_range=0.2,
    verbose=1, tensorboard_log="./tb_logs",
)
model.learn(total_timesteps=2_000_000, callback=[eval_callback, checkpoint_callback])
```

### Modelage de récompense — pièges

**Reward hacking** — si l'agent trouve une faille qui maximise la récompense sans résoudre la tâche, la fonction est sous-spécifiée.

**Sparse vs dense** : récompenses creuses (terminal uniquement) sont plus difficiles à apprendre mais moins jouées. Potential-based shaping `F(s,s') = γΦ(s') - Φ(s)` est théoriquement sûr.

```python
def _reward(self, ...):
    base_reward = ...
    phi_current = -abs(self.stock - self.target_stock)
    phi_prev = -abs(self.prev_stock - self.target_stock)
    shaping = 0.99 * phi_current - phi_prev
    return base_reward + 0.1 * shaping
```

### Apprentissage par curriculum

Commencer avec des variantes faciles et augmenter la difficulté seulement quand l'agent réussit :

```python
class CurriculumCallback(BaseCallback):
    def __init__(self, env, thresholds):
        super().__init__()
        self.env = env
        self.thresholds = thresholds
        self.level = 0

    def _on_step(self):
        mean_reward = np.mean([ep["r"] for ep in self.model.ep_info_buffer])
        if (self.level < len(self.thresholds) and
                mean_reward > self.thresholds[self.level][0]):
            self.level += 1
            self.env.env_method("set_difficulty", self.thresholds[self.level - 1][1])
        return True
```

### Tuning d'hyperparamètres avec Optuna

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

### Export ONNX pour inférence de production

```python
import torch

obs = torch.zeros(1, *env.observation_space.shape)
torch.onnx.export(
    model.policy, obs, "policy.onnx",
    input_names=["obs"], output_names=["action"],
    dynamic_axes={"obs": {0: "batch"}}, opset_version=17,
)

import onnxruntime as ort
session = ort.InferenceSession("policy.onnx")
action = session.run(["action"], {"obs": obs_array})[0]
```

### Randomisation de domaine pour sim-to-real

Randomiser les paramètres de physique, bruit de capteur, et apparence à chaque reset d'épisode :

```python
def reset(self, seed=None, options=None):
    super().reset(seed=seed)
    self.mass = self.np_random.uniform(0.8, 1.2) * self.base_mass
    self.friction = self.np_random.uniform(0.5, 1.5) * self.base_friction
    self.obs_noise_std = self.np_random.uniform(0.0, 0.02)
```

## Exemple

Entraîner un agent PPO sur un environnement Gymnasium personnalisé de gestion d'inventaire utilisant apprentissage par curriculum, évaluer avec `EvalCallback` tous les 10 000 pas, tuner `lr` et `n_steps` avec Optuna sur 50 essais, puis exporter le meilleur checkpoint vers ONNX pour inférence de production via FastAPI.

Commande d'entraînement :
```bash
python train.py --total-timesteps 2000000 --n-envs 8 --tensorboard-log ./tb_logs
```

Endpoint d'inférence de production charge `policy.onnx` au démarrage et retourne des actions d'ordre discrètes en moins de 5ms p99.

---
