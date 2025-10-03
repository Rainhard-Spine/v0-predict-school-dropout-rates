# Quick Start Guide

Get your Student Dropout Prediction System up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Python 3.8+ installed
- 5-10 minutes of time

## Installation Steps

### 1. Install Dependencies

**Node.js packages:**
\`\`\`bash
npm install
\`\`\`

**Python packages:**
\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 2. Run Setup Script

This will create directories, generate data, and train all models:

\`\`\`bash
python scripts/setup.py
\`\`\`

Expected output:
- ✓ Creates data/ and models/ directories
- ✓ Generates 1000 synthetic student records
- ✓ Trains 4 ML models (Logistic Regression, Random Forest, SVM, XGBoost)
- ✓ Saves best model and preprocessing pipeline
- ✓ Creates model comparison report

**This takes 3-5 minutes** depending on your system.

### 3. Start the Application

\`\`\`bash
npm run dev
\`\`\`

### 4. Open Your Browser

Navigate to: **http://localhost:3000**

## What You'll See

### Dashboard Overview
- **Stats Cards**: Total students, risk levels, interventions
- **Risk Distribution**: Pie chart of risk levels
- **Model Performance**: Accuracy and AUC-ROC over time
- **Feature Importance**: Key dropout predictors
- **Model Comparison**: Performance of all trained models
- **Recent Predictions**: Latest risk assessments
- **Activity Feed**: Real-time system events

### Making Your First Prediction

1. Find the **"New Prediction"** form on the right side
2. Enter student information:
   - Age: 16
   - Gender: Female
   - Attendance: 75%
   - GPA: 2.3
   - Absences: 15
   - Behavioral Issues: Moderate
   - Family Income: Low
   - Parental Education: High School
   - Study Hours: 8
   - Extracurricular: 1
   - Previous Failures: 1

3. Click **"Predict Risk"**

4. View results:
   - Risk Level (High/Medium/Low)
   - Dropout Probability
   - Personalized Recommendations

## Understanding the Results

### Risk Levels
- 🔴 **High Risk** (≥70%): Immediate intervention needed
- 🟡 **Medium Risk** (40-70%): Close monitoring required
- 🟢 **Low Risk** (<40%): Regular monitoring

### Recommendations
The system provides targeted interventions:
- Attendance monitoring programs
- Academic tutoring
- Counseling services
- Financial aid resources
- Family engagement programs

## Advanced Usage

### Batch Predictions

Process multiple students from a CSV file:

\`\`\`bash
python scripts/batch_predict.py data/students.csv results/predictions.json
\`\`\`

### Retrain Models

Update models with new data:

\`\`\`bash
# 1. Add new data to data/student_data.csv
# 2. Run preprocessing
python scripts/data_preprocessing.py

# 3. Retrain models
python scripts/train_models.py
\`\`\`

### View Model Comparison

Check which model performs best:

\`\`\`bash
cat models/model_comparison.json
\`\`\`

## Troubleshooting

### Python Model Not Loading
**Error**: "Model files not found"

**Solution**:
\`\`\`bash
python scripts/setup.py
\`\`\`

### Missing Dependencies
**Error**: "ModuleNotFoundError"

**Solution**:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

### Port Already in Use
**Error**: "Port 3000 is already in use"

**Solution**:
\`\`\`bash
# Use a different port
PORT=3001 npm run dev
\`\`\`

## Next Steps

1. **Explore the Dashboard**: Check out all the visualizations
2. **Try Different Scenarios**: Test various student profiles
3. **Review Model Performance**: Compare algorithm results
4. **Read Full Documentation**: See README.md for details
5. **Customize**: Modify features, add new models, integrate real data

## Need Help?

- Check **README.md** for detailed documentation
- Review **scripts/** for implementation details
- Check console logs for error messages
- Ensure all dependencies are installed

## Production Deployment

Ready to deploy? See README.md section on "Deployment" for:
- Database integration
- Authentication setup
- Environment variables
- Scaling considerations
- Security best practices

---

**Congratulations!** 🎉 Your ML system is ready to help identify at-risk students and enable targeted interventions.
\`\`\`
