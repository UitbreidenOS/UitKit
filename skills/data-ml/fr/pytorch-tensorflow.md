> 🇫🇷 This is the French translation. [English version](../pytorch-tensorflow.md).

# Compétence PyTorch / TensorFlow

## Quand activer
- Rédiger des boucles d'entraînement de réseaux de neurones avec PyTorch
- Construire et entraîner des modèles Keras/TensorFlow
- Implémenter des fonctions de perte personnalisées ou des architectures de modèles
- Configurer l'entraînement GPU avec la gestion des devices
- Rédiger des data loaders et des pipelines de prétraitement pour l'entraînement de modèles
- Implémenter l'évaluation de modèles, le checkpointing et l'arrêt anticipé
- Déboguer des pertes NaN, des gradients explosifs ou une instabilité d'entraînement
- Porter des modèles entre PyTorch et TensorFlow

## Quand NE PAS utiliser
- Tâches scikit-learn (classification, régression, clustering sur des données tabulaires) — pas du deep learning
- Manipulation de données Pandas/Polars avant l'étape de modélisation
- Fine-tuning Hugging Face avec l'API trainer (workflow différent)
- Déploiements d'inférence uniquement sans code d'entraînement

## Instructions

### Boucle d'entraînement PyTorch — structure standard
```python
import torch
import torch.nn as nn
from torch.utils.data import DataLoader

def train(model, train_loader, val_loader, epochs, lr, device):
    optimizer = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-2)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)
    criterion = nn.CrossEntropyLoss()

    best_val_loss = float('inf')

    for epoch in range(epochs):
        # Entraînement
        model.train()
        train_loss = 0.0
        for batch in train_loader:
            inputs, targets = batch
            inputs, targets = inputs.to(device), targets.to(device)

            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, targets)
            loss.backward()

            # Écrêtage des gradients — toujours pour la stabilité
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)

            optimizer.step()
            train_loss += loss.item()

        # Validation
        model.eval()
        val_loss = 0.0
        with torch.no_grad():
            for batch in val_loader:
                inputs, targets = batch
                inputs, targets = inputs.to(device), targets.to(device)
                outputs = model(inputs)
                val_loss += criterion(outputs, targets).item()

        scheduler.step()

        # Sauvegarder le meilleur modèle
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save(model.state_dict(), 'best_model.pt')

        print(f"Epoch {epoch+1}/{epochs} | Train: {train_loss/len(train_loader):.4f} | Val: {val_loss/len(val_loader):.4f}")
```

### Gestion des devices
```python
# Toujours sélectionner le device explicitement
device = torch.device('cuda' if torch.cuda.is_available() else
                       'mps' if torch.backends.mps.is_available() else
                       'cpu')
model = model.to(device)
```
Ne jamais coder en dur `'cuda'` — toujours vérifier la disponibilité.

### Structure de modèle personnalisé
```python
class MyModel(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim, dropout=0.3):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.LayerNorm(hidden_dim),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_dim, output_dim)
        )

    def forward(self, x):
        return self.network(x)
```
Préférer `nn.Sequential` pour les réseaux feedforward simples ; utiliser la surcharge de `forward()` pour les branchements complexes.

### Débogage de l'instabilité d'entraînement
1. **Perte NaN** → vérifier log(0) dans la perte, des entrées explosives, ou une division par zéro dans le prétraitement
2. **Gradients explosifs** → ajouter `clip_grad_norm_` (déjà dans le template ci-dessus)
3. **Gradients qui disparaissent** → vérifier les fonctions d'activation (éviter sigmoid/tanh dans les réseaux profonds), utiliser des connexions résiduelles
4. **Perte qui ne diminue pas** → réduire le LR de 10x, vérifier le mélange du data loader, vérifier que les labels sont corrects
5. **GPU OOM** → réduire la taille de batch, utiliser le gradient checkpointing, utiliser la précision mixte

### Entraînement en précision mixte (PyTorch)
```python
from torch.cuda.amp import autocast, GradScaler

scaler = GradScaler()

for batch in train_loader:
    optimizer.zero_grad()
    with autocast():
        outputs = model(inputs)
        loss = criterion(outputs, targets)
    scaler.scale(loss).backward()
    scaler.unscale_(optimizer)
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    scaler.step(optimizer)
    scaler.update()
```

### TensorFlow/Keras — structure standard
```python
import tensorflow as tf

model = tf.keras.Sequential([
    tf.keras.layers.Dense(256, activation='relu'),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(10, activation='softmax')
])

model.compile(
    optimizer=tf.keras.optimizers.AdamW(learning_rate=1e-3, weight_decay=1e-2),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

callbacks = [
    tf.keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True),
    tf.keras.callbacks.ModelCheckpoint('best_model.keras', save_best_only=True),
    tf.keras.callbacks.ReduceLROnPlateau(patience=3, factor=0.5)
]

history = model.fit(
    train_dataset,
    validation_data=val_dataset,
    epochs=100,
    callbacks=callbacks
)
```

## Exemple

**Utilisateur :** Construire un classificateur de texte PyTorch pour l'analyse de sentiment (binaire) avec embedding, LSTM et dropout.

**Sortie attendue :**
- `SentimentLSTM(nn.Module)` — couche d'embedding, LSTM, dropout, tête linéaire
- `forward()` — gère les séquences packed ou les entrées paddées
- Boucle d'entraînement avec écrêtage des gradients, validation par epoch, checkpoint du meilleur modèle
- `device` auto-détecté (CUDA/MPS/CPU)
- Séparation train/val via `DataLoader` avec mélange uniquement sur train

---
