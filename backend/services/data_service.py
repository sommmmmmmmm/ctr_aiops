"""
Data Service - 데이터 처리 및 검증
"""

import pandas as pd
import numpy as np
import os
import uuid
from typing import Dict, Any, Tuple, Optional
import logging

logger = logging.getLogger(__name__)

class DataService:
    def __init__(self, upload_dir: str = "uploaded_files", feature_mapping_path: str = None):
        self.upload_dir = upload_dir
        self.feature_mapping_path = feature_mapping_path
        self.feature_mapping = None
        
        # Create upload directory
        os.makedirs(upload_dir, exist_ok=True)
        
        # Load feature mapping
        if feature_mapping_path and os.path.exists(feature_mapping_path):
            self.feature_mapping = pd.read_csv(feature_mapping_path)
    
    def validate_csv(self, file_path: str) -> Dict[str, Any]:
        """Validate uploaded CSV file"""
        try:
            # Try to read the CSV
            df = pd.read_csv(file_path)
            
            validation_result = {
                "isValid": True,
                "errors": [],
                "warnings": [],
                "info": {}
            }
            
            # Check required columns
            required_columns = ['clicked', 'seq']
            missing_columns = [col for col in required_columns if col not in df.columns]
            
            if missing_columns:
                validation_result["isValid"] = False
                validation_result["errors"].append(f"Missing required columns: {missing_columns}")
            
            # Basic info
            validation_result["info"] = {
                "totalRows": len(df),
                "totalColumns": len(df.columns),
                "missingValues": df.isnull().sum().sum(),
                "missingPercentage": round(df.isnull().sum().sum() / (len(df) * len(df.columns)) * 100, 2),
                "duplicateRows": df.duplicated().sum()
            }
            
            # Check target distribution if clicked column exists
            if 'clicked' in df.columns:
                clicked_counts = df['clicked'].value_counts()
                total_clicked = clicked_counts.sum()
                clicked_one = clicked_counts.get(1, 0)
                clicked_zero = clicked_counts.get(0, 0)
                ctr = round(clicked_one / total_clicked * 100, 2) if total_clicked > 0 else 0
                
                validation_result["info"].update({
                    "clickedOne": int(clicked_one),
                    "clickedZero": int(clicked_zero),
                    "ctr": ctr
                })
                
                # Warning for extreme CTR
                if ctr < 1 or ctr > 50:
                    validation_result["warnings"].append(f"CTR is {ctr}%, which is unusual")
            
            return validation_result
            
        except Exception as e:
            return {
                "isValid": False,
                "errors": [f"Failed to read CSV file: {str(e)}"],
                "warnings": [],
                "info": {}
            }
    
    def upload_file(self, file_content: bytes, filename: str) -> str:
        """Upload file and return file ID"""
        # Generate unique file ID
        file_id = str(uuid.uuid4())
        
        # Create file path
        file_extension = os.path.splitext(filename)[1]
        file_path = os.path.join(self.upload_dir, f"{file_id}{file_extension}")
        
        # Save file
        with open(file_path, 'wb') as f:
            f.write(file_content)
        
        logger.info(f"File uploaded: {filename} -> {file_id}")
        return file_id
    
    def get_file_path(self, file_id: str) -> Optional[str]:
        """Get file path by file ID"""
        for file in os.listdir(self.upload_dir):
            if file.startswith(file_id):
                return os.path.join(self.upload_dir, file)
        return None
    
    def load_data(self, file_id: str, sample_size: Optional[int] = None) -> pd.DataFrame:
        """Load data from uploaded file"""
        file_path = self.get_file_path(file_id)
        if not file_path:
            raise FileNotFoundError(f"File with ID {file_id} not found")
        
        df = pd.read_csv(file_path)
        
        # Sample data if requested
        if sample_size and len(df) > sample_size:
            df = df.sample(n=sample_size, random_state=42).reset_index(drop=True)
        
        return df
    
    def get_data_preview(self, file_id: str, rows: int = 10) -> Dict[str, Any]:
        """Get data preview"""
        file_path = self.get_file_path(file_id)
        if not file_path:
            raise FileNotFoundError(f"File with ID {file_id} not found")
        
        df = pd.read_csv(file_path)
        
        return {
            "preview": df.head(rows).to_dict('records'),
            "columns": list(df.columns),
            "dtypes": df.dtypes.astype(str).to_dict()
        }
    
    def get_feature_mapping(self) -> Optional[pd.DataFrame]:
        """Get feature mapping information"""
        return self.feature_mapping
    
    def get_column_descriptions(self, columns: list) -> Dict[str, str]:
        """Get Korean descriptions for columns"""
        if self.feature_mapping is None:
            return {col: col for col in columns}
        
        descriptions = {}
        for col in columns:
            if col in self.feature_mapping['original_feature'].values:
                desc = self.feature_mapping[
                    self.feature_mapping['original_feature'] == col
                ]['description_kr'].iloc[0]
                descriptions[col] = desc
            else:
                descriptions[col] = col
        
        return descriptions
