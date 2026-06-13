> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../pytorch-tensorflow.md).

# PyTorch / TensorFlow Skill

## Wann aktivieren
- Neuronale Netzwerk-Trainingsschleifen in PyTorch schreiben
- Keras/TensorFlow-Modelle bauen und trainieren
- Benutzerdefinierte Verlustfunktionen oder Modellarchitekturen implementieren
- GPU-Training mit Geräteverwaltung einrichten
- Datenlader und Vorverarbeitungs-Pipelines für das Modelltraining schreiben
- Modellauswertung, Checkpointing und Early Stopping implementieren
- NaN-Verluste, explodierende Gradienten oder Trainingsinstabilität debuggen
- Modelle zwischen PyTorch und TensorFlow portieren

## Wann NICHT verwenden
- scikit-learn-Aufgaben (Klassifikation, Regression, Clustering auf tabellarischen Daten) — kein Deep Learning
- Pandas/Polars-Datenmanipulation vor dem Modellierungsschritt
- Hugging Face Fine-Tuning mit Trainer API (anderer Workflow)
- Nur-Inferenz-Deployments ohne Trainingscode

## Anweisungen

### PyTorch-Trainingsschleife — Standardstruktur
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

            # Gradientenclipping — immer für Stabilität
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)

            optimizer.step()
            train_loss += loss.item()

        # Validierung
        model.eval()
        val_loss = 0.0
        with torch.no_grad():
            for batch in val_loader:
                inputs, targets = batch
                inputs, targets = inputs.to(device), targets.to(device)
                outputs = model(inputs)
                val_loss += criterion(outputs, targets).item()

        scheduler.step()

        # Bestes Modell speichern
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save(model.state_dict(), 'best_model.pt')

        print(f"Epoch {epoch+1}/{epochs} | Train: {train_loss/len(train_loader):.4f} | Val: {val_loss/len(val_loader):.4f}")
```

### Geräteverwaltung
```python
# Immer explizite Geräteauswahl
device = torch.device('cuda' if torch.cuda.is_available() else
                       'mps' if torch.backends.mps.is_available() else
                       'cpu')
model = model.to(device)
```
Niemals `'cuda'` hardcoden — immer Verfügbarkeit prüfen.

### Benutzerdefinierte Modellstruktur
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
`nn.Sequential` für einfache Feedforward-Netze bevorzugen; `forward()`-Überschreibung für komplexe Verzweigungen verwenden.

### Trainingsinstabilität debuggen
1. **NaN-Verlust** → auf log(0) im Verlust, explodierende Eingaben oder Division durch Null bei der Vorverarbeitung prüfen
2. **Explodierende Gradienten** → `clip_grad_norm_` hinzufügen (bereits in obiger Vorlage)
3. **Verschwindende Gradienten** → Aktivierungsfunktionen prüfen (sigmoid/tanh in tiefen Netzwerken vermeiden), Residualverbindungen verwenden
4. **Verlust sinkt nicht** → LR um Faktor 10 reduzieren, DataLoader-Shuffling prüfen, Labels verifizieren
5. **GPU OOM** → Batch-Größe reduzieren, Gradient Checkpointing verwenden, Mixed Precision verwenden

### Mixed Precision Training (PyTorch)
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

### TensorFlow/Keras — Standardstruktur
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

## Beispiel

**Benutzer:** Einen PyTorch-Textklassifikator für Sentiment-Analyse (binär) mit Embedding, LSTM und Dropout bauen.

**Erwartete Ausgabe:**
- `SentimentLSTM(nn.Module)` — Embedding-Layer, LSTM, Dropout, linearer Kopf
- `forward()` — verarbeitet gepackte Sequenzen oder aufgefüllte Eingaben
- Trainingsschleife mit Gradientenclipping, Validierung pro Epoche, bestes Modell-Checkpoint
- `device` automatisch erkannt (CUDA/MPS/CPU)
- Train/Val-Aufteilung via `DataLoader` mit Shuffling nur beim Training

---
