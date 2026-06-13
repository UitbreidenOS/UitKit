> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../pytorch-tensorflow.md).

# PyTorch / TensorFlow Skill

## Wanneer te activeren
- Neurale netwerk-trainingslussen schrijven in PyTorch
- Keras/TensorFlow-modellen bouwen en trainen
- Aangepaste verliesfuncties of modelarchitecturen implementeren
- GPU-training instellen met apparaatbeheer
- Dataloaders en preprocessing-pipelines schrijven voor modeltraining
- Modelevaluatie, checkpointing en vroeg stoppen implementeren
- NaN-verliezen, exploderende gradiënten of trainingsinstabiliteit debuggen
- Modellen porteren tussen PyTorch en TensorFlow

## Wanneer NIET te gebruiken
- scikit-learn-taken (classificatie, regressie, clustering op tabelgegevens) — geen deep learning
- Pandas/Polars-gegevensmanipulatie vóór de modelleerstap
- Hugging Face fine-tuning met trainer API (andere workflow)
- Inference-only deployments zonder trainingscode

## Instructies

### PyTorch trainingslus — standaardstructuur
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
        # Training
        model.train()
        train_loss = 0.0
        for batch in train_loader:
            inputs, targets = batch
            inputs, targets = inputs.to(device), targets.to(device)

            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, targets)
            loss.backward()

            # Gradiëntclipping — altijd voor stabiliteit
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)

            optimizer.step()
            train_loss += loss.item()

        # Validatie
        model.eval()
        val_loss = 0.0
        with torch.no_grad():
            for batch in val_loader:
                inputs, targets = batch
                inputs, targets = inputs.to(device), targets.to(device)
                outputs = model(inputs)
                val_loss += criterion(outputs, targets).item()

        scheduler.step()

        # Checkpoint beste model
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save(model.state_dict(), 'best_model.pt')

        print(f"Epoch {epoch+1}/{epochs} | Train: {train_loss/len(train_loader):.4f} | Val: {val_loss/len(val_loader):.4f}")
```

### Apparaatbeheer
```python
# Altijd expliciete apparaatselectie
device = torch.device('cuda' if torch.cuda.is_available() else
                       'mps' if torch.backends.mps.is_available() else
                       'cpu')
model = model.to(device)
```
Codeer nooit `'cuda'` hard — controleer altijd beschikbaarheid.

### Aangepaste modelstructuur
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
Geef de voorkeur aan `nn.Sequential` voor eenvoudige feedforward; gebruik `forward()`-overschrijving voor complexe vertakkingen.

### Trainingsinstabiliteit debuggen
1. **NaN-verlies** → controleer op log(0) in verlies, exploderende invoer of deling door nul in preprocessing
2. **Exploderende gradiënten** → voeg `clip_grad_norm_` toe (al aanwezig in bovenstaande sjabloon)
3. **Verdwijnende gradiënten** → controleer activeringsfuncties (vermijd sigmoid/tanh in diepe netwerken), gebruik residuele verbindingen
4. **Verlies daalt niet** → verklein LR 10x, controleer shuffling van dataloader, controleer of labels correct zijn
5. **GPU OOM** → verklein batchgrootte, gebruik gradiëntcheckpointing, gebruik gemengde precisie

### Training met gemengde precisie (PyTorch)
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

### TensorFlow/Keras — standaardstructuur
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

## Voorbeeld

**Gebruiker:** Bouw een PyTorch-tekstclassificator voor sentimentanalyse (binair) met embedding, LSTM en dropout.

**Verwachte output:**
- `SentimentLSTM(nn.Module)` — embeddinglaag, LSTM, dropout, lineair hoofd
- `forward()` — behandelt verpakte sequenties of gevulde invoer
- Trainingslus met gradiëntclipping, validatie per epoch, beste model checkpoint
- `device` automatisch gedetecteerd (CUDA/MPS/CPU)
- Train/val-splitsing via `DataLoader` met shuffling alleen op train

---
