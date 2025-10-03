"""
Batch prediction script for processing multiple students
Useful for processing entire classes or schools
"""

import pandas as pd
import sys
import json
from predict import DropoutPredictor

def load_students_from_csv(filepath):
    """Load student data from CSV file"""
    try:
        df = pd.read_csv(filepath)
        print(f"[v0] Loaded {len(df)} students from {filepath}", file=sys.stderr)
        return df
    except FileNotFoundError:
        print(f"[v0] Error: File not found: {filepath}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"[v0] Error loading file: {e}", file=sys.stderr)
        sys.exit(1)

def process_batch(predictor, students_df):
    """Process batch of students and return results"""
    results = []
    
    for idx, row in students_df.iterrows():
        student_data = row.to_dict()
        
        try:
            prediction = predictor.predict(student_data)
            
            results.append({
                'student_id': student_data.get('student_id', idx),
                'risk_level': prediction['risk_level'],
                'dropout_probability': prediction['dropout_probability'],
                'graduate_probability': prediction['graduate_probability'],
                'top_recommendations': [r['action'] for r in prediction['recommendations'][:3]]
            })
            
            if (idx + 1) % 100 == 0:
                print(f"[v0] Processed {idx + 1}/{len(students_df)} students", file=sys.stderr)
                
        except Exception as e:
            print(f"[v0] Error processing student {idx}: {e}", file=sys.stderr)
            results.append({
                'student_id': student_data.get('student_id', idx),
                'error': str(e)
            })
    
    return results

def save_results(results, output_path):
    """Save results to CSV and JSON"""
    # Save as CSV
    csv_path = output_path.replace('.json', '.csv')
    df = pd.DataFrame(results)
    df.to_csv(csv_path, index=False)
    print(f"[v0] Results saved to {csv_path}", file=sys.stderr)
    
    # Save as JSON
    with open(output_path, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"[v0] Results saved to {output_path}", file=sys.stderr)

def generate_summary(results):
    """Generate summary statistics"""
    df = pd.DataFrame(results)
    
    if 'error' in df.columns:
        errors = df['error'].notna().sum()
        print(f"\n[v0] Errors: {errors}", file=sys.stderr)
    
    if 'risk_level' in df.columns:
        risk_counts = df['risk_level'].value_counts()
        
        print("\n[v0] Risk Level Distribution:", file=sys.stderr)
        for level, count in risk_counts.items():
            percentage = (count / len(df)) * 100
            print(f"  {level}: {count} ({percentage:.1f}%)", file=sys.stderr)
        
        avg_dropout_prob = df['dropout_probability'].mean()
        print(f"\n[v0] Average Dropout Probability: {avg_dropout_prob:.2%}", file=sys.stderr)
        
        high_risk = df[df['risk_level'] == 'High']
        print(f"[v0] High Risk Students: {len(high_risk)} ({len(high_risk)/len(df)*100:.1f}%)", file=sys.stderr)

def main():
    """Main batch prediction function"""
    if len(sys.argv) < 2:
        print("Usage: python batch_predict.py <input_csv> [output_json]", file=sys.stderr)
        print("Example: python batch_predict.py data/students.csv results/predictions.json", file=sys.stderr)
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) > 2 else 'results/batch_predictions.json'
    
    print("[v0] Starting batch prediction...", file=sys.stderr)
    
    # Load predictor
    predictor = DropoutPredictor()
    
    # Load students
    students_df = load_students_from_csv(input_path)
    
    # Process batch
    results = process_batch(predictor, students_df)
    
    # Save results
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    save_results(results, output_path)
    
    # Generate summary
    generate_summary(results)
    
    print("\n[v0] Batch prediction completed!", file=sys.stderr)

if __name__ == "__main__":
    import os
    main()
