"""
Inference script for making predictions with trained model
Loads the saved model and preprocessor for real-time predictions
"""

import joblib
import numpy as np
import pandas as pd
import sys
import json

class DropoutPredictor:
    """Load trained model and make predictions"""
    
    def __init__(self, model_path='models/final_model.pkl', preprocessor_path='models/preprocessor.pkl'):
        """Initialize predictor with saved model and preprocessor"""
        try:
            self.model = joblib.load(model_path)
            preprocessor_state = joblib.load(preprocessor_path)
            
            self.scaler = preprocessor_state['scaler']
            self.label_encoders = preprocessor_state['label_encoders']
            self.feature_names = preprocessor_state['feature_names']
            
            print(f"[v0] Model loaded successfully from {model_path}", file=sys.stderr)
            print(f"[v0] Expected features: {self.feature_names}", file=sys.stderr)
            
        except FileNotFoundError as e:
            print(f"[v0] Error: Model files not found. Please run train_models.py first.", file=sys.stderr)
            raise e
    
    def preprocess_input(self, input_data):
        """Preprocess input data for prediction"""
        # Convert to DataFrame
        df = pd.DataFrame([input_data])
        
        # Encode categorical variables
        for col, encoder in self.label_encoders.items():
            if col in df.columns:
                try:
                    df[col] = encoder.transform(df[col])
                except ValueError:
                    # Handle unseen categories
                    print(f"[v0] Warning: Unseen category in {col}, using most frequent", file=sys.stderr)
                    df[col] = encoder.transform([encoder.classes_[0]])[0]
        
        # Ensure correct feature order
        df = df[self.feature_names]
        
        # Scale features
        X_scaled = self.scaler.transform(df)
        
        return X_scaled
    
    def predict(self, input_data):
        """Make prediction for a single student"""
        # Preprocess input
        X = self.preprocess_input(input_data)
        
        # Get prediction and probability
        prediction = self.model.predict(X)[0]
        probability = self.model.predict_proba(X)[0]
        
        # Determine risk level
        dropout_prob = probability[1]
        if dropout_prob >= 0.7:
            risk_level = "High"
        elif dropout_prob >= 0.4:
            risk_level = "Medium"
        else:
            risk_level = "Low"
        
        # Generate recommendations
        recommendations = self.generate_recommendations(input_data, dropout_prob)
        
        return {
            'prediction': int(prediction),
            'dropout_probability': float(dropout_prob),
            'graduate_probability': float(probability[0]),
            'risk_level': risk_level,
            'recommendations': recommendations
        }
    
    def generate_recommendations(self, input_data, dropout_prob):
        """Generate personalized intervention recommendations"""
        recommendations = []
        
        # Attendance-based recommendations
        if input_data.get('attendance_rate', 1.0) < 0.85:
            recommendations.append({
                'category': 'Attendance',
                'priority': 'High',
                'action': 'Implement attendance monitoring and family outreach program',
                'description': 'Low attendance is a strong predictor of dropout risk'
            })
        
        # GPA-based recommendations
        avg_gpa = (input_data.get('gpa_semester1', 4.0) + input_data.get('gpa_semester2', 4.0)) / 2
        if avg_gpa < 2.5:
            recommendations.append({
                'category': 'Academic',
                'priority': 'High',
                'action': 'Provide intensive academic tutoring and mentorship support',
                'description': 'Student is struggling academically and needs immediate intervention'
            })
        elif avg_gpa < 3.0:
            recommendations.append({
                'category': 'Academic',
                'priority': 'Medium',
                'action': 'Offer supplemental instruction and study skills workshops',
                'description': 'Student could benefit from additional academic support'
            })
        
        # Behavioral recommendations
        if input_data.get('behavioral_issues', 0) > 3:
            recommendations.append({
                'category': 'Behavioral',
                'priority': 'High',
                'action': 'Refer to counseling services and behavioral intervention program',
                'description': 'Behavioral issues may indicate underlying challenges'
            })
        
        # Socioeconomic recommendations
        if input_data.get('family_income', 'High') == 'Low':
            recommendations.append({
                'category': 'Support Services',
                'priority': 'Medium',
                'action': 'Connect family with financial aid and community resources',
                'description': 'Financial stress can impact student success'
            })
        
        # Engagement recommendations
        if input_data.get('extracurricular', 5) < 2:
            recommendations.append({
                'category': 'Engagement',
                'priority': 'Medium',
                'action': 'Encourage participation in extracurricular activities',
                'description': 'School engagement is protective against dropout'
            })
        
        # Study habits
        if input_data.get('study_hours_weekly', 20) < 10:
            recommendations.append({
                'category': 'Study Skills',
                'priority': 'Medium',
                'action': 'Provide time management and study skills training',
                'description': 'Insufficient study time may lead to academic struggles'
            })
        
        # Default recommendations for low-risk students
        if dropout_prob < 0.3 and len(recommendations) == 0:
            recommendations.append({
                'category': 'Monitoring',
                'priority': 'Low',
                'action': 'Continue regular progress monitoring',
                'description': 'Student is on track but should be monitored'
            })
            recommendations.append({
                'category': 'Engagement',
                'priority': 'Low',
                'action': 'Maintain regular communication with family',
                'description': 'Keep family engaged in student success'
            })
        
        return recommendations
    
    def batch_predict(self, input_data_list):
        """Make predictions for multiple students"""
        results = []
        for input_data in input_data_list:
            try:
                result = self.predict(input_data)
                results.append(result)
            except Exception as e:
                print(f"[v0] Error predicting for student: {e}", file=sys.stderr)
                results.append({'error': str(e)})
        
        return results

if __name__ == "__main__":
    # Example usage
    predictor = DropoutPredictor()
    
    # Test prediction
    test_student = {
        'age': 16,
        'gender': 'Female',
        'attendance_rate': 0.75,
        'gpa_semester1': 2.1,
        'gpa_semester2': 2.3,
        'parent_education': 'High School',
        'family_income': 'Low',
        'extracurricular': 1,
        'study_hours_weekly': 8,
        'absences': 15,
        'behavioral_issues': 5,
        'previous_failures': 1
    }
    
    result = predictor.predict(test_student)
    print(json.dumps(result, indent=2))
