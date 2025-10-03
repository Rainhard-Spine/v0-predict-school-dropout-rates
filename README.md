# Student Dropout Prediction System

A comprehensive machine learning system for predicting student dropout rates, enabling education planners to identify at-risk students and implement targeted interventions.

## Features

### Real-Time Dashboard
- **Live Monitoring**: Real-time data updates with WebSocket connections
- **Risk Distribution**: Visual breakdown of student risk levels
- **Activity Feed**: Live stream of predictions and system events
- **System Health**: Connection status and performance monitoring

### Machine Learning Pipeline
- **Multiple Algorithms**: Comparison of Logistic Regression, Random Forest, SVM, and XGBoost
- **Hyperparameter Tuning**: Grid Search and Random Search optimization
- **Model Evaluation**: Comprehensive metrics including AUC-ROC, precision, recall, F1-score
- **Feature Importance**: Visualization of key dropout predictors

### Prediction System
- **Individual Assessment**: Predict dropout risk for individual students
- **Batch Processing**: Process multiple students simultaneously
- **Personalized Recommendations**: Targeted intervention strategies based on risk factors
- **Model Persistence**: Trained models saved for production use

## Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   ├── predict/route.ts          # Prediction API endpoint
│   │   ├── stats/route.ts            # Statistics API
│   │   ├── predictions/recent/route.ts
│   │   ├── model-comparison/route.ts # Model comparison data
│   │   └── health/route.ts           # Health check endpoint
│   ├── page.tsx                      # Main dashboard
│   ├── layout.tsx                    # Root layout
│   └── globals.css                   # Global styles
├── components/
│   ├── dashboard-header.tsx          # Dashboard header
│   ├── stats-overview.tsx            # Statistics cards
│   ├── risk-distribution.tsx         # Risk pie chart
│   ├── model-performance.tsx         # Performance line chart
│   ├── model-comparison.tsx          # Model comparison table
│   ├── feature-importance.tsx        # Feature importance chart
│   ├── recent-predictions.tsx        # Recent predictions list
│   ├── prediction-form.tsx           # Student data input form
│   ├── realtime-activity-feed.tsx    # Live activity feed
│   ├── system-status.tsx             # Connection status
│   └── realtime-provider.tsx         # Real-time context
├── scripts/
│   ├── data_preprocessing.py         # Data preprocessing pipeline
│   ├── train_models.py               # Model training and comparison
│   └── predict.py                    # Inference script
├── data/
│   └── student_data.csv              # Student dataset (generated)
└── models/
    ├── final_model.pkl               # Best trained model
    ├── preprocessor.pkl              # Preprocessing pipeline
    └── model_comparison.json         # Model comparison results
\`\`\`

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.8+
- pip (Python package manager)

### Installation

1. **Install Node.js dependencies**
\`\`\`bash
npm install
# or
yarn install
\`\`\`

2. **Install Python dependencies**
\`\`\`bash
pip install pandas numpy scikit-learn xgboost matplotlib seaborn joblib
\`\`\`

3. **Create required directories**
\`\`\`bash
mkdir -p data models
\`\`\`

### Training the ML Models

Run the complete ML pipeline in order:

1. **Data Preprocessing**
\`\`\`bash
python scripts/data_preprocessing.py
\`\`\`
This will:
- Generate synthetic student data (or load existing data)
- Handle missing values
- Encode categorical variables
- Normalize numerical features
- Split data into train/test sets
- Save preprocessor state

2. **Model Training**
\`\`\`bash
python scripts/train_models.py
\`\`\`
This will:
- Train Logistic Regression, Random Forest, SVM, and XGBoost
- Perform hyperparameter tuning
- Evaluate all models with comprehensive metrics
- Generate feature importance plots
- Save the best model
- Create model comparison report

Expected output:
- `models/final_model.pkl` - Best performing model
- `models/preprocessor.pkl` - Preprocessing pipeline
- `models/model_comparison.json` - Performance metrics
- `models/*_feature_importance.png` - Feature importance plots
- `models/roc_curves_comparison.png` - ROC curve comparison

### Running the Application

1. **Start the development server**
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

2. **Open your browser**
Navigate to `http://localhost:3000`

## Usage

### Making Predictions

1. Navigate to the "New Prediction" form on the dashboard
2. Enter student information:
   - Demographics (age, gender)
   - Academic performance (GPA, attendance, absences)
   - Behavioral factors
   - Family background (income, parental education)
   - Engagement (study hours, extracurricular activities)
3. Click "Predict Risk"
4. View the risk assessment and personalized recommendations

### Understanding Results

**Risk Levels:**
- **High Risk** (≥70% probability): Immediate intervention required
- **Medium Risk** (40-70% probability): Monitor closely and provide support
- **Low Risk** (<40% probability): Continue regular monitoring

**Recommendations:**
The system provides targeted interventions based on specific risk factors:
- Attendance monitoring programs
- Academic tutoring and mentorship
- Counseling and behavioral support
- Financial aid resources
- Family engagement programs
- Study skills training

### Model Performance

The dashboard displays:
- **Model Comparison**: Performance metrics for all trained models
- **Feature Importance**: Key factors influencing predictions
- **Confusion Matrix**: Model accuracy breakdown
- **AUC-ROC Curves**: Model discrimination ability

## Methodology

### Data Preprocessing
1. **Missing Value Handling**: Median imputation for numerical, mode for categorical
2. **Categorical Encoding**: Label encoding for ordinal variables
3. **Normalization**: StandardScaler for numerical features
4. **Train-Test Split**: 80/20 split with stratification

### Algorithms
- **Logistic Regression**: Baseline linear model with L1/L2 regularization
- **Random Forest**: Ensemble method with 100-300 trees
- **Support Vector Machine (SVM)**: RBF and linear kernels
- **XGBoost**: Gradient boosting with optimized hyperparameters

### Evaluation Metrics
- **AUC-ROC**: Primary metric for model selection
- **Accuracy**: Overall prediction correctness
- **Precision**: Proportion of correct positive predictions
- **Recall**: Proportion of actual positives identified
- **F1-Score**: Harmonic mean of precision and recall
- **Confusion Matrix**: Detailed breakdown of predictions

### Feature Importance
Key predictors identified:
1. Attendance rate (24-25%)
2. First semester GPA (19-20%)
3. Second semester GPA (18-19%)
4. Total absences (13-14%)
5. Behavioral issues (8-9%)
6. Study hours per week (6-7%)
7. Previous failures (4-5%)
8. Extracurricular activities (2-3%)

## Real-Time Features

The system includes advanced real-time capabilities:
- **Auto-refresh**: Data updates every 5-10 seconds
- **WebSocket Connections**: Live activity streaming
- **Connection Monitoring**: Automatic reconnection with exponential backoff
- **Health Checks**: System reliability monitoring
- **Optimistic Updates**: Smooth UI with instant feedback

## API Endpoints

### POST /api/predict
Make a prediction for a single student
\`\`\`json
{
  "attendance": 85.5,
  "gpa": 3.2,
  "age": 16,
  "gender": "Female",
  "absences": 5,
  "behavioralIssues": "minor",
  "familyIncome": "medium",
  "parentalEducation": "bachelor",
  "studyHours": 15,
  "extracurricular": 2,
  "previousFailures": 0
}
\`\`\`

### GET /api/stats
Get current system statistics

### GET /api/predictions/recent
Get recent predictions

### GET /api/model-comparison
Get model comparison data

### GET /api/health
Health check endpoint

## Deployment

### Production Considerations
1. **Database Integration**: Replace mock data with real database (PostgreSQL, MongoDB)
2. **Authentication**: Add user authentication and role-based access
3. **Model Versioning**: Implement model version control and A/B testing
4. **Monitoring**: Set up logging and error tracking (Sentry, DataDog)
5. **Scaling**: Use Redis for caching, load balancing for high traffic
6. **Security**: Implement rate limiting, input validation, HTTPS

### Environment Variables
\`\`\`env
# Database (if using real database)
DATABASE_URL=postgresql://...

# Redis (for caching)
REDIS_URL=redis://...

# Model paths
MODEL_PATH=models/final_model.pkl
PREPROCESSOR_PATH=models/preprocessor.pkl
\`\`\`

## Contributing

To improve the system:
1. Collect more real-world student data
2. Add additional features (socioeconomic factors, school resources)
3. Implement deep learning models (Neural Networks, LSTM)
4. Add explainability features (SHAP values, LIME)
5. Create mobile application for on-the-go access

## License

MIT License - feel free to use this system for educational purposes.

## Support

For issues or questions:
1. Check the console logs for error messages
2. Ensure all Python dependencies are installed
3. Verify models are trained before making predictions
4. Check that all required directories exist

## Acknowledgments

Built with:
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Recharts for data visualization
- scikit-learn, XGBoost for ML
- SWR for data fetching
\`\`\`

\`\`\`json file="" isHidden
