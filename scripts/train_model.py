"""
School Dropout Prediction Model Training Script

This script demonstrates the ML pipeline for training a dropout prediction model
using Support Vector Machines (SVM), Random Forest, and XGBoost.

Features:
- Data preprocessing (handling missing values, normalization, encoding)
- Multiple algorithm comparison
- AUC-ROC evaluation
- Feature importance analysis
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import roc_auc_score, roc_curve, classification_report
import matplotlib.pyplot as plt

# Generate synthetic dataset for demonstration
np.random.seed(42)
n_samples = 1000

# Create synthetic student data
data = {
    'attendance_rate': np.random.uniform(50, 100, n_samples),
    'gpa': np.random.uniform(1.0, 4.0, n_samples),
    'behavioral_score': np.random.randint(0, 10, n_samples),
    'family_income': np.random.choice(['low', 'medium', 'high'], n_samples),
    'parental_education': np.random.choice(['none', 'highschool', 'college', 'bachelor', 'graduate'], n_samples),
    'absences': np.random.randint(0, 50, n_samples),
    'study_hours': np.random.uniform(0, 40, n_samples),
}

# Create target variable (dropout: 1, retained: 0)
# Higher risk factors increase dropout probability
dropout_prob = (
    (100 - data['attendance_rate']) / 100 * 0.3 +
    (4 - data['gpa']) / 4 * 0.3 +
    data['behavioral_score'] / 10 * 0.2 +
    (data['absences'] / 50) * 0.2
)

data['dropout'] = (dropout_prob + np.random.normal(0, 0.1, n_samples) > 0.5).astype(int)

df = pd.DataFrame(data)

print("Dataset shape:", df.shape)
print("\nClass distribution:")
print(df['dropout'].value_counts())
print("\nSample data:")
print(df.head())

# Data Preprocessing
print("\n" + "="*50)
print("DATA PREPROCESSING")
print("="*50)

# Handle categorical variables
le_income = LabelEncoder()
le_education = LabelEncoder()

df['family_income_encoded'] = le_income.fit_transform(df['family_income'])
df['parental_education_encoded'] = le_education.fit_transform(df['parental_education'])

# Select features
feature_columns = [
    'attendance_rate', 'gpa', 'behavioral_score', 
    'family_income_encoded', 'parental_education_encoded',
    'absences', 'study_hours'
]

X = df[feature_columns]
y = df['dropout']

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Normalize numerical features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print(f"Training set size: {len(X_train)}")
print(f"Test set size: {len(X_test)}")

# Model Training and Evaluation
print("\n" + "="*50)
print("MODEL TRAINING AND EVALUATION")
print("="*50)

models = {
    'SVM': SVC(kernel='rbf', probability=True, random_state=42),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
    'XGBoost': XGBClassifier(n_estimators=100, random_state=42, eval_metric='logloss')
}

results = {}

for name, model in models.items():
    print(f"\n{name}:")
    print("-" * 30)
    
    # Train model
    if name == 'SVM':
        model.fit(X_train_scaled, y_train)
        y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
    else:
        model.fit(X_train, y_train)
        y_pred_proba = model.predict_proba(X_test)[:, 1]
    
    # Calculate AUC-ROC
    auc_score = roc_auc_score(y_test, y_pred_proba)
    print(f"AUC-ROC Score: {auc_score:.4f}")
    
    # Cross-validation
    if name == 'SVM':
        cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5, scoring='roc_auc')
    else:
        cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='roc_auc')
    
    print(f"Cross-validation AUC-ROC: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
    
    results[name] = {
        'model': model,
        'auc': auc_score,
        'y_pred_proba': y_pred_proba
    }

# Feature Importance (Random Forest)
print("\n" + "="*50)
print("FEATURE IMPORTANCE (Random Forest)")
print("="*50)

rf_model = results['Random Forest']['model']
feature_importance = pd.DataFrame({
    'feature': feature_columns,
    'importance': rf_model.feature_importances_
}).sort_values('importance', ascending=False)

print(feature_importance)

# Plot ROC Curves
print("\n" + "="*50)
print("ROC CURVE COMPARISON")
print("="*50)

plt.figure(figsize=(10, 8))

for name, result in results.items():
    fpr, tpr, _ = roc_curve(y_test, result['y_pred_proba'])
    plt.plot(fpr, tpr, label=f"{name} (AUC = {result['auc']:.4f})")

plt.plot([0, 1], [0, 1], 'k--', label='Random Classifier')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC Curves - Dropout Prediction Models')
plt.legend()
plt.grid(True, alpha=0.3)
plt.savefig('roc_curves.png', dpi=300, bbox_inches='tight')
print("ROC curves saved to 'roc_curves.png'")

# Best Model Summary
best_model_name = max(results.items(), key=lambda x: x[1]['auc'])[0]
print("\n" + "="*50)
print("BEST MODEL SUMMARY")
print("="*50)
print(f"Best performing model: {best_model_name}")
print(f"AUC-ROC Score: {results[best_model_name]['auc']:.4f}")

print("\nModel training complete!")
print("\nNext steps:")
print("1. Export the trained model for production use")
print("2. Integrate with the web application API")
print("3. Set up monitoring for model performance")
print("4. Implement regular retraining pipeline")
