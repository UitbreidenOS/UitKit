> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../pytorch-tensorflow.md).

# Skill de PyTorch / TensorFlow

## Cuándo activar
- Escribir bucles de entrenamiento de redes neuronales en PyTorch
- Construir y entrenar modelos Keras/TensorFlow
- Implementar funciones de pérdida personalizadas o arquitecturas de modelos
- Configurar entrenamiento en GPU con gestión de dispositivos
- Escribir cargadores de datos y pipelines de preprocesamiento para entrenamiento de modelos
- Implementar evaluación de modelos, checkpointing y early stopping
- Depurar pérdidas NaN, gradientes explosivos o inestabilidad de entrenamiento
- Portar modelos entre PyTorch y TensorFlow

## Cuándo NO usar
- Tareas de scikit-learn (clasificación, regresión, clustering en datos tabulares) — no es deep learning
- Manipulación de datos con Pandas/Polars antes del paso de modelado
- Fine-tuning con la API trainer de Hugging Face (flujo de trabajo diferente)
- Despliegues solo de inferencia sin código de entrenamiento

## Instrucciones

### Bucle de entrenamiento de PyTorch — estructura estándar
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
        # Entrenamiento
        model.train()
        train_loss = 0.0
        for batch in train_loader:
            inputs, targets = batch
            inputs, targets = inputs.to(device), targets.to(device)

            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, targets)
            loss.backward()

            # Recorte de gradientes — siempre para estabilidad
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)

            optimizer.step()
            train_loss += loss.item()

        # Validación
        model.eval()
        val_loss = 0.0
        with torch.no_grad():
            for batch in val_loader:
                inputs, targets = batch
                inputs, targets = inputs.to(device), targets.to(device)
                outputs = model(inputs)
                val_loss += criterion(outputs, targets).item()

        scheduler.step()

        # Checkpoint del mejor modelo
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save(model.state_dict(), 'best_model.pt')

        print(f"Epoch {epoch+1}/{epochs} | Train: {train_loss/len(train_loader):.4f} | Val: {val_loss/len(val_loader):.4f}")
```

### Gestión de dispositivos
```python
# Siempre selección explícita del dispositivo
device = torch.device('cuda' if torch.cuda.is_available() else
                       'mps' if torch.backends.mps.is_available() else
                       'cpu')
model = model.to(device)
```
Nunca hardcodees `'cuda'` — siempre verifica la disponibilidad.

### Estructura del modelo personalizado
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
Prefiere `nn.Sequential` para feedforward simple; usa la sobreescritura de `forward()` para ramificaciones complejas.

### Depuración de inestabilidad de entrenamiento
1. **Pérdida NaN** → verifica log(0) en la pérdida, entradas explosivas o división por cero en el preprocesamiento
2. **Gradientes explosivos** → agrega `clip_grad_norm_` (ya en la plantilla anterior)
3. **Gradientes que desaparecen** → verifica las funciones de activación (evita sigmoid/tanh en redes profundas), usa conexiones residuales
4. **La pérdida no disminuye** → reduce LR 10x, verifica el shuffling del data loader, verifica que las etiquetas son correctas
5. **OOM en GPU** → reduce el tamaño del batch, usa gradient checkpointing, usa precisión mixta

### Entrenamiento con precisión mixta (PyTorch)
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

### TensorFlow/Keras — estructura estándar
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

## Ejemplo

**Usuario:** Construir un clasificador de texto en PyTorch para análisis de sentimientos (binario) con embedding, LSTM y dropout.

**Salida esperada:**
- `SentimentLSTM(nn.Module)` — capa de embedding, LSTM, dropout, cabeza lineal
- `forward()` — maneja secuencias empaquetadas o entrada con padding
- Bucle de entrenamiento con recorte de gradientes, validación por época, checkpoint del mejor modelo
- `device` auto-detectado (CUDA/MPS/CPU)
- División train/val mediante `DataLoader` con shuffling solo en train

---
