"""
Data Preprocessing Pipeline for Student Dropout Prediction
Handles data loading, cleaning, normalization, and encoding
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
import joblib
import json

class DataPreprocessor:
    """Reusable preprocessing pipeline for training and inference"""
    
    def __init__(self):
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.feature_names = []
        self.is_fitted = False
        
    def load_data(self, filepath='data/student_data.csv'):
        """Load student dataset from CSV"""
        try:
            df = pd.read_csv(filepath)
            print(f"[v0] Loaded {len(df)} records from {filepath}")
            return df
        except FileNotFoundError:
            print(f"[v0] Dataset not found. Generating synthetic data...")
            return self.generate_synthetic_data()
    
    def generate_synthetic_data(self, n_samples=1000):
        """Generate synthetic student data for demonstration"""
        np.random.seed(42)
        
        data = {
            'student_id': range(1, n_samples + 1),
            'age': np.random.randint(14, 19, n_samples),
            'gender': np.random.choice(['Male', 'Female'], n_samples),
            'attendance_rate': np.random.uniform(0.5, 1.0, n_samples),
            'gpa_semester1': np.random.uniform(1.0, 4.0, n_samples),
            'gpa_semester2': np.random.uniform(1.0, 4.0, n_samples),
            'parent_education': np.random.choice(['High School', 'Bachelor', 'Master', 'PhD'], n_samples),
            'family_income': np.random.choice(['Low', 'Medium', 'High'], n_samples),
            'extracurricular': np.random.randint(0, 5, n_samples),
            'study_hours_weekly': np.random.randint(0, 40, n_samples),
            'absences': np.random.randint(0, 30, n_samples),
            'behavioral_issues': np.random.randint(0, 10, n_samples),
            'previous_failures': np.random.randint(0, 4, n_samples),
        }
        
        # Create target variable based on risk factors
        dropout_prob = (
            (1 - data['attendance_rate']) * 0.3 +
            (4 - np.array(data['gpa_semester1'])) / 4 * 0.25 +
            (4 - np.array(data['gpa_semester2'])) / 4 * 0.25 +
            np.array(data['absences']) / 30 * 0.1 +
            np.array(data['behavioral_issues']) / 10 * 0.1
        )
        
        data['dropout'] = (dropout_prob > 0.5).astype(int)
        
        df = pd.DataFrame(data)
        
        # Save synthetic data
        df.to_csv('data/student_data.csv', index=False)
        print(f"[v0] Generated and saved {n_samples} synthetic records")
        
        return df
    
    def handle_missing_values(self, df):
        """Handle missing values in the dataset"""
        # Numerical columns: fill with median
        numerical_cols = df.select_dtypes(include=[np.number]).columns
        for col in numerical_cols:
            if df[col].isnull().any():
                df[col].fillna(df[col].median(), inplace=True)
        
        # Categorical columns: fill with mode
        categorical_cols = df.select_dtypes(include=['object']).columns
        for col in categorical_cols:
            if df[col].isnull().any():
                df[col].fillna(df[col].mode()[0], inplace=True)
        
        return df
    
    def encode_categorical(self, df, fit=True):
        """Encode categorical variables"""
        categorical_cols = df.select_dtypes(include=['object']).columns
        
        for col in categorical_cols:
            if col == 'student_id':
                continue
                
            if fit:
                self.label_encoders[col] = LabelEncoder()
                df[col] = self.label_encoders[col].fit_transform(df[col])
            else:
                if col in self.label_encoders:
                    df[col] = self.label_encoders[col].transform(df[col])
        
        return df
    
    def normalize_features(self, X, fit=True):
        """Normalize numerical features"""
        if fit:
            X_scaled = self.scaler.fit_transform(X)
        else:
            X_scaled = self.scaler.transform(X)
        
        return pd.DataFrame(X_scaled, columns=X.columns, index=X.index)
    
    def preprocess(self, df, target_col='dropout', fit=True):
        """Complete preprocessing pipeline"""
        # Handle missing values
        df = self.handle_missing_values(df)
        
        # Separate features and target
        if target_col in df.columns:
            y = df[target_col]
            X = df.drop([target_col, 'student_id'], axis=1, errors='ignore')
        else:
            y = None
            X = df.drop(['student_id'], axis=1, errors='ignore')
        
        # Encode categorical variables
        X = self.encode_categorical(X, fit=fit)
        
        # Store feature names
        if fit:
            self.feature_names = X.columns.tolist()
            self.is_fitted = True
        
        # Normalize features
        X = self.normalize_features(X, fit=fit)
        
        return X, y
    
    def save(self, filepath='models/preprocessor.pkl'):
        """Save preprocessor state"""
        joblib.dump({
            'scaler': self.scaler,
            'label_encoders': self.label_encoders,
            'feature_names': self.feature_names,
            'is_fitted': self.is_fitted
        }, filepath)
        print(f"[v0] Preprocessor saved to {filepath}")
    
    def load(self, filepath='models/preprocessor.pkl'):
        """Load preprocessor state"""
        state = joblib.load(filepath)
        self.scaler = state['scaler']
        self.label_encoders = state['label_encoders']
        self.feature_names = state['feature_names']
        self.is_fitted = state['is_fitted']
        print(f"[v0] Preprocessor loaded from {filepath}")
    
    def preprocess_single_input(self, input_data):
        """Preprocess a single student record for prediction"""
        if not self.is_fitted:
            raise ValueError("Preprocessor must be fitted before processing input")
        
        # Convert input to DataFrame
        df = pd.DataFrame([input_data])
        
        # Preprocess
        X, _ = self.preprocess(df, fit=False)
        
        return X

if __name__ == "__main__":
    # Test preprocessing pipeline
    preprocessor = DataPreprocessor()
    df = preprocessor.load_data()
    
    print("\n[v0] Dataset Info:")
    print(df.info())
    print("\n[v0] Target Distribution:")
    print(df['dropout'].value_counts())
    
    # Preprocess data
    X, y = preprocessor.preprocess(df)
    
    print(f"\n[v0] Preprocessed Features Shape: {X.shape}")
    print(f"[v0] Feature Names: {preprocessor.feature_names}")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"\n[v0] Training Set: {X_train.shape}")
    print(f"[v0] Test Set: {X_test.shape}")
    
    # Save preprocessor
    preprocessor.save()
    
    # Save processed data
    joblib.dump({
        'X_train': X_train,
        'X_test': X_test,
        'y_train': y_train,
        'y_test': y_test
    }, 'data/processed_data.pkl')
    
    print("\n[v0] Preprocessing complete!")
