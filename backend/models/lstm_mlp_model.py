"""
SK Planet AIOps - LSTM + MLP 모델
Jupyter Notebook에서 Python 스크립트로 변환
"""

import pandas as pd
import numpy as np
import os
import random
from sklearn.model_selection import train_test_split
from tqdm import tqdm
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader, random_split
import joblib
from sklearn.preprocessing import StandardScaler

class TabularSeqModel(nn.Module):
    def __init__(self, d_features, lstm_hidden=64, hidden_units=[256, 128], dropout=0.2):
        super(TabularSeqModel, self).__init__()
        
        # LSTM for sequence features (seq column)
        self.lstm = nn.LSTM(
            input_size=1,  # seq is single value
            hidden_size=lstm_hidden,
            num_layers=1,
            batch_first=True,
            dropout=dropout
        )
        
        # MLP for tabular features
        self.tabular_layers = nn.ModuleList()
        
        # Input layer
        self.tabular_layers.append(nn.Linear(d_features, hidden_units[0]))
        
        # Hidden layers
        for i in range(len(hidden_units) - 1):
            self.tabular_layers.append(nn.Linear(hidden_units[i], hidden_units[i + 1]))
        
        # Final layers
        self.final_layers = nn.Sequential(
            nn.Linear(hidden_units[-1] + lstm_hidden, 64),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(64, 1),
            nn.Sigmoid()
        )
        
    def forward(self, x_tabular, x_seq):
        # LSTM processing
        lstm_out, (hidden, cell) = self.lstm(x_seq)
        lstm_features = hidden.squeeze(0)  # (batch_size, lstm_hidden)
        
        # Tabular processing
        tabular_features = x_tabular
        for layer in self.tabular_layers:
            tabular_features = F.relu(layer(tabular_features))
        
        # Combine features
        combined = torch.cat([tabular_features, lstm_features], dim=1)
        
        # Final prediction
        output = self.final_layers(combined)
        return output

class ClickDataset(Dataset):
    def __init__(self, df, feature_cols, seq_col, target_col):
        self.df = df.reset_index(drop=True)
        self.feature_cols = feature_cols
        self.seq_col = seq_col
        self.target_col = target_col
        
    def __len__(self):
        return len(self.df)
    
    def __getitem__(self, idx):
        row = self.df.iloc[idx]
        
        # Tabular features
        tabular_features = torch.FloatTensor(row[self.feature_cols].values)
        
        # Sequence feature (seq column as sequence)
        seq_value = torch.FloatTensor([row[self.seq_col]]).unsqueeze(0).unsqueeze(0)  # (1, 1, 1)
        
        # Target
        target = torch.FloatTensor([row[self.target_col]])
        
        return tabular_features, seq_value, target

def seed_everything(seed):
    random.seed(seed)
    os.environ['PYTHONHASHSEED'] = str(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

class CTRPredictor:
    def __init__(self, model_path=None, feature_mapping_path=None):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = None
        self.scaler = None
        self.feature_mapping = None
        self.feature_cols = None
        
        # Load feature mapping
        if feature_mapping_path and os.path.exists(feature_mapping_path):
            self.feature_mapping = pd.read_csv(feature_mapping_path)
        
        # Load model if path provided
        if model_path and os.path.exists(model_path):
            self.load_model(model_path)
    
    def load_model(self, model_path):
        """Load pre-trained model"""
        try:
            checkpoint = torch.load(model_path, map_location=self.device)
            
            # Get model parameters from checkpoint
            d_features = checkpoint.get('d_features', 118)  # Default to 118 features
            
            self.model = TabularSeqModel(
                d_features=d_features,
                lstm_hidden=64,
                hidden_units=[256, 128],
                dropout=0.2
            )
            
            self.model.load_state_dict(checkpoint['model_state_dict'])
            self.model.to(self.device)
            self.model.eval()
            
            # Load scaler if available
            if 'scaler' in checkpoint:
                self.scaler = checkpoint['scaler']
            
            return True
        except Exception as e:
            print(f"Error loading model: {e}")
            return False
    
    def prepare_data(self, df, sample_size=10000):
        """Prepare data for training"""
        # Sample data for faster training
        if len(df) > sample_size:
            df = df.sample(n=sample_size, random_state=42).reset_index(drop=True)
        
        # Define feature columns (exclude target and seq)
        target_col = 'clicked'
        seq_col = 'seq'
        
        feature_cols = [col for col in df.columns if col not in [target_col, seq_col]]
        self.feature_cols = feature_cols
        
        # Split data
        train_df, val_df = train_test_split(
            df,
            test_size=0.2,
            stratify=df[target_col],
            random_state=42
        )
        
        # Create datasets
        train_dataset = ClickDataset(train_df, feature_cols, seq_col, target_col)
        val_dataset = ClickDataset(val_df, feature_cols, seq_col, target_col)
        
        return train_dataset, val_dataset, feature_cols
    
    def train_model(self, train_dataset, val_dataset, epochs=10, batch_size=4096, learning_rate=1e-3):
        """Train the model"""
        seed_everything(42)
        
        # Create data loaders
        train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
        val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)
        
        # Initialize model
        self.model = TabularSeqModel(
            d_features=len(self.feature_cols),
            lstm_hidden=64,
            hidden_units=[256, 128],
            dropout=0.2
        ).to(self.device)
        
        # Optimizer and loss
        optimizer = optim.Adam(self.model.parameters(), lr=learning_rate)
        criterion = nn.BCELoss()
        
        # Training history
        history = {
            'train_loss': [],
            'val_loss': [],
            'train_acc': [],
            'val_acc': []
        }
        
        best_val_loss = float('inf')
        
        for epoch in range(epochs):
            # Training
            self.model.train()
            train_loss = 0
            train_correct = 0
            train_total = 0
            
            for batch_idx, (tabular, seq, target) in enumerate(train_loader):
                tabular, seq, target = tabular.to(self.device), seq.to(self.device), target.to(self.device)
                
                optimizer.zero_grad()
                output = self.model(tabular, seq)
                loss = criterion(output, target)
                loss.backward()
                optimizer.step()
                
                train_loss += loss.item()
                predicted = (output > 0.5).float()
                train_total += target.size(0)
                train_correct += (predicted == target).sum().item()
            
            # Validation
            self.model.eval()
            val_loss = 0
            val_correct = 0
            val_total = 0
            
            with torch.no_grad():
                for tabular, seq, target in val_loader:
                    tabular, seq, target = tabular.to(self.device), seq.to(self.device), target.to(self.device)
                    output = self.model(tabular, seq)
                    loss = criterion(output, target)
                    
                    val_loss += loss.item()
                    predicted = (output > 0.5).float()
                    val_total += target.size(0)
                    val_correct += (predicted == target).sum().item()
            
            # Calculate averages
            avg_train_loss = train_loss / len(train_loader)
            avg_val_loss = val_loss / len(val_loader)
            train_acc = train_correct / train_total
            val_acc = val_correct / val_total
            
            # Store history
            history['train_loss'].append(avg_train_loss)
            history['val_loss'].append(avg_val_loss)
            history['train_acc'].append(train_acc)
            history['val_acc'].append(val_acc)
            
            print(f'Epoch {epoch+1}/{epochs}:')
            print(f'  Train Loss: {avg_train_loss:.4f}, Train Acc: {train_acc:.4f}')
            print(f'  Val Loss: {avg_val_loss:.4f}, Val Acc: {val_acc:.4f}')
            
            # Save best model
            if avg_val_loss < best_val_loss:
                best_val_loss = avg_val_loss
                self.save_model(f'model_epoch_{epoch+1}.pth', history)
        
        return history
    
    def save_model(self, model_path, history=None):
        """Save model with metadata"""
        checkpoint = {
            'model_state_dict': self.model.state_dict(),
            'd_features': len(self.feature_cols),
            'feature_cols': self.feature_cols,
            'history': history
        }
        
        if self.scaler:
            checkpoint['scaler'] = self.scaler
            
        torch.save(checkpoint, model_path)
        print(f"Model saved to {model_path}")
    
    def predict(self, df):
        """Make predictions on new data"""
        if self.model is None:
            raise ValueError("Model not loaded or trained")
        
        self.model.eval()
        
        # Prepare data
        tabular_data = df[self.feature_cols].values
        seq_data = df['seq'].values.reshape(-1, 1, 1)
        
        # Convert to tensors
        tabular_tensor = torch.FloatTensor(tabular_data).to(self.device)
        seq_tensor = torch.FloatTensor(seq_data).to(self.device)
        
        # Make predictions
        with torch.no_grad():
            predictions = self.model(tabular_tensor, seq_tensor)
        
        return predictions.cpu().numpy().flatten()
    
    def get_feature_importance(self, df, target_col='clicked'):
        """Get feature importance using permutation importance"""
        from sklearn.inspection import permutation_importance
        from sklearn.ensemble import RandomForestClassifier
        
        # Prepare data
        X = df[self.feature_cols]
        y = df[target_col]
        
        # Train Random Forest for feature importance
        rf = RandomForestClassifier(n_estimators=100, random_state=42)
        rf.fit(X, y)
        
        # Get feature importance
        importance_df = pd.DataFrame({
            'feature': self.feature_cols,
            'importance': rf.feature_importances_
        }).sort_values('importance', ascending=False)
        
        return importance_df

def main():
    """Main function for testing"""
    # Load data
    data_path = "/Users/jangsomin/workspace/CTR_60000_renamed.csv"
    feature_mapping_path = "/Users/jangsomin/workspace/sample/feature_name_mapping.csv"
    
    if not os.path.exists(data_path):
        print(f"Data file not found: {data_path}")
        return
    
    print("Loading data...")
    df = pd.read_csv(data_path)
    print(f"Data shape: {df.shape}")
    
    # Initialize predictor
    predictor = CTRPredictor(feature_mapping_path=feature_mapping_path)
    
    # Prepare data
    print("Preparing data...")
    train_dataset, val_dataset, feature_cols = predictor.prepare_data(df, sample_size=10000)
    
    print(f"Train dataset size: {len(train_dataset)}")
    print(f"Validation dataset size: {len(val_dataset)}")
    print(f"Number of features: {len(feature_cols)}")
    
    # Train model
    print("Training model...")
    history = predictor.train_model(train_dataset, val_dataset, epochs=5, batch_size=1024)
    
    # Get feature importance
    print("Getting feature importance...")
    importance_df = predictor.get_feature_importance(df)
    print("Top 10 features:")
    print(importance_df.head(10))
    
    print("Training completed!")

if __name__ == "__main__":
    main()
