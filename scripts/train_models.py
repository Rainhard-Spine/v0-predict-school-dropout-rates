"""
Model Training and Comparison for Student Dropout Prediction
Implements SVM, Random Forest, XGBoost with hyperparameter tuning
"""

import pandas as pd
import numpy as np
import joblib
import json
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from xgboost import XGBClassifier
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV, cross_val_score
from sklearn.metrics import (
    classification_report, confusion_matrix, roc_auc_score,
    roc_curve, precision_recall_curve, accuracy_score
)
import matplotlib.pyplot as plt
import seaborn as sns

class ModelTrainer:
    """Train and compare multiple classification models"""
    
    def __init__(self):
        self.models = {}
        self.results = {}
        self.best_model = None
        self.best_model_name = None
        
    def load_data(self):
        """Load preprocessed data"""
        data = joblib.load('data/processed_data.pkl')
        return data['X_train'], data['X_test'], data['y_train'], data['y_test']
    
    def train_logistic_regression(self, X_train, y_train):
        """Train Logistic Regression with hyperparameter tuning"""
        print("\n[v0] Training Logistic Regression...")
        
        param_grid = {
            'C': [0.001, 0.01, 0.1, 1, 10, 100],
            'penalty': ['l1', 'l2'],
            'solver': ['liblinear', 'saga'],
            'max_iter': [1000]
        }
        
        lr = LogisticRegression(random_state=42)
        grid_search = GridSearchCV(
            lr, param_grid, cv=5, scoring='roc_auc', n_jobs=-1, verbose=1
        )
        grid_search.fit(X_train, y_train)
        
        print(f"[v0] Best Parameters: {grid_search.best_params_}")
        print(f"[v0] Best CV Score: {grid_search.best_score_:.4f}")
        
        return grid_search.best_estimator_
    
    def train_random_forest(self, X_train, y_train):
        """Train Random Forest with hyperparameter tuning"""
        print("\n[v0] Training Random Forest...")
        
        param_grid = {
            'n_estimators': [100, 200, 300],
            'max_depth': [10, 20, 30, None],
            'min_samples_split': [2, 5, 10],
            'min_samples_leaf': [1, 2, 4],
            'max_features': ['sqrt', 'log2']
        }
        
        rf = RandomForestClassifier(random_state=42)
        random_search = RandomizedSearchCV(
            rf, param_grid, n_iter=20, cv=5, scoring='roc_auc',
            n_jobs=-1, verbose=1, random_state=42
        )
        random_search.fit(X_train, y_train)
        
        print(f"[v0] Best Parameters: {random_search.best_params_}")
        print(f"[v0] Best CV Score: {random_search.best_score_:.4f}")
        
        return random_search.best_estimator_
    
    def train_svm(self, X_train, y_train):
        """Train SVM with hyperparameter tuning"""
        print("\n[v0] Training SVM...")
        
        param_grid = {
            'C': [0.1, 1, 10, 100],
            'kernel': ['rbf', 'linear'],
            'gamma': ['scale', 'auto', 0.001, 0.01]
        }
        
        svm = SVC(probability=True, random_state=42)
        grid_search = GridSearchCV(
            svm, param_grid, cv=5, scoring='roc_auc', n_jobs=-1, verbose=1
        )
        grid_search.fit(X_train, y_train)
        
        print(f"[v0] Best Parameters: {grid_search.best_params_}")
        print(f"[v0] Best CV Score: {grid_search.best_score_:.4f}")
        
        return grid_search.best_estimator_
    
    def train_xgboost(self, X_train, y_train):
        """Train XGBoost with hyperparameter tuning"""
        print("\n[v0] Training XGBoost...")
        
        param_grid = {
            'n_estimators': [100, 200, 300],
            'max_depth': [3, 5, 7, 9],
            'learning_rate': [0.01, 0.05, 0.1, 0.2],
            'subsample': [0.8, 0.9, 1.0],
            'colsample_bytree': [0.8, 0.9, 1.0]
        }
        
        xgb = XGBClassifier(random_state=42, eval_metric='logloss')
        random_search = RandomizedSearchCV(
            xgb, param_grid, n_iter=20, cv=5, scoring='roc_auc',
            n_jobs=-1, verbose=1, random_state=42
        )
        random_search.fit(X_train, y_train)
        
        print(f"[v0] Best Parameters: {random_search.best_params_}")
        print(f"[v0] Best CV Score: {random_search.best_score_:.4f}")
        
        return random_search.best_estimator_
    
    def evaluate_model(self, model, X_test, y_test, model_name):
        """Comprehensive model evaluation"""
        print(f"\n[v0] Evaluating {model_name}...")
        
        # Predictions
        y_pred = model.predict(X_test)
        y_pred_proba = model.predict_proba(X_test)[:, 1]
        
        # Metrics
        accuracy = accuracy_score(y_test, y_pred)
        auc_roc = roc_auc_score(y_test, y_pred_proba)
        
        print(f"\n[v0] {model_name} Results:")
        print(f"Accuracy: {accuracy:.4f}")
        print(f"AUC-ROC: {auc_roc:.4f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred, target_names=['Graduate', 'Dropout']))
        
        # Confusion Matrix
        cm = confusion_matrix(y_test, y_pred)
        print("\nConfusion Matrix:")
        print(cm)
        
        # Store results
        self.results[model_name] = {
            'accuracy': accuracy,
            'auc_roc': auc_roc,
            'confusion_matrix': cm.tolist(),
            'classification_report': classification_report(
                y_test, y_pred, target_names=['Graduate', 'Dropout'], output_dict=True
            ),
            'y_pred': y_pred.tolist(),
            'y_pred_proba': y_pred_proba.tolist(),
            'y_test': y_test.tolist()
        }
        
        return accuracy, auc_roc
    
    def plot_feature_importance(self, model, feature_names, model_name):
        """Plot feature importance for tree-based models"""
        if hasattr(model, 'feature_importances_'):
            importances = model.feature_importances_
            indices = np.argsort(importances)[::-1]
            
            plt.figure(figsize=(10, 6))
            plt.title(f'Feature Importance - {model_name}')
            plt.bar(range(len(importances)), importances[indices])
            plt.xticks(range(len(importances)), [feature_names[i] for i in indices], rotation=45, ha='right')
            plt.tight_layout()
            plt.savefig(f'models/{model_name.lower().replace(" ", "_")}_feature_importance.png')
            plt.close()
            
            print(f"\n[v0] Top 5 Important Features for {model_name}:")
            for i in range(min(5, len(importances))):
                print(f"{i+1}. {feature_names[indices[i]]}: {importances[indices[i]]:.4f}")
            
            # Store feature importance
            self.results[model_name]['feature_importance'] = {
                feature_names[i]: float(importances[i]) for i in range(len(importances))
            }
    
    def plot_roc_curves(self):
        """Plot ROC curves for all models"""
        plt.figure(figsize=(10, 8))
        
        for model_name, results in self.results.items():
            fpr, tpr, _ = roc_curve(results['y_test'], results['y_pred_proba'])
            auc = results['auc_roc']
            plt.plot(fpr, tpr, label=f'{model_name} (AUC = {auc:.3f})')
        
        plt.plot([0, 1], [0, 1], 'k--', label='Random Classifier')
        plt.xlabel('False Positive Rate')
        plt.ylabel('True Positive Rate')
        plt.title('ROC Curves - Model Comparison')
        plt.legend()
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.savefig('models/roc_curves_comparison.png')
        plt.close()
        
        print("\n[v0] ROC curves saved to models/roc_curves_comparison.png")
    
    def train_all_models(self):
        """Train and compare all models"""
        # Load data
        X_train, X_test, y_train, y_test = self.load_data()
        
        # Load feature names
        preprocessor_state = joblib.load('models/preprocessor.pkl')
        feature_names = preprocessor_state['feature_names']
        
        # Train models
        self.models['Logistic Regression'] = self.train_logistic_regression(X_train, y_train)
        self.models['Random Forest'] = self.train_random_forest(X_train, y_train)
        self.models['SVM'] = self.train_svm(X_train, y_train)
        self.models['XGBoost'] = self.train_xgboost(X_train, y_train)
        
        # Evaluate all models
        best_auc = 0
        for model_name, model in self.models.items():
            accuracy, auc_roc = self.evaluate_model(model, X_test, y_test, model_name)
            
            # Plot feature importance for tree-based models
            if model_name in ['Random Forest', 'XGBoost']:
                self.plot_feature_importance(model, feature_names, model_name)
            
            # Track best model
            if auc_roc > best_auc:
                best_auc = auc_roc
                self.best_model = model
                self.best_model_name = model_name
        
        # Plot ROC curves
        self.plot_roc_curves()
        
        # Save best model
        print(f"\n[v0] Best Model: {self.best_model_name} (AUC-ROC: {best_auc:.4f})")
        joblib.dump(self.best_model, 'models/final_model.pkl')
        print("[v0] Best model saved to models/final_model.pkl")
        
        # Save all results
        with open('models/model_comparison.json', 'w') as f:
            # Convert numpy types to native Python types
            results_serializable = {}
            for model_name, results in self.results.items():
                results_serializable[model_name] = {
                    'accuracy': float(results['accuracy']),
                    'auc_roc': float(results['auc_roc']),
                    'confusion_matrix': results['confusion_matrix'],
                    'classification_report': results['classification_report']
                }
                if 'feature_importance' in results:
                    results_serializable[model_name]['feature_importance'] = results['feature_importance']
            
            json.dump({
                'best_model': self.best_model_name,
                'results': results_serializable
            }, f, indent=2)
        
        print("[v0] Model comparison saved to models/model_comparison.json")
        
        return self.best_model, self.best_model_name

if __name__ == "__main__":
    trainer = ModelTrainer()
    best_model, best_model_name = trainer.train_all_models()
    print(f"\n[v0] Training complete! Best model: {best_model_name}")
