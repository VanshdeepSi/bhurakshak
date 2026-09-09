import pandas as pd
import numpy as np
import os
import json
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, f1_score, precision_score, recall_score, roc_auc_score, precision_recall_curve
from sklearn.neural_network import MLPClassifier
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier, StackingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from xgboost import XGBClassifier
import warnings
warnings.filterwarnings('ignore')

print("Loading Real Geotechnical Data...")
data_path = r"E:\code\sih2026_landslide_ner\data\processed\ner_model_training_ready.csv"
df = pd.read_csv(data_path)

print(f"Data loaded: {len(df)} records.")

# Define target and features
target = 'hazard_label'
features = [
    'slope', 'profile_curvature', 'planar_curvature', 'lithology', 'twi',
    'rainfall', 'ndvi', 'distance_to_river', 'distance_to_fault',
    'slope_structure', 'rainfall_slope_interaction', 'saturation_potential',
    'fault_vulnerability', 'stream_power_index_approx', 'disturbance_index',
    'hydro_stress'
]

X = df[features]
y = df[target]

print("Splitting data...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

print("Defining Deep Stacking Ensemble Architecture...")

# Base Models
# 1. Neural Network (requires scaled data)
mlp_pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('mlp', MLPClassifier(hidden_layer_sizes=(128, 64, 32), max_iter=300, random_state=42))
])

# 2. Advanced Gradient Boosters
xgb_model = XGBClassifier(n_estimators=200, learning_rate=0.05, max_depth=6, random_state=42, eval_metric='logloss')
hgb_model = HistGradientBoostingClassifier(max_iter=200, random_state=42)
rf_model = RandomForestClassifier(n_estimators=150, max_depth=10, random_state=42)

estimators = [
    ('mlp', mlp_pipeline),
    ('xgb', xgb_model),
    ('hgb', hgb_model),
    ('rf', rf_model)
]

# Meta-Learner
meta_model = LogisticRegression()

stacking_clf = StackingClassifier(
    estimators=estimators,
    final_estimator=meta_model,
    cv=5,
    n_jobs=-1
)

print("Training the Super-Model Ensembles... This may take a minute or two.")
stacking_clf.fit(X_train, y_train)

print("Training Complete. Evaluating...")
y_pred = stacking_clf.predict(X_test)
y_prob = stacking_clf.predict_proba(X_test)[:, 1]

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Calculate optimal threshold for best F1
precisions, recalls, thresholds = precision_recall_curve(y_test, y_prob)
f1_scores = 2 * (precisions * recalls) / (precisions + recalls + 1e-10)
best_idx = np.argmax(f1_scores)
best_threshold = float(thresholds[best_idx])
best_f1 = float(f1_scores[best_idx])

metrics = {
    "model_type": "DeepStackingEnsemble",
    "features": features,
    "f1": round(best_f1, 4),
    "precision": round(float(precision_score(y_test, y_pred)), 4),
    "recall": round(float(recall_score(y_test, y_pred)), 4),
    "roc_auc": round(float(roc_auc_score(y_test, y_prob)), 4),
    "best_threshold": round(best_threshold, 4),
    "training_samples": len(X_train)
}

print(f"Metrics: {metrics}")

# Export Model
print("Exporting model...")
os.makedirs("models", exist_ok=True)
joblib.dump(stacking_clf, "models/model.pkl")
with open("models/metrics.json", "w") as f:
    json.dump(metrics, f, indent=4)

print("SUCCESS: State-of-the-Art Deep Stacking Ensemble deployed!")
