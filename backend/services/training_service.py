"""
Training Service - 모델 학습 및 관리
"""

import os
import uuid
import asyncio
import json
from datetime import datetime
from typing import Dict, Any, Optional
import pandas as pd
import numpy as np
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import logging

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.lstm_mlp_model import CTRPredictor

logger = logging.getLogger(__name__)

class TrainingService:
    def __init__(self, model_dir: str = "models", results_dir: str = "training_results"):
        self.model_dir = model_dir
        self.results_dir = results_dir
        self.training_jobs = {}  # Store training job status
        
        # Create directories
        os.makedirs(model_dir, exist_ok=True)
        os.makedirs(results_dir, exist_ok=True)
    
    def start_training(self, file_id: str, config: Dict[str, Any]) -> str:
        """Start training job and return run_id"""
        run_id = str(uuid.uuid4())
        
        # Initialize training job
        self.training_jobs[run_id] = {
            "status": "training",
            "file_id": file_id,
            "config": config,
            "start_time": datetime.now().isoformat(),
            "current_epoch": 0,
            "total_epochs": config.get("epochs", 10),
            "metrics": {},
            "error": None
        }
        
        # Start training in background
        asyncio.create_task(self._train_model_async(run_id))
        
        logger.info(f"Training started: {run_id}")
        return run_id
    
    async def _train_model_async(self, run_id: str):
        """Async training function"""
        try:
            job = self.training_jobs[run_id]
            file_id = job["file_id"]
            config = job["config"]
            
            # Load data
            from .data_service import DataService
            data_service = DataService()
            df = data_service.load_data(file_id, sample_size=config.get("sample_size", 10000))
            
            # Initialize predictor
            predictor = CTRPredictor()
            
            # Prepare data
            train_dataset, val_dataset, feature_cols = predictor.prepare_data(df, sample_size=config.get("sample_size", 10000))
            
            # Update job info
            job["feature_cols"] = feature_cols
            job["train_size"] = len(train_dataset)
            job["val_size"] = len(val_dataset)
            
            # Training callback
            def training_callback(epoch, train_loss, val_loss, train_acc, val_acc):
                job["current_epoch"] = epoch + 1
                job["metrics"] = {
                    "train_loss": float(train_loss),
                    "val_loss": float(val_loss),
                    "train_accuracy": float(train_acc),
                    "val_accuracy": float(val_acc)
                }
                logger.info(f"Epoch {epoch+1}: Train Acc={train_acc:.4f}, Val Acc={val_acc:.4f}")
            
            # Train model
            history = await self._train_model_with_callback(
                predictor, train_dataset, val_dataset, config, training_callback
            )
            
            # Calculate final metrics
            final_metrics = self._calculate_final_metrics(history)
            job["metrics"].update(final_metrics)
            
            # Save model
            model_path = os.path.join(self.model_dir, f"model_{run_id}.pth")
            predictor.save_model(model_path, history)
            job["model_path"] = model_path
            
            # Get feature importance
            importance_df = predictor.get_feature_importance(df)
            importance_path = os.path.join(self.results_dir, f"importance_{run_id}.csv")
            importance_df.to_csv(importance_path, index=False)
            job["importance_path"] = importance_path
            
            # Save training results
            results_path = os.path.join(self.results_dir, f"results_{run_id}.json")
            with open(results_path, 'w') as f:
                json.dump({
                    "run_id": run_id,
                    "config": config,
                    "history": history,
                    "metrics": job["metrics"],
                    "feature_importance": importance_df.head(20).to_dict('records'),
                    "timestamp": datetime.now().isoformat()
                }, f, indent=2)
            
            job["results_path"] = results_path
            job["status"] = "completed"
            job["end_time"] = datetime.now().isoformat()
            
            logger.info(f"Training completed: {run_id}")
            
        except Exception as e:
            job = self.training_jobs[run_id]
            job["status"] = "failed"
            job["error"] = str(e)
            job["end_time"] = datetime.now().isoformat()
            logger.error(f"Training failed: {run_id}, Error: {str(e)}")
    
    async def _train_model_with_callback(self, predictor, train_dataset, val_dataset, config, callback):
        """Train model with progress callback"""
        import torch
        import torch.nn as nn
        import torch.optim as optim
        from torch.utils.data import DataLoader
        
        # Create data loaders
        train_loader = DataLoader(train_dataset, batch_size=config.get("batch_size", 1024), shuffle=True)
        val_loader = DataLoader(val_dataset, batch_size=config.get("batch_size", 1024), shuffle=False)
        
        # Initialize model
        predictor.model = predictor.model or predictor._create_model(len(predictor.feature_cols))
        
        # Optimizer and loss
        optimizer = optim.Adam(predictor.model.parameters(), lr=config.get("learning_rate", 1e-3))
        criterion = nn.BCELoss()
        
        # Training history
        history = {
            'train_loss': [],
            'val_loss': [],
            'train_acc': [],
            'val_acc': []
        }
        
        epochs = config.get("epochs", 10)
        
        for epoch in range(epochs):
            # Training
            predictor.model.train()
            train_loss = 0
            train_correct = 0
            train_total = 0
            
            for batch_idx, (tabular, seq, target) in enumerate(train_loader):
                tabular = tabular.to(predictor.device)
                seq = seq.to(predictor.device)
                target = target.to(predictor.device)
                
                optimizer.zero_grad()
                output = predictor.model(tabular, seq)
                loss = criterion(output, target)
                loss.backward()
                optimizer.step()
                
                train_loss += loss.item()
                predicted = (output > 0.5).float()
                train_total += target.size(0)
                train_correct += (predicted == target).sum().item()
            
            # Validation
            predictor.model.eval()
            val_loss = 0
            val_correct = 0
            val_total = 0
            
            with torch.no_grad():
                for tabular, seq, target in val_loader:
                    tabular = tabular.to(predictor.device)
                    seq = seq.to(predictor.device)
                    target = target.to(predictor.device)
                    output = predictor.model(tabular, seq)
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
            
            # Callback
            callback(epoch, avg_train_loss, avg_val_loss, train_acc, val_acc)
            
            # Small delay to prevent blocking
            await asyncio.sleep(0.1)
        
        return history
    
    def _calculate_final_metrics(self, history: Dict[str, list]) -> Dict[str, float]:
        """Calculate final performance metrics"""
        return {
            "final_train_accuracy": float(history['train_acc'][-1]),
            "final_val_accuracy": float(history['val_acc'][-1]),
            "final_train_loss": float(history['train_loss'][-1]),
            "final_val_loss": float(history['val_loss'][-1]),
            "best_val_accuracy": float(max(history['val_acc'])),
            "best_val_loss": float(min(history['val_loss']))
        }
    
    def get_training_status(self, run_id: str) -> Optional[Dict[str, Any]]:
        """Get training job status"""
        return self.training_jobs.get(run_id)
    
    def get_all_runs(self) -> list:
        """Get all training runs"""
        runs = []
        for run_id, job in self.training_jobs.items():
            run_info = {
                "run_id": run_id,
                "created_at": job["start_time"],
                "status": job["status"],
                "file_id": job["file_id"],
                "config": job["config"]
            }
            
            if "metrics" in job:
                run_info["accuracy"] = job["metrics"].get("final_val_accuracy", 0)
            
            runs.append(run_info)
        
        # Sort by creation time (newest first)
        runs.sort(key=lambda x: x["created_at"], reverse=True)
        return runs
    
    def get_training_results(self, run_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed training results"""
        job = self.training_jobs.get(run_id)
        if not job:
            return None
        
        results = {
            "run_id": run_id,
            "status": job["status"],
            "config": job["config"],
            "metrics": job["metrics"],
            "start_time": job["start_time"],
            "end_time": job.get("end_time"),
            "error": job.get("error")
        }
        
        # Load feature importance if available
        if "importance_path" in job and os.path.exists(job["importance_path"]):
            importance_df = pd.read_csv(job["importance_path"])
            results["feature_importance"] = importance_df.head(20).to_dict('records')
        
        return results
