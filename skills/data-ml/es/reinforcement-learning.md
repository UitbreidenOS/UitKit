# Aprendizaje por Refuerzo

## Cuándo activar
Construcción de agentes de aprendizaje por refuerzo, programación de espacios de estado y acción, implementación de algoritmos como DQN, PPO, o A3C, evaluación de políticas entrenadas, o despliegue de modelos de RL en entornos de simulación.

## Cuándo NO usar
Problemas de aprendizaje supervisado donde RL no es necesario. Optimización simple sin requisito de toma de decisiones secuencial.

## Instrucciones

### Configuración del Entorno

Usar OpenAI Gym o alternatives como ambiente:

```python
import gymnasium as gym

env = gym.make("CartPole-v1")
observation, info = env.reset(seed=42)

for _ in range(100):
    action = env.action_space.sample()
    observation, reward, terminated, truncated, info = env.step(action)
    if terminated or truncated:
        observation, info = env.reset()
```

### Algoritmos de RL

Usar librerías como Stable-Baselines3:

```python
from stable_baselines3 import PPO
from stable_baselines3.common.env_util import make_vec_env

env = make_vec_env("CartPole-v1", n_envs=4)
model = PPO("MlpPolicy", env, verbose=1)
model.learn(total_timesteps=100000)
model.save("ppo_cartpole")
```

---
