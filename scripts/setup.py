"""
Setup script to initialize the ML system
Creates directories, generates data, and trains models
"""

import os
import sys
import subprocess

def create_directories():
    """Create required directories"""
    directories = ['data', 'models', 'logs']
    
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"[v0] Created directory: {directory}")
        else:
            print(f"[v0] Directory already exists: {directory}")

def check_dependencies():
    """Check if required Python packages are installed"""
    required_packages = [
        'pandas', 'numpy', 'sklearn', 'xgboost', 
        'matplotlib', 'seaborn', 'joblib'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"[v0] ✓ {package} is installed")
        except ImportError:
            missing_packages.append(package)
            print(f"[v0] ✗ {package} is NOT installed")
    
    if missing_packages:
        print(f"\n[v0] Missing packages: {', '.join(missing_packages)}")
        print("[v0] Install them with: pip install -r requirements.txt")
        return False
    
    print("\n[v0] All dependencies are installed!")
    return True

def run_preprocessing():
    """Run data preprocessing script"""
    print("\n[v0] Running data preprocessing...")
    try:
        result = subprocess.run(
            [sys.executable, 'scripts/data_preprocessing.py'],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print("[v0] ✓ Data preprocessing completed successfully")
            print(result.stdout)
            return True
        else:
            print("[v0] ✗ Data preprocessing failed")
            print(result.stderr)
            return False
    except Exception as e:
        print(f"[v0] Error running preprocessing: {e}")
        return False

def run_training():
    """Run model training script"""
    print("\n[v0] Running model training...")
    print("[v0] This may take several minutes...")
    
    try:
        result = subprocess.run(
            [sys.executable, 'scripts/train_models.py'],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print("[v0] ✓ Model training completed successfully")
            print(result.stdout)
            return True
        else:
            print("[v0] ✗ Model training failed")
            print(result.stderr)
            return False
    except Exception as e:
        print(f"[v0] Error running training: {e}")
        return False

def verify_setup():
    """Verify that all required files exist"""
    required_files = [
        'data/student_data.csv',
        'data/processed_data.pkl',
        'models/preprocessor.pkl',
        'models/final_model.pkl',
        'models/model_comparison.json'
    ]
    
    print("\n[v0] Verifying setup...")
    all_exist = True
    
    for filepath in required_files:
        if os.path.exists(filepath):
            size = os.path.getsize(filepath)
            print(f"[v0] ✓ {filepath} ({size} bytes)")
        else:
            print(f"[v0] ✗ {filepath} NOT FOUND")
            all_exist = False
    
    return all_exist

def main():
    """Main setup function"""
    print("=" * 60)
    print("Student Dropout Prediction System - Setup")
    print("=" * 60)
    
    # Step 1: Create directories
    print("\n[Step 1/5] Creating directories...")
    create_directories()
    
    # Step 2: Check dependencies
    print("\n[Step 2/5] Checking dependencies...")
    if not check_dependencies():
        print("\n[v0] Setup failed: Missing dependencies")
        print("[v0] Run: pip install -r requirements.txt")
        sys.exit(1)
    
    # Step 3: Run preprocessing
    print("\n[Step 3/5] Preprocessing data...")
    if not run_preprocessing():
        print("\n[v0] Setup failed: Preprocessing error")
        sys.exit(1)
    
    # Step 4: Train models
    print("\n[Step 4/5] Training models...")
    if not run_training():
        print("\n[v0] Setup failed: Training error")
        sys.exit(1)
    
    # Step 5: Verify setup
    print("\n[Step 5/5] Verifying setup...")
    if not verify_setup():
        print("\n[v0] Setup incomplete: Some files are missing")
        sys.exit(1)
    
    print("\n" + "=" * 60)
    print("[v0] ✓ Setup completed successfully!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Start the development server: npm run dev")
    print("2. Open http://localhost:3000 in your browser")
    print("3. Use the prediction form to assess student dropout risk")
    print("\nFor more information, see README.md")

if __name__ == "__main__":
    main()
